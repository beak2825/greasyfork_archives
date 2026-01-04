// ==UserScript==
// @name         Panel dodatkow obciego
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Panel dodatkow margo
// @author       obci
// @match        http*://narwhals.margonem.pl/*
// @match        http*://valhalla.margonem.pl/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470265/Panel%20dodatkow%20obciego.user.js
// @updateURL https://update.greasyfork.org/scripts/470265/Panel%20dodatkow%20obciego.meta.js
// ==/UserScript==

//zmienne do odbierania kalendarza
var kalendarzon = false;
var datadokalnedarza = new Date().getUTCDate()-8; 

const sds = new Date();
sds.setTime(sds.getTime() + 31536000000);

// narwhals
if (location.host.split(".")[0] == "narwhals"){
  listaherosow1 = [
    'Zły Przewodnik','Piekielny Kościej','Opętany Paladyn','Kochanka Nocy','Ksiaze Kasim',
    'Baca bez Łowiec','Lichwiarz Grauhaz','Obłąkany Łowca orków','Czarująca Atalia','Święty Braciszek',
    'Viviana Nandin','Mulher Ma','Demonis Pan Nicości','Tepeyollotl','Negthotep Czarny Kaplan','Młody smok'
  ];
var dcdoherosa1 =
"https://disc"+"ord.com/api/webhooks/1075736378538725426/9UkueXBX5zjhN5g8_4WpLPbeW9AIypYzesjfJxVJgh-oxpDcHgPG9auBVR_BNRpMdL73";
var dcdotytana1 =
"https://disc"+"ord.com/api/webhooks/1075736629190348832/7SnpDWreu4DV0tLYCsuwJ38YoLjmn4AChfbtN4P3K__TegC7kLBvEr6GSMoYTtiOSa_V";
var dcdokolosa1 =
"https://disc"+"ord.com/api/webhooks/1075736523523248168/M8Vf0L8YH1bILt_pY5Pu8GAzZbEHBsZfG7MdSIudT5j68dmM0mG6ZG8Yhyf2-7FTM58s";
var dcdolegi1 = "";

setCookie("addons", "https://grooove.pl/m/m.js?c=blade_of_destiny_narwhals", sds);
}
// valhalla
else
{
  listaherosow1 = [
    "Mroczny Patryk",
    "Karmazynowy Mściciel",
    "Złodziej",
    "Zły Przewodnik",
    "Piekielny Kościej",
    "Opętany Paladyn",
    "Mulher Ma",
    "Demonis Pan Nicości",
  ];
var dcdoherosa1 =
"https://dis"+"cord.com/api/webhooks/1094520042915381298/Mio0dWrIgzNdq9GJkdr-V10Fa8bZOvfj0z8tqt9u07E1PhHHH21tZejHDglS3LeQ8E3N";
var dcdotytana1 =
"https://dis"+"cord.com/api/webhooks/1094520155217862726/0IQtO6NYJOPB-iwbMoZ-SM9n1GFKNekyidRt1O6me6TRnBYP6I_hTRu4SIozAAJuRdiV";
var dcdokolosa1 =
"https://disc"+"ord.com/api/webhooks/1094520205960556604/Roi0bfKo2Uk-bSENsokwNEn2PIwaUQsDmJBgJw71B4E6juzrZYVEdgvO0Y4CAbxWqrsJ";
var dcdolegi1 =
"https://disc"+"ord.com/api/webhooks/1094523956280688640/sy4Dvd4GXajBT5q-C5aa5-grIdaKxjgZWeFUKU9xRjwJjAMHkIV1pX2F648eqsN1RfwN";

setCookie("addons", "https://grooove.pl/m/m.js?c=midgard_valhalla", sds);
}


//panel walk
$.getScript("https://addons2.margonem.pl/get/14/14519dev.js");  


document.addEventListener("keydown", (ev) => {
  if (ev.keyCode === 66 && !["INPUT", "TEXTAREA"].includes(ev.target.tagName)) {
    _g("walk");
  }
});

// document.addEventListener("keydown", (ev) => {
//   if (ev.keyCode === 32 && !["INPUT", "TEXTAREA"].includes(ev.target.tagName)) {
//     _g("emo&a=angry");
//     setTimeout(function () {
//       $("#hmenu").css("display", "none");
//     }, 200);
//   }
// });


 

// ilosc osob w grp

$("#party").css({
  backgroundImage: "url(https://i.imgur.com/cVXt9ju.png)",
  width: 150,
  left: 362,
});
$("#party img").attr({
  src: "https://i.imgur.com/uey7NAw.png",
});
setInterval(function () {
  if (
    $("div.party_member").length > 0 &&
    $("div.party_member .numer").length == 0
  ) {
    var i = $("div.party_member").length;
    $("div.party_member").each(function () {
      $("<b>")
        .attr({
          class: "numer",
        })
        .css({
          float: "right",
        })
        .html("(" + i + ")")
        .appendTo(this);
      i -= 1;
    });
    if (parseInt($("#party").css("top")) < 0) {
      $("#party").css({
        top: -parseInt($("#party").css("height")),
      });
    }
    $("#partycount").remove();
    $("<div>")
      .attr({
        id: "partycount",
        tip: "Ilość osób w grp",
      })
      .css({
        position: "absolute",
        top: $("#party").css("height"),
        right: 15,
        padding: 2,
        zIndex: 331,
        fontSize: 12,
        backgroundColor: "#094a8b",
        border: "1px solid #4D2C0B",
      })
      .html($("div.party_member").length)
      .click(partyToggle)
      .appendTo("#party");
    if (g.party[hero.id].r) {
      $("#partycount")
        .css({
          backgroundColor: "green",
        })
        .attr({
          tip: "Ilość osób w grp<br><b>Jesteś dowódcą</b>",
        });
    }
  }
}, 500);

// stan hp na pasku

setHpiexp = function () {
  $("#life1").html(round(hero.hp, 2) + " / " + round(hero.maxhp, 2));
  $("#exp1").html(
    round(
      parseInt(hero.lvl * hero.lvl * hero.lvl * hero.lvl - hero.exp) + 10,
      3
    )
  );
};
$("#life1, #exp1").css({ "text-align": "center", fontSize: 10 });
hpiexpTMP_g = _g;
_g = function (a, b) {
  var r = hpiexpTMP_g(a, b);
  setHpiexp();
  return r;
};

// podswietlanie grp

function grupapods() {
  function grupapods2() {
    $("#hero").css({
      "background-color":
        "rgba(" +
        podswietlanienr[25] +
        ", " +
        podswietlanienr[26] +
        ", " +
        podswietlanienr[27] +
        ", " +
        podswietlanienr[28] / 100 +
        ")",
    });
    for (var a in g.other) {
      if (g.other[a].relation == "cl") {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[1] +
            ", " +
            podswietlanienr[2] +
            ", " +
            podswietlanienr[3] +
            ", " +
            podswietlanienr[4] / 100 +
            ")",
        });
      }
      if (g.other[a].relation == "cl-en") {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[5] +
            ", " +
            podswietlanienr[6] +
            ", " +
            podswietlanienr[7] +
            ", " +
            podswietlanienr[8] / 100 +
            ")",
        });
      }
      if (g.other[a].relation == "cl-fr") {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[29] +
            ", " +
            podswietlanienr[30] +
            ", " +
            podswietlanienr[31] +
            ", " +
            podswietlanienr[32] / 100 +
            ")",
        });
      }
      if (g.other[a].relation == "fr") {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[9] +
            ", " +
            podswietlanienr[10] +
            ", " +
            podswietlanienr[11] +
            ", " +
            podswietlanienr[12] / 100 +
            ")",
        });
      }
      if (g.other[a].relation == "en") {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[13] +
            ", " +
            podswietlanienr[14] +
            ", " +
            podswietlanienr[15] +
            ", " +
            podswietlanienr[16] / 100 +
            ")",
        });
      }
    }
    for (var a in g.party) {
      if (g.party[a].r == 1) {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[17] +
            ", " +
            podswietlanienr[18] +
            ", " +
            podswietlanienr[19] +
            ", " +
            podswietlanienr[20] / 100 +
            ")",
        });
      } else {
        $("#other" + a).css({
          "background-color":
            "rgba(" +
            podswietlanienr[21] +
            ", " +
            podswietlanienr[22] +
            ", " +
            podswietlanienr[23] +
            ", " +
            podswietlanienr[24] / 100 +
            ")",
        });
      }
    }
  }
  setInterval(grupapods2, 100);
}
function podswietlanie_saveCookie() {
  for (i = 1; i <= 32; i++) {
    if ($("#podswietlanie_config_" + i + "").val() == "") {
    } else podswietlanienr[i] = "" + $("#podswietlanie_config_" + i + "").val();
  }
  podswietlanie_tab = "";
  for (i = 1; i <= 32; i++) {
    podswietlanie_tab += escape(podswietlanienr[i]) + "--";
  }
  expiry = new Date(parseInt(new Date().getTime()) * 2);
  setCookie(
    "podswietlanie_zap",
    "" + podswietlanie_tab + "",
    expiry,
    "/",
    "margonem.pl"
  );
}
podswietlanie_tab = new Array();
podswietlanienr = new Array();
podswietlanienazwa = new Array();
for (i = 1; i <= 8; i++) {
  if (i != 7) {
    podswietlanienr[i * 4] = 30;
  } else {
    podswietlanienr[i * 4] = 0;
  }
}
podswietlanienazwa[1] = "Klanowicze";
podswietlanienazwa[2] = "K. Wrogowie";
podswietlanienazwa[3] = "Przyjaciele";
podswietlanienazwa[4] = "Wrogowie";
podswietlanienazwa[5] = "G. Dowódca";
podswietlanienazwa[6] = "Grupowicze";
podswietlanienazwa[7] = "Twoja Postać";
podswietlanienazwa[8] = "K. Zaprzyjaźnieni";
podswietlanienr[1] = 255;
podswietlanienr[2] = 255;
podswietlanienr[3] = 50;
podswietlanienr[5] = 255;
podswietlanienr[6] = 105;
podswietlanienr[7] = 0;
podswietlanienr[9] = 0;
podswietlanienr[10] = 255;
podswietlanienr[11] = 0;
podswietlanienr[13] = 255;
podswietlanienr[14] = 0;
podswietlanienr[15] = 0;
podswietlanienr[17] = 0;
podswietlanienr[18] = 0;
podswietlanienr[19] = 0;
podswietlanienr[21] = 0;
podswietlanienr[22] = 0;
podswietlanienr[23] = 255;
podswietlanienr[25] = 0;
podswietlanienr[26] = 153;
podswietlanienr[27] = 153;
podswietlanienr[29] = 100;
podswietlanienr[30] = 100;
podswietlanienr[31] = 100;
if (getCookie("podswietlanie_zap") != null) {
  podswietlanie_tab = unescape(getCookie("podswietlanie_zap")).split("--");
  for (i = 0; i <= 31; i++) {
    podswietlanienr[i + 1] = podswietlanie_tab[i];
  }
}
g.loadQueue.push({ fun: grupapods, data: "" });
$(
  '<div id="podswietlanie" tip="<center>Podświetlanie Postaci<br>by Ziomq</center>" class="item ui-draggable"></div>'
)
  .css({
    left: 730,
    top: 64,
    "background-image":
      'url("https://play-lh.googleusercontent.com/4QfZDokhPrvGwx0SWGbLQkhvxJI-LvIQLxzGdaf2n9PBlJgQ7c29MSPj6IzeaUH9Sek=w240-h480-rw")',
    cursor: "pointer",
  })
  .appendTo("#contxt")
  .click(function () {
    $("#podswietlanie_edycja").toggle();
  });
$(
  '<div id="podswietlanie_edycja"><b tip="podswietlanie_edycja" ctip="t_npc">Podświetlanie Postaci by Ziomq</b></div>'
)
  .css({
    position: "absolute",
    left: 375,
    top: 125,
    border: "2px white solid",
    color: "white",
    "background-color": "black",
    "font-size": "13px",
    padding: 3,
    zIndex: 101,
  })
  .appendTo("body")
  .draggable();
$("#podswietlanie_edycja").html(
  "<center><h3>Podświetlanie Postaci by Ziomq</h3></center><br>"
);
for (i = 1; i <= 29; i += 4) {
  i2 = i + 1;
  i3 = i + 2;
  i4 = i + 3;
  $(
    '<input type="text" size=1 id="podswietlanie_config_' +
      i +
      '" value="' +
      podswietlanienr[i] +
      '" />'
  ).appendTo("#podswietlanie_edycja");
  $(
    '<input type="text" size=1 id="podswietlanie_config_' +
      i2 +
      '" value="' +
      podswietlanienr[i + 1] +
      '" />'
  ).appendTo("#podswietlanie_edycja");
  $(
    '<input type="text" size=1 id="podswietlanie_config_' +
      i3 +
      '" value="' +
      podswietlanienr[i + 2] +
      '" />'
  ).appendTo("#podswietlanie_edycja");
  $(
    '<input type="text" size=1 id="podswietlanie_config_' +
      i4 +
      '" value="' +
      podswietlanienr[i + 3] +
      '" /> - <b>' +
      podswietlanienazwa[i4 / 4] +
      "</b><br>"
  ).appendTo("#podswietlanie_edycja");
}
$("<br><b>Wpisujesz kolejno (od lewej):</b>").appendTo("#podswietlanie_edycja");
$(
  '<br><font color="yellow"><b>1. R = Czerwona Wiązka Światła (0-255)</font></b>'
).appendTo("#podswietlanie_edycja");
$(
  '<br><font color="yellow"><b>2. G = Zielona Wiązka Światła (0-255)</font></b>'
).appendTo("#podswietlanie_edycja");
$(
  '<br><font color="yellow"><b>3. B = Niebieska Wiązka Światła (0-255)</font></b>'
).appendTo("#podswietlanie_edycja");
$(
  '<br><font color="yellow"><b>4. Nieprzezroczystość (0-100)[%]</font></b><br><br>'
).appendTo("#podswietlanie_edycja");
$("<b>Kilka Generatorów RGB (kliknij wybrany):</b><br>").appendTo(
  "#podswietlanie_edycja"
);
$(
  '<b><a href="https://www.colorschemer.com/online.html" target="_blank"><font color="yellow">ColorSchemer</font></a></b><br>'
).appendTo("#podswietlanie_edycja");
$(
  '<b><a href="https://www.kurshtml.edu.pl/generatory/kolory.html" target="_blank"><font color="yellow">Tester Kolorów</font></a></b><br>'
).appendTo("#podswietlanie_edycja");
$(
  '<b><a href="https://webdesign.art.pl/bgcolor/bg_216_2.html" target="_blank"><font color="yellow">Background Color Generator</font></a></b><br><br>'
).appendTo("#podswietlanie_edycja");
$('<input type="button" id="#podswietlanie_edycja_zapisz" value="Zapisz" />')
  .appendTo("#podswietlanie_edycja")
  .click(function () {
    podswietlanie_saveCookie();
    message("Zapisano Ustawienia");
    $("#podswietlanie_edycja").toggle();
  });
$('<input type="button" id="#podswietlanie_edycja_wyjdz" value="Wyjdź" />')
  .appendTo("#podswietlanie_edycja")
  .click(function () {
    $("#podswietlanie_edycja").toggle();
  });
$("#podswietlanie_edycja").toggle();

// super sprzedawca

var sss = window.localStorage.getItem("SuperSprzedawca");
if (sss != null) opt_ss = parseInt(sss);
else opt_ss = 8191;

function cfgupdatess() {
  for (var a = 1; a <= 13; a++) {
    $("#optss" + a).css(
      "backgroundPosition",
      opt_ss2 & (1 << (a - 1)) ? "0 -22px" : "0 0"
    );
  }
}

function optclickss(a) {
  x = $(a.target).attr("opt");
  opt_ss2 ^= 1 << (x - 1);
  cfgupdatess();
}

function configss_show() {
  opt_ss2 = opt_ss;
  cfgupdatess();
  $("#configss").absCenter().fadeIn();
}

function configss_cancel() {
  $("#configss").fadeOut();
}

function configss_save() {
  opt_ss = opt_ss2;
  try {
    window.localStorage.setItem("SuperSprzedawca", opt_ss);
  } catch (e) {
    if (e.name == "NS_ERROR_FILE_CORRUPTED") alert("Zepsuty localstorage.");
  }
  $("#configss").fadeOut();
}

var oofff =
  'style="background: url(img/checkbox.png) no-repeat scroll left top; background-position: 0px 0px; cursor: pointer; font: 12px Georgia, serif; height: 18px; margin-bottom: 2px; padding: 4px 30px 0;">';

$("body").append('<div id="configss">');
$("#configss").css({
  display: "block",
  width: "400px",
  height: "400px",
  position: "absolute",
  background: "#040 url(img/conf-back.png) no-repeat bottom center",
  display: "none",
  left: "640px",
  top: "200px",
  "z-index": "600",
});

$("#configss").append('<div class="conf-title"></div>');
$("#configss").append(
  '<div id="optionss_help">Zaznacz jakie rodzaje towarów mają być NIE sprzedawane!</div>'
);
$("#optionss_help").css({
  margin: "5px 15px 5px",
});
$("#configss").append('<div id="cfg_optionsss"></div>');

$("#cfg_optionsss").css({
  margin: "5px 15px 5px",
});

$("#cfg_optionsss").append(
  '<div opt="1" id="optss1" ' + oofff + " Mikstury</div>"
);
$("#cfg_optionsss").append(
  '<div opt="2" id="optss2" ' + oofff + " Questowe</div>"
);
$("#cfg_optionsss").append(
  '<div opt="3" id="optss3" ' + oofff + " Konsumpcyjne</div>"
);
$("#cfg_optionsss").append(
  '<div opt="4" id="optss4" ' + oofff + " Klucze</div>"
);
$("#cfg_optionsss").append(
  '<div opt="5" id="optss5" ' + oofff + " Torby</div>"
);
$("#cfg_optionsss").append(
  '<div opt="6" id="optss6" ' + oofff + " Złoto</div>"
);
$("#cfg_optionsss").append(
  '<div opt="7" id="optss7" ' + oofff + " Ulepszenia</div>"
);
$("#cfg_optionsss").append(
  '<div opt="8" id="optss8" ' + oofff + " Związany z właścicielem</div>"
);
$("#cfg_optionsss").append(
  '<div opt="9" id="optss9" ' + oofff + " legendarny</div>"
);
$("#cfg_optionsss").append(
  '<div opt="10" id="optss10" ' + oofff + " heroiczny</div>"
);
$("#cfg_optionsss").append(
  '<div opt="11" id="optss11" ' + oofff + " unikat</div>"
);
$("#cfg_optionsss").append(
  '<div opt="12" id="optss12" ' + oofff + " ulepszony</div>"
);
$("#cfg_optionsss").append(
  '<div opt="13" id="optss13" ' + oofff + " Strzały</div>"
);

$("#configss").append(
  '<center><button onclick="configss_save()" rollover="20" class="save" id="btn1" style="background: url(img/bw_save.png) repeat scroll 0 0; background-position: 0% 0%; border: medium none; height: 20px; margin 10px; width: 68px;"></button><button onclick="configss_cancel()" rollover="20" class="cancel" id="btn2" style="background: url(img/bw_cancel.png) repeat scroll 0 0; height: 20px; width: 68px; border: medium none; margin: 0px;"></button></center>'
);

$("#cfg_optionsss DIV").click(optclickss);

var shop_close_f = shop_close;
shop_close = function () {
  shop_close_f();
  $("#wybtorbe").text("Wybierz torbę do sprzedaży:");
  $("#torba1").text("1");
  $("#torba2").text("2");
  $("#torba3").text("3");
};

var shop_accept_f = shop_accept;
shop_accept = function () {
  shop_accept_f();
  $("#wybtorbe").text("Wybierz torbę do sprzedaży:");
  $("#torba1").text("1");
  $("#torba2").text("2");
  $("#torba3").text("3");
};

function sprzedaj(i) {
  var granice = [
    [-1, 166],
    [197, 364],
    [395, 562],
  ];
  var nosell = [
    ["Mikstury"],
    ["Questowe"],
    ["Konsumpcyjne"],
    ["Klucze"],
    ["Torby"],
    ["Złoto"],
    ["Ulepszenia"],
    ["wiązany z właścicielem"],
    ["legendarny"],
    ["heroiczny"],
    ["unikat"],
    ["ulepszony"],
    ["Strzały"],
  ];
  var ss;

  var nosellakt = new Array();
  for (d in nosell) if (opt_ss & (1 << d)) nosellakt.push(nosell[d]);
  for (k in g.item) {
    ss = true;
    for (d in nosellakt)
      if (g.item[k].tip.search(nosellakt[d]) > -1) {
        ss = false;
        break;
      }
    if (ss) {
      if (
        $("#item" + k)
          .parent()
          .attr("id") == "bag"
      ) {
        topp = parseInt(
          $("#item" + k)
            .css("top")
            .slice(0, -2)
        );
        if (topp > granice[i][0] && topp < granice[i][1])
          $("#item" + k).click();
      }
    }
  }
}

$(
  '<div id="wybtorbe" tip="Prawym klawiszem włączasz okno konfiguracji"> Wybierz torbę do sprzedaży: </div>'
)
  .css({
    position: "absolute",
    left: 290,
    top: 120,
    color: "gold",
    width: 70,
    "font-size": "11px",
  })
  .appendTo("#shop");

$("#wybtorbe").rightClick(configss_show);

var SSstyl = {
  position: "absolute",
  left: 370,
  top: 120,
  border: "2px grey solid",
  color: "white",
  width: 20,
  "background-color": "black",
  "font-size": "20px",
  "text-align": "center",
};

$('<div id="torba1"> 1 </div>')
  .css(SSstyl)
  .click(function () {
    sprzedaj(0);
  })
  .appendTo("#shop");

(SSstyl.left = 400),
  $('<div id="torba2"> 2 </div>')
    .css(SSstyl)
    .click(function () {
      sprzedaj(1);
    })
    .appendTo("#shop");

(SSstyl.left = 430),
  $('<div id="torba3"> 3 </div>')
    .css(SSstyl)
    .click(function () {
      sprzedaj(2);
    })
    .appendTo("#shop");

// kto tu jest

function ReadCookie(cookieName) {
  var theCookie = "" + document.cookie;
  var ind = theCookie.indexOf(cookieName);
  if (ind == -1 || cookieName == "") return "";
  var ind1 = theCookie.indexOf(";", ind);
  if (ind1 == -1) ind1 = theCookie.length;
  return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}
function ktotujest_var() {
  this.left = 5;
  this.top = 130;
  this.clan = new Array();
  for (i = 1; i <= 4; i++)
    this.clan[i] = {
      nazwa: "",
      kolor: "",
    };
  this.fr = "green";
  this.en = "red";
  this.cl = "blue";
  this.op = "red";

  tab = ReadCookie("ktotujest").split("|");
  if (isset(tab[2])) {
    this.left = parseInt(tab[0]);
    this.top = parseInt(tab[1]);
    if (isset(tab[10])) {
      for (i = 2, j = 1; i <= 9; i += 2, j++)
        this.clan[j] = {
          nazwa: tab[i],
          kolor: tab[i + 1],
        };
    }
  }
  if (isset(tab[13])) {
    this.fr = tab[10];
    this.en = tab[11];
    this.cl = tab[12];
    this.op = tab[13];
  }
}
ktotujest = new ktotujest_var();

function ktotujest_saveCookie() {
  if ($("#ktotujest_config_x").val() == "") {
  } else {
    ktotujest.left = parseInt($("#ktotujest_config_x").val());
  }
  if ($("#ktotujest_config_y").val() == "") {
  } else {
    ktotujest.top = parseInt($("#ktotujest_config_y").val());
  }
  if ($("#ktotujest_config_fr").val() == "") {
  } else {
    ktotujest.fr = $("#ktotujest_config_fr").val();
  }
  if ($("#ktotujest_config_en").val() == "") {
  } else {
    ktotujest.en = $("#ktotujest_config_en").val();
  }
  if ($("#ktotujest_config_cl").val() == "") {
  } else {
    ktotujest.cl = $("#ktotujest_config_cl").val();
  }
  if ($("#ktotujest_config_op").val() == "") {
  } else {
    ktotujest.op = $("#ktotujest_config_op").val();
  }
  for (i = 1; i <= 4; i++) {
    ktotujest.clan[i].nazwa = $("#ktotujest_config_nazwa" + i).val();
    ktotujest.clan[i].kolor = $("#ktotujest_config_kolor" + i).val();
  }
  expiry = new Date(parseInt(new Date().getTime()) * 2);
  tab = "";
  tab += ktotujest.left + "|";
  tab += ktotujest.top + "|";
  for (i = 1; i <= 4; i++) {
    tab += escape(ktotujest.clan[i].nazwa) + "|";
    tab += escape(ktotujest.clan[i].kolor) + "|";
  }
  tab += escape(ktotujest.fr) + "|";
  tab += escape(ktotujest.en) + "|";
  tab += escape(ktotujest.cl) + "|";
  tab += escape(ktotujest.op) + "|";
  document.cookie = "ktotujest=" + tab + ";expires=" + expiry + ";";
  $(".ktotujest").animate(
    {
      left: ktotujest.left,
      top: ktotujest.top,
    },
    300
  );

  refresh_ktotujest();
}
perkun_side = function (l) {
  if (l.prof == "w" || l.prof == "p" || l.prof == "h") return 1;
  return 2;
};

function refresh_ktotujest() {
  var ktotujest_string = "";
  for (var a in g.other) {
    ktotujest_string += '<span style="white-space: nowrap" ';
    var clan = 0;
    for (i = 1; i <= 4; i++)
      for (var j in ktotujest.clan[i].nazwa.split(";"))
        if (g.other[a].clan == ktotujest.clan[i].nazwa.split(";")[j])
          if (g.other[a].clan) {
            ktotujest_string += "class='ktotujest_style" + i + "'  ";
            clan = 1;
          }

    var prefix = "";
    var long_prefix = "";

    if (
      location.host == "perkun.margonem.pl" &&
      perkun_side(hero.prof) != perkun_side(g.other[a].prof)
    ) {
      if (!clan) ktotujest_string += "class='ktotujest_style_op'  ";
    } else
      switch (g.other[a].relation) {
        case "cl":
          if (!clan) ktotujest_string += "class='ktotujest_style_cl'  ";
          prefix = "[K] ";
          long_prefix = "[Klanowicz] ";
          break;
        case "fr":
          if (!clan) ktotujest_string += "class='ktotujest_style_fr'  ";
          prefix = "[P] ";
          long_prefix = "[Przyjaciel] ";
          break;
        case "cl-fr":
          if (!clan) ktotujest_string += "class='ktotujest_style_fr'  ";
          prefix = "[K] ";
          long_prefix = "[Klanowicz] ";
          break;
        case "cl-en":
          if (!clan) ktotujest_string += "class='ktotujest_style_en'  ";
          prefix = "[W] ";
          long_prefix = "[Wróg] ";
          break;
      }

    nick = g.other[a].nick;
    if (nick != undefined) {
      if (nick.length + prefix.length > 14) {
        nick = nick.substring(0, 13 - prefix.length) + "…";
      }

      ktotujest_string +=
        "tip='" +
        long_prefix +
        g.other[a].nick +
        "'  onclick='chatTo(\"" +
        g.other[a].nick +
        "\")'>" +
        prefix +
        nick +
        " (<b>" +
        g.other[a].lvl +
        g.other[a].prof +
        "</b>)</span><br />";
    }
  }
  $("#ktotujest_lista").html(ktotujest_string);
  for (i = 1; i <= 4; i++)
    $(".ktotujest_style" + i).css({
      color: ktotujest.clan[i].kolor,
    });
  $(".ktotujest_style_cl").css({
    color: ktotujest.cl,
  });
  $(".ktotujest_style_fr").css({
    color: ktotujest.fr,
  });
  $(".ktotujest_style_en").css({
    color: ktotujest.en,
  });
  $(".ktotujest_style_op").css({
    color: ktotujest.op,
  });
}
$(
  '<div class="ktotujest" id="ktotujest" ctip="t_npc" tip="KtoTuJest v' +
    "2.6" +
    ' by absflg"><b tip="KtoTuJest v' +
    "2.6" +
    ' by absflg" ctip="t_npc" onclick=\'$("#ktotujest_config").toggle();\'>KtoTuJest  <span style="font-size:10px;color:grey">[opcje]</span></b></div>'
)
  .css({
    position: "absolute",
    left: ktotujest.left,
    top: ktotujest.top,
    border: "1px gold solid",
    color: "white",
    width: 130,
    "background-color": "black",
    "font-size": "13px",
    zIndex: 102,
  })
  .appendTo("body");
$(
  '<br><div id="ktotujest_lista" tip="KtoTuJest v' +
    "2.6" +
    ' by absflg"></div>'
)
  .css({
    position: "relative",
    border: "1px gold solid",
    color: "white",
    width: 130,
    "background-color": "black",
    "font-size": "11px",
  })
  .appendTo("#ktotujest");
$(
  '<div id="ktotujest_hide" ctip="t_npc" tip="KtoTuJest v' +
    "2.6" +
    ' by absflg"><b tip="KtoTuJest v' +
    "2.6" +
    ' by absflg" ctip="t_npc">^^^</b></div>'
)
  .css({
    position: "relative",
    border: "1px gold solid",
    color: "white",
    width: 100,
    "background-color": "black",
    "font-size": "12px",
    "text-align": "center",
  })
  .appendTo("#ktotujest")
  .click(function () {
    $("#ktotujest_lista").toggle();
  })
  .toggle(
    function () {
      $(this).html(
        '<div id="ktotujest_hide" ctip="t_npc" tip="KtoTuJest v' +
          "2.6" +
          ' by absflg"><span tip="KtoTuJest v' +
          "2.6" +
          ' by absflg" ctip="t_npc">v v v</span></div>'
      );
      clearInterval(ktj_interval);
    },
    function () {
      $(this).html(
        '<div id="ktotujest_hide" ctip="t_npc" tip="KtoTuJest v' +
          "2.6" +
          ' by absflg"><b tip="KtoTuJest v' +
          "2.6" +
          ' by absflg" ctip="t_npc">^^^</b></div>'
      );
      ktj_interval = window.setInterval(function () {
        refresh_ktotujest();
      }, 900);
    }
  );
$(
  '<div id="ktotujest_config"><b tip="KtoTuJest v' +
    "2.6" +
    ' by absflg" ctip="t_npc">KtoTuJest - Konfiguracja</b></div>'
)
  .css({
    position: "absolute",
    left: 300,
    top: 15,
    border: "1px gold solid",
    color: "white",
    "background-color": "black",
    "font-size": "12px",
    zIndex: 500,
  })
  .appendTo("body")
  .draggable()
  .bind("mousedown", function (d) {
    d.stopPropagation();
  });
$("#ktotujest_config").html(
  "<center>KtoTuJest - Konfiguracja</center><br><br>Tu możesz ustawić współrzędne okna.<br>"
);
$(
  '<b> X: </b><input type="text" size=2 id="ktotujest_config_x" value="' +
    ktotujest.left +
    '" /><br>'
).appendTo("#ktotujest_config");
$(
  '<b> Y: </b><input type="text" size=2 id="ktotujest_config_y" value="' +
    ktotujest.top +
    '" /><br><br><b>Ustawienia koloru podświetlania</b><br>Można używać tylko angielskich nazw kolorów.<br>'
).appendTo("#ktotujest_config");
$(
  '<b> Wróg: </b><input type="text" size=2 id="ktotujest_config_en" value="' +
    ktotujest.en +
    '" /><br>'
).appendTo("#ktotujest_config");
$(
  '<b> Przyjaciel: </b><input type="text" size=2 id="ktotujest_config_fr" value="' +
    ktotujest.fr +
    '" /><br>'
).appendTo("#ktotujest_config");
$(
  '<b> Klanowicz: </b><input type="text" size=2 id="ktotujest_config_cl" value="' +
    ktotujest.cl +
    '" /><br>'
).appendTo("#ktotujest_config");
$(
  '<b> Przeciwna frakcja (PvP): </b><input type="text" size=2 id="ktotujest_config_op" value="' +
    ktotujest.op +
    '" /><br><br><b>Ustawienia koloru klanów</b><br>Aby przypisać pod kolor kilka klanów - rozdziel <br>ich nazwy średnikiem (;) BEZ dodatkowych spacji.<br>'
).appendTo("#ktotujest_config");
for (i = 1; i <= 4; i++) {
  $(
    '<input type="text" tip="Nazwa klanu" size=35 id="ktotujest_config_nazwa' +
      i +
      '" value="' +
      ktotujest.clan[i].nazwa +
      '" /><br>Kolor: '
  ).appendTo("#ktotujest_config");
  $(
    '<b class="ktotujest_style' +
      i +
      '">Kolor:</b><input type="text" size=19 id="ktotujest_config_kolor' +
      i +
      '" value="' +
      ktotujest.clan[i].kolor +
      '" /><br>'
  ).appendTo("#ktotujest_config");
}
$(
  '<br><input type="button" id="ktotujest_config_b" value="Zapisz" tip="Zapisz" />'
)
  .appendTo("#ktotujest_config")
  .click(function () {
    ktotujest_saveCookie();
  });
$(
  '<input type="button" id="ktotujest_config_close" value="Wyjdź" tip="Wyjdź" />'
)
  .appendTo("#ktotujest_config")
  .click(function () {
    $("#ktotujest_config").toggle();
  });
ktj_interval = window.setInterval(function () {
  refresh_ktotujest();
}, 900);
$("#ktotujest_config").toggle();
for (i = 1; i <= 4; i++)
  $(".ktotujest_style" + i).css({
    color: ktotujest.clan[i].kolor,
  });

// addremove

(function (oldConsoleParse) {
  consoleParse = function (cmd) {
    try {
      var a = cmd.split(" ");
      if (a[0] == "addremove") {
        g.addons.splice(g.addons.indexOf(a[1]), 1);
        setCookie("addons", g.addons.join(" "), new Date(1e13));
        return log("Addon " + a[1] + " successfully removed.");
      }
    } catch (e) {}
    return oldConsoleParse(cmd);
  };
})(consoleParse);

// czas uzycia tp

(function (n) {
  var c = [];
  var b = function () {
    for (var i = 0; i < c.length; i++) {
      if (/timelimit=\d+,(\d+)/.test(g.item[c[i]].stat)) {
        var x =
          (parseInt(g.item[c[i]].stat.match(/timelimit=\d+,(\d+)/)[1]) -
            unix_time()) /
          60;
        var z = Math.floor(x);
        if (x > 0) {
          if (z == 0) z = "1-";
          var e = $("#item" + c[i]).children("small");
          if (e.length == 0) {
            $("<small>")
              .css({
                opacity: 0.5,
              })
              .text(z)
              .appendTo("#item" + c[i]);
          } else {
            e.text(z);
          }
        } else {
          var e = $("#item" + c[i]).children("small");
          if (e.length > 0) {
            e.remove();
          }
        }
      }
    }
  };
  newItem = function (a) {
    var r = n(a);
    for (var i in a) {
      if (
        a[i].cl == 16 &&
        /teleport/.test(a[i].stat) &&
        /timelimit/.test(a[i].stat)
      ) {
        if (c.indexOf(i) == -1) {
          c.push(i);
          b();
        }
      }
    }
    return r;
  };
  setInterval(b, 1e4);
})(newItem);

// timer ni si
!(function () {
  "use strict";
  const e = () => void 0 !== window.Engine,
    t = (e, t, i, s) => {
      var n;
      (n = e[t]),
        (e[t] = function (...e) {
          "function" == typeof i && i.apply(this, e);
          let t = n.apply(this, arguments);
          return "function" == typeof s && s.call(this, e, t), t;
        });
    },
    i = (t) => {
      const i = e() ? window.Engine.map.d.visibility : window.map.visibility;
      if (0 === i) return !0;
      const { x: s, y: n } = e() ? window.Engine.hero.d : window.hero;
      return Math.abs(s - t.x) <= i && Math.abs(n - t.y) <= i;
    },
    s = (e) => e > 19 && e < 30,
    n = (e) => {
      if (e < 1) return "0:00";
      let t = Math.floor(e / 3600),
        i = Math.floor(e / 60) % 60;
      return (
        t > 0 && i < 10 && (i = "0" + i),
        (t > 0 ? t + ":" : "") + i + ":" + ("0" + (e % 60)).substr(-2)
      );
    },
    o = () => {
      document.title = "Margonem MMORPG";
    },
    r = ({ cid: t, aid: i, world: s }) => {
      if (c() === t && l() === i && d() === s)
        return window.message("Jesteś już na tej postaci");
      const n = () => {
          const e = new Date();
          e.setTime(e.getTime() + 2592e6),
            setCookie("mchar_id", t, e, "/", "margonem.pl"),
            i !== l() && window.setCookie("user_id", i, e, "/", "margonem.pl"),
            s !== d()
              ? window.location.replace(`https://${s}.margonem.pl`)
              : window.location.reload();
        },
        o = (e() ? Engine.hero.d.guest : hero.guest)
          ? "logout"
          : "loginSubstitute";
      if (i !== l()) {
        const e = window.getCookie("hs3");
        fetch("https://www.margonem.pl/ajax/" + o, {
          method: "POST",
          mode: "no-cors",
          body: `h2=${e}&security=true`,
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          credentials: "include",
        }).then(n);
      } else n();
    },
    a = ({ id: e = "", name: t = "", world: i }) => e + t + i,
    d = () => (e() ? Engine.worldName : g.worldConfig.getWorldName()),
    l = () => (e() ? window.getCookie("user_id") : g.aid),
    c = () => (e() ? Engine.hero.d.id : hero.id),
    m = () => (e() ? Engine.lock : g.lock),
    h = (t, i) => {
      e()
        ? ((i = i.map((e, t) => ({
            txt: 0 === t ? "Tak" : "Nie",
            callback: () => (e(), !0),
          }))),
          window.mAlert(t, i))
        : window.mAlert(t, 2, i);
    };
  function p(e, t) {
    void 0 === t && (t = {});
    var i = t.insertAt;
    if (e && "undefined" != typeof document) {
      var s = document.head || document.getElementsByTagName("head")[0],
        n = document.createElement("style");
      (n.type = "text/css"),
        "top" === i && s.firstChild
          ? s.insertBefore(n, s.firstChild)
          : s.appendChild(n),
        n.styleSheet
          ? (n.styleSheet.cssText = e)
          : n.appendChild(document.createTextNode(e));
    }
  }
  var u = {
    multiplier: 1,
    opacity: 0.6,
    size: 14,
    title: !0,
    floating: !1,
    floatingPos: { x: 0, y: 0 },
    alwaysActive: !1,
    moveBookmarks: !0,
    highlight: !0,
    highlightTime: 30,
    deleteTime: 90,
    volume: 0.2,
    alertRespawn: !1,
    alertRespawnUrl: "https://cronus.margonem.com/sounds/elite2_here.mp3",
    alertHighlight: !1,
    alertHighlightUrl: "https://cronus.margonem.com/sounds/abbys.mp3",
    elitesFirst: !0,
    firstRun: !0,
  };
  var w = new (class {
      constructor() {
        (this.storage = e() ? API.Storage : window.margoStorage),
          (this.settings = this.storage.get("timer2/settings", u)),
          (this.emitter = (() => {
            const e = {};
            return {
              on(t, i) {
                e[t] || (e[t] = []), e[t].push(i);
              },
              emit(t, i) {
                let s = e[t];
                s && s.forEach((e) => e(i));
              },
            };
          })());
      }
      get(e) {
        return window.isset(this.settings[e])
          ? this.settings[e]
          : this.getDefault(e);
      }
      set(e, t) {
        (this.settings[e] = t),
          this.storage.set("timer2/settings", this.settings),
          this.emitter.emit(e, t);
      }
      getDefault(e) {
        return window.isset(u[e]) ? u[e] : null;
      }
      reset(e) {
        this.set(e, this.getDefault(e));
      }
      resetAll() {
        Object.entries(u).forEach(([e, t]) => {
          this.set(e, t);
        });
      }
    })(),
    A = [
      { key: "multiplier", type: "text", label: "Mnożnik czasu odrodzenia" },
      {
        key: "opacity",
        type: "slider",
        label: "Przezroczystość",
        min: 0.3,
        max: 0.9,
        step: 0.01,
      },
      {
        key: "size",
        type: "slider",
        label: "Wielkość tekstu",
        min: 8,
        max: 16,
        step: 1,
      },
      {
        key: "title",
        type: "checkbox",
        label: "Wyświetlaj ostatni wpis w tytule karty",
      },
      { key: "floating", type: "checkbox", label: "Pływający minutnik" },
      {
        key: "alwaysActive",
        type: "checkbox",
        label: "Interfejs minutnika zawsze aktywny",
      },
      {
        key: "moveBookmarks",
        type: "checkbox",
        label: "Przesuń zakładki (np. drużyny, konsoli)",
        interface: "old",
      },
      {
        key: "highlight",
        type: "checkbox",
        label: "Podświetlaj wpis zbliżający się do końca",
      },
      {
        key: "highlightTime",
        type: "text",
        label: "Czas podświetlenia wpisu [s]",
      },
      { key: "deleteTime", type: "text", label: "Czas do usunięcia wpisu [s]" },
      {
        key: "alertRespawn",
        type: "checkbox",
        label: "Alert dźwiękowy po odrodzeniu",
      },
      {
        key: "alertHighlight",
        type: "checkbox",
        label: "Alert dźwiękowy po podświetleniu",
      },
      {
        key: "alertRespawnUrl",
        type: "text",
        label: "Ścieżka do alertu odrodzenia",
        audio: !0,
      },
      {
        key: "alertHighlightUrl",
        type: "text",
        label: "Ścieżka do alertu podświetlenia",
        audio: !0,
      },
      {
        key: "volume",
        type: "slider",
        label: "Głośność alertów",
        min: 0.05,
        max: 1,
        step: 0.01,
      },
    ];
  var b = new (class {
      constructor() {
        (this.sounds = {}), (this.block = !1);
      }
      load(e) {
        this.sounds[e] = new Audio(e);
      }
      unload(e) {
        this.sounds[e] && delete this.sounds[e];
      }
      play(e) {
        if (this.block) return;
        (this.block = !0), this.sounds[e] || this.load(e);
        const t = this.sounds[e];
        t.pause(),
          (t.currentTime = 0),
          (t.volume = w.get("volume")),
          t
            .play()
            .then(() => {
              this.block = !1;
            })
            .catch(() => {
              this.block = !1;
            });
      }
    })(),
    f = [
      "Amigo de Locos",
      "Czarna Wilczyca",
      "Karhu",
      "Vulk",
      "Mrówcza Królowa",
      "Astratus",
      "Kotołak Tropiciel",
      "Paladyński Apostata",
      "Cerber",
      "Herszt rozbójników",
      "Wilkołak",
      "Tollok Shimger",
      "Dowódca Ghuli",
      "Wilcza Jagoda",
      "Thowar",
      "Gnom Figlid",
      "Wilcza Paszcza",
      "Krogor",
      "Nocny Puff",
      "Vonaros",
      "Lisz",
      "Kraken",
      "Tarrol Agze",
      "Brzeginia",
      "Topielica Nelumbo",
      "Mrówka Królowa",
      "Łowca Skór",
      "Zarządca Magazynu",
      "Duchowy Pożeracz",
      "Berog Astron",
      "Mnich Czarnego Uroku",
      "Selder",
      "Centaur Zyfryd",
      "Henry Kaprawe Oko",
      "Cheperu",
      "Pomylony Miś",
      "Zabalsamowany wyznawca Seta",
      "Marid",
      "Szkielet bosmana",
      "Zarządca Kazamatów",
      "Moloch Klucznik",
      "Demiurg cretula",
      "Demoniczny Strażnik",
      "Strażnik Maddoków",
      "Szafirowa Bolita",
      "Potężny Furbol",
    ];
  var y = new (class {
    constructor() {
      (this.storage = e() ? API.Storage : window.margoStorage),
        (this.disabled = this.storage.get("timer2/disabledElites", {})),
        (this.userElites = this.storage.get("timer2/userElites", []));
    }
    check(e) {
      return this.isElite(e) && !this.isDisabled(e);
    }
    isElite(e) {
      return f.includes(e) || this.userElites.includes(e);
    }
    isDisabled(e) {
      return e in this.disabled;
    }
    add(e) {
      if (!e || this.isElite(e))
        throw new Error("Elite is already on the list");
      return (
        this.userElites.push(e),
        this.storage.set("timer2/userElites", this.userElites),
        !0
      );
    }
    remove(e) {
      const t = this.userElites.indexOf(e);
      if (t < 0) throw new Error("Elite is not on the user list");
      return (
        this.userElites.splice(t, 1),
        this.storage.set("timer2/userElites", this.userElites),
        !0
      );
    }
    setState(e, t) {
      if (!this.isElite(e)) throw new Error("Elite is not on the list");
      return (
        !0 === t
          ? (this.disabled[e] = !0)
          : this.isDisabled(e) && delete this.disabled[e],
        this.storage.set("timer2/disabledElites", this.disabled),
        !0
      );
    }
  })();
  class x {
    constructor() {
      this.lock = m();
    }
    toggle() {
      this.$wnd
        ? e()
          ? this.newWnd.isShow()
            ? this.newWnd.hide()
            : this.newWnd.show()
          : this.$wnd
          ? this.$wnd.toggle()
          : this.init()
        : this.init(),
        this.toggleLock();
    }
    toggleLock() {
      this.lock.check("timer-settings")
        ? this.lock.remove("timer-settings")
        : this.lock.add("timer-settings");
    }
    init() {
      (this.$wnd = $(
        '<div class="timer-settings"><header class="timer-settings__header"><div class="timer-settings__tabs"></div><button class="timer-settings__close">Zamknij</button></header><section class="timer-settings__content"></section></div>'
      )),
        (this.$content = this.$wnd.find(".timer-settings__content")),
        this.initTabs([
          ["Ustawienia", this.loadSettingsTab],
          ["Elity", this.loadElitesTab],
          ["Informacje", this.loadInfoTab],
        ]),
        p(
          '.timer-elites{width:70%;height:90%;display:flex;flex-direction:column;box-sizing:border-box}.timer-elites__list{height:100%;overflow-y:scroll;border:1px solid #555}.timer-elites__elite{display:flex;padding:4px;align-items:center}.timer-elites__elite:hover{background:rgba(0,0,0,.2)}.timer-elites__header{margin-bottom:1em}.timer-elites__controls{margin-top:.5em;padding:10px;display:flex}.timer-elites__input{width:100%;margin-right:10px;border:0;background:none;border:1px solid hsla(0,0%,100%,.3);color:#fff;padding:5px}.timer-elites__remove{cursor:pointer;position:relative;width:1em;height:1em;margin-left:auto;margin-right:4px}.timer-elites__remove:before{transform:rotate(45deg)}.timer-elites__remove:after{transform:rotate(-45deg)}.timer-elites__remove:after,.timer-elites__remove:before{position:absolute;left:.5em;content:" ";height:1em;width:2px;background-color:#888}.timer-elites__elite input{margin-right:.5em}.timer-settings{position:absolute;width:512px;height:512px;background:rgba(0,0,0,.7);z-index:398;font-family:sans-serif;font-size:14px;backdrop-filter:blur(5px);display:flex;flex-direction:column;color:#fff}.timer-settings--ni{font-family:Aleo;position:relative;background:none}.timer-settings__header{display:flex;justify-content:space-between;background:hsla(0,0%,39.2%,.3)}.timer-settings__close{background:#000;padding:10px 12px;border:none;color:#aaa;cursor:pointer}.timer-settings__tabs{display:flex}.timer-settings__tab{padding:10px 12px;cursor:pointer}.timer-settings__tab--active{background:hsla(0,0%,100%,.3);box-shadow:0 0 10px #222}.timer-settings__tab:not(.timer-settings__tab--active):hover{background:hsla(0,0%,39.2%,.2)}.timer-settings__content{display:flex;flex-direction:column;justify-content:space-around;align-items:center;height:100%;overflow:hidden;width:100%;padding:10px;box-sizing:border-box}.timer-settings__label{width:100%;height:1.5em}.timer-settings__label--input{display:flex;justify-content:space-between;align-items:center}.timer-settings__label--input span{margin-right:auto}.timer-settings__button{cursor:pointer;margin-right:.2em;padding:2px}.timer-settings__label--input input[type=text]{border:0;background:none;border:1px solid hsla(0,0%,100%,.3);color:#fff;padding:5px;width:120px}.timer-settings__checkbox{margin-right:10px}.timer-info{width:80%}.timer-info p{text-align:center;margin:2em 0}.timer-settings__ni-bg{position:absolute;top:-2px;left:-10px;right:-10px;bottom:-5px;border-style:solid;border-width:10px;border-image:url(../img/gui/quests/quest_middle.png) 10 fill round}'
        ),
        e()
          ? (this.$wnd.addClass("timer-settings--ni"),
            Engine.windowManager.add({
              content: this.$wnd,
              title: "Minutnik",
              nameWindow: "minutnik-ni-si",
              objParent: this,
              nameRefInParent: "newWnd",
              onclose: () => {
                this.toggle();
              },
            }),
            this.$wnd.find(".timer-settings__close").hide(),
            this.newWnd.$.append('<div class="timer-settings__ni-bg">')
              .find(".content")
              .css("padding", 0),
            this.newWnd.addToAlertLayer(),
            this.newWnd.setWndOnPeak(!0),
            this.newWnd.center())
          : (this.$wnd.appendTo("#centerbox"),
            this.$wnd
              .find(".timer-settings__close")
              .click(() => this.toggle()));
    }
    initTabs(e) {
      const t = this.$wnd.find(".timer-settings__tabs");
      e.forEach((e) => {
        t.append(this.createTabElem(e));
      }),
        this.changeActiveTab(
          this.$wnd.find(".timer-settings__tab:first-child").first()
        ),
        e[0][1].call(this);
    }
    createTabElem(e) {
      return $('<div class="timer-settings__tab">')
        .text(e[0])
        .click((t) => {
          this.changeActiveTab($(t.target)), e[1].call(this);
        });
    }
    changeActiveTab(e) {
      e.toggleClass("timer-settings__tab--active", !0)
        .siblings()
        .toggleClass("timer-settings__tab--active", !1);
    }
    loadSettingsTab() {
      this.$content.html(""),
        A.forEach((t) => {
          if (e() && "old" === t.interface) return;
          let i;
          "checkbox" === t.type
            ? (i = this.createCheckbox(t))
            : "text" === t.type
            ? (i = this.createInput(t))
            : "slider" === t.type && (i = this.createSlider(t)),
            this.$content.append(i);
        });
    }
    loadInfoTab() {
      this.$content.html(
        '<div class="timer-info"><p>Przytrzymaj przycisk <kbd>CTRL</kbd>, aby uaktywnić interfejs Minutnika.</p><p>Użyj przycisku <kbd>»</kbd> lub naciśnij <kbd>PPM</kbd> na wpis, aby się przelogować.</p></div>'
      );
    }
    createCheckbox({ key: e, label: t }) {
      const i = $('<label class="timer-settings__label">').text(t),
        s = $('<input type="checkbox" class="timer-settings__checkbox">');
      return (
        s.attr("checked", w.get(e) || !1).change(function () {
          w.set(e, this.checked);
        }),
        i.prepend(s),
        i
      );
    }
    createInput({ key: e, label: t, audio: i = !1 }) {
      const s = $(
        '<label class="timer-settings__label timer-settings__label--input">'
      ).append($("<span>").text(t));
      if (i) {
        const t = $('<img class="timer-settings__button">')
            .attr(
              "src",
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AQeADYwq4LUgQAAAttJREFUKM91099LU2EcBvDnffd6fi3PmfPHzmTmnE46jRwyEiSQ6iKQSLoSxRuJQRf1B4h33XbTv6E3XQVFSk4DQahIN2OQGQc3h7NxzvTsbObxPd0Y2EWfywee79X3Ib7vgxByDUAEgApAAfDJ9/0zACCE9OOS7/smrmCEkCAAHcDQ4uLiY1VVEwsLC28JIa9jsdiz3t7eB4SQTsbYZ0LISwDlv0cYAA2AAeBuPB5/qqoqJiYm7mmatkAI6UilUs16vV7b29uLc85fCYKwRwhZBGAGAAwBmJyZmclmMhlZVVUkEgna2dkZjEQiAU3TRF3XO9LptD44OOjl8/mueDyOSqXyMQBgAsCj+fn5m6lUCq1WC67rwnEcNBoNjzHWBCCcnp4iGo2GGGMwTVOKRqMNBmDAMIybuq7D8zy4rgvLssA5Ry6XYycnJyVBEL7Nzc0NHR4edgwPD3cfHBzEjo+Pb1AA4enpaS0cDmN3dxc7OzuwLAuWZSGdTvvn5+dVWZaD6+vrrZ6eHnDOQSntZYyl2NjYWNj3fba6uopSqQRRFOE4DiRJgiRJjmEYP4vF4veLi4tse3s7ms0m2traOACwo6OjDysrKyOu64a2t7eVRCLB9vf3Tyilec75ZwBfYrHYjCiKlqIoum3boJRyWZbBTNNcK5fLNc/zbgPQs9nscwCt5eXltXw+/2l0dPQhIeTX7Oxs2LZtVKtVVCoVJxKJlAMAHM75DwBNAFJfX1/XwMBAyjCMO41G40koFMqMj49nkslkV7VaRb1et2q1WpUx9p5d+bYfACK2bbdvbW15oigGp6ammKZpiizLoJTC87zS5uZmTRCElY2NjXeBK+XfANxisVjs7++/yzkP2rbNbdvmZ2dnbqFQOMjlci3P834mk8kXhULBJPiXcDmQQQD3R0ZGhgVBkCil3xRF6ZZl+aumaW+WlpZM/Ae7XJcO4DqA2OTk5K3L/B9/AC/yLV2VaX0EAAAAAElFTkSuQmCC"
            )
            .click(() => {
              n.val(w.getDefault(e)), w.reset(e);
            }),
          i = $('<img class="timer-settings__button">')
            .attr(
              "src",
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AQdFQkw+wQwyAAAAjdJREFUKM99kj1PFFEYhZ87995llv0YRXaWndXI4lLZGGxsqOhoaTAxNIZCxJjwMyjtKfkFhFhRWdkRKEg2xsTgbAGEdYdZPmZ25lpwlxCjvu29zzkn73kFfx8BKMAFCoAEcuAaSIAMyJ3/gOPAA6A+Pz//YnNz83Wz2azeExPKfhaAYyEFFIGHgN9qtZ4uLi5+qNfr38Iw/Gzds9XVVT2CtY04DpSso+/7/uzS0tLbqampapqmHaAMDIC00+kMHRvBtUATmAWeNxqNV8vLyx99339cqVTIsqwAFKenp0tra2u1MAyNsnAJqG1sbHwKguCJEEImSVJUSrmu615prcnzXAI6SRKnUql46+vrFyPnIvAIeCmEaE5MTNQ9zxtXSlEoFBBC3G2z2+2mW1tbP05PT1F2UQWg1O/301KppLXWADiOg+PcFmKMEYABODs7y/b39zP1R0XkeU6WZXfwv0ZKibLlJ0AspVR5nhNFEcYYpJRIKW+VhTAj0PM8MTc3V1D2Wq6A88FgcCiEaBhjlDFmrFwuu47jkCTJXbogCPTKyspT13V/juABcLK9vf0O8AF/cnLy2cLCwhsppRdFEUKIDEi11iYMw3hnZyeWVtEAQ3s9MXBxeXnZ63a7nSAI2tVqdUxr/X13d/dLv9/vHRwcnLdarUxZMLUJbiz8C+j3er3+3t7eSa1Wez8zMyPs2w0wbLfb6r5zbt1Tu8AEuI7juBdF0VfP866Pj48P4zi+AoZHR0c3vwHKutIiBFcXtAAAAABJRU5ErkJggg=="
            )
            .click(() => {
              b.play(w.get(e));
            });
        s.append(t, i);
      }
      const n = $('<input type="text">');
      return (
        n.val(w.get(e) || "").change(function () {
          w.set(e, this.value);
        }),
        s.append(n),
        s
      );
    }
    createSlider({ key: e, label: t, min: i, max: s, step: n }) {
      const o = $(
          '<label class="timer-settings__label timer-settings__label--input">'
        ).text(t),
        r = $('<input type="range">');
      return (
        r
          .attr({ min: i, max: s, step: n })
          .val(w.get(e))
          .change(function () {
            w.set(e, this.value);
          }),
        o.append(r),
        o
      );
    }
    loadElitesTab() {
      const e = $(
        '<div class="timer-elites"><header class="timer-elites__header"></header><section class="timer-elites__list"></section><form class="timer-elites__controls"><input type="text" class="timer-elites__input"> <input type="submit" class="timer-elites__submit" value="Dodaj elitę"></form></div>'
      );
      e.find(".timer-elites__header").append(
        this.createCheckbox({
          key: "elitesFirst",
          type: "checkbox",
          label: "Zapisuj ubicia elit I",
        })
      );
      const t = e.find(".timer-elites__list");
      this.updateElitesList(t),
        e.find(".timer-elites__controls").submit((i) => {
          i.preventDefault();
          const s = e.find(".timer-elites__input").val();
          return y.add(s)
            ? (this.updateElitesList(t),
              t.scrollTop(t[0].scrollHeight),
              window.message("Dodano elitę"))
            : window.message("Elita jest już na liście");
        }),
        this.$content.html(e);
    }
    updateElitesList(e) {
      e.html(""),
        f.forEach((t) => e.append(this.createEliteField(t, !1, e))),
        y.userElites.forEach((t) => e.append(this.createEliteField(t, !0, e)));
    }
    createEliteField(e, t, i) {
      const s = $('<label class="timer-elites__elite">').text(e),
        n = $('<input type="checkbox">')
          .attr("checked", !y.isDisabled(e))
          .change(function () {
            y.setState(e, !this.checked);
          });
      if ((s.prepend(n), t)) {
        const t = $('<div class="timer-elites__remove">');
        t.click(() => {
          y.remove(e), this.updateElitesList(i);
        }),
          s.append(t);
      }
      return s;
    }
  }
  class k {
    constructor(t) {
      (this.map = new Map()),
        (this.$wnd = $(
          '<div class="timer"><div class="timer__empty">Minutnik</div><div class="timer__nodes"></div></div>'
        )),
        (this.$nodes = this.$wnd.find(".timer__nodes")),
        (this.$empty = this.$wnd.find(".timer__empty")),
        e() || this.setupButtonsOld(),
        e() && this.$wnd.addClass("timer--ni"),
        this.registerKeyEvents(),
        this.initialSettings(),
        this.registerSettingsEvents(),
        e() || this.$wnd.appendTo("#centerbox2"),
        (this.settingsWindow = null),
        (this.timer = t);
    }
    createNodeElem(t, i) {
      const s = $(
          '<div class="timer-node"><div class="timer-node__time"></div><div class="timer-node__name"></div><div class="timer-node__world"></div><div class="timer-node__controls"><div class="timer-node__arrow"></div><div class="timer-node__delete"></div></div></div>'
        ),
        o = n(i.expires - window.unix_time());
      s.attr("data-expires", i.expires),
        s.find(".timer-node__time").text(o),
        s.find(".timer-node__name").text(i.name),
        s
          .find(".timer-node__world")
          .text(i.world)
          .toggle(i.world !== d()),
        s.find(".timer-node__arrow").click(() => r(i)),
        s
          .find(".timer-node__delete")
          .click(() => this.timer.askDelete(t, i.name)),
        e()
          ? s.on("contextmenu", (e) => {
              e.preventDefault(), r(i);
            })
          : s.rightClick(() => r(i)),
        this.$nodes.append(s),
        this.sortNodes(),
        this.map.set(t, s),
        this.toggleEmptyMessage();
    }
    updateNodeElem(e, t) {
      const i = this.map.get(e);
      i.find(".timer-node__time").text(n(t)),
        i.toggleClass("timer-node--after", t < 1),
        w.get("highlight") &&
          i.toggleClass(
            "timer-node--highlight",
            t > 0 && t <= w.get("highlightTime")
          );
    }
    removeNodeElem(e) {
      this.map.get(e).remove(), this.map.delete(e), this.toggleEmptyMessage();
    }
    sortNodes() {
      this.$nodes
        .children()
        .sort(function (e, t) {
          return e.dataset.expires - parseInt(t.dataset.expires);
        })
        .appendTo(this.$nodes);
    }
    toggleEmptyMessage() {
      this.$empty.toggle(0 === this.map.size);
    }
    setupButtonsOld() {
      const e = $('<img class="timer__settings">')
          .attr(
            "src",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AQdFBw3UxcpSAAAAp1JREFUKM+dkl1IU3EYxn/ntOF2tjQxzWrWpi4XEWEUpJWyRXjRTW6W3vVBkPYBXlhXUUEFXmiEXZ2ii1ZZpHbTnREl6STQMkz68mNNK2XWcOk6ur/ndLNddNsL79XL8/xeHh7JMAz+Z0wAZQf2sq98ihcTgtCdKRlwApuBaGptQAyYeXK1TkRnDeS0w7ULYWvozpQL2JGdnX3uWXf3w0AgcMVisZxvbm5+4CkpOQIo/xDltWEAR3X1wWslm0oc70dGkllZWfbjx49VBPzV23Nz83JUVR0DKv0XHr0FpiXDMJAkSQIqm5qa2mpq/FuTS0kSiQRCCMxmM7Is86C9/WOhq1APBoNdX0ZHb6RfdVoslkP9oZC2sJAgHo8zPDy8fDcYXBx6O6RrmkbA7/e4XE533pq8XYDVlBLu7OzoOJqTk6PEYr8YHBwUFy9dDgNjnZ1dRddbW11ud/GKUH//776+UByQ08TFlpaW8NDQG6HrOp8+f54DngJNuq4/j0xG5k0mEx6PR6mqqloHONPCLy97er5PhL9qiqKwvbQ0Q1GUPMBnt9szKysqLEIIHOvXZ9TVHi4FNqbDKfB5vfcaGur3WK3WFbIsYxjGn/HxiW/uTe78rMxM+8zMDA2nTv+IxWIjmqZdTRPF6NjY+Kve3riq3koIIZAkyVpUVFi8LIQ9Go0C4PN6haZp94F36XDikUjkcVvbTa2gwLE/mUwWDwwMLNtsNpxOp3z6zNk5n8+rT05OTgMfgDlSXZWBlcAWh8PRXl9/8qfZbJ4oLy+P3r6lJm02Wy9wCagD8tXGWiTDMNh9ooD8VRpPWmcVoAzYBswDG4BcoBvoAzRgXm2sFSYA/YeTacKkDq+Bd8BSqptW4BcQVxtrjdzVEtFZg78ZdBbKMPDApQAAAABJRU5ErkJggg=="
          )
          .click(this.toggleSettingsWindow),
        t = $('<img class="timer__add">')
          .attr(
            "src",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AQdFSocd3UrSgAAAdZJREFUKM+Vkz+LGlEUxX9vM390HHSVRaI2wXRCLAIbez9A2GIhhbYBG7+InyCVRbqQLUIqP0ISsQoGplmWBxOZMLhqxoyzyk6aK4ixyYPH48E997xzz3mKf5cBWEAGOAMegQ3wAOwOC58cARWQA54CFaAKuIAp4O0xy+FKpfh5s9m8LpfLF8vlMhyPxzfAH+D3KbCS0xbGl91u92273cbzPDqdzi0QAvdAsicypEFWGKtAC7jSWqee5ymtdQpcASsh+QlEQLwfThmoA5fAa6CVzWZxHAfbtpU0BDgHxsAtMFNACXjWaDR6/X7/TS6XyyulSJIE13UpFotEUcRms8EwjNVgMPgwmUzeAXeG2JG1LKvmOE7esiwcxyEIApIkIU1TarUaURSRyWTytm3XROaZIT7G8/ncH41GqyRJ8oVCgXq9TqlUIgxDptMpi8UC13VXs9nMB2Lg0ZAALLXWH7XWd3vNvV6PSqWC7/sMh0OAr8Bn0bwENoaY/0t8nAMLGc6rOI6VaZop8A14Lw32034wJHKR7HsJSn673baCIGC9XivgE/AF+HHoszqR7QrwolqtXpumebHb7ULf92+A78DsOMvHd1d8PwcckbMQaZG87CT4v37VX1hYsKX7PoKDAAAAAElFTkSuQmCC"
          )
          .click(() => this.timer.toggleAddWindow());
      this.$wnd.append(e, t);
    }
    setupButtonsNew() {
      const e = Engine.serverStorage.get(
        Engine.interface.getPathToHotWidgetVersion(),
        "timer-ni-si"
      );
      if (e) this.addWidgetButtonNew(e[0], e[1]);
      else {
        let e = Engine.interface.getFirstEmptyWidgetSlot();
        const t = {
          [Engine.interface.getPathToHotWidgetVersion()]: {
            "timer-ni-si": [e.slot, e.container],
          },
        };
        Engine.serverStorage.sendData(t, () =>
          this.addWidgetButtonNew(e.slot, e.container)
        );
      }
    }
    addWidgetButtonNew(e, t) {
      Engine.interface.addKeyToDefaultWidgetSet(
        "timer-ni-si",
        e,
        t,
        "Minutnik <em>(PPM aby dodać wpis)</em>",
        "red",
        () => this.toggleSettingsWindow()
      ),
        Engine.interface.alreadyInitialised &&
          Engine.interface.addWidgetButtons(),
        $(".main-buttons-container").on(
          "contextmenu",
          ".widget-timer-ni-si",
          (e) => {
            e.preventDefault(), this.timer.toggleAddWindow();
          }
        );
    }
    toggleSettingsWindow() {
      this.settingsWindow || (this.settingsWindow = new x()),
        this.settingsWindow.toggle();
    }
    registerKeyEvents() {
      document.addEventListener("keydown", (e) => {
        this.onActiveKey(e, !0);
      }),
        document.addEventListener("keyup", (e) => {
          this.onActiveKey(e, !1);
        }),
        window.addEventListener("blur", (e) => {
          w.get("alwaysActive") || this.$wnd.toggleClass("timer--active", !1);
        });
    }
    onActiveKey(e, t = !0) {
      ["input", "textarea"].includes(e.target.tagName.toLowerCase()) ||
        ("ControlLeft" === e.code &&
          (w.get("alwaysActive") || this.$wnd.toggleClass("timer--active", t)));
    }
    initialSettings() {
      this.$wnd.css({
        fontSize: w.get("size") + "px",
        opacity: w.get("opacity"),
      }),
        this.onFloating(w.get("floating")),
        this.onAlwaysActive(w.get("alwaysActive")),
        this.onMoveBookmarks(w.get("moveBookmarks"));
    }
    registerSettingsEvents() {
      w.emitter.on("opacity", (e) => this.$wnd.css("opacity", e)),
        w.emitter.on("size", (e) => this.$wnd.css("fontSize", e + "px")),
        w.emitter.on("floating", (e) => this.onFloating(e)),
        w.emitter.on("alwaysActive", (e) => this.onAlwaysActive(e)),
        w.emitter.on("moveBookmarks", (e) => this.onMoveBookmarks(e));
    }
    onMoveBookmarks(t) {
      e() ||
        (t
          ? $("#bookmarks").css("left", "230px")
          : $("#bookmarks").css("left", 0));
    }
    onFloating(t) {
      if (t) {
        e() && this.$wnd.detach().appendTo(".alerts-layer");
        const { x: t, y: i } = w.get("floatingPos");
        this.$wnd
          .draggable({
            containment: "body",
            cancel: ".timer__settings, .timer__add",
            start: () => {
              m().add("timer-draggable");
            },
            stop: (e, t) => {
              m().remove("timer-draggable"),
                w.set("floatingPos", { x: t.position.left, y: t.position.top });
            },
          })
          .addClass("timer--floating")
          .css({ top: i + "px", left: t + "px" }),
          $("body").css("height", "100vh");
      } else {
        if (
          (e() && this.$wnd.detach().appendTo(".game-layer"),
          !this.$wnd.is(":ui-draggable"))
        )
          return;
        this.$wnd
          .draggable("destroy")
          .css({ left: 0, top: 0 })
          .removeClass("timer--floating"),
          w.set("floatingPos", { x: 0, y: 0 }),
          $("body").css("height", "none");
      }
    }
    onAlwaysActive(e) {
      this.$wnd.toggleClass("timer--active", e);
    }
  }
  class _ {
    constructor(e) {
      (this.timer = e), (this.lock = m());
    }
    toggle() {
      this.$wnd ? (this.resetInputs(), this.$wnd.toggle()) : this.init(),
        this.toggleLock();
    }
    toggleLock() {
      this.lock.check("timer-add")
        ? this.lock.remove("timer-add")
        : this.lock.add("timer-add");
    }
    init() {
      (this.$wnd = $(
        '<div class="timer-add"><form class="timer-add__form"><input type="number" min="0" placeholder="HH" name="hours"> : <input type="number" min="0" max="60" placeholder="MM" name="minutes"> : <input type="number" placeholder="SS" name="seconds"> <input type="text" placeholder="Nazwa" name="name" minlength="3" maxlength="50" required> <input type="submit" value="Dodaj"></form><button class="timer-add__close">Anuluj</button></div>'
      )),
        this.$wnd.find(".timer-add__form").submit((e) => this.onSubmit(e)),
        this.$wnd.find(".timer-add__close").click(() => this.toggle()),
        this.$wnd.appendTo(e() ? ".alerts-layer" : "body"),
        e() ? this.center() : this.$wnd.absCenter();
    }
    onSubmit(e) {
      const t = new FormData(e.target),
        i = Object.fromEntries(t);
      this.addNode(i),
        window.message("Dodano nowy wpis"),
        this.$wnd.toggle(),
        this.toggleLock(),
        e.preventDefault();
    }
    addNode({ hours: e, minutes: t, seconds: i, name: s }) {
      const n = 3600 * e + 60 * t + +i,
        o = a({ name: s, world: d() }),
        r = { name: s, expires: window.unix_time() + n };
      this.timer.addNode(o, r);
    }
    resetInputs() {
      this.$wnd.find('input[type="text"], input[type="number"]').val("");
    }
    center() {
      var e = $("body").width(),
        t = $("body").height();
      let i = e / 2 - this.$wnd.outerWidth() / 2,
        s = t / 2 - this.$wnd.outerHeight() / 2;
      i < 0 && (i = 0),
        s < 0 && (s = 0),
        this.$wnd.css({ top: s + "px", left: i + "px" });
    }
  }
  (window.Timer = new (class {
    constructor() {
      (this.nodes = null),
        (this.lastTs = 0),
        (this.crossStorage = e() ? Engine.crossStorage : g.crossStorage),
        (this.widget = new k(this)),
        p(
          '.timer-add{position:absolute;box-shadow:0 0 0 1px #010101,0 0 0 2px #ccc,0 0 0 3px #0c0d0d,2px 2px 3px 3px rgba(12,13,13,.4);border-radius:2px;background:rgba(0,0,0,.7);z-index:460;padding:4px;pointer-events:auto}.timer-add,.timer-add .timer-add__form{display:flex;align-items:center}.timer-add .timer-add__form *{margin:0 .2em}.timer-add input[type=number]{width:3em}.timer-add input[type=number],.timer-add input[type=text]{border:0;background:none;border:1px solid hsla(0,0%,100%,.3);color:#fff;padding:5px}.timer{position:absolute;color:#fff;font-size:15px;z-index:340;font-family:sans-serif;background:linear-gradient(90deg,rgba(0,0,0,.8) 0,rgba(0,0,0,.8) 40%,transparent);opacity:.7;pointer-events:none;display:inline-block}.timer--ni:not(.timer--floating){padding-left:5px}.timer__empty{padding:5px 20px;color:grey;font-weight:700;display:none}.timer:not(.timer--floating) .timer__empty{display:none!important}.timer-node{padding:3px 6px;cursor:default;text-transform:uppercase;color:#fff;transition:color 1s;display:flex;max-width:200px;align-items:center;font-weight:700}.timer-node--after{color:#ff0}.timer-node--highlight .timer-node__time{color:orange}.timer-node__time{font-variant-numeric:tabular-nums}.timer-node__world{font-size:.7em;font-weight:400}.timer-node__world:before{content:"("}.timer-node__world:after{content:")"}.timer-node__name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0 .3em}.timer--floating{box-shadow:0 0 0 1px #010101,0 0 0 2px #ccc,0 0 0 3px #0c0d0d,2px 2px 3px 3px rgba(12,13,13,.4);border-radius:2px;background:rgba(0,0,0,.7);z-index:460}.timer--floating .timer__empty{display:block}.timer__settings{position:absolute;width:20px;height:20px;cursor:pointer;left:-32px;top:-30px;pointer-events:all}.timer--floating .timer__settings{top:-25px;left:0}.timer__add{width:20px;height:20px;position:absolute;cursor:pointer;pointer-events:all;top:-30px;left:-52px}.timer--floating .timer__add{top:-25px;left:22px}.timer--active{pointer-events:all;opacity:1!important}.timer--active .timer-node{max-width:none!important}.timer-node__delete{cursor:pointer;position:relative;width:.7em;height:.7em;padding-top:2px}.timer-node__delete:before{transform:rotate(45deg)}.timer-node__delete:after{transform:rotate(-45deg)}.timer-node__delete:after,.timer-node__delete:before{position:absolute;left:.5em;content:" ";height:.7em;width:2px;background-color:red}.timer-node__arrow{padding:0 .2em;cursor:pointer;position:relative;display:block;height:.9em;color:#fff;line-height:.85em}.timer-node__arrow:before{content:"\\203A\\203A"}.timer-node__controls{display:none;margin-left:auto;padding-left:.5em;align-items:center}.timer-node__controls div{margin:0 .2em}.timer--active .timer-node__controls{display:flex}.widget-button .timer-ni-si{background:url(../img/gui/addons-icons.png);background-position:-438px -3px}'
        ),
        this.registerGameEvents(),
        this.registerResetTitleEvent(),
        this.preloadAudio(),
        this.initNodes(),
        this.checkFirstRun();
    }
    update() {
      const e = window.unix_time();
      if (e <= this.lastTs) return;
      this.lastTs = e;
      let t = null;
      var i, s;
      this.nodes.forEach((i, s) => {
        (!t || i.expires < t.expires) && (t = i), this.updateNode(s, i, e);
      }),
        w.get("title") &&
          document.hidden &&
          (t
            ? ((i = t.expires - e),
              (s = t.name),
              (document.title = `${n(i)} ${s}`))
            : o());
    }
    updateNode(e, t, i) {
      const s = t.expires - i;
      if ((this.widget.updateNodeElem(e, s), s < -w.get("deleteTime")))
        return this.deleteNode(e);
      w.get("highlight") &&
        w.get("alertHighlight") &&
        s == w.get("highlightTime") &&
        b.play(w.get("alertHighlightUrl"));
    }
    deleteNode(e) {
      this.nodes.has(e) &&
        (this.widget.removeNodeElem(e), this.nodes.delete(e), this.save());
    }
    addNode(e, t) {
      this.nodes.has(e) && this.deleteNode(e),
        (t = { ...t, aid: l(), cid: c(), world: d() }),
        this.widget.createNodeElem(e, t),
        this.nodes.set(e, t),
        this.save();
    }
    registerGameEvents() {
      e()
        ? (API.addCallbackToEvent("newNpc", (e) => {
            this.onRespawn(e.d.id, e.d);
          }),
          API.addCallbackToEvent("removeNpc", (e) => {
            i(e.d) && this.onKill(e.d);
          }))
        : t(window, "newNpc", (t) => {
            for (let s in t)
              !t[s].del ||
              !isset(g.npc[s]) ||
              (e() ? Engine.hero.d.stasis : hero.stasis) ||
              (window.isset(g.gameLoader) &&
                !1 === g.gameLoader.steps.map.status) ||
              !i(g.npc[s])
                ? isset(g.npc[s]) || this.onRespawn(s, t[s])
                : this.onKill(g.npc[s]);
          });
    }
    onKill(e) {
      if (!s(e.wt) && !this.canAddEliteFirst(e)) return;
      const t = a({ id: e.id, world: d() }),
        i = ((h, t) => {
          if(e.nick == "Amigo de Locos")
          {
            return 1800;
          }else{
          const i = h > 200 ? 18 : 0.7 + 0.18 * h - 45e-5 * h * h;
          return Math.round((60 * i * 1) / t);
          }
        })(e.lvl, w.get("multiplier")),
        n = { name: e.nick, expires: window.unix_time() + i };
      this.addNode(t, n);
    }
    onRespawn(e, t) {
      (s(t.wt) || this.canAddEliteFirst(t)) &&
        (w.get("alertRespawn") && b.play(w.get("alertRespawnUrl")),
        this.deleteNode(a({ id: e, world: d() })));
    }
    save() {
      const e = JSON.stringify(Array.from(this.nodes));
      this.crossStorage.set("timer/nodes", e);
    }
    initNodes() {
      this.crossStorage.storage
        .onConnect()
        .then(() => this.crossStorage.get("timer/nodes"))
        .then((t) => {
          (this.nodes = new Map(JSON.parse(t))),
            e() ? this.start() : g.loadQueue.push({ fun: () => this.start() });
        });
    }
    start() {
      this.nodes.forEach((e, t) => this.widget.createNodeElem(t, e)),
        (this.interval = setInterval(() => {
          this.update();
        }, 1e3));
    }
    canAddEliteFirst(e) {
      return (
        (t = e.wt) > 9 && t < 20 && w.get("elitesFirst") && y.check(e.nick)
      );
      var t;
    }
    askDelete(e, t) {
      h(`Chcesz usunąć "${t}" z Minutnika?`, [
        () => this.deleteNode(e),
        () => {},
      ]);
    }
    checkFirstRun() {
      if (!w.get("firstRun")) return;
      h(
        "Uruchamiasz Minutnik po raz pierwszy. Chcesz otworzyć okienko konfiguracji?",
        [() => this.widget.toggleSettingsWindow(), () => {}]
      ),
        w.set("firstRun", !1),
        e() || window.deleteCookie("timer/nodes");
    }
    toggleAddWindow() {
      this.addWindow || (this.addWindow = new _(this)), this.addWindow.toggle();
    }
    registerResetTitleEvent() {
      window.addEventListener("focus", () => {
        w.get("title") && o();
      });
    }
    preloadAudio() {
      w.get("alertRespawn") && b.load(w.get("alertRespawnUrl")),
        w.get("alertHighlight") && b.load(w.get("alertHighlightUrl"));
    }
  })()),
    e() &&
      (async () => {
        for (; !Engine.interfaceStart; )
          await new Promise((e) => setTimeout(e, 100));
        window.Timer.widget.setupButtonsNew();
      })();
})();

// change character

  const APIURL =
    _l() == "pl"
      ? "https://public-api.margonem.pl/account/charlist"
      : "https://public-api.margonem.com/account/charlist";

  function setTip($el, txt, ctip = "") {
    $el.setAttribute("tip", txt);
    if (ctip != "") $el.setAttribute("ctip", ctip);
  }

  function getOPath() {
    return window.CFG.opath;
  }

  function getWorld() {
    return g.worldConfig.getWorldName();
  }

  const settings = new (function () {
    const path = "priw8-change-character/";
    const Storage = margoStorage;
    this.set = function (p, val) {
      Storage.set(path + p, val);
    };
    this.get = function (p, defaultValue) {
      return Storage.get(path + p) || defaultValue;
    };
    this.remove = function (p) {
      try {
        Storage.remove(path + p);
      } catch (e) {}
    };
  })();

  function initCSS() {
    const css = `
.priw8-change-character-wrapper {
    display: flex;
    position: absolute;
    top: -36px;
    left: 520px;
}
.priw8-change-character-char {
    width: 32px;
    height: 48px;
    cursor: pointer;
    transition: .1s linear transform;
}
.priw8-change-character-char:hover {
    transform: translateY(-8px);
}

#corners {
    pointer-events: none;
}

.priw8-change-character-settings {
    position: absolute;
    z-index: 500;
    background: rgba(0, 0, 0, 0.65);
    width: 386px;
    font-family: sans-serif;
    font-size: 14px;
    border: 1px solid #333333;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #CCCCCC;
}
.priw8-change-character-settings-title {
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid #333333;
}
.priw8-change-character-settings-content {
    padding: 5px;
}
.priw8-change-character-radios {
    padding-top: 5px;
    padding-bottom: 5px;
}
#priw8-change-character-custom-input {
    color: #CCCCCC;
    background: rgba(50, 50, 50, 0.7);
    border: 1px solid black;
}
#priw8-change-character-save {
    color: #CCCCCC;
    background: rgba(50, 50, 50, 0.7);
    border: 1px solid black;
    font-weight: bold;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
}
#priw8-change-character-save:hover {
    background: rgba(70, 70, 70, 0.7);
}
`;
    const $style = document.createElement("style");
    $style.innerHTML = css;
    document.head.appendChild($style);
  }

  function getCharacterTip(char) {
    return `<b>${char.nick}</b>Lvl: ${char.lvl}${char.prof}`;
  }

  function getCurrentCharID() {
    return hero.id;
  }

  function getAID() {
    return getCookie("user_id");
  }

  function relog(id) {
    if (id != getCurrentCharID()) {
      const d = new Date();
      d.setTime(d.getTime() + 3600000 * 24 * 30);
      setCookie(
        "mchar_id",
        id,
        d,
        "/",
        `margonem.${_l() == "pl" ? "pl" : "com"}`
      );
      location.replace(location.href);
    }
  }

  function onClick(e) {
    if (e.target.classList.contains("priw8-change-character-char")) {
      relog(e.target.dataset.id);
    }
  }

  function onContextMenu(e) {
    e.preventDefault();
    openSettings();
  }

  function getSettingsWindow() {
    return document.querySelector(".priw8-change-character-settings");
  }

  function saveSettings() {
    const $wnd = getSettingsWindow();
    if (!$wnd) return;

    const $selectedRadio = $wnd.querySelector(
      '[name="priw8-change-character"]:checked'
    );
    if ($selectedRadio) settings.set("order", $selectedRadio.value);

    const $customOrder = $wnd.querySelector(
      "#priw8-change-character-custom-input"
    );
    const customChars = $customOrder.value.split(",");
    for (let i = 0; i < customChars.length; ++i) {
      customChars[i] = customChars[i].trim();
    }
    settings.set("customOrder", customChars);

    reloadCharacters();

    $wnd.parentElement.removeChild($wnd);
  }

  function openSettings() {
    if (getSettingsWindow()) return;

    const $settingWindow = document.createElement("div");
    $settingWindow.classList.add("priw8-change-character-settings");
    $settingWindow.innerHTML = `
<div class="priw8-change-character-settings-title">Change Character - ustawienia</div>
<div class="priw8-change-character-settings-content">
    Sortuj postacie według:
    <div class="priw8-change-character-radios">
        <div>
            <input type="radio" name="priw8-change-character" value="id" id="priw8-change-character-id">
            <label for="priw8-change-character-id">kolejności utworzenia</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="lvlup" id="priw8-change-character-lvlup">
            <label for="priw8-change-character-lvlup">poziomu (rosnąco)</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="lvldown" id="priw8-change-character-lvldown">
            <label for="priw8-change-character-lvldown">poziomu (malejąco)</label>
        </div>
        <div>
            <input type="radio" name="priw8-change-character" value="abc" id="priw8-change-character-abc">
            <label for="priw8-change-character-abc">alfabetycznie</label>
        </div>
        <div id="priw8-change-character-custom-tip">
            <input type="radio" name="priw8-change-character" value="custom" id="priw8-change-character-custom">
            <label for="priw8-change-character-custom">własna kolejność:</label>
            <input id="priw8-change-character-custom-input">
        </div>
    </div>
    <button id="priw8-change-character-save">Zapisz i zamknij</div>
</div>
`;
    setTip(
      $settingWindow.querySelector("#priw8-change-character-custom-tip"),
      "Wpisz nicki postaci oddzielone przecinkami w takiej kolejności, w jakiej mają być wyświetlane."
    );
    $settingWindow
      .querySelector("#priw8-change-character-save")
      .addEventListener("click", saveSettings);

    const sortOrder = settings.get("order", "id");
    const $selectedRadio = $settingWindow.querySelector(
      '[name="priw8-change-character"][value="' + sortOrder + '"]'
    );
    if ($selectedRadio) {
      $selectedRadio.checked = true;
    }

    const customChars = settings.get("customOrder", []);
    const $customOrder = $settingWindow.querySelector(
      "#priw8-change-character-custom-input"
    );
    $customOrder.value = customChars.join(", ");

    document.body.appendChild($settingWindow);
  }

  async function getCharacterData() {
    const res = await fetch(`${APIURL}?hs3=${getCookie("hs3")}`, {
      credentials: "include",
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        console.error(
          "[ChangeCharacter] getCharacterData: bad API response",
          data
        );
        return getCharacterFallbackData();
      }
      if (data.length == 0) {
        console.error(
          "[ChangeCharacter] getCharacterData: got empty array from API"
        );
        return getCharacterFallbackData();
      }
      settings.set(`fallback/${getAID()}`, data);
      return data;
    } catch (e) {
      console.error(
        "[ChangeCharacter] getCharacterData: bad json (invalid credentials?)",
        text
      );
      return getCharacterFallbackData();
    }
  }

  function getCharacterFallbackData() {
    return settings.get(`fallback/${getAID()}`, []);
  }

  function filterCharactersByWorld(chars, world) {
    return chars.filter((char) => char.world == world);
  }

  function createCharacterWrapper() {
    const $existingWrapper = document.querySelector(
      ".priw8-change-character-wrapper"
    );
    if ($existingWrapper) {
      $existingWrapper.innerHTML = "";
      return $existingWrapper;
    }

    const $wrapper = document.createElement("div");
    document.querySelector("#centerbox2").appendChild($wrapper);
    $wrapper.classList.add("priw8-change-character-wrapper");
    $wrapper.addEventListener("click", onClick);
    $wrapper.addEventListener("contextmenu", onContextMenu);
    return $wrapper;
  }

  function createCharacterElement(char) {
    const $char = document.createElement("div");
    setTip($char, getCharacterTip(char), "t_other");
    Object.assign($char.style, {
      "background-image": `url(${getOPath()}${char.icon})`,
    });
    $char.classList.add("priw8-change-character-char");
    $char.dataset.id = char.id;
    return $char;
  }

  function onGameLoad(clb) {
    g.loadQueue.push({
      fun: clb,
    });
  }

  async function reloadCharacters() {
    const chars = await getCharacterData();
    createAndFillWrapper(chars);
  }

  function sortCharacters(chars) {
    const sortMode = settings.get("order", "id");
    if (sortMode == "id") {
      chars.sort((a, b) => a.id - b.id);
    } else if (sortMode == "lvlup") {
      chars.sort((a, b) => a.lvl - b.lvl);
    } else if (sortMode == "lvldown") {
      chars.sort((a, b) => b.lvl - a.lvl);
    } else if (sortMode == "abc") {
      chars.sort((a, b) => a.nick.localeCompare(b.nick));
    } else if (sortMode == "custom") {
      const charWeights = {};
      const charOrder = settings.get("customOrder", []);
      for (let i = 0; i < charOrder.length; ++i) {
        charWeights[charOrder[i].toLowerCase()] = i;
      }
      chars.sort((a, b) => {
        return (
          charWeights[a.nick.toLowerCase()] - charWeights[b.nick.toLowerCase()]
        );
      });
    }
  }

  function createAndFillWrapper(chars) {
    const charsOnThisWorld = filterCharactersByWorld(chars, getWorld());
    sortCharacters(charsOnThisWorld);

    const $wrapper = createCharacterWrapper();

    for (const char of charsOnThisWorld) {
      $wrapper.appendChild(createCharacterElement(char));
    }
  }

  async function init() {
    initCSS();

    if (localStorage.getItem("CSpriv") != null) {
      localStorage.removeItem("CSpriv");
    }

    const chars = await getCharacterData();
    onGameLoad(() => createAndFillWrapper(chars));
  }

  init();


// quickgrup qg
var d = new Date();
d.setTime(d.getTime() + 2592000000);
if (getCookie("acceptGrp") == null) setCookie("acceptGrp", "false", d);

var acceptGrp = mAlert;
mAlert = function (a, c, d, b) {
  acceptGrp(a, c, d, b);
  if (
    getCookie("acceptGrp") == "true" &&
    a.indexOf("Czy chcesz dołączyć do drużyny gracza") != -1
  )
    $("#a_ok").click();
};

g.loadQueue.push({
  fun: function () {
    $(
      '<div id="checkboxgrp">Automatyczne przyjmowanie zaproszeń do grupy</div>'
    )
      .appendTo("#cfg_options")
      .click(function () {
        if (
          $("#checkboxgrp").attr("style") == "background-color: green"
        ) {
          $("#checkboxgrp").attr("style", "background-color: red");
          setCookie("acceptGrp", "false", d);
        } else {
          $("#checkboxgrp").attr("style", "background-color: green");
          setCookie("acceptGrp", "true", d);
        }
      });
    if (getCookie("acceptGrp") == "true")
      $("#checkboxgrp").attr("style", "background-color: green");
    else $("#checkboxgrp").attr("style", "background-color: red");
  },
  data: "",
});

// zap pod k


$(document).keyup(function (e) {
  if (
    e.which == 75 &&
    e.target.tagName != "TEXTAREA" &&
    e.target.tagName != "INPUT"
  ) {
    for (n in g.other) {
      if (
        Math.abs(hero.x - g.other[n].x) <= 1 &&
        Math.abs(hero.y - g.other[n].y) <= 1 &&
        !isset(g.party[n])
      ) {
        _g("party&a=inv&id=" + n);
      }
    }
  }
});

// item id

(function (g, showDialog, $) {
  var $style = $(`<style>
      .itemid-window {
        padding: 5px;
      }
      .itemid-window > div {
        text-align: center;
        margin-bottom: 5px;
      }
      .itemid-window .item-name {
        font-weight: bold;
      }
      .itemid-window .item-id input {
        text-align: center;
      }
      .itemid-window .item-slot {
        margin: 8px auto;
        width: 32px;
        height: 32px;
        background: #0B3201;
        border: 2px solid white;
      }
    </style>`);

  function onclick(event) {
    event.preventDefault();
    var id = $(this).attr("id").substring(4);
    var item = g.item[id];

    if (!item) {
      return;
    }

    var $clone = $(this)
      .clone()
      .css({
        top: "",
        left: "",
      })
      .addClass("phantom");

    var $window = $(`<div class="itemid-window">
        <div class="item-name"></div>
        <div class="item-id">
          <input type="text"></input>
          <button class="select">Zaznacz</button>
        </div>
        <div class="item-slot"></div>
      </div>`);

    $window.find(".item-name").text(item.name);
    $window.find(".item-slot").append($clone);

    var $input = $window.find(".item-id > input");
    $input.val("ITEM#" + item.hid + "." + g.worldConfig.getWorldName());
    $window.find(".item-id > button.select").click(function () {
      $input.select();
    });

    showDialog("Skopiuj numery przedmiotu", $window);
  }

  $("head").append($style);
  $("body").delegate(".item:not(.phantom)", "contextmenu", onclick);
})(g, showDialog, jQuery);

// powiekszenie okna grp

!(function () {
  const $style = document.createElement("style");
  const Storage = window.margoStorage;
  const message = window.message;
  $style.innerHTML = `

.player-icon {
    text-align: center; 
    float: left; 
    width: 32px;
    height: 32px;
}

.lifebar-container {
    float: left;
    text-align: center;
    font-size: 80%;
    margin-top: 10px;
}

.lifebar-back {
    margin: auto;
    border-radius: 2px; 
    width: 48px; 
    height: 4px; 
    border: 1px solid #000000; 
    background: gray;
}

.lifebar-in {
    height: 4px;
}

#party.expanded {
    background-image: url(https://imgur.com/JiWSss9.png);
    width: 150px;
    left: 362px;
}
    
`;
  document.head.appendChild($style);
  const CFG = {
    colors: [100, "lightgreen", 50, "yellow", 20, "red", 0],
  };
  const formatNumber = window.round;
  const $party = document.getElementById("party");
  function onParty(party) {
    const members = party.members;
    for (let id in members) onMember(members[id]);
    fixPartyOffset();
  }

  function fixPartyOffset() {
    if ($party.style.top != "0px") {
      $party.style.top = `${-$party.offsetHeight}px`;
    }
  }

  function onMember(data) {
    const $el = getPartyMemberElement(data.nick);
    const hpp = (data.hp_cur / data.hp_max) * 100;
    const color = getColorForHp(hpp);
    appendHpp($el.parentElement, color, Math.ceil(hpp));
    appendTip($el, data, color, hpp);
  }

  function getColorForHp(hpp) {
    const cols = CFG.colors;
    for (let i = 0; i < cols.length - 1; i += 2) {
      if (hpp <= cols[i] && hpp >= cols[i + 2]) return cols[i + 1];
    }
    return "";
  }

  function appendHpp($el, color, hpp) {
    const $hpp = document.createElement("span");
    $hpp.innerHTML = ` (${hpp}%)`;
    $hpp.style.color = color;
    $hpp.style["font-size"] = "80%";
    $el.appendChild($hpp);
  }

  function appendTip($el, data, color, hpp) {
    const tip = `
<div class="player-icon" style="background-image: url(https://micc.garmory-cdn.cloud/obrazki/postacie/${
      data.icon
    }"></div>
<div class="lifebar-container">${lifebarHTML(color, hpp)} ${formatNumber(
      data.hp_cur
    )} / ${formatNumber(data.hp_max)}</div>    
`;
    $el.setAttribute("tip", tip);
  }

  function lifebarHTML(color, hpp) {
    return (
      "<div class='lifebar-back'><div class='lifebar-in' style='width: " +
      hpp * 0.48 +
      "px; background: " +
      color +
      ";'></div></div>"
    );
  }

  function getPartyMemberElement(nick) {
    const $els = $party.querySelectorAll(".pm-nick");
    for (let i = 0; i < $els.length; i++) {
      if ($els[i].innerText == nick) return $els[i];
    }
    return null;
  }

  function getExpandState() {
    const state = Storage.get("addons/partyhp/expandParty");
    return state == null ? false : state;
  }

  function setPartySize() {
    if (getExpandState()) {
      $party.querySelector("img").src = "https://i.imgur.com/abMKwhK.png";
      $party.classList.add("expanded");
    }
  }

  function initConfig() {
    const $cfg = document.querySelector("#cfg_options");
    const $btt = document.createElement("div");
    setBttState($btt);
    $btt.addEventListener("click", bttClick.bind($btt));
    $btt.innerHTML = "Powiększ okno grupy";
    $cfg.appendChild($btt);
  }

  function setBttState($btt) {
    if (getExpandState()) $btt.style["background-color"] = "green";
    else $btt.style["background-position"] = "red";
  }

  function bttClick() {
    // this = $btt
    Storage.set("addons/partyhp/expandParty", !getExpandState());
    setBttState(this);
    message("Zmiany będą widoczne po odświeżeniu gry");
  }

  // init data parsing
  const _pI = window.parseInput;
  window.parseInput = function (data) {
    const ret = _pI.apply(this, arguments);
    if (data != null && data.party) onParty(data.party);
    return ret;
  };

  setPartySize();
  initConfig();
})();

// titan helper

!(function () {
  const VER = "2.5";
  const UPDATE = {
    main: "Wersja 2.5a",
    log: [""],
  };

  const CSS = `

.priw-thp-display {
    z-index: 380;
    position: absolute;
    font-family: monospace;
    font-size: 11px;
    color: #efefef;
    pointer-events: none;
}
.priw-thp-display.new {
    top: 50px;
}

.priw-thp-display-list {
    float: left;
    background: rgba(0,0,0,0.7);
    pointer-events: all;
}

.priw-thp-warrior-turns {
    float: left;
    width: 32px;
    pointer-events: all;
}

.priw-thp-warrior-turns-list {
    max-height: 96px;
    overflow: hidden;
}
.expand .priw-thp-warrior-turns-list {
    max-height: unset;
}

.priw-thp-warriors-list-btt {
    width: 32px;
    height: 24px;
    background: rgba(50, 50, 50, 0.7);
    color: white;
    cursor: pointer;
    line-height: 24px;
    text-align: center;
    font-size: 21px;
}

.priw-thp-warrior-turns-warrior {
    box-sizing: border-box;
    border-right: 1px solid #403838;
    border-bottom: 1px solid #403838;
    width: 32px;
    height: 32px;
}

.priw-thp-warrior-turns-warrior div {
    width: 100%;
    height: 100%;
}

.priw-thp-warrior-turns-warrior.hero {
    background: rgba(0, 128, 0, 0.7);
}
.priw-thp-warrior-turns-warrior.ally {
    background: rgba(0, 0, 128, 0.7);
}
.priw-thp-warrior-turns-warrior.enemy {
    background: rgba(128, 0, 0, 0.7);
}

.priw-thp-display.alt-display {
    position: initial;
}

.priw-thp-display-element {
    padding: 2px;
}

titanHelperPlus {
    display: inline-block;
    width: 100%;
    margin-top: 5px;
}

.priw-thp-update-header {
    text-align: center;
}

.priw-thp-update-list {
    text-align: left;
    margin-left: 6px;
}
.priw-thp-update-list.new {
    margin-left: 12px;
}
.priw-thp-update-list span::before {
    content: "\\2022\\00a0";
    margin-left: -10px;
}
.priw-thp-update-list.new span::before {
    margin-left: -7px;
}

    `;
  const BUFF_NAMES = {
    // team buffs
    "aura-sa_per": "Aura SA",
    // "perdmg-blesswords": "Błogosław. mieczy",
    "aura-adddmg2_per-meele": "Błogosław. mieczy",
    "aura-ac_per": "Aura ochrony fiz.",
    "aura-resall": "Aura ochrony mag.",
    "critmval-allies": "Siła kryt. mag.",
    "critval-allies": "Siła kryt. fiz.",

    // team debuffs
    allslow_per: "Spowolnienie",
    alllowdmg: "Emanująca strzała",
    "critmval-enemies": "Siła kryt. mag. wrogów",
    "critval-enemies": "Siła kryt. fiz. wrogów",

    // single buffs
    antidote: "Odp. na truciznę",
    resfire_per: "Odp. na ogień",
    resfrost_per: "Odp. na zimno",
    reslight_per: "Odp. na błyskawice",
    "self-aura-sa": "Dziki zapał",
    sunshield_per: "Tarcza słońca",
    lightshield: "Porażajka/mag. bariera",
    mcurse: "Możliwość klątwy z umki",
    immunity_to_dmg: "Nieśmiertelność",
    shield_buff: "Osłona tarczą",
    rage: "Krwiożerczy szał",
    w_attbuff: "Uderz. zza tarczy (+atak)",
    rampage: "Krwawa szarża",
    achpp_per: "Wzmoc. pancerza",
    ooga_booga: "Okrzyk bojowy",
    b_vamp_time_per: "Amok",

    // onhit selfbuffs
    "+legbon_holytouch": "Dotyk anioła",
    "+critsa_per": "Kryt. przyspiesz.",

    // single debuffs
    "spell-taken_dmg": "Zwiększ. otrzym. obrażeń",
    stinkbomb: "Smierdzący pocisk",
    "-spell-distortion": "Spaczenie",
    energyout: "Zamroczenie",
  };
  const BUFFS = {
    _color: "lime",
    "aura-sa_per": {
      lenMin: 6,
      lenMax: 8,
    },

    "aura-adddmg2_per-meele": {
      lenMin: 5,
      lenMax: 5,
    },
    "aura-ac_per": {
      getLenMin: (msgs) => {
        if (msgs.tcustom === "Werble ochronne") return 10;

        return 6;
      },
      getLenMax: (msgs) => {
        if (msgs.tcustom === "Werble ochronne") return 10;

        return 6;
      },
    },
    "aura-resall": {
      getLenMin: (msgs) => {
        if (msgs.tcustom === "Werble ochronne") return 10;

        return 6;
      },
      getLenMax: (msgs) => {
        if (msgs.tcustom === "Werble ochronne") return 10;

        return 6;
      },
    },
    "critmval-allies": {
      getLenMin: (msgs) => {
        if (msgs.tcustom === "Diabelskie struny") return 10;

        return 7;
      },
      getLenMax: (msgs) => {
        if (msgs.tcustom === "Diabelskie struny") return 10;

        return 7;
      },
    },
    "critval-allies": {
      getLenMin: (msgs) => {
        if (msgs.tcustom === "Diabelskie struny") return 10;

        return 7;
      },
      getLenMax: (msgs) => {
        if (msgs.tcustom === "Diabelskie struny") return 10;

        return 7;
      },
    },
  };
  const SINGLE_BUFFS = {
    _color: "lime",
    antidote: {
      lenMin: 5, // hunter's skill
      lenMax: 7, // mage's skill
    },
    resfire_per: {
      lenMin: 7,
      lenMax: 7,
    },
    resfrost_per: {
      lenMin: 7,
      lenMax: 7,
    },
    reslight_per: {
      lenMin: 7,
      lenMax: 7,
    },
    "self-aura-sa": {
      lenMin: 7,
      lenMax: 7,
    },
    sunshield_per: {
      lenMin: 5,
      lenMax: 5,
    },
    lightshield: {
      lenMin: 7,
      lenMax: 7,
    },
    mcurse: {
      lenMin: 7,
      lenMax: 7,
    },
    immunity_to_dmg: {
      lenMin: 2,
      lenMax: 2,
    },
    shield_buff: {
      lenMin: 1,
      lenMax: 1,
    },
    rage: {
      lenMin: 5, // healing is 5 turns
      lenMax: 6, // redstun is 6 turns
    },
    w_attbuff: {
      lenMin: 3,
      lenMax: 3,
    },
    rampage: {
      lenMin: 6,
      lenMax: 15,
    },
    achpp_per: {
      lenMin: 7,
      lenMax: 7,
    },
    ooga_booga: {
      lenMin: 7,
      lenMax: 7,
    },
    b_vamp_time_per: {
      lenMin: 5,
      lenMax: 5,
    },
  };
  const ONHIT_SELFBUFFS = {
    _color: "lime",
    "+legbon_holytouch": {
      lenMin: 3,
      lenMax: 3,
      nostack: true,
    },
    "+critsa_per": {
      lenMin: 3,
      lenMax: 3,
      nostack: true,
    },
  };
  const DEBUFFS = {
    _color: "#ff8383",
    allslow_per: {
      lenMin: 6,
      lenMax: 8,
    },
    alllowdmg: {
      lenMin: 5,
      lenMax: 5,
    },
    "critmval-enemies": {
      lenMin: 7,
      lenMax: 7,
      overrideColor: "lime",
    },
    "critval-enemies": {
      lenMin: 7,
      lenMax: 7,
      overrideColor: "lime",
    },
  };
  const SINGLE_DEBUFFS = {
    _color: "#ff8383",
    "spell-taken_dmg": {
      lenMin: 4,
      lenMax: 4,
    },
    stinkbomb: {
      lenMin: 7,
      lenMax: 7,
    },
    "-spell-distortion": {
      lenMin: 1,
      lenMax: 1,
    },
    energyout: {
      lenMin: 4,
      lenMax: 4,
    },
  };
  const SINGLE_BUFFS_FROM_TSPELL = {
    // some buffs can only be read directly from tspell name
    "Dziki zapał": "self-aura-sa",
    "Fluid Motions": "self-aura-sa",

    Klątwa: "mcurse",
    Curse: "mcurse",

    "Wewnętrzny spokój": "immunity_to_dmg",
    "Inner Calm": "immunity_to_dmg",

    "Osłona tarczą": "shield_buff",
    "Świetlista osłona": "shield_buff",
    "Shield Master": "shield_buff", // someone made both warrior's and paladin's skills have the same name in .com

    "Krwiożerczy szał": "rage",
    "Tactical Hit": "rage", // yes, that's how it's actually called

    "Uderzenie zza tarczy": "w_attbuff",
    "Wide Swing": "w_attbuff", // I feel like nobody cares about updating spell names there...

    "Krwawa szarża": "rampage",
    Onslaught: "rampage",

    "Okrzyk bojowy": "ooga_booga",
    Rage: "ooga_booga", // epic translations

    Amok: "b_vamp_time_per", // actually has the same name on .com
  };
  const WARRIOR_IGNORE = ["img", "resize", "$"]; // ignore these keys when cloning a warrior object, as they are 1. not needed, 2. circular
  const DBL_TURN_SKILLS = ["Podwójny strzał", "Podwójne trafienie"];

  const LANG = window._l();
  const TIP = "tip"; // property of html elements that contains the tip
  const DISP_TPL = {
    turns: {
      txt: "Wykonane tury: {n}/{max}",
      tip: "Tyle osób zrobiło turę, od kiedy Ty ją ostatnio miałeś/aś.",
    },
    prepare: {
      txt: "Spec: {tspell}",
      tip: "Ładowany przez przeciwnika cios specjalny.",
    },
    buff: {
      txt: "{buff}",
      tip: "Już tyle tur jest w działaniu {name}.",
    },
  };
  const ELEMENTS = ["F", "C", "L"]; // fire, cold, lightning
  const NL = "<br>";
  const TIP_REGEX = /<titanHelperPlus>([\s\S]*?)<\/titanHelperPlus>/g;

  const STUN_REGEX =
    LANG == "pl"
      ? /(.*?) - utrata tury \(redukcja ogłuszenia (.*?)%\)/
      : /(.*?) - lost a turn \(stun reduction (.*?)%\)/;
  const TURN_LOST = LANG == "pl" ? "utrata tury" : "lost a turn";
  const REDSTUN = LANG == "pl" ? "redukcja ogłuszenia" : "stun reduction";
  const DISTRACT = LANG == "pl" ? "wytrącenie z równowagi" : "daze"; // TODO: verify the string for lang=en

  const POWERSTUNS = ["", "-f", "-c", "-l", "-d"]; // postfixes of "stun2"
  const STUNS = ["stun", "freeze"];
  let warriors,
    myTeam,
    $display,
    $displayElementTemplate,
    displays,
    globalBuffs,
    antiFastFight;
  let ongoingBattle = false;
  let Storage = window.margoStorage;

  function error(txt) {
    window.log(`${txt}`, 1);
  }

  function setTip($el, txt) {
    $el.setAttribute("tip", txt);
  }

  function getTip($el) {
    return $el.getAttribute("tip");
  }

  function init() {
    initDataParsing();
    initAntiFastfight();
    initCss();
    initNews();
    initDisplay();
    fightReset();

    window._thpFight = onFight;
  }

  function initNews() {
    window.g.loadQueue.push({
      fun: showNews,
    });
  }

  function showNews() {
    let prevVer = Storage.get("titanHelperPlus/lastver");
    if (prevVer == null || prevVer < VER) {
      Storage.set("titanHelperPlus/lastver", VER);
      let txt = generateUpdateMessageContent();
      window.mAlert(txt, null);
    }
  }

  function generateUpdateMessageContent() {
    let html =
      "<h3 class='priw-thp-update-header'>TitanHelper+ - aktualizacja v" +
      VER +
      "</h3>" +
      NL +
      "<hr>" +
      NL;
    html += UPDATE.main + NL + NL;
    html += "<div class='priw-thp-update-list old'>";
    html += "<b>Zmiany:</b>";
    for (let i = 0; i < UPDATE.log.length; i++) {
      html += NL + "<span>" + UPDATE.log[i] + "</span>";
    }
    html += "</div>";
    return html;
  }

  function initAntiFastfight() {
    let __g = window._g;
    window._g = function (query, arg2) {
      if (ongoingBattle && query == "fight&a=f" && antiFastFight) {
        antiFastFightAsk();
      } else return __g.apply(this, arguments);
    };
  }

  function antiFastFightAsk() {
    let yesClb = function () {
      antiFastFight = false;
      window._g("fight&a=f");
      return true;
    };
    let noClb = function () {
      g.battle.nobut = false;
      window.$("#autobattleButton").stop().fadeIn();

      return true;
    };

    mAlert("Czy na pewno chcesz dać F?", 2, [yesClb, noClb]);
  }

  function initCss() {
    let $style = document.createElement("style");
    $style.innerHTML = CSS;
    document.head.appendChild($style);
  }

  function initDisplay() {
    $display = createDisplay();

    let $parent = document.querySelector("#centerbox2");
    $parent.appendChild($display);

    $displayElementTemplate = document.createElement("div");
    $displayElementTemplate.classList.add("priw-thp-display-element");
  }

  function toggleWarriorList() {
    const $el = $display.querySelector(".priw-thp-warrior-turns");
    $el.classList.toggle("expand");
    Storage.set(
      "titanHelperPlus/expandWarriorList",
      $el.classList.contains("expand")
    );
  }

  function createDisplay() {
    const $display = document.createElement("div");
    $display.classList.add("priw-thp-display", "old");

    const $warriors = document.createElement("div");
    $warriors.classList.add("priw-thp-warrior-turns");
    if (Storage.get("titanHelperPlus/expandWarriorList"))
      $warriors.classList.add("expand");

    const $warriorList = document.createElement("div");
    $warriorList.classList.add("priw-thp-warrior-turns-list");
    const $warriorBtt = document.createElement("div");
    $warriorBtt.classList.add("priw-thp-warriors-list-btt");
    $warriorBtt.addEventListener("click", toggleWarriorList);
    $warriorBtt.innerHTML = "&#9660;";
    $warriorBtt.setAttribute(TIP, "Kliknij, aby zwiększyć/zmiejszyć listę");

    $warriors.appendChild($warriorList);
    $warriors.appendChild($warriorBtt);

    const $list = document.createElement("div");
    $list.classList.add("priw-thp-display-list");

    $display.appendChild($warriors);
    $display.appendChild($list);

    return $display;
  }

  function initDataParsing() {
    let _pI = window.parseInput;
    window.parseInput = function (data) {
      let ret = _pI.apply(this, arguments);
      parseData(data);
      return ret;
    };
  }

  function parseData(data) {
    if (data.f) onFight(data.f);
  }

  function heroId() {
    return window.hero.id;
  }

  function onFight(f) {
    if (f.init) fightInit(f);
    if (f.m) fightParseMessage(f.m);
    if (f.w && !f.init) fightUpdateWarriors(f);
    if (f.m) {
      fightUpdateGlobalBuffs(1);
      fightUpdateGlobalBuffs(2);
    }
    if (f.turns_warriors) fightWarriorTurns(f.turns_warriors);
    if (f.close) fightReset();
    if (f.init) fightTipInit();
  }

  function fightWarriorTurns(warriorTurns) {
    let html = "";
    let cnt = 1;
    for (let ind in warriorTurns) {
      const id = warriorTurns[ind];
      const warrior = warriors[id];
      html += `<div class="priw-thp-warrior-turns-warrior ${
        id == heroId() ? "hero" : warrior.d.team == myTeam ? "ally" : "enemy"
      }" tip="${warrior.d.name} (${warrior.d.lvl}${
        warrior.d.prof
      }) - ${cnt}. w kolejce tur">`;
      html += `<div style="background: url(${
        warrior.d.icon
      }); background-size: ${
        id >= 0 ? "400" : "100"
      }%; background-repeat: no-repeat;"></div>`;
      html += `</div>`;
      ++cnt;
    }
    $display.querySelector(".priw-thp-warrior-turns-list").innerHTML = html;
  }

  function fightReset() {
    for (let id in displays) {
      displays[id].delete();
    }
    displays = {};
    warriors = {};
    globalBuffs = [null, [], []];
    ongoingBattle = false;
    $display.querySelector(".priw-thp-warrior-turns").style.display = "none";
  }

  function fightInit(f) {
    fightReset();
    let myId = heroId();
    for (let id in f.w) {
      let warrior = f.w[id];
      if (id == myId) myTeam = warrior.team;
      warriors[id] = new Warrior(warrior);
    }
    let max = getOthersAliveInTeam(myTeam, myId).length;
    updateTurnDisplay(0, max);
    antiFastFight = determineAntiFastfightState();

    ongoingBattle = true;
    $display.querySelector(".priw-thp-warrior-turns").style.display = "block";
  }

  function determineAntiFastfightState() {
    let myWarriors = selectWarriors([
      {
        key: "team",
        type: "==",
        cmp: myTeam,
      },
    ]);
    let enemyWarriors = selectWarriors([
      {
        key: "team",
        type: "!=",
        cmp: myTeam,
      },
    ]);

    let isGroupPvp =
      enemyWarriors[0].id >= 0 &&
      myWarriors.length > 1 &&
      enemyWarriors.length > 1; // mobs have id < 0
    let playerHasParty = myWarriors.length > 1;
    let isTitanBattle = determineTitanBattle(enemyWarriors[0]);

    return isGroupPvp || (playerHasParty && isTitanBattle);
  }

  function determineTitanBattle(warrior) {
    // check by entity name, because colossi have different NPC ids and warrior ids (instances are weird)
    let npcList = window.g.npc;
    for (let id in npcList) {
      let npc = npcList[id];
      if (npc.nick == warrior.d.nick && npc.d.wt >= 100) return true;
    }
    return false;
  }

  function fightTipInit() {
    for (let id in warriors) warriors[id].updateTip();
  }

  function fightUpdateWarriors(f) {
    for (let id in f.w) {
      let warrior = warriors[id];
      warrior.update(f.w[id]);
    }
  }

  function fightParseMessage(msgs) {
    for (let i = 0; i < msgs.length; i++) {
      let msg = parseOneMessage(msgs[i]);
      interpretOneMessage(msg);
    }
  }

  function parseOneMessage(query) {
    let spl = query.split(";");
    let msgs = {};
    let len = 0;
    let attacker = false;
    let team = false;
    let target = false;
    for (let i = 0; i < spl.length; i++) {
      let msg = spl[i].split("=");
      if (!isNaN(msg[0]) && msg[0] != 0) {
        //msg[0] to indentyfikator gracza
        if (i == 0) {
          attacker = msg[0];
          team = warriors[attacker].d.team;
        } else {
          target = msg[0];
        }
      }
      msgs[msg[0]] = typeof msg[1] == "undefined" ? true : msg[1];
      if (isNaN(msg[0])) {
        len++; //nie liczy identyfikatorów graczy/potworów
      }
    }

    // TODO: detect turn on weird tspells (when a titan uses a tspell and len == 1, it will require making a list of such tspells because there's no other way of detecting it)
    // faktyczna tura jest jeśli w wiadomości nie występują rzeczy typu "xx obrażeń z trucizny" (nazywam to status log), LUB występuje tspell i nie jest to jedyna rzecz (u gracza/potwora), LUB zrobiony jest krok do przodu, LUB ładowany jest spec
    let isTurn =
      msgIsNotStatusLog(msgs) ||
      (msgs.tspell && len > 1) ||
      msgs.step ||
      msgs.prepare;

    return {
      msgs: msgs,
      length: len,
      attacker: attacker,
      target: target,
      team: team,
      isTurn: isTurn,
    };
  }

  function getBuffLenMin(buf, msg) {
    if (typeof buf.lenMin != "undefined") return buf.lenMin;
    else if (typeof buf.getLenMin != "undefined") return buf.getLenMin(msg);
    else {
      error("bad buff data: " + JSON.stringify(buf));
      return 0;
    }
  }

  function getBuffLenMax(buf, msg) {
    if (typeof buf.lenMax != "undefined") return buf.lenMax;
    else if (typeof buf.getLenMax != "undefined") return buf.getLenMax(msg);
    else {
      error("bad buff data: " + JSON.stringify(buf));
      return 0;
    }
  }

  function interpretOneMessage(data) {
    let msgs = data.msgs;
    let attacker = data.attacker ? warriors[data.attacker] : false;
    let target = data.target ? warriors[data.target] : false;
    let turns = 1;

    if (msgs["+fastarrow"]) turns = turns / 4;

    if (attacker && data.isTurn) attacker.turn(turns);

    if (msgs.txt) interpretMsgTxt(msgs.txt);

    if (msgs.tspell) attacker.setLastTSpell(msgs.tspell);

    if (msgs["-contra"]) target.nextTurnIsCounter();

    if (msgs.prepare) attacker.prepareTSpell(msgs.prepare);
    if (attacker.prepare && !msgs.prepare && data.isTurn)
      attacker.stopPrepareTSpell();
    if (msgs["+dispel"]) target.stopPrepareTSpell();

    if (msgs["+legbon_curse"] || msgs["+mcurse"]) target.toggleCurse(true);

    if (msgs["-legbon_glare"]) attacker.toggleGlare(true);

    if (msgs["legbon_lastheal"]) target.lastHeal();

    if (msgs["+distract"]) target.toggleDistract(true);

    for (let i = 0; i < STUNS.length; i++) {
      let stun = "+" + STUNS[i];
      if (msgs[stun]) target.applyStun(1);
    }

    for (let i = 0; i < POWERSTUNS.length; i++) {
      let stun = "+stun2" + POWERSTUNS[i];
      if (msgs[stun]) target.applyStun(2);
    }

    if (msgs["removestun-allies"]) {
      let team = getOthersAliveInTeam(attacker.d.team, attacker.d.id);
      for (let i = 0; i < team.length; i++) team[i].removeStun();
    }

    if (msgs["+acdmg"]) target.lowerAc += parseInt(msgs["+acdmg"]);

    if (msgs["heal_target"]) attacker.healTarget();

    if (msgs["healall_per"]) attacker.healAll();

    if (msgs["+resdmg"]) {
      target.lowerResF += parseInt(msgs["+resdmg"]);
      target.lowerResC += parseInt(msgs["+resdmg"]);
      target.lowerResL += parseInt(msgs["+resdmg"]);
    }
    ELEMENTS.forEach((up) => {
      let low = up.toLowerCase();
      if (msgs["+resdmg" + low])
        target["lowerRes" + up] += parseInt(msgs["+resdmg" + low]);
    });
    if (msgs["+actdmg"]) target["lowerResP"] += parseInt(msgs["+actdmg"]);

    if (msgs["shout"]) attacker.shout(msgs["shout"], target);

    for (let id in BUFFS) {
      if (msgs[id])
        attacker.castTeamBuff(
          id,
          msgs[id],
          getBuffLenMin(BUFFS[id], msgs),
          getBuffLenMax(BUFFS[id], msgs)
        );
    }

    let buffTarget = target ? target : attacker;
    for (let id in SINGLE_BUFFS) {
      if (msgs[id])
        buffTarget.buff(
          id,
          msgs[id],
          getBuffLenMin(SINGLE_BUFFS[id], msgs),
          getBuffLenMax(SINGLE_BUFFS[id], msgs)
        );
    }

    for (let id in ONHIT_SELFBUFFS) {
      if (msgs[id])
        attacker.buff(
          id,
          msgs[id],
          getBuffLenMin(ONHIT_SELFBUFFS[id], msgs),
          getBuffLenMax(ONHIT_SELFBUFFS[id], msgs)
        );
    }

    for (let name in SINGLE_BUFFS_FROM_TSPELL) {
      let id = SINGLE_BUFFS_FROM_TSPELL[name];
      if (msgs["tspell"] == name)
        attacker.buff(
          id,
          false,
          getBuffLenMin(SINGLE_BUFFS[id], msgs),
          getBuffLenMax(SINGLE_BUFFS[id], msgs)
        );
    }

    for (let id in DEBUFFS) {
      if (msgs[id])
        attacker.castTeamDebuff(
          id,
          msgs[id],
          getBuffLenMin(DEBUFFS[id], msgs),
          getBuffLenMax(DEBUFFS[id], msgs)
        );
    }

    for (let id in SINGLE_DEBUFFS) {
      if (msgs[id])
        target.buff(
          id,
          msgs[id],
          getBuffLenMin(SINGLE_DEBUFFS[id], msgs),
          getBuffLenMax(SINGLE_DEBUFFS[id], msgs)
        );
    }
  }

  function interpretMsgTxt(txt) {
    if (txt.indexOf(TURN_LOST) != -1 || txt.indexOf(DISTRACT)) {
      // LANG!!!
      let nick = txt.split("-")[0].trim();
      for (let id in warriors) {
        if (warriors[id].d.name == nick) interpretTurnLost(txt, warriors[id]);
      }
    }
  }

  function interpretTurnLost(txt, warrior) {
    let turns = 1;
    if (txt.indexOf(REDSTUN) > -1) {
      // LANG!!!
      let match = txt.match(STUN_REGEX);
      let res = match[2] / 100;
      turns = 1 - res;
    }
    if (warrior.prepare) warrior.stopPrepareTSpell();
    warrior.turn(turns);
  }

  function msgIsNotStatusLog(msgs) {
    let logStats = [
      "heal",
      "legbon_holytouch_heal",
      "poison",
      "wound",
      "fire",
      "critwound",
      "injure",
      "light",
      "frost",
      "tspell",
      "winner",
      "loser",
      "txt",
      "tcustom",
    ];
    for (let i = 0; i < logStats.length; i++) {
      if (msgs[logStats[i]]) return false;
    }
    return true;
  }

  function fightUpdateGlobalBuffs(team) {
    let isMyTeam = team == myTeam;
    let allowedBuffs = isMyTeam ? BUFFS : DEBUFFS;

    // get simplified form of buffs of each warrior in team for comparison purposes
    let warriorBuffs = {};
    let buffIds = [];
    for (let id in warriors) {
      let warrior = warriors[id];
      if (warrior.d.team != team || warrior.d.hpp == 0) continue;
      warriorBuffs[id] = {};
      let buffs = warrior.getActiveBuffs(true);
      for (let buffId in buffs) {
        if (allowedBuffs[buffId]) {
          if (buffIds.indexOf(buffId) == -1) buffIds.push(buffId);
          let b1 = buffs[buffId][0];
          let b2 = buffs[buffId][1];
          let total =
            warrior.currentTurn -
            b1.turnApplied +
            (b2 ? warrior.currentTurn - b2.turnApplied : 999999);
          warriorBuffs[id][buffId] = total;
        }
      }
    }

    // determine which warriors should be used to display the buff information in the top left corner
    let warriorForBuff = {};
    for (let i = 0; i < buffIds.length; i++) {
      let buffId = buffIds[i];
      let highest = -1;
      let highestId = 0;
      let buffDoesntAffectAll = false;
      for (let id in warriorBuffs) {
        if (typeof warriorBuffs[id][buffId] == "undefined") {
          buffDoesntAffectAll = true;
          break;
        } else if (warriorBuffs[id][buffId] > highest) {
          highest = warriorBuffs[id][buffId];
          highestId = id;
        }
      }
      if (!buffDoesntAffectAll) warriorForBuff[buffId] = highestId;
      else buffIds.splice(buffIds.indexOf(buffId), 1);
    }

    // display the information in the top left corner using the warriors determined earlier
    for (let buffId in warriorForBuff) {
      let id = warriorForBuff[buffId];
      let warrior = warriors[id];
      let active = warrior.getActiveBuffs(true);
      let buffs = active[buffId];
      let str = warrior.getBuffTimeString(buffs, buffId);
      let name = BUFF_NAMES[buffId];
      updateDisplay("buff@" + buffId, {
        buff: str,
        name: name,
      });
    }

    // delete buffs that don't exist anymore from top left corner
    for (let i = 0; i < globalBuffs[team].length; i++) {
      let buffId = globalBuffs[team][i];
      if (buffIds.indexOf(buffId) == -1) deleteDisplay("buff@" + buffId);
    }

    // set which buffs exist now, to check whether they should be deleted next time the function runs
    globalBuffs[team] = buffIds;
  }

  function getOthersAliveInTeam(team, id) {
    return selectWarriors([
      {
        key: "hpp",
        type: ">",
        cmp: 0,
      },
      {
        key: "team",
        type: "==",
        cmp: team,
      },
      {
        key: "id",
        type: "!=",
        cmp: id,
      },
    ]);
  }

  function selectWarriors(filters) {
    let ret = Object.values(warriors);
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      for (let j = 0; j < ret.length; j++) {
        let w = ret[j].d;
        let val = w[filter.key];
        let type = filter.type;
        let cmp = filter.cmp;
        let res = compare(val, type, cmp);
        if (!res) {
          ret.splice(j, 1);
          j--;
        }
      }
    }
    return ret;
  }

  function compare(val1, type, val2) {
    switch (type) {
      case "==":
        return val1 == val2;
      case "!=":
        return val1 != val2;
      case "<":
        return val1 < val2;
      case ">":
        return val1 > val2;
      default:
        error("nieprawidłowe");
        return true;
    }
  }

  function cloneData(data, ignore) {
    if (typeof data != "object") return data;
    let ret = Array.isArray(data) ? [] : {};
    for (let key in data) {
      if (ignore.indexOf(key) != -1) continue;
      if (typeof data[key] == "object") ret[key] = cloneData(data[key], ignore);
      else ret[key] = data[key];
    }
    return ret;
  }

  function getDisplayTemplate() {
    return $displayElementTemplate.cloneNode(true);
  }

  function updateDisplay(id, disp, rgb) {
    if (!displays[id]) {
      let tplId = id.split("@")[0];
      let tpl = DISP_TPL[tplId];
      let display = new DisplayElement(tpl.txt, tpl.tip, disp, rgb, id);
      displays[id] = display;
    } else {
      let display = displays[id];
      display.update(disp, rgb);
    }
  }

  function deleteDisplay(id) {
    let display = displays[id];
    if (display) {
      display.delete();
      delete displays[id];
    }
  }

  function updateTurnDisplay(n, max) {
    if (max) {
      if (n > max) n = max;
      updateDisplay("turns", {
        n: n,
        max: max,
      });
    } else deleteDisplay("turns");
  }

  class DisplayElement {
    constructor(template, tip, disp, rgb, id) {
      this.$ = getDisplayTemplate();
      this.template = template;
      this.tip = tip;
      this.id = id;
      this.update(disp, rgb);
      $display.querySelector(".priw-thp-display-list").appendChild(this.$);
    }
    update(disp, rgb) {
      this.updateText(disp);
      if (rgb) this.updateRgb(rgb);
    }
    updateRgb(rgb) {
      this.$.style.background = "rgba(" + rgb + ", 0.5)";
    }
    updateText(disp) {
      let txt = this.template;
      let tip = this.tip;
      for (let key in disp) {
        txt = txt.replace("{" + key + "}", disp[key]);
        tip = tip.replace("{" + key + "}", disp[key]);
      }
      this.setHTML(txt);
      this.setTip(tip);
    }
    setHTML(html) {
      this.$.innerHTML = html;
    }
    setTip(html) {
      /* Some confusing function names, huh? */
      setTip(this.$, html);
    }
    delete() {
      $display.querySelector(".priw-thp-display-list").removeChild(this.$);
    }
  }

  class Warrior {
    constructor(data) {
      this.d = cloneData(data, WARRIOR_IGNORE);
      this.currentTurn = 0;
      this.teammateTurns = 0;
      this.lowerAc = 0;
      this.lowerResF = 0; // fire
      this.lowerResC = 0; // cold (frost)
      this.lowerResL = 0; // lightning
      this.lowerResP = 0; // poison
      this.tspell = "";
      this.counter = false;
      this.prepare = false;
      this.curse = false;
      this.glare = false;
      this.distract = false;
      this.stun = 0;
      this.shoutTimer = 0;
      this.shoutTarget = null;
      this.targetHealCount = 0;
      this.allHealCount = 0;
      this.wasLastHeal = false;
      this.buffs = {};
      this.$ = this.getMyElement();
    }
    getMyElement() {
      return document.querySelector("#troop" + this.d.id);
    }
    update(data) {
      for (let key in data) {
        this.d[key] = cloneData(data[key], WARRIOR_IGNORE);
      }
      this.updateTip();
    }
    turn(num) {
      let last = this.getLastTSpell();
      let skip = DBL_TURN_SKILLS.indexOf(last) > -1 || this.counter;
      if (skip) {
        this.setLastTSpell("");
        this.counter = false;
      } else {
        this.currentTurn += num;
        this.teammateTurns = 0;
        let team = getOthersAliveInTeam(this.d.team, this.d.id);

        for (let i = 0; i < team.length; i++) team[i].teammateTurn();

        if (this.d.id == heroId()) updateTurnDisplay(0, team.length);

        this.removeOldBuffs();

        this.advanceStuns();

        this.advanceShout();
      }
    }
    advanceStuns() {
      if (this.stun) this.stun--;
      else if (this.distract) this.toggleDistract(false);
      else if (this.glare) this.toggleGlare(false);
      else if (this.curse) this.toggleCurse(false);
    }
    applyStun(n) {
      if (this.stun < n) this.stun = n;
    }
    removeStun() {
      this.stun = 0;
      this.updateTip();
    }
    teammateTurn() {
      this.teammateTurns++;
      if (this.d.id == heroId())
        updateTurnDisplay(
          this.teammateTurns,
          getOthersAliveInTeam(this.d.team, this.d.id).length
        );
    }
    setLastTSpell(tspell) {
      this.tspell = tspell;
    }
    getLastTSpell() {
      return this.tspell;
    }
    nextTurnIsCounter() {
      this.counter = true;
    }
    prepareTSpell(tspell) {
      this.prepare = tspell;
      updateDisplay(
        "prepare",
        {
          tspell: tspell,
        },
        "255, 0, 0"
      );
    }
    stopPrepareTSpell() {
      deleteDisplay("prepare");
      this.prepare = false;
    }
    toggleCurse(state) {
      this.curse = state;
      if (state && this.prepare) this.stopPrepareTSpell();
    }
    toggleDistract(state) {
      this.distract = state;
      if (state && this.prepare) this.stopPrepareTSpell();
    }
    toggleGlare(state) {
      this.glare = state;
    }
    shout(targetsStr, target) {
      // the problem here is, what if there are 2 or more warriors with the same name?
      // only the one the spell was casted on directly was SURELY affected
      // others... who knows
      let targets = targetsStr.split(", ");
      let shoutedIds = {};
      let ind = targets.indexOf(this.d.name);
      targets.splice(ind, 1); // to avoid "shouting" 2 times at the same warrior
      target.shouted(this);
      shoutedIds[target.d.name] = [target.d.id];
      for (let i = 0; i < targets.length; i++) {
        let name = targets[i];
        let query = [
          {
            key: "team",
            type: "==",
            cmp: target.d.team,
          },
          {
            key: "name",
            type: "==",
            cmp: name,
          },
        ];
        // making selectWarriors wasn't pointless after all!
        if (shoutedIds[name]) {
          for (let j = 0; j < shoutedIds[name].length; j++) {
            let id = shoutedIds[name][j];
            query.push({
              key: "id",
              type: "!=",
              cmp: id,
            });
          }
        } else shoutedIds[name] = [];
        let warrior = selectWarriors(query)[0];
        if (typeof warrior == "undefined") error("niewytłumaczalny");
        else {
          warrior.shouted(this);
          warrior.updateTip();
          shoutedIds[warrior.d.name].push(warrior.d.id);
        }
      }
    }
    shouted(shoutTarget) {
      this.shoutTimer = 2;
      this.shoutTarget = shoutTarget;
    }
    advanceShout() {
      if (this.shoutTimer) {
        this.shoutTimer--;
        if (!this.shoutTimer) {
          this.shoutTarget = null;
        }
      }
    }
    healTarget() {
      this.targetHealCount += 1;
    }
    healAll() {
      this.allHealCount += 1;
    }
    lastHeal() {
      this.wasLastHeal = true;
    }
    castTeamBuff(id, val, lenMin, lenMax) {
      let team = getOthersAliveInTeam(this.d.team, this.d.id);
      for (let i = 0; i < team.length; i++) {
        team[i].buff(id, val, lenMin, lenMax);
      }
      this.buff(id, val, lenMin, lenMax);
    }
    buff(id, val, lenMin, lenMax) {
      let buff = {
        id: id,
        val: val,
        lenMin: lenMin,
        lenMax: lenMax,
        turnApplied: this.currentTurn,
      };
      if (!this.buffs[id]) this.buffs[id] = [];
      this.buffs[id].push(buff);
      this.updateTip();
    }
    castTeamDebuff(id, val, lenMin, lenMax) {
      let otherTeam = this.d.team == 1 ? 2 : 1;
      let team = getOthersAliveInTeam(otherTeam, -1);
      for (let i = 0; i < team.length; i++) {
        team[i].buff(id, val, lenMin, lenMax);
      }
    }
    removeOldBuffs() {
      for (let id in this.buffs) {
        let buffs = this.buffs[id];
        for (let i = 0; i < buffs.length; i++) {
          let buff = buffs[i];
          if (buff.turnApplied + buff.lenMax <= this.currentTurn) {
            buffs.splice(i, 1);
            i--;
          }
        }
        if (!buffs.length) delete this.buffs[id];
      }
    }
    getActiveBuffs(forGlobal) {
      let active = {};
      for (let id in this.buffs) {
        let buffs = this.buffs[id];
        let buffList = this.getBuffPropListForId(id);
        let nostack = buffList[id].nostack;
        let maxlen = nostack ? 1 : 2;
        let current = [];
        for (let i = 0; i < buffs.length; i++) {
          let buff = buffs[i];
          if (current.length == maxlen) {
            let add = false;
            let val = buff.val;
            let turn = buff.turnApplied;
            let { ind, smaller } = this.getSmallerOfTwoBuffs(
              current,
              forGlobal
            );

            // global display shows last used buffs rather than buffs that are actually working to avoid confusion
            if (forGlobal) {
              if (buff.turnApplied > smaller.turnApplied) current[ind] = buff;
            } else {
              if (buff.val >= smaller.val) current[ind] = buff;
            }
          } else {
            current.push(buff);
          }
        }
        active[id] = current;
      }
      return active;
    }
    getSmallerOfTwoBuffs(buffs, forGlobal) {
      // when getting for global buff display, compare by time, else compare by value
      if (buffs.length == 1) return { ind: 0, smaller: buffs[0] };
      if (forGlobal) {
        if (buffs[0].turnApplied <= buffs[1].turnApplied)
          return { ind: 0, smaller: buffs[0] };
        else return { ind: 1, smaller: buffs[1] };
      } else {
        if (buffs[0].val <= buffs[1].val) return { ind: 0, smaller: buffs[0] };
        else return { ind: 1, smaller: buffs[1] };
      }
    }
    hasResInfo() {
      return this.d.resfire && this.d.reslight && this.d.resfrost && this.d.act;
    }
    hasAcInfo() {
      return typeof this.d.ac != "undefined";
    }
    getAcResString(acres) {
      return `${acres.cur}${acres.bonus == 0 ? "" : "+" + acres.bonus}`;
    }
    getAcCurrentTip() {
      let str = "";
      if (this.hasAcInfo()) {
        str += `Pancerz: ${this.getAcResString(this.d.ac)}` + NL;
      }
      return str;
    }
    getResCurrentTip() {
      let str = "";
      if (this.hasResInfo()) {
        str += "Odp.: ";
        str += `<span style='color:red'>${this.getAcResString(
          this.d.resfire
        )}</span>/`;
        str += `<span style='color:yellow'>${this.getAcResString(
          this.d.reslight
        )}</span>/`;
        str += `<span style='color:cyan'>${this.getAcResString(
          this.d.resfrost
        )}</span>/`;
        str += `<span style='color:lime'>${this.getAcResString(
          this.d.act
        )}</span>`;
        str += NL;
      }
      return str;
    }
    getAcDestroyedTip() {
      return this.lowerAc > 0 ? "Zniszcz. panc.: " + this.lowerAc + NL : "";
    }
    getResDestroyedTip() {
      if (
        this.lowerResF == 0 &&
        this.lowerResL == 0 &&
        this.lowerResC == 0 &&
        this.lowerResP == 0
      )
        return "";

      let str = "";
      str += "Obniż. odp.: ";
      str += "<span style='color:red'>" + this.lowerResF + "</span>/";
      str += "<span style='color:yellow'>" + this.lowerResL + "</span>/";
      str += "<span style='color:cyan'>" + this.lowerResC + "</span>/";
      str += "<span style='color:lime'>" + this.lowerResP + "</span>";
      str += NL;
      return str;
    }
    generateExtraTipContent() {
      let str = "";

      if (this.hasAcInfo()) {
        /* New interface shows this by itself... */
        str += this.getAcCurrentTip();
      } else {
        str += this.getAcDestroyedTip();
      }

      if (this.hasResInfo()) {
        str += this.getResCurrentTip();
      } else {
        str += this.getResDestroyedTip();
      }

      if (this.targetHealCount)
        str += `<span>Użycia lek poj.: ${this.targetHealCount}</span>` + NL;
      if (this.allHealCount)
        str += `<span>Użycia lek grp: ${this.targetHealCount}</span>` + NL;

      let active = this.getActiveBuffs();
      for (let id in active) {
        let buffs = active[id];
        const buffPair = this.getActiveBuffPair(buffs);
        let buffTime = this.getBuffTimeString(buffPair, id);
        let buffVal = this.getBuffValString(buffPair);
        let buffPropList = this.getBuffPropListForId(id);
        let color = buffPropList[id].overrideColor
          ? buffPropList[id].overrideColor
          : buffPropList._color;
        str += `<span style='color:${color}'>${buffTime}${buffVal}</span>` + NL;
      }
      if (this.prepare)
        str += "<span style='color:red'>" + this.prepare + "</span>" + NL;
      if (this.curse) str += "<span style='color:#ff8383'>Klątwa</span>" + NL;
      if (this.distract)
        str += "<span style='color:#ff8383'>Wytrącenie z równowagi</span>" + NL;
      if (this.stun)
        str +=
          "<span style='color:#ff8383'>Stun: " + this.stun + "</span>" + NL;
      if (this.shoutTimer)
        str +=
          "<span style='color:#ff8383'>Wyzyw: " +
          this.shoutTimer +
          " tur" +
          (this.shoutTimer == 1 ? "a" : "y") +
          ", " +
          this.shoutTarget.d.name +
          "</span>" +
          NL;
      if (this.wasLastHeal)
        str +=
          "<span style='color:#ff8383'>Ostatni ratunek wykorzystany</span>" +
          NL;
      return str;
    }
    getBuffPropListForId(id) {
      if (BUFFS[id]) return BUFFS;
      if (SINGLE_BUFFS[id]) return SINGLE_BUFFS;
      if (ONHIT_SELFBUFFS[id]) return ONHIT_SELFBUFFS;
      if (DEBUFFS[id]) return DEBUFFS;
      if (SINGLE_DEBUFFS[id]) return SINGLE_DEBUFFS;
      error("nieprawidłowy buff id=" + id);
      return BUFFS;
    }
    getActiveBuffPair(buffs) {
      let b1 = buffs[0];
      let b2 = buffs[1] ? buffs[1] : null;
      if (b2) {
        if (b2.turnApplied < b1.turnApplied) {
          let tmp = b2;
          b2 = b1;
          b1 = tmp;
        }
      }
      return [b1, b2];
    }
    getBuffTimeString(buffPair, id) {
      let buffText = BUFF_NAMES[id];

      let v1 = this.getOneBuffTimeString(buffPair[0]);
      let v2 = buffPair[1] ? this.getOneBuffTimeString(buffPair[1]) : false;

      let str = v1;
      if (v2 !== false) str += "|" + v2;

      return buffText + ": " + str;
    }
    getBuffValString(buffPair) {
      if (isNaN(parseInt(buffPair[0].val))) return "";
      if (buffPair[1] && isNaN(parseInt(buffPair[1].val))) return "";

      let valText = " (";

      valText += buffPair[0].val;
      if (buffPair[1]) valText += "|" + buffPair[1].val;

      valText += ")";
      return valText;
    }
    getOneBuffTimeString(buff) {
      let time = Math.floor(this.currentTurn - buff.turnApplied);
      if (buff.turnApplied + buff.lenMin <= this.currentTurn) {
        return "<span style='color:orange'>" + time + "</span>";
      } else {
        return time;
      }
    }
    updateTip() {
      let txt = this.generateExtraTipContent();
      let tip = getTip(this.$);
      tip = tip.replace(TIP_REGEX, "");
      if (txt != "")
        tip = tip + "<titanHelperPlus>" + txt + "</titanHelperPlus>";
      setTip(this.$, tip);
    }
  }

  init();
})();

// godzina i grp zdobycia legi w tipie
(function (oldItemTip) {
  itemTip = function (a) {
    var _tip = oldItemTip.apply(this, arguments);
    if (a.stat.indexOf("loot=") > -1) {
      var splitStat__ = /loot=(.+,.,[0-9]{1,2},[0-9]{10})/.exec(a.stat);
      if (splitStat__ != null && splitStat__[1] != null) {
        var splitStat = splitStat__[1].split(",");
        _tip +=
          '<br><span style="font-style:oblique;color:lime;">Zdobyto o godzinie: ' +
          new Date(splitStat[3] * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) +
          (parseInt(splitStat[2]) > 1
            ? "<br>W grupie: " + splitStat[2] + " osobowej"
            : "") +
          "</span>";
      }
    }
    return _tip;
  };
})(itemTip);

// motyw hypnos

$(
  "<style>\
#tip{-webkit-border-radius: 8px 8px 8px 8px;border-radius: 8px 8px 8px 8px;}\
#tip-o1 {top:-6px; left:-6px; background:url(https://i.imgur.com/E3rkcQx.png) no-repeat 0 -69px;}\
#tip-o2 {top:-6px; left:-6px; background:url(https://i.imgur.com/E3rkcQx.png) no-repeat -35px -69px;}\
#tip {border:1px double #534d36;}\
#tip.t_item {background:#52231a00 url(https://i.imgur.com/XueTRyo.png); border-color:#e8c6a9;color:white;}\
#nick {text-align: color: #efd4b8; center; width: 274px; overflow: hidden; font: bold 15px serif; margin-top: 14px;}\
#conin {background-color: rgba(78, 78, 78, 0.16);}\
#chatscrollbar, #talkscroll, #myenscrollbar, #myfrscrollbar, #battleskills_scroll, #recoverItemScroll, #h_help_scrolled_scroll {border: 1px solid #f7d3a5; background: url(https://zapodaj.net/images/8e35bcd451681.png);}\
#chattxt .priv, #chattxt div.priv span.chnick{color:#629CF5 !important;}\
#chattxt .priv2, #chattxt div.priv2 span.chnick{color:#93bcf9 !important;}\
#panel {background: url(https://i.imgur.com/4HznWvL.png);}\
#bottombar {background: url(https://i.imgur.com/MsOZWwH.png);}\
#frsort, .chatfr, div.frparty, .delfr, .frdn, .frup, .delen, #fradd, #enadd {background-color: transparent; background-image: url(https://i.imgur.com/d9yVtgf.png) !important;}\
.w2 {color:#000000}\
.a2 {color:#000000}\
#chat.left, #chattabs.left, #chat.left #chattabs s {background-image: url(https://i.imgur.com/Sede8r2.png);}\
#inpchat {background: url(https://i.imgur.com/qnMgD2M.png);}\
#friends {background: url(https://i.imgur.com/H5xKKbW.png);}\
#pvpmode {background: url(https://i.imgur.com/D3bbBnO.png); top: 519px; left: 7px; width: 16px; height: 18px;}\
#chat, #chattabs, #chat #chattabs s {background-Image: url(https://i.imgur.com/9cZ3VpS.png);}\
#exp2 {background-image: url(https://i.imgur.com/7xmJ2nv.png) !important;}\
.noexp{background-image: url(https://zapodaj.net/images/b50a2c8f29f27.png) !important;}\
#life2 {background-image: url(https://i.imgur.com/nILGjID.png) !important;}\
#conquerStatWrapper{max-height: 300px; overflow: hidden; padding-right: 25px;}\
#conquer_stats_box h3{margin-bottom: 10px;}\
#conquer_stats_box{margin-bottom:10px;}\
#conquestSroll{width: 3px; background-image:url(https://game9.margonem.pl/img/tip-black.png); z-index:1000; border: 1px solid #b1b1b1;}\
#conquerStatWrapper .name{float: left;}\
#conquerStatWrapper .el{border-bottom: 1px dotted #b1b1b1; margin-top:2px; padding-bottom:2px;}\
#conquerStatWrapper .el.last{border: 0px;}\
#conquerStatWrapper .bar .red{width: 50px; float: left; background-color: #ffeaea;}\
#conquerStatWrapper .bar .green{width: 50px;float: right; border-left:1px solid #b1b1b1; background-color: #eaffea;}\
#conquerStatWrapper .bar{width:101px; border:1px solid #b1b1b1; float: right; margin-top:3px;}\
#conquerStatWrapper .bar .red .indicator{background-color: #ff0000; height: 8px; float: right;}\
#conquerStatWrapper .bar .green .indicator{background-color: #00ff00; height: 8px; float: left;}\
#conquerStatWrapper .el.g .name strong{color: #090;}\
#conquerStatWrapper .el.r .name strong{color: #212121;}\
#stats {background: url(https://i.imgur.com/mZe3mvc.png);}\
#buttons, #b_quests, #b_help, #b_matchmaking, #b_recipes, #b_clans, #b_pvp, #b_config, #b_map, #b_skills, #b_friends, #b_addons, #helpbut, #logoutbut, #bchat {background-image: url(https://i.imgur.com/VIRNYPy.png) !important;}\
#skillSwitch.first, #skillSwitch.second, #skillSwitch.third {background-image: url(https://i.imgur.com/WVbPtwF.png);}\
#premiumbut {background: url(https://i.imgur.com/ZeA0FGD.png);}\
.MM-battleset-switch-button {display: inline-block;width: 36px;height: 13px;background: url(https://i.imgur.com/bO02Foj.png);margin-right: 3px;cursor: pointer;}\
.golden-text {color: #9ea0a0 !important;}\
</style>"
).appendTo("head");
$("#corners").html(
  '<img class="border-u" src="https://i.imgur.com/ZDXlDrN.png"><img class="small"><img class="border-l" src="https://i.imgur.com/AsnXNzr.png"><img class="border-r" src="https://i.imgur.com/zpcDlrh.png"><img class="border-d" src="https://i.imgur.com/7Y9av0s.png">'
);
$("#leorn1").remove();
$("#leorn2").remove();

!(function (t) {
  var s = document.createElement("style");
  s.appendChild(document.createTextNode(t));
  document.querySelector("head").appendChild(s);
})(`
#loots_header_label .gfont {
    display: none;
}
`);

// zast chat
(function (chatSend) {
  window.chatSend = function (txt) {
    if (window.hero.guest) txt += " (zast)";
    chatSend(txt);
  };
})(window.chatSend);

// oddaj d

(() => {
  const a = (b) => {
    _g(`party&a=give&id=${b}`, (c) => {
      `ok` != c.e && a(b);
    });
  };
  g.chat.parsers.push((b) => {
    if (
      g.party &&
      hero &&
      g.party[hero.id].r == 1 &&
      !(1 > g.chat.ts) &&
      g.ev - 1 < b.ts &&
      2 == b.k &&
      b.n != hero.nick &&
      `oddaj d` == b.t.toLowerCase()
    )
      for (let c in g.party) g.party[c].n == b.n && a(c);
  });
})();

// grp na g

(() => {
  const canCreateParty = () => {
    return (
      (!window.g.party ||
        (window.g.party && window.g.party[window.hero.id].r === 1)) &&
      !window.g.battle &&
      !window.g.dead
    );
  };

  const inParty = (id) => {
    return window.g.party[id] !== undefined;
  };

  document.addEventListener("keyup", (ev) => {
    if (
      ev.keyCode === 71 &&
      !["INPUT", "TEXTAREA"].includes(ev.target.tagName) &&
      canCreateParty()
    ) {
      Object.entries(window.g.other).forEach(([id, { relation }]) => {
        if (["cl", "fr", "cl-fr"].includes(relation) && !inParty(id)) {
          window._g(`party&a=inv&id=${id}`);
        }
      });
    }
  });
})();

// ln
var ln = {
  engine: function () {
    (function (a) {
      lootItem = function (b) {
        if ((a(b), /legendary/.test(b.stat))) {
          if (
            b.name == "Ornament ściółkowych monstrów IV" ||
            b.name == "Przysięga grzybni III" || b.name == "Dokładna instrukcja wysiewu" || b.name == "Oko wiosennych pnączy III" || b.name == "Skarb z wiosennej orki III"
          )
            return;
            $("#centerbox2").css({
              "box-shadow": "0px 0px 50px 30px red","width": "790px"
            });
            setTimeout(function(){
              $("#centerbox2").css({
                "box-shadow": "0px 0px 0px 0px"
              })
            },10000);
          $("style.ln_anim").length ||
            "noborder" == ln.vars.settings.border ||
            $(
              '<style class="ln_anim">@-webkit-keyframes pulser{0%,100%{box-shadow:0 0 50px 30px ' + ln.vars.settings.color +",0 0 20px 30px #000}20%{box-shadow:0 0 80px 60px " +ln.vars.settings.color +",0 0 80px 70px #000}}@keyframes pulser{0%,100%{box-shadow:0 0 50px 30px " +ln.vars.settings.color +",0 0 20px 30px #000}20%{box-shadow:0 0 80px 60px " +ln.vars.settings.color +",0 0 80px 70px #000}}</style>"
            ).appendTo("head"),
            "0" != ln.vars.settings.vol && ln.audio("0"),
            !0 == ln.vars.settings.showMsg &&
              message(
                "Gratulacje! Spad\u0142a [color=" +
                  ln.vars.settings.color +
                  "]*legenda*[/color]"
              ),
            "object" == typeof hero.clan &&
              !0 != ln.vars.settings.clanMsg &&
              ln.msg.send(
                "/k " +
                  ln.vars.settings.prefix +
                  " " +
                  "ITEM#" +
                  b.hid +
                  " " +
                  ln.vars.settings.suffix
              ),
            "noborder" != ln.vars.settings.border &&
              $("div#loots").css({
                "box-shadow":
                  "0 0 50px 30px " +
                  ln.vars.settings.color +
                  ", 0 0 20px 30px black",
                "-webkit-animation":
                  "noborder" == ln.vars.settings.border
                    ? "none"
                    : "pulser 2s ease 2s 5",
                animation:
                  "noborder" == ln.vars.settings.border
                    ? "none"
                    : "pulser 2s ease 2s 5",
              });
          var c = "ITEM#" + b.hid + "." + ln.vars.world;
          $(
            '<div style="font-size: 13px;text-align:center;"><u class="chnick">&times;' +
              b.name +
              '&times;</u><br /><span style="color: ' +
              ln.vars.settings.color +
              "; text-shadow: 0 0 1px black, 1px 1px 2px " +
              ln.vars.settings.color +
              '; display: block;" tip="Kliknij, aby otworzy\u0107 menu udost\u0119pniania" onclick="ln.msg.share({id:\'' +
              c +
              "',name:'" +
              b.name +
              "'});\">[" +
              c +
              ']</span><span class="chnick" style="font-size:12px;" onclick="ln.config.open();">&#10093;' +
              ln.vars.name +
              "&#10092;</span></div>"
          ).appendTo("#chattxt"),
            log(
              '<span style="color: aqua; text-shadow: 0 0 1px aqua, 0 0 5px aqua;">&#10093;</span><span style="color:yellow; text-shadow: 0 0 1px yellow, 0 0 5px yellow; font-size: 18px;">' +
                b.name +
                '</span><span style="color: aqua; text-shadow: 0 0 1px aqua, 0 0 5px aqua;">&#10092;</span> <span style="color:' +
                ln.vars.settings.color +
                "; text-shadow: 0 0 3px " +
                ln.vars.settings.color +
                '; font-size: 18px;">' +
                c +
                "</span>"
            ),
            (document.title = "Legenda! Margonem MMORPG");
          var d = setInterval(function () {
            $("#loots").is(":visible") ||
              ((document.title = "*L* | Margonem MMORPG"),
              $("div#loots").css({
                "box-shadow": "none",
                animation: "none",
              }),
              $("div#base").css({
                "box-shadow": "none",
              }),
              clearInterval(d),
              $("style.ln_anim").length && $("style.ln_anim").remove());
          }, 2e3);
        } else if (
          /Jeden ze składników legendarnej zbroi wykuwanej przez krasnoludy/.test(
            b.stat
          )
        ) {
          "0" != ln.vars.settings.vol && ln.audio("1"),
            (document.title = "Kamie\u0144! Margonem MMORPG");
          var d = setInterval(function () {
            $("#loots").is(":visible") ||
              ((document.title = "*K* | Margonem MMORPG"), clearInterval(d));
          }, 3e3);
        }
      };
    })(lootItem),
      g.loadQueue.push({
        fun: function () {
          ln.config.load(),
            setTimeout(function () {
              ln.news.engine();
            }, 5e3);
        },
      }),
      $(
        '<style>input.ln {border: 1px solid black; background: rgba(0,0,0,0.3); padding: 2px 4px; transition: 0.3s;} input[type="text"]:focus {background: rgba(0,0,0,0.4);}</style>'
      ).appendTo("head");
  },
  config: {
    load: function () {
      var a = localStorage.ln_pos ? localStorage.ln_pos.split("|") : ["5", "5"];
      $('<div class="clasick_ln"></div>')
        .css({
          background:
            "url(https://micc.garmory-cdn.cloud/obrazki/itemy/but/buty135.gif)",
          width: "32px",
          height: "32px",
          zIndex: "500",
          position: "absolute",
          left: a[0] + "px",
          top: a[1] + "px",
          transition: "transform 0.5s, filter 0.5s",
        })
        .appendTo("body")
        .draggable({
          containment: "window",
          start: function () {
            g.lock.add("ln_moving"), $(this).css("cursor", "move");
          },
          stop: function () {
            g.lock.remove("ln_moving"),
              $(this).css("cursor", "default"),
              (localStorage.ln_pos =
                $(this).position().left + "|" + $(this).position().top);
          },
        })
        .attr(
          "tip",
          '<div style="text-align:center; padding: 3px 6px;"><u style="font:14px Tahoma;">' +
            ln.vars.name +
            "</u></div>"
        )
        .click(function () {
          ln.config.open();
        })
        .mouseenter(function () {
          $(this).css({
            transform: "scale(1.1) rotate(-20deg)",
            filter: "sepia(100%)",
          });
        })
        .mouseleave(function () {
          $(this).css({
            transform: "scale(1.0)",
            filter: "sepia(0%)",
          });
        });
    },
    open: function () {
      showEnWindow(
        ln.vars.name,
        '<div style="text-align:center; width: 400px; resize: horizontal;"><h3>Klanowe komunikaty</h3><input type="text" class="ln ln_prefix" placeholder="Prefix" value="' +
          ln.vars.settings.prefix +
          '" tip="Minimum 4 znaki" /> NAZWA <input type="text" class="ln ln_suffix" placeholder="Suffix" value="' +
          ln.vars.settings.suffix +
          '" tip="Minimum 1 znak" /><br /><label><input type="checkbox" class="ln ln_clanMsg" ' +
          (!0 == ln.vars.settings.clanMsg ? "checked" : "") +
          '/>Nie informuj klanu</label><br /><table style="width: 90%; border-collapse:collapse; margin: 3px auto;"><tr><td style="border-right: 1px solid rgba(0,0,0,0.2); vertical-align: baseline;"><h3>Obramowanie \u0142up\xF3w</h3><span style="font-size:18px;">Kolor: </span><input type="color" name="color_pick" value="' +
          ln.vars.settings.color +
          '" tip="Kliknij, aby wybra\u0107 kolor" style="cursor: pointer; width: 50px; vertical-align: middle; appearance:none; -webkit-appearance: none; padding: 0; border: 1px solid silver;" /><br / ><label><input type="radio" name="obramowanie" value="noanim" ' +
          ("noanim" == ln.vars.settings.border ? "checked" : "") +
          '/>Bez animacji</label><label><input type="radio" name="obramowanie" value="anim" ' +
          ("anim" == ln.vars.settings.border ? "checked" : "") +
          '/>Z animacj\u0105</label><br /><label><input type="radio" name="obramowanie" value="noborder" ' +
          ("noborder" == ln.vars.settings.border ? "checked" : "") +
          '/>Wy\u0142\u0105cz obramowanie</label></td><td style="border-left: 1px solid rgba(0,0,0,0.5); vertical-align: baseline;"><h3>D\u017Awi\u0119ki</h3><div style="width: 120px; margin: 0px auto;"><input type="range" class="ln_volrange" style="width: 60px;" min="0.0" max="1.0" step="0.1" value="' +
          ln.vars.settings.vol +
          '" oninput="$(\'.volume_level\').text(this.value*100+\'%\');" /><span class="volume_level" style="font-size:18px; position:absolute; right: 15px;">' +
          100 * ln.vars.settings.vol +
          '%</span></div><span style="cursor: pointer; font-size:24px;" onclick="ln.config.soundChange.o();">&#128266; <u style="color:#B9482C; cursor: pointer; font-size: 18px;">zmie\u0144</u></span></td></tr></table><label><input type="checkbox" class="ln ln_showMsg" ' +
          (!0 == ln.vars.settings.showMsg ? "checked" : "") +
          '/>Pokazuj wiadomo\u015B\u0107 na \u015Brodku ekranu</label><br /><table style="width: 90%; border-collapse:collapse; margin: 3px auto;"><tr><td><span style="font-size:16px;"><span style="cursor:pointer; display: block; font-size: 24px; text-shadow: 0 0 3px black, 3px 3px 5px black, 0 0 10px black;" onclick="ln.news.show();">v' +
          ln.vars.version +
          '</span> &copy; <a href="https://www.margonem.pl/profile/view,2286497" target="_blank">cLAsick</a> | <img src="https://cdn.cdnlogo.com/logos/d/64/discord.png" style="width:20px;vertical-align:middle;" /><a href="https://discord.gg/Tb32NXZ" target="_blank" tip="<b>cLAsick Addons</b><br />Oficjalny serwer dodatk\xF3w by cLAsick">Discord</a></span></td><td>' +
          drawButton("aktualne ustawienia", "ln.config.current();") +
          "<br />" +
          drawButton(
            "Zapisz",
            "ln.config.save({prefix:$('input.ln_prefix').val(),suffix:$('input.ln_suffix').val(),color:$('input[type=color]').val(),clanMsg:$('input.ln_clanMsg')[0].checked,showMsg:$('input.ln_showMsg')[0].checked,vol:$('input.ln_volrange')[0].value,border:$('input[type=radio]:checked').val()});"
          ) +
          drawButton("Reset", "ln.reset(); hideEnWindow();") +
          "</td></tr></table></div>"
      );
      // document.querySelector("#enwnd_content > div > table:nth-child(10) > tbody > tr > td:nth-child(2) > div:nth-child(3)").addEventListener(
      //   "ln.config.save({prefix:$('input.ln_prefix').val(),suffix:$('input.ln_suffix').val(),color:$('input[type=color]').val(),clanMsg:$('input.ln_clanMsg')[0].checked,showMsg:$('input.ln_showMsg')[0].checked,vol:$('input.ln_volrange')[0].value,border:$('input[type=radio]:checked').val()});"

      // ) // dodac event
    },
    current: function () {
      var a = "";
      switch (ln.vars.settings.border) {
        case "anim":
          a = "z animacj\u0105";
          break;
        case "noanim":
          a = "bez animacji";
          break;
        case "noborder":
          a = "ca\u0142kiem wy\u0142\u0105czone";
          break;
        default:
          a = "";
      }
      showEnWindow(
        ln.vars.name,
        '<div style="text-align:center;"><h2 style="margin-bottom: 5px;">Aktualne ustawienia</h2><b>Klanowy komunikat</b><br />&#171;' +
          hero.nick +
          "&#187; " +
          ln.vars.settings.prefix +
          "NAZWA" +
          ln.vars.settings.suffix +
          '<br /><b>Obramowania: </b><span style="display:inline-block;height:15px;width:15px;border-radius:5px;vertical-align:middle; box-shadow:0 0 1px 1px black;margin:1px;background:' +
          ln.vars.settings.color +
          '" tip="HEX: ' +
          ln.vars.settings.color +
          '"></span> ' +
          a +
          "<br />Informuj klan: " +
          (!0 == ln.vars.settings.clanMsg
            ? '<span style="color:maroon;text-shadow:0 0 2px black;">NIE</span>'
            : '<span style="color:#02bb02;text-shadow:0 0 2px black;">TAK</span>') +
          "<br />D\u017Awi\u0119ki: " +
          ("0" == ln.vars.settings.vol
            ? '<span style="color:maroon;text-shadow:0 0 2px black;">NIE</span>'
            : '<span style="color:#02bb02;text-shadow:0 0 2px black;">TAK</span>') +
          " (" +
          100 * ln.vars.settings.vol +
          "%)<br />Wiadomo\u015B\u0107 na \u015Brodku: " +
          (!1 == ln.vars.settings.showMsg
            ? '<span style="color:maroon;text-shadow:0 0 2px black;">NIE</span>'
            : '<span style="color:#02bb02;text-shadow:0 0 2px black;">TAK</span>') +
          "<br />" +
          drawButton("Wr\xF3\u0107", "ln.config.open();") +
          drawButton("Wyjd\u017A", "hideEnWindow();") +
          "</div>"
      );
    },
    save: function (a) {
      4 <= a.prefix.length && 1 <= a.suffix.length
        ? JSON.stringify(a) == JSON.stringify(ln.vars.settings)
          ? message("Nic nie zmieniono")
          : ((localStorage.ln_settings = JSON.stringify(a)),
            ln.vars.refresh(),
            message("Zmiany zosta\u0142y zapisane"),
            hideEnWindow())
        : (message("[color=maroon]Prefix: minimum 4 znaki[/color]"),
          message("[color=maroon]Suffix: minimum 1 znak[/color]"));
    },
    soundChange: {
      tip: () => {
        showEnWindow(
          ln.vars.name,
          '<div style="text-align:center;"><h2>Wybierz spos\xF3b ustawienia d\u017Awi\u0119ku</h2>' +
            drawButton(
              "Discord",
              "$('.tips .google, .tips .inne').hide(); $('.tips .discord').show();"
            ) +
            " " +
            drawButton(
              "Dysk Google",
              "$('.tips .discord, .tips .inne').hide(); $('.tips .google').show();"
            ) +
            " " +
            drawButton(
              "Inne",
              "$('.tips .discord, .tips .google').hide(); $('.tips .inne').show();"
            ) +
            '<div class="tips"><span class="discord" style="display: none;">Prze\u015Blij sw\xF3j d\u017Awi\u0119k gdziekolwiek na Discordzie, a nast\u0119pnie kliknij na za\u0142\u0105cznik PPM <sup tip="PPM - Prawy przycisk myszy">[?]</sup> i skopiuj adres. Wklej, <b>przetestuj</b> czy dzia\u0142a, zapisz i gotowe!</span><span class="google" style="display: none;">Wejd\u017A na sw\xF3j <a href="https://drive.google.com/" target="_blank">Dysk Google</a>, znajd\u017A wybrany plik d\u017Awi\u0119kowy (lub je\u015Bli go nie masz - prze\u015Blij go na sw\xF3j Dysk Google) a nast\u0119pnie kliknij na niego PPM <sup tip="PPM - Prawy przycisk myszy">[?]</sup> i wybierz <u>Udost\u0119pnij</u>.<br />W sekcji "Pobierz link" kliknij <b>Kopiuj link</b>. Wejd\u017A na konwerter: <a href="https://sites.google.com/site/gdocs2direct/" target="_blank">[url #1]</a> <a href="https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/" target="_blank">[url #2]</a>, przekonwertuj skopiowany adres i wklej go w pole zmiany d\u017Awi\u0119ku. <b>Przetestuj</b> czy dzia\u0142a, zapisz i gotowe!</span><span class="inne" style="display: none;">1. Mo\u017Cesz wklei\u0107 bezpo\u015Bredni link do d\u017Awi\u0119ku z dowolnej strony, kt\xF3ra takie linki oferuje.<br />2. D\u017Awi\u0119ki z YouTube nale\u017Cy najpierw pobra\u0107 na komputer i post\u0119powa\u0107 wed\u0142ug wskaz\xF3wek dla Discord / Dysk Google.</span></div><hr /><b style="font-size:18px;">Pami\u0119taj!</b> im d\u0142u\u017Cszy d\u017Awi\u0119k, tym wi\u0119ksze op\xF3\u017Anienie odegrania d\u017Awi\u0119ku. Zalecana d\u0142ugo\u015B\u0107 trwania d\u017Awi\u0119ku - maks. 30s.<br /><span style="color:red; text-shadow: 0 0 1px red;">Bezpo\u015Brednie adresy z YouTube <b>nie s\u0105</b> obs\u0142ugiwane.</span><br />' +
            drawButton("wr\xF3\u0107", "ln.config.soundChange.o();") +
            "</div>"
        );
      },
      t: function (b) {
        if (b) {
          $("audio.ln_testsound").length ||
            $('<audio class="ln_testsound" type="audio/mp3"></audio>').appendTo(
              "body"
            );
          var a = $("audio.ln_testsound").attr("src", b).get(0);
          a.pause(),
            (a.currentTime = 0),
            (a.volume = parseFloat(ln.vars.settings.vol)),
            (a.oncanplay = function () {
              a.play();
            }),
            (a.onpause = function () {
              a.remove();
            }),
            (a.onerror = function () {
              a.remove(),
                message(
                  "Ups, wyst\u0105pi\u0142 b\u0142\u0105d podczas wczytywania d\u017Awi\u0119ku."
                );
            }),
            (a.onended = () => {
              a.remove();
            });
        }
      },
      o: function () {
        showEnWindow(
          ln.vars.name,
          '<div style="text-align:center;"><h3>Zmie\u0144 d\u017Awi\u0119ki</h3><span style="cursor: pointer; color:red; text-shadow: 0 0 5px red; display: inline-block; margin: 10px auto;" onclick="ln.config.soundChange.tip();">Koniecznie przeczytaj wskaz\xF3wk\u0119<br />dotycz\u0105c\u0105 zmiany d\u017Awi\u0119k\xF3w!</span><br /><i>Je\u015Bli chcesz zostawi\u0107 d\u017Awi\u0119k domy\u015Blny - pozostaw puste</i><br /><input type="text" style="margin: 2px auto; text-align: center; width: 280px; letter-spacing: -0.5px;" class="ln ln_sound_l" placeholder="d\u017Awi\u0119k legendy" value="' +
            (localStorage.ln_sound ? localStorage.ln_sound.split("|")[0] : "") +
            '" /> <span onclick="ln.config.soundChange.t($(\'input.ln_sound_l\').val(), 0);" tip="Przetestuj d\u017Awi\u0119k">[&#9654;]</span><br /><input type="text" style="margin: 2px auto; text-align: center; width: 280px; letter-spacing: -0.5px;" class="ln ln_sound_k" placeholder="d\u017Awi\u0119k kamienia" value="' +
            (localStorage.ln_sound ? localStorage.ln_sound.split("|")[1] : "") +
            '" /> <span onclick="ln.config.soundChange.t($(\'input.ln_sound_k\').val());" tip="Przetestuj d\u017Awi\u0119k">[&#9654;]</span><br />Zajrzyj na poni\u017Cszego Discorda - znajdziesz tam informacje o wszystkich moich dodatkach, a tak\u017Ce d\u017Awi\u0119ki udost\u0119pnione przez innych graczy.<br /><img src="https://cdn.cdnlogo.com/logos/d/64/discord.png" style="width:30px;vertical-align:middle;" /><a href="https://discord.gg/Tb32NXZ" style="font-size:20px;" target="_blank" tip="<b>cLAsick Addons</b><br />Oficjalny serwer dodatk\xF3w by cLAsick">Discord</a><br />' +
            drawButton(
              "Zapisz",
              "ln.config.soundChange.s($('input.ln_sound_l').val(),$('input.ln_sound_k').val());"
            ) +
            drawButton("Wr\xF3\u0107", "ln.config.open();") +
            "</div>"
        );
      },
      s: function (a = "", b = "") {
        (localStorage.ln_sound = a + "|" + b),
          ln.vars.refresh(),
          hideEnWindow(),
          message("D\u017Awi\u0119ki zosta\u0142y zapisane");
      },
    },
  },
  audio: function (a) {
    if ("0" == a || "1" == a) {
      $("audio.ln_handler").length ||
        $('<audio class="ln_handler" type="audio/mp3"></audio>').appendTo(
          "body"
        );
      var b = $("audio.ln_handler").attr("src", ln.vars.sound[a]).get(0);
      b.pause(),
        (b.currentTime = 0),
        (b.volume = parseFloat(ln.vars.settings.vol)),
        (b.oncanplay = function () {
          b.play();
        }),
        (b.onerror = function () {
          message(
            "Ups, wyst\u0105pi\u0142 b\u0142\u0105d podczas wczytywania d\u017Awi\u0119ku."
          );
        });
    } else
      message(
        "Ups, wyst\u0105pi\u0142 b\u0142\u0105d podczas wczytywania d\u017Awi\u0119ku."
      );
  },
  msg: {
    send: function (a) {
      _g("chat", {
        c: a,
      });
    },
    share: function (a) {
      "true" == getCookie("ln_shared_" + a.id)
        ? message("Numerki tego przedmiotu ju\u017C udost\u0119pniono!")
        : showEnWindow(
            ln.vars.name,
            '<div style="text-align:center;">Na kt\xF3rej zak\u0142adce chatu chcesz si\u0119 podzieli\u0107 numerkami tego przedmiotu?<h2 style="color:' +
              ln.vars.settings.color +
              '; text-shadow: 0 0 1px black, 0 0 5px;">&#10093; ' +
              a.name +
              ' &#10092;</h2><input type="text" class="ln" value="' +
              a.id +
              '" tip="Kliknij, aby skopiowa\u0107" onclick="var text=$(this);text.select(); document.execCommand(\'Copy\');$(\'span.ln_copied\').fadeIn();" readonly /><br /><span class="ln_copied" style="display:none;">Skopiowano!</span><br />' +
              drawButton(
                "Og\xF3lny",
                "setCookie('ln_shared_" +
                  a.id +
                  "', true); ln.msg.send('" +
                  a.name +
                  " (" +
                  a.id +
                  ") - " +
                  ln.vars.name +
                  "'); hideEnWindow();"
              ) +
              (0 == g.party
                ? ""
                : " " +
                  drawButton(
                    "Grupowy",
                    "setCookie('ln_shared_" +
                      a.id +
                      "', true); ln.msg.send('/g " +
                      a.name +
                      " (" +
                      a.id +
                      ") - " +
                      ln.vars.name +
                      "'); hideEnWindow();"
                  )) +
              " " +
              drawButton("Rezygnuj", "hideEnWindow();") +
              "</div>"
          );
    },
  },
  news: {
    engine: function () {
      "undefined" != typeof Storage && localStorage.ln_version
        ? localStorage.ln_version != ln.vars.version && ln.news.show()
        : !localStorage.ln_version && ln.news.show();
    },
    show: function () {
      var a = {
          plus: [
            "Ikonka dodatku ju\u017C nie powinna wyje\u017Cd\u017Ca\u0107 poza stron\u0119",
            "Przerobione okno wskaz\xF3wki zmiany d\u017Awi\u0119ku",
            "Kilka zmian kosmetycznych",
          ],
          minus: [],
        },
        b =
          '<b style="color:green;text-shadow: 0 0 2px green;">Dodano:</b><br />';
      if (0 < a.plus.length)
        for (x in a.plus)
          b +=
            '<span style="color:green;text-shadow: 0 0 2px green;">+</span> ' +
            a.plus[x] +
            ".<br />";
      else b += "brak";
      if (0 < a.minus.length)
        for (x in ((b +=
          '<b style="color:maroon;text-shadow: 0 0 2px maroon;">Usuni\u0119to:</b><br />'),
        a.minus))
          b +=
            '<span style="color:maroon;text-shadow: 0 0 2px maroon;">-</span> ' +
            a.minus[x] +
            ".<br />";
      showEnWindow(
        ln.vars.name,
        '<div style="text-align:center;"><h3>Zmiany w wersji <u>' +
          ln.vars.version +
          "</u></h3>" +
          b +
          '<br /><hr style="width: 75%;" /><i onclick="extManager.task(\'add_list\'); extManager.callDetails(53253); hideEnWindow();" style="cursor:pointer;">Pami\u0119taj <b>polubi\u0107</b> dodatek je\u015Bli Ci si\u0119 podoba &#128077;</div>'
      ),
        (localStorage.ln_version = ln.vars.version);
    },
  },
  vars: {
    version: "1.1.2",
    name: "Legendary Notificator",
    sound: [],
    world: location.host.split(".")[0],
    refresh: function () {
      ln.vars.settings = localStorage.ln_settings
        ? JSON.parse(localStorage.ln_settings)
        : JSON.parse(
            '{"prefix":"mojemojemoje","suffix":":D","color":"#FF0000","vol":"0.9","clanMsg":false,"showMsg":false,"border":"anim"}'
          );
      let b = localStorage.ln_sound ? localStorage.ln_sound.split("|") : null;
      (ln.vars.sound[0] =
        null != b && 4 < b[0].length
          ? b[0]
          : "https://raw.githubusercontent.com/clasicker/addons/master/ln_legendarny.mp3?v=" +
            ln.vars.version),
        (ln.vars.sound[1] =
          null != b && 4 < b[1].length
            ? b[1]
            : "https://raw.githubusercontent.com/clasicker/addons/master/ln_kamien.mp3?v=" +
              ln.vars.version);
    },
  },
  reset: function (b = !0) {
    [
      "prefix",
      "suffix",
      "pos",
      "color",
      "version",
      "sound",
      "settings",
    ].forEach((a) => localStorage.removeItem("ln_" + a)),
      ln.vars.refresh(),
      b && message("Ustawienia dodatku zosta\u0142y zresetowane");
  },
  init: function () {
    "undefined" == typeof Storage &&
      log(
        "[<b>" +
          ln.vars.name +
          "</b>] W\u0142\u0105cz dost\u0119p do localStorage lub zaktualizuj przegl\u0105dark\u0119, by w pe\u0142ni korzysta\u0107 z funkcji dodatku.",
        1
      ),
      ln.engine(),
      ln.vars.refresh();
  },
};
ln.init();





// pokaz profil -- buguje ssie z otchlania

window.g.loadQueue.push({
  fun: () => {
    window.__priw8_show_profile = function (id) {
      window.open(`https://www.margonem.pl/profile/view,${id}`);
    };

    window.clasick_seq = function (c) {

      $.getJSON("https://mec.garmory-cdn.cloud/pl/" +getWorld()+"/" +c%128+"/" +c+".json", function(t) {
              var e, a, i=[], r=0, o= {
                  uni:0, upg:0, her:0, leg:0, art:0, def:0
              };

              for (n in t) 9 != t[n].st && (e = parseItemStat(t[n].stat), 10 != t[n].st && (r += parseInt(e.lvl)), a = "box-shadow: 0 0 2px 1px black; background: #444444;", "artefact" == e.rarity ? (a = "box-shadow: 0 0 2px 1px #b30000; background: #800000;", 10 != t[n].st && o.art++) : "legendary" == e.rarity ? (a = "box-shadow: 0 0 2px 1px #d96c00; background: #ff9f40;", 10 != t[n].st && o.leg++) : "heroic" == e.rarity ? (a = "box-shadow: 0 0 2px 1px #0064ff; background: #4c80d0;", 10 != t[n].st && o.her++) : "upgraded" == e.rarity ? (a = "box-shadow: 0 0 2px 1px #d3ff00; background: #c4df42;", 10 != t[n].st && o.upg++) : "unique" == e.rarity ? (a = "box-shadow: 0 0 2px 1px #36d900; background: #85db69;", 10 != t[n].st && o.uni++) : 10 != t[n].st && o.def++, i[t[n].st] = '<div style="position: relative; ' + a + '; padding:4px 0px; text-align: center;" ctip="t_item" tip=\'' + itemTip(t[n]) + "'><img src=\"https://micc.garmory-cdn.cloud/obrazki/itemy/" + t[n].icon + '">' + (e.enhancement_upgrade_lvl ? '<span style="position:absolute; right:-5px; top:-5px; background: rgba(0,0,0,0.4); border-radius: 50%; color: white; padding: 1px; font-size: 14px;">+' + e.enhancement_upgrade_lvl + "</span>" : "") + "</div>");
var d = "";
0 < o.art && (d += '<span style="color:black; background: #800000; box-shadow: 0 0 2px 1px #b30000; padding: 4px;">Artefakty: <b>' + o.art + "</b></span><br />"),
	0 < o.leg && (d += '<span style="color:black; background: #ff9f40; box-shadow: 0 0 2px 1px #d96c00; padding: 4px;">Legendarne: <b>' + o.leg + "</b></span><br />"),
	0 < o.her && (d += '<span style="color:black; background: #4c80d0; box-shadow: 0 0 2px 1px #0064ff; padding: 4px;">Heroiczne: <b>' + o.her + "</b></span><br />"),
	0 < o.upg && (d += '<span style="color:black; background: #c4df42; box-shadow: 0 0 2px 1px #d3ff00; padding: 4px;">Ulepszone: <b>' + o.upg + "</b></span><br />"),
	0 < o.uni && (d += '<span style="color:black; background: #85db69; box-shadow: 0 0 2px 1px #36d900; padding: 4px;">Unikatowe: <b>' + o.uni + "</b></span><br />"),
	0 < o.def && (d += '<span style="color:white; background: #444444; box-shadow: 0 0 2px 1px black; padding: 4px;">Pospolite: <b>' + o.def + "</b></span><br />");
var s = "font-size: 0px; vertical-align: bottom; width: 42px; height: 42px; margin: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);",
	l = r / Object.values(o).reduce((t, e) => t + e, 0),
	p = l.toFixed(2);
l /= g.other[c].lvl,
	l = isNaN(l) ? 0 : l,
	showEnWindow("Show EQ by cLAsick", '<div style="text-align: center; overflow: auto;"><div style="background: radial-gradient(circle, rgba(187,187,187,0.4) 0%, rgba(45, 44, 44, 0.5) 100%); box-shadow: 0 0 10px 1px gray, 0 0 10px 1px gray inset; margin-bottom: 5px; border-radius: 6px;">' + (1 == g.other[c].vip ? '<img src="https://micc.garmory-cdn.cloud/obrazki/www/kb-small.png" style="position: absolute; right: 20px;" tip="Karmazynowe Bractwo" alt="KB" />' : "") + "<b>" + g.other[c].nick + "</b><br />" + goldTxt(g.other[c].lvl + g.other[c].prof, !0) + (g.other[c].clan ? ' | <a href="https://www.margonem.pl/?task=clanpage&id=' + g.other[c].clan.id + "&w=" + getWorld() + '" target="_blank">' + g.other[c].clan.name + "</a>" : "") + '</div><div style="width: 160px; padding: 0 0 10px 0; display: inline-block; float: left;"><div style="' + s + 'border-color: transparent;">' + i[10] + '</div><div style="' + s + '">' + i[1] + '</div><div style="' + s + 'border-color: transparent;"><div style="background-position: 0px 0px; background-image: url(https://micc.garmory-cdn.cloud/obrazki/postacie' + g.other[c].icon + '); width: 32px; height: 48px; margin-left:6px; margin-top:-2px;"></div></div><br /><div style="' + s + '">' + i[2] + '</div><div style="' + s + '">' + i[3] + '</div><div style="' + s + '">' + i[4] + '</div><br /><div style="' + s + '">' + i[5] + '</div><div style="' + s + '">' + i[6] + '</div><div style="' + s + '">' + i[7] + '</div><br /><div style="' + s + 'border-color: transparent;"></div><div style="' + s + '">' + i[8] + '</div><div style="' + s + 'border-color: transparent;"></div></div><div style="width: 180px; display: inline-block; float: right;"><h3>Poziom przedmiotów:</h3><table style="margin:0px auto;"><tr><td style="padding:4px;"><b style="text-decoration: underline dotted;" tip="Suma poziomów wszystkich elementów ekwipunku">Suma</b></td><td style="padding:4px;"><b style="text-decoration: underline dotted;" tip="Średni poziom elementów ekwipunku">Średni</b></td></tr><tr><td style="padding:4px;">' + r + '</td><td style="padding:4px;">' + (isNaN(p) ? 0 : p) + '</td></tr></table><span style="text-decoration: underline dotted;" tip="Współczynnik poziomów elementów ekwipunku do poziomu postaci.<br />Błogosławieństwo nie jest wliczane.">Współczynnik:</span> ' + l.toFixed(3) + '</div><div style="line-height:30px;">' + d + '</div><div style="clear:both;"><span style="font-size:16px;"><span style="font-size: 20px;">v' + "1.1obci" + '</span> &copy; <a href="https://www.margonem.pl/?task=profile&id=2286497" target="_blank">cLAsick</a></span> | <img src="https://cdn.cdnlogo.com/logos/d/64/discord.png" style="width:20px;vertical-align:middle;" /><a href="https://discord.gg/Tb32NXZ" target="_blank" tip="<b>cLAsick Addons</b><br />Oficjalny serwer dodatków by cLAsick">Discord</a></div></div>')
 
})
      };

    const _sM = window.showMenu;
    window.showMenu = function (e, menu, force) {
      if (e.target.classList != undefined)
      {
      if (e.target.classList.contains("other")) {
        const id = e.target.getAttribute("id")?.substring(5);
        const other = g.other[id];
        if (other&&id!=g.playerCatcher.activePlayer){
          menu.push(["Pokaż ekwipunek", `clasick_seq(${id})`]);
          menu.push(["Pokaż profil", `__priw8_show_profile(${other.account})`]);
         // _sM(e, menu); $(".other").unbind("click")
        }
      }
    }
      return _sM.apply(this, arguments);
    };
  },
});

// kopia dodatkow

(() => {
  const button = document.createElement("button");
  button.innerText = "Kopiuj dodatki";
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(`const d = new Date();
      d.setTime(d.getTime() + 3600000 * 24 * 365);
      setCookie("addons", "${getCookie("addons")}", d);
      setCookie("__mExts", "${getCookie("__mExts")}", d);
      location.reload();
    `);
    mAlert(
      "<center><b>Skopiowano kod do schowka!</b><br><br>Po odinstalowaniu dodatków, wklej kod w konsolę, by na nowo je zainstalować.<br><br>Możesz teraz bezpiecznie odinstalować dodatki.<br>Jeśli chcesz, możesz zapisać kod na później.<br><br><b>Odinstalować dodatki?</b></center><br>",
      2,
      [
        () => {
          setCookie("addons", "", 0),
            setCookie("__mExts", "", 0),
            location.reload();
        },
      ]
    );
  });
  document.querySelector("#contxt").appendChild(button);
})();

// przedzialy lvl
(function (old) {
  hero._u = function (data) {
    var ret = old.apply(this, arguments);

    if (data.nick) {
      var swiatnazwa = g.worldConfig.getWorldName();
      var mnoznik =
        [
          "nerthus",
          "aldous",
          "berufs",
          "brutal",
          "classic",
          "gefion",
          "hutena",
          "jaruna",
          "katahha",
          "lelwani",
          "majuna",
          "nomada",
          "perkun",
          "tarhuna",
          "telawel",
          "tempest",
          "zemyna",
          "zorza",
          "fobos",
          "aether",
        ].indexOf(swiatnazwa.toLowerCase()) > -1
          ? 1.2
          : 1.4;
          let isa = Math.max(Math.min(Math.ceil((hero.lvl-4.5)/mnoznik),hero.lvl-14),1);
          if (swiatnazwa.toLowerCase()=="narwhals") var maxlvldowbicia = 500; else var maxlvldowbicia = 300;

      document.querySelector("#nick").innerHTML +=
        " (" + isa + " - " + Math.min(Math.max(Math.round((mnoznik)*hero.lvl)+4,hero.lvl+14),maxlvldowbicia) + ") (" + Math.min(hero.lvl - g.worldConfig.getDropDestroyLvl(),250) + "+ E2)";

    document.querySelector("#nick").title= g.worldConfig.getDropDestroyLvl() + " lvli niszczenia\n" + Math.min(hero.lvl - g.worldConfig.getDropDestroyLvl(),250) + "-" + (hero.lvl + g.worldConfig.getDropDestroyLvl());

    }
    return ret;
  };
})(hero._u);


// auto leczenie

(function (e) {
  e.cookie = function (t, n, r) {
    if (
      arguments.length > 1 &&
      (!/Object/.test(Object.prototype.toString.call(n)) ||
        n === null ||
        n === undefined)
    ) {
      r = e.extend({}, r);
      if (n === null || n === undefined) {
        r.expires = -1;
      }
      if (typeof r.expires === "number") {
        var i = r.expires,
          s = (r.expires = new Date());
        s.setDate(s.getDate() + i);
      }
      n = String(n);
      return (document.cookie = [
        encodeURIComponent(t),
        "=",
        r.raw ? n : encodeURIComponent(n),
        r.expires ? "; expires=" + r.expires.toUTCString() : "",
        r.path ? "; path=" + r.path : "",
        r.domain ? "; domain=" + r.domain : "",
        r.secure ? "; secure" : "",
      ].join(""));
    }
    r = n || {};
    var o = r.raw
      ? function (e) {
          return e;
        }
      : decodeURIComponent;
    var u = document.cookie.split("; ");
    for (var a = 0, f; (f = u[a] && u[a].split("=")); a++) {
      if (o(f[0]) === t) return o(f[1] || "");
    }
    return null;
  };
})(jQuery);

/*
	Ostatnie zmiany: 01-03-2017, dodanie nowych itemów leczących, pozdrawiam ;)
*/

g.loadQueue.push({
  fun: function () {
    new (function () {
      this.niceForHealing = [
        /*A*/
        "Akwamarynowy dekokt",
        "Ampułka mikstury leczącej",

        /*B*/
        "Bagienne kadzidło",
        "Bandaż",
        "Błękitny trunek mistrzów",
        "Bulgoczący dekokt",

        /*C*/
        "Chichoczący wywar",
        "Czerwona mikstura ognia",

        /*D*/
        "Dekokt pożogi",
        "Demon czystych ran",
        "Demon zatrzymania duszy",
        "Duża pomarańczowa mikstura",
        "Duże mięso",
        "Duża mikstura lecząca",
        "Duża mikstura kowboja",
        "Duża mikstura poszukiwacza",
        "Duży eliksir zdrowia centaurów",
        "Dziczyzna",

        /*E*/
        "Eliksir Interbada",
        "Eliksir krasnoludów",
        "Eliksir zdrowia",
        "Eliksir zdrowia Razuglaga",
        "Eliksir zdrowia wolnych postępów",
        "Eliksir zdrowia z jadu gniewosza",
        "Eliksir zdrowia z jadu hydry",
        "Eliksir zdrowia z jadu kobry",
        "Eliksir zdrowia z jadu salamandry",
        "Eliksir zdrowia z jadu żaby",
        "Eliksir zdrowia z jadu żmii",

        /*F*/
        "Fioletowy burberyn",
        "Flasecka pelenki",
        "Flaszka rumu",
        "Flemona",

        /*G*/
        "Grobowa rosa",

        /*H*/

        /*I*/

        /*J*/
        "Jad pustynnego węża",
        "Jajeczka żuka",
        "Jajo olbrzymiego pająka",
        "Jałowcowy wywar",

        /*K*/
        "Krew jednorożca",
        "Krew pająków",
        "Krople eliksiru wieków",
        "Krwawy miód",
        "Krystaliczny burberyn",

        /*L*/
        "Lecznicza mikstura gnolli",
        "Lecznicza mikstura gnomów leśnych",
        "Liść drzewa życia",

        /*Ł*/
        "Łagodny napar purpury",

        /*M*/
        "Magiczny eliksir Marcelusa",
        "Magiczna mikstura gnoma",
        "Magiczny napój Hektusa",
        "Magiczny wywar maczugorękich",
        "Mała mikstura poszukiwacza",
        "Mały miód gryczany",
        "Mała pomarańczowa mikstura",
        "Manierka myśliwego",
        "Marona",
        "Mieszanka ziół",
        "Mięso",
        "Mięso jelenia szlachetnego",
        "Mięso południowego niedźwiedzia",
        "Mięso szczura",
        "Mięso z kozicy",
        "Mikstura bandytów",
        "Mikstura Ezaha",
        "Mikstura Grimera",
        "Mikstura Gusrina",
        "Mikstura królika",
        "Mikstura leczenia paladynów",
        "Mikstura leczenia paladynów II",
        "Mikstura lecznicza czerwonych orków",
        "Mikstura lecznicza mnichów Andarum",
        "Mikstura Makatary",
        "Mikstura niedźwiedzia",
        "Mikstura wiewiórki",
        "Mikstura Topielicy",
        "Mikstura wilka",
        "Miód faceliowy",
        "Miód gryczany",
        "Miód lipowy",
        "Miód pitny",
        "Miód spadziowy",
        "Miód wielokwiatowy",
        "Miód własnej roboty",
        "Miód wrzosowy",
        "Miód ziołowy",
        "Mleczan niejednolity",
        "Mniejsza mikstura kowboja",
        "Mniejszy eliksir zdrowia",
        "Mocny eliksir zdrowia",
        "Mocny mchowy napar",

        /*N*/
        "Nalewka na jeżynach",
        "Napar maczugorękich",
        "Napój pokładowych szczurów",
        "Niebieski lizak",
        "Niedopita flaszka wina",
        "Niesamowita wilcza mikstura",

        /*O*/
        "Odtrutka Maddoków",
        "Odwłok mrówki robotnicy",
        "Odwłok mrówki żołnierza",
        "Ognisty dekokt",
        "Olej balsamiczny",
        "Opatrunek",
        "Opatrunek nasączony magią",
        "Opatrunek nasączony ziołami",
        "Oranżowy eliksir",
        "Orcza mikstura",

        /*P*/
        "Piersiówka mikstury leczącej",
        "Piołunian krzepiący",
        "Plaster miodu",
        "Połyskliwy wywar mniszkowy",
        "Pomarańczowa mikstura",
        "Pomarańczowa mikstura Tunii",
        "Pradawna mikstura lecząca",
        "Propolis",
        "Purpurowy napar geniusza",
        "Pyłek mniszka",
        "Pyszna mieszanka zachodu",

        /*R*/
        "Rekin słodkowodny",
        "Rozcieńczona krew torturowanych",
        "Rubinowe krople",

        /*S*/
        "Strucla",
        "Sake Chii-Yang",
        "Sake Lum-Xiang",
        "Silna mikstura Grimera",
        "Słaba mikstura Grimera",
        "Słodka woda krzepy",
        "Słoik z zupą rybną",
        "Sok z furbojagód",
        "Szpinak",
        "Szmaragdowe panaceum I",
        "Szmaragdowe panaceum II",
        "Szmaragdowe panaceum III",

        /*Ś*/
        "Średnia mikstura kowboja",
        "Średnia mikstura poszukiwacza",

        /*T*/
        "Tajemnicza mikstura goblinów",
        "Tajemniczy napój leczący",
        "Tarutaned berserkerów",
        "Tykwa świeżej rosy",
        "Tykwa korzennej wody",

        /*U*/
        "Udziec z jelenia",

        /*V*/
        "Vermilionowy napar",

        /*W*/
        "Wątroba czerwia",
        "Większy wywar maczugorękich",
        "Wrzosowy eliksir",
        "Wyciąg z echinacei",
        "Wyciąg z krwi szczura",
        "Wyciąg ze zmiażdżonej żaby",
        "Wywar leczący",
        "Wywar z trupa",

        /*Z*/
        "Zaklęta mikstura lecząca",
        "Zeszłoroczny sok z żuka",

        /*Ż*/
        "Żabie udka",
        "Życiodajne mleko pramatki",

        /*Ź*/
        "Źródlana woda Maddoków",

        "Ampułka uzdrawiająca",
        "Fiolka lekkiej regeneracji",
        "Flakonik śmiałka",
        "Krople na drobne rany",
        "Piramidka odnowy",
        "Mikstura początkującego alchemika",
        "Łyk Odrodzenia",
        "Remedium na głębokie rany",
        "Magiczne panaceum",
        "Silny specyfik leczący",
        "Wyciąg wieloziołowy",
        "Antidotum łowcy węży",
        "Słój ze śliną bazyliszka",
        "Preparat wzmocnionej regeneracji",
        "Eliksir mistrza alchemii",
        "Płyn w kryształowym więzieniu",
        "Próbka krwi minotaura",
        "Roztwór Róży Wspomnień",
        "Wywar z magicznych porostów",
        "Koncentrat zabliźniający",
      ];
      this.getCookie = function (name) {
        return $.cookie(name);
      };
      this.setCookie = function (name, value) {
        $.cookie(name, value, {
          expires: 365,
        });
      };
      this.isNiceForHealing = function (name) {
        for (var i in this.niceForHealing)
          if (this.niceForHealing[i] == name) return true;
        return false;
      };
      this.isStatOk = function (item) {
        var stats = item.stat.split(";");
        for (var i in stats) {
          var stat = stats[i].split("=");
          if (stat[0] == "lvl") {
            if (stat[1] > hero.lvl) return false;
            else return true;
          } else if (stat[0] == "timelimit") {
            var times = stat[1].split(",");
            if (times.length == 2) {
              var nextTime = parseInt(times[1]) * 1000;
              return nextTime - new Date().getTime() < 0;
            }
          }
        }
        return true;
      };
      this.hp = hero.hp;

      this.items = new Array();

      this.sortItems = function () {
        var t = this;
        t.items = new Array();
        for (var i in g.item) {
          var item = g.item[i];

          if (
            item.cl != 16 ||
            item.loc != "g" ||
            item.stat.indexOf("leczy=") == -1 ||
            !t.isNiceForHealing(item.name) ||
            !t.isStatOk(item)
          )
            continue;

          t.items[t.items.length] = i;
        }
        t.items.sort();
      };

      this.tryToHeal = function () {
        var t = this;
        if (hero.hp == hero.maxhp) return false;

        t.sortItems();

        for (var i in t.items) {
          var item = g.item[t.items[i]];
          var healHp = parseInt(
            item.stat.substr(item.stat.indexOf("leczy") + 6)
          );
          if (healHp <= 0) return false;
          if (hero.maxhp - hero.hp >= healHp) {
            _g("moveitem&st=1&id=" + item.id);
            t.hp += healHp;
            setTimeout(function () {
              if (t.hp != hero.maxhp) t.tryToHeal();
            }, 700);
            return false;
          }
        }
      };

      this.createPanel = function () {
        var t = this;
        $("<div></div>")
          .insertBefore("#centerbox")
          .attr("id", "auto-leczenie")
          .attr(
            "tip",
            "Kliknij dwukrotnie, aby zobaczyć listę obsługiwanych przedmiotów"
          )
          .css("padding", "5px")
          .css("position", "absolute")
          .css("top", parseInt(t.getCookie("auto-leczenie-y")))
          .css("left", parseInt(t.getCookie("auto-leczenie-x")))
          .css("z-index", 500)
          .css("background-color", "black")
          .css("border", "1px solid gold")
          .css("fontSize", 12)
          .css("fontFamily", "Arial")
          .css("cursor", "move")
          .css("width", 50)
          .css("textAlign", "center")
          .html("<span>Auto Leczenie</span>" + '<input type="checkbox"/>')
          .draggable({
            containment: "window",
            start: function (event, ui) {
              g.lock.add("auto-leczenie");
            },
            stop: function (event, ui) {
              t.setCookie("auto-leczenie-x", ui.position.left);
              t.setCookie("auto-leczenie-y", ui.position.top);
              g.lock.remove("auto-leczenie");
            },
          })
          .dblclick(function () {
            var c = t.niceForHealing.length;
            var firstLetter = "";
            var com = "<h2>List obsługiwanych przedmiotów:</h2><br/>";
            com +=
              'Jeżeli brakuje jakiegoś przedmiotu, napisz o tym w komentarzu pod dodatkiem podając <u>bezpośredni link do przedmiotu na <a href="https://www.emargo.pl">emargo.pl</a></u>. Przedmioty z tzw. "pełnym leczeniem" (<i>pozostało X punktów uleczania</i>) <b>NIE</b> są obsługiwane! Dokładnie zapoznaj się z ważnymi informacjami zawartymi w opisie dodatku!';
            com +=
              '<div style="height:300px; overflow-y:auto; margin-top:10px; border: 1px solid #550; background-color:#fff; padding:10px;">';
            for (var i = 0; i < c; i++) {
              var m = t.niceForHealing[i];
              var f = m.substring(0, 1);
              if (firstLetter != f) {
                firstLetter = f;
                if (i != 0) com += "<br/>";
                com += "<b>" + f + "</b><br/>";
              }
              com += m + "<br/>";
            }
            com += "</div>";
            mAlert(com);
          });
        if (t.getCookie("auto-leczenie") == "on")
          $("#auto-leczenie > input").attr("checked", "checked");
        $("#auto-leczenie > input").click(function () {
          if ($(this).is(":checked")) {
            t.setCookie("auto-leczenie", "on");
          } else {
            t.setCookie("auto-leczenie", "off");
          }
        });
      };
      this.run = function () {
        if (!this.getCookie("auto-leczenie")) {
          this.setCookie("auto-leczenie", "on");
          this.setCookie("auto-leczenie-x", 0);
          this.setCookie("auto-leczenie-y", 0);
        }
        this.createPanel();
        var th = this;
        var oldBattleMsg = battleMsg;
        battleMsg = function (c, t) {
          var ret = oldBattleMsg(c, t);
          if (
            c.indexOf("winner=") >= 0 &&
            hero.hp < hero.maxhp &&
            th.getCookie("auto-leczenie") == "on" &&
            !g.dead
          ) {
            th.tryToHeal();
          }
          return ret;
        };
      };
    })().run();
  },
  data: "",
});

// antyduszek
const klawisze = [-1, 1];
function duszek() {
  if(document.querySelector("#hero .emo-cointainer"))
  if (document.querySelector("#hero .emo-cointainer").firstChild == null)return;else
  if (document.querySelector("#hero .emo-cointainer").firstChild.src == 'https://micc.garmory-cdn.cloud/obrazki/interface/emo/stasis.gif') {
    var kierunek = klawisze[Math.floor(Math.random() * 2)];
    var kierunek1 = klawisze[Math.floor(Math.random() * 2)];
    miniMapPlus.heroGoTo(hero.x + kierunek,hero.y + kierunek1)

  }
}
setInterval(duszek, 6237);






// mmp+

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

// v3.7c - https -> https dla ikonki questów, naprawiono wywalanie gry przy zmianie koloru mapy, zaktualizowane WSZYSTKIE respy

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
window.miniMapPlus = new (function () {
  var interface = (function () {
    if (
      typeof API != "undefined" &&
      typeof Engine != "undefined" &&
      typeof margoStorage == "undefined"
    ) {
      return "new"; //NI
    } else if (typeof dbget == "undefined" && typeof proceed == "undefined") {
      return "old"; //SI
    } else {
      return "superold"; //Stary silnik
    }
  })();
  var self = this;
  const mmp = this;
  var masks = ["obj/cos.gif", "mas/nic32x32.gif", "mas/nic64x64.gif"];
  var gws = [
    "mas/exit-ith.gif",
    "mas/exit-ith1.gif",
    "mas/exit.gif",
    "mas/drzwi.gif",
    "obj/drzwi.gif",
    "mas/exit-h64c.gif",
  ];
  var oldPos = { x: -1, y: -1 };
  var otherRanks = [
    "Administrator",
    "Super Mistrz Gry",
    "Mistrz Gry",
    "Moderator Chatu",
    "Super Moderator Chatu",
  ];
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
  this.updateString = `
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
      return CFG["a_" + path] || defaultValue;
    }
    return defaultValue;
  }

  function setTip($el, txt, ctip = "") {
    if (interface == "new") {
      if (ctip) $($el).tip(txt, ctip);
      else $($el).tip(txt);
    } else {
      $el.setAttribute("tip", txt);
      if (ctip != "") $el.setAttribute("ctip", ctip);
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

  var settings = new (function () {
    var path = "mmp";
    var Storage = interface != "old" ? API.Storage : margoStorage;
    this.set = function (p, val) {
      Storage.set(path + p, val);
    };
    this.get = function (p) {
      return Storage.get(path + p);
    };
    this.remove = function (p) {
      try {
        Storage.remove(path + p);
      } catch (e) {}
    };
    this.exist = function () {
      return Storage.get(path) != null;
    };
  })();

  let mobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  let consoleDevice =
    /PlayStation 4/i.test(navigator.userAgent) ||
    settings.get("/forceMobileMode"); // TODO: add more consoles
  const $visibility = (function () {
    let $div = document.createElement("div");
    $div.classList.add("mmp-visibility");
    return $div;
  })();

  this.initSettings = function () {
    if (!settings.exist()) {
      this.setDefaultSettings();
    } else {
      this.fixSettings();
    }
  };

  this.fixSettings = function () {
    var loaded = settings.get("");
    var def = this.getDefaultSettings();
    if (this.fixSettingsObject(loaded, def)) settings.set("", loaded);
  };

  this.fixSettingsObject = function (loaded, def) {
    let overwrite = false;
    for (let key in def) {
      if (!isset(loaded[key])) {
        loaded[key] = def[key];
        overwrite = true;
      } else {
        if (typeof def[key] == "object") {
          const res = this.fixSettingsObject(loaded[key], def[key]);
          if (res) overwrite = true;
        }
      }
    }
    return overwrite;
  };

  this.setDefaultSettings = function () {
    settings.set("", this.getDefaultSettings());
  };

  this.convertOldSettings = function (json) {
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

  this.getDefaultSettings = function () {
    var oldVersion = localStorage.getItem("miniMapPlus");
    if (oldVersion) return this.convertOldSettings(oldVersion);

    return {
      show: 69,
      minlvl: "15",
      colors: {
        hero: "#FF0000",
        other: "#FFFFFF",
        rip: "#FFFFFF",
        friend: "#08ad00",
        enemy: "#FF0000",
        clan: "#08ad00",
        ally: "#9eff91",
        npc: "#ddff00",
        mob: "#F80C0C",
        elite: "#00ffe9",
        elite2: "#039689",
        elite3: "#007500",
        heros: "#c6ba35",
        titan: "#809912",
        item: "#f56bff",
        gw: "#0000FF",
        "heros-resp": "#1FFF4B",
        "heros-mark": "#FF0000",
        col: "#400040",
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
        col: 0,
      },
      trackedNpcs: [],
      trackedItems: [],
      maxlvl: 27,
      mapsize: 1,
      opacity: 1,
      interpolerate: true,
      darkmode: false,
      showqm: true,
      showcol: false,
      showcoords: true,
      // chromium scaling is ugly
      manualDownscale: typeof window.chrome != "undefined",
      //showevonetwork: true
    };
  };

  this.getInstallSource = function () {
    if (interface != "old") return "addon";
    var panelAddons = getCookie("__mExts");
    if (panelAddons == null) return "addon";
    var srcs = {
      p: "panel dodatków (pub.)",
      d: "dev",
      v: "panel dodatków",
    };
    for (var i in srcs) {
      if (panelAddons.indexOf(i + "64196") > -1) return srcs[i];
    }
    return "addon";
  };

  this.initHTML = function () {
    $wrapper = document.createElement("div");
    $wrapper.classList.add("mmpWrapper");

    $map = document.createElement("div");
    $map.classList.add("mmpMap");
    if (!mobileDevice) $map.addEventListener("click", this.goTo);
    else {
      //  $map.addEventListener("touchstart", this.goTo);
      $map.addEventListener("click", this.goTo); // tu zmienilem na clicka
    }
    $map.addEventListener("contextmenu", this.rclick);

    $coordText = document.createElement("div");
    $coordText.classList.add("mmpCoordText");
    $coordText.innerText = "(0,0)";
    $map.appendChild($coordText);
    $map.addEventListener("mousemove", (e) => {
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
    $info.innerHTML = "miniMapPlus by Priweejt</a> |&nbsp;";
    $bottombar.appendChild($info);
    $searchTxt = document.createElement("span");
    $searchTxt.innerHTML = "Szukaj:&nbsp;";
    $bottombar.appendChild($searchTxt);
    $search = document.createElement("input");
    $search.addEventListener("keyup", this.searchBarHandler);
    $bottombar.appendChild($search);
    var $settings = document.createElement("img");
    $settings.src =
      "https://priw8.com/margo/SI-addon/mmp/img/config.png";
    $settings.classList.add("mmpSettingIcon");
    $settings.addEventListener("click", niceSettings.toggle);
    setTip($settings, "Ustawienia");
    $bottombar.appendChild($settings);

    $wrapper.appendChild($map);
    $wrapper.appendChild($bottombar);

    if (interface == "new")
      document.querySelector(".game-window-positioner").appendChild($wrapper);
    else if (interface == "old")
      document.querySelector("#centerbox2").appendChild($wrapper);
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

  this.initEventListener = function () {
    document.addEventListener(
      "keydown",
      function (e) {
        if (
          e.target.tagName != "INPUT" &&
          e.target.tagName != "TEXTAREA" &&
          e.keyCode == settings.get("/show")
        ) {
          self.toggleView();
        }
      },
      false
    );
  };

  this.appendMainStyles = function () {
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

  this.onSettingsUpdate = function () {
    self.appendUserStyles();
    self.objectMgr.manageDisplay();
    self.resetQtrack();
  };

  this.appendUserStyles = function () {
    if (!$userStyle) {
      $userStyle = document.createElement("style");
      document.head.appendChild($userStyle);
    }
    $userStyle.innerHTML = this.generateUserCss();
  };

  this.generateUserCss = function () {
    var css = "";
    var colors = settings.get("/colors");
    for (var name in colors) {
      css += this.getSingleColorCssLine(name, colors[name]);
    }
    const layers = settings.get("/layers");
    for (const name in layers) {
      css += this.getSingleLayerCssLine(name, layers[name]);
    }
    css += ".mmpWrapper { opacity: " + settings.get("/opacity") + "; }\n";
    if (settings.get("/interpolerate"))
      css += ".mmpMapObject { transition: all .5s linear; }\n";
    if (settings.get("/darkmode")) {
      css +=
        ".mmpWrapper .mmpBottombar { background: #222222; color: #CCCCCC; }\n";
      css +=
        ".mmpWrapper .mmpBottombar input {background: black; border: 1px solid #333333; color: white;}\n";
      css += ".mmpWrapper .mmpBottombar a {color: #009c9c;}\n";
      css += ".mmpMobileButton {background: #222222; color: #CCCCCC;}\n";
    }
    if (settings.get("/altmobilebtt")) {
      css += ".mmpMobileButton { top: 470px; left: 665px; }\n";
    }
    if (!settings.get("/showqm")) {
      css += ".mmpQM { display: none; }\n";
    } else {
      css += ".mmpQM { display: block; position: absolute; top: -200%;}\n";
    }
    if (settings.get("/novisibility")) {
      css += ".mmp-visibility { display: none }";
    }

    if (!settings.get("/showcoords") || mobileDevice || consoleDevice) {
      css += ".mmpCoordText {display: none}";
    }

    return css;
  };

  this.getSingleColorCssLine = function (name, val) {
    if (innerDotKeys.indexOf(name) > -1) {
      return (
        ".mmpMapObject .innerDot.mmp-" + name + " { background: " + val + ";}\n"
      );
    } else {
      return ".mmpMapObject.mmp-" + name + " { background: " + val + ";}\n";
    }
  };

  this.getSingleLayerCssLine = function (name, val) {
    return `.mmpMapObject.mmp-${name} { z-index: ${val}; }\n`;
  };

  //functionality
  this.rclick = function (e) {
    if (interface != "old") return; //TODO: support other interfaces
    var tar = false;
    if (e.target.classList.contains("mmp-other")) tar = e.target;
    else if (e.target.parentElement.classList.contains("mmp-other"))
      tar = e.target.parentElement; //for others with innerdot
    if (tar) {
      var obj = self.objectMgr.getByElem(tar);
      if (obj.d.evoNetwork) return;
      var id = obj.d.id;
      id = id.split("-")[1]; //id = OTHER-rid, where rid = char id of the other player
      var $other = document.querySelector("#other" + id);
      //hacky solution
      var sm = window.showMenu;
      var otherMenu = false;
      window.showMenu = function (e, menu) {
        otherMenu = menu;
        window.showMenu = sm;
      };
      $other.click();
      if (otherMenu) {
        for (var i in otherMenu) {
          //idk it doesn't hide automatically for whatever reason (I mean it does, but only after it has been clicked 2 times)
          otherMenu[i][1] += ";hideMenu();";
        }
        window.showMenu(e, otherMenu, true);
      }
      e.preventDefault();
    }
  };

  this.goTo = function (e) {
    if (e.type == "touchstart") {
      var offsets = self.getOffsets(e.target);
      e.offsetX = e.touches[0].pageX - offsets[0];
      e.offsetY = e.touches[0].pageY - offsets[1];
      e.stopPropagation();
    }

    var coords = self.getCoordsFromEvent(e);
    if (coords) {
      self.heroGoTo(coords.x, coords.y);
    }
  };

  this.heroGoTo = function (x, y) {
    if (interface == "new") {
      Engine.hero.autoGoTo({ x: x, y: y });
    } else if (interface == "old") {
      self.searchPath.call(window.hero, x, y);
    } else {
      self.oldMargoGoTo(x, y);
    }
  };

  this.oldMargoGoTo = function (x, y) {
    //window,hero.setMousePos(x*32,y*32);
    window.hero.mx = x;
    window.hero.my = y;
    window.global.movebymouse = true;
    this.cancelMouseMovement = true;
  };

  this.getCoordsFromEvent = function (e) {
    if (e.target == $map) {
      return {
        x: Math.round(e.offsetX / (objScale * 32)),
        y: Math.round(e.offsetY / (objScale * 32)),
      };
    } else {
      var obj = this.objectMgr.getByElem(e.target);
      if (obj) {
        return {
          x: obj.d.x,
          y: obj.d.y,
        };
      } else {
        return null;
      }
    }
  };

  this.getOffsets = function ($el, offs) {
    var offsets = offs ? offs : [0, 0];
    offsets[0] += $el.offsetLeft;
    offsets[1] += $el.offsetTop;
    if ($el.parentElement != null) {
      this.getOffsets($el.parentElement, offsets);
    }
    return offsets;
  };

  this.searchBarHandler = function (e) {
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
    COMPARISON: 5,
  };
  const tokens = [
    {
      // ignore whitespace
      regex: /^[ \n\t]+/,
      ignore: true,
    },
    {
      regex: /^([^\[\]\(\)\*,=<>\n\t]+)/,
      type: TOKEN.TEXT,
    },
    {
      regex: /^,/,
      type: TOKEN.COMMA,
    },
    {
      regex: /^\[/,
      type: TOKEN.LBRACKET,
    },
    {
      regex: /^\]/,
      type: TOKEN.RBRACKET,
    },
    {
      regex: /^(<=)/,
      type: TOKEN.COMPARISON,
    },
    {
      regex: /^(>=)/,
      type: TOKEN.COMPARISON,
    },
    {
      regex: /^(\==)/,
      type: TOKEN.COMPARISON,
    },
    {
      regex: /^(=|<|>)/,
      type: TOKEN.COMPARISON,
    },
    {
      regex: /^./,
      type: TOKEN.ILLEGAL,
    },
  ];
  const words = [
    {
      syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.COMPARISON, TOKEN.TEXT], // RBRACKET nie jest wymagany, żeby w trakcie pisania już podświetlało.
      handler: (key, comparison, value) => {
        return {
          action: "filter",
          key: key,
          comparison: comparison,
          value: value.toLowerCase(),
        };
      },
    },
    {
      syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.RBRACKET],
      handler: (key) => {
        return {
          action: "filter",
          key: key,
          comparison: "?",
        };
      },
    },
    {
      syntax: [TOKEN.TEXT, TOKEN.COMMA, TOKEN.TEXT],
      handler: (textX, textY) => {
        let x = parseInt(textX),
          y = parseInt(textY);

        if (isNaN(x) || isNaN(y)) return null;

        return {
          action: "highlight",
          coords: [x, y],
        };
      },
    },
    {
      syntax: [TOKEN.TEXT],
      handler: (value) => {
        return {
          action: "filter",
          key: "name",
          comparison: "=",
          value: value.toLowerCase(),
        };
      },
    },
  ];
  this.parseSearchQuery = function (str) {
    const tokenList = [];
    while (str.length) {
      for (let i = 0; i < tokens.length; ++i) {
        const match = str.match(tokens[i].regex);
        if (match) {
          if (!tokens[i].ignore) {
            tokenList.push({
              type: tokens[i].type,
              match: match,
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
    while (tokenIndex < tokenList.length) {
      let matched = false;
      for (let i = 0; i < words.length; ++i) {
        const word = words[i];
        let wordMatched = true;
        let args = [];
        for (let j = 0; j < word.syntax.length; ++j) {
          if (
            tokenList.length <= tokenIndex + j ||
            word.syntax[j] != tokenList[tokenIndex + j].type
          ) {
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
      if (!matched) tokenIndex += 1;
    }

    return actions;
  };

  this.makeTip = function (data) {
    var tip = data.nocenter ? "" : "<center>";
    tip +=
      data.txt +
      "<div style='text-align: center;color: gray'>(" +
      data.x +
      "," +
      data.y +
      ")</div>";
    return tip + (data.nocenter ? "" : "</center>");
  };

  this.toggleView = function () {
    $wrapper.style.display =
      $wrapper.style.display == "block" ? "none" : "block";
  };

  this.initResponseParser = function () {
    if (interface == "new") {
      API.priw.emmiter.on("before-game-response", (data) => {
        if (!manualMode) this.parseInput(data);
      });
    } else if (interface == "old") {
      var _parseInput = parseInput;
      parseInput = function (data) {
        if (!manualMode) self.parseInput(data);
        return _parseInput.apply(this, arguments);
      };
    } else {
      API.emmiter.on("response", (data) => {
        if (!manualMode) self.parseInput(self.parseOldMargonemData(data));
      });
    }
  };

  self.arr2obj = function (arr) {
    var ret = {};
    for (var i = 0; i < arr.length; i++) {
      ret[arr[i].id] = arr[i];
    }
    return ret;
  };

  self.parseOldMargonemData = function (data) {
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

  this.enableManualMode = function () {
    //tryb w którym ignoruje wszystkie dane z silnika gry; na potrzeby mojego dodatku klanowego
    manualMode = true;
  };
  this.disableManualMode = function () {
    manualMode = false;
  };

  this.parseInput = function (data) {
    for (var i in data) {
      if (typeof this.eventHandlers[i] == "function")
        this.eventHandlers[i](data[i], data);
    }
    if (data.townname) this.eventHandlers.gateways(data.gw2, data.townname);
  };

  this.eventHandlers = {
    town: function (town, full) {
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
    npc: function (npc) {
      self.parseNpc(npc);
    },
    gateways: function (gws, townname) {
      self.parseGws(gws, townname);
    },
    other: function (others) {
      self.parseOther(others);
    },
    item: function (items) {
      self.parseItem(items);
    },
    rip: function (rip) {
      self.parseRip(rip);
    },
  };

  this.loadCols = function (data) {
    if (!settings.get("/showcol")) return;

    if (typeof data.cl == "undefined") {
      console.error("mmp: collision data missing from town");
      return;
    }

    /* Dekompresja kolizji (mocno oparta o kod SI) */
    let index = 0;
    const cols = [];
    for (let i = 0; i < data.cl.length; ++i) {
      let code = data.cl.charCodeAt(i);
      if (code > 95 && code < 123) {
        /* Wypełnij (code-95)*6 miejsc zerami */
        for (let j = 95; j < code; ++j) {
          for (let k = 0; k < 6; ++k) cols[index++] = 0;
        }
      } else {
        /* W tym wupadku (code-32) to 6-bitowa liczba w której każdy bit odpowiada za kolejną kolizję */
        code -= 32;
        for (let j = 0; j < 6; ++j) cols[index++] = code & (1 << j) ? 1 : 0;
      }
    }

    const townData = data.town;
    for (let x = 0; x < townData.x; ++x) {
      for (let y = 0; y < townData.y; ++y) {
        if (cols[y * townData.x + x]) {
          this.objectMgr.updateObject({
            id: `col-${x}-${y}`,
            x: x,
            y: y,
            type: "col",
            filterData: {
              name: `Kolizja ${x} ${y}`,
              typ: "kolizja",
            },
          });
        }
      }
    }
  };

  this.resetQtrack = function () {
    qTrack.reset();
    var npc = settings.get("/trackedNpcs");
    for (var i = 0; i < npc.length; i++) {
      qTrack.add({
        type: "NPC",
        name: npc[i],
      });
    }
    var item = settings.get("/trackedItems");
    for (i = 0; i < item.length; i++) {
      qTrack.add({
        type: "ITEM",
        name: item[i],
      });
    }
  };

  this.loadMap = function (town) {
    if (interface == "superold") town.file = town.img;
    this.resetQtrack();
    this.objectMgr.deleteAll();
    var mapsize = interface == "new" ? 700 : 440;
    mapsize = mapsize * settings.get("/mapsize");
    if (town.x > town.y) {
      var height = Math.floor((town.y / town.x) * mapsize);
      var width = mapsize;
    } else {
      var width = Math.floor((town.x / town.y) * mapsize);
      var height = mapsize;
    }
    objScale = width / (town.x * 32);
    objSize = Math.ceil(objScale * 32);

    var left = 0;
    var top = 0;
    if (interface != "new") {
      top = -30;
      left = -144;
    }

    Object.assign($wrapper.style, {
      //$map will stretch the $wrapper
      //width: width + "px",
      //height: (height+20) + "px",
      left: "calc(50% - " + (width / 2 - left) + "px)",
      top: "calc(50% - " + (height / 2 - top) + "px)",
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
    }
    this.updateHero(true);
  };

  this.updateVisibility = function (n, scale) {
    if (n) {
      let size = (n * 2 + 1) * scale * 32;
      Object.assign($visibility.style, {
        width: size + "px",
        height: size + "px",
        "margin-top": size / -2 + scale * 16 + "px",
        "margin-left": size / -2 + scale * 16 + "px",
        opacity: 1,
      });
    } else {
      $visibility.style.opacity = 0;
    }
  };

  this.loadMapImg = function (file, w, h) {
    $map.style["background-image"] = "";
    $map.style["background"] = "#444444";
    var miniMapImg = new Image();
    miniMapImg.crossOrigin = "anonymous";
    if (file.indexOf("https") == -1) {
      var mpath = getPath("mpath", "/obrazki/miasta/");
      miniMapImg.src =
        (interface == "superold" ? "https://oldmargonem.pl" : "") +
        mpath +
        file;
    } else {
      miniMapImg.src = file;
    }
    miniMapImg.onload = function () {
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
        while (loops-- > 0) {
          currentWidth *= 0.5;
          currentHeight *= 0.5;
          ctx.drawImage(
            canvas,
            0,
            0,
            0.5 * miniMapImg.width,
            0.5 * miniMapImg.height
          );
        }

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = currentWidth;
        finalCanvas.height = currentHeight;
        const fctx = finalCanvas.getContext("2d");
        fctx.drawImage(
          canvas,
          0,
          0,
          currentWidth,
          currentHeight,
          0,
          0,
          currentWidth,
          currentHeight
        );

        $map.style["background"] = "";
        $map.style["background-image"] = `url(${finalCanvas.toDataURL()})`;
      } else {
        $map.style["background"] = "";
        $map.style["background-image"] = "url(" + miniMapImg.src + ")";
      }
    };
  };

  this.parseNpc = function (npcs) {
    for (var id in npcs) {
      var npc = npcs[id];
      if (!npc.del) {
        this.addNewNpcToMap(npc, id);
      } else {
        this.objectMgr.updateObject({
          id: "NPC-" + id,
          del: 1,
        });
        if (npcTrack[id]) {
          qTrack.remove({
            type: "NPC",
            nick: npcTrack[id].nick,
          });
          delete npcTrack[id];
        }
      }
    }
  };
  this.addNewNpcToMap = function (npc, id) {
    var { type, flash } = this.getNpcType(npc, id);
    if (type == undefined) return;
    var { tip, ctip } = this.getNpcTip(npc, type, flash);
    var data = {
      id: "NPC-" + id,
      type: type,
      flash: flash,
      tip: tip,
      ctip: ctip,
      x: npc.x,
      y: npc.y,
      qm: npc.qm || (npc.actions && npc.actions & 128),
    };
    data.filterData = {
      name: npc.nick,
      typ: this.getNpcFriendlyType(type),
    };
    if (npc.qm || (npc.actions && npc.actions & 128)) {
      data.filterData.quest = true;
    }
    if (type != "npc" && type != "gw" && type != "item") {
      data.lvl = npc.lvl;
      data.filterData.lvl = npc.lvl;
    }
    if (npc.grp != 0) {
      data.filterData.grp = true;
      data.filterData.grupa = true;
    }

    this.objectMgr.updateObject(data);
  };
  this.getNpcTip = function (npc, type, important) {
    var tip = "";
    var mask = false;
    for (var i = 0; i < masks.length; i++) {
      if (masks[i].indexOf(npc.icon) > -1) mask = true;
    }
    if (!mask) tip += "<img src='" + this.npcIconHTML(npc.icon) + "'>";
    var ctip = "t_npc";
    if (type == "gw") {
      ctip = false;
      tip = this.makeTip({
        txt: npc.nick + "<br>",
        x: npc.x,
        y: npc.y,
      });
    } else if (type == "item") {
      ctip = "t_item";
      tip = this.makeTip({
        x: npc.x,
        y: npc.y,
        txt: tip + "<br>" + npc.nick,
      });
    } else {
      tip = this.normalNpcTip(npc, type, important, tip);
    }
    return {
      tip: tip,
      ctip: ctip,
    };
  };
  this.npcIconHTML = function (icon) {
    if (icon.indexOf("://") > -1 || icon.indexOf("obrazki/") > -1)
      return icon; //zapomniałem o kompatybilności z jedną rzeczą którą robię xd
    else if (interface == "superold")
      return "https://oldmargonem.pl/obrazki/npc/" + icon;
    else return getPath("npath", "/obrazki/npc") + icon;
  };
  this.oldNpcTip = function (npc, type, eve) {
    var icon = npc.icon;
    npc.icon = "kappa";
    if (type == "elite2" && !eve) {
      npc.wt = 30;
    }

    if (!g.tips.npc) newNpc();
    var tip = g.tips.npc(npc);

    if (type == "elite2") {
      if (!eve) {
        npc.wt = 20;
        tip = tip.replace("elita III", "elita II");
      } else {
        tip = tip.replace("elita", "specjalna elita");
      }
    }
    npc.icon = icon;
    return typeof tip == "string" ? tip : "";
  };
  this.newNpcTip = function (npc, type, eve) {
    var nick = "<div><strong>" + npc.nick + "</strong></div>";
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
    }
    var lvl = npc.lvl ? npc.lvl + " lvl" : "";
    var grp = npc.grp ? " grp" : "";
    var lvlgrp = "<span>" + lvl + grp + "</span>";
    return nick + type + lvlgrp;
  };
  this.oldMargoNpcTip = function (npc, type, eve) {
    var nick = "<b style='color:orange;'>" + npc.nick + "</b>";
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
    }
    var lvl = npc.lvl ? "Lvl: " + npc.lvl : "";
    var grp = npc.grp ? " grp" : "";
    var lvlgrp = "<span>" + lvl + grp + "</span>";
    return nick + type + lvlgrp;
  };
  this.normalNpcTip = function (npc, type, important, before) {
    if (interface == "old") {
      var tip = this.oldNpcTip(npc, type, important)
        .replace("<span ></span><br>", "")
        .replace("<span ></span>", "");
    } else if (interface == "new") {
      var tip = this.newNpcTip(npc, type, important);
    } else {
      var tip = this.oldMargoNpcTip(npc, type, important);
    }
    if (npc.lvl > 0) tip += "<br>";
    return this.makeTip({
      txt: before + tip,
      x: npc.x,
      y: npc.y,
    });
  };
  var npcTrack = {};
  this.addNpcToTrack = function (npc, id, heros) {
    npcTrack[id] = npc;
    qTrack.add({
      type: "NPC",
      name: npc.nick,
    });
    if (interface != "superold") this.checkForUnknownResp(npc, heros);
  };
  this.checkForUnknownResp = function (npc, heros) {
    var map = interface == "new" ? Engine.map.d : window.map;
    var db = heros ? herosDB : eliteDB;
    if (db[npc.nick] && db[npc.nick].spawns) {
      var spawns = db[npc.nick].spawns;
      if (spawns[map.name] || spawns[map.id]) {
        var spawnsOnMap = spawns[map.name] ? spawns[map.name] : spawns[map.id];
        if (spawns[map.name]) this.unknownMapId(map.name, map.id, heros);
        if (!this.coordsExistInSpawns(spawnsOnMap, npc.x, npc.y))
          this.unknownResp(npc, map, heros);
      }
    }
  };
  this.coordsExistInSpawns = function (spawns, x, y) {
    for (var i = 0; i < spawns.length; i++) {
      if (spawns[i][0] == x && spawns[i][1] == y) return true;
    }
    return false;
  };
  this.unknownResp = function (npc, map, heros) {
    var log = interface == "new" ? API.priw.console.log : window.log;
    log(
      "<hr>" +
        (heros ? "Heros" : "Elita") +
        " znajduje się na respie, który nie jest w bazie danych minimapy.",
      1
    );
  };
  this.unknownMapId = function (name, id, heros) {
    var log = interface == "new" ? API.priw.console.log : window.log;
  };
  this.getNpcType = function (npc, id) {
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
      }
    } else if (npc.type == 0 || npc.type == 5 || npc.type == 6) {
      if (gws.indexOf(npc.icon) == -1) {
        var type = "npc";
      } else {
        var type = "gw";
      }
    } else if (_l() == "en" && npc.type == 7) {
      var type = "item";
    }
    return {
      type: type,
      flash: flash,
    };
  };
  this.getNpcFriendlyType = function (type) {
    return {
      titan: "potwór: tytan",
      heros: "potwór: heros",
      elite2: "potwór: elita 2",
      elite3: "potwór: elita 3",
      elite: "potwór: elita",
      mob: "potwór: zwykły",
      npc: "npc",
      gw: "przejście",
      item: "przedmiot",
    }[type];
  };

  this.initHeroUpdating = function () {
    if (interface != "new") {
      var _run = hero.run;
      hero.run = function () {
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
      Engine.map.draw = function () {
        self.updateHero();
        return _draw.apply(this, arguments);
      };
    }
  };

  this.updateHero = function (ignore) {
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
      children: [$visibility],
    });
    this.herosCheckedRespManager.update(hero);
    oldPos.x = hero.x;
    oldPos.y = hero.y;
  };

  this.parseGws = function (gws, townname) {
    for (var i = 0; i < gws.length; i += 5) {
      var tip = townname[gws[i]];
      if (gws[i + 3]) {
        if (gws[i + 3] == 2) {
          tip +=
            interface != "superold"
              ? "<br>(" + _t("require_key", null, "gtw") + ")"
              : "<br>(wymaga klucza)";
        }
      }
      if (gws[i + 4]) {
        var min = parseInt(gws[i + 4]) & 65535;
        var max = (parseInt(gws[i + 4]) >> 16) & 65535;
        tip += "<br>" + _t("gateway_availavle", null, "gtw");
        tip += min ? _t("from_lvl %lvl%", { "%lvl%": min }, "gtw") : "";
        tip +=
          max >= 1000
            ? ""
            : _t("to_lvl %lvl%", { "%lvl%": max }, "gtw") +
              _t("lvl_lvl", null, "gtw");
      }
      this.objectMgr.updateObject({
        tip: this.makeTip({
          txt: tip + "<br>",
          x: gws[i + 1],
          y: gws[i + 2],
        }),
        type: "gw",
        x: gws[i + 1],
        y: gws[i + 2],
        id: "GW-" + gws[i] + "-" + i,
        filterData: {
          name: townname[gws[i]],
          typ: "przejście",
        },
      });
    }
  };

  this.parseOther = function (others) {
    for (var id in others) {
      var other = others[id];
      if (!other.del) {
        if (!this.objectMgr.objectExists(`OTHER-${id}`)) {
          // Failsafe for weird cases caused by certain SI addons
          if (typeof other.nick != "undefined")
            this.addNewOtherToMap(other, id);
        } else {
          this.updateOther(other, id);
        }
      } else {
        this.objectMgr.updateObject({
          id: "OTHER-" + id,
          del: 1,
        });
      }
    }
  };
  this.updateOther = function (other, id) {
    var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
    var data = {};
    var canLoadImgFromCache = !other.icon;
    var previousData =
      interface == "new" ? Engine.others.getById(id).d : g.other[id];
    var other = Object.assign({}, previousData, other);
    if (isset(other.x)) data.x = other.x;
    if (isset(other.y)) data.y = other.y;
    var { tip, ctip } = this.getOtherTip(other, evoNetwork);
    if (canLoadImgFromCache && this.otherImgCache[id]) {
      var img = this.otherImgCache[id];
      tip =
        '<center><div style="background-image: url(' +
        img.src +
        "); width: " +
        img.width / 4 +
        "px; height: " +
        img.height / 4 +
        'px"></div></center>' +
        tip;
    } else {
      this.loadOtherImg(other, id, tip);
    }
    data.tip = tip;
    data.ctip = ctip;
    data.id = "OTHER-" + id;
    this.objectMgr.updateObject(data);
  };
  this.otherImgCache = {};
  this.checkIfOtherFromEvoNetwork = function (id) {
    //rozpoznawanie postaci z innych światów dodawanych przez dodatek ccarederra
    return String(id).split("_")[1] == "wsync";
  };
  this.addNewOtherToMap = function (other, id) {
    var type;
    var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
    if (evoNetwork && !settings.get("/showevonetwork")) return;
    switch (other.relation) {
      case "": //obcy
        type = "other";
        break;
      case "cl-fr": //sojusznik
      case "fr-fr": //fraction friend
        type = "ally";
        break;
      case "cl": //klanowicz
        type = "clan";
        break;
      case "fr": //znajomy
        type = "friend";
        break;
      case "en": //wróg
      case "cl-en": //wrogi klan
      case "fr-en": //fraction enemy
        type = "enemy";
        break;
      default:
        type = "other";
        break;
    }
    if (evoNetwork) type = "evoNetwork";
    var { tip, ctip } = this.getOtherTip(other, evoNetwork);
    this.objectMgr.updateObject({
      tip: tip,
      ctip: ctip,
      type: "other",
      type2: type,
      x: other.x,
      y: other.y,
      id: "OTHER-" + id,
      evoNetwork: evoNetwork,
      filterData: {
        name: other.nick,
        klan: typeof other.clan == "object" ? other.clan.name : "",
        lvl: other.lvl,
        typ: "gracz",
      },
      click: function () {
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
            }
          }
        } else if (interface == "old") {
          chatTo(other.nick);
        }
      },
    });
    this.loadOtherImg(other, id, tip);
  };
  this.loadOtherImg = function (other, id, tip) {
    var img = new Image();
    img.src =
      (interface == "superold" ? "https://oldmargonem.pl" : "") +
      getPath("opath", "/obrazki/postacie/") +
      other.icon;
    img.onload = function () {
      self.otherImgCache[id] = img;
      tip =
        '<center><div style="background-image: url(' +
        img.src +
        "); width: " +
        img.width / 4 +
        "px; height: " +
        img.height / 4 +
        'px"></div></center>' +
        tip;
      self.objectMgr.updateObject({
        tip: tip,
        id: "OTHER-" + id,
      });
    };
  };
  this.getOtherTip = function (other, evoNetwork) {
    if (interface == "old") {
      var tip = this.oldOtherTip(other);
    } else if (interface == "new") {
      var tip = this.newOtherTip(other);
    } else {
      var tip = this.oldMargoOtherTip(other);
    }
    if (evoNetwork) {
      tip += "<i>Postać z dodatku World Sync</i>";
    }
    return {
      tip: this.makeTip({
        txt: tip + (evoNetwork ? "" : "<br>"),
        x: other.x,
        y: other.y,
      }),
      ctip:
        "t_other" +
        (other.relation != "" && interface != "new"
          ? " t_" + other.relation
          : ""),
    };
  };
  this.oldOtherTip = function (other) {
    if (!g.tips.other) newOther({ 0: {} });
    newOther({ 0: { del: 1 } });
    var tip = g.tips.other(other);
    return tip.replace(/'/g, "&apos;");
  };
  this.newOtherTip = function (other) {
    //pre-wrapper
    if (other.rights) {
      var rank;
      if (other.rights & 1) rank = 0;
      else if (other.rights & 16) rank = 1;
      else if (other.rights & 2) rank = 2;
      else if (other.rights & 4) rank = 4;
      else rank = 3;
      rank = "<div class='rank'>" + otherRanks[rank] + "</div>";
    } else {
      var rank = "";
    }
    var guest = isset(other.guest) ? "<div class='rank'>Zastępca</div>" : "";
    var preWrapper = rank + guest;
    //wrapper
    var nick = "<div class='nick'>" + other.nick + "</div>";
    var prof = "<div class='profs-icon " + other.prof + "'></div>";
    var bless = isset(other.ble) ? "<div class='bless'></div>" : "";
    var infoWrapper =
      "<div class='info-wrapper'>" + nick + bless + prof + "</div>";
    //post-wrapper
    var wanted = isset(other.wanted) ? "<div class='wanted'></div>" : "";
    var clan =
      isset(other.clan) && other.clan.name != ""
        ? "<div class='clan-in-tip'>" +
          other.clan.name +
          "</div><div class='line'></div>"
        : "";
    var lvl = isset(other.lvl)
      ? "<div class='lvl'>" + other.lvl + " lvl</div>"
      : "";
    var mute = other.attr & 1 ? "<div class='mute'></div>" : "";
    var postWrapper = wanted + clan + lvl + mute;

    return preWrapper + infoWrapper + postWrapper;
  };
  this.oldMargoOtherTip = function (other) {
    var tip = "<b style='color:yellow'>" + other.nick + "</b>";
    if (other.clan)
      tip +=
        "<span style='color:#fd9;'>[" + g.clanname[other.clan] + "]</span><br>";
    tip += "Lvl: " + other.lvl + other.prof;
    return tip;
  };

  this.parseItem = function (items) {
    for (var id in items) {
      var item = items[id];
      if (item.loc == "m") {
        this.addNewItemToMap(item, id);
      } else {
        var previousData =
          interface == "new" ? Engine.items.getItemById(id) : g.item[id];
        if (interface == "new" && previousData) previousData = previousData.d;
        if (previousData && previousData.loc == "m") {
          this.objectMgr.updateObject({
            id: "ITEM-" + id,
            del: 1,
          });
        }
      }
    }
  };
  this.addNewItemToMap = function (item, id) {
    var tip = this.getItemTip(item);
    this.objectMgr.updateObject({
      id: "ITEM-" + id,
      tip: tip,
      ctip: "t_item",
      x: item.x,
      y: item.y,
      type: "item",
      filterData: {
        name: item.name,
        typ: "przedmiot",
      },
    });
  };
  this.oldMargoItemTip = function (item) {
    return "<b>" + item.name + "</b>" + item.stats;
  };
  this.getItemTip = function (item) {
    var nocenter = true;
    var tip =
      interface == "new"
        ? MargoTipsParser.getTip(item)
        : interface == "old"
        ? itemTip(item)
        : this.oldMargoItemTip(item);
    if (interface == "old" && tip.indexOf("tip-section") == -1) {
      //kompatybilność z moim dodatkiem na nowe tipy
      tip =
        "<img src='" +
        (interface == "superold" ? "https://oldmargonem.pl" : "") +
        getPath("ipath", "/obrazki/itemy/") +
        item.icon +
        "'>" +
        tip;
      nocenter = false;
    }
    return this.makeTip({
      txt: tip,
      x: item.x,
      y: item.y,
      nocenter: nocenter,
    });
  };
  var ripCount = 0;
  this.parseRip = function (rips) {
    for (var i = 0; i < rips.length; i += 8) {
      this.addNewRipToMap({
        nick: rips[i],
        lvl: rips[i + 1],
        prof: rips[i + 2],
        x: parseInt(rips[i + 3]),
        y: parseInt(rips[i + 4]),
        ts: parseInt(rips[i + 5]),
        desc1: rips[i + 6],
        desc2: rips[i + 7],
      });
      ripCount++;
    }
  };
  this.addNewRipToMap = function (rip) {
    var isHerosRip = false;
    var timeToDisappear = 300 + rip.ts - unix_time();
    if (timeToDisappear <= 0) return;
    var tip =
      "<b>" +
      _t("rip_prefix") +
      " " +
      htmlspecialchars(rip.nick) +
      "</b>Lvl: " +
      rip.lvl +
      rip.prof +
      "<i>" +
      htmlspecialchars(rip.desc1) +
      "</i><i>" +
      htmlspecialchars(rip.desc2) +
      "</i>";
    this.objectMgr.updateObject({
      tip: this.makeTip({
        txt: tip,
        x: rip.x,
        y: rip.y,
      }),
      type: "rip",
      x: rip.x,
      y: rip.y,
      circle: true,
      border: true,
      id: "RIP-" + ripCount,
      ctip: "t_rip",
      filterData: {
        name: `Grób ${rip.nick}`,
        typ: "grób",
        lvl: rip.lvl,
      },
    });
    var id = "RIP-" + ripCount;
    var nick;
    if ((nick = this.checkHerosRip(rip.desc1))) {
      qTrack.add({
        type: "COORDS",
        name:
          "Grób gracza zabitego przez herosa " +
          nick +
          "<br>Możliwe, że heros tam stoi!",
        coords: [rip.x, rip.y],
      });
      isHerosRip = true;
      message(
        "Na mapie znajduje się grób gracza zabitego przez herosa " + nick
      );
    }
    setTimeout(() => {
      self.objectMgr.updateObject({
        id: id,
        del: 1,
      });
      if (isHerosRip)
        qTrack.remove({
          type: "COORDS",
          name:
            "Grób gracza zabitego przez herosa " +
            nick +
            "<br>Możliwe, że heros tam stoi!",
        });
    }, timeToDisappear * 1000);
  };
  this.checkHerosRip = function (desc) {
    for (var nick in herosDB) {
      var needle = nick + "(" + herosDB[nick].lvl + herosDB[nick].prof + ")";
      if (desc.indexOf(needle) > -1) {
        return nick;
      }
    }
    return false;
  };

  this.objectMgr = new (function () {
    var self = this;
    var mgr = this;
    var objs = {};
    var flashables = [];
    class MapObject {
      constructor(data) {
        this.d = data;
        this.currentColor = settings.get("/colors")[this.d.type];

        if (data.flash) flashables.push(this);

        this.initHTML();
        this.initEventListener();
        this.manageDisplay();
      }

      initHTML() {
        const data = this.d;
        this.$ = document.createElement("div");
        this.$.classList.add("mmpMapObject", "mmp-" + data.type);
        if (innerDotKeys.indexOf(data.type2) != -1) {
          var $dot = document.createElement("div");
          $dot.classList.add("innerDot", "mmp-" + data.type2);
          Object.assign($dot.style, {
            left: objSize / 4 + "px",
            top: objSize / 4 + "px",
            width: objSize / 2 + "px",
            height: objSize / 2 + "px",
          });
          this.$.appendChild($dot);
        } else if (data.type2 == "evoNetwork") {
          this.$.classList.add("evoNetwork");
        }
        if (data.children) {
          // append extra children to the object
          for (let i = 0; i < data.children.length; i++) {
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
          opacity: "0",
        });
        setTimeout(() => (this.$.style.opacity = "1.0"), 1);

        if (typeof data.tip != "undefined")
          setTip(this.$, data.tip, data.ctip ? data.ctip : "");

        if (data.circle) {
          this.$.style["border-radius"] = objScale * 18 + "px";
        }
        if (data.border) {
          this.$.style["border"] =
            typeof data.border == "boolean" ? "1px solid black" : data.border;
        }
        if (data.qm) {
          this.$.innerHTML =
            "<img class='mmpQM' width='" +
            objSize +
            "' height='" +
            objSize * 2 +
            "' src='https://jaruna.margonem.pl/img/quest-mark.gif'>";
        }
        $map.appendChild(this.$);
      }

      initEventListener() {
        if (this.d.click) {
          var type = mobileDevice ? "touchstart" : "click";
          this.$.addEventListener(type, (e) => {
            this.d.click(e);
            e.stopPropagation();
          });
        } // else {
        //this.$.addEventListener("click", this.goTo);
        //}
      }

      invertColor() {
        var c = this.currentColor;
        var c1 = (255 - parseInt("0x" + c.substring(1, 3))).toString(16);
        var c2 = (255 - parseInt("0x" + c.substring(3, 5))).toString(16);
        var c3 = (255 - parseInt("0x" + c.substring(5, 7))).toString(16);
        if (c1.length < 2) c1 = "0" + c1;
        if (c2.length < 2) c2 = "0" + c2;
        if (c3.length < 2) c3 = "0" + c3;
        this.currentColor = "#" + c1 + c2 + c3;
        this.$.style.background = this.currentColor;
      }

      remove() {
        if (this.d.flash) flashables.splice(flashables.indexOf(this), 1);

        this.$.style["opacity"] = "0";

        if (settings.get("/interpolerate"))
          setTimeout(() => this.$.remove(), 500);
        else this.$.remove();
      }

      update(data) {
        Object.assign(this.d, data);
        if (typeof data.x != "undefined") {
          this.$.style["left"] = data.x * objScale * 32 + "px";
        }
        if (typeof data.y != "undefined") {
          this.$.style["top"] = data.y * objScale * 32 + "px";
        }
        if (data.tip) {
          setTip(this.$, data.tip);
        }
        if (data.invertColor) {
          this.invertColor();
        }
        if (typeof data.border != "undefined") {
          if (typeof data.border == "boolean") {
            this.$.style.border = data.border ? "1px solid black" : "";
          } else {
            this.$.style.border = data.border;
          }
        }
      }

      manageDisplay() {
        if (
          !this.d.flash &&
          isset(this.d.lvl) &&
          this.d.lvl < settings.get("/minlvl")
        ) {
          this.$.classList.add("hidden");
        } else {
          this.$.classList.remove("hidden");
        }
      }

      filter(filters) {
        this.$.classList.remove("hiddenBySearch");
        if (!this.d.filterData || this.d.filterData._alwaysShow) return;

        let show = true;
        for (let i = 0; i < filters.length; ++i) {
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

    this.objectExists = function (id) {
      return typeof objs[id] != "undefined";
    };

    this.getByElem = function ($el) {
      for (var i in objs) {
        // parentElement check is for innerDot specifically
        if (objs[i].$ == $el || objs[i].$ == $el.parentElement) return objs[i];
      }
    };
    this.deleteAll = function () {
      for (var i in objs) {
        objs[i].remove();
        delete objs[i];
      }
    };
    this.updateObject = function (data) {
      if (!objs[data.id] && !data.del) {
        if (!data.dontCreate) objs[data.id] = new MapObject(data);
      } else if (data.del) {
        if (objs[data.id]) {
          objs[data.id].remove();
          delete objs[data.id];
          return null;
        }
      } else {
        objs[data.id].update(data);
      }

      if (objs[data.id]) {
        objs[data.id].filter(this.currentFilters);
      }

      return objs[data.id];
    };
    this.currentFilters = [];
    this.performSearch = function (actions) {
      this.removeCoordMarkers();
      this.currentFilters.splice(0, this.currentFilters.length);
      for (let i = 0; i < actions.length; ++i) {
        const action = actions[i];
        if (action.action == "highlight") {
          this.createCoordMarker(action.coords[0], action.coords[1]);
        } else if (action.action == "filter") {
          this.currentFilters.push(action);
        }
      }
      this.runFiltersForAllObjects();
    };
    this.runFiltersForAllObjects = function () {
      for (const id in objs) {
        objs[id].filter(this.currentFilters);
      }
    };
    this.removeCoordMarkers = function () {
      const toDelete = [];
      for (const id in objs) {
        if (id.substring(0, 6) == "COORDS") {
          toDelete.push(id);
        }
      }
      for (let i = 0; i < toDelete.length; ++i) {
        this.updateObject({
          id: toDelete[i],
          del: 1,
        });
      }
    };
    this.createCoordMarker = function (x, y) {
      this.updateObject({
        id: `COORDS-${x}-${y}`,
        x: x,
        y: y,
        tip: "koordy " + x + "," + y,
        circle: true,
        type: "hero",
        flash: true,
        filterData: {
          _alwaysShow: true,
        },
      });
    };
    this.manageDisplay = function () {
      for (var id in objs) {
        objs[id].manageDisplay();
      }
    };
    this.invertFlashables = function () {
      for (var i = 0; i < flashables.length; i++) {
        flashables[i].update({
          invertColor: true,
        });
      }
    };
    setInterval(this.invertFlashables, 500);
  })();

  this.herosCheckedRespManager = new (function () {
    const currentResps = [];
    this.reset = function () {
      currentResps.splice(0, currentResps.length);
    };
    this.addResp = function (obj) {
      currentResps.push(obj);
    };
    this.update = function (coords) {
      // My research shows that the distance from player must be <12 for a heros to show up
      let dist = 12 * 12;
      for (let i = 0; i < currentResps.length; ++i) {
        const resp = currentResps[i];
        if (resp.d.id.indexOf("(") > -1) {
          // Temporary hack
          currentResps.splice(i, 1);
          --i;
          continue;
        }
        const dx = resp.d.x - coords.x;
        const dy = resp.d.y - coords.y;
        let currDist = dx * dx + dy * dy;
        if (currDist < dist) {
          dist = currDist;
          closest = resp;

          resp.update({
            border: `${Math.ceil(objScale * 4)}px solid ${settings.get(
              "/colors/heros-mark"
            )}`,
          });
          currentResps.splice(i, 1);
          --i;
        }
      }
    };
  })();

  this.addSpawnsToMap = function (db, heros, map, mapId) {
    map = map.toLowerCase();
    var maxlvl = settings.get("/maxlvl");
    var hero = interface == "new" ? Engine.hero.d : window.hero;
    for (var i in db) {
      var mob = db[i];
      if (mob.ver && mob.ver != _l()) continue;
      var minlvl = Math.max(mob.lvl / 2, mob.lvl - 50);
      if (
        (maxlvl + mob.lvl >= hero.lvl && minlvl <= hero.lvl) ||
        mob.lvl >= 242 ||
        mob.lvl == -1
      ) {
        for (var loc in mob.spawns) {
          if (loc.toLowerCase() == map || loc == mapId) {
            var spawns = mob.spawns[loc];
            for (var j = 0; j < spawns.length; j++) {
              var x = spawns[j][0];
              var y = spawns[j][1];
              const respObj = this.objectMgr.updateObject({
                id: "SPAWN-" + i + "-" + j,
                tip: this.makeTip({
                  txt: "Resp " + (heros ? "herosa " : "elity ") + i,
                  x: x,
                  y: y,
                }),
                x: x,
                y: y,
                type: "heros-resp",
                circle: true,
                filterData: {
                  name: "Resp " + (heros ? "herosa " : "elity ") + i,
                  typ: "resp",
                  lvl: mob.lvl,
                },
              });
              this.herosCheckedRespManager.addResp(respObj);
            }
          }
        }
      }
    }
  };

  this.showNewVersionMsg = function () {
    window.mAlert(this.updateString, null);
  };

  this.checkNewVersionMsg = function () {
    if (settings.get("/prevver") != null) {
      const prevver = settings.get("/prevver");
      if (prevver < this.version) this.showNewVersionMsg();
    }
    settings.set("/prevver", this.version);
  };

  this.init = function () {
    this.initSettings();
    this.initHTML();
    this.appendUserStyles();
    this.initResponseParser();
    this.initHeroUpdating();
    this.appendMobileButton();
    this.installationCounter.count();
    this.checkNewVersionMsg();


    

    if (interface == "old") {
      /* Mam pytanie: dlaczego cały czas jest to badziewie co zmienia nazwę funkcji hero.searchPath na losową? xD
       * Chodzi mi oczywiście o to: https://cdn.discordapp.com/attachments/522835675201142784/742399669774188615/unknown.png
       * Raczej mało to daje biorąc pod uwagę, że można zrobić... Dokładnie to co ja robię tutaj, czyli po prostu skopiowanie funkcji z player.js */
      this.searchPath = function (dx, dy) {
        if (this.isBlockedSearchPath()) return this.blockedInfoSearchPath();
        var startPoint = map.nodes.getNode(hero.x, hero.y);
        var endPoint = map.nodes.getNode(dx, dy);
        if (!startPoint.hasSameGroup(endPoint)) {
          map.nodes.clearAllNodes();
          startPoint.setScore(0, map.hce8(endPoint, startPoint));
          endPoint = map.nodeSetLoop(endPoint, startPoint, map.findStep);
        }
        map.nodes.clearAllNodes();
        startPoint.setScore(0, map.hce(startPoint, endPoint));
        map.nodeSetLoop(startPoint, endPoint, map.mapStep);
        var checkPoint = endPoint;
        road = [];
        while (checkPoint !== null && checkPoint.id != startPoint.id) {
          road.push({
            x: checkPoint.x,
            y: checkPoint.y,
          });
          checkPoint = checkPoint.from;
        }
        if (checkPoint !== null) {
          road.push({ x: checkPoint.x, y: checkPoint.y });
        }
        if (road.length > 1 && g.playerCatcher.follow == null)
          $("#target")
            .stop()
            .css({
              left: road[0].x * 32,
              top: road[0].y * 32,
              display: "block",
              opacity: 1,
              "z-index": 1,
            })
            .fadeOut(1000);
      };
    }
    $chatInput =
      interface == "new"
        ? document.querySelector("[data-section='chat'] .input-wrapper input")
        : interface == "superold"
        ? document.querySelector("#chatIn")
        : null;
  };

  //questtrack (fuzja kodu z wersji minimapy na SI i NI więc wygląda jak wygląda)
  var qTrack = new (function () {
    var self = this;
    var hero = interface == "new" ? Engine.hero : window.hero;
    var $hero =
      interface == "old"
        ? $("#hero")
        : interface == "superold"
        ? document.querySelector("#oHero")
        : null;
    var $canvas = interface == "new" ? $("#GAME_CANVAS") : null;
    if (interface == "new") {
      this.npcs = {};
      API.addCallbackToEvent("newNpc", function (npc) {
        if (npc) self.npcs[npc.d.id] = npc.d;
      });
      API.addCallbackToEvent("removeNpc", function (npc) {
        if (npc) delete self.npcs[npc.d.id];
      });
    }
    this.getOldMargoHeroPos = function () {
      return {
        left: $hero.offsetLeft,
        top: $hero.offsetTop,
      };
    };
    this.getHeroPos = function () {
      if (interface == "old") return $hero.position();
      if (interface == "superold") return this.getOldMargoHeroPos();
      if (!Engine.map.size) return { x: 0, y: 0 };
      var tilesX = $canvas.width() / 32;
      var tilesY = $canvas.height() / 32;
      var pos = {
        x: Engine.hero.rx,
        y: Engine.hero.ry,
      };
      var actualPos = {};
      if (pos.x < tilesX / 2) {
        actualPos.x = pos.x * 32;
      } else if (Engine.map.size.x - pos.x < tilesX / 2) {
        actualPos.x =
          (pos.x - (Engine.map.size.x - tilesX / 2) + tilesX / 2) * 32;
      } else {
        actualPos.x = (tilesX / 2) * 32;
      }
      if (pos.y < tilesY / 2) {
        actualPos.y = pos.y * 32;
      } else if (Engine.map.size.y - pos.y < tilesY / 2) {
        actualPos.y =
          (pos.y - (Engine.map.size.y - tilesY / 2) + tilesY / 2) * 32;
      } else {
        actualPos.y = (tilesY / 2) * 32;
      }
      var canvasOffset = $canvas.offset();
      return {
        left: actualPos.x + canvasOffset.left,
        top: actualPos.y + canvasOffset.top,
      };
    };
    this.update = function () {
      for (var i = 0; i < this.arrows.length; i++) {
        this.drawArrow(this.arrows[i]);
      }
    };
    this.drawArrow = function (objective) {
      if (objective.type == "NPC") {
        var nameKey = "nick";
        var obj = interface == "new" ? this.npcs : g.npc;
        var item = false;
      } else if (objective.type == "ITEM") {
        //item
        var nameKey = "name";
        if (interface == "new") {
          var itemArr = Engine.items.fetchLocationItems("m");
          var obj = {};
          for (var i in itemArr) {
            var it = itemArr[i];
            if (it.id) obj[it.id] = it;
            else obj[it.hid] = it;
          }
        } else {
          var obj = g.item;
        }
        var item = true;
      } else if (objective.type == "COORDS") {
        //coords
        var coords = objective.coords;
        var size = [32, 32];
        var x = Math.abs(hero.rx - coords[0]);
        var y = Math.abs(hero.ry - coords[1]);
        var closest = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      }
      let closestName = objective.name;
      if (objective.type != "COORDS") {
        var closest = Infinity;
        var coords = false;
        var size = false;
        const objectiveNameLower = objective.name.toLowerCase();
        for (var i in obj) {
          var entity = obj[i];
          let entityName = entity[nameKey] ? entity[nameKey].toLowerCase() : "";
          if (
            entityName == objectiveNameLower &&
            (!item || entity.loc == "m")
          ) {
            var x = Math.abs(hero.rx - entity.x);
            var y = Math.abs(hero.ry - entity.y);
            var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (dist < closest) {
              closest = dist;
              coords = [entity.x, entity.y];
              closestName = entity[nameKey];
              size = item ? [32, 32] : [entity.fw, entity.fh];
            }
          }
        }
      }
      if (coords) {
        var cos = (coords[0] - hero.rx) / closest;
        var sin = (coords[1] - hero.ry) / closest;
        var heropos = this.getHeroPos();
        var top = 150 * sin;
        var left = 150 * cos;
        var opacity = 1;
        if (closest < 9) {
          top = top * Math.pow(closest / 9, 1.8);
          left = left * Math.pow(closest / 9, 1.8);
          opacity = Math.pow(closest / 9, 2.1);
        }
        if (interface != "new") top += 20;
        left += interface == "new" ? -12 : 4;
        if ((cos >= 0 && sin >= 0) || (cos >= 0 && sin <= 0)) {
          var angle = (Math.asin(sin) * 180) / Math.PI;
        } else {
          var angle = 180 + (Math.asin(0 - sin) * 180) / Math.PI;
        }
        objective.$.css({
          top: top + heropos.top,
          left: left + heropos.left,
          display: opacity > 0.09 ? "block" : "none",
          "-ms-transform": "rotate(" + angle + "deg)",
          "-webkit-transform": "rotate(" + angle + "deg)",
          transform: "rotate(" + angle + "deg)",
          opacity: opacity,
        });
        if (interface == "old") {
          objective.$highlight.css({
            left: coords[0] * 32 - 11,
            top: coords[1] * 32 + 14,
            display: "block",
            opacity: 1 - opacity,
          });
        }
        objective.$[0].dataset.x = coords[0];
        objective.$[0].dataset.y = coords[1];
        setTip(
          objective.$[0],
          `<center>${closestName}</center>` +
            `${Math.round(closest)} kratek (${coords[0]},${coords[1]})`
        );
      } else {
        objective.$.hide();
        if (interface == "old") objective.$highlight.hide();
      }
    };
    this.arrows = [];
    this.add = function (objective) {
      for (var i in this.arrows) {
        if (
          objective.type == this.arrows[i].type &&
          objective.name == this.arrows[i].name
        )
          return;
      }

      objective.$ = this.arrowTemplate
        .clone()
        .appendTo(
          interface == "old"
            ? "#base"
            : interface == "new"
            ? ".game-window-positioner"
            : "#oMap"
        )
        .click(() =>
          mmp.heroGoTo(
            parseInt(objective.$[0].dataset.x),
            parseInt(objective.$[0].dataset.y)
          )
        );

      if (interface == "old")
        objective.$highlight = this.highlightTemplate
          .clone()
          .appendTo(interface == "old" ? "#ground" : "#oMap");

      objective.index = this.arrows.push(objective) - 1;
      objective.remove = function () {
        self.arrows.splice(this.index, 1);
        for (var i = this.index; i < self.arrows.length; i++) {
          self.arrows[i].index--;
        }
        this.$.remove();
        if (interface == "old") this.$highlight.remove();
      };
      this.update();
    };
    this.remove = function (objective) {
      for (var i = 0; i < this.arrows.length; i++) {
        if (
          this.arrows[i].name == objective.name &&
          this.arrows[i].type == objective.type
        )
          this.arrows[i].remove();
      }
    };
    this.reset = function () {
      while (this.arrows.length) {
        this.arrows[0].remove();
      }
    };
    this.arrowTemplate = $("<div>").css({
      background:
        "url(https://priw8.com/margo/SI-addon/mmp/img/qt-arrow.png)",
      //background: "url(https://127.0.0.1:8080/SI-addon/mmp/img/qt-arrow.png)",
      width: 24,
      height: 24,
      zIndex: 250,
      position: "absolute",
      cursor: "pointer",
    });
    this.highlightTemplate = $("<div>").css({
      background: "url(/img/glow-52.png)", // Dlaczego glow-52?
      position: "absolute",
      width: 52,
      height: 24,
      zIndex: 1,
    });
  })();

  this.installationCounter = new (function () {
    var self = this;
    var id = 87771;

    this.count = function () {
      if (interface == "superold") return;
      if (!settings.get("/counted")) {
        //extManager.toggleLike(id, 'unlike')
        $.ajax({
          url: "/tools/addons.php?task=details&id=" + id,
          type: "POST",
          data: { like: "unlike" },
        });
        settings.set("/counted", true);
      }
    };
    this.get = function (clb) {
      if (interface == "superold")
        return clb("<span tip='Niedostępne dla oldmargonem'>-</span>");
      $.ajax({
        url: "/tools/addons.php?task=details&id=" + id,
        datatype: "json",
        success: function (r) {
          clb(-r.addon.points);
        },
      });
    };
  })();

  //databases
    var herosDB = {
        "Domina Ecclesiae":{
            "lvl":21,
            "ver": "pl",
            "prof":"b",
            "spawns": {"3":[[44,9],[46,24],[52,10],[54,12],[56,22]],"12":[[56,53],[57,48],[58,25],[66,22],[72,17]],"167":[[9,8],[16,7]],"168":[[6,9],[18,7]],"169":[[8,8],[12,7]],"171":[[8,27],[11,8],[19,27],[21,8]],"173":[[8,8],[20,28]],"174":[[4,8],[10,10],[30,9],[42,29]],"175":[[8,13],[13,4]],"3741":[[2,11],[21,6]],"5733":[[4,10],[6,13],[8,9],[13,12],[17,8]],"5734":[[3,10],[4,17],[5,8],[12,8],[15,16],[17,14]],"5735":[[5,14],[8,4],[9,14],[13,12],[15,6]],"5736":[[5,36],[7,35],[9,9],[15,27],[22,33],[24,6],[26,34],[27,20],[30,8],[31,21],[31,35]],"5737":[[5,9],[5,35],[12,17],[17,4],[17,34],[21,22],[22,4],[27,24]],"5739":[[2,5],[7,11],[8,5],[12,6],[12,18]]},
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
            "spawns": {"8":[[6,46]],"38":[[13,26],[22,53],[80,33],[90,9],[92,50]],"814":[[13,16]],"815":[[25,20],[35,9],[55,17]],"816":[[9,18]],"3869":[[10,16],[22,41],[34,16]],"150":[[6,34],[17,15],[25,24],[26,49],[38,34],[41,5],[47,13],[48,60],[55,50],[58,41],[64,34],[66,48],[79,22],[86,36],[89,51]],"176":[[20,52],[37,41],[58,13]],"4550":[[17,40],[25,35],[44,56]],"4262":[[13,44],[23,18],[36,33]],"6473":[[18,12],[19,16]],"6474":[[12,19],[33,10],[51,17],[52,43]],"6475":[[5,15],[28,42],[34,13],[34,29],[45,49]],"140":[[15,51],[18,7],[30,24],[30,59],[2,2],[42,16],[42,34],[49,50],[56,24],[59,54]]}
        },
        "Piekielny kościej":{
            "lvl":74,
            "ver": "pl",
            "prof":"w",
            "spawns": {"262":[[67,38],[22,56],[21,6]],"263":[[49,24],[35,18],[15,38],[34,46],[57,55]],"264":[[30,22],[50,12],[27,38],[11,39],[52,40],[53,62],[7,49]],"265":[[24,60],[38,82],[10,77],[51,24],[22,30]]}
        },
        "Opętany paladyn":{
            "lvl":85,
            "ver": "pl",
            "prof":"w",
            "spawns": {"180":[[18,22],[48,20]],"184":[[28,5],[54,32]],"203":[[15,28],[31,9]],"204":[[19,27]],"205":[[18,27]],"210":[[54,11],[78,25],[76,61],[15,26],[33,45]],"211":[[45,57],[19,11],[18,34]],"601":[[25,55],[22,21],[59,35],[87,5],[17,41],[92,54]],"602":[[6,58],[40,31],[4,16]],"603":[[7,35],[7,20],[26,57]]}
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
          "spawns": {"3315":[[26,8],[4,19],[52,38],[30,90],[55,6]],"3338":[[4,21]],"3336":[[27,11]],"3339":[[26,12]],"3322":[[4,7]],"3325":[[5,2],[55,62],[47,24],[21,76],[24,61]],"3320":[[7,5]],"3333":[[23,5]],"3331":[[16,8]],"3332":[[5,20]],"3326":[[52,50],[67,23]],"3327":[[64,37],[20,58],[29,46]],"3328":[[60,30],[30,31],[31,87],[54,70]],"3329":[[14,19]],"3330":[[29,11],[29,41]]}
      },
      "Młody smok (parter)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3315": [[33,47],[31,22]],
              "3325": [[47,70],[33,56],[11,81]]
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
      spawns: {},
    },
    "Mola Nito": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    "Toto Acirfa": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    "Masked Roman": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    "Possessed Fissit": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    Soda: {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    "Molybdenum Matityahu": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    Hummopapa: {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    Shponder: {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
    "Mobile Jeecus": {
      lvl: -1,
      ver: "en",
      spawns: {},
    },
  };

  this.getHerosDB = function () {
    return herosDB;
  };

  this.fireEvent = function () {
    const ev = new CustomEvent("miniMapPlusLoad", { detail: this });
    document.dispatchEvent(ev);
  };

  this.extendHerosDB = function (data) {
    for (const herosName in data) {
      const newData = data[herosName];
      if (newData === null || newData === false) {
        delete herosDB[herosName];
      } else if (!herosDB[herosName]) {
        if (typeof newData.lvl == "undefined") newData.lvl = -1;

        herosDB[herosName] = newData;
      } else {
        const existingData = herosDB[herosName];
        if (typeof newData.lvl != "undefined") existingData.lvl = newData.lvl;

        if (typeof newData.ver != "undefined") existingData.ver = newData.ver;

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
  };

  var niceSettings = new (function (options) {
    var self = this;
    var { get, set, data, header, onSave } = options;
    var panels = {};
    var $currentPanel = false;
    var $activeLPanelEntry;
    var $rpanel;
    var $wrapper;
    var currentPanel = "";
    var shown = false;
    this.toggle = function () {
      var lock =
        interface == "new" ? Engine.lock : interface == "old" ? g.lock : null;
      if (shown) {
        if (lock) lock.remove("ns-" + header);
        else global.dontmove = false;
        $wrapper.style["display"] = "none";
      } else {
        if (lock) lock.add("ns-" + header);
        else global.dontmove = true;
        $wrapper.style["display"] = "block";
      }
      shown = !shown;
    };
    this.initHTML = function () {
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
    this.lPanelClick = function (e) {
      if (e.target.dataset["name"]) {
        self.togglePanel(e.target.dataset["name"]);
        if ($activeLPanelEntry) $activeLPanelEntry.classList.remove("active");
        $activeLPanelEntry = e.target;
        $activeLPanelEntry.classList.add("active");
      }
    };
    this.globalRpanelHandler = function (e) {
      var tar = e.target;
      if (tar.dataset["listbtt"]) {
        var key = tar.dataset["listbtt"];
        var $content = document.querySelector(
          ".ns-list-content[data-list='" + key + "']"
        );
        var $input = document.querySelector("input[data-list='" + key + "']");
        self.addContentToList($content, $input);
        self.savePanel(currentPanel);
      } else if (tar.dataset["listitem"]) {
        tar.remove();
        self.savePanel(currentPanel);
      }
    };
    this.addContentToList = function ($content, $input) {
      var val = $input.value;
      if (val == "") return;
      $input.value = "";
      var items = this.getContentItems($content);
      if (items.indexOf(val) > -1) return;
      var $div = document.createElement("div");
      $div.classList.add("ns-list-item");
      $div.dataset["listitem"] = "1";
      $div.innerText = val;
      $content.appendChild($div);
    };
    this.getContentItems = function ($content) {
      var items = [];
      for (var i = 0; i < $content.children.length; i++) {
        items.push($content.children[i].innerHTML);
      }
      return items;
    };
    this.togglePanel = function (name) {
      if ($currentPanel) $currentPanel.remove();
      $currentPanel = panels[name];
      currentPanel = name;
      $rpanel.appendChild($currentPanel);
      this.setAsyncPanelContent(name);
    };
    this.setAsyncPanelContent = function (name) {
      var entries = options.data[name];
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.asyncid) {
          entry.fun((val) => {
            var el = document.getElementById(entry.asyncid);
            if (el) el.innerHTML = val;
          });
        }
      }
    };
    this.genereteRpanels = function () {
      for (var name in data) {
        this.generateRpanel(name, data[name]);
      }
    };
    this.generateRpanel = function (name, content) {
      var $panel = document.createElement("div");
      $panel.classList.add("ns-rpanel-list");
      panels[name] = $panel;
      var html = "";
      for (var i = 0; i < content.length; i++) {
        html += this.generateRpanelEntryHtml(content[i]);
      }
      $panel.innerHTML = html;
      var $btt = document.createElement("div");
      $btt.innerHTML = "Zapisz";
      $btt.classList.add("ns-save-button");
      $btt.addEventListener("click", () => this.savePanel(name));
      $panel.appendChild($btt);
    };
    this.generateRpanelEntryHtml = function (entry) {
      var { type, special } = this.getEntryType(entry.type);
      if (!special) {
        var input =
          "<input data-key='" +
          entry.key +
          "' type='" +
          type +
          "' value='" +
          get(entry.key) +
          "'></input>";
        return this.getRpanelEntry(entry.name, input, entry);
      } else {
        if (type == "range") {
          var input =
            "<input data-key='" +
            entry.key +
            "' type='" +
            type +
            "' value='" +
            get(entry.key) * 100 +
            "' min='" +
            entry.data[0] * 100 +
            "' max='" +
            entry.data[1] * 100 +
            "'></input>";
          return this.getRpanelEntry(entry.name, input, entry);
        } else if (type == "checkbox") {
          var input =
            "<input data-key='" +
            entry.key +
            "' type='" +
            type +
            "' " +
            (get(entry.key) ? "checked" : "") +
            "></input>";
          return this.getRpanelEntry(entry.name, input, entry);
        } else if (special == "char") {
          var input =
            "<input data-key='" +
            entry.key +
            "' type='" +
            type +
            "' value='" +
            String.fromCharCode(get(entry.key)) +
            "' maxlength='1' style='width: 10px; text-align: center'></input>";
          return this.getRpanelEntry(entry.name, input, entry);
        } else if (special == "noinput") {
          if (type != "async") {
            return this.getRpanelEntry(entry.t1, entry.t2, entry);
          } else {
            var id = "NS-async-" + Math.random() * 10;
            entry.asyncid = id;
            return this.getRpanelEntry(
              entry.t1,
              "<div id='" + id + "'>" + entry.placeholder + "</div>",
              entry
            );
          }
        } else if (type == "list") {
          return this.generateListInput(entry);
        }
      }
    };
    this.generateListInput = function (entry) {
      var list = get(entry.key);
      var html;
      html = "<div class='ns-list-wrapper'>";
      html += "<div class='ns-list-header'>" + entry.name + "</div>";
      html += "<div class='ns-list-content' data-list='" + entry.key + "'>";
      for (var i = 0; i < list.length; i++) {
        html +=
          "<div class='ns-list-item' data-listitem='1'>" + list[i] + "</div>";
      }
      html += "</div>";
      html += "<div class='ns-list-bottombar'>";
      html +=
        "<div class='ns-list-input'><input data-list='" +
        entry.key +
        "' type='text'></div>";
      html +=
        "<div class='ns-list-addbtt' data-listbtt='" + entry.key + "'>+</div>";
      html += "</div>";
      html += "</div>";
      return html;
    };
    this.getRpanelEntry = function (txt, input, entry) {
      let tip = entry.tip;
      let alert = entry.alert;
      if (interface == "old")
        return (
          "<div " +
          (alert ? "onclick='mAlert(`" + alert + "`, null)'" : "") +
          " " +
          (tip ? "tip='" + tip + "'" : "") +
          " class='" +
          (alert ? "ns-clickable " : "") +
          "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>" +
          txt +
          "</div><div class='ns-rpanel-entry-right'>" +
          input +
          "</div></div>"
        );
      else
        return (
          "<div " +
          (alert ? "onclick='mAlert(`" + alert + "`, null)'" : "") +
          " " +
          (tip ? "tip-id='" + getTipIdForTxt(tip) + "'" : "") +
          " class='" +
          (alert ? "ns-clickable " : "") +
          "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>" +
          txt +
          "</div><div class='ns-rpanel-entry-right'>" +
          input +
          "</div></div>"
        );
    };
    this.getEntryType = function (entrytype) {
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
      }
      return {
        type: type,
        special: special,
      };
    };
    this.generateLpanelHtml = function () {
      var html = "";
      for (var name in data) {
        html +=
          "<div class='ns-lpanel-entry' data-name='" +
          name +
          "'>" +
          name +
          "</div>";
      }
      return html;
    };
    this.savePanel = function (name) {
      var panel = data[name];
      for (var i = 0; i < panel.length; i++) {
        this.savePanelEntry(panel[i]);
      }
      onSave();
    };
    this.savePanelEntry = function (entry) {
      var { type, special } = this.getEntryType(entry.type);
      if (!special) {
        var val = this.getEntryValue(entry.key);
        if (type == "number") {
          val = parseInt(val);
          if (isNaN(val)) return;
        }
        set(entry.key, val);
      } else {
        if (type == "range") {
          set(entry.key, this.getEntryValue(entry.key) / 100);
        } else if (type == "checkbox") {
          set(entry.key, this.getCheckboxState(entry.key));
        } else if (special == "char") {
          var val = this.getEntryValue(entry.key).toUpperCase().charCodeAt(0);
          if (isNaN(val)) return;
          set(entry.key, val);
        } else if (type == "list") {
          var $content = document.querySelector(
            ".ns-list-content[data-list='" + entry.key + "']"
          );
          var items = this.getContentItems($content);
          set(entry.key, items);
        }
      }
    };
    this.getEntryValue = function (key) {
      return document.querySelector("input[data-key='" + key + "']").value;
    };
    this.getCheckboxState = function (key) {
      return document.querySelector("input[data-key='" + key + "']").checked;
    };
    this.initCss = function () {
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
    this.init = function () {
      this.initHTML();
      this.initCss();
    };
  })({
    get: settings.get,
    set: settings.set,
    onSave: this.onSettingsUpdate,
    header: "miniMapPlus",
    data: {
      Kolory: [
        {
          key: "/colors/hero",
          name: "Twoja postać",
          type: "color",
        },
        {
          key: "/colors/other",
          name: "Inni gracze",
          type: "color",
        },
        {
          key: "/colors/friend",
          name: "Znajomi",
          type: "color",
        },
        {
          key: "/colors/enemy",
          name: "Wrogowie",
          type: "color",
        },
        {
          key: "/colors/clan",
          name: "Klanowicze",
          type: "color",
        },
        {
          key: "/colors/ally",
          name: "Sojusznicy",
          type: "color",
        },
        {
          key: "/colors/npc",
          name: "Zwykły NPC",
          type: "color",
        },
        {
          key: "/colors/mob",
          name: "Zwykły mob",
          type: "color",
        },
        {
          key: "/colors/elite",
          name: "Elita",
          type: "color",
        },
        {
          key: "/colors/elite2",
          name: "Elita II/eventowa",
          type: "color",
        },
        {
          key: "/colors/elite3",
          name: "Elita III",
          type: "color",
        },
        {
          key: "/colors/heros",
          name: "Heros",
          type: "color",
        },
        {
          key: "/colors/heros-resp",
          name: "Miejsce respu herosa",
          type: "color",
        },
        {
          key: "/colors/heros-mark",
          name: "Oznaczenie sprawdzonego respu herosa",
          type: "color",
          tip: "Po podejściu na tyle blisko do respu żeby heros został wykryty, resp na mapie zostanie oznaczony tym kolorem.",
        },
        {
          key: "/colors/titan",
          name: "Tytan",
          type: "color",
        },
        {
          key: "/colors/item",
          name: "Przedmiot",
          type: "color",
        },
        {
          key: "/colors/gw",
          name: "Przejście",
          type: "color",
        },
        {
          key: "/colors/rip",
          name: "Groby",
          type: "color",
        },
        {
          key: "/colors/col",
          name: "Kolizja",
          type: "color",
          tip: 'Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka "inne").',
        },
      ],
      Warstwy: [
        {
          type: "info",
          t1: "Warstwy obiektów na mapie",
          t2: "(?)",
          tip:
            "Obiekty na minimapie będą sortowane według wartości wpisanych niżej. Przykładowo, obiekty z wartością 100 zawsze będą pokazywane nad tymi z 90." +
            "<br>" +
            "W przypadku gry 2 obiekty mają tą samą wartość, kolejność jest niezdefiniowana i będzie zależeć od kolejności ładowania." +
            "<br>" +
            "Starałem się dobrać domyślne wartości w miarę sensownie, ale jak komuś się nie podoba, to można zmienić :)",
        },
        {
          key: "/layers/hero",
          name: "Twoja postać",
          type: "numstring",
        },
        {
          key: "/layers/other",
          name: "Inni gracze",
          type: "numstring",
        },
        {
          key: "/layers/npc",
          name: "Zwykły NPC",
          type: "numstring",
        },
        {
          key: "/layers/mob",
          name: "Zwykły mob",
          type: "numstring",
        },
        {
          key: "/layers/elite",
          name: "Elita",
          type: "numstring",
        },
        {
          key: "/layers/elite2",
          name: "Elita II/eventowa",
          type: "numstring",
        },
        {
          key: "/layers/elite3",
          name: "Elita III",
          type: "numstring",
        },
        {
          key: "/layers/heros",
          name: "Heros",
          type: "numstring",
        },
        {
          key: "/layers/heros-resp",
          name: "Miejsce respu herosa",
          type: "numstring",
        },
        {
          key: "/layers/titan",
          name: "Tytan",
          type: "numstring",
        },
        {
          key: "/layers/item",
          name: "Przedmiot",
          type: "numstring",
        },
        {
          key: "/layers/gw",
          name: "Przejście",
          type: "numstring",
        },
        {
          key: "/layers/rip",
          name: "Groby",
          type: "numstring",
        },
        {
          key: "/layers/col",
          name: "Kolizja",
          type: "numstring",
          tip: 'Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka "inne").',
        },
      ],
      "Wygląd mapy": [
        {
          key: "/mapsize",
          name: "Rozmiar mapy",
          type: "range",
          tip: "Zmiany widoczne po odświeżeniu gry",
          data: [0.6, 1.4],
        },
        {
          key: "/opacity",
          name: "Widoczność mapy",
          type: "range",
          data: [0.5, 1],
        },
        {
          key: "/darkmode",
          name: "Motyw ciemny",
          type: "check",
        },
        {
          key: "/manualDownscale",
          name: "Ręczne skalowanie obrazka mapy",
          type: "check",
          tip: "Domyślnie włączone dla przeglądarek opartych o Chromium - skalowanie background-image wygląda na nich brzydko, ta opcja pozwala na włączenie ręcznego skalowania przez rysowanie obrazka mapy na elemencie canvas.",
        },
      ],
      Tracking: [
        {
          type: "info",
          t1: "Co to jest?",
          t2: "",
          tip: "Tracking (tropienie) to alternatywna opcja wyszukiwania NPC/itemów na mapie. Polega na tym, że gdy na mapie pojawi się coś z poniższej listy, w oknie gry ukaże się strzałka, która będzie wzkazywała drogę do tej rzeczy.<br>Dodatkowo gdy na mapie pojawia się heros, automatycznie uruchamia się tracking na niego, co jest przydatne np. w podchodzeniu do herosów eventowych.<br>Wielkość liter w nazwie NPC/przedmiotu nie ma znaczenia.",
        },
        {
          key: "/trackedNpcs",
          name: "Tracking NPC",
          type: "list",
        },
        {
          key: "/trackedItems",
          name: "Tracking itemów",
          type: "list",
        },
      ],
      Inne: [
        {
          key: "/minlvl",
          name: "Min. lvl potworków",
          type: "numstring",
        },
        {
          key: "/maxlvl",
          name: "Max. przewaga",
          tip: "Maksymalna różnica poziomów między Tobą a potworkiem przy której nie niszczy się loot na świecie na którym grasz. Jeśli nie wiesz co to, zostaw 13.",
          type: "numstring",
        },
        {
          key: "/show",
          name: "Hotkey",
          type: "char",
        },
        {
          key: "/altmobilebtt",
          name: "Przesuń przycisk mobilny",
          type: "check",
          tip: "Przesuwa przycisk widoczny na urządzeniach mobilnych pomiędzy torby",
        },
        {
          key: "/forceMobileMode",
          name: "Wymuś przycisk mobilny",
          type: "check",
          tip: "Pokazuje przycisk mobilny nawet, jeśli nie jest się na odpowiednim urządzeniu",
        },
        {
          key: "/interpolerate",
          name: "Animacje na mapie",
          type: "check",
        },
        {
          key: "/showqm",
          name: "Zaznaczaj questy",
          type: "check",
        },
        {
          key: "/novisibility",
          name: 'Nie pokazuj "mgły wojny"',
          type: "check",
          tip: "Wyłącza pokazywanie widzianego obszaru na czerwonych mapach.<br>Nie pozdrawiam klanu Game Over (Jaruna), który utrudniał testowanie tej funkcjonalności dedając mnie bez powodu.",
        },
        {
          key: "/showcol",
          name: "Pokazuj kolizje",
          type: "check",
          tip: "Zmiany widoczne są po odświeżeniu gry",
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
      Pomoc: [
        {
          type: "info",
          t1: "Instrukcja wyszukiwarki",
          t2: "[otwórz]",
          alert: `
asd
`,
        },
      ],
      Informacje: [
        {
          type: "info",
          t1: "Wersja",
          t2:
            "v" +
            this.version +
            (interface == "new" ? " NI" : interface == "old" ? " SI" : " OM"),
          tip: "Kliknij aby pokazać zmiany w tej wersji",
          alert: mmp.updateString,
        },
        {
          type: "info",
          t1: "Źródło instalacji",
          t2: this.getInstallSource(),
        },
        {
          type: "info-async",
          t1: "Licznik instalacji",
          placeholder: "wczytywanie...",
          tip: "Liczy od wersji 3.1 minimapy",
          fun: this.installationCounter.get,
        },
      ],
    },
  });
  this.init();
  niceSettings.init();
  this.fireEvent();
})();

// lf2
var clasick_plf = {
  engine: () => {
    g.loadQueue.push({
      fun: () => {
        clasick_plf.config.load();
      },
    }),
      $(
        '<style>div.clasick_plf {z-index: 400; overflow: hidden; background: rgba(15,15,15, 0.85); border-radius: 2px; border: 3px double rgba(60, 60, 60, 0.1); text-align: center; font-size: 12px; width: 165px; height: 40px; padding: 5px;} div.clasick_plf span.toggle {font: 18px Georgia, Tahoma; color: #c3c3c3;} div.clasick_plf input {vertical-align: middle; margin: 0; padding: 0;} div.clasick_plf input[type="text"] {-moz-appearance: none; appearance: none; width: 62px; height: 12px; outline: none; background: rgba(0,0,0,0.1); border: none; border-bottom: 1px dotted aqua; color: aqua; padding: 2px; text-shadow: 0 0 3px; font-size: 12px; transition: 0.3s ease;} div.clasick_plf input[type="text"]:focus {color: yellow; background: rgba(0,0,0,0.6);} div.clasick_plf table {margin: 0px auto;} div.clasick_plf table td {margin: 0; padding: 0; width: 33%; height: 22px;} div.clasick_plf hr {border: 1px solid rgba(60,60,60,0.5);}</style>'
      ).appendTo("head");
    var a = !1,
      b = lootItem;
    lootItem = function (c) {
      b(c);
      let d = parseItemStat(c.stat),
        e = parseInt(clasick_plf.vars.config[0]);
      ((isNaN(e) || c.pr >= e) && "true" == clasick_plf.vars.config[2]) ||
      (0 <= c.stat.search(/legendary/) &&
        "true" == clasick_plf.vars.config[3]) ||
      (0 <= c.stat.search(/heroic/) && "true" == clasick_plf.vars.config[4]) ||
      (0 <= c.stat.search(/unique/) && "true" == clasick_plf.vars.config[5]) ||
      ((0 <= c.stat.search(/fullheal/) ||
        0 <= c.stat.search(/leczy/) ||
        0 <= c.stat.search(/perheal/)) &&
        "true" == clasick_plf.vars.config[6]) ||
      (0 <= c.stat.search(/ammo/) && "true" == clasick_plf.vars.config[7]) ||
      (0 <= c.stat.search(/gold/) && "true" == clasick_plf.vars.config[9]) ||
      (0 <= c.stat.search(/teleport/) &&
        "true" == clasick_plf.vars.config[8]) ||
      (0 <= c.stat.search(/runes/) && "true" == clasick_plf.vars.config[10]) ||
      (0 <=
        c.stat.search(
          /Jeden ze składników legendarnej zbroi wykuwanej przez krasnoludy/
        ) &&
        "true" == clasick_plf.vars.config[11]) ||
      (0 <= c.stat.search(/ttl/) && "true" == clasick_plf.vars.config[12]) ||
      (0 <= c.stat.search(/bag/) && "true" == clasick_plf.vars.config[13])
        ? g.party &&
          !(isset(d.reqp) && -1 == d.reqp.indexOf(hero.prof)) &&
          (clasick_plf.fn.setLoots(c.id, "must"),
          setStateOnOneLootItem(c.id, 2))
        : (clasick_plf.fn.setLoots(c.id, "not"),
          setStateOnOneLootItem(c.id, 0)),
        a ||
          ((a = !0),
          setTimeout(function () {
            "true" == clasick_plf.vars.config[1]
              ? sendLoots(1, !1)
              : sendLoots(0, !1),
              (a = !1);


              // tu dodac kiedys autoprzepalare
          }, 300));
    };
  },
  fn: {
    setLoots: function (a, i) {
      for (
        var h,
          j = {
            want: [],
            not: [],
            must: [],
          },
          f = g.loots.want,
          k = g.loots.not,
          c = g.loots.must,
          d = 0;
        d < f.length;
        d++
      )
        ((h = f[d]), !$("#loot" + h).hasClass("yours")) &&
          (!1 != a && h == a ? j[i].push(a) : j.want.push(h));
      for (var h, d = 0; d < k.length; d++)
        ((h = k[d]), !$("#loot" + h).hasClass("yours")) &&
          (!1 != a && h == a ? j[i].push(a) : j.not.push(h));
      for (var h, d = 0; d < c.length; d++)
        ((h = c[d]), !$("#loot" + h).hasClass("yours")) &&
          (!1 != a && h == a ? j[i].push(a) : j.must.push(h));
      (g.loots.want = j.want), (g.loots.not = j.not), (g.loots.must = j.must);
    },
  },
  config: {
    load: () => {
      let a = localStorage.plf_pos
        ? localStorage.plf_pos.split("|")
        : ["15", "15"];
      $(
        '<div class="clasick_plf" style="position: absolute; left: ' +
          a[0] +
          "px; top: " +
          a[1] +
          'px;"><div><span class="toggle" tip="Rozwi\u0144">&#x2699; Loot Filter</span></div><div style="text-align: left; text-indent: 10px;"><label tip="Akceptuj \u0142up automatycznie"><input type="checkbox" name="autoaccept" /> &#10003;</label><label><input type="checkbox" name="t_value" /> Powy\u017Cej</label> <input type="text" onchange="this.value=clasick_plf.format(this.value);" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/zlo/patr_coin01.gif" style="vertical-align: middle; position: absolute; right: -3px;" /><br /><hr /><table><tr><td><label tip="\u0141ap: przedmioty legendarne' +
          ("object" == typeof ln
            ? ""
            : "<br />polecany dodatek: <b>Legendary Notificator</b>") +
          '" style="color: #D4433B; text-shadow: 0 0 1px #D4433B, 0 0 4px #D4433B;"><input type="checkbox" name="t_lega" /> *L*</label></td><td><label tip="\u0141ap: przedmioty heroiczne" style="color: #1C55FB; text-shadow: 0 0 1px #1C55FB, 0 0 4px #1C55FB;"><input type="checkbox" name="t_hero" /> *H*</label></td><td><label tip="\u0141ap: przedmioty unikatowe" style="color: #1CB217; text-shadow: 0 0 1px #1CB217, 0 0 4px #1CB217;"><input type="checkbox" name="t_uni" /> *U*</label></td></tr><tr><td><label tip="\u0141ap: mikstury lecz\u0105ce"><input type="checkbox" name="t_mix" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/pot/pra_m4.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="\u0141ap: strza\u0142y"><input type="checkbox" name="t_strzaly" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/arr/strzala13.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="\u0141ap: teleporty"><input type="checkbox" name="t_tp" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/pap/pap265.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td></tr><tr><td><label tip="\u0141ap: z\u0142oto"><input type="checkbox" name="t_gold" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/zlo/denar01.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="\u0141ap: Smocze Runy"><input type="checkbox" name="t_runy" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/sur/smocza_runa3.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="\u0141ap: kamienie runiczne"><input type="checkbox" name="t_kamien" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/neu/kam9viv.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td></tr><tr><td><label tip="\u0141ap: b\u0142ogos\u0142awie\u0144stwa"><input type="checkbox" name="t_blogo" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/ble/blo73.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="\u0141ap: torby"><input type="checkbox" name="t_bags" /><img src="https://micc.garmory-cdn.cloud/obrazki/itemy/bag/toolsbag.gif" style="vertical-align: middle; height: 20px; width: 20px;" /></label></td><td><label tip="Akceptuj \u0142up automatycznie"><input type="checkbox" name="autoaccept" /> &#10003;</label></td></tr><tr><td><span style="font-size: 130%; color: yellow; text-shadow: 0 0 1px orange; cursor: pointer; display: none;" tip="Ustawienia" onclick="message(\'Ustawienia b\u0119d\u0105 dost\u0119pne w przysz\u0142ej aktualizacji\');">&#9733;</span></td><td colspan="2"><span style="font-size: 80%; position: relative; right:-25px; bottom:0;">v' +
          clasick_plf.vars.version +
          ' by c<span style="color:aqua;text-shadow:0 0 1px black, 0 0 3px aqua, 0 0 5px aqua;">LA</span>sick</span></td></tr></table></div></div>'
      )
        .draggable({
          start: function () {
            g.lock.add("plf_moving"), $(this).css("cursor", "move");
          },
          stop: function () {
            g.lock.remove("plf_moving"),
              $(this).css("cursor", "default"),
              (localStorage.plf_pos =
                $(this).position().left + "|" + $(this).position().top);
          },
        })
        .appendTo("body"),
        $("div.clasick_plf span.toggle").click(function () {
          var a = 60 >= $("div.clasick_plf").innerHeight() ? "160px" : "40px";
          $(this).attr("tip", "40px" == a ? "Rozwi\u0144" : "Zwi\u0144"),
            $("div.clasick_plf").animate({
              height: a,
            });
        }),
        $("div.clasick_plf")
          .find('input[type="text"]')
          .val(clasick_plf.format(clasick_plf.vars.config[0])),
        $("div.clasick_plf")
          .find('input[type="checkbox"]')
          .each(function (a) {
            this.checked = !("true" != clasick_plf.vars.config[a + 1]);
          }),
        $("div.clasick_plf input").change(function () {
          $(this).blur(), clasick_plf.config.save.filters();
        });
    },
    save: {
      filters: function () {
        var a = [];
        a.push(
          $('div.clasick_plf input[type="text"]').val()
            ? parseInt(
                $('div.clasick_plf input[type="text"]')
                  .eq(0)
                  .val()
                  .replace(/ /g, "")
              )
            : "0"
        ),
          $('div.clasick_plf input[type="checkbox"]').each(function () {
            a.push(this.checked);
          }),
          (localStorage.plf_config = a),
          (clasick_plf.vars.config = a),
          clasick_plf.vars.refresh();
      },
    },
    reset: () => {
      delete localStorage.plf_config,
        delete localStorage.plf_pos,
        message(
          "Ustawienia dodatku zosta\u0142y zresetowane, zalecane [u]od\u015Bwie\u017Cenie[/u] gry."
        );
    },
  },
  format: (a) =>
    /^[0-9]+$/.test(a)
      ? a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      : a
          .replace(/[^0-9]/g, "")
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
  vars: {
    version: "1.0.1",
    name: "Loot Filter",
    world: location.host.split(".")[0],
    config: localStorage.plf_config ? localStorage.plf_config.split(",") : [0],
    refresh: function () {
      clasick_plf.vars.config = localStorage.plf_config
        ? localStorage.plf_config.split(",")
        : [0];
    },
  },
};
clasick_plf.engine();

// klanowicze online

/*
  - - -
  KLANOWICZE ONLINE
  AUTORSTWA RESKIEZISA aka PERSKIEGO KOTA
  WERSJA DLA NOWEGO I STAREGO INTERFEJSU
  - - -

  - - - - - - -
  GARMORY ZNOWU POPSULO DODATEK?
  POPROS SWOJEGO DODATKOPISARZA O NAPRAWE!

  Garmory czesto cos zmienia, ale dzieki temu mozna przewidziec co sie zepsulo.
  1. Najczestszy problem - zmiana struktury listy krotek (zlaczonych tablic zawierajacych id gracza, imie itd...)
     PATRZ linia 92
  2. Nowa automatycznie wykonywana funkcja po wywolaniu _g('clan&a=members') lub zmiana w nazewnictwie funkcji/elementow UI, 
     ktore sa wykorzystywane do ominiecia automatycznego wywolania tej funkcji
     PATRZ metody ApplicationSI.prototype.fetchMembers lub ApplicationNI.prototype.fetchMembers
  3. Zmiana nazwy wlasciwosci w obiekcie zwracanym przez _g('clan&a=members').
     (kiedys wlasciwosc members nazywala sie members2)

  Otworzenie konsoli w Chrome - CTRL+SHIFT+J
*/

(function () {
  "use strict";

  // czy gracz gra na Nowym Interfejsie?
  var isNewInterface =
    typeof window.Engine !== "undefined" &&
    typeof window.Engine.hero !== "undefined";

  /*
      \/ \/ \/
      SEKCJA UI START
      Wyjatek: metody renderMembers i setBattleInfo sa wykorzystywane z poziomu klasy Application
    */
  var STORAGE_KEY = "klanowicze_online";

  // Enum - przyjmuje jedna z dwoch wartosci
  // SizeEnum.NORMAL albo SizeEnum.COMPRESSED
  var SizeEnum = {
    NORMAL: 0,
    COMPRESSED: 1,
  };

  function Popup(events) {
    /*
        Metody z klasy Application obslugujace zdarzenia.
        events: {
          startFetchingInIntervals(),
          stopFetchingInIntervals(),
          addToGroup(),
          sendMessageTo()
        }
      */
    this.events = events;

    // stan UI komponentu
    this.state = {
      hidden: false,
      top: 10,
      left: 10,
      size: SizeEnum.NORMAL,
    };

    // zaladuj poprzedni stan UI komponentu z dysku, o ile istnieje
    this.loadStateFromDisk();

    // elementy HTML
    this.kobox = null;
    this.title = null;
    this.expandButton = null;
    this.membersTable = null;
    this.hideButton = null;

    // stworz strukture, przypisz elementy html do obiektu i nasluchuj zdarzenia
    this.build();

    // upewnij sie, ze okienko jest widoczne w przegladarce
    this.noOverflow();

    // dopasuj wyglad w zaleznosci od this.state.size
    this.implementStateSize();
  }

  Popup.prototype.renderMembers = function (members) {
    this.title.removeAttribute("data-battleinfo");

    var tbody = document.createElement("tbody");

    var includesHero = false;
    var count = 0;
    var MEMBERS_TUPLE_LENGTH = 10;

    /*
        tablica members to ciag zlaczonych tablic (krotek) typu:
        [ id, nick, lvl, prof, map, x, y, ?, loggedTimeAgo, icon ]
        rozmar jednej takiej tablicy przechowywany jest w stalej MEMBERS_TUPLE_LENGTH
  
        > > > UWAGA! < < <
        PRAWDOPODOBNIE COS SIE KIEDYS ZMIENI W STRUKTURZE TEJ TABLICY
        PRZY TESTOWANIU WARTO JA WYPISAC Z console.log(members)
  
        Zmiany w przeszlosci:
        - dodano 10 element, czyli sciezke do wygladu postaci (icon)
        - loggedTimeAgo (9 element) przechowywal wartosc 'online' gdy gracz byl zalogowany
      */

    for (var j = 0; j <= members.length; j += MEMBERS_TUPLE_LENGTH) {
      // jezeli dany gracz jest zalogowany to loggedTimeAgo (dziewiaty element krotki) jest rowny zero
      if (members[j + 8] !== 0) continue;

      count++;

      // nie pokazuj wlasnej postaci na liscie zalogowanych klanowiczow
      var nick = members[j + 1];
      if (
        isNewInterface ? nick === window.Engine.hero.d.nick : nick === hero.nick
      ) {
        includesHero = true;
        continue;
      }

      var id = members[j];
      var lvl = members[j + 2];
      var prof = members[j + 3];
      var map = members[j + 4];
      var x = members[j + 5];
      var y = members[j + 6];

      var row = tbody.insertRow();
      row.classList.add("ko-row");

      var addToGroupCell = row.insertCell();
      addToGroupCell.textContent = "+";
      if (isNewInterface) addToGroupCell.dataset.tip = "Dodaj do grupy";
      else addToGroupCell.setAttribute("tip", "Dodaj do grupy");
      addToGroupCell.classList.add("ko-add-to-group-cell");
      addToGroupCell.addEventListener(
        "click",
        this.events.addToGroup.bind(this, id)
      );

      var nickCell = row.insertCell();
      nickCell.textContent = `${nick} (${lvl}${prof})`;
      nickCell.classList.add("ko-nick-cell");
      nickCell.addEventListener(
        "click",
        this.events.sendMessageTo.bind(this, nick)
      );

      var locationTip = `${map} (${x},${y})`;
      if (this.state.size == SizeEnum.COMPRESSED) {
        if (isNewInterface) nickCell.dataset.tip = locationTip;
        else nickCell.setAttribute("tip", locationTip);
      } else {
        var mapCell = row.insertCell();
        mapCell.textContent = map;
        mapCell.classList.add("ko-map-cell");
        if (isNewInterface) mapCell.dataset.tip = locationTip;
        else mapCell.setAttribute("tip", locationTip);
      }
    }

    if (!includesHero) count++;

    if (this.state.size == SizeEnum.COMPRESSED)
      this.title.textContent = `Online: ${count}`;
    else this.title.textContent = `Klanowicze online: ${count}`;

    var titleTipText =
      count === 1
        ? "Jesteś tylko ty"
        : `${count} klanowiczów (łcznie z tobą)`;

    if (isNewInterface) this.title.dataset.tip = titleTipText;
    else this.title.setAttribute("tip", titleTipText);

    if (this.membersTable.tBodies.length === 0) {
      this.membersTable.appendChild(tbody);
      return;
    }

    this.membersTable.replaceChild(tbody, this.membersTable.tBodies[0]);
  };

  Popup.prototype.setBattleInfo = function () {
    this.title.textContent =
      this.state.size === SizeEnum.COMPRESSED
        ? "Walka"
        : "Gracz uczestniczy w walce";

    if (isNewInterface)
      this.title.dataset.tip = "Dodatek aktywuje się po zakończeniu walki";
    else
      this.title.setAttribute(
        "tip",
        "Dodatek aktywuje się po zakoĹczeniu walki"
      );

    this.title.setAttribute("data-battleinfo", "1");
  };

  Popup.prototype.handleHideButtonClick = function () {
    var newHidden = !this.state.hidden;
    this.state.hidden = newHidden;
    this.membersTable.hidden = this.state.hidden;
    this.saveStateToDisk();
    if (this.state.hidden) {
      this.hideButton.textContent = "Rozwi\u0144";
      this.events.stopFetchingInIntervals();
    } else {
      this.hideButton.textContent = "Zwi\u0144";
      this.events.startFetchingInIntervals();
    }
  };

  Popup.prototype.implementStateSize = function () {
    // aktualizacja klasy
    if (this.state.size === SizeEnum.COMPRESSED) {
      this.kobox.classList.add("compressed");
    } else {
      this.kobox.classList.remove("compressed");
    }

    // aktualizacja tekstu
    if (this.title.getAttribute("data-battleinfo")) {
      // wyswietlono wczesniej informacje o walce, nie zmieniaj
      this.setBattleInfo();
    } else {
      var lastOnline = this.title.textContent.split(": ")[1];
      if (lastOnline === undefined) lastOnline = "-";

      if (this.state.size === SizeEnum.COMPRESSED) {
        this.title.textContent = `Online: ${lastOnline}`;
      } else {
        this.title.textContent = `Klanowicze online: ${lastOnline}`;
      }
    }
  };

  Popup.prototype.handleExpandButtonClick = function () {
    var nextSize = (this.state.size + 1) % 2;
    this.state.size = nextSize;
    this.saveStateToDisk();
    this.implementStateSize();
  };

  Popup.prototype.loadStateFromDisk = function () {
    try {
      var state = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (
        state.areMembersHidden !== undefined ||
        state.wasMembersHidden !== undefined
      )
        throw "Stary sposĂłb zapisu";

      if (
        state.hidden !== undefined &&
        state.top !== undefined &&
        state.left !== undefined &&
        state.size !== undefined
      )
        this.state = state;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  Popup.prototype.saveStateToDisk = function () {
    // funkcja w setTimeout tworzy nowy this
    var self = this;

    // nie zatrzymuj petli zdarzen
    setTimeout(function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(self.state));
    }, 0);
  };

  // ogranicz pozycje okna do widzialnej czesci ekranu
  Popup.prototype.noOverflow = function () {
    var { top, left, width } = this.kobox.getBoundingClientRect();

    var oneThird = Math.ceil((1 / 3) * width);

    if (top < 0) this.kobox.style.top = `0px`;
    else if (top > window.innerHeight - 18)
      this.kobox.style.top = `${window.innerHeight - 18}px`;

    if (left < 0 - oneThird * 2)
      this.kobox.style.left = `${0 - oneThird * 2}px`;
    else if (left > window.innerWidth - oneThird)
      this.kobox.style.left = `${window.innerWidth - oneThird}px`;

    // zapisz zmiany
    if (this.state.top !== top || this.state.left !== left) {
      this.state.top = top;
      this.state.left = left;
      this.saveStateToDisk();
    }
  };

  Popup.prototype.build = function () {
    // struktura HTML
    $(document.body).append(`
        <div id="kobox">
          <div class="header">
            <span ctip="t_npc"></span>
            <img class="expand" tip="ZmieĹ wielkoĹÄ" ctip="t_npc" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE5IDEyaC0ydjNoLTN2Mmg1di01ek03IDloM1Y3SDV2NWgyVjl6bTE0LTZIM2MtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxOGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDNWNWgxOFYxOXoiLz48L3N2Zz4=">
          </div>
          <table></table>
          <div class="hide">Zwi\u0144</div>
          <div class="corner1"></div>
          <div class="corner2"></div>
        </div>
      `);

    // przypisz elementy do obiektu
    this.kobox = document.querySelector("#kobox");
    this.title = this.kobox.querySelector(".header span");
    this.expandButton = this.kobox.querySelector(".header img");
    this.membersTable = this.kobox.querySelector("table");
    this.hideButton = this.kobox.querySelector(".hide");

    // zaktualizuj wyglad
    //this.kobox.style.left = `${this.state.left}px`
    this.kobox.style.left = `1218px`; // nowy left
    // this.kobox.style.top = `${this.state.top}px`
    this.kobox.style.top = `192px`; // nowy top
    this.hideButton.textContent = this.state.hidden
      ? "Rozwi\u0144"
      : "Zwi\u0144";
    this.membersTable.hidden = this.state.hidden;

    if (isNewInterface) this.expandButton.dataset.tip = "ZmieĹ wielkoĹÄ";
    else this.expandButton.setAttribute("tip", "ZmieĹ wielkoĹÄ");

    // obsluz zdarzenia
    this.hideButton.addEventListener(
      "click",
      this.handleHideButtonClick.bind(this)
    );
    this.expandButton.addEventListener(
      "click",
      this.handleExpandButtonClick.bind(this)
    );

    var self = this;
    // przeciaganie okienka
    $(this.kobox).draggable({
      cancel: "table, .hide, .expand",
      start: function () {
        if (!isNewInterface) g.lock.add("ko");
      },
      stop: function () {
        if (!isNewInterface) g.lock.remove("ko");
        self.noOverflow();
      },
    });

    // style
    var stylesheet = document.createElement("style");
    stylesheet.appendChild(
      document.createTextNode(`
        #kobox {
          font-family: Helvetica;
          box-sizing: border-box;
          position: absolute !important;
          border: 3px gold double;
          color: #eeeeee;
          background: black;
          z-index: 500;
          font-size: 14px;
          width: 13em;
        }
  
        #kobox.compressed {
          width: 8em;
        }
  
        @media (min-width: 1500px) {
          #kobox {
            font-size: 16px;
          }
        }
  
        @media (min-width: 1700px) {
          #kobox {
            font-size: 17px;
            width: 16em;
          }
          #kobox.compressed {
            width: 10em;
          }
        }
  
        #kobox > .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px;
          font-size: 1em;
          text-align: center;
          font-weight: bold;
          border-bottom: 1px solid gold;
          z-index: 1;
        }
  
        #kobox > .header {
          cursor: move;
          cursor: -webkit-grab;
          cursor:    -moz-grab;
          cursor:         grab;
        }
        #kobox > .header:active {
          cursor: -webkit-grabbing;
          cursor:    -moz-grabbing;
          cursor:         grabbing;
        }
  
        #kobox > .header > span {
          pointer-events: none;
        }
  
        #kobox > .header > .expand {
          height: 1em;
          cursor: pointer;
          opacity: 0.7;
        }
        #kobox > .header > .expand:hover {
          opacity: 0.9;
        }
  
        #kobox > table {
          font-size: 0.7em;
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
  
        #kobox > .hide {
          font-size: 0.8em;
          margin: 1px;
          text-align: center;
          cursor: pointer;
          border-top: 1px solid gold;
          z-index: 1;
          user-select: none;
        }
  
        #kobox > .corner1, .corner2 {
          position: absolute;
          width: 35px;
          height: 23px;
          z-index: -1;
        }
        #kobox > .corner1 {
          background: url(img/tip-cor.png) no-repeat 0px 0px;
          top: -6px;
          left: -6px;
        }
        #kobox > .corner2 {
          background: url(img/tip-cor.png) no-repeat -35px 0px;
          bottom: -6px;
          right: -6px;
        }
  
        #kobox > table > tbody > .ko-row {
          border: solid;
          border-width: 1px 0;
          border-color: #5d5006;
          height: 1.6em;
        }
        #kobox > table > tbody > .ko-row:hover {
          background: #3c3c16;
        }
        #kobox > table > tbody > .ko-row:first-child {
          border-top: none;
        }
        #kobox > table > tbody > .ko-row:last-child {
          border-bottom: none;
        }
  
        #kobox > table > tbody > .ko-row > .ko-add-to-group-cell, .ko-nick-cell {
          cursor: pointer;
          user-select: none;
        }
        #kobox > table > tbody > .ko-row > .ko-add-to-group-cell:hover, .ko-nick-cell:hover {
          color: #eaeb74;
        }
  
        #kobox > table > tbody > .ko-row > .ko-add-to-group-cell {
          text-align: center;
          width: 16px;
        }
  
        #kobox > table > tbody > .ko-row > .ko-map-cell {
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `)
    );
    document.body.appendChild(stylesheet);
  };
  /*
      SEKCJA UI KONIEC
      /\ /\ /\
    */

  /*
      \/ \/ \/
      KLASA APPLICATION
    */
  // pomocnicza funkcja do deklaracji metod abstrakcyjnych (ktore musza zostac nadpisane przez dzieci)
  var abstractMethod = function () {
    throw new Error("Klanowicze online: wywolanie metody abstrakcyjnej");
  };

  function Application() {
    // konstruktor

    this.interval = null;

    this.popup = new Popup({
      startFetchingInIntervals: this.startFetchingInIntervals.bind(this),
      stopFetchingInIntervals: this.stopFetchingInIntervals.bind(this),
      addToGroup: this.addToGroup.bind(this),
      sendMessageTo: this.sendMessageTo.bind(this),
    });

    if (!this.popup.hidden) this.startFetchingInIntervals();
  }
  // metody:
  Application.prototype.startFetchingInIntervals = function () {
    this.fetchMembers();
    this.interval = setInterval(this.fetchMembers.bind(this), 5000);
  };
  Application.prototype.stopFetchingInIntervals = function () {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };
  // metody abstrakcyjne (musza byc nadpisane przez dzieci):
  Application.prototype.fetchMembers = abstractMethod;
  Application.prototype.addToGroup = abstractMethod;
  Application.prototype.sendMessageTo = abstractMethod;
  Application.prototype.checkIfIsInBattle = abstractMethod;

  /*
      \/ \/ \/
      DZIECI KLASY APPLICATION (z nadpisanymi metodami pod Nowy Interfejs i Stary Interfejs)
    */

  // Stary Interfejs
  function ApplicationSI() {
    var self = this;

    // ostatnia pobrana lista klanowiczow
    var lastFetchedMembers = null;

    // gracz otworzyl okno z klanowiczami
    var isOpenedMembersWindow = false;
    document
      .querySelector('#clanmenu span[name="Klanowicze"]')
      .parentElement.addEventListener("click", () => {
        isOpenedMembersWindow = true;
      });

    var parseInput23 = window.parseInput;
    window.parseInput = function (d, callback, xhr) {
      if (
        d.w &&
        (d.w.toString().startsWith("Zapytanie odrzucone") ||
          d.w.toString().startsWith("Odrzucono stare zapytanie"))
      )
        delete d.w;

      if (!d.members2 && !d.members) return parseInput23(d, callback, xhr);

      if (isOpenedMembersWindow) {
        // gracz otworzyl okno z klanowiczami
        isOpenedMembersWindow = false;
      } else {
        // lista klanowiczow przechwycona przez dodatek
        if (d.members) lastFetchedMembers = d.members.slice();
        delete d.members2;
        delete d.members;
      }

      return parseInput23(d, callback, xhr);
    };

    this.fetchMembers = function () {
      // pierwsze zaladowanie strony - wyswietl info o walce
      if (self.checkIfIsInBattle() && lastFetchedMembers === null) {
        self.popup.setBattleInfo();
      }

      _g("clan&a=members", function () {
        if (lastFetchedMembers) self.popup.renderMembers(lastFetchedMembers);
      });
    };

    this.checkIfIsInBattle = function () {
      return Boolean(g.battle);
    };

    this.addToGroup = function (id) {
      window._g(`party&a=inv&id=${id}`);
    };

    this.sendMessageTo = function (nick) {
      window.chatTo(nick);
    };

    Application.call(this);
  }

  // Nowy Interfejs
  function ApplicationNI() {
    var self = this;

    // jesli gracz nie ma klanu to wyjdz
    if (!window.Engine.hero.d.clan) return;

    const NO_CHAT_INPUT_WARN =
      "Klanowicze online: chatInputElement ma wartosc null - potrzebny jest nowy selektor okienka tekstowego chatu.\nSkontaktuj sie z dodatkopisarzem.";

    var chatInputElement = document.querySelector(".chat-tpl input");
    if (chatInputElement === null) {
      console.warn(NO_CHAT_INPUT_WARN);
    }

    var fetchedMembersBefore = false;

    this.fetchMembers = function () {
      if (self.checkIfIsInBattle() && !fetchedMembersBefore) {
        self.popup.setBattleInfo();
      }

      // nie przeszkadzaj gdy gracz zmienia postac lub pisze wiadomosc
      if (Engine.logOff || document.activeElement === chatInputElement) return;

      var clan = Engine.clan ? { ...Engine.clan } : Engine.clan;
      if (!clan)
        Engine.clan = {
          updateMembers() {},
        };

      _g(`clan&a=members`, function ({ members }) {
        Engine.clan = clan;

        if (members) {
          self.popup.renderMembers(members);

          if (!fetchedMembersBefore) fetchedMembersBefore = true;
        }
      });
    };

    this.checkIfIsInBattle = function () {
      return window.Engine.battle && window.Engine.battle.show;
    };

    this.addToGroup = function (id) {
      window._g(`party&a=inv&id=${id}`);
    };

    this.sendMessageTo = function (nick) {
      var chatInput = document.querySelector(".chat-tpl .input-wrapper input");
      if (chatInput === null) {
        console.warn(NO_CHAT_INPUT_WARN);
      } else {
        chatInput.value = `@${nick.replace(/ /g, "_")} `;
        chatInput.focus();
      }
    };

    Application.call(this);
  }

  // dziedziczenie (NIE RUSZAJ TEGO)
  ApplicationSI.prototype = Object.create(Application.prototype);
  ApplicationSI.prototype.constructor = ApplicationSI;
  ApplicationNI.prototype = Object.create(Application.prototype);
  ApplicationNI.prototype.constructor = ApplicationNI;

  // funkcja pomocnicza, ktora czeka az funkcja "check" zwroci prawde i wtedy wywola funkcje "then"
  var waitFor = function (check, then) {
    if (!check()) setTimeout(waitFor, 1000, check, then);
    else then();
  };

  if (isNewInterface) {
    waitFor(
      function () {
        // czekaj na pelne zaladowanie gry
        return window.Engine && window.Engine.allInit;
      },
      function () {
        new ApplicationNI();
      }
    );
  } else {
    waitFor(
      function () {
        // czasem zdarzy sie, ze TamperMonkey wykona sie przed skryptem Margonem i zmienna g jest niezainicjowana - czekaj na zaladowanie
        return window.g !== undefined;
      },
      function () {
        window.g.loadQueue.push({
          fun: function () {
            new ApplicationSI();
          },
        });
      }
    );
  }
})();


// e2
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function biciee22(mutations) {
  let checkBox12 = document.getElementById("wlacznike22");

  if (checkBox12.checked == true) {
    for (let mutation of mutations) {
      for (let el of mutation.addedNodes) {
        let a = el.getAttribute("tip");
        if (typeof a == "string" && a.match("<i>elita II</i>")) {
          let licznik123 = getRandomInt(500, 4000);
          let mapkapriva = document.querySelector(".mmpWrapper");
          let elitka2 = document.querySelector(".mmp-elite2");
          setTimeout(function () {
            mapkapriva.style.display = "block";
            $(elitka2).click();
            mapkapriva.style.display = "none";
            observerdoe2.disconnect();

            setTimeout(function () {
              $("#" + el.id).click();

              setTimeout(function () {
                _g("fight&a=f");
              }, getRandomInt(500, 2200));
              setTimeout(function () {
                if (g.loots)
                sendLoots(1, false);

                let checkBox124 = document.getElementById("wlacznike23");
                if (checkBox124.checked == true && location.host.split(".")[0] == "valhalla")
                setTimeout(function () {
                  if (hero.nick == "Obci") {
                    let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(1)");
                    $(postka1).click();
                } else if(hero.nick == "Obcia"){
                    let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(2)");
                    $(postka1).click();
                }else{
                  let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(3)");
                  $(postka1).click();
              }
                }, 1100);

                if (checkBox124.checked == true && location.host.split(".")[0] == "narwhals")
                setTimeout(function () {
                  if (hero.nick == "Tramwajarz") {
                    let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(1)");
                    $(postka1).click();
                } else if(hero.nick == "Obcik"){
                    let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(2)");
                    $(postka1).click();
                }else if(hero.nick == "Biszkobcik"){
                  let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(3)");
                  $(postka1).click();
              }
                else{
                  let postka1 = document.querySelector("#centerbox2 > div.priw8-change-character-wrapper > div:nth-child(4)");
                  $(postka1).click();
              }
                }, 1100);

              }, getRandomInt(2250, 4000));

              setTimeout(function () {
                observerdoe2.observe(pojemnikze21, {
                  childList: true,
                });
              }, 5000);
            }, licznik123 + getRandomInt(3500, 5000));
          }, licznik123);
          break;
        }
      }
    }
  }
}

function pierwszebicie2() {

  if (localStorage.getItem("wlacznike2checkbox2") == "true") {
    localStorage.setItem("wlacznike2checkbox2", "false");
  } else {
    localStorage.setItem("wlacznike2checkbox2", "true");

    

    let listapotworkow = document.querySelectorAll(".npc");
    for (potworek of listapotworkow) {
      let a = potworek.getAttribute("tip");
      if (a!=null && a.match("<i>elita II</i>")) {
        let licznik123 = getRandomInt(750, 4050);
        let mapkapriva = document.querySelector(".mmpWrapper");
        let elitka2 = document.querySelector(".mmp-elite2");
        setTimeout(function () {
          mapkapriva.style.display = "block";
          $(elitka2).click();
          mapkapriva.style.display = "none";

          setTimeout(function () {
            $(potworek).click();

            setTimeout(function () {
              _g("fight&a=f");
            }, 2000);
            setTimeout(function () {
              if (g.loots)
              sendLoots(1, false);
            }, 4000);
          }, licznik123 + 3500);
        }, licznik123);
        break;
      }
    }
  }
}

(function () {
  const storage1 = JSON.parse(localStorage.getItem("pozycjawlacznikae22")) || {
    position: {
      x: 0,
      y: 0,
    },
  };

  const $window1 = $(
    //'<div><input type="checkbox" id="wlacznike22" style="background-color:#4C6A8E;">Auto send </input></div>'
    '<div><input type="checkbox" id="wlacznike22" style="background-color:#4C6A8E;">Auto send </input><input type="checkbox" id="wlacznike23" style="background-color:#4C6A8E;">Zmiana </input><button type="button" id="button_po1" style="background-color:#4C6A8E;">/k no to po</button></div>'
    )

    .draggable({
      containment: "window",
      scroll: false,
      start: () => {
        g.mouseMove.enabled = false;
      },
      stop: (e, ui) => {
        g.mouseMove.enabled = true;
        storage1.position = {
          x: ui.position.left,
          y: ui.position.top,
        };
        localStorage.setItem("pozycjawlacznikae22", JSON.stringify(storage1));
      },
    })
    .css({
      position: "absolute",
      display: "inline-block",
      background: "rgba(0, 0, 0, 0.9)",
      border: "1px solid rgb(19, 55, 62)",
      left: storage1.position.x,
      top: storage1.position.y,
    })
    .css("z-index", 501);
  $window1.appendTo("body");
  document.getElementById("wlacznike22").addEventListener("change", pierwszebicie2, false);
  if (localStorage.getItem("wlacznike2checkbox2") == null) {
    localStorage.setItem("wlacznike2checkbox2", "false");
  } else if (localStorage.getItem("wlacznike2checkbox2") == "true") {
    let checkBox12 = document.getElementById("wlacznike22");
    checkBox12.checked = true;
  } else {
    let checkBox12 = document.getElementById("wlacznike22");
    checkBox12.checked = false;
  }

  let checkBox125 = document.getElementById("wlacznike23");

  if (localStorage.getItem("checkbox23") == null) {
    localStorage.setItem("checkbox23", "false");
  } else if (localStorage.getItem("checkbox23") == "true")
    checkBox125.checked = true
  else
  checkBox125.checked = false

    
    checkBox125.addEventListener("change", function (){
      
     if (localStorage.getItem("checkbox23") == "true") {
      localStorage.setItem("checkbox23", "false");
      checkBox125.checked = false;
    } else {
      localStorage.setItem("checkbox23", "true");
      checkBox125.checked = true;
    }


}, false);



})();

var pojemnikze21 = document.getElementById("base");
let observerdoe2 = new MutationObserver(biciee22);
observerdoe2.observe(pojemnikze21, {
  childList: true,
});

document.querySelector("#button_po1").addEventListener("click", function (){

  chatSend("/k no to po");
  const params = {
    content: "No to po",
    username: 'Obcik',
    avatar_url: 'https://cdn.discordapp.com/attachments/1026706458500399174/1076968590663753888/mysza_w_trajce.jpg'
}
  // const request1 = new XMLHttpRequest();
  // request1.open("POST", dcdoherosa, true);
  // request1.setRequestHeader('Content-type', 'application/json');
  // request1.send(JSON.stringify(params));
const request2 = new XMLHttpRequest();
request2.open("POST", dcdoherosa1, true);
request2.setRequestHeader('Content-type', 'application/json');
request2.send(JSON.stringify(params));

});

// wykrywacz tropow

//wykrywanie npc na mapie o danej nazwie
var axZR1 = newNpc;
newNpc = function (a) {
  axZR1(a);

  for (h in a) {
    if (
      $.inArray(a[h].nick, [
        "Złoże",
        "Amigo de Locos",
        "Ogromna płomiennica tląca",
        "Ogromna dzwonkówka tarczowata",
        "Ogromny bulwiak pospolity",
        "Ogromny mroźlarz",
        "Ogromny szpicak ponury",
        "Tropiciel Herosów",
        "Wtajemniczony Tropiciel Herosów",
        "Doświadczony Tropiciel Herosów",
      ]) > -1
    ) {
      let tip1 = document.querySelector("#npc" + a[h].id);
      let tiptropow = tip1.getAttribute("tip");
      let datanamapie = new Date().getTime();
      let timertropaprzywejsciunamape = g.npc[a[h].id].killSeconds;
      let minutytrop = Math.floor(timertropaprzywejsciunamape / 60);
      let sekundytrop =
        timertropaprzywejsciunamape -
        Math.floor(timertropaprzywejsciunamape / 60) * 60;
      tip1.addEventListener("mouseover", function () {
        let dataaktualna = new Date().getTime();
        let wyniktimeratropa = parseInt(
          timertropaprzywejsciunamape -
            (dataaktualna / 1000 - datanamapie / 1000)
        );
        minutytrop = Math.floor(wyniktimeratropa / 60);
        sekundytrop = wyniktimeratropa - Math.floor(wyniktimeratropa / 60) * 60;
        if (sekundytrop < 10) sekundytrop = '0' + sekundytrop;
        if (minutytrop)
          tip1.setAttribute(
            "tip",
            tiptropow +
              `<br><b color="white">Pozostało ${minutytrop} minut ${sekundytrop} sekund!</b>`
          );
      });
      if (sekundytrop < 10) sekundytrop = '0' + sekundytrop;
      let czy_otworzone;
      if (minutytrop)
            czy_otworzone = '<center>Znaleziono!<br><img src="' + a[h].icon + '"><br><b>' + a[h].nick + "</b><br>" + map.name + " (" + a[h].x + "," + a[h].y + ")<br><br>Powiadomi\u0107 klan?" + "<br>Zostało " + minutytrop + ":" + sekundytrop;
          else
            czy_otworzone = '<center>Znaleziono!<br><img src="' + a[h].icon + '"><br><b>' + a[h].nick + "</b><br>" + map.name + " (" + a[h].x + "," + a[h].y + ")<br><br>Powiadomi\u0107 klan?" + "<br>Jeszcze nikt nie otworzył.";

      mAlert(czy_otworzone, 2,
        [
          function () {
            if (minutytrop)
              var czybyltrop = "Zostało " + minutytrop + ":" + sekundytrop;
            else
            var czybyltrop = "Jeszcze nikt nie otworzył.";

              chatSend("/k " + a[h].nick + " - " + map.name + " (" + a[h].x + "," + a[h].y + ") - " + czybyltrop);


              toDataURL(a[h].icon)
              .then(dataUrl => {
                   
           const data = new FormData(); 
      
           var file = new File([dataUrl],"nazwazdj.gif",{type: "image/gif"});
     
            data.append("nazwazdj.gif",file);
     
             const request = new XMLHttpRequest();
     
         
               request.open("POST", dcdoherosa1, true);
         
               let plecznalazcy = hero.gender == 'k' ? "znalazła" : "znalazł";
               const params = {
                 content: "", //content: "@here",
                 username: "Wysłannik zakonu",
                 avatar_url:
                   "https://micc.garmory-cdn.cloud/obrazki/npc/bur/zr_ithan.gif",
     
                 embeds: [
                   {
                     color: Math.floor(Math.random() * 16777214) + 1,
                     title: `${hero.nick} ${plecznalazcy} ${a[h].nick}!`,
                     description:
                       "\u00AB " +
                       a[h].nick +
                       " \u00BB\n" +
                       " (" +
                       a[h].lvl +
                       ")\n" +
                       map.name +
                       " (" +
                       a[h].x +
                       "," +
                       a[h].y +
                       ")\n" + czybyltrop,
                     thumbnail: {
                       url: "attachment://nazwazdj.gif",
                     },
                     timestamp: new Date().toISOString(),
                   },
                 ],
               };
             data.append("payload_json", JSON.stringify(params));
            
               request.send(data)
              
              //  const request2 = new XMLHttpRequest();
              //  request2.open("POST", dcdoherosa, true);      
              //  request2.send(data);
              
              })
          },
          function () {},
        ]
      );

      break;
    }
  }
};
////////////////////////////////////////////////////////////////////////////
// podswietlenie grp
!(function (_newNpc) {
  window.newNpc = function (npcs) {
    const ret = _newNpc.apply(this, arguments);
    onNPC(npcs);
    return ret;
  };

  const colors = [
    "#000000",
    "#00FF00",
    "#0000FF",
    "#FF0000",
    "#01FFFE",
    "#FFA6FE",
    "#FFDB66",
    "#006401",
    "#010067",
    "#95003A",
    "#007DB5",
    "#FF00F6",
    "#FFEEE8",
    "#774D00",
    "#90FB92",
    "#0076FF",
    "#D5FF00",
    "#FF937E",
    "#6A826C",
    "#FF029D",
    "#FE8900",
    "#7A4782",
    "#7E2DD2",
    "#85A900",
    "#FF0056",
    "#A42400",
    "#00AE7E",
    "#683D3B",
    "#BDC6FF",
    "#263400",
    "#BDD393",
    "#00B917",
    "#9E008E",
    "#001544",
    "#C28C9F",
    "#FF74A3",
    "#01D0FF",
    "#004754",
    "#E56FFE",
    "#788231",
    "#0E4CA1",
    "#91D0CB",
    "#BE9970",
    "#968AE8",
    "#BB8800",
    "#43002C",
    "#DEFF74",
    "#00FFC6",
    "#FFE502",
    "#620E00",
    "#008F9C",
    "#98FF52",
    "#7544B1",
    "#B500FF",
    "#00FF78",
    "#FF6E41",
    "#005F39",
    "#6B6882",
    "#5FAD4E",
    "#A75740",
    "#A5FFD2",
    "#FFB167",
    "#009BFF",
  ];
  function getBorderColorForGroup(grp) {
    return colors[grp % colors.length];
  }

  function makeNPCborder($npc, grp) {
    const color = getBorderColorForGroup(grp);
    $npc.style["filter"] = `drop-shadow(0 0 5px ${color})`;
    $npc.style.boxShadow = `0px 0px 10px ${color} inset, 0px 0px 10px${color}`;
  }

  function onNPC(npcs) {
    for (const id in npcs) {
      const npc = npcs[id];
      const $npc = document.querySelector(`#npc${id}`);
      if (npc.grp) {
        if ($npc && npc.wt > 19) {
         const color = getBorderColorForGroup(npc.grp);
         $npc.style["filter"] = `drop-shadow(0 0 15px ${color})`;
         $npc.style.boxShadow = `0px 0px 10px ${color} inset, 0px 0px 10px${color}`;

        setTimeout(function(){
          let tlooryginalne = $npc.style["background-image"].split(",")[0];

          $npc.style["background-image"] = `${tlooryginalne}, linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)`
          // let costam = document.createElement("div"); 
          // costam.style["background-image"] = tlooryginalne;
          // costam.style["width"] = $npc.style["width"];
          // costam.style["height"] = $npc.style["height"];
          // costam.style["left"] = $npc.style["left"];
          // costam.style["top"] = $npc.style["top"];
          // costam.style["position"] = $npc.style["position"];
          // $npc.parentNode.insertBefore(costam, $npc.nextSibling);

          $npc.style["border"] = "5px solid transparent";
          $npc.style["border-radius"] = "20%";
          $npc.style["background-origin"] = "border-box";
          $npc.style["background-position"] = "center";
          $npc.style["background-repeat"] = "no-repeat";


          for (const ids in npcs) {
            const npce = npcs[ids];
            if (npce.grp == npc.grp && npce.wt < 10)
            {
              const $npc1 = document.querySelector(`#npc${ids}`);
              setTimeout(function(){
                let tlooryginalne1 = $npc1.style["background-image"].split(",")[0];

                $npc1.style["background-image"] = `${tlooryginalne1}, linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)`
      
                $npc1.style["border"] = "5px solid transparent";
                $npc1.style["border-radius"] = "20%";
                $npc1.style["background-origin"] = "border-box";
                $npc1.style["background-position"] = "center";
                $npc1.style["background-repeat"] = "no-repeat";
                },300);

      
            }}

          },100);

         

         // $npc.style["-webkit-mask"] = "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)";
         // $npc.style["-webkit-mask-composite"] = "xor";
        } else if ($npc) {
          makeNPCborder($npc, npc.grp);
        }
      }else{
        if ($npc && npc.wt > 19) {

        setTimeout(function(){
          const color = "teal";
          $npc.style["filter"] = `drop-shadow(0 0 5px ${color})`;
          $npc.style.boxShadow = `0px 0px 10px ${color} inset, 0px 0px 10px ${color}`;
 
        let tlooryginalne = $npc.style["background-image"];
        $npc.style["background-image"] = `${tlooryginalne}, linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)`;
        // let costam = document.createElement("div"); costam.style["background-image"] = tlooryginalne;
        // $npc.parentNode.insertBefore(costam, $npc.nextSibling);

        $npc.style["border"] = "5px solid transparent";
        $npc.style["border-radius"] = "20%";
        $npc.style["background-origin"] = "border-box";
        $npc.style["background-position"] = "center";
        $npc.style["background-repeat"] = "no-repeat";
        },100);

        //$npc.style["-webkit-mask"] = "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)";
       // $npc.style["-webkit-mask-composite"] = "xor";
        }
      }

    }
  }
})(window.newNpc);

// lista herosow


(function () {
  const storage = JSON.parse(localStorage.getItem("pozycjaHerosow")) || {
    position: {
      x: 0,
      y: 0,
    },
  };

  const $window = $('<div id="heroskidoubicia">Lista herosów: </br></div>')
    .draggable({
      containment: "window",
      scroll: false,
      start: () => {
        g.mouseMove.enabled = false;
      },
      stop: (e, ui) => {
        g.mouseMove.enabled = true;
        storage.position = {
          x: ui.position.left,
          y: ui.position.top,
        };
        localStorage.setItem("pozycjaHerosow", JSON.stringify(storage));
      },
    })
    .css({
      position: "absolute",
      display: "inline-block",
      background: "rgba(0, 0, 0, 0.9)",
      width: "165px",
      border: "1px solid rgb(19, 55, 62)",
      left: storage.position.x,
      top: storage.position.y,
    })
    .css("z-index", 502);
  $window.appendTo("body");
})();

function heroskiDoUbicia() {
  let heroskiDo = document.querySelectorAll(".cll-timer-monster");
  let heroskidoubiciahe = document.getElementById("heroskidoubicia");
  heroskidoubiciahe.innerHTML = "Lista herosów:";
  listaherosow1.forEach(function (userItem) {
    let div = document.createElement("div");
    div.innerHTML = "</br>\u2023" + userItem;
    for (let i = 0; i < heroskiDo.length; i++) {
      if (heroskiDo[i].outerText == userItem) {
        if (heroskiDo[i].style.color == "red") {
          div.style.color = "red";
        } else {
          div.style.color = "#46e3ff";
        }
      }
    }
    div.style.marginTop = "-13px";
    $("#heroskidoubicia").append(div);
  });
  setTimeout(heroskiDoUbicia, 3000);
}
setTimeout(heroskiDoUbicia, 3000);

// webhook do ll valhalla
const toDataURL = url => fetch(url)
  .then(response => response.blob());

var butonyzglobala = document.querySelector("body");
let warunek1 = true;
function dodaniedoglobala(mutations) {
  for (mutation of mutations) {
    for (nodesdss of mutation.addedNodes) {

      $(".vocative_ialert").remove();

//  usuwanie obrazenw w walce
      $("#battle BIG").remove();


      if (nodesdss.className == "cll-hot-img") {
        let herosik = document.querySelector(
          "body > div.cll-alert.ui-draggable.ui-draggable-handle > div > div.cll-alert-content"
        )
          ? document.querySelector(
              "body > div.cll-alert.ui-draggable.ui-draggable-handle > div > div.cll-alert-content"
            ).innerText
          : document.querySelector(
              "body > div.cll-alert > div > div.cll-alert-content"
            ).innerText;
        herosik = herosik.split("!");
        let titleheros = herosik[0].substring(12, 18);
        let nazwaimiejsceherosa = herosik[0].substring(19);
        let pocietemiejsce = nazwaimiejsceherosa.split(" na mapie ");
        let typpotwora = "";
        if (pocietemiejsce[0] == "Mamlambo (36lvl)" || pocietemiejsce[0] == "Regulus Mętnooki (63lvl)" || pocietemiejsce[0] == "Umibozu (90lvl)" || pocietemiejsce[0] == "Amaimon Soploręki (117lvl)" || pocietemiejsce[0] == "Hydrokora Himeryczna (144lvl)" || pocietemiejsce[0] == "Vashkar (171lvl)" || pocietemiejsce[0] == "Lulukav (198lvl)" || pocietemiejsce[0] == "Arachin Podstępny (225lvl)" || pocietemiejsce[0] == "Reuzen (252lvl)" || pocietemiejsce[0] == "Wernoradzki Drakolisz (279lvl)")
        typpotwora = "KOLOS"
        else
        typpotwora = herosik[0].substring(12, 17).toUpperCase();
        let plecznalazcy = hero.gender == 'k' ? "znalazła" : "znalazł";
        let coloremb =
          herosik[0].substring(12, 17) == "tytan" ? "8388608" : "8388736";

         // for (var licznik = 1; licznik < 1001 && !(Math.floor(1.4 * licznik + 4.00001) >= hero.lvl); licznik++){};
         // var licznik2 = Math.floor(hero.lvl * 1.4 + 4.00001);
         var licznik = Math.max(Math.min(Math.ceil((hero.lvl-4.5)/1.4),hero.lvl-14),1);
         var licznik2 = Math.min(Math.max(Math.round((1+0.4)*hero.lvl)+4,hero.lvl+14),300);

     toDataURL(nodesdss.src)
         .then(dataUrl => {
              
      const data = new FormData(); 
 
      var file = new File([dataUrl],"nazwazdj.gif",{type: "image/gif"});

       data.append("nazwazdj.gif",file);

      //  const request = new XMLHttpRequest();
        const request2 = new XMLHttpRequest();
        var heremalpa ="";
        if(typpotwora == "HEROS"){
       //   request.open("POST", dcdoherosa, true);
          request2.open("POST", dcdoherosa1, true);      
        }
        else if (typpotwora == "TYTAN")
        {
        //  request.open("POST", dcdotytana, true);
          request2.open("POST", dcdotytana1, true);  
          heremalpa ="@here";
        }
        else
        {
       //   request.open("POST", dcdokolosa, true);
          request2.open("POST", dcdokolosa1, true);
          titleheros = "kolosa";
          heremalpa ="@here";
        }

        const params = {
          content: heremalpa, //content: "@here",
          username: "Wysłannik zakonu",
          avatar_url:
            "https://micc.garmory-cdn.cloud/obrazki/npc/bur/zr_ithan.gif",

          embeds: [
            {
              color: coloremb,
             title: `${hero.nick} ${hero.lvl}lvl //(${licznik}-${licznik2})// ${plecznalazcy} ${titleheros}!`,
              description:
                "\u00AB " +
                typpotwora +
                "! \u00BB\n" +
                pocietemiejsce[0] +
                "\n" +
                pocietemiejsce[1],
              thumbnail: {
                url: "attachment://nazwazdj.gif",
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };
        data.append("payload_json", JSON.stringify(params));
        if(document.querySelector("#cll-notify"))
        document.querySelector("#cll-notify").addEventListener(
          "click",
          function () {
            chatSend(
              "/k " +
              typpotwora +
                "! " +
                nazwaimiejsceherosa +
                "! " + `///(${licznik}-${licznik2})///`
            );
            $("#cll-notify").off("click");

            setTimeout(function () {
              if (
                request2.readyState == "1" &&
                warunek1
              ) {
                warunek1 = false;
             //   request.send(data);
                request2.send(data);
                setTimeout(function () {
                  warunek1 = true;
                }, 3000);
              }
            }, 100);
          },
          { once: true }
        );

        observer1235.disconnect();

        setTimeout(function () {
          let observer1235 = new MutationObserver(dodaniedoglobala);
          observer1235.observe(butonyzglobala, {
            childList: true,
            subtree: true,
          });
        }, 15000); //15 sek
      })
        break;
      }
    }
  }
}

let observer1235 = new MutationObserver(dodaniedoglobala);
observer1235.observe(butonyzglobala, {
  childList: true,
  subtree: true,
});

// bettermod + ukrywanie dmg w walce
(function () {
  $(".itemHighlighter").removeClass("itemHighlighter");
  $("#bagc").css("height", "198px");
  $("#warn").remove();
  $("#ni-promo").remove();

  $(
    '<style>.item[tip*="artefact"] { box-shadow: inset 0 0 5px 3px red; } .item[tip*="upgraded"] { box-shadow: inset 0 0 5px 3px yellow; } .item[tip*="unique"] { box-shadow: inset 0 0 5px 3px orange; } .item[tip*="heroic"] { box-shadow: inset 0 0 5px 3px #2090FE; } .item[tip*="legendary"] { box-shadow: inset 0 0 5px 3px #B08;}</style>'
    ).appendTo("head");
})();

// webhook lega/kamyk dc

var obcika1 = {
  engine1: function () {
    (function (a) {
      lootItem = function (b) {
        if ((a(b), /legendary/.test(b.stat))) {
          if (
            b.name == "Ornament ściółkowych monstrów IV" ||
            b.name == "Przysięga grzybni III" || b.name == "Dokładna instrukcja wysiewu" || b.name == "Oko wiosennych pnączy III" || b.name == "Skarb z wiosennej orki III"
          )
            return;
          message("Gratulacje! Spad\u0142a [color=red]*legenda*[/color]");


          toDataURL("https://micc.garmory-cdn.cloud/obrazki/itemy/" + b.icon,)
          .then(dataUrl => {
               
       const data = new FormData(); 
  
       var file = new File([dataUrl],"nazwazdj.gif",{type: "image/gif"});
 
        data.append("nazwazdj.gif",file);
 
         const request = new XMLHttpRequest();
 
          request.open("POST", dcdolegi1, true);
          let plecznalazcy,tytulnowy,descrypcja;
         if(g.party){
          plecznalazcy = hero.gender == 'k' ? "była" : "był";
          tytulnowy = `${hero.nick} ${plecznalazcy} w grp gdzie spadła LEGENDA!`;
          let listaoosob = [];
          g.party.forEach(element => listaoosob.push(element.n));
          var grposoby = listaoosob.join(", ");
          descrypcja = "Nazwa: " + b.name + "\nPoziom: " + b.stat.match(/lvl=(\d+)/)?.[1] + "\nŚwiat: " + location.hostname.split(".")[0].charAt(0).toUpperCase() + location.hostname.split(".")[0].slice(1)+ "\nGrupa: " + grposoby;
         }else{
          plecznalazcy = hero.gender == 'k' ? "złapała" : "złapał";
          tytulnowy = `${hero.nick} ${plecznalazcy} LEGENDĘ!`
          descrypcja = "Nazwa: " + b.name + "\nPoziom: " + b.stat.match(/lvl=(\d+)/)?.[1] + "\nŚwiat: " + location.hostname.split(".")[0].charAt(0).toUpperCase() + location.hostname.split(".")[0].slice(1);
         }
          const params = {
            content: "@here", //content: "@here",
            username: "Wysłannik zakonu",
            avatar_url:
              "https://micc.garmory-cdn.cloud/obrazki/npc/bur/zr_ithan.gif",
            embeds: [
              {
                color: Math.floor(Math.random() * 16777214) + 1,
                title: tytulnowy,
                description:descrypcja,
                thumbnail: {
                  url: "attachment://nazwazdj.gif",
                },
                timestamp: new Date().toISOString(),
              },
            ],
          };
          data.append("payload_json", JSON.stringify(params));
          request.send(data);
          // const request1 = new XMLHttpRequest();
          // request1.open("POST", dcdolegi, true);
          // request1.send(data);
        })
        } else if (
          /Jeden ze składników legendarnej zbroi wykuwanej przez krasnoludy/.test(
            b.stat
          )
        ) {
          message("Gratulacje! Spad\u0142 [color=blue]*kamyk*[/color]");
          //wysylanie kamyka
          chatSend("/k [" + "ITEM#" + b.hid + "] hehehe");

          toDataURL("https://micc.garmory-cdn.cloud/obrazki/itemy/" + b.icon,)
          .then(dataUrl => {
               
       const data = new FormData(); 
  
       var file = new File([dataUrl],"nazwazdj.gif",{type: "image/gif"});
 
        data.append("nazwazdj.gif",file);
 
         const request = new XMLHttpRequest();
 
          request.open("POST", dcdolegi1, true);
          let plecznalazcy,tytulnowy,descrypcja;
         if(g.party){
          plecznalazcy = hero.gender == 'k' ? "była" : "był";
          tytulnowy = `${hero.nick} ${plecznalazcy} w grp gdzie spadł KAMYK!`;
          let listaoosob = [];
          g.party.forEach(element => listaoosob.push(element.n));
          var grposoby = listaoosob.join(", ");
          descrypcja = "Nazwa: " + b.name + "\nPoziom: " + b.stat.match(/lvl=(\d+)/)?.[1] + "\nŚwiat: " + location.hostname.split(".")[0].charAt(0).toUpperCase() + location.hostname.split(".")[0].slice(1)+ "\nGrupa: " + grposoby;
         }else{
          plecznalazcy = hero.gender == 'k' ? "złapała" : "złapał";
          tytulnowy = `${hero.nick} ${plecznalazcy} KAMYK!`
          descrypcja = "Nazwa: " + b.name + "\nPoziom: " + b.stat.match(/lvl=(\d+)/)?.[1] + "\nŚwiat: " + location.hostname.split(".")[0].charAt(0).toUpperCase() + location.hostname.split(".")[0].slice(1);
         }
          const params = {
            content: "@here", //content: "@here",
            username: "Wysłannik zakonu",
            avatar_url:
              "https://micc.garmory-cdn.cloud/obrazki/npc/bur/zr_ithan.gif",
            embeds: [
              {
                color: Math.floor(Math.random() * 16777214) + 1,
                title: tytulnowy,
                description: descrypcja,
                thumbnail: {
                  url: "attachment://nazwazdj.gif",
                },
                timestamp: new Date().toISOString(),
              },
            ],
          };
          data.append("payload_json", JSON.stringify(params));
          request.send(data);
          // const request1 = new XMLHttpRequest();
          // request1.open("POST", dcdolegi, true);
          // request1.send(data);
        })
        }
      };
    })(lootItem);
  },
};
obcika1.engine1();

// get eq
// update do rarity
quickSeq = new (function (_startGame, _newOther) {
  let that = this;
  this.parseOther = function (other, id) {
    if (!g.other[id] && !other.del) {
      this.getTip(id, this.appendOtherTip);
    }
  };
  this.appendOtherTip = function (tip, id) {
    let $other = $("#other" + id);
    if ($other.length) {
      $other.attr("tip", $other.attr("tip") + "<br>" + tip);
    }
  };
  newOther = function (data) {
    for (let i in data) {
      that.parseOther(data[i], i);
    }
    return _newOther.apply(this, arguments);
  };
  this.getWorld = function () {
    return window.g.worldConfig.getWorldName();
  };
  this.getEq = function (id, clb) {
    const domain = window._l();
    const dir = id % 128;
    const url =
      `https://mec.garmory-cdn.cloud/${domain}/${this.getWorld()}/${dir}/${id}.json?` +
      new Date().getTime();
      
      let nowyurl = url;
     let nowyxd = nowyurl.split("?");
      if(nowyxd[0]!="https://mec.garmory-cdn.cloud/pl/valhalla/0/0.json"){
    fetch(url)
      .then((res) => {
        if (res.ok) {
          res.text().then((jsonString) => {
            clb(JSON.parse(jsonString));
          });
        } else {
          clb({});
        }
      })
      .catch(() => {
        clb({});
      });}
  };
  this.getTip = function (id, callback) {
    this.getEq(id, function (eq) {
      let tip = "";
      let nor = 0;
      let uni = 0;
      let her = 0;
      let upg = 0;
      let leg = 0;
      let art = 0;
      let lvlSum = 0;
      let equippedItemCount = 0;
      let playerLevel = id == hero.id ? hero.lvl : g.other[id]?.lvl;
      if (playerLevel) {
        for (let i in eq) {
          let item = eq[i];
          let stat = window.parseItemStat(item.stat);
          if (item.st != 9 && item.st != 10) {
            equippedItemCount++;
            if (stat.rarity == "artefact") {
              art++;
            } else if (stat.rarity == "legendary") {
              leg++;
            } else if (stat.rarity == "upgraded") {
              upg++;
            } else if (stat.rarity == "heroic") {
              her++;
            } else if (stat.rarity == "unique") {
              uni++;
            } else {
              nor++;
            }

            let lvl = parseInt(stat.lvl);
            if (isNaN(lvl)) lvl = 1;

            let enhanceLvl = parseInt(stat.enhancement_upgrade_lvl);
            if (isNaN(enhanceLvl)) enhanceLvl = 0;

            lvl += lvl * (enhanceLvl * 0.03); // each enhance level increases effective level by 3%

            if (!isNaN(lvl)) lvlSum += Math.pow(lvl / playerLevel, 1.2) * 100;
          }
        }
        if (art > 0) {
          tip += "<font color=red>Artefakty: " + art + "</font>";
        }
        if (leg > 0) {
          if (tip != "") {
            tip += "<br>";
          }
          tip += "<font color=orange>Legendarne: " + leg + "</font>";
        }
        if (upg > 0) {
          if (tip != "") {
            tip += "<br>";
          }
          tip += "<font color=yellow>Ulepszone: " + upg + "</font>";
        }
        if (her > 0) {
          if (tip != "") {
            tip += "<br>";
          }
          tip += "<font color=lightblue>Heroiczne: " + her + "</font>";
        }
        if (uni > 0) {
          if (tip != "") {
            tip += "<br>";
          }
          tip += "<font color=lightgreen>Unikatowe: " + uni + "</font>";
        }
        if (nor > 0) {
          if (tip != "") {
            tip += "<br>";
          }
          tip += "<font color=white>Pospolite: " + nor + "</font>";
        }
        lvlSum = lvlSum / (equippedItemCount > 0 ? equippedItemCount : 1);
        if (tip != "") {
          tip +=
            "<br><br><font color=white>Wsp. eq/lvl: " +
            lvlSum.toFixed(2) +
            "</font>";
        }
      }
      callback(tip, id);
    });
  };
  this.onGameStart = function () {
    that.getTip(hero.id, that.appendHeroTip);
  };
  this.oldHeroTip = false;
  this.appendHeroTip = function (tip) {
    let $hero = $("#hero");
    if (!that.oldHeroTip) that.oldHeroTip = $("#hero").attr("tip");
    $hero.attr(
      "tip",
      "<center>" +
        that.oldHeroTip +
        "<br>" +
        (tip != "" ? tip : "Nie widać Twojego eq.") +
        "</center>"
    );
  };
  startGame = function () {
    _startGame.apply(this, arguments);
    g.loadQueue.push({
      fun: that.onGameStart,
      data: "",
    });
  };
})(startGame, newOther);

// ładniejszy log walki




__translations["default"]["msg_-pierceb"] =
  "<font color='#A9A9A9'><b>-Blok przebicia</b></font>"; //Blok przebicia
__translations["default"]["msg_woundfrost %val%"] =
  "<font color='99FF00'><i><b>+Głęboka rana</font> (-%val%% osłabiona <font color='aqua'>magią zimna</font>)</b></i>"; //GR i osłabienie żywiołu
__translations["default"]["msg_+legbon_holytouch %val%"] =
  "<font color='FF00FF'><i><b>+Dotyk anioła</b></i></font>"; //DA bez wartości
__translations["default"]["msg_-blok %val%"] =
  "<font color='#A9A9A9'><b>-Zablokowanie %val% obrażeń</b></font>"; //Blokada dmg
__translations["default"]["msg_+pierce"] =
  "<font color='99FF00'><i>+Przebicie</i></font>"; //przebicie
__translations["default"]["msg_+of_crit"] =
  "<font color='FFD700'><i><b>+Cios krytyczny broni pomocniczej</b></i></font>"; //CK pomki
__translations["default"]["msg_+of_wound"] =
  "<font color='99FF00'><i><b>+Głęboka rana pomocnicza</b></i></font>"; //GR
__translations["default"]["msg_+fastarrow"] =
  "<font color='99FF00'><i>+Szybka strzała</i></font>"; //Szybka strzała
__translations["default"]["msg_+critslow_per= %val%"] =
  "<font color='#60de09'>+Krytyczne spowolnienie o </font><font color='red'>%val%%</font>"; //Krytyczne spowolnienie + wartość
__translations["default"]["+third_strike"] =
  "<font color='white'><b>+Trzeci cios</b></font>"; // Trzeci Cios
__translations["default"]["msg_-parry"] =
  "<font color='white'><b>+Parowanie</b></font>"; //Parowanie
__translations["default"]["msg_-evade"] =
  "<font color='white'><b>+Unik</b></font>"; //UNIK
__translations["default"]["msg_+freeze"] =
  "<font color='aqua'><i>+Zamrożenie</i></font>"; //Zamro
__translations["default"]["msg_+wound"] =
  "<font color='99FF00'><i>+Głęboka rana</i></font>"; //GR
__translations["default"]["msg_+hithurt %val%"] =
  "<font color='FFD700'><i>+Bolesny cios, spowolnienie o %val%% SA</i></font>"; //Bolesny cios + wartość SA
__translations["default"]["msg_+crit"] =
  "<font color='FFD700'><i><b>+Cios krytyczny</b></i></font>"; //CK
__translations["default"]["msg_+legbon_verycrit"] =
  "<i><font color='FFD700'><b>+CIOS BARDZO KRYTYCZNY</i></b></font>"; //CBK??
__translations["default"]["msg_+verycrit"] =
  "<i><b>+CIOS BARDZO KRYTYCZNY</i></b>"; //CBK
__translations["default"]["msg_+legbon_curse"] =
  "<font color='red'><b>+KLĄTWA</b></font>"; //Klątwa
__translations["default"][
  "eng_game_nick_and_value_heal_per-allies %name% %val%"
] = "'%name% wzmacnia leczenie z przedmiotów swojej drużyny o %val%%,"; //Kto wzmacnia turowego leka z drużyny
__translations["battle"]["your_move %sec%"] =
  "<font color='white'>Twój ruch - pozostało %sec%s</font>"; //Twoj ruch + czas w sek
__translations["battle"]["someoneelse_move"] =
  "<font color='white'>Ruch kogoś innego</font>"; //Kogo ruch
__translations["default"]["msg_+acdmg %val%"] =
  "<span>+Niszczenie pancerza o <font color='#00fcb1'><b>%val%</b></font></span>"; //Niszczenie pancerza + wartość
__translations["default"]["msg_+engback %val%"] =
  "<font color='#db00fc'>%val% energii</font>"; //+ energi np. po CK + wartość
__translations["default"]["msg_-legbon_critred"] =
  "<font color='#ba7d89'>-Krytyczna osłona</font>"; // -KO
__translations["default"]["msg_+resdmg %val%"] =
  "<font color='#fc8dd6'>+Niszczenie odporności magicznych o <font color='#ffea00'>%val%%</font></font>"; //Niszczenie odporności magicznych + wartość
__translations["battle"]["winner_is %name% %posfix%"] =
  "<font color='red'>Zwyciężył%posfix% <b><font color='#8996f5'>%name%</font></b></font>"; //Kto wygrał
__translations["default"]["eng_game_only_val_+taken_dmg %val%"] =
  "<b><font color='#8521ff'>+Piętno bestii: atak </font></b><font color='white'>+%val%</font>"; //Piętno
__translations["default"]["msg_combo-max"] =
  "+Kombinacja <font color='#f507b5'>x%val%!</font>"; //Kombinacja + x
__translations["default"]["msg_-arrowblock"] =
  "<b><font color='red'>-Strzała zneutralizowana</font></b>"; //Strzała zneutrailozowana
__translations["default"]["msg_tspell %name%"] =
  "<font color='red'>%name%</font> wykonuje <font color='#ff21da'>%name2%.</font>"; //Wykonuje np. Gniew bogów + wartość
__translations["default"]["msg_shout %name%"] =
  "Uwaga <font color ='#ff21da'>%name2%</font> została skupiona na <font color='red'>%name%.</font>"; //na kogo wyzyw
__translations["default"]["msg_legbon_lastheal %val%"] =
  "<b><font color='#ff0000'>%val%:</font> <font color='white'>Ostatni ratunek, +%val2% punktów życia.</font></b>"; //OR + Wartość
__translations["battle"]["loser_is %name% %posfix%"] =
  "<font color='cyan'>Poległ%posfix%</font><font color='#f007ec'> %name%</font>"; //Zgon
__translations["default"]["msg_legbon_holytouch_heal %val%"] =
  "<font color='#ffffff'>Dotyk anioła:</font> uleczono <font color='#ff5c95'>%val%</font> punktów życia <font color='white'>%name%</font>"; //Dotyk
__translations["default"]["msg_-legbon_resgain"] =
  "<b><font color='#e6156f'>-Ochrona żywiołów</font></b>"; //OŻ
__translations["default"]["msg_aura-sa_per %val%"] =
  "<font color='#e6ff05'>Aura szybkości SA </font><font color='#ffffff'>%val%%.</font>"; //Aura SA
__translations["default"]["msg_+abdest %val%"] =
  "+Zniszczono <font color='#50faf7'><b>%val%</b> absorpcji</font>"; //Zniszczono absy
__translations["default"]["msg_+absorb %val%"] =
  "+Odnowienie <font color='#50faf7'><b>%val%</b> absorpcjii</font>"; //+Absy fizyk
__translations["default"]["msg_-absorbm %val%"] =
  "-Absorpcja <font color='#50faf7'><b>%val%</b></font> obrażeń magicznych"; // -Absorpcje magiczne
__translations["default"]["msg_-absorb= %val%"] =
  "Odnowienie <font color='#50faf7'><b>%val%</b> absorpcjii</font>"; //Odnowienie abs fizyk
__translations["default"]["msg_-absorb %val%"] =
  "-Absorpcja <font color='#50faf7'><b>%val%</b></font> obrażeń fizycznych"; //-Absy fizyczne
__translations["default"]["msg_+absorbm %val%"] =
  "-Absorpcja <font color='#50faf7'><b>%val%</b></font> obrażeń magicznych";
__translations["default"]["msg_+lowheal2turns %val%"] =
  "+Bonus przeklęty: <font color='#fc851c'>redukcja leczenia turowego</font> o %val% życia"; //Info o przeklętej
__translations["default"]["msg_+distract"] =
  "<i><font color='FFD700'>+Wytrącenie z równowagi</font></i>"; //Wytrącenie z równowagi


__translations["default"]["legbon_curse"] = "<font color='violet'>Klątwa: podczasu udanego ataku twoja stara jest w dupe jebana XD</font>";
//__translations["default"]["loot_with %day% %npc% %grpinf% %name%"] = "<font color=grey>W dniu %day% został(a) pokonany(a) %npc% przez %name%%grpinf%</font>";
  







// wykrywacz herosow serverowych

// const mapydosprawdzenia1 = [1, 2, 9, 35, 33, 114];
// const nazwymap1 = ["Ithan", "Torneg", "Werbin", "Karka-han", "Eder", "Thuzal"];

// const mapydosprawdzenia2 = [344, 1116, 347, 180, 1387, 731, 730];
// const nazwymap2 = [
//   "Kwieciste Przejście",
//   "Głuchy Las",
//   "Lazurowe Wzgórze",
//   "Andarum Ilami",
//   "Skały Mroźnych Śpiewów",
//   "Winnica Meflakasti",
//   "Zachodnia Rubież",
// ];

// const mapydosprawdzenia3 = [1449, 1399, 1924, 1901, 1926, 2355, 2357];
// const nazwymap3 = [
//   "Skryty Azyl",
//   "Zawodzące Kaskady",
//   "Dolina Chmur",
//   "Niecka Xiuh Atl",
//   "Altepetl Mahoptekan",
//   "Przejście Władców Mrozu",
//   "Korytarz Zagubionych Marzeń",
// ];

// function wyszukiwanieHeroska1() {
//   var i = 0;
//   var h = {
//     aid: g.aid,
//     id: hero.id,
//     nick: hero.nick,
//   };
//   message("SZUKAM Bothvar Brzytworęki");

//   function myLoop1() {
//     setTimeout(function () {
//       $.getJSON(
//         dad.engine,
//         {
//           login:
//             localStorage.getItem("_gLogin") != null
//               ? localStorage.getItem("_gLogin")
//               : "",
//           password:
//             localStorage.getItem("_gPassword") != null
//               ? localStorage.getItem("_gPassword")
//               : "",
//           h: h,
//           map: {
//             id: mapydosprawdzenia1[i],
//             name: nazwymap1[i],
//           },
//           send: {
//             t: "start",
//           },
//           way: "json",
//           ts: ts(),
//         },
//         function (a) {
//           message("Sprawdzam " + nazwymap1[i - 1]);
//           if (a.npc.length > 0) {
//             for (let element of a.npc) {
//               if (element.id == 10002) {
//                 i = i + 100;

//                 h["lvl"] = hero.lvl;
//                 h["prof"] = hero.prof;
//                 h["img"] = hero.img;
//                 h["hp"] = Math.ceil((hero.hp / hero.maxhp) * 100);
//                 h["energy"] = hero.energy;
//                 h["mana"] = hero.mana;
//                 h["dmg"] = hero.dmg;
//                     // mAlert(
//                     //   '<center>heros!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Bothvar Brzytworęki</b><br>' +
//                     //     nazwymap1[i - 101] +
//                     //     " (" +
//                     //     element.x +
//                     //     "," +
//                     //     element.y +
//                     //     ")"
//                     // );
//                 $.getJSON(
//                   dad.engine,
//                   {
//                     login:
//                       localStorage.getItem("_gLogin") != null
//                         ? localStorage.getItem("_gLogin")
//                         : "",
//                     password:
//                       localStorage.getItem("_gPassword") != null
//                         ? localStorage.getItem("_gPassword")
//                         : "",

//                     h: h,
//                     map: {
//                       id: mapydosprawdzenia1[i - 101],
//                       name: nazwymap1[i - 101],
//                       x: element.x,
//                       y: parseInt(element.y) + 1,
//                     },

//                     send: {
//                       t: "battle",
//                       id: "10002",
//                     },

//                     way: "json",
//                     ts: ts(),
//                   },

//                   function (b) {
//                     message(
//                       '<center>Ubity!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Bothvar Brzytworęki</b><br>' +
//                         nazwymap1[i - 101] +
//                         " (" +
//                         element.x +
//                         "," +
//                         element.y +
//                         ")"
//                     );

//                     setTimeout(
//                       function () {
//                         location.reload();
//                       },

//                       2000
//                     );
//                   }
//                 );
//               }
//             }
//           }
//         }
//       );

//       i++;
//       if (i < mapydosprawdzenia1.length) {
//         myLoop1();
//       }
//     }, 1000);
//   }
//   myLoop1();
// }

// function wyszukiwanieHeroska2() {
//   var i = 0;
//   var h = {
//     aid: g.aid,
//     id: hero.id,
//     nick: hero.nick,
//   };
//   message("SZUKAM Jorund Jastrzębiooki");

//   function myLoop2() {
//     setTimeout(function () {
//       $.getJSON(
//         dad.engine,
//         {
//           login:
//             localStorage.getItem("_gLogin") != null
//               ? localStorage.getItem("_gLogin")
//               : "",
//           password:
//             localStorage.getItem("_gPassword") != null
//               ? localStorage.getItem("_gPassword")
//               : "",
//           h: h,
//           map: {
//             id: mapydosprawdzenia2[i],
//             name: nazwymap2[i],
//           },
//           send: {
//             t: "start",
//           },
//           way: "json",
//           ts: ts(),
//         },
//         function (a) {
//           message("Sprawdzam " + nazwymap2[i - 1]);
//           if (a.npc.length > 0) {
//             for (let element of a.npc) {
//               if (element.id == 10001) {
//                 i = i + 100;
//                 // mAlert(
//                 //   '<center>heros!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Jorund Jastrzębiooki</b><br>' +
//                 //           nazwymap2[i - 101] +
//                 //           " (" +
//                 //           element.x +
//                 //           "," +
//                 //           element.y +
//                 //           ")"
//                 //       );
//                 h["lvl"] = hero.lvl;
//                 h["prof"] = hero.prof;
//                 h["img"] = hero.img;
//                 h["hp"] = Math.ceil((hero.hp / hero.maxhp) * 100);
//                 h["energy"] = hero.energy;
//                 h["mana"] = hero.mana;
//                 h["dmg"] = hero.dmg;

//                 $.getJSON(
//                   dad.engine,
//                   {
//                     login:
//                       localStorage.getItem("_gLogin") != null
//                         ? localStorage.getItem("_gLogin")
//                         : "",
//                     password:
//                       localStorage.getItem("_gPassword") != null
//                         ? localStorage.getItem("_gPassword")
//                         : "",

//                     h: h,
//                     map: {
//                       id: mapydosprawdzenia2[i - 101],
//                       name: nazwymap2[i - 101],
//                       x: element.x,
//                       y: parseInt(element.y) + 1,
//                     },

//                     send: {
//                       t: "battle",
//                       id: "10001",
//                     },

//                     way: "json",
//                     ts: ts(),
//                   },

//                   function (b) {
//                     message(
//                       '<center>Ubity!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Jorund Jastrzębiooki</b><br>' +
//                         nazwymap2[i - 101] +
//                         " (" +
//                         element.x +
//                         "," +
//                         element.y +
//                         ")"
//                     );

//                     setTimeout(
//                       function () {
//                         location.reload();
//                       },

//                       2000
//                     );
//                   }
//                 );
//               }
//             }
//           }
//         }
//       );

//       i++;
//       if (i < mapydosprawdzenia2.length) {
//         myLoop2();
//       }
//     }, 1000);
//   }
//   myLoop2();
// }

// function wyszukiwanieHeroska3() {
//   var i = 0;
//   var h = {
//     aid:"4801252",id:"1450289",nick:"Ludcio",
//   };
//   message("SZUKAM Kalf Krwawousty");

//   function myLoop3() {
//     setTimeout(function () {
//       $.getJSON(
//         dad.engine,
//         {
//           login:
//             localStorage.getItem("_gLogin") != null
//               ? localStorage.getItem("_gLogin")
//               : "",
//           password:
//             localStorage.getItem("_gPassword") != null
//               ? localStorage.getItem("_gPassword")
//               : "",
//           h: h,
//           map: {
//             id: mapydosprawdzenia3[i],
//             name: nazwymap3[i],
//           },
//           send: {
//             t: "start",
//           },
//           way: "json",
//           ts: ts(),
//         },
//         function (a) {
//           message("Sprawdzam " + nazwymap3[i - 1]);
//           if (a.npc.length > 0) {
//             for (let element of a.npc) {
//               if (element.id == 10000) {
//                 i = i + 100;
//                 // mAlert(
//                 //   '<center>heros!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Kalf Krwawousty</b><br>' +
//                 //           nazwymap3[i - 101] +
//                 //           " (" +
//                 //           element.x +
//                 //           "," +
//                 //           element.y +
//                 //           ")"
//                 //       );
//                 h["lvl"] = hero.lvl;
//                 h["prof"] = hero.prof;
//                 h["img"] = hero.img;
//                 h["hp"] = Math.ceil((hero.hp / hero.maxhp) * 100);
//                 h["energy"] = hero.energy;
//                 h["mana"] = hero.mana;
//                 h["dmg"] = hero.dmg;

//                 $.getJSON(
//                   dad.engine,
//                   {
//                     login:
//                       localStorage.getItem("_gLogin") != null
//                         ? localStorage.getItem("_gLogin")
//                         : "",
//                     password:
//                       localStorage.getItem("_gPassword") != null
//                         ? localStorage.getItem("_gPassword")
//                         : "",

//                     h: h,
//                     map: {
//                       id: mapydosprawdzenia3[i - 101],
//                       name: nazwymap3[i - 101],
//                       x: element.x,
//                       y: parseInt(element.y) + 1,
//                     },

//                     send: {
//                       t: "battle",
//                       id: "10000",
//                     },

//                     way: "json",
//                     ts: ts(),
//                   },

//                   function (b) {
//                     message(
//                       '<center>Ubity!<br><img src="https://i.imgur.com/ctFzBrZ.gif"><br><b>Kalf Krwawousty</b><br>' +
//                         nazwymap3[i - 101] +
//                         " (" +
//                         element.x +
//                         "," +
//                         element.y +
//                         ")"
//                     );

//                     setTimeout(
//                       function () {
//                         location.reload();
//                       },

//                       3000
//                     );
//                   }
//                 );
//               }
//             }
//           }
//         }
//       );

//       i++;
//       if (i < mapydosprawdzenia3.length) {
//         myLoop3();
//       }
//     }, 1000);
//   }
//   myLoop3();
// }

// //rysowanie okienka

// (function () {
//   const storage = JSON.parse(localStorage.getItem("heroskivallkordy")) || {
//     position: {
//       x: 0,
//       y: 0,
//     },
//   };

//   const $window = $(
//     '<div id="minutnikivall" style="display:block">Szukaj: <button type="button" style="background-color:#4C6A8E;">Bothvar</button><button type="button" style="background-color:#4C6A8E;">Jorund</button><button type="button" style="background-color:#4C6A8E;">Kalf</button><button type="button" style="background-color:#4C6A8E;">ALL!</button></div>'
//   )
//     .draggable({
//       containment: "window",
//       scroll: false,
//       start: () => {
//         g.mouseMove.enabled = false;
//       },
//       stop: (e, ui) => {
//         g.mouseMove.enabled = true;
//         storage.position = {
//           x: ui.position.left,
//           y: ui.position.top,
//         };
//         localStorage.setItem("heroskivallkordy", JSON.stringify(storage));
//       },
//     })
//     .css({
//       position: "absolute",
//       display: "inline",
//       background: "rgba(0, 0, 0, 0.9)",
//       padding: "5px",
//       border: "1px solid rgb(19, 55, 62)",
//       left: storage.position.x,
//       top: storage.position.y,
//     })
//     .css("z-index", 501)
//     .on("contextmenu", function (asd) {
//       document.getElementById("minutnikivall").style.display =
//         document.getElementById("minutnikivall").style.display == "block"
//           ? "none"
//           : "block";
//       asd.preventDefault();
//     });

//   $window.appendTo("body");
// })();

// document
//   .querySelector("#minutnikivall > button:nth-child(1)")
//   .addEventListener("click", wyszukiwanieHeroska1);
// document
//   .querySelector("#minutnikivall > button:nth-child(2)")
//   .addEventListener("click", wyszukiwanieHeroska2);
// document
//   .querySelector("#minutnikivall > button:nth-child(3)")
//   .addEventListener("click", wyszukiwanieHeroska3);
// document
//   .querySelector("#minutnikivall > button:nth-child(4)")
//   .addEventListener("click", wyszukiwanieAll);

// function wyszukiwanieAll() {
//   wyszukiwanieHeroska1();
//   setTimeout(wyszukiwanieHeroska2, 10000);
//   setTimeout(wyszukiwanieHeroska3, 21000);
// }

// document.addEventListener("keydown", (ev) => {
//   if (
//     ev.keyCode === 109 &&
//     !["INPUT", "TEXTAREA"].includes(ev.target.tagName)
//   ) {
//     document.getElementById("minutnikivall").style.display =
//       document.getElementById("minutnikivall").style.display == "block"
//         ? "none"
//         : "block";
//   }
// });

// function sprawdzanieherosow1() {
//   let herosek1 = document.getElementById("gNpc10002");
//   let herosek2 = document.getElementById("gNpc10001");
//   let herosek3 = document.getElementById("gNpc10000");

//   if (herosek1) {
//     mAlert(
//       "<center>Znaleziono!<br>" +
//         `<img src="${herosek1.style.background
//           .replace("url(", "")
//           .replace(")", "")
//           .replace(/\"/gi, "")}"><br>` +
//         herosek1.getAttribute("tip").replace("<i>heros</i>", " ") +
//         "<br>" +
//         map.name +
//         " (" +
//         herosek1.getAttribute("data-x") +
//         "," +
//         herosek1.getAttribute("data-y") +
//         ")"
//     );
//   } else if (herosek2) {
//     mAlert(
//       "<center>Znaleziono!<br>" +
//         `<img src="${herosek2.style.background
//           .replace("url(", "")
//           .replace(")", "")
//           .replace(/\"/gi, "")}"><br>` +
//         herosek2.getAttribute("tip").replace("<i>heros</i>", " ") +
//         "<br>" +
//         map.name +
//         " (" +
//         herosek2.getAttribute("data-x") +
//         "," +
//         herosek2.getAttribute("data-y") +
//         ")"
//     );
//   } else if (herosek3) {
//     mAlert(
//       "<center>Znaleziono!<br>" +
//         `<img src="${herosek2.style.background
//           .replace("url(", "")
//           .replace(")", "")
//           .replace(/\"/gi, "")}"><br>` +
//         herosek3.getAttribute("tip").replace("<i>heros</i>", " ") +
//         "<br>" +
//         map.name +
//         " (" +
//         herosek3.getAttribute("data-x") +
//         "," +
//         herosek3.getAttribute("data-y") +
//         ")"
//     );
//   }
// }

// setTimeout(sprawdzanieherosow1, 5000);







// // licznik grooove


// var date = new Date();
// $.getScript(
//   "https://addons2.margonem.pl/get/145/145874dev.js?ver=" +
//     [date.getUTCDate(), date.getUTCMonth() + 1].join(".")
// );






// odbieranie kalendarza adwentowegod
//var datadokalnedarza = new Date().getUTCDate()-13; // na urodziny
//var datadokalnedarza = new Date().getUTCDate(); 

function kalendarzadv(){
if(datadokalnedarza != window.localStorage.getItem("kalendarzadw1"))
  {
    window.localStorage.removeItem("kalendarzadw1");
    window.localStorage.removeItem("kalendarzadw");
  }
var nickkalendarz = window.localStorage.getItem("kalendarzadw")? window.localStorage.getItem('kalendarzadw')+"," : "";

if(!window.localStorage.getItem("kalendarzadw") || window.localStorage.getItem("kalendarzadw").indexOf(","+hero.nick+",") == -1)
{
  _g(`rewards_calendar&action=open&day_no=${datadokalnedarza}`); 
  nickkalendarz = nickkalendarz +","+ hero.nick+",";
  window.localStorage.setItem("kalendarzadw1", datadokalnedarza);
  window.localStorage.setItem("kalendarzadw", nickkalendarz);
}
}

 //if (new Date().getMonth() == 11 && new Date().getUTCDate() < 26) //to jest  tylko dla swiat gwiazdka
 if(kalendarzon == true)
 g.loadQueue.push({ fun: kalendarzadv, data: "" }); 



  // // ramki e2

  // ramki_elite = function () { 
  //   for (id in g.npc) {
  //   if (g.npc[id].wt>19 && g.npc[id].wt<=29) 
  //  // $('#npc'+id).css("border", "3px dotted red");
  //     $('#npc'+id).css({"box-shadow": "0px 0px 20px 20px red, inset 0px 0px 20px 5px red"});
  //   }
  //   }
  //   time_npc = function () 
  //   {
  //   setInterval(function() {ramki_elite()},500);
  //   }
  //   g.loadQueue.push({fun:time_npc,data:''});


// autofiht pod r




document.addEventListener("keyup", (ev) => {
  if (ev.keyCode === 82 && !["INPUT", "TEXTAREA"].includes(ev.target.tagName)) {
    for(var i in g.npc){
      if ((Math.abs(hero.rx - g.npc[i].x) <= 1 && Math.abs(hero.ry - g.npc[i].y) <= 1) && (g.npc[i].type == 2 || g.npc[i].type == 3)){
      //  message('Atakowany przeciwnik: "'+g.npc[i].nick+'"');
        _g("fight&a=attack&ff=1&id=-"+i);
        break;
      }
    }
  }
});





  // Rozwiązywanie grupy po podziale łupów

  // (function(_p1) {
  //   let Drop = false;
  
  //   parseInput = function(a, b, c) {
  //       _p1(a, b, c);
  //       if (a.loot && !Drop) {
  //           Drop = true;
  //       } else if (!a.loot && Drop) {
  //           if (g.party) {
  //               if (g.party[hero.id].r == 1) {
  //                   _g('party&a=disband');
  //                   Drop = false;
  //               } else {
  //                   _g(`party&a=rm&id=${hero.id}`);
  //                   Drop = false;
  //               }
  //           } else {
  //               Drop = false;
  //           }
  //       }
  //   }
  // })(parseInput);

  // taki fajny dodatek co zamienia mAlerty na message, przydatne jezeli postac chce zaprosic inna postac ktora jest juz w grupie
(function(a) {
  mAlert = function() {
//      if (arguments.length == 1 || arguments[1] == undefined)
            if (arguments[0] == "Poczekaj, aż reszta grupy dokona wyboru łupów!")
          return message(arguments[0]);
      return a.apply(this, arguments);
  }
})(mAlert);


// auto att na ppm

// document.querySelector("#centerbox").addEventListener("contextmenu", function(ev){
//     ev.preventDefault();
//     var s = $("#ground").offset(),
//     i = ev.clientX - s.left >> 5,
//     a = ev.clientY - s.top >> 5;
    
//     miniMapPlus.heroGoTo(i,a);
    
//     for(var id in g.npc)
//     {
//         if(g.npc[id].x == i && g.npc[id].y == a)
//         {
//             let czekanie = setInterval(function(){
//                 if(g.npc[id].x)
//                 if(Math.abs(hero.rx - g.npc[id].x) <= 0 && Math.abs(hero.ry - g.npc[id].y) <= 1)
//                     { 
//                       setTimeout(function(){
//                         g.lock.add("ruch1");
//                         _g("fight&a=attack&ff=1&id=-"+id);
//                         clearInterval(czekanie);
//                         setTimeout(function(){g.lock.remove("ruch1");},800)
//                       },400);

//                     }
//             },1000);
//             break;
//         }
//     }
// });




// paski zycia

(function(old) {
	var specialMobs = [
      "Mamlambo", "Regulus MÄtnooki", "Umibozu", "Amaimon SoplorÄki",
      "Hydrokora Chimeryczna", "Vashkar", "Lulukav", "Arachin PodstÄpny",
      "Reuzen", "Wernoradzki Drakolisz"
    ]; //kolosy majÄ inne id w walce i poza walkÄ, wiÄc nie da siÄ sprawdziÄ czy potwĂłr jest kolosem. Jedyna opcja to lista nazw kolosĂłw

	function lifebar(hpp, fw, id) {
		var multiplier = 1;
		for (var i in g.npc) {
			if (g.npc[id*(-1)]) {
				var mob = g.npc[id*(-1)];
				if (mob.wt > 99) {
					multiplier = 6;
				} else if (mob.wt > 79) {
					multiplier = 3;
				};
			};
		};
		if (g.battle.f[id] && specialMobs.indexOf(g.battle.f[id].name) > -1 && id < 0) {
			multiplier = 6;
		};
		if (hpp == 0 || (hpp == 100 && multiplier == 1)) {
			return "";
		} else if (hpp > 50) {
            return "<div class='priw-lifebar' style='pointer-events: none; border-radius: 2px; margin-left: "+(fw/2-16*multiplier)+"px; margin-top: -10px; width: "+(32*multiplier)+"px; height: 4px; border: 1px solid #333333; background: gray;'><div style='width: "+(hpp/3.125)*multiplier+"px; height: 4px; background: green;'></div></div>";
		} else if (hpp > 20) {
			return "<div class='priw-lifebar' style='pointer-events: none; border-radius: 2px; margin-left: "+(fw/2-16*multiplier)+"px; margin-top: -10px; width: "+(32*multiplier)+"px; height: 4px; border: 1px solid #333333; background: gray;'><div style='width: "+(hpp/3.125)*multiplier+"px; height: 4px; background: yellow;'></div></div>";
		} else {
			return "<div class='priw-lifebar' style='pointer-events: none; border-radius: 2px; margin-left: "+(fw/2-16*multiplier)+"px; margin-top: -10px; width: "+(32*multiplier)+"px; height: 4px; border: 1px solid #333333; background: gray;'><div style='width: "+(hpp/3.125)*multiplier+"px; height: 4px; background: red;'></div></div>";
		};
	};
	newTroops = function(a) {
		old(a);
		for (var j in a) {
			if (g.battle.f[j].imgLoaded) {
				// $("#troop"+j).html(lifebar(a[j].hpp, g.battle.f[j].fw, j));
				$("#troop"+j).find(".priw-lifebar").remove();
				$("#troop"+j).append(lifebar(a[j].hpp, g.battle.f[j].fw, j))
			} else {
				// $("#troop"+j).html(lifebar(a[j].hpp, 32, j));
				$("#troop"+j).find(".priw-lifebar").remove();
				$("#troop"+j).append(lifebar(a[j].hpp, 32, j));
				(function(id, mob) {
					var img = new Image();
					img.src = mob.icon;
					img.onload = function() {
						// $("#troop"+id).html(lifebar(g.battle.f[id].hpp, g.battle.f[id].fw, id));
            if(g.battle){
						$("#troop"+id).find(".priw-lifebar").remove();
						$("#troop"+id).append(lifebar(a[id].hpp, g.battle.f[id].fw, id));
            }
					};
				})(j, a[j]);
			};
		};
	};
})(newTroops);


// lvl niszczenia lupow z automatu do mmp

function xdddds(){
var xddsadasd = setInterval(function(){
  if (g.worldConfig.getDropDestroyLvl()!= null && g.worldConfig.getDropDestroyLvl() < 300)
  {
    margoStorage.set("mmp/maxlvl",g.worldConfig.getDropDestroyLvl());
    miniMapPlus.initSettings();
    miniMapPlus.onSettingsUpdate();
    clearInterval(xddsadasd);
  }
  },100)
}

g.loadQueue.push({ fun: xdddds, data: "" }); 




// ostrzezenie o braku miesjca

const lootsupdatef = window.lootsUpdateFreeBagSlots;
window.lootsUpdateFreeBagSlots = function () {
  const ret1 = lootsupdatef.apply(this, arguments);
  if (g.freeSlots == 0 && g.loots)
  {
    message("[color=white]BRAK MIEJSCA W TORBIE!!![/color]");
    message("[color=white]BRAK MIEJSCA W TORBIE!!![/color]");
    message("[color=white]BRAK MIEJSCA W TORBIE!!![/color]");
  }
  return ret1;
};

// rozwalanie grp

document.addEventListener("keyup", (ev) => {
  if (ev.keyCode === 72 && !["INPUT", "TEXTAREA"].includes(ev.target.tagName)) {
    if (g.party) 
    if (g.party[hero.id].r == 1) {
       _g('party&a=disband');
         } else {
             _g(`party&a=rm&id=${hero.id}`);
         }
  }
});


// zmiana wygladu ll

$('<style>.cll-alert{background: rgb(0,0,0,0.69) !important;color: rgb(255,255,255) !important} .cll-alert-content{background: none !important;color: rgb(255,255,255) !important}</style>').appendTo("head");



//usuwanie linijek z dialogow

// (function() {

//   var ukrywaj = ["nie zawiera", "pozbawiona"]
  
  
//   'use strict';
//   !(oldPi => {
//   parseInput = (data, ...args) => {
//   if (data.d && data.d.length > 3) {
//   const resultId = data.d.findIndex(x => typeof(x) === typeof("ab") && ukrywaj.some(phrase => x.includes(phrase)));
//   if(resultId >6){
//   data.d.splice(resultId, 3)
//   }
//   }
//   oldPi(data, ...args)
//   }
//   })(parseInput);
//   })();
  









// clock zegar z globala


	g.loadQueue.push({fun: function(){
		var posi = localStorage.getItem('clock1') != null ? localStorage.getItem('clock1').split('x') : [1,1];
		$('<div id="gClock1">' + ut_time(unix_time()) + '<br>' + ut_date(unix_time()) + '</div>').css({
      left:posi[0]+"px",
      top:posi[1]+"px",
      "position":"absolute",
      "z-index":"510",
      "background": "url(/img/fr-window.jpg) repeat scroll -10px -40px transparent",
      "text-align": "center",
      "padding": "3px",
      "border": "2px solid green",
      "width": "100px"
    }).appendTo('body').draggable({
			start: function () {
				g.lock.add('blokada');
			}
		}, {
			stop: function () {
				g.lock.remove('blokada');
				localStorage.setItem("clock1",$('#gClock1').position().left + 'x' + $('#gClock1').position().top)
			}
		});
		setInterval(function () {
			$('#gClock1').html(ut_time(unix_time()) + '<br>' + ut_date(unix_time()));
		}, 1000);
	}})













// pomiedzy 19-21
// _g("match&a=signin");
// jak widac klase "MM-alert" akcept
// _g("match&a=accept_opp&ans=1")


// g.loadQueue.push({ fun: lootsUpdateFreeBagSlots, data: "" }); 

  // g.crafting.triggerOpen();_g("enhancement&action=progress&item=1089535804&ingredients=1089264531");setTimeout(function(){g.crafting.triggerClose();},300)


  // (function(olds) {
   
  //   battleMsg = function(a) {
  //     olds(a);
  //     $("#battle BIG").remove();
  //     $("#battlelog").append(a);
  //    // console.log(a);
  //   };
  // })(battleMsg);
  

// document.querySelector("body > div.news-panel > div.news-content > div.news-for-you-section > div.section-content > div")
// document.querySelector("body > div.news-panel > div.news-content > div.news-for-you-section > div.section-content > div > div.news-classic-tile.promo-tile-id-9962480.is-used") klasa isused po  odebraniu
//  _g("promotions&a=use&id=" + t)



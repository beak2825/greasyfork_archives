// ==UserScript==
// @name    Xthor Autobuy Shout
// @match   http*://xthor.tk/shout*.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at document-end
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @connect     *
// @version 0.0.2.9
// @description Ce script ne fait rien
// @namespace https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/393008/Xthor%20Autobuy%20Shout.user.js
// @updateURL https://update.greasyfork.org/scripts/393008/Xthor%20Autobuy%20Shout.meta.js
// ==/UserScript==


var DEMO_MODE = true;

// permet de forcer le script a fonctionner
// Peut importe si un autre utilisateur l'utilise
// ou si il tombe en timeout
var FORCE_SCRIPT = false;

var PRIX_MAX_ACHAT = 75000;
var PRIX_MAX_ACHAT_NEO = 150000;

var MIN_WAIT_NEW = 0.5;
var MAX_WAIT_NEW = 1.5;
var MIN_WAIT_INIT = 2;
var MAX_WAIT_INIT = 5;
var TEMPS_ENTRE_VERIF = 2; //minutes
var TEMPS_TIMEOUT = 30; //mintutes

var URL_CHECK = "http://95.211.81.106:12345/potato/"

var HEADER_LOG = "AUTO_BUY: "
var MAX_ACHAT_INIT = 3;

var RATIO_iXTHOR = 1/2;


var sectionFilter = {
  "118" : 537600,   // Films/2160p/Bluray
  "119" : 537600,   // Films/2160p/Remux
  "107" : 537600,   // Films/2160p/x265
  "1"   : 537600,   // Films/1080p/BluRay
  "2"   : 537600,   // Films/1080p/Remux
  "100" : 537600,   // Films/1080p/x265
  "4"   : 537600,   // Films/1080p/x264
  "5"   : 268800,   // Films/720p/x264
  "7"   : 134400,   // Films/SD/x264
  "8"   : 134400,   // Films/DVD
  "6"   : 134400,   // Films/XviD
  "3"   : 134400,   // Films/3D
  "122" : 134400,   // Films/HDTV
  "94"  : 134400,   // Films/WEBDL
  "95"  : 134400,   // Films/WEBRiP
  "12"  : 134400,   // Films/Documentaire
  "125" : 134400,   // Films/Sports
  "33"  : 134400,   // Films/Spectacle
  "31"  : 134400,   // Films/Animation
  "20"  : 134400,   // Films/Concerts/Clips
  "9"   : 134400,   // Films/VOSTFR
  "104" : 268800,   // Séries/BluRay
  "13"  : 268800,   // Séries/Pack VF
  "15"  : 134400,   // Séries/HD VF
  "14"  : 67200,    // Séries/SD VF
  "98"  : 268800,   // Séries/Pack VOSTFR
  "17"  : 67200,    // Séries/HD VOSTFR
  "16"  : 67200,    // Séries/SD VOSTFR
  "101" : 268800,   // Séries/Packs Anime
  "32"  : 134400,   // Séries/Animes
  "110" : 67200,    // Séries/Anime VOSTFR
  "123" : 134400,   // Séries/Animation
  "109" : 134400,   // Séries/DOC
  "34"  : 134400,   // Séries/Sport
  "30"  : 134400,   // Séries/Emission TV
  "97"  : 0,        // Musique/FLAC
  "24"  : 67200,    // Livres/Romans
  "124" : 67200,    // Livres/Audio Books
  "96"  : 67200,    // Livres/Magazines
  "99"  : 67200,    // Livres/Bandes dessinées
  "116" : 67200,    // Livres/Romans Jeunesse
  "102" : 67200,    // Livres/Comics
  "103" : 67200,    // Livres/Mangas
  "25"  : 67200,    // Logiciels/Jeux PC
  "27"  : 67200,    // Logiciels/Playstation
  "111" : 67200,    // Logiciels/Jeux MAC
  "112" : 67200,    // Logiciels/Jeux Linux
  "26"  : 67200,    // Logiciels/XboX
  "28"  : 67200,    // Logiciels/Nintendo
  "29"  : 67200,    // Logiciels/NDS
  "117" : 67200,    // Logiciels/ROM
  "21"  : 67200,    // Logiciels/Applis PC
  "22"  : 67200,    // Logiciels/Applis Mac
  "23"  : 67200,    // Logiciels/Smartphone
  "36"  : 67200,    // XxX/Films
  "105" : 67200,    // XxX/Séries
  "114" : 67200,    // XxX/Lesbiennes
  "115" : 67200,    // XxX/Gays
  "113" : 67200,    // XxX/Hentai
  "120" : 67200,    // XxX/Magazines
  "106" : 0,        // Staff/Pending
};


var regexFilter = {
  // Séries/Pack VF
  "13":{
    "720p\.(.*)\.(X|x|h|H)264-FRATERNiTY"                             : 1175200, // Séries/Pack VF en 720p de FRATERNiTY
    "1080p\.(.*)\.(X|x|h|H)264-FRATERNiTY"                            : 1175200, // Séries/Pack VF en 1080p de FRATERNiTY
    "^(?!.*\b1080p\b)(?!.*\b720p\b).*\.(.*)\.(X|x|h|H)264-FRATERNiTY" : 537600,  // Séries/Pack VF en SD de FRATERNiTY
    "720p\.(.*)\.(X|x|h|H)264-NEO"                                    : 1175200, // Séries/Pack VF en 720p de NEO
    "1080p\.(.*)\.(X|x|h|H)264-NEO"                                   : 1175200, // Séries/Pack VF en 1080p de NEO
    "^(?!.*\b1080p\b)(?!.*\b720p\b).*\.(.*)\.(X|x|h|H)264-NEO"        : 537600,  // Séries/Pack VF en SD de NEO
  },

  // Séries/Pack VOSTFR
  "98":{
    "720p\.(.*)\.(X|x|h|H)264-FRATERNiTY"                             : 1175200, // Séries/Pack VOSTFR en 720p de FRATERNiTY
    "1080p\.(.*)\.(X|x|h|H)264-FRATERNiTY"                            : 1175200, // Séries/Pack VOSTFR en 1080p de FRATERNiTY
    "^(?!.*\b1080p\b)(?!.*\b720p\b).*\.(.*)\.(X|x|h|H)264-FRATERNiTY" : 537600,  // Séries/Pack VOSTFR en SD de FRATERNiTY
  },

  // Films/1080p/x264
  "4":{
    "(.*)\.(X|x|h|H)264-NEO"                                          : 1175200, // Films/1080p/x264 de NEO
  },

  // Films/720p/x264
  "5":{
    "(.*)\.(X|x|h|H)264-NEO"                                          : 1175200, // Films/720p/x264 de NEO
  },

  // Films/SD/x264
  "7":{
    "(.*)\.(X|x|h|H)264-NEO"                                          : 537600,  // Films/SD/x264 de NEO
  },

  // Films/WEBRiP
  "95":{
    "720p\.(.*)\.(X|x|h|H)264-NEO"                                    : 1175200, // Films/WEBRiP en 720p de NEO
    "1080p\.(.*)\.(X|x|h|H)264-NEO"                                   : 1175200, // Films/WEBRiP en 1080p de NEO
    "^(?!.*\b1080p\b)(?!.*\b720p\b).*\.(.*)\.(X|x|h|H)264-NEO"        : 537600,  // Films/WEBRiP en SD de NEO
  },
};


css_str = `
#control_panel_casino {
  position:fixed;
    top:230px;
    left:-180px;
    z-index: 999;
    padding: 0px;
    width:178px;
    background-color:#1f1f1f;
}

#control_label_casino {
    position:absolute;
    right:-32px;
    top:20px;
    width:29px;
    height:31px;
    }
#control_panel_aa {
  position:fixed;
    top:280px;
    left:-180px;
    z-index: 999;
    padding: 0px;
    width:178px;
    background-color:#1f1f1f;
}

#control_label_aa {
    position:absolute;
    right:-32px;
    top:20px;
    width:29px;
    height:31px;
}
`;
var MonPseudo = "INCONNU";
var script_allow = false;
var script_timeout = false;
var script_init = true;
var current_user = "INCONNU";
var regexPrice = /^\d?\d?\d (\d{3} )*\$$/gm;
var timeout_warn = null;
var timeout_off = null;
GM_addStyle(css_str);

function parseHtml(html) {

  // replace html, head and body tag with html_temp, head_temp and body_temp
  html = html.replace(/<!DOCTYPE HTML>/i, '<doctype></doctype>');
  html = html.replace(/(<\/?(?:html)|<\/?(?:head)|<\/?(?:body))/ig, '$1_temp');

  // wrap the dom into a <container>: the html() function returns only the contents of an element
  html = "<container>"+html+"</container>";
  var element = $(html); // parse the html

  return element;
}

var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function() {
  if (!this._hooked) {
    this._hooked = true;
    setupHook(this);
  }
  rawOpen.apply(this, arguments);
};

function getRandomFloat(min, max) {
  return (Math.random() * (min - max) + max).toFixed(4)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min
}

function convertBackToHtml(element) {

  // reset the initial changes (_temp)
  var extended_html = element.html();
  extended_html = extended_html.replace(/<doctype><\/doctype>/, '<!DOCTYPE HTML>');
  extended_html = extended_html.replace(/(<\/?html)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?head)_temp/ig, '$1');
  extended_html = extended_html.replace(/(<\/?body)_temp/ig, '$1');

  // replace all &quot; inside data-something=""
  while(extended_html.match(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g)) {
    extended_html = extended_html.replace(/(<.*?\sdata.*?=".*?)(&quot;)(.*?".*?>)/g, "$1'$3");
  }

  return extended_html;
}

function timeoutok(){
  $("#timeout_ok").show()
  $("#timeout_warn").hide()
  $("#timeout_off").hide()
}

function timeoutwarn(){
  $("#timeout_ok").hide()
  $("#timeout_warn").show()
  $("#timeout_off").hide()
}

function timeoutoff(){
  $("#timeout_ok").hide()
  $("#timeout_warn").hide()
  $("#timeout_off").show()
}

function scripton(){
  $("#scrit-off").hide()
  $("#scrit-on").show()
}

function scriptoff(){
  $("#scrit-off").show()
  $("#scrit-on").hide()
  $('#scrit-off').prop('title', current_user);
}

function buyTorrent(urlBuy){
    if (DEMO_MODE==false)
        $.get(urlBuy);
}

function setupHook(xhr) {
  function getter() {
    //console.log(HEADER_LOG+'get responseText');

    delete xhr.responseText;


    var ret = xhr.responseText;

    var doc = parseHtml(ret);
    if((script_allow==true && script_timeout==false) || FORCE_SCRIPT==true)
    {
        let nb_achat = 0;
        let max_achat = getRandomInt(1,MAX_ACHAT_INIT);
        doc.find("tr").each(function() {
            if (nb_achat<max_achat)
            {
                var ListTd = $( this ).find('td');
                var ListBaliseI = $(this).find('i');
                if (ListBaliseI.length>0)
                {
                    var FirstBaliseI=ListBaliseI[0];
                    var ValueAttributeClass = FirstBaliseI.getAttribute("class");
                    if (ValueAttributeClass)
                    {
                        if (ValueAttributeClass.indexOf("fa-globe")!=-1)
                        {
                            ListBaliseI =  $(this).find('i');
                            if (ListBaliseI.length>0)
                            {
                                let isAnnonce = false;
                                let name = "";
                                let isOtherGang = true;
                                let urlBuy = "";
                                let cat = "";
                                let price = 0;
                                for (var i = 0; i < ListBaliseI.length; i++)
                                {
                                    if (ListBaliseI[i].getAttribute("class") && ListBaliseI[i].getAttribute("class").indexOf("fa-download")!== -1)
                                    {
                                        //console.log(HEADER_LOG+"ANNONCE");
                                        isAnnonce=true;
                                    }
                                    else
                                    {
                                        textBalise = ListBaliseI[i].textContent;
                                        if (regexPrice.test(textBalise))
                                        {
                                            price = parseInt(textBalise.replace("$","").replace(/ /g,''))
                                        }
                                    }
                                }
                                if (isAnnonce)
                                {
                                    var ListBaliseA = $(this).find('a');
                                    if (ListBaliseA.length>0)
                                    {
                                        for (i = 0; i < ListBaliseA.length; i++)
                                        {
                                            if (ListBaliseA[i].getAttribute("href") && ListBaliseA[i].getAttribute("href").indexOf("https://xthor.tk/gang.php?id=12")!== -1)
                                            {
                                                isOtherGang=false;
                                            }
                                            if (ListBaliseA[i].getAttribute("href") && ListBaliseA[i].getAttribute("href").indexOf("https://xthor.tk/gang.php?tid=")!== -1)
                                            {
                                                urlBuy=ListBaliseA[i].getAttribute("href");
                                            }
                                            if (ListBaliseA[i].getAttribute("href") && ListBaliseA[i].getAttribute("href").indexOf("https://xthor.tk/browse.php?cat=")!== -1)
                                            {
                                                cat=ListBaliseA[i].getAttribute("href").replace("https://xthor.tk/browse.php?cat=","");
                                            }
                                            if (ListBaliseA[i].getAttribute("href") && ListBaliseA[i].getAttribute("href").indexOf("https://xthor.tk/details.php?id=")!== -1)
                                            {
                                                name=ListBaliseA[i].textContent;
                                            }
                                        }
                                    }

                                    if (cat in sectionFilter)
                                    {
                                        if (isOtherGang==true && name.endsWith("-iXTHOR") && price <= sectionFilter[cat]*RATIO_iXTHOR) //iXTHOR
                                        {
                                                let wait_time = 0;
                                                if(price < 9000)
                                                {
                                                    wait_time = getRandomFloat(MIN_WAIT_NEW,MAX_WAIT_NEW);
                                                    console.log(HEADER_LOG+"TEMPORISATION iXTHOR NEW de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                                }
                                                else
                                                {
                                                    wait_time = getRandomFloat(MIN_WAIT_NEW,MAX_WAIT_NEW);
                                                    console.log(HEADER_LOG+"TEMPORISATION iXTHOR NORMAL de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                                }

                                                setTimeout(function() {
                                                    buyTorrent(urlBuy);
                                                    console.log(HEADER_LOG+"TENTATIVE d'achat de "+name);
                                                }, wait_time*1000);
                                                nb_achat++;
                                                //console.log(HEADER_LOG+"nb_achat iXTHOR "+nb_achat);
                                        }
                                        else if (isOtherGang==true && urlBuy.length>0 && price <= sectionFilter[cat])
                                        {
                                            if(script_init)
                                            {
                                                let wait_time = getRandomFloat(MIN_WAIT_INIT,MAX_WAIT_INIT);
                                                console.log(HEADER_LOG+"TEMPORISATION INIT de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                                setTimeout(function() {
                                                    buyTorrent(urlBuy);
                                                    console.log(HEADER_LOG+"TENTATIVE d'achat de "+name);
                                                }, wait_time*1000);
                                                nb_achat++;
                                                //console.log(HEADER_LOG+"nb_achat INIT "+nb_achat);
                                            }
                                            else
                                            {
                                                let wait_time = 0;
                                                if(price < 9000)
                                                {
                                                    wait_time = getRandomFloat(MIN_WAIT_NEW,MAX_WAIT_NEW);
                                                    console.log(HEADER_LOG+"TEMPORISATION NEW de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                                }
                                                else
                                                {
                                                    wait_time = getRandomFloat(MIN_WAIT_NEW,MAX_WAIT_NEW);
                                                    console.log(HEADER_LOG+"TEMPORISATION NORMAL de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                                }
                                                setTimeout(function() {
                                                    buyTorrent(urlBuy);
                                                    console.log(HEADER_LOG+"TENTATIVE d'achat de "+name);
                                                }, wait_time*1000);
                                                nb_achat++;
                                                //console.log(HEADER_LOG+"nb_achat NORMAL "+nb_achat);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if ( nb_achat==0 && script_init==true)
        {
            console.log(HEADER_LOG+"PASSAGE EN MODE NORMAL");
            script_init = false;
        }
    }
      setup();
      var HTMLCustom =  convertBackToHtml(doc);

      return HTMLCustom;
  }

    function setter(str) {
        console.log(HEADER_LOG+'set responseText: %s', str);
    }

    function setup() {
        Object.defineProperty(xhr, 'responseText', {
            get: getter,
            set: setter,
            configurable: true
        });
    }

    setup();
}

function checkUser() {
    if (script_timeout==false)
    {
        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        URL_CHECK+MonPseudo,
            onload:     function (responseDetails) {
                if(responseDetails.responseText.toLowerCase().indexOf("success")!== -1)
                {
                    script_allow=true;
                    console.log(HEADER_LOG+'Script autorisé');
                    current_user = MonPseudo;
                    scripton();
                }
                else
                {
                    script_allow=false;
                    console.log(HEADER_LOG+"Return auth: "+responseDetails.responseText);
                    current_user = responseDetails.responseText;
                    scriptoff();
                }
            },
            ontimeout: function (responseDetails) {
                script_allow=false;
                current_user = "SERVEUR OFF !!!"
                scriptoff();
            }
        });
    }
}



if (window.top === window.self) {
    var control_panel = $('#control_panel');
        $(` <div id="control_panel_casino" class="" style="left: -180px;">
               <a id="control_label_casino" >
                  <i id="scrit-on" class="fa fa-check" style="font-size:30px;color:green"></i>
                  <i id="scrit-off" class="fa fa-ban" style="font-size:30px;color:red"></i>
               </a>
            </div>
        `).insertBefore(control_panel);
        $(` <div id="control_panel_aa" class="" style="left: -180px;">
               <a id="control_label_aa" >
                  <i id="timeout_ok" class="fa fa-clock-o" title="Plus de 5 minutes" style="font-size:30px;color:green; display: none;"></i>
                  <i id="timeout_warn" class="fa fa-clock-o" title="Moins de 5 minutes" style="font-size:30px;color:orange; display: none;"></i>
                  <i id="timeout_off" class="fa fa-clock-o" title="Fini" style="font-size:30px;color:red; display: none;"></i>
               </a>
            </div>
        `).insertBefore(control_panel);
}
function relance_timeout(){
    clearTimeout(timeout_warn);
    clearTimeout(timeout_off);
    start_timeout();
    script_timeout=false;
    checkUser();
    console.log(HEADER_LOG+'Timeout relancé');
}
function start_timeout()
{
    timeout_warn = setTimeout(function() {
        console.log(HEADER_LOG+'WARN TIMEOUT');
        timeoutwarn();
    }, TEMPS_TIMEOUT*60*1000 - 5*60*1000);
    timeout_off = setTimeout(function() {
        script_timeout=true;
        console.log(HEADER_LOG+'TIMEOUT SCRIPT');
        scriptoff();
        timeoutoff();
    }, TEMPS_TIMEOUT*60*1000);
    timeoutok();
}

scriptoff();

MonPseudo = $('#stmb > span.navmenu.userTravel > span:nth-child(1) > a > span > b').text();
checkUser();
setInterval(checkUser, TEMPS_ENTRE_VERIF*60*1000);


setTimeout(function() {
    start_timeout();
}, 5*1000);

$( "#timeout_ok" ).click(function() {
  relance_timeout();
});

$( "#timeout_warn" ).click(function() {
  relance_timeout();
});

$( "#timeout_off" ).click(function() {
  relance_timeout();
});

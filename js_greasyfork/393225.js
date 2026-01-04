// ==UserScript==
// @name    Xthor Autobuy Shout MOBILE
// @match   http*://xthor.tk/shout*.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at document-end
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @connect     *
// @version 0.0.2.1
// @description Ce script ne fait rien
// @namespace https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/393225/Xthor%20Autobuy%20Shout%20MOBILE.user.js
// @updateURL https://update.greasyfork.org/scripts/393225/Xthor%20Autobuy%20Shout%20MOBILE.meta.js
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

var TEMPS_ENTRE_VERIF = 2; //minutes
var TEMPS_TIMEOUT = 30; //mintutes

var URL_CHECK = "http://95.211.81.106:12345/potato/"

var HEADER_LOG = "AUTO_BUY: "



var sectionFilter = {
  "118" : 134400,   // Films/2160p/Bluray
  "119" : 134400,   // Films/2160p/Remux
  "107" : 134400,   // Films/2160p/x265
  "1"   : 134400,   // Films/1080p/BluRay
  "2"   : 134400,   // Films/1080p/Remux
  "100" : 134400,   // Films/1080p/x265
  "4"   : 134400,   // Films/1080p/x264
  "5"   : 134400,   // Films/720p/x264
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
  "104" : 134400,   // Séries/BluRay
  "13"  : 134400,   // Séries/Pack VF
  "15"  : 134400,   // Séries/HD VF
  "14"  : 134400,   // Séries/SD VF
  "98"  : 134400,   // Séries/Pack VOSTFR
  "17"  : 134400,   // Séries/HD VOSTFR
  "16"  : 134400,   // Séries/SD VOSTFR
  "101" : 134400,   // Séries/Packs Anime
  "32"  : 134400,   // Séries/Animes
  "110" : 134400,   // Séries/Anime VOSTFR
  "123" : 134400,   // Séries/Animation
  "109" : 134400,   // Séries/DOC
  "34"  : 134400,   // Séries/Sport
  "30"  : 134400,   // Séries/Emission TV
  "97"  : 0,        // Musique/FLAC
  "24"  : 67200,    // Livres/Romans
  "124" : 134400,   // Livres/Audio Books
  "96"  : 67200,    // Livres/Magazines
  "99"  : 134400,   // Livres/Bandes dessinées
  "116" : 67200,    // Livres/Romans Jeunesse
  "102" : 134400,   // Livres/Comics
  "103" : 134400,   // Livres/Mangas
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
`;




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


function scripton(){
  $("#scrit-off").hide()
  $("#scrit-on").show()
}

function scriptoff(){
  $("#scrit-off").show()
  $("#scrit-on").hide()
}

function buyTorrent(urlBuy){
    if (DEMO_MODE==false)
        $.get(urlBuy);
}

var MonPseudo = "INCONNU";
var script_allow = false;
var script_timeout = false;
var regexPrice = /^\d?\d?\d (\d{3} )*\$$/gm;

function setupHook(xhr) {
  function getter() {
    //console.log(HEADER_LOG+'get responseText');

    delete xhr.responseText;


    var ret = xhr.responseText;

    var doc = parseHtml(ret);
    if((script_allow==true && script_timeout==false) || FORCE_SCRIPT==true)
    {
        doc.find("tr").each(function() {
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
                               /* if (isOtherGang==true && name.endsWith("-NEO"))
                                {
                                    if(price>9000 && price < PRIX_MAX_ACHAT_NEO)
                                    {
                                        $.get(urlBuy);
                                        console.log(HEADER_LOG+"TENTATIVE d'achat (NEO) de "+name+" a "+price+ " $ " + urlBuy);
                                    }
                                }
                                else */ if (cat in sectionFilter)
                                {
                                    if (isOtherGang==true && urlBuy.length>0 && price <= sectionFilter[cat])
                                    {
                                        if(price < 9000)
                                        {
                                            wait_time = getRandomFloat(MIN_WAIT_NEW,MAX_WAIT_NEW);
                                            console.log(HEADER_LOG+"TEMPORISATION de "+wait_time+" pour l'achat de "+name+" " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                            setTimeout(function() {
                                                buyTorrent(urlBuy);
                                                console.log(HEADER_LOG+"TENTATIVE d'achat de "+name);
                                            }, wait_time*1000);
                                        }
                                        else
                                        {
                                            buyTorrent(urlBuy);
                                            console.log(HEADER_LOG+"TENTATIVE d'achat de "+name+" a "+price+ " $ " + urlBuy +" (max "+sectionFilter[cat]+" )");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
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
        GM_xmlhttpRequest ( {
        method:     'GET',
        url:        URL_CHECK+MonPseudo,
        onload:     function (responseDetails) {
            if(responseDetails.responseText.toLowerCase().indexOf("success")!== -1)
            {
                script_allow=true;
                console.log(HEADER_LOG+'Script autorisé');

                setTimeout(function() {
                    script_timeout=true;
                    console.log(HEADER_LOG+'TIMEOUT SCRIPT');
                    scriptoff();
                }, TEMPS_TIMEOUT*60*1000);

                scripton();
            }
            else
            {
                script_allow=false;
                console.log(HEADER_LOG+"Return auth: "+responseDetails.responseText);
                scriptoff();
            }
        },
        ontimeout: function (responseDetails) {
            script_allow=false;
            scriptoff();
        }
      });
    }



if (window.top === window.self) {
    var control_panel = $('#control_panel');
        $(` <div id="control_panel_casino" class="" style="left: -180px;">
               <a id="control_label_casino" >
                  <i id="scrit-off" class="fa fa-ban" style="font-size:30px;color:red"></i>
                  <i id="scrit-on" class="fa fa-check" style="font-size:30px;color:green"></i>
               </a>

            </div>
        `).insertBefore(control_panel);

}

scriptoff();

MonPseudo = $('#stmb > span.navmenu.userTravel > span:nth-child(1) > a > span > b').text();
checkUser();
setInterval(checkUser, TEMPS_ENTRE_VERIF*60*1000);
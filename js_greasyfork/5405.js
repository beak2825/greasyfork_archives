// ==UserScript==
// @name                WME Street Check PL
// @namespace           
// @description         Skrypt umożliwia sprawdzenie brakujących ulic w miejscowościach.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             1.1.3
// @grant               none
// @copyright           2014 wlodek76
// @downloadURL https://update.greasyfork.org/scripts/5405/WME%20Street%20Check%20PL.user.js
// @updateURL https://update.greasyfork.org/scripts/5405/WME%20Street%20Check%20PL.meta.js
// ==/UserScript==

var wmech_version = "1.1.3"

var nazw = [
    "F. Adwenta",                   "Filipa Adwenta",
    "W. Andersa",                   "Władysława Andersa",
    "K. Arciszewskiego",            "Krzysztofa Arciszewskiego",
    "A. Asnyka",                    "Adama Asnyka",
    "K. K. Baczyńskiego",           "Krzysztofa Kamila Baczyńskiego",
    "T. Bairda",                    "Tadeusza Bairda",
    "W. Bartniaka",                 "Władysława Bartniaka",
    "J. Bema",                      "Józefa Bema",
    "M. Bojanka",                   "Mikołaja Bojanka",
    "M. Bojasińskiego",             "Michała Bojasińskiego",
    "M. Bołtucia",                  "Mikołaja Bołtucia",
    "T. Chałubińskiego",            "Tytusa Chałubińskiego",
    "J. Chełmońskiego",             "Józefa Chełmońskiego",
    "D. Chłapowskiego",             "Dezyderego Chłapowskiego",
    "J. Chłopickiego",              "Józefa Chłopickiego",
    "J. Chodkiewicza",              "Jana Chodkiewicza",
    "F. Chopina",                   "Fryderyka Chopina",
    "S. Czarnieckiego",             "Stefana Czarnieckiego",
    "H. Dąbrowskiego",              "Henryka Dąbrowskiego",
    "J. Dwernickiego",              "Józefa Dwernickiego",
    "A. Dygasińskiego",             "Adolfa Dygasińskiego",
    "J. Fałata",                    "Juliana Fałata",
    "C. Godebskiego",               "Cypriana Godebskiego",
    "A. Grottgera",                 "Artura Grottgera",
    "J. Hallera",                   "Józefa Hallera",
    "F. Hynka",                     "Franciszka Hynka",
    "J. Kasprowicza",               "Jana Kasprowicza",
    "J. Kilińskiego",               "Jana Kilińskiego",
    "F. Kleeberga",                 "Franciszka Kleeberga",
    "G. Knapskiego",                "Grzegorza Knapskiego",
    "J. Kochanowskiego",            "Jana Kochanowskiego",
    "H. Kołłątaja",                 "Hugona Kołłątaja",
    "M. Konopnickiej",              "Marii Konopnickiej",
    "M. Kopernika",                 "Mikołaja Kopernika",
    "W. Korfantego",                "Wojciecha Korfantego",
    "A. Kosińskiego",               "Amilkara Kosińskiego",
    "J. Kossaka",                   "Juliusza Kossaka",
    "T. Kościuszki",                "Tadeusza Kościuszki",
    "Z. Krasińskiego",              "Zygmunta Krasińskiego",
    "J. I. Kraszewskiego",          "Józefa Ignacego Kraszewskiego",
    "P. Krupińskiego",              "Piotra Krupińskiego",
    "M. Langiewicza",               "Mariana Langiewicza",
    "J. Lelewela",                  "Joachima Lelewela",
    "B. Limanowskiego",             "Bolesława Limanowskiego",
    "S. Maczka",                    "Stanisława Maczka",
    "T. Makowskiego",               "Tadeusza Makowskiego",
    "J. Malczewskiego",             "Jacka Malczewskiego",
    "J. Matejki",                   "Jana Matejki",
    "A. Mickiewicza",               "Adama Mickiewicza",
    "K. Mloska",                    "Krzysztofa Mloska",
    "S. Moniuszki",                 "Stanisława Moniuszki",
    "J. Montwiłła",                 "Józefa Montwiłła",
    "G. Narutowicza",               "Gabriela Narutowicza",
    "J. U. Niemcewicza",            "Juliana Ursyna Niemcewicza",
    "S. Okrzei",                    "Stefana Okrzei",
    "L. Okulickiego",               "Leopolda Okulickiego",
    "J. Ordona",                    "Juliusza Ordona",
    "W. Orkana",                    "Władysława Orkana",
    "E. Orzeszkowej",               "Elizy Orzeszkowej",
    "A. Osieckiej",                 "Agnieszki Osieckiej",
    "J. Ossolińskiego",             "Jerzego Ossolińskiego",
    "I. Paderewskiego",             "Ignacego Paderewskiego",
    "J. Piłsudskiego",              "Józefa Piłsudskiego",
    "E. Plater",                    "Emilii Plater",
    "ks. J. Poniatowskiego",        "Księcia Józefa Poniatowskiego",
    "J. Poniatowskiego",            "Józefa Poniatowskiego",
    "I. Prądzyńskiego",             "Ignacego Prądzyńskiego",
    "K. Pułaskiego",                "Kazimierza Pułaskiego",
    "M. Reja",                      "Mikołaja Reja",
    "S. Rembeka",                   "Stanisława Rembeka",
    "Wł. Reymonta",                 "Władysława Reymonta",
    "W. Reymonta",                  "Władysława Reymonta",
    "S. Roweckiego",                "Stefana Roweckiego",
    "H. Sienkiewicza",              "Henryka Sienkiewicza",
    "W. Sikorskiego",               "Władysława Sikorskiego",
    "H. Skarbka",                   "Henryka Skarbka",
    "P. Skargi",                    "Piotra Skargi",
    "M. Skłodowskiej-Curie",        "Marii Skłodowskiej-Curie",
    "J. Słowackiego",               "Juliusza Słowackiego",
    "M. Smorawińskiego",            "Mieczysława Smorawińskiego",
    "J. Sowińskiego",               "Józefa Sowińskiego",
    "S. Staszica",                  "Stanisława Staszica",
    "J. Sułkowskiego",              "Józefa Sułkowskiego",
    "W. Syrokomli",                 "Władysława Syrokomli",
    "H. Szczerkowskiego",           "Hipolita Szczerkowskiego",
    "J. Szpakowskiego",             "Jerzego Szpakowskiego",
    "L. Teligi",                    "Leonida Teligi",
    "M. Tokarzewskiego",            "Mariana Tokarzewskiego",
    "R. Traugutta",                 "Romualda Traugutta",
    "J. N. Umińskiego",             "Jana Nepomucena Umińskiego",
    "L. Waryńskiego",               "Ludwika Waryńskiego",
    "W. Westfala",                  "Witolda Westfala",
    "F. Wielopolskiego",            "Franciszka Wielopolskiego",
    "P. Wysockiego",                "Piotra Wysockiego",
    "S. Wyspiańskiego",             "Stanisława Wyspiańskiego",
    "J. Zamoyskiego",               "Jana Zamoyskiego",
    "L. Zondka",                    "Lecha Zondka",
    "S. Żeromskiego",               "Stefana Żeromskiego",
    "S. Żółkiewskiego",             "Stanisława Żółkiewskiego",
    "M. Krakowa",                   "Miasta Krakowa"
];

var testedstreetID = new Array();
var loadcount = 0;

//---------------------------------------------------------------------------------------
function bootstrapStreetCheck()
{
    var bGreasemonkeyServiceDefined = false;
    
    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }
    
    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    
    /* begin running the code! */
    setInterval(StreetCheck, 500);

	window.addEventListener("beforeunload", saveStreetCheckList, false);
}
//---------------------------------------------------------------------------------------
function saveStreetCheckList()
{
    var elemid = document.getElementById('street_check_layer');
    if (elemid != null) {
        var obj1  = document.getElementById('street_check_layer_town');
        var obj2  = document.getElementById('street_check_layer_content');
        var obj4  = document.getElementById('street_check_layer_inne');
        var town  		= obj1.value;
        var str   		= obj2.value;
        var diffmode	= obj4.checked;
        
        localStorage.setItem("StreetCheckPLContent1", town);
        localStorage.setItem("StreetCheckPLContent2", str);
        localStorage.setItem("StreetCheckPLContent4", diffmode);
	}
}
//---------------------------------------------------------------------------------------
function skroty(s)
{
    if (!s) return;
    
    s = s.trim();
    
    s = s.replace("Aleja ",                         "al. ");
    s = s.replace("Aleje ",                         "al. ");
    s = s.replace("Arcybiskupa ",                   "abp. ");
    s = s.replace("Admirała ",                      "adm. ");
    s = s.replace("Biskupa ",                       "bp. ");
    s = s.replace("Błogosławionego ",               "bł. ");
    s = s.replace("Bulwar ",                        "bulw. ");
    s = s.replace("Doktora ",                       "dr. ");
    s = s.replace("Generała Brygady Pilotów ",      "gen. pil. ");
    s = s.replace("Generała Brygady ",              "gen. bryg. ");
    s = s.replace("Generała Dywizji ",              "gen. dyw. ");
    s = s.replace("Generała ",                      "gen. ");
    s = s.replace("Hetmana ",                       "hetm. ");
    s = s.replace("imienia ",                       "im. ");
    s = s.replace("Inżyniera ",                     "inż. ");
    s = s.replace("Kanclerza ",                     "kanc. ");
    s = s.replace("Kardynała ",                     "kard. ");
    s = s.replace("Kapitana ",                      "kpt. ");
    s = s.replace("Księdza ",                       "ks. ");
    s = s.replace("Majora ",                        "mjr. ");
    s = s.replace("Marszałka ",                     "marsz. ");
    s = s.replace("Ojca ",                          "o. ");
    s = s.replace("Osiedle ",                       "os. ");
    s = s.replace("osiedle ",                       "os. ");
    s = s.replace("Plac ",                          "pl. ");
    s = s.replace("Profesora ",                     "prof. ");
    s = s.replace("Prezydenta ",                    "prez. ");
    s = s.replace("Podpułkownika ",                 "ppłk. ");
    s = s.replace("Pułkownika ",                    "płk. ");
    s = s.replace("Roku ",                          "r. ");
    s = s.replace("roku ",                          "r. ");
    s = s.replace("Rotmistrza ",                    "rtm. ");
    s = s.replace("Świętego ",                      "św. ");
    s = s.replace("Świętej ",                       "św. ");
    s = s.replace("Świętych ",                      "św. ");
    
    s = s.replace("mjr ",                           "mjr. ");
    s = s.replace("ppłk ",                          "ppłk. ");
    s = s.replace("płk ",                           "płk. ");
    s = s.replace("abpa ",                          "abp. ");
    s = s.replace("Kanc. ",                         "kanc. ");
    s = s.replace("śwj. ",                          "św. ");
    s = s.replace("śś. ",                           "św. ");
    
    s = s.replace("al. al.",                        "al.");
    s = s.replace("pl. pl.",                        "pl.");
    s = s.replace("os. os.",                        "os.");
    s = s.replace("św. św.",                        "św.");
    s = s.replace("Rondo Rondo",                    "Rondo");
    s = s.replace("Rynek Rynek",                    "Rynek");
    s = s.replace("Ogród Ogród",                    "Ogród");
    s = s.replace("Zamek Zamek",                    "Zamek");
    s = s.replace("Bulwar Bulwar",                  "Bulwar");
    
    s = s.replace("Droga Do",                       "Droga do");
    
    return s;
}
//---------------------------------------------------------------------------------------
function imiona(s)
{
    if (!s) return;
    
    for(var i=0; i<nazw.length; i+=2) {
        s = s.replace( nazw[i], nazw[i+1] );
    }
    
    return s;
}
//---------------------------------------------------------------------------------------
function getId(node) {
  return document.getElementById(node);
}
//---------------------------------------------------------------------------------------
function StreetCheck()
{
    var elemid = document.getElementById('street_check_layer');
    
    if(elemid == null) {
        
        var cnt = '';
        cnt += '<br><div id="street_check_layer" style="color:#000000; xborder: 1px solid red; width: 280px; ">';
        cnt += '<b title="Wersja ' + wmech_version + '">Street Check PL:</b>';
        cnt += '<br>Miejscowość:';
        cnt += '<div style="float:right;"><input id="street_check_layer_inne" type="checkbox" name="" value="" title="Skanuje odwrotnie w poszukiwaniu nazw ulic na mapie nie będących na liście." >Inne&nbsp;</div>';
        cnt += '<br><input        id="street_check_layer_town"        style="width:280px; clear:both; " >';
        cnt += '<br><textarea                     id="street_check_layer_content"     style="min-width:280px; max-width:280px; width:280px; min-height:185px; max-height: 450px; white-space: nowrap; " ';
        cnt += 'placeholder="Wklej listę ulic tutaj" ></textarea>';
        cnt += '<p id="street_check_layer_count">&nbsp;</p>';
        cnt += '<br>';
        cnt += '</div>';
        
        $("#sidepanel-areas").append(cnt);
        
        return;
    }
    
    var obj1 = document.getElementById('street_check_layer_town');
    var obj2 = document.getElementById('street_check_layer_content');
    var obj3 = document.getElementById('street_check_layer_count');
    var obj4 = document.getElementById('street_check_layer_inne');
    
    if (loadcount == 0) {
        loadcount++;
        if (localStorage.StreetCheckPLContent1) 			obj1.value   = localStorage.StreetCheckPLContent1;
        if (localStorage.StreetCheckPLContent2) 			obj2.value   = localStorage.StreetCheckPLContent2;
        if (localStorage.StreetCheckPLContent4 == "false")	obj4.checked = false;
        if (localStorage.StreetCheckPLContent4 == "true")	obj4.checked = true;
    }
    
    var town 		= obj1.value;
    var str  		= obj2.value;
    var diffmode  	= obj4.checked;

    if (obj1.offsetParent == null) return;
    if (obj2.offsetParent == null) return;

    var lines = new Array();
    if (str.length > 0) lines = str.split("\n");
    
    if (lines.length) obj3.innerHTML = "Pozostało ulic: " + lines.length;
    else              obj3.innerHTML = "";
    
    town = town.trim();
    
    if (town == "") {
        
        while(testedstreetID.length > 0) testedstreetID.pop();
        
        var newstr = "";
        var cleared = 0;
        
        var i = 0;
        while (i < lines.length) {
            var p = lines[i].indexOf("(!)");
            if (p >= 0) {
                lines.splice(i, 1);
                cleared = 1;
                continue;
            }
            
            newstr += lines[i] + '\n';
            
            i++;
        }
        
        if (cleared) {
            var len = newstr.length;
            if ( len>0 && newstr[len-1] == '\n' ) newstr = newstr.substr(0, len - 1);
            obj2.value = newstr;
        }
        
        return;
    }

    var sortlines = new Array();

    var i = -1;
    while (++i < lines.length) {
        
        var p = lines[i].indexOf("(!)");
        if (p >= 0) {
            sortlines.push(lines[i]);
            lines.splice(i, 1);
            i--;
            continue;
        }
        
        lines[i] = lines[i].replace('\"',         '');
        
        var p = lines[i].indexOf("ul. ");          if (p >= 0) { lines[i] = lines[i].substr(p + 4); continue; }
        var p = lines[i].indexOf("inne ");         if (p >= 0) { lines[i] = lines[i].substr(p + 5); continue; }
        var p = lines[i].indexOf("ulica ");        if (p >= 0) { lines[i] = lines[i].substr(p + 6); continue; }
        
        var p = lines[i].indexOf("os. ");          if (p >= 0) { lines[i] = lines[i].substr(p); continue; }
        var p = lines[i].indexOf("al. ");          if (p >= 0) { lines[i] = lines[i].substr(p); continue; }
        var p = lines[i].indexOf("pl. ");          if (p >= 0) { lines[i] = lines[i].substr(p); continue; }
        var p = lines[i].indexOf("o. ");           if (p >= 0) { lines[i] = lines[i].substr(p); continue; }
        var p = lines[i].indexOf("droga ");        if (p >= 0) { lines[i] = "Droga "  + lines[i].substr(p + 6); continue; }
        var p = lines[i].indexOf("bulw. ");        if (p >= 0) { lines[i] = "Bulwar " + lines[i].substr(p + 6); continue; }
        
        var p = lines[i].indexOf("rondo ");        if (p >= 0) { lines[i] = "Rondo "  + lines[i].substr(p + 6); continue; }
        var p = lines[i].indexOf("skwer ");        if (p >= 0) { lines[i] = "Skwer "  + lines[i].substr(p + 6); continue; }
        var p = lines[i].indexOf("rynek ");        if (p >= 0) { lines[i] = "Rynek "  + lines[i].substr(p + 6); continue; }
        var p = lines[i].indexOf("park ");         if (p >= 0) { lines[i] = "Park "   + lines[i].substr(p + 5); continue; }
        var p = lines[i].indexOf("most ");         if (p >= 0) { lines[i] = "Most "   + lines[i].substr(p + 5); continue; }
        var p = lines[i].indexOf("zamek ");        if (p >= 0) { lines[i] = "Zamek "  + lines[i].substr(p + 6); continue; }
        var p = lines[i].indexOf("ogród ");        if (p >= 0) { lines[i] = "Ogród "  + lines[i].substr(p + 6); continue; }
    }
    
    var templines = lines.slice();
    
    var i = 0;
    while (i < lines.length) {
        
        var p = -1;
        if (p < 0) var p = lines[i].indexOf("Rondo ");
        if (p < 0) var p = lines[i].indexOf("Park ");
        if (p < 0) var p = lines[i].indexOf("Skwer ");
        if (p < 0) var p = lines[i].indexOf("Most ");
        if (p < 0) var p = lines[i].indexOf("Zamek ");
        if (p < 0) var p = lines[i].indexOf("Ogród ");
        
        if (p >= 0) {
            lines.splice(i, 1);
            templines.splice(i, 1);
            continue;
        }
        
        i++;
    }
    
    
    for(var i=0; i<lines.length; i++) {
        lines[i]             = skroty(lines[i]);
        lines[i]             = imiona(lines[i]);
    }
    
    var error = 0;
    
    for (var iseg in Waze.model.segments.objects) {
        var segment     = Waze.model.segments.get(iseg);
        var attributes  = segment.attributes;
        var sid         = attributes.primaryStreetID;
        var numAlts     = attributes.streetIDs.length;
        var line        = getId(segment.geometry.id);
        
        if (line !== null && sid !== null) {
            var streetmodel = Waze.model.streets.get(sid);
            
            if (streetmodel != undefined) {
                var cityID = streetmodel.cityID;
                var citymodel = Waze.model.cities.get(cityID);
                var city = citymodel.name;
                var street = streetmodel.name;
                
                var added = new Array();
                var found = 0;
                
                if (city == town && street !== null) {
                    added.push(sid);
                    added.push(street);
                    street = skroty(street);
                    
                    found |= 1;
                    
                    var p = testedstreetID.indexOf(sid);
                    if (p >= 0) found |= 2;

                    var p = lines.indexOf( street );
                    if (p >= 0) {
                        lines.splice(p, 1);
                        templines.splice(p, 1);
                        found |= 2;
                    }
                }
                    
                if (numAlts) {
                    for(var j=0; j<attributes.streetIDs.length; j++) {
                        var sid = attributes.streetIDs[j];
                        
                        if (sid !== null) {
            				var streetmodel = Waze.model.streets.get(sid);
                            
                            if (streetmodel != undefined) {
                                var cityID = streetmodel.cityID;
                                var citymodel = Waze.model.cities.get(cityID);
                                var city = citymodel.name;
                                var street = streetmodel.name;
                                
                                if (city == town && street !== null) {
                    				added.push(sid);
                    				added.push(street);
                    				street = skroty(street);
                                    
                                    found |= 1;
                                    
                                    var p = testedstreetID.indexOf(sid);
                                    if (p >= 0) found |= 2;

                                    var p = lines.indexOf( street );
                                    if (p >= 0) {
                                        lines.splice(p, 1);
                                        templines.splice(p, 1);
                                        found |= 2;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (found && diffmode) {
                    for(var k=0; k<added.length; k+=2) {
                        var sid    = added[k+0];
                        var street = added[k+1];
                        
                        var q = testedstreetID.indexOf(sid);
                        if (q < 0) testedstreetID.push(sid);
    
                        if (found == 3) {
                        }
                        else {
                            var s = "(!) " + street;
                            var q = sortlines.indexOf(s);
                            if (q < 0) sortlines.push( "(!) " + street );
                        }
                    }
                }

                while (added.length > 0) added.pop();
            }
        }
    }

    obj3.innerHTML = 'Pozostało ulic: ' + lines.length + '';
    if (sortlines.length == 1) obj3.innerHTML += ' <span style="color:#c0c0c0">+ ' + sortlines.length + ' inna</span>';
    if (sortlines.length == 2) obj3.innerHTML += ' <span style="color:#c0c0c0">+ ' + sortlines.length + ' inne</span>';
    if (sortlines.length == 3) obj3.innerHTML += ' <span style="color:#c0c0c0">+ ' + sortlines.length + ' inne</span>';
    if (sortlines.length == 4) obj3.innerHTML += ' <span style="color:#c0c0c0">+ ' + sortlines.length + ' inne</span>';
    if (sortlines.length >= 5) obj3.innerHTML += ' <span style="color:#c0c0c0">+ ' + sortlines.length + ' innych</span>';
    
    var newstr = '';
    
    sortlines = sortlines.sort();

    for(var i = 0; i < templines.length; i++) {
        newstr += templines[i] + '\n';
    }
    
    for(var i = 0; i < sortlines.length; i++) {
        newstr += sortlines[i] + '\n';
    }

    var len = newstr.length;
    if ( len>0 && newstr[len-1] == '\n' ) newstr = newstr.substr(0, len - 1);

    obj2.value = newstr;
    
}
//---------------------------------------------------------------------------------------
bootstrapStreetCheck();
// ==UserScript==
// @name         "Add artist" enhancements~w
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Includes several highly requested features, such as auto "show/hide" bandmember/member of field, dropdown regions, sorting DRAs, autoformat band members, extra alerts
// @author       mapple
// @match        https://rateyourmusic.com/artist/profile_ac*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/411256/%22Add%20artist%22%20enhancements~w.user.js
// @updateURL https://update.greasyfork.org/scripts/411256/%22Add%20artist%22%20enhancements~w.meta.js
// ==/UserScript==
(function(){
     'use strict';


//-------------
// if group, disable member of, if person, disable band member
//-------------

    //init
if (document.querySelectorAll("select")[0].selectedIndex==0){
       document.querySelectorAll("tr")[18].style.display = "none"}//band members
if (document.querySelectorAll("select")[0].selectedIndex==1){
       document.querySelectorAll("tr")[23].style.display = "none"}//band members

// alert on init
    if (document.querySelectorAll("select")[0].selectedIndex==0 && document.getElementById("members").value!=""){
        alert("Person do not have band members")
        document.querySelectorAll("tr")[18].style.display = ""
        document.querySelectorAll("tr")[23].style.display = ""
    }
    if (document.querySelectorAll("select")[0].selectedIndex==1 && document.getElementById("member_of").value!=""){
        alert("Group can not be member of a group")
        document.querySelectorAll("tr")[18].style.display = ""
        document.querySelectorAll("tr")[23].style.display = ""
    }
// event function
        document.querySelectorAll("select")[0].onchange = function (){

    if (document.querySelectorAll("select")[0].selectedIndex==0){//0 if person, 1 if group
         document.querySelectorAll("tr")[18].style.display = "none"//band members
         document.querySelectorAll("tr")[23].style.display = ""//Member of

     } else {
         document.querySelectorAll("tr")[18].style.display = ""//band members
         document.querySelectorAll("tr")[23].style.display = "none"//Member of

     }
        }


//---------------------
//  Inputs regions
//---------------------

        var OCoun=document.getElementById("o_country").value
        var o_Sta=document.getElementsByName("o_state")[0]
        var CCoun=document.getElementById("c_country").value
        var c_Sta=document.getElementsByName("c_state")[0]


var ALreg = ["","Berat","Dibër","Durrës","Elbasan","Fier","Gjirokastër","Korçë","Kukës","Lezhë","Shkodër","Tiranë","Vlorë"];
var AL = document.createElement("select");
AL.id = "o_AL";
for (i = 0; i < ALreg.length; i++) {
    var optionAL = document.createElement("option");
    optionAL.value = ALreg[i]
    optionAL.text = ALreg[i]
    AL.appendChild(optionAL)}

var ARreg = ["","Ciudad Autónoma de Buenos Aires","Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"];
var AR = document.createElement("select");
AR.id = "o_AR";
for (i = 0; i < ARreg.length; i++) {
    var optionAR = document.createElement("option");
    optionAR.value = ARreg[i]
    optionAR.text = ARreg[i]
    AR.appendChild(optionAR)}

var ATreg = ["","Burgenland","Kärnten","Niederösterreich","Oberösterreich","Salzburg","Steiermark","Tirol","Vorarlberg","Wien"];
var AT = document.createElement("select");
AT.id = "o_AT";
for (i = 0; i < ATreg.length; i++) {
    var optionAT = document.createElement("option");
    optionAT.value = ATreg[i]
    optionAT.text = ATreg[i]
    AT.appendChild(optionAT)}

var AUreg = ["","NSW","QLD","SA","TAS","VIC","WA","ACT","NT"];
var AU = document.createElement("select");
AU.id = "o_AU";
for (i = 0; i < AUreg.length; i++) {
    var optionAU = document.createElement("option");
    optionAU.value = AUreg[i]
    optionAU.text = AUreg[i]
    AU.appendChild(optionAU)}

var BEreg = ["","West-Vlaanderen","Oost-Vlaanderen","Antwerpen","Limburg","Vlaams-Brabant","Brabant wallon","Hainaut","Namur","Liège","Luxembourg","Brussels Hoofdstedelijk Gewest","Région de Bruxelles-Capitale"];
var BE = document.createElement("select");
BE.id = "o_BE";
for (i = 0; i < BEreg.length; i++) {
    var optionBE = document.createElement("option");
    optionBE.value = BEreg[i]
    optionBE.text = BEreg[i]
    BE.appendChild(optionBE)}

var BRreg = ["","Acre","Amapá","Amazonas","Pará","Rondônia","Roraima","Tocantins","Alagoas","Bahia","Ceará","Maranhão","Paraíba","Pernambuco","Piauí","Rio Grande do Norte","Sergipe","Goiás","Mato Grosso","Mato Grosso do Sul","Espírito Santo","Minas Gerais","Rio de Janeiro","São Paulo","Paraná","Rio Grande do Sul","Santa Catarina","Distrito Federal"];
var BR = document.createElement("select");
BR.id = "o_BR";
for (i = 0; i < BRreg.length; i++) {
    var optionBR = document.createElement("option");
    optionBR.value = BRreg[i]
    optionBR.text = BRreg[i]
    BR.appendChild(optionBR)}

var CAreg = ["","AB","BC","MB","NB","NL","NS","ON","PE","QC","SK","NT","NU","YT"];
var CA = document.createElement("select");
CA.id = "o_CA";
for (i = 0; i < CAreg.length; i++) {
    var optionCA = document.createElement("option");
    optionCA.value = CAreg[i]
    optionCA.text = CAreg[i]
    CA.appendChild(optionCA)}

var CHreg = ["","Aargau","Appenzell Ausserrhoden","Appenzell Innerrhoden","Basel-Landschaft","Basel-Stadt","Bern","Fribourg","Genève","Glarus","Graubünden","Jura","Luzern","Neuchâtel","Nidwalden","Obwalden","Sankt Gallen","Schaffhausen","Schwyz","Solothurn","Thurgau","Ticino","Uri","Valais","Vaud","Zug","Zürich"];
var CH = document.createElement("select");
CH.id = "o_CH";
for (i = 0; i < CHreg.length; i++) {
    var optionCH = document.createElement("option");
    optionCH.value = CHreg[i]
    optionCH.text = CHreg[i]
    CH.appendChild(optionCH)}

var CSreg = ["Do not use Czechoslovakia (Former)"];
var CS = document.createElement("select");
CS.id = "o_CS";
for (i = 0; i < CSreg.length; i++) {
    var optionCS = document.createElement("option");
    optionCS.value = CSreg[i]
    optionCS.text = CSreg[i]
    CS.appendChild(optionCS)}

var CNreg = ["","Anhui","Fujian","Gansu","Guangdong","Guizhou","Hainan","Hebei","Heilongjiang","Henan","Hubei","Hunan","Jiangsu","Jiangxi","Jilin","Liaoning","Qinghai","Shaanxi","Shandong","Shanxi","Sichuan","Taiwan","Yunnan","Zhejiang","Guangxi","Nei Mongol","Ningxia","Xinjiang","Xizang","Beijing","Chongqing","Shanghai","Tianjin"];
var CN = document.createElement("select");
CN.id = "o_CN";
for (i = 0; i < CNreg.length; i++) {
    var optionCN = document.createElement("option");
    optionCN.value = CNreg[i]
    optionCN.text = CNreg[i]
    CN.appendChild(optionCN)}

    var CYreg = ["","Famagusta","Kyrenia","Larnaca","Limassol","Nicosia","Paphos"];
var CY= document.createElement("select");
CY.id = "o_CY";
for (i = 0; i < CYreg.length; i++) {
    var optionCY = document.createElement("option");
    optionCY.value = CYreg[i]
    optionCY.text = CYreg[i]
    CY.appendChild(optionCY)}

var CZreg = ["","Středočeský kraj","Jihočeský kraj","Plzeňský kraj","Karlovarský kraj","Ústecký kraj","Liberecký kraj","Královéhradecký kraj","Pardubický kraj","Olomoucký kraj","Moravskoslezský kraj","Jihomoravský kraj","Zlínský kraj","Vysočina","Hlavní město Praha"];
var CZ = document.createElement("select");
CZ.id = "o_CZ";
for (i = 0; i < CZreg.length; i++) {
    var optionCZ = document.createElement("option");
    optionCZ.value = CZreg[i]
    optionCZ.text = CZreg[i]
    CZ.appendChild(optionCZ)}

    var DEreg = ["","Baden-Württemberg","Bayern","Brandenburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen","Berlin","Bremen","Hamburg"];
var DE = document.createElement("select");
DE.id = "o_DE";
for (i = 0; i < DEreg.length; i++) {
    var optionDE = document.createElement("option");
    optionDE.value = DEreg[i]
    optionDE.text = DEreg[i]
    DE.appendChild(optionDE)}

    var DKreg = ["","Hovedstaden","Midtjylland","Nordjylland","Sjælland","Syddanmark"];
var DK = document.createElement("select");
DK.id = "o_DK";
for (i = 0; i < DKreg.length; i++) {
    var optionDK = document.createElement("option");
    optionDK.value = DKreg[i]
    optionDK.text = DKreg[i]
    DK.appendChild(optionDK)}

    var ESreg = ["","Andalucía","Aragón","Principado de Asturias","Illes Balears","Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Catalunya","Extremadura","Galicia","Comunidad de Madrid","Región de Murcia","Comunidad Foral de Navarra","Nafarroako Foru Komunitatea","La Rioja","Comunitat Valenciana","País Vasco","Euskadi","Ciudad Autónoma de Ceuta","Ciudad Autónoma de Melilla"];
var ES = document.createElement("select");
ES.id = "o_ES";
for (i = 0; i < ESreg.length; i++) {
    var optionES = document.createElement("option");
    optionES.value = ESreg[i]
    optionES.text = ESreg[i]
    ES.appendChild(optionES)}

    var FIreg = ["","Uusimaa","Varsinais-Suomi","Satakunta","Kanta-Häme","Pirkanmaa","Päijät-Häme","Kymenlaakso","Etelä-Karjala","Etelä-Savo","Pohjois-Savo","Pohjois-Karjala","Keski-Suomi","Etelä-Pohjanmaa","Pohjanmaa","Keski-Pohjanmaa","Pohjois-Pohjanmaa","Kainuu","Lappi","Åland"];
var FI = document.createElement("select");
FI.id = "o_FI";
for (i = 0; i < FIreg.length; i++) {
    var optionFI = document.createElement("option");
    optionFI.value = FIreg[i]
    optionFI.text = FIreg[i]
    FI.appendChild(optionFI)}

var FRreg = ["","Grand Est","Nouvelle-Aquitaine","Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Bretagne","Centre-Val de Loire","Corse","Île-de-France","Occitanie","Hauts-de-France","Normandie","Pays de la Loire","Provence-Alpes-Côte d'Azur"];
var FR = document.createElement("select");
FR.id = "o_FR";
for (i = 0; i < FRreg.length; i++) {
    var optionFR = document.createElement("option");
    optionFR.value = FRreg[i]
    optionFR.text = FRreg[i]
    FR.appendChild(optionFR)}

var GBreg=["","Bedfordshire","Berkshire","City of Bristol","Buckinghamshire","Cambridgeshire","Cheshire","City of London","Cornwall","Cumbria","Derbyshire","Devon","Dorset","Durham","East Riding of Yorkshire","East Sussex","Essex","Gloucestershire","Greater London","Greater Manchester","Hampshire","Herefordshire","Hertfordshire","Isle of Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Merseyside","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Rutland","Shropshire","Somerset","South Yorkshire","Staffordshire","Suffolk","Surrey","Tyne and Wear","Warwickshire","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire","Antrim and Newtownabbey","Ards and North Down","Armagh, Banbridge and Craigavon","Belfast","Causeway Coast and Glens","Derry and Strabane","Fermanagh and Omagh","Lisburn and Castlereagh","Mid and East Antrim","Mid-Ulster","Newry, Mourne and Down","Aberdeen City","Aberdeenshire","Angus","Argyll and Bute","Clackmannanshire","Dumfries and Galloway","Dundee City","East Ayrshire","East Dunbartonshire","East Lothian","East Renfrewshire","City of Edinburgh","Falkirk","Fife","Glasgow City","Highland","Inverclyde","Midlothian","Moray","North Ayrshire","North Lanarkshire","Perth and Kinross","Renfrewshire","Scottish Borders","South Ayrshire","South Lanarkshire","Stirling","West Dunbartonshire","West Lothian","Na h-Eileanan Siar","Orkney Islands","Shetland Islands","Blaenau Gwent","Bridgend","Pen-y-bont ar Ogwr","Caerphilly","Caerffili","Cardiff","Caerdydd","Carmarthenshire","Sir Gaerfyrddin","Ceredigion","Conwy","Denbighshire","Sir Ddinbych","Flintshire","Sir y Fflint","Gwynedd","Isle of Anglesey","Ynys Môn","Merthyr Tydfil","Merthyr Tudful","Monmouthshire","Sir Fynwy","Neath Port Talbot","Castell-nedd Port Talbot","Newport","Casnewydd","Pembrokeshire","Sir Benfro","Powys","Rhondda Cynon Taf","Swansea","Abertawe","Torfaen","Tor-faen","Vale of Glamorgan","Bro Morgannwg","Wrexham","Wrecsam"]
var GB = document.createElement("select");
GB.id = "o_GB";
for (i = 0; i < GBreg.length; i++) {
    var optionGB = document.createElement("option");
    optionGB.value = GBreg[i]
    optionGB.text = GBreg[i]
    GB.appendChild(optionGB)}

var GRreg = ["","Attica","Central Greece","Central Macedonia","Crete","East Macedonia and Thrace","Epirus","Ionian Islands","North Aegean","Peloponnese","South Aegean","Thessaly","West Greece","West Macedonia","Mount Athos"];
var GR = document.createElement("select");
GR.id = "o_GR";
for (i = 0; i < GRreg.length; i++) {
    var optionGR = document.createElement("option");
    optionGR.value = GRreg[i]
    optionGR.text = GRreg[i]
    GR.appendChild(optionGR)}

    var IEreg = ["","Dublin","Wicklow","Wexford","Carlow","Kildare","Meath","Louth","Monaghan","Cavan","Longford","Westmeath","Offaly","Laois","Kilkenny","Waterford","Cork","Kerry","Limerick","Tipperary","Clare","Galway","Mayo","Roscommon","Sligo","Leitrim","Donegal"]
var IE = document.createElement("select");
IE.id = "o_IE";
for (i = 0; i < IEreg.length; i++) {
    var optionIE = document.createElement("option");
    optionIE.value = IEreg[i]
    optionIE.text = IEreg[i]
    IE.appendChild(optionIE)}

    var ILreg = ["","Central","Haifa","Jerusalem","Northern","Southern","Tel Aviv"]
var IL = document.createElement("select");
IL.id = "o_IL";
for (i = 0; i < ILreg.length; i++) {
    var optionIL = document.createElement("option");
    optionIL.value = ILreg[i]
    optionIL.text = ILreg[i]
    IL.appendChild(optionIL)}

    var INreg = ["","Andhra Pradesh","Arunachal Pradesh","Assam"," Bihar"," Chhattisgarh"," Goa"," Gujarat"," Haryana"," Himachal Pradesh"," Jammu and Kashmir"," Jharkhand"," Karnataka"," Kerala"," Madhya Pradesh"," Maharashtra"," Manipur"," Meghalaya"," Mizoram"," Nagaland"," Odisha"," Punjab"," Rajasthan"," Sikkim"," Tamil Nadu"," Telangana"," Tripura"," Uttar Pradesh"," Uttarakhand"," West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep","Delhi","Puducherry"]
var IN = document.createElement("select");
IN.id = "o_IN";
for (i = 0; i < INreg.length; i++) {
    var optionIN = document.createElement("option");
    optionIN.value = INreg[i]
    optionIN.text = INreg[i]
    IN.appendChild(optionIN)}

    var ISreg = ["","Höfuðborgarsvæði","Suðurnes","Vesturland","Vestfirðir","Norðurland vestra","Norðurland eystra","Austurland","Suðurland"]
var IS = document.createElement("select");
IS.id = "o_IS";
for (i = 0; i < ISreg.length; i++) {
    var optionIS = document.createElement("option");
    optionIS.value = ISreg[i]
    optionIS.text = ISreg[i]
    IS.appendChild(optionIS)}

    var ITreg = ["","Piemonte","Lombardia","Veneto","Emilia-Romagna","Liguria","Toscana","Umbria","Marche","Lazio","Abruzzo","Molise","Campania","Puglia","Basilicata","Calabria","Valle d'Aosta","Trentino-Alto Adige","Friuli-Venezia Giulia","Sardegna","Sicilia"]
var IT = document.createElement("select");
IT.id = "o_IT";
for (i = 0; i < ITreg.length; i++) {
    var optionIT = document.createElement("option");
    optionIT.value = ITreg[i]
    optionIT.text = ITreg[i]
    IT.appendChild(optionIT)}

    var JPreg = ["","Aichi","Akita","Aomori","Chiba","Ehime","Fukui","Fukuoka","Fukushima","Gifu","Gunma","Hiroshima","Hokkaido","Hyogo","Ibaraki","Ishikawa","Iwate","Kagawa","Kagoshima","Kanagawa","Kochi","Kumamoto","Kyoto","Mie","Miyagi","Miyazaki","Nagano","Nagasaki","Nara","Niigata","Oita","Okayama","Okinawa","Osaka","Saga","Saitama","Shiga","Shimane","Shizuoka","Tochigi","Tokushima","Tokyo","Tottori","Toyama","Wakayama","Yamagata","Yamaguchi","Yamanashi"]
var JP = document.createElement("select");
JP.id = "o_JP";
for (i = 0; i < JPreg.length; i++) {
    var optionJP = document.createElement("option");
    optionJP.value = JPreg[i]
    optionJP.text = JPreg[i]
    JP.appendChild(optionJP)}

    var KRreg = ["","Jeju-do","Jeollabuk-do","Jeollanam-do","Chungcheongbuk-do","Chungcheongnam-do","Gangwon-do","Gyeonggi-do","Gyeongsangbuk-do","Gyeongsangnam-do","Incheon","Gwangju","Busan","Daegu","Daejeon","Ulsan","Seoul"]
var KR = document.createElement("select");
KR.id = "o_KR";
for (i = 0; i < KRreg.length; i++) {
    var optionKR = document.createElement("option");
    optionKR.value = KRreg[i]
    optionKR.text = KRreg[i]
    KR.appendChild(optionKR)}

var LBreg = ["","Beyrouth","Mont-Liban","Liban-Nord","Béqaa","Nabatîyé","Liban-Sud"];
var LB = document.createElement("select");
LB.id = "o_LB";
for (i = 0; i < LBreg.length; i++) {
    var optionLB = document.createElement("option");
    optionLB.value = LBreg[i]
    optionLB.text = LBreg[i]
    LB.appendChild(optionLB)}

var LKreg = ["","Uturu palata","Vayamba palata","Uturumeda palata","Negenahira palata","Madhyama palata","Basnahira palata","Sabaragamuva palata","Uva palata","Dakunu palata"];
var LK = document.createElement("select");
LK.id = "o_LK";
for (i = 0; i < LKreg.length; i++) {
    var optionLK = document.createElement("option");
    optionLK.value = LKreg[i]
    optionLK.text = LKreg[i]
    LK.appendChild(optionLK)}

var MLreg = ["","Gao","Kayes","Kidal","Negenahira palata","Koulikoro","Mopti","Ségou","Sikasso","Tombouctou","Bamako"];
var ML = document.createElement("select");
ML.id = "o_ML";
for (i = 0; i < MLreg.length; i++) {
    var optionML = document.createElement("option");
    optionML.value = MLreg[i]
    optionML.text = MLreg[i]
    ML.appendChild(optionML)}

var MXreg = ["","Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Coahuila de Zaragoza","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México","Michoacán de Ocampo","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz de Ignacio de la Llave","Yucatán","Zacatecas","Ciudad de México"];
var MX = document.createElement("select");
MX.id = "o_MX";
for (i = 0; i < MXreg.length; i++) {
    var optionMX = document.createElement("option");
    optionMX.value = MXreg[i]
    optionMX.text = MXreg[i]
    MX.appendChild(optionMX)}

    var NLreg = ["","Drenthe","Flevoland","Friesland","Gelderland","Groningen","Limburg","Noord-Brabant","Noord-Holland","Overijssel","Utrecht","Zeeland","Zuid-Holland"];
var NL = document.createElement("select");
NL.id = "o_NL";
for (i = 0; i < NLreg.length; i++) {
    var optionNL = document.createElement("option");
    optionNL.value = NLreg[i]
    optionNL.text = NLreg[i]
    NL.appendChild(optionNL)}

    var NOreg = ["","Troms og Finnmark","Nordland","Trøndelag","Møre og Romsdal","Vestland","Rogaland","Agder","Vestfold og Telemark","Innlandet","Viken","Oslo"];
var NO = document.createElement("select");
NO.id = "o_NO";
for (i = 0; i < NOreg.length; i++) {
    var optionNO = document.createElement("option");
    optionNO.value = NOreg[i]
    optionNO.text = NOreg[i]
    NO.appendChild(optionNO)}

    var PLreg = ["","dolnośląskie","kujawsko-pomorskie","lubelskie","lubuskie","łódzkie","małopolskie","mazowieckie","opolskie","podkarpackie","podlaskie","pomorskie","śląskie","świętokrzyskie","warmińsko-mazurskie","wielkopolskie","zachodniopomorskie"];
var PL = document.createElement("select");
PL.id = "o_PL";
for (i = 0; i < PLreg.length; i++) {
    var optionPL = document.createElement("option");
    optionPL.value = PLreg[i]
    optionPL.text = PLreg[i]
    PL.appendChild(optionPL)}

    var PTreg = ["","Lisboa","Leiria","Santarém","Setúbal","Beja","Faro","Évora","Portalegre","Castelo Branco","Guarda","Coimbra","Aveiro","Viseu","Bragança","Vila Real","Porto","Braga","Viana do Castelo","Açores","Madeira"];
var PT = document.createElement("select");
PT.id = "o_PT";
for (i = 0; i < PTreg.length; i++) {
    var optionPT = document.createElement("option");
    optionPT.value = PTreg[i]
    optionPT.text = PTreg[i]
    PT.appendChild(optionPT)}

    var ROreg = ["","Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Timiș","Teleorman","Tulcea","Vâlcea","Vaslui","Vrancea","București"];
var RO = document.createElement("select");
RO.id = "o_RO";
for (i = 0; i < ROreg.length; i++) {
    var optionRO = document.createElement("option");
    optionRO.value = ROreg[i]
    optionRO.text = ROreg[i]
    RO.appendChild(optionRO)}

    var RUreg = ["","Amur Oblast","Arkhangelsk Oblast","Astrakhan Oblast","Belgorod Oblast","Bryansk Oblast","Chelyabinsk Oblast","Irkutsk Oblast","Ivanovo Oblast","Kaliningrad Oblast","Kaluga Oblast","Kemerovo Oblast","Kirov Oblast","Kostroma Oblast","Kurgan Oblast","Kursk Oblast","Leningrad Oblast","Lipetsk Oblast","Magadan Oblast","Moscow Oblast","Murmansk Oblast","Nizhny Novgorod Oblast","Novgorod Oblast","Novosibirsk Oblast","Omsk Oblast","Orenburg Oblast","Oryol Oblast","Penza Oblast","Pskov Oblast","Rostov Oblast","Ryazan Oblast","Sakhalin Oblast","Samara Oblast","Saratov Oblast","Smolensk Oblast","Sverdlovsk Oblast","Tambov Oblast","Tomsk Oblast","Tula Oblast","Tver Oblast","Tyumen Oblast","Ulyanovsk Oblast","Vladimir Oblast","Volgograd Oblast","Vologda Oblast","Voronezh Oblast","Yaroslavl Oblast","Republic of Adygea","Altai Republic","Republic of Bashkortostan","Buryat Republic","Chechen Republic","Chuvash Republic","Republic of Dagestan","Republic of Ingushetia","Kabardino-Balkar Republic","Republic of Kalmykia","Karachay-Cherkess Republic","Republic of Karelia","Republic of Khakassia","Komi Republic","Mari El Republic","Republic of Mordovia","Republic of North Ossetia-Alania","Sakha (Yakutia) Republic","Republic of Tatarstan","Tyva Republic","Udmurt Republic","Chukotka Autonomous Okrug","Khanty-Mansi Autonomous Okrug","Nenets Autonomous Okrug","Yamalo-Nenets Autonomous Okrug","Altai Krai","Kamchatka Krai","Khabarovsk Krai","Krasnodar Krai","Krasnoyarsk Krai","Perm Krai","Primorsky Krai","Stavropol Krai","Zabaykalsky Krai","Moscow","Saint Petersburg","Jewish Autonomous Oblast"];
var RU = document.createElement("select");
RU.id = "o_RU";
for (i = 0; i < RUreg.length; i++) {
    var optionRU = document.createElement("option");
    optionRU.value = RUreg[i]
    optionRU.text = RUreg[i]
    RU.appendChild(optionRU)}

    var SEreg = ["","Blekinge län","Dalarnas län","Gotlands län","Gävleborgs län","Hallands län","Jämtlands län","Jönköpings län","Kalmar län","Kronobergs län","Norrbottens län","Skåne län","Stockholms län","Södermanlands län","Uppsala län","Värmlands län","Västerbottens län","Västernorrlands län","Västmanlands län","Västra Götalands län","Örebro län","Östergötlands län"];
var SE = document.createElement("select");
SE.id = "o_SE";
for (i = 0; i < SEreg.length; i++) {
    var optionSE = document.createElement("option");
    optionSE.value = SEreg[i]
    optionSE.text = SEreg[i]
    SE.appendChild(optionSE)}

    var SKreg = ["","Bratislavský kraj","Trnavský kraj","Trenčiansky kraj","Nitriansky kraj","Žilinský kraj","Banskobystrický kraj","Prešovský kraj","Košický kraj"];
var SK = document.createElement("select");
SK.id = "o_SK";
for (i = 0; i < SKreg.length; i++) {
    var optionSK = document.createElement("option");
    optionSK.value = SKreg[i]
    optionSK.text = SKreg[i]
    SK.appendChild(optionSK)}

    var USreg = ["","AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
var US = document.createElement("select");
US.id = "o_US";
for (i = 0; i < USreg.length; i++) {
    var optionUS = document.createElement("option");
    optionUS.value = USreg[i]
    optionUS.text = USreg[i]
    US.appendChild(optionUS)}

var ALc=AL.cloneNode(true);
    ALc.id="c_AL"
var ARc=AR.cloneNode(true);
    ARc.id="c_AR"
var ATc=AT.cloneNode(true);
    ATc.id="c_ATc"
var AUc=AU.cloneNode(true);
    AUc.id="c_AU"
var BEc=BE.cloneNode(true);
    BEc.id="c_BE"
var BRc=BR.cloneNode(true);
    BRc.id="c_BR"
var CAc=CA.cloneNode(true);
    CAc.id="c_CA"
var CHc=CH.cloneNode(true);
    CHc.id="c_CH"
var CSc=CS.cloneNode(true);
    CSc.id="c_CS"
var CNc=CN.cloneNode(true);
    CNc.id="c_CN"
var CYc=CY.cloneNode(true);
    CYc.id="c_CY"
var CZc=CZ.cloneNode(true);
    CZc.id="c_CZ"
var DEc=DE.cloneNode(true);
    DEc.id="c_DE"
var DKc=DK.cloneNode(true);
    DKc.id="c_DK"
var ESc=ES.cloneNode(true);
    ESc.id="c_ES"
var FIc=FI.cloneNode(true);
    FIc.id="c_FI"
var FRc=FR.cloneNode(true);
    FRc.id="c_FR"
var GBc=GB.cloneNode(true);
    GBc.id="c_GB"
var GRc=GR.cloneNode(true);
    GRc.id="c_GR"
var IEc=IE.cloneNode(true);
    IEc.id="c_IE"
var ILc=IL.cloneNode(true);
    ILc.id="c_IL"
var INc=IN.cloneNode(true);
    INc.id="c_IN"
var ISc=IS.cloneNode(true);
    ISc.id="c_IS"
var ITc=IT.cloneNode(true);
    ITc.id="c_IT"
var JPc=JP.cloneNode(true);
    JPc.id="c_JP"
var KRc=KR.cloneNode(true);
    KRc.id="c_KR"
var LBc=LB.cloneNode(true);
    LBc.id="c_LB"
var LKc=LK.cloneNode(true);
    LKc.id="c_LK"
var MLc=ML.cloneNode(true);
    MLc.id="c_ML"
var MXc=MX.cloneNode(true);
    MXc.id="c_MX"
var NLc=NL.cloneNode(true);
    NLc.id="c_NL"
var NOc=NO.cloneNode(true);
    NOc.id="c_NO"
var PLc=PL.cloneNode(true);
    PLc.id="c_PL"
var PTc=PT.cloneNode(true);
    PTc.id="c_PT"
var ROc=RO.cloneNode(true);
    ROc.id="c_RO"
var RUc=RU.cloneNode(true);
    RUc.id="c_RU"
var SEc=SE.cloneNode(true);
    SEc.id="c_SE"
var SKc=SK.cloneNode(true);
    SKc.id="c_SE"
var USc=US.cloneNode(true);
    USc.id="c_US"
var o_countries=[AL,AR,AT,AU,BE,BR,CA,CH,CN,CS,CY,CZ,DE,DK,ES,FI,FR,GB,GR,IE,IL,IN,IS,IT,JP,KR,LB,LK,ML,MX,NL,NO,PL,PT,RO,RU,SE,SK,US]
var c_countries=[ALc,ARc,ATc,AUc,BEc,BRc,CAc,CHc,CNc,CSc,CYc,CZc,DEc,DKc,ESc,FIc,FRc,GBc,GRc,IEc,ILc,INc,ISc,ITc,JPc,KRc,LBc,LKc,MLc,MXc,NLc,PLc,NOc,PTc,ROc,RUc,SEc,SKc,USc]

document.getElementById("o_country").onchange = function (){

  for (i=0;i<o_countries.length;i++){
      o_countries[i].name="o_state"
                                 }
        if (document.getElementById("o_country").value=="AL"){
             document.getElementsByName("o_state")[0].replaceWith(AL)}
       else if (document.getElementById("o_country").value=="AR"){
             document.getElementsByName("o_state")[0].replaceWith(AR)}
       else if (document.getElementById("o_country").value=="AT"){
             document.getElementsByName("o_state")[0].replaceWith(AT)}
       else if (document.getElementById("o_country").value=="AU"){
             document.getElementsByName("o_state")[0].replaceWith(AU)}
       else if (document.getElementById("o_country").value=="BE"){
             document.getElementsByName("o_state")[0].replaceWith(BE)}
       else if (document.getElementById("o_country").value=="BR"){
             document.getElementsByName("o_state")[0].replaceWith(BR)}
       else if (document.getElementById("o_country").value=="CA"){
             document.getElementsByName("o_state")[0].replaceWith(CA)}
       else if (document.getElementById("o_country").value=="CH"){
             document.getElementsByName("o_state")[0].replaceWith(CH)}
       else if (document.getElementById("o_country").value=="CN"){
             document.getElementsByName("o_state")[0].replaceWith(CN)}
       else if (document.getElementById("o_country").value=="CS"){
             document.getElementsByName("o_state")[0].replaceWith(CS)}
       else if (document.getElementById("o_country").value=="CY"){
             document.getElementsByName("o_state")[0].replaceWith(CY)}
       else if (document.getElementById("o_country").value=="CZ"){
             document.getElementsByName("o_state")[0].replaceWith(CZ)}
       else if (document.getElementById("o_country").value=="DE"){
             document.getElementsByName("o_state")[0].replaceWith(DE)}
       else if (document.getElementById("o_country").value=="DK"){
             document.getElementsByName("o_state")[0].replaceWith(DK)}
       else if (document.getElementById("o_country").value=="ES"){
             document.getElementsByName("o_state")[0].replaceWith(ES)}
       else if (document.getElementById("o_country").value=="FI"){
             document.getElementsByName("o_state")[0].replaceWith(FI)}
       else if (document.getElementById("o_country").value=="FR"){
             document.getElementsByName("o_state")[0].replaceWith(FR)}
       else if (document.getElementById("o_country").value=="GB"){
             document.getElementsByName("o_state")[0].replaceWith(GB)}
       else if (document.getElementById("o_country").value=="GR"){
             document.getElementsByName("o_state")[0].replaceWith(GR)}
       else if (document.getElementById("o_country").value=="IE"){
             document.getElementsByName("o_state")[0].replaceWith(IE)}
       else if (document.getElementById("o_country").value=="IL"){
             document.getElementsByName("o_state")[0].replaceWith(IL)}
       else if (document.getElementById("o_country").value=="IN"){
             document.getElementsByName("o_state")[0].replaceWith(IN)}
       else if (document.getElementById("o_country").value=="IS"){
             document.getElementsByName("o_state")[0].replaceWith(IS)}
       else if (document.getElementById("o_country").value=="IT"){
             document.getElementsByName("o_state")[0].replaceWith(IT)}
       else if (document.getElementById("o_country").value=="JP"){
             document.getElementsByName("o_state")[0].replaceWith(JP)}
       else if (document.getElementById("o_country").value=="KR"){
             document.getElementsByName("o_state")[0].replaceWith(KR)}
       else if (document.getElementById("o_country").value=="LK"){
             document.getElementsByName("o_state")[0].replaceWith(LK)}
       else if (document.getElementById("o_country").value=="LU"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="MC"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="ML"){
             document.getElementsByName("o_state")[0].replaceWith(ML)}
       else if (document.getElementById("o_country").value=="MO"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="MT"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="MX"){
             document.getElementsByName("o_state")[0].replaceWith(MX)}
       else if (document.getElementById("o_country").value=="NL"){
             document.getElementsByName("o_state")[0].replaceWith(NL)}
       else if (document.getElementById("o_country").value=="NO"){
             document.getElementsByName("o_state")[0].replaceWith(NO)}
       else if (document.getElementById("o_country").value=="NZ"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="PL"){
             document.getElementsByName("o_state")[0].replaceWith(PL)}
       else if (document.getElementById("o_country").value=="PR"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="PT"){
             document.getElementsByName("o_state")[0].replaceWith(PT)}
       else if (document.getElementById("o_country").value=="RO"){
             document.getElementsByName("o_state")[0].replaceWith(RO)}
       else if (document.getElementById("o_country").value=="RU"){
             document.getElementsByName("o_state")[0].replaceWith(RU)}
       else if (document.getElementById("o_country").value=="SE"){
             document.getElementsByName("o_state")[0].replaceWith(SE)}
       else if (document.getElementById("o_country").value=="SK"){
             document.getElementsByName("o_state")[0].replaceWith(SK)}
       else if (document.getElementById("o_country").value=="TW"){
             document.getElementsByName("o_state")[0].style.display="none"}
       else if (document.getElementById("o_country").value=="US"){
             document.getElementsByName("o_state")[0].replaceWith(US)}
    else {document.getElementsByName("o_state")[0].style.display=""
          document.getElementsByName("o_state")[0].replaceWith(o_Sta)}
}

document.getElementById("c_country").onchange = function (){
  for (i=0;i<c_countries.length;i++){

      c_countries[i].name="c_state"
                                 }
        if (document.getElementById("c_country").value=="AL"){
             document.getElementsByName("c_state")[0].replaceWith(ALc)}
       else if (document.getElementById("c_country").value=="AR"){
             document.getElementsByName("c_state")[0].replaceWith(ARc)}
       else if (document.getElementById("c_country").value=="AT"){
             document.getElementsByName("c_state")[0].replaceWith(ATc)}
       else if (document.getElementById("c_country").value=="AU"){
             document.getElementsByName("c_state")[0].replaceWith(AUc)}
       else if (document.getElementById("c_country").value=="BE"){
             document.getElementsByName("c_state")[0].replaceWith(BEc)}
       else if (document.getElementById("c_country").value=="BR"){
             document.getElementsByName("c_state")[0].replaceWith(BRc)}
       else if (document.getElementById("c_country").value=="CA"){
             document.getElementsByName("c_state")[0].replaceWith(CAc)}
       else if (document.getElementById("c_country").value=="CH"){
             document.getElementsByName("c_state")[0].replaceWith(CHc)}
       else if (document.getElementById("c_country").value=="CN"){
             document.getElementsByName("c_state")[0].replaceWith(CNc)}
       else if (document.getElementById("c_country").value=="CS"){
             document.getElementsByName("c_state")[0].replaceWith(CSc)}
       else if (document.getElementById("c_country").value=="CY"){
             document.getElementsByName("c_state")[0].replaceWith(CYc)}
       else if (document.getElementById("c_country").value=="CZ"){
             document.getElementsByName("c_state")[0].replaceWith(CZc)}
       else if (document.getElementById("c_country").value=="DE"){
             document.getElementsByName("c_state")[0].replaceWith(DEc)}
       else if (document.getElementById("c_country").value=="DK"){
             document.getElementsByName("c_state")[0].replaceWith(DKc)}
       else if (document.getElementById("c_country").value=="ES"){
             document.getElementsByName("c_state")[0].replaceWith(ESc)}
       else if (document.getElementById("c_country").value=="FI"){
             document.getElementsByName("c_state")[0].replaceWith(FIc)}
       else if (document.getElementById("c_country").value=="FR"){
             document.getElementsByName("c_state")[0].replaceWith(FRc)}
       else if (document.getElementById("c_country").value=="GB"){
             document.getElementsByName("c_state")[0].replaceWith(GBc)}
       else if (document.getElementById("c_country").value=="GR"){
             document.getElementsByName("c_state")[0].replaceWith(GRc)}
       else if (document.getElementById("c_country").value=="IE"){
             document.getElementsByName("c_state")[0].replaceWith(IEc)}
       else if (document.getElementById("c_country").value=="IL"){
             document.getElementsByName("c_state")[0].replaceWith(ILc)}
       else if (document.getElementById("c_country").value=="IN"){
             document.getElementsByName("c_state")[0].replaceWith(INc)}
       else if (document.getElementById("c_country").value=="IS"){
             document.getElementsByName("c_state")[0].replaceWith(ISc)}
       else if (document.getElementById("c_country").value=="IT"){
             document.getElementsByName("c_state")[0].replaceWith(ITc)}
       else if (document.getElementById("c_country").value=="JP"){
             document.getElementsByName("c_state")[0].replaceWith(JPc)}
       else if (document.getElementById("c_country").value=="KR"){
             document.getElementsByName("c_state")[0].replaceWith(KRc)}
       else if (document.getElementById("c_country").value=="LK"){
             document.getElementsByName("c_state")[0].replaceWith(LKc)}
       else if (document.getElementById("c_country").value=="LU"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="MC"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="ML"){
             document.getElementsByName("c_state")[0].replaceWith(MLc)}
       else if (document.getElementById("c_country").value=="MO"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="MT"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="MX"){
             document.getElementsByName("c_state")[0].replaceWith(MXc)}
       else if (document.getElementById("c_country").value=="NL"){
             document.getElementsByName("c_state")[0].replaceWith(NLc)}
       else if (document.getElementById("c_country").value=="NO"){
             document.getElementsByName("c_state")[0].replaceWith(NOc)}
       else if (document.getElementById("c_country").value=="NZ"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="PL"){
             document.getElementsByName("c_state")[0].replaceWith(PLc)}
       else if (document.getElementById("c_country").value=="PR"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="PT"){
             document.getElementsByName("c_state")[0].replaceWith(PTc)}
       else if (document.getElementById("c_country").value=="RO"){
             document.getElementsByName("c_state")[0].replaceWith(ROc)}
       else if (document.getElementById("c_country").value=="RU"){
             document.getElementsByName("c_state")[0].replaceWith(RUc)}
       else if (document.getElementById("c_country").value=="SE"){
             document.getElementsByName("c_state")[0].replaceWith(SEc)}
       else if (document.getElementById("c_country").value=="SK"){
             document.getElementsByName("c_state")[0].replaceWith(SKc)}
       else if (document.getElementById("c_country").value=="TW"){
             document.getElementsByName("c_state")[0].style.display="none"}
       else if (document.getElementById("c_country").value=="US"){
             document.getElementsByName("c_state")[0].replaceWith(USc)}
    else {document.getElementsByName("c_state")[0].style.display=""
          document.getElementsByName("c_state")[0].replaceWith(c_Sta)}
                                                                     }

//-----------------
 // extra alerts
//------------------


document.getElementById("submitbtn").onclick=function(){this.disabled=true;this.value='Please Wait...';validateProfileInputModified(); return false;}
 function validateProfileInputModified()
    {
      if (isNew && did('comments').value.length < 3 ) {
        alert('You must enter a source or explanation in the meta-comments.');
        did('submitbtn').disabled = false;
        did('submitbtn').value = 'Submit Artist Profile';
        return false;
      }
      if (isNew && did('lastname').value.length == 0 ) {
        alert('You must enter a name in the "last name" field!');
        did('submitbtn').value = 'Submit Artist Profile';
        did('submitbtn').disabled = false;
        return false;
      }
      if ($(".scope_checkbox:checked").length == 0) {
        alert('You have to select at least one scope (music, film, games) that is applicable for this artist.');
        did('submitbtn').value = 'Submit Artist Profile';
        did('submitbtn').disabled = false;
        return false;
      }

      if (document.getElementById("b_year").value>document.getElementById("d_year").value && document.getElementById("d_year").value!=""){
        alert('Error: Check dates')
        did('submitbtn').value = 'Submit Artist Profile';
        did('submitbtn').disabled = false;
        return false;
    }
       if (document.getElementById("search_hint").value.length==0){
        alert('You must enter a search hint.')
        did('submitbtn').value = 'Submit Artist Profile';
        did('submitbtn').disabled = false;
        return false;
      }

      var data = {
          firstname:$('#firstname').val(),
          lastname:$('#lastname').val(),
          o_country:$('#o_country').val(),
          c_country:$('#c_country').val(),
          search_hint:$('#search_hint').val(),
          new:isNew,
          new_artist:isNewArtist
      };
      $.ajax({
         url:'/artist/profile_verify',
         data:data,
         type:'POST',
         dataType:'script',
         async:true
         });

      return true;
    }

//-----------------
// Are you sure you want to leave this page?
//------------------

    window.onbeforeunload = function() {
    return true;
};

//-----------------
// Hide localized field if names have charcodes<127
//------------------
    //if (localized not empty && first and last latin) do alert; show all

var A=document.querySelector("#artist_ac > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(19)")
var B=document.querySelector("#artist_ac > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(20)")
var C=document.querySelector("#artist_ac > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(21)")

    function Latinonly(){
        var flag=1
        for (var i = 0; i < document.getElementById("firstname").value.concat(document.getElementById("lastname").value).length; i++) {
            if (document.getElementById("firstname").value.concat(document.getElementById("lastname").value).charCodeAt(i) > 127) {flag=0}
        }
    return flag}//=1 if only latin characters in name, 0 if there is at least one non latin character

    //init.
    if (Latinonly()==1){
        A.style.display="none"
        B.style.display="none"
        C.style.display="none"
    }


if (document.getElementsByName("firstname_eng")[0].value.concat(document.getElementsByName("lastname_eng")[0].value)!="" && Latinonly()==1)
{alert("Localized name not empty.\nName is in Latin characters only. You don't need localized name")
        A.style.display=""
        B.style.display=""
        C.style.display=""
}

function Localized(){

A.style.display="none"
B.style.display="none"
C.style.display="none"

    var fi=document.getElementById("firstname").value
    var la=document.getElementById("lastname").value
    var name=fi.concat(la);
    var locfi=document.getElementsByName("firstname_eng")[0].value
    var locla=document.getElementsByName("lastname_eng")[0].value
    var locname=locfi.concat(locla);



        for (i = 0; i < name.length; i++) {
        if (name.charCodeAt(i) > 127) {

A.style.display=""
B.style.display=""
C.style.display=""}

//        else if (locname!="" && name.charCodeAt(i) < 127) {

// A.next.style.color = "#ff0000";
// B.next.style.color = "#ff0000";
// C.next.style.color = "#ff0000";
//            flag=1
//     }
            }
//     if (flag==1){alert("Use Localized Artist Name only if First and Last name not in Latin script")}

}
  $("input#lastname").change(function(){Localized()})
  $("input#firstname").change(function(){Localized()})

// alert if only japanese : need localized


//--------------------------------------
//---Sort DRA alphabetically------
//--------------------------------------
//create button here:

var sort = document.createElement("a")
sort.innerText = "Sort";
sort.href="javascript:void(0);"
document.getElementById("ta_cancelpreview_btn_directly_related").parentElement.appendChild(sort);

sort.onclick=function(){
//    console.log("yo");

document.getElementById("ta_preview_btn_directly_related").click()
setTimeout(function(){;
//     sort the DRAs on pressing the button
var dralnks=document.getElementById("directly_related_preview").querySelectorAll("a")
var lnklst=[]
var sorted_nos=[]
var text=""
for (i=0;i<dralnks.length;i++){
    lnklst.push(dralnks[i].innerText)
}
var sorted_lnklist=lnklst.sort()
for (var j=0;j<sorted_lnklist.length;j++){
for (i=0;i<dralnks.length;i++){
if (dralnks[i].text == sorted_lnklist[j]){
sorted_nos.push(dralnks[i].title)}
}}

for (i=0;i<sorted_nos.length;i++){
    text=text+sorted_nos[i]+", "
}
    if (text.substring(0,text.length-2)!=""){
document.getElementById("directly_related").value=text.substring(0,text.length-2)}
setTimeout(function(){document.getElementById("ta_cancelpreview_btn_directly_related" ).click()}, 300);
    }, 500)
    }

//------------------------------------------------------------------
//--------Music roles-----------------------
//------------------------------------------------------------------

// document.getElementById("members").style.visibility="hidden"

var member_add= document.createElement("input")
member_add.id="member_add"
member_add.placeholder="Member Name"
document.getElementById("ta_bold_members").parentNode.appendChild(member_add)

var liste=["","10-string double violin","12-string acoustic guitar","12-string baritone guitar","12-string bass","12-string electric guitar","12-string guitar","2-row accordion","3-row diatonic button accordion","7-string acoustic guitar","A clarinet","ARP","ARP Explorer I","ARP Odyssey","ARP Solina string synthesizer","Acetone organ","Aeolian harp","Aluphone","Anglo concertina","Appalachian dulcimer","Argentinean guitarrón","A♭ clarinet","A♮ clarinet","Bakhshi staccato ornamentation","Baltic psalteries","Baroque bassoon","Baroque cello","Baroque flute","Baroque guitar","Baroque harp","Baroque oboe","Baroque trumpet","Baroque viola","Baroque violin","Batajón","Batajón Itotele","Batajón Iya","Batajón Okónkolo","Boomwhacker","Brazilian guitar","Buddha machine","Bulgarian tambura","Byzantine lyra","B♭ clarinet","B♭ soprano sarrusophone","B♭ soprano saxophone","B♭ trumpet","C clarinet","C soprano saxophone","C trumpet","C whistle","CAT synthesizer","CD player","CD prep","Cajun accordion","Calabrian lira","Cellotar","Celtic harp","Chamberlin","Chapman Stick","Chilean guitarrón","Clavinet","Colombian gaita","Colombian tambora","Companion organ","Conn-o-sax","Cosmic Beam","Cracklebox","Craviola","Cretan laouto","Cretan lyra","Cuban tres","D whistle","DJ","DJ mixing","DVD player","Didjeribone","Dobro","Dobro bass","Dominican tambora","Drone Machine","Dulcetina","EBow","EVI","EWI","Eigenharp","Electric Viola Grande","English concertina","English guitar","English horn","Ewe drums","E♭ clarinet","E♭ contrabass sarrusophone","F bass flute","Fairlight","Fanfarlophone","Farfisa","Flemish bagpipes","French horn","Game Boy","Garifuna drum","Gbedu","Glissando Headjoint flute","Glissentar","Great Highland bagpipes","Greek baglama","Guitaret","Hadjira","Hammond organ","Hang","Harryphone","Hawaiian guitar","Heckelphone","Hungarian citera","Indian harmonium","Indian slide guitar","Indian tambura","Irish bouzouki","Irish flute","Irish tenor banjo","Jankó keyboard","Jew's harp","Kazooka","Korean jabara","Labanoro dūda","Leslie speaker","Lowrey organ","Lyricon","Léode","MC","MIDI programming","MPC","Mahai Metak","MalletKAT","Marxophone","Mellotron","Mexican guitarrón","Mexican tambora","Mexican vihuela","MiniDisc","Minimoog","Monome","Moodswinger","Moog","Moog Taurus bass","NS/Stick","Nagoya Harp","Native American flute","Nepali flute","Nepali sarangi","Northumbrian pipes","Norwegian lyre","Novachord","Nyabinghi drums","Ocean drum","Omnichord","Ondioline","Optigan","Optron","Orchestron","Otamatone","PVC pipes","Paetzold recorder","Pamiri rubab","Papoose","Pedabro","Pianet","Pikasso guitar","Polymoog","Pontic kemenche","Portuguese guitar","Projectron","Prophet 5","Puerto Rican cuatro","Puerto Rican tres","Quindola","Reactable","Renaissance violin","Rhodes","Richter-tuned harmonica","Roman bells","Rumorarmonio","Russian guitar","Sardinian guitar","Schwyzerörgeli","Scottish smallpipes","Seaboard","Sensory Percussion","Shah Kaman","Solina","Spanish guitar","Spanish vihuela","StikHarpe","Stroh violin","Superbone","Suzuki Andes","Swedish säckpipa","Synclavier","Syndrum","TB-303","Tahitian ukulele","Tannerin","Taos drum","Tarhu","Tenori-on","Tibetan singing bell","TogaMan GuitarViol","Tonette","Touch Guitar","Trautonium","Tronichord","Tubax","Tubon","VCR","VJ","Variophone","Venezuelan cuatro","Venezuelan tambora","Vibra-Slap","Vibratosax","Violectra","Vitar","Vocaloid","Wagner tuba","Warr Guitar","Waterphone","Wavedrum","Western concert flute","Wurlitzer","Xaphoon","Xylosynth","Zube Tube","accompanist","accordina","accordion","acme siren","acoustic baritone guitar","acoustic bass","acoustic guitar","acoustic piccolo bass","acoustic rhythm guitar","actor","adaptation","additional engineer","additional overdubbing","additional producer","adufe","adungu","agogô bell","agoual","ajaeng","alarm clock","alboka","alfaia","algoza","alperidoo","alphorn","alto balalaika","alto clarinet","alto cornamuse","alto crumhorn","alto flute","alto fluteophone","alto guitar","alto horn","alto psaltery","alto rebec","alto saxophone","alto shawm","alto trombone","alto viol","alto violin","alto vocals","altyn shoor","amadinda","ambisonics","amplification","amplified objects","amplified piano","amplified sitar","amyrga","analog delay","analog synthesizer","anandi","angklung","announcer","antiphony","apito","archaic fretless zithers","arched harp","archivist","archlute","ardin","arghul","arpa jarocha","arpeggione","arpegina","arranger","art","art direction","art manipulation","artistic director","asatayak","ashiko","askavlos","assistant conductor","assistant engineer","assistant executive producer","assistant mastering engineer","assistant producer","associate producer","atabal","atabaque","atarigane","atenteben","atumpan","audio restoration","aulos","author","auto-wah","autoharp","axabeba","ayoyote","aşik sazı","babatoni","backing band","backing vocals","bagpipes","bajo quinto","bajo sexto","balafon","balalaika","ballet dancer","balloon","bamboo flute","bamboo saxophone","bamhum","ban-sitar","band photography","bandola","bandolim","bandolin","bandoneón","bandura","bandurria","banjeaurine","banjo","banjolele","banjolin","bansuri","bantar","barabanka","barbiton","baritone guitar","baritone horn","baritone saxophone","baritone ukulele","baritone violin","baritone vocals","barking dog","barrel organ","barrel piano","baryton","baryton-Martin","bas","bas-prim","bass","bass Anglo concertina","bass balalaika","bass clarinet","bass cornamuse","bass crumhorn","bass drum","bass flugelhorn","bass flugelhorn in B♭","bass flute","bass guitar","bass harmonica","bass lute","bass marimba","bass moraharpa","bass nyckelharpa","bass oboe","bass pan","bass pedals","bass piano accordion","bass psaltery","bass pulse","bass recorder","bass sackbut","bass santur","bass saxophone","bass synth","bass trombone","bass trumpet","bass tuba","bass tube","bass tār","bass ukulele","bass veena","bass viol","bass violin","bass vocals","bass-baritone vocals","basset clarinet","basset horn","bassetto","basskannel","basso profondo","bassoon","basy kaliskie","bat kine","baton","battala","batá","bawu","bayan","bağlama family","baş sazı","beat box","beats","bedug","begena","bell tree","bells","bendir","berimbau","bhapang","binioù kozh","birbynė","birch trumpet","bisernica","biwa","bladder fiddle","blowing horn","blul","boatswain's call","bodega","bodhrán","body percussion","boha","bolon","bombard","bombardon","bombo","bonang","bonang barung","bonang panerus","bones","bongos","border pipes","bordonúa","botija","bottle","bottleneck guitar","boté","bougarabou","boula","bouzouki","bouzouki-guitar","bow harp","bow-shaped Jew's harp","bowed banjo","bowed bass guitar","bowed glockenspiel","bowed guitar","bowed gusli","bowed lute","bowls","braithophone","brake drum","brass","brasswinds","breakbeats","breaking glass","bridge vocals","broom","brushes","bucium","bugarabu","bugarija","bugle","buhay","bukhalo","bukkehorn","bulbul tarang","bulgari","bull horn","bullroarer","button accordion","buzuq","buzzer","byou uchi-daiko","byzaanchy","béndré","c-melody saxophone","cabasa","cabrette","cacho","caixa","caixa de folia","caja andina","caja vallenata","cajita china","cajón","calabash","caller","calliope","can-jo","candombe drums","cantor","capped reeds","carillon","carnyx","carts","castanets","cathedral organ","catá","cavaquinho","caxixi","caña rociera","celesta","cello","cello banjo","cello da spalla","cetara","ceterone","cevgen","ch'ili","chabbaba","chadagan","chain saw","chajchas","chakhe","chalumeau","chamber organ","chant","chanza","chapey","character designer","charango","charangón","charrasca","chaturangu","chelys","chijin","children's choir","chime tree","chincha quena","chinchín","chindon","chitarra battente","chitarrone","chitravina","choghur","choir","choir organ","choirmaster","chopping and screwing","choquela","chord harmonica","chord organ","chordophones","choreographer","chorus","chorus effect","chromatic accordion","chuniri","churuca","chuzao shamisen","chácharo","cigar box guitar","cimbalom","cimbasso","cimpoi","cinco","cinematographer","circuit bending","cirrampla","cithara","citole","cittern","clarin","clarinet","clarisax","clarophone","classical kemenche","claves","clavicembelo","clavichord","clavicytherium","claviola","clavioline","claviorgan","clayrimba","click sticks","clock","clockworks","clog dancer","clog violin","cloud-chamber bowls","clàrsach","co-executive producer","co-producer","cobza","cocktail drum","comb","compilation engineer","compilation producer","compiler","composer","composer's assistant","composition","compressor","computer","concert timpani","concert ukulele","concertina","concertmaster","conch shell trumpet","condanctor","conductor","congas","console steel guitar","contact microphone","contra-alto clarinet","contrabass balalaika","contrabass clarinet","contrabass flute","contrabass guitar","contrabass recorder","contrabass saxophone","contrabass trombone","contrabassoon","contraguitar","contralto saxophone","contralto vocals","contraviola","copyist","cornamuse","cornemuse du Centre","cornet","cornett","corrugaphone","costume designer","couesnophone","countertenor vocals","cover art","cover design","cover model","cover photography","cow horn trumpet","cowbell","cracked everyday electronics","crash box","creator","cromorne","crotales","crumhorn","cruzaphone","crwth","cuatro","cuica","cultrun","cumaco","cununo","cura","curator","cutting engineer","cymbals","cymbow","cümbüş","cümbüş tanbur","da'uli da'uli","damaru","dancer","darabukka","daruan","daudytės","davul","daxophone","dayereh","deejay (vocals)","deff","delay","dengakubue","design","devangui","devices","devil's fiddle","dhog-dhog","dhol","dholak","dholki","dhyangro","diatonic accordion","dictaphone","diddley bow","didgeridoo","digital delay","digital editing","digital reverb","dilruba","dingulator","diplica","diplipito","director","distortion","divan sazı","division viol","dizi","djembe","djoze","dobulbash","dojo","dolceola","dombura","domra","donno","donso n'goni","door spring","doshpuluur","dotar","dotar gourd lute","dotara","double bass","double clarinet","double flute","double reed","double-action harp","double-headed drums","doundoumba","dragon's teeth","dramaturge","dramyen","drawings","drill","drone fiddle","drum kit","drum loops","drum machine","drum programming","drum technician","drums","dual-bell trumpet","dub","ducheke","duck call","duduk","dudy","duet concertina","duggi tarang","dulce melos","dulcian","dulcimer","dulcitone","dulzaina","dungchen","dungdkar","dunun","dutar","duxianqin","dvojnice","dwojnica","dùndún","düngür","echo cornet","editing","effects","ektara","ekue","ekwe","electric autoharp","electric bandolim","electric banjo","electric baritone guitar","electric bass","electric bass dombra","electric cello","electric cellotar","electric dombra","electric grand piano","electric guitar","electric harp","electric harpsichord","electric kalimba","electric mandolin","electric piano","electric piccolo bass","electric rake","electric saw","electric saz","electric solid-body banjo","electric soprano guitar","electric spoons","electric tambourine","electric tenor guitar","electric tres","electric trombone","electric trumpet","electric ukulele","electric upright bass","electric viola","electric viola da gimbri","electric violin","electric zither","electric-acoustic guitar","electro-theremin","electroneddas","electronic bagpipes","electronic drums","electronic organ","electronic percussion","electronic tanpura","electronics","electronics / electromechanical devices / machines","electrophone","elong","embaire xylophone","end-blown flutes","endangered guitar","energized surfaces","engineer","engineering","ensemble","ergek shoor","erhu","erke","esraj","esseharpa","euphonium","ever buree","ewartophone","executive producer","falsetto","fan","featured","feedback","fiddlesticks","fidel płocka","field organ","field recordings","fife","filimbi","filouphone","finger cymbals","finger snaps","fire extinguisher","first tenor vocals","first violin","fiscorn","five string banjo","fiðla","flabiol","flabuta","flageolet","flamenco dancer","flamenco guitar","flanger","flapamba","flauta de millo","flexatone","flogera","floor slide","floor tom","fluba","flugelhorn","fluid piano","fluier","flumpet","flute","fluteophone","flutonette","flûte d'amour","foghorn","foot stomper","foot tapping","fortepiano","founder","four string banjo","four-course bouzouki","frame drum","free reeds","fretless banjo","fretless bass","fretless guitar","fretless keyboard","fretless zither","fretted dulcimer","friction drum","friction idiophones","fruja","frula","fuhun","fujara","funde","furruco","futozao shamisen","futujara","fuyara","fuzz","fyell","gachi","gadulka","gaida","gaita","gaita de foles","gaita hembra","gaita macho","gaita ponto","gaita transmontana","gaklab","gallal","gambang kayu","game call","gamelan","gandang","gandharvi","gangkoqui","gangsa","gangsa gong","gangsa kantilan","gangsa metallophone","gangsa pemadé","ganza","gaohu","garden rake","gardon","garmon","gasba","gemshorn","gendér","gendér barung","gendér panerus","gentorak","geomungo","ghatam","ghaychak","gidjak","gitouki","gittern","glass harmonica","glass harp","glass marimba","glockenspiel","glossolalia","goat horn trumpet","goblet drum","goje","gome","gong","gorosu","goura","gourd banjo","grage","graile","gralla","gralla baixa","gralla curta","gralla dolça","gralla llarga","gralla subbaixa","gramophone","grand piano","grande bourbonnaise","grandes cornemuses du Centre","graphic design","graw","great bass crumhorn","groovebox","group","growls","guacharaca","guache","guan","guasá","guayo","gudastviri","gudok","guest","guide-chant","guitalele","guitalin","guitar","guitar synthesizer","guitar technician","guitar-o-lin","guitarra conchera","guitarra de golpe","guitarra-da-terra micaelense","guitarra-da-terra terceirense","guitarrino","guitarro","guitjo","guitorgan","gumbass","gungon","guqin","gusle","gusli","guzheng","gwoka","gyaling","gyil","güira","güiro","h'arpeggione","haegeum","halldorophone","hambone","hammer","hammered dulcimer","hand gong","handbells","handclaps","hapi drum","hard drives","hardingfele","harmonic cannon","harmonica","harmonies","harmonium","harp","harp guitar","harp-lute","harpsichord","harsh vocals","haute-contre","headless tambourine","headphones","heckel-clarina","helicon","heligonka","hi-hat","hichiriki","highland hornpipe","hirtenschalmei","homemade instruments","hooked harp","hooligan drums","horagai","horn","horn arrangements","hosho","hosozao shamisen","host","hot fountain pen","huapanguera","hulusi","hummel","humming","hunting horn","huqin","hurdy gurdy","huēhuētl","hyperbass flute","härjedalspipa","hümmelchen","iPad","iPod","idioglottic reed","idiophones","ieta","igil","ikh khuur","illustration","ilu","images","imzad","incantation","innenklavier","instrument technician","instrumentation","instruments","interviewee","interviewer","intonarumori","ipu","itótele","iyá","jal tarang","jam block","janggu","jarana huasteca","jarana jarocha","jarana primera","jarana segunda","jauram","jawbone","jazzophone","jejy voatavo","jeli n'goni","jengglong","jez kernei","jing","jouhikko","jouras","jublag","jug","junggeum","jushichi-gen","jīnghú","k'lông pút","kabosy","kabuli rebab","kacapi","kacapi indung","kacapi rincik","kachapitar","kaganu","kagurabue","kalyuka","kamalen n'goni","kaman","kamānche","kane","kangling","kanjira","kanklės","kannel","kanonaki","kanrang","kantele","kanun","karinding","karinian","kartal","kaval","kawala","kayagum","kayamb","kazoo","kaşık","kebero","kemenche","kempli","kempul","kendang lanang","kengirge","kenken","kenkeni","kenong","kethuk","keyboard sitar","keyboards","keyolin","keytar","kha dae-kha bart","khaen","khaen baet","khaen jet","khanwe","khapchyk","khlui","khomok","khulsan khuur","khurtal","khuuchir","kick drum","kick snare","kidumbak","kissar","kit violin","kitchen utensils","kkwaenggwari","klavifon","klaxon","knee slapping","knife","kobyz","kobza","kokiriko","kokle","kokyū","kologo","koncovka","konghou","konnakol","kontra","kontrasípos duda","kopuz","kora","kortholt","kotamo","koto","krar","kroboto","kromaatiline kannel","kroncong","kubing","kubyz","kudüm","kugikly","kulintang","kutiriba","kutirindingo","kutiro","kutiyapi","kyam","kyl kyiak","kyêma","kèn","kōauau","kơ ní","lagerphone","lali","lambe","lamellate Jew's harp","lamellophones","langeleik","langspil","laouto","lap pedal steel guitar","lap steel","laser harp","laterna","launeddas","lavta","layout","laúd","lead guitar","lead tenor vocals","lead vocals","leader","leona","lepenelauta","librettist","lighting","limbi","liner notes","liner notes translation","lingm","liquindi","lira","lithophone","litungu","liuqin","live electronics","live producer","llautë","log drum","logo","lokanga bara","lokolé","long string drone","long string instrument","loops","loudspeaker","lounga","low D whistle","low whistle","ludaya","luikku","lujon","lumzdelis","lur","lurk","lusheng","lute","lute guitar","lute-harpsichord","lyra","lyra viol","lyre","lyric baritone vocals","lyric tenor vocals","lyricist","låtfiol","låtmandola","lõõtspill","m'bung m'bung","magnetic cartridge","makwa","male soprano vocals","mallets","malta","manager","mando guitar","mandobass","mandocello","mandol","mandola","mandolin","mandolin-banjo","mandolino","mandoliny","mandolone","mandolute","mandora","mandozither","mangala vadya","manipulation","manzello","maracas","marching trombone","marimba","marimba de chonta","marimbaphone","marímbula","masankop","masenko","mastering","matchbox","mazanki","mbira","medieval harp","megaphone","mejoranera","mellophone","mellophonium","melodeon","melodeon accordion","melodeon organ","melodica","membranophones","metallophones","metronome","meydan sazı","mezzo-soprano saxophone","mezzo-soprano vocals","mi-solo guitar","microphone","milanolo","military band","military snare drum","mime","mini 12-string guitar","miraj","mirwās","misattribution","mixing assistant","mixing consultant","mixing engineer","mizwid","mišnice","mobile phone","modular synthesizer","mohan veena","mohoceño","monkey stick","monochord","mora-oud","moraharpa","morchunga","morin khuur","morsing","motorized devices","mouth music","mouth speaker","mouthpiece","mridangam","mukkur","multi-instrumentalist","murgu","musette","music box","music contractor","music director","music librarian","musical bow","mute cornett","muyuz kernei","mwanzi","mänkeri","mùyú","müsa","n'goni","n'vike","nafīr","nagada","nagado-daiko","nagaswaram","nai","nail violin","nakers","naqareh","naqos","narration","nasal chorus","natural horn","natural trumpet","nağara","ndzedze","ney","ngoma","ngombi","nickelodeon","niju-gen","no-input mixing board","nohkan","noise","noise generator","nose flute","nose organ","nyangile","nyatiti","nyckelharpa","o'ele'n strings","objects","oboe","oboe d'amore","oboe da caccia","ocarina","octave mandola","octave splitter","octave violin","okónkolo","olifant","omele méta","ondes Martenot","ophicleide","optical synthesizers","orchestra","orchestral accompaniment","orchestral arrangements","organ","organetto","organistrum","orpharion","oscillator","oud","overdrive","overtone flute","ožragis","p'iri","packaging","page turner","paimensoittu","painting","pakhawaj","palitos","palmas","pan flute","pandeiro","pandero jarocho","pandur","pandura","panduri","panhuēhuētl","pardessus de viole","parkapzuk","patsu","pedal accordion","pedal harp","pedal keyboard","pedal piano","pedal steel guitar","pedals","pencilina","penny whistle","percussion","percussive dance","percussive objects","performer","phaser","phin","phonograph","photo editor","photography","physiophonograph","phách","pi joom","piano","piano accordion","piano arrangements","piano harp","piano wire","pianola","pibgorn","piccolo","piccolo balalaika","piccolo bass","piccolo guitar","piccolo oboe","piccolo trombone","piccolo trumpet","pickup","pifana","piffero","pifre","pinkillo","pipa","pipe","pipe organ","piri","pistoñ","pitch pipe","pitched percussion","piva","pkhachich","pku","plastic bucket","plate reverb","plectrum guitar","pleneras","plosive aerophones","pocket cornet","pocket trumpet","poet","polyphonia harmonica","pommer","pone pon","portative organ","portrait photography","positive organ","post horn","pots","pots and pans","practice chanter","practice goose","prato-e-faca","prepared guitar","prepared piano","preret","presenter","prim","prima balalaika","prkno","processing","producer","production","production consultant","production manager","programming","project producer","proofreader","prosvirelka","psalmodicon","psalterium","psaltery","pseudo-organ","pshina","pungi","pyngyr","pythagorean harp","pyzhatka","pūtōrino","qamlapsh","qanbūs","qilaut","qing","qraqeb","quadraphant","quartara","quena","quenacho","quinto","quinton","rabeca","rabel","rackett","radio","radio transmitter","raft zither","rahvakannel","rainstick","rajão","rap","ratchet","rattle","rauschpfeife","ravanhatta","ravanne","re-editing","re-recording engineer","rebab","rebec","rebolo","recitation","record executive","recorder","recording engineer","recordings","redactor","reed organ","reed trumpet","regal","remastering","remixer","renaissance guitar","repeater","repinique","repique de mão","requinto guitar","requinto jarocho","resonator guitar","resonator mandolin","reverb","reverse flugelhorn","rhaita","rhymes","rhythm guitar","rhythm section","rhythm section arranger","rhythm sticks","ribbon reed","rim-blown flutes","rindik","ring modulator","riq","rocar","rondador","roneat ek","ronroco","roto-tom","ruan","rubarp","ryuteki","sabar","sabar n'der","sabaro","sac de gemecs","sackbut","salamuri","salpinx","saluang","samica","samjuk","sample preparation","sampler","sampling","sandpaper blocks","sangban","sanshin","santoor","santur","sanxian","sarinda","sarod","saron","saron barung","saron demung","saron panerus","saron wayang","sarrusophone","sarune","sassa","satar","sato","satârâ","saung","saw","saw u","saxello","saxhorn","saxobone","saxonette","saxophone","saz","sazabo","scat","scenographer","scheitholt","schreierpfeifen","schäferpfeife","scottish tenor drum","scraper","scratching","screenprint","scythe","second tenor vocals","second violin","sekunda balalaika","selector","semi-acoustic guitar","seperewa","sequencer","sequencing","serp","serpent","serpent Forveille","serraggia","serunai","session musician","session vocalist","set designer","setar","shahi baaja","shakers","shakuhachi","shamisen","shantu","shanz","shargia","shawm","shehnai","shekeres","shells","sheng","sherter","shime-daiko","shinobue","shofar","shoor","shrieks","shulberry","shurangiz","shvi","shyngyrash","shō","sico","sign-language interpreter","sikulu","simsimiyya","singing bowls","single reed","single-headed dhol","single-stringed zithers","sintir","sipsi","siren","sistrum","sitar","sitar guitar","sitarla","sitello","siter","six string banjo","skratji","skudučiai","sleeve","sleeve design","sleeve notes","sleigh bells","slenthem","slide bass","slide guitar","slide piano log","slide saxophone","slide whistle","slit drum","snare drum","soft drink can","sogeum","sogo","soloist","somporing","songwriter","sopilka","sopranino clarinet","sopranino rauschpfeife","sopranino recorder","sopranino saxophone","sopranino schreierpfeifen","sopranissimo saxophone","soprano clarinet","soprano cornamuse","soprano cornet","soprano crumhorn","soprano flute","soprano guitar","soprano psaltery","soprano rebec","soprano recorder","soprano saxophone","soprano schreierpfeifen","soprano trombone","soprano violin","soprano vocals","sound designer","sound effects","sound icon","sound programming","sound sculpture","souravli","sousaphone","spilåpipa","spinet","spinet harpsichord","spinet piano","spinning drum","splash cymbal","spoken word","spoons","spring drum","spring güiro","spring reverb","square piano","sruti box","stabule","stage director","steel drum","steel guitar","steel tongue drum","stick dulcimer","stick zither","stomp box","straight alto saxophone","straight tenor saxophone","street organ","string arrangements","string drum guitar","string synthesizer","strings","stritch","stylophone","sub-contrabass balalaika","subcontrabass tubax","suka","suling","sundri","suona","supervisor","surbahar","surdo","suupeli","swarmandal","swarsangam","symphonie","synthesizer","synthetic vocals","sáo","sārangī","sīgǔ","t'bel","tabla","tabla tarang","table-top guitar","tabor","tabor pipe","tack piano","taegum","taepyeongso","taika","taiko","taishōgoto","talharpa","talk box","talking drum","talutt","tam tam","tama","tamba","tambin","tambor alegre","tambor llamador","tambor repicador","tambori","tamborim","tambour","tambouras","tambourine","tambura","tamburaško čelo","tamburello","tamburi","tamburica","tammorra","tanbur","tangent piano","tanjore","tantan","tap dancer","tap guitar","tape delay","tape loops","tape operator","tape replay keyboard","tapes","tar","tara quena","taraban","tarija","tarima","tarka","tarota","tasha","taus","tav shvi","tavil","tañador","tbilat","tea chest bass","telegraph key","telephone","television","temple blocks","tenor banjo","tenor bass","tenor cornamuse","tenor cornett","tenor crumhorn","tenor drums","tenor dulcian","tenor guitar","tenor oboe","tenor pan","tenor psaltery","tenor rackett","tenor rauschpfeife","tenor recorder","tenor saxophone","tenor trombone","tenor ukulele","tenor viol","tenor violin","tenor vocals","tenora","tenoroon","teponaztli","terraphone","tetsu-zutsu","thammátama","theater organ","theorbo","theremin","thon","three-course bouzouki","throat singing","thunder","thunder sheet","ti bwa","tible","tifa","tilinkó","timba","timbal","timbales","timbalitos","timbrel","timpani","timple","tindé","tingsha","tinya","tiorbino","tiple","tiptar","titles","tlalpanhuēhuētl","tom-tom","tonbak","tongatong","tonkori","topshur","torban","torototela","torupill","toubeleki","touxian","toy guitar","toy instruments","toy piano","toy xylophone","toys","tracanholas","tracking engineer","traditional dhol","train whistle","transferring","translator","transpositeur","transverse flute","transverse mirliton flutes","transverse shakuhachi","trash can","treatments","treble Anglo concertina","treble flute","treble recorder","treble viol","treble violin","treble vocals","trembita","tremolo","tremoloa","tres","tres-dos","triangle","tribute to","triccheballacche","tricordia","trikitixa","trimba","triple guitar pan","triple harp","tro","tromba marina","trombone","trombonium","tromboon","trombophone","trompa de Ribagorça","trumpbone","trumpet","trutruca","tréculas","trống chầu","tsampouna","tsuzumi","tuba","tube","tube drums","tubular bells","tulum","tumba","tumur khuur","tun","tuning fork","turntable","turtle shells","tussefløyte","tuyug","tuyuk shoor","txalaparta","txistu","tympanum","typewriter","typography","tárogató","tār","u-bolt","udu","uilleann pipes","ukulele","umtshingo","unitar","unpitched percussion","upright piano","vacuum cleaner","valdimbula","valide trombone","valiha","valve trombone","valve-slide trombone hybrids","valved cimbasso","variable tension chordophones","veena","venu","veuze","vibraphone","vichitra veena","vielle","viol","viola","viola amarantina","viola beiroa","viola braguesa","viola caipira","viola campaniça","viola cubana","viola d'amore","viola de cocho","viola dinâmica","violin","violin d'amore","violin octet family","violin uke","violino grande","violone","virginals","vocal arrangements","vocal contractor","vocal direction","vocal editor","vocal percussion","vocal producer","vocals","vocoder","voice flute","volynka","väikekannel","wah-wah","wah-wah pedal","walaycho","waldzither","walkie-talkie","wankara","washboard","washint","washtub bass","wassakhoumba","water drums","water flute","watercolor","whip","whirligig","whirling aerophones","whistle","whistling","white noise","willow flute","wind chimes","wind controller","wind gong","wind machine","wind wand","winds","wine glasses","wobble board","wood blocks","wood chimes","wooden frog","wooden horn trumpet","woodwind arrangements","woodwinds","writer","xiao","xirula","xomus","xun","xylophone","yakumo-goto","yangqin","yatga","yaylı tanbur","yehu","yelling","yodeling","yokobue","yoochin","yueqin","zabumba","zambomba","zampogna","zena","zerbaghali","zhaleika","zhonghu","zhongruan","zither","zuffolo","zurna","złóbcoki","çeng","çifteli","çöğür saz","çığırtma","épinette des Vosges","üçtelli sazı","čelović","đàn bầu","đàn môi","đàn nguyệt","đàn nhị","đàn t'rưng","đàn tam thập lục","đàn tranh","đàn tỳ bà","đàn đáy","ōdaiko","ōtsuzumi","šupelka"]
var role = document.createElement("select")
role.id="role"
role.multiple = true
for (i = 0; i < liste.length; i++) {
    var option = document.createElement("option");
    option.value = liste[i];
    option.text = liste[i];
    role.appendChild(option);
}
document.getElementById("ta_bold_members").parentNode.appendChild(role)

var years=["","?","present","1950","1951","1952","1953","1954","1955","1956","1957","1958","1959","1960","1961","1962","1963","1964","1965","1966","1967","1968","1969","1970","1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022"]
var year_j = document.createElement("SELECT")
year_j.id="year_j"
for (i = 0; i < years.length; i++) {
    option = document.createElement("OPTION");
    option.value = years[i];
    option.text = years[i];
    year_j.appendChild(option);
}
document.getElementById("ta_bold_members").parentNode.appendChild(year_j)

var year_l = document.createElement("SELECT")
year_l.id="year_l"
for (i = 0; i < years.length; i++) {
    option = document.createElement("OPTION");
    option.value = years[i];
    option.text = years[i];
    year_l.appendChild(option);
}
document.getElementById("ta_bold_members").parentNode.appendChild(year_l)


var button_add= document.createElement("A")
button_add.innerHTML=" +".bold()
button_add.style.fontSize="large"
button_add.style.cursor = "pointer"
    button_add.id="button_add"
document.getElementById("ta_bold_members").parentNode.appendChild(button_add)

    document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("BR"))
    document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("BR"))

//---------------------------------------------------------
var count=0
button_add.onclick=function(){

//------------------------------------
document.getElementById("members").value=""
var element=document.getElementById("ta_bold_members")
var flag=0
// for(i=0;i<15;i++){
while (element.nextElementSibling!=null){
    console.log(element)
if (element.id==("member_add")){
    if (element.value==""){}
    else {document.getElementById("members").value=document.getElementById("members").value+element.value}
}
if (element.id.includes("member_add_")==true){
    if (element.value==""){}
    else {document.getElementById("members").value=document.getElementById("members").value+", "+element.value}
}
if (element.id.includes("role")==true){
    if (element.value==""){}
    else {document.getElementById("members").value=document.getElementById("members").value+" ("+element.value}
}
if (element.id.includes("year_j")==true){
    if (element.value==""){}
    else if (element.previousElementSibling.value=="")
        {document.getElementById("members").value=document.getElementById("members").value+" ("+element.value+"-"}
    else {document.getElementById("members").value=document.getElementById("members").value+", "+element.value+"-"}
}
if (element.id.includes("year_l")==true){
    if (element.value==""){}
    else {document.getElementById("members").value=document.getElementById("members").value+element.value+")"}
}


element=element.nextElementSibling
}
    count=count+1
var member_add= document.createElement("INPUT")
member_add.id="member_add_"+count
member_add.placeholder="Member #"+(count+1)
document.getElementById("ta_bold_members").parentNode.appendChild(member_add)

// document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("INPUT"))//new name field
var role2 = document.createElement("SELECT")
role2.id="role_"+count
role2.multiple=true
// role2.value="Role"
for (i = 0; i < liste.length; i++) {
    var option = document.createElement("option");
    option.value = liste[i];
    option.text = liste[i];
    role2.appendChild(option);}
document.getElementById("ta_bold_members").parentNode.appendChild(role2)

var year_j = document.createElement("SELECT")
year_j.id="year_j"+count
for (i = 0; i < years.length; i++) {
    option = document.createElement("OPTION");
    option.value = years[i];
    option.text = years[i];
    year_j.appendChild(option);
}
document.getElementById("ta_bold_members").parentNode.appendChild(year_j)

var year_l = document.createElement("SELECT")
year_l.id="year_l"+count
for (i = 0; i < years.length; i++) {
    option = document.createElement("OPTION");
    option.value = years[i];
    option.text = years[i];
    year_l.appendChild(option);
}
document.getElementById("ta_bold_members").parentNode.appendChild(year_l)
// document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("INPUT"))//new year field
// document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("INPUT"))//new year field
document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("BR"))//new break
document.getElementById("ta_bold_members").parentNode.appendChild(document.createElement("BR"))//new break
}
//-------------------------------------------
 } )()

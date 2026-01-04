// ==UserScript==
// @name X Indexxx - Compact WideScreen Dark and Gray v.251
// @namespace indexxx.com
// @version 2.510.0
// @description Large and Compact indexxx.com for large screen (1920x1080) without junky results
// @author janvier56
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.indexxx.com/*
// @match https://www.indexxx.com/tags/
// @match https://www.indexxx.com/modellink?*
// @match https://www.indexxx.com/modelcomment*
// @match http://www.indexxx.com/modelcomment*
// @match http://www.indexxx.com/modellink?*
// @match https://www.indexxx.com/mybabe?*
// @match https://www.indexxx.com/contact*
// @match https://www.indexxx.com/mysets*
// @match https://www.indexxx.com/websites/*
// @match https://www.indexxx.com/mybabetext?*
// @match https://www.indexxx.com/tags/*
// @match https://www.indexxx.com/tagcomment?*
// @match https://www.indexxx.com/top*
// @match https://www.indexxx.com/m?*
// @match https://www.indexxx.com/search/?*
// @match https://www.indexxx.com/settags/*
// @match https://www.indexxx.com/set/*
// @match https://www.indexxx.com/home*
// @downloadURL https://update.greasyfork.org/scripts/418863/X%20Indexxx%20-%20Compact%20WideScreen%20Dark%20and%20Gray%20v251.user.js
// @updateURL https://update.greasyfork.org/scripts/418863/X%20Indexxx%20-%20Compact%20WideScreen%20Dark%20and%20Gray%20v251.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `

  /* ==== X Indexxx - Compact WideScreen Dark and Gray  v.251 (new251) - DEV CHROME ==
  (With GM) "Indexx Helper(just script) - ADD CSS Selector for user name" ==== */

  /* ====
  USERSTYLES to Use with STYLISH (https://addons.mozilla.org/fr/firefox/addon/stylish/ )
  ► ► CSS theme for LARGE screen (1920x1080) : 
  ► Optimize the space with a widescreen.
  ► Organize each page for less scrolling:
  - Thumbnail compact Mosaic take the maximun of the screen.
  ► Many additional Infos added and organized when is possible:
   
  ► Delete Publicity and adverts and junky sites in results  etc...
  ==== */

  /* ==== START - X Indexxx - FLAG INDICATOR  ===== */


  /* SUPP */
  .twitter {
  	display: none !important;
  }

  /* (new246) INFOS TOOL TIP  */
  .infoToolData {
      font-size: 15px  !important;
  }


  /* (new239) TEST FLAGS INDICATOR */

  #sidebar h5  + select {
  position: absolute !important;
  display: inline-block !important;
  width: 139px !important;
      top:30.3vh !important;
  right: 35px!important;
  margin: 0 0 30px 0 !important;
  color: white !important;
  background: #333 !important;
  }
  #sidebar h5  + select + .d-flex.flex-row {
  margin: 45px 0 0px 0 !important;
  }

  a#countryTopModelsLink:before {
  content: "XXX" !important;
  position: absolute !important;
  display: inline-block !important;
  width: 150px !important;
  top: 28vh !important;
  right: 5px !important;
  visibility: visible !important;
  z-index: 500000000 !important;
  color: white  !important;
  background: red !important;
  }

  select[name="defaultLayoutContainer:topModelCountrySelect"] >option {
  font-size: 0px !important;
  background: #111 !important;
  }
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option:after {
  font-size: 13px !important;
  color: white  !important;
  background: green !important;
  }

  /* AE - United Arab Emirates */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="0"]:after { content: "United Arab Emirates" !important;} 
  a#countryTopModelsLink[href="/top?cc=ae"]:before{content: "United Arab Emirates" !important;}
  /* AF - Afghanistan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="1"]:after { content: "Afghanistan" !important; }
  a#countryTopModelsLink[href="/top?cc=af"]:before{content: "Afghanistan" !important;}
  /* AL - Albania */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="2"]:after { content: "Albania" !important; }
  a#countryTopModelsLink[href="/top?cc=al"]:before{content: "Albania" !important;}
  /* AM - Armenia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="3"]:after { content: "Armenia" !important; }
  a#countryTopModelsLink[href="/top?cc=am"]:before{content: "Armenia" !important;}
  /* AO - Angola */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="4"]:after { content: " Angola" !important; }
  a#countryTopModelsLink[href="/top?cc=ao"]:before{content: "Angola" !important;}
  /* AR - Argentina */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="5"]:after { content: "Argentina" !important; }
  a#countryTopModelsLink[href="/top?cc=ar"]:before{content: "Argentina" !important;}
  /* AT - Austria */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="6"]:after { content: "Austria" !important; }
  a#countryTopModelsLink[href="/top?cc=at"]:before{content: "Austria" !important;}
  /* AU - Australia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="7"]:after { content: "Australia" !important; }
  a#countryTopModelsLink[href="/top?cc=au"]:before{content: "Australia" !important;}
  /* BA - Bosnia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="8"]:after { content: "Bosnia" !important; }
  a#countryTopModelsLink[href="/top?cc=ba"]:before{content: "Bosnia" !important;}
  /* BB - Barbados */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="9"]:after { content: "Barbados" !important; }
  a#countryTopModelsLink[href="/top?cc=bb"]:before{content: "Barbados" !important;}
  /* BD - Bangladesh */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="10"]:after { content: "Bangladesh" !important; }
  a#countryTopModelsLink[href="/top?cc=bd"]:before{content: "Bangladesh" !important;}
  /* BE - Belgium */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="11"]:after { content: "Belgium" !important; }
  a#countryTopModelsLink[href="/top?cc=be"]:before{content: "Belgium" !important;}
  /* BG - Bulgaria */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="12"]:after { content: "Bulgaria" !important; }
  a#countryTopModelsLink[href="/top?cc=bg"]:before{content: "Bulgaria" !important;}
  /* BI -Burundi */ 
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="13"]:after { content: "Burundi" !important; }
  a#countryTopModelsLink[href="/top?cc=bi"]:before{content: "Burundi" !important;}
  /* BM - Bermuda */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="14"]:after { content: "Bermuda" !important; }
  a#countryTopModelsLink[href="/top?cc=bm"]:before{content: "Bermuda" !important;}
  /* BO - Bolivia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="15"]:after { content: "Bolivia" !important; }
  a#countryTopModelsLink[href="/top?cc=bo"]:before{content: "Bolivia" !important;}
  /* BR - Brazil */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="16"]:after { content: "Brazil" !important; }
  a#countryTopModelsLink[href="/top?cc=br"]:before{content: "Brazil" !important;}
  /* BS - Bahamas */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="17"]:after { content: "Bahamas" !important; }
  a#countryTopModelsLink[href="/top?cc=bs"]:before{content: "Bahamas" !important;}
  /* BY - Belarus */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="18"]:after { content: "Belarus" !important; }
  a#countryTopModelsLink[href="/top?cc=by"]:before{content: "Belarus" !important;}
  /* BZ - Belize */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="19"]:after { content: "Belize" !important; }
  a#countryTopModelsLink[href="/top?cc=bz"]:before{content: "Belize" !important;}
  /* CA - Canada */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="20"]:after { content: "Canada" !important; }
  a#countryTopModelsLink[href="/top?cc=ca"]:before{content: "Canada" !important;}
  /* CH - Switzerland */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="21"]:after { content: "Switzerland" !important; }
  a#countryTopModelsLink[href="/top?cc=ch"]:before{content: "Switzerland" !important;}
  /* CL - Chile */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="22"]:after { content: "Chile" !important; }
  a#countryTopModelsLink[href="/top?cc=cl"]:before{content: "Chile" !important;}
  /* CM - Cameroon */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="23"]:after { content: "Cameroon" !important; }
  a#countryTopModelsLink[href="/top?cc=cm"]:before{content: "Cameroon" !important;}
  /* CN - China */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="24"]:after { content: "China" !important; }
  a#countryTopModelsLink[href="/top?cc=cn"]:before{content: "China" !important;}
  /* CO - Colombia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="25"]:after { content: "Colombia" !important; }
  a#countryTopModelsLink[href="/top?cc=co"]:before{content: "Colombia" !important;}
  /* CR - Costa Rica */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="26"]:after { content: "Costa Rica" !important; }
  a#countryTopModelsLink[href="/top?cc=cr"]:before{content: "Costa Rica" !important;}
  /* CU - Cuba */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="27"]:after { content: "Cuba" !important; }
  a#countryTopModelsLink[href="/top?cc=cu"]:before{content: "Cuba" !important;}
  /* CY - Cyprus */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="28"]:after { content: "Cyprus" !important; }
  a#countryTopModelsLink[href="/top?cc=cy"]:before{content: "Cyprus" !important;}
  /* CZ - Czechia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="29"]:after { content: "Czechia" !important; }
  a#countryTopModelsLink[href="/top?cc=cz"]:before{content: "Czechia" !important;}
  /* DE - Germany */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="30"]:after { content: "Germany" !important; }
  a#countryTopModelsLink[href="/top?cc=de"]:before{content: "Germany" !important;}
  /* DJ - Djibouti */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="31"]:after { content: "Djibouti" !important; }
  a#countryTopModelsLink[href="/top?cc=dj"]:before{content: "Djibouti" !important;}
  /* DK - Denmark */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="32"]:after { content: "Denmark" !important; }
  a#countryTopModelsLink[href="/top?cc=dk"]:before{content: "Denmark" !important;}
  /* DO - Dominican Republic */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="33"]:after { content: "Dominican Republic" !important; }
  a#countryTopModelsLink[href="/top?cc=do"]:before{content: "Dominican Republic" !important;}
  /* DZ - Algeria */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="34"]:after { content: "Algeria" !important; }
  a#countryTopModelsLink[href="/top?cc=dz"]:before{content: "Algeria" !important;}
  /* EC - Ecuador */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="35"]:after { content: "Ecuador" !important; }
  a#countryTopModelsLink[href="/top?cc=ec"]:before{content: "Ecuador" !important;}
  /* EE - Estonia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="36"]:after { content: "Estonia" !important; }
  a#countryTopModelsLink[href="/top?cc=ee"]:before{content: "Estonia" !important;}
  /* EG - Egypt */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="37"]:after { content: "Egypt" !important; }
  a#countryTopModelsLink[href="/top?cc=eg"]:before{content: "Egypt" !important;}
  /* ES -Spain  */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="38"]:after { content: "Spain" !important; }
  a#countryTopModelsLink[href="/top?cc=es"]:before{content: "Spain" !important;}
  /* ET - Ethiopia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="39"]:after { content: "Ethiopia" !important; }
  a#countryTopModelsLink[href="/top?cc=et"]:before{content: "Ethiopia" !important;}
  /* FI - Finland */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="40"]:after { content: "Finland" !important; }
  a#countryTopModelsLink[href="/top?cc=fi"]:before{content: "Finland" !important;}
  /* FR - France */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="41"]:after { content: "France" !important; }
  a#countryTopModelsLink[href="/top?cc=fr"]:before{content: "France" !important;}
  /* GB - United Kingdom */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="42"]:after { content: "United Kingdom" !important; }
  a#countryTopModelsLink[href="/top?cc=gb"]:before{content: "United Kingdom" !important;}
  /* GE - Georgia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="43"]:after { content: "Georgia" !important; }
  a#countryTopModelsLink[href="/top?cc=ge"]:before{content: "Georgia" !important;}
  /* GH - Ghana */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="44"]:after { content: "Ghana" !important; }
  a#countryTopModelsLink[href="/top?cc=gh"]:before{content: "Ghana" !important;}
  /* GN - Guinea */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="45"]:after { content: "Guinea" !important; }
  a#countryTopModelsLink[href="/top?cc=gn"]:before{content: "Guinea" !important;}
  /* GR - Greece */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="46"]:after { content: "Greece" !important; }
  a#countryTopModelsLink[href="/top?cc=gr"]:before{content: "Greece" !important;}
  /* GT - Guatemala */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="47"]:after { content: "Guatemala" !important; }
  a#countryTopModelsLink[href="/top?cc=gt"]:before{content: "Guatemala" !important;}
  /* GY - Guyana */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="48"]:after { content: "Guyana" !important; }
  a#countryTopModelsLink[href="/top?cc=gy"]:before{content: "Guyana" !important;}
  /* HN - Honduras */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="49"]:after { content: "Honduras" !important; }
  a#countryTopModelsLink[href="/top?cc=hn"]:before{content: "Honduras" !important;}
  /* HR - Haiti */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="50"]:after { content: "Haiti" !important; }
  a#countryTopModelsLink[href="/top?cc=hr"]:before{content: "Haiti" !important;}
  /* HT - Haiti */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="51"]:after { content: "Haiti" !important; }
  a#countryTopModelsLink[href="/top?cc=ht"]:before{content: "Haiti" !important;}
  /* HU - Hungary */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="52"]:after { content: "Hungary" !important; }
  a#countryTopModelsLink[href="/top?cc=hu"]:before{content: "Hungary" !important;}
  /* ID - Indonesia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="53"]:after { content: "Indonesia" !important; }
  a#countryTopModelsLink[href="/top?cc=id"]:before{content: "Indonesia" !important;}
  /* IE - Ireland */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="54"]:after { content: "Ireland" !important; }
  a#countryTopModelsLink[href="/top?cc=ie"]:before{content: "Ireland" !important;}
  /* IL - Israel */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="55"]:after { content: "Israel" !important; }
  a#countryTopModelsLink[href="/top?cc=il"]:before{content: "Cyprus" !important;}
  /* IN - India */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="56"]:after { content: "India" !important; }
  a#countryTopModelsLink[href="/top?cc=in"]:before{content: "India" !important;}
  /* IQ - Iraq */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="57"]:after { content: "Iraq" !important; }
  a#countryTopModelsLink[href="/top?cc=iq"]:before{content: "Iraq" !important;}
  /* IR - Iran */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="58"]:after { content: "Iran" !important; }
  a#countryTopModelsLink[href="/top?cc=ir"]:before{content: "Iran" !important;}
  /* IS - Iceland */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="59"]:after { content: "Iceland" !important; }
  a#countryTopModelsLink[href="/top?cc=is"]:before{content: "Iceland" !important;}
  /* IT - Italy */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="60"]:after { content: "Italy" !important; }
  a#countryTopModelsLink[href="/top?cc=it"]:before{content: "Italy" !important;}
  /* JM - Jamaica */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="61"]:after { content: "Jamaica" !important; }
  a#countryTopModelsLink[href="/top?cc=jm"]:before{content: "Jamaica" !important;}
  /* JO - Jordan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="62"]:after { content: "Jordan" !important; }
  a#countryTopModelsLink[href="/top?cc=jo"]:before{content: "Jordan" !important;}
  /* JP - Japan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="63"]:after { content: "Japan" !important; }
  a#countryTopModelsLink[href="/top?cc=jp"]:before{content: "Japan" !important;}
  /* KE - Kenya */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="64"]:after { content: "Kenya" !important; }
  a#countryTopModelsLink[href="/top?cc=ke"]:before{content: "Kenya" !important;}
  /* KG - Kyrgyzstan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="65"]:after { content: "Kyrgyzstan" !important; }
  a#countryTopModelsLink[href="/top?cc=kg"]:before{content: "Cyprus" !important;}
  /* KH - Cambodia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="66"]:after { content: "Cambodia" !important; }
  a#countryTopModelsLink[href="/top?cc=kh"]:before{content: "Cambodia" !important;}
  /* KR - South Korea */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="67"]:after { content: "South Korea" !important; }
  a#countryTopModelsLink[href="/top?cc=kr"]:before{content: "South Korea" !important;}
  /* KZ - Kazakhstan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="68"]:after { content: "Kazakhstan" !important; }
  a#countryTopModelsLink[href="/top?cc=kz"]:before{content: "Kazakhstan" !important;}
  /* LA - Laos */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="69"]:after { content: "Laos" !important; }
  a#countryTopModelsLink[href="/top?cc=la"]:before{content: "Laos" !important;}
  /* LB - Lebanon */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="70"]:after { content: "Lebanon" !important; }
  a#countryTopModelsLink[href="/top?cc=lb"]:before{content: "Lebanon" !important;}
  /* LK - Sri Lanka*/
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="71"]:after { content: "Sri Lanka" !important; }
  a#countryTopModelsLink[href="/top?cc=lk"]:before{content: "Sri Lanka" !important;}
  /* LT - Lithuania */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="72"]:after { content: "Lithuania" !important; }
  a#countryTopModelsLink[href="/top?cc=lt"]:before{content: "Lithuania" !important;}
  /* LV - Latvia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="73"]:after { content: "Latvia" !important; }
  a#countryTopModelsLink[href="/top?cc=lv"]:before{content: "Latvia" !important;}
  /* MA - Morocco */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="74"]:after { content: "Morocco" !important; }
  a#countryTopModelsLink[href="/top?cc=ma"]:before{content: "Morocco" !important;}
  /* MD - Moldova */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="75"]:after { content: "Moldova" !important; }
  a#countryTopModelsLink[href="/top?cc=md"]:before{content: "Moldova" !important;}
  /* ME - Montenegro */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="76"]:after { content: "Montenegro" !important; }
  a#countryTopModelsLink[href="/top?cc=cy"]:before{content: "Montenegro" !important;}
  /* MK - North Macedonia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="77"]:after { content: "North Macedonia" !important; }
  a#countryTopModelsLink[href="/top?cc=me"]:before{content: "North Macedonia" !important;}
  /* MM - Myanmar */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="78"]:after { content: "Myanmar" !important; }
  a#countryTopModelsLink[href="/top?cc=mm"]:before{content: "Myanmar" !important;}
  /* MN - Mongolia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="79"]:after { content: "Mongolia" !important; }
  a#countryTopModelsLink[href="/top?cc=mn"]:before{content: "Mongolia" !important;}
  /* MQ - Martinique */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="80"]:after { content: "Martinique" !important; }
  a#countryTopModelsLink[href="/top?cc=mq"]:before{content: "Martinique" !important;}
  /* MT - Malta */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="81"]:after { content: "Malta" !important; }
  a#countryTopModelsLink[href="/top?cc=mt"]:before{content: "Malta" !important;}
  /* MU - Mauritius */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="82"]:after { content: "Mauritius" !important; }
  a#countryTopModelsLink[href="/top?cc=mu"]:before{content: "Mauritius" !important;}
  /* MX - Mexico */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="83"]:after { content: "Mexico" !important; }
  a#countryTopModelsLink[href="/top?cc=mx"]:before{content: "Mexico" !important;}
  /* MY - Malaysia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="84"]:after { content: "Malaysia" !important; }
  a#countryTopModelsLink[href="/top?cc=my"]:before{content: "Malaysia" !important;}
  /* NG - Nigeria */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="85"]:after { content: "Nigeria" !important; }
  a#countryTopModelsLink[href="/top?cc=ng"]:before{content: "Nigeria" !important;}
  /* NI - Nicaragua */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="86"]:after { content: "Nicaragua" !important; }
  a#countryTopModelsLink[href="/top?cc=ni"]:before{content: "Nicaragua" !important;}
  /* NL - Netherlands */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="87"]:after { content: "Netherlands" !important; }
  a#countryTopModelsLink[href="/top?cc=nl"]:before{content: "Netherlands" !important;}
  /* NO - Norway */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="88"]:after { content: "Norway" !important; }
  a#countryTopModelsLink[href="/top?cc=no"]:before{content: "Norway" !important;}
  /* NP - Nepal */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="89"]:after { content: "Nepal" !important; }
  a#countryTopModelsLink[href="/top?cc=np"]:before{content: "Nepal" !important;}
  /* NZ - New Zealand */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="90"]:after { content: "New Zealand" !important; }
  a#countryTopModelsLink[href="/top?cc=nz"]:before{content: "New Zealand" !important;}
  /* PA - Panama */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="91"]:after { content: "Panama" !important; }
  a#countryTopModelsLink[href="/top?cc=pa"]:before{content: "Panama" !important;}
  /* PE - Peru */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="92"]:after { content: "Peru" !important; }
  a#countryTopModelsLink[href="/top?cc=pe"]:before{content: "Peru" !important;}
  /* PH - Philippines */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="93"]:after { content: "Philippines" !important; }
  a#countryTopModelsLink[href="/top?cc=ph"]:before{content: "Philippines" !important;}
  /* PK - Pakistan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="94"]:after { content: "Pakistan" !important; }
  a#countryTopModelsLink[href="/top?cc=pk"]:before{content: "Pakistan" !important;}
  /* PL - Poland */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="95"]:after { content: "Poland" !important; }
  a#countryTopModelsLink[href="/top?cc=pl"]:before{content: "Poland" !important;}
  /* PR - Puerto Rico */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="96"]:after { content: "Puerto Rico" !important; }
  a#countryTopModelsLink[href="/top?cc=pr"]:before{content: "Puerto Rico" !important;}
  /* PT - Portugal */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="97"]:after { content: "Portugal" !important; }
  a#countryTopModelsLink[href="/top?cc=pt"]:before{content: "Portugal" !important;}
  /* PY - Paraguay */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="98"]:after { content: "Paraguay" !important; }
  a#countryTopModelsLink[href="/top?cc=pa"]:before{content: "Paraguay" !important;}
  /* RO - Romania */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="99"]:after { content: "Romania" !important; }
  a#countryTopModelsLink[href="/top?cc=ro"]:before{content: "Romania" !important;}
  /* RS - Serbia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="100"]:after { content: "Serbia" !important; }
  a#countryTopModelsLink[href="/top?cc=rs"]:before{content: "Serbia" !important;}
  /* RU - Russia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="101"]:after { content: "Russia" !important; }
  a#countryTopModelsLink[href="/top?cc=ru"]:before{content: "Russia" !important;}
  /* SE - Sweden */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="102"]:after { content: "Sweden" !important; }
  a#countryTopModelsLink[href="/top?cc=se"]:before{content: "Sweden" !important;}
  /* SG - Singapore */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="103"]:after { content: "Singapore" !important; }
  a#countryTopModelsLink[href="/top?cc=sg"]:before{content: "Singapore" !important;}
  /* SI - Slovenia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="104"]:after { content: "Slovenia" !important; }
  a#countryTopModelsLink[href="/top?cc=si"]:before{content: "Slovenia" !important;}
  /* SK - Slovakia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="105"]:after { content: "Slovakia" !important; }
  a#countryTopModelsLink[href="/top?cc=sk"]:before{content: "Slovakia" !important;}
  /* SL - Sierra Leone */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="106"]:after { content: "Sierra Leone" !important; }
  a#countryTopModelsLink[href="/top?cc=sl"]:before{content: "Sierra Leone" !important;}
  /* SN - Senegal */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="107"]:after { content: "Senegal" !important; }
  a#countryTopModelsLink[href="/top?cc=sn"]:before{content: "Senegal" !important;}
  /* SO - Somalia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="108"]:after { content: "Somalia" !important; }
  a#countryTopModelsLink[href="/top?cc=so"]:before{content: "Somalia" !important;}
  /* SR - Suriname */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="109"]:after { content: "Suriname" !important; }
  a#countryTopModelsLink[href="/top?cc=sr"]:before{content: "Suriname" !important;}
  /* SV - El Salvador */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="110"]:after { content: "El Salvador" !important; }
  a#countryTopModelsLink[href="/top?cc=sv"]:before{content: "El Salvador" !important;}
  /* SY - Syria */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="111"]:after { content: "Syria" !important; }
  a#countryTopModelsLink[href="/top?cc=sy"]:before{content: "Syria" !important;}
  /* TH - Thailand */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="112"]:after { content: "Thailand" !important; }
  a#countryTopModelsLink[href="/top?cc=th"]:before{content: "Thailand" !important;}
  /* TJ - Tajikistan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="113"]:after { content: "Tajikistan" !important; }
  a#countryTopModelsLink[href="/top?cc=tj"]:before{content: "Tajikistan" !important;}
  /* TM - Turkmenistan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="114"]:after { content: "Turkmenistan" !important; }
  a#countryTopModelsLink[href="/top?cc=tm"]:before{content: "Turkmenistan" !important;}
  /* TN - Tunisia */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="115"]:after { content: "Tunisia" !important; }
  a#countryTopModelsLink[href="/top?cc=tn"]:before{content: "Tunisia" !important;}
  /* TR - Turkey */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="116"]:after { content: "Turkey" !important; }
  a#countryTopModelsLink[href="/top?cc=tr"]:before{content: "Turkey" !important;}
  /* TRANS - Transgender */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="117"]:after { content: "Transgender" !important; }
  a#countryTopModelsLink[href="/top?cc=trans"]:before{content: "Transgender" !important;}
  /* TT - Trinidad and Tobago */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="118"]:after { content: "Trinidad and Tobago" !important; }
  a#countryTopModelsLink[href="/top?cc=tt"]:before{content: "Trinidad and Tobago" !important;}
  /* TW - Taiwan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="119"]:after { content: "Taiwan" !important; }
  a#countryTopModelsLink[href="/top?cc=tw"]:before{content: "Taiwan" !important;}
  /* UA - Ukraine */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="120"]:after { content: "Ukraine" !important; }
  a#countryTopModelsLink[href="/top?cc=ua"]:before{content: "Ukraine" !important;}
  /* US - United States */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="121"]:after { content: "United States" !important; }
  a#countryTopModelsLink[href="/top?cc=us"]:before{content: "United States" !important;}
  /* UY - Uruguay */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="122"]:after { content: "Uruguay" !important; }
  a#countryTopModelsLink[href="/top?cc=uy"]:before{content: "Uruguay" !important;}
  /* UZ - Uzbekistan */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="123"]:after { content: "Uzbekistan" !important; }
  a#countryTopModelsLink[href="/top?cc=uz"]:before{content: "Uzbekistan" !important;}
  /* VE - Venezuela */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="124"]:after { content: "Venezuela" !important; }
  a#countryTopModelsLink[href="/top?cc=ve"]:before{content: "Venezuela" !important;}
  /* VN - Viet Nam */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="125"]:after { content: "Viet Nam" !important; }
  a#countryTopModelsLink[href="/top?cc=vn"]:before{content: "Viet Nam" !important;}
  /* YE - Yemen */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="126"]:after { content: "Yemen" !important; }
  a#countryTopModelsLink[href="/top?cc=ye"]:before{content: "Yemen" !important;}
  /* ZA  - South Africa */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="127"]:after { content: "South Africa" !important; }
  a#countryTopModelsLink[href="/top?cc=za"]:before{content: "Cyprus" !important;}
  /* ZW - Zimbabwe */
  select[name="defaultLayoutContainer:topModelCountrySelect"] >option[value="128"]:after { content: "Zimbabwe" !important; }
  a#countryTopModelsLink[href="/top?cc=zw"]:before{content: "Zimbabwe" !important;}

  /* === END ==== X Indexxx - FLAG INDICATOR  ===== */


  /* === WIDESRCEEN === */
  /* #model-header > #tagBox ~ div  .model-snippet-box {
      background: lime !important;
  }
  #model-header > #tagBox + div .model-snippet-box {
      background: orange !important;
  }
  #model-header > div .model-snippet-box:not(.votebar) {
      background: olive !important;
  }

  .model-snippet-box:not(.votebar) {
      background: olive !important;
  border: 1px solid aqua !important;
  } */

  /* (new233) FIRST */
  #model-header > .clearfix:not(.block1) {
      display: none !important;
  }
  #model-header > div + div + div:nth-child(4){
      position: absolute !important;
      display: inline-block !important;
      max-width: 194px;
      min-width: 194px;
      height: 22px !important;
      left: 27px !important;
      top: 14.5vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 !important;
      z-index: 1 !important;
      overflow: hidden !important;
  /*background-color: #c0c !important; */
  /* border: 1px dashed yellow !important; */
  }
  #model-header > div + div + div:nth-child(4) .model-snippet-box {
      float: left;
      margin: 0 0 0 0 !important;
  }
  #model-header > div + div + div:nth-child(4) .box-title {
  height: 21px !important;
      background-color: #c0c;
  }
  #model-header > div + div + div:nth-child(4)  .modelNote ,
  #model-header > div + div + div:nth-child(4)  textarea.modelNote {
      max-height: 80.2vh !important;
      max-width: 386px !important;
      padding: 0 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /* background: #222 !important; */
  }
  #model-header > div + div + div:nth-child(4) .box-body > form textarea.modelNote{
      min-height: 40.2vh !important;
      max-height: 75.2vh !important;
      max-width: 386px !important;
  /*     padding: 0 5px !important; */
      overflow: hidden !important;
      overflow-y: auto !important;
  /* background: #222 !important; */
  }

  /* (new243) 2nd - NOT TWITTER / EMPTY - A VOIR */
  #model-header > div + div + div:nth-child(5):not(.twitter):not(.clearfix) {
      position: absolute !important;
  	display: inline-block !important;
  	max-width: 194px;
  	min-width: 194px;
  	height: 22px !important;
  	left: 230px !important;
      top: 14.5vh !important;
  	margin: 0 0 0 0 !important;
      padding: 0 !important;
      z-index: 1 !important;
  	overflow: hidden !important;
  background-color: #c0c !important;
  /*border: 1px dashed aqua !important;*/
  }
  #model-header> div + div + div:nth-child(5):not(.twitter) .model-snippet-box {
      float: left;
      width: 100% !important;
      margin: 0 0 0 0 !important;
  background-color: #c0c !important;
  }
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-title {
  height: 20px !important;
      background-color: #c0c !important;
  }
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-body {
       padding: 0 !important;
  }
  #model-header > div + div + div:nth-child(5):not(.twitter)  .modelNote ,
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-body > form textarea.modelNote{
      min-height: 40.2vh !important;
      max-height: 75.2vh !important;
      max-width: 386px !important;
  padding: 0 5px !important;
  overflow: hidden !important;
  overflow-y: auto !important;
  }


  /* (new243) HOVER BOTH */
  #model-header > div + div + div:nth-child(5):not(.twitter):hover ,
  #model-header > div + div + div:nth-child(4):hover {
      width: auto !important;
      max-width: 390px !important;
      min-width: 390px !important;
      height: auto !important;
      min-height: 346px !important;
      z-index: 500000 !important;
      overflow: visible !important;
  /*background-color: red !important;*/
  /*border: 1px dashed yellow !important;*/
  }

  /* (new243) EDIT BUTT - FIRST / 2 nd */
  #model-header > div + div + div:nth-child(4):not(.twitter) .box-title + .box-body > div .modelNote + div ,
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-title + .box-body > div .modelNote + div   {
      position: absolute;
      width: 195px !important;
      top: -1px !important;
      right: -3px !important;
      padding: 0 5px 0 0 !important;
      text-align: right !important;
  visibility: hidden !important;
  /* background: green !important; */
  }
  /* (new243) EDIT BUTT - FIRST */
  #model-header > div + div + div:nth-child(4):not(.twitter):hover .box-title + .box-body > div .modelNote + div   {
      top: 2px !important;
      right: 20px !important;
      text-align: center  !important;
      visibility: visible !important;
  /* background: green !important; */
  }
  #model-header > div + div + div:nth-child(4):not(.twitter):hover .box-title + .box-body > div .modelNote + div a  {
      margin: 0 0 0 100px !important;
      padding: 0 10px  !important;
      text-align: center  !important;
      visibility: visible !important;
  color: gold !important;
  background: green !important;
  }

  /* (new243) EDIT BUTT - 2 nd */
  #model-header > div + div + div:nth-child(5):not(.twitter):hover .box-title + .box-body > div .modelNote + div   {
      height: 20px !important;
      right: 10px !important;
      top: 0 !important;
      padding: 0 5px  !important;
      text-align: center  !important;
      visibility: visible !important;
  /* background: red !important; */
  }
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-title + .box-body > div .modelNote + div a {
      margin: 0 0 0 80px !important;
      padding: 0 10px  !important;
  color: gold !important;
  background: green !important;
  }
  /* 2nd - HOVER */
  #model-header > div + div + div:nth-child(5):not(.twitter) .box-title + .box-body > div .modelNote + div:hover a {
      margin: 0 0 0 80px !important;
      padding: 0 10px  !important;
  color: gold !important;
  /*background: blueviolet !important;*/
  }

  /* (new73) TEST - NOTE INDICATOR */
  /* .modelNote + div */
  .modelNote > p:first-of-type:before {
      content: "💡" ;
      position: absolute ;
      width: 20px ;
      height: 20px ;
      margin-top: -22px !important;
      margin-left: 140px ;
      text-align: center ;
      z-index: 50000 ;
  background-color: red !important;
  }
  /* WITH NOTES */
  .modelNote > p:not(:empty):first-of-type:before {
      content: "💡" ;
  background-color: green !important;
  }


  /* (new88) THANKS MESSAGE - LINK - ==== */
  .feedbackPanelINFO {
      margin-top: 0px !important;
      font-size: 18px !important;
  }

  .BTAlertFeedbackPanel ul {
      height: 25px !important;
  }
  .alert {
      border-radius: 0.25rem;
      margin-bottom: 0 !important;
      padding: 2px 5px !important;
      font-size: 15px !important;
  }
  /* HIGHLIGHT USER NAME (With GM "Indexx Helper(just script) - ADD CSS Selector for user name) - === */
  .authorName.User[data-txt="janvier56"]:before {
      content: "Comment by ME (NO Nudevista)" ;
      position: absolute ;
      display: inline-block ;
      width: 210px ;
      top: 4px ;
      right: 0 ;
      text-align: center ;
  color: gold ;
  background: red ;
  }
  .authorName.User[data-txt="janvier56"]:after {
      content: "." ;
      float: left ;
      clear: both !important;
      width: 5px ;
      height: 70px ;
      line-height: 0px ;
      text-align: center ;
  background: red ;
  color: gold ;

  }
  .messageArea {
      display: inline-block  !important;
      width: 322px !important;
      padding: 0 0 0 10px !important;
  }
  /* BOF - IMAGES / INFOS with WATERMARK - === */
  .authorName.User[data-txt="janvier56"] {
      color: green !important;
  background: gold !important;
  }
  /* WEBSITE OVERVIEW - === */
  #model-comments-box {
      margin: 1px 10px 10px 0 !important;
  }
  /* NEW DESIING - === */
  body[_adv_already_used="true"] {
      display: inline-block ;
      min-height: 100% ;
      width: 100% ;
  }
  #leftCol {
      width: 1663px ;
  }
  #leftCol .navbar {
      position: relative;
      display: inline-block ;
      margin-top: 0px;
  }
  .leftContainer  {
      float: right !important;
      height: 35px !important;
      margin-top: 12px !important;
      margin-right: 72px !important;
      border-radius: 5px !important;
  background-color: #222;
  }
  .leftContainer .navbar-expand.modelsLettersNav.navbar  {
      float: right !important;
      height: 33px ;
      top: -5px !important;
  }
  .leftContainer .navbar-expand.modelsLettersNav.navbar ul.navbar-nav.text-left  {
      height: 25px ;
      line-height: 0px ;
      margin-top: 13px ;
  }
  #navCol .navbar a {
  color: peru !important;
  }
  #navCol nav .row.leftContainer.ml-3 + .row.ml-3 {
      position: relative !important;
      display: inline-block;
      width: 400px;
      height: 38px;
      line-height: 35px;
      top: 10px;
      left: 90px !important;
  background: transparent !important;
  }
  #navCol nav .row.leftContainer.ml-3 + .row.ml-3 .form-inline {
      float: left ;
      width: 400px;
      height: 38px;
      margin-top: -5px;
  }
  #navCol nav .row.leftContainer.ml-3 + .row.ml-3 .form-inline .btn  {
      display: inline-block;
      height: 38px;
      margin-top: 5px;
      padding: 3px 5px
  }
  #navCol nav .row.leftContainer.ml-3 + .row.ml-3 .form-inline  .form-group {
      display: inline-block;
      width: 300px;
      height: 35px;
      margin-top: -5px;
  }
  #navCol nav .row.leftContainer.ml-3 + .row.ml-3 .form-inline  .form-group  .form-control {
      display: inline-block;
      width: 300px;
      height: 35px;
  }
  #leftColWrapper #leftCol>main {
      margin-top: -70px ;
  }
  /* (new238) SEARCH CONTAINER */
  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5  {
  position: absolute !important;
      display: inline-block !important;
      width: 435px ;
      height: 40px ;
      top: 4vh !important;
      margin: 0 0 0 0 !important;
  right:270px !important;
  }

  #leftCol.col.bg-white.xrounded-lg .row nav .leftContainer + .row.form-inline {
      display: inline-flex ;
      width: 335px ;
      height: 40px ;
      margin-right: 31px ;
      margin-top: 6px ;
  }
  /* GM ADAPTATION - SUPERLOADER PLUS - === */
  #bodyContent {
      height: 1041px !important;
      margin-bottom: -117px !important;
  }
  .copyPaginator ~.collapse {
      display: none !important;
  }
  /* TWITER - SHOW ALL MEDIA - === */
  /* .MediaCard-nsfwInfo */
  .MediaCard--mediaForward .MediaCard-nsfwInfo {
  /* display: none !important; */
  }
  .MediaCard.is-nsfw .MediaCard-nsfwInfo {
      display: none !important;
  }
  .MediaCard.is-nsfw .MediaCard-mediaAsset {
      opacity: 1 !important;
  }
  /* LOGED */
  #header{
      height: 30px !important;
      line-height: 5px !important;
      padding: 0 16px !important;
  }
  #logo {
      float: left;
      width: 250px !important;
  }
  #title {
      height: 25px !important;
      width: 234px !important;
      background-size: 50% !important;
      background-position: center top !important;
  }
  /* (new75) */
  #userSection {
      float: right;
      height: 25px !important;
      margin: 0 !important;
      color: white;
      font-size: 15px !important;
  }
  #nav {
      margin-top: -55px !important;
      margin-bottom: -34px !important;
      border-radius: 25px;
  }
  #topNav {
      float: left;
      clear: right;
      height: 25px !important;
      line-height: 25px !important;
      width: 100%;
      min-width: 600px  !important;
      max-width: 600px  !important;
      margin-left: 19px !important;
      border-radius: 5px !important;
      padding: 0;
  }
  #topNav>ul {
      margin-top: -1px !important;
  }
  #subNav {
      float: none !important;
      clear: none !important;
      height: 25px !important;
      line-height: 25px !important;
      width: 100%;
      min-width: 985px  !important;
      max-width: 985px  !important;
      margin-top: 41px !important;
      margin-left: 623px !important;
      padding-left: 23px;
  }
  #model-letters {
      float: left !important;
      clear: both;
      height: 27px !important;
      width: 350px  !important;
      margin-left: -20px !important;
      margin-top: -26px !important;
      text-align: center !important;
  }
  #subNav> #model-letters + div {
      float: right !important;
      clear: none !important;
      height: 27px !important;
      width: 400px  !important;
      margin-top: -26px !important;
      margin-right: 237px !important;
      text-align: center !important;
  }
  /* (new233) SEARCH INDEXX CONTAINER */
  #leftCol .row.pb-2 #navCol nav.row {
      position: absolute !important;
      display: inline-block !important;
      width: 27.6667%;
  margin: 0px 0 0 0 !important;
  right: 270px !important;
  }
  #leftCol .row.pb-2 #navCol nav.row  form {
      width: 500px !important;
  margin: 5px 0 0 0 !important;
  }

  /* (new233)SEARCH FORM - GOOGLE - NOT VIBLE NOW ??*/
  .col-12 #pageWrapper>hr + div:first-of-type  {
      position: absolute;
      display: inline-block;
      width: 45.5%;
      right: 2px;
      top: -51px;
      border-radius: 5px;
  background: red !important;
  }
  .col-12 #pageWrapper>hr +div:first-of-type .d-flex .align-self-center {
      height: 32px;
      line-height: 32px;
      margin-bottom: 0;
  }

  .col-12 #pageWrapper>hr +div:first-of-type #googleSearch {
      position: absolute;
      display: inline-block;
      left: -851px;
      right: 0;
      top: 1px;
  }
  .col-12 #pageWrapper>hr +div:first-of-type #googleSearch  #gs_id50 {
      height: 20px !important;
      padding: 0;
      width: 100%;
  }
  .col-12 #pageWrapper>hr +div:first-of-type #googleSearch  #gs_id50 #gs_tti50 {
      padding-top: 0;
  }

  /* (new37)SEARCH FORM - GOOGLE - MODELS PAGES BY APLPHAB */
  /* .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3>form[action="/search/"] */
  /* .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 , */
  .row.leftContainer.ml-3 + .row   {
      position: relative;
      display: inline-block;
      width: 25.5%;
      height: 34px;
      right: 0px;
      top: 0px;
  margin-bottom: 5px !important;
      border-radius: 5px;
  background: green !important;
  }
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 >form[action="/search/"]  ,
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 {
      height: 34px !important;
      min-width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
  }
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 >form[action="/search/"] .input-group input.form-control.mb-2 ,
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 >form[action="/search/"] .input-group {
      height: 33px !important;
  }
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 >form[action="/search/"] .input-group {
      margin-left: -17px;
  }
  .row.leftContainer.ml-3 + .row  .col-11.col-sm-11.col-md-10.col-lg-7.col-xl-5.ml-3 >form[action="/search/"] .input-group  .input-group-append #searchSubmitButton {
      height: 33px !important;
  }



  /* (new32) SEARCH SITE - #idc (CHROME)(ALL) #pageWrapper > form === */
  #idc ,
  #id2 ,
  #pageWrapper > form {
      height: 30px !important;
      line-height: 30px !important;
      margin-top: 2px !important;
  color: gold !important;
  }
  #idc input ,
  #id2 input ,
  #pageWrapper > form input {
      height: 25px !important;
      line-height: 25px !important;
  }
  #idc  input[type="text"] ,
  #id2 input[type="text"] ,
  #pageWrapper > form input[type="text"]  {
      width: 433px !important;
  }
  #idc input.buttonsize ,
  #id2 input.buttonsize ,
  #pageWrapper > form input.buttonsize {
      padding-bottom: 27px !important;
      padding-top: 3px !important;
  }
  /* (new243) SIDEBAR RIGHT */
  body.defaultLayout #sidebar a.modelLink3:visited {
    color: tomato !important;
  }

  #sidebar {
      float: left;
      width: 235px !important;
      height: 95vh!important;
      margin-left: -243px;
      padding: 5px 20px 5px 5px !important;
      border-radius: 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  box-shadow: none !important;
  background-color: #666666;
  border: 1px solid black;
  }
  #sidebar > .text-center{
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      margin-top: 2px !important;
      margin-bottom: 2px !important;
  }
  .text-center>h5 ,
  #sidebar > .text-center .h5 {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      border-radius: 5px !important;
      font-size: 15px !important;
  background: #111 !important;
  /* border-bottom: 1px solid red !important; */
  }

  #sidebar .d-flex.flex-row{
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      margin-bottom: 0px !important;
  background: #111 !important;
  }

  #sidebar .text-center .d-flex.flex-row >div > div > div{
      margin-bottom: 1px !important;
  /* border: 1px solid red !important; */
  }


  #sidebar .modelPanel.card.border-0.text-center.align-items-center{
  position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      margin-bottom: 0px !important;
  background: #222 !important;
  border: none !important;
  border: 1px solid red !important;
  }
  #sidebar .popular_model.mb-3{
      margin-bottom: 5px !important;
  }
  #sidebar .d-flex.card-img.align-items-end.justify-content-center {
      display: inline-block;
      line-height: 105px;
      object-fit: contain;
      object-position: center center;
  border: none !important;
  border-bottom: 1px solid red !important;
  }
  #sidebar>div>h3:first-of-type {
      float: left !important;
      clear: none !important;
      width: 118px !important;
      margin-bottom: 2px !important;
      margin-top: -18px !important;
      margin-left: -3px !important;
      margin-right: 4px !important;
      text-align: center !important;
  background: rgba(52, 180, 63, 0.4) !important;
  }
  /* FIRST POPULAR MODEL */
  #sidebar>div>h3:first-of-type + div {
      float: left !important;
      clear: none !important;
      width: 118px !important;
      height: 118px !important;
      margin-left: -122px !important;
      margin-right: 0px !important;
      text-align: center !important;
  background: rgba(52, 180, 63, 0.4) !important;
  }
  #sidebar>div>h3:first-of-type + div .model {
      background: rgba(52, 180, 63, 0.4) none repeat scroll 0 0 !important;
  }
  #sidebar>div>h3:first-of-type + div + h3 {
      float: left !important;
      clear: none !important;
      width: 117px !important;
      margin-bottom: 2px !important;
      margin-top: -18px !important;
      margin-left: -2px !important;
  background: #99cc99  !important;
  } 
  /* POPULAR MODEL - ALL after the FIRST  */

  /*FIRST + 2nd + 3nd */
  #sidebar > div > div.popular_model {
      float: none !important;
      clear: right !important;
      margin-left: -2px !important;
      text-align: center !important;
      width: 118px !important;
      height: 118px !important;
  background: #99cc99 !important;
  }
  /* FIRST */
  #sidebar > div > h3 + div.popular_model {
      float: right !important;
      clear: both !important;
      margin-top: -118px !important;
      margin-bottom: 2px !important;
  }
  /*2nd */
  #sidebar > div > h3 + div.popular_model + div.popular_model {
  /* background: aqua !important; */
  }
  /*3nd */
  #sidebar > div > h3 + div.popular_model + div.popular_model + div.popular_model {
      float: right !important;
      clear: both !important;
      margin-top: -118px !important;
  }
  #sidebar > div > h3:first-of-type + div + h3 + div.popular_model .model {
      background: rgba(52, 180, 63, 0.4) !important;
  }
  #sidebar > div > h3:first-of-type + div + h3 + div ~.popular_model .model {
      background: rgba(52, 180, 63, 0.4) !important;
  }

  /* ==== */

   #sidebar > div > h3:first-of-type + div + h3 + div ~.popular_model  + h3 {
      float: left !important;
      clear: none !important;
      height: 100% !important;
      height: 18px !important;
      min-width: 236px !important;
      max-width: 106px !important;
      margin-top: 18px !important;
      text-align: center !important;
  /*     background: rgba(52, 180, 63, 0.4) !important; */
  background: red !important;
  }
  #sidebar > div > h3:first-of-type + div + h3 + div ~.popular_model  + h3 ~ div:not(:empty) {
      float: left !important;
      vertical-align: middle !important;
      width: 113px !important;
      height: 183px !important;
  border: 1px solid green !important;
  }
  #sidebar > div > h3:first-of-type + div + h3 + div ~.popular_model  + h3 ~ div:not(:empty)>a>img {
      clear: none !important;
      float: left !important;
      vertical-align: middle !important;
      height: auto !important;
      max-width: 115px !important;
  border: 1px solid green !important;
  }
  /* TWITTER PANEL in SIDEBAR */
  #sidebar>div>div:empty + div {
      float: left !important;
      height: 650px !important;
      margin-top: 4px !important;
  }
  iframe#twitter-widget-1 {
      position: static;
      display: inline-block;
      width: 100%;
      max-width: 100%;
      min-width: 180px;
      height: 647px !important;
      min-height: 200px;
      margin-bottom: 0;
      margin-top: 0;
      padding: 0;
      visibility: visible;
  }
  .MediaCard-nsfwInfo {
      opacity: 0 !important;
  }
  .MediaCard.is-nsfw .MediaCard-mediaAsset {
      opacity: 1 !important;
  }

  /* (new231) ALERT - WELCOM BACK LOGIN */
  .mainFeedback.BTAlertFeedbackPanel.alert.alert-success {
  	position: absolute !important;
  	right: 0 !important;
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  /* (new232) GM "INDEXX - Indexxx Helper Userscript" by Peolic:
  https://gist.github.com/peolic/6aa2cef8fafa377cb5848a473c0e3b30
  === */
  /* CONTAINER - ALIAS COUNT / SET BY WEBSITE */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable , 
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable {
  	position: fixed !important;
  	display: inline-block !important;
      float: none !important;
      max-height: 2.3vh !important;
      min-height: 2.3vh !important;
      width: 100% !important;
      min-width: 15% !important;
      max-width: 15% !important;
  	bottom: 0 !important;
  	right: 15px !important;
      margin: 0 2px 0 2px !important;
      padding: 0px !important;
  	overflow: hidden !important;
  	z-index: 500 !important;
  	transition: height ease 0.7s !important;
  border: 1px solid red!important;
  }
  /* (new231) CONTAINER HOVER - TEST FOCUS WITHIN - ALL */
  #model-header > div[style^="float: left;"] + div:focus-within  > #model-websites-box + div.model-snippet-box.ui-resizable  ,
  #model-header > div[style^="float: left;"] + div:focus-within  > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable {
      max-height: 20.3vh !important;
      min-height: 20.3vh !important;
  	transition: height ease 0.7s !important;
  }
  /* (new233) CONTAINER HOVER - TEST FOCUS WITHIN */
  /* #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:focus-visible  + div.model-snippet-box.ui-resizable:hover  ,*/
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:focus-visible  + div.model-snippet-box.ui-resizable {
  /*    max-height: 60.3vh !important;
      min-height: 60.3vh !important;
  	    width: 100% !important;
      min-width: 15% !important;
      max-width: 15% !important;
  		right: 0px !important;
  	 padding-right: 0px !important;
  	z-index: 500 !important;*/
  /*border: 1px solid yellow!important;*/
  }

  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover + div.model-snippet-box.ui-resizable , 
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable:hover , 
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover {
      max-height: 60.3vh !important;
      min-height: 60.3vh !important;
  	transition: height ease 0.7s !important;
  	background-color: rgb(229, 239, 249) !important;
  }

  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover {
      max-height: 60.3vh !important;
      min-height: 60.3vh !important;
      width: 100% !important;
      min-width: 29% !important;
      max-width: 29% !important;
      right: 16px !important;
      padding-right: 0px !important;
      transition: height ease 0.7s !important;
  	background-color: rgb(229, 239, 249) !important;
  border: 1px solid yellow!important;
  }

  /* (new232) LISTES - ALL */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body , 
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body {
  	display: inline-block !important;
      float: none !important;
      max-height: 57.5vh !important;
      min-height: 57.5vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	top: 5vh !important;
  	right: 0 !important;
      margin: 0 0px 0 0px !important;
      padding: 0px !important;
  	overflow: hidden !important;
      overflow-y: auto !important;
  background-color: rgb(229, 239, 249) !important;
  /*border: 1px solid yellow!important;*/
  }
  /* (new232) LISTE - SETS CONTAINER - RIGHT */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > d-flex {
  	display: inline-block !important;
      float: none !important;
      max-height: 55.5vh !important;
      min-height: 55.5vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	top: 5vh !important;
  	right: 0 !important;
      margin: 0 0px 0 0px !important;
      padding: 3vh 0 0 0 !important;
  	overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid yellow!important;
  }

  /* (new232) LISTE - SETS ITEMS CONTAINER - RIGHT */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div {
  	position: absolute !important;
  	display: inline-block !important;
      float: none !important;
      max-height: 48.2vh !important;
      min-height: 48.2vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	top: 5vh !important;
  	right: 0 !important;
      margin: 0 0px 0 0px !important;
      padding: 0vh 0 0 0 !important;
  	overflow: hidden !important;
      overflow-y: auto !important;
  border-top: 1px solid red!important;
  border-bottom: 1px solid red!important;
  }
  /* (new232) SETS -  END LIST - HOVER */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover + div.model-snippet-box.ui-resizable .box-body + div ,
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable:hover .box-body + div {
  	position: absolute !important;
  	display: inline-block !important;
      max-height: 6.5vh !important;
      min-height: 6.5vh !important;
      line-height: 14px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	bottom: 0 !important;
  	right: 0 !important;
      padding: 5px !important;
      font-size: 15px !important;
      white-space: pre-wrap !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background-color: rgb(0 108 204 / 51%) !important;
  }

  /* (new237) LISTES - HOVER */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover .box-title.d-flex  {
      width: 100% !important;
      min-width: 48% !important;
      max-width: 48% !important;
  }

  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover .box-body {
  	display: inline-block !important;
      max-height: 50.5vh !important;
      min-height: 50.5vh !important;
      width: 100% !important;
      min-width: 48% !important;
      max-width: 48% !important;
      overflow: hidden !important;
  	overflow-y: auto !important;
  border-bottom: 1px solid red!important;
  }

  /* (new231) ALIAS END LIST */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable:hover .box-body + div {
  	max-height: 6.5vh !important;
      min-height: 6.5vh !important;
  	line-height: 14px  !important;
      width: 100% !important;
      min-width: 48% !important;
      max-width: 48% !important;
  	padding: 5px !important;
  	font-size: 15px !important;
  	white-space: pre-wrap !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  background-color: rgb(0 108 204 / 51%) !important;
  }

  /* (new237) LIST ITEMS */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body > div {
  	display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body > div > span:first-of-type + span {
      display: inline-block !important;
  	padding: 0 0 0 20px !important;
  }
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div {
      display: inline-block !important;
  	line-height: 1vh  !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	padding:  2px 0 2px 0px !important;
  }
  /* (new243) */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div input {
  	position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	left: -132px !important;
  	margin: 0vh 0 0 5px !important;
  	text-align: left !important;
  }
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div abbr {
      display: inline-block !important;
      width: 100% !important;
      min-width: 90% !important;
      max-width: 90% !important;
  	left: 0 !important;
  	padding:  0 0 0 20px !important;
  	text-align: left !important;
  border: 1px solid mediumaquamarine !important;
  }

  /* (new93) LIST ITEMS - HOVER */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div:hover ,
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body > div:hover {
      border: 1px solid red!important;
  }
  /* (new93) LIST ITEMS - ZEBBRA */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div:nth-child(odd) ,
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body > div:nth-child(odd) {
      background-color: rgba(0, 108, 204, 0.31);
  }
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable + div.model-snippet-box.ui-resizable .box-body > .d-flex + div > div:nth-child(even) ,
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable .box-body > div:nth-child(even) {
      background-color: rgba(0, 108, 204, 0.17);
  }

  /* (new93) ALIAS COUNT */
  #model-header > div[style^="float: left;"] + div > #model-websites-box + div.model-snippet-box.ui-resizable {
      width: 100% !important;
      min-width: 13% !important;
      max-width: 13% !important;
  	right: 275px !important;
  background-color: rgb(229, 239, 249) !important;
  }

  /* (new88) RESULTS TITLES SECTIONS - #idc (CHROME)(ALL) #pageWrapper >form  === */
  #pageWrapper #idc + div + h1 ,
  #pageWrapper #id2 + div + h1 ,
  #pageWrapper >form + div + h1  {
      height: 23px !important;
      line-height: 24px !important;
      margin: 10px 0 0 0 !important;
      font-size: 20px !important;
  color: gold !important;
  background: green !important;
  }
  #pageWrapper > h3 {
      width: 500px !important;
      margin-top: 0px !important;
      margin-bottom: 5px !important;
      border-radius: 0 0 5px 0 !important;
      font-size: 17px ;
  background: rgba(52, 180, 63, 0.6)!important;
  }
  #pageWrapper .floatingElementsContainer  + .copyPaginator + h3 {
      margin-top: 10px !important;
  }
  /* (new238) */
  #pageWrapper {
      display: inline-block !important;
      width: 100% !important;
      margin: 0vh 0 0 0 !important;
      padding-left: 5px;
      font-size: 13px;
  }
  /* (new238) */
  #pageWrapper > h1 {
      width: 100% !important;
      height: 4vh !important;
      line-height: 35px !important;
      margin: -0.5vh 0 0 0px !important;
      padding: 0 5px !important;
      font-size: 18px !important;
      text-align: left !important;
  background: rgba(52, 180, 63, 0.4) !important;
  }
  #pageWrapper>h1  + .card{
      height: 36px;
  color: gray;
  background-color: #333;
  }
  #pageWrapper>h1  + .card .card-body  {
      padding-bottom: 0;
      padding-top: 0;
  }
  #pageWrapper>h1  + .card .card-body  .card-title {
      height: 1px;
  }

  /* (new240) PROFILE PAGE */
  #pageWrapper > div[itemtype="http://schema.org/ProfilePage"] h1 {
      display: inline-block !important;
      height: 35px !important;
      line-height: 30px !important;
      margin: 0px 0 0px 0 !important;
      padding: 0 5px !important;
      font-size: 28px !important;
  	text-align: left  !important;
  	user-select: all !important;
  }
  #pageWrapper > div[itemtype="http://schema.org/ProfilePage"] div[itemtype="http://schema.org/Person"] #modelTitleSection {
      margin-bottom: 0vh !important;
  }
  #pageWrapper > div[itemtype="http://schema.org/ProfilePage"] div[itemtype="http://schema.org/Person"] #modelTitleSection + .clear{
      display: none !important;
  }

  /* (new76) SEARCH RESULTS - SETS */
  .pset.card.text-center.border-0.smaller.mb-3.mb-md-0 {
      position: relative;
      float: left;
      height: auto !important;
      height: 262px !important;
      line-height: 15px;
      width: 150px;
      min-width: 190px;
      top: 0;
      margin: 0 19px 4px 0;
      padding-top: 3px;
      border-radius: 5px;
      text-align: center;
  background: #333 !important;
  border: 1px solid gray;
  }

  .photoSection.card-img-top.d-flex.align-items-end.justify-content-center {

  border: 1px solid red !important;
  }


  /* (new81) SEARCH HELP After search and Results */

  /* (new81) SEARCH HELP After search and NO Results */
  #pageWrapper>hr[style^="margin-top: 50px;"] + div:before , 
  #pageWrapper>  ul + hr + div:before , 
  .floatingElementsContainer + hr + div:before , 
  #pageWrapper> .card + h3  +div + ul + hr + div:before ,  
  #pageWrapper> .card + hr + div:before ,
  .floatingElementsContainer + .copyPaginator + hr + div:not(:hover):before {
      content: "Search Help";
      position: fixed ;
      top: 29px;
      left: -23px;
      padding: 0px ;
      transform: rotate(-90deg) ;
  background: #333;
  }
  #pageWrapper>hr[style^="margin-top: 50px;"] + div,
  #pageWrapper>  ul + hr + div ,
  .floatingElementsContainer + hr + div ,
  #pageWrapper> .card + h3  +div + ul + hr + div ,
  #pageWrapper> .card + hr +div ,
  .floatingElementsContainer + .copyPaginator + hr + div {
      position: fixed;
      width: 22px !important;
      height: 80px !important;
      top: 0px;
      left: 1px;
      padding: 5px 5px 5px 12px;
      overflow: hidden;
      background: #333 none repeat scroll 0 0;
      color: #b4b4b4;
      border-radius: 0px 5px 5px 0px ;
      transition: all ease 0.7s !important;
  border: 1px solid red !important;
  }
  /* (new236) */
  #pageWrapper>hr[style^="margin-top: 50px;"] + div:hover ,
  #pageWrapper>  ul + hr + div:hover ,
  .floatingElementsContainer + hr + div:hover ,
  #pageWrapper> .card + h3  +div + ul + hr + div:hover ,
  #pageWrapper> .card + hr +div:hover  ,
  .floatingElementsContainer + .copyPaginator + hr + div:hover {
      width: 468px !important;
      height: 922px !important;
      left: 0;
      overflow-y: auto !important;
      z-index: 50000 !important;
  }
  /* (new38) FEEDBACK ? */
  #pageWrapper>h2 {
      width: 100% !important;
      height: 20px !important;
      line-height: 17px !important;
      margin-bottom: 5px !important;
      padding: 0 5px !important;
      font-size: 18px !important;
      text-align: center ;
  background: rgba(52, 180, 63, 0.4) !important;
  }
  .feedback + #pageWrapper h1 + h2 + div {
      clear: none !important;
      float: none !important;
      height: 15px !important;
      width: 100%;
      max-width: 1305px !important;
      min-width: 1305px !important;
      line-height: 15px !important;
      margin-left: 223px !important;
      margin-top: -23px !important;
      padding-left: 23px;
      font-size: 0px !important;
  }
  .feedback + #pageWrapper h1 + h2 + div:before {
      content: "Sort by : " !important;
      position: relative !important;
      clear: none !important;
      float: none !important;
      height: 15px !important;
      width: 100% !important;
      max-width: 130px !important;
      min-width: 130px !important;
      line-height: 15px !important;
      padding-left: 23px;
      font-size: 13px !important;
  }
  .feedback + #pageWrapper h1 + h2 + div > span {
      clear: none !important;
      float: none !important;
      height: 15px !important;
      width: 100%;
      max-width: 130px !important;
      min-width: 130px !important;
      line-height: 15px !important;
      margin-left: 5px !important;
      padding: 3px 5px !important;
      border-radius: 8px !important;
      font-size: 13px !important;
  background: yellow !important;
  }
  .feedback + #pageWrapper h1 + h2+ div > a {
      clear: none !important;
      float: none !important;
      height: 15px !important;
      width: 100%;
      max-width: 130px !important;
      min-width: 130px !important;
      line-height: 15px !important;
      margin-left: 5px !important;
      padding: 3px 5px !important;
      border-radius: 8px !important;
      font-size: 13px !important;
  background: tomato !important;
  }
  /* (new39) FEEDBACK MESSAGE (in model page) */
  .feedback {
      position: absolute !important;
      margin-top: 3px !important;
      height: 15px !important;
      line-height: 0px !important;
      width: 550px!important;
      left: 500px !important;
      font-size: 8px !important;
  }
  .feedbackPanelINFO ,
  .feedback > div {
      line-height: 11px;
  background: tan !important;
  }
  .feedbackPanelINFO span {
      font-size: 13px ;
  }
  /*  FAVORITES */
  .wrapper .model + div:not([itemprop="actor"]) {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 10px !important;
      max-height: 10px !important;
      min-height: 10px !important;
      line-height: 10px !important;
      top: -125px !important;
      left: -40px !important;
      border-radius: 5px !important;
      font-size: 0 !important;
      text-align: center !important;
  }
  .model + div:not([itemprop="actor"]) a[href$="-remove"]:before {
      content: "X" !important;
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 10px !important;
      max-height: 12px !important;
      min-height: 12px !important;
      line-height: 10px !important;
      top: 11px !important;
      border-radius: 5px !important;
      font-size: 12px !important;
      text-align: center !important;
      border: 1px solid gray !important;
      cursor: pointer !important;
  background: red !important;
  }
  /* (new40) PAGINATION ACTOR - THUMBNAILS ALPHABETICAL */
  #pageNrLinks ,
  #pageNrLinks2 {
      position: relative !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      width: 100% !important;
      border-radius: 3px !important;
      text-align: center !important;
      font-size: 0px !important;
      z-index: 500 !important;
  background: rgba(52, 180, 63, 0.4) !important;
  }
  #pageNrLinks {
      display: inline-block !important;
      width: 100% !important;
      height: 20px !important;
      line-height: 20px !important;
      top: -2px !important;
      left: -4px !important;
      margin-bottom: 12px !important;
      margin-top: 23px !important;
  }
  .pageNrs {
      font-size: 14px!important;
  }
  .pageNrs span:not(:first-of-type) {
      font-size: 14px!important;
  background: tomato !important;
  }
  .pageNrs span:not(:first-of-type):hover {
      font-size: 14px!important;
  background: rgba(255, 101, 71, 0.74) !important;
  }
  #pageNrLinks>a {
      display: inline-block !important;
      width: 16.3px !important;
      font-size: 16px !important;
      text-align: center !important;
  background: yellow !important;
  }
  #pageNrLinks>a:hover {
      background: tomato !important;
  }
  #pageNrLinks>a span {
      display: inline-block !important;
      width: 16px !important;
      font-size: 10px !important;
  }
  #pageNrLinks>span +span {
      display: inline-block !important;
      width: 15px !important;
      font-size: 10px !important;
  }

  /* (new2) PANELS INFOS TOP - === */
  /* TAGS PAGE - === */
  .modelLinks li {
      display: inline-block!important;
      width: 196px;
      height: 20px !important;
      line-height: 20px !important;
      margin: 0 2px 2px 2px !important;
      padding: 5px 2px !important;
      border-radius: 3px !important;
      text-align: center !important;
      text-overflow: ellipsis!important;
      white-space: nowrap !important;
  color: peru !important;
  background: #222 !important;
  }
  .modelLink > li > a > span {
      display: inline-block!important;
      width: 190px !important;
      height: 21px !important;
      line-height: 18px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  color: peru !important;
  }

  .modelLink > li > a[href*="/z/"] > span ,

  .modelLink > li > a[href*="/yaeba/"] > span ,
  .modelLink > li > a[href*="/y/"] > span ,

  .modelLink > li > a[href*="/x-art/"] > span ,
  .modelLink > li > a[href*="/x/"] > span ,

  /* PB */
  .modelLink > li > a[href*='/waist\\.21/'] > span ,
  .modelLink > li > a[href*="/w/"] > span ,

  .modelLink > li > a[href*="/vagina/"] > span ,
  .modelLink > li > a[href*="/v"] > span ,

  .modelLink > li > a[href*="/ucraine/"] > span ,
  .modelLink > li > a[href*="/u/"] > span ,

  .modelLink > li > a[href*="/t/"] > span ,
  .modelLink > li > a[href*="/s/"] > span ,
  .modelLink > li > a[href*="/r/"] > span ,

  .modelLink > li > a[href*="/queen/"] > span ,
  .modelLink > li > a[href*="/q/"] > span ,

  .modelLink > li > a[href*="/p/"] > span ,

  .modelLink > li > a[href*="/ob/"] > span ,
  .modelLink > li > a[href*="/o/"] > span ,

  .modelLink > li > a[href*="/naked/"] > span ,
  .modelLink > li > a[href*="/n/"] > span ,

  .modelLink > li > a[href*="/machova/"] > span ,
  .modelLink > li > a[href*="/m/"] > span ,

  .modelLink > li > a[href*="/l/"] > span ,

  .modelLink > li > a[href*="/kazakhstan/"] > span ,
  .modelLink > li > a[href*="/k/"] > span ,

  .modelLink > li > a[href*="/james/"] > span ,
  .modelLink > li > a[href*="/j/"] > span ,

  .modelLink > li > a[href*="/i/"] > span ,

  /* PB */
  .modelLink > li > a[href*="h1.5'2\\""] > span ,
  .modelLink > li > a[href*="h1"] > span ,

  .modelLink > li > a[href*="/h/"] > span ,

  .modelLink > li > a[href*="/g-cup/"] > span ,
  .modelLink > li > a[href*="/g/"] > span ,

  .modelLink > li > a[href*="/f/"] > span ,
  .modelLink > li > a[href*="/e/"] > span ,

  .modelLink > li > a[href*="/d-cup/"] > span ,
  .modelLink > li > a[href*="/d/"] > span ,

  .modelLink > li > a[href*="/c-cups/"] > span ,
  .modelLink > li > a[href*="/c/"] > span ,
  .modelLink > li > a[href*="/b/"] > span ,
  .modelLink > li > a[href*="/a/"] > span  {
      display: inline-block!important;
      width: 190px !important;
      border-radius: 3px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  color: white !important;
  background-color: red !important;
  }
  .modelLink > li > a[href*="/z/"] > span {
      color: white !important;
  background-color: darkorange !important;
  }
  .modelLink > li > a[href*="/yaeba/"] > span ,
  .modelLink > li > a[href*="/y"] > span {
      color: white !important;
  background-color: lightcoral !important;
  }
  .modelLink > li > a[href*="/x-art/"] > span ,
  .modelLink > li > a[href*="/x"] > span {
      color: white !important;
  background-color: lightseagreen !important;
  }
  /* PB */
  .modelLink > li > a[href*='/waist\\.21/'] > span ,
  .modelLink > li > a[href*="/w"] > span {
      color: white !important;
  background: royalblue !important;
  }
  .modelLink > li > a[href*="/vagina/"] > span ,
  .modelLink > li > a[href*="/v"] > span {
      color: white !important;
  background: orangered !important;
  }
  .modelLink > li > a[href*="/ucraine/"] > span ,
  .modelLink > li > a[href*="/u"] > span {
      color: white !important;
  background: olivedrab !important;
  }
  /* PB TOUCH TOO MUCH - in TAGS */
  .modelLink > li > a[href*="/s"] > span {
      color: white !important;
  background: dodgerblue !important;
  }
  .modelLink > li > a[href*="/r"] > span {
      color: white !important;
  background: chocolate !important;
  }
  .modelLink > li > a[href*="/queen/"] > span ,
  .modelLink > li > a[href*="/q"] > span {
      color: white !important;
  background: tomato !important;
  }
  .modelLink > li > a[href*="/p"] > span {
      color: white !important;
  background: orangered  !important;
  }
  .modelLink > li > a[href*="/ob/"] > span ,
  .modelLink > li > a[href*="/o"] > span {
      color: white !important;
  background: cadetblue !important;
  }
  .modelLink > li > a[href*="/naked/"] > span ,
  .modelLink > li > a[href*="/n"] > span {
      color: white !important;
  background: darksalmon !important;
  }
  .modelLink > li > a[href*="/machova/"] > span ,
  .modelLink > li > a[href*="/m"] > span {
      color: white !important;
  background: olive !important;
  }
  .modelLink > li > a[href*="/l"] > span {
      color: white !important;
  background: slateblue !important;
  }
  .modelLink > li > a[href*="/kazakhstan/"] > span ,
  .modelLink > li > a[href*="/k"] > span {
      color: white !important;
  background: red !important;
  }
  .modelLink > li > a[href*="/james/"] > span ,
  .modelLink > li > a[href*="/j"] > span {
      color: white !important;
  background: sandybrown !important;
  }

  .modelLink > li > a[href*="/i"] > span {
      color: white !important;
  background: dodgerblue !important;
  }

  /* PB */
  .modelLink > li > a[href*="h1.5'2\\""] > span ,
  .modelLink > li > a[href*="h1"] > span {
      color: white !important;
  background: gold !important;
  }
  .modelLink > li > a[href*="/h"] > span {
      color: white !important;
  background: goldenrod !important;
  }
  .modelLink > li > a[href*="/g-cup/"] > span ,
  .modelLink > li > a[href*="/g"] > span {
      color: white !important;
  background: hotpink !important;
  }
  .modelLink > li > a[href*="/f"] > span {
      color: white !important;
  background: gray !important;
  }
  .modelLink > li > a[href*="/e"] > span {
      color: white !important;
  background: darkgoldenrod !important;
  }
  .modelLink > li > a[href*="/d-cup/"] > span ,
  .modelLink > li > a[href*="/d"] > span {
      color: white !important;
  background-color: navy !important;
  }
  .modelLink > li > a[href*="/c-cups/"] > span ,
  .modelLink > li > a[href*="/c"] > span  {
      color: white !important;
  background-color: green !important;
  }
  .modelLink > li > a[href*="/b"] > span  {
      color: white !important;
  background: steelblue !important;
  }
  .modelLink > li > a[href*="/a"] > span  {
      color: white !important;
  background-color: darkviolet !important;
  }

  /* TAGS - FIRST LETTER */
  .modelLink > li > a > span::first-letter  {
      line-height: 18px !important;
      font-size: 18px !important;
      text-transform: capitalize !important;
  }
  /* TOOLTIP IMAGE */
  .ui-tooltip {
      box-shadow: 0 0 5px #aaa;
      max-width: 300px;
      padding: 8px;
      position: absolute;
      z-index: 9999;
      border-radius: 8px !important;
  border: 3px solid gray !important;
  background: black !important;
  }
  .ui-tooltip img {
      box-shadow: 0 0 5px #aaa;
      max-width: 280px !important;
      padding: 1px !important;
      z-index: 9999;
      border-radius: 3px !important;
  border: 2px solid gray !important;
  background: black !important;
  }
  /* MODEL LIST - ONLY NAME - RED for NO PHOTO */
  span.modelLink.item:not([style="color: red;"]) {
      display: inline-block !important;
      height: 15px !important;
      line-height: 13px !important;
      margin-top: -3px !important;
      margin-bottom: 3px !important;
      padding: 0px 5px !important;
      border-radius: 5px !important;
  color: gold !important;
  background-color: green !important;
  }
  span.modelLink.item[style="color: red;"] {
      padding: 0px 5px !important;
      border-radius: 5px !important;
  color: gold !important;
  background-color: red !important;
  }
  /* MODEL / SET PAGES - === */
  #pageWrapper>div>img {
      max-height: 384px !important;
  outline: 1px solid green !important;
  }
  /* (new84) NEW DESIGN */
  #pageWrapper #modelTitleSection + .clear + #model-header{
      margin-top: 1.5vh !important;
  }


  #model-header > div:first-of-type {
      display: inline-block !important;
      clear: both !important;
      min-width: 394px !important;
      max-width: 394px !important;
      max-height: 37vh !important;
      min-height: 37vh !important;
      margin: 0 0 0 10px !important;
      padding: 0 5px !important;
      border: 1px solid #cc00cc;
      overflow: visible !important;
      text-align: center !important;
  background-color: #666666 !important;
  }
  /* #model-header > div:first-of-type + div */
  #model-header > div[style^="float: left;"] + div {
  position: relative !important;
      display: inline-block !important;
      max-height: 57vh !important;
      min-height: 57vh !important;
      width: 74.5% !important;
  background: #222 !important;	
  }

  #model-header > div[style^="float: left;"] + div > div {
  float: left  !important;
      max-height: 57vh !important;
      min-height: 57vh !important;
      width: 100% !important;
      min-width: 33% !important;
      max-width: 29% !important;
      margin: 0 2px 0 2px !important;
      padding: 5px !important;
  background-color: #222 !important;
  border: 1px solid pink !important;
  }

  /* (new73) - IMG MAX WIDTH - === */
  #model-header > div:first-of-type .model-img {
      display: inline-block!important;
      width: auto !important;
      max-width: 391px !important;
      min-height: 294px !important;
      max-height: 294px !important;
      margin-top: 24px !important;
      margin-left: -3px !important;
      text-align: center !important;
      object-fit: contain !important;
      z-index: 500000 !important;
  border: 1px solid black;
  }

  /* (new239) TAG BOX */
  #pageWrapper #model-header #tagBox {
      position: absolute !important;
      display: inline-block!important;
      float: none;
      min-height: 13.6vh !important;
      max-height: 13.6vh !important;
      width: 100%;
      max-width: 393px !important;
      min-width: 393px !important;
      margin: 0vh 0 0 -2px !important;
      top: 58.27vh !important;
      left: 30px !important;
  }

  /* ADD ALIAS ACTRESS - NOT WORK ON IMG - === */
  #model-header > div:first-of-type .model-img + div {
      display: inline-block !important;
      width: 390px !important;
      max-height: 170px !important;
      margin-top: 0px !important;
      margin-left: 0px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
  }
  /* (new53) PHO LEGEND COURTESY */
  #model-header>div>div>div>div[style="flex-grow: 1; width: 0"] {
      display: inline-block !important;
      width: 390px !important;
      max-height: 20px !important;
      margin-top: 0px !important;
      margin-left: 0px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
  }

  /* RATING */
  /*.unit-rating a.r1-unit {
      width: 30px !important;
  }
  .unit-rating a.r2-unit {
      width: 60px !important;
  }
  .unit-rating a.r3-unit {
      width: 90px !important;
  }
  .unit-rating a.r4-unit {
      width: 120px !important;
  }
  .unit-rating a.r5-unit {
      width: 150px !important;
  }*/
  #model-header > div:first-of-type .model-img + div > div #votebar {
      display: inline-block!important;
      width: 400px !important;
      max-width: 400px !important;
      text-align: center !important;
  }
  #model-header > div:first-of-type .model-img + div > div #votebar .unit-rating {
      display: inline-block !important;
      width: 150px;
  }
  #model-header > div:first-of-type .model-img[src="http://img.indexxx.com/images/mindex/no-image-yet.jpg"] {
      display: inline-block!important;
      width: 100px !important;
      height: 100px !important;
      margin-left: 155px !important;
      text-align: center !important;
  border: 1px solid black;
  }
  #model-header > div:first-of-type .model-img[src="http://img.indexxx.com/images/mindex/no-image-yet.jpg"] + div > div #votebar .unit-rating {
      display: inline-block !important;
      margin-left: 0px !important;
  }
  #model-header > div:first-of-type #tagBox {
      display: inline-block !important;
      min-width: 400px !important;
      margin-left: 0px !important;
      margin-top: -7px !important;
      text-align: center !important;
  }
  #model-websites-box {
      width: 100% !important;
      margin-top: 0 !important;
      margin-left: 0px !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      overflow-x: hidden !important;
      resize: none !important;
  background-color: #666666 !important;
  border: 1px solid #cc00cc;
  }
  #model-websites-box>div:first-of-type .box-body {
      display: inline-block;
      width: 100%;
      height: 100%;
      min-height: 51.9vh !important;
      max-height: 51.9vh !important;
      margin-bottom: -4px;
      resize: none;
  border: 1px solid #cc00cc;
  }
  #pageWrapper #model-header  #tagBox .box-body> ul.list-inline.my-auto ,
  #pageWrapper #model-header  #tagBox .box-body>div:first-of-type {
      min-height: 8vh !important;
      max-height: 8vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  #pageWrapper #model-header  #tagBox .box-body> ul.list-inline.my-auto + div {
      min-height: 20px !important;
      max-height: 20px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  #pageWrapper #model-header  #tagBox .box-body> ul.list-inline.my-auto li:nth-child(odd) a {
      color: tomato !important;
  }
  #pageWrapper #model-header  #tagBox .box-body> ul.list-inline.my-auto li:nth-child(even) a {
      color: green !important;
  }
  #url-box {
      max-height: 56.1vh !important;
      min-height: 56.1vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width:100% !important;
      margin: 0 0px 0px 0px !important;
      border: 1px solid #cc00cc;
      overflow: hidden !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      resize: none !important;
  background-color: #666666 !important;
  }
  #url-box  .box-body > div:first-of-type {
      display: inline-block !important;
      float: none !important;
      max-height: 50.8vh !important;
      min-height: 50.8vh !important;
      width: 100% !important;
      margin: 0 0px 0px 0px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      resize: none !important;
  border: 1px solid #cc00cc;
  }

  .block1.clearfix {
      display: inline-block !important;
      min-width: 100% !important;
      margin-top: 0px !important;
  border-top: 1px solid red !important;
  }
  .block1.clearfix h2.title3 {
      display: inline-block;
      margin: auto;
      text-align: center;
      width: 100%;
  border-bottom: 1px solid red !important;
  }

  #comments-box {
      width: 100% !important;
      height: 100% !important;
      max-height: 55.5vh !important;
      min-height: 55.5vh !important;
      margin-bottom: 2px !important;
      overflow: hidden !important;
      resize: none !important;
  background-color: white;
  }
  #model-header > div:first-of-type + div > div#comments-box .box-body .model-comments ,
  .model-comments {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 50.7vh !important;
      min-height: 50.7vh !important;
      margin-bottom: -4px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      resize: none !important;
  background-color: #f7e5f9 !important;
  border: 1px solid #cc00cc !important;
  }
  #model-header > div:first-of-type + div > div#comments-box .box-body .model-comments  .messageArea {
      display: inline-block !important;
      width: 100% !important;
      min-width: 265px !important;
      max-width: 2605px !important;
      margin-bottom: 2px !important;
  }

  #postCommentLink {
      display: inline-block !important;
  }
  #postCommentLink {
      color: white !important;
  }
  #postCommentLink:hover {
      color: tomato !important;
  }
  /* HORIZONTAL CURSOR */
  .ui-resizable-e {
  display: none !important;
      cursor: w-resize !important; 
      right: -5px;
      top: 0;
      width: 7px;
  background: red !important;
  }
  .ui-resizable-s {
      bottom: -5px;
      cursor: w-resize !important; 
      height: 7px;
      left: 0;
      width: 100%;
  }
  #model-comments-box .ui-icon.ui-icon-gripsmall-diagonal-se {
      cursor: w-resize !important; 
      background-image: url("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/images/ui-icons_222222_256x240.png");
      background-position: -95px -79px !important;
  }
  #model-comments-box .ui-icon.ui-icon-gripsmall-diagonal-se:hover {
      cursor: w-resize !important; 
      background-image: url("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/images/ui-icons_222222_256x240.png");
  background-color: red !important;
  }
  #model-websites-box .box-body > ul {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 51.7vh !important;
      max-height: 51.7vh !important;
      margin: 0 0 -5px 0 !important;
      overflow: auto !important;
      overflow-y: auto !important;
  background-color: #ffccff;
  }
  #postCommentLink ,
  #url-box .box-body>div ,
  #pageWrapper #model-header #tagBox >.box-body>div:last-of-type ,
  #model-websites-box>div:last-of-type{
      padding: 0 5px ;
      font-size: 10px !important;
  color: darkblue !important;
  border-top: 1px solid red !important;
  background-color: #f7e5f9;
  }
  #url-box .box-body>div ,
  #pageWrapper #model-header #tagBox >.box-body>div:last-of-type {
      font-size: 12px !important;
  }
  #postCommentLink {
      width: 100% ;
      font-size: 12px !important;
  }
  #model-websites-box #id3a {
      color: darkblue;
  }
  #url-box .box-body > ul {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      max-width: 385px !important;
      min-width: 385px !important;
      height: 100% !important;
      line-height: 15px !important;
      max-height: 473px !important;
      min-height: 473px !important;
      margin-bottom: -4px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
  border: 1px solid #cc00cc;
  background-color: #ffccff;
  }
  #url-box .box-body>ul li {
      width: 400px !important;
      overflow: hidden !important;
      overflow-x: hidden !important;
      text-overflow: ellipsis !important;
  }
  .wrapper {
      display: inline-block;
      width: 160px!important;
      max-height: 135px!important;
      min-height: 135px!important;
      height: 100%!important;
      margin: 17px 0px -15px 5px ;
      padding: 0 !important;
      padding-bottom: 20px !important;
      text-align: center!important;
      -moz-box-orient: vertical;
  }
  .floatingElementsContainer {
      margin-bottom: 15px;
  }

  /* (new242) - SEARCH RESULTS PERSON */
  .floatingElementsContainer.d-flex.flex-wrap .modelPanel  {
      margin: 0 12px 4px 0 !important;
  }

  .floatingElementsContainer > div {
      float: left !important;
      width: 150px !important;
      height: 130px;
      line-height: 15px;
      margin: 0 19px 4px 0 !important;
      padding-top: 3px !important;
      text-align: center !important;
  border-radius: 5px !important;
  border: 1px solid gray !important;
  background: #333 !important;
  }
  .floatingElementsContainer > div .d-flex.card-img {
      display: inline-block !important;
      height: 101px !important;
      width: 150px !important;
  }
  .floatingElementsContainer > div img {
      display: inline-block !important;
      height: auto !important;
      height: 101px !important;
      width: auto !important;
      width: 148px !important;
      vertical-align: top !important;
      overflow: hidden !important;
      object-fit: contain !important;
      object-position: center center !important;
  }

  /* (new251) */
  .floatingElementsContainer > div a.modelLink3  {
  	position: absolute ;
      display: inline-block;
      width: 100% ;
      height: 15px;
      left: 0;
      bottom: 2px !important;
      padding-bottom: 5px !important;
      overflow: hidden;
      overflow-y: hidden ;
  color: peru !important;
  background: #333 !important;
  }
  .floatingElementsContainer > div a.modelLink3:not(:hover) {
      display: inline-block !important;
  	min-height: 2vh !important;
  	max-height: 2vh !important;
    line-height: 14px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  color: peru !important;
  }
  .floatingElementsContainer > div a.modelLink3:not(:hover) span {
      display: -webkit-box;
  	min-height: 1.5vh !important;
  	max-height: 1.5vh !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 1 !important;
    font-size: 12px !important;
    line-height: 14px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    vertical-align: middle !important;
    text-decoration: none !important;
    word-spacing: normal !important;
  color: peru !important;
  }
  .floatingElementsContainer > div a.modelLink3:hover  {
      position: absolute ;
      display: inline-block;
      width: 100% ;
      height: auto !important;
  	min-height: 2vh !important;
  	max-height: 10vh !important;
      left: 0;
      bottom: 0 !important;
      overflow: hidden;
      overflow-y: auto ;
  color: peru !important;
  background: #111 !important;
  border-top: 1px dotted red !important;
  }
  /* (new33 ) */
  .floatingElementsContainer > div a.modelLink3 span  {
      display: inline-block;
      width: 100% ;
    -webkit-user-select: text;  /* Chrome all / Safari all */
    -moz-user-select: text;     /* Firefox all */
    -ms-user-select: text;      /* IE 10+ */
  /*   user-select: all;  */         /* Likely future */
  }
  /* (new52)*/
  .mb-1.mb-md-0>a:visited , 
  .floatingElementsContainer > div a.modelLink3:visited span  {
      color: tomato !important;
  }
  .feedback + #pageWrapper h1 + h2 + div + div + div  .wrapper {
      max-height: 95px!important;
      min-height: 95px!important;
      height: 100%!important;
  }
  .wrapper .photo-element {
      display: inline-block!important;
      width: auto !important;
      max-width: 155px !important;
      min-height: 95px !important;
      max-height: 95px !important;
      height: auto !important;
      vertical-align: middle !important;
  }
  .item.wrapper.model>a:nth-child(2) {
      display: inline-block!important;
      position: relative!important;
      width: 100px!important;
      height: 15px !important;
      top: 5px !important;
      padding: 0 !important;
  color: white !important;
  background: rgba(10, 10, 10, 0.7) !important;
  }
  .item.wrapper.model:hover >a:nth-child(2) span {
      display: inline-block !important;
      position: relative !important;
      width: 100px !important;
      height: auto !important;
      line-height: 10px !important;
      top: -220% !important;
      padding: 2px 0 25px 0 !important;
  color: gold !important;
  background: rgba(10, 10, 10, 0.7) !important;
  }
  /* (new50) NAME */
  .wrapper .modelPanel .justify-content-center:not(.d-flex) {
      display: inline-block !important;
      height: 25px !important;
      width: 100% !important;
  }
  .wrapper .modelPanel .justify-content-center:not(.d-flex) .modelLink3 span {
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      width: 100% !important;
  }

  #url-box .box-body> div>div a {
      display: inline-block ;
      min-width: 99% !important;
      max-width: 99% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }

  /* (new51) MY BABES LIST - PHOTOS */
  #pageWrapper>h1+ h2 +div>a:nth-child(odd) {
      background: #111 ;
  }
  #pageWrapper>h1+ h2 +div>a:nth-child(even) {
      background: #333 ;
  }

  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center {
      float: left;
      height: 130px;
      line-height: 15px;
      width: 158px!important;
      margin-right: 5px;
      padding-top: 3px;
      text-align: center;
      border-radius: 5px;
      border: 1px solid gray !important;
  background: #333 ;
  }
  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center + div {
      display: block;
      height: 130px;
      width: 101px;
  }

  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center + div a.btn-warning  {
      position: relative;
      display: inline-block;
      height: 15px;
      width: 99px;
      top: -19px;
      margin-left: 0px;
      padding: 0;
      font-size: 9px;
      z-index: 500;
      border-radius: 0 0 0.2rem 0.2rem;
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529 !important;
  }
  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center + div a.btn-warning:hover  {
      background-color: #AA1414 !important;
      color: white !important;
  }
  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center .justify-content-center:last-of-type a {
      line-height: 11px !important;
  }

  /* (new83) MY FAVS LIST */
  #myBabeListPanel  .d-flex.flex-wrap > div {
      width: 8% !important;
      margin: 0 5px 5px 0 !important;
  }

  #myBabeListPanel  .d-flex.flex-wrap > div .modelPanel {
      float: left;
      height: 130px;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      line-height: 15px;
      margin: 0 0 0 0 !important;
      padding-top: 3px;
      text-align: center;
      border-radius: 5px;
  background: #333 !important;
  border: 1px solid red !important;
  }
  /* (new83) MY FAVS LIST - REMOVE BUTT */
  #myBabeListPanel .modelPanel + .btn.btn-warning.btn-sm {
      position: relative;
      display: inline-block;
      height: 15px;
      width: 100% !important;
      top: 0px !important;
      margin: 0 0 0 0 !important;
      padding: 0;
      font-size: 9px;
      z-index: 500;
      border-radius: 0 0 0.2rem 0.2rem;
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529 !important;
  }

  .d-flex.card-img.align-items-end.justify-content-center {
      display: inline-block !important;
      height: 105px !important;
      line-height: 105px !important;
      object-fit: contain;
      object-position: center  center;
  border: 1px solid red !important;
  }
  .d-flex.card-img.align-items-end.justify-content-center a img{
      display: inline-block !important;
  max-height: 100px !important;
  max-width: 95px !important;
  }

  /* (new38) MY BABES LIST - PAGER */
  #pageWrapper > h2 + div + div + div.d-flex.flex-wrap + div ,
  #pageWrapper > h2 + div + div {
      padding: 2px 1px !important;
      background: #111;
      text-align: center;
  }
  #pageWrapper > h2 + div + div .goto ,
  .goto {
      display: inline-block;
      width: 25px;
      height: 20px !important;
      margin-right: 5px !important;
      padding: 2px 1px !important;
      border-radius: 3px !important;
      text-align: center;
  background: #222;
  }
  .goto>a  {
      display: inline-block;
      width: 23px !important;
      height: 16px !important;
  background-color: black !important;
  color: peru !important;
  }
  .goto>a[disabled="disabled"]  {
      background-color: #AA1414 !important;
      color: white !important;
  }

  /* (new236) RESULTS PAGINATION - REVERSE ORDER (supp) === */
  .pagination {
      display: inline-block;
      justify-content: space-around;
      justify-content: flex-start !important;
      justify-content: flex-end !important;
      height: auto!important;
      line-height: 20px !important;
      width: 100% !important;
      font-size: 12px !important;
  color: gold !important;
  background: black !important;
  }
  .pagination li.page-item.text-center {
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      width: auto !important;
      margin-right: 3px !important;
      text-align: center !important;
  }
  /* (new236) */
  .pagination li.page-item.text-center:first-of-type  {
      max-width: unset !important;
      min-width: 30px;
  }
  /* (new236) */
  .pagination li.page-item.text-center:first-of-type a {
      display: inline-block;
      width: auto !important;
      height: 18px;
      line-height: 18px;
      margin-top: 0;
      padding: 0 2px;
  }

  #pageWrapper .pagination ul:first-of-type li:last-of-type{
      display: inline-block;
      height: 20px !important;
      line-height: 20px !important;
      max-width: 100px !important;
      margin-right: 2px !important;
      text-align: center !important;
  }

  #pageWrapper .pagination ul:first-of-type li:last-of-type a {
      width: auto !important;
  }

  #pageWrapper .pagination li.page-item.text-center.disabled {
      display: none ;
  }

  .pagination li {
      display: inline-block !important;
      height: 30px;
      max-width: 40px !important;
      line-height: 30px;
  }
  .pagination li.page-item.text-center a.current ,
  .pagination li.page-item.text-center a,
  .pagination li a.current ,
  .pagination li a {
      display: inline-block !important;
      height: 18px !important;
      line-height: 18px !important;
      margin-top: 0px !important;
      padding: 0px 2px;
  }
  .pagination span {
      display: inline-block !important;
      min-width: 30px !important;
      max-width: 30px !important;
      height: 15px !important;
      line-height: 17px !important;
      padding: 0px 2px;
      font-size: 10px !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) inset, 0 1px 0 rgba(255, 255, 255, 0.8);
  color: #f0f0f0;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  background: #616161 ;
  }
  #firstPaginator.pagination {
      margin-top: 4px !important;
      margin-bottom: 4px !important;
  }
  .copyPaginator ,
  .copyPaginator #firstPaginator {
      margin-top: 4px !important;
  }


  /* (new29) MODEL CONTAINER + HEADSHOTS - 
  WITH SNIPET:
  http://www.indexxx.com/models/2573/reyna/
  voir si poss meilleur qualite headshots:
  SMALL:
  src="http://img.indexxx.com/images/thumbs/85x85/models/alex-30-781369.jpg" 
  BIG:
  .photoSection>div>img
  src="http://img.indexxx.com/images/thumbs/160x181/sets/715325-karupspc.jpg">
   + div:not([itemprop="actor"]) 
  === */
  .searchResultMessage  + .floatingElementsContainer  .model,
  .model  {
      display: inline-block!important;
      float: none!important;
      width: 97px !important;
      min-height: 102px !important;
      max-height: 102px !important;
      margin: 5px -3px 15px  -1px ;
      padding: 5px !important;
      border-radius: 5px !important;
      text-align: center !important;
  border: 1px solid red !important;
  }

  .model>a:first-of-type {
  position: relative !important;
      display: inline-block!important;
      min-height: 92px !important;
      max-height: 92px !important;
      border: 1px solid white !important;
  }
  .model>a:first-of-type:visited {
      border: 1px solid red !important;
  }
  .model .modelLink3 {
      position: relative !important;
      display: inline-block !important;
      width: 95px !important;
      min-height: 14px !important;
      max-height: 14px !important;
      left: -5px !important;
      padding: 0 !important;
      border-radius: 0 0 5px 5px !important;
      overflow: hidden !important;
      background: rgba(13, 13, 13, 1) !important;
  }
  .model .modelLink3:hover {
      position: relative !important;
      display: inline-block !important;
      width: 207px !important;
      min-height: 109px !important;
      max-height: 109px !important;
      margin-top: -105px !important;
      padding: 5px 3px 3px 3px !important;
      margin-left: -2px !important;
      border-radius: 5px !important;
      z-index: 50000 !important;
      transition: all ease 0.2s !important;
  background: rgba(13, 13, 13, 0.61) !important;
  }
  .model .modelLink3>span {
      display: inline-block !important;
      width: 85px !important;
      min-height: 15px !important;
      max-height: 15px !important;
      line-height: 14px !important;
      padding: 0px 5px !important;
      padding: 0 5px !important;
      overflow: hidden !important;
  color: peru !important;
  }
  .model .modelLink3:hover>span {
      display: inline-block !important;
      width: 80px !important;
      min-height: 100px !important;
      max-height: 100px !important;
      border-radius: 3px !important;
      padding: 2px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      background: #333 !important;
  color: peru !important;
  }
  .model .modelLink3:hover>span ,
  .model .modelLink3>span:hover {
      width: 197px !important;
      min-height: 105px !important;
      max-height: 105px !important;
      line-height: 15px !important;
      border-radius: 3px !important;
      padding: 2px 5px !important;
      z-index: 50000 !important;
      pointer-events: none !important;
  color: tomato !important;
  background: #333 !important;
  }
  .model .modelLink3>span:visited {
      color: red !important;
  }

  /* (new238) MODEL INFO - PHOTO */
  #model-header > div:first-of-type>div:first-of-type{
  display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 37vh !important;
      min-height: 37vh !important;
      margin-bottom: 0px !important;
      margin-left: -6px !important;
  }

  /* (new239) STAR RATING */
  .model-snippet-box.votebar {
  position: relative  !important;
      height: 55px !important;
      max-width: 394px ;
      min-width: 394px !important;
      margin: -4px 0 0vh -1px !important;
      padding: 0 !important;
      z-index: 500 !important;
  }
  .unit-rating {
      display: inline-block !important;
  /*     max-width: 394px ;
      min-width: 394px !important; */
      left: 2px ;
      top: 2px;
  overflow: hidden !important;
      z-index: 500 !important;
  }
  #model-header .votebar .ratingText {
  float: right !important;
      width: 200px;
      height: 34px !important;
      line-height: 34px;
      z-index: 500 !important;
  }
  /* (new37) COVERS MOVIES / SET  */
  .pset {
      position: relative;
      height: 245px !important;
      line-height: 1;
      min-width: 190px !important;
      top: 0;
      margin-bottom: 0px !important;
      margin-right: -3px !important;
      padding: 3px !important;
      border-radius: 5px !important;
      border: 2px solid gray !important;
  }
  .pset .photoSection > div {
      width: 160px !important;
      height: 181px !important;
      line-height: 281px !important;
      text-align: center !important;
  }
  /* PHOTO / GALLERIE */
  .pset .photoSection > div {
      height: 181px !important;
      width: 169px !important;
      margin-left: -3px !important;
      overflow: hidden !important;
  }
  /* (new40) */
  .photoSection>div>img ,
  .pset .photoSection > div .psetPhotoLink > img {
      display: inline-block !important;
      height: auto !important;
      height: 171px !important;
      width: auto !important;
      width: 200px !important;
      vertical-align: top !important;
      overflow: hidden !important;
  object-fit: contain !important;
  object-position: center 3vh !important;
  }
  .models {
      display: inline-block !important;
      width: 168px !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      margin-left: 1px !important;
      padding: 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background-color: #111 !important;
  border: 1px solid gray !important;
  }

  .models:hover .modelLink.item {
      display: inline-block !important;
      height: 15px !important;
      line-height: 13px !important;
      margin-top: -3px !important;
      margin-bottom: 3px !important;
      border-radius: 3px !important;
      padding: 0px 2px !important;
      color: peru !important;
  background-color: #333 !important;
  }
  .models:hover span.modelLink.item:hover {
      color: tomato !important;
      background-color: #333 !important;
  }
  .models:hover .modelLink.item:visited {
      color: red !important;
  }
  .defaultHidden {
  display: none !important;
  }
  .pset .models:hover + .defaultHidden:hover ,
  .pset .models:hover + .defaultHidden {
      display: none !important;
  }


  /* (new11) PHOTO CONTAINER - 
  TEST LINK:
  https://www.indexxx.com/models/727/wiska/
  === */
  #pageNrBox2 {
      height: auto !important;
      padding: 0 5px !important;
  background: red !important;
  }

  #model-header #pageNrBox2 + div {
      display: table !important;
  }
  #model-header #pageNrBox2 + div > div {
      position: relative;
      display: inline-block !important;
      vertical-align: top !important;
      min-width: 164px !important;
      max-width: 164px !important;
      min-height: 245px !important;
      max-height: 245px !important;
      line-height: 1;
      top: 0;
      margin-bottom: 3px !important;
      margin-right: 3px !important;
      padding: 3px !important;
      border-radius: 5px !important;
      text-align: center !important;
  border: 2px solid gray !important;
  }
  #model-header #pageNrBox2 + div > div >img {
      position: relative;
      display: inline-block !important;
      max-width: 154px !important;
      max-height: 255px !important;
      line-height: 1;
      border-radius: 5px !important;
      text-align: center !important;
  border: 2px solid gray !important;
  }

  /* TEST LINKIFY PLUS TEXTARERA FAIL 
  https://www.indexxx.com/m/nicole-love-1
  https://greasyfork.org/fr/scripts/4255-linkify-plus-plus/discussions/77679
  === */
  .model-snippet-box:not(.votebar):not(#model-comments-box):not(#tagBox) .box-body.modelNote form > div textarea  a.linkifyplus[href^="https://xhamster.com/pornstars/"] {
      position: relative !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 15px !important;
      max-height: 15px !important;
      width: 100% !important;
      min-width: 300px !important;
      max-width: 300px  !important;
      visibility: visible !important;
      opacity: 1 !important;
      font-size: 20px !important;
      color: peru !important;
      background-color: red !important;
  }

  /* ==== COLOR ==== */

  /* BACKGROUND #222 */
  body ,
  #leftCol ,
  .row {
      background: #222 !important;
  }


  /* BACKGOUND - #333 */
  .table.table-striped.table-sm .even>td:not(:first-of-type) {
      background: #333 !important;
  }


  /* TEXT / LINK */

  /* SILVER */
  .infoToolData {
      color: silver !important;
  }

  /* PERU */

  .block1.clearfix h2.title3 ,
  #model-name ,
  a {
      color: peru !important;
  }

  /* GOLD */

  .table-sm td, 
  .table-sm th{
      color: gold !important;
  }


  /* (new39) WHITE */

  a.addToMyBabes{
      color: white !important;
  }


  /* BLUE - #00008b */

  #model-websites-box ul ul > li a ,
  #url-box .box-body > ul li a {
      color: #00008b !important;
  }

  #model-websites-box ul ul > li a:visited ,
  #url-box .box-body > ul li a:visited {
      color: tomato !important;
  }

  /* ==== END ==== NORMAL -=== */

  /* === IndeXXX -  Search -  HI-RES Pics - v.3.65 ==== */

  .floatingElementsContainer.d-flex.flex-wrap  .modelPanel.card.border-0.text-center.align-items-center {
      background: rgba(0, 0, 0, 0.07) !important;
      border: 1px solid #333 !important;
  }

  .floatingElementsContainer.d-flex.flex-wrap .d-flex.card-img.align-items-end.justify-content-center a {
      display: inline-block !important;
      height: 100% !important;
      min-height: 100% !important;
      max-height: 100% !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid aqua !important;*/
  }
  .floatingElementsContainer.d-flex.flex-wrap .d-flex.card-img.align-items-end.justify-content-center a img.photo-element {
      display: inline-block !important;
      height: 100% !important;
      min-height: 100% !important;
      max-height: 100% !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      background-repeat: no-repeat !important;
  background-size: contain !important;
  background-position: center center !important;
  background-color: #111 !important;
  object-fit: contain !important;
  }

  /*=== END == IndeXXX -  Search -  HI-RES Pics ==== */

  /* === (new66) x- IndeXX - SETs - Show directly thumbnails of Actress - v.2.65 ==== */
  .block1.clearfix {
  background: #222 !important;
  border: 1px solid gray;
  }
  .floatingElementsContainer .pset.card.text-center.border-0.smaller.mb-3.mb-md-0 {
      position: relative !important;
      float: left !important;
      height: auto !important;
      height: 190px !important;
      line-height: 15px;
      min-width: 32% !important;
      max-width: 32% !important;
      top: 0;
      margin: 0 5px 4px 10px !important;
      padding-top: 3px !important;
      border-radius: 5px;
      text-align: center;
  background: #333 !important;
  border: 1px solid gray;
  }

  .pset.card.text-center.border-0.smaller.mb-3.mb-md-0 .photoSection.card-img-top.d-flex.align-items-end.justify-content-center {
      display: inline-block !important;
      height: 181px !important;
      width: 48% !important;
      overflow: hidden !important;
  border: 1px solid #222 !important;
  } 
  .pset .photoSection > div {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      overflow: hidden;
  }
  .psetInfo {
      position: absolute !important;
      display: inline-block !important;
      max-height: 180px !important;
      min-height: 180px !important;
      width: 50% !important;
      top: 0 !important;
      right: 0 !important;
  overflow: visible  !important;
  border-left: 1px solid red !important;
  } 

  .pset ul {
      position: relative !important;
      display: inline-block !important;
      width: 99% !important;
      max-height: 17vh !important;
      min-height: 17vh !important;
      bottom: 0;
      left: 0;
      margin-left: 1px;
      overflow: hidden;
      overflow-y: auto !important;
      padding: 0;
  /* border: 1px solid aqua !important; */
  }
  .pset ul li {
      display: block !important;
  	float: left !important;
      max-height: 90px !important;
      line-height: 15px !important;
      width: 50% !important;
  	margin: 0 0 4px 0 !important;
  	background-color: brown !important;
  }

  .pset ul .modelLink.item:not([style="color: red;"]) {
      display: inline-block !important;
      min-height: 87px !important;
      max-height: 87px !important;
      line-height: 15px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 0px 0 0 !important;
      padding: 0px 0 0px 0  !important;
      vertical-align: bottom !important;
      background-size : contain !important;
      background-repeat : no-repeat !important;
      background-position: center 18px !important;
      visibility: visible !important;
      opacity: 1 !important;
  color: gold !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }
  .pset ul .modelLink.item:not([style="color: red;"]):not([style^="background-image"]) {
      display: inline-block !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 20px !important;
      width: 85px !important;
      margin: 0px 0px 0 0 !important;
  color: gold !important;
  background-color: #111 !important;
  }
  .pset:hover ul .modelLink.item:not([style="color: red;"]):not([style^="background-image"]) {
      margin: 4px 0px 0 0 !important;
  }

  .pset ul  a.modelLink.item:not([style="color: red;"]) {
      color: peru !important;
      background-color: #111 !important;
  }

  /* (new240) WITH PORNSTAR THUMB */
  .pset ul:has(a[style^="background-image: url"]) li {
      display: block !important;
  	float: left !important;
  	min-height: 90px !important;
      max-height: 90px !important;
      line-height: 15px !important;
      width: 50% !important;
  	margin: 0 0 4px 0 !important;
  background-color: brown !important;
  }

  /* (new245) :before */
  .pset .psetInfo > .my-2.my-sm-1.my-md-0 {
  /*     content: "x" !important; */
      position: absolute !important;
      display: inline-block !important;
      height: 20px !important;
      width: 244px !important;
  	margin: 0px 0 0 -259px !important;
  	top: 4px !important;
  	font-size: 15px  !important;
  	border-radius: 5px 5px 0 0 !important;
      text-decoration: none !important;
      cursor: pointer !important;
  	z-index: 5 !important;
  color: silver !important;
  background: #111 !important;
  }
  .pset .psetInfo > .my-2.my-sm-1.my-md-0 a{
      text-decoration: none !important;
      cursor: pointer !important;
      color: peru !important;
  }
  .pset .psetInfo > .my-2.my-sm-1.my-md-0 a time{
      position: relative  !important;
      top: 3px !important;
      padding: 0 50px  !important;
      border-radius: 3px 3px 0 0  !important;
      text-decoration: none !important;
      cursor: pointer !important;
      color: peru !important;
  background: #111  !important;
  border: 1px solid peru !important;
  }
  .pset .psetInfo >  .my-2.my-sm-1.my-md-0 a:visited time{
      color: tomato !important;
  }

  .pset .psetInfo > .my-2.my-sm-1.my-md-0 a time:before{
      content: "👁" !important;
  	position: absolute !important;
  	display: inline-block !important;
  	height: 17.2vh  !important;
  	line-height: 17vh !important;
  	margin: 18px 0 0 -84px !important;
  	padding: 0 5px 0 5px !important;
  	font-size: 28px  !important;
  	border-radius: 0px 0 0 5px !important;
      text-decoration: none !important;
      cursor: pointer !important;
      color: silver !important;
  background: black !important;
  }
  .pset .psetInfo > .my-2.my-sm-1.my-md-0 a:hover time:before{
      content: "👁" !important;
      color: gold !important;
  background: black !important;
  }
  .pset .psetInfo .psWebsite.card-link.mb-md-0 {
      text-decoration: none !important;
      color: peru !important;
  background-color: #111 !important;
  }
  .pset .models.card-link, 
  .models.card-link ,
  .pset:hover .models.card-link, 
  .models.card-link:hover {
      position: relative !important;
      display: inline-block !important;
      width: 97.5% !important;
      max-height: 18vh !important;
      min-height: 18vh !important;
      bottom: 0;
      left: 0;
      margin-left: 1px;
      overflow: hidden;
      padding: 0 !important;
  background: #222 !important;
  }

  /*=== END == x- IndeXX - SETs - Show directly thumbnails of Actress ==== */

  /* (new62) GOOGLE RESULTS */
  .gsc-modal-background-image {
      position: fixed;
      height: 130%;
      width: 100%;
      left: 0;
      top: 0;
      transition: all 0.25s linear 0s;
      z-index: 100001;
  background-color: #111 !important;
  }
  .gsc-results-wrapper-overlay.gsc-results-wrapper-visible {
      position: fixed;
      min-height: 95vh !important;
      max-height: 95vh !important;
      width: 80% !important;
      left: 8% !important;
      top: 2vh !important;
      margin: auto;
      padding: 0 10px 0 10px !important;
      overflow: auto;
      overflow-x: hidden !important;
      overflow-y: hidden !important;
      transition: all 0.25s linear 0s;
      z-index: 100002;
      border-collapse: separate;
      border-radius: 1px;
      border: medium none;
      box-shadow: 0 3px 10px rgba(34, 25, 25, 0.4);
  background: #111 !important;
  }

  .gsc-wrapper {
      display: block;
      position: relative;
  border: 1px solid red !important;
  }
  .gsc-results {
      padding-bottom: 2px;
      width: 100% !important;
  }
  .gsc-webResult.gsc-result {
      width: 23.5% !important;
      float: left !important;
      height: 240px !important;
      margin: 5px 3px 3px 15px !important;
      padding: 2px !important;
      border-radius: 5px !important;
  background: #333 !important;
  border: 1px solid red !important;
  }
  .gs-result .gs-title a  b{
      color: #15c !important;
  }
  .gs-result .gs-title a:visited  b {
      color: red !important;
  }
  /* (new61) GOOGLE RESULTS - BIG IMAGES */

  .gs-web-image-box, 
  .gs-promotion-image-box {
      float: left;
      width: 135px !important;
      min-height: 19.5vh !important;
      max-height: 19.5vh !important;
      margin: 0 0px 0 0 !important;
      padding: 2px 0 0 0 !important;
      text-align: center;
  border-top: 1px solid red !important;
  }
  .gs-web-image-box > a.gs-image, 
  .gs-promotion-image-box > a.gs-promotion-image {
      min-height: 130px !important;
      max-height: 130px !important;
      min-width: 120px !important;
      max-width: 120px !important;
  border: none !important;
  }
  .gs-web-image-box img.gs-image:not(a) , 
  .gs-promotion-image-box img.gs-promotion-image:not(a)  {
      min-height: 18.5vh !important;
      max-height: 18.5vh !important;
      min-width: 125px !important;
      max-width: 125px !important;
      object-fit: contain !important;
  background-color: #111 !important;
  }

  .gsc-table-cell-snippet-close, 
  .gs-promotion-text-cell {
      vertical-align: top;
      width: 100% !important;
  }
  .gs-webResult .gs-snippet {
  /*     display: none !important; */
  /* border: 1px solid aqua !important; */
  }
  .gsc-table-cell-thumbnail.gsc-thumbnail + .gsc-table-cell-snippet-close {
      position: relative !important;
      display: inline-block !important;
      height: 19.5vh !important;
      width: 61% !important;
      bottom: 19.5vh !important;
      left: 7vw !important;
      padding: 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-top: 1px solid red !important;
  }
  .gsc-control-cse .gs-spelling, 
  .gsc-control-cse .gs-result .gs-title, 
  .gsc-control-cse .gs-result .gs-title * {
      font-size: 16px !important;
  }
  .gsc-result .gsc-thumbnail-inside a.gs-title {
      display: inline-block !important;
      min-width: 99.5% !important;
      max-width: 99.5% !important;
      line-height: 15px !important;
      height: 15px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  }
  .gsc-result .gsc-thumbnail-inside + .gsc-url-top  .gs-visibleUrl-long {
      display: none !important;
  }
  .gsc-result .gsc-thumbnail-inside + .gsc-url-top  .gs-visibleUrl-breadcrumb {
      display: inline-block !important;
      max-width: 99.5% !important;
      line-height: 15px !important;
      height: 15px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  color: violet !important;
  }
  .gsc-control-cse .gsc-table-result {
      width: auto;
      height: 190px !important;
  background: #222 !important;
  }


  .gs-webResult .gs-snippet, .gs-fileFormatType {
      color: #CCCFD3 !important;
  }
  .gs-bidi-start-align.gs-snippet>b {
      color: gold !important
  }

  /* === END === */
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /*  GM - SHOW RELATED  ACTRESS (new250) */

  /* (new250) INDICATOR */
  .related-actresses-container:has(li) {
      position: relative;
      display: inline-block;
      height: 3vh !important;
      margin: 0 5px 0 5px !important;
      padding: 4px 5px !important;
      border-radius: 5px !important;
      background: olive !important;
  }

  `;
}
if (location.href.startsWith("https://www.indexxx.com/modellink?") || location.href.startsWith("https://www.indexxx.com/modelcomment") || location.href.startsWith("http://www.indexxx.com/modelcomment") || location.href.startsWith("http://www.indexxx.com/modellink?")) {
  css += `
  /* POST MODEL LINK == 
  https://www.indexxx.com/modellink?
  ==== */


  /* URL PREF - POST MODEL LINK  - POPUP - === */

  /* (new16) URL PREF - POST MODEL LINK - POST COMMENT - === */
  #contentDiv>div:first-of-type:before {
      content: " Hover it, to read rules !" ;
      display: inline-block !important;
      width: 400px !important;
  color: red !important;
  }
  #contentDiv>div:first-of-type {
      position: absolute !important;
      display: inline-block !important;
      width: 400px !important;
      height: 30px !important;
      top: 30px !important;
      overflow: hidden !important;
  }
  #contentDiv>div:first-of-type:hover {
      display: inline-block !important;
      height: 500px !important;
      padding: 20px !important;
      border-radius: 0 0 5px 5px !important;
      overflow: hidden !important;
  background: white !important;
  border: 1px solid red !important;
  }

  /* (new32) URL PREF - POST MODEL LINK   - POST LINK - === */
  #url-form-box>h3 ,
  #url-form-box #postUrl {
      color: gold !important;
  }
  .feedbackPanel {
      margin-top: 30px !important;
      margin-bottom: -22px !important;
      padding-left: 7px !important;
  }
  .feedbackPanelERROR {
       background: gold !important;
  }
  #id1ff li  {
      color: gold !important;
  background: red !important;
  }
  #url-form-box {
      margin-top: 42px !important;
  }
  #url-form-box>div>ul>li:last-of-type {
      position: absolute !important;
      display: inline-block !important;
      width: 550px !important;
      height: 30px !important;
      line-height: 15px !important;
      top: 0px !important;
      overflow: hidden !important;
  border-bottom: 1px solid red !important;
  }
  #url-form-box>div>ul>li:last-of-type:hover {
      display: inline-block !important;
      height: 350px !important;
      width: 500px !important;
      padding: 20px !important;
      border-radius: 0 0 5px 5px !important;
      overflow: hidden !important;
  background: white !important;
  border: 1px solid red !important;
  }

  .infoToolTip {
      display: inline-block !important;
      visibility: visible !important;
      padding: 0 10px !important;
  background: yellow;

  }
  .infoToolData:hover {
      display: inline-block !important;
      font-size: 10px !important;
  }
  .infoToolData:before {
      content: "Guideline:" ;
      display: inline-block;
      width: 400px !important;
      font-size: 15px !important;
  }
  #id4a0>p:first-of-type>strong {
      display: inline-block !important;
      width: 400px !important;
  color: blue !important;
  }
  .boxleft {
      margin-top: 30px !important;
      border-top: 1px solid red !important;
  }

  .boxleft form>textarea {
      min-height: 282px !important;
      min-width: 418px !important;
  }
  /* (new16) POST LINK - === */
  #postUrl>input[name="url"] {
      width: 400px;
  }
  #postUrl>input[name="p::title"] {
      width: 395px;
  }

  /* (new23) URL PREF - POST MODEL LINK  - LINKS BLOCKED */
  .boxleft form:before  ,
  #url-form-box:before  {
      content: " > Links NOT accepted for: \\A Xhamster , Nudevista , Xvideos , PornHub , PornDex , SpankBang , Biguz, \\A Fuq , EmaPorn , AdultFilmDatabase , Peachy18 , Peachyforum , \\A PlanetSuzy ,DefineBabe , AlbaGals , BabePedia , PornSavant ,  \\A PimpyPorn , EroticBeauties ,  WikiPorno, PimpyPorn, Porn-W,   \\A ClassModels, NameThatPornstar" ;
      display: inline-block !important;
      width: 100% !important;
      min-width: 350px !important;
      max-width: 350px !important;
      white-space: pre !important;
  color: gray !important;
  }
  /* URL PREF - POST MODEL LINK  - POST COMMENTS - LINKS BLOCKED */
  .boxleft form:before {
  color: red !important;
  }

  /* END === URL PREF - POST MODEL LINK ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/mybabe?")) {
  css += `
  /* MY BABE LIST  */

  /* (new39) URL PREF - MY BABE LIST - FEEDBACK MESSAGE - not in MY BABE LIST */
  .feedback {
      display: none !important;
  background: red !important;
  }
  /* (new43)URL PREF - MY BABE LIST - PHOTOS - THUMBNAILS */
  .d-flex.card-img.align-items-end.justify-content-center {
      display: inline-block !important;
      height: 85px !important;
      line-height: 85px !important;
      object-fit: contain;
      object-position: center  center;
  }
  .d-flex.card-img.align-items-end.justify-content-center a img{
      display: inline-block !important;
  max-height: 78px !important;
  }


  /* END === URL PREF - MY BABE LISTS ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/contact")) {
  css += `
  /* CONTACT */
  #pageWrapper {
      color: silver !important;
  }

  /* END === URL PREF - CONTACT ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/mysets")) {
  css += `
  /* MY SET LIST */

  /* (new39) URL PREF - MY BABE LIST - SETS - MY SET LIST - PAGI */
  .pagination.flex-wrap {
      position: relative;
      display: inline-block;
      width: 100%;
      height: auto !important;
      line-height: 16px !important;
      max-height: 25px !important;
      font-size: 12px;
      text-align: center;
      overflow: hidden !important;
  color: gold;
  background: black ;
  }
  .pagination.flex-wrap li.page-item.text-center {
      display: inline-block !important;
      height: 25px !important;
      line-height: 25px !important;
      margin-right: 5px !important;
      text-align: center;
      width: auto !important;
  border-radius: 5px !important;
  }
  .pagination.flex-wrap  li.page-item.text-center a {
      display: inline-block !important;
      height: 18px !important;
      line-height: 15px !important;
      width: auto !important;
      margin-top: 0;
      padding: 0 2px !important;
      border-radius: 5px !important;
      text-decoration: none !important;
  border: 1px solid #333 !important;
  background: #111 !important;
  }
  .pagination.flex-wrap  li.page-item.text-center.active a.page-link {
      background-color: green !important;
      border-color: green !important;
  }

  .pagination.flex-wrap  li.page-item.text-center a span {
      display: inline-block;
      width: auto !important;
      height: 14px !important;
      line-height: 15px !important;
      padding: 0 2px !important;
      border-radius: 5px !important;
      font-size: 13px;
  color: #f0f0f0;
  background: #616161 ;
  }

  /* URL PREF - MY BABE LIST - SETS - TOP */
  #pageNrLinks .pagination.flex-wrap {
      position: absolute !important;
      display: inline-block;
      height: auto !important;
      left: 0 !important;
      margin-top: 0px !important;
      top: 0px !important;
  }
  #pageNrLinks .pagination.flex-wrap:hover {
      position: relative;
      display: inline-block;
      width: 100%;
      height: auto !important;
      max-height: 200px !important;
      line-height: 30px;
      font-size: 12px;
      text-align: center;
      overflow: hidden !important;
      overflow-y: auto !important;
  color: gold;
  background: red !important;
  }

  /* URL PREF - MY BABE LIST - SETS - BOTTOM */
  #pageNrBox2 .pagination.flex-wrap {
      position: absolute !important;
      display: inline-block;
      height: auto !important;
      left: 5px !important;
      margin-top: 0px !important;
      bottom: -45px !important;
  }
  #pageNrBox2 .pagination.flex-wrap:hover {
      position: relative;
      display: inline-block;
      width: 100%;
      height: auto !important;
      max-height: 200px !important;
      line-height: 30px;
      font-size: 12px;
      text-align: center;
      overflow: hidden !important;
      overflow-y: auto !important;
  color: gold;
  background: red !important;
  }
  /* END === URL PREF - MY BABE LIST - SETS ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/websites/")) {
  css += `
  /* WEBSITES PAGES (new244)*/
  #pageWrapper>div>div[style="clear: both"] ,
  .clearfix::after {
      display: none !important;
  }
  /* WEBSITES  - TOP NAV */
  #pageWrapper>nav .breadcrumb {
  background: #111 !important;
  }
  #pageWrapper div[style="clear: both"] {
      clear: none !important;
  }
  div[style*="larger"] {
      font-size: larger;
      margin-bottom: 0px !important;
      margin-top: 0px !important;
  }

  /* WEBSITES  - VOTE */
  #pageWrapper #tagBox,
  #pageWrapper .model-snippet-box.votebar {
  float: left  !important;
  clear: both !important;
      margin-top: 5px;
      max-width: 475px !important;
      min-width: 475px !important;
      margin-left: -1px !important;
      z-index: 500;
  }
  #pageWrapper .votebar.model-snippet-box ul.unit-rating {
  float: left  !important;
  clear: none !important;
      left: 0px !important;
      overflow: hidden !important;
      z-index: 500;
  border: 1px solid red !important;
  }
  .unit-rating li.current-rating {
      display: block;
      height: 30px;
      position: absolute;
      text-indent: -9000px;
      overflow: hidden !important;
      z-index: 1;
  }
  .ratingText {
      float: left !important;
      width: 116px;
      height: 30px !important;
      line-height: 30px !important;
  }
  /* WEBSITES  - TAGS */

  #pageWrapper #tagBox ul.list-inline {
      background-color: #111;
  border: 1px solid red !important;
      padding: 0;
  }
  #pageWrapper #tagBox ul.list-inline:first-of-type li ,
  #pageWrapper #tagBox ul.list-inline li {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      margin-right: 2px;
      width: 100% !important;
      text-align: center !important;
  }
  #pageWrapper ul:first-of-type li.list-inline-item:last-of-type {
      min-width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
  }
  /* WEBSITES  - MODEL COMMENTS*/
  #comments-box {
  /*     display: inline-block; */
  float: left  !important;
  clear: both !important;
      height: 100%;
      max-height: 40vh !important;
      min-height: 40vh !important;
      max-width: 475px;
      min-width: 475px;
      margin: 5px 0 0 -1px !important;
      overflow: hidden;
      resize: none;
  background-color: white;
  }
  #comments-box .box-body {
      height: 100%;
      max-height: 28vh !important;
      min-height: 28vh !important;
      margin: 0;
      padding: 1px;
      overflow: hidden !important;
      background-color: #f7e5f9;
  }
  #comments-box .box-body .model-comments {
      height: 100%;
      max-height: 28vh !important;
      min-height: 28vh !important;
      margin: 0;
      padding: 1px;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  /* WEBSITES  - MODEL COMMENTS*/
  #model-comments-box {
      float: right !important;
      width: 1200px;
      margin: 4px 10px 43px 0 !important;
  border: 1px solid #c0c;
  background-color: #fcf;
  }
  #model-comments-box .model-comments {
      min-width: 1200px !important;
      max-height: 105px !important;
      min-height: 105px !important;
      margin-bottom: 5px;
      overflow: auto;
  background-color: #fff;
  }
  .messageArea {
      display: inline-block;
      padding: 0 0 0 10px;
      width: 100% !important;
  }
  .model-comments > div:nth-child(odd) {
      padding: 0 0 0 40px;
  border-left: 4px solid red !important;
  color: white !important;
  background-color: #222;
  }
  .model-comments > div:nth-child(even) {
      padding: 0 0 0 40px;
  border-left: 4px solid green !important;
  color: white !important;
  background-color: #333;
  }

  /* WEBSITES  - WEBSITES LIST */
  #pageWrapper ul {
      padding: 0 0 0 0px;
  background-color: #111;
  }

  #pageWrapper ul:first-of-type li.page-item.text-center{
  	display: inline-block !important;
  }
  #pageWrapper ul:first-of-type li.page-item.text-center:last-of-type ,
  #pageWrapper ul:first-of-type li.page-item.text-center:first-of-type{
  	display: inline-block !important;
      min-width: 100px !important;
      max-width: 100px !important;
      padding: 0 0 0 0px;
  }

  /* (new88) SITES LISTES */
  #pageWrapper #model-websites-box {
  	float: left  !important;
  	clear: both !important;
  	height: 30vh !important;
      max-width: 475px !important;
      min-width: 475px !important;
      margin: 5px 0 0 -1px !important;
  	overflow: hidden !important;
      z-index: 500;
  }
  #pageWrapper #model-websites-box ul {
  	height: 27.8vh !important;
      padding: 5px !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  }
  #pageWrapper #model-websites-box ul li {
  	display: inline-block !important;
      max-width: 210px !important;
      min-width: 210px !important;
  	margin: 0 5px 5px 7px !important;
      padding: 0 5px !important;
      background-color: #333;
  }
  /* (new88) SITES LISTES */
  #pageWrapper>ul>li {
      display: inline-block !important;
      width: 32.6% !important;
      min-height: 95px !important;
      max-height: 95px !important;
      margin: 0 3px 3px 0 !important;
      padding: 5px !important;
      overflow: hidden !important;
  border: 1px solid red !important;
  }
  #pageWrapper>ul>li:nth-child(odd) {
  	background-color: #222;
  }
  #pageWrapper>ul>li:nth-child(even) {
  	background-color: #333;
  }
  /* (new73) */
  #pageWrapper>ul>li>ul {
      list-style: outside !important;
      width: 100% !important;
      min-height: 65px !important;
      max-height: 65px !important;
      padding: 0 0 0 20px;
      overflow: hidden !important;
      overflow-y: auto !important;
  color: red !important;
  }
  #pageWrapper ul > li >ul  li {
      width: 500px !important;
      padding: 0 0 0 0px;
  border-left: 4px solid blue !important;
  }
  #pageWrapper>ul>li>ul .subLinks {
      color: transparent !important;
  }


  #pageWrapper>ul>li>a[href^="/websites/"]{
  	display: inline-block !important;
  	width: 100% !important;
      padding: 0 10px;
  	border-radius: 3px !important;
  	font-size: 20px  !important;
  color: gold !important;
  border: 1px solid gray !important;
  background-color: #222;
  }
  #pageWrapper>ul>li>ul>li>a[href^="/websites/"]{
  	padding: 0 5px 0 5px !important;
      color: tan !important;
  background: brown !important;
  }

  #pageWrapper .subLinks a {
      padding: 0 2px;
  	border-radius: 3px !important;
  border: 1px solid gray !important;
  background-color: #222;
  }
  /* (new40) URL PREF - WEBSITES  - PUBLICATIONS SET TAGS - LIST */
  .browserColumns {
      columns: auto 200px;
      overflow-wrap: break-word;
      margin-top: 20px;
  background: #111;
  }

  /* (new90) URL-PREF - WEBSITES PAGES - SETS lIST */
  #tagBox + div.clearfix + div {
  	display: inline-block !important;
  	width: 70% !important;
  	height: 60vh !important;
      padding: 0 5px 0 8px;
  	overflow: hidden !important;
  background-color: #222 !important;
  border: 1px solid red  !important;
  }
  #tagBox + div.clearfix + div  h2{
      line-height: 1 !important;
      margin-bottom: 0rem !important;
      font-size: 1.5rem !important;
  color: gold  !important;
  }

  #tagBox + div.clearfix + div .floatingElementsContainer {
  	display: inline-block !important;
  	height: 54.5vh !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  background-color: #333 !important;
  border-top: 1px solid red  !important;
  }
  .floatingElementsContainer .pset.card.text-center.border-0.smaller.mb-3.mb-md-0 {
      margin: 0 3px 4px 10px !important;
  background: #333 !important;
  border: 1px solid gray;
  }
  .pset .psetInfo > .my-2.my-sm-1.my-md-0 {
  	position: absolute;
      display: inline-block;
      height: 20px;
  	width: 182px !important;
      margin: -15px 0 0 -183px !important;
  	border-radius: 5px 5px  0 0  !important;
      font-size: 15px;
      text-decoration: none;
      cursor: pointer;
  	z-index: 5 !important;
  color: silver;
  background: #111 !important;
  }

  /* (new90) SET - MODELS UNDER SET LIST  - NO SITES MODELS LIST */
  #tagBox + div.clearfix + div + h2 {
      display: inline-block;
      width: 100%;
      height: 2vh !important;
  	margin: 5px 0 0 0 !important;
      padding: 0 5px 0 8px;
  	font-size: 15px  !important;
  color: gold  !important;
  background-color: #222;
  border: 1px solid red;
  }
  #tagBox + div.clearfix + div + h2 + div {
      display: inline-block;
      width: 100%;
      height: 1.5vh !important;
      line-height: 1.2vh !important;
      padding: 0 5px 0 8px;
  	margin: 0 0 0 0 !important;
  color: silver !important;
  background-color: #333 !important;
  border: 1px solid red
  }
  #tagBox + div.clearfix + div + h2 + div +.floatingElementsContainer {
  	display: inline-block !important;
  	width: 100% !important;
  	height: 16.5vh !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  background-color: #333 !important;
  border-top: 1px solid red  !important;
  }
  #tagBox + div.clearfix + div + h2 + div +.floatingElementsContainer > div {
      border-radius: 5px;
      float: left;
      height: 100px !important;
      line-height: 15px;
      margin: 0 8px 4px 10px !important;
      padding-top: 3px;
      text-align: center;
  }
  #tagBox + div.clearfix + div + h2 + div +.floatingElementsContainer > div .d-flex.card-img.align-items-end.justify-content-center {
      border: 1px solid red;
      display: inline-block;
  	height: 75px !important;
      line-height: 75px !important;
      object-fit: contain;
      object-position: center center;
  }
  #tagBox + div.clearfix + div + h2 + div +.floatingElementsContainer.d-flex.flex-wrap .d-flex.card-img.align-items-end.justify-content-center a img.photo-element {
      height: 100%;
      min-height: 100%;
      max-height: 100%;
  	min-width: 100%;
      max-width: 100%;
      object-fit: contain;
  	background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      display: inline-block;
  background-color: #111;
  }

  /* (new244) SET - MODELS UNDER SET LIST  - WITH SITES MODELS LIST */
  #pageWrapper #model-websites-box ~ #tagBox + div.clearfix + div + h2 {
      display: inline-block;
      width: 70% !important;
      height: 2vh !important;
  	margin: 5px 0 0 0 !important;
      padding: 0 5px 0 8px;
  	font-size: 15px  !important;
  color: gold  !important;
  background-color: green !important;
  border: 1px solid red;
  }
  #pageWrapper #model-websites-box ~ #tagBox + div.clearfix + div + h2 + div {
      display: inline-block;
      width: 70% !important;
      height: 1.5vh !important;
      line-height: 1.2vh !important;
      padding: 0 5px 0 8px;
  	margin: 0 0 0 0 !important;
  color: silver !important;
  background-color: #333 !important;
  border: 1px solid red
  }
  #pageWrapper #model-websites-box ~ #tagBox + div.clearfix + div + h2 + div +.floatingElementsContainer {
  	display: inline-block !important;
  	width: 70% !important;
  	height: 16.5vh !important;
      overflow: hidden !important;
  	overflow-y: auto !important;
  background-color: #333 !important;
  border-top: 1px solid red  !important;
  }


  /* END === URL-PREF - WEBSITES PAGES  ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/mybabetext?")) {
  css += `
  /* MY BABES LIST  TEXT */
  /* (new43) MY BABES LIST :
  https://www.indexxx.com/mybabetext?8
  === */
  .table.table-striped.table-sm td:not(:first-of-type) {
      line-height: 106px !important;
      padding: 0.3rem;
  }

  /* END === URL PREF - MY BABES LIST  TEXT  ==== */
  `;
}
if (location.href === "https://www.indexxx.com/tags/") {
  css += `
  /* JUST TAGS LIST */

  /* URL PREF - JUST TAGS LIST 
  https://www.indexxx.com/tags/
  === */
  #header  + .row #leftCol main.row {
      margin-top: 5vh !important;
  border-bottom: 1px solid red  !important;
  }

  /*  END === URL - JUST TAGS LIST ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/tags/") || location.href.startsWith("https://www.indexxx.com/tagcomment?")) {
  css += `
  /* TAGS LIST */
  /* URL PREF - TAGS LIST :
  https://www.indexxx.com/tags/338/grey-eyes/
  === */
  #header  + .row #leftCol main.row {
      margin-top: 5vh !important;
  border-bottom: 1px solid red  !important;
  }
  #comments-box {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 300px  !important;
      max-width: 300px  !important;
      max-height: 20px  !important;
      min-height: 20px !important;
      margin: 0 !important;
      top: -4vh !important;
      overflow: hidden !important;
      z-index: 50000 !important;
  background-color: #fcf;
  border: 1px solid #c0c;
  }
  #comments-box:hover {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      max-height: 365px !important;
      min-height: 365px !important;
      margin: 0 !important;
      top: -4vh !important;
      z-index: 50000 !important;
  background-color: #fcf;
  border: 1px solid #c0c;
  }
  #comments-box .model-comments {
      display: inline-block;
      width: 100%;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100%;
      min-height: 0px !important;
      max-height: 465px !important;
      resize: none;
  border: 1px solid aqua;
  }
  #comments-box:hover .model-comments {
      display: inline-block;
      width: 100%;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100%;
      min-height: 40px !important;
      max-height: 310px !important;
      resize: none;
  }

  /* MODAL TAGS COMMENTS */
  body {
      color: gray !important;
  }
  #pageWrapper > h1 {
      color: gold !important;
  }
  #pageWrapper > h2 {
      color: tomato !important;
  }
  #contentDiv>div:first-of-type > ul{
      position: absolute !important;
      display: inline-block !important;
      width: 90% !important;
      height: 20px !important;
      overflow: hidden !important;
  color: gold !important;
  background: #111 !important;
  }
  #contentDiv>div:first-of-type > ul:hover{
      position: absolute !important;
      display: inline-block !important;
      height: auto !important;
      z-index: 5000 !important;
  }
  #contentDiv>div:first-of-type > ul:after ,
  #contentDiv>div:first-of-type > ul:before{
      content: "🔻" !important;
      position: absolute !important;
      display: inline-block !important;
      height: 20px !important;
      width: 20px !important;
      text-align: center !important;
  color: gold !important;
  background: green !important;
  }
  #contentDiv>div:first-of-type > ul:after {
      right: 0 !important;
      top: 0 !important;
  }
  #contentDiv>div:first-of-type > ul > li:first-of-type{
      display: inline-block !important;
      padding: 0 0 0 30px !important;
  }
  .infoToolData ,
  .ui-helper-hidden-accessible ,
  .ui-helper-hidden-accessible > div {
      pointer-events: none !important;
  }
  .infoToolData {
      font-size: 75% !important;
      pointer-events: none !important;
  color: white !important;
  }

  /* (new84) TAGS LIST STUDIOS */
  #pageWrapper > ul {
      float: left !important;
      width: 10% !important;
  }


  /* END === URL PREF - TAGS LIST  ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/top")) {
  css += `
  /* TOP MODELS */

  #header  + .row #leftCol main.row {
      margin-top: 5vh !important;
  border-bottom: 1px solid red  !important;
  }

  /* (new43) URL PREF - TOP MODELS - MY BABES LIST - PHOTOS - THUMBNAILS */
  .d-flex.card-img.align-items-end.justify-content-center {
      display: inline-block !important;
      height: 105px !important;
      line-height: 85px !important;
      object-fit: contain;
      object-position: center  center;
  }
  .d-flex.card-img.align-items-end.justify-content-center a img{
      display: inline-block !important;
      max-height: 98px !important;
      max-width: 130px !important;
  }


  /* END === URL PREF - TOP MODELS ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/m?") || location.href.startsWith("https://www.indexxx.com/search/?")) {
  css += `
  /* SEARCH PAGES */

  /* (new238) GOOGLE SEARCH - SUPP */
  #pageWrapper>div:first-of-type:not([itemscope="itemscope"]):not(.floatingElementsContainer) {
      display: none  !important;
  }
  #pageWrapper>div:first-of-type:not([itemscope="itemscope"]):not(.floatingElementsContainer) .d-flex {
      display: flex;
      height: 4vh !important;
  }
  #pageWrapper>div:first-of-type:not([itemscope="itemscope"]):not(.floatingElementsContainer) .d-flex h5 {
      height: 3.9vh !important;
      line-height: 35px !important;
      margin: 0vh 0 0 0px !important;
      font-size: 1.25rem;
  }
  /* (new233) SEARCH - GOOGLE - #idc (CHROME) (ALL) #pageWrapper >form === */
  #pageWrapper form#idc + div ,
  #pageWrapper form#id2 + div ,
  #pageWrapper >form  + div  {
      float: right !important;
      height: 29px !important;
      width: 625px !important;
      margin-top: -22px !important;
  }
  #___gcse_0 {
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      height: 4vh !important;
      width: 100% !important;
      min-width: 745px !important;
      max-width: 745px !important;
      left: 200px !important;
      margin: 1px 0 0 0 !important;
  background-color: transparent !important;
  }
  #gsc-iw-id1 ,
  .gsc-search-box>tbody tr > .gsc-input ,
  .gsc-search-box > tbody ,
  table.gsc-search-box ,
  table.gsc-search-box ,
  form.gsc-search-box {
      display: inline-block !important;
      width: 100%;
      height: 100%;
      max-height: 3.6vh !important;
      min-height: 3.6vh !important;
      margin: 0 !important;
      font-size: 13px;
  background-color: white !important;
  }
  .gsc-control-cse ,
  .gsc-control-cse.gsc-control-cse-en {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 735px !important;
      max-width: 735px !important;
      max-height: 3.8vh !important;
      min-height: 3.8vh !important;
      margin: 0 !important;
      padding: 0 !important;
  background-color: transparent !important;
  }
  .gsc-control-cse > div {
      position: relative !important;
      height: 3.8vh  !important;
  background-color: transparent !important;
  }
  #gsc-i-id1 {
      position: relative !important;
      width: 100% !important;
      height: 3.2vh !important;
      top: 0px !important;
      padding: 0;
  }
  table.gsc-search-box td.gsib_a  {
      height: 3.2vh !important;
      padding: 0px 9px 4px !important;
  }
  input.gsc-search-button-v2 {
      height: 17px !important;
      margin-top: 0px !important;
      min-width: 13px;
      width: 13px;
      padding: 2px 7px !important;
  }

  .gsc-modal-background-image {
      background-color: #222;
  }

  /* (new98) GOOGLE PAGI */
  .gsc-results .gsc-cursor-box {
      display: inline-block !important;
      height: 6vh !important;
      line-height: 6vh !important;
      margin: 30px;
      font-size: 48px !important;
  border-radius: 5px !important;
  border: 1px solid red !important;
  }
  .gsc-results .gsc-cursor-box .gsc-cursor-page {
      cursor: pointer;
      display: inline;
      margin-right: 18px !important;
  }

  /* START (new75)SEARCH FORM - GOOGLE - MODELS PAGES BY APLPHAB */
  .row.leftContainer.ml-3 + .row   {
      position: relative;
      display: inline-block;
      width: 25.5%;
      height: 34px;
      right: 0px;
      top: 0px;
      margin-bottom: 45px !important;
      border-radius: 5px;
  background: green !important;
  }
  /* END (new75)URL-PREF -  SEARCH PAGES */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/settags/")) {
  css += `
  /* SET TAGS */

  /* START (new80)SEARCH FORM - GOOGLE - PULICATIONS SET TAGS BY APLPHAB */
  .row.leftContainer.ml-3 + .row   {
      position: relative;
      display: inline-block;
      width: 25.5%;
      height: 24px !important;
      right: 0px;
      top: 0px;
      margin-bottom: 45px !important;
      border-radius: 5px;
  background: green !important;
  }
  #leftCol main #pageWrapper {
      font-size: 13px;
      margin-top: 2vh !important;
      padding-left: 5px;
  }
  #pageWrapper > h1 {
      width: 100%;
      height: 20px;
      line-height: 17px;
      margin: -5.5vh  0 2vh 0 !important;
      padding: 0 5px;
      text-align: center;
  }

  /* END (new80) URL-PREF -  SET TAGS PAGES  */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/set/")) {
  css += `
  /* SETS (new244) */

  /* SUPP */
  #pageWrapper>div>div[style="clear: both"] ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]>p ,
  #pageWrapper>div>div>div[style="clear: both"] ,
  .clearfix {
      display: none !important;
  }

  /* (new245) SETS - BREADCRUMB */
  #pageWrapper nav[aria-label="breadcrumb"]{
  	display: inline-block !important;
      float: none !important;
      max-width: 100% !important;
      min-width: 100% !important;
      padding: 0 !important;
  	margin: 0 0 2vh 0px !important;
      z-index: 500;
  color: gray !important;
  background: #111!important;
  }
  /* (new80) URL PREF - SETS - ALL CONTAINERS */
  /* #pageWrapper>div>div , */
  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]> dl.row,
  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]> #tagBox.tagsPanel ,
  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]> p ,
  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]>.model-snippet-box.votebar ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]>h1 ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] #tagBox ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]>img  ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] >div>img ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] > h1 + img ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] img + .images + div + div ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]>p + h1 + div ,
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]>p + h1{
      float: left !important;
      clear: both !important;
      margin: 0 0 0 0px !important;
      max-width: 514px !important;
      min-width: 514px !important;
      padding: 0 !important;
      z-index: 500;
  color: gray !important;
  background: #111!important;
  }

  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]{
      float: left !important;
      clear: both !important;
      margin: 0 0 0 0px !important;
      max-width: 100% !important;
      min-width: 100% !important;
      padding: 0 !important;
      z-index: 500;
  color: gray !important;
  background: #111!important;
  }
  #pageWrapper>div>div>h1{
      float: left !important;
      clear: both !important;
      max-width: 514px !important;
      min-width: 514px !important;
      margin: 0 0 0 0px !important;
      padding: 0 !important;
      font-size: 15px  !important;
      z-index: 500;
  color: gold !important;
  /* background: green!important; */
  }
  #pageWrapper>div>div[itemtype="http://schema.org/Photograph"]>img {
      float: left !important;
      clear: both !important;
      max-height: 50vh !important;
      max-width: 100%;
      max-width: 514px !important;
      min-width: 514px !important;
      margin: 0 0 0 0px !important;
      padding: 0 !important;
      object-fit: contain !important;
  color: gray !important;
  background: #111 !important;
  }

  /* RIGHT */
  #pageWrapper dl.row + div + div[style="clear: both"] +div{
  	float: left !important;
  	clear: both !important;
      height: 78vh !important;
      max-width: 610px !important;
      min-width: 610px !important;
  	margin: -79vh 5px 0 530px !important;
      padding: 5px !important;
      border-radius: 5px !important;
      z-index: 500;
  color: gray !important;
  background: #111 !important;
  border: 1px solid red !important;
  }
  #pageWrapper dl.row + div + div[style="clear: both"] + div h2 {
      font-size: 20px  !important;
  }

  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center {
      float: left;
      height: 180px !important;
      line-height: 15px;
      width: 190px!important;
      margin: 0 6px 3px 3px !important;
      padding-top: 3px;
      text-align: center;
      border-radius: 5px;
      border: 1px solid green !important;
  background: #333 ;
  }
  .row.pb-2 + .row .col-12 #pageWrapper .d-flex.flex-wrap:not(.floatingElementsContainer) .modelPanel.card.border-0.text-center.align-items-center  .d-flex.card-img{
      margin-bottom: 7px !important;
  }

  /* (new89) SETS - COMMENTS */
  #comments-box  ,
  #pageWrapper dl.row + div + div[style="clear: both"] + div + div#comments-box  {
      height: 100%;
      max-height: 82vh !important;
      min-height: 82vh !important;
      width: 100%;
      max-width: 540px !important;
      min-width: 540px !important;
      margin: -77vh 5px 0 15px !important;
      padding: 5px !important;
      border-radius: 5px !important;
      overflow: hidden;
      resize: none;
      z-index: 500;
  color: gray !important;
  background-color: #333 !important;
  }

  #model-header > div:first-of-type + div > div#comments-box .box-body .model-comments, 
  .model-comments {
      border: 1px solid #cc00cc;
      display: inline-block;
      height: 100%;
      min-height: 65.7vh !important;
      max-height: 65.7vh !important;
      width: 100%;
      margin-bottom: -4px;
      resize: none;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  /* (new245) URL PREF - SETS - LEFT - TITLE TOP */
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]> h1:first-of-type {
  	position: relative !important;
  	display: inline-block !important;
      height: auto !important;
  	height: 4vh !important;
      line-height: 15px !important;
  	margin: 0vh 0 -2vh 0 !important;
  	top: -2vh !important;
  	padding: 2px  0 0 5px !important;
      font-size: 15px !important;
      border-radius: 5px 5px 0 0 !important;
  border: 1px solid red !important;
  }
  #pageWrapper>div[itemtype="http://schema.org/Photograph"]> h1:first-of-type span {
      display: inline-block !important;
      width: 100% !important;
      height: auto !important;
      line-height: 26px !important;
      font-size: 20px !important;
  }

  #pageWrapper>div>h1:last-of-type  {
      height: auto !important;
      line-height: 15px !important;
      font-size: 15px !important;
      border-radius: 0 !important;
  border-bottom: 1px solid red !important;
  }
  #pageWrapper>div>h1:last-of-type a  {
      display: inline-block !important;
      width: 100% !important;
      height: auto !important;
      line-height: 26px !important;
      font-size: 20px !important;
  }

  /* (new80) URL PREF - SETS - LEFT - COVER */ 
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] > h1 + img{
      min-height: 42vh !important;
      max-height: 42vh !important;
      max-width: 514px !important;
      min-width: 514px !important;
      padding: 0 5px!important;
      border-radius:  0 !important;
      object-fit: contain !important;
      outline: unset !important;
  border: 1px solid red !important;
  }


  /* (new45) URL PREF - SETS - LEFT - VOTE CONTAINER */
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] .model-snippet-box.votebar {
      height: 55px;
      margin: 0 0 0 -1px;
      max-width: 514px !important;
      min-width: 514px !important;
      padding: 0;
      z-index: 500;
  }
  .unit-rating {
      position: relative  !important;
      display: inline-block !important;
      width: 150px !important;
      left: 2px;
      top: 2px;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      z-index: 500 !important;
      background: rgba(0, 0, 0, 0) url("/votebar/starrating.gif") repeat-x scroll left top !important;
  }
  .unit-rating li {
      float: left !important;
      margin: 0;
      padding: 0;
      text-indent: -90000px;
  }
  .unit-rating li.current-rating {
      position: absolute !important;
      display: block !important;
      height: 30px;
      z-index: 1 !important;
  }
  .votebar .ratingText {
      float: right !important;
      height: 34px;
      line-height: 34px;
      width: 200px !important;
      z-index: 500 !important;
  color: red !important;
  }

  /* (new25) URL PREF - SETS - ROW */
  #pageWrapper > div[itemtype="http://schema.org/Photograph"] .row {
      float: left !important;
      clear: both !important;
      width: 514px !important;
      height: 19.5vh !important;
      line-height: 15px  !important;
      margin: 0 !important;
      top: 60vh !important;
      left: 20px !important;
      padding: 5px !important;
  color: gray !important;
  background: #111 !important;
  }
  #pageWrapper > div[itemtype="http://schema.org/Photograph"]  .row dt {
      position: relative;
      width: 100%;
      height: 20px !important;
      padding-left: 15px;
      padding-right: 15px;
  }

  /* (new89) URL PREF - SETS - RIGHT - COMMENTS CONTAINER */
  #pageWrapper div[itemtype="http://schema.org/Photograph"] #tagBox ~ .model-snippet-box ,

  #pageWrapper>div[itemtype="http://schema.org/Photograph"] #tagBox ~ #model-comments-box.model-snippet-box  {
      position: absolute !important;
      float: none !important;
      clear: both !important;
      max-width: 523px !important;
      min-width: 523px !important;
      height: auto !important;
      min-height: 545px !important;
      left: 550px !important;
      top: 20px !important;
      margin: 0px !important;
      padding: 5px !important;
      z-index: 500;
  border: 1px solid red !important;
  }

  /* (new245) NO COMMENTS */
  #comments-box:has(.model-comments:empty) .box-body .model-comments ,
  #comments-box:has(.model-comments:empty) .box-body  ,
  #comments-box:has(.model-comments:empty) {
  	background-color: transparent !important;
  }

  /* (new235) URL PREF - SETS - RIGHT - PERFORMER */
  #pageWrapper>div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div {
      position: absolute !important;
      float: none !important;
      clear: both !important;
      max-width: 550px !important;
      min-width: 550px !important;
      height: 100%;
      max-height: 82vh !important;
      min-height: 82vh !important;
      left: 1100px !important;
      top: 13vh !important;
      margin: 0px !important;
      padding: 5px !important;
      z-index: 500;
  border: 1px solid red !important;
  }
  /* (new89) URL PREF - SETS -  */
  #pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap:not(.floatingElementsContainer) {
      display: inline-block !important;
      max-width: 538px !important;
      min-width: 538px !important;
      max-height: 75vh !important;
      min-height: 75vh !important;
      padding: 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid red !important;
  }
  pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap .modelPanel.card.border-0.text-center.align-items-center ,
  #pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap >div.floatingElementsContainer .modelPanel.card {
      display: inline-block !important;
      float: none  !important;
      height: 190px !important;
      line-height: 15px;
      width: 170px!important;
      margin: 0 5px 5px 0 !important;
      padding: 0px !important;
      text-align: center !important;
      border-radius: 5px;
  background: #333 ;
  border: 1px solid red !important;
  }


  /* (new89) URL PREF - SETS -CARDS */
  #pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap .modelPanel.card.border-0.text-center.align-items-center .d-flex.card-img.align-items-end.justify-content-center {
      display: inline-block !important;
      min-height: 130px !important;
      line-height: 105px;
      margin-bottom: 5px !important;
      object-fit: contain;
      object-position: center center;
  border: none !important;
  border-bottom: 1px solid red !important;
  }

  #pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap .modelPanel.card.border-0.text-center.align-items-center .d-flex.card-img.align-items-end.justify-content-center  a img {
      display: inline-block;
      max-height: 117px !important;
  }
  #pageWrapper > div[itemtype="http://schema.org/Photograph"] #tagBox + div[style="clear: both"] + div .d-flex.flex-wrap:not(.floatingElementsContainer)  .modelPanel.card .justify-content-center a + div {
      color: gold  !important;
  }

  /* (new89) URL PREF - SETS - FEEDBACK VOTE - TOP RIGHT */
  #leftCol .col-12 > section {
      top: -19px !important;
  }

  /* END === URL PREF - SETS  PAGES ==== */
  `;
}
if (location.href.startsWith("https://www.indexxx.com/home")) {
  css += `
  /* HOME  */
  #pageWrapper {
      font-size: 13px;
      margin-top: 0;
      padding-left: 5px;
  }
  #pageWrapper  h1 {
      float: left !important;
      margin-bottom: 5px !important;
      margin-top: -10px !important;
  }

  #pageWrapper  .floatingElementsContainer.flex-wrap {
      float: left !important;
      width: 100% !important;
      height: auto !important;
      line-height: 15px;
      margin-right: 19px !important;
      padding-top: 3px !important;
      text-align: center !important;
  border-radius: 5px !important;
  border: 1px solid gray !important;
  }
  .floatingElementsContainer > div:not(.flex-wrap) {
      width: 150px !important;
      height: 130px;
      line-height: 15px;
      margin: 5px 15px 5px 5px !important;
      padding-top: 3px !important;
  text-align: center !important;
  border-radius: 5px !important;
  border: 1px solid gray !important;
  background: #222 !important;
  }
  .floatingElementsContainer + h1 + .floatingElementsContainer .floatingElementsContainer .card {
      width: 159px !important;
      margin: 5px !important;
      padding-top: 3px !important;
  text-align: center !important;
  border-radius: 5px !important;
  border: 1px solid gray !important;
  /* background: blue !important; */
  }


  /* END === URL PREF - HOME ==== */
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* GOOD - AQUA */

  /* SUPP + HIGHLIGTH - RELATED LINKS - FILTER and HIGHLIGHTING */

  /* (new82) HIGHTLIGHT - SETS - BEST - AQUA */
  a[href^="https://www.woodmancastingx.com/"] ,
  .psWebsite.card-link a[href="/out/website/490-woodmancastingx.com/"] {
      background-color: brown !important;
      text-decoration: none;
  }
  a[href^="https://www.woodmancastingx.com/"]:before ,
  .psWebsite.card-link a[href="/out/website/490-woodmancastingx.com/"]:before {
      content: "WoodmanCAST" !important;
      position: fixed !important;
      top: 22vh !important;
      left: -32px !important;
      padding: 1px !important;
      text-decoration: none;
      border-radius: 4px !important;
      transform: rotate(90deg) !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }

  /* BEST - VIDEOS SEARCH - BEST - BLUE === */

  li a[href^="https://www.fuq.com/"]:not(.modelLink) ,
  li a[href^="https://www.pornmd.com/"]:not(.modelLink) ,
  li a[href^="http://emaporn.com/"]:not(.modelLink) ,


  /* BEST - IMAGES/ INFOS - BEST - AQUA === */

  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,

  /* BEST -  AQUA */

  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="http://GOOD AQUA"]:not(.modelLink) ,
  li a[href^="https://forum.pornbox.com"]:not(.modelLink) ,
  li a[href^="https://www.pornworld.com"]:not(.modelLink) ,
  li a[href^="https://www.putalocura.com"]:not(.modelLink) ,
  li a[href^="https://theater.aebn.net"]:not(.modelLink) ,
  li a[href*=".woodmancastingx"]:not(.modelLink) ,
  li a[href^="https://www.flickr.com"]:not(.modelLink) ,
  li a[href^="https://straight.aebn.com"]:not(.modelLink) ,
  li a[href^="https://www.data18.com"]:not(.modelLink) ,
  li a[href^="https://namethatporn.com/"]:not(.modelLink) ,
  li a[href^="https://web.archive.org/"]:not(.modelLink) ,
  li a[href^="https://www.adultdvdtalk.com/"]:not(.modelLink) ,
  li a[href^="https://commons.wikimedia.org/"]:not(.modelLink) ,
  li a[href^="https://avn.com/"]:not(.modelLink) ,
  li a[href^="https://alsangels.com/"]:not(.modelLink) ,
  li a[href^="https://www.privatecastings.com/"]:not(.modelLink) ,
  li a[href^="https://www.pornbox.com/"]:not(.modelLink) ,
  li a[href^="https://pornbox.com"]:not(.modelLink) ,
  li a[href^="http://pornbox.com/"]:not(.modelLink) ,
  li a[href^="https://www.thumbnailseries.com/"]:not(.modelLink) ,
  li a[href^="http://thumbnailseries.com/"]:not(.modelLink) ,
  li a[href^="http://www.thumbnailseries.com/"]:not(.modelLink) ,
  li a[href^="http://models.ferronetwork.com/"]:not(.modelLink) ,
  li a[href^="https://www.woodmanforum.com/"]:not(.modelLink) ,
  li a[href^="https://en.pornopedia.com/"]:not(.modelLink) ,
  li a[href^="https://uk.wikipedia.org/"]:not(.modelLink) ,

  /* BEST -  AQUA */

  li a[href^="https://www.salierixxx.com"]:not(.modelLink) ,
  li a[href^="http://www.analvids.com"]:not(.modelLink) ,
  li a[href^="https://www.analvids.com"]:not(.modelLink) ,
  li a[href^="https://www.pornteengirl.com"]:not(.modelLink) ,
  li a[href^="http://www.europornstar.com/"]:not(.modelLink) ,
  li a[href^="https://www.woodmancastingx.com"]:not(.modelLink) ,
  li a[href^="http://www.woodmancastingx.com/"]:not(.modelLink) ,
  li a[href^="http://www.woodmanforum.com/"]:not(.modelLink) ,
  li a[href^="http://www.woodmancastingx.com/girl/"]:not(.modelLink) ,
  li a[href^="http://www.woodmancastingx.com"]:not(.modelLink) ,
  li a[href^="http://enter.woodmancastingx.com/"]:not(.modelLink) ,
  li a[href^="https://www.bgafd.co.uk"]:not(.modelLink) ,
  li a[href^="https://www.europornstar.com"]:not(.modelLink) ,
  li a[href^="http://freeones"]:not(.modelLink) ,
  li a[href^="https://mujeres.fandom.com"]:not(.modelLink) ,
  li a[href^="https://www.iafd.com"]:not(.modelLink) ,
  li a[href^="https://everipedia.org"]:not(.modelLink) ,
  li a[href^="http://www.whichpornstar.co.uk"]:not(.modelLink) ,
  li a[href^="https://namethatpornstar.com/search/"]:not(.modelLink) ,
  li a[href^="https://www.thenude.com/"]:not(.modelLink) ,
  li a[href^="http://www.canadianstarsnude.com/"]:not(.modelLink) ,
  li a[href^="http://www.indexxx.com"]:not(.modelLink) ,
  li a[href^="https://www.indexxx.com"]:not(.modelLink) ,
  li a[href^="http://www.woodmanfilms.com/pornstar/"]:not(.modelLink) ,
  li a[href^="https://theclassicporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.kellyfind.com/"]:not(.modelLink) ,
  li a[href^="http://forum.digicreationsxxx.com/index.php?threads/"]:not(.modelLink) ,
  li a[href^="http://www.data18.com/"]:not(.modelLink) ,
  li a[href^="https://boobpedia.com"]:not(.modelLink) ,
  li a[href^="https://www.boobpedia.com"]:not(.modelLink) ,
  li a[href^="http://boobpedia.com/"]:not(.modelLink) ,
  li a[href^="http://www.boobpedia.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultfilmdatabase.com/"]:not(.modelLink) ,
  li a[href^="https://fapality.com/pornstars/"]:not(.modelLink) ,
  li a[href^="https://www.lavoixdux.com/"]:not(.modelLink) ,
  li a[href^="https://www.letagparfait.com/"]:not(.modelLink) ,
  li a[href^="https://gifsauce.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="http://www.actrices-x.com/"]:not(.modelLink) ,
  li a[href^="http://wikipornstars.org/"]:not(.modelLink) ,
  li a[href^="https://everipedia.org/"]:not(.modelLink) ,
  li a[href^="http://warashi-asian-pornstars"]:not(.modelLink) ,
  li a[href^="https://pornovore.fr/"]:not(.modelLink) ,
  li a[href^="https://rexxx.com/"]:not(.modelLink) ,
  li a[href^="https://www.bing.com/"]:not(.modelLink) ,

  /* BEST -  AQUA */
  li a[href^="https://linktr.ee"]:not(.modelLink) ,
  li a[href^="https://www.freeones."]:not(.modelLink) ,
  li a[href^="http://www.freeones."]:not(.modelLink) ,
  li a[href^="https://www.freeones.com/"]:not(.modelLink) ,
  li a[href^="http://www.freeones.com/"]:not(.modelLink) ,
  li a[href^="https://board.freeones.com/"]:not(.modelLink) ,
  li a[href^="http://board.freeones.com/"]:not(.modelLink) ,
  li a[href^="http://www.freeones.com/html/m_links/"]:not(.modelLink) ,
  li a[href^="http://www.freeones.ru/"]:not(.modelLink) ,
  li a[href^="https://www.freeones.it/"]:not(.modelLink) ,
  li a[href^="http://www.freeones.at/"]:not(.modelLink) ,
  li a[href^="https://eurobabeindex.com"]:not(.modelLink) ,
  li a[href^="http://www.eurobabeindex.com/"]:not(.modelLink) ,
  li a[href^="https://www.eurobabeindex.com"]:not(.modelLink) ,
  li a[href^="https://www.eurobabeforum.com/"]:not(.modelLink) ,
  li a[href^="http://eurobabeindex.com/"]:not(.modelLink) ,
  li a[href^="https://xhamster.com/"]:not(.modelLink) ,
  li a[href^="http://xhamster.com/movies/"]:not(.modelLink) ,
  li a[href^="http://www.pornteengirl.com/model/"]:not(.modelLink) ,
  li a[href^="http://pornteengirl.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornteengirl.com/"]:not(.modelLink) ,
  li a[href^="http://thenude.eu/"]:not(.modelLink) ,
  li a[href^="http://www.thenude.eu/"]:not(.modelLink) ,
  li a[href^="https://www.thenude.eu/"]:not(.modelLink) ,
  li a[href^="https://www.egafd.com"]:not(.modelLink) ,
  li a[href^="http://www.egafd.com/"]:not(.modelLink) ,
  li a[href^="http://egafd.com/actresses/"]:not(.modelLink) ,
  li a[href^="http://www.bgafd.co.uk/"]:not(.modelLink) ,
  li a[href^="http://bgafd.co.uk/"]:not(.modelLink) ,
  li a[href^="http://en.wikipedia.org/"]:not(.modelLink) ,
  li a[href^="https://www.wikiporno.org/"]:not(.modelLink) ,
  li a[href^="http://www.wikiporno.org/wiki/"]:not(.modelLink) ,
  li a[href^="http://www.imdb.com/"]:not(.modelLink) ,
  li a[href^="https://www.imdb.com/"]:not(.modelLink) ,
  li a[href^="http://iafd.com/"]:not(.modelLink) ,
  li a[href^="http://www.iafd.com/"]:not(.modelLink){
  background: rgba(0, 255, 251, 0.5)  !important;
  /*     background: rgba(255, 211, 0, 0.33) !important; */
  /*     display: flex !important;
      order: 1 !important; */
  }


  /* TO CHANGE */
  /* li a[href^="http://namethatpornstar.com/"]:not(.modelLink) ,*/
  li a[href^="http://namethatpornstar.com/mobile/search/"]:not(.modelLink){
  background: rgba(255, 0, 0, 0.61)  !important;
  /*     background: rgba(255, 211, 0, 0.33) !important; */
  /*     display: flex !important;
      order: 1 !important; */
  }









  /* END === RELATED LINKS - FILTER and HIGHLIGHTING ==== */
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* NORMAL - TAN  === */

  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="https://erozio.dk"]:not(.modelLink) ,
  li a[href^="http://www.lanasbigboobs.com"]:not(.modelLink) ,
  li a[href^="https://www.transangels.com"]:not(.modelLink) ,
  li a[href^="https://www.sg-video.com"]:not(.modelLink) ,
  li a[href^="https://vrlatina.com/pornstars/cindy-luna-121.html"]:not(.modelLink) ,
  li a[href^="https://faphouse.com"]:not(.modelLink) ,
  li a[href^="https://cannonprod.com"]:not(.modelLink) ,
  li a[href^="https://www.cam4.fr"]:not(.modelLink) ,
  li a[href^="http://www.allover30.net"]:not(.modelLink) ,
  li a[href^="http://nudevista.pornstarnetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.euronudes1.com"]:not(.modelLink) ,
  li a[href^="https://purpleport.com"]:not(.modelLink) ,
  li a[href^="https://www.nextdoortease.com"]:not(.modelLink) ,
  li a[href^="http://www.myspace.com"]:not(.modelLink) ,
  li a[href^="https://www.alsscan.com"]:not(.modelLink) ,
  li a[href^="https://www.teenfrombohemia.com"]:not(.modelLink) ,
  li a[href^="https://www.nigged.com"]:not(.modelLink) ,
  li a[href^="http://vrpornjack.com"]:not(.modelLink) ,
  li a[href^="https://atkfan.com"]:not(.modelLink) ,
  li a[href^="https://www.teengirls.com"]:not(.modelLink) ,
  li a[href^="http://www.only-sex-movies.com"]:not(.modelLink) ,
  li a[href^="http://www.wetandpuffy.com"]:not(.modelLink) ,
  li a[href^="https://www.ddf-models.com"]:not(.modelLink) ,
  li a[href^="http://www.atkmodels.com"]:not(.modelLink) ,
  li a[href^="https://www.101modeling.com"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="NORMAL GOOD - TAN "]:not(.modelLink) ,
  li a[href^="https://thepornagency.com"]:not(.modelLink) ,
  li a[href^="https://www.realityjunkies.com"]:not(.modelLink) ,
  li a[href^="https://justpicsplease.com"]:not(.modelLink) ,
  li a[href^="https://onlyfans.com"]:not(.modelLink) ,
  li a[href^="https://www.bestfans.com"]:not(.modelLink) ,
  li a[href^="https://stripchat.com"]:not(.modelLink) ,
  li a[href^="https://fr.stripchat.com"]:not(.modelLink) ,
  li a[href^="https://bongacams.com"]:not(.modelLink) ,
  li a[href^="https://www.hometownnudes.com"]:not(.modelLink) ,
  li a[href^="https://faketaxi1.com"]:not(.modelLink) ,
  li a[href^="https://fundorado.com"]:not(.modelLink) ,
  li a[href^="http://vfacademy.com"]:not(.modelLink) ,
  li a[href^="https://xconfessions.com"]:not(.modelLink) ,
  li a[href^="https://lustcinema.com"]:not(.modelLink) ,
  li a[href^="http://www.1passforallsites.com"]:not(.modelLink) ,
  li a[href^="http://www.creampieebony.com"]:not(.modelLink) ,
  li a[href^="https://angelogodshackxxx.com"]:not(.modelLink) ,
  li a[href^="http://www.nsfwgirls.com"]:not(.modelLink) ,
  li a[href^="http://www.bellababyxxx.com"]:not(.modelLink) ,
  li a[href^="https://alsscan.com"]:not(.modelLink) ,
  li a[href^="https://amazingcontent.com"]:not(.modelLink) ,
  li a[href^="https://www.jeedoo.com"]:not(.modelLink) ,
  li a[href^="https://m.homepornbay.com"]:not(.modelLink) ,
  li a[href^="https://homepornbay.com"]:not(.modelLink) ,
  li a[href^="http://zoomgirls.net"]:not(.modelLink) ,
  li a[href^="https://www.xbiz.com"]:not(.modelLink) ,
  li a[href^="https://www.spankmonster.com"]:not(.modelLink) ,
  li a[href^="https://puremature.com"]:not(.modelLink) ,
  li a[href^="http://www.lupe-fuentes.com"]:not(.modelLink) ,
  li a[href^="https://www.porngals4.com"]:not(.modelLink) ,
  li a[href^="https://privatesextapes.com"]:not(.modelLink) ,
  li a[href^="http://www.handdomination.com"]:not(.modelLink) ,
  li a[href^="https://www.candygirlvideo.com"]:not(.modelLink) ,
  li a[href^="https://bratperversions.com"]:not(.modelLink) ,
  li a[href^="https://www.justcutegirls.com"]:not(.modelLink) ,
  li a[href^="https://www.analpornvideos.xxx"]:not(.modelLink) ,
  li a[href^="https://www.puzzyfun.com"]:not(.modelLink) ,
  li a[href^="https://p-p-p.tv"]:not(.modelLink) ,
  li a[href^="https://www.kaufmich.com"]:not(.modelLink) ,
  li a[href^="https://fakings.com"]:not(.modelLink) ,
  li a[href^="https://www.pictoa.com"]:not(.modelLink) ,
  li a[href^="https://fuxxx.com"]:not(.modelLink) ,
  li a[href^="https://hotmovs.tube"]:not(.modelLink) ,
  li a[href^="http://www.nextdooramateur.com/"]:not(.modelLink) ,
  li a[href^="http://www.babesandstars.com/"]:not(.modelLink) ,
  li a[href^="http://www.babemaze.com"]:not(.modelLink) ,
  li a[href^="http://www.babesandstars.com/c/catalina/"]:not(.modelLink) ,
  li a[href^="https://www.babesandstars.com/"]:not(.modelLink) ,
  li a[href^="http://teencoreclub.com/"]:not(.modelLink) ,
  li a[href^="https://www.czechar.com/"]:not(.modelLink) ,
  li a[href^="https://www.shutterstock.com/"]:not(.modelLink) ,
  li a[href^="https://hentaied.com/"]:not(.modelLink) ,
  li a[href^="https://www.czechsexcasting.com/"]:not(.modelLink) ,
  li a[href^="https://www.photodromm.com"]:not(.modelLink) ,
  li a[href^="https://kavyar.com"]:not(.modelLink) ,
  li a[href^="https://metart.com"]:not(.modelLink) ,
  li a[href^="https://www.metart.com"]:not(.modelLink) ,
  li a[href^="https://www.stasyq.com"]:not(.modelLink) ,
  li a[href^="https://superbe.com/"]:not(.modelLink) ,
  li a[href^="https://allmylinks.com"]:not(.modelLink) ,
  li a[href^="http://www.whichpornstar.com"]:not(.modelLink) ,
  li a[href^="https://www.eternaldesire.com"]:not(.modelLink) ,
  li a[href^="https://eromd.ru"]:not(.modelLink) ,
  li a[href^="http://www.pornstars-revue.com"]:not(.modelLink) ,
  li a[href^="http://www.hegre.com"]:not(.modelLink) ,
  li a[href^="https://babe-hd.com"]:not(.modelLink) ,
  li a[href^="http://xofeed.com"]:not(.modelLink) ,
  li a[href^="https://www.hegre.com"]:not(.modelLink) ,
  li a[href^="http://nudegirlsalert.com"]:not(.modelLink) ,
  li a[href^="https://500px.com"]:not(.modelLink) ,
  li a[href^="https://maria-rya.tumblr.com"]:not(.modelLink) ,
  li a[href^="http://www.pornoxo.com"]:not(.modelLink) ,
  li a[href^="http://facebook.com"]:not(.modelLink) ,
  li a[href^="https://www.virtualrealitychannel.com/"]:not(.modelLink) ,
  li a[href^="http://studentsexparties.com/"]:not(.modelLink) ,
  li a[href^="https://www.rylskyart.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://nudesportvideos.com/"]:not(.modelLink) ,
  li a[href^="http://www.ebalka.one/"]:not(.modelLink) ,
  li a[href^="http://www.nudesportvideos.com/"]:not(.modelLink) ,
  li a[href^="http://elitebabes.com/"]:not(.modelLink) ,
  li a[href^="https://www.elitebabes.com/"]:not(.modelLink) ,
  li a[href^="https://www.babegator.com/"]:not(.modelLink) ,
  li a[href^="http://auraporn.com/"]:not(.modelLink) ,
  li a[href^="https://www.elitebabes.com/"]:not(.modelLink) ,
  li a[href^="https://czechcasting.com/"]:not(.modelLink) ,
  li a[href^="http://czechcasting.com/"]:not(.modelLink) ,
  li a[href^="http://czechcasting.com/promo/preview/"]:not(.modelLink) ,
  li a[href^="https://czechcasting.com/promo/preview/"]:not(.modelLink) ,
  li a[href^="http://pornzog.com/"]:not(.modelLink) ,
  li a[href^="https://hclips.com/"]:not(.modelLink) ,
  li a[href^="https://www.mydirtyhobby.to/"]:not(.modelLink) ,
  li a[href^="https://www.brillbabes.com/"]:not(.modelLink) ,
  li a[href^="https://free.premiumbukkake.com"]:not(.modelLink) ,
  li a[href^="https://nfbusty.com/"]:not(.modelLink) ,
  li a[href^="http://chaturbate.com/"]:not(.modelLink) ,
  li a[href^="http://101modeling.com/"]:not(.modelLink) ,
  li a[href^="http://exclusivemilf.com/"]:not(.modelLink) ,
  li a[href^="https://www.hegreartnudes.com/"]:not(.modelLink) ,
  li a[href^="http://www.youporn.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="https://pornstarsandadultmodelsoftheworld.blogspot.com/"]:not(.modelLink) ,
  li a[href^="http://europornstar.com/"]:not(.modelLink) ,

  li a[href^="https://www.erosberry.com/"]:not(.modelLink) ,
  li a[href^="https://irenerouse.com/"]:not(.modelLink) ,
  li a[href^="https://www.reddit.com/"]:not(.modelLink) ,
  li a[href^="https://gfycat.com/"]:not(.modelLink) ,
  li a[href^="https://straight.fleshbot.com/"]:not(.modelLink) ,
  li a[href^="https://www.mousouzoku-av.com/"]:not(.modelLink) ,
  li a[href^="https://socialmediapornstars.com/"]:not(.modelLink) ,
  li a[href^="http://www.cumlouder.com/"]:not(.modelLink) ,

  li a[href^="http://gals.teenswantblack.com/"]:not(.modelLink) ,
  li a[href^="http://www5.kinghost.com"]:not(.modelLink) ,
  li a[href^="https://xxxbios.com/"]:not(.modelLink) ,
  li a[href^="http://teenpornportal.com/"]:not(.modelLink) ,
  li a[href^="http://worldmodeling.com/"]:not(.modelLink) ,
  li a[href^="https://digitalvideovision.net/"]:not(.modelLink) ,
  li a[href^="http://alsangels.com/profiles/"]:not(.modelLink) ,
  li a[href^="https://ddfnetwork.com/"]:not(.modelLink) ,
  li a[href^="https://bestfreshtrends.com/"]:not(.modelLink) ,
  a[href*=".imagevenue.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://www.pornstarsspain.com/"]:not(.modelLink) ,
  li a[href^="https://forum.adultdvdtalk.com/"]:not(.modelLink) ,
  li a[href^="https://www.fdb.cz/"]:not(.modelLink) ,
  li a[href^="http://sm.bentbox.co/"]:not(.modelLink) ,
  li a[href^="https://www.lecigareapapa.com/"]:not(.modelLink) ,
  li a[href^="https://www.zazelparadise.com"]:not(.modelLink) ,
  li a[href^="https://www.cumlouder.com/"]:not(.modelLink) ,
  li a[href^="http://www.allfinegirls.net/"]:not(.modelLink) ,
  li a[href^="http://www.pjgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.danidanielsblog.com"]:not(.modelLink) ,
  li a[href^="https://missdanidaniels.tumblr.com/"]:not(.modelLink) ,
  li a[href^="https://www.tribute-to.com/"]:not(.modelLink) ,
  li a[href^="http://www.nudevista.tv/?"]:not(.modelLink) ,
  li a[href^="http://jordanpryce.tumblr.com"]:not(.modelLink) ,
  li a[href^="http://jordanpryce.co.uk"]:not(.modelLink) ,
  li a[href^="http://jordan-pryce.com/escort/"]:not(.modelLink) ,
  li a[href^="https://thelordofporn.com/pornstars/"]:not(.modelLink) ,
  li a[href^="http://lilycade.tumblr.com/"]:not(.modelLink) ,
  li a[href^="https://www.mrporngeek.com/"]:not(.modelLink) ,
  li a[href^="http://pornstarnetwork.premiumarchive.com/pornstar/"]:not(.modelLink) ,
  li a[href^="http://78.media.tumblr.com/"]:not(.modelLink) ,
  li a[href^="https://pictures.mrstiff.com/"]:not(.modelLink) ,
  li a[href^="https://www.privateclassics.com/"]:not(.modelLink) ,
  li a[href^="https://fr.tubepornclassic.com/s"]:not(.modelLink) ,
  li a[href^="http://vintage-erotica-forum.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="https://www.thumbzilla.com/"]:not(.modelLink) ,
  li a[href^="http://sexy889.blogspot.com/"]:not(.modelLink) ,
  li a[href^="http://sex18.photos/"]:not(.modelLink) ,
  li a[href^="https://www.simonbolz.com/"]:not(.modelLink) ,
  li a[href^="http://badfolder.com/"]:not(.modelLink) ,
  li a[href^="http://mosgorduma.org/"]:not(.modelLink) ,
  li a[href^="https://www.digitalminds-photography.com/"]:not(.modelLink) ,
  li a[href^="http://www.barelist.com/"]:not(.modelLink) ,
  li a[href^="http://www.barelist.com/models/"]:not(.modelLink) ,
  li a[href^="http://twitter.com/"]:not(.modelLink) ,
  li a[href^="http://www.twitter.com/"]:not(.modelLink) ,
  li a[href^="http://www.nubilefilms.com/"]:not(.modelLink) ,
  li a[href^="http://www.nubiles.net/"]:not(.modelLink) ,
  li a[href^="http://nubiles.net/"]:not(.modelLink) ,
  li a[href^="http://nubiles.net/model/profile/"]:not(.modelLink) ,
  li a[href^="http://nubilefilms.com/model/profile/"]:not(.modelLink) ,
  li a[href^="http://legalporno.com/"]:not(.modelLink) ,
  li a[href^="http://legalporno.com/model/"]:not(.modelLink) ,
  li a[href^="http://the-analist.info/"]:not(.modelLink) , 

  li a[href^="http://www.perfectgonzo.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://www.galleryserver.org/galleries/"]:not(.modelLink) ,
  li a[href^="http://www.pornstarnetwork.com/pornstar/"]:not(.modelLink) ,
  li a[href^="http://www.candypleasure.com/pornstar/"]:not(.modelLink) ,
  li a[href^="http://www.firstanalquest.com/model/"]:not(.modelLink) ,
  li a[href^="https://avn.com/porn-stars/"]:not(.modelLink) ,
  li a[href^="http://www.oldje.com/model/"]:not(.modelLink) ,
  li a[href^="http://www.pimpyporn.com/babes/b/display.php?"]:not(.modelLink) ,
  li a[href^="http://www.followcamgirls.com/models/"]:not(.modelLink) ,
  li a[href^="http://www.everipedia.com/"]:not(.modelLink) ,
  li a[href^="https://www.mycircle.tv/"]:not(.modelLink) ,
  li a[href^="http://leahgotti.mypornstarblogs.com"]:not(.modelLink) ,
  li a[href^="https://www.thelifeerotic.com/"]:not(.modelLink) ,
  li a[href^="http://new.naked.com/"]:not(.modelLink) ,
  li a[href^="http://www.exclusivemilf.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornobeauty.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.stunning18.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://pimpyporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.modellvilag.hu/"]:not(.modelLink) ,
  li a[href^="https://www.barelist.com/"]:not(.modelLink) ,
  li a[href^="http://pavlamodels.com/"]:not(.modelLink) ,
  li a[href^="https://www.themoviedb.org/"]:not(.modelLink) ,
  li a[href^="http://www.hungarianlust.com/"]:not(.modelLink) ,
  li a[href^="http://playboyplus.com/"]:not(.modelLink) ,
  li a[href^="http://www.exclusivemilf.com/"]:not(.modelLink) ,
  li a[href^="http://hersexdebut.com/"]:not(.modelLink) ,
  li a[href^="https://interviews.adultdvdtalk.com/"]:not(.modelLink) ,
  li a[href^="http://www.massagesexfan.com/"]:not(.modelLink) ,
  li a[href^="https://www.inquisitr.com/"]:not(.modelLink) ,
  li a[href^="https://www.midilibre.fr/"]:not(.modelLink) ,
  li a[href^="http://www.amaporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.putalocura.com/"]:not(.modelLink) ,
  li a[href^="http://ask.fm/"]:not(.modelLink) ,
  li a[href^="http://www.bellabellz.net/"]:not(.modelLink) ,
  li a[href^="https://es.wikipedia.org/"]:not(.modelLink) ,
  li a[href^="https://www.suicidegirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.women-x.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://www.x-women.fr/"]:not(.modelLink) ,
  li a[href^="http://sweetkacey.com"]:not(.modelLink) ,
  li a[href^="http://www.wowstars.com/pornstar/"]:not(.modelLink) ,
  li a[href^="https://www.modelmayhem.com/"]:not(.modelLink) ,
  li a[href^="https://www.tumblr.com/search/"]:not(.modelLink) ,
  li a[href^="http://www.brdteengal.com/"]:not(.modelLink) ,
  li a[href^="https://www.4tube.com/"]:not(.modelLink) ,
  li a[href^="https://www.nekosai.com/"]:not(.modelLink) ,
  li a[href^="https://new.naked.com/"]:not(.modelLink) ,
  li a[href^="http://angelik-duval.tumblr.com/"]:not(.modelLink) ,
  li a[href^="http://www.xstarsnews.com/"]:not(.modelLink) ,
  li a[href^="http://www.babepedia.com/"]:not(.modelLink) ,
  li a[href^="https://kendralibrarygirl.blogspot.com"]:not(.modelLink) ,
  li a[href^="http://fuckmegoldie.tumblr.com/"]:not(.modelLink) ,
  li a[href^="http://sinnsage.cammodels.com"]:not(.modelLink) ,
  li a[href^="https://sinnsage.cammodels.com"]:not(.modelLink) ,
  li a[href^="http://www.anilos.com/"]:not(.modelLink) ,
  li a[href^="http://www.eporner.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.sexart.com/"]:not(.modelLink) ,
  li a[href^="http://secretofpleasure.com/"]:not(.modelLink) ,
  li a[href^="https://sweet-pornstars.com/"]:not(.modelLink) ,
  li a[href^="http://pickupfuck.com/"]:not(.modelLink) ,
  li a[href^="http://giahill.erolog.org"]:not(.modelLink) ,
  li a[href^="http://pmagazine.co/"]:not(.modelLink) ,
  li a[href^="https://www.mpmanagement.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://jaydencole.nudemodelportal.com"]:not(.modelLink) ,
  li a[href^="https://fr.chaturbate.com/"]:not(.modelLink) ,
  li a[href^="https://vk.com/"]:not(.modelLink) ,
  li a[href^="https://www.filmer.cz/"]:not(.modelLink) ,
  li a[href^="https://bestlistofporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.blesk.cz/"]:not(.modelLink) ,
  li a[href^="http://www.nudereviews.com/"]:not(.modelLink) ,
  li a[href^="https://instagram.com/"]:not(.modelLink) ,
  li a[href^="http://www.model-archive.com/"]:not(.modelLink) ,
  li a[href^="https://thehshq.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornhugo.com/"]:not(.modelLink) ,
  li a[href^="http://www.erosberry.com/"]:not(.modelLink) ,
  li a[href^="https://nude-gals.com/"]:not(.modelLink) ,
  li a[href^="https://profiles.myfreecams.com/"]:not(.modelLink) ,
  li a[href^="https://share.myfreecams.com/"]:not(.modelLink) ,
  li a[href^="https://pornstarsandadultmodelsoftheworld.blogspot.co.uk/"]:not(.modelLink) ,
  li a[href^="https://sexyfuzzy.com/"]:not(.modelLink) ,
  li a[href^="https://www.kindgirls.com/"]:not(.modelLink) ,
  li a[href^="https://mobile.twitter.com/"]:not(.modelLink) ,
  li a[href^="http://eromd.ru/"]:not(.modelLink) ,
  li a[href^="http://www.tumbex.com/"]:not(.modelLink) ,
  li a[href^="http://avn.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */


  li a[href^="http://www.big-tits-paradise.com/"]:not(.modelLink) ,
  li a[href^="https://modeldb.net/"]:not(.modelLink) ,

  li a[href^="http://www.sweetsinner.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultdvdtalk.com/"]:not(.modelLink) ,
  li a[href^="http://www.kindgirls.com/"]:not(.modelLink) ,
  li a[href^="http://fapality.com/"]:not(.modelLink) ,
  li a[href^="http://www.sextvx.com/"]:not(.modelLink) ,
  li a[href^="http://wtfpass.com/models/"]:not(.modelLink) ,
  li a[href^="http://fayerunaway.blogspot.com"]:not(.modelLink) ,
  li a[href^="http://www.tbhostedgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://karapricexxx.tumblr.com/"]:not(.modelLink) ,
  li a[href^="http://tiny4k.com/"]:not(.modelLink) ,
  li a[href^="http://vk.com/"]:not(.modelLink) ,
  li a[href^="http://www.eurobabeforum.com/"]:not(.modelLink) ,
  li a[href^="https://www.ultrafilms.xxx/"]:not(.modelLink) ,
  li a[href^="https://www.domai.com/"]:not(.modelLink) ,
  li a[href^="http://profiles.myfreecams.com/"]:not(.modelLink) ,
  li a[href^="http://www.amourangels.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenpornstorage.com/"]:not(.modelLink) ,
  li a[href^="https://www.mrporn.com/"]:not(.modelLink) ,
  li a[href^="http://movies.18onlygirls.com/"]:not(.modelLink) ,
  li a[href^="http://nekoporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.youngpussycats.com/"]:not(.modelLink) ,
  li a[href^="http://www.videosz.com/"]:not(.modelLink) ,
  li a[href^="http://www.sapphicerotica.com/"]:not(.modelLink) ,
  li a[href^="http://picsgall5.teensexfusion.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.fuckstudies.com/"]:not(.modelLink) ,
  li a[href^="https://www.pornpics.com/"]:not(.modelLink) ,
  li a[href^="https://jasmin.com/"]:not(.modelLink) ,
  li a[href^="https://cams.com/"]:not(.modelLink) ,

  /* NORMAL GOOD - TAN */

  li a[href^="http://www.evilangel.com/"]:not(.modelLink) ,
  li a[href^="https://en.wikipedia.org/"]:not(.modelLink) ,
  li a[href^="http://www.private-hardcore.com"]:not(.modelLink) ,
  li a[href^="http://www.pornstarsgirlsex.com/"]:not(.modelLink) ,
  li a[href^="https://www.blacked.com/"]:not(.modelLink) ,
  li a[href^="http://www.classmodels.com/"]:not(.modelLink) ,
  li a[href^="https://www.definefetish.com/"]:not(.modelLink) ,
  li a[href^="http://www.definefetish.com/"]:not(.modelLink) ,

  li a[href^="http://www.pimpyporn.com/"]:not(.modelLink) ,
  li a[href^="https://www.myfreecams.com/"]:not(.modelLink) ,
  li a[href^="https://www.instagram.com/"]:not(.modelLink) ,
  li a[href^="https://twitter.com/"]:not(.modelLink) ,
  li a[href^="https://chaturbate.com/"]:not(.modelLink) ,
  li a[href^="http://www.gyrls.com/"]:not(.modelLink) ,
  li a[href^="http://matrixmodels.com/"]:not(.modelLink) {
  background: rgba(255, 211, 0, 0.23) !important;
  /* background: rgba(0, 255, 251, 0.5)  !important; */
  }
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* SUPP - BOF - AGE VERIFICATION */


  /* SUPP - BOF - AGE VERIF */
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,

  /* BOF - AGE VERIF */
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="BAD-VERIF"]:not(.modelLink) ,
  li a[href^="https://www.pornstarstroker.com"]:not(.modelLink) ,
  li a[href^="http://onlinegfs.com"]:not(.modelLink) ,
  li a[href^="https://www.manyvids.com/"]:not(.modelLink) ,
  li a[href*="manyvids.com"]:not(.modelLink) ,
  li a[href^="http://www.manyvids.com/"]:not(.modelLink) ,
  li a[href^="http://www.manyvids.com/Profile/"]:not(.modelLink) ,
  li a[href^="https://www.adultfilmcentral.com/"]:not(.modelLink) ,
  li a[href^="https://www.bang.com/"]:not(.modelLink) {
      opacity: 0.3 !important;
      display: none !important;
      visibility: hidden !important;
      font-size: 0 !important;
  }
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* SUPP - BOF - NEED LOGIN ETC */


  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN ETC"]:not(.modelLink) ,



  /* BOF - NOT REGION */
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,
  li a[href^="BOF - NOT REGION"]:not(.modelLink) ,

  li a[href^="https://alua.com/"]:not(.modelLink) ,




  /* SUPP - BOF - NOT WANT TO OPEN CHROME */
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,
  li a[href^="BOF - NOT WANT TO OPEN CHROME"]:not(.modelLink) ,

  li a[href^="http://www.actrice-sexe.com/"]:not(.modelLink) ,




  /* SUPP - BOF - NEED LOGIN */

  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,
  li a[href^="BOF - NEED LOGIN"]:not(.modelLink) ,


  /* BOF - NEED LOGIN */
  li a[href^="http://www.sexart.com"]:not(.modelLink) ,
  li a[href^="https://errotica-archives.com"]:not(.modelLink) ,
  li a[href^="https://www.elegantangel.com/"]:not(.modelLink) ,
  li a[href^="https://playboyplus.spizoo.com"]:not(.modelLink) ,
  li a[href^="https://playboyplus.com/"]:not(.modelLink) ,
  li a[href^="https://blackbullchallenge.com/"]:not(.modelLink) ,
  li a[href^="https://www.bang.com/"]:not(.modelLink) ,
  li a[href^="https://www.hotmovies.com/"]:not(.modelLink) ,
  li a[href^="https://www.adultdvdempire.com/"]:not(.modelLink) ,
  li a[href^="https://www.adultempire.com"]:not(.modelLink) ,
  li a[href^="https://www.pornstarempire.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornstarempire.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultempire"]:not(.modelLink) {
      opacity: 0.3 !important;
      display: none !important;
      visibility: hidden !important;
      font-size: 0 !important;
  }
  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* SUPP - BOF 1 */


  /* AAA - BOF BOF */
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="BOF BOF"]:not(.modelLink) ,
  li a[href^="http://www.hotgirls4all.com"]:not(.modelLink) ,
  li a[href^="http://www.on-veut-du-cul.com"]:not(.modelLink) ,
  li a[href^="https://newmfx.com"]:not(.modelLink) ,
  li a[href^="https://www.brasileirinhas.com.br"]:not(.modelLink) ,
  li a[href^="http://theleenetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.clubseventeen.com"]:not(.modelLink) ,
  li a[href^="https://www.familystrokes.com"]:not(.modelLink) ,
  li a[href^="https://www.genderxfilms.com/"]:not(.modelLink) ,
  li a[href^="https://free.fuckingglasses.com"]:not(.modelLink) ,
  li a[href^="https://www.sherisranch.com"]:not(.modelLink) ,
  li a[href^="https://exotic4k.com"]:not(.modelLink) ,
  li a[href^="http://www.erotictonaughty.com"]:not(.modelLink) ,
  li a[href^="http://www.sexyporngals.com"]:not(.modelLink) ,
  li a[href^="https://x-angels.com"]:not(.modelLink) ,
  li a[href^="https://www.1passforallsites.com"]:not(.modelLink) ,
  li a[href^="http://Firstanaldate.com"]:not(.modelLink) ,
  li a[href^="http://modelodette.tumblr.com/"]:not(.modelLink) ,
  li a[href^="https://swallowingangels.com"]:not(.modelLink) ,
  li a[href^="https://www.trueamateurs.com"]:not(.modelLink) ,
  li a[href^="http://www.dpamateurs.com"]:not(.modelLink) ,
  li a[href^="https://adultfilmstarcontent.com"]:not(.modelLink) ,
  li a[href^="https://www.modelmediaus.com"]:not(.modelLink) ,
  li a[href^="https://mobileintermixedsluts"]:not(.modelLink) ,
  li a[href^="https://www.burningangel.com"]:not(.modelLink) ,
  li a[href^="http://www.hairycurves.com"]:not(.modelLink) ,
  li a[href^="http://www.wearehairy.com"]:not(.modelLink) ,
  li a[href^="http://web.archive.org"]:not(.modelLink) ,
  li a[href^="https://www.ihuntmycunt.com"]:not(.modelLink) ,
  li a[href^="http://xxxpicsarchive.com"]:not(.modelLink) ,
  li a[href^="http://hairypussy.itslive.com"]:not(.modelLink) ,
  li a[href^="https://www.southern-charms.com"]:not(.modelLink) ,
  li a[href^="https://www.joannajet.com"]:not(.modelLink) ,
  li a[href^="http://nicenudegirls.org"]:not(.modelLink) ,
  li a[href^="https://sandraromaintube.com"]:not(.modelLink) ,
  li a[href^="http://jaelynfox.net"]:not(.modelLink) ,
  li a[href^="http://www.prettybabes4u.com"]:not(.modelLink) ,
  li a[href^="http://x-milflessons.bangbros1.com"]:not(.modelLink) ,
  li a[href^="https://creamher.com"]:not(.modelLink) ,
  li a[href^="http://penthouse-pets.net"]:not(.modelLink) ,
  li a[href^="http://www.ronharris.com"]:not(.modelLink) ,
  li a[href^="https://pissvids.com"]:not(.modelLink) ,
  li a[href^="https://strippoker.app"]:not(.modelLink) ,
  li a[href^="https://soldierhugecock.com"]:not(.modelLink) ,
  li a[href^="https://mmm100.com"]:not(.modelLink) ,
  li a[href^="http://www.droolingfemme.com"]:not(.modelLink) ,
  li a[href^="https://www.analoverdose.com"]:not(.modelLink) ,
  li a[href^="https://fhg.purebj.com"]:not(.modelLink) ,
  li a[href^="https://shop.princessnikkicruel.com"]:not(.modelLink) ,
  li a[href^="https://shop.kinkysexbox.com"]:not(.modelLink) ,
  li a[href^="https://niksindian.com"]:not(.modelLink) ,
  li a[href^="https://pornstreamlive.com"]:not(.modelLink) ,
  li a[href^="https://www.eurobabefacials.com"]:not(.modelLink) ,
  li a[href^="http://guests.met-art.com"]:not(.modelLink) ,
  li a[href^="https://katzpaw.tumblr.com"]:not(.modelLink) ,
  li a[href^="http://domingoview.com"]:not(.modelLink) ,
  li a[href^="https://datingsitespot.com"]:not(.modelLink) ,
  li a[href^="http://www.hegre-art.com"]:not(.modelLink) ,
  li a[href^="http://www.teendreams.com"]:not(.modelLink) ,
  li a[href^="https://www.heal-fit.com"]:not(.modelLink) ,
  li a[href^="https://peterskingdom.com"]:not(.modelLink) ,
  li a[href^="https://povmasters.com"]:not(.modelLink) ,
  li a[href^="https://teenytaboo.com"]:not(.modelLink) ,
  li a[href^="https://www.sisswap.com"]:not(.modelLink) ,
  li a[href^="https://www.pervnana.com"]:not(.modelLink) ,
  li a[href^="https://mylifeinmiami.com"]:not(.modelLink) ,
  li a[href^="https://backroomcastingcouch.com"]:not(.modelLink) ,
  li a[href^="https://blackambush.com"]:not(.modelLink) ,
  li a[href^="https://cuckhunter.com"]:not(.modelLink) ,
  li a[href^="https://joibabes.com"]:not(.modelLink) ,
  li a[href^="https://intimaly.com"]:not(.modelLink) ,
  li a[href^="https://digitalvideovision.com"]:not(.modelLink) ,
  li a[href*="adultempire"]:not(.modelLink) ,
  li a[href^="https://fansyme.com"]:not(.modelLink) ,
  li a[href^="https://clynks.me"]:not(.modelLink) ,
  li a[href^="https://www.camsoda.com"]:not(.modelLink) ,
  li a[href^="http://www.younglegalpornblog.com"]:not(.modelLink) ,
  li a[href^="http://gallery2.onlyteenblowjobs.com"]:not(.modelLink) ,
  li a[href^="http://www.girlsclimaxing.com"]:not(.modelLink) ,
  li a[href^="http://www.wolrdteenparadise.com"]:not(.modelLink) ,
  li a[href^="http://www.yoporn"]:not(.modelLink) ,
  li a[href^="http://www.awmdb.com"]:not(.modelLink) ,
  li a[href^="https://www.thedailybeast.com"]:not(.modelLink) ,
  li a[href^="http://www.letagparfait.com"]:not(.modelLink) ,
  li a[href^="http://www.pornparodies.com"]:not(.modelLink) ,
  li a[href^="http://tgp.palazzo-del-sesso.com"]:not(.modelLink) ,
  li a[href^="http://www.russian-babes.net"]:not(.modelLink) ,
  li a[href^="https://www.dorcelvision.com"]:not(.modelLink) ,
  li a[href^="https://www.freeones.com/forums/"]:not(.modelLink) ,
  li a[href^="https://www.german-scout.com"]:not(.modelLink) ,
  li a[href^="https://darkshade.com"]:not(.modelLink) ,
  li a[href^="https://www.oldje.com"]:not(.modelLink) ,
  li a[href^="https://femdom-austria.com"]:not(.modelLink) ,
  li a[href^="https://www.skirtsupgirls.com"]:not(.modelLink) ,
  li a[href^="https://www.pascalssubsluts.com"]:not(.modelLink) ,
  li a[href^="http://pantyflashgirls.com"]:not(.modelLink) ,
  li a[href^="https://jimmydrawsvr.com"]:not(.modelLink) ,
  li a[href^="https://www.cumperfection.com"]:not(.modelLink) ,
  li a[href^="https://www.houseofyre.com"]:not(.modelLink) ,
  li a[href^="https://www.throated.com"]:not(.modelLink) ,
  li a[href^="https://www.joymii.com"]:not(.modelLink) ,
  li a[href^="https://www.moreystudio.com"]:not(.modelLink) ,
  li a[href^="https://www.familylust.com"]:not(.modelLink) ,
  li a[href^="http://isammierhodes.com"]:not(.modelLink) ,
  li a[href*="ftv-girls."]:not(.modelLink) ,
  li a[href^="https://dvvstore.com"]:not(.modelLink) ,
  li a[href^="https://members.ftvgirls.com"]:not(.modelLink) ,
  li a[href^="https://www.thenewgirlspooping.com"]:not(.modelLink) ,
  li a[href^="http://www.russianteenass.com"]:not(.modelLink) ,
  li a[href^="http://www.vipissy.com"]:not(.modelLink) ,
  li a[href^="https://trickyoldteacher.com"]:not(.modelLink) ,
  li a[href^="https://screwmetoo.com"]:not(.modelLink) ,
  li a[href^="http://www.oldje.com"]:not(.modelLink) ,
  li a[href^="https://sexchat24.com"]:not(.modelLink) ,
  li a[href^="https://www.livechat.cz"]:not(.modelLink) ,
  li a[href^="https://www.eroticnet.cz"]:not(.modelLink) ,
  li a[href^="https://www.allthosegirls.com"]:not(.modelLink) ,
  li a[href^="http://caprice.cuteteenlist.com"]:not(.modelLink) ,
  li a[href^="https://www.dfbnetwork.com"]:not(.modelLink) ,
  li a[href^="http://www.clubrikkisix.com"]:not(.modelLink) ,
  li a[href^="http://www.evilondemand.com"]:not(.modelLink) ,
  li a[href^="http://fansofporn.com"]:not(.modelLink) ,
  li a[href^="http://younggirls.inventforum.com"]:not(.modelLink) ,
  li a[href^="http://www.glamedge.com"]:not(.modelLink) ,
  li a[href^="http://ikagneylinnarter.com"]:not(.modelLink) ,
  li a[href^="http://ladirectmodels.com"]:not(.modelLink) ,
  li a[href^="http://www.kagneylinnkarter.com"]:not(.modelLink) ,
  li a[href^="http://www.kagneylinnkarter.net"]:not(.modelLink) ,
  li a[href^="http://www.kagneylinnkarter.org"]:not(.modelLink) ,
  li a[href^="http://www.pornstarlove.com"]:not(.modelLink) ,
  li a[href^="https://www.tugpass.com"]:not(.modelLink) ,
  li a[href^="https://www.edpowers.com"]:not(.modelLink) ,
  li a[href^="https://coxxxmodels.com"]:not(.modelLink) ,
  li a[href^="https://www.evilangel.com"]:not(.modelLink) ,
  li a[href^="http://hostg.teenrotica.com"]:not(.modelLink) ,
  li a[href^="http://www.gonzoplus.com"]:not(.modelLink) ,
  li a[href^="https://www.private.com"]:not(.modelLink) ,
  li a[href^="http://www.teamskeet.com"]:not(.modelLink) ,
  li a[href^="https://www.backsidebonanza.com"]:not(.modelLink) ,
  li a[href^="https://www.sexwithmuslims.com"]:not(.modelLink) ,
  li a[href^="https://www.hunterpov.com"]:not(.modelLink) ,
  li a[href^="https://www.prexious.com"]:not(.modelLink) ,
  li a[href^="https://nip-activity.com"]:not(.modelLink) ,
  li a[href^="https://erotik.com"]:not(.modelLink) ,
  li a[href^="http://www.babesreal.com"]:not(.modelLink) ,
  li a[href^="https://www.teenytaboo.com"]:not(.modelLink) ,
  li a[href^="https://smokinghawt.com"]:not(.modelLink) ,
  li a[href^="https://cuckoldwish.com"]:not(.modelLink) ,
  li a[href^="http://galleries.x-angels.com"]:not(.modelLink) ,
  li a[href^="http://www.nuerotica.com"]:not(.modelLink) ,
  li a[href^="https://join.heavyonhotties.com"]:not(.modelLink) ,
  li a[href^="http://www.blondepornjpg.com"]:not(.modelLink) ,
  li a[href^="https://members.clubseventeen.com"]:not(.modelLink) ,
  li a[href^="https://galleries-pornstar.com"]:not(.modelLink) ,
  li a[href^="http://xxxonxxx.com/legalporno"]:not(.modelLink) ,
  li a[href^="http://www.virginz.net"]:not(.modelLink) ,
  li a[href^="https://members.adulttime.com"]:not(.modelLink) ,
  li a[href^="http://www.stooorage.com"]:not(.modelLink) ,
  li a[href^="http://www.russianpornindex.com"]:not(.modelLink) ,
  li a[href^="http://www.bushyorhairy.com"]:not(.modelLink) ,
  li a[href^="https://www.yanks.com"]:not(.modelLink) ,
  li a[href^="https://www.wettingherpanties.com"]:not(.modelLink) ,
  li a[href^="http://www.wettingherpanties.com"]:not(.modelLink) ,
  li a[href^="https://www.purecfnm.com"]:not(.modelLink) ,
  li a[href^="http://babesreal.com"]:not(.modelLink) ,
  li a[href^="https://www.laceystarr.com"]:not(.modelLink) ,
  li a[href^="http://www.theinvisibleham.com"]:not(.modelLink) ,
  li a[href^="https://www.beltbound.com"]:not(.modelLink) ,
  li a[href^="https://www.joybear.com"]:not(.modelLink) ,
  li a[href^="https://www.ladyvoyeurs.com"]:not(.modelLink) ,
  li a[href^="https://fetisheyes.com"]:not(.modelLink) ,
  li a[href^="https://www.cuffedteens.com"]:not(.modelLink) ,
  li a[href^="https://www.cuffedinuniform.com"]:not(.modelLink) ,
  li a[href^="https://www.aplvideos.com"]:not(.modelLink) ,
  li a[href^="https://www.whiteghetto.com"]:not(.modelLink) ,


  /* AAA - BOF BOF */

  li a[href^="http://www.asian-man.com"]:not(.modelLink) ,
  li a[href^="http://nextdooramateur.com"]:not(.modelLink) ,
  li a[href^="http://www.dirtydirector.com"]:not(.modelLink) ,
  li a[href^="https://www.blowbanggirls.com"]:not(.modelLink) ,
  li a[href^="https://www.bathroomcreepers.com"]:not(.modelLink) ,
  li a[href^="https://www.czechsoles.com"]:not(.modelLink) ,
  li a[href^="https://www.60plusmilfs.com"]:not(.modelLink) ,
  li a[href^="https://gallys.naughtymag.com"]:not(.modelLink) ,
  li a[href^="https://nextdoortease.com"]:not(.modelLink) ,
  li a[href^="https://www.yourdirtymind.com"]:not(.modelLink) ,
  li a[href^="http://yourdailygirls.com"]:not(.modelLink) ,
  li a[href^="http://galleries6.ptclassic.com"]:not(.modelLink) ,
  li a[href^="https://www.latexgirlies.com"]:not(.modelLink) ,
  li a[href^="https://www.rektmag.net"]:not(.modelLink) ,
  li a[href^="http://teenscoreclub.com"]:not(.modelLink) ,
  li a[href^="http://www.hqsluts.com"]:not(.modelLink) ,
  li a[href^="https://ton.place/"]:not(.modelLink) ,
  li a[href^="https://shorts.sex.com"]:not(.modelLink) ,
  li a[href^="https://www.sex.com"]:not(.modelLink) ,
  li a[href^="https://lnk.bio/"]:not(.modelLink) ,
  li a[href^="https://members.21members.com"]:not(.modelLink) ,
  li a[href^="https://ersties.com"]:not(.modelLink) ,
  li a[href^="https://enjoyx.com"]:not(.modelLink) ,
  li a[href^="https://taplink.cc"]:not(.modelLink) ,


  /* AAA - BOF BOF */

  li a[href^="https://rawerotic.com"]:not(.modelLink) ,
  li a[href^="https://skokoff.com"]:not(.modelLink) ,
  li a[href^="https://www.dirtyauditions.com"]:not(.modelLink) ,
  li a[href^="https://www.mypervyfamily.com"]:not(.modelLink) ,
  li a[href^="https://www.hardx.com"]:not(.modelLink) ,
  li a[href^="https://bbcsurprise.com"]:not(.modelLink) ,
  li a[href^="https://teendreams.com"]:not(.modelLink) ,
  li a[href^="https://app.nymf.com"]:not(.modelLink) ,
  li a[href^="https://erotichna.com"]:not(.modelLink) ,
  li a[href^="https://music.apple.com"]:not(.modelLink) ,
  li a[href^="https://emilybloom.com"]:not(.modelLink) ,
  li a[href^="https://benefitmonkey.com"]:not(.modelLink) ,
  li a[href^="https://en.kin8tengoku.com"]:not(.modelLink) ,
  li a[href^="http://www.stasyq.com"]:not(.modelLink) ,
  li a[href^="http://playboyrussia.com"]:not(.modelLink) ,
  li a[href^="https://www.willtilexxx.com"]:not(.modelLink) ,
  li a[href^="https://porncompanions.com"]:not(.modelLink) ,
  li a[href^="https://gotfilled.com"]:not(.modelLink) ,
  li a[href^="https://www.gangbangcreampie.com"]:not(.modelLink) ,
  li a[href^="https://www.bjraw.com"]:not(.modelLink) ,
  li a[href^="https://wetvr.com"]:not(.modelLink) ,
  li a[href^="https://www.lethalhardcorevr.com"]:not(.modelLink) ,
  li a[href^="https://nudeyogaporn.com"]:not(.modelLink) ,
  li a[href^="https://www.freeusefantasy.com"]:not(.modelLink) ,


  /* AAA - BOF BOF */

  li a[href^="https://www.lanewgirl.com"]:not(.modelLink) ,
  li a[href^="https://girlcum.com"]:not(.modelLink) ,
  li a[href^="https://www.foxxxmodeling.com"]:not(.modelLink) ,
  li a[href^="https://facials4k.com"]:not(.modelLink) ,
  li a[href^="https://anal4k.com"]:not(.modelLink) ,
  li a[href^="https://excogigirls.com"]:not(.modelLink) ,
  li a[href^="https://bananafever.com"]:not(.modelLink) ,
  li a[href^="https://bbcpie.com"]:not(.modelLink) ,
  li a[href^="https://www.dadcrush.com"]:not(.modelLink) ,
  li a[href^="https://www.blacked.com"]:not(.modelLink) ,
  li a[href^="https://www.wankz.com"]:not(.modelLink) ,
  li a[href^="https://wildoncam.com"]:not(.modelLink) ,
  li a[href^="https://www.primalfetishnetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.pantyjobs.com"]:not(.modelLink) ,
  li a[href^="https://www.interracialpass.com"]:not(.modelLink) ,
  li a[href^="https://www.lethalpass.com"]:not(.modelLink) ,
  li a[href^="https://lesworship.com"]:not(.modelLink) ,
  li a[href^="https://www.lethalhardcore.com"]:not(.modelLink) ,
  li a[href^="https://www.cumeatingcuckolds.com"]:not(.modelLink) ,
  li a[href^="https://www.jerktomyfeet.com"]:not(.modelLink) ,
  li a[href^="https://www.goddessfootworship.com"]:not(.modelLink) ,
  li a[href^="http://laxmodels.com"]:not(.modelLink) ,
  li a[href^="https://hustlerunlimited.com"]:not(.modelLink) ,
  li a[href^="https://www.dfxtra.com"]:not(.modelLink) ,
  li a[href^="https://www.famedigital.com"]:not(.modelLink) ,
  li a[href^="https://www.filthflix.com"]:not(.modelLink) ,
  li a[href^="https://www.goddessfootjobs.com"]:not(.modelLink) ,
  li a[href^="https://www.givemeteens.com"]:not(.modelLink) ,
  li a[href^="https://www.peternorth.com"]:not(.modelLink) ,
  li a[href^="https://smutmerchants.com"]:not(.modelLink) ,
  li a[href^="http://www.stocking-milfs.com"]:not(.modelLink) ,
  li a[href^="http://pure-femjoy.com"]:not(.modelLink) ,
  li a[href^="http://lily-c-met-art.bravoerotica.com"]:not(.modelLink) ,
  li a[href^="http://2clovers.com"]:not(.modelLink) ,
  li a[href^="http://porn-pastor.com"]:not(.modelLink) ,
  li a[href^="https://photodromm.com"]:not(.modelLink) ,
  li a[href^="http://katya-clover.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://www.katya-clover.com"]:not(.modelLink) ,
  li a[href^="https://katya-clover.com"]:not(.modelLink) ,
  li a[href^="https://www.bikinifanatics.com"]:not(.modelLink) ,
  li a[href^="http://beauty-teens.net"]:not(.modelLink) ,
  li a[href^="https://www.wikifeetx.com"]:not(.modelLink) ,
  li a[href^="https://stasyq"]:not(.modelLink) ,
  li a[href^="https://adultcontentxxx.com"]:not(.modelLink) ,
  li a[href^="http://redbust.com"]:not(.modelLink) ,
  li a[href^="http://www.nuart.tv"]:not(.modelLink) ,
  li a[href^="http://fotokto.ru"]:not(.modelLink) ,
  li a[href^="https://clubsweethearts.com"]:not(.modelLink) ,
  li a[href^="https://pixhost.to"]:not(.modelLink) ,
  li a[href^="https://adultprime.com"]:not(.modelLink) ,
  li a[href^="https://anal-beauty.com"]:not(.modelLink) ,
  li a[href^="https://www.perfectnaked.com"]:not(.modelLink) ,
  li a[href^="https://throne.com"]:not(.modelLink) ,
  li a[href^="https://linkr.bio"]:not(.modelLink) ,
  li a[href^="http://alex-lynn.com"]:not(.modelLink) ,
  li a[href^="https://teencoreclub.com"]:not(.modelLink) ,
  li a[href^="https://www.r18.com"]:not(.modelLink) ,
  li a[href^="http://noboring.com"]:not(.modelLink) ,
  li a[href^="http://behairy.com"]:not(.modelLink) ,
  li a[href^="http://domsites.net"]:not(.modelLink) ,
  li a[href^="https://anal-angels.com"]:not(.modelLink) ,
  li a[href^="https://creampie-angels.com"]:not(.modelLink) ,
  li a[href^="https://dollsporn.com"]:not(.modelLink) ,
  li a[href^="https://theartporn.com"]:not(.modelLink) ,
  li a[href^="https://teensexmovs.co/"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://teensexmania.com"]:not(.modelLink) ,
  li a[href^="https://noboring.com"]:not(.modelLink) ,
  li a[href^="https://hersexdebut.com"]:not(.modelLink) ,
  li a[href^="https://hdmassageporn.com"]:not(.modelLink) ,
  li a[href^="https://collegefuckparties.com"]:not(.modelLink) ,
  li a[href^="https://www.colette.com"]:not(.modelLink) ,
  li a[href^="https://cashforsextape.com"]:not(.modelLink) ,
  li a[href^="https://www.autographworld.com"]:not(.modelLink) ,
  li a[href^="https://www.thisyearsmodel.com"]:not(.modelLink) ,
  li a[href^="https://www.tushyraw.com"]:not(.modelLink) ,
  li a[href^="https://www.darkroomvr.com"]:not(.modelLink) ,
  li a[href^="https://www.playboy.com"]:not(.modelLink) ,
  li a[href^="https://www.teenpornstorage.com"]:not(.modelLink) ,
  li a[href^="https://feelmevr.com"]:not(.modelLink) ,
  li a[href^="https://test-shoots.com"]:not(.modelLink) ,
  li a[href^="https://charmmodels.net"]:not(.modelLink) ,
  li a[href^="https://www.amourangels.com"]:not(.modelLink) ,
  li a[href^="https://www.femjoyhunter.com"]:not(.modelLink) ,
  li a[href^="https://www.showybeauty.com"]:not(.modelLink) ,
  li a[href^="https://www.xxxporn.pics"]:not(.modelLink) ,
  li a[href^="https://showybeauty.com"]:not(.modelLink) ,
  li a[href^="https://nebraskacoeds.com"]:not(.modelLink) ,
  li a[href^="https://amourangels.com"]:not(.modelLink) ,
  li a[href^="https://teenpornstorage.com"]:not(.modelLink) ,
  li a[href^="ttps://www.showybeauty.com"]:not(.modelLink) ,
  li a[href^="https://superbemodels.com"]:not(.modelLink) ,
  li a[href^="https://www.mixedx.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://www.art-nudes.com"]:not(.modelLink) ,
  li a[href^="https://www.czechvrnetwork.com"]:not(.modelLink) ,
  li a[href^="https://vrplove.com"]:not(.modelLink) ,
  li a[href^="https://sexlikereal.com"]:not(.modelLink) ,

  li a[href^="http://showybeauty.com"]:not(.modelLink) ,
  li a[href^="https://nudegirlsalert.com"]:not(.modelLink) ,
  li a[href^="https://vrconk.com"]:not(.modelLink) ,
  li a[href^="https://www.tinysis.com"]:not(.modelLink) ,
  li a[href^="https://virtualporn.com"]:not(.modelLink) ,
  li a[href^="https://www.apovstory.com"]:not(.modelLink) ,
  li a[href^="https://www.bffs.com"]:not(.modelLink) ,
  li a[href^="https://bjraw.com"]:not(.modelLink) ,
  li a[href^="https://www.daughterswap.com"]:not(.modelLink) ,
  li a[href^="https://www.familysinners.com"]:not(.modelLink) ,
  li a[href^="https://exclusivemilf.com"]:not(.modelLink) ,
  li a[href^="https://www.thedicksuckers.com"]:not(.modelLink) ,
  li a[href^="https://www.filthykings.com"]:not(.modelLink) ,
  li a[href^="https://www.teentugs.com"]:not(.modelLink) ,
  li a[href^="https://www.teenslovehugecocks.com"]:not(.modelLink) ,
  li a[href^="https://www.stepsiblings.com"]:not(.modelLink) ,
  li a[href^="https://www.shoplyfter.com"]:not(.modelLink) ,
  li a[href^="https://www.shewillcheat.com"]:not(.modelLink) ,
  li a[href^="https://www.sheseducedme.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://snipfeed.co"]:not(.modelLink) ,
  li a[href^="https://www.propertysex.com"]:not(.modelLink) ,
  li a[href^="https://www.mylked.com"]:not(.modelLink) ,
  li a[href^="https://www.girlstryanal.com"]:not(.modelLink) ,
  li a[href^="https://www.hustler.com"]:not(.modelLink) ,
  li a[href^="https://www.mybabysittersclub.com"]:not(.modelLink) ,
  li a[href^="https://www.mommys"]:not(.modelLink) ,
  li a[href^="https://www.mommys/"]:not(.modelLink) ,
  li a[href^="https://jayspov.net/"]:not(.modelLink) ,
  li a[href^="https://www.kinkyspa.com/"]:not(.modelLink) ,
  li a[href^="https://members.finishesthejob.com/"]:not(.modelLink) ,
  li a[href^="https://lovehairy.com/"]:not(.modelLink) ,
  li a[href^="https://www.cherrynudes.com/"]:not(.modelLink) ,
  li a[href^="http://oopsmodels.com"]:not(.modelLink) ,
  li a[href^="http://oopsmodels.com/"]:not(.modelLink) ,
  li a[href^="https://sanktor.com/"]:not(.modelLink) ,
  li a[href^="http://www.wearehairyfree.com/"]:not(.modelLink) ,
  li a[href^="http://wearehairy.com/"]:not(.modelLink) ,
  li a[href^="https://fans.ly/"]:not(.modelLink) ,
  li a[href^="https://fuckstudies.com/"]:not(.modelLink) ,
  li a[href^="https://onlytarts.com/"]:not(.modelLink) ,
  li a[href^="https://stunning18.com/"]:not(.modelLink) ,
  li a[href^="https://www.slim4k.com/"]:not(.modelLink) ,
  li a[href^="https://extrememoviepass.com/"]:not(.modelLink) ,
  li a[href^="https://oopsmodels.com/"]:not(.modelLink) ,
  li a[href^="https://imx.to/"]:not(.modelLink) ,
  li a[href^="https://www.flirt4free.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://daddy4k.com/"]:not(.modelLink) ,
  li a[href^="https://www.clubsweethearts.com/"]:not(.modelLink) ,
  li a[href^="https://www.my18teens.com/"]:not(.modelLink) ,
  li a[href^="https://i004.imx.to/"]:not(.modelLink) ,
  li a[href^="https://i003.imx.to/"]:not(.modelLink) ,
  li a[href^="https://i.imx.to/"]:not(.modelLink) ,
  li a[href^="https://trickymasseur.com/"]:not(.modelLink) ,
  li a[href^="https://www.xfree.com/"]:not(.modelLink) ,
  li a[href^="https://mcpmodels.wordpress.com/"]:not(.modelLink) ,
  li a[href^="http://www.eroticbeauty.com/"]:not(.modelLink) ,
  li a[href^="http://istri.it/"]:not(.modelLink) ,
  li a[href^="https://uplust.com/"]:not(.modelLink) ,
  li a[href^="https://www.oldje-3some.com/"]:not(.modelLink) ,
  li a[href^="https://sapphicerotica.com/"]:not(.modelLink) ,
  li a[href^="https://www.mrbigfatdick.com/"]:not(.modelLink) ,
  li a[href^="https://www.givemepink.com/"]:not(.modelLink) ,
  li a[href^="https://galleries.fuckstudies.com/"]:not(.modelLink) ,
  li a[href^="https://babevr.com/"]:not(.modelLink) ,
  li a[href^="http://www.artcore-cellar.com/"]:not(.modelLink) ,
  li a[href^="https://analized.com/"]:not(.modelLink) ,
  li a[href^="https://pornforce.com/"]:not(.modelLink) ,
  li a[href^="https://itspov.com/"]:not(.modelLink) ,
  li a[href^="https://www.mysexmobile.com/"]:not(.modelLink) ,
  li a[href^="https://hotbabes4k.com/"]:not(.modelLink) ,
  li a[href^="https://handsonhardcore.com/"]:not(.modelLink) ,
  li a[href^="https://cumswappingsis.com/"]:not(.modelLink) ,
  li a[href^="https://www.college-uniform.com/"]:not(.modelLink) ,
  li a[href^="https://stars.avn.com/"]:not(.modelLink) ,
  li a[href^="http://www.eternaldesire.com/"]:not(.modelLink) ,
  li a[href^="https://dreamstash.com/"]:not(.modelLink) ,
  li a[href^="https://thelifeerotic.com/"]:not(.modelLink) ,
  li a[href^="https://defeated.xxx/"]:not(.modelLink) ,
  li a[href^="http://www.artofgloss.net/"]:not(.modelLink) ,
  li a[href^="https://goddessnudes.com/"]:not(.modelLink) ,
  li a[href^="https://www.fakehostel.com/"]:not(.modelLink) ,
  li a[href^="http://g.bnrslks.com/"]:not(.modelLink) ,
  li a[href^="https://oldgoesyoung.com/"]:not(.modelLink) ,
  li a[href^="http://www.paulmarkhamcash.com/"]:not(.modelLink) ,
  li a[href^="http://rychlyprachy.cz/"]:not(.modelLink) ,
  li a[href^="http://www.sybian1.com/"]:not(.modelLink) ,
  li a[href^="http://www.weliketosuck.com/"]:not(.modelLink) ,
  li a[href^="http://pinkyjune.cuteteenlist.com/"]:not(.modelLink) ,
  li a[href^="https://www.strictlyglamour.com/"]:not(.modelLink) ,
  li a[href^="http://missonline.cz/"]:not(.modelLink) ,
  li a[href^="http://www.4tube.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.purebj.com//"]:not(.modelLink) ,
  li a[href^="http://www.lovewetting.com/"]:not(.modelLink) ,
  li a[href^="https://vrcosplayx.com/"]:not(.modelLink) ,
  li a[href^="https://mydeepdarksecret.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://sinematica.com/"]:not(.modelLink) ,
  li a[href^="https://www.interactive-pov.com/"]:not(.modelLink) ,
  li a[href^="https://secure.photorama.nl/"]:not(.modelLink) ,
  li a[href^="https://facialcasting.com/"]:not(.modelLink) ,
  li a[href^="https://yespornpics.com/"]:not(.modelLink) ,
  li a[href^="https://new.allover30.com/"]:not(.modelLink) ,
  li a[href^="https://asiansexdiary.com/"]:not(.modelLink) ,
  li a[href^="https://www.creamher.com/"]:not(.modelLink) ,
  li a[href^="http://www.racypix.com/"]:not(.modelLink) ,
  li a[href^="https://sessiongirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.onlinestars.net/pornstars/"]:not(.modelLink) ,
  li a[href^="http://www.clubredlight.com/"]:not(.modelLink) ,
  li a[href^="http://www.100bucksbabes.com/"]:not(.modelLink) ,
  li a[href^="http://www.sexylegsfeet.com/"]:not(.modelLink) ,
  li a[href^="https://www.heavyonhotties.com/"]:not(.modelLink) ,
  li a[href^="http://xxx-interracial-tgp.com/"]:not(.modelLink) ,
  li a[href^="http://www.her-feet.com/"]:not(.modelLink) ,
  li a[href^="http://www.closepics.com/"]:not(.modelLink) ,
  li a[href^="http://www.brokecollegegirls.com/"]:not(.modelLink) ,
  li a[href^="http://amourbabes.com/"]:not(.modelLink) ,
  li a[href^="http://www.tinyass.com/"]:not(.modelLink) ,
  li a[href^="https://boosty.to/"]:not(.modelLink) ,
  li a[href^="http://www.lettherebeporn.com/"]:not(.modelLink) ,
  li a[href^="http://phun-web2.isprime.com/"]:not(.modelLink) ,
  li a[href^="http://68.169.98.139/"]:not(.modelLink) ,
  li a[href^="https://tsi.book.fr/"]:not(.modelLink) ,
  li a[href^="https://www.striptube.net/"]:not(.modelLink) ,
  li a[href^="http://test-shoots.com/"]:not(.modelLink) ,
  li a[href^="http://sexart.top/"]:not(.modelLink) ,
  li a[href^="https://www.hotbabes4k.com/"]:not(.modelLink) ,
  li a[href^="https://latanopros.book.fr"]:not(.modelLink) ,
  li a[href^="https://www.goodiesmagazine.com/"]:not(.modelLink) ,
  li a[href^="http://godsartnudes.com/"]:not(.modelLink) ,
  li a[href^="http://g.misslk.com/"]:not(.modelLink) ,
  li a[href^="https://www.enme.life/"]:not(.modelLink) ,
  li a[href^="http://www.domingoview.com"]:not(.modelLink) ,
  li a[href^="http://www.dmm.co.jp/"]:not(.modelLink) ,
  li a[href^="https://bustyporn.com/"]:not(.modelLink) ,
  li a[href^="https://www.wankitnow.com/"]:not(.modelLink) ,
  li a[href^="https://stmackenzies.com/"]:not(.modelLink) ,
  li a[href^="https://www.spinchix.com/"]:not(.modelLink) ,
  li a[href^="https://sneakypee.com/"]:not(.modelLink) ,
  li a[href^="https://www.silksoles.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */

  li a[href^="https://www.satinplay.com/"]:not(.modelLink) ,
  li a[href^="https://www.restrainedelegance.com/"]:not(.modelLink) ,
  li a[href^="http://www.porntb.com/"]:not(.modelLink) ,
  li a[href^="http://www.montyspov.com/"]:not(.modelLink) ,
  li a[href^="https://www.metalbondage.com"]:not(.modelLink) ,
  li a[href^="https://killergram.com/"]:not(.modelLink) ,
  li a[href^="https://harmonyfilms.co/"]:not(.modelLink) ,
  li a[href^="http://c.actiondesk.com/"]:not(.modelLink) ,
  li a[href^="https://www.boppingbabes.com/"]:not(.modelLink) ,
  li a[href^="https://www.artcore-cafe.com/"]:not(.modelLink) ,
  li a[href^="https://www.artcore-cellar.com/"]:not(.modelLink) ,
  li a[href^="https://www.portagloryhole.com"]:not(.modelLink) ,
  li a[href^="https://www.glamino.com"]:not(.modelLink) ,
  li a[href^="https://water-and-power.com"]:not(.modelLink) ,
  li a[href^="https://splatbukkake.xxx"]:not(.modelLink) ,
  li a[href^="https://tube.germangoogirls.com"]:not(.modelLink) ,
  li a[href^="https://tsvirtuallovers.com"]:not(.modelLink) ,
  li a[href^="https://www.sexyhub.com"]:not(.modelLink) ,
  li a[href^="http://www.killergram.com"]:not(.modelLink) ,
  li a[href^="https://www.german-pornstar.com"]:not(.modelLink) ,
  li a[href^="https://forbondage.com"]:not(.modelLink) ,
  li a[href^="https://spytug.com"]:not(.modelLink) ,
  li a[href^="https://hobybuchanon.com"]:not(.modelLink) ,
  li a[href^="https://www.gloryholesecrets.com"]:not(.modelLink) ,
  li a[href^="https://maxfelicitasvideo.com"]:not(.modelLink) ,
  li a[href^="https://www.publicagent.com"]:not(.modelLink) ,
  li a[href^="https://realitylovers.com"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="https://www.forgivemefather.com"]:not(.modelLink) ,
  li a[href^="https://dothewife.com"]:not(.modelLink) ,
  li a[href^="https://ocmodeling.com"]:not(.modelLink) ,
  li a[href^="https://richardmannsworld.com"]:not(.modelLink) ,
  li a[href^="https://www.mrluckypov.com"]:not(.modelLink) ,
  li a[href^="https://jonathanjordanxxx.com"]:not(.modelLink) ,
  li a[href^="https://www.faketaxi.com"]:not(.modelLink) ,
  li a[href^="https://deeplush.com"]:not(.modelLink) ,
  li a[href^="https://www.freakmobmedia.com"]:not(.modelLink) ,
  li a[href^="https://www.bootysource.com"]:not(.modelLink) ,
  li a[href^="https://www.secretfriends.com"]:not(.modelLink) ,
  li a[href^="https://theanalsource.com"]:not(.modelLink) ,
  li a[href^="https://www.mattsmodels.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://databasei.babesandpornstars.com"]:not(.modelLink) ,
  li a[href^="http://uniquebondage.com"]:not(.modelLink) ,
  li a[href^="https://www.leche69.com"]:not(.modelLink) ,
  li a[href^="https://www.vivid.com"]:not(.modelLink) ,
  li a[href^="https://crashpadseries.com"]:not(.modelLink) ,
  li a[href^="https://www.immorallive.com"]:not(.modelLink) ,
  li a[href^="https://18vr.com"]:not(.modelLink) ,
  li a[href^="https://www.fitting-room.com/"]:not(.modelLink) ,
  li a[href^="https://1passforallsites.com"]:not(.modelLink) ,
  li a[href^="https://www.callingfans.com"]:not(.modelLink) ,
  li a[href^="https://bentbox.co/"]:not(.modelLink) ,
  li a[href^="https://helster-film.com"]:not(.modelLink) ,
  li a[href^="https://www.slayed.com"]:not(.modelLink) ,
  li a[href^="http://sexbabesvr.com"]:not(.modelLink) ,
  li a[href^="https://www.majak2.com"]:not(.modelLink) ,
  li a[href^="http://members.mynakeddolls.com"]:not(.modelLink) ,
  li a[href^="http://www.westcoastgangbangs.com"]:not(.modelLink) ,
  li a[href^="https://momsboytoy.com"]:not(.modelLink) ,
  li a[href^="https://momswapped.com"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.darkpanthera.com"]:not(.modelLink) ,
  li a[href^="https://www.wetandpissy.com"]:not(.modelLink) ,
  li a[href^="https://www.vipissy.com"]:not(.modelLink) ,
  li a[href^="https://www.superbemodels.com"]:not(.modelLink) ,
  li a[href^="https://sexbabesvr.com"]:not(.modelLink) ,
  li a[href^="https://www.girlznation.com"]:not(.modelLink) ,
  li a[href^="https://discordapp.com"]:not(.modelLink) ,
  li a[href^="http://over40housewives.com"]:not(.modelLink) ,
  li a[href^="http://www.milfservice.com"]:not(.modelLink) ,
  li a[href^="http://www.hotwivesandgirlfriends.com"]:not(.modelLink) ,
  li a[href^="http://channel69cash.com/"]:not(.modelLink) ,
  li a[href^="http://www.hairy-beauty.com"]:not(.modelLink) ,
  li a[href^="https://www.40somethingmag.com"]:not(.modelLink) ,
  li a[href^="https://www.fakings.com"]:not(.modelLink) ,
  li a[href^="https://ballbustinfootlovin.fetlovin.com"]:not(.modelLink) ,
  li a[href^="https://hotmilfsfuck.com"]:not(.modelLink) ,
  li a[href^="https://www.backroomcastingcouch.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://vip4k.com"]:not(.modelLink) ,
  li a[href^="https://vrpornjack.com/"]:not(.modelLink) ,
  li a[href^="https://stockingvideos.com"]:not(.modelLink) ,
  li a[href^="https://stockingsvr.com"]:not(.modelLink) ,
  li a[href^="https://www.younganaltryouts.com"]:not(.modelLink) ,
  li a[href^="https://venus.ultrafilms.com"]:not(.modelLink) ,
  li a[href^="http://trickyoldteacher.com"]:not(.modelLink) ,
  li a[href^="https://euronudes1.com"]:not(.modelLink) ,
  li a[href^="https://beauty-angels.com"]:not(.modelLink) ,
  li a[href^="https://apclips.com"]:not(.modelLink) ,
  li a[href^="http://www.pinkvisualpass.com"]:not(.modelLink) ,
  li a[href^="https://www.fuckpassvr.com"]:not(.modelLink) ,
  li a[href^="https://www.teenmegaworld.net"]:not(.modelLink) ,
  li a[href^="https://free.sellyourgf.com"]:not(.modelLink) ,
  li a[href^="https://free.dirtyflix.com"]:not(.modelLink) ,
  li a[href^="https://free.18videoz.com"]:not(.modelLink) ,
  li a[href^="https://www.mrpov.com"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="https://socprofile.com"]:not(.modelLink) ,
  li a[href^="https://www.wakeupnfuck.com"]:not(.modelLink) ,
  li a[href^="https://virtualtaboo.com"]:not(.modelLink) ,
  li a[href^="https://fit18.com"]:not(.modelLink) ,
  li a[href^="https://darkroomvr.com"]:not(.modelLink) ,
  li a[href^="https://vivthomas.com"]:not(.modelLink) ,
  li a[href^="https://t.me"]:not(.modelLink) ,
  li a[href^="https://sexart.com"]:not(.modelLink) ,
  li a[href^="https://metartx.com"]:not(.modelLink) ,
  li a[href^="https://metartnetwork.com"]:not(.modelLink) ,
  li a[href^="https://heyhoneyclub.com"]:not(.modelLink) ,
  li a[href^="https://www.erotichna.com"]:not(.modelLink) ,
  li a[href^="https://eternaldesire.com"]:not(.modelLink) ,
  li a[href^="http://simplemetart.com"]:not(.modelLink) ,
  li a[href^="https://www.nudexxx.pics"]:not(.modelLink) ,
  li a[href^="https://www.123rf.com"]:not(.modelLink) ,
  li a[href^="https://www.nextdooramateur.com"]:not(.modelLink) ,
  li a[href^="https://momwantstobreed.com"]:not(.modelLink) ,
  li a[href^="https://momstight.com"]:not(.modelLink) ,
  li a[href^="https://www.iwantmature.com"]:not(.modelLink) ,
  li a[href^="https://familyswap.xxx"]:not(.modelLink) ,
  li a[href^="https://www.amateurcreampies.com"]:not(.modelLink) ,
  li a[href^="https://brattymilf.com"]:not(.modelLink) ,
  li a[href^="https://www.asian-man.com"]:not(.modelLink) ,
  li a[href^="https://backsidebonanza.com"]:not(.modelLink) ,
  li a[href^="http://axtadult.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://www.sexselector.com"]:not(.modelLink) ,
  li a[href^="https://www.iseekgirls.com"]:not(.modelLink) ,
  li a[href^="http://www.finepornstars"]:not(.modelLink) ,
  li a[href^="http://www.zurnal24.si"]:not(.modelLink) ,
  li a[href^="http://www.pornstarslounge"]:not(.modelLink) ,
  li a[href^="http://petiteballerinasfucked.com"]:not(.modelLink) ,
  li a[href^="https://www.mydrunkenstar.com"]:not(.modelLink) ,
  li a[href^="https://czechav.com"]:not(.modelLink) ,
  li a[href^="https://www.czechvr.com"]:not(.modelLink) ,
  li a[href^="http://anilos.com"]:not(.modelLink) ,
  li a[href^="http://1publicagent.com"]:not(.modelLink) ,
  li a[href^="http://www.sexy-models.net"]:not(.modelLink) ,
  li a[href^="http://reviewtwistys.com"]:not(.modelLink) ,
  li a[href^="http://www.lesbianbabelog.com"]:not(.modelLink) ,
  li a[href^="http://www.glamcorebabes.com"]:not(.modelLink) ,
  li a[href^="http://www.girlsnaked.net"]:not(.modelLink) ,
  li a[href^="http://www.littlethumbs.com"]:not(.modelLink) ,
  li a[href^="http://beauty-teens.net"]:not(.modelLink) ,
  li a[href^="http://www.teenpornthumbs.com"]:not(.modelLink) ,
  li a[href^="http://www.adultstarmakers.com"]:not(.modelLink) ,
  li a[href^="https://www.pornmania.net"]:not(.modelLink) ,
  li a[href^="https://www.erocurves.com"]:not(.modelLink) ,
  li a[href^="https://www.101porno.com"]:not(.modelLink) ,
  li a[href^="http://www.allsologirls.com"]:not(.modelLink) ,
  li a[href^="http://teacherfucksteens.com"]:not(.modelLink) ,
  li a[href^="http://petitehdporn.com"]:not(.modelLink) ,
  li a[href^="http://albagals.com"]:not(.modelLink) ,
  li a[href^="http://allsologirls.com"]:not(.modelLink) ,
  li a[href^="http://babesource.com"]:not(.modelLink) ,
  li a[href^="https://venus.wowgirls.com"]:not(.modelLink) ,
  li a[href^="http://www.suze.net"]:not(.modelLink) ,
  li a[href^="https://pornworld.com"]:not(.modelLink) ,
  li a[href^="https://myspace.com"]:not(.modelLink) ,
  li a[href^="http://www.picsmaster.net"]:not(.modelLink) ,
  li a[href^="https://www.lemmecheck.com"]:not(.modelLink) ,
  li a[href^="http://vintageflash.com"]:not(.modelLink) ,
  li a[href^="https://www.sexysatinsilkfun.com"]:not(.modelLink) ,
  li a[href^="https://www.upskirtjerk.com"]:not(.modelLink) ,
  li a[href^="https://www.pantymaniacs.com"]:not(.modelLink) ,
  li a[href^="https://nhlpcentral.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://strictlyglamour.com"]:not(.modelLink) ,
  li a[href^="https://www.suburbanamateurs.com"]:not(.modelLink) ,
  li a[href^="https://www.hotpantyfun.com"]:not(.modelLink) ,
  li a[href^="https://www.mature.nl"]:not(.modelLink) ,
  li a[href^="https://www.art-lingerie.com"]:not(.modelLink) ,
  li a[href^="https://www.garrysgirls.com"]:not(.modelLink) ,
  li a[href^="https://www.onlysilkandsatin.com"]:not(.modelLink) ,
  li a[href^="https://www.only-sportswear.com"]:not(.modelLink) ,
  li a[href^="https://www.downblousejerk.com/"]:not(.modelLink) ,
  li a[href^="https://stockingaces.com"]:not(.modelLink) ,
  li a[href^="https://www.only-opaques.com"]:not(.modelLink) ,
  li a[href^="https://www.only-costumes.com"]:not(.modelLink) ,
  li a[href^="https://www.only-secretaries.com"]:not(.modelLink) ,
  li a[href^="http://pantyhosed4u.com"]:not(.modelLink) ,
  li a[href^="http://www.artcore-kitchen.com/"]:not(.modelLink) ,
  li a[href^="https://www.modelhub.com"]:not(.modelLink) ,
  li a[href^="https://clubseventeen.com"]:not(.modelLink) ,
  li a[href^="http://www.allover30free.com"]:not(.modelLink) ,
  li a[href^="https://galleries.mrluckypov.com"]:not(.modelLink) ,
  li a[href^="https://www.stripzvr.com"]:not(.modelLink) ,
  li a[href^="https://www.sexlikereal.com"]:not(.modelLink) ,
  li a[href^="https://www.playboyplus.com"]:not(.modelLink) ,
  li a[href^="https://hollyrandall.com"]:not(.modelLink) ,
  li a[href^="https://www.5kporn.com"]:not(.modelLink) ,
  li a[href^="https://teddysgirls.net"]:not(.modelLink) ,
  li a[href^="https://theemilybloom.com"]:not(.modelLink) ,
  li a[href^="https://www.filf.com"]:not(.modelLink) ,
  li a[href^="https://www.allgirlmassage.com"]:not(.modelLink) ,
  li a[href^="https://www.deeper.com"]:not(.modelLink) ,
  li a[href^="https://cosmid.net"]:not(.modelLink) ,
  li a[href^="https://princesscum.com"]:not(.modelLink) ,
  li a[href^="http://lsps2007.cam-content.com/"]:not(.modelLink) ,
  li a[href^="http://atelieretlux.de"]:not(.modelLink) ,
  li a[href^="http://dildoshow-berlin.com"]:not(.modelLink) ,
  li a[href^="http://fakeflightagent.com"]:not(.modelLink) ,
  li a[href^="http://mtlpas01.fundorado.de"]:not(.modelLink) ,
  li a[href^="http://www.beate-uhse.tv"]:not(.modelLink) ,
  li a[href^="https://fakeflightagent.com"]:not(.modelLink) ,
  li a[href^="http://www.twpornstars.com"]:not(.modelLink) ,
  li a[href^="http://www.stylished.de"]:not(.modelLink) ,
  li a[href^="https://www.beate-uhse.tv"]:not(.modelLink) ,
  li a[href^="https://www.babestation24.com"]:not(.modelLink) ,
  li a[href^="https://auraporn.com"]:not(.modelLink) ,
  li a[href^="https://fancentromodels.com"]:not(.modelLink) ,
  li a[href^="https://badteenspunished.com"]:not(.modelLink) ,
  li a[href^="http://foxxxmodeling.com"]:not(.modelLink) ,
  li a[href^="https://calendarauditions.com"]:not(.modelLink) ,
  li a[href^="https://strokies.com"]:not(.modelLink) ,
  li a[href^="https://tiny4k.com"]:not(.modelLink) ,
  li a[href^="https://www.blackedraw.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://www.jayspov.net"]:not(.modelLink) ,
  li a[href^="https://www.busty-legends.com"]:not(.modelLink) ,
  li a[href^="https://www.wankzvr.com"]:not(.modelLink) ,
  li a[href^="https://www.tonightsgirlfriend.com"]:not(.modelLink) ,
  li a[href^="https://www.hotguysfuck.com"]:not(.modelLink) ,
  li a[href^="https://www.biguysfuck.com"]:not(.modelLink) ,
  li a[href^="https://spyfam.com"]:not(.modelLink) ,
  li a[href^="https://povd.com"]:not(.modelLink) ,
  li a[href^="http://www.myasianpornstars.com"]:not(.modelLink) ,
  li a[href^="http://bzn.brazzers.com"]:not(.modelLink) ,
  li a[href^="http://hotasiangirls.kagesdomain.com"]:not(.modelLink) ,
  li a[href^="http://pornstartweet.com"]:not(.modelLink) ,
  li a[href^="http://psp.brazzers.com"]:not(.modelLink) ,
  li a[href^="http://www.fantastube.com"]:not(.modelLink) ,
  li a[href^="https://www.iamxxx.com"]:not(.modelLink) ,
  li a[href^="http://www.clipinspector.com"]:not(.modelLink) ,
  li a[href^="http://www.cumfuclub.com"]:not(.modelLink) ,
  li a[href^="http://tessataylor.org"]:not(.modelLink) ,
  li a[href^="http://www.tugjobs.com"]:not(.modelLink) ,
  li a[href^="http://www.thexroom.com"]:not(.modelLink) ,
  li a[href^="http://www.spankwire.com"]:not(.modelLink) ,
  li a[href^="http://www.softcore-hq.com"]:not(.modelLink) ,
  li a[href^="http://www.asaakirauncut.com"]:not(.modelLink) ,
  li a[href^="http://footfetishdaily.com"]:not(.modelLink) ,
  li a[href^="http://handjobwinner.com"]:not(.modelLink) ,
  li a[href^="http://hdv18.com"]:not(.modelLink) ,
  li a[href^="http://hdv18.comr"]:not(.modelLink) ,
  li a[href^="http://itannermayes.com"]:not(.modelLink) ,
  li a[href^="http://lizztayler.info/"]:not(.modelLink) ,
  li a[href^="http://lusted.com"]:not(.modelLink) ,
  li a[href^="http://mydrfeelgood.com"]:not(.modelLink) ,
  li a[href^="http://mypersonalpanties.com"]:not(.modelLink) ,
  li a[href^="http://mypersonalpanties.com/"]:not(.modelLink) ,
  li a[href^="http://tannermayes.com"]:not(.modelLink) ,
  li a[href^="http://pickinguppussy.com"]:not(.modelLink) ,
  li a[href^="http://onlyteenblowjobs.com"]:not(.modelLink) ,
  li a[href^="http://puresybian.com"]:not(.modelLink) ,
  li a[href^="http://spicyroulette.com"]:not(.modelLink) ,
  li a[href^="http://squirtdisgrace.com"]:not(.modelLink) ,
  li a[href^="http://throatjobs.com"]:not(.modelLink) ,
  li a[href^="http://universitybubblebutts.com"]:not(.modelLink) ,
  li a[href^="http://wp.shamelessamateur.com"]:not(.modelLink) ,
  li a[href^="http://vidsclipsforsale.com"]:not(.modelLink) ,
  li a[href^="http://wildoncam.com"]:not(.modelLink) ,
  li a[href^="http://www.1000facials.com"]:not(.modelLink) ,
  li a[href^="http://www.18eighteen.com"]:not(.modelLink) ,
  li a[href^="http://www.18yearsold.com"]:not(.modelLink) ,
  li a[href^="http://www.1by-day.com"]:not(.modelLink) ,
  li a[href^="http://www.alsscan.com"]:not(.modelLink) ,
  li a[href^="http://www.amateurallure.com"]:not(.modelLink) ,
  li a[href^="http://www.amateurcreampies.com"]:not(.modelLink) ,
  li a[href^="http://www.bigdickstightfits.com"]:not(.modelLink) ,
  li a[href^="http://www.cdgirls.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.bluejeancreampie.com"]:not(.modelLink) ,
  li a[href^="http://www.couplesseduceteens.com"]:not(.modelLink) ,
  li a[href^="http://www.exploitedbabysitters.com"]:not(.modelLink) ,
  li a[href^="http://www.freefeet4u.com"]:not(.modelLink) ,
  li a[href^="http://www.fuckafan.com"]:not(.modelLink) ,
  li a[href^="http://www.pornpros.com"]:not(.modelLink) ,
  li a[href^="http://www.jurassiccock.com"]:not(.modelLink) ,
  li a[href^="http://www.iloveherfeet.com"]:not(.modelLink) ,
  li a[href^="http://www.tanner-mays.com"]:not(.modelLink) ,
  li a[href^="http://www.gfy.com"]:not(.modelLink) ,
  li a[href^="http://www.herfreshmanyear.com"]:not(.modelLink) ,
  li a[href^="http://www.feetonstreets.net"]:not(.modelLink) ,
  li a[href^="http://www.giirlzinc.com"]:not(.modelLink) ,
  li a[href^="http://www.infocusgirls.com"]:not(.modelLink) ,
  li a[href^="http://www.justlegalbabes.com"]:not(.modelLink) ,
  li a[href^="http://www.innocenthigh.com"]:not(.modelLink) ,
  li a[href^="http://www.iswallowedastranger.com"]:not(.modelLink) ,
  li a[href^="http://www.karupsha.com"]:not(.modelLink) ,
  li a[href^="http://www.lethal18.com"]:not(.modelLink) ,
  li a[href^="http://www.nastylittlefacials.com"]:not(.modelLink) ,
  li a[href^="http://www.realexgirlfriends.com"]:not(.modelLink) ,
  li a[href^="http://www.schoolgirlinternal.com"]:not(.modelLink) ,
  li a[href^="http://www.strippedsuperstars.net"]:not(.modelLink) ,
  li a[href^="http://www.teenagedelinquents.com"]:not(.modelLink) ,
  li a[href^="http://www.teenpinkvideos.com"]:not(.modelLink) ,
  li a[href^="http://www.teenslikeitbig.com"]:not(.modelLink) ,
  li a[href^="http://www.thebossxxx.com"]:not(.modelLink) ,
  li a[href^="http://www.thisgirlsucks.com"]:not(.modelLink) ,
  li a[href^="http://www.tnatryouts.com"]:not(.modelLink) ,
  li a[href^="http://creampiesurprise.com"]:not(.modelLink) ,
  li a[href^="http://costume.fmconcepts.us"]:not(.modelLink) ,
  li a[href^="http://bonedathome.com"]:not(.modelLink) ,
  li a[href^="https://www.silkengirl.com"]:not(.modelLink) ,
  li a[href^="http://pornobeauty.com"]:not(.modelLink) ,
  li a[href^="http://manvin.book.fr"]:not(.modelLink) ,
  li a[href^="http://www.tatleong.com"]:not(.modelLink) ,
  li a[href^="http://www.manvin.book.fr"]:not(.modelLink) ,
  li a[href^="http://www.simonbolz.com"]:not(.modelLink) ,
  li a[href^="http://www.sandrashinelive.com"]:not(.modelLink) ,
  li a[href^="http://www.stockinglive.net"]:not(.modelLink) ,
  li a[href^="http://www.xbiz.com"]:not(.modelLink) ,
  li a[href^="https://1by-day.com"]:not(.modelLink) ,
  li a[href^="http://www.nookeys.com"]:not(.modelLink) ,
  li a[href^="http://www.idreamofjo.com"]:not(.modelLink) ,
  li a[href^="http://www.class-nudes.com"]:not(.modelLink) ,
  li a[href^="http://subspaceland.com"]:not(.modelLink) ,
  li a[href^="http://juj.hu"]:not(.modelLink) ,
  li a[href^="http://magetwist.com"]:not(.modelLink) ,
  li a[href^="http://qrrro.com"]:not(.modelLink) ,
  li a[href^="http://nudeattack.hu"]:not(.modelLink) ,
  li a[href^="http://lreto68.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://en.culioneros.com"]:not(.modelLink) ,
  li a[href^="http://imagetwist.com"]:not(.modelLink) ,
  li a[href^="http://downloads.legalporno.com"]:not(.modelLink) ,
  li a[href^="http://class-nudes.com"]:not(.modelLink) ,
  li a[href^="http://btsporn.com"]:not(.modelLink) ,
  li a[href^="http://24.media.tumblr.com/"]:not(.modelLink) ,
  li a[href^="https://www.fullhdstream.club"]:not(.modelLink) ,
  li a[href^="https://www.amenpics.com"]:not(.modelLink) ,
  li a[href^="http://www.rylskyart.com"]:not(.modelLink) ,
  li a[href^="https://www.snapchat.com"]:not(.modelLink) ,
  li a[href^="https://venus.wowporn.com"]:not(.modelLink) ,
  li a[href^="https://free.brutalx.com"]:not(.modelLink) ,
  li a[href^="http://de.private.com"]:not(.modelLink) ,
  li a[href^="https://amirahadaratube.com"]:not(.modelLink) ,
  li a[href^="http://amirahadaratube.com"]:not(.modelLink) ,
  li a[href^="https://myfreepornstars.com"]:not(.modelLink) ,
  li a[href^="http://previews.ftvgirls.com"]:not(.modelLink) ,
  li a[href^="https://www.barelylegal.com"]:not(.modelLink) ,
  li a[href^="https://www.deviante.com"]:not(.modelLink) ,
  li a[href^="https://girlsonlyporn.com"]:not(.modelLink) ,
  li a[href^="https://4kfreeporn.com"]:not(.modelLink) ,
  li a[href^="http://adulttime.top"]:not(.modelLink) ,
  li a[href^="http://euronudes1.com"]:not(.modelLink) ,
  li a[href^="https://www.wetandpuffy.com"]:not(.modelLink) ,
  li a[href^="https://www.webyoung.com"]:not(.modelLink) ,
  li a[href^="https://www.mofos.com"]:not(.modelLink) ,
  li a[href^="https://www.milehighmedia.com"]:not(.modelLink) ,
  li a[href^="https://www.lesbea.com"]:not(.modelLink) ,
  li a[href^="https://www.doghousedigital.com"]:not(.modelLink) ,
  li a[href^="https://petitehdporn.com"]:not(.modelLink) ,
  li a[href^="http://flexy-girls.com"]:not(.modelLink) ,
  li a[href^="https://nubiles-porn.com"]:not(.modelLink) ,
  li a[href^="https://www.rk.com"]:not(.modelLink) ,
  li a[href^="https://www.clubzoeykush.com"]:not(.modelLink) ,
  li a[href^="https://www.brazzersnetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.addictiveteens.com"]:not(.modelLink) ,
  li a[href^="https://passion-hd.com"]:not(.modelLink) ,
  li a[href^="https://eros-and-grace.net"]:not(.modelLink) ,
  li a[href^="http://www.poseposter.com"]:not(.modelLink) ,
  li a[href^="http://www.nud3.com"]:not(.modelLink) ,
  li a[href^="http://www.nnconnect.com"]:not(.modelLink) ,
  li a[href^="http://www.galore.at"]:not(.modelLink) ,
  li a[href^="http://www.fuckedhard18.com"]:not(.modelLink) ,
  li a[href^="http://www.bravoerotica.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://TheModelIs.IN"]:not(.modelLink) ,
  li a[href^="https://themodelis.in/"]:not(.modelLink) ,
  li a[href^="http://galleries6.petiteteenager.com"]:not(.modelLink) ,
  li a[href^="http://bodsforthemods.com"]:not(.modelLink) ,
  li a[href^="http://a-z-porn"]:not(.modelLink) ,
  li a[href^="http://zoliboy.com"]:not(.modelLink) ,
  li a[href^="http://www.vivthomasvideo.com"]:not(.modelLink) ,
  li a[href^="http://www.smsmovies.net"]:not(.modelLink) ,
  li a[href^="http://www.thepornelf.com"]:not(.modelLink) ,
  li a[href^="http://www.sportyone.com"]:not(.modelLink) ,
  li a[href^="http://www.klub69.eu"]:not(.modelLink) ,
  li a[href^="http://www.goldengate.hu"]:not(.modelLink) ,
  li a[href^="http://www.galweb.only3x.com"]:not(.modelLink) ,
  li a[href^="http://3xhoney.com"]:not(.modelLink) ,
  li a[href^="http://banners.toteme.com"]:not(.modelLink) ,
  li a[href^="http://teensytits.com"]:not(.modelLink) ,
  li a[href^="http://www.amateursgonebad.com"]:not(.modelLink) ,
  li a[href^="http://www.porneskimo.com"]:not(.modelLink) ,
  li a[href^="http://www.pissandlove.com"]:not(.modelLink) ,
  li a[href^="http://www.jpfile.com/sexybeautygirls"]:not(.modelLink) ,
  li a[href^="https://voyeurflash.com"]:not(.modelLink) ,
  li a[href^="http://adultmedia.me"]:not(.modelLink) ,
  li a[href^="https://girls-art.photos"]:not(.modelLink) ,
  li a[href^="https://www.foto-filmdesign.de"]:not(.modelLink) ,
  li a[href^="https://www.zishy.com"]:not(.modelLink) ,
  li a[href^="https://www.nudedreamgirls.com"]:not(.modelLink) ,
  li a[href^="http://images4sale.com"]:not(.modelLink) ,
  li a[href^="http://thinandnaked.com"]:not(.modelLink) ,
  li a[href^="http://www.clips4sale.com"]:not(.modelLink) ,
  li a[href^="http://fetish-elements.com"]:not(.modelLink) ,
  li a[href^="http://splicepicturesx.tumblr.com"]:not(.modelLink) ,
  li a[href^="http://www.vixenphotostudio.com"]:not(.modelLink) ,
  li a[href^="http://foxprowinner.ru"]:not(.modelLink) ,
  li a[href^="http://hdtv-sex.com"]:not(.modelLink) ,
  li a[href^="http://imageset-db.blogspot.se"]:not(.modelLink) ,
  li a[href^="https://www.sexy-models.net"]:not(.modelLink) ,
  li a[href^="https://euforiaonline.net"]:not(.modelLink) ,
  li a[href^="https://www.leons.tv"]:not(.modelLink) ,
  li a[href^="https://ginagerson.xxx"]:not(.modelLink) ,
  li a[href^="https://www.paulraymond.xxx"]:not(.modelLink) ,
  li a[href^="https://www.xartmodels.com"]:not(.modelLink) ,
  li a[href^="https://www.blurb.co.uk"]:not(.modelLink) ,
  li a[href^="https://www.philippelesage.fr"]:not(.modelLink) ,
  li a[href^="http://www.elitebabes.com"]:not(.modelLink) ,
  li a[href^="https://fapster.xxx"]:not(.modelLink) ,
  li a[href^="http://html.blazingmovies.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://adultmedia.me"]:not(.modelLink) ,
  li a[href^="https://www.18plus"]:not(.modelLink) ,
  li a[href^="https://pornopics.net"]:not(.modelLink) ,
  li a[href^="https://nubileset.com"]:not(.modelLink) ,
  li a[href^="https://members.nubiles-porn.com"]:not(.modelLink) ,
  li a[href^="https://free.privatecasting-x.com"]:not(.modelLink) ,
  li a[href^="https://free.kinkyfamily.com"]:not(.modelLink) ,
  li a[href^="https://albagalstube.com"]:not(.modelLink) ,
  li a[href^="https://fhg.pornstreamlive.com"]:not(.modelLink) ,
  li a[href^="https://fhg.onlygolddigger.com"]:not(.modelLink) ,
  li a[href^="https://fhg.only3xseries.com"]:not(.modelLink) ,
  li a[href^="https://anilos.com"]:not(.modelLink) ,
  li a[href^="http://www.stuntcocktryouts.com"]:not(.modelLink) ,
  li a[href^="http://www.pornstars-lick.com"]:not(.modelLink) ,
  li a[href^="http://groups.yahoo.com"]:not(.modelLink) ,
  li a[href^="http://www.pantyhosefetishvideos.com"]:not(.modelLink) ,
  li a[href^="http://www.ragazze-live.com"]:not(.modelLink) ,
  li a[href^="https://letsdoeit.com"]:not(.modelLink) ,
  li a[href^="https://wallhaven.cc"]:not(.modelLink) ,
  li a[href^="https://www.putricinta.com"]:not(.modelLink) ,
  li a[href^="https://www.putricinta.com/"]:not(.modelLink) ,
  li a[href^="https://putricinta.com"]:not(.modelLink) ,
  li a[href^="http://www.upskirtcollection.com"]:not(.modelLink) ,
  li a[href^="http://www.thelifeerotic.com"]:not(.modelLink) ,
  li a[href^="https://profiles.skyprivate.com"]:not(.modelLink) ,
  li a[href^="https://femjoy.com"]:not(.modelLink) ,
  li a[href^="https://www.littlecaprice-dreams.com"]:not(.modelLink) ,
  li a[href^="https://www.hegre.com"]:not(.modelLink) ,
  li a[href^="https://porn-pastor.com"]:not(.modelLink) ,
  li a[href^="http://www.livejasmin.com"]:not(.modelLink) ,
  li a[href^="http://www.live-doll.com"]:not(.modelLink) ,
  li a[href^="http://www.jeanstease.com"]:not(.modelLink) ,
  li a[href^="http://www.flash-in-public.com"]:not(.modelLink) ,
  li a[href^="http://www.domai.com"]:not(.modelLink) ,
  li a[href^="http://thelifeerotic.com/"]:not(.modelLink) ,
  li a[href^="http://scandi-girl.com/"]:not(.modelLink) ,
  li a[href^="http://pantyhosefetishvideos.com"]:not(.modelLink) ,
  li a[href^="http://hqupskirt.com"]:not(.modelLink) ,
  li a[href^="http://g.bnrsis.com"]:not(.modelLink) ,
  li a[href^="https://www.watch4beauty.com"]:not(.modelLink) ,
  li a[href^="https://www.twistys.com"]:not(.modelLink) ,
  li a[href^="https://www.tainster.com"]:not(.modelLink) ,
  li a[href^="https://www.roccosiffredi.com"]:not(.modelLink) ,
  li a[href^="https://www.puffynetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.porncz.com"]:not(.modelLink) ,
  li a[href^="https://www.hardcorebeauties.net"]:not(.modelLink) ,
  li a[href^="https://www.fakehub.com/"]:not(.modelLink) ,
  li a[href^="https://www.danejones.com/"]:not(.modelLink) ,
  li a[href^="https://www.21sextreme.com/"]:not(.modelLink) ,
  li a[href^="https://wtfpass.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://simonscans.com"]:not(.modelLink) ,
  li a[href^="https://moreystudio.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenamites.com"]:not(.modelLink) ,
  li a[href^="http://www3.karupspc.com/"]:not(.modelLink) ,
  li a[href^="http://www.str8hell.com/"]:not(.modelLink) ,
  li a[href^="http://www.simonsfreebies.com/"]:not(.modelLink) ,
  li a[href^="http://www.rychlyprachy.cz/"]:not(.modelLink) ,
  li a[href^="http://www.pornstarerotic.com"]:not(.modelLink) ,
  li a[href^="http://www.german-pornstar.com"]:not(.modelLink) ,
  li a[href^="http://www.fuckndrive.com"]:not(.modelLink) ,
  li a[href^="http://video3.teendorf.com"]:not(.modelLink) ,
  li a[href^="http://video2.teendorf.com/"]:not(.modelLink) ,
  li a[href^="http://mydirtyhobby.de/"]:not(.modelLink) ,
  li a[href^="http://autentickavidea.cz/"]:not(.modelLink) ,
  li a[href^="https://www.devilsfilm.com/"]:not(.modelLink) ,
  li a[href^="https://www.spizoo.com/"]:not(.modelLink) ,
  li a[href^="http://www.modelmayhem.com"]:not(.modelLink) ,
  li a[href^="https://www.xempire.com/"]:not(.modelLink) ,
  li a[href^="https://www.baremaidens.com"]:not(.modelLink) ,
  li a[href^="https://www.puretaboo.com"]:not(.modelLink) ,
  li a[href^="https://cherrypimps.com"]:not(.modelLink) ,
  li a[href^="https://www.pennypaxlive.com/"]:not(.modelLink) ,
  li a[href^="https://www.milfvr.com"]:not(.modelLink) ,
  li a[href^="https://www.darkx.com"]:not(.modelLink) ,
  li a[href^="https://www.babesnetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.sweetsinner.com"]:not(.modelLink) ,
  li a[href^="https://www.twitch.tv"]:not(.modelLink) ,
  li a[href^="https://www.blowpass.com"]:not(.modelLink) ,
  li a[href^="https://www.digitalplayground.com"]:not(.modelLink) ,
  li a[href^="https://www.finishesthejob.com"]:not(.modelLink) ,
  li a[href^="https://www.eroticax.com"]:not(.modelLink) ,
  li a[href^="https://www.mofosnetwork.com"]:not(.modelLink) ,
  li a[href^="https://www.fantasymassage.com"]:not(.modelLink) ,
  li a[href^="https://www.insexondemand.com"]:not(.modelLink) ,
  li a[href^="https://www.pornmegaload.com"]:not(.modelLink) ,
  li a[href^="https://www.footfetishdaily.com"]:not(.modelLink) ,
  li a[href^="https://www.girlsway.com"]:not(.modelLink) ,
  li a[href^="https://www.girlfriendsfilms.com"]:not(.modelLink) ,
  li a[href^="https://www.pinkoclub.com"]:not(.modelLink) ,
  li a[href^="https://www.mylf.com"]:not(.modelLink) ,
  li a[href^="https://www.sweetheartvideo.com"]:not(.modelLink) ,
  li a[href^="https://www.realitykings.com"]:not(.modelLink) ,
  li a[href^="https://www.wicked.com"]:not(.modelLink) ,
  li a[href^="https://www.wcpclub.com"]:not(.modelLink) ,
  li a[href^="https://www.videosz.com"]:not(.modelLink) ,
  li a[href^="https://www.babes.com"]:not(.modelLink) ,
  li a[href^="https://lifeselector.com"]:not(.modelLink) ,
  li a[href^="https://vrhush.com"]:not(.modelLink) ,
  li a[href^="https://badoinkvr.com"]:not(.modelLink) ,
  li a[href^="https://penthousegold.com"]:not(.modelLink) ,
  li a[href^="https://pennypaxlive.xyz"]:not(.modelLink) ,
  li a[href^="https://kinkvr.com"]:not(.modelLink) ,
  li a[href^="https://hustler.com"]:not(.modelLink) ,
  li a[href^="https://bangbros.com"]:not(.modelLink) ,
  li a[href^="http://www.theomegaproject.org"]:not(.modelLink) ,
  li a[href^="http://www.spankingblogg.com"]:not(.modelLink) ,
  li a[href^="http://www.simonscans.com"]:not(.modelLink) ,
  li a[href^="http://www.marryqueen.net"]:not(.modelLink) ,
  li a[href^="http://www.fleshlight-international.eu"]:not(.modelLink) ,
  li a[href^="http://sinns.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://nubilefilms.org"]:not(.modelLink) ,
  li a[href^="http://video.nudewomenandgirls.com"]:not(.modelLink) ,
  li a[href^="http://stdev415aa.spankingtube.com"]:not(.modelLink) ,
  li a[href^="http://joymiiporn.com"]:not(.modelLink) ,
  li a[href^="http://18stream.com"]:not(.modelLink) ,
  li a[href^="http://homegirlsparty.com"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com"]:not(.modelLink) ,
  li a[href^="http://fabsluts.com"]:not(.modelLink) ,
  li a[href^="https://www.livejasmin.com"]:not(.modelLink) ,
  li a[href^="https://erotic-art.photography"]:not(.modelLink) ,
  li a[href^="http://21sexstury.com"]:not(.modelLink) ,
  li a[href^="http://4me.live"]:not(.modelLink) ,
  li a[href^="http://blog.nakety.com"]:not(.modelLink) ,
  li a[href^="https://nakety.com"]:not(.modelLink) ,
  li a[href^="http://analqueenalysa.com"]:not(.modelLink) ,
  li a[href^="http://tightgayholes.com"]:not(.modelLink) ,
  li a[href^="https://www.nextdoorbuddies.com"]:not(.modelLink) ,
  li a[href^="http://metart.top"]:not(.modelLink) ,
  li a[href^="https://metartgirls.net"]:not(.modelLink) ,
  li a[href^="http://babevenue.com"]:not(.modelLink) ,
  li a[href^="http://czechhd.net"]:not(.modelLink) ,
  li a[href^="http://21sextreme.top"]:not(.modelLink) ,
  li a[href^="https://hdtv-sex.com"]:not(.modelLink) ,
  li a[href^="http://www.pornhub.com/"]:not(.modelLink) ,
  li a[href^="https://www.pornhub.com/users/"]:not(.modelLink) ,
  li a[href^="https://www.pornhubpremium.com"]:not(.modelLink) ,
  li a[href*=".pornhub.com"]:not(.modelLink) ,
  li a[href^="https://www.pornhub.com"]:not(.modelLink) ,
  li a[href^="https://www.vrintimacy.com"]:not(.modelLink) ,
  li a[href^="http://hotnasian.com"]:not(.modelLink) ,
  li a[href^="http://deepslit.com"]:not(.modelLink) ,
  li a[href^="https://jjgirls.com"]:not(.modelLink) ,
  li a[href^="https://teenerotica.xxx"]:not(.modelLink) ,
  li a[href^="http://czechharem.com"]:not(.modelLink) ,
  li a[href^="http://www.vmgalleries.com"]:not(.modelLink) ,
  li a[href^="http://www.thelusted.com"]:not(.modelLink) ,
  li a[href^="http://www.star-lust.com"]:not(.modelLink) ,
  li a[href^="http://www.shaggylist.com"]:not(.modelLink) ,
  li a[href^="http://www.lustyguide.com"]:not(.modelLink) ,
  li a[href^="http://www.lust-hero.net"]:not(.modelLink) ,
  li a[href^="http://www.karupsarchive.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.idealboobs.net"]:not(.modelLink) ,
  li a[href^="http://www.hpcgalleries.com"]:not(.modelLink) ,
  li a[href^="http://www.hairypussyshots.com"]:not(.modelLink) ,
  li a[href^="http://www.hairypunta.com"]:not(.modelLink) ,
  li a[href^="http://www.hairygirlspornsite.com"]:not(.modelLink) ,
  li a[href^="http://hairy.hairytaco.com"]:not(.modelLink) ,
  li a[href^="http://hairy.atkgalleries.com"]:not(.modelLink) ,
  li a[href^="http://bustyparade.com"]:not(.modelLink) ,
  li a[href^="http://bromelons.com"]:not(.modelLink) ,
  li a[href^="http://bar.juggcrew.com"]:not(.modelLink) ,
  li a[href^="http://eskimotube.com"]:not(.modelLink) ,
  li a[href^="http://temple.3rdgals.com"]:not(.modelLink) ,
  li a[href^="https://www.westcoastproductions.com"]:not(.modelLink) ,
  li a[href^="https://myspace.com"]:not(.modelLink) ,
  li a[href^="https://lethalhardcore.com"]:not(.modelLink) ,
  li a[href^="https://ct.vod.com"]:not(.modelLink) ,
  li a[href^="http://www.vivid-pornstars.net"]:not(.modelLink) ,
  li a[href^="http://www.toriblack.com"]:not(.modelLink) ,
  li a[href^="http://www.tori-black.net"]:not(.modelLink) ,
  li a[href^="http://www.misstoriblack.net/"]:not(.modelLink) ,
  li a[href^="http://www.ilovetoriblack.com"]:not(.modelLink) ,
  li a[href^="http://i-toriblack.com/"]:not(.modelLink) ,
  li a[href^="https://cum4k.com"]:not(.modelLink) ,
  li a[href^="https://detentiongirls.com"]:not(.modelLink) ,
  li a[href^="https://free-girls.net"]:not(.modelLink) ,
  li a[href^="https://stepsiblingscaught.com"]:not(.modelLink) ,
  li a[href^="http://celebritygalls.com/"]:not(.modelLink) ,
  li a[href^="http://malena-morgan.isnude.eu"]:not(.modelLink) ,
  li a[href^="http://malenamorgan.pornstarerotic.com"]:not(.modelLink) ,
  li a[href^="http://sexchatland.com/"]:not(.modelLink) ,
  li a[href^="http://siennasplash.net"]:not(.modelLink) ,
  li a[href^="http://www.wetbabesblog.com"]:not(.modelLink) ,
  li a[href^="https://topsexcams.xxx"]:not(.modelLink) ,
  li a[href^="https://ero.motaen.com"]:not(.modelLink) ,
  li a[href^="https://www.malenamorgan.net"]:not(.modelLink) ,
  li a[href^="http://makehimcuckold.com"]:not(.modelLink) ,
  li a[href^="http://www.bikini-heat.com"]:not(.modelLink) ,
  li a[href^="http://www.claudechristian.com"]:not(.modelLink) ,
  li a[href^="http://www.claudechristian.com"]:not(.modelLink) ,
  li a[href^="http://www.hardsextube.com"]:not(.modelLink) ,
  li a[href^="http://www.cuffedoutdoors.com"]:not(.modelLink) ,
  li a[href^="http://www.euronudes1.com"]:not(.modelLink) ,
  li a[href^="http://www.livestrip.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.peeindetail.com"]:not(.modelLink) ,
  li a[href^="http://www.sexysettings.com"]:not(.modelLink) ,
  li a[href^="http://www.strictlyglamour.com"]:not(.modelLink) ,
  li a[href^="https://www.momo-net.com"]:not(.modelLink) ,
  li a[href^="http://www.schoolteenz.com"]:not(.modelLink) ,
  li a[href^="http://www.spizoo.com"]:not(.modelLink) ,
  li a[href^="https://ftvmilfs.com"]:not(.modelLink) ,
  li a[href^="https://jodiwest.com"]:not(.modelLink) ,
  li a[href^="https://www.forbiddenfruitsfilms.com"]:not(.modelLink) ,
  li a[href^="http://cherrypimps.com"]:not(.modelLink) ,
  li a[href^="https://bts.amateurallure.com"]:not(.modelLink) ,
  li a[href^="https://mnvg.com"]:not(.modelLink) ,
  li a[href^="https://www.allgirlannihilation.net"]:not(.modelLink) ,
  li a[href^="https://www.naughtyamerica.com"]:not(.modelLink) ,
  li a[href^="https://www.onlyteenblowjobs.com"]:not(.modelLink) ,
  li a[href^="https://www.teamskeet.com"]:not(.modelLink) ,
  li a[href^="https://motleymodels.com"]:not(.modelLink) ,
  li a[href^="https://baberotica.com"]:not(.modelLink) ,
  li a[href^="https://www.atkpremium.com"]:not(.modelLink) ,
  li a[href^="https://www.sislovesme.com"]:not(.modelLink) ,
  li a[href^="http://members.naughtyamerica.com"]:not(.modelLink) ,
  li a[href^="http://www.lilycade.com"]:not(.modelLink) ,
  li a[href^="http://www.x-art.com"]:not(.modelLink) ,
  li a[href^="http://xartvideos"]:not(.modelLink) ,
  li a[href^="http://smutlesbian.com"]:not(.modelLink) ,
  li a[href^="http://trueamateurmodels.com"]:not(.modelLink) ,
  li a[href^="http://www.sexylphillips.com"]:not(.modelLink) ,
  li a[href^="https://nexxxtleveltalentagency.com"]:not(.modelLink) ,
  li a[href^="https://thatsitcomshow.com"]:not(.modelLink) ,
  li a[href^="https://www.hornyhousehold.com"]:not(.modelLink) ,
  li a[href^="http://www.uhmature.com"]:not(.modelLink) ,
  li a[href^="http://www.povbitch.com"]:not(.modelLink) ,
  li a[href^="http://www.diabloproductions"]:not(.modelLink) ,
  li a[href^="http://www.bimaxx.com"]:not(.modelLink) ,
  li a[href^="http://m.cdn.blog.hu"]:not(.modelLink) ,
  li a[href^="http://triksa.com"]:not(.modelLink) ,
  li a[href^="http://www.mytaylorsands.com"]:not(.modelLink) ,
  li a[href^="https://holed.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://mypornboutique.com"]:not(.modelLink) ,
  li a[href^="https://taylorsandstube.com"]:not(.modelLink) ,
  li a[href^="https://www.istripper.com"]:not(.modelLink) ,
  li a[href^="http://danstoncul.over-blog.com"]:not(.modelLink) ,
  li a[href^="http://www.jizzboom.com"]:not(.modelLink) ,
  li a[href^="http://www.tickling-submission.com"]:not(.modelLink) ,
  li a[href^="http://www.momo-net.com"]:not(.modelLink) ,
  li a[href^="http://www.sexykurven.com"]:not(.modelLink) ,
  li a[href^="http://www.momo-net.ch"]:not(.modelLink) ,
  li a[href^="http://www.missonline.cz"]:not(.modelLink) ,
  li a[href^="http://www.londontox.org"]:not(.modelLink) ,
  li a[href^="http://www.girlfolio.com"]:not(.modelLink) ,
  li a[href^="http://www.fotopatracka.cz"]:not(.modelLink) ,
  li a[href^="http://www.bondageforte.com"]:not(.modelLink) ,
  li a[href^="http://www.bikini-pleasure.com"]:not(.modelLink) ,
  li a[href^="http://www.art-lingerie.com"]:not(.modelLink) ,
  li a[href^="http://www.amazingcontent.com"]:not(.modelLink) ,
  li a[href^="http://www.adultcontent.nl"]:not(.modelLink) ,
  li a[href^="http://www.adultblast.com"]:not(.modelLink) ,
  li a[href^="http://sharenxs.com"]:not(.modelLink) ,
  li a[href^="http://picture.teendorf.com"]:not(.modelLink) ,
  li a[href^="http://genuinefeatures.com"]:not(.modelLink) ,
  li a[href^="http://amateurlapdancer.com"]:not(.modelLink) ,
  li a[href^="https://www.hotgirlies4u.com"]:not(.modelLink) ,
  li a[href^="http://jynxmaze.info"]:not(.modelLink) ,
  li a[href^="http://www.avadevineonline.com"]:not(.modelLink) ,
  li a[href^="http://freedpxxx.com"]:not(.modelLink) ,
  li a[href^="http://www.hustler.com"]:not(.modelLink) ,
  li a[href^="http://www.unclechigoporn.com"]:not(.modelLink) ,
  li a[href^="http://www.ultra4kporn.com"]:not(.modelLink) ,
  li a[href^="http://eastcoasttalents.com"]:not(.modelLink) ,
  li a[href^="http://daddy4k.com"]:not(.modelLink) ,
  li a[href^="https://www.pissinginaction.com"]:not(.modelLink) ,
  li a[href^="https://xporno.org"]:not(.modelLink) ,
  li a[href^="https://www.clicporn.com"]:not(.modelLink) ,
  li a[href^="https://lubed.com"]:not(.modelLink) ,
  li a[href^="http://www.amia-miley.com"]:not(.modelLink) ,
  li a[href^="https://pornfaply.com"]:not(.modelLink) ,
  li a[href^="http://www.babesinporn.com"]:not(.modelLink) ,
  li a[href^="https://www.teenfidelity.com"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com"]:not(.modelLink) ,
  li a[href^="http://pornwaiter.com"]:not(.modelLink) ,
  li a[href^="http://sis-loves-me.com"]:not(.modelLink) ,
  li a[href^="http://www.melissa-may.com"]:not(.modelLink) ,
  li a[href^="http://melissa-may.com"]:not(.modelLink) ,
  li a[href^="https://www.patreon.com"]:not(.modelLink) ,
  li a[href^="http://www.metartx.com"]:not(.modelLink) ,
  li a[href^="http://metartgirlz.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.drunksexorgy.com"]:not(.modelLink) ,
  li a[href^="http://oldje.com"]:not(.modelLink) ,
  li a[href^="https://erotic-art.site/"]:not(.modelLink) ,
  li a[href^="https://www.erotic-art.photograph"]:not(.modelLink) ,
  li a[href^="http://allasianreviews.com"]:not(.modelLink) ,
  li a[href^="https://www.amkingdom.com"]:not(.modelLink) ,
  li a[href^="https://www.teamskeettube.com"]:not(.modelLink) ,
  li a[href^="https://lolafae.tumblr.com"]:not(.modelLink) ,
  li a[href^="https://www.sex-files.net"]:not(.modelLink) ,
  li a[href^="http://sex-histories.net"]:not(.modelLink) ,
  li a[href^="https://www.nf-models.com"]:not(.modelLink) ,
  li a[href^="https://www.itserotica.com"]:not(.modelLink) ,
  li a[href^="http://anikkaalbrite.mypornstarblogs.com"]:not(.modelLink) ,
  li a[href^="https://www.fleshlight.eu"]:not(.modelLink) ,
  li a[href^="http://www.starnostar.com"]:not(.modelLink) ,
  li a[href^="http://www.oddassy.com"]:not(.modelLink) ,
  li a[href^="http://www.neongalleries.com"]:not(.modelLink) ,
  li a[href^="http://www.hometownnudes.com"]:not(.modelLink) ,
  li a[href^="http://babedrop.net"]:not(.modelLink) ,
  li a[href^="https://brattysis.com"]:not(.modelLink) ,
  li a[href^="https://www.nubilex.net"]:not(.modelLink) ,
  li a[href^="https://www.hdglamcore.com"]:not(.modelLink) ,
  li a[href^="http://tightcloseup.com"]:not(.modelLink) ,
  li a[href^="https://castingcouch-x.com"]:not(.modelLink) ,
  li a[href^="https://fans.camsoda.com"]:not(.modelLink) ,
  li a[href^="https://fhg.karupsha.com"]:not(.modelLink) ,
  li a[href^="https://ftvgirls.com"]:not(.modelLink) ,
  li a[href^="https://johnnygoodluck.com"]:not(.modelLink) ,
  li a[href^="https://verifiedcall.com"]:not(.modelLink) ,
  li a[href^="https://www.ftv-tube.com"]:not(.modelLink) ,
  li a[href^="https://www.karupsgalleries.com"]:not(.modelLink) ,
  li a[href^="https://www.karupsha.com"]:not(.modelLink) ,
  li a[href^="https://www.pornfidelity.com"]:not(.modelLink) ,
  li a[href^="https://y6u9x4t5.ssl.hwcdn.net"]:not(.modelLink) ,
  li a[href^="http://thehairylady.com"]:not(.modelLink) ,
  li a[href^="http://theyarehairy.com"]:not(.modelLink) ,
  li a[href^="https://www.atkhairy.com"]:not(.modelLink) ,
  li a[href^="https://adultverifiedvideochat.com"]:not(.modelLink) ,
  li a[href^="http://xconfessions.com"]:not(.modelLink) ,
  li a[href^="http://www.altporn4u.com"]:not(.modelLink) ,
  li a[href^="http://www.photorama.nl"]:not(.modelLink) ,
  li a[href^="http://teenfidelity.com"]:not(.modelLink) ,
  li a[href^="http://www.sellyourgf.com"]:not(.modelLink) ,
  li a[href^="https://www.stunning18.com/"]:not(.modelLink) ,
  li a[href^="https://www.femjoy.com"]:not(.modelLink) ,
  li a[href^="https://www.analteenangels.com"]:not(.modelLink) ,
  li a[href^="https://www.21sextury.com"]:not(.modelLink) ,
  li a[href^="https://teenmegaworld.net"]:not(.modelLink) ,
  li a[href^="https://mypickupgirls.com"]:not(.modelLink) ,
  li a[href^="http://bohemiaescorts.com"]:not(.modelLink) ,
  li a[href^="https://mydirtyhobby.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://fancentro.com"]:not(.modelLink) ,
  li a[href^="http://www.fabhairypussy.com"]:not(.modelLink) ,
  li a[href^="http://www.fetish-elements.com"]:not(.modelLink) ,
  li a[href^="https://www.paypal.me"]:not(.modelLink) ,
  li a[href^="http://babeandmodel.xxxfaster.net"]:not(.modelLink) ,
  li a[href^="http://freeeasterngirls.blogbugs.org"]:not(.modelLink) ,
  li a[href^="http://www.best-hardcore-teens.com"]:not(.modelLink) ,
  li a[href^="http://www.girlscanner.com"]:not(.modelLink) ,
  li a[href^="http://www.kscans.com"]:not(.modelLink) ,
  li a[href^="https://joymii.com"]:not(.modelLink) ,
  li a[href^="http://camshub.co"]:not(.modelLink) ,
  li a[href^="http://www.workout69.com"]:not(.modelLink) ,
  li a[href^="https://www.analacrobats.com"]:not(.modelLink) ,
  li a[href^="https://hussiemodels.com"]:not(.modelLink) ,
  li a[href^="https://momsteachsex.com"]:not(.modelLink) ,
  li a[href^="https://hotcrazymess.com"]:not(.modelLink) ,
  li a[href^="http://us.mydirtyhobby.com"]:not(.modelLink) ,
  li a[href^="http://www.trypussy.com"]:not(.modelLink) ,
  li a[href^="http://www.thenudearts.com"]:not(.modelLink) ,
  li a[href^="http://www.themetart.com"]:not(.modelLink) ,
  li a[href^="http://www.nudespuri.com"]:not(.modelLink) ,
  li a[href^="http://www.frolicme.com"]:not(.modelLink) ,
  li a[href^="http://www.freenudewoman.net"]:not(.modelLink) ,
  li a[href^="http://www.ddfprod.com"]:not(.modelLink) ,
  li a[href^="http://2019porn.com"]:not(.modelLink) ,
  li a[href^="https://www.czechvrfetish.com"]:not(.modelLink) ,
  li a[href^="http://free-girls.net"]:not(.modelLink) ,
  li a[href^="https://pornvit.com"]:not(.modelLink) ,
  li a[href^="https://www.niteflirt.com"]:not(.modelLink) ,
  li a[href^="http://clips4Sale.com"]:not(.modelLink) ,
  li a[href^="https://iwantfanclub.com"]:not(.modelLink) ,
  li a[href^="http://lilyluvs.com"]:not(.modelLink) ,
  li a[href^="http://Insidelilylabeau.com"]:not(.modelLink) ,
  li a[href^="http://www.danporntaboo.com"]:not(.modelLink) ,
  li a[href^="http://www.nurumassage.com"]:not(.modelLink) ,
  li a[href^="http://www.officialglassolive.com"]:not(.modelLink) ,
  li a[href^="https://tmwvrnet.com"]:not(.modelLink) ,
  li a[href^="http://sexyteens.xlogs.org"]:not(.modelLink) ,
  li a[href^="http://alexanova.mypornstarblogs.com"]:not(.modelLink) ,
  li a[href^="http://www.alexanovanation.com"]:not(.modelLink) ,
  li a[href^="http://www.tuboff.com"]:not(.modelLink) ,
  li a[href^="https://alexanovaxxx.tumblr.com"]:not(.modelLink) ,
  li a[href^="https://alexanovaxxx.tumblr.com"]:not(.modelLink) ,
  li a[href^="https://frprn.com"]:not(.modelLink) ,
  li a[href^="http://www.trickyoldteacher.com"]:not(.modelLink) ,
  li a[href^="http://www.povbitch.com"]:not(.modelLink) ,
  li a[href^="https://ru.chaturbate.com"]:not(.modelLink) ,
  li a[href^="https://cdn.ftvgirls.com"]:not(.modelLink) ,
  li a[href^="https://popsiclequeens.com"]:not(.modelLink) ,
  li a[href^="https://xes.pl"]:not(.modelLink) ,
  li a[href^="http://teenmegaworld.net"]:not(.modelLink) ,
  li a[href^="http://www.pornpicspass.com"]:not(.modelLink) ,
  li a[href^="http://dawn-brooks.tumblr.com"]:not(.modelLink) ,
  li a[href^="http://www.porngals4.com"]:not(.modelLink) ,
  li a[href^="https://www.nude-gals.com"]:not(.modelLink) ,
  li a[href^="http://www.oldje-3some.com"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://www.sapphicerotica.com"]:not(.modelLink) ,
  li a[href^="http://bigpichost.com/"]:not(.modelLink) ,
  li a[href^="http://karupspcx.com/"]:not(.modelLink) ,
  li a[href^="http://www.eroticnet.cz/"]:not(.modelLink) ,
  li a[href^="http://www.fundorado.de/"]:not(.modelLink) ,
  li a[href^="http://y6u9x4t5.ssl.hwcdn.net/"]:not(.modelLink) ,
  li a[href^="https://www.atkexotics.com/"]:not(.modelLink) ,
  li a[href^="https://www.freshnudes.net/"]:not(.modelLink) ,
  li a[href^="https://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="https://www.karups.com/"]:not(.modelLink) ,
  li a[href^="https://www.karupspc.com/"]:not(.modelLink) ,
  li a[href^="http://hqoldfucksyoung.pornblink.com/"]:not(.modelLink) ,
  li a[href*=".erolog.org/"]:not(.modelLink) ,
  li a[href^="http://nubiles-porn.com/"]:not(.modelLink) ,
  li a[href^="http://nubilefilms.com"]:not(.modelLink) ,
  li a[href^="http://nubiles-casting.com/"]:not(.modelLink) ,
  li a[href^="http://nubilefilms.com/galleries/"]:not(.modelLink) ,
  li a[href^="http://www.nubilefilms.com/galleries/"]:not(.modelLink) ,
  li a[href^="http://members.nubilefilms.com/"]:not(.modelLink) ,
  li a[href^="http://nubiles.net/galleries/"]:not(.modelLink)  ,
  li a[href^="http://galleries.nubiles.net/"]:not(.modelLink) ,
  li a[href^="http://nubiles-porn.com/"]:not(.modelLink) ,
  li a[href^="http://freebies."]:not(.modelLink) ,
  li a[href^="http://freebies.8teenies.com/"]:not(.modelLink) ,
  li a[href^="http://freebies.your18.com/"]:not(.modelLink) ,
  li a[href^="http://join.wetandpissy.com/"]:not(.modelLink) ,
  li a[href^="http://join.vipissy.com/"]:not(.modelLink) ,
  li a[href^="http://join.puffynetwork.com/"]:not(.modelLink) ,
  li a[href^="http://firstanalquest.com/"]:not(.modelLink) ,
  li a[href^="http://www.firstanalquest.com"]:not(.modelLink) ,
  li a[href^="http://www.firstanalquest.com/models/search/"]:not(.modelLink) ,
  li a[href^="https://www.mydirtyhobby.com/"]:not(.modelLink) ,
  li a[href^="http://mydirtyhobby.com"]:not(.modelLink) ,
  li a[href^="http://www.mydirtyhobby.com/"]:not(.modelLink) ,
  li a[href^="http://uk.mydirtyhobby.com/"]:not(.modelLink) ,
  li a[href^="http://fhg."]:not(.modelLink) ,
  li a[href^="http://fhg.stunning18.com/"]:not(.modelLink) ,
  li a[href^="http://fhg.vivthomas.com/"]:not(.modelLink) ,
  li a[href^="http://fhg.classaffiliates.com/"]:not(.modelLink) ,
  li a[href^="http://fhg.alsscan.com/"]:not(.modelLink) ,
  li a[href^="http://fhg.met-art.com/"]:not(.modelLink) ,
  li a[href^="http://t2."]:not(.modelLink) ,
  li a[href^="http://t2.21sextury.com/"]:not(.modelLink) ,
  li a[href^="http://t2.21sextreme.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.teengirls.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.hardcoreyouth.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.pimproll.com/"]:not(.modelLink) ,
  li a[href^="http://gallery.norestnetwork.com/"]:not(.modelLink) ,
  li a[href^="http://lioness.18onlygirls.com/"]:not(.modelLink) ,
  li a[href^="http://lioness.younglegalporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.gohoneygo.com/"]:not(.modelLink) ,
  li a[href^="http://www.gohoneygo.com/trial/"]:not(.modelLink) ,
  li a[href^="http://eurogirlsongirls.com/"]:not(.modelLink) ,
  li a[href^="http://eurogirlsongirls.com/model/"]:not(.modelLink) ,
  li a[href^="http://euroteenerotica.com/"]:not(.modelLink) ,
  li a[href^="http://euroteenerotica.com/model/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://stunning18.com/"]:not(.modelLink) ,
  li a[href^="http://stunning18.com/model/"]:not(.modelLink) ,
  li a[href^="http://femjoy.com/"]:not(.modelLink) ,
  li a[href^="http://femjoy.com/index.php/models/"]:not(.modelLink) ,
  li a[href^="https://www.legalporno.com/"]:not(.modelLink) ,
  li a[href^="https://www.legalporno.com/model/"]:not(.modelLink) ,
  li a[href^="http://www.followcamgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.followcamgirls.com/galleries/"]:not(.modelLink) ,
  li a[href^="http://www.clubglamour.net/"]:not(.modelLink) ,
  li a[href^="http://www.clubglamour.net/galleries"]:not(.modelLink) ,
  li a[href^="https://www.inthecrack.com/"]:not(.modelLink) ,
  li a[href^="https://www.inthecrack.com/Model/"]:not(.modelLink) ,
  li a[href^="http://hosted./"]:not(.modelLink) ,
  li a[href^="http://hosted.x-art.com/"]:not(.modelLink) ,
  li a[href^="http://ocmodeling.com/"]:not(.modelLink) ,
  li a[href^="http://www.ocmodeling.com/"]:not(.modelLink) ,
  li a[href^="http://badoinkvr.com"]:not(.modelLink) ,
  li a[href^="http://badoinkvr.com/"]:not(.modelLink) ,
  li a[href^="http://littlehellcat.com"]:not(.modelLink) ,
  li a[href^="http://littlehellcat.com/"]:not(.modelLink) ,
  li a[href^="http://www.sinfulsyren.com"]:not(.modelLink) ,
  li a[href^="http://www.tiffanythompsonporn.com"]:not(.modelLink) ,
  li a[href^="http://www.tiffanythompsonporn.com/"]:not(.modelLink) ,
  li a[href^="http://trinitystclair.com/"]:not(.modelLink) ,
  li a[href^="http://augustames.erolog.org"]:not(.modelLink) ,
  li a[href^="http://gwen.crocostars.com/"]:not(.modelLink) ,
  li a[href^="http://angeldark.erolog.org"]:not(.modelLink) ,
  li a[href^="http://valentinanappi.mypornstarblogs.com/"]:not(.modelLink) ,
  li a[href^="http://www.valentina-nappi.it"]:not(.modelLink) ,
  li a[href^="https://valenappi.com/"]:not(.modelLink) ,
  li a[href^="https://mobile.twitter.com/YONITALE/"]:not(.modelLink) ,
  li a[href^="http://www.clubsarahvandella.com"]:not(.modelLink) ,
  li a[href^="http://clubsarahvandella.com"]:not(.modelLink) ,
  li a[href^="http://madisonscott.erolog.org/"]:not(.modelLink) ,
  li a[href^="http://www.madisonscott.net/"]:not(.modelLink) ,
  li a[href^="http://shawnalenee-blog.com/"]:not(.modelLink) ,
  li a[href^="http://www.annabellpeaksxxx.com/"]:not(.modelLink) ,
  li a[href^="http://www.clubanissakate.com/"]:not(.modelLink) ,
  li a[href^="http://eufrat.crocostars.com/"]:not(.modelLink) ,
  li a[href^="http://eufrat.erolog.org"]:not(.modelLink) ,
  li a[href^="http://eufrat.isnude.eu/"]:not(.modelLink) ,
  li a[href^="http://jana-hall.crocostars.com/"]:not(.modelLink) ,
  li a[href^="http://www.eufrat.org"]:not(.modelLink) ,
  li a[href^="http://www.kerrylouiseclub.com/"]:not(.modelLink) ,
  li a[href^="http://lunacorazonfanclub.com/"]:not(.modelLink) ,
  li a[href^="http://itorylane.com/"]:not(.modelLink) ,
  li a[href^="http://jessierogers.nudemodelportal.com"]:not(.modelLink) ,
  li a[href^="http://jessierogers.pornstarerotic.com/"]:not(.modelLink) ,
  li a[href^="https://www.vivthomas.com/"]:not(.modelLink) ,
  li a[href^="http://www.sophieevans.co.uk"]:not(.modelLink) ,
  li a[href^="http://www.roccosiffredi.com/"]:not(.modelLink) ,
  li a[href^="http://www.janamiartusova.net/"]:not(.modelLink) ,
  li a[href^="http://www.nellablog.com/"]:not(.modelLink) ,
  li a[href^="http://www.jayden-cole.com"]:not(.modelLink) ,
  li a[href^="http://www.breedaniels.org"]:not(.modelLink) ,
  li a[href^="http://www.breedaniels.org/"]:not(.modelLink) ,
  li a[href^="http://www.ebinamodels.com/"]:not(.modelLink) ,
  li a[href^="http://amourangels.com/"]:not(.modelLink) ,
  li a[href^="http://alliehaze.name/"]:not(.modelLink) ,
  li a[href^="http://www.alliehaze.com/"]:not(.modelLink) ,
  li a[href^="http://www.danidanielsblog.com/"]:not(.modelLink) ,
  li a[href^="http://ohyea-eden.tumblr.com/"]:not(.modelLink) ,
  li a[href^="http://monicamendez.name/"]:not(.modelLink) ,
  li a[href^="http://www.scoreland.com/"]:not(.modelLink) ,
  li a[href^="http://www.xxxinari.com"]:not(.modelLink) ,
  li a[href^="https://angelwickyofficial.com/"]:not(.modelLink) ,
  li a[href^="http://sandlmodels2.com/"]:not(.modelLink) ,
  li a[href^="http://ijaydencole.com/"]:not(.modelLink) ,
  li a[href^="http://icarlibanks.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://nadinesage.mypornstarblogs.com"]:not(.modelLink) ,
  li a[href^="http://madisonchandler.org/"]:not(.modelLink) ,
  li a[href^="http://www.clubdanidaniels.com"]:not(.modelLink) ,
  li a[href^="http://galleries5.ptclassic.com/"]:not(.modelLink) ,
  li a[href^="http://companions.ws/"]:not(.modelLink) ,
  li a[href^="http://freeteenpics.just18.com/"]:not(.modelLink) ,
  li a[href^="http://lucky.crocostars.com/"]:not(.modelLink) ,
  li a[href^="http://www.ddfgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://www.deliciousgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://www.european-porn-star.com"]:not(.modelLink) ,
  li a[href^="http://www.free18.net/"]:not(.modelLink) ,
  li a[href^="http://www.pornstarbabe.net/"]:not(.modelLink) ,
  li a[href^="http://www.thumbparty.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.karups.com/"]:not(.modelLink) ,
  li a[href^="http://www.leighraven.com/"]:not(.modelLink) ,
  li a[href^="https://scarletblue.com.au/"]:not(.modelLink) ,
  li a[href^="http://anjelica.pornstarerotic.com/"]:not(.modelLink) ,
  li a[href^="http://cashforsextape.com/"]:not(.modelLink) ,
  li a[href^="http://femdomsessions.com"]:not(.modelLink) ,
  li a[href^="http://movies.wowporn.com/"]:not(.modelLink) ,
  li a[href^="http://upskirtcollection.com/"]:not(.modelLink) ,
  li a[href^="http://www.paradise-film.net"]:not(.modelLink) ,
  li a[href^="https://galleries.teendreams.com/"]:not(.modelLink) ,
  li a[href^="https://pornjon.com/"]:not(.modelLink) ,
  li a[href^="https://venus.allfinegirls.com/"]:not(.modelLink) ,
  li a[href^="https://www.teendreams.com/"]:not(.modelLink) ,
  li a[href^="http://www.amourbabes.com/"]:not(.modelLink) ,
  li a[href^="http://www.hot-from-russia.com/"]:not(.modelLink) ,
  li a[href^="http://beeg.com/free/"]:not(.modelLink) ,
  li a[href^="http://www.eurolesbogirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.hairyundies.com/"]:not(.modelLink) ,
  li a[href^="http://www.russianteenobsession.com/"]:not(.modelLink) ,
  li a[href^="http://www.madperversions.com/"]:not(.modelLink) ,
  li a[href^="http://pornescort.xxx/"]:not(.modelLink) ,
  li a[href^="https://evelinstonexxx.com"]:not(.modelLink) ,
  li a[href^="http://www.exclusiveclub.com/"]:not(.modelLink) ,
  li a[href^="http://www.exposednurses.com/"]:not(.modelLink) ,
  li a[href^="http://www.gapemypussy.com/"]:not(.modelLink) ,
  li a[href^="http://www.puffynetwork.com/"]:not(.modelLink) ,
  li a[href^="http://apolonialapiedra.mypornstarblogs.com"]:not(.modelLink) ,
  li a[href^="http://motleymodels.com/"]:not(.modelLink) ,
  li a[href^="https://myfamilypies.com/"]:not(.modelLink) ,
  li a[href^="https://nubiles.net/"]:not(.modelLink) ,
  li a[href^="https://pornstill.com/"]:not(.modelLink) ,
  li a[href^="https://www.18eighteen.com/"]:not(.modelLink) ,
  li a[href^="https://www.naughtymag.com/"]:not(.modelLink) ,
  li a[href^="http://www.amkingdom.com/"]:not(.modelLink) ,
  li a[href^="http://www.mademan.com/"]:not(.modelLink) ,
  li a[href^="http://www2.slanteyefortheblackguy.com/"]:not(.modelLink) ,
  li a[href^="http://priva.erolog.org"]:not(.modelLink) ,
  li a[href^="http://www.joymiimodels.com/"]:not(.modelLink) ,
  li a[href^="http://g.bnrdom.com/"]:not(.modelLink) ,
  li a[href^="http://www.morebabes.to/"]:not(.modelLink) ,
  li a[href^="http://www.openlife.com/"]:not(.modelLink) ,
  li a[href^="http://joselinekelly"]:not(.modelLink) ,
  li a[href^="http://www.pornmegaload.com/"]:not(.modelLink) ,
  li a[href^="http://www.zishy.com/"]:not(.modelLink) ,
  li a[href^="https://www.nextdoordolls.com/"]:not(.modelLink) ,
  li a[href^="https://www.nsfwtgp.com/"]:not(.modelLink) ,
  li a[href^="http://www.nastyeurobabes.com/"]:not(.modelLink) ,
  li a[href^="http://www.norestfortheass.com/"]:not(.modelLink) ,
  li a[href^="http://www.deepslit.com/"]:not(.modelLink) ,
  li a[href^="http://www.babevideos.org/"]:not(.modelLink) ,
  li a[href^="http://psychohenessy.com/"]:not(.modelLink) ,
  li a[href^="http://pinkfineart.com/"]:not(.modelLink) ,
  li a[href^="http://movies.wowgirls.com/"]:not(.modelLink) ,
  li a[href^="http://hidenylons.com/"]:not(.modelLink) ,
  li a[href^="http://ericafontes.biz/"]:not(.modelLink) ,
  li a[href^="http://fhg2.mofos.com/"]:not(.modelLink) ,
  li a[href^="http://freebabes.us/"]:not(.modelLink) ,
  li a[href^="http://magicsolos.info/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://picture.spunkybee.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultpit.com/"]:not(.modelLink) ,
  li a[href^="http://video.spunkybee.com/"]:not(.modelLink) ,
  li a[href^="http://www.privatezone.ws/"]:not(.modelLink) ,
  li a[href^="http://www.theabigailejohnson.com/"]:not(.modelLink) ,
  li a[href^="http://www.tmodels.org"]:not(.modelLink) ,

  li a[href^="http://www.mc-nudes.com/"]:not(.modelLink) ,
  li a[href^="http://groups.google.com/group/youngest-girls/"]:not(.modelLink) ,
  li a[href^="http://www.hellosexe.com/"]:not(.modelLink) ,
  li a[href^="http://galleryofpornpics.com/"]:not(.modelLink) ,
  li a[href^="http://isashagrey.com/"]:not(.modelLink) ,
  li a[href^="http://nudehdpictures.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultwiki.net/"]:not(.modelLink) ,
  li a[href^="http://www.fantasygirlsasha.com/"]:not(.modelLink) ,
  li a[href^="http://xxxpornpicture.com/"]:not(.modelLink) ,
  li a[href^="http://www.sashagrey.ws/"]:not(.modelLink) ,
  li a[href^="http://pl.thenude.eu/"]:not(.modelLink) ,
  li a[href^="http://www.xartmodels.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.karupspc.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.thelifeerotic.com/"]:not(.modelLink) ,
  li a[href^="http://oldgoesyoung.com/"]:not(.modelLink) ,
  li a[href^="http://pornopinion.com/"]:not(.modelLink) ,
  li a[href^="http://sapphicerotica.com/"]:not(.modelLink) ,
  li a[href^="https://www.videochaterotico.com/"]:not(.modelLink) ,
  li a[href^="http://karmenkarma.mypornstarblogs.com/"]:not(.modelLink) ,
  li a[href^="https://www.itskarmenkarma.com"]:not(.modelLink) ,
  li a[href^="http://bellabellz.mypornstarblogs.com/"]:not(.modelLink) ,
  li a[href^="https://pornstars4escort.com/"]:not(.modelLink) ,
  li a[href^="http://new.bangbros.com/"]:not(.modelLink) ,
  li a[href^="http://straight.fleshbot.com/"]:not(.modelLink) ,
  li a[href^="https://bangbrothers.com/"]:not(.modelLink) ,
  li a[href^="https://www.brazzers.com/"]:not(.modelLink) ,
  li a[href^="http://passion-hd.com/"]:not(.modelLink) ,
  li a[href^="http://www.elegantangel.com/"]:not(.modelLink) ,
  li a[href^="http://www.gyno-x.com/"]:not(.modelLink) ,
  li a[href^="http://www.thecunts.net/"]:not(.modelLink) ,
  li a[href^="http://www.model-kartei.de"]:not(.modelLink) ,
  li a[href^="http://www.teendreamsvault.com/"]:not(.modelLink) ,
  li a[href^="http://www.youngpussycats.com/"]:not(.modelLink) ,
  li a[href^="http://refer.ccbill.com/"]:not(.modelLink) ,
  li a[href^="http://www.foxxxmodeling.com/"]:not(.modelLink) ,
  li a[href^="https://www.swallowsalon.com/"]:not(.modelLink) ,
  li a[href^="http://revs.glamourmodelsgonebad.com/"]:not(.modelLink) ,
  li a[href^="http://www.onlycuties.net/"]:not(.modelLink) ,
  li a[href^="https://virtualrealporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.inthecrack.com/"]:not(.modelLink) ,
  li a[href^="https://www.abbywinters.com/"]:not(.modelLink) ,
  li a[href^="http://www.lostbetsgames.com/"]:not(.modelLink) ,
  li a[href^="http://nudeamateurgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://6mature9.com/"]:not(.modelLink) ,
  li a[href^="http://archivegalleries.net/"]:not(.modelLink) ,
  li a[href^="https://got2pee.com/"]:not(.modelLink) ,
  li a[href^="http://www.playboymisssocial.com/"]:not(.modelLink) ,
  li a[href^="https://ask.fm/"]:not(.modelLink) ,
  li a[href^="http://www.bustyleague.com/"]:not(.modelLink) ,
  li a[href^="http://www.fiestamilf.com/"]:not(.modelLink) ,
  li a[href^="http://spieglergirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.americanbunny.com/"]:not(.modelLink) ,
  li a[href^="http://www.penthousegalleries.net/"]:not(.modelLink) ,
  li a[href^="https://www.wearehairy.com/"]:not(.modelLink) ,
  li a[href^="https://www.manojob.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://pornstarsfuckfans.net/"]:not(.modelLink) ,
  li a[href^="http://fuck4beer.com/"]:not(.modelLink) ,
  li a[href^="http://www.cumfortune.com"]:not(.modelLink) ,
  li a[href^="http://www.emodelky.cz/"]:not(.modelLink) ,
  li a[href^="http://www.fuck4beer.com/"]:not(.modelLink) ,
  li a[href^="http://www.leggycash.com/"]:not(.modelLink) ,
  li a[href^="http://www.pussypornpics.net/"]:not(.modelLink) ,
  li a[href^="https://www.stockingsvr.com/"]:not(.modelLink) ,
  li a[href^="https://www.stockingvideos.com/"]:not(.modelLink) ,
  li a[href^="https://www.web-starlets.com/"]:not(.modelLink) ,
  li a[href^="http://kendralibrarygirl.blogspot.com"]:not(.modelLink) ,
  li a[href^="http://www.dropyourload.com/"]:not(.modelLink) ,
  li a[href^="http://www.nydailynews.com/"]:not(.modelLink) ,
  li a[href^="https://www.elitebabes.com/"]:not(.modelLink) ,
  li a[href^="https://www.vixen.com/"]:not(.modelLink) ,
  li a[href^="https://xxxporn.pics/"]:not(.modelLink) ,
  li a[href^="http://www.immorallive.com/"]:not(.modelLink) ,
  li a[href^="http://www.watch4beauty.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.eroticbeauty.com/"]:not(.modelLink) ,
  li a[href^="https://www.eroticbeauty.com/"]:not(.modelLink) ,
  li a[href^="https://www.goddessnudes.com/"]:not(.modelLink) ,
  li a[href^="https://www.errotica-archives.com/"]:not(.modelLink) ,
  li a[href^="http://www.cosmid.net/"]:not(.modelLink) ,
  li a[href^="https://www.fleshlight.com/"]:not(.modelLink) ,
  li a[href^="http://xoxojoannaangel.com"]:not(.modelLink) ,
  li a[href^="https://www.pornstarclassics.com/"]:not(.modelLink) ,
  li a[href^="http://sinn-sage.com/"]:not(.modelLink) ,
  li a[href^="http://databases.babesandpornstars.com/"]:not(.modelLink) ,
  li a[href^="http://susanblockvideos.sensualwriter.com/"]:not(.modelLink) ,
  li a[href^="https://www.karupsow.com/"]:not(.modelLink) ,
  li a[href^="http://lesbians-at-home.com/"]:not(.modelLink) ,
  li a[href^="http://www.sandrashinebonus.net/"]:not(.modelLink) ,
  li a[href^="http://www.sandyfantasy.net/"]:not(.modelLink) ,
  li a[href^="http://www.soloxadulti.it/"]:not(.modelLink) ,
  li a[href^="http://www.southern-charms2.com/"]:not(.modelLink) ,
  li a[href^="http://www.sweet-peaches.net"]:not(.modelLink) ,
  li a[href^="http://karupshax.com"]:not(.modelLink) ,
  li a[href^="http://21naturals.com/"]:not(.modelLink) ,
  li a[href^="http://www.averotica.com/"]:not(.modelLink) ,
  li a[href^="http://private.com/"]:not(.modelLink) ,
  li a[href^="http://ideal-teens.com/"]:not(.modelLink) ,
  li a[href^="http://freeporn.youngleafs.com/"]:not(.modelLink) ,
  li a[href^="http://rikkisix.net/"]:not(.modelLink) ,
  li a[href^="http://www.biglovetalent.com/"]:not(.modelLink) ,
  li a[href^="http://www.clubjessierogers.com/"]:not(.modelLink) ,
  li a[href^="http://www.glamourhound.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.pretty-pornstars.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenythongs.net/"]:not(.modelLink) ,
  li a[href^="http://www.yoursweet18.com/"]:not(.modelLink) ,
  li a[href^="http://preview.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://preview.ftvstream.com/"]:not(.modelLink) ,
  li a[href^="http://hostave3.net/"]:not(.modelLink) ,
  li a[href^="http://www.norestnetwork.com/"]:not(.modelLink) ,
  li a[href^="http://new.younglegalporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.extremefistinggalleries.com/"]:not(.modelLink) ,
  li a[href^="http://www.vivthomas.com/"]:not(.modelLink) ,
  li a[href^="http://analteenangels.21sextury.com/"]:not(.modelLink) ,
  li a[href^="http://collegefuckparties.com/"]:not(.modelLink) ,
  li a[href^="http://tryteens.com/"]:not(.modelLink) ,
  li a[href^="http://www.beautyandthesenior.com/"]:not(.modelLink) ,
  li a[href^="https://amzn.com/"]:not(.modelLink) ,
  li a[href^="https://www.21naturals.com/"]:not(.modelLink) ,
  li a[href^="http://www.gloryholeblog.net/"]:not(.modelLink) ,
  li a[href^="http://letsplaylez.com/"]:not(.modelLink) ,
  li a[href^="http://mypickupgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.imagebam.com/"]:not(.modelLink) ,
  li a[href^="http://sineplex.com/"]:not(.modelLink) ,
  li a[href^="http://www.intporn.com/"]:not(.modelLink) ,
  li a[href^="https://new.vk.com/"]:not(.modelLink) ,
  li a[href^="http://galleries-pornstar.com/"]:not(.modelLink) ,
  li a[href^="http://mooigirlz.com/"]:not(.modelLink) ,
  li a[href^="http://www.nubilestube.com/"]:not(.modelLink) ,
  li a[href^="https://www.facebook.com/"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://hussiemodels.com/"]:not(.modelLink) ,
  li a[href^="http://freeteenpics.swankmag.com/"]:not(.modelLink) ,
  li a[href^="http://supreme-thumbs.com/"]:not(.modelLink) ,
  li a[href^="http://www.online-hardcore-video.com/"]:not(.modelLink) ,
  li a[href^="https://www.x-art.com/"]:not(.modelLink) ,
  li a[href^="https://whorecraftvr.com/"]:not(.modelLink) ,
  li a[href^="http://adultstarmodels.com/"]:not(.modelLink) ,
  li a[href^="http://www.xxxgfsblog.com/"]:not(.modelLink) ,
  li a[href^="https://www.amateurporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.wankitnow.com/"]:not(.modelLink) ,
  li a[href^="http://faphuntr.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultwork.com/"]:not(.modelLink) ,
  li a[href^="http://www.purecfnm.com"]:not(.modelLink) ,
  li a[href^="http://www.groupsexfan.com/"]:not(.modelLink) ,
  li a[href^="http://www.worldoffetish.com/"]:not(.modelLink) ,
  li a[href^="https://www.czechvrcasting.com/"]:not(.modelLink) ,
  li a[href^="http://www.dogoks.com/"]:not(.modelLink) ,
  li a[href^="http://www.errotica-archives.com/"]:not(.modelLink) ,
  li a[href^="http://www.moreystudio.com"]:not(.modelLink) ,
  li a[href^="http://newtgp.net/"]:not(.modelLink) ,
  li a[href^="http://www.alscash.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.spieglergirls.com/"]:not(.modelLink) ,
  li a[href^="http://members.nubiles-porn.com/"]:not(.modelLink) ,
  li a[href^="http://www.nf-models.com/"]:not(.modelLink) ,
  li a[href^="https://nubilefilms.com/"]:not(.modelLink) ,
  li a[href^="https://www.peekvids.com/"]:not(.modelLink) ,
  li a[href^="http://porn-720.com/"]:not(.modelLink) ,
  li a[href^="http://mom50.com/"]:not(.modelLink) ,
  li a[href^="http://www.dfbnetwork.com/"]:not(.modelLink) ,
  li a[href^="https://vrpornindexxx.com/"]:not(.modelLink) ,
  li a[href^="http://sassy-ass.com/"]:not(.modelLink) ,
  li a[href^="http://demifray.com/"]:not(.modelLink) ,
  li a[href^="http://g.bnrs.it/"]:not(.modelLink) ,
  li a[href^="http://hosted.amourangels.com/"]:not(.modelLink) ,
  li a[href^="http://hosted.showybeauty.com/"]:not(.modelLink) ,
  li a[href^="http://www.playboyplus.com/"]:not(.modelLink) ,
  li a[href^="http://www.hosted.mplstudios.com/"]:not(.modelLink) ,
  li a[href^="https://access.eternaldesire.com/"]:not(.modelLink) ,
  li a[href^="https://access.met-art.com/"]:not(.modelLink) ,
  li a[href^="https://access.metartx.com/"]:not(.modelLink) ,
  li a[href^="https://m.youtube.com/"]:not(.modelLink) ,
  li a[href^="https://www.mplstudios.com/"]:not(.modelLink) ,
  li a[href^="http://www.mrpov.com/"]:not(.modelLink) ,
  li a[href^="http://bts.amateurallure.com/"]:not(.modelLink) ,
  li a[href^="http://dropyourload.com/"]:not(.modelLink) ,
  li a[href^="http://fhg2.babes.com/"]:not(.modelLink) ,
  li a[href^="http://www.atk-amateurs.com/"]:not(.modelLink) ,
  li a[href^="http://epicsex.com/"]:not(.modelLink) ,
  li a[href^="http://IFuckedHerFinally.com"]:not(.modelLink) ,
  li a[href^="http://theater.aebn.net/"]:not(.modelLink) ,
  li a[href^="http://badteenspunished.com/"]:not(.modelLink) ,
  li a[href^="http://daddyslilangel.com/"]:not(.modelLink) ,
  li a[href^="http://ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://myfamilypies.com/"]:not(.modelLink) ,
  li a[href^="http://nubilesunscripted.com/"]:not(.modelLink) ,
  li a[href^="http://www.blackrosetalent.com/"]:not(.modelLink) ,
  li a[href^="http://www.myfavoritenudes.com/"]:not(.modelLink) ,
  li a[href^="http://chaturbate.com/shamelessnameless"]:not(.modelLink) ,
  li a[href^="http://www.crocostars.com/"]:not(.modelLink) ,
  li a[href^="http://www.erotiqlinks.com/"]:not(.modelLink) ,
  li a[href^="http://pornstars101.com/"]:not(.modelLink) ,
  li a[href^="https://pornstarstroker.com/"]:not(.modelLink) ,
  li a[href^="http://forum.babeid.com/"]:not(.modelLink) ,
  li a[href^="http://hqsin.com/"]:not(.modelLink) ,
  li a[href^="http://movies.meatinsertions.com/"]:not(.modelLink) ,
  li a[href^="http://smoothskinnedsex.com/"]:not(.modelLink) ,
  li a[href^="http://www.mundial.fajnelaski.pl/"]:not(.modelLink) ,
  li a[href^="http://teenylovers.com/"]:not(.modelLink) ,
  li a[href^="http://movies.younglegalporn.com/"]:not(.modelLink) ,
  li a[href^="http://wtfpass.com/"]:not(.modelLink) ,
  li a[href^="http://cutesunny.com/"]:not(.modelLink) ,
  li a[href^="http://fetish.sexpreviews.eu/"]:not(.modelLink) ,
  li a[href^="http://www.city-feet.com/"]:not(.modelLink) ,
  li a[href^="http://www.sinfulteenvideos.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.xxxpornstargalleries.com/"]:not(.modelLink) ,
  li a[href^="http://teenanalcasting.net/"]:not(.modelLink) ,
  li a[href^="http://www.animalnewyork.com/"]:not(.modelLink) ,
  li a[href^="http://www.formspring.me/"]:not(.modelLink) ,
  li a[href^="https://camster.com/"]:not(.modelLink) ,
  li a[href^="https://fancentro.com/"]:not(.modelLink) ,
  li a[href^="https://streamate.com/"]:not(.modelLink) ,
  li a[href^="http://netvideogirls.net/"]:not(.modelLink) ,
  li a[href^="http://netvideogirls.org/"]:not(.modelLink) ,
  li a[href^="http://www.allgirlannihilation.net/"]:not(.modelLink) ,
  li a[href^="http://www.bestofelsajean.com/"]:not(.modelLink) ,
  li a[href^="http://www.eroticax.com/"]:not(.modelLink) ,
  li a[href^="http://www.hdglamcore.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornofilm.com.ua/"]:not(.modelLink) ,
  li a[href^="https://creampie.themedporn.com/"]:not(.modelLink) ,
  li a[href^="https://petite.themedporn.com/"]:not(.modelLink) ,
  li a[href^="https://www.cult69.com/"]:not(.modelLink) ,
  li a[href^="http://fuckassonline.com/"]:not(.modelLink) ,
  li a[href^="http://www.christophe-clark-euro-angels.com/"]:not(.modelLink) ,
  li a[href^="http://www.loadmymouth.com"]:not(.modelLink) ,
  li a[href^="http://www.pornstarnetwork.com/"]:not(.modelLink) ,
  li a[href^="http://bestporngallery.com/"]:not(.modelLink) ,
  li a[href^="http://hbl.thumblogger.com/"]:not(.modelLink) ,
  li a[href^="http://ifayevalentine.com/"]:not(.modelLink) ,
  li a[href^="http://www.fayereagan.net/"]:not(.modelLink) ,
  li a[href^="http://www.oinkporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.playwithfaye.com/"]:not(.modelLink) ,
  li a[href^="https://vrporncat.com/"]:not(.modelLink) ,
  li a[href^="http://blog.peeshark.com/"]:not(.modelLink) ,
  li a[href^="http://cumaslube.com/"]:not(.modelLink) ,
  li a[href^="http://kstephenstalent.com/"]:not(.modelLink) ,
  li a[href^="http://miami.type9models.com/"]:not(.modelLink) ,
  li a[href^="http://princesscum.com/"]:not(.modelLink) ,
  li a[href^="http://veronicarodriguez.org/"]:not(.modelLink) ,
  li a[href^="http://www.alsscan.com/"]:not(.modelLink) ,
  li a[href^="http://www.ama-worldwide.com/"]:not(.modelLink) ,
  li a[href^="http://www.aziani.com/"]:not(.modelLink) ,
  li a[href^="http://www.inkederotica.com/"]:not(.modelLink) ,
  li a[href^="http://www.sensuousstripteasers.com/"]:not(.modelLink) ,
  li a[href^="https://www.faponix.com/"]:not(.modelLink) ,
  li a[href^="http://fr.smartmovies.net/"]:not(.modelLink) ,
  li a[href^="http://www.101modeling.com/s"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls.com/"]:not(.modelLink) ,
  li a[href^="http://3x-sites.net/"]:not(.modelLink) ,
  li a[href^="https://www.philavise.com/"]:not(.modelLink) ,
  li a[href^="http://html.sxx.com/"]:not(.modelLink) ,
  li a[href^="http://myteenvideo.com/"]:not(.modelLink) ,
  li a[href^="http://www.18closeup.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenscoreclub.com/"]:not(.modelLink) ,
  li a[href^="http://www.freevideo.cz/"]:not(.modelLink) ,
  li a[href^="http://www.artcore-cafe.com/"]:not(.modelLink) ,
  li a[href^="http://www.coedcherry.com/"]:not(.modelLink) ,
  li a[href^="http://www.eurobeauty.net/"]:not(.modelLink) ,
  li a[href^="http://www.sapphic-movies.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.alsscan.com/"]:not(.modelLink) ,
  li a[href^="http://www.onlycuties.net/"]:not(.modelLink) ,
  li a[href^="http://www.porn-o-blog.com/"]:not(.modelLink) ,
  li a[href^="http://www.models.ferronetwork.com/"]:not(.modelLink) ,
  li a[href^="http://access.sexart.com/"]:not(.modelLink) ,
  li a[href^="http://www.abbywinters.com/"]:not(.modelLink) ,
  li a[href^="http://www.amarnamiller.com/"]:not(.modelLink) ,
  li a[href^="http://www.suckthecherry.com/"]:not(.modelLink) ,
  li a[href^="https://boobs.website/"]:not(.modelLink) ,
  li a[href^="http://1by-day.com/"]:not(.modelLink) ,
  li a[href^="http://1passforallsites.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://bodyinmind.com/"]:not(.modelLink) ,
  li a[href^="http://private-girls.net/"]:not(.modelLink) ,
  li a[href^="http://theemilybloom.com/"]:not(.modelLink) ,
  li a[href^="http://www.mplstudios.com/"]:not(.modelLink) ,
  li a[href^="https://beeg.com/"]:not(.modelLink) ,
  li a[href^="https://denudeart.com/"]:not(.modelLink) ,
  li a[href^="https://m.youtube.com/watch?v=WirdKJ_-vAE"]:not(.modelLink) ,
  li a[href^="http://mynakeddolls.com/"]:not(.modelLink) ,
  li a[href^="http://psp.herhd.com/"]:not(.modelLink) ,
  li a[href^="http://www.hdporn.cc/"]:not(.modelLink) ,
  li a[href^="http://www.societysm.com/"]:not(.modelLink) ,
  li a[href^="https://clips4sale.com/"]:not(.modelLink) ,
  li a[href^="https://erotella.com/"]:not(.modelLink) ,
  li a[href^="http://21sextreme.com/"]:not(.modelLink) ,
  li a[href^="https://iwantclips.com/"]:not(.modelLink) ,
  li a[href^="http://vrporncat.com/"]:not(.modelLink) ,
  li a[href^="http://beautystars.net/"]:not(.modelLink) ,
  li a[href^="http://melvin.ddfprod.com/"]:not(.modelLink) ,
  li a[href^="http://sexandcash.com/"]:not(.modelLink) ,
  li a[href^="http://www.clubsandynews.com/"]:not(.modelLink) ,
  li a[href^="http://www.abc-celebs.com/"]:not(.modelLink) ,
  li a[href^="http://www.poornstars.net/"]:not(.modelLink) ,
  li a[href^="http://babes.joejet.com/"]:not(.modelLink) ,
  li a[href^="http://barelylegal.com/"]:not(.modelLink) ,
  li a[href^="http://ero-love.com/"]:not(.modelLink) ,
  li a[href^="http://givemegirls.net/"]:not(.modelLink) ,
  li a[href^="http://justcelebrityporn.com/"]:not(.modelLink) ,
  li a[href^="http://pps.glamourmodelsgonebad.com/"]:not(.modelLink) ,
  li a[href^="http://tgp.inthecrack.com/"]:not(.modelLink) ,
  li a[href^="http://www.adultfanclubs.net/"]:not(.modelLink) ,
  li a[href^="http://www.morazzia.com/"]:not(.modelLink) ,
  li a[href^="http://www.silkengirl.com/"]:not(.modelLink) ,
  li a[href^="http://www.yourdirtymind.com/"]:not(.modelLink) ,
  li a[href^="http://erobank.ru/"]:not(.modelLink) ,
  li a[href^="http://www.youngheaven.com/"]:not(.modelLink) ,
  li a[href^="http://fpfreegals.com/"]:not(.modelLink) ,
  li a[href^="http://www.phblog.com/"]:not(.modelLink) ,
  li a[href^="http://www.rgsex.com/"]:not(.modelLink) ,
  li a[href^="http://www.sapphicjoy.com/"]:not(.modelLink) ,
  li a[href^="http://justnudeteens.com/"]:not(.modelLink) ,
  li a[href^="http://hosted.met-art.com/"]:not(.modelLink) ,
  li a[href^="http://www.zemani.com/"]:not(.modelLink) ,
  li a[href^="http://artnudegalleries.com/"]:not(.modelLink) ,
  li a[href^="http://newlineporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornex.com/"]:not(.modelLink) ,
  li a[href^="http://18magazine.com/"]:not(.modelLink) ,
  li a[href^="http://allpornmodels.com/"]:not(.modelLink) ,
  li a[href^="http://fuskator.com/"]:not(.modelLink) ,
  li a[href^="http://ibrookeadams.com/"]:not(.modelLink) ,
  li a[href^="http://leggingsandspandex"]:not(.modelLink) ,
  li a[href^="http://www.atkgallery.com/"]:not(.modelLink) ,
  li a[href^="http://www.brookeleeadams.net"]:not(.modelLink) ,
  li a[href^="http://www.hottystop.com/"]:not(.modelLink) ,
  li a[href^="http://www.lamalinks.com/"]:not(.modelLink) ,
  li a[href^="http://www.yourdailygirls.com/"]:not(.modelLink) ,
  li a[href^="https://www.kink.com/"]:not(.modelLink) ,
  li a[href^="http://www.showybeauty.com/"]:not(.modelLink) ,
  li a[href^="http://bestchicas.com/"]:not(.modelLink) ,
  li a[href^="http://420camgirl.tumblr.com/"]:not(.modelLink) ,
  li a[href^="http://instagram.com/"]:not(.modelLink) ,
  li a[href^="http://timdir.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://allover30free.com/"]:not(.modelLink) ,
  li a[href^="http://dbnaked.com/"]:not(.modelLink) ,
  li a[href^="http://dothewife.com/"]:not(.modelLink) ,
  li a[href^="http://www.ao30free.com/"]:not(.modelLink) ,
  li a[href^="http://www.mature.nl/"]:not(.modelLink) ,
  li a[href^="http://alexander.fedorovhd.com/"]:not(.modelLink) ,
  li a[href^="http://www.andys-collection.com/"]:not(.modelLink) ,
  li a[href^="http://www.fedorovhd.com/"]:not(.modelLink) ,
  li a[href^="https://www.girlslikepee.com"]:not(.modelLink) ,
  li a[href^="http://www.adults-only.com/"]:not(.modelLink) ,
  li a[href^="http://www.amateurcreampies.com/"]:not(.modelLink) ,
  li a[href^="http://www.max-hardcore.com/"]:not(.modelLink) ,
  li a[href^="http://brattysis.com/"]:not(.modelLink) ,
  li a[href^="https://hookuphotshot.com/"]:not(.modelLink) ,
  li a[href^="https://www.tushy.com/"]:not(.modelLink) ,
  li a[href^="http://t.co/exb4TWgMhO"]:not(.modelLink) ,
  li a[href^="http://www.secrets-art.com/"]:not(.modelLink) ,
  li a[href^="http://www.wowporngirls.com/"]:not(.modelLink) ,
  li a[href^="https://theredfoxlife.com/"]:not(.modelLink) ,
  li a[href^="https://www.dorcelclub.com/"]:not(.modelLink) ,
  li a[href^="https://www.sexart.com/"]:not(.modelLink) ,
  li a[href^="http://access.met-art.com/"]:not(.modelLink) ,
  li a[href^="http://www.beltbound.com/"]:not(.modelLink) ,
  li a[href^="http://www.foxycombat.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.metartx.com/"]:not(.modelLink) ,
  li a[href^="https://www.metartx.com/"]:not(.modelLink) ,
  li a[href^="http://www.clubseventeen.com/"]:not(.modelLink) ,
  li a[href^="http://www.wowgirlsblog.com/"]:not(.modelLink) ,
  li a[href^="http://www.wowporn.xxx/"]:not(.modelLink) ,
  li a[href^="http://capricavalli.org/"]:not(.modelLink) ,
  li a[href^="http://www.myerovideos.com/"]:not(.modelLink) ,
  li a[href^="http://x-art.com/"]:not(.modelLink) ,
  li a[href^="https://www.hollyrandall.com/"]:not(.modelLink) ,
  li a[href^="http://www.digitaldesire.com/"]:not(.modelLink) ,
  li a[href^="http://www.eroticartfan.com/"]:not(.modelLink) ,
  li a[href^="http://driverxxx.com/"]:not(.modelLink) ,
  li a[href^="http://www.drivers.xxx/"]:not(.modelLink) ,
  li a[href^="http://www.europornstarpics.com/"]:not(.modelLink) ,
  li a[href^="http://www.cruisinggirls.net/"]:not(.modelLink) ,
  li a[href^="http://www.ddfcash.com/"]:not(.modelLink) ,
  li a[href^="http://18pussyclub.com/"]:not(.modelLink) ,
  li a[href^="http://movs.ufobucks.com/"]:not(.modelLink) ,
  li a[href^="http://my18teens.com/"]:not(.modelLink) ,
  li a[href^="http://pics.ufobucks.com/"]:not(.modelLink) ,
  li a[href^="http://redlinesporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.doubleviewcasting.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornonlyzone.com/"]:not(.modelLink) ,
  li a[href^="http://youngrussiangirls.pornblogs.com/"]:not(.modelLink) ,
  li a[href^="http://fuckinhd.com/"]:not(.modelLink) ,
  li a[href^="http://hotlegsandfeet.com/"]:not(.modelLink) ,
  li a[href^="http://lifeselector.com/"]:not(.modelLink) ,
  li a[href^="http://onlyblowjob.com/"]:not(.modelLink) ,
  li a[href^="http://sexvideocasting.com/"]:not(.modelLink) ,
  li a[href^="http://www.analintroductions.com/"]:not(.modelLink) ,
  li a[href^="http://www.private.com/"]:not(.modelLink) ,
  li a[href^="http://www.shemadeuslesbians.com/"]:not(.modelLink) ,
  li a[href^="http://www.sindrive.com/"]:not(.modelLink) ,
  li a[href^="http://xtime.tv/"]:not(.modelLink) ,
  li a[href^="http://cosmid.net/"]:not(.modelLink) ,
  li a[href^="http://www.type9models.com/"]:not(.modelLink) ,
  li a[href^="http://www.playvid.com/"]:not(.modelLink) ,
  li a[href^="http://sexytimegalleries.com/"]:not(.modelLink) ,
  li a[href^="http://review21sextury.com/"]:not(.modelLink) ,
  li a[href^="http://pornstar-webrings.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://august-ames.pornstar-search"]:not(.modelLink) ,
  li a[href^="http://www.brazzersnetwork"]:not(.modelLink) ,
  li a[href^="http://castingcouch-x"]:not(.modelLink) ,
  li a[href^="http://fantasyhd"]:not(.modelLink) ,
  li a[href^="http://povd.com/girls/"]:not(.modelLink) ,
  li a[href^="http://spizoo"]:not(.modelLink) ,
  li a[href^="http://www.allgirlmassage"]:not(.modelLink) ,
  li a[href^="http://www.badoink"]:not(.modelLink) ,
  li a[href^="http://www.bangbrosnetwork"]:not(.modelLink) ,
  li a[href^="http://www.bikinibabes69"]:not(.modelLink) ,
  li a[href^="http://www.devilsfilm"]:not(.modelLink) ,
  li a[href^="http://www.julesjordan"]:not(.modelLink) ,
  li a[href^="http://www.kin8tengoku"]:not(.modelLink) ,
  li a[href^="http://www.pornprosnetwork"]:not(.modelLink) ,
  li a[href^="http://www.realityjunkies"]:not(.modelLink) ,
  li a[href^="http://www.taboohandjobs"]:not(.modelLink) ,
  li a[href^="http://www.viparea"]:not(.modelLink) ,
  li a[href^="http://www.famehosted"]:not(.modelLink) ,
  li a[href^="http://gallys.18eighteen"]:not(.modelLink) ,
  li a[href^="http://www.clublialor"]:not(.modelLink) ,
  li a[href^="http://www.teenfidelity"]:not(.modelLink) ,
  li a[href^="http://fuckedhard18"]:not(.modelLink) ,
  li a[href^="http://hustlercash"]:not(.modelLink) ,
  li a[href^="http://www.footfetishdaily"]:not(.modelLink) ,
  li a[href^="https://www.ftvmilfs"]:not(.modelLink) ,
  li a[href^="https://cdn.ftvmilfs"]:not(.modelLink) ,
  li a[href^="http://www.wannawatch"]:not(.modelLink) ,
  li a[href^="http://gallys.muffia"]:not(.modelLink) ,
  li a[href^="http://meatforcash"]:not(.modelLink) ,
  li a[href^="http://mygals.teenyvids"]:not(.modelLink) ,
  li a[href^="http://nudefightclub/"]:not(.modelLink) ,
  li a[href^="http://pornpassforall"]:not(.modelLink) ,
  li a[href^="http://promo.whippedass"]:not(.modelLink) ,
  li a[href^="http://ww4.viewpornstars"]:not(.modelLink) ,
  li a[href^="http://www.empflix"]:not(.modelLink) ,
  li a[href^="http://www.eurobabepics"]:not(.modelLink) ,
  li a[href^="http://www.fetishglobe"]:not(.modelLink) ,
  li a[href^="http://www.gonzo-news"]:not(.modelLink) ,
  li a[href^="http://www.hard-sexslaves-movies"]:not(.modelLink) ,
  li a[href^="http://www.indexxxed"]:not(.modelLink) ,
  li a[href^="http://www.jimslip.com/"]:not(.modelLink) ,
  li a[href^="http://www.party-hardcore.info/"]:not(.modelLink) ,
  li a[href^="http://www.sexydollsandrobots"]:not(.modelLink) ,
  li a[href^="https://www.perfectgonzo"]:not(.modelLink) ,
  li a[href^="http://skyntalent"]:not(.modelLink) ,
  li a[href^="http://www.pornfidelity"]:not(.modelLink) ,
  li a[href^="https://exploitedcollegegirls"]:not(.modelLink) ,
  li a[href^="http://www.sexyteenie"]:not(.modelLink) ,
  li a[href^="http://www.smackmybitch"]:not(.modelLink) ,
  li a[href^="http://fapto.us/"]:not(.modelLink) ,
  li a[href^="http://i-lexibelle"]:not(.modelLink) ,
  li a[href^="http://www.angelicpeaches"]:not(.modelLink) ,
  li a[href^="http://www.lexibelleclub"]:not(.modelLink) ,
  li a[href^="http://www.naughtymag"]:not(.modelLink) ,
  li a[href^="http://www.nsfwmodels"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www.nudeinpublicblog.com/"]:not(.modelLink) ,
  li a[href^="http://channels.barepass.com/"]:not(.modelLink) ,
  li a[href^="http://eurobabecumshots.tumblr"]:not(.modelLink) ,
  li a[href^="http://lioness.wowporn"]:not(.modelLink) ,
  li a[href^="http://livestrip.net/"]:not(.modelLink) ,
  li a[href^="http://teens-legshow"]:not(.modelLink) ,
  li a[href^="http://www.ifuckedherfinally"]:not(.modelLink) ,
  li a[href^="http://www.img.socadvnet"]:not(.modelLink) ,
  li a[href^="http://www.kimholland.nl/"]:not(.modelLink) ,
  li a[href^="http://www.sexyones.com/"]:not(.modelLink) ,
  li a[href^="http://www.virtualrealitychannel"]:not(.modelLink) ,
  li a[href^="http://www.visit-x.com/"]:not(.modelLink) ,
  li a[href^="http://www.webanzeigen.at/"]:not(.modelLink) ,
  li a[href^="http://www.twistysgalleries.info/"]:not(.modelLink) ,
  li a[href^="http://tobia.pimpsblogger"]:not(.modelLink) ,
  li a[href^="http://ferr-art.com/"]:not(.modelLink) ,
  li a[href^="http://kimberleexxx"]:not(.modelLink) ,
  li a[href^="http://princesskimber"]:not(.modelLink) ,
  li a[href^="http://64.72.117.90/"]:not(.modelLink) ,
  li a[href^="http://eonsex"]:not(.modelLink) ,
  li a[href^="http://eroticgalleryscanner.blogspot"]:not(.modelLink) ,
  li a[href^="http://iangeldark"]:not(.modelLink) ,
  li a[href^="http://www.flixerz"]:not(.modelLink) ,
  li a[href^="http://www.axelleparker"]:not(.modelLink) ,
  li a[href^="http://www.girlsinsexycostumes"]:not(.modelLink) ,
  li a[href^="https://www.onlytease"]:not(.modelLink) ,
  li a[href^="http://www.sweet-sin"]:not(.modelLink) ,
  li a[href^="http://www.shootmorecum"]:not(.modelLink) ,
  li a[href^="http://www.exquisiteangelz"]:not(.modelLink) ,
  li a[href^="http://www.freepornofreeporn"]:not(.modelLink) ,
  li a[href^="http://www.hot-euro-babes"]:not(.modelLink) ,
  li a[href^="http://www.pornstarvixen"]:not(.modelLink) ,
  li a[href^="http://www.ftvgirls"]:not(.modelLink) ,
  li a[href^="http://www.trueamateurmodels"]:not(.modelLink) ,
  li a[href^="https://porndoepremium/"]:not(.modelLink) ,
  li a[href^="http://promo.sheercity"]:not(.modelLink) ,
  li a[href^="https://eastcoasttalents"]:not(.modelLink) ,
  li a[href^="http://www.imagepost"]:not(.modelLink) ,
  li a[href^="http://adultlabs"]:not(.modelLink) ,
  li a[href^="http://www.gingerlust.com/"]:not(.modelLink) ,
  li a[href^="http://www.facebook.com/"]:not(.modelLink) ,
  li a[href^="http://adultlabs.com/"]:not(.modelLink) ,
  li a[href^="http://maliystig.com/"]:not(.modelLink) ,
  li a[href^="http://pics.euroteenmovs.com/"]:not(.modelLink) ,
  li a[href^="http://www.filthyway.com/"]:not(.modelLink) ,
  li a[href^="http://www.nudesportsblog.com/"]:not(.modelLink) ,
  li a[href^="http://z.tryteenz.com/"]:not(.modelLink) ,
  li a[href^="http://exclusiveteenporn.com/"]:not(.modelLink) ,
  li a[href^="http://www.superpornpics.com/"]:not(.modelLink) ,
  li a[href^="http://www.wakeupnfuck.com/"]:not(.modelLink) ,
  li a[href^="http://www.hollyrandall.com/"]:not(.modelLink) ,
  li a[href^="http://www.girlslikepee.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://aerotic.net/"]:not(.modelLink) ,
  li a[href^="http://gallys.realitykings.com/"]:not(.modelLink) ,
  li a[href^="http://www.black-vixen.com/"]:not(.modelLink) ,
  li a[href^="http://www.britishlust.com/"]:not(.modelLink) ,
  li a[href^="http://www.britishlust.com/"]:not(.modelLink) ,
  li a[href^="http://killergram.com/"]:not(.modelLink) ,
  li a[href^="https://www.pornstarslounge"]:not(.modelLink) ,
  li a[href^="http://www.pornstarslounge"]:not(.modelLink) ,
  li a[href^="http://www.killergram-babes.com/"]:not(.modelLink) ,
  li a[href^="https://www.youtube.com/"]:not(.modelLink) ,
  li a[href^="http://www.littlethumbs.com/"]:not(.modelLink) ,
  li a[href^="http://pornmastermind.com/"]:not(.modelLink) ,
  li a[href^="http://www.lovenialux.com/"]:not(.modelLink) ,
  li a[href^="http://picsporner.com/"]:not(.modelLink) ,
  li a[href^="http://pornstars.nexxxt.biz/"]:not(.modelLink) ,
  li a[href^="http://1337fetish.com/"]:not(.modelLink) ,
  li a[href^="http://www.dreamlover.com/"]:not(.modelLink) ,
  li a[href^="http://galleries2.ftvcash.com/"]:not(.modelLink) ,
  li a[href^="http://www.legalporno.com/"]:not(.modelLink) ,
  li a[href^="https://tiffanydolltube.com/"]:not(.modelLink) ,
  li a[href^="http://www.frenchlust.com/"]:not(.modelLink) ,
  li a[href^="http://eroticx.easyxtubes.com/"]:not(.modelLink) ,
  li a[href^="http://janetmason.net/"]:not(.modelLink) ,
  li a[href^="http://house-of-hughes.com/"]:not(.modelLink) ,
  li a[href^="http://www.ellahughesofficial.com/"]:not(.modelLink) ,
  li a[href^="http://www.purestorm.com/"]:not(.modelLink) ,
  li a[href^="http://www.youkandy.com/"]:not(.modelLink) ,
  li a[href^="https://house-of-hughes.com/"]:not(.modelLink) ,
  li a[href^="https://snapcentro.com/"]:not(.modelLink) ,
  li a[href^="https://www.seesnaps.com/"]:not(.modelLink) ,
  li a[href^="http://sinfulgoddesses.com/"]:not(.modelLink) ,
  li a[href^="http://girls.twistys.com/"]:not(.modelLink) ,
  li a[href^="http://www.centerfoldlove.net/"]:not(.modelLink) ,
  li a[href^="http://www.clubcamicole.com/"]:not(.modelLink) ,
  li a[href^="http://www.fhuqme.com/"]:not(.modelLink) ,
  li a[href^="http://www.tubepornfilm.com/"]:not(.modelLink) ,
  li a[href^="http://thevipconnect.com/"]:not(.modelLink) ,
  li a[href^="http://www.lanasbigboobs.com/"]:not(.modelLink) ,
  li a[href^="http://www.tattoobabes.net/"]:not(.modelLink) ,
  li a[href^="https://www.clips4sale.com/"]:not(.modelLink) ,
  li a[href^="http://fuckedhard18.net/"]:not(.modelLink) ,
  li a[href^="http://massagegirls18.com/"]:not(.modelLink) ,
  li a[href^="http://pornpaysites.net/"]:not(.modelLink) ,
  li a[href^="http://www.1spicyblog.com/"]:not(.modelLink) ,
  li a[href^="http://www.exploitedcollegegirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.girlsnaked.net/"]:not(.modelLink) ,
  li a[href^="http://hostave4.net/"]:not(.modelLink) ,
  li a[href^="http://www.exclusiveteenporn.com/"]:not(.modelLink) ,
  li a[href^="https://www.clubseventeen.com/"]:not(.modelLink) ,
  li a[href^="http://www.xoteens.com/"]:not(.modelLink) ,
  li a[href^="http://tools.lazonamodelos.com/"]:not(.modelLink) ,
  li a[href^="http://ddfcash.com/"]:not(.modelLink) ,
  li a[href^="http://galleries5.petiteteenager.com/"]:not(.modelLink) ,
  li a[href^="http://www.galleries.8teenkitties.com/"]:not(.modelLink) ,
  li a[href^="http://tools.latinteenpass.com/"]:not(.modelLink) ,
  li a[href^="http://www.galleries.8teenkitties.com/"]:not(.modelLink) ,
  li a[href^="http://www.karups-gallery.com/"]:not(.modelLink) ,
  li a[href^="http://www.lingerie-videos.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornhost.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenporngallery.net/"]:not(.modelLink) ,
  li a[href^="http://nexxxt.biz/"]:not(.modelLink) ,
  li a[href^="http://21sextury.com/"]:not(.modelLink) ,
  li a[href^="http://anilos.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://momsteachsex.com/"]:not(.modelLink) ,
  li a[href^="http://www.celebritybeauties.net/"]:not(.modelLink) ,
  li a[href^="http://sb1a892deml."]:not(.modelLink) ,
  li a[href^="http://members.evilangel.com/"]:not(.modelLink) ,
  li a[href^="http://barechicks.net/"]:not(.modelLink) ,
  li a[href^="http://hdsex18.com/"]:not(.modelLink) ,
  li a[href^="http://hornyanalsex.com/"]:not(.modelLink) ,
  li a[href^="http://young-legal.com/"]:not(.modelLink) ,
  li a[href^="http://www2.cleanadulthost.com/"]:not(.modelLink) ,
  li a[href^="http://www.sapphic.tv/"]:not(.modelLink) ,
  li a[href^="http://www.internetmodels.ws/"]:not(.modelLink) ,
  li a[href^="http://www.anotherbabe.com/"]:not(.modelLink) ,
  li a[href^="https://latinachicks.com/"]:not(.modelLink) ,
  li a[href^="https://www.coedcherry.com/"]:not(.modelLink) ,
  li a[href^="http://www.gigiriveraporn.com"]:not(.modelLink) ,
  li a[href^="http://nud3.com/"]:not(.modelLink) ,
  li a[href^="http://www.awmdb.com/"]:not(.modelLink) ,
  li a[href^="http://www.clubmelaniejane.com/"]:not(.modelLink) ,
  li a[href^="http://www.melanierios.com/"]:not(.modelLink) ,
  li a[href^="http://www.lesbianbabelog.com/"]:not(.modelLink) ,
  li a[href^="http://www.fistfan.com/"]:not(.modelLink) ,
  li a[href^="http://melanierios.xxxstarblogs.com/"]:not(.modelLink) ,
  li a[href^="http://gallys.rk.com/"]:not(.modelLink) ,
  li a[href^="http://ivywinters.org/"]:not(.modelLink) ,
  li a[href^="http://bohemiaescort.com/"]:not(.modelLink) ,
  li a[href^="http://nicenudegirls.org/"]:not(.modelLink) ,
  li a[href^="http://russianmistress.femdomworld.com/"]:not(.modelLink) ,
  li a[href^="http://tour.teendreams.com/"]:not(.modelLink) ,
  li a[href^="http://www.artnudegalleries.com/"]:not(.modelLink) ,
  li a[href^="http://www.atkmodels.com/"]:not(.modelLink) ,
  li a[href^="http://www.famedigital.com/"]:not(.modelLink) ,
  li a[href^="http://www.teendreams.com/"]:not(.modelLink) ,
  li a[href^="http://www.tainster.com/"]:not(.modelLink) ,
  li a[href^="http://www.realitykings.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornparodies.com/"]:not(.modelLink) ,
  li a[href^="http://www.ladirectmodels.com/"]:not(.modelLink) ,
  li a[href^="http://www.kinkondemand.com/"]:not(.modelLink) ,
  li a[href^="http://www.interracialfan.com/"]:not(.modelLink) ,
  li a[href^="http://www.glamcorebabes.com/"]:not(.modelLink) ,
  li a[href^="http://www.blacksonblondes.com/"]:not(.modelLink) ,
  li a[href^="http://porndoo.com/"]:not(.modelLink) ,
  li a[href^="http://nprcompany.ru/"]:not(.modelLink) ,
  li a[href^="http://nfbusty.com/"]:not(.modelLink) ,
  li a[href^="http://milfs-models.com/"]:not(.modelLink) ,
  li a[href^="http://astuff.org/"]:not(.modelLink) ,
  li a[href^="http://anissakate.erolog.org"]:not(.modelLink) ,
  li a[href^="http://ddfnetwork.com/"]:not(.modelLink) ,
  li a[href^="http://es2.karupspc.com/"]:not(.modelLink) ,
  li a[href^="http://pornvideosaz.com/"]:not(.modelLink) ,
  li a[href^="http://whiteteensblackcocks.com/"]:not(.modelLink) ,
  li a[href^="http://www.imagefap.com/"]:not(.modelLink) ,
  li a[href^="http://www.ricksflicks.com/"]:not(.modelLink) ,
  li a[href^="http://www.russian-babes.net/"]:not(.modelLink) ,
  li a[href^="http://www.triplexgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://www.wetandpuffy.com/"]:not(.modelLink) ,
  li a[href^="http://xcoreclub.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://sasharosetube.com/"]:not(.modelLink) ,
  li a[href^="http://www.teenmodels.com"]:not(.modelLink) ,
  li a[href^="http://porntubered.com/"]:not(.modelLink) ,
  li a[href^="http://wearehairyfree.com/"]:not(.modelLink) ,
  li a[href^="http://www.wearehairy.com/"]:not(.modelLink) ,
  li a[href^="http://www.spankingthem.com/"]:not(.modelLink) ,
  li a[href^="http://katzpawclub.com/"]:not(.modelLink) ,
  li a[href^="https://www.metart.com/"]:not(.modelLink) ,
  li a[href^="https://www.freepornhq.xxx/"]:not(.modelLink) ,
  li a[href^="https://screwbox.com/"]:not(.modelLink) ,
  li a[href^="https://fhg.met-art.com/"]:not(.modelLink) ,
  li a[href^="http://www.girlsgonewild.com/"]:not(.modelLink) ,
  li a[href^="http://www.newsensations.com/"]:not(.modelLink) ,
  li a[href^="http://www.freepornhq.xxx/"]:not(.modelLink) ,
  li a[href^="http://www.epicnudes.com/"]:not(.modelLink) ,
  li a[href^="http://www.daporn.com/"]:not(.modelLink) ,
  li a[href^="http://pornstars.erolog.org/"]:not(.modelLink) ,
  li a[href^="http://en.kin8tengoku.com/"]:not(.modelLink) ,
  li a[href^="http://houseoftaboo.com/"]:not(.modelLink) ,
  li a[href^="http://handsonhardcore.com/"]:not(.modelLink) ,
  li a[href^="http://glovemansion.com/"]:not(.modelLink) ,
  li a[href^="http://gapeland.com/"]:not(.modelLink) ,
  li a[href^="http://doubleviewcasting.com/"]:not(.modelLink) ,
  li a[href^="http://eroticclips.net/"]:not(.modelLink) ,
  li a[href^="http://clips4sale.com/"]:not(.modelLink) ,
  li a[href^="http://domingoview.com/"]:not(.modelLink) ,
  li a[href^="http://peehunters.com/"]:not(.modelLink) ,
  li a[href^="http://www.lesbea.com/"]:not(.modelLink) ,
  li a[href^="http://www.jeansfun.de/"]:not(.modelLink) ,
  li a[href^="http://theartporn.com/"]:not(.modelLink) ,
  li a[href^="http://wowbeauty.net/"]:not(.modelLink) ,
  li a[href^="http://vrpornjack.com/"]:not(.modelLink) ,
  li a[href^="http://www.18eighteen.com/"]:not(.modelLink) ,
  li a[href^="http://www.angel3.it/"]:not(.modelLink) ,
  li a[href^="http://www.danejones.com/"]:not(.modelLink) ,
  li a[href^="http://www.eurobabecumshots.com/"]:not(.modelLink) ,
  li a[href^="http://russianteenblog.com/"]:not(.modelLink) ,
  li a[href^="http://www.doghousedigital.com/"]:not(.modelLink) ,
  li a[href^="http://www.xxxvideoz.net/"]:not(.modelLink) ,
  li a[href^="http://www.xxx-stream.com/"]:not(.modelLink) ,
  li a[href^="https://www.google.de/search?q="]:not(.modelLink) ,
  li a[href^="http://www.ustream.tv/"]:not(.modelLink) ,
  li a[href^="http://www.thejeansnet.com/"]:not(.modelLink) ,
  li a[href^="http://www.subspaceland.com"]:not(.modelLink) ,
  li a[href^="http://www.stunning18.com/"]:not(.modelLink) ,
  li a[href^="http://www.orgasms.xxx/"]:not(.modelLink) ,
  li a[href^="http://digicreationsxxx.com/"]:not(.modelLink) ,
  li a[href^="http://www.sexart.com/"]:not(.modelLink) ,
  li a[href^="http://www.eurobabefacials.com/"]:not(.modelLink) ,
  li a[href^="http://www.cherrynudes.com/"]:not(.modelLink) ,
  li a[href^="http://www.czechlust.com/"]:not(.modelLink) ,
  li a[href^="http://www.wethd.com/"]:not(.modelLink) ,
  li a[href^="http://youngsexparties.com/"]:not(.modelLink) ,
  li a[href^="http://xxxfever.net/"]:not(.modelLink) ,
  li a[href^="http://www.webyoung.com/"]:not(.modelLink) ,
  li a[href^="http://beauty-angels.com/"]:not(.modelLink) ,
  li a[href^="http://guests.met-art.com/"]:not(.modelLink) ,
  li a[href^="http://teensanalyzed.com/"]:not(.modelLink) ,
  li a[href^="http://www.firstanaldate.com/?"]:not(.modelLink) ,
  li a[href^="http://nikkidelano.org/"]:not(.modelLink) ,
  li a[href^="http://www.christymackblog.com/"]:not(.modelLink) ,
  li a[href^="https://www.sextpanther.com/"]:not(.modelLink) ,
  li a[href^="https://www.camsoda.com/"]:not(.modelLink) ,
  li a[href^="https://onlyfans.com/"]:not(.modelLink) ,
  li a[href^="http://www.nsfwtgp.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="http://www4.kinghost.com/"]:not(.modelLink) ,
  li a[href^="http://www.only-sex-movies.com/"]:not(.modelLink) ,
  li a[href^="http://www.1passforallsites.com/"]:not(.modelLink) ,
  li a[href^="http://www.18onlygirlsblog.com/"]:not(.modelLink) ,
  li a[href^="http://photos.wowgirls.com/"]:not(.modelLink) ,
  li a[href^="Http://natalygoldtgp.russiansexsluts.com"]:not(.modelLink) ,
  li a[href^="http://fansofporn.com/"]:not(.modelLink) ,
  li a[href^="http://lioness.wowgirls.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.doubleteamedteens.com/"]:not(.modelLink) ,
  li a[href^="http://www.porn-o-rama.com/"]:not(.modelLink) ,
  li a[href^="http://signup.povbitch.com/"]:not(.modelLink) ,
  li a[href^="http://onlinegfs.com/"]:not(.modelLink) ,
  li a[href^="http://defyxxx.com/"]:not(.modelLink) ,
  li a[href^="http://www.babesandstars.com/"]:not(.modelLink) ,
  li a[href^="http://vanessalane.kagesdomain.com/"]:not(.modelLink) ,
  li a[href^="http://www.tgpit.com/"]:not(.modelLink) ,
  li a[href^="http://www.lusciouschicks.com/"]:not(.modelLink) ,
  li a[href^="http://www.eroberlin.com/"]:not(.modelLink) ,
  li a[href^="https://www.yonitale.com/"]:not(.modelLink) ,
  li a[href^="https://www.orgasmworldchampionship.com"]:not(.modelLink) ,
  li a[href^="http://www.wetandpissy.com/"]:not(.modelLink) ,
  li a[href^="http://www.vipissy.com/"]:not(.modelLink) ,
  li a[href^="http://www.slipperymassage.com/"]:not(.modelLink) ,
  li a[href^="http://www.seventeenvideo.com/"]:not(.modelLink) ,
  li a[href^="http://www.nsfwgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.erocurves.com/"]:not(.modelLink) ,
  li a[href^="http://webmasters.wetandpuffy.com/"]:not(.modelLink) ,
  li a[href^="http://teenpornstorage.com/"]:not(.modelLink) ,
  li a[href^="http://teengirl-pics.com/"]:not(.modelLink) ,
  li a[href^="http://free.18virginsex.com/"]:not(.modelLink) ,
  li a[href^="http://www.nsgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://pinkvisualhdgalleries.com/"]:not(.modelLink) ,
  li a[href^="http://zoomgirls.net/"]:not(.modelLink) ,
  li a[href^="http://www.eroticbunny.com/"]:not(.modelLink) ,
  li a[href^="http://reviewtwistys.com/"]:not(.modelLink) ,
  li a[href^="http://angelasommers.erolog.org"]:not(.modelLink) ,
  li a[href^="http://celebritybeauties.net/"]:not(.modelLink) ,
  li a[href^="http://www.porn-service.us/"]:not(.modelLink) ,
  li a[href^="http://www.younglegalpornblog.com/"]:not(.modelLink) ,
  li a[href^="http://www.wolrdteenparadise.com/"]:not(.modelLink) ,
  li a[href^="http://www.totallyundressed.com/"]:not(.modelLink) ,
  li a[href^="http://www.specialexamination.com/"]:not(.modelLink) ,
  li a[href^="http://www.sapphic-erotica.com/"]:not(.modelLink) ,
  li a[href^="http://www.ifgirls.com/"]:not(.modelLink) ,
  li a[href^="http://www.fuckingteenasses.com/"]:not(.modelLink) ,
  li a[href^="http://photos.18onlygirls.com/"]:not(.modelLink) ,
  li a[href^="http://pandafuck.com/"]:not(.modelLink) ,
  li a[href^="http://hosted.femjoy.com/"]:not(.modelLink) ,
  li a[href^="http://gals.teenmodels.com/"]:not(.modelLink) ,
  li a[href^="http://galleries.payserve.com/"]:not(.modelLink) ,
  li a[href^="https://www.streamate.com/"]:not(.modelLink) ,
  li a[href^="https://www.porngals4.com/"]:not(.modelLink) ,
  li a[href^="https://www.camcontacts.com/"]:not(.modelLink) ,
  li a[href^="http://www.kink.com/"]:not(.modelLink) ,
  li a[href^="http://www.interactivepornclub.com/"]:not(.modelLink) ,

  /* AAA - BOF BOF */
  li a[href^="https://pornstreamlive.com/"]:not(.modelLink) ,
  li a[href^="http://www.sandrashinehardcore.com/"]:not(.modelLink) ,
  li a[href^="http://www.prettybabes4u.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornstars-4-ever.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornstarlove.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornstar-sluts.net/"]:not(.modelLink) ,
  li a[href^="https://www.jizz.xxx/"]:not(.modelLink) ,
  li a[href^="https://www.czechvr.com/"]:not(.modelLink) ,
  li a[href^="http://www.sex-histories.net/"]:not(.modelLink) ,
  li a[href^="http://teencoreclub.com/"]:not(.modelLink) ,
  li a[href^="http://stepsiblingscaught.com/"]:not(.modelLink) ,
  li a[href^="http://petiteballerinasfucked.com/"]:not(.modelLink) ,
  li a[href^="http://beauty-teens.net/"]:not(.modelLink) ,
  li a[href^="http://www.colette.com/"]:not(.modelLink) ,
  li a[href^="https://smutblogr.com/"]:not(.modelLink) ,
  li a[href^="http://www.wetmee.com/"]:not(.modelLink) ,
  li a[href^="http://www.sexy-models.net/"]:not(.modelLink) ,
  li a[href^="http://www.phoenixmarie.net/"]:not(.modelLink) ,
  li a[href^="http://www.myspace.com/"]:not(.modelLink) ,
  li a[href^="http://www.mattsmodels.com/"]:not(.modelLink) ,
  li a[href^="http://ladirectmodels.com/"]:not(.modelLink) ,
  li a[href^="http://fap2porn.com/"]:not(.modelLink) ,
  li a[href^="http://christymack.org/"]:not(.modelLink) ,
  li a[href^="https://freepornaz.com/"]:not(.modelLink) ,
  li a[href^="http://www.oldje.com/"]:not(.modelLink) ,
  li a[href^="http://www.pornlowcost.com/"]:not(.modelLink) ,
  li a[href^="http://www.forbidden-dreams.com/"]:not(.modelLink) ,
  li a[href^="http://www.babemaze.com/"]:not(.modelLink) ,
  li a[href^="http://www.porn-star.com/"]:not(.modelLink) ,
  li a[href^="http://www.milfstalker.com/"]:not(.modelLink) ,
  li a[href^="http://www.starletsheet.com/"]:not(.modelLink) ,
  li a[href^="http://babeboob.com/"]:not(.modelLink) ,
  li a[href^="http://freepornaz.com/"]:not(.modelLink) {
      opacity: 0.3 !important;
      display: none !important;
      visibility: hidden !important;
      font-size: 0 !important;
  }



  `;
}
if ((location.hostname === "indexxx.com" || location.hostname.endsWith(".indexxx.com"))) {
  css += `
  /* SUPP - BOF - GENERIC */

  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,
  a[href*="BOF - GENERIC"i] ,


  /* AA - BOF - GENERIC */

  a[href*="hole"i] ,
  a[href*="/preview."]:not(.modelLink):not([href*="czechcasting"]):not(.modelLink) ,
  a[href*="promo"i]:not([href*="czechcasting"]):not(.modelLink) ,
  a[href*="hosted"i] ,
  a[href*="access"i] ,
  a[href*="trial"i] ,
  a[href*="tour"i] ,
  a[href*="signup"i] ,
  a[href*="affiliates"i] ,
  a[href*="join"i] ,


  a[href*="http://tour."i] ,
  a[href*="/tour/"i] ,
  a[href*="/PROMO/"i] ,
  li a[href*="coupon"]:not(.modelLink) ,
  li a[href^="http://free."i] ,
  li a[href^="http://signup."i] ,
  li a[href^="http://affiliates."i] ,
  li a[href^="https://join."i] ,
  li a[href^="http://join."i] ,
  li a[href^="http://galleries."]:not(.modelLink) ,
  li a[href^="http://gallery."]:not(.modelLink)  {
      opacity: 0.3 !important;
      display: none !important;
      visibility: hidden !important;
      font-size: 0 !important;
  }

  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

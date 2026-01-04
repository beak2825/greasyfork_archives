// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @version     1.30.9
// @description Customizations and fixes for MyAnimeList
// @author      KanashiiDev
// @match       https://myanimelist.net/*
// @match       https://www.mal-badges.com/users/*malbadges*
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/colorthief@2.6.0/dist/color-thief.min.js
// @require     https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/cjs/tinycolor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.2.5/dist/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/480965/MAL-Clean-JS.user.js
// @updateURL https://update.greasyfork.org/scripts/480965/MAL-Clean-JS.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2023-2025 KanashiiDev and the MAL-Clean-JS contributors
//
// SPDX-License-Identifier: GPL-3.0-or-later
/*
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	<https://www.gnu.org/licenses/>.
*/

// ==== settings.js ====
let defaultMal,
  settingsActive,
  settingsFounded,
  loadingMoreFavorites,
  loadingCustomCover = 0;
const current = location.pathname;
const entryTitle = $(".title-name").text()
  ? $(".title-name")
      .text()
      .replace(/\".*\" /, "")
  : document.title
      .replace(/(.*)(\|.*)/, "$1")
      .replace(/(.*)(\(.*\).*)/, "$1")
      .trim();
const entryType = current.split("/")[1].toUpperCase();
const entryId = current.split("/")[2];
const username = current.split("/")[2];
const headerUserName = $(".header-profile-link").text();
const userNotHeaderUser = username !== headerUserName;
const isMainProfilePage = /\/profile\/.*\/\w/gm.test(current) ? 0 : 1;
var stLink = create("a", { class: "malCleanSettingLink", id: "malCleanSettingLink" }, "MalClean Settings");
var stButton = create("li", { class: "malCleanSettingButton", id: "malCleanSettingButton" });

//Default Settings (not for userModules)
let svar = {
  animeBg: true,
  animeBlurredBg: false,
  animeBlurredBgBlur: 2.0,
  animeBlurredBgBrightness: 0.7,
  animeBlurredBgSaturate: 1.0,
  charBg: true,
  customCover: true,
  customCharacterCover: true,
  newComments: false,
  profileNewComments: false,
  moreFavs: true,
  moreFavsMode: true,
  peopleHeader: true,
  animeHeader: true,
  animeBanner: true,
  animeBannerMove: false,
  animeTag: true,
  categorizeTags: false,
  animeRelation: true,
  animeInfoDesign: false,
  relationFilter: false,
  animeSongs: true,
  characterHeader: true,
  characterNameAlt: true,
  profileHeader: false,
  customCSS: true,
  modernLayout: false,
  autoModernLayout: false,
  animeInfo: true,
  embed: true,
  embedForum: true,
  embedNews: false,
  currentlyWatching: true,
  currentlyReading: true,
  currentlyGrid: false,
  currentlyGrid6Column: false,
  currentlyGridAccordion: true,
  recentlyAddedAnime: true,
  recentlyAddedManga: true,
  recentlyGrid: false,
  recentlyGrid6Column: false,
  recentlyGridAccordion: true,
  recentlyAnimeFilter: "&genre_ex%5B%5D=12",
  recentlyMangaFilter: "&genre_ex%5B%5D=12",
  recentlyAnimeDefault: "TV,Movie",
  recentlyMangaDefault: "Manga",
  listAiringStatus: true,
  airingDate: true,
  autoAddDate: true,
  editPopup: true,
  forumDate: true,
  headerSlide: false,
  headerOpacity: true,
  replaceList: false,
  blogRedesign: false,
  blogContent: true,
  actHistory: true,
  profileAnimeGenre: true,
  profileMangaGenre: false,
  profileRemoveLeftSide: false,
  profileBannerGradient: true,
  moveBadges: false,
  clubComments: false,
  editorLivePreview: false,
  scrollbarStyle: false,
  scrollbarStyleWidth: 12,
  hideNonJapaneseAnime: false,
  currentLanguage: "English"
};

svar.save = function () {
  localStorage.setItem("maljsSettings", JSON.stringify(svar));
};
let svarSettings = null;

try {
  svarSettings = JSON.parse(localStorage.getItem("maljsSettings"));
} catch (e) {
  console.error("Error parsing localStorage data:", e);
}

if (!svarSettings) {
  svar.save();
} else {
  let keys = Object.keys(svarSettings);
  keys.forEach((key) => (svar[key] = svarSettings[key]));
}

function getSettings() {
  Object.keys(svar).forEach((setting) => {
    const btnId = setting.endsWith("Btn") ? setting : setting + "Btn";
    const btn = document.getElementById(btnId);

    const isExcluded = (setting === "headerSlide" || setting === "headerOpacity") && defaultMal;

    if (btn && typeof svar[setting] !== "undefined" && !isExcluded && btn.classList && !btn.classList.contains("disabled")) {
      btn.classList.toggle("btn-active", !!svar[setting]);
    }
  });
}

if (typeof jQuery === "undefined") {
  console.error("Mal-Clean-JS: jQuery not found, stopping...");
  throw new Error("Mal-Clean-JS: jQuery not found");
}


const purifyConfig = {
  FORBID_TAGS: ["script", "object", "embed", "frame", "frameset"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onmouseenter", "onmouseleave", "srcdoc"],
  ADD_TAGS: ["b", "i", "u", "strong", "em", "a", "img", "div", "span", "p", "ul", "ol", "li", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "td", "th", "video", "audio", "iframe", "source", "blockquote", "pre", "code"],
  ADD_ATTR: [ "frameborder", "sandbox", "allow", "href", "src", "alt", "title", "width", "height", "controls", "loop", "autoplay", "muted",
    "class", "id", "style", "target", "rel","colspan", "rowspan"],
  SAFE_FOR_JQUERY: true,
  KEEP_CONTENT: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

const purifyConfigText = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};

// ==== nonJapaneseIds.js ====
const nonJapaneseIds = [
  "548",
  "884",
  "960",
  "1776",
  "1778",
  "2133",
  "2141",
  "2756",
  "2884",
  "2941",
  "3151",
  "3252",
  "3772",
  "4069",
  "4099",
  "4147",
  "4189",
  "4544",
  "4801",
  "5129",
  "5469",
  "5496",
  "5636",
  "5889",
  "6150",
  "6156",
  "6505",
  "6523",
  "6524",
  "6609",
  "6616",
  "6671",
  "6695",
  "6855",
  "6902",
  "7377",
  "7395",
  "7420",
  "7477",
  "7504",
  "7522",
  "7752",
  "7900",
  "8081",
  "8783",
  "9106",
  "9200",
  "9254",
  "9416",
  "9417",
  "9424",
  "9433",
  "9447",
  "9501",
  "9521",
  "9558",
  "9770",
  "9806",
  "9817",
  "9818",
  "9819",
  "9822",
  "9868",
  "9948",
  "9949",
  "9950",
  "9951",
  "9955",
  "9956",
  "9973",
  "10132",
  "10194",
  "10237",
  "10259",
  "10623",
  "10723",
  "10763",
  "10869",
  "10882",
  "11357",
  "11543",
  "11835",
  "11841",
  "12035",
  "12145",
  "12917",
  "13365",
  "13755",
  "14781",
  "14821",
  "15479",
  "15905",
  "16027",
  "16399",
  "16490",
  "16506",
  "16552",
  "16554",
  "16556",
  "16558",
  "16560",
  "16562",
  "16564",
  "16566",
  "16568",
  "16570",
  "16572",
  "16620",
  "16696",
  "16746",
  "16748",
  "16752",
  "16754",
  "16756",
  "16778",
  "16780",
  "16784",
  "16786",
  "16790",
  "16794",
  "16796",
  "16798",
  "16800",
  "16802",
  "16804",
  "16806",
  "16808",
  "16810",
  "16812",
  "16816",
  "16818",
  "16820",
  "16822",
  "16824",
  "16828",
  "16834",
  "16838",
  "17086",
  "17088",
  "17090",
  "17092",
  "17100",
  "17106",
  "17233",
  "17893",
  "18271",
  "18273",
  "18283",
  "18301",
  "18303",
  "18305",
  "18307",
  "18309",
  "18311",
  "18313",
  "18317",
  "18325",
  "18327",
  "18329",
  "18331",
  "18447",
  "18489",
  "18491",
  "19501",
  "19547",
  "19687",
  "19781",
  "19839",
  "20713",
  "20945",
  "21025",
  "21027",
  "21081",
  "21129",
  "24875",
  "25149",
  "25173",
  "25589",
  "25963",
  "25977",
  "25985",
  "26199",
  "27463",
  "27465",
  "27467",
  "27811",
  "27825",
  "28235",
  "28251",
  "28673",
  "29087",
  "29089",
  "29623",
  "29857",
  "29876",
  "29886",
  "29910",
  "29935",
  "29936",
  "29937",
  "29961",
  "30048",
  "30051",
  "30052",
  "30053",
  "30058",
  "30060",
  "30095",
  "30096",
  "30097",
  "30098",
  "30099",
  "30134",
  "30156",
  "30166",
  "30193",
  "30228",
  "30247",
  "30249",
  "30267",
  "30278",
  "30412",
  "30519",
  "30534",
  "30886",
  "31150",
  "31205",
  "31233",
  "31246",
  "31299",
  "31348",
  "31427",
  "31499",
  "31534",
  "31673",
  "31678",
  "31691",
  "31698",
  "31700",
  "31730",
  "31838",
  "31892",
  "31893",
  "31898",
  "31965",
  "31972",
  "32136",
  "32152",
  "32221",
  "32230",
  "32269",
  "32270",
  "32323",
  "32534",
  "32543",
  "32566",
  "32613",
  "32668",
  "32691",
  "32751",
  "32807",
  "32808",
  "32809",
  "32818",
  "32819",
  "32820",
  "32821",
  "32889",
  "32890",
  "32933",
  "32936",
  "33019",
  "33038",
  "33193",
  "33194",
  "33195",
  "33196",
  "33209",
  "33237",
  "33238",
  "33258",
  "33266",
  "33267",
  "33271",
  "33272",
  "33278",
  "33279",
  "33305",
  "33309",
  "33350",
  "33357",
  "33383",
  "33396",
  "33421",
  "33430",
  "33443",
  "33446",
  "33508",
  "33562",
  "33583",
  "33602",
  "33603",
  "33604",
  "33605",
  "33630",
  "33702",
  "33703",
  "33704",
  "33706",
  "33739",
  "33753",
  "33756",
  "33757",
  "33758",
  "33759",
  "33760",
  "33762",
  "33763",
  "33764",
  "33775",
  "33801",
  "33883",
  "33925",
  "33926",
  "33969",
  "33985",
  "34009",
  "34048",
  "34248",
  "34261",
  "34300",
  "34410",
  "34500",
  "34510",
  "34602",
  "34669",
  "34675",
  "34677",
  "34724",
  "34766",
  "34903",
  "34940",
  "35015",
  "35044",
  "35138",
  "35204",
  "35210",
  "35211",
  "35213",
  "35215",
  "35333",
  "35364",
  "35379",
  "35432",
  "35528",
  "35529",
  "35541",
  "35542",
  "35543",
  "35545",
  "35623",
  "35626",
  "35642",
  "35650",
  "35691",
  "35757",
  "35910",
  "35912",
  "35920",
  "35921",
  "35956",
  "36021",
  "36148",
  "36160",
  "36164",
  "36184",
  "36185",
  "36226",
  "36245",
  "36290",
  "36291",
  "36318",
  "36345",
  "36397",
  "36423",
  "36425",
  "36427",
  "36428",
  "36429",
  "36440",
  "36455",
  "36491",
  "36522",
  "36544",
  "36545",
  "36561",
  "36571",
  "36618",
  "36619",
  "36644",
  "36661",
  "36722",
  "36732",
  "36762",
  "36775",
  "36790",
  "36791",
  "36823",
  "36824",
  "36843",
  "36848",
  "36910",
  "36932",
  "36978",
  "36993",
  "36996",
  "37044",
  "37058",
  "37078",
  "37090",
  "37097",
  "37098",
  "37099",
  "37100",
  "37101",
  "37102",
  "37149",
  "37150",
  "37152",
  "37164",
  "37175",
  "37176",
  "37177",
  "37179",
  "37180",
  "37181",
  "37184",
  "37185",
  "37186",
  "37187",
  "37207",
  "37208",
  "37209",
  "37219",
  "37225",
  "37228",
  "37291",
  "37292",
  "37293",
  "37294",
  "37563",
  "37564",
  "37566",
  "37618",
  "37619",
  "37620",
  "37641",
  "37642",
  "37643",
  "37661",
  "37736",
  "37737",
  "37740",
  "37749",
  "37750",
  "37751",
  "37752",
  "37816",
  "37822",
  "37879",
  "37886",
  "37887",
  "37888",
  "37894",
  "37895",
  "37896",
  "37924",
  "37927",
  "37928",
  "37929",
  "37932",
  "37936",
  "37937",
  "37938",
  "37941",
  "37943",
  "38069",
  "38070",
  "38071",
  "38072",
  "38073",
  "38074",
  "38092",
  "38093",
  "38117",
  "38118",
  "38119",
  "38120",
  "38121",
  "38122",
  "38123",
  "38124",
  "38125",
  "38126",
  "38127",
  "38128",
  "38129",
  "38131",
  "38132",
  "38133",
  "38134",
  "38135",
  "38136",
  "38137",
  "38217",
  "38220",
  "38246",
  "38250",
  "38285",
  "38312",
  "38325",
  "38341",
  "38346",
  "38347",
  "38409",
  "38410",
  "38412",
  "38413",
  "38435",
  "38436",
  "38450",
  "38461",
  "38467",
  "38489",
  "38490",
  "38491",
  "38525",
  "38528",
  "38533",
  "38536",
  "38537",
  "38556",
  "38611",
  "38612",
  "38677",
  "38688",
  "38689",
  "38690",
  "38740",
  "38741",
  "38742",
  "38917",
  "38918",
  "38919",
  "38990",
  "39022",
  "39023",
  "39024",
  "39080",
  "39116",
  "39121",
  "39122",
  "39123",
  "39124",
  "39125",
  "39126",
  "39127",
  "39128",
  "39129",
  "39130",
  "39131",
  "39132",
  "39133",
  "39135",
  "39136",
  "39137",
  "39138",
  "39139",
  "39140",
  "39141",
  "39178",
  "39188",
  "39189",
  "39190",
  "39191",
  "39192",
  "39230",
  "39231",
  "39298",
  "39380",
  "39410",
  "39419",
  "39421",
  "39572",
  "39675",
  "39676",
  "39677",
  "39678",
  "39679",
  "39691",
  "39720",
  "39736",
  "39754",
  "39760",
  "39767",
  "39823",
  "39912",
  "39936",
  "39959",
  "40005",
  "40062",
  "40080",
  "40088",
  "40091",
  "40092",
  "40100",
  "40111",
  "40151",
  "40194",
  "40208",
  "40211",
  "40233",
  "40249",
  "40434",
  "40435",
  "40439",
  "40440",
  "40568",
  "40638",
  "40652",
  "40730",
  "40732",
  "40733",
  "40734",
  "40735",
  "40784",
  "40806",
  "40823",
  "40876",
  "40885",
  "40909",
  "40966",
  "40969",
  "40979",
  "40991",
  "41051",
  "41078",
  "41079",
  "41080",
  "41081",
  "41093",
  "41094",
  "41125",
  "41126",
  "41190",
  "41210",
  "41215",
  "41219",
  "41220",
  "41221",
  "41223",
  "41224",
  "41277",
  "41409",
  "41416",
  "41417",
  "41494",
  "41503",
  "41509",
  "41511",
  "41528",
  "41611",
  "41785",
  "41802",
  "41884",
  "41913",
  "41915",
  "41916",
  "41917",
  "41918",
  "41919",
  "41920",
  "41923",
  "41942",
  "42004",
  "42033",
  "42070",
  "42082",
  "42088",
  "42106",
  "42132",
  "42146",
  "42147",
  "42148",
  "42149",
  "42151",
  "42158",
  "42178",
  "42183",
  "42187",
  "42193",
  "42206",
  "42209",
  "42238",
  "42263",
  "42264",
  "42266",
  "42267",
  "42268",
  "42284",
  "42285",
  "42290",
  "42291",
  "42302",
  "42320",
  "42330",
  "42331",
  "42333",
  "42359",
  "42373",
  "42443",
  "42444",
  "42445",
  "42446",
  "42447",
  "42448",
  "42454",
  "42455",
  "42464",
  "42465",
  "42468",
  "42481",
  "42496",
  "42497",
  "42498",
  "42513",
  "42550",
  "42598",
  "42629",
  "42632",
  "42640",
  "42737",
  "42784",
  "42794",
  "42815",
  "42834",
  "42835",
  "42898",
  "42947",
  "42949",
  "42950",
  "42956",
  "42966",
  "42967",
  "42969",
  "42977",
  "42985",
  "43216",
  "43274",
  "43291",
  "43309",
  "43362",
  "43387",
  "43411",
  "43514",
  "43537",
  "43612",
  "43626",
  "43652",
  "43671",
  "43684",
  "43703",
  "43729",
  "43772",
  "43958",
  "43961",
  "43982",
  "43983",
  "43984",
  "43986",
  "43987",
  "43988",
  "43989",
  "43990",
  "43991",
  "43992",
  "43993",
  "43994",
  "43995",
  "43996",
  "43997",
  "43998",
  "43999",
  "44000",
  "44001",
  "44002",
  "44047",
  "44053",
  "44061",
  "44062",
  "44064",
  "44065",
  "44067",
  "44068",
  "44069",
  "44070",
  "44071",
  "44073",
  "44074",
  "44075",
  "44078",
  "44079",
  "44090",
  "44097",
  "44126",
  "44128",
  "44189",
  "44196",
  "44212",
  "44213",
  "44218",
  "44221",
  "44228",
  "44233",
  "44295",
  "44296",
  "44388",
  "44389",
  "44390",
  "44406",
  "44408",
  "44410",
  "44411",
  "44412",
  "44513",
  "44565",
  "44570",
  "44571",
  "44615",
  "44742",
  "44829",
  "45085",
  "45095",
  "45147",
  "45148",
  "45149",
  "45169",
  "45195",
  "45196",
  "45444",
  "45445",
  "45447",
  "45448",
  "45556",
  "45557",
  "45558",
  "45599",
  "45600",
  "45607",
  "45612",
  "45654",
  "46447",
  "46630",
  "46639",
  "46821",
  "46924",
  "47044",
  "47231",
  "47275",
  "47403",
  "47405",
  "47548",
  "47612",
  "47620",
  "47795",
  "48000",
  "48006",
  "48023",
  "48097",
  "48101",
  "48123",
  "48305",
  "48369",
  "48374",
  "48480",
  "48481",
  "48537",
  "48543",
  "48631",
  "48684",
  "48694",
  "48749",
  "48754",
  "48759",
  "48791",
  "48844",
  "48845",
  "48866",
  "48867",
  "48873",
  "48875",
  "48890",
  "48910",
  "48914",
  "48941",
  "48942",
  "48956",
  "48962",
  "48964",
  "48965",
  "49063",
  "49078",
  "49079",
  "49098",
  "49132",
  "49170",
  "49200",
  "49204",
  "49205",
  "49208",
  "49274",
  "49275",
  "49276",
  "49305",
  "49355",
  "49380",
  "49386",
  "49398",
  "49409",
  "49413",
  "49432",
  "49433",
  "49448",
  "49559",
  "49566",
  "49567",
  "49569",
  "49570",
  "49571",
  "49572",
  "49573",
  "49574",
  "49587",
  "49599",
  "49620",
  "49638",
  "49652",
  "49701",
  "49718",
  "49742",
  "49750",
  "49757",
  "49759",
  "49818",
  "49841",
  "49847",
  "49873",
  "49915",
  "49952",
  "49982",
  "49985",
  "50021",
  "50025",
  "50105",
  "50114",
  "50207",
  "50233",
  "50240",
  "50271",
  "50274",
  "50280",
  "50299",
  "50364",
  "50378",
  "50398",
  "50399",
  "50400",
  "50401",
  "50404",
  "50406",
  "50407",
  "50411",
  "50421",
  "50429",
  "50430",
  "50431",
  "50432",
  "50433",
  "50439",
  "50441",
  "50443",
  "50444",
  "50445",
  "50446",
  "50462",
  "50501",
  "50521",
  "50537",
  "50538",
  "50539",
  "50544",
  "50565",
  "50571",
  "50575",
  "50581",
  "50588",
  "50604",
  "50629",
  "50633",
  "50636",
  "50644",
  "50647",
  "50657",
  "50667",
  "50794",
  "50849",
  "50898",
  "50925",
  "51038",
  "51039",
  "51131",
  "51191",
  "51196",
  "51197",
  "51203",
  "51207",
  "51216",
  "51245",
  "51250",
  "51274",
  "51278",
  "51280",
  "51287",
  "51288",
  "51289",
  "51291",
  "51302",
  "51333",
  "51334",
  "51335",
  "51361",
  "51383",
  "51385",
  "51390",
  "51392",
  "51397",
  "51405",
  "51457",
  "51490",
  "51492",
  "51517",
  "51520",
  "51549",
  "51558",
  "51601",
  "51623",
  "51681",
  "51726",
  "51727",
  "51735",
  "51769",
  "51791",
  "51821",
  "51834",
  "51836",
  "51860",
  "51861",
  "51863",
  "51864",
  "51897",
  "51898",
  "51941",
  "52019",
  "52065",
  "52101",
  "52105",
  "52178",
  "52180",
  "52187",
  "52221",
  "52251",
  "52378",
  "52522",
  "52583",
  "52623",
  "52680",
  "52684",
  "52735",
  "52765",
  "52869",
  "52870",
  "52890",
  "52949",
  "53149",
  "53205",
  "53249",
  "53251",
  "53367",
  "53437",
  "53447",
  "53449",
  "53450",
  "53473",
  "53476",
  "53477",
  "53498",
  "53852",
  "53859",
  "53905",
  "53919",
  "54014",
  "54018",
  "54021",
  "54029",
  "54033",
  "54035",
  "54061",
  "54123",
  "54124",
  "54261",
  "54285",
  "54437",
  "54631",
  "54693",
  "54773",
  "54779",
  "54846",
  "54875",
  "54880",
  "54895",
  "54931",
  "54973",
  "54974",
  "54997",
  "55009",
  "55014",
  "55015",
  "55072",
  "55130",
  "55151",
  "55186",
  "55192",
  "55226",
  "55563",
  "55578",
  "55655",
  "55684",
  "55692",
  "55693",
  "55694",
  "55731",
  "55732",
  "55733",
  "55739",
  "55740",
  "55745",
  "55790",
  "55809",
  "55821",
  "55829",
  "55856",
  "55864",
  "55993",
  "56040",
  "56157",
  "56207",
  "56215",
  "56216",
  "56342",
  "56439",
  "56523",
  "56524",
  "56578",
  "56579",
  "56601",
  "56716",
  "56717",
  "56752",
  "56764",
  "56765",
  "56766",
  "56787",
  "56820",
  "56927",
  "56930",
  "56958",
  "56960",
  "56963",
  "56981",
  "56987",
  "57015",
  "57067",
  "57078",
  "57096",
  "57183",
  "57192",
  "57226",
  "57264",
  "57286",
  "57351",
  "57371",
  "57422",
  "57442",
  "57468",
  "57512",
  "57513",
  "57575",
  "57594",
  "57613",
  "57629",
  "57656",
  "57657",
  "57663",
  "57699",
  "57801",
  "57865",
  "57877",
  "57878",
  "57995",
  "58001",
  "58055",
  "58057",
  "58143",
  "58295",
  "58448",
  "58476",
  "58487",
  "58490",
  "58493",
  "58494",
  "58509",
  "58523",
  "58551",
  "58554",
  "58555",
  "58681",
  "58711",
  "58744",
  "58754",
  "58779",
  "58783",
  "58797",
  "58876",
  "58966",
  "59001",
  "59012",
  "59032",
  "59063",
  "59084",
  "59087",
  "59150",
  "59156",
  "59178",
  "59179",
  "59180",
  "59181",
  "59182",
  "59183",
  "59225",
  "59236",
  "59237",
  "59241",
  "59245",
  "59246",
  "59291",
  "59306",
  "59327",
  "59382",
  "59385",
  "59389",
  "59391",
  "59398",
  "59410",
  "59433",
  "59434",
  "59557",
  "59593",
  "59634",
  "59662",
  "59753",
  "59762",
  "59765",
  "59868",
  "59891",
  "59915",
  "59916",
  "59927",
  "59938",
  "59939",
  "59951",
  "59953",
  "59967",
  "59969",
  "59977",
  "59993",
  "59998",
  "60057",
  "60066",
  "60089",
  "60137",
  "60143",
  "60171",
  "60233",
  "60235",
  "60246",
  "60248",
  "60249",
  "60279",
  "60297",
  "60311",
  "60374",
  "60415",
  "60416",
  "60418",
  "60420",
  "60434",
  "60436",
  "60526",
  "60529",
  "60541",
  "60557",
  "60558",
  "60561",
  "60562",
  "60565",
  "60567",
  "60570",
  "60572",
  "60577",
  "60581",
  "60589",
  "60690",
  "60766",
  "60787",
  "60797",
  "60818",
  "60821",
  "60828",
  "60855",
  "60877",
  "60966",
  "60988",
  "61090",
  "61212",
  "61302",
  "61420",
  "61496",
  "61508",
  "61561",
  "61564",
  "61566",
  "61590",
  "61592",
  "61609",
  "61618",
  "61621",
  "61622",
  "61625",
  "61646",
  "61657",
  "61704",
  "61748",
  "61752",
  "61753",
  "61764",
  "61784",
  "61847",
  "61921",
  "61929",
  "61950",
  "62026",
  "62092",
  "62117",
  "62166",
  "62167",
];

// ==== utilities.js ====
//Delay Function
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

//Timeout
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
}

//Debounce Function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

//Debounce the function after its first call.
function debounceWithFirstImmediate(fn, delay) {
  let timer;
  let firstCall = true;
  return (...args) => {
    if (firstCall) {
      firstCall = false;
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  };
}

//Wait for the element
function waitForElement(selector, timeout = 5000, options = {}) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      if (options.log) {
        reject(`Element "${selector}" not found.`);
      } else {
        resolve(null);
      }
    }, timeout);
  });
}

//Image Check
function isImageLoadable(url, callback) {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = url;
}

//Simple Create Element Shorthand Function
function create(tag, attrs, innerHTML) {
  if (!tag) throw new SyntaxError("'tag' not defined");

  const el = document.createElement(tag);

  if (attrs) {
    for (const key in attrs) {
      if (key === "style") {
        const styleVal = attrs.style;
        if (typeof styleVal === "string") {
          el.style.cssText = styleVal;
        } else if (typeof styleVal === "object") {
          for (const s in styleVal) {
            el.style[s] = styleVal[s];
          }
        }
      } else {
        el.setAttribute(key, attrs[key]);
      }
    }
  }
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

//Advanced Create Element Shorthand Function
function AdvancedCreate(HTMLtag, classes, text, appendLocation, cssText) {
  var element = document.createElement(HTMLtag);
  if (Array.isArray(classes)) {
    element.classList.add(...classes);
    if (classes.includes("newTab")) {
      element.setAttribute("target", "_blank");
    }
  } else if (classes) {
    if (classes[0] === "#") {
      element.id = classes.substring(1);
    } else {
      element.classList.add(classes);
      if (classes === "newTab") {
        element.setAttribute("target", "_blank");
      }
    }
  }
  if (text || text === 0) {
    element.innerText = text;
  }
  if (appendLocation && appendLocation.appendChild) {
    appendLocation.appendChild(element);
  }
  if (cssText) {
    element.style.cssText = cssText;
  }
  return element;
}

function createDisplayBox(cssProperties, windowTitle) {
  let displayBox = AdvancedCreate("div", "maljsDisplayBox", false, document.querySelector("#myanimelist"));
  if (windowTitle) {
    AdvancedCreate("span", "maljsDisplayBoxTitle", windowTitle, displayBox);
  }
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let isDownResize = false;
  let displayBoxClose = AdvancedCreate("span", "maljsDisplayBoxClose", "x", displayBox);
  displayBoxClose.onclick = function () {
    displayBox.remove();
  };
  let resizePearl = AdvancedCreate("span", "maljsResizePearl", false, displayBox);
  displayBox.addEventListener(
    "mousedown",
    function (e) {
      let root = e.target;
      while (root.parentNode) {
        //don't annoy people trying to copy-paste
        if (root.classList.contains("scrollableContent")) {
          return;
        }
        root = root.parentNode;
      }
      isDown = true;
      offset = [displayBox.offsetLeft - e.clientX, displayBox.offsetTop - e.clientY];
    },
    true
  );
  resizePearl.addEventListener(
    "mousedown",
    function (event) {
      event.stopPropagation();
      event.preventDefault();
      isDownResize = true;
      offset = [displayBox.offsetLeft, displayBox.offsetTop];
    },
    true
  );
  document.addEventListener(
    "mouseup",
    function () {
      isDown = false;
      isDownResize = false;
    },
    true
  );
  document.addEventListener(
    "mousemove",
    function (event) {
      if (isDownResize) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        displayBox.style.width = mousePosition.x - offset[0] + 5 + "px";
        displayBox.style.height = mousePosition.y - offset[1] + 5 + "px";
        return;
      }
      if (isDown) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        displayBox.style.left = mousePosition.x + offset[0] + "px";
        displayBox.style.top = mousePosition.y + offset[1] + "px";
      }
    },
    true
  );
  let innerSpace = AdvancedCreate("div", "scrollableContent", false, displayBox);
  return innerSpace;
}

//Copy mal clean colors to iframe (required for customFg customization)
function copyLastFgStyleToIframe(iframe) {
  if (!iframe.contentDocument) {
    return;
  }
  let styles = document.head.querySelectorAll("style");
  let lastFgStyle = null;
  styles.forEach((style) => {
    if (style.textContent.includes("--fg:")) {
      lastFgStyle = style;
    }
  });

  if (lastFgStyle) {
    let iframeDoc = iframe.contentDocument;
    let newStyle = iframeDoc.createElement("style");
    newStyle.textContent = lastFgStyle.textContent;
    iframeDoc.head.appendChild(newStyle);
  }
}

// MalClen Settings - Edit About Popup
async function editAboutPopup(data, type) {
  return new Promise((resolve, reject) => {
    if ($("#currently-popup").length) {
      return;
    }
    let canSubmit = 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);", style: { display: "none" } });
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "99" },
    });
    const popupDataText = create("div", { class: "dataTextDiv" });
    const popupDataTextButton = create("button", { class: "dataTextButton" }, "Copy");
    const popupLoading = create(
      "div",
      {
        class: "actloading editAboutLoading",
      },
      translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
    );
    const iframe = create("iframe", { style: { pointerEvents: "none", opacity: "0" }, src: "https://myanimelist.net/editprofile.php" });

    // close popup function
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    // Timeout for loading
    const loadTimeout = setTimeout(() => {
      popupLoading.innerHTML = translate("$loadTimeoutError") || "Loading timed out. Please try again.";
      popupClose.style.display = "block";
    }, 25000);

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    async function notFound() {
      iframe.remove();
      popupClose.style.display = "block";
      popupLoading.innerHTML = translate("$malCleanCustomError");
      popupDataText.innerHTML = "[url=https://malcleansettings/]‎ [/url]";
      popupLoading.append(popupDataText, popupDataTextButton);
      popupDataTextButton.addEventListener("click", async function () {
        try {
          await navigator.clipboard.writeText(popupDataText.innerText);
          popupDataTextButton.innerText = "Copied!";
          setTimeout(() => {
            popupDataTextButton.innerText = "Copy";
          }, 2000);
        } catch (err) {
          alert("Copy to clipboard failed. Please copy manually.");
          console.error("Clipboard error:", err);
        }
      });
    }

    $(iframe).on("load", async function () {
      clearTimeout(loadTimeout);
      let $iframeContents = $(iframe).contents();
      let $about = $iframeContents.find("#classic-about-me-textarea");
      if (!$about.length) {
        popupLoading.innerHTML = "Profile textarea not found. MyAnimeList layout may have changed.";
        popupClose.style.display = "block";
        return;
      }

      let isClassic;
      try {
        isClassic = $iframeContents.find("#about_me_setting_2").is(":checked");
      } catch (e) {
        popupLoading.innerHTML = "Could not determine layout type.";
        popupClose.style.display = "block";
        return;
      }

      let $submit = $iframeContents.find('.inputButton[type="submit"]');
      if (!$submit.length) {
        popupLoading.innerHTML = "Submit button not found.";
        popupClose.style.display = "block";
        return;
      }

      const regexes = {
        match: /(\[url=https:\/\/malcleansettings\/)(.*)(]‎) \[\/url\]/gm,
        add: /(\[url=https:\/\/malcleansettings\/)(.*)(]‎)/gm,
        privateProfile: /(privateProfile)\/([^\/]+.)/gm,
        hideProfileEl: /(hideProfileEl)\/([^\/]+.)/gm,
        customPf: /(custompf)\/([^\/]+.)/gm,
        customFg: /(customfg)\/([^\/]+.)/gm,
        customBg: /(custombg)\/([^\/]+.)/gm,
        customCSS: /(customCSS)\/([^\/]+.)/gm,
        customBadge: /(custombadge)\/([^\/]+.)/gm,
        customColor: /(customcolors)\/([^\/]+.)/gm,
        malBadges: /(malBadges)\/([^\/]+.)/gm,
        favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
        customProfileEl: /(customProfileEl)\/([^\/]+.)/gm,
        moreFavs: /(moreFavs)\/([^\/]+.)/gm,
      };
      let userBlogPage = "https://myanimelist.net/blog/" + headerUserName;
      popupLoading.innerHTML = translate("$updating") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>';
      $iframeContents.find("body")[0].setAttribute("style", "background:0!important");
      if ($iframeContents.find(".goodresult")[0]) {
        canSubmit = 0;
        window.location.reload();
        return;
      }
      if ($iframeContents.find(".badresult")[0]) {
        canSubmit = 0;
        popupLoading.innerHTML = translate("$anErrorOccured");
        return;
      }

      // Replace text with regex check
      function replaceTextIfMatches(regex, aboutText, replacement, add) {
        if (add) {
          return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
        }
        if (regex.test(aboutText)) {
          return aboutText.replace(regex, replacement);
        }
        return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
      }

      // Update about text and submit
      async function updateAboutText(newText) {
        $about.text(newText);
        $submit.click();
      }

      async function changeData() {
        let aboutText = $about.text();

        //if no custom settings, add default custom settings
        if (!regexes.match.test(aboutText)) {
          aboutText = "[url=https://malcleansettings/]‎ [/url]" + aboutText;
        }

        // Update based on the type
        if (type === "color") {
          aboutText = replaceTextIfMatches(regexes.customColor, aboutText, `${data}/`);
        } else if (type === "badge") {
          aboutText = replaceTextIfMatches(regexes.customBadge, aboutText, `${data}/`);
        } else if (type === "malBadges") {
          aboutText = replaceTextIfMatches(regexes.malBadges, aboutText, `${data}/`);
        } else if (type === "private") {
          aboutText = replaceTextIfMatches(regexes.privateProfile, aboutText, `${data}/`);
        } else if (type === "pf") {
          aboutText = replaceTextIfMatches(regexes.customPf, aboutText, `${data}/`);
        } else if (type === "fg") {
          aboutText = replaceTextIfMatches(regexes.customFg, aboutText, `${data}/`);
        } else if (type === "bg") {
          aboutText = replaceTextIfMatches(regexes.customBg, aboutText, `${data}/`);
        } else if (type === "css") {
          aboutText = replaceTextIfMatches(regexes.customCSS, aboutText, `${data}/`);
        } else if (type === "moreFavs") {
          aboutText = replaceTextIfMatches(regexes.moreFavs, aboutText, `${data}/`);
        } else if (type === "hideProfileEl") {
          aboutText = replaceTextIfMatches(regexes.hideProfileEl, aboutText, `${data}/`);
        } else if (type === "customProfileEl") {
          aboutText = replaceTextIfMatches(regexes.customProfileEl, aboutText, `${data}/`, 1);
        } else if (type === "favSongEntry") {
          if (!$iframeContents.find(".goodresult")[0]) {
            if (aboutText.indexOf(data) > -1) {
              popupLoading.innerHTML = translate("$alreadyAdded");
              popupClose.style.display = "block";
              canSubmit = 0;
            } else {
              aboutText = replaceTextIfMatches(regexes.favSongEntry, aboutText, `${data}/`, 1);
            }
          }
        } else if (type === "editCustomEl") {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`);
        } else if (type === "removeFavSong" || type === "removeCustomEl") {
          aboutText = aboutText.replace(data, "");
        } else if (type === "replaceFavSong" || type === "replaceCustomEl") {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`).replace(`/${data[1]}/`, `/${data[0]}/`);
        } else if (type === "removeAll") {
          aboutText = aboutText.replace(regexes.match, "");
        }
        if (canSubmit) {
          await updateAboutText(aboutText);
        }
      }

      if (isClassic && settingsFounded !== 2) {
        changeData();
      } else if ($(iframe).attr("src").indexOf("blog") === -1) {
        iframe.src = userBlogPage;
      }
      if ($(iframe).contents()[0].URL.indexOf("editprofile.php") === -1) {
        if ($(iframe).contents()[0].URL.indexOf("myblog.php") === -1) {
          let $blogFound = null;
          const $maljsBlogDivs = $iframeContents.find('#content > div div:has(a:contains("Edit Entry"))').prev();
          if ($maljsBlogDivs.length) {
            $maljsBlogDivs.each(function () {
              const $this = $(this);
              if ($this.html().includes("malcleansettings")) {
                $blogFound = 1;
                const $editLink = $this.next().find('a[href*="/myblog.php?go=edit"]');
                if ($editLink.length) {
                  iframe.src = $editLink.attr("href");
                }
              }
            });
          }
          if (!$blogFound) {
            notFound();
          }
        } else {
          $about = $iframeContents.find("textarea[name='entry_text']");
          $submit = $iframeContents.find('.inputButton[name="subentry"]');
          changeData();
        }
      }
    });
    // close popup click function
    popupClose.onclick = () => {
      close();
    };
  });
}

// Anime/Manga Edit Popup
async function editPopup(id, type, add, addCount, addFg) {
  return new Promise((resolve, reject) => {
    if ($("#currently-popup").length) {
      return;
    }
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/ownlist/" + (type ? type.toLocaleLowerCase() : "anime") + "/" + id + "/edit?hideLayout=1";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create(
      "div",
      {
        class: "actloading editPopupLoading",
      },
      translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "99" },
    });
    const iframe = create("iframe", { style: { opacity: "0" }, src: popupId });
    const close = () => {
      if ($(iframe).contents().find(".goodresult")[0] && url) {
        window.location.reload();
      }
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };
    if (type === "manga") {
      popup.style.height = "472px";
    }

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      $(iframe).contents().find("body")[0].setAttribute("style", "background:0!important");
      if (addFg) {
        copyLastFgStyleToIframe(iframe);
      }
      if (!add) {
        popupLoading.remove();
        iframe.style.opacity = 1;
      } else {
        popupLoading.innerHTML = translate("$updating") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>';
      }
      if (add && $(iframe).contents().find(".goodresult")[0]) {
        close();
      }
      if ($(iframe).contents().find(".badresult")[0]) {
        popupLoading.innerHTML = translate("$anErrorOccured");
      }
      // close advanced section
      if ($(iframe).contents().find("#hide-advanced-button")[0].style.display === "") {
        $(iframe).contents().find("#hide-advanced-button")[0].click();
      }

      let decreaseEp = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").next().clone().text("-").css({ marginRight: "0" });
      $(decreaseEp).prependTo($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").parent());

      function checkEp() {
        let ep = parseInt($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").val());
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let day = $(iframe).contents().find("#add_anime_finish_date_day,#add_manga_finish_date_day")[0];
        let month = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month")[0];
        let year = $(iframe).contents().find("#add_anime_finish_date_year,#add_manga_finish_date_year")[0];
        let startDate = $(iframe).contents().find("#add_anime_start_date_month,#add_manga_start_date_month").val();
        let endDate = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month").val();
        if (svar.autoAddDate) {
          // if episode count is greater than 0 and the start date is not entered
          if (ep > 0 && !startDate) {
            $(iframe).contents().find("#start_date_insert_today")[0].click();
          }

          // if episode count equals or exceeds the total episodes and the end date is not entered, add end date
          if (ep >= lastEp && lastEp > 0 && !endDate) {
            $(iframe).contents().find("#end_date_insert_today")[0].click();
          }

          //if episode count less than total episodes and the end date is entered, clear end date
          if (ep < lastEp && lastEp > 0 && endDate) {
            day.value = 0;
            month.value = 0;
            year.value = 0;
          }
        }
      }

      //if episode count changed
      $(iframe)
        .contents()
        .find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")
        .on("input", function () {
          checkEp();
        });

      //if increment episode (+) clicked
      $(iframe)
        .contents()
        .find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")
        .next()
        .on("click", function () {
          checkEp();
        });

      //if entry status is completed
      $(iframe)
        .contents()
        .find("#add_anime_status,#add_manga_status")[0]
        .addEventListener("change", function () {
          if (this.value == "2") {
            checkEp();
          }
        });

      if (add) {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let mangaVol = $(iframe).contents().find("#add_manga_num_read_volumes")[0];
        let mangaVolLast = parseInt($(iframe).contents().find("#totalVol").text());
        let status = $(iframe).contents().find("#add_anime_status,#add_manga_status")[0];
        let submit = $(iframe).contents().find(".inputButton.main_submit")[0];
        ep.value = parseInt(ep.value) + addCount;
        if (parseInt(ep.value) >= lastEp && lastEp !== 0) {
          status.value = 2;
          if (mangaVol) {
            mangaVol.value = mangaVolLast;
          }
        }
        checkEp();
        $(submit).click();
      }

      //if decrease ep clicked
      $(decreaseEp).on("click", function () {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        ep.value = ep.value > 0 ? ep.value - 1 : ep.value;
        checkEp();
      });

      //if history clicked
      $(iframe)
        .contents()
        .find("#totalEpisodes,#totalChap")
        .next()
        .children()
        .on("click", function () {
          iframe.style.opacity = 0;
          popup.prepend(popupLoading);
          popup.prepend(popupBack);
        });

      //if history back clicked
      $(popupBack).on("click", function () {
        iframe.style.opacity = 0;
        popup.prepend(popupLoading);
        iframe.src = popupId;
        popupBack.remove();
      });
    });

    // close popup
    popupMask.onclick = () => {
      if (!add) {
        close();
      }
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

// Block User Popup
async function blockUser(id) {
  return new Promise((resolve, reject) => {
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/editprofile.php?go=privacy";
    const popupLoading = create(
      "div",
      {
        class: "actloading",
        style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },
      },
      translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "99" },
    });
    const iframe = create("iframe", { style: { opacity: "0" }, src: popupId });
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, iframe, popupLoading);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      $(iframe).contents().find("body")[0].setAttribute("style", "background:0!important");
      iframe.style.opacity = 1;
      popupLoading.remove();
      if ($(iframe).contents().find("form > input.inputtext")[0]) {
        $(iframe).contents().find("#headerSmall")[0].remove();
        $(iframe).contents().find("#menu")[0].remove();
        $(iframe).contents().find("#horiznav_nav")[0].remove();
        $(iframe).contents().find("footer")[0].remove();
        $(iframe).contents().find(".h1")[0].remove();
        $(iframe).contents().find("form > input.inputtext")[0].value = id;
        $(iframe).contents().find("a[href*=profile]").removeAttr("href");
        $(iframe).contents().find("html")[0].style.overflowX = "hidden";
        $(iframe).contents().find("#content")[0].style.padding = "0";
        $(iframe).contents().find("#contentWrapper")[0].setAttribute("style", "top: 5px!important;min-height: auto;padding: 0;width:auto;margin-left:0!important");
        $(iframe).contents().find("#myanimelist")[0].setAttribute("style", "width: auto;padding: 0px 5px;");
        $(iframe).contents().find("form:has(input.inputtext)")[0].style.width = "auto";
        $(iframe).contents().find("#content > div > div")[0].style.width = "auto";
      }

      if ($(iframe).contents().find(".goodresult")[0]) {
        popup.append($(iframe).contents().find(".goodresult")[0]);
        iframe.remove();
      }

      if ($(iframe).contents().find(".badresult")[0]) {
        popup.append($(iframe).contents().find(".badresult")[0]);
        iframe.remove();
      }

      $(iframe)
        .contents()
        .find("input[name='bsub']")
        .on("click", function () {
          iframe.style.opacity = 0;
          popup.append(popupLoading);
        });

      $(iframe)
        .contents()
        .find("span:has(form)")
        .on("click", function () {
          iframe.style.opacity = 0;
          popup.append(popupLoading);
        });
    });

    // close popup
    popupMask.onclick = () => {
      close();
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

// Anilist API Request
async function AnilistAPI(fullQuery) {
  var query = fullQuery;
  let url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    };
  await delay(333);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      return null;
    }
    if (data.data) {
      return data;
    }
  } catch (error) {
    return null;
  }
}

let AlAPIData;
let AlAPIRequestPromise;

async function aniAPIRequest() {
  if (!AlAPIRequestPromise) {
    const AlQuery = `query {Media(idMal:${entryId}, type:${entryType}) {bannerImage tags {isMediaSpoiler name rank description category}
    relations {edges {relationType node {status startDate {year} seasonYear type format title {romaji} coverImage {medium large} idMal}}}
    nextAiringEpisode {timeUntilAiring episode}}}`;
    AlAPIRequestPromise = AnilistAPI(AlQuery).then((data) => {
      AlAPIData = data;
      AlAPIRequestPromise = null;
      return data;
    });
  }
  return AlAPIRequestPromise;
}

//  MalClean - Add Loader
let loadingDiv = create("div", { class: "actloading", id: "loadingDiv", style: { top: "0", position: "fixed" } });
const loadingDivMask = create("div", {
  class: "fancybox-overlay",
  style: { background: "var(--color-background)", opacity: "1", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "99" },
});

function addLoading(type = "add", text = translate("$loading"), circle = 1, force = 0) {
  const contWrap = document.querySelector("#contentWrapper");
  if (contWrap) {
    if (force) {
      $(loadingDiv).attr("force", force);
    }
    let spinCircle = '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>';
    if (type === "add") {
      loadingDiv.innerHTML = text + (circle ? spinCircle : "");
      if (!document.querySelector("#loadingDiv")) {
        document.body.append(loadingDivMask, loadingDiv);
      }
      document.querySelector("#contentWrapper").style.opacity = "0";
      document.body.style.overflow = "hidden";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    } else if (type === "remove" && !$(loadingDiv).attr("force")) {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector("#contentWrapper").style.opacity = "1";
    }
    if (type === "forceRemove") {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector("#contentWrapper").style.opacity = "1";
    }
  }
}

//Compresses multiple localForage databases into a single LZString compressed string
async function compressLocalForageDB(...dbNames) {
  try {
    // Validate input
    if (!dbNames.length || dbNames.length < 2) {
      throw new Error("At least 2 database names must be provided");
    }

    // Helper function to fetch all data from a database
    const fetchDB = async (name) => {
      const db = await localforage.createInstance({
        name: "MalJS",
        storeName: name,
      });

      const keys = await db.keys();
      const data = {};

      await Promise.all(
        keys.map(async (key) => {
          data[key] = await db.getItem(key);
        })
      );

      return data;
    };

    // Fetch all databases in parallel
    const dbData = {};
    await Promise.all(
      dbNames.map(async (name) => {
        if (name) dbData[name] = await fetchDB(name);
      })
    );

    // Compress the data
    const jsonString = JSON.stringify(dbData);
    const compressedData = LZString.compressToBase64(jsonString).replace(/\//g, "_");

    return compressedData;
  } catch (error) {
    console.error("Database compression error:", error);
    return null;
  }
}

//Time Calculate
function nativeTimeElement(e) {
  let date = new Date(1e3 * e);
  if (isNaN(date.valueOf())) return translate("$now");
  return (function () {
    let r = Math.round(new Date().valueOf() / 1e3) - Math.round(date.valueOf() / 1e3);
    if (r === 0) return translate("$now");
    if (r === 1) return translate("$secondAgo");
    if (r < 60) return translate("$secondsAgo", r);
    if (r < 120) return translate("$minuteAgo");
    if (r < 3600) return translate("$minutesAgo", Math.floor(r / 60));
    if (r < 7200) return translate("$hourAgo");
    if (r < 86400) return translate("$hoursAgo", Math.floor(r / 3600));
    if (r < 172800) return translate("$dayAgo");
    if (r < 604800) return translate("$daysAgo", Math.floor(r / 86400));
    if (r < 1209600) return translate("$weekAgo");
    if (r < 2419200) return translate("$weeksAgo", Math.floor(r / 604800));
    if (r < 29030400) return translate("$monthsAgo", Math.floor(r / 2419200));
    return translate("$yearsAgo", Math.floor(r / 29030400));
  })();
}

//Fix Date for Modern Anime/Manga List option
function parseDate(dateString, string) {
  if (dateString) {
    const parts = dateString.split("-");
    let day = parts[0];
    let month = parts[1];
    let yearSuffix = parts[2];
    const currentYear = new Date().getFullYear();
    const currentYearSuffix = (currentYear % 100) + 4;
    let year = parseInt(yearSuffix, 10) > currentYearSuffix ? "19" + yearSuffix : "20" + yearSuffix;
    const fromString = { month: parseInt(month, 10), day: parseInt(day, 10), year: parseInt(year, 10) };
    return string ? fromString : new Date(`${year}-${month}-${day}`).getTime();
  }
  return null;
}

//Set Element Shorthand Function
function set(q, tag, attrs, html) {
  if (q === 1) {
    tag = document.querySelector(tag);
  }
  if (q === 2) {
    tag = document.querySelectorAll(tag);
  }
  if (!tag) {
    return;
  }
  var ele = tag,
    attrName,
    styleName;
  if (attrs)
    for (attrName in attrs) {
      if (attrName === "style")
        for (styleName in attrs.style) {
          ele.style[styleName] = attrs.style[styleName];
        }
      if (attrName === "sa")
        for (styleName in attrs.sa) {
          ele.setAttribute("style", attrs.sa[styleName]);
        }
      if (attrName === "sap")
        for (styleName in attrs.sap) {
          ele.parentElement.setAttribute("style", attrs.sap[styleName]);
        }
      if (attrName === "r") {
        ele.remove();
      }
      if (attrName === "pp")
        for (styleName in attrs.pp) {
          ele.prepend(document.querySelector(attrs.pp[styleName]));
        }
      if (attrName === "sal")
        for (styleName in attrs.sal) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].setAttribute("style", attrs.sal[styleName]);
          }
        }
      if (attrName === "sl")
        for (styleName in attrs.sl) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].style[styleName] = attrs.sl[styleName];
          }
        }
    }
  if (html) ele.innerHTML = html;
  return ele;
}

//String Similarity
var stringSimilarity = function (str1, str2, substringLength, caseSensitive) {
  if (substringLength === void 0) {
    substringLength = 2;
  }
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }
  if (str1.length < substringLength || str2.length < substringLength) return 0;
  var map = new Map();
  for (var i = 0; i < str1.length - (substringLength - 1); i++) {
    var substr1 = str1.substr(i, substringLength);
    map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
  }
  var match = 0;
  for (var j = 0; j < str2.length - (substringLength - 1); j++) {
    var substr2 = str2.substr(j, substringLength);
    var count = map.has(substr2) ? map.get(substr2) : 0;
    if (count > 0) {
      map.set(substr2, count - 1);
      match++;
    }
  }
  return (match * 2) / (str1.length + str2.length - (substringLength - 1) * 2);
};

// Current Watching Airing Schedule - Calculate Time
async function airingTime(sec) {
  const timeUntilAiring = sec;
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const targetTimeStamp = currentTimeStamp + timeUntilAiring;
  const remainingTime = targetTimeStamp - currentTimeStamp;
  const days = Math.floor(remainingTime / (24 * 60 * 60));
  const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
  return (days ? days + translate("$daySuffix") : "") + (hours ? hours + translate("$hourSuffix") : "") + (minutes ? minutes + translate("$minuteSuffix") : "");
}

async function replaceLocalForageDB(instance, newData) {
  const db = await localforage.createInstance({ name: "MalJS", storeName: instance });
  await db.clear();
  for (let i = 0; i < newData.length; i++) {
    await db.setItem(newData[i].key, newData[i]);
  }
}

// Current Watching Airing Schedule - Episode Behind
async function episodesBehind(c, w) {
  if (c - 1 <= w) {
    return;
  } else {
    const epBehind = c - 1 - w;
    return `${epBehind} ${translate("$epBehind")}`;
  }
}

//Rgb to Hex
function rgbToHex(rgb) {
  let result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return rgb;
  return "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase();
}

//Hex to Rgb
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

//Days to TTL
function daysToTTL(days, toDay) {
  if (isNaN(days) || days <= 0) {
    return 86400000;
  }
  const ttl = toDay ? days / (1000 * 60 * 60 * 24) : days * 24 * 60 * 60 * 1000;
  return ttl;
}

// Anime-Manga Add Class
function aniMangaAddClass(main, name) {
  const h2 = $('h2:contains("' + main + '"):last');
  if (h2.length > 0) {
    name = name || main.split(" ").join("") + "Div";
    const parent = h2.parent();
    parent.is("div") && !parent.hasClass("leftside") && !parent.hasClass("rightside") ? parent.addClass(name) : h2.addClass(name);
  }
}

// Create MalClean List Divs
function createListDiv(title, buttons) {
  const btns = create("div", { class: "mainListBtnsDiv" });

  buttons.forEach((button) => {
    const mainDiv = create("div", {
      class: "mainListBtnDiv",
      id: `${button.b.id}Option`,
    });

    const elements = [button.b, `<h3>${button.t}</h3>`];
    if (button.s) elements.push(button.s);
    $(mainDiv).append(...elements);
    btns.append(mainDiv);
  });

  const div = create(
    "div",
    {
      class: "malCleanSettingContainer",
      id: title
        .trim()
        .toLowerCase()
        .replace(/[\W_]+/g, "-"),
    },
    `<div class="malCleanSettingHeader"><h2>${title}</h2></div>`
  );

  div.append(btns);
  return div;
}

//Get Text until Selector
function getTextUntil(selector) {
  let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  let endElement = document.querySelector(selector);
  if (!main || !endElement) return "";
  let textContent = "";
  let collect = true;
  Array.from(main.childNodes).forEach(function (el, i) {
    if (el === endElement) {
      collect = false;
    }

    if (collect && i > 5 && el.className !== "normal_header") {
      if (el.nodeType === Node.ELEMENT_NODE) {
        textContent += el.innerHTML || "";
      } else if (el.nodeType === Node.TEXT_NODE) {
        textContent += el.textContent || "";
      }
    }
  });
  return textContent.trim();
}

//Add SCEditor Commands
async function addSCEditorCommands() {
  //ScEditor Color Picker
  sceditor.command.set("colorpick", {
    _dropDown: function (e, t) {
      if ($("input.bbcode-message-color-picker").length === 0) {
        $('<input type="color" class="bbcode-message-color-picker" />').css({ position: "absolute", opacity: 0, width: 0, height: 0 }).appendTo("body").val("#ff0000");
      }
      var colorPicker = $("input.bbcode-message-color-picker");
      colorPicker.css({
        top: $(t).offset().top + 24 + "px",
        left: $(t).offset().left + 12 + "px",
      });
      colorPicker.trigger("click");
      colorPicker.off("change").on("change", function () {
        var color = colorPicker.val();
        if (e.inSourceMode()) {
          e.insertText("[color=" + color + "]", "[/color]");
        } else {
          e.execCommand("forecolor", color);
        }
      });
    },
    exec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    txtExec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    tooltip: "Font Color",
  });

  //ScEditor Spoiler
  sceditor.formats.bbcode.set("spoiler", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    format: function (element, content) {
      var desc = "";
      var $elm = $(element);
      var $button = $elm.children("button").first();
      if ($button.length === 1 || $elm.data("desc")) {
        desc = $button.text() || $elm.data("desc");
        $button.remove();
        content = this.elementToBbcode(element);
        if (desc === "spoiler") {
          desc = "";
        } else if (desc.charAt(0) !== "=") {
          desc = "=" + desc;
          $elm.data("desc", desc);
        }
        $elm.prepend($button);
      }

      return "[spoiler" + desc + "]" + content + "[/spoiler]";
    },
    html: function (token, attrs, content) {
      var data = "";
      var desc = attrs.defaultattr || "Spoiler";
      content = `
      <div class="spoiler">
        <input type="button" class="button show_button" value="Show ${desc}">
        <span class="spoiler_content" style="display:none">
          <input type="button" class="button hide_button" value="Hide ${desc}">
          <br>
          ${content}
        </span>
      </div>`;

      // Spoiler Show - Hide
      setTimeout(function () {
        var showButtons = document.querySelectorAll(".show_button");
        showButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            var spoilerContent = this.nextElementSibling;
            spoilerContent.style.display = "inline-block";
            this.style.display = "none";
          });
        });

        var hideButtons = document.querySelectorAll(".hide_button");
        hideButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            var spoilerContent = this.closest(".spoiler").querySelector(".spoiler_content");
            spoilerContent.style.display = "none";
            this.closest(".spoiler").querySelector(".show_button").style.display = "inline-block";
          });
        });
      }, 0);

      if (attrs.defaultattr) {
        data += ' data-desc="' + sceditor.escapeEntities(attrs.defaultattr) + '"';
      }
      return "<blockquote" + data + ' class="spoiler">' + content + "</blockquote>";
    },
  });

  sceditor.command.set("spoiler", {
    exec: function (caller) {
      var html = '<blockquote class="spoiler"><button>spoiler</button><span class="spoiler_content" style="display:none"></span></blockquote>';
      this.wysiwygEditorInsertHtml(html);
      $(this.getBody())
        .find("blockquote.spoiler")
        .each(function () {
          if ($(this).find("button").length == 0) {
            $(this).prepend("<button>spoiler</button>");
          }
        });
    },
    txtExec: ["[spoiler]", "[/spoiler]"],
    tooltip: "Insert a spoiler",
  });

  //ScEditor BR
  sceditor.formats.bbcode.set("br", {
    isSelfClosing: true,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function () {
      return "[br]";
    },
    html: function () {
      return "<br>";
    },
  });

  //ScEditor Center
  sceditor.formats.bbcode.set("center", {
    styles: {
      "text-align": ["center", "-webkit-center", "-moz-center", "-khtml-center"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[center]" + content + "[/center]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: center;">' + content + "</div>";
    },
  });

  //ScEditor Right
  sceditor.formats.bbcode.set("right", {
    styles: {
      "text-align": ["right", "-webkit-right", "-moz-right", "-khtml-right"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[right]" + content + "[/right]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: right;">' + content + "</div>";
    },
  });

  //ScEditor Color
  sceditor.formats.bbcode.set("color", {
    styles: {
      color: null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let color = element.style.color;
      if (color.startsWith("rgb")) color = rgbToHex(color);
      return "[color=" + color + "]" + content + "[/color]";
    },
    html: function (token, attrs, content) {
      return '<span style="color: ' + (attrs.defaultattr || "inherit") + ';">' + content + "</span>";
    },
  });

  //ScEditor Size
  sceditor.formats.bbcode.set("size", {
    styles: {
      "font-size": null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let fontSize = element.style.fontSize;
      if (!fontSize) return content;
      return `[size=${fontSize.replace(/px/g, "").replace(/%/g, "")}]${content}[/size]`;
    },
    html: function (token, attrs, content) {
      let sizeValue = attrs.defaultattr ? attrs.defaultattr + "%" : "inherit";
      return `<span style="font-size: ${sizeValue};">${content}</span>`;
    },
  });

  //ScEditor Font
  sceditor.formats.bbcode.set("font", {
    styles: {
      "font-family": null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      return "[font=" + element.style.fontFamily + "]" + content + "[/font]";
    },
    html: function (token, attrs, content) {
      return '<span style="font-family: ' + (attrs.defaultattr || "inherit") + ';">' + content + "</span>";
    },
  });
  //ScEditor Div
  sceditor.formats.bbcode.set("div", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    tags: {
      div: {
        id: null,
        class: null,
        style: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      return `[div${elId}${elClass}${elStyle}]${content}[/div]`;
    },

    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-div"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-div"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      return `<div${elId}${elClass}${elStyle}>${content}</div>`;
    },
  });
  sceditor.command.set("div", {
    txtExec: function (caller, content) {
      let editor = this;
      const sce_div = `
      <div id="sce_divoptionsbox">
        <div class="sce_div-option" data-action="insertDiv">
          <label for="div-id">ID (Optional):</label>
          <input id="div-id" type="text" />
    
          <label for="div-class">Class (Optional):</label>
          <input id="div-class" type="text" />
    
          <label for="div-style">Style (Optional):</label>
          <input id="div-style" type="text" placeholder="background:#fff;" /><br>
    
          <input id="insert-div-btn" type="button" class="button" value="Insert" />
        </div>
      </div>`;

      let drop_content = $(sce_div);

      // Handle div insertion
      drop_content.find("#insert-div-btn").click(function (e) {
        let divId = $("#div-id").val() ? ` id="${$("#div-id").val()}"` : "";
        let divClass = $("#div-class").val() ? ` class="${$("#div-class").val()}"` : "";
        let divStyle = $("#div-style").val() ? ` style="${$("#div-style").val()}"` : "";
        let divTag = `[div${divId}${divClass}${divStyle}]${content}[/div]`;
        editor.insert(divTag);
        editor.closeDropDown(true);
        e.preventDefault();
      });
      editor.createDropDown(caller, "div-picker", drop_content[0]);
    },
    tooltip: "Insert a Div",
  });

  // SCEditor Iframe
  sceditor.formats.bbcode.set("iframe", {
    allowsEmpty: false,
    tags: {
      iframe: {
        src: null,
        width: null,
        height: null,
        style: null,
        allow: null,
        loading: null,
        frameborder: null,
        allowfullscreen: null,
      },
    },
    format: function (element, content) {
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || "100%";
      let height = element.getAttribute("height") || "152";
      let allow = element.getAttribute("allow") ? ` allow="${element.getAttribute("allow")}"` : "";
      let loading = element.getAttribute("loading") ? ` loading="${element.getAttribute("loading")}"` : "";

      if (src && src.startsWith("https://")) {
        return `[iframe${elStyle} width="${width}" height="${height}"${allow}${loading}]${src}[/iframe]`;
      }
      return content;
    },
    html: function (token, attrs, content) {
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || "100%";
      let height = attrs.height || "352";
      let allow = attrs.allow ? ` allow="${attrs.allow}"` : "";
      let loading = attrs.loading ? ` loading="${attrs.loading}"` : "";
      let frameborder = attrs.frameborder ? ` frameborder="${attrs.frameborder}"` : ` frameborder="0"`;
      let sandbox = 'sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"';

      if (content && content.startsWith("https://")) {
        return `<iframe${elStyle} width="${width}" height="${height}" src="${content}" ${allow}${loading}${frameborder} ${sandbox}></iframe>`;
      }
      return "";
    },
  });

  sceditor.command.set("iframe", {
    txtExec: function (caller) {
      var editor = this;
      var sce_iframe = `
      <div id="sce_iframeoptionsbox">
        <div class="sce_iframe-option">
          <label for="iframe-url">Iframe URL (https only):</label>
          <input id="iframe-url" type="text" placeholder="https://" />
          
          <label for="iframe-width">Width:</label>
          <input id="iframe-width" type="text" placeholder="100%" />
          
          <label for="iframe-height">Height:</label>
          <input id="iframe-height" type="text" placeholder="352" />
          
          <label for="iframe-style">Style (Optional):</label>
          <input id="iframe-style" type="text" placeholder="border-radius:8px;" />
          
          <label for="iframe-allow">Allow Attributes (Optional):</label>
          <input id="iframe-allow" type="text" placeholder="autoplay; fullscreen;" /></br>
          
          <input id="insert-iframe-btn" type="button" class="button" value="Insert" />
        </div>
      </div>`;

      var drop_content = $(sce_iframe);

      drop_content.find("#insert-iframe-btn").click(function (e) {
        let iframeUrl = $("#iframe-url").val();
        if (!iframeUrl.startsWith("https://")) {
          alert("Only HTTPS URLs are allowed for iframes");
          return;
        }

        let iframeWidth = $("#iframe-width").val();
        let iframeHeight = $("#iframe-height").val();
        let iframeStyle = $("#iframe-style").val();
        let iframeAllow = $("#iframe-allow").val();

        let bbcode =
          `[iframe` + (iframeStyle ? ` style="${iframeStyle}"` : "") + ` width="${iframeWidth}" height="${iframeHeight}"` + (iframeAllow ? ` allow="${iframeAllow}"` : "") + `]${iframeUrl}[/iframe]`;

        editor.insert(bbcode);
        editor.closeDropDown(true);
        e.preventDefault();
      });

      editor.createDropDown(caller, "iframe-picker", drop_content[0]);
    },
    tooltip: "Insert an Iframe",
  });

  //ScEditor Video
  sceditor.formats.bbcode.set("video", {
    allowsEmpty: false,
    tags: {
      video: {
        src: null,
        width: null,
        height: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || 415;
      let height = element.getAttribute("height") || 315;
      let autoplay = element.getAttribute("autoplay") === "" ? " autoplay=1" : "";
      let controls = element.getAttribute("controls") === "" ? "" : " controls=0";
      let muted = element.getAttribute("muted") === "" ? " muted=1" : "";
      let loop = element.getAttribute("loop") === "" ? " loop=1" : "";
      let poster = element.getAttribute("poster") ? ` poster="${element.getAttribute("poster")}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return src ? `[video width="${width}" height="${height}"${mergedAttributes}]${src}[/video]` : content;
    },
    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-video"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-video"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || 415;
      let height = attrs.height || 315;
      let autoplay = attrs.autoplay ? " autoplay" : "";
      let controls = attrs.controls == 0 ? "" : " controls";
      let muted = attrs.muted || autoplay ? " muted" : "";
      let loop = attrs.loop ? " loop" : "";
      let poster = attrs.poster ? ` poster="${attrs.poster}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return `<video ${elId}${elClass}${elStyle} width="${width}" height="${height}" frameborder="0" src="${content}" ${mergedAttributes} onloadstart="this.volume=0.5"></video>`;
    },
  });
  sceditor.command.set("video", {
    txtExec: function (caller) {
      var editor = this;
      var sce_video = '<div id="sce_videooptionsbox"><div class="sce_video-option" data-action="insertVideo">';
      sce_video += '<label for="video-url">Video URL:</label><input id="video-url" type="text" placeholder="https://" />';
      sce_video += '<label for="video-width">Width (Optional):</label><input id="video-width" type="text" placeholder="" />';
      sce_video += '<label for="video-height">Height (Optional):</label><input id="video-height" type="text" placeholder="" />';
      sce_video += '<label for="video-style">Style (Optional):</label><input id="video-style" type="text" placeholder="" /><br>';
      sce_video += '<div><label><input type="checkbox" id="video-autoplay" /> Autoplay</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-muted" /> Muted</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-loop" /> Loop</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-controls" checked /> Controls</label></div>';
      sce_video += '<input id="insert-video-btn" type="button" class="button" value="Insert"></input>';
      sce_video += "</div></div>";
      var drop_content = $(sce_video);

      // Handle video insertion
      drop_content.find("#insert-video-btn").click(function (e) {
        let videoSrc = $("#video-url").val();
        let videoWidth = $("#video-width").val() ? ` width="${$("#video-width").val()}"` : "";
        let videoHeight = $("#video-height").val() ? ` height="${$("#video-height").val()}"` : "";
        let videoStyle = $("#video-style").val() ? ` style="${$("#video-style").val()}"` : "";

        // Get checked attributes
        let autoplay = $("#video-autoplay").is(":checked") ? " autoplay=1" : "";
        let muted = $("#video-muted").is(":checked") ? " muted=1" : "";
        let loop = $("#video-loop").is(":checked") ? " loop=1" : "";
        let controls = $("#video-controls").is(":checked") ? "" : " controls=0";

        if (videoSrc) {
          var videoTag = `[video${videoWidth}${videoHeight}${videoStyle}${autoplay}${muted}${loop}${controls}]${videoSrc}[/video]`;
          editor.insert(videoTag);
        }
        editor.closeDropDown(true);
        e.preventDefault();
      });

      editor.createDropDown(caller, "video-picker", drop_content[0]);
    },
    tooltip: "Insert a Video",
  });
}

//Add SCEditor
async function addSCEditor(source) {
  await addSCEditorCommands();
  sceditor.create(source, {
    format: "bbcode",
    style: "/css/sceditor.inner.css",
    width: "100%",
    height: "180px",
    charset: "utf-8",
    emoticonsEnabled: false,
    resizeMaxHeight: -1,
    resizeMinHeight: 100,
    resizeMinWidth: 440,
    resizeHeight: true,
    resizeWidth: false,
    startInSourceMode: true,
    autoUpdate: true,
    plugins: "undo",
    toolbar: "bold,italic,underline,strike|size,center,right,colorpick|bulletlist,orderedlist|code,quote,spoiler|image,link,youtube|video,iframe,div",
    allowIFrame: true,
    allowedIframeUrls: [],
    toolbarExclude: null,
    parserOptions: {},
    allowedTags: ["*"],
    allowElements: ["*"],
    allowedAttributes: ["*"],
    disallowedTags: [],
    disallowedAttibs: [],
  });
}

//ScParser toBBCode Function
function scParserActions(elementId, type) {
  const scParser = sceditor.instance(document.getElementById(elementId));
  let scText = scParser.val();
  if (type === "getVal") {
    return scText;
  }
  if (type === "fromBBGetVal") {
    return scParser.fromBBCode(scText, true);
  }
  if (type === "bbRefresh") {
    scText = scText.replace(/\n/g, "[br]");
    let bbCodeContent = scParser.toBBCode(scText);
    scParser.val(bbCodeContent);
  }
}

// Add Divs to People Details
function peopleDetailsAddDiv(title) {
  let divElements = $('span:contains("' + title + '"):last').nextUntil("div");
  let divNameElement = $('span.dark_text:contains("' + title + '")');
  let divNameText = divNameElement[0] && divNameElement[0].nextSibling ? divNameElement[0].nextSibling.nodeValue.trim() : null;
  let newDiv = $('<div class="spaceit_pad"></div>').html(title + " " + divNameText);
  for (let x = 0; x < divElements.length; x++) {
    newDiv.append(divElements[x]);
  }
  if (divNameElement) {
    divNameText ? (divNameElement[0].nextSibling.nodeValue = "") : null;
    divNameElement.after(newDiv);
    divNameElement.remove();
  }
}

// Add Div to Empty Anime/Manga Info
function emptyInfoAddDiv(title, mode) {
  let newDiv = $('<div itemprop="description" style="display: block;"></div>');
  let cDiv = $(title)[0];
  let siblings = [];
  if (mode) {
    while (cDiv.nextSibling && cDiv.nextSibling.nodeName !== "DIV") {
      siblings.push(cDiv.nextSibling);
      cDiv = cDiv.nextSibling;
    }
  } else {
    for (let i = 0; i < 3; i++) {
      if (cDiv.nextSibling.nodeName !== "BR") {
        siblings.push(cDiv.nextSibling);
        cDiv = cDiv.nextSibling;
      }
    }
  }
  newDiv.append(...siblings);
  $(title).after(newDiv);
}

//Check Empty Anime & Manga info
function handleEmptyInfo(divSelector, checkText, mode) {
  const $div = $(divSelector);
  if ($div.length) {
    const nextSibling = $div[0].nextSibling;
    if (nextSibling && !$(nextSibling).attr("itemprop") && (nextSibling.nodeValue || nextSibling.innerText) && (nextSibling.nodeValue || nextSibling.innerText).includes(checkText)) {
      emptyInfoAddDiv(divSelector, mode);
      if (nextSibling.innerHTML) {
        nextSibling.innerHTML = nextSibling.innerHTML.replace("<br>", "");
      }
    }
  }
}

//Get Recently Added from MyAnimeList
async function getRecentlyAdded(type, page) {
  const dataArray = [];
  const dataType = type;
  const genreFilter = type ? svar.recentlyMangaFilter : svar.recentlyAnimeFilter;
  try {
    await delay(250);
    const response = await fetch(`https://myanimelist.net/${type ? "manga" : "anime"}.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1&${genreFilter}&show=${page ? page : "0"}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("div.js-categories-seasonal tr");
    rows.forEach((row) => {
      const imgSrc = row.querySelector("td img") ? row.querySelector("td img").getAttribute("data-src").replace("/r/50x70/", "/") : "";
      if (imgSrc) {
        if (!dataType && svar.hideNonJapaneseAnime) {
          const isNonJapanese = nonJapaneseIds.some((id) => {
            return !!row.querySelector(`.title div[id="sarea${id}"]`);
          });
          if (isNonJapanese) return;
        }
        const title = row.querySelector("td strong") ? row.querySelector("td strong").textContent : "";
        const type = row.querySelector('td[width="45"]') ? row.querySelector('td[width="45"]').textContent.trim() : "";
        const url = row.querySelector("td a") ? row.querySelector("td a").href : "";
        dataArray.push({
          img: imgSrc,
          title: title,
          type: type,
          url: url,
        });
      }
    });
    return dataArray;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

//Build Recently Added List
async function buildRecentlyAddedList(list, appLoc, width, height) {
  for (let x = 1; x < list.length; x++) {
    let rDiv = create("li", {
      class: "btn-anime",
      style: { ...(svar.recentlyGrid && { margin: 0 }), minHeight: `${height}px`, maxHeight: `${height}px`, minWidth: `${width}px`, maxWidth: `${width}px` },
    });
    rDiv.innerHTML = `
      <i class="fa fa-info-circle" style="font-family: 'Font Awesome 6 Pro'; position: absolute; right: 3px; top: 3px; padding: 4px; opacity: 0; transition: 0.4s; z-index: 20;"></i>
      <a class="link" href="${list[x].url}">
        <img width="${width}" height="${height}" class="lazyload" src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${list[x].img}">
        <span class="recently-added-type">${list[x].type}</span>
        <span class="title js-color-pc-constant color-pc-constant">${list[x].title}</span>
      </a>
    `;
    document.querySelector(appLoc).append(rDiv);
  }
}

//Add all Recently Added Items to List
function addAllRecentlyAdded(main, list) {
  main.forEach((item) => {
    if (!list.contains(item)) {
      list.appendChild(item);
    }
  });
}

//Filter Recently Added List
function filterRecentlyAdded(items, selectedTypes) {
  const showAll = selectedTypes.includes("All");
  const mustAll = selectedTypes.includes("genre%5B%5D=12");

  items.forEach((item) => {
    const type = item.querySelector(".recently-added-type")?.textContent;
    if (mustAll || showAll || (type && selectedTypes.includes(type))) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

//Get total width of Div
function getTotalWidth(element) {
  const div = typeof element !== "object" ? document.querySelector(element) : element;
  const style = window.getComputedStyle(div);
  const width = div.offsetWidth;
  const marginLeft = parseFloat(style.marginLeft);
  const marginRight = parseFloat(style.marginRight);
  return width + marginLeft + marginRight;
}

//Get total height of Div
function getTotalHeight(element) {
  const div = typeof element !== "object" ? document.querySelector(element) : element;
  const style = window.getComputedStyle(div);
  const width = div.offsetHeight;
  const marginLeft = parseFloat(style.marginLeft);
  const marginRight = parseFloat(style.marginRight);
  return width + marginLeft + marginRight;
}

//Create Info Tooltip
let waitForInfo = 0;
let mouseMoveListener = null;
let hoverCheckElements = [];
let hoverTimeoutId = null;
async function createInfo(clickedSource, mainDiv, type, isGrid) {
  if (!waitForInfo && $(".tooltipBody").length === 0) {
    waitForInfo = 1;
    clickedSource.attr("class", "fa fa-circle-o-notch fa-spin");

    let info, isFailed;

    const btnAnime = clickedSource.closest(".btn-anime")[0];

    if (!btnAnime.getAttribute("details")) {
      const id = clickedSource.next(".link")[0].href.split("/")[4];
      const apiUrl = `https://api.jikan.moe/v4/${type ? "manga" : "anime"}/${id}/full`;
      const apiCharactersUrl = `https://api.jikan.moe/v4/${type ? "manga" : "anime"}/${id}/characters`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        info = data.data;
      } catch (error) {
        info = `<div class="main">Error: ${error}</div>`;
        isFailed = 1;
      }

      if (info?.title) {
        await delay(333);
        // Get Characters
        async function getCharacterHtmlString(apiCharactersUrl) {
          try {
            const charactersResponse = await fetch(apiCharactersUrl);
            if (!charactersResponse.ok) throw new Error(`HTTP error! Status: ${charactersResponse.status}`);

            const charactersData = await charactersResponse.json();
            if (!charactersData || !Array.isArray(charactersData.data)) throw new Error("Invalid data format");

            const characters = charactersData.data;

            let html = "";

            characters.forEach((item) => {
              const character = item.character;
              if (!character) return;

              const charImage = character?.images?.jpg?.image_url || "";

              // By default, the voice actor section will be empty.
              let vaHtml = "";

              // If there is a voice actor and one that is Japanese is found.
              if (Array.isArray(item.voice_actors)) {
                const voiceActor = item.voice_actors.find((va) => va.language === "Japanese");
                if (voiceActor && voiceActor.person) {
                  const vaImage = voiceActor.person?.images?.jpg?.image_url || "";
                  vaHtml = `
                  <a class="va-container" href="${voiceActor.person.url}">
                  <img class="va-image lazyload" data-src="${vaImage}" alt="${voiceActor.person.name}">
                  <div class="va-name-container">
                  <span class="va-name">${voiceActor.person.name}</span>
                  <small class="va-language">${voiceActor.language}</small>
                  </div>
                  </a>
                  `;
                }
              }

              html += `
              <div class="character-entry">
              <a class="character-container" href="${character.url}" ${vaHtml ? "" : 'style="max-width:100%"'}>
              <img class="character-image lazyload" data-src="${charImage}" alt="${character.name}">
              <div class="character-name-container">
              <span class="character-name">${character.name}</span>
              <small class="character-role">${item.role}</small>
              </div>
              </a>
              ${vaHtml}
              </div>
              `;
            });

            return html || `<div class="text">Character information not found.</div>`;
          } catch (error) {
            return `<div class="text">Failed to load characters: ${error.message}</div>`;
          }
        }

        const charactersHtml = await getCharacterHtmlString(apiCharactersUrl);
        const renderList = (label, items) => {
          if (!items) return "";
          if (Array.isArray(items) && items.length) {
            return `<br><div class="text"><b>${label}</b><br>${items.map((node) => `<a href="${node.url}">${node.name}</a>`).join(", ")}</div>`;
          } else if (typeof items === "string" || typeof items === "number") {
            return `<br><div class="text"><b>${label}</b><br>${items}</div>`;
          }
          return "";
        };

        const trailer = info.trailer?.embed_url
          ? `
          <br><div class="text"><b>Trailer</b><br>
          <div class="spoiler">
          <input type="button" class="button show_button" onclick="this.style.display='none'; this.parentElement.querySelector('.spoiler_content').style.display='block';" value="Show Trailer">
          <div class="spoiler_content" style="display: none;"><input type="button" class="button hide_button" onclick="this.closest('.spoiler_content').style.display='none'; this.closest('.spoiler').querySelector('.show_button').style.display='inline-block';" value="Hide Trailer">
          <br>
          <iframe width="700" height="400" style="width: 100%;" class="movie youtube" frameborder="0" allowfullscreen src="${info.trailer.embed_url.replace("&autoplay=1", "")}"></iframe>
          </div>
          </div>
          </div>`
          : "";

        const externalLinks = info.external?.length ? `<br><div class="text"><b>Available At</b><br>${info.external.map((node) => `<a href="${node.url}">${node.name}</a>`).join(" | ")}</div>` : "";

        info = `
          <div class="main">
            <div class="text" style="position: relative; border-bottom: 1px solid;">
              <h3 style="max-width: 90%; margin-top: 5px;">${info.title}</h3>
              <a id="${info.mal_id}" class="addtoList">${translate("$addToList")}</a>
            </div>
            ${info.title_english && info.title_english !== info.title ? renderList("English Title", info.title_english) : ""}
            ${renderList("Synopsis", info.synopsis).replace(/\[Written by MAL Rewrite\]/g, "")}
            ${renderList("Genres", info.genres)}
            ${renderList("Studios", info.studios)}
            ${renderList("Authors", info.authors)}
            ${renderList("Serialization", info.serializations)}
            ${renderList("Themes", info.themes)}
            ${renderList("Demographics", info.demographics)}
            ${renderList("Type", info.type)}
            ${renderList("Rating", info.rating)}
            ${renderList("Duration", info.duration)}
            ${renderList("Start Date", info.aired?.string).replace(/ to \?$/, "")}
            ${renderList("Broadcast", info.broadcast?.string)}
            ${renderList("Episodes", info.episodes)}
            ${renderList("Chapters", info.chapters)}
            ${renderList("Volumes", info.volumes)}
            ${trailer}
            <br><div class="text"><b>Forum</b><br>
              <a href="${info.url}/forum">All</a> | 
              <a href="${info.url}/forum?topic=episode">${type ? "Chapters" : "Episodes"}</a> | 
              <a href="${info.url}/forum?topic=other">Other</a>
            </div>
            <br>
            <div id="tooltip-character-list-container">
              <b>Characters</b><br>
              <div id="tooltip-character-list">
              ${charactersHtml}
              </div>
              </div>
            ${externalLinks}
          </div>
        `;

        if (!isFailed) {
          btnAnime.setAttribute("details", "true");
          $('<div class="tooltipDetails"></div>').html(info).appendTo(btnAnime);
        }
      } else {
        info = '<div class="main">No information found in JikanAPI</div>';
        $('<div class="tooltipDetails"></div>').html(info).appendTo(btnAnime);
      }
    }

    const title = await clickedSource.attr("alt");
    clickedSource.data("tooltipTitle", title);

    const tooltipContent = btnAnime.children[2]?.innerHTML ?? "";
    const tooltipMain = $(`<div class="tooltipBody" id="infoTooltip" style="${isGrid ? "position:absolute;" : ""}">${tooltipContent}</div>`);
    tooltipMain.css("display", "none").appendTo(mainDiv).slideDown(400);

    if (isGrid) {
      const targetDiv = clickedSource.parent()[0];
      const ttDiv = document.getElementById("infoTooltip");
      const rect = targetDiv.getBoundingClientRect();
      const scrollTop = window.scrollY;

      let offset = 15;

      if (defaultMal && svar.recentlyGrid6Column) {
        offset = 20;
      } else if (defaultMal && !svar.recentlyGrid6Column) {
        offset = 10;
      } else if (svar.recentlyGrid6Column) {
        offset = 30;
      }

      const malOffset = defaultMal ? 20 : 0;
      const top = scrollTop + rect.top - offset - malOffset + getTotalHeight(targetDiv) / 2;
      const width = getTotalWidth(mainDiv) || 720;
      ttDiv.style.top = `${top}px`;
      ttDiv.style.minWidth = `${width - 20}px`;
      ttDiv.style.maxWidth = `${width - 20}px`;
      ttDiv.style.marginLeft = `${defaultMal ? 0 : 10}px`;
      ttDiv.classList.add("grid");
      ttDiv.querySelector(".main").setAttribute("style", "background:var(--color-foreground2)!important");
      $(ttDiv).css("display", "none").slideDown(400);
    }

    $(".tooltipBody .addtoList").on("click", async function () {
      await editPopup($(this).attr("id"), type ? "manga" : "anime");
    });

    clickedSource.attr("class", "fa fa-info-circle");
    startHoverCheck(clickedSource[0], clickedSource[0].parentElement, tooltipMain[0]);
    waitForInfo = 0;
  }
}

// Start the hover check for tooltip
function startHoverCheck(...elements) {
  if (mouseMoveListener) {
    return;
  }
  // Clean the previous listeners.
  if (hoverTimeoutId) {
    clearTimeout(hoverTimeoutId);
    hoverTimeoutId = null;
  }
  hoverCheckElements = elements;

  function checkHover() {
    // Is any of the elements in hover state?
    const isAnyHovered = hoverCheckElements.some((el) => el && el.matches(":hover"));

    if (!isAnyHovered) {
      // If none of them are hovered, the tooltip can close.
      $(".tooltipBody")
        .stop(true, true)
        .slideUp(400, function () {
          $(this).remove();
        });
      stopHoverCheck();
    } else {
      // If hover continues, delay the next check
      hoverTimeoutId = setTimeout(checkHover, 200);
    }
    document.addEventListener("mousemove", mouseMoveListener);
  }

  checkHover();
}

// Stop the hover check and remove listeners
function stopHoverCheck() {
  if (hoverTimeoutId) {
    clearTimeout(hoverTimeoutId);
    hoverTimeoutId = null;
  }
  if (mouseMoveListener) {
    document.removeEventListener("mousemove", mouseMoveListener);
    mouseMoveListener = null;
  }
  hoverCheckElements = [];
}

//Update Recently Added List Sliders
function updateRecentlyAddedSliders(slider, leftSlider, rightSlider) {
  const rightEl = document.querySelector(rightSlider);
  const leftEl = document.querySelector(leftSlider);

  if (slider.childNodes.length > 4) {
    rightEl?.classList.add("active");
  } else {
    rightEl?.classList.remove("active");
  }

  // Hide left slider
  leftEl?.classList.remove("active");

  // Participate Repetitive Events
  const setupHoverEvents = (containerSelector, index) => {
    const iconSelector = `${containerSelector} i`;
    const suggestionSelector = `${containerSelector} .anime_suggestions`;

    $(iconSelector)
      .off("click mouseleave")
      .on("click", function () {
        createInfo($(this), suggestionSelector, index, svar.recentlyGrid);
      });
  };
  setupHoverEvents(".widget-container.left.recently-anime", 0);
  setupHoverEvents(".widget-container.left.recently-manga", 1);
}

async function getBlogContent() {
  const tdElements = document.querySelectorAll('td[width="50%"][valign="top"]');
  for (const td of tdElements) {
    const linkElement = td.querySelector('a[href^="/blog.php?eid="]');
    if (linkElement) {
      const blogUrl = linkElement.getAttribute("href");
      try {
        const response = await fetch(blogUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const blogContent = doc.querySelector(".blog_detail_content_wrapper");
        if (blogContent) {
          blogContent.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (src) {
              img.setAttribute("data-src", src);
              img.removeAttribute("src");
              img.classList.add("lazyload");
            }
          });

          td.setAttribute("class", "blogMainWide");
          const targetDiv = td.querySelector("div:nth-child(2)");
          if (targetDiv) {
            const newDiv = create("div", {
              class: "blog_detail_content_wrapper",
              style: {
                width: "auto",
                maxHeight: "500px",
                overflow: "auto",
                margin: "10px 0px",
              },
            });
            newDiv.innerHTML = blogContent.innerHTML;
            targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
          }
        }
        await delay(333);
      } catch (error) {
        console.error("An error occurred while retrieving blog content:", error);
      }
    }
  }
}

async function getUserGenres(type, createDiv) {
  const genreTitle = type ? "Manga" : "Anime";
  const genreType = type ? "manga" : "anime";
  const apiUrl = `https://myanimelist.net/profile/${username}/chart-data.json?type=${genreType}-genre-table&sort=count&order=desc&categories=genres%2Cthemes`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const items = data.items;
      if (items && items.length > 0 && createDiv) {
        const itemsTop5 = data.items.slice(0, 5);
        let genresDivMain = create(
          "div",
          { class: "user-genres", id: `user-${genreType}-genres` },
          `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">${genreTitle} Genre Overview</h5>`
        );
        let genresDiv = create("div", { class: "user-genres-container", id: "user-genres-container" });
        let genresDivInner = create("div", { class: "user-genres-inner", id: "user-genres-inner" });
        genresDivMain.append(genresDiv);
        genresDiv.append(genresDivInner);
        if ($("#user-anime-genres").length) {
          $("#user-anime-genres").after(genresDivMain);
        } else {
          $(".user-button.clearfix.mb12").after(genresDivMain);
        }
        itemsTop5.forEach((item) => {
          const genreDiv = create("div", { class: "user-genre-div" });
          const genreName = create("div", { class: "user-genre-name" }, `<a href="${item.item_list_url}">${item.item}</a>`);
          const genreCount = create("div", { class: "user-genre-count" }, `<b>${item.item_count} </b><p>Entries</p>`);
          genreDiv.append(genreName, genreCount);
          genresDivInner.append(genreDiv);
        });
        $(genresDiv).css("width", "max-content");
        $("#user-status-history-div").css("margin-top", "10px");
        while (genresDivInner.offsetWidth > 425) {
          genresDivInner.lastChild.remove();
        }
        $(genresDiv).css("width", "auto");
      } else if (items && items.length > 0) {
        return items;
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

async function getMalBadges(url) {
  if (!svar.modernLayout) url += "&default";
  let badgesDivMain = create("div", { class: "user-mal-badges", id: "user-mal-badges" }, `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">Mal Badges</h5>`);
  let badgesDivInner = create("div", { class: "badges-inner", id: "badges-inner" });
  let badgesDivIframeInner = create("div", { class: "badges-iframe-inner", id: "badges-iframe-inner" });
  let badgesIframe = create("iframe", { class: "badges-iframe", id: "badges-iframe", tabindex: "-1", scrolling: "no", width: "415", height: "315", src: url, style: { display: "none" } });
  let badgesIframeLoading = create(
    "div",
    {
      class: "actloading malBadgesLoading",
    },
    translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
  );
  if (!svar.modernLayout) {
    $([badgesIframe, badgesDivIframeInner, badgesDivInner]).addClass("defaultMal");
    badgesIframeLoading.style.height = "72px";
  }
  badgesIframe.onerror = function () {
    badgesDivMain.remove();
  };
  badgesIframe.onload = function () {
    badgesIframeLoading.remove();
    badgesIframe.style.display = "block";
  };
  badgesDivMain.append(badgesDivInner);
  badgesDivInner.append(badgesDivIframeInner);
  badgesDivIframeInner.append(badgesIframeLoading, badgesIframe);
  $(badgesDivIframeInner).wrap(`<a href="${url.split("?")[0]}"></a>`);
  $("#user-badges-div").after(badgesDivMain);
}

//Get Friends Info from JikanAPI
async function getFriends(username) {
  let allFriends = [];
  let page = 1;
  let isFinished = 0;
  try {
    while (!isFinished) {
      const response = await fetch(`https://api.jikan.moe/v4/users/${username}/friends?page=${page}`);
      const remainingRequests = response.headers.get("X-RateLimit-Remaining");
      const resetTime = response.headers.get("X-RateLimit-Reset");
      if (remainingRequests === "0") {
        const currentTime = Math.floor(Date.now() / 1000);
        const waitTime = resetTime - currentTime;
        console.log(`Rate limit reached. Waiting for ${waitTime} seconds.`);
        await delay(waitTime * 1000);
      }
      const data = await response.json();
      const friends = data.data.map((friend) => friend.user);
      allFriends = allFriends.concat(friends);
      if (!data.pagination.has_next_page) {
        isFinished = 1;
      }
      page++;
      await delay(500);
    }
    return allFriends;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

//Fetch Custom Profile About Data
//(The 'username' variable must be replaced with 'headerUserName' when retrieving data from somewhere other than the profile.)
async function fetchCustomAbout(processFunction, regex = /(malcleansettings)\/([^"\/])/gm, url = `https://myanimelist.net/profile/${username}`) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.text();
    return await processFunction(data, regex);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function processRssFeed(xml, regex) {
  const parser = new DOMParser();
  const data = parser.parseFromString(xml, "text/xml");
  const items = data.querySelectorAll("item");

  for (let i = 0; i < items.length; i++) {
    const description = items[i].querySelector("description").textContent;
    if (description.match(regex)) {
      settingsFounded = 2;
      return description;
    }
  }
  return null;
}

async function processProfilePage(html, regex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const userProfileAbout = doc.querySelector(".user-profile-about");

  if (userProfileAbout && userProfileAbout.innerHTML.match(regex)) {
    return userProfileAbout.innerHTML;
  } else {
    await delay(250);
    const rssData = await fetchCustomAbout(processRssFeed, regex, `https://myanimelist.net/rss.php?type=blog&u=${username}`);
    if (rssData) {
      settingsFounded = 1;
      return rssData;
    }
  }
  return null;
}

// Decode and Parse Base64
function decodeAndParseBase64(data, sanitize) {
  if (!data) return null;
  try {
    let base64Url = data.replace(/_/g, "/").replace(/-/g, "+");
    while (base64Url.length % 4 !== 0) {
      base64Url += "=";
    }
    const decompressed = LZString.decompressFromBase64(base64Url);
    if (!decompressed) throw new Error("Decompression failed");
    const parsed = JSON.parse(decompressed);
    if (sanitize) {
      function sanitizeObject(obj, sanitize) {
        if (typeof obj === "string") {
          return DOMPurify.sanitize(obj, sanitize);
        } else if (Array.isArray(obj)) {
          return obj.map((item) => sanitizeObject(item, sanitize));
        } else if (typeof obj === "object" && obj !== null) {
          const sanitizedObj = {};
          for (const key in obj) {
            sanitizedObj[key] = sanitizeObject(obj[key], sanitize);
          }
          return sanitizedObj;
        }
        return obj;
      }
      return sanitizeObject(parsed, sanitize);
    }
    return parsed;
  } catch (error) {
    console.error("An error occurred while processing the custom profile data:", error);
    return null;
  }
}

// Encode and Parse Base64
function encodeAndBase64(data) {
  if (!data) return null;
  try {
    const stringify = JSON.stringify(data);
    const base64 = LZString.compressToBase64(stringify);
    const urlSafeBase64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return urlSafeBase64;
  } catch (error) {
    console.error(`An error occurred while processing the custom profile data:`, error);
    return null;
  }
}

// Get Top Anime List
async function getTopAnimeList(type, ids = [0], page = 1) {
  const limit = page > 1 ? `?limit=${page * 50}` : "";
  const listType = type ? `?type=${type}` : "";
  const response = await fetch("https://myanimelist.net/topanime.php" + listType + limit);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const animeRows = doc.querySelectorAll("tr.ranking-list");
  const animeList = [];

  animeRows.forEach((row) => {
    const titleEl = row.querySelector("td.title .anime_ranking_h3 a.hoverinfo_trigger");
    const title = titleEl?.textContent.trim();
    const id = titleEl?.href?.split("/")[4] || 0;
    if (ids.includes(id)) {
      return;
    }
    const url = titleEl?.href;
    const scoreEl = row.querySelector("td.score span.score-label");
    const score = scoreEl?.textContent.trim();
    const imgEl = row.querySelector("td.title a img");
    const imageUrl = imgEl?.getAttribute("data-src") || imgEl?.src;
    const infoEl = row.querySelector("div.information");
    let info = {
      type: "",
      season: "",
      members: "",
    };

    if (infoEl) {
      const lines = infoEl.innerText
        .trim()
        .split("\n")
        .map((line) => line.trim());
      info.type = lines[0] || "";
      info.season = lines[1] || "";
      info.members = lines[2] || "";
    }

    // Push to list
    animeList.push({
      id,
      title,
      score,
      url,
      imageUrl,
      information: info,
    });
  });
  return animeList;
}

// Remove Anime from Top Anime List
function removeFromTopAnime(ids) {
  ids.forEach((id) => {
    const anchor = document.querySelector(`tr.ranking-list a[id="#area${id}"]`);
    if (anchor) {
      const rankingList = anchor.closest("tr.ranking-list");
      if (rankingList) {
        rankingList.remove();
      }
    }
  });
  const rankingLists = document.querySelectorAll("tr.ranking-list");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const limit = parseInt(urlParams.get("limit") || 0);
  rankingLists.forEach((list, index) => {
    const rankSpan = list.querySelector(".rank.ac span");
    if (rankSpan) {
      rankSpan.textContent = limit + index + 1;
    }
  });
}

// Remove Anime from Top Anime Widget
async function removeFromTopAnimeWidget(ids) {
  const fetchInfoList = await getTopAnimeList("airing", ids);
  let titles = [];
  document.querySelectorAll(`.widget.airing_ranking .ranking-unit`).forEach((title) => {
    const anchor = title.querySelector("div.data a.title");
    if (anchor && !ids.includes(anchor.href.split("/")[4])) {
      titles.push(anchor.textContent.trim());
    }
  });

  ids.forEach((id) => {
    const anchor = document.querySelector(`.widget.airing_ranking div.data a.title[href*="${id}"]`);
    if (anchor) {
      const rankingList = anchor.closest(".ranking-unit");
      if (rankingList) {
        const newAnime = fetchInfoList.find((anime) => !ids.includes(anime.id) && !titles.includes(anime.title));
        titles.push(newAnime.title);

        if (newAnime) {
          const widgetTemplate = `
          <li class="ranking-unit">
            <span class="rank">0</span>
            <p class="data-image">
              <a class="image" href="${newAnime.url}">
                <img width="50" height="70" alt="${newAnime.title}" data-src="${newAnime.imageUrl}" class=" lazyloaded" src="${newAnime.imageUrl}">
              </a>
            </p>
            <div class="data">
              <a href="https://myanimelist.net/ownlist/anime/add?selected_series_id=${newAnime.id}&amp;hideLayout=1&amp;click_type=list-add-top" 
                class="Lightbox_AddEdit button_add ga-click ranking-digest fl-r addtolist">
                <span class="ga-click ga-impression" data-ga-click-type="list-add-top" data-ga-click-param="aid:${newAnime.id}"
                data-work-type="anime" data-status="0" style="line-height: unset;" data-ga-impression-type="list-add-button">add</span>
              </a>
              <h3 class="h3_side">
                <a class="title" href="${newAnime.url}">${newAnime.title}</a>
              </h3>
              <span class="info pt8">${newAnime.information.type}, scored ${newAnime.score}</span><br>
              <span class="members pb8">${newAnime.information.members}</span>
            </div>
          </li>`;

          const tempContainer = document.createElement("div");
          tempContainer.innerHTML = widgetTemplate.trim();
          const newElement = tempContainer.firstElementChild;
          rankingList.remove();
          document.querySelector(".widget.airing_ranking .ranking-digest ul").append(newElement);
        } else {
          rankingList.remove();
        }
      }
    }
  });

  document.querySelectorAll(`.widget.airing_ranking .rank`).forEach((rank, index) => {
    rank.innerText = index + 1;
    $(".Lightbox_AddEdit").fancybox({
      width: 1010,
      height: "85%",
      overlayShow: false,
      titleShow: false,
      type: "iframe",
    });
  });
}

// Remove Anime from Seasonal Anime List
function removeFromAnimeSeason(ids) {
  ids.forEach((id) => {
    const anchor = document.querySelector(`.h2_anime_title a[href*="${id}"]`);
    if (anchor) {
      const rankingList = anchor.closest(".seasonal-anime");
      if (rankingList) {
        rankingList.remove();
      }
    }
  });
}

// Remove Anime from Anime Search Page
function removeFromAnimeSearch(ids) {
  const rows = document.querySelectorAll("div.js-categories-seasonal tr");
  rows.forEach((row) => {
    const isMatch = ids.some((id) => {
      return !!row.querySelector(`.title div[id="sarea${id}"]`);
    });
    if (isMatch) {
      row.remove();
    }
  });
}

// Create Anime/Manga Embed
async function createEmbed(selectorList) {
  const embedCache = localforage.createInstance({ name: "MalJS", storeName: "embed" });
  const options = { cacheTTL: svar.embedTTL ? svar.embedTTL : 2592000000, class: "embed" };
  let cached;
  //API Request
  async function fetchData(url, retry = 0) {
    try {
      const response = await fetch(url);

      if (response.status === 429 && retry < 5) {
        await delay(3000);
        return fetchData(url, retry + 1);
      }

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch failed:", error);
      return null;
    }
  }

  function getCacheTTL(status) {
    return status === "Finished Airing" || status === "Finished" ? 15552000000 : svar.embedTTL;
  }

  function getYear(d, cached, publishedYear, airedYear) {
    return cached && d.year ? d.year : d.type !== "Anime" && publishedYear ? publishedYear : airedYear || "";
  }

  function buildDetails(d, cached, publishedYear, airedYear) {
    const detailsArray = [];

    if (d.type) detailsArray.push(d.type);
    if (d.status) detailsArray.push(d.status.replace("Currently", ""));
    if (d.season) detailsArray.push(d.season.charAt(0).toUpperCase() + d.season.slice(1));

    const year = getYear(d, cached, publishedYear, airedYear);
    if (year) detailsArray.push(year);

    if (d.score) {
      detailsArray.push(`<span class="score"> · ${Math.floor(d.score * 10)}%</span>`);
    }

    let result = detailsArray.join(" · ");
    if (detailsArray.length && detailsArray[detailsArray.length - 1].toString().includes("score")) {
      const last = detailsArray.pop();
      result = detailsArray.join(" · ") + last;
    }
    return result;
  }

  function createGenreDiv(genres) {
    return create(
      "div",
      { class: "genres" },
      genres?.length
        ? genres
            .filter((g) => g.name !== "Award Winning")
            .map((g) => g.name)
            .join(", ")
        : ""
    );
  }
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // 32bit integer
    }
    return "h" + Math.abs(hash).toString(36); // base-36 string
  }

  async function getEmbedData(id, type) {
    let apiUrl = `https://api.jikan.moe/v4/${type === "manga" ? "manga" : "anime"}/${id}`;

    try {
      const cache = (await embedCache.getItem(id)) || { time: 0 };
      let data = await cache;
      let d = data.data;
      cached = true;
      let imgdata;

      if (d && d.status) {
        options.cacheTTL = getCacheTTL(d.status);
      }

      if (cache.time + options.cacheTTL < Date.now()) {
        data = await fetchData(apiUrl);
        if (!data) return;

        d = data.data;
        const publishedYear = d.published?.prop?.from?.year;
        const airedYear = d.aired?.prop?.from?.year;

        await embedCache.setItem(id, {
          data: {
            status: d.status,
            score: d.score,
            title: d.title,
            type: d.type,
            genres: d.genres,
            season: d.season,
            images: d.images,
            year: d.type !== "Anime" ? publishedYear || airedYear || "" : airedYear || "",
            url: d.url,
          },
          time: Date.now(),
        });

        imgdata = d.images.jpg.image_url;
        cached = false;
      } else {
        d = data.data;
        imgdata = d.images.jpg.image_url;
      }

      if (!imgdata) return;

      const publishedYear = d.published?.prop?.from?.year;
      const airedYear = d.aired?.prop?.from?.year;

      const genres = createGenreDiv(d.genres);
      const details = create("div", { class: "details" });
      details.innerHTML = buildDetails(d, cached, publishedYear, airedYear);

      const container = create("div", { class: "embed-container" }, '<a class="embed-placeholder"></a>');
      const namediv = create("div", { class: "embed-inner" });
      const name = create("a", { class: "embed-title" }, d.title);
      name.href = d.url;

      if (["Manga", "Manhwa", "Novel"].includes(d.type)) {
        name.style = "color: #92d493!important;";
      }

      const image = create("img", {
        ["data-src"]: imgdata,
        class: "embed-image lazyload",
      });

      if (Array.isArray(d.genres) && d.genres.length > 0) {
        genres.style.display = "block";
      } else {
        container.classList.add("no-genre");
      }

      namediv.append(name, genres, details);
      container.append(image, namediv);

      return { container, wasCached: cached };
    } catch (error) {
      console.error("error:", error);
    }
  }

  //Load Embed
  const forumHeader = document.querySelector("h1.forum_locheader")?.innerText || "";
  const isPreviewThread = /\w+\s\d{4}\sPreview/gm.test(forumHeader);
  const containers = selectorList.flatMap((selector) => [...document.querySelectorAll(selector)]);

  for (const container of containers) {
    let html = container.innerHTML;

    html = html
      .replace(/(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\.php\?id=)([0-9]+)/gm, "https://myanimelist.net/$2/$3")
      .replace(/(<a href="\b(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\/[0-9]+))/gm, " $1");

    let matches = html.match(/<a href="https:\/\/myanimelist\.net\/(anime|manga)\/([0-9]+)([^"'<]*)".*?>.*?<\/a>/gm);
    const parser = new DOMParser();
    matches =
      matches?.filter((link) => {
        if (link.includes("/video")) return false;
        const doc = parser.parseFromString(link, "text/html");
        const aTag = doc.querySelector("a");
        return aTag?.textContent?.trim().length > 0;
      }) || [];

    if (matches.length === 0 || isPreviewThread) continue;

    const finalMatches = matches;

    // Place the placeholder spinner divs
    finalMatches.forEach((match, i) => {
      const idMatch = match.match(/myanimelist\.net\/(anime|manga)\/([0-9]+)/);
      if (!idMatch) return;
      const id = idMatch[2];
      if (id.startsWith("0")) return;

      const hash = simpleHash(match);
      const uniqueId = `e-${id}-${i}-${hash}`;

      const spinnerDiv = create(
        "div",
        {
          class: "embed-link embed-loading",
          id: uniqueId,
          "data-match": match,
        },
        `<div class="embed-container"><a></a><a class="embed-image"></a><div class="embed-inner"><a class="embed-title"></a><div class="spinner"></div></div></div>`
      );

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const linkNodes = [...tempDiv.querySelectorAll('a[href^="https://myanimelist.net/"]')];
      let replaced = false;

      for (const a of linkNodes) {
        const href = a.getAttribute("href");
        if (!href) continue;

        const matchId = href.match(/myanimelist\.net\/(anime|manga)\/(\d+)/);
        if (!matchId || matchId[2] !== id) continue;

        if (a.outerHTML === match) {
          a.outerHTML = spinnerDiv.outerHTML;
          replaced = true;
          break;
        }
      }

      if (!replaced) {
        // fallback: replace first occurrence
        html = html.replace(match, spinnerDiv.outerHTML);
      } else {
        html = tempDiv.innerHTML;
      }
    });

    container.innerHTML = html;

    // Load the embeds in order
    for (let i = 0; i < finalMatches.length; i++) {
      const match = finalMatches[i];
      const [, type, id] = match.match(/myanimelist\.net\/(anime|manga|character|people)\/([0-9]+)/) || [];
      if (!id || id.startsWith("0")) continue;

      const hash = simpleHash(match);
      const uniqueId = `e-${id}-${i}-${hash}`;
      const embedContainer = container.querySelector(`.embed-link#${uniqueId}`);

      if (!embedContainer) continue;

      try {
        const result = await Promise.race([getEmbedData(id, type), timeout(10000)]);
        if (result && result.container) {
          embedContainer.classList.remove("embed-loading");
          embedContainer.innerHTML = "";
          embedContainer.appendChild(result.container);
        } else {
          const originalLink = embedContainer.getAttribute("data-match");
          if (originalLink) {
            embedContainer.outerHTML = originalLink;
          }
        }

        const isThrottled = finalMatches.length > 4 && i !== 0 && i % 4 === 0;
        const wait = result?.wasCached ? 33 : isThrottled ? 777 : 333;
        await delay(wait);
      } catch (e) {
        console.error(`Embed error (ID ${id}):`, e.message);
        const originalLink = embedContainer.getAttribute("data-match");
        if (originalLink) {
          embedContainer.outerHTML = originalLink;
        }
      }
    }

    if (container.className === "message" && !container.id) {
      container.remove();
    }

    await delay(777);
  }
}

async function updateAniMangaEntry(id, type, status, score, numWatchedEpisodes, numReadVolumes) {
  const url = `https://myanimelist.net/ownlist/${type ? type : "anime"}/edit.json`;
  const csrfToken = document.querySelector('meta[name="csrf_token"]')?.content;
  if (!csrfToken) throw new Error("CSRF token not found.");
  const payload = {
    [type ? "manga_id" : "anime_id"]: id,
    status: status,
    score: score,
    [type ? "num_read_chapters" : "num_watched_episodes"]: numWatchedEpisodes,
    csrf_token: csrfToken,
  };

  if (type) {
    payload.num_read_volumes = numReadVolumes || 0;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status code: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
}

function compareUserLists() {
  const rows = document.querySelectorAll("table.shared-table tbody tr");
  const diffs = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 4) {
      const userScore = parseFloat(cells[1].innerText);
      const myScore = parseFloat(cells[2].innerText);

      if (!isNaN(userScore) && !isNaN(myScore)) {
        const diff = Math.abs(userScore - myScore);
        diffs.push(diff);
      }
    }
  });

  const n = diffs.length;
  if (n === 0) return null;

  const avgDiff = diffs.reduce((a, b) => a + b, 0) / n;
  const result = { avgDiff, count: n };
  const header = document.querySelector("#content > h2:nth-child(2)");
  const resultSpan = create("span", { id: "compare-result" });
  const resultSpanScore = create("span", { id: "compare-result-score" });

  if (result && !document.getElementById("compare-result")) {
    $(header).after(resultSpanScore, resultSpan);
    const color = getColorByStdDev(result.avgDiff);
    resultSpanScore.textContent = `${result.avgDiff.toFixed(2)}`;
    resultSpanScore.style.color = color;
    resultSpan.textContent = ` based on ${result.count} shared entries. Lower is better. 1.0 - 1.5 is common`;
  }

  function getColorByStdDev(avgDiff) {
    if (avgDiff <= 1.0) {
      return "#4CAF50";
    } else if (avgDiff <= 1.5) {
      return "#FFC107";
    } else {
      return "#F44336";
    }
  }
}

function compareUserListSortDiff() {
  const table = document.querySelector(".shared-table");
  const headerRow = table.querySelector("tbody tr:first-child");
  const meanRow = Array.from(table.querySelectorAll("tbody tr")).find((row) => row.textContent.includes("Mean Values"));
  const topRow = Array.from(table.querySelectorAll("tbody tr")).find((row) => row.textContent.includes("Top"));
  const headerCells = headerRow.querySelectorAll("td, th");

  // Diff Click
  $(headerCells[3]).children().wrap("<a></a>");
  headerCells[3].style.cursor = "pointer";
  headerCells[3].addEventListener("click", () => {
    const rows = Array.from(table.querySelectorAll("tbody tr")).filter((row) => row !== headerRow && row !== meanRow && row !== topRow); // sabit satırları çıkar

    const desc = headerCells[3].dataset.sortOrder !== "desc";
    headerCells[3].dataset.sortOrder = desc ? "desc" : "asc";

    rows.sort((a, b) => {
      const diffA = parseFloat(a.cells[3].textContent);
      const diffB = parseFloat(b.cells[3].textContent);

      const isNaA = isNaN(diffA);
      const isNaB = isNaN(diffB);

      //Always put null/NaN values at the end.
      if (isNaA && !isNaB) return 1;
      if (!isNaA && isNaB) return -1;
      if (isNaA && isNaB) return 0;

      return desc ? diffB - diffA : diffA - diffB;
    });

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    tbody.appendChild(headerRow);
    rows.forEach((row) => tbody.appendChild(row));
    if (meanRow) tbody.appendChild(meanRow);
    if (topRow) tbody.appendChild(topRow);
  });
}

// ==== polyfills.js ====
/* eslint-disable no-extend-native */

if (!String.prototype.includes) {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  String.prototype.includes = function (search, start) {
    "use strict";
    if (search instanceof RegExp) {
      throw TypeError("first argument must not be a RegExp");
    }
    if (start === undefined) {
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}

//https://github.com/JSmith01/broadcastchannel-polyfill
//The Unlicense
if (!window.BroadcastChannel) {
  var channels = [];

  const BroadcastChannel = function (channel) {
    var $this = this;
    channel = String(channel);

    var id = "$BroadcastChannel$" + channel + "$";

    channels[id] = channels[id] || [];
    channels[id].push(this);

    this._name = channel;
    this._id = id;
    this._closed = false;
    this._mc = new MessageChannel();
    this._mc.port1.start();
    this._mc.port2.start();

    window.addEventListener("storage", function (e) {
      if (e.storageArea !== window.localStorage) return;
      if (e.newValue == null || e.newValue === "") return;
      if (e.key.substring(0, id.length) !== id) return;
      var data = JSON.parse(e.newValue);
      $this._mc.port2.postMessage(data);
    });
  };

  BroadcastChannel.prototype = {
    // BroadcastChannel API
    get name() {
      return this._name;
    },
    postMessage: function (message) {
      var $this = this;
      if (this._closed) {
        var e = new Error();
        e.name = "InvalidStateError";
        throw e;
      }
      var value = JSON.stringify(message);

      // Broadcast to other contexts via storage events...
      var key = this._id + String(Date.now()) + "$" + String(Math.random());
      window.localStorage.setItem(key, value);
      setTimeout(function () {
        window.localStorage.removeItem(key);
      }, 500);

      // Broadcast to current context via ports
      channels[this._id].forEach(function (bc) {
        if (bc === $this) return;
        bc._mc.port2.postMessage(JSON.parse(value));
      });
    },
    close: function () {
      if (this._closed) return;
      this._closed = true;
      this._mc.port1.close();
      this._mc.port2.close();

      var index = channels[this._id].indexOf(this);
      channels[this._id].splice(index, 1);
    },

    // EventTarget API
    get onmessage() {
      return this._mc.port1.onmessage;
    },
    set onmessage(value) {
      this._mc.port1.onmessage = value;
    },
    addEventListener: function (/*type, listener , useCapture*/) {
      return this._mc.port1.addEventListener.apply(this._mc.port1, arguments);
    },
    removeEventListener: function (/*type, listener , useCapture*/) {
      return this._mc.port1.removeEventListener.apply(this._mc.port1, arguments);
    },
    dispatchEvent: function (/*event*/) {
      return this._mc.port1.dispatchEvent.apply(this._mc.port1, arguments);
    },
  };

  window.BroadcastChannel = window.BroadcastChannel || BroadcastChannel;
}

/**
 * Array.flat() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isArray_recursivity
 */
if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth) {
    "use strict";

    // If no depth is specified, default to 1
    if (depth === undefined) {
      depth = 1;
    }

    // Recursively reduce sub-arrays to the specified depth
    var flatten = function (arr, depth) {
      // If depth is 0, return the array as-is
      if (depth < 1) {
        return arr.slice();
      }

      // Otherwise, concatenate into the parent array
      return arr.reduce(function (acc, val) {
        return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
      }, []);
    };

    return flatten(this, depth);
  };
}

/* eslint-enable no-extend-native */

// ==== main.css.js ====
let fgColor = getComputedStyle(document.body);
fgColor = tinycolor(fgColor.getPropertyValue("--fg"));
const fgOpacity = fgColor.setAlpha(0.8).toRgbString();

let styles = `
.malCleanSpinner {
  position: relative;
  margin-left: 5px;
  font-size: 12px;
  font-family: FontAwesome;
  display: inline-block;
}

.loadmore,
.actloading,
.listLoading {
    font-size: .8rem;
    font-weight: 700;
    padding: 14px;
    text-align: center
}

.actloading {
    position: relative;
    left: 0px;
    right: 0px;
    font-size: 16px;
    height: 100%;
    align-content: center;
    z-index: 100;
}
    
.malBadgesLoading {
    height: 120px;
    font-size: 14px;
}

.tooltipBody .addtoList {
    position: absolute;
    top: -5px;
    right: 0;
    cursor: pointer;
    padding: 5px;
    font-size: .6rem;
    background: var(--color-foreground2);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius)
}

.tooltipBody.grid .addtoList,
.tooltipBody.grid .spoiler input,
.tooltipBody.grid #tooltip-character-list .character-entry {
   background: var(--color-foreground)!important;
}

.tooltipBody #tooltip-character-list { 
    display: -ms-grid;display: grid;
    -ms-grid-columns: 1fr 20px 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    max-height: 360px;
    overflow-y: auto;
    padding-right: 10px;
    margin-top: 10px
}

.tooltipBody #tooltip-character-list .character-entry {
   display: -webkit-box;
   display: -webkit-flex;
   display: flex;
   padding: 6px;
   -webkit-box-pack: justify;
   -webkit-justify-content: space-between;
    justify-content: space-between;
   background: var(--color-foreground2);
   border: var(--border) solid var(--border-color);
   -webkit-border-radius: var(--border-radius);
   border-radius: var(--border-radius);
   -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
   box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}


.tooltipBody #tooltip-character-list .character-container,
.tooltipBody #tooltip-character-list .va-container {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    gap: 8px;
    max-width: 50%;
}

.character-name-container,
.va-name-container {
    display: -ms-grid;
    display: grid
}

.va-name-container {
   text-align: right
}

.tooltipBody #tooltip-character-list .va-container  {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

.tooltipBody #tooltip-character-list .character-image,
.tooltipBody #tooltip-character-list .va-image {
    width: 42px;
    aspect-ratio: auto 42 / 62;
    height: 62px;
    aspect-ratio: auto 42 / 62;
}

.tooltipBody #tooltip-character-list .character-name,
.tooltipBody #tooltip-character-list .va-name {
    font-weight: bold
}

.maljsBlogDiv {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 97%;
    margin-top:5px;
    padding: 10px 20px 50px 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations {
    background: var(--color-foreground3);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    width: 100%;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations div {
    color: var(--color-text) !important;
    margin-bottom:0!important;
    padding-right: 5px;
    display: inline-block;
    margin-left: 10px !important;
    margin-right: -10px !important;
    width: 98%;
    max-height: 110px;
    overflow: scroll;
}

.maljsBlogDivRelations div::before {
    margin-top:9px
}

.maljsBlogDivRelations a {
    background: var(--color-foreground2)!important;
    border-radius: var(--br) !important;
    padding: 6px !important;
    display: inline-table;
    margin: 2px
}

.page-common .maljsBlogDiv .maljsBlogDivHeader .lightLink {
    color:var(--color-link)!important;
    font-size: .9rem!important;
    margin-top:-4px
}

.maljsBlogDivContent {
    background: var(--color-foreground)!important
}

#myanimelist .blockUserIcon {
    font-family: "Font Awesome 6 Pro";
    float: right;
    z-index: 10;
    color: var(--color-link) !important;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer
}

.blogMainWide {
    display:block;
    height:100%!important;
    max-height:600px!important;
    width:100%!important;
    min-width:1020px;
    background: var(--color-foreground) !important;
    border: 1px solid var(--border-color) !important;
    padding: 10px!important;
    margin-bottom: 20px!important;
    box-sizing: border-box;
}

.user-genres .user-genres-container {
    padding: 10px;
    background: var(--color-foreground);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    text-align: center;
}

.user-genres .user-genres-inner {
    display: -ms-inline-grid;
    display: inline-grid;
    grid-auto-flow: column;
    -webkit-justify-content: space-around;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    min-width: 420px;
    gap: 8px
}

.user-genres .user-genres-inner .user-genre-div {
    text-align: center
}

.user-genres .user-genres-inner .user-genre-div .user-genre-name {
    padding: 6px 16px;
    margin-bottom: 8px;
    background: var(--color-foreground2);
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
}

.user-genres .user-genres-inner .user-genre-div .user-genre-count p {
    display: inline-block;
    font-size: .6rem;
    color: var(--color-main-text-light)
}

.favThemes img {
    width: 40px
}

.favThemes .flex2x .fav-theme-container .favThemeSongTitle {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px
}
.customProfileEls .custom-el-container .editCustomEl,
.customProfileEls .custom-el-container .sortCustomEl,
.customProfileEls .custom-el-container .removeCustomEl,
.favThemes .fav-theme-container .sortFavSong,
.favThemes .fav-theme-container .removeFavSong {
    display: none;
    font-family: 'FontAwesome';
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 6px;
    height: 4px;
    font-size: 8px
}

.customProfileEls .custom-el-container .sortCustomEl,
.favThemes .fav-theme-container .sortFavSong {
    right:15px
}

.customProfileEls .custom-el-container .editCustomEl {
    right:30px
}

.customProfileEls .custom-el-container .sortCustomEl.selected,
.favThemes .fav-theme-container .sortFavSong.selected {
    color: var(--color-link);
    display: block!important
}

.loadmore:hover,
.customProfileEls .custom-el-container .editCustomEl:hover,
.customProfileEls .custom-el-container .sortCustomEl:hover,
.customProfileEls .custom-el-container .removeCustomEl:hover,
.favThemes .fav-theme-container .sortFavSong:hover,
.favThemes .fav-theme-container .removeFavSong:hover {
    color: var(--color-link)
}
.customProfileEls .custom-el-container:hover .editCustomEl,
.customProfileEls .custom-el-container:hover .sortCustomEl,
.customProfileEls .custom-el-container:hover .removeCustomEl,
.favThemes .fav-theme-container:hover .sortFavSong,
.favThemes .fav-theme-container:hover .removeFavSong {
    display: block !important
}

.customProfileEls .custom-el-container:hover .sortCustomEl.hidden,
.favThemes .fav-theme-container:hover .sortFavSong.hidden{
     display: none !important
}

.customProfileEls .flex2x .custom-el-container .custom-el-inner,
.favThemes .flex2x .fav-theme-container {
    background: var(--color-foreground);
    padding: 10px;
    margin-bottom: 10px;
    min-height: 55px;
    height: 100%;
    min-width: 375px;
    max-width: 375px
}

.customProfileEls .custom-el-container {
    position: relative
}

.customProfileEls .custom-el-container .custom-el-inner {
    background: var(--color-foreground);
}

.customProfileEls .custom-el-container .custom-el-inner,
.favThemes .fav-theme-container {
    position: relative;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin-bottom: 10px
}

.favThemes video {
    width: 100%
}

.favThemes .video-container {
    margin-top: 10px;
    display: none
}

.favThemes .fav-theme-header {
    width: 99%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: center;
}

.favThemes .flex2x .fav-theme-header h2 {
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px;
    font-size: 0.68rem!important;
    padding-bottom: 5px!important;
}

.favThemes .fav-theme-header h2 {
    cursor: default;
    -webkit-border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    -webkit-border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    -o-border-image: -o-linear-gradient(left, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
}

.favThemes .fav-theme-inner {
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 50px 1fr;
    grid-template-columns: 50px 1fr
}

.favThemes .flex2x{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    gap: 0px 10px;
    margin: 5px 0px;
    -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap
}

.user-profile-about a[href*="/custombg"],
.user-profile-about a[href*="/custompf"],
.user-profile-about a[href*="/customCSS"] {
    display: none
}

.filterList_TagsContainer .tag-link {
    cursor: pointer;
    word-break: break-word;
    display: block;
    width: 97%;
    background: var(--color-foreground3);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-left: -5px;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.filterList_TagsContainer .tag-link.clicked {
    background: var(--color-foreground4);
    border: var(--border) solid var(--border-color);
}

.filterList_TagsContainer .tag-link:hover {
    background: var(--color-foreground2)
}

.filterList_GenresFilter input[type="checkbox"] {
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    vertical-align: middle;
    left: -2px;
    -webkit-appearance: none;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    content: "";
    position: absolute;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto !important;
    height: 10px;
    width: 10px;
    background: var(--color-link2) !important
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    font-family: fontAwesome;
    content: "\\f00c";
    margin-left: 4px !important;
    color: var(--color-link) !important;
    background: none !important
}

i.tags-container-clear.fa.fa-close,
i.year-filter-clear.fa.fa-close {
    display: none;
    font-family: 'FontAwesome';
    background: var(--color-foreground4);
    padding: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    float: right;
    cursor: pointer;
    margin-right: 83%;
    margin-top: -2px;
    margin-bottom: 0px
}

.year-filter-slider-container {
    margin-top: -4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px
}

input#year-filter-slider {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding: 0 !important
}

.cover-position-slider-container {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 10px 1fr 10px 1fr;
    grid-template-columns: 10px 1fr 10px 1fr;
    width: 285px;
    justify-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 5px
}

.genreDropBtn {
    color:var(--color-main-text-normal);
    width: 100%;
    border: 0;
    background: var(--color-foreground2);
    padding: 8px;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    margin: 5px 0px
}
.maljsBlogDivRelations a:hover,
#maljsDraw3x3:hover,
.compareBtn:hover,
.sort-container #sort-asc:hover,
.sort-container #sort-desc:hover,
.genreDropBtn:hover {
    background: var(--color-foreground4)!important
}

#maljs-dropdown-content {
    display: none;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    background: var(--color-foreground);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    min-width: 160px;
    -webkit-box-shadow: 0px 8px 16px 0px var(--shadow-color);
    box-shadow: 0px 8px 16px 0px var(--shadow-color);
    z-index: 1;
    height: 175px;
    overflow: auto
}

.maljs-dropdown-content label {
    margin: 2px;
    padding: 7px 0px;
    display: block;
    align-content: center
}

.maljs-dropdown-content label:hover {
    background: var(--color-foreground4)
}

.maljs-dropdown-content label:has(input.genre-filter:checked) {
    background: var(--color-foreground2);
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.list-entries .status-section {
    background: var(--color-foreground);
    border-radius: var(--border-radius)
}

.filterLists-back {
    width: 25px;
    text-align: center;
    margin-top: -67px;
    font-family: 'FontAwesome';
    cursor: pointer;
    position: absolute;
    background: var(--color-foreground);
    padding: 6px;
    -webkit-border-top-left-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    -webkit-border-top-right-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    border-bottom:0
}

.filterListsDivContainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}

.filterListsDiv {
    width: auto;
    display: block;
    margin-top: -5px
}

.filterListsCount {
    width: 90px;
    line-height: 19px;
    color: var(--color-main-text-light);
    margin-top: -5px
}

.list-entries .entry {
    position: relative
}

.list-entries .entry:hover {
    background: var(--color-foreground2)
}

.list-entries .entry .edit {
    height: 40px;
    width: 40px;
    position: absolute;
    background: #00000070;
    display: block;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    font-family: fontAwesome;
    opacity: 0;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}

.list-entries .entry:hover .edit {
    opacity: 1
}

.list-entries .entry:hover .cover .image {
    display: block;
    height: 200px;
    left: -160px;
    padding: 0;
    position: absolute;
    top: -60px;
    width: 140px;
    z-index: 1;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    overflow: hidden;
    max-width: -webkit-max-content;
    max-width: -moz-max-content;
    max-width: max-content;
    min-width: 0;
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: 4px solid var(--border-color)
}

.maljsDisplayBox {
    overflow: hidden;
    position: fixed;
    top: 65px;
    left: 20px;
    z-index: 9999;
    padding: 20px;
    background-color: rgb(var(--color-foreground));
    border: 1px solid var(--border-color);
    border-radius: 4px;
    -webkit-box-shadow: 0 0 15px var(--shadow-color) !important;
    box-shadow: 0 0 15px var(--shadow-color) !important;
    background: var(--color-background);
    height: 85%;
}

.maljsDisplayBoxTitle {
    font-size: 15px;
    border-bottom: 1px solid var(--border-color);
    display: block;
    margin-bottom: 10px;
    padding: 3px
}

input.maljsNativeInput {
    margin-bottom: 5px;
    border: 1px solid var(--border-color)
}

.maljsDisplayBox .scrollableContent p {
    margin: 10px 0px !important
}

.maljsDisplayBox .scrollableContent {
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    scrollbar-width: thin;
    margin-top: 5px;
    padding: 30px;
    padding-top: 15px;
    scrollbar-width: auto
}

.maljsDisplayBoxClose {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 15px;
    height: 18px;
    text-align: center;
    background-color: #852325;
    font-weight: bold;
    border: solid;
    border-width: 1px;
    border-radius: 2px;
    color: var(--color-main-text-normal);
    z-index: 20;
}

.maljsResizePearl {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 20px;
    height: 20px;
    border: solid;
    border-radius: 10px;
    background: rgb(var(--color-foreground));
    cursor: se-resize
}

.container-left>#filter,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-top: -8px;
    background: var(--color-foreground);
    padding: 15px;
    border-radius: var(--border-radius)
}

.container-left>#filter .filterLists,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter .filterLists {
    display: block;
    cursor: pointer;
    padding: 3px;
    width: 70px
}

.container-left > #filter #filter-input,
.sort-container #sort-asc,
.sort-container #sort-desc {
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: 1px solid var(--border-color);
}

.sort-container #sort-asc,
.sort-container #sort-desc,
#maljsDraw3x3,
.compareBtn {
    color:var(--color-main-text-normal);
    background: var(--color-foreground2);
    padding: 10px;
    border-radius: var(--border-radius);
    display: block;
    margin-top: 5px;
    cursor: pointer;
    width: auto;
    display: inline-block
}

.compareBtn {
    float: right;
    text-align: center
}

#filter>input#filter-input {
    width: 94%
}

.list-entries .entry .cover,
.list-entries .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox
}

.list-entries .row {
    border-color: var(--border-color);
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.list-entries .entry .cover {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    max-width: 60px;
    min-width: 60px;
    padding: 0
}

.list-entries .entry .cover .image {
    object-fit: cover;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    height: 40px;
    width: 40px
}

.list-entries .entry .airing-dot {
    position: relative;
    left: -6.5px;
    width: 6.5px;
    height: 6.5px;
    border-radius: 10px;
    background: #7bd555;
    box-shadow: 0 0 5px rgba(123, 213, 85, .8);
    -webkit-transition: .15s;
    -o-transition: .15s;
    transition: .15s;
    opacity: 1
}

.list-entries .row:hover .airing-dot {
    opacity:0;
}

.list-entries .entry .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 15px;
    text-align: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    word-break: break-word
}

.list-entries .entry .title a {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
    margin-right: auto
}

.list-entries .entry>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 18px 20px;
    text-align: center
}

.list-entries .list-head>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 20px;
    text-align: center;
    font-weight: 700
}

.list-entries .list-head .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 75px;
    text-align: left
}

.list-entries .section-name {
    border-bottom: 1px solid var(--border-color)!important;
    padding: 10px!important;
    margin: 0!important;
    margin-bottom: 0!important;
    font-weight:bold!important
}

.list-entries .entry.row.hidden {
    display: none
}

.list-entries .status-section {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-bottom: 10px;
    padding-bottom: 10px
}

.list-head.row {
    margin-bottom: -10px
}

.mainbtns.tooltip .title-note-inner, 
.mainbtns.disabled .title-note-inner, 
.list-entries .title-note-inner {
    display:none;
    position: absolute !important;
    background: var(--color-background);
    z-index: 10;
    padding: 10px;
    margin: -26px 0 0 20px;
    max-width: 420px;
    -webkit-box-shadow: 0 0 10px var(--shadow-color) !important;
    box-shadow: 0 0 10px var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
            border-radius: var(--border-radius)
}

.mainbtns.tooltip .title-note-inner, 
.mainbtns.disabled .title-note-inner {
    background: var(--color-foreground2);
}

.mainbtns.disabled .title-note-inner {
  background: #633232
}

.mainbtns.tooltip:hover .title-note-inner,
.mainbtns.disabled .title-note-inner {
    width: 420px;
    left: 12px
}

.list-entries .user-note {
    width: 20px;
    margin: 0 -15px 0 5px
}

.mainbtns.tooltip:hover .title-note-inner,
.mainbtns.disabled:hover .title-note-inner,
.list-entries .user-note:hover .title-note-inner {
    display:block
}

.RelatedEntriesDiv {
    height: 45px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between
}

.relationsTarget {
    width:100%;
    overflow:hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block
}
    
.relationsTarget > .relationWrapper {
    display: -ms-grid!important;
    display: grid!important;
    grid-template-columns: repeat(auto-fill, minmax(90px, -webkit-max-content));
    grid-template-columns: repeat(auto-fill, minmax(90px, max-content));
    -webkit-justify-content: space-around;
    justify-content: space-around;
    gap: 10px
}

.relations-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    float: right;
    margin: 5px 5px 0 auto
}

.relationEntry {
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    float: left;
    opacity: 1;
    width: 85px;
    min-width:85px;
    min-height:120px;
    overflow: hidden;
    position: relative;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out
}

.relationTitle {
    border-bottom: 2px solid;
    -webkit-transition: .3s;
    transition: .3s;
    width: 100%;
    background: var(--color-foreground2);
    -webkit-align-content: center;
    align-content: center;
    bottom: 0;
    height: 35px;
    color: var(--color-main-text-normal);
    font-size: 9.5px;
    font-weight: bold;
    left: 0;
    position: absolute;
    text-align: center;
    opacity: .95;
    -webkit-border-bottom-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    -webkit-border-bottom-right-radius: var(--br);
    border-bottom-right-radius: var(--br)
}

.relationImg {
    width: 85px;
    height: 120px;
    -webkit-transition: .3s;
    transition: .3s
}

.relationEntry:hover {
    overflow: visible !important
}

.relationEntry:hover .relationImg {
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.relationEntryRight:hover .relationImg {
    -webkit-border-top-left-radius: 0 !important;
    border-top-left-radius: 0 !important;
    -webkit-border-bottom-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    -webkit-border-top-right-radius: var(--br) !important;
    border-top-right-radius: var(--br) !important;
    -webkit-border-bottom-right-radius: var(--br) !important;
    border-bottom-right-radius: var(--br) !important
}

.relationEntry:hover .relationTitle {
    opacity: 0
}

.relationDetails {
    -webkit-transition: .3s;
    transition: .3s;
    display:none;
    position: absolute;
    top: 0;
    left:0;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    max-width: 300px;
    height: 100px;
    padding: 10px;
    background: var(--color-foregroundOP2);
    z-index: 5;
    text-align: start;
    -webkit-border-top-right-radius: var(--br);
    border-top-right-radius: var(--br);
    -webkit-border-bottom-right-radius: var(--br);
    border-bottom-right-radius: var(--br);
}

.relationDetails.relationEntryRight {
    text-align: end;
    -webkit-border-bottom-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    -webkit-border-top-left-radius: var(--br);
    border-top-left-radius: var(--br);
    -webkit-border-bottom-right-radius: 0;
    border-bottom-right-radius: 0;
    -webkit-border-top-right-radius: 0;
    border-top-right-radius: 0
}

.relationDetailsTitle {
    height: 67px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    color: var(--color-main-text-normal)
}

#relation-hover-portal {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    margin: 0 !important;
    padding: 0 !important
}
    
.aniTagDiv .category-group,
.aniTagDiv {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr;
    grid-template-columns: 1fr;
    grid-gap: 6px
}

.aniTag {
    position: relative;
    overflow: visible!important;
    cursor: default;
    display: -webkit-box;
    display: flex;
    background-color: var(--color-foreground);
    border-radius: var(--br);
    padding: 7px;
    -webkit-box-pack: justify;
    justify-content: space-between
}

.aniTagDiv .category-group.spoiler-group,
.aniTag.spoiler {
    display: none
}

.showSpoilers {
    cursor: pointer
}

.showSpoilers,
.aniTag.spoiler .aniTag-name {
    color: #d98080;
    font-weight: 600
}

.aniTag-category {
    margin: 10px 0 4px 0;
}

.aniTag-percent {
    color: var(--color-main-text-light)
}

.aniTag::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 0;
  background: var(--color-foreground4);
  color: var(--color-text);
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-line;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  max-width: 210px;
}

.aniTag:hover::after {
  opacity: 1;
}

#content>table>tbody>tr>td:nth-child(2)>div.rightside.js-scrollfix-bottom-rel>div.h1.edit-info,
#content>table>tbody>tr>td.borderClass>div>div>div:nth-child(1),
#content>table>tbody>tr>td.borderClass>div>div:nth-child(1) {
    z-index: 1;
    position: relative
}

.bannerHover {
    width: 220px;
    height: 80px;
    position: absolute;
    bottom: 0px;
    left: 18px;
    z-index: 1
}

.bannerShadow {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(6, 13, 34, .1)), color-stop(50%, rgba(6, 13, 34, 0)), to(rgba(6, 13, 34, .6)));
    background: -o-linear-gradient(top, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    background: linear-gradient(180deg, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0px
}

.bannerImage {
    width: 100%;
    height: 100%
}

@supports (object-fit: cover) {
    .bannerImage {
        object-fit: cover;
        max-height: 240px
    }

    .relationImg {
        object-fit: cover
    }
}

.bannerDiv {
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    max-height: 435px;
    position: relative;
    width: auto;
    margin: -30px -10px 0 -10px
}

.aniLeftSide {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    position: relative;
    padding-top: 0 !important;
    top: -85px
}

.aniTag,
.aniTag::after,
.spaceit-shadow-end,
.spaceit-shadow-end-div,
.spaceit-shadow {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

.aniTag,
.spaceit-shadow-end,
.spaceit-shadow-end-div{
    overflow: hidden
}

.spaceit-shadow-end-div {
    padding: 2px;
    background: var(--color-foreground)
}

.fa-info-circle:before {
    text-shadow: rgb(0 0 0 / 70%) 0px 0px 2px;
}

#currently-popup {
    height: 425px;
    width: 674px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: var(--color-foregroundOP2);
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

#currently-popup iframe {
    width: 100%;
    height: 100%;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    border: 1px solid var(--border-color)
}

#currently-popup .popupBack {
    left: 6px;
    right: inherit !important;
    font-family: FontAwesome;
    float: left;
    padding: 0px 0px 5px 0px
}

#currently-popup .dataTextDiv {
    max-height: 145px;
    overflow: auto;
    word-break: break-all;
    background: var(--color-foreground4);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin: 10px
}

#widget-currently-watching .btn-anime,
#widget-currently-reading .btn-anime,
#recently-added-anime .btn-anime,
#recently-added-manga .btn-anime {
    background-color: var(--color-foreground2)
}

.rec-info-wrapper.btn-anime {
    display: inline-table;
    width: 124px;
    position: relative;
}

.widget.seasonal.left .btn-anime i,
.widget.anime_suggestions.left .rec-info-wrapper i,
.widget.manga_suggestions.left .rec-info-wrapper i {
    font-family: "Font Awesome 6 Pro";
    position: absolute;
    right: 3px;
    top: 3px;
    padding: 4px;
    opacity: 0;
    transition: 0.4s;
    z-index: 20;
    cursor: pointer;
}

.widget.anime_suggestions.left .rec-info-wrapper i,
.widget.manga_suggestions.left .rec-info-wrapper i {
    right: 8px
}

.rec-info-wrapper.btn-anime:hover i,
#widget-currently-watching > div.widget-slide-outer > ul > li:hover span.epBehind,
#recently-added-anime .btn-anime:hover i,
#recently-added-manga .btn-anime:hover i,
#recently-added-anime .btn-anime:hover .recently-added-type,
#recently-added-manga .btn-anime:hover .recently-added-type,
.widget.seasonal.left .btn-anime:hover i,
#widget-currently-watching .btn-anime:hover i,
#widget-currently-reading .btn-anime:hover i {
    opacity: .9 !important
}

.rec-info-wrapper.btn-anime .link,
#recently-added-anime li.btn-anime .link,
#recently-added-manga li.btn-anime .link,
#currently-watching li.btn-anime .link,
#currently-reading li.btn-anime .link {
    position:relative
}

#recently-added-anime li.btn-anime span,
#recently-added-manga li.btn-anime span,
#currently-watching li.btn-anime span,
#currently-reading li.btn-anime span {
    opacity: 0;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2em;
    width: calc(100% - 9.5px);
    max-height: 4.45em
}

#recently-added-anime li.btn-anime:hover span,
#recently-added-manga li.btn-anime:hover span,
#currently-watching li.btn-anime:hover span,
#currently-reading li.btn-anime:hover span {
     opacity: 1
}

#recently-added-anime-load-more,
#recently-added-manga-load-more {
    width: 124px;
    height: auto;
    min-height: 101px;
    display: inline-block;
    text-align: center;
    background: var(--color-foreground2);
    align-content: center;
    cursor: pointer
}

.currently-loading-indicator {
    background: var(--color-main-text-light)!important;
    margin-top: -5px
}

.recently-genre-indicator {
  height: 3px;
  background-color: var(--color-foreground4);
  width: 100%;
  -webkit-animation: loadingBar 2s ease-in-out infinite;
          animation: loadingBar 2s ease-in-out infinite;
  grid-column: 1 / -1;
  display: none;
}

@-webkit-keyframes loadingBar {
  0% { -webkit-transform: scaleX(0); transform: scaleX(0); -webkit-transform-origin: left; transform-origin: left; }
  100% { -webkit-transform: scaleX(1); transform: scaleX(1); -webkit-transform-origin: left; transform-origin: left; }
}

@keyframes loadingBar {
  0% { -webkit-transform: scaleX(0); transform: scaleX(0); -webkit-transform-origin: left; transform-origin: left; }
  100% { -webkit-transform: scaleX(1); transform: scaleX(1); -webkit-transform-origin: left; transform-origin: left; }
}

.editCurrently,
.incButton {
font-family: "Font Awesome 6 Pro";
    position: absolute;
    right: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 4px;
    border-radius: 5px;
    opacity: 0;
    transition: 0.4s;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.incButton {
   top: 26px
}

.customCover {
   max-width: 225px!important;
}

#customCoverPreview > .js-picture-gallery {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    width: 300px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between
}

#customAddContainer.right {
   z-index: 2;
   position: relative;
   margin-bottom: 10px
}

#customAddContainer #custom-preview-div {
   border-bottom: 1px solid var(--border-color);
   margin-bottom: 10px
}

.malCleanSettingPopup .settingContainer.input input,
.malCleanSettingPopup .settingContainer.input select,
#customAddContainerInside input#header-input,
#customAddContainerInside textarea#content-input {
    width: 95%;
    max-width: 95%;
    background-color: var(--color-foreground);
    border: 1px solid var(--border-color);
    padding: 10px;
    border-radius: 4px;
    margin: 5px 0px
}

.malCleanSettingPopup .settingContainer.input select {
    width: 100%;
    max-width: 100%
}

.malCleanSettingPopup .settingContainer.input input {
    background-color: var(--color-foreground2)
}

#customAddContainer.right #customAddContainerInside input#header-input {
   width: 97%;
   max-width: 97%;
}

#customAddContainerInside textarea#content-input {
    min-height: 100px
}

#custom-preview-div-bb > div,
#custom-preview-div-bb-def > div,
#customAddContainer #custom-preview-div > div {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 95%;
    padding: 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

#custom-preview-div-bb-def > div {
    background: var(--color-foreground2);
}

#customProfileEls .custom-el-container > .custom-el-inner *,
#customAddContainer #custom-preview-div > div * {
    max-width: 415px
}

#customAddContainer.right #custom-preview-div > div {
    width: 97%;
}

#customProfileEls.right .custom-el-container > .custom-el-inner *,
#customAddContainer.right #custom-preview-div > div * {
    max-width: 777px
}

#customProfileEls .custom-el-container > .custom-el-inner.notAl * {
    max-width: 791px
}

div#custom-preview-div > div blockquote:not(.spoiler) {
    background: var(--color-foreground2);
    padding: 10px;
    margin: 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

.custom-el-container .custom-el-inner blockquote.spoiler,
div#custom-preview-div blockquote.spoiler {
    margin: 5px
}

#customAddContainer #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 405px !important
}

#customAddContainer.right #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 777px !important
}

#customAddContainerInside .sceditor-button-youtube div:before {
    color: rgb(232, 93, 117) !important
}

#customAddContainerInside .sceditor-button-video div:before {
    content: "\\f03d"
}

#customAddContainerInside .sceditor-button-iframe div:before {
    content: "\\e495"
}

#customAddContainerInside .sceditor-button-div div:before {
    content: "\\f0c8";
    font-weight: 500
}

#currently-popup .popupBack,
#currently-closePopup {
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer
}

.currentlyGrid,
.recentlyGrid {
    width: 100%;
    display: -ms-grid;
    display: grid!important;
    justify-items: center;
}

.currentlyGrid6Column .btn-anime,
.recentlyGrid6Column .btn-anime {
    min-height: 146px;
    max-height: 146px;
}

.currentlyGrid6Column img.lazyloaded,
.recentlyGrid6Column img.lazyloaded  {
    width: 100px;
    height: 146px;
    max-height: 146px
}

.airingInfo {
    color: var(--color-text);
    transition: .4s;
    text-align: center;
    background-color: ${fgOpacity};
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%
}

.behindWarn {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0)), to(rgba(232, 93, 117, .49)));
    background: -o-linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4px;
    opacity: .8
}

.recently-added-type,
.epBehind {
    color: var(--color-main-text-op);
    position: absolute;
    left: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 2px 4px !important;
    border-radius: 5px;
    width: auto!important;
    max-width: calc(100% - 34px)!important
}

.airingInfo div:first-child:after {
    content: "";
    display: block;
    height: 3px;
    width: 0
}

.widget.anime_suggestions.left #widget-currently-reading a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-reading a:hover .airingInfo,
.widget.anime_suggestions.left #widget-currently-watching a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-watching a:hover .airingInfo {
    opacity: 0;
}

.widget-slide-block:hover #currently-left-recently-added-anime.active,
.widget-slide-block:hover #currently-left-recently-added-manga.active,
.widget-slide-block:hover #currently-left-manga.active,
.widget-slide-block:hover #currently-left.active {
    left: 0 !important;
    opacity: 1 !important
}
.widget-slide-block:hover #currently-right-recently-added-anime.active,
.widget-slide-block:hover #currently-right-recently-added-manga.active,
.widget-slide-block:hover #currently-right-manga.active,
.widget-slide-block:hover #currently-right.active {
    right: 0 !important;
    opacity: 1 !important
}

.embed-loading {
  position: relative;
}

.embed-loading .embed-container{
    min-width: 240px;
    max-height: 60px;
    justify-content: center;
}

.embed-placeholder {
    display: inline-block;
    height: 100%;
    width: 0;
    visibility: hidden;
}

.embed-loading .embed-inner {
    width: 100%;
}

#content .embed-loading .embed-image {
    background: var(--color-foreground4);
    width: 50px !important;
    height: 60px !important;
}

body #content .embed-loading .spinner {
    width: 15px;
    height: 15px;
    border: 3px solid #ccc !important;
    border-top-color: #666 !important;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 50% auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.embed-link {
    width: max-content;
    line-height: 1.16rem;
    margin: 5px 1px;
    display: inline-block;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.embed-link .embed-container.no-genre .genres {
    display: none
}

.embed-link .embed-container:not(.no-genre) div {
    transition: opacity 0.3s ease-in-out;
}

.embed-link .embed-container:not(.no-genre) .genres {
    margin-bottom: -18.5px;
    opacity: 0
}

.embed-link .embed-container:not(.no-genre):hover .genres {
    opacity: 1
}

.embed-link .embed-container:not(.no-genre):hover .details {
    opacity: 0
}

.embed-link .embed-title {
    font-weight: bold;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
}

#content .embed-link .embed-image {
    width: 40px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    margin-right: 10px;
    margin-left: -10px;
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.embed-link .embed-container {
    color: var(--color-text);
    align-items: center;
    text-align: center;
    width: max-content;
    min-height: 55px;
    background-color: var(--color-foreground2);
    padding: 0px 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden;
}

.forum .replied.show .embed-container,
.quotetext .embed-container {
    background-color: var(--color-foreground);
}

.tooltipBody {
    display: none;
    background-color: var(--color-foreground);
    border-radius: 5px;
    -webkit-box-shadow: 0 0 10px var(--shadow-color) !important;
    box-shadow: 0 0 10px var(--shadow-color) !important;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-top: 5px
}

.tooltipBody.grid {
    background-color: var(--color-foreground2);
    z-index:222
}

.tooltipBody .main {
    margin: 0 !important;
    padding: 10px
}

.tooltipBody .text b {
    margin-bottom: 2px;
    display: inline-block
}

.tooltipDetails {
  display:none
}

.malCleanMainContainer {
    right: 0;
    width: 520px;
    height: 86vh;
    margin-right: 10px;
    -webkit-transition: height 0.4s;
    -o-transition: height 0.4s;
    transition: height 0.4s;
    position: fixed;
    top: 55px;
    z-index: 100;
    background: var(--color-foregroundOP);
    overflow-y: auto;
    display: -ms-grid;
    display: grid;
    color: var(--color-text);
    padding: 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    -webkit-border-radius: 10px;
            border-radius: 10px
}

@media (max-width: 768px) {
    .malCleanMainContainer {
        height: 75vh
    }
}

@media (max-width: 480px) {
    .malCleanMainContainer {
        height: 70vh
    }
}

.malCleanSettingContainer {
    margin-top: 10px;
    width: auto
}

.malCleanSettingPopup {
    display: inline-grid;
    padding: 10px;
    background: var(--color-foreground4);
    border-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    grid-column: 1 / -1;
    margin-bottom: 5px;
    grid-column: 1/-1
}

.malCleanMainContainer > .malCleanSettingContainer:nth-child(2) {
    margin-top: 85px
}

.mainListBtnDiv,.malCleanSettingPopup .settingContainer.svar {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 35px auto auto 1fr;
    grid-template-columns: 35px auto auto 1fr;
    -webkit-box-pack: start;
    -webkit-justify-content: start;
    -ms-flex-pack: start;
    justify-content: start;
    gap:5px
}

.malCleanSettingPopup .settingContainer.svar {
    -ms-grid-columns: 35px auto;
    grid-template-columns: 35px auto
}

.malCleanSettingPopup .settingContainer.slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
}

.malCleanSettingPopup .settingContainer.slider label {
  display: block;
  width: 100%;
}

.malCleanSettingPopup .settingContainer .sliderRow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.malCleanSettingPopup .settingContainer .sliderInput {
  flex: 1;
}

.malCleanSettingPopup .settingContainer .sliderValue {
   min-width: 20px;
   text-align: left;
}

.mainListBtnDiv .fa-gear {
   font-family: "Font Awesome 6 Pro";
   cursor:pointer;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center
}

.malCleanLoader,
.malCleanMainContainerList .malCleanSettingButtons .removeButton,
.malCleanMainContainer .malCleanMainHeaderTitle #dragButton,
.malCleanMainContainer .malCleanMainHeaderTitle #innerSettingsButton,
.malCleanMainContainer .malCleanMainHeaderTitle #reloadButton,
.malCleanMainContainer .malCleanMainHeaderTitle #closeButton {
    font-family: fontAwesome
}

.textpb {
    padding-top: 5px !important;
    font-weight: bold
}

.textpb a {
    color: rgb(var(--color-link)) !important
}

.malCleanMainHeader {
    font-size: 1rem;
    padding-bottom: 5px
}

.malCleanMainHeaderNav {
    display: -ms-grid;
    display: grid;
    grid-auto-flow: column;
    width: 100%
}

.malCleanMainContainerList { 
    display: inline-block;
    padding-right: 6px;
    overflow-y: auto;
    overflow-x: hidden
}

.malCleanMainContainerList::-webkit-scrollbar-thumb,
.malCleanMainContainerList::-webkit-scrollbar {
    background: var(--color-background);
    -webkit-border-radius: 4px;
    border-radius: 4px
}

.malCleanMainContainerList::-webkit-scrollbar-corner,
.malCleanMainContainerList::-webkit-scrollbar-track {
    background: #fff0
}

.malCleanMainContainerList::-webkit-scrollbar-thumb {
    background: var(--color-foreground4)
}

.malCleanMainHeaderTitle {
    width: 100%;
    display: -ms-inline-grid;
    display: inline-grid;
    -ms-grid-columns: 75% auto auto auto auto;
    grid-template-columns: 75% auto auto auto auto;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.malCleanSettingInnerSettings.malCleanSettingPopup {
    width: 95%
}
  
.malCleanSettingInnerSettings.malCleanSettingPopup .setting-section {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    gap: 10px
}

#currently-popup .dataTextButton,
.mainbtns.disabled,
.mainbtns {
    -webkit-transition: 0.25s;
    -o-transition: 0.25s;
    transition: 0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin: 4px;
    cursor: pointer;
    background-color: var(--color-background);
    color: var(--color-text)
}

.mainbtns.disabled:before,
.mainbtns.disabled:hover {
    background: 0 0 !important
}

.malCleanMainContainer .mainbtns:hover,
#currently-popup .dataTextButton:hover {
    -webkit-transform: scale(1.04);
    -ms-transform: scale(1.04);
    transform: scale(1.04)
}

.btn-active {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.malCleanSettingPopup .settingContainer.svar .btn-active {
    background-color: var(--color-foreground2) !important;
    color: rgb(159, 173, 189)
}

.btn-active:before {
    font-family: 'Font Awesome 6 Pro';
    content: "\\f00c"
}

.mainbtns.disabled:before {
    font-family: 'Font Awesome 6 Pro';
    content: "\\f05e"
}

#myanimelist .malCleanMainContainer .mainListBtnDiv .fa-gear.disabled {
    pointer-events: none;
    color: var(--color-main-text-light) !important;
}

.btn-active-def {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.btn-active-def-2 {
    background-color: var(--color-foreground2) !important;
    color: rgb(159, 173, 189)
}

@keyframes reloadLoop {
    0% {
        background-color: var(--color-background);
    }

    50% {
        background-color: var(--color-foreground4);
    }

    100% {
        background-color: var(--color-background)
    }
}

.display-none {
    display: none !important
}

.customColorsInside {
    gap:10px;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr
}

.customColorsInside .colorGroup .colorOption {
    margin-top: 5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 5px
}

.customColorsInside .colorGroup .colorOption input{
    cursor: pointer
}
.user-history-title {
    width: 80%;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center
}

.user-history-date {
    width:25%;
    text-align: right
}
  
.user-history-cover-link {
     margin-left: -10px;
     height: 70px;
     width:50px;
     margin-top: -10px;
     margin-right: 10px;
     padding-right: 5px
}

.user-history-cover {
    background-size:cover;
    height: 70px;
    width:50px;
    object-fit: cover;
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.user-history {
    height: 50px;
    background-color: var(--color-foreground);
    margin: 10px 5px;
    padding: 10px;
    border:var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden
}

.user-history-main .loadmore {
    cursor: pointer;
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    margin-bottom: 25px;
    z-index: 2;
    position: relative
}

body .malCleanMainContainerList .malCleanSettingButtons {
    display: -ms-grid;
    display: grid;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 10px
}

body .malCleanMainContainerList .malCleanSettingButtons button,
body .malCleanMainContainerList .malCleanSettingButtons input {
    background: var(--color-background);
    height: 40px;
    width: auto;
    margin: 4px;
    border: 1px solid var(--border-color);
    border-radius: 4px
}

.malCleanMainContainerList input:focus-visible {
    outline: 2px solid var(--color-foreground4)!important
}

.malCleanMainContainer .malCleanSettingContainer h2 {
    font-size: 13px!important;
    background: var(--color-foreground2);
    border-radius: var(--br);
    padding: 5px!important
}

.malCleanMainContainer .malCleanSettingContainer h3 {
    font-weight: 500!important
}

#myanimelist .malCleanMainContainer .malCleanSettingContainer textarea {
    resize: vertical;
    height: 18px;
    min-height: 18px;
    padding: 10px;
    background: var(--color-foreground2)!important;
}

.anisong-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.anisongs .theme-songs.js-theme-songs {
    margin-bottom: 5px
}

.anisongs video {
    width: 100%;
    margin-top: 10px
}

.anisongs .oped-preview-button.oped-preview-button-gray {
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin-bottom: -3px;
    width: 15px;
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%) !important;
    filter: invert(100%) hue-rotate(180deg) brightness(75%) !important
}

.theme-songs.js-theme-songs.has-video .fa-star {
    font-family: FontAwesome;
    opacity: .1;
    display: inline;
    margin-left: 5px;
    cursor: pointer;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.theme-songs.js-theme-songs.has-video:hover .fa-star {
    opacity: 1
}

.fa-solid.fa-rotate-right {
    cursor: pointer;
    color: var(--color-link);
}

#badges-iframe {
  -ms-zoom: 0.75;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.5);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  width: 895px;
  max-width: 895px;
  height: 480px;
  max-height: 480px;
  -webkit-resize: none;
  -moz-resize: none;
  resize: none;
  overflow: hidden;
  margin-top: -95px;
  margin-left: -16px
}

#badges-iframe.defaultMal {
    width: 668px;
    max-width: 668px;
    height: 480px;
    max-height: 480px;
    margin-top: -67px;
    margin-left: -6px;
    -webkit-transform: scale(0.35);
        -ms-transform: scale(0.35);
            transform: scale(0.35)
}

div#badges-inner {
  padding: 10px;
  transition: transform .3s ease-in-out;
  background: var(--color-foreground);
  border: var(--border) solid var(--border-color);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius)
}

div#badges-inner.defaultMal {
  padding: 0;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
}

div#badges-iframe-inner {
  overflow: hidden;
  pointer-events: none;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  height: 145px;
  background: var(--color-foreground2);
  -webkit-border-radius: 10px;
  border-radius: 10px
}

div#badges-iframe-inner.defaultMal {
  height: 100px;
  border: 0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  background: var(--color-foreground);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
}

.sceditor-container.sourceMode.ltr {
  min-height: 100px
}

.newCommentsContainerMain {
  background: var(--color-foreground);
  display: block;
  margin-bottom: 15px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.newCommentsContainerMain:hover .newCommentsLinkButton {
 opacity: 1 !important
}

.newCommentsContainer tr {
  background: var(--color-foreground2);
  padding: 5px 0px;
  display: block;
  margin: 10px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.comment-profile .newCommentsContainer tr {
  padding: 5px
}

.newCommentsLinkButton,
.newCommentsCommentButton {
  width: 100%;
  height: 0px;
  top: -20px;
  text-align: right;
  display: block;
  position: relative;
  font-family: FontAwesome;
  right: 10px;
}

.newCommentsLinkButton {
  opacity: 0;
  top:10px
}

.comment-profile .newCommentsLinkButton,
.comment-profile .newCommentsCommentButton {
  top:2px;
  right: 2px;
}

.comment-profile .newCommentsCommentButton {
  top:-10px;
}

.newCommentsLoadMoreButton {
   padding: 10px;
   display: block;
   background: var(--color-foreground4);
   margin: 10px;
   margin-bottom: 20px;
   border: var(--border) solid var(--border-color);
   -webkit-border-radius: var(--border-radius);
   border-radius: var(--border-radius);
   cursor: pointer;
   text-align: center
}
`;

//CSS MyAnimeList - Clean Main Colors
let defaultColors = `
:root,
body {
  --fg: #181818!important;
  --color-background: #121212!important;
  --color-backgroundo: #12121266!important;
  --color-foreground: #181818!important;
  --color-foreground2: #242424!important;
  --color-foreground3: #323232!important;
  --color-foregroundOP: #181818!important;
  --color-foregroundOP2: #242424!important;
  --color-foreground4: #282828!important;
  --border-color: #222!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: #9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
  --shadow-color: rgba(0,0, 0, 0.3);
  --shadow-strength: 3px;
}`;

let defaultColorsLight = `
:root,
body {
  --fg: #f5f5f5!important;
  --color-background: #eef1fa!important;
  --color-backgroundo: #eef1fa66!important;
  --color-foreground: #f5f5f5!important;
  --color-foreground2: #eeeeee!important;
  --color-foreground3: #e3e3e366!important;
  --color-foregroundOP: #f5f5f5!important;
  --color-foregroundOP2: #e3e3e3!important;
  --color-foreground4: #e3e3e3!important;
  --border-color: #bcbcbc!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: 9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
  --shadow-color: rgba(0,0, 0, 0.3);
  --shadow-strength: 3px;
}`;

let colorFromCoverCSS = `...`;
const getColorFromCoverCSS = () => `
.lazyloading {
  opacity: 1 !important;
}

footer {
  z-index: 0;
  margin-top: 65px !important;
  position: relative;
}

.dark-mode .profile .user-statistics,
.profile .user-statistics {
  width: 99%
}

.dark-mode .profile .user-comments .comment,
.profile .user-comments .comment,
.dark-mode .page-common .content-container .container-right h2,
.page-common .content-container .container-right h2,
.dark-mode .fav-slide-block,
.fav-slide-block {
  width: 96%
}

.dark-mode body:not(.ownlist),
body:not(.ownlist) {
  background-color: var(--color-background) !important
}

.page-common #myanimelist #contentWrapper {
  background-color: var(--color-backgroundo) !important;
  top: 55px !important;
  padding: 10px;
  margin-left: -15px;
  width: 1070px;
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px var(--shadow-color) !important
}
`;
colorFromCoverCSS = getColorFromCoverCSS();

let defaultCSSFixes = `...`;
const getDefaultCSSFixes = () => `
${
  svar.scrollbarStyle
    ? `
    ::-webkit-scrollbar {
        background: 0 0;
        width: ${svar.scrollbarStyleWidth ?? 12}px;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--color-foreground2);
        -webkit-border-radius: 3px;
        border-radius: 3px
    }
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-corner {
        background: var(--color-background)
    }`
    : ``
}

a.feed-main-button {
    top: 0!important
}
  
.feed-main {
    padding: 10px
}
  
.feed-main a:hover {
    text-decoration: none!important
}
  
#currently-popup iframe {
    border: 0!important
}

.list-entries .section-name,
.dark-mode .page-common #horiznav_nav,
.page-common div#horiznav_nav {
    border-color: var(--border-color)!important
}

.profile .user-statistics .user-statistics-stats .updates {
    padding-right:10px
}

.bannerHover {
    height:90px!important
}

.profileRightActions {
    position: relative;
    top: -50px
}

.widget-slide-block .widget-slide .btn-anime .link .title.color-pc-constant {
    color: var(--color-main-text-normal)
}

.tooltipBody {
    padding:10px
}

.bannerDiv {
    margin: -5px -10px 0 -10px
}
`;
defaultCSSFixes = getDefaultCSSFixes();

let blurredBgCss = `...`;
const getblurredBgCss = () => `
.blurred-background-image {
  width: 110%;
  left: -5%;
  top: -5%;
  height: 110%;
  position: fixed;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  -webkit-filter: blur(${svar.animeBlurredBgBlur ?? 2}vh) brightness(${svar.animeBlurredBgBrightness ?? 0.7}) saturate(${svar.animeBlurredBgSaturate ?? 1});
  filter: blur(${svar.animeBlurredBgBlur ?? 2}vh) brightness(${svar.animeBlurredBgBrightness ?? 0.7}) saturate(${svar.animeBlurredBgSaturate ?? 1});
  background-position: center !important;
  z-index: -1;
}
`;
blurredBgCss = getblurredBgCss();

// Minify CSS
const minifyCSS = (css) => {
  if (!css.includes("/*")) {
    return css.replace(/\s*([{}:;,])\s*/g, "$1").replace(/\n+/g, "");
  }
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/\n+/g, "");
};
[styles, colorFromCoverCSS, defaultColors, defaultColorsLight, defaultCSSFixes, blurredBgCss].forEach((css, i, arr) => {
  arr[i] = minifyCSS(css);
});

// Create Style Elements
let styleSheet = create("style", { id: "malCleanMainCSS" });
let styleSheet2 = create("style", { id: "colorFromCoverCSS" });
let styleSheet3 = create("style", { id: "blurredBgCss" });
styleSheet2.innerText = colorFromCoverCSS;
document.head.appendChild(styleSheet);
document.head.appendChild(styleSheet3);

// Apply Styles
const applyTheme = () => {
  const hasCustomTheme = $("style:contains(--fg:)").length;
  const isDarkMode = $("html").hasClass("dark-mode");
  let finalCSS = styles;
  if (!hasCustomTheme) {
    finalCSS += (isDarkMode ? defaultColors : defaultColorsLight) + defaultCSSFixes;
    defaultMal = 1;
  }
  styleSheet.textContent = finalCSS;
  styleSheet2.textContent = colorFromCoverCSS;
  styleSheet3.textContent = blurredBgCss;
};
applyTheme();

const resetTheme = () => {
  defaultCSSFixes = getDefaultCSSFixes();
  colorFromCoverCSS = getColorFromCoverCSS();
  blurredBgCss = getblurredBgCss();
  [styles, colorFromCoverCSS, defaultColors, defaultColorsLight, defaultCSSFixes, blurredBgCss].forEach((css, i, arr) => {
    arr[i] = minifyCSS(css);
  });
  applyTheme();
};

// ==== localization.js ====
// localization.js
class LocalizationManager {
  constructor() {
      this.languages = {
  "English": {
    "info": {
      "languageName": "English",
      "languageCode": "en",
      "authors": [
        "KanashiiDev"
      ],
      "fallback": [
        "raw_keys"
      ]
    },
    "keys": {
      "$now": "Now",
      "$secondAgo": "1 second ago",
      "$secondsAgo": "{0} seconds ago",
      "$minuteAgo": "1 minute ago",
      "$minutesAgo": "{0} minutes ago",
      "$hourAgo": "1 hour ago",
      "$hoursAgo": "{0} hours ago",
      "$dayAgo": "1 day ago",
      "$daysAgo": "{0} days ago",
      "$weekAgo": "1 week ago",
      "$weeksAgo": "{0} weeks ago",
      "$monthsAgo": "{0} months ago",
      "$yearsAgo": "{0} years ago",
      "$daySuffix": "d ",
      "$hourSuffix": "h ",
      "$minuteSuffix": "m",
      "$languageSelector": "Select Language:",
      "$rainbow": "Rainbow",
      "$epBehind": "ep behind",
      "$loadMore": "Load More",
      "$loading": "Loading",
      "$add": "Add",
      "$edit": "Edit",
      "$sort": "Sort",
      "$remove": "Remove",
      "$addCustom": "Add Custom",
      "$profileElement": "Profile Element",
      "$addToLeftSide": "Add to Left Side",
      "$addToRightSide": "Add to Right Side",
      "$addToList": "Add to List",
      "$private": "private",
      "$public": "public",
      "$hide": "Hide",
      "$show": "Show",
      "$showMore": "Show More",
      "$showLess": "Show Less",
      "$close": "Close",
      "$preview": "Preview",
      "$cancel": "Cancel",
      "$update": "Update",
      "$noTitle": "No Title",
      "$addTitleHere": "Add Title Here",
      "$addContentHere": "Add Content Here",
      "$pasteUrlHere": "Paste Url Here",
      "$typeHere": "Type here",
      "$updating": "Updating",
      "$alreadyAdded": "Already Added",
      "$anErrorOccured": "An error occured. Please try again.",
      "$malCleanCustomError": "You are not using the classic 'About Me' section.<br><br>Please paste the provided code into a public blog post on the first page so that it runs automatically.<br><br>",
      "$loadingProfile": "Loading {0}'s Profile",
      "$backToMyProfile": "Back to My Profile",
      "$profilePrivate": "Profile is private",
      "$privateList": "The list is private.",
      "$removeAllCustomSettings": "Remove All Custom Profile Settings",
      "$mutualFriends": "Mutual Friends",
      "$anisongProvider": "Themes provided from {0}",
      "$anisongLastUpdate": "Last Update:",
      "$hideNonJapaneseAnime": "Hide non-Japanese Anime <br>Please contribute if any are missing. <br><a href='https://github.com/KanashiiDev/MAL-Clean-JS/blob/main/src/data/nonJapaneseIds.js'>Add Missing ID</a></i>",
      "$hideNonJapaneseAnimeWarn": "This setting only works on the “Top Anime”, “Seasonal Anime” and “Anime Search” pages.",
      "uISection": "----------------- UI ELEMENTS -----------------",
      "$animeInfoSetting": "Show additional info on seasonal anime and suggestions (icon appears on hover)",
      "$showCurrentlyWatchingAnime": "Show the anime you are currently watching",
      "$showCurrentlyReadingManga": "Show the manga you are currently reading",
      "$currentlyWatching": "Currently Watching",
      "$currentlyReading": "Currently Reading",
      "$addCurrentlyGrid": "Use grid view for Currently Watching/Reading section",
      "$addCurrentlyGrid6Column": "Use 6-column grid layout",
      "$addCurrentlyGridAccordion": "Use an accordion to collapse excess entries",
      "$addEpisodeCountdown": "Add a countdown to the next episode of currently watching anime",
      "$autoAddDates": "Automatically add start/end dates to watched anime and read manga",
      "$recentlyAddedAnime": "Recently Added Anime",
      "$recentlyAddedManga": "Recently Added Manga",
      "$showRecentlyAddedAnime": "Show recently added anime",
      "$showRecentlyAddedManga": "Show recently added manga",
      "$recentlyAnimeDefault": "Anime type to be shown",
      "$recentlyMangaDefault": "Manga type to be shown",
      "$addRecentlyGrid": "Use grid view for Recently Added Anime/Manga section",
      "$autoHideHeader": "Automatically Hide/Show header",
      "$changeScrollbarAppearance": "Change Scrollbar Appearance",
      "$changeScrollbarWidth": "Scrollbar width:",
      "$dynamicBackgroundColor": "Use dynamic background color based on cover art's color palette",
      "$animeBlurredBackground": "Use the cover image as the background",
      "$animeBlurredBackgroundBlur": "Background Blur Amount: ",
      "$animeBlurredBackgroundBrightness": "Background Brightness Amount: ",
      "$animeBlurredBackgroundSaturate": "Background Saturation Amount: ",
      "$addAnilistBanner": "Add banner image from Anilist",
      "$addAnilistTags": "Add tags from Anilist",
      "$refreshTags": "Refresh Tags",
      "$showSpoilerTags": "Show {0} spoiler tags",
      "$hideSpoilerTags": "Hide {0} spoiler tags",
      "$categorizeTags": "Categorize Tags",
      "$replaceRelations": "Replace relations",
      "$addRelationFilter": "Add filter to replaced relations",
      "$replaceAnimeSongs": "Replace Anime OP/ED with animethemes.moe",
      "$replaceEditDetails": "Replace the edit details with the edit popup",
      "$changeInfoDesign": "Change the design of the Information section on the left side",
      "$changeTitlePosition": "Change title position",
      "$customCoverImage": "Custom Cover Image <br><i>(Go to the anime/manga pictures page to change it)</i>",
      "$charDynamicBackground": "Use dynamic background color based on cover art's color palette",
      "$changeCharacterNamePosition": "Change name position",
      "$showAltCharacterName": "Show alternative name",
      "$customCharacterCover": "Custom Character Image <br><i>(Go to the character pictures page to change it)</i>",
      "$changePeopleNamePosition": "Change name position",
      "$redesignBlogPage": "Redesign blog page",
      "$autoFetchBlogContent": "Auto fetch blog content",
      "$expandClubComments": "Expand club comments",
      "$modernAnimeMangaLinks": "Modern Anime/Manga Links",
      "$changeDateFormatForum": "Change date format",
      "$modernProfileLayout": "Modern Profile Layout",
      "$modernAnimeMangaList": "Modern Anime/Manga List",
      "$modernAnimeMangaListWarn": "Only works with the anime and manga list buttons on the profile page, not within the list itself.",
      "$hideProfileLeftSide": "Hide the modern profile left side when not on the main profile page",
      "$autoHeaderOpacity": "Add automatic header opacity for users with a custom banner",
      "$moveBadgesPosition": "Move badges below the anime and manga list buttons",
      "$showActivityHistory": "Show Activity History",
      "$showAnimeGenreOverview": "Show Anime Genre Overview",
      "$showMangaGenreOverview": "Show Manga Genre Overview",
      "$moreThan10Favorites": "Add more than 10 favorites",
      "$showCustomCSS": "Show custom CSS",
      "$commentsRedesign": "Redesign the comments section",
      "$profileCommentsRedesign": "Redesign the profile comments section",
      "$changeUsernamePosition": "Change username position",
      "$editorLivePreview": "Add live preview to the editor",
      "ddSection": "----------------- Dropdown ELEMENTS -----------------",
      "$addAiringDot": "Show Airing Status Dot",
      "$addmoreFavsMode": "Update also for other users",
      "$ddEmbedTTL": "How often should the Modern Anime/Manga Links data be updated? (Days)",
      "$ddTagTTL": "How often should the tag data be updated? (Days)",
      "$ddRelationTTL": "How often should the relation data be updated? (Days)",
      "$ddAutoModernLayout": "Turn off auto modern layout detection.",
      "$addAnimeBannerMove": "Move the cover image below the banner image.",
      "$mcUserStyleWarn": "Mal Clean Userstyle Required",
      "$activeMcUserStyleWarn": "This setting is only for users who do not have Mal Clean Userstyle.",
      "$mcUserStyleModernWarn": "Mal Clean Userstyle & Modern Profile Layout Required",
      "$mcUserStyleModernReqWarn": "Mal Clean Userstyle & Modern Profile Layout Required.",
      "$modernProfileWarn": "Modern Profile Layout Required!",
      "$disableModernProfileWarn": "Disable Modern Profile Layout.",
      "$disableAnimeBlurredBgWarn": "This setting will not work because 'Use the cover image as the background' is active.",
      "profileSection": "----------------- Custom Profile ELEMENTS -----------------",
      "$customForegroundTitle": "Custom Foreground Color (Required {0})",
      "$customForegroundDesc": "Change profile foreground color. This will be visible to users with Mal-Clean-JS.",
      "$customBannerTitle": "Custom Banner (Required {0})",
      "$customBannerDesc": "Add custom banner to your profile. This will be visible to users with Mal-Clean-JS.",
      "$custompfTitle": "Custom Avatar",
      "$custompfDesc": "Add custom avatar to your profile. This will be visible to users with Mal-Clean-JS.",
      "$custombadgeTitle": "Custom Badge (Required {0})",
      "$custombadgeDesc": "Add custom badge to your profile. This will be visible to users with Mal-Clean-JS. <p>You can use HTML elements. Maximum size 300x150. Update empty to delete.</p>",
      "$malBadgesTitle": "Mal-Badges",
      "$malBadgesDesc": "You can add Mal-Badges to your profile. This will be visible to users with Mal-Clean-JS. <p>If the badge does not appear, it means that the Mal-Badges is blocking access. There is nothing you can do about it.</p>",
      "$malBadgesDetailed": "Detailed Badge (Required Modern Profile Layout)",
      "$customCSSTitle": "Custom CSS",
      "$customCSSDesc": "Add custom css to your profile. This will be visible to users with Mal-Clean-JS.",
      "$customCSSModern": "For Modern Profile Layout",
      "$customCSSMini": "For minor changes (Keep styles)",
      "$customColorsTitle": "Custom Profile Colors",
      "$customColorsDesc": "Change profile colors. This will be visible to users with Mal-Clean-JS.",
      "$privateProfileTitle": "Profile Privacy",
      "$privateProfileDesc": "You can make your profile private or public for users with Mal-Clean-JS.",
      "$hideProfileElTitle": "Hide Profile Elements",
      "$hideProfileElDesc": "You can hide your profile elements. This will also apply to users with Mal-Clean-JS.",
      "$customProfileElTitle": "Custom Profile Elements",
      "$customProfileElDesc": "You can add custom profile elements your profile. This will be visible to users with Mal-Clean-JS. You can use HTML elements.",
      "modernListSection": "----------------- Modern List ELEMENTS -----------------",
      "$3x3Btn": "Make 3x3",
      "$3x3Desc": "Click 9 media entries, then save the image below",
      "$3x3ImgFit": "Image Fitting",
      "$3x3ImgHeight": "image height (px)",
      "$3x3ImgWidth": "image width (px)",
      "$3x3ImgSpacing": "spacing (px)",
      "$3x3Columns": "Columns",
      "$3x3Rows": "Rows",
      "$listAll": "All",
      "$listWatching": "Watching",
      "$listReading": "Reading",
      "$listCompleted": "Completed",
      "$listPlanning": "Planning",
      "$listPaused": "Paused",
      "$listDropped": "Dropped",
      "$listSelectGenres": "Select Genres",
      "$listLists": "Lists",
      "$listYear": "Year",
      "$listTags": "Tags",
      "$listCompare": "Compare",
      "$listSelectTitle": "Title",
      "$listSelectScore": "Score",
      "$listSelectType": "Type",
      "$listSelectProgress": "Progress",
      "$listSelectStartDate": "Start Date",
      "$listSelectFinishDate": "Finish Date",
      "$listSelectLastAdded": "Last Added",
      "$listSelectLastUpdated": "Last Updated"
    }
  },
  "Turkish": {
    "info": {
      "languageName": "Türkçe",
      "languageCode": "tr",
      "authors": [
        "KanashiiDev"
      ],
      "fallback": [
        "English"
      ]
    },
    "keys": {
      "$now": "Şimdi",
      "$secondAgo": "1 saniye önce",
      "$secondsAgo": "{0} saniye önce",
      "$minuteAgo": "1 dakika önce",
      "$minutesAgo": "{0} dakika önce",
      "$hourAgo": "1 saat önce",
      "$hoursAgo": "{0} saat önce",
      "$dayAgo": "1 gün önce",
      "$daysAgo": "{0} gün önce",
      "$weekAgo": "1 hafta önce",
      "$weeksAgo": "{0} hafta önce",
      "$monthsAgo": "{0} ay önce",
      "$yearsAgo": "{0} yıl önce",
      "$daySuffix": "g ",
      "$hourSuffix": "s ",
      "$minuteSuffix": "d",
      "$languageSelector": "Dil Seçin:",
      "$rainbow": "Gökkuşağı",
      "$epBehind": "bölüm geride",
      "$noTitle": "Başlık Yok",
      "$addCustom": "Özel",
      "$profileElement": "Profil Elementi",
      "$addTitleHere": "Başlığı buraya ekle",
      "$addContentHere": "İçeriği buraya ekle",
      "$pasteUrlHere": "URL'yi buraya yapıştır",
      "$typeHere": "Buraya yaz",
      "$add": "Ekle",
      "$edit": "Düzenle",
      "$sort": "Sırala",
      "$remove": "Kaldır",
      "$addToLeftSide": "Sol Tarafa Ekle",
      "$addToRightSide": "Sağ Tarafa Ekle",
      "$addToList": "Listeye Ekle",
      "$loadMore": "Daha Fazla",
      "$loading": "Yükleniyor",
      "$private": "Gizli",
      "$public": "Görünür",
      "$hide": "Gizle",
      "$show": "Göster",
      "$showMore": "Daha Fazla Göster",
      "$showLess": "Daha Az Göster",
      "$close": "Kapat",
      "$preview": "Önizle",
      "$cancel": "İptal",
      "$update": "Güncelle",
      "$updating": "Güncelleniyor",
      "$alreadyAdded": "Zaten Eklendi",
      "$anErrorOccured": "Bir hata oluştu. Tekrar deneyin.",
      "$malCleanCustomError": "Klasik Hakkımda kısmı kullanmıyorsun.<br><br>Kodun otomatik olarak çalışması için lütfen bu kodu ilk sayfadaki herkese açık bir blog gönderisine yapıştırın.<br><br>",
      "$loadingProfile": "{0} Profili Yükleniyor",
      "$backToMyProfile": "Profilime Geri Dön",
      "$profilePrivate": "Profil Gizli",
      "$privateList": "Liste Gizli.",
      "$removeAllCustomSettings": "Tüm Özel Profil Ayarlarını Kaldır",
      "$mutualFriends": "Karşılıklı Arkadaşları Göster",
      "$anisongProvider": "Temaların sağlayıcısı {0}",
      "$anisongLastUpdate": "Son Güncelleme:",
      "$hideNonJapaneseAnime": "Japon yapımı olmayan animeleri gizle. <br> Eğer eksik varsa lütfen katkıda bulunun. <br><a href='https://github.com/KanashiiDev/MAL-Clean-JS/blob/main/src/data/nonJapaneseIds.js'>Eksik ID ekle</a></i>",
      "$hideNonJapaneseAnimeWarn": "Bu ayar sadece “Top Anime”, “Seasonal Anime” ve “Anime Search” sayfalarında çalışır.",
      "$editorLivePreview": "Editör'e canlı önizleme ekle",
      "uISection": "----------------- UI ELEMENTS -----------------",
      "$animeInfoSetting": "Sezonluk animeye ve önerilere bilgi ekle (ikonun görünmesi için animenin üzerine gel)",
      "$showCurrentlyWatchingAnime": "Şu anda izlediğin animeyi göster",
      "$showCurrentlyReadingManga": "Şu anda okuduğun mangayı göster",
      "$currentlyWatching": "Şu an İzlenenler",
      "$currentlyReading": "Şu an Okunanlar",
      "$addCurrentlyGrid": "Şu anda izlediğin/okuduğun kısmını ızgara görünümünde kullan",
      "$addCurrentlyGrid6Column": "6 sütunlu ızgara düzenini kullan",
      "$addCurrentlyGridAccordion": "Fazla içeriği gizlemek için akordiyon kullan",
      "$addEpisodeCountdown": "Şu anda izlenen animeye sonraki bölüm geri sayımını ekle",
      "$autoAddDates": "İzlediğin Anime'ye ve okuduğun manga'ya otomatik başlangıç/bitiş tarihi ekle",
      "$recentlyAddedAnime": "Son Eklenen Anime",
      "$recentlyAddedManga": "Son Eklenen Manga",
      "$showRecentlyAddedAnime": "Son eklenen animeleri göster",
      "$showRecentlyAddedManga": "Son eklenen mangaları göster",
      "$recentlyAnimeDefault": "Gösterilecek Anime Tipi",
      "$recentlyMangaDefault": "Gösterilecek Manga Tipi",
      "$addRecentlyGrid": "Son eklenen Anime/Manga kısmını ızgara görünümünde kullan",
      "$autoHideHeader": "Başlığı Otomatik Gizle/Göster",
      "$changeScrollbarAppearance": "Kaydırma Çubuğu Görünümünü Değiştir",
      "$changeScrollbarWidth": "Kaydırma çubuğunun genişliği:",
      "$dynamicBackgroundColor": "Kapak resminin renk paletine dayalı dinamik arka plan rengi ekle",
      "$animeBlurredBackground": "Kapak resmini arkaplan olarak kullan",
      "$animeBlurredBackgroundBlur": "Arkaplan Bulanıklık Miktarı: ",
      "$animeBlurredBackgroundBrightness": "Arkaplan Parlaklık Miktarı: ",
      "$animeBlurredBackgroundSaturate": "Arkaplan Doygunluk Miktarı: ",
      "$addAnilistBanner": "Anilist'ten banner resmi ekle",
      "$addAnilistTags": "Anilist'ten etiketler ekle",
      "$refreshTags": "Etiketleri Yenile",
      "$showSpoilerTags": "{0} spoiler etiketini göster",
      "$hideSpoilerTags": "{0} spoiler etiketini gizle",
      "$categorizeTags": "Etkiletleri kategorilere ayır",
      "$replaceRelations": "İlişkileri değiştir",
      "$addRelationFilter": "Değiştirilen ilişkilere filtre ekle",
      "$replaceAnimeSongs": "Anime OP/ED'yi animethemes.moe ile değiştir",
      "$replaceEditDetails": "Düzenleme ayrıntılarını düzenleme açılır penceresi ile değiştirin",
      "$changeInfoDesign": "Sayfanın sol tarafındaki Information bölümünün tasarımını değiştirir",
      "$changeTitlePosition": "Başlık konumunu değiştir",
      "$customCoverImage": "Özel Kapak Resmi <br><i>(Değiştirmek için anime/manga'nın resimler sayfasına gidin)</i>",
      "$charDynamicBackground": "Kapak resminin renk paletine dayalı dinamik arka plan rengi ekleyin",
      "$changeCharacterNamePosition": "İsim konumunu değiştir",
      "$showAltCharacterName": "Alternatif adı göster",
      "$customCharacterCover": "Özel Kapak Resmi <br><i>(Değiştirmek için karakter'in resimler sayfasına gidin)</i>",
      "$changePeopleNamePosition": "İsim konumunu değiştir",
      "$redesignBlogPage": "Blog sayfasını yeniden tasarla",
      "$autoFetchBlogContent": "Blog içeriğini otomatik getir",
      "$expandClubComments": "Kulüp yorumlarını genişlet",
      "$modernAnimeMangaLinks": "Modern Anime/Manga Bağlantıları",
      "$changeDateFormatForum": "Tarih biçimini değiştir",
      "$modernProfileLayout": "Modern Profil Düzeni",
      "$modernAnimeMangaList": "Modern Anime/Manga Listesi",
      "$modernAnimeMangaListWarn": "Yalnızca profildeki anime listesi ve manga listesi butonunda çalışır, listede çalışmaz.",
      "$hideProfileLeftSide": "Ana profil sayfasında değilsen modern profilin sol tarafını gizle",
      "$autoHeaderOpacity": "Kullanıcının özel bir başlık resmi varsa başlığa otomatik opaklık ekle",
      "$moveBadgesPosition": "Rozetleri anime ve manga listesi düğmelerinden sonraya taşı",
      "$showActivityHistory": "Etkinlik Geçmişini Göster",
      "$showAnimeGenreOverview": "Anime Türleri Özetini Göster",
      "$showMangaGenreOverview": "Manga Türleri Özetini Göster",
      "$moreThan10Favorites": "10'dan fazla favori ekle",
      "$showCustomCSS": "Özel CSS göster",
      "$commentsRedesign": "Yorumlar bölümünü yeniden tasarla",
      "$profileCommentsRedesign": "Profil Yorumları bölümünü yeniden tasarla",
      "$changeUsernamePosition": "Kullanıcı adı konumunu değiştir",
      "ddSection": "----------------- Dropdown ELEMENTS -----------------",
      "$addAiringDot": "Yayın Durumu Noktasını Göster",
      "$addmoreFavsMode": "Diğer kullanıcılar için de güncelle",
      "$ddEmbedTTL": "Modern Anime/Manga Bağlantıları verileri ne sıklıkla güncellenmeli? (Gün)",
      "$ddTagTTL": "Etiket verileri ne sıklıkla güncellenmeli? (Gün)",
      "$ddRelationTTL": "İlişki verileri ne sıklıkla güncellenmelidir? (Gün)",
      "$ddAutoModernLayout": "Otomatik modern düzen algılamayı kapatın.",
      "$addAnimeBannerMove": "Kapak resmini banner resminin altına taşı.",
      "$mcUserStyleWarn": "Mal Clean Userstyle Gerekli",
      "$activeMcUserStyleWarn": "Bu ayar yalnızca Mal Clean Userstyle'a sahip olmayan kullanıcılar içindir.",
      "$mcUserStyleModernWarn": "Mal Clean Userstyle & Modern Profil Düzeni Gerekli",
      "$mcUserStyleModernReqWarn": "Mal Clean Userstyle & Modern Profil Düzeni Gerekli.",
      "$modernProfileWarn": "Modern Profil Düzeni Gerekli!",
      "$disableModernProfileWarn": "Modern Profil Düzenini Devre Dışı Bırak.",
      "$disableAnimeBlurredBgWarn": "Bu ayar 'Kapak resmini arkaplan olarak kullan' aktif olduğu için çalışmayacaktır.",
      "profileSection": "----------------- Custom Profile ELEMENTS -----------------",
      "$customForegroundTitle": "Özel Arkaplan Rengi (Gerekli {0})",
      "$customForegroundDesc": "Profil ön plan rengini değiştirin. Bu, Mal-Clean-JS'e sahip kullanıcılara görünür olacaktır.",
      "$customBannerTitle": "Özel Arkaplan (Gerekli {0})",
      "$customBannerDesc": "Profilinize özel arkaplan ekleyin. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilecektir.",
      "$custompfTitle": "Özel Avatar",
      "$custompfDesc": "Profilinize özel avatar ekleyin. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilecektir.",
      "$custombadgeTitle": "Özel Rozet (Gerekli {0})",
      "$custombadgeDesc": "Profilinize özel rozet ekleyin. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilir. <p>HTML öğelerini kullanabilirsiniz. Maksimum boyut 300x150. Silmek için boş olarak güncelleyin.</p>",
      "$malBadgesTitle": "Mal-Badges",
      "$malBadgesDesc": "Profilinize Mal-Badges ekleyebilirsiniz. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilecektir. <p>Eğer rozet görünmüyorsa, bu Mal-Badges'in erişimi engellediği anlamına gelir. Bu konuda yapabileceğiniz bir şey yok.</p>",
      "$malBadgesDetailed": "Detaylandırılmış Badge (Modern Profil Düzeni Gerektirir)",
      "$customCSSTitle": "Özel CSS",
      "$customCSSDesc": "Profilinize özel css ekleyin. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilecektir.",
      "$customCSSModern": "Modern Profil Düzeni için",
      "$customCSSMini": "Küçük değişiklikler için (Stilleri koru)",
      "$customColorsTitle": "Özel Profil Renkleri",
      "$customColorsDesc": "Profil renklerini değiştirin. Bu, Mal-Clean-JS'e sahip kullanıcılara görünür olacaktır.",
      "$privateProfileTitle": "Profil Gizliliği",
      "$privateProfileDesc": "Profilinizi Mal-Clean-JS'e sahip kullanıcılar için özel veya herkese açık hale getirebilirsiniz.",
      "$hideProfileElTitle": "Profil Öğelerini Gizle",
      "$hideProfileElDesc": "Profil öğelerinizi gizleyebilirsiniz. Bu, Mal-Clean-JS'e sahip kullanıcılar için de geçerli olacaktır.",
      "$customProfileElTitle": "Özel Profil Öğeleri",
      "$customProfileElDesc": "Profilinize özel profil öğeleri ekleyebilirsiniz. Bu, Mal-Clean-JS'e sahip kullanıcılar tarafından görülebilecektir. HTML öğelerini kullanabilirsiniz.",
      "modernListSection": "----------------- Modern List ELEMENTS -----------------",
      "$3x3Btn": "3x3 Oluştur",
      "$3x3Desc": "9 medya'ya tıklayın, ardından aşağıdaki görüntüyü kaydedin",
      "$3x3ImgFit": "Görüntü Sığdırma",
      "$3x3ImgHeight": "görüntü yüksekliği (px)",
      "$3x3ImgWidth": "görüntü genişliği (px)",
      "$3x3ImgSpacing": "aralık (px)",
      "$3x3Columns": "Sütunlar",
      "$3x3Rows": "Satırlar",
      "$listAll": "Tümü",
      "$listWatching": "İzleniyor",
      "$listReading": "Okunuyor",
      "$listCompleted": "Tamamlandı",
      "$listPlanning": "Planlanıyor",
      "$listPaused": "Duraklatıldı",
      "$listDropped": "Bırakıldı",
      "$listSelectGenres": "Türleri Seç",
      "$listLists": "Listeler",
      "$listYear": "Yıl",
      "$listTags": "Etiketler",
      "$listCompare": "Karşılaştır",
      "$listSelectTitle": "Başlık",
      "$listSelectScore": "Skor",
      "$listSelectType": "Tür",
      "$listSelectProgress": "İlerleme",
      "$listSelectStartDate": "Başlangıç Tarihi",
      "$listSelectFinishDate": "Bitiş Tarihi",
      "$listSelectLastAdded": "Son Eklenen",
      "$listSelectLastUpdated": "Son Güncellenen"
    }
  },
  "$raw_keys": {
    "info": {
      "language": "$raw_keys",
      "locale": "",
      "fallback": [],
      "authors": [
        "(translator mode)"
      ],
      "notes": "This is a special language file, used to see raw keys in the UI. DO NOT USE THIS FILE AS A TEMPLATE FOR YOUR OWN TRANSLATION FILE (use English.json)"
    },
    "keys": {}
  }
};
      this._initializeRawKeys();
      this._validateCurrentLanguage();
  }

  _initializeRawKeys() {
      const englishKeys = this.languages["English"]?.keys || {};
      Object.keys(englishKeys).forEach(key => {
          this.languages["$raw_keys"].keys[key] = key;
      });
  }

  _validateCurrentLanguage() {
      if (!this.currentLanguage || !this.languages[this.currentLanguage]) {
          this._fallbackToEnglish();
      }
  }

  _fallbackToEnglish() {
      const candidates = Object.keys(this.languages)
          .filter(key => key.includes(this.currentLanguage) && key !== "$raw_keys");
      
      const warningMsg = candidates.length
          ? `No "${this.currentLanguage}" language found. Falling back to English.\nPossible candidates: ${candidates.join(", ")}`
          : `No "${this.currentLanguage}" language found. Falling back to English.`;
      
      console.warn(warningMsg);
      this.currentLanguage = "English";
      this._saveSettings();
  }

  _saveSettings() {
      if (typeof svar?.save === 'function') {
          svar.save();
      }
  }

  translate(key, substitutions, fallback) {
      if (!key?.startsWith("$")) return key;
      
      let translation = this._findTranslation(key);
      if (!translation) {
          translation = fallback || key;
          if (!key.startsWith("$role_")) {
              console.warn(`[${this.scriptType}] Missing translation for key: ${key}`);
          }
      }
      
      return this._applySubstitutions(translation, substitutions);
  }

  _findTranslation(key) {
      if (this.languages[this.currentLanguage]?.keys[key]) {
          return this.languages[this.currentLanguage].keys[key];
      }
      
      const fallbacks = this.languages[this.currentLanguage]?.info?.fallback || [];
      for (const fallbackLang of fallbacks) {
          if (this.languages[fallbackLang]?.keys[key]) {
              return this.languages[fallbackLang].keys[key];
          }
      }
      
      return this.languages["English"]?.keys[key];
  }

  _applySubstitutions(text, substitutions) {
      if (!substitutions || !text) return text;
      
      if (Array.isArray(substitutions)) {
          return substitutions.reduce((result, sub, index) => 
              result.replace(new RegExp(`\\{${index}\\}`, 'g'), sub), 
              text
          );
      }
      return text.replace(/\{0\}/g, substitutions);
  }

  set currentLanguage(lang) {
      if (this.languages[lang] || lang === "$raw_keys") {
          this._currentLanguage = lang;
      } else {
          this._fallbackToEnglish();
      }
  }

  get currentLanguage() {
      return this._currentLanguage || "English";
  }

  set scriptType(type) {
      this._scriptType = type;
  }

  get scriptType() {
      return this._scriptType || "unknown";
  }

  get availableLanguages() {
    const baseLang = "English";
    const baseKeys = Object.keys(this.languages[baseLang]?.keys || {});
    const total = baseKeys.length;
  
    return Object.keys(this.languages)
      .map(lang => {
        const targetKeys = Object.keys(this.languages[lang]?.keys || {});
        const translated = baseKeys.filter(key => key in this.languages[lang].keys).length;
        const percentage = total > 0 ? Math.floor((translated / total) * 100) : 0;
  
        return {
          lang,
          keyCount: lang !== baseLang ? ` (${targetKeys.length} Keys)` : '',
          keyPercent: lang !== baseLang && percentage !== 100 ? ` (${percentage}%)` : '',
          authors: this.languages[lang]?.info?.authors?.length > 0 && this.languages[lang].info.authors[0] !== "KanashiiDev"
            ? ` [${this.languages[lang].info.authors.join(", ")}]`
            : "",
          missingKeys: baseKeys.filter(key => !(key in this.languages[lang].keys))
        };
      });
  }
}

// Global instance creation
window.LocalizationManager = LocalizationManager;
window.localization = new LocalizationManager();

// Initialize with settings
if (typeof svar !== 'undefined') {
  localization.currentLanguage = svar.currentLanguage;
  localization.scriptType = svar.scriptType;
}

// Global functions
window.translate = function(key, subs, fallback) {
  return localization.translate(key, subs, fallback);
};

window.setLanguage = function(lang) {
  localization.currentLanguage = lang;
};

window.getAvailableLanguages = function() {
  return localization.availableLanguages;
};

// Language selector initialization
function initLanguageSelector() {
  const languageSelect = document.createElement('select');
  languageSelect.id = 'language-selector';
  languageSelect.className = 'language-switcher';

  getAvailableLanguages().forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.lang;
      option.textContent = lang.lang + lang.keyPercent + lang.authors;
      if (lang.missingKeys.length) {
        console.warn(`[${lang.lang}] Missing Keys: ${lang.missingKeys}`);
      }
      languageSelect.appendChild(option);
  });

  languageSelect.value = localization.currentLanguage;

  languageSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
      if (typeof svar !== 'undefined') {
          svar.currentLanguage = e.target.value;
          svar.save();
      }
      location.reload(); // Reload to apply language changes
  });

  return languageSelect;
}

(async function () {
"use strict";

// ==== moduleController.js ====
let userModules = [];
let sortedModules, activeModules;

let exportModule = function ({ name, description, category, author, urlMatch, code, dropdown, css, id, defaultValue = true, priority = 0 }) {
  if (svar[id] === undefined) {
    svar[id] = defaultValue;
    svar.save();
  }
  userModules.push({
    name,
    id,
    description,
    category,
    author,
    urlMatch,
    code,
    dropdown,
    css,
    priority,
  });
};

// User Modules Context
const context = {
  url: window.location.href,
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  utils: {
    log: console.log,
    injectCSS: (css) => {
      try {
        const style = create("style", { id: " userModuleCSS" }, minifyCSS(css));
        document.head.append(style);
        return true;
      } catch (e) {
        console.error("CSS injection failed:", e);
        return false;
      }
    },
  },
  debug: false,
};

//Run User Modules
async function runModules(ctx) {
  sortedModules = [...userModules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (ctx.debug) ctx.utils.log(`Checking ${sortedModules.length} modules...`);
  activeModules = sortedModules.filter((mod) => {
    try {
      return typeof mod.urlMatch === "function" ? mod.urlMatch() && svar[mod.id] : false;
    } catch (e) {
      console.error(`urlMatch error in module ${mod.name}:`, e);
      return false;
    }
  });

  for (const mod of activeModules) {
    try {
      if (ctx.debug) ctx.utils.log(`[P${mod.priority || 0}] [${mod.category}] ${mod.name}: Running...`);
      if (mod.css) {
        const cssInjected = ctx.utils.injectCSS(mod.css);
        if (cssInjected && ctx.debug) {
          ctx.utils.log(`CSS injected for ${mod.name}`);
        }
      }

      await mod.code();
    } catch (e) {
      console.error(`Error in module ${mod.name}:`, e);
    }
  }
  svar.save();
}

//Run User Modules Dropdown
async function runModulesDropdown() {
  for (const mod of sortedModules) {
    try {
      await mod.dropdown();
    } catch (e) {
      console.error(`Error in module ${mod.name}:`, e);
    }
  }
}

let moduleTimer;
moduleTimer = setTimeout(async () => {
  await runModules(context);
  if (userModules.length > 1) {
    clearTimeout(moduleTimer);
  }
}, 1000);

// ==== main.js ====
//MalClean Settings - Close Settings Div
function closeDiv() {
  $(".malCleanMainContainer").remove();
  clearHiddenDivs();
  settingsActive = !1;
}

//MalClean Settings - Settings Open & Close
function Settings() {
  settingsActive = !settingsActive;
  if (settingsActive) {
    createDiv();
  }
  if (!settingsActive) {
    closeDiv();
  }
}
//MalClean Settings - Settings Button
stButton.onclick = () => {
  Settings();
};

//MalClean Settings - Close Button
var closeButton = create("button", { class: "mainbtns fa fa-x", id: "closeButton", title: "Close" });
closeButton.onclick = () => {
  closeDiv();
};

// MalClean Inner Settings
const innerSettingsButton = create("button", { active: "0", class: "mainbtns fa fa-gear", id: "innerSettingsButton", title: "Settings" });
const dragButton = create("button", { class: "mainbtns fa fa-arrows", id: "dragButton", title: "Drag" });
const settingDiv = create("div", { class: "malCleanSettingInnerSettings malCleanSettingPopup", style: { display: "none" } });

innerSettingsButton.addEventListener("click", () => {
  const target = document.querySelector("div.malCleanMainHeader > div.malCleanMainHeaderTitle");
  const isActive = innerSettingsButton.getAttribute("active") === "1";

  if (!settingDiv.children.length) {
    settingDiv.append(createSettingSection(translate("$languageSelector"), initLanguageSelector()));
  }

  if (isActive) {
    $(settingDiv).slideUp();
    innerSettingsButton.setAttribute("active", "0");
  } else {
    target.insertAdjacentElement("afterend", settingDiv);
    $(settingDiv).slideDown();
    innerSettingsButton.setAttribute("active", "1");
  }
});

// MalClean Inner Settings - Create Setting
function createSettingSection(title, ...contents) {
  const section = create("div", { class: "setting-section" });
  const label = create("p", { class: "setting-section-text" }, title);
  section.append(label, ...contents);
  return section;
}

//MalClean Settings - Reload Button
var reloadButton = create("button", { class: "mainbtns fa fa-refresh", id: "reloadButton", title: "Refresh" });
reloadButton.onclick = () => {
  window.location.reload();
};

//MalClean Settings - Refresh Page Button Animation
function reloadWarn() {
  reloadButton.setAttribute("style", "animation:reloadLoop 2.5s infinite");
}

//MalClean Settings - Disable Buttons
function disableButton(button, title) {
  const tooltip = create("div", { class: "title-note-inner" });
  tooltip.innerText = title;
  $("#" + button)
    .prop("disabled", true)
    .addClass("disabled")
    .removeClass("btn-active")
    .append(tooltip)
    .nextAll()
    .closest(".fa-gear")
    .addClass("disabled");
}

//MalClean Settings - Tooltip Buttons
function tooltipButton(button, title) {
  const tooltip = create("div", { class: "tooltip title-note-inner" });
  tooltip.innerText = title;
  const btn = $("#" + button);
  if (!btn.hasClass("disabled")) {
    btn.addClass("tooltip").append(tooltip);
  }
}

// MalClean Settings - Buttons Config
function getButtonsConfig() {
  const config = Object.keys(svar).map((setting) => ({
    setting,
    id: setting.endsWith("Btn") ? setting : setting + "Btn",
    text: null,
    enabled: svar[setting],
  }));

  // Special Buttons
  config.push({
    setting: "removeAllCustom",
    id: "removeAllCustomBtn",
    text: translate("$removeAllCustomSettings"),
    enabled: true,
  });

  if (!defaultMal) {
    config.push({ id: "headerSlideBtn", setting: "headerSlide", text: null, enabled: true }, { id: "headerOpacityBtn", setting: "headerOpacity", text: null, enabled: true });
  } else {
    svar.headerSlide = 0;
    svar.headerOpacity = 0;
  }

  return config;
}

// MalClean Settings - Create Buttons
function createButton({ id, setting, text }) {
  const button = create("button", { class: "mainbtns", id });
  if (text) button.textContent = text;
  if (setting === "removeAllCustom") button.setAttribute("style", "color: #e06c64 !important;font-weight: bold; width:98%;");
  button.onclick = async () => {
    if (setting === "removeAllCustom") {
      const userConfirmed = confirm("Are you sure you want to remove all custom profile settings?");
      if (userConfirmed) {
        await localforage.dropInstance({ name: "MalJS" });
        await editAboutPopup(`...`, "removeAll");
      }
    } else if (setting !== "removeAllCustom" && setting !== "save") {
      svar[setting] = !svar[setting];
      svar.save();
      getSettings();
      reloadWarn();
    }
  };
  return button;
}

//MalClean Settings - Create Custom Settings Div Function
function createCustomSettingDiv(title, description, elementsToAppend, buttonsToAppend, buttonsWidth, infoToAppend, svar = "0", forProfile) {
  const div = create(
    "div",
    { class: "malCleanSettingContainer", id: forProfile ? "Profile" : "default" },
    `<div class="malCleanSettingHeader">
       <h2>${title}</h2>
       <h3>${description}</h3>
       <div class="malCleanSettingInner"></div>
       <div class="malCleanSettingButtons" style= "grid-template-columns: ${buttonsWidth};"></div>
       <div class="malCleanSettingInfo"></div>
     </div>`
  );
  const innerDiv = div.querySelector(".malCleanSettingInner");
  const buttonDiv = div.querySelector(".malCleanSettingButtons");
  const infoDiv = div.querySelector(".malCleanSettingInfo");
  let profileCheck = forProfile ? userNotHeaderUser : false;
  if (!profileCheck) {
    if (svar === "0" || svar) {
      if (elementsToAppend && Array.isArray(elementsToAppend)) {
        elementsToAppend.forEach((element) => {
          innerDiv.append(element);
        });
      } else {
        innerDiv.remove();
      }
      if (buttonsToAppend && Array.isArray(buttonsToAppend)) {
        buttonsToAppend.forEach((button) => {
          buttonDiv.append(button);
        });
      } else {
        buttonDiv.remove();
      }
      if (infoToAppend && Array.isArray(infoToAppend)) {
        infoToAppend.forEach((info) => {
          if (info === "<br>") {
            infoDiv.append(document.createElement("br"));
          } else {
            infoDiv.append(info);
          }
        });
      } else {
        infoDiv.remove();
      }
    }
  } else {
    const profileBtn = create("button", { class: "mainbtns", id: "backToProfile", style: { width: "98%" } }, translate("$backToMyProfile"));
    profileBtn.onclick = () => {
      window.location.href = "https://myanimelist.net/profile/" + headerUserName;
    };
    innerDiv.append(profileBtn);
    buttonDiv.remove();
    infoDiv.remove();
  }
  return div;
}

//MalClean Settings - Create Settings Dropdown Elements
function initSetting(settingKey, type, defaultValue) {
  if (svar[settingKey] === undefined) {
    svar[settingKey] = type === "ttl" ? daysToTTL(defaultValue) : defaultValue;
    svar.save();
    reloadWarn();
  }
}

// Function to create Input settings
function createInputSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer input" });
  const input = create("input", { class: `${settingKey}Input`, placeholder: "Input" });
  input.value = svar[settingKey];

  input.addEventListener(
    "input",
    debounce((e) => {
      svar[settingKey] = e.target.value;
      svar.save();
      reloadWarn();
    }, 300)
  );

  $(container).append(`<h3>${text}</h3>`, input);
  return container;
}

// Function to create ttl settings
function createTTLSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer input" });
  const input = create("input", { class: `${settingKey}Input`, placeholder: "Days (Number)" });
  input.value = daysToTTL(svar[settingKey], 1);

  input.addEventListener(
    "input",
    debounce((e) => {
      svar[settingKey] = daysToTTL(e.target.value);
      svar.save();
      reloadWarn();
    }, 300)
  );

  $(container).append(`<h3>${text}</h3>`, input);
  return container;
}

// Function to create option settings
function createOptionSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer svar", id: "settingContainer-" + settingKey });
  const buttons = getButtonsConfig().reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  const btn = buttons[settingKey + "Btn"];
  if (!btn) {
    console.warn(`No button found for settingKey: ${settingKey}`);
    return null;
  }

  $(container).append(btn, `<h3>${text}</h3>`);
  return container;
}

// Function to create select settings
function createSelectSetting(settingKey, text, options = [], defaultValue) {
  const container = create("div", { class: "settingContainer input" });
  const label = create("h3", {}, text);
  const select = create("select", { class: `${settingKey}Select` });

  options.forEach((opt) => {
    const optionEl = create("option", { value: opt.value }, opt.label);
    if (svar[settingKey] === opt.value || (svar[settingKey] === undefined && opt.value === defaultValue)) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  select.addEventListener("change", (e) => {
    svar[settingKey] = e.target.value;
    svar.save();
    reloadWarn();
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}

function getDecimalPlaces(number) {
  if (!isFinite(number)) return 0;
  const str = number.toString();
  if (str.includes(".")) return str.split(".")[1].length;
  return 0;
}

// Function to create slider settings
function createSliderSetting(settingKey, text, options = [], defaultValue) {
  const [min, max, step = 1] = options;

  const sliderWrapper = create("div", { class: "settingContainer slider" });
  const sliderLabel = create("label", { for: settingKey }, text);

  // Slider input
  const sliderInput = create("input", {
    type: "range",
    id: settingKey,
    name: settingKey,
    min: min,
    max: max,
    step: step,
    value: defaultValue,
    class: "sliderInput",
  });

  // Value display
  const sliderValueDisplay = create("span", { class: "sliderValue" }, 
    parseFloat(defaultValue).toFixed(getDecimalPlaces(step))
  );

  // Row to hold slider + value side by side
  const sliderRow = create("div", { class: "sliderRow" });
  sliderRow.append(sliderInput, sliderValueDisplay);

  // Value change listener
  sliderInput.oninput = function () {
    const val = parseFloat(sliderInput.value);
    sliderValueDisplay.textContent = val.toFixed(getDecimalPlaces(step));
  };

  // Debounced save on change
  const debouncedUpdate = debounce((event) => {
    const val = parseFloat(event.target.value);
    svar[settingKey] = val;
    svar.save();
    reloadWarn();
  }, 500);
  sliderInput.addEventListener("change", debouncedUpdate);
  sliderWrapper.append(sliderLabel, sliderRow);
  return sliderWrapper;
}

function createRecentlyFilter(settingKey, text) {
  const includedGenreIds = new Set();
  const excludedGenreIds = new Set();

  const filterValue = svar[settingKey];
  if (filterValue) {
    const decoded = decodeURIComponent(filterValue);
    const params = new URLSearchParams(decoded);

    for (const [key, value] of params.entries()) {
      if (key === "genre[]") {
        includedGenreIds.add(parseInt(value));
      } else if (key === "genre_ex[]") {
        excludedGenreIds.add(parseInt(value));
      }
    }
  }

  const genreList = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 5, name: "Avant Garde" },
    { id: 46, name: "Award Winning" },
    { id: 28, name: "Boys Love" },
    { id: 4, name: "Comedy" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" },
    { id: 26, name: "Girls Love" },
    { id: 47, name: "Gourmet" },
    { id: 14, name: "Horror" },
    { id: 7, name: "Mystery" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 36, name: "Slice of Life" },
    { id: 30, name: "Sports" },
    { id: 37, name: "Supernatural" },
    { id: 45, name: "Suspense" },
    { id: 42, name: "Josei" },
    { id: 15, name: "Kids" },
    { id: 41, name: "Seinen" },
    { id: 25, name: "Shoujo" },
    { id: 27, name: "Shounen" },
    { id: 49, name: "Erotica" },
    { id: 9, name: "Ecchi" },
    { id: 12, name: "Hentai" },
  ].map((genre) => {
    if (includedGenreIds.has(genre.id)) {
      return { ...genre, selected: true };
    } else if (excludedGenreIds.has(genre.id)) {
      return { ...genre, excluded: true };
    } else {
      return genre;
    }
  });

  const filterWrapper = create("div", { class: "settingContainer filter anime-search-filter" });
  filterWrapper.setAttribute("style", "display: grid;grid-template-columns: 1fr 1fr;");
  function createGenreFilter(containerSelector, genres) {
    const container = containerSelector;
    container.classList.add("category-wrapper");

    const header = create("div", { class: "fs10 fw-b mb4 category-type", style: { gridColumn: "1/-1" } }, "Genres");
    container.appendChild(header);
    const loadingIndicator = create("div", { class: "recently-genre-indicator" });
    const debouncedSaveGenres = debounce(() => {
      if (svar.recentlyAddedAnime && location.pathname === "/" && settingKey === "recentlyAnimeFilter") {
        createRecentlyAddedWidget("anime");
      }

      if (svar.recentlyAddedManga && location.pathname === "/" && settingKey === "recentlyMangaFilter") {
        createRecentlyAddedWidget("manga");
      }
      loadingIndicator.remove();
    }, 2000);

    genres.forEach(({ id, name, selected, excluded }) => {
      const span = create("span", { class: `mb4 btn-sort-order js-btn-sort-order${selected ? " selected" : excluded ? " crossed" : ""}` });

      const input = create("input", { value: id, type: "checkbox", id: `genre-${id}`, name: selected ? "genre[]" : excluded ? "genre_ex[]" : "genre[]" });
      input.style.display = "none";
      if (selected) input.checked = true;

      span.addEventListener("click", () => {
        if (span.classList.contains("selected")) {
          span.classList.remove("selected");
          span.classList.add("crossed");
          input.name = "genre_ex[]";
        } else if (span.classList.contains("crossed")) {
          span.classList.remove("crossed");
          input.name = "genre[]";
        } else {
          span.classList.add("selected");
          input.name = "genre[]";
        }
        svar[settingKey] = buildGenreUrl(svar[settingKey]);
        svar.save();
        if (!document.querySelector(".recently-genre-indicator")) {
          header.append(loadingIndicator);
        }
        loadingIndicator.style.display = "none";
        void loadingIndicator.offsetWidth;
        loadingIndicator.style.display = "block";
        debouncedSaveGenres();
      });

      const label = document.createElement("p");
      label.textContent = `${name}`;

      span.appendChild(input);
      span.appendChild(label);
      container.appendChild(span);
    });

    const showAll = document.createElement("a");
    showAll.className = "show-all-btn";
    showAll.style.display = "none";
    showAll.textContent = "Show All";

    container.appendChild(showAll);
  }

  createGenreFilter(filterWrapper, genreList);

  function buildGenreUrl(existingParams = "") {
    const includedGenres = new Set();
    const excludedGenres = new Set();

    if (existingParams) {
      const decoded = decodeURIComponent(existingParams);
      const params = new URLSearchParams(decoded);

      for (const [key, value] of params.entries()) {
        if (key === "genre[]") {
          includedGenres.add(parseInt(value));
        } else if (key === "genre_ex[]") {
          excludedGenres.add(parseInt(value));
        }
      }
    }

    filterWrapper.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      const span = checkbox.closest("span");
      const genreId = parseInt(checkbox.value);

      if (span.classList.contains("selected")) {
        includedGenres.add(genreId);
        excludedGenres.delete(genreId);
      } else if (span.classList.contains("crossed")) {
        excludedGenres.add(genreId);
        includedGenres.delete(genreId);
      } else {
        includedGenres.delete(genreId);
        excludedGenres.delete(genreId);
      }
    });

    const params = [];

    for (const id of includedGenres) {
      params.push(`genre%5B%5D=${id}`);
    }

    for (const id of excludedGenres) {
      params.push(`genre_ex%5B%5D=${id}`);
    }

    return params.length ? "&" + params.join("&") : "";
  }

  return filterWrapper;
}

//MalClean Settings - Create Settings Dropdown
async function createSettingDropdown(parentElement, type, settingKey, defaultValue = true, text, options = []) {
  if (typeof parentElement === "string" && !parentElement.endsWith("Btn")) {
    parentElement += "Btn";
  }

  initSetting(settingKey, type, defaultValue);

  let settingDiv;
  const existingSettings = document.querySelector(`${parentElement}Option .malCleanSettingPopup`);

  if (!existingSettings) {
    const settingButton = create("a", { active: "0", class: "fa fa-gear" });
    settingDiv = create("div", { class: "malCleanSettingPopup", style: { display: "none" } });

    settingButton.onclick = () => {
      const active = $(settingButton).attr("active");
      if (active === "0") {
        $(settingDiv).slideDown();
        $(settingButton).attr("active", "1");
        if (type === "option") getSettings();
      } else {
        $(settingDiv).slideUp();
        $(settingButton).attr("active", "0");
      }
    };

    $(`${parentElement}Option`).append(settingButton);
    $(settingButton).parent().append(settingDiv);
  }

  const targetDiv = existingSettings || settingDiv;
  let settingUI = null;

  switch (type) {
    case "input":
      settingUI = createInputSetting(settingKey, text);
      break;
    case "ttl":
      settingUI = createTTLSetting(settingKey, text);
      break;
    case "option":
      settingUI = createOptionSetting(settingKey, text);
      break;
    case "select":
      settingUI = createSelectSetting(settingKey, text, options, defaultValue);
      break;
    case "slider":
      settingUI = createSliderSetting(settingKey, text, options, defaultValue);
      break;
    case "recentlyFilter":
      settingUI = createRecentlyFilter(settingKey, text);
      break;
  }

  if (settingUI) {
    $(targetDiv).append(settingUI);
  }
}

// ==== objects.js ====
//Profile Foreground Color
let fgColorSelector = create("input", { class: "badgeInput", id: "fgcolorselector", type: "color" });
let updateFgButton = create("button", { class: "mainbtns", id: "privateProfile" }, translate("$update"));
let removeFgButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customFgRemove" });
let fgColorValue = "var(--color-foreground)";
let defaultFgColor = getComputedStyle(document.body);
defaultFgColor = defaultFgColor.getPropertyValue("--color-foreground");
fgColorSelector.value = defaultFgColor.trim();

const debouncedFgUpdate = debounce((event) => {
  fgColorValue = event.target.value;
  changeForeground(fgColorValue);
}, 500);

fgColorSelector.addEventListener("input", debouncedFgUpdate);

updateFgButton.onclick = () => {
  const fgbase64url = encodeAndBase64(fgColorValue);
  editAboutPopup(`customfg/${fgbase64url}`, "fg");
};

removeFgButton.onclick = () => {
  editAboutPopup(`customfg/...`, "fg");
};

//Private Profile
var privateButton = create("button", { class: "mainbtns", id: "privateProfile" }, translate("$private"));
var removePrivateButton = create("button", { class: "mainbtns", id: "privateRemove" }, translate("$public"));

privateButton.onclick = () => {
  editAboutPopup(`privateProfile/IxA=`, "private");
};

removePrivateButton.onclick = () => {
  editAboutPopup(`privateProfile/...`, "private");
};

//Hide Profile Elements
var hideProfileElButton = create("button", { class: "mainbtns", id: "hideProfileElementsButton" }, translate("$hide"));
var hideProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, translate("$update"));
var removehideProfileElButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "hideProfileElementsRemove" });
let hiddenProfileElements = [];
let hiddenProfileElementsTemp = [];
const divIds = [
  "#user-def-favs",
  "#user-friends-div",
  "#user-badges-div",
  "#user-rss-feed-div",
  "#user-links-div",
  "#user-status-div",
  "#user-status-history-div",
  "#user-status-counts-div",
  "#user-button-div",
  "#user-stats-div",
  "#user-updates-div",
  "#user-history-div",
  "#lastcomment",
  "#fav-0-div",
  "#fav-1-div",
  "#fav-2-div",
  "#fav-3-div",
  "#fav-4-div",
  "#favThemes",
];

async function clearHiddenDivs() {
  divIds.forEach((item) => {
    const div = document.querySelector(item);
    if (div) {
      if (hiddenProfileElementsTemp.includes(item)) {
        div.style.display = "none";
      } else {
        div.style.opacity = "1";
        div.style.pointerEvents = "auto";
      }
    }
  });
  $(".hide-button").remove();
  hideProfileElButton.textContent = translate("$hide");
}

function applyHiddenDivs() {
  hiddenProfileElements.forEach((item) => {
    if (divIds.includes(item)) {
      const div = document.querySelector(item);
      if (div) {
        div.style.display = "none";
      }
    }
  });
}

hideProfileElButton.onclick = () => {
  if (userNotHeaderUser) {
    window.location.href = "https://myanimelist.net/profile/" + headerUserName;
  } else {
    hiddenProfileElementsTemp = hiddenProfileElements.slice();
    if (hideProfileElButton.textContent === translate("$hide")) {
      divIds.forEach((divId) => {
        const div = document.querySelector(divId);
        if (div) {
          div.style.removeProperty("display");
          if (hiddenProfileElementsTemp.includes(divId)) {
            div.style.opacity = ".1";
            div.style.pointerEvents = "none";
          }
        }
        if (div && !$(div).next().is(".hide-button")) {
          const hideButton = create("a", { class: "hide-button mal-btn primary mt8 mb8" }, hiddenProfileElementsTemp.includes(divId) ? translate("$show") : translate("$hide"));
          div.insertAdjacentElement("afterend", hideButton);
          hideButton.addEventListener("click", () => {
            hideButton.textContent = hideButton.textContent === translate("$hide") ? translate("$show") : translate("$hide");
            if (hiddenProfileElementsTemp.includes(divId)) {
              hiddenProfileElementsTemp = hiddenProfileElementsTemp.filter((className) => className !== divId);
              div.style.opacity = "1";
              div.style.pointerEvents = "auto";
            } else {
              hiddenProfileElementsTemp.push(divId);
              div.style.opacity = ".1";
              div.style.pointerEvents = "none";
            }
          });
        }
      });
    } else {
      clearHiddenDivs();
      hideProfileElButton.textContent = hideProfileElButton.textContent === translate("$hide") ? translate("$cancel") : translate("$hide");
    }
    hideProfileElButton.textContent = hideProfileElButton.textContent === translate("$hide") ? translate("$cancel") : translate("$hide");
  }
};

hideProfileElUpdateButton.onclick = () => {
  const pfElbase64url = encodeAndBase64(hiddenProfileElementsTemp);
  editAboutPopup(`hideProfileEl/${pfElbase64url}`, "hideProfileEl");
  clearHiddenDivs();
};

removehideProfileElButton.onclick = () => {
  editAboutPopup(`hideProfileEl/...`, "hideProfileEl");
};

//Custom Profile Elements
var customProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, translate("$addToLeftSide"));
var customProfileElRightUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, translate("$addToRightSide"));

customProfileElUpdateButton.onclick = () => {
  if (svar.modernLayout) {
    createCustomDiv();
  } else {
    createCustomDiv("right");
  }
};

customProfileElRightUpdateButton.onclick = () => {
  createCustomDiv("right");
};

//Custom Profile Background
let bgInput = create("input", { class: "bgInput", id: "bgInput" });
bgInput.placeholder = translate("$pasteUrlHere");
var bgButton = create("button", { class: "mainbtns", id: "custombg" }, translate("$update"));
var bgRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "custombgRemove" });
let defaultBgUrl;
var bgInfo = create("p", { class: "textpb" }, "");
function updateBannerBackground(url) {
  const bannerBg = document.querySelector("#banner");
  if (!defaultBgUrl) {
    const computedStyle = getComputedStyle(bannerBg);
    defaultBgUrl = computedStyle.backgroundImage;
  }
  bgInfo.innerText = "";
  isImageLoadable(url, (isValid) => {
    if (!isValid) {
      if (bgInput.value.length > 0) {
        bgInfo.innerText = "Invalid image URL.";
      }
      bannerBg.style.backgroundImage = defaultBgUrl;
      return;
    }
    bannerBg.style.backgroundImage = `url("${url}")`;
  });
}
const debouncedBgUpdate = debounce((event) => {
  const url = event.target.value.trim();
  updateBannerBackground(url);
}, 500);

bgInput.addEventListener("input", debouncedBgUpdate);

let bgShadowColorSelector = create("input", { class: "badgeInput", id: "bgShadowColorSelector", type: "color" });
let bgShadowColorValue = "rgba(6,13,34,0)";
bgShadowColorSelector.addEventListener("input", (event) => {
  const hexColor = event.target.value;
  bgShadowColorValue = hexToRgb(hexColor);
  $(".banner#shadow")[0].setAttribute(
    "style",
    `background: linear-gradient(180deg, rgba(${bgShadowColorValue}, 0) 40%, rgba(${bgShadowColorValue}, .6)); height: 100%; left: 0; position: absolute; top: 0; width: 100%;`
  );
});

bgButton.onclick = () => {
  bgInfo.innerText = "";
  if (bgInput.value.length > 1) {
    const bgbase64url = encodeAndBase64([bgInput.value, bgShadowColorValue]);
    editAboutPopup(`custombg/${bgbase64url}`, "bg");
    bgInput.addEventListener(`focus`, () => bgInput.select());
  } else {
    bgInfo.innerText = "Background Image url empty.";
  }
};
bgRemoveButton.onclick = () => {
  editAboutPopup(`custombg/...`, "bg");
};

//Custom Avatar
var pfButton = create("button", { class: "mainbtns", id: "custompf" }, translate("$update"));
var pfRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "custompfRemove" });
let pfInput = create("input", { class: "pfInput", id: "pfInput" });
pfInput.placeholder = translate("$pasteUrlHere");
var pfInfo = create("p", { class: "textpb" }, "");
let defaultFgUrl;
function updatePfAvatar(url) {
  const fgAvatar = document.querySelector(".user-image.mb8 .lazyloaded");
  if (!defaultFgUrl) {
    defaultFgUrl = fgAvatar.src;
  }
  pfInfo.innerText = "";
  isImageLoadable(url, (isValid) => {
    if (!isValid) {
      if (pfInput.value.length > 0) {
        pfInfo.innerText = "Invalid image URL.";
      }
      fgAvatar.src = defaultFgUrl;
      return;
    }
    fgAvatar.src = url;
  });
}
const debouncedPfUpdate = debounce((event) => {
  const url = event.target.value.trim();
  updatePfAvatar(url);
}, 500);

pfInput.addEventListener("input", debouncedPfUpdate);
pfButton.onclick = () => {
  pfInfo.innerText = "";
  if (pfInput.value.length > 1) {
    const pfbase64url = encodeAndBase64(pfInput.value);
    editAboutPopup(`custompf/${pfbase64url}`, "pf");
    pfInput.addEventListener(`focus`, () => pfInput.select());
  } else {
    pfInfo.innerText = "Avatar Image url empty.";
  }
};
pfRemoveButton.onclick = () => {
  editAboutPopup(`custompf/...`, "pf");
};

//Custom CSS
var cssButton = create("button", { class: "mainbtns", id: "customCSS" }, translate("$update"));
var cssRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customCSSRemove" });
var cssInfo = create("p", { class: "textpb" }, "");
let cssInput = create("textarea", { class: "cssInput", id: "cssInput" });

var cssmodernLayout = create("button", { class: "mainbtns", id: "cssmodernLayout", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var cssmodernLayoutText = create("h3", { style: { display: "inline" } }, translate("$customCSSModern"));
let cssmodernLayoutEnabled = false;
cssmodernLayout.onclick = () => {
  cssmodernLayoutEnabled = !cssmodernLayoutEnabled;
  cssmodernLayout.classList.toggle("btn-active", cssmodernLayoutEnabled);
};

var cssMini = create("button", { class: "mainbtns", id: "cssMini", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var cssMiniText = create("h3", { style: { display: "inline" } }, translate("$customCSSMini"));
let cssMiniEnabled = false;
cssMini.onclick = () => {
  cssMiniEnabled = !cssMiniEnabled;
  cssMini.classList.toggle("btn-active", cssMiniEnabled);
};

cssInput.placeholder = translate("$typeHere");
cssButton.onclick = () => {
  cssInfo.innerText = "";
  if (cssInput.value.length > 1) {
    cssInput.value = cssInput.value
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/\n+/g, "");
    const cssbase64url = encodeAndBase64([cssInput.value, cssmodernLayoutEnabled, cssMiniEnabled]);
    editAboutPopup(`customCSS/${cssbase64url}`, "css");
    cssInput.addEventListener(`focus`, () => cssInput.select());
  } else {
    cssInfo.innerText = "Css empty.";
  }
};
//Custom CSS Preview
const debouncedCustomCSSUpdate = debounce((event) => {
  cssInfo.innerText = "";
  const oldStyle = document.getElementById("customCSS");
  if (oldStyle) oldStyle.remove();

  if (event.target.value.match(/^https?:\/\/.*\.css$/)) {
    const cssLink = create("link", {
      rel: "stylesheet",
      type: "text/css",
      href: event.target.value,
    });
    document.head.appendChild(cssLink);
  } else if (event.target.value.length < 1e6) {
    const cleanedCSS = event.target.value
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/\n+/g, "");

    const style = create("style", { id: "customCSS" }, cleanedCSS);
    document.head.appendChild(style);
  }
}, 500);

cssInput.addEventListener("input", debouncedCustomCSSUpdate);

cssRemoveButton.onclick = () => {
  editAboutPopup(`customCSS/...`, "css");
};

//Mal Badges
let malBadgesInput = create("input", { class: "malBadgesInput", id: "malBadgesInput" });
malBadgesInput.placeholder = translate("$pasteUrlHere");
var malBadgesButton = create("button", { class: "mainbtns", id: "malBadgesBtn" }, translate("$update"));
var malBadgesRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "malBadgesRemove" });
var malBadgesDetailButton = create("button", { class: "mainbtns", id: "malBadgesBtn", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var malBadgesDetailButtonText = create("h3", { style: { display: "inline" } }, translate("$malBadgesDetailed"));
let malBadgesDetailButtonEnabled = false;
let malBadgesInfo = create("p", { class: "textpb" }, "");
malBadgesDetailButton.onclick = () => {
  malBadgesDetailButtonEnabled = !malBadgesDetailButtonEnabled;
  malBadgesDetailButton.classList.toggle("btn-active", malBadgesDetailButtonEnabled);
};

malBadgesButton.onclick = () => {
  if (malBadgesInput.value.length > 1 && malBadgesInput.value.startsWith("https://")) {
    try {
      malBadgesInfo.innerText = "";
      const url = new URL(malBadgesInput.value);
      let allowedHost = ["www.mal-badges.com"];
      if (allowedHost.includes(url.hostname)) {
        const detailMode = malBadgesDetailButtonEnabled ? "?detail" : "";
        const badgeBase64Url = encodeAndBase64(malBadgesInput.value + detailMode);
        editAboutPopup(`malBadges/${badgeBase64Url}`, "malBadges");
        malBadgesInput.addEventListener(`focus`, () => bgInput.select());
      } else {
        malBadgesInfo.innerText = "Please enter a valid URL.\nExample: https://www.mal-badges.com/users/USERNAME";
      }
    } catch (e) {
      malBadgesInfo.innerText = "Please enter a valid URL.\nExample: https://www.mal-badges.com/users/USERNAME";
    }
  }
};
malBadgesRemoveButton.onclick = () => {
  editAboutPopup(`malBadges/...`, "malBadges");
};

//Custom Badge
var badgeButton = create("button", { class: "mainbtns", id: "custombadge" }, translate("$update"));
let badgeInput = create("input", { class: "badgeInput", id: "badgeInput" });
let badgeColorSelector = create("input", { class: "badgeInput", id: "badgecolorselector", type: "color" });
let badgeColorLoop = create("button", { class: "mainbtns", id: "custombadgeColorLoop" }, translate("$rainbow"));
let badgeColorLoopEnabled = false;
let badgeColorValue = "#000000";
badgeInput.placeholder = translate("$pasteUrlHere");
badgeColorLoop.onclick = () => {
  badgeColorLoopEnabled = !badgeColorLoopEnabled;
  if (badgeColorLoopEnabled) {
    badgeColorLoop.style.background = "var(--color-foreground2)";
    badgeColorValue = "loop";
  } else {
    badgeColorLoop.style.background = "var(--color-background)";
    badgeColorSelector.value = "#000000";
    badgeColorValue = "#000000";
  }
};
badgeColorSelector.addEventListener("input", (event) => {
  badgeColorValue = event.target.value;
  badgeColorLoop.style.background = "var(--color-background)";
  badgeColorLoopEnabled = false;
});
badgeButton.onclick = () => {
  if (badgeInput.value.length > 1) {
    const badgeValue = DOMPurify.sanitize(badgeInput.value, purifyConfig);
    const badgebase64url = encodeAndBase64([badgeValue, badgeColorValue]);
    editAboutPopup(`custombadge/${badgebase64url}`, "badge");
    badgeInput.addEventListener(`focus`, () => badgeInput.select());
  } else {
    editAboutPopup(`custombadge/...`, "badge");
  }
};

//Custom Profile Colors
const createColorInput = () => create("input", { class: "customColorInput", type: "color" });
const customColorButton = create("button", { class: "mainbtns", id: "customColorUpdate" }, translate("$update"));
const customColorRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customColorRemove" });
const customColors = create("div", { class: "customColorsInside" });
let defaultLinkColor = getComputedStyle(document.body);
defaultLinkColor = defaultLinkColor.getPropertyValue("--color-link");

const customColorLabels = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch", "Reading", "Completed", "On Hold", "Dropped", "Plan to Read", "Links", "Username"];

const customColorsDefault = ["#338543", "#2d4276", "#c9a31f", "#832f30", "#747474", "#338543", "#2d4276", "#c9a31f", "#832f30", "#747474", defaultLinkColor, "#ffffff"];

let colorValues;
const colorSelectors = Array.from({ length: customColorLabels.length }, (_, index) => {
  const colorInput = createColorInput();
  colorInput.value = customColorsDefault[index];

  const debouncedCustomColorUpdate = debounce(() => {
    colorValues = colorSelectors.map((selector) => selector.value);
    applyCustomColors(colorValues);
  }, 500);

  colorInput.addEventListener("input", debouncedCustomColorUpdate);
  return colorInput;
});
const colorAnimeStats = create("div", { class: "colorGroup" }, "<b>Anime Stats</b>");
customColorLabels.slice(0, 5).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index], colorLabel);
  colorAnimeStats.appendChild(colorDiv);
});

const colorMangaStats = create("div", { class: "colorGroup" }, "<b>Manga Stats</b>");
customColorLabels.slice(5, 10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 5], colorLabel);
  colorMangaStats.appendChild(colorDiv);
});

const colorProfile = create("div", { class: "colorGroup" }, "<b>Profile</b>");
customColorLabels.slice(10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 10], colorLabel);
  colorProfile.appendChild(colorDiv);
});
customColors.append(colorAnimeStats, colorMangaStats, colorProfile);
customColorButton.onclick = () => {
  const colors = colorSelectors.map((selector) => selector.value);
  const customColorBase64Url = encodeAndBase64(colors);
  editAboutPopup(`customcolors/${customColorBase64Url}`, "color");
};
customColorRemoveButton.onclick = () => {
  editAboutPopup(`customcolors/...`, "color");
};

// ==== build.js ====
//MalClean Settings - Create Settings Div
async function createDiv() {
  const buttons = getButtonsConfig().reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  function buildUserModules(container) {
    const categorized = {};
    const existingContainers = {};

    container.querySelectorAll(".malCleanSettingContainer").forEach((div) => {
      const title = div.querySelector("h2")?.textContent;
      if (title) {
        existingContainers[title] = div;
      }
    });

    userModules.forEach((mod) => {
      if (!mod.id || !buttons[mod.id + "Btn"]) {
        console.warn(`Missing Button ID: ${mod.id}`);
        return;
      }

      if (!categorized[mod.category]) {
        categorized[mod.category] = [];
      }

      categorized[mod.category].push({
        b: buttons[mod.id + "Btn"],
        t: mod.description,
        s: mod.extraElement,
      });
    });

    Object.entries(categorized).forEach(([category, btnList]) => {
      if (existingContainers[category]) {
        const existingContainer = existingContainers[category];
        const newContent = createListDiv(category, btnList).querySelector(".mainListBtnsDiv");
        existingContainer.append(newContent);
      } else {
        container.append(createListDiv(category, btnList));
      }
    });
  }

  const modernBtn = "<a style=\"cursor: pointer;\" onclick=\"document.getElementById('modernLayoutBtn').scrollIntoView({ behavior: 'smooth', block: 'start' });\">Modern Profile Layout</a>";
  const listNav = ` <div class="malCleanMainHeaderNav"><button>My Panel</button><button>Anime Manga</button><button>Character</button>
  <button>People</button><button>Blog</button><button>Club</button><button>Forum</button><button>Profile</button></div>`;
  let mainInner = create("div", { class: "malCleanMainContainer" }, '<div class="malCleanMainHeader"><div class="malCleanMainHeaderTitle"><b>' + stLink.innerText + "</b></div>" + listNav + "</div>");
  let listDiv = create("div", { class: "malCleanMainContainerList" });
  mainInner.append(listDiv);
  let customfgDiv = createCustomSettingDiv(
    translate("$customForegroundTitle", modernBtn),
    translate("$customForegroundDesc"),
    null,
    [fgColorSelector, updateFgButton, removeFgButton],
    ["65% 25% 10%"],
    null,
    svar.modernLayout,
    "profile"
  );

  let custombgDiv = createCustomSettingDiv(
    translate("$customBannerTitle", modernBtn),
    translate("$customBannerDesc"),
    null,
    [bgInput, bgShadowColorSelector, bgButton, bgRemoveButton],
    ["50% 15% 25% 10%"],
    [bgInfo],
    svar.modernLayout,
    "profile"
  );

  let custompfDiv = createCustomSettingDiv(translate("$custompfTitle"), translate("$custompfDesc"), null, [pfInput, pfButton, pfRemoveButton], ["65% 25% 10%"], [pfInfo], 1, "profile");

  let custombadgeDiv = createCustomSettingDiv(
    translate("$custombadgeTitle", modernBtn),
    translate("$custombadgeDesc"),
    null,
    [badgeInput, badgeColorSelector, badgeColorLoop, badgeButton],
    ["50% 15% auto auto"],
    null,
    svar.modernLayout,
    "profile"
  );

  let malBadgesDiv = createCustomSettingDiv(
    translate("$malBadgesTitle"),
    translate("$malBadgesDesc"),
    null,
    [malBadgesInput, malBadgesButton, malBadgesRemoveButton],
    ["65% 25% 10%"],
    [malBadgesDetailButton, malBadgesDetailButtonText, malBadgesInfo],
    1,
    "profile"
  );

  let customCSSDiv = createCustomSettingDiv(
    translate("$customCSSTitle"),
    translate("$customCSSDesc"),
    null,
    [cssInput, cssButton, cssRemoveButton],
    ["65% 25% 10%"],
    [cssmodernLayout, cssmodernLayoutText, "<br>", cssMini, cssMiniText, cssInfo],
    1,
    "profile"
  );

  let customColorsDiv = createCustomSettingDiv(
    translate("$customColorsTitle"),
    translate("$customColorsDesc"),
    [customColors],
    [customColorButton, customColorRemoveButton],
    ["90% 10%"],
    null,
    1,
    "profile"
  );

  let privateProfileDiv = createCustomSettingDiv(translate("$privateProfileTitle"), translate("$privateProfileDesc"), null, [privateButton, removePrivateButton], ["50% 50%"], null, 1, "profile");
  let hideProfileElDiv = createCustomSettingDiv(
    translate("$hideProfileElTitle"),
    translate("$hideProfileElDesc"),
    null,
    [hideProfileElButton, hideProfileElUpdateButton, removehideProfileElButton],
    ["65% 25% 10%"],
    null,
    1,
    "profile"
  );

  let customProfileElDiv = createCustomSettingDiv(
    translate("$customProfileElTitle"),
    translate("$customProfileElDesc"),
    null,
    [customProfileElUpdateButton, customProfileElRightUpdateButton],
    [svar.modernLayout ? "50% 50%" : "100%"],
    null,
    1,
    "profile"
  );

  mainInner.querySelector(".malCleanMainHeaderTitle").append(dragButton, innerSettingsButton, reloadButton, closeButton);
  listDiv.append(
    createListDiv("My Panel", [
      { b: buttons["animeInfoBtn"], t: translate("$animeInfoSetting") },
      { b: buttons["currentlyWatchingBtn"], t: translate("$showCurrentlyWatchingAnime") },
      { b: buttons["currentlyReadingBtn"], t: translate("$showCurrentlyReadingManga") },
      { b: buttons["currentlyGridBtn"], t: translate("$addCurrentlyGrid") },
      { b: buttons["airingDateBtn"], t: translate("$addEpisodeCountdown") },
      { b: buttons["autoAddDateBtn"], t: translate("$autoAddDates") },
      { b: buttons["recentlyAddedAnimeBtn"], t: translate("$showRecentlyAddedAnime") },
      { b: buttons["recentlyAddedMangaBtn"], t: translate("$showRecentlyAddedManga") },
      { b: buttons["recentlyGridBtn"], t: translate("$addRecentlyGrid") },
      { b: buttons["headerSlideBtn"], t: translate("$autoHideHeader") },
      { b: buttons["scrollbarStyleBtn"], t: translate("$changeScrollbarAppearance") },
      { b: buttons["hideNonJapaneseAnimeBtn"], t: translate("$hideNonJapaneseAnime") },
      { b: buttons["embedBtn"], t: translate("$modernAnimeMangaLinks") },
      { b: buttons["editorLivePreviewBtn"], t: translate("$editorLivePreview") },
    ]),
    createListDiv("Anime - Manga", [
      { b: buttons["animeBgBtn"], t: translate("$dynamicBackgroundColor") },
      { b: buttons["animeBlurredBgBtn"], t: translate("$animeBlurredBackground") },
      { b: buttons["animeBannerBtn"], t: translate("$addAnilistBanner") },
      { b: buttons["animeTagBtn"], t: translate("$addAnilistTags") },
      { b: buttons["animeRelationBtn"], t: translate("$replaceRelations") },
      { b: buttons["animeSongsBtn"], t: translate("$replaceAnimeSongs") },
      { b: buttons["editPopupBtn"], t: translate("$replaceEditDetails") },
      { b: buttons["animeInfoDesignBtn"], t: translate("$changeInfoDesign") },
      { b: buttons["animeHeaderBtn"], t: translate("$changeTitlePosition") },
      { b: buttons["customCoverBtn"], t: translate("$customCoverImage") },
    ]),
    createListDiv("Character", [
      { b: buttons["charBgBtn"], t: translate("$charDynamicBackground") },
      { b: buttons["characterHeaderBtn"], t: translate("$changeCharacterNamePosition") },
      { b: buttons["characterNameAltBtn"], t: translate("$showAltCharacterName") },
      { b: buttons["customCharacterCoverBtn"], t: translate("$customCharacterCover") },
    ]),
    createListDiv("People", [{ b: buttons["peopleHeaderBtn"], t: translate("$changePeopleNamePosition") }]),
    createListDiv("Blog", [
      { b: buttons["blogRedesignBtn"], t: translate("$redesignBlogPage") },
      { b: buttons["blogContentBtn"], t: translate("$autoFetchBlogContent") },
    ]),
    createListDiv("Club", [{ b: buttons["clubCommentsBtn"], t: translate("$expandClubComments") }]),
    createListDiv("Forum", [{ b: buttons["forumDateBtn"], t: translate("$changeDateFormatForum") }]),
    createListDiv("Profile", [
      { b: buttons["modernLayoutBtn"], t: translate("$modernProfileLayout") },
      { b: buttons["replaceListBtn"], t: translate("$modernAnimeMangaList") },
      { b: buttons["profileRemoveLeftSideBtn"], t: translate("$hideProfileLeftSide") },
      { b: buttons["headerOpacityBtn"], t: translate("$autoHeaderOpacity") },
      { b: buttons["moveBadgesBtn"], t: translate("$moveBadgesPosition") },
      { b: buttons["actHistoryBtn"], t: translate("$showActivityHistory") },
      { b: buttons["profileAnimeGenreBtn"], t: translate("$showAnimeGenreOverview") },
      { b: buttons["profileMangaGenreBtn"], t: translate("$showMangaGenreOverview") },
      { b: buttons["moreFavsBtn"], t: translate("$moreThan10Favorites") },
      { b: buttons["customCSSBtn"], t: translate("$showCustomCSS") },
      { b: buttons["newCommentsBtn"], t: translate("$commentsRedesign") },
      { b: buttons["profileNewCommentsBtn"], t: translate("$profileCommentsRedesign") },
      { b: buttons["profileHeaderBtn"], t: translate("$changeUsernamePosition") },
    ])
  );
  listDiv.append(privateProfileDiv, hideProfileElDiv, customProfileElDiv, malBadgesDiv, custompfDiv, custombadgeDiv, custombgDiv, customfgDiv, customColorsDiv, customCSSDiv);
  buildUserModules(listDiv);
  document.querySelector("#headerSmall").insertAdjacentElement("beforeend", mainInner);
  listDiv.append(buttons["removeAllCustomBtn"]);
  createSettingDropdown("#animeBlurredBgBtn", "slider", "animeBlurredBgBlur", svar.animeBlurredBgBlur, translate("$animeBlurredBackgroundBlur"), [0, 10, 0.1]);
  createSettingDropdown("#animeBlurredBgBtn", "slider", "animeBlurredBgBrightness", svar.animeBlurredBgBrightness, translate("$animeBlurredBackgroundBrightness"), [0, 10, 0.1]);
  createSettingDropdown("#animeBlurredBgBtn", "slider", "animeBlurredBgSaturate", svar.animeBlurredBgSaturate, translate("$animeBlurredBackgroundSaturate"), [0, 10, 0.1]);
  createSettingDropdown("#scrollbarStyleBtn", "slider", "scrollbarStyleWidth", svar.scrollbarStyleWidth, translate("$changeScrollbarWidth"), [2, 100, 1]);
  createSettingDropdown("#replaceListBtn", "option", "listAiringStatus", true, translate("$addAiringDot"));
  createSettingDropdown("#moreFavsBtn", "option", "moreFavsMode", true, translate("$addmoreFavsMode"));
  createSettingDropdown("#embedBtn", "option", "embedForum", true, "Forum");
  createSettingDropdown("#embedBtn", "option", "embedNews", false, "News");
  createSettingDropdown("#embedBtn", "ttl", "embedTTL", 30, translate("$ddEmbedTTL"));
  createSettingDropdown("#animeTagBtn", "option", "categorizeTags", false, translate("$categorizeTags"));
  createSettingDropdown("#animeTagBtn", "ttl", "tagTTL", 7, translate("$ddTagTTL"));
  createSettingDropdown("#animeRelationBtn", "ttl", "relationTTL", 7, translate("$ddRelationTTL"));
  createSettingDropdown("#animeRelationBtn", "option", "relationFilter", false, translate("$addRelationFilter"));
  createSettingDropdown("#modernLayoutBtn", "option", "autoModernLayout", false, translate("$ddAutoModernLayout"));
  createSettingDropdown("#animeBannerBtn", "option", "animeBannerMove", false, translate("$addAnimeBannerMove"));
  createSettingDropdown("#currentlyGridBtn", "option", "currentlyGrid6Column", false, translate("$addCurrentlyGrid6Column"));
  createSettingDropdown("#currentlyGridBtn", "option", "currentlyGridAccordion", false, translate("$addCurrentlyGridAccordion"));
  createSettingDropdown("#recentlyGridBtn", "option", "recentlyGrid6Column", false, translate("$addCurrentlyGrid6Column"));
  createSettingDropdown("#recentlyGridBtn", "option", "recentlyGridAccordion", false, translate("$addCurrentlyGridAccordion"));
  createSettingDropdown("#recentlyAddedAnimeBtn", "recentlyFilter", "recentlyAnimeFilter", translate("$addCurrentlyGridAccordion"));
  createSettingDropdown("#recentlyAddedMangaBtn", "recentlyFilter", "recentlyMangaFilter", translate("$addCurrentlyGridAccordion"));
  createSettingDropdown("#recentlyAddedAnimeBtn", "select", "recentlyAnimeDefault", svar.recentlyAnimeDefault, translate("$recentlyAnimeDefault"), [
    { value: "All", label: "All" },
    { value: "TV,Movie", label: "TV &amp; Movie" },
    { value: "TV", label: "TV" },
    { value: "TV Special", label: "TV Special" },
    { value: "Movie", label: "Movie" },
    { value: "ONA", label: "ONA" },
    { value: "OVA", label: "OVA" },
    { value: "Music", label: "Music" },
    { value: "CM", label: "CM" },
  ]);
  createSettingDropdown("#recentlyAddedMangaBtn", "select", "recentlyMangaDefault", svar.recentlyMangaDefault, translate("$recentlyMangaDefault"), [
    { value: "All", label: "All" },
    { value: "Manga", label: "Manga" },
    { value: "One-shot", label: "One-shot" },
    { value: "Doujinshi", label: "Doujinshi" },
    { value: "Light Novel", label: "Light Novel" },
    { value: "Novel", label: "Novel" },
    { value: "Manhwa", label: "Manhwa" },
    { value: "Manhua", label: "Manhua" },
  ]);
  runModulesDropdown();

  $(".malCleanSettingButtons input").attr("style", "height: 38px;padding: 0 6px!important");
  $("#moreFavsModeBtn").on("click", async function () {
    await delay(200);
    if ($("#moreFavsModeBtn").hasClass("btn-active")) {
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character", "moreFavs_people", "moreFavs_company");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
      }
    }
  });

  // Reset CSS
  const debouncedResetTheme = debounce(resetTheme, 500);
  $("#scrollbarStyleWidth").on("change", debouncedResetTheme);
  $("#animeBlurredBgBlur").on("change", debouncedResetTheme);
  $("#animeBlurredBgBrightness").on("change", debouncedResetTheme);
  $("#animeBlurredBgSaturate").on("change", debouncedResetTheme);

  $("#autoModernLayoutBtn").on("click", async function () {
    svar.modernLayout = !svar.autoModernLayout;
    svar.save();
    getSettings();
  });
  getSettings();

  //Disable Buttons
  if (defaultMal) {
    disableButton("headerSlideBtn", translate("$mcUserStyleWarn"));
    disableButton("headerOpacityBtn", translate("$mcUserStyleModernWarn"));
  } else {
    disableButton("scrollbarStyleBtn", translate("$activeMcUserStyleWarn"));
    disableButton("scrollbarStyleWidthBtn", translate("$activeMcUserStyleWarn"));
  }
  if (!svar.modernLayout) {
    disableButton("headerOpacityBtn", translate("$mcUserStyleModernReqWarn"));
    disableButton("profileRemoveLeftSideBtn", translate("$modernProfileWarn"));
    disableButton("moveBadgesBtn", translate("$modernProfileWarn"));
    disableButton("profileAnimeGenreBtn", translate("$modernProfileWarn"));
    disableButton("profileMangaGenreBtn", translate("$modernProfileWarn"));
  } else {
    disableButton("profileHeaderBtn", translate("$disableModernProfileWarn"));
  }

  //Add Tooltip to buttons
  if (svar.animeBlurredBg) {
    tooltipButton("animeBgBtn", translate("$disableAnimeBlurredBgWarn"));
  }
  tooltipButton("replaceListBtn", translate("$modernAnimeMangaListWarn"));
  tooltipButton("hideNonJapaneseAnimeBtn", translate("$hideNonJapaneseAnimeWarn"));

  //Navigation
  const navButtons = mainInner.querySelectorAll(".malCleanMainHeaderNav button");
  const settingContainers = mainInner.querySelectorAll(".malCleanSettingContainer[id]");
  navButtons.forEach((button) => {
    button.classList.add("mainbtns");
    const sectionName = button.textContent
      .trim()
      .toLowerCase()
      .replace(/[\W_]+/g, "-");
    button.onclick = function () {
      function slideControl() {
        const targetSection = mainInner.querySelector(".malCleanSettingContainer#" + sectionName);
        if (targetSection) {
          const offset = 80;
          const elementPosition = targetSection.offsetTop;
          const offsetPosition = elementPosition - offset;
          listDiv.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
      const hideSetting = document.querySelectorAll(".malCleanSettingInnerSettings.malCleanSettingPopup");
      if (hideSetting.length) {
        $(hideSetting).slideUp(() => {
          slideControl();
        });
        document.querySelector("#innerSettingsButton").setAttribute("active", "0");
      } else {
        slideControl();
      }
    };
  });

  //Highlight Active Section
  let ticking = false;
  function highlightClosestSection() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      function highlightControl() {
        let closestSection = null;
        let minDistance = Infinity;
        const listTop = listDiv.getBoundingClientRect().top;
        const referencePoint = listTop + 20;

        settingContainers.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - referencePoint);
          const isInView = rect.top <= referencePoint && rect.bottom >= listTop;

          if (isInView && distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });

        // Highlight the closest section
        navButtons.forEach((button) => {
          if (closestSection) {
            const buttonTarget = button.textContent
              .trim()
              .toLowerCase()
              .replace(/[\W_]+/g, "-")
              .replace(/^-+|-+$/g, "");

            const isActive = buttonTarget === closestSection.id;
            button.classList.toggle("btn-active-def", isActive);
          } else {
            button.classList.remove("btn-active-def");
          }
        });

        ticking = false;
      }
      const hideSetting = document.querySelectorAll(".malCleanSettingInnerSettings.malCleanSettingPopup");
      if (hideSetting.length) {
        $(hideSetting).slideUp(() => {
          highlightControl();
        });
        document.querySelector("#innerSettingsButton").setAttribute("active", "0");
      } else {
        highlightControl();
      }
    });
  }

  // Throttling
  function throttledEvent() {
    highlightClosestSection();
  }

  listDiv.addEventListener("scroll", debounce(throttledEvent, 50));
  highlightClosestSection();

  // Make Draggable
  let isDragging = false;
  let hasMoved = false;
  let offsetX = 0;
  let offsetY = 0;

  dragButton.addEventListener("mousedown", function (e) {
    if (e.target !== dragButton) return;
    isDragging = true;
    offsetX = e.clientX - mainInner.offsetLeft;
    offsetY = e.clientY - mainInner.offsetTop;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      hasMoved = true;
      moveWithinBounds(e.clientX - offsetX, e.clientY - offsetY);
    }
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  window.addEventListener("resize", function () {
    if (hasMoved) {
      keepInsideViewport();
    } else {
      // If no movement has been made, stay on the right side.
      const rect = mainInner.getBoundingClientRect();
      mainInner.style.left = window.innerWidth - rect.width - 15 + "px";
      mainInner.style.top = "55px";
    }
  });

  function moveWithinBounds(left, top) {
    const maxLeft = window.innerWidth - mainInner.offsetWidth;
    const maxTop = window.innerHeight - mainInner.offsetHeight;
    const minTop = 55;

    const newLeft = Math.max(0, Math.min(left, maxLeft));
    const newTop = Math.max(minTop, Math.min(top, maxTop));

    mainInner.style.left = newLeft + "px";
    mainInner.style.top = newTop + "px";
  }

  function keepInsideViewport() {
    const currentLeft = parseInt(mainInner.style.left || 0);
    const currentTop = parseInt(mainInner.style.top || 0);
    moveWithinBounds(currentLeft, currentTop);
  }

  // Init position
  const rect = mainInner.getBoundingClientRect();
  mainInner.style.left = window.innerWidth - rect.width - 15 + "px";
  mainInner.style.top = "55px";
  mainInner.style.right = "";
}

// ==== controller.js ====
const pageIsForum = /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
const pageIsForumTopic = /\/forum\/.?topicid([\w-]+)?\/?/.test(location.href);
const pageIsAniManga =
  /\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(ownlist|season|adapted|recommendations)/.test(current) &&
  !document.querySelector("#content > .error404");
const pageIsAniMangaPHP = /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(location.href);
const pageIsProfile = /\/(profile)\/.?([\w]+)?\/?/.test(current);
const pageIsCharacter = /\/(character)\/.?([\w-]+)?\/?/.test(current);
const pageIsClubs = /\/(clubs)/.test(current);
const pageIsPeople = /\/(people)\/.?([\w-]+)?\/?/.test(current);
const pageIsNews = /\/news\/\d/.test(location.href);
const pageIsCompany = /(anime|manga)\/(producer)\/.?([\w-]+)?\/?/.test(current);
const pageIsTopAnime = /(topanime.php)/.test(current);
const pageIsAnimeSeason = /(\/anime\/season)/.test(current);
const pageIsAnimeGenre = /(\/anime\/genre\/)/.test(current);
const pageIsCompare = /(shared.php)/.test(current);
let blockU = create("i", { class: "fa fa-ban mt4 ml12 blockUserIcon" });
blockU.onclick = () => {
  blockUser(username);
};

if (pageIsAniManga) {
  await colorFromCover();
  pageFixes("anime-manga");
  getAiringTime();
  await loadAniSong();
  if (svar.moreFavs) {
    addMoreFavs("anime_manga");
  }
  if (svar.animeRelation) {
    getRelations();
  }
  if (svar.customCover) {
    getCustomCover("cover");
    loadCustomCover(1, "cover");
  }
  if (svar.animeTag) {
    getTags();
  }
  if (svar.animeBanner) {
    getBannerImage();
  }
}

if (pageIsCharacter) {
  await colorFromCover();
  pageFixes("character");
  if (svar.moreFavs) {
    addMoreFavs("character");
  }
  if (svar.customCharacterCover) {
    getCustomCover("character");
    loadCustomCover(1, "character");
  }
}
if (pageIsPeople) {
  if (svar.moreFavs) {
    addMoreFavs("people");
  }
}
if (pageIsCompany) {
  if (svar.moreFavs) {
    addMoreFavs("company");
  }
}

if (pageIsProfile) {
  addLoading("add", translate("$loadingProfile", username), 1, 1);
  if (svar.profileNewComments && isMainProfilePage) {
    newProfileComments(1);
  }
  //Add Block User Button
  if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
    $("a.header-right").after(blockU);
  }
}

if (pageIsCompare) {
  compareUserLists();
  compareUserListSortDiff();
}

if (svar.newComments && location.href.includes("https://myanimelist.net/comments.php")) {
  newProfileComments();
}

if (pageIsTopAnime) {
  if (svar.hideNonJapaneseAnime) {
    removeFromTopAnime(nonJapaneseIds);
  }
}

if (pageIsAnimeSeason || pageIsAnimeGenre) {
  if (svar.hideNonJapaneseAnime) {
    removeFromAnimeSeason(nonJapaneseIds);
  }
}

if (pageIsAniMangaPHP && document.querySelector("h1").innerHTML === "Anime Search") {
  if (svar.hideNonJapaneseAnime) {
    removeFromAnimeSearch(nonJapaneseIds);
  }
}

if (location.pathname === "/") {
  if (svar.hideNonJapaneseAnime) {
    removeFromTopAnimeWidget(nonJapaneseIds);
  }
}

// ==== animeManga_addCustomCover.js ====
//Custom Anime/Manga Cover
async function loadCustomCover(force = "0", storeType = "cover") {
  if (!loadingCustomCover || force !== "0") {
    const coverLocalForage = await localforage.createInstance({ name: "MalJS", storeName: storeType });
    coverLocalForage.iterate((value, key) => {
      if (value.defaultImage && value.coverImage) {
        $("img").each(function () {
          const $img = $(this);
          if ($img.parent().attr("class") !== "js-picture-gallery") {
            const dataSrc = $img.attr("data-src") || "";
            const imgSrc = $img.attr("src") || "";
            const imgAlt = $img.attr("alt")?.toUpperCase() || "";
            const imgSrcSet = $img.attr("srcset")?.toUpperCase() || "";
            const dbTitle = value.title;
            const dbDefaultImage = value.defaultImage;
            const dbTitleMatch = storeType === "character" ? dbTitle.some((el) => imgAlt.includes(el.toUpperCase())) : imgAlt.includes(dbTitle.toUpperCase());
            if ((imgSrc && imgSrc.includes(dbDefaultImage)) || (dataSrc && dataSrc.includes(dbDefaultImage))) {
              if (imgAlt && dbTitleMatch) {
                if (value.type && (imgSrc.toUpperCase().includes(`/${value.type}/`) || dataSrc.toUpperCase().includes(`/${value.type}/`))) {
                  $img.addClass("customCover").attr("customCover", "1").attr("src", value.coverImage).attr("data-src", value.coverImage).removeAttr("srcset").removeAttr("data-srcset");

                  if (value.fit && value.fit !== "initial") {
                    $img.css("object-fit", value.fit);
                  }
                  if (value.position && value.position !== "50% 50%") {
                    $img.css("object-position", value.position);
                  }
                }
              }
            }
          }
        });
      }
    });
    loadingCustomCover = 1;
  }
}
// Add Custom Cover
async function getCustomCover(storeType) {
  if (location.pathname.endsWith("/pics")) {
    const coverLocalForage = localforage.createInstance({ name: "MalJS", storeName: storeType });
    let coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
    const picTable = document.querySelector("#content > table > tbody > tr > td:nth-child(2) table[cellspacing='10'] tbody");
    const mainButton = create("a", { active: "0", class: "add-custom-pic-button", style: { cursor: "pointer" } }, "Change Cover");
    const defaultImg = document.querySelector("div:nth-child(1) > a > img");
    const characterTitle = $(".title-name")
      .text()
      .replace(/\(.*\)/, "")
      .replace(/\".*\"/, "")
      .trim()
      .replace(/"[^"]*"\s*/, "")
      .split(/\s+/);
    const formattedCharacterTitle = [characterTitle.reverse().join(", "), characterTitle.reverse().join(" ")];
    $(".floatRightHeader").append(" - ", mainButton);
    mainButton.addEventListener("click", async () => {
      const active = $(mainButton).attr("active");
      if (active == "0") {
        if (!document.querySelector("#customCoverPreview")) {
          mainButton.innerText = "Change Cover [X]";
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
          let customCoverDiv = create("div", { class: "customCoverDiv" });
          let customCoverInput = create("input", { id: "customCoverInput", style: { margin: "5px" }, placeholder: "Custom Cover URL" });
          let customCoverFit = AdvancedCreate("select", "maljsNativeInput", false, customCoverDiv);
          let addOption = function (value, text) {
            let newOption = AdvancedCreate("option", false, text, customCoverFit);
            newOption.value = value;
          };
          addOption("initial", "default");
          addOption("cover", "cover");
          addOption("contain", "contain");
          addOption("scale-down", "scale-down");
          addOption("none", "none");

          const coverPreview = `<td width="225" align="center" style="min-width:320px;">
          <div class="picSurround" id="customCoverPreview"><a class="js-picture-gallery" rel="gallery-anime"><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="max-width:225px;"><p>Custom Cover</p></div><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 70px;height: 110px;object-fit: initial;"><p>70x110</p><br>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 50px;height: 70px;object-fit: initial;"><p>50x70</p></div></a></div></td>
          <td width="225" align="center">
          <div class="picSurround"><a class="js-picture-gallery" rel="gallery-anime">
          <img id="defaultCoverImage" class="lazyloaded" src="${coverCache?.defaultImageSrc ? coverCache?.defaultImageSrc : defaultImg.src}" style="max-width:225px;">
          </a><div style="text-align: center;" class="spaceit"><a>Default Cover</a></div></div></td>`;
          const coverPreviewParent = create("tr", { id: "customCoverPreviewTable" }, coverPreview);
          picTable.insertBefore(coverPreviewParent, picTable.firstChild);

          const imgPosSlider = `<div class="cover-position-slider-container" style="display:none">
          <label for="xSlider">X:</label><input type="range" class ="coverSlider" id="coverXSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;margin-right: 5px;">
          <label for="ySlider">Y:</label><input type="range" class ="coverSlider" id="coverYSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;"></div>`;

          customCoverDiv.append(customCoverInput, customCoverFit);
          $("#customCoverPreview").append(customCoverDiv, imgPosSlider);
          picTable.style.width = "100%";
          $(picTable).find("td").css("min-width", "310px");

          //Update Cover Positions
          const xSlider = document.getElementById("coverXSlider");
          const ySlider = document.getElementById("coverYSlider");
          function updateCoverPositions() {
            const x = xSlider.value + "%";
            const y = ySlider.value + "%";
            $("#customCoverPreview img").css("object-position", `${x} ${y}`);
          }
          xSlider.addEventListener("input", updateCoverPositions);
          ySlider.addEventListener("input", updateCoverPositions);
          customCoverFit.addEventListener("change", function (e) {
            $("#customCoverPreview img").css("object-fit", customCoverFit.value);
            if (customCoverFit.value !== "initial") {
              $("#customCoverPreview .cover-position-slider-container").css("display", "grid");
              $("#customCoverPreview .coverSlider").val("50");
            } else {
              $("#customCoverPreview .cover-position-slider-container").css("display", "none");
            }
          });
          customCoverInput.addEventListener("change", function (e) {
            $("#customCoverPreview img").attr("src", customCoverInput.value);
          });
        }
        const tdElements = picTable.querySelectorAll("td");
        tdElements.forEach((td) => {
          if (td.querySelector(".custom-cover-select-btn")) return;
          if (td.querySelector("img")) {
            const selectButton = create("a", { class: "custom-cover-select-btn mal-btn primary" }, "Select");
            selectButton.addEventListener("click", async () => {
              const img = td.querySelector("img");
              if (img && img.height > 10) {
                if (coverCache?.defaultImage && img.src.includes(coverCache.defaultImage)) {
                  await coverLocalForage.removeItem(entryId + "-" + entryType);
                  $("div:nth-child(1) > a > img").first().attr("src", img.src);
                  $("#defaultCoverImage").attr("src", img.src);
                } else {
                  await coverLocalForage.setItem(entryId + "-" + entryType, {
                    key: entryId + "-" + entryType,
                    title: storeType == "cover" ? entryTitle : formattedCharacterTitle,
                    type: storeType == "character" ? "CHARACTERS" : entryType,
                    fit: img.style.objectFit ? img.style.objectFit : "initial",
                    position: img.style.objectPosition ? img.style.objectPosition : "50% 50%",
                    defaultImage: coverCache?.defaultImage ? coverCache.defaultImage : defaultImg?.src?.replace(/\.\w+$/, "").replace("https://cdn.myanimelist.net/images/", "") || "",
                    defaultImageSrc: coverCache?.defaultImageSrc ? coverCache.defaultImageSrc : defaultImg?.src,
                    coverImage: img.src,
                  });
                }
                mainButton.innerText = "Change Cover";
                if (storeType === "cover") {
                  await loadCustomCover(1);
                } else if (storeType === "character") {
                  await loadCustomCover(1, "character");
                }
                $(".custom-cover-select-btn").remove();
                $("#customCoverPreviewTable").remove();
                $(mainButton).attr("active", "0");
              }
            });
            td.appendChild(selectButton);
          }
        });
        $(mainButton).attr("active", "1");
      } else {
        mainButton.innerText = "Change Cover";
        $(".custom-cover-select-btn").remove();
        $("#customCoverPreviewTable").remove();
        $(mainButton).attr("active", "0");
      }
    });
  }
}

// ==== animeManga_aniSongs.js ====
async function loadAniSong() {
  if (svar.animeSongs) {
    //Anisongs for MAL
    //fork of anisongs by morimasa
    //https://greasyfork.org/en/scripts/374785-anisongs
    const anisongs_temp = {
      last: null,
      target: null,
      id: null,
    };
    const songCache = localforage.createInstance({ name: "MalJS", storeName: "anisongs" });
    let currentpath =
      current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/) &&
      !/\/(ownlist|season|recommendations)/.test(current) &&
      !document.querySelector("#content > .error404") &&
      !current.split("/")[4] &&
      !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current)
        ? current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/)
        : null;
    if (currentpath && currentpath[1] === "anime") {
      anisongs_temp.id = currentpath[2];
      anisongs_temp.target = document.querySelector(".rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)");
      if (anisongs_temp.last !== anisongs_temp.id) {
        if (anisongs_temp.target) {
          anisongs_temp.last = anisongs_temp.id;
          launch(anisongs_temp.id);
        } else {
          setTimeout(anisong, 500);
        }
      }
    } else if (currentpath && currentpath[1] === "manga") {
      cleaner(anisongs_temp.target);
      anisongs_temp.last = 0;
    } else {
      anisongs_temp.last = 0;
    }
    const options = { cacheTTL: 604800000, class: "anisongs" };
    let anisongdata, op1, ed1;
    function sanitizeTitle(text) {
      text = text
        .replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g, "")
        .replace(/(.*)( by )(.*)/g, "$1")
        .replace(/(.*)( feat\.| ft\. )(.*)/g, "$1")
        .replace(/(Produced|\WProduced)/g, "")
        .replace(/["']/g, "")
        .replace(/[^\x20-\x7E]/g, "")
        .replace(/,/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      text = DOMPurify.sanitize(text);
      return text;
    }

    const API = {
      //Get Songs from JikanAPI
      async getSongs(mal_id) {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${anisongs_temp.id}/themes`);
        return res.json();
      },
      //Get Videos from AnimeThemesAPI
      async getVideos(anilist_id) {
        const include = ["animethemes.animethemeentries.videos", "animethemes.song", "animethemes.song.artists"].join(",");
        const res = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${anisongs_temp.id}&include=${include}`);
        return res.json();
      },
    };
    class VideoElement {
      constructor(parent, url) {
        this.url = url;
        this.parent = parent;
        this.make();
      }
      toggle() {
        if (this.el.parentNode) {
          this.el.remove();
        } else {
          this.parent.append(this.el);
        }
      }
      make() {
        const box = document.createElement("div"),
          vid = document.createElement("video");
        vid.src = this.url;
        vid.controls = true;
        vid.preload = true;
        vid.volume = 0.5;
        box.append(vid);
        this.el = box;
      }
    }
    class Videos {
      constructor(id) {
        this.id = id;
      }
      async get() {
        const { anime } = await API.getVideos(this.id);
        if (anime.length === 0) {
          return {
            OP: [],
            ED: [],
          };
        }
        //Sort and Remove Dubbed OP-ED
        let d = anime ? anime[0].animethemes.sort((a, b) => a.sequence - b.sequence) : null;
        let t = [];
        for (let x = 0; x < d.length; x++) {
          let reg = /Dubbed/;
          if (d[x].group && !d[x].group.match(reg)) {
            t.push(d[x]);
          } else if (!d[x].group) {
            t.push(d[x]);
          }
        }
        return Videos.groupTypes(t);
      }
      static groupTypes(songs) {
        const groupBy = (xs, key) => {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        return groupBy(songs, "type");
      }
      static merge(entries, videos) {
        const cleanTitle = (song) => {
          return song.replace(/^\d{1,2}:/, "");
        };
        const findUrl = (n) => {
          let url;
          if (videos[n]) {
            if (videos[n].animethemeentries[0] && videos[n].animethemeentries[0].videos[0]) {
              url = videos[n].animethemeentries[0].videos[0].link;
            }
            if (url) url = url.replace(/staging\./, "");
          }
          return url;
        };
        if (videos) {
          return entries.map((e, i) => {
            let u = null;
            for (let x = 0; x < videos.length; x++) {
              let vid = videos[x];
              let link = vid.animethemeentries[0].videos[0] && vid.animethemeentries[0].videos[0].link ? vid.animethemeentries[0].videos[0].link : null;
              let m = 0;
              let title = sanitizeTitle(cleanTitle(e));
              let title2 = vid.song.title ? sanitizeTitle(vid.song.title) : null;
              let ep = cleanTitle(e)
                .replace(/(.*).((eps|ep) (\w.*\ |)(.*)\))/gm, "$5")
                .replace(/\s/g, "");
              let epdata = vid.animethemeentries[0].episodes;
              let ep2 = epdata && (epdata.constructor !== Array || epdata.length === 1) ? (epdata.constructor !== Array ? epdata.replace(/\s/g, "") : epdata) : null;
              let eps = [];
              if (vid.animethemeentries.length > 1) {
                for (let y = 0; y < vid.animethemeentries.length; y++) {
                  eps.push(vid.animethemeentries[y].episodes);
                }
                eps = eps.join("-").split("-").map(Number);
                eps = eps[0] + "-" + eps[eps.length - 1];
              }
              let artistmatch;
              if (vid.type === "OP" && title) {
                op1 = title;
              }
              if (vid.type === "ED" && title) {
                ed1 = title;
              }
              if (m === 0 && vid.sequence) {
                if (i + 1 === vid.sequence && stringSimilarity(title, vid.song.title) > 0.8) {
                  u = link;
                  m = 1;
                }
                if (i === vid.sequence || i + 1 === vid.sequence || i + 2 === vid.sequence) {
                  if (stringSimilarity(title, title2) > 0.8) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && vid.song.artists !== null && vid.song.artists[0] && vid.song.title !== null) {
                let artist = cleanTitle(e)
                  .replace(/\(([^CV: ].*?)\)+?/g, "")
                  .replace(/(.*)( by )(.*)/g, "$3")
                  .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                  .replace(/["']/g, "")
                  .replace(/\s\[.*\]/gm, "")
                  .trim();
                let artistv2 = artist.replace(/(\w.*)( x )(\w.*)/g, "$1");
                let artist2 = cleanTitle(e)
                  .replace(/(.*)by \w.*\(([^eps ].*?)\)(.*(eps |ep ).*)/g, "$2")
                  .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                  .replace(/["']/g, "")
                  .replace(/\s\[.*\]/gm, "")
                  .trim();
                let artists = [];
                let matches = [];
                let match;
                for (let y = 0; y < vid.song.artists.length; y++) {
                  artists.push(
                    vid.song.artists[y].name
                      .replace(/\((.*?)\).?/g, "")
                      .replace(/(.*)( by )(.*)/g, "$3")
                      .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                      .replace(/["']/g, "")
                      .replace(/\s\[.*\]/gm, "")
                      .trim()
                  );
                }
                artists = artists.join(", ");
                const cv = /\(CV: ([^\)]+)\)/g;
                if (artist.match(cv)) {
                  while ((match = cv.exec(artist)) !== null) {
                    matches.push(match[1]);
                  }
                  matches = matches.join(", ");
                }
                if (
                  m === 0 &&
                  (stringSimilarity(artist, artists) > 0.82 ||
                    stringSimilarity(artist2, artists) > 0.9 ||
                    stringSimilarity(artistv2, artists) > 0.9 ||
                    (matches.length > 0 && stringSimilarity(artists, matches) > 0.82))
                ) {
                  artistmatch = 1;
                  if (stringSimilarity(title, vid.song.title) > 0.8 || (i === vid.sequence && stringSimilarity(title, title2) > 0.8) || (!vid.sequence && stringSimilarity(title, title2) > 0.8)) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && !vid.song.artists.length && vid.song.title !== null) {
                if (stringSimilarity(title, vid.song.title) > 0.8 || (i === vid.sequence && stringSimilarity(title, title2) > 0.8) || (!vid.sequence && stringSimilarity(title, title2) > 0.8)) {
                  u = link;
                  m = 1;
                }
              }
              if (m === 0 && (ep === ep2 || ep === eps)) {
                u = link;
                m = 1;
              }
              if (m === 0 && ((vid.sequence && artistmatch && vid.slug && videos.length < 10) || (!vid.sequence && vid.slug && videos.length < 10))) {
                if (anisongdata && anisongdata.openings.length > 0 && vid.type === "OP") {
                  let n = vid.slug.replace(/(OP)(.*\d)(.*)/g, "$2");
                  if (n === (i + 1).toString() && (!vid.sequence || (artistmatch && i + 1 === vid.sequence))) {
                    u = link;
                    m = 1;
                  }
                }
                if (anisongdata && anisongdata.endings.length > 0 && vid.type === "ED" && ed1 !== undefined && op1 !== undefined && ed1 !== op1) {
                  let n = vid.slug.replace(/(ED)(.*\d)(.*)/g, "$2");
                  if ((!vid.sequence && n === (i + 1).toString()) || (artistmatch && n === (i + 1).toString() && i + 1 === vid.sequence)) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && artistmatch && videos.length === 1) {
                u = link;
                m = 1;
              }
            }
            return {
              title: cleanTitle(e),
              url: u,
            };
          });
        }
        return entries.map((e, i) => {
          return {
            title: cleanTitle(e),
          };
        });
      }
    }

    function insert(songs, parent) {
      if (!songs || !songs.length) {
        let song = create("div", { class: "song" }, "");
        parent.append(song);
      } else {
        songs.forEach((song, i) => {
          song.title = song.title.replace(/(".*")/, "<b>" + "$1" + "</b>");
          const txt = `${i + 1}. ${song.title || song}`;
          const node = create("div", { class: "theme-songs js-theme-songs" }, txt);
          parent.appendChild(node);
          if (song.url) {
            let play = create("div", { class: "oped-preview-button oped-preview-button-gray" });
            node.prepend(play);
            const vid = new VideoElement(node, song.url);
            play.addEventListener("click", () => vid.toggle());
            node.classList.add("has-video");
          }
        });
      }
    }

    function createTargetDiv(text, target, pos) {
      let el = document.createElement("div");
      el.appendChild(document.createElement("h2"));
      el.children[0].innerText = text;
      el.classList = options.class;
      target.insertBefore(el, target.children[pos]);
      return el;
    }

    function cleaner(target) {
      if (!target) return;
      let el = target.querySelectorAll(`.${options.class}`);
      el.forEach((e) => target.removeChild(e));
      $(".rightside.js-scrollfix-bottom-rel div.di-t > .di-tc.va-t:has(h2)").remove();
      set(1, ".rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)", {
        sa: {
          0: "display: grid!important;grid-template-columns: 1fr 1fr;grid-column-gap: 10px;",
        },
      });
      $(".rightside.js-scrollfix-bottom-rel .di-b.ar").remove();
    }

    function placeData(data) {
      let nt = create("div", { class: "theme-songs js-theme-songs" });
      let nt2 = nt.cloneNode(true);
      cleaner(anisongs_temp.target);
      let op = createTargetDiv("Openings", anisongs_temp.target, 0);
      if (data.opening_themes.length === 1) {
        op.children[0].innerText = "Openings";
      }
      if (data.opening_themes.length === 0) {
        op.append(nt);
        nt.innerHTML =
          "No opening themes have been added to this title. Help improve our database by adding an opening theme " +
          "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" +
          anisongs_temp.id +
          "&t=theme'>" +
          "here" +
          "</a>";
      }
      let ed = createTargetDiv("Endings", anisongs_temp.target, 1);
      if (data.ending_themes.length === 1) {
        ed.children[0].innerText = "Endings";
      }
      if (data.ending_themes.length === 0) {
        ed.append(nt2);
        nt2.innerHTML =
          "No ending themes have been added to this title. Help improve our database by adding an ending theme " +
          "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" +
          anisongs_temp.id +
          "&t=theme'>" +
          "here" +
          "</a>";
      }
      insert(data.opening_themes, op);
      insert(data.ending_themes, ed);

      async function addAccordion(div) {
        const aniSongsDiv = document.querySelector(div);
        const themeSongs = aniSongsDiv.querySelectorAll(".theme-songs");
        if (themeSongs.length > 4) {
          const accordionButton = create("a", { class: "anisong-accordion-button", style: { display: "none" } });
          const extraSongs = create("div", { class: "anisong-extra-songs", style: { display: "none" } });
          accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
          for (let i = 4; i < themeSongs.length; i++) {
            extraSongs.appendChild(themeSongs[i]);
          }
          aniSongsDiv.append(extraSongs, accordionButton);
          accordionButton.style.display = "block";
          accordionButton.addEventListener("click", function () {
            if (extraSongs.style.display === "none") {
              extraSongs.style.display = "block";
              accordionButton.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
            } else {
              extraSongs.style.display = "none";
              accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            }
          });
        }
        for (let x = 0; x < themeSongs.length; x++) {
          const favorite = create("div", { class: "fav fa-star" }, "");
          favorite.onclick = async () => {
            if (!$(favorite).parent().find("video").length) {
              $(favorite).parent().find(".oped-preview-button").click();
            }
            const animeTitle = $(".title-name").text()
              ? $(".title-name").text()
              : document.title
                  .replace(/(.*)(\|.*)/, "$1")
                  .replace(/(.*)(\(.*\).*)/, "$1")
                  .trim();
            const title = $(favorite).parent().text().substring(2);
            const type = $(favorite).parent().prev("h2").text();
            const src = $(favorite).parent().find("video").attr("src");
            let img;
            async function imgLoad() {
              img = document.querySelector("div:nth-child(1) > a > img");
              set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" } });
              if (img && img.src) {
                set(0, img, { sa: { 0: "position: relative;opacity:1!important;" } });
              } else {
                await delay(250);
                await imgLoad();
              }
            }
            await imgLoad();
            const favArray = [
              {
                animeTitle: animeTitle,
                animeImage: img.src,
                animeUrl: anisongs_temp.id,
                songTitle: title.replace(/(\(eps \d.*\))/, ""),
                songSource: src,
                themeType: type === "Openings" ? "OP" : "ED",
              },
            ];
            const compressedBase64 = LZString.compressToBase64(JSON.stringify(favArray));
            const base64url = compressedBase64.replace(/\//g, "_");
            editAboutPopup(`favSongEntry/${base64url}`, "favSongEntry");
            $(favorite).parent().find(".oped-preview-button").click();
          };
          if (themeSongs[x].className === "theme-songs js-theme-songs has-video" && headerUserName !== "") {
            themeSongs[x].append(favorite);
          }
        }
      }
      addAccordion("div.di-t > div.anisongs:nth-child(1)");
      addAccordion("div.di-t > div.anisongs:nth-child(2)");
      let aniSongsMainDiv = document.querySelector("div.di-t:has(.anisongs)");
      if (aniSongsMainDiv) {
        let lastCheck = nativeTimeElement(Math.floor(data.time / 1000));
        let AniSongsReCheck = create("i", { class: "fa-solid fa-rotate-right" });
        let AniSongsFooter = create(
          "div",
          { class: "anisongs-footer", style: { textAlign: "right", marginRight: "5px" } },
          translate("$anisongProvider", '<a href="https://animethemes.moe/">AnimeThemes.moe</a><br>') + translate("$anisongLastUpdate") + " " + lastCheck + " "
        );
        AniSongsFooter.append(AniSongsReCheck);
        AniSongsReCheck.onclick = () => {
          songCache.removeItem(anisongs_temp.id);
          window.location.reload();
        };
        aniSongsMainDiv.append(AniSongsFooter);
      }
    }
    async function launch(currentid) {
      // get from cache and check TTL
      const cache = (await songCache.getItem(currentid)) || {
        time: 0,
      };
      if (cache.time + options.cacheTTL < Date.now()) {
        let mal_id = currentid;
        let status;
        let _videos;
        const apiUrl = `https://api.jikan.moe/v4/anime/${currentid}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            status = data.data.status;
          });
        if (mal_id && ["Finished Airing", "Currently Airing"].includes(status)) {
          const { data } = await API.getSongs(mal_id);
          let { openings: opening_themes, endings: ending_themes } = data;
          // add songs to cache if they're not empty and query videos
          if (opening_themes.length || ending_themes.length) {
            if (["Finished Airing", "Currently Airing"].includes(status)) {
              try {
                anisongdata = data;
                _videos = await new Videos(currentid).get();
                opening_themes = Videos.merge(opening_themes, _videos.OP);
                ending_themes = Videos.merge(ending_themes, _videos.ED);
              } catch (e) {
                console.log("Anisongs", e);
              }
            }
            if (_videos) {
              await songCache.setItem(currentid, { opening_themes, ending_themes, time: Date.now() });
            }
          }
          // place the data onto site
          if (await songCache.getItem(currentid)) {
            placeData({
              opening_themes,
              ending_themes,
            });
          }
          return "Downloaded songs";
        } else {
          return "No malid";
        }
      } else {
        // place the data onto site
        placeData(cache);
        return "Used cache";
      }
    }
  }
}

// ==== animeManga_backgroundColorFromCover.js ====
//Anime-Manga Background Color from Cover Image
async function colorFromCover() {
  if (
    !/\d*\/\w*\/episode\/(\d*)\/edit/.test(location.href) &&
    !location.href.endsWith("/episode/new") &&
    !location.href.endsWith("/edit/staff") &&
    !location.href.endsWith("/edit/character") &&
    /myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href) &&
    !document.querySelector("#content > .error404")
  ) {
    let m;
    if (
      /\/(character.php)\/?([\w-]+)?/.test(current) ||
      /\/(people)\/?([\w-]+)?\/?/.test(current) ||
      /\/(anime|manga)\/producer|season|genre|magazine\/.?([\w-]+)?\/?/.test(current) ||
      /\/(anime|manga)\/adapted.?([\w-]+)?\/?/.test(current) ||
      /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(current) ||
      (/\/(character)\/?([\w-]+)?\/?/.test(current) && !svar.charBg) ||
      (/\/(anime|manga)\/?([\w-]+)?\/?/.test(current) && !(svar.animeBg || svar.animeBlurredBg))
    ) {
      m = 1;
    }
    if (!m) {
      if (!defaultMal) {
        document.head.appendChild(styleSheet2);
      }
      const coverLocalForage = localforage.createInstance({ name: "MalJS", storeName: "cover" });
      const colorThief = new ColorThief();
      let img, palette, paletteFetched, listenerAdded, coverCache;
      let colors = [];
      let img2 = new Image();

      async function bgColorFromImage(img) {
        if (!paletteFetched) {
          if (!palette) {
            try {
              img.crossOrigin = "anonymous";
              palette = colorThief.getPalette(img, 10, 5);
              paletteFetched = true;
            } catch (error) {
              img.crossOrigin = "";
              await delay(150);
              return;
            }
          }
        }
        if (paletteFetched) {
          colors = [];
          for (let i = 0; i < palette.length; i++) {
            let color = tinycolor(`rgba(${palette[i][0]}, ${palette[i][1]}, ${palette[i][2]}, 1)`);
            while (color.getLuminance() > 0.08) {
              color = color.darken(1);
            }
            while (color.getLuminance() < 0.04) {
              color = color.brighten(1);
            }
            colors.push(color);
          }
          document.body.style.setProperty("background", `linear-gradient(180deg, ${colors[2]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)`, "important");
        }
      }

      async function waitForCoverImage() {
        if (!coverCache) {
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
        }
        if (svar.customCover && coverCache) {
          img = document.querySelector("img[customCover]");
        } else {
          img = document.querySelector("div:nth-child(1) > a > img");
        }
        if (img && $(img).attr("style") !== "position: fixed;opacity:0!important;") {
          set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" } });
        }
        if (img && img.src && img.width && img.complete) {
          set(0, img, { sa: { 0: "position: relative;opacity:1!important;" } });

          // Blurred Background Image from Cover Image
          if (svar.animeBlurredBg) {
            let blurredBG = create("div", { class: "blurred-background-image" });
            document.body.prepend(blurredBG);
            blurredBG.style.setProperty("background-image", `url(${img.src})`);
            document.body.style.setProperty("background", `0`, "important");
          }

          img2.src = img.src;
          if (!listenerAdded) {
            img.addEventListener("load", function () {
              img2.src = img.src;
            });
            img2.addEventListener("load", function () {
              paletteFetched = false;
              palette = 0;
              if (!svar.animeBlurredBg) bgColorFromImage(img2);
            });
            listenerAdded = 1;
          }
        } else {
          await delay(150);
          await waitForCoverImage();
        }
      }
      addLoading();
      waitForCoverImage();
    }
  }
}

// ==== animeManga_getAiringTime.js ====
async function getAiringTime() {
  if ($(".InformationDiv").length > 0) {
    let informationDiv = defaultMal ? $(".InformationDiv").nextAll() : $(".InformationDiv").next().children();
    let InformationAiring = informationDiv.children('.dark_text:contains("Status")').parent();
    if (InformationAiring.length > 0) {
      InformationAiring = InformationAiring.text()
        .replace(/Status:?\s*/, "")
        .trim();
      if (InformationAiring === "Currently Airing") {
        const AiringData = await aniAPIRequest();
        if (AiringData?.data.Media) {
          const AiringEp = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.episode : "";
          const AiringTime = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.timeUntilAiring : "";
          const AiringInfo =
            AiringEp && AiringTime
              ? ` <div class="spaceit_pad"> <span class="dark_text">${svar.animeInfoDesign ? "Airing" : "Airing: "}</span>
              ${svar.animeInfoDesign ? "<br>" : ""}<a>Ep ${AiringEp}: ${await airingTime(AiringTime)}</a></div>`
              : "";
          if (AiringInfo) {
            informationDiv.first().before(AiringInfo);
          }
        }
      }
    }
  }
}

// ==== animeManga_getBannerImage.js ====
async function getBannerImage() {
  let bannerData;
  const bannerDiv = create("div", { class: "bannerDiv" });
  const bannerImage = create("img", { class: "bannerImage" });
  const bannerShadow = create("div", { class: "bannerShadow" });
  const bannerTarget = document.querySelector("#content");
  const BannerLocalForage = localforage.createInstance({ name: "MalJS", storeName: "banner" });
  const BannerCache = await BannerLocalForage.getItem(entryId + "-" + entryType);
  const leftSide = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
  if (BannerCache) {
    bannerData = BannerCache;
  } else {
    bannerData = await aniAPIRequest();
    if (bannerData?.data.Media && bannerData.data.Media.bannerImage) {
      await BannerLocalForage.setItem(entryId + "-" + entryType, {
        bannerImage: bannerData.data.Media.bannerImage,
      });
      bannerData = await BannerLocalForage.getItem(entryId + "-" + entryType);
    } else {
      bannerData = null;
    }
  }
  if (bannerData && bannerData?.bannerImage && bannerTarget && leftSide) {
    let bgColor = getComputedStyle(document.body);
    bgColor = tinycolor(bgColor.getPropertyValue("--bg"));
    const bannerHover = create("div", { class: "bannerHover" });
    const bannerShadowColor = [bgColor.setAlpha(0.1).toRgbString(), bgColor.setAlpha(0.0).toRgbString(), bgColor.setAlpha(0.6).toRgbString()];
    bannerShadow.style.background = `linear-gradient(180deg,${bannerShadowColor[0]},${bannerShadowColor[1]} 50%,${bannerShadowColor[2]})`;
    leftSide.classList.add("aniLeftSide");
    bannerImage.src = bannerData.bannerImage;
    bannerDiv.append(bannerImage, bannerHover, bannerShadow);
    bannerTarget.prepend(bannerDiv);
    svar.animeHeader = true;
    headerPosChange(1);
    document.querySelector("td.borderClass.aniLeftSide").style.borderWidth = "0";
    if (svar.animeBannerMove) {
      bannerHover.remove();
      leftSide.style.top = "0";
    } else {
      $(bannerHover).on("mouseenter", async function () {
        leftSide.style.top = "0";
      });
      $(bannerHover).on("mouseleave", async function () {
        leftSide.style.top = "-85px";
      });
    }
  }
}

// ==== animeManga_getRelations.js ====
const RELATION_HEIGHT_THRESHOLD = 120;
const relationPriority = {
  ADAPTATION: 0,
  PREQUEL: 1,
  SEQUEL: 2,
  PARENT: 3,
  ALTERNATIVE: 4,
  SIDE_STORY: 5,
  SUMMARY: 6,
  SPIN_OFF: 7,
  CHARACTER: 8,
  OTHER: 9,
};

async function getRelations() {
  const relationTarget = document.querySelector(".related-entries");
  if (!relationTarget) return;

  const relationStorage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
  const cacheTTL = svar.relationTTL;
  let cache = await relationStorage.getItem(`${entryId}-${entryType}`);

  if (!cache || cache.time + cacheTTL < Date.now()) {
    cache = await fetchAndCacheRelations(relationStorage);
  }

  if (!cache?.relations?.length) return;

  renderRelations(relationTarget, cache.relations);
  setupExpandCollapse(relationTarget);
  setupFiltering(relationTarget);
}

async function fetchAndCacheRelations(storage) {
  const apiResult = await aniAPIRequest();
  let relations = apiResult?.data?.Media?.relations?.edges?.filter((r) => r.node.idMal !== null) || [];

  relations.sort((a, b) => relationPriority[a.relationType] - relationPriority[b.relationType]);

  const grouped = relations.reduce((acc, cur) => {
    const type = cur.relationType;
    acc[type] = acc[type] || [];
    acc[type].push(cur);
    return acc;
  }, {});

  for (const type in grouped) {
    grouped[type].sort((a, b) => {
      const yA = a.node.seasonYear ?? a.node.startDate?.year ?? 0;
      const yB = b.node.seasonYear ?? b.node.startDate?.year ?? 0;
      return yA - yB;
    });
  }

  const sortedRelations = Object.values(grouped).flat();
  const cache = { relations: sortedRelations, time: Date.now() };
  await storage.setItem(entryId + "-" + entryType, cache);
  return cache;
}

function renderRelations(container, relations) {
  container.innerHTML = "";

  relations.forEach((relation) => {
    const relationHTML = createRelationHTML(relation);
    container.appendChild(relationHTML);
  });

  container.classList.add("relationsTarget", "spaceit-shadow");
  container.style.padding = "12px 4px";

  const header = document.querySelector("h2");
  if (header && header.textContent.includes("Related Entries")) {
    header.textContent = "Relations";
  }

  setupHoverBehavior();
}

function ensureHoverPortal() {
  if (!document.getElementById("relation-hover-portal")) {
    const hoverPortal = create("div", { id: "relation-hover-portal" });
    document.body.appendChild(hoverPortal);
  }
}

function createRelationHTML(node) {
  const isManga = node.node.type === "MANGA";
  const typePath = isManga ? "manga" : "anime";
  const format = node.node.format === "NOVEL" ? "LIGHT NOVEL" : node.node.format?.replace("_", " ") ?? node.node.type;
  const cover = node.node.coverImage?.large ?? node.node.coverImage?.medium ?? "";
  const borderColor = isManga ? "#92d493" : "#afc7ee";
  const relationType = node.relationType.replace(/_/g, " ");
  const title = node.node.title?.romaji ?? "";
  const year = node.node.startDate?.year ?? node.node.seasonYear ?? "";
  const status = node.node.status?.replace(/_/g, " ") ?? "";

  const div = create("div", { class: "relationEntry" });

  div.innerHTML = `
    <a class='link' href='/${typePath}/${node.node.idMal}/'>
      <img class='relationImg lazyload' src='https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif' data-src='${cover}' alt='${title}' />
      <span class='relationTitle' style='border-color: ${borderColor}!important;'>${relationType}</span>
      <div class='relationDetails' style='color: ${borderColor}!important;'>
        ${relationType}<br>
        <div class='relationDetailsTitle'>${title}</div>
        ${format}${year ? ` · ${year}` : ""}${status ? ` · ${status}` : ""}
      </div>
    </a>`;

  return div;
}

async function setupHoverBehavior() {
  ensureHoverPortal();
  $(".relationEntry").off("mouseenter mouseleave");
  $(".relationEntry").on("mouseenter", async function () {
    const entry = this;
    const details = entry.querySelector(".relationDetails");
    if (!details) return;

    const portal = document.getElementById("relation-hover-portal");
    if (!portal) return;

    portal.innerHTML = "";
    const cloned = details.cloneNode(true);
    cloned.style.display = "block";
    portal.appendChild(cloned);
    positionHoverPortal(entry, portal);
  });

  function positionHoverPortal(entry, portal) {
    const rect = entry.getBoundingClientRect();
    const spacing = 10;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Make the portal temporarily visible
    portal.style.display = "block";
    portal.style.visibility = "hidden";
    portal.style.position = "absolute";
    portal.style.top = "0";
    portal.style.left = "0";
    const contentWidth = portal.firstElementChild?.offsetWidth || 300;
    portal.style.width = `${contentWidth}px`;

    // Double RequestanimationFrame to fit layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const portalWidth = portal.offsetWidth || 300;
        let left = rect.right + scrollX;
        let top = rect.top + scrollY;

        //If it does not fit to the right
        if (left + portalWidth + 10 > window.innerWidth + scrollX) {
          left = rect.left + scrollX - portalWidth;
          portal.firstElementChild?.classList.add("relationEntryRight");
          entry.classList.add("relationEntryRight");
        } else {
          portal.firstElementChild?.classList.remove("relationEntryRight");
          entry.classList.remove("relationEntryRight");
        }

        //Don't go out of the screen
        left = Math.max(spacing, left);
        top = Math.max(spacing, top);

        Object.assign(portal.style, {
          top: `${top}px`,
          left: `${left}px`,
          visibility: "visible",
          zIndex: 9999,
        });
      });
    });
  }

  $(".relationEntry").on("mouseleave", function () {
    $("#relation-hover-portal").hide().empty();
  });
}

function setupExpandCollapse(container) {
  if (container.clientHeight <= RELATION_HEIGHT_THRESHOLD) return;
  if (container.querySelector(".relationWrapper")) return;
  const wrapper = create("div", { class: "relationWrapper" });
  wrapper.setAttribute("style", `max-height: ${RELATION_HEIGHT_THRESHOLD}px; overflow: hidden; transition: max-height 0.4s ease; padding: 5px;`);

  //Move all content into wrapper
  while (container.firstChild) {
    wrapper.appendChild(container.firstChild);
  }
  container.appendChild(wrapper);
  const shouldShowExpand = wrapper.scrollHeight > getTotalHeight(wrapper);
  const expandBtn = create(
    "a",
    { class: "relations-accordion-button", ["expanded"]: "false", style: { display: shouldShowExpand ? "block" : "none" } },
    `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`
  );
  expandBtn.addEventListener("click", () => {
    if (!wrapper.style.transition) {
      wrapper.style.transition = "max-height 0.4s ease";
    }
    const isExpanded = expandBtn.getAttribute("expanded") === "true";
    if (isExpanded) {
      wrapper.style.maxHeight = `${RELATION_HEIGHT_THRESHOLD}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`;
      expandBtn.setAttribute("expanded", "false");
    } else {
      wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-up mr4"></i> ${translate("$showLess")}`;
      expandBtn.setAttribute("expanded", "true");
    }
  });

  container.insertAdjacentElement("afterend", expandBtn);
}

function setupFiltering(container) {
  const relatedDiv = document.querySelector(".RelatedEntriesDiv");
  const floatHeader = relatedDiv.querySelector(".floatRightHeader");
  if (!floatHeader) return;

  const filterDiv = create("div", { class: "relations-filter" });
  const select = create("select", { id: "relationFilter" });
  function normalizeType(str) {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  const allOptions = Object.keys(relationPriority)
    .map((type) => {
      const label = normalizeType(type);

      return `<option value="${type}">${label}</option>`;
    })
    .join("");

  select.innerHTML = `<option value="">All</option>${allOptions}`;
  filterDiv.appendChild(select);
  floatHeader.appendChild(filterDiv);

  const titles = Array.from(container.querySelectorAll(".relationTitle")).map((el) => el.textContent);

  Array.from(select.options).forEach((option) => {
    if (option.value !== "" && !titles.some((title) => normalizeType(title) === normalizeType(option.value))) {
      option.remove();
    }
  });

  select.addEventListener("change", async () => {
    const selected = select.value;
    const entries = container.querySelectorAll(".relationEntry");

    entries.forEach((entry) => {
      const relationTitle = entry.querySelector(".relationTitle")?.textContent ?? "";
      const matches = selected === "" || relationTitle === selected.replace("_", " ");
      entry.style.display = matches ? "block" : "none";
    });

    const wrapper = container.querySelector(".relationWrapper");
    const expandBtn = document.querySelector(".relations-accordion-button");

    if (wrapper && expandBtn) {
      wrapper.style.maxHeight = `${RELATION_HEIGHT_THRESHOLD}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`;
      expandBtn.setAttribute("expanded", "false");
      wrapper.style.transition = "";

      requestAnimationFrame(async () => {
        const shouldShowExpand = wrapper.scrollHeight > getTotalHeight(wrapper);
        expandBtn.style.display = shouldShowExpand ? "block" : "none";
      });
    }
  });
}

// ==== animeManga_getTags.js ====
async function getTags() {
  let tagData;
  const tagDiv = create("div", { class: "aniTagDiv" }, `<h2 style="margin-bottom: 8px;">${translate("$listTags")}</h2>`);
  const tagTarget = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
  const tagLocalForage = localforage.createInstance({ name: "MalJS", storeName: "tags" });
  const tagcacheTTL = svar.tagTTL;
  let tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
  let tagReCheck = create("i", { class: "fa-solid fa-rotate-right", style: { marginLeft: "4px", fontSize: "smaller" }, title: translate("$refreshTags") });
  tagReCheck.onclick = () => {
    tagLocalForage.removeItem(entryId + "-" + entryType);
    window.location.reload();
  };
  if (!tagCache || tagCache.time + tagcacheTTL < Date.now()) {
    tagData = await aniAPIRequest();
    if (tagData?.data.Media?.tags?.length > 0) {
      await tagLocalForage.setItem(entryId + "-" + entryType, {
        tags: tagData.data.Media.tags,
        time: Date.now(),
      });
      tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
    }
  }

  if (tagCache && tagTarget) {
    if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className === "clearfix mauto mt16") {
      tagTarget.lastChild.lastElementChild.remove();
    }
    if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className !== "pb16") {
      tagDiv.style.paddingTop = "16px";
    }

    // Categorized View
    if (svar.categorizeTags) {
      const groupedTags = new Map();
      tagCache.tags.forEach((tag) => {
        const category = tag.category?.trim() || "UNCATEGORIZED";
        if (!groupedTags.has(category)) groupedTags.set(category, []);
        groupedTags.get(category).push(tag);
      });

      const sortedCategories = Array.from(groupedTags.keys()).sort();

      sortedCategories.forEach((category, index) => {
        const tags = groupedTags.get(category);
        const onlySpoilers = tags.every((tag) => tag.isMediaSpoiler);
        const groupClass = onlySpoilers ? "category-group spoiler-group" : "category-group";
        const groupStyle = index === 0 ? 'style="margin-top: -10px;"' : "";
        const categoryKey = category === "UNCATEGORIZED" ? "uncategorized-group" : "";
        let groupHTML = `<div class="${groupClass} ${categoryKey}" ${groupStyle} >`;

        groupHTML += `<h4 class="aniTag-category" ${category === "UNCATEGORIZED" ? 'style="display:none"' : ""}>${category}</h4>`;

        groupHTML += tags
          .map(
            (tag) => `
          <div class="${tag.isMediaSpoiler ? "aniTag spoiler" : "aniTag"}" style="${tag.isMediaSpoiler && !onlySpoilers ? "display:none;" : ""}" data-tooltip="${tag.description || ""}">
            <a><div class="aniTag-name">${tag.name.replace(/'/g, " ")}</div></a>
            <div class="aniTag-percent">(${tag.rank}%)</div>
          </div>
          `
          )
          .join("");

        groupHTML += `</div>`;
        tagDiv.innerHTML += groupHTML;
      });
    }

    // Plain List (Without Category)
    else {
      tagDiv.innerHTML += tagCache.tags
        .map(
          (tag) => `
        <div class="${tag.isMediaSpoiler ? "aniTag spoiler" : "aniTag"}" style="${tag.isMediaSpoiler ? "display:none;" : ""}" data-tooltip="${tag.description || ""}">
          <a>
            <div class="aniTag-name">${tag.name.replace(/'/g, " ")}</div>
          </a>
          <div class="aniTag-percent">(${tag.rank}%)</div>
        </div>
      `
        )
        .join("");
    }

    tagTarget.append(tagDiv);
    tagDiv.querySelector("h2")?.append(tagReCheck);

    // Show/hide spoiler
    if ($(".aniTagDiv .spoiler").length) {
      const showSpoilers = create("div", { class: "showSpoilers" }, translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));

      showSpoilers.onclick = () => {
        let isVisible;

        if (svar.categorizeTags) {
          const spoilerGroups = $(".aniTagDiv .spoiler-group");
          const hiddenSpoilerTags = $(".aniTagDiv .category-group .spoiler");

          isVisible =
            hiddenSpoilerTags.filter(function () {
              return $(this).css("display") !== "none";
            }).length > 0;

          if (isVisible) {
            spoilerGroups.css("display", "none");
            hiddenSpoilerTags.css("display", "none");
            $(showSpoilers).text(translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));
          } else {
            spoilerGroups.css("display", "block");
            hiddenSpoilerTags.css("display", "flex");
            $(showSpoilers).text(translate("$hideSpoilerTags", $(".aniTagDiv .spoiler").length));
          }
        } else {
          const flatSpoilers = $(".aniTagDiv > .spoiler");
          isVisible = flatSpoilers.first().css("display") !== "none";

          if (isVisible) {
            flatSpoilers.css("display", "none");
            $(showSpoilers).text(translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));
          } else {
            flatSpoilers.css("display", "flex");
            $(showSpoilers).text(translate("$hideSpoilerTags", $(".aniTagDiv .spoiler").length));
          }
        }
      };

      tagDiv.append(showSpoilers);
    }
  } else {
    tagDiv.innerHTML = "";
  }
}

// ==== forum_dateFormat.js ====
function changeDate(d) {
  let dateData =
    document.querySelectorAll(".message-header > .date").length > 0 ? document.querySelectorAll(".message-header > .date") : document.querySelectorAll(".content > div.user > div.item.update");
  let lastPost = d ? d : document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4)");
  if (lastPost) {
    for (let x = 0; x < lastPost.length; x++) {
      let t = d ? lastPost[x].innerHTML : $(lastPost[x]).find("br").get(0).nextSibling.nodeValue;
      let t2 = d
        ? t.replace(/\s{2,}/g, " ").replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)(\sby.*)/gm, '<span class ="replyDate">$1 $2</span>$3')
        : t
            .replace(/\s{2,}/g, " ")
            .replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)/gm, '<span class ="replyDate">$1</span>')
            .replace(",", " ");
      lastPost[x].innerHTML = lastPost[x].innerHTML.replace(t, t2);
    }
  }
  let topicDate = Array.prototype.slice
    .call(document.querySelectorAll("#forumTopics tr[data-topic-id] .lightLink"))
    .concat(Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4) span")));
  if (d) {
    topicDate = document.querySelectorAll("span.replyDate");
  }
  dateData = topicDate.length ? topicDate : dateData;
  let date, datenew;
  const timeRegex = /\d{1,2}:\d{2} [APM]{2}/;
  const yearRegex = /\b\d{4}\b/;
  for (let x = 0; x < dateData.length; x++) {
    if (!dateData[x].getAttribute("dated")) {
      date = !timeRegex.test(dateData[x].innerText) ? dateData[x].innerText + ", 00:00 AM" : dateData[x].innerText;
      datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
      date = yearRegex.test(date) ? date : date.replace(/(\,)/, " " + new Date().getFullYear());
      datenew ? (date = dateData[x].innerText) : date;
      let timestamp = new Date(date).getTime();
      const timestampSeconds = dateData[x].getAttribute("data-time") ? dateData[x].getAttribute("data-time") : Math.floor(timestamp / 1000);
      dateData[x].title = dateData[x].innerText;
      dateData[x].innerText = datenew ? date : nativeTimeElement(timestampSeconds);
      dateData[x].setAttribute("dated", 1);
    }
  }
}
if (svar.forumDate && location.href === "https://myanimelist.net/forum/") {
  let replyDate = Array.prototype.slice.call(document.querySelectorAll("span.date.di-ib")).concat(Array.prototype.slice.call(document.querySelectorAll("span.information.di-ib")));
  changeDate(replyDate);
}
if (svar.forumDate && /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
  changeDate();
  if (document.querySelectorAll(".content > div.user > div.item.update").length) {
    let target = document.querySelector(".messages.replies.parents");
    let observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        changeDate();
      }
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }
}

// ==== forum_hideBlocked.js ====
// Forum Hide Blocked Users //--START--//
if (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
  let blockedUsers = [];
  getBlockedUsers();
  async function getBlockedUsers() {
    const html = await fetch("https://myanimelist.net/editprofile.php?go=privacy")
      .then((response) => response.text())
      .then((data) => {
        let newDocument = new DOMParser().parseFromString(data, "text/html");
        let findUser = newDocument.querySelectorAll("#content > div:nth-child(2) a[href*=profile]");
        for (let x = 0; x < findUser.length; x++) {
          blockedUsers.push(findUser[x].innerText);
        }
        removeBlockedUsers();
      });
  }
  function removeBlockedUsers() {
    //Remove Blocked User's Forum Topics
    let ForumTopic = document.querySelectorAll("#forumTopics tr[data-topic-id]");
    for (let x = 0; x < ForumTopic.length; x++) {
      for (let y = 0; y < blockedUsers.length; y++) {
        if (ForumTopic[x].children[1].children[4].innerText === blockedUsers[y]) {
          ForumTopic[x].remove();
        }
      }
    }
    //Remove Blocked User's Forum Reply
    let forumReply = document.querySelectorAll(".message-wrapper > div.profile");
    for (let x = 0; x < forumReply.length; x++) {
      for (let y = 0; y < blockedUsers.length; y++) {
        if (forumReply[x].children[0].innerText === blockedUsers[y]) {
          forumReply[x].parentElement.parentElement.remove();
        }
      }
    }
    //Remove Blocked User's Forum Reply (Conversation View)
    let forumReplyV = document.querySelectorAll(".messages.replies.parents .message");
    for (let x = 0; x < forumReplyV.length; x++) {
      if (!forumReplyV[x].getAttribute("checked")) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (forumReplyV[x].children[0].children[1].children[0].children[0].innerText === blockedUsers[y]) {
            forumReplyV[x].remove();
          }
        }
        forumReplyV[x].setAttribute("checked", 1);
      }
    }
  }
  //Conversation View - If new forum reply loaded, check blockedUsers
  if (document.querySelectorAll(" .content > div.user > div.item.update").length) {
    let target = document.querySelector(".messages.replies.parents");
    let observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        removeBlockedUsers();
      }
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }
}

// ==== general_autoHeader.js ====
//Auto Hide/Show Header
function autoHeader() {
  if (svar.headerSlide || svar.headerOpacity) {
    let lastScrollTop = 0;
    const header = document.querySelector("#headerSmall");
    const menu = document.querySelector("#menu");
    let seasonalNav;
    if (header && menu) {
      // Set initial position
      header.style.top = "0";
      menu.style.transition = "top 0.3s ease-in-out";
      header.style.transition = "top 0.3s ease-in-out, background 0.3s ease-in-out";

      window.addEventListener("scroll", () => {
        //Seasonal Anime Nav Fix
        if (/\/(anime)\/(season).?([\w]+)?\/?/.test(location.pathname)) {
          if (!seasonalNav) {
            seasonalNav = document.querySelector("#content > div.navi-seasonal.js-navi-seasonal.fixed");
          }
          if (seasonalNav && !seasonalNav.style.transition) {
            seasonalNav.style.transition = "top 0.3s ease-in-out";
          }
        }
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (/\/(profile)\/.?([\w]+)?\/?/.test(location.pathname) && document.querySelector("#banner") && document.querySelector("#banner").style.background !== "" && svar.headerOpacity) {
          if (scrollTop === 0) {
            header.style.backgroundColor = "var(--fgo)!important";
          } else if (header.style.backgroundColor !== "") {
            header.style.backgroundColor = "";
          }
        }
        if (svar.headerSlide) {
          if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.top = "-50px";
            menu.style.top = "-50px";
            if (seasonalNav) {
              seasonalNav.style.top = "-50px";
            }
          } else {
            // Scrolling up
            header.style.top = "0";
            menu.style.top = "7px";
            if (seasonalNav) {
              seasonalNav.style.top = "0";
            }
          }
        }
        lastScrollTop = scrollTop;
      });
    }
  }
}
autoHeader();

// ==== general_embed.js ====
// Forum Embed
if (svar.embedForum && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
  createEmbed([".message-wrapper > div.content", ".forum.thread .message"]);
}

// News Embed
if (svar.embedNews && /\/(news)\/.?([\w-]+)?\/?/.test(location.href)) {
  createEmbed([".news-container", ".news-related-database"]);
}

// ==== general_headerPositionChange.js ====
//People and Character Name Position Change
if ((pageIsPeople && svar.peopleHeader) || (pageIsCharacter && svar.characterHeader)) {
  let name = document.querySelector(".h1.edit-info");
  name.getElementsByTagName("strong")[0].style.fontSize = "1.3rem";
  name.setAttribute("style", "padding-left:5px;padding-top:10px;height:20px");
  document.querySelector("#content").style.paddingTop = "20px";
  let table = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  table.prepend(name);
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && !/\/(clubs)/.test(current) && !/\/(pics)/.test(current) && svar.characterHeader) {
    if (!svar.characterNameAlt) {
      name.setAttribute("style", "line-height:25px");
    }
    let extra = document.querySelector("#content > table > tbody > tr > td.characterDiv > h2 > span > small");
    if (extra) {
      extra.innerText = " " + extra.innerText;
    }
    if (svar.characterNameAlt) {
      if (extra) {
        document.querySelector(".h1.edit-info > div.h1-title > h1").append(extra);
        extra.style.lineHeight = "20px";
        if (name.children[0].children[0].children[0].innerText.match(/".*"/gm)) {
          const sanitizedContent = DOMPurify.sanitize(name.children[0].children[0].children[0].innerText.match(/".*"/gm).join("<br>"));
          extra.innerHTML = extra.innerHTML + "<br>" + sanitizedContent;
          name.children[0].children[0].children[0].innerText = name.children[0].children[0].children[0].innerText.replace(/".*"/gm, "");
        } else {
          extra.innerHTML = "<br>" + extra.innerHTML;
        }
      }
    }
    document.querySelector("#content > table > tbody > tr > td.characterDiv > h2").remove();
  }
}

//Anime and Manga Header Position Change
function headerPosChange(v) {
  if ((svar.animeHeader || v) && pageIsAniManga) {
    set(1, ".h1.edit-info", { sa: { 0: "margin:0;width:97.5%" } });
    set(1, "#content > table > tbody > tr > td:nth-child(2) > .js-scrollfix-bottom-rel", { pp: { 0: ".h1.edit-info" } });
    const titleOldDiv = document.querySelector("#contentWrapper > div:nth-child(1)");
    if (titleOldDiv && titleOldDiv.innerHTML === "") {
      titleOldDiv.remove();
    }
  }
}
headerPosChange();

// ==== general_livePreview.js ====
let previewStatus = 0; // 0 = initialized, 1 = DOM has been created, 2 = fetched

function createPreviewElements(parent) {
  const container = create("div", {
    class: "preview-result-container",
    id: "preview-result-container",
  });

  const header = create("div", {
    class: "normal_header",
    id: "preview-result-header",
    style: "display: flex; align-items: center; justify-content: space-between;",
  });

  const headerTitle = create("span", {}, "Preview");

  const charCount = create("span", {
    id: "live-preview-charcount",
    style: "font-size: 12px;color: var(--color-main-text-light);margin-left: auto;font-weight: 400;",
  });

  header.append(headerTitle, charCount);

  const content = create("div", {
    class: "mal-tab-item preview active",
    id: "preview-result",
  });

  container.append(header, content);
  parent.append(container);
}

async function fetchPreviewHTML(text, csrfToken) {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("csrf_token", csrfToken);

  const response = await fetch("https://myanimelist.net/bbcode/preview", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  return data.html;
}

async function showPreview(selector, parentSelector) {
  const textarea = document.querySelector(selector);
  if (!textarea) return;

  const text = textarea.value.trim();
  if (text.length === 0 || previewStatus < 1) return;

  const parent = await waitForElement(parentSelector);
  if (!parent) return;

  //First execution, create the preview box.
  if (previewStatus === 0) {
    createPreviewElements(parent);
    previewStatus = 1;
  }

  if (previewStatus >= 1) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]')?.content;
    if (!csrfToken) return;

    try {
      const html = await fetchPreviewHTML(text, csrfToken);
      const previewDiv = document.getElementById("preview-result");
      if (previewDiv) {
        previewDiv.innerHTML = html;
        previewStatus = 2;
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    } finally {
      document.getElementById("live-preview-spinner")?.remove();
    }
  }
}

// Add Live Preview
if (svar.editorLivePreview) {
  $(document).ready(function () {
    addLivePreview();
    if (pageIsForum) {
      const forumBtn = document.querySelectorAll("button[rel*='topic']");
      forumBtn.forEach((element) => {
        element.addEventListener("click", async function () {
          addLivePreview();
        });
      });
    }
  });
}

function addLivePreview() {
  waitForElement(".sceditor-container textarea").then((textarea) => {
    if (!textarea) return;

    //When an external value is given, the input should be triggered.
    const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
    if (descriptor?.configurable) {
      Object.defineProperty(textarea, "value", {
        configurable: true,
        enumerable: true,
        get() {
          return descriptor.get.call(this);
        },
        set(val) {
          descriptor.set.call(this, val);
          this.dispatchEvent(new Event("input", { bubbles: true }));
        },
      });
    }

    //Text Character Count
    function stripVisibleTextFromBBCode(bbcodeText) {
      const hiddenTags = ["img", "yt", "video", "code", "spoiler"];
      hiddenTags.forEach((tag) => {
        const pattern = new RegExp(`\\[${tag}.*?\\](.*?)\\[\\/${tag}\\]`, "gis");
        bbcodeText = bbcodeText.replace(pattern, "");
      });
      bbcodeText = bbcodeText.replace(/\[.*?\]/g, "");
      return bbcodeText.trim();
    }

    textarea.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      const header = document.getElementById("preview-result-header");
      const charCount = document.getElementById("live-preview-charcount");
      const container = document.getElementById("preview-result-container");

      // Update the character count
      if (charCount) {
        const fullLength = textarea.value.length;
        const visibleLength = stripVisibleTextFromBBCode(textarea.value).trim().length;
        const label = visibleLength === 1 ? "character" : "characters";
        const labelFull = fullLength === 1 ? "character" : "characters";
        charCount.textContent = `(${fullLength}  ${labelFull})`;
        charCount.title = `Text: ${visibleLength} ${label} / Full: ${fullLength} ${labelFull}`;
      }

      //Should the preview be deleted?
      if (value.length === 0 && previewStatus > 0) {
        container?.remove();
        previewStatus = 0;
        return;
      }

      // Loading spinner
      if (header && !document.getElementById("live-preview-spinner")) {
        const spinner = create("i", {
          class: "fa fa-circle-o-notch fa-spin malCleanSpinner",
          id: "live-preview-spinner",
        });
        header.appendChild(spinner);
      }

      const parentSelector = ".sceditor-outer";

      if (previewStatus === 0) {
        // Create the box
        waitForElement(parentSelector).then((parent) => {
          if (parent) {
            createPreviewElements(parent);
            previewStatus = 1;
          }
        });
      }

      // Wait and update the preview.
      clearTimeout(textarea._previewTimeout);
      textarea._previewTimeout = setTimeout(() => {
        showPreview(".sceditor-container textarea", parentSelector);
      }, 2000);
    });
  });
}

// ==== general_malFixes.js ====
function pageFixes(page) {
  if (page === "anime-manga") {
    let text = create("div", {
      class: "description",
      itemprop: "description",
      style: {
        display: "block",
        fontSize: "11px",
        fontWeight: "500",
        marginTop: "5px",
        whiteSpace: "pre-wrap",
        border: "var(--border) solid var(--border-color)",
      },
    });
    const sections = [
      "Information",
      "Alternative Titles",
      "Statistics",
      "Summary Stats",
      "Score Stats",
      "More Info",
      "Resources",
      "Streaming Platforms",
      "Available At",
      "Background",
      "Synopsis",
      "Episode Videos",
      "Related Anime",
      "Related Manga",
      "Related Entries",
      "Characters",
      "Staff",
      "Reviews",
      "Recommendations",
      "Interest Stacks",
      "Recent News",
      "Recent Featured Articles",
      "Recent Forum Discussion",
      "MALxJapan -More than just anime-",
    ];
    sections.forEach((section) => aniMangaAddClass(section));

    if ($(".AlternativeTitlesDiv").length) {
      if ($("a.js-anime-toggle-alternative-title-button").length > 0 || $("a.js-manga-toggle-alternative-title-button").length > 0) {
        $(".AlternativeTitlesDiv").nextUntil("a").addClass("spaceit-shadow-end").addClass("mb8");
      } else {
        $(".AlternativeTitlesDiv").nextUntil("br").addClass("spaceit-shadow-end");
      }
      document.querySelector(".AlternativeTitlesDiv").nextElementSibling.setAttribute("style", "margin-bottom:4px");
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: "var(--br)",
      });
    }
    if (document.querySelector(".js-alternative-titles.hide")) {
      document.querySelector(".js-alternative-titles.hide").setAttribute("style", "border-radius:var(--br);overflow:hidden");
    }
    if ($(".InformationDiv").length && !defaultMal) {
      $(".InformationDiv").nextUntil("br").not("h2").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    }
    if ($(".StatisticsDiv").length && !defaultMal) {
      $(".StatisticsDiv").nextUntil("br").not("h2").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $(".statistics-info").css("opacity", "0");
      $(".spaceit_pad.po-r.js-statistics-info.di-ib sup").css("opacity", "0");
    }
    if ($(".ResourcesDiv").length) {
      $(".ResourcesDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".ResourcesDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
      document.querySelector(".ResourcesDiv").nextElementSibling.style.borderRadius = "var(--br)";
    }
    if ($(".StreamingPlatformsDiv").length) {
      $(".StreamingPlatformsDiv").next(".pb16.broadcasts").attr("style", "padding-bottom: 12px!important");
      $(".StreamingPlatformsDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".StreamingPlatformsDiv").nextElementSibling.style.borderRadius = "var(--br)";
    }
    if ($(".AvailableAtDiv").length) {
      $(".AvailableAtDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".AvailableAtDiv").nextElementSibling.style.borderRadius = "var(--br)";
      document.querySelector(".AvailableAtDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
    }
    if ($(".SummaryStatsDiv").length) {
      const statsDiv = create("div", { class: "statsDiv spaceit-shadow-end" });
      const statElements = $(".SummaryStatsDiv").nextUntil("br");
      $(".SummaryStatsDiv").after(statsDiv);
      statsDiv.setAttribute(
        "style",
        "border-radius:var(--br);overflow:hidden;display: -ms-grid;display: grid;-ms-grid-columns: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;border:var(--border) solid var(--border-color)"
      );
      $(statsDiv).append(statElements);
    }
    if ($(".score-stats").length) {
      $(".score-stats").addClass("spaceit-shadow-end");
    }
    if ($(".table-recently-updated").length) {
      $(".table-recently-updated").addClass("spaceit-shadow-end");
    }

    handleEmptyInfo(".SynopsisDiv", "No synopsis information has been added to this title.");
    handleEmptyInfo(".CharactersDiv", "No characters or voice");
    handleEmptyInfo(".CharactersDiv", "No characters for this manga");
    handleEmptyInfo(".RecommendationsDiv", "No recommendations have been made");
    handleEmptyInfo(".StaffDiv", "No staff for this");
    handleEmptyInfo(".MoreInfoDiv", "", 1);

    if ($(".RecentNewsDiv").length && !$(".RecentNewsDiv").next().is("div")) {
      $(".RecentNewsDiv").remove();
    }
    if ($('.page-forum:contains("No discussion topic was found.")')[0]) {
      $('.page-forum:contains("No discussion topic was found.")')[0].remove();
      $(".RecentForumDiscussionDiv").remove();
    }
    if (svar.editPopup && $('#addtolist a:contains("Edit Details")').length) {
      let editDetails = $('#addtolist a:contains("Edit Details")')[0];
      editDetails.className = "fa fa-pen";
      editDetails.style.fontFamily = "fontAwesome";
      editDetails.style.padding = "5px";
      editDetails.innerText = "";
      editDetails.href = "javascript:void(0);";
      editDetails.onclick = async () => {
        await editPopup(entryId, entryType);
      };
    }

    // Change the design of the Information on the left side.
    if (svar.animeInfoDesign) {
      let informationDiv = defaultMal ? $(".InformationDiv").nextAll().children(".dark_text") : $(".InformationDiv").next().children().children(".dark_text");
      informationDiv.each(function () {
        let currentText = $(this).text();
        $(this).text(currentText.slice(0, -1));
      });
      informationDiv.after("<br>");
    }

    //Remove the "to ?" in the Aired in Information section on the left side
    if ($(".InformationDiv").length > 0) {
      let InformationAired = defaultMal ? $(".InformationDiv").nextAll().children('.dark_text:contains("Aired")') : $(".InformationDiv").next().children().children('.dark_text:contains("Aired")');
      if (InformationAired.length > 0) {
        InformationAired = InformationAired.parent()[0].childNodes[3] ? InformationAired.parent()[0].childNodes[3] : InformationAired.parent()[0].childNodes[2];
        InformationAired.nodeValue = InformationAired.nodeValue.replace("to ?", "");
      }
    }

    let rightSide = document.querySelector("#content > table > tbody > tr > td:nth-child(2)[valign='top'] tr > td[valign='top']");
    if (rightSide) {
      for (let x = 0; x < 1; x++) {
        rightSide.childNodes.forEach(function (el, i) {
          if (
            i >= 4 &&
            el.class !== "SynopsisDiv" &&
            el.innerText !== "Related Manga" &&
            el.innerText !== "More Videos\nEpisode Videos" &&
            el.innerText !== "Episode Videos" &&
            el.id !== "episode_video" &&
            el.id !== "CallFunctionFormatMoreInfoText"
          ) {
            text.innerHTML += el.textContent;
          }
        });
        for (let x = 0; x < 10; x++) {
          rightSide.childNodes.forEach(function (el, i) {
            {
              if (
                i >= 4 &&
                el.class !== "SynopsisDiv" &&
                el.innerText !== "Related Manga" &&
                el.innerText !== "More Videos\nEpisode Videos" &&
                el.innerText !== "Episode Videos" &&
                el.id !== "episode_video" &&
                el.id !== "CallFunctionFormatMoreInfoText"
              ) {
                el.remove();
              }
            }
          });
        }
      }
    }
    let textfix = text.innerHTML.replace(/<br>.*\s/gm, "").replace(/\n\s{3,10}/g, "");
    if (textfix.includes("No background")) {
      textfix = textfix.replace(/(information here.+)/gm, 'information <a href="/dbchanges.php?aid=' + entryId + '&amp;t=background">here</a>.');
    }
    text.innerHTML = textfix;
    let backgroundInfo = $('h2:contains("Background"):last');
    backgroundInfo.append(text);
    if ($(".SynopsisDiv").next("span").length) {
      $(".SynopsisDiv")
        .next("span")
        .html(
          $(".SynopsisDiv")
            .next("span")
            .html()
            .replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, "")
        );
    }
    if ($(".SynopsisDiv").next("p").length) {
      $(".SynopsisDiv")
        .next("p")
        .html(
          $(".SynopsisDiv")
            .next("p")
            .html()
            .replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, "")
        );
    }
  }
  if (page === "character") {
    let regex = /(Member Favorites).*/g;
    let fav = document.querySelector("#content > table > tbody > tr > td.borderClass");
    let match = create("p", { id: "memberTotalFavs" }, fav.innerText.match(regex));
    fav.innerHTML = fav.innerHTML.replace(regex, "");
    if (match) {
      document.querySelector("#v-favorite").insertAdjacentElement("beforebegin", match);
    }
    if (!/\/(clubs)/.test(current) || !/\/(pics)/.test(current)) {
      $('div:contains("Voice Actors"):last')
        .addClass("VoiceActorsDiv")
        .html(function (_, html) {
          return html.replace("Voice Actors", "");
        })
        .before('<h2 class="VoiceActorsHeader"style="margin-bottom: -10px;margin-top: 10px;">Voice Actors</h2>');

      while ($(".VoiceActorsDiv").next("table").length > 0) {
        $(".VoiceActorsDiv").append(
          $(".VoiceActorsDiv").next("table").addClass("VoiceActorsDivTable").css({
            backgroundColor: "var(--color-foreground)",
            borderRadius: "var(--br)",
            marginTop: "8px",
            border: "var(--border) solid var(--border-color)",
          })
        );
        $(".VoiceActorsDivTable").children().children().children().children(".picSurround").children().children().css({
          width: "52px",
          height: "80px",
          objectFit: "cover",
        });
        $(".VoiceActorsDivTable").children().children().children().css({
          border: "0",
        });
      }
      $(".VoiceActorsDiv").css({
        display: "grid",
        MsGridColumns: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "0px 6px",
      });
      $('h2:contains("Recent Featured Articles"):last').addClass("RecentFeaturedArticlesDiv").append($(".RecentFeaturedArticlesDiv").next());
      $(".RecentFeaturedArticlesDiv").css({
        marginTop: "10px",
      });
      $(".RecentFeaturedArticlesDiv").children("div:last-child").css({
        marginTop: "8px",
      });
      $(".RecentFeaturedArticlesDiv").children().children().css("width", "99%").children().css("borderRadius", "var(--br)");
      let rightSide = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
      $(rightSide).addClass("characterDiv");
      let text = create("div", {
        class: "description",
        itemprop: "description",
        style: {
          display: "block",
          fontSize: "11px",
          fontWeight: "500",
          marginTop: "5px",
          whiteSpace: "pre-wrap",
          border: "var(--border) solid var(--border-color)",
        },
      });

      text.innerHTML = getTextUntil(".VoiceActorsHeader");
      rightSide.appendChild(text);

      //Remove spaces and add text at the top
      let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, "");
      text.innerHTML = fixtext;

      document.querySelector(".breadcrumb").after(text);

      //Cleanup
      $.trim($(".characterDiv").contents().not($(".description")).not($(".VoiceActorsDiv")).not($("#horiznav_nav")).not($(".breadcrumb")).not($("h2")).not($("table")).remove());
      $(".description").children().not($("li")).not($("input")).not($("span.spoiler_content")).remove();
      if ($(".description") && $(".description").text().length === 0) {
        $(".description").remove();
      }

      //Fix Spoilers
      let spofix = document.querySelectorAll(".spoiler_content > input");
      $(".spoiler_content").css({
        background: "var(--color-foreground4)",
        borderRadius: "var(--br)",
        padding: "0px 5px 5px",
        margin: "5px 0px",
      });
      for (let x = 0; x < spofix.length; x++) {
        spofix[x].setAttribute("onclick", "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
      }
      if ($(".VoiceActorsHeader").next().html() === "") {
        $(".VoiceActorsHeader").remove();
      }
    }
  }
}

//Companies add border and shadow
if (/\/(anime|manga)\/producer\/\d.?([\w-]+)?\/?/.test(current)) {
  let studioDivShadow = $('.mb16:contains("Member"):last');
  if ($(studioDivShadow).length && $(studioDivShadow).children().css("flex") !== "1 1 0%") {
    $(studioDivShadow).children().attr("style", "background:0!important").wrapAll("<div class='spaceit-shadow-end-div'></div>");
  }
}

//People fix details and add shadow
if (/\/(people)\/.?([\w-]+)?\/?/.test(current)) {
  peopleDetailsAddDiv("Family name:");
  peopleDetailsAddDiv("Website:");
  let peopleDivShadow = document.querySelector("#content > table > tbody > tr > td.borderClass  .spaceit_pad");
  if (peopleDivShadow) {
    $(peopleDivShadow).attr("style", "background:0!important");
    $(peopleDivShadow).nextUntil("div:not(.spaceit_pad)").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    $('div:contains("Website:"):last').html() === 'Website: <a href="http://"></a>' ? $('div:contains("Website:"):last').remove() : null;
    $('div:contains("Family name:"):last').html() === "Family name: " ? $('div:contains("Family name:"):last').remove() : null;
    $('span:contains("More:"):last').css({ display: "block", padding: "2px", marginTop: "5px" });
  }
}

//Clubs Page Fixes
//Clubs Page add class to Divs
if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
  $("div.normal_header:contains('Club Members')").next("table").addClass("club-container");
  $("div.bgNone").addClass("club-container");
  $("div.bgColor1").addClass("club-container");
  $('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass("club-container");
  $("#content > table > tbody > tr > td[valign=top]:last-child").addClass("club-container");
  set(2, ".club-container", { sal: { 0: "border-radius:var(--br);overflow:hidden" } });
}

//Club Comments Expand
if (svar.clubComments) {
  if (location.search.includes("cid") && location.pathname === "/clubs.php") {
    document.querySelector("#content > table > tbody > tr").style.display = "inline-block";
    const commHeader = $(".normal_header:contains('Club Comments')");
    const commDiv = $(".normal_header:contains('Club Comments')").next();
    commDiv.css("width", "100%");
    $("#content > table > tbody").append(commHeader, commDiv);
  }
}

//Blog Page Fixes
if (current === "/blog.php" && !location.search && svar.blogContent) {
  getBlogContent();
}

if (/\/(blog)\//.test(current) || /\?eid=/.test(location.search)) {
  if (svar.blogRedesign) {
    //wrap header with a class and add href
    $(".lightLink:not(.lightLink.to-left)").each(function () {
      let headerHref;
      if ($(this).nextAll(".borderClass").children().first().children().eq(1).attr("href")) {
        headerHref = $(this).nextAll(".borderClass").children().first().children().eq(1).attr("href").replace("#comment", "");
      }
      $(this).wrap(function () {
        let hrefAttribute = !/\?eid=/.test(location.search) && headerHref ? `href="${headerHref}"` : "";
        return `<a ${hrefAttribute} class="maljsBlogDivHeader"></a>`;
      });
    });
    $("span.lightLink.to-left").css({ position: "absolute", margin: "-30px 0 0 10px" });
    $(".borderClass").css({ border: "0" });

    //wrap blog Div
    $('.normal_header:not(:contains("Categories"))').each(function () {
      $(this).nextUntil(".borderClass").last("div").addClass("maljsBlogDivContent");
      $(this).nextUntil(".borderClass").wrapAll('<div class="maljsBlogDiv"></div>');
    });

    $(".maljsBlogDivHeader:not(.maljsBlogDiv .maljsBlogDivHeader)").each(function () {
      $(this).nextUntil(".borderClass").last("div").addClass("maljsBlogDivContent");
      $(this).nextUntil(".borderClass").addBack().addBack().wrapAll('<div class="maljsBlogDiv"></div>');
    });

    //wrap relations div
    $('.maljsBlogDiv div:contains("Relations:")').wrap('<div class="maljsBlogDivRelations"></div>');
  }
}

//blog fix for anisongs
if ((/\/(blog.php)/.test(current) || /\/(blog)\//.test(current)) && !/\?eid=/.test(location.search)) {
  $('#content div > div:contains("Relations:") > a')
    .not(".maljsBlogDivHeader")
    .not(".maljsBlogDivContent")
    .each(function () {
      let href = $(this).attr("href");
      if (href && !href.endsWith("/")) {
        $(this).attr("href", href + "/");
      }
    });
} else if (/\/(blog.php)/.test(current) && /\?eid=/.test(location.search)) {
  $('#content div:contains("Relations:") > a')
    .not(".maljsBlogDivHeader")
    .not(".maljsBlogDivContent")
    .each(function () {
      let href = $(this).attr("href");
      if (href && !href.endsWith("/")) {
        $(this).attr("href", href + "/");
      }
    });
}

//Add BBCode Editor
if (
  location.href === "https://myanimelist.net/myblog.php" ||
  (location.href.includes("myblog.php") && location.search.includes("go=edit")) ||
  (location.href.includes("blog.php") && location.search.includes("eid"))
) {
  let blogTextArea = document.querySelectorAll("textarea")[0];
  if (blogTextArea) {
    blogTextArea.classList.add("bbcode-message-editor");
  }
}

if ((location.search.includes("cid") && location.pathname === "/clubs.php") || (location.pathname === "/editclub.php" && location.search.includes("&action=details"))) {
  let clubTextArea = document.querySelectorAll("textarea")[0];
  if (clubTextArea) {
    clubTextArea.classList.add("bbcode-message-editor");
  }
}
if (location.href === "https://myanimelist.net/editprofile.php" && !location.search) {
  let profileTextArea = document.querySelectorAll("textarea")[1];
  if (profileTextArea) {
    profileTextArea.classList.add("bbcode-message-editor");
  }
}
if (location.href === "https://myanimelist.net/editprofile.php?go=signature") {
  let profileTextArea = document.querySelectorAll("textarea")[0];
  if (profileTextArea) {
    profileTextArea.classList.add("bbcode-message-editor");
  }
}
// Modern Profile - Mal Badges Fixes
if (/mal-badges\.com\/(user).*malbadges/.test(location.href)) {
  $('#content  div[data-page-id="main"] .userv2-detail').css("background", "#fff0");
  $("#content  .mr-auto").css("background", "#fff0");
  $("body").css("background-color", "#fff0");
  $("#content").css("background", "#fff0");
  $(".user_badge img").css("max-width", "initial");

  // Detailed Badge
  if (location.href.endsWith("?detail&malbadges")) {
    $(".userv2-stats").css({ "font-size": "15px", gap: "8px", "padding-right": "12px" });
    $(".value-display.value-display--plain .count").css("font-size", "45px");
  } else {
    $(".userv2-stats").remove();
    $(".value-display.value-display--plain .count").css("font-size", "55px");
    $(".userv2-detail__stats").css("grid-template-columns", "1fr 1fr 1fr");
    let statsDivs = $(".userv2-detail__stats .value-display");
    statsDivs.eq(-2).before(statsDivs.eq(-1));
    $(".userv2-detail-bar .value-display__label, .userv2-detail-bar .value-display__value").css("font-size", "16px");
    $(".userv2-detail-bar .count").css("font-size", "20px");
    $(".userv2-detail-bar .value-display.value-display--rank").last().find(".value-display__label").text("Comp Rank");
    $(".userv2-detail-bar .value-display__value").css("font-size", "13px");
    const xpLen = $(".userv2-detail__stats .count").last().attr("data-number")?.length;
    if (xpLen > 4) {
      $(".userv2-detail__stats .count").css("font-size", "55px");
    }
    if (xpLen > 5) {
      $(".userv2-detail__stats .count").css("font-size", "50px");
    }
  }
}
// News and Forum - Load iframe only when the spoiler button is clicked
if (/\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href) || /\/(news)\/\d/.test(location.href)) {
  const spoilers = document.querySelectorAll(".spoiler:has(.movie)");
  spoilers.forEach((spoiler) => {
    const showButton = spoiler.querySelector(".show_button");
    const hideButton = spoiler.querySelector(".hide_button");
    const iframe = spoiler.querySelector("iframe");
    showButton.setAttribute("data-src", iframe.src);
    iframe.src = "";
    $(iframe).contents().find("body").attr("style", "background:0!important");
    showButton.setAttribute(
      "onclick",
      showButton.getAttribute("onclick") +
        'this.nextElementSibling.querySelector("iframe.movie").setAttribute("src",this.getAttribute("data-src"));' +
        'this.nextElementSibling.querySelector("iframe.movie").contentWindow.document.body.setAttribute("style","background:0!important");'
    );
    hideButton.setAttribute("onclick", hideButton.getAttribute("onclick") + 'this.parentElement.querySelector("iframe.movie").removeAttribute("src")');
  });
}

// Genre List Design Fix
if (location.href === "https://myanimelist.net/anime.php" || location.href === "https://myanimelist.net/manga.php") {
  document.querySelectorAll(".genre-link").forEach((genreLink) => {
    const genreCol = genreLink.querySelector(".genre-list-col");
    if (genreCol) {
      genreCol.setAttribute("style", "display: -webkit-inline-box;display: -webkit-inline-flex;display: inline-flex;-webkit-flex-wrap: wrap;flex-wrap: wrap;");
      genreLink.querySelectorAll(".genre-list.al").forEach((genre) => {
        genreCol.appendChild(genre);
      });
    }
  });
  $(".genre-list-col:empty").remove();
}

// Footer Block Fix
$("#footer-block").css("max-width", "100%");

// ==== general_onLoad.js ====
async function on_load() {
  //Change anime.php and manga.php URLs.
  function replacePHPUrls() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    if (url.pathname === "/anime.php" || url.pathname === "/manga.php") {
      const id = url.searchParams.get("id");
      if (id) {
        const type = url.pathname.includes("anime") ? "anime" : "manga";
        const newUrl = `${url.origin}/${type}/${id}/`;

        if (currentUrl !== newUrl) {
          window.location.replace(newUrl);
        }
      }
    }
  }
  replacePHPUrls();

  //Add MalClean Settings to header dropdown
  let pfHeader = $('li:contains("Account Settings")')[0];
  if (!pfHeader) {
    pfHeader = document.querySelector(".header-profile-dropdown > ul > li:nth-last-child(3)");
  }
  if (pfHeader) {
    let gear = pfHeader.querySelector("a > i");
    let gearClone = gear.cloneNode(!0);
    stLink.prepend(gearClone);
    stButton.append(stLink);
    pfHeader.insertAdjacentElement("afterend", stButton);
  }

  if (svar.customCover) {
    await loadCustomCover();
  }
  if ((svar.customCharacterCover && (/\/(profile)\/.?([\w]+)?\/?/.test(current) || $(".detail-characters-list").length)) || current.endsWith("/characters") || current.endsWith("/character.php")) {
    await loadCustomCover(1, "character");
  }

  if ($("#loadingDiv").length) {
    addLoading("remove");
  }
}
if (document.readyState === "complete") {
  on_load();
} else {
  window.addEventListener("load", on_load);
}

// ==== panel_currentlyWatchRead.js ====
//Currently Watching
let incCount = 0;
let incTimer;
let incActive = 0;
let lastClickTime = 0;
const debounceDelay = 400;
const collapsedHeight = svar.currentlyGrid6Column ? 315 : 370;

function htmlTemplate(type) {
  const typeText = type === "anime" ? "watching" : "reading";
  const typeTranslate = type === "anime" ? translate("$currentlyWatching") : translate("$currentlyReading");
  const text = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
      <h2 class="index_h2_seo"><a href="https://myanimelist.net/${type}list/${headerUserName}?status=1">${typeTranslate}</a></h2>
      <i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i></div>
      <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-${typeText}">
      <div id="currently-left${type === "manga" ? "-manga" : ""}" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
      <div id="currently-right${type === "manga" ? "-manga" : ""}" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
      <div class="widget-slide-outer">
      <ul class="widget-slide js-widget-slide ${type === "manga" ? "manga" : ""}" style="width: 3984px;
      margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
      ${
        svar.currentlyGrid && svar.currentlyGridAccordion
          ? `</div><div class="accordion" style="display: none; text-align-last: center; height: 25px; margin-top: 5px; width: 100%; position: relative;">
      <button class="toggle-button" style="height: 25px; width: 100%;overflow: hidden;background: none;border: none;cursor: pointer;">
      <img class="toggle-icon" src="https://myanimelist.net/images/icon-pulldown2.png?v=163426320" style="position: relative; top: -35px;">
      </button></div>`
          : ""
      }</div></div></div></div>`;
  return text;
}

async function processGridAccordion(type) {
  if (!svar.currentlyGridAccordion) return;

  try {
    const $container = $(`#widget-currently-${type}`);
    const $main = $(`#currently-${type}`);
    const $div = $container.find(".widget-slide");
    const $btn = $container.find(".toggle-button");
    const $icon = $container.find(".toggle-icon");
    const isExpandable = $div[0].scrollHeight > collapsedHeight;
    $btn.attr("data-expanded", "false");

    if (isExpandable) {
      $div.css({
        "max-height": `${collapsedHeight}px`,
        transition: "max-height 0.4s ease",
      });
      $container.find(".accordion").show();
    }

    $btn.off("click").on("click", async function () {
      const isExpanded = $(this).attr("data-expanded") === "true";
      $(this).attr("data-expanded", !isExpanded);
      $div.css("max-height", !isExpanded ? `${$div[0].scrollHeight}px` : `${collapsedHeight}px`);
      $icon.css("top", !isExpanded ? "5px" : "-35px");
      if (isExpanded) {
        const offset = !defaultMal ? 55 : 10;
        const top = $main[0].getBoundingClientRect().top + window.pageYOffset - offset;
        await delay(400);
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  } catch (error) {
    console.error("Error processing currently grid accordion:", error);
  }
}

async function createCurrentlyWidget(type) {
  try {
    const isAnime = type === "anime";
    const typeText = isAnime ? "watching" : "reading";
    const listType = isAnime ? "animelist" : "mangalist";
    const idKey = isAnime ? "anime_id" : "manga_id";
    const titleKey = isAnime ? "anime_title" : "manga_title";
    const imgKey = isAnime ? "anime_image_path" : "manga_image_path";
    const urlKey = isAnime ? "anime_url" : "manga_url";
    const progressKey = isAnime ? "num_watched_episodes" : "num_read_chapters";
    const totalKey = isAnime ? "anime_num_episodes" : "manga_num_chapters";
    const readVolumes = isAnime ? null : "num_read_volumes";
    const score = isAnime ? "score" : "score";
    const status = isAnime ? "status" : "status";
    const widgetId = `currently-${typeText}`;
    const sliderId = `#widget-currently-${typeText}`;
    const leftBtnId = `currently-left${isAnime ? "" : "-manga"}`;
    const rightBtnId = `currently-right${isAnime ? "" : "-manga"}`;
    const defWidth = svar.currentlyGrid6Column && svar.currentlyGrid ? 102 : 124;
    const defHeight = svar.currentlyGrid6Column && svar.currentlyGrid ? 147 : 170;

    const div = create("article", { class: "widget-container left", id: widgetId });
    div.innerHTML = htmlTemplate(type);
    const dataUrl = `https://myanimelist.net/${listType}/${headerUserName}?status=1`;
    const response = await fetch(dataUrl);
    const data = await response.text();
    const newDocument = new DOMParser().parseFromString(data, "text/html");
    const list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
    if (!list) return;

    const container = document.querySelector("#content > div.left-column");
    if (isAnime || !document.querySelector("#currently-watching")) {
      container.prepend(div);
    } else {
      document.querySelector("#currently-watching").insertAdjacentElement("afterend", div);
    }

    if (svar.airingDate && isAnime) {
      let ids = list.map((item) => item[idKey]);
      const queries = ids.map((id, i) => `Media${i}: Media(idMal: ${id}, type: ANIME) {nextAiringEpisode {timeUntilAiring episode}}`);
      const infoData = await AnilistAPI(`query {${queries.join("\n")}}`);
      await renderList(list, infoData, defWidth, defHeight);
    } else {
      await renderList(list, null, defWidth, defHeight);
    }

    async function renderList(list, infoData, width, height) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let progressInfo = "";

        if (isAnime && svar.airingDate && infoData) {
          const media = infoData.data["Media" + i];
          const ep = media?.nextAiringEpisode?.episode ?? "";
          const time = media?.nextAiringEpisode?.timeUntilAiring ?? "";

          const behind = ep && ep !== 1 ? await episodesBehind(ep, item[progressKey]) : 0;
          const airingText = ep && time ? `<div id="${time}" class="airingInfo"><div>Ep ${ep}</div><div>${await airingTime(time)}</div></div>` : "";

          progressInfo = airingText;
          if (behind) {
            progressInfo += `<span class="epBehind">${behind}</span><div class="behindWarn"></div>`;
          }
        }

        if (!progressInfo) {
          progressInfo = `<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">${item[progressKey]}${
            item[totalKey] !== 0 ? " / " + item[totalKey] : ""
          }</div></div>`;
        }

        const editBtn = create("i", { class: "fa fa-pen editCurrently", id: item[idKey] });
        const incBtn = create("i", { class: "fa fa-plus incButton", id: item[idKey] });
        const node = create("li", {
          class: "btn-anime",
          style: { ...(svar.currentlyGrid && { margin: 0 }), minHeight: `${height}px`, maxHeight: `${height}px`, minWidth: `${width}px`, maxWidth: `${width}px` },
        });

        node.innerHTML = `<a class="link" href="${item[urlKey]}">
                <img width="${width}" height="${height}" style="min-height:${height}px;max-height:${height}px;min-width:${width}px;max-width:${width}px"
                class="lazyload" src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${item[imgKey]}" alt="${item[titleKey]}">
                <span class="title js-color-pc-constant color-pc-constant">${item[titleKey]}</span>${progressInfo}</a>`;
        node.appendChild(editBtn);
        node.appendChild(incBtn);
        document.querySelector(`${sliderId} ul`).append(node);
        const loadingIndicator = create("div", { class: "recently-genre-indicator currently-loading-indicator" });

        editBtn.onclick = async () => {
          await editPopup(item[idKey], isAnime ? null : "manga");
          div.remove();
          await createCurrentlyWidget(type);
        };

        incBtn.onclick = async () => {
          if (!document.querySelector(".currently-loading-indicator")) {
            incBtn.parentElement.append(loadingIndicator);
          }
          loadingIndicator.style.display = "none";
          void loadingIndicator.offsetWidth;
          loadingIndicator.style.display = "block";
          const currentTime = Date.now();
          if (currentTime - lastClickTime < debounceDelay || (incActive !== 0 && incActive !== editBtn.id)) {
            return;
          }
          if (incActive === 0) incActive = editBtn.id;
          lastClickTime = currentTime;
          incCount++;
          incBtn.innerText = incCount.toString();
          clearTimeout(incTimer);
          incTimer = setTimeout(async function () {
            loadingIndicator.remove();
            const currentProgress = item[progressKey];
            const totalProgress = item[totalKey];

            // Status check
            let shouldUseEditPopup = svar.autoAddDate && (currentProgress === 0 || currentProgress === totalProgress);
            if (shouldUseEditPopup) {
              await editPopup(item[idKey], isAnime ? null : "manga", true, incCount);
            } else {
              try {
                await updateAniMangaEntry(item[idKey], isAnime ? null : "manga", item[status], item[score], currentProgress + incCount, item[readVolumes]);
              } catch (err) {
                await editPopup(item[idKey], isAnime ? null : "manga", true, incCount);
              }
            }

            div.remove();
            await createCurrentlyWidget(type);
            incCount = 0;
            incActive = 0;
          }, 2000);
        };
      }
      document.querySelector(`${sliderId} ul`).style.width = 138 * list.length + "px";
      // Sort by time until airing
      if (svar.airingDate && isAnime) {
        let airingDivs = Array.from(document.querySelectorAll("#widget-currently-watching ul li"));
        let airingMainDiv = document.querySelector("#widget-currently-watching ul");

        airingDivs.sort((a, b) => {
          let idA = Number(a.querySelector(":scope > * > *:nth-child(3)")?.id || 0);
          let idB = Number(b.querySelector(":scope > * > *:nth-child(3)")?.id || 0);
          return idA - idB;
        });

        airingMainDiv.replaceChildren(...airingDivs);
      }
      document.querySelector(`#${widgetId} > div > div.widget-header > i`).remove();
      if (svar.customCover) loadCustomCover(1);
      if (svar.currentlyGrid) {
        $(`${sliderId} .widget-slide`).addClass(`currentlyGrid ${svar.currentlyGrid6Column ? "currentlyGrid6Column" : ""}`);
        $(`${sliderId} .widget-slide`).css("grid-template-columns", svar.currentlyGrid6Column ? "repeat(6, minmax(0, 1fr))" : "repeat(6, minmax(0, 1fr))");
        $(`${sliderId} .widget-slide`).css("gap", svar.currentlyGrid6Column ? "15px 10px" : "20px 10px");
        $(`${sliderId} .widget-slide`).css("width", "100%");
        $(`${sliderId} #${leftBtnId}`).remove();
        $(`${sliderId} #${rightBtnId}`).remove();
        processGridAccordion(typeText);
      } else {
        // Sliders
        const slider = document.querySelector(`${sliderId} ul`);
        let items = Array.from(slider.querySelectorAll(".btn-anime")).filter((el) => el.offsetWidth > 0);
        const slideWidth = items[0].offsetWidth + 12;
        const itemsPerScroll = 5;
        let maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
        const leftBtn = document.querySelector(`${sliderId} #${leftBtnId}`);
        const rightBtn = document.querySelector(`${sliderId} #${rightBtnId}`);

        function updateButtons(index) {
          if (index <= 0) {
            leftBtn.classList.remove("active");
            leftBtn.setAttribute("disabled", "true");
          } else {
            leftBtn.classList.add("active");
            leftBtn.removeAttribute("disabled");
          }

          if (index >= maxIndex) {
            rightBtn.classList.remove("active");
            rightBtn.setAttribute("disabled", "true");
          } else {
            rightBtn.classList.add("active");
            rightBtn.removeAttribute("disabled");
          }
        }

        updateButtons(0);
        rightBtn.addEventListener("click", function () {
          let index = parseInt(slider.dataset.index || "0");

          if (index < maxIndex) {
            index++;
            slider.dataset.index = index;
            slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
            updateButtons(index);
          }
        });

        leftBtn.addEventListener("click", function () {
          let index = parseInt(slider.dataset.index || "0");

          if (index > 0) {
            index--;
            slider.dataset.index = index;
            slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
            updateButtons(index);
          }
        });
      }
    }
  } catch (error) {
    console.error(`Error creating currently added widget for ${type}:`, error);
  }
}

if (svar.currentlyWatching && location.pathname === "/") {
  createCurrentlyWidget("anime");
}
if (svar.currentlyReading && location.pathname === "/") {
  createCurrentlyWidget("manga");
}

// ==== panel_recentlyAdded.js ====
async function processRecentlyGridAccordion(type, hide) {
  try {
    if (!svar.recentlyGridAccordion) return;
    const recentlyCollapsedHeight = svar.recentlyGrid6Column ? 315 : 370;
    const $container = $(`#widget-recently-added-${type}`);
    const $main = $(`#recently-added-${type}`);
    const $div = $container.find(".widget-slide");
    const $btn = $container.find(".toggle-button");
    const $icon = $container.find(".toggle-icon");
    const $loadBtn = $container.find(`#recently-added-${type}-load-more`);
    const triggered = $loadBtn.attr("data-triggered") === "true";

    if (hide) {
      $loadBtn.attr("data-triggered", "false");
    }

    const scrollHeight = $div[0].scrollHeight;
    const isExpandable = scrollHeight > recentlyCollapsedHeight;

    $btn.attr("data-expanded", "false");

    // Check Expand
    if (isExpandable) {
      if (!$btn.attr("data-keep-expanded")) {
        $div.css({
          "max-height": `${recentlyCollapsedHeight}px`,
          transition: "max-height 0.4s ease",
        });
      }
      $container.find(".accordion").show();
    } else {
      $container.find(".accordion").hide();
    }

    // Accordion opening conditions
    if (!hide || triggered) {
      $div.css({
        "max-height": `${scrollHeight}px`,
        transition: "max-height 0.4s ease",
      });
      $btn.attr("data-expanded", "true");
      $icon.css("top", "5px");
    } else {
      $icon.css("top", "-35px");
    }

    // Accordion Click
    $btn.off("click").on("click", async function () {
      const isExpanded = $(this).attr("data-expanded") === "true";
      const currentScrollHeight = $div[0].scrollHeight;

      if (isExpanded) {
        // Shrink
        $div.css("max-height", `${recentlyCollapsedHeight}px`);
        $(this).attr("data-expanded", "false");
        $icon.css("top", "-35px");

        const offset = !defaultMal ? 55 : 10;
        const top = $main[0].getBoundingClientRect().top + window.pageYOffset - offset;
        await delay(400);
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        // Expand
        $div.css("max-height", `${currentScrollHeight}px`);
        $(this).attr("data-expanded", "true");
        $icon.css("top", "5px");
      }
    });
  } catch (error) {
    console.error("Error process recently grid accordion:", error);
  }
}

function recentlyHtmlTemplate(type) {
  const typeTranslate = type === "anime" ? translate("$recentlyAddedAnime") : translate("$recentlyAddedManga");
  const genreFilter = type === "anime" ? svar.recentlyAnimeFilter : svar.recentlyMangaFilter;
  let animeOptions = `
    <select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilter">
    <option value="All">All</option><option value="TV,Movie" >TV &amp; Movie</option><option value="TV">TV</option>
    <option value="TV Special">TV Special</option><option value="Movie">Movie</option><option value="ONA">ONA</option>
    <option value="OVA">OVA</option><option value="Special">Special</option><option value="Music">Music</option>
    <option value="CM">CM</option><option value="PV">PV</option>
    </select>`;
  const animeSelected = svar.recentlyAnimeDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyAnimeDefault) : "All";
  animeOptions = animeOptions.replace(`value="${animeSelected}"`, `value="${animeSelected}" selected`);

  let mangaOptions = `
    <select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilterManga">
        <option value="All">All</option>
        <option value="Manga">Manga</option>
        <option value="One-shot">One-shot</option>
        <option value="Doujinshi">Doujinshi</option>
        <option value="Light Novel">Light Novel</option>
        <option value="Novel">Novel</option>
        <option value="Manhwa">Manhwa</option>
        <option value="Manhua">Manhua</option>
      </select>`;
  const mangaSelected = svar.recentlyMangaDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyMangaDefault) : "All";
  mangaOptions = mangaOptions.replace(`value="${mangaSelected}"`, `value="${mangaSelected}" selected`);

  const template = `
    <div class="widget anime_suggestions left">
    <div class="widget-header">
      <span style="float: right;"></span>
      <h2 class="index_h2_seo">
        <a href="https://myanimelist.net/${type}.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1${genreFilter}">${typeTranslate}</a>
      </h2>
      <i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>
    ${type === "anime" ? animeOptions : mangaOptions}
    </div>
    <div class="widget-content">
      <div class="mt4">
        <div class="widget-slide-block" id="widget-recently-added-${type}">
          <div id="currently-left-recently-added-${type}" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;">
            <span class="btn-inner"></span>
          </div>
          <div id="currently-right-recently-added-${type}" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">
            <span class="btn-inner" style="display: none;"></span>
          </div>
          <div class="widget-slide-outer">
            <ul class="widget-slide js-widget-slide recent-${type}"  data-index="0" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>
          </div>
          ${
            svar.recentlyGrid && svar.recentlyGridAccordion
              ? `<div class="accordion" style="display: none; text-align-last: center; height: 25px; margin-top: 5px; width: 100%; position: relative;">
      <button class="toggle-button" style="height: 25px; width: 100%;overflow: hidden;background: none;border: none;cursor: pointer;">
      <img class="toggle-icon" src="https://myanimelist.net/images/icon-pulldown2.png?v=163426320" style="position: relative; top: -35px;">
      </button></div>`
              : ""
          }
        </div>
      </div>
    </div>
  </div>`;
  return template;
}

async function createRecentlyAddedWidget(type) {
  try {
    $(`#recently-added-${type}`).remove();
    const isAnime = type === "anime";
    const mediaType = isAnime ? 0 : 1;
    const id = `recently-added-${type}`;
    const containerClass = `widget-container left recently-${type}`;
    const widgetSelector = `#widget-recently-added-${type}`;
    const sliderSelector = `.widget-slide.js-widget-slide.recent-${type}`;
    const typeFilterId = isAnime ? "typeFilter" : "typeFilterManga";
    const leftBtnId = `#currently-left-recently-added-${type}`;
    const rightBtnId = `#currently-right-recently-added-${type}`;
    const loadMoreText = translate("$loadMore");
    const recentlyLoadMoreWidth = svar.recentlyGrid6Column && svar.recentlyGrid ? 102 : 124;
    const recentlyLoadMoreHeight = svar.recentlyGrid6Column && svar.recentlyGrid ? 147 : 170;
    let btnAnimeWidth;

    let user = headerUserName;
    if (!user) return;

    const recentlyAddedDiv = create("article", { class: containerClass, id: id, page: "0" });
    recentlyAddedDiv.innerHTML = recentlyHtmlTemplate(type);

    let list = await getList();
    async function getList() {
      for (let x = 0; x < 5; x++) {
        const data = await getRecentlyAdded(mediaType);
        if (data) return data;
        await delay(1000);
      }
      let d = document.querySelector(`#${id} > div > div.widget-header`);
      if (d) {
        let e = create("span", { class: "currently-watching-error", style: { float: "right", display: "inline-block" } }, "API Error. Please try again.");
        let r = create("i", { class: "fa-solid fa-rotate-right" });
        r.onclick = () => {
          recentlyAddedDiv.remove();
          createRecentlyAddedWidget(type);
        };
        e.append(r);
        d.append(e);
      }
    }

    if (!list) return;

    // Insert widget to DOM
    const refEl = document.querySelector("#recently-added-anime") || document.querySelector("#currently-reading") || document.querySelector("#currently-watching");
    if (refEl) {
      refEl.insertAdjacentElement("afterend", recentlyAddedDiv);
    } else {
      document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
    }

    buildRecentlyAddedList(list, `${widgetSelector} ul`, recentlyLoadMoreWidth, recentlyLoadMoreHeight);
    document.querySelector(`${widgetSelector} > div.widget-slide-outer > ul`).children.length > 5 ? document.querySelector(rightBtnId)?.classList.add("active") : "";

    let itemBackup = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`));
    btnAnimeWidth = getTotalWidth(`${widgetSelector} ul .btn-anime`);
    if (!svar.recentlyGrid) {
      document.querySelector(`${widgetSelector} ul`).style.width =
        btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
    }
    // Load More Button
    const loadMoreButton = create("a", { class: "btn-load-more", id: `${id}-load-more` }, loadMoreText);
    loadMoreButton.style.width = recentlyLoadMoreWidth + "px";
    loadMoreButton.style.height = recentlyLoadMoreHeight + "px";
    const slider = document.querySelector(sliderSelector);
    slider.append(loadMoreButton);
    const genreFilter = type === "anime" ? svar.recentlyAnimeFilter : svar.recentlyMangaFilter;
    const animeSelected = svar.recentlyAnimeDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyAnimeDefault) : "All";
    const mangaSelected = svar.recentlyMangaDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyMangaDefault) : "All";
    filterRecentlyAdded(itemBackup, isAnime ? animeSelected : mangaSelected);
    updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);

    loadMoreButton.addEventListener("click", async function () {
      if (loadMoreButton.innerHTML === loadMoreText) {
        let retries = 5;
        let delayMs = 1000;
        loadMoreButton.style.pointerEvents = "none";
        document.getElementById(typeFilterId).disabled = true;
        async function tryLoadMore() {
          loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
          const selectedType = document.getElementById(typeFilterId).value.split(",");
          const prevCount = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length;

          let pageCount = parseInt(document.getElementById(id).getAttribute("page")) + 50;
          let moreList = await getRecentlyAdded(mediaType, pageCount);
          list = list.concat(moreList);
          buildRecentlyAddedList(moreList, `${widgetSelector} ul`, recentlyLoadMoreWidth, recentlyLoadMoreHeight);

          document.getElementById(id).setAttribute("page", pageCount);
          const newItems = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).slice(-moreList.length);
          itemBackup.push(...newItems);

          filterRecentlyAdded(itemBackup, selectedType);
          updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);
          slider.append(loadMoreButton);
          if (!svar.recentlyGrid) {
            document.querySelector(`${widgetSelector} ul`).style.width =
              btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
          }
          loadMoreButton.setAttribute("data-triggered", "true");
          refreshSlider();

          if (svar.recentlyGrid) {
            processRecentlyGridAccordion(type, 1);
          }

          const newCount = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length;

          if (newCount === prevCount && retries > 0) {
            retries--;
            await delay(delayMs);
            await tryLoadMore();
          } else {
            loadMoreButton.innerHTML = loadMoreText;
          }
        }

        await tryLoadMore();
        loadMoreButton.style.pointerEvents = "";
        document.getElementById(typeFilterId).disabled = false;
      }
    });

    // Type Filter Change
    document.getElementById(typeFilterId).addEventListener("change", function (e) {
      slider.style.marginLeft = 0;
      const listNode = document.querySelector(`${widgetSelector} ul`);
      listNode.innerHTML = "";
      addAllRecentlyAdded(itemBackup, listNode);
      const selectedType = e.target.value.split(",");
      filterRecentlyAdded(itemBackup, selectedType);
      if (!svar.recentlyGrid) {
        document.querySelector(`${widgetSelector} ul`).style.width =
          btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
      }
      updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);
      slider.append(loadMoreButton);
      refreshSlider(1);
      if (svar.recentlyGrid) {
        processRecentlyGridAccordion(type, 1);
      }
    });

    // Sliders
    let items = Array.from(slider.querySelectorAll(".btn-anime,.btn-load-more")).filter((el) => el.offsetWidth > 0);
    const slideWidth = getTotalWidth(items[0]);
    const itemsPerScroll = 5;
    let maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
    const leftBtn = document.querySelector(leftBtnId);
    const rightBtn = document.querySelector(rightBtnId);

    function refreshSlider(reset) {
      items.length = 0;
      items = Array.from(slider.querySelectorAll(".btn-anime,.btn-load-more")).filter((el) => el.offsetWidth > 0);
      maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
      if (reset) slider.setAttribute("data-index", "0");
      updateButtons(reset ? 0 : parseInt(slider.dataset.index || "0"));
    }

    function updateButtons(index) {
      if (index <= 0) {
        leftBtn.classList.remove("active");
        leftBtn.setAttribute("disabled", "true");
      } else {
        leftBtn.classList.add("active");
        leftBtn.removeAttribute("disabled");
      }

      if (index >= maxIndex) {
        rightBtn.classList.remove("active");
        rightBtn.setAttribute("disabled", "true");
      } else {
        rightBtn.classList.add("active");
        rightBtn.removeAttribute("disabled");
      }
    }

    document.querySelector(`#${id} > div > div.widget-header > i`).remove();
    if (svar.recentlyGrid) {
      $(`${widgetSelector} .widget-slide`).addClass(`recentlyGrid ${svar.recentlyGrid6Column ? "recentlyGrid6Column" : ""}`);
      $(`${widgetSelector} .widget-slide`).css("grid-template-columns", svar.recentlyGrid6Column ? "repeat(6, minmax(0, 1fr))" : "repeat(5, minmax(0, 1fr))");
      $(`${widgetSelector} .widget-slide`).css("gap", svar.recentlyGrid6Column ? "15px 10px" : "20px 10px");
      $(`${widgetSelector} .widget-slide`).css("width", "100%");
      $(`${widgetSelector} ${leftBtnId}`).remove();
      $(`${widgetSelector} ${rightBtnId}`).remove();
      processRecentlyGridAccordion(type, 1);
    } else {
      updateButtons(0);

      rightBtn.addEventListener("click", function () {
        let index = parseInt(slider.dataset.index || "0");

        if (index < maxIndex) {
          index++;
          slider.dataset.index = index;
          slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
          updateButtons(index);
        }
      });

      leftBtn.addEventListener("click", function () {
        let index = parseInt(slider.dataset.index || "0");

        if (index > 0) {
          index--;
          slider.dataset.index = index;
          slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
          updateButtons(index);
        }
      });
    }
  } catch (error) {
    console.error(`Error creating recently added widget for ${type}:`, error);
  }
}

if (svar.recentlyAddedAnime && location.pathname === "/") {
  createRecentlyAddedWidget("anime");
}

if (svar.recentlyAddedManga && location.pathname === "/") {
  createRecentlyAddedWidget("manga");
}

// ==== panel_seasonalInfo.js ====
if (svar.animeInfo && location.pathname === "/") {
  //Get Seasonal Anime and add info button
  if (document.querySelector(".widget.seasonal.left")) {
    try {
      const i = document.querySelectorAll(".widget.seasonal.left .btn-anime");
      i.forEach((info) => {
        let ib = create("i", {
          class: "fa more-info-button fa-info-circle",
        });
        info.prepend(ib);
      });

      // info button click event for seasonal anime
      $(".widget.seasonal.left i").on("click", async function () {
        createInfo($(this), ".widget.seasonal.left");
      });

      // Add info button to auto recommendations
      const recDiv = await waitForElement(".js-auto-recommendation .item");
      if (recDiv) {
        const i = document.querySelectorAll(".js-auto-recommendation .item");
        i.forEach((info) => {
          let ib = create("i", {
            class: "fa more-info-button fa-info-circle",
          });
          $(info).addClass("link");
          $(info).wrapAll("<div class='rec-info-wrapper btn-anime'></div>").parent().prepend(ib);
        });

        // info button click event for recommendations
        $(".widget.anime_suggestions.left .rec-info-wrapper.btn-anime i").on("click", async function () {
          createInfo($(this), ".widget.anime_suggestions.left", 0);
        });
        $(".widget.manga_suggestions.left .rec-info-wrapper.btn-anime i").on("click", async function () {
          createInfo($(this), ".widget.manga_suggestions.left", 1);
        });
      }
    } catch (error) {
      console.error("AnimeInfo Error:", error);
    }
  }
}

// ==== profile_0_main.js ====
if ($(".comment-form").text().trim() === `You must be friends with ${username} to comment on their profile.`) {
  const profileComID = $('a:contains("Report")').last().attr("href").split("&")[2];
  $(".comment-form").append(`<br><a href=https://myanimelist.net/comments.php?${profileComID}>All Comments</a>`);
}
let banner = create("div", { class: "banner", id: "banner" });
let shadow = create("div", { class: "banner", id: "shadow" });
let container = create("div", { class: "container", id: "container" });
let customfg, custombg, custompf, customCSS, custombadge, customcolors, userimg, customModernLayoutFounded, privateProfile, malBadgesUrl;
let profileRegex = {
  malClean: /(malcleansettings)\/([^"\/])/gm,
  fg: /(customfg)\/([^"\/]+)/gm,
  bg: /(custombg)\/([^"\/]+)/gm,
  pf: /(custompf)\/([^"\/]+)/gm,
  css: /(customCSS)\/([^"\/]+)/gm,
  badge: /(custombadge)\/([^"\/]+)/gm,
  malBadges: /(malBadges)\/([^"\/]+)/gm,
  colors: /(customcolors)\/([^"\/]+)/gm,
  favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
  privateProfile: /(privateProfile)\/([^"\/]+)/gm,
  hideProfileEl: /(hideProfileEl)\/([^"\/]+)/gm,
  customProfileEl: /(customProfileEl)\/([^"\/]+)/gm,
  moreFavs: /(moreFavs)\/([^\/]+.)/gm,
};
$(".user-friends.pt4.pb12").prev().addBack().wrapAll("<div id='user-friends-div'></div>");
$(".user-badges").prev().addBack().wrapAll("<div id='user-badges-div'></div>");
$(".user-profile-sns").has('a:contains("Recent")').prev().addBack().wrapAll("<div id='user-rss-feed-div'></div>");
$('.user-profile-sns:not(:contains("Recent"))').prev().addBack().wrapAll("<div id='user-links-div'></div>");
$(".user-button").attr("id", "user-button-div");
$(".user-status:contains(Joined)").last().attr("id", "user-status-div");
$(".user-status:contains(History)").attr("id", "user-status-history-div");
$(".user-status:contains(Forum Posts)").attr("id", "user-status-counts-div");
$(".user-statistics-stats").first().attr("id", "user-stats-div");
$(".user-statistics-stats").last().attr("id", "user-updates-div");
shadow.setAttribute("style", "background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;");
banner.append(shadow);
if ($("title").text() === "404 Not Found - MyAnimeList.net\n") {
  addLoading("remove");
}
//Private Profile Check
async function applyPrivateProfile() {
  if (privateProfile && userNotHeaderUser) {
    await delay(200);
    $("#banner").hide();
    $("#content").hide();
    $("#navbar").hide();
    addLoading("add", translate("$profilePrivate"), 0, 1);
  }
}

// ==== profile_CustomElements.js ====
async function createCustomDiv(appLoc, header, content, editData) {
  $("#customAddContainer").remove();
  if (!document.querySelector("#customAddContainer")) {
    const cont = create("div", { id: "customAddContainer" });
    let appendLoc = appLoc ? appLoc : document.querySelector("#user-button-div");
    const isRight = appLoc === "right" || (appLoc && appLoc.classList[1]) ? 1 : 0;
    if (isRight) {
      appendLoc = $(".user-comments").before(cont);
    } else {
      appendLoc.insertAdjacentElement("afterend", cont);
    }
    const newDiv = create("div", { id: "customAddContainerInside" });
    const btnsDiv = create("div", { id: "customAddContainerInsideButtons", style: { display: "block", textAlignLast: "center" } });
    if (isRight) cont.classList.add("right");
    const closeButton = create("button", { class: "mainbtns btn-active-def", id: "closeButton", style: { width: "45px", float: "right", marginTop: "-5px" } }, translate("$close"));
    closeButton.addEventListener("click", function () {
      cont.remove();
    });
    newDiv.appendChild(closeButton);
    $(newDiv).append("<h4>" + (appLoc && appLoc !== "right" ? translate("$edit") : translate("$addCustom")) + " " + translate("$profileElement") + "</h4>");

    // Header
    const headerInput = create("input", { id: "header-input" });
    headerInput.setAttribute("placeholder", translate("$addTitleHere"));
    headerInput.value = header ? header : null;
    newDiv.appendChild(headerInput);

    // Content
    const contentInput = create("textarea", { id: "content-input" });
    contentInput.setAttribute("placeholder", translate("$addContentHere"));
    contentInput.value = content ? content : null;
    newDiv.appendChild(contentInput);

    // Preview Button
    const previewButton = create("button", { class: "mainbtns btn-active-def", id: "previewButton", style: { width: "48%" } }, translate("$preview"));
    previewButton.addEventListener("click", function () {
      if (!document.querySelector("#custom-preview-div")) {
        const previewDiv = create("div", { id: "custom-preview-div" });
        cont.prepend(previewDiv);
      }
      addSCEditorCommands();
      scParserActions("content-input", "bbRefresh");
      const headerText = DOMPurify.sanitize(headerInput.value) || translate("$noTitle");
      const contentText = DOMPurify.sanitize(scParserActions("content-input", "fromBBGetVal"), purifyConfig);
      document.querySelector("#custom-preview-div").innerHTML = `
      <h2>${translate("$preview")}</h2>
      ${
        isRight && svar.modernLayout
          ? `<h4 style="border: 0;margin: 15px 0 4px 4px;">${headerText}</h4>`
          : `<h5 style="${svar.modernLayout ? "font-size: 11px; margin: 0 0 8px 2px;" : ""}">${headerText}</h5>`
      }
      <div>${contentText}</div><br>`;
    });
    btnsDiv.appendChild(previewButton);

    // Add Button
    const addButton = create("button", { class: "mainbtns btn-active-def", id: "addButton", style: { width: "48%" } }, appLoc && appLoc !== "right" ? translate("$edit") : translate("$add"));
    addButton.addEventListener("click", function () {
      scParserActions("content-input", "bbRefresh");
      const headerText = headerInput.value;
      let contentText = scParserActions("content-input", "fromBBGetVal");

      if (headerText.length > 1 && contentText.length > 1) {
        const customElArray = [
          {
            header: headerText,
            content: contentText,
            isRight: isRight,
          },
        ];
        const customElBase64 = LZString.compressToBase64(JSON.stringify(customElArray));
        const customElbase64url = customElBase64.replace(/\//g, "_");
        if (editData) {
          editAboutPopup([editData, `customProfileEl/${customElbase64url}`], "editCustomEl");
        } else {
          editAboutPopup(`customProfileEl/${customElbase64url}`, "customProfileEl");
        }
      }
    });
    btnsDiv.appendChild(addButton);
    newDiv.appendChild(btnsDiv);
    document.getElementById("customAddContainer").appendChild(newDiv);

    //ScEditor - Required Commands and Formats
    if (typeof sceditor !== "undefined") {
      await addSCEditor(contentInput);
      scParserActions("content-input", "bbRefresh");
    }
  }

  //Animate Scroll to ScEditor
  $("html, body").animate(
    {
      scrollTop: $("#customAddContainer").offset().top - $(window).height() * 0.1,
    },
    500
  );
}

async function buildCustomElements(data) {
  let parts = data.split("/");
  let favarray = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "customProfileEl") {
      if (i + 1 < parts.length) {
        const data = decodeAndParseBase64(parts[i + 1]);
        if (data) {
          favarray.push(data);
        }
      }
    }
  }

  let mainGroup = create("div", { id: "custom-el-group" });
  let customElContent = create("div", { class: "customProfileEls", id: "customProfileEls" });
  let customElContentRight = create("div", { class: "customProfileEls right", id: "customProfileEls" });
  let sortItem1 = null;
  let sortItem2 = null;
  if (svar.modernLayout) {
    const appendLoc = document.querySelector("#user-button-div");
    appendLoc.insertAdjacentElement("afterend", customElContent);
  } else {
    $(".user-comments").before(customElContent);
    $(customElContent).css({ marginBottom: "30px", width: "810px" });
    mainGroup.classList.add("flex2x");
  }
  $(".user-comments").before(customElContentRight);

  function replaceCustomEls() {
    const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
    const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
    const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
    const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
    editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceCustomEl");
    sortItem1 = null;
    sortItem2 = null;
  }
  favarray.forEach((arr, index) => {
    arr.forEach((item) => {
      const isRight = item.isRight ? 1 : 0;
      const customElContainer = create("div", { class: "custom-el-container" });
      if (isRight) customElContainer.classList.add("right");
      customElContainer.innerHTML = `
      <div class="fa fa-pen editCustomEl" order="${index}" title="${translate("$edit")}"></div>
      <div class="fa fa-sort sortCustomEl" order="${index}" title="${translate("sort")}"></div>
      <div class="fa fa-x removeCustomEl" order="${index}" title="${translate("$remove")}"></div>
      ${
        isRight && svar.modernLayout
          ? `<h4 class="custom-el-header" style="border: 0;margin: 15px 0 4px 4px;">${item.header}</h4>`
          : `<h5 class="custom-el-header" style="${svar.modernLayout ? "font-size: 11px; margin: 0 0 8px 2px;" : ""}">${item.header}</h5>`
      }
      <div class="${svar.modernLayout ? "custom-el-inner" : "custom-el-inner notAl"}">${item.content}</div>
      `;
      if (isRight) {
        customElContentRight.appendChild(customElContainer);
        if (svar.alstyle && !defaultMal) {
          $(".user-comments").css("top", "-50px");
        }
      } else {
        customElContent.appendChild(customElContainer);
      }
    });
  });
  customElContent.append(mainGroup);

  //Sort Custom Element click function
  document.querySelectorAll(".sortCustomEl").forEach((element) => {
    element.addEventListener("click", function () {
      const order = this.getAttribute("order");
      if (sortItem1 === null) {
        sortItem1 = order;
        $(".sortCustomEl").addClass("hidden");
        $(this).addClass("selected");
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").removeClass("hidden");
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").show();
      } else if (sortItem2 === null) {
        sortItem2 = order;
        if (sortItem2 !== sortItem1) {
          replaceCustomEls();
        }
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").hide();
        $(".sortCustomEl").removeClass("hidden").removeClass("selected");
      }
      if (sortItem1 === sortItem2) {
        sortItem1 = null;
        sortItem2 = null;
      }
    });
  });
  //Edit Custom Element click function -not-tested
  $(".editCustomEl").on("click", function () {
    const appLoc = $(this).parent()[0];
    const header = $(this).nextUntil(".custom-el-header").next(".custom-el-header").text();
    const content = $(this).nextUntil(".custom-el-inner").next(".custom-el-inner").html();
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    const editData = `customProfileEl/${base64url}`;
    createCustomDiv(appLoc, header, content, editData);
  });

  //Remove Custom Element click function
  $(".removeCustomEl").on("click", function () {
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    editAboutPopup(`customProfileEl/${base64url}/`, "removeCustomEl");
  });

  if (userNotHeaderUser) {
    $(".sortCustomEl").remove();
    $(".editCustomEl").remove();
    $(".removeCustomEl").remove();
  }

  // Spoiler Show - Hide
  setTimeout(function () {
    let showButtons = document.querySelectorAll(".show_button");
    showButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        let spoilerContent = this.nextElementSibling;
        spoilerContent.style.display = "inline-block";
        this.style.display = "none";
      });
    });

    let hideButtons = document.querySelectorAll(".hide_button");
    hideButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        let spoilerContent = this.closest(".spoiler").querySelector(".spoiler_content");
        spoilerContent.style.display = "none";
        this.closest(".spoiler").querySelector(".show_button").style.display = "inline-block";
      });
    });
  }, 0);
}

// ==== profile_FavTheme.js ====
async function buildFavSongs(data) {
  if (!data) return;
  const parts = data.split("/");
  const favarray = [];

  try {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "favSongEntry" && parts[i + 1]) {
        const data = decodeAndParseBase64(parts[i + 1]);
        if (data) {
          favarray.push(data);
        }
      }
    }
  } catch (error) {
    console.error("Error processing fav songs:", error);
    return;
  }

  if (!favarray.length) return;

  let opGroup = create("div", { id: "op-group" });
  let edGroup = create("div", { id: "ed-group" });
  let FavContent = create("div", { class: "favThemes", id: "favThemes" });
  let sortItem1 = null;
  let sortItem2 = null;
  if (svar.modernLayout) {
    $(FavContent).insertBefore($("#content > div > div.container-left > div li.icon-statistics.link").parent());
  } else {
    $("#content > div > div.container-right > h2").nextUntil(".user-comments").wrapAll("<div class='favContainer' id='user-def-favs'></div>");
    $(".user-comments").before(FavContent);
    $(FavContent).css({ marginBottom: "30px", width: "810px", display: "inline-block" });
    opGroup.classList.add("flex2x");
    edGroup.classList.add("flex2x");
  }

  if ((customCSS && customCSS.constructor === Array && customCSS[1]) || (customCSS && customCSS.constructor !== Array) || svar.modernLayout) {
    const favbg = create("style", { id: "favThemeCSS" }, `.favThemes .fav-theme-container {background: var(--color-foreground);}`);
    document.head.appendChild(favbg);
  }

  favarray.forEach((arr, index) => {
    arr.forEach((item) => {
      const favSongContainer = create("div", { class: "fav-theme-container", type: item.themeType });
      favSongContainer.innerHTML = `
        <div class="fa fa-sort sortFavSong"order=${index} title="${translate("$sort")}"></div>
        <div class="fa fa-x removeFavSong" order=${index} title="${translate("$remove")}""></div>
        <div class="fav-theme-inner">
        <a href='https://myanimelist.net/anime/${item.animeUrl}/'>
        ${`<img src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${
          item.animeImage ? item.animeImage : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif"
        }" class="anime-image lazyload" alt="${item.animeTitle}">`}</a>
        <div class="fav-theme-header">
        <h2>${item.animeTitle}</h2>
        <a class="favThemeSongTitle" style="cursor:pointer">${item.songTitle.replace(/(\(eps \d.*\))/, "")}</a>
        </div></div>
        <div class="video-container">
        <video controls>
        <source src="${item.songSource}" type="video/webm">
        Your browser does not support the video tag.
        </video>
        </div>
        `;
      FavContent.appendChild(favSongContainer);
    });
  });

  FavContent.append(opGroup, edGroup);

  const favThemes = document.querySelector(".favThemes");
  const animeContainers = favThemes.querySelectorAll(".fav-theme-container");

  animeContainers.forEach((container) => {
    const type = container.getAttribute("type");
    if (type === "OP") {
      opGroup.appendChild(container);
      if ($(opGroup).children().length === 1) {
        $(opGroup).before(`<h5>Openings</h5>`);
      }
    } else if (type === "ED") {
      edGroup.appendChild(container);
      if ($(edGroup).children().length === 1) {
        $(edGroup).before(`<h5>Endings</h5>`);
      }
    }
  });
  function toggleShowMore(groupSelector) {
    let limit = svar.modernLayout ? 5 : 6;
    const accordionButton = create(
      "a",
      { class: "anisong-accordion-button", id: `${groupSelector}-accordion-button`, style: { display: "none" } },
      '<i class="fas fa-chevron-down mr4"></i>\nShow More\n'
    );
    if ($(`#${groupSelector}-accordion-button`).length === 0) {
      $(`#${groupSelector}`).append(accordionButton);
    }

    if ($(`#${groupSelector} .fav-theme-container`).length > limit) {
      $(`#${groupSelector} .fav-theme-container`).slice(limit).hide();
      $(`#${groupSelector}-accordion-button`).show();
    }
    $(`#${groupSelector}-accordion-button`).on("click", function () {
      var isVisible = $(`#${groupSelector} .fav-theme-container`).slice(limit).is(":visible");
      if (isVisible) {
        $(`#${groupSelector} .fav-theme-container`).slice(limit).slideUp();
        $(this).html('<i class="fas fa-chevron-down mr4"></i> Show More');
      } else {
        $(`#${groupSelector} .fav-theme-container`).slice(limit).slideDown();
        $(this).html('<i class="fas fa-chevron-up mr4"></i> Show Less');
      }
    });
  }
  toggleShowMore("op-group");
  toggleShowMore("ed-group");
  async function replaceFavSongs() {
    const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
    const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
    const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
    const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
    await editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceFavSong");
    sortItem1 = null;
    sortItem2 = null;
  }
  //Sort Favorite Song click function
  document.querySelectorAll(".sortFavSong").forEach((element) => {
    element.addEventListener("click", function () {
      const order = this.getAttribute("order");
      if (sortItem1 === null) {
        sortItem1 = order;
        $(".sortFavSong").addClass("hidden");
        $(this).addClass("selected");
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").removeClass("hidden");
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").show();
      } else if (sortItem2 === null) {
        sortItem2 = order;
        if (sortItem2 !== sortItem1) {
          replaceFavSongs();
        }
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").hide();
        $(".sortFavSong").removeClass("hidden").removeClass("selected");
      }
      if (sortItem1 === sortItem2) {
        sortItem1 = null;
        sortItem2 = null;
      }
    });
  });
  //Remove Favorite Song click function
  $(".removeFavSong").on("click", function () {
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    editAboutPopup(`favSongEntry/${base64url}/`, "removeFavSong");
  });

  //Favorite Song Title click function
  $(".favThemeSongTitle").on("click", function () {
    if (!svar.modernLayout) {
      const title = $(this).prev();
      title.css("white-space", title.css("white-space") === "nowrap" || title.css("white-space") === "nowrap" ? "normal" : "nowrap");
      $(this).css("white-space", $(this).css("white-space") === "nowrap" || $(this).css("white-space") === "nowrap" ? "normal" : "nowrap");
    }
    const videoContainer = $(this).parent().parent().parent().children(".video-container");
    const currentDisplay = videoContainer.css("display");
    videoContainer.css("display", currentDisplay === "none" || currentDisplay === "" ? "block" : "none");
  });
  if (userNotHeaderUser) {
    $(".sortFavSong").remove();
    $(".removeFavSong").remove();
  }
}

// ==== profile_activityHistory.js ====
//Get Activity History from MAL and Cover Image from Jikan API
if (svar.actHistory) {
  const titleImageMap = {};
  let historyMain = create("div", { class: "user-history-main", id: "user-history-div" });
  if (document.querySelector("#statistics")) {
    document.querySelector("#statistics").insertAdjacentElement("beforeend", historyMain);
  }
  async function gethistory(l, item) {
    let title, titleText, ep, date, datenew, id, url, type, historylink, historyimg, oldimg;
    let wait = 666;
    let c = l ? l - 12 : 0;
    let length = l ? l : 12;
    let head = create("h2", { class: "mt16" }, "Activity");
    const loading = create("div", { class: "user-history-loading actloading" }, translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>');
    if (!l) {
      const html = await fetch("https://myanimelist.net/history/" + username)
        .then((response) => response.text())
        .then(async (data) => {
          let newDocument = new DOMParser().parseFromString(data, "text/html");
          item = newDocument.querySelectorAll("#content > div.history_content_wrapper > table > tbody > tr > td.borderClass:first-child");
        });
    }

    length = item.length < length ? item.length : length;
    historyMain.insertAdjacentElement("afterend", loading);

    for (let x = c; x < length; x++) {
      if (x === 0) {
        head.style.marginLeft = "5px";
        historyMain.appendChild(head);
      }
      type = item[x].querySelector("a").href.split(".")[1].split("/")[1];
      url = item[x].querySelector("a").href;
      const urlFix = new URL(url);
      const urlId = urlFix.searchParams.get("id");
      if (urlId) {
        const type = urlFix.pathname.includes("anime") ? "anime" : "manga";
        url = `/${type}/${urlId}/`;
      }
      id = item[x].querySelector("a").href.split("=")[1];
      title = item[x].querySelector("a").outerHTML;
      titleText = item[x].querySelector("a").innerText.trim();
      ep = item[x].querySelector("strong").innerText;
      date = item[x].parentElement.children[1].innerText.split("Edit").join("").trim();
      datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
      date = datenew ? date : /\b\d{4}\b/.test(date) ? date : date + " " + new Date().getFullYear();
      let dat = create("div", { class: "user-history" });
      let name = create("div", { class: "user-history-title" });
      let timestamp = new Date(date).getTime();
      const timestampSeconds = Math.floor(timestamp / 1000);
      let historydate = create("div", { class: "user-history-date", title: date }, datenew ? date : nativeTimeElement(timestampSeconds));
      let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
      if (type === "anime") {
        name.innerHTML = `Watched episode ${ep} of <a href="${url}">${titleText}</a>`;
      } else {
        apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
        name.innerHTML = `Read chapter ${ep} of <a href="${url}">${titleText}</a>`;
      }

      // Image retrieval function
      async function getimg(url) {
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            oldimg = data.data?.images ? data.data.images.jpg.image_url : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c";
            titleImageMap[title] = oldimg; // Map the title to the image
          });
      }

      // Check if the title already exists in the map
      if (titleImageMap[title]) {
        oldimg = titleImageMap[title];
        historylink = create("a", { class: "user-history-cover-link", href: url });
        historyimg = create("img", { class: "user-history-cover lazyload", alt: titleText, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: oldimg });
        wait = 99; // If already exists, reduce wait time
      } else {
        wait = 999; // If new title, increase wait time
        await getimg(url);
        historylink = create("a", { class: "user-history-cover-link", href: url });
        historyimg = create("img", { class: "user-history-cover lazyload", alt: titleText, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: oldimg });
      }
      historylink.append(historyimg);
      dat.append(historylink, name);
      dat.append(historydate);
      historyMain.appendChild(dat);
      await loadCustomCover(1);
      await delay(wait);
    }
    loading.remove();
    if (item.length > length) {
      let loadmore = create("div", { class: "loadmore" }, "Load More");
      loadmore.onclick = () => {
        gethistory(length + 12, item);
        loadmore.remove();
      };
      historyMain.appendChild(loadmore);
    }
  }
  if (document.querySelector("#statistics")) {
    gethistory();
  }
}

// ==== profile_addMoreFavs.js ====
// Add More Favorites
async function addMoreFavs(storeType) {
  try {
    const moreFavsLocalForage = localforage.createInstance({
      name: "MalJS",
      storeName: "moreFavs_" + storeType,
    });

    const dataKey = pageIsCompany ? `${location.pathname.split("/")[3]}-${location.pathname.split("/")[2].toUpperCase()}` : `${entryId}-${entryType}`;
    const dataType = pageIsCompany ? "COMPANY" : entryType;
    const dataInfoType = document.querySelector("span.information.type")?.textContent || "";
    const dataInfoYear = document.querySelector("span.information.season")?.textContent.split(" ")[1] || "";

    let moreFavsCache = await moreFavsLocalForage.getItem(dataKey);
    const favButton = document.querySelector("#favOutput");

    if (!favButton) {
      throw new Error("Favorite button not found");
    }

    // Change Favorite Text
    const isFavoriteData = $("#v-favorite").attr("data-favorite")?.includes('isFavorite":true,');
    if (!isFavoriteData) {
      const isFavorite = moreFavsCache !== null;
      if (isFavorite) $("#favOutput").text("Remove from Favorites");
    }
    // Get default image
    const defaultImg = pageIsCompany ? document.querySelector(".logo img") : document.querySelector("div:nth-child(1) > a > img");

    // Format character title
    const characterTitle = $(".title-name")
      .text()
      .replace(/\(.*\)/, "")
      .replace(/\".*\"/, "")
      .trim()
      .replace(/"[^"]*"\s*/, "")
      .split(/\s+/);

    const formattedCharacterTitle = [characterTitle.reverse().join(", "), characterTitle.reverse().join(" ")];

    // Wait for Favorite Data
    async function waitForFavoriteDiv(selector, interval = 250, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
          const element = $(selector);
          if (element.length && element.is(":visible")) {
            clearInterval(checkInterval);
            resolve(element);
          } else if (Date.now() - startTime > timeout) {
            clearInterval(checkInterval);
            reject(new Error(`Timeout waiting for ${selector}`));
          }
        }, interval);
      });
    }

    // Update Fav Text
    async function updateFavText(isFavorite, maxAttempts = 10) {
      try {
        const favDiv = await waitForFavoriteDiv("#v-favorite > div");
        $("#favOutput").text(isFavorite ? "Remove from Favorites" : "Add to Favorites");
        let attempts = 0;
        const updateMessage = () => {
          attempts++;
          const currentText = favDiv.text().trim();
          if (currentText.startsWith("Only") || !currentText.includes("Mal-Clean:")) {
            favDiv.text(`Mal-Clean: ${isFavorite ? "Added Successfully" : "Removed Successfully"}`);
            return true;
          }
          return false;
        };

        // Try immediately
        if (updateMessage()) return;

        // Retry with interval if needed
        return new Promise((resolve) => {
          const intervalId = setInterval(() => {
            if (updateMessage() || attempts >= maxAttempts) {
              clearInterval(intervalId);
              resolve();
            }
          }, 250);
        });
      } catch (error) {
        console.error("Error updating favorite UI:", error);
      }
    }

    favButton.addEventListener("click", async () => {
      try {
        $("#v-favorite").css("pointerEvents", "none");
        await waitForFavoriteDiv("#v-favorite > div");
        const isCurrentlyFavorite = $("#favOutput").text().trim() === "Add to Favorites";
        const favDivText = $("#v-favorite > div").text().trim();
        const maxFavCheck = favDivText.startsWith("Only");
        if (maxFavCheck) {
          if (isCurrentlyFavorite) {
            // Add to favorites
            const favData = {
              key: dataKey,
              title: storeType === "character" ? formattedCharacterTitle : entryTitle,
              type: storeType === "character" ? "CHARACTERS" : dataType,
              dataType: dataInfoType,
              dataYear: dataInfoYear,
              source: storeType === "character" ? $("#content > table > tbody > tr > td.borderClass > table").find("a").eq(1).text() : entryTitle,
              url: location.pathname,
              defaultImage: moreFavsCache?.defaultImage || defaultImg?.src?.replace(/\.\w+$/, "").replace("https://cdn.myanimelist.net/images/", "") || "",
              defaultImageSrc: moreFavsCache?.defaultImageSrc || defaultImg?.src,
            };
            await moreFavsLocalForage.setItem(dataKey, favData);
            await updateFavText(true);
          } else {
            // Remove from favorites
            await moreFavsLocalForage.removeItem(dataKey);
            await updateFavText(false);
          }

          if (svar.moreFavsMode) {
            const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character", "moreFavs_people", "moreFavs_company");
            await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
          }
        }
        $("#v-favorite").css("pointerEvents", "");
      } catch (error) {
        console.error("Error in favorite button click handler:", error);
      }
    });
  } catch (error) {
    console.error("Error in addMoreFavs:", error);
  }
}

// Load More Favorites
async function loadMoreFavs(force = "0", storeType = "character", aboutData = null) {
  function processFavItem(value, storeType) {
    const titleText = storeType === "character" ? value.title[0] : value.title;
    const container = create("li", { class: "btn-fav", title: titleText });
    const link = create("a", { class: "link bg-center", href: value.url });
    const title = create("span", { class: "title fs10" }, titleText);
    let typeText = value.type?.toLowerCase();
    typeText = typeText === "characters" ? "character" : typeText;
    const dataInfo = value.dataType && value.dataYear ? value.dataType + " ･ " + value.dataYear : value.type.charAt(0).toUpperCase() + value.type.slice(1).toLowerCase();
    const boxlistDetails = typeText === "character" ? value.source : dataInfo;
    const boxListText = boxlistDetails !== "People" && boxlistDetails !== "Company" ? boxlistDetails : "";
    let type = create("span", { class: "users" }, boxListText);
    if (isMainProfilePage) typeText = typeText === "people" ? "person" : typeText;
    const img = create("img", { class: "image lazyload", src:"https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: value.defaultImageSrc, width: "70", height: typeText === "company" ? "70" : "110", border: "0", alt: value.title[0] });
    boxListText ? link.append(title, type, img) : link.append(title, img);
    container.append(link);
    let parent = $(`#${typeText}_favorites .fav-slide`).length ? $(`#${typeText}_favorites .fav-slide`) : $(`.favs.${typeText}`);
    if (parent) parent.append(container);
    if (location.pathname === `/profile/${username}/favorites`) {
      const boxlist = `<div class="boxlist col-4">
      <div class="di-tc">
      <a href="${value.url}"><img class="image profile-w48 lazyload" src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${value.defaultImageSrc}" alt="${titleText}"></a>
      </div>
      <div class="di-tc va-t pl8 data">
      <div class="title"><a href="${value.url}">${titleText}</a></div>
      <div class="di-ib mt4 fn-grey2">${boxListText}</div>
      </div>
      </div>`;
      $(".container-right > div h5").each(function () {
        if ($(this).text().toLowerCase() === typeText) {
          $(this).next().append(boxlist);
        }
      });
    }
  }
  function processFavs(dataArray, storeType) {
    dataArray.forEach((value) => processFavItem(value, storeType));
  }
  if (!loadingMoreFavorites || force !== "0") {
    let moreFavsLocalForage = await localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
    if (Array.isArray(aboutData)) {
      processFavs(aboutData, storeType);
    } else {
      await moreFavsLocalForage.iterate((value) => {
        processFavItem(value, storeType);
      });
    }
    loadingMoreFavorites = 1;
  }
}

//Default Favs Slider Fix
if (pageIsProfile) {
  $(".fav-slide-block.mb12").each(function () {
    let text = $(this).prev().text();
    let count = $(this).find("ul").children().length;
    $(this)
      .prev()
      .text(text.replace(/\((.*)\)/, `(${count})`));
  });
  // favorites slider
  const hasTouchEvent = "ontouchstart" in window;
  const favSlider = function (selectorName) {
    const $favSlideBlock = $(`#${selectorName}.fav-slide-block`);
    if (!$favSlideBlock.length) return;

    let nowCount = 0;
    const sliderWidth = 800;
    const btnWidth = 40;
    const moveSlideNum = $favSlideBlock.find(".fav-slide").data("slide") || 4;
    const favW = $favSlideBlock.find(".fav-slide li.btn-fav").eq(0).outerWidth();
    const favCount = $favSlideBlock.find(".fav-slide li.btn-fav").length;
    const favWidth = favW + 8;
    const setSlideWidth = favWidth * (favCount + moveSlideNum);
    $favSlideBlock.find(".fav-slide").width(setSlideWidth);

    //button
    const $sliderBtnLeft = $favSlideBlock.find(".btn-fav-slide-side.left");
    const $sliderBtnRight = $favSlideBlock.find(".btn-fav-slide-side.right");
    $sliderBtnRight.css({ display: "block" });

    // hide button
    if (favCount < moveSlideNum + 1) {
      $sliderBtnLeft.hide();
      $sliderBtnRight.hide();
    } else if (!hasTouchEvent) {
      const hideBtnTimer = setInterval(function () {
        $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        clearInterval(hideBtnTimer);
      }, 1500);
    }
    $sliderBtnLeft.hide();
    // slide function
    const moveSlideFav = function (obj) {
      const direction = obj.direction;
      const $btnInner = obj.button;
      $btnInner.hide();

      if (direction == "right") {
        // slide limit
        const maxCount = favCount - parseInt(sliderWidth / favWidth);
        if (nowCount + moveSlideNum >= maxCount) {
          nowCount = maxCount;
          $sliderBtnRight.hide();
        } else {
          nowCount += moveSlideNum;
        }

        $favSlideBlock.find(".fav-slide").animate(
          {
            marginLeft: `${-1 * favWidth * nowCount}px`,
          },
          {
            duration: 500,
            easing: "swing",
            complete: function () {
              $btnInner.show();
              $sliderBtnLeft.show();
              if (nowCount != maxCount) {
                $sliderBtnRight.show();
              }
            },
          }
        );
      } else {
        // slide limit
        if (nowCount - moveSlideNum <= 0) {
          nowCount = 0;
          $sliderBtnLeft.hide();
        } else {
          nowCount -= moveSlideNum;
        }

        $favSlideBlock.find(".fav-slide").animate(
          {
            marginLeft: `${-1 * favWidth * nowCount}px`,
          },
          {
            duration: 500,
            easing: "swing",
            complete: function () {
              $btnInner.show();
              $sliderBtnRight.show();
              if (nowCount != 0) {
                $sliderBtnLeft.show();
              }
            },
          }
        );
      }
    };
    //click
    $sliderBtnLeft.find(".btn-inner").on("click", function (e) {
      const btn = {
        direction: "left",
        button: $(this),
      };
      moveSlideFav(btn);
    });
    $sliderBtnRight.find(".btn-inner").on("click", function (e) {
      const btn = {
        direction: "right",
        button: $(this),
      };
      moveSlideFav(btn);
    });

    // hover
    if (!hasTouchEvent) {
      $favSlideBlock
        .find(".fav-slide-outer")
        .on("mouseover", function () {
          $sliderBtnLeft.css({ left: 0, opacity: 1 });
          $sliderBtnRight.css({ right: 0, opacity: 1 });
        })
        .on("mouseout", function () {
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        });

      $sliderBtnLeft
        .on("mouseover", function () {
          $sliderBtnLeft.css({ left: 0, opacity: 1 });
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        })
        .on("mouseout", function () {
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        });

      $sliderBtnRight
        .on("mouseover", function () {
          $sliderBtnRight.css({ right: 0, opacity: 1 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        })
        .on("mouseout", function () {
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        });
    }
  };

  // set favorites slider
  if ($(".fav-slide-block")[0]) {
    const slideCount = $(".fav-slide-block").length;
    for (let i = 0; i < slideCount; i++) {
      const id = $(".fav-slide-block").eq(i).attr("id");
      favSlider(id);
    }
  }
}

// ==== profile_applyCustomColors.js ====
//Add Custom Profile Colors
async function applyCustomColors(customcolors) {
  let styleElement = document.getElementById("customProfileColors");
  const colorStyles = `
  .profile .statistics-updates .data .graph .graph-inner.watching, .profile .user-statistics .stats-status .circle.watching:after,
  .profile .user-statistics .stats-graph .graph.watching {background:${customcolors[0]}!important}
  .profile .statistics-updates .data .graph .graph-inner.completed, .profile .user-statistics .stats-status .circle.completed:after,
  .profile .user-statistics .stats-graph .graph.completed {background:${customcolors[1]}!important}
  .profile .statistics-updates .data .graph .graph-inner.on_hold, .profile .user-statistics .stats-status .circle.on_hold:after,
  .profile .user-statistics .stats-graph .graph.on_hold {background:${customcolors[2]}!important}
  .profile .statistics-updates .data .graph .graph-inner.dropped, .profile .user-statistics .stats-status .circle.dropped:after,
  .profile .user-statistics .stats-graph .graph.dropped {background:${customcolors[3]}!important}
  .profile .statistics-updates .data .graph .graph-inner.plan_to_watch, .profile .user-statistics .stats-status .circle.plan_to_watch:after,
  .profile .user-statistics .stats-graph .graph.plan_to_watch {background:${customcolors[4]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.reading, .profile .user-statistics .stats-status .circle.reading:after,
  .profile .user-statistics .stats-graph .graph.reading {background:${customcolors[5]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.completed, .profile .user-statistics .stats-status .circle.manga.completed:after,
  .profile .user-statistics .stats-graph .graph.manga.completed {background:${customcolors[6]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.on_hold, .profile .user-statistics .stats-status .circle.manga.on_hold:after,
  .profile .user-statistics .stats-graph .graph.manga.on_hold {background:${customcolors[7]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.dropped, .profile .user-statistics .stats-status .circle.manga.dropped:after,
  .profile .user-statistics .stats-graph .graph.manga.dropped {background:${customcolors[8]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.plan_to_read, .profile .user-statistics .stats-status .circle.manga.plan_to_read:after,
  .profile .user-statistics .stats-graph .graph.plan_to_read {background:${customcolors[9]}!important}
  .profile #profile-stats-anime-genre-table table .list-item .data.ratio > div .mal-progress .mal-progress-bar.primary{background:${customcolors[10]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[0]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[1]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[2]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[3]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[5]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[6]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[7]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[8]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[0]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[1]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[2]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[3]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[5]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[6]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[7]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[8]}!important}
  .profile #myanimelist li.btn-fav .title.fs10{color:${customcolors[10]}!important}
  #myanimelist #horiznav_nav.profile-nav > ul > li > a.navactive,#myanimelist .user-function .icon-user-function:not(.disabled) i,
  #myanimelist a:not(.user-function.mb8 a):not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-profile-link):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a),
  #myanimelist a:visited:not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a) {color:${
    customcolors[10]
  }!important;}
  .loadmore:hover, .favThemes .fav-theme-container .sortFavSong:hover, .favThemes .fav-theme-container .removeFavSong:hover,
  #myanimelist #header-menu > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,#myanimelist #menu > #menu_left > #nav > li > a:hover,#myanimelist .header-list-button .icon:hover,
  #myanimelist .header-notification-dropdown .header-notification-dropdown-inner .header-notification-item > .inner.is-read .header-notification-item-header .category,
  #myanimelist a:not(.user-function.mb8 a):not(.icon-team-title):not(.header-profile-link):hover,.header-list .header-list-dropdown ul li a:hover,.header-profile-dropdown.color-pc-constant ul li a:hover,
  .page-common #nav.color-pc-constant li a:hover,.profile #myanimelist #header-menu ul > li > a:hover,#myanimelist > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,
  #myanimelist #top-search-bar.color-pc-constant #topSearchButon:hover,#myanimelist .header-message-button:hover .icon,#myanimelist .header-notification-button:hover .icon,
  #myanimelist #menu #topSearchText:hover:not(:focus-within) + #topSearchButon i:before,.dark-mode .profile #myanimelist #menu #nav ul a:hover,#myanimelist #horiznav_nav.profile-nav > ul > li > a:hover,
  .profile #myanimelist #menu #nav ul a:hover {
  color:${tinycolor(customcolors[10]).brighten(25)}!important;}
  span.di-ib.po-r{color:${customcolors[11]}!important}`;
  if (!styleElement) {
    styleElement = create("style", { id: "customProfileColors" });
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = colorStyles.replace(/\n/g, "");
}

// ==== profile_changeForeground.js ====
async function changeForeground(color) {
  let cArr = [
    `--fg: ${color}!important;`,
    `--fg2: ${tinycolor(color).brighten(3)}!important;`,
    `--fg4: ${tinycolor(color).brighten(6)}!important;`,
    `--fgOP: ${color}!important;`,
    `--fgOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--bg: ${tinycolor(color).darken(3)}!important;`,
    `--bgo: ${tinycolor(color).setAlpha(0.8).toRgbString()}!important;`,
    `--color-background: ${tinycolor(color).darken(3)}!important;`,
    `--color-backgroundo: ${tinycolor(color).setAlpha(0.8).toRgbString()}!important;`,
    `--color-foreground: ${color}!important;`,
    `--color-foreground2: ${tinycolor(color).brighten(3)}!important;`,
    `--color-foreground3: ${tinycolor(color).brighten(4)}!important;`,
    `--color-foreground4: ${tinycolor(color).brighten(6)}!important;`,
    `--color-foregroundOP: ${color}!important;`,
    `--color-foregroundOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--border-color: ${tinycolor(color).brighten(8)}!important;`,
  ];
  if (svar.modernLayout) {
    await delay(200);
    $("style").each(function () {
      let styleContent = $(this).html();
      if (styleContent.includes("--fg:")) {
        let updatedStyle = styleContent
          .replace(/--fg:\s*[^;]+;/g, cArr[0])
          .replace(/--fg2:\s*[^;]+;/g, cArr[1])
          .replace(/--fg4:\s*[^;]+;/g, cArr[2])
          .replace(/--fgOP:\s*[^;]+;/g, cArr[3])
          .replace(/--fgOP2:\s*[^;]+;/g, cArr[4])
          .replace(/--bg:\s*[^;]+!important;/g, cArr[5])
          .replace(/--bgo:\s*[^;]+!important;/g, cArr[6])
          .replace(/--color-background:\s*[^;]+!important;/g, cArr[7])
          .replace(/--color-backgroundo:\s*[^;]+!important;/g, cArr[8])
          .replace(/--color-foreground:\s*[^;]+!important;/g, cArr[9])
          .replace(/--color-foreground2:\s*[^;]+!important;/g, cArr[10])
          .replace(/--color-foreground3:\s*[^;]+!important;/g, cArr[11])
          .replace(/--color-foreground4:\s*[^;]+!important;/g, cArr[12])
          .replace(/--color-foregroundOP:\s*[^;]+!important;/g, cArr[13])
          .replace(/--color-foregroundOP2:\s*[^;]+!important;/g, cArr[14])
          .replace(/--border-color:\s*[^;]+!important;/g, cArr[15]);
        $(this).html(updatedStyle);
      }
    });

    let customColors = `:root, body {${cArr.join("\n")}}
    .dark-mode .page-common #headerSmall,.page-common #headerSmall,html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper,.dark-mode .page-common #content
    {background-color: var(--color-background)!important}
    #currently-popup, .malCleanMainHeader, .malCleanMainContainer,
    #currently-popup .dataTextButton,.mainbtns,
    html .page-common .incrementalSearchResultList .list,
    html .page-common .incrementalSearchResultList,
    .dark-mode .profile.statistics .content-container .container-right .chart-wrapper>.filter,.dark-mode .mal-alert,.dark-mode .mal-alert.danger,.dark-mode .profile.statistics .chart-container-rf .right .filter,
    .dark-mode .mal-alert.secondary,.dark-mode .sceditor-container,.dark-mode .head-config,.dark-mode .profile .navi .tabs .btn-tab,.dark-mode .profile .boxlist-container .boxlist,
    .dark-mode .sceditor-container iframe,.dark-mode .sceditor-container textarea,.dark-mode .user-profile .user-status li,.dark-mode .user-profile .user-status li:nth-of-type(even),
    .profile.statistics .content-container .container-right .chart-wrapper>.filter,.mal-alert,.mal-alert.danger,.profile.statistics .chart-container-rf .right .filter,.mal-alert.secondary,
    .sceditor-container,.head-config,.profile .navi .tabs .btn-tab,.profile .boxlist-container .boxlist,.sceditor-container iframe, .sceditor-container textarea,.user-profile .user-status li,
    .user-profile .user-status li:nth-of-type(even),.dark-mode .page-common #footer-block, .page-common #footer-block,.page-common ul#nav ul li a,
    .dark-mode .page-common .header-profile .header-profile-dropdown ul li a,.page-common .header-profile .header-profile-dropdown ul li a,
     .header-list .header-list-dropdown ul li a,.dark-mode .page-common .header-notification-dropdown .arrow_box,.page-common .header-notification-dropdown .arrow_box
    {background: var(--color-foreground)!important}
    .dark-mode .mal-alert.primary,.dark-mode .profile .navi .tabs .btn-tab:hover, .dark-mode .profile .navi .tabs .btn-tab.on,.dark-mode .page-common .quotetext, .dark-mode .page-common .codetext,
    .dark-mode .mal-tabs a.item.active,.dark-mode div.sceditor-toolbar,.mal-alert.primary,.profile .navi .tabs .btn-tab:hover, .profile .navi .tabs .btn-tab.on,.page-common .quotetext, .page-common .codetext,
    .mal-tabs a.item.active,div.sceditor-toolbar,.dark-mode .page-common #menu,.page-common #menu
    {background: 0!important}
    .page-common .content-container * {border-color:var(--border-color)!important}
    .dark-mode .page-common #searchBar.searchBar #topSearchText,.page-common #searchBar.searchBar #topSearchText
    {border-left: var(--border-color) 1px solid;}
    html .page-common .incrementalSearchResultList .list.separator,
    html .page-common .incrementalSearchResultList .list.focus,
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,
    .dark-mode .page-common #searchBar.searchBar #topSearchValue,.page-common #searchBar.searchBar #topSearchValue,.user-profile .user-button .btn-profile-submit,.dark-mode .page-common .btn-form-submit,
    .page-common .btn-form-submit,.dark-mode .page-common #topSearchText, .page-common #topSearchText
    {background-color: var(--color-foreground2) !important;}
    .dark-mode body:not(.ownlist) input, .dark-mode body:not(.ownlist) textarea, .dark-mode body:not(.ownlist) select,
    body:not(.ownlist) input, body:not(.ownlist) textarea, body:not(.ownlist) select,
    html .page-common #top-search-bar.color-pc-constant .incrementalSearchResultList .list.list-bottom,
    .dark-mode .page-common .header-notification-item:hover,.page-common .header-notification-item:hover
    {background-color: var(--color-foreground4) !important;}
    html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper
    {padding: 10px 0 0 0!important;}
    .dark-mode .page-common .header-notification-dropdown, .page-common .header-notification-dropdown,
    #nav > li > a, #menu #menu_left #nav li ul,.page-common .header-profile.link-bg,.page-common .header-profile .header-profile-dropdown.color-pc-constant,
    .page-common .header-profile .header-profile-dropdown,.dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant,.page-common .header-list .header-list-dropdown.color-pc-constant
    {background:0 0!important}
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,
    .dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,.page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,
    .dark-mode .page-common #nav.color-pc-constant ul a:hover,.page-common #nav.color-pc-constant ul a:hover,.dark-mode .page-common .header-profile .header-profile-dropdown ul li a:hover,
    .dark-mode .page-common .header-profile ul li a:hover, .page-common .header-profile ul li a:hover
    {color:#bbb!important;}`;
    customColors = customColors.replace(/\n/g, "");
    styleSheet.innerText = styles + customColors + defaultCSSFixes;
    document.head.appendChild(styleSheet);
  }
}

// ==== profile_commentRedesign.js ====
async function newProfileComments(profile) {
  let mainCont = profile ? $("#lastcomment") : $("#content");
  if (profile) {
    mainCont.css("max-width", "818px");
  } else {
    $('#content div:not(.borderClass):contains("Pages ")').hide();
  }
  let currPage = 1;
  let oldprofileLinkArray = [];
  let addedComCount = 0;
  const loading = create("div", { class: "user-history-loading actloading" }, translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>');

  function parseProfileHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const section = doc.querySelector("#message")?.outerHTML;
    const match = /uid:(\d+)/.exec(section);
    return match ? match[1] : null;
  }

  async function getProfileId(profileUrl) {
    try {
      const response = await fetch(profileUrl);
      const html = await response.text();
      return parseProfileHTML(html);
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function getNextComments(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function fetchAndUpdateComments(element, url, newCommentsContainer, append = false) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const comments = Array.from(doc.querySelectorAll("div[id^=comBox] > table > tbody > tr")).reverse();
      let sender = $(doc).find("div[id^=com] > .dark_text a").last()[0];
      let receiver = doc.querySelector("#content > div.borderClass.com-box-header a:last-child");
      receiver.innerText = "@" + receiver.innerText.replace("'s Profile", "");
      let isNameMatch = receiver.innerText !== "@" + sender.innerText ? 0 : 1;
      comments.forEach((comment, index) => {
        $(comment).find(".picSurround").addClass("image").find("img").css("height", "55px");
        if (!append && index === 0) {
          if (!isNameMatch) {
            $(comment).find(".spaceit").prepend(receiver, "<br>");
          }
          if (profile) {
            $(comment).find("div[id^=com]").first().css({ display: "inline-block", width: "calc(100% - 100px)" });
            $(comment).find(".picSurround").css({ display: "inline-block" });
          }
          element.innerHTML = comment.innerHTML;
        } else {
          newCommentsContainer.appendChild(comment.cloneNode(true));
        }
      });

      // Create a “Load More” button if there is a “Prev” link
      const prevLink = $(doc).find('a:contains("Prev")').attr("href");
      if (prevLink) {
        await createLoadMoreButton(prevLink, newCommentsContainer, element, "child");
      }
      return comments.length;
    } catch (error) {
      console.error(`Could not retrieve comments: ${error}`);
    }
  }

  // Create a button to hide/show comments
  async function createToggleButton(newCommentsContainer, commentsCount) {
    if (commentsCount > 1) {
      const commCount = commentsCount - 1 === 29 ? "29+" : commentsCount - 1;
      const buttonDiv = create("div", { class: "newCommentsCommentButton" });
      const buttonLabel = create("span", { class: "commentButtonLabel" }, commCount);
      const button = create("a", { class: "commentButton fa fa-comment", style: { paddingRight: "5px", cursor: "pointer" } });
      buttonDiv.append(button, buttonLabel);
      button.addEventListener("click", () => {
        newCommentsContainer.style.display = newCommentsContainer.style.display === "none" ? "inline-block" : "none";
      });
      return buttonDiv;
    }
  }

  // Create load more button
  function createLoadMoreButton(url, newCommentsContainer, element, className) {
    let loadMoreButton = newCommentsContainer.querySelector(".newCommentsLoadMoreButton." + className);
    if (loadMoreButton) return;
    loadMoreButton = create("a", { class: "newCommentsLoadMoreButton " + className }, "Load More");
    loadMoreButton.addEventListener("click", async () => {
      mainCont.append(loading);
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";
      if (element) {
        await fetchAndUpdateComments(element, url, newCommentsContainer, true);
      } else {
        const doc = await getNextComments(url);
        if (doc) comToCom(url, doc);
      }
      loadMoreButton.disabled = false;
      loadMoreButton.remove();
    });
    newCommentsContainer.appendChild(loadMoreButton);
    if (profile) mainCont.append($('a.btn-form-submit:contains("All Comments")').parent());
  }

  // Main
  async function comToCom(url, doc) {
    url = url.replace(/&*show=\d*/g, "");
    const idIndex = url.indexOf("id=");
    let mainDelay = 500;
    if (idIndex === -1) return;
    const baseUrl = "/comtocom.php?id1=" + url.substring(idIndex + 3) + "&id2=";
    let isProfilePage = document.location.href.includes("profile");
    $("div[id^=comBox]").not(".newCommentsContainerMain").css("display", "none");
    if (doc) {
      let els = doc.querySelectorAll("div[id^=comBox]");
      for (const el of els) {
        el.style.display = "none";
        mainCont.append(el, profile ? $('a.btn-form-submit:contains("All Comments")').parent() : $('div[style="text-align: right;"]'));
      }
    }
    let elements = isProfilePage ? document.querySelectorAll("div[id^=comBox]") : document.querySelectorAll("div[id^=comBox] > table > tbody > tr");
    for (const el of elements) {
      if (!el.getAttribute("comActive")) {
        mainDelay = 500;
        let profileLink = isProfilePage ? el.querySelector(".image")?.href : el.querySelector(".picSurround > a")?.href;
        if (doc && profile) {
          profileLink = el.querySelector(".picSurround > a")?.href;
        }
        const elParent = profile ? $(el) : $(el).parent().parent().parent();
        elParent.css("display", "none");
        if (!profileLink) continue;
        if (oldprofileLinkArray.indexOf(profileLink) === -1) {
          oldprofileLinkArray.push(profileLink);
          const profileId = await getProfileId(profileLink);
          if (!profileId) continue;
          const commentsUrl = `${baseUrl}${profileId}&last=1`;
          const linkButton = create("a", { class: "newCommentsLinkButton fa fa-link", href: commentsUrl, target: "_blank" });
          const newCommentsContainer = create("div", { class: "newCommentsContainer", style: { display: "none", width: "100%" } });
          const commentsCount = await fetchAndUpdateComments(el, commentsUrl, newCommentsContainer);
          const toggleButton = await createToggleButton(newCommentsContainer, commentsCount);
          if (profile) elParent.addClass("comment-profile");
          if (toggleButton) {
            elParent.prepend(linkButton), elParent.append(toggleButton, newCommentsContainer);
          }
          mainCont.append(loading);
          elParent.find("div[id^=com]").first().css("min-height", "55px");
          elParent.addClass("comment newCommentsContainerMain");
          addedComCount++;
        } else {
          mainCont.children().remove("br");
          elParent.remove();
          mainDelay = 50;
        }
        el.setAttribute("comActive", "1");
        elParent.css("display", "");
        await delay(mainDelay);
      }
    }
    loading.remove();
    currPage += 1;
    let nextPage = $(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    if (doc) {
      nextPage = $(doc).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    } else if (currPage === 2 && profile) {
      let profileCount = await getNextComments(url);
      nextPage = $(profileCount).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    }
    if (nextPage) {
      await createLoadMoreButton(nextPage, mainCont[0], null, "parent");
    }
    if ($(".newCommentsLoadMoreButton.parent")[0]) {
      if (addedComCount < 6) {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "none";
        $(".newCommentsLoadMoreButton.parent")[0].click();
      } else {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "block";
        loading.remove();
        addedComCount = 0;
      }
    }
  }
  let comcomUrl = profile ? $('a:contains("All Comments")')?.attr("href") : location.href;
  let checkComBox = document.querySelectorAll("div[id^=comBox]");
  if (comcomUrl && checkComBox.length > 0) comToCom(comcomUrl);
}

// ==== profile_customCSS.js ====
async function findCustomCSS() {
  if (!customCSS) return;

  let customCSSData = Array.isArray(customCSS) ? customCSS[0] : customCSS;
  let customCSSModern = Array.isArray(customCSS) ? customCSS[1] : null;
  let customCSSMini = Array.isArray(customCSS) ? customCSS[2] : null;

  if (svar.customCSS && customCSSModern) {
    svar.autoModernLayout = false;
    svar.modernLayout = true;
    defaultMal = false;
  }

  if (svar.customCSS && !customCSSModern) {
    svar.autoModernLayout = true;
    svar.modernLayout = false;
    defaultMal = true;
  }

  if (customCSSData) {
    const styleElement = create(
      "style",
      { id: "customCSSFix" },
      `#currently-popup, .malCleanMainHeader, .malCleanMainContainer { background: #121212 !important;}
      #currently-popup .dataTextButton,.mainbtns {background-color: var(--color-foreground)!important;}`
    );

    document.head.appendChild(styleElement);
    if (!customCSSMini) {
      document.querySelectorAll("style").forEach((style) => {
        if (style.innerHTML.includes("--fg:") || style.innerHTML.includes("--color-foreground2:")) {
          style.innerHTML = "";
        }
      });
    }
  }

  if (styles) {
    let customCSSMain = create("style", { id: "customCSSMain" }, styles);
    document.head.appendChild(customCSSMain);
  }
  if (!customCSSMini) {
    if ($("html").hasClass("dark-mode")) {
      customCSSMain.innerText = styles + defaultColors + defaultCSSFixes;
      defaultMal = 1;
    } else {
      customCSSMain.innerText = styles + defaultColorsLight + defaultCSSFixes;
      defaultMal = 1;
    }
  } else {
    $("style#customCSSFix").remove();
  }

  function injectCustomCSS() {
    if (!customCSSData) return;

    if (customCSSData.match(/^https?:\/\/.*\.css$/)) {
      let cssLink = create("link", { rel: "stylesheet", type: "text/css", href: customCSS });
      document.head.appendChild(cssLink);
    } else if (customCSSData.length < 1e6) {
      let css = create("style", { id: "customCSS" }, customCSSData);
      document.head.appendChild(css);
    }
  }

  injectCustomCSS();
}

// ==== profile_findCustomAbout.js ====
async function findCustomAbout() {
  const aboutSection = document.querySelector(".user-profile-about.js-truncate-outer");
  const processAboutSection = async (aboutContent) => {
    const fgMatch = aboutContent.match(profileRegex.fg);
    const bgMatch = aboutContent.match(profileRegex.bg);
    const pfMatch = aboutContent.match(profileRegex.pf);
    const cssMatch = aboutContent.match(profileRegex.css);
    const badgeMatch = aboutContent.match(profileRegex.badge);
    const malBadgesMatch = aboutContent.match(profileRegex.malBadges);
    const colorMatch = aboutContent.match(profileRegex.colors);
    const favSongMatch = aboutContent.match(profileRegex.favSongEntry);
    const privateProfileMatch = aboutContent.match(profileRegex.privateProfile);
    const hideProfileElMatch = aboutContent.match(profileRegex.hideProfileEl);
    const customElMatch = aboutContent.match(profileRegex.customProfileEl);
    const moreFavsMatch = aboutContent.match(profileRegex.moreFavs);
    if (pfMatch) {
      const pfData = pfMatch[0].replace(profileRegex.pf, "$2");
      if (pfData && pfData !== "...") {
        try {
          custompf = decodeAndParseBase64(pfData, purifyConfigText);
          document.querySelector(".user-image.mb8 > img").setAttribute("src", custompf);
        } catch (error) {
          console.error("An error occurred while processing the custom profile avatar: ", error);
        }
      }
    }
    if (bgMatch) {
      const bgData = bgMatch[0].replace(profileRegex.bg, "$2");
      if (bgData && bgData !== "...") {
        try {
          custombg = decodeAndParseBase64(bgData, purifyConfigText);
          const customBgUrl = Array.isArray(custombg) ? custombg[0] : custombg;
          banner.setAttribute(
            "style",
            `background-color: var(--color-foreground); background: url(${customBgUrl}); background-position: 50% 35%; 
            background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
          );
          //bg Shadow
          if (Array.isArray(custombg) && custombg[1]) {
            shadow.setAttribute("style", `background: linear-gradient(180deg,rgba(${custombg[1]},0) 40%,rgba(${custombg[1]},.6)); height: 100%;left: 0;position: absolute;top: 0;width: 100%;`);
          }
          customModernLayoutFounded = 1;
        } catch (error) {
          console.error("An error occurred while processing the custom profile banner: ", error);
        }
      }
    }
    if (badgeMatch) {
      const badgeData = badgeMatch[0].replace(profileRegex.badge, "$2");
      if (badgeData && badgeData !== "...") {
        try {
          custombadge = decodeAndParseBase64(badgeData, purifyConfig);
          if (Array.isArray(custombadge) && custombadge[0].length > 1) {
            const badgeDiv = create("div", { class: "maljsProfileBadge" });
            badgeDiv.innerHTML = custombadge[0];
            if (custombadge[1] === "loop") {
              $(badgeDiv).addClass("rainbow");
            } else {
              badgeDiv.style.background = custombadge[1];
            }
            container.append(badgeDiv);
            customModernLayoutFounded = 1;
          }
        } catch (error) {
          console.error("An error occurred while processing the custom badge: ", error);
        }
      }
    }
    if (cssMatch) {
      const cssData = cssMatch[0].replace(profileRegex.css, "$2");
      if (cssData && cssData !== "...") {
        try {
          customCSS = decodeAndParseBase64(cssData, purifyConfigText);
          if (svar.customCSS) {
            await findCustomCSS();
          }
        } catch (error) {
          console.error("An error occurred while processing the custom css: ", error);
        }
      }
    }
    if (customModernLayoutFounded) {
      svar.modernLayout = !svar.autoModernLayout;
    }
    if (svar.customCSS && Array.isArray(customCSS)) {
      svar.modernLayout = !!customCSS[1];
    }

    if (colorMatch && svar.modernLayout) {
      const colorData = colorMatch[0].replace(profileRegex.colors, "$2");
      if (colorData !== "...") {
        try {
          customcolors = decodeAndParseBase64(colorData, purifyConfigText);
          await applyCustomColors(customcolors);
        } catch (error) {
          console.error("An error occurred while processing the custom profile color: ", error);
        }
      }
    }
    if (privateProfileMatch) {
      const privateData = privateProfileMatch[0].replace(profileRegex.privateProfile, "$2");
      if (privateData && privateData !== "...") {
        try {
          privateProfile = decodeAndParseBase64(privateData, purifyConfigText);
          privateButton.classList.toggle("btn-active-def", privateProfile);
          applyPrivateProfile();
        } catch (error) {
          console.error("An error occurred while processing the private profile:", error);
        }
      } else {
        removePrivateButton.classList.toggle("btn-active-def", 1);
      }
    }
    if (hideProfileElMatch) {
      const hideProfileElData = hideProfileElMatch[0].replace(profileRegex.hideProfileEl, "$2");
      if (hideProfileElData !== "...") {
        try {
          hiddenProfileElements = decodeAndParseBase64(hideProfileElData, purifyConfigText);
          applyHiddenDivs();
        } catch (error) {
          console.error("An error occurred while processing the hide profile elements:", error);
        }
      }
    }
    if (moreFavsMatch) {
      const moreFavsData = moreFavsMatch[0].replace(profileRegex.moreFavs, "$2");
      if (moreFavsData && moreFavsData !== "...") {
        try {
          const moreFavsDecompressed = decodeAndParseBase64(moreFavsData, purifyConfig);

          // Null check
          const safeGetValues = (obj) => (obj && typeof obj === "object" && !Array.isArray(obj) ? Object.values(obj) : []);
          const animanga = safeGetValues(moreFavsDecompressed?.moreFavs_anime_manga);
          const character = safeGetValues(moreFavsDecompressed?.moreFavs_character);
          const people = safeGetValues(moreFavsDecompressed?.moreFavs_people);
          const company = safeGetValues(moreFavsDecompressed?.moreFavs_company);

          if (!userNotHeaderUser) {
            if (svar.moreFavsMode) {
              if (animanga.length) await replaceLocalForageDB("moreFavs_anime_manga", animanga);
              if (character.length) await replaceLocalForageDB("moreFavs_character", character);
              if (people.length) await replaceLocalForageDB("moreFavs_people", people);
              if (company.length) await replaceLocalForageDB("moreFavs_company", company);
              await loadMoreFavs(1, "character");
              await loadMoreFavs(1, "anime_manga");
              await loadMoreFavs(1, "people");
              await loadMoreFavs(1, "company");
            }
          } else {
            if (animanga.length) await loadMoreFavs(1, "anime_manga", animanga);
            if (character.length) await loadMoreFavs(1, "character", character);
            if (people.length) await loadMoreFavs(1, "people", people);
            if (company.length) await loadMoreFavs(1, "company", company);
          }
        } catch (error) {
          console.error("An error occurred while processing the moreFavs:", error);
        }
      }
    } else {
      if (svar.moreFavs && !userNotHeaderUser) {
        await loadMoreFavs(1, "character");
        await loadMoreFavs(1, "anime_manga");
        await loadMoreFavs(1, "people");
        await loadMoreFavs(1, "company");
      }
    }
    if (fgMatch) {
      const fgData = fgMatch[0].replace(profileRegex.fg, "$2");
      if (fgData && fgData !== "...") {
        try {
          customfg = decodeAndParseBase64(fgData, purifyConfigText);
          await changeForeground(customfg);
        } catch (error) {
          console.error("An error occurred while processing the hide custom foreground color:", error);
        }
      }
    }
    if (malBadgesMatch) {
      const malBadgesData = malBadgesMatch[0].replace(profileRegex.malBadges, "$2");
      if (malBadgesData !== "..." && isMainProfilePage) {
        try {
          malBadgesUrl = decodeAndParseBase64(malBadgesData, purifyConfigText);
          if (malBadgesUrl) malBadgesUrl += malBadgesUrl.endsWith("?detail") ? "&malbadges" : "?malbadges";
          await getMalBadges(malBadgesUrl);
        } catch (error) {
          console.error("An error occurred while processing the hide custom mal-badges:", error);
        }
      }
    }
    if (favSongMatch) {
      if (isMainProfilePage) {
        try {
          await buildFavSongs(aboutContent);
        } catch (error) {
          console.error("An error occurred while processing the hide custom fav songs", error);
        }
      }
    }
    if (customElMatch) {
      if (isMainProfilePage) {
        try {
          await buildCustomElements(aboutContent);
        } catch (error) {
          console.error("An error occurred while processing the hide custom elements", error);
        }
      }
    }
  };

  // Find profile about and processAboutSection
  if (aboutSection && aboutSection.innerHTML.match(profileRegex.malClean)) {
    await processAboutSection(aboutSection.innerHTML);
    settingsFounded = 1;
  } else if (!settingsFounded) {
    const profileData = await fetchCustomAbout(processProfilePage);
    if (profileData) await processAboutSection(profileData);
  }
}

// ==== profile_modernLayout.js ====
async function applyModernLayout() {
  if (svar.modernLayout) {
    //CSS Fix for Modern Profile Layout
    let fixstyle = `
    .page-common #horiznav_nav.profile-nav > ul > li > a:not(.navactive){color: var(--color-main-text-light)!important;background:0!important}
    .page-common #horiznav_nav.profile-nav > ul > li > a.navactive,.page-common #horiznav_nav.profile-nav > ul > li > a:hover{color:  var(--color-link)!important;background:0!important}
    .maljsNavBtn{background: var(--color-foreground);border-radius: 5px;cursor: pointer;display: inline-block;padding: 10px!important;text-align: center;}
    .maljsProfileBadge{background: var(--color-foreground);-webkit-border-radius: 4px;border-radius: 5px;color: #e9e9e9;font-weight:600;
    display: inline-block;margin-left: 10px;padding: 10px;text-align: center;-webkit-transition: .3s;-o-transition: .3s;transition: .3s;position: absolute;
    bottom: 60px;right: -56px;max-width: 300px;max-height: 150px;overflow: hidden;}
    .maljsProfileBadge > * {width: auto; height: auto}
    .rainbow{-webkit-animation-duration: 20s;animation-duration: 20s;-webkit-animation-iteration-count: infinite;animation-iteration-count: infinite;
    -webkit-animation-name: rainbow;animation-name: rainbow;-webkit-animation-timing-function: ease-in-out;animation-timing-function: ease-in-out;cursor: default;}
    @keyframes rainbow{0%{background:rgb(0 105 255 / .71)}10%{background:rgb(100 0 255 / .71)}20%{background:rgb(255 0 139 / .71)}30%{background:rgb(255 0 0 / .71)}
    40%{background:rgb(255 96 0 / .71)}50%{background:rgb(202 255 0 / .71)}60%{background:rgb(0 255 139 / .71)}70%{background:rgb(202 255 0 / .71)}
    80%{background:rgb(255 96 0 / .71)}85%{background:rgb(255 0 0 / .71)}90%{background:rgb(255 0 139 / .71)}95%{background:rgb(100 0 255 / .71)}to{background:rgb(0 105 255 / .71)}}
    .l-listitem-3_2_items{margin-right:0}
    .l-listitem-list.row1{margin-right: 0px;margin-left: -46px}
    .l-listitem-list.row2{margin-left: 24px;}
    .l-listitem .c-aboutme-ttl-lv2{max-width: 420px;}
    .l-ranking-list_portrait-item{flex-basis: 66px;}
    .l-ranking-list_circle-item{flex-basis: 70px;}
    div#modern-about-me-expand-button,.c-aboutme-accordion-btn-icon{display:none}
    #banner a.header-right.mt4.mr0{z-index: 2;position: relative;margin: 60px 10px 0px !important;}
    #banner div i.fa.fa-ban{margin: 60px 0px 0px !important;position: relative;}
    .loadmore,.actloading,.listLoading {font-size: .8rem;font-weight: 700;padding: 14px;text-align: center;}
    .loadmore {cursor: pointer;background: var(--color-foreground);border-radius: var(--border-radius);margin-bottom: 25px;z-index: 2;position: relative;}
    #headerSmall + #menu {width:auto!important}
    .profile .user-profile-about.js-truncate-outer{border:var(--border) solid var(--border-color);}
    .profile .btn-truncate.js-btn-truncate.open {padding-bottom:0!important}
    .profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{-webkit-box-shadow:none!important;box-shadow:none!important}
    .user-profile .user-friends {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: start;-webkit-justify-content: start;-ms-flex-pack: start;justify-content: start}
    .user-profile .user-friends .icon-friend {margin: 5px!important;}
    .favs {-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;border: var(--border) solid var(--border-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    display: -ms-grid !important;background-color: var(--color-foreground);padding: 10px;display: grid !important;grid-gap: 15px 5px !important;grid-template-columns: repeat(auto-fill, 70px) !important;
    -webkit-border-radius: var(--br);border-radius: var(--br);-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;margin-bottom:12px}
    .word-break img, .dark-mode .profile .user-profile-about .userimg, .profile .user-profile-about .userimg,
    .profile .user-profile-about a .userimg,.profile .user-profile-about .userimg.img-a-r {max-width: 100%;-webkit-box-shadow: none!important;box-shadow: none!important;}
    .profile .user-profile-about .quotetext{margin-left:0px;max-width:100%}
    .profile .user-profile-about iframe {max-width:100%}
    .profile .user-profile-about input.button {white-space: break-spaces;}
    #modern-about-me-inner {overflow:hidden}
     #modern-about-me-inner > *, #modern-about-me-inner .l-mainvisual {max-width:420px!important}
    .l-listitem-list-item {-webkit-flex-basis: 64px;flex-basis: 64px;-ms-flex-preferred-size: 64px;}
    .l-listitem-5_5_items {margin-right: -25px;}
    #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}
    .dark-mode .page-common #horiznav_nav ul li,.page-common #horiznav_nav ul li {background: 0 !important}
    .favTooltip {border: var(--border) solid var(--border-color);-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    z-index:5;text-indent:0;-webkit-transition:.4s;-o-transition:.4s;transition:.4s;position: absolute;background-color: var(--color-foreground4);color: var(--color-text);
    padding: 5px;-webkit-border-radius: 6px;border-radius: 6px;opacity:0;width: -webkit-max-content;width: -moz-max-content;width: max-content;left: 0;right: 0;margin: auto;max-width: 420px;}
    .user-profile {width:auto!important}
    .favs .btn-fav, .user-badge, .icon-friend {overflow:hidden}
    .favs .btn-fav:hover, .user-badge:hover, .icon-friend:hover {overflow:visible!important}
    .favs .btn-fav:hover .favTooltip,.user-badge:hover .favTooltip, .icon-friend:hover .favTooltip{opacity:1}
    .user-profile .user-badges .user-badge:hover,.user-profile .user-friends .icon-friend:hover,.user-profile .user-friends .icon-friend:active{opacity:1!important}
    .dark-mode .user-profile .user-badges .user-badge,.user-profile .user-badges .user-badge {${defaultMal ? "margin:2px!important" : "margin: 4px!important"}}
    .max{max-height:99999px!important}
    .icon-friend{text-indent: 0!important}
    .user-badge:hover:after,.icon-friend:hover:after,.btn-fav:hover:after {opacity: 1}
    .user-badge:after,.icon-friend:after,.btn-fav::after {content: attr(data-title);position: absolute;bottom: 105%;-webkit-border-radius: var(--border-radius);border-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;
    width: -webkit-max-content;width: -moz-max-content;width: max-content;background: var(--color-foreground4);color: var(--color-text);padding: 6px 10px;font-size: 12px;line-height: 1.4;white-space: pre-line;
    opacity: 0;-webkit-transition: opacity 0.2s ease;transition: opacity 0.2s ease;z-index: 1000;text-align: center;text-indent : unset;max-width: 210px;min-width:100%;overflow:hidden;
}`;

    var fixstylesheet = create("style", { id: "modernLayoutCSSFix" }, fixstyle.replace(/\n/g, ""));
    document.head.appendChild(fixstylesheet);
    document.body.style.setProperty("background", "var(--color-background)", "important");
    document.body.style.setProperty("--color-foreground", "var(--color-foregroundOP)", "important");
    document.body.style.setProperty("--color-foreground2", "var(--color-foregroundOP2)", "important");

    //Modern Profile Layout
    let about = document.querySelector(".user-profile-about.js-truncate-outer");
    let modernabout = document.querySelector("#modern-about-me");
    let avatar = document.querySelector(".user-image");
    let name = $('span:contains("s Profile"):first');
    let headerRight = document.querySelector("a.header-right.mt4.mr0");
    container.setAttribute("style", "margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;");
    if (!custombg) {
      banner.setAttribute("style", "background-color: var(--color-foreground);background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
    } else {
      if (svar.headerOpacity) {
        const headerSmall = document.getElementById("headerSmall");
        headerSmall.style.backgroundColor = "var(--fgo)!important";
        headerSmall.addEventListener("mouseenter", () => {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop === 0) {
            headerSmall.style.backgroundColor = "";
          }
        });
        banner.addEventListener("mouseenter", () => {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop === 0) {
            headerSmall.style.backgroundColor = "var(--fgo)!important";
          }
        });
      }
    }
    document.querySelector("#myanimelist").setAttribute("style", "min-width: 1240px;width:100%");
    set(1, "#myanimelist .wrapper", { sa: { 0: "width:100%;display:table" } });
    document.querySelector("#contentWrapper").insertAdjacentElement("beforebegin", banner);
    banner.append(container);
    headerRight ? banner.prepend(headerRight) : null;
    $('.header-right:contains("Profile Settings")').remove();
    if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
      $(headerRight).wrapAll("<div class='profileRightActions'></div>").after(blockU);
    }
    container.append(avatar);
    about ? about.classList.add("max") : null;
    modernabout ? modernabout.classList.add("max") : null;
    if (set(0, about, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", about);
    }
    if (set(0, modernabout, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", modernabout);
      let l = document.querySelectorAll(".l-listitem");
      let a = "max-width:420px";
      set(2, ".l-listitem", { sal: { 0: "-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;" } });
      set(1, ".l-mainvisual", { sa: { 0: a } });
      set(1, ".intro-mylinks-wrap", { sa: { 0: a } });
      set(1, ".l-intro", { sa: { 0: a } });
      set(1, ".l-intro-text-wrap-1", { sa: { 0: a } });
      set(1, ".copy-wrap-1", { sa: { 0: a } });
      set(1, ".mylinks-ul", { sa: { 0: a } });
    }
    if (about || modernabout) {
      if (set(1, ".user-profile h1:first-child", { sa: { 0: "position: absolute;top: 50px;right: 0;" } })) {
        banner.append(document.querySelector(".user-profile h1:first-child"));
      }
      $('a:contains("About Me Design"):last').remove();
    }
    set(1, ".user-image img", { sa: { 0: "display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important" } });
    set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
    document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
    set(1, ".user-statistics-stats.mt16", { sa: { 0: "margin-top:8px!important" } });
    $(".user-statistics-stats .stats.manga h5").addClass("mb12");
    set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
    document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
    avatar.setAttribute("style", "display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;");
    name.css({ "font-size": "1.5rem", "font-weight": "800", left: "35px", top: "-35px", color: "var(--color-main-text-op)", opacity: ".93" });
    name.html(name.html().replace(/'s Profile/g, "\n"));
    avatar.append(name[0]);
    set(2, "#container span.profile-team-title.js-profile-team-title", { sl: { top: "18px" } });
    container.append(document.querySelector(".user-function.mb8"));

    if (username === headerUserName) {
      $(".user-function.mb8").addClass("display-none");
    }
    $(".user-function.mb8").children(".icon-gift").remove();
    $(".user-function.mb8").children(".icon-comment").remove();
    $(".user-function.mb8").children(".icon-request").addClass("maljsNavBtn");
    $(".user-function.mb8").children(".icon-message").addClass("maljsNavBtn");
    $(".user-function.mb8").children(".icon-remove").addClass("maljsNavBtn");
    if ($(".user-function.mb8").attr("class") === "user-function mb8 display-none" && $(".maljsProfileBadge").length) {
      $(".maljsProfileBadge").css({ bottom: "35px" });
    }

    set(1, "a.btn-profile-submit.fl-l", { sa: { 0: "width:49.5%" } });
    set(1, "a.btn-profile-submit.fl-r", { sa: { 0: "width:49.5%" } });

    if (set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } })) {
      set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } });
    }
    if (set(1, ".bar-outer.anime", { sa: { 0: "width:100%" } })) {
      set(1, ".bar-outer.manga", { sa: { 0: "width:100%" } });
    }
    set(1, ".user-function.mb8", { sa: { 0: "position: relative;left: 96.5%;top: -60px;display: flex;width: 100px;font-size: 1rem;justify-content: flex-end;gap: 6px;" } });
    set(2, ".user-function.mb8 a", { sal: { 0: "border:none!important;box-shadow:none!important" } });
    set(2, ".user-function.mb8 span", { sal: { 0: "border:none!important;box-shadow:none!important" } });

    if (set(1, ".content-container", { sa: { 0: `display: grid!important;grid-template-columns: 33% auto;${defaultMal ? "gap:10px" : ""};margin-top: 20px;justify-content: center;` } })) {
      set(1, ".container-left", { sa: { 0: "width:auto" } });
      set(1, ".container-right", { sa: { 0: "width:auto;min-width:800px" } });
    }

    if (set(1, "#content > table > tbody > tr > td.profile_leftcell", { sa: { 0: "width:auto" } })) {
      set(1, "#content > table > tbody > tr", { sa: { 0: `display: grid!important;grid-template-columns: 33% auto;${defaultMal ? "gap:10px" : ""};margin-top: 10px;justify-content: center;` } });
      set(1, "#content > table > tbody > tr > td.pl8", { sa: { 0: "width: auto;position:relative;min-width:800px" } });
    }
    if (!isMainProfilePage && svar.profileRemoveLeftSide) {
      $(".content-container,#content > table > tbody > tr").css("grid-template-columns", "0 96%");
      $(".container-left,#content > table > tbody > tr > td.profile_leftcell").css({ width: "0", overflow: "hidden", opacity: "0" });
      $(".container-right,#content > table > tbody > tr > td.pl8").css({ padding: "0", maxWidth: "1275px" });
      $(".boxlist.col-3").css({ maxWidth: "230px" });
      $(".boxlist.col-4").css({ width: "188px" });
    }
    set(1, ".user-profile", { sa: { 0: "width:auto;" } });
    set(2, ".user-profile li", { sal: { 0: "width:auto" } });
    set(1, ".quotetext", { sa: { 0: "margin-left:0;" } });
    if ($(".head-config").next().is(".boxlist-container.badge")) {
      $(".head-config").remove();
    }
    $("#contentWrapper > div:nth-child(2) > h1").remove();
    set(1, "#content > table > tbody > tr > td.pl8 > #horiznav_nav", { r: { 0: 0 } });
    set(1, ".container-right #horiznav_nav", { r: { 0: 0 } });
    document
      .querySelector("#contentWrapper")
      .setAttribute(
        "style",
        `width: 1375px;max-width: 1375px!important;min-width:500px; margin: auto;transition:.6s;opacity:1;${
          defaultMal ? "top: -30px!important" : "top: -40px!important"
        };border:0!important;box-shadow:none!important`
      );
    let more = document.querySelector(".btn-truncate.js-btn-truncate");
    if (more) {
      more.setAttribute("data-height", '{"outer":1000,"inner":90000}');
    }
    let s = document.querySelector("#statistics");
    if (s) {
      let mangaStats = document.querySelector("#statistics .stats.manga");
      let mangaUpdates = document.querySelector("#statistics .updates.manga");
      let animeStats = document.querySelector("#statistics .stats.anime");
      let animeUpdates = document.querySelector("#statistics .updates.anime");
      s.setAttribute("style", "width: 818px");
      s.children[1].append(mangaStats);
      s.children[2].prepend(animeUpdates);
      s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
      document.querySelector(".container-right").prepend(s);
      $('h2:contains("Statistics"):last').remove();

      // if anime & manga stats empty - Remove
      if (animeStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00" && mangaStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
        document.querySelector("#statistics").remove();
      } else {
        // if manga stats empty - Remove
        if (mangaStats && mangaStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
          mangaStats.remove();
          mangaUpdates.remove();
          if (animeStats && animeStats.children[1].innerText !== "Days: 0.0\tMean Score: 0.00") {
            animeStats.parentElement.appendChild(animeUpdates);
          }
        }
        // if anime stats empty - Remove
        if (animeStats && animeStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
          animeStats.remove();
          animeUpdates.remove();
          if (mangaStats.parentElement && mangaStats.children[1].innerText !== "Days: 0.0\tMean Score: 0.00") {
            mangaStats.parentElement.appendChild(mangaUpdates);
          }
        }
      }
    }
    //Favorites
    if ($(".user-button.clearfix.mb12").length) {
      let favs = create("div", { class: "favs anime" });
      let favs2 = create("div", { class: "favs manga" });
      let favs3 = create("div", { class: "favs character" });
      let favs4 = create("div", { class: "favs people" });
      let favs5 = create("div", { class: "favs company" });
      $(".user-button.clearfix.mb12").after(favs, favs2, favs3, favs4, favs5);
      function getfavs() {
        let favc = ["#anime_favorites", "#manga_favorites", "#character_favorites", "#person_favorites", "#company_favorites"];
        let fave = [favs, favs2, favs3, favs4, favs5];
        let f, c;
        for (let l = 0; l < 5; l++) {
          f = document.querySelector(favc[l]);
          if (!f) {
            fave[l].remove();
          } else {
            fave[l].insertAdjacentElement("beforebegin", f.previousElementSibling);
            c = document.querySelectorAll(favc[l] + " ul > li");
            for (let x = 0; x < c.length; x++) {
              let r = c[x].querySelectorAll("span");
              for (let y = 0; y < r.length; y++) {
                r[y].remove();
              }
              c[x].setAttribute("style", "width:70px");
              fave[l].append(c[x]);
            }
            f.remove();
          }
        }
      }
      getfavs();
    }
    $(".favs").each(function (index) {
      $(this)
        .prev()
        .addBack()
        .wrapAll("<div class='user-favs' id='fav-" + index + "-div'></div>");
    });
    let userFavs = document.querySelectorAll("li.btn-fav");
    let userBadges = document.querySelectorAll(".user-badge");
    let userFriends = document.querySelectorAll(".icon-friend");
    let collection = Array.from(userFavs).concat(Array.from(userBadges), Array.from(userFriends));
    for (let btnFav of collection) {
      btnFav.tagName === "A" ? (btnFav.innerText = "") : "";
      btnFav.style.position = "relative";
      btnFav.style.display = "flex";
      btnFav.style.justifyContent = "center";
      if (btnFav.attributes.title) {
        btnFav.setAttribute("data-title", btnFav.attributes.title.textContent);
        btnFav.removeAttribute("title");
      }
    }
    if (document.querySelector(".container-right > h2.mb12")) {
      document.querySelector(".container-right > h2.mb12").remove();
    }
    if (!$(".profile .user-profile").length && $("#content > table > tbody > tr > td.profile_leftcell").length) {
      document.querySelector("#content > table > tbody > tr > td.profile_leftcell").classList.add("profile");
    }
    set(1, ".container-right > .btn-favmore", { r: { 0: 0 } });
    set(2, ".profile .user-profile h5", { sal: { 0: "font-size: 11px;margin-bottom: 8px;margin-left: 2px;" } });
    set(2, ".container-left h4", { sal: { 0: "font-size: 11px;margin-left: 2px;" } });
    //Remove Favorite Count
    const favHeader = document.querySelectorAll(".profile .user-profile .user-favs h5");
    for (let i = 0; i < favHeader.length; i++) {
      favHeader[i].innerText = favHeader[i].innerText.replace(/ \(\d+\)/, "");
    }
    set(1, ".favs", { sap: { 0: "box-shadow: none!important;" } });

    //Add Navbar to Profile Banner
    let nav = create("div", { class: "navbar", id: "navbar" });
    nav.innerHTML =
      '<div id="horiznav_nav" class="profile-nav" style="margin: 0;height: 45px;align-content: center;"><ul>' +
      '<li><a href="/profile/' +
      username +
      '">Overview</a></li><li><a href="/profile/' +
      username +
      '/statistics">Statistics</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/favorites">Favorites</a></li><li><a href="/profile/' +
      username +
      '/reviews">Reviews</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/recommendations">Recommendations</a></li><li><a href="/profile/' +
      username +
      '/stacks">Interest Stacks</a></li><li><a href="/profile/' +
      username +
      '/clubs">Clubs</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/badges">Badges</a></li><li><a href="/profile/' +
      username +
      '/friends">Friends</a></li></ul></div>';
    banner.insertAdjacentElement("afterend", nav);
    nav.setAttribute("style", "z-index: 3;position: relative;background: #000;text-align: center;background-color: var(--color-foreground) !important;");
    let navel = document.querySelectorAll("#navbar #horiznav_nav > ul > li > a");
    $('h2:contains("Synopsis"):last').parent().addClass("SynopsisDiv");
    let n = current.split("/")[3];
    if (!n) {
      $(navel[0]).addClass("navactive");
    } else {
      n = n.charAt(0).toUpperCase() + n.slice(1);
      $(".navbar a:contains(" + n + ")").addClass("navactive");
    }
    set(0, navel, { sal: { 0: "margin: 0 30px;font-size: .9rem;box-shadow: none!important;" } });
  }
}

// ==== profile_modernList.js ====
if (svar.replaceList) {
  let contLeft = $(".container-left").length ? $(".container-left") : $("#content > table > tbody > tr td[valign='top']:nth-child(1)");
  let contRight = $(".container-right").length ? $(".container-right") : $("#content > table > tbody > tr td[valign='top']:nth-child(2)");
  let isManga = null;
  // Function to create a single entry row
  function createEntryRow(animeData) {
    // Find or create the section for the current status
    let section = document.getElementById(`status-section-${animeData.status}`);
    if (!section) {
      // If section doesn't exist, create a new section
      section = create("div", { class: "status-section", id: `status-section-${animeData.status}` });
      const statusTextMap = {
        1: isManga ? translate("$listReading") : translate("$listWatching"),
        2: translate("$listCompleted"),
        3: translate("$listPaused"),
        4: translate("$listDropped"),
        6: translate("$listPlanning"),
      };
      // Create the section header
      const sectionHeader = create("h3", { class: "section-name" }, `${statusTextMap[animeData.status]}`);
      section.appendChild(sectionHeader);

      // Create the list head row
      const listHeadRow = create("div", { class: "list-head row" });

      // Create and append columns for the list head
      [
        [translate("$listSelectTitle"), "title"],
        [translate("$listSelectScore"), "score"],
        [translate("$listSelectProgress"), "progress"],
        [translate("$listSelectType"), "type"],
      ].forEach((colName) => {
        const colDiv = create("div", { class: colName[1] }, colName[0]);
        listHeadRow.appendChild(colDiv);
      });
      // Append list head row to the section
      section.appendChild(listHeadRow);
      // Append the new section to the parent container
      document.querySelector(".list-entries").appendChild(section);
    }
    const entryRow = create("div", { class: "entry row" });
    const coverDiv = create("div", { class: "cover" });
    const imageDiv = create("img", { class: "image lazyload", alt: animeData.title, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: animeData.imageUrl });
    if (animeData.airingStatus == 1 && svar.listAiringStatus) {
      const airingDot = create("span", { class: "airing-dot" });
      coverDiv.append(airingDot);
    }
    const editDiv = create("div", { class: "edit fa fa-pen", id: animeData.id });
    editDiv.onclick = async () => {
      isManga ? await editPopup(editDiv.id, "manga", null, null, 1) : await editPopup(editDiv.id, null, null, null, 1);
    };
    coverDiv.append(imageDiv, editDiv);
    // Create the title div
    const titleDiv = create("div", { class: "title" });
    const titleLink = create("a", { class: "title-link", href: animeData.href, style: { maxWidth: "450px" } }, animeData.title);
    titleDiv.appendChild(titleLink);
    if (animeData.notes) {
      const titleNote = create("div", { class: "user-note" });
      const titleNoteIcon = create("span", { class: "title-note fa fa-sticky-note" });
      const titleNoteInner = create("div", { class: "title-note-inner" });
      titleNoteInner.innerHTML = animeData.notes;
      titleNote.append(titleNoteIcon, titleNoteInner);
      $(titleNoteIcon).attr("style", 'font-family:"FontAwesome"!important');
      $(titleNote).appendTo(titleDiv);
    }
    // Create the score div
    const scoreDiv = create("div", { class: "score" }, animeData.score);
    // Create the progress div
    const progressDiv = create("div", { class: "progress" }, animeData.progress + (animeData.progressEnd ? "/" + animeData.progressEnd : ""));
    // Create the format div
    const formatDiv = create("div", { class: "format" }, animeData.format);
    // Append all child elements to the entry row
    entryRow.appendChild(coverDiv);
    entryRow.appendChild(titleDiv);
    entryRow.appendChild(scoreDiv);
    entryRow.appendChild(progressDiv);
    entryRow.appendChild(formatDiv);
    section.appendChild(entryRow);
    entryRow.setAttribute("genres", animeData.genres ? JSON.stringify(animeData.genres) : "");
    entryRow.setAttribute("season", animeData.season ? JSON.stringify(animeData.season) : "0");
    entryRow.setAttribute("tags", animeData.tags ? animeData.tags : "");
    entryRow.setAttribute("startDate", animeData.startDate ? animeData.startDate : "");
    entryRow.setAttribute("finishDate", animeData.finishDate ? animeData.finishDate : "");
    entryRow.setAttribute("createdAt", animeData.createdAt ? JSON.stringify(animeData.createdAt) : "");
    entryRow.setAttribute("updatedAt", animeData.updatedAt ? JSON.stringify(animeData.updatedAt) : "");
    entryRow.setAttribute("progress", animeData.progress ? JSON.stringify(animeData.progress) : "0");
    if (isManga) entryRow.setAttribute("mangaYear", animeData.mangaYear ? JSON.stringify(animeData.mangaYear) : "");
  }
  async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch request was aborted");
      } else {
        console.error("Fetch error:", error);
      }
      throw error;
    }
  }
  async function fetchWithRetry(url, timeout = 15000, retries = 5) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fetchWithTimeout(url, timeout);
      } catch (error) {
        if (attempt < retries) {
          $(".listLoading").html(`Retrying (${attempt}/${retries})... <i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>`);
          console.log(`Retrying (${attempt}/${retries})...`);
          await new Promise((res) => {
            setTimeout(() => res(), 1000);
          });
        } else {
          throw error;
        }
      }
    }
  }

  async function fetchAndCombineData() {
    let offset = 0;
    let allData = [];
    let shouldContinue = true;

    while (shouldContinue) {
      try {
        const response = await fetchWithRetry(`https://myanimelist.net/${isManga ? "mangalist/" + username : "animelist/" + username}/load.json?offset=${offset}&status=7`);
        const data = await response.json();

        if (data.errors) {
          shouldContinue = false;
          if (data.errors[0]?.message === "invalid request") {
            return "hidden_List";
          }
          console.error("API error:", data.errors);
          return data.errors[0]?.message;
        } else if (data.length === 0) {
          shouldContinue = false;
        } else {
          allData = allData.concat(data);
          offset += 300;
          await delay(333);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        shouldContinue = false;
      }
    }
    return allData;
  }

  async function getAnimeList(type) {
    let animeDataList = [];
    let list = [];
    isManga = type;
    const listLoading = create(
      "div",
      {
        class: "listLoading",
        style: { position: "absolute", top: "100%", left: "0", right: "0", fontSize: "16px" },
      },
      translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
    );
    const listEntries = create("div", { class: "list-entries" });
    contRight.append(listLoading, listEntries);
    await fetchAndCombineData().then(async (allData) => {
      list = allData;
      if (Array.isArray(list)) {
        for (let x = 0; x < list.length; x++) {
          if (isManga) {
            animeDataList.push({
              id: list[x].manga_id,
              genres: list[x].genres,
              tags: list[x].tags,
              imageUrl: list[x].manga_image_path,
              href: list[x].manga_url,
              title: list[x].manga_title,
              score: list[x].score,
              mangaYear: parseDate(list[x].manga_start_date_string, 1),
              airingStatus: list[x].manga_publishing_status,
              startDate: list[x].start_date_string,
              finishDate: list[x].finish_date_string,
              progress: list[x].num_read_chapters,
              progressEnd: list[x].manga_num_chapters,
              createdAt: list[x].created_at,
              updatedAt: list[x].updated_at,
              status: list[x].status,
              format: list[x].manga_media_type_string,
              notes: list[x].editable_notes,
            });
          } else {
            animeDataList.push({
              id: list[x].anime_id,
              genres: list[x].genres,
              tags: list[x].tags,
              season: list[x].anime_season,
              imageUrl: list[x].anime_image_path,
              href: list[x].anime_url,
              title: list[x].anime_title,
              score: list[x].score,
              airingStatus: list[x].anime_airing_status,
              startDate: list[x].start_date_string,
              finishDate: list[x].finish_date_string,
              progress: list[x].num_watched_episodes,
              progressEnd: list[x].anime_num_episodes,
              createdAt: list[x].created_at,
              updatedAt: list[x].updated_at,
              status: list[x].status,
              format: list[x].anime_media_type_string,
              notes: list[x].editable_notes,
            });
          }
        }
        loadCustomCover(1);
      }
    });

    animeDataList.sort((a, b) => b.score - a.score);
    animeDataList.forEach((animeData) => createEntryRow(animeData));
    const container = contRight.find(".list-entries");
    const divs = Array.from(container.find(".status-section"));
    divs.sort((a, b) => a.id.localeCompare(b.id));
    divs.forEach((div) => container.append(div));
    $(".loadmore").hide();
    if (!Array.isArray(list)) {
      if (list === "hidden_List") {
        listEntries.innerHTML = `<h3>${translate("$privateList")}</h3>`;
      } else {
        listEntries.innerHTML = `<h3>Error: ${list}</h3>`;
      }
    }
    listLoading.remove();

    if (svar.modernLayout) {
      $(".content-container").css("grid-template-columns", "26% auto");
      contRight.css("min-width", "900px");
      const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
      if (contentDiv.className !== "") {
        contentDiv.style.marginTop = "50px";
      } else {
        contentDiv.style.marginTop = "25px";
      }
    } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
      document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "25px";
    } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
      document.querySelector("#contentWrapper > div").style.marginBottom = "25px";
    }

    //List Filter
    const listFilter = create("div", { id: "filter" });
    listFilter.innerHTML = `<label for="filter-input"></label><input type="text" id="filter-input" placeholder="Filter"><h3>${translate("$listLists")}</h3>`;
    const goBack = create("a", { class: "filterLists-back fa fa-arrow-left" });
    goBack.onclick = () => {
      if (svar.modernLayout) {
        $(".content-container").css("grid-template-columns", "33% auto");
        contRight.css("min-width", "800px");
      }
      contLeft.children().show();
      contRight.children().show();
      $(".loadmore").show();
      $(".fav-slide-block.mb12").show();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").show();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").show();

      if (svar.modernLayout) {
        const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
        if (contentDiv.className !== "") {
          contentDiv.style.marginTop = "20px";
        } else {
          contentDiv.style.marginTop = "10px";
        }
      } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
        document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "0";
      } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
        document.querySelector("#contentWrapper > div").style.marginBottom = "0";
      }

      contLeft.find("#filter").remove();
      contLeft.find(".listCheck-footer").remove();
      contRight.find(".list-entries").remove();
    };
    $(listFilter).prepend(goBack);
    $(listFilter).prepend($("<h3>", { text: isManga ? "Manga List" : "Anime List", css: { marginTop: 0 } }));
    function hideOtherSections(sectionName) {
      let sections = document.querySelectorAll(".status-section");
      sections.forEach(function (section) {
        if (sectionName === "all") {
          section.style.display = "block";
        } else if (section.id !== sectionName) {
          section.style.display = "none";
        } else {
          section.style.display = "block";
        }
      });
    }
    const a_all = create("a", { class: "filterLists" }, translate("$listAll"));
    a_all.onclick = () => {
      hideOtherSections("all");
    };
    const a_watching = create("a", { class: "filterLists" }, isManga ? translate("$listReading") : translate("$listWatching"));
    a_watching.onclick = () => {
      hideOtherSections("status-section-1");
    };
    const a_completed = create("a", { class: "filterLists" }, translate("$listCompleted"));
    a_completed.onclick = () => {
      hideOtherSections("status-section-2");
    };
    const a_planning = create("a", { class: "filterLists" }, translate("$listPlanning"));
    a_planning.onclick = () => {
      hideOtherSections("status-section-6");
    };
    const a_paused = create("a", { class: "filterLists" }, translate("$listPaused"));
    a_paused.onclick = () => {
      hideOtherSections("status-section-3");
    };
    const a_dropped = create("a", { class: "filterLists" }, translate("$listDropped"));
    a_dropped.onclick = () => {
      hideOtherSections("status-section-4");
    };
    const listsDiv = create("div", { class: "filterListsDiv" });
    listsDiv.append(a_all, a_watching, a_completed, a_planning, a_paused, a_dropped);
    const listCount = create("div", { class: "filterListsCount" });
    const total = document.querySelectorAll(".entry.row").length;
    const section1 = document.querySelectorAll("#status-section-1 .entry.row").length;
    const section2 = document.querySelectorAll("#status-section-2 .entry.row").length;
    const section6 = document.querySelectorAll("#status-section-6 .entry.row").length;
    const section3 = document.querySelectorAll("#status-section-3 .entry.row").length;
    const section4 = document.querySelectorAll("#status-section-4 .entry.row").length;
    listCount.innerHTML = `(${total})<br>(${section1})<br>(${section2})<br>(${section6})<br>(${section3})<br>(${section4})`;
    const listsDivContainer = create("div", { class: "filterListsDivContainer" });
    listsDivContainer.append(listsDiv, listCount);
    listFilter.append(listsDivContainer);
    contLeft.append(listFilter);
    document.getElementById("filter-input").addEventListener("input", function () {
      var filterValue = this.value.toLowerCase();
      var entries = document.querySelectorAll(".entry");
      entries.forEach(function (entry) {
        var titleText = entry.querySelector(".title a").textContent.toLowerCase();
        if (titleText.includes(filterValue)) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
    });

    //Genres Filter
    const genresFilter = create("div", { class: "filterList_GenresFilter" });
    genresFilter.innerHTML = genresFilter.innerHTML = `
    <button class="genreDropBtn">${translate("$listSelectGenres")}</button>
    <div class="maljs-dropdown-content" id="maljs-dropdown-content">
    <label><input type="checkbox" class="genre-filter" value="1" title="Action"> Action</label>
    <label><input type="checkbox" class="genre-filter" value="2" title="Adventure"> Adventure</label>
    <label><input type="checkbox" class="genre-filter" value="5" title="Avant Garde"> Avant Garde</label>
    <label><input type="checkbox" class="genre-filter" value="46" title="Award Winning"> Award Winning</label>
    <label><input type="checkbox" class="genre-filter" value="28" title="Boys Love"> Boys Love</label>
    <label><input type="checkbox" class="genre-filter" value="4" title="Comedy"> Comedy</label>
    <label><input type="checkbox" class="genre-filter" value="8" title="Drama"> Drama</label>
    <label><input type="checkbox" class="genre-filter" value="9" title="Ecchi"> Ecchi</label>
    <label><input type="checkbox" class="genre-filter" value="10" title="Fantasy"> Fantasy</label>
    <label><input type="checkbox" class="genre-filter" value="12" title="Hentai"> Hentai</label>
    <label><input type="checkbox" class="genre-filter" value="26" title="Girls Love"> Girls Love</label>
    <label><input type="checkbox" class="genre-filter" value="47" title="Gourmet"> Gourmet</label>
    <label><input type="checkbox" class="genre-filter" value="14" title="Horror"> Horror</label>
    <label><input type="checkbox" class="genre-filter" value="7" title="Mystery"> Mystery</label>
    <label><input type="checkbox" class="genre-filter" value="22" title="Romance"> Romance</label>
    <label><input type="checkbox" class="genre-filter" value="24" title="Sci-Fi"> Sci-Fi</label>
    <label><input type="checkbox" class="genre-filter" value="36" title="Slice of Life"> Slice of Life</label>
    <label><input type="checkbox" class="genre-filter" value="30" title="Sports"> Sports</label>
    <label><input type="checkbox" class="genre-filter" value="37" title="Supernatural"> Supernatural</label>
    <label><input type="checkbox" class="genre-filter" value="41" title="Suspense"> Suspense</label>
    </div>`;

    listFilter.appendChild(genresFilter);
    // Genres Dropdown Function
    $(".genreDropBtn").click(function () {
      const genreFilterDiv = document.querySelector(".filterList_GenresFilter");
      genreFilterDiv.style.minWidth = genreFilterDiv.style.minWidth === "255px" ? "" : "255px";
      const dropdownContent = document.getElementById("maljs-dropdown-content");
      dropdownContent.style.display = dropdownContent.style.display === "grid" ? "none" : "grid";
    });
    // Genres Filter Function
    $(".genre-filter").click(function () {
      const checkboxes = document.querySelectorAll(".genre-filter");
      const entries = document.querySelectorAll(".entry");
      const selectedGenres = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
      entries.forEach((entry) => {
        const genres = JSON.parse(entry.getAttribute("genres"));
        const entryGenres = genres.map((genre) => genre.id.toString());
        const isVisible = selectedGenres.every((genre) => entryGenres.includes(genre)) || selectedGenres.length === 0;
        if (isVisible) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
      $(".genreDropBtn").text(
        selectedGenres.length > 0
          ? Array.from(checkboxes)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.title)
          : translate("$listSelectGenres")
      );
    });

    //Year Filter
    const yearFilter = create("div", { class: "filterList_YearFilter" });
    const currentYear = new Date().getFullYear();
    const yearFilterMax = currentYear;
    const yearFilterMin = currentYear - 95;
    const yearFilterClear = create("i", { class: "year-filter-clear fa fa-close" });
    yearFilter.innerHTML = `<div class="year-filter-slider-container">
  <input type="range" id="year-filter-slider" min="${yearFilterMin}" max="${yearFilterMax}" value="${yearFilterMax}" step="1">
  <span id="year-filter-label">${yearFilterMax}</span></div>`;
    let canAddYearFilter = 0;
    if ((!isManga && animeDataList[0] && animeDataList[0].season) || (isManga && animeDataList[0] && animeDataList[0].mangaYear)) {
      canAddYearFilter = 1;
    }
    if (canAddYearFilter) {
      $(yearFilter).prepend(`<h3>${translate("$listYear")}</h3>`);
      $(yearFilter).prepend($(yearFilterClear));
      listFilter.appendChild(yearFilter);
      const $yearFilterSlider = $("#year-filter-slider");
      const $yearFilterLabel = $("#year-filter-label");

      // Year Filter Clear Button Function
      $(yearFilterClear).on("click", function () {
        const entries = document.querySelectorAll(".entry");
        entries.forEach((entry) => {
          entry.classList.remove("hidden");
          yearFilterClear.style.display = "none";
          $yearFilterSlider.val(currentYear).change();
          $yearFilterLabel.text($yearFilterSlider.val());
        });
      });
      // Update label when slider value changes
      $yearFilterSlider.on("input", function () {
        if (yearFilterClear.style.display !== "block") {
          yearFilterClear.style.display = "block";
        }
        $yearFilterLabel.text($(this).val());
        const entries = document.querySelectorAll(".entry");
        entries.forEach((entry) => {
          const seasonData = isManga ? JSON.parse(entry.getAttribute("mangayear")) : JSON.parse(entry.getAttribute("season"));
          const entryYear = seasonData?.year ? seasonData.year : 0;
          if (entryYear && entryYear === parseInt($(this).val(), 10)) {
            entry.classList.remove("hidden");
          } else {
            entry.classList.add("hidden");
          }
        });
      });

      // Initialize label
      $yearFilterLabel.text($yearFilterSlider.val());
    }

    //Sort Filter
    const sortFilter = create("div", { class: "filterList_SortFilter" });
    sortFilter.innerHTML = `
  <div class="sort-container" style="display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; gap: 0px 10px; margin-top: 10px;">
  <select id="sort-select" style="width:100%"><option value="title">${translate("$listSelectTitle")}</option><option value="score">${translate("$listSelectScore")}</option>
  <option value="progress">${translate("$listSelectProgress")}</option><option value="startdate">${translate("$listSelectStartDate")}</option><option value="finishdate">${translate(
      "$listSelectFinishDate"
    )}</option>
  ${isManga ? "" : `<option value="createdat">${translate("$listSelectLastAdded")}</option> <option value="updatedat">${translate("$listSelectLastUpdated")}</option>`}</select>
  <button class="fa fa-arrow-up" id="sort-asc" title="Ascending" style="font-family: FontAwesome; width:33px; margin-top:0"></button>
  <button class="fa fa-arrow-down" id="sort-desc" title="Descending" style="font-family: FontAwesome; width:33px; margin-top:0"></button></div>`;
    listFilter.appendChild(sortFilter);
    const sortSelect = document.getElementById("sort-select");
    const sortAsc = document.getElementById("sort-asc");
    const sortDesc = document.getElementById("sort-desc");

    function getValue(entry, criterion) {
      switch (criterion) {
        case "score": {
          const score = entry.querySelector(".score")?.textContent?.trim();
          const parsed = parseInt(score, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "title": {
          const title = entry.querySelector(".title")?.textContent?.trim();
          return title ?? "";
        }
        case "startdate": {
          const startdate = entry.getAttribute("startdate");
          if (!startdate) return -Infinity;
          const parsed = parseDate(startdate);
          return parsed != null ? parsed : -Infinity;
        }
        case "finishdate": {
          const finishdate = entry.getAttribute("finishdate");
          if (!finishdate) return -Infinity;
          const parsed = parseDate(finishdate);
          return parsed != null ? parsed : -Infinity;
        }
        case "createdat": {
          const createdatAttr = entry.getAttribute("createdat");
          if (!createdatAttr) return -Infinity;
          const parsed = parseInt(createdatAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "updatedat": {
          const updatedatAttr = entry.getAttribute("updatedat");
          if (!updatedatAttr) return -Infinity;
          const parsed = parseInt(updatedatAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "progress": {
          const progressAttr = entry.getAttribute("progress");
          if (!progressAttr) return -Infinity;
          const parsed = parseInt(progressAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        default:
          return "";
      }
    }

    function sortEntriesInSection(section, criterion, order) {
      const entries = Array.from(section.querySelectorAll(".entry"));
      const compare = (a, b) => {
        const aValue = getValue(a, criterion);
        const bValue = getValue(b, criterion);
        if (order === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      };
      entries.sort(compare);
      const parent = section;
      entries.forEach((entry) => parent.appendChild(entry));
    }

    function sortAllSections(criterion, order) {
      const sections = document.querySelectorAll(".status-section");
      sections.forEach((section) => {
        sortEntriesInSection(section, criterion, order);
      });
    }

    sortAsc.addEventListener("click", () => {
      sortAllSections(sortSelect.value, "asc");
    });

    sortDesc.addEventListener("click", () => {
      sortAllSections(sortSelect.value, "desc");
    });
    //Tags
    const entries = document.querySelectorAll(".entry");
    const tagsContainer = create("div", { class: "filterList_TagsContainer" });
    const tagsContainerClear = create("i", { class: "tags-container-clear fa fa-close" });
    const tags = new Set(); // Using a Set to avoid duplicates
    tagsContainer.style.marginBottom = "10px";
    listFilter.appendChild(tagsContainer);
    // Tags Clear Button Function
    $(tagsContainerClear).on("click", function () {
      $(".tag-link.clicked").attr("class", "tag-link");
      const entries = document.querySelectorAll(".entry");
      entries.forEach((entry) => {
        entry.classList.remove("hidden");
        tagsContainerClear.style.display = "none";
      });
    });
    // Collect all unique tags
    entries.forEach((entry) => {
      const tag = entry.getAttribute("tags").replace(/"/g, ""); // Remove quotes
      if (tag) {
        tags.add(tag);
      }
    });

    if (tags.size > 0) {
      $(tagsContainer).prepend(`<h3>${translate("$listTags")}</h3>`);
      $(tagsContainer).prepend($(tagsContainerClear));
    }
    // Filter function
    function filterByTag(tag) {
      if (tagsContainerClear.style.display !== "block") {
        tagsContainerClear.style.display = "block";
      }
      entries.forEach((entry) => {
        const entryTag = entry.getAttribute("tags").replace(/"/g, "");
        if (entryTag === tag) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
    }
    // Create tag links
    tags.forEach((tag) => {
      const link = create("a", { class: "tag-link" }, tag);
      link.onclick = () => {
        $(".tag-link.clicked").attr("class", "tag-link");
        $(link).attr("class", "tag-link clicked");
        filterByTag(tag);
      };
      tagsContainer.appendChild(link);
    });

    //Compare Button
    if (userNotHeaderUser) {
      let compareBtn = create("a", { class: "compareBtn" }, translate("$listCompare"));
      let compareUrl = isManga
        ? "https://myanimelist.net/sharedmanga.php?u1=" + username + "&u2=" + headerUserName
        : "https://myanimelist.net/sharedanime.php?u1=" + username + "&u2=" + headerUserName;
      compareBtn.href = compareUrl;
      listFilter.appendChild(compareBtn);
    }

    // Make 3x3
    let buttonDraw3x3 = AdvancedCreate("a", "#maljsDraw3x3", translate("$3x3Btn"));
    listFilter.appendChild(buttonDraw3x3);
    buttonDraw3x3.onclick = function () {
      if (!document.querySelector(".maljsDisplayBox")) {
        $(".entry.row .title").css("pointer-events", "none");
        let displayBox = createDisplayBox(false, translate("$3x3Btn"));
        let col_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let col_label = AdvancedCreate("span", false, translate("$3x3Columns"), displayBox, "margin: 5px");
        col_input.type = "number";
        col_input.value = 3;
        col_input.step = 1;
        col_input.min = 0;
        let row_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let row_label = AdvancedCreate("span", false, translate("$3x3Rows"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        row_input.type = "number";
        row_input.value = 3;
        row_input.step = 1;
        row_input.min = 0;
        let margin_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let margin_label = AdvancedCreate("span", false, translate("$3x3ImgSpacing"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        margin_input.type = "number";
        margin_input.value = 0;
        margin_input.min = 0;
        let width_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let width_label = AdvancedCreate("span", false, translate("$3x3ImgWidth"), displayBox, "margin: 5px");
        width_input.type = "number";
        width_input.value = 230;
        width_input.min = 0;
        let height_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let height_label = AdvancedCreate("span", false, translate("$3x3ImgHeight"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        height_input.type = "number";
        height_input.value = 345;
        height_input.min = 0;
        let fitMode = AdvancedCreate("select", "maljsNativeInput", false, displayBox);
        let fitMode_label = AdvancedCreate("span", false, translate("$3x3ImgFit"), displayBox, "margin	: 5px");
        let addOption = function (value, text) {
          let newOption = AdvancedCreate("option", false, text, fitMode);
          newOption.value = value;
        };
        addOption("scale", "scale");
        addOption("crop", "crop");
        addOption("hybrid", "scale/crop hybrid");
        addOption("letterbox", "letterbox");
        addOption("transparent", "transparent letterbox");

        let recipe = AdvancedCreate("p", false, translate("$3x3Desc"), displayBox);
        let linkList = [];
        let keepUpdating = true;
        let image_width = 230;
        let image_height = 345;
        let margin = 0;
        let columns = 3;
        let rows = 3;
        let mode = fitMode.value;

        displayBox.parentNode.querySelector(".maljsDisplayBoxClose").onclick = function () {
          displayBox.parentNode.remove();
          keepUpdating = false;
          let cardList = document.querySelectorAll(".entry.row");
          cardList.forEach(function (card) {
            card.draw3x3selected = false;
            card.style.borderStyle = "none";
            card.querySelector(".title").style.pointerEvents = "";
          });
          linkList = [];
        };

        let finalCanvas = AdvancedCreate("canvas", false, false, displayBox, "max-height: 60%;max-width: 90%");
        let ctx = finalCanvas.getContext("2d");
        let updateDrawing = function () {
          finalCanvas.width = image_width * columns + (columns - 1) * margin;
          finalCanvas.height = image_height * rows + (rows - 1) * margin;
          ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
          let drawStuff = function (image, x, y, width, height) {
            let img = new Image();
            img.onload = function () {
              let sx = 0;
              let sy = 0;
              let sWidth = img.width;
              let sHeight = img.height;
              let dx = x;
              let dy = y;
              let dWidth = width;
              let dHeight = height;
              if (mode === "crop") {
                if (img.width / img.height > width / height) {
                  let factor = img.height / height;
                  sWidth = width * factor;
                  sx = (img.width - sWidth) / 2;
                } else {
                  //crop top and bottom
                  let factor = img.width / width;
                  sHeight = height * factor;
                  sy = (img.height - sHeight) / 2;
                }
              } else if (mode === "hybrid") {
                if (img.width / img.height > width / height) {
                  let factor = img.height / height;
                  sWidth = width * factor;
                  sWidth += (img.width - sWidth) / 2;
                  sx = (img.width - sWidth) / 2;
                } else {
                  //crop top and bottom
                  let factor = img.width / width;
                  sHeight = height * factor;
                  sHeight += (img.height - sHeight) / 2;
                  sy = (img.height - sHeight) / 2;
                }
              } else if (mode === "letterbox" || mode === "transparent") {
                if (img.width / img.height > width / height) {
                  let factor = img.width / width;
                  dHeight = img.height / factor;
                  dy = y + (height - dHeight) / 2;
                } else {
                  //too tall
                  let factor = img.height / height;
                  dWidth = img.width / factor;
                  dx = x + (width - dWidth) / 2;
                }
                if (mode === "letterbox") {
                  ctx.fillStyle = "black";
                  ctx.fillRect(x, y, width, height);
                }
              }
              ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            };
            img.src = image;
          };
          for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
              if (linkList[y * columns + x] !== "empty") {
                drawStuff(linkList[y * columns + x], x * image_width + x * margin, y * image_height + y * margin, image_width, image_height);
              }
            }
          }
        };

        let updateConfig = function () {
          columns = parseInt(col_input.value) || 3;
          rows = parseInt(row_input.value) || 3;
          margin = parseInt(margin_input.value) || 0;
          image_width = parseInt(width_input.value) || 230;
          image_height = parseInt(height_input.value) || 345;
          mode = fitMode.value;
          displayBox.parentNode.querySelector(".maljsDisplayBoxTitle").textContent = columns + "x" + rows + " Maker";
          recipe.innerText = "Click " + rows * columns + " media entries, then save the image below";
          updateDrawing();
        };
        col_input.oninput = updateConfig;
        row_input.oninput = updateConfig;
        margin_input.oninput = updateConfig;
        width_input.oninput = updateConfig;
        height_input.oninput = updateConfig;
        fitMode.oninput = updateConfig;

        let updateCards = function () {
          let cardList = document.querySelectorAll(".entry.row");
          cardList.forEach((card) => {
            card.onclick = function () {
              if (keepUpdating) {
                if (this.draw3x3selected) {
                  linkList[linkList.indexOf(this.draw3x3selected)] = "empty";
                  this.draw3x3selected = false;
                  this.style.borderStyle = "none";
                } else {
                  let val = this.querySelector(".cover .image").src;
                  if (
                    !linkList.some((place, index) => {
                      if (place === "empty") {
                        linkList[index] = val;
                        return true;
                      }
                      return false;
                    })
                  ) {
                    linkList.push(val);
                  }
                  this.draw3x3selected = val;
                  this.style.borderStyle = "solid";
                }
                updateDrawing();
              }
            };
          });
        };
        let waiter = function () {
          updateCards();
          if (keepUpdating) {
            setTimeout(waiter, 500);
          }
        };
        waiter();
      }
    };
  }

  //Anime List Button
  const animeListButton = document.querySelector("a.btn-profile-submit.fl-l");
  if (animeListButton) {
    animeListButton.href = "javascript:void(0);";
    animeListButton.onclick = async () => {
      $(contLeft).children().hide();
      $(contRight).children().hide();
      $(".fav-slide-block.mb12").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
      getAnimeList();
    };
  }
  //Manga List Button
  const mangaListButton = document.querySelector("a.btn-profile-submit.fl-r");
  if (mangaListButton) {
    mangaListButton.href = "javascript:void(0);";
    mangaListButton.onclick = async () => {
      $(contLeft).children().hide();
      $(contRight).children().hide();
      $(".fav-slide-block.mb12").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
      getAnimeList("manga");
    };
  }
}

// ==== profile_mutualFriends.js ====
async function mutualFriends() {
  let myFriends = 0;
  let userFriends = 0;
  const friendsHeader = document.querySelector(".boxlist-container.friend.mb16");
  const mutualsButton = create("a", { class: "mal-btn", style: { backgroundColor: "var(--color-foreground)" } }, "Mutual Friends");
  const mutualsDiv = create("div", { class: "boxlist-container" });
  $(friendsHeader).before(mutualsButton);
  $(friendsHeader).after(mutualsDiv);
  mutualsButton.addEventListener("click", async function () {
    const loadingText = translate("$loading");
    if ($(mutualsButton).text() !== loadingText) {
      mutualsButton.classList.toggle("active");
      try {
        $(mutualsButton).text(loadingText);
        if (!myFriends) {
          myFriends = await getFriends(headerUserName);
          myFriends = myFriends.map((friend) => friend.username);
        }
        if (!userFriends) {
          userFriends = await getFriends(username);
        }
        $(mutualsButton).text(translate("$mutualFriends"));
        mutualsButton.classList[1] === "active" ? $(mutualsButton).css({ backgroundColor: "var(--color-foreground2)" }) : $(mutualsButton).css({ backgroundColor: "var(--color-foreground)" });
        if (!$(mutualsDiv).attr("done")) {
          userFriends.forEach((user) => {
            if (mutualsButton.classList[1]) {
              $(".boxlist-container.friend.mb16, .mt4.mb8").hide();
              $(mutualsDiv).show();
              if (myFriends.includes(user.username)) {
                const mutualsBox = create("div", {
                  class: "boxlist col-3",
                  style: { minHeight: "48px" },
                });
                mutualsBox.innerHTML = `
                <div class="di-tc"><a href="${user.url}">
                <img class="image profile-w48 lazyload"src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${user.images.jpg.image_url}" alt="Profile Image">
                </a></div>
                <div class="di-tc va-t pl8 data">
                <div class="title">
                <a href="${user.url}">${user.username}</a>
                </div>
                </div>
                `;
                mutualsDiv.append(mutualsBox);
              }
            }
          });
          $(mutualsDiv).attr("done", "1");
        }
        if (!mutualsButton.classList[1]) {
          $(".boxlist-container.friend.mb16, .mt4.mb8").show();
          $(mutualsDiv).hide();
        } else {
          $(".boxlist-container.friend.mb16, .mt4.mb8").hide();
          $(mutualsDiv).show();
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
  });
}
if (/\/profile\/.*\/friends/gm.test(current) && userNotHeaderUser) {
  mutualFriends();
}

// ==== profile_waitLoadCustomProfile.js ====
await startCustomProfile();
//Wait for user image
async function imgLoad() {
  userimg = document.querySelector(".user-image.mb8 > img");
  set(0, userimg, { sa: { 0: "position: fixed;opacity:0!important;" } });

  if (userimg && userimg.src) {
    set(0, userimg, { sa: { 0: "position: relative;opacity:1!important;" } });
  } else if (!document.querySelector(".btn-detail-add-picture.nolink")) {
    await delay(250);
    await imgLoad();
  }
}

async function startCustomProfile() {
  await imgLoad();
  await findCustomAbout();
  await applyModernLayout();

  if (svar.profileHeader && !svar.modernLayout) {
    let title = document.querySelector("#contentWrapper h1");
    title.setAttribute("style", "padding-left: 2px;margin-bottom:5px");
    let table = document.querySelector(".container-right");
    if (table) {
      table.prepend(title);
    }
  }
  if (!svar.modernLayout) {
    customProfileElUpdateButton.textContent = translate("$add");
    customProfileElUpdateButton.style.width = "98%";
    customProfileElRightUpdateButton.style.display = "none";
  } else {
    if (svar.profileAnimeGenre && isMainProfilePage) {
      await getUserGenres(0, 1);
    }
    if (svar.profileMangaGenre && isMainProfilePage) {
      await getUserGenres(1, 1);
    }
    if (svar.moveBadges) {
      $("#user-button-div").after($("#user-badges-div"));
      $("#user-badges-div").after($("#user-mal-badges"));
      if ($("#user-badges-div").next().is("ul")) {
        $("#user-badges-div").css("margin-bottom", "12px");
      }
    }
  }

  // Hide if about me is empty.
  const aboutDiv = document.querySelector(".user-profile-about");
  if (aboutDiv) {
    const wordBreakDiv = aboutDiv.querySelector(".word-break");
    if (wordBreakDiv) {
      const hasOnlyMalcleanLink = () => {
        if (wordBreakDiv.children.length !== 1 || wordBreakDiv.children[0].tagName !== "A") {
          return false;
        }
        const anchor = wordBreakDiv.children[0];
        if (!anchor.href.includes("malcleansettings")) {
          return false;
        }
        const rawText = wordBreakDiv.textContent.replace(/[\s\u200B-\u200F\uFEFF]/g, "");
        return rawText === "" || rawText.length <= 1;
      };
      if (hasOnlyMalcleanLink()) {
        aboutDiv.style.display = "none";
      }
    }
  }

  await delay(1000);
  addLoading("forceRemove");
}

//Profile Vertical Favs Fix
if ($("#anime_favorites").length && $("#anime_favorites").css("width") <= "191px") {
  $("#user-def-favs h5").attr("style", "padding: 0!important;opacity: 0;height: 0px").text("");
}

})();
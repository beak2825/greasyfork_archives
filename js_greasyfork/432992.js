// ==UserScript==
// @name           Check Yth Pulls Feed
// @version        4.0.1
// @description    This Tool Calculate peaks Increment in each peak
// @author       Omer Ben Yosef
// @include			https://trophymanager.com/league/*
// @include			https://trophymanager.com/league/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/432992/Check%20Yth%20Pulls%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/432992/Check%20Yth%20Pulls%20Feed.meta.js
// ==/UserScript==

var div = "";
var div_area = "";
var Promises_Array = [];
var Promises_Array_Players = [];

var ids_array = [];
var last_week = [];
var older = [];

var feeds_array = [];
var players = [];
var output_text = "";

const LastSaturday = getLastSaturday();
var leauges_array = [
  { country: "it", division: "1", group: "1" },
  { country: "it", division: "2", group: "1" },
  { country: "it", division: "2", group: "2" },
  { country: "it", division: "2", group: "3" },
  { country: "it", division: "2", group: "4" },
  { country: "ro", division: "1", group: "1" },
  { country: "ro", division: "2", group: "1" },
  { country: "ro", division: "2", group: "2" },
  { country: "ro", division: "2", group: "3" },
  { country: "ro", division: "2", group: "4" },
  { country: "en", division: "1", group: "1" },
  { country: "en", division: "2", group: "1" },
  { country: "en", division: "2", group: "2" },
  { country: "en", division: "2", group: "3" },
  { country: "en", division: "2", group: "4" },
  { country: "gr", division: "1", group: "1" },
  { country: "gr", division: "2", group: "1" },
  { country: "gr", division: "2", group: "2" },
  { country: "gr", division: "2", group: "3" },
  { country: "gr", division: "2", group: "4" },
  { country: "es", division: "1", group: "1" },
  { country: "es", division: "2", group: "1" },
  { country: "es", division: "2", group: "2" },
  { country: "es", division: "2", group: "3" },
  { country: "es", division: "2", group: "4" },
  { country: "pt", division: "1", group: "1" },
  { country: "pt", division: "2", group: "1" },
  { country: "pt", division: "2", group: "2" },
  { country: "pt", division: "2", group: "3" },
  { country: "pt", division: "2", group: "4" },
  { country: "cz", division: "1", group: "1" },
  { country: "cz", division: "2", group: "1" },
  { country: "cz", division: "2", group: "2" },
  { country: "cz", division: "2", group: "3" },
  { country: "cz", division: "2", group: "4" },
  { country: "nl", division: "1", group: "1" },
  { country: "nl", division: "2", group: "1" },
  { country: "nl", division: "2", group: "2" },
  { country: "nl", division: "2", group: "3" },
  { country: "nl", division: "2", group: "4" },
  { country: "ar", division: "1", group: "1" },
  { country: "ar", division: "2", group: "1" },
  { country: "ar", division: "2", group: "2" },
  { country: "ar", division: "2", group: "3" },
  { country: "ar", division: "2", group: "4" },
  { country: "us", division: "1", group: "1" },
  { country: "us", division: "2", group: "1" },
  { country: "us", division: "2", group: "2" },
  { country: "us", division: "2", group: "3" },
  { country: "us", division: "2", group: "4" },
  { country: "lt", division: "1", group: "1" },
  { country: "lu", division: "1", group: "1" },
  { country: "mk", division: "1", group: "1" },
  { country: "mt", division: "1", group: "1" },
  { country: "md", division: "1", group: "1" },
  { country: "ct", division: "1", group: "1" },
  { country: "cs", division: "1", group: "1" },
  { country: "rt", division: "1", group: "1" },
  { country: "no", division: "1", group: "1" },
  { country: "sm", division: "1", group: "1" },
  { country: "sk", division: "1", group: "1" },
  { country: "si", division: "1", group: "1" },
  { country: "es", division: "1", group: "1" },
  { country: "se", division: "1", group: "1" },
  { country: "he", division: "1", group: "1" },
  { country: "ua", division: "1", group: "1" },
  { country: "wa", division: "1", group: "1" },
  { country: "hn", division: "1", group: "1" },
  { country: "jm", division: "1", group: "1" },
  { country: "mx", division: "1", group: "1" },
  { country: "pa", division: "1", group: "1" },
  { country: "pr", division: "1", group: "1" },
  { country: "tt", division: "1", group: "1" },
  { country: "vc", division: "1", group: "1" },
  { country: "bo", division: "1", group: "1" },
  { country: "cl", division: "1", group: "1" },
  { country: "co", division: "1", group: "1" },
  { country: "ec", division: "1", group: "1" },
  { country: "nz", division: "1", group: "1" },
  { country: "oc", division: "1", group: "1" },
  { country: "af", division: "1", group: "1" },
  { country: "bh", division: "1", group: "1" },
  { country: "bd", division: "1", group: "1" },
  { country: "bn", division: "1", group: "1" },
  { country: "hk", division: "1", group: "1" },
  { country: "in", division: "1", group: "1" },
  { country: "id", division: "1", group: "1" },
  { country: "ir", division: "1", group: "1" },
  { country: "iq", division: "1", group: "1" },
  { country: "jp", division: "1", group: "1" },
  { country: "jo", division: "1", group: "1" },
  { country: "kw", division: "1", group: "1" },
  { country: "dz", division: "1", group: "1" },
  { country: "ao", division: "1", group: "1" },
  { country: "bw", division: "1", group: "1" },
  { country: "cm", division: "1", group: "1" },
  { country: "td", division: "1", group: "1" },
  { country: "eg", division: "1", group: "1" },
  { country: "tn", division: "1", group: "1" },
  { country: "gh", division: "1", group: "1" },
  { country: "fr", division: "1", group: "1" },
  { country: "fr", division: "2", group: "1" },
  { country: "fr", division: "2", group: "2" },
  { country: "fr", division: "2", group: "3" },
  { country: "fr", division: "2", group: "4" },
  { country: "bg", division: "1", group: "1" },
  { country: "bg", division: "2", group: "1" },
  { country: "bg", division: "2", group: "2" },
  { country: "bg", division: "2", group: "3" },
  { country: "bg", division: "2", group: "4" },
  { country: "cn", division: "1", group: "1" },
  { country: "cn", division: "2", group: "1" },
  { country: "cn", division: "2", group: "2" },
  { country: "cn", division: "2", group: "3" },
  { country: "cn", division: "2", group: "4" },
  { country: "pl", division: "1", group: "1" },
  { country: "pl", division: "2", group: "1" },
  { country: "pl", division: "2", group: "2" },
  { country: "pl", division: "2", group: "3" },
  { country: "pl", division: "2", group: "4" },
  { country: "ge", division: "1", group: "1" },
  { country: "ge", division: "2", group: "1" },
  { country: "ge", division: "2", group: "2" },
  { country: "ge", division: "2", group: "3" },
  { country: "ge", division: "2", group: "4" },
  { country: "tr", division: "1", group: "1" },
  { country: "tr", division: "2", group: "1" },
  { country: "tr", division: "2", group: "2" },
  { country: "tr", division: "2", group: "3" },
  { country: "tr", division: "2", group: "4" },
  { country: "ru", division: "1", group: "1" },
  { country: "ru", division: "2", group: "1" },
  { country: "ru", division: "2", group: "2" },
  { country: "ru", division: "2", group: "3" },
  { country: "ru", division: "2", group: "4" },
  { country: "dk", division: "1", group: "1" },
  { country: "dk", division: "2", group: "1" },
  { country: "dk", division: "2", group: "2" },
  { country: "dk", division: "2", group: "3" },
  { country: "dk", division: "2", group: "4" },
  { country: "br", division: "1", group: "1" },
  { country: "br", division: "2", group: "1" },
  { country: "br", division: "2", group: "2" },
  { country: "br", division: "2", group: "3" },
  { country: "br", division: "2", group: "4" },
  { country: "al", division: "1", group: "1" },
  { country: "ad", division: "1", group: "1" },
  { country: "am", division: "1", group: "1" },
  { country: "at", division: "1", group: "1" },
  { country: "az", division: "1", group: "1" },
  { country: "by", division: "1", group: "1" },
  { country: "be", division: "1", group: "1" },
  { country: "ba", division: "1", group: "1" },
  { country: "hr", division: "1", group: "1" },
  { country: "cy", division: "1", group: "1" },
  { country: "ee", division: "1", group: "1" },
  { country: "fo", division: "1", group: "1" },
  { country: "fi", division: "1", group: "1" },
  { country: "de", division: "1", group: "1" },
  { country: "hu", division: "1", group: "1" },
  { country: "is", division: "1", group: "1" },
  { country: "ie", division: "1", group: "1" },
  { country: "il", division: "1", group: "1" },
  { country: "me", division: "1", group: "1" },
  { country: "kz", division: "1", group: "1" },
  { country: "lv", division: "1", group: "1" },
  { country: "bz", division: "1", group: "1" },
  { country: "ca", division: "1", group: "1" },
  { country: "cr", division: "1", group: "1" },
  { country: "cu", division: "1", group: "1" },
  { country: "do", division: "1", group: "1" },
  { country: "sv", division: "1", group: "1" },
  { country: "gt", division: "1", group: "1" },
  { country: "py", division: "1", group: "1" },
  { country: "pe", division: "1", group: "1" },
  { country: "uy", division: "1", group: "1" },
  { country: "ve", division: "1", group: "1" },
  { country: "au", division: "1", group: "1" },
  { country: "fj", division: "1", group: "1" },
  { country: "lb", division: "1", group: "1" },
  { country: "my", division: "1", group: "1" },
  { country: "np", division: "1", group: "1" },
  { country: "om", division: "1", group: "1" },
  { country: "pk", division: "1", group: "1" },
  { country: "ph", division: "1", group: "1" },
  { country: "qa", division: "1", group: "1" },
  { country: "sa", division: "1", group: "1" },
  { country: "sg", division: "1", group: "1" },
  { country: "kr", division: "1", group: "1" },
  { country: "sy", division: "1", group: "1" },
  { country: "tw", division: "1", group: "1" },
  { country: "th", division: "1", group: "1" },
  { country: "ae", division: "1", group: "1" },
  { country: "vn", division: "1", group: "1" },
  { country: "ci", division: "1", group: "1" },
  { country: "ly", division: "1", group: "1" },
  { country: "ma", division: "1", group: "1" },
  { country: "ng", division: "1", group: "1" },
  { country: "so", division: "1", group: "1" },
  { country: "sn", division: "1", group: "1" },
  { country: "za", division: "1", group: "1" }
];

/////////////////////////

const REPORT_TABLE_BODY_ID = 'tmvn_script_report_table_body';
const COLOR = ['Yellow', 'darkblue', 'Black', 'Darkred', 'darkturquoise'];

const TalentRate = [
  [1.22684101, 1.22684101, 1.206393707, 1.188461538, 1.163636364, 1.148172906, 1.128430388, 1.09875, 1.081617647, 1.066291291, 1.052777778, 1.01690167],
  [1.000673077, 0.978985507, 0.964893617, 0.936580087, 0.909574468, 0.905555556, 0.893269231, 0.863276144, 0.836033724, 0.833712121, 0.819419419, 0.791268299],
  [0.76484375, 0.744627193, 0.737622549, 0.723239437, 0.705, 0.689516908, 0.661842105, 0.662054329, 0.629166667, 0.616497634, 0.595283019, 0.58531746],
  [0.567241379, 0.546296296, 0.524073653, 0.526941489, 0.500609756, 0.485555556, 0.479411765, 0.453048781, 0.432758621, 0.425, 0.408984249, 0.403163752],
  [0.36599923, 0.363104839, 0.359522406, 0.358387698, 0.334583333, 0.342142857, 0.332904412, 0.324857955, 0.321494253, 0.316, 0.306040627, 0.293114863],
  [0.283333333, 0.283515965, 0.284437387, 0.2703125, 0.277295119, 0.267310181, 0.251923077, 0.240769231, 0.236666667, 0.236607143, 0.230625, 0.226215806],
  [0.220881226, 0.215243902, 0.207446809, 0.203061225, 0.204098361, 0.202678571, 0.191346154, 0.182291667, 0.173275862, 0.168644068, 0.175, 0.165],
  [0.16076087, 0.156521739, 0.156081755, 0.15053313, 0.144984505, 0.13943588, 0.133887255, 0.12833863, 0.122790005, 0.117241379, 0.114634146, 0.10754717],
  [0.101031447, 0.094515724, 0.088, 0.086972222, 0.085944444, 0.084916666, 0.083888888, 0.08286111, 0.081833332, 0.080805554, 0.079777776, 0.078749998],
  [0.0725, 0.069970096, 0.067440192, 0.064910288, 0.062380384, 0.05985048, 0.057320576, 0.054790672, 0.052260768, 0.049730864, 0.04720096, 0.044671056],
  [0.042141152, 0.039611248, 0.037081344, 0.03455144, 0.032021536, 0.029491632, 0.026961728, 0.024431818, 0.022904829, 0.02137784, 0.019850851, 0.018323862],
  [0.016796873, 0.015269884, 0.013742895, 0.012215906, 0.010688917, 0.009161928, 0.007634939, 0.00610795, 0.004580961, 0.003053972, 0.001526983, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

var player = { name: "", age: "", months: "", skill_index: "", favposition: "" };

let playersIDs = [];
let currentPlayerViewID = 0;

/////////////////////////////////////


iniz_form();
present();


function iniz_form() {
  div = document.createElement("BUTTON");
  document.getElementsByClassName("box")[0].appendChild(div);
  div.setAttribute(
    "style",
    "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 5px;"
  );
  div.innerHTML = "<p><b>Check Yth Pulls Feed</b></p>";

  div_area = document.createElement("div");

  document.getElementsByClassName("box")[0].appendChild(div_area);
  div_area.innerHTML =
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 190px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "" +
    " </td></tr><tr><td>Last Week: </td><td> " +
    "</td></tr>      </table></b></div>";

  OpenAllPullsButton = document.createElement("BUTTON");
  document.getElementsByClassName("box")[0].appendChild(OpenAllPullsButton);
  OpenAllPullsButton.setAttribute(
    "style",
    "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 50px;"
  );
  OpenAllPullsButton.innerHTML = "<p><b>Open All</b></p>";
  OpenAllPullsButton.disabled = true;


  OpenLastWeekButton = document.createElement("BUTTON");
  document.getElementsByClassName("box")[0].appendChild(OpenLastWeekButton);
  OpenLastWeekButton.setAttribute(
    "style",
    "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 95px;"
  );
  OpenLastWeekButton.innerHTML = "<p><b>Open Last Week Pulls</b></p>";
  OpenLastWeekButton.disabled = true;

  OpenOlderButton = document.createElement("BUTTON");
  document.getElementsByClassName("box")[0].appendChild(OpenOlderButton);
  OpenOlderButton.setAttribute(
    "style",
    "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 140px;"
  );
  OpenOlderButton.innerHTML = "<p><b>Open Older Week Pulls</b></p>";
  OpenOlderButton.disabled = true;


}
function request(obj) {
  return $.ajax({
    url: "https://trophymanager.com/ajax/feed_get.ajax.php",
    type: "POST",
    data: {
      type: "get_feed",
      feed_id: 0,
      filters: {
        buddies: "false",
        league: obj,
        personal: "false",
      },
      only_system_posts: true,
    },
    error: function (xhr, error) {
      console.log(error);
    },
    complete(data) {
      var json = $.parseJSON(data.responseText);
      feeds_array.push(json.feed);
    },
  });
}


function getIDs(feeds_array) {
  for (var i = 0; i < feeds_array.length; i++) {
    getIdsFromFeed(feeds_array[i]);
  }
}

function getIdsFromFeed(feed) {
  var array_list = feed;
  var index = 0;
  var yth_val = 0;
  var id = 0;
  for (var i = 0; i < array_list.length; i++) {
    yth_val = array_list[i].text.indexOf(
      "has signed a new talent from their youth academy"
    );
    if (yth_val > -1) {
      index = feed[i].text.indexOf("[potential_stars=10]");
      if (index > -1) {
        id = feed[i].attributes.extra[0];
        if (ids_array.includes(id) == false) {
          ids_array.push(id);
          checkPullWeek(feed[i].full_time) ? last_week.push(id) : older.push(id);
        }
      }
      var myProp = "sub_entries";
      if (array_list[i].hasOwnProperty(myProp)) {
        array_subs = array_list[i].sub_entries;
        for (var k = 0; k < array_subs.length; k++) {
          index = array_subs[k].text.indexOf("[potential_stars=10]");
          if (index > -1) {
            id = array_subs[k].attributes.extra[0];
            if (ids_array.includes(id) == false) {
              ids_array.push(id);
              checkPullWeek(array_subs[k].full_time) ? last_week.push(id) : older.push(id);
            }
          }
        }
      }
    }
  }
}

function checkPullWeek(date) {
  let dateDate = new Date(date);
  return dateDate >= LastSaturday;
}

function BuildResult(last_week, older) {
  div_area.innerHTML =
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 1300px; margin-top: 190px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "YES" +
    " </td></tr><tr><td>Last Week: </td><td> " +
    "</td></tr>      </table></b></div>";
  last_week = last_week.sort().reverse()
  older = older.sort().reverse()
  playersIDs = [];
  currentPlayerViewID = 0;
  playersIDs = last_week.concat(older);

  LastWeekPullsDiv = document.createElement("div");
  LastWeekPullsDiv.id = "LastWeekPulls";

  OlderPullsDiv = document.createElement("div");
  OlderPullsDiv.id = "OlderPulls";

  if (last_week.length > 0) {
    for (var j = 0; j < last_week.length; j++) {
      div = document.createElement("div");
      a = document.createElement("a");
      link = "".concat("https://trophymanager.com/players/", last_week[j]);
      a.href = link;
      a.innerText = last_week[j];
      tra = document.createElement("tr");
      div.append(a);
      div.append(tra);
      LastWeekPullsDiv.append(div);
    }
  }
  $("#table").append(LastWeekPullsDiv);


  let br = document.createElement("br");
  $("#table").append(br);

  let tbody_older = document.createElement("tbody");
  let tr_older = document.createElement("tr");
  let td_older = document.createElement("tr");
  td_older.innerText = "Older: ";
  tr_older.appendChild(td_older);
  tbody_older.appendChild(tr_older);
  $("#table").append(tbody_older);

  if (older.length > 0) {
    for (var j = 0; j < older.length; j++) {
      div = document.createElement("div");
      a = document.createElement("a");
      link = "".concat("https://trophymanager.com/players/", older[j]);
      a.href = link;
      a.innerText = older[j];

      tra = document.createElement("tr");
      div.append(a);
      div.append(tra);
      OlderPullsDiv.append(div);
    }
  }
  $("#table").append(OlderPullsDiv);
  div_area.firstChild.style.height = ($("#table").height() + 80).toString() + "px";
  let links = $("#table > div > div > a")

  for (let i = 0; i < links.length; i++) {
    links[i].removeEventListener("mouseenter", ReportTooltip);
  }

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("mouseenter", ReportTooltip);
  }

  ResetReport();
  const playerId = Number(playersIDs[0]);
  getPlayerSkill(playerId).then((values) => {
    CheckPlayerInShortlist(playerId).then((shortlist_values) => {
      getPlayerReport(playerId, shortlist_values.player_id);
    })
  });

  const ReportUpButton = document.querySelector("#ReportUpButton");
  const ReportDownButton = document.querySelector("#ReportDownButton");

  ReportUpButton.removeEventListener("click", ChangePlayerUpButton);
  ReportDownButton.removeEventListener("click", ChangePlayerDownButton);

  ReportUpButton.addEventListener("click", ChangePlayerUpButton);
  ReportDownButton.addEventListener("click", ChangePlayerDownButton);

}

const ReportTooltip = (evt) => {

  const playerId = Number(evt.target.innerText);
  currentPlayerViewID = playersIDs.indexOf(evt.target.innerText);
  console.log(playersIDs);
  console.log(currentPlayerViewID);

  ResetReport();
  getPlayerSkill(playerId).then((values) => {
    CheckPlayerInShortlist(playerId).then((shortlist_values) => {
      getPlayerReport(playerId, shortlist_values.player_id);
    })
  });
}

const ChangePlayerUpButton = () => {
  const oldCurrentPlayerViewID = currentPlayerViewID;
  const newCurrentPlayerViewID = Math.max(0, oldCurrentPlayerViewID - 1);
  if (oldCurrentPlayerViewID !== newCurrentPlayerViewID) {
    currentPlayerViewID = newCurrentPlayerViewID;
    const playerId = Number(playersIDs[currentPlayerViewID]);
    ResetReport();
    getPlayerSkill(playerId).then((values) => {
      CheckPlayerInShortlist(playerId).then((shortlist_values) => {
        getPlayerReport(playerId, shortlist_values.player_id);
      })
    });
  }

}

const ChangePlayerDownButton = () => {
  const oldCurrentPlayerViewID = currentPlayerViewID;
  const newCurrentPlayerViewID = Math.min(playersIDs.length - 1, oldCurrentPlayerViewID + 1);
  if (oldCurrentPlayerViewID !== newCurrentPlayerViewID) {
    currentPlayerViewID = newCurrentPlayerViewID;
    const playerId = Number(playersIDs[currentPlayerViewID]);
    ResetReport();
    getPlayerSkill(playerId).then((values) => {
      CheckPlayerInShortlist(playerId).then((shortlist_values) => {
        getPlayerReport(playerId, shortlist_values.player_id);
      })
    });
  }
}



div.onclick = function () {
  div_area.innerHTML =
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 190px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "Loading..." +
    " </td></tr><tr><td>Last Week: </td><td> " +
    "</td></tr>      </table></b></div>";
  getYthPullsData()
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function getYthPullsData() {
  let sleep_time = 3000;
  let playersReqSize = 30;
  let Promise_Array = [];
  let leaugeSize = Math.ceil(leauges_array.length / playersReqSize);
  let FailedReqs = [];
  let FailedReqs2 = [];

  for (let i = 0; i < leaugeSize - 1; i++) {
    for (let j = i * playersReqSize; j < (i + 1) * playersReqSize; j++) {
      let result = request(leauges_array[j]);
      result.then(
        function (v) {
          Promise_Array.push(result);
        },
        function (e) {
          FailedReqs.push(leauges_array[j])
        })
    }
    await sleep(sleep_time);
  }
  for (let j = (leaugeSize - 1) * playersReqSize; j < leauges_array.length; j++) {
    let result = request(leauges_array[j]);
    result.then(
      function (v) {
        Promise_Array.push(result);
      },
      function (e) {
        FailedReqs.push(leauges_array[j])
      })
  }
  await sleep(sleep_time);


  leaugeSize = Math.ceil(FailedReqs.length / playersReqSize);

  for (let i = 0; i < leaugeSize - 1; i++) {
    for (let j = i * playersReqSize; j < (i + 1) * playersReqSize; j++) {
      let result = request(FailedReqs[j]);
      result.then(
        function (v) {
          Promise_Array.push(result);
        },
        function (e) {
          FailedReqs2.push(FailedReqs[j])
        })
    }
    await sleep(sleep_time);
  }
  for (let j = (leaugeSize - 1) * playersReqSize; j < FailedReqs.length; j++) {
    let result = request(FailedReqs[j]);
    result.then(
      function (v) {
        Promise_Array.push(result);
      },
      function (e) {
        FailedReqs2.push(FailedReqs[j])
      })
  }

  await sleep(sleep_time);


  leaugeSize = Math.ceil(FailedReqs2.length / playersReqSize);

  for (let i = 0; i < leaugeSize - 1; i++) {
    for (let j = i * playersReqSize; j < (i + 1) * playersReqSize; j++) {
      let result = request(FailedReqs2[j]);
      result.then(
        function (v) {
          Promise_Array.push(result);
        },
        function (e) {
          // FailedReqs2.push(FailedReqs[j])
        })
    }
    await sleep(sleep_time);
  }
  for (let j = (leaugeSize - 1) * playersReqSize; j < FailedReqs2.length; j++) {
    let result = request(FailedReqs2[j]);
    result.then(
      function (v) {
        Promise_Array.push(result);
      },
      function (e) {
        // FailedReqs2.push(FailedReqs[j])
      })
  }

  await sleep(sleep_time);



  Promise.all(Promises_Array).then(() => {
    getIDs(feeds_array);
    BuildResult(last_week, older);
    OpenAllPullsButton.disabled = false;
    OpenLastWeekButton.disabled = false;
    OpenOlderButton.disabled = false;
  });
}

OpenAllPullsButton.onclick = function () {
  let links = $("#table > div > div > a")
  open_links(links);

};

OpenLastWeekButton.onclick = function () {
  let links = $("#table > #LastWeekPulls > div > a")
  open_links(links);

};

OpenOlderButton.onclick = function () {
  let links = $("#table > #OlderPulls > div > a")
  open_links(links);
};

function open_links(links) {
  for (let i = 0; i < links.length; i++) {
    window.open(links[i].href, '_blank');
  }
}

function getLastSaturday() {
  let MILLIS_PER_DAY = 86400000;
  let currentDate = new Date;
  let daysDifference = (currentDate.getDay() - 5 + 6) % 7 + 1;
  let LastFriday = new Date(currentDate.getTime() - MILLIS_PER_DAY * daysDifference);
  let LastSaturday = LastFriday.setDate(LastFriday.getDate() + 1);
  let LastSaturdayDate = new Date(LastSaturday);
  LastSaturdayDate.setHours(0, 0, 0, 0)
  return LastSaturdayDate
}

////////////////////////////////////////////////////////////////////////////////////////////////



// Iniz The Table //
function present() {
  // playerId = player_id.toString()
  let scoutReport =
    "<div class=\"box\" id = \"reportBox\">" +
    "<div class=\"box_head\">" +
    '<h2 class="std" style="display: flex;flex-direction: row;align-items: center;justify-content: space-around;/* text-align: center; */">' +
    '<button class="button" id="ReportDownButton" style="width:90px; padding: 0;">' +
    '<img src="/pics/icons/squad_down.png" style="position: relative; top: -2px;"> Down</button> REPORT' +
    '<button class="button" id="ReportUpButton" style="width:90px; padding: 0;">' +
    '<img src="/pics/icons/squad_up.png" style="position: relative; top: -2px;"> Up</button> </h2> ' +
    "</div>" +
    "<div class=\"box_body\">" +
    "<div class=\"box_shadow\"></div>" +
    "<div id=\"Report_content\" class=\"content_menu\"></div>" +
    "</div>" +
    "<div class=\"box_footer\">" +
    "<div></div>" +
    "</div>" +
    "</div>";
  $(".column3_a").append(scoutReport);



  let Report_content = "<table><tbody id='" + REPORT_TABLE_BODY_ID + "'></tbody></table>";
  $("#Report_content").append(Report_content);
  let tbody = $('#' + REPORT_TABLE_BODY_ID)[0];



  /*Player Name*/
  let trPlayerName = document.createElement('tr');

  let tdPlayerNameLabel = document.createElement('td');
  tdPlayerNameLabel.innerText = 'Player Name';

  let tdPlayerName = document.createElement('td');
  tdPlayerName.id = 'tdPlayerName';

  let linkPlayerName = document.createElement('a');
  linkPlayerName.id = 'linkPlayerName';
  linkPlayerName.style.borderTop = 'none';
  linkPlayerName.style.backgroundColor = 'transparent';
  linkPlayerName.style.paddingLeft = "0px";
  linkPlayerName.style.paddingTop = "4px";
  linkPlayerName.style.paddingBottom = "4px";

  tdPlayerName.appendChild(linkPlayerName);

  trPlayerName.appendChild(tdPlayerNameLabel);
  trPlayerName.appendChild(tdPlayerName);
  tbody.appendChild(trPlayerName);

  /*Player ID*/
  let trPlayerID = document.createElement('tr');
  trPlayerID.className = 'odd';

  let tdPlayerIDLabel = document.createElement('td');
  tdPlayerIDLabel.innerText = 'Player ID:';

  let tdPlayerID = document.createElement('td');
  tdPlayerID.id = 'tdPlayerID';

  let linkPlayerID = document.createElement('a');
  linkPlayerID.id = 'linkPlayerID';
  linkPlayerID.style.borderTop = 'none';
  linkPlayerID.style.backgroundColor = 'transparent';
  linkPlayerID.style.paddingLeft = "0px";
  linkPlayerID.style.paddingTop = "4px";
  linkPlayerID.style.paddingBottom = "4px";
  tdPlayerID.appendChild(linkPlayerID);

  trPlayerID.appendChild(tdPlayerIDLabel);
  trPlayerID.appendChild(tdPlayerID);
  tbody.appendChild(trPlayerID);


  /*Recommendation*/
  let trRec = document.createElement('tr');

  let tdRecLabel = document.createElement('td');
  tdRecLabel.innerText = 'Recommendation [5]: ';

  let tdRec = document.createElement('td');
  tdRec.id = 'tdRecommendation';

  colorId(tdRec, 'Rec');

  trRec.appendChild(tdRecLabel);
  trRec.appendChild(tdRec);
  tbody.appendChild(trRec);

  /*Potential*/
  let trPotential = document.createElement('tr');
  trPotential.className = 'odd';

  let tdPotentialLabel = document.createElement('td');
  tdPotentialLabel.innerText = 'Potential [20]: ';

  let tdPotential = document.createElement('td');
  tdPotential.id = 'tdPotential';

  colorId(tdPotential, 'Potential');

  trPotential.appendChild(tdPotentialLabel);
  trPotential.appendChild(tdPotential);
  tbody.appendChild(trPotential);

  /*Skill Potential*/
  let trSkillPotential = document.createElement('tr');

  let tdSkillPotentialLabel = document.createElement('td');
  tdSkillPotentialLabel.innerText = 'Skill Potential: ';

  let tdSkillPotential = document.createElement('td');
  tdSkillPotential.id = 'tdSkillPotential';

  colorId(tdSkillPotential, 'SkillPotential');

  trSkillPotential.appendChild(tdSkillPotentialLabel);
  trSkillPotential.appendChild(tdSkillPotential);
  tbody.appendChild(trSkillPotential);

  /* Age */

  let trAge = document.createElement('tr');
  trAge.className = "odd";

  let tdAgeLabel = document.createElement('td');
  tdAgeLabel.innerText = 'Age: ';

  let tdAge = document.createElement('td');
  tdAge.id = 'tdAge';
  colorId(tdAge, 'Age');


  trAge.appendChild(tdAgeLabel);
  trAge.appendChild(tdAge);
  tbody.appendChild(trAge);

  /*Bloom Status*/
  let trBloomStatus = document.createElement('tr');

  let tdBloomStatusLabel = document.createElement('td');
  tdBloomStatusLabel.innerText = 'Bloom Status:';

  let tdBloomStatus = document.createElement('td');
  tdBloomStatus.id = 'tdBloomStatus';
  colorId(tdBloomStatus, 'BloomStatus');

  trBloomStatus.appendChild(tdBloomStatusLabel);
  trBloomStatus.appendChild(tdBloomStatus);
  tbody.appendChild(trBloomStatus);


  /*Talent */
  let trTalent = document.createElement('tr');
  trTalent.className = 'odd';

  let tdTalentLabel = document.createElement('td');
  tdTalentLabel.innerText = 'Talent:';

  let tdTalent = document.createElement('td');
  tdTalent.id = 'tdTalent';
  colorId(tdTalent, 'Talent');

  trTalent.appendChild(tdTalentLabel);
  trTalent.appendChild(tdTalent);
  tbody.appendChild(trTalent);

  /*Boost */
  let trBoost = document.createElement('tr');

  let tdBoostLabel = document.createElement('td');
  tdBoostLabel.innerText = 'Boost:';

  let tdBoost = document.createElement('td');
  tdBoost.id = 'tdBoost';
  colorId(tdBoost, 'Boost');

  trBoost.appendChild(tdBoostLabel);
  trBoost.appendChild(tdBoost);
  tbody.appendChild(trBoost);

  /*Physical Peak*/
  let trPhysicalPeak = document.createElement('tr');
  trPhysicalPeak.className = 'odd';

  let tdPhysicalPeakLabel = document.createElement('td');
  tdPhysicalPeakLabel.innerText = 'Physical Peak: ';

  let tdPhysicalPeak = document.createElement('td');
  tdPhysicalPeak.id = 'tdPhysicalPeak';
  tdPhysicalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>'
  trPhysicalPeak.appendChild(tdPhysicalPeakLabel);
  trPhysicalPeak.appendChild(tdPhysicalPeak);
  tbody.appendChild(trPhysicalPeak);

  /*Tactical Peak*/
  let trTacticalPeak = document.createElement('tr');

  let tdTacticalPeakLabel = document.createElement('td');
  tdTacticalPeakLabel.innerText = 'Tactical Peak: ';

  let tdTacticalPeak = document.createElement('td');
  tdTacticalPeak.id = 'tdTacticalPeak';

  tdTacticalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>';

  trTacticalPeak.appendChild(tdTacticalPeakLabel);
  trTacticalPeak.appendChild(tdTacticalPeak);
  tbody.appendChild(trTacticalPeak);

  /*Technical Peak*/
  let trTechnicalPeak = document.createElement('tr');
  trTechnicalPeak.className = 'odd';

  let tdTechnicalPeakLabel = document.createElement('td');
  tdTechnicalPeakLabel.innerText = 'Technical Peak: ';

  let tdTechnicalPeak = document.createElement('td');
  tdTechnicalPeak.id = 'tdTechnicalPeak';
  tdTechnicalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>';


  trTechnicalPeak.appendChild(tdTechnicalPeakLabel);
  trTechnicalPeak.appendChild(tdTechnicalPeak);
  tbody.appendChild(trTechnicalPeak);


  /*Specialty Peak*/
  let trSpecialty = document.createElement('tr');

  let tdSpecialtyLabel = document.createElement('td');
  tdSpecialtyLabel.innerText = 'Specialty: ';

  let tdSpecialty = document.createElement('td');
  tdSpecialty.id = 'tdSpecialty';
  colorId(tdSpecialty, 'Specialty');


  trSpecialty.appendChild(tdSpecialtyLabel);
  trSpecialty.appendChild(tdSpecialty);
  tbody.appendChild(trSpecialty);


  /*Scout Info / Bid Info*/
  let trReportType = document.createElement('tr');
  trReportType.className = 'odd';

  let tdReportTypeLabel = document.createElement('td');
  tdReportTypeLabel.innerText = 'Report Type: ';

  let tdReportType = document.createElement('td');
  tdReportType.id = 'tdReportType';
  colorId(tdReportType, 'Report_Type');

  trReportType.appendChild(tdReportTypeLabel);
  trReportType.appendChild(tdReportType);
  tbody.appendChild(trReportType);



  /*Shortlist */
  let trShortlist = document.createElement('tr');

  let tdShortlistLabel = document.createElement('td');
  tdShortlistLabel.innerText = 'Shortlist: ';

  let tdShortlist = document.createElement('td');
  tdShortlist.id = 'tdShortlist';


  trShortlist.appendChild(tdShortlistLabel);
  trShortlist.appendChild(tdShortlist);
  tbody.appendChild(trShortlist);


  const nodes = document.querySelectorAll('.column3_a .box')
  const filtered = [...nodes].filter(n => n.textContent.includes('REPORT'))
  const box_footer = (filtered[0]).getElementsByClassName('box_footer');
  box_footer[0].style.margin = '-1.5px 0'


  $(window).scroll(function () {
    $("#reportBox").stop().animate(
      { "marginTop": (Math.max(3, $(window).scrollTop() - 500)) + "px" },
      "slow");
  });
}

// Check If Player is in the ShortList
function CheckPlayerInShortlist(playerId) {
  return $.get("//autoscoutproject.com/scout/api/shortlist/read_single.php", {
    "player_id": playerId
  })
}

// Get Player Report Data//
function getPlayerReport(playerId, shortlistCheck) {
  $.get("//autoscoutproject.com/scout/api/report/read.php", {
    "player_id": playerId
  }, function (response) {
    let data = response;
    updatePlayerLinkAndName(playerId);
    updateAge();
    updateShortlist(shortlistCheck);
    if (data.boost != null && data.talent != null && data.boost_age != null) {
      updatePotential(data)
    };
    if (data.boost_age != null) {
      updateBloomStatus(data);
    }

    if (data.boost != null && data.talent != null) {
      updateTalentBoost(data);
    };
    if (data.specialty != null) {
      updateSpecialty(data);
    };
    updatePeaks(data);
    updateReportType(data);
  })
}

// Get Player Data - age, month , fav pos , skill index
function getPlayerSkill(playerId) {
  return $.post("//trophymanager.com/ajax/tooltip.ajax.php", {
    "player_id": playerId
  }, function (response) {
    let data = JSON.parse(response);
    player.age = parseInt(data.player.age);
    player.months = parseInt(data.player.months);
    player.skill_index = data.player.skill_index;
    player.favposition = data.player.favposition;
    player.name = data.player.name;
    player.name = player.name.replace(/&#39;[^|]+&#39;/g, '');
    player.name = player.name.replace(/ +(?= )/g, '');
    player.skill_index = getSkillsFromASI(player)
  })
}

// Convert ASI to Skill Index //
function getSkillsFromASI(player) {
  let skill_index = parseInt(player.skill_index.split(",").join(''))
  let index = 0.0;
  let ch = 0.0;
  if (player.favposition == "gk") {
    index = (0.143);
    ch = 0.02979;
  }
  else {
    index = (1 / 6.99998);
    ch = 0.023359;
  }
  skill_index = Math.pow(skill_index, index) / ch;
  skill_index = skill_index.toFixed(1);
  return skill_index
}

// Calc Future Skill Potential//
function calcSkillPotential(data) {
  let talent = parseFloat(data.talent);
  let boost = parseFloat(data.boost);
  let boost_age = parseInt(data.boost_age);
  let skills = parseFloat(player.skill_index);
  let boost_per = player.age > (boost_age + 2) ? 0 : player.age < (boost_age) ? 36 : (1 + (boost_age + 3 - player.age - 1) * 12 + (11 - player.months))
  let SkillPotential = TalentRate[player.age - 15][player.months] * talent + (boost * boost_per / 36) + skills;
  return Math.round(SkillPotential)
}


// Calc Potentiel 1-20  //
function calcPotentiel(SkillPotential) {
  let Rec = ''
  if (player.favposition != "gk") {
    if (SkillPotential > 219) {
      Rec = '20';
      return Rec;
    }
    if (SkillPotential > 199) {
      Rec = '19';
      return Rec;
    }
    if (SkillPotential > 189) {
      Rec = '18';
      return Rec;
    }
    if (SkillPotential > 179) {
      Rec = '17';
      return Rec;
    }
    if (SkillPotential > 169) {
      Rec = '16';
      return Rec;
    }
    if (SkillPotential > 159) {
      Rec = '15';
      return Rec;
    }
    if (SkillPotential > 149) {
      Rec = '14';
      return Rec;
    }
    if (SkillPotential > 139) {
      Rec = '13';
      return Rec;
    }

    if (SkillPotential <= 139) {
      Rec = 'Below 13';
      return Rec;
    }
  }
  else {
    if (SkillPotential > 172) {
      Rec = '20';
      return Rec;
    }
    if (SkillPotential > 157) {
      Rec = '19';
      return Rec;
    }
    if (SkillPotential > 149) {
      Rec = '18';
      return Rec;
    }
    if (SkillPotential > 141) {
      Rec = '17';
      return Rec;
    }
    if (SkillPotential > 133) {
      Rec = '16';
      return Rec;
    }
    if (SkillPotential > 125) {
      Rec = '15';
      return Rec;
    }
    if (SkillPotential > 117) {
      Rec = '14';
      return Rec;
    }
    if (SkillPotential > 109) {
      Rec = '13';
      return Rec;
    }

    if (SkillPotential <= 109) {
      Rec = 'Below 13';
      return Rec;
    }
  }
}


// Calc Potentiel Recommendation  //
function calcRecommendation(SkillPotential) {
  let Potential = ''
  if (player.favposition != "gk") {

    if (SkillPotential > 209) {
      Potential = '5.0';
      return Potential;
    }
    if (SkillPotential > 179) {
      Potential = '4.5';
      return Potential;
    }

    if (SkillPotential > 159) {
      Potential = '4.0';
      return Potential;
    }
    if (SkillPotential > 139) {
      Potential = '3.5';
      return Potential;
    }
    if (SkillPotential <= 139) {
      Potential = 'Below 3.5';
      return Potential;
    }
  }
  else {
    if (SkillPotential > 164) {
      Potential = '5.0';
      return Potential;
    }
    if (SkillPotential > 141) {
      Potential = '4.5';
      return Potential;
    }

    if (SkillPotential > 125) {
      Potential = '4.0';
      return Potential;
    }
    if (SkillPotential > 109) {
      Potential = '3.5';
      return Potential;
    }
    if (SkillPotential <= 109) {
      Potential = 'Below 3.5';
      return Potential;
    }
  }
}

function updateAge() {
  let tdAge = document.getElementById("tdAge");
  let months = player.months < 10 ? ("0" + player.months) : player.months;
  tdAge.innerText = player.age + "." + months;
}

function updateShortlist(isPlayerInShortlist) {
  let tdShortlist = document.getElementById("tdShortlist");
  if (isPlayerInShortlist == null) {
    tdShortlist.innerText = '❌';
  }
  else {
    tdShortlist.innerText = '✅';
  }
}

function updatePlayerLinkAndName(playerID) {
  let linkPlayerName = document.getElementById("linkPlayerName");
  let linkPlayerID = document.getElementById("linkPlayerID");
  let link = "".concat("https://trophymanager.com/players/", playerID);
  linkPlayerName.href = link;
  linkPlayerName.innerText = player.name;
  linkPlayerID.href = link;
  linkPlayerID.innerText = playerID;
}

// Update Potential In The Report //
function updatePotential(data) {
  let tdRec = document.getElementById("tdRecommendation");
  let tdPotential = document.getElementById("tdPotential");
  let tdSkillPotential = document.getElementById("tdSkillPotential");
  let SkillPotential = calcSkillPotential(data);
  tdRec.innerText = calcRecommendation(SkillPotential);
  tdPotential.innerText = calcPotentiel(SkillPotential);
  tdSkillPotential.innerText = SkillPotential;

}

// Update Bloom Status In The Report //
function updateBloomStatus(data) {
  let tdBloomStatus = document.getElementById("tdBloomStatus");
  tdBloomStatus.innerText = data.boost_age + ".00 - " + (parseInt(data.boost_age) + 2).toString() + ".11"
}

// Update Talent & Boost In The Report //
function updateTalentBoost(data) {
  let tdTalent = document.getElementById("tdTalent");
  let tdBoost = document.getElementById("tdBoost");
  tdTalent.innerText = data.talent;
  tdBoost.innerText = data.boost;

}

function updateSpecialty(data) {
  let tdSpecialty = document.getElementById("tdSpecialty");
  tdSpecialty.innerText = data.specialty;
}

function updateReportType(data) {
  let tdReportType = document.getElementById("tdReportType");
  tdReportType.innerText = data.report_type;
}

// Update Peaks In The Report //

function updatePeaks(data) {
  let tdPhysicalPeakText = document.getElementById("tdPhysicalPeak").getElementsByClassName("TextPeak")[0];
  let tdPhysicalPeakNumber = document.getElementById("tdPhysicalPeak").getElementsByClassName("NumberPeak")[0];



  let tdTacticalPeakText = document.getElementById("tdTacticalPeak").getElementsByClassName("TextPeak")[0];
  let tdTacticalPeakNumber = document.getElementById("tdTacticalPeak").getElementsByClassName("NumberPeak")[0];


  let tdTechnicalPeakText = document.getElementById("tdTechnicalPeak").getElementsByClassName("TextPeak")[0];
  let tdTechnicalPeakNumber = document.getElementById("tdTechnicalPeak").getElementsByClassName("NumberPeak")[0];

  if (data.phy != null) {
    tdPhysicalPeakText.innerText = getPeakText(data.phy, "Physical");
    tdPhysicalPeakNumber.innerText = "(" + data.phy + ")";
  };

  if (data.tac != null) {
    tdTacticalPeakText.innerText = getPeakText(data.tac, "Tactical");
    tdTacticalPeakNumber.innerText = "(" + data.tac + ")";
  }
  if (data.tec != null) {
    tdTechnicalPeakText.innerText = getPeakText(data.tec, "Technical");
    tdTechnicalPeakNumber.innerText = "(" + data.tec + ")";
  }
}

// Get Peaks Text //
function getPeakText(peakStr, peak_type) {
  let peak = parseInt(peakStr);
  let peak_text = ''
  let peak_options = ['Splendid  ', 'Good  ', 'Ok  ', 'Poor  ']
  if (['Physical', 'Tactical'].includes(peak_type)) {
    if (peak > 69) {
      peak_text = peak_options[0]
    }
    if (peak > 59 && peak < 70) {
      peak_text = peak_options[1]
    }
    if (peak > 49 && peak < 60) {
      peak_text = peak_options[2]
    }
    if (peak < 50) {
      if (peak_type == "Physical") {
        peak_text = 'Weak  '
      }
      else {
        peak_text = peak_options[3]
      }
    }
  }

  if (['Technical'].includes(peak_type)) {
    if (peak > 104) {
      peak_text = peak_options[0]
    }
    if (peak > 89 && peak < 105) {
      peak_text = peak_options[1]
    }
    if (peak > 74 && peak < 90) {
      peak_text = peak_options[2]
    }
    if (peak < 75) {
      peak_text = peak_options[3]
    }
  }
  return peak_text;
}


// Set Color For TD //
function colorId(td, type) {

  if (['Specialty', 'Report_Type'].includes(type)) {
    td.style.color = COLOR[4];
    return;
  }

  if (['Potential', 'Rec', 'SkillPotential'].includes(type)) {
    td.style.color = COLOR[3];
    return;
  }
  if (['BloomStatus', 'Age'].includes(type)) {
    td.style.color = COLOR[2];
    return;
  }

  if (['Talent', 'Boost'].includes(type)) {
    td.style.color = COLOR[1];
    return;
  }

}

function ResetReport() {

  let linkPlayerName = document.getElementById("linkPlayerName");
  let linkPlayerID = document.getElementById("linkPlayerID");


  let tdRec = document.getElementById("tdRecommendation");
  let tdPotential = document.getElementById("tdPotential");
  let tdSkillPotential = document.getElementById("tdSkillPotential");
  let tdBloomStatus = document.getElementById("tdBloomStatus");

  let tdTalent = document.getElementById("tdTalent");
  let tdBoost = document.getElementById("tdBoost");


  let tdPhysicalPeakText = document.getElementById("tdPhysicalPeak").getElementsByClassName("TextPeak")[0];
  let tdPhysicalPeakNumber = document.getElementById("tdPhysicalPeak").getElementsByClassName("NumberPeak")[0];

  let tdTacticalPeakText = document.getElementById("tdTacticalPeak").getElementsByClassName("TextPeak")[0];
  let tdTacticalPeakNumber = document.getElementById("tdTacticalPeak").getElementsByClassName("NumberPeak")[0];


  let tdTechnicalPeakText = document.getElementById("tdTechnicalPeak").getElementsByClassName("TextPeak")[0];
  let tdTechnicalPeakNumber = document.getElementById("tdTechnicalPeak").getElementsByClassName("NumberPeak")[0];

  let tdSpecialty = document.getElementById("tdSpecialty");
  let tdReportType = document.getElementById("tdReportType");

  let tdAge = document.getElementById("tdAge");
  let tdShortlist = document.getElementById("tdShortlist");

  tdAge.innerText = "";
  tdShortlist.innerText = '';

  linkPlayerName.href = "";
  linkPlayerName.innerText = "";
  linkPlayerID.href = "";
  linkPlayerID.innerText = "";

  tdRec.innerText = "";
  tdPotential.innerText = "";
  tdSkillPotential.innerText = "";
  tdBloomStatus.innerText = "";
  tdTalent.innerText = "";
  tdBoost.innerText = "";


  tdPhysicalPeakText.innerText = "";
  tdPhysicalPeakNumber.innerText = "";


  tdTacticalPeakText.innerText = "";
  tdTacticalPeakNumber.innerText = "";

  tdTechnicalPeakText.innerText = "";
  tdTechnicalPeakNumber.innerText = "";

  tdSpecialty.innerText = "";
  tdReportType.innerText = "";


}


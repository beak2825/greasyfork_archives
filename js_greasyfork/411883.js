// ==UserScript==
// @name           Check Yth Pulls Feed V3.1
// @version        3.1.1
// @description    This Tool Calculate peaks Increment in each peak
// @author       Omer Ben Yosef
// @include			https://trophymanager.com/league/*
// @include			https://trophymanager.com/league/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/411883/Check%20Yth%20Pulls%20Feed%20V31.user.js
// @updateURL https://update.greasyfork.org/scripts/411883/Check%20Yth%20Pulls%20Feed%20V31.meta.js
// ==/UserScript==

var div = "";
var div_area = "";
var Promises_Array = [];
var Promises_Array_Players = [];

var ids_array = [];
var feeds_array = [];
var user = 0; //kobi - 0 , omer - 1//
var leauges_array = [];
var players = [];
var output_text = "";

if (user == 0) {
  leauges_array = [
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
  ];
}

if (user == 1) {
  leauges_array = [
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
    { country: "za", division: "1", group: "1" },
  ];
}

iniz_form();

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
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 100px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "" +
    " </td></tr><tr><td>IDs: </td><td> " +
    "</td></tr>      </table></b></div>";

  div2 = document.createElement("BUTTON");
  document.getElementsByClassName("box")[0].appendChild(div2);
  div2.setAttribute(
    "style",
    "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 50px;"
  );
  div2.innerHTML = "<p><b>Copy</b></p>";
  div2.disabled = true;
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

function request_player_info(id) {
  return $.ajax({
    url: "https://trophymanager.com/ajax/tooltip.ajax.php",
    type: "POST",
    dataType: "json",
    data: {
      player_id: id,
    },
    error: function (xhr, error) {
      console.log(error);
    },
    success: function (data) {
      player = data.player;
      player_name = player.name;
      if (player_name.indexOf("&#39;") != -1) {
          player_name = (player.name).split("&#39;")
          player_name = player_name[0] + player_name[player_name.length-1].trim()
      }
      players.push({
        id: player.player_id,
        name: player_name,
        pull_age: player.age,
      });
    },
  });
}

function runCheck(Promises, array, func) {
  for (var i = 0; i < array.length; i++) {
    Promises.push(func(array[i]));
  }
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
            }
          }
        }
      }
    }
  }
}

function BuildResult(ids_array) {
  div_area.innerHTML =
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 550px; margin-top: 100px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "YES" +
    " </td></tr><tr><td>IDs: </td><td> " +
    "</td></tr>      </table></b></div>";
  if (ids_array.length > 0) {
    for (var j = 0; j < ids_array.length; j++) {
      div = document.createElement("div");
      a = document.createElement("a");
      link = "".concat("https://trophymanager.com/players/", ids_array[j]);
      a.href = link;
      a.innerText = ids_array[j];
      tra = document.createElement("tr");
      div.append(a);
      div.append(tra);
      $("#table").append(div);
    }
  }
}

function textToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

div.onclick = function () {
  div_area.innerHTML =
    '<div style="position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 100px; color: white;  outset; display:inline;"><table id = \'table\' style="margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px">&nbsp;<tr><td>Done: </td><td>' +
    "Loading..." +
    " </td></tr><tr><td>IDs: </td><td> " +
    "</td></tr>      </table></b></div>";

  runCheck(Promises_Array, leauges_array, request);
  Promise.all(Promises_Array).then((values) => {
    getIDs(feeds_array);
    runCheck(Promises_Array_Players, ids_array, request_player_info);
    BuildResult(ids_array);
    Promise.all(Promises_Array_Players).then((values) => {
      BuildTextPlayers(players);
      div2.disabled = false;
    });
  });
};

function BuildTextPlayers(players) {
  output_text = "";
  for (var i = 0; i < players.length; i++) {
    link =
      '"' +
      "https://trophymanager.com/players/" +
      players[i].id +
      "#/page/history/" +
      '"';
    name = '"' + players[i].name + '"';
    pull_age = players[i].pull_age;
    output_text = output_text.concat(
      "=HYPERLINK(",
      link,
      ",",
      name,
      ")	",
      pull_age,
      " \n "
    );
  }
  output_text = output_text.trim();
}

div2.onclick = function () {
  textToClipboard(output_text);
};

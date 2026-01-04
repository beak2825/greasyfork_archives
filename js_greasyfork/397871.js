// ==UserScript==
// @name           Check Yth Pulls Feed
// @version        2.0.2
// @description    This Tool Calculate peaks Increment in each peak
// @author       Omer Ben Yosef
// @include			https://trophymanager.com/league/*
// @include			https://trophymanager.com/league/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/397871/Check%20Yth%20Pulls%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/397871/Check%20Yth%20Pulls%20Feed.meta.js
// ==/UserScript==

var div = document.createElement("BUTTON");
document.getElementsByClassName("box")[0].appendChild(div);
div.setAttribute("style", "position: absolute; z-index: 1; width: 185px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 5px;");
div.innerHTML = "<p><b>Check Yth Pulls Feed</b></p>";

var div_area = document.createElement('div');
var count_players = 0 ;

document.getElementsByClassName("box")[0].appendChild(div_area);
div_area.innerHTML = "<div style=\"position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 60px; color: white;  outset; display:inline;\"><table id = 'table' style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>Players Found: </td><td>" + count_players + " </td></tr><tr><td>IDs: </td><td> "  +  "</td></tr>      </table></b></div>";

$.when($.ajax()).then(function () {
    div.click();
});

div.onclick=function()
{
    var array_list = feed.feed;
    var ids_array = [];
    var index = 0;
    var yth_val = 0;
    for (var i = 0 ; i < array_list.length ; i++) {
        yth_val = array_list[i].text.indexOf("has signed a new talent from their youth academy")
        if (yth_val > -1) {
            index = feed.feed[i].text.indexOf("[potential_stars=10]")
            if (index > -1) {
                ids_array.push(feed.feed[i].attributes.extra[0]);
            }
          var myProp = 'sub_entries';

          if(array_list[i].hasOwnProperty(myProp)){
          array_subs = array_list[i].sub_entries;
          for (var k = 0 ; k < array_subs.length ; k++) {
            index = array_subs[k].text.indexOf("[potential_stars=10]")
            if (index > -1) {
                ids_array.push(array_subs[k].attributes.extra[0]);
            }
          }
          }
        }
    }
  if (ids_array.length == 0) {
  count_players = 'NO';
  }
  else {
   count_players = 'YES';
  }
  div_area.innerHTML = "<div style=\"position: absolute; z-index: 1;background-color: #4e7525 ; width: 186px; height: 120px; margin-top: 60px; color: white;  outset; display:inline;\"><table id = 'table' style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>Players Found: </td><td>" + count_players + " </td></tr><tr><td>IDs: </td><td> "  +  "</td></tr>      </table></b></div>";
     if (ids_array.length > 0) {
   for (var j = 0 ; j < ids_array.length;j++) {
       div = document.createElement("div");
       a = document.createElement("a");
       link = "".concat('https://trophymanager.com/players/' , ids_array[j])
       a.href = link
       a.innerText = ids_array[j]
       tra = document.createElement("tr");
       div.append(a);
       div.append(tra)
       $( "#table" ).append(div);


     }
   }
}
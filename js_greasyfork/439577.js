// ==UserScript==
// @name     empornium - top tags
// @description	Empornium - show most commonly used tags in search results
// @namespace conquerist2@gmail.com
// @version  1.0
// @include  https://www.empornium.sx/torrents.php*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/439577/empornium%20-%20top%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/439577/empornium%20-%20top%20tags.meta.js
// ==/UserScript==
// 2022 02 05 - 1.0 - initial version

var tags = document.querySelectorAll('.tags a');
var tag_db = {};

var num_torrents = document.querySelectorAll('.torrent').length;


for (var i = 0; i < tags.length; i++)
{
  tag_text = tags[i].text;
  if( tag_text in tag_db ) {
    tag_db[tag_text]++;
  } else {
  	tag_db[tag_text] = 1;
  }
  
  //console.log(tag_text + ": " + tag_db[tag_text]);
}


// Create items array
var tag_array = Object.keys(tag_db).map(function(key) {
  return [key, tag_db[key]];
});

// Sort the array based on the second element
tag_array.sort(function(first, second) {
  return second[1] - first[1];
});

// Create a new array with only the first 5 items
console.log(tag_array.slice(0, 5));

var tag_list = document.querySelectorAll('.taglist a');
for (var i = 0; i < tag_list.length; i++)
{
  if(i > tag_db.length) {
  	break;
  }
  tag_list[i].text = tag_array[i][0] + ' (' + tag_array[i][1] + ')';
	tag_list[i].setAttribute("onclick", "add_tag(\''" + tag_array[i][0] + "\');return false;");
  if (tag_array[i][1] >= num_torrents/2){
  	tag_list[i].setAttribute("style", "font-size: 125%;");
  } else if (tag_array[i][1] >= num_torrents/3) {
    tag_list[i].setAttribute("style", "font-size: 112.5%;");
  }
}
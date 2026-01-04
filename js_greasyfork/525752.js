// ==UserScript==
// @name        GGn Steam OST description
// @include     https://gazellegames.net/upload.php*
// @match       https://gazellegames.net/torrents.php?action=editgroup*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @version     1.0
// @author      Nyannerz
// @description Tool to help format new uploads pulled from the steam OSTs
// @license MIT
// @namespace https://greasyfork.org/users/1429440
// @downloadURL https://update.greasyfork.org/scripts/525752/GGn%20Steam%20OST%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/525752/GGn%20Steam%20OST%20description.meta.js
// ==/UserScript==

const FORCED_MAX_TRACK_CHARACTER_LENGTH = -1; //Set this to -1 to disable or to any value above 0 to force a consistent "width" of the tracklist. Setting this might cause long track names to jut out of formatting.
                                              //This would mainly be used to have consistent tracklist widths between multiple releases, might lead to having to fix things more frequently though.
const SPACES_AFTER_TRACKNR = 6; //Set this to any value above 0, dictates amount of spaces after the track number in the description's tracklist.
const MINIMUM_SPACES_AFTER_TRACKNAME = 4; //Set this to any value above 0, dictates amount of spaces after the LONGEST track name in the description's tracklist. This dictates total width of the tracklist.
const INCLUDE_OTHER_LANGUAGE_TRACKNAME = true; //Set this to true to include tracknames in other languages, for example the tracks here: https://store.steampowered.com/app/1969070/Songs_of_SamuraizerzZz/

function html2bb(str) { //Shamelessly stolen from GGn New Uploady
    if (!str) return "";
    str = str.replace(/< *br *\/*>/g, "\n\n"); //*/
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *em *>/g, "[i]");
    str = str.replace(/< *\/ *em *>/g, "[/i]");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[align=center][u][b]");
    str = str.replace(/< *h[12] *>/g, "\n[align=center][u][b]");
    str = str.replace(/< *\/ *h[12] *>/g, "[/b][/u][/align]\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n\n");
    str = str.replace(/<p\s+class=["'][^"']+["']>/g, "\n\n"); //Added because the example I'm using has a paragraph with a class.
    str = str.replace(/< *\/ *p *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    return str;
}

function html2nothing(str) {
    if (!str) return "";
    str = str.replace(/< *br *\/*>/g, "\n\n"); //*/
    str = str.replace(/< *b *>/g, "");
    str = str.replace(/< *\/ *b *>/g, "");
    str = str.replace(/< *u *>/g, "");
    str = str.replace(/< *\/ *u *>/g, "");
    str = str.replace(/< *i *>/g, "");
    str = str.replace(/< *\/ *i *>/g, "");
    str = str.replace(/< *strong *>/g, "");
    str = str.replace(/< *\/ *strong *>/g, "");
    str = str.replace(/< *em *>/g, "");
    str = str.replace(/< *\/ *em *>/g, "");
    str = str.replace(/< *li *>/g, "");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n");
    str = str.replace(/< *h[12] *>/g, "\n");
    str = str.replace(/< *\/ *h[12] *>/g, "\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n\n");
    str = str.replace(/<p\s+class=["'][^"']+["']>/g, "\n\n"); //Added because the example I'm using has a paragraph with a class.
    str = str.replace(/< *\/ *p *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    return str;
}

var legalNotice, detailedDescription, releaseDate, steamPublisher, steamUrl;
const parser = new DOMParser();

try {init();}
catch (err) {console.log(err);}

function init()
{
  if(SPACES_AFTER_TRACKNR<=0 || MINIMUM_SPACES_AFTER_TRACKNAME<=0) //Check to prevent user from inputting a value that'll cause issues.
  {
    window.alert('Incorrect values given to either SPACES_AFTER_TRACKNR or MINIMUM_SPACES_AFTER_TRACKNAME in "GGn Steam OST description" code. Change these values or disable the userscript.');
    return;
  }

  var tableRow = null;

  document.getElementById('categories').addEventListener("change", (event) =>
  {
    if(event.target.value === "OST")
    {
      if(tableRow == null)
      {
        tableRow = document.getElementById('torrent_properties').getElementsByTagName('tbody')[0].insertRow();
        var labelCell = tableRow.insertCell();
        labelCell.classList.add('label');
        labelCell.innerHTML = 'Steam ID/Link';
        steamInputCel = tableRow.insertCell();
        steamInputCel.innerHTML = '<input placeholder="Enter Steam OST link/id" type="text" id="steamid_field" size="60"></input> <input type="button" id="steam_OST_lookup" value="Search">';
        document.getElementById('steam_OST_lookup').addEventListener("click", SearchSteamPage);
      }
      else tableRow.style.display = "table-row"; //Need to reenable the row when OST is reselected.
    }
    else
    {
      if(tableRow != null) tableRow.style.display = "none"; //Hides the row when it's no longer relevant. This is better than deleting because it keeps entered values.
    }
  })
}

function SearchSteamPage()
{
  var input = document.getElementById('steamid_field').value;
  if (input == "")
  {
    return; //Search was pressed with nothing put in either field, so there's no need to continue.
  }
  var appidIndex = input.indexOfEnd("store.steampowered.com/app/"); // Find the index where the appid starts
  var appid = '';
  if (appidIndex >0)
  {
    var terminatorIndex = input.indexOf('/',appidIndex);
    if(terminatorIndex<0)appid = input.substr(appidIndex); //If no slash is detected after the appid start, use the rest of the string
    else appid = input.substr(appidIndex,terminatorIndex-appidIndex); //Otherwise, go up to the slash's index
  }
  else appid = input;
  if(!isNumeric(appid))
  {
    window.alert("Search only works with steam store links or the steam app id directly.");
    return;
  }

  var steamResponse = GM.xmlHttpRequest({"method": "GET", "responseType":"json", "url": "https://store.steampowered.com/api/appdetails?l=en&appids="+appid,"onload": checkIfOst(appid)});
}

function checkIfOst(appid)
{
    return (response) =>
    {
      var responseJson = JSON.parse(response.responseText);
      if (response.status != 200 || !responseJson[appid].success)
      {
        window.alert("Could not find steam page at this appid. Please double check input.");
        return;
      }
      else if(responseJson[appid].data.type != "music")
      {
          window.alert("Steam page at this id is not a soundtrack. If you meant the " + responseJson[appid].data.name + " OST, please go to the steam page and find the actual OST steam appid. Otherwise check your input again.");
          return;
      }
      else
      {
          getSteamData(responseJson[appid]); //Some info is only available or better on the steam page, so we have to get that separately.
          GM.xmlHttpRequest({"method": "GET", "url": 'https://store.steampowered.com/app/'+appid,"onload": fillFields()});
      }
    }
}

function getSteamData(responseJson)
{
  legalNotice= html2nothing(responseJson.data.legal_notice);
  detailedDescription = html2nothing(responseJson.data.detailed_description);
  releaseDate = responseJson.data.release_date.date;
  steamPublisher = responseJson.data.publishers[0];
}

function fillFields()
{
  return (dbResponse) =>
  {
    if (dbResponse.status != 200)
    {
      window.alert('Steam store page could not be found, despite steam api page being found earlier. Try again.');
      return;
    }
    steamUrl=dbResponse.finalUrl;
    var htmlDoc = parser.parseFromString(dbResponse.responseText, 'text/html');
    //$("#album_desc").val(legalNotice + detailedDescription + releaseDate);
    var artistName = "";
    var metaDataTitles = htmlDoc.getElementsByClassName('album_metadata_chunk_name');
    for (var i = 0; i <= metaDataTitles.length; i++)
    {
      if(metaDataTitles[i].textContent.toLowerCase().includes('artist'))
      {
        artistName = metaDataTitles[i].nextElementSibling.textContent;
        break;
      }
    }
    if(artistName != "") $("#title").val(htmlDoc.getElementById('appHubAppName').textContent+ ' by '+ artistName);
    else $("#title").val(htmlDoc.getElementById('appHubAppName').textContent);

    $("#year").val(Number(releaseDate.split(',')[1]));

    formDescription(htmlDoc, artistName);
  }
}

function formDescription(htmlDoc, artistName)
{
  var discTables = htmlDoc.getElementsByClassName('music_album_track_listing_ctn');
  var multiDisc = discTables.length>0;
  //Start with initial information bulletpoints
  var fullDescription = "[align=center][size=3][u][b]Album Information\n".concat(htmlDoc.getElementById('appHubAppName').textContent,'[/b][/u][/size][/align]\n\n',
                                                                                  '[*][b]Release Date:[/b] ', releaseDate, '\n',
                                                                                  '[*][b]Media Format:[/b]  Digital\n',
                                                                                  '[*][b]Artist:[/b] ', artistName, '\n',
                                                                                  '[*][b]Publisher:[/b] ', steamPublisher, '\n'
                                                                                  ,'\n');
  //Follow with tracklist

  fullDescription = fullDescription.concat('[align=center][pre]Tracklist\n');

  var maxTrackLength = Number(0);
  var trackName,trackNameCtn, trackDuration, trackNr, discNr, spacesAfterTrackName;
  var isLongerThanTenMin=false;

  if(FORCED_MAX_TRACK_CHARACTER_LENGTH<=0)
  {
    Array.from(discTables).forEach((discTable) =>
    {
      Array.from(discTable.firstElementChild.getElementsByClassName('music_album_track_ctn')).forEach((trackRow) =>
      {
        trackNameCtn = trackRow.getElementsByClassName('music_album_track_name_ctn')[0];
        if(INCLUDE_OTHER_LANGUAGE_TRACKNAME && trackNameCtn.children.length>1) trackName = trackNameCtn.children[0].textContent.trim().concat(' ',trackNameCtn.children[1].textContent.trim());
        else trackName = trackNameCtn.children[0].textContent.trim();
        trackDuration = trackRow.getElementsByClassName('music_album_track_duration')[0].textContent.trim(); //Have to take duration into account, as it can take up extra spaces if longer than 10 min for example.
        maxTrackLength = Math.max(maxTrackLength,trackName.length+trackDuration.length);

      });
    });
    maxTrackLength += MINIMUM_SPACES_AFTER_TRACKNAME;
  }
  else maxTrackLength = FORCED_MAX_TRACK_CHARACTER_LENGTH;

  Array.from(discTables).forEach((discTable) =>
  {
    if(multiDisc)
    {
      discNr = discTable.getAttribute('data-discnumber');
      fullDescription = fullDescription.concat('\nDisc ',discNr,'\n');
    }
    Array.from(discTable.firstElementChild.getElementsByClassName('music_album_track_ctn')).forEach((trackRow) =>
    {
      trackNameCtn = trackRow.getElementsByClassName('music_album_track_name_ctn')[0];
      if(INCLUDE_OTHER_LANGUAGE_TRACKNAME && trackNameCtn.children.length>1) trackName = trackNameCtn.children[0].textContent.trim().concat(' ',trackNameCtn.children[1].textContent.trim());
      else trackName = trackNameCtn.children[0].textContent.trim();
      trackNr = trackRow.getElementsByClassName('music_album_track_number')[0].textContent.trim();
      trackDuration = trackRow.getElementsByClassName('music_album_track_duration')[0].textContent.trim();
      spacesAfterTrackName = maxTrackLength-trackName.length-trackDuration.length; //Remove both the duration and name length from the max length to get the correct spacing.
      fullDescription = fullDescription.concat(trackNr," ".repeat(Math.max(2,SPACES_AFTER_TRACKNR)),trackName," ".repeat(Math.max(MINIMUM_SPACES_AFTER_TRACKNAME,spacesAfterTrackName)),trackDuration,'\n');
    });
  });
  fullDescription = fullDescription.concat('[/pre][/align]\n\n');

  //End with description, legal info and link.
  fullDescription = fullDescription.concat('[align=left][pre]Notes',detailedDescription,legalNotice,'\n','For complete credits and information about this release, please visit Steam:\n',steamUrl,'[/pre][/align]');


  $("#album_desc").val(fullDescription);
}

//Example
/*[align=center][size=3][u][b]Album Information
The Rise of the Golden Idol Soundtrack[/b][/u][/size][/align]

 * [*][b]Release Date:[/b]	Nov 12, 2024
[*][b]Publish Format:[/b] Commercial
[*][b]Release Price:[/b] Unknown (Included with Deluxe Edition)
[*][b]Media Format:[/b] Digital
[*][b]Classification:[/b] Original Soundtrack
[*][b]Exclusive Retailer:[/b] Steam
[*][b]Publisher:[/b] Playstack
[*][b]Composer:[/b] Paul Alexander

[align=left][pre]Notes
The Rise of the Golden Idol Soundtrack includes the complete music collection as heard in-game.

Research the mystery of the Golden Idol with the best of them alongside 26 tracks composed by Paul Alexander.

© 2024, Playstack and Color Gray Games

For complete credits and information about this release, please visit Steam:

https://store.steampowered.com/app/3324020/The_Rise_of_the_Golden_Idol_Soundtrack/[/pre][/align]
*/

String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
// ==UserScript==
// @name         Similar Artists from WCD missing on RED
// @version      0.8
// @description  Add a box to the sidebar with the missing Similar Artists from the WCD metadata
// @author       Chameleon
// @include      http*://*redacted.ch/artist.php?id=*
// @include      http*://*redacted.ch/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/34926/Similar%20Artists%20from%20WCD%20missing%20on%20RED.user.js
// @updateURL https://update.greasyfork.org/scripts/34926/Similar%20Artists%20from%20WCD%20missing%20on%20RED.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('artist.php?id=') !== -1)
  {
    artistpage();
  }
  else if(window.location.href.indexOf('torrents.php?id=') !== -1)
  {
    torrentspage();
  }

})();

function torrentspage()
{
  var h2=document.getElementsByTagName('h2')[0];
  var artist=h2.getElementsByTagName('a')[0].textContent;
  var album=h2.getElementsByTagName('span')[0].textContent;

  //var wcd_collage_table=document.createElement('table');

  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/torrents.php?artistname="+encodeURIComponent(artist)+"&groupname="+encodeURIComponent(album),
                     onload: gotSearch
                    });
}

function gotSearch(response)
{
  var div=document.createElement('div');
  div.innerHTML=response.responseText;

  var results=div.getElementsByClassName('group_info');
  if(results.length === 0)
    return;
  var link=results[0].getElementsByTagName('a')[1].href.split('torrents.php?id=')[1];

  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/torrents.php?id="+link,
                     onload: gotAlbum
                    });
}

function gotAlbum(response)
{
  var div=document.implementation.createHTMLDocument();
  div.body.innerHTML=response.responseText;
  //document.body.innerHTML=response.responseText;

  var table=div.getElementsByClassName('collage_table')[0];
  var as=table.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    as[i].href='javascript:void(0)';
  }
  var td=table.getElementsByTagName('td')[0];
  td.innerHTML=td.innerHTML.replace("is in", "was in")+" on WCD";
  var homeTable=document.getElementsByClassName('collage_table')[0];
  homeTable.parentNode.insertBefore(table, homeTable.nextElementSibling);
}

function artistpage()
{
  var artist=document.title.split(' :: Redacted')[0];
  var similar_artists=document.getElementsByClassName('box_artists')[0];

  var box=document.createElement('div');
  box.innerHTML='<div class="head"><strong>WCD Similar Artists</strong></div>';
  box.setAttribute('class', 'box');
  var ul=document.createElement('ul');
  box.appendChild(ul);
  ul.setAttribute('class', 'stats nobullet');
  similar_artists.parentNode.insertBefore(box, similar_artists.nextElementSibling);
  //box.innerHTML='Searching for artist "'+artist+'" in the WCD metadata';
  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/artist.php?artistname="+encodeURIComponent(artist),
                     onload: gotArtists1.bind(undefined, ul, similar_artists, artist)
                    });
}

function login(box, similar_artists, artist)
{
  GM_xmlhttpRequest({method: "POST",
                     url: "http://159.89.252.33/login.php",
                     headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                     },
                     data: "username=Rippy&password=Rippy4Life&keeplogged=1",
                     onload: loggedIn.bind(undefined, box, similar_artists, artist)
                    });
}

function loggedIn(box, similar_artists, artist, response)
{
  document.body.innerHTML=response.responseText;
  return;
  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/artist.php?action=autocomplete&query="+encodeURIComponent(artist),
                     onload: gotArtists.bind(undefined, box, similar_artists, artist)
                    });
}

function gotArtists1(box, similar_artists, artist, response)
{
  var f=response.finalUrl.split("?id=");
  if(f.length !== 2)
  {
    f=response.responseText.split('bookmarklink_artist_');
    console.log(parseInt(f[1]));
    if(isNaN(parseInt(f[1])))
    {
      box.innerHTML='Artist not found';
      return;
    }
  }

  var d=document.createElement('div');
  d.innerHTML=response.responseText;
  var backup_similar=[];
  var b=d.getElementsByClassName('box_artists')[0].getElementsByTagName('li');
  for(var i=0; i<b.length; i++)
  {
    var bs=b[i].getElementsByTagName('a')[0];
    if(!bs)
    {
      box.innerHTML="No similar artists found";
      break;
    }
    backup_similar.push({name:bs.textContent});
  }

  var artistID=parseInt(f[1]);
  var localArtistID=parseInt(window.location.href.split('?id=')[1]);
  GM_xmlhttpRequest({method: "GET",
                     url: "/ajax.php?action=similar_artists&id="+localArtistID+"&limit=1000",
                     onload: gotSimilar1.bind(undefined, box, similar_artists, artistID, backup_similar)
                    });
}

function gotArtists(box, similar_artists, artist, response)
{
  var r;
  try
  {
    r=JSON.parse(response.responseText);
  }
  catch(err)
  {
    box.innerHTML='Not logged in on the <a href="http://159.89.252.33/login.php">WCD backup</a>';
    //login(box, similar_artists, artist);
    return;
  }
  if(r.suggestions.length === 0)
  {
    box.innerHTML='Artist not found';
    return;
  }
  var artistID=r.suggestions[0].data;
  var localArtistID=parseInt(window.location.href.split('?id=')[1]);

  GM_xmlhttpRequest({method: "GET",
                     url: "/ajax.php?action=similar_artists&id="+localArtistID+"&limit=1000",
                     onload: gotSimilar1.bind(undefined, box, similar_artists, artistID)
                    });
}

function gotSimilar1(box, similar_artists, artistID, backup_similar, response)
{
  var r=JSON.parse(response.responseText);
  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/ajax.php?action=similar_artists&id="+artistID+"&limit=1000",
                     onload: gotSimilar.bind(undefined, box, similar_artists, backup_similar, r)
                    });
}

function gotSimilar(box, similar_artists, backup_similar, names, response)
{
  var r=[];
  if(!response.responseText)
  {
    if(backup_similar.length === 0)
    {
      box.innerHTML='WCD backup doesn\'t have the similar artists for this artist<br /><a href="'+response.finalUrl+'">Link</a>';
      return;
    }

    r=backup_similar;
  }
  else
  {
    var r=JSON.parse(response.responseText);
    if(r===null)
    {
      box.innerHTML='None found';
      return;
    }
  }
  box.innerHTML='';

  var final_artists=[];
  for(var i=0; i<r.length; i++)
  {
    var a=r[i];
    var found=false;
    for(var j=0; j<names.length; j++)
    {
      if(convertName(names[j].name) === convertName(a.name))
      {
        found=true;
        break;
      }
    }
    if(!found)
      final_artists.push(a.name);
  }

  if(final_artists.length === 0)
  {
    box.innerHTML='No new similar artists from the WCD backup';
    return;
  }

  if(final_artists.length > 20)
  {
    var p=box.previousElementSibling;
    var a=document.createElement('a');
    p.appendChild(a);
    a.setAttribute('style', 'float: right;');
    a.innerHTML='(Show more)';
    a.href='javascript:void(0);';
    a.addEventListener('click', showMore.bind(undefined, box, final_artists, a));
  }
  showSimilar(box, final_artists, false);
}

function convertName(name)
{
  return name.replace('&', 'and').toLowerCase();
}

function showMore(box, final_artists, a)
{
  if(a.textContent==='(Show more)')
  {
    a.innerHTML='(Show less)';
    showSimilar(box, final_artists, true);
  }
  else
  {
    a.innerHTML='(Show more)';
    showSimilar(box, final_artists, false);
  }
}

function showSimilar(box, final_artists, all)
{
  box.innerHTML='';
  var links=[];
  for(var i=0; i<final_artists.length; i++)
  {
    var f=final_artists[i];
    var li=document.createElement('li');
    li.innerHTML='<a href="/artist.php?artistname='+encodeURIComponent(f)+'">'+f+'</a>';
    var a=document.createElement('a');
    li.appendChild(a);
    a.setAttribute('style', 'float: right;');
    a.innerHTML='(Add)';
    a.href='javascript:void(0);';
    a.addEventListener('click', addArtist.bind(undefined, a, f, false, [], 0));
    links.push({a:a, f:f});
    box.appendChild(li);
    if(i >= 19 && !all)
      break;
  }
  var li=document.createElement('li');
  box.appendChild(li);
  li.setAttribute('style', 'text-align: center;');
  var a=document.createElement('a');
  li.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML='(Add all to similar artists)';
  a.addEventListener('click', addAll.bind(undefined, links));
}

function addAll(links)
{
  addArtist(links[0].a, links[0].f, true, links, 0);
}

function addArtist(a, f, addAll, links, index)
{
  if(a.innerHTML==='(Added)')
  {
    if(addAll)
    {
      index++;
      if(index >= links.length)
        return;
      addArtist(links[index].a, links[index].f, addAll, links, index);
    }
    return;
  }
  a.innerHTML='(Adding)';

  var inputs=document.getElementsByClassName('add_form')[0].getElementsByTagName('input');

  GM_xmlhttpRequest({method: "POST",
                     url: "/artist.php",
                     headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                     },
                     data: "action=add_similar&auth="+inputs[1].value+"&artistid="+inputs[2].value+"&artistname="+encodeURIComponent(f),
                     onload: addedArtist.bind(undefined, a, addAll, links, index)
                    });
}

function addedArtist(a, addAll, links, index, response)
{
  a.innerHTML='(Added)';
  if(!addAll)
    return;

  index++;
  if(index >= links.length)
    return;

  window.setTimeout(addArtist.bind(undefined, links[index].a, links[index].f, addAll, links, index), 1000);
}
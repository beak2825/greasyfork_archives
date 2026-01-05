// ==UserScript==
// @name         PTH iTunes Cover Search
// @version      2.0
// @description  Search iTunes for cover art
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25751/PTH%20iTunes%20Cover%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/25751/PTH%20iTunes%20Cover%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('upload.php') != -1)
    showUpload();
  if(window.location.href.indexOf('torrents.php?action=editgroup&groupid=') != -1)
    showEdit();
  if(window.location.href.indexOf('torrents.php?id=') != -1)
    saveArtist();
  if(window.location.href.indexOf('better.php') != -1 && window.location.href.indexOf('method=artwork') != -1)
    showBetter();
})();

function showBetter()
{
  var rows=document.getElementsByClassName('torrent_row');
  for(var i=0; i<rows.length; i++)
  {
    var r=rows[i];
    var as=r.getElementsByTagName('a');
    var artist=as[0].textContent;
    var album=as[1].textContent;
    var groupId=as[1].href.split('id=')[1];
    var div=as[0].parentNode;

    var optionsDiv=document.createElement('div');
    optionsDiv.style.display='none';
    var search=document.createElement('input');
    optionsDiv.appendChild(search);
    search.setAttribute('placeholder', 'search');
    search.value=(artist+' '+album).trim();
    var country=document.createElement('input');
    optionsDiv.appendChild(country);
    country.setAttribute('placeholder', 'country code');
    country.value='US';

    var toggle=document.createElement('a');
    toggle.href='javascript:void(0);';
    toggle.innerHTML = 'Show search';
    toggle.addEventListener('click', toggleDiv.bind(undefined, toggle, optionsDiv), false);

    var messageDiv=document.createElement('div');
    var image=document.createElement('input');
    image.setAttribute('style', 'width: 250px;');
    var rehostA=document.createElement('a');
    rehostA.href='javascript:void(0);';
    rehostA.innerHTML = 'Auto-rehost: Off';
    rehostA.addEventListener('click', toggleAutoRehost.bind(undefined, rehostA, image, messageDiv), false);

    image.addEventListener('keyup', rehost.bind(undefined, image, messageDiv), false);

    if(window.localStorage.autoUpload == "true")
    {
      image.setAttribute('autorehost', 'true');
      rehostA.innerHTML = 'Auto-rehost: On';
    }
    
    var imageDiv=document.createElement('div');
    var save=document.createElement('a');
    save.href='javascript:void(0);';
    save.innerHTML = 'Save';
    save.addEventListener('click', saveCover.bind(undefined, messageDiv, imageDiv, image, groupId), false);
    
    var a=document.createElement('a');
    div.appendChild(document.createElement('br'));
    div.appendChild(a);
    div.appendChild(document.createTextNode(' | '));
    div.appendChild(toggle);
    div.appendChild(optionsDiv);
    div.appendChild(document.createElement('br'));
    div.appendChild(image);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(save);
    div.appendChild(document.createTextNode(' | '));
    div.appendChild(rehostA);
    div.appendChild(messageDiv);
    a.innerHTML='Get image from iTunes';
    a.href='javascript:void(0);';
    imageDiv.setAttribute('style', 'text-align: center;');
    div.appendChild(imageDiv);
    a.addEventListener('click', getAlbum.bind(undefined, country, search, image, div, messageDiv, imageDiv), false);
  }
}

function saveCover(messageDiv, imageDiv, image, groupId)
{
  messageDiv.innerHTML = 'Loading torrent group edit page';
  var xhr=new XMLHttpRequest();
  xhr.open('GET', "/torrents.php?action=editgroup&groupid="+groupId);
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, editPage.bind(undefined, messageDiv, imageDiv, image), saveCover.bind(undefined, messageDiv, imageDiv, image, groupId));
  xhr.send();
}

function editPage(messageDiv, imageDiv, image, response)
{
  var div=document.createElement('div');
  div.innerHTML = response;
  var form = div.getElementsByClassName('edit_form')[0];
  var image_input = form.getElementsByTagName('input')[3];
  image_input.value = image.value;
  form.getElementsByTagName('input')[4].value = 'iTunes userscript: added cover';
  
  var inputs = form.getElementsByTagName('input');
  var formData = new FormData();
  for(var i=0; i<inputs.length; i++)
  {
    if(inputs[i].name === "")
      continue;
    formData.append(inputs[i].name, inputs[i].value);
  }
  var textarea = form.getElementsByTagName('textarea')[0];
  formData.append(textarea.name, textarea.value);
  var release = form.getElementsByTagName('select')[0];
  if(release)
    formData.append(release.name, release.value);

  messageDiv.innerHTML = "Saving edited torrent group";
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/torrents.php');
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, submitted.bind(undefined, messageDiv, imageDiv), editPage.bind(undefined, messageDiv, imageDiv, image));
  xhr.send(formData);
}

function submitted(messageDiv, imageDiv)
{
  messageDiv.innerHTML = "Saved";
  imageDiv.innerHTML = '';
}

function saveArtist()
{
  var artist=document.getElementsByTagName('h2')[0].textContent.split(' - ')[0];
  window.localStorage.lastArtist=artist;
}

function showEdit()
{
  var before=document.getElementsByClassName('edit_form')[0].getElementsByTagName('br')[0];
  var image=document.getElementsByName('image')[0];
  var artist=window.localStorage.lastArtist;
  if(!artist)
    artist='';
  var album=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML;
  var div=document.createElement('div');
  before.parentNode.insertBefore(div, before);

  var messageDiv=document.createElement('div');

  if(image.parentNode.innerHTML.indexOf('Auto-rehost') == -1)
  {
    var a=document.createElement('a');
    div.parentNode.insertBefore(a, div);
    div.parentNode.insertBefore(document.createTextNode(' '), a);
    a.href='javascript:void(0);';
    a.innerHTML = 'Auto-rehost: Off';
    a.addEventListener('click', toggleAutoRehost.bind(undefined, a, image, messageDiv), false);

    image.addEventListener('keyup', rehost.bind(undefined, image, messageDiv), false);

    if(window.localStorage.autoUpload == "true")
    {
      image.setAttribute('autorehost', 'true');
      a.innerHTML = 'Auto-rehost: On';
    }
  }

  var optionsDiv=document.createElement('div');
  optionsDiv.style.display='none';
  var search=document.createElement('input');
  optionsDiv.appendChild(search);
  search.setAttribute('placeholder', 'search');
  search.value=(artist+' '+album).trim();
  var country=document.createElement('input');
  optionsDiv.appendChild(country);
  country.setAttribute('placeholder', 'country code');
  country.value='US';

  var toggle=document.createElement('a');
  toggle.href='javascript:void(0);';
  toggle.innerHTML = 'Show search';
  toggle.addEventListener('click', toggleDiv.bind(undefined, toggle, optionsDiv), false);

  var a=document.createElement('a');
  div.appendChild(a);
  div.appendChild(document.createTextNode(' | '));
  div.appendChild(toggle);
  div.appendChild(optionsDiv);
  div.appendChild(messageDiv);
  a.innerHTML='Get image from iTunes';
  a.href='javascript:void(0);';
  var imageDiv=document.createElement('div');
  imageDiv.setAttribute('style', 'text-align: center;');
  div.appendChild(imageDiv);
  a.addEventListener('click', getAlbum.bind(undefined, country, search, image, div, messageDiv, imageDiv), false);
}

function toggleDiv(a, div)
{
  if(a.innerHTML.indexOf('Show') != -1)
  {
    a.innerHTML = a.innerHTML.replace('Show', 'Hide');
    div.style.display='';
  }
  else
  {
    a.innerHTML = a.innerHTML.replace('Hide', 'Show');
    div.style.display='none';
  }
}

function showUpload()
{
  var artist=document.getElementById('artist');
  var album=document.getElementById('title');
  var image=document.getElementById('image');
  var imageTd=image.parentNode;

  var messageDiv=document.createElement('div');
  imageTd.appendChild(messageDiv);

  var div=imageTd;

  var optionsDiv=document.createElement('div');
  optionsDiv.style.display='none';
  var search=document.createElement('input');
  optionsDiv.appendChild(search);
  search.setAttribute('placeholder', 'search');
  search.value=(artist.value+' '+album.value).trim();
  var country=document.createElement('input');
  optionsDiv.appendChild(country);
  country.setAttribute('placeholder', 'country code');
  country.value='US';

  var toggle=document.createElement('a');
  toggle.href='javascript:void(0);';
  toggle.innerHTML = 'Show search';
  toggle.addEventListener('click', toggleDiv.bind(undefined, toggle, optionsDiv), false);

  var a=document.createElement('a');
  div.appendChild(a);
  div.appendChild(document.createTextNode(' | '));
  div.appendChild(toggle);
  div.appendChild(optionsDiv);
  a.innerHTML='Get image from iTunes';
  a.href='javascript:void(0);';
  var imageDiv=document.createElement('div');
  imageDiv.setAttribute('style', 'text-align: center;');
  div.appendChild(imageDiv);
  a.addEventListener('click', getAlbumUpload.bind(undefined, album, artist, country, search, image, imageTd, messageDiv, imageDiv), false);
}

function getAlbumUpload(album, artist, country, search, image, imageTd, messageDiv, imageDiv)
{
  if(search.value.length === 0)
    search.value=(artist.value+' '+album.value).trim();
  getAlbum(country, search, image, imageTd, messageDiv, imageDiv);
}

function getAlbum(country, search, im, td, messageDiv, imageDiv)
{
  //console.log(im);

  /*var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://itunes.apple.com/search?"+encodeURIComponent(artist+' '+album));
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, gotAlbum.bind(undefined, im, td, messageDiv), getAlbum.bind(undefined, a, al, im, td, messageDiv));
  xhr.send();*/

  //console.log("https://itunes.apple.com/search?term="+encodeURIComponent(artist+' '+album));
  messageDiv.innerHTML = 'Searching for image on iTunes';
  var s="https://itunes.apple.com/search?term="+encodeURIComponent(search.value);
  if(country.value.length > 0 && country.value != 'US')
  {
    s+="&country="+encodeURIComponent(country.value);
  }
  GM_xmlhttpRequest({
    method: "GET",
    url: s,
    onload: function(response) { if(response.status == 200) {gotAlbum(im, td, messageDiv, imageDiv, response.responseText); } else { messageDiv.innerHTML = 'iTunes error: '+response.status; } }
  });
}

function gotAlbum(input, td, messageDiv, imageDiv, response)
{
  messageDiv.innerHTML = 'Got images';
  var r=JSON.parse(response);
  if(r.results.length > 0)
  {
    var div=imageDiv;
    div.innerHTML='Current: 1 | ';
    if(r.results.length > 1)
    {
      div.setAttribute('results', JSON.stringify(r.results));
      div.setAttribute('index', '0');
      var a=document.createElement('a');
      a.innerHTML='Next';
      a.href='javascript:void(0);';
      a.addEventListener('click', changeImage.bind(undefined, div, 1, input), false);
      div.appendChild(a);
      div.appendChild(document.createElement('br'));
    }
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    div.appendChild(a);
    var img=document.createElement('img');
    a.setAttribute('imageSize', 'large');
    a.addEventListener('click', changeSize.bind(undefined, a, img, input, r.results[0].artworkUrl60), false);
    a.appendChild(img);
    img.src=r.results[0].artworkUrl60.replace("60x60bb", "10000x10000-999");
    input.value = img.src;
    if(window.localStorage.iTunesSize == 'small')
      a.click();
    else
    {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("keyup", false, true);
      input.dispatchEvent(evt);
    }
  }
  else
    messageDiv.innerHTML = "no results";
}

function changeImage(div, amount, input)
{
  var r=JSON.parse(div.getAttribute('results'));
  var index=parseInt(div.getAttribute('index'));
  index+=amount;
  if(index < 0)
    index=0;
  if(index >= r.length)
    index=r.length-1;

  div.setAttribute('index', index);

  div.innerHTML='Current: '+(index+1)+' | ';

  if(index != r.length-1)
  {
    //div.setAttribute('results', JSON.stringify(r));
    div.setAttribute('index', index);
    var a=document.createElement('a');
    a.innerHTML='Next';
    a.href='javascript:void(0);';
    a.addEventListener('click', changeImage.bind(undefined, div, 1, input), false);
    div.appendChild(a);

    if(index !== 0)
      div.appendChild(document.createTextNode(' | '));
  }
  if(index !== 0)
  {
    //div.setAttribute('results', JSON.stringify(r));
    div.setAttribute('index', index);
    var a=document.createElement('a');
    a.innerHTML='Previous';
    a.href='javascript:void(0);';
    a.addEventListener('click', changeImage.bind(undefined, div, -1, input), false);
    div.appendChild(a);
  }
  div.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'Copy to input';
  var img=document.createElement('img');
  a.addEventListener('click', triggerKeyup.bind(undefined, input, img), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  div.appendChild(a);
  a.setAttribute('imageSize', 'large');
  a.addEventListener('click', changeSize.bind(undefined, a, img, input, r[index].artworkUrl60), false);
  a.appendChild(img);
  var artwork=r[index].artworkUrl60.replace("60x60bb", "10000x10000-999");
  if(window.localStorage.iTunesSize == 'small')
    artwork=r[index].artworkUrl60.replace("60x60bb", "600x600bb");
  img.src=artwork;
  //input.value = img.src;
}

function triggerKeyup(input, img)
{
  input.value=img.src;
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("keyup", false, true);
  input.dispatchEvent(evt);
}

function changeSize(a, img, input, url)
{
  if(a.getAttribute('imageSize') == 'large')
  {
    window.localStorage.iTunesSize='small';
    a.setAttribute('imageSize', 'small');
    url=url.replace("60x60bb", "600x600bb");
  }
  else
  {
    window.localStorage.iTunesSize='large';
    a.setAttribute('imageSize', 'large');
    url=url.replace("60x60bb", "10000x10000-999");
  }
  input.value=url;
  img.src=url;
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("keyup", false, true);
  input.dispatchEvent(evt);
}

function rehost(imageInput, span)
{
  if(imageInput.getAttribute('autorehost') != "true")
    return;
  var whitelisted = ["imgur.com", "ptpimg.me"];
  if(imageInput.value.length < 1)
    return;
  for(var i=0; i<whitelisted.length; i++)
  {
    var whitelist=whitelisted[i];
    if(imageInput.value.indexOf(whitelist) != -1)
      return;
  }

  if(imageInput.value.indexOf("discogs.com") != -1)
  {
    imageInput.value = "http://reho.st/"+imageInput.value;
  }

  span.innerHTML = 'Rehosting';
  var formData = new FormData();
  formData.append('image', imageInput.value);
  if(imageInput.getAttribute('working') == "true")
    return;
  imageInput.setAttribute('working', "true");
  window.setTimeout(unworking.bind(undefined, imageInput), 1000);

  var settings = getSettings();

  if(settings.site == 'imgur.com')
  {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID 735033a56fe790b');
    xhr.onreadystatechange = xhr_func.bind(undefined, span, xhr, rehosted.bind(undefined, imageInput, span), rehost.bind(undefined, imageInput, span));
    xhr.send(formData);
  }
  else if(settings.site == 'ptpimg.me')
  {    
    if(!settings.apiKey || settings.apiKey.length != 36)
    {
      span.innerHTML = 'No valid ptpimg.me API key set';
      return;
    }
    /*var formData = new FormData();
    formData.append('link-upload', image_input.value);
    formData.append('api_key', 'xx');
    // ptpimg.me doesn't have 'Access-Control-Allow-Origin' set
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://ptpimg.me/upload.php');
    xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, uploaded.bind(undefined, a, form, settings), doRehost.bind(undefined, a, image_input, form, settings));
    xhr.send(formData);*/
    // use GM_xmlhttpRequest for cross-domain
    GM_xmlhttpRequest({
      method: "POST",
      url: 'https://ptpimg.me/upload.php',
      data: "link-upload="+encodeURIComponent(imageInput.value)+'&api_key='+settings.apiKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) { rehosted(imageInput, span, response.responseText); }
    });
  }
}

function getSettings()
{
  var settings = window.localStorage.uploadFromUploadPageSettings;
  if(!settings)
  {
    settings = {site:'imgur.com', apiKey:window.localStorage.ptpimgAPIKey ? window.localStorage.ptpimgAPIKey : ''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function unworking(input)
{
  input.setAttribute('working', "false");
}

function rehosted(imageInput, span, response)
{
  var settings = getSettings();
  var newLink='';
  try
  {
    if(settings.site == 'imgur.com')
      newLink = JSON.parse(response).data.link.replace(/http:/, 'https:');
    else if(settings.site == 'ptpimg.me')
    {
      var r=JSON.parse(response)[0];
      newLink = "https://ptpimg.me/"+r.code+'.'+r.ext;
    }
  }
  catch(err)
  {
    span.innerHTML = err.message;
    return;
  }
  span.innerHTML = 'Rehosted';
  imageInput.value = newLink;
}

function toggleAutoRehost(a, input, span)
{
  if(a.innerHTML.indexOf('Off') != -1)
  {
    input.setAttribute('autorehost', 'true');
    a.innerHTML = 'Auto-rehost: On';
    window.localStorage.autoUpload = 'true';
    rehost(input, span);
  }
  else
  {
    input.setAttribute('autorehost', 'false');
    a.innerHTML = 'Auto-rehost: Off';
    window.localStorage.autoUpload = 'false';
  }
}

function xhr_func(messageDiv, xhr, func, repeatFunc)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
      func(xhr.responseText);
    else
    {
      messageDiv.innerHTML = 'Error: '+xhr.status+'<br />retrying in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}

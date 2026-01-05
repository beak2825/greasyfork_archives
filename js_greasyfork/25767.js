// ==UserScript==
// @name         Rehost image to...
// @version      1.13
// @description  Rehost images to a whitelisted site by ctrl+shift+clicking them
// @author       Chameleon
// @include      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25767/Rehost%20image%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/25767/Rehost%20image%20to.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if(window.location.host == "redacted.ch" && window.location.href.indexOf("threadid=1719") != -1)
  {
    var threadid=parseInt(window.location.href.split('threadid=')[1]);
    if(threadid===1719)
      showSettings();
  }

  var images = document.getElementsByTagName('img');
  for(var i=0; i<images.length; i++)
  {
    var im=images[i];
    im.addEventListener('click', rehost.bind(undefined, im), false);
  }
})();

function showSettings(message)
{
  var div=document.getElementById('rehostToSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'rehostToSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Rehost image to... Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Use image host: '+settings.site;
  a.addEventListener('click', changeSite.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Debug: '+(settings.debug ? 'On':'Off');
  a.addEventListener('click', changeA.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var labelStyle = '';

  var label = document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'ptpimg.me API Key: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 21em;');
  input.placeholder='ptpimg.me API Key';
  input.value = settings.apiKey ? settings.apiKey:'';
  div.appendChild(input);
  input.addEventListener('keyup', changeSettings.bind(undefined, div), false);

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Get ptpimg.me API Key';
  div.appendChild(document.createElement('br'));
  div.appendChild(a);
  div.appendChild(document.createTextNode(' '));
  var s=document.createElement('span');
  s.innerHTML = message ? message : '';
  div.appendChild(s);
  a.addEventListener('click', getAPIKey.bind(undefined, input, s, div), false);
}

function getAPIKey(input, span, div)
{
  span.innerHTML = 'Loading ptpimg.me';
  /*var xhr=new XMLHttpRequest();
  xhr.open('GET', "https://ptpimg.me");
  xhr.onreadystatechange = xhr_func.bind(undefined, span, xhr, gotAPIKey.bind(undefined, input, span, div), rehost.bind(undefined, input, span, div));
  xhr.send();*/
  GM_xmlhttpRequest({
    method: "GET",
    url: 'https://ptpimg.me',
    onload: function(response) { if(response.status == 200) {gotAPIKey(input, span, div, response.responseText); } else { span.innerHTML = 'ptpimg.me error: '+response.status; } }
  });

}

function gotAPIKey(input, span, div, response)
{
  var key=response.split("value='")[1].split("'")[0];
  if(key.length != 36)
  {
    span.innerHTML = "You aren't logged in to ptpimg.me";
    return;
  }
  input.value=key;
  changeSettings(div, 0, "Successfully added API Key");
}

function changeA(a, div)
{
  if(a.innerHTML.indexOf('On') != -1)
  {
    a.innerHTML=a.innerHTML.replace('On', 'Off');
  }
  else 
  {
    a.innerHTML=a.innerHTML.replace('Off', 'On');
  }

  changeSettings(div);
}

function changeSite(a, div)
{
  if(a.innerHTML.indexOf('imgur.com') != -1)
  {
    a.innerHTML = a.innerHTML.replace('imgur.com', 'ptpimg.me');
  }
  else if(a.innerHTML.indexOf('ptpimg.me') != -1)
  {
    a.innerHTML = a.innerHTML.replace('ptpimg.me', 'imgur.com');
  }

  changeSettings(div);
}

function changeSettings(div)
{
  var settings = getSettings();
  var as=div.getElementsByTagName('a');
  if(as[0].innerHTML.indexOf('imgur.com') != -1)
    settings.site = 'imgur.com';
  else if(as[0].innerHTML.indexOf('ptpimg.me') != -1)
    settings.site = 'ptpimg.me';

  if(as[1].innerHTML.indexOf('On') != -1)
  {
    settings.debug=true;
  }
  else
    settings.debug=false;

  var inputs=div.getElementsByTagName('input');
  settings.apiKey = inputs[0].value;
  window.localStorage.ptpimgAPIKey = settings.apiKey;

  // can't use localStorage as the script runs across domains
  //window.localStorage.rehostImageToSettings = JSON.stringify(settings);
  GM_setValue('rehostImageToSettings', JSON.stringify(settings));
  showSettings();
}

function getSettings()
{
  // can't use localStorage as the script runs across domains
  //var settings = window.localStorage.rehostImageToSettings;
  var settings = GM_getValue('rehostImageToSettings', false);
  if(!settings)
  {
    settings = {site:'imgur.com', apiKey:window.localStorage.ptpimgAPIKey ? window.localStorage.ptpimgAPIKey : ''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function rehost(image, event)
{
  var alreadySent = image.getAttribute('sent');
  debug("shift: "+event.shiftKey+", ctrl: "+event.ctrlKey+", cmd: "+event.metaKey+", alreadySent: "+alreadySent);
  if(event.shiftKey && (event.ctrlKey || event.metaKey) && alreadySent != "true")
  {
    event.preventDefault();
    image.setAttribute('sent', 'true');
    var a=document.createElement('a');
    var imagePlace = image.getBoundingClientRect();
    a.setAttribute('style', 'position: absolute; z-index: 50000000; top: '+(imagePlace.top+window.scrollY)+'px; left: '+(imagePlace.left+window.scrollX)+'px; width: '+image.width+'px; text-align: center; color: blue; background: rgba(255,255,255,0.6); border-radius: 0px 0px 10px 10px;');
    debug("top: "+(imagePlace.top+window.scrollY)+"px<br />left: "+(imagePlace.left+window.scrollX)+"px<br />width: "+image.width+"px");
    a.innerHTML = 'Rehosting';
    document.body.appendChild(a);

    if(image.src.indexOf("discogs.com") != -1 || image.src.indexOf("elparaisorecords.com") != -1)
    {
      image.src = "http://reho.st/"+image.src;
    }
    doRehost(a, image.src);
  }
}

function doRehost(a, imageSrc)
{
  var settings = getSettings();
  if(settings.site == 'imgur.com')
  {
    var formData = new FormData();
    formData.append('image', imageSrc);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID 735033a56fe790b');
    xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, uploaded.bind(undefined, a, settings), doRehost.bind(undefined, a, imageSrc));
    xhr.send(formData);
  }
  else if(settings.site == 'ptpimg.me')
  {
    if(!settings.apiKey || settings.apiKey.length != 36)
    {
      a.innerHTML = 'No valid ptpimg.me API key set';
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
      data: "link-upload="+encodeURIComponent(imageSrc)+'&api_key='+settings.apiKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) { if(response.status == 200) {uploaded(a, settings, response.responseText); } else { a.innerHTML = 'ptpimg.me error: '+response.status; } }
    });
  }
}

function debug(message)
{
  var settings=getSettings();
  if(!settings.debug)
    return;
  var div=document.getElementById('rehostDebug');
  if(!div)
  {
    div=document.createElement('div');
    div.setAttribute('style', 'position: absolute; top: 50px; left: 20px; min-width: 500px; background: black; color: white;');
    div.setAttribute('id', 'rehostDebug');
    document.body.appendChild(div);
  }
  div.innerHTML +=message+'<br />';
}

function uploaded(a, settings, response)
{
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
    a.innerHTML = err.message;
    a.style.color = 'red';
    return;
  }
  debug("Rehosted: "+newLink);
  rehosted(a, newLink);
}

function rehosted(a, link)
{
  a.style.color = 'green';
  a.innerHTML = 'Rehosted<br />and copied to clipboard';
  a.href = link;
  GM_setClipboard(link);
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
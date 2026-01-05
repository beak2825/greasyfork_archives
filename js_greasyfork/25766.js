// ==UserScript==
// @name         Rehost cover to...
// @version      1.10
// @description  Rehost an existing cover image to a whitelisted site
// @author       Chameleon
// @include      http*://*redacted.ch/torrents.php?id=*
// @include      http*://*redacted.ch/forums.php?*threadid=1737*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25766/Rehost%20cover%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/25766/Rehost%20cover%20to.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if(window.location.href.indexOf("threadid=1737") != -1)
    showSettings();

  if(window.location.href.indexOf("torrents.php") != -1)
    showRehost();
})();

function showRehost()
{
  var settings = getSettings();
  var whitelisted = ["imgur.com", "ptpimg.me"];
  var imgSrc = document.getElementById('cover_div_0').getElementsByTagName('img')[0].src;
  for(var i=0; i<whitelisted.length; i++)
  {
    var whitelist=whitelisted[i];
    if(imgSrc.indexOf(whitelist) != -1)
      return;
  }

  var add_cover;
  try
  {
    add_cover = document.getElementById('add_cover_div').getElementsByTagName('div')[0];
  }
  catch(e)
  {
    return;
  }
  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = '[Rehost to '+settings.site+']';
  a.setAttribute('style', 'float: right;');
  add_cover.appendChild(document.createElement('br'));
  add_cover.appendChild(a);
  a.addEventListener('click', rehost.bind(undefined, a), false);
}

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
  div.innerHTML = '<h2>Rehost cover to... Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Use image host: '+settings.site;
  a.addEventListener('click', changeSite.bind(undefined, a, div), false);
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

function changeSettings(div, nul, message)
{
  var settings = getSettings();
  var as=div.getElementsByTagName('a');
  if(as[0].innerHTML.indexOf('imgur.com') != -1)
    settings.site = 'imgur.com';
  else if(as[0].innerHTML.indexOf('ptpimg.me') != -1)
    settings.site = 'ptpimg.me';

  var inputs=div.getElementsByTagName('input');
  settings.apiKey = inputs[0].value;
  window.localStorage.ptpimgAPIKey = settings.apiKey;

  window.localStorage.rehostToSettings = JSON.stringify(settings);
  showSettings(message);
}

function getSettings()
{
  var settings = window.localStorage.rehostToSettings;
  if(!settings)
  {
    settings = {site:'imgur.com', apiKey:window.localStorage.ptpimgAPIKey ? window.localStorage.ptpimgAPIKey : ''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function rehost(a, settings)
{
  var settings = getSettings();
  a.innerHTML = 'Loading edit page';
  var groupID=parseInt(window.location.href.split('id=')[1]);
  var xhr=new XMLHttpRequest();
  xhr.open('GET', "/torrents.php?action=editgroup&groupid="+groupID);
  xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, editPage.bind(undefined, a, settings), rehost.bind(undefined, a, settings));
  xhr.send();
}

function editPage(a, settings, response)
{
  var div=document.createElement('div');
  div.innerHTML = response;
  var form = div.getElementsByClassName('edit_form')[0];
  var image_input = form.getElementsByTagName('input')[3];
  form.getElementsByTagName('input')[5].value = 'auto-rehosted cover image to '+settings.site;

  a.innerHTML = 'Rehosting to '+settings.site;
  doRehost(a, image_input, form, settings);
}

function doRehost(a, image_input, form, settings)
{
  if(image_input.value.indexOf("discogs.com") != -1)
  {
    image_input.value = "http://demo.cloudimg.io/v7/"+image_input.value;
  }
  if(settings.site == 'imgur.com')
  {
    var formData = new FormData();
    formData.append('image', image_input.value);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID 735033a56fe790b');
    xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, uploaded.bind(undefined, a, form, settings), doRehost.bind(undefined, a, image_input, form, settings));
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
      data: "link-upload="+encodeURIComponent(image_input.value)+'&api_key='+settings.apiKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) { uploaded(a, form, settings, response.responseText); }
    });
  }
}

function uploaded(a, form, settings, response)
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
  a.innerHTML = 'Submitting edit';
  form.getElementsByTagName('input')[3].value=newLink;
  submit(a, form, newLink, settings);
}

function submit(a, form, imageSrc, settings)
{
  var inputs = form.getElementsByTagName('input');
  var formData = new FormData();
  for(var i=0; i<inputs.length; i++)
  {
    if(inputs[i].name === "")
      continue;
    if(inputs[i].type === "checkbox")
    {
      if(inputs[i].checked)
        formData.append(inputs[i].name, inputs[i].value);
    }
    else
      formData.append(inputs[i].name, inputs[i].value);
  }
  var textarea = form.getElementsByTagName('textarea')[0];
  formData.append(textarea.name, textarea.value);
  var release = form.getElementsByTagName('select')[0];
  if(release)
    formData.append(release.name, release.value);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/torrents.php');
  xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, submitted.bind(undefined, a, imageSrc, settings), submit.bind(undefined, a, form, imageSrc, settings));
  xhr.send(formData);
}

function submitted(a, imageSrc, settings)
{
  a.innerHTML = 'Image rehosted to '+settings.site;
  var img=document.getElementById('cover_div_0').getElementsByTagName('img')[0];
  img.src = imageSrc;
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

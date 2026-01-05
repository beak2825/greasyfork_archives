// ==UserScript==
// @name         Upload image from upload page
// @version      1.7
// @description  Upload album art from within the PTH upload page
// @author       Chameleon
// @include      http*://*redacted.ch/upload.php*
// @include      http*://*redacted.ch/forums.php*threadid=1725*
// @include      http*://*redacted.ch/artist.php*action=edit*
// @include      http*://*redacted.ch/torrents.php*action=editgroup*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25768/Upload%20image%20from%20upload%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/25768/Upload%20image%20from%20upload%20page.meta.js
// ==/UserScript==

unsafeWindow.Categories=function c(){
  ajax.get('ajax.php?action=upload_section&categoryid=' + $('#categories').raw().value, function (response) {
    $('#dynamic_form').raw().innerHTML = response;
    initMultiButtons();
    // Evaluate the code that generates previews.
    eval($('#dynamic_form script.preview_code').html());
    showUpload();
  });
};

(function() {
  'use strict';
  var settings=getSettings();

  if(settings.showSettings)
    showSettings();
  if(window.location.href.indexOf("threadid=1725") != -1)
    showSettings();
  else if(window.location.href.indexOf('upload.php') != -1)
  {
    showUpload();
  }
  else if(window.location.href.indexOf('artist.php') != -1 || window.location.href.indexOf('torrents.php') != -1)
  {
    showArtistEdit();
  }
}());

function showSettings(message)
{
  var div=document.getElementById('rehostToSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    if(!before)
      before=document.getElementsByTagName('table')[1];
    if(!before)
      before=document.getElementsByClassName('box')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'rehostToSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Upload image from upload page Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Use image host: '+settings.site;
  a.addEventListener('click', changeSite.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show settings on upload page: '+(settings.showSettings ? 'true':'false');
  a.addEventListener('click', changeShowSettings.bind(undefined, a, div), false);
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

function changeShowSettings(a, div)
{
  if(a.innerHTML.indexOf('false') != -1)
    a.innerHTML = a.innerHTML.replace('false', 'true');
  else
    a.innerHTML = a.innerHTML.replace('true', 'false');
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

  if(as[1].innerHTML.indexOf('false') != -1)
    settings.showSettings=false;
  else
    settings.showSettings=true;

  var inputs=div.getElementsByTagName('input');
  settings.apiKey = inputs[0].value;
  window.localStorage.ptpimgAPIKey = settings.apiKey;

  window.localStorage.uploadFromUploadPageSettings = JSON.stringify(settings);
  showSettings(message);
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

function showArtistEdit()
{
  var image=document.getElementsByName('image')[0];
  var div=document.createElement('div');
  image.parentNode.insertBefore(div, image);
  div.appendChild(image);
  image.setAttribute('id', 'image');
  showUpload();
}

function showUpload()
{
  var imageInput = document.getElementById('image');
  var parent = imageInput.parentNode;
  if(imageInput.parentNode.innerHTML.indexOf('Auto-rehost') == -1)
  {
    var span=document.createElement('span');
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.innerHTML = 'Auto-rehost: Off';
    a.addEventListener('click', toggleAutoRehost.bind(undefined, a, imageInput, span), false);
    parent.appendChild(document.createTextNode(' '));
    parent.appendChild(a);
    parent.appendChild(document.createTextNode(' '));
    parent.appendChild(span);
    if(window.localStorage.autoUpload == "true")
    {
      imageInput.setAttribute('autorehost', 'true');
      a.innerHTML = 'Auto-rehost: On';
    }
    imageInput.addEventListener('keyup', rehost.bind(undefined, imageInput, span), false);
  }
  var file = document.createElement('input');
  file.type='file';
  parent.appendChild(file);
  var status = document.createElement('div');
  parent.appendChild(status);
  file.addEventListener('change', uploadFile.bind(undefined, status), false);
  file.accept="image/*";
  var dropzone = document.createElement('div');
  parent.appendChild(dropzone);
  dropzone.addEventListener("dragenter", dragenter, false);
  dropzone.addEventListener("dragover", dragenter, false);
  dropzone.addEventListener("drop", drop.bind(undefined, status), false);
  dropzone.innerHTML = 'Or drop files here';
  dropzone.setAttribute('style', 'width: 400px; height: 30px; background: rgba(64,64,64,0.8); border: dashed; border-radius: 10px; margin: auto; text-align: center; font-size: 20px;');
}

function dragenter(event)
{
  event.preventDefault();
  event.stopPropagation();
}

function drop(status, event)
{
  event.preventDefault();
  event.stopPropagation();
  var dt = event.dataTransfer;
  var files = dt.files;
  uploadFile(status, {target:{files:files}});
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
      data: "link-upload="+encodeURIComponent(imageInput.value)+'&api_key='+settings.apiKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) { rehosted(imageInput, span, response.responseText); }
    });
  }
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

function uploadFile(status, event)
{
  var files=event.target.files;
  for(var i=0; i<files.length; i++)
  {
    var f=files[i];
    if(f.type.indexOf("image") != -1)
    {
      status.innerHTML = 'Uploading...';
      upload(status, f);
      break;
    }
    else
    {
      status.innerHTML = 'Not an image';
    }
  }
}

function upload(status, file)
{
  var settings = getSettings();

  if(settings.site == 'imgur.com')
  {
    var formData = new FormData();
    formData.append('image', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID 735033a56fe790b');
    xhr.onreadystatechange = xhr_func.bind(undefined, status, xhr, uploaded.bind(undefined, status), upload.bind(undefined, status, file));
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
    var formData = new FormData();
    formData.append('file-upload[0]', file);
    formData.append('api_key', settings.apiKey);
    GM_xmlhttpRequest({
      method: "POST",
      url: 'https://ptpimg.me/upload.php',
      //binary: true,
      data: formData,
     /* headers: {
        "Content-Type": "multipart/form-data"
      },*/
      onload: function(response) {
        if(response.status == 200)
        {
          uploaded(status, response.responseText);
        }
        else
        {
          console.log("Failed to upload: \n"+response.responseHeaders+' '+response.status+' '+response.statusText);
          status.innerHTML = "Failed to upload to ptpimg.me: "+response.status;
          return;
        }
      }
    });
  }
}

function uploaded(status, response)
{
  var settings=getSettings();
  console.log(response);
  var newLink='';
  try
  {
    if(settings.site == 'imgur.com')
      newLink = JSON.parse(response).data.link;
    else if(settings.site == 'ptpimg.me')
    {
      var r=JSON.parse(response)[0];
      newLink = "https://ptpimg.me/"+r.code+'.'+r.ext;
    }
  }
  catch(err)
  {
    status.innerHTML = err.message;
    status.style.color = 'red';
    return;
  }

  status.innerHTML = 'Uploaded<br />';
  var img=document.createElement('img');
  var a=document.createElement('a');
  status.appendChild(a);
  status.appendChild(document.createElement('br'));
  status.appendChild(img);
  a.innerHTML='Hide image';
  a.href='javascript:void(0);';
  a.addEventListener('click', toggleImage.bind(undefined, a, img), false);
  img.src=newLink;
  document.getElementById('image').value = newLink;
}

function toggleImage(a, img)
{
  if(img.style.display=='none')
  {
    img.style.display='initial';
    a.innerHTML = 'Hide image';
  }
  else
  {
    img.style.display='none';
    a.innerHTML = 'Show image';
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

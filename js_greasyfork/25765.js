// ==UserScript==
// @name         PTH Upload Save Defaults
// @version      1.4
// @description  Save the dropdown menu selections on the upload form and automatically set them on page load
// @author       Chameleon
// @include      http*://redacted.ch/upload.php*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25765/PTH%20Upload%20Save%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/25765/PTH%20Upload%20Save%20Defaults.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var before=document.getElementById('upload_table');
  
  var span=document.createElement('span');
  span.setAttribute('style', 'display: block; text-align: center;');
  before.parentNode.insertBefore(span, before);

  var a=document.createElement('a');
  a.innerHTML = 'Save options';
  a.href = 'javascript:void(0);';
  span.appendChild(a);
  a.addEventListener('click', saveOptions.bind(undefined, a), false);
  
  span.appendChild(document.createTextNode(' | '));

  var a=document.createElement('a');
  a.innerHTML = 'Load options';
  a.href = 'javascript:void(0);';
  span.appendChild(a);
  a.addEventListener('click', loadOptions.bind(undefined, false), false);  
  
  loadOptions(true);
}());

function loadOptions(addExtra)
{
  var options=window.localStorage.uploadOptions;
  if(!options)
    options = {selects:[], multiformat:false, scene:false};
  else
    options = JSON.parse(options);

  if(options.multiformat && addExtra)
  {
    for(var i=1; i<options.multiformat; i++)
    {
      createRow();
    }
  }
  if(options.scene)
    document.getElementById('scene').checked=true;
  //var selects=document.getElementsByTagName('select');
  for(var i=0; i<options.selects.length; i++)
  {
    var s=options.selects[i];
    var dropdown=document.getElementById(s.id);
    if(!dropdown)
      continue;
    if(dropdown.getAttribute('disabled'))
      continue;
    dropdown.selectedIndex = s.index;
    if(dropdown.id != "genre_tags" && dropdown.id != "categories")
    {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      dropdown.dispatchEvent(evt);
      if(dropdown.id == "format" && s.index == 2)
        document.getElementById('upload_logs').setAttribute('class', '');
    }
  }
}

function saveOptions(a)
{
  var selects=document.getElementsByTagName('select');
  var options={selects:[], multiformat:false};
  for(var i=0; i<selects.length; i++)
  {
    var s=selects[i];
    options.selects.push({id:s.id, index:s.selectedIndex});
  }
  if(document.getElementById('extra_format_row_1'))
  {
    var rowNum=1;
    var node=document.getElementById('extra_format_row_'+rowNum);
    while(node)
    {
      rowNum++;
      node=document.getElementById('extra_format_row_'+rowNum);
    }
    options.multiformat=rowNum;
  }
  options.scene=document.getElementById('scene').checked;
  window.localStorage.uploadOptions = JSON.stringify(options);
  a.innerHTML = 'Options saved';
  window.setTimeout(reset.bind(undefined, a, 'Save options'), 5000);
}

function reset(a, message)
{
  a.innerHTML = message;
}

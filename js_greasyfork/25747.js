// ==UserScript==
// @name         PTH Drop Logfile
// @version      0.5
// @description  Enable dropping logfiles into a dropzone on the upload page
// @author       Chameleon
// @include      http*://redacted.ch/upload.php*
// @include      http*://redacted.ch/logchecker.php*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25747/PTH%20Drop%20Logfile.user.js
// @updateURL https://update.greasyfork.org/scripts/25747/PTH%20Drop%20Logfile.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var inputs=document.getElementsByTagName('input');
  for(var i=0; i<inputs.length; i++)
  {
    var inp=inputs[i];
    if(inp.type == 'file')
    {
      if(inp.getAttribute('hasDropzone') == 'true')
        continue;
      var field=inp.parentNode.getElementsByTagName('input');
      if(field.length > 1)
      {
        if(field[0].id == 'image')
          continue;
      }
      makeDropzone(inp);
    }
  }
  /*var input=document.getElementById('logfields').getElementsByTagName('input')[0];

  makeDropzone(input);*/

  var script=document.createElement('script');
  script.appendChild(document.createTextNode('AddLogField=('+AddLogField+'); makeDropzone=('+makeDropzone+'); dragenter=('+dragenter+'); drop=('+drop+');'));
  document.body.appendChild(script);
}());

function AddLogField()
{
  if (LogCount >= 200) {
    return;
  }
  var LogField = document.createElement("input");
  LogField.type = "file";
  LogField.id = "file";
  LogField.name = "logfiles[]";
  LogField.size = 50;
  var x = $('#logfields').raw();
  x.appendChild(document.createElement("br"));
  x.appendChild(LogField);
  LogCount++;
  makeDropzone(LogField);
}

function makeDropzone(input)
{
  var dropzone = document.createElement('div');
  input.parentNode.appendChild(dropzone);
  dropzone.addEventListener("dragenter", dragenter, false);
  dropzone.addEventListener("dragover", dragenter, false);
  dropzone.addEventListener("drop", drop.bind(undefined, input), false);
  dropzone.innerHTML = 'Or drop files here';
  dropzone.setAttribute('style', 'width: 400px; height: 30px; background: rgba(64,64,64,0.8); border: dashed; border-radius: 10px; margin: auto; text-align: center; font-size: 20px;');
  input.setAttribute('hasDropzone', 'true');
}

function dragenter(event)
{
  event.preventDefault();
  event.stopPropagation();
}

function drop(input, event)
{
  event.preventDefault();
  event.stopPropagation();
  /*event.dataTransfer.files = document.getElementById('file').files;
  console.log('here');
  input.files = event.dataTransfer.files;*/
  var e=new event.constructor(event.type, event);
  input.dispatchEvent(e);
}

// ==UserScript==
// @name         GitHub Show Filename List
// @namespace    https://github.com/yskoht/github-show-filename-list
// @version      0.5
// @description  Show filename list on "Files changed" tab in GitHub
// @author       yskoht
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401536/GitHub%20Show%20Filename%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/401536/GitHub%20Show%20Filename%20List.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var fontStyle = '';
  fontStyle += 'font-size: 12px;';
  fontStyle += 'font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;';

  var spanStyle = '';
  spanStyle += fontStyle
  spanStyle += 'margin-right: 8px;';
  spanStyle += 'display: inline-block;';
  spanStyle += 'width: 40px;';
  spanStyle += 'height: 18px;';
  spanStyle += 'text-align: center;';
  spanStyle += 'border-radius: 0 3px 3px 0;';

  var moreButtonStyle = '';
  moreButtonStyle += fontStyle;
  moreButtonStyle += 'color: #555;';
  moreButtonStyle += 'margin-top: 4px;';
  moreButtonStyle += 'padding: 0;';
  moreButtonStyle += 'border: none;';
  moreButtonStyle += 'cursor: pointer;';
  moreButtonStyle += 'outline: none;';
  moreButtonStyle += 'appearance: none;';
  moreButtonStyle += 'display: flex;';
  moreButtonStyle += 'align-items: center;';
  moreButtonStyle += 'background-color: #FFF;';

  var hrStyle = '';
  hrStyle += 'width: 150px;';
  hrStyle += 'margin: 0;';
  hrStyle += 'border: none;';
  hrStyle += 'border-top: 1px dashed #ddd;';

  var removeOldElement = () => {
    var oldElement = document.getElementById('file-name-lists');
    if(oldElement) { oldElement.parentNode.removeChild(oldElement); }
  };

  var createNewDiv = () => {
    var div = document.createElement('div');
    div.style = 'margin: 0 0 32px 0';
    div.id = 'file-name-lists';
    return div;
  };

  var addFileNames = (div, fileInfos) => {
    for(var i = 0; i < fileInfos.length; i++) {
      var fileInfo = fileInfos[i];
      var links = fileInfo.getElementsByTagName('a');
      // links[0].title === "" if the file has code owners
      var fileLink = (links[0].title !== "") ? links[0] : links[1];
      var fileName = fileLink.title;
      var href = fileLink.href;

      var diffStat = fileInfo.getElementsByClassName('diffstat')[0];
      if (!diffStat) {
        continue;
      }
      var ariaLabel = diffStat.getAttribute('aria-label');
      var m = /^.+:\s(\d+)\s.+&\s(\d+)\s.+$/.exec(ariaLabel);
      var addition = m ? m[1] : 0;
      var deletion = m ? m[2] : 0;

      var d = document.createElement('div');
      d.style = 'margin-top: 2px;';

      var spanAdd = document.createElement('span');
      spanAdd.innerText = '+' + addition;
      spanAdd.style = spanStyle + 'background-color: #cfc; color: #399839'

      var spanDel = document.createElement('span');
      spanDel.innerText = '-' + deletion;
      spanDel.style = spanStyle + 'background-color: #fdd; color: #c33'

      var a = document.createElement('a');
      a.href = href;
      a.innerText = fileName;
      a.style = fontStyle;

      d.appendChild(spanAdd);
      d.appendChild(spanDel);
      d.appendChild(a);

      div.appendChild(d);
    }
  };

  var addMoreButton = (div) => {
    var button = document.createElement('button');
    button.onclick = run;
    button.style = moreButtonStyle;

    var hr1 = document.createElement('hr');
    hr1.style = hrStyle;
    button.appendChild(hr1);

    var text = document.createElement('div');
    text.innerHTML = 'more';
    text.style = 'margin: 0 8px; height: 16px;';
    button.appendChild(text);

    var hr2 = document.createElement('hr');
    hr2.style = hrStyle;
    button.appendChild(hr2);

    div.appendChild(button);
  };

  var createNewElement = (fileInfos, filesTabCounter) => {
    var div = createNewDiv();
    addFileNames(div, fileInfos);
    if(filesTabCounter && fileInfos.length < filesTabCounter) {
      addMoreButton(div);
    }
    return div;
  };

  var getFilesTabCounter = () => {
    var filesTabCounter = document.getElementById('files_tab_counter');
    if(!filesTabCounter) return null;

    var counter = filesTabCounter.innerHTML;
    return counter && parseInt(counter.trim());
  };

  var run = () => {
    removeOldElement();

    var filesTabCounter = getFilesTabCounter();
    var refElement = document.getElementById('files');
    var fileInfos = document.getElementsByClassName('file-info');
    if(!refElement || fileInfos.length === 0) return;

    var newElement = createNewElement(fileInfos, filesTabCounter);
    refElement.parentNode.insertBefore(newElement, refElement);
  };

  run();

  var rS = window.history.replaceState;
  window.history.replaceState = function(a, b, url) {
    run();
    rS.apply(this, arguments);
  };
})();

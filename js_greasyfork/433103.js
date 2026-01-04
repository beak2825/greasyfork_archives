// ==UserScript==
// @name        Trello easy progress bar [33/100]
// @name:ua     Індикатор виконання для Trello (Easy Progress Bar [33/100])
// @namespace   https://github.com/adelobosko/TrelloProgressBar
// @match       https://trello.com/*
// @grant       none
// @version     1.4.5
// @author      Alex Dielobosko
// @description Easy progress bar for list items, description, and title, just enter: [33/100] or [133/800]$
// @description:ua Простий індекатор виконання для елементів списку, опису та назви, просто введіть: [33/100] або [133/800]$
// @downloadURL https://update.greasyfork.org/scripts/433103/Trello%20easy%20progress%20bar%20%5B33100%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433103/Trello%20easy%20progress%20bar%20%5B33100%5D.meta.js
// ==/UserScript==


var interval = setInterval(replaceCustomProgressBar, 3000);

// [539/1337], [10/100]text
const progressRegex = /\[(\d+)\/(\d+)\](\S+)?/g;


function replaceCustomProgressBar(){
  
  if(document.location.href.startsWith("https://trello.com/b/")){
    
    var cardNameElements = document.querySelectorAll("span.list-card-title.js-card-name");
    for(var i = 0 ; i < cardNameElements.length; i++){
      if (cardNameElements.hasOwnProperty(i)) {
        var element = cardNameElements[i];

        var replacedInnerHtml = getReplacedInnerHtml(element.innerHTML);
        if(replacedInnerHtml){
          element.innerHTML = replacedInnerHtml;
        }
      }
    }
    
  }
  
  
  if(document.location.href.startsWith("https://trello.com/c/")){    
    
    var checklists = document.querySelectorAll(".checklist .checklist-item-details-text");
    for(var i = 0 ; i < checklists.length; i++){
      if (checklists.hasOwnProperty(i)) {
        var element = checklists[i];

        var replacedInnerHtml = getReplacedInnerHtml(element.innerHTML);
        if(replacedInnerHtml){
          element.innerHTML = replacedInnerHtml;
        }
      }
    }

    
    var descriptions = document.querySelectorAll(".js-fill-card-detail-desc .js-desc");
    for(var i = 0 ; i < descriptions.length; i++){
      if (descriptions.hasOwnProperty(i)) {
        var element = descriptions[i];

        var replacedInnerHtml = getReplacedInnerHtml(element.innerHTML);
        if(replacedInnerHtml){
          element.innerHTML = replacedInnerHtml;
        }
      }
    }
    
  }
}

function getReplacedInnerHtml(elementInnerHtml){
  var regexIterator = elementInnerHtml.matchAll(progressRegex);
  let params = Array.from(regexIterator, function (x) { return x; });
  if(params.length === 0){
    return '';
  }
  
    
  var result = elementInnerHtml;
  for(var i = 0; i < params.length; i++){
    if (params.hasOwnProperty(i)) {
      var matchParams = params[i];
      var match = matchParams[0];
      var value = parseInt(matchParams[1]);
      var maxValue = parseInt(matchParams[2]);
      var type = matchParams.length === 4 ? matchParams[3] : null;
      if(maxValue === 0){
        continue;
      }
      
      var progressBarHtml = getProgressBarHtml(value, maxValue, type);
      result = result.replace(match, progressBarHtml);
    }
  }
  
  return result;
}


function getProgressBarHtml(value, maxValue, type){
  var isCompleted = value >= maxValue;
  var percent = isCompleted ? 100 : (Math.round(value * 100) / maxValue).toFixed(1);
  var completed = isCompleted ? 'checklist-progress-bar-current-complete' : '';
  var typeText = type ? ' ' + type : '';
  
  var progressBarHtml = '<div class="checklist-progress">'
    + '<span class="checklist-progress-percentage">' + percent + '%</span>'
    + '<div class="checklist-progress-bar" style="height:12px;">'
      + '<div class="checklist-progress-bar-current checklist-progress-bar-current-delay ' + completed + '" style="width: ' + percent + '%;"></div>'
      + '<span style="text-align: center;width: 100%;line-height: 10px;font-size: 11px;position: absolute;top: -1px;color: ' + (isCompleted ? '#010' : 'var(--ds-text,#172b4d)' ) + ';">' + value + ' / ' + maxValue + typeText + '</span>'
    + '</div>'
  + '</div>';
  
  return progressBarHtml;
}

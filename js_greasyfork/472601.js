// ==UserScript==
// @name     SimplySwimClassExtract
// @description Extracts the Class information from the attendance screen
// @version  1.3
// @grant    unsafewindow
// @run-at   document-end
// @match 	 https://b1101334.simplyswim.net.au/main*
// @require  https://code.jquery.com/jquery-3.5.0.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1088091
// @downloadURL https://update.greasyfork.org/scripts/472601/SimplySwimClassExtract.user.js
// @updateURL https://update.greasyfork.org/scripts/472601/SimplySwimClassExtract.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.

function extractInfo() {
  var dateInfo = document.querySelector('.title_wrapper h2');
	var date = '';
	dateInfo.childNodes.forEach(function(node) {
  	if (node.nodeName !== 'A') {
    	date += node.textContent.trim();
  	}
	});
  
  var weekday = date.split(' ')[0];
  var justDate = date.split(' ')[1];
  var dayMonth = justDate
    .split('/')
    .map(function (part) {
        return part.replace(/^0+/, '');
    })
    .join('/');
  console.log(weekday);
  console.log(justDate);
  console.log(dayMonth);
  
  var tables = document.querySelectorAll('table');
  if (tables.length < 2) {
    return [];
  }

  var table = tables[1]; // Select the second table (index 1)
  var info = [];

  info.push(weekday);
  info.push(justDate);
  
  var rows = table.querySelectorAll('tr');
  rows.forEach(function(row) {
    var thElement = row.querySelector('th');
    if (thElement) {
      var content4 = "";
      var aElements = thElement.querySelectorAll('a');
      if (aElements.length >= 2) {
  			var content = aElements[1].textContent.trim();
  			var imgElement = aElements[1].querySelector('img');
  			var content4 = imgElement ? imgElement.getAttribute('title') : '';
        if (content4 == "Class Past Start Time"){
          var secimgElement = aElements[1].querySelectorAll('img')[1];
          var content4 = secimgElement ? secimgElement.getAttribute('title') : '';
        }
  			if (content4 !== null) {
          
          content4 = content4.substring(content4.lastIndexOf(':') + 2);
    			info.push(content.slice(0,content.indexOf(" - ",content.indexOf(" - ")+1)+3) + content4 + ' + ' + content.slice(content.indexOf(" - ",content.indexOf(" - ")+1)+3));
  			} else {
    			info.push(content);
  			}
			}
    }

    var tdElements = row.querySelectorAll('td');
    if (tdElements.length >= 2) {
      var content1 = '';
      var content2 = '';
      var content3 = '';

      var bElement = tdElements[0].querySelector('b');
      if (bElement) {
        content1 = bElement.textContent.trim();
      }

      var imgElements = tdElements[0].querySelectorAll('img');
      imgElements.forEach(function(imgElement) {
        var title = imgElement.getAttribute('title');
        if (title.includes('recently changed Levels')) {
          title = "UP "+ dayMonth;
        } else if (title.includes('medical alert')) {
          title = "Q";
        } else if (title.includes('Birthday')) {
          title = "BD";
        } else if (title.includes('First Attendance')) {
          title = "N "+ dayMonth;
        } else if (title.includes('make-up')) {
          title = "MU "+ dayMonth;
        } 
        content3 += title + ' ';
      });

      content2 = tdElements[1].childNodes[1].textContent.trim();
      if(content2.includes('Leave')){
        	content2 = "L " + dayMonth;  
      }else if(content2.includes('Away')){
        	content2 = "A " + dayMonth;  
      }else if(content2.includes('Holiday')){
        	content2 = "HP " + dayMonth;  
      }else if (content2.includes('Medical')){
        	content2 = "A " + dayMonth;
      }else if (content2.includes('Something')){
      		content2 = "A " + dayMonth;
      }else if (content2.includes('I am sick')){
      		content2 = "A " + dayMonth;
      }else if (content2.includes('Not Starting Yet')){
      		content2 = "Not Yet " + dayMonth;
      }else if (content2.includes('Admin No Credit')){
      		content2 = "A " + dayMonth;
      }else if (content2.includes('Admin with Credit')){
      		content2 = "A " + dayMonth;
      }else if (content2.includes('Marked as Attend')){
          content2 = "";
      }

      
      info.push(content1 + ' ^ ' + content3.trim() + ' ^ ' + content2);
    }
  });

  return info;
}

function displayInfoOnPage(info) {
  var infoContainer = document.createElement('div');
  infoContainer.id = 'infoContainer';
  infoContainer.style.margin = '20px';
  var pElement = document.createElement('div');

  info.forEach(function(item) {
    
    if (item.includes('Lane')) {
      infoContainer.appendChild(pElement);
      pElement = document.createElement('div');
    } else{
    	pElement.textContent += ' - ' 
    }
    
		pElement.textContent += item;
    
  });
	infoContainer.appendChild(pElement);
  document.body.appendChild(infoContainer);
}


function hideOtherElements() {
  var allElements = document.querySelectorAll('div');
  var myButton = document.getElementById('myButton');
  allElements.forEach(function(element) {
    if (element !== myButton) {
            // Hide the element
            element.style.setProperty('display', 'none', 'important');
        }
    //element.style.setProperty('display', 'none', 'important');
  });
}

function showInfoAndHideElements() {
  if (toggleState){
  	var extractedInfo = extractInfo();
  	hideOtherElements();
  	document.body.style.overflow = 'auto';
  	displayInfoOnPage(extractedInfo);
    toggleState = !toggleState;
    button.textContent = 'Revert Info';
		document.body.prepend(button);
  }else{
    location.reload();
	}
  
}

var toggleState = true;
//showInfoAndHideElements();

// Create a button
var button = document.createElement('button');
var targetElement = document.querySelector('.table_wrapper_inner > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)');
targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
button.textContent = 'Show Class Info';
button.id = 'myButton';
//button.style.margin = '40px';
//button.style.position = 'fixed';
//button.style.zIndex =  '500';
button.addEventListener('click', showInfoAndHideElements);

// Append the button to the document body
//document.body.prepend(button);
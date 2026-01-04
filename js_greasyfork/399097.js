// ==UserScript==
// @name        Zooniverse Rainfall Rescue form align
// @namespace   https://github.com/CzarnyZajaczek
// @description align form with scan
// @include     https://www.zooniverse.org/projects/edh/rainfall-rescue/classify
// @version     0.5
// @author      Tomasz Dąbski "CzarnyZajaczek"
// @license     GPL-3.0 http://www.gnu.org/licenses/gpl-3.0.txt
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/399097/Zooniverse%20Rainfall%20Rescue%20form%20align.user.js
// @updateURL https://update.greasyfork.org/scripts/399097/Zooniverse%20Rainfall%20Rescue%20form%20align.meta.js
// ==/UserScript==


var scriptValue = "// function ZooniverseRainfallRescueFormAlign() {\n"+
"//   \n"+
"// }\n"+
"// code of function ZooniverseRainfallRescueFormAligndragElement() copied from https://www.w3schools.com/howto/howto_js_draggable.asp and slightly adapted (function name and DOM ids)\n"+
"// Make the DIV element draggable:\n"+
"ZooniverseRainfallRescueFormAligndragElement(document.getElementById(\"greasemonkey-zooniverse-rainfall-rescue-form-aligned_verlay_form\"));\n"+
"function ZooniverseRainfallRescueFormAligndragElement(elmnt) {\n"+
"  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;\n"+
"  if (document.getElementById(\"greasemonkey-zooniverse-rainfall-rescue-form-drag_overlay_form\")) {\n"+
"    // if present, the header is where you move the DIV from:\n"+
"    document.getElementById(\"greasemonkey-zooniverse-rainfall-rescue-form-drag_overlay_form\").onmousedown = dragMouseDown;\n"+
"  } else {\n"+
"    // otherwise, move the DIV from anywhere inside the DIV:\n"+
"    elmnt.onmousedown = dragMouseDown;\n"+
"  }\n"+
"  function dragMouseDown(e) {\n"+
"    e = e || window.event;\n"+
"    e.preventDefault();\n"+
"    // get the mouse cursor position at startup:\n"+
"    pos3 = e.clientX;\n"+
"    pos4 = e.clientY;\n"+
"    document.onmouseup = closeDragElement;\n"+
"    // call a function whenever the cursor moves:\n"+
"    document.onmousemove = elementDrag;\n"+
"  }\n"+
"  function elementDrag(e) {\n"+
"    e = e || window.event;\n"+
"    e.preventDefault();\n"+
"    // calculate the new cursor position:\n"+
"    pos1 = pos3 - e.clientX;\n"+
"    pos2 = pos4 - e.clientY;\n"+
"    pos3 = e.clientX;\n"+
"    pos4 = e.clientY;\n"+
"    // set the element's new position:\n"+
"    elmnt.style.top = (elmnt.offsetTop - pos2) + \"px\";\n"+
"    elmnt.style.left = (elmnt.offsetLeft - pos1) + \"px\";\n"+
"  }\n"+
"  function closeDragElement() {\n"+
"    // stop moving when mouse button is released:\n"+
"    document.onmouseup = null;\n"+
"    document.onmousemove = null;\n"+
"  }\n"+
"}\n"+
"function ZooniverseRainfallRescueFormAlignDecreaseSize() {\n"+
"  var pixelsDisplay;\n"+
"  var formRowHeight;\n"+
"  var rawNumber;\n"+
"  var formTable;\n"+
"  var formTableRows;\n"+
"  var i;\n"+
"  \n"+
"  pixelsDisplay = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-pixels_display');\n"+
"  \n"+
"  formRowHeight = pixelsDisplay.innerHTML;\n"+
"  rawNumber = formRowHeight.split('px')[0];\n"+
"  \n"+
"  if (rawNumber >1) {\n"+
"    rawNumber--;\n"+
"  }\n"+
"  \n"+
"  pixelsDisplay.innerHTML = rawNumber+'px';\n"+
"  formTable = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-form_table');\n"+
"  \n"+
"  formTableRows = formTable.getElementsByTagName('tr');\n"+
"  \n"+
"  for (i = 0; i < formTableRows.length; i++) {\n"+
"    if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {\n"+
"      formTableRows[i].style.height = rawNumber+'px';\n"+
"    }\n"+
"  }\n"+
"  \n"+
"}\n"+
"function ZooniverseRainfallRescueFormAlignIncreaseSize() {\n"+
"  var pixelsDisplay;\n"+
"  var formRowHeight;\n"+
"  var rawNumber;\n"+
"  var formTable;\n"+
"  var formTableRows;\n"+
"  var i;\n"+
"  \n"+
"  pixelsDisplay = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-pixels_display');\n"+
"  \n"+
"  formRowHeight = pixelsDisplay.innerHTML;\n"+
"  \n"+
"  rawNumber = formRowHeight.split('px')[0];\n"+
"  \n"+
"  if (rawNumber <200) {\n"+
"    rawNumber++;\n"+
"  }\n"+
"  \n"+
"  pixelsDisplay.innerHTML = rawNumber+'px';\n"+
"  \n"+
"  formTable = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-form_table');\n"+
"  \n"+
"  formTableRows = formTable.getElementsByTagName('tr');\n"+
"  \n"+
"  for (i = 0; i < formTableRows.length; i++) {\n"+
"    if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {\n"+
"      formTableRows[i].style.height = rawNumber+'px';\n"+
"    }\n"+
"  }\n"+
"  \n"+
"}\n"+
"function ZooniverseRainfallRescueFormAlignReloadFormWaiter() {\n"+
"  var scriptLockDivId;\n"+
"  var scriptLock;\n"+
"  var scriptLockParent;\n"+
"  var setIntervalIdBox;\n"+
"  var setIntervalId;\n"+
"  \n"+
"  scriptLockDivId = 'greasemonkey-zooniverse-rainfall-rescue-form-align-reload_form_processing';\n"+
"  scriptLock = document.getElementById(scriptLockDivId);\n"+
"  if (scriptLock) {\n"+
"    scriptLockParent = scriptLock.parentNode;\n"+
"    scriptLockParent.removeChild(scriptLock);\n"+
"  }\n"+
"  \n"+
"  \n"+
"  \n"+
"  setIntervalIdBox = [];\n"+
"  setIntervalId = setInterval(function(){\n"+
"    // check for elements loaded\n"+
"    var divElements;\n"+
"    var parentDiv;\n"+
"    var taskContainerElement;\n"+
"    var taskContainerParent;\n"+
"    var taskContainerParentButtons;\n"+
"    var workflowTaskDivs;\n"+
"    var workflowTaskElements;\n"+
"    var inputTextarea;\n"+
"    var classifierLargeImageDiv;\n"+
"    var subjectViewerDiv;\n"+
"    var classifierLargeImageDivDivs;\n"+
"    var scriptLock;\n"+
"    var headerElement;\n"+
"    var scriptLockDiv;\n"+
"    var formPositionTop;\n"+
"    var formPositionLeft;\n"+
"//   var firstYearPositionLeft;\n"+
"    var formPositionLeftByYear;\n"+
"    var formTable;\n"+
"    var formTableRowsInputs;\n"+
"    var rowsFound;\n"+
"    var formTableRows;\n"+
"    var formTableRowsTDs;\n"+
"    var i;\n"+
"    var j;\n"+
"    var k;\n"+
"    var childNodes;\n"+
"    var tdElements;\n"+
"    var formTableTdCalculated;\n"+
"    var formTableTdIsDiffer;\n"+
"    var yearFound;\n"+
"    var year;\n"+
"    var rowDivs;\n"+
"    var formInput;\n"+
"    var formLabel;\n"+
"    var formLabelDiv;\n"+
"    var workflowTaskElementDivs;\n"+
"    var formLabelStrong;\n"+
"    var yearNumber;\n"+
"    var formTableTdI;\n"+
"    var formLabelBox;\n"+
"    var formTableTdL;\n"+
"    var yearText;\n"+
"    var lastDigit;\n"+
"    var lastDigitNumber;\n"+
"    var newFormPositionLeft;\n"+
"    var innerSpan;\n"+
"    var formOverlayContainerDiv;\n"+
"    \n"+
"    divElements = document.getElementsByTagName('div');\n"+
"    parentDiv = false;\n"+
"    for (i = 0; i < divElements.length; i++) {\n"+
"      if ((' ' + divElements[i].className + ' ').indexOf(' project-page ') > -1) {\n"+
"        parentDiv = divElements[i];\n"+
"        break;\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    \n"+
"    taskContainerElement = false;\n"+
"    \n"+
"    for (i = 0; i < divElements.length; i++) {\n"+
"      if ((' ' + divElements[i].className + ' ').indexOf(' task-container ') > -1) {\n"+
"        taskContainerElement = divElements[i];\n"+
"        break;\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    if (!taskContainerElement) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    \n"+
"    taskContainerParent = taskContainerElement.parentNode;\n"+
"    if (!taskContainerParent) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    taskContainerParentButtons = taskContainerParent.getElementsByTagName('button');\n"+
"    if (!taskContainerParentButtons) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    \n"+
"    workflowTaskDivs = taskContainerElement.getElementsByTagName('div');\n"+
"    workflowTaskElements = [];\n"+
"    \n"+
"    for (i = 0; i < workflowTaskDivs.length; i++) {\n"+
"      if ((' ' + workflowTaskDivs[i].className + ' ').indexOf(' workflow-task ') > -1) {\n"+
"        workflowTaskElements.push(workflowTaskDivs[i]);\n"+
"        inputTextarea = workflowTaskDivs[i].getElementsByTagName('textarea')[0];\n"+
"        if (!inputTextarea) {\n"+
"          return;\n"+
"        }\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    if (workflowTaskElements.length < 13) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    classifierLargeImageDiv = false;\n"+
"    \n"+
"    for (i = 0; i < divElements.length; i++) {\n"+
"      if ((' ' + divElements[i].className + ' ').indexOf(' classifier ') > -1) {\n"+
"        if ((' ' + divElements[i].className + ' ').indexOf(' large-image ') > -1) {\n"+
"        classifierLargeImageDiv = divElements[i];\n"+
"        break;\n"+
"        }\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    if (!classifierLargeImageDiv) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    \n"+
"    subjectViewerDiv = false;\n"+
"    classifierLargeImageDivDivs = classifierLargeImageDiv.getElementsByTagName('div');\n"+
"    for (i = 0; i < classifierLargeImageDivDivs.length; i++) {\n"+
"      if ((' ' + classifierLargeImageDivDivs[i].className + ' ').indexOf(' subject-viewer ') > -1) {\n"+
"        subjectViewerDiv = classifierLargeImageDivDivs[i];\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    if (!subjectViewerDiv) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    \n"+
"    if (!parentDiv) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    // lock, in case of unsynced 2 calls\n"+
"    scriptLock = document.getElementById(scriptLockDivId);\n"+
"    if (scriptLock) {\n"+
"      return;\n"+
"    }\n"+
"    \n"+
"    headerElement = parentDiv.getElementsByTagName('header')[0];\n"+
"  \n"+
"    scriptLockDiv = document.createElement('DIV');\n"+
"    scriptLockDiv.id = scriptLockDivId;\n"+
"    \n"+
"    parentDiv.insertBefore(scriptLockDiv, headerElement);\n"+
"    \n"+
"    formOverlayContainerDiv = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-aligned_verlay_form');\n"+
"    \n"+
"    \n"+
"    formPositionTop = \"429px\";\n"+
"    formPositionLeft = \"860px\";\n"+
"    \n"+
"  //   firstYearPositionLeft = \"235px\";\n"+
"    \n"+
"    formPositionLeftByYear = [];\n"+
"    formPositionLeftByYear.push(\"235px\"); //0\n"+
"    formPositionLeftByYear.push(\"296px\"); //1\n"+
"    formPositionLeftByYear.push(\"353px\"); //2\n"+
"    formPositionLeftByYear.push(\"412px\");//3\n"+
"    formPositionLeftByYear.push(\"470px\");//4\n"+
"    formPositionLeftByYear.push(\"529px\");//5\n"+
"    formPositionLeftByYear.push(\"587px\");//6\n"+
"    formPositionLeftByYear.push(\"646px\");//7\n"+
"    formPositionLeftByYear.push(\"704px\");//8\n"+
"    formPositionLeftByYear.push(\"763px\");//9\n"+
"    \n"+
"//     formOverlayContainerDiv.style.top = formPositionTop;\n"+
"    formOverlayContainerDiv.style.left = formPositionLeft;\n"+
"    \n"+
"    // unload form elements\n"+
"    formTable = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-form_table');\n"+
"    \n"+
"    formTableRowsInputs = [];\n"+
"    \n"+
"    rowsFound = 0;\n"+
"    formTableRows = formTable.getElementsByTagName('tr');\n"+
"    for (i = 0; i < formTableRows.length; i++) {\n"+
"      if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {\n"+
"        formTableRowsTDs = formTableRows[i].childNodes;\n"+
"        for (j = 0; j < formTableRowsTDs.length; j++) {\n"+
"          childNodes = formTableRowsTDs[j].childNodes;\n"+
"          for (k = 0; k < childNodes.length; k++) {\n"+
"            formTableRowsTDs[j].removeChild(childNodes[k]);\n"+
"          }\n"+
"        }\n"+
"        formTableRowsInputs.push(formTableRows[i]);\n"+
"        rowsFound++;\n"+
"      }\n"+
"      \n"+
"      if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-control_checksum ') > -1) {\n"+
"        tdElements = formTableRows[i].getElementsByTagName('td');\n"+
"        formTableTdCalculated = tdElements[0];\n"+
"        formTableTdIsDiffer = tdElements[1];\n"+
"        \n"+
"        childNodes = formTableTdCalculated.childNodes;\n"+
"        for (k = 0; k < childNodes.length; k++) {\n"+
"          formTableTdCalculated.removeChild(childNodes[k]);\n"+
"        }\n"+
"        childNodes = formTableTdIsDiffer.childNodes;\n"+
"        for (k = 0; k < childNodes.length; k++) {\n"+
"          formTableTdIsDiffer.removeChild(childNodes[k]);\n"+
"        }\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    \n"+
"    // load form elements again into table\n"+
"    \n"+
"    yearFound = false;\n"+
"    year = false;\n"+
"    \n"+
"    for (i = 0; i < workflowTaskElements.length; i++) {\n"+
"      rowDivs = formTableRowsInputs[i].getElementsByTagName('td');\n"+
"      \n"+
"      formInput = workflowTaskElements[i].getElementsByTagName('label')[0];\n"+
"      formLabelDiv = false;\n"+
"      \n"+
"      workflowTaskElementDivs = workflowTaskElements[i].getElementsByTagName('div');\n"+
"      for (j = 0; j < workflowTaskElementDivs.length; j++) {\n"+
"        if ((' ' + workflowTaskElementDivs[j].className + ' ').indexOf(' markdown ') > -1) {\n"+
"          if ((' ' + workflowTaskElementDivs[j].className + ' ').indexOf(' question ') > -1) {\n"+
"          formLabelDiv =workflowTaskElementDivs[j];\n"+
"          break;\n"+
"          }\n"+
"        }\n"+
"      }\n"+
"      \n"+
"      if (formLabelDiv.getElementsByTagName('p').length > 1) {\n"+
"        k = formLabelDiv.getElementsByTagName('p').length;\n"+
"        k--;\n"+
"        formLabel = formLabelDiv.getElementsByTagName('p')[k];\n"+
"      } else {\n"+
"        formLabel = formLabelDiv.getElementsByTagName('p')[0];\n"+
"      }\n"+
"      if (!yearFound) {\n"+
"        formLabelStrong = formLabel.getElementsByTagName('strong')[0];\n"+
"        year = formLabelStrong.innerHTML.split(' ');\n"+
"        for (j = 0; j < year.length; j++) {\n"+
"          yearNumber = parseInt(year[j]);\n"+
"          if (yearNumber>1000 && yearNumber<2021) {\n"+
"            yearFound = true;\n"+
"          }\n"+
"        }\n"+
"      }\n"+
"      formLabel.style.margin = \"0px\";\n"+
"      \n"+
"      formInput.getElementsByTagName('textarea')[0].style.padding = \"0px\";\n"+
"      \n"+
"      formTableTdI = rowDivs[0];\n"+
"      \n"+
"      formTableTdI.appendChild(formInput);\n"+
"      \n"+
"      formLabelBox = document.createElement('DIV');\n"+
"      formLabelBox.appendChild(formLabel);\n"+
"      \n"+
"      formTableTdL = rowDivs[1];\n"+
"      \n"+
"      formTableTdL.appendChild(formLabelBox);\n"+
"    }\n"+
"    \n"+
"    if (yearFound) {\n"+
"      // take last digit from year\n"+
"      yearText = year.toString();\n"+
"      lastDigit = yearText[yearText.length -1];\n"+
"      \n"+
"      lastDigitNumber = parseInt(lastDigit);\n"+
"      \n"+
"      newFormPositionLeft = formPositionLeftByYear[lastDigitNumber];\n"+
"      formOverlayContainerDiv.style.left = newFormPositionLeft;\n"+
"    }\n"+
"    \n"+
"    // add event listener to button\n"+
"    \n"+
"    taskContainerParent = taskContainerElement.parentNode;\n"+
"    \n"+
"    taskContainerParentButtons = taskContainerParent.getElementsByTagName('button');\n"+
"    \n"+
"    for (i = 0; i < taskContainerParentButtons.length; i++) {\n"+
"      innerSpan = taskContainerParentButtons[i].getElementsByTagName('span')[0];\n"+
"      if (innerSpan.innerHTML.trim().toLowerCase() == 'done') {\n"+
"        if (taskContainerParentButtons[i].addEventListener) {\n"+
"          taskContainerParentButtons[i].addEventListener(\"click\", ZooniverseRainfallRescueFormAlignReloadFormWaiter);\n"+
"        } else if (taskContainerParentButtons[i].attachEvent) {\n"+
"          taskContainerParentButtons[i].attachEvent(\"onclick\", ZooniverseRainfallRescueFormAlignReloadFormWaiter);\n"+
"        }\n"+
"        break;\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    // control checksum\n"+
"    \n"+
"    formTableRows = formTable.getElementsByTagName('tr');\n"+
"    for (i = 0; i < formTableRows.length; i++) {\n"+
"      if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {\n"+
"        inputTextarea = formTableRows[i].getElementsByTagName('textarea')[0];\n"+
"        \n"+
"        if (inputTextarea.addEventListener) {\n"+
"          inputTextarea.addEventListener(\"input\", ZooniverseRainfallRescueFormAlignChecksum);\n"+
"        } else if (inputTextarea.attachEvent) {\n"+
"          inputTextarea.attachEvent(\"oninput\", ZooniverseRainfallRescueFormAlignChecksum);\n"+
"        }\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    \n"+
"    // turn off timer\n"+
"    \n"+
"    if (setIntervalIdBox.length == 1) {\n"+
"      clearInterval(setIntervalIdBox[0]);\n"+
"    }\n"+
"  }, 300, setIntervalIdBox);\n"+
"  setIntervalIdBox.push(setIntervalId);\n"+
"}\n"+
"function ZooniverseRainfallRescueFormAlignChecksum() {\n"+
"  var formTable;\n"+
"  var formTableRows;\n"+
"  var sumValue;\n"+
"  var difference;\n"+
"  var isDiffer;\n"+
"  var maxPrecision;\n"+
"  var inputTextarea;\n"+
"  var inputValue;\n"+
"  var numberText;\n"+
"  var numberParts;\n"+
"  var numberPrecision;\n"+
"  var tmpsumValue;\n"+
"  var tmpinputValue;\n"+
"  var tdElements;\n"+
"  var formTableTdCalculated;\n"+
"  var formTableTdIsDiffer;\n"+
"  var childNodes;\n"+
"  var i;\n"+
"  var j;\n"+
"  var k;\n"+
"  var checksumSpan;\n"+
"  var checksumContents;\n"+
"  var summarySpan;\n"+
"  var summaryContents;\n"+
"  formTable = document.getElementById('greasemonkey-zooniverse-rainfall-rescue-form-form_table');\n"+
"  \n"+
"  \n"+
"  formTableRows = formTable.getElementsByTagName('tr');\n"+
"  \n"+
"  sumValue = 0;\n"+
"  difference = 0;\n"+
"  isDiffer = false;\n"+
"  maxPrecision = 0;\n"+
"  \n"+
"  for (i = 0; i < formTableRows.length; i++) {\n"+
"    if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {\n"+
"      inputTextarea = formTableRows[i].getElementsByTagName('textarea')[0];\n"+
"      \n"+
"      inputValue = parseFloat(inputTextarea.value);\n"+
"      if (isNaN(inputValue)) {\n"+
"        inputValue = 0;\n"+
"      }\n"+
"//       alert(1);\n"+
"      numberText = inputTextarea.value.trim().replace(',', '.');\n"+
"//       alert(2);\n"+
"      if (numberText.indexOf('.') > -1) {\n"+
"//       alert(3);\n"+
"        numberParts = numberText.split('.');\n"+
"//       alert(4);\n"+
"        numberPrecision = numberParts[1].length;\n"+
"//       alert(5);\n"+
"        if (numberPrecision> maxPrecision) {\n"+
"//       alert(6);\n"+
"          maxPrecision = numberPrecision;\n"+
"        }\n"+
"      }\n"+
"      if (i<13) {\n"+
"        sumValue = sumValue + inputValue;\n"+
"      } else {\n"+
"        tmpsumValue = sumValue;\n"+
"        tmpinputValue = inputValue;\n"+
"        if (maxPrecision > 0) {\n"+
"//       alert(7);\n"+
"          for (j=0; j<maxPrecision; j++) {\n"+
"//       alert(8);\n"+
"            tmpsumValue = tmpsumValue * 10;\n"+
"            tmpinputValue = tmpinputValue * 10;\n"+
"          }\n"+
"//       alert(9);\n"+
"        }\n"+
"        tmpsumValue = Math.round(tmpsumValue);\n"+
"//       alert(10);\n"+
"        tmpinputValue = Math.round(tmpinputValue);\n"+
"//       alert(11);\n"+
"        \n"+
"        \n"+
"        if (tmpsumValue == tmpinputValue) {\n"+
"          isDiffer = false;\n"+
"        } else {\n"+
"          isDiffer = true;\n"+
"          difference = inputValue - sumValue;\n"+
"        }\n"+
"      }\n"+
"    }\n"+
"    \n"+
"    if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-control_checksum ') > -1) {\n"+
"      tdElements = formTableRows[i].getElementsByTagName('td');\n"+
"      formTableTdCalculated = tdElements[0];\n"+
"      formTableTdIsDiffer = tdElements[1];\n"+
"      \n"+
"      childNodes = formTableTdCalculated.childNodes;\n"+
"      for (k = 0; k < childNodes.length; k++) {\n"+
"        formTableTdCalculated.removeChild(childNodes[k]);\n"+
"      }\n"+
"      childNodes = formTableTdIsDiffer.childNodes;\n"+
"      for (k = 0; k < childNodes.length; k++) {\n"+
"        formTableTdIsDiffer.removeChild(childNodes[k]);\n"+
"      }\n"+
"      \n"+
"      checksumSpan = document.createElement('span');\n"+
"      checksumContents = document.createTextNode(sumValue);\n"+
"      checksumSpan.appendChild(checksumContents);\n"+
"      formTableTdCalculated.appendChild(checksumSpan);\n"+
"      \n"+
"      summarySpan = document.createElement('span');\n"+
"      if (!isDiffer) {\n"+
"        summaryContents = document.createTextNode('equal');\n"+
"        summarySpan.style.color = 'green';\n"+
"        summarySpan.style.fontWeight = 'bold';\n"+
"      } else {\n"+
"        summarySpan.style.fontWeight = 'normal';\n"+
"        summarySpan.style.color = 'red';\n"+
"        if (difference > 0) {\n"+
"          summaryContents = document.createTextNode('+'+difference);\n"+
"//           summarySpan.style.color = 'red';\n"+
"        } else {\n"+
"          summaryContents = document.createTextNode(difference);\n"+
"//           summarySpan.style.color = 'blue';\n"+
"        }\n"+
"      }\n"+
"      \n"+
"      summarySpan.appendChild(summaryContents);\n"+
"      formTableTdIsDiffer.appendChild(summarySpan);\n"+
"    }\n"+
"  }\n"+
"}\n"+
"function ZooniverseRainfallRescueFormAlignCommaDot() {\n"+
"  \n"+
"}";

var setIntervalIdBox = [];

var setIntervalId = setInterval(function(){
  var scriptAddedDivId;
  var scriptLockDivId;
  var scriptAdded;
  var divElements;
  var parentDiv;
  var taskContainerElement;
  var taskContainerParent;
  var taskContainerParentButtons;
  var workflowTaskDivs;
  var workflowTaskElements;
  var inputTextarea;
  var classifierLargeImageDiv;
  var subjectViewerDiv;
  var classifierLargeImageDivDivs;
  var scriptLock;
  var headerElement;
  var scriptLockDiv;
  var formOverlayContainerDivId;
  var formOverlayContainerDiv;
//   var debugContents;
  var formRowFirstRowOffsetTop;
  var formRowHeight;
  var formRowTotalTop;
  var formPositionTop;
  var formPositionLeft;
//   var firstYearPositionLeft;
  var formPositionLeftByYear;
  var headerDiv;
  var headerContents;
  var headerTable;
  var headerTableTbody;
  var headerTR;
  var headerTD;
  var minusButton;
  var buttonContents;
  var pixelsDisplay;
  var plusButton;
  var formTable;
  var formTableTbody;
  var yearFound;
  var year;
  var formSpacerRow;
  var formTableTdI;
  var formTableTdL;
  var formRow;
  var formInput;
  var formLabel;
  var formLabelDiv;
  var workflowTaskElementDivs;
  var i;
  var j;
  var k;
  var formLabelStrong;
  var yearNumber;
  var formLabelBox;
  var yearText;
  var lastDigit;
  var lastDigitNumber;
  var newFormPositionLeft;
  var ScriptTag;
  var ScriptTagContents;
  var scriptAddedDiv;
  var formTableTdCalculated;
  var formTableTdCalculatedPlaceholder;
  var formTableTdIsDiffer;
  var formTableRows;
  var innerSpan;
  var classifierLargeImageDivNavs;
  var formTableTd;

  scriptAddedDivId = 'greasemonkey-zooniverse-rainfall-rescue-form-align';
  scriptLockDivId = 'greasemonkey-zooniverse-rainfall-rescue-form-align-reload_form_processing';
  scriptAdded = document.getElementById(scriptAddedDivId);
  if (scriptAdded) {
    if (setIntervalIdBox.length == 1) {
      clearInterval(setIntervalIdBox[0]);
    }
    return;
  }
  divElements = document.getElementsByTagName('div');
  parentDiv = false;
  for (i = 0; i < divElements.length; i++) {
    if ((' ' + divElements[i].className + ' ').indexOf(' project-page ') > -1) {
      parentDiv = divElements[i];
      break;
    }
  }
  
  
  taskContainerElement = false;
  
  for (i = 0; i < divElements.length; i++) {
    if ((' ' + divElements[i].className + ' ').indexOf(' task-container ') > -1) {
      taskContainerElement = divElements[i];
      break;
    }
  }
  
  if (!taskContainerElement) {
    return;
  }
  
  taskContainerParent = taskContainerElement.parentNode;
  if (!taskContainerParent) {
    return;
  }
  
  taskContainerParentButtons = taskContainerParent.getElementsByTagName('button');
  if (!taskContainerParentButtons) {
    return;
  }
  
  
  workflowTaskDivs = taskContainerElement.getElementsByTagName('div');
  workflowTaskElements = [];
  
  for (i = 0; i < workflowTaskDivs.length; i++) {
    if ((' ' + workflowTaskDivs[i].className + ' ').indexOf(' workflow-task ') > -1) {
      workflowTaskElements.push(workflowTaskDivs[i]);
      inputTextarea = workflowTaskDivs[i].getElementsByTagName('textarea')[0];
      if (!inputTextarea) {
        return;
      }
    }
  }
  
  if (workflowTaskElements.length < 13) {
    return;
  }
  
  classifierLargeImageDiv = false;
  
  for (i = 0; i < divElements.length; i++) {
    if ((' ' + divElements[i].className + ' ').indexOf(' classifier ') > -1) {
      if ((' ' + divElements[i].className + ' ').indexOf(' large-image ') > -1) {
      classifierLargeImageDiv = divElements[i];
      break;
      }
    }
  }
  
  if (!classifierLargeImageDiv) {
    return;
  }
  
  
  subjectViewerDiv = false;
  classifierLargeImageDivDivs = classifierLargeImageDiv.getElementsByTagName('div');

  for (i = 0; i < classifierLargeImageDivDivs.length; i++) {
    if ((' ' + classifierLargeImageDivDivs[i].className + ' ').indexOf(' subject-viewer ') > -1) {
      subjectViewerDiv = classifierLargeImageDivDivs[i];
    }
  }
  
  if (!subjectViewerDiv) {
    return;
  }
  
  
  if (!parentDiv) {
    return;
  }
  
  scriptLock = document.getElementById(scriptLockDivId);
  if (scriptLock) {
    return;
  } 
  
  headerElement = parentDiv.getElementsByTagName('header')[0];

  scriptLockDiv = document.createElement('DIV');
  scriptLockDiv.id = scriptLockDivId;
  
  parentDiv.insertBefore(scriptLockDiv, headerElement);
  
  
  
  // rearrange form
  formOverlayContainerDivId = 'greasemonkey-zooniverse-rainfall-rescue-form-aligned_verlay_form';
  formOverlayContainerDiv = document.createElement('DIV');
  formOverlayContainerDiv.id = formOverlayContainerDivId;
  
//   debugContents = document.createTextNode('-- form --');
//   formOverlayContainerDiv.appendChild(debugContents);
  formOverlayContainerDiv.style.zIndex = '10';
  classifierLargeImageDiv.style.justifyContent = 'left';
  formOverlayContainerDiv.style.position = "absolute";
  
  classifierLargeImageDiv.appendChild(formOverlayContainerDiv);
  
  formOverlayContainerDiv.style.backgroundColor = 'white';
  
  formRowFirstRowOffsetTop = "8px";
  formRowHeight = "35px"; // with borderBottom 1px = 36px
  formRowTotalTop = "19px";
  formPositionTop = "429px";
  formPositionLeft = "860px";
  
//   firstYearPositionLeft = "235px";
  
  formPositionLeftByYear = [];
  formPositionLeftByYear.push("235px"); //0
  formPositionLeftByYear.push("296px"); //1
  formPositionLeftByYear.push("353px"); //2
  formPositionLeftByYear.push("412px");//3
  formPositionLeftByYear.push("470px");//4
  formPositionLeftByYear.push("529px");//5
  formPositionLeftByYear.push("587px");//6
  formPositionLeftByYear.push("646px");//7
  formPositionLeftByYear.push("704px");//8
  formPositionLeftByYear.push("763px");//9
  
  formOverlayContainerDiv.style.top = formPositionTop;
  formOverlayContainerDiv.style.left = formPositionLeft;
  
  // draggable header
  headerDiv = document.createElement('DIV');
  headerDiv.id = 'greasemonkey-zooniverse-rainfall-rescue-form-drag_overlay_form';
  
  headerContents = document.createTextNode('click here to drag this form');
  headerDiv.appendChild(headerContents);
  headerDiv.style.backgroundColor = "#2196F3";
  headerDiv.style.color = "#FFFFFF";
  
  headerDiv.title = "Align bottom of this header to bottom line of row containing years";
  
  // header table
  headerTable = document.createElement('TABLE');
  formOverlayContainerDiv.appendChild(headerTable);
  headerTableTbody = document.createElement('TBODY');
  headerTable.appendChild(headerTableTbody);
  headerTR = document.createElement('TR');
  headerTR.style.margin = "0px";
  headerTR.style.padding = "0px";
  
  headerTableTbody.appendChild(headerTR);
  
  headerTD = document.createElement('TD');
  headerTD.style.margin = "0px";
  headerTD.style.padding = "0px";
  headerTD.style.width = "100%";
  
  headerTR.appendChild(headerTD);
  
  headerTD.appendChild(headerDiv);
  
  minusButton = document.createElement('DIV');
  minusButton.id = 'greasemonkey-zooniverse-rainfall-rescue-form-minus_button';
  minusButton.style.backgroundColor = "red";
  minusButton.style.width = "30px";
  minusButton.style.height = "30px";
  minusButton.title = "Decrease height of input form rows";
  
  headerTD = document.createElement('TD');
  headerTD.style.margin = "0px";
  headerTD.style.padding = "0px";
  
  headerTR.appendChild(headerTD);
  
  headerTD.appendChild(minusButton);
  buttonContents = document.createTextNode('-');
  minusButton.appendChild(buttonContents);
  
  pixelsDisplay = document.createElement('DIV');
  pixelsDisplay.id = 'greasemonkey-zooniverse-rainfall-rescue-form-pixels_display';
  
  headerTD = document.createElement('TD');
  headerTD.style.margin = "0px";
  headerTD.style.padding = "0px";
  
  headerTR.appendChild(headerTD);
  
  headerTD.appendChild(pixelsDisplay);
  
  buttonContents = document.createTextNode(formRowHeight);
  pixelsDisplay.appendChild(buttonContents);
  pixelsDisplay.title = "Row has this height + 1px bottom border";
  
  plusButton = document.createElement('DIV');
  plusButton.id = 'greasemonkey-zooniverse-rainfall-rescue-form-plus_button';
  plusButton.style.backgroundColor = "green";
  plusButton.style.width = "30px";
  plusButton.style.height = "30px";
  plusButton.title = "Increase height of input form rows";
  
  headerTD = document.createElement('TD');
  headerTD.style.margin = "0px";
  headerTD.style.padding = "0px";
  
  headerTR.appendChild(headerTD);
  
  headerTD.appendChild(plusButton);
  
  buttonContents = document.createTextNode('+');
  plusButton.appendChild(buttonContents);
  
  
  formOverlayContainerDiv.style.margin = "0px";
  formOverlayContainerDiv.style.padding = "0px";
  
  formTable = document.createElement('TABLE');
  formOverlayContainerDiv.appendChild(formTable);
  formTableTbody = document.createElement('TBODY');
  formTable.appendChild(formTableTbody);
  formTable.id = 'greasemonkey-zooniverse-rainfall-rescue-form-form_table';
  
  yearFound = false;
  year = false;
  
  for (i = 0; i < workflowTaskElements.length; i++) {
    if (i == 0) {
      
      formSpacerRow = document.createElement('TR');
      formSpacerRow.style.height = formRowFirstRowOffsetTop;
      formTableTdI = document.createElement('TD');
      formTableTdL = document.createElement('TD');
      formSpacerRow.appendChild(formTableTdI);
      formSpacerRow.appendChild(formTableTdI);
      
      formTableTdI.style.height = formRowFirstRowOffsetTop;
      formTableTdL.style.height = formRowFirstRowOffsetTop;
      formTableTdI.style.margin = "0px";
      formTableTdI.style.padding = "0px";
      formTableTdL.style.margin = "0px";
      formTableTdL.style.padding = "0px";
      
      formTableTbody.appendChild(formSpacerRow);
    }
    if (i == 12) {
      formSpacerRow = document.createElement('TR');
      formSpacerRow.style.height = formRowTotalTop;
      formTableTdI = document.createElement('TD');
      formTableTdL = document.createElement('TD');
      formSpacerRow.appendChild(formTableTdI);
      formSpacerRow.appendChild(formTableTdL);
      
      formTableTdI.style.height = formRowTotalTop;
      formTableTdL.style.height = formRowTotalTop;
      formTableTdI.style.margin = "0px";
      formTableTdI.style.padding = "0px";
      formTableTdL.style.margin = "0px";
      formTableTdL.style.padding = "0px";
      
      formTableTbody.appendChild(formSpacerRow);
    }
    
    formRow = document.createElement('TR');
    
    formTableTbody.appendChild(formRow);
    
    formRow.style.height = formRowHeight;
    formRow.className = 'greasemonkey-zooniverse-rainfall-rescue-form-form_table_row';
    
    formInput = workflowTaskElements[i].getElementsByTagName('label')[0];
    formLabelDiv = false;
    
    workflowTaskElementDivs = workflowTaskElements[i].getElementsByTagName('div');
    for (j = 0; j < workflowTaskElementDivs.length; j++) {
      if ((' ' + workflowTaskElementDivs[j].className + ' ').indexOf(' markdown ') > -1) {
        if ((' ' + workflowTaskElementDivs[j].className + ' ').indexOf(' question ') > -1) {
        formLabelDiv =workflowTaskElementDivs[j];
        break;
        }
      }
    }
    
    if (formLabelDiv.getElementsByTagName('p').length > 1) {
      k = formLabelDiv.getElementsByTagName('p').length;
      k--;
      formLabel = formLabelDiv.getElementsByTagName('p')[k];
    } else {
      formLabel = formLabelDiv.getElementsByTagName('p')[0];
    }
    
    if (!yearFound) {
      formLabelStrong = formLabel.getElementsByTagName('strong')[0];
      year = formLabelStrong.innerHTML.split(' ');
      for (j = 0; j < year.length; j++) {
        yearNumber = parseInt(year[j]);
        if (yearNumber>1000 && yearNumber<2021) {
          yearFound = true;
          break;
        }
      }
    }
    
    formLabel.style.margin = "0px";
    
    formInput.getElementsByTagName('textarea')[0].style.padding = "0px";
    
    formTableTdI = document.createElement('TD');
    
    formTableTdI.appendChild(formInput);
    
    formRow.appendChild(formTableTdI);
    
    formLabelBox = document.createElement('DIV');
    formLabelBox.appendChild(formLabel);
    
    formTableTdL = document.createElement('TD');
    
    formTableTdL.appendChild(formLabelBox);
    
    formRow.appendChild(formTableTdL);
    
//     formTableTdL.style.height = formRowHeight;
//     formTableTdI.style.height = formRowHeight;
    formTableTdI.style.margin = "0px";
    formTableTdI.style.padding = "0px";
    formTableTdL.style.margin = "0px";
    formTableTdL.style.padding = "0px";
    
    formTableTdL.style.borderBottom = "1px solid";
    formTableTdI.style.borderBottom = "1px solid";
    formTableTdL.style.borderBottomColor = "#000000";
    formTableTdI.style.borderBottomColor = "#000000";
  }
  
  
  if (yearFound) {
    // take last digit from year
    yearText = year.toString();
    lastDigit = yearText[yearText.length -1];
    
    lastDigitNumber = parseInt(lastDigit);
    
    newFormPositionLeft = formPositionLeftByYear[lastDigitNumber];
    formOverlayContainerDiv.style.left = newFormPositionLeft;
//     alert('yearFound:'+yearText+' lastDigit:'+lastDigit+' lastDigitNumber:'+lastDigitNumber+' newFormPositionLeft:'+newFormPositionLeft);
  }
  
  
  // insert js in element parentDiv
  
  headerElement = parentDiv.getElementsByTagName('header')[0];
  
  ScriptTag = document.createElement('SCRIPT');
  ScriptTag.type = "text/javascript";
  
  ScriptTagContents = document.createTextNode(scriptValue);
  ScriptTag.appendChild(ScriptTagContents); 
  
  parentDiv.insertBefore(ScriptTag, headerElement);
  
  scriptAddedDiv = document.createElement('DIV');
  scriptAddedDiv.id = scriptAddedDivId;
  
  parentDiv.insertBefore(scriptAddedDiv, headerElement);
  
  // ZooniverseRainfallRescueFormAlignDecreaseSize should be referenced only after script from scriptValue is injected in page
  minusButton.onclick = function(){ ZooniverseRainfallRescueFormAlignDecreaseSize(); };
  
  // ZooniverseRainfallRescueFormAlignIncreaseSize should be referenced only after script from scriptValue is injected in page
  plusButton.onclick = function(){ ZooniverseRainfallRescueFormAlignIncreaseSize(); };
  
  // control checksum
  
  formRow = document.createElement('TR');
  
  formTableTbody.appendChild(formRow);
  formTableTdCalculated = document.createElement('TD');
  formTableTdCalculated.title = "Total calculated";
  formRow.appendChild(formTableTdCalculated);
  formRow.className = "greasemonkey-zooniverse-rainfall-rescue-form-control_checksum";
  formTableTdCalculatedPlaceholder = document.createElement('SPAN');
  formTableTdCalculatedPlaceholder.innerHTML = '&nbsp;';
  formTableTdCalculated.appendChild(formTableTdCalculatedPlaceholder);
  
  formTableTdIsDiffer = document.createElement('TD');
  formRow.appendChild(formTableTdIsDiffer);
  formTableTdIsDiffer.title = "Difference: total calculated - total inscribed";
  
  formTableRows = formTable.getElementsByTagName('tr');
  for (i = 0; i < formTableRows.length; i++) {
    if ((' ' + formTableRows[i].className + ' ').indexOf(' greasemonkey-zooniverse-rainfall-rescue-form-form_table_row ') > -1) {
      inputTextarea = formTableRows[i].getElementsByTagName('textarea')[0];
      if (inputTextarea.addEventListener) {
        inputTextarea.addEventListener("input", ZooniverseRainfallRescueFormAlignChecksum);
      } else if (inputTextarea.attachEvent) {
        inputTextarea.attachEvent("oninput", ZooniverseRainfallRescueFormAlignChecksum);
      }
    }
  }
  
  // move buttons ("done")
  
  for (i = 0; i < taskContainerParentButtons.length; i++) {
    innerSpan = taskContainerParentButtons[i].getElementsByTagName('span')[0];
    if (innerSpan.innerHTML.trim().toLowerCase() == 'done') {
      if (taskContainerParentButtons[i].addEventListener) {
        taskContainerParentButtons[i].addEventListener("click", ZooniverseRainfallRescueFormAlignReloadFormWaiter);
      } else if (taskContainerParentButtons[i].attachEvent) {
        taskContainerParentButtons[i].attachEvent("onclick", ZooniverseRainfallRescueFormAlignReloadFormWaiter);
      }
      break;
    }
  }
  
  classifierLargeImageDivNavs = classifierLargeImageDiv.getElementsByTagName('nav');
  for (i = 0; i < classifierLargeImageDivNavs.length; i++) {
    if ((' ' + classifierLargeImageDivNavs[i].className + ' ').indexOf(' task-nav ') > -1) {
      formRow = document.createElement('TR');
      
      formTableTbody.appendChild(formRow);
      formTableTd = document.createElement('TD');
      formRow.appendChild(formTableTd);
      formTableTd.colspan = "2";
      formRow.className = "greasemonkey-zooniverse-rainfall-rescue-form-task_nav";
      
      formTableTd.appendChild(classifierLargeImageDivNavs[i]);
      break;
    }
  }
  
  
  
}, 300, setIntervalIdBox, scriptValue);

setIntervalIdBox.push(setIntervalId);


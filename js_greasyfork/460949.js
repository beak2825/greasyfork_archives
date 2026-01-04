// ==UserScript==
// @name         Genesis What If?
// @namespace    http://tampermonkey.net/
// @version      1.35
// @description  What if you got a 45/50 on that next test? What would your grade be? This extension answers those questions without you having to manually calculate the answer. All grades are editable, and the buttons are self-explanatory. (New Jersey)
// @author       You
// @license      MIT
// @match        https://parents.c3.genesisedu.net/*/parents?tab1=studentdata&tab2=gradebook&tab3=coursesummary*
// @icon         https://parents.robbinsville.k12.nj.us//genesis/images/newIcon2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460949/Genesis%20What%20If.user.js
// @updateURL https://update.greasyfork.org/scripts/460949/Genesis%20What%20If.meta.js
// ==/UserScript==

(function() {
const fractionPattern = /(\d+(\.\d+)?) \/ (\d+)/;
var numerator = 0;
var denominator = 0;
// const headings = document.querySelectorAll(".listheading")
let specialnumber = -2

var listHeadings = document.querySelectorAll('.listheading');
var listRowEvens = document.querySelectorAll('.listroweven');
var listRowOdds = document.querySelectorAll('.listrowodd');
function HowManyCategories() {
    var secondListHeading = listHeadings[1];
    var thirdListHeading = listHeadings[2];
    var elementsBetweenHeadings = 0;

    // Iterate through the elements between the second and third list headings
    for (let i = 0; i < listRowEvens.length; i++) {
      let element = listRowEvens[i];

      if (element.compareDocumentPosition(secondListHeading) & Node.DOCUMENT_POSITION_PRECEDING &&
          element.compareDocumentPosition(thirdListHeading) & Node.DOCUMENT_POSITION_FOLLOWING) {
        elementsBetweenHeadings++;
      }
    }

    for (let i = 0; i < listRowOdds.length; i++) {
      let element = listRowOdds[i];

      if (element.compareDocumentPosition(secondListHeading) & Node.DOCUMENT_POSITION_PRECEDING &&
          element.compareDocumentPosition(thirdListHeading) & Node.DOCUMENT_POSITION_FOLLOWING) {
        elementsBetweenHeadings++;
      }
    }

    return elementsBetweenHeadings;
  }
var categoryWeightage = {}
var categoryGrades = {}
function AssignWeightage(row){
    let categoryName = row.querySelector('td.cellLeft b').textContent;
  let weightString = row.querySelector('td.cellRight:nth-child(2)').textContent;
  let weight = parseFloat(weightString.replace('%', '')) / 100; // Convert to decimal
    categoryGrades[categoryName] = [0,0]
      categoryWeightage[categoryName] = weight;
    //console.log(categoryGrades)
}
if (listHeadings.length >= 3) {
    var weightage = true;
    var numCategories = HowManyCategories()
    specialnumber -= numCategories
    //console.log(numCategories)
    let rows = document.querySelectorAll('.listroweven, .listrowodd');
    let filteredRows = Array.from(rows).slice(0, -2)
    let catArray = Array.from(filteredRows).slice(filteredRows.length - numCategories, filteredRows.length)
    catArray.forEach(row => AssignWeightage(row))
    //console.log(categoryWeightage)

}

function IdentifyGrade(){
    newGrade.textContent = " "
    newGrade.textContent = "|| " + percentage + "% " + percentageToLetterGrade(percentage)
    originalGrade.insertAdjacentElement('afterend', newGrade)
}


function EditableGrade(row){
    let cells = row.querySelectorAll('.cellLeft')
    let cell = cells[1]

    if(weightage){
        var categoryName2 = cells[0].querySelectorAll('div')[2].textContent.trim()
        //console.log(categoryName)
        var cellLeft = cells[0];

        var existingDiv = cellLeft.querySelector('div[style="font-size: 8pt;font-style: italic;"]');

        // Create a select element
        var selectElement = document.createElement('select');

        // Populate the select element with options from the dictionary
        for (var category in categoryWeightage) {
            var optionElement = document.createElement('option');
            optionElement.value = category;
            optionElement.text = category;
            if (category === existingDiv.textContent.trim()) {
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        }

        // Add an event listener to the select element
        selectElement.addEventListener('change', function() {
            var selectedCategory = selectElement.options[selectElement.selectedIndex].text;
            var selectedValue = categoryWeightage[selectedCategory];

            // You can do something with the selected value if needed

            // Update the content of the element based on the selected category
            cellLeft.querySelector('input[type="hidden"]').value = selectedCategory;


        });

        // Replace the existing div with the select element
        existingDiv.replaceWith(selectElement);
    }

    let childNodes = cell.childNodes;

    var divElements = cell.getElementsByTagName('div');
    var secondToLastDiv = divElements[divElements.length - 2];
    if (secondToLastDiv !== undefined) {
        var spanElement = secondToLastDiv.querySelector('span');
    }
    if (spanElement && (spanElement.textContent.trim() === 'Absent' || spanElement.textContent.trim() === 'Missing')) {
    return;
    }


    let innerGrade = "";
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === Node.TEXT_NODE && childNodes[i].textContent.indexOf('/') !== -1) { //current issue tha
            innerGrade += childNodes[i].textContent;
            childNodes[i].textContent = " ";
            let spanElement = document.createElement('span');
            spanElement.textContent = innerGrade;
            spanElement.setAttribute('contentEditable', true)
            cell.replaceChild(spanElement, childNodes[i])
            break;
        }
    }
    innerGrade = innerGrade.trim().replace(/\s+/g, " ")
    const [num, denom] = innerGrade.split('/').map(num => parseFloat(num.trim()));
    if(!weightage){
        numerator += num;
        denominator += denom;
    } else{
        categoryGrades[categoryName2][0] += num
        categoryGrades[categoryName2][1] += denom
    }
    //console.log(innerGrade, num, denom)
}


function SelectGrade(row){
    let cells = row.querySelectorAll('.cellLeft')
    let cell = cells[1]

    if(weightage){
        //var categoryName2 = cells[0].querySelectorAll('div')[2].textContent.trim()
        var selectElement = row.querySelector('.cellLeft select');
        var categoryName2 = selectElement.value;
        //console.log(categoryName2);
    }

    var divElements = cell.getElementsByTagName('div');
    var secondToLastDiv = divElements[divElements.length - 2];
    if (secondToLastDiv !== undefined) {
        var spanElement = secondToLastDiv.querySelector('span');
    }
    if (spanElement && (spanElement.textContent.trim() === 'Absent' || spanElement.textContent.trim() === 'Missing')) {
    return;
    }
    //let cell = row.querySelectorAll('.cellLeft')[1]
    const spanElements = cell.querySelectorAll('span')
      let innerGrade = cell.querySelectorAll('span')[spanElements.length - 1].textContent.trim().replace(/\s+/g, " ")
    const [num, denom] = innerGrade.split('/').map(num => parseFloat(num.trim()));
    var percen = 0;
    if(denom != 0){
      percen = ((num / denom) * 100).toFixed(2);
    } else{
      percen = "NaN"
    }

    // Select the bottom div element
    const bottomDivElement = cell.querySelector('div[style="font-weight: bold;"]');

    // Set the percentage as its content
    //console.log(percen)
    if(percen != "NaN"){
    bottomDivElement.textContent = percen + '%';
    }
    if(!weightage){
        numerator += num;
        denominator += denom;
    }else{
        categoryGrades[categoryName2][0] += num
        categoryGrades[categoryName2][1] += denom
    }
    //console.log(innerGrade, num, denom)

}

function SelectAssignments(){
    let rows = document.querySelectorAll('.listroweven, .listrowodd')
    let rowArray = Array.from(rows).slice(0, specialnumber)
    //console.log(rowArray)
    rowArray.forEach(row => EditableGrade(row))
}

function Refresh(){
    numerator = 0;
    denominator = 0;
    for (let category in categoryGrades) {
    if (categoryGrades.hasOwnProperty(category)) {
        categoryGrades[category] = categoryGrades[category].map(value => 0); // Set all values to zero
        }
    }
    let rows = document.querySelectorAll('.listroweven, .listrowodd');
    let filteredRows = Array.from(rows).slice(0, -2)
    let catArray = Array.from(filteredRows).slice(filteredRows.length - numCategories, filteredRows.length)


    let rowArray = Array.from(rows).slice(0, specialnumber)
    //console.log(rowArray)
    rowArray.forEach(row => SelectGrade(row))
    let percentage = 0.000
    if(!weightage){
        percentage = ((numerator/denominator) * 100 )
    } else {
        for (const category in categoryGrades) {
        const categoryPercentage = (categoryGrades[category][0] / categoryGrades[category][1]) * 100;
        percentage += categoryPercentage * categoryWeightage[category];
        }
        catArray.forEach(row => changeCategoryPercentage(row))
    }

    percentage = percentage.toFixed(2)
    newGrade.textContent = "|| " + percentage + "% " + percentageToLetterGrade(percentage)
    console.log(categoryGrades)



}

function changeCategoryPercentage(row){
    let categoryName = row.querySelector('td.cellLeft b').textContent;
    let weightString = row.querySelector('td.cellRight:nth-child(3)').textContent;
    let category = row.querySelector('td.cellLeft').textContent
    let categoryPercentage = (categoryGrades[category][0] / categoryGrades[category][1]) * 100;
    row.querySelector('td.cellRight:nth-child(3)').textContent = categoryPercentage.toFixed(1) + " %";
}

function addRow(){ //CHANGE THIS SO IT DOES NOT RELY ON CLONING, SO IT WORKS WITH JUST ONE ROW
    let row = document.querySelectorAll('.listroweven, .listrowodd')
    let rowArray = Array.from(row).slice(0, specialnumber)
    //const numberOfRows = rowArray.length

    let lastRow = rowArray[rowArray.length - 1];
    let secondToLastRow = rowArray[rowArray.length - 2];

    let clonedRow = secondToLastRow.cloneNode(true);
    clonedRow.querySelector('b').textContent = "Genesis What If"
    clonedRow.querySelector('b').style.color = "Green"

    clonedRow.querySelectorAll('div')[5].textContent = 'N/A'
    clonedRow.querySelectorAll('div')[5].setAttribute('contentEditable', 'true')

    lastRow.parentNode.insertBefore(clonedRow, lastRow.nextSibling);
}


function percentageToLetterGrade(numberGrade){
        let letter;
      if (numberGrade >= 96.5) {
        letter = 'A+';
      } else if (numberGrade >= 92.5) {
        letter = 'A';
        return letter;
      } else if (numberGrade >= 89.5) {
        letter = 'A-';
      } else if (numberGrade >= 86.5) {
        letter = 'B+';
      } else if (numberGrade >= 82.5) {
        letter = 'B';
      } else if (numberGrade >= 79.5) {
        letter = 'B-';
      } else if (numberGrade >= 76.5) {
        letter = 'C+';
      } else if (numberGrade >= 72.5) {
        letter = 'C';
      } else if (numberGrade >= 69.5) {
        letter = 'C-';
      } else if (numberGrade >= 66.5) {
        letter = 'D+';
      } else if (numberGrade >= 59.5) {
        letter = 'D-';
      } else {
        letter = 'F';
      }
      return letter;
    };

function AddButtons(){
    const headerT = document.querySelectorAll('.listheading')[0];
    const parentDiv = headerT//.parentNode
    let refreshButton = document.createElement("button")
    refreshButton.id="refreshButton"
    refreshButton.innerHTML = "Refresh"
    refreshButton.onclick = () => Refresh();
    refreshButton.title = "The keyboard shortcut for refreshButton is shift + R";

    let addRowButton = document.createElement("button")
    addRowButton.innerHTML = "Add Row"
    addRowButton.onclick = () => addRow();
    addRowButton.title = "The keyboard shortcut for addRowButton is shift + T";

    parentDiv.insertAdjacentElement('beforebegin', refreshButton)
    parentDiv.insertAdjacentElement('beforebegin', addRowButton)
}



SelectAssignments();

let originalGrade = document.querySelectorAll('b')[0]
    //console.log(originalGrade.textContent.trim().replace(/\s+/g, ' '))
let percentage = 0.000
if(!weightage){
    percentage = ((numerator/denominator) * 100 )
} else {
    for (const category in categoryGrades) {
    const categoryPercentage = (categoryGrades[category][0] / categoryGrades[category][1]) * 100;
    percentage += categoryPercentage * categoryWeightage[category];
    }
}
percentage = percentage.toFixed(2)
let newGrade = document.createElement('b')
IdentifyGrade();
AddButtons();

// console.log(categoryGrades)

    function doc_keyUp(e) {

    // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
    if (e.shiftKey && e.key === 'R') {
        // call your function to do the thing
        Refresh();
    }
}
    function doc_keyUp2(e) {

    if (e.shiftKey && e.key === 'R') {

        Refresh();
    }

    if (e.shiftKey && e.key === 'T') {

        addRow();
    }
}

// Add event listeners for keyup event
document.addEventListener('keyup', doc_keyUp2, false);

// register the handler
document.addEventListener('keyup', doc_keyUp, false);



})();
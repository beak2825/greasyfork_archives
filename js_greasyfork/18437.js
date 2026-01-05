// ==UserScript==
// @name        LibraryThing better "Combine Works" button
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Improvements to the "Combine works" button on combination pages
// @include     http*://*librarything.tld/combine.php?*
// @include     http*://*librarything.com/combine.php?*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18437/LibraryThing%20better%20%22Combine%20Works%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/18437/LibraryThing%20better%20%22Combine%20Works%22%20button.meta.js
// ==/UserScript==

// Some variables reused in multiple places
var body = document.getElementsByTagName("body")[0];
var combineForm = document.getElementsByName("works")[0];
var noneSelected = "<li style='padding-left: 10px;'><i>No items currently selected</i></li>";

// Set some styling for various new features
var head = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
style.type = "text/css";
style.textContent = '\
    .gm-frozen{ color: #888 !important; background-color: #f9f9f9 !important; transition: background-color 1s, color 1s; } \
    .gm-frozen a, .alwaysblue .gm-frozen a { color: #888 !important; transition: color 1s; }\
    #gm-new-buttons { position: fixed; right: 0; bottom: 0; margin: 0; width: 430px; padding: 10px 15px; background-color: #f7f7f7; border: solid #999; border-width: 1px 0 0 1px; border-radius: 3px; box-shadow: 0 0 10px #ddd; }\
    #gm-selected-list { padding-left: 0; list-style-type: none; }\
    #gm-selected-list li.gm-item{ max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; border: dotted #E7EE82; padding: 0 5px; border-width: 2px; margin-top: -2px; background-color: #F8FF93; }\
    #gm-dim { position: fixed; top: 0; left: 0; z-index: 1999; opacity: .8; width: 100%; height: 100%; background-color: #999; display: none; }\
    #gm-confirmation { border: 1px solid #999; background-color: white; box-shadow: 0 0 15px 0px #777; position: fixed; z-index: 2000; left: 50%; transition: top .4s; overflow: auto; }\
    #gm-confirmation-contents { margin: 20px; }\
    #gm-close-x { float: right; cursor: pointer; font-size: 1.3em; margin: 10px 15px 0 0; }\
    form #gm-spinner { position: absolute; margin-left: 5px; }\
    ';
head.appendChild(style);

// Clone the element containing the existing buttons
var newButtons = combineForm.children[3].cloneNode(true); 
newButtons.id = "gm-new-buttons";

// Make some adjustments to the new "Combine" button
var newCombine = newButtons.children[0];
newCombine.removeAttribute("onclick");
newCombine.type = "button"; // without this, it was submitting the form anyway even if howmanychecked returned < 2
newCombine.addEventListener("click", loadConfirmation, false);

// Change "Reset" to "Clear selected", since I thought it seemed clearer (also, it's not a true reset, since it won't unfreeze "frozen" works)
newButtons.children[1].value = "Clear selected";

// Have a dedicated (if redundant) button to refresh page, since it's not totally intuitive how to see updates on "frozen" works  
newRefresh = document.createElement("input");
newRefresh.name = "refresh";
newRefresh.type = "button";
newRefresh.value = "Get updates (refresh page)";
newRefresh.addEventListener("click",specialRefresh,false);
newButtons.appendChild(newRefresh);

// "Special" so that works get unselected (since they might not be quite the same post-combination), 
// but it's a "soft" refresh so you're not thrown all the way back up to the top again, losing your place, or at least in some browsers
function specialRefresh(){
  enableInputs();
  document.getElementsByName("reset")[0].click(); // not using .reset() on form because there's a conflict with the existing button's name
  // without the timeout, it wasn't always completing the above lines
  setTimeout( function() { window.location.reload(false) }, 100); // false to make it a soft refresh
}

// Make a list and header for the currently selected items
var selectedList = document.createElement("ul");
selectedList.id = "gm-selected-list";
selectedList.innerHTML = noneSelected;
newButtons.insertBefore(selectedList,newButtons.firstChild);
var selectedHeader = document.createElement("b");
selectedHeader.textContent = "Selected works ";
newButtons.insertBefore(selectedHeader, selectedList);
  
// Have a running count of how many works are currently selected
var currentCount = document.createElement('span');
currentCount.textContent = "(0)";
newButtons.insertBefore(currentCount, selectedList);  
 
// Append the new buttons and list to the page (as descendant of form)
combineForm.appendChild(newButtons);

// Helper function to reenable the inputs that change their disabled status at certain points
var allinputs = document.getElementsByTagName("input");
function enableInputs() {
  for (var i=0; i<allinputs.length; i++) {
    allinputs[i].disabled = false;
  }
}

// This function that populates the list when works are selected
function showSelected() {
  // Make a count/total
  var currentlySelected = document.querySelectorAll('.combinetable input[type="checkbox"]:checked');
  var currentLength = currentlySelected.length;
  var currentHTML = currentLength == 0 ? "(0)" : "<b>(" + currentLength + ")</b>";
  currentCount.innerHTML = currentHTML;
  // Add the names of the currently selected works to the list
  var worksTitles = "";
  for (var i=0; i<currentLength; i++) {
    var title = currentlySelected[i].parentElement.nextSibling.childNodes[0].childNodes[1].nodeValue;
    var title = title.replace(/'/g,"&#39;"); // escape single quotes so title attr doesn't get truncated
    worksTitles += "<li class='gm-item' title='" + title + "'>" + title + "</li>";
  }
  selectedList.innerHTML = currentLength == 0 ? noneSelected : worksTitles;
}
  
// Run this initially even on page load, since sometimes works are still selected or disabled after a soft reload
showSelected();
enableInputs();
  
// Make the reset/clear buttons empty the new selected list display (without unfreezing any frozen works)
var resets = document.querySelectorAll("input[type='reset']");
for (var i=0; i<resets.length; i++) {
  resets[i].removeAttribute("onclick");
  resets[i].addEventListener("click", function() {
    // Alteration of resetcb() on page, to prevent unfreezing any currently frozen works on a form reset
    for (var j=1; j<numberofrows+1; j++) { // numberofrows is set in the existing html page
      var currentRow = document.getElementById("r"+j);
      if (currentRow.className != 'gm-frozen') currentRow.className = 'c_n';
    }
    currentCount.textContent = "(0)";
    selectedList.innerHTML = noneSelected;
  });
}
  
// Make clicking any of the works' checkboxes populate the list in the fixed box
workBoxes = document.getElementsByClassName("combinetable")[0].getElementsByTagName("tr");
for (k=0; k<workBoxes.length; k++) {
  workBoxes[k].addEventListener("click", showSelected);
}

// Create a pop-up like div that will get populated with the confirmation form
var confirmation = document.createElement("div");
confirmation.id = "gm-confirmation";
// with an "x" to close, same as cancel, but perhaps more intuitive sometimes
var closeX = document.createElement("span");
closeX.title = "close";
closeX.textContent = "×";
closeX.id = "gm-close-x";
confirmation.appendChild(closeX);
closeX.addEventListener("click", hideConfirmation);
// and with a child div for the sake of some small implementation details
var confirmationContents = document.createElement("div");
confirmationContents.id = "gm-confirmation-contents";
confirmation.appendChild(confirmationContents);
body.appendChild(confirmation);

// Stuff to handle the sizing and modal qualities of the confirmation pop-up div
var dim = document.createElement("div");
dim.id = "gm-dim";
body.appendChild(dim);
var hideDistance = "-1000px";
function confirmationSize() {
  // expand it to most of the window so that it's the only focus at the moment
  var width = window.innerWidth - 200;
  var height = window.innerHeight - 150;
  confirmation.style.width = width + "px";
  confirmation.style.marginLeft = "-" + (width / 2) + "px";
  confirmation.style.height = height + "px";
  hideDistance = "-" + (height + 50) + "px";
  if (confirmation.style.top != "75px") {
    confirmation.style.top = hideDistance;
  }
}
confirmationSize();
window.addEventListener("resize", confirmationSize, false);

// Helper function for adding a spinner image to give you the reassuring illusion that things are processing
function addSpinner(appendToMe) {
  var spinner = document.createElement("img");
  spinner.id = "gm-spinner";
  spinner.src = "/pics/blog/spinner_mediumblack.gif";
  appendToMe.appendChild(spinner);
}

// Pull down the div, stuff it with the contents of the confirmation page you'd get it you had just clicked old-style "Confirm"
function loadConfirmation() {
  if (howmanychecked()) { // Make sure there are more than 2 checked
    dim.style.display = "block";
    addSpinner(confirmationContents);
    confirmation.style.top = '75px';
    // Though I originally added the timeout to avoid, a bug, I thought the delay also helped with not making things _too_ fast 
    // (like after a while I could start to just click through without paying enough attention)
    setTimeout(function(){ 
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'work_combineworks.php', true); // go get the confirmation page's HTML
      xhr.onload = function () {
        // Stuff the confirmation page's HTML into the innerHTML of a new document
        // I tried a few other ways to convert the HTML into reusable DOM, but none were working out for me
        var newDoc = document.implementation.createHTMLDocument();
        newDoc.documentElement.innerHTML = this.responseText;
        // Pull in the styling info from the <head> of the confirmation page's HTML.
        // Prepend an ID ancestor to its selectors to prevent conflicts with that styling vs. the current page's styling
        // Append this modified CSS to current page (unless that's already been done before)
        if (!document.contains(document.getElementById("gm-localized-style"))) {
          var externalStyles = newDoc.getElementsByTagName("style")[0].sheet.cssRules; // newDoc.styleSheets[0] is undefined in Chrome
          var localizedRules = [], prefixedRule;
          for (var i=0; i<externalStyles.length; i++) {
            prefixedRule = "#gm-confirmation " + externalStyles[i].cssText;
            localizedRules.push(prefixedRule);
          }
          var localizedStyle = document.createElement("style");
          localizedStyle.id = "gm-localized-style";
          localizedStyle.textContent = localizedRules.join(" ");
          head.appendChild(localizedStyle);
        }
        // Remove the spinner image
        confirmationContents.removeChild(confirmationContents.firstChild); 
        // Inject the body of the confirmation page's HTML, minus header and footer, into the pop-up div
        var confirmCode = newDoc.getElementsByClassName("content")[0];
        confirmationContents.appendChild(confirmCode);

        // Don't submit as normal, else you'd get redirected
        var confirmButton = confirmation.getElementsByTagName("input")[0];
        confirmButton.type = "button";
        confirmButton.removeAttribute("onclick");
        confirmButton.addEventListener("click", submitConfirmation);

        // Change cancel button to hide the pop-up div instead of going back one page
        var cancelButton = confirmation.getElementsByTagName("input")[1];
        cancelButton.removeAttribute("onclick");
        cancelButton.addEventListener("click", hideConfirmation);

      };
      xhr.send(new FormData(combineForm)); // send the appropriate input through with the POST
    }, 1500); 
  }
}
  
// Submit the form in the background, and make the relevant works "frozen" to prevent possibility of "recombining" them, 
// or combining using a work number that's now redirected (not sure what would happen in that case, but I'd rather not even try)
function submitConfirmation() {
  var confirmForm = document.getElementsByName("confirm")[0];
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'work_combineworks_submit.php', true); // submit the confirmation to LT
  xhr.onloadstart = function () {
    // disable the buttons after "Combine" has been clicked, to prevent multiple submissions, and since post-sumbission Cancel doesn't accomplish anything
    confirmInputs = confirmForm.getElementsByTagName("input");
    for (var i=0; i<2; i++) { // Just disable the first two inputs (Confirm and Cancel buttons), not the hidden ones
      confirmInputs[i].disabled = true;
    }
    addSpinner(confirmForm.firstElementChild);
    // Originally was going to do the rest in onload or onloadend, but since that will wait for the responseText 
    // which might be take a while for a popular author with lots of works, just create the illusion with a timeout
    setTimeout(function(){
      // freeze the combined works
      var currentlySelected = document.querySelectorAll(".lit"); // querySelectorAll instead of getelementsbyclass becuase else it breaks after first iteration of resetting the classes
      for (var j=0; j<currentlySelected.length; j++) {
        var currentWork = currentlySelected[j];
        var currentCheckbox = currentWork.getElementsByTagName("input")[0];
        currentCheckbox.checked = false;
        currentCheckbox.disabled = true;
        currentWork.getElementsByTagName("td")[1].removeAttribute("onclick");
        currentWork.className = 'gm-frozen';
      }
      // reset the "currently selected" list:
      currentCount.textContent = "(0)";
      selectedList.innerHTML = noneSelected;
      // slide the box bax up (amongst other things):
      hideConfirmation();
    }, 1500);
  }
  xhr.send(new FormData(confirmForm)); // send the appropriate input through with the POST
}

// Reset the confirmation box's HTML, send it back up offscreen
function hideConfirmation() {
  // Empty the contents (to avoid accidental clicks if :focus is somehow there, and so it's fresh each time it comes down)
  while (confirmationContents.firstChild) { // apparently more performant than setting innerHTML = ""
    confirmationContents.removeChild(confirmationContents.lastChild);
  }
  confirmation.style.top = hideDistance;
  dim.style.display = "none";
}

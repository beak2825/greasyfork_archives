// ==UserScript==
// @name         MAM Tidy Bit-bucket
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      0.040
// @description  Order images into related sets, and hide unneeded images. 6/22/22
// @author       yyyzzz999
// @match        https://www.myanonamouse.net/bitbucket-upload.php
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/MTB.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/446874/MAM%20Tidy%20Bit-bucket.user.js
// @updateURL https://update.greasyfork.org/scripts/446874/MAM%20Tidy%20Bit-bucket.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
//Delete image and save in set (usually for Trash)

let DEBUG =1; // Debugging mode on (1) or off (0)
if (DEBUG) console.log("Welcome to MAM Tidy Bit-bucket v0.1!");
let DELETING = 0; // Used when switching from ClickTo to anything else.
let REMOVEI = 0; // Used to only load listener once!!
let ActiveSet = 0 ; // Set selected in UI after Sets:
let LOADclicked = 0 ;
let INIT = 1;
var template, thref; // Used for turning filenames into loaded a/img elements
var els; //Images shown element

// SelectorsHub was used for finding most querySelector parameters https://selectorshub.com/
// It takes a lot of the work out of examining the DOM tags and CSS!

// Set up for custom Favicon
var ilinks = document.querySelectorAll("link[rel~='icon']"); // Get all favicon links as different browsers watch different ones.
favi("MTB"); //Simple black mice on/in blue bitbucket background

let imgblock = document.querySelector("div[id='mainBody'] div[class='blockBody']"); // Select just the block with user images
    if (DEBUG) console.log("imgblock.contentEditable: " + imgblock.contentEditable);
imgblock.contentEditable = 'true'; //Allow moving images around and deleting unwanted ones
//imgblock.designMode='on';
/* This is a variation of the commonly used code:
document.body.contentEditable = 'true'; document.designMode='on'
to edit a local copy of an entire page, but in this case we just edit the image div
example use in a bookmarklet that inspired this script:
https://udbadajoz.net/document-body-contenteditable-true-document-designmode-on-void-0/
*/

let files = imgblock.getElementsByTagName('a'); // get all the image links
let elb = document.querySelector("div[id='mainBody'] div[class='blockFoot']"); //Bottom border
createButton(elb,"Turn off Edit Mode",toggleEdit,"MTBEdit","PaleGreen");
let elte = document.querySelector("#MTBEdit");

createSpan(elb,"&nbsp; &nbsp;Total Images: " + files.length );

//    if (DEBUG) console.log("files[99]: " + files[99]);
let el = document.querySelector("div[id='mainBody'] h4"); //Your uploads row where we'll add control buttons
var sets = {}; //This object will hold all our sets
// check for stored lists...
let Trash = GM_getValue("Trash"); // We will not allow this to be deleted...
if ( Trash == undefined ) { // Initialize
    GM_setValue("Trash"," ");
    sets.Trash = " ";
} else {
    console.log("Trash: " + Trash);
    sets.Trash = Trash;
    if (DEBUG) console.log("sets['Trash']: " + sets['Trash']); //Confirms we're referencing a property and not an array element
    if (DEBUG) console.log("GM_listValues(): " + GM_listValues());
    var vals = new Array();
    vals = GM_listValues();
    for (let k = 0; k < vals.length; k++) {
     sets[vals[k]]=GM_getValue(vals[k]);
     if (DEBUG >1) console.log('k: ' + k + ' vals[k] : ' + vals[k] + " sets[vals[k]]: " + sets[vals[k]]);
    }
    /*
    for (var val in GM_listValues()){
      //  vals[val] = GM_getValue(val);
      sets[val]=GM_getValue(val);
      if (DEBUG) console.log('val: ' + val + ': ' + sets[val] + " vals: " + vals);
    } */
    // if (DEBUG) console.log('sets: ' + sets ); // Useless Output: sets: [object Object]
}

if (files.length <= 0){ //This button is for those who complain a UserScript isn't working when it really has nothing to do.
    createSpan(el,"&emsp;"); //insert a space span
    createButton(el, "No images to tidy up!", function(){
    alert('Nothing to do!');},"Khaki");  //tiny bit o' eye candy
} else {
if (DEBUG) console.log("files: " + files + "\n files.length: " + files.length + " files[0]: " + files[0]);
// Make our element template for loading files back here...


addTitles(); //Add filenames for mouseover hover text, and while looping through hide anything marked as trash
createSpan(elb,"&emsp; Images Shown: " + files.length , "MTBShown");
els = document.querySelector("#MTBShown");
INIT = 0; //Done removing trash


//if (DEBUG) console.log("vals: " + vals);
//    GM_setValue("set1","filename"); // Debug storage seed

// TODO Hide images already in special set Trash

// Pop in our controls and buttons up for the row that says "Your uploads"
// Eventually Save Set Name:[text] Delete Set, Show Set: button button...

//This is a bit messy for testing...

/*  var xx = document.createElement('td'); // /Too messy adding unrelated controls to upload UI!
el2.appendChild(xx);
    createSpan(xx,'<input type="button" id="MTB_Test2" value="Test2" style="background-color: dodgerblue;" >');
    createButton(el2, "Test", function(){
    alert('Button Function not available yet.');}, "MTB_Test"); */

createSpan(el,"&nbsp;"); //insert a space span
createButton(el, "Save set", saveSet, "MTB_Save");

//insert a text box
createSpan(el,'<input type="text" id="MTBsetName" size="6" value="">');
createButton(el, "New set", newSet, "MTB_New"); //  White dropped v0.032

/* Helpful radio button control examples referenced:
https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_input_type_radio
https://www.javatpoint.com/how-to-check-a-radio-button-using-javascript
*/
let htmls = `<input type="radio" id="MTBClickTo" name="c" value="c">ClickTo
<input type="radio" id="MTBLoad" name="c" value="c">Load
<input type="radio" id="MTBDel" name="c" value="d">Del`
createSpan(el,htmls); //insert controls
createSpan(el," | Sets:");
htmls="";
if (DEBUG) console.log('htmls: ' + htmls);
var val;
for (val in sets) {
      htmls += '<input type="radio" id="MTB_' + val + '" name="s">' + val ;
//    if (val != 0) {htmls += '<input type="radio" id="MTB_' + val + '" onclick="setASet(\'' + val + '\')" name="s" >' + val ;
    //document.getElementById('MTB_' + val).addEventListener('click', function (event,val){ ActiveSet = val; console.log('ActiveSet: ' + ActiveSet);});
        if (DEBUG) console.log('htmls: ' + htmls);
    }

createSpan(el,htmls); //insert sets and controls

for (val in sets) {
  if (val != 0) {
    if (DEBUG) console.log('id: MTB_' + val);
    document.getElementById('MTB_' + val).onclick = function() {setASet(event.target)}; //eslint claims val is unsafe references, but it works
  }
}

document.getElementById("MTBClickTo").addEventListener('click', ClickTo);
document.getElementById("MTBLoad").addEventListener('click', Load);
document.getElementById("MTBDel").addEventListener('click', Del);

// copy template for building our set list from files[0] done in addtitles

} // End of files.length >0 (else of <=0 )
//End of main body

//Define Functions

function Load(){
if (DELETING) DELETING = 0;
if (LOADclicked == 1) {
   document.getElementById('MTBLoad').checked = false; // Toggle Load if clicked twice
   LOADclicked = 0;
   if (DEBUG) console.log("Load unchecked. ");
   } else {
   LOADclicked = 1;
   if (DEBUG) console.log("Load checked. ");
//Remove current images before loading a set
for (let i = files.length-1; i >=0 ; i--) { // Start at bottom so we kill children before parents (So evil!)
     files[i].remove();
//           parent = files[i].parentNode;
//           parent.removeChild(files[i]);
} // i loop
// TODO get set values and display
var loadfiles = sets[ActiveSet].split("/");
if (DEBUG) console.log("loadfiles[0]: " + loadfiles[0]);
    if (loadfiles[0] != " ") {
    var file,ihtml;
        for (let j = 0; j < loadfiles.length; j++) {
        file = document.createElement("a");
        ihtml = template.replace(/#####\|#####/g,loadfiles[j] );
        ihtml = ihtml.replace(/#####-#####/g,decodeURIComponent(loadfiles[j]) );
        if (DEBUG) console.log("ihtml: " + ihtml);
        file.innerHTML = ihtml;
        file.href = thref + loadfiles[j];
        file.title = loadfiles[j];
        file.id = loadfiles[j]; //just for testing
        imgblock.appendChild(file);
        }
     document.getElementById('MTBLoad').checked = false;
     LOADclicked = 0;
        els.innerHTML = "&emsp; Images Shown: " + files.length;
    }
}
}

function Del(){
if (DEBUG) console.log("Del clicked");
if (DELETING) DELETING = 0;
if (ActiveSet == "Trash") {
    alert("Trash may not be deleted.  You can empty it by saving nothing over it");
    document.getElementById('MTBDel').checked = false; // uncheck when done
    return false;
    }
if (confirmalert("Are you sure you want to DELETE this set permanently?",0,"Your set is not deleted!")) {
    if (ActiveSet && ActiveSet != "Trash") {
       GM_deleteValue(ActiveSet); // remove set from storage
       let el=document.getElementById('MTB_' + ActiveSet);
       el.nextSibling.remove(); // Remove set name from UI
       el.remove(); // remove set radio button from UI
       document.getElementById('MTBDel').checked = false; // uncheck when done
    }
}
}

function ClickTo(){
if (DEBUG) console.log("ClickTo clicked");
if (DELETING == 1) {
   document.getElementById('MTBClickTo').checked = false; // Toggle ClickTo if clicked twice
   DELETING = 0;
} else {
   if (REMOVEI == 0) imgblock.addEventListener('click', () => RemoveImage(event.target));
   REMOVEI = DELETING = 1; // Flags to NOT RemoveImages, or load 2nd EventListener later!
}
}

function addFileName(cur,name ){
    if (DEBUG) console.log("Adding " + name + " current string: " + cur );
    if (cur == " " || !cur) {cur = name;
    } else { cur += "/" + name;
    }
    return cur;
}

function RemoveImage(el) { // Remove image from display, and add filename to storage.
if (DEBUG) console.log(el); // Log the clicked element in the console to see elements clicked
if (DEBUG && el.id) console.log("Element clicked with id= " + el.id);
if (DELETING) { //Avoids difficulty in removing the eventlistener that calls this alltogether
if (DEBUG) console.log("el.href: " + el.href);
let parent = el.parentNode; //The images are children of the anchor tags a
if (typeof parent.href == 'undefined' ) { //Failed if clickto clicked and unclicked
    console.log("Container clicked instead of image!  Ignored.");
    } else {
      if (DEBUG) console.log("File clicked: " + parent.href.split("/")[5]); //Test if this fails, the container was clicked instead of image
      if (ActiveSet) {
          let newlist = addFileName(sets[ActiveSet],parent.href.split("/")[5]);
          GM_setValue(ActiveSet,newlist);
          sets[ActiveSet] = newlist;
          if (DEBUG) console.log("Saving: " + ActiveSet + ": " + newlist );
      }
        el.remove();
        //parent.parentNode.removeChild(parent); //Delete element containing image!
        els.innerHTML = "&emsp; Images Shown: " + files.length; // Fails as we've modified the DOM, not our array of elements!
        els.innerHTML = "&emsp; "; // Temporary kludge!

    }
}
}
// DONE! append /filename to storage string unless first, and then update storage

// Confirm example from https://www.jquery-az.com/javascript/demo.php?ex=151.1_1
function confirmalert(prompt,yay,nay){
var userselection = confirm(prompt);
if (userselection == true){
    if (yay) alert(yay); // And when it is, do not allow deletion of Trash folder?
    return true;
}else{
    alert("Your set is not deleted!");
    return false;
    }
}

function createSpan(elemnt,txt,id) {
   var x = document.createElement('span');
   x.innerHTML = txt;
   if (id) x.id = id;
   elemnt.appendChild(x);
    return x;
}

// Similar to https://stackoverflow.com/questions/45056949/adding-button-to-specific-div
function createButton(elemnt, value, func, id, color) {
  var button = document.createElement("input");
  button.type = "button";
  if (id) button.id = id; //won't work for falsy ids like 0 or NaN
  button.value = value; //button label or in some cases set name
    color = color || "LightBlue";
  button.style.backgroundColor = color;
//  button.style.paddingLeft = "5px"; // Applies to text, not button

  button.style.borderRadius = "35%"; // No work bro!
  //button.style.webkit-border-radius = "8px"; // Makes button disapear!
  button.onclick = func;
  elemnt.appendChild(button);
}

/* We'll remove all links before loading a set
for (let i = files.length-1; i >=0 ; i--){ // works, starting at 0 deletes half of them
files[i].remove();
}
*/

function newSet() {
    let nn = document.querySelector("#MTBsetName").value
    console.log("New set name: " + nn );
    if ( sets[nn] == undefined ) { // Initialize
    GM_setValue(nn," ");
    sets[nn] = " ";
    } else {
    console.log("Set: " + nn + " already exists!");
    }
}

function saveSet() {
    var fn,sn;
    sn = document.querySelector("#MTBsetName").value
    console.log("Set name: " + sn );
    // TODO: Add warning if name already exists and confirm replace

/* let CurFiles = imgblock.getElementsByTagName('a'); // copy not needed, files is current
    console.log("CurFiles.length: " + CurFiles.length); */
   if (files.length > 0) {
      let string = files[0].title;
      for (let i = 1; i < files.length; i++) {
      fn = files[i].title;
      string = addFileName(string,fn);
      if (DEBUG > 1) console.log("i= "+ i +" files[i] name: " + fn);
      if (fn.match(/\%/)) console.log("decoded: " + decodeURIComponent(fn));
      }
    GM_setValue(sn,string);
    }
}

function addTitles() { //Loop through initial list of image elements and add titles for mouseover, set template, and remove trash
   var fn;
 //  const inTrash = [];
   var trashfiles = Trash.split("/");
    for (let i = files.length-1; i >=0 ; i--) { // Start at bottom so we kill children before parents (So evil!)
      var parent;
      fn = files[i].href.split("/")[5];
      let MATCH =0; // Does this i match one of the files in the trash list checked by j?
      for (let j = 0; j < trashfiles.length; j++) { //Hide images already in Trash
        if (DEBUG > 1) console.log('i, fn, trashfiles[j] : ' +i + ', '+ fn +', ' + trashfiles[j]);
        if (fn == trashfiles[j]) {
            if (DEBUG) console.log("Removing: " + fn);
           parent = files[i].parentNode;
           parent.removeChild(files[i]);
            //inTrash.push(i);
            //RemoveImage(files[i]);
            MATCH = 1;
        }
      } // j loop
      if (MATCH == 0 ) files[i].title = fn;
  } // i loop
    if (files[0] !=undefined) {
        template = files[0].innerHTML; // element 0 is last fn assignment as we looped down to 0
        thref = files[0].href.replace(fn,""); // Risky as match not anchored at end?
        template = template.replace(fn,"#####|#####");
        template = template.replace(decodeURIComponent(fn),"#####-#####");
        if (DEBUG) console.log("template, fn" + template + ", " + fn);
        }

if (DEBUG) console.log("files.length: " + files.length);
}

// Stores set name when radio button is clicked, clears it when unchecked
function setASet(el) {
    let string = el.nextSibling.nodeValue;
    if (DEBUG) console.log('setASet string: ' + string);
    if (string == ActiveSet) {
        document.getElementById('MTB_' + string).checked = false; // Toggle set if clicked twice
        ActiveSet = 0 ;
    } else {
    ActiveSet = string ;
    }
    if (DEBUG) console.log('ActiveSet: ' + ActiveSet);
}

function toggleEdit() {
    if (DEBUG>1) console.log('Edit Mode button clicked. imgblock.contentEditable = ' + imgblock.contentEditable);
    if (imgblock.isContentEditable) {
    imgblock.contentEditable = 'false';
    elte.style.backgroundColor = "White";
    elte.value = "Turn On Edit Mode";
    } else {
    imgblock.contentEditable = 'true';
    elte.style.backgroundColor = "PaleGreen";
    elte.value = "Turn Off Edit Mode";
    }
}

// Function to change the FAVICON to one matching a filename fn
function favi(fn,un) { // fn=filename, un=usernumber
    un = un || 164109; // if no user number is specified, use yyyzzz999's icons
    for (let i = 0; i < ilinks.length; i++) { // from MRP v1.97 Works in Chrome now.
        ilinks[i].href = 'https://cdn.myanonamouse.net/imagebucket/' + un + '/' + fn + '.png';
    }
}

/*TODO: Undo or Hide controls? Ctrl-Z already works when no function buttons are set
        Sort by area/size button?  Hard as different properties need to be checked for different sized images.
        Large ones would use .naturalHeight, small use height, medium ?
  https://stackoverflow.com/questions/27508086/how-to-sort-images-by-dimension
        Add warning if save set name already exists and confirm replace
        Report number of images in bitbucket and view area in bar below.

//Done! Add showing file names on mouse over addTitles(files);
        save/load template
        save new set function
*/
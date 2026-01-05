// ==UserScript==
// @name         EH Search Tracker
// @namespace    http://tampermonkey.net/
// @version      .50
// @description  Track your searches on e*hentai
// @author       320
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29816/EH%20Search%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/29816/EH%20Search%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

//Please note this code makes use of jQuery

//------------------------------ Add the "following" button at the top after the page loads, code copy pasted from stack overflow

     // Get the 4th arrow at the top, between Favorites and Home/Settings
    var topBarArrows = document.getElementById("nb");
    var fourthArrow = topBarArrows.getElementsByTagName("img")[3];

    // Make a new arrow, then insert that between Favorites and Home/Settings (before position 4)
    var newImage = document.createElement("img");
    newImage.src = "https://ehgt.org/g/mr.gif";
    topBarArrows.insertBefore(newImage,fourthArrow);

    //Make new Text and insert that text between the (new) arrow and the (old) fourth arrow
    var newText = document.createElement("a");
    newText.innerHTML = " Following";
    newText.href = "#";
    newText.onclick = function() {showFollowing();};

    topBarArrows.insertBefore(newText,fourthArrow);


    // loads the searchName array so the for loop knows how many search terms you have
    var searchName = JSON.parse(window.localStorage.getItem("searchName"));

    //Put a subscribe button next to the "Show File Search" link near search box
    var subscribeButton = document.createElement("a");
    subscribeButton.innerText = "Show Subscribe Dialog";
    subscribeButton.style.marginLeft = "7px";
    subscribeButton.href = "#";
    subscribeButton.id = "myBtn";
    document.getElementById("searchbox").getElementsByClassName("nopm")[1].append(subscribeButton);
    subscribeButton.onclick = function() {showSubscribe();};

    //Let's execute this now because this thing doesn't work
    setupSubscribe();
    //damn it still doesn't work

//-----------------The actual following script

    //Activates when "Following" is clicked
    function showFollowing() {

    //Sets get requests to be synchronous with the code because _javascript_
    //This has to be done here because jQuery hasn't finished loading by
    //              the time the script loads in the "following" button
    jQuery.ajaxSetup({async:false});

        console.log("It's starting");

    //Hide the main page...
    document.getElementsByClassName("ido")[0].style.display = "none";

    //...then display the "Following" page
    var newPage = document.createElement("div");
    newPage.id = "myPage";
    newPage.className = "page";

    var windowContent = document.createElement("div");
    windowContent.className = "page-content";

    var pageTop = document.createElement("span");
    pageTop.className = "close";
    pageTop.innerText = "\nFollowing";
    pageTop.style.fontSize = "200%";

    var pageText = document.createElement("p");
    pageText.innerText = "Your followed searches:";
    pageText.style.fontSize = "150%";

    //put everything together at the end of the body, then center it
    document.body.insertBefore(newPage, document.getElementsByClassName("dp")[0]);
    document.getElementById("myPage").append(windowContent);
    document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pageTop);
    document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pageText);

    document.getElementById("myPage").style.alignContent = "space-between";


//-------------------------Start the search data collection

        var i = 0;

    //If the searchName array is undefined, you haven't saved any searches
    //If the searchName array is defined as an array, start going through each search
    if (searchName == null){
           console.log("Oh, you don't have any saved searches...");
           firstRun();
    }
    else{
       console.log("Oh, you've got some saved searches. Let's start the userscript");

        //start getting data for each searchterm
        beforeTheGet(0, searchName);
}

    //Adds a "Reorder" button to the bottom of the page

//lolol next version maybe

  //save time you last updated this in MM / DD format, then puts it on the bottom
  //It doesn't actually work though...
       var newTimeUpdated = new Date().getMonth() + " / " + new Date().getDate();
       var dateElement = document.createElement("p");
       dateElement.innerText = "Last Updated: " + newTimeUpdated;
       dateElement.style.fontSize = "110%";
       document.getElementById("myPage").getElementsByClassName("page-content")[0].append(dateElement);

} //end show function


//////---------------------beforeTheGet function (gets a search via GET request)
function beforeTheGet(i, searchName) {
  setTimeout(function() {
        console.log("I've made it into the for loop!\nThe variable i now equals: " + i);

        //Request current search page via GET request also copy pasted from stack overflow
        // and then uses the data to fill in the variables that need it
        // Waits five seconds before executing each request (because the setTimeout increases with each for loop)
        // (all information needed is achieved with one search)

        var xhr = "xhr before get";
        $.get(
            searchName[i],
            {},
            function(data) {
                xhr = data;
                console.log("I'm about to enter the afterTheGet function with i = " +i);
                afterTheGet(xhr , i);
            }
        );

      i++;
      if (i < searchName.length){ console.log("I'm about to go into the next loop, with i = "+i); beforeTheGet(i , searchName);}
        console.log("at the end of the for loop, the variable i = " + i);

  }, 5000*i);
}

//-------------------------afterTheGet function (goes through data retrieved from search)
    function afterTheGet(xhr , i){ setTimeout(function(){

        console.log("I'm now in the afterTheGet Function, where i = " + i);

        //redefine all variables in the scope of this function for some reason. These will be read from the localStorage:
          var searchName = JSON.parse(window.localStorage.getItem("searchName"));
          var lastResultNumber = JSON.parse(window.localStorage.getItem("lastResultNumber"));
          var lastResultURL = JSON.parse(window.localStorage.getItem("lastResultURL"));
          var humanName = JSON.parse(window.localStorage.getItem("humanName"));

        var newResultNumber = 12;
        var newResultURL1 = "url1";
        var newResultURL2 = "url1";
        var newResultURL3 = "url1";
        var newResultURL4 = "url1";
        var newResultURL5 = "url1";
        var newTimeUpdated = "time1";
        var newGalleryPic1 = "picurl1"; //what the fuck are you doing use an array
        var newGalleryPic2 = "picurl1";
        var newGalleryPic3 = "picurl1";
        var newGalleryPic4 = "picurl1";
        var newGalleryPic5 = "picurl1";

        console.log("The lastresultNumber array is for some reason " +lastResultNumber);


         //Wrap the html data in string form in order to use crap like "getElementsByClass" etc
         var wrapper = document.createElement("div");
         wrapper.innerHTML = xhr;

         //Get the number of galleries currently available for your search
        var tempgalleryNumber = wrapper.getElementsByClassName("ip")[0].innerHTML.substring(16);
        tempgalleryNumber = tempgalleryNumber.replace(",", "");
        newResultNumber = parseInt(tempgalleryNumber);
        console.log("The lastResultNumber array in the new function: " + lastResultNumber[i]);
        console.log("The newResultNumber integer in the new function: " + newResultNumber);

        //Get the URL of the latest gallery available for that tag
        //If the user is using list view, get it from where "it5" in the wrapper
        //If the user is using thumbnail view, get it from where "id2" is
        if (xhr.indexOf("it5") > -1) {
            //We list view nao (works!)
            //Get the five latest gallery urls for the list search
            newResultURL1 = wrapper.getElementsByClassName("it5")[0].firstChild.href;
            newResultURL2 = wrapper.getElementsByClassName("it5")[1].firstChild.href;
            newResultURL3 = wrapper.getElementsByClassName("it5")[2].firstChild.href;
            newResultURL4 = wrapper.getElementsByClassName("it5")[3].firstChild.href;
            newResultURL5 = wrapper.getElementsByClassName("it5")[4].firstChild.href;

        }
        else
        {
            //we thumbnail view nao (I think it works now!)
             newResultURL1 = wrapper.getElementsByClassName("id2")[0].firstChild.href;
             newResultURL2 = wrapper.getElementsByClassName("id2")[1].firstChild.href;
             newResultURL3 = wrapper.getElementsByClassName("id2")[2].firstChild.href;
             newResultURL4 = wrapper.getElementsByClassName("id2")[3].firstChild.href;
             newResultURL5 = wrapper.getElementsByClassName("id2")[4].firstChild.href;
        
        }

        console.log("The first newURL in the new function: " + newResultURL1);
        console.log("The 2 newURL in the new function: " + newResultURL2);
        console.log("The 3 newURL in the new function: " + newResultURL3);
        console.log("The 4 newURL in the new function: " + newResultURL4);
        console.log("The first newURL in the new function: " + newResultURL5);

        //Get the URL of the thumbnail for latest gallery available for that tag
        if ((window.location.href).indexOf("e-hen") > -1){
            
                if (xhr.indexOf("it5") > -1) {   //ehen list view
                    newGalleryPic1 = wrapper.getElementsByClassName("it2")[0].firstChild.src;
                    newGalleryPic2 = wrapper.getElementsByClassName("it2")[1].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[1].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic2 = "https://" + newGalleryPic2.replace("~", "/");

                    newGalleryPic3 = wrapper.getElementsByClassName("it2")[2].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[2].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic3 = "https://" + newGalleryPic3.replace("~", "/");

                    newGalleryPic4 = wrapper.getElementsByClassName("it2")[3].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[3].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic4 = "https://" + newGalleryPic4.replace("~", "/");

                    newGalleryPic5 = wrapper.getElementsByClassName("it2")[4].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[4].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic5 = "https://" + newGalleryPic5.replace("~", "/");
                }
                else //ehen thumb view
                {
                    newGalleryPic1 = wrapper.getElementsByClassName("id3")[0].firstChild.firstChild.src;
                    newGalleryPic2 = wrapper.getElementsByClassName("id3")[1].firstChild.firstChild.src;
                    newGalleryPic3 = wrapper.getElementsByClassName("id3")[2].firstChild.firstChild.src;
                    newGalleryPic4 = wrapper.getElementsByClassName("id3")[3].firstChild.firstChild.src;
                    newGalleryPic5 = wrapper.getElementsByClassName("id3")[4].firstChild.firstChild.src;
                }
            }
            else {

            if (xhr.indexOf("it5") > -1) {   //panda list view
                console.log("panda list view")
                    newGalleryPic1 = wrapper.getElementsByClassName("it2")[0].firstChild.src;
                    newGalleryPic2 = wrapper.getElementsByClassName("it2")[1].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[1].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic2 = "https://" + newGalleryPic2.replace("~", "/");

                    newGalleryPic3 = wrapper.getElementsByClassName("it2")[2].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[2].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic3 = "https://" + newGalleryPic3.replace("~", "/");

                    newGalleryPic4 = wrapper.getElementsByClassName("it2")[3].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[3].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic4 = "https://" + newGalleryPic4.replace("~", "/");

                    newGalleryPic5 = wrapper.getElementsByClassName("it2")[4].innerHTML.substring(6,wrapper.getElementsByClassName("it2")[4].innerHTML.indexOf(".jpg")+4)
                    newGalleryPic5 = "https://" + newGalleryPic5.replace("~", "/");
                }
                else //panda thumb view
                {
                    console.log("panda thumb view")
                    newGalleryPic1 = wrapper.getElementsByClassName("id3")[0].firstChild.firstChild.src;
                    newGalleryPic2 = wrapper.getElementsByClassName("id3")[1].firstChild.firstChild.src;
                    newGalleryPic3 = wrapper.getElementsByClassName("id3")[2].firstChild.firstChild.src;
                    newGalleryPic4 = wrapper.getElementsByClassName("id3")[3].firstChild.firstChild.src;
                    newGalleryPic5 = wrapper.getElementsByClassName("id3")[4].firstChild.firstChild.src;
                }
            }

    //    newGalleryPic = tempgalleryPicURL;
        console.log(newGalleryPic1);
        console.log(newGalleryPic2);
        console.log(newGalleryPic3);
        console.log(newGalleryPic4);
        console.log(newGalleryPic5);


        // Check whether the new number of galleries is the same as the old

        // Also checks whether the newResultURL is new or not. If it is,
        // a gallery was updated, and that needs to be counted as a new result.
        if (newResultNumber == lastResultNumber[i] && newResultURL1 != lastResultURL[i])
        {
            newResultNumber = lastResultNumber[i] + 1;
        }


        //Display results on the page
        var searchElement = document.createElement("a");
        searchElement.innerText = ("\n\n\n\n"+humanName[i] + "  ||  New Results: " + (newResultNumber - lastResultNumber[i]) + "\n\n");
        searchElement.style.fontSize = "160%";
        searchElement.style.fontWeight = "800";

        //Get proper URL for the search
            if ((window.location.href).indexOf("e-hen") > -1){
                searchElement.href = "https://e-hentai.org" + searchName[i];
            }
            else {
                searchElement.href = "https://exhentai.org" + searchName[i];
            }

            //Create five pictures for the five latest galleries
            //fuuuuuuuck I should have made these arrays...
            var searchPicture1 = document.createElement("img");
            searchPicture1.src = newGalleryPic1;
            var pictureContainer1 = document.createElement("a");
            pictureContainer1.href = newResultURL1;
            pictureContainer1.appendChild(searchPicture1);

            var searchPicture2 = document.createElement("img");
            searchPicture2.src = newGalleryPic2;
            var pictureContainer2 = document.createElement("a");
            pictureContainer2.href = newResultURL2;
            pictureContainer2.appendChild(searchPicture2);

            var searchPicture3 = document.createElement("img");
            searchPicture3.src = newGalleryPic3;
            var pictureContainer3 = document.createElement("a");
            pictureContainer3.href = newResultURL3;
            pictureContainer3.appendChild(searchPicture3);

            var searchPicture4 = document.createElement("img");
            searchPicture4.src = newGalleryPic4;
            var pictureContainer4 = document.createElement("a");
            pictureContainer4.href = newResultURL4;
            pictureContainer4.appendChild(searchPicture4);

            var searchPicture5 = document.createElement("img");
            searchPicture5.src = newGalleryPic5;
            var pictureContainer5 = document.createElement("a");
            pictureContainer5.href = newResultURL5;
            pictureContainer5.appendChild(searchPicture5);

            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(searchElement);
            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pictureContainer1);
            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pictureContainer2);
            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pictureContainer3);
            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pictureContainer4);
            document.getElementById("myPage").getElementsByClassName("page-content")[0].append(pictureContainer5);


            console.log("The searchName array  at " +i +" is now length "+searchName.length);
            console.log("The humanname array  " +i +" is now "+humanName);
            console.log("The lastResultNumb array  " +i +" is now "+lastResultNumber);
            console.log("The newResultNumb integer is  " +i +" is now "+newResultNumber);

            console.log("The lastURL array  " +i +" is now "+lastResultURL);

            //Update the arrays with new stuff...
            lastResultNumber[i] = newResultNumber;
            lastResultURL[i] = newResultURL1;

            //Remove the arrays from local storage
            window.localStorage.removeItem("lastResultNumber");
            window.localStorage.removeItem("lastResultURL");

            //Then save the arrays with the new elements back to localstorage
            window.localStorage.setItem("lastResultNumber", JSON.stringify(lastResultNumber));
            window.localStorage.setItem("lastResultURL", JSON.stringify(lastResultURL));

        console.log("-----------The afterTheGet Function has ended-------------");
        console.log("Okay, let's just wait 6 seconds before moving onto the next search...");


    }, 1);} // end afterTheGet function

//-------------------------show subsscribe dialog function
    function setupSubscribe(){


//Set up the Modal using javascript (Copy pasted from W3schools)
var myModal = document.createElement("div");
  myModal.className= "modal";
  myModal.id = "myModal";

var modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  myModal.append(modalContent);

var modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalContent.append(modalHeader);

var closeThing = document.createElement("span");
  closeThing.className = "close";
  closeThing.innerText = "Close";
  modalHeader.append(closeThing);

var headerText = document.createElement("h2");
  headerText.innerText = "Subscribe to Search";
  modalHeader.append(headerText);

var modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  var bodyText = document.createElement("p");
  bodyText.innerText = "Did you want to save this search?\nEnter what you want to name it below:\n";
  bodyText.id = "modalBodyText";
  var bodyTextBox = document.createElement("input");
  bodyTextBox.type = "text";
  bodyTextBox.id = "textBox";
  var bodyConfirmButton = document.createElement("button");
  bodyConfirmButton.innerText = "Save!";
  bodyConfirmButton.onclick = function(){subscribeToSearch();};
  var bodyDeleteButton = document.createElement("button");
  bodyDeleteButton.innerText = "Delete!";
  bodyDeleteButton.onclick = function(){deleteSearch();};
  var makeshiftspacer = document.createElement("a");
  makeshiftspacer.innerText = "    or    ";
  modalBody.append(bodyText);
  modalBody.append(bodyTextBox);
  modalBody.append(bodyConfirmButton);
  modalBody.appendChild(makeshiftspacer);
  modalBody.append(bodyDeleteButton);
  modalContent.append(modalBody);

var modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  var footerText = document.createElement("h3");
  footerText.innerText = "The footer of the modal";
  modalContent.append(modalFooter);

//Attach everything to the page
  document.getElementsByClassName("itg")[0].append(myModal);

//-------------------------------static CSS
myModal.style.cssText = "display: none; position: fixed;   z-index: 1;    padding-top: 100px;    left: 0;    top: 0;    width: 100%;     height: 100%;   overflow: auto;   background-color: rgb(0,0,0);    background-color: rgba(0,0,0,0.4);";

modalBody.style.cssText = "padding: 2px 16px;";

closeThing.style.cssText = "    color: white;    float: right;    font-size: 28px;    font-weight: bold;";

//-------------------------------dynamic CSS (supposed to change on panda)
if ((window.location.href).indexOf("e-hen") > -1){
modalContent.style.cssText = "    position: relative;    background-color: #FFFFFF;    margin: auto;    padding: 0;    border: 1px solid #888;    width: 80%;    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);";

modalHeader.style.cssText ="    padding: 2px 16px;    background-color: #732626;    color: white;";

modalFooter.style.cssText = " padding: 2px 16px;    background-color: #732626;    color: white;";
}
else
{
    modalContent.style.cssText = "    position: relative;    background-color: #4f535b;    margin: auto;    padding: 0;    border: 1px solid #888;    width: 80%;    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);";

modalHeader.style.cssText ="    padding: 2px 16px;    background-color: #34353b;    color: white;";

modalFooter.style.cssText = " padding: 2px 16px;    background-color: #34353b;    color: white;";
}


/*
Oh wow, these don't even work
var webkitkeyframeElement = document.createElement("style");
webkitkeyframeElement.innerText = " @-webkit-keyframes animatetop {    from {top:-300px; opacity:0}     to {top:0; opacity:1}}";

var keyframeElement = document.createElement("style");
keyframeElement.innerText = " @keyframes animatetop {    from {top:-300px; opacity:0}    to {top:0; opacity:1}}";
*/


/*
// When the user clicks anywhere outside of the modal, close it
Oh, this doesn't work either
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
*/
}

//--------------------- javascript
    function showSubscribe(){
        // Get the modal
        var modal = document.getElementById("myModal");

        console.log("modal is "+modal);
        // Get the button that opens the modal
        var bttn = document.getElementById("myBtn");

        console.log("bttn is "+bttn);
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        console.log("span is "+span);
        // When the user clicks the button, open the modal
        bttn.onclick = function() {
            modal.style.display = "block";
            console.log("I've set the display");
        };

        // When the user clicks on <span> (close), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            console.log("I've changed the span thing");
        };
    }


//--------------------------Function that subscribes you to a search
    function subscribeToSearch(){

        //load in the arrays from localstorage...
        var searchName = JSON.parse(window.localStorage.getItem("searchName"));
        var humanName = JSON.parse(window.localStorage.getItem("humanName"));
        var lastResultNumber = JSON.parse(window.localStorage.getItem("lastResultNumber"));
        var lastResultURL = JSON.parse(window.localStorage.getItem("lastResultURL"));

        var youarehere = (window.location.href);

        //used to check for duplicate searches:
        var isANewArray = "false";
        var tempsearchName;
        if(searchName!==null){
            tempsearchName = searchName.slice();
        }
        else {

            //Prepare empty arrays
            searchName=[];
            tempsearchName = [];
            humanName =[];
            lastResultNumber = [];
            lastResultURL = [];
        }

        //Checks if these arrays are null (i.e. this is the first time you're subscribing to a search)
        if (searchName == null) {

            console.log("This is the first time you're subscribing to a search. Creating localstorage variables for later...");

            //Place the new elements into a new array
            youarehere = youarehere.substring(20, youarehere.length-1);
            tempsearchName = [youarehere];
            humanName = [document.getElementById("textBox").value];
            lastResultNumber = [0];
            lastResultURL = ["urldoesn'tgohere"];

            isANewArray = "true";

        }
        else{

            //If this isn't the first time,
            //Append the new elements after the old elements of the array
            youarehere = youarehere.substring(20, youarehere.length-1);
            tempsearchName.push(youarehere);

            humanName.push(document.getElementById("textBox").value);
            lastResultNumber.push(0);
            lastResultURL.push("urlgoeshere");
        }


        var searchSucessText = document.createElement("p");

        //If this isn't a new array, check if you already have this search
        //If it's a duplicate, reject the request
        if (searchName.indexOf(youarehere) > -1 && isANewArray == "false") {

            //Alert the user the search was not saved
            document.getElementById("modalBodyText").innerText = "Save failed. You're already subscribed to this search.\nYou can remove it by clicking the \"Delete!\" button";

        } else {

            console.log("Saving your search...");

            //Delete the arrays already in localstorage...
            window.localStorage.removeItem("searchName");
            window.localStorage.removeItem("humanName");
            window.localStorage.removeItem("lastResultNumber");
            window.localStorage.removeItem("lastResultURL");

            //Then save the arrays with the new elements back to localstorage
            window.localStorage.setItem("searchName", JSON.stringify(tempsearchName));
            window.localStorage.setItem("humanName", JSON.stringify(humanName));
            window.localStorage.setItem("lastResultNumber", JSON.stringify(lastResultNumber));
            window.localStorage.setItem("lastResultURL", JSON.stringify(lastResultURL));

            //Alert the user that the search was saved
            document.getElementById("modalBodyText").innerText = "You've successfully subscribed to the search: " + document.getElementById("textBox").value;

        }

    } //end subscribe to search

//=====--------------------------Function that deletes a search

    function deleteSearch(){

        //load in the arrays from localstorage...
        var searchName = JSON.parse(window.localStorage.getItem("searchName"));
        var humanName = JSON.parse(window.localStorage.getItem("humanName"));
        var lastResultNumber = JSON.parse(window.localStorage.getItem("lastResultNumber"));
        var lastResultURL = JSON.parse(window.localStorage.getItem("lastResultURL"));

        var youarehere = (window.location.href).substring(20, window.location.href.length - 1);

        //used to check for duplicate searches:
        var isANewArray = "false";
        var tempsearchName;
        if(searchName!==null){
            tempsearchName = searchName.slice();
        }
        else {

            //Prepare empty arrays
            searchName=[];
            tempsearchName = [];
            humanName =[];
            lastResultNumber = [];
            lastResultURL = [];
        }

        //Checks if these arrays are null
        if (searchName == null) {

            console.log("You don't have any searches to delete");
            isANewArray = "true";

        }
        
        var searchSucessText = document.createElement("p");

        //If this isn't a new array, check if you already have this search
        //If it's a duplicate, reject the request
        if (searchName.indexOf(youarehere) > -1 && isANewArray == "false") {
            
            //This search exists in the array.
            //Delete it using the indexOf to find it
            console.log("Deleting search...");
            var deletdis = searchName.indexOf(youarehere);

            tempsearchName.splice(deletdis, 1);
            humanName.splice(deletdis, 1);
            lastResultNumber.splice(deletdis, 1);
            lastResultURL.splice(deletdis, 1);

            //Delete the arrays already in localstorage...
            window.localStorage.removeItem("searchName");
            window.localStorage.removeItem("humanName");
            window.localStorage.removeItem("lastResultNumber");
            window.localStorage.removeItem("lastResultURL");

            //Then save the arrays with the new elements back to localstorage
            window.localStorage.setItem("searchName", JSON.stringify(tempsearchName));
            window.localStorage.setItem("humanName", JSON.stringify(humanName));
            window.localStorage.setItem("lastResultNumber", JSON.stringify(lastResultNumber));
            window.localStorage.setItem("lastResultURL", JSON.stringify(lastResultURL));

            document.getElementById("modalBodyText").innerText = "You've deleted this search.";


        } else {

            //Alert the user the search wasn't deleted
            document.getElementById("modalBodyText").innerText = "You need to be subscribed to a search in order to delete it.";

        }
    
}

//-------------------------misc functions
    //shows a page informing you that you don't have any saved searches.
    function firstRun(){
        var infoElement = document.createElement("a");
        infoElement.innerText = ("\n\n\n\nYou don't have any saved searches, so get out there and start searching.\nOnce you find a search you want to follow, hit the 'Show Subscribe dialog' link under the search bar\n\n");
        infoElement.style.fontSize = "140%";
        document.getElementById("myPage").getElementsByClassName("page-content")[0].append(infoElement);

        var returnElement = document.createElement("a");
        returnElement.innerText = "(Click here to return to the front page)\n\n";
        returnElement.style.fontSize = "130%";
        returnElement.href = "";
        document.getElementById("myPage").getElementsByClassName("page-content")[0].append(returnElement);
    }

})();
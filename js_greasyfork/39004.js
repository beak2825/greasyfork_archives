// ==UserScript==
// @name         FellowshipOne Profile Page - Add Custom Actions
// @namespace    data@chapel.org
// @version      0.4
// @description  Add custom links and macros to the profile page
// Including 1) Macro: Add Need Parent Info Tag Comment
//           2) Open reference sitt to check gender of first name
//           3) Open reference site reverse address searcj Whitepages
//           4) View basic giving details
//           5) Macro: Set status and substatus for All Head/Spouse/Children
// @author       Tony Visconti
// @match        https://portal.fellowshipone.com/people/Individual/Index.aspx?id=*
// @match        https://portal.staging.fellowshipone.com/people/Individual/Index.aspx?id=*
// @grant        none
// @homepage         https://greasyfork.org/en/scripts/39004-fellowshipone-profile-page-add-custom-actions
// This script ties to FellowshipOne Edit Person Page: Run Macro and FellowshipOne Household Edit Page: Run Macro
// @downloadURL https://update.greasyfork.org/scripts/39004/FellowshipOne%20Profile%20Page%20-%20Add%20Custom%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/39004/FellowshipOne%20Profile%20Page%20-%20Add%20Custom%20Actions.meta.js
// ==/UserScript==

//---------- Functions ----------
//function is compliments of http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getUrlParameter(sParam) {
  var searchParams = new URLSearchParams(document.location.search.substring(1));
  return searchParams.get(sParam); 
}

//basic javascript ajax was used here instead of jquery because I couldn't get it to work with F1's version of jquery. When I loaded my own I also ran into issues.
function CheckForGiving(url, searchText,func,element)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var regExp = new RegExp(searchText, "i");
            console.log("Checking for giving records");
            var textFound = this.responseText.search(regExp);
            //console.log(this.responseText);

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.responseText,"text/html");
            var numGifts = "";
            var lastFundGivenTo = "";
            var lastGiftDate = "";
            if(xmlDoc.querySelector('#repTable > tbody > tr:nth-child(2) > td:nth-child(4) > div')!= null)
            {
                lastFundGivenTo = xmlDoc.querySelector('#repTable > tbody > tr:nth-child(2) > td:nth-child(4) > div').innerText;
                lastGiftDate = xmlDoc.querySelector('#repTable > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
                //console.log('Last fund given to: '+lastFundGivenTo.trim().toUpperCase());
                numGifts = xmlDoc.querySelectorAll('#repTable > tbody > tr').length-1;

                var dateString = NOW.getMonth()+1+'/'+NOW.getDate()+'/'+NOW.getFullYear();
                console.log('Total gifts since ' +dateString+': ' + numGifts);
            }

            if(textFound <=0)
            {
                //console.log("Search Text: \"" +searchText + "\" not found");
                func(element,true,lastFundGivenTo,numGifts,lastGiftDate);
            }
            else
            {
                //console.log("Search Text: \"" +searchText + "\" found");
                func(element,false,"","");
            }
        }
    };

    //setup form data
    var formData = new FormData();
    formData = '__EVENTTARGET=ctl00$ctl00$MainContent$content$dteStartDate';
    var dateString = NOW.getMonth()+1+'/'+NOW.getDate()+'/'+NOW.getFullYear();
    console.log('Current Date: ' + dateString);
    formData += '&ctl00$ctl00$MainContent$content$dteStartDate=1/1/2017';
    formData += '&ctl00$ctl00$MainContent$content$dteEndDate='+ dateString;
    formData += '&ctl00$ctl00$MainContent$content$ddlFilter=All';

    //open and send request
    xhttp.open("POST", url , true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);
}


function AddContributionLink(element, contributionsFound,lastFundGivenTo, numGifts,lastGiftDate)
{
    var text = "View Contribution Details";
    var lastYear = NOW.getFullYear()-1;
    var givingDetails = "";
    if(contributionsFound)
    {
        givingDetails += ""+ numGifts + ' gifts exist since ' + lastYear;
        givingDetails += "<br>" + 'Last gift (' + lastGiftDate.trim() + '): '+ lastFundGivenTo;

    }
    else
    {
        givingDetails += ""+ "No Giving Exists Since " + lastYear;
    }
    var contributionsLink = '<li><a target="_blank" href="https://portal.fellowshipone.com/giving/householdcontribution2.aspx">'+text+'</a><br>'+givingDetails+'</li>';
    element.innerHTML += contributionsLink;


}

function returnOptions(myArray)
{
    var str ="";
    for (let i = 0; i < myArray.length; i++)
    {
        str += "\n" + (i+1) + " : " + myArray[i];
    }
    return str;
}


function selectMacro(id,hsd)
{
    var promptValue = prompt("Please select macro:\n 1: Add tag comment\n 2: Set status for household\n 3: Reverse Address Search on Whitepages", "");
    var navigateTo = "";
    var statuses = ['New','Nominally Involved','Significantly Involved','Core','Not Recently Involved','Gone'];
    var subStatuses = ['Barrington','Grayslake','Hinsdale','Lake Zurich','Libertyville','McHenry','Mundelein','Palatine'];
    if (promptValue == "1")
    {
        navigateTo = '/People/Individual/Edit.aspx?IndID=' + id + '&HsdID=' + hsd + '&source=INDIVIDUALINDEXPROXY&customAction=TagCommentNeedParentInfo';
        //console.log('https://'+ window.location.hostname + navigateTo);
        window.location.href = 'https://'+ window.location.hostname + navigateTo;
    }

    if (promptValue == "2")
    {
        var statusSelection = parseInt(prompt("Enter Status:\n" + returnOptions(statuses)))-1;
        var subStatusSelection = parseInt(prompt("Enter Sub-Status:\n" + returnOptions(subStatuses)))-1;
        navigateTo = '/bridge/household/' + hsd + '/members/edit?customAction=SetStatus&Status=' + statuses[statusSelection] + '&SubStatus=' + subStatuses[subStatusSelection];
        //console.log('https://'+ window.location.hostname + navigateTo);
        window.location.href = 'https://'+ window.location.hostname + navigateTo;
    }
    if (promptValue == "3")
    {
        var street = document.querySelector("div.street-address").innerHTML;
        var city = document.querySelector("span.locality").innerHTML;
        var state = document.querySelector("abbr.region").innerHTML;
        var zip = document.querySelector("span.postal-code").innerHTML;
        var reverseAddressURL = "https://www.whitepages.com/search/FindNearby?street="+street.replace(' ','+')+'&where='+city+'+'+state+'+'+zip;
        window.open(reverseAddressURL);

    }
}
//---------- Inject Javascript Functions to foreground ----------
function injectFunction(functionStr)
{
    var script = document.createElement("script");
    script.type="text/javascript";
    script.innerHTML=functionStr;
    document.head.appendChild(script);
}

injectFunction(selectMacro.toString());
injectFunction(returnOptions.toString());

//---------- Main ----------
var NOW = new Date();
var id = getUrlParameter('id');
//Grab household Id
//tab_back link looks like this https://portal.fellowshipone.com/People/Family/Index.aspx?id=########
var hsd = document.getElementById("tab_back").href.match(/=[0-9]*/)[0].split('=')[1];

//Add Run Macro Button
var asideFirstSection = document.getElementsByClassName("aside")[0].children[1];
var runMacroElem = '<li><button onclick=selectMacro(' + id + ',' + hsd + ')>View Macros</button></li>';
asideFirstSection.innerHTML += runMacroElem;

// Add reverse address search link


// Add Check Gender Link
var firstName = document.getElementById("household_individual_name").innerHTML.split(" ")[0].trim();
var checkGenderLink = '<li><a target="_blank" href="https://api.genderize.io/?name=' + firstName + '">Check Gender Of First Name</a>';
asideFirstSection.innerHTML += checkGenderLink;


//Add Giving Preview Info
CheckForGiving('/giving/householdcontribution2.aspx?ind='+id+'&r=Contributions','no records found',AddContributionLink,asideFirstSection);


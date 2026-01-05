// ==UserScript==
// @name         FellowshipOne Smart Quick Search
// @namespace    data@chapel.org
// @version      0.8
// @description  Fix quick people search for Fellowshipone to intelligently handle phone #, email, or address searches. This also appends search links to the address and
// @author       Tony Visconti
// @match        https://portal.fellowshipone.com/Search/List.aspx?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29061/FellowshipOne%20Smart%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/29061/FellowshipOne%20Smart%20Quick%20Search.meta.js
// ==/UserScript==


var searchTerm = document.getElementById("txtName").value;
//window.alert(searchTerm);

// if there is an @ in the search term or a 10 digit phone numeber resubmit the search as an email address search
if(searchTerm.indexOf("@")>-1 || searchTerm.match(/\d{10}/))
{
    document.getElementById("txtCommunication").value = searchTerm;
    document.getElementById("txtName").value = "";
    document.getElementById("submitQuery").click();
}

//if the search starts of with numbers follow by a space and alpha charters then resubmit search as an address search
if(searchTerm.match(/\d+\s[A-Za-z].*/) !== null)
{
   document.getElementById("txtAddress").value = searchTerm;
   document.getElementById("txtName").value = "";
   document.getElementById("submitQuery").click();
}

var addressElem = document.querySelector("div.street-address");
if(addressElem != null)
{
    var address = addressElem.innerHTML;
    addressElem.innerHTML += '<a href="https://portal.fellowshipone.com/Search/List.aspx'+
       '?inactivePreferencePresent=1&btnSearchIndividual=Search&searchFor=&address=' + address +
        '&communication=&includeInactive=showInactive">[s]</a>';
}


var emailAddressElem = document.querySelector("div.email a.value");
if(emailAddressElem != null)
{
    var emailAddress = emailAddressElem.innerText;
    emailAddressElem.innerHTML += '<a href="https://portal.fellowshipone.com/Search/List.aspx?inactivePreferencePresent=1'+
        '&btnSearchIndividual=Search&searchFor=&address=&communication=' + emailAddress + '&includeInactive=showInactive"> [s]</a>';
}

var phoneNumElem = document.querySelector("div.tel span.value");
if(phoneNumElem != null)
{
    var phoneNum = phoneNumElem.innerText;
    phoneNumElem.innerHTML += '<a href="https://portal.fellowshipone.com/Search/List.aspx?inactivePreferencePresent=1'+
        '&btnSearchIndividual=Search&searchFor=&address=&communication=' + phoneNum + '&includeInactive=showInactive">[s]</a>';
}

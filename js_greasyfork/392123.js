// ==UserScript==
// @name        Room Booking 
// @namespace   Violentmonkey Scripts
// @match       https://auti.aut.ac.nz/directorate/estates/timetabling/Lists/roombookingform/NewForm.aspx
// @grant       none
// @version     1.0.2
// @author      -
// @description 08/11/2019, 12:22:27
// @downloadURL https://update.greasyfork.org/scripts/392123/Room%20Booking.user.js
// @updateURL https://update.greasyfork.org/scripts/392123/Room%20Booking.meta.js
// ==/UserScript==
//
// Add Create Appointment button
// 
//https://www.w3schools.com/jsref/met_node_appendchild.asp

//var fill_button = document.createElement("button");
//fill_button.style = "white-space: nowrap";
//fill_button.innerHTML = "fill form";
//fill_button.id = "fill_form";
//fill_button.onClick = "fill_form()";


if (window.confirm("Populate form"))
{
  //Start Time set to 8 AM
  document.getElementsByClassName(" nf-choice-select nf-associated-control nf-associated-control nf-associated-control nf-associated-control")[0].value = document.getElementsByClassName(" nf-choice-select nf-associated-control nf-associated-control nf-associated-control nf-associated-control")[0].options[3].value
  //End Time set to 6 PM
  document.getElementsByClassName(" nf-choice-select nf-associated-control nf-associated-control nf-associated-control nf-associated-control")[1].value = document.getElementsByClassName(" nf-choice-select nf-associated-control nf-associated-control nf-associated-control nf-associated-control")[1].options[23].value
  //Number of people
  document.getElementsByClassName("nf-associated-control")[4].value = "30";
  //Contact for booking
  document.getElementsByClassName("nf-associated-control")[7].value = "CRAIG COVENEY";
  //Set Department for Booking
  document.getElementsByClassName("nf-associated-control")[8].value = "ICT";
  //Digital Signage
  document.getElementsByClassName("nf-associated-control")[9].value = "ICT Imaging";
  //Title of Event
  document.getElementsByClassName("nf-associated-control")[10].value = "ICT Imaging";  
  //Any other details
  document.getElementsByClassName("ms-spellcheck-true nf-associated-control nf-associated-control nf-associated-control nf-associated-control")[0].value = "ICT REIMAGING REQUIRED FOR THIS PARTICULAR ROOM. PLEASE ALSO DUPLICATE THIS BOOKING FOR THE FOLLOWING DAY AS WELL. (2 DAYS REQUIRED)"
  
}

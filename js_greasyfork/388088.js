// ==UserScript==
// @name ConnectWise Ticket AutoFill
// @description Assist with filling ConnectWise tickets
// @namespace Violentmonkey Scripts
// @match https://manage.cyclone.co.nz/v4_6_release/timeexpensemodule.html*
// @match https://manage.cyclone.co.nz/v4_6_release/ConnectWise.aspx*
// @grant GM_getValue
// @grant GM_setValue
// @version 1.1.1
// @downloadURL https://update.greasyfork.org/scripts/388088/ConnectWise%20Ticket%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/388088/ConnectWise%20Ticket%20AutoFill.meta.js
// ==/UserScript==

//There's no way to fetch the ticket location from the ticket itself so instead we'll just provide two buttons
//After clicking the button MAKE SURE YOU CLICK IN EACH FIELD IT FILLED SO IT REGISTERS IT
//Doesn't appear on travel sheet until a refresh... WTF
//Won't let us do the 'Charge To' part (yet)

//Fill in your time like the example, if you do straight shift then set campus_2 as "" and it'll not generate the Shift 2 button
var campus_1 = "South";
var campus_2 = "City";
var start_1 = "07:30 AM";
var finish_1 = "11:30 AM";
var deduct_1 = ""; //You may need to set this to 0.5 - I'm not sure cause I don't use it
var start_2 = "12:30 PM";
var finish_2 = "4:30 PM";
var deduct_2 = "";
var travel_start = "11:30 AM";
var travel_finish = "12:00 PM";
var travel_notes = `Travel ${campus_1} to ${campus_2}`;

var location_found = false;

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
function get_campus()
{
  console.log(document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML);
  console.log(document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML.includes(campus_2));
  if (document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML.includes(campus_1) == true)
  {
    GM_setValue("campus", campus_1);
    location_found = true;
    console.log(location_found);
    console.log(GM_getValue("campus"));
  }
  else if (document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML.includes(campus_2) == true)
  {
    GM_setValue("campus", campus_2);
    location_found = true;
  }
}

async function wait_for_location_page()
{
  //insists on trying to run shit before it's loaded no matter what we do so we have to resort to actually checking every 0.5s whether it's loaded or not
  var i = 0;
  while (document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0] == undefined) 
  {
    console.log(i);
    i++
    await sleep(500);
    try
    {
      while (document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML == undefined)
      {
        console.log('innerHTML');
        await sleep(500);
      }
    }
    catch
    {
      console.log(document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0].innerHTML);
      await sleep(500);
    }
  }
  get_campus();
}

if (window.location.pathname.includes("ConnectWise") && (location_found == false))
{
  wait_for_location_page();
}
*/

//
// Split it here
// Above checks if we can find the campus location
// Below adds the fill buttons to the ticket itself
// 

//http://benalexkeen.com/autofilling-forms-with-javascript/
//only works when run from console? Hence why we've got to it this funky way with the functions
function fill_time_sheet()
{
  var new_row = document.getElementsByClassName("GGMMTRSPVE")[3].insertRow(3);
  var cell_1 = new_row.insertCell(0);
  cell_1.align = "center";
  
  cell_1.innerHTML = `<input id="shift_1_fill_in" value="Shift 1 @ ${campus_1} Campus" type="button" />`;

  button = document.getElementById("shift_1_fill_in");
  button.addEventListener("click", shift_1_fill_in, false);
  
  if (campus_2 != "")
  {
    var cell_2 = new_row.insertCell(1);
    cell_2.align = "center";
    cell_2.innerHTML = `<input id="shift_2_fill_in" value="Shift 2 @ ${campus_2} Campus" type="button" />`;
    button = document.getElementById("shift_2_fill_in");
    button.addEventListener("click", shift_2_fill_in, false);
  }

  function shift_1_fill_in()
  {
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].value = start_1;
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].value = finish_1;
    document.getElementsByClassName("GGMMTRSNSF GGMMTRSATF")[0].value = `${campus_1} Campus`;
    if (deduct_1 != "")
    {
      document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].value = deduct_1;
    }
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].focus();
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].blur();
    
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].focus();
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].blur();
    
    document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].focus();
    document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].blur();
    //document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_ticketStatus")[0].value = "Completed";
  }

  function shift_2_fill_in()
  {
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].value = start_2;
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].value = finish_2;
    document.getElementsByClassName("GGMMTRSNSF GGMMTRSATF")[0].value = `${campus_2} Campus`;
    if (deduct_2 != "")
    {
      document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].value = deduct_2;
    }
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].focus();
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_startTime")[0].blur();
    
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].focus();
    document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_endTime")[0].blur();
    
    document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].focus();
    document.getElementsByClassName("GGMMTRSDNF GGMMTRSNNF cw_deduct")[0].blur();
    //document.getElementsByClassName("GGMMTRSAGF GGMMTRSLGF cw_ticketStatus")[0].value = "Completed";  
  }
  
}

async function wait_for_time_sheet()
{
  //insists on trying to run shit before it's loaded no matter what we do so we have to resort to actually checking every 0.5s whether it's loaded or not
  var i = 0;
  while (document.getElementsByClassName("GGMMTRSPVE")[3] == undefined) 
  {
    console.log(i);
    i++
    await sleep(500);
  }
  fill_time_sheet();
}

if (window.location.pathname.includes("timeexpensemodule"))
{
  wait_for_time_sheet();
}

//
//Fill in the travel part of the sheet
//
function fill_travel_sheet() 
{
  var new_row = document.getElementsByClassName("GCO3QXIBEDH")[3].insertRow(2);
  var cell_1 = new_row.insertCell(0);
  cell_1.align = "center";

  cell_1.innerHTML = `<input id="travel_fill_in" value="Fill in travel (yee yee)" type="button" />`;

  button = document.getElementById("travel_fill_in");
  button.addEventListener("click", travel_fill_in, false);

  function travel_fill_in()
  {
    document.getElementById("x-auto-29-input").value = travel_start;
    document.getElementById("x-auto-29-input").focus();
    document.getElementById("x-auto-29-input").blur();
    
    document.getElementById("x-auto-30-input").value = travel_finish;
    document.getElementById("x-auto-30-input").focus();
    document.getElementById("x-auto-30-input").blur();
    document.getElementsByClassName("GCO3QXIBCAI GCO3QXIBFAI GCO3QXIBEAI")[0].value = travel_notes;
    //document.getElementsByClassName("GCO3QXIBNBI GCO3QXIBDBI cw_ChargeToTextBox")[0].value = "Cyclone / Travel Between Sites";
    //document.getElementById("x-auto-17-input").value = "Support Engineer";
  }
}

async function wait_for_travel_sheet()
{
  //insists on trying to run shit before it's loaded no matter what we do so we have to resort to actually checking every 0.5s whether it's loaded or not
  var i = 0;
  while (document.getElementsByClassName("gwt-Label mm_label GCO3QXIBNAL detailLabel cw_CwLabel")[0] == undefined) 
  {
    console.log(i);
    i++
    await sleep(500);
  }
  fill_travel_sheet();
}

if (window.location.pathname.includes("ConnectWise.aspx"))
{
  wait_for_travel_sheet();
}

// ==UserScript==
// @name         Special Claims - Task Buttons
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adds Start/End/Calculate/ShowTaskButton to Task page
// @author       Nathan Swarts
// @match        https://intranet.netfor.net/modules.php?name=Tickets&file=editassignment&CallID=*
// @match        https://intranet.netfor.com/modules.php?name=Tickets&file=editassignment&CallID=*
// @icon         https://www.google.com/s2/favicons?domain=netfor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432370/Special%20Claims%20-%20Task%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/432370/Special%20Claims%20-%20Task%20Buttons.meta.js
// ==/UserScript==
'use strict';

let showButtons = document.createElement('button');
showButtons.innerHTML = "Show Task Buttons";
showButtons.style.cssText = "margin-left: 10px;";

var backdateStamping = '<tr> <td colspan = 2 id="determine" style="padding:7px">  <b>Determination:</b><select name="determination" id="determination"> <option>XXX</option><option value="APPROVED">Approved</option> <option value="DENIED">Denied</option> <option value="NEED INFO">Need Info</option> <option value="ILLEGIBLE FORM">Illegible</option> <option value="IMPROPER USE">Improper Use</option> <option value="OTHER">Other</option> <option value="PUA">PUA</option> <option value="INSUFFICIENT KNOWLEDGE">Insufficient Knowledge</option> </select></td></tr><tr><td colspan=2 id="duplicate" style="padding:7px"><b>Duplicate: </b><button id="dupYes" style="margin-left:8px; padding-inline:5px;">Yes</button>  <button id="dupNo" style="margin-left:8px; padding-inline:5px;">No</button> </td></tr> <tr> <td colspan = 2 id="workID" style="padding:7px"><b>WorkdID:</b><button id="workNo" style="margin-left: 5px; padding-inline: 5px;">No WorkId</button> </td></tr>';
var emailTriage = '<tr><td colspan="2"><label for="workType">Work Type: </label><select id="workType" width="130"><option> XXX </option></select></td></tr>';
var orderEntry = '<tr><td colspan="2"><label>Subject Line:</label><input type="text" id="subjectLine"></td></tr><tr><td colspan="2"><label>Recieve Date:</label><input type="text" id="receiveDate"></td></tr><tr><td colspan="2" id="mailbox" style="padding:7px"><b>MailBox:</b><button id="pua" style="margin-left:8px;padding-inline:5px">PUA</button><button id="sc" style="margin-left:8px;padding-inline:5px">SC</button></td></tr>';
var lostVoucher = '<tr><td colspan="2"><label>CLAIMANT ID (IF APPLICABLE):</label><input type="text" id="claimantID"></td></tr><tr><td colspan="2"><label>REASON:</label><input type="text" id="reason"></td></tr><tr><td colspan="2"><label>UPLINK WORK ID:</label><input type="text" id="workID"></td></tr><tr><td colspan="2"><label>VOUCHER STATUS:</label><input type="text" id="voucherStatus"></td></tr><tr><td colspan="2"><label>VOUCHERS AVAILABLE :</label><input type="text" id="vouchersAvailable"></td></tr><tr><td colspan="2"><label>AFFECTED VOUCHER WEEKS:</label><input type="text" id="affectedVoucherWeeks"></td></tr>';
var CopyEmailSearch = '<button id="copyEmailSearch" style="margin-left:8px; padding-inline:5px;"> Copy Email Search </button>';
var puaBackdate = '<tr><td colspan="2"><label>Subject Line:</label><input type="text" id="subjectLine"></td></tr><tr><td colspan="2"><label>Recieve Date:</label><input type="text" id="receiveDate"></td></tr><tr><td colspan="2"><label>CLAIMANT ID (IF APPLICABLE):</label><input type="text" id="claimantID"></td></tr><td colspan="2" id="determine" style="padding:7px"><b>Determination:</b><select name="determination" id="determination"><option>XXX</option><option value="PUA BACKDATE ELIGIBLE">PUA BACKDATE ELIGIBLE</option><option value="ILLEGIBLE">ILLEGIBLE</option><option value="MISSING PUA VOUCHERS">MISSING PUA VOUCHERS</option><option value="PENDING PUA VOUCHERS">PENDING PUA VOUCHERS</option><option value="UNABLE TO BACKDATE PUA">UNABLE TO BACKDATE PUA</option></select></td><tr><td colspan="2"><label>UPLINK WORK ID:</label><input type="text" id="workID"></td></tr>'



showButtons.onclick = function() {
    var tablebody = document.createElement('tbody');
    var url = document.URL;
    var kb = new XMLHttpRequest();
    var array, opt, st, steps;
    if(document.getElementById('WorkTypeID.value').value) {
        document.getElementById('Notes.value').style.width = '650px';
        document.getElementById('Notes.value').style.height = '175px';
        //New Table
        document.querySelectorAll('table.miniform tbody tr td table')[0].style.width = '180px';
        document.querySelectorAll('table.miniform tbody tr td table')[0].append(tablebody);
        if(document.getElementById('WorkTypeID.value').value == "Backdate Processing")
        {
            //Html
            tablebody.innerHTML = backdateStamping;
            //Functions
            document.getElementById('determination').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(DETERMINATION: .*)\n/, 'DETERMINATION: ' + document.getElementById('determination').value + '\n');return false;
            };
            document.getElementById('dupYes').onclick = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(DUPLICATE: .*)\n/, 'DUPLICATE: YES\n');return false;
            };


            document.getElementById('dupNo').onclick = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(DUPLICATE: .*)\n/, 'DUPLICATE: NO\n');return false;
            };


            document.getElementById('workNo').onclick = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(UPLINK WORK ID: .*)\n/, 'UPLINK WORK ID: No WorkId\n');return false;
            };
        }
        else if(document.getElementById('WorkTypeID.value').value == "E-mail Triage")
        {
            //Retrieves KB information and list of determinations for drop down list
            if (url.search(".net/") == -1)
            {
                kb.open("GET", 'https://intranet.netfor.com/modules.php?name=Knowledge&file=article&CompCode=&article_id=40541', true);
            }
            else
            {
                kb.open("GET", 'https://intranet.netfor.net/modules.php?name=Knowledge&file=article&CompCode=&article_id=40541', true);
            }
            kb.send();
            kb.onreadystatechange = function() {
                if (kb.readyState == 4) {
                    kb = new DOMParser().parseFromString(kb.responseText, 'text/html').querySelectorAll('div.content.noprintborder ol')[12].innerHTML;
                    steps = new DOMParser().parseFromString(kb, 'text/html')
                    array = steps.body.textContent.matchAll('work type as \"(.*)\"')
                    for(const e of array)
                    {
                        opt = document.createElement("option");
                        opt.value= e[1];
                        opt.innerHTML = e[1]; // whatever property it has
                        document.getElementById('workType').append(opt)
                    }
                }
            }
            st = document.createElement('table')
            st.align = "center";

            //Html
            tablebody.innerHTML = emailTriage;
            //Functions
            document.getElementById('workType').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(WORK TYPE: .*)\n/, 'WORK TYPE: ' + document.getElementById('workType').value + '\n');
                st.innerHTML = steps.querySelectorAll('span')[document.getElementById("workType").selectedIndex-1].parentElement.parentElement.innerHTML;
                document.getElementById('workType').after(st)
                return false;
            };

        }
        else if(document.getElementById('WorkTypeID.value').value == "Order Entry")
        {
            //Html
            tablebody.innerHTML = orderEntry;
            //Functions
            document.getElementById('subjectLine').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(SUBJECT LINE: .*)\n/, 'SUBJECT LINE: ' + document.getElementById('subjectLine').value + '\n');return false;
            };
            document.getElementById('receiveDate').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(RECEIVED DATE: .*)\n/, 'RECEIVED DATE: ' + document.getElementById('receiveDate').value + '\n');return false;
            };
            document.getElementById('pua').onclick = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(MAILBOX: .*)\n/, 'MAILBOX: PUA\n');return false;
            };
            document.getElementById('sc').onclick = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(MAILBOX: .*)\n/, 'MAILBOX: SPECIAL CLAIMS\n');return false;
            };
        }
        else if(document.getElementById('WorkTypeID.value').value == "Lost Vouchers")
        {
            //Retrieves KB information and list of determinations for drop down list
            if (url.search(".net/") == -1)
            {
                kb.open("GET", 'https://intranet.netfor.com/modules.php?name=Knowledge&file=article&CompCode=&article_id=40756', true);
            }
            else
            {
                kb.open("GET", 'https://intranet.netfor.net/modules.php?name=Knowledge&file=article&CompCode=&article_id=40756', true);
            }
            kb.send();
            kb.onreadystatechange = function() {
                if (kb.readyState == 4) {
                    kb = new DOMParser().parseFromString(kb.responseText, 'text/html').querySelectorAll('div.content.noprintborder ol')[12].innerHTML;
                    steps = new DOMParser().parseFromString(kb, 'text/html')
                    var reasonArray = steps.body.textContent.matchAll('note the QUESTION TYPE as \"(.*)\"')
                    for(const e of reasonArray)
                    {
                        opt = document.createElement("option");
                        opt.value= e[1];
                        opt.innerHTML = e[1]; // whatever property it has
                        document.getElementById('workType').append(opt)
                    }
                }
            }
            st = document.createElement('table')
            st.align = "center";
            //Html
            tablebody.innerHTML = lostVoucher;
            //Functions
            document.getElementById('claimantID').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(CLAIMANT ID \(IF APPLICABLE\):.*)\n/, 'CLAIMANT ID (IF APPLICABLE): ' + document.getElementById('claimantID').value + '\n');return false;
            };
            document.getElementById('reason').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(REASON:.*)\n/, 'REASON: ' + document.getElementById('reason').value + '\n');return false;
            };
            document.getElementById('workID').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(UPLINK WORK ID \(IF APPLICABLE\):.*)\n/, 'UPLINK WORK ID (IF APPLICABLE): ' + document.getElementById('workID').value + '\n');return false;
            };
            document.getElementById('voucherStatus').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(VOUCHER STATUS \(IF APPLICABLE\):.*)\n/, 'VOUCHER STATUS (IF APPLICABLE): ' + document.getElementById('voucherStatus').value + '\n');return false;
            };
            document.getElementById('vouchersAvailable').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(VOUCHERS AVAILABLE \(IF APPLICABLE\):.*)\n/, 'VOUCHERS AVAILABLE (IF APPLICABLE): ' + document.getElementById('vouchersAvailable').value + '\n');return false;
            };
            document.getElementById('affectedVoucherWeeks').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(AFFECTED VOUCHER WEEKS \(IF APPLICABLE\):.*)\n/, 'AFFECTED VOUCHER WEEKS (IF APPLICABLE):  ' + document.getElementById('affectedVoucherWeeks').value + '\n');return false;
            };
        }
        else if(document.getElementById('WorkTypeID.value').value == "PUA Backdate Processing")
        {
            //Html
            tablebody.innerHTML = puaBackdate;
            //Functions
            document.getElementById('subjectLine').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(SUBJECT LINE: .*)\n/, 'SUBJECT LINE: ' + document.getElementById('subjectLine').value + '\n');return false;
            };
            document.getElementById('receiveDate').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(RECEIVED DATE: .*)\n/, 'RECEIVED DATE: ' + document.getElementById('receiveDate').value + '\n');return false;
            };
            document.getElementById('claimantID').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(CLAIMANT ID \(IF APPLICABLE\):.*)\n/, 'CLAIMANT ID (IF APPLICABLE): ' + document.getElementById('claimantID').value + '\n');return false;
            };
            document.getElementById('determination').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(DETERMINATION: .*)\n/, 'DETERMINATION: ' + document.getElementById('determination').value + '\n');return false;
            };
            document.getElementById('workID').onchange = function(){
                document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(UPLINK WORK ID \(IF APPLICABLE\):.*)\n/, 'UPLINK WORK ID (IF APPLICABLE): ' + document.getElementById('workID').value + '\n');return false;
            };
        }
    }
    return false;
}
var CopyEmailSearchButton = document.createElement('button')
CopyEmailSearchButton.innerHTML = "Copy Email Search";
CopyEmailSearchButton.style.cssText = "margin-left: 10px;";
CopyEmailSearchButton.setAttribute("id", "copyEmailSearch");
CopyEmailSearchButton.onclick = function(){
    try {
    let inp = document.createElement('input');
    inp.type = "text";
    inp.value = "from:" + document.querySelectorAll('tbody tr td table tbody tr td')[3].innerText + " received:" + document.getElementById('Task_1').children[2].getElementsByClassName('textArea textAreaInstructions')[0].innerText.match('[0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{4}')[0] + ' subject:"' + document.getElementById('Task_1').children[2].getElementsByClassName('textArea textAreaInstructions')[0].innerText.match('SUBJECT LINE: ?(.*)\n')[1] + '"';
    document.body.append(inp);
    inp.select();
    document.execCommand("Copy");
    document.body.removeChild(inp);
    return false;
    }
    catch {
        console.log("no task");
        return false;
    }
};
//Start Button ----------------------------------------------
let startButton123 = document.createElement('button');
startButton123.innerHTML = "Start Time";
startButton123.style.cssText = "margin-left: 10px;";
startButton123.setAttribute("id", "startbtn");
startButton123.onclick = function(){
    document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(START TIME: .*)\n/, "START TIME: " + formatAMPM(new Date) + '\n');return false;
};
document.getElementById('addnote').after(startButton123);

//End Button ----------------------------------------------
let endButton123 = document.createElement('button');
endButton123.innerHTML = "End Time";
endButton123.style.cssText = "margin-left: 10px;";
endButton123.setAttribute("id", "endbtn");
endButton123.onclick = function(){
    document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(STOP TIME: .*)\n/, "STOP TIME: " + formatAMPM(new Date) + '\n');
    document.getElementById('Notes.value').value = document.getElementById('Notes.value').value.replace(/(TIME WORKED \(MIN\): ?.*)\n/, "TIME WORKED (MIN): " + window.calc(document.getElementById('Notes.value').value.match(/STOP TIME: ?([0-9]?[0-9]:[0-9][0-9]...)/)[1], document.getElementById('Notes.value').value.match(/START TIME: ?([0-9]?[0-9]:[0-9][0-9]...)/)[1]) + "\n");return false;
};
startButton123.after(endButton123);
endButton123.after(showButtons);
showButtons.after(CopyEmailSearchButton);

window.calc = function calculateTimeWorked(end, start) {
    let extra = 0
    if(document.getElementById('WorkTypeID.value').value == 'Order Entry' || document.getElementById('WorkTypeID.value').value == 'E-mail Triage' || document.getElementById('WorkTypeID.value').value == 'Special Claims Order Entry & E-mail Routing'){
        extra = .033
    }
    console.log(start)
    console.log(end)

    end.split(':')[1].split(' ')[1]

    let hrs;
    let mins = end.split(':')[1].split(' ')[0] - start.split(':')[1].split(' ')[0];
    let endhr = parseInt(end.split(':')[0]), starthr = parseInt(start.split(':')[0]);
    if(start.split(':')[1].split(' ')[1] == 'PM' && starthr != 12)
    {
        starthr += 12;
    }
    if(end.split(':')[1].split(' ')[1] == 'PM' && endhr != 12)
    {
        endhr += 12;
    }

    hrs = endhr - starthr;

    console.log(hrs)
    console.log(mins)
	if(mins < 0){
        hrs = hrs - 1
		mins = mins + 60;
    }
	else if(mins < 1 && hrs < 1){
		mins = 1;
    }
    if(hrs > 0){
        console.log(hrs)
        mins = mins + (hrs * 60)
    }
    let hrsworked = (mins/60 + extra).toFixed(2)
    document.getElementById('WorkTime.value').value = hrsworked;
    return mins;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
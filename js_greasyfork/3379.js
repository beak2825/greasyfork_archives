// ==UserScript==
// @name        Allscripts Enhancements
// @namespace   jewelmirror.com
// @author      marcin@jewelmirror.com
// @description Enahancements to Allscript ePrescribe website
// @version     0.4
// @grant       none
// @include     https://eprescribe.allscripts.com/Sig.aspx*
// @include     https://eprescribe.allscripts.com/ScriptPad.aspx*
// @include     https://eprescribe.allscripts.com/ReviewHistory.aspx*
// @downloadURL https://update.greasyfork.org/scripts/3379/Allscripts%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/3379/Allscripts%20Enhancements.meta.js
// ==/UserScript==


// +-----------------------------------------------------------------------------+
// $Author: marcin $
// $Revision: 1.7 $
// +-----------------------------------------------------------------------------+
// Revision history
// 0.1 - Initial release.  Supports filtering of sigs
// 0.2 - Added support for chaning destination in bulk in script pad 
// 0.3 - Review Hisotry - added checkbox to select all meds when reviewing history
// 0.4 - Review History - added checkbox to selected all PBM Reported medications
// +-----------------------------------------------------------------------------+
// Copyright (C) 2014 Marcin Matuszkiewicz <marcin@jewelmirror.com>
//
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
//
// A copy of the GNU General Public License is included along with this program:
// openemr/interface/login/GnuGPL.html
// For more information write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
//
// Author:   Marcin Matuszkiewicz <marcin@jewelmirror.com>
//
// +------------------------------------------------------------------------------+

var pages = {
    sig: "Sig.aspx",
    rxpad: "ScriptPad.aspx",
    reviewhx: "ReviewHistory.aspx"
}

var id_cb_all = 'id_cb_all';


// +------------------------------------------------------------------------------+
// Functions related to filtering sigs
// +------------------------------------------------------------------------------+
function CreateFilter() {
    var sel = document.createElement('select');
    sel.setAttribute('id', 'sigfilter_id');

    var opt;

    for ( i = 0; i < FilterValue.length; i++) {
        opt = document.createElement('option');
        opt.setAttribute('value', FilterValue[i]);
        opt.innerHTML = FilterStr[i];
        sel.appendChild(opt);
    }

    return sel;
}

function Filter() {
    // If SIGs have not been saved yet, save them.  Note that this is going to cause stale sigs if user changes daily frequency.  User should use Save SIGs button to manually change sigs after changing daily frequency
    if (SigValues.length < 1) {
        SaveSIGs();
    }
    var sel = document.getElementById('sigfilter_id');
    var str = sel.options[sel.selectedIndex].text;

    var pattern = new RegExp('.*' + str + '.*');
    //var pattern = /.*PAIN.*/;

    var sel = document.getElementById('ctl00_ContentPlaceHolder1_LstSig');

    var opt = sel.getElementsByTagName('option');

    // Remove all options
    for ( i = opt.length - 1; i >= 0; i--) {
        sel.remove(i);
    }

    for ( i = 0; i < SigValues.length; i++) {
        t = SigStrings[i].match(pattern);

        if (t) {
            var e = document.createElement('option');
            e.setAttribute('value', SigValues[i]);
            e.innerHTML = SigStrings[i];
            sel.appendChild(e);
        }
    }
}

function SaveSIGs() {
    SigValues = [];
    SigStrings = [];

    console.log('Save SIGs');

    var sel = document.getElementById('ctl00_ContentPlaceHolder1_LstSig');
    var opt = sel.getElementsByTagName('option');

    for ( i = 0; i < opt.length; i++) {
        SigValues[i] = opt[i].value;
        SigStrings[i] = opt[i].text;
    }

    console.log(SigStrings);
}

// +------------------------------------------------------------------------------+
// Functions related to prescription pad
// +------------------------------------------------------------------------------+
function GetDestValues()
{
    var DestValues = [];
    
    var sel = document.getElementsByTagName('select');

    for (i = 0; i < sel.length; i++)
    {
        opt = sel[i].getElementsByTagName('option');
        
        if (opt.length && IsValidDestValue(opt[0].value))
        {
            for (k = 0; k < opt.length; k++)
            {
                DestValues.push(opt[k].value);
            }
        }
        return DestValues;
    }   
}

function GetDestStrings()
{
    var DestStrings = [];
    
    var sel = document.getElementsByTagName('select');

    for (i = 0; i < sel.length; i++)
    {
        opt = sel[i].getElementsByTagName('option');
        
        if (opt.length && IsValidDestValue(opt[0].value))
        {
            for (k = 0; k < opt.length; k++)
            {
                DestStrings.push(opt[k].text);
            }
        }
        return DestStrings;
    }   
}

function CreateDestSelection(DestValues, DestStrings)
{
    var select = document.createElement('select');
    select.setAttribute('id', 'selectChangeAll');
    //select.setAttribute('onChange', 'ChangeDestForAllScripts()');
    select.addEventListener("change", ChangeDestForAllScripts, true);
    
    var option;
    
    option = document.createElement('option');
    option.setAttribute('value', 'empty');
    option.setAttribute('disabled', true);
    option.setAttribute('selected', true);
    option.innerHTML = 'Change destiation for all scripts';
    select.appendChild(option);
    
    for (i = 0; i < DestValues.length; i++)
    {
        option = document.createElement('option');
        option.setAttribute('value', DestValues[i]);
        option.innerHTML = DestStrings[i];
        select.appendChild(option);
    }
    
    return select;

}

function GetDestSelections()
{
    var DestSelections = [];
    
    var sel = document.getElementsByTagName('select');

    for (i = 0; i < sel.length; i++)
    {
        opt = sel[i].getElementsByTagName('option');
        
        if (opt.length && IsValidDestValue(opt[0].value))
        {
            DestSelections.push(sel[i]);
        }
    }
    return DestSelections;
}

function IsValidDestValue(value)
{
    if (value == "PHARM" || value == "MOB" || value == "PRINT" || value == "ASSISTANT" || value == "PTSELFREPORTED")
    {
        return true;
    }
    else
    {
        return false;
    } 
}

function ChangeDestForAllScripts()
{
    var myselect = document.getElementById("selectChangeAll");
    
    for (i = 0; i < DestSelections.length; i++)
    {
        DestSelections[i].value = myselect.options[myselect.selectedIndex].value;
    }
}

/*
 * Functions related to reviewing medication history
 */
function ReviewHistory() {
    $('.h4title:eq(1)').after('<tr id="mmsel"><td><div>Select</div><input type="checkbox" id="selall">All</input><input type="checkbox" id="selpbm">PBM History</input></td></tr>');
    $('#selall').bind('change', function() {
        console.log('hello');
        $('tr:.rgRow :checkbox').click();
        $('tr:.rgAltRow :checkbox').click();
    });
    $("#selpbm").bind('change', function() {
        $('td:contains(PBM Reported Rx)').prev().prev().prev().prev().prev().children().click(); 
    });    
}

loc = window.location.href;

if (loc.indexOf(pages['sig']) >= 0) {
    var FilterStr = ["PAIN", "ANXIETY", "INSOMNIA", "AS NEEDED", "NAUSEA", ""];
    var FilterValue = ["PAIN", "ANXIETY", "INSOMNIA", "PRN", "NAUSEA", "NONE"];
    var SigValues = [];
    var SigStrings = [];

    //Resize sig containers
    //var sel = document.getElementById('ctl00_ContentPlaceHolder1_LstLatinSig');
    //sel.setAttribute('size', 10);

    //var sel = document.getElementById('ctl00_ContentPlaceHolder1_LstSig');
    //sel.setAttribute('size', 10);

    //var div = document.getElementById('ctl00_ContentPlaceHolder1_pnlButtons');
    var sigopt = document.getElementById('ctl00_ContentPlaceHolder1_rdgPrefer').parentNode;

    var input = document.createElement('input');
    input.setAttribute('value', 'Save SIGs');
    input.setAttribute('type', 'button');
    input.addEventListener("click", SaveSIGs, true);
    input.className = 'btnstyle';
    sigopt.appendChild(input);

    var input = document.createElement('input');
    input.setAttribute('value', 'Filter');
    input.setAttribute('type', 'button');
    input.addEventListener("click", Filter, true);
    input.className = 'btnstyle';
    sigopt.appendChild(input);

    var sel = CreateFilter();
    sigopt.appendChild(sel);
} else if (loc.indexOf(pages['rxpad']) >= 0) {

    var DestValues = [];
    var DestStrings = [];
    var DestSelections = [];

    DestValues = GetDestValues();
    DestStrings = GetDestStrings();
    DestSelections = GetDestSelections();

    var tab = document.getElementById("ctl00_ContentPlaceHolder1_grdScriptPad_ctl00");
    var last_row = tab.rows[tab.rows.length-1];

    if (!tab) {
        alert("No table");
    }

    var tbody = tab.getElementsByTagName('tbody');
            //var row = tbody[0].insertRow(-1);
    var row = tab.insertRow(-1);
    if (last_row.className == 'rgRow'){
        row.className = 'rgAltRow';    
    }
    else {
        row.class = 'rgRow';    
    }
    
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);

    var selection = CreateDestSelection(DestValues, DestStrings);
    cell3.appendChild(selection);
} else if (loc.indexOf(pages['reviewhx'])) {
    ReviewHistory();
   
}
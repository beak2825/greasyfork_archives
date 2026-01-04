// ==UserScript==
// @name         VTOL Propaganda
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Puts random VTOL propaganda around Bonk
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424905/VTOL%20Propaganda.user.js
// @updateURL https://update.greasyfork.org/scripts/424905/VTOL%20Propaganda.meta.js
// ==/UserScript==


document.getElementById('mapeditor_leftbox_deletebutton').onload = function(){

document.getElementById('newbonklobby_editorbutton').onclick = function(){

document.getElementById('mapeditor_close').onmouseover = function(){

document.getElementById('mapeditor_midbox_explain').innerHTML = '#justiceforVTOL';

};

document.getElementById('mapeditor_leftbox_deletebutton').onmouseover = function(){

document.getElementById('mapeditor_midbox_explain').innerHTML = '#justiceforVTOL';

};
};


document.getElementById('mapeditor_midbox_testbutton').onclick = function(){

document.getElementById('mapeditor_close').onmouseover = function(){

document.getElementById('mapeditor_midbox_explain').innerHTML = '#justiceforVTOL';

};

document.getElementById('mapeditor_leftbox_deletebutton').onmouseover = function(){

document.getElementById('mapeditor_midbox_explain').innerHTML = '#justiceforVTOL';

};
};
};


var VTOLquality = document.createElement('option');
VTOLquality.text = 'VTOL';
VTOLquality.value = 4;

document.getElementById('settings_graphicsquality').appendChild (VTOLquality);


document.getElementById('newswindow_topbar').innerHTML = 'VTOL will be back...';



document.getElementById('classic_mid_customgame').onclick = function(){

let filterbutton = document.getElementById('roomlistfilterbutton');

filterbutton.onmouseover = function(){
filterbutton.innerHTML = 'VTOL PLEASE';
};

filterbutton.onmouseout = function(){
filterbutton.innerHTML = 'FILTER MODES';

}};


document.getElementById('friendsSendWindow_name').placeholder = 'VTOL was a friend';

let minlevelthing = document.getElementById('roomlistcreatewindowminlevel');
minlevelthing.placeholder = 'VTOL';






let VTOLfilter = document.createElement('div');
VTOLfilter.classList.add('roomlistfilterwindow_a');

let VTOLcheck = document.createElement('input');
VTOLcheck.classList.add("roomlistfilterwindowcheckbox");
VTOLcheck.type = 'checkbox';
VTOLcheck.id = 'roomlistfilterwindow_check_vtol';
VTOLcheck.checked = true;

let VTOLname = document.createElement('label');
VTOLname.for = 'roomlistfilterwindow_check_vtol';
VTOLname.classList.add("roomlistfilterwindowlabel");
VTOLname.innerHTML = 'VTOL';

document.getElementById('roomlistfilterwindow').appendChild (VTOLfilter);
VTOLfilter.appendChild (VTOLcheck);
VTOLfilter.appendChild (VTOLname);



let simpfilter = document.createElement('div');
simpfilter.classList.add('roomlistfilterwindow_b');

let simpcheck = document.createElement('input');
simpcheck.classList.add("roomlistfilterwindowcheckbox");
simpcheck.type = 'checkbox';
simpcheck.id = 'roomlistfilterwindow_check_simple';
simpcheck.checked = true;

let simpname = document.createElement('label');
simpname.for = 'roomlistfilterwindow_check_simple';
simpname.classList.add("roomlistfilterwindowlabel");
simpname.innerHTML = 'Simple';

document.getElementById('roomlistfilterwindow').appendChild (simpfilter);
simpfilter.appendChild (simpcheck);
simpfilter.appendChild (simpname);



document.getElementById('ingamecountdown_top').innerHTML = "VTOL will be back in";

document.getElementById("ingamecountdown_text").style.opacity = "0";


//rickrollElement.onclick = function(){window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');};




//NOT WORKING YET//



//let VTOLtrthing = document.createElement('tr');

//let VTOLfriend = document.createElement('td');
//VTOLfriend.classList.add("friends_cell_name");
//VTOLfriend.innerHTML = 'VTOL';


//let VTOLtdthing = document.createElement('td');

//let VTOLfriendbutton = document.createElement('div');
//VTOLfriend.classList.add("friends_request_button");
//VTOLfriend.classList.add("brownButton");
//VTOLfriend.classList.add("brownButton_classic");
//VTOLfriend.classList.add("buttonShadow");
//VTOLfriend.innerHTML = 'REMOVE';
//VTOLfriend.id = 'VTOLfriendbutton';

//document.getElementById('VTOLfriendbuttton').onclick = function(){

//VTOLfriend.innerHTML = 'SURE?';
//};

//let VTOLempty = document.createElement('td');
//VTOLempty.classList.add("friends_empty_cell");

//document.getElementById('friends_offline_table').appendChild(VTOLtrthing);
//VTOLtrthing.appendChild(VTOLfriend);
//VTOLtdthing.appendChild(VTOLempty);
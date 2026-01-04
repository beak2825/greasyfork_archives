// ==UserScript==
// @name Service Now Dark Mode
// @description Dark Mode for Service Now
// @version 0.1.7
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/388434/Service%20Now%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/388434/Service%20Now%20Dark%20Mode.meta.js
// ==/UserScript==

//#333333 charcoal
//#222222 dark grey
//#800D07 burgundy
//#EEEEEE sidebar font color

//choose from dark/vaporwave/digital/custom
var theme = "dark";

if (theme == "dark")
{
  var icon_color = "white";
  var label_color = "#E51B24";
  var text_color = "#EEEEEE";
  var background_color = "#333333";
}
else if (theme == "vaporwave") //I'm not gonna pretend it's any good (or finished)
{
  var icon_color = "white";
  var label_color = "#F7F775";
  var text_color = "blue";
  var background_color = "#F1A9F2";
}
else if (theme == "digital")
{
  var icon_color = "#8FDAF7";
  var label_color = "green";
  var text_color = "#00F800";
  var background_color = "#333333";
}
else if (theme == "custom")
{
  var icon_color = "";
  var label_color = "";
  var text_color = "";
  var background_color = "";
}

//
// JUST FOR TICKETS
// 

//the header 
GM_addStyle(`body { 
             background-color: ${background_color};
}`);

//text color of most of the labels (for an incident)
GM_addStyle(`.label-text {
             color: ${label_color};
}`);

//bunch of the header for REQs
GM_addStyle(`.row {
             background-color: ${background_color};
}`);

//ticket entry name color
GM_addStyle(`.sn-card-component-createdby {
             color: ${label_color};
}`);

//
GM_addStyle(`.data_row {
             background-color: ${background_color};
             color: ${text_color} !important;
}`);

//work note and cust comm cards background
GM_addStyle(`.h-card {
             background-color: ${background_color} !important;
             border: ${label_color};
}`);

//work note and cust comm cards name and date color
GM_addStyle(`.sn-card-component {
             color: ${label_color};
}`);

//work note and cust comm cards text color
GM_addStyle(`.sn-widget-textblock-body {
             color: ${text_color} !important;
}`);

//status change text color
GM_addStyle(`.sn-widget-list-table-cell {
             color: ${text_color} !important;
}`);

//"Customer Communications" label
GM_addStyle(`.control-label {
             color: ${label_color};
}`);

//affected contacts text color
GM_addStyle(`.form-control-static {
             color: ${label_color};
}`);

//bars just under the titles
GM_addStyle(`.annotation {
             background-color: ${background_color};
}`);

GM_addStyle(`.form-group {
             background-color: ${background_color};
}`);

//main body and rest of the labels
GM_addStyle(`.sn-form-stream-init {
             background-color: ${background_color};
             color: ${label_color};
}`);

//cust comms and work notes backgrounds
GM_addStyle(`.comment-box {
             background-color: ${background_color};
}`);

//create cust comms button text
GM_addStyle(`.custom_button {
             color: white;
}`);

//regular icon color and default SN sidebar icons
GM_addStyle(`.icon { }`);

//calendar icon
GM_addStyle(`.icon-calendar { 
             color: ${icon_color};
}`);

//locked icon
GM_addStyle(`.icon-locked { 
             color: ${icon_color};
}`);

//unlocked icon
GM_addStyle(`.icon-unlocked { 
             color: ${icon_color};
}`);

//mail icon
GM_addStyle(`.icon-mail { 
             color: ${icon_color};
}`);

//view icon
GM_addStyle(`.icon-view { 
             color: ${icon_color};
}`);

//X icon
GM_addStyle(`.icon-cross { 
             color: ${icon_color};
}`);

//ref icon
GM_addStyle(`.btn-ref { 
             color: ${icon_color};
}`);

//add user icon
GM_addStyle(`.icon-user-add { 
             color: ${icon_color};
}`);

//add group icon
GM_addStyle(`.icon-user-group { 
             color: ${icon_color};
}`);

//info icon
GM_addStyle(`.icon-info { 
             color: ${icon_color};
}`);

//branch buttons
GM_addStyle(`.reference_decoration {
             color: ${icon_color};
}`);

//knowledge button
GM_addStyle(`.icon-book {
             color: ${icon_color};
}`);

//search button
GM_addStyle(`.icon-search {
             color: ${icon_color};
}`);

//tree icon button
GM_addStyle(`.icon-tree {
             color: ${icon_color};
}`);

//one journal field button
GM_addStyle(`.icon-stream-one-input {
             color: ${icon_color};
}`);

//post button
GM_addStyle(`.activity-submit {
             color: white;
}`);

//attachment info at top
GM_addStyle(`.attachment {
             color: ${label_color} !important;
}`);

//attachment info at top
GM_addStyle(`.content_editable {
             color: ${label_color} !important;
}`);

//
//Highlight job location - doesn't run, unless run manually in a sidebar-less page?
//
var i;
var all_cells = document.getElementsByTagName("td");
for (i = 0; i < all_cells.length; i++)
{
  if ( (i == 9) || (i % 11 == 9))
  {
    //add a class to the job location's cell so we can work with it
    if (all_cells[i].innerText == "OFF-SITE")
    {
      all_cells[i].attributes[0].value += " off_site_highlight";
    }
    else if (all_cells[i].innerText[0] == "A")
    {
      all_cells[i].attributes[0].value += " north_campus_highlight";
    }
    else if (all_cells[i].innerText[0] == "W")
    {
      all_cells[i].attributes[0].value += " city_campus_highlight";
    }
    else if (all_cells[i].innerText[0] == "M")
    {
      all_cells[i].attributes[0].value += " south_campus_highlight";
    }
    
  }
}

//
//For the chat feature
//
GM_addStyle(`.sn-navhub-title {
             background-color: ${background_color} !important;
             color: ${text_color};
}`);
GM_addStyle(`.sn-navhub-content {
             background-color: ${background_color} !important;
}`);
GM_addStyle(`.sn-add-users {
             background-color: ${background_color} !important;
}`);
GM_addStyle(`.sn-feed-push {
             background-color: ${background_color} !important;
}`);
GM_addStyle(`.sn-widget-textblock {
             background-color: ${background_color} !important;
             color: ${text_color};
}`);
GM_addStyle(`.sn-feed-messages {
             background-color: ${background_color} !important;
}`);
GM_addStyle(`.sn-feed-footer-wrapper {
             background-color: ${background_color} !important;
}`);

//sn-connect-floating-wrapper ng-scope ng-isolate-scope ui-droppable ui-droppable-disabled loaded

//related links title (near bottom)
GM_addStyle(`.related_links {
             color: ${label_color};
}`);

//
//END TICKET CSS
//

//
//START Main CSS
//

//title bg color
GM_addStyle(`.navbar-container {
             background-color: ${background_color} !important;
}`);

//ticket queue ticket number, assignment group and job location
GM_addStyle(`.table td a {
             color: ${label_color} !important;
}`);

//
GM_addStyle(`.list-pane-wrapper {
             background-color: ${background_color} !important;
}`);
//
GM_addStyle(`.list-no-records {
             background-color: ${background_color} !important;
}`);

//main row bg color
GM_addStyle(`.data_row {
             background-color: ${background_color} !important;
}`);

//bg color of the left checkbox cells
GM_addStyle(`.col-control {
             background-color: ${background_color} !important;
}`);

//bg color of the left checkbox cells
GM_addStyle(`.vt {
             background-color: ${background_color} !important;
}`);

//
GM_addStyle(`.grid-field {
}`);

//ticket list field titles, assignment group column, job location column
GM_addStyle(`.ng-scope {
             color: ${text_color} !important;
}`);

//table header
GM_addStyle(`.table-header {
             background-color: ${background_color} !important;
}`);

//little menu dropdown
GM_addStyle(`.dropdown-menu {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);

//filter menu
GM_addStyle(`.filter-header {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.filter-toggle-header {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.set {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.filter-footer {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);

GM_addStyle(`.list-bottom {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);

GM_addStyle(`.glide-popup {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);

GM_addStyle(`.popover-title {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);

//
//log in/log out (plus other stuff probably)
//
GM_addStyle(`.list-container {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.list_edit_popover {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
//
//END TICKET QUEUE CSS
//
//
//START KB CSS
//

if (document.location.href.includes("kb_knowledge.do"))
{
  GM_addStyle(`.form-group {
               color: ${text_color} !important;
  }`);

  GM_addStyle(`element.style {
               color: ${text_color} !important;
  }`);
}

//
//END KB CSS
//
//
//START LIVE FEED CSS
//
GM_addStyle(`.message-content {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.message-reply {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.media-body {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.message-like {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`);
GM_addStyle(`.search-panel-wrapper {
             background-color: ${background_color} !important;
             color: ${label_color} !important;
}`); 
//
//END LIVE FEED CSS
//
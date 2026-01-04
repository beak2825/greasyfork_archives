// ==UserScript==
// @name         Talibri Dark Theme
// @namespace    Whatever
// @version      2.1
// @description  Dark Theme - Xmitty
// @author       Xmitty
// @match        https://talibri.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37794/Talibri%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/37794/Talibri%20Dark%20Theme.meta.js
// ==/UserScript==

GM_addStyle ( `
body, .dropdown-menu>li>a, .navbar-nav>li>a, .btn-default, .panel-title, .ui-dialog-title, #combatTrackerDialog, .btn-primary, .panel-heading {
color:#8e8e8e !important;
}

.container-fluid {
background-color:rgb(20, 20, 20) !important;
background-image:none !important
}

.breadcrumb, .panel, .success, .table>tbody>tr.success>td, .navbar-default .navbar-nav>.open>a, .dropdown.open, .jumbotron, .well, .list-group-item, .popover, .ui-dialog,
.dropdown-menu>li>a:hover, .active-skill-dropdown {
background-color:rgb(20, 20, 20) !important;
}

.popover {
 border:1px solid rgb(40, 40, 40) !important;
}

#main-chat-text-area {
background-color:rgb(20, 20, 20) !important;
color:#8e8e8e !important;
}

.alert-success, .btn-default, .col-xs-6, .col-md-10, .dropdown-menu, .panel-success>.panel-heading, .panel-primary>.panel-heading, .panel-info>.panel-heading, .btn-primary, .table-hover>tbody>tr:hover, .popover-title, #skill, .ui-dialog-titlebar,
.modal-content {
background-color:rgb(40, 40, 40) !important;
}

.table-striped>tbody>tr:nth-of-type(odd) {
  background-color:rgb(45, 45, 45) !important;
}

.col-xs-6, #bs-example-navbar-collapse-1, #milestone_item_id {
background-color:rgba(40, 40, 40, 0.0) !important;
}

.panel-heading, .panel-footer, .alert-success {
background-image: linear-gradient(rgb(40, 40, 40), rgb(30, 30, 30) 80%, rgb(20, 20, 20)) !important;
}

.percentage-circle-fg {
fill:rgb(30, 30, 30) !important;
}

.percentage-circle-contents {
filter: invert(40%);
}

#primary_weapon_id-slot, #offhand_weapon_id-slot, #legs_id-slot, #feet_id-slot, #hands_id-slot, #chest_id-slot, #head_id-slot {
background-color:rgb(40, 40, 40) !important;
border-color: rgb(65, 65, 65) !important;
}

.progress, .form-control {
background-color:#999999 !important;
}

.btn-sm, .btn-default, .btn-primary {
  color: #b3b3b3 !important;
  background-image: linear-gradient(rgb(40, 40, 40), rgb(30, 30, 30) 80%, #727272) !important;
  border-color: #999999 !important;
}

.btn-danger, .alert-danger{
  color: #E74C3C !important;
  background-image: linear-gradient(rgb(40, 40, 40), rgb(30, 30, 30) 80%, #9e0000) !important;
  border-color: #cc0000 !important;
}

.fa-star, .fa-star-half-o, .alert-success {
  color: #cc0000 !important;
}

.panel-default, .panel-primary, .panel-heading, .panel-footer, .panel-success, .form-control, .panel-info, .navbar-fixed-bottom, .navbar-fixed-top,
.alert-success {
  border-color: rgb(65, 65, 65) !important;
}

.input-group-addon {
  color: #b3b3b3 !important;
  background-image: linear-gradient(rgb(40, 40, 40), rgb(30, 30, 30) 80%, #4f4e4e) !important;
  border-color: #595959 !important;
}

` );

GM_addStyle ( `

.panel-title {
margin-top: 0 !important;
}

h3 {
margin-top: 10px !important;
}

` );
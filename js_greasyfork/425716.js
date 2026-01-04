// ==UserScript==
// @name          Uniwa eClass Dark-blue on/off
// @description	  Uniwa eClass Dark-blue with on/off button
// @author        cckats
// @include       http://eclass.uniwa.gr/*
// @include       https://eclass.uniwa.gr/*
// @include       http://*.eclass.uniwa.gr/*
// @include       https://*.eclass.uniwa.gr/*
// @run-at        document-body
// @version       1.2.6
// @namespace https://greasyfork.org/users/661487
// @downloadURL https://update.greasyfork.org/scripts/425716/Uniwa%20eClass%20Dark-blue%20onoff.user.js
// @updateURL https://update.greasyfork.org/scripts/425716/Uniwa%20eClass%20Dark-blue%20onoff.meta.js
// ==/UserScript==
(function() {
    window.onload = function(){
        //if(document.getElementsByClassName("nav navbar-nav navbar-right")[0] ==undefined){
document.getElementsByClassName("navbar navbar-default")[0].innerHTML += `<label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
</label>`
       
//cookies get overiten
/*function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}*/
if(localStorage.getItem('darkmode')=="true"){//getCookie("darkmode")=="true"){
        document.getElementsByClassName("switch")[0].children[0].checked = true;
    }
    var swcss = `
/* The switch - the box around the slider */
.switch {
  margin: 6px;
  position: relative;
  display: inline-block;
    width: 70px;
    height: 40px;
float: right;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #b5b5b5;
  -webkit-transition: .4s;
  transition: .4s;
font-family: "font awesome 5 free";
}

.slider:before {
    position: absolute;
    height: 34px;
    width: 34px;
    left: 4px;
    bottom: 3px;
    background-color: #fff;
    -webkit-transition: .4s;
    transition: .4s;
    content: "☀";
    font-size: x-large;
    color: #1c232e;
    text-align: center;
}

input:checked + .slider {
  background-color: #232c3a;
}
input:checked + .slider:before {
    content: "☽";
    font-size: x-large;
    color: #1c232e;
    text-align: center;
    background-color: #4da1e4;

    -webkit-text-stroke: medium!important;
}
input:focus + .slider {
  box-shadow: 0 0 1px#31708f;;
;
}

input:checked + .slider:before {
-webkit-transform: translateX(26px) ;
    -ms-transform: translateX(26px) ;
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
`;
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(swcss);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(swcss);
} else if (typeof addStyle != "undefined") {
	addStyle(swcss);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(swcss));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}

document.getElementsByClassName("switch")[0].addEventListener("click", function(){
    if(document.getElementsByClassName("switch")[0].children[0].checked){
     //document.cookie = "darkmode=true; expires=Thu, 18 Dec 2023 12:00:00 UTC";
        localStorage.setItem('darkmode', true);
        enabledark();
}
    else{
        if(document.getElementById("darkmode") != null){
            document.getElementById("darkmode").remove();
        }
        //document.cookie = "darkmode=false; expires=Thu, 18 Dec 2023 12:00:00 UTC";
        localStorage.setItem('darkmode', false);
    }
});
 };
  function enabledark(){
    var css = [
	"div.login-form h2,",
	"div.login-form .h2 {",
	"    color: #fff;",
	"}",
	"div.login-form {",
	"    background: #232c3a;",
	"}",
	"div.login-form .form-group input {",
	"    border-bottom: 1px solid #428bca;",
	"}",
	".container {",
	"    margin-bottom: 10px;",
	"}",
	".panel-default > .panel-heading,",
	".panel-action-btn-default > .panel-heading {",
	"    color: #fff;",
	"    border-color: #337ab7;",
	"    padding: 10px;",
	"}",
	".add-gutter {",
	"    background-color: #1c232e;",
	"}",
	".panel {",
	"    background-color: #232c3a;",
	"}",
	"body {",
	"    color: #fff;",
	"    background: #232C3A !important;",
	"}",
	"a:hover,",
	"a:focus {",
	"    color: #b2dbff;",
	"}",
	".form-wrapper {",
	"    background-color: #232c3a;",
	"    border: 1px solid #337ab7;",
	"}",
	".form-control {",
	"",
	"    color: #fff;",
	"    background-color: #1c232e;",
	"    border: 1px solid #337ab7;",
	"}",
	"footer.footer {",
	"    background: #1c232e;",
	"    color: #a7a7a7;",
	"    border-top: 1px solid #337ab7;",
	"}",
	"#background-cheat {",
	"    background-color: #1c232e;",
	"}",
	".list-header {",
	"    background-color: #232c3a !important;",
	"}",
	".table-striped > tbody > tr:nth-of-type(odd),",
	".table-default > tbody > tr:nth-of-type(odd) {",
	"    background-color: #232c3a;",
	"}",
	"tr {",
	"    border-color: #337ab7 !important;",
	"}",
	"tbody {",
	"    border-color: #337ab7 !important;",
	"}",
	"table.dataTable tbody tr {",
	"    background-color: #232c3a;",
	"}",
	".table-bordered > thead > tr > th,",
	".table-default > thead > tr > th,",
	".table-bordered > thead > tr > td,",
	".table-default > thead > tr > td,",
	".table-bordered > tbody > tr > th,",
	".table-default > tbody > tr > th,",
	".table-bordered > tbody > tr > td,",
	".table-default > tbody > tr > td,",
	".table-bordered > tfoot > tr > th,",
	".table-default > tfoot > tr > th,",
	".table-bordered > tfoot > tr > td,",
	".table-default > tfoot > tr > td {",
	"    border: 1px solid #ddd;",
	"    border-color: #337ab759;",
	"    border-top-style: solid;",
	"    border-right-style: solid;",
	"    border-bottom-style: solid;",
	"    border-left-style: solid;",
	"}",
	".navbar-default {",
	"    background-image: -webkit-linear-gradient(top, #232c3a 0%, #1c232e 100%);",
	"    background-image: -o-linear-gradient(top, #232c3a 0%, #1c232e 100%);",
	"    background-image: -webkit-gradient(linear, left top, left bottom, from(#1c232e), to(#1c232e));",
	"    background-image: linear-gradient(to bottom, #1c232e 0%, #1c232e 100%);",
	"    -webkit-box-shadow: none;",
	"    box-shadow: none;",
	"}",
	".nav-container {",
	"    border-bottom: 1px solid #337ab759;",
	"}",
	"#header.navbar .navbar-nav > li {",
	"    border-left: 1px solid #337ab759;",
	"}",
	"#leftnav .panel a.list-group-item.active {",
	"    background: #1c232e;",
	"    text-shadow: none;",
	"    color: #a8adad;",
	"}",
	".panel-default,",
	".panel-action-btn-default {",
	"    border-color: #ddd0;",
	"}",
	".course-info-title {",
	"    border-bottom: 1px solid #337ab7;",
	"}",
	"#profile_menu_dropdown > ul > li:nth-child(9) {",
	"    border-top: 1px solid #337ab7 !important;",
	"}",
	".panel-default > .panel-heading,",
	".panel-action-btn-default > .panel-heading {",
	"    background-image: -webkit-linear-gradient(top, #232c3a 0%, #232c3a 100%);",
	"    background-image: -o-linear-gradient(top, #232c3a 0%, #232c3a 100%);",
	"    background-image: -webkit-gradient(linear, left top, left bottom, from(#f5f5f5), to(#e8e8e8));",
	"    background-image: linear-gradient(to bottom, #232c3a 0%, #232c3a 100%);",
	"}",
	".panel-action-btn-default > .panel-heading h3,",
	".panel-action-btn-default > .panel-heading .h3 {",
	"    color: #fff;",
	"}",
	"#tinymce {",
	"    background-color: #232c3a;",
	"}",
	".mce-flow-layout-item.mce-last {",
	"    display: none;",
	"}",
	".course-info-title .h4 {",
	"    color: #fff;",
	"}",
	"#leftnav .panel .list-group {",
	"    margin: 2px 0px 1px 10px;",
	"}",
	".page-subtitle {",
	"    color: #777777;",
	"}",
	"#leftnav .panel a.parent-menu {",
	"    background: none;",
	"}",
	".dataTables_wrapper .dataTables_length,",
	".dataTables_wrapper .dataTables_filter,",
	".dataTables_wrapper .dataTables_info,",
	".dataTables_wrapper .dataTables_processing,",
	".dataTables_wrapper .dataTables_paginate {",
	"    color: #fff;",
	"}",
	"h1.page-title,",
	".h1.page-title {",
	"    color: #fff;",
	"}",
	"ul.tablelist li.list-item {",
	"    background: #232c3a;",
	"    border-bottom: 1px solid #337ab7;",
	"}",
	".panel-footer {",
	"    background-color: #232c3a;",
	"    border-top: 1px solid #337ab7;",
	"}",
	"ul.tablelist li.list-item:hover {",
	"    background: #1c232e;",
	"}",
	".cal-row-fluid:hover {",
	"    background-color: #2e3f59;",
	"}",
	"[class*=\"cal-cell\"]:hover {",
	"    background-color: #1c232e;",
	"}",
	".cal-day-weekend span[data-cal-date] {",
	"    color: red;",
	"}",
	".cal-day-holiday span[data-cal-date] {",
	"    color: #ff00ff;",
	"}",
	".cal-year-box [class*=\"span\"],",
	".cal-month-box [class*=\"cal-cell\"] {",
	"    border-right: 1px solid #337ab759;",
	"}",
	".cal-year-box .row-fluid,",
	".cal-month-box .cal-row-fluid {",
	"    border-bottom: 1px solid #337ab759;",
	"}",
	"span[data-cal-date] {",
	"    opacity: 0.8;",
	"}",
	".cal-day-today span[data-cal-date] {",
	"    color: #00ce00;",
	"}",
	".cal-month-box,",
	".cal-year-box,",
	".cal-week-box {",
	"    border: 1px solid #337ab759;",
	"}",
	".cal-day-today {",
	"    background-color: #2e593259;",
	"}",
	".event-legend {",
	"    color: #9da0a5;",
	"}",
	".btn-default {",
	"    background-color: #1c232e;",
	"    border-color: #337ab759;",
	"    background-image: linear-gradient(to bottom, #232c3a 0%, #1c232e 100%);",
	"    color: #c1c1c1fa;",
	"}",
	".btn-default:hover,",
	".btn-default:focus,",
	".btn-default:active,",
	".btn-default:active:focus,",
	".btn-default.active,",
	"btn-default.active:hover,",
	".btn-default.active:focus {",
	"    background-color: #4da1e4;",
	"    background-position: 0 -40px;",
	"    border-color: #337ab759;",
	"    color: #fff;",
	"}",
	".btn-default.disabled,",
	".btn-default:disabled,",
	".btn-default[disabled] {",
	"    background-color: #1c232e;",
	"    background-image: none;",
	"}",
	".btn-default.disabled:hover,",
	".btn-default.disabled:focus,",
	".btn-default.disabled.focus,",
	".btn-default[disabled]:hover,",
	".btn-default[disabled]:focus,",
	".btn-default[disabled].focus,",
	"fieldset[disabled] .btn-default:hover,",
	"fieldset[disabled] .btn-default:focus,",
	"fieldset[disabled] .btn-default.focus {",
	"    background-color: #2e3f59;",
	"    border-color: #337ab759;",
	"}",
	".dataTables_wrapper .dataTables_paginate .paginate_button.current,",
	".dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {",
	"    color: #fff !important;",
	"    border: 1px solid #337ab759;",
	"    background-color: #fff;",
	"    background-image: linear-gradient(to bottom, #232c3a 0%, #1c232e 100%);",
	"}",
	".dataTables_wrapper .dataTables_paginate .paginate_button:hover {",
	"    color: white !important;",
	"    border: 1px solid #111;",
	"    background-color: #585858;",
	"    background-image: linear-gradient(to bottom, #1c232e 0%, #232c3a 100%);",
	"}",
	".dataTables_wrapper .dataTables_paginate .paginate_button {",
	"    color: #9da0a5 !important;",
	"}",
	"#cal-week-box {",
	"    border: 1px solid #337ab759;",
	"    background-color: #2e3f59;",
	"    text-align: center;",
	"}",
	"#cal-day-tick {",
	"    border: 1px solid #337ab759;",
	"    background-color: #2e3f59;",
	"}",
	".list-group-item {",
	"    background-color: #232c3a;",
	"    border: 1px solid #337ab759;",
	"}",
	".text-muted {",
	"    color: #a0a0a0;",
	"}",
	"select {",
	"    background-color: #232c3a;",
	"    border: 1px solid #337ab759;",
	"}",
	".day-highlight.dh-event-important:hover,",
	".day-highlight.dh-event-important {",
	"    background-color: #1c232e;",
	"}",
	".navbar-nav .open .dropdown-menu {",
	"    background-color: #232c3a;",
	"}",
	".dropdown-menu > li > a {",
	"    color: #9da0a5;",
	"}",
	".fa-unlock:before {",
	"    content: \"\\f09c\";",
	"    color: #a94442;",
	"}",
	".navbar-default .navbar-nav > .open > a,",
	".navbar-default .navbar-nav > .active > a {",
	"    background: #4da1e4;",
	"}",
	"#leftnav {",
	"    overflow-y: hidden;",
	"}",
	".navbar-toggle {",
	"    border-color: #284766 !important;",
	"}",
	".navbar-toggle:hover,",
	".navbar-toggle:focus {",
	"    background-color: #4da1e4 !important;",
	"}",
	".navbar-toggle:hover .fa,",
	".navbar-toggle:focus .fa {",
	"    color: #fff !important;",
	"}",
	"#dropdownMenu1:hover #header.navbar .navbar-nav > li a,",
	"#dropdownMenu1:focus #header.navbar .navbar-nav > li a {",
	"    background: #4da1e4;",
	"    color: white !important;",
	"}",
	"#toggle-sidebar > span {",
	"    color: inherit;",
	"}",
	"#profile_menu_dropdown.dropdown.open #dropdownMenu1 > div {",
	"    color: white;",
	"}",
	"#sidebar-container #sidebar {",
	"    background-color: #1c232e;",
	"    box-shadow: -3px 6px 7px 0px #1a1a1a;",
	"}",
	"#sidebar-container #sidebar .panel-group.outerpanel > .panel {",
	"    background-color: #1c232e;",
	"}",
	"#sidebar-container #sidebar .panel-group.outerpanel .panel-heading {",
	"    background-color: #232c3a;",
	"}",
	"#sidebar-container #sidebar .panel-group.outerpanel .title {",
	"    padding: 3em 0em !important;",
	"}",
	"#sidebar-container #sidebar .panel-group.outerpanel .title:hover {",
	"    -webkit-transition: all 120ms linear;",
	"    -moz-transition: all 120ms linear;",
	"    -o-transition: all 120ms linear;",
	"    -ms-transition: all 120ms linear;",
	"    transition: all 120ms linear;",
	"    background: #4da1e4;",
	"    color: #fff;",
	"}",
	"/*.panel-heading {",
	"    padding: 0px 0px;",
	"}*/",
	"a.toggle-active {",
	"    background-color: #4da1e4 !important;",
	"}",
	"",
	".table > thead > tr > th,",
	".table-default > thead > tr > th,",
	".table > thead > tr > td,",
	".table-default > thead > tr > td,",
	".table > tbody > tr > th,",
	".table-default > tbody > tr > th,",
	".table > tbody > tr > td,",
	".table-default > tbody > tr > td,",
	".table > tfoot > tr > th,",
	".table-default > tfoot > tr > th,",
	".table > tfoot > tr > td,",
	".table-default > tfoot > tr > td {",
	"    border-top: 1px solid #337ab759;",
	"}",
	".profile-content-panel {",
	"    background-color: #1c232e;",
	"}",
	".not_visible {",
	"    color: #9da0a5 !important;",
	"}",
	".img-circle {",
	"    opacity: 1 !important;",
	"}",
	"",
	"",
	"",
	".dataTables_wrapper .dataTables_processing {",
	"    background: none;",
	"    text-shadow: 0px 0px 11px #000;",
	"}",
	"#inbox_table_filter > label > input[type=search] {",
	"    background-color: #1c232e;",
	"    border: 1px solid #337ab7;",
	"    border-radius: 3px;",
	"    height: 30px",
	"}",
	"",
	".nav-tabs > li.active > a,",
	".nav-tabs > li.active > a:hover,",
	".nav-tabs > li.active > a:focus {",
	"    color: #fff;",
	"    background-color: #4da1e4;",
	"    border: 1px solid #337ab7;",
	"}",
	".nav > li > a:hover,",
	".nav > li > a:focus {",
	"    color: #fff;",
	"    background-color: #337ab7;",
	"    border: none;",
	"}",
	".nav-tabs {",
	"    border-bottom: 1px solid #337ab759;",
	"}",
	".table-default.dataTable {",
	"    border-top: 2px solid #337ab759 !important;",
	"}",
	"div.modal-header,",
	"div.modal-footer {",
	"    background-color: #1c232e;",
	"}",
    ".modal-content {",
    "background-color: #1c232e;",
    "}",
    " .modal-header {",
    " border-bottom: 1px solid #337ab7 !important;",
    "} ",
    ".modal-footer {",
    "border-top: 1px solid #337ab7 !important;",
    "}",
	".close {",
	"    color: #fff;",
	"    opacity: .5;",
	"    filter: alpha(opacity=50);",
	"}",
	".close:hover,",
	".close:focus {",
	"    color: #fff;",
	"    opacity: 1;",
	"    filter: alpha(opacity=1);",
	"}",
	".alert-success {",
	"    background-image: linear-gradient(to bottom, #295629 0%, #1c232e 100%);",
	"    color: #b2dba1;",
	"}",
	".alert-warning {",
	"    background-image: linear-gradient(to bottom, #5f593e 0%, #1c232e 100%);",
	"    color: #f5e79e;",
	"}",
	"::-webkit-scrollbar {",
	"    background-color: #11151c;",
	"    color: #bebab3;",
	"}",
	"::-webkit-scrollbar-thumb {",
	"    background-color: #1c232e;",
	"}",
	"::-webkit-scrollbar-thumb:hover {",
	"    background-color: #252f3e;",
	"}",
	"input {",
	"    color: #fff;",
	"}",
	".table > thead > tr > td.active,",
	".table-default > thead > tr > td.active,",
	".table > thead > tr > th.active,",
	".table-default > thead > tr > th.active,",
	".table > thead > tr.active > td,",
	".table-default > thead > tr.active > td,",
	".table > thead > tr.active > th,",
	".table-default > thead > tr.active > th,",
	".table > tbody > tr > td.active,",
	".table-default > tbody > tr > td.active,",
	".table > tbody > tr > th.active,",
	".table-default > tbody > tr > th.active,",
	".table > tbody > tr.active > td,",
	".table-default > tbody > tr.active > td,",
	".table > tbody > tr.active > th,",
	".table-default > tbody > tr.active > th,",
	".table > tfoot > tr > td.active,",
	".table-default > tfoot > tr > td.active,",
	".table > tfoot > tr > th.active,",
	".table-default > tfoot > tr > th.active,",
	".table > tfoot > tr.active > td,",
	".table-default > tfoot > tr.active > td,",
	".table > tfoot > tr.active > th,",
	".table-default > tfoot > tr.active > th {",
	"    background-color: #232c3a;",
	"}",
	".open-category,",
	".open-category:hover {",
	"    color: #fff;",
	"}",
	"table.category-links tr.link-subcategory-title {",
	"    background-color: #232c3a;",
	"}",
	"#scrollToTop span:hover {",
	"    color: #4da1e4;",
	"}",
	".list-header {",
	"    color: #fff !important;",
	"}",
	".not_visible {",
	"    color: #fff !important;",
	"}",
     ".c3 text {  filter: invert(1);  font-size: 12px; font-weight: bold;}",
     ".modal.in .modal-dialog {width: 125vh; max-width: 90vw;}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node1 = document.createElement("style");
    node1.id="darkmode";
	node1.type = "text/css";
	node1.appendChild(document.createTextNode(css));
	var heads1 = document.getElementsByTagName("head");
    if(document.getElementById("darkmode") == null){
	if (heads1.length > 0) {
		heads1[0].appendChild(node1);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node1);
	}
    }
}
}
    if(localStorage.getItem('darkmode')=="true"){//getCookie("darkmode")=="true"){
        enabledark();
        //document.getElementsByClassName("switch")[0].click();
    }




    /// temprary fix for toggle bar not working


    // Actions needed to be done after full DOM elements downloaded
    $(window).load(function ()
    {
        $(".navbar-toggle").on("click", function (e) {
        if ($("#sidebar").hasClass("in")) {
            $("#sidebar").animate(
                    {"right": "-18.5em"}, {duration: 150, easing: "linear",
                start: function () {
                    if (!$("#sidebar").hasClass("in"))
                        $("#sidebar-container").css({"display": "block"});
                },
                complete: function () {
                    $("#toggle-sidebar").toggleClass("toggle-active");
                    if ($("#sidebar").hasClass("in")) {
                        $("#sidebar-container").css({"display": "none"});
                        $("#sidebar").toggleClass("in");
                    }
                }
            });
        }
        if (!$("#leftnav").hasClass("float-menu-in")) {
            $("#leftnav").animate({
                "left": "0"
            }, 150, function () {
                $(this).toggleClass("float-menu-in");
            });
        } else {
            $(".float-menu").animate({
                "left": "-225px"
            }, 150, function () {
                $(this).toggleClass("float-menu-in");
            });
        }
        e.stopPropagation();
    });
    
        var initialHeight;
        var windowHeight = $(window).height();
        var contentHeight = $("#Frame").height();



        $("#innerpanel-container").slimScroll({height: '215px'});
        $("#collapseMessages ul.sidebar-mymessages").slimScroll({height: '215px'});

        // Initialisation of Main Content height
        var margin_offset = 131;
        var initialHeight = ((contentHeight > windowHeight) ? contentHeight : windowHeight) - margin_offset;
        $("#Frame").css({"min-height": initialHeight});
        $("#sidebar").css({"min-height": initialHeight + margin_offset});


        // Right Side toggle menu animation
        $('#toggle-sidebar').click(function () {
            var inOut = $("#sidebar").hasClass("in") ? "-18.5em" : "-2em";

            if ($("#leftnav").hasClass("float-menu-in")) {
                $("#leftnav").animate({
                    "left": "-225"
                }, {duration: 150, start: function () {
                        $(this).removeClass("float-menu-in");
                    }});
            }

            if (!$("#sidebar").hasClass("in")) {
                var courseIDs = [];
                $(".lesson-notifications").each(function () {
                    courseIDs.push($(this).data('id'));
                });
                $.ajax({
                    type: "GET",
                    url: sidebarConfig.messagesLink,
                    dataType: "json",
                    data: {courseIDs: courseIDs},
                    success: function (data) {
                        var objData = data.messages;
                        var $jqObjData = $(objData);
                        var noMsgs = $jqObjData.filter("li.no-messages").length;
                        if (!(noMsgs > 0)) {
                            var numMsgs = $jqObjData.filter("li").length;
                            var numMsgsString = " (" + numMsgs + ") ";
                            $("span.num-msgs").html(numMsgsString);
                        }
                        $("ul.sidebar-mymessages").html(data.messages);
                        $(".lesson-notifications").each(function () {
                            var id = $(this).data('id');
                            if (data.notifications[id]) {
                                $(this).html(data.notifications[id]);
                                $(this).closest('.panel').find('span.lesson-title-caret').removeClass('fa-caret-down').addClass('fa-bell alert-info').attr('rel', 'tooltip').attr('title', data.langNotificationsExist);
                            }
                        });
                        tooltip_init();
                    }
                });
            }

            $("#save_note").on("click", function () {
                var note_title = $("#title-note").val();
                var note_text = $("#text-note").val();

                $(".spinner-div").removeClass("hidden");

                if (note_title === '' || note_text === '') {
                    $(".spinner-div p").text(sidebarConfig.note_fail_messge);
                    $(".spinner-div img").toggleClass("hidden");
                    $(".spinner-div p").toggleClass("hidden");
                    setTimeout(function () {
                        $(".spinner-div").addClass("hidden");
                        $(".spinner-div img").toggleClass("hidden");
                        $(".spinner-div p").toggleClass("hidden");
                    }, 2500);
                } else {
                    note_text = $('<p/>').text(note_text).wrap('<div/>').parent().html();
                    $.ajax({
                        type: "POST",
                        url: sidebarConfig.notesLink,
                        data: {newTitle: note_title, newContent: note_text, refobjgentype: 0, refcourse: 0, refobjtype: 0, refobjid: 0, submitNote: 1},
                        success: function (data) {
                            $(".spinner-div p").text(data);
                            $(".spinner-div img").toggleClass("hidden");
                            $(".spinner-div p").toggleClass("hidden");
                            setTimeout(function () {
                                $(".spinner-div").addClass("hidden");
                                $(".spinner-div img").toggleClass("hidden");
                                $(".spinner-div p").toggleClass("hidden");
                                $("#title-note").val('');
                                $("#text-note").val('');
                            }, 2000);
                        }
                    });
                }
            });

            $("#sidebar").animate(
                    {"right": inOut}, {duration: 150, easing: "linear",
                start: function () {
                    if (!$("#sidebar").hasClass("in"))
                        $("#sidebar-container").css({"display": "block"});
                },
                complete: function () {
                    $("#toggle-sidebar").toggleClass("toggle-active");
                    if ($("#sidebar").hasClass("in")) {
                        $("#sidebar-container").css({"display": "none"});
                    }
                    $("#sidebar").toggleClass("in");
                }
            });
        });

    });
})();

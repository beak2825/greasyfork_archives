// ==UserScript==
// @name       DRStyles
// @namespace  drstyles
// @version    0.1.6
// @date       03-17-2023
// @author     mac9erd
// @description  Additional features for DRS
// @match      https://drs.up.edu.ph/*
// @match      https://drstracer.up.edu.ph/*
// @copyright  mac9erd 2021
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_log
// @license    GPLv3
// @run-at     document-end
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://greasyfork.org/scripts/11549-mousetrapv1-5-3/code/mousetrapv153.js
// @downloadURL https://update.greasyfork.org/scripts/433250/DRStyles.user.js
// @updateURL https://update.greasyfork.org/scripts/433250/DRStyles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //date created - 09-21-2021

    checkSavedSettings();

    var home = String(location).split('/')[3];
	var page = String(location).split('/')[3];
	var docNum = String(location).split('/')[5];
    var releaseNum = String(location).split('/')[6];
    var siteThemesValue = GM_getValue('siteThemes');

    var DRSettings = '<br/><label class="control-label"> DRStyles SETTINGS</label> <p>Additional features for DRS</p><table style="width:20%"><tbody><tr><td>Themes: &nbsp;&nbsp;</td><td> <label> <input type="radio" name="selectThemes" class="rdSiteThemes" id="rdSiteThemesDefault" value="default"> Default &nbsp;</label><label> <input type="radio" name="selectThemes" class="rdSiteThemes" id="rdSiteThemesDark" value="dark"> Dark &nbsp;</label> </td></tr></tbody></table><br/>';

    GM_log(page)
    if (page === "my_settings" || page === "users") {
        $('br').remove();
        $('.form-group').append(DRSettings).insertBefore('.btn-row');
    } else {
        $('br').remove();
        // do something else, if needed
}


    if (page == "release_document") {
            $("form .btn-row button").click(function(){
                GM_log("bttn: clicked!");
           });
     }

    function checkSavedSettings() {
        if (GM_getValue('siteThemes', -5) == -5) GM_setValue('siteThemes', '1');
    }

    function setSavedSettings() {
        if (siteThemesValue == '1') {
            selectID('#rdSiteThemesDark');
            chooseTheme('dark');
        } else selectID('#rdSiteThemesDefault');

    }

    function selectID(id) {
        $(id).attr('checked',true);
    }

    $('.rdSiteThemes').change(function () {
        var val = $("input[name=selectThemes]:checked").val();
        if (val == 'dark') GM_setValue('siteThemes', '1');
        else GM_setValue('siteThemes', '0');
    });

    function chooseTheme(name) {
        if (name == "dark") {
            GM_addStyle("body {background-color: #202124;color: #fff}a {color: #78bcf7;text-decoration: none;}a:hover, a:focus {color: #e9f5ff;}a.list-group-item:hover, button.list-group-item:hover, a.list-group-item:focus, button.list-group-item:focus {color: #fff;text-decoration: none;background-color: #57595e;}.table-hover>tbody>tr:hover {background-color: #414346;}.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td {border: 1px solid #57595e;}.form-control {color: #e1e4ed;background-color: #303134;}.form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {background-color: #707070;}.btn-default {color: #fff;background-color: #83858b;border-color: #ccc;} .panel-body, .panel-default {background: #303134; border-color:#303134;} .panel-default>.panel-heading {background-color: #57595e; border: none;}.list-group-item{background-color: #303134;border: 1px solid #57595e;}a.list-group-item, button.list-group-item {color: #8fb9c6;} .breadcrumb {background-color: #57595e;}.breadcrumb>.active, .up-maroon{color: #fff;}.table-actions thead tr th:last-child {background: #202124;}.table>tbody>tr.warning>td {background-color: #57595e;}.table-hover>tbody>tr.warning:hover>td {background-color: #626772;}.table>tbody>tr.danger>td {background-color: #e1cfcf;color: #d5211b;}.alert-success {color: #ffffff;background-color: #3c763d;border: none!Important;}.alert-danger {color: #fff;background-color: #a94442;border: none;}.alert-warning {color: #fff;background-color: #8a6d3b;border: none;}.modal-header {background-color: #2c2d2f;} .modal-body {background-color: #171819;}.table>thead>tr>td.info, .table>tbody>tr>td.info, .table>tfoot>tr>td.info, .table>thead>tr>th.info, .table>tbody>tr>th.info, .table>tfoot>tr>th.info, .table>thead>tr.info>td, .table>tbody>tr.info>td, .table>tfoot>tr.info>td, .table>thead>tr.info>th, .table>tbody>tr.info>th, .table>tfoot>tr.info>th {background-color: #a8b8c1;}");
        } else {
            //do nothing
        }
    }

    setSavedSettings();
})();
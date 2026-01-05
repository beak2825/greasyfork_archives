// ==UserScript==
// @name         GSSD PWN
// @version      0.3
// @namespace    https://onyx.cf/gssd
// @description  PWN GSSD
// @author       Onyx.CF
// @match        https://portal.gssd.ca/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdn.bootcss.com/tether/1.4.0/js/tether.min.js
// @require      https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26807/GSSD%20PWN.user.js
// @updateURL https://update.greasyfork.org/scripts/26807/GSSD%20PWN.meta.js
// ==/UserScript==

var version = "0.3";

var imgHeight;
var imgWidth;

console.log("Setting things up...");
$("*").css("opacity", 0);
$("head").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" />');
$("head").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.theme.min.css" />');
$("head").append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');

$(window).bind("load", function() {
    $("body").append('<div id="onyxcf"data-toggle="modal" data-target="#onyxcf-modal"></div>');
    $("#onyxcf").css("width", "50px");
    $("#onyxcf").css("height", "50px");
    $("#onyxcf").css("position", "fixed");
    $("#onyxcf").css("bottom", "25px");
    $("#onyxcf").css("right", "50px");
    $("#onyxcf").append("<img src='https://www.onyx.cf/api/grab.php?q=logo&png'></img>");
    $("#onyxcf img").width("100%");
    $("#onyxcf img").height("100%");
    $("#onyxcf img").css("border-radius", "50%");
    $("#onyxcf img").css("box-shadow", "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23), rgba(0,0,0,.1)0 0 0 1px inset");
    $("#onyxcf img").css("cursor", "pointer");
    var img = $(document.getElementById('ctl00_PlaceHolderMain_PictureURLImage'));
    var clear = $(document.getElementById('ctl00_PlaceHolderMain_PictureURLClearImage'));
    var picVal = $(document.getElementById('ctl00$PlaceHolderMain$ProfileEditorEditPictureURL'));
    var ratio = 96 / imgWidth;
    img.css("height", imgHeight * ratio + "px");
    img.css("width", "96px");
    $(document.getElementById('ctl00_PlaceHolderMain_PictureURLClearImage')).before('<input type="button" id="onyx-picurl" value="Use URL" class="ms-buttonheightwidth2" title="Added by Onyx.CF">');
    $("#onyx-picurl").click(function () {
        var url = prompt("Enter the URL:");
        picVal.val(url);
        img.attr("src", url);
        img.css("height", null);
        img.css("width", null);
        var ratio = 96 / imgWidth;
        img.css("height", imgHeight * ratio + "px");
        img.css("width", "96px");
        clear.css("display", null);
    });
    img.attr("title", "Resized by Onyx.CF");
    img.css("border", "rgba(0,0,0,.1) solid 1px");
    $("#ctl00_PlaceHolderMain_ctl00_PlaceHolderMain_ProfileEditorValuePictureURL .ms-profilevalue .ms-textSmall").before('<br />');

    $("body").append('<div class="modal fade" id="onyxcf-modal" tabindex="-1" role="dialog"></div>');
    var modalHTML = "";
    modalHTML += '<div class="modal-dialog" role="document">';
    modalHTML += '<div class="modal-content">';
    modalHTML += '<div class="modal-header">';
    modalHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modalHTML += '<h4 class="modal-title">GSSD PWN // Options</h4>';
    modalHTML += '</div>';
    modalHTML += '<div class="modal-body">';
    modalHTML += 'Version: v' + version;
    modalHTML += '<br />';
    modalHTML += '<a id="onyxcf-opt0" class="btn btn-default" href="javascript:void(0);" role="button">Goto Home</a>';
    modalHTML += '&nbsp;';
    modalHTML += '<a id="onyxcf-opt1" class="btn btn-default" href="javascript:void(0);" role="button">Goto User Options</a>';
    modalHTML += '</div>';
    modalHTML += '</div>';
    modalHTML += '</div>';
    $("#onyxcf-modal").html(modalHTML);
    $("#onyxcf-opt0").click(function () {
        window.location.href = 'https://portal.gssd.ca/';
    });
    $("#onyxcf-opt1").click(function () {
        window.location.href = 'https://portal.gssd.ca/my/_LAYOUTS/15/EditProfile.aspx?ReturnUrl=https://portal.gssd.ca/';
    });
    $("#UserPersona .ms-tableCell").not(".ms-verticalAlignTop").css("display", "none");
    $("*").css("opacity", 1);
    $("#onyxcf-loader").css("opacity", 0);
    console.log("Done.");
});

function findHHandWW() {
    imgHeight = this.height;
    imgWidth = this.width;
    return true;
}
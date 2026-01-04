// ==UserScript==
// @name         V-InfoPlus
// @name:en         V-InfoPlus
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       azro
// @include     *://*.travian.*/*
// @include     *://*.travian.*/*
// @include     *://*.travian.*.*/*
// @include     *://travian.*/index.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @grant  GM_addStyle
// @description script pour avoir les données du compte plus sur chaque page en haut à gauche
// @description:en script to have the data of plus account on every page
// @downloadURL https://update.greasyfork.org/scripts/37264/V-InfoPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/37264/V-InfoPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $$ = jQuery.noConflict();
    //Not on troup pages (conflict when copy/paste for gettertool)
    if (window.location.href.indexOf("dorf3.php?s=5") < 0) {
        infoPlus();
    }
})();


function infoPlus(){
    let $$ = jQuery.noConflict();

    let tete = '';//'<div class="sidebar" id="sideBarPlus"><div  class="sidebarBox   ">	<div class="sidebarBoxInnerBox"><div class="innerBox content ">';
    let queue = '';//"</div></div></div></div>";

    let info = "<div id='tableS0' class='village3 '><table id='overview'><tbody id='bodyS0'></tbody></table></div></div>";
    $$("#background").after(tete + info + queue);

   /*$$("#sideBarPlus").css('width', '200px');
    $$("#sideBarPlus").css('float', 'left');
    $$("#sideBarPlus").css('position', 'absolute');
    $$("#sideBarPlus").css('top', '30px');
    $$("#sideBarPlus").css('left', '5px');
    $$("#sideBarPlus").css('z-index', '1');*/


    $$("#tableS0").css('width', '200px');
    $$("#tableS0").css('float', 'left');
    $$("#tableS0").css('position', 'absolute');
    $$("#tableS0").css('top', '30px');
    $$("#tableS0").css('left', '15px');
    $$("#tableS0").css('z-index', '1');

    let content="";
    let csswhitespace='nowrap';

    $$.get( "/dorf3.php?s=0", { } )
        .done(function( data ) {
        $$(data).find("#overview").find("tr").not(':first').each(function(){

            content = "<tr class='"+$$(this).attr('class')+"'>";
            content += ("<td class='vil fc' style='white-space:"+csswhitespace+"'>"+$$(this).children(".vil.fc").text().trim().slice(0,10)+"</td>");
            content += ("<td class='att' style='white-space:"+csswhitespace+"'>"+$$(this).children(".att").html()+"</td>");
            content += ("<td class='bui' style='white-space:"+csswhitespace+"'>"+$$(this).children(".bui").html()+"</td>");
            content += ("<td class='tro' style='white-space:"+csswhitespace+"'>"+$$(this).children(".tro").html()+"</td>");
            content += ("</tr>");

            $$("#bodyS0").append(content);
        });

    });

}

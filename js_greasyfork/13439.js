// ==UserScript==
// @name         Real List Cleanup Code
// @namespace    Antiga Prime
// @version      1.7
// @description  Cleaning up certain code on the site for easy copy
// @author       Antiga Prime
// @match        http://sef.imapp.com
// @include      http://sef.imapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13439/Real%20List%20Cleanup%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/13439/Real%20List%20Cleanup%20Code.meta.js
// ==/UserScript==

var pathname = window.location.pathname;

var textDiv = "<table class='property myStuff' style='text-align:left; font-size:14px;'><tr><td class='pid'></td><td class='address' ></td><td class='type' ></td><td class='owner'></td><td style='border:1px solid #000;'></td><td></td><td></td><td></td><td></td></tr></table>";
var mls = "<table class='mls myStuff' style='text-align:left; font-size:14px;'></table>";
//    "<div class='text' style='text-align:left;'></div>"

$companies = ["llc", "assn", "bank", "rental", "company", "property", "investments", "corp", "corporation", "invest", "investment", "inc", "real", "estate", "trust", " " + "lp"];

function tableDesign(){
    $('.myStuff').find('tr td').css({'border' : '2px solid #000'});
    $('.myStuff').find('tr td').css({'padding' : '5px'});
//    $('.myStuff').find('tr td').last().append("A Gina le gusta por el chulo").addClass("gina");
//    alert("tumama");
}

function findOwner(){
    var link = $("#reportBoxOwner1");
        $("#reportBoxOwner1").addClass("owner2").attr('id', '');
    $(".owner2 p").clone().appendTo(".owner");
    $('.owner p').each(function () {
        var $lyric = $(this);
        var contents = $(this).contents();
        contents.each(function () {
            $lyric.append($('<div>').html(this));
        });
    });
    if(link.find("a").length){
        $(".owner div:contains('Current Owner')").next().next().next().addClass("propOwner");
    } else {
        $(".owner div:contains('Current Owner')").next().next().addClass("propOwner");
    }
        $('.owner div:not(.propOwner)').remove();
        $(".owner").find("img").remove();
        $('.owner a').contents().unwrap();
        $('.propOwner').contents().unwrap();
        $('.owner p').contents().unwrap();
    var toFind = $('.owner').text();
    toFind = toFind.toLowerCase();
    if($.grep($companies, function(str) { return toFind.indexOf(str) > -1; }).length > 0){
    //    if (str.toLowerCase().indexOf("llc") >= 0) {
        $('.type').append("REO");
    } else if (toFind.toLowerCase().indexOf("trust") >= 0){
        $('.type').append("");
    }else{
        $('.type').append("NATURAL PERSON");
    }
}

function findPid(){
        $(".reportBoxTitle").next().find("a:first-of-type").clone().appendTo( ".pid" );
        $(".pid a:first").nextAll('a').remove();
        $(".pid a").removeAttr( 'href' ).find("img").remove();
    $(".pid a").contents().unwrap();
}

function findAddress(){
    $("#reportBoxProp div:nth-of-type(2)").clone().appendTo(".address");
        $('.address div').each(function () {
            var $lyric = $(this);
            var contents = $(this).contents();
            contents.each(function () {
                $lyric.append($('<div>').html(this));
            });
            //            $('.address2').contents().unwrap();
            //            $('.address2').unwrap();
            /*        $('.address2').each(function() {
            var text = $(this).text();
            $(this).text(text.replace('hello', ' ')); 
        });
        // Remove all the br elements
/*        $('.address p div br').remove();
        $('.address div div:empty').remove();
        $('.address div div:nth-of-type(13), .address div div:nth-of-type(15)').addClass("test");
            $('.address div div:not(.test)').remove();
        */
        });
      $('.address p div br').remove();
        $('.address div div br').remove();
        $('.address div div:empty').remove();
        $('.address div div:contains("Property Address")').next().addClass("address2").next().addClass("address2");
        $('.address div div:not(.address2)').remove();
        $('.address2').append("hello");
        $('.address2').each(function() {
            var text = $(this).text();
            $(this).text(text.replace('hello', ' ')); 
        });
        $('.address2').contents().unwrap();
        $('.address div').contents().unwrap();
}
function findMls(){
    $("#reportBoxOverview > table > tbody > tr:first-child").clone().appendTo(".mls");
    $("#reportBoxOverviewFull .dataTable tr:first-child").clone().appendTo(".mls");
    $(".mls td:contains('Status')").addClass("status").nextAll().remove();
    $(".mls td:contains('MLS')").addClass("mls2");
    $(".mls td").not(".status, .mls2").remove();
    $(".mls b").remove();
    $(".mls td").each(function() {
        var $this = $(this);
        $this.html($this.html().replace(/&nbsp;/g, ''));
        $this.html($this.html().replace("Sale", ''));
    });
//    $(".mls td").css('border', '1px solid #000');
    $(".mls tr td:empty").remove();
    $(".mls tr:empty").remove();
/*    if(".mls tr:gt(1)"){
        $(".mls tr:gt(0)").remove();
    }*/
}

function reoTd(){
    if($(".type").text().toLowerCase().indexOf("reo") >= 0){
        $('td.owner').nextAll().not(".gina").append("N/A");
    }
}

$(document).ready(function(){
    if(pathname.indexOf('ilinks') > -1){
        $("body").prepend($( textDiv ));
//        findPid();
        tableDesign();
        findAddress();
        findOwner();
        $(".pid").remove();
        reoTd();
        $(".gina").css({'margin-left' : '40px'});
    }
    if(pathname.indexOf('property') > -1){
        $("body").prepend($( mls ));
        findMls();
        tableDesign();
    }
    if($('.mls').is(':empty')) {
        $(".mls").remove();
    } 
    if($('.property tr td:first').is(':empty')) {
        $(".property").remove();
    }
});
// ==UserScript==
// @name         One tool to rule them all
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Uno Script per zapparli, uno Script per trupparli, uno Script per segnalarli e nel buio bannarli
// @author       You
// @include      *://*.travian.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376030/One%20tool%20to%20rule%20them%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/376030/One%20tool%20to%20rule%20them%20all.meta.js
// ==/UserScript==

// Farm List Filter
function FLF () {
if($('div.active div.content').hasClass('favorKey99') && $("div#build").hasClass("gid16")){
    $("div.contentNavi").after ( `
<div class="clear"></div>
<div id="FLF_Box" class="filter" style="float:right; margin-bottom: 10px;">
	<div class="boxes boxesColor gray">
		<div class="boxes-tl"></div>
		<div class="boxes-tr"></div>
		<div class="boxes-tc"></div>
		<div class="boxes-ml"></div>
		<div class="boxes-mr"></div>
		<div class="boxes-mc"></div>
		<div class="boxes-bl"></div>
		<div class="boxes-br"></div>
		<div class="boxes-bc"></div>
		<div class="boxes-contents cf">
    	    <div class="filterContainer">
    	        <div id="custom filters">
    	            <button type="button" class="iconFilter" id="green_sword" >
    	                <img id="filter_green" class="iReport iReport1" src="img/x.gif" >
    	            </button>
    	            <button type="button" class="iconFilter" id="orange_sword">
    	               <img id="filter_orange" class="iReport iReport2" src="img/x.gif" >
    	            </button>
    	            <button type="button" class="iconFilter" id="red_sword">
    	               <img id="filter_red" class="iReport iReport3" src="img/x.gif" >
    	            </button>
    	        </div>
    	    </div>
    	    <div class="clear"></div>
    	</div>
	</div>
</div>
<div class="clear"></div>
` );

var i=0;
var j=0;
var k=0;

    $("#green_sword").click (function(){
        if(i==0){
            $(this).css("background-color", "#99c01a");
            i=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            i=0;
        }
        $("td.lastRaid img.iReport1").parentsUntil("tbody").toggle();
    });
    $("#orange_sword").click (function(){
        if(j==0){
            $(this).css("background-color", "#99c01a");
            j=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            j=0;
        }
        $("td.lastRaid img.iReport2").parentsUntil("tbody").toggle();
    });
    $("#red_sword").click (function(){
        if(k==0){
            $(this).css("background-color", "#99c01a");
            k=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            k=0;
        }
        $("td.lastRaid img.iReport3").parentsUntil("tbody").toggle();
    });



}
}
FLF();

// Attack Marker Filter
function AMF () {
if($('div.active div.content').hasClass('favorKey16') && $("div#build").hasClass("gid16")){
    $("div.filterContainer:last").append ( `
    </div><div id="custom filters">
    <button type="button" class="iconFilter" id="green_toggle" >
           <img id="filter_green" src="img/x.gif" class="iReport iReport4">
    </button>
    <button type="button" class="iconFilter" id="orange_toggle">
           <img id="filter_orange" src="img/x.gif" class="iReport iReport5">
    </button>
    <button type="button" class="iconFilter" id="red_toggle">
           <img id="filter_red" src="img/x.gif" class="iReport iReport6">
    </button>
    <button type="button" class="iconFilter" id="gray_toggle">
           <img id="filter_gray" src="img/x.gif" class="iReport iReport7">
    </button>
` );

var i=0;
var j=0;
var k=0;
var l=0;

    $("#green_toggle").click (function(){
        if(i==0){
            $(this).css("background-color", "#99c01a");
            i=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            i=0;
        }
        $("table thead tr td a img.markAttack1").parentsUntil("div.data").toggle();
    });
    $("#orange_toggle").click (function(){
        if(j==0){
            $(this).css("background-color", "#99c01a");
            j=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            j=0;
        }
        $("table thead tr td a img.markAttack2").parentsUntil("div.data").toggle();
    });
    $("#red_toggle").click (function(){
        if(k==0){
            $(this).css("background-color", "#99c01a");
            k=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            k=0;
        }
        $("table thead tr td a img.markAttack3").parentsUntil("div.data").toggle();
    });
    $("#gray_toggle").click (function(){
        if(l==0){
            $(this).css("background-color", "#99c01a");
            l=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            l=0;
        }
        $("table thead tr td a img.markAttack0").parentsUntil("div.data").toggle();
    });


}
}

AMF();

// Toggle Trade Routes
function TRT () {
if($('div.active div.content').hasClass('favorKey0') && $("div#build").hasClass("gid17")){
    $("div#build.gid17 p:last").append ( `
    <p id="TRT_Buttons">
    <button type="submit" id="route_on" class="green prepare">
	<div class="button-container addHoverClick">
		<div class="button-background">
			<div class="buttonStart">
				<div class="buttonEnd">
					<div class="buttonMiddle"></div>
				</div>
			</div>
		</div>
		<div class="button-content">Attiva tutti</div>
	</div>
    </button>
    <button type="submit" id="route_off" class="green prepare">
	<div class="button-container addHoverClick">
		<div class="button-background">
			<div class="buttonStart">
				<div class="buttonEnd">
					<div class="buttonMiddle"></div>
				</div>
			</div>
		</div>
		<div class="button-content">Disattiva tutti</div>
	</div>
    </button>
    </p>
` );

    $("#route_off").click (function(){
        $("input:checked").click();
    });
    $("#route_on").click (function(){
        $("input:checkbox:not(:checked)").click();
    });

}
}
TRT();


//Advanced Artifact Filter
function AAF () {
if(($('div.active div.content').hasClass('favorKey1') || $('div.active div.content').hasClass('favorKey2')) && $("div#build").hasClass("gid27") && !($("div#build div").hasClass("artefact"))){
    $("div#build.gid27").prepend ( `
    <div id="AAF_Buttons">
		<div style="margin: 0; width: 100%;">
	        <div style="width:50%; margin:0; float:left;">
	        	<p style="margin: 3px 0px;">
		            <button type="submit" id="show_all" class="green prepare" style ="margin-right:20px">
			        <div class="button-container addHoverClick">
				        <div class="button-background">
					        <div class="buttonStart">
						        <div class="buttonEnd">
							        <div class="buttonMiddle"></div>
						        </div>
					        </div>
				        </div>
				        <div class="button-content">Mostra tutti</div>
			        </div>
		            </button>
		        </p>
	    	</div>
	        <div style="width:50%; margin:0; float:left; padding-top: 3px;">
	        	<p style="margin: 3px 0px;">
                    <b> Ally: </b>
		            <select id="ally_list" style="margin-left:35px" onchange="">
		                 <option value=" ">    </option>
		            </select>
		        </p>
	        </div>
	        <div style="clear: both;" > </div>
	    </div>
	        <div style="width:50%; margin:0; float:left;">
		        <p style="margin: 3px 0px;">
		            <button type="submit" id="show_filter" class="green prepare">
			        <div class="button-container addHoverClick">
				        <div class="button-background">
					        <div class="buttonStart">
						        <div class="buttonEnd">
							        <div class="buttonMiddle"></div>
						        </div>
					        </div>
				        </div>
				        <div class="button-content">Filtra</div>
			        </div>
		            </button>
		            <b> Da </b><input type="text" id="min_dist" value="0" maxlength="3" max="400" min="0" style="width:25px">
		            <b> a </b><input type="text" id="max_dist" value="400" maxlength="3" max="400" min="0" style="width:25px">
		            <b> caselle</b>
	        	</p>
	    	</div>
	        <div style="width:50%; margin:0; float:left; padding-top: 1px;">
		        <p style="margin: 3px 0px;">
                    <b> Player: </b>
		            <select id="player_list" style="margin-left:20px" onchange="">
		                 <option value=" ">    </option>
		            </select>
		        </p>
	        </div>
	        <div style="clear: both;" > </div>
	    </div>
    </div>
` );

    function getAlly(){

        $("select#ally_list").text("");
        $("select#ally_list").append('<option value=" ">    </option>');

        var ally = $("td.al:visible");
        for (var i = 0; i < ally.length; i++) {
            ally[i] = ally[i].innerText;
        }

        var counts = {};
        jQuery.each(ally, function(key,value) {
            if (!counts.hasOwnProperty(value)) {
                counts[value] = 1;
            } else {
                counts[value]++;
            }
        });

        ally = jQuery.unique( ally );
        ally.sort(function(a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });

        for (var k = 0; k < ally.length; k++) {
            $("select#ally_list").append('<option value="'+ ally[k] + '">' + ally[k] + ' (' + counts[ally[k]] + ') </option>');
        }
    }

    function getPlayers(){

        $("select#player_list").text("");
        $("select#player_list").append('<option value=" ">    </option>');

        var player = $("td.pla:visible");
        for (var j = 0; j < player.length; j++) {
            player[j] = player[j].innerText;
        }

        var pcounts = {};
        jQuery.each(player, function(key,value) {
            if (!pcounts.hasOwnProperty(value)) {
                pcounts[value] = 1;
            } else {
                pcounts[value]++;
            }
        });

        player = jQuery.unique( player );
        player.sort(function(a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
               return 1;
            }
            // names must be equal
            return 0;
        });

        for (var l = 0; l < player.length; l++) {
            $("select#player_list").append('<option value="'+ player[l] + '">' + player[l] + ' (' + pcounts[player[l]] + ') </option>');
        }
    }

    getAlly();
    getPlayers();

    $("#show_all").click (function(){
        $("td.dist").parent().show();
        getAlly();
        getPlayers();
    });

    $("#show_filter").click (function(){
        $("td.dist").each(function(){
            if($( this ).text() <= parseInt($("#min_dist").val()) || $( this ).text() >= parseInt($("#max_dist").val())){
                $( this ).parent().hide();
            }
        });
        getAlly();
        getPlayers();
    });
    $('#min_dist').keypress(function(e){
        if(e.which == 13){
            $("#show_filter").click();
        }
    });
    $('#max_dist').keypress(function(e){
        if(e.which == 13){
            $("#show_filter").click();
        }
    });

    $("select#ally_list").change(function(){
        $("td.al").parent().show();
        $("td.al").each(function(){
            if($( this ).text() != $("select#ally_list option:selected").val() && $("select#ally_list option:selected").val() != " "){
                $( this ).parent().hide();
            }
            else if($("select#ally_list option:selected").val() == " "){
                $("td.al").parent().show();
            }
        });
        getPlayers();
    });

    $("select#player_list").change(function(){
        $("td.pla").parent().show();
        $("td.pla").each(function(){
            if($( this ).text() != $("select#player_list option:selected").val() && $("select#player_list option:selected").val() != " "){
                $( this ).parent().hide();
            }
            else if($("select#player_list option:selected").val() == " "){
                $("td.pla").parent().show();
            }
        });
        getAlly();
    });


    //artifact sorting
    $("thead tr th").each(function(){
	    if( $( this ).text() == ""){
		    $( this ).append('<a class="toggle_arrow">▼</a>');
	    }
        getAlly();
        getPlayers();
    });

    $(".toggle_arrow").click(function(){
        $( this ).parent().parent().parent().parent().children("tbody").toggle();
        if($( this ).text() == "▲"){$( this ).text("▼")}
        else if($( this ).text() == "▼"){$( this ).text("▲")};
        getAlly();
        getPlayers();
    });
}
}
AAF();


//Markeplace Recap
function Marketsum() {
    if($('div.active div.content').hasClass('favorKey5') && $("div#build").hasClass("gid17")){
        $("div.inlineIconList").each(function(){
            var a = $(this)[0].innerText;
            var l = parseInt(a);
            a = a.replace(String(l), "");
            var ar = parseInt(a);
            a = a.replace(String(ar), "");
            var f =  parseInt(a);
            a = a.replace(String(f), "");
            var g =  parseInt(a);
            var t = l + ar + f + g;
            $(this).append('<div class="inlineIcon resources" title=""><i class="r0"></i><span class="tot ">' + t + '</span></div>');
        });

        var gt = $("span.tot");
        var regular_in = /Trasporto da.*/gmi;
        var regular_out = /Trasporto a.*/gmi;
        var tot_in = 0;
        var tot_out = 0;
        for(var i = 0; i < gt.length; i++){
            gt[i] = parseInt(gt[i].innerText)
            if(regular_in.test($("table thead tr td.dorf")[i].innerText)){
                tot_in += gt[i];
            }
            else if((regular_out.test($("table thead tr td.dorf")[i].innerText))){
                tot_out += gt[i];
            }
        }

        if(tot_in != 0 && tot_out != 0){
            $("span#merchantsOnTheWay").append('<hr><table class="traders" cellpadding="1" cellspacing="1"><thead><tr><td style="width:91.6px"><a href="#">Totale</a></td><td><b>Entrate:</b> <img class="r0" src="img/x.gif">  ' + tot_in + '<span style="margin-left:10px"></span><b>Uscite:</b> <img class="r0" src="img/x.gif">  ' + tot_out + '</td></tr></thead></table>');
        }
        else if(tot_in != 0 && tot_out == 0){
            $("span#merchantsOnTheWay").append('<hr><table class="traders" cellpadding="1" cellspacing="1"><thead><tr><td style="width:91.6px"><a href="#">Totale</a></td><td><b>Entrate:</b> <img class="r0" src="img/x.gif">  ' + tot_in + '</td></tr></thead></table>');
        }
        else if(tot_in == 0 && tot_out != 0){
            $("span#merchantsOnTheWay").append('<hr><table class="traders" cellpadding="1" cellspacing="1"><thead><tr><td style="width:91.6px"><a href="#">Totale</a></td><td><b>Uscite:</b> <img class="r0" src="img/x.gif">  ' + tot_out + '</td></tr></thead></table>');
        }
    }
};
Marketsum();


// MORE VILLAGE INFO
function MVI() {
if($('div#content').hasClass('village1')){
    var tot = 0;
    $("table#production tbody tr td.num:not(#tot)").each(function(){
	    var a = $(this)[0].innerText
	    var regex = /(\u202d)(\d+)(\u202C)/gm;
        var m = regex.exec(a);
        tot += parseInt(m[2]);
    })

    var r_tot = tot;
    var legno = $("#l1")[0].innerText.replace(".","")
    var argilla = $("#l2")[0].innerText.replace(".","")
    var ferro = $("#l3")[0].innerText.replace(".","")
    var grano = $("#l4")[0].innerText.replace(".","")
    var myres = parseInt(legno) + parseInt(argilla) + parseInt(ferro) + parseInt(grano);

    var WH = $("#stockBarWarehouse")[0].innerText.replace(".","")
    var GR = $("#stockBarGranary")[0].innerText.replace(".","")
    var regex = /(\u202d)(\d+)(\u202C)/gm;
    var m = regex.exec(WH);
    var regex2 = /(\u202d)(\d+)(\u202C)/gm;
    var n = regex2.exec(GR);
    var c_tot = (parseInt(m[2])*3) + parseInt(n[2]);

    var fill = ((c_tot - myres)/r_tot).toFixed(0) + " h";
    var full = (c_tot/r_tot).toFixed(0) + " h";

    if(myres > 99999 && myres < 999999){
        if((myres % 1000) > 99){ myres = (myres/1000).toFixed(1) + "k";}
        else{ myres = (myres/1000) + "k";}
    }
    else if(myres > 999999){
        if((myres % 1000000) > 99999){ myres = (myres/1000000).toFixed(1) + "kk";}
        else{ myres = (myres/1000) + "kk";}
    }
    if(c_tot > 99999 && c_tot < 999999){
        if((c_tot % 1000) > 99){ c_tot = (c_tot/1000).toFixed(1) + "k";}
        else{ c_tot = (c_tot/1000) + "k";}
    }
    else if(c_tot > 999999){
        if((c_tot % 1000000) > 99999){ c_tot = (c_tot/1000000).toFixed(1) + "kk";}
        else{ c_tot = (c_tot/1000) + "kk";}
    }

$("table#production tbody").append(`
    <tr><td colspan="3"><hr style="margin:0"></td></tr>
    <tr>
    	<td class="ico">
	    	<div>
	    	<img class="r0" src="img/x.gif">
	    	</div>
	    </td>
	    <td class="res">
	    	Prod. Oraria:
	    </td>
	    <td class="num p_o">
        </td>
    </tr>
    <tr>
	    <td class="ico">
	    	<div>
	    	<img class="r0" src="img/x.gif">
	    	</div>
	    </td>
	<td class="res">
	    	Risorse:
	    </td>
	    <td class="num riso">
        </td>
    </tr>
    <tr>
    	<td class="ico">
	    	<div>
	    	<img class="gebIcon g10Icon" src="img/x.gif">
	    	</div>
    	</td>
	    <td class="res">
	    	Capienza:
    	</td>
    	<td class="num capienza">
        </td>
    </tr>
    <tr>
    	<td class="ico">
	    	<div>
	    	<img class="clock" src="img/x.gif">
	    	</div>
    	</td>
	    <td class="res">
	    	Accumulo:
    	</td>
    	<td class="num accumulo">
        </td>
    </tr>
    <tr>
    	<td class="ico">
    		<div>
    		<img class="clock" src="img/x.gif">
    		</div>
	    </td>
	    <td class="res">
    		Rimanente:
    	</td>
    	<td class="num to_fill">
        </td>
    </tr>
    `);

    $(".p_o").text(r_tot);
    $(".capienza").text(c_tot);
    $(".accumulo").text(full);
    $(".to_fill").text(fill);
    $(".riso").text(myres);
    if($('.movements')[0].innerText == "") $('.movements')[0].remove()

}
}
MVI()

if($("#sidebarBeforeContent")){
    $("#sidebarBoxInfobox .sidebarBoxInnerBox .footer").remove(".innerBox.footer")
    $("#sidebarBoxInfobox").addClass("toggleable collapsed")
    $("#sidebarBoxAlliance .sidebarBoxInnerBox .footer").clone().appendTo("#sidebarBoxInfobox .sidebarBoxInnerBox")
    $("#sidebarBoxInfobox .sidebarBoxInnerBox .footer").click(function(){
    	if($("#sidebarBoxInfobox").hasClass("expanded")){
    		$("#sidebarBoxInfobox").addClass("collapsed")
        	$("#sidebarBoxInfobox").removeClass("expanded")
	    }
    	else if($("#sidebarBoxInfobox").hasClass("collapsed")){
	    	$("#sidebarBoxInfobox").addClass("expanded")
        	$("#sidebarBoxInfobox").removeClass("collapsed")
    	}
    })
}
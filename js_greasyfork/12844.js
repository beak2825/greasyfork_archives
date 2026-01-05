// ==UserScript==
// @name         Daniel McKenzie1
// @namespace    http://your.homepage/
// @version      0.2
// @description  Daniel McKenzie - Find Information About Popular YouTube Channels
// @author       saqfish
// @match        https://s3.amazonaws.com/*
// @include      https://www.youtube.com/channel/*
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12844/Daniel%20McKenzie1.user.js
// @updateURL https://update.greasyfork.org/scripts/12844/Daniel%20McKenzie1.meta.js
// ==/UserScript==
if (window.location.toString().toLowerCase().indexOf("https://s3.amazonaws.com/") != -1){
    var youtube_src = $('#DataCollection > div > div > div.panel-body > table > tbody > tr:nth-child(2) > td:nth-child(2) > span').text();
    var new_html = '<a href='+youtube_src+'>'+youtube_src+'</a>';
    $('#DataCollection > div > div > div.panel-body > table > tbody > tr:nth-child(2) > td:nth-child(2) > span').html(new_html);
    window.open(youtube_src);
    var ageBox = $('#DataCollection > div > div > div.panel-body > div:nth-child(11) > span > input');
    var raceBox = $('#DataCollection > div > div > div.panel-body > div:nth-child(12) > span > input');
    var sexBox = $('#DataCollection > div > div > div.panel-body > div:nth-child(10) > span > input');
    window.addEventListener('message',function(event) {
        console.log(event.data);
        var a = event.data;
        if(a.A.substring(0,2) === "TA"){
            console.log(a.A.substring(2));
            switch(a.A.substring(2)) {
                case "1":
                    ageBox.val("1");
                    break;
                case "2":
                    ageBox.val("2");
                    break;
                case "3":
                    ageBox.val("3");
                    break;
                case "4":
                    ageBox.val("4");
                    break;
                case "5":
                    ageBox.val("5");
                    break;
                case "6":
                    ageBox.val("6");
                    break;
            }

        }
        if(a.A.substring(0,2) === "TC"){
            console.log(a.A.substring(2));
            switch(a.A.substring(2)) {
                case "1":
                    sexBox.val("M");
                    break;
                case "2":
                    sexBox.val("F");
                    break;
                case "3":
                    sexBox.val("C");
                    break;
                case "4":
                    sexBox.val("NW");
                    break;
                case "5":
                    sexBox.val("LC");
                    break;
           
            }

        }
       if(a.A.substring(0,2) === "TE"){
            console.log(a.A.substring(2));
            switch(a.A.substring(2)) {
                case "1":
                    raceBox.val("B");
                    break;
                case "2":
                    raceBox.val("L");
                    break;
                case "3":
                    raceBox.val("A");
                    break;
                case "4":
                    raceBox.val("W");
                    break;
                case "5":
                    raceBox.val("O");

                    break;
            }

        }
        if(a.A === "submit"){
            $('#submitButton').click();
        }
    },false);
}

if (window.location.toString().toLowerCase().indexOf("https://www.youtube.com/channel") != -1){

    var table = '<table style="display:inline-block"> 	<thead> 	<tr> 		<th>Age(yrs)</th> 	</tr> 	</thead> 	<tbody> 	<tr> 		 		<td id="TA1">&nbsp;13 - 21</td> 	</tr> 	<tr> 		<td id="TA2">&nbsp;22 - 34</td> 	</tr> 	<tr> 		<td id="TA3">&nbsp;35 - 45</td> 	</tr> 	<tr> 		<td id="TA4">&nbsp;46 - 65</td> 	</tr> 	<tr> 		<td id="TA5">&nbsp;65+</td> 	</tr> 	<tr> 		<td id="TA6">&nbsp;Dunno</td> 	</tr> 	<tbody> </table> <table style="display:inline-block"> 	<thead> 	<tr> 		<th>Creator</th> 	</tr> 	</thead> 	<tbody> 	<tr> 		<td id="TC1">&nbsp;Male</td> 	</tr> 	<tr> 		<td id="TC2">&nbsp;Female</td> 	</tr> 	<tr> 		<td id="TC3">&nbsp;Couple</td> 	</tr> 	<tr> 		<td id="TC4">&nbsp;Network</td> 	</tr> 	<tr> 		<td id="TC5">&nbsp;Company</td> 	</tr> 	<tbody> </table> <table style="display:inline-block"> 	<thead> 	<tr> 	 		<th>Ethnicity</th> 	</tr> 	</thead> 	<tbody> 	<tr> 		<td id="TE1">&nbsp;Black</td> 	</tr> 	<tr> 		<td id="TE2">&nbsp;Latino</td> 	</tr> 	<tr> 		<td id="TE3">&nbsp;Asian</td> 	</tr> 	<tr> 		<td id="TE4">&nbsp;White</td> 	</tr> 	<tr> 		<td id="TE5">&nbsp;Other</td> 	</tr> 	<tbody> </table><table style="display:inline-block"> 	<thead> 	 <tr>     <td><font size="7">---------></td>   </tr> 	</thead> </table><table cellpadding="10" style="display:inline-block"> 	<thead> 	 <tr id="sub">     <td><font color="red">SUBMIT!</td>   </tr> 	</thead> </table>';
    $('#channel-subheader').append(table);
    $('#sub').css("background-color","black");
    $('#sub').css("padding","15px");
   
    var f = "";
    //Start Creator stuffs
    $("td[id^='TC']").on("click", function() {
        if($(this).index() == 0){
            $("td[id^='TC']").css("background-color", "#FFFFFF")
            $(this).css("background-color", "#99FF66");
            f = this.id;
            sendit(f);
        }
    });
    $("td[id^='TA']").on("click", function() {
        if($(this).index() == 0){
            $("td[id^='TA']").css("background-color", "#FFFFFF")
            $(this).css("background-color", "#99FF66");
            f = this.id;
            sendit(f);
        }
    });


    $("td[id^='TE']").click(function(){
        if($(this).index() == 0){
            $("td[id^='TE']").css("background-color", "#FFFFFF")
            $(this).css("background-color", "#99FF86");
            f = this.id;
            sendit(f);
        }
    });
    $("#sub").click(function(){
            sendit("submit");
            window.close();
    });

}

function sendit(f){
    window.opener.postMessage({A: f},'*'); 
}
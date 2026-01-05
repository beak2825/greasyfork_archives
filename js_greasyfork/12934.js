// ==UserScript==
// @name         Crowd Task 2
// @namespace    http://your.homepage/
// @version      0.1
// @description  Crowd Task - Is this the correct company industry?
// @author       saqfish
// @match        https://www.mturk.com/mturk/accept?*
// @include        *
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12934/Crowd%20Task%202.user.js
// @updateURL https://update.greasyfork.org/scripts/12934/Crowd%20Task%202.meta.js
// ==/UserScript==
var pop = false;
var site = $('#hit-wrapper > div.question-wrapper > div.question-content-wrapper > ul > li:nth-child(1) > a').text();
var name = $('#hit-wrapper > div.question-wrapper > div.question-content-wrapper > ul > li:nth-child(2)').text();
var industry = $('#hit-wrapper > div.question-wrapper > div.question-content-wrapper > ul > li:nth-child(3)').text();
var words = name + " " + industry;
console.log(words);


if (window.location.toString().indexOf('mturk') != -1){
    var gf= window.open(site,words);
    window.addEventListener('message',function(event) {
        console.log(event.data);
        a = event.data; 
        console.log( $('input#Answer_1').get(4));

        if(a.A == "AP1"){$('input#Answer_1:eq(0)').attr('checked', 'checked');}
        if(a.A == "AP2"){$('input#Answer_1:eq(1)').attr('checked', 'checked');}
        if(a.A == "AP3"){$('input#Answer_1:eq(2)').attr('checked', 'checked');}
        if(a.A == "submit"){$("input[name='/submit']").click(); }

    },false);
}else{
    //window.opener.postMessage({A: "finance", B: test, C: add},'*'); 
    $(document).ready(function() {
        var htmll = '<table> 	<caption id="cap1">'+window.name+'</caption> 	<thead> 	<tr> </tr> 	</thead> 	<tbody> 	<tr> 		<td id="AP1">Correct</td><td>-------</td> 		<td id="AP2">Incorrect</td> <td>-------</td>		<td id="AP3">Inactive URL</td> 	</tr> 	</table><table><tbody><tr id="w" align="center">-----------------------------------------------------</tr><td id="sub" colspan="5" align="center">SUBMIT</td></tbody></table>';
        console.log(window);
        var span = document.createElement('div');
        span.innerHTML = htmll;
        span.className = 'divie';
        span.style.backgroundColor = "white";
        document.body.insertBefore(span, document.body.firstChild);

        $("td[id^='AP']").on("click", function(e) {
            console.log(e.target.id);


            $("td[id^='AP']").css("background-color", "#FFFFFF");
            $('#'+e.target.id).css("background-color", "#99FF66");
            f = this.id;
            window.opener.postMessage({A: f},'*'); 

        });
        $("#sub").on("click", function(e) {
            window.opener.postMessage({A: "submit"},'*');
            window.close();
        });
        $("td[id^='AP']").css("border", "5px solid black");

        $("#cap1").css("font-size", "large");
        $("#cap1").css("border", "5px solid black");
        $("#sub").css("border", "5px solid black");
        $("#sub").css("background-color", "black");
        $("#sub").css("color", "red");
        $("td[id^='AP']").css("background-color", "#FFFFFF");
        $("td[id^='AP']").css("font-weight", "bold");
        $("td[id^='AP']").css("color", "black");
        $("#cap1").css("background-color", "#FFFFFF");
        $("#cap1']").css("color", "black");
        
    });
     $('body').keyup(function(e){
            if(e.keyCode === 27){
                window.opener.postMessage({A: "submit"},'*');
                window.close();
            }
         if(e.keyCode === 97){
                $("#AP1").click();
            }
         if(e.keyCode === 98){
                $("#AP2").click();
            }
         if(e.keyCode === 99){
                $("#AP3").click();
            }
        });


}
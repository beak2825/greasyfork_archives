// ==UserScript==
// @name         Allen Drop Downs (NFL)
// @author       Tehapollo
// @version      1.5
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Creates buttons to generate questions
// @downloadURL https://update.greasyfork.org/scripts/375027/Allen%20Drop%20Downs%20%28NFL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375027/Allen%20Drop%20Downs%20%28NFL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $(document).keydown(function (e) {
        if(e.shiftKey && e.keyCode == 49){
            //

     document.execCommand("copy")
     navigator.clipboard.readText().then(clipText =>
     document.getElementById('xfield').value= clipText);
        }
    else if (e.shiftKey && e.keyCode == 50){
     document.execCommand("copy")
     navigator.clipboard.readText().then(clipText =>
     document.getElementById('yfield').value= clipText);
    }
        else if (e.shiftKey && e.keyCode == 51){
     document.execCommand("copy")
     navigator.clipboard.readText().then(clipText =>
     document.getElementById('numberfield').value= clipText);
        }
        else if (e.shiftKey && e.keyCode == 52){
            document.getElementById("value").value="23";
        }
    });

  $(document).ready(function(){





     var hide_stuff = setInterval(function(){ Please_Hide(); }, 250);
     function Please_Hide(){
         if ( $('h2:contains(Complex question answering with high-Level reasoning and inference)').length ){
         document.getElementById('collapse_link').click()
         $('textarea#feedback').append('<input type="hidden" id="xfield" value="" />');
         $('textarea#feedback').append('<input type="hidden" id="yfield" value="" />');
         $('textarea#feedback').append('<input type="hidden" id="numberfield" value="" />');
         $('<select />')
         .attr('name', 'Short/Long Questions')
         .attr('style', 'width:115px')
         .attr('id', 'SLQS')
         .append('<option value="Short">Shorter/Longer</option>',
            '<option value="SFG">How many yards was the shortest field goal?</option>',
            '<option value="STP">How many yards was the shortest touchdown pass?</option>',
            '<option value="STR">How many yards was the shortest touchdown run?</option>',
            '<option value="XSYK">How many field goals shorter than X did Y kick?</option>',
            '<option value="XSYT">How many touchdown passes shorter than X did Y throw?</option>',
            '<option value="LFG">How many yards was the longest field goal?</option>',
            '<option value="LTP">How many yards was the longest touchdown pass?</option>',
            '<option value="LTR">How many yards was the longest touchdown run?</option>',
            '<option value="XLYK">How many field goals longer than X did Y kick?</option>',
            '<option value="XLYT">How many touchdown passes longer than X did Y throw?</option>')
         .insertBefore('div.question');

          $('<select />')
         .attr('name', 'First/Last Questions')
         .attr('style', 'width:80px')
         .attr('id', 'FLQS')
         .append('<option value="FLQ">First/Last</option>',
            '<option value="FTD">Which player scored the first touchdown of the game?</option>',
            '<option value="FFG">Which player scored the first field goal of the game?</option>',
            '<option value="FTP">Which player threw the first touchdown pass of the game?</option>',
            '<option value="LATD">Which player scored the last touchdown of the game?</option>',
            '<option value="LAFG">Which player scored the last field goal of the game?</option>',
            '<option value="LATP">Which player threw the last touchdown pass of the game?</option>')
         .insertAfter('select#SLQS');

          $('<select />')
         .attr('name', 'Total/Points Questions')
         .attr('style', 'width:100px')
         .attr('id', 'TPQS')
         .append('<option value="TPQ">Total/Points</option>',
            '<option value="XWB">How many points did the X win by?</option>',
            '<option value="XLB">How many points did the X lose by?</option>',
            '<option value="HPT">How many total points were score by the end of the game?</option>',
            '<option value="TXT">How many total yards did X throw for touchdowns?</option>',
            '<option value="TXK">How many total field goal yards did X kick?</option>')
         .insertAfter('select#FLQS');

          $('<select />')
         .attr('name', 'First Quarter Questions')
         .attr('style', 'width:100px')
         .attr('id', '1QQS')
         .append('<option value="1QQ">First Quarter</option>',
            '<option value="1QFG">How many field goals did X score in the first quarter?</option>',
            '<option value="1QTD">How many touchdowns did X score in the first quarter?</option>',
            '<option value="1QTP">How many touchdown passes did X throw in the first quarter?</option>',
            '<option value="1QPL">How many points did the X lead with in the first quarter?</option>',
            '<option value="1QPT">How many points did the X trail by in the first quarter?</option>',
            '<option value="1MSF">Which players scored field goals in the first quarter?</option>',
            '<option value="1MSR">Which players made touchdown runs in the first quarter?</option>',
            '<option value="1MSP">Which players threw touchdown passes in the first quarter?</option>',
            '<option value="1QTS">How many total points were scored in the first quarter?</option>')
         .insertAfter('select#TPQS');

           $('<select />')
         .attr('name', 'Second Quarter Questions')
         .attr('style', 'width:125px')
         .attr('id', '2QQS')
         .append('<option value="2QQ">Second Quarter</option>',
            '<option value="2QFG">How many field goals did X score in the second quarter?</option>',
            '<option value="2QTD">How many touchdowns did X score in the second quarter?</option>',
            '<option value="2QTP">How many touchdown passes did X throw in the second quarter?</option>',
            '<option value="2QPL">How many points did the X lead with in the second quarter?</option>',
            '<option value="2QPT">How many points did the X trail by in the second quarter?</option>',
            '<option value="2MSF">Which players scored field goals in the second quarter?</option>',
            '<option value="2MSR">Which players made touchdown runs in the second quarter?</option>',
            '<option value="2MSP">Which players threw touchdown passes in the second quarter?</option>',
            '<option value="2QTS">How many total points were scored in the second quarter?</option>')
         .insertAfter('select#1QQS');

          $('<select />')
         .attr('name', 'Third Quarter Questions')
         .attr('style', 'width:105px')
         .attr('id', '3QQS')
         .append('<option value="3QQ">Third Quarter</option>',
            '<option value="3QFG">How many field goals did X score in the third quarter?</option>',
            '<option value="3QTD">How many touchdowns did X score in the third quarter?</option>',
            '<option value="3QTP">How many touchdown passes did X throw in the third quarter?</option>',
            '<option value="3QPL">How many points did the X lead with in the third quarter?</option>',
            '<option value="3QPT">How many points did the X trail by in the third quarter?</option>',
            '<option value="3MSF">Which players scored field goals in the third quarter?</option>',
            '<option value="3MSR">Which players made touchdown runs in the third quarter?</option>',
            '<option value="3MSP">Which players threw touchdown passes in the third quarter?</option>',
            '<option value="3QTS">How many total points were scored in the third quarter?</option>')
         .insertAfter('select#2QQS');

           $('<select />')
         .attr('name', 'Fourth Quarter Questions')
         .attr('style', 'width:112px')
         .attr('id', '4QQS')
         .append('<option value="4QQ">Fourth Quarter</option>',
            '<option value="4QFG">How many field goals did X score in the fourth quarter?</option>',
            '<option value="4QTD">How many touchdowns did X score in the fourth quarter?</option>',
            '<option value="4QTP">How many touchdown passes did X throw in the fourth quarter?</option>',
            '<option value="4QPL">How many points did the X lead with in the fourth quarter?</option>',
            '<option value="4QPT">How many points did the X trail by in the fourth quarter?</option>',
            '<option value="4MSF">Which players scored field goals in the fourth quarter?</option>',
            '<option value="4MSR">Which players made touchdown runs in the fourth quarter?</option>',
            '<option value="4MSP">Which players threw touchdown passes in the fourth quarter?</option>',
            '<option value="4QTS">How many total points were scored in the fourth quarter?</option>')
         .insertAfter('select#3QQS');

           $('<select />')
         .attr('name', 'MISC Questions')
         .attr('style', 'width:55px')
         .attr('id', 'MQS')
         .append('<option value="MQQ">Misc</option>',
            '<option value="MSFG">How many yards shorter was X\'s second field goal compared to his first?</option>',
            '<option value="MSTP">How many yards shorter was X\'s second touchdown pass compared to his first?</option>',
            '<option value="MSTR">How many yards shorter was X\'s second touchdown run compared to his first?</option>',
            '<option value="MLFG">How many yards longer was X\'s second field goal compared to his first?</option>',
            '<option value="MLTP">How many yards longer was X\'s second touchdown pass compared to his first?</option>',
            '<option value="MLTR">How many yards longer was X\'s second touchdown run compared to his first?</option>',
            '<option value="MFXY">Which player scored more field goals, X or Y?</option>',
            '<option value="MTXY">Which player scored more touchdowns, X or Y?</option>',
            '<option value="MPXY">Which player threw more touchdown passes, X or Y?</option>',
            '<option value="MLP">How many points did X lead with by Halftime?</option>',
            '<option value="MTP">How many points did X trail by Halftime?</option>',
            '<option value="MSHF">Which players scored field goals by halftime?</option>',
            '<option value="MSHR">Which players made touchdown runs by halftime?</option>',
            '<option value="MSHP">Which players threw touchdown passes by halftime?</option>',
            '<option value="MFGL">Which player kicked the longest field goal?</option>',
            '<option value="MFGS">Which player kicked the shortest field goal?</option>',
            '<option value="MTRL">Which player had the longest touchdown run?</option>',
            '<option value="MTRS">Which player had the shortest touchdown run?</option>',
            '<option value="MTPL">Which player threw the longest touchdown pass?</option>',
            '<option value="MTPS">Which player threw the shortest touchdown pass?</option>',
            '<option value="MTS">How many total points were scored by Halftime?</option>' )
         .insertAfter('div.question');

             $('<select />')
             .attr('name', 'Multi Spans')
             .attr ('style', 'width:55px')
             .attr ('id', 'MSQ')
             .append ('<option value="MQQS">Multi Span</option>',
                '<option value="MSTS">Which players scored touchdowns shorter than X yards?</option>',
                '<option value="MSTL">Which players scored touchdowns longer than X yards?</option>',
                '<option value="MSTPS">Which players had touchdown passes shorter than X yards?</option>',
                '<option value="MSTPL">Which players had touchdown passes longer than X yards?</option>',
                '<option value="MSFGS">Which players scored field goals shorter than X yards?</option>',
                '<option value="MSFGL">Which players scored field goals longer than X yards?</option>',
                '<option value="MSFGX">Which field goals did X make?</option>',
                '<option value="MSTRX">Which touchdown runs did X make?</option>',
                '<option value="MSTPX">Which touchdown passes did X make?</option>',
                '<option value="MST2F">What are the top two longest field goals made?</option>',
                '<option value="MSTSF">What are the two shortest field goals made?</option>',
                '<option value="MST2R">What are the top two longest touchdown runs made?</option>',
                '<option value="MSTSR">What are the two shortest touchdown runs made?</option>',
                '<option value="MST2P">What are the top two longest touchdown passes made?</option>',
                '<option value="MSTSP">What are the two shortest touchdown passes made?</option>',
                '<option value="MSFGL">Which players made field goals longer than X yards?</option>',
                '<option value="MSFGS">Which players made field goals shorter than X yards?</option>',
                '<option value="MSTRL">Which players made touchdown runs longer than X yards?</option>',
                '<option value="MSTRS">Which players made touchdown runs shorter than X yards?</option>',
                '<option value="MSTPL">Which players made touchdown passes longer than X yards?</option>',
                '<option value="MSTPS">Which players made touchdown passes shorter than X yards?</option>')
                .insertAfter('select#MQS')


                //Shorter Longer Drop Down//
          $('select#SLQS').on('change', function() {
             var num = document.getElementById('numberfield').value;
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
          if ( $('select#SLQS').val() == 'SFG' ){
             document.getElementById("input-question").value="How many yards was the shortest field goal?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
}
          else if ($('select#SLQS').val() == 'STP' ){
             document.getElementById("input-question").value="How many yards was the shortest touchdown pass?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
          }
             else if ($('select#SLQS').val() == 'STR' ){
             document.getElementById("input-question").value="How many yards was the shortest touchdown run?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
          }
             else if ($('select#SLQS').val() == 'XSYK' ){
             document.getElementById("input-question").value="How many field goals shorter than"+' '+x+' '+"yards"+' '+"did"+' '+y+' '+"kick?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#SLQS").val("Short").change();
          }

             else if ($('select#SLQS').val() == 'XSYT' ){
             document.getElementById("input-question").value="How many touchdown passes shorter than"+' '+x+' '+"yards"+' '+"did"+' '+y+' '+"throw?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#SLQS").val("Short").change();
          }

             else if ($('select#SLQS').val() == 'LFG' ){
             document.getElementById("input-question").value="How many yards was the longest field goal?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
          }
             else if ($('select#SLQS').val() == 'LTP' ){
             document.getElementById("input-question").value="How many yards was the longest touchdown pass?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
          }
             else if ($('select#SLQS').val() == 'LTR' ){
             document.getElementById("input-question").value="How many yards was the longest touchdown run?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             document.getElementById('value').value=num;
             $('input#value').trigger('keyup');
             $("select#SLQS").val("Short").change();
             }
             else if ($('select#SLQS').val() == 'XLYK' ){
             document.getElementById("input-question").value="How many field goals longer than"+' '+x+' '+"yards"+' '+"did"+' '+y+' '+"kick?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#SLQS").val("Short").change();
          }
             else if ($('select#SLQS').val() == 'XLYT' ){
             document.getElementById("input-question").value="How many touchdown passes longer than"+' '+x+' '+"yards"+' '+"did"+' '+y+' '+"throw?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#SLQS").val("Short").change();
             }});


                  //First or Last Drop Down//
          $('select#FLQS').on('change', function() {
             var x = document.getElementById('xfield').value;
          if ( $('select#FLQS').val() == 'FTD' ){
             document.getElementById("input-question").value="Which player scored the first touchdown of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

}
          else if ($('select#FLQS').val() == 'FFG' ){
             document.getElementById("input-question").value="Which player scored the first field goal of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

          }
             else if ($('select#FLQS').val() == 'FTP' ){
             document.getElementById("input-question").value="Which player threw the first touchdown pass of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

          }
             else if ($('select#FLQS').val() == 'LATD' ){
             document.getElementById("input-question").value="Which player scored the last touchdown of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

          }
             else if ($('select#FLQS').val() == 'LAFG' ){
             document.getElementById("input-question").value="Which player scored the last field goal of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

          }
             else if ($('select#FLQS').val() == 'LATP' ){
             document.getElementById("input-question").value="Which player threw the last touchdown pass of the game?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#FLQS").val("FLQ").change();

          }});

                      //Total/Points Dropdown//
          $('select#TPQS').on('change', function() {
             var x = document.getElementById('xfield').value;
          if ( $('select#TPQS').val() == 'XWB' ){
             document.getElementById("input-question").value="How many points did the"+' '+x+' '+"win by?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#TPQS").val("TPQ").change();
}
          else if ($('select#TPQS').val() == 'XLB' ){
             document.getElementById("input-question").value="How many points did the"+' '+x+' '+"lose by?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#TPQS").val("TPQ").change();
}
             else if ($('select#TPQS').val() == 'HPT' ){
             document.getElementById("input-question").value="How many total points were scored by the end of the game?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#TPQS").val("TPQ").change();
             }

             else if ($('select#TPQS').val() == 'TXT' ){
             document.getElementById("input-question").value="How many total yards did" +' '+ x +' '+ "throw for touchdowns?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#TPQS").val("TPQ").change();
             }
             else if ($('select#TPQS').val() == 'TXK' ){
             document.getElementById("input-question").value="How many total field goal yards did"+' '+x+' '+"kick?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#TPQS").val("TPQ").change();
             }});



                      //First Quarter Questions//
          $('select#1QQS').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#1QQS').val() == '1QFG' ){
             document.getElementById("input-question").value="How many field goals did"+' '+x+' '+ "score in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
}
          else if ($('select#1QQS').val() == '1QTD' ){
             document.getElementById("input-question").value="How many touchdowns did"+' '+x+' '+ "score in the first quarter?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
}
             else if ($('select#1QQS').val() == '1QTP' ){
             document.getElementById("input-question").value="How many touchdown passes did"+' '+x+' '+ "throw in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
             }

             else if ($('select#1QQS').val() == '1QPL' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "lead with in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
             }
             else if ($('select#1QQS').val() == '1QPT' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "trail by in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
             }
              else if ($('select#1QQS').val() == '1MSF' ){
             document.getElementById("input-question").value="Which players scored field goals in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#1QQS").val("1QQ").change();
              }
              else if ($('select#1QQS').val() == '1MSR' ){
             document.getElementById("input-question").value="Which players made touchdown runs in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#1QQS").val("1QQ").change();
              }
                else if ($('select#1QQS').val() == '1MSP' ){
             document.getElementById("input-question").value="Which players threw touchdown passes in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#1QQS").val("1QQ").change();
              }
             else if ($('select#1QQS').val() == '1QTS' ){
             document.getElementById("input-question").value="How many total points were scored in the first quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#1QQS").val("1QQ").change();
             }});

             //Second Quarter Questions//
          $('select#2QQS').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#2QQS').val() == '2QFG' ){
             document.getElementById("input-question").value="How many field goals did"+' '+x+' '+ "score in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
}
          else if ($('select#2QQS').val() == '2QTD' ){
             document.getElementById("input-question").value="How many touchdowns did"+' '+x+' '+ "score in the second quarter?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
}
             else if ($('select#2QQS').val() == '2QTP' ){
             document.getElementById("input-question").value="How many touchdown passes did"+' '+x+' '+ "throw in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
             }

             else if ($('select#2QQS').val() == '2QPL' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "lead with in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
             }
             else if ($('select#2QQS').val() == '2QPT' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "trail by in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
             }
             else if ($('select#2QQS').val() == '2MSF' ){
             document.getElementById("input-question").value="Which players scored field goals in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#2QQS").val("2QQ").change();
              }
              else if ($('select#2QQS').val() == '2MSR' ){
             document.getElementById("input-question").value="Which players made touchdown runs in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#2QQS").val("2QQ").change();
              }
                else if ($('select#2QQS').val() == '2MSP' ){
             document.getElementById("input-question").value="Which players threw touchdown passes in the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#2QQS").val("2QQ").change();
              }
              else if ($('select#2QQS').val() == '2QTS' ){
             document.getElementById("input-question").value="How many total points were scored by the second quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#2QQS").val("2QQ").change();
             }});

                 //Third Quarter Questions//
          $('select#3QQS').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#3QQS').val() == '3QFG' ){
             document.getElementById("input-question").value="How many field goals did"+' '+x+' '+ "score in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
}
          else if ($('select#3QQS').val() == '3QTD' ){
             document.getElementById("input-question").value="How many touchdowns did"+' '+x+' '+ "score in the third quarter?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
}
             else if ($('select#3QQS').val() == '3QTP' ){
             document.getElementById("input-question").value="How many touchdown passes did"+' '+x+' '+ "throw in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
             }

             else if ($('select#3QQS').val() == '3QPL' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "lead with in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
             }
             else if ($('select#3QQS').val() == '3QPT' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "trail by in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
             }
               else if ($('select#3QQS').val() == '3MSF' ){
             document.getElementById("input-question").value="Which players scored field goals in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#3QQS").val("3QQ").change();
              }
              else if ($('select#3QQS').val() == '3MSR' ){
             document.getElementById("input-question").value="Which players made touchdown runs in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#3QQS").val("3QQ").change();
              }
                else if ($('select#3QQS').val() == '3MSP' ){
             document.getElementById("input-question").value="Which players threw touchdown passes in the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#3QQS").val("3QQ").change();
              }
             else if ($('select#3QQS').val() == '3QTS' ){
             document.getElementById("input-question").value="How many total points were scored by the third quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#3QQS").val("3QQ").change();
             }});

                   //Fourth Quarter Questions//
          $('select#4QQS').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#4QQS').val() == '4QFG' ){
             document.getElementById("input-question").value="How many field goals did"+' '+x+' '+ "score in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
}
          else if ($('select#4QQS').val() == '4QTD' ){
             document.getElementById("input-question").value="How many touchdowns did"+' '+x+' '+ "score in the fourth quarter?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
}
             else if ($('select#4QQS').val() == '4QTP' ){
             document.getElementById("input-question").value="How many touchdown passes did"+' '+x+' '+ "throw in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
             }

             else if ($('select#4QQS').val() == '4QPL' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "lead with in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
             }
             else if ($('select#4QQS').val() == '4QPT' ){
             document.getElementById("input-question").value="How many total points did the"+' '+x+' '+ "trail by in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
             }
              else if ($('select#4QQS').val() == '4MSF' ){
             document.getElementById("input-question").value="Which players scored field goals in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#4QQS").val("4QQ").change();
              }
              else if ($('select#4QQS').val() == '4MSR' ){
             document.getElementById("input-question").value="Which players made touchdown runs in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#4QQS").val("4QQ").change();
              }
                else if ($('select#4QQS').val() == '4MSP' ){
             document.getElementById("input-question").value="Which players threw touchdown passes in the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#4QQS").val("4QQ").change();
              }
              else if ($('select#4QQS').val() == '4QTS' ){
             document.getElementById("input-question").value="How many total points were scored by the fourth quarter?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#4QQS").val("4QQ").change();
             }});

              //Misc Questions//
          $('select#MQS').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#MQS').val() == 'MSFG' ){
             document.getElementById("input-question").value="How many yards shorter was"+' '+x+"'\s"+' '+"second field goal compared to his first?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
}
          else if ($('select#MQS').val() == 'MSTP' ){
             document.getElementById("input-question").value="How many yards shorter was"+' '+x+"'\s"+' '+"second touchdown pass compared to his first?";
          $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
}
             else if ($('select#MQS').val() == 'MSTR' ){
             document.getElementById("input-question").value="How many yards shorter was"+' '+x+"'\s"+' '+"second touchdown run compared to his first?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }

             else if ($('select#MQS').val() == 'MLFG' ){
             document.getElementById("input-question").value="How many yards longer was"+' '+x+"'\s"+' '+"second field goal compared to his first?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MLTP' ){
             document.getElementById("input-question").value="How many yards longer was"+' '+x+"'\s"+' '+"second touchdown pass compared to his first?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MLTR' ){
             document.getElementById("input-question").value="How many yards longer was"+' '+x+"'\s"+' '+"second touchdown run compared to his first?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MFXY' ){
             document.getElementById("input-question").value="Which player scored more field goals,"+' '+x+' '+"or"+' '+y+"?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MTXY' ){
             document.getElementById("input-question").value="Which player scored more touchdowns,"+' '+x+' '+"or"+' '+y+"?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MPXY' ){
             document.getElementById("input-question").value="Which player threw more touchdown passes,"+' '+x+' '+"or"+' '+y+"?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MLP' ){
             document.getElementById("input-question").value="How many points did"+' '+x+' '+"lead with by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }
             else if ($('select#MQS').val() == 'MTP' ){
             document.getElementById("input-question").value="How many points did"+' '+x+' '+"trail by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MSHF' ){
             document.getElementById("input-question").value="Which players scored field goals by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
              }
              else if ($('select#MQS').val() == 'MSHR' ){
             document.getElementById("input-question").value="Which players made touchdown runs by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
              }
                else if ($('select#MQS').val() == 'MSHP' ){
             document.getElementById("input-question").value="Which players threw touchdown passes by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
              }
              else if ($('select#MQS').val() == 'MFGL' ){
             document.getElementById("input-question").value="Which player kicked the longest field goal?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MFGS' ){
             document.getElementById("input-question").value="Which player kicked the shortest field goal?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MTRL' ){
             document.getElementById("input-question").value="Which player had the longest touchdown run?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MTRS' ){
             document.getElementById("input-question").value="Which player had the shortest touchdown run?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
               else if ($('select#MQS').val() == 'MTPL' ){
             document.getElementById("input-question").value="Which player threw the longest touchdown pass?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MTPS' ){
             document.getElementById("input-question").value="Which player threw the shortest touchdown pass?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=x;
             $("input#span-0").trigger('keyup');
             $("select#MQS").val("MQQ").change();
             }
              else if ($('select#MQS').val() == 'MTS' ){
             document.getElementById("input-question").value="How many total points were scored by halftime?";
             $("input#input-question").trigger('keyup');
             $('input#digit').click();
             $("select#MQS").val("MQQ").change();
             }});



              //Multi Span Questions//
          $('select#MSQ').on('change', function() {
             var x = document.getElementById('xfield').value;
             var y = document.getElementById('yfield').value;
             var num = document.getElementById('numberfield').value;
          if ( $('select#MSQ').val() == 'MSTS' ){
             document.getElementById("input-question").value="Which players scored touchdowns shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSTL' ){
             document.getElementById("input-question").value="Which players scored touchdowns longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSTPS' ){
             document.getElementById("input-question").value="Which players had touchdown passes shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSTPL' ){
             document.getElementById("input-question").value="Which players had touchdown passes longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSFGS' ){
             document.getElementById("input-question").value="Which players scored field goals shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSFGL' ){
             document.getElementById("input-question").value="Which players scored field goals longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSFGX' ){
             document.getElementById("input-question").value="Which field goals did"+' '+x+' '+ "make?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MSTRX' ){
             document.getElementById("input-question").value="Which touchdown runs did"+' '+x+' '+ "make?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSTPX' ){
             document.getElementById("input-question").value="Which touchdown passes did"+' '+x+' '+ "make?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MST2F' ){
             document.getElementById("input-question").value="What are the top two longest field goals made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSTSF' ){
             document.getElementById("input-question").value="What are the two shortest field goals made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MST2R' ){
             document.getElementById("input-question").value="What are the top two longest touchdown runs made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
             else if ($('select#MSQ').val() == 'MSTSR' ){
             document.getElementById("input-question").value="What are the two shortest touchdown runs made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }
              else if ($('select#MSQ').val() == 'MST2P' ){
             document.getElementById("input-question").value="What are the top two longest touchdown passes made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSTSP' ){
             document.getElementById("input-question").value="What are the two shortest touchdown passes made?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSFGL' ){
             document.getElementById("input-question").value="Which players made field goals longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSFGS' ){
             document.getElementById("input-question").value="Which players made field goals shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSTRL' ){
             document.getElementById("input-question").value="Which players made touchdown runs longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
              else if ($('select#MSQ').val() == 'MSTRS' ){
             document.getElementById("input-question").value="Which players made touchdown runs shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
              }
               else if ($('select#MSQ').val() == 'MSTPL' ){
             document.getElementById("input-question").value="Which players made touchdown passes longer than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
               }
               else if ($('select#MSQ').val() == 'MSTPS' ){
             document.getElementById("input-question").value="Which players made touchdown passes shorter than"+' '+x+' '+ "yards?";
             $("input#input-question").trigger('keyup');
             $('input#span').click();
             document.getElementById('span-0').value=y;
             $('div.answer').find('a')[0].click();
             document.getElementById('span-1').value=num;
             $("input#span-0").trigger('keyup');
             $("select#MSQ").val("MQQS").change();
             }});










             clearInterval(hide_stuff);
         }

         else if ( $('h2:contains(Complex question answering with high-level reasoning and inference)').length ) {
         document.getElementById('collapse_link').click()
         clearInterval(hide_stuff);
        }
         else {
          clearInterval(hide_stuff);
         }
}

});

})();

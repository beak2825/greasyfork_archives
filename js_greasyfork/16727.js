// ==UserScript==
// @name         Sergey 5
// @namespace    http://your.homepage/
// @version      0.1
// @description  Sergey - Project Reflection
// @author       saqfish
// @match        https://s3.amazonaws.com/*
// @include      https://www.youtube.com/channel/*
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/16727/Sergey%205.user.js
// @updateURL https://update.greasyfork.org/scripts/16727/Sergey%205.meta.js
// ==/UserScript==

if (window.location.toString().toLowerCase().indexOf("https://s3.amazonaws.com/") != -1 && window.location.toString().indexOf("ASSIGNMENT_ID_NOT_AVAILABLE") == -1){
    var youtube_src = $('a:contains("Link to the channel")').attr('href');
    window.open(youtube_src);
    var content = [];
    var num = [];
    var sex = [];
    var race = [];

    $('div.checkbox').eq(2).each(function(){
        var a = $(this).find('label').find('input').get();
        content.push($(a));
    });
    $('div.radio').each(function(){
        num.push($(this));
    });

    window.addEventListener('message',function(event) {
        console.log(event.data);
        var a = event.data;
        if(a.A.substring(0,2) === "S1"){
            switch(a.A.substring(2)) {
                case "One":
                    num[0].children().children().prop('checked',true);
                    sex = [num[2],num[3],num[4]];
                    $('div.checkbox').eq(0).each(function(){
                        var a = $(this).find('label').find('input').get();
                        race.push($(a));
                    });
                    console.log("one");
                    break;
                case "Two":
                    num[1].children().children().prop('checked',true);
                    sex = [num[5],num[6],num[7],num[8]];
                    $('div.checkbox').eq(1).each(function(){
                        var a = $(this).find('label').find('input').get();
                        race.push($(a));
                    });
                    break;
            }

        }
        if(a.A.substring(0,2) === "TC"){
            var n = a.A.substring(2);
            var n2 = n - 1;
            for(var i = 0; i< content[0].length; i++){
                if(i == n2){
                    $(content[0][i]).prop('checked',true);
                }
            }

        }
        if(a.A.substring(0,2) === "TS"){
            console.log(a.A.substring(2));
            switch(a.A.substring(2)) {
                case "1":
                    sex[0].children().children().prop('checked',true);
                    break;
                case "2":
                    sex[1].children().children().prop('checked',true);
                    break;
                case "3":
                    sex[2].children().children().prop('checked',true);
                    break;
                case "4":
                    sex[3].children().children().prop('checked',true);
                    break;

            }

        }
        if(a.A.substring(0,2) === "TE"){
            var n = a.A.substring(2);
            var n2 = n - 1;
            for(var i = 0; i< content[0].length; i++){
                if(i == n2){
                    $(race[0][i]).prop('checked',true);
                }
            }

        }
        if(a.A === "submit"){
            $('#submitButton').click();
            setTimeout(function(){ window.parent.close(); }, 500);
        }
    },false);
}

if (window.location.toString().toLowerCase().indexOf("https://www.youtube.com/channel") != -1){

    var table = '<table id="ytable" style="display:inline-block"> <thead> <tr> <th> # of youtubers </th></thead><tbody> <tr> <td id="S1One"> Two </td></tr><tr> <td id="S1Two"> One </td></tr></tbody><tr id="sub">     <td><font color="red">SUBMIT!</td>   </tr></table>';
    $('#channel-subheader').append(table);
    $('#sub').css("background-color","black");
    $('#sub').css("padding","15px");

    var f = "";
    //Start Creator stuffs
    $("td[id^='S1']").on("click", function() {
        if($(this).index() == 0){
            $("td[id^='S1']").css("background-color", "#FFFFFF")
            $(this).css("background-color", "#99FF66");
            f = this.id;
            console.log($('#con1').length);
            if(f.substring(2) === "One"){
                if($('#con1').length == 0){
                    $('#channel-subheader').append('<div id="con1"><table><thead><tr><th><th>Sex</th></tr></thead><tbody><tr><td id="TS1">Male</td></tr><tr><td id="TS2">FeMale</td></tr><tr><td id="TS3">N/A</td></tr></tbody></table><table></thead> <tr> <th> Race </th> </tr> <tbody> <tr><td id="TE1"> White (Non Hispanic)</td></tr> <tr><td id="TE2">Hispanic</td></tr> <tr><td id="TE3">Black or African American</td></tr> <tr><td id="TE4">Asian, South Asian or Pacific Islander</td></tr> <tr><td id="TE5">Native American</td></tr> <tr><td id="TE6">Some other race</td></tr> <tr><td id="TE7">Dont know</td></tr> <tr><td id="TE8">N/A</td></tr> </tbody></table><table> </thead> <tr> <th> Content </th> </tr> <tbody> <tr> <td id="TC1">Company or Brand</td> <td id="TC2">Sports</td> <td id="TC3">Game-Show</td> <td id="TC4">Drama</td> <td id="TC5">Science Fiction</td> </tr> <tr> <td id="TC6">People & Communities</td> <td id="TC7">Food & Drink</td> <td id="TC8">Travel</td> <td id="TC9">Health & Fitness</td> <td id="TC10">Kids & Learning</td> </tr> <tr> <td id="TC11">Games</td> <td id="TC12">Current & Events Reporting</td> <td id="TC13">Technology</td> <td id="TC14">Comedy</td> <td id="TC15">Beauty & Fashion</td> </tr> <tr> <td id="TC16">Education</td> <td id="TC17">Law & Government</td> <td id="TC18">Home & Garden</td> <td id="TC19">Auction</td> <td id="TC20">Autos & Vehicles </td> </tr> <tr> <td id="TC21">Pets & Animals</td> <td id="TC22">Animation</td> <td id="TC23">Arts & Performance</td> <td id="TC24">Music</td> <td id="TC25">Youth</td> <td id="TC26">Hobbies & Leisure</td> </tr> </tbody> </table></div>');
                }else{
                    $('#con1').html('<table><thead><tr><th><th>Sex</th></tr></thead><tbody><tr><td id="TS1">Male</td></tr><tr><td id="TS2">FeMale</td></tr><tr><td>N/A</td></tr></tbody><table><table></thead> <tr> <th> Race </th> </tr> <tbody> <tr><td id="TE1"> White (Non Hispanic)</td></tr> <tr><td id="TE2">Hispanic</td></tr> <tr><td id="TE3">Black or African American</td></tr> <tr><td id="TE4">Asian, South Asian or Pacific Islander</td></tr> <tr><td id="TE5">Native American</td></tr> <tr><td id="TE6">Some other race</td></tr> <tr><td id="TE7">Dont know</td></tr> <tr><td id="TE8">N/A</td></tr> </tbody></table><table> <thead> <tr> <th> Content </th> </tr> <tbody> <tr> <td id="TC1">Company or Brand</td> <td id="TC2">Sports</td> <td id="TC3">Game-Show</td> <td id="TC4">Drama</td> <td id="TC5">Science Fiction</td> </tr> <tr> <td id="TC6">People & Communities</td> <td id="TC7">Food & Drink</td> <td id="TC8">Travel</td> <td id="TC9">Health & Fitness</td> <td id="TC10">Kids & Learning</td> </tr> <tr> <td id="TC11">Games</td> <td id="TC12">Current & Events Reporting</td> <td id="TC13">Technology</td> <td id="TC14">Comedy</td> <td id="TC15">Beauty & Fashion</td> </tr> <tr> <td id="TC16">Education</td> <td id="TC17">Law & Government</td> <td id="TC18">Home & Garden</td> <td id="TC19">Auction</td> <td id="TC20">Autos & Vehicles </td> </tr> <tr> <td id="TC21">Pets & Animals</td> <td id="TC22">Animation</td> <td id="TC23">Arts & Performance</td> <td id="TC24">Music</td> <td id="TC25">Youth</td> <td id="TC26">Hobbies & Leisure</td> </tr> </tbody>');
                }
            }else{
                if($('#con1').length == 0){
                    $('#channel-subheader').append('<div id="con1"><table><thead><tr><th>Sex</th></tr></thead><tbody><tr><td id="TS1">Male</td></tr><tr><td id="TS2">FeMale</td></tr><tr><td id="TS3">Both</td></tr><tr><td id="TS4">N/A</td></tr></tbody></table><table></thead> <tr> <th> Race </th> </tr> <tbody> <tr><td id="TE1"> White (Non Hispanic)</td></tr> <tr><td id="TE2">Hispanic</td></tr> <tr><td id="TE3">Black or African American</td></tr> <tr><td id="TE4">Asian, South Asian or Pacific Islander</td></tr> <tr><td id="TE5">Native American</td></tr> <tr><td id="TE6">Some other race</td></tr> <tr><td id="TE7">Dont know</td></tr> <tr><td id="TE8">N/A</td></tr> </tbody></table><table> </thead> <tr> <th> Content </th> </tr> <tbody> <tr> <td id="TC1">Company or Brand</td> <td id="TC2">Sports</td> <td id="TC3">Game-Show</td> <td id="TC4">Drama</td> <td id="TC5">Science Fiction</td> </tr> <tr> <td id="TC6">People & Communities</td> <td id="TC7">Food & Drink</td> <td id="TC8">Travel</td> <td id="TC9">Health & Fitness</td> <td id="TC10">Kids & Learning</td> </tr> <tr> <td id="TC11">Games</td> <td id="TC12">Current & Events Reporting</td> <td id="TC13">Technology</td> <td id="TC14">Comedy</td> <td id="TC15">Beauty & Fashion</td> </tr> <tr> <td id="TC16">Education</td> <td id="TC17">Law & Government</td> <td id="TC18">Home & Garden</td> <td id="TC19">Auction</td> <td id="TC20">Autos & Vehicles </td> </tr> <tr> <td id="TC21">Pets & Animals</td> <td id="TC22">Animation</td> <td id="TC23">Arts & Performance</td> <td id="TC24">Music</td> <td id="TC25">Youth</td> <td id="TC26">Hobbies & Leisure</td> </tr> </tbody> </table></div>');
                }else{
                    $('#con1').html('<table><thead><tr><th>Sex</th></tr></thead><tbody><tr><td id="TS1">Male</td></tr><tr><td id="TS2">FeMale</td></tr><tr><td id="TS3">Both</td></tr><tr><td id="TS4">N/A</td></tr></tbody><table><table></thead> <tr> <th> Race </th> </tr> <tbody> <tr><td id="TE1"> White (Non Hispanic)</td></tr> <tr><td id="TE2">Hispanic</td></tr> <tr><td id="TE3">Black or African American</td></tr> <tr><td id="TE4">Asian, South Asian or Pacific Islander</td></tr> <tr><td id="TE5">Native American</td></tr> <tr><td id="TE6">Some other race</td></tr> <tr><td id="TE7">Dont know</td></tr> <tr><td id="TE8">N/A</td></tr> </tbody></table><table> <thead> <tr> <th> Content </th> </tr> <tbody> <tr> <td id="TC1">Company or Brand</td> <td id="TC2">Sports</td> <td id="TC3">Game-Show</td> <td id="TC4">Drama</td> <td id="TC5">Science Fiction</td> </tr> <tr> <td id="TC6">People & Communities</td> <td id="TC7">Food & Drink</td> <td id="TC8">Travel</td> <td id="TC9">Health & Fitness</td> <td id="TC10">Kids & Learning</td> </tr> <tr> <td id="TC11">Games</td> <td id="TC12">Current & Events Reporting</td> <td id="TC13">Technology</td> <td id="TC14">Comedy</td> <td id="TC15">Beauty & Fashion</td> </tr> <tr> <td id="TC16">Education</td> <td id="TC17">Law & Government</td> <td id="TC18">Home & Garden</td> <td id="TC19">Auction</td> <td id="TC20">Autos & Vehicles </td> </tr> <tr> <td id="TC21">Pets & Animals</td> <td id="TC22">Animation</td> <td id="TC23">Arts & Performance</td> <td id="TC24">Music</td> <td id="TC25">Youth</td> <td id="TC26">Hobbies & Leisure</td> </tr> </tbody>');
                }

            }
            sendit(f);
        }
        $("td[id^='TS']").on("click", function() {
            console.log(this.id);
            if($(this).index() == 0){
                $(this).css("background-color", "#99FF66");
                f = this.id;
                sendit(f);
            }
        });
        $("td[id^='TC']").on("click", function() {
            console.log(this.id);

            $(this).css("background-color", "#99FF66");
            f = this.id;
            sendit(f);

        });
        $("td[id^='TE']").on("click", function() {
            if($(this).index() == 0){
                $(this).css("background-color", "#99FF66");
                f = this.id;
                sendit(f);
            }
        });
    });



    $("#sub").click(function(){
        sendit("submit");
        window.close();
    });

}

function sendit(f){
    window.opener.postMessage({A: f},'*'); 
}
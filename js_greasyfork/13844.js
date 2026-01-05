// ==UserScript==
// @name         Nicholas Moryl 1 
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.2
// @description  Nicholas Moryl
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit*
// @include      http://www.cars.com/go/alg/index.jsp?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/13844/Nicholas%20Moryl%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13844/Nicholas%20Moryl%201.meta.js
// ==/UserScript==


var year = $('#DataCollection > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
var make = $('#DataCollection > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
var mmodel = $('#DataCollection > div > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
var trim = $('#DataCollection > div > table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
var smodel = $('#DataCollection > div > table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
var engine = $('#DataCollection > div > table > tbody > tr:nth-child(6) > td:nth-child(2)').text();
var drive = $('#DataCollection > div > table > tbody > tr:nth-child(7) > td:nth-child(2)').text();
var desc = year + "," + make + "," + mmodel + "," + trim + "," + smodel + "," + engine + "," + drive;
var url = "http://www.cars.com/go/alg/index.jsp?makename="+make+"&modelname="+mmodel+"&year="+year;


if (window.location.toString().indexOf('mturkcontent') != -1){
    //if (window.location.toString().indexOf('Graham_files/hit.html') != -1){
    $(document).keyup(function(e){
        if(e.keyCode === 27){
            $('#submitButton').click();

        }
    });

    var gf= window.open(url, desc); 

    window.addEventListener('message',function(event) {
        console.log(event.data);
        a = event.data;
        if (a.A === "submit"){
            $('#submitButton').click();
        }
        if (a.A === "cars"){

            $('#cars_com_name').val(a.B);
        }
        if (a.A === "ask"){
            //var v = $('#cars_com_name').text() + "*";
            var v2 = a.B + "*";
            console.log(v2);
            $('#cars_com_name').val(v2);  
        }


    },false);

}

if (window.location.toString().toLowerCase().indexOf("http://www.cars.com") != -1){
    var desc = window.name.split(',');
    console.log(desc);
    for (var i = 0; i< desc.length; i++){
        $('#algform > tbody > tr:nth-child(1) > td:nth-child(2)').append('<td>'+desc[i]+'</>');
    }
    $(window).mouseup(function(e) {      
        sel = window.getSelection().toString();
        console.log(sel);
        window.opener.postMessage({A: "cars", B: sel},'*');
    });
    $(document).keyup(function(e){
        if(e.keyCode === 27){
            window.opener.postMessage({A: "ask", B: sel},'*');
        }
       
    });
     $(document).keyup(function(e){
            if(e.keyCode === 9){
                window.opener.postMessage({A: "submit"},'*');
                window.close();

            }
        });
}
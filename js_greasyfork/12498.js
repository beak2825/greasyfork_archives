// ==UserScript==
// @name         Avantage Marketing
// @namespace    http://your.homepage/
// @version      1.5
// @description  Avangate Marketing - Find company information and check if they sell products online - 10/2/15 batch
// @author       saqfish
// @match        https://www.mturkcontent.com/dynami*
// @include      http://www.alexa.com/*
// @include      https://www.google.com/finance*
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12498/Avantage%20Marketing.user.js
// @updateURL https://update.greasyfork.org/scripts/12498/Avantage%20Marketing.meta.js
// ==/UserScript==




company_name = $('#DataCollection > div > table > tbody > tr > td:nth-child(2)').text();
company_name2 = $('#DataCollection > div > table > tbody > tr > td:nth-child(2)').text().substring(0,company_name.length-8);
console.log(company_name2);
var a;

    
var google_button = document.createElement('a');

var google_string = 'http://www.google.com/search?q=' +company_name;
google_button.innerHTML = ' - Search Google';
google_button.onclick = function(){
    window.open(google_string);
};
//Append to google label
$('#DataCollection > div > div:nth-child(3) > label').append(google_button);

 if (window.location.toString().indexOf('mturkcontent') != -1){
     var gf= window.open('https://www.google.com/finance?q=' + company_name2);
     window.addEventListener('message',function(event) {
            console.log(event.data);
         a = event.data;
         if(a.A === "alexa"){
         $('#alexa_rank').val(a.B);
            if(a.C !== ""){
                $('#company_cat').val(a.C);
            }
         }
         if(a.A === "finance"){ 
         $('#Company_URL').val(a.B);
         $('#company_addr').val(a.C);
             if(a.C === "  "){
                 $('#DataCollection > div > div:nth-child(3) > label').append('<font size="3" color="red">------GOOGLE FINANCE NOT AVAILABLE -------</font>');
                  $('#company_addr').val("None");
             }else{
                 window.open(a.B);
                 window.open('http://www.alexa.com/siteinfo/' + a.B);    
             }
         }
        },false);
 }

var alexa_button = document.createElement('a');
alexa_button.innerHTML = ' - Search Alexa';
alexa_button.onclick = function(){
            var alex_search = $('#Company_URL').val();
    var alexa_string = 'http://www.alexa.com/siteinfo/' + alex_search; 
        var aw = window.open(alexa_string);        
}
console.log(window.location.toString().toLowerCase());

if (window.location.toString().toLowerCase().indexOf('www.alexa.com') != -1){

    var a = $('#traffic-rank-content > div > span.span-col.last > div:nth-child(1) > span > span > div > strong').text();
    var num = $('#category_link_table > tbody > tr:nth-child(1) > td > span').children('a').length ;
    var stringie = "";
    stringie = $('#category_link_table > tbody > tr:nth-child(1) > td > span').children('a').eq(0).text();


    for (var i = 1; i < num; i++){

        stringie+= " > " +  $('#category_link_table > tbody > tr:nth-child(1) > td > span').children('a').eq(i).text();
        
        console.log(i);

    }
    console.log(stringie);
    window.opener.postMessage({A: "alexa", B: a, C: stringie},'*');  
    window.close();
}

if (window.location.toString().toLowerCase().indexOf("https://www.google.com/finance") != -1){
    
    var test = $('#fs-chome').text();
    var thing = [];
    $('.sfe-section').has( "br" ).find("*")
    add = $('.sfe-section').has( "br" ).contents().eq(0).text() +" "+ $('.sfe-section').has( "br" ).contents().eq(2).text()+" "+ $('.sfe-section').has( "br" ).contents().eq(4).text();
    window.opener.postMessage({A: "finance", B: test, C: add},'*'); 
}




//Append to alexa label
$('#DataCollection > div > div:nth-child(8) > label').append(alexa_button);

var bbb_input= $('#B2B_B2C');
bbb_input.val("B2B");

var b2b_button = document.createElement('a');
b2b_button.innerHTML = '  B2B ';
b2b_button.onclick = function(){

    bbb_input.val("B2B");
};
//Append to business label
$('#DataCollection > div > div:nth-child(4) > label').append(b2b_button);


var bcb_button = document.createElement('a');
bcb_button.innerHTML = '  B2B ';
bcb_button.onclick = function(){

    bbb_input.val("B2C");
};
//Append to business label
$('#DataCollection > div > div:nth-child(4) > label').append(bcb_button);

var both_button = document.createElement('a');
both_button.innerHTML = '  Both ';
both_button.onclick = function(){

    bbb_input.val("Both");
};
//Append to business label
$('#DataCollection > div > div:nth-child(4) > label').append(both_button);

var Sellonline_button = document.createElement('a');
Sellonline_button.innerHTML = ' Yes ';
Sellonline_button.onclick = function(){

    $('#online_sales').val("Yes");
};
//Append to sell-online label
$('#DataCollection > div > div:nth-child(5) > b').append(Sellonline_button);


$('input[id="online_sales"]').val("No");

var a_button = document.createElement('a');
a_button.innerHTML = ' None ';
a_button.onclick = function(){

    $('#alexa_rank').val("None");
};
//Append to alexa label
$('#DataCollection > div > div:nth-child(8) > label').append(a_button);

$('#free_trial').val("No");

var freetrail_button = document.createElement('a');
freetrail_button.innerHTML = ' Yes ';
freetrail_button.onclick = function(){

    $('#free_trial').val("Yes");
};
//Append to free-trail label
$('#DataCollection > div > div:nth-child(6) > label').append(freetrail_button);
var c_button = document.createElement('a');
c_button.innerHTML = ' None ';
c_button.onclick = function(){

    $('#company_cat').val("None");
};
//Append to category label
$('#DataCollection > div > div:nth-child(9) > label').append(c_button);

$('#alexa_rank').val("None");

$('#company_cat').val("None");
$('#company_addr').val("None");
$('#prices').val("None");
$('.panel-body').hide();

$('.panel-primary').click(function() {
    
    if($('.panel-body').is(":visible")){
        $('.panel-body').hide();
    }else{
        $('.panel-body').show();
    }
});

 $('#Company_URL').on('input',function(e){
     setTimeout(function(){ window.open('http://www.alexa.com/siteinfo/' + $('#Company_URL').val()); }, 3000);
       
    });

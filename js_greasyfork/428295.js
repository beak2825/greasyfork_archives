// ==UserScript==
// @name         Mafiascum Keyboardless
// @namespace    GeorgeBailey
// @version      GeorgeBailey
// @description  GeorgeBailey
// @author       GeorgeBailey
// @grant        GM_addStyle
//@grant         RegExp
// @match        https://forum.mafiascum.net/viewtopic.php*
// @icon         https://www.google.com/s2/favicons?domain=mafiascum.net
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/428295/Mafiascum%20Keyboardless.user.js
// @updateURL https://update.greasyfork.org/scripts/428295/Mafiascum%20Keyboardless.meta.js
// ==/UserScript==


// Remove Submit Button, Hide Text Area
$("#qr_ns_editor_div > div > fieldset.submit-buttons > input.button1").remove();
$("#qr_ns_editor_div > div > fieldset.submit-buttons > input.button2").remove();
$("#message-box-ns > textarea").hide();

$(document).ready(function(){

function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
}
var Names = "";

    var symbols = ["GeorgeBailey","&","'","-","_","%","(",")","^","~","$","^","*","@",".","/","\\", ":", ";",',','!','?','\'s','\'re'];

    var mafWords = ["shanty","There once was a player banned by UT\nThe name of the player was shellyc\nThe roles went out, she melted down,\nSo quote, my shellyc, quote.\n\nSoon may the listmods come\nTo save the games on MafiaScum\nSome day when the banning is done\nIn SGB we'll post.\n\nIt had not been an hour or so\nWhen shellyc refused to go,\nHer alts signed up to replace her main,\nWhich made the playerbase lol\n\nSoon may the listmods come\nTo save the games on MafiaScum\nSome day when the banning is done\nIn SGB we'll post\n\nBefore the ban had hit the thread\nA thought went through Datisi's head:\n'She used that alt to cheat,' he said\nAnd permabans soon were doled.\n\nSoon may the listmods come\nTo save the games on MafiaScum\nSome day when the banning is done\nIn SGB we'll post.\n\nAs far as I know the site has won\nShelly's not here, and the alts are gone\nThe listmods check the account IPs\nTo stop ban evasion from ShellyC\n\nSoon may the listmods come\nTo save the games on MafiaScum\nSome day when the banning is done\nIn SGB we'll post.\n","1-shot","roleblocked","roleblocker","Jailkeeper","result","Vanilla","cop","lookout","aaaaaaAAAAAAAAAAAAAA","mafia","scummy","townie","scum","town","AI","AtE","BoP","E-1","E-#","EBWOP","ELo","F-3","FMPOV or FYPOV","FoS","GTH","IC","IIoA","ISO","LAMIST","LiLo","Lim","ME","MeLo","MiLo","Mislim","Misrep","ML","NAI","NE","NK","NKA","OMGUS","PbP","PbPA","PE","PEdit","PoE","PR","RQS","RVS","SE","sus(s)","SR","Towncred","TR","V/LA","VCA","VI","WIFOM","WKing","XLo"];

    // Add a regex function to Jquery
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

    // Finding every post and taking the name
   $('div:regex(id,[profile]+[\\d]+)' + ' dt > a').each( function (key, value){

   Names += value.innerHTML + "\n" ;
       Names += "[vote]" + value.innerHTML + "[/vote]" + "\n" ;
// console.log(this);

   });

    Names = unique(Names.split("\n"));




    // creating the submit button
    var submit = document.createElement ('input');


submit.setAttribute("type","submit");
submit.setAttribute("accesskey","s");
submit.setAttribute("tabindex","6");
submit.setAttribute("name","postqr");
submit.setAttribute("value","Submit");
submit.setAttribute("class","button1");
submit.setAttribute("onclick","formquote(87001,90,'s')");
submit.setAttribute("style","margin: 5px; ");
submit.setAttribute("id","submit");





document.querySelector("#qr_ns_editor_div > div > fieldset.submit-buttons").appendChild(submit);

        document.querySelector("#submit").addEventListener (
        "click", ButtonClickSubmit, false
);




var idSel = 0;
var idButt = 100;

    // Fill Select box with every option

function fillSelect(text,idSelect2)     {
    idSelect2 = "#" + idSelect2;
    $.each(text, function(key, value){
            $(idSelect2)
                .append($('<option>',{value: key})
                .text(value));
													});
}

    // Give Jquery a "getValues" function to return values from a link easier

jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: "text",
            async: false,
            cache: false,
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

    // Style the select boxes
    GM_addStyle('#message-box-ns {     text-align: center; vertical-align: middle; }');

    // Import the text, split into an arrau and merge all the previous text
var textByLine = $.getValues("https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt");
textByLine = textByLine.split("\n");
     $.merge(textByLine, mafWords);
     $.merge(textByLine, Names);

    // Add a space before every word, this is how I got around the punctuation problem. Lmao.
       for(var i=0;i<textByLine.length;i++){
    textByLine[i]=" "+textByLine[i];
}

    // there's an extra blank element at the end?????
 textByLine.pop();


   // Punctuation!!!!!
$.merge(textByLine, symbols);






// These functions are to dynamically make plus buttons and select boxes
function createSelect(idSelect){

    var zNode = document.createElement ('select');
    zNode.setAttribute ('id', idSelect);
zNode.setAttribute("style","margin: 5px;  width: 9% ;");
  zNode.setAttribute("class","selSent");
    document.querySelector("#message-box-ns").appendChild (zNode);

     fillSelect(textByLine,idSelect);
    return idSelect + 1;
    }


function createButton(idContainer){

    var zNode2 = document.createElement ('input');
    zNode2.setAttribute ('type', 'button');
    zNode2.setAttribute ('id', idContainer);
    zNode2.setAttribute ('value', '+');
    zNode2.setAttribute ('tabindex', '6');
    zNode2.setAttribute ("style","margin: 5px; ");


    document.querySelector("#message-box-ns ").appendChild (zNode2);

    document.getElementById(idContainer).addEventListener (
        "click", ButtonClickAction, false
);

    return idContainer + 1
    }


// The initial buttons
    idSel =  createSelect(idSel);

    idButt = createButton(idButt);
    var sentence = "";


    //Button click actions

    function ButtonClickSubmit (sEvent) {

        sentence = "";


        $(".selSent").each(function( index ) {

    sentence += $("#"+(index)+" option:selected").text();

     });

      document.querySelector("#message-box-ns > textarea").innerHTML += sentence;

   }


    function ButtonClickAction (zEvent) {

        $(this).remove()

        idSel = createSelect(idSel);
        idButt = createButton(idButt);
        fillSelect(textByLine,idSel);



}



							  });


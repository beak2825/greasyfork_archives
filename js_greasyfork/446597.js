// ==UserScript==
// @name         Qurio_Printer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hee-Hee
// @author       ja
// @match        https://amazon-play.learningcloud.me/student/trainings/*/sprints/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learningcloud.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446597/Qurio_Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/446597/Qurio_Printer.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

setTimeout(function() {

    var infobox = document.createElement ('div');
    infobox.innerHTML = '<div id="qrwio_menu_id" style="display:grid;">' +
        '<input type="button" id="zapisz_test" value="Drukuj_test" style="margin-bottom:10px;" />' +
        '</div>';
    infobox.setAttribute ('id', 'qrwio_menu_div');
    infobox.setAttribute ('style', 'position:fixed;width:250px;height:300px;background-color:silver;left:200px;top:200px;resize:both;overflow:auto;color:black;display:block;z-index:1010;padding:10px;');
    document.getElementsByTagName("body")[0].appendChild(infobox);

    document.getElementById ("zapisz_test").addEventListener (
                "click", qrwio_maker, false
            );

},10000);


async function qrwio_maker() {

    // zmienne na iFrame testu
    var iframe_id = document.getElementsByTagName("iframe")[0].id;
    var iframe = document.getElementById(iframe_id);
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var iframe2 = innerDoc.getElementsByTagName("body")[0].children[0];
    var innerDoc2 = iframe2.contentDocument || iframe2.contentWindow.document;

    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();
    innerDoc2.getElementsByClassName("ntx-showSolutions")[0].click();

    var test = "";

    test += innerDoc2.getElementsByClassName("ntx-quiz-content")[0].innerHTML;

    PrintElem(test);

};


function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('<link type="text/css" rel="stylesheet" href="https://amazon-play.learningcloud.me/wp/netex-uploads/xapi/67840/3538163175.css" ></link></head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(elem);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}



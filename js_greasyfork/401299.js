// ==UserScript==
// @name         Bulk Assay Bloodlines
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Checks bloodlines in bulk
// @author       AyBeCee
// @match        https://flightrising.com/main.php?p=scrying&view=bloodlines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401299/Bulk%20Assay%20Bloodlines.user.js
// @updateURL https://update.greasyfork.org/scripts/401299/Bulk%20Assay%20Bloodlines.meta.js
// ==/UserScript==

$('body').append(`<style>
.yesbreed td{color:#00f}
.nobreed td{color:red}
.incestbox{width:180px;padding:10px;border:1px solid #000;position:fixed;top:0;left:0;background:#fff;z-index:1002}
#incestbutton{border:0;background-color:#dcd6c8;padding:5px 10px;color:#731d08;margin:0 auto 5px;box-shadow:0 1px 3px #999;border-radius:5px;text-shadow:0 1px 1px #fff;border-bottom:1px solid #222;cursor:pointer;display:block;font:bold 11px arial;transition:.1s}
#incestbutton:hover{background-color:#bfb9ac;color:#731d08}
</style>
<div class="incestbox">
<div style="text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: -10px -10px 10px;">Bulk Assay Bloodlines</div>
Enter the dragon IDs into the box in a list.
<br>
<textarea id="dragonlist" style="width: 175px; height: 150px; margin: 10px 0;"></textarea>
<br>
<button id="incestbutton">Bulk check</button>
<table id="incesttable"></table>
</div>`);

const timeout = function(time) {
    return new Promise(function(resolve, reject) {
        // do a very long task
        return setTimeout(function() {
            return resolve();
        }, time);
    });
}


$('#incestbutton').click(async function(){
    const incestString = $('#dragonlist').val();
    const incestArray = incestString.split("\n");
    console.log(incestArray);


    for (const dragonID of incestArray) {

        $('#id10t2').val(dragonID);
        id10tcheck();

        // wait for the box to come up
        await timeout(1000);

        const resultBox = $('#validity').text();

        const yesNo = resultBox.includes("Success");

        const derg1 = $('#id10t1').val();
        const derg2 = $('#id10t2').val();

        $('#incesttable').append(`<tr class='${yesNo ? 'yes' : 'no'}breed'><td>${derg1}</td><td>${derg2}</td><td>${yesNo ? "can breed" : "can't breed"}</td></tr>`);

        $('#no').click();

        // wait for the box to disappear
        await timeout(1000);
    }
});
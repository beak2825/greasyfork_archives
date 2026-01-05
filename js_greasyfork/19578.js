// ==UserScript==
// @name         ManageHoard
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds buttons to select all but 1 for selling/converting and for selecting all Swipp/Baldwin items for sending to vault.
// @author       Fantazjor
// @include      http://flightrising.com/main.php?p=hoard*
// @include      http://flightrising.com/main.php?p=vault*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19578/ManageHoard.user.js
// @updateURL https://update.greasyfork.org/scripts/19578/ManageHoard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $( "#btn1" ).remove();
    $( "#btn2" ).remove();

    var rcss1="style='position:fixed;display:block;top:0;z-index:9999;background:rgba(3,169,244,0.8);width:100px;height:40px;left:0;'";
    var rcss2="style='position:fixed;display:block;top:0;z-index:9999;background:rgba(3,169,244,0.8);width:100px;height:40px;left:110px;'";
    var r1= $('<input id="btn1" '+rcss1+' type="button" value="All But 1"/>');
    var r2= $('<input id="btn2" '+rcss2+' type="button" value="All Special"/>');
    $("body").append(r1);
    $("body").append(r2);

    $( '#btn1' ).click(function() {
        $( "span select" ).each(function( index ) {
            if ( $( this ).val() == "1" ) { } else {
                var v = $( this ).attr('name');
                var a = v.replace("v","a");
                var val = $( this ).val();
                var rel = $( this ).parent().find("a.clue").attr('rel');
                var img = $( this ).parent().find("img");
                var ibg = img.css( "background-color" );

                var tab = "trinket";
                if (rel.search("food")>-1) {	tab = "food"; }
                else if (rel.search("equipment")>-1) { tab = "equipment"; }
                else if (rel.search("familiar")>-1) { tab = "familiar"; }
                else if (rel.search("battle_items")>-1) { tab = "battle_items"; }
                else if (rel.search("skins")>-1) { tab = "skins"; }
                else { tab = "trinket"; }

                var itm = parseInt(rel.replace("includes/itemajax.php?id=","").replace("&tab="+tab,""));
                var inp = $("[name='" + a + "']");

                console.log( a + " " + itm + " " + val );
                if (ibg == "rgba(0, 0, 0, 0)") {
                    if (itm > 4469 && itm < 4554) { } else {
                        $( this ).val(val - 1);
                        $( this ).css( "outline", "4px solid red" );
                        inp[0].checked = true;
                    }
                }
            }
        });
        console.log( "done" );
        //alert("done");
    });

    $( "#btn2" ).click(function() {
        $( "select" ).each(function( index ) {
            var v = $( this ).attr('name');
            var a = v.replace("v","a");
            var img = $( this ).parent().find("img");
            var ibg = img.css( "background-color" );
            var inp = $("[name='" + a + "']");
            if (ibg != "rgba(0, 0, 0, 0)") {
                inp[0].checked = true;
            }
        });
        console.log( "done" );
        //alert("done");
    });

    //keyboard shortcuts
    $("body").keyup(function(event){
        if(event.keyCode == 37){
            $("#invent div:first a:first").click();
        }else if(event.keyCode == 39){
            $("#invent div:first a:last").click();
        }else if(event.keyCode == 13){
            $("#yes").click();
        }else if(event.keyCode == 9){
            $("#no").click();
            $("#ret").click();
        }
    });
})();
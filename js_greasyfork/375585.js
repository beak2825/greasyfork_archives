// ==UserScript==
// @name         testingscript14temp
// @namespace    testingtesting123_233000
// @author       temptesting13
// @version      1.0
// @description  Moves Unconfirmed Releases to their own Edition
// @run-at       document-end
// @include      *redacted.ch/torrents.php?id=*
// @include      *https://redacted.ch/torrents.php?action=edit&id=*
// @downloadURL https://update.greasyfork.org/scripts/375585/testingscript14temp.user.js
// @updateURL https://update.greasyfork.org/scripts/375585/testingscript14temp.meta.js
// ==/UserScript==

// maybe add a second button Confirm year+cat only, etc.
// make a diff one to catch all the daytrotter ones
// catch all IDs from collage, edit torrent page has year at the bottom

var year;
var link = [];
var label = [];
var cat = [];

(function() {
    // Make the button
    var r = $('<input type="button" value="Confirm" id="confButton">');
    $(".header .linkbox").before(r);

    // Find year (currently looks for h2 and strips non-digits and takes last 4)
    year = $("h2:first").text().replace(/[^0-9]/g, '').slice(-4);

    // Find ED URLs, record label and catalogue number
    $('a[href*="action=edit&id"]').each(function(i){
        var edition_info = $(this).parent().parent().parent().prevAll('.edition.group_torrent').first().text();
        if (edition_info.includes("Unconfirmed Release")){
            link[i] = $(this).attr('href');
            edition_info = edition_info.trim().replace("− Unconfirmed Release / ", '');
            var split = edition_info.split(" / ");

            switch (split.length){
                case 3:
                    label[i] = split[0];
                    cat[i] = split[1];
                    break;
                case 2:
                    label[i] = split[0];
                    cat[i] = "";
                    break;
                case 1:
                    label[i] = "";
                    cat[i] = "";
                    break;
                default:
                    alert("This probably has two editions!");
            }
        }
    });

})();

// Do things on click
// consider a middle ground where this is done with .post() to avoid the timing issue.
$('#confButton').click(function(){
    var n;
    var w = [];
    var closed = 0;

    for (let n = 0; n < link.length; n++){
        w[n] = window.open("https://redacted.ch/"+link[n]);
        w[n].onload = (function(){
            //w[n].onbeforeunload = function(){w[n].close();}
            $(w[n]).unload(function(){
                setTimeout(function(){
                    w[n].close();
                    closed++;
                }, 250);
            });

            w[n].document.getElementById("remaster_year").value = year;
            w[n].document.getElementById("remaster_record_label").value = label[n];
            w[n].document.getElementById("remaster_catalogue_number").value = cat[n];

            w[n].document.getElementById("post").click();
        });
    }

    var id = setInterval(function(){
        if (closed == link.length){
            setTimeout(function(){
                location.reload();
                clearInterval(id);
            }, 500);
        }
    }, 250);
})

// browser.tabs.loadDivertedInBackground=true
// consider :contains('Unconfirmed Release') then travese down

// other old code
        //         w[n] = window.open("https://redacted.ch/"+link[n]);
        //         w[n].onload = (function(){
        //             w[n].document.getElementById("remaster_year").value = year;
        //             w[n].document.getElementById("remaster_record_label").value = label;
        //             w[n].document.getElementById("remaster_catalogue_number").value = cat;

        //             var form_data = $(w[n].document).find("#upload_table").serialize();

        //             $.post(link[n], form_data).done(function(){
        //                 w[n].close();
        //                 closed++;
        //                 checkComplete(closed);
        //             });
        //         });
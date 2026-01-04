// ==UserScript==
// @name         SymLite NLU tweaks
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  Assistant NLU specific tweaks for SymLite
// @author       TBurkert
// @include      https://symlite.moravia.com/Document?requestId=*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_setClipboard
// @grant GM_getClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369623/SymLite%20NLU%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/369623/SymLite%20NLU%20tweaks.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$('.btn-toolbar').prepend('<button id="btn-select-all" class="btn btn-sm btn-default" style="width: 8em;">Select all files</a>');
$('.btn-toolbar').prepend('<button id="btn-copy-codes" class="btn btn-sm btn-default" style="width: 8em;">Copy locales</a>');

$(window).bind("load", function() {
    $('#btn-select-all').on('click', event => {
        $('thead > tr > th > input').click();
    });

    $('#btn-copy-codes').on('click', event => {
        var langs = $('.tr-toggle-area[data-lang]');
        var list = [];
        for(var i=0; i<langs.length; i++) {
            list.push($(langs[i]).attr("data-lang").replace(/en\|/g,""));
        }
        GM_setClipboard(list.toString().replace(/,/g,", "));
    });

    $('a[data-link-file-assign]').on('click', event => {
        console.log("File assign clicked");

        var checkExist = setInterval(function() {
            if ($('#filesAvailables').length) {
                console.log("Exists!");
                $('#filesAvailables').parent().append('<button id="assignFromClipboard">Assign from Clipboard</button>');


                $('#assignFromClipboard').on('click', event => {
                    AssignFromClip();
                });

                $('#filesAvailables').parent().append('<button id="clearAssign">Reset all</button>');

                $('#clearAssign').on('click', event => {
                    $('input[title="numberOfFiles"]').val(0);
                });

                clearInterval(checkExist);
            }
        }, 100); // check every 100ms

    });
});

function AssignFromClip() {

    navigator.clipboard.readText()
        .then(text => {
        if(!text) return false;

        var vendors = [];
        var clip = text.split("\n").filter(Boolean);
        clip.forEach(function(line) {
           var vendorarray = line.split("\t");
            vendors.push(vendorarray);
        });


        $('[title="file-assignment"]').each( function(index,element) {
            var name = $(element).children().first().text().trim();
            var nluflag = $(element).children()[1].textContent;

            vendors.forEach(function(vendor) {
                var vendorname = vendor[0].trim();

                if(vendor[2]) {
                    var files = parseInt(vendor[2]);
                }
                else {
                    var files = 1;
                }

                if(vendorname.toLowerCase() == name.toLowerCase() && nluflag.match(/NLU/)) {
                    console.log(vendorname + " found! Setting to " + files);
                    $(element).find('input[title="numberOfFiles"]').val(files);
                }
            });

        })
    })
        .catch(err => {
        console.log('Something went wrong', err);
    });

}

/*
var names = document.querySelectorAll("td > small > a");
for (var i=0; i<names.length; i++) {
names[i].style["white-space"] = "pre-line";
}


var linguists = document.querySelectorAll("small > a");
for (var i=0; i<linguists.length; i++) { linguists[i].style["white-space"] = "initial"}
*/

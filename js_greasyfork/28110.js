// ==UserScript==
// @name         Sidenotes
// @version      1.0.0
// @description  Allows to add a sidenote to each thread
// @author       DaCurse0
// @copyright    2017+, DaCurse0
// @match        https://www.fxp.co.il/forumdisplay*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/62051
// @downloadURL https://update.greasyfork.org/scripts/28110/Sidenotes.user.js
// @updateURL https://update.greasyfork.org/scripts/28110/Sidenotes.meta.js
// ==/UserScript==

var uri = 'http://simpleicon.com/wp-content/uploads/note-4.svg';
var notes;


$(function() {

    try {
        notes = JSON.parse(localStorage.sidenotes_data);
    } catch(ex) {
        localStorage.sidenotes_data = '{}';
        notes = {};
    }

    $(window).unload(function() {
        localStorage.sidenotes_data = JSON.stringify(notes);
    });

    var icon =  '<img style="position:relative;bottom:3px;right:30px;cursor:pointer;" width="14" height="14" src="'+uri+'" title="View Sidenote" class="sidenote">';
    var shade = '<div style="position:fixed;background-color:rgba(0,0,0,0.5);width:100%;height:100%;z-index:999999998;" id="shade"></div>';
    var ui = '<textarea style="position:fixed;z-index:999999999;background-color:white;border:1px solid black;width:640px;height:360px;top:50%;left:50%;transform:translate(-50%, -50%);" id="note"></textarea>';

    $('dl[class="threadlastpost td"]').each(function(i, v) {
        v.children[2].innerHTML += icon;
        v.children[2].children[2].id = v.parentElement.parentElement.id.substr(7);
        v.children[2].children[2].onclick = function() {
            id = this.id;
            $('body').prepend(shade);
            $('#shade').after(ui);
            $("#note").val(notes[id]);
            $('#shade').click(function() {
                notes[id] = $("#note").val();
                $('#shade').remove();
                $('#note').remove();
                console.dir(notes);
            });
        };
    });

});
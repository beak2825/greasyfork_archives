// ==UserScript==
// @name         FXP CheckMark
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.fxp.co.il/forumdisplay.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383418/FXP%20CheckMark.user.js
// @updateURL https://update.greasyfork.org/scripts/383418/FXP%20CheckMark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(isAdmin()){
        var threads = $("#threads").find('.threadbit');//Looking for the threads div holder ('Threads' ID)
        threads.each(function(){//For each thread that it finds, And appending it the 'Check' mark
            var text = $(this).find('.title').text();
            if(!text.includes("⁦✔️")){
                $(this).append('<span class="check_thread" style="color:green; font-size: 1.4em; position: absolute; right: -20px; top: 15px;">⁦⁦✔️</span>');
            }
        });
    }
})();

$(".check_thread").click(function(){//Whenever this class (The 'Check' mark element) is clicked it will fire the following line
    var title = $(this).parent().find('.title');//Looking for the title class that is attached to the 'Check' mark element
    $(this).remove();//Removing the 'Check' mark after clicking it
    checkThread(title);//Firing this function
});

function checkThread(title){
    var dblEvent = new MouseEvent('dblclick', {//Creating double click event
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    title.html("[⁦⁦✔️] -- " + title.text());//Changing the current title's text
    title.parent()[0].dispatchEvent(dblEvent);//Firing the double click event to the title

    vB_ThreadTitle_Editor = new vB_AJAX_TitleEdit(title[0]);//Runing the FXP function for sending the data to the server of the title's text
    vB_ThreadTitle_Editor.save(title.text());
    vB_ThreadTitle_Editor.restore();
}

function isAdmin(){
    if($(".threadimod").length > 0 ){//Check if the user is admin in the corrent forum
        return true;
    }else{
        return false;
    }
}
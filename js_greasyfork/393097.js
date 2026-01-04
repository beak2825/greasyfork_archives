// ==UserScript==
// @name         Majoritas Collab User Script
// @namespace    https://majoritas.com/
// @version      0.1
// @description  Add functionalities to ActiveCollab
// @author       You
// @match        https://collab.majoritas.com/public/index.php?path_info=*/tasks/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393097/Majoritas%20Collab%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/393097/Majoritas%20Collab%20User%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //switch label to new bug
    $('body').on('change', '#taskLabel', function(){
        if($(this).val()==17) {
            //new bug
            var elem = $('#taskBody .redactor_visual_editor_textarea');
            checkAndAdd(elem, 'extraBugData', {'Environment':'', 'Instance ID':'', 'Backend Username':'', 'Backend Password':'', 'Frontend Username':'', 'Frontend Password':''});
        }
    });

    function checkAndAdd(elem, id, extra) {
        var original_text = elem.html();
        if(!original_text.includes(id)) {
            $('<p class="'+id+'"></p>').appendTo(elem);
            $.each(extra, function(key, value) {
                $('<p><strong>'+key+':</strong>&nbsp;'+value+'</p>').appendTo(elem);
            });
        }
    }

    //add task
    /*
    $('body').on('click', '#add_project_task > form > .button_holder > button, #edit_task > form > .button_holder > button', function(event){
        if($('#taskLabel').val()==17) {
            //new bug
            if(checkBugSpecifications()) {
                event.preventDefault();
            }
        }
    });
    */

    function checkBugSpecifications() {
        var text = cleanHTML($('#taskBody_textarea').val());
        var checks = ['URL', 'Username', 'Password'];
        var errors = [];
        $.each(checks, function(key, value) {
            if(!text.includes(value)){
                errors.push(value);
            }
        });

        if(errors.length>0) {
            $('#taskSummary')[0].setCustomValidity("Please add \""+errors.join("\", \"")+"\" information in the text!");
            $("#taskBody .redactor_visual_editor_textarea")[0].oninput= function () {
                $('#taskSummary')[0].setCustomValidity("");
            };
            return true;
        }

        return false;
    }

    function cleanHTML(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText;
    }

})();
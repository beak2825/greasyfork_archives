// ==UserScript==
// @name         Tasmota textarea maximizer
// @namespace    http://monkeyr.com/
// @license      MIT
// @version      2.2
// @description  Maximizes the textarea's on the console and scripting screens. Makes editing a little easier. Also added js to save the script with ajax rather than submitting the page. ctrl + s will save the script
// @author       mh
// @match        http://*/s10*
// @match        http://*/cs*
// @match        http://*/ufse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tasmota.github.io
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/489056/Tasmota%20textarea%20maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/489056/Tasmota%20textarea%20maximizer.meta.js
// ==/UserScript==

(function($) {
    // resize
    const cont = $('body>div').css({'min-width': '98%'});
    //console.log(cont.children())
    let textarea=null, others_height=0, delta_height=200;
    cont.children().each((i,e) => {
        const ele = $(e);
        //console.log(e);
        if(ele.is('fieldset')){
            textarea=ele.find('textarea');
        }
        else if(ele.is('textarea')){
            delta_height=100;
            textarea=ele;
        }
        else{
            others_height+=ele.outerHeight();
            //console.log(ele.outerHeight());
        }
    });
    textarea.height(document.documentElement.clientHeight - others_height - delta_height);
    window.addEventListener('resize', function() {textarea.height(document.documentElement.clientHeight - others_height - delta_height);console.log('resize event')});

    // Save script windows in-place
    const save = function(e){
        e.preventDefault();
        const btn = $(this),
              frm = btn.closest('form'),
              formData = new FormData(frm[0]);

        formData.append(btn.attr('name'), '');
        //console.log(formData)

        $.ajax({
            type: "POST",
            url: btn.attr('formaction'),
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data){
                GM_notification ( {text: 'Saved', timeout: 3000} );
            },
            error: function(data){
                GM_notification ( {text: 'Save failed!'} );
            }
        });
    },
    button = $('button[name="save"]').on('click', save);
    document.addEventListener('keydown', function(e) {
        if (e.keyCode==83 && e.ctrlKey) {
            e.cancelBubble = true;
            e.preventDefault();
            e.stopImmediatePropagation();
            $(button).click();
        }
        return false;
    }, true);
})(jQuery);
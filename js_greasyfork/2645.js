// ==UserScript==
// @name        No GC Offers [DEPRECATED]
// @description Delete PMs that have "off GCash Flash" in the title (refine later)
// @namespace   gaiarch_v3
// @match     http://*.gaiaonline.com/profile/privmsg.php*
// @require   http://code.jquery.com/jquery-2.1.1.min.js
// @version     v1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2645/No%20GC%20Offers%20%5BDEPRECATED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/2645/No%20GC%20Offers%20%5BDEPRECATED%5D.meta.js
// ==/UserScript==
(function() {
    var nodes = document.querySelectorAll('a.topictitle');
    var pNode, nodeArray = [];
    $.each(nodes, function(idx, node) {
        pNode = node.parentNode;
        if(node.innerHTML !== undefined && node.innerHTML.indexOf('off GCash Flash') !== -1) { //get messages by name
            while(pNode.nodeName !== 'TR') { // get parent loop to table row
                pNode = pNode.parentNode;
                if(pNode.nodeName === 'TR') {
                    pNode.querySelector('input[type="checkbox"]').checked = true; // check row input
                    nodeArray.push(pNode);
                    break;
                }
            }
        }
    });
    if(nodeArray.length > 0) { // make sure checked PMs
        var form = document.querySelector('#pm_form');
        // -- Get SID --
        var sid = form.querySelector('input[name="sid"]');
        $.ajax({
            type: 'GET',
            url: 'http://www.gaiaonline.com/chat/gsi/index.php?v=json&m=[[109]]',
            cache: false,
            dataType: 'json',
            success: function(data) {
                sid.value = data[0][2];
            }
        });
        // -- Get SID --
        //make sure the sid has been applied
        while(sid.value === undefined) {
            if(sid.value !== undefined) {
                break;
            }
        }
        var url = form.action; // the script where you handle the form input.
        // submit form to delete
        $.ajax({
            type: "POST",
            url: url,
            data: $(form).serialize() + '&' + form.querySelector('#btn_delete').name + '=' + form.querySelector('#btn_delete').value,//appends delete button params
            success: function(data) {
                if(nodeArray.length === 1) { // if only one message is checked
                    /* Saved for any possible reference purpose;
                     * $.parseHTML(data).some(function(el, idx, list) {
                        if(el.id === 'content') {
                            nodeArray[0].remove(); // remove
                        }
                        return (el.id === 'content');
                    });*/
                    nodeArray[0].remove(); // remove row
                } else if(nodeArray.length > 1) { // if more than one message is checked
                    $.parseHTML(data).some(function(el, idx, list) {
                        if(el.id === 'content') { //get only #content element
                            var confirmfrm = el.querySelector('form[name="confirmfrm"]'); //get confirm or deny form in #content
                            $.ajax({
                                type: 'POST',
                                url: confirmfrm.action,
                                data: $(confirmfrm).serialize() + 'Yes&x=33&y=8', //append confirm and cursor coordinates
                                success: function(data) {
                                    nodeArray.forEach(function(par, idx, innerList) {
                                        par.remove(); // remove each message from the form
                                    });
                                }
                            })
                        }
                        return (el.id === 'content');
                    });
                }
            }
        });
    }
})();
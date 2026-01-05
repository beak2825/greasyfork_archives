// ==UserScript==
// @name         HSTM link
// @namespace    saqfish
// @version      0.1
// @description  Click TM button on HS to send to TM
// @author       saqfish
// @match        https://www.mturk.com/mturk/findhits?*hit_scraper
// @require     http://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24869/HSTM%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/24869/HSTM%20link.meta.js
// ==/UserScript==

$('#resultsTable').on('DOMSubtreeModified', function(){ $(this).off(); e(this);});
var e = function tee(t){
    $(t).children('tbody').children('tr').each(function(){
        var cols = $(this).children('td');
        var hit = { req_col : cols.eq(0).children('div').eq(1), title_col : cols.eq(1), title_div : cols.eq(1).children('div').eq(0),pr_col : cols.eq(2),};
        var tm_butt=$('<button/>', {text: "TM",
                                    click: function(event){var box = $('<div/>', {id: "tmBox"})
                                    .append($('<input/>',{value:'1000', id: "delayValue", size: 20}))
                                    .append($('<button/>',{text:'Add', click:function(){sM({header: 'add_watcher',content: { id : hit.pr_col.children('a').attr('href').split('=')[1], duration: $('#delayValue').val(), type: 'hit', name: `${hit.req_col.text()} -${hit.title_div.next().text()}`, auto: true, alert: true, stopOnCatch : false },timestamp : true}); $(this).parent().remove();}}))
                                    .append($('<button/>',{text:'Close', click:function(){$(this).parent().remove();}}))
                                    .css({'adding-top': '5px', 'padding-bottom': '5px', 'padding-left': '5px', 'padding-right': '5px', 'background-color':'black', "position": "absolute","top": $(this).position().top,"left": $(this).position().left, "border" :" 3px solid green"});
                                                           $('body').append(box);},
                                   }).attr({type: "button", width: '33px',});
        hit.title_div.append(tm_butt);
    });
    $('#resultsTable').on('DOMSubtreeModified', function(){ $(this).off(); tee(this);});
};
function sM(message) {
    var header    = message.header;
    var content   = message.content || new Date().getTime();
    var timestamp = message.timestamp && new Date().getTime();
    localStorage.setItem('notifier_msg_' + header, JSON.stringify({ content: content, timestamp: timestamp}));

}
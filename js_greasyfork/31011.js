// ==UserScript==
// @name         Telegram post summary
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Summarises telegram posts from channel to export as CSV
// @author       Sam Marshallsay
// @include https://web.telegram.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31011/Telegram%20post%20summary.user.js
// @updateURL https://update.greasyfork.org/scripts/31011/Telegram%20post%20summary.meta.js
// ==/UserScript==
// @require https://code.jquery.com/jquery-3.2.1.min.js
(function() {
    'use strict';
$('body').append('<a href="#" style="position:fixed;top:0px;left:50%;color:red;text-align:right;" class="outputopen">EXPORT STATS</a>');
    $("body").keypress(function(e) {
        if(e.keyCode == 126) { // ~ key
            getStats();
        }
            
    });
    
    $('.outputopen').click(function(e) {
        e.preventDefault();
        getStats();
    });
    
    function getStats() {
        var scrollCount = 0;
            var scrollRepeat = 30;

            function scrollTop() {
                $('.im_history_scrollable_wrap').scrollTop(0);
                
                var chanCreateMsg = $('.im_history_wrap:visible .im_history_messages_peer:visible .im_message_service:contains(Channel created)').length > 0;
                if(scrollCount < scrollRepeat && chanCreateMsg !== true){
                    scrollCount++;
                    setTimeout(scrollTop, 300);
                }
                else {
                    getOutput();
                }
            }
            scrollTop();
            
            function getOutput() {
                var $msgs = $('.im_history_wrap:visible .im_history_messages_peer:visible .im_history_message_wrap');
                var output = [];
                console.log($msgs.length);
                var count = 1;
                var members = $('.tg_head_peer_status span').html();
                var d = new Date();
                var summaryRow = "Summary for " + d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();
                output.push(summaryRow);
                var membersRow = members;
                output.push(membersRow);
                
                $.each($msgs, function(i, val) {                
                    var $msg = $(val);
                    if($msg.find('.im_message_document_caption').length > 0)
                    {
                        console.log($msg);
                        var row = "";
                        row += '"' + count++ + '","' + $msg.find('.im_message_date_split_text').html() + '",';
                        row += '"' + $msg.find('.im_message_date_text').data('content') + '",';                
                        row += '"' + $msg.find('.im_message_views_cnt').html() + '",';
                        row += '"' + $msg.find('.im_message_document_caption').html() + '",';
                        output.push(row);
                    }
                });
                
                var outputdiv = '<div class="outputdiv" style="position:absolute;top:0px;left:0px;width:800px;height:800px;border:solid 1px red;overflow:scroll;background:white;z-index:10000;padding:20px;"><input type="button" value="CLOSE" class="outputclose"/><input type="button" value="DOWNLOAD" class="outputcsv"/><br /></div>';                
                $('body').prepend(outputdiv);
                $.each(output, function(i, val) {
                    $('.outputdiv').append(val + " <br />\r\n");
                });
                
                $('.outputclose').click(function(e) {
                    $('.outputdiv').remove();
                    $('.im_history_scrollable_wrap').scrollTop($('.im_history_scrollable_wrap')[0].scrollHeight);                    
                });
                $('.outputcsv').click(function(e) {
                    //var csvContent = "data:text/csv;charset=utf-8,";
                    
                    // var BOM = "\uFEFF"; 
                    // var csvContent = BOM + csvContent;
                    
                    // var encodedUri = encodeURI(csvOutput);
                    // window.open(encodedUri);
                    
                    var csvString = output.join("\n"); //output.join("%0A");
                    var a         = document.createElement('a');
                    a.href        = 'data:attachment/csv,' +  '\uFEFF' + encodeURIComponent(csvString);
                    a.target      = '_blank';
                    a.download    = 'telegrampoststats.csv';

                    document.body.appendChild(a);
                    a.click();
                });
            }
    }
    
    
    
    
})();
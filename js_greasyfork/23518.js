// ==UserScript==
// @name         Real-Debrid multi-upload torrents
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add multi-upload to torrents service of real-debrid, when you send file it will use the hoster and splitting above. After all uploads the page will refresh. Tested on chrome.
// @author       gilbert1995
// @match        https://real-debrid.com/torrents
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/vendor/jquery.ui.widget.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/jquery.iframe-transport.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/jquery.fileupload.min.js
// @downloadURL https://update.greasyfork.org/scripts/23518/Real-Debrid%20multi-upload%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/23518/Real-Debrid%20multi-upload%20torrents.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = '<style>#upload ul li u,a:hover{text-decoration:none}*{margin:0;padding:0}html{box-sizing:border-box;background-color:#ebebec;background-image:-webkit-radial-gradient(center,#ebebec,#b4b4b4);background-image:-moz-radial-gradient(center,#ebebec,#b4b4b4);background-image:radial-gradient(center,#ebebec,#b4b4b4);min-height:900px}*,:after,:before{box-sizing:inherit}body{font:15px/1.3 Arial,sans-serif;color:#4f4f4f}a,a:visited{outline:0;color:#389dc1}aside,footer,header,section{display:block}#upload{font-family:\'PT Sans Narrow\',sans-serif;background-color:#373a3d;background-image:-webkit-linear-gradient(top,#373a3d,#313437);background-image:-moz-linear-gradient(top,#373a3d,#313437);background-image:linear-gradient(top,#373a3d,#313437);padding:30px;border-radius:3px;box-shadow:0 0 10px rgba(0,0,0,.3)}#drop{background-color:#2E3134;padding:40px 50px;margin-bottom:30px;border:20px solid transparent;border-radius:3px;border-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MUU5RTNGRDk4QjFFMjExODE0NkUyMUJBNERDNDk0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0OEZGM0JBREI3RTcxMUUyODFDRkE4MTU1MDRCRkVBRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0OEZGM0JBQ0I3RTcxMUUyODFDRkE4MTU1MDRCRkVBRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MUU5RTNGRDk4QjFFMjExODE0NkUyMUJBNERDNDk0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MUU5RTNGRDk4QjFFMjExODE0NkUyMUJBNERDNDk0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmuiwCwAAAF7SURBVHja7NpRSsMwAIDhZJbdoNLhdXwSvIBPg11CUBS9h7AnbyYr9hAxfRmIfRDdlqx8P2SwPqwjH01gS7y+uV2GEJ7yWOdxFf5RSikMfb9/H2MMbdeFYzWj+33ksc3jtckvL3ncB5VsfBAe8rhY5JeN+aimzQjSmodqahfmoK6aqYufu93BNsFDfdYc73e5Wv245gmpLCBABASIgAARECACAkRABASI/lRzyp+r9b2pufeEWLIE5Jz2kKm/Ee0rp8lfuJYsAQEiIEAEBIiACAgQAQEiIEAEBIiACAgQAQEiILPM2d6COdtryRKQc99DnO0tl7O9liwBASIgQAQEiIAICBABASIgQAQEiIAICBABASIgs8zZ3oI522vJEpBz30Oc7S2Xs72WLAEBIiBABASIgAgIEAEBIiBzrZm6OPWz8G9KKYWh7/fvY4yh7bqjffk53s8TUuGSNZiGahpGkDfzUE3bcQ95zmOZx10enTkp0rgxvefx+CXAAFXjX+IoV9pGAAAAAElFTkSuQmCC) 25 repeat;text-align:center;text-transform:uppercase;font-size:16px;font-weight:700;color:#7f858a}#drop a{background-color:#007a96;padding:12px 26px;color:#fff;font-size:14px;border-radius:2px;cursor:pointer;display:inline-block;margin-top:12px;line-height:1}#drop a:hover{background-color:#0986a3}#drop input,#upload ul li input{display:none}#upload ul{list-style:none;margin:0 -30px;border-top:1px solid #2b2e31;border-bottom:1px solid #3d4043}#upload ul li{background-color:#333639;background-image:-webkit-linear-gradient(top,#333639,#303335);background-image:-moz-linear-gradient(top,#333639,#303335);background-image:linear-gradient(top,#333639,#303335);border-top:1px solid #3d4043;border-bottom:1px solid #2b2e31;padding:15px;position:relative}#upload ul li p{overflow:hidden;white-space:nowrap;color:#EEE;font-size:16px;font-weight:700;margin-top:20px}#upload ul li b{position:absolute;top:20px;right:60px;font-size:42px;color:#fff}#upload ul li u{position:absolute;right:60px;top:63px}#upload ul li div{background:#0788a5;width:65%;height:4px;bottom:0;left:0;position:absolute}#upload ul li i{font-weight:400;font-style:normal;color:#7f7f7f;display:block}#upload ul li canvas{margin-top:15px;margin-left:32px}#upload ul li span{width:15px;height:12px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQUY1MzY0QUU3QjdFMjExODE0NkUyMUJBNERDNDk0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCOTc5MTBDQ0I3RUYxMUUyOUVBQkNFOURERDIzQkU4NSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCOTc5MTBDQkI3RUYxMUUyOUVBQkNFOURERDIzQkU4NSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQUY1MzY0QUU3QjdFMjExODE0NkUyMUJBNERDNDk0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQUY1MzY0QUU3QjdFMjExODE0NkUyMUJBNERDNDk0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvX6SiYAAAGjSURBVHjanJRPRMRREMfbNtE19hQlolNdomsRaZUiIlHKdiml7CpFolU6pEOWTUTRJZKIakmHsqQ99UedOiT2lG6xRPSdzFtjGi+/ho99836/78z8Zt7bUN3VfElAKwcRkC/9h/AAPIKmsgDCMNgB3ezvB8m8BQZ4/QkmSVwJbsCcR7gOYrz+Av0gQ2WfgWaGvimphEsgLvwRcEQLypxVLy4KP678cbDnHMqc4GZMiQBU2huX62wWbMqSXLenWeDKW1alr4A13QjZ7YT1AmwDLFhd1KOi0naFf8lVmWYdklHuQTXo8g3eOiT07UOgFXy4zcPB2wpTjAdpcA8iVgbs0yTe8dsi90N3NdEUfifYfwBtPCZn9CzF6wJXlGt8Of3JXCVebAAXfOXIxoTQfVJYlk3n9NgIQGc9LfYpaxRcSzHdkD4jwKoStqujXOy2FUBnzPpGRQHODfErePprzjHVHGf1qom/xCTcVlXkPFMoiocNYQ/PM+MLQOIZJexlUUGsZYBOKaYRPAvhieq0DJCUt45uVZ5LrLXGIQJ0uP8uZ98CDADM9WkEBoK0xwAAAABJRU5ErkJggg==) no-repeat;top:34px;right:33px;position:absolute;cursor:pointer}#upload ul li.working span{height:16px;background-position:0 -12px}#upload ul li.error p{color:red}</style>';
    $('head').append(link);
    link = '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=PT+Sans+Narrow:400,700">';
    $('head').append(link);

    // Your code here...
    $("#wrapper_global > div > div > form").after('<form id="upload" method="post" action="https://real-debrid.com/torrents" enctype="multipart/form-data"style="clear: both;top: 15px;position: relative;"><div id="drop">Drop Here<a>Browse</a><input type="file" name="file" multiple /></div><ul><!-- The file uploads will be shown here --></ul></form>');

    var ul = $('#upload ul');
    
    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        formData: {splitting_size: $("#splitting_size").val(), hoster: $("#hoster").val()},

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

            var tpl = $('<li class="working"><p></p><span></span><b>0%</b><u></u><div></div></li>');

            // Append the file name and file size
            tpl.find('p').text(data.files[0].name)
                         .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);

            // Listen for clicks on the cancel icon
            tpl.find('span').click(function(){

                if(tpl.hasClass('working')){
                    jqXHR.abort();
                }

                tpl.fadeOut(function(){
                    tpl.remove();
                });

            });

            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('b').html(progress + "%");
            data.context.find('div').css('width', progress + "%");
			data.context.find('u').html(formatFileSize(data.bitrate/8) + '/s');

            if(progress == 100){
                data.context.removeClass('working');
            }
        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');
        },
        
        stop: function (e) {
            console.log('Uploads finished');
            window.location.href = '';
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }
    
})();
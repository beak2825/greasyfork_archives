// ==UserScript==
// @id             nima-rahbar
// @name           Lynda Video Downloader
// @name:fa        دانلود ویدیوهای سایت لیندا
// @version        1.0.1
// @author         Nima Rahbar
// @namespace      https://www.github.com/nima-rahbar
// @description    Download videos on Lynda.com
// @description:fa دانلود ویدیوهای سایت لیندا بعد از ورود
// @icon           https://nimarahbar.com/wp-content/uploads/2017/07/favicon.png
// @license        MIT
// @match          https://www.lynda.com/*
// @grant          GM_xmlhttpRequest
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/437112/Lynda%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/437112/Lynda%20Video%20Downloader.meta.js
// ==/UserScript==




this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function(){

    if( $('div.col-xs-11.col-md-10.video-name-cont').length != 0 ){
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" type="text/css" />');

        $('<div />', {
            id: "allvids",
            style: "width:100%; max-height:300px; margin:20px 0; padding: 10px 15px; background-color:rgba(51,51,51,.8); color: #fff; overflow-y: auto; border-radius: 5px;",
            html: '<h3>Download Videos</h3>',
        }).appendTo('#course-feedback');

        var defaultTitle = $('.default-title').text();
        var videoList = $('div.col-xs-11.col-md-10.video-name-cont');
        $('#allvids').append('<ul></ul>');
        var vidDown = $('#allvids ul');

        $(videoList).each(function(v_i, item){
            var videoData = $(item).find('a'),
                videoURL = $(videoData).attr('href'),
                rawTitle = trim($(item).find('a').html()),
                forbidden_chars = ['?', ':', '<', '>', '*'],
                wholeTitle = (v_i + 1) + ' - ' + rawTitle.replace(/^\.{1,}(.+)$/m, '$1'); // Remove first dot (if exists)

            for(var i = 0; i < forbidden_chars.length; i++){
                while(wholeTitle.indexOf(forbidden_chars[i]) != -1){
                    wholeTitle = wholeTitle.replace(forbidden_chars[i], "");
                }
            }
            if( v_i < 9 ){
                wholeTitle = "0" + wholeTitle;
            }

            $(vidDown).append( '<li style="margin: 5px 0;"><a class="single-video-download" href="#" data-url="'+videoURL+'" download="' + wholeTitle + '.mp4" style="font-size: 1.2rem; display: inline-block;">' + wholeTitle + '</a></li>' );
        });

        $('.single-video-download').on('click', function(e){
            e.preventDefault();
            var $this = $(this),
                videoURL = $(this).data('url');
            if( $this.siblings('a').length == 0 ){
                $('<div />',{
                    id: 'responseVid'
                }).appendTo( $('body') ).hide();
                $.ajax({
                    url: videoURL,
                    dataType: 'html',
                    beforeSend: function(){
                        $this.after('<span class="fas fa-spinner fa-pulse" style="margin-left: 3px;"></span>');
                    },
                    success: function(response) {
                        $('#responseVid').html($(response));
                        $this.attr('href', $('#responseVid').find('div#courseplayer video.player').data('src'));
                        //window.open( $('#responseVid').find('div#courseplayer video.player').data('src') );
                        $('#responseVid').remove();
                    },
                    complete: function(){
                        $this.siblings('.fa-spinner').fadeOut(600, function(){
                            $this.siblings('.fa-spinner').remove();
                            $this.before('<a href="'+$this.attr('href')+'" download="'+$this.attr('download')+'" style="font-size: 1.2rem; display: inline-block; margin-right: 5px;" target="_blank"><span class="fas fa-download" style="color: #07f907;"></span></a>');
                            $this.siblings('a').hide().fadeIn(1000);
                        });
                    },
                });
            }
        });

        function trim(str){
            return str.replace(/(^\s*)|(\s*$)/g, '');
        }
    }

});
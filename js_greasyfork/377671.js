// ==UserScript==
// @name         MediaInfoOnline.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Javascript API works with MediaInfoLib.
// @author       You
// @match        *
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==
var $ = window.jQuery;
window.MediaInfoOnline = function(input_resource, textarea_mediainfo, input_mediainfo, span_mediainfo, select_format){
    var MediaInfo_lib_instance;
    var result;
    var key;
    var processing = false;
    var keyToParse = 1024 * 1024;
    var cueIn = function(){
        MediaInfo_lib_instance = MediaInfoLib({
            'locateFile': ()=>'',
            'postRun': function(){
                initializeAll();
            }
        });
    };
    var fadeInThenFadeOut = function(span_mediainfo, content, time, color){
        span_mediainfo.text(content).css('color', color).fadeIn(function(){
            $(this).delay(time).fadeOut(function(){
                span_mediainfo.text('');
            });
        });
    }
    var initializeAll = function(){
        $(document).ready(function(){
            var output_formats = JSON.parse(MediaInfo_lib_instance.MediaInfo.Option_Static('Info_OutputFormats_JSON'));
            $.each(output_formats.output, function(e, a){
                select_format.append(
                    $('<option/>', {
                        value: a.name,
                        mime: a.mime
                    }).text(a.desc)
                );
            });
            input_resource.prop('disabled', false);
            DOMEventInit();
        });
    };
    var DOMEventInit = function(){
        input_resource.on('change', function(){
            var input_resource_DOM = $(this)[0];
            if(input_resource_DOM.files.length > 0){
                startParseMediaInfo(input_resource_DOM.files[0]);
            }
        });
        select_format.on('change', function(){
            if(processing){
                input_mediainfo.prop('disabled', true);
                input_mediainfo.attr('value', '稍等');
                regenByType($(this).val(), $(this).find(':selected').attr('mime'));
            }
        });
        input_mediainfo.on('click', function(e){
            e.preventDefault();
            textarea_mediainfo[0].select();
            try{
                var successful = document.execCommand('copy');
                var msg = successful?{'text': '成功', 'color': '#2276BB'}:{'text': '失败', 'color': '#DD8944'};
                fadeInThenFadeOut(span_mediainfo, 'MediaInfo复制' + msg.text, 500, msg.color);
            }
            catch(error){
                fadeInThenFadeOut(span_mediainfo, '无法复制MediaInfo', 500, '#DD8944');
            }
        })
    }
    var regenByType = function(type, mime){
    	result.Option('Inform', 'JSON');
    	window.MediaInfoOnline.json = JSON.parse(result.Inform().trim());
        result.Option('Inform', type);
        input_mediainfo.attr('value', '复制');
        render(mime);
        input_mediainfo.prop('disabled', false);
    };
    var render = function(mime){
        textarea_mediainfo.text(result.Inform().trim());
    };
    var startParseMediaInfo = function(file){
        if(processing){
            processingDone();
        }
        try{
            parseFile(file);
        }
        catch(error){
            alert('Your browser is not compatible.');
        }
    };
    var processingDone = function(){
        result.Close();
        result.delete;
        processing = false;
        input_mediainfo.prop('disabled', false);
        input_mediainfo.attr('value', '复制');
    };
    var parseFile = function(file){
        if(processing){
            return;
        }
        input_mediainfo.prop('disabled', true);
        input_mediainfo.attr('value', '稍等');
        processing = true;
        key = file.name;
        var offset = 0;
        result = new MediaInfo_lib_instance.MediaInfo;
        result.Option('File_FileName', file.name);
        result.Open_Buffer_Init(file.size, 0);
        var seek = function(length){
            if(processing){
                var reader = new FileReader;
                var b = file.slice(offset, offset + length);
                reader.onload = processChunk;
                reader.readAsArrayBuffer(b);
            }
            else{
                processingDone();
            }
        };
        var processChunk = function(event){
            if(event.target.error === null){
                try{
                    var m = result.Open_Buffer_Continue(event.target.result);
                }
                catch(error){
                    processingDone();
                    alert('An error happened reading your file.');
                    return;
                }
                var next_position = result.Open_Buffer_Continue_Goto_Get();
                if(next_position === -1){
                    offset = offset + event.target.result.byteLength;
                }
                else{
                    offset = next_position;
                    result.Open_Buffer_Init(file.size, next_position);
                }
            }
            else{
                processingDone();
                alert('An error happened reading your file.');
                return;
            }
            if(m & 8 || event.target.result.byteLength < 1){
                result.Open_Buffer_Finalize();
                regenByType(select_format.val(), select_format.find(':selected').attr('mime'));
                input_mediainfo.prop('disabled', false);
                input_mediainfo.attr('value', '复制');
                return;
            }
            seek(keyToParse);
        };
        seek(keyToParse);
    };
    return {
        init: cueIn
    };
}
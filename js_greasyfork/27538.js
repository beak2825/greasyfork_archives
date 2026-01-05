// ==UserScript==
// @name         JVC Imgur
// @namespace    Jvc Imgur
// @version      1.0.2
// @description  Uploader vos images sur Imgur
// @author       FriendsBeach
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        http://www.jeuxvideo.com/forums/*
// @connect      imgur.com
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/27538/JVC%20Imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/27538/JVC%20Imgur.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    
    //
// affiche un bouton vers imgur dans la boite nouveau message (ouvre dans un nouvel onglet)
//
var patt2 = /noelshack/;
var groupes_boutons = document.getElementsByClassName("btn-group");

for(i in groupes_boutons)
{
  if (patt2.test(groupes_boutons[i].innerHTML))
  {
     var b = '<button onclick="$(\'#file-imgur\').click();"; class="btn btn-jv-editor-toolbar" type="button" data-edit="imgur" title="Imgur"><span id="ico-img" style="color: #1BB76E;" class="jvcode-image"></span></button>';
     $(groupes_boutons[i]).append(b);
  }
}

    var img="data:image/png;base64,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";

    $('.conteneur-editor').after('<div style="display:none;position:relative;width: 200px; margin-bottom: 10px; margin-top: -5px;" ><input style="position: absolute; top: 0; left: 0; opacity: 0; cursor: pointer; padding: 5px;" id="file-imgur" type="file"><label style="display: block; background: #1BB76E; color: #fff; font-size: 1em; transition: all .4s; cursor: pointer; padding: 5px; text-align: center; font-family: sans-serif; font-size: 13px;border-radius:2px;" for="my-file" class="input-file-trigger" tabindex="0"><img style="height: 18px; margin-right: 5Px;" src="'+img+'"><span id="img-load">Parcourir</span></label></div>');

    $('#file-imgur').on('change', function() {

        var _file = this.files[0];

        $('#ico-img').css('color','#d4d1d1');

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://imgur.com/upload/checkcaptcha",
            data: "total_uploads=1&create_album=true",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Referer': 'https://imgur.com/'
            },
            onload: function(resp) {
                var json = $.parseJSON(resp.responseText);

                var r = new FileReader();
                r.onload = function(e) {
                    var contents = e.target.result;
                    FileTransfer(json.data.new_album_id,contents, _file.type, _file.name);
                };

                r.readAsBinaryString(_file);

            }
        });


        function FileTransfer(id,file, type, UploadFile) {
            var UploadUrl = 'https://imgur.com/upload/';

            var Seperator = '--SeperatorWebkit02390293DJSDxS2'; 
            var _FormData = '--'+Seperator+'\r\n\
Content-Disposition: form-data; name="new_album_id"\r\n\r\n\
'+id+'\r\n\
--'+Seperator+'\r\n\
Content-Disposition: form-data; name="Filedata"; filename="'+UploadFile+'"\r\n\
Content-Type: '+type+'\r\n\
\r\n';

            _FormData += file +'\r\n';

            _FormData += '--'+Seperator+'--\r\n';

            // Daten übertragen
            GM_xmlhttpRequest({
                method: 'POST',
                url: UploadUrl,
                headers: {'Referer': 'https://imgur.com/', 'Content-Type': 'multipart/form-data; boundary='+Seperator },
                data: _FormData,
                binary: true,
                onload:function(response) {
                    if(response.status == 200){
                       var json = $.parseJSON(response.responseText);
                        console.log(json);

                       if(json.success){
                           var url = " https://i.imgur.com/"+json.data.hash + json.data.ext + " ";

                           $('#message_topic').val($('#message_topic').val() + url);

                           $('#ico-img').css('color','#1BB76E');
                           
                       }
                    }
                }
            });

        }

    });

    function verif_imgur(){
        var imgur = new RegExp('^https?://i\.imgur\.com/([A-Za-z0-9]+)((\.png)|(\.jpg)|(\.gif))$');

        $('.previsu-editor a').each(function(){
            var url = ($(this).attr('href'));

            if($(this).attr('data-contenu') == '1' ){
                return true;
            }

            $(this).attr('data-contenu','1');
            var obj = $(this);

            if(imgur.test(url)){
                var match = imgur.exec(url);
                url = "https://i.imgur.com/"+match[1]+"b"+match[2];
                html = "<span><a target='_blank' href='"+url+"' data-contenu='1'><img style='max-width:70;max-height:55px;' src='"+url+"'></a></span>";
                obj.after(html);
                obj.hide();
            }

        });

    }

    setInterval(verif_imgur,1000);

})();
// ==UserScript==
// @name		 GGn New WhatIMG it
// @namespace	 https://gazellegames.net/
// @version		 0.62
// @description	 WhatIMG it script for normal users
// @author		 NeutronNoir
// @include		 https://gazellegames.net/upload.php*
// @include		 https://gazellegames.net/torrents.php?action=editgroup*
// @match      https://whatimg.com/upload.php
// @grant		 GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22963/GGn%20New%20WhatIMG%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/22963/GGn%20New%20WhatIMG%20it.meta.js
// ==/UserScript==

function add_cover_button() {
    $("input[name='image']").after("<a id=\"new_whatimg_it_cover\">WhatIMG it!</a>");
    $("#new_whatimg_it_cover").click(function () {
        var input = $("input[name='image']");
        var data = "--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"userfile[]\"\n\n" + $(input).val();
        data += "\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"upload_to\"\n\n0\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"private_upload\"\n\n1\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"upload_type\"\n\nurl-standard\n--NN-GGn-WhatIMG--";
        var request = new GM_xmlhttpRequest({"method": "POST",								//Send the image URL to WhatIMG
                                           "url": "https://whatimg.com/upload.php",
                                           "headers": {
                                               "Content-type": "multipart/form-data; boundary=NN-GGn-WhatIMG"
                                           },
                                           "data": data,
                                           "onload": function(response) {
                                               if (response.status != 200) alert("Response error " + response.status);
                                               $(input).val($(response.responseText).find(".input_field").val());
                                           }
        });
    });
}

(function() {
    'use strict';
    add_cover_button();
    $("#categories").change( function () {
        setTimeout(add_cover_button, 100);
    });
    $("#image_block").prepend("<div><a id=\"new_whatimg_it\">WhatIMG it!</a></div>");
    $("#new_whatimg_it").click(function () {
        var images = [];
        $("input[name='screens[]']").each( function () {
            if ($(this).val() !== "") images.push($(this).val());
        });
        if (images.length === 0) return;
        var input = $("input[name='screens[]']");
        var data = "--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"userfile[]\"\n\n" + images.join("\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"userfile[]\"\n\n");
        data += "\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"upload_to\"\n\n0\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"private_upload\"\n\n1\n--NN-GGn-WhatIMG\nContent-Disposition: form-data; name=\"upload_type\"\n\nurl-standard\n--NN-GGn-WhatIMG--";
        var request = new GM_xmlhttpRequest({"method": "POST",								//Send the image URL to WhatIMG
                                           "url": "https://whatimg.com/upload.php",
                                           "headers": {
                                               "Content-type": "multipart/form-data; boundary=NN-GGn-WhatIMG"
                                           },
                                           "data": data,
                                           "onload": function(response) {
                                               if (response.status != 200) alert("Response error " + response.status);
                                               var screenshots = $(response.responseText).find(".input_field");
                                               for (var index = 0; index < images.length; index++) $(input).eq(index).val($(screenshots).eq(index*4).val());
                                           }
        });
    });
})();
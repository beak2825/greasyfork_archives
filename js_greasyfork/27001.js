// ==UserScript==
// @name         JVC tweet
// @namespace    Jvc Tweet
// @version      1.0.3
// @description  Lire directement les tweets
// @author       Personne
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @match        http://jvforum.fr/*
// @connect      publish.twitter.com
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/27001/JVC%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/27001/JVC%20tweet.meta.js
// ==/UserScript==

(function() {
	$('.bloc-contenu a,.message__content-text a').each(function(){
		var regex  = new RegExp("^https?://twitter\.com/[A-Za-z0-9_]{1,15}/status(es)?/([0-9]+)");
        var insta = new RegExp("^https?://(www\.)?instagram\.com/p/([A-Za-z0-9_-]+)");
        var face = new RegExp("^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*");
        var face2 = new RegExp("^https:\/\/www\.facebook\.com\/(photo(\.php|s)|permalink\.php|media|questions|notes|[^\/]+\/(activity|posts))[\/?].*");

		var url = ($(this).attr('href'));

        var obj = $(this);

		if(regex.test(url)){
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        "https://publish.twitter.com/oembed?url="+url,
            headers:    {"Content-Type": "application/json"},
            onload:     function (response) {
                         if(response.status == 200){
                             rep = jQuery.parseJSON(response.responseText);
                             obj.after(rep.html);
                         }

                        },
            onerror:    function () {
                        }
        } );

		}

        if(insta.test(url)){
            match = insta.exec(url);
            var id = match[1];
            if(match.length == 3){
               id = match[2];
            }
            html = "<div ><a target='blank_' href='"+match[0]+"'><img style='max-width:250px;max-height:250px;' src='https://instagram.com/p/"+id+"/media/?size=m'></a></div>";
            obj.after(html);
        }

        if(face.test(url) || face2.test(url) ){
           match = face.exec(url);
            
           if(face2.test(url)){
               match = face2.exec(url);
           }
           code = "<script> function resizeIframe(obj) { obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px'; } </script>";
           obj.after(code);
           html = '<iframe src="https://www.facebook.com/plugins/post.php?href='+match[0]+'&width=350&show_text=true" width="350" style="width: 350px;border:none;overflow:hidden" scrolling="no" frameborder="0" onload="resizeIframe(this)" allowTransparency="true"></iframe>';
           obj.after(html);
        }

	});
})();
// ==UserScript==
// @name         JVC contenu
// @namespace    Jvc contenu
// @version      1.0.5
// @description  Lire directement les tweets
// @author       Personne
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @match        http://jvforum.fr/*
// @connect      publish.twitter.com
// @connect      opengraph.io
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/27206/JVC%20contenu.user.js
// @updateURL https://update.greasyfork.org/scripts/27206/JVC%20contenu.meta.js
// ==/UserScript==


(function() {

    get_contenu(true);

    $("body").append('<div id="ytb-player" style="display:none;opacity:0.95;background:black;position:fixed;top:100px;right:40px;width:320px;height:180px;"><div id="contenu-ytb"></div><div id="ytb-close" style="position: absolute; top: -32px; right: 0px;"><img style="width:32px;cursor:pointer;" src="https://cdn0.iconfinder.com/data/icons/very-basic-android-l-lollipop-icon-pack/24/close-128.png"></div></div>');

    $("#ytb-close").click(function(){
        $("#contenu-ytb").html('');
       $("#ytb-player").css('display','none');
    });

    function mydebug(data){
        console.log('[JVC-contenu]');
        console.log(data);
    }



    function get_params(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace( 
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if ( param ) {
            return vars[param] ? vars[param] : null;	
        }
        return vars;
    }


    function get_contenu(interval){
            var getLocation = function(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };
        
        $('.txt-msg a.xXx,.message__content-text a').each(function(){

            var regex  = new RegExp("^https?://(mobile.)?twitter\.com/[A-Za-z0-9_]{1,15}/status(es)?/([0-9]+)");
            var insta = new RegExp("^https?://(www\.)?instagram\.com/p/([A-Za-z0-9_-]+)");
            var face = new RegExp("^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*");
            var face2 = new RegExp("^https:\/\/www\.facebook\.com\/(photo(\.php|s)|permalink\.php|media|questions|notes|[^\/]+\/(activity|posts))[\/?].*");
            var youtube = new RegExp('(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})');

            // console.log("[JVC-Contenu]"+$(this).parent().attr('class'));

            var url = ($(this).attr('href'));

            if($(this).attr('data-contenu') == '1' ){
                return true;
            }

            $(this).attr('data-contenu','1');

            var id;

            var obj = $(this);

            if(youtube.test(url)){

                match = youtube.exec(url);
                id = match[1];

                html = "<div  style='position:relative; ' >";
                html += "<a data-ytb-id='"+id+"' data-ytb='"+url+"' class='contenu-ytb-player' data-contenu='1' style='height: 50px; left: 18%; top: 30%; position: absolute; z-index: 40; opacity: 0.7;' target='blank_' href='"+url+"'><img  style='height: 50px;' src='https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/youtube-128.png'></a>";
                html += "<a data-ytb-id='"+id+"' data-ytb='"+url+"' class='contenu-ytb-player'  data-contenu='1' target='blank_' href='"+url+"'><img style='border-radius: 5px;max-width:250px;max-height:250px;' src='http://img.youtube.com/vi/"+id+"/mqdefault.jpg'></a></div>";
                obj.html(html);

                $('.contenu-ytb-player').click(function(){
                    var lien = $(this).data('ytb');

                    var reg_t  = new RegExp("[&?]t=([0-9a-zA-Z]+)");
                    match = reg_t.exec(lien);

                    var t = "";

                    if(match){
                       t = "&t="+match[1];
                    }

                    var l = get_params(lien);
                    var my_id = $(this).data('ytb-id');

                    l = '<iframe width="320" height="180px" src="https://www.youtube.com/embed/'+my_id+'?autoplay=1'+t+'" frameborder="0" allowfullscreen></iframe>';

                    $('#contenu-ytb').html(l);
                    $('#ytb-player').css('display','block');
                    return false;
                });

                return true;

            }


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

                return true;
            }

            if(insta.test(url)){
                match = insta.exec(url);
                id = match[1];
                if(match.length == 3){
                    id = match[2];
                }
                html = "<div ><a data-contenu='1' target='blank_' href='"+match[0]+"'><img style='max-width:250px;max-height:250px;' src='https://instagram.com/p/"+id+"/media/?size=m'></a></div>";
                obj.html(html);

                return true;
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
                return true;
            }




            var host = getLocation(url);

            host = host.hostname.toLowerCase();
            // var liste =["timesofisrael.com", "france24.com","i24news.tv", "presstv.ir", "prestv.com", "jeuxvideo.com", "m.jeuxvideo.com","fr.sputniknews.com","entreprendre.fr", "lorientlejour.com","francais.rt.com", "gameblog.fr","gamekult.com", "fr.wikipedia.org","en.wikipedia.org", "thesun.co.uk", "jeanmarcmorandini.com", "franceinter.fr", "lemonde.fr", "mobile.lemonde.fr", "mediapart.fr", "blogs.mediapart.fr", "lefigaro.fr","bfmbusiness.bfmtv.com","bfmtv.com", "marianne.net", "numerama.com", "buzzfeed.com", "tv5.org","01net.fr","20minutes.fr","challenges.fr","dna.fr","europe1.fr","france2.fr","france3.fr","france5.fr","latribune.fr","leparisien.fr","lepoint.fr","lepost.fr","Lequipe.fr","lesechos.fr","letelegramme.fr","lexpress.fr","liberation.fr","nouvelobs.com","parismatch.com","radiofrance.fr","rfi.fr","rue89.com","sudouest.fr","telerama.fr","TF1.fr","agoravox.fr","capital.fr","ladepeche.fr","lanouvellerepublique.fr","laprovence.com","lavoixdunord.fr","ledauphine.com","lejdd.fr","leprogres.fr","lesinrocks.com","m6.fr","marianne2.fr","mediapart.fr","nicematin.com","ouest-france.fr","owni.fr","rmc.fr","rtl.fr","slate.fr","maville.com","midilibre.com","metrofrance.com"];

            var  liste = ["google.com", "google.fr", "google.be", "google.ch", "goo.gl", "vid.me", "issoutv.com", "webm.land", "noelshack.com", "image.noelshack.com", "i.imgur.com", "vimeo.com", "hapshack.com", "puu.sh", "dailymotion.com"];

            host = host.replace('www.','');

            if((liste.indexOf(host) == -1)){

                var urlEncoded = encodeURIComponent(url);
                var apiKey = "A MODIFIER";
                var requestUrl = 'http://opengraph.io/api/1.0/site/' + urlEncoded ;

                if(apiKey){
                    requestUrl = 'https://opengraph.io/api/1.0/site/' + urlEncoded + '?app_id=' + apiKey;
                }

                GM_xmlhttpRequest ( {
                    method:     "GET",
                    url:        requestUrl,
                    headers:    {"Content-Type": "application/json"},
                    onload:     function (response) {
                        if(response.status == 200){
                            json = jQuery.parseJSON(response.responseText);

                            if (typeof json.hybridGraph.title !== 'undefined') {
                                html = '<a data-contenu="1" href="'+url+'" target="_blank" style="text-decoration:none;color:black">';
                                html += '<div style="margin-top:5px;margin-bottom:5px;padding:5px;border:1px solid #dedede;background: #f9f9f9;">';
                                console.log(json);
                                if (typeof json.hybridGraph.image !== 'undefined') {
                                    html += '<div class="ope-img" style="margin-right:10px;float: left;height:90px;width:170px; background:url(\''+json.hybridGraph.image+'\') no-repeat ; background-size: cover;background-position: center;">';
                                    html += '</div>';
                                }

                                html += '<div class="contenu" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;height:90px;">';
                                html += '<div class="title" title="'+json.hybridGraph.title +'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;font-weight:bold;margin-bottom:10px;">'+json.hybridGraph.title+'</div>';
                                html += '<div class="description" title="'+json.hybridGraph.description +'" style="height: 50px; overflow: hidden;font-size: 11.5px;white-space: normal; ">'+json.hybridGraph.description+'</div>';
                                html += '<div style="font-size: 8px; float: right; bottom: 5px; color: gray;">'+host+'</div>';
                                html += '</div>';
                                html += '</div></a>';

                                obj.after(html);
                                obj.hide();
                            }

                        }

                    },
                    onerror:    function () {
                    }
                } );

            }


        });


        if(interval === true){
            setInterval(function(){ get_contenu(false); }, 500);
        }
    }
})();
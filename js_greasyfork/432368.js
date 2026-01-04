// ==UserScript==
// @name         Ebay/Search/EmbedSamples
// @namespace    https://greasyfork.org/en/scripts/398577/
// @version      0.5
// @description  if youtube/box/etc link, iframe it
// @author       denlekke
// @match        https://www.ebay.com/sch/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432368/EbaySearchEmbedSamples.user.js
// @updateURL https://update.greasyfork.org/scripts/432368/EbaySearchEmbedSamples.meta.js
// ==/UserScript==

(function(){
    //var title_elements = document.querySelectorAll('a.vip[href^="https://www.ebay.com/itm/"]');
    var title_elements = document.querySelectorAll('a.s-item__link[href^="https://www.ebay.com/itm/"]');

    for (var element in title_elements){
        if (title_elements[element].href){
            try{
                var iid = title_elements[element].href.split('/itm/')[1].split('?')[0];
                console.log(title_elements[element]);
                title_elements[element].parentNode.parentNode.id = iid;
                console.log("id"+title_elements[element].parentNode.parentNode.id);
                getPage(title_elements[element].href,title_elements[element]);
            }catch(error) {
                console.log("error at first function");
                console.error(error);
            }
            //break;
        }
    };
}
)();

function getPage(listing_url,link_element){
    var iid = listing_url.split('/itm/')[1].split('?')[0];
    GM.xmlHttpRequest({
        method: "GET",
        url: listing_url,
        onload: function(response) {
            //console.log("Getting page");
            var listing_text = response.responseText;
            var listing_document = document.createElement( 'html' );
            listing_document.innerHTML=listing_text;
            //console.log(listing_document);
            var desc_url = listing_document.querySelectorAll('iframe[src^="https://vi.vipr.ebaydesc.com"]')[0].src
            var desc = listing_document.getElementsByTagName("iframe");
            var links = null;

            //console.log(desc);
            //console.log(desc_url);
            try{
                var audio_element = getAudio(desc_url,iid,link_element);
            }catch(error) {
                console.error(error);
            }
            return
        }
    });
}

function getAudio(desc_url,iid,link_element){
    console.log(link_element);
    GM.xmlHttpRequest({
        method: "GET",
        url: desc_url,
        onload: function(response) {
            console.log("second get");
            var desc_text = response.responseText.replace('AUDIO','audio').replace('Audio','audio');
            var desc_document = document.createElement( 'html' );
            //var main_div = document.getElementById("RelatedSearchesDF");
            var main_div = $("[id="+iid+"]")
            //var main_div = link_element;
            console.log(main_div);

            desc_document.innerHTML = desc_text;
            var sample_html = '';
            var sample_found = false;
            var youtube = null;
            var vocaroo = null;
            var embedded_mp3 = null;
            var embedded_video = null;
            var box_dot_com = null;

            //elements for injecting new samples
            var sample_div = document.createElement('div');
            sample_div.setAttribute('style', 'width:100%;align:left;');

            var temp_audio_element = document.createElement('audio');
            temp_audio_element.setAttribute('class', 'audio');
            temp_audio_element.setAttribute('style', 'height:"10px";width:100%;align:left;');
            temp_audio_element.setAttribute("controls", "controls");

            //if embedded audios are found
            var audio_list = desc_document.getElementsByTagName('audio');
            if(audio_list != null){
                var temp_src = null;
                for (var i = 0; i < audio_list.length; i++){
                    console.log("in for loop");
                    temp_src = null;
                    //temp_audio_element = null;

                    temp_audio_element = document.createElement('audio');
                    temp_audio_element.setAttribute('id', 'audio_sample'+i);
                    temp_audio_element.setAttribute('class', 'audio');
                    temp_audio_element.setAttribute("controls", "controls");
                    temp_audio_element.setAttribute('style', 'height:"20px";width:100%;align:left;');


                    temp_src = audio_list.item(i).src;
                    if(temp_src == ''){
                        console.log("null"+temp_src);
                        try{
                            temp_audio_element.src = audio_list.item(i).getElementsByTagName('source')[0].src;
                        } catch{
                            console.log("error in audio link source");
                        }
                    }
                    else{
                        temp_audio_element.src = audio_list.item(i).src;
                    }
                    if(temp_src != null){
                        sample_div.append(temp_audio_element);
                    }

                    //console.log(temp_audio_element.src);
                    console.log(sample_div);
                }

                main_div.prepend(sample_div);
                console.log("added audio");
            }

            //if embedded videos are found
            var video_list = desc_document.getElementsByTagName('video');
            if(video_list != null){
                console.log(video_list);
                var temp_video_element = null;
                for (var i = 0; i < video_list.length; i++){
                    console.log("in for loop");
                    temp_video_element = document.createElement('audio');
                    temp_video_element.setAttribute('id', 'video_sample'+i);
                    temp_video_element.setAttribute('class', 'audio');
                    temp_video_element.setAttribute('style', 'height:"20px";width:100%;align:left;');
                    temp_video_element.src = video_list.item(i).getElementsByTagName('source')[0].src;
                    console.log("src"+video_list.item(i).getElementsByTagName('source')[0].src);
                    temp_video_element.setAttribute("controls", "controls");
                    //temp_video_element.setAttribute("autoplay", "true");
                    //temp_video_element.play();
                    sample_div.append(temp_video_element);
                }

                main_div.prepend(sample_div);
                console.log("Added to main div");
            }

            if (desc_text.includes('vocaroo.com')){
                var vocaroo_id = desc_text.split('vocaroo.com/i/')[1].split('<')[0]
                temp_audio_element.setAttribute('id', 'vocaroo_sample');
                temp_audio_element.src = 'https://media.vocaroo.com/mp3/'+ vocaroo_id
                sample_div.append(temp_audio_element);
                main_div.prepend(sample_div);
            }

            if (desc_text.includes('voca.ro')){
                var vocaro_id = desc_text.split('voca.ro/')[1].split('<')[0]
                temp_audio_element.setAttribute('id', 'vocaro_sample');
                temp_audio_element.src = 'https://media.vocaroo.com/mp3/'+ vocaro_id
                sample_div.append(temp_audio_element);
                main_div.prepend(sample_div);
            }

            if (desc_text.includes('clyp.it/')){
                var clypit_id = desc_text.split('clyp.it/')[1].split('<')[0]
                var temp_iframe = document.createElement("iframe");
                temp_iframe.setAttribute('id', 'clypit_sample');
                temp_iframe.setAttribute('class', 'audio');
                temp_iframe.setAttribute('style', 'height:"100px";width:100%;align:left;');
                temp_iframe.setAttribute("controls", "controls");
                temp_iframe.src = 'https://clyp.it/'+clypit_id+'/widget';
                sample_div.append(temp_iframe);
                main_div.prepend(sample_div);
            }
            /*
            if(desc_text.includes("dropbox.com")){
                var mp3_src = desc_text.split('.mp3')[0];
                console.log("mp3src"+mp3_src);
                var index = mp3_src.lastIndexOf('src="');
                console.log(index);
                mp3_src = mp3_src.substring(index+5);
                mp3_src = mp3_src+'.mp3?raw=1';
                console.log(mp3_src);

                var audio_element = document.createElement('audio');
                audio_element.setAttribute('id', 'audio_sample');
                audio_element.setAttribute('class', 'whatever');
                audio_element.setAttribute('width', '500px;');
                audio_element.src = mp3_src;
                audio_element.setAttribute("controls", "controls");
                audio_element.play();

                sample_div.setAttribute('id', 'sample_div');
                sample_div.setAttribute('class', 'itemAttr');
                sample_div.setAttribute('style', 'height="140px";width=100%;');
                main_div.prepend(audio_element);
            }*/
            if(desc_text.includes("https://www.dropbox.com/s/")){
                var links = desc_text.split('https://www.dropbox.com/s/');
                var temp_src = null;
                console.log(links.length);
                for(var i = 1; i < links.length; i++){
                    console.log("for");
                    temp_src = links[i].split('.mp3')[0].split('?dl')[0];
                    temp_src = 'https://www.dropbox.com/s/'+temp_src+'.mp3?raw=1';

                    temp_audio_element = document.createElement('audio');
                    temp_audio_element.setAttribute('id', 'audio_sample'+i);
                    temp_audio_element.setAttribute('class', 'audio');
                    temp_audio_element.setAttribute("controls", "controls");
                    temp_audio_element.setAttribute('style', 'height:"150px";width:100%;align:left;');
                    temp_audio_element.src = temp_src;
                    //temp_audio_element.play();

                    sample_div.append(temp_audio_element);
                }
                main_div.prepend(sample_div);
            }
            if(desc_text.includes("https://app.box.com/s/")){
                var links = desc_text.split("https://app.box.com/s/");
                var temp_src = null;
                console.log(links.length);
                for(var i = 1; i < links.length; i++){
                    console.log("for");
                    temp_src = links[i].split('<')[0];
                    temp_src = "https://app.box.com/s/"+temp_src;

                    temp_iframe = document.createElement('iframe');
                    temp_iframe.setAttribute('id', 'audio_sample'+i);
                    temp_iframe.setAttribute('class', 'audio');
                    temp_iframe.setAttribute("controls", "controls");
                    temp_iframe.setAttribute('style', 'height:150px;width:100%;align:left;');
                    temp_iframe.src = temp_src;
                    //temp_audio_element.play();

                    sample_div.append(temp_iframe);
                }
                main_div.prepend(sample_div);
            }

            if (desc_text.includes('youtube.com')){
                var links = desc_text.split('youtube.com/');
                var temp_src = null;
                var last_src = '';
                console.log(links);
                for(var i = 1; i < links.length; i++){

                    console.log("for");
                    temp_src = links[i].split('<')[0].split('&')[0].replace('watch?v=','').split('?')[0].split('"')[0].replace('embed/','');
                    temp_src = "https://www.youtube.com/embed/"+temp_src;
                    if(!temp_src.includes('.jpg') && temp_src != last_src){
                        temp_iframe = document.createElement('iframe');
                        temp_iframe.setAttribute('id', 'audio_sample'+i);
                        temp_iframe.setAttribute('class', 'audio');
                        temp_iframe.setAttribute("controls", "controls");
                        temp_iframe.setAttribute('style', 'height:150px;width:100%;align:left;');
                        temp_iframe.src = temp_src;
                        last_src = temp_src;
                        //temp_audio_element.play();

                        sample_div.append(temp_iframe);
                    }
                }
                main_div.prepend(sample_div);
            }

            if (desc_text.includes('youtu.be')){
                var links = desc_text.split('youtu.be/');
                var temp_src = null;
                var last_src = '';
                console.log(links);
                for(var i = 1; i < links.length; i++){

                    console.log("for");
                    temp_src = links[i].split('<')[0].split('&')[0].replace('watch?v=','').split('?')[0].split('"')[0].replace('embed/','');
                    temp_src = "https://www.youtube.com/embed/"+temp_src;
                    if(!temp_src.includes('.jpg') && temp_src != last_src){
                        temp_iframe = document.createElement('iframe');
                        temp_iframe.setAttribute('id', 'audio_sample'+i);
                        temp_iframe.setAttribute('class', 'audio');
                        temp_iframe.setAttribute("controls", "controls");
                        temp_iframe.setAttribute('style', 'height:150px;width:100%;align:left;');
                        temp_iframe.src = temp_src;
                        last_src = temp_src;
                        //temp_audio_element.play();

                        sample_div.append(temp_iframe);
                    }
                }
                main_div.prepend(sample_div);
            }
            else{

                /*if (desc_text.includes('youtube.com')){
                    sample_found = true;
                    console.log('youtube found');
                    youtube = desc_text.split('youtube.com/')[1].split('<')[0].split('&')[0].split('?')[0].replace('watch?v=','').replace('embed/','');
                    sample_html = sample_html + '<iframe id="ytplayer" type="text/html" width="51%" height="100"  src="https://www.youtube.com/embed/'+youtube+'?autoplay=1&origin=http://example.com"  frameborder="0"></iframe>'
                }*/

                if(desc_text.includes('4shared.com/mp3')){
                    console.log("4shared found section");
                    var fourshared_iframe = document.createElement('iframe');

                    var fourshared_url = desc_text.split('https://www.4shared.com/mp3/')[1].split('/')[0]
                    fourshared_iframe.src = 'https://www.4shared.com/web/embed/audio/file/'+fourshared_url;
                    fourshared_iframe.setAttribute('style', 'height:"150px";width:530px;align:left;');

                    sample_div.setAttribute('id', 'sample_div');
                    sample_div.setAttribute('class', 'sample');
                    sample_div.setAttribute('style', 'height:"150px";width:100%;align:left;');
                    sample_div.append(fourshared_iframe);
                    main_div.prepend(sample_div);
                }

                if (sample_found){
                    console.log("embedding div section");
                    sample_div.setAttribute('id', 'sample_div');
                    sample_div.setAttribute('class', 'itemAttr');
                    sample_div.innerHTML = sample_html;
                    main_div.prepend(sample_div);
                }
            }
            console.log(sample_div);
            return sample_div;
        }

    });

    document.addEventListener('seeking', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
            if(audios[i] === e.target){
                audios[i].play();
            }
        }
    }, true);
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
        }
    }, true);

}
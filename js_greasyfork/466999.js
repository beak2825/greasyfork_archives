// ==UserScript==
// @name         WaniKani Item Review Summary
// @namespace    wanikani
// @version      0.3
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description  A quick Review item summary plugin that will show the meaning and readings next to the kanji upon the submission of an answer.
// @author       Ricardo Neves
// @match        https://www.wanikani.com/subjects/review
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466999/WaniKani%20Item%20Review%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/466999/WaniKani%20Item%20Review%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if WFOF is installed
    if (!window.wkof) {
    alert('[Your script name here] script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
    }

    let jquery_url = "https://code.jquery.com/jquery-3.7.0.min.js";
    let lodash_url = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
    var promises = [];
    promises[0] = wkof.load_script(jquery_url, true /* use_cache */);
    promises[1] = wkof.load_script(lodash_url, true /* use_cache */);

    // Wait until all files are loaded, then do something
    Promise.all(promises).then(start_script);


    function add_furigana(reading, word){
        const furigana = _.difference(reading.split(""), word.split("")).join("")
        const kana = reading.replace(furigana, "")
        const kanji = word.replace(kana,"")
        const out = word.replace(kanji, "<ruby>"+kanji+"<rt style='font-size: var(--font-size-large);'>"+furigana+"</rt></ruby>")
        return  out
    }


    // This function is called when all the files requested above are loaded.
    function start_script() {

        $( document ).ready(function() {

            let btn = document.getElementsByClassName('quiz-input__submit-button')[0]
            $('.character-header__characters').after('<div id="WKIRS-content-right" class="WKIRS-content-right" style="border-radius: 5px;box-shadow: inset 0 -3px 1px rgba(0,0,0,0.2), inset 0 3px 1px rgba(0,0,0,0);background-color:rgb(255 255 255 / 30%);width: 20em;min-height: 6em; margin: 1em; padding: 0.5em;"></div>');
            $('#WKIRS-content-right').hide()
           function extract_subject_info(){

               // cleanup
               if($("#user-response").attr('enabled')==='true'){
                   //$('#WKIRS-content-left').html("")
                   $('#WKIRS-content-right').hide()
                   $('#WKIRS-content-right').html("")
                   return;
               }



               let subj_url = document.getElementsByClassName("additional-content__item additional-content__item--item-info")[0].getAttribute("href")
               if(subj_url!=="/subject_info/:id"){
                   let subj_id = subj_url.replace("/subject_info/","")
                   wkof.Apiv2.fetch_endpoint('subjects/'+subj_id).then((subj)=>{

                       let meanings=subj['data']['meanings'];
                       let readings=subj['data']['readings'];
                       let pos=subj['data']['parts_of_speech'];
                       let sentences=subj['data']['context_sentences'];


                       // create content to display

                       var content_right = "<p style='font-weight: var(--font-weight-bold); margin-bottom:1em;'>"+meanings.map(s=>s.meaning).join(", ")+"</p>"
                       // Get readings
                       if(subj.object==='vocabulary'){
                           if($(".quiz-input__question-type")[0].innerHTML === "reading"){
                               var reading = readings.map(s=>s.reading).join("<br>")
                               var kanji_div = $(".character-header__characters")[0]
                               var kanji_content = kanji_div.innerHTML
                               var furigana = add_furigana(reading, kanji_content)
                               kanji_div.setHTML(furigana)
                           }

                           content_right += "<p  style='font-size: var(--font-size-small); font-style: italic;'>"+pos.join(", ")+"</p><br>"// + content_right
                       }

                       if(subj.object==='kanji'){
                           let _readings = _.groupBy(readings, 'type')
                           if(_.has(_readings, 'onyomi')){
                               content_right += "<p> On: "+_readings['onyomi'].map(s=>s.reading).join(', ')+"</p>"
                           }
                           if(_.has(_readings, 'kunyomi')){
                               content_right += "<p style='line-height:var(--spacing-xloose)'> Kun: "+_readings['kunyomi'].map(s=>s.reading).join(', ')+"</p>"
                           }
                       }
                       // insert data into display areas
                       $('#WKIRS-content-right').html(content_right)
                       $('#WKIRS-content-right').show()
                   });

               }
           }

           btn.addEventListener('click', ()=>setTimeout(extract_subject_info, 10))

       });

    };





   //get subject id


})();
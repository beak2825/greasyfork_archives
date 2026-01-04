// ==UserScript==
// @name        beautify- unibe.ch
// @namespace   Violentmonkey Scripts
// @match       https://zika.ispm.unibe.ch/assets/data/pub*
// @grant       GM_openInTab
// @version     1.1
// @author      -
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at      document-end
// @description 7/22/2022, 8:42:45 PM Script that applies basic haby regex bassed formatting to abstract for the covid screeining, verificaiton apps. Also has the ability to preload the DOI or URL in a new tab for the tompost item based on the violentmonkey tabcontrol API.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453412/beautify-%20unibech.user.js
// @updateURL https://update.greasyfork.org/scripts/453412/beautify-%20unibech.meta.js
// ==/UserScript==


// global variable to hold already processed ids
processed_rows = new Map();
console.log("mapsize"+processed_rows.size);


written_nrecords = false;





// add custom checbpoxes
$('div.container-fluid h2').remove();
$('<input />', { type: 'checkbox', id: 'prlcheckbox', checked: true }).prependTo($("body div.container-fluid"));
$("body div.container-fluid").prepend($(document.createElement('label')).prop({
            for: 'prlcheckbox'
        }).html('&nbsp;Toggle tab preloading: '));


$('<input />', { type: 'checkbox', id: 'tfcheckbox', checked: true }).prependTo($("body div.container-fluid")).change(function(){


    console.log("formatting toggled..");
    rowItems = $("html body div.container-fluid div.row div.row").each(function(index){

      if($('#tfcheckbox').prop('checked')){
         abel = $(this).find("div.col-sm-7 h4, div.col-sm-7 h5");
         abel.html(abel.data('pabstract'));
      }
      else{
         abel = $(this).find("div.col-sm-7 h4, div.col-sm-7 h5");
         abel.html(abel.data('oabstract'));
      }

    });
 });


$("body div.container-fluid").prepend($(document.createElement('label')).prop({
            for: 'tfcheckbox'
        }).html('Toggle formatting: '));

$("body div.container-fluid").prepend("<h4>Covid Verification</h4>")

// check for rows periodically (to detect if some data has been loaded))
setInterval(function () {

  // find all elements with ids
  console.log("fetching rows...");

  // rowItems = $("html body div.container-fluid div.row div#rcid_12501.row").each(function(index){ // only speciific id
  rowItems = $("html body div.container-fluid div.row div.row").each(function(index){


    id = $(this).attr('id');

    if(index == 0 & !$(this).data('preloaded') && $('#prlcheckbox').prop('checked')){

      links =  $('div.col-sm-7 div a');

      curl = null

      // DOI NA?
      if(links.eq(0).prop("href") != "http://dx.doi.org/NA"){
        curl = links.eq(0).prop("href");
        links.eq(0).css('background-color', '#55FF55'); // green doi
      }
      else{
        // red bakcground doi
        links.eq(0).css('background-color', '#AA5555');
        links.eq(1).css('background-color', '#55FF55'); // green url
      }

      if(!curl && links.eq(1).prop("href") != "NA"){ // url NA?
        curl = links.eq(1).prop("href");
      }
      else {

        // bakcground red url
          links.eq(1).css('background-color', '#AA5555');
      }

      if(curl != "")
      {
        tc = GM_openInTab(curl, { active: false });

        console.log("opened new tab for index " + index + ": ");
        console.log(tc);
        //window.focus();

        console.log("subbutton: ");
        subbutton = $(this).find("button.action-button");
        console.log(subbutton);

        subbutton.on("click", { 'tc':tc, 'rowid':id }, function(ev){


        if(ev.data.tc && ev.data.rowid){

          // set timeout to check if row still exists.. sadly did not get it to work otheriwse
          setTimeout(function(data) {

            console.log("timeout fired");
            console.log(data);

            // check if row still exists
            itemrow = $("#" + data.rowid);
            console.log(itemrow);

            if(!itemrow.length){
              console.log("row not existing anymore, closing tab");
              data.tc.close();
            }
          }, 1000, ev.data);
        }

        });

        $(this).data('preloaded', true);
      }
      else{
        console.log("No valid url to preload");
      }
    }


    // process row if not yet done
    if(!processed_rows.has(id)){

          console.log("processing html string...");
          $(this).find("div.col-sm-7 h4, div.col-sm-7 h5").each(function(index){

            abstract = $(this).html();

            // save original
            $(this).data('oabstract', abstract);

            //console.log( $(this).html());

            // remove original highlighting
            abstract = abstract.replaceAll(new RegExp('<mark style="background-color:#ffee6f">(.*?)</mark>', "gi"), " $1 ");
            abstract = abstract.replaceAll(new RegExp('<mark style="background-color:#90EE90">(.*?)</mark>', "gi"), " $1 ");

            // console.log(abstract);

            // remove opening and closing ovid:br tags , not sure what they do...
            abstract = abstract.replaceAll(new RegExp("<ovid:br>", "gi"), "");
            abstract = abstract.replaceAll(new RegExp("</ovid:br>", "gi"), "");

            // single word processing
            ab_array = abstract.split(" ");

            for(let i = 0; i < ab_array.length; i++){

              // try to hit section headings and boldify
              ab_array[i] = ab_array[i].replaceAll(new RegExp("([A-Za-z()]{3,} ?:)", "gi"), "<br><b>$1</b>");

              // highlight
              // neutral
              //months (from https://regexpattern.com/month-name/)

              // ab_array[i] = ab_array[i].replaceAll(new RegExp("^(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)$", "gi"),
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$", "gi"),
                                            "<mark style='background-color:#f3e091;'>$1</mark>");
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(January|February|March|April|May|June|July|August|September|October|November|December)$", "gi"),
                                            "<mark style='background-color:#f3e091;'>$1</mark>");

              //years
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(2020|2021|2022)$", "gi"), "<mark style='background-color:#f3e091'>$1</mark>");

              // we
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(we)$", "gi"), "<mark style='background-color:#FAFF58'>$1</mark>");

              // negative (redish color)
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(review)$", "gi"), "<mark style='background-color:#ff7d7d'>$1</mark>");

              // positive (greenish color)
              ab_array[i] = ab_array[i].replaceAll(new RegExp("^(variant)$", "gi"), "<mark style='background-color:#0cd7aa'>$1</mark>");

            }

            abstract = ab_array.join(" ");

            // insert linebreaks at dots to make mor readable
            ab_arr = abstract.split(new RegExp("(?<=[A-Za-z_]{2})\\.", "g"));

            pabstract = (ab_arr.join(".<br>"));



            // console.log(ab_arr);
            $(this).data('pabstract', pabstract);

            // mark as processed
            processed_rows.set(id, true);





          });

          // verification previous decision green or red
          $(this).find("div.col-sm-5 h4 b:first-child").each(function(index){

            if($(this).html() == "Yes"){
              $(this).css("background-color", "green");
            }
            else if($(this).html() != "Yes") {
              $(this).css("background-color", "red");

            }
          });

        // initial processing
        if($('#tfcheckbox').prop('checked')){

           abel = $(this).find("div.col-sm-7 h4, div.col-sm-7 h5");
           abel.html(abel.data('pabstract'));
        }
        else{

            abel = $(this).find("div.col-sm-7 h4, div.col-sm-7 h5");
           abel.html(abel.data('oabstract'));
        }

    }
    else {

      console.log("already processed")
    }



  });

  if(!written_nrecords){

    $("#login_response").after("<span id='nrecords'> # items: " + rowItems.length + " </span>");
    written_nrecords = true;
  }
  else{
    $("#nrecords").replaceWith("<span id='nrecords'> # items: " + rowItems.length + " </span>");

  }


}, 1000); // Execute every second


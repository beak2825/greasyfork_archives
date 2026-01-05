// ==UserScript==
// @name        Wanikani Lesson Tab Transmutation
// @namespace   mempo
// @description Change the order of lesson tabs
// @include     https://www.wanikani.com/lesson/session
// @version     1.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/17050/Wanikani%20Lesson%20Tab%20Transmutation.user.js
// @updateURL https://update.greasyfork.org/scripts/17050/Wanikani%20Lesson%20Tab%20Transmutation.meta.js
// ==/UserScript==

var settingsKanji = "";
var settingsVocab = "";

var vocReorderReadingOption = false;

//ATTENTION: It's only possible to choose one of the options below.
//If you select multiple, only the last one will work
var kanReorderExamplesOption = true;
var kanReorderReadingOption  = false;
var kanReorderExamplesReadingOption  = false;

console.log('START OF WLTT');


var intervalFunction  = setInterval(function(){
  if($('#loading-screen').css('display') !== 'none'){
    console.log('WLTT loading...');
  }else{
    console.log("WLTT LOADED");
    clearInterval(intervalFunction);
  
    WLTTreorder();
    $.jStorage.listenKeyChange('l/currentLesson', WLTTreorder);
    
    addSettings();    
    addButtons();
    addStyle(cssModalWindow);
    fetchSettings();

  } 
},250);

var WLTTreorder = function(){
  
    if($.jStorage.get('l/currentLesson').kan){ //kanji
      //console.log('/// the current lesson is kanji');

      //radical examples meaning reading
      if(kanReorderExamplesOption){
         kanReorderExamples();
      }
      
      //radical reading meaning examples
      if(kanReorderReadingOption){
         kanReorderReading();
      }
      
      //radical examples reading meaning
      if(kanReorderExamplesReadingOption){
         kanReorderExamplesReading();
      }

    }else{//vocab
      //console.log('/// the current lesson is vocab');
      
      //breakdown reading meaning
      if(vocReorderReadingOption){
         vocReorderReading();
      }

    }
}



var kanReorderExamples = function(){
        $('#supplement-nav li:nth-child(2)')[0].innerHTML = "Examples";
        $('#supplement-nav li:nth-child(3)')[0].innerHTML = "Meaning";
        $('#supplement-nav li:nth-child(4)')[0].innerHTML = "Reading";
        $('#supplement-kan-meaning').appendTo('#supplement-kan');
        $('#supplement-kan-reading').appendTo('#supplement-kan');
}

var kanReorderReading = function(){
        $('#supplement-nav li:nth-child(2)')[0].innerHTML = "Reading";
        $('#supplement-nav li:nth-child(3)')[0].innerHTML = "Meaning";
        $('#supplement-kan-meaning').appendTo('#supplement-kan');
        $('#supplement-kan-related-vocabulary').appendTo('#supplement-kan');
}

var kanReorderExamplesReading = function(){
        $('#supplement-nav li:nth-child(2)')[0].innerHTML = "Examples";
        $('#supplement-nav li:nth-child(3)')[0].innerHTML = "Reading";
        $('#supplement-nav li:nth-child(4)')[0].innerHTML = "Meaning";
        $('#supplement-kan-reading').appendTo('#supplement-kan');
        $('#supplement-kan-meaning').appendTo('#supplement-kan');
}

var vocReorderReading = function(){
        $('#supplement-nav li:nth-child(2)')[0].innerHTML = "Reading";
        $('#supplement-nav li:nth-child(3)')[0].innerHTML = "Meaning";
        $('#supplement-voc-meaning').appendTo('#supplement-voc');
}

var cssModalWindow = ".white_content {" +
	                    "display: none;"+
                          "position: absolute; "+
                          "top: 25%;"+
                          "left: 25%;"+
                          "width: 50%;"+
                          "height: 75%;"+
                          "padding: 16px;"+
                          "background-color: white;"+
                          "z-index:9002;"+
                          "letter-spacing: 0;" +
                          "overflow: auto;";

var htmlModalWindow = '' +
  '<h1>Settings</h1>' +
  '<form action="#" method="get"> ' +
  '  <h2>Kanji</h2>' +
   ' <input id="k_option1" name="kanji_option" value="0" type="radio">' +
    '<label for="k_option1">None</label> <br>' +
    '<input id="k_option2" name="kanji_option" value="1" type="radio">' +
    '<label for="k_option2">Radical examples meaning reading (default) </label>  <br>' +
    '<input id="k_option3" name="kanji_option" value="2" type="radio">' +
    '<label for="k_option3">Radical reading meaning examples </label>  <br>' +
    '<input id="k_option4" name="kanji_option" value="3" type="radio">' +
    '<label for="k_option4">Radical examples reading meaning</label>  <br>' +
    '<h2>Vocab</h2>' +
    '<input id="v_option1" name="vocab_option" value="0" type="radio">' +
    '<label for="v_option1">None</label> <br>' +
    '<input id="v_option2" name="vocab_option" value="1" type="radio">' +
    '<label for="v_option2">Breakdown reading meaning</label> <br /> <br />' +
  '</form>'+
   ' <div id="btn_submit">Save Settings</div>'+
    '<div id="settings_saved" style="display: none; padding: 5px;">Settings saved!</div>';
    

var addButtons = function () {
    $("<div />", {
        id : "WLTT_button",
        title : "Settings: Wanikani Lesson Tab Transmutation",
    })  .text("WLTT Settings")
        .css({"background-color":"#738994"})
        .css({"opacity":"1"})
        .css({"display":"inline-block"})
        .css({"font-size":"0.8125em"})
        .css({"color":"#FFF"})
        .css({"cursor":"pointer"})
        .css({"padding":"10px"})
        .css({"vertical-align":"bottom"})
        .on("click", showSettings)
        .prependTo("footer");
};

var addSettings = function(){
      //<div id="light" class="white_content">This is the lightbox content. <a href = "javascript:void(0)" onclick = "document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'">Close</a></div>
      //<div id="fade" class="black_overlay"></div>
      
      $("<div />", {
        id : "light",
        class : "white_content",
      }).appendTo("#lessons");
      
      $("#light").html(htmlModalWindow);
      $("#btn_submit")
            .on("click", saveSettings)
            .css({"background-color":"#738994"})
            .css({"display":"inline"})
            .css({"color":"white"})
            .css({"padding":"5px"})
            .css({"border-radius":"5px"});
      
      $("<div />", {
        id : "fade",
        class : "black_overlay",
      })
        .css({"display":"none"})
        .css({"position":"fixed"})
        .css({"top":"0%"})
        .css({"left":"0%"})
        .css({"width":"100%"})
        .css({"height":"100%"})
        .css({"background-color":"black"})
        .css({"z-index":"9001"})
        .css({"opacity":"0.8"})
        .css({"-moz-opacity":"0.8"})
        .css({"filter":"alpha(opacity=80)"})
        .on("click", hideSettings)
        .appendTo("#lessons");
}

var showSettings = function () {
      document.getElementById('light').style.display='block';
      document.getElementById('fade').style.display='block';
}

var hideSettings = function () {
      document.getElementById('light').style.display='none';
      document.getElementById('fade').style.display='none';
      document.getElementById('settings_saved').style.display='none';

}

var fetchSettings = function() {
      settingsKanji = $.jStorage.get('WLTT_Settings_Kanji');
      settingsVocab = $.jStorage.get('WLTT_Settings_Vocab');
      
      refreshOrdering();
      
      if(settingsKanji){
            switch(settingsKanji){
                  case "0": $("#k_option1").prop("checked", true); break;
                  case "1": $("#k_option2").prop("checked", true); break;
                  case "2": $("#k_option3").prop("checked", true); break;
                  case "3": $("#k_option4").prop("checked", true); break;
            }
            switch(settingsVocab){
                  case "0": $("#v_option1").prop("checked", true); break;
                  case "1": $("#v_option2").prop("checked", true); break;
            }
            
      }else{ // init
           
           //Default option: KanjiOption1 && VocabOption0
           $.jStorage.set('WLTT_Settings_Kanji',"1");
           $.jStorage.set('WLTT_Settings_Vocab',"0");
           settingsKanji = "1";
           settingsVocab = "0";
           $("#k_option2").prop("checked", true); 
           $("#v_option1").prop("checked", true); 
           
      }
}

var saveSettings = function() {
      console.log('WLTT: Settings saved!');
      settingsKanji = $('input[name=kanji_option]:checked').val();
      settingsVocab = $('input[name=vocab_option]:checked').val();
      
      $.jStorage.set('WLTT_Settings_Kanji',settingsKanji);
      $.jStorage.set('WLTT_Settings_Vocab',settingsVocab);
      
      refreshOrdering();
      
      $("#settings_saved").css('display', "block");
}

var refreshOrdering = function() {
      switch(settingsKanji){
                  case "0":
                       kanReorderExamplesOption = false;
                       kanReorderReadingOption  = false;
                       kanReorderExamplesReadingOption  = false; break;
                  case "1": 
                       kanReorderExamplesOption = true;
                       kanReorderReadingOption  = false;
                       kanReorderExamplesReadingOption  = false; break;
                  case "2": 
                       kanReorderExamplesOption = false;
                       kanReorderReadingOption  = true;
                       kanReorderExamplesReadingOption  = false; break;
                  case "3": 
                       kanReorderExamplesOption = false;
                       kanReorderReadingOption  = false;
                       kanReorderExamplesReadingOption  = true; break;
            }
            switch(settingsVocab){
                  case "0": vocReorderReadingOption = false; break;
                  case "1": vocReorderReadingOption = true; break;
            }
      
      WLTTreorder();
}

function addStyle(aCss) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (head) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}



// RESEARCH CODE - for educational purposes

//////////////// ATTEMPT #1
      //Moves content, but internal counter li.active.data(index) jumps to 2
      //Therefore, meaning is skipped altogether dispite index===1
      //Manually selecting tabs really fucks shit up.
      //$('#supplement-nav li:nth-child(3)').data("index",1);
      //$('#supplement-nav li:nth-child(2)').data("index",2);
//////////////// ATTEMPT #2
      /*
      //moves needle out of order
      //completes cycle
      //shows meaning -> reading
      $('#supplement-nav li:nth-child(3)').attr('data-index', 1); 
      $('#supplement-nav li:nth-child(2)').attr('data-index', 2);
      */
//////////////// ATTEMPT #3
      /* 
      //Works, but fucks up page content every other item
      //Cause unknown
      var meaning = $('#supplement-voc-meaning').html();
      var reading = $('#supplement-voc-reading').html();

      $('#supplement-voc-reading').html(meaning);
      $('#supplement-voc-meaning').html(reading);

      $('#supplement-nav li:nth-child(2)')[0].innerHTML = "Reading";
      $('#supplement-nav li:nth-child(3)')[0].innerHTML = "Meaning";
      */

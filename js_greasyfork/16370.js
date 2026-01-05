// ==UserScript==
// @name       WaniKani Item Annotator
// @namespace   mempo
// @description Annotates radical, kanji and vocab pages with SRS colours. Original script by jeshuamorrissey.
// @author     Mempo
// @version    1.3.2
// @include http://www.wanikani.com/radical*
// @include http://www.wanikani.com/kanji*
// @include http://www.wanikani.com/vocabulary*
// @include http://www.wanikani.com/account*
// @include https://www.wanikani.com/radical*
// @include https://www.wanikani.com/kanji*
// @include https://www.wanikani.com/vocabulary*
// @include https://www.wanikani.com/account*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       none  
// @downloadURL https://update.greasyfork.org/scripts/16370/WaniKani%20Item%20Annotator.user.js
// @updateURL https://update.greasyfork.org/scripts/16370/WaniKani%20Item%20Annotator.meta.js
// ==/UserScript==

var $ = jQuery;

console.log('@@@@ start of WaniKani Item Annotator');

  var apiKey = 'b998b40a4587405b3ca65fa03705dce4';

  if(apiKey === null){ //not initialized yet
    console.log('#### no apiKey found');
    
    if (window.location.href.indexOf('account') != - 1) {
          apiKey = "" + retrieveAPIkey();
          console.log('@@@@@' + apiKey);
          $.jStorage.set('WIA_apiKey', apiKey);
    } else {
          var okcancel = confirm('WaniKani Item Annotator has no API key entered!\nPress OK to go to your settings page and retrieve your API key!');
          if (okcancel == true) {
              window.location = 'https://www.wanikani.com/settings/account';
              return;
          }
    }
  }

  console.log('#### apiKey is: ' + apiKey);
    
  
  // Determine which API call we are going to make.
  var target = 'kanji';
  if (window.location.href.indexOf('vocabulary') >= 0) {
    target = 'vocabulary';
  } else if (window.location.href.indexOf('radicals') >= 0) {
    target = 'radicals';
  }

  //console.log('@@@ target is: ' + target);
  
  var css = 
    '.WIA_apprentice {' +
    '    background: #f100a0 linear-gradient(to bottom,#f0a,#dd0093) !important;' +
    '    border-color: #f100a0 !important;' +
    '}                          ' +  
    '.WIA_guru {' +
    '    background: #882d9e linear-gradient(to bottom,#aa38c6,#882d9e) !important;' +
    '    border-color: #882d9e !important;' +
    '}                          ' + 
    '.WIA_master {' +
    '    background: #294ddb linear-gradient(to bottom,#5571e2,#294ddb) !important;' +
    '    border-color: #294ddb !important;' +
    '}                          ' + 
    '.WIA_enlighten {' +
    '    background: #0093dd linear-gradient(to bottom,#0af,#0093dd) !important;' +
    '    border-color: #0093dd !important;' +
    '}                          ' ;


  // ADD CSS
  addStyle(css);

  // Load the API data.


console.log('before API call');

  $.get(apiURL(target), function(xhr) {
    // Parse the response.
    /*
    console.log("###### JSON RESPONSE");
    console.log(xhr);
    */
    

    // Build up an item mapping from Kanji --> Information
    var itemMapping = {};

    // Get the actual request information. If the target is vocabulary, for some reason
    // we have to got an additional level into 'request_information.general'. This is
    // probably to account for specialised vocab which will be added later.
    var information = xhr.requested_information;
    if (target === 'vocabulary') {
      information = information.general;
    }

    for (var i in information) {
      var item = information[i];

      // Extract the character (Kanji) from the item.
      var character = item.character;

      // If we are looking at radicals, use the meaning instead (convert the meaning to
      // the 'user friendly' format).
      if (target === 'radicals') {
        character = item.meaning.toLowerCase();
      }

        //console.log("ITEMMAPPING CHARACTER:" + character);

      // Get the SRS level from the item. The 'user_specific' object will be `null` if the item
      // hasn't been unlocked yet. In this case, just set the SRS level to `null`.
      var srs = null;
      if (item.user_specific) {
        srs = item.user_specific.srs;
      }

      // Build the mapping for this character.
      itemMapping[character] = {
        'srs': srs
      };
    }
    /*
   console.log('&&&&& ITEM MAPPING');
   console.log(itemMapping);
*/
    // Actually do stuff with this mapping.
    main(itemMapping, target);
  });

  /**
   * Mapping of SRS --> Object, where the object contains a series
   * of transformation colors. These transformations will be applied
   * via the element.style property, so should have priority.
   */



/**
   * Main function: actually annotate the elements. Takes as input information from
   * the WK API as a mapping from Japanese Element --> Object. In this case, the
   * object need only contain the SRS level of the element.
   */
  function main(itemMapping, target) {
    //console.log('inside main function');

    // Find all characters on the page.
    var elements = $('.character-item');
    
    //console.log('size of elements is ' + elements.size());
    var i= 0;
    for (i=0;i<elements.length;i++) {
      var element = elements[i];
      //console.log("elements:" + element);
      
      
     
      
      /*
      // If this isn't actually an element (could happen, who knows), just skip it.
      if (!element.querySelector || !element.style) {
        console.log('///////////////////////////// What the shit why are we here.');
        continue;
      }
      */


      // The japanese value to look up in the item mapping is the text of this element.
      var japanese = element.querySelector('.character').innerText;

      // If we happen to be looking at radicals, some of them use pictures instead. It is
      // simpler to use the radical meaning in this case (as there is only one meaning).
      // The meaning is stored in the last list element within the element (for some reason
      // there is a &nbsp; list element first).
      if (target === 'radicals') {
        var radicalLink = element.querySelector('a').getAttribute('href');
        japanese = radicalLink.slice(radicalLink.lastIndexOf('/') + 1);
        //console.log('@@@@@ ' + japanese);
      }

/*
      console.log('@@@@@ japanese var:');
      console.log(japanese);
      console.log(itemMapping[japanese]);

      */

      // If we couldn't find the SRS information for the element, or the element hasn't been unlocked
      // yet, just ignore it.
      /*
      if (!japanese.srs) {
        console.log('///////////// What are you doing here????');
        continue;
      }
      */
      
   

      // Find the corresponding colors. 
      //var colors = colorDict[japanese.srs];
      
      $(element).addClass("WIA_" + itemMapping[japanese].srs);
      
    }
  }
    
    
function retrieveAPIkey() { 
  var apiKey = document.getElementById('user_api_key').value;
  alert('API key was set to: ' + apiKey);
  if (apiKey) {
    return apiKey;
  }
  
}

function apiURL(target){
  return 'https://www.wanikani.com/api/user/' + apiKey + '/' + target;
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


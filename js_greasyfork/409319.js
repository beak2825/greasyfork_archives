// ==UserScript==
// @name         Вывод средств на карты
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://melbet.com/ru/office/deduce/
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/409319/%D0%92%D1%8B%D0%B2%D0%BE%D0%B4%20%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D1%80%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/409319/%D0%92%D1%8B%D0%B2%D0%BE%D0%B4%20%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D1%80%D1%82%D1%8B.meta.js
// ==/UserScript==

//GM_SuperValue.set("team1Name", team1Name);

(function() {
    'use strict';
    var key =  localStorage.getItem("key");
    

  //alert(2);
var settings_gmc = new GM_configStruct(
    {
      'id': 'MyConfig', // The id used for this instance of GM_config
        'title': 'Настройки для вывода', // Panel Title
      'fields': // Fields object
      {

        'card1': // This is the id of the field
        {'labelPos': 'above',
          'label': 'Карта 1 (Alt + 1)', // Appears next to field
          'type': 'text', // Makes this setting a text field
    
          'default': '0000 0000 0000 0000' // Default value if user doesn't change it
        },
        'system1':
        {
          'label': 'Система', // Appears next to field
          'type': 'select', // Makes this setting a dropdown
          'options': ['Visa', 'MasterCard'], // Possible choices
          'default': 'Visa' // Default value if user doesn't change it
        },


        'card2': // This is the id of the field
        {'labelPos': 'above',
          'label': 'Карта 2 (Alt + 2)', // Appears next to field
          'type': 'text', // Makes this setting a text field
    
          'default': '0000 0000 0000 0000' // Default value if user doesn't change it
        },
        'system2':
        {
          'label': 'Система', // Appears next to field
          'type': 'select', // Makes this setting a dropdown
          'options': ['Visa', 'MasterCard'], // Possible choices
          'default': 'Visa' // Default value if user doesn't change it
        },

        'card3': // This is the id of the field
        {'labelPos': 'above',
          'label': 'Карта 3 (Alt + 3)', // Appears next to field
          'type': 'text', // Makes this setting a text field
    
          'default': '0000 0000 0000 0000' // Default value if user doesn't change it
        },
        'system3':
        {
          'label': 'Система', // Appears next to field
          'type': 'select', // Makes this setting a dropdown
          'options': ['Visa', 'MasterCard'], // Possible choices
          'default': 'Visa' // Default value if user doesn't change it
        },

        'sum': // This is the id of the field
        {'labelPos': 'above',
          'label': 'Сумма', // Appears next to field
          'type': 'text', // Makes this setting a text field
    
          'default': '5000' // Default value if user doesn't change it
        }

      }
    
    
        ,'events': {
            'init': function() {
                this.set('card1', localStorage.getItem('card1'));
                this.set('card2', localStorage.getItem('card2'));
                this.set('card3', localStorage.getItem('card3'));

                this.set('system1', localStorage.getItem('system1'));
                this.set('system2', localStorage.getItem('system2'));
                this.set('system3', localStorage.getItem('system3'));

                this.set('sum', localStorage.getItem('sum'));
                
                
            },
        'save': function(){
            localStorage.setItem('card1', this.get('card1'));
            localStorage.setItem('card2', this.get('card2'));
            localStorage.setItem('card3', this.get('card3'));

            localStorage.setItem('system1', this.get('system1'));
            localStorage.setItem('system2', this.get('system2'));
            localStorage.setItem('system3', this.get('system3'));

            localStorage.setItem('sum', this.get('sum'));
    
        }
        } /* */
    });

var card1 =  document.createElement("button");
var card2 =  document.createElement("button");
var card3 =  document.createElement("button");

card1.innerHTML = "Карта 1";
card2.innerHTML = "Карта 2";
card3.innerHTML = "Карта 3";
card1.style.margin = card2.style.margin = card3.style.margin ="5px 10px 0px 0px";


        var btn_open_settings = document.createElement("button");
        btn_open_settings.innerHTML = "Установки";
        btn_open_settings.title = "Нажмите чтобы устанвить параметры.";
        btn_open_settings.className  = "requests_output requests_output-js";
        //btn_open_settings.id="perevod-settings";
        btn_open_settings.style.margin = "6px 0px 0px 0px";

       // $(".requests_output.requests_output-js").before(btn_open_settings);
       document.onreadystatechange = function () {

        if (document.readyState == "complete") {

          var $iframe = $('#payments_frame');
        $iframe.ready(function() {
          var style = document.createElement('style');
style.textContent =
  '.btn_wrap {' +
  '  display: flex;' +
  '}' 
;

var iframe = document.getElementById("payments_frame");
//$(iframe).css("display","flex");



document.head.appendChild(style);
            $iframe.contents().find(".requests_output.requests_output-js").before(btn_open_settings);

            $iframe.contents().find(".requests_output.requests_output-js").before(card1);
            $iframe.contents().find(".requests_output.requests_output-js").before(card2);
            $iframe.contents().find(".requests_output.requests_output-js").before(card3);
           // $iframe.contents().find(".btn_wrap").style.display = "flex";
           
           
           

        });
        
        }}


        btn_open_settings.addEventListener("click", function () {
        settings_gmc.open();
    
    
    });

    card1.addEventListener("click", function () {          
      localStorage.setItem("key",49);
    document.location.reload();  });


    card2.addEventListener("click", function () {          
      localStorage.setItem("key",50);
    document.location.reload();  });

    card3.addEventListener("click", function () {          
      localStorage.setItem("key",51);
    document.location.reload();  });



if (key>0){

    localStorage.setItem("key",0);
setTimeout(() => {
    waitForKeyElements("#payment_methods",open,1,"#payments_frame");
}, 2000);
}

    function open() {

        console.log("ok");
        
        var iframe = document.getElementById("payments_frame");
        var visa = iframe.contentWindow.document.getElementById("cards_1");
        var master = iframe.contentWindow.document.getElementById("cards_2");
         




            $(iframe).focus();
            //console.log("doing system"+(key-48).toString());
            if(settings_gmc.get('system'+(key-48).toString()) == 'Visa')
            {console.log("visa");

            $(visa).click();
            waitForKeyElements("#account", pasteCredsA, 0,"#payments_frame");
            waitForKeyElements("#card_number", pasteCredsC, 0,"#payments_frame");
            }

            if(settings_gmc.get('system'+(key-48).toString()) == 'MasterCard')
            {
                $(master).click();
                
                waitForKeyElements("#account", pasteCredsA, 0,"#payments_frame");
                waitForKeyElements("#card_number", pasteCredsC, 0,"#payments_frame");
            }
        

    }

     document.onkeyup = function (e) {
var lkey = e.keyCode;
        localStorage.setItem("key",lkey);
        document.location.reload();

        /*
        
        //  alert(key);       if (e.altKey &&


        

        var iframe = document.getElementById("payments_frame");
        var visa = iframe.contentWindow.document.getElementById("cards_1");
        var master = iframe.contentWindow.document.getElementById("cards_2");
         


        if (e.shiftKey &&  key > 48 &&  key < 59)
        {

            $(iframe).focus();
            //console.log("doing system"+(key-48).toString());
            if(settings_gmc.get('system'+(key-48).toString()) == 'Visa')
            {console.log("visa");

            $(visa).click();
            waitForKeyElements("#account", pasteCredsA, 0,"#payments_frame");
            waitForKeyElements("#card_number", pasteCredsC, 0,"#payments_frame");
            }

            if(settings_gmc.get('system'+(key-48).toString()) == 'MasterCard')
            {
                $(master).click();
                
                waitForKeyElements("#account", pasteCredsA, 0,"#payments_frame");
                waitForKeyElements("#card_number", pasteCredsC, 0,"#payments_frame");
            }
        }

*/


    }

    function pasteCredsC() {
        var cardnum = settings_gmc.get('card'+(key-48).toString());
        var sum = settings_gmc.get('sum');
        //alert(sum);

        var iframe = document.getElementById("payments_frame");

        //alert(iframe.contentWindow.document.getElementById("amount").value);

        var amount_el = iframe.contentWindow.document.getElementById("amount");
        $(amount_el).focus();
        $(amount_el).val(sum);
        var card_el = iframe.contentWindow.document.getElementById("card_number");
        $(card_el).focus();
        $(card_el).val(cardnum);
var button = iframe.contentWindow.document.getElementById("withdraw_button");
$(button).focus();

        setTimeout(() => {
         //   iframe.contentWindow.document.getElementById("withdraw_button").click();
        }, 300);



    }


    function pasteCredsA() {
        var cardnum = settings_gmc.get('card'+(key-48).toString());
        var sum = settings_gmc.get('sum');
        //alert(sum);

        var iframe = document.getElementById("payments_frame");

        //alert(iframe.contentWindow.document.getElementById("amount").value);

        var amount_el = iframe.contentWindow.document.getElementById("amount");
        $(amount_el).focus();
        $(amount_el).val(sum);
        var card_el = iframe.contentWindow.document.getElementById("account");
        $(card_el).focus();
        $(card_el).val(cardnum);
        //iframe.contentWindow.document.getElementById("card_number").value = cardnum;

        setTimeout(() => {
           // iframe.contentWindow.document.getElementById("withdraw_button").click();
        }, 300);
        
    }

})();
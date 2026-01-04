// ==UserScript==
// @name         waiterForIpChanged
// @namespace    http://tampermonkey.net/
// @version      2024-01-04
// @description  CheckIpFoRpRoxy
// @author       MeGa
// @match        https://api.ipify*
// @match        http://api.ipify.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blsspainglobal.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495949/waiterForIpChanged.user.js
// @updateURL https://update.greasyfork.org/scripts/495949/waiterForIpChanged.meta.js
// ==/UserScript==


/***************************************************************************بسم الله الرحمن الرحيم***********************************************************************************/

//waiterForIpChanged
if((localStorage.getItem("Ip_Modem_Lte_Home_MeGa")==null)){localStorage.setItem("Ip_Modem_Lte_Home_MeGa","");}
var waiterForIpChanged=setInterval(function(){
var XHR = new XMLHttpRequest();
        XHR.open("GET","https://api.ipify.org", true);
        XHR.onreadystatechange = function () {
          if (XHR.readyState == 4 && XHR.status == 200) {
            var RespTxt = XHR.responseText;
           console.log(RespTxt);
              if((localStorage.getItem("Ip_Modem_Lte_Home_MeGa")!==null) && (localStorage.getItem("Ip_Modem_Lte_Home_MeGa") !== RespTxt))
              {localStorage.setItem("Ip_Modem_Lte_Home_MeGa",RespTxt) ;
               envoyerNotificationTelegram("Modem_Lte_Home_MeGa got New ip :  "+RespTxt)
              }
                        }
        };
        XHR.send();
},5000);




// Declaration Telegram function
function envoyerNotificationTelegram(message) {
        const TOKEN = '6476022733:AAHRGWEdShKPp-H6O_xLuqZdt4JSspeHLmQ'; // Remplacez par votre token de profil actuel
        const CHAT_ID = '-1001995942562'; // Remplacez par votre chat ID

        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
        const data = {
            chat_id: CHAT_ID,
            text: message,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Erreur:', error));
}


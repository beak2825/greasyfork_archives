// ==UserScript==
// @name         quickswap - Tracking Price
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  :
// @author       You
// @match        https://quickswap.exchange/
// @match        https://quickswap.exchange/#/swap?inputCurrency=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&outputCurrency=0x104592a158490a9228070E0A8e5343B499e125D0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425182/quickswap%20-%20Tracking%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/425182/quickswap%20-%20Tracking%20Price.meta.js
// ==/UserScript==

let lastPrice=0;
let isAlert = true

setTimeout(function(){
    AddTextBox();
}, 1000);
setInterval(function(){
    submitGoogleForm();
}, 500);


function AddTextBox()
{

  var mydiv = document.getElementById("swap-page");

  var div = document.createElement("div");
  mydiv.appendChild(div);
  div.className ="dynamicDiv";
  div.innerHTML = "<p> Alert if To-Number above: <input type='text' id='alertPrice' value='' />";


  div = document.createElement("div");
  mydiv.appendChild(div);
  div.className ="dynamicDiv";
  div.innerHTML = "<p> Start (set =1) <input type='text' id='start' value='0' />";
}


function submitGoogleForm(form) {


    try {

      let fraxNo=xp('//*[@id="swap-currency-output"]/div/div[2]/input',9);
      fraxNo = parseInt(fraxNo.value)

      var alertPrice = document.getElementById("alertPrice");
      alertPrice = parseInt(alertPrice.value)

      var isAlert = document.getElementById("start").value ==1? true:false;

      document.getElementById("alertPrice").disabled=isAlert;
      //&& pair.indexOf('USDC per FRAX')>=0
      if (isAlert && fraxNo>0 && alertPrice >0 && fraxNo>=alertPrice){
        document.getElementById("start").value = '0';
        //alert('alertPrice !')


        let fromAmt = xp('//*[@id="swap-currency-input"]/div/div[2]/input',9).value;
        let fromToken = xp('//*[@id="swap-currency-input"]/div/div[2]/button[2]/span/span',2)

        let toAmt = xp('//*[@id="swap-currency-output"]/div/div[2]/input',9).value;
        let toToken = xp('//*[@id="swap-currency-output"]/div/div[2]/button/span/span',2)


        discord_message('Alert: '+ fromAmt + ' ' + fromToken + ' can swap to '+ toAmt + ' '+toToken);

      }

      console.log('alertPrice='+ alertPrice + ', fraxNo='+fraxNo);
      return



        if (presym!=symbol && prePer!=per && per){
            presym=symbol;
            //alert(symbol + " " + per +"%");
            prePer=per
            setTimeout(function(){
                symbol= symbol.replace(' ','')
                per= per.replace(' ','')
                let data='entry.297555562='+ symbol + '&entry.40632014='+per+ '&entry.1321302365='+holdPer + '&entry.968157833='+MaxContractsHeld + '&entry.891887218='+ProfitFactor
                data = data  + '&entry.966239685='+PercentProfitable +'&entry.1739844008='+Ratio_AvgWin_AvgLoss +'&entry.352402794='+AvgBarsinTrades
                data = data  + '&entry.503681823='+win_AvgBarsinTrades+ '&entry.1185548436='+loss_AvgBarsinTrades
                console.log(data);
                //entry.297555562=1&entry.40632014=1111&fvv=1&draftResponse=%5Bnull%2Cnull%2C%225639028621197168446%22%5D%0D%0A&pageHistory=0&fbzx=5639028621197168446


                var xhr = new XMLHttpRequest();

                xhr.open('POST', 'https://docs.google.com/forms/d/1T5z2I3tdYvUPdMBrozCZZtlAXfWCLi4LwSLvX6vzADA/formResponse', true); //https://docs.google.com/spreadsheets/d/1D3V2MwdHl2Taqu4ufoeQs5XIq0pCr36sE7R0F30hDXM/edit#gid=276235640
                xhr.setRequestHeader('Accept',
                                     'application/xml, text/xml, */*; q=0.01');
                xhr.setRequestHeader('Content-type',
                                     'application/x-www-form-urlencoded; charset=UTF-8');
                xhr.send(data);
            }, 1000);


        }



    } catch(e) {}


  }



function xp(exp, t, n) {
    var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
    if(t && t>-1 && t<10) switch(t) {
        case 1: r=r.numberValue; break;
        case 2: r=r.stringValue; break;
        case 3: r=r.booleanValue; break;
        case 8: case 9: r=r.singleNodeValue; break;
    } return r;
}
 function discord_message( message) {
   let webHookURL = 'https://discord.com/api/webhooks/816107143543521300/gUqeUuRs2L1249kvjvBV3je9pv0X96WYOF0SF00GQh5F5quvM27ePSRwBQOAIO8BS4N8'
        var xhr = new XMLHttpRequest();
        xhr.open("POST", webHookURL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'content': message,
            'username':'AI',
        }));
    }

function sendTele(text, coin){
    var tele='https://api.telegram.org/bot701027954:AAHUhrmnjwn0mV0bwaSVglBZtFRiGbYTFdM/sendmessage?chat_id=-465489419&text='+text +" "+coin;
/*
    var myWindow = window.open(tele,'_blank');
    setInterval(function(){
        myWindow.close();
    },5000);
*/
    GM_xmlhttpRequest ( {
    method:     'GET',
    url:        tele,
    onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...
                    console.log (
                        "GM_xmlhttpRequest() response is:\n",
                        responseDetails.responseText.substring (0, 80) + '...'
                    );
                }
    } );

}
s
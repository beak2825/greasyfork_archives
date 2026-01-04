// ==UserScript==
// @name         MobileVOIP
// @version      2.0
// @create       2017-10-18
// @match        http://www.mobilevoip.com/
// @match        http://www.mobilevoip.com/home
// @match        https://www.mobilevoip.com/
// @match        https://www.mobilevoip.com/home
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @namespace    MVC
// @feedback-url https://greasyfork.org/zh-CN/scripts/34263-mobilevoip
// @description  只针对中国免费的，部分中国免费有地区或者(手机或座机)限制！
// @connect      *
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/34263/MobileVOIP.user.js
// @updateURL https://update.greasyfork.org/scripts/34263/MobileVOIP.meta.js
// ==/UserScript==

(function() {
    var vipBtn = '<select id="sel" style="color:red;width:20%;"></select><a id="ifkdyVipBtn" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">GO</a>';
    $('#body').after(vipBtn);
    $('#ifkdyVipBtn').on('click',function(){
        var api = document.getElementById("sel").value;
        window.open(api + "#/#letter-C");
    });
    var data = [
        {name:"12VoIP",url:"https://www.12voip.com/calling_rates"},
        {name:"Actionvoip",url:"https://www.actionvoip.com/calling_rates"},
        {name:"BrowserCalls",url:"https://www.browsercalls.com/calling_rates"},
        {name:"BudgetVoipCall",url:"https://www.budgetvoipcall.com/calling_rates"},
        {name:"Call2India",url:"https://www.call2india.com/calling_rates"},
        {name:"CallEasy",url:"https://www.calleasy.com/calling_rates"},
        {name:"CallingCardBuster",url:"https://www.callingcardbuster.co.uk/calling_rates"},
        {name:"CallingCredit",url:"https://www.callingcredit.com/calling_rates"},
        {name:"CallPirates",url:"https://www.callpirates.com/calling_rates"},
        {name:"CheapBuzzer",url:"https://www.cheapbuzzer.com/calling_rates"},
        {name:"CheapVoip",url:"https://www.cheapvoip.com/rates/calling-rates"},
        {name:"CheapVoipCall",url:"https://www.cheapvoipcall.com/calling_rates"},
        {name:"CosmoVoip",url:"https://www.cosmovoip.com/rates/calling-rates"},
        {name:"DialCheap",url:"https://www.dialcheap.com/calling_rates"},
        {name:"DialNow",url:"https://www.dialnow.com/calling_rates"},
        {name:"DiscountCalling",url:"https://www.discountcalling.com/calling_rates"},
        {name:"DiscountVoip",url:"https://www.discountvoip.co.uk/calling_rates"},
        {name:"EasyVoip",url:"https://www.easyvoip.com/calling_rates"},
        {name:"FreeCall",url:"https://www.freecall.com/calling_rates"},
        {name:"FreeVoipDeal",url:"https://www.freevoipdeal.com/calling_rates"},
        {name:"Frynga",url:"https://www.frynga.com/calling_rates"},
        {name:"GlobalFreecall",url:"https://www.globalfreecall.com/calling_rates"},
        {name:"HotVoip",url:"https://www.hotvoip.com/calling_rates"},
        {name:"Internetcalls",url:"https://www.internetcalls.com/calling_rates"},
        {name:"InterVoip",url:"https://www.intervoip.com/calling_rates"},
        {name:"Jumblo",url:"https://www.jumblo.com/calling_rates"},
        {name:"JustVoip",url:"https://www.justvoip.com/calling_rates"},
        {name:"Low-rate Voip",url:"https://www.lowratevoip.com/calling_rates"},
        {name:"MegaVoip",url:"https://www.megavoip.com/calling_rates"},
        {name:"MexicoBarato",url:"https://www.mexicobarato.com/calling_rates"},
        {name:"NairaCalls",url:"https://www.nairacalls.com/calling_rates"},
        {name:"Netappel",url:"https://www.netappel.com/calling_rates"},
        {name:"Nonoh",url:"https://www.nonoh.net/calling_rates"},
        {name:"PanggilanMalaysia",url:"https://www.panggilanmalaysia.com/calling_rates"},
        {name:"PennyConnect",url:"https://www.pennyconnect.com/calling_rates"},
        {name:"PinoyDialer",url:"https://www.pinoydialer.com/calling_rates"},
        {name:"poivY",url:"https://www.poivy.com/calling_rates"},
        {name:"PowerVoip",url:"https://www.powervoip.com/calling_rates"},
        {name:"RebVoice",url:"https://www.rebvoice.com/calling_rates"},
        {name:"Rynga",url:"https://www.rynga.com/calling_rates"},
        {name:"SIPDiscount",url:"https://www.sipdiscount.com/calling_rates"},
        {name:"SmartVoip",url:"https://www.smartvoip.com/calling_rates"},
        {name:"SMS Discount",url:"https://www.smsdiscount.com/calling_rates"},
        {name:"SMSLISTO",url:"https://www.smslisto.com/calling_rates"},
        {name:"StuntCalls",url:"https://www.stuntcalls.com/calling_rates"},
        {name:"Telbo",url:"https://www.telbo.com/calling_rates"},
        {name:"Voipblast",url:"https://www.voipblast.com/calling_rates"},
        {name:"VoipBlazer",url:"https://www.voipblazer.com/calling_rates"},
        {name:"VoipBuster",url:"https://www.voipbuster.com/calling_rates"},
        {name:"VoipbusterPro",url:"https://www.voipbusterpro.com/calling_rates"},
        {name:"VoipCaptain",url:"https://www.voipcaptain.com/calling_rates"},
        {name:"VoIPCheap",url:"https://www.voipcheap.co.uk/calling_rates"},
        {name:"VoipCheap",url:"https://www.voipcheap.com/calling_rates"},
        {name:"VoipChief",url:"https://www.voipchief.com/calling_rates"},
        {name:"VoipDiscount",url:"https://www.voipdiscount.com/calling_rates"},
        {name:"VoipGain",url:"https://www.voipgain.com/calling_rates"},
        {name:"VoipJumper",url:"https://www.voipjumper.com/calling_rates"},
        {name:"VoipMove",url:"https://www.voipmove.com/calling_rates"},
        {name:"VoipR",url:"https://www.voipr.com/en/rates/"},
        {name:"VoipRaider",url:"https://www.voipraider.com/calling_rates"},
        {name:"VoipSmash",url:"https://www.voipsmash.com/calling_rates"},
        {name:"VoipStunt",url:"https://www.voipstunt.com/calling_rates"},
        {name:"VoipWise",url:"https://www.voipwise.com/calling_rates"},
        {name:"VoipYo",url:"https://www.voipyo.com/calling_rates"},
        {name:"VoipZoom",url:"https://www.voipzoom.com/calling_rates"},
        {name:"WebCallDirect",url:"https://www.webcalldirect.com/calling_rates"},
    ];
    var i = 0;
    function ids(){
        if(i<66)
        {
            var url = data[i].url;
            var name = data[i].name;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var json = response.responseText.indexOf("China&nbsp;");
                    var txt = response.responseText.substring(json,json+500);
                    json = txt.indexOf("FREE");
                    if(json <= 0)
                    {
                        json = txt.indexOf("Mobile");
                        txt = txt.substring(json,json+100);
                        json = txt.indexOf("FREE");
                        document.getElementById("ifkdyVipBtn").text=name;
                        if(json > 0)
                        {
                            var opt = document.createElement ("option");
                            opt.value = url;
                            opt.innerText = name;
                            document.getElementById('sel').appendChild (opt);
                            i++;
                            ids();
                        }
                        else
                        {
                            i++;
                            ids();
                        }
                    }
                    else
                    {

                        document.getElementById("ifkdyVipBtn").text=name;
                        if(json > 0)
                        {
                            var opts = document.createElement ("option");
                            opts.value = url;
                            opts.innerText = name;
                            document.getElementById('sel').appendChild (opts);
                            i++;
                            ids();
                        }
                        else
                        {
                            i++;
                            ids();
                        }
                    }
                }
            });
        }
        else
        {
            document.getElementById("ifkdyVipBtn").text="GO";
        }
    }
    ids();
})();
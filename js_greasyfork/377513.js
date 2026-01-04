// ==UserScript==
// @name         autoTrade
// @namespace    out
// @version      1.7
// @description  take all
// @author       Linker
// @match        *://buff.163.com/*
 // @match       *://steamcommunity.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/377513/autoTrade.user.js
// @updateURL https://update.greasyfork.org/scripts/377513/autoTrade.meta.js
// ==/UserScript==

(function() {
    'use strict';
               var reg_buff1 = /163/
               var reg_buff =/https:\/\/buff.163.com\/market\/sell_order\/to_deliver\?game\=csgo/i;

              var reg_buff_dota = /https:\/\/buff.163.com\/market\/sell_order\/to_deliver\?game\=dota2/i;;
              //var reg_steam = /tradeoffer\/[0-9]{10}/i;
               var url = location.href;
if(reg_buff1.test(url))
{
    setTimeout(function(){ var insert = document.getElementsByClassName("tagBoxB");
                          //console.log(insert);
                          for(let i = 0;i<insert.length ;i++){
                          var insert_a = insert[i].getElementsByTagName("a");
                              if(insert_a[0].innerText=="解析")
                          insert_a[0].click();}},2000);



    //console.log(insert[7].innerText.click())
}


    if(reg_buff.test(url))
    {
        var sell = document.getElementsByClassName("tab");
			     var sell1 = sell[0].getElementsByTagName("a");
        var dota_deliver = document.getElementById("deliver");
         var  dota_test =  document.getElementsByClassName("deliver-order TO_DELIVER");
        setTimeout(function(){ if(dota_test.length != 0)
        {setTimeout(function(){dota_select.click();},300)
         console.log(dota_test.length)
        setTimeout(function(){dota_deliver.click();},300);
        }
        },3000)


       setTimeout(function(){ accept_trade();},10000)
        setTimeout(function(){sell1[1].click();},200000);


    }

if(regSteam(url))
    {
              // var reg_steam2 = new RegExp(reg_steam.exec(href[i]),"i");
                    //console.log(reg_steam2);


                   console.log("123")
                    var content = document.getElementById("you_notready");        //steam部分---------接受报价
                   if(!content)
                   {window.close();
                   }
                   content.click();
                 setTimeout(function(){var span = document.getElementsByClassName("btn_green_steamui btn_medium");            // ---------确认
                                       span[0].children[0].click();},50);
                 setTimeout(function(){ var accept = document.getElementById("trade_confirmbtn_text"); //   ---------接受交易
                                       accept.click();},50);
                 setTimeout(function(){window.close()},2000);

    }







  })();
function accept_trade() {
				let father = document.getElementById("bot-status");
				 let href = father.getElementsByTagName("a");
                   console.log(href.length);
                GM_setValue("length",href.length)
				for(let i = 0;i<href.length;i++)
				{

                    let numUrl = (href[i]+"").replace(/\D/g,"");
                    console.log(numUrl);
                    GM_setValue("href"+i,numUrl);

					window.open(href[i]);
                    //GM_openInTab(href[i]);
				}
                 return href.length
			};

function creatButton(content,fatherNode,id,style,click){
					let btn = document.createElement("button");
					btn.innerHTML = content;
					fatherNode.appendChild(btn);
					btn.setAttribute('id', id);
                    btn.setAttribute('style', style);
                    btn.onclick = function(){
                     	click();
                     }
                   return btn;

				}

function creatSelect(fatherNode,style){
					var sel = document.createElement("select");
					fatherNode.appendChild(sel);
					sel.setAttribute('style',style);
					return sel;
				}
function addOpt(content,sel){

				 var opt = document.createElement("option");
					opt.text = content;
					sel.add(opt);
					return opt;
				}
function regSteam(url)
{
    let temp = url + ""
    temp = url.replace(/[^0-9]/ig,"")
    console.log(temp)
    for (let i = 0;i< GM_getValue("length");i++)
    {
        console.log(GM_getValue("href"+i))
        var reg_Steam = new RegExp(temp,"i");
         if( reg_Steam.test(GM_getValue("href"+i)))
             return true;

    }
}
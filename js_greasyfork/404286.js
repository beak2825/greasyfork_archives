// ==UserScript==
// @name        fakelush
// @description fake love lush driver
// @namespace   lovelush goes droopy
// @include     https://*.stripchat.com*
// @include     https://*.stripchat.com*
// @include     https://*.stripchat.com*
// @include     https://*.stripchat.com*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/404286/fakelush.user.js
// @updateURL https://update.greasyfork.org/scripts/404286/fakelush.meta.js
// ==/UserScript==

// fake lovelush driver


        var busy=false;
        var tipque = [];

        t1=3;
        t2=10;
        t3=30;
        t4=60;
        t5=130;

        l1=15;
        l2=99;
        l3=499;
        l4=999;
        l5=10000;

        a1="Low vibrations";
        a2="Low vibrations";
        a3="Medium vibrations";
        a4="Medium vibrations";
        a5="High vibrations";

        p1="--------Lovense Toys respond to tips. Models can create their own levels. Here are my levels:";
        p2="--------[1 to "+l1+" tokens] = "+t1+" SECONDS ("+a1+").";
        p3="--------["+(l1+1)+" to "+l2+" tokens] = "+t2+" SECONDS ("+a2+").";
        p4="--------["+(l2+1)+" to "+l3+" tokens] = "+t3+" SECONDS ("+a3+").";
        p5="--------["+(l3+1)+" to "+l4+" tokens] = "+t4+" SECONDS ("+a4+").";
        p6="--------["+(l4+1)+" to "+l5+" tokens] = "+t5+" SECONDS ("+a5+").";

        title="Lovense Lush : Device that vibrates longer at your tips and gives me pleasures.";

        place=document.getElementById("defchat").getElementsByClassName('section')[0].nextSibling;
        info=document.createElement('div');
        info.style.textAlign="right";
        info.style.margin="10px";
        info.innerHTML='<b>lush on/off</b><input type="checkbox" id="onoff">';
        document.getElementById("defchat").insertBefore(info,place);
        document.getElementById("onoff").addEventListener('change',function(){onoff();}, false);

        function onoff(){
            if (document.getElementById("onoff").checked){turnon()}
            else{turnoff()}
        }

        function turnon(){
            getchat();
            t=setInterval(function(){ tipout() }, 500);
            u=setInterval(function(){ promo() }, 300000);
            promo();
            if (document.getElementById("roomtitle").innerHTML.indexOf("Lovense Lush :")==-1){
                setTimeout(function(){settit(title)},1000);
            }
        }

        function turnoff(){
            ws_handler.consolelog=oldFunction;
            oldFunction="";
            clearInterval(t);
            clearInterval(u);
            tipque = [];
            busy=false;
        }


        function getchat(){
            oldFunction=ws_handler.consolelog;
            ws_handler.consolelog = function(msg2){
                if (msg2['method']){
                    if (msg2['method']=='onNotify'){
                        argm=JSON.parse(msg2.args[0]);
                        if (argm.type=="tip_alert"){
                            amount=argm.amount;
                            user=argm.from_username;
                            tipque.push(amount+";"+user);
                        }
                    }
                }
            return oldFunction(msg2);
            }
        }

        function tipout(){
            if (busy==true){return}
            if (tipque.length==0){return}
            busy=true;
            tipque.reverse();
            tipinfo=tipque.pop();
            tipque.reverse();
            tipinfop=tipinfo.split(";");
            process(tipinfop[1],Number(tipinfop[0]));
        }

        function process(tipper,tokens){
            ttime=t5;
            if (tokens<l4+1){ttime=t4}
            if (tokens<l3+1){ttime=t3}
            if (tokens<l2+1){ttime=t2}
            if (tokens<l1+1){ttime=t1}
            message="********My LOVENSE toy is now reacting to "+tipper+"'s tip. It will stop after "+ttime+" seconds!!";
            msend(message);
            document.getElementById("roomtitle").style.backgroundColor = "red";
            setTimeout(function(){ document.getElementById("roomtitle").style.backgroundColor = "white";busy=false }, ttime*1000);
        }

        function promo(){
            msend (p1);
            msend (p2);
            msend (p3);
            msend (p4);
            msend (p5);
            msend (p6);
        }

        function msend(message){
            window.defchat_settings.handler.message_outbound.send_room_message(message, '', '');
        }

        function settit(titlemsg){
            window.defchat_settings.handler.message_outbound.send_change_title(titlemsg);
        }
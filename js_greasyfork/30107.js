// ==UserScript==
// @name         5A LD ( D/2 + W + Q )
// @namespace    Double=D or 2 / Feed=W / Trick=Q 
// @version      8.0
// @description  Double=D or 2 / Feed=W / Trick=Q 
// @author       5A LD YouTube
// @icon         http://i.imgur.com/tow7rhz.png
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://3rb.be/*
// @match        http://dual-agar.online/*
// @match        http://agarp.me/*
// @match        http://agarz.com/en*
// @match        http://agariohub.net/*
// @match        http://agar.pro/*
// @match        http://www.agarribia.com/*
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://alis.io/*
// @match        http://gota.io/web/*
// @match        http://atrix.ovh/*
// @match        http://agar-network.com/*
// @match        http://abs0rb.me/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://3rb.be/
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://dual-agar.online/*
// @match        http://agarp.me/*
// @match        http://agarz.com/en*
// @match        http://agariohub.net/*
// @match        http://agar.pro/*
// @match        http://www.agarribia.com/*
// @match       *.agariopvp.eu/*
// @match       *.6gem.pw/*
// @match       *.ogar.pw/*
// @match       *.154.16.127.140/*
// @match       *.cellcraft.io/*
// @match       *.agarios.com/*
// @match       *.agarz.com/*
// @match       *.mgar.io/*
// @match       *.agariogame.club/*
// @match       *.old.ogarul.io/*
// @match       *.agarly.com/*
// @match       *.bubble.am/*
// @match       *.gota.io/*
// @match       *.agariohub.net/*
// @match       *.agarserv.com/*
// @match       *.agarioservers.ga/*
// @match       *.alis.io/*
// @match       *.agarioplay.org/*
// @match       *.agario.city/*
// @match       *.germs.io/*
// @match       *.agarioforums.io/*
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.agarabi.com/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.agarpx.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       *.agario.xyz/*
// @match       *.agarios.org/*
// @match       *.agariowun.com/*
// @match       *.usagar.com/*
// @match       *.agarioplay.com/*
// @match       *.privateagario.net/*
// @match       *.agariorage.com/*
// @match       *.blong.io/*
// @match       *.agar.blue/*
// @match       *.agar.bio/*
// @match       *.agario.se/*
// @match       *.nbkio.com/*
// @match       *.agariohit.com/*
// @match       *.agariomultiplayer.com/*
// @match       *.agariogameplay.com/*
// @match       *.agariowow.com/*
// @match       *.bestagario.net/*
// @match       *.tytio.com/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match         http://agario.mobi/*
// @match       *.abs0rb.me/*
// @match       *.agario.us/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ioagar.us/*
// @match       *.play.agario0.com/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.nbk.io/*
// @match       *.agario.info/*
// @match       *.inciagario.com/*
// @match       *.agar.io.biz.tr/*
// @match       *.agariown.com/*
// @match       *.agario.dk/*
// @match       *.agario.lol/*
// @match       *.agario.gen.tr/*
// @match       *.agarioprivateserver.us/*
// @match       *.agariot.com/*
// @match       *.agarw.com/*
// @match       *.agario.city/*
// @match       *.agario.ovh/*
// @match       *.feedy.io/*
// @match       *.agar.zircon.at/*
// @match       *.xn--80aaiv4ak.xn--p1ai/*
// @match         http://agarp.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30107/5A%20LD%20%28%20D2%20%2B%20W%20%2B%20Q%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30107/5A%20LD%20%28%20D2%20%2B%20W%20%2B%20Q%20%29.meta.js
// ==/UserScript==
//developed by 5A LD 
window.addEventListener('keydown', keydown);

window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> or <b>4</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>3</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> or <b>2</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>Q</b> for macro feed</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
       
    } else {
        setTimeout(load, 100);
    }
    //                                                        الاكواد مهمه الرجاء عدم تغير شي اذا ما تعرف لها ( وحتى لو تعرف ) و شكرا Dont Edit At This Things - Thanks
 //                                                     -------------------- Feed And Split By 5A LD --------------------
                                                                                   //Feed= w  - 
} 
                                                                            function keydown(event) {
                                                                           if (event.keyCode == 87) {
                                                                                 Feed = true;
                                                                    setTimeout(fukherriteindapussie, imlost);
                                                                    setTimeout(fukherriteindapussie, imlost);
                                                                    setTimeout(fukherriteindapussie, imlost);
                                                                    setTimeout(fukherriteindapussie, imlost);
                                                                    setTimeout(fukherriteindapussie, imlost);
    }                                                                         // Tricksplit= E  -
                                                               if (event.keyCode == 81 || event.keyCode === false) {
                                                                                  ilikedick();
                                                                         setTimeout(ilikedick, imlost);
                                                                        setTimeout(ilikedick, imlost*2);
                                                                        setTimeout(ilikedick, imlost*3);
                                                                        setTimeout(ilikedick, imlost*4);
                                                                        setTimeout(ilikedick, imlost*5);
                                                                        setTimeout(ilikedick, imlost*6);
    }                                                                       // Triplesplit= D / 2 -
                                                                  if (event.keyCode == 50 || event.keyCode == 68) {
                                                                                   ilikedick();
                                                                          setTimeout(ilikedick, imlost);
                                                                         setTimeout(ilikedick, imlost*2);                                                     
    }
//                                                     -------------------- Feed And Split By 5A LD --------------------
}
                                                                            function keyup(event) {
                                                                           if (event.keyCode == 87) {
                                                                                 Feed = false;
                                                                                                    }
                                                                           if (event.keyCode == 79) {
                                                                                 Dingus = false;
    }
}

                                                                       function fukherriteindapussie() {
                                                                                 if (Feed) {
                                                                       window.onkeydown({keyCode: 87});
                                                                        window.onkeyup({keyCode: 87});
                                                                   setTimeout(fukherriteindapussie, imlost);
    }
}
                                                                            function ilikedick() {
                                                           $("body").trigger($.Event("keydown", { keyCode: 32}));
                                                            $("body").trigger($.Event("keyup", { keyCode: 32}));
}


//                                                         -----------------------------------------------------
//                                                                    By 5A LD - تم التعديل من قبل خالد
//                                                                     Macro W = W - علشان تعطي سكور W
//                                                                  Tricksplit Q - عشان تسوي ترك سبلت  Q
//                                                              doublesplit D or 2 - و عشان تسوي دبل D Or 2
//                                                                            Thanks - و شكرا
//                                                         -----------------------------------------------------
//                                                                          YouTube : 5A LD
//                                                                          PIN : 7AA8055D
//                                                                      WHATSAPP : +97336141780
//                                                                           Snap : K_ishaq
//                                                                           Insta : 5a1ld
//                                                        -----------------------------------------------------
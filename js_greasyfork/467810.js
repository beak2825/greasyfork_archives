// ==UserScript==
// @name         Visual++
// @version      0.1
// @description  Changes the appearance of the game
// @author       MrMeow
// @match        moomoo.io
// @match        sandbox.moomoo.io
// @icon         https://cdn-icons-png.flaticon.com/512/2210/2210317.png
// @grant        none
// @namespace https://greasyfork.org/users/1083173
// @downloadURL https://update.greasyfork.org/scripts/467810/Visual%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/467810/Visual%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
// document.getElementById("gameUI").style.backgroundImage = url('')";
document.getElementById("mainMenu").style.backgroundImage = "url('https://catherineasquithgallery.com/uploads/posts/2021-03/1614589582_34-p-stilnii-belii-fon-35.jpg')";
document.getElementById('enterGame').style.color = "White"
document.getElementById('enterGame').innerHTML = "Go to fight"
document.getElementById('loadingText').innerHTML = "Visual++ starting...."
document.getElementById('loadingText').style.color = "Black"
document.getElementById('diedText').innerHTML = "Time to recoup"
document.getElementById('storeHolder').style = "height: 1500px; width: 450px;"
document.getElementById("gameName").style.color = "Black"
document.getElementById("leaderboard").style.color = "Black"
document.getElementById("gameName").style.color = "Black"
document.getElementById('diedText').style.color = "#fe3200";
document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
document.getElementById("promoImg").remove();
document.getElementById("setupCard").style.color = "Black"
document.getElementById("ageText").style.color = "Black"
document.getElementById("mapDisplay").style.borderRadius = "10px";
document.getElementById("foodDisplay").style.borderRadius = "10px";
document.getElementById("woodDisplay").style.borderRadius = "10px";
document.getElementById("stoneDisplay").style.borderRadius = "10px";
document.getElementById("scoreDisplay").style.borderRadius = "10px";
document.getElementById("killCounter").style.borderRadius = "10px";
document.getElementById("mapDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.6)";
document.getElementById('ageBar').style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
document.title = '  Modification by MrMeow ';
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
$('#leaderboard').append('Visual++');

$("#topInfoHolder").css({
                left: "100px",
            });
            $("#scoreDisplay").css({
                "background-image": "url(../img/resources/gold_ico.png)",
                "background-position": "right 6px center",
                right: "20px",
                bottom: "240px",
                "padding-left": "10px",
                "padding-right": "40px",
                left: "inherit",
            });
            document.getElementById("resDisplay").appendChild(killCounter);
            $("#killCounter").css({
                bottom: "185px",
                right: "20px",
                display: "block",
            });
$("#storeButton").css({
                left: "10px",
                width: "40px",
            });
            $("#allianceButton").css({
                left: "10px",
                top: "80px",
                width: "40px",
            });
            $("#chatButton").remove();
$("#mobileDownloadButtonContainer").remove();

$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.74)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});
$('#menuContainer').css({'white-space': 'normal'});
$('#nativeResolution').css({'cursor': 'pointer'});

$('#playMusic').css({'cursor': 'pointer'});

$('#guideCard').css({'overflow-y': 'hidden',
                     'margin-top': 'auto',
                     'margin-bottom': '30px'});

$('#serverSelect').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('.settingRadio').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0.74)',
                           'text-align': 'center',
                           'bottom': '12px'});

$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});

$('#serverSelect').css({'cursor': 'pointer',
                        'color': '#ffffff',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});

$('#adCard').css({'position': 'absolute',
                  'bottom': '-7%',
                  'right': '20px',
                  'width': '420px',
                  'height': '236.25px',
                  'padding-bottom': '18px'});

$('#gameCanvas').css({'background-color': '#f4f4f4'});

$('.gameButton').css({'-webkit-border-radius': '0px 0 0 0',
                      '-moz-border-radius': '0px 0 0 0',
                      'border-radius': '0px 0 0 0',
                      'background-color': 'rgba(0, 0, 0, 0.4)'});
setInterval(() => {
    setTimeout(() => {
        document.getElementById('chatBox').placeholder = "Visual";
        setTimeout(() => {
            document.getElementById('chatBox').placeholder = "Visual+";
            setTimeout(() => {
                document.getElementById('chatBox').placeholder = "Visual++";
                setTimeout(() => {
                    document.getElementById('chatBox').placeholder = "Visual+++";
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}, 500)

      setInterval(function() {
    if (myPlayer.hat == 45) {
        newSend(['ch',['Why kill me now?']]);
        hat(13);
        acc(13);
    }
}, 100);
 setInterval(() => {
        setTimeout(() => {
            document.getElementById("gameName").innerHTML = "Visual++"
            setTimeout(() => {
                document.getElementById("gameName").innerHTML = "Client"
                setTimeout(() => {
                    document.getElementById("gameName").innerHTML = "Visual++"
                    setTimeout(() => {
                        document.getElementById("gameName").innerHTML = "Client"
                        setTimeout(() => {
                            document.getElementById("gameName").innerHTML = "Visual++"
                            setTimeout(() => {
                                document.getElementById("gameName").innerHTML = "Client"
                                setTimeout(() => {
                                    document.getElementById("gameName").innerHTML = "Visual++"
                                    setTimeout(() => {
                                        document.getElementById("gameName").innerHTML = "Client"
                                        setTimeout(() => {
                                            document.getElementById("gameName").innerHTML = "Visual++"
                                            setTimeout(() => {
                                                document.getElementById("gameName").innerHTML = "Client"
                                                setTimeout(() => {
                                                    document.getElementById("gameName").innerHTML = "Visual++"
                                                    setTimeout(() => {
                                                           document.getElementById("gameName").innerHTML = "Client"
                                                    }, 1000);
                                                }, 1000);
                                            }, 1000);
                                        }, 1000);
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
(function() {
    let checker = setInterval(() => {
        let remover = document.getElementById("ot-sdk-btn-floating");
        let remover2 = document.getElementById("partyButton");
        let remover3 = document.getElementById("joinPartyButton");
        let remover4 = document.getElementById("youtuberOf");
        let remover5 = document.getElementById("moomooio_728x100_home");
        let remover6 = document.getElementById("darkness");
        let remover7 = document.getElementById("gameUI");
        if(remover || remover2 || remover3 || remover4 || remover5 || remover6 || remover7){
            remover.remove();
            remover2.remove();
            remover3.remove();
            remover4.remove();
            remover5.remove();
            remover6.remove();
            if(removeui == true){
            remover7.remove();
            }
            clearInterval(checker);
        }
    })
})();

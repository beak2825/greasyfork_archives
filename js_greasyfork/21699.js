// ==UserScript==
// @name           NADAmobile Automator
// @description    Automate watching NADA and related sites
// @author         free21
// @include        http://www.nadamobile.com/watch*
// @include        http://*nadamovietrailers.com*
// @include        http://*fameapp.io*
// @include        http://*catscatscats.co*
// @include        http://*local21.news*
// @include	 https://www.nadamobile.com/profile
// @run-at document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @version        1.2.3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/57063
// @downloadURL https://update.greasyfork.org/scripts/21699/NADAmobile%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/21699/NADAmobile%20Automator.meta.js
// ==/UserScript==

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function setBinds(playerName) {
    $(playerName).on('timeupdate', function() {
        if (this.currentTime > 0.5 && this.currentTime < 2) {
            console.log('time is long enough');
            this.currentTime = 55555;
        }
    });
    $(playerName).on('ended', function() {
        setTimeout(function() {
            if (diffSites == 'yes') {
                window.location = randomSite;
            }
            else {
                location.reload();
            }
        }, timeto);
        console.log('set to move on');
    });
}
var diffSites = GM_getValue('diffSites', 'yes');
var randomSite = ['http://www.nadamobile.com/watch','http://fast.fameapp.io/','http://www.nadamovietrailers.com/','http://local21.news','http://catscatscats.co'][Math.floor(Math.random() * 5)];
var timeto = getRandomArbitrary(1000, 10000);

//for nadamobile.com
if (document.location.href.indexOf('nadamobile.com/watch') > -1) {
    setTimeout(function() {
        if ($( ".player--hold > div" ).hasClass("vjs-has-started") === false) {
            $('#new--player video')[0].play();
            setBinds('.player--hold video');
        }
    }, 3000);

    if (diffSites == 'yes') {
        $(".before-video").on('DOMSubtreeModified', function() {
            if ($(".before-video a").attr("href") == '/watch') {
                setTimeout(function() {
                    window.location = randomSite;
                }, 500);
            }
        });
    }
}





//for the other sites
function playIt() {
    console.log('is it playing?');
    if ($( "#trailerplayer" ).hasClass("vjs-has-started") === false) {
        $('#trailerplayer video')[0].play(); console.log('nope. try to play it.'); setBinds('#trailerplayer video'); } else { console.log('yeah it is!'); }
}
if (document.location.href.indexOf('nadamobile.com/watch') == -1) {
    setTimeout(playIt, 1500);
    setTimeout(playIt, 10500);

    //if set to navigate to other sites, this will go to a new site when "no ads" message shows up
    if (diffSites == 'yes') {
        $("#loader").on('DOMSubtreeModified', function() {
            if ($("#loader div").css('color') !== undefined) {
                setTimeout(function() {
                    window.location = randomSite;
                }, 500);
            }
        });
    }
}

//sometimes run into this server error, so i just wait and reload to break out of it
if ($('title')[0].text == "Application Error") {
    setTimeout(function() {
        location.reload();
    }, 10000);
}

//in case things go really sideways, just force a reload if it has been too long without anything
setTimeout(function() {
    location.reload();
}, 300000);

//setup the settings panel
if (document.location == 'https://www.nadamobile.com/profile') {
    $('<div id="autom8">Loading...</div>').insertBefore(
        '.referrals');
    $('#autom8').css('background-color', '#d83a3d');
    $('#autom8').css('font-size', '1.4em');
    $('#autom8').css('width', '450px');
    $('#autom8').css('padding', '15px');
    $('#autom8').css('margin-left', 'auto');
    $('#autom8').css('color', 'white');
    $('#autom8').css('margin-right', 'auto');
    $('#autom8').html(
        '<h3>autom8 settings:</h3><br /><input type="checkbox" id="diffsites"> Navigate between different sites. <br/> <span style="font-size:0.8em">After each success or fail, it will choose another site at random. (This helps avoid their fraud systems)</span>'
    );
    if (diffSites == 'yes') {
        $("#diffsites").prop('checked', true);
    }
    $("#diffsites").change(function() {
        if (this.checked) {
            GM_setValue('diffSites', 'yes');
            console.log("set value!");
        } else {
            GM_setValue('diffSites', 'no');
        }
    });
}

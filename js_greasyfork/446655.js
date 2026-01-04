// ==UserScript==
// @name         LmaoMOOmod mod | Katana + Musket | AUTOHEAL |  Anti-Insta  |  starter resources and more!!
// @version      v.10.6.4
// @description  This mod is not bad, its just ok. PancakeMod port for mobile
// @author       @root_kalina
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/users/752105-w4it
// @downloadURL https://update.greasyfork.org/scripts/446655/LmaoMOOmod%20mod%20%7C%20Katana%20%2B%20Musket%20%7C%20AUTOHEAL%20%7C%20%20Anti-Insta%20%20%7C%20%20starter%20resources%20and%20more%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446655/LmaoMOOmod%20mod%20%7C%20Katana%20%2B%20Musket%20%7C%20AUTOHEAL%20%7C%20%20Anti-Insta%20%20%7C%20%20starter%20resources%20and%20more%21%21.meta.js
// ==/UserScript==
let AUTHOR = "W4it"

if(AUTHOR[1] == "4"){
let R = CanvasRenderingContext2D.prototype.rotate;
let e = {
    39912: () => {
        let imin = Math.min(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        let imax = Math.max(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        return [fetch, null];
    },
    31: () => {
        CanvasRenderingContext2D.prototype.rotate = function() {
            (arguments[0] >= Number.MAX_SAFE_INTEGER || (arguments[0] <= -Number.MAX_SAFE_INTEGER)) && (arguments[0] = 0);
            R.apply(this, arguments)
        };
        return true;
    },
    9012: () => {
        fetch(e[31]())
    },
    3912: () => {
        return "CanvasRenderingContext2D";
    },
    9481: () => {
        return CanvasRenderingContext2D.prototype.rotate;
    },
    7419: () => {
        return e[7419]
    },
    init: () => {
        return [e[3912](), e[9012]()];
    }
};
e.init();

var ping = document.getElementById("pingDisplay");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "19px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);
let fl = setInterval(() => {
    window.follmoo && (window.follmoo(), clearInterval(fl));
}, 10);
window.location.native_resolution = true;
var autoreloadloop;
var autoreloadenough = 0;

autoreloadloop = setInterval(function () {
    if (autoreloadenough < 200) {
        if (document.getElementById("loadingText").innerHTML == `disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>`) {
            document.title = "Disconnected? NP";
            clearInterval(autoreloadloop);
            setTimeout(function () {document.title = "Moo Moo";}, 1000)
            location.reload();
        }
        autoreloadenough++;
    }
    else if (autoreloadenough >= 300) {
        clearInterval(autoreloadloop);
        document.title = "MOOMOO.IO";
        setTimeout(function () {document.title = "Moo Moo";}, 1000)
    }
}, 50);

document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = '  ' ;
document.getElementById('gameName').innerHTML = 'LMAOMod';
document.getElementById('loadingText').innerHTML = ' niggers are being prepared... '
document.getElementById('diedText').innerHTML = "!!Time to rest!!";
document.getElementById('diedText').style.color = "#fe3200";
document.title = 't.me/lmaobox228';
document.getElementById("leaderboard").append ('lmaobox');
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
document.getElementById("storeHolder").style = "height: 310px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'72px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
$("#ageBarContainer").append('</br><div id="hacktext"></div><div style="width: 100%;position: absolute;bottom: 94px;text-align: center;color:blue;font-size: 24px;" id="freetext"></div><div style="width: 100%;position: absolute;bottom: 144px;text-align: center;color: #ed3f00;font-size: 24px;" id="ptext"></div><div style="width: 100%;position: absolute;bottom: 224px;text-align: center;color: #9a008b;font-size: 24px;" id="ctext"></div><div style="width: 100%;position: absolute;top: 100px;text-align: center;color: black;font-size: 12px;" id="bilgitext">[Z] Tank Gear | [U] Turret Gear | [T] Bull Helmet | [J] Emp Helmet | [B] Soldier Helmet | [<] Fish Hat | [,] Winter Cap | [Shift] Booster Helmet  |  [K] Spike Gear</div><div style="width: 100%;position: absolute;bottom: 170px;text-align: center;color: darkgreen;font-size: 24px;" id="atext"></div><div style="width: 100%;position: absolute;bottom: 196px;text-align: center;color: black;font-size: 24px;" id="mtext"></div>');
var musics=[{
    name: "Vmz - Plutão",
    msc: "https://cdn.discordapp.com/attachments/829054751601721354/829057185056948276/vmz_plutao_6979047102050399469.mp3"
}, {
    name: "MhRap - Vibe do zabuza",
    msc:  "https://cdn.discordapp.com/attachments/829054751601721354/829058226171019294/vibe_zabuza_animes_style_trap_prod_ihaksi_mhrap_-5421045193047514059.mp3"
},{
    name: "Vmz - Eu sou o Zetsu",
    msc: "https://cdn.discordapp.com/attachments/829054751601721354/829059227401060353/vmz_eu_sou_zetsu_-688032162626482960.mp3"
}, {
    name: "Rob Gasser - Ricochet",
    msc: "https://cdn.discordapp.com/attachments/829054751601721354/829061218475049040/rob_gasser_ricochet_ncs_release_147707616798364197.mp3"
}, {
    name: "Astronomia Remix",
    msc: "https://cdn.discordapp.com/attachments/728226830414381056/731040059054096404/Astronomia_Remix_By_Jiaye_Trending_TikTok_EDM_Full_Version.mp3"
}, {
    name: "Kalazh44 x Capital Bra - Kokayn",
    msc: "https://cdn.discordapp.com/attachments/872161608967794698/872161908730519593/kalazh44-x-capital-bra-kokayn-prod-goldfinger1.mp3"
}, {
    name: "Cayman Cline - Crowns(Instrumental)",
    msc: "https://cdn.discordapp.com/attachments/872161608967794698/872179401008246854/Cayman_Cline_-_Crowns_INSTRUMENTAL.mp3"
}]

let musicmenu = document.createElement('div')
musicmenu.innerHTML="<h1 style='color:#fff;text-shadow:2px 2px 2px black;margin:10px;font-weight;1000;'>Playlist</h1><br>"
for(let i=0;i<musics.length;i++){
    musicmenu.innerHTML+=`
  <h3 style="text-shadow:0px 0px 0px black;margin-top:0px;margin-left:2.5%">`+musics[i].name+`</h3>
  <audio style="width: 90%; margin-left: 2.5%; margin-top:10px;" src="`+musics[i].msc+`" controls="" loop=""></audio><hr>
  `
}
musicmenu.style=`
display:none;
overflow:auto;
position:absolute;
top:50%;
left:50%;
margin-top:-200px;
margin-left:-350px;
z-index:1000000;
border:7px solid black;
width:700px;
height:400px;
border-radius:25px;
background-color:#4ab5de;
`
document.body.prepend(musicmenu)
document.addEventListener("keydown", (e)=>{
    if(e.keyCode == 45){
        if(musicmenu.style.display=="block"){
            musicmenu.style.display="none"
        }else{
            musicmenu.style.display="block"
        }
    }
})

let newImg = document.createElement("img");
newImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACXCAMAAAAvQTlLAAAAXVBMVEX///+Mnv+Im//g5P/x8/+Qof+Gmf+Dl//9/f/5+v/W3P+ptv/t8P+TpP/j5//z9f+1wP/Byv/I0P+AlP+erf/R2P/b4P+wvP+8xv+Xp//p7P+jsf+bqv/N1P97kP9y4cA5AAAF3ElEQVR4nO2b6bajKhBGlURwnhWjSd7/MRvNZEyhCOhx3cv3o/ssQ3QLRVEUFcsyMjIyMjIyMvo/KoxPmyhO5JnOVWejzeQEvhRb0jgE2RsKkyjzVmPd7E2hHkJRvY7KTcn2VD0YyVZhBXgXLCacuuJc6W5Ytr2ix277DOJTSNTGzntSMa6r4KxsdpiJY5FcrLucfbFsOxIy/WpX6+olZmHdzsPIuBoRrr2pGFcgYPnh7t1lo4vACh7vz2U7AlynP+Cyz4bLcBkuw2W4DNd/hgthguDg1okQwSteUCMXg4rSKj43wJ4O5efYTy/iaNq4iENvQ3DinoBPn3FLUgWO2E5UDxcidt4Ojdumi2zEuq5XUfT/YoSQfQny4VFu2Ngi2wUtXLj0h5ZxZjMU+9LRrKrjNjyHYXvybxntIlQUxfUWDs3y6zKZBi6MqiEab1NGZVNmYT/BuRfGVYDuRZQO45k0aOldlbkQyp5Ud9Jl7dyN4uZSFHR4okcXwFS5XgmrG77T0+ImJqm7u3Mb/vTnp6Zyfw0s58jJBXOQSWp3g5m1s7t4Ra5HJsGPRKmGl2icuP8/nXtfNS7Use7yqnxFJq2X2/Tz192Oi/T3PwvcY6qwH/5sxsUqcaHreqKRkstGXLhS4rIy/kiocKFS4Yyil7cR16qUNiTKtTAlLsXumkvJKHChQBXL8rgpPwUufFLmYsuXdi50VR5G5io24BLKgS6JN5AKXBqGkZ/rludyVi6KsEJOVCHNhagOLMsN4LeW5iIrDzB5yjVzOaEerhY2MFkuFMDmFTZl9xsktllZ5pwXgQ1MlgvDa2POdkeIOP731Rsm7KoNjzxsYNJc4EPy56B8G1/+dJ7Yh74Dn7lKjyPk7Nv3x9Ho4/DzYGjDBK/dslxgpPo5nMejk81PMAMGRnDUKskFe6/PYoe697TwotFVoMNgDybJRaAIOh5ZCn4TxKOvgc4FjKZl+ysGGvojrvvbwPzR1xGUJ6igmEKSy4G+J8nV6usveMcxHkfyHsdxmg4cR3D3IclFIW8/egC6vhskH4cO2r1lQRNSkgv29p8gb7wcfOYbJ5SEYkM5LnxbaDkesLZ4c8FPgxLFkv3FCXKyp4UVX27klYfglZFAK5EkFy8vSPFQkjcZ5pRAV9+q9fUXdytU07JLf6jrlF2FXN6g9hdLkmumfsb1wDkHX30IivHluEar9vpCxR/Qc6SJC5Wj+1dSZOEoFkuuv28uxzXOTLgUdhpz8vJmZAlQlkKKC6dfD6Hlyi1uHX07WCDSkeuvSVlPcy8r4WTFuXLu3wF1rMu+ftbtmhTXX+8A3iyNiui7e8NI2zpko0lkkKQEF07qtzOTIGl96hQYTepTa0djXGijyUtblYMRxs6VZnX449280M+Cq4NZk+n3ari8WT5vUkxrrLNLf+SDCCnudlQGNE2bJqW0KyN0vw8ntQhfJ/G3Rwvw5kp5zG4S5SX5u+AcoX6hxI/V8nWNRNPZUZf683L9g+g0/qw56Zm+NZ0ukKeA01mKXMyROemkB/iHUdOgsE3nCueVzx+L0h91WjZzQjze24W38r7t+SMz5og+D64XSiRfm6g2D6KlggUt5+6IFLikue9fZpviy6nK6IU1Xq4w0FY/gZiDWCqN6Nssnrhr5tIsw2W4DJfhMlyG6+BcYF72AFzJQbk4J3F/z7VUC/hXXPXuv08T4/KA/JQGRXNRt1CtG+dsXFGo5W82xbhcKOOiLLZv4/9sV6w2MOZ9XUV91tHn7W0FaxbBszhVOS17Y06GQrSWcgsTG05zOBXJwjWe3B6X1zOtnUPbXPHa07YT3JKKizySLjUwrdbUxNYBKrSikWeG/dz9GNmqWl03rGgZOdpkv4ppvJ9fiEvUELsa9b5pNTFfCa5t1F7wIbmYw8CH5OrPddEhuazTx2EcissK3ydrx+Ky3FdtwMG4mMN4rCqH47LaKz4kl+UF5JBcfVDFqUz5a9W2pupY3Upkyx+MjIyMjIT1DxhuW7ZzW+XtAAAAAElFTkSuQmCC";
newImg.style = `position: absolute; top: 10px; left: 12px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(newImg);

newImg.addEventListener("click", () => {
    autoaim = true;
    autoprimary = true;
    autosecondary = false;
    doinsta = true;
    newSend(["ch", ['my bad lmao']]);
    newSend(["13c", [0, 0, 1]]);
    newSend(["5", [primary, true]]);
    newSend(["7", [1]]);
    newSend(["13c", [1, 7, 0]]);
    newSend(["13c", [0, 7, 0]]);
    newSend(["13c", [1, 21, 1]]);
    newSend(["13c", [0, 21, 1]]);
    setTimeout( () => {
        autoprimary = false;
        autosecondary = true;
        newSend(["13c", [0, 0, 0]]);
        newSend(["13c", [1, 53, 0]]);
        newSend(["13c", [0, 53, 0]]);
        newSend(["5", [secondary, true]]);
    }, 50);
    setTimeout( () => {
        if (pikeinsta == true) {
            place(spikeType, nearestEnemyAngle);
        }
        newSend(["13c", [0, 0, 0]]);
        newSend(["13c", [0, 6, 0]]);
        newSend(["7", [1]]);
        newSend(["5", [primary, true]]);
        newSend(["13c", [0, 0, 1]]);
        newSend(["13c", [0, 11, 1]]);
        if (myPlayer.y < 2400){
            newSend(["13c", [0, 15, 0]]);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            newSend(["13c", [0, 31, 0]]);
        } else {
            newSend(["13c", [0, 12, 0]]);
        }
        autosecondary = false;
        autoaim = false;
        doinsta = false;
        if(document.getElementById('aimbot').checked) {
            autoaim = true;
        }
    }, 240);})


let katmus = document.createElement("img");
katmus.src = "data:image/png;base64,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";
katmus.style = `position: absolute; top: 10px; left: 120px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(katmus);

katmus.addEventListener("click", () => {
    newSend(["6", [7]]);
    newSend(["6", [17]]);
    newSend(["6", [31]]);
    newSend(["6", [27]]);
    newSend(["6", [10]]);
    newSend(["6", [38]]);
    newSend(["6", [4]]);
    newSend(["6", [15]]);
})

let buhmet = document.createElement("img");
buhmet.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAA3NCSVQICAjb4U/gAAABvFBMVEX///9KSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkhKSkjby67YyazXx6vUxanRw6fPwaXNv6TMvqPztkHGuqLxtUHEtp3vs0HsskHCtZzBtJvnrkG+sprkrULhqkLgqkK5rZbdqELbp0K0qZLYpUKyppHWo0KwpY/SoUKvpI/OnkKqoIvKnELKm0LHmkOnnYmmnImlm4fClkOimYa/lUOgl4W9k0O6kkORkZGakYC2j0OyjUOOjo6Wjn2uikOUjHyMjIuSinqqh0SOinmKiomJiYinhUSPh3iGhoaOhnWigkSJgnSegESCgoGef0SHgHOafUR9fXyCfHCWe0SWekSAem6SeER+eW16enmOdUV8dmt1dXV5dGl0dHOJckV3cmhxcXGGcEWFb0VwcG90b2WCbUVtbW1+a0VsbGtva2JuamF8aUVpaWl5aEV2ZkVmZmZoZV1nZF1kZGJwYkZuYUZkYVphYWBgYF5pXkZhX1hdXVxmXEZcXFpeW1ZkWkZiWUZdWVVZWVhYWFZcVUZZVVFVVVRaVEZVVFBYUkZVUUdRUU1RUVBQTUdNTUxNTUpKSkhEf9ITAAAAlHRSTlMAESIzRFVmd4iZqrvM3e7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////XbStvgAAAAlwSFlzAAAKnAAACpwB9NLfEgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMTcvMTcI/UgWAAATQUlEQVR4nO1d+YMTxRJmj2Q3N6dxBTlEERVRURBluVbFJyg+EJFrWQORSIgYGAiQ4BLFXV2DCZv8w28mx1T1dM2kk6lkV19/PzHspLuqpvuro3um16zR0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ+P/FSGAy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"
buhmet.style = `position: absolute; top: 10px; left: 220px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(buhmet);

buhmet.addEventListener("click", () => {
    Hat(7);
    acc(0)
})

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        var i = 0;
        var arr2 = Array(arr.length);
        for (; i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}
var mouseX = void 0;
var mouseY = void 0;
var width = void 0;
var height = void 0;
setInterval(function() {
    if (clanToggle == 1) {
        newSend(['9', [null]]);
        newSend(['8', [animate(false, 5)]]);
    }
}, 200);
setInterval(function() {
    if (messageToggle == 1) {
        newSend(["ch", [animate(true, 5)]])
    }
}, 111);
setInterval(function() {
    if (autosecondary == true) {
        newSend(["5", [secondary, true]]);
    }
}, 5);
setInterval(function() {
    if (autoprimary == true) {
        newSend(["5", [primary, true]]);
    }
}, 5);
setInterval(function() {
    if (q == true) {
        place(foodType);
    }
}, 50);
setInterval(() => {
    if(document.getElementById("360hit").checked) {
        newSend(["2", [7.8715926535897935e+270]]);
    }
}, 0);
setInterval ( () => {
    if(nearestEnemy && nearestEnemy[5] == 9) {
        antibow = true
    } else {
        antibow = false
    }
}, 5);
let autobreakSpeed = 111;
setInterval (() => {
    if (autobreak == true && intrap == true) {
        if (secondary == 10) {
            newSend(["5", [secondary, true]]);
        } else {
            newSend(["5", [primary, true]]);
        }
        newSend(["2", [trap_a]]);
        newSend(["13c", [0, 40, 0]]);
        newSend(["13c", [0, 21, 1]]);
        newSend(["c", [1, trap_a]]);
    }
}, autobreakSpeed);
let silentaim = false;
setInterval(function() {
    if (autoaim == true) {
        newSend(['2', [nearestEnemyAngle]]);
        if (silentaim == true) {
            aim(nearestEnemy[1]-myPlayer.x+window.innerWidth/2, nearestEnemy[2]-myPlayer.y+window.innerHeight/2);
        };
    }
}, 5);
setInterval(function() {
    if (myPlayer.hat == 45) {
        newSend(['ch', ['kill me now = noob']]);
        hat(13);
        acc(13);
    }
}, 100);
setInterval(function() {
    if (hatToggle == 1) {
        if (oldHat != normalHat) {
            hat(normalHat);
            console.log('Tried. - Hat');
        }
        if (oldAcc != normalAcc) {
            acc(normalAcc);
            console.log('Tried. - Acc');
        }
        oldHat = normalHat;
        oldAcc = normalAcc;
    }
}, 25);
function normal() {
    hat(normalHat);
    acc(normalAcc);
}
function aim(a, b) {
    var target = document.getElementById('gameCanvas');
    target.dispatchEvent(new MouseEvent('mousemove', {
        clientX : a,
        clientY : b
    }));
}

const CanvasAPI = document.getElementById("gameCanvas")
CanvasAPI.addEventListener("mousedown", buttonPressD, false);
//2 - right
//1 - scroll wheel
//0 - left
function buttonPressD(e) {
    if (document.getElementById("click").checked) {
        if (e.button == 2) {
            if(secondary == 10){
                newSend(["5", [secondary, true]]);
            }
            hat(40);
            acc(21);
            newSend(["7", [1]])
            setTimeout( () => {
                if(secondary == 10){
                    newSend(["5", [primary, true]]);
                }
                acc(11);
                if (myPlayer.y < 2400) {
                    hat(15);
                } else {
                    if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                        hat(31);
                    } else {
                        hat(12);
                    }
                }
                newSend(["7", [1]])
            }, 100);
        }
    }
    if (e.button == 0) {
        if (document.getElementById("click").checked) {
            hat(7);
            acc(21);
            newSend(["7", [1]])
            setTimeout( () => {
                acc(11);
                if (myPlayer.y < 2400) {
                    hat(15);
                } else {
                    if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                        hat(31);
                    } else {
                        hat(12);
                    }
                }
                newSend(["7", [1]])
            }, 100);
        }
    }
}
var q = false;
var antibow = false;
var doinsta = false;
var autosecondary = false
var autoprimary = false
var pikeinsta = false;
var antitrap = false;
var palcespikes = false;
var palcetraps = false;
var palcemills = false;
var autoplacetraps = false;
var autobreak = false;
var nearestEnemy;
var nearestEnemyAngle;
var nearestTribeAngle;
var isEnemyNear;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
var myPlayeroldx;
var myPlayeroldy;
var automillx = 10;
var automilly = 10;
var walkmillhaha = false;
var myPlayer = {
    id : null,
    x : null,
    y : null,
    dir : null,
    object : null,
    weapon : null,
    clan : null,
    isLeader : null,
    hat : null,
    accessory : null,
    isSkull : null
};
var healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
var healToggle = 1;
var hatToggle = 1;
var antiinsta = false;
let trap_a = null;
let intrap = false;
let trapid = null;

document.msgpack = msgpack;
function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    if (!ws) {
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(data);
};
function socketFound(socket) {
    socket.addEventListener('message', function(data) {
        handleMessage(data);
    });
}
'use strict';
function handleMessage(_x17) {
    var b = msgpack5['decode'](new Uint8Array(_x17['data']));
    var node = void 0;
    if (b.length > 1) {
        node = [b[0]]['concat'](_toConsumableArray(b[1]));
        if (node[1] instanceof Array) {
            node = node;
        }
    } else {
        node = b;
    }
    var token = node[0];
    if (!node) {
        return;
    }
    if (token === 'io-init') {
        var docElem = document.getElementById('gameCanvas');
        width = docElem['clientWidth'];
        height = docElem['clientHeight'];
        $(window)['resize'](function() {
            width = docElem['clientWidth'];
            height = docElem['clientHeight'];
        });
        docElem['addEventListener']('mousemove', function(res) {
            mouseX = res['clientX'];
            mouseY = res['clientY'];
        });
    }
    if (token == '1' && myPlayer.id == null) {
        myPlayer.id = node[1];
    }
    if (token == '33') {
        enemiesNear = [];
        var f = 0;
        for (; f < node[1].length / 13; f++) {
            var object = node[1].slice(13 * f, 13 * f + 13);
            if (object[0] == myPlayer.id) {
                myPlayer.x = object[1];
                myPlayer.y = object[2];
                myPlayer.dir = object[3];
                myPlayer.object = object[4];
                myPlayer.weapon = object[5];
                myPlayer.clan = object[7];
                myPlayer.isLeader = object[8];
                myPlayer.hat = object[9];
                myPlayer.accessory = object[10];
                myPlayer.isSkull = object[11];
            } else if(object[7] != myPlayer.clan || object[7] === null) {
                enemiesNear.push(object);
            }
        }
    }
    isEnemyNear = ![];
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort(function(line, i) {
            return dist(line, myPlayer) - dist(i, myPlayer);
        })[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(doinsta == false) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if(isEnemyNear == false && doinsta == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(automillx == false){
        automillx = myPlayer.x;
    }
    if(automilly == false){
        automilly = myPlayer.y;
    }
    if(myPlayeroldy != myPlayer.y || myPlayeroldx != myPlayer.x){
        if (walkmillhaha==true) {
            if(Math.sqrt(Math.pow((myPlayer.y-automilly), 2) + Math.pow((myPlayer.x-automillx), 2)) > 100) {
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) + toRad(78));
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(78));
                place(millType, Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x) - toRad(0));
                newSend(["2", [Math.atan2(mouseY - height / 2, mouseX - width / 2)]]);
                automillx = myPlayer.x;
                automilly = myPlayer.y;
            }
        }
        myPlayeroldx = myPlayer.x;
        myPlayeroldy = myPlayer.y;
    }
    if(token == "6"){
        for(let i = 0; i < node[1].length / 8; i++){
            let ObjectData = node[1].slice(8*i, 8*i+8);
            if(ObjectData[6] == 15 && ObjectData[7] != myPlayer.id && ObjectData[7] != myPlayer.clan){
                trap_a = Math.atan2(ObjectData[2] - myPlayer.y, ObjectData[1] - myPlayer.x);
                if(Math.sqrt(Math.pow((myPlayer.y-ObjectData[2]), 2) + Math.pow((myPlayer.x-ObjectData[1]), 2)) < 90){
                    intrap = true;
                    trapid = ObjectData[0];
                    if(antitrap == true) {
                        if (palcetraps == true) {
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(boostType, angle);
                            }
                        } else if (palcespikes == true) {
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(spikeType, angle);
                            }
                        } else if(palcemills == true){
                            for (let i=0;i<10;i++){
                                let angle = myPlayer.dir + toRad(i * 16);
                                place(millType, angle);
                            }
                        }
                    }
                }
            }
        }
    }

    if(token == "6"){
        for(let i = 0; i < node[1].length / 8; i++){
            let ObjectData = node[1].slice(8*i, 8*i+8);
            if(ObjectData[6] == 16 && ObjectData[7] != myPlayer.id && ObjectData[7] != myPlayer.clan){
                if(Math.sqrt(Math.pow((myPlayer.y-ObjectData[2]), 2) + Math.pow((myPlayer.x-ObjectData[1]), 2)) < 190){
                    for (let i=0;i<4;i++){
                        let angle = myPlayer.dir + toRad(i * 45);
                        place(spikeType, angle);
                        hat(6);
                    }
                }
            }
        }
    }
    if (token == "12") {
        if(intrap == true) {
            if(trapid == node[1]) {
                newSend(["5", [primary, true]]);
                intrap = false;
                newSend(["c", [0]]);
                newSend(["13c", [0, 6, 0]]);
                newSend(["13c", [0, 21, 1]]);
                if(autoplacetraps) {
                    newSend(["5", [primary, true]]);
                    for (let i=0;i<4;i++){
                        let angle = myPlayer.dir + toRad(i * 90);
                        place(boostType, angle)
                    }
                }
            }
        }
    }
    if(token == "12" && document.getElementById('ar').checked/* && isEnemyNear*/){
        place(boostType);
    }
    if(token == "11") {
        intrap = false;
        newSend(['c', [0]]);
        hat(0);
        hat(6);
    }
    if(node[0] == "ch" && node[1] !== myPlayer.id && document.getElementById('cm').checked){
        newSend(["ch", [node[2]]]);
    }
    if (token == 'h' && node[1] == myPlayer.id) {
        if (node[2] < 96 && healToggle == 1 && myPlayer.hat == 7) {
            setTimeout( () => {
                heal(1);
            }, 200);
        }
        if(node[2] == 95 && myPlayer.hat !== 7 && document.getElementById('antiruby').checked){
            newSend(["13c"],[0, 23, 0]);
        }
        if(node[2] < 100 && document.getElementById('dmgc').checked){
            newSend(["ch", [node[2] + "/100 HP"]]);
        }
        if (node[2] < 90 && healToggle == 1) {
            setTimeout( () => {
                heal(2);
            }, 110)
        }
        if (node[2] == 75 && antibow == true) {
            place(millType, nearestEnemyAngle);
            place(foodType);
            place(foodType);
            place(foodType);
        }
        if (node[2] == 81 && antibow == true) {
            place(millType, nearestEnemyAngle);
            place(foodType);
            place(foodType);
            place(foodType);
        }
        if (nearestEnemy && node[2] == 62 && nearestEnemy[9] == 7) {
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
        };
        if (nearestEnemy && node[2] == 75 && nearestEnemy[9] == 53) {
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
            place(foodType, null);
        };
    }
    if (token == 'h' && node[1] == myPlayer.id){
        if (node[2] <= 50 && antiinsta == true) {
            place(foodType);
            place(foodType);
            place(foodType);
            setTimeout( () => {
                place(foodType);
                place(foodType);
            }, 50)
        }
        if (node[2] <= 60 && antiinsta == true) {
            place(foodType);
            place(foodType);
            place(foodType);
            place(foodType);
            newSend(["c", [1, nearestEnemyAngle]]);
            newSend(["c", [0]]);
            hat(6);
            acc(21);
            setTimeout( () => {
                place(foodType);
                place(foodType);
                hat(22);
                acc(21);
            }, 15)
            setTimeout( () => {
                hat(7);
                acc(21);
            }, 600);
            setTimeout( () => {
                hat(6);
                acc(21);
            }, 2100);
        }
    }
    update();
};
function newSend(data) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(data))));
}
function acc(id) {
    newSend(['13c', [0, 0, 1]]);
    newSend(['13c', [0, id, 1]]);
}
function Hat(id){
    newSend(['13c', [1, id, 0]]);
    newSend(['13c', [0, id, 0]]);
}
function hat(id) {
    newSend(['13c', [0, id, 0]]);
}
function place(p__14702) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
    newSend(['5', [p__14702, null]]);
    newSend(['c', [1, angle]]);
    newSend(['c', [0, angle]]);
    newSend(['5', [myPlayer.weapon, true]]);
}
function boostSpike() {
    if (boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(boostType, boostDir);
    newSend(['33', [boostDir]]);
}
function heal(times) {
    for(var i = 0;i < times;++i ){
        place(foodType,null);
    }
}
'use strict';
var repeater = function mockedDriverFn(element, method, options) {
    var d = ![];
    var e = undefined;
    return {
        'start' : function start(child) {
            if (child == element && document.activeElement.id.toLowerCase() !== 'chatbox') {
                d = !![];
                if (e === undefined) {
                    e = setInterval(function() {
                        method();
                        if (!d) {
                            clearInterval(e);
                            e = undefined;
                            console.log('cleared');
                        }
                    }, options);
                }
            }
        },
        'stop' : function Chat(parent) {
            if (parent == element && document.activeElement.id.toLowerCase() !== 'chatbox') {
                d = ![];
            }
        }
    };
};
'use strict';
var boostPlacer = repeater(70, function() {
    place(boostType);
}, 0);
var spikePlacer = repeater(86, function() {
    place(spikeType);
}, 0);
var turretPlacer = repeater(72, function() {
    place(turretType);
}, 0);
var boostSpiker = repeater(71, function() {
    place(boostSpike());
}, 0);
document['addEventListener']('keydown', function(a) {
    boostPlacer['start'](a.keyCode);
    spikePlacer['start'](a.keyCode);
    turretPlacer['start'](a.keyCode);
    boostSpiker['start'](a.keyCode);
    if (a.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var b = 0;
        for (; b < 5; b++) {
            var groupY = myPlayer.dir + toRad(b * 72);
            place(millType, groupY);
        }
    }
    if (a.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var d = 0;
        for (; d < 4; d++) {
            groupY = myPlayer.dir + toRad(d * 90);
            place(spikeType, groupY);
        }
    }
    if (a.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var e = 0;
        for (; e < 4; e++) {
            groupY = myPlayer.dir + toRad(e * 90);
            place(boostType, groupY);
        }
    }
    if (a.keyCode == 103 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        var f = 0;
        for (; f < 4; f++) {
            groupY = myPlayer.dir + toRad(f * 90);
            place(spikeType, groupY);
        }
    }
    if (a.keyCode == 72 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        place(turretType, myPlayer.dir + toRad(45));
        place(turretType, myPlayer.dir - toRad(45));
    }
    if (a.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400) {
            hat(15);
        } else {
            if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                hat(31);
            } else {
                hat(12);
            }
        }
        acc(11);
    }
    if (a.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(7);
        acc(21);
        setTimeout( () => {
            place(spikeType, myPlayer.dir + toRad(45));
            place(spikeType, myPlayer.dir - toRad(45));
        }, 40);
        setTimeout( () => {
            Hat(53);
        }, 50);
        setTimeout( () => {
            normalAcc = 11;
            if (myPlayer.y < 2400){
                normalHat = 15;
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                normalHat = 31;
            } else {
                normalHat = 12;
            }
        }, 100);
    }
    if (a.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(6);
    }
    if (a.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(0);
    }
    if (a.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(53);
    }
    if (a.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(12);
    }
    if (a.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(15);
    }
    if (a.keyCode == 60 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(31);
    }
    if (a.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(40);
    }
    if (a.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(22);
    }
    if (a.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(7);
        acc(0)
    }
    if (a.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        Hat(11);
        acc(21);
    }
    if (a.keyCode == 78 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        walkmillhaha = !walkmillhaha;
        newSend(["ch", ["Mills : " + walkmillhaha]]);
    }
    if(a.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        autoprimary = true;
        autosecondary = false;
        doinsta = true;
        newSend(["ch", ['pancake power']]);
        newSend(["13c", [0, 0, 1]]);
        newSend(["5", [primary, true]]);
        newSend(["7", [1]]);
        newSend(["13c", [1, 7, 0]]);
        newSend(["13c", [0, 7, 0]]);
        newSend(["13c", [1, 21, 1]]);
        newSend(["13c", [0, 21, 1]]);
        setTimeout( () => {
            autoprimary = false;
            autosecondary = true;
            newSend(["13c", [0, 0, 0]]);
            newSend(["13c", [1, 53, 0]]);
            newSend(["13c", [0, 53, 0]]);
            newSend(["5", [secondary, true]]);
        }, 50);
        setTimeout( () => {
            if (pikeinsta == true) {
                place(spikeType, nearestEnemyAngle);
            }
            newSend(["13c", [0, 0, 0]]);
            newSend(["13c", [0, 6, 0]]);
            newSend(["7", [1]]);
            newSend(["5", [primary, true]]);
            newSend(["13c", [0, 0, 1]]);
            newSend(["13c", [0, 11, 1]]);
            if (myPlayer.y < 2400){
                newSend(["13c", [0, 15, 0]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                newSend(["13c", [0, 31, 0]]);
            } else {
                newSend(["13c", [0, 12, 0]]);
            }
            autosecondary = false;
            autoaim = false;
            doinsta = false;
            if(document.getElementById('aimbot').checked) {
                autoaim = true;
            }
        }, 240);
    }
    if (a.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {//reverse insta
        autoprimary = false;
        autosecondary = true;
        autoaim = true;
        doinsta = true;
        newSend(["13c", [0, 0, 1]]);
        newSend(["5", [secondary, true]]);
        newSend(["7", [1]]);
        newSend(["13c", [1, 53, 0]]);
        newSend(["13c", [0, 53, 0]]);
        newSend(["13c", [1, 21, 1]]);
        newSend(["13c", [0, 21, 1]]);
        setTimeout( () => {
            autoprimary = true;
            autosecondary = false;
            newSend(["13c", [1, 7, 0]]);
            newSend(["13c", [0, 7, 0]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["5", [primary, true]]);
        }, 40);
        setTimeout( () => {
            newSend(["13c", [0, 0, 0]]);
            newSend(["7", [1]]);
            newSend(["13c", [0, 11, 1]]);
            if (myPlayer.y < 2400){
                newSend(["13c", [0, 15, 0]]);
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
                newSend(["13c", [0, 31, 0]]);
            } else {
                newSend(["13c", [0, 12, 0]]);
            }
            autoprimary = false;
            autoaim = false;
            doinsta = false;
            if(document.getElementById('aimbot').checked) {
                autoaim = true;
            }
        }, 215);
    }

    if (a.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }
    if (a.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = (clanToggle + 1) % 2;
    }
    if (a.keyCode == 37 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if (healToggle == 0) {
            if (hatToggle == 0) {
                document.title = 'AutoHeal: OFF | AutoHat: OFF';
            } else {
                document.title = 'AutoHeal: OFF | AutoHat: ON';
            }
        } else {
            if (hatToggle == 0) {
                document.title = 'AutoHeal: ON | AutoHat: OFF';
            } else {
                document.title = 'AutoHeal: ON | AutoHat: ON';
            }
        }
    }
    if (a.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {//age 1 insta
        if(primary == 0){
            autoaim = true;
            doinsta = true;
            newSend(["5", [primary, true]]);
            newSend(["13c", [1, 7, 0]]);
            newSend(["13c", [0, 7, 0]]);
            newSend(["13c", [0, 0, 1]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["c", [1]]);
            setTimeout( () => {
                newSend(["6", [5]]);//polearm
                newSend(["6", [17]]);//cookie
                newSend(["6", [31]]);//trap
                newSend(["6", [27]]);//better mill
                newSend(["6", [10]]);//great hammer
                newSend(["6", [38]]);//tp
            }, 35);

            setTimeout( () => {
                newSend(["6", [4]]);//katana
            }, 35);

            setTimeout( () => {
                newSend(["6", [15]]);//musket
                autosecondary = true;
                newSend(["5", [secondary, true]]);
                newSend(["13c", [1, 53, 0]]);
                newSend(["13c", [0, 53, 0]]);
            }, 50);

            setTimeout( () => {
                autosecondary = false;
                newSend(["5", [primary, true]]);
                newSend(["c", [0, null]]);
                newSend(["13c", [0, 6, 0]]);
                autoaim = false;
                doinsta = false;
                if(document.getElementById('aimbot').checked) {
                    autoaim = true;
                }
            }, 200);
        } else {//bow insta
            autoaim = true;
            doinsta = true;
            newSend(["5", [secondary, true]]);
            newSend(["13c", [0, 21, 1]]);
            newSend(["13c", [1, 53, 0]]);
            newSend(["13c", [0, 53, 0]]);
            newSend(["c", [1]]);
            setTimeout( () => {
                newSend(["13c", [0, 21, 1]]);
                newSend(["13c", [0, 32, 0]]);
                newSend(["6", [12]]);
            }, 55);
            setTimeout( () => {
                newSend(["6", [15]]);
            }, 45);
            setTimeout( () => {
                newSend(["c", [0]]);
                newSend(["5", [primary, true]]);
                autoaim = false;
                doinsta = false;
                if(document.getElementById('aimbot').checked) {
                    autoaim = true;
                }
            }, 200);
        }
    }
    if(a.keyCode == 46 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(["6", [7]]);
        newSend(["6", [17]]);
        newSend(["6", [31]]);
        newSend(["6", [27]]);
        newSend(["6", [10]]);
        newSend(["6", [38]]);
        newSend(["6", [4]]);
        newSend(["6", [15]]);
    }
    if(a.keyCode == 45 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(["6", [5]]);
        newSend(["6", [17]]);
        newSend(["6", [31]]);
        newSend(["6", [23]]);
        newSend(["6", [9]]);
        newSend(["6", [38]]);
        newSend(["6", [28]]);
        newSend(["6", [15]]);
    }
    if (a.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [15]]);
    }
    if (a.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [4]]);
    }
    if (a.keyCode == 99 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [28]]);
    }
    if (a.keyCode == 105 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        newSend(['6', [28]]);
        newSend(['6', [25]]);
    }
    if (a.keyCode == 39 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hatToggle = (hatToggle + 1) % 2;
        if (healToggle == 0) {
            if (hatToggle == 0) {
                document.title = 'Heal: OFF | Hat: OFF';
            } else {
                document.title = 'Heal: OFF | Hat: ON';
            }
        } else {
            if (hatToggle == 0) {
                document.title = 'Heal: ON | Hat: OFF';
            } else {
                document.title = 'Heal: ON | Hat: ON';
            }
        }
    }
});
document['addEventListener']('keyup', function(a) {
    turretPlacer['stop'](a.keyCode);
    boostPlacer['stop'](a.keyCode);
    spikePlacer['stop'](a.keyCode);
    boostSpiker['stop'](a.keyCode);
    ;
    if (a.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout(function() {
            newSend(['33', [null]]);
            boostDir = null;
        }, 10);
    }
});
function isElementVisible(options) {
    return options.offsetParent !== null;
}
function toRad(degrees) {
    return degrees * 0.01745329251;
}
function dist(p1, p) {
    return Math.sqrt(Math.pow(p.y - p1[2], 2) + Math.pow(p.x - p1[1], 2));
}
function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = 'pancake mod v10.6';
    } else {
        characters = 'pancake'
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
        if(Math.floor(Math.random() * chance) == 1 && characters.charAt(i) != "-" && count < 2 && characters.charAt(i) != " ") {
            result += "-";
            count++
        } else {
            result += characters.charAt(i);
        }
    }
    return result;
}
'use strict';
function update() {
    var event = 0;
    for (; event < 9; event++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + event['toString']()))) {
            primary = event;
        }
    }
    var div = 9;
    for (; div < 16; div++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + div['toString']()))) {
            secondary = div;
        }
    }
    var tobj = 16;
    for (; tobj < 19; tobj++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + tobj['toString']()))) {
            foodType = tobj - 16;
        }
    }
    var props = 19;
    for (; props < 22; props++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + props['toString']()))) {
            wallType = props - 16;
        }
    }
    var e = 22;
    for (; e < 26; e++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + e['toString']()))) {
            spikeType = e - 16;
        }
    }
    var f = 26;
    for (; f < 29; f++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + f['toString']()))) {
            millType = f - 16;
        }
    }
    var g = 29;
    for (; g < 31; g++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + g['toString']()))) {
            mineType = g - 16;
        }
    }
    var h = 31;
    for (; h < 33; h++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + h['toString']()))) {
            boostType = h - 16;
        }
    }
    var intval = 33;
    for (; intval < 39; intval++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + intval['toString']())) && intval != 36) {
            turretType = intval - 16;
        }
    }
    spawnpadType = 36;
}
;
var menuChange = document.createElement("div");
menuChange.className = "menuCard";
menuChange.id = "mainSettings";
menuChange.innerHTML = `
        <div id="simpleModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="closeBtn">&times;</span>
                    <h2 style="font-size: 17px;">pancake mod menu</h2>
                </div>
                <div class="modal-body" style="font-size: 15px;">
                    <div class="flexControl">
                    <h2 style="font-size: 17px;">Menu</h2>
        <label type="radio" class="container">Anti Insta<input type="checkbox" id="antiinsta" checked>
        <span class="checkmark"></span></label>
        <label type="radio" class="container">put pike on instakill<input type="checkbox" id="putpike">
        <span class="checkmark"></span></label>
 <label type="radio" class="container">360° hit<input type="checkbox" id="360hit">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">Auto Aim/Aim bot/Auto aim lock<input type="checkbox" id="aimbot">
        <span class="checkmark"></span></label>
         <label type="radio" class="container">click bull/tank<input type="checkbox" id="click">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">auto ping msg?<input type="checkbox" id="pingy">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">chat mirror?<input type="checkbox" id="cm">
        <span class="checkmark"></span></label>
                        <label type="radio" class="container">autoreplace(trap)?(DON´T USE|NEED TO GET FIXED<input type="checkbox" id="ar">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">damage counter(chat how many HP you have)?<input type="checkbox" id="dmgc">
        <span class="checkmark"></span></label>
        <label type="radio" class="container">Anti Ruby weapons/Auto venom gear if you got poisen?<input type="checkbox" id="antiruby">
        <span class="checkmark"></span></label>
                <label type="radio" class="container">This function will be functionial soon...<input type="checkbox" id="autoq">
        <span class="checkmark"></span></label>
                        <div class="modal-body" style="font-size: 15px;">
                    <div class="flexControl">
                    <h2 style="font-size: 24px;">Trap settings</h2>
        <label class="container">Anti-Pit-Trap?<input type="checkbox" id="antitrap">
        <span class="checkmark"></span></label>
        <label class="container">place spikes behind you if you got trapped?<input type="checkbox" id="placespike">
        <span class="checkmark"></span></label>
        <label class="container">place traps behind you if you got trapped?<input type="checkbox" id="placetrap">
        <span class="checkmark"></span></label>
        <label class="container">place mills behind you if you got trapped?<input type="checkbox" id="placemill">
        <span class="checkmark"></span></label>
         <label class="container">AutoBreak Pit-Trap?<input type="checkbox" id="autobreaktrap">
                 <span class="checkmark"></span></label>
                 <label class="container">Autoplace traps after autobreak?<input type="checkbox" id="autoplacetraps">
                 <span class="checkmark"></span></label>
                    </div>
                        <div class="modal-footer">
            <h2 class="flower">Instructions:</h2>
            <h2 class="nothing">Как использовать WeaponHack:</h2>
            <p style="font-size: 16px;color:black">На телефоне?:</p>
            <p class="tree">Выбирать палку и молот на первых уровнях.</p>
            <p class="tree">На 9 уровне нажать на кнопку 'Катана и мушкет'.</p>
            <p style="font-size: 16px;color:black">На компьютере:</p>
            <p class="tree">Выбирать палку и молот на первых уровнях.</p>
            <p class="tree">На 9 уровне нажать на клавиатуре клавишу 'del'</p>
            <p class="tree">Идти и ебать нубов)</p>
            <h2 class="nothing">Как использовать Insta-Kill:</h2>
            <p class="tree">1.  Держать в руке мушкет 2-3 секунды</p>
            <p class="tree">2.  Взять в руки катану</p>
            <p class="tree">Для активации нажать на кнопку Discord слева сверху</p>
            </div>
        </div>
        `
document.body.appendChild(menuChange)
var styleItem1 = document.createElement("style");
styleItem1.type = "text/css";
styleItem1.appendChild(document.createTextNode(`
#mainSettings{
     overflow-y : scroll;
}

.keyPressLow {
    margin-left: 8px;
    font-size: 16px;
    margin-right: 8px;
    height: 25px;
    width: 50px;
    background-color: #fcfcfc;
    border-radius: 3.5px;
    border: none;
    text-align: center;
    color: #4A4A4A;
    border: 0.5px solid #f2f2f2;
}

p.tree {
    font-size: 14px;
    font-family: 'verdana';
    text-align: left;
    color: black;
}

h2.flower {
    font-size: 20px;
    font-family: 'Hammersmith One';
    color: black;
    text-align: center;
}

h2.nothing {
    font-size: 30px
    text-align: center;
}

.menuPrompt {
    font-size: 17px;
    font-family: 'Hammersmith One';
    color: green;
    flex: 0.2;
    text-align: center;
    margin-top: 10px;
    display: inline-block;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
}

.modal-content {
    margin: 10% auto;
    width: 40%;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
    font-size: 14px;
    line-height: 1.6;
}

.modal-header h2,
.modal-footer h3 {
  margin: 0;
}

.modal-header {
    background: #black;
    padding: 15px;
    color: #black;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.modal-body {
    padding: 10px 20px;
    background: #orange;
}

.modal-footer {
    background: #cf2727;
    padding: 10px;
    color: #orange;
    text-align: center;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.closeBtn {
    color: #orange;
    float: right;
    font-size: 30px;
    color: #orange;
}

.closeBtn:hover,
.closeBtn:focus {
    color: #orange;
    text-decoration: none;
    cursor: pointer;
}

/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #FFA500;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #FFA500;
}

/* When the checkbox is checked, add a red background */
.container input:checked ~ .checkmark {
  background-color: #000000;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

`))
document.head.appendChild(styleItem1);

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 27){
        if (modal.style.display = "none") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    }
})

let escb = document.createElement("img");
escb.src = "data:image/png;base64,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AFshvAAAAFshvAAAAFthnRcAAOJErBznGXkBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2wgq7AADEETse5/vXzMgLAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFVf/b9hh5T071AgAQLSJlZX0GXkBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2QngBAAC2st/2ALGybDAAADiQXY/z/Wtm5AUAANgK4QUAANgK4QUAANgK4QUAANgK4QUAANgK4QUAANgK4QUAANgK4QUAANgK4QUAANgKK+wCABBHYuE4z8gLAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFcILAACwFVbYBQAgTtj1ON+/ZkZeAACArRBeAACArRBeAACArRBeAACArRBeAACArRBeAACArRBeAACArRBeAACArbj6f8MOi9fYoUYAAKKNXRep64+RFwAAYCuEFwAAYCuEFwAAYCuEFwAAYCuEFwAAYCuEFwAAYCsHXCqNyDvhhBOsLiEqTZw4UYsWLbK6DABAlGHkBQAA2ArhBQAA2Mp+p41iZeU9AABwcHY8zvevmZEXAABgK4QXAABgK4QXAABgK4QXAABgK4QXAABgK4QXAABgK4QXAABgK4QXAABgK4QXAABgK6ywCwBAnIiV4zwjLwAAwFYILwAAwFYILwAAwFYILwAAwFYILwAAwFYILwAAwFYILwAAwFYILwAAwFYILwAAwFZYYTcOXHfddZb1bRjGkB9bXFw8jJUAACTZ8jjfv2bXIe6HGPKrX/3qkLcNNlxE2/0BAPGH00YAAMBWCC8AAMBWCC8AAMBWCC8AAMBWCC8AAMBWCC8AAMBWuFQaGAamaWrbtm1av369Pv/8c+3YsUM7d+5UY2Oj2tvb1dHRoe7ubiUkJCg5OVnZ2dkaMWKERo0apXHjxun444/Xv/zLvygnJ8fqp2Irpmmqrq5OW7Zs0WeffabKykpVVVWptrZWjY2NampqUldXl7xer/x+v9xut9xut1JSUpSVlaWsrCwVFRVp5MiRKikp0fjx4zV27FiNGDHC6qcG4DAIL8AQNTQ0aNmyZVq2bJnKysrU3Nx8xMd4vV55vV41Nzdr+/bteu+99/a7fdy4cTrzzDM1ffp0lZaWyuXiV7SvQCCgjz/+WCtXrlRZWZnef/99NTQ0DPjxPp9PPp9PHR0dqq+vP+T9CgoKNGXKFJ188sk6/fTTNXHiRDkcDFQD0YK/jMAg+P1+vfbaa5ozZ45Wr1497CtVlpeXq7y8XH/961+Vm5urK6+8Ut/4xjc0fvz4Ye3HTjo7O7VixQq9/PLLWrFihZqamsLeZ01NjV5//XW9/vrrkqSMjAydddZZOu+883TOOecoLS0t7DUAOLQDwosdlg22Q42ILR0dHfrb3/6mZ599Vrt3745Inw0NDXryySf15JNPavr06brlllt08sknR6Rvq5mmqbVr12ru3LlavHixOjs7La2npaVFL730kl566SUlJibqvPPO05VXXqmzzjpLTqfT0tqAwYiVbYAYeQEOw+/3a8GCBXrwwQdVV1dnWR3Lly/X8uXLNX36dN11110aO3asZbWEU0dHhxYuXKgnnnhC5eXlVpdzUN3d3Vq8eLEWL16skSNH6rrrrtM3v/lNZWVlWV0aEDc4iQscwqZNm3TppZfqtttuszS49LV8+XJ99atf1e9+9zt1dXVZXc6waW9v16OPPqpTTz1Vt956a9QGl/6qq6v1X//1X5o6daruvfde1dTUWF0SEBcIL0A/gUBAjz76qC655BJ9+umnVpdzAL/fr0cffVQzZszQpk2brC7nqPh8Pj3zzDOaOnWq7rvvPu3du9fqkoaks7NTTz31lL785S/r/vvvj8i8HCCeEV6APlpaWnT99dfrwQcflN/vt7qcwyovL9cll1yiF154wepShmTlypWaPn26fvGLX9g2tPTX3d2tP//5zzrjjDP03HPPKRAIWF0SEJMIL8A+27dv1xVXXKG3337b6lIGrLu7W//v//0//ed//qdtJuHt3btXP/rRj/T1r3/dNqeHBqupqUl33nmnLrvsMtuPjgHRiPACSPr888/19a9/XZ9//rnVpQzJI488ottvv109PT1Wl3JYb775ps455xzbjhYN1kcffaSLLrpIf/zjH6N+JA+wE8IL4l5FRYWuueaaqJmUO1TPP/+8fvGLX0TlCIzP59M999yj6667TrW1tVaXE1GBQEAPPfSQrr76alVXV1tdDhATCC+Ia42Njfr2t78dMwfUOXPm6Pe//73VZeyntrZWX//61/WXv/zF6lIsVVZWpgsvvFArV660uhTA9ggviFs+n08/+MEPVFlZaXUpw+qPf/yjXnzxRavLkNR7uflFF12ktWvXWl1KVGhqatI3v/lNPf3001aXAtjafovUxcrKe8BAPPTQQ1q9erXVZYTFrbfeqokTJ+q4446zrIZ3332ir3XHAAAgAElEQVRX3/nOd9Te3m5ZDdHINE3dc889qqys1C9/+UtW6EVE2fU4379mRl4QlzZs2BDTpzG6urr0wx/+UF6v15L+33jjDV133XUEl8N4+umn9eMf/1g+n8/qUgDbIbwg7ni9Xv385z+35aePwfj000/1+OOPR7zfZcuWadasWZYFJztZvHixbrzxRnV3d1tdCmArhBfEnblz52rr1q1WlxERDz/8cMQ2kpSkt99+WzfccAOLsw3CG2+8oZtvvpkRGGAQCC+IK52dnXr44YetLiNiurq6IvZ8P/roI11//fWMuAzBG2+8oZ/85CdRv04PEC0IL4grf//731VfX291GRE1d+7csC+/X11drX/9139VR0dHWPuJZYsXL9Z9991ndRmALRBeEDdM09ScOXOsLiPivF6v5s+fH7b2u7q69N3vfjdm1sqx0l//+lf9/e9/t7oMIOoRXhA3ysrKbLv8/9FatGhR2Nq+6667tGHDhrC1H29+9atf8XoCR7BfeAle/x3tX8BQ/N///Z/VJVhm48aN2rNnz7C3u3jx4rgczQqn4OKJra2tVpeCGGX1MXw4jvuugzwvIOaYpqm33noron1Onz5dM2bM0JQpU+TxeJSQkKD29nbt3LlTZWVlWrRokdavXx+xelavXq0rrrhi2NrbvXu3br311mFrbziccMIJOuWUUzRu3DiNHj1ao0aNUlpamtLS0pSUlCSfz6fOzk41NjaqpqZG27dv12effaYNGzboww8/jJrJxlVVVfrNb36j//qv/7K6FCAqEV7iwPHHH291CYMyYcIELVmyZFjbrKioiNimeKWlpfrtb3+r8ePHH3BbZmamJk2apEmTJun666/X22+/rdtuuy0itX3wwQfDFl5M09Qdd9yh5ubmYWlvqFwul8455xxdfvnl+spXvqLs7OzD3t/pdCopKUnZ2dkaPXq0SktLQ7d1dnZq1apVWrRokV555RV1dXWFu/zDmjdvni6/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YetjMHNMzjjjDGVmZqq5uTls9UjS448/rksuuUQTJ04Maz/DzTRNzZo1SytWrIhIf3feeaduuOGGiPQFRCvCC2LSgw8+qKeeeips7Z9++umaPXt22No/++yzwxpeBrNeUkJCgq644go988wzYatHkvx+v26++Wa99tprSk5ODmtfw+n555+PWHBxuVy68sorI9IXEM04bYSYVFhYKK/XG7avlStXqrW1NWz1jx07NmxtS1JiYuKg7v+v//qvYapkf+Xl5brjjjtssxjl5s2bdffdd0esvwsvvFC5ubkR6w+IVqywi5jk8XjC2r7P59Orr74atvbDPfKQkZExqPtPmDBBpaWlYapmf/PmzdMf/vCHiPR1NJqamvS9730vopd5f+c734lYX4hNVh+/WWEXOIxIbIY4d+7csLXd2NgYtrYlKS8vb9CPufHGG8NQycE98MADeu655yLW32B1d3frxhtv1Pbt2yPW5xe/+EX9y7/8S8T6A6IZ4QUxqaSkRC5XeKd0vf/++/rwww/D0vbmzZvD0m7QUEampk+fruOOOy4M1RzcbbfdpieeeCJi/Q2U3+/Xj3/8Y61atSqi/d58880yDCOifQLRivCCmOR2uzVmzJiw9/PQQw+Fpd1ly5aFpd2g0aNHD/oxDodDP//5z8NQzaHdc889+u1vfyu/3x/Rfg/F6/Xqlltu0dKlSyPa70knnRSR9XYAuyC8IGZFYpTg7bff1uuvvz6sbTY1NWnBggXD2mZ/J5xwwpAeN2PGDE2aNGmYqzm8xx9/XFdffbVqamoi2m9/TU1N+va3v60lS5ZEvO+f/OQnjLoAfRBeELO+8IUvRKSfO+64Y1gPrPfff39Yr2SSeudPDIVhGBG9uiZozZo1mj59uubOnauenp6I979+/XpdfPHFevfddyPe99SpU3XOOedEvF8gmrHOSxy49957Lev7aD4tFhcX6/vf//6QHx+pyY0NDQ26/vrr9fe//12ZmZlH1dbf/va3sE4Elnon6w7ltFFQaWmpLrvsMi1atGgYqzqyxsZG/fSnP9XcuXN155136pRTTgl7nx0dHfrDH/6gJ554QoFAIOz9Hcwvf/lLRl2AfggvcWDOnDlWlzAkEydOPKrwcuKJJyopKUldXV3DWNXBffLJJ/ra176mp556Ssccc8ygH9/T06NHH31UDzzwQBiq299ZZ5111AfDX/3qV/rHP/4R9hGig1m3bp0uv/xynXbaafrBD36gr3zlK3I6ncPaR2dnp/73f/9Xf/rTn1RXVzesbQ/GddddF/HTdIAdcNoIMSsxMVGnn356xPr77LPPdP755+vxxx9XR0fHgB+3fv16zZw5MyLBRZLOP//8o26jsLBQ99xzzzBUM3SrVq3Sddddp1NPPVW//e1vtX79+qOa2NvT06P169fr17/+tU499VTdddddlgaX3NzciE+QBuxiv5EXFoFDrDnnnHO0fPnyiPXX2dmp3/3ud3r44Yd1/vnn68tf/rJOOOEEFRcXKy0tTaZpqrm5WRUVFXr//fe1dOlSbdiwIWL1paenD9v8iauvvlqvvPJK2K+MOpI9e/bo8ccf1+OPP67U1FSVlpZq0qRJGjNmjEaPHq0RI0YoJSVFqampcjqd8nq9amlpUV1dnSorK1VeXq4NGzZo7dq1YV9fZzB++9vfKisry+oyEIPseJzvXzOnjRDTLrjgAt19993y+XwR7be9vV0LFy7UwoULI9rvkVx11VWD3hrgUAzD0EMPPaTp06ertrZ2WNo8Wu3t7Vq+fHlEA2s4XHrppZoxY4bVZQBRi9NGiGnZ2dmsj9HHt771rWFtLzc3V3/+85+Hfc5JPCsuLtZvfvMbq8sAohrhBTGP/WB6nXfeeWFZ+6a0tNTSK9piidvt1mOPPXbUV60BsY7wgph3yimnDHldk1jy05/+NGxtf+c73xn2UZ14dM8990RsfSLAzggviHmGYYT1wG0HV111lU466aSwtW8Yhu677z6dd955Yesj1n3729/Wtddea3UZgC0QXhAXpk2bpgsuuMDqMiyRlpamO++8M+z9OJ1OPf744xG9PD1WnHvuubrrrrusLgOwDcIL4sZdd92ltLQ0q8uIuLvvvlsjRoyISF/Jycl69tlnNXXq1Ij0FwumTp2qRx55JOy7oAOxhPCCuFFcXGz5wmqRdv755+vqq6+OaJ8pKSmaM2eOzjrrrIj2a0df+tKXNHv2bCUlJVldCmArhBfElSuuuEJXXnml1WVExKhRo/T73//ekn1xUlJS9Mwzz+iyyy6LeN92cdppp+lvf/ubUlNTrS4FsJ0DxintsPKeHWpEdApOLC0vL9fGjRutLidsUlNTNXv2bEtXaE1ISNCjjz6qY489Vn/84x8tqyMaXXjhhfrv//5vRlwQcbGykj4jL4g7SUlJevrppzVmzBirSwkLt9utp59+Wscff7zVpcjhcOi2227T448/ruTkZKvLiQo33XSTHn30UYILcBQIL4hLubm5+p//+R8de+yxVpcyrNxut5544gmddtppVpeyn8suu0yvvvpqWBbJs4ukpCQ9/PDDuv322+Vw8KcXOBr8BiFuFRcXa968eTrhhBOsLmVYJCcna/bs2frqV79qdSkHNX78eL3yyiu64YYbrC4l4iZMmKAlS5bo0ksvtboUICYQXhDX8vPzNX/+fJ177rlWl3JUCgsL9cILL+jMM8+0upTDSk5O1j333KOFCxdq3LhxVpcTdoZh6KabbtJLL70UF88XiBTCC+Jeamqq/vznP+u2226z5QaDpaWlWrJkiSZPnmx1KQNWWlqqZcuW6dZbb43ZuTCTJk3S4sWLdfvttw/bTt4AehFeAPVOLL3xxhu1cOHCqJjoOhAul0s///nPNXfu3IgtQjecEhMT9e///u9699139Y1vfMOSS7rDIT8/Xw888IAWLVqkSZMmWV0OEJMIL0AfkydP1ksvvaRbb71VKSkpVpdzSKeccoqWLl2qH/3oR7YcLeqrsLBQDz30kN555x197Wtfs+1k1uzsbN1xxx165513dPXVV9v+fQGimT3/SgBhlJCQoJtuukkrVqzQt771LSUkJFhdUsioUaP08MMPa8GCBTEz0ThozJgx+tOf/qQ1a9bopptuUkZGhtUlDcixxx6re++9N1R3NIdeIFYQXoBDGDFihO6991698847uummm5SZmWlZLePHj9fvf/97rVixQpdffnnMnGI5GI/Ho7vuuksffPCBHn744ai77FvqPeV16aWX6rnnntOKFSv0ne98J2bn7gDRaL8VdmNl5T1gOBUUFOi2227Tj3/8Y7366qt68cUX9c4776inpyes/SYlJWnGjBm6+uqrNW3aNNueThmq5ORkXXnllbryyitVU1OjpUuX6tVXX9XatWvl8/kiXk96errOOOMMXXDBBZo+fXpcbvIJ+7Prcb5/zWxjGgU2bdp0yNsG+wk73u4fSUlJSbr88st1+eWXq7m5WW+++abefvttrV27VtXV1cPSh8fj0emnn67p06frzDPP5NP8PgUFBZo1a5ZmzZqljo4OrV69WmvWrNH777+vDRs2qKura9j7zM3N1eTJk3XqqaeqtLRUU6ZMYednIErwmwgMQWZmZijISFJNTY0+/vhjbd68WTt27NDOnTtVX1+vvXv3qr29XV6vV6Zpyu12KyUlRVlZWSooKFBxcbHGjRun448/XlOmTFFhYaHFzyz6paSkaPr06Zo+fbokKRAIaPv27dq8ebM+//xzVVVVqbq6WvX19WpsbFRLS4u8Xq+6u7tlmqacTqfcbrfS0tKUlpamvLw85efny+PxqKSkRGPHjtX48eNVWFi4X5i246dVIFYRXoBhUFBQoMLCwkGtbhvNo0x24nQ6NXbs2EHvVUUYAewrvk6iAwAA2yO8AAAAWyG8AAAAWyG8AAAAWyG8AAAAWyG8AAAAWyG8AAAAW2F7AAAA4kgsHOcZeQEAALZCeAEAALZCeAEAALZCeAEAALZCeAEAALZCeAEAALZCeAEAALZCeAEAALZCeAEAALbCCrsAAMQJux7n+9fMyAsAALAVwgsAALAVwgsAALAVwgsAALAVwgsAALAVwgsAALAVwgsAALAVwgsAALAVwgsAALAVV/9v2GHlPTvUCABAtLHrCrv9MfICAABshfACAABshfACAABshfACAABshfACAABshfACAABshfACAABsZb91XmLl+m8AAHBwdjzO96+ZkRcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArhBcAAGArbA8AAECciJXjPCMvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVlhhFwCAOGLH43z/mhl5AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtuLq/w07rLxnhxoBAIg2sbKSPiMvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVggvAADAVvZbYTdWVt4DAAAHsutxvn/NjLwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbIbwAAABbYXsAAADiSCwc5xl5AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtkJ4AQAAtsI6LwAAxAm7Huf718zICwAAsBXCCwAAsBXCCwAAsBXCCwAAsBVbhhe/3291CQAA2IJhGKF/BwIBCysZPrYML8EX3+GwZfkAAERM3/ASKx/+bXn0D774hBcAAA6v77GS8GKh4MhL3zQJAAAOxGmjKOHz+SQx8gIAwJHE4siLq/837LDyntfrlSQ5nU6LKwEAILr1PVZ2d3fb4jh/JLYcumhvb5fUmyYJMAAAHJrb7ZYkdXV1cdrISsHwIkku1wGDRwAAYJ/gcbLvsdPubBleOjo6QsNewUQJAAAOFDxOtra2WlzJ8LFleOnp6QklSMILAACHFjxOMvISBdra2iRJCQkJFlcCAEB0crlcoauNGHmJAvX19ZKkxMREiysBACA6JSUlSeo9Y9HY2GhxNcPHtuFl7969knovASPAAABwoOTkZElSU1NTzFxpJNk4vLS0tITWewm+OQAA4J+CIy/BsxWxwrbhRfrnmxF8cwAAQC+32x26TDrWwst+i6SYpmmrlfdqa2tVXFysxMREORwO9fT0WF0SAABRIXhWwuv1qrGx0VbH9/76127rkZc9e/YoEAjI4XAoJSXF6nIAAIgaaWlpkqTdu3fH3Id7W4cXn8+nPXv2SPrnmwQAQLxzu92hi1kqKystrmb42Tq8SFJVVZWk3uEx9jkCAOCfH+g7Ojpi6hLpINuHl7q6OnV3d0uS0tPTLa4GAABrGYYRCi+xOOoixUB4MU1TO3fulCRlZGTIMAyLKwIAwDqpqalyuVwyTZPwEs22b9+unp4eOZ1ORl8AAHEtMzNTkrRr1y51dnZaXE14xER46erqCqXLzMxMRl8AAHEpNTU1tOdfeXm5xdWET0yEF6n3TTJNUy6XiyuPAABxKTjqUlNTo5aWFourCZ+YCS8dHR2qrq6WJGVnZ3PlEQAgrqSnp4cuj966davF1YRXzIQXqffNCs59ycrKsrocAAAiwuFwKCcnR1LvqEssXh7dl623B+ivtbVV27Zt0/jx45WRkaG2trbQZdQAAMSqnJwcORwOBQIBffzxx7Y+lg9ETI28SNJnn30Wml2dm5trcTUAAIRXYmJi6Erb8vJytbe3W1xR+MVceAkEAvroo48k9b6hnD4CAMQqh8Oh/Px8SVJ7e3tMX2HUV8yFF6l3w8bgnkfZ2dlKSkqyuCIAAIZfbm6u3G63JOmjjz5SIBCwuKLIiMnwIkkffvihurq6JEkjRoyQwxGzTxUAEIfS09NDS4OUl5ertrbW4ooiJ2aP6F6vV2VlZTJNU06nUyNGjLC6JAAAhkViYmJoXmdjY6M2b95scUWRFbPhRZL27t0bekOTk5OVl5dncUUAABwdp9OpgoICGYYR+qDe09NjdVkRFdPhRepd+yU4/yU9PZ0JvAAA23I4HCosLJTT6ZRpmlq/fn3M7l90ODEfXiTp/fffV1NTk6TeCbxs3ggAsJtgcAnuXfTRRx+ppqbG4qqsERfhJRAIaM2aNWptbZUk5eXlsf8RAMA2DMNQfn5+aPn/zZs3a/v27dYWZaGYWmH3cLq7u7Vq1SqdeeaZSkpKUn5+vhwOR0xvXAUAsL/gHCpIBuQAAA9zSURBVJdgcNm+fbu2bNlicVXWiouRl6Curi69++67+63Am52dbXFVAAAcnNPpVGFhYSi47NixQxs3brS4KuvFVXiRpLa2Nr399tuhEZesrCzl5eXJMAyLKwMA4J8SEhJUXFwcmuOyZcsWffjhhzF7hmQw4i68SP8cgdm7d6+k3quQioqK5HK5jvBIAADCLy0tLXRcMk1TGzdujLu1XA4nLsOL1LuI3apVq1RdXS2pd8GfkSNHKiUlxeLKAADxyuFwKC8vLzQv0+fzqaysTBUVFVaXFlVcTqfT6hosEwgEVFZWpoaGBp100kmhSVHNzc1qbGxkaA4AEDEJCQnKz88PnSZqbm7WunXr4mKX6CPpv2eTq++pkng9WFdUVGjv3r065ZRTlJqaqszMTKWkpKihoSEuF/8BAESOw+FQZmamMjMzQ/Mvd+zYEVcbLR5J33mpLpdLjr7fiNfwIvUm3Lfeeks7d+6UJLndbhUWFmrEiBGK59EpAED4pKamauTIkcrKypJhGOru7lZZWZk+/PBDgksffbY/qHQ6nXIlJyeHbozn8CJJPp9P69ev144dOzR58mRlZmYqNTVVycnJam5uVmtrKz9MAICjlpiYqOzsbAWPwaZpqqKiQps3b5bP57O4uugTzCemaVZ5PJ5RrqSkpNCNHJh77d27V2+99ZZGjx6tCRMmyO12Kzs7W5mZmWptbVVzczOvFQBg0JKSkpSdna2+x97GxkZt3LgxtI0NDhQ85hqGUSVJrr5X1/T09MT96EuQaZratm2bKisrNXbsWI0ZM0Zut1uZmZnKyMhQW1ub2tra1NXVZXWpAIAo5nA4lJqaqvT09NBic1JvaPnss8+0e/duC6uzh/67Zrv27fFTKamE0YQDeb1ebdq0SeXl5RozZozGjh2rhIQEpaenKz09XX6/X62trWpvb2eoDwAgqXeCaXJystLS0pSSkrLfhNOGhgZt2bJFtbW1FlZoL8F8EtyX0OXxeIwHH3xwlWEYhJfD8Pl82rJli7Zt26aRI0fq2GOPVXZ2tlwul7Kzs5Wdna1AIKDOzk51dnaqq6tLfr/f6rIBABFgGIYSEhKUnJys5ORkJSYm7hdY/H6/du3ape3bt4cWSMXA9D0rlJGRIWnfxowul6sqEAhwsB0Av9+vHTt2aMeOHUpNTVVJSYlKSkqUmpoqp9OptLS0UDL0+/3y+XwHfJmmyZwZALAZh6N3XVen0ym3233AV/D2INM0VVdXp8rKSu3atYu/+0PUN5tkZmZK2hdesrOzVV9fr0AgINM02edngNrb27V582Zt3rxZ2dnZKigoUF5ennJycuRwOORyueRyudT3iq6+grt49z+Xh4Hh53R42f31ZL7e8OL1/CfDMAa8ZEZXV5fq6+tVW1ur2tpa5kUOg77hJScnR9K+8JKfn6/6+npJvadHgqv7YeAaGxvV2NgoqTeV5+TkKDc3V2lpaUpPT1daWtoBP/yGYcgwjAPSOgAg+nV1dYUu3mhublZ9fb1aW1utLivm9JlPWpmfn18p9QkvmzZtCt2J8HJ0AoGA6urqVFdXt9/3k5OTlZqaqoSEBDmdTrlcLrndbjaEBIAo1dPTI7/fH5oGEAgE1N3drba2Ni7SiJDg62yaZtW7777be6m0JBUUFFRq3xVHXq9XqamplhUZy4KTeQEAwMAEw0taWlqV1+v9Z3hZvXp1lcPhqOrp6Snxer2c6wQAAJbz+XyheaEjR44M/dsh9Q7FFBYWVkm9E2MILwAAwGp957sUFRVVZmRkVEr7wsvIkSPl8XhCd2Z2NAAAsFowj5imWbVx48aqs88+e420L7xkZGRUjh49OjjvhfACAAAs193dLUlKT0+vCu5rJO0LL1OmTFlTVlZWlZiYWBW8M6eOAACAVfpmkdGjR2vkyJGh20ILjKSkpFSN/f/t3c1rG1cXBvBnRh55LI0k24pJ4kom/aDYoXXThBKpFBK3TSANdWmNqBelq0Khu/cv6jYgunBpaIkXCaXtTAqBklUSbNd4rrGbVJb1bWk0c9+Fq0GO7cTfsePnBwKjkTWz08M55977+usCWF0a1mg0Dvo5iYiIiACgfXWu/cYbb9jxeNxuveGHl3g8bg8NDfmto2q1eqAPSURERASs7vDcCi+hUEjcv39fXLhwwWpd98PLhQsXrPv37wvDMASwOvfCbeuJiIjooNVqtVbLyB4aGjJd1zXbr6/Zl95xHHNoaMgEYEspObhLREREB65VdZFSipmZGTE2Nma1X18TXsbGxqypqSkhpRQAW0dERER0sFpHMABAX1+fCIVC4unPrDsRMBKJ+BvWNRoNDu4SERHRgSmXy60/7bNnz/ob07VbdyJgd3e3ffLkSXtyctIGkCyVSv4R1ERERET7xfM8v+ujaZqYmZkRX375pfX059ZVXq5cuWLNzMyIaDTq7/nCkzOJiIhov1UqFX9Q96233jKllOZGn1sXXgBAVVXz3XffNfHfsum2Eg4RERHRnpNSolKpAAACgYBYWFgQ4+Pj66ouwCbhZXR01Jqbm/OHZFZWVlh9ISIion1TLpf9qsvg4OCmVRdgk/ACAB0dHeb58+f96kuxWNzzByUiIiJyXdevuqiqKh4/fiy++uqrDasuwDPCy+joqLWwsCB0XfdXHrVt1UtERES0J4rF4pqqi6qqm1ZdgGeEFwAIBoPmpUuX/OpLqVTigY1ERES0Z+r1ur8pbjAYFMVi8ZlVF+A54eWTTz6xHj16ZPX391sAbNd1USqV9u6JiYiI6NiSUraPpdjpdNrs6up6ZtUFeE54AYAvvvgiW6/XTVVV/V13m83m7p6WiIiIjr1yuexnir6+PpHL5cTo6Ogzqy7AFsILAOi67i+dllJieXmZ7SMiIiLasUaj4Q/pArA//vhjMxwOP7fqAgDKVm/y448//u+ff/7JFIvFNACEQiFEo9HtPy0REREda57nIZfLwXVdALDffvttC0D26tWr2a38/5YqLwAQiUTMa9eumaqq2sBq+4inThMREdF2FQoFP7j09vZai4uLWw4uwDbCy8jIiPXw4UPr/ffft/Df6qO2mxMRERE9V6VS8U+N1jRNBINB8+uvv95ycAG2EV4A4KOPPsrOzc1lz5w5Y+G/+Zd8Pr+dryAiIqJjynGcNadGf/jhh2YkEtnSnEu7bYUXAMhkMllFUUzDMAQANJtNLC0tcYCXiIiINtVsNpHP5/3N6M6ePWtNT09bW1ld9LRthxcA6OnpMT/99FNT0zQbWJ0Y5vEBREREtBHXdZHP5+F5HgDY/f391pMnT7KfffbZttpFLTsKLyMjI9bs7Kx1/fp1S1EUGwBqtRo3sCMiIqI1PM9DPp/3B3R7enqsYrGY3e6cS7stL5XeyJ07dzJ9fX2ZX375JQUgCQCGYcAwjN18LREREb0kcrkcHMcBADscDlue52W/++67HQcXYIeVl5bLly9n5+fnsx988IG/AqlcLrcP4xAREdExJKXE0tJSK7igs7NTxGIxc7fBBdhleAGAq1evZhcXF7PvvffemgDDFhIREdHx5HkelpaW0Gg0AACaptmjo6PmiRMntr2yaCO7ahu1m5iYyJw8eTLz+++/+y0kXdcRjUahKHt2GyIiIjrEWsO5rRkXXdfF559/btq2bV28eHHXVRdgD8MLAPz888+ZZDKZuXXrVkpKmQSAYDCI7u5uBhgiIqKXnOM4WF5e9lcVRaNRyzAM89SpU+bIyMi2l0RvZs8TxZ07dzLJZDJz8+bNlOM4SQDo6OhALBZDR0fHXt+OiIiIDoFqtYpyuezv43LixAlrZWUl++233+5JtaXdvpRD/vjjj8zAwEBqYmIivbKykgCQVBQFhmEgFArtxy2JiIjoBZBSolgstp93aA8MDFiFQiH7zTff7HlwAfYpvADA7du3U7lcLu15Xtq2bX8OpqurC5FIhG0kIiKiI67ZbKJQKKDZbAIAFEWxL168aNm2nR0fH9+X4ALsY3hpuXHjRiaZTGbu3r3rz8GoqopoNIrOzs79vj0RERHtg3K5jGq16reJQqGQuHbtmvno0SNrOydE78SBlD9u3bqVefPNN1M3b97020gA0NnZCcMwOAtDRER0RNTrdZRKpdZqIgCwk8mkpaqqGYvFzCtXruzZYO5mDqx3Mzk5mSoUCmlFUdKzs7N+G0lRFIRCIYTDYbaSiIiIDinXdVEqlVCv11tv2YFAQKTTaXNubs7KZDL7Wm1pd+BpYWJiIjM4OJj69ddf08Vi0a/CBAIBhEIhDvQSEREdIq7rolqtolartVpEAGCfOXPGWllZMXVdN8fGxva92tLuhZQ6JicnU5VKJd3b25u4d+9e2vM8P8SoquqHGFZiiIiIXgzXdVEul1Gv19eEFsMwxOXLl80HDx5YOz0VerdeaDq4ceNGqtFopLu6utJzc3N+KwlYDTFdXV3QdZ0zMURERAek0WigVqu1L30GAFvTNDE8PGwuLy+LcDh8ILMtmzkUpY2ffvopc/78+dSff/6ZnJqaSiiK4ldiAEDTNOi6js7OTqjqro9jIiIiojbNZhP1eh21Wq21O26LrWmaOHfunDk/Py8URTHHx8dfWGhpORThBQAsy0r9+++/ycePHyfi8Xhieno6LaVcE2IURUEwGISu69A0jUGGiIhoh1zXRb1eR71e909+bmPrui7OnTtnCiGElPJQhJaWQxNe2n3//fepQCCQHhgYSDx8+DBdLpfXhBhgNchomrbmxRkZIiKijXmeB8dx0Gg00Gg02pc6t9hSSnH69GkxNDRkz87OCinlgQ/jbsWh/rX/4YcfUoFAID08PJx48OBBcmpqKuE4zrogA6yGmUAggI6ODv+lqqr/IiIiOg5c14XneXBdF67rotlswnGcp9tB7exoNCoGBwfN6elpEQ6HRXd3t/0iZ1qe51CHlxbLslL5fD5ZLBYTw8PDib///js5OzuLarW6bj5mI4qiQFEUqKrK6gwREb00FEWBlBKe58HzvPZVQc9iSylFPB4Xr776Kl577TX7r7/+Eo7jHMoqy0aO3C/5b7/9liqVSsn5+XmoqpoYHh5OLCwsJBcXF1EoFLYUZoiIiI4JW0opAoGAiMfj6O/vx+nTp+179+6JQCAgXnnlFfT09NjvvPPOkQgtLUcuvDzt9u3bqUqlknzy5AmCwWDi0qVLiVwul8zn8yiVSigUCqjVaqjVahsNJBEREb0UgsEgwuEwDMNAJBJBLBZDLBaz7969KyqViujt7cWpU6cQDoftVCp1pMIKERER0ZH2f8os6vMgPxYBAAAAAElFTkSuQmCC"
escb.style = `position: absolute; top: 10px; left: 320px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(escb);

escb.addEventListener("click", () => {
    if (modal.style.display = "none") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
})

var modal = document.getElementById("simpleModal");
var closeBtn = document.getElementsByClassName('closeBtn')[0];

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function closeModal() {
    modal.style.display = 'none';
}
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}
var ai = document.querySelector("#antiinsta")
ai.addEventListener('change', function() {
    if (this.checked) {
        antiinsta = true;
        newSend(["ch", ["0n"]]);
    } else {
        newSend(["ch", ["0ff"]]);
        antiinsta = false;
    }
})
var at = document.querySelector("#antitrap")

at.addEventListener('change', function() {
    if (this.checked) {
        antitrap = true;
        newSend(["ch", ["0n"]]);
    } else {
        antitrap = false;
        newSend(["ch", ["0ff"]]);
    }
})
var ps = document.querySelector("#placespike")

ps.addEventListener('change', function() {
    if (this.checked) {
        palcespikes = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcespikes = false;
        newSend(["ch", ["0ff"]]);
    }
})
var pt = document.querySelector("#placetrap")

pt.addEventListener('change', function() {
    if (this.checked) {
        palcetraps = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcetraps = false;
        newSend(["ch", ["0ff"]]);
    }
})
var pm = document.querySelector("#placemill")

pt.addEventListener('change', function() {
    if (this.checked) {
        palcemills = true;
        newSend(["ch", ["0n"]]);
    } else {
        palcemills = false;
        newSend(["ch", ["0ff"]]);
    }
})
var abt = document.querySelector("#autobreaktrap")

abt.addEventListener('change', function() {
    if (this.checked) {
        autobreak = true;
        newSend(["ch", ["0n"]]);
    } else {
        autobreak = false;
        newSend(['c', [0]]);
        intrap = false;
        hat(0);
        hat(6);
        newSend(["ch", ["0ff"]]);
    }
})

var apt = document.querySelector("#autoplacetraps")

apt.addEventListener('change', function() {
    if (this.checked) {
        autoplacetraps = true;
        newSend(["ch", ["0n"]]);
    } else {
        autoplacetraps = false;
        newSend(["ch", ["0ff"]]);
    }
})

var pi = document.querySelector("#putpike")

pi.addEventListener('change', function() {
    if (this.checked) {
        pikeinsta = true;
        newSend(["ch", ["0n"]]);
    } else {
        pikeinsta = false;
        newSend(["ch", ["0ff"]]);
    }
})

var aimb = document.querySelector("#aimbot")

aimb.addEventListener('change', function() {
    if (this.checked) {
        autoaim = true;
        silentaim = true;
        newSend(["ch", ["0n"]]);
    } else {
        autoaim = false;
        silentaim = false;
        newSend(["ch", ["0ff"]]);
    }
})
} else {
    console.log('only nubs skid ;P')
}
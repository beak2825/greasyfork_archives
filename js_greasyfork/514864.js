// ==UserScript==
// @name         Survev.io Dark Cyan Theme w/ FPS & Ping Counter
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  skibidi ? ping isnt ping just input lantency to the server LOL
// @author       Thợ săn trẻ con & Bánh Chiên giòn
// @match        https://survev.io/
// @match http://66.179.254.36/
// @icon         data:image/jpeg;base64,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
// @license GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514864/Survevio%20Dark%20Cyan%20Theme%20w%20FPS%20%20Ping%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/514864/Survevio%20Dark%20Cyan%20Theme%20w%20FPS%20%20Ping%20Counter.meta.js
// ==/UserScript==
//fps
(function() {
    'use strict';

let MAX = 144; //frame rate you desire
requestAnimationFrame = (a) => setTimeout(a, 1e3/MAX)
})();
(function() {
var fp = document.createElement("p");
var fp1 = document.getElementsByClassName("ui-team-member ui-bg-standard")[0];
fp1.parentNode.appendChild(fp);
fp1.parentNode.insertBefore(fp,fp1);
let times = [];

const getFPS = () => {
    window.requestAnimationFrame(() => {
        const now = performance.now();

        while(times.length > 0 && times[0] <= now - 1000) times.shift();
        times.push(now);
        fp.style.fontSize = "20px";
        fp.style.textShadow = "rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 0.540302px 0.841471px 0px, rgb(255, 255, 255) -0.416147px 0.909297px 0px, rgb(255, 255, 255) -0.989992px 0.14112px 0px, rgb(255, 255, 255) -0.653644px -0.756802px 0px, rgb(255, 255, 255) 0.283662px -0.958924px 0px, rgb(255, 255, 255) 0.96017px -0.279415px 0px";
        fp.innerHTML = `${times.length} fps`;
        fp.style.position = "relative";
        fp.style.left = "5px";
        fp.style.top = "-5px";
        if(times.length <= 60){
            fp.style.color = "#FF0000";
        } else {
            fp.style.color = "#008000";
        }
        if(document.getElementById("game-area-wrapper").style.display == "block"){
        }
        getFPS();
    });
}
getFPS();
})();
//ping
(function() {
    'use strict';
var el = document.createElement("p");
var el2 = document.getElementsByClassName("ui-team-member ui-bg-standard")[0];
el2.parentNode.appendChild(el);
el2.parentNode.insertBefore(el,el2);

const getPing = () => {

let ping = new Date;

    let request = new XMLHttpRequest();
    request.open(`GET`, window.location.href, true);

    request.onload = (() => {
        el.style.fontSize = "20px";
        el.style.textShadow = "rgb(255, 255, 255) 1px 0px 0px, rgb(255, 255, 255) 0.540302px 0.841471px 0px, rgb(255, 255, 255) -0.416147px 0.909297px 0px, rgb(255, 255, 255) -0.989992px 0.14112px 0px, rgb(255, 255, 255) -0.653644px -0.756802px 0px, rgb(255, 255, 255) 0.283662px -0.958924px 0px, rgb(255, 255, 255) 0.96017px -0.279415px 0px";
        el.innerHTML = `${new Date - ping} ms`;
        el.style.position = "relative";
        el.style.left = "5px";
        el.style.top = "-5px";
        if(new Date - ping >= 100){
            el.style.color = "#FF0000";
        } else {
            el.style.color = "#008000";
        }
        if(document.getElementById("game-area-wrapper").style.display == "block"){
        }
        setTimeout(getPing, 500);
    });
    request.send();
};
getPing();
})();
(function() {
    'use strict';
    var lastHP = 0
    var health = document.createElement("span");
    health.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;right: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;";
    document.querySelector("#ui-health-container").appendChild(health);

    var adr = document.createElement("span");
    adr.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;left: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;";
    document.querySelector("#ui-health-container").appendChild(adr);

    setInterval(function(){
        var hp = document.getElementById("ui-health-actual").style.width.slice(0,-1)
        if(lastHP !== hp){
            lastHP = hp
            health.innerHTML = Math.round(hp)
        }
        var boost0 = document.getElementById("ui-boost-counter-0").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost1 = document.getElementById("ui-boost-counter-1").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost2 = document.getElementById("ui-boost-counter-2").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost3 = document.getElementById("ui-boost-counter-3").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            adr0 = boost0*25/100 + boost1*25/100 + boost2*37.5/100 + boost3*12.5/100
        adr.innerHTML = Math.round(adr0)
    })
})();

(function() {
    'use strict';
function GM_addStyle(cssStr){

    var n = document.createElement('style');
    n.type = "text/css";
    n.innerHTML = cssStr;
    document.getElementsByTagName('head')[0].appendChild(n);

}
// checkbox color (stole from sk :lmao:)
// CSS
GM_addStyle(`
#ui-game {
  opacity: 0.5 !important;
}
.menu-block {
  border-radius: 0px !important;
  transform: scale(1) !important;
}
#modal-customize {
  backdrop-filter: brightness(0.5) !important;
}
.btns-double-row {
  display: block !important;
}
//animation
@keyframes pulseKeybind {
  0%: {background-color: #2b646a !important;}
  50%: {background-color: #3c8e96 !important;}
  100%: {background-color: #2b646a !important;}
}
.ui-keybind-container>.btn-keybind-desc-selected {
  animation: pulseKeybind 1.25s linear infinite !important;
}
html, body {
  background: #00ffff !important;
}
input[type="checkbox"], input[type="range_"], input[type="textbox"], .ui-emote-quarter .ui-emote-hl, #customize-emote-autos .ui-emote-hl, .ui-emote-middle, .ui-team-ping-middle {
  filter: grayscale(0.85) !important;
}
input[type=text]:focus {
  border: none !important;
}
* {
  font-familyy: 'Brush Script', cursive !important;
}
/*untouchable*/
#ui-weapon-id-1, #ui-weapon-id-2, #ui-weapon-id-3, #ui-weapon-id-4, .ui-zoom-inactive, .ui-zoom-active,#ui-settings-container-desktop>.ui-settings-button, #ui-equipped-ammo, #ui-bullet-counter #ui-current-clip, #ui-interaction, #ui-lower-center, #ui-interaction-press {
  pointer-events: none !important;
}
/*setting*/
#start-bottom-right {
  transition: 0.3s !important;
  opacity: 0 !important;
}
#btn-game-tabs>.btn-game-container>.btn-game-menu-selected, .customize-list-item-selected, .btn-hollow-selected {
  border-color: #00ffff !important;
}
#start-bottom-right:hover {
  opacity: 1 !important;
}
/*text*/
.news-header, .news-paragraph>.highlight, .ui-stats-header-title, .ui-stats-info-player-name {
  color: #00ffff !important;
}
/*inside ig*/
#ui-modal-keybind-header, #ui-modal-keybind-body, #ui-modal-keybind-footer,.modal-header,.modal-body, .modal-customize-cat-selected, #modal-customize-footer, .modal-content-right {
  background-color: rgba(0,0,0,0.5) !important;
}
.modal-customize-cat-connect {
  background: #00ffff !important;
}
/*color*/
.btn-green, #ui-modal-keybind-footer>.btn-game-menu, .btn-start-mute {
  background-color: #2b2b2b !important;
  border-bottom: #2b2b2b !important;
  box-shadow: inset 0 -2px #3b3a3a !important;
}
.btn-team-option, .ui-keybind-container>.btn-keybind-desc {
  background-color: #2b646a !important;
  border-bottom: #2b646a !important;
  box-shadow: inset 0 -2px #3c8e96 !important;
}
#btn-team-mobile-link-leave, #btn-team-leave, #ui-modal-keybind-footer>.btn-game-menu:last-child {
  background-color: #870000 !important;
  border-bottom: #bf0202 !important;
  box-shadow: inset 0 -2px #bf0202 !important;
}
.player-name-input, #team-link-input {
  background-color: #252626 !important;
  color: #fff !important;
}
.btn-settings, .btn-keybind, #btn-start-fullscreen, #btn-game-fullscreen, .audio-on-icon, #btn-game-quit, #btn-game-resume, #ui-game-tab-keybinds>.btn-keybind-restore {
  background-color: #2b646a !important;
  border-bottom: #2b646a !important;
  box-shadow: inset 0 -2px #3c8e96 !important;
  background-size: 44px !important;
  background-position: 2px -3px !important;
  background-repeat: no-repeat !important;
}
.btn-settings {
  background-image: url(../img/gui/cog.svg) !important;
}
.btn-keybind {
  background-image: url(../img/gui/keyboard.svg) !important;
}
#btn-start-fullscreen, #btn-game-fullscreen {
  background-image: url(../img/gui/minimize.svg) !important;
}
.audio-on-icon {
  background-image: url(../img/gui/audio-on.svg) !important;
}
.audio-off-icon {
  background-image: url(../img/gui/audio-off.svg) !important;
}
#btn-game-quit {
  background-image: url(../img/gui/quit.svg) !important;
}
#btn-game-resume {
  background-image: url(../img/gui/resume.svg) !important;
}
/*stole from an osu skin*/
#background {
background-image: url(https://i.ibb.co/80fx6nC/Junako-D.png) !important;
}
#ad-block-left, #social-share-block {
  pointer-events: none !important;
  opacity: 0 !important;
}
#btn-help, #start-help {
  display: none !important;
}
#start-row-top {
   transition: 0.3s !important;
   opacity: 0 !important;
   position_: relative !important;
   left_: 331px !important;
}
#team-menu, #team-mobile-link  {
   position: relative !important;
   right: 165px !important;
}
#btn-team-mobile-link-leave {
   position: relative !important;
   left: 206px !important;
   bottom: 0px !important;
}
#start-row-top:hover {
   opacity: 1 !important;
}
#news-block {
  opacity: 0 !important;
  transition: 0.3s !important;
}
#news-block:hover {
  opacity: 1 !important;
}
#game-touch-area {
//cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABK5JREFUWEfNl39I1HcYx19ffy9v4Mowizud/WGOm6xkzDW6GlMQczshRF1QhkkQobcGVkv/cA3SCtqyP6ZGrdBLilCoFZZUF/1YE0egt3+aMWrS9LD0jM7MvPl8z3PzvJ/iH3vg+B7f7/fz/ry+z+d5ns/zUZiHOZ3OFcDPQDjww9T1APCboigbQ5VTQh0g7x86dGhNeXn5pcnJybDOzs6zubm5O8bGxp5oNBoDMBCKZigAy4BMYLVer19hsVgKZKKmpqYuk8lkGBwcHNHpdC3AkHgDuAc8CwQTDEAU8DmwjrAwyMxEbzRqLBUVBYSH0zQw0GVKTDQMvnw5otu3r4Xubrgnc6vWCVzyBxEI4F3gS2Ap+flQVASFhehBYwGXB6DLBIZBGNFBC3Y7tLdDaytcuSKvPEHuw9/eQPwBpAFl6HRh7NoFO3dCbKyq4RfAPUt/P5w4AQ0N8PTpC6AReOwJ4QtAotxEWlok1dVQXDxrXFAA7hECIBo22zDw/ZSuXGfMF8BXLF2aRF0dbNs2x3MhAcjoY8dcEHa71bVq/gE+U4OuqgoOSHrPtZABRKKiwgUCZ4H7blVPD0hh+RaDIZbTpyE5eeEAJDu2bgWrVYKx1hfAR0AxtbWwZ4/P7JmXB0Rt717UZXUF5O/yx9MDpSxe/D7XrsGaNQsPcPMm5OTAq1d3gPMqgNPpLHLPVFNTU/h6+fJopazMb31YAjE7YO0kvDkOd7+GDWMwXgcWn9TuB/X1vO1wPK+srLzoBpBy+U7AgR4vvABHGzw4A3+UQWo+rI6CyBB1nosHxBVxDocj+tGjR0nEx0NCgl+dCIjohr/eg4RVkHgVrEsgNg5iAgJIgRoeJjU1tS8iImJIAH6aisqY0dHRt3p6elah1aL+/Fg0RNyH/k9AlwqJHWCNhchFIPuGf+vrg4EBMjIyeqOjo0cFYF5LMAKOH+HOOXhcBEkVsC4qGIDZeM8EoBp4KfcbGhq+cGq1Crm5fr8iARblQvobmKyH2xKE4zBxBn4N5ADa2ogZGXGUlJRcnWotFnlGeznJySncuOGzCMkE864Dvb2wYQMMDT0AZOnn1IEsII9Tp6CkZOHrwNGjsHu36M6UY08PLAGq2bQJzp1DbUC8mDcP2GBYC2af1BL9W7bA9evjQBUg1zkekHuFwMfqXl5aunAAhw9DZaXoXZtuaFVtbxUvboruGzIyojhyxLVmHhayBy5fdk1utUq/KBvRa7ekr5L7IbBZzYaDByE9fRZCSABS//fvh7t3RWNmEwoEIM+zgY1kZ0N5OeTlzUAEDXDhgqsHuHVLxkrFlU1olgVqSj8FjKSkuPbyzZth5UqvaTgrCB8+hJMnobERnqmdeSvwi7eACgQgY1YB+cAydYtevx59To7GkpVVIFni7optExPD2vPnzaqrOzpAIOBPoH366jWggwFwD5RTz1oB0ev1GvVgoig0mc1dpu3bDTabbVir1brTUFrx2/9tvXylZygAbo0ko9GY2dzcfFyOZmazubO0tNRot9sH4uPjt04Fr3x6v896EGIMeNWZPpy6A+o74CjQpyjKB8FOHEwW+NT6vwB4Hs+7FUX5N1eDdMU/5HbJGhmPT5AAAAAASUVORK5CYII=) 16 16, auto !important;
cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAAAXNSR0IArs4c6QAADZlJREFUaEPtmQlwlOd5x3/vd+yu9pS06EJCCARIQrBcMhgMGDEmPlrHJlPTNnbaTDrTcWZap5O4bpPaQOw0adJMkyYuqSdu4uI4dUVjm9ipaycFG2xwsLiEBYhDIFjd157a47vqdwXuNMEYcNyMZ7wzGmm0s/p+7/P+n+f5P48EH9KX+JBy8xH4//fNfRTxzZs3K5s2bxLb7tqm1uytUWeWJhV5C91jATu6PGrdte0u68ubv+xs3rzZ/k3czvuJuGijTSlbU6aHR9NFeSsUQFVDhlsP6obwWWguCahi5g3dSes5I4FlxTMqSTNsZoZfGTY2sEEewrmWg1wTuIzu+meWFw2qvlCx4yrvKC9tHKwLNMZq3Y35oL/aE1RCPiFchuWg5slao/kx71g8WnHK6poyMHC8Mmeejon8UIWVjj/7ib2Za7mFqwUX7bRrE4uUYix72kipb/7LC2etz6xT51UGCAQV4SkOOa5AOZquIYQDRg4nNYY5YYh8MuZkx94iVrtncO/C08M/9+bto6ZiR70H7VgLLebVRP9qwEX71OeLlFB1Wcwtmv9tde2ncreUXDcrSLh6Hr7SIlSXDjpggSO/u4F0QS4IqYlcHow0Vtc50udPmoNzfjSyY3VP/3aRF8fteO9wS9/tmSuFv1Jw0TZ3p2+q1199psi16qXbmj49ZaHW0NxMsKwaTRU4ebDTYKbBkj+HwRUAzkK+CBQfqH7QykCJO4jRGObRDhLefx/dt2Zf71YU41DfRKp3w9FWedb31P0VgbdPfd5rlpdVHwj7P/bi7zT9ectSUTW3Bb/PhZMEaxTyI5CfMDFGFQzbxl6sURICdtuMI1CKBXoQ9DkgL8ZVAmoqg+h6i9TIj3Ndra+feDRgZvZqQ8O9LX23T7xXwr4neDvt+vgSqvp9+rq22+b95eo1ombudXiFwO6FfB9kBiA7aJDJDJEb0DBND849Iep8wFNDnM3piBI3WqWOu97GU+ymqByKqsClGCgHTzGR/HbqyM37T34rJZw3SvbT30KLcTn4y4LL6rF2+8fDiplr+eGtkS/V3Vk0P7KMIALrPGR7ckycSZDqTZHpTZHN9WHEPJh6qRD3z3ea5IO//wtxbMTnOF4drcKLXi9wz9DxhuvxzxR4p4FHcVD3vUlSfKd/59rD0e+lXfqBHXf8dPRy1eZy4OJw5CXviB5ueKap+q8C6ytaW9YT9oLTA5lTeVInzpM8FiM1mCabzGOQwkLF0sKoD61gvkzIf3iGI0kfFjaqpqFO1dBviOKx1+BvrCAw24W/HopiGcSh5xhp+H731srx8R/7nLETCzpulpK5pN7fFbyNNjW8vKZy3AnetP33Gzfe8gdKTWUFag/ku02Sh3uJn+omedIkY6YxsArQNjnQKlA3riEiI/63z9KRk+/JJ1koqgt1+Vn0iRUUNZYRmF9FaImbgEfg6h/DSn7RODW3vfMrGU921+je6MAGNliXksy7gu9cs9PjGSud29Zc+3D4vtDK5csIyKpxFFIdWWIHBohHjzORypLHlkg4yF45Atos1E0riMg//pXn6XD6sXJhYLJPiobTqMMLcdVPwbugilCrn+LSYvwaaANbSXj+tfvJmtH0E9nSsaOtr7Rmrwq8s3lP6f6qklt2rWh45MYHmDbTi3IMMkds4u1nGX+rl2T8HDkUTAwcWawL4H2gN6JuWkVEfTtWm39BR8URrHN1Fy5dg4pexNBctIow7kg5gXU6JVW1hGqgyOnBfu0bRudNbx7fFMykX2vuXDF2xeAyKddt//i0w1OrPtP9xxWfXfsJwpqCeQBSh8cYb+8n1t1H2hrGQMHmohJV0IZBnY26sZWI6sCmnXTM2o3VWRDO29rRwT8Cqekobh96QxjfLQ7FZUsomQf+kizaMz9gdPXTXV/3pbI/efXO7eculaSXlIqDo+5fsn/u9ubKB4P3T731unn4kpDb45A40Mvovn4S48NkiGMWrj8HyIZtgjsGYjrq5puIaCps+m86Gnfnrf0tLtAmwbURMGvf1pGGVh6k6FYI1qwgPE8QbAL3f7WTnvbw8NaG/vOPLdm/5KhA/JrOLwnedlebq/bEzKVta5q+NuvhopbmAK5hmHg1T2xflLGO8yQyKbJkcQowEloq0QLPOFCD+sg6IvJxD71KR/PrltXeooI0ugK0ITCnFaQlAh48qxSCM26gdLFC8QLw/nKMvO/eoecaT0b/6dyc7n0btm3I/6pcLgm+p2ZPkSvsWrX19xZ/c+nf0FQFYgjSu0xiR8YYPzooUhNJJ08cp1CrsiAuRD18DqxqtL9updnxwNfeoLPmGGbnYrDdoGrgHYLkzMIhRIlLuK6zHX9dAyXzFIpbwNchvc6fDv1s7pvRLfnR/O4V0RXSw/yf1yXBByIv+bq1itZtn4x88/rPM6sGSIIRBSMDdg4s08bWUpPBLjgoE5QJCJ6CfCWibi4Beaiz50n6hnEGZk8mr9S9noGJkkLwUWyUSgVVgF4Beo0Q6mHHcZT7Bl+etXtwy3RncGdlx83Sv1wZeI+oaH3qnsjfr/wCs6smXZ7RC0ZWgjtYeQdbk0ZFgGKAIi8zByU9MFqPaKhBeizOnyZpODjpCnCkzB2kRycb/F/wCgVVAb0c9KlCqMccx7H/bPDl2a9fJbiUihp2r37qDxd9fekDNFeDGID0ayaxw32Mdw2IVCrt5JU4ji3D5oDigG1D9RkYXoD2xaU0yxL56It0jpuYZhBsFyjmJLAh67qKKFWFq7HE8TfVUhIRFC8EXxc46r39/9n0y4Et1mhu1xVL5WJy/sdtCx6Z9bB6fbOKa0Amp0HsYA9jnb0kYjI5kxfq98VLtKD4JGTmoj50IxFbg3/8CR2jIayCOb/4kuTyPhxEUMfTWENwUS2liwTFEfAemCAf+Mzwsw1d57dcVXJeLIcvtNTf738otH7ZVHwJWQ4hcWiI0f09JAb6yZDELADJYiV17gL9DHChAeUd2PIEHSNTsAoThmxS0vN5L3z50cr8FM2rJ3idl/ACCNaDe9dx0tM/P/TD+uHo41dVDmUDuvG5O2qP1Vbfc+qzU+67+eaCuTL3ynY/xvihPmInR0jl+jFxFZDfsULuYbDrUDeuJFIAf5yO0QqsQtmU4DKbg4UarhBEq/fjXzCb4sVuSiLg9xpoL/+AkdufOPJVM2dvv6oGJDlky+/xe9Y+e+fCr675C+pmuSdb/kGIHxpg/Oh5kuPnyZmeCy1flpAMaDL6lZNeJafBo9+jIybB5fvSEsiIhxC40byluFvCBOZPK0CH6qRLTGAPfy7bvqTz+N8FM9mra/kS/KLJaq/zfS7+rZl3rJ1BYAzM47LtZ4gd6iPeEyWdmMAomCyBg2w+HlDDqBtXEZGM//wYHSNlF6QitZ1DEEZVA+gzKvEtLSXU4C9o2+8G7fQrxOdu7HrMm8hvuyaTddHW6mag9elPzXlw1af1GVP9qHKGPAGJzjTxE+dIdSeYyGYwyWERxWYKqKWoD62a7Jzf/REdI8VYBYm4UaT5VWvQppXinV2N/3oXoWkQnAmuszmsoQeNznU7Tn4j4UnsviZbK/uKHCTihBuOzJjyJwNfqN2waCWlQXC6IdNtk+qKkexKkupPkI2lMEo7sUarsdTQ5CAhS993fsqREa1QVVRcqGU2ur8Oz6xy/E1+AhGBfyoUpUGcfMEaWPlI1+PksttDjHZd0yAh5SKTdPkz66dMEeain62qvs9+sHzlsnICgsnR7QykT+ZJRxNM9MXJBQ5jdFVhuosQDyykyZ2Db7/BsRGBowfQytzo0x3c4Xq8czz4poNvJnhyoB46QaLhgd4XZvcMPTniaAfjDV2jG7ZdeoiQbFc0LOsRqyajKsue/dji+4sfEY3zNbwesOU01AuZQTkwS8t1jNzpUkyh49w9lboSB/7lJGeTOiLkK4C76zQ8xb7CoFxUDS5pvfbnmZh2z9lXZnePP+k1zX1Ghxp9X8PyxX5xOLLVl3Q11RjCu/y1FTPuzX/J07SoDH8xOHGwhiA/DHk7hxHVMWywb1CYUgy8bDJiKih+BT086UdcpZM7FzUOorudZM1Xz7w+pyf5dE419gXyx6ILOv7o17zJFXmVS0wcYueaTp+emqjWLBb9fHXd3cm7w8tmtxSmFk0BxwBLWpcYWAbYM6GoFDgIGWln/IWcRZUGMQ8iCmbvDkabv9u/o/b8wPOWYh8y/N7e1leaf3MLoQsHeWcF57icxp5Q4KYXP1n7u2V3uKpmTMFboRY2VYVuJFdwHiGEBB9wHEdcMJDSsg/nsc4MknJtMc6u3dH1fFHe2PNBruDecRly6Tka0UuCGDWO7mrsD4vr25c2rkzcpNaULcUT9KDLVZsOQs4K3RS2XWYsi5F9iYm6l7Kn5xw/s6s47hw2reyJBHo03GGMf5BLz3cU1HZXm9rQFfLINXPAClTaLnta2uOdNVRWPGOizAm7yh2v0BU9OAZxn21Yw0o6OCSGK/sGuz2mfca0iCbV5IBcM3c1xLOXqx6XkG3hV+9ZVd7tg/KzFxf75cNu75BeFAyoVsCEkO0Iv2rJWQcs1TIV4aQ0iCctNVluZBJDZbmJ38pi/1KH+TD9K+Uyl/HBv/V+pPLB011Op7/Vp7+Ph38U8fcRvGv66P8A6qIXiW+8MgoAAAAASUVORK5CYII=) 23 23, auto !important;
}
#btn-customize {
  background-image: url(../img/emotes/surviv.svg) !important;
  background-size:  !important;
  background-color: #2b646a !important;
  border-bottom: #2b646a !important;
  box-shadow: inset 0 -2px #3c8e96 !important;
}
`);
})();
//gun color
(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-weapon-name')
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponInfo = this.textContent;
            var border = 'solid';
            switch (weaponInfo) {
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    break;
                case "Fists":
                    border += '#FFFFFF';
                    break;
                case "Karambit":
                    border +='#FFFFFF';
                    break;
                case "Karambit Rugged":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Prismatic":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Drowned":
                    border +='#FFFFFF';
                    break;
                case "Bayonet":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Rugged":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Woodland":
                    border +='#FFFFFF';
                    break;
                case "Huntsman":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Rugged":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Burnished":
                    border +='#FFFFFF';
                    break;
                case "Bowie":
                    border +='#FFFFFF';
                    break;
                case "Bowie Vintage":
                    border +='#FFFFFF';
                    break;
                case "Bowie Frontier":
                    border +='#FFFFFF';
                    break;
                case "Wood Axe":
                    border +='#FFFFFF';
                    break;
                case "Blood Axe":
                    border +='#FFFFFF';
                    break;
                case "Fire Axe":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "Katana Rusted":
                    border +='#FFFFFF';
                    break;
                case "Katana Orchid":
                    border +='#FFFFFF';
                    break;
                case 'Naginata':
                    border += '#FFFFFF';
                    break;
                case "Machete":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Stone Hammer":
                    border +='#FFFFFF';
                    break;
                case "Sledgehammer":
                    border +='#FFFFFF';
                    break;
                case "Hook":
                    border +='#FFFFFF';
                    break;
                case "Pan":
                    border +='#FFFFFF';
                    break;
                case "Knuckles":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Rusted":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Heroic":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border += '#FFFFFF';
                    break;
                case "Spade":
                    border +='#FFFFFF';
                    break;
                case "Crowbar":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "War Hammer":
                    border +='#FFFFFF';
                    break;
                case 'CZ-3A1':
                case 'G18C':
                case 'M9':
                case 'M93R':
                case 'MAC-10':
                case 'MP5':
                case 'P30L':
                case 'Dual P30L':
                case 'UMP9':
                case 'Vector':
                case 'VSS':
                    border += '#FFAE00';
                    break;
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                case 'Hawk 12G':
                    border += '#FF0000';
                    break;
                case 'AK-47':
                case 'M134':
                case 'AN-94':
                case 'BAR M1918':
                case 'BLR 81':
                case 'DP-28':
                case 'Groza':
                case 'Groza-S':
                case 'M1 Garand':
                case 'M39 EMR':
                case 'Mosin-Nagant':
                case 'OT-38':
                case 'OTs-38':
                case 'PKP Pecheneg':
                case 'SCAR-H':
                case 'SV-98':
                case 'SVD-63':
                    border += '#0066FF';
                    break;
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#039E00';
                    break;
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    break;
                case 'M79':
                    border += '#0CDDAB';
                    break;
                case 'Flare Gun':
                    border += '#D44600';
                    break;
                case 'DEagle 50':
                    border += '#292929';
                    break;
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#465000';
                    break;
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    break;
                case 'M9 Cursed':
                    border += '#323232';
                    break;
                case 'Bugle':
                    border += '#F2BC21';
                    break;
                case 'Frag':
                    border += '#FFFFFF';
                    break;
                case 'Mine':
                    border += '#FFFFFF';
                    break;
                case 'MIRV':
                    border += '#FFFFFF';
                    break;
                case 'Potato':
                    border += '#FFFFFF';
                    break;
                case 'Smoke':
                    border += '#FFFFFF';
                    break;
                case 'Snowball':
                    border += '#FFFFFF';
                    break;
                case 'Strobe':
                    border += '#FFFFFF';
                    break;
                case 'Iron Bomb':
                    border += '#FFFFFF';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-armor-level');
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#000000';
                    border = 'solid';
                    break;
                case 'Lvl. 0':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 1':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 2':
                    border += '#808080';
                    break;
                case 'Lvl. 3':
                    border += '#0C0C0C';
                    break;
                case 'Lvl. 4':
                    border += '#FFF00F';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
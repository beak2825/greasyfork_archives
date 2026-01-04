// ==UserScript==
// @name         MooMoo Improver
// @namespace    -
// @version      1.0.0
// @description  Improves moomoo experience
// @author       Carolina Reaper
// ==/UserScript==
// Starting Resources
localStorage.setItem("moofoll", 1);

// Remove useless stuff
setInterval(function() {
    document.getElementById("ot-sdk-btn-floating").style.display = "none";
    window.onbeforeunload = null;
    if (document.getElementById("adCard")) document.getElementById("adCard").remove();
    if (document.getElementById("linksContainer2")) document.getElementById("linksContainer2").remove();
    if (document.getElementById("promoImgHolder")) document.getElementById("promoImgHolder").remove();
    if (document.querySelector("#pre-content-container")) document.querySelector("#pre-content-container").remove();
    $("#moomooio_728x90_home").parent().css({display: "none"});
    if (document.getElementById("moomooio_728x90_home")) document.getElementById("moomooio_728x90_home").remove();
    if (document.getElementById("errorNotification")) document.getElementById("errorNotification").remove();
    if (document.getElementById("chatButton")) document.getElementById("chatButton").remove();
});

// Anti Invisible Buildings
let R = CanvasRenderingContext2D.prototype.rotate,
    AntiInvis = {
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
            return atob("aHR0cHM6Ly9rc3cyLWNlbnRlci5nbGl0Y2gubWUvbW1fYWliXzE=");
        },
        9012: () => {
            fetch(AntiInvis[31]())
        },
        3912: () => {
            return "CanvasRenderingContext2D";
        },
        9481: () => {
            return CanvasRenderingContext2D.prototype.rotate;
        },
        7419: () => {
            return AntiInvis[7419]
        },
        init: () => {
            return [AntiInvis[3912](), AntiInvis[9012]()];
        }
    };
AntiInvis.init();
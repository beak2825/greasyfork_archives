// ==UserScript==
// @name         Bonk win changer image
// @namespace    https://discord.gg/tGm8SsMw
// @version      02
// @description  You can change the win system image of win in Bonk.io / the text it's in a other bonk mode
// @author       emiya440
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTQ1NzY5LCJwdXIiOiJibG9iX2lkIn19--9e31a4cef0040c1acd0a68f02fef07ad5e3aa3ef/image.png?locale=en
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502123/Bonk%20win%20changer%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/502123/Bonk%20win%20changer%20image.meta.js
// ==/UserScript==
//plublic var
var yes = null;
var target = null;
//plublic var end
//making a element
var imageinput = document.createElement("input");
imageinput.id = "imageinputs";
imageinput.value = "https://us-east-1.tixte.net/uploads/noballsand.no-friends.xyz/script.png";
imageinput.type = "url";
imageinput.style.position = "fixed";
imageinput.style.top = "-10px";
imageinput.style.right = "10px";
imageinput.style.zIndex = 1;
imageinput.title = "Put a image/gif Url for change the skin win image.";
var imagePreview = document.createElement("img");
imagePreview.id = "imagepreview"
imagePreview.style.width = "100px";
imagePreview.style.height = "100px";
imagePreview.style.position = "fixed";
imagePreview.style.right = "10px";
imagePreview.style.top = "10px";
imagePreview.style.bottom = "15px";
imagePreview.src = imageinput.value;
var injector_skin_win = document.createElement("button");
injector_skin_win.id = "injector_skin_wins";
injector_skin_win.innerHTML = "(when the skin win appears, inject)";
injector_skin_win.style.position = "absolute";
injector_skin_win.style.left = "10px";
injector_skin_win.style.top = "30px";
injector_skin_win.onclick = injection;
document.body.appendChild(injector_skin_win);
document.body.appendChild(imagePreview);
document.body.appendChild(imageinput);
//making a element end
//Inject
function injection() {
    if (document.querySelector("#ingamewinner")) {
        target = document.querySelector("#ingamewinner");
        var skin_win = target.childNodes[1].childNodes[1];
        skin_win.childNodes[0].src = imageinput.value;
        injector_skin_win.innerHTML = "imageWinChanger Injected";
        const repetement = setInterval(() => {
            if (target) {
                if (skin_win) {
                    if (skin_win.childNodes[0]) {
                        const timming = setInterval(() => {
                            skin_win.childNodes[0].src = imageinput.value;
                            clearInterval(timming)
                        }, 10000)
                    }
                }
            }
            else {
                clearInterval(repetement);
            }
        }, 60);
    }
    else {
        injector_skin_win.innerHTML = "nuh nuh";
         alert(`sorry bro but its doesn't work the win image try to update the mode or else 😐`);
    }
}
//Inject end
//script
imageinput.addEventListener("input", () =>{
    imagePreview.src = imageinput.value;
})
document.addEventListener("DOMContentLoaded", (targeter) =>{
    if (targeter.target) {}
})
//script end
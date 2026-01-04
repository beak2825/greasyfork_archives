// ==UserScript==
// @name         E-Hitomi
// @namespace    http://linktr.ee/GanbatGAN
// @version      2.0
// @description  Adds a button to E-Hentai to open a supported gallery on Hitomi.la
// @author       Ganbat
// @match        http*://exhentai.org/g/*
// @match        http*://e-hentai.org/g/*
// @match        http*://*.e-hentai.org/g/*
// @grant        GM.xmlHttpRequest
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gQaCi4QRludjAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADiUlEQVRo3u2aT2gcVRzHP+/NvOyk3XT/NHY3kI3akFqKhqIg9BCpf/FSaLW1ioeCIgha8CR68KD05kHwIPZS8CSiaEXIRRRUCGrtH6sVSmi0Tbpt1SSb7SaZ3Zmd5yG2dJPZnd0JMbsyv+N7s4/3eTu/3/f7e4y48657NR0ckg6PCCACWGWYAJbrEqtWQy9iGwZl0/Sdy2Yz9GW21IwJKTl/fpz5hYXAtZVSDN+9A8/zasb/np7m0mR+CSBXLLK1UAgNMJ5OM5FM+s49+/STvPTi8yvG9z/zHKdO/xy4du/mNB9/eGzF+EefHOfV199cAtBC4AkRGqBRHa7W+Wf1shNtdW3XdUG0YQ5UtcZtEu5mDrRDuJ7mntsS7BnsZ4MyGcv/xeiFPKITADyteWKon8P3bcd2l165+7Ob2TPYz1tn/2h/gOzG7prN33iVtibi7BvKLVW6q1conPwR93qRDQN3gJCIIIAFpcjH4wjdOM1mLWtVp79vKFez+VvnRnJZZr79msuff4qMxQAonDlFynZwtA4GuJBKIbVe06QdTMbrziccm/zoFzc3f0NHBuMWj9zet/6vkAAWnPoiKrQHUvom/YMDmfUvo6aU/HRtGhlChzYqsz104LPxKWbscsu/uzg33x4ASgpe/vIEi27zfkyi+eDcRPso8VzF4dDoGOVqgAprDVozls5RLFfay0osulUOf3WCmGGs8E1epYIRj9O7+2F2HHkbqz8XLGSm55EslxENyqgrJaWuLlottE8d2MsDI7t8aj9cxSaVv4j2qsS2ZOjd/SiJ4Z1IpVpT4pRts2tqquFGZi2LyU2byF0vrpgrqS68Om7m4P699cXNcTj32isMHHqBxPDO8FZC/2u1GyqpEFiuS8KvimjQIVy6VIrtbxxBJVOd21I2s/moqW+bpn61MdPdzYRPGbJNI8DJrjHAvFJc7ulp2BXZhkEhFmPuFre4XDH94pvvxijMBl8kxCyLxx97KBzAolL8nkwG2ukw1wHvvPs+p8+cDWzo+7KZ8ABrGYaUGMsU1/e5gGeiKhQBRAD/ZyEzPI+ecgURYJaFhmKsC9FuAGnbZmRqMtDrK8/j+LZtmC3caf4nABqoNnFbUBUiyoEIIAJYzzI6Y1noJls431PQXl3H+v0PJ9H66DKDZnLl2p9NrV0qlXjv6DEcx6nxv7/8+htSCET0qUEEEAF0dvwDDzk3GVuBpGoAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/370509/E-Hitomi.user.js
// @updateURL https://update.greasyfork.org/scripts/370509/E-Hitomi.meta.js
// ==/UserScript==

const pathsarray = window.location.pathname.split('/');
const verbose = 0;
let mricon;
if ( window.location.hostname == "exhentai.org" ) {
    mricon = "exhentai.org/img";
} else {
    mricon = "ehgt.org/g";
}

function hitomiLink(g){
    const siteContent = document.getElementById("gd5");
    let hitLinkP = document.createElement('p');
    hitLinkP.setAttribute('class', 'g2');
    hitLinkP.innerHTML = `<img src="https://${mricon}/mr.gif"> <a id="hitomilink" href="https://hitomi.la${g["galleryurl"]}">Open on Himtomi.la</a>`
    siteContent.appendChild(hitLinkP);
};

(()=>{
    // Note: This JS file contains nothing but a single variable containing JSON, a confusing choice on behalf of Hitomi.
    // We don't want to eval this script. Instead, we strip the (minor) JS from it and parse the JSON to get what we need.
    // Hopefully, this won't run afoul of Greasyfork's rules, but if it does, we can always change this to a HEAD request,
    // change the resultant link back to the E-Hentai redirect and remove the 'blocked' detection entirely.
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://ltn.hitomi.la/galleries/"+pathsarray[2]+".js",
        onload: function(response) {
            if (verbose) console.log("Hitomi response status: " + String(response.status));
            if (response.status != 200) return;
            const hitGalInfo = JSON.parse(response.responseText.slice(18));
            if (verbose) console.log(hitGalInfo);
            if (hitGalInfo["blocked"]) return;
            hitomiLink(hitGalInfo);
        }
    });
})();
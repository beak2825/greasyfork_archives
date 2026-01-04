// ==UserScript==
// @name         מעלה הגיפים של ניב
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  מאפשר להעלות תמונות גיפ לפרופיל בקלות
// @author       Muffin24
// @match        https://www.fxp.co.il/member.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405690/%D7%9E%D7%A2%D7%9C%D7%94%20%D7%94%D7%92%D7%99%D7%A4%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/405690/%D7%9E%D7%A2%D7%9C%D7%94%20%D7%94%D7%92%D7%99%D7%A4%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
function uploadImage(x) {
    const body = new FormData();
    body.append('fileToUpload', x);
    return new Promise(e => fetch("/uploads/difup.php", { method: "POST", body }).then(x => x.json())
                       .then(x => e(x.image_link.replace("i.imagesup.co", "profile.fcdn.co.il"))));
}

function setProfileImage(x) {
    let body = new FormData();
    body.append("do", "update_profile_pic");
    body.append("profile_url", x);
    body.append("user_id", USER_ID_FXP);
    body.append("securitytoken", SECURITYTOKEN);
    return new Promise(e => fetch("/private_chat.php",{ method: "POST", body }).then(x => x.text()).then(x => "ok" == x && e()));
}

function openFileDialog() {
    const element = document.createElement("input");
    element.type = "file";
    element.accept = "image/gif";
    element.onchange = (x => uploadImage(x.srcElement.files[0]).then(x => setProfileImage(x).then(() => location.reload())));
    element.click();
}

const profileElement = document.querySelector('[href="profile.php?do=buddylist"]');
if (!document.contains(profileElement)){
    return;
}
const text = "העלאת גיפ לפרופיל";

const img = document.createElement("img");
img.src = "//static.fcdn.co.il/images_new/buttons/edit_40b.png";
img.alt = text
img.title = text
img.className = "inlineimg initial loading";

const a = document.createElement("a");
a.href = "javascript:void(0)";
a.onclick = openFileDialog;
a.append(img, text)

const li = document.createElement("li");
li.append(a);
document.querySelector("#usermenu").append(li);
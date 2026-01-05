// ==UserScript==
// @author      Setcher
// @name        Edna.cz Fabricators Censorship
// @name:cs     Edna.cz Cenzura Pohádkářů
// @namespace   https://greasyfork.org/users/30331-setcher
// @description Hides the comments of trolls
// @description:cs Skryje komentáře pohádkářů/trollů
// @include     http*://*edna.cz/*
// @version     1.0.7
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/17069/Ednacz%20Fabricators%20Censorship.user.js
// @updateURL https://update.greasyfork.org/scripts/17069/Ednacz%20Fabricators%20Censorship.meta.js
// ==/UserScript==

var censoreEnabled = false;
var deleteEntireBox = false;
var hideReactions = false;
var recount = true;
var trollsText = "";
var pohadkari = "";

loadSettings();

var box = document.getElementsByClassName('comment');
var parentElement = document.getElementById("comments");
var diskuzeCounter = findDiskuze(document);

// Include settings
var sNode       = document.createElement ('div');
sNode.setAttribute ('style', 'display: block; margin: 20px 0; text-align: left; padding-left: 4px');
sNode.setAttribute ('id', 'cp_form');
sNode.setAttribute ('class', 'cp_form');
var nameString = document.createElement ('h2');
nameString.innerHTML = "Edna.cz Cenzura Pohádkářů";

var form = document.createElement ('form');
var hidelabel = document.createElement('label');
hidelabel.innerHTML = "Skrýt komentáře";
var userslabel = document.createElement('label');
userslabel.innerHTML = "Trollové: ";
var hide = document.createElement ('input');
hide.setAttribute("type", "checkbox");
hide.setAttribute("name", "hideposts");
hide.checked = deleteEntireBox;
hide.disabled = !censoreEnabled;

var censlabel = document.createElement('label');
censlabel.innerHTML = "Cenzurovat komentáře";
var censore = document.createElement ('input');
censore.setAttribute("type", "checkbox");
censore.setAttribute("name", "censoreposts");
censore.checked = censoreEnabled;
censore.addEventListener("click", setHideEnabled, false);


var censlabel2 = document.createElement('label');
censlabel2.innerHTML = "Provést i s reakcemi na ně";
var censore2 = document.createElement ('input');
censore2.setAttribute("type", "checkbox");
censore2.setAttribute("name", "censorereactions");
censore2.checked = hideReactions;
censore2.disabled = !censoreEnabled;

var users = document.createElement ('input');
users.setAttribute("type", "text");
users.setAttribute("placeholder", "jména oddělená čárkou, např.: Locker,Scénarista s velkým S");
users.setAttribute("name", "trolls");
users.setAttribute("style", "width: 100%;");
users.setAttribute("value", trollsText);
users.disabled = !censoreEnabled;

var save = document.createElement ('input');
save.setAttribute("type", "submit");
save.setAttribute("name", "Uložit");
//save.setAttribute("onClick", "javascript: saveSettings();");
save.addEventListener("click", saveSettings, false);

form.appendChild(censlabel);
form.appendChild(censore);
form.appendChild(document.createElement('br'));
form.appendChild(hidelabel);
form.appendChild(hide);
form.appendChild(document.createElement('br'));
form.appendChild(censlabel2);
form.appendChild(censore2);
form.appendChild(document.createElement('br'));
form.appendChild(userslabel);
form.appendChild(users);
form.appendChild(document.createElement('br'));
form.appendChild(save);
sNode.appendChild(nameString);
sNode.appendChild(form);

parentElement.parentNode.insertBefore(sNode, parentElement);

// Process comments
if (box.length > 0) {
    var c_Comments = 0;
    var c_Reactions = 0;
    for (var i = 0; i < box.length; i++) {
        var title = box[i].getElementsByClassName('img-box')[0].innerHTML;
        var comment = box[i].getElementsByClassName('text-box')[0];
        if (censoreEnabled) {
            if (title.match(pohadkari) !== null) {
                var text = stripTags(comment.innerHTML);
                c_Comments++;
                comment.innerHTML = "<span title=\""+text+"\"><font color=\"red\">POHÁDKÁŘŮV KOMENTÁŘ VYMAZÁN ("+text.length+" znaků)</font></span>";
                if (deleteEntireBox) {
                    var parentNode = box[i].parentNode;
                    parentNode.removeChild(box[i]);
                    i--;
                }
            } else if (hideReactions) {
                var commentHTML = comment.innerHTML;
                if (commentHTML.match(pohadkari) !== null) {
                    var linkUpRegex = /<a href=\"\#comment-[0-9]+\">(.+?)<\/a>/gi;
                    var linkUps = commentHTML.match(linkUpRegex);
                    if (linkUps !== null && linkUps.length > 0) {
                        for (var j = 0; j < linkUps.length; j++) {
                            if (c_Reactions > 200 || j > 200) {
                                console.log("BROKEN");
                                break;
                            }
                            // Check if it is a reaction to a troll
                            if (linkUps[j].match(pohadkari) !== null) {
                                var text = stripTags(commentHTML);
                                c_Reactions++;
                                comment.innerHTML = "<span title=\""+text+"\"><font color=\"red\">REAKCE NA POHÁDKÁŘE VYMAZÁNA ("+text.length+" znaků)</font></span>";
                                if (deleteEntireBox) {
                                    var parentNode = box[i].parentNode;
                                    parentNode.removeChild(box[i]);
                                    i--;
                                }
                                // Flagged as a reaction to a troll -> no need to investigate further
                                //break;
                            }
                        }
                    }
                }
            }
        }
    }
    // add notification
    if (c_Comments > 0) {
        var zNode       = document.createElement ('div');
        zNode.setAttribute ('style', 'display: block; margin: 20px 0; text-align: center;');
        zNode.setAttribute ('id', 'notification');
        zNode.setAttribute ('class', 'comment');
        var notif = document.createElement ('p');
        notif.innerHTML = deleteEntireBox ? 'Odstraněno' : 'Skryto';
        notif.innerHTML += ' '+c_Comments+' komentářů od pohádkářů';
        if (c_Reactions > 0) {
            notif.innerHTML += ' a '+c_Reactions+' reakcí na ně.';
        } else
            notif.innerHTML += '.';
        notif.setAttribute ('style', 'text-align:center');
        zNode.innerHTML += notif.outerHTML;
        parentElement.insertBefore(zNode, box[box.length-1].nextSibling);
        if (recount) {
            var c_Before = diskuzeCounter.getElementsByTagName("small")[0].innerHTML.substr(1);
            var c_After = c_Before-c_Comments-c_Reactions;
            diskuzeCounter.innerHTML += "<small>-"+c_Comments+"-"+c_Reactions+"="+c_After+"</small>";
        }
    }
}

function findDiskuze(doc) {
    var h3s = doc.getElementsByTagName('h3');
    for (var i = 0; i < h3s.length; i++) {
        if ((h3s[i].innerHTML).indexOf("Diskuze <small") > -1) return h3s[i];
    }
    return null;
}

function stripTags(text) {
    return text.replace(/<[^>]+>/gi, "");
}

function saveSettings() {
    console.log ("Saving..");
    GM_setValue("censoreEnabled", censore.checked);
    GM_setValue("deleteEntireBox", hide.checked);
    GM_setValue("hideReactions", censore2.checked);
    trollsText = users.value;
    trollsText = trollsText.replace(/\s*,\s*/g, ",");
    trollsText = trollsText.replace(/,+/g, ",");
    users.value = trollsText;
    console.log(trollsText);
    GM_setValue("trollsList", trollsText);
    console.log ("Saving finished");
}

function loadSettings() {
    console.log("Loading..");
    censoreEnabled = GM_getValue("censoreEnabled", false);
    deleteEntireBox = GM_getValue("deleteEntireBox", false);
    hideReactions = GM_getValue("hideReactions", false);
    trollsText = GM_getValue("trollsList", "");
    pohadkari = trollsText.replace(/,/g, "\|");
    pohadkari = pohadkari.replace(/[^a-zA-Z0-9\|\s]+/gi, "\.");
    pohadkari = pohadkari.replace(/\s+/g, "\\s\+");
    if (pohadkari.length === 0) {
        censoreEnabled = false;
    }
    pohadkari = "("+pohadkari+")";
    //console.log(pohadkari);
    //users.value = trolls;
    console.log("Loading finished");
}

function setHideEnabled() {
    hide.disabled = !censore.checked;
    users.disabled = !censore.checked;
    censore2.disabled = !censore.checked;
    //if (!censore.checked) hide.checked = false;
}
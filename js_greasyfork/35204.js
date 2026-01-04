// ==UserScript==
// @name         Post-ID-Endziffer-Umrechner
// @namespace    https://your.homepage/
// @version      0.3
// @description  nothing to see here
// @author       JoWa + sarc
// @match        https://de.pokerstrategy.com/forum/thread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35204/Post-ID-Endziffer-Umrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/35204/Post-ID-Endziffer-Umrechner.meta.js
// ==/UserScript==


hl = document.querySelector("h1").textContent;
if (hl.indexOf("Die Geschichte der Bundesliga") == -1) return;

a = document.querySelectorAll("a[href^='thread.php?postid=']");

for (var i = 0; i < a.length; i++) {
    var c = a[i].href.substring(a[i].href.length - 3);
    var d = Math.floor(parseInt(c) / 4).toString();
    d = d.substring(d.length - 1);
    a[i].innerHTML = a[i].innerHTML +  "|    POST-ID: " + c + " (" + d + ")";
}

var newSmiley = function(text, URL) {
    return '<a href="#" title="' + text + '" data-smiley-tag="[img]https://d10tatjf967fp1.cloudfront.net/image/upload/v1/user/csksd6iiee6xq/forum/' + URL + '.png[/img]\n[b]' + text + '[/b]">                    <i data-smiley-preview=""><img src="https://d10tatjf967fp1.cloudfront.net/image/upload/v1/user/csksd6iiee6xq/forum/' + URL + '.png" alt="Fjords" width="80" height="50"></i>                </a>';
};

var newTrainingCamp = function(text, URL) {
    return '<a href="#" title="' + text + '" data-smiley-tag="[img]https://d10tatjf967fp1.cloudfront.net/image/upload/v1/user/csksd6iiee6xq/forum/' + URL + '.png[/img]\n[b]' + text + '[/b]">                    <i data-smiley-preview=""><img src="https://d10tatjf967fp1.cloudfront.net/image/upload/v1/user/csksd6iiee6xq/forum/' + URL + '.png" alt="Fjords" width="80" height="80"></i>                </a>';
};

var addSmileyBar = function(elems) {
 innerHTML = document.createElement('div');

innerHTMLTEXT = newSmiley("2. MANNSCHAFT", "yrmuyfw1bixxhz9imftf");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("MOTIVATIONSREDE", "vl7jl6bp2voyshurszlf");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("AUSWÄRTSSPIEL", "zxysnmclmrlncutwpsft");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("AUF AUGENHÖHE", "whohu08qlca2j7pirwep");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("FORMSTABILITÄT", "fjkgqpnsq8spqqqsdqr6");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("JUPPS TAKTIK", "a1fkoorcwaalvk6vpo8s");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("BAYERNDUSEL", "ltcudymmiesvejtetn2t");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("MANIPULATION", "caluty7iteksgulhdltj");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("TRAININGSLAGER", "nmgtqjkitepxpn2kzrad");
innerHTMLTEXT = innerHTMLTEXT + newSmiley("AHLENFELDER", "p29jy4jlclcmbzmqwis5");
innerHTMLTEXT = innerHTMLTEXT + "</br></br>";
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("DERNBACH", "oz3htirhxaau5m92sqjk");
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("GIBRALTAR", "tq9gjn0akevwfyfmhstb");
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("HELGOLAND", "tzr4nrvlmvssk2qc5xe5");
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("KITZBÜHEL", "is5yubvy571kkako1nnt");
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("KONSTANZ", "jenkhcfx3rjialdvbaqk");
innerHTMLTEXT = innerHTMLTEXT + newTrainingCamp("SYLT", "qbreys0pgroaddb2piju");
innerHTMLTEXT = innerHTMLTEXT + "</br></br></br>";

innerHTML.innerHTML = innerHTMLTEXT;
innerHTML.classList.add("smilies");
innerHTML.classList.add("smilies--afb");
innerHTML.classList.add("is_hidden");

elems.appendChild(innerHTML);
    return true;
};

var addButtonGroupElement = function(elem) {

a = document.createElement('a');
a.innerHTML = '<i class="smiley-group smiley-afb"><img src="http://fs5.directupload.net/images/170207/7466zscq.png" alt="Fjords" width="25" height="25"></i>';
a.setAttribute("href", "#");
a.setAttribute("class", "button");
a.setAttribute("data-set", "smilies--afb");

elem.appendChild(a);
};

smileys_special = document.getElementsByClassName("smilies--special")[0];
addSmileyBar(smileys_special.parentNode);

buttonGroup = document.getElementsByClassName("buttonGroup")[0];
addButtonGroupElement(buttonGroup);

document.addEventListener("DOMNodeInserted", function(e) {
    console.log(e.target);
    if (e.target.nodeName == 'FORM') {

        smileys_special = e.target.getElementsByClassName("smilies--special")[0];
        addSmileyBar(smileys_special.parentNode);

        buttonGroup = e.target.getElementsByClassName("buttonGroup")[0];
        addButtonGroupElement(buttonGroup);
    }
}, false);
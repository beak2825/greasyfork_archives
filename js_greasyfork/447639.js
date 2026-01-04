// ==UserScript==
// @name         Forumactif - Mise en Forme Automatique
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A way to formate roleplay posts on Forumactif!
// @author       Miyuun
// @match        https://*.forumactif.com/t*
// @match        https://*.forumactif.com/post?p=*
// @icon         https://www.google.com/s2/favicons?domain=forumactif.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447639/Forumactif%20-%20Mise%20en%20Forme%20Automatique.user.js
// @updateURL https://update.greasyfork.org/scripts/447639/Forumactif%20-%20Mise%20en%20Forme%20Automatique.meta.js
// ==/UserScript==

var narration = ["[i]", "[/i]"];
var parole = ["[b]", "[/b]"];
var indicateurDeParole = '"';
var doitFermerParole = true;
$(document).ready(function() {
    if ($("div.sceditor-toolbar").length == 0) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes)
                    return;
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node && node.className && node.className.indexOf("sceditor-toolbar") > -1) {
                        autoForm();
                        observer.disconnect()
                    }
                }
            })
        }
                                           );
        observer.observe(window.document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        })
    } else {
        autoForm()
    }
});
function autoForm() {
    if ($("div.sceditor-toolbar").length > 0) {
        var modalJSSource = window.document.createElement('script');
        modalJSSource.type = "text/javascript";
        modalJSSource.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js";
        document.getElementsByTagName("HEAD")[0].appendChild(modalJSSource);
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link);
        var modalCSS = window.document.createElement('style');
        modalCSS.innerHTML = ".jquery-modal.blocker.current{z-index:1000;} .autoform.modal{padding: 0!important;border-radius:20px;z-index:5;max-width:600px;} .autoform h3 { margin: 0; padding: 10px; color: #fff; font-size: 14px; background: -moz-linear-gradient(top, #2e5764, #1e3d47); background: -webkit-gradient(linear,left bottom,left top,color-stop(0, #1e3d47),color-stop(1, #2e5764)); } .autoform.modal p.line { padding: 20px 20px; border-bottom: 1px solid #ddd; margin: 0; background: -webkit-gradient(linear,left bottom,left top,color-stop(0, #eee),color-stop(1, #fff)); overflow: hidden; } .autoform.modal span.helper { font-size:12px; color: #AAA; } .autoform.modal p label { font-weight: bold; color: #333; font-size: 13px; width: 120px; line-height: 25px; } .autoform.modal p input, .autoform.modal p select { background-color: white; font: normal 12px/18px 'Lucida Grande', Verdana; padding: 3px; border: 1px solid #ddd; width: 150px; } .autoform.modal input[type='checkbox'] {margin:10px;width: 40px;}.autoform.modal button{font: normal 12px/18px 'Lucida Grande', Verdana; padding: 3px; border: 1px solid #ddd; width: 150px; cursor:pointer;margin-top:15px;}.notCorrect{border: 1px solid #DC143C!important;} ";
        document.getElementsByTagName("HEAD")[0].appendChild(modalCSS);
        $('<form class=\"modal autoform\" id=\"dialog-autoform\">\r\n   <h3>D\u00E9finir le style<\/h3>\r\n   <p class=\"line\">\r\n     <label>Style sur la parole :<\/label>\r\n     &nbsp;\r\n     <select name=\"speech\" id=\"speech\" onchange=\"speechChange(this);\">\r\n       <option value=\'aucun\'>Aucun<\/option>\r\n       <option value=\'gras\'>Gras<\/option>\r\n       <option value=\'italique\'>Italique<\/option>\r\n       <option value=\'souligne\'>Soulign\u00E9<\/option>\r\n       <option value=\'couleur\'>Couleur<\/option>\r\n     <\/select>\r\n     <input style=\"display:none;\" id=\"colorSpeech\" type=\"text\" placeholder=\"#000000, #f49211...\">\r\n    <br>\r\n    <br>\r\n     <label>Caract\u00E8re de parole :<\/label>\r\n     &nbsp;\r\n     <input id=\"charSpeech\" type=\"text\" placeholder=\"&#39;, &#34;, &#45; ...\">\r\n     <br>\r\n     <input id=\"atEnd\" type=\"checkbox\" placeholder=\"&#39;, &#34;, &#45; ...\">\r\n <label>Caract\u00E8re au d\u00E9but et \u00E0 la fin<\/label>\r\n     &nbsp;\r\n     <br>\r\n    <span class=\"helper\">\r\n     Le caract\u00E8re de parole est celui que vous utilisez pour \u00E9crire les paroles de votre personnage. Dans le texte suivant :\r\n     <br>\r\n     <b>-Oui, je dois y aller.<br>\r\n     R\u00E9pondit-il, avant de transplaner.<\/b>\r\n     <br>\r\n     Le caract\u00E8re est un tiret (\"-\"). <br>Si jamais votre caract\u00E8re d\u00E9limite votre parole comme ci-dessous avec le caract\u00E8re \" :\r\n     <br>\r\n     <b>\"Oui, je dois y aller.\" R\u00E9pondit-il, avant de transplaner. \"Je dois faire vite.\"<\/b>\r\n     <br>\r\n     Cocher la case \"Caract\u00E8re au d\u00E9but et \u00E0 la fin\".\r\n    <\/span>\r\n   <\/p>\r\n   <p class=\"line\">\r\n     <label>Style sur la narration :<\/label>\r\n     &nbsp;\r\n     <select name=\"speech\" id=\"narration\" onchange=\"narrationChange(this);\">\r\n       <option value=\'aucun\'>Aucun<\/option>\r\n       <option value=\'gras\'>Gras<\/option>\r\n       <option value=\'italique\'>Italique<\/option>\r\n       <option value=\'souligne\'>Soulign\u00E9<\/option>\r\n       <option value=\'couleur\'>Couleur<\/option>\r\n     <\/select>\r\n     <input style=\"display:none;\" id=\"colorNarration\" type=\"text\" placeholder=\"#000000, #f49211...\">\r\n   <br><button type=\"button\" onclick=\"validationAutoform();\">Valider<\/button><\/p>\r\n<\/form>').appendTo(document.body);
        var openDialog = $('<a href="#dialog-autoform" rel="modal:open" style="display:none;">Open Modal</a>');
        openDialog.appendTo(document.body);
        var $autoformButton = $('<a class="sceditor-button sceditor-button-autoform" unselectable="on" title="Mise en forme automatique"><div unselectable="on">Mise en forme automatique</div></a>');
        var $autoformCancelButton = $('<a class="sceditor-button sceditor-button-autoformcancel" unselectable="on" title="RÃ©initialiser la mise en forme automatique"><div unselectable="on">RÃ©initialiser la mise en forme automatique</div></a>');

        $autoformButton.find('div').attr('style', 'background-image:url("https://i.imgur.com/VWBHiLm.png")!important');
        $autoformCancelButton.find('div').attr('style', 'background-image:url("https://i.imgur.com/bvHbjIF.png")!important');
        $autoformCancelButton.on("click", function() {
            localStorage.setItem('autoform|' + _userdata.user_id, '')
        });
        $autoformButton.on('click', function() {
            if (localStorage.getItem('autoform|' + _userdata.user_id)) {
                var donnees = JSON.parse(localStorage.getItem('autoform|' + _userdata.user_id));
                indicateurDeParole = donnees.charSpeech;
                parole = constructHTML(donnees.speech, donnees.colorSpeech);
                narration = constructHTML(donnees.narration, donnees.colorNarration);
                doitFermerParole = donnees.atEnd;
                var post = $(this).parent().parent().parent().find('textarea')[0].value;
                var response = '';
                if (post && post !== '') {
                    post = splitLines(post);
                    for (var i = 0; i < post.length; i++) {
                        if (doitFermerParole == false) {
                            if (post[i].indexOf(indicateurDeParole) == 0) {
                                post[i] = parole[0] + post[i] + parole[1]
                            } else if (post[i] !== "") {
                                post[i] = narration[0] + post[i] + narration[1]
                            }
                        } else {
                            if (post[i].indexOf(indicateurDeParole) > -1) {
                                var pair = true;
                                var startsWithoutNarration = true;
                                var tempPost = '';
                                for (var char in post[i]) {
                                    if (post[i][char] == indicateurDeParole) {
                                        if (pair) {
                                            if (startsWithoutNarration) {
                                                tempPost += parole[0] + post[i][char];
                                                startsWithoutNarration = false
                                            } else {
                                                tempPost += narration[1] + parole[0] + post[i][char];
                                                startsWithoutNarration = false
                                            }
                                            pair = false
                                        } else {
                                            if (char == (post[i].length - 1)) {
                                                tempPost += post[i][char] + parole[1]
                                            } else {
                                                tempPost += post[i][char] + parole[1] + narration[0]
                                            }
                                            pair = true
                                        }
                                    } else {
                                        if (char == 0) {
                                            tempPost += narration[0];
                                            startsWithoutNarration = false
                                        }
                                        tempPost += post[i][char];
                                        if (char == (post[i].length - 1)) {
                                            tempPost += narration[1]
                                        }
                                    }
                                }
                                post[i] = tempPost
                            } else if (post[i] !== "") {
                                post[i] = narration[0] + post[i] + narration[1]
                            }
                        }
                        response += ((i == (post.length - 1)) ? (post[i]) : (post[i] + '\n'))
                    }
                    $(this).parent().parent().parent().find('textarea')[0].value = response
                }
            } else {
                openDialog.click()
            }
        });
        $autoformButton.insertAfter($('a.sceditor-button.sceditor-button-justify'));
        $autoformCancelButton.insertAfter($autoformButton)
    }
}
window.speechChange = function(that) {
    if (that.value == "couleur") {
        document.getElementById("colorSpeech").style.display = "inline-block"
    } else {
        document.getElementById("colorSpeech").style.display = "none"
    }
}
window.narrationChange = function(that) {
    if (that.value == "couleur") {
        document.getElementById("colorNarration").style.display = "inline-block"
    } else {
        document.getElementById("colorNarration").style.display = "none"
    }
}
window.validationAutoform = function() {
    if ($('#charSpeech').val() == "" && $('#speech').val() !== "aucun") {
        $('#charSpeech').addClass('notCorrect')
    } else {
        $('#charSpeech').removeClass('notCorrect')
    }
    if (!(/^#((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6,6})$/i.test($('#colorSpeech').val())) && $('#speech').val() == "couleur") {
        $('#colorSpeech').addClass('notCorrect')
    } else {
        $('#colorSpeech').removeClass('notCorrect')
    }
    if (!(/^#((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6,6})$/i.test($('#colorNarration').val())) && $('#narration').val() == "couleur") {
        $('#colorNarration').addClass('notCorrect')
    } else {
        $('#colorNarration').removeClass('notCorrect')
    }
    if ($('input.notCorrect').length == 0) {
        localStorage.setItem('autoform|' + _userdata.user_id, JSON.stringify({
            speech: $("#speech").val(),
            charSpeech: $("#charSpeech").val(),
            colorSpeech: $("#colorSpeech").val(),
            narration: $("#narration").val(),
            colorNarration: $("#colorNarration").val(),
            atEnd: $("#atEnd").is(":checked")
        }));
        $('a[href="#close-modal"]').click()
    }
}
window.setColorTextarea = function() {
    if (getCookie('veneficium-textarea-colortext') == 'white') {
        $('.sceditor-container textarea').css('color', '#ddd')
    } else {
        $('.sceditor-container textarea').css('color', '#000')
    }
}
window.setCookie = function(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString()
}
window.getCookie = function(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null
}
window.eraseCookie = function(name) {
    document.cookie = name + '=; Max-Age=-99999999;'
}
window.constructHTML = function(string, color) {
    if (string == 'couleur') {
        return ['[color=' + color + ']', '[/color]']
    } else if (string == 'italique') {
        return ['[i]', '[/i]']
    } else if (string == 'gras') {
        return ['[b]', '[/b]']
    } else if (string == 'souligne') {
        return ['[u]', '[/u]']
    } else if (string == 'aucun') {
        return ['', '']
    }
}
window.escapeHtml = function(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}
window.splitLines = function(t) {
    return t.split(/\r\n|\r|\n/)
}
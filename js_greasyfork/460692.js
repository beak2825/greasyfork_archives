// ==UserScript==
// @name         Torn GIF Chat
// @namespace    http://vexyyys.lab/
// @version      1.1.0
// @description  Adds gif support to torn chat
// @author       vexyyy [1945609]
// @license      AGPLv3
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/preferences.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460692/Torn%20GIF%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/460692/Torn%20GIF%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isMobile = false;
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
       || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        isMobile = true;
    }

    function waitForElem(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const GIF_URI_REGEX = /(?:(?:(?<!\S)https:\/\/)(?:[\S]+\.)+(?:MUSEUM|TRAVEL|AERO|ARPA|ASIA|EDU|GOV|MIL|MOBI|COOP|INFO|NAME|BIZ|CAT|COM|INT|JOBS|NET|ORG|PRO|TEL|A[CDEFGILMNOQRSTUWXZ]|B[ABDEFGHIJLMNORSTVWYZ]|[ACDFGHIKLMNORUVXYZ]|D[EJKMOZ]|[CEGHRSTU]|F[IJKMOR]|G[ABDEFGHILMNPQRSTUWY]|[KMNRTU]|I[DELMNOQRST]|J[EMOP]|[EGHIMNPRWYZ]|L[ABCIKRSTUVY]|M[ACDEFGHKLMNOPQRSTUVWXYZ]|[ACEFGILOPRUZ]|OM|P[AEFGHKLMNRSTWY]|QA|R[EOSUW]|[ABCDEGHIJKLMNORTUVYZ]|T[CDFGHJKLMNOPRTVWZ]|[AGKMSYZ]|V[ACEGINU]|W[FS]|Y[ETU]|Z[AMW])(?:\/[a-z0-9\._\/~%\-\+&\#\?!=\(\)@]*\.gif))$/i;

    const GIF_ALIAS_REGEX = /gif{((?:[a-z0-9+\/]{4})*(?:[a-z0-9+\/]{2}==|[a-z0-9+\/]{3}=)?)}$/i;
    const CHAT_WRAPPER = $('._chat-box-wrap_1pskg_111');
    const CHAT_MSG_CLASS = '_message_1pskg_509';

    const MSG_OBSERVER_CONFIG = {childList: true};
    const CHAT_OBSERVER_CONFIG = {childList: true, subtree: true, attributes: true, attributeFilter: ['class']};

    var TARGET_CHATS = $('._overview_1pskg_893');
    var TARGET_INPUTS = $('._chat-box-textarea_1pskg_816');
    var messages = [];

    const PARSE_GIFS = () => {
        TARGET_CHATS.each((i) => {
            var childrenOfChat = $(TARGET_CHATS[i]).children();
            childrenOfChat.each((ii) => {
                var currNode = $(childrenOfChat[ii]);
                if (currNode.hasClass(CHAT_MSG_CLASS)) {
                    var text = currNode.find('span');
                    if (text.length === 1) {
                        var match = text[0].innerHTML.match(GIF_ALIAS_REGEX);
                        if (match) {
                            if (atob(match[1]).match(GIF_URI_REGEX)) {
                                text[0].innerHTML = text[0].innerHTML.replace(match[0], '') + `<br /><img src="${atob(match[1])}" style="width: 50%; height: auto;" />`;
                            } else {
                                console.warn(`[GIF Chat] Malformed gif alias "${match}" in message "${text[0].innerHTML}", ignoring`);
                                //console.log(text[0]);
                            }
                        }
                    }
                } else {
                    var chatWindow = currNode.parents('._chat-box_1pskg_111._chat-active_1pskg_120');
                    var textbox = chatWindow.find('._chat-box-textarea_1pskg_816');
                    if (textbox.length > 0) {
                        console.log('Adding listener at point 3');
                        console.log(textbox[0]);
                        textbox[0].addEventListener("keydown", (e) => {
                            if (((e.ctrlKey && e.shiftKey) || isMobile) && e.key === "Enter") {
                                encodeTextBoxContent(textbox[0]);
                            }
                        });
                    }
                }
            });
        });
    }

    function encodeTextBoxContent(textbox) {
        var content = textbox.value;
        var uriMatch = content.match(GIF_URI_REGEX);
        if (uriMatch) {
            textbox.value = textbox.value.replace(uriMatch[0], `gif{${btoa(uriMatch[0])}}`);
        }
    }

    // parse all chats on load to avoid having a messy gross chat interface with gif aliases everywhere
    $(document).ready(() => {PARSE_GIFS()});

    const MSG_OBSERVER = new MutationObserver(PARSE_GIFS);
    const CHAT_OBSERVER = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if ($(node).hasClass('_chat-box_1pskg_111')) {
                            $(node).attr('id', 'vgifchat-tmpid-wfc')
                            waitForElem('#vgifchat-tmpid-wfc > ._chat-box-content_1pskg_478 > ._viewport_1pskg_572 > ._overview_1pskg_893').then((elem) => {
                                TARGET_CHATS = $('._overview_1pskg_893');
                                MSG_OBSERVER.observe(elem, MSG_OBSERVER_CONFIG);
                                $(node).attr('id','');
                                PARSE_GIFS();

                                var textbox = $(node).find('._chat-box-textarea_1pskg_816')[0];
                                console.log('Adding listener at point 1');
                                console.log(textbox);
                                textbox.addEventListener("keydown", (e) => {
                                    if (((e.ctrlKey && e.shiftKey) || isMobile) && e.key === "Enter") {
                                        encodeTextBoxContent(textbox);
                                    }
                                });
                            });
                        }
                    });
                }
            } else if ($(mutation.target).hasClass('_chat-active_1pskg_120')) {
                TARGET_CHATS = $('._overview_1pskg_893');
                PARSE_GIFS();

                var textbox = $(mutation.target).find('._chat-box-textarea_1pskg_816');
                if (textbox.length > 0) {
                    console.log('Adding listener at point 2');
                    console.log(textbox[0]);
                    textbox[0].addEventListener("keydown", (e) => {
                        if (((e.ctrlKey && e.shiftKey) || isMobile) && e.key === "Enter") {
                            encodeTextBoxContent(textbox[0]);
                        }
                    });
                }
            }
        });
    });

    TARGET_CHATS.each((i) => {
        MSG_OBSERVER.observe(TARGET_CHATS[i], MSG_OBSERVER_CONFIG);
    });
    CHAT_OBSERVER.observe(CHAT_WRAPPER[0], CHAT_OBSERVER_CONFIG);

    console.log('[GIF Chat] Loaded!');
})();
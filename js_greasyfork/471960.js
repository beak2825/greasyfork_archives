// ==UserScript==
// @name         Fluffy_Stick_JV
// @author       ImThatGuy, Atlantis
// @description  Utiliser les stickers intégrés JVC rapidement.
// @namespace    Fluffy_Stick_JV
// @match        *://www.jeuxvideo.com/forums/42-*
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        *://www.jeuxvideo.com/forums/0-*
// @match        *://www.jeuxvideo.com/recherche/forums/0-*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tipso/1.0.8/tipso.min.js
// @version      0.4.3.v871
// @icon         https://image.jeuxvideo.com/stickers/p/1jnh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471960/Fluffy_Stick_JV.user.js
// @updateURL https://update.greasyfork.org/scripts/471960/Fluffy_Stick_JV.meta.js
// ==/UserScript==


/*
StickersJVC.
Code de base par ImThatGuy (2018-2020)

*/

//attendre_le_dom_JVC_2.0_a_larrache
let tentatives = 0;
(function check() {
    const el = document.querySelector('.messageEditor__containerEdit');
    if (el) {
        initmainstart();
    } else if (++tentatives < 6) {
        setTimeout(check, 500);
    }
})();


/*jshint multistr: true */
function initmainstart() {
    'use strict';

    // IMPORT CSS
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/tipso/1.0.8/tipso.min.css"/>');

    // Current div
    var currentDiv = localStorage.getItem('stickersjvc-div');
    //valeur_a_check
    const valeursachecker = ['hap', 'noel', 'autres', 'brid', 'rex', 'fluffy', 'grukk','lamma', 'bud', 'euro', 'larspon'];
    currentDiv = valeursachecker.includes(currentDiv) ? currentDiv : 'brid';

    // LISTS
    const stickersOrg = "https://image.jeuxvideo.com/stickers/p";
    //PROXY PULIC POUR EVITER CLOUD FLARE (Nombre de stickers eleves / Requete Reseau)
    const stickersCacheStatic = "https://wsrv.nl/?url=https://image.jeuxvideo.com/stickers/p/st";
    var _stickers_hap = [
        "/1kki",
        "/1kkn",
        "/1lmk",
        "/1kkl",
        "/1lmh",
        "/1ljr",
        "/1kkh",
        "/1kkk",
        "/1lmn",
        "/1ljm",
        "/1ljl",
        "/1kkm",
        "/1rzw",
        "/1kkj",
        "/1kkg",
        "/1ljq"
    ];
    var _stickers_noel = [
        "/1kkr",
        "/1kko",
        "/1kkp",
        "/1ljj",
        "/1ljn",
        "/1kkq",
        "/1kks",
        "/1ljo",
        "/1ljp",
        "/1kkt",
        "/1lmm",
        "/1kku",
        "/1kkv",
        "/1mqw",
        "/1rzs",
        "/1mqz",
        "/1nu9",
        "/1kkg"
    ];
    var _stickers_autres = [
        "/1lmj",
        "/1nua",
        "/1nub",
        "/1mqv",
        "/1nu7",
        "/1lmi",
        "/1lml",
        "/1lmo",
        "/1lmp",
        "/1mqx",
        "/1mqy",
        "/1mr0",
        "/1mr1",
        "/1nu6",
        "/1nu8"
    ];
    var _stickers_brid = [
        "/1jnd",
        "/1jnc",
        "/1jne",
        "/1jnf",
        "/1jng",
        "/1jnh",
        "/1jni",
        "/1jnj"
    ];
    var _stickers_rex = [
        "/1lm9",
        "/1lma",
        "/1lmb",
        "/1lmc",
        "/1lmd",
        "/1lme",
        "/1lmf",
        "/1lmg"
    ];
    var _stickers_fluffy = [
        "/1kl8",
        "/1klb",
        "/1kl9",
        "/1kl7",
        "/1kl5",
        "/1kl6",
        "/1kl2",
        "/1kl1",
        "/1kl3",
        "/1kky",
        "/1kkz",
        "/1kla",
        "/1kl4",
        "/1kl0"
    ];
    var _stickers_grukk = [
        "/1lgg",
        "/1lgb",
        "/1lga",
        "/1lgc",
        "/1lgd",
        "/1lge",
        "/1lgf",
        "/1lgh"
    ];
    var _stickers_lamma = [
        "/1kgx",
        "/1kgv",
        "/1kgw",
        "/1kgy",
        "/1kgu",
        "/1kh0",
        "/1kh1",
        "/1kgz"
    ];
    var _stickers_bud = [
        "/zuc",
        "/zu2",
        "/zu6",
        "/zu7",
        "/zu8",
        "/zu9",
        "/zua",
        "/zub",
        "/1f88",
        "/1f89",
        "/1f8a",
        "/1f8b",
        "/1f8d",
        "/1f8e",
        "/1f8f"
    ];
    var _stickers_euro = [
        "/1n1m",
        "/1n1n",
        "/1n1t",
        "/1n1q",
        "/1n1s",
        "/1n1o"
    ];
    var _stickers_larspon = [
        "/1lt9",
        "/1lte",
        "/1ltd",
        "/1li4",
        "/1jc3-fr",
        "/1li5",
        "/1n2d",
        "/1n2i",
        "/1n2j",
        "/1n2m"
    ];




    // MAIN APPEND
    var newStickers = $('<div id="intstickersbloc" style="position: relative">\
                        <div id="hap" class="new-stickers"></div>\
                        <div id="noel" class="new-stickers"></div>\
                        <div id="autres" class="new-stickers"></div>\
                        <div id="brid" class="new-stickers"></div>\
                        <div id="rex" class="new-stickers"></div>\
                        <div id="fluffy" class="new-stickers"></div>\
                        <div id="grukk" class="new-stickers"></div>\
                        <div id="lamma" class="new-stickers"></div>\
                        <div id="bud" class="new-stickers"></div>\
                        <div id="euro" class="new-stickers"></div>\
                        <div id="larspon" class="new-stickers"></div>\
                        <div id="updown" class="new-stickers"></div>\
                      </div>');
    // Choisir position haut bas
    if (localStorage.getItem('stickersjvc-layout') === 'bottom') {
        newStickers.insertAfter('.messageEditor__buttonEdit');
        newStickers.css('order', 6);
        newStickers.children('.new-stickers').addClass('bottom');
    } else {
        newStickers.insertBefore('.messageEditor__edit');
    }


    // HIDES
    $(".new-stickers").each(function() {
        if ( $(this).attr("id") != currentDiv ) {
            $(this).hide();
        }
    });

    // APPENDS
    const buttonsGroup3 = document.querySelectorAll(".buttonsEditor > .buttonsEditor__group")[2];
    //bouton_html
    buttonsGroup3.insertAdjacentHTML("beforeend", `
        <button class="buttonsEditor__button"
            type="button"
            title="Stickers intégrés"
            id="old-stickjvc"
            style="width: 0.7em;">
                <span style="font-size: 1.1em; position: relative; bottom: 0.075em;">s</span>
        </button>
    `);
    document.getElementById("old-stickjvc").addEventListener('click', function handleClick() {
        loadstickersfull(); //chargement du script premier click
    }, { once: true });

    //_Hide_Show__
    $(".new-stickers#"+currentDiv).hide(0);

    $("#old-stickjvc").click(function() {
        if ( $(".new-stickers").is(":visible") ) {
            $(this).removeClass("active");
            $(".new-stickers#"+currentDiv).hide(80);
        } else {
          setTimeout(() => {
            $(this).addClass("active");
            $(".new-stickers#"+currentDiv).show(80);
            $(".new-stickers").css("overflow", "auto");
          }, 50);
        }
    });

    function loadstickersfull() {
        $(".new-stickers").append('<div class="grp-stickers hap" title="Hap"></div>\
                                   <div class="grp-stickers noel" title="Noel"></div>\
                                   <div class="grp-stickers autres" title="Autres"></div>\
                                   <div class="grp-stickers brid" title="Bridgely"></div>\
                                   <div class="grp-stickers rex" title="Rex ryder"></div>\
                                   <div class="grp-stickers fluffy" title="Fluffy"></div>\
                                   <div class="grp-stickers grukk" title="Grukk"></div>\
                                   <div class="grp-stickers lamma" title="Lama"></div>\
                                   <div class="grp-stickers bud" title="Bud"></div>\
                                   <div class="grp-stickers euro" title="Euro"></div>\
                                   <div class="grp-stickers larspon" title="Larry & Sponsos"></div>\
                                   <div class="grp-stickers updown" title="Descendre-Monter Panneau"></div>');

        // AJOUT STICKERS
        for (let i= 0; i < _stickers_hap.length; i++) {
            $(".new-stickers#hap").append(`<img src="${stickersCacheStatic}${_stickers_hap[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_noel.length; i++) {
            $(".new-stickers#noel").append(`<img src="${stickersCacheStatic}${_stickers_noel[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_autres.length; i++) {
            $(".new-stickers#autres").append(`<img src="${stickersCacheStatic}${_stickers_autres[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_brid.length; i++) {
            $(".new-stickers#brid").append(`<img src="${stickersOrg}${_stickers_brid[i]}" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_rex.length; i++) {
            $(".new-stickers#rex").append(`<img src="${stickersCacheStatic}${_stickers_rex[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_fluffy.length; i++) {
            $(".new-stickers#fluffy").append(`<img src="${stickersOrg}${_stickers_fluffy[i]}" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_grukk.length; i++) {
            $(".new-stickers#grukk").append(`<img src="${stickersCacheStatic}${_stickers_grukk[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_lamma.length; i++) {
            $(".new-stickers#lamma").append(`<img src="${stickersCacheStatic}${_stickers_lamma[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_bud.length; i++) {
            $(".new-stickers#bud").append(`<img src="${stickersCacheStatic}${_stickers_bud[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_euro.length; i++) {
            $(".new-stickers#euro").append(`<img src="${stickersCacheStatic}${_stickers_euro[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }
        for (let i= 0; i < _stickers_larspon.length; i++) {
            $(".new-stickers#larspon").append(`<img src="${stickersCacheStatic}${_stickers_larspon[i]}" referrerpolicy="no-referrer" class="stickers-script">`);
        }

        // Bloque le menu clic droit
        $('.stickers-script').on('contextmenu', e => e.preventDefault());

        // LISTENERS
        function stickersEvent() {
            $(".stickers-script").click(function() {
                // Get sticker codeSticker
                var codeSticker = $(this).attr("src").split('/').pop()?.split('.')[0];
                var textarea = document.querySelector('#bloc-formulaire-forum #message_topic, #message');
                var caretPos = textarea.selectionStart;
                var textAreaTxt = textarea.value;

                var sticker = `[[sticker:p/${codeSticker}]]`;
                sticker = (caretPos > 0 && textAreaTxt[caretPos - 1] !== ' ' ? " " : "") + sticker + " ";
                //* !!!! FONCTION SIMULE REACT
                var finalText = textAreaTxt.substring(0, caretPos) + sticker + textAreaTxt.substring(caretPos);
                Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
                  .set.call(textarea, finalText);
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                textarea.focus();
                //*/
                //fonction JVC (elle marche mal en ce moment)
                /*
                const apiJvc = typeof jvc !== "undefined" ? jvc : unsafeWindow.jvc;
                apiJvc.getMessageEditor('#bloc-formulaire-forum #message_topic, #message').insertText(sticker);
                */
            });
        }
        stickersEvent();

        //Select_grp
        $(".grp-stickers").not('.updown').click(function() {
            var id = $(this)[0].classList[1]
            // Sauvegarde du choix dans le localStorage
            localStorage.setItem('stickersjvc-div', id);

            $(".new-stickers").each(function() {
                if ( $(this).attr("id") == id ) {
                    $(this).show();
                    if (currentDiv != id) {
                        $("#"+currentDiv).hide();
                        currentDiv = id;
                    }
                }
            });
        });

        // Change position haut bas
        $('.grp-stickers.updown').on('click', e => {
            e.preventDefault();
            const blocNewStickers = $('#intstickersbloc');
            const storageBottom = localStorage.getItem('stickersjvc-layout') === 'bottom';
            localStorage.setItem('stickersjvc-layout', storageBottom ? 'top' : 'bottom');
            if (storageBottom) {
                blocNewStickers.insertBefore('.messageEditor__edit').css('order', '')
                blocNewStickers.children('.new-stickers').removeClass('bottom');
            } else {
                blocNewStickers.insertAfter('.messageEditor__buttonEdit').css('order', 6)
                blocNewStickers.children('.new-stickers').addClass('bottom');
            }
        });

        // NICE SCROLL
        var lastScrollTop = 0;
        $(".new-stickers").scroll(function() {
            var st = $(this).scrollTop();
            // Masquer dès qu'on commence à descendre
            if (st > lastScrollTop) {
                $(".grp-stickers").hide();
            }
            // Afficher seulement si on est revenu tout en haut
            else if (st === 0) {
                $(".grp-stickers").show();
            }
            // Mise à jour du dernier scroll pour détecter la direction
            lastScrollTop = st;
        });

        // TOOLTIPS
        $(document).ready(function() {
            $(".grp-stickers").not('.updown').each(function() {
                $(this).tipso({
                    delay: 0,
                    speed: 120,
                    background: "rgba(0, 0, 0, 0.7)",
                    size: 'tiny',
                    content: '<b>'+$(this).attr("title")+'</b>',
                    width: null,
                    maxWidth: "150px"
                });
            });
        });
    }

    // CSS
    const css = [];
    // Styles spécifiques chromium (non Firefox)
    if (!navigator.userAgent.includes("Firefox")) {
        css.push(
            `.new-stickers::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.2); background-color: #f7f7f7; }`,
            `.new-stickers::-webkit-scrollbar { width: 9px; background-color: #F5F5F5; }`,
            `.new-stickers::-webkit-scrollbar-thumb { background-color: #ccc; }`
        );
    }

    css.push(
        `.stickers-script { height: 50px; width: 50px; cursor: pointer; padding: 2px; }`,

        `.grp-stickers:hover { border: none; }`,
        `.grp-stickers.hap { left: 5px; background-image: url('${stickersOrg}/1kki'); }`,
        `.grp-stickers.noel { left: 30px; background-image: url('${stickersOrg}/1kkr'); }`,
        `.grp-stickers.autres { left: 55px; background-image: url('${stickersOrg}/1mqv'); }`,
        `.grp-stickers.brid { left: 80px; background-image: url('${stickersOrg}/1jnh'); }`,
        `.grp-stickers.rex { left: 105px; background-image: url('${stickersOrg}/1lme'); }`,
        `.grp-stickers.fluffy { left: 130px; background-image: url('${stickersOrg}/st/1kl8'); }`,
        `.grp-stickers.grukk { left: 155px; background-image: url('${stickersOrg}/1lgg'); }`,
        `.grp-stickers.lamma { left: 180px; background-image: url('${stickersOrg}/1kgx'); }`,
        `.grp-stickers.bud { left: 205px; background-image: url('${stickersOrg}/1f8a'); }`,
        `.grp-stickers.euro { left: 230px; background-image: url('${stickersOrg}/1n1m'); }`,
        `.grp-stickers.larspon { left: 255px; background-image: url('${stickersOrg}/1lte'); }`,
        `.grp-stickers.updown { left: 280px; filter: saturate(0%) opacity(0.9); background-size: 120%; background-image: url(https://images.emojiterra.com/microsoft/fluent-emoji/15.1/128px/2195_color.png); }`,
        //`.grp-stickers.updown { left: 280px; filter: saturate(0%); background-image: url('https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/2195.png'); }`,

        `.script-title { font-family: 'robotoboldcondensed', Arial, Helvetica, sans-serif; text-transform: uppercase; font-size: 0.75rem; color: #656574; }`,

        //`.new-stickers { padding: 2px; height: 85px; transition: background-color 0.1s; overflow: auto; text-align: center; padding-top: 22px; scroll-behavior: smooth; }`,
        `.new-stickers { padding: 2px; height: 85px; transition: background-color 0.1s; overflow: auto; text-align: center; padding-top: 24px; scroll-behavior: smooth; }`,

        `.new-stickers:not(.bottom) { border-bottom: 1px solid var(--jv-border-color); }`,
        `.new-stickers.bottom { border-top: 1px solid var(--jv-border-color); }`,

        //`.grp-stickers { position: absolute; top: 4px; background-color: #E6E6E6; box-shadow: 0px 2px 2px #e0e0e0; border: 1px solid #ccc; border-radius: 50px; height: 18px; width: 18px; cursor: pointer; background-size: cover; background-repeat: no-repeat; background-position: center center; }`,
        `.grp-stickers { position: absolute; top: 3px; background-color: rgba(217, 217, 217, 0.55); box-shadow: 0px 2px 2px rgba(87, 87, 87, 0.4); border: 1px solid rgba(141, 141, 141, 0.45); border-radius: 50px; height: 18px; width: 18px; cursor: pointer; background-size: cover; background-repeat: no-repeat; background-position: center center; }`,

        `.stickers-script:hover { background-color: rgba(185, 185, 185, 0.5); border-radius: 3px; }`,

        `.grp-stickers:hover { box-shadow: 0px 2px 8px #b5b5b5; }`
    );

    // Insertion CSS
    const style = document.createElement('style');
    style.id = 'stickersOldCss';
    style.textContent = css.join('\n');
    document.head.appendChild(style);

    //Simuler animation previs COMME sur le forum
    //Tactile ou PC
    function enableStickerPreviewAnimation() {
        //Simuler animation previs sur le fofo
        document.querySelector('#bloc-formulaire-forum .messageEditor__containerPreview')?.addEventListener('mouseover', (e) => {
            if ( e.target.classList.contains('message__sticker') && e.target.src.includes('/p/st/')) {
                //Remplace le lien statique (st) en lien anime
                e.target.src = e.target.src.replace('/p/st/', '/p/');
            }
        });
    }
    enableStickerPreviewAnimation();
    //SWITCH_PREVIEW
    document.querySelector('.buttonsEditor__groupPreview > .buttonSwitch').addEventListener('click', () => {
        setTimeout(enableStickerPreviewAnimation, 500);
    });
}

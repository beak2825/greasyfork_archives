// ==UserScript==
// @name         Wypelniacz_wizyty
// @namespace    PrzystanMedyczna
// @version      1.5
// @description  Wypełnij podstawowe pola wizyty w serum
// @homepageURL  https://greasyfork.org/en/scripts/462569-wypelniacz-wizyty
// @author       Jedrzej Kubala
// @match        https://serum.com.pl/dpls/rm/ex.act
// @icon         https://serum.com.pl/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462569/Wypelniacz_wizyty.user.js
// @updateURL https://update.greasyfork.org/scripts/462569/Wypelniacz_wizyty.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const KOMORKA_ZLECAJACA_ID = 290562;
    const MIEJSCA_ZABIEGU = { gabinet: 'GZ', teren: 'DCH' };
    const COLOR_OVERRIDE = { green: 'cl-ovd-green', blue: 'cl-ovd-blue', navy: 'cl-ovd-navy', violet: 'cl-ovd-violet' }

    class Preset {
        constructor(data) {
            this.czynnosci = data.czynnosci;
            this.btn_name = data.btn_name;
            this.btn_id = data.btn_id;
            this.szablon_opisu = data.szablon_opisu;
            this.miejsce = data.miejsce;
            this.kolor = data.kolor
        }
        callback = async (e) => await wypelnij_pola(this);
    }

    const PRESETS = [
        new Preset({
            btn_id: 'nowy_btn',
            btn_name: 'Nowy pacjent opatr.',
            szablon_opisu: 'Wywiad: (pamiętaj aby najważniejsze informacje wpisać w zakładkę "Pacjent podsumowanie") \nLokalizacja i wielkość rany: \nOpis rany: \nZmiana względem ostatniej wizyty: \nPostępowanie: \nUwagi dla kolejnego dyżuru: \n',
            czynnosci: [
                { id: 14661, nazwa: 'zmiana opatrunku' },
            ],
            miejsce: MIEJSCA_ZABIEGU.gabinet
        }),
        new Preset({
            btn_id: 'opatrunek_btn',
            btn_name: 'Opatrunek',
            szablon_opisu: 'Lokalizacja i wielkość rany: \nOpis rany: \nZmiana względem ostatniej wizyty: \nPostępowanie: \nUwagi dla kolejnego dyżuru: \n',
            czynnosci: [
                { id: 14661, nazwa: 'zmiana opatrunku' },
            ],
            miejsce: MIEJSCA_ZABIEGU.gabinet,
            kolor: COLOR_OVERRIDE.violet,
        }),
        new Preset({
            btn_id: 'diagnostyka_btn',
            btn_name: 'Diagnostyka',
            szablon_opisu: 'CTK: / MmHG, HR: \nGlukoza: mg/dl\nSaturacja: SpO2\nTemperatura: °C\nEKG: ',
            czynnosci: [
                { id: 14703, nazwa: 'Pomiar ciśnienia' },
                { id: 14704, nazwa: 'Pomiar glikemii' },
                { id: 14702, nazwa: 'Saturacja' },
                { id: 14705, nazwa: 'Pomiar temperatury' },
                { id: 14662, nazwa: 'EKG' },
            ],
            miejsce: MIEJSCA_ZABIEGU.gabinet,
            kolor: COLOR_OVERRIDE.blue,
        }),
        new Preset({
            btn_id: 'wyjazdowy_btn',
            btn_name: 'Wyjazd terenowy',
            szablon_opisu: 'W badaniu: \nZgłasza następujące objawy: ',
            czynnosci: [
                { id: 23316, nazwa: 'Wyjazd terenowy' },
            ],
            miejsce: MIEJSCA_ZABIEGU.teren,
            kolor: COLOR_OVERRIDE.green,
        }),
    ]

    const BTN_STYLE = "<style>.bubbly-button,body{font-family:Helvetica,Arial,sans-serif;text-decoration:none!important}body{font-size:16px;text-align:center;background-color:#f8faff}.cl-ovd-violet{background-color: #c200ae!important;box-shadow: 0 2px 25px rgba(194,70,174,.5)!important;}.cl-ovd-navy{background-color:#174674!important;box-shadow:0 2px 25px rgba(23,70,116,.5)!important}.cl-ovd-green{background-color:#61ce70!important;box-shadow:0 2px 25px rgba(97,206,112,.5)!important}.cl-ovd-blue{background-color:#6ec1e4!important;box-shadow:0 2px 25px rgba(110,193,228,.5)!important}.bubbly-button{display:inline-block;font-size:1em;padding:1em 2em;margin-left:15px;-webkit-appearance:none;appearance:none;background-color:#ff0081;color:#fff;border-radius:4px;border:none;cursor:pointer;position:relative;transition:transform .1s ease-in,box-shadow .25s ease-in;box-shadow:0 2px 25px rgba(255,0,130,.5)}.bubbly-button:focus{outline:0}.bubbly-button:after,.bubbly-button:before{position:absolute;content:\"\";width:140%;height:100%;left:-20%;z-index:-1000;transition:.5s ease-in-out;background-repeat:no-repeat}.bubbly-button:before{display:none;top:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 20%,#ff0081 20%,transparent 30%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%}.bubbly-button:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%}.bubbly-button:active{transform:scale(.9);background-color:#e60074;box-shadow:0 2px 25px rgba(255,0,130,.2)}.bubbly-button.animate:before{display:block;animation:.75s ease-in-out forwards topBubbles}.bubbly-button.animate:after{display:block;animation:.75s ease-in-out forwards bottomBubbles}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%}50%{background-position:0 80%,0 20%,10% 40%,20% 0,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%}100%{background-position:0 70%,0 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0 0,0 0,0 0,0 0,0 0,0 0}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0}50%{background-position:0 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0}100%{background-position:0 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0 0,0 0,0 0,0 0,0 0,0 0}}</style>"

    var animateButton = function (e) {
        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');

        e.target.classList.add('animate');
        setTimeout(function () {
            e.target.classList.remove('animate');
        }, 700);
    };

    function waitForElm(selector) {
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

    async function wypelnij_typ_czynnosci(czynnosc) {
        f_dodaj_typ_czynnosci('');
        await waitForElm('#gabzab_typczynnosci2_t');
        $('gabzab_typczynnosci2_w').setAttribute('value', czynnosc.id);
        $('gabzab_typczynnosci2_t').setAttribute('value', czynnosc.nazwa);
        $('czynnosc_typ').innerHTML = czynnosc.nazwa;
        f_zbierz_info_czynnosc('', 'T');
    }

    function dodaj_szablon_opisu(config) {
        const textarea = $('gab_badanie_przedmiotowe_w');
        if (textarea.value !== '') textarea.value += '\n';
        textarea.value += config.szablon_opisu;
    }

    async function wypelnij_pola(config) {
        console.dir(config)
        for (let i = 0; i < config.czynnosci.length; i++) {
            await wypelnij_typ_czynnosci(config.czynnosci[i]);
        }
        $('sel_zab_miejsce').value = config.miejsce;
        $('gab_komorka2_w').value = KOMORKA_ZLECAJACA_ID;
        dodaj_szablon_opisu(config);
    }

    function addButton(config, container) {
        const color_override = config.kolor ? ' ' + config.kolor : '';
        const button = `<a class="bubbly-button${color_override}" id="${config.btn_id}" href="#">${config.btn_name}</a>`
        container.insertAdjacentHTML('beforeend', button);
        $(config.btn_id).addEventListener('click', config.callback, false);

    }

    function addAllButtons() {
        var container = document.getElementsByClassName('td_wiznow_gora')[0]
        container.innerHTML += BTN_STYLE
        PRESETS.forEach(element => {
            addButton(element, container)
        });
        var bubblyButtons = document.getElementsByClassName("bubbly-button");
        for (var i = 0; i < bubblyButtons.length; i++) {
            bubblyButtons[i].addEventListener('click', animateButton, false);
        }
    }

    const targetNode = document.getElementsByTagName('body')[0];
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList" && mutation.addedNodes.length && mutation.addedNodes[0].classList &&
                mutation.addedNodes[0].classList.length && mutation.addedNodes[0].classList.contains('pas_win')
            ) {
                addAllButtons();
            }
        }
    };
    const obs = new MutationObserver(callback);
    obs.observe(targetNode, config);

})();
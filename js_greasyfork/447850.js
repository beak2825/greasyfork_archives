// ==UserScript==
// @name         Qrwio
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hee-Hee
// @author       ja
// @match        https://amazon-play.learningcloud.me/student/*
// @match        https://cdnplay.learningcloud.me/storage/companies*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learningcloud.me
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/447850/Qrwio.user.js
// @updateURL https://update.greasyfork.org/scripts/447850/Qrwio.meta.js
// ==/UserScript==

GM_config.init(
    {
        'id': 'Qrwio mejker', 
        'title': 'co',
        'fields':
        {
            'czy_test':
            {
                'type': 'text',
                'label': '',
                'default': 'fals'
            },
            'czy_pre':
            {
                'type': 'text',
                'label': '',
                'default': 'fals'
            },
            'odpowiedzi_true_false':
            {
                'type': 'text',
                'label': '',
                'default': ''
            },
            'odpowiedzi_taptap':
            {
                'type': 'text',
                'label': '',
                'default': ''
            },
            'inne_odpowiedzi':
            {
                'type': 'text',
                'label': '',
                'default': ''
            },
            'akcja':
            {
                'type': 'text',
                'label': '',
                'default': ''
            },
            'czy_test_gotowy':
            {
                'type': 'text',
                'label': '',
                'default': ''
            }
        }
    });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var frame_pretest = false;
var frame_test = false;

(async function() {
    for (var i = 0;i<100000000000;i++)
    {
        await sleep(1000);
        if(window.location.href.indexOf("https://cdnplay.learningcloud.me/") > -1)
        {
            if(document.getElementsByClassName("ntx-quiz-header-title")[0] != undefined  && GM_config.get('czy_pre') != "tru" && (document.getElementsByClassName("ntx-quiz-header-title")[0].innerText == "Test wstępny" || document.getElementsByClassName("ntx-quiz-header-title")[0].innerText == "Test próbny"))
            {
                GM_config.set('czy_pre','tru');
                GM_config.save();
                frame_pretest = true;
                pretest();
            }

            if(document.getElementsByClassName("ntx-quiz-header-title")[0] != undefined  && GM_config.get('czy_test') != "tru" && document.getElementsByClassName("ntx-quiz-header-title")[0].innerText == "Test końcowy")
            {
                GM_config.set('czy_test','tru');
                GM_config.save();
                frame_test = true;
                await sleep(5000);
                test();
            }

        }

        if(window.location.href.indexOf("https://amazon-play.learningcloud.me/") > -1)
        {
            // if(document.getElementsByClassName("btn btn-40 ng-scope")[0] != undefined)
            // {
            //     document.getElementsByClassName("btn btn-40 ng-scope")[0].click();
            //     GM_config.set('czy_pre','fals');
            //     GM_config.set('czy_test','fals');
            //     GM_config.save();
            //     frame_pretest = false;
            // }
        }
    }
})();




var strona_moduł = false;

setInterval(async function() {
    var obecny_url = window.location.href;
    var expression = /https:\/\/amazon-play.learningcloud.me\/student\/trainings\/[a-zA-Z0-9]{24}\/sprints\//gm;
    var regex = new RegExp(expression);


    // if (obecny_url.match(regex) && window.name != "PRINT" && strona_moduł == false)
    // {
    //     if(document.getElementById("pre-test-button") != undefined)
    //     {
    //         strona_moduł = true;
    //         document.getElementById("pre-test-button").disabled = false;
    //         document.getElementById("tematy-button").disabled = false;
    //         document.getElementById("test-button").disabled = false;
    //         document.getElementById("wszystko-button").disabled = false;
    //     }
    // }
    // else if(!obecny_url.match(regex))
    // {
    //     if(document.getElementById("pre-test-button") != undefined)
    //     {
    //         strona_moduł = false;
    //         document.getElementById("pre-test-button").disabled = true;
    //         document.getElementById("tematy-button").disabled = true;
    //         document.getElementById("test-button").disabled = true;
    //         document.getElementById("wszystko-button").disabled = true;
    //     }
    // }

}, 1000);


// Po otwarciu pierwszej strony z tematami/testem
setTimeout(async function() {
    // Jeżeli to dodatkowe okienko - rozwiąż test byle jak
    if(window.name == "PRINT")
    {
//         // Otwórz TEST
//         var tematy2 = document.getElementsByClassName("activity-item-container");
//         document.getElementsByClassName("activity-item-container")[tematy2.length - 1].scrollIntoView();
//         await sleep(1000);
//         document.getElementsByClassName("activity-item-container")[tematy2.length - 1].children[0].click();
//         await sleep(5000);

//         // zmienne na iFrame testu
//         var iframe_id = document.getElementsByTagName("iframe")[0].id;
//         var iframe = document.getElementById(iframe_id);
//         var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
//         var iframe2 = innerDoc.getElementsByTagName("body")[0].children[0];
//         var innerDoc2 = iframe2.contentDocument || iframe2.contentWindow.document;

        // Pre-test ; start
        // innerDoc2.getElementsByClassName("ntx-quiz-introduction-btn-content")[0].click();
        await sleep(5000);


        //////////////////// PRE-TEST ///////////////////////////
        // Pre-test ; zaznacz co 3 radiobox
        var ile_radiobox = document.getElementsByClassName("ntx-circle-icon").length;
        for (i=0; i<=ile_radiobox;i++)
        {
            if( i % 2 == 0)
            {
                if(document.getElementsByClassName("ntx-circle-icon")[i] != undefined)
                {
                    document.getElementsByClassName("ntx-circle-icon")[i].click();
                }
            }
        }

        // Pre-test ; zaznacz wszystkie checkboxy
        var ile_checkbox = document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon").length;
        var i = 0;
        for (i = 0; i<=ile_checkbox;i++)
        {
            if(document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon")[i] != undefined)
            {
                document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon")[i].click();
            }
        }

        // Pre-test ; zaznacz co 2 true/false
        var ile_truefalse = document.getElementsByClassName("ntx-tf-option").length;
        for (i=0; i<=ile_truefalse;i++)
        {
            if( i % 2 == 0)
            {
                if(document.getElementsByClassName("ntx-tf-option")[i] != undefined)
                {
                    document.getElementsByClassName("ntx-tf-option")[i].click();
                }
            }
        }

        // Pre-Test ; taptap!
        var ile_taptap = document.getElementsByClassName("ntx-qTapTapOrigin ").length;
        for (i=0; i<=ile_taptap;i++)
        {
            if(document.getElementsByClassName("ntx-qTapTapOrigin")[i] != undefined)
            {
                document.getElementsByClassName("ntx-qTapTapOrigin")[i].click();
                document.getElementsByClassName("ntx-qTapTapTarget")[i].click();
            }
        }


        // Pre-test ; 1 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 2 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 3 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 4 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 5 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 6 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 7 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 8 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 9 odpowiedz - Dalej
        document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
        await sleep(1000);
        // Pre-test ; 10 odpowiedz - Dalej / wyślij?
        document.getElementsByClassName("ntx-quiz-btn-content-last ntx-activity-btn-enabled")[0].click()
        await sleep(5000);


        // zakończ test i sprawdź:
        document.getElementsByClassName("ntx-quiz-btn-end ntx-activity-btn-enabled")[0].click()
        await sleep(5000);


        // ZWERYFIKUJ
        document.getElementsByClassName("ntx-finishing-button")[0].children[0].click();
        await sleep(2000);
        document.getElementsByClassName("ntx-quiz-btn-review ntx-activity-btn-disabled")[0].click();
        await sleep(2000);


        // Jeżeli zdane (L.O.L)
        if(document.getElementsByClassName("ui-notification notification-pop-up grouped-popup-notification activity-notification scale popup-notification-points scaleStart")[0] != undefined)
        {
            GM_config.set('czy_test', 'zdane');
            GM_config.save();
            localStorage.setItem('czy_test', 'zdane');
            window.close();
        }


        var odpowiedzi = "";
        var inne_odpowiedzi = "";
        var true_false = "";
        var taptap_odpowiedzi = ""

        // zebrać odpowiedzi true_false
        for(i = 0;i<=document.getElementsByClassName("ntx-tf-option").length;i++) // szukamy true/false
        {
            if(document.getElementsByClassName("ntx-tf-option")[i] != undefined)
            {
                if(document.getElementsByClassName("ntx-tf-option")[i].className.includes("correct")) // wybieramy ten prawidłowy
                {
                    true_false += document.getElementsByClassName("ntx-tf-option")[0].attributes[1].value + ";";
                }
            }
        }

        // zebrać pozostałe
        for(i = 0;i<=document.getElementsByClassName("ntx-correct").length;i++)
        {
            if(document.getElementsByClassName("ntx-correct")[i] != undefined)
            {
                if(document.getElementsByClassName("ntx-correct")[i].children[3] != undefined)
                {
                    if(document.getElementsByClassName("ntx-correct")[i].attributes[2] != undefined && document.getElementsByClassName("ntx-correct")[i].attributes[2].value != "true" && document.getElementsByClassName("ntx-correct")[i].attributes[2].value != "false")
                    {
                        inne_odpowiedzi += document.getElementsByClassName("ntx-correct")[i].children[3].textContent + ";";
                    }
                }
                else
                {
                    if(document.getElementsByClassName("ntx-correct")[i].attributes[2] != undefined && document.getElementsByClassName("ntx-correct")[i].attributes[2].value != "true" && document.getElementsByClassName("ntx-correct")[i].attributes[2].value != "false")
                    {
                        if(document.getElementsByClassName("ntx-correct")[i].children[0].children[1] != undefined)
                        {
                            if(document.getElementsByClassName("ntx-correct")[i].children[0].children[1].children[0].children[0] != undefined)
                            {
                                inne_odpowiedzi += document.getElementsByClassName("ntx-correct")[i].children[0].children[1].children[0].children[0].textContent + ";";
                            }
                        }
                    }
                }
            }
        }


        // // Pytanie;odpowiedz;Pytanie;odpowiedz;
        // for(i = 0;i<=innerDoc2.getElementsByClassName("ntx-correct").length;i++)
        // {
        //     if(innerDoc2.getElementsByClassName("ntx-correct")[i] != undefined)
        //     {
        //         if(innerDoc2.getElementsByClassName("ntx-correct")[i].children[3] != undefined)
        //         {
        //             if(innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2] != undefined && innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2].value != "true" && innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2].value != "false")
        //             {
        //                 inne_odpowiedzi += innerDoc2.getElementsByClassName("ntx-correct")[i].children[3].textContent + ";";
        //             }
        //         }
        //         else
        //         {
        //             if(innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2] != undefined && innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2].value != "true" && innerDoc2.getElementsByClassName("ntx-correct")[i].attributes[2].value != "false")
        //             {
        //                 if(innerDoc2.getElementsByClassName("ntx-correct")[i].children[0].children[1] != undefined)
        //                 {
        //                     if(innerDoc2.getElementsByClassName("ntx-correct")[i].children[0].children[1].children[0].children[0] != undefined)
        //                     {
        //                         inne_odpowiedzi += innerDoc2.getElementsByClassName("ntx-correct")[i].children[0].children[1].children[0].children[0].textContent + ";";
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }


        // innerDoc2.getElementsByClassName("ntx-correct")[0].attributes[2].value
        await sleep(1000);

        console.log(inne_odpowiedzi);


        GM_config.set('inne_odpowiedzi', inne_odpowiedzi);
        GM_config.set('odpowiedzi_taptap', "");
        GM_config.set('odpowiedzi_true_false', true_false);
        GM_config.set('czy_test', 'tru');
        GM_config.save();


        localStorage.setItem('odpowiedzi_taptap', '');
        localStorage.setItem('inne_odpowiedzi', inne_odpowiedzi);
        localStorage.setItem('odpowiedzi_true_false', true_false);

        await sleep(6000);
        localStorage.setItem('czy_test', 'tru');
        await sleep(2000);
    }

    if(window.location.href.indexOf("https://amazon-play.learningcloud.me/student") > -1)
    {
        var infobox = document.createElement ('div');
        infobox.innerHTML = '<div id="qrwio_menu_divheader" style="cursor:move;"><center>menu</center></div><hr>' +
            '<div id="qrwio_menu_id" style="display:grid;">' +
            '<input type="button" id="pre-test-button" value="Zrób: PRE-TEST" style="margin-bottom:10px;"  />' +
            '<br>' +
            '<input type="button" id="tematy-button" value="Zrób: TEMATY" style="margin-bottom:10px;" />' +
            '<br>' +
            '<input type="button" id="test-button" value="Zrób: TEST" style="margin-bottom:10px;" />' +
            '<br><br>' +
            '<input type="button" id="wszystko-button" value="Zrób: WSZYSTKO" style="margin-bottom:10px;" />' +
            '<br><br>' +
            '<textarea id="qrwio_text" rows="10" placeholder="Tu pojawią się odpowiedzi w przypadku problemów z automatycznym wypełnieniem testu"></textarea>' +
            '<br>' +
            '<input type="button" id="reset" value="Reset" style="margin-bottom:10px;" />' +
            '</div>';
        infobox.setAttribute ('id', 'qrwio_menu_div');
        infobox.setAttribute ('style', 'position:fixed;width:400px;height:600px;background-color:silver;left:50px;top:50px;resize:both;overflow:auto;color:black;display:block;z-index:1010;padding:10px;');
        document.getElementsByTagName("body")[0].appendChild(infobox);

        dragElement(document.getElementById("qrwio_menu_div"));


        document.getElementById ("pre-test-button").addEventListener (
            "click", pretest, false
        );

        document.getElementById ("reset").addEventListener (
            "click", reset, false
        );

        document.getElementById ("tematy-button").addEventListener (
            "click", tematy, false
        );

        document.getElementById ("test-button").addEventListener (
            "click", test, false
        );

        document.getElementById ("wszystko-button").addEventListener (
            "click", wszystko, false
        );


    }



// ile_prawidlowych: innerDoc2.getElementsByClassName("ntx-correct").length
// innerDoc2.getElementsByClassName("ntx-correct")[i].innerText porównywać?



},10000);

var stop = false;

function reset(){
    GM_config.set('inne_odpowiedzi', '');
    GM_config.set('odpowiedzi_taptap', '');
    GM_config.set('odpowiedzi_true_false', '');
    GM_config.set('czy_pre','fals');
    GM_config.set('czy_test','');
    GM_config.save();

    localStorage.setItem('czy_test', '');
    localStorage.setItem('odpowiedzi_taptap', '');
    localStorage.setItem('inne_odpowiedzi', '');
    localStorage.setItem('odpowiedzi_true_false', '');

    pre_check = false;
    tematy_check = false;
    test_check = false;
    tematy_w_trakcie = false;
    test_w_trakcie = false;
    strona_moduł = false;

  //  document.getElementById("qrwio_text").value = "";
    if(stop == false) {
        stop = true; }
    else{
        stop = false;}
}


// NOWE OKIENKO
async function test_wykonaj() {

    // Otwórz TEST
    var tematy2 = document.getElementsByClassName("activity-item-container");
    document.getElementsByClassName("activity-item-container")[tematy2.length - 1].scrollIntoView();
    await sleep(1000);
    document.getElementsByClassName("activity-item-container")[tematy2.length - 1].children[0].click();
    await sleep(5000);


    // zmienne na iFrame testu
    var iframe_id = document.getElementsByTagName("iframe")[0].id;
    var iframe = document.getElementById(iframe_id);
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var iframe2 = innerDoc.getElementsByTagName("body")[0].children[0];
    var innerDoc2 = iframe2.contentDocument || iframe2.contentWindow.document;


    // Start TEST po czym otwieramy
    innerDoc2.getElementsByClassName("ntx-quiz-introduction-btn-content")[0].click();
    await sleep(5000);

    console.log("tutaj");
    var odpowiedzi = "";


    return;
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var pre_check = false;
var tematy_check = false;
var test_check = false;
var tematy_w_trakcie = false;
var test_w_trakcie = false;

async function wszystko() {

    console.log("wszystko: wykonuje pre-test");
    pretest();

    for(var j = 0;j<=100000;j++)
    {
        await sleep(500);
        console.log("wszystko: czekam");
        console.log("pre_check: " + pre_check);
        console.log("tematy_check: " + tematy_check);
        console.log("tematy_w_trakcie: " + tematy_w_trakcie);
        console.log("test_w_trakcie: " + test_w_trakcie);

        if(pre_check == true && tematy_check == false && tematy_w_trakcie == false)
        {
            console.log("wszystko: wykonuje tematy");
            tematy_w_trakcie = true;
            tematy();
        }
        await sleep(1000);

        if(pre_check == true && tematy_check == true && test_w_trakcie == false)
        {
            console.log("wszystko: wykonuje test");
            test_w_trakcie = true;
            test();
            break;
        }
        await sleep(1000);
    }
};



async function pretest() {

//     document.getElementsByClassName("scroll-to-activity layout-align-center-center layout-column")[0].children[1].click();
//     await sleep(3000);

//     // Pierwszy element, pre-test
//     document.getElementById("scrollFocus").click();
//     await sleep(10000);

//     // zmienne na iFrame testu
//     var iframe_id = document.getElementsByTagName("iframe")[0].id;
//     var iframe = document.getElementById(iframe_id);
//     var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
//     var iframe2 = innerDoc.getElementsByTagName("body")[0].children[0];
//     var innerDoc2 = iframe2.contentDocument || iframe2.contentWindow.document;


    // Jeżeli już zdany test (xD)
    if(document.getElementsByClassName("ntx-quiz-feedback-positive")[0] != undefined)
    {
        // Spróbuj ponownie
        await sleep(3000);
        document.getElementsByClassName("ntx-quiz-btn-ilimitados-restart ntx-activity-btn-enabled")[0].click();
        await sleep(2000);
    }
    else
    {
        // Pre-test ; start
        await sleep(3000);
        document.getElementsByClassName("ntx-quiz-introduction-btn-content")[0].click();
        await sleep(3000);
    }


    //////////////////// PRE-TEST ///////////////////////////
    // Pre-test ; zaznacz co 3 radiobox
    var ile_radiobox = document.getElementsByClassName("ntx-circle-icon").length;
    for (i=0; i<=ile_radiobox;i++)
    {
        if( i % 3 == 0)
        {
            if(document.getElementsByClassName("ntx-circle-icon")[i] != undefined)
            {
                document.getElementsByClassName("ntx-circle-icon")[i].click();
            }
        }
    }

    // Pre-test ; zaznacz wszystkie checkboxy
    var ile_checkbox = document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon").length;
    var i = 0;
    for (i = 0; i<=ile_checkbox;i++)
    {
        if(document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon")[i] != undefined)
        {
            document.getElementsByClassName("ntx-qMultipleChoiceOption-input-icon")[i].click();
        }
    }

    // Pre-test ; zaznacz co 2 true/false
    var ile_truefalse = document.getElementsByClassName("ntx-tf-option").length;
    for (i=0; i<=ile_truefalse;i++)
    {
        if( i % 2 == 0)
        {
            if(document.getElementsByClassName("ntx-tf-option")[i] != undefined)
            {
                document.getElementsByClassName("ntx-tf-option")[i].click();
            }
        }
    }

    // Pre-Test ; taptap!
    var ile_taptap = document.getElementsByClassName("ntx-qTapTapOrigin ").length;
    for (i=0; i<=ile_taptap;i++)
    {
        if(document.getElementsByClassName("ntx-qTapTapOrigin")[i] != undefined)
        {
            document.getElementsByClassName("ntx-qTapTapOrigin")[i].click();
            document.getElementsByClassName("ntx-qTapTapTarget")[i].click();
        }
    }


    // Pre-test ; 1 odpowiedz - Dalej
    document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
    await sleep(1000);
    // Pre-test ; 2 odpowiedz - Dalej
    document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
    await sleep(1000);
    // Pre-test ; 3 odpowiedz - Dalej
    document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
    await sleep(1000);
    // Pre-test ; 4 odpowiedz - Dalej
    document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
    await sleep(1000);
    // Pre-test ; 5 odpowiedz - Dalej
    document.getElementsByClassName("ntx-quiz-btn-content ntx-quiz-btn-next")[0].click()
    await sleep(10000);

    // Jezeli guzik "wyślij" aktywny, to naciśnij
    if(document.getElementsByClassName("ntx-quiz-btn-content-last ntx-activity-btn-enabled")[0] != undefined)
    {
        document.getElementsByClassName("ntx-quiz-btn-content-last ntx-activity-btn-enabled")[0].click();
        await sleep(10000);
    }


    // activity complete - click NEXT
    if(document.getElementsByClassName("btn btn-40 ng-scope")[0] != undefined)
    {
        await sleep(1000);
        document.getElementsByClassName("btn btn-40 ng-scope")[0].click();
        await sleep(1000);
    }

//     if(document.getElementsByClassName("btn btn-40 ng-scope")[0] != undefined)
//     {
//         document.getElementsByClassName("btn btn-40 ng-scope")[0].click();
//     }
//     await sleep(1000);
//     if(document.getElementsByClassName("btn btn-40 ng-scope")[0] != undefined)
//     {
//         document.getElementsByClassName("btn btn-40 ng-scope")[0].click();
//     }
//     await sleep(6000);

//     pre_check = true;
//     await sleep(1000);
};


async function tematy() {

    document.getElementsByClassName("activity-item-container")[1].scrollIntoView();
    await sleep(4000);

    var tematy = document.getElementsByClassName("activity-item-container");

    // Przeklikaj tematy (bez pre-test oraz test)
    for (var i = 1; i < tematy.length - 1; i++) {
        document.getElementsByClassName("activity-item-container")[i].scrollIntoView();
        await sleep(1000);
        document.getElementsByClassName("activity-item-container")[i].children[0].click();
        await sleep(4000);
        if(document.getElementsByClassName("icon icon-netex icon-cross icon-fullscreen-close")[0] != undefined)
        {
            document.getElementsByClassName("icon icon-netex icon-cross icon-fullscreen-close")[0].click();
        }
        await sleep(1000);
    }

    await sleep(5000);
    tematy_check = true;
    await sleep(1000);
   // window.reload();

};

async function test() {

//     // Otwórz TEST
//     var tematy = document.getElementsByClassName("activity-item-container");
//     document.getElementsByClassName("activity-item-container")[tematy.length - 1].scrollIntoView();
//     await sleep(1000);
//     document.getElementsByClassName("activity-item-container")[tematy.length - 1].children[0].click();
//     await sleep(10000);


//     // zmienne na iFrame testu
//     var iframe_id = document.getElementsByTagName("iframe")[0].id;
//     var iframe = document.getElementById(iframe_id);
//     var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
//     var iframe2 = innerDoc.getElementsByTagName("body")[0].children[0];
//     var innerDoc2 = iframe2.contentDocument || iframe2.contentWindow.document;

    // Jeżeli test wypełniony (i zdany)
    if(document.getElementsByClassName("ui-notification notification-pop-up grouped-popup-notification activity-notification scale popup-notification-points scaleStart")[0] != undefined)
    {
        await sleep(1000);
        document.getElementsByClassName("btn btn-40")[0].click();
        await sleep(3000);

        if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
        {
            document.getElementsByClassName("btn btn-40")[0].click();
        }
        else
        {
            document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
        }
        await sleep(3000);

        if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
        {
            document.getElementsByClassName("btn btn-40")[0].click();
        }
        else
        {
            document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
        }
        await sleep(3000);

        // if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined && document.getElementsByClassName("btn btn-40")[0] != undefined)
        // {
        //     document.getElementsByClassName("btn btn-40")[0].click();
        // }
        // else
        // {
        //     document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
        // }
        // await sleep(3000);
        // if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined && document.getElementsByClassName("btn btn-40")[0] != undefined)
        // {
        //     document.getElementsByClassName("btn btn-40")[0].click();
        // }
        // else
        // {
        //     document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
        // }

        return;
    }

    // Jeżeli test wypełniony (i nie zdany)
    if(document.getElementsByClassName("ntx-quiz-final-feedback-negative")[0] != undefined && document.getElementsByClassName("ntx-quiz-btn-review ntx-activity-btn-disabled")[0] != undefined && document.getElementsByClassName("ntx-quiz-introduction-btn-content")[0] == undefined)
    {
        // zamknij test w cholere
        if(document.getElementsByClassName("icon icon-netex icon-cross icon-fullscreen-close")[0] != undefined)
        {
            await sleep(1000);
            document.getElementsByClassName("icon icon-netex icon-cross icon-fullscreen-close")[0].click();
            await sleep(1000);
        }
        else
        {
            await sleep(1000);
            document.getElementsByClassName("btn btn-40")[0].click();
            await sleep(1000);
            document.getElementsByClassName("btn btn-40")[0].click();
            await sleep(1000);
            if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] != undefined)
            {
                document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
                await sleep(1000);
            }
            await sleep(1000);
        }
        // Zamknij moduł
        document.getElementById("lsExit").click();
        await sleep(1000);
        if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] != undefined)
        {
            document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
            await sleep(1000);
        }
        // zresetuj skrypt
        reset();
        // i wyłącz
        return;
    }


    var inne_odpowiedzi;
    var odpowiedzi_taptap;
    var odpowiedzi_true_false;
    var zapisane_odp;
    var tru_false_odp;

    var aTags;
    var temp_len;
    var end;
    var searchText;
    var found;

    // Start TEST 
    await sleep(5000);
    document.getElementsByClassName("ntx-quiz-introduction-btn-content")[0].click();

    // Test w okienko
    var mywindow = window.open(window.location.href, 'PRINT', 'height=400,width=600');

    var czy_zrobione = "fals";
    // Tutaj uzupełnij główny test odpowiedziami
    for(var j = 0;j<=100000;j++)
    {
        var czy_test = GM_config.get('czy_test');
        //console.log("czy test: " + czy_test);

        console.log("GM czy_test: " + czy_test);

        if(czy_test == "tru" && czy_zrobione == "fals")
        {
            console.log("wykonuje test");
            inne_odpowiedzi = GM_config.get('inne_odpowiedzi');
            console.log(inne_odpowiedzi);
            odpowiedzi_taptap = GM_config.get('odpowiedzi_taptap');
            odpowiedzi_true_false = GM_config.get('odpowiedzi_true_false');

            zapisane_odp = inne_odpowiedzi.split(";");
            tru_false_odp = odpowiedzi_true_false.split(";");

            // Odpowiedzi w <div>
            for(var i = 0;i<zapisane_odp.length;i++) // Ile mamy odpowiedzi - znajdź i zaznacz
            {
                aTags = document.getElementsByTagName("div");
                temp_len = zapisane_odp[i].length;
                end = temp_len - 1;
                searchText = zapisane_odp[i].substr(2,end);
            //    document.getElementById("qrwio_text").value += searchText + "\r\n";

                var temp_z = 0;
                for (var g = temp_z; g < aTags.length; g++)
                {
                    if (aTags[g].textContent == searchText)
                    {
                        found = aTags[g];
                        console.log(found);
                        found.click();
                        temp_z = g;
                        break;
                    }
                }
                await sleep(500);
            }


            // True/False
            //var ile_truefalse = innerDoc2.getElementsByClassName("ntx-tf-option").length;

            var k = 0;
            for(i = 0;i<document.getElementsByClassName("ntx-tf-option").length;i++)
            {
                if(document.getElementsByClassName("ntx-tf-option")[i] != undefined)
                {
                    if(document.getElementsByClassName("ntx-tf-option")[i].attributes[1].value == tru_false_odp[k])
                    {
                        document.getElementsByClassName("ntx-tf-option")[i].click();
                        k++;
                    }
                    else
                    {
                      //  innerDoc2.getElementsByClassName("ntx-tf-option")[i+1].click();
                    }
                    await sleep(500);
                }
            }

            // WYŚLIJ
            if( document.getElementsByClassName("ntx-quiz-btn-content-last ntx-activity-btn-enabled")[0] != undefined)
            {
                document.getElementsByClassName("ntx-quiz-btn-content-last ntx-activity-btn-enabled")[0].click();
            }

            await sleep(2000);
            czy_zrobione = "tru";
        }
        // Jeżeli dodatkowe okno zdało test, to przeklikaj główne okno
        else if(czy_test == "zdany")
        {
            await sleep(1000);
            document.getElementsByClassName("btn btn-40")[0].click();
            await sleep(3000);

            if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
            {
                document.getElementsByClassName("btn btn-40")[0].click();
            }
            else
            {
                document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
            }
            await sleep(3000);

            if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
            {
                document.getElementsByClassName("btn btn-40")[0].click();
            }
            else
            {
                document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
            }
            await sleep(3000);
            czy_zrobione = "tru";

            // if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
            // {
            //     document.getElementsByClassName("btn btn-40")[0].click();
            // }
            // else
            // {
            //     document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
            // }
            // await sleep(3000);
            // if(document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0] == undefined)
            // {
            //     document.getElementsByClassName("btn btn-40")[0].click();
            // }
            // else
            // {
            //     document.getElementsByClassName("btn  btn-default ripple  modal-btn")[0].click();
            // }
        }
        else
        {
            console.log("czekamy...");

            if(stop == true){
                break;}

            await sleep(10000);
        }
        await sleep(5000);
        if(czy_zrobione == "tru")
        {
            reset();
            break;
        }
    }

    await sleep(5000);
};

//////////////////////////////////////////////////////////

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
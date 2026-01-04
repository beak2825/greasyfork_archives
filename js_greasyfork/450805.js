// ==UserScript==
// @name         Aliexpress 0.01€
// @namespace    https://www.aliexpress.com/
// @version      1.160
// @description  Affiche uniquement les prix correspondants à 0.01€
// @author       Hollowbab
// @icon https://ae01.alicdn.com/images/eng/wholesale/icon/aliexpress.ico
// @include /https://(|.*\.)aliexpress.com/.*/
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM.xmlHttpRequest
// @grant GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450805/Aliexpress%20001%E2%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450805/Aliexpress%20001%E2%82%AC.meta.js
// ==/UserScript==

let $ = window.$;
let $head = $('head');

let nPosX=0;
let nPosY=0;



//$head.append($('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.2/css/fontawesome.min.css">'));
$head.append($('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">'));



$head.append($('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>'))
//$head.append($('<script defer src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc" crossorigin="anonymous"></script>'))
$head.append($('<script src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"></script>'))

//$("._11_8K > ._2LVIV:contains('99')")

function autoScroll() {
    let lastScrollHeight = 0;
    function autoScroll() {
        let sh = document.documentElement.scrollHeight;
        if (sh != lastScrollHeight) {
            lastScrollHeight = sh;
            document.documentElement.scrollTop = sh;
            console.log('interval');
        }
    }

    return window.setInterval(autoScroll, 1000);
}

function filter001ForNewUsers() {
    let spanArticle;
    let nCount = 0;
    $('#root span').each(function(){
        //Test permettant de savoir si le span contient un prix égal à 0.01€
        if($(this).html() != '€ 0,01'){
            //On récupère le span de l'article
            spanArticle = $(this).parent();
            //On masque l'article puisque son prix est différent de 0.01€
            spanArticle.hide();
        } else {
            nCount = nCount + 1;
        }
    });

    $('#btnFilter001NewUser').text("Filtrer les 0.01€ pour la page nouvel utilisateur (" + nCount + ")");
}

let globalAutoScroll = -1;
//Fonction appelée par l'event mouse wheel pour arreter l'autoscroll en cas d'utilisation de la roulette sur la page
function myWheelMouseEvent() {
    //Si l'autoscroll est en route
    if (globalAutoScroll != -1) {
        //On arrette le timer pour l'auto scroll
        clearInterval(globalAutoScroll);
        //on supprime le listener pour l'event pour le mouse wheel
        window.removeEventListener("mouseover", myWheelMouseEvent);
        //On change le label du bouton
        $('#btnAutoScroll').text("Start Autoscroll");
        globalAutoScroll = -1;

        $(window).scrollTop(0);
        window.scrollTo(0, 0);
    }
}

(function() {
    $(document).ready(function() {

        //--- Ajout des boutons en haut de la page ---//
        let btnSearch = document.createElement ('div');
        btnSearch.classList.add('d-flex', 'justify-content-center', 'm-2');
        btnSearch.innerHTML =
            '<button id="btnSearch001" type="button" class="me-2 btn btn-primary">Filtrer les 0.01€ pour les recherches</button>' +
            '<button id="btnFilter001NewUser" type="button" class="me-2 btn btn-info">Filtrer les 0.01€ pour la page nouvel utilisateur (0)</button>' +
            '<button id="btnAutoScroll" type="button" class="me-5 btn btn-info">Start Autoscroll</button>' +
            '<button id="btnCloseToolbar" type="button" class="btn btn-warning">Masquer</button>'
        //'<i class="fa-solid fa-user"></i>';
        btnSearch.setAttribute ('id', 'mySearchButton001');

        //document.body.insertBefore(btnSearch, document.body.firstChild);
        document.body.prepend(btnSearch);

        document.getElementById("mySearchButton001").style.position = "fixed";
        document.getElementById("mySearchButton001").style.left = 0;
        document.getElementById("mySearchButton001").style.top = "71px";
        document.getElementById("mySearchButton001").style.width = "100%";
        document.getElementById("mySearchButton001").style.zIndex = "2";
        document.getElementById("mySearchButton001").style.background = "white";
        document.getElementById("mySearchButton001").style.padding = "15px 0";

        //--- Fin de l'ajout des boutons en haut de la page ---//

        //--- Fonction appelée lors d'un click sur le bouton Filtrer les 0.01€ dans les recherches ---//
        $('#btnSearch001').on('click', function (e) {
            $('._3t7zg._2f4Ho').each(function(){
                let found = $(this).find('._2LVIV');

                if (found.length < 1) {
                    $(this).hide();
                } else {
                    //found = $(this).find('.i0heB > span');
                    console.log(found.html());
                    if (found.html() != '-99%') {
                        //if (found.html() != 'Offre de bienvenue') {
                        $(this).hide();
                    }
                }
            });
        })

        //--- Fonction appelée lors d'un clic sur le bouton Filtrer les 0.01€ sur la page des nouveaux utilisateurs ---//
        $('#btnFilter001NewUser').on('click', function (e) {
            filter001ForNewUsers();
        })

        //--- Fonction appelée lors d'un clic sur le bouton Filtrer les 0.01€ sur la page des nouveaux utilisateurs ---//
        $('#btnCloseToolbar').on('click', function (e) {
            $('#mySearchButton001').remove();

        })

        //--- Fonction appelée lors d'un click sur le bouton Start/Stop Autoscroll ---//
        $('#btnAutoScroll').on('click', function (e) {
            //Test pour savoir si l'autoscroll est déjà en cours
            if (globalAutoScroll == -1) {
                //Lancement de l'autoscroll
                globalAutoScroll = autoScroll();
                //Ajout du listener pour le wheel sur la page
                addEventListener("wheel", myWheelMouseEvent);
                //Mise à jour du label du bouton
                $('#btnAutoScroll').text("Stop Autoscroll");
            } else {
                //Arret de l'autoscroll
                clearInterval(globalAutoScroll);
                //Suppression du listener pour le wheel sur la page
                window.removeEventListener("mouseover", myWheelMouseEvent);
                //Mise à jour du label du bouton
                $('#btnAutoScroll').text("Start Autoscroll");
                globalAutoScroll = -1;
            }
        })

    })
})();
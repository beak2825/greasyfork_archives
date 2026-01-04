// ==UserScript==
// @name     UniPegaso Sedi Esami Filter
// @match    https://lms-courses.pegaso.multiversity.click/main/reservation/student/my_exam_journal.php
// @grant    none
// @author   MarcoInc
// @description Filtraggio per luogo, anno accademico,tipologia di esame, sessione d'esame e mese
// @version 1.3.1
// @run-at   document-end
// @license MIT
// @namespace https://greasyfork.org/users/564300
// @downloadURL https://update.greasyfork.org/scripts/477415/UniPegaso%20Sedi%20Esami%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/477415/UniPegaso%20Sedi%20Esami%20Filter.meta.js
// ==/UserScript==

// Seleziona il pulsante Seleziona tutti
var buttonAll = document.querySelector('#select_all_code');
// Aggiungi un event listener al pulsante
buttonAll.addEventListener('click', function() {
    filtro();
});

// Seleziona tutti i pulsanti con la classe "button_course"
var buttonMateria = document.querySelectorAll('.button_course');
// Aggiungi un event listener a ciascun pulsante
buttonMateria.forEach(function(button) {
    button.addEventListener('click', function() {
        filtro();
    });
});

function filtro(){
    setTimeout(()=>{
    // Ottieni tutte le righe della tabella
        var righe = document.querySelectorAll('.container_exam tbody tr');
        // Crea il modulo
        var form = document.createElement('form');
        //Contenitore tasto Reset
        var reset = document.createElement('form');
        //Contenitore elementi trovati
        var trovati = document.createElement('p');

        //Evita duplicati
        if (!document.querySelector('.formFilter')) {

            form.classList.add("formFilter");
            form.innerHTML = `
                                <label for="tipoProva">Tipo di prova:</label><br>
                                <select name="tipoProva" id="tipoProva">
                                    <option selected value="">TUTTI</option>
                                    <option value="SCRITTO ONLINE">SCRITTO ONLINE</option>
                                    <option value="SCRITTO IN PRESENZA">SCRITTO IN PRESENZA</option>
                                    <option value="SCRITTO">SCRITTO</option>
                                    <option value="ORALE ONLINE">ORALE ONLINE</option>
                                    <option value="ORALE IN PRESENZA">ORALE IN PRESENZA</option>
                                    <option value="ORALE">ORALE</option>
                                </select></br>

                                <label for="sessione">Sessione</label><br>
                                <select name="sessione" id="sessione">
                                    <option selected value="">TUTTE</option>
                                    <option value="sessione1">1° Sessione - Novembre/Dicembre</option>
                                    <option value="sessione2">2° Sessione - Febbraio/Marzo</option>
                                    <option value="sessione3">3° Sessione - Giugno/Luglio</option>
                                    <option value="sessione4">4° Sessione - Settembre/Ottobre</option>
                                    <option value="sessione5">Fuori sessione - Gennaio/Aprile/Maggio</option>

                                </select></br>

                                <label for="anno">Anno:</label><br>
                                <input type="text" id="anno" name="anno" placeholder="20XX/20XX"><br>

                                <label for="mese">Mese</label><br>
                                <select name="mese" id="mese">
                                    <option selected value="">TUTTI</option>
                                    <option value="Novembre">Novembre</option>
                                    <option value="Dicembre">Dicembre</option>
                                    <option value="Febbraio">Febbraio</option>
                                    <option value="Marzo">Marzo</option>
                                    <option value="Giugno">Giugno</option>
                                    <option value="Luglio">Luglio</option>
                                    <option value="Settembre">Settembre</option>
                                    <option value="Ottobre">Ottobre</option>
                                </select></br>

                                <label for="luogo">Luogo:</label><br>
                                <input type="text" id="luogo" name="luogo"><br>
                                <input type="submit" value="Filtra">
                            `;
            //Appendo il contatore degli elementi trovati al form
            trovati.innerHTML=`Elementi trovati : ${(contaElementi())}`;
            form.appendChild(trovati);

            //Appendo il tasto reset al form
            reset.innerHTML='<br><input type="submit" value="Resetta campi">'
            form.appendChild(reset);

            // Seleziona l'elemento prima del quale inserire il modulo
            var header = document.querySelector('.contenitore-sezione');

            // Inserisci il modulo prima dell'elemento selezionato
            header.parentNode.insertBefore(form, header);

        }

        //PULSANTE RESET
            reset.addEventListener('submit', function(event) {
                event.preventDefault();
                var righe = document.querySelectorAll('.container_exam tbody tr');
                document.getElementById('tipoProva').value="";
                document.getElementById('mese').value="";
                document.getElementById('sessione').value="";
                document.getElementById('anno').value="";
                document.getElementById('luogo').value="";
                righe.forEach(function(riga) {
                    riga.style.display = '';
             });
             trovati.innerHTML=`Elementi trovati : ${(contaElementi())}`;
         });

        // Aggiungi un event listener al modulo quando clicco su Filtra
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Prende i dati input dal form
            var tipoProva = document.getElementById('tipoProva').value;
            var anno = document.getElementById('anno').value.toUpperCase();
            if (anno) {
                anno = anno.replace("ANNO ACCADEMICO: ", "").trim();
            }
            var luogo = document.getElementById('luogo').value.toUpperCase();
            var mese = document.getElementById('mese').value;
            var sessione = document.getElementById('sessione').value;

            // Scorre riga per riga
            righe.forEach(function(riga) {
                var colonne = riga.querySelectorAll('td');

                //FILTRO TIPOLOGIA ESAME
                // Verifica se la riga corrisponde ai criteri di ricerca
                var corrispondeTipoProva = tipoProva ? colonne[4].textContent.trim().toUpperCase().includes(tipoProva) : true;


                //ESTRAE LA DATA
                var dataEsame = colonne[1].textContent.match(/Data Esame: (\d{2}\/\d{2}\/\d{4})/)[1];

                //FILTRO ANNO
                var corrispondeAnno = anno ? colonne[1].textContent.trim().toUpperCase().includes(anno) : true;

                //Mesi da 0 a 11
                var meseEsame = new Date(dataEsame.split("/").reverse().join("-")).getMonth();

                //FILTRO SESSIONE
                var corrispondeSessione=true;
                if (sessione === "sessione1") {
                    var mesiSessione1 = [10, 11]; //Novembre/Dicembre
                    corrispondeSessione = mesiSessione1.includes(meseEsame);
                }
                else if (sessione === "sessione2") {
                    var mesiSessione2 = [1, 2]; // Febbraio/Marzo
                    corrispondeSessione = mesiSessione2.includes(meseEsame);
                }
                else if (sessione === "sessione3") {
                    var mesiSessione3 = [5, 6]; //Giugno/Luglio
                    corrispondeSessione = mesiSessione3.includes(meseEsame);
                }
                else if (sessione === "sessione4") {
                    var mesiSessione4 = [8, 9]; //Settembre/Ottobre
                    corrispondeSessione = mesiSessione4.includes(meseEsame);
                }
                else if (sessione === "sessione5") {
                    var mesiSessione5 = [0, 3, 4]; //Gennaio/Aprile/Maggio
                    corrispondeSessione = mesiSessione5.includes(meseEsame);
                }

                //FILTRO MESE
                var corrispondeMese=true;
                if (mese === "Novembre") {
                    corrispondeMese = (meseEsame === 10);
                } else if (mese === "Dicembre") {
                    corrispondeMese = (meseEsame === 11);
                } else if (mese === "Gennaio") {
                    corrispondeMese = (meseEsame === 0);
                } else if (mese === "Febbraio") {
                    corrispondeMese = (meseEsame === 1);
                } else if (mese === "Marzo") {
                    corrispondeMese = (meseEsame === 2);
                } else if (mese === "Aprile") {
                    corrispondeMese = (meseEsame === 3);
                } else if (mese === "Maggio") {
                    corrispondeMese = (meseEsame === 4);
                } else if (mese === "Giugno") {
                    corrispondeMese = (meseEsame === 5);
                } else if (mese === "Luglio") {
                    corrispondeMese = (meseEsame === 6);
                } else if (mese === "Agosto") {
                    corrispondeMese = (meseEsame === 7);
                } else if (mese === "Settembre") {
                    corrispondeMese = (meseEsame === 8);
                } else if (mese === "Ottobre") {
                    corrispondeMese = (meseEsame === 9);
                }

                //FILTRO LUOGO
                var corrispondeLuogo = luogo ? colonne[3].textContent.trim().toUpperCase().includes(luogo) : true;

                // Mostra o nasconde la riga in base alla corrispondenza con i criteri di ricerca
                riga.style.display = (corrispondeTipoProva && corrispondeAnno && corrispondeLuogo && corrispondeSessione && corrispondeMese) ? '' : 'none';
            });
            trovati.innerHTML=`Elementi trovati : ${(contaElementi())}`;
        });
    },500);
}


var buttonDeselezionaAll = document.querySelector('#deselect_all_code');
// Aggiungi un event listener al pulsante
buttonDeselezionaAll.addEventListener('click', function() {
    location.reload() //resetta la pagina
});

//Ritorna il numero degli gli elementi visibili
function contaElementi(){
    var contatore=0;
    var righe = document.querySelectorAll('.container_exam tbody tr');
    for (let i = 0; i < righe.length; i++) {
        if (righe[i].style.display === "") {
            contatore++;
        }
    }
    return contatore;
}
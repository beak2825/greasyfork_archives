// ==UserScript==
// @name        ICV Highlighter
// @description highlights new posts of the day in www.icv-crew.com pages
// @author      SH3LL
// @version     1.8.1
// @match       https://www.icv-crew.com/forum/index.php?*
// @grant       none
// @copyright	GPL3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/425300/ICV%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/425300/ICV%20Highlighter.meta.js
// ==/UserScript==

let months = {
     '01':'Gennaio', '02':'Febbraio', '03':'Marzo', '04':'Aprile', '05':'Maggio', '06':'Giugno', '07':'Luglio', '08':'Agosto', '09':'Settembre', '10':'Ottobre', '11':'Novembre', '12':'Dicembre'
};

function get_thread_page(post_link){
   return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', post_link , false);
        req.send(null);
        if(req.status == 200)  {
          resolve(req.responseText);
        }else{
          resolve("err");
        }
   });
}

function get_data_oggi(){
   return new Promise(function (resolve, reject) {
            let ieri = new Date();
            ieri.setDate(ieri.getDate());
            let mese= months[String(ieri.getMonth() + 1).padStart(2, '0')];
            let dd = String(ieri.getDate()).padStart(2, '0');
            let yyyy = ieri.getFullYear();
            ieri = dd + ' ' + mese + ' ' + yyyy;
            resolve(ieri);
        });
}
function get_data_ieri(){
   return new Promise(function (resolve, reject) {
            let ieri = new Date();
            ieri.setDate(ieri.getDate() - 1);
            let mese= months[String(ieri.getMonth() + 1).padStart(2, '0')];
            let dd = String(ieri.getDate()).padStart(2, '0');
            let yyyy = ieri.getFullYear();
            ieri = dd + ' ' + mese + ' ' + yyyy;
            resolve(ieri);
        });
}

async function main(){
    //setto la data di ieri
    let ieri = await get_data_ieri();
    let oggi = await get_data_oggi();
    console.log(ieri)

    //--------------rendo grigi tutti i post PINNATI tolgo le etichette "nuovo--------------
    let pinnati = document.getElementsByClassName("windowbg sticky locked");
    for (pinnato of pinnati){
      if (pinnato.children[1].children[0].children[1].children[0].innerText.includes("Nuovo")){
        pinnato.children[1].children[0].children[1].children[1].children[0].children[0].style.color = 'grey';
        pinnato.children[1].children[0].children[1].children[0].remove();
      }else{
        pinnato.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'grey';
      }
    }
    //--------------rimuovo le linee di separazione tra thread e descrizione----------------
    /*
    let hrElements = document.querySelectorAll('hr.topicdesc');
    hrElements.forEach((hrElement) => {
      hrElement.remove();
    });
    */
    //--------------rimuovi tags----------------
    var tags = document.querySelectorAll('ul.tags');
    tags.forEach(function(ulElemento) {
        ulElemento.remove();
    });

    //--------------coloro di grigio tutti i post RELEASES--------------
    let releases = document.querySelectorAll('.windowbg:not(.sticky)');
    for (release of releases){

      if(release.children[1].children[0].children[1].children[0].innerText.includes("Nuovo")){
        if(release.children[1].children[0].children[1].children[1].innerText.includes("SPOSTATO")){release.children[1].children[0].children[1].children[1].style.textDecoration = "line-through";}
        release.children[1].children[0].children[1].children[1].children[0].children[0].style.color = 'grey';
        release.children[1].children[0].children[1].children[0].remove();

      }else{
        if(release.children[1].children[0].children[1].children[0].innerText.includes("SPOSTATO")){release.children[1].children[0].children[1].children[0].style.textDecoration = "line-through";}
        release.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'grey';
      }
    }

    //-------------- coloro i post --------------
    for (el of releases){
      let original_text=el.children[1].children[0].children[1].children[0].children[0].children[0].innerText;
      let post_link= el.children[1].children[0].children[1].children[0].children[0].children[0].href;
      let codec_icon=el.children[0];

      //--------------APPENDO LABEL "PARSING"--------------
      let parsing_label=document.createElement("small");
      parsing_label.style.color="orange";
      parsing_label.innerText=" <-- Parsing"
      el.children[1].children[0].children[1].children[0].children[0].append(parsing_label);

      //--------------CONTROLLI SU OGNI POST PER VEDERE SE E' NECESSARIO SCARICARE LA PAGINA--------------
      let data_e_releaser_name=el.querySelectorAll('.lastpost')[0].children[0].children[0].innerText;
      let n_risposte_e_n_visite=el.querySelectorAll('.board_stats.centertext')[0].innerText;

      if(data_e_releaser_name.includes("Oggi") && n_risposte_e_n_visite.includes("Risposte: 0")){ // >>>>>> se c'è scritto OGGI e ha 0 RISPOSTE: coloro subito di arancione
        el.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'orange';
        el.children[1].children[0].children[1].children[0].children[0].lastElementChild.remove();
        continue;

      }else if(data_e_releaser_name.includes(ieri) && n_risposte_e_n_visite.includes("Risposte: 0")){ // >>>>>> se c'è scritto IERI e ha 0 RISPOSTE: coloro subito di marrone
        el.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'saddlebrown';
        el.children[1].children[0].children[1].children[0].children[0].lastElementChild.remove();
        continue;

      }else if(!data_e_releaser_name.includes("Oggi") && !data_e_releaser_name.includes(ieri)){ // >>>>>> se non c'è scritto OGGI/IERI, a prescindere dal numero di risposte, è vecchio, quindi lo salto direttamente
        el.children[1].children[0].children[1].children[0].children[0].lastElementChild.remove();
        continue;

      }else{ // >>>>>> post incerto da verificare all'interno
        //ricevo pagina html del thread
        let html_page = await get_thread_page(post_link);

        //converto pagina html in DOM
        let dom_page = document.createElement('html');
        dom_page.innerHTML = html_page;

        let postinfo = dom_page.querySelectorAll('.postinfo')[0];

        if(postinfo.children[1].innerText.includes(oggi)) {
          el.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'orange';
        }
        if(postinfo.children[1].innerText.includes(ieri) ) {
          el.children[1].children[0].children[1].children[0].children[0].children[0].style.color = 'saddlebrown';
        }

        el.children[1].children[0].children[1].children[0].children[0].lastElementChild.remove();
      }
    }

}

main();
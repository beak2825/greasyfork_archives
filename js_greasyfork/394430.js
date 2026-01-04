// ==UserScript==
// @name         Cambia impostazioni VICIBOX
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Utility per Vicidial
// @author       maxeo
// @match        http*://icall-vicibox01.sede.gfi.it/vicidial/admin_listloader_fourth_gen.php
// @match        http*://icall-vicibox02.sede.gfi.it/vicidial/admin_listloader_fourth_gen.php
// @match        http://192.168.13.242/vicidial/admin_listloader_fourth_gen.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394430/Cambia%20impostazioni%20VICIBOX.user.js
// @updateURL https://update.greasyfork.org/scripts/394430/Cambia%20impostazioni%20VICIBOX.meta.js
// ==/UserScript==

var QS = function (selector) {
  let mySel = document.querySelector(selector);
  return mySel;
}
var getParents = function (e) {
  var result = [];
  for (var p = e && e.parentElement; p; p = p.parentElement) {
    result.push(p);
  }
  return result;
}
var hasClass = function (e, classname) {
  if (Array.isArray(e)) {
    for (let index in e) {
      if (hasClass(e[index], classname)) {
        return true;
      }
    }
    return false;
  } else {
    return e.classList.contains(classname)
  }

}

if (document.querySelector('table [name="leadfile"][type="file"]') != null) {
  /***   SELETTORE INIZIALE   ***/

  //Selettore automatico per evento doppio click
  QS('table[bgcolor="#D9E6FE"],table[bgcolor="#E0E7C2"]').addEventListener('dblclick', function () {
    QS('[name="master_list_override"]').checked = true
    QS('[name="phone_code_override"]').value = "\\'39\\'"
    QS('[name="file_layout"][value="template"]').checked = true
    QS('[name="dupcheck"]').value = "DUPCAMP"
    QS('[name="template_id"]').value = "VF_SPE_UNLIM"
  })

  //Mostra elemento fisso con id lista
  var mydata = null;
  mydata = document.createElement("div")
  mydata.id = "mycustomdata"
  mydata.style = "position:fixed;top:0;right:0;padding:15px";
  document.body.append(mydata)
  if (localStorage.lastdata != undefined) {
    mydata.innerHTML = "<h1>" + localStorage.lastdata + "</h1>";
    //imposto il valore nella selezione
    QS('select[name="list_id_override"]').value = localStorage.lastdata
  }
  //Al cambiamento di elemento memorizza il valore di lastdata sulla sessione js
  QS('select[name="list_id_override"]').addEventListener('change', function () {
    var newval = QS('select[name="list_id_override"]').value;
    localStorage.lastdata = newval;
    mydata.innerHTML = "<h1>" + newval + "</h1>"
  })
} else {
  if (QS('table [name="leadfile_name"][type="hidden"]') != null && QS('select[name="phone_number_field"]') != null && QS('table [name="leadfile_name"][type="hidden"]').value.length) {
    /***   INSERIMENTO DATI CUSTOM   ***/

    //Pulsanti per il salvataggio delle chiavi
    let eventImportKeys = function () {
      if (QS('#import-keys') != null) {
        QS('#import-keys').addEventListener('click', function () {
          let myFormData = JSON.parse(localStorage.saved_keys);
          for (var index in myFormData) {
            let myQS = QS('select[name="' + index + '"]');
            if (myQS != null) {
              myQS.value = myFormData[index]
            }
          }
        })
      }
    }
    let cont = document.createElement("div");
    cont.id = "mycustomdata"
    cont.style = "position:fixed;top:0;right:0;padding:15px";
    cont.innerHTML = '<button id="save-keys">Salva chiavi</button>';
    if (localStorage.saved_keys != undefined) {
      cont.innerHTML += '<button id="import-keys">Importa chiavi salvate</button>'
    }
    document.body.append(cont)
    eventImportKeys();

    QS('#save-keys').addEventListener('click', function () {
      let myFormData = {};
      let myForm = document.querySelectorAll('select')
      for (var index in myForm) {
        myFormData[myForm[index].name] = myForm[index].value
      }

      if (localStorage.saved_keys == undefined) {
        cont.innerHTML += '<button id="import-keys">Importa chiavi salvate</button>'
        eventImportKeys();
      }
      localStorage.saved_keys = JSON.stringify(myFormData)
    })

    //RICERCA INLINE

    //Abilito stile per la ricerca
    let mystyle = document.createElement("style");
    mystyle.innerHTML = ".lsel-src{position:absolute;background:#FFF;width:400px;border:1px solid #000}.lsel-src ul{list-style:none;margin:0;padding:0}.lsel-src ul li:first-child{border-top:none}.lsel-src ul li{border-top:1px solid #000;cursor:pointer}.lsel-src ul li:hover{background-color:#015b91;color:#FFF}.d-none{display:none!important}";
    let createBox = function (thisEl) {
      if (thisEl != null && thisEl.parentElement != null && thisEl.parentElement.querySelector('.lsel-src') == null) {
        let listSel = thisEl.parentElement.parentElement.querySelector('select')
        let cont = document.createElement("div");
        cont.classList.add("lsel-src");
        let strList = "";
        for (let index in listSel.options) {
          let option = listSel.options[index]
          if (index >= 0) {
            strList += "<li>" + option.value + ' | ' + option.innerHTML + "</li>"
          }
        }
        cont.innerHTML = "<ul>" + strList + "</ul>";
        thisEl.parentElement.append(cont)
        thisEl.addEventListener('blur', function (e) {
          let thisTarget = e.explicitOriginalTarget;
          let lParents = getParents(thisTarget);
          if (hasClass(lParents, 'lsel-src')) {
            if (thisTarget.tagName == undefined) {
              thisTarget = thisTarget.parentElement
            }
            if (thisTarget.tagName.toUpperCase() == 'LI') {
              let newVal = thisTarget.innerHTML.split(' |')[0];
              thisEl.parentElement.parentElement.querySelector('select').value = newVal;
              thisEl.parentElement.parentElement.querySelector('input').value = "";
            }
          }
          thisEl.parentElement.querySelector('.lsel-src').remove();
        })
      }
    }
    let executeSearch = function (thisEl) {
      let listsrc = thisEl.parentElement.querySelectorAll('.lsel-src li');
      for (let index in listsrc) {
        if (index >= 0) {
          let el = listsrc[index];
          if (el.innerHTML.toUpperCase().indexOf(thisEl.value.toUpperCase()) > -1) {
            el.classList.remove('d-none')
          } else {
            el.classList.add('d-none')
          }
        }
      }
    }
    document.body.append(mystyle);
    let mySelectors = document.querySelectorAll('select')
    for (let index in mySelectors) {
      if (mySelectors[index].parentElement != undefined) {
        mySelectors[index].style = "float: left;";
        let srcInput = document.createElement("div")
        srcInput.classList.add("srcbox");
        srcInput.style = "float: right;";
        srcInput.innerHTML = '<input type="text">'
        mySelectors[index].parentElement.append(srcInput)
        mySelectors[index].parentElement.querySelector('input').addEventListener('focus', function () {
          createBox(this);
          executeSearch(this);
        })
        mySelectors[index].parentElement.querySelector('input').addEventListener('keyup', function () {
          executeSearch(this);
        })
      }
    }


  }
}
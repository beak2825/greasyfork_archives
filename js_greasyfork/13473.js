// ==UserScript==
// @name         Bank Tycoon Helper
// @version      1.01
// @description  permet simplement d'ajouter des informations sur des pages du site BankTycoon (Statistiques et aide à la prise de décisions)
// @author       Nashway
// @match        http://banktycoon.com/s3/regions/pays-*
// @match        http://banktycoon.com/s3/employes/recruter
// @grant        none
// @namespace https://greasyfork.org/users/19212
// @downloadURL https://update.greasyfork.org/scripts/13473/Bank%20Tycoon%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/13473/Bank%20Tycoon%20Helper.meta.js
// ==/UserScript==



(function () {
    
    if(window.location.href === 'http://banktycoon.com/s3/employes/recruter'){
       
        var tab_sal = document.getElementsByClassName('tab-content');
        tab_sal = tab_sal[0];
        var salaires = '';
        
        for(var i = 0; i< tab_sal.childNodes.length ; i++){
            
            if(tab_sal.childNodes[i].className==='row'){
                
                var row = tab_sal.childNodes[i];
                row = row.firstElementChild;
                
                while(row){
                    
                      var soustab = row;
                      var box = soustab.firstElementChild; box = box.firstElementChild;
                      var child = box.firstElementChild;

                      while(child){

                          if(child.tagName === 'UL'){

                              var ul = child;                      
                              var li = ul.firstElementChild;

                              for(var o = 0; o < li.childNodes.length; o++){

                                  if(li.childNodes[o].nodeType === 1 && li.childNodes[o].tagName === "A"){
                                      
                                      salaires += parseInt(li.childNodes[o].innerHTML,10);
                                      if(o<li.childNodes.length-1){
                                          salaires += ',';
                                      }
                                  }
                              }

                          }
                          
                          child = child.nextElementSibling;
                      }
                    
                    row = row.nextElementSibling;
                    
                    }
                }
            }
        
        localStorage.setItem("salaires", salaires);

    } else {
    
    
        var donnees = new Array();
        var onglets = document.getElementById('myTabs');
        var tab_employe = document.getElementById('employes');

        // On vérfie que l'on possède les données.
        var donnees_salaires = localStorage.getItem("salaires");
        donnees_salaires = donnees_salaires.split(/,/);

        if(donnees_salaires === null){

            var div = document.createElement('div');
            div.innerHTML = '== Script BankTycoon Info ==<br><strong> Veuillez visiter la page des salaires dans un premier temps pour que nous puissions récupérer les valeurs de ces derniers.<br>'
            +               'Lien : <a href = "http://banktycoon.com/s3/employes/recruter">http://banktycoon.com/s3/employes/recruter</a><br></strong>'
            +               'Puis revenez sur cette page pour accéder à vos statistiques :)';
            onglets.insertBefore(div, onglets.firstChild);

        } else {



            // Pour chaque changement d'onglet, on vérifie lequel est affecté.
            onglets.addEventListener('click', function(e) {

                // Si on clique sur employé.
                if(e.target.href === 'http://banktycoon.com/s3/regions/pays-US#employes'){

                    setTimeout(function(){

                        // Navigation manuelle jusqu'aux données.
                        for(i = 0; i < tab_employe.childNodes.length; i++){

                            if(tab_employe.childNodes[i].className=='box box-solid'){
                                tab_employe = tab_employe.childNodes[i];
                                break;
                            }
                        }

                        for(i = 0; i < tab_employe.childNodes.length; i++){

                            if(tab_employe.childNodes[i].className=='box-body table-responsive no-padding'){
                                tab_employe = tab_employe.childNodes[i];
                                break;
                            }
                        }

                        tab_employe = tab_employe.firstElementChild;
                        tab_employe = tab_employe.firstElementChild;
                        tab_employe = tab_employe.firstElementChild;
                        tab_employe = tab_employe.nextElementSibling;
                        
                        
                        var nom, effectif, pourcentage;
                        while(tab_employe){
                            
                           nom = tab_employe.childNodes[1].innerText;
                           effectif = parseInt(tab_employe.childNodes[3].innerText,10);
                           pourcentage = tab_employe.childNodes[9].childNodes[0].innerText;
                           pourcentage = parseInt(pourcentage.replace(/%/, ''),10);
                            
                            donnees[nom] = {effectif, pourcentage};
                            
                            
                            tab_employe = tab_employe.nextElementSibling;
                        }


                        var content = document.createElement('div');
                        
                        content.innerHTML = '=== Script BankTycoon Info ===<br>'
                        +               '<strong> Voici la liste des employés à embaucher pour atteindre un rendement de 100 % : </strong><br>';
                        
                        var position = 0;
                        var salaires_effectifs = [donnees_salaires[0],donnees_salaires[1],donnees_salaires[2],donnees_salaires[3],donnees_salaires[4],donnees_salaires[6],donnees_salaires[9]];
                        var a_employer;
                        for(var profession in donnees){
                            
                            a_employer = (Math.ceil(donnees[profession]['effectif']*100/donnees[profession]['pourcentage'])-donnees[profession]['effectif']);
                                
                            content.innerHTML += ' - ' + profession + ' : Il vous faut en embaucher <strong>' + a_employer +
                                '</strong> pour un total de : <strong>' + (a_employer*salaires_effectifs[position]).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' € </strong><br>';
                                
                            position++;
                            
                        }
                        
                        
                        onglets.insertBefore(content, onglets.firstChild);
                        }, 500);




                }






            }, false);







        } 
    
    }
    
})();
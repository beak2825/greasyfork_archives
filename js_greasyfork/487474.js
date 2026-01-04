// ==UserScript==
// @name         DC - AutoStock
// @namespace    http://tampermonkey.net/
// @version      1.3.0.Alpha
// @description  Permet le réajustement des stocks en vente ou les prix dans l'usine de production pour DC.
// @author       Mochizuki Kaneda Dii Amane [Amane-Mochizuki]
// @match        https://www.dreadcast.net/Main
// @match        https://dev.dreadcast.eu/Main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreadcast.net
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/487474/DC%20-%20AutoStock.user.js
// @updateURL https://update.greasyfork.org/scripts/487474/DC%20-%20AutoStock.meta.js
// ==/UserScript==

// CC-BY-NC-SA-4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// [Changelog]
// 1.0.0.Alpha
// - Version initiale
//
// 1.1.0.Alpha :
// - mode ouverture/fermeture automatique (corrige également le bug de dupplication du menu)
// - correction bug saisie de données
// - détection de l'interface ouverte. si non compatible affichage d'un message (sera retiré dans la version stable)
// - préparatif du développement pour "boutique"
//
// 1.2.0.Alpha :
// - création fonction export prix usine
// - création fonction import prix usine
// - correction bug : mise en vente stock usine > plante si la réserve est défini sur "zéro"
// - correction bug : changer prix usine > prix de vente des articles ancienne génération. > la ligne est désormais ignoré et demandera un traitement manuel. Un avertissement est affiché dans le journal
//
// 1.2.1.Alpha (non publié hotfix direct canal 1.2.1.beta) :
// - masquer le message d'avertissement sur les stock non géré (banque, agence immobilières...). Celui ci reste présent pour les boutiques de vente sous la forme "AutoStock : Boutique à venir."
//
// 1.3.0.Alpha :
// - fond de pop up de log personnalisable dans la config (attention le contraste peut être foireux, encore en stade expérimental)
// - déplacement possible de la pop up dans la config (reste rattaché a une position relative à la fenêtre parente de stock mais pour adapter aux skin)
//
// - adaptation pour les technopole basé sur le même fonctionnement que l'usine
// -- duplication des fonctions pour Correctif d'affichage afin de mentionner l'emplacement du kit. (tête, buste, jambe, pieds, secondaires dans les prints, export, import)
//
// - Ajout des quantités de stocks courants lors d'un export pour un traitement externe  => les données de stocks sont ignoré à l'import.
//
// - Ajustements mineurs. réglage du chevauchement de la barre de défilement.
//
// Bug Connu :
//
// Roadmap :
// - création version boutique
// - création fonction permettant de "vider la vitrine" d'une boutique
//



                                                       //Initialisation et GUI
var versionAutoStock = "1.3.0.Alpha"

//Config
var Config_BgColorAutoStockUI = "#0B4E64" // couleur de fond pour la pop up qui contient le log par défaut : "#0B4E64"
var Config_TxtColorAutoStockUI = "#000000" // couleur du texte d'entete pour la pop up qui contient le log par défaut : "#000000"
var Config_positionHorizontal = 550 // positionnement horizontale relatif à la fenetre de stock de base. par défaut : 550
 var Config_positionVertical = -498 //  positionnement horizontale relatif à la fenetre de stock de base. par défaut : -498

var Global_GUIActive = false
var UnStock
var TypeUI
var htmlstockclass
var NombrestockScann

// détection event d'ouverture fermeture d'un stock
$(document).ajaxSuccess(function (e, xhr, opt) {
    if (document.getElementById("modif_stocks_form") != null && Global_GUIActive == false )
    {
        htmlstockclass = document.getElementById("modif_stocks_form").getElementsByClassName("stock");

        if ( $(htmlstockclass).length > 0 )
        {
            //alert("stock détecté, scan en cours")
            TypeUI = DetectionUiStock(CleanHtml(htmlstockclass[0].outerHTML))
            //alert("scan fini, " + TypeUI)
        }
        else
        {
            //alert("pas de stock détecté")
            TypeUI = "Inconnu"
        }

        console.log("AutoStock : ouvert sur profil " + TypeUI)
        // alert("AutoStock : ouvert sur profil " + TypeUI)


        switch (TypeUI)
        {
            case "Usine":
                AfficherAutoStockUsine();
                break;
            case "Boutique":
                AfficherAutoStockBoutique();
                break;
            case "Technopole":
                //AfficherAutoStockUsine();
                AfficherAutoStockTechnopole();
                break;
            default:
                AfficherAutoStockInconnu();
                break;
       }

        Global_GUIActive = true
    }
  });

$(document).ajaxSuccess(function (e, xhr, opt) {
    if (document.getElementById("modif_stocks_form") == null && Global_GUIActive == true )
    {
        console.log("AutoStock : fermé")
        Global_GUIActive = false
    }
  });


//function AfficherAutoStock (zEvent) {

function AfficherAutoStockInconnu () {

    var menu = document.createElement ('div');
    menu.innerHTML = '<span style="left:135px;"></span>';
    menu.setAttribute ('id', 'AutoStockMenu');

    document.getElementById("modif_stocks_form").appendChild(menu);

}

function AfficherAutoStockBoutique () {

    var menu = document.createElement ('div');
    menu.innerHTML = '<span style="left:135px;">AutoStock : Boutique à venir.</span>';
    menu.setAttribute ('id', 'AutoStockMenu');

    document.getElementById("modif_stocks_form").appendChild(menu);

}

function AfficherAutoStockTechnopole () {

    var menu = document.createElement ('div');
    menu.innerHTML = '<span id="AutoStockRootMenu" style="left:25px;"><a id="MettreEnVenteTechnopole" style="cursor:pointer;">Mettre en vente</a> | <a id="ChangePrixTechnopole" style="cursor:pointer;">Changer prix</a> | <a id="ExportPrixTechnopole" style="cursor:pointer;">Exporter prix</a> | <a id="ImportPrixTechnopole" style="cursor:pointer;">Importer prix</a></span>'
                   + '<div id="AutoStockListAnchor" style="left:'+Config_positionHorizontal+'px; top:'+Config_positionVertical+'px; width:1px; height:1px;">'
                   + '<div id="AutoStockLog" style="height:518px; width:500px; color:'+Config_TxtColorAutoStockUI+'; background-color:'+Config_BgColorAutoStockUI+'; overflow: auto;">Autostock v'+versionAutoStock+' par Amane-Mochizuki<br />journal de traitement :</div></div>';
    menu.setAttribute ('id', 'AutoStockMenu');

    document.getElementById("modif_stocks_form").appendChild(menu);

    document.getElementById("MettreEnVenteTechnopole").addEventListener ( "click", MettreEnVenteTechnopole, false);
    document.getElementById("ChangePrixTechnopole").addEventListener ( "click", ChangePrixTechnopole, false);
    document.getElementById("ExportPrixTechnopole").addEventListener ( "click", ExportPrixTechnopole, false);
    document.getElementById("ImportPrixTechnopole").addEventListener ( "click", ImportPrixTechnopole, false);

}

function AfficherAutoStockUsine () {

    var menu = document.createElement ('div');
    menu.innerHTML = '<span id="AutoStockRootMenu" style="left:25px;"><a id="MettreEnVenteUsine" style="cursor:pointer;">Mettre en vente</a> | <a id="ChangePrixUsine" style="cursor:pointer;">Changer prix</a> | <a id="ExportPrixUsine" style="cursor:pointer;">Exporter prix</a> | <a id="ImportPrixUsine" style="cursor:pointer;">Importer prix</a></span>'
                   + '<div id="AutoStockListAnchor" style="left:'+Config_positionHorizontal+'px; top:'+Config_positionVertical+'px; width:1px; height:1px;">'
                   + '<div id="AutoStockLog" style="height:518px; width:500px; color:'+Config_TxtColorAutoStockUI+'; background-color:'+Config_BgColorAutoStockUI+'; overflow: auto;">Autostock v'+versionAutoStock+' par Amane-Mochizuki<br />journal de traitement :</div></div>';
    menu.setAttribute ('id', 'AutoStockMenu');

    document.getElementById("modif_stocks_form").appendChild(menu);

    document.getElementById("MettreEnVenteUsine").addEventListener ( "click", MettreEnVenteUsine, false);
    document.getElementById("ChangePrixUsine").addEventListener ( "click", ChangePrixUsine, false);
    document.getElementById("ExportPrixUsine").addEventListener ( "click", ExportPrixUsine, false);
    document.getElementById("ImportPrixUsine").addEventListener ( "click", ImportPrixUsine, false);
}


                                                      // Fonctions de modifications stock USINE

function MettreEnVenteUsine (zEvent) {

    OutputLog('<span style="color:black;">------------------ Traitement de mise en vente ------------------</span>')
    var htmlNode
    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente
    var OutputString
    var MaxStockVente

    var InputBoxAChanger

    var ReserveStock = prompt('Autostock : \n Seuil de réserve exclue de la vente pour produits standard \n champs vide = 0')
    if (ReserveStock == null){
        OutputLog('<span style="color:black;">Paramètre de réserve standard : </span> Opération annulée')
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }

    if (ReserveStock == ""){
        ReserveStock = 0
    }

    if (isdigit(ReserveStock) || ReserveStock == 0)
    {
        OutputLog('<span style="color:black;">Paramètre de réserve standard : </span>' + ReserveStock)
    }
    else
    {
        OutputLog('<span style="color:black;">Paramètre de réserve standard invalide : </span>' + ReserveStock)
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }


    var ReserveStockAliments = prompt('Autostock : \n Seuil de réserve exclue de la vente pour produits alimentaires \n champs vide = 0')
    if (ReserveStockAliments == null){
        OutputLog('<span style="color:black;">Paramètre de réserve aliments : </span> Opération annulée')
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }
    if (ReserveStockAliments == ""){
        ReserveStockAliments = 0
    }
    
    if (isdigit(ReserveStockAliments) || ReserveStockAliments == 0 )
    {
        OutputLog('<span style="color:black;">Paramètre de réserve aliments : </span>' + ReserveStockAliments)
    }
    else
    {
        OutputLog('<span style="color:black;">Paramètre de réserve aliments invalide : </span>' + ReserveStockAliments)
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }

    for(var i = 0; i < elements.length; i++)
    {
        OutputString = ''
        Unobjet_Scannee = ScanHtmlUnObjetUsine(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        var htmlinput

        if (UnObjet_Type == "Stock de 10 aliments") {

            MaxStockVente = UnObjet_StockDispo - ReserveStockAliments
            if (MaxStockVente < 0 ) {
                MaxStockVente = 0
            }

           InputBoxAChanger = 'champ_cpt_' + UnObjet_ID
           htmlinput = document.getElementById(InputBoxAChanger);
           htmlinput.value = MaxStockVente;
           htmlinput.className = "champ";

            OutputLog('<span style="color:#fff;">' + UnObjet_Nom + '</span> en vente : <span class="couleur5">' + UnObjet_StockVente + '</span> > <span class="couleur1">' +
                      MaxStockVente + '</span> sur total <span class="couleur0">' + UnObjet_StockDispo + '</span> (réserve ' + ReserveStockAliments + ')' )
        }
        else
        {
            MaxStockVente = UnObjet_StockDispo - ReserveStock
            if (MaxStockVente < 0 ) {
                MaxStockVente = 0
            }
            OutputLog('<span style="color:#fff;">' + UnObjet_Nom + '</span> en vente : <span class="couleur5">' + UnObjet_StockVente + '</span> > <span class="couleur1">' +
                      MaxStockVente + '</span> sur total <span class="couleur0">' + UnObjet_StockDispo + '</span> (réserve ' + ReserveStock + ')' )

           InputBoxAChanger = 'champ_cpt_' + UnObjet_ID
           htmlinput = document.getElementById(InputBoxAChanger);
           htmlinput.value = MaxStockVente;
           htmlinput.className = "champ";

        }


    }
    OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
}

function ChangePrixUsine (zEvent) {
    OutputLog('<span style="color:black;">---------------- Traitement de changement prix ----------------</span>')
    var htmlNode
    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente
    var OutputString
    var NouveauPrixVente

    var InputBoxAChanger
    var MargeAppliquerbis

    var MargeAppliquer = prompt('Autostock : \n Marge a appliquer sur le prix de production (en %) \n champs vide = 0%')
    if (MargeAppliquer == null){
        OutputLog('<span style="color:black;">Paramètre de marge a appliquer: </span> Opération annulée')
        OutputLog('<span style="color:black;">---------------- Fin Traitement de changement prix ----------------</span>')
        return 0
    }

    if (MargeAppliquer == ""){
        MargeAppliquer = 0
    }


    MargeAppliquerbis = (MargeAppliquer / 100)
    MargeAppliquerbis = (1 + MargeAppliquerbis)



    OutputLog('<span style="color:black;">Paramètre de marge a appliquer : </span>' + MargeAppliquer + '%')


    for(var i = 0; i < elements.length; i++)
    {
        OutputString = ''
        Unobjet_Scannee = ScanHtmlUnObjetUsine(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        var htmlinput

        //NouveauPrixVente = ()
        NouveauPrixVente = Math.trunc(UnObjet_PrixProd * MargeAppliquerbis)

       // alert(NouveauPrixVente + 'prod ' + UnObjet_PrixProd + '*marge ' +MargeAppliquerbis)

        if (UnObjet_PrixProd != 0)
        {

           InputBoxAChanger = 'champ_stock_' + UnObjet_ID
           htmlinput = document.getElementById(InputBoxAChanger);
           htmlinput.value = NouveauPrixVente;
           htmlinput.className = "champ";

            OutputLog('<span style="color:#fff;">' + UnObjet_Nom + '</span> prix de vente : <span class="couleur5">' + UnObjet_PrixVente + '</span> > <span class="couleur1">' +
                      NouveauPrixVente + '</span> (marge ' + MargeAppliquer + ')' )
        }
        else
        {
            OutputLog('<span style="color:#ff0;">/!\\ Modification ignoré car le prix de prod. est de 0¢r (Ancienne Génération ?)')
            OutputLog('<span style="color:#ff0;">--> </span> '+ UnObjet_Nom + '</span>' )
        }
    }
    OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
}

function ExportPrixUsine (zEvent) {

    OutputLog('<span style="color:black;">--------------- Traitement pour export des prix --------------</span>')
    var uneligne = ''
    var csv = 'ProductID;Designation;Prix;QuantiteDispo;QuantiteVente\n'

    // début du process

    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente

    for(var i = 0; i < elements.length; i++)
    {
        uneligne = ''
        Unobjet_Scannee = ScanHtmlUnObjetUsine(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        //uneligne = UnObjet_ID +";"+UnObjet_Nom+";"+UnObjet_PrixVente+"\n"
        uneligne = UnObjet_ID +";"+UnObjet_Nom+";"+UnObjet_PrixVente+";"+UnObjet_StockDispo+";"+UnObjet_StockVente+"\n"
        csv = csv + uneligne

    }
    OutputLog('Données exportées à sauvegarder pour la fonction Importer prix')
    // affichage du resultat strings
    var htmlNode
    htmlNode = document.createElement('p');
    htmlNode.innerHTML = '<textarea disabled name="PrixExport" cols="55" rows="16">'+csv+'</textarea>'
    document.getElementById("AutoStockLog").appendChild(htmlNode);

   OutputLog('<span style="color:black;">------------- Fin Traitement pour export des prix -------------</span>')
}

function ImportPrixUsine (zEvent) {

    OutputLog('<span style="color:black;">--------------- Traitement pour import des prix --------------</span>')
    var uneligne = ''
    var csv = 'ProductID;Designation;Prix\n'

    // début du process

    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente

    OutputLog('saisir les données pour importer les prix')
    // affichage du resultat strings
    var htmlNode
    htmlNode = document.createElement('p');
    htmlNode.innerHTML = '<span class="ZonePrixImport"><textarea id="PrixImport" cols="55" rows="6"></textarea></span><br /><span class="ConfirmerImport"><a id="AnnulerImportUsine" style="cursor:pointer;">Annuler</a> | <a id="ValiderImportUsine" style="cursor:pointer;">Valider</a></span>'
    document.getElementById("AutoStockLog").appendChild(htmlNode);

    $("#AutoStockRootMenu").children().prop('hidden',true);
    document.getElementById("AnnulerImportUsine").addEventListener ( "click", AnnulerImportUsine, false);
    document.getElementById("ValiderImportUsine").addEventListener ( "click", ValiderImportUsine, false);


}

     function AnnulerImportUsine (zEvent) {

         $( ".ConfirmerImport" ).empty();
         document.getElementById('PrixImport').disabled = true
         document.getElementById('PrixImport').id = 'PrixImportAnnule'
         $("#AutoStockRootMenu").children().prop('hidden',false);

         OutputLog("Processus d'importation annulé")
         OutputLog('<span style="color:black;">------------ Fin traitement pour import des prix -------------</span>')
     }

     function ValiderImportUsine (zEvent) {
         var GUIerror = "/!\\"
         var UneLigneImporte
         var DonneeUneLigne
         var idTrouve

         var UnProductID
         var UneDesignation
         var UnPrix

         var Unobjet_Scannee
         var UnObjet_ID
         var UnObjet_Type
         var UnObjet_Nom
         var UnObjet_StockDispo
         var UnObjet_PrixProd
         var UnObjet_StockVente
         var UnObjet_PrixVente
         var InputBoxAChanger
         var htmlinput


         $( ".ConfirmerImport" ).empty();
         var DataInput = document.getElementById('PrixImport').value;


         document.getElementById('PrixImport').disabled = true
         document.getElementById('PrixImport').id = 'PrixImportValide'



         //alert(DataInput)


         var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");


         var LignesImporte = DataInput.split('\n');


         for(var i = 0; i < LignesImporte.length; i++)
         {
             UneLigneImporte = LignesImporte[i]

             DonneeUneLigne = UneLigneImporte.split(';');

             if (DonneeUneLigne[0] != undefined && DonneeUneLigne[1] != undefined && DonneeUneLigne[2] != undefined ) {

                 UnProductID = DonneeUneLigne[0]
                 UneDesignation = DonneeUneLigne[1]
                 UnPrix = DonneeUneLigne[2]

                 if ( UnProductID == 'ProductID' && UneDesignation == 'Designation' && UnPrix == 'Prix' && i == 0 )
                 {
                     OutputLog("démarrage de l'importation : la structure semble cohérente.")
                 }
                 else
                 {
                     if (i != 0)
                     {

                         idTrouve = false

                         for(var y = 0; y < elements.length; y++)
                         {
                             Unobjet_Scannee = ScanHtmlUnObjetUsine(elements[y].outerHTML) ;

                             UnObjet_ID = Unobjet_Scannee[0]
                             UnObjet_Type = Unobjet_Scannee[1]
                             UnObjet_Nom = Unobjet_Scannee[2]
                             UnObjet_StockDispo = Unobjet_Scannee[3]
                             UnObjet_PrixProd = Unobjet_Scannee[4]
                             UnObjet_StockVente = Unobjet_Scannee[5]
                             UnObjet_PrixVente = Unobjet_Scannee[6]


                             if (UnObjet_ID == UnProductID)
                             {
                                 idTrouve = true
                                 if (UnObjet_Nom == UneDesignation)
                                 {

                                     // traitement
                                     InputBoxAChanger = 'champ_stock_' + UnProductID

                                     htmlinput = document.getElementById(InputBoxAChanger);
                                     htmlinput.value = UnPrix
                                     htmlinput.className = "champ";

                                     OutputLog('<span style="color:#fff;">' + UneDesignation + '</span> prix de vente : <span class="couleur5">' + UnObjet_PrixVente + '</span> > <span class="couleur1">' + UnPrix + '</span>' )
                                 }
                                 else
                                 {

                                     // id trouvé, nom incohérent

                                     OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur l'ID produit " + UnObjet_ID + " a été trouvé avec un autre nom (ligne ignorée) :</span>" )
                                     OutputLog('<span style="color:#f00;">--> </span> importé : <span style="color:#fff;">'+ UneDesignation + '</span> / stock : <span style="color:#fff;">'+ UnObjet_Nom + '</span>')
                                 }
                             }

                         }
                         if (idTrouve == false)
                         {
                             // id absent

                             OutputLog('<span style="color:#ff0;">' + GUIerror + " L'ID produit " + UnProductID + " n'a pas été trouvé dans le stock et à été ignoré")
                             OutputLog('<span style="color:#ff0;">--> </span> Stock manquant : <span style="color:#fff;">'+ UneDesignation + '</span>' )
                         }

                     }
                     else
                     {
                         // format de fichier incorect, entete manquant
                         OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur de structure sur données, l'entête de contrôle est absent ou invalide.</span>" )
                         OutputLog("Annulation de l'opération")
                         i = 999999
                     }

                 }

             }
             else
             {
                 if (UneLigneImporte == '')
                 {
                     //OutputLog('---------------------------------------------------------------------')
                    // OutputLog('<span style="color:#ff0;">' + GUIerror + ' Ligne de données vide ignorée')
                   //  OutputLog('---------------------------------------------------------------------')
                 }
                 else
                 {
                     //OutputLog('---------------------------------------------------------------------')
                     OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur de structure sur ligne : l'entrée suivante a été ignoré.")
                     OutputLog('<span style="color:#f00;">--> </span>' + UneLigneImporte)
                     //OutputLog('---------------------------------------------------------------------')
                 }
             }


         }






         
         $("#AutoStockRootMenu").children().prop('hidden',false);

         OutputLog("Processus d'importation terminé")
         OutputLog('<span style="color:black;">------------ Fin traitement pour import des prix -------------</span>')
     }

                                                      // Fonctions de modifications stock TECHNOPOLE

function MettreEnVenteTechnopole (zEvent) {

    OutputLog('<span style="color:black;">------------------ Traitement de mise en vente ------------------</span>')
    var htmlNode
    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente
    var OutputString
    var MaxStockVente

    var InputBoxAChanger

    var ReserveStock = prompt('Autostock : \n Seuil de réserve exclue de la vente des kits \n champs vide = 0')
    if (ReserveStock == null){
        OutputLog('<span style="color:black;">Paramètre de réserve : </span> Opération annulée')
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }

    if (ReserveStock == ""){
        ReserveStock = 0
    }

    if (isdigit(ReserveStock) || ReserveStock == 0)
    {
        OutputLog('<span style="color:black;">Paramètre de réserve des kits : </span>' + ReserveStock)
    }
    else
    {
        OutputLog('<span style="color:black;">Paramètre de réserve des kits invalide : </span>' + ReserveStock)
        OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
        return 0
    }



    for(var i = 0; i < elements.length; i++)
    {
        OutputString = ''
        Unobjet_Scannee = ScanHtmlUnObjetTechnopole(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        var htmlinput


            MaxStockVente = UnObjet_StockDispo - ReserveStock
            if (MaxStockVente < 0 ) {
                MaxStockVente = 0
            }
            OutputLog('<span style="color:#fff;">' + UnObjet_Type + ' ' + UnObjet_Nom + '</span> en vente : <span class="couleur5">' + UnObjet_StockVente + '</span> > <span class="couleur1">' +
                      MaxStockVente + '</span> sur total <span class="couleur0">' + UnObjet_StockDispo + '</span> (réserve ' + ReserveStock + ')' )

           InputBoxAChanger = 'champ_cpt_' + UnObjet_ID
           htmlinput = document.getElementById(InputBoxAChanger);
           htmlinput.value = MaxStockVente;
           htmlinput.className = "champ";


    }
    OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
}

function ChangePrixTechnopole (zEvent) {
    OutputLog('<span style="color:black;">---------------- Traitement de changement prix ----------------</span>')
    var htmlNode
    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente
    var OutputString
    var NouveauPrixVente

    var InputBoxAChanger
    var MargeAppliquerbis

    var MargeAppliquer = prompt('Autostock : \n Marge a appliquer sur le prix de production (en %) \n champs vide = 0%')
    if (MargeAppliquer == null){
        OutputLog('<span style="color:black;">Paramètre de marge a appliquer: </span> Opération annulée')
        OutputLog('<span style="color:black;">---------------- Fin Traitement de changement prix ----------------</span>')
        return 0
    }

    if (MargeAppliquer == ""){
        MargeAppliquer = 0
    }


    MargeAppliquerbis = (MargeAppliquer / 100)
    MargeAppliquerbis = (1 + MargeAppliquerbis)



    OutputLog('<span style="color:black;">Paramètre de marge a appliquer : </span>' + MargeAppliquer + '%')


    for(var i = 0; i < elements.length; i++)
    {
        OutputString = ''
        Unobjet_Scannee = ScanHtmlUnObjetTechnopole(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        var htmlinput

        //NouveauPrixVente = ()
        NouveauPrixVente = Math.trunc(UnObjet_PrixProd * MargeAppliquerbis)

       // alert(NouveauPrixVente + 'prod ' + UnObjet_PrixProd + '*marge ' +MargeAppliquerbis)

        if (UnObjet_PrixProd != 0)
        {

           InputBoxAChanger = 'champ_stock_' + UnObjet_ID
           htmlinput = document.getElementById(InputBoxAChanger);
           htmlinput.value = NouveauPrixVente;
           htmlinput.className = "champ";

            OutputLog('<span style="color:#fff;">' + UnObjet_Type + ' ' + UnObjet_Nom + '</span> prix de vente : <span class="couleur5">' + UnObjet_PrixVente + '</span> > <span class="couleur1">' +
                      NouveauPrixVente + '</span> (marge ' + MargeAppliquer + ')' )
        }
        else
        {
            OutputLog('<span style="color:#ff0;">/!\\ Modification ignoré car le prix de prod. est de 0¢r (Ancienne Génération ?)')
            OutputLog('<span style="color:#ff0;">--> </span> '+ UnObjet_Nom + '</span>' )
        }
    }
    OutputLog('<span style="color:black;">---------------- Fin Traitement de mise en vente ----------------</span>')
}

function ExportPrixTechnopole (zEvent) {

    OutputLog('<span style="color:black;">--------------- Traitement pour export des prix --------------</span>')
    var uneligne = ''
    var csv = 'ProductID;Designation;Prix;QuantiteDispo;QuantiteVente\n'

    // début du process

    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente

    for(var i = 0; i < elements.length; i++)
    {
        uneligne = ''
        Unobjet_Scannee = ScanHtmlUnObjetTechnopole(elements[i].outerHTML) ;

        UnObjet_ID = Unobjet_Scannee[0]
        UnObjet_Type = Unobjet_Scannee[1]
        UnObjet_Nom = Unobjet_Scannee[2]
        UnObjet_StockDispo = Unobjet_Scannee[3]
        UnObjet_PrixProd = Unobjet_Scannee[4]
        UnObjet_StockVente = Unobjet_Scannee[5]
        UnObjet_PrixVente = Unobjet_Scannee[6]

        uneligne = UnObjet_ID +";"+UnObjet_Type+" "+UnObjet_Nom+";"+UnObjet_PrixVente+";"+UnObjet_StockDispo+";"+UnObjet_StockVente+"\n"

        csv = csv + uneligne

    }
    OutputLog('Données exportées à sauvegarder pour la fonction Importer prix')
    // affichage du resultat strings
    var htmlNode
    htmlNode = document.createElement('p');
    htmlNode.innerHTML = '<textarea disabled name="PrixExport" cols="55" rows="16">'+csv+'</textarea>'
    document.getElementById("AutoStockLog").appendChild(htmlNode);

   OutputLog('<span style="color:black;">------------- Fin Traitement pour export des prix -------------</span>')
}

function ImportPrixTechnopole (zEvent) {

    OutputLog('<span style="color:black;">--------------- Traitement pour import des prix --------------</span>')
    var uneligne = ''
    var csv = 'ProductID;Designation;Prix\n'

    // début du process


    var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");
    var Unobjet_Scannee
    var UnObjet_ID
    var UnObjet_Type
    var UnObjet_Nom
    var UnObjet_StockDispo
    var UnObjet_PrixProd
    var UnObjet_StockVente
    var UnObjet_PrixVente

    OutputLog('saisir les données pour importer les prix')
    // affichage du resultat strings
    var htmlNode
    htmlNode = document.createElement('p');
    htmlNode.innerHTML = '<span class="ZonePrixImport"><textarea id="PrixImport" cols="55" rows="6"></textarea></span><br /><span class="ConfirmerImport"><a id="AnnulerImportTechnopole" style="cursor:pointer;">Annuler</a> | <a id="ValiderImportTechnopole" style="cursor:pointer;">Valider</a></span>'
    document.getElementById("AutoStockLog").appendChild(htmlNode);

    $("#AutoStockRootMenu").children().prop('hidden',true);
    document.getElementById("AnnulerImportTechnopole").addEventListener ( "click", AnnulerImportTechnopole, false);
    document.getElementById("ValiderImportTechnopole").addEventListener ( "click", ValiderImportTechnopole, false);


}

     function AnnulerImportTechnopole (zEvent) {

         $( ".ConfirmerImport" ).empty();
         document.getElementById('PrixImport').disabled = true
         document.getElementById('PrixImport').id = 'PrixImportAnnule'
         $("#AutoStockRootMenu").children().prop('hidden',false);

         OutputLog("Processus d'importation annulé")
         OutputLog('<span style="color:black;">------------ Fin traitement pour import des prix -------------</span>')
     }

     function ValiderImportTechnopole (zEvent) {
         var GUIerror = "/!\\"
         var UneLigneImporte
         var DonneeUneLigne
         var idTrouve

         var UnProductID
         var UneDesignation
         var UnPrix

         var Unobjet_Scannee
         var UnObjet_ID
         var UnObjet_Type
         var UnObjet_Nom
         var UnObjet_Concatene
         var UnObjet_StockDispo
         var UnObjet_PrixProd
         var UnObjet_StockVente
         var UnObjet_PrixVente
         var InputBoxAChanger
         var htmlinput


         $( ".ConfirmerImport" ).empty();
         var DataInput = document.getElementById('PrixImport').value;


         document.getElementById('PrixImport').disabled = true
         document.getElementById('PrixImport').id = 'PrixImportValide'



         //alert(DataInput)


         var elements = document.getElementById("modif_stocks_form").getElementsByClassName("stock");


         var LignesImporte = DataInput.split('\n');


         for(var i = 0; i < LignesImporte.length; i++)
         {
             UneLigneImporte = LignesImporte[i]

             DonneeUneLigne = UneLigneImporte.split(';');

             if (DonneeUneLigne[0] != undefined && DonneeUneLigne[1] != undefined && DonneeUneLigne[2] != undefined ) {

                 UnProductID = DonneeUneLigne[0]
                 UneDesignation = DonneeUneLigne[1]
                 UnPrix = DonneeUneLigne[2]

                 if ( UnProductID == 'ProductID' && UneDesignation == 'Designation' && UnPrix == 'Prix' && i == 0 )
                 {
                     OutputLog("démarrage de l'importation : la structure semble cohérente.")
                 }
                 else
                 {
                     if (i != 0)
                     {

                         idTrouve = false

                         for(var y = 0; y < elements.length; y++)
                         {
                             Unobjet_Scannee = ScanHtmlUnObjetTechnopole(elements[y].outerHTML) ;

                             UnObjet_ID = Unobjet_Scannee[0]
                             UnObjet_Type = Unobjet_Scannee[1]
                             UnObjet_Nom = Unobjet_Scannee[2]
                             UnObjet_Concatene = ''
                             UnObjet_StockDispo = Unobjet_Scannee[3]
                             UnObjet_PrixProd = Unobjet_Scannee[4]
                             UnObjet_StockVente = Unobjet_Scannee[5]
                             UnObjet_PrixVente = Unobjet_Scannee[6]


                             if (UnObjet_ID == UnProductID)
                             {
                                 idTrouve = true

                                 UnObjet_Concatene = UnObjet_Type + " " + UnObjet_Nom
alert(UnObjet_Concatene)
                                 if (UnObjet_Concatene == UneDesignation)
                                 {

                                     // traitement
                                     InputBoxAChanger = 'champ_stock_' + UnProductID

                                     htmlinput = document.getElementById(InputBoxAChanger);
                                     htmlinput.value = UnPrix
                                     htmlinput.className = "champ";

                                     OutputLog('<span style="color:#fff;">' + UneDesignation + '</span> prix de vente : <span class="couleur5">' + UnObjet_PrixVente + '</span> > <span class="couleur1">' + UnPrix + '</span>' )
                                 }
                                 else
                                 {

                                     // id trouvé, nom incohérent

                                     OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur l'ID produit " + UnObjet_ID + " a été trouvé avec un autre nom (ligne ignorée) :</span>" )
                                     OutputLog('<span style="color:#f00;">--> </span> importé : <span style="color:#fff;">'+ UneDesignation + '</span> / stock : <span style="color:#fff;">'+ UnObjet_Concatene + '</span>')
                                 }
                             }

                         }
                         if (idTrouve == false)
                         {
                             // id absent

                             OutputLog('<span style="color:#ff0;">' + GUIerror + " L'ID produit " + UnProductID + " n'a pas été trouvé dans le stock et à été ignoré")
                             OutputLog('<span style="color:#ff0;">--> </span> Stock manquant : <span style="color:#fff;">'+ UneDesignation + '</span>' )
                         }

                     }
                     else
                     {
                         // format de fichier incorect, entete manquant
                         OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur de structure sur données, l'entête de contrôle est absent ou invalide.</span>" )
                         OutputLog("Annulation de l'opération")
                         i = 999999
                     }

                 }

             }
             else
             {
                 if (UneLigneImporte == '')
                 {
                     //OutputLog('---------------------------------------------------------------------')
                    // OutputLog('<span style="color:#ff0;">' + GUIerror + ' Ligne de données vide ignorée')
                   //  OutputLog('---------------------------------------------------------------------')
                 }
                 else
                 {
                     //OutputLog('---------------------------------------------------------------------')
                     OutputLog('<span style="color:#f00;">' + GUIerror + " Erreur de structure sur ligne : l'entrée suivante a été ignoré.")
                     OutputLog('<span style="color:#f00;">--> </span>' + UneLigneImporte)
                     //OutputLog('---------------------------------------------------------------------')
                 }
             }


         }







         $("#AutoStockRootMenu").children().prop('hidden',false);

         OutputLog("Processus d'importation terminé")
         OutputLog('<span style="color:black;">------------ Fin traitement pour import des prix -------------</span>')
     }



                                                      // zone librairie de fonction utiles...

// détection du type de stock ouvert (boutique, immobilier, banque, usine....
function DetectionUiStock(stringhtmlStock) {
    var resultat = "Inconnu"
    if (stringhtmlStock.includes('Stock de') && stringhtmlStock.includes('<input id="champ_cpt_') && stringhtmlStock.includes('<input id="champ_stock_') )
    {
        resultat = "Usine"
    }
    else
    {
        if (stringhtmlStock.includes('Amélioration pour') && stringhtmlStock.includes('<input id="champ_cpt_') && stringhtmlStock.includes('<input id="champ_stock_') )
        {
            resultat = "Technopole"
        }
        else
        {
            if (stringhtmlStock.includes('<td id="prix_unitaire_') && stringhtmlStock.includes('<input id="champ_stock_'))
            {
                resultat = "Boutique"
            }
        }
    }

    return resultat
    //alert(stringhtmlStock);
}


// Ecriture dans le journal de sortie
function OutputLog(HTMLstring){
var htmlNode
    htmlNode = document.createElement('p');
    htmlNode.innerHTML = HTMLstring
    htmlNode.setAttribute('style', 'font-family:"Trebuchet MS",Verdana,Arial,sans-serif; color: #00e1ed; font-variant: small-caps; font-size: 13px;')
    document.getElementById("AutoStockLog").appendChild(htmlNode);
}


//Fonction permettant d'extraire les données d'un objet DC sur le modèle de stock USINE
function ScanHtmlUnObjetUsine(html) {
    var unitem = html
    var unitem_temp = ''
    var unitem_type = ''
    var unitem_nom = ''
    var unitem_id = ''
    var unitem_stockdispo = ''
    var unitem_prixprod = ''
    var unitem_stockvente = ''
    var unitem_prixvente = ''
    var result = new Array();
    unitem_temp = Extractsubstring(unitem, '<div class="nom_item">', '</div>');
    unitem_temp = CleanHtml(unitem_temp)

    unitem_id = Extractsubstring(unitem, '<div id="up_cpt_', '" class="btnUp">');

    unitem_type = Extractsubstring(unitem_temp, 'Stock de', '<span class="couleur4">');
    unitem_type = 'Stock de ' + unitem_type

    unitem_nom = Extractsubstring(unitem_temp, '<span class="couleur4">', '</span>');

    unitem_stockdispo = Extractsubstring(unitem, '<td class="quantite_vente type2" style="height:20px;width:50px;">', '</td>');
    unitem_prixprod = Extractsubstring(unitem, '<td id="prix_unitaire_'+ unitem_id +'" class="prix type2" style="padding-left:20px;width:75px;">', '</td>');
    unitem_stockvente = Extractsubstring(unitem, 'name="cpt_'+ unitem_id +'" value="', '">');
    unitem_prixvente = Extractsubstring(unitem, 'name="stock_'+ unitem_id +'" value="', '">');


    unitem_prixprod = unitem_prixprod.replace(/\s/g, ''); // suppression regex des espaces nécessaire pour calcul sur la fonction de change prix 25 000Cr => 25000Cr
    unitem_prixprod = unitem_prixprod.replace('Cr', ''); // suppression regex des espaces nécessaire pour calcul sur la fonction de change prix 25000Cr => 25000
    return [unitem_id, unitem_type, unitem_nom, unitem_stockdispo, unitem_prixprod, unitem_stockvente, unitem_prixvente]
}

//Fonction permettant d'extraire les données d'un objet DC sur le modèle de stock TECHNOPOLE
function ScanHtmlUnObjetTechnopole(html) {
    var unitem = html
    var unitem_temp = ''
    var unitem_type = ''
    var unitem_nom = ''
    var unitem_id = ''
    var unitem_stockdispo = ''
    var unitem_prixprod = ''
    var unitem_stockvente = ''
    var unitem_prixvente = ''
    var result = new Array();
    unitem_temp = Extractsubstring(unitem, '<div class="nom_item">', '</div>');
    unitem_temp = CleanHtml(unitem_temp)

    unitem_id = Extractsubstring(unitem, '<div id="up_cpt_', '" class="btnUp">');

    unitem_type = Extractsubstring(unitem_temp, 'Amélioration pour ', ' <span class="couleur4">');
    // unitem_type = 'Amélioration pour ' + unitem_type
    //alert(unitem_type)
    unitem_nom = Extractsubstring(unitem_temp, '<span class="couleur4">', '</span>');

    unitem_stockdispo = Extractsubstring(unitem, '<td class="quantite_vente type2" style="height:20px;width:50px;">', '</td>');
    unitem_prixprod = Extractsubstring(unitem, '<td id="prix_unitaire_'+ unitem_id +'" class="prix type2" style="padding-left:20px;width:75px;">', '</td>');
    unitem_stockvente = Extractsubstring(unitem, 'name="cpt_'+ unitem_id +'" value="', '">');
    unitem_prixvente = Extractsubstring(unitem, 'name="stock_'+ unitem_id +'" value="', '">');


    unitem_prixprod = unitem_prixprod.replace(/\s/g, ''); // suppression regex des espaces nécessaire pour calcul sur la fonction de change prix 25 000Cr => 25000Cr
    unitem_prixprod = unitem_prixprod.replace('Cr', ''); // suppression regex des espaces nécessaire pour calcul sur la fonction de change prix 25000Cr => 25000
    return [unitem_id, unitem_type, unitem_nom, unitem_stockdispo, unitem_prixprod, unitem_stockvente, unitem_prixvente]
}


// fonction nettoyant les sauts de ligne et espaces du html pour traitement facilité
function CleanHtml (SringANettoyer) {
    var newPageTxt = SringANettoyer
        .split("\n")
        .map((line) => line.trim())
        .join(" ");
    newPageTxt = newPageTxt.replaceAll('\n', '');
    return newPageTxt
}


// Fonction permettant d'extraire certains éléments d'une string, délémité entre le préfix et le suffix : exemple Extractsubstring ("Bonjour tout le monde", "Bonjour", "monde") retourne "tout le"
function Extractsubstring (s, prefix, suffix) {
	//var s = string;
	var i = s.indexOf(prefix);
	if (i >= 0) {
		s = s.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
		i = s.indexOf(suffix);
		if (i >= 0) {
			s = s.substring(0, i);
		}
		else {
		  return '';
		}
	}
    s = s.trim()
	return s;
}


// Fonction vérifiant si la variable est un nombre entier
const isdigit=(value)=>{
    const val=Number(value)?true:false
    //console.log(val);
    return val
}

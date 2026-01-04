// ==UserScript==
// @name        Automatisation_AAIDA
// @namespace   restosducoeur_AAIDA
// @match       https://aaida*.restosducoeur.org/*
// @grant       none
// @version     1.0.7
// @author      Alain BRION
// @description export commandes et import stock et distribution
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455440/Automatisation_AAIDA.user.js
// @updateURL https://update.greasyfork.org/scripts/455440/Automatisation_AAIDA.meta.js
// ==/UserScript==

var restosAutomContext = {
	tokenCreationInventaire: undefined,	// -1 si la recherche d'inventaire en cours n'a rien donné
	idInventaire: undefined,
  idDistribution: undefined,
	existingInventaireDone: false,
	newInventaireDone: false,
	validationAjoutsDone: false,
  ajoutIdDistributionDone: false,
  missingIdDistributionWarningDone: false,
  addDistributionDone: false,
	produitReel: {},	// ref=> qty, indexé par des strings : c'est un objet, pas un tableau !
	produitAAIDA: {},	// ref => objet de type restosAutomProduitAAIDA
	erreurs: [],
};

function restosAutomStart() {

  // export Commande
  if (window.location.pathname.indexOf('receipt/edit') > 0) return restosAutomGetCommande();
  if (window.location.pathname.indexOf('receipt/') > 0
      && (window.location.pathname.indexOf('/preview') > 0
         || window.location.pathname.indexOf('/view') > 0)) return restosAutomGetCommande();

  // Import d'inventaire ou de distribution
  if (window.location.pathname.indexOf('inventory') > 0) {
    var bInventory = true;
  } else if (window.location.pathname.indexOf('distribution') && window.location.pathname.indexOf('edit') > 0) {
    var bDistribution = true;
  } else {
    alert("Pas sur l'affichage d'une commande,\nPas sur l'import d'inventaire,\nPas sur l'import de distribution,\nIl n'y a rien à faire !");
    return;
  }

  // vérification qu'on a des données à importer
  let txtListe = document.getElementById('restosAutomInventaire').value;
	let tabLines = txtListe.split(/[\n\r]/);
	//window.console.log(tabLines.join(';'));
  var sTitle = undefined;
  let nLines = 0;
	for (let l of tabLines) {
		let l2 = l.trim();
		if (l2 == '') continue;
    if (sTitle == undefined) {
      sTitle = l2;
      continue;
    }
		let tabVal = l2.split(/[\t;]/);
		if (tabVal.length == 2) {
			restosAutomContext.produitReel[tabVal[0].trim()] = parseInt(tabVal[1].trim());
      nLines++;
		} else {
			restosAutomSetStatus("Mauvaise ligne d'inventaire " + l2);
		}
	}
  if (nLines <= 0) {
    let msg = "Pas de données à importer";
    if (sTitle != undefined) msg += "\nPremière ligne =\n" + sTitle;
    alert(msg);
    return;
  }
  if (bInventory) {
    if (sTitle != 'Inventaire') {
      alert("On est en mode inventaire\nMais ce ne sont pas des données d'inventaire")
      return;
    }
    restosAutomSchedulerInventaire();
  } else if (bDistribution) {
    if (sTitle != 'Distribution') {
      alert("On est en mode distribution\nMais ce ne sont pas des données de distribution")
      return;
    }
    restosAutomContext.produitAAIDA = undefined;
    restosAutomContext.idInventaire = undefined;
    restosAutomContext.ajoutIdDistributionDone = false;
    restosAutomContext.missingIdDistributionWarningDone = false;
    restosAutomSchedulerDistribution();
  } else {
    alert("erreur interne : pas en inventory ou distribution, comme c'est étrange");
  }
}

//////////////////////////////////////////////////////////////////////////////
// Export d'une commande
//////////////////////////////////////////////////////////////////////////////

function restosAutomGetCommande() {
  var tabResult = [];
  for (let eTr of document.getElementsByTagName('tr')) {
    if (!eTr.getAttribute('data-item-id')) continue;
    oProduit = {};
    let s1 = eTr.cells[0].textContent;
    let tAnalyse = s1.split('-');
    if (tAnalyse.length < 2) {
      alert("Impossible d'analyser le produit " + s1 + "\n(pas de '-')");
      continue;
    }
    oProduit.reference = tAnalyse.shift().trim();
    oProduit.nom = tAnalyse.join('-').replace(/\n/g, '').replace(/  +/g, ' ').trim();
    oProduit.PCB = eTr.cells[2].textContent.trim();
    oProduit.UB = eTr.cells[3].textContent.trim();
    oProduit.qty = eTr.cells[5].textContent.trim();
    tabResult.push(oProduit.reference + "\t" + oProduit.nom
         //+ "\t" + oProduit.PCB + "\t" + oProduit.UB
         + "\t" + oProduit.qty);
  }
  if (tabResult.length <= 0) {
    alert("Aucun produit trouvé sur cette page");
    return;
  }
  // copier dans le press-papier
  var eTextarea = document.getElementById('restosAutomInventaire');
  eTextarea.value = tabResult.join("\n");
  eTextarea.select();
  var successful = document.execCommand('copy');
  if (!successful) {
    alert('Il y a eu une erreur à la copie vers le presse-papier\n' +
          'les ' + tabResult.length + " lignes de commande sont dans le carré en bas à gauche");
    return;
  }
  alert(tabResult.length + " lignes de commande ont été copiées dans le presse-papier");
  eTextarea.value = '';
}

//////////////////////////////////////////////////////////////////////////////
// Import d'une distribution
//////////////////////////////////////////////////////////////////////////////

function restosAutomSchedulerDistribution() {
  //window.console.log("Début restosAutomSchedulerDistribution");
  if (restosAutomContext.idDistribution == undefined) {
    let m = window.location.pathname.match(/distribution\/(\d+)\/edit/);
    if ((!m) || m.length != 2) {
      alert("Impossible de retrouver l'ID de la distribution dans l'URL\n" + window.location.pathname);
      return;
    }
		restosAutomContext.idDistribution = parseInt(m[1]);
    window.console.log("ID de distribution=" + restosAutomContext.idDistribution);
  }
  // Faire la liste de l'existant et comparer les listes (résultat dans  restosAutomContext.produitAAIDA)
  if (restosAutomContext.produitAAIDA == undefined)
    restosAutomLoadExistingDistribution();

  //window.console.log("Après analyse produits déjà connu de cette distribution");
  //window.console.log(JSON.stringify(restosAutomContext.produitAAIDA));

  // création des id si besoin

  let tabMissing = [];
  for (let reference in restosAutomContext.produitAAIDA) {
    let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
    if (oProduitAAIDA.id) continue;
    if (restosAutomContext.ajoutIdDistributionDone) {
      //alert("L'ID n'a pas été créé pour la référence " + reference + "\nSTOP");
      //return;
      tabMissing.push(reference);
      continue;
    }
    return restosAutomDistributionGetID();
  }
  if (tabMissing.length > 0 && !restosAutomContext.missingIdDistributionWarningDone) {
    let msg = "Les références suivantes ne sont pas dans AAIDA, les sorties correspondantes seront ignorées\n" + tabMissing.join(', ');
    window.console.log(msg);
    alert(msg);
    restosAutomContext.missingIdDistributionWarningDone = true;
  }

  // faire les select des id manquants

  tabMissing = [];
  for (let reference in restosAutomContext.produitAAIDA) {
    let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
    if (!oProduitAAIDA.id) continue;  // Ceux dont on a pas retrouvé l'id
    if (oProduitAAIDA.Ajustement() == 0) continue;
    if (oProduitAAIDA.SelectDone) {
      tabMissing.push(reference);
      continue;
    }
    return restosAutomDistributionSelect(oProduitAAIDA);
  }
  /*
  if (tabMissing.length > 0 && !restosAutomContext.missingIdDistributionWarningDone) {
    alert("Les références suivantes ne sont pas dans AAIDA, les sorties correspondantes seront ignorées\n" + tabMissing.join(', '));
    restosAutomContext.missingIdDistributionWarningDone = true;
  }
  */

  // faire le add
  if (!restosAutomContext.addDistributionDone) return restosAutomDistributionAdd();

  // faire les ajustements

  for (let reference in restosAutomContext.produitAAIDA) {
    let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
    if (!oProduitAAIDA.id) continue;  // Ceux dont on a pas retrouvé l'id
    if (oProduitAAIDA.Ajustement() == 0) continue;
    if (oProduitAAIDA.UpdateQtyDone) {
      tabMissing.push(reference);
      continue;
    }
    return restosAutomDistributionAjuste(oProduitAAIDA);
  }

  //window.console.log(JSON.stringify(restosAutomContext.produitAAIDA));
  location.reload();
}

function restosAutomDistributionSelect(oProduitAAIDA) {
  let callback = function(oAjax) {
    oProduitAAIDA.SelectDone = true;
    restosAutomSchedulerDistribution();
  }
  let url = '/distribution/' + restosAutomContext.idDistribution + '/items/select';
  restosAutomSetStatus('Select référence=' + oProduitAAIDA.reference + ', id=' + oProduitAAIDA.id);
  restosAutomAjax(url, "item=" + oProduitAAIDA.id, callback, false);
}

function restosAutomDistributionAdd() {
  let callback = function(oAjax) {
    restosAutomContext.addDistributionDone = true;
    restosAutomSchedulerDistribution();
  }
  let url = '/distribution/' + restosAutomContext.idDistribution + '/items/add';
  restosAutomSetStatus('Add');
  restosAutomAjax(url, "", callback, false);
}

function restosAutomDistributionAjuste(oProduitAAIDA) {
  let callback = function(oAjax) {
    oProduitAAIDA.UpdateQtyDone = true;
    restosAutomSchedulerDistribution();
  }
  let url = '/distribution/' + restosAutomContext.idDistribution + '/save-item-quantity-change';
  restosAutomSetStatus('Ajout ' + oProduitAAIDA.reference);
  restosAutomAjax(url, oProduitAAIDA.postAjustement(), callback, false);
}

function restosAutomDistributionGetID() {
  let callback = function(oAjax) {
    //Traiter les <tr> avec l'attribut data-item-id
    let tabTable = oAjax.responseXML.getElementsByTagName('table');
    let nProduits = 0;
    let bErreur = false;
    for (let eTable of tabTable) {
      let tabTR = eTable.getElementsByTagName('tr');
      for (let eTR of tabTR) {
        idItem = eTR.getAttribute('data-item-id');
        if (!idItem) continue;
        let reference = eTR.cells[1].textContent.trim();
        if (reference == '') continue;
        let oProduit = restosAutomContext.produitAAIDA[reference];
        if (!oProduit) continue;
        nProduits++;
        if (oProduit.id == undefined) {
          oProduit.id = idItem;
          continue;
        }
        if (oProduit.id != idItem) {
          window.console.log("Erreur référence=" + reference + ", on attend l'id " + oProduit.id + " et on obtient l'id " + idItem);
          bErreur = true;
        }
      }
    }
    let msg = "On a ajouté " + nProduits + " IDs pour la distribution";
    restosAutomSetStatus(msg);

    if (bErreur) {
      alert("Incohérence sur les ID, voir message de la console");
      return;
    }

    restosAutomContext.ajoutIdDistributionDone = true;
    restosAutomSchedulerDistribution();
  }
  let url = '/distribution/' + restosAutomContext.idDistribution + '/items?max_per_page=1000';
  restosAutomAjax(url, undefined, callback, true);
}

function restosAutomLoadExistingDistribution() {
  restosAutomContext.produitAAIDA = {};
	let tabTable = document.getElementsByTagName('table');
  let nProduits = 0;
	for (let eTable of tabTable) {  // en pratique, il y a 2 tableaux dans la page, on fait le travail en double mais ça n'a pas d'importance
		let tabTR = eTable.getElementsByTagName('tr');
		for (let eTR of tabTR) {
			idItem = eTR.getAttribute('data-item-id');
			if (!idItem) continue;
			let reference = eTR.cells[0].textContent.trim();
			if (reference == '') continue;
      iIdItem = parseInt(idItem);
      let qty = eTR.cells[4].textContent.trim();
      if (iIdItem == NaN) {
        window.console.log('Mauvais id pour ref=' + reference + ', id=' + idItem + ', qty=' + qty);
        continue;
      }
      iQty = parseInt(qty);
      if (iQty == NaN) {
        window.console.log('Mauvaise quantité pour ref=' + reference + ', id=' + idItem + ', qty=' + qty);
        continue;
      }
      if (restosAutomContext.produitAAIDA[reference]) continue;
      restosAutomContext.produitAAIDA[reference] = new cProduitDistribution(iIdItem, reference, iQty);
      nProduits++;
		}
	}
	let msg = "On a trouvé " + nProduits + " produit(s) déjà connu dans la distribution en cours";
	restosAutomSetStatus(msg);
  // comparer les listes
  for (let reference in restosAutomContext.produitAAIDA) {
    let iCible = parseInt(restosAutomContext.produitReel[reference]);
    if (iCible) restosAutomContext.produitAAIDA[reference].qtyCible = iCible;
  }
  for (let reference in restosAutomContext.produitReel) {
    let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
    if (!oProduitAAIDA) {
      // il faut l'ajouter !
      oProduitAAIDA = new cProduitDistribution(undefined, reference, 0);
      oProduitAAIDA.qtyCible = parseInt(restosAutomContext.produitReel[reference]);
      restosAutomContext.produitAAIDA[reference] = oProduitAAIDA;
    }
  }
}

function cProduitDistribution(id, reference, qty) { // objet
  this.id = id;
  this.reference = reference;
  this.qtyAvant = qty;
  this.qtyCible = 0;
  //this.CreateIdEnCours = false; // inutile
  this.UpdateQtyDone = false;
  this.SelectDone = false;

  this.Ajustement = function() {
    return this.qtyCible - this.qtyAvant;
  };

  this.postAjustement = function() {  // data du POST vers l'URL /distribution/455/save-item-quantity-change
    return "item=" + this.id + "&value=" + this.Ajustement();
  }
}

//////////////////////////////////////////////////////////////////////////////
// Import d'un inventaire complet
//////////////////////////////////////////////////////////////////////////////

function restosAutomSchedulerInventaire() {
	if (restosAutomContext.idInventaire == undefined) return restosAutomGetInventaireEnCours();
	if (restosAutomContext.idInventaire == -1) return restosAutomCreateInventaire();
	if (!restosAutomContext.existingInventaireDone) return restosAutomGetExistingInventaire();
	if (restosAutomLoadAllIdAAIDA()) return;
	if (restosAutomAddProduitsInventaire()) return;
	if (!restosAutomContext.newInventaireDone) {
		restosAutomContext.newInventaireDone = true;
		restosAutomGetExistingInventaire();
		return;
	}
	if (restosAutomSetQtyInventaire()) return;
	restosAutomSetStatus('fini avec ' + restosAutomContext.erreurs.length + ' erreur(s)');
	let msg = "Processus d'envoi d'inventaire terminé";
	if (restosAutomContext.erreurs.length > 0) {
		msg += "\nIl y a des erreurs\n" + restosAutomContext.erreurs.join("\n");
		window.console.log(restosAutomContext.erreurs.join("\n"));
	}
	alert(msg);
}

function restosAutomSetQtyInventaire() {
	for (var reference in restosAutomContext.produitAAIDA) {
		let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
		if (oProduitAAIDA.IdAAIDA < 0) continue;	// référence en erreur
		if (oProduitAAIDA.qtyDone) continue;
		oProduitAAIDA.setQty();
		return true;	// ce n'est pas fini
	}
	return false;	// toutes les références ont leur qty ou sont en erreur, continuer

}

function restosAutomAddProduitsInventaire() {
	for (var reference in restosAutomContext.produitAAIDA) {
		let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
		if (oProduitAAIDA.IdAAIDA < 0) continue;	// référence en erreur
		if (!oProduitAAIDA.IdDansInventaire) {
			oProduitAAIDA.AdIntoInventaire();
			return true;	// ce n'est pas fini
		}
	}
	if (!restosAutomContext.validationAjoutsDone) {
		restosAutomAppelUrlSec('/inventory/' + restosAutomContext.idInventaire + '/items/add', true);
		restosAutomContext.validationAjoutsDone = true;
		return true;
	}
	//let msg = "fin chargement des ID Inventaire";
	//restosAutomSetStatus(msg);
	return false;	// toutes les références ont leur IdDansInventaire ou sont en erreur, continuer

}

function restosAutomGetExistingInventaire() {
	let callback = function(oAjax) {
		restosAutomLoadInventaire(oAjax.responseXML);
		restosAutomContext.existingInventaireDone = true;
		restosAutomSchedulerInventaire();
	}
	let url = '/inventory/' + restosAutomContext.idInventaire + '/view';
	restosAutomAjax(url, undefined, callback, true);
}

function restosAutomLoadInventaire(oDOM) {
	// analyser toutes les <table> et les avec data-item-id
	let nProduits = 0;
	let tabTable = oDOM.getElementsByTagName('table');
	for (let eTable of tabTable) {
		let tabTR = eTable.getElementsByTagName('tr');
		for (let eTR of tabTR) {
			idItem = eTR.getAttribute('data-inventory-item');
			if (!idItem) continue;
			let reference = eTR.cells[0].textContent.trim();
			if (reference == '') continue;
			let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
			if (!oProduitAAIDA) {
				oProduitAAIDA = new restosAutomProduitAAIDA(reference);
				restosAutomContext.produitAAIDA[reference] = oProduitAAIDA;
			}
			oProduitAAIDA.IdDansInventaire = parseInt(idItem);
			nProduits++;
		}
	}
	let msg = "On a trouvé " + nProduits + " produit(s) dans l'inventaire en cours";
	restosAutomSetStatus(msg);
}

function restosAutomLoadAllIdAAIDA() {
	let nbRefOK = 0;
	let nbRefKO = 0;
	for (var reference in restosAutomContext.produitReel) {
		let oProduitAAIDA = restosAutomContext.produitAAIDA[reference];
		if (!oProduitAAIDA) {
			oProduitAAIDA = new restosAutomProduitAAIDA(reference);
			restosAutomContext.produitAAIDA[reference] = oProduitAAIDA;
		}
		if (oProduitAAIDA.IdDansInventaire) {
			nbRefOK++;
		} else {
			if (!oProduitAAIDA.IdAAIDA) {
				oProduitAAIDA.getIdAAIDA();
				return true;	// ce n'est pas fini
			}
			if (oProduitAAIDA.IdAAIDA >0) nbRefOK++;
			else                          nbRefKO++;	// -1 pour les références non trouvées
		}
	}
	//let msg = "fin chargement des ID AAIDA, nbOK=" + nbRefOK + ', nbKO=' + nbRefKO;
	//restosAutomSetStatus(msg);
	return false;	// toutes les références ont leur IdAAIDA ou leur IdDansInventaire ou sont en erreur, continuer
}

function restosAutomGetInventaireEnCours() {
	// recherche d'un inventaire "En cours"
	let callback = function(oAjax) {
		// Méthode bourrin : analyser tous les <a> pour trouver un href="/inventory/2482/edit"
		let tabA = oAjax.responseXML.getElementsByTagName('a');
		for (let e of tabA) {
			if (!e.href) continue;
			let m = e.href.match(/inventory\/(\d+)\/edit/);
			if (!m) continue;
			if (m.length != 2) continue;
			restosAutomContext.idInventaire = parseInt(m[1]);
			let msg = "On a trouvé un inventaire en cours, ID=" + restosAutomContext.idInventaire;
			restosAutomSetStatus(msg);
			restosAutomSchedulerInventaire();
			return;
		}
		restosAutomContext.idInventaire = -1;
		let msg = "On n'a pas trouvé d'inventaire en cours";
		restosAutomSetStatus(msg);
		restosAutomSchedulerInventaire();
	}
	restosAutomAjax('/inventory', undefined, callback, true);
}

function restosAutomCreateInventaire() {
	// création du token
	if (restosAutomContext.tokenCreationInventaire == undefined) return restosAutomCreateTokenInventaire();
	// création de l'inventaire
	let callback = function(oAjax) {
		let oResult = JSON.parse(oAjax.responseText);
		if (!oResult.success) {
			let msg = "Echec à la création de l'inventaire, échec parse JSON";
			restosAutomSetStatus(msg);
			alert(msg);
			return;
		}
		if (!oResult.redirect_url) {
			let msg = "Echec à la création de l'inventaire, pas de redirect";
			restosAutomSetStatus(msg);
			alert(msg);
			return;
		}
		restosAutomContext.idInventaire = oResult.redirect_url.match(/\d+/)[0];
		if (!restosAutomContext.idInventaire) {
			var msg = "Echec à l'analyse de l'id d'inventaire pour " + oResult.redirect_url;
			restosAutomSetStatus(msg);
			alert(msg);
			return;
		}
		restosAutomSchedulerInventaire();
	}
	var POST = 'create_inventory[name]=Inventaire+du+' + (new Date()).toLocaleString('fr-FR', {'dateStyle':'short'});
	POST += '&create_inventory[type]=full';
	POST += '&create_inventory[comment]=Import+automatisé';
	POST += '&create_inventory[_token]=' + restosAutomContext.tokenCreationInventaire;
	restosAutomAjax('/inventory/create', POST, callback, false);
}

function restosAutomCreateTokenInventaire() {
	var callback = function(oAjax) {
		var eInputToken = oAjax.responseXML.getElementById('create_inventory__token');
		if (!eInputToken) {
			let msg = 'pas de create_inventory__token dans le retour à la création du token';
			restosAutomSetStatus(msg);
			alert(msg);
			return;
		}
		if (eInputToken.value == undefined) {
			restosAutomSetStatus("Pas moyen d'obtenir le token de création d'inventaire");
			alert("Pas moyen d'obtenir le token de création d'inventaire, il y a peut-être déjà un inventaire en cours.");
			return;	// on ne continue pas, ça bouclerait !
		}
		restosAutomSetStatus('got token ' + eInputToken.value);
		restosAutomContext.tokenCreationInventaire = eInputToken.value;
		restosAutomSchedulerInventaire();
	}
	restosAutomAjax('/inventory/create', undefined, callback, true);
}

//-------------------------------------------
function restosAutomSetStatus(msg, bLog) {
	if (bLog === undefined || bLog) window.console.log(msg);
	var eStatus = document.getElementById('restosAutomStatus');
	while (eStatus.firstChild) {
		eStatus.removeChild(eStatus.lastChild);
	}
	eStatus.appendChild(document.createTextNode(msg));
}

function restosAutomAjax(url, POST, callback, bResponseHTML, bPOST) {
	var oAjax = new window.XMLHttpRequest();
	var method = 'GET';
	if (POST != undefined || bPOST) method = 'POST'
	oAjax.open(method, url, true);
	if (POST != undefined)oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	if (bResponseHTML) oAjax.responseType = 'document';
	oAjax.onreadystatechange = function() {
		if (oAjax.readyState === 4) return callback(oAjax);
	};
	//restosAutomSetStatus('appel ' + url);
	oAjax.send(POST);
}

function restosAutomAppelUrlSec(url, bPOST) {
		let callback = function(oAjax) {
			restosAutomSchedulerInventaire();
		}
		restosAutomAjax(url, undefined, callback, false, bPOST);
}

function restosAutomProduitAAIDA(ref) {	// objet
	this.reference = ref;
	//this.IdAAIDA	// peut rester vide si la référence est chargée d'un Inventaire ouvert préexistant
	//this.IdDansInventaire
	//this.qtyDone : true : ok; -1 : réf non trouvée; 404 : pb HTTP; abs : pas de qty demandée; autre : le retour HTTP

	this.setQty = function() {
		// https://aaida-formation.restosducoeur.org/inventory/43734/item-quantity-edit
		//POST  : "quantity=42"
		// retour : true
		var oProduitAAIDA = this;	// on a besoin d'une variable locale qui sera visible de la callback
		this.qty = restosAutomContext.produitReel[this.reference];
		if (!this.qty) {
			this.qtyDone = 'absent';
			let msg = 'err qty absent ' + oProduitAAIDA.reference + ' (forcée à 0)';
			restosAutomContext.erreurs.push(msg);
			restosAutomSetStatus(msg);
			//restosAutomSchedulerInventaire();
			//return;
			this.qty = 0;
		}
		if (this.IdDansInventaire <= 0) {
			this.qtyDone = 'id' + this.IdDansInventaire;
			let msg = 'err ' + this.qtyDone + ' set qty ' + oProduitAAIDA.reference + ' ' + oProduitAAIDA.qty;
			restosAutomContext.erreurs.push(msg);
			restosAutomSetStatus(msg);
			restosAutomSchedulerInventaire();
			return;
		}
		let callback = function(oAjax) {
			if (oAjax.status != 200) {
				let msg = 'err ' + oAjax.status + ' set qty ' + oProduitAAIDA.reference + ' ' + oProduitAAIDA.qty;
				restosAutomContext.erreurs.push(msg);
				restosAutomSetStatus(msg);
				oProduitAAIDA.qtyDone = oAjax.status;
				restosAutomSchedulerInventaire();
			}
			if (oAjax.responseText != 'true') {
				let msg = 'err ' + oAjax.responseText + ' set qty ' + oProduitAAIDA.reference + ' ' + oProduitAAIDA.qty;
				restosAutomContext.erreurs.push(msg);
				restosAutomSetStatus(msg);
				oProduitAAIDA.qtyDone = oAjax.responseText;
				restosAutomSchedulerInventaire();
			}
			let msg = 'set qty ' + oProduitAAIDA.reference + ' ' + oProduitAAIDA.qty;
			restosAutomSetStatus(msg, false);
			oProduitAAIDA.qtyDone = true;
			restosAutomSchedulerInventaire();
		}
		let url = '/inventory/' + this.IdDansInventaire + '/item-quantity-edit';
		let POST = 'quantity=' + this.qty;
		restosAutomAjax(url, POST, callback, false);
	}

	this.AdIntoInventaire = function() {
		//https://aaida-formation.restosducoeur.org/inventory/2412/items/select
		//POST  : "item=17471"
		// retour : affichage de l'inventaire, analysé pour retrouver l'ID inventaire de ce produit
		var oProduitAAIDA = this;	// on a besoin d'une variable locale qui sera visible de la callback
		let callback = function(oAjax) {
			let msg = 'Ajout référence ' + oProduitAAIDA.reference;
			restosAutomSetStatus(msg, false);
			if (oAjax.responseText == 'true') {
				oProduitAAIDA.IdDansInventaire = -1;	// fait mais il faudra analyser l'inventaire pour obtenir l'id
			} else {
				msg = "Erreur à l'ajout de la référence " + oProduitAAIDA.reference;
				restosAutomSetStatus(msg);
				oProduitAAIDA.IdDansInventaire = -2;	// en erreur
			}
			restosAutomSchedulerInventaire();
		}
		let url = '/inventory/' + restosAutomContext.idInventaire + '/items/select';
		let POST = 'item=' + this.IdAAIDA;
		restosAutomAjax(url, POST, callback, false);
	};

	this.getIdAAIDA = function() {
		var oProduitAAIDA = this;	// on a besoin d'une variable locale qui sera visible de la callback
		let callback = function(oAjax) {
			//Rechercher l'ID "details-modal-3056" (3056 est la référence cherchée)
			//Le <tr> englobant a l'attribut data-item-id="17471", 174171 est l'ID AAIDA du produit
			let htmlId = 'details-modal-' + oProduitAAIDA.reference;
			let eSearched = oAjax.responseXML.getElementById(htmlId);
			if (!eSearched) {
				let msg = 'pas de ' + htmlId + " dans le retour de la recherche d'id produit";
				restosAutomSetStatus(msg);
				//alert(msg);
				oProduitAAIDA.IdAAIDA = -1;	// produit non reconnu, marque l'échec
				restosAutomContext.erreurs.push('Référence ' + oProduitAAIDA.reference + ' non trouvée')
				restosAutomSchedulerInventaire();
				return;
			}
			while (eSearched.parentNode && eSearched.parentNode.nodeName != 'TR') eSearched = eSearched.parentNode;
			if (!eSearched.parentNode) {
				let msg = "Pas de <tr> à la recherche de l'ID AAIDA de la référence " + oProduitAAIDA.reference;
				windows.console.log(oAjax.responseText);
				restosAutomSetStatus(msg);
				alert(msg);
				return;	// return sec, pas de relance du scheduler
			}
			let value = eSearched.parentNode.getAttribute('data-item-id');
			if (!value) {
				let msg = "Pas de data-item-id à la recherche de l'ID AAIDA de la référence " + oProduitAAIDA.reference;
				windows.console.log(oAjax.responseText);
				restosAutomSetStatus(msg);
				alert(msg);
				return;	// return sec, pas de relance du scheduler
			}
			restosAutomSetStatus('id ' + value + ' réf ' + oProduitAAIDA.reference, false);
			oProduitAAIDA.IdAAIDA = value;
			restosAutomSchedulerInventaire();
		}
		let url = '/inventory/' + restosAutomContext.idInventaire + '/items?inventory_add_item_filter[code]='
			+ this.reference
			+ '&inventory_add_item_filter[label]=&inventory_add_item_filter[category]=&inventory_add_item_filter[group]=&inventory_add_item_filter[family]='
			+ '&inventory_add_item_filter[axis]=&inventory_add_item_filter[storeClass]=&inventory_add_item_filter[origin]='
			+ '&inventory_add_item_filter[sort_field]=&inventory_add_item_filter[sort_order]=';
		restosAutomAjax(url, undefined, callback, true);
	};
}

function restosAutomPutButton() {
	var eMenu = document.getElementById('mobileMenu');
	if (!eMenu) {
		//alert('Impossible de trouver le menu');
		window.console.log('restosAutomPutButton: Impossible de trouver le menu');
		return;
	}
	var divEnvoi = document.createElement('div');
	divEnvoi.appendChild(document.createTextNode("\u2963"));
	divEnvoi.style.cursor = 'pointer';
	divEnvoi.onclick = restosAutomStart;
	eMenu.appendChild(divEnvoi);
	var divStatus = document.createElement('div');
	divStatus.style.color = 'purple';
	divStatus.style.whiteSpace = 'nowrap';
	divStatus.id = 'restosAutomStatus';
	eMenu.appendChild(divStatus);
	var divEnvoi = document.createElement('div');
	var eInput = document.createElement('textarea');
	eInput.id = 'restosAutomInventaire';
	divEnvoi.appendChild(eInput);
	eMenu.appendChild(divEnvoi);
	restosAutomSetStatus('init fait');
}

restosAutomPutButton();

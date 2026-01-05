// ==UserScript==
// @name       	  	My HELPER functions
// @version       	0.1
// @date          	2015/08/03
// @author        	https://greasyfork.org/users/12782-fr%C3%A9d%C3%A9ric-sanz
// @contributor
// @namespace     	freMea
// @description   	Useful functions that can be used with @require in scripts

// @license         Creative Commons CC-BY-NC-SA
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////
// ++++++++++++++++++++ GREASEMONKEY API EMULATION +++++++++++++++++++++++++++
///////////////////////////////////////////////////////////////////////////////

// une fonction log personnalisée dans la console web (section 'journal') pour les scripts GreaseMonkey
function _log(info) {
    console.log('\t\t\t\t::: ' + GM_info.script.name + ' ' + GM_info.script.version + ' :::\n' + info + '\n...........................................................................');
}


///////////////////////////////////////////////////////////////////////////////
// +++++++++++++++++++++++ WORKING WITH THE URL ++++++++++++++++++++++++++++++
///////////////////////////////////////////////////////////////////////////////

// insérer paramètre à l'url puis la recharger
function insertParam(key, value) {
   key = encodeURIComponent(key); value = encodeURIComponent(value);

   // teste si l'url contient déjà des paramètres et les liste le cas échéant dans la variable kvp (tableau)
   var kvp = location.search.substr(1).split('&');

   //_log('new key = ' + key +'\nnew value = '+ value +'\nparamètres existants = '+kvp);

   // si l'url est vide de paramètre, alors la fonction ajoute celui donné et recharge la page
   if (kvp == '') {
       location.search = '?' + key + '=' + value;
   }
   // autrement véfifier que le paramètre donné n'est pas déjà présent
   else {

       var i = kvp.length;
       var x;

       while (i--) {
           x = kvp[i].split('=');
           //_log('paramètre existant n°' + i +'\nvaleur = '+ kvp[i]);

           // si c'est le cas avec la même valeur, on dégage
           if ((x[0] == key) && (x[1] == value)) {
               //_log('Le paramètre existe déjà, kassos!!!');
               return;
           }

            // si c'est le cas et contient une autre valeur, la modifier
           else if ((x[0] == key) && (x[1] != value)) {
               //_log('La valeur est différente et sera donc modifiée');
               x[1] = value;
               kvp[i] = x.join('=');
               break;
           }
       }

       // dans tous les cas l'ajouter aux paramètres existants
       if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

       //this will reload the page, it's likely better to store this until finished
       location.search = kvp.join('&');
   }
}
///////////////////////////////////////////////////////////////////////////////
// +++++++++++++++++++++++++++ DOM FUNCTIONS +++++++++++++++++++++++++++++++++
///////////////////////////////////////////////////////////////////////////////

// Retourne un objet HTML à partir de son id (not equal to jquery $('#id')[0])
function $id(id,root_el) {
	if (root_el === undefined) root_el = document;
     return root_el.getElementById(id);
}
// =============================================================================

/* Retourne une liste de nœuds (LIVE NodeList) des éléments trouvés avec la classe spécifiée.
Les classes multiples doivent être séparée par un espace.
[root_el] = option permettant de spécifier l'élément dans lequel rechercher (défaut=document)
ex: $class('rouge test') */
function $class(class_Name,root_el) {
   if (root_el === undefined) root_el = document;
    return root_el.getElementsByClassName(class_Name);
}
// =============================================================================

/* Retourne une liste de nœuds (LIVE NodeList) des éléments trouvés avec la balise spécifiée.
La chaine générique globale '*' est possible, elle représente tous les élements.
[root_el] = option permettant de spécifier l'élément dans lequel rechercher (défaut=document)
ex: $tag('div') */
function $tag(tagName,root_el) {
   if (root_el === undefined) root_el = document;
    return root_el.getElementsByTagName(tagName);
}
/* ============ Fonction raccourci pour les fonctions querySelector =============
aide: http://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall/
fonction plus lente que les fonctions getElementsBy…
* @param CSSele = CSS selector tel que par ex: 'div.class[news="true"]:not([type="checkbox"])'
    		de multiples selecteurs sont possibles en les séparant par une virgule
* @param [extend] = option dont la valeur est 1 (par défaut) ou 0
       1: retourne tous les éléments satisfaisant au sélecteur,
          dans l'ordre dans lequel ils apparaissent dans l'arbre du document (type de retour : STATIC NodeList), ou un tableau NodeList vide si rien n'est trouvé.
       0: retourne le premier élément trouvé satisfaisant au sélecteur (type de retour : Element), ou null si aucun objet correspondant n'est trouvé.
* @param [root_el] = option permettant de spécifier l'élément dans lequel rechercher (défaut=document)
================================================================================*/
function $get(CSSele,extend,root_el) {
   if (root_el === undefined) root_el = document;
   if (extend === undefined) extend = 1;
   if (extend == 1){return root_el.querySelectorAll(CSSele);}
   else if (extend == 0){return root_el.querySelector(CSSele);}
}
// =============================================================================

// remove element from the dom by its id
function delNodeId(id)
{
    return (elem=$id(id)).parentNode.removeChild(elem);
}
// =============================================================================

/* Supprime du dom les éléments avec la classe spécifiée
[root_el] = option permettant de spécifier l'élément dans lequel rechercher (défaut=document)
ex: delNodeClass('rouge',someNodeReference) */
function delNodeClass(class_Name,root_el) {
    if (root_el === undefined) root_el = document;
    elements = root_el.getElementsByClassName(class_Name);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
// =============================================================================

/* Supprimer le premier élément enfant de l'élément donné
ex: delFirstChild(someClassNode[i]) */
function delFirstChild(reference) {
   if (reference){
      reference.removeChild(reference.children[0]);
   } else {
   _log("'"+reference+"' introuvable");
   }
}
// =============================================================================

/* Supprimer tous les éléments enfants de l'élément donné
ex: delAllChild(someClassNode[i]) */
function delAllChild(reference) {
   if (reference.children){
       for(var i = 0; i < reference.children.length; i++) {
          reference.removeChild(reference.children[i]);
       }
   } else {
   _log("Aucun enfant de '"+reference+"' trouvé");
   }
}
// =============================================================================

// Creates a new node with the given attributes, properties and event listeners
function createNode(type, attributes, props, evls) {

    var node = document.createElement(type);

    if (attributes) {
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) node.setAttribute(attr, attributes[attr]);
        }
    }

    if (props) {
        for (var prop in props) {
            if ((props.hasOwnProperty(prop)) && (prop in node)) node[prop] = props[prop];
        }
    }

    if (Array.isArray(evls)) {
        evls.forEach(function(evl) {
            if (Array.isArray(evl)) node.addEventListener.apply(node, evl);
        });
    }
    return node;
}
// =============================================================================

// Get 'Meta' attribute 'content' by selecting 'property' attribute, equivalent to the jquery $("meta[property='og:type']").attr("content");
function GetMetaValue(propname, propname_value, attr) {
    var metaTags = document.getElementsByTagName("meta");
    var counter = 0;
    for (counter; counter < metaTags.length; counter++) {
        //_log(metaTags[counter].getAttribute(propname));

        if (metaTags[counter].getAttribute(propname) == propname_value) {
           return metaTags[counter].getAttribute(attr);
        }
    }
    return "no meta found with this value";
}
///////////////////////////////////////////////////////////////////////////////
// ++++++++++++++++++++++++++ EVENTS FUNCTIONS ++++++++++++++++++++++++++++++
///////////////////////////////////////////////////////////////////////////////

// Ajoute un évenement à l'élément donné
// ex: addEvent($id('player'),'click', play);
function addEvent(element, evnt, funct){
  if (element.attachEvent)
   return element.attachEvent('on'+evnt, funct);
  else
   return element.addEventListener(evnt, funct, false);
}
/* ======================= Wait for elements  ===================================
fonction qui attend l'apparition d'un élément dans le DOM pour lancer une action/fonction
* @param CSSele = CSS selector tel que par ex: 'div.class[news="true"]:not([type="checkbox"])'
    			de multiples selecteurs sont possibles en les séparant par une virgule
* @param action = fonction à lancer quand l'élément est trouvé
* @param [stopLooking] = si l'option est "true", la fonction de recherche s'arrête au premier élément trouvé. Sinon, à chaque élément trouvé l'action est lancée.
source: https://greasyfork.org/fr/scripts/5679-wait-for-elements
================================================================================*/
function waitForElems(CSSele, action, stopLooking) {
  var id = 'fke' + Math.floor(Math.random() * 12345);
  function findElem(CSSele) {
    var found = [].filter.call(document.querySelectorAll(CSSele), function(elem) {
      return elem.dataset[id] !== 'y';
    });
    if(found.length > 0) {
      if(stopLooking) {
        clearInterval(tick);
      }
      found.forEach(function(elem) {
        elem.dataset[id] = 'y';
        action(elem);
      });
    }
  }
  var tick = setInterval(findElem.bind(null, CSSele), 300);
  findElem(CSSele);
  return tick;
}
/* ========================= Wait for URL  ======================================
fonction qui attend une URL précise pour lancer une action/fonction
* @param regex = doit correspondre au site attendu
* @param action = fonction à lancer quand l'URL correspond
* @param [stopLooking] = si l'option est "true", la fonction de recherche s'arrête au premier élément trouvé. Sinon, à chaque élément trouvé l'action est lancée.
source: https://greasyfork.org/fr/scripts/5679-wait-for-elements
================================================================================*/
function waitForUrl(regex, action, stopLooking) {
  function checkUrl(urlTest) {
    var url = window.location.href;
    if(url !== lastUrl && urlTest(url)) {
      if(stopLooking) {
        clearInterval(tick);
      }
      lastUrl = url;
      action();
    }
    lastUrl = url;
  }
  var urlTest = (typeof regex === 'function' ? regex : regex.test.bind(regex)),
      tick = setInterval(checkUrl.bind(null, urlTest), 300),
      lastUrl;
  checkUrl(urlTest);
  return tick;
}
// =============================================================================
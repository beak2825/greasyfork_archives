// ==UserScript==
// @name           Fix-Celestus-Names
// @namespace   	2c7e63c68903f0a8b7
// @description    Corriger problemes interface Celestus
// @version        1.0.0
// @author         Dyum
// @license MIT
// @copyright 2022, Kaced Dyum

// @include     	*horizon.celestus.fr*

// @exclude				*forum.celestus.fr*

// @run-at document-body
// @noframes
// @connect gagn-associates.com
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/446027/Fix-Celestus-Names.user.js
// @updateURL https://update.greasyfork.org/scripts/446027/Fix-Celestus-Names.meta.js
// ==/UserScript==

console.log("Début de chargementdu script.");

var pageJeu = document;

//GM_setValue("Planetes","");
function chargerModifications() {
  /*if (window.top === window.self)
  {
    pageJeu = frames[0].document;
  }
  else
  {
    pageJeu = document;
  }*/

  //Trouve les infobulles et met leur hauteur pour qu'elle soit toujours de la bonne taille.
  var infoBulles = pageJeu.getElementsByClassName("InfoBot");
  for (var i = 0; i < infoBulles.length; i++) {
    if (infoBulles.item(i).getElementsByTagName("div").length > 0) {
      infoBulles.item(i).getElementsByTagName("div").item(0).style.height =
        "100%";
    }
  }

  //On recule un peu la navigation en hauteur
  if (pageJeu.getElementsByClassName("TopNav")[0]) {
    pageJeu.getElementsByClassName("TopNav")[0].style["z-index"] = 10;
  }
  // pageJeu.getElementById('BarreDialogue').onclick=function () {this.style.display='none'};

  var Slide1 = pageJeu.getElementById("CSlide1");
  if (Slide1) {
    var commerce = Slide1.getElementsByClassName("ContenuCommerce");
    if (commerce.length > 0) {
      commerce.item(0).style.overflow = "scroll";
      commerce.item(0).style.height = "90%";
      if (Slide1.getElementsByClassName("ListeT").length > 0) {
        Slide1.getElementsByClassName("ListeT").item(0).remove();
      }
    }
  }

  console.log("Modifications effectuées.");
}

var fenetre;
var dansIframe;
//Détermine si on est dans un frame (jeu) ou dans la page courante (radar, RC, etc.)
if (
  window.top === window.self &&
  (frames[0] || document.getElementsByTagName("frameset").length > 0)
) {
  /*console.log("Pas dans un iframe");
  fenetre = frames[0].window;
  pageJeu = frames[0].document;*/
  dansIframe = false;
} else {
  /*console.log("dans un iframe");
  fenetre = window;
  pageJeu = document;*/
  dansIframe = true;
}
/*if (window.top === window.self)
{
}
else
{
}*/

const mutationObserver = new MutationObserver(function (mutations) {
  this.disconnect();
  //console.log("mutations");
  mutations.forEach(function (mutation) {
    // console.log(mutation);
    switch (mutation.target.id) {
      case "contenu":
        console.log(mutation.target);
        console.log("Début modification contenu.");
        frames[0].Planetes[frames[0].Planete["ID"]] = mergePlanet(
          frames[0].Planete
        );

        GM_setValue("Planetes", JSON.stringify(frames[0].Planetes));
        chargerModifications();
        setTimeout(function () {
          OpenCarteNavCustom();
        }, 400);
        //startObserve();
        // OpenCarteNavCustom();
        break;
      /* case 'BatListeC':
         //console.log(mutation.target);
         mutationObserver.disconnect();
       //setTimeout(function(){chargerBoutonsBats()},250);
       setTimeout(function(){startObserve()},1000);

       break;*/
      case "CSlide1":
        console.log("Début modification slide");
        chargerModifications();
        break;
      case "Menu":
        console.log("menu");
        //console.log(frames[0].Planete);
        frames[0].Planetes[frames[0].Planete["ID"]] = mergePlanet(
          frames[0].Planete
        );
        GM_setValue("Planetes", JSON.stringify(frames[0].Planetes));
        //console.log(GM_getValue("Planetes"));
        //console.log(frames[0].Planetes);
        // setTimeout(function () {
        //   OpenCarteNavCustom(0, 0, 0);
        // }, 1000);
        break;
      default:
    }
  });
  startObserve();
});

function startObserve() {
  /*if (window.top === window.self && (frames[0] || document.getElementsByTagName("frameset").length > 0))
  {
    pageJeu = frames[0].document;
  }
  else
  {
    pageJeu = document;
  }*/
  //console.log(pageJeu);
  mutationObserver.observe(pageJeu.documentElement, {
    //attributes: true,
    //characterData: true,
    childList: true,
    subtree: true,
    //attributeOldValue: true,
    //characterDataOldValue: true
  });
  //console.log("Observateur general ajoute");
  /*if(pageJeu.getElementById("SurfaceCnv")){
    mutationObserver.observe(pageJeu.getElementById("SurfaceCnv"),{
      childList: true,
    subtree: false,
    });
    console.log("Observateur surfacecnv ajoute");
  }*/
  /*if (pageJeu.getElementById("Menu")) {
    mutationObserver.observe(pageJeu.getElementById("Menu"), {
      childList: true,
      subtree: true,
    });
    //console.log("Observateur menu ajoute");
  }*/
}

var convArrToObj = function (array) {
  var thisEleObj = new Object();
  if (typeof array == "object") {
    for (var i in array) {
      var thisEle = convArrToObj(array[i]);
      thisEleObj[i] = thisEle;
    }
  } else {
    thisEleObj = array;
  }
  return thisEleObj;
};

function mergePlanet(objPlanete) {
  var mergedPlanet;
  if (
    frames[0].Planetes[objPlanete["ID"]] &&
    Object.keys(frames[0].Planetes[objPlanete["ID"]]).length > 1
  ) {
    mergedPlanet = convArrToObj(frames[0].Planetes[objPlanete["ID"]]);
    Object.keys(frames[0].Planetes[objPlanete["ID"]]).forEach(function (
      key,
      index
    ) {
      mergedPlanet[key] = objPlanete[key]
        ? convArrToObj(objPlanete[key])
        : mergedPlanet[key]
        ? mergedPlanet[key]
        : "";
    });
    Object.keys(objPlanete).forEach(function (key, index) {
      mergedPlanet[key] = objPlanete[key]
        ? convArrToObj(objPlanete[key])
        : mergedPlanet[key]
        ? mergedPlanet[key]
        : "";
    });
  } else {
    mergedPlanet = convArrToObj(objPlanete);
  }

  return mergedPlanet;
}

function OpenCarteNavCustom(c, r, s) {
  var Contenu = "";

  var ListeG = frames[0].Joueur["GConnues"].split(";");
  const ama = frames[0].Amas;
  const celestusMap = new Map();

  celestusMap.set(1, "Aelron");
  celestusMap.set(2, "Varden");
  celestusMap.set(3, "Dareyn");
  celestusMap.set(4, "Verdon");
  celestusMap.set(99, "Elendyr");
  celestusMap.set(101, "Oli");
  celestusMap.set(104, "Onkhehlor");
  celestusMap.set(112, "Onkaril");
  celestusMap.set(120, "Nahr");
  celestusMap.set(121, "Vortex Inglorium");
  celestusMap.set(122, "Nuenan");
  celestusMap.set(124, "Aelan");
  celestusMap.set(125, "Norah");
  celestusMap.set(126, "Manr");
  celestusMap.set(128, "Namrae");
  celestusMap.set(131, "Oydan");
  celestusMap.set(132, "Comptes Secrets de la Pègre");
  celestusMap.set(133, "Naelior");
  celestusMap.set(135, "Rosnoskhio");
  celestusMap.set(144, "Ahkemkh");
  celestusMap.set(146, "Iantos");

  for (x in ama) {
    if (x > 100) {
      for (var i = 0; i < ListeG.length; i++) {
        if (x + ":1" == ListeG[i]) {
          Contenu +=
            '<option value="' +
            x +
            '">' +
            celestusMap.get(parseInt(x)) +
            "(" +
            x +
            ")" +
            "</option>";
        }
      }
    } else if (x == 99) {
      if (frames[0].Planete["AG"] == 99) {
        Contenu += '<option value="' + x + '">' + ama[x] + "</option>";
      }
    } else {
      Contenu += '<option value="' + x + '">' + ama[x] + "</option>";
    }
  }

  // Contenu +=
  //   '<input type="text" id="URegion" name="Region" class="ChampUnivers" value="' +
  //   valRegion +
  //   '"/>';
  // Contenu +=
  //   '<input type="text" id="USysteme" name="Systeme" class="ChampUnivers" value="' +
  //   valSysteme +
  //   '"/>';
  // Contenu += '<input type="submit" value="Valider" class="Next1"/>';
  const currentCadran = frames[0].Sys["Data"]?.["AG"];
  console.log(currentCadran);
  if (pageJeu.getElementById("UCadran") != undefined) {
    pageJeu.getElementById("UCadran").innerHTML = Contenu;
    if (currentCadran != undefined) {
      pageJeu.getElementById("UCadran").value = currentCadran;
    }
  }
  // if (pageJeu.getElementById("UCadran") != undefined) {
  //   pageJeu.getElementById("UCadran").value = valCadran;
  // }
}

if (dansIframe) {
  console.log("Page secondaire détectée.");
  fenetre = window;
  pageJeu = document;
  fenetre.Planetes = GM_getValue("Planetes")
    ? JSON.parse(GM_getValue("Planetes"))
    : [];
  chargerModifications();
  startObserve();
} else {
  console.log("Page jeu principal détectée.");
  //fenetre = frames[0].window;
  //pageJeu = frames[0].document;
  //startObserve();
  setTimeout(function () {
    fenetre = frames[0].window;
    pageJeu = frames[0].document;
    fenetre.Planetes = GM_getValue("Planetes")
      ? JSON.parse(GM_getValue("Planetes"))
      : [];
    //console.log(fenetre.Planetes);
    chargerModifications();
    startObserve();
  }, 10000);
}

//}

//frames[0].$("#contenu").bind("DOMSubtreeModified",function(){console.log("syncProd")});

//delegate

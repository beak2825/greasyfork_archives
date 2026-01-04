// ==UserScript==
// @name         JVCaste Prenium
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Masque les posts par niveau selon vos critères
// @author       Delawarde
// @match          http://*.jeuxvideo.com/forums/1*
// @match          https://*.jeuxvideo.com/forums/1*
// @match          http://*.jeuxvideo.com/forums/42*
// @match          https://*.jeuxvideo.com/forums/42*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461890/JVCaste%20Prenium.user.js
// @updateURL https://update.greasyfork.org/scripts/461890/JVCaste%20Prenium.meta.js
// ==/UserScript==

/*ce script permet de masquer les golems de niveau inférieur à 10
en un bouton, vous pouvez également les ré-afficher, puis les re-masquer
le choix est conservé entre les différentes pages, et même après avoir fermé la fenêtre
Ce script est basé sur mon ancien script JVCercle, certains élements ne sont donc pas nommés correctement, j'ai fait ça en despi*/

var niveauelite = "Niveau 10" //future MAJ : niveau dynamique en fonction de ton pseudo
var current = 0
var init = 0
var affichage = 0

 $(".bloc-outils-top > .bloc-pre-right").append(
     "<button id=\"btn-golem\">Désactiver le filtre");
var btn = document.getElementById('btn-golem');
btn.addEventListener('click', afficherGolem); //on créé un bouton pour afficher les golems

$(".bloc-outils-top > .bloc-pre-right").append(
     "<button id=\"btn-nogolem\">Activer le filtre");
    var btndeux = document.getElementById('btn-nogolem');
    btndeux.addEventListener('click', masquerGolem); //on créé un bouton pour masquer les golems

let filterState = localStorage.getItem('filtre') || '+';

$('.bloc-outils-top').append('<button id="filter-btn">   </button>');

let filterBtn = document.getElementById('filter-btn');
filterBtn.textContent = filterState === '+' ? ' MIN ' : (filterState === '-' ? ' MAX ' : ' ÉGAL ');

filterBtn.addEventListener('click', function() {
  if (filterState === '+') {
    filterState = '-';
    filterBtn.textContent = ' MAX ';
    localStorage.setItem('filtre', filterState);
  } else if (filterState === '-') {
    filterState = '=';
    filterBtn.textContent = ' ÉGAL ';
    localStorage.setItem('filtre', filterState);
  } else {
    filterState = '+';
    filterBtn.textContent = ' MIN ';
    localStorage.setItem('filtre', filterState);
  }
});

function getFilterText(filterState) {
  if (filterState === '+') {
    return ' MIN ';
  } else if (filterState === '-') {
    return ' MAX ';
  } else {
    return ' ÉGAL ';
  }
}


affichage = localStorage.getItem("affichage"); //on récupère le choix de masquer/afficher
if (affichage == 0) {
   btndeux.style.display = 'none'
   btn.style.display = 'block'
}
 else {
   btndeux.style.display = 'block'
   btn.style.display = 'none'
 }

if (init === 0) {
    init = init+1;
    filterState = localStorage.getItem("affichage");
     if (affichage == 0) {
        masquerGolem(); //si le choix était de masquer, alors masquer
     }
     if (affichage == 1) {
        afficherGolem(); //si le choix était d'afficher, alors afficher
     }

}

// Create the level filter dropdown
var levelFilterDropdown = document.createElement("select");
levelFilterDropdown.id = "levelFilterDropdown";

// Create the options for the level filter dropdown
var optionDefault = document.createElement("option");
optionDefault.text = "Niveau du filtre";
optionDefault.disabled = true;
optionDefault.selected = true;
levelFilterDropdown.add(optionDefault);

for (var i = 1; i <= 10; i++) {
  var option = document.createElement("option");
  option.value = "Niveau " + i;
  option.text = "Niveau " + i;
  levelFilterDropdown.add(option);
}

// Add the level filter dropdown to the page
var toolsTop = document.querySelector(".bloc-outils-top");
toolsTop.appendChild(levelFilterDropdown);

// Add an event listener to the level filter dropdown
levelFilterDropdown.addEventListener("change", function() {
  var levelToHide = this.value;
  localStorage.setItem("levelToHide", levelToHide);
  location.reload();
});

function masquerGolem() {
  filterState = localStorage.getItem('filtre') || '+';
  getFilterText();
  var posts = document.querySelectorAll('.bloc-message-forum');
  var levelToHide = localStorage.getItem("levelToHide");
  btndeux.style.display = 'none';
  btn.style.display = 'block';
  for (var i = 0; i < posts.length; i++) {
    var levelElement = posts[i].querySelector('.bloc-user-level.text-muted');
    var level = levelElement.innerHTML.trim();
    var levelColor;
    switch(level) {
      case "Niveau 1":
        levelColor = "#ff0000";
        break;
      case "Niveau 2":
        levelColor = "#ff5500";
        break;
      case "Niveau 3":
        levelColor = "#ff9900";
        break;
      case "Niveau 4":
        levelColor = "#ffd000";
        break;
      case "Niveau 5":
        levelColor = "#ddff00";
        break;
      case "Niveau 6":
        levelColor = "#a2ff00";
        break;
      case "Niveau 7":
        levelColor = "#00ff95";
        break;
      case "Niveau 8":
        levelColor = "#00eaff";
        break;
      case "Niveau 9":
        levelColor = "#0091ff";
        break;
      default:
        levelColor = "#2b00ff";
    }
var levelNum = parseInt(level.replace(/\D/g,'')); // extract the number from level
var levelToHideNum = parseInt(levelToHide.replace(/\D/g,'')); // extract the number from levelToHide
if (level && levelToHide) {
  if (levelNum === levelToHideNum) {
    // Display posts with the same level as the hidden level
      posts[i].style.display = 'block';
      var band = posts[i].previousSibling;
      posts[i].parentNode.insertBefore(band, posts[i]);
  } else if (levelNum < levelToHideNum) {
    // Display posts with a level greater than the hidden level
    if (filterState.includes('+')) {
      posts[i].style.display = 'none';
      band = document.createElement('div');
      band.className = 'hidden-msg';
      band.innerHTML = "Post d'un khey de <span style='color:" + levelColor + "'>" + level + "</span> <button class='show-msg'>Afficher</button>";
      posts[i].parentNode.insertBefore(band, posts[i]);
    } else if (filterState.includes('=')) {
       posts[i].style.display = 'none';
      band = document.createElement('div');
      band.className = 'hidden-msg';
      band.innerHTML = "Post d'un khey de <span style='color:" + levelColor + "'>" + level + "</span> <button class='show-msg'>Afficher</button>";
      posts[i].parentNode.insertBefore(band, posts[i]);
    } else {
      posts[i].style.display = 'block';
      band = posts[i].previousSibling;
      posts[i].parentNode.insertBefore(band, posts[i]);
    }
  } else {
    // Display posts with a level lower than the hidden level
    if (filterState.includes('-')) {
      posts[i].style.display = 'none';
      band = document.createElement('div');
      band.className = 'hidden-msg';
      band.innerHTML = "Post d'un khey de <span style='color:" + levelColor + "'>" + level + "</span> <button class='show-msg'>Afficher</button>";
      posts[i].parentNode.insertBefore(band, posts[i]);
    } else if (filterState.includes('=')) {
       posts[i].style.display = 'none';
      band = document.createElement('div');
      band.className = 'hidden-msg';
      band.innerHTML = "Post d'un khey de <span style='color:" + levelColor + "'>" + level + "</span> <button class='show-msg'>Afficher</button>";
      posts[i].parentNode.insertBefore(band, posts[i]);
    } else {
      posts[i].style.display = 'block';
      band = posts[i].previousSibling;
      posts[i].parentNode.insertBefore(band, posts[i]);
    }
  }
} else {
  // Display all posts if no level is hidden
  posts[i].style.display = 'block';
  band = posts[i].previousSibling;
  if (band && band.className == 'hidden-msg') {
    band.parentNode.removeChild(band);
  }
}
  }
  affichage = 0;
  localStorage.setItem("affichage", affichage);
  var showButtons = document.querySelectorAll('.show-msg');
  for (var j = 0; j < showButtons.length; j++) {
    showButtons[j].addEventListener('click', afficherMsg);
  }
}

function afficherGolem() { //afficher les posts des golems
  var posts = document.querySelectorAll('.bloc-message-forum');
  btndeux.style.display = 'block';
  btn.style.display = 'none';
  for (var i = 0; i < posts.length; i++) {
    var level = posts[i].querySelector('.bloc-user-level.text-muted').innerHTML;
    if (level && level.includes('Niveau 10')) {
      posts[i].style.display = 'block'
    } else {
      posts[i].style.display = 'block'
      var band = posts[i].previousSibling
      if (band && band.className == 'hidden-msg') {
        band.parentNode.removeChild(band)
      }
    }
  }
  affichage = 1;
  localStorage.setItem("affichage", affichage); //on se rappelle du choix effectué
}

function afficherMsg() { //afficher le message caché
  var msg = this.parentNode;
  var post = msg.nextSibling;
  msg.parentNode.removeChild(msg);
  post.style.display = 'block';
}
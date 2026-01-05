'use strict';
// ==UserScript==
// @name         NoseTime Tweak
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  Set of tweaks for NoseTime.
// @author       Nb/Kevin
// @match        http://www.nosetime.com/*
// @match        https://www.nosetime.com/*
// @grant        GM_xmlhttpRequest
// @connect      fragrantica.com
// @downloadURL https://update.greasyfork.org/scripts/24586/NoseTime%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/24586/NoseTime%20Tweak.meta.js
// ==/UserScript==
/**
 * Create an element from HTML string.
 * @param htmlString {String} HTML string.
 * @return {HTMLElement} The element.
 */
function createElementFromHTML(htmlString) {
  var templateElement = document.createElement('template');
  templateElement.innerHTML = htmlString;
  return templateElement.content.firstChild;
}/**
 * Convert a node list to array.
 * @returns {Array.<HTMLElement>}
 */

NodeList.prototype.toArray = function () {
  var that = this;
  return Array.prototype.slice.call(that);
};
/**
 * Query one element.
 * @returns {Node}
 */
String.prototype.query = function () {
  var that = this;
  return document.querySelector(that);
};
/**
 * Query elements.
 * @returns {NodeList}
 */
String.prototype.queryAll = function () {
  var that = this;
  return document.querySelectorAll(that);
};
/**
 * Query elements.
 * @returns {boolean}
 */
String.prototype.contains = function (target) {
  var that = this;
  return that.indexOf(target) != - 1;
};
/**
 * Log something.
 */
String.prototype.log = function () {
  var that = this;
  console.log('NTTweak@ ' + that);
};
/**
 * Get the last element in the array.
 */
Array.prototype.last = function () {
  var length = this.length;
  return this[length - 1];
};
/**
 * LT & TS rating data.
 */
var RATINGS = [
  {
    'rating': 5,
    'name': 'Amouage Amouage Gold'
  },
  {
    'rating': 5,
    'name': 'Azzaro Azzaro pour Homme'
  },
  {
    'rating': 5,
    'name': 'Badgley Mischka Badgley Mischka'
  },
  {
    'rating': 5,
    'name': 'Bond No. 9 Chinatown'
  },
  {
    'rating': 5,
    'name': 'Bulgari Black'
  },
  {
    'rating': 5,
    'name': 'Cacharel Loulou'
  },
  {
    'rating': 5,
    'name': 'Caldey Island Lavender'
  },
  {
    'rating': 5,
    'name': 'Caron Le Troisieme Homme'
  },
  {
    'rating': 5,
    'name': 'Caron Pour un Homme'
  },
  {
    'rating': 5,
    'name': 'Caron Yatagan'
  },
  {
    'rating': 5,
    'name': 'Chanel 31 Rue Cambon - LT'
  },
  {
    'rating': 5,
    'name': 'Chanel Bois des Iles'
  },
  {
    'rating': 5,
    'name': 'Chanel Cristalle'
  },
  {
    'rating': 5,
    'name': 'Chanel Cuir de Russie'
  },
  {
    'rating': 5,
    'name': 'Chanel No. 5 eau de toilette'
  },
  {
    'rating': 5,
    'name': 'Chanel No. 5 parfum'
  },
  {
    'rating': 5,
    'name': 'Chanel Pour Monsieur'
  },
  {
    'rating': 5,
    'name': 'Clinique Aromatics Elixir'
  },
  {
    'rating': 5,
    'name': 'Davidoff Cool Water'
  },
  {
    'rating': 5,
    'name': 'Dior Dior Homme'
  },
  {
    'rating': 5,
    'name': 'Diorella'
  },
  {
    'rating': 5,
    'name': 'Dior Dune'
  },
  {
    'rating': 5,
    'name': 'Dior Poison'
  },
  {
    'rating': 5,
    'name': 'Elternhaus MoslBuddJewChristHinDao'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Azuree'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Beyond Paradise'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Beyond Paradise Men'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Knowing'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Pleasures'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder Private Collection'
  },
  {
    'rating': 5,
    'name': 'Estee Lauder White Linen'
  },
  {
    'rating': 5,
    'name': 'Etat Libre d\'Orange Secretions Magnifiques'
  },
  {
    'rating': 5,
    'name': 'Geoffrey Beene Grey Flannel'
  },
  {
    'rating': 5,
    'name': 'Givenchy Givenchy III'
  },
  {
    'rating': 5,
    'name': 'Givenchy Insense'
  },
  {
    'rating': 5,
    'name': 'Gucci Envy'
  },
  {
    'rating': 5,
    'name': 'Gucci Rush'
  },
  {
    'rating': 5,
    'name': 'Guerlain Apres l\'Ondee'
  },
  {
    'rating': 5,
    'name': 'Guerlain Chamade'
  },
  {
    'rating': 5,
    'name': 'Guerlain Derby'
  },
  {
    'rating': 5,
    'name': 'Guerlain Eau de Guerlain'
  },
  {
    'rating': 5,
    'name': 'Guerlain Habit Rouge'
  },
  {
    'rating': 5,
    'name': 'Guerlain Jicky'
  },
  {
    'rating': 5,
    'name': 'Guerlain L\'Heure Bleue'
  },
  {
    'rating': 5,
    'name': 'Guerlain Mitsouko'
  },
  {
    'rating': 5,
    'name': 'Guerlain Nahema'
  },
  {
    'rating': 5,
    'name': 'Guerlain Shalimar'
  },
  {
    'rating': 5,
    'name': 'Guerlain Vol de Nuit'
  },
  {
    'rating': 5,
    'name': 'Hermes Osmanthe Yunnan'
  },
  {
    'rating': 5,
    'name': 'Issey Miyake Le Feu d\'Issey'
  },
  {
    'rating': 5,
    'name': 'Jean Patou Joy parfum'
  },
  {
    'rating': 5,
    'name': 'Kenzo Ca Sent Beau'
  },
  {
    'rating': 5,
    'name': 'L\'Aritsan Parfumeur Dzing!'
  },
  {
    'rating': 5,
    'name': 'L\'Aritsan Parfumeur Timbuktu'
  },
  {
    'rating': 5,
    'name': 'L\'Aritsan Parfumeur Vanilia'
  },
  {
    'rating': 5,
    'name': 'Le Labo Patchouli 24'
  },
  {
    'rating': 5,
    'name': 'Lolita Lempicka Lolita Lempicka'
  },
  {
    'rating': 5,
    'name': 'Missoni Missoni'
  },
  {
    'rating': 5,
    'name': 'Ormonde Jayne Ormonde Man'
  },
  {
    'rating': 5,
    'name': 'Ormonde Jayne Ormonde Woman'
  },
  {
    'rating': 5,
    'name': 'Paco Rabanne Calandre'
  },
  {
    'rating': 5,
    'name': 'Parfums de Nicolai Le Temps d\'une Fete'
  },
  {
    'rating': 5,
    'name': 'Parfums de Nicolai New York'
  },
  {
    'rating': 5,
    'name': 'Parfums de Nicolai Odalisque'
  },
  {
    'rating': 5,
    'name': 'Parfums MDCI Enlevement au Serail'
  },
  {
    'rating': 5,
    'name': 'Parfums MDCI Invasion Barbare'
  },
  {
    'rating': 5,
    'name': 'Parfums MDCI Promesse de l\'Aube'
  },
  {
    'rating': 5,
    'name': 'Pascal Morabito Or Black'
  },
  {
    'rating': 5,
    'name': 'Prescriptives Calyx'
  },
  {
    'rating': 5,
    'name': 'Robert Piguet Bandit'
  },
  {
    'rating': 5,
    'name': 'Robert Piguet Fracas'
  },
  {
    'rating': 5,
    'name': 'Rochas Tocade'
  },
  {
    'rating': 5,
    'name': 'Serge Lutens Bois de Violette'
  },
  {
    'rating': 5,
    'name': 'Serge Lutens Iris Silver Mist'
  },
  {
    'rating': 5,
    'name': 'Serge Lutens La Myrrhe'
  },
  {
    'rating': 5,
    'name': 'Serge Lutens Sarrasins'
  },
  {
    'rating': 5,
    'name': 'S-Perfume 100% Love'
  },
  {
    'rating': 5,
    'name': 'S-Perfume S-eX'
  },
  {
    'rating': 5,
    'name': 'Tauer Perfumes L\'Air du Desert Marocain'
  },
  {
    'rating': 5,
    'name': 'Theo Fennell Scent'
  },
  {
    'rating': 5,
    'name': 'Thierry Mugler Angel'
  },
  {
    'rating': 5,
    'name': 'Tommy Hilfiger Tommy Girl'
  },
  {
    'rating': 5,
    'name': 'Yohji Yamamoto Yohji Homme'
  },
  {
    'rating': 5,
    'name': 'Yves Saint Laurent Kouros'
  },
  {
    'rating': 5,
    'name': 'Yves Saint Laurent Opium'
  },
  {
    'rating': 5,
    'name': 'Yves Saint Laurent Rive Gauche'
  },
  {
    'rating': 4,
    'name': 'Acqua di Parma Acqua di Parma Colonia Assoluta'
  },
  {
    'rating': 4,
    'name': 'Acqua di Parma Iris Nobile'
  },
  {
    'rating': 4,
    'name': 'Aesop Marrakech'
  },
  {
    'rating': 4,
    'name': 'Aesop Mystra'
  },
  {
    'rating': 4,
    'name': 'Agent Provocateur Agent Provocateur Strip'
  },
  {
    'rating': 4,
    'name': 'Amouage Amouage Gold for Men'
  },
  {
    'rating': 4,
    'name': 'Amouage Ciel pour Homme'
  },
  {
    'rating': 4,
    'name': 'Amouage Dia pour Femme'
  },
  {
    'rating': 4,
    'name': 'Amouage Dia pour Homme'
  },
  {
    'rating': 4,
    'name': 'Amouage Jubilation 25'
  },
  {
    'rating': 4,
    'name': 'Amouage Jubilation XXV'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Eau de Monsieur'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Eau du Fier'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Heure Exquise'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal La Violette'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Passion'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Quel Amour!'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Songes'
  },
  {
    'rating': 4,
    'name': 'Annick Goutal Vetiver'
  },
  {
    'rating': 4,
    'name': 'Aramis Aramis'
  },
  {
    'rating': 4,
    'name': 'Aramis Tuscany per Donna'
  },
  {
    'rating': 4,
    'name': 'Aramis Tuscany per Uomo'
  },
  {
    'rating': 4,
    'name': 'Armani Prive Ambre Soie'
  },
  {
    'rating': 4,
    'name': 'Armani Prive Bois d\'Encens'
  },
  {
    'rating': 4,
    'name': 'Azzaro Azzaro Men Now'
  },
  {
    'rating': 4,
    'name': 'Azzaro Azzaro Women Now'
  },
  {
    'rating': 4,
    'name': 'Badgley Mischka Fleurs de Nuit'
  },
  {
    'rating': 4,
    'name': 'Balmain Ivoire'
  },
  {
    'rating': 4,
    'name': 'Balmain Miss Balmain'
  },
  {
    'rating': 4,
    'name': 'Balmain Monsieur Balmain'
  },
  {
    'rating': 4,
    'name': 'Bond No. 9 Broadway Nite'
  },
  {
    'rating': 4,
    'name': 'Bond No. 9 Fire Island'
  },
  {
    'rating': 4,
    'name': 'Bond No. 9 Great Jones'
  },
  {
    'rating': 4,
    'name': 'Bond No. 9 H.O.T. Always'
  },
  {
    'rating': 4,
    'name': 'Boucheron Boucheron Eau Legere'
  },
  {
    'rating': 4,
    'name': 'Boucheron Jaipur'
  },
  {
    'rating': 4,
    'name': 'Bulgari pour Femme'
  },
  {
    'rating': 4,
    'name': 'Bulgari Eau Parfumee au The Vert'
  },
  {
    'rating': 4,
    'name': 'By Kilian A Taste of Heaven'
  },
  {
    'rating': 4,
    'name': 'By Kilian Beyond Love'
  },
  {
    'rating': 4,
    'name': 'By Kilian Liaisons Dangereuses'
  },
  {
    'rating': 4,
    'name': 'By Kilian Love'
  },
  {
    'rating': 4,
    'name': 'Cacharel Anais Anais'
  },
  {
    'rating': 4,
    'name': 'Cacharel Eden'
  },
  {
    'rating': 4,
    'name': 'Cacharel Noa'
  },
  {
    'rating': 4,
    'name': 'Calvin Klein cK One'
  },
  {
    'rating': 4,
    'name': 'Calvin Klein Contradiction for Men'
  },
  {
    'rating': 4,
    'name': 'Calvin Klein Truth'
  },
  {
    'rating': 4,
    'name': 'Carolina Herrera Carolina Herrera'
  },
  {
    'rating': 4,
    'name': 'Caron Aimez Moi'
  },
  {
    'rating': 4,
    'name': 'Caron Impact'
  },
  {
    'rating': 4,
    'name': 'Caron Nuit de Noel'
  },
  {
    'rating': 4,
    'name': 'Caron Parfum Sacre'
  },
  {
    'rating': 4,
    'name': 'Carthusia Aria di Capri'
  },
  {
    'rating': 4,
    'name': 'Cartier Declaration'
  },
  {
    'rating': 4,
    'name': 'Cartier Declaration Essence'
  },
  {
    'rating': 4,
    'name': 'Cartier Eau de Cartier'
  },
  {
    'rating': 4,
    'name': 'Cartier Must de Cartier pour Homme'
  },
  {
    'rating': 4,
    'name': 'Cartier So Pretty'
  },
  {
    'rating': 4,
    'name': 'Cerruti Cerruti 1881'
  },
  {
    'rating': 4,
    'name': 'Chanel 28 La Pausa'
  },
  {
    'rating': 4,
    'name': 'Chanel 31 Rue Cambon - TS'
  },
  {
    'rating': 4,
    'name': 'Chanel Antaeus'
  },
  {
    'rating': 4,
    'name': 'Chanel Bel Respiro'
  },
  {
    'rating': 4,
    'name': 'Chanel Coco'
  },
  {
    'rating': 4,
    'name': 'Chanel Coco Mademoiselle'
  },
  {
    'rating': 4,
    'name': 'Chanel Cologne'
  },
  {
    'rating': 4,
    'name': 'Chanel Coromandel'
  },
  {
    'rating': 4,
    'name': 'Chanel Egoiste'
  },
  {
    'rating': 4,
    'name': 'Chanel No. 18'
  },
  {
    'rating': 4,
    'name': 'Chanel No. 19'
  },
  {
    'rating': 4,
    'name': 'Chanel No. 22'
  },
  {
    'rating': 4,
    'name': 'Chanel No. 5 eau de parfum'
  },
  {
    'rating': 4,
    'name': 'Chopard Casmir'
  },
  {
    'rating': 4,
    'name': 'Clarins Par Amour'
  },
  {
    'rating': 4,
    'name': 'Clarins Par Amour Toujours'
  },
  {
    'rating': 4,
    'name': 'Clive Christian X for Women'
  },
  {
    'rating': 4,
    'name': 'Comme des Garcons Bijou'
  },
  {
    'rating': 4,
    'name': 'Comme des Garcons Comme des Garcons 2 Man'
  },
  {
    'rating': 4,
    'name': 'Comme des Garcons Comme des Garcons 2 Woman'
  },
  {
    'rating': 4,
    'name': 'Comme des Garcons Comme des Garcons 3'
  },
  {
    'rating': 4,
    'name': 'Comme des Garcons Odeur 71'
  },
  {
    'rating': 4,
    'name': 'Creed Green Irish Tweed'
  },
  {
    'rating': 4,
    'name': 'Diesel Fuel for Life'
  },
  {
    'rating': 4,
    'name': 'Diesel Fuel for Life Men'
  },
  {
    'rating': 4,
    'name': 'Dior Cologne Blanche'
  },
  {
    'rating': 4,
    'name': 'Dior Dior Homme Intense'
  },
  {
    'rating': 4,
    'name': 'Dioressence'
  },
  {
    'rating': 4,
    'name': 'Diorissimo'
  },
  {
    'rating': 4,
    'name': 'Dior Dune pour Homme'
  },
  {
    'rating': 4,
    'name': 'Dior Eau Fraiche'
  },
  {
    'rating': 4,
    'name': 'Dior Eau Noire'
  },
  {
    'rating': 4,
    'name': 'Dior Eau Savage'
  },
  {
    'rating': 4,
    'name': 'Dior Fahrenheit 32'
  },
  {
    'rating': 4,
    'name': 'Dior Hypnotic Poison'
  },
  {
    'rating': 4,
    'name': 'Dior J\'Adore l\'Absolu'
  },
  {
    'rating': 4,
    'name': 'Dior Jules'
  },
  {
    'rating': 4,
    'name': 'Dior Miss Dior Cherie'
  },
  {
    'rating': 4,
    'name': 'Dior Pure Poison'
  },
  {
    'rating': 4,
    'name': 'Diptyque L\'Autre'
  },
  {
    'rating': 4,
    'name': 'Diptyque L\'Eau'
  },
  {
    'rating': 4,
    'name': 'Diptyque Olene'
  },
  {
    'rating': 4,
    'name': 'Diptyque Oyedo'
  },
  {
    'rating': 4,
    'name': 'Diptyque Philosykos'
  },
  {
    'rating': 4,
    'name': 'Diptyque Virgilio'
  },
  {
    'rating': 4,
    'name': 'Divine Divine'
  },
  {
    'rating': 4,
    'name': 'Divine L\'Homme de Coeur'
  },
  {
    'rating': 4,
    'name': 'Divine L\'Infante'
  },
  {
    'rating': 4,
    'name': 'Donna Karan DKNY Women'
  },
  {
    'rating': 4,
    'name': 'Donna Karan Donna Karan Gold'
  },
  {
    'rating': 4,
    'name': 'Eau d\'Italie Paestum Rose'
  },
  {
    'rating': 4,
    'name': 'Ermenegildo Zegna Essenza di Zegna'
  },
  {
    'rating': 4,
    'name': 'Ermenegildo Zegna Z Zegna'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Alliage'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Beautiful'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Beyond Paradise Blue'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Cinnabar'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Dazzling Silver'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Lauder for Men'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Private Collection Tuberose Gardenia'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Pure White Linen'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Youth Dew'
  },
  {
    'rating': 4,
    'name': 'Estee Lauder Youth Dew Amber Nude'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Antiheros'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Eloge du Traitre'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Encens et Bubblegum'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Jasmin et Cigarette'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Je Suis un Homme'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Rien'
  },
  {
    'rating': 4,
    'name': 'Etat Libre d\'Orange Vraie Blonde'
  },
  {
    'rating': 4,
    'name': 'Etro Anice'
  },
  {
    'rating': 4,
    'name': 'Etro Messe de Minuit'
  },
  {
    'rating': 4,
    'name': 'Etro Palais Jamais'
  },
  {
    'rating': 4,
    'name': 'Etro Shaal Nur'
  },
  {
    'rating': 4,
    'name': 'Etro Vetiver'
  },
  {
    'rating': 4,
    'name': 'Fendi Palazzo'
  },
  {
    'rating': 4,
    'name': 'Floris No. 89'
  },
  {
    'rating': 4,
    'name': 'Fragonard Cologne Grand Luxe'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Carnal Flower'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Le Parfum de Therese'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle L\'Eau d\'Hiver'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Lys Mediterranee'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Noir Epices'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Outrageous'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Une Fleur de Cassie'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Une Rose'
  },
  {
    'rating': 4,
    'name': 'Frederic Malle Vetiver Extraordinaire'
  },
  {
    'rating': 4,
    'name': 'Gianfranco Ferre Ferre'
  },
  {
    'rating': 4,
    'name': 'Givenchy Le De'
  },
  {
    'rating': 4,
    'name': 'Givenchy L\'Interdit'
  },
  {
    'rating': 4,
    'name': 'Givenchy Monsieur de Givenchy'
  },
  {
    'rating': 4,
    'name': 'Givenchy Organza'
  },
  {
    'rating': 4,
    'name': 'Givenchy Organza Indecence'
  },
  {
    'rating': 4,
    'name': 'Givenchy Vetyver'
  },
  {
    'rating': 4,
    'name': 'Gucci Gucci Eau de Parfum II'
  },
  {
    'rating': 4,
    'name': 'Gucci Gucci pour Homme'
  },
  {
    'rating': 4,
    'name': 'Guerlain Aqua Allegoria Pamplelune'
  },
  {
    'rating': 4,
    'name': 'Guerlain Attrape-Coeurs'
  },
  {
    'rating': 4,
    'name': 'Guerlain Candide Effluve'
  },
  {
    'rating': 4,
    'name': 'Guerlain Chant d\'Aromes'
  },
  {
    'rating': 4,
    'name': 'Guerlain Eau de Cologne du Coq'
  },
  {
    'rating': 4,
    'name': 'Guerlain Eau de Cologne Imperiale'
  },
  {
    'rating': 4,
    'name': 'Guerlain Eau de Fleurs de Cedrat'
  },
  {
    'rating': 4,
    'name': 'Guerlain Heritage'
  },
  {
    'rating': 4,
    'name': 'Guerlain Insolence'
  },
  {
    'rating': 4,
    'name': 'Guerlain L\'Instant'
  },
  {
    'rating': 4,
    'name': 'Guerlain L\'Instant pour Homme'
  },
  {
    'rating': 4,
    'name': 'Guerlain Mouchoir de Monsieur'
  },
  {
    'rating': 4,
    'name': 'Guerlain Plus Que Jamais'
  },
  {
    'rating': 4,
    'name': 'Guerlain Quand Vient la Pluie'
  },
  {
    'rating': 4,
    'name': 'Guerlain Samsara'
  },
  {
    'rating': 4,
    'name': 'Guerlain Sous le Vent'
  },
  {
    'rating': 4,
    'name': 'Guerlain Vetiver'
  },
  {
    'rating': 4,
    'name': 'Guerlain Vetiver pour Elle'
  },
  {
    'rating': 4,
    'name': 'Halston Halston Z-14'
  },
  {
    'rating': 4,
    'name': 'Hanae Mori Hanae Mori Butterfly'
  },
  {
    'rating': 4,
    'name': 'Hermes 24 Faubourg'
  },
  {
    'rating': 4,
    'name': 'Hermes Bel-Ami'
  },
  {
    'rating': 4,
    'name': 'Hermes Concentre d\'Orange Verte'
  },
  {
    'rating': 4,
    'name': 'Hermes Eau d\'Hermes'
  },
  {
    'rating': 4,
    'name': 'Hermes Eau d\'Orange Verte'
  },
  {
    'rating': 4,
    'name': 'Hermes Equipage'
  },
  {
    'rating': 4,
    'name': 'Institut Tres Bien Cologne a la Francaise'
  },
  {
    'rating': 4,
    'name': 'Institut Tres Bien Cologne a la Russe'
  },
  {
    'rating': 4,
    'name': 'Institut Tres Bien Cologne a l\'Italienne'
  },
  {
    'rating': 4,
    'name': 'Institut Tres Bien Tres Russe'
  },
  {
    'rating': 4,
    'name': 'Jean Patou 1000'
  },
  {
    'rating': 4,
    'name': 'Jean Patou Joy eau de parfum'
  },
  {
    'rating': 4,
    'name': 'Jean Patou Sira des Indes'
  },
  {
    'rating': 4,
    'name': 'Jean-Charles Brosseau Ombre Rose (L\'Original)'
  },
  {
    'rating': 4,
    'name': 'Jo Malone Lime Basil & Mandarin Cologne'
  },
  {
    'rating': 4,
    'name': 'Jovan Sex Appeal for Men'
  },
  {
    'rating': 4,
    'name': 'Juicy Couture Juicy Couture'
  },
  {
    'rating': 4,
    'name': 'Keiko Mecheri Mogador'
  },
  {
    'rating': 4,
    'name': 'Keiko Mecheri Peau de Peche'
  },
  {
    'rating': 4,
    'name': 'Kenzo Flower'
  },
  {
    'rating': 4,
    'name': 'Kenzo Kenzo Air'
  },
  {
    'rating': 4,
    'name': 'Kenzo Kenzo Amour'
  },
  {
    'rating': 4,
    'name': 'Kenzo Kenzo Jungle L\'Elephant'
  },
  {
    'rating': 4,
    'name': 'Kenzo Kenzo Jungle pour Homme'
  },
  {
    'rating': 4,
    'name': 'Kenzo Parfum d\'Ete'
  },
  {
    'rating': 4,
    'name': 'Lalique Encre Noire'
  },
  {
    'rating': 4,
    'name': 'Lalique Flora Bella'
  },
  {
    'rating': 4,
    'name': 'Lancome Climat'
  },
  {
    'rating': 4,
    'name': 'Lancome Cuir'
  },
  {
    'rating': 4,
    'name': 'Lancome Magie Noire'
  },
  {
    'rating': 4,
    'name': 'Lancome Miracle Forever'
  },
  {
    'rating': 4,
    'name': 'Lancome Tresor'
  },
  {
    'rating': 4,
    'name': 'Lanvin Arpege'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur Drole de Rose'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur Dzongkha'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur Patchouli Patch'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur Premier Figuier Extreme'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur Safran Troublant'
  },
  {
    'rating': 4,
    'name': 'L\'Aritsan Parfumeur The pour un Ete'
  },
  {
    'rating': 4,
    'name': 'Le Labo Iris 39'
  },
  {
    'rating': 4,
    'name': 'Le Labo Neroli 36'
  },
  {
    'rating': 4,
    'name': 'LesNez The Unicorn Spell'
  },
  {
    'rating': 4,
    'name': 'Lolita Lempicka Lolita Lempicka au Masculin'
  },
  {
    'rating': 4,
    'name': 'Lolita Lempicka Lolita Lempicka Midnight'
  },
  {
    'rating': 4,
    'name': 'LUSH Karma solid perfume'
  },
  {
    'rating': 4,
    'name': 'Maitre Parfumeur et Gantier Ambre Precieux'
  },
  {
    'rating': 4,
    'name': 'Maitre Parfumeur et Gantier Fleurs des Comores'
  },
  {
    'rating': 4,
    'name': 'Maitre Parfumeur et Gantier Racine'
  },
  {
    'rating': 4,
    'name': 'Mauboussin Mauboussin'
  },
  {
    'rating': 4,
    'name': 'Miller Harris Fleurs de Sel'
  },
  {
    'rating': 4,
    'name': 'Miller Harris L\'Air de Rien'
  },
  {
    'rating': 4,
    'name': 'Missoni Missoni Acqua'
  },
  {
    'rating': 4,
    'name': 'Molinard Habanita'
  },
  {
    'rating': 4,
    'name': 'Montana Parfum de Peau'
  },
  {
    'rating': 4,
    'name': 'Moschino Funny!'
  },
  {
    'rating': 4,
    'name': 'Moschino Moschino'
  },
  {
    'rating': 4,
    'name': 'Narciso Rodriguez Narciso Rodriguez for Her'
  },
  {
    'rating': 4,
    'name': 'Nautica Nautica Voyage'
  },
  {
    'rating': 4,
    'name': 'Nina Ricci Love in Paris'
  },
  {
    'rating': 4,
    'name': 'Nina Ricci Nina'
  },
  {
    'rating': 4,
    'name': 'Ormonde Jayne Frangipani Absolute'
  },
  {
    'rating': 4,
    'name': 'Ormonde Jayne Ta\'if'
  },
  {
    'rating': 4,
    'name': 'Ormonde Jayne Tolu'
  },
  {
    'rating': 4,
    'name': 'Paco Rabanne Metal'
  },
  {
    'rating': 4,
    'name': 'Paco Rabanne Paco Rabanne pour Homme'
  },
  {
    'rating': 4,
    'name': 'Paloma Picasso Paloma Picasso'
  },
  {
    'rating': 4,
    'name': 'Parfum d\'Empire Ambre Russe'
  },
  {
    'rating': 4,
    'name': 'Parfum d\'Empire Exhale'
  },
  {
    'rating': 4,
    'name': 'Parfum d\'Empire Fougere Bengale'
  },
  {
    'rating': 4,
    'name': 'Parfum d\'Empire Inhale'
  },
  {
    'rating': 4,
    'name': 'Parfumerie Generale Coze'
  },
  {
    'rating': 4,
    'name': 'Parfums de Nicolai Maharanih'
  },
  {
    'rating': 4,
    'name': 'Parfums de Nicolai Nicolai pour Homme'
  },
  {
    'rating': 4,
    'name': 'Parfums de Nicolai Sacrebleu'
  },
  {
    'rating': 4,
    'name': 'Parfums de Rosine Rosa Flamenca'
  },
  {
    'rating': 4,
    'name': 'Parfums de Rosine Rose d\'Amour'
  },
  {
    'rating': 4,
    'name': 'Parfums de Rosine Rose d\'Homme'
  },
  {
    'rating': 4,
    'name': 'Parfums de Rosine Twill Rose'
  },
  {
    'rating': 4,
    'name': 'parfumsbleu.com Blue Stratos'
  },
  {
    'rating': 4,
    'name': 'Pascal Morabito Or Noir'
  },
  {
    'rating': 4,
    'name': 'Perfumer\'s Workshop Tea Rose'
  },
  {
    'rating': 4,
    'name': 'profumo.it Grezzo'
  },
  {
    'rating': 4,
    'name': 'profumo.it Hindu Kush'
  },
  {
    'rating': 4,
    'name': 'profumo.it Tabac'
  },
  {
    'rating': 4,
    'name': 'Ralph Lauren Polo'
  },
  {
    'rating': 4,
    'name': 'Ralph Lauren Polo Sport'
  },
  {
    'rating': 4,
    'name': 'Ralph Lauren Pure Turquoise'
  },
  {
    'rating': 4,
    'name': 'Robert Piguet Baghari'
  },
  {
    'rating': 4,
    'name': 'Robert Piguet Visa'
  },
  {
    'rating': 4,
    'name': 'Rochas Byzance'
  },
  {
    'rating': 4,
    'name': 'Rochas Eau de Rochas'
  },
  {
    'rating': 4,
    'name': 'Rochas Eau de Rochas Homme'
  },
  {
    'rating': 4,
    'name': 'Rochas Mystere'
  },
  {
    'rating': 4,
    'name': 'Salvador Dali Dali'
  },
  {
    'rating': 4,
    'name': 'Salvador Dali Laguna'
  },
  {
    'rating': 4,
    'name': 'Sarah Jessica Parker Lovely'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Ambre Sultan'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Arabie'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Bois et Fruits'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Bois et Musc'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Bois Oriental'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Borneo 1834'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Chergui'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Douce Amere'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Muscs Koublai Khan'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Rose de Nuit'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Tubereuse Criminelle'
  },
  {
    'rating': 4,
    'name': 'Serge Lutens Un Bois Vanille'
  },
  {
    'rating': 4,
    'name': 'Sonia Rykiel Belle en Rykiel'
  },
  {
    'rating': 4,
    'name': 'Stetson Lady Stetson'
  },
  {
    'rating': 4,
    'name': 'Stetson Stetson'
  },
  {
    'rating': 4,
    'name': 'Tauer Perfumes Lonestar Memories'
  },
  {
    'rating': 4,
    'name': 'The Different Company Divine Bergamote'
  },
  {
    'rating': 4,
    'name': 'The Different Company Osmanthus'
  },
  {
    'rating': 4,
    'name': 'The Different Company Sel de Vetiver'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler A Travers le Miroir'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler A*Men'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Angel Innocent'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Angel La Rose'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Cologne'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Eau de Star'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Miroir des Envies'
  },
  {
    'rating': 4,
    'name': 'Thierry Mugler Miroir des Vanites'
  },
  {
    'rating': 4,
    'name': 'Tom Ford Velvet Gardenia'
  },
  {
    'rating': 4,
    'name': 'Ulrich Lang Anvers 2'
  },
  {
    'rating': 4,
    'name': 'Van Cleef & Arpels First'
  },
  {
    'rating': 4,
    'name': 'veroprofumo.com Kiki'
  },
  {
    'rating': 4,
    'name': 'veroprofumo.com Onda'
  },
  {
    'rating': 4,
    'name': 'veroprofumo.com Rubj'
  },
  {
    'rating': 4,
    'name': 'Vivienne Westwood Let It Rock'
  },
  {
    'rating': 4,
    'name': 'Worth Je Reviens Couture'
  },
  {
    'rating': 4,
    'name': 'YOSH Sottile'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent Body Kouros'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent Cinema'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent Jazz'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent M7'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent M7 Fresh'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent Paris'
  },
  {
    'rating': 4,
    'name': 'Yves Saint Laurent Y'
  },
  {
    'rating': 3,
    'name': '10 Corso Como 10 Corso Como'
  },
  {
    'rating': 3,
    'name': 'Acqua di Parma Acqua di Parma'
  },
  {
    'rating': 3,
    'name': 'Agent Provocateur Agent Provocateur'
  },
  {
    'rating': 3,
    'name': 'Alfred Sung Jewel'
  },
  {
    'rating': 3,
    'name': 'Amouage Silver Cologne'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Bon Point'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Eau de Camille'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Eau de Charlotte'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Eau de Lavande'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Eau d\'Hadrien'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Folavril'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Gardenia Passion'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Grand Amour'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Hadrien Absolu'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Le Chevrefeuille'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal L\'Eau du Sud'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Les Nuits d\'Hadrien'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Mandragore'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Neroli'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Rose Absolue'
  },
  {
    'rating': 3,
    'name': 'Annick Goutal Tubereuse'
  },
  {
    'rating': 3,
    'name': 'Antonia\'s Flowers Antonia\'s Flowers'
  },
  {
    'rating': 3,
    'name': 'Armani Acqua di Gio pour Homme'
  },
  {
    'rating': 3,
    'name': 'Armani Armani Attitude'
  },
  {
    'rating': 3,
    'name': 'Armani Armani Code pour Homme'
  },
  {
    'rating': 3,
    'name': 'Armani Armani pour Homme'
  },
  {
    'rating': 3,
    'name': 'Armani City Glam for Her'
  },
  {
    'rating': 3,
    'name': 'Armani Emporio Armani He'
  },
  {
    'rating': 3,
    'name': 'Armani Emporio Armani She'
  },
  {
    'rating': 3,
    'name': 'Armani Sensi'
  },
  {
    'rating': 3,
    'name': 'Azzaro Chrome Legend'
  },
  {
    'rating': 3,
    'name': 'Azzaro Onyx'
  },
  {
    'rating': 3,
    'name': 'Balmain Balmain'
  },
  {
    'rating': 3,
    'name': 'Balmain Jolie Madame'
  },
  {
    'rating': 3,
    'name': 'Beckham David Beckham Instinct'
  },
  {
    'rating': 3,
    'name': 'Beckham Intimately Beckham for Men'
  },
  {
    'rating': 3,
    'name': 'Beckham Intimately Beckham for Women'
  },
  {
    'rating': 3,
    'name': 'Bella Bellissima Perfect Man Alternative'
  },
  {
    'rating': 3,
    'name': 'Benetton B-United Woman'
  },
  {
    'rating': 3,
    'name': 'Benetton United Colors of Benetton Unisex'
  },
  {
    'rating': 3,
    'name': 'Benetton United Colors of Benetton Woman'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Andy Warhol\'s Silver Factory'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Bryant Park'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Eau de New York'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Madison Soiree'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 New Haarlem'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Nouveau Bowery'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Riverside Drive'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Saks Fifth Avenue for Her'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 So New York'
  },
  {
    'rating': 3,
    'name': 'Bond No. 9 Wall Street'
  },
  {
    'rating': 3,
    'name': 'Boucheron Boucheron Eau Legere 2007'
  },
  {
    'rating': 3,
    'name': 'Boucheron Boucheron pour Homme'
  },
  {
    'rating': 3,
    'name': 'Boucheron Boucheron pour Homme Eau de Parfum'
  },
  {
    'rating': 3,
    'name': 'Boucheron Boucheron pour Homme Eau de Toilette Fraicheur'
  },
  {
    'rating': 3,
    'name': 'Boucheron Jaipur Homme'
  },
  {
    'rating': 3,
    'name': 'Boucheron Jaipur Homme Fraicheur'
  },
  {
    'rating': 3,
    'name': 'Brandy Brandy'
  },
  {
    'rating': 3,
    'name': 'Britney Spears Believe'
  },
  {
    'rating': 3,
    'name': 'Bulgari BLV Blu'
  },
  {
    'rating': 3,
    'name': 'Bulgari pour Homme Extreme'
  },
  {
    'rating': 3,
    'name': 'Bulgari pour Homme Soir'
  },
  {
    'rating': 3,
    'name': 'Bulgari Eau Parfumee au The Blanc'
  },
  {
    'rating': 3,
    'name': 'Cacharel Gloria'
  },
  {
    'rating': 3,
    'name': 'Cacharel Noa Perle'
  },
  {
    'rating': 3,
    'name': 'Cacharel Promesse'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein cK Be'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein Eternity'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein Eternity for Men'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein Obsession'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein Obsession for Men'
  },
  {
    'rating': 3,
    'name': 'Calvin Klein Obsession Night'
  },
  {
    'rating': 3,
    'name': 'Carolina Herrera Chic for Men'
  },
  {
    'rating': 3,
    'name': 'Carolina Herrera Herrera for Men'
  },
  {
    'rating': 3,
    'name': 'Caron Alpona'
  },
  {
    'rating': 3,
    'name': 'Caron Eau de Reglisse'
  },
  {
    'rating': 3,
    'name': 'Caron Fleurs de Rocaille - LT'
  },
  {
    'rating': 3,
    'name': 'Caron Infini'
  },
  {
    'rating': 3,
    'name': 'Caron L\'Anarchiste'
  },
  {
    'rating': 3,
    'name': 'Caron Narcisse Blanc'
  },
  {
    'rating': 3,
    'name': 'Caron Rose'
  },
  {
    'rating': 3,
    'name': 'Caron Tubereuse'
  },
  {
    'rating': 3,
    'name': 'Caron Violette Precieuse'
  },
  {
    'rating': 3,
    'name': 'Carthusia Fiori di Capri'
  },
  {
    'rating': 3,
    'name': 'Carthusia Io Capri'
  },
  {
    'rating': 3,
    'name': 'Carthusia Mediterraneo'
  },
  {
    'rating': 3,
    'name': 'Carthusia Numero Uno'
  },
  {
    'rating': 3,
    'name': 'Carthusia Via Camarelle'
  },
  {
    'rating': 3,
    'name': 'Cartier Eau de Cartier Concentree'
  },
  {
    'rating': 3,
    'name': 'Carven Ma Griffe'
  },
  {
    'rating': 3,
    'name': 'Celine Dion Always Belong'
  },
  {
    'rating': 3,
    'name': 'Celine Dion Celine Dion'
  },
  {
    'rating': 3,
    'name': 'Celine Dion Celine Dion Parfum Notes'
  },
  {
    'rating': 3,
    'name': 'Celine Dion Enchanting'
  },
  {
    'rating': 3,
    'name': 'Celine Dion Spring in Paris'
  },
  {
    'rating': 3,
    'name': 'Chanel Allure Sensuelle'
  },
  {
    'rating': 3,
    'name': 'Chanel Chance'
  },
  {
    'rating': 3,
    'name': 'Chantecaille Frangipane'
  },
  {
    'rating': 3,
    'name': 'Chantecaille Tiare'
  },
  {
    'rating': 3,
    'name': 'Chopard Wish'
  },
  {
    'rating': 3,
    'name': 'Clinique Happy'
  },
  {
    'rating': 3,
    'name': 'Clinique Happy for Men'
  },
  {
    'rating': 3,
    'name': 'Clive Christian 1872 for Men'
  },
  {
    'rating': 3,
    'name': 'Clive Christian No. 1 for Men'
  },
  {
    'rating': 3,
    'name': 'Clive Christian No. 1 for Women'
  },
  {
    'rating': 3,
    'name': 'Clive Christian X for Men'
  },
  {
    'rating': 3,
    'name': 'Comme des Garcons Odeur 53'
  },
  {
    'rating': 3,
    'name': 'Comme des Garcons Palisander'
  },
  {
    'rating': 3,
    'name': 'Comme des Garcons Patchouli'
  },
  {
    'rating': 3,
    'name': 'Costume National 21 Costume National'
  },
  {
    'rating': 3,
    'name': 'Costume National Scent'
  },
  {
    'rating': 3,
    'name': 'Coty Aspen'
  },
  {
    'rating': 3,
    'name': 'Coty Exclamation'
  },
  {
    'rating': 3,
    'name': 'Coty Sand and Sable'
  },
  {
    'rating': 3,
    'name': 'Coty Vanilla Fields'
  },
  {
    'rating': 3,
    'name': 'Creative Scentualization Joy Comes from Within'
  },
  {
    'rating': 3,
    'name': 'Creed Acier Aluminium'
  },
  {
    'rating': 3,
    'name': 'Creed Angelique Encens'
  },
  {
    'rating': 3,
    'name': 'Creed Bois du Portugal'
  },
  {
    'rating': 3,
    'name': 'Creed Cypres Musc'
  },
  {
    'rating': 3,
    'name': 'Creed Fleur de The Rose Bulgare'
  },
  {
    'rating': 3,
    'name': 'Creed Fleurissimo'
  },
  {
    'rating': 3,
    'name': 'Creed Fleurs de Bulgarie'
  },
  {
    'rating': 3,
    'name': 'Creed Jasmal'
  },
  {
    'rating': 3,
    'name': 'Creed Neroli Sauvage'
  },
  {
    'rating': 3,
    'name': 'Creed Royal Scottish'
  },
  {
    'rating': 3,
    'name': 'Creed Selection Verte'
  },
  {
    'rating': 3,
    'name': 'Creed Spring Flower'
  },
  {
    'rating': 3,
    'name': 'Creed Tubereuse Indiana'
  },
  {
    'rating': 3,
    'name': 'Czech & Speake Cuba'
  },
  {
    'rating': 3,
    'name': 'Czech & Speake Frankincense and Myrrh'
  },
  {
    'rating': 3,
    'name': 'Czech & Speake No. 88'
  },
  {
    'rating': 3,
    'name': 'Czech & Speake Oxford & Cambridge Traditional Lavender'
  },
  {
    'rating': 3,
    'name': 'Dana Tabu'
  },
  {
    'rating': 3,
    'name': 'Davidoff Cool Water Wave'
  },
  {
    'rating': 3,
    'name': 'Dior Bois d\'Argent'
  },
  {
    'rating': 3,
    'name': 'Dior J\'Adore'
  },
  {
    'rating': 3,
    'name': 'Diptyque Eau d\'Elide'
  },
  {
    'rating': 3,
    'name': 'Diptyque Eau Trois'
  },
  {
    'rating': 3,
    'name': 'Diptyque L\'Ombre dans l\'Eau'
  },
  {
    'rating': 3,
    'name': 'Diptyque Ofresia'
  },
  {
    'rating': 3,
    'name': 'Diptyque Opone'
  },
  {
    'rating': 3,
    'name': 'Diptyque Tam Dao'
  },
  {
    'rating': 3,
    'name': 'Divine L\'Ame Soeur'
  },
  {
    'rating': 3,
    'name': 'Divine L\'Homme Sage'
  },
  {
    'rating': 3,
    'name': 'Divine L\'Inspiratrice'
  },
  {
    'rating': 3,
    'name': 'Dolce & Gabbana Dolce & Gabbana pour Homme'
  },
  {
    'rating': 3,
    'name': 'Dolce & Gabbana The One'
  },
  {
    'rating': 3,
    'name': 'Donna Karan Be Delicious'
  },
  {
    'rating': 3,
    'name': 'Donna Karan Be Delicious Men'
  },
  {
    'rating': 3,
    'name': 'Donna Karan DKNY Delicious Night'
  },
  {
    'rating': 3,
    'name': 'Donna Karan DKNY Men'
  },
  {
    'rating': 3,
    'name': 'Donna Karan Red Delicious Men'
  },
  {
    'rating': 3,
    'name': 'Donna Karan Red Delicious Woman'
  },
  {
    'rating': 3,
    'name': 'Eau d\'Italie Bois d\'Ombrie'
  },
  {
    'rating': 3,
    'name': 'Eau d\'Italie Eau d\'Italie'
  },
  {
    'rating': 3,
    'name': 'Eau d\'Italie Sienne l\'Hiver'
  },
  {
    'rating': 3,
    'name': 'Elizabeth Arden Red Door'
  },
  {
    'rating': 3,
    'name': 'Elizabeth Arden White Shoulders'
  },
  {
    'rating': 3,
    'name': 'Elizabeth Taylor Passion for Men'
  },
  {
    'rating': 3,
    'name': 'Elizabeth Taylor White Diamonds'
  },
  {
    'rating': 3,
    'name': 'Erox Realm Men'
  },
  {
    'rating': 3,
    'name': 'Escada Escada'
  },
  {
    'rating': 3,
    'name': 'Escentric Molecules Molecule 01'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Beautiful Love'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Beautiful Sheer'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Dazzling Gold'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Intuition for Men'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Pleasures Exotic'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Pleasures for Men'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Pleasures Intense'
  },
  {
    'rating': 3,
    'name': 'Estee Lauder Tom Ford Black Orchid'
  },
  {
    'rating': 3,
    'name': 'Etat Libre d\'Orange Divin\'Enfant'
  },
  {
    'rating': 3,
    'name': 'Etat Libre d\'Orange Nombril Immense'
  },
  {
    'rating': 3,
    'name': 'Etat Libre d\'Orange Putain des Palaces'
  },
  {
    'rating': 3,
    'name': 'Etat Libre d\'Orange Vierges et Toreros'
  },
  {
    'rating': 3,
    'name': 'Etro Etra'
  },
  {
    'rating': 3,
    'name': 'Etro Gomma'
  },
  {
    'rating': 3,
    'name': 'Etro Heliotrope'
  },
  {
    'rating': 3,
    'name': 'Etro Musk'
  },
  {
    'rating': 3,
    'name': 'Etro New Tradition'
  },
  {
    'rating': 3,
    'name': 'Etro Patchouly'
  },
  {
    'rating': 3,
    'name': 'Etro Vicolo Fiori'
  },
  {
    'rating': 3,
    'name': 'Floris Cefiro'
  },
  {
    'rating': 3,
    'name': 'Floris Florissa'
  },
  {
    'rating': 3,
    'name': 'Floris Sandalwood'
  },
  {
    'rating': 3,
    'name': 'Floris Stephanotis'
  },
  {
    'rating': 3,
    'name': 'Fragonard Apres Tout'
  },
  {
    'rating': 3,
    'name': 'Fragonard Billet Doux'
  },
  {
    'rating': 3,
    'name': 'Fragonard Soudain'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle Angeliques sous la Pluie'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle Bigarade Concentree'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle En Passant'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle Iris Poudre'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle Lipstick Rose'
  },
  {
    'rating': 3,
    'name': 'Frederic Malle Musc Ravageur'
  },
  {
    'rating': 3,
    'name': 'Giorgio Beverly Hills Giorgio Red'
  },
  {
    'rating': 3,
    'name': 'Givenchy Extravagance d\'Amarige'
  },
  {
    'rating': 3,
    'name': 'Givenchy Givenchy pour Homme Blue Label'
  },
  {
    'rating': 3,
    'name': 'Givenchy Hot Couture'
  },
  {
    'rating': 3,
    'name': 'Givenchy Xeryus'
  },
  {
    'rating': 3,
    'name': 'Givenchy Xeryus Rouge'
  },
  {
    'rating': 3,
    'name': 'Givenchy Ysatis'
  },
  {
    'rating': 3,
    'name': 'Gucci Envy for Men'
  },
  {
    'rating': 3,
    'name': 'Gucci Gucci'
  },
  {
    'rating': 3,
    'name': 'Gucci Gucci Eau de Parfum'
  },
  {
    'rating': 3,
    'name': 'Guerlain Aqua Allegoria Herba Fresca'
  },
  {
    'rating': 3,
    'name': 'Guerlain Aqua Allegoria Lilia Bella'
  },
  {
    'rating': 3,
    'name': 'Guerlain Bois d\'Armenie'
  },
  {
    'rating': 3,
    'name': 'Guerlain Chamade pour Homme'
  },
  {
    'rating': 3,
    'name': 'Guerlain Cologne du 68'
  },
  {
    'rating': 3,
    'name': 'Guerlain Cuir Beluga'
  },
  {
    'rating': 3,
    'name': 'Guerlain Guerlinade'
  },
  {
    'rating': 3,
    'name': 'Guerlain Iris Ganache'
  },
  {
    'rating': 3,
    'name': 'Guerlain Jardins de Bagatelle'
  },
  {
    'rating': 3,
    'name': 'Guerlain L\'Instant Fleur de Mandarine'
  },
  {
    'rating': 3,
    'name': 'Guerlain L\'Instant Magic'
  },
  {
    'rating': 3,
    'name': 'Guerlain Liu'
  },
  {
    'rating': 3,
    'name': 'Guerlain Philtre d\'Amour'
  },
  {
    'rating': 3,
    'name': 'Guerlain Quand Vient l\'Ete'
  },
  {
    'rating': 3,
    'name': 'Guerlain Rose Barbare'
  },
  {
    'rating': 3,
    'name': 'Halston Halston Z'
  },
  {
    'rating': 3,
    'name': 'Hanae Mori Hanae Mori Butterfly Eau Fraiche'
  },
  {
    'rating': 3,
    'name': 'Hanae Mori Haute Couture'
  },
  {
    'rating': 3,
    'name': 'Hanae Mori HM'
  },
  {
    'rating': 3,
    'name': 'Hanae Mori Magical Moon'
  },
  {
    'rating': 3,
    'name': 'Hermes Amazone'
  },
  {
    'rating': 3,
    'name': 'Hermes Ambre Naguile'
  },
  {
    'rating': 3,
    'name': 'Hermes Brin de Reglisse'
  },
  {
    'rating': 3,
    'name': 'Hermes Caleche'
  },
  {
    'rating': 3,
    'name': 'Hermes Caleche Eau Delicate'
  },
  {
    'rating': 3,
    'name': 'Hermes Eau des Merveilles'
  },
  {
    'rating': 3,
    'name': 'Hermes Elixir des Merveilles'
  },
  {
    'rating': 3,
    'name': 'Hermes Kelly Caleche'
  },
  {
    'rating': 3,
    'name': 'Hermes Rose Ikebana'
  },
  {
    'rating': 3,
    'name': 'Hermes Terre d\'Hermes'
  },
  {
    'rating': 3,
    'name': 'Hermes Un Jardin en Mediterranee'
  },
  {
    'rating': 3,
    'name': 'Hermes Un Jardin sur le Nil'
  },
  {
    'rating': 3,
    'name': 'Hermes Vetiver Tonka'
  },
  {
    'rating': 3,
    'name': 'Houbigant Quelques Fleurs L\'Original'
  },
  {
    'rating': 3,
    'name': 'Issey Miyake L\'Eau Bleue d\'Issey Eau Fraiche'
  },
  {
    'rating': 3,
    'name': 'Issey Miyake L\'Eau d\'Issey'
  },
  {
    'rating': 3,
    'name': 'Issey Miyake L\'Eau d\'Issey pour Homme'
  },
  {
    'rating': 3,
    'name': 'Jean Patou Sublime'
  },
  {
    'rating': 3,
    'name': 'Jean-Paul Gaultier Fleur du Male'
  },
  {
    'rating': 3,
    'name': 'Jean-Paul Gaultier Le Male'
  },
  {
    'rating': 3,
    'name': 'Jil Sander No. 4'
  },
  {
    'rating': 3,
    'name': 'Jil Sander Pure'
  },
  {
    'rating': 3,
    'name': 'Jil Sander Pure Intense'
  },
  {
    'rating': 3,
    'name': 'Jil Sander Sander for Men'
  },
  {
    'rating': 3,
    'name': 'J-Lo Glow'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Amber and Lavender Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Black Vetyver Café Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone French Lime Blossom Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Grapefruit Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Honeysuckle and Jasmine'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Nutmeg and Ginger Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Orange Blossom Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Red Roses Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Tuberose Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Verbenas of Provence Cologne'
  },
  {
    'rating': 3,
    'name': 'Jo Malone White Jasmine and Mint'
  },
  {
    'rating': 3,
    'name': 'Jo Malone Wild Fig and Cassis Cologne'
  },
  {
    'rating': 3,
    'name': 'Jovan Fresh Patchouli'
  },
  {
    'rating': 3,
    'name': 'Jovan Jovan Musk for Women'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri A Fleur de Peau'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Genie des Bois'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Gourmandises'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Jasmine'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Musk'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Myrrhe et Merveilles'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Oliban'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Osmanthus'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Paname'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Passiflora'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Patchoulissime'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Scarlett'
  },
  {
    'rating': 3,
    'name': 'Keiko Mecheri Ume'
  },
  {
    'rating': 3,
    'name': 'Kenzo Flower Le Parfum'
  },
  {
    'rating': 3,
    'name': 'Kenzo Flower Oriental'
  },
  {
    'rating': 3,
    'name': 'Kenzo Kenzo pour Homme'
  },
  {
    'rating': 3,
    'name': 'Kenzo Summer'
  },
  {
    'rating': 3,
    'name': 'Kiton Kiton Black'
  },
  {
    'rating': 3,
    'name': 'Lalique Amethyst'
  },
  {
    'rating': 3,
    'name': 'Lalique Perles de Lalique'
  },
  {
    'rating': 3,
    'name': 'Lancome Magie'
  },
  {
    'rating': 3,
    'name': 'Lancome Mille et Une Roses'
  },
  {
    'rating': 3,
    'name': 'Lancome O de Lancome'
  },
  {
    'rating': 3,
    'name': 'Lanvin Arpege pour Homme'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Ananas Fizz'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Bois Farine'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Fleur de Narcisse 2006'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur La Chasse aux Papillons'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur La Haie Fleurie'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur L\'Eau d\'Ambre'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Mimosa pour Moi'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Navegar'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Passage d\'Enfer'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Piment Brulant'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Poivre Piquant'
  },
  {
    'rating': 3,
    'name': 'L\'Aritsan Parfumeur Tubereuse'
  },
  {
    'rating': 3,
    'name': 'Le Labo Aldehyde 44'
  },
  {
    'rating': 3,
    'name': 'Le Labo Labdanum 18'
  },
  {
    'rating': 3,
    'name': 'LesNez Let Me Play the Lion'
  },
  {
    'rating': 3,
    'name': 'Liz Claiborne Curve'
  },
  {
    'rating': 3,
    'name': 'Liz Claiborne Curve for Men'
  },
  {
    'rating': 3,
    'name': 'L\'Occitane The Vert au Jasmin'
  },
  {
    'rating': 3,
    'name': 'Lolita Lempicka L'
  },
  {
    'rating': 3,
    'name': 'Lorenzo Villoresi Dilmun'
  },
  {
    'rating': 3,
    'name': 'Lorenzo Villoresi Uomo'
  },
  {
    'rating': 3,
    'name': 'Lulu Guinness Fairytales'
  },
  {
    'rating': 3,
    'name': 'LUSH Fever'
  },
  {
    'rating': 3,
    'name': 'LUSH Potion solid perfume'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Fraiche Passiflore'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Fraicheur Muskissime'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Jardin du Neroli'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Or des Indes'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Rose Opulente'
  },
  {
    'rating': 3,
    'name': 'Maitre Parfumeur et Gantier Santal Noble'
  },
  {
    'rating': 3,
    'name': 'Marc Jacobs Daisy'
  },
  {
    'rating': 3,
    'name': 'Marc Jacobs Essence'
  },
  {
    'rating': 3,
    'name': 'Marc Jacobs Marc Jacobs'
  },
  {
    'rating': 3,
    'name': 'Mariah Carey M'
  },
  {
    'rating': 3,
    'name': 'Mary Kay Affection'
  },
  {
    'rating': 3,
    'name': 'Mary Kay Velocity for Him'
  },
  {
    'rating': 3,
    'name': 'Matthew Williamson Matthew Williamson Collection:  Incense'
  },
  {
    'rating': 3,
    'name': 'Matthew Williamson Matthew Williamson Collection:  Jasmine Sambac'
  },
  {
    'rating': 3,
    'name': 'Matthew Williamson Matthew Williamson Collection:  Warm Sands'
  },
  {
    'rating': 3,
    'name': 'Mauboussin M Moi'
  },
  {
    'rating': 3,
    'name': 'Max Mara Silk Touch'
  },
  {
    'rating': 3,
    'name': 'Michael Kors Island'
  },
  {
    'rating': 3,
    'name': 'Michel Germain Sexual'
  },
  {
    'rating': 3,
    'name': 'Michel Germain Sexual pour Homme'
  },
  {
    'rating': 3,
    'name': 'Miller et Bertaux (For you)/parfum trouve'
  },
  {
    'rating': 3,
    'name': 'Miller et Bertaux Green green and green'
  },
  {
    'rating': 3,
    'name': 'Miller et Bertaux Spiritus/land'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Cuir d\'Oranger'
  },
  {
    'rating': 3,
    'name': 'Miller Harris En Sens de Bois'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Feuilles de Tabac'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Figue Amere'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Fleur du Matin'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Fleur Oriental'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Jasmin Vert'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Piment des Baies'
  },
  {
    'rating': 3,
    'name': 'Miller Harris Terre de Bois'
  },
  {
    'rating': 3,
    'name': 'Morgan Light My Heart'
  },
  {
    'rating': 3,
    'name': 'Morgan Love de Toi'
  },
  {
    'rating': 3,
    'name': 'Moschino Cheap and Chic'
  },
  {
    'rating': 3,
    'name': 'Moschino Friends Men'
  },
  {
    'rating': 3,
    'name': 'Moschino L\'Eau Cheap and Chic'
  },
  {
    'rating': 3,
    'name': 'Narciso Rodriguez Narciso Rodriguez for Him'
  },
  {
    'rating': 3,
    'name': 'Origins Shedonism'
  },
  {
    'rating': 3,
    'name': 'Ormonde Jayne Champaca'
  },
  {
    'rating': 3,
    'name': 'Ormonde Jayne Isfarkand'
  },
  {
    'rating': 3,
    'name': 'Ormonde Jayne Osmanthus'
  },
  {
    'rating': 3,
    'name': 'Ormonde Jayne Sampaquita'
  },
  {
    'rating': 3,
    'name': 'Oscar de la Renta Oscar Red Satin'
  },
  {
    'rating': 3,
    'name': 'Paco Rabanne Black XS for Her'
  },
  {
    'rating': 3,
    'name': 'Paco Rabanne Paco Rabanne pour Elle'
  },
  {
    'rating': 3,
    'name': 'Parfum d\'Empire Cuir Ottoman'
  },
  {
    'rating': 3,
    'name': 'Parfum d\'Empire Eau Suave'
  },
  {
    'rating': 3,
    'name': 'Parfum d\'Empire Equistrius'
  },
  {
    'rating': 3,
    'name': 'Parfum d\'Empire Iskander'
  },
  {
    'rating': 3,
    'name': 'Parfum d\'Empire Osmanthus Interdite'
  },
  {
    'rating': 3,
    'name': 'Parfums de Coeur Skin Musk'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Balkis'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Balle de Match'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Cococabana'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Number One'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Rose-Pivoine'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Vanille Tonka'
  },
  {
    'rating': 3,
    'name': 'Parfums de Nicolai Vetyver'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Diabolo Rose'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Ecume de Rose'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine La Rose de Rosine'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Poussiere de Rose'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Rose d\'Ete'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Roseberry'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Un Zeste de Rose'
  },
  {
    'rating': 3,
    'name': 'Parfums de Rosine Une Folie de Rose'
  },
  {
    'rating': 3,
    'name': 'Parfums MDCI Ambre Topkapi'
  },
  {
    'rating': 3,
    'name': 'Parfums MDCI Rose de Siwa'
  },
  {
    'rating': 3,
    'name': 'Paul Smith Paul Smith London for Men'
  },
  {
    'rating': 3,
    'name': 'Paul Smith Paul Smith London Woman'
  },
  {
    'rating': 3,
    'name': 'Paul Smith Paul Smith Man'
  },
  {
    'rating': 3,
    'name': 'Paul Smith Paul Smith Rose'
  },
  {
    'rating': 3,
    'name': 'Paul Smith Paul Smith Woman'
  },
  {
    'rating': 3,
    'name': 'Penhaligon\'s Blenheim Bouquet'
  },
  {
    'rating': 3,
    'name': 'Penhaligon\'s Hammam Bouquet'
  },
  {
    'rating': 3,
    'name': 'People of the Labyrinths A*Maze'
  },
  {
    'rating': 3,
    'name': 'People of the Labyrinths Luctor et Emergo'
  },
  {
    'rating': 3,
    'name': 'Prada Prada'
  },
  {
    'rating': 3,
    'name': 'Procter & Gamble Old Spice'
  },
  {
    'rating': 3,
    'name': 'Ralph Lauren Explorer'
  },
  {
    'rating': 3,
    'name': 'Ralph Lauren Ralph'
  },
  {
    'rating': 3,
    'name': 'Ralph Lauren Ralph Hot'
  },
  {
    'rating': 3,
    'name': 'Ralph Lauren Ralph Rocks'
  },
  {
    'rating': 3,
    'name': 'Renee Amber'
  },
  {
    'rating': 3,
    'name': 'Renee Mediterranean Lily'
  },
  {
    'rating': 3,
    'name': 'Riviera Concepts Hummer'
  },
  {
    'rating': 3,
    'name': 'Roberto Cavalli Roberto Cavalli Oro'
  },
  {
    'rating': 3,
    'name': 'Femme Rochas'
  },
  {
    'rating': 3,
    'name': 'Madame Rochas'
  },
  {
    'rating': 3,
    'name': 'Rochas Rochas Man'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Agua Verde'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Dalimania'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Dalimix'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Dalissme'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Eau de Dali'
  },
  {
    'rating': 3,
    'name': 'Salvador Dali Rubylips'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens A La Nuit'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Cedre'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Cuir Mauresque'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Daim Blond'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Datura Noir'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Encens et Lavande'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Fleurs d\'Oranger'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Fumerie Turque'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Rahat Loukhoum'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Rose de Feu'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Sa Majeste la Rose'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Santal Blanc'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Santal de Mysore'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Un Lys'
  },
  {
    'rating': 3,
    'name': 'Serge Lutens Vetiver Oriental'
  },
  {
    'rating': 3,
    'name': 'Shiseido Zen'
  },
  {
    'rating': 3,
    'name': 'S-Perfume S-Perfume'
  },
  {
    'rating': 3,
    'name': 'Stella McCartney Stella'
  },
  {
    'rating': 3,
    'name': 'Stella McCartney Stella in Two Amber'
  },
  {
    'rating': 3,
    'name': 'Stella McCartney Stella in Two Peony'
  },
  {
    'rating': 3,
    'name': 'Stella McCartney Stella Rose Absolute'
  },
  {
    'rating': 3,
    'name': 'Stetson Stetson Black'
  },
  {
    'rating': 3,
    'name': 'Stetson Stetson Untamed'
  },
  {
    'rating': 3,
    'name': 'Tann Rokka Kisu'
  },
  {
    'rating': 3,
    'name': 'Tauer Perfumes Le Maroc'
  },
  {
    'rating': 3,
    'name': 'Tauer Perfumes Reverie au Jardin'
  },
  {
    'rating': 3,
    'name': 'The Different Company Bios d\'Iris'
  },
  {
    'rating': 3,
    'name': 'The Different Company Jasmin de Nuit'
  },
  {
    'rating': 3,
    'name': 'The Different Company Rose Poivree'
  },
  {
    'rating': 3,
    'name': 'The Different Company Un Parfum d\'Ailleurs et Fleurs'
  },
  {
    'rating': 3,
    'name': 'The Different Company Un Parfum de Charmes et Feuilles'
  },
  {
    'rating': 3,
    'name': 'The Different Company Un Parfum des Sens et Bois'
  },
  {
    'rating': 3,
    'name': 'Thierry Mugler Alien'
  },
  {
    'rating': 3,
    'name': 'Thierry Mugler Angel Lys'
  },
  {
    'rating': 3,
    'name': 'Thierry Mugler Angel Pivoine'
  },
  {
    'rating': 3,
    'name': 'Thierry Mugler Angel Violet'
  },
  {
    'rating': 3,
    'name': 'Thierry Mugler Dis Moi Miroir'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Amber Absolute'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Black Violet'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Japon Noir'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Oud Wood'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Tobacco Vanille'
  },
  {
    'rating': 3,
    'name': 'Tom Ford Tom Ford for Men'
  },
  {
    'rating': 3,
    'name': 'Tommy Hilfiger Tommy'
  },
  {
    'rating': 3,
    'name': 'Tommy Hilfiger True Star'
  },
  {
    'rating': 3,
    'name': 'Torrente L\'Or de Torrente'
  },
  {
    'rating': 3,
    'name': 'Ulrich Lang Anvers'
  },
  {
    'rating': 3,
    'name': 'Van Cleef & Arpels First Love'
  },
  {
    'rating': 3,
    'name': 'Van Cleef & Arpels Van Cleef'
  },
  {
    'rating': 3,
    'name': 'Versace Versace'
  },
  {
    'rating': 3,
    'name': 'Victoria\'s Secret Dream Angels Divine'
  },
  {
    'rating': 3,
    'name': 'Victoria\'s Secret Dream Angels Heavenly'
  },
  {
    'rating': 3,
    'name': 'Victoria\'s Secret Love Spell'
  },
  {
    'rating': 3,
    'name': 'Worth Courtesan'
  },
  {
    'rating': 3,
    'name': 'YOSH Omniscent'
  },
  {
    'rating': 3,
    'name': 'YOSH Stargazer'
  },
  {
    'rating': 3,
    'name': 'YOSH U4EAHH!'
  },
  {
    'rating': 3,
    'name': 'Yves Rocher Iris Noir'
  },
  {
    'rating': 3,
    'name': 'Yves Rocher Rose Absolue'
  },
  {
    'rating': 3,
    'name': 'Yves Rocher Voile d\'Ambre'
  },
  {
    'rating': 3,
    'name': 'Yves Saint Laurent Cinema Festival d\'Ete'
  },
  {
    'rating': 3,
    'name': 'Yves Saint Laurent Elle'
  },
  {
    'rating': 3,
    'name': 'Yves Saint Laurent Rive Gauche pour Homme'
  },
  {
    'rating': 2,
    'name': 'Adidas Adidas Moves'
  },
  {
    'rating': 2,
    'name': 'Adidas Adidas Moves for Her'
  },
  {
    'rating': 2,
    'name': 'Agent Provocateur Eau Emotionelle'
  },
  {
    'rating': 2,
    'name': 'Agent Provocateur Maitresse'
  },
  {
    'rating': 2,
    'name': 'Alexander McQueen MyQueen'
  },
  {
    'rating': 2,
    'name': 'Alfred Sung Hei'
  },
  {
    'rating': 2,
    'name': 'Alfred Sung Pure'
  },
  {
    'rating': 2,
    'name': 'Amouage Arcus'
  },
  {
    'rating': 2,
    'name': 'Anamor All That Matters'
  },
  {
    'rating': 2,
    'name': 'Ann Taylor Possibilities'
  },
  {
    'rating': 2,
    'name': 'Annick Goutal Ce Soir ou Jamais'
  },
  {
    'rating': 2,
    'name': 'Annick Goutal Le Jasmin'
  },
  {
    'rating': 2,
    'name': 'Annick Goutal Petite Cherie'
  },
  {
    'rating': 2,
    'name': 'Annick Goutal Vanille Exquise'
  },
  {
    'rating': 2,
    'name': 'Antonia\'s Flowers Floret'
  },
  {
    'rating': 2,
    'name': 'Antonia\'s Flowers Sogni di Mare'
  },
  {
    'rating': 2,
    'name': 'Antonia\'s Flowers Tiempe Passate'
  },
  {
    'rating': 2,
    'name': 'Apothia IF'
  },
  {
    'rating': 2,
    'name': 'Armani Armani Mania pour Homme'
  },
  {
    'rating': 2,
    'name': 'Armani City Glam for Him'
  },
  {
    'rating': 2,
    'name': 'Armani Prive Eau de Jade'
  },
  {
    'rating': 2,
    'name': 'Armani Prive Eclat de Jasmin'
  },
  {
    'rating': 2,
    'name': 'Armani Prive Pierre de Lune'
  },
  {
    'rating': 2,
    'name': 'Art of Perfumery Art of Perfumery 4'
  },
  {
    'rating': 2,
    'name': 'Art of Perfumery Art of Perfumery 6'
  },
  {
    'rating': 2,
    'name': 'Azzaro Silver Black'
  },
  {
    'rating': 2,
    'name': 'Baby Phat Goddess'
  },
  {
    'rating': 2,
    'name': 'Becker.Eshaya Golden Amber'
  },
  {
    'rating': 2,
    'name': 'Benetton Benetton Sport Women'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Chelsea Flowers'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Chez Bond'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Coney Island'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Fashion Avenue'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Nuits de Noho'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Park Avenue'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 Scent of Peace'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 West Broadway'
  },
  {
    'rating': 2,
    'name': 'Bond No. 9 West Side'
  },
  {
    'rating': 2,
    'name': 'Britney Spears Fantasy'
  },
  {
    'rating': 2,
    'name': 'Bulgari Aqua pour Homme'
  },
  {
    'rating': 2,
    'name': 'Bulgari BlV Blu pour Homme'
  },
  {
    'rating': 2,
    'name': 'Bulgari Rose Essentielle'
  },
  {
    'rating': 2,
    'name': 'Bulgari Eau Parfumee au The Rouge'
  },
  {
    'rating': 2,
    'name': 'Burberry Burberry for Men'
  },
  {
    'rating': 2,
    'name': 'By Kilian Cruel Intentions'
  },
  {
    'rating': 2,
    'name': 'By Kilian Straight to Heaven'
  },
  {
    'rating': 2,
    'name': 'Cacharel Amor Amor'
  },
  {
    'rating': 2,
    'name': 'Cacharel Liberte'
  },
  {
    'rating': 2,
    'name': 'Cacharel Noa Fleur'
  },
  {
    'rating': 2,
    'name': 'Calvin Klein cK One Summer'
  },
  {
    'rating': 2,
    'name': 'Calvin Klein Escape'
  },
  {
    'rating': 2,
    'name': 'Calvin Klein Escape for Men'
  },
  {
    'rating': 2,
    'name': 'Calvin Klein Euphoria Blossom'
  },
  {
    'rating': 2,
    'name': 'Calvin Klein Sheer Obsession'
  },
  {
    'rating': 2,
    'name': 'Carolina Herrera 212 Men'
  },
  {
    'rating': 2,
    'name': 'Carolina Herrera Carolina'
  },
  {
    'rating': 2,
    'name': 'Carolina Herrera Chic'
  },
  {
    'rating': 2,
    'name': 'Carolina Herrera Herrera Aqua'
  },
  {
    'rating': 2,
    'name': 'Caron Bellodgia'
  },
  {
    'rating': 2,
    'name': 'Caron Coup de Fouet'
  },
  {
    'rating': 2,
    'name': 'Caron En Avion'
  },
  {
    'rating': 2,
    'name': 'Caron Fleur de Rocaille'
  },
  {
    'rating': 2,
    'name': 'Caron Fleurs de Rocaille - TS'
  },
  {
    'rating': 2,
    'name': 'Caron Lady Caron'
  },
  {
    'rating': 2,
    'name': 'Caron Montaigne'
  },
  {
    'rating': 2,
    'name': 'Caron Muguet du Bonheur'
  },
  {
    'rating': 2,
    'name': 'Caron N\'Aimez que Moi'
  },
  {
    'rating': 2,
    'name': 'Caron Narcisse Noir eau de toilette'
  },
  {
    'rating': 2,
    'name': 'Caron Nocturnes'
  },
  {
    'rating': 2,
    'name': 'Caron Or et Noir'
  },
  {
    'rating': 2,
    'name': 'Caron Pois de Senteur'
  },
  {
    'rating': 2,
    'name': 'Caron Poivre'
  },
  {
    'rating': 2,
    'name': 'Caron Pour une Femme'
  },
  {
    'rating': 2,
    'name': 'Carthusia Ligea La Sirena'
  },
  {
    'rating': 2,
    'name': 'Cartier Le Baiser du Dragon'
  },
  {
    'rating': 2,
    'name': 'Cartier Santos'
  },
  {
    'rating': 2,
    'name': 'Chanel Allure'
  },
  {
    'rating': 2,
    'name': 'Chanel Egoiste Platinum'
  },
  {
    'rating': 2,
    'name': 'Chopard Chopard pour Homme'
  },
  {
    'rating': 2,
    'name': 'Combe Inc. Aqua Velva Classic Ice Blue'
  },
  {
    'rating': 2,
    'name': 'Comme des Garcons Play'
  },
  {
    'rating': 2,
    'name': 'Creative Scentualization Beauty Comes from Within'
  },
  {
    'rating': 2,
    'name': 'Creative Scentualization Perfect Kiss'
  },
  {
    'rating': 2,
    'name': 'Creed Ambre Cannelle'
  },
  {
    'rating': 2,
    'name': 'Creed Himalaya'
  },
  {
    'rating': 2,
    'name': 'Creed Millesime Imperial'
  },
  {
    'rating': 2,
    'name': 'Creed Santal Imperial'
  },
  {
    'rating': 2,
    'name': 'Creed Tabarome'
  },
  {
    'rating': 2,
    'name': 'Creed Virgin Island Water'
  },
  {
    'rating': 2,
    'name': 'Dana English Leather'
  },
  {
    'rating': 2,
    'name': 'Danielle Steel Danielle'
  },
  {
    'rating': 2,
    'name': 'Davidoff Silver Shadow'
  },
  {
    'rating': 2,
    'name': 'Dior Dior Addict'
  },
  {
    'rating': 2,
    'name': 'Dior Dior Addict 2'
  },
  {
    'rating': 2,
    'name': 'Diorama'
  },
  {
    'rating': 2,
    'name': 'Dior Fahrenheit'
  },
  {
    'rating': 2,
    'name': 'Dior Higher'
  },
  {
    'rating': 2,
    'name': 'Dior Miss Dior'
  },
  {
    'rating': 2,
    'name': 'Dolce & Gabbana Dolce & Gabbana'
  },
  {
    'rating': 2,
    'name': 'Dolce & Gabbana Sicily'
  },
  {
    'rating': 2,
    'name': 'Donna Karan Cashmere Mist'
  },
  {
    'rating': 2,
    'name': 'Dunhill Dunhill'
  },
  {
    'rating': 2,
    'name': 'Dunhill Fresh'
  },
  {
    'rating': 2,
    'name': 'Dunhill Pure'
  },
  {
    'rating': 2,
    'name': 'Elizabeth Arden 5th Avenue'
  },
  {
    'rating': 2,
    'name': 'Elizabeth Arden Daytona 500'
  },
  {
    'rating': 2,
    'name': 'Elizabeth Arden Green Tea'
  },
  {
    'rating': 2,
    'name': 'Ermenegildo Zegna Zegna Intenso'
  },
  {
    'rating': 2,
    'name': 'Escada Sentiment'
  },
  {
    'rating': 2,
    'name': 'Escada Sunset Heat'
  },
  {
    'rating': 2,
    'name': 'Escada Sunset Heat for Men'
  },
  {
    'rating': 2,
    'name': 'Estee Lauder Estee'
  },
  {
    'rating': 2,
    'name': 'Estee Lauder Intuition'
  },
  {
    'rating': 2,
    'name': 'Etat Libre d\'Orange Charogne'
  },
  {
    'rating': 2,
    'name': 'Etat Libre d\'Orange Delicious Closet Queen'
  },
  {
    'rating': 2,
    'name': 'Etat Libre d\'Orange Don\'t Get Me Wrong Baby I Don\'t Swallow'
  },
  {
    'rating': 2,
    'name': 'Etro Ambra'
  },
  {
    'rating': 2,
    'name': 'Etro Dianthus'
  },
  {
    'rating': 2,
    'name': 'Etro Lemon Sorbet'
  },
  {
    'rating': 2,
    'name': 'Etro Magot'
  },
  {
    'rating': 2,
    'name': 'Etro Royal Pavillon'
  },
  {
    'rating': 2,
    'name': 'FCUK Eau de FCUK'
  },
  {
    'rating': 2,
    'name': 'FCUK French Connection Fragrance'
  },
  {
    'rating': 2,
    'name': 'Floris Edwardian Bouquet'
  },
  {
    'rating': 2,
    'name': 'Floris Fleur'
  },
  {
    'rating': 2,
    'name': 'Floris Gardenia'
  },
  {
    'rating': 2,
    'name': 'Floris JF'
  },
  {
    'rating': 2,
    'name': 'Floris Lily of the Valley'
  },
  {
    'rating': 2,
    'name': 'Floris Night-Scented Jasmine'
  },
  {
    'rating': 2,
    'name': 'Floris Santal'
  },
  {
    'rating': 2,
    'name': 'Floris Seringa'
  },
  {
    'rating': 2,
    'name': 'Floris Vetiver'
  },
  {
    'rating': 2,
    'name': 'Floris Zinnia'
  },
  {
    'rating': 2,
    'name': 'Fragonard Mensonge'
  },
  {
    'rating': 2,
    'name': 'Fresh Scents by Terri Gregory'
  },
  {
    'rating': 2,
    'name': 'Fresh Scents by Terri My Man'
  },
  {
    'rating': 2,
    'name': 'Geoffrey Beene Eau de Grey Flannel'
  },
  {
    'rating': 2,
    'name': 'Givenchy Eau de Givenchy'
  },
  {
    'rating': 2,
    'name': 'Givenchy Givenchy Gentleman'
  },
  {
    'rating': 2,
    'name': 'Gres Cabochard'
  },
  {
    'rating': 2,
    'name': 'Gucci Gucci pour Homme II'
  },
  {
    'rating': 2,
    'name': 'Gucci Rush II'
  },
  {
    'rating': 2,
    'name': 'Guerlain Angelique Noire'
  },
  {
    'rating': 2,
    'name': 'Guerlain Aqua Allegoria Angelique-Lilas'
  },
  {
    'rating': 2,
    'name': 'Guerlain Aqua Allegoria Mandarine-Basilic'
  },
  {
    'rating': 2,
    'name': 'Guerlain Cherry Blossom Fruity'
  },
  {
    'rating': 2,
    'name': 'Guerlain Metalys'
  },
  {
    'rating': 2,
    'name': 'Guerlain My Insolence'
  },
  {
    'rating': 2,
    'name': 'Guerlain Spiritueuse Double Vanille'
  },
  {
    'rating': 2,
    'name': 'Halston Sheer Halston'
  },
  {
    'rating': 2,
    'name': 'Halston Unbound'
  },
  {
    'rating': 2,
    'name': 'Halston Unbound for Men'
  },
  {
    'rating': 2,
    'name': 'Helen of Troy Ltd. Brut'
  },
  {
    'rating': 2,
    'name': 'Hermes Paprika Brasil'
  },
  {
    'rating': 2,
    'name': 'Hermes Poivre Samarcande'
  },
  {
    'rating': 2,
    'name': 'Hilary Duff With Love…'
  },
  {
    'rating': 2,
    'name': 'Houbigant Quelques Fleurs Royale'
  },
  {
    'rating': 2,
    'name': 'Hugo Boss Hugo'
  },
  {
    'rating': 2,
    'name': 'Hugo Boss Hugo XY'
  },
  {
    'rating': 2,
    'name': 'I Profumi di Firenze Ambra del Nepal'
  },
  {
    'rating': 2,
    'name': 'Iceberg Effusion Woman'
  },
  {
    'rating': 2,
    'name': 'Iceberg Iceberg Twice'
  },
  {
    'rating': 2,
    'name': 'Issey Miyake L\'Eau Bleue d\'Issey pour Homme'
  },
  {
    'rating': 2,
    'name': 'Issey Miyake L\'Eau d\'Issey pour Homme Intense'
  },
  {
    'rating': 2,
    'name': 'Jean-Charles Brosseau Fleurs d\'Ombre Bleue'
  },
  {
    'rating': 2,
    'name': 'Jean-Charles Brosseau Fleurs d\'Ombre Rose'
  },
  {
    'rating': 2,
    'name': 'Jean-Charles Brosseau Fleurs d\'Ombre Violette-Menthe'
  },
  {
    'rating': 2,
    'name': 'Jean-Charles Brosseau Fruit de Bois'
  },
  {
    'rating': 2,
    'name': 'Jean-Charles Brosseau The Brun'
  },
  {
    'rating': 2,
    'name': 'Jean-Paul Gaultier Le Male Eau d\'Ete'
  },
  {
    'rating': 2,
    'name': 'Jil Sander Jil Sander Pure for Men'
  },
  {
    'rating': 2,
    'name': 'Jil Sander Sensations'
  },
  {
    'rating': 2,
    'name': 'Jil Sander Sun'
  },
  {
    'rating': 2,
    'name': 'J-Lo Glow After Dark'
  },
  {
    'rating': 2,
    'name': 'Jo Malone 154 Cologne'
  },
  {
    'rating': 2,
    'name': 'Jo Malone Blue Agava & Cacao Cologne'
  },
  {
    'rating': 2,
    'name': 'Jo Malone Nectarine Blossom and Honey Cologne'
  },
  {
    'rating': 2,
    'name': 'Jo Malone Pomegranate Noir Cologne'
  },
  {
    'rating': 2,
    'name': 'Jo Malone Vetyver Cologne'
  },
  {
    'rating': 2,
    'name': 'Jo Malone Vintage Gardenia Cologne'
  },
  {
    'rating': 2,
    'name': 'John Varvatos John Varvatos'
  },
  {
    'rating': 2,
    'name': 'Joop! Joop! Homme'
  },
  {
    'rating': 2,
    'name': 'Joop! Joop! Jump'
  },
  {
    'rating': 2,
    'name': 'Jovan Ginseng NRG Energy'
  },
  {
    'rating': 2,
    'name': 'Jovan Island Gardenia'
  },
  {
    'rating': 2,
    'name': 'Jovan jovan White Musk'
  },
  {
    'rating': 2,
    'name': 'Juozas Statkevicius Juozas Statkevicius'
  },
  {
    'rating': 2,
    'name': 'Kate Moss Kate Moss'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Bois de Santal'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Damascena'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Grenats'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Hanae'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Mihime'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Sanguine'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri White Petals'
  },
  {
    'rating': 2,
    'name': 'Keiko Mecheri Wild Berries'
  },
  {
    'rating': 2,
    'name': 'Kenzo Kenzo pour Homme Fresh'
  },
  {
    'rating': 2,
    'name': 'Kenzo Le Monde Est Beau'
  },
  {
    'rating': 2,
    'name': 'Kenzo L\'Eau par Kenzo pour Femme'
  },
  {
    'rating': 2,
    'name': 'Kenzo L\'Eau par Kenzo pour Homme'
  },
  {
    'rating': 2,
    'name': 'Kenzo Tokyo'
  },
  {
    'rating': 2,
    'name': 'Kiton Kiton Man'
  },
  {
    'rating': 2,
    'name': 'L.A.M.B. L'
  },
  {
    'rating': 2,
    'name': 'Lalique Lalique Eau de Parfum'
  },
  {
    'rating': 2,
    'name': 'Lancome Hypnose'
  },
  {
    'rating': 2,
    'name': 'Lancome Hypnose Homme'
  },
  {
    'rating': 2,
    'name': 'Lancome Miracle'
  },
  {
    'rating': 2,
    'name': 'Lanvin Eclat d\'Arpege'
  },
  {
    'rating': 2,
    'name': 'Lanvin Lanvin L\'Homme'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Ambre Extreme'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Eau du Navigateur'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Fou d\'Absinthe'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Jour de Fete'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur L\'Eau de l\'Artisan'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Mandarine Tout Simplement'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Mures et Musc'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Mures et Musc Extreme'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Verte Violette'
  },
  {
    'rating': 2,
    'name': 'L\'Aritsan Parfumeur Voleur de Rose'
  },
  {
    'rating': 2,
    'name': 'Le Labo Rose 31'
  },
  {
    'rating': 2,
    'name': 'Le Labo Tubereuse 40'
  },
  {
    'rating': 2,
    'name': 'Le Labo Vetiver 46'
  },
  {
    'rating': 2,
    'name': 'LesNez L\'Antimatiere'
  },
  {
    'rating': 2,
    'name': 'L\'Occitane Cherry Blossom'
  },
  {
    'rating': 2,
    'name': 'L\'Occitane The Blanc'
  },
  {
    'rating': 2,
    'name': 'Lorenzo Villoresi Donna'
  },
  {
    'rating': 2,
    'name': 'Lorenzo Villoresi Incensi'
  },
  {
    'rating': 2,
    'name': 'Lorenzo Villoresi Vetiver'
  },
  {
    'rating': 2,
    'name': 'Lorenzo Villoresi Yerbamate'
  },
  {
    'rating': 2,
    'name': 'LUSH Go Green'
  },
  {
    'rating': 2,
    'name': 'LUSH Silky Underwear solid perfume'
  },
  {
    'rating': 2,
    'name': 'Maitre Parfumeur et Gantier Bahiana'
  },
  {
    'rating': 2,
    'name': 'Maitre Parfumeur et Gantier Garrigue'
  },
  {
    'rating': 2,
    'name': 'Maitre Parfumeur et Gantier Vocalise'
  },
  {
    'rating': 2,
    'name': 'Marc Jacobs Blush'
  },
  {
    'rating': 2,
    'name': 'Mary Kay Bella Belara'
  },
  {
    'rating': 2,
    'name': 'Mary Kay High Intensity'
  },
  {
    'rating': 2,
    'name': 'Mary-Kate and Ashley Mary-Kate and Ashley One'
  },
  {
    'rating': 2,
    'name': 'Mary-Kate and Ashley Mary-Kate and Ashley Two'
  },
  {
    'rating': 2,
    'name': 'Matthew Williamson Matthew Williamson Collection:  Pink Lotus'
  },
  {
    'rating': 2,
    'name': 'Matthew Williamson Sheer'
  },
  {
    'rating': 2,
    'name': 'Max Mara Max Mara'
  },
  {
    'rating': 2,
    'name': 'Michel Germain Sexual pour Femme'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Citron Citron'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Coeur de Fleur'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Coeur d\'Ete'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Eau de Vert'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Noix de Tubereuse'
  },
  {
    'rating': 2,
    'name': 'Miller Harris Tangerine Vert'
  },
  {
    'rating': 2,
    'name': 'Montana Montana Homme'
  },
  {
    'rating': 2,
    'name': 'Montana Montana Mood Sensual'
  },
  {
    'rating': 2,
    'name': 'Moschino Uomo?'
  },
  {
    'rating': 2,
    'name': 'Nina Ricci L\'Air du Temps'
  },
  {
    'rating': 2,
    'name': 'Nina Ricci Premier Jour'
  },
  {
    'rating': 2,
    'name': 'Origins Ginger Essence'
  },
  {
    'rating': 2,
    'name': 'Origins Ginger with a Twist'
  },
  {
    'rating': 2,
    'name': 'Ormonde Jayne Orris Noir'
  },
  {
    'rating': 2,
    'name': 'Oscar de la Renta Oscar'
  },
  {
    'rating': 2,
    'name': 'Oscar de la Renta Oscar Citrus'
  },
  {
    'rating': 2,
    'name': 'Oscar de la Renta Oscar Red Orchid'
  },
  {
    'rating': 2,
    'name': 'Paco Rabanne XS Excess pour Homme'
  },
  {
    'rating': 2,
    'name': 'Paul Sebastian Casual'
  },
  {
    'rating': 2,
    'name': 'Paul Smith Story'
  },
  {
    'rating': 2,
    'name': 'Prada Amber pour Homme'
  },
  {
    'rating': 2,
    'name': 'Prada Infusion d\'Iris'
  },
  {
    'rating': 2,
    'name': 'Prada Prada Tendre'
  },
  {
    'rating': 2,
    'name': 'Prince Matchabelli Wind Song'
  },
  {
    'rating': 2,
    'name': 'Pucci Vivara'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Lauren'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Polo Double Black'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Purple Label'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Ralph Cool'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Romance'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Romance Men Silver'
  },
  {
    'rating': 2,
    'name': 'Ralph Lauren Safari for Men'
  },
  {
    'rating': 2,
    'name': 'Renee Jasmine'
  },
  {
    'rating': 2,
    'name': 'Renee L\'Eau'
  },
  {
    'rating': 2,
    'name': 'Renee Musk'
  },
  {
    'rating': 2,
    'name': 'Renee Snowpeach'
  },
  {
    'rating': 2,
    'name': 'Renee Tuberose'
  },
  {
    'rating': 2,
    'name': 'Robert Piguet Cravache'
  },
  {
    'rating': 2,
    'name': 'Roberto Cavalli Just Cavalli Him'
  },
  {
    'rating': 2,
    'name': 'Roberto Cavalli Roberto Cavalli'
  },
  {
    'rating': 2,
    'name': 'Rochas Soleil de Rochas'
  },
  {
    'rating': 2,
    'name': 'Salvador Dali Black Sun'
  },
  {
    'rating': 2,
    'name': 'Salvador Dali Le Roy Soleil Homme'
  },
  {
    'rating': 2,
    'name': 'Salvador Dali Purple Lips'
  },
  {
    'rating': 2,
    'name': 'Salvador Dali Purplelight'
  },
  {
    'rating': 2,
    'name': 'Sarah Jessica Parker Covet'
  },
  {
    'rating': 2,
    'name': 'Sean John Unforgivable'
  },
  {
    'rating': 2,
    'name': 'Sean John Unforgivable Woman'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Chene'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Chypre Rouge'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Clair de Musc'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Fleurs de Citronnier'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Louve'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Mandarine Mandarin'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Rousse'
  },
  {
    'rating': 2,
    'name': 'Serge Lutens Un Bois Sepia'
  },
  {
    'rating': 2,
    'name': 'Stetson Shania'
  },
  {
    'rating': 2,
    'name': 'Stetson Shania Starlight'
  },
  {
    'rating': 2,
    'name': 'Thierry Mugler Miroir des Secrets'
  },
  {
    'rating': 2,
    'name': 'Tom Ford Bois Rouge'
  },
  {
    'rating': 2,
    'name': 'Tom Ford Moss Breeches'
  },
  {
    'rating': 2,
    'name': 'Tom Ford Neroli Portofino'
  },
  {
    'rating': 2,
    'name': 'Tom Ford Purple Patchouli'
  },
  {
    'rating': 2,
    'name': 'Tom Ford Tuscan Leather'
  },
  {
    'rating': 2,
    'name': 'Valentino Valentino pour Homme'
  },
  {
    'rating': 2,
    'name': 'Vera Wang Truly Pink'
  },
  {
    'rating': 2,
    'name': 'Versace Versace Man'
  },
  {
    'rating': 2,
    'name': 'Victoria\'s Secret Sexy Little Things'
  },
  {
    'rating': 2,
    'name': 'Victoria\'s Secret Very Sexy for Him'
  },
  {
    'rating': 2,
    'name': 'Viktor & Rolf Antidote'
  },
  {
    'rating': 2,
    'name': 'YOSH Ginger Ciao'
  },
  {
    'rating': 2,
    'name': 'YOSH White Flowers'
  },
  {
    'rating': 2,
    'name': 'Yves Saint Laurent Baby Doll Paris'
  },
  {
    'rating': 2,
    'name': 'Yves Saint Laurent L\'Homme'
  },
  {
    'rating': 2,
    'name': 'Yves Saint Laurent Opium pour Homme'
  },
  {
    'rating': 1,
    'name': 'Adidas Adidas Moves 0:01'
  },
  {
    'rating': 1,
    'name': 'Alexander McQueen Kingdom'
  },
  {
    'rating': 1,
    'name': 'Alfred Sung Sung'
  },
  {
    'rating': 1,
    'name': 'Amouage Ciel'
  },
  {
    'rating': 1,
    'name': 'Amouage Cirrus'
  },
  {
    'rating': 1,
    'name': 'Amouage Reflection'
  },
  {
    'rating': 1,
    'name': 'Amouage Reflection Man'
  },
  {
    'rating': 1,
    'name': 'Anna Sui Secret Wish'
  },
  {
    'rating': 1,
    'name': 'Apothia L'
  },
  {
    'rating': 1,
    'name': 'Apothia Velvet Rope'
  },
  {
    'rating': 1,
    'name': 'Armani Armani Code Elixir de Parfum'
  },
  {
    'rating': 1,
    'name': 'Armani Armani Code for Women'
  },
  {
    'rating': 1,
    'name': 'Armani Diamonds'
  },
  {
    'rating': 1,
    'name': 'Armani Remix for Her'
  },
  {
    'rating': 1,
    'name': 'Armani White Red He'
  },
  {
    'rating': 1,
    'name': 'Armani White Red She'
  },
  {
    'rating': 1,
    'name': 'Art of Perfumery Art of Perfumery 1'
  },
  {
    'rating': 1,
    'name': 'Art of Perfumery Art of Perfumery 2'
  },
  {
    'rating': 1,
    'name': 'Art of Perfumery Art of Perfumery 3'
  },
  {
    'rating': 1,
    'name': 'Art of Perfumery Art of Perfumery 5'
  },
  {
    'rating': 1,
    'name': 'Art of Perfumery Art of Perfumery 7'
  },
  {
    'rating': 1,
    'name': 'Azzaro Chrome'
  },
  {
    'rating': 1,
    'name': 'Baby Phat Golden Goddess'
  },
  {
    'rating': 1,
    'name': 'Baldessarini Ambre'
  },
  {
    'rating': 1,
    'name': 'Balmain Balmya'
  },
  {
    'rating': 1,
    'name': 'Balmain Vent Vert'
  },
  {
    'rating': 1,
    'name': 'Becker.Eshaya b.e.'
  },
  {
    'rating': 1,
    'name': 'Benetton B-United Jeans Man'
  },
  {
    'rating': 1,
    'name': 'Benetton Cumbia Colors Man'
  },
  {
    'rating': 1,
    'name': 'Benetton Cumbia Colors Woman'
  },
  {
    'rating': 1,
    'name': 'Benetton Pure Sport for Men'
  },
  {
    'rating': 1,
    'name': 'Benetton Pure Sport for Women'
  },
  {
    'rating': 1,
    'name': 'Benetton Sport'
  },
  {
    'rating': 1,
    'name': 'Benetton United Colors of Benetton Man'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Bleecker Street'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Central Park'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Eau de Noho'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Gramercy Park'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Hamptons'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Little Italy'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 New York Fling'
  },
  {
    'rating': 1,
    'name': 'Bond No. 9 Saks Fifth Avenue for Him'
  },
  {
    'rating': 1,
    'name': 'Boucheron Jaipur Saphir'
  },
  {
    'rating': 1,
    'name': 'Boucheron Miss Boucheron'
  },
  {
    'rating': 1,
    'name': 'Boucheron Trouble'
  },
  {
    'rating': 1,
    'name': 'Boucheron Trouble Eau Legere'
  },
  {
    'rating': 1,
    'name': 'Britney Spears Curious'
  },
  {
    'rating': 1,
    'name': 'Bulgari Voile de Jasmin'
  },
  {
    'rating': 1,
    'name': 'Burberry Burberry'
  },
  {
    'rating': 1,
    'name': 'Cacharel Amor pour Homme'
  },
  {
    'rating': 1,
    'name': 'Calvin Klein cK IN2U Her'
  },
  {
    'rating': 1,
    'name': 'Calvin Klein cK IN2U His'
  },
  {
    'rating': 1,
    'name': 'Calvin Klein Euphoria Men'
  },
  {
    'rating': 1,
    'name': 'Carolina Herrera 212'
  },
  {
    'rating': 1,
    'name': 'Carolina Herrera 212 Sexy Men'
  },
  {
    'rating': 1,
    'name': 'Carolina Herrera CH'
  },
  {
    'rating': 1,
    'name': 'Caron Acaciosa'
  },
  {
    'rating': 1,
    'name': 'Caron Farnesiana'
  },
  {
    'rating': 1,
    'name': 'Caron French Cancan'
  },
  {
    'rating': 1,
    'name': 'Caron Miss Rocaille'
  },
  {
    'rating': 1,
    'name': 'Caron Royal Bain de Caron'
  },
  {
    'rating': 1,
    'name': 'Caron Tabac Blond'
  },
  {
    'rating': 1,
    'name': 'Carthusia Carthusia Uomo'
  },
  {
    'rating': 1,
    'name': 'Cartier Delices eau de toilette'
  },
  {
    'rating': 1,
    'name': 'Cartier Delices parfum'
  },
  {
    'rating': 1,
    'name': 'Cartier Must de Cartier'
  },
  {
    'rating': 1,
    'name': 'Cartier Pasha'
  },
  {
    'rating': 1,
    'name': 'Celine Dion Belong'
  },
  {
    'rating': 1,
    'name': 'Chanel Allure Homme'
  },
  {
    'rating': 1,
    'name': 'Chanel Allure Homme Sport'
  },
  {
    'rating': 1,
    'name': 'Chanel Allure Homme Sport Cologne'
  },
  {
    'rating': 1,
    'name': 'Chanel Chance Eau Fraiche'
  },
  {
    'rating': 1,
    'name': 'Chanel Gardenia'
  },
  {
    'rating': 1,
    'name': 'Chanel Pour Monsieur Concentre'
  },
  {
    'rating': 1,
    'name': 'Chantecaille Le Jasmin'
  },
  {
    'rating': 1,
    'name': 'Chantecaille Wisteria'
  },
  {
    'rating': 1,
    'name': 'Chopard Wish Pink Diamond'
  },
  {
    'rating': 1,
    'name': 'Chopard Wish Turquoise Diamond'
  },
  {
    'rating': 1,
    'name': 'Christian Lacroix C\'est la Fete'
  },
  {
    'rating': 1,
    'name': 'Clean Clean'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Fresh Laundry'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Lather'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Men'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Provence'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Shower Fresh'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Ultimate'
  },
  {
    'rating': 1,
    'name': 'Clean Clean Warm Cotton'
  },
  {
    'rating': 1,
    'name': 'Clive Christian 1872 for Women'
  },
  {
    'rating': 1,
    'name': 'Coty Avatar'
  },
  {
    'rating': 1,
    'name': 'Coty Emeraude'
  },
  {
    'rating': 1,
    'name': 'Coty Miss Sixty'
  },
  {
    'rating': 1,
    'name': 'Creative Scentualization Light Comes from Within'
  },
  {
    'rating': 1,
    'name': 'Creed Erolfa'
  },
  {
    'rating': 1,
    'name': 'Creed Irisia'
  },
  {
    'rating': 1,
    'name': 'Creed Love in White'
  },
  {
    'rating': 1,
    'name': 'Creed Original Santal'
  },
  {
    'rating': 1,
    'name': 'Creed Original Vetiver'
  },
  {
    'rating': 1,
    'name': 'Creed Silver Mountain Water'
  },
  {
    'rating': 1,
    'name': 'Creed Vetiver'
  },
  {
    'rating': 1,
    'name': 'Davidoff Echo'
  },
  {
    'rating': 1,
    'name': 'Davidoff Echo Woman'
  },
  {
    'rating': 1,
    'name': 'Dior Higher Energy'
  },
  {
    'rating': 1,
    'name': 'Dior Midnight Poison'
  },
  {
    'rating': 1,
    'name': 'Diptyque Do Son'
  },
  {
    'rating': 1,
    'name': 'Diptyque Eau de Lierre'
  },
  {
    'rating': 1,
    'name': 'Dolce & Gabbana Light Blue'
  },
  {
    'rating': 1,
    'name': 'Dolce & Gabbana Light Blue pour Homme'
  },
  {
    'rating': 1,
    'name': 'Dunhill Desire Blue'
  },
  {
    'rating': 1,
    'name': 'Dunhill Pursuit'
  },
  {
    'rating': 1,
    'name': 'Elizabeth Arden Mediterranean'
  },
  {
    'rating': 1,
    'name': 'Elizabeth Arden Provocative Woman'
  },
  {
    'rating': 1,
    'name': 'Elizabeth Taylor Forever Elizabeth'
  },
  {
    'rating': 1,
    'name': 'Elizabeth Taylor Gardenia'
  },
  {
    'rating': 1,
    'name': 'Elizabeth Taylor Passion'
  },
  {
    'rating': 1,
    'name': 'Escada Sentiment pour Homme'
  },
  {
    'rating': 1,
    'name': 'Estee Lauder Spellbound'
  },
  {
    'rating': 1,
    'name': 'Floris China Rose'
  },
  {
    'rating': 1,
    'name': 'Floris White Rose'
  },
  {
    'rating': 1,
    'name': 'Fresh Scents by Terri Breathe'
  },
  {
    'rating': 1,
    'name': 'Fresh Scents by Terri Dream'
  },
  {
    'rating': 1,
    'name': 'Fresh Scents by Terri Lulu'
  },
  {
    'rating': 1,
    'name': 'Fresh Scents by Terri Oh Baby'
  },
  {
    'rating': 1,
    'name': 'Fresh Scents by Terri Zoe'
  },
  {
    'rating': 1,
    'name': 'Gant Adventure'
  },
  {
    'rating': 1,
    'name': 'Ghost Ghost Cherish'
  },
  {
    'rating': 1,
    'name': 'Givenchy Amarige'
  },
  {
    'rating': 1,
    'name': 'Givenchy Amarige Mariage'
  },
  {
    'rating': 1,
    'name': 'Givenchy Ange ou Demon'
  },
  {
    'rating': 1,
    'name': 'Givenchy Pi'
  },
  {
    'rating': 1,
    'name': 'Givenchy Very Irresistible'
  },
  {
    'rating': 1,
    'name': 'Givenchy Very Irresistible for Men'
  },
  {
    'rating': 1,
    'name': 'Givenchy Very Irresistible Fresh Attitude'
  },
  {
    'rating': 1,
    'name': 'Givenchy Very Irresistible Sensual eau de parfum'
  },
  {
    'rating': 1,
    'name': 'Gres Cabotine'
  },
  {
    'rating': 1,
    'name': 'Guerlain Aqua Allegoria Grosellina'
  },
  {
    'rating': 1,
    'name': 'Guerlain Aqua Allegoria Lemon Fresca'
  },
  {
    'rating': 1,
    'name': 'Guerlain Aqua Allegoria Pivoine Magnifica'
  },
  {
    'rating': 1,
    'name': 'Guerlain Aqua Allegoria Tutti Kiwi'
  },
  {
    'rating': 1,
    'name': 'Guerlain Champs-Elysees'
  },
  {
    'rating': 1,
    'name': 'Guerlain Mayotte'
  },
  {
    'rating': 1,
    'name': 'Guerlain Purple Fantasy'
  },
  {
    'rating': 1,
    'name': 'Guerlain Vetiver Extreme'
  },
  {
    'rating': 1,
    'name': 'Guess Guess Man'
  },
  {
    'rating': 1,
    'name': 'Guess Guess Woman'
  },
  {
    'rating': 1,
    'name': 'Hermes Hiris'
  },
  {
    'rating': 1,
    'name': 'Hermes Rouge'
  },
  {
    'rating': 1,
    'name': 'Hugo Boss Hugo XX'
  },
  {
    'rating': 1,
    'name': 'Hugo Boss Pure Purple'
  },
  {
    'rating': 1,
    'name': 'Hugo Boss Selection'
  },
  {
    'rating': 1,
    'name': 'Iceberg Effusion Man'
  },
  {
    'rating': 1,
    'name': 'Iceberg Iceberg Homme'
  },
  {
    'rating': 1,
    'name': 'Iceberg Iceberg Twice Men'
  },
  {
    'rating': 1,
    'name': 'Jean Couturier Coriandre'
  },
  {
    'rating': 1,
    'name': 'Jean-Charles Brosseau Atlas Cedar'
  },
  {
    'rating': 1,
    'name': 'Jean-Charles Brosseau Fleurs d\'Ombre Jasmin Lilas'
  },
  {
    'rating': 1,
    'name': 'Jean-Paul Gaultier Gaultier 2'
  },
  {
    'rating': 1,
    'name': 'Jean-Paul Gaultier Jean-Paul Gaultier Classique Eau de Toilette'
  },
  {
    'rating': 1,
    'name': 'Jean-Paul Gaultier Jean-Paul Gaultier Classique Eau d\'Ete'
  },
  {
    'rating': 1,
    'name': 'Jil Sander Jil Sander Style'
  },
  {
    'rating': 1,
    'name': 'Joop! Joop! Go'
  },
  {
    'rating': 1,
    'name': 'Keiko Mecheri Loukhoum'
  },
  {
    'rating': 1,
    'name': 'Kenneth Cole RSVP'
  },
  {
    'rating': 1,
    'name': 'La Prairie Silver Rain'
  },
  {
    'rating': 1,
    'name': 'Lacoste Essential'
  },
  {
    'rating': 1,
    'name': 'Lacoste Inspiration'
  },
  {
    'rating': 1,
    'name': 'Lalique Le Parfum'
  },
  {
    'rating': 1,
    'name': 'Lancome O Oui!'
  },
  {
    'rating': 1,
    'name': 'Lancome Poeme'
  },
  {
    'rating': 1,
    'name': 'Lanvin Rumeur'
  },
  {
    'rating': 1,
    'name': 'L\'Aritsan Parfumeur Mechant Loup'
  },
  {
    'rating': 1,
    'name': 'Le Labo Ambrette 9'
  },
  {
    'rating': 1,
    'name': 'Le Labo Bergamote 22'
  },
  {
    'rating': 1,
    'name': 'Le Labo Fleur d\'Oranger 27'
  },
  {
    'rating': 1,
    'name': 'Le Labo Jasmin 17'
  },
  {
    'rating': 1,
    'name': 'Lorenzo Villoresi Alamut'
  },
  {
    'rating': 1,
    'name': 'Lorenzo Villoresi Garofano'
  },
  {
    'rating': 1,
    'name': 'Lulu Guinness Cast a Spell'
  },
  {
    'rating': 1,
    'name': 'Lulu Guinness Lulu Guinness'
  },
  {
    'rating': 1,
    'name': 'LUSH Honey I Washed the Kids'
  },
  {
    'rating': 1,
    'name': 'Marc Jacobs Marc Jacobs Men'
  },
  {
    'rating': 1,
    'name': 'Mary Kay Domain'
  },
  {
    'rating': 1,
    'name': 'Mary Kay Elige'
  },
  {
    'rating': 1,
    'name': 'Mary Kay Tribute'
  },
  {
    'rating': 1,
    'name': 'Mary Kay Velocity'
  },
  {
    'rating': 1,
    'name': 'Mary-Kate and Ashley L.A. Style'
  },
  {
    'rating': 1,
    'name': 'Mary-Kate and Ashley N.Y. Chic'
  },
  {
    'rating': 1,
    'name': 'Mauboussin Mauboussin Homme'
  },
  {
    'rating': 1,
    'name': 'Michael Kors Michael'
  },
  {
    'rating': 1,
    'name': 'Mona di Orio Carnation'
  },
  {
    'rating': 1,
    'name': 'Mona di Orio Lux'
  },
  {
    'rating': 1,
    'name': 'Mona di Orio Nuit Noire'
  },
  {
    'rating': 1,
    'name': 'Mona di Orio Oiro'
  },
  {
    'rating': 1,
    'name': 'Mont Blanc Individuel'
  },
  {
    'rating': 1,
    'name': 'Mont Blanc Starwalker'
  },
  {
    'rating': 1,
    'name': 'Montana Montana Mood Sexy'
  },
  {
    'rating': 1,
    'name': 'Montana Montana Mood Soft'
  },
  {
    'rating': 1,
    'name': 'Morgan Morgan de Toi'
  },
  {
    'rating': 1,
    'name': 'Morgan Sweet Paradise'
  },
  {
    'rating': 1,
    'name': 'Nanette Lepore Nanette Lepore'
  },
  {
    'rating': 1,
    'name': 'Nanette Lepore Shanghai Butterfly'
  },
  {
    'rating': 1,
    'name': 'Paco Rabanne Black XS'
  },
  {
    'rating': 1,
    'name': 'Paco Rabanne Ultraviolet'
  },
  {
    'rating': 1,
    'name': 'Paco Rabanne Ultraviolet Man'
  },
  {
    'rating': 1,
    'name': 'Paris Hilton Can Can'
  },
  {
    'rating': 1,
    'name': 'Paris Hilton Heiress'
  },
  {
    'rating': 1,
    'name': 'Paris Hilton Just Me'
  },
  {
    'rating': 1,
    'name': 'Paris Hilton Just Me for Men'
  },
  {
    'rating': 1,
    'name': 'Paris Hilton Paris Hilton'
  },
  {
    'rating': 1,
    'name': 'Paul Sebastian Design'
  },
  {
    'rating': 1,
    'name': 'Phat Farm Atman'
  },
  {
    'rating': 1,
    'name': 'Ralph Lauren Lauren Style'
  },
  {
    'rating': 1,
    'name': 'Ralph Lauren Polo Black'
  },
  {
    'rating': 1,
    'name': 'Ralph Lauren Polo Blue'
  },
  {
    'rating': 1,
    'name': 'Ralph Lauren Romance Men'
  },
  {
    'rating': 1,
    'name': 'Revlon Charlie!'
  },
  {
    'rating': 1,
    'name': 'Roberto Cavalli Just Cavalli Her'
  },
  {
    'rating': 1,
    'name': 'Roberto Cavalli Serpentine'
  },
  {
    'rating': 1,
    'name': 'Rochas Aquawoman'
  },
  {
    'rating': 1,
    'name': 'Rochas Desir de Rochas Femme'
  },
  {
    'rating': 1,
    'name': 'Rochas Desir de Rochas Homme'
  },
  {
    'rating': 1,
    'name': 'Roots Roots Spirit'
  },
  {
    'rating': 1,
    'name': 'Roots Roots Spirit Man'
  },
  {
    'rating': 1,
    'name': 'Salvador Dali Daliflor'
  },
  {
    'rating': 1,
    'name': 'Salvador Dali Eau de Rubylips'
  },
  {
    'rating': 1,
    'name': 'Salvador Dali Laguna Homme'
  },
  {
    'rating': 1,
    'name': 'Salvador Dali Sea and Sun in Cadaques'
  },
  {
    'rating': 1,
    'name': 'Serge Lutens Miel de Bois'
  },
  {
    'rating': 1,
    'name': 'Sisley Eau du Soir'
  },
  {
    'rating': 1,
    'name': 'Sisley Soir de Lune'
  },
  {
    'rating': 1,
    'name': 'Stella McCartney Sheer Stella 2007'
  },
  {
    'rating': 1,
    'name': 'Tann Rokka Aki'
  },
  {
    'rating': 1,
    'name': 'Valentino Rock\'n Rose'
  },
  {
    'rating': 1,
    'name': 'Valentino Valentino'
  },
  {
    'rating': 1,
    'name': 'Vera Wang Princess'
  },
  {
    'rating': 1,
    'name': 'Vera Wang Vera Wang for Men'
  },
  {
    'rating': 1,
    'name': 'Versace Bright Crystal'
  },
  {
    'rating': 1,
    'name': 'Versace Crystal Noir'
  },
  {
    'rating': 1,
    'name': 'Versace Versace Jeans Couture Man'
  },
  {
    'rating': 1,
    'name': 'Versace Versace Man Eau Fraiche'
  },
  {
    'rating': 1,
    'name': 'Victoria\'s Secret Beauty Rush Appletini'
  },
  {
    'rating': 1,
    'name': 'Victoria\'s Secret Pink Beach'
  },
  {
    'rating': 1,
    'name': 'Victoria\'s Secret Very Sexy for Her'
  },
  {
    'rating': 1,
    'name': 'Victoria\'s Secret Very Sexy Hot'
  },
  {
    'rating': 1,
    'name': 'Viktor & Rolf Flowerbomb'
  },
  {
    'rating': 1,
    'name': 'Vivienne Westwood Anglomania'
  },
  {
    'rating': 1,
    'name': 'Vivienne Westwood Boudoir'
  },
  {
    'rating': 1,
    'name': 'Vivienne Westwood Boudoir Sin Garden'
  }
];
// var RATINGS = [];
/**
 * NoseTime Tweaks!
 */
var NTTweak = {
  NTElements: {
    /**
       * Type.
       * @return {Node}
       */
    get TypeNode() {
      return '[href^="/xiangdiao/1"]'.query();
    },
    /**
       * Original name.
       * @return {string}
       */
    get OriginalName() {
      var element = '.itemMain h1'.query();
      if (element == null) return null;
      if (element.textContent.contains(',')) return element.textContent.split(' ').slice(2, - 1).join(' ').slice(0, - 1);
       else return element.textContent.split(' ').slice(2).join(' ');
    }
  },
  Resources: {
    Selectors: {
      OnCopyEventAttachedElements: '#itemcomment, #itemdiscuss, body, .desc',
      LongevityBarInnerContainer: '.dd .inbar'
    },
    HTMLElements: {
      _copyTip: null,
      get CopyTip() {
        if (this._copyTip == null) this._copyTip = createElementFromHTML('<div id="_copyTip">\n                <p>' + NTTweak.Resources.Options.CopyTipContent + '</p>\n            </div>');
        return this._copyTip;
      },
      LongevityNumeralIndicator: createElementFromHTML('<div id="longevity-indicator">\n            </div>'),
      FragranticaTip: createElementFromHTML('<div id="fragranticaTip">\n                <h4>ON FRAGRANTICA</h4>\n                <h2 id="frag-name">Pending...</h2>\n         <h4> LT & TS</h4>\n                <h3 id="frag-lt-ts">Pending....</h3>       <h4>RATING</h4>\n                <h3 id="frag-rating">Pending...</h3>\n                <h4>VOTES</h4>\n                <h3 id="frag-votes">Pending....</h3>\n                <h4>LONGEVITY</h4>\n                <h3 id="frag-longevity">Pending....</h3>\n                <h4>SILLAGE</h4>\n                <h3 id="frag-sillage">Pending...</h3>\n                   <h4><a id="frag-url" target="_blank">TO FRAGRANTICA ></a></h4>\n             </div>')
    },
    Stylesheets: {
      FragranticaTip: createElementFromHTML('<style rel="stylesheet">\n                #fragranticaTip {\n                    position: fixed;\n                    width: 20vw;\n                    top: 0;\n                    right: -22.75vw;\n                    height: 100vw;\n                    background-color: rgba(160, 189, 231, 0.9);\n                    z-index: 9999;\n                    padding: 7.5vh 2vw;\n                    transition: right 500ms ease-in-out;\n                }\n                #fragranticaTip:hover {\n                    right: 0;\n                }\n                #fragranticaTip h4 {\n                    font-size: 1.2em;\n                    color: #5a71a5;\n                    padding-bottom: .65vh;\n                    font-weight: lighter;\n                }\n                #fragranticaTip h4 a {\n                    padding-top: 2vh;\n                    font-size: 1em;\n                    color: #5a71a5;\n                    padding-bottom: .65vh;\n                    text-decoration: none;\n                    font-style: italic;\n                    font-weight: lighter;\n                }\n                #fragranticaTip h3 {\n                    font-size: 1.75em;\n                    color: #516594;\n                    padding-bottom: 3vh;\n                }\n                #fragranticaTip h2 {\n                    font-size: 2.25em;\n                    color: #516594;\n                    padding-bottom: 3vh;\n                }\n            </style>'),
      CopyTip: createElementFromHTML('<style rel="stylesheet">\n                #_copyTip {\n                    background-color: bisque;\n                    color: dimgray;\n                    font-size: 1.25em;\n                    width: 60vw;\n                    max-width: 75vw;\n                    max-height: 7.5vh;\n                    display: none;\n                    position: fixed;\n                    bottom: 5vh;\n                    left: 12.5vw;\n                    z-index: 1000;\n                    border: 2px dotted dimgray;\n                    text-align: center;\n                    margin: 0 auto;\n                }\n                #_copyTip p {\n                    position: relative;\n                    padding: .5em 0;\n                    margin: auto 0;\n                }\n             </style>'),
      LongevityNumeralIndicator: createElementFromHTML('<style rel="stylesheet">\n                 #longevity-indicator {\n                     line-height: 12px;\n                     text-align: right;\n                     padding: 0 5px;\n                     color: rebeccapurple;\n                 }\n             </style>')
    },
    Options: {
      JQueryAvailabilityInquiryInterval: 500,
      ShowCopyTip: true,
      CopyTipContent: '選着個物事已經複製好了，但是還請尊重作者個版權，勿要亂用',
      FragranticaRequestHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Host': 'www.fragrantica.com',
        'Referer': 'https://www.fragrantica.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
      }
    }
  },
  /**
    * Get all registered callbacks associated with an element.
    * @param element {HTMLElement|jQuery} The element.
    * @return {Object} A map of all events and their callbacks.
    */
  getRegisteredCallbacks: function getRegisteredCallbacks(element) {
    if (!(element instanceof jQuery)) element = $(element);
    if (typeof jQuery._data == 'function') return jQuery._data(element[0], 'events') || {
    };
     else if (typeof element.data == 'function') return element.data('events') || {
    };
    return {
    };
  },
  /**
    * Deregister on copy callback.
    */
  deregisterOnCopyCallback: function deregisterOnCopyCallback() {
    var _this = this;
    var that = this;
    document.querySelectorAll(this.Resources.Selectors.OnCopyEventAttachedElements).toArray().forEach(function (element) {
      var $element = $(element);
      var currentOnCopyCallback = _this.getRegisteredCallbacks(element) ['copy'];
      if (currentOnCopyCallback != undefined) {
        // deal with multiple version of jQuery
        var unbindFunction = $element.off ? $element.off : $element.unbind;
        var bindFunction = $element.on ? $element.on : $element.bind;
        // unbind on copy event
        unbindFunction.call($element, 'copy');
        // show copy tip if set
        if (that.Resources.Options.ShowCopyTip) {
          bindFunction.call($element, 'copy', function (event) {
            setTimeout(function () {
              $(that.Resources.HTMLElements.CopyTip).fadeOut(350);
            }, 1500);
            $(that.Resources.HTMLElements.CopyTip).fadeIn(350);
          });
        }
      } else {
        ('Skipping element for that it has no copy event listener bound to it: ' + $element).log();
      }
    });
    'Process completed, all copy prevention removed'.log();
  },
  /**
    * A proxy for on load event.
    */
  onLoadCallback: function onLoadCallback() {
    if (window.jQuery != undefined) {
      'JQuery loaded, begin processing...'.log();
      NTTweak.deregisterOnCopyCallback();
    } else {
      'JQuery still loading, pending...'.log();
      setTimeout(NTTweak.onLoadCallback, NTTweak.Resources.Options.JQueryAvailabilityInquiryInterval);
    }
  },
  /**
    * Show the indicator for longevity.
    */
  showLongevityIndicator: function showLongevityIndicator() {
    var innerBar = this.Resources.Selectors.LongevityBarInnerContainer.query();
    if (innerBar == null) {
      'No longevity bar indicator found, skipping longevity quantification'.log();
      return;
    }
    var longevity = parseInt(innerBar.style.width.replace(/%/g, ''));
    ('Found original longevity ' + longevity).log();
    var adjustedLongevity = (longevity - 25) / 75 * 120;
    // longevity = longevity * 50 / 4
    this.Resources.HTMLElements.LongevityNumeralIndicator.textContent = adjustedLongevity.toFixed(1);
    document.body.appendChild(this.Resources.Stylesheets.LongevityNumeralIndicator);
    innerBar.appendChild(this.Resources.HTMLElements.LongevityNumeralIndicator);
  },
  /**
    * Adjust the name of Chypre.
    */
  adjustChypreName: function adjustChypreName() {
    var textNodeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (textNodeWalker.nextNode()) {
      var currentNode = textNodeWalker.currentNode;
      if (currentNode.textContent.contains('甘苔')) currentNode.textContent = currentNode.textContent.replace('甘苔', '西普');
      if (currentNode.textContent.contains('柑苔')) currentNode.textContent = currentNode.textContent.replace('柑苔', '西普');
    }
  },
  /**
    * Adjust the fragrance name from NoseTime.
    * @param {String} originalName Original name.
    * @return {string} Adjusted name.
    */
  adjustNoseTimeFragranceName: function adjustNoseTimeFragranceName(originalName) {
    var newName = originalName.replace('YSL', '');
    var words = [
    ];
    var previous = '';
    newName.split(' ').forEach(function (word) {
      if (previous != word) words.push(word);
      previous = word;
    });
    return words.join(' ').trim();
  },
  /**
    * Update fragrantica tip.
    * @param fragrance Fragrance.
    * @param fragranceName Fragrance name.
    * @param fragranceUrl Fragrance url.
    * @param urlName Url name.
    */
  updateFragranticaTip: function updateFragranticaTip(fragrance, fragranceName, fragranceUrl, urlName) {
    var realUrlName = urlName.split('/').slice(2).join(' ').split('-').slice(0, - 1).join(' ');
    document.querySelector('#frag-name').textContent = realUrlName;
    document.querySelector('#frag-rating').textContent = fragrance.rating;
    document.querySelector('#frag-votes').textContent = fragrance.ratingCount;
    document.querySelector('#frag-longevity').textContent = fragrance.longevity.toFixed(2);
    document.querySelector('#frag-sillage').textContent = fragrance.sillage.toFixed(2);
    document.querySelector('#frag-url').setAttribute('href', fragranceUrl);
  },
  /**
    * Update the status of fragrantica request.
    * @param status {string} Status.
    */
  updateFragranticaRequestStatus: function updateFragranticaRequestStatus(status) {
    document.querySelector('#frag-name').textContent = status;
    document.querySelector('#frag-rating').textContent = status;
    document.querySelector('#frag-votes').textContent = status;
    document.querySelector('#frag-longevity').textContent = status;
    document.querySelector('#frag-sillage').textContent = status;
  },
  /**
    * Parse the response from fragrantica.
    * @param response {XMLHttpRequest} The response.
    * @param targetFragranceName {string} Target fragrance name.
    */
  parseFragranticaCandidates: function parseFragranticaCandidates(response, targetFragranceName) {
    // check response format
    if (!response.responseText) {
      'Unexpected response from FRAGRANTICA'.log();
      return null;
    }    // create dummy DOM

    var dummyDom = document.createElement('div');
    dummyDom.innerHTML = response.responseText;
    // parse candidates
    var fragranceCandidates = dummyDom.querySelectorAll('[href^="/perfume"]').toArray();
    // find the most possible one based on similarity
    var similarity = {
    };
    fragranceCandidates.forEach(function (fragrance) {
      var href = fragrance.getAttribute('href');
      var urlName = href.split('/').slice(2).join(' ').split('-').slice(0, - 1).join(' ');
      urlName = NTTweak.adjustNoseTimeFragranceName(urlName);
      similarity[href] = NTTweak.similarity(urlName, targetFragranceName);
      ('Comparing <' + urlName + '> with <' + targetFragranceName + '>: ' + similarity[href]).log();
    });
    var chosen = fragranceCandidates.sort(function (a, b) {
      return similarity[b.getAttribute('href')] - similarity[a.getAttribute('href')];
    }) [0];
    ('Chosen fragrance <' + chosen.getAttribute('href').split('/').slice(2).join(' ').split('-').slice(0, - 1).join(' ') + '>').log();
    return chosen;
  },
  /**
    * Parse the response from fragrantica of one fragrance.
    * @param response {XMLHttpRequest} The response.
    */
  parseFragranticaPage: function parseFragranticaPage(response) {
    if (!response.responseText || response.status != 200) {
      'Unexpected response from FRAGRANTICA, could not parse fragrance page'.log();
      return null;
    }    // parse dummy DOM

    var dummyDom = new DOMParser().parseFromString(response.responseText, 'text/html');
    // parse rating
    var rating = dummyDom.querySelector('[itemprop="ratingValue"]').textContent;
    var ratingCount = dummyDom.querySelector('[itemprop="ratingCount"]').textContent;
    // parse longevity
    var longevityNodes = dummyDom.querySelectorAll('.long .ndSum').toArray();
    var sum = 0;
    var voteSum = 0;
    sum += parseInt(longevityNodes[1].textContent) * 30;
    voteSum += parseInt(longevityNodes[1].textContent);
    sum += parseInt(longevityNodes[2].textContent) * 55;
    voteSum += parseInt(longevityNodes[2].textContent);
    sum += parseInt(longevityNodes[3].textContent) * 75;
    voteSum += parseInt(longevityNodes[3].textContent);
    sum += parseInt(longevityNodes[4].textContent) * 110;
    voteSum += parseInt(longevityNodes[4].textContent);
    var avgLongevity = sum / voteSum;
    // parse sillage
    var sillageNodes = dummyDom.querySelectorAll('.sil .ndSum').toArray();
    sum = 0;
    voteSum = 0;
    sum += parseInt(sillageNodes[0].textContent) * 30;
    voteSum += parseInt(sillageNodes[0].textContent);
    sum += parseInt(sillageNodes[1].textContent) * 60;
    voteSum += parseInt(sillageNodes[1].textContent);
    sum += parseInt(sillageNodes[2].textContent) * 95;
    voteSum += parseInt(sillageNodes[2].textContent);
    sum += parseInt(sillageNodes[3].textContent) * 110;
    voteSum += parseInt(sillageNodes[3].textContent);
    var avgSillage = sum / voteSum;
    return {
      rating: (parseFloat(rating) * 2).toFixed(1),
      ratingCount: ratingCount,
      longevity: avgLongevity,
      sillage: avgSillage
    };
  },
  /**
     * Hide FRAGRANTICA tip.
     */
  hideTip: function hideTip() {
    document.querySelector('#fragranticaTip').style.display = 'none';
  },
  /**
    * Query information from fragrantica.com.
    */
  queryFragrantica: function queryFragrantica() {
    var fragranceName = this.NTElements.OriginalName;
    if (fragranceName === null) {
      'No original name found on page, skipping FRAGRANTICA query'.log();
      NTTweak.updateFragranticaRequestStatus('N/A');
      NTTweak.hideTip();
      return;
    }
    fragranceName = NTTweak.adjustNoseTimeFragranceName(fragranceName);
    // noinspection JSUnresolvedFunction
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://www.fragrantica.com/ajax.php?view=qsearch&q=' + fragranceName.replace(' ', '+') + '&qgender=female%2Cmale%2Cunisex&searchtype=perfumes',
      headers: NTTweak.Resources.Options.FragranticaRequestHeaders,
      onload: function onload(response) {
        var fragranceUrl = NTTweak.parseFragranticaCandidates(response, fragranceName);
        if (fragranceUrl == null) {
          ('Could not find fragrance <' + fragranceName + '> from FRAGRANTICA').log();
          return;
        }
        fragranceUrl = fragranceUrl.getAttribute('href').replace('https://www.nosetime.com/', '');
        fragranceUrl = fragranceUrl.replace('http://www.nosetime.com/', '');
        // open fragrance page
        // noinspection JSUnresolvedFunction
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://www.fragrantica.com/' + fragranceUrl,
          headers: NTTweak.Resources.Options.FragranticaRequestHeaders,
          onload: function onload(response) {
            var fragrance = NTTweak.parseFragranticaPage(response);
            if (fragrance == null) {
              'Could not parse fragrance page <' + fragranceName + '> from FRAGRANTICA';
              return;
            }('Queried information of <' + fragranceName + '> from FRAGRANTICA:').log();
            '==============================='.log();
            ('||     Rating     ' + fragrance.rating).log();
            ('||     Votes      ' + fragrance.ratingCount).log();
            ('||     Longevity  ' + fragrance.longevity.toFixed(2)).log();
            ('||     Sillage    ' + fragrance.sillage.toFixed(2)).log();
            '==============================='.log();
            NTTweak.updateFragranticaTip(fragrance, fragranceName, 'https://fragrantica.com/' + fragranceUrl, fragranceUrl);
          },
          onerror: function onerror(error) {
            ('Could not load from ' + fragranceUrl + ': ' + error).log();
            NTTweak.updateFragranticaRequestStatus('Fetch failed');
          }
        });
        ('Requesting from FRAGRANTICA: ' + fragranceName + ' (https://www.fragrantica.com/' + fragranceUrl + ')...').log();
        NTTweak.updateFragranticaRequestStatus('Fetching...');
      },
      onerror: function onerror(error) {
        ('Could not load from FRAGRANTICA: ' + error).log();
        NTTweak.updateFragranticaRequestStatus('Search failed');
      }
    });
    ('Searching FRAGRANTICA for <' + fragranceName + '>...').log();
    NTTweak.updateFragranticaRequestStatus('Searching...');
  },
  /**
    * Calculate the edit distance between two string.
    * @param s1 One string.
    * @param s2 Another string.
    * @return {Number} Edit distance.
    */
  editDistance: function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var costs = [
    ];
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
         else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  },
  /**
    * Calculate the similarity distance between two string.
    * @param s1 One string.
    * @param s2 Another string.
    * @return {Number} Similarity.
    */
  similarity: function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1;
    }
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
  },
  /**
     * Find matching records of this fragrance from LT & TS.
     */
  matchLtTs: function matchLtTs() {
    var fragranceName = this.NTElements.OriginalName;
    if (fragranceName === null) {
      'No original name found on page, skipping LT & TS query...'.log();
      document.querySelector('#frag-lt-ts').textContent = 'N/A';
      return;
    }
    fragranceName = NTTweak.adjustNoseTimeFragranceName(fragranceName);
    fragranceName = fragranceName.replace('Bvlgari', 'Bulgari');
    if (fragranceName == 'Bulgari Extreme') fragranceName = 'Bulgari Pour Homme Extreme';
    if (fragranceName.replace('Jo Malone', '') != fragranceName) fragranceName = fragranceName + " Cologne";
    if (fragranceName.replace('Les Exclusifs de Chanel', '') != fragranceName) fragranceName = fragranceName.replace('Les Exclusifs de Chanel', '');
    fragranceName.replace('°', '');
    var closest = 0;
    var closestOne = {
    };
    for (var i = 0; i < RATINGS.length; i++) {
      var similarity = NTTweak.similarity(fragranceName, RATINGS[i].name);
      if (similarity > closest) {
        closest = similarity;
        closestOne = RATINGS[i];
      }
    }
    if (closestOne.name == null) {
      ('No LT & TS record found for this fragrance <' + fragranceName + '>').log();
      document.querySelector('#frag-lt-ts').textContent = 'No Record';
      return;
    }
    if (closest < 0.8) {
      fragranceName = fragranceName.replace("Eau de Toilette", "").trim();
      fragranceName = fragranceName.replace("Eau de Parfum", "").trim();
      closest = 0;
      closestOne = {
      };
      for (var i = 0; i < RATINGS.length; i++) {
        var similarity = NTTweak.similarity(fragranceName, RATINGS[i].name);
        if (similarity > closest) {
          closest = similarity;
          closestOne = RATINGS[i];
        }
      }
      if (closest < 0.8 || closestOne.name == null) {
        ('No LT & TS record found for this fragrance <' + fragranceName + '>').log();
        document.querySelector('#frag-lt-ts').textContent = 'No Record';
        return;
      }
    }
    ('Found LT & TS record for fragrance <' + fragranceName + '>: ' + closestOne.rating).log();
    ('Found it by the name of <' + closestOne.name + '>').log();
    //       document.querySelector('#frag-lt-ts').textContent = closestOne.rating.toString();
    document.querySelector('#frag-lt-ts').textContent = '●●●●●◌◌◌◌◌'.substring(5 - closestOne.rating, 10 - closestOne.rating);
  }
};
// set up on load event
window.addEventListener('load', function () {
  document.body.appendChild(NTTweak.Resources.HTMLElements.CopyTip);
  document.body.appendChild(NTTweak.Resources.Stylesheets.CopyTip);
  document.body.appendChild(NTTweak.Resources.HTMLElements.FragranticaTip);
  document.body.appendChild(NTTweak.Resources.Stylesheets.FragranticaTip);
  // NTTweak.onLoadCallback()
  NTTweak.showLongevityIndicator();
 // NTTweak.adjustChypreName();
  NTTweak.matchLtTs();
  NTTweak.queryFragrantica();
});
// debug entrance
window.ntt = NTTweak;
//# sourceMappingURL=NoseTimeCopyPreventionHack-compiled.js.map

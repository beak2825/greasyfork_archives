// ==UserScript==
// @name         Word Highlighter aka Boycott Brands
// @namespace    http://your-namespace.com
// @version      1.0.0
// @description  Highlight words from a given array on web pages.
// @author       kar1nca
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479111/Word%20Highlighter%20aka%20Boycott%20Brands.user.js
// @updateURL https://update.greasyfork.org/scripts/479111/Word%20Highlighter%20aka%20Boycott%20Brands.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // Define the array of words to be highlighted
  var wordsToHighlight = ["example", "word", "highlight", "tampermonkey", "nestle", "adidas", "vakko", "Marks&Spencer", "Marks Spencer", "Marks & Spencer",
    "Chokella", "Danino", "Danette", "Activia", "Birtat", "Milupa", "Bebelac", "Nutricia", "Damak", "Loreal Kiehl’s", "Loreal Kiehls", "Maybelline",
    "Garnier", "Helena Rubinstein", "Lancome", "Ralph Lauren", "Giorgio Armani Parfüm", "Cacharel", "Kerastase", "La Roche Posay", "PetCare",
    "Kit Kat", "Purina", "Coffee-Mate", "Coffee Mate", "Alaçam", "Pure Life", "polo ralph lauren", "parizyen",
    "algida", "Tropicana", "Mars", "kitapyurdu", "calvin klein", "Fuse tea", "Fusetea", "Doğadan", "timberland", "giorgio armani", "giorgioarmani",
    "danone", "maggi", "nescafé", "nescafe", "jacobs", "banana", "mcdonald’s", "mcdonalds", "mc donalds", "calve", "sırma", "rama", "sana", "first sakız",
    "falım", "kraft", "fritolay", "milka", "lays", "lay's", "coca cola", "cola", "coca-cola", "fanta", "damla su", "damlasu", "sırma su", "sırmasu",
    "hayat su", "hayatsu", "cappy meyve su", "cappy", "akmina", "ace", "air wick", "airwick", "ajax", "aldays", "alo", "ariel", "axe", "blendax",
    "calgon", "carrefour", "carrefoursa", "clear", "clit bang", "clitbang", "colgate", "diadermine", "fa", "fairy", "head & shoulders", "headshoulders",
    "head shoulders", "hacı şakir", "hacışakir", "İpana", "jhonsons baby", "jhonsonsbaby", "loreal", "max factor", "maxfactor", "nıvea", "nivea", "oral-b",
    "oralb", "palmolive", "pantene", "prima", "rexona", "schwarzkopf", "signal", "viecnetta", "vileda", "vanish", "vaseline", "nokia", "apple", "mazda",
    "pontiac", "saab", "parlement", "marlboro", "murattı", "muratti", "lark bond street", "larkbondstreet", "lark", "alarko jeneratör", "alarko",
    "alarko klima", "astel bant", "astelbant", "citibank", "citi bank", "kodak", "la roche", "lipton", "bayer", "sandoz", "saned", "starbucks", "puma", "subway",
    "hyundai", "accenture", "accuweather", "actioniq", "airbnb", "alaska air", "alliancebernstein", "allianz", "amazon", "amdocs", "american airlines",
    "americanairlines", "american eagle", "americaneagle", "american express", "americanexpress", "american wire group", "amwell", "apollo",
    "arentfox schiff", "arentfoxschiff", "atlassian", "authentic brands", "authenticbrands", "avery dennison", "averydennison", "axel springer",
    "axelspringer", "bain & company", "bain company", "baincompany", "bank of america", "bank of new york mellon", "bath & body works", "bath body works",
    "baupost group", "baupostgroup", "blackrock", "blackstone", "capri holdings", "capriholdings", "caretrust reit", "chanel", "chapman and cutler",
    "citadel", "comcast", "conde nast", "condenast", "cv starr", "cvstarr", "davis polk", "davispolk", "delta air lines", "deutsche bank", "deutschebank",
    "edelman", "endeavor", "estee lauder", "esteelauder", "gamida cell", "gamidacell", "general catalyst", "generalcatalyst", "general motors",
    "generalmotors", "goldman sachs", "goldmansachs", "hearst", "hp", "hewlett packard", "hewlettpackard", "hewlett packard enterprise", "huntsman corp",
    "huntsmancorp", "insight partners", "insightpartners", "instacart", "intermedia", "jazwares", "jpmorgan", "lemonade", "levi strauss", "levistrauss",
    "live nation entertainment", "major league baseball", "manpower group", "manpowergroup", "marsh & mclennan", "marsh mclennan", "mastercard", "mattel",
    "merck kgaa", "merckkgaa", "meta", "facebook", "morgan lewis", "morganlewis", "morgan stanley", "morganstanley", "nasdaq",
    "national basketball association", "nba", "neogames", "novartis", "nvidia", "okta", "oracle", "orkid", "omo", "pepsi", "palantir", "paramount global", "paramountglobal",
    "paul weiss", "paulweiss", "pershing square", "pershingsquare", "prima", "pampers", "raytheon", "regeneron pharmaceuticals", "regeneronpharmaceuticals",
    "related companies", "relatedcompanies", "salesforce", "sap", "sequoia capital", "sequoiacapital", "seyfarth shaw", "seyfarthshaw", "skydance",
    "state street", "statestreet", "tesla", "teva pharmaceuticals", "tevapharmaceuticals", "tieks by gavrieli", "troutman pepper", "troutmanpepper",
    "united airlines", "universal music group", "volkswagen", "walmart", "warby parker", "warbyparker", "warner brothers discovery", "wells fargo",
    "wellsfargo", "winston & strawn", "winston strawn", "winstonstrawn", "ziff davis", "ziffdavis", "zoom"
  ];

  // Function to highlight words with custom styling
  function highlightWordsInText(text) {
    for (var j = 0; j < wordsToHighlight.length; j++) {
      var word = wordsToHighlight[j];
      var re = new RegExp("\\b" + word + "\\b", "gi");
      text = text.replace(re, function(match) {
        return '<span style="background-color: black; color: red; text-decoration: line-through;">' + match + '</span>';
      });
    }
    return text;
  }

  // Recursive function to traverse and highlight text nodes
  function traverseAndHighlight(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var highlightedText = highlightWordsInText(node.textContent);
      if (highlightedText !== node.textContent) {
        var span = document.createElement('span');
        span.innerHTML = highlightedText;
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (var i = 0; i < node.childNodes.length; i++) {
        traverseAndHighlight(node.childNodes[i]);
      }
    }
  }

  // Call the traverseAndHighlight function when the page is fully loaded
  window.addEventListener('load', function() {
    traverseAndHighlight(document.body);
  });
})();
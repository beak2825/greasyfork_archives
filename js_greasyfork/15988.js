// ==UserScript==
// @name        DBNA Post - Hider
// @namespace   dbnahider
// @description Versteckt Beiträge von bestimmten Usern auf DBNA.
// @include     http://*.dbna.de/webforum/*
// @include     https://*.dbna.de/webforum/*
// @version     0.2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15988/DBNA%20Post%20-%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/15988/DBNA%20Post%20-%20Hider.meta.js
// ==/UserScript==


//Zu löschender Benutzername als Array, bspw.:
//var usernames = ["username1", "username2"];
var usernames = [""];

//Beiträge bekommen
var posts = document.getElementsByClassName('name');

//Alle Beiträge durchgehen
for (var i = 0; i < posts.length; i++) {
  //Aktueller Beitrag
  var currentpost = posts[i];
  
  //Wenn Aktueller Beitrag vom Benutzer ist
  for(var j = 0; j < usernames.length; j++) {
    if(currentpost.innerHTML.indexOf(usernames[j]) != -1) {
      //Hochgehen in das umgebende <tr>
      post = currentpost.parentNode.parentNode;  
      //Inhalt sichern
      var postcontent = post;
      //Inhalt ist nur der wirkliche Post
      postcontent = postcontent.childNodes[3]; //Tabelle rund um den Post
      //Inhalt für "trotzdem anzeigen?"-Box
      actualcontent = findClass(postcontent, "postbody");
      //Post löschen bzw. ersetzen
      post.innerHTML = "<td class='row1' align='left' height='40' valign='top' style='background-color:#FF6666;'>"
      + "<img src='http://abload.de/img/skullmiu1h.png' alt='Blubb' width='32' height='32' /></td>"
      + "<td class='row1' height='40' nowrap='nowrap' valign='middle' style='background-color:#FF6666; vertical-align:middle;'>"
      + "Beitrag von <b>" 
      + usernames[j]
      + "</b> an dieser Stelle wurde versteckt. "
      + "<a href='javascript:hiddentoggle(" + i + ");'>Trotzdem Anzeigen?</a>"
      + "<div style='padding:10px; width:433px' id='hiddenpost" + i + "'>"
      + actualcontent
      + "</div></td>"; 
      //Hidden-Feld ausblenden
      document.getElementById("hiddenpost"+i).style.display = 'none';
      //Tabelle im Hidden-Feld auf richtige Breite
      document.getElementById("hiddenpost"+i).firstElementChild.width="433px";
      document.getElementById("hiddenpost"+i).firstElementChild.splay="block";
      document.getElementById("hiddenpost"+i).firstElementChild.style.wordWrap = "break-word";
      //Nächstes ELement ist das Suchfeld, das muss auch weg
      searchfield = post;
      //Schleife, damit Whitespace nicht als Element erkannt wird
      do {
        searchfield = searchfield.nextSibling;
      } while (searchfield && searchfield.nodeType !== 1);
      //Element gefunden!
      searchfield.innerHTML = "";
    } else { 
      //Wenn nicht, überspringen
    }
  }
}

//Zitate bekommen
var quotes = document.getElementsByClassName('genmed');

//Alle Zitate durchgehen
for(i = 0; i < quotes.length; i++) {
  //Aktuelles Zitat
  var currentquote = quotes[i];
  //Runtergehen ins <b>
  quote = currentquote.firstChild;  
  //Wenn aktuelles Zitat von User
  for(j = 0; j < usernames.length; j++) {
    //Schauen ob der Username in Quote enthalten ist ("x hat geschrieben")
    if(quote.innerHTML.indexOf(usernames[j]) != -1) {
      quote.innerHTML = "Entferntes Zitat von " + usernames[j] + ".";
      quote.parentNode.parentNode.parentNode.nextElementSibling.firstElementChild.innerHTML = "[--]";
    }
  }
}

//Umschaltefunktion in die Seite einschleusen
script = document.createElement('script');
script.type="text/javascript";
script.textContent = 'function hiddentoggle(i) { console.log(document.getElementById("hiddenpost"+i));' 
+ '(document.getElementById("hiddenpost"+i).style.display == "none") ? document.getElementById("hiddenpost"+i).style.display = "block" : document.getElementById("hiddenpost"+i).style.display = "none";}';
document.body.insertBefore(script, document.getElementById("page-container"));

//Find Child with Class
//Source: https://stackoverflow.com/questions/12166753/how-to-get-child-element-by-class-name
function findClass(element, className) {
    var foundElement = null, found;
    function recurse(element, className, found) {
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.innerHTML;
                    break;
                }
            }
            if(found)
                break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}
// ==UserScript==
// @name         WDA Spain Estadísticas en español
// @name:es      WDA Spain Estadísticas en español
// @version      0.6
// @author       Antoine Maingeot and David Medina
// @description  WDA Spain Estadísticas en español y botón para copiar la imagen y compartirla en WhatsApp y FaceBook
// @description:es WDA Spain Estadísticas en español
// @match        https://www.webcamdarts.com/GameOn/Game/MatchResult/*
// @match        https://www.webcamdarts.com/GameOn/Game/MemberStats/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js


// @namespace https://greasyfork.org/users/710998
// @downloadURL https://update.greasyfork.org/scripts/417305/WDA%20Spain%20Estad%C3%ADsticas%20en%20espa%C3%B1ol.user.js
// @updateURL https://update.greasyfork.org/scripts/417305/WDA%20Spain%20Estad%C3%ADsticas%20en%20espa%C3%B1ol.meta.js
// ==/UserScript==

/*This script is a modification of the "Webcamdarts statistics french only" script created by Antoine Maingeot. 
The added changes have been: 
  - change the language from French to Spanish.
  - added a button to copy the image to the clipboard
*/
// Create a new element

var logo = document.createElement("div");
logo.innerHTML = '<div id="container"><br><div><button id="botonCopiar" style="background-color: green; border-color: green">Copiar imagen</button><span id="textoCopiar" style="margin-left: 20px; display:none; color: green">Copiado!</span></div><button id="goButton">Guardar imagen</button><br><br><div id="image"></div></div>';

// Get the reference node
var referenceNode = document.querySelector('.pbcontainer');

// Insert the new node before the reference node
referenceNode.after(logo);

 $("#botonCopiar").click(function() {
        let src = document.getElementsByClassName('item')[0];
        html2canvas(src, {
          onrendered: function(canvas) {
            //document.getElementById.appendChild(canvas);
            //let data = canvas.toDataURL('image/png');
            //window.location = 'whatsapp://send?text='+data;
            canvas.toBlob(function(blob){
               navigator.clipboard.write([
                   new ClipboardItem(
                       Object.defineProperty({}, blob.type, {
                           value: blob,
                           enumerable: true
                       })
                   )
                ])
                $('#textoCopiar').show();
                setTimeout(function(){
                   $('#textoCopiar').hide();
                },3000);
            })
          }
        });
      });
 $("#goButton").click(function() {
        let src = document.getElementsByClassName('item')[0];
        html2canvas(src, {
          onrendered: function(canvas) {
            saveAs(canvas.toDataURL(), 'resultwda.png');
          }
        });
      });

      function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = filename;

          //Firefox requires the link to be in the body
          document.body.appendChild(link);

          //simulate click
          link.click();

          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      }
//END fonction save as image

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

addGlobalStyle('.full-game-result{width: 50%;  margin: 0 auto; text-align: center; margin-top: 20px })');
addGlobalStyle('.liteAccordion.dark .slide > div{ background-color: #000000!important');

    var replaceArry = [

[/FORM/gi,'20 últimas partidas'],
[/Overall Average/gi,'Media total (desde el inicio)'],
[/HIGHEST/gi,'Mejor'],
[/LOWEST/gi,'Peor'],
[/BEST LEG/gi,'Mejor Leg'],
[/OUT/gi,'Cierre'],
[/Legs played/gi,'Legs jugados'],
[/games won/gi,'Enfrentamientos ganados'],
[/games lost/gi,'Enfrentamientos perdidos'],
[/games played/gi,'Enfrentamientos jugados'],
[/games drawn/gi,'Enfrentamientos empatados'],
[/WIN PERCENTAGE/gi,'Porcentaje de victorias'],
[/AVERAGE/gi,'Media'],
[/OVERALL/gi,'Desde el inicio'],
[/Full stats/gi,'Detalles'],
[/Stats/gi,'Estadísticas'],
[/Opponent/gi,'Oponente'],
[/Result/gi,'Resultado'],
[/lost/gi,'Derrota'],
[/winner/gi,'Ganador'],
[/win/gi,'Victoria'],
[/drawn/gi,'Empate'],
[/Full Report/gi,'Reporte completo'],
[/History/gi,'Histórico'],
[/Game Type/gi,'Formato de juego'],
[/Match Type/gi,'Formato de juego'],
[/Comment/gi,'Comentarios'],
[/No items to display/gi,'No hay elementos que mostrar'],
[/leg loser remaining score/gi,'puntos restantes al perder la partida'],
[/Legs for 1/gi,'Cada cuántas partidas'],];

var numTerms    = replaceArry.length;
                  //-- 5 times/second; Plenty fast.
var transTimer  = setInterval (translateTermsOnPage, 222);

function translateTermsOnPage () {
    /*--- Replace text on the page without busting links or javascript
        functionality.
    */
    var txtWalker   = document.createTreeWalker (
        document.body,
        NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                //-- Skip whitespace-only nodes
                if (node.nodeValue.trim() ) {
                    if (node.tmWasProcessed)
                        return NodeFilter.FILTER_SKIP;
                    else
                        return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        },
        false
    );
    var txtNode     = null;
    while (txtNode  = txtWalker.nextNode () ) {
        txtNode.nodeValue       = replaceAllTerms (txtNode.nodeValue);
        txtNode.tmWasProcessed  = true;
    }
    //
    //--- Now replace user-visible attributes.
    //
    var placeholderNodes    = document.querySelectorAll ("[placeholder]");
    replaceManyAttributeTexts (placeholderNodes, "placeholder");

    var titleNodes          = document.querySelectorAll ("[title]");
    replaceManyAttributeTexts (titleNodes, "title");
}

function replaceAllTerms (oldTxt) {
    for (var J  = 0;  J < numTerms;  J++) {
        oldTxt  = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    return oldTxt;
}

function replaceManyAttributeTexts (nodeList, attributeName) {
    for (var J = nodeList.length - 1;  J >= 0;  --J) {
        var node    = nodeList[J];
        var oldText = node.getAttribute (attributeName);
        if (oldText) {
            oldText = replaceAllTerms (oldText);
            node.setAttribute (attributeName, oldText);
        }
        else
            throw "attributeName does not match nodeList in replaceManyAttributeTexts";
    }
}






})();

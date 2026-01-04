// ==UserScript==
// @name ISBN 2 LibGen
// @namespace Violentmonkey Scripts
// @match https://books.google.*/*
// @match https://*.amazon.*/*
// @match https://*.springer.*/*
// @match https://*.goodreads.*/*
// @match https://*bol.com/*
// @grant none
// @version 1.2
// @author -
// @description Este script substitui números ISBN por hiperlinks que abrem os resultados de pesquisa LibGen
// @downloadURL https://update.greasyfork.org/scripts/485610/ISBN%202%20LibGen.user.js
// @updateURL https://update.greasyfork.org/scripts/485610/ISBN%202%20LibGen.meta.js
// ==/UserScript==

traverse(document.body);

function traverse(node) {
  var child, next;

  switch (node.nodeType) {
    case 1:
    case 9:
    case 11:
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        traverse(child);
        child = next;
      }
      break;
    case 3:
      handleText(node);
      break;
  }
}

// Produz um link para uma pesquisa por um isbn em gen.lib.rus.ec
function generateBookLink(isbn) {
  var url = "https://libgen.is/search.php?req=" + isbn + "&column=identifier";
  var hyperlink = document.createElement('a');
  var linkText = document.createTextNode(isbn);
  hyperlink.appendChild(linkText);
  hyperlink.href = url;
  return hyperlink;
}

// A função é chamada em todas as seções do texto
function handleText(textNode) {
  var isbnRegex = /(97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9])/g;
  var textContents = textNode.nodeValue;
  var regexResults = isbnRegex.exec(textContents);

  if (regexResults) {
    // Determine o início e o índice da pesquisa de regex
    var startIndex = regexResults.index;
    var endIndex = startIndex + regexResults[0].length;

    // Divida o conteúdo do textNode em subpartes
    var part1 = textContents.substring(0, startIndex);
    var part2 = generateBookLink(regexResults[0]);
    var part3 = textContents.substring(endIndex);

    console.log(part1);
    console.log(part3);

    // Crie nós de texto para subpartes
    var part1Node = document.createTextNode(part1);
    var part3Node = document.createTextNode(part3);
    var parentNode = textNode.parentNode;

    // Substitua o textNode por subpartes
    parentNode.replaceChild(part1Node, textNode);
    parentNode.insertBefore(part2, part1Node.nextSibling);
    parentNode.insertBefore(part3Node, part2.nextSibling);
  }
}

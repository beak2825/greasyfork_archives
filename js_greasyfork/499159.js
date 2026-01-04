// ==UserScript==
// @name Wech mit die Bezahlschranke!
// @description Komplette Artikel (handelsblatt, spektrum, ksta/DuMont, rnd/madsack/SPD [lol!]) oder zumindest längere Anrisstexte (der Rest) für umme lesen!
// @namespace Violentmonkey Scripts
// @match https://www.zeit.de/*
// @match https://www.sueddeutsche.de/*
// @match https://www.ksta.de/*
// @match https://www.rundschau-online.de/*
// @match https://www.handelsblatt.com/* 
// @match https://www.rnd.de/* 
// @match https://www.cz.de/*
// @match https://www.dnn.de/*
// @match https://www.goettinger-tageblatt.de/*
// @match https://www.haz.de/*
// @match https://www.kn-online.de/*
// @match https://www.ln-online.de/*
// @match https://www.lvz.de/*
// @match https://www.maz-online.de/*
// @match https://www.neuepresse.de/*
// @match https://www.ostsee-zeitung.de/*
// @match https://www.paz-online.de/*
// @match https://www.sn-online.de/*
// @match https://www.waz-online.de/*
// @match https://www.spektrum.de/*
// @grant none
// @version 0.0.1.20241119182157
// @downloadURL https://update.greasyfork.org/scripts/499159/Wech%20mit%20die%20Bezahlschranke%21.user.js
// @updateURL https://update.greasyfork.org/scripts/499159/Wech%20mit%20die%20Bezahlschranke%21.meta.js
// ==/UserScript==

$   = function(_) {return document.getElementById(_)}
$tn = function(_) {return document.getElementsByTagName(_)}
$cn = function(_) {return document.getElementsByClassName(_)}
$qa = function(_) {return document.querySelectorAll(_)}
$qs = function(_) {return document.querySelector(_)}

window.addEventListener('load',
  function() {

    $tn("body")[0].onclick = function() {

      var jsoncontainer = 0;

      for (var i = 0, l = $tn("script").length; i < l; ++i) {

        if ($tn("script")[i].type == "application/ld+json") {
          if ($tn("script")[i].innerText.indexOf("articleBody") != -1) {
            jsoncontainer = i;
            break;
          }
        }
      }

      if (jsoncontainer != 0) {

        var scriptEl = $tn("script")[jsoncontainer].innerText;
        var schemaObj = JSON.parse(scriptEl);
        var prepare = "";
        var months = /\. (Januar|Februar|März|April|Mai|Juni|August|September|Oktober|November|Dezember) /g;        
        
        if (location.hostname.indexOf("handelsblatt") != -1) {
          prepare = schemaObj[1].articleBody;
        } else {
          prepare = schemaObj.articleBody;
        }
    
        prepare = prepare.replace(months, ".$1");

        var splitter = "\. ";
        var sentences = prepare.split(splitter);
        var formattedtext = "";
        var skips = 0;

        for (var i = 0; i < sentences.length; i++) {
          if (i === skips + 3) {
            var breaks = "<br /><br />";
            skips += 3;
          } else {
            var breaks = "";
          }

          formattedtext += sentences[i].replace(months, ". $1 ") + ". " + breaks;
        }

        formattedtext = formattedtext.replace("...", "###").replace(".. ", ". ").replace("###", "...");

      }

      switch (location.hostname.replace("www.", "")) {
          
        // anrisstexte

        case "sueddeutsche.de": {
          $cn("article-content")[0].innerHTML = formattedtext;
        }
          
        case "zeit.de": {
          $("paywall").style.display = "none";
          $("paywall").style.visibility = "hidden";

          for (var i = 0, l = $cn("article__item").length; i < l; ++i) {
            $cn("article__item")[i].classList.remove("paragraph--faded");
          }
        }
          
        // alles
          
        case "spektrum.de": {
          $cn("pw-premium")[0].classList.remove("pw-premium");
        }

        case "rnd.de":
        case "cz.de":
        case "dnn.de":
        case "goettinger-tageblatt.de":
        case "haz.de":
        case "kn-online.de":
        case "ln-online.de":
        case "lvz.de":
        case "maz-online.de":
        case "neuepresse.de":
        case "ostsee-zeitung.de":
        case "paz-online.de":
        case "sn-online.de":
        case "waz-online.de": {
          var articletext = "";

          for (var i = 0, l = Fusion.globalContent.elements.length; i < l; ++i) {

            if (Fusion.globalContent.elements[i].type == "text") {
              articletext += Fusion.globalContent.elements[i].text + "<br /><br />";
            }

              if (Fusion.globalContent.elements[i].type == "header") {
              articletext += '<p><em>' + Fusion.globalContent.elements[i].text + '</em></p><p><br /></p>';
            }
            
              if (Fusion.globalContent.elements[i].type == "image") {
              articletext += '<p><img src="' + Fusion.globalContent.elements[i].imageInfo.src + '" style="max-width: 100%" /><br />' + Fusion.globalContent.elements[i].imageInfo.alt + '</p><p><br /></p>';
            }

          }

          $cn("jrSDfQ")[0].innerHTML = articletext;
          $cn("bqMfmc")[0].style.display = "none";
          $cn("bqMfmc")[0].style.visibility = "hidden";
          $cn("jrSDfQ")[0].classList.remove("jrSDfQ");
        }
          
        case "handelsblatt.com": {
          $tn("app-paywall")[0].style.display = "none";
          $tn("app-paywall")[0].style.visibility = "hidden";
          
          $tn("app-storyline-elements")[0].innerHTML = "<p>&nbsp;</p>" + formattedtext;
        }

        case "ksta.de":
        case "rundschau-online.de": {
          for (var i = 0, l = $tn("article")[0].getElementsByTagName("div").length; i < l; ++i) {
            $tn("article")[0].getElementsByTagName("div")[i].style.display = "block";
          }
        }

      }
      
      $tn("body")[0].onclick = function() {}
      
    }

  },
  false);

setTimeout('document.getElementsByTagName("body")[0].click()', 2500);

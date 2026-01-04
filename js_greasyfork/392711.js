// ==UserScript==
// @name Modalità scura
// @namespace https://greasyfork.org/en/users/221935
// @match https://forum.fibra.click/*
// @grant none
// @version 1.1
// @author Nearata
// @description Modalità scura/notte per il forum di FibraClick
// @license MIT
// @run-at document-end
// @homepageURL https://github.com/Nearata/fibraclick-darkmode
// @supportURL https://github.com/Nearata/fibraclick-darkmode/issues
// @downloadURL https://update.greasyfork.org/scripts/392711/Modalit%C3%A0%20scura.user.js
// @updateURL https://update.greasyfork.org/scripts/392711/Modalit%C3%A0%20scura.meta.js
// ==/UserScript==

$(function() {
    "use strict";
    
    // Link al file css del tema scuro
    const urlCSS = "https://cdn.jsdelivr.net/gh/nearata/fibraclick-darkmode@1.1/tema-scuro.min.css"
  
    let span = $("<span />", {
      "id": "tema-scuro",
      "class": "Button",
      "title": "Attiva/Disattiva la modalità scura"
    }).css({
      "position": "absolute",
      "top": "50%",
      "right": "5px",
      "transform": "translateY(-50%)"
    });
    let i = $("<i />", {
      "class": "far fa-moon"
    }).css({
      "font-size": "1rem"
    });
    let temaScuro = $("<link />", {
      "rel": "stylesheet",
      "href": urlCSS,
      "disabled": "disabled"
    })
    $("head").append(temaScuro)
    
    i.appendTo(span)
    span.appendTo($("#header"))
    
    span.click(function() {
      $(this).toggleClass("active")
      $(this).children("i").toggleClass("fa-moon fa-sun")
      $(".TagLabel").toggleClass("colored")
      
      sessionStorage.setItem("temaScuro", $(this).hasClass("active"))
      
      if (sessionStorage.getItem("temaScuro") === "true") {
        temaScuro.removeAttr("disabled")
      } else {
        temaScuro.attr("disabled", "disabled")
      }
    })
    
    if (sessionStorage.getItem("temaScuro") && sessionStorage.getItem("temaScuro") === "true") {
      $("#tema-scuro").toggleClass("active")
      $("#tema-scuro>i").toggleClass("fa-moon fa-sun")
      $(".TagLabel").removeClass("colored")
      temaScuro.removeAttr("disabled")
    }
  })

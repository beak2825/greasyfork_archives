// ==UserScript==
// @name         Remova Propagandas E Temporizadores Ao Baixar Filmes
// @namespace    hacker09
// @version      51
// @description  Abre o link direto de download em sites de torrent que te redirecionam a outros sites, ou fazem aguardar antes de liberar o download.
// @author       hacker09
// @noframes
// @include      *://www.google.*
// @match        *://comando.la/*
// @match        *://comandotorrents.to/*
// @match        *://www.baixarfilmes.me/*
// @match        *://thepiratemovies.tech/*
// @match        *://futebolistasonline.club/*
// @match        *://filmestvdublado.home.blog/*
// @include      /^(https?:\/\/)(www\.)?(arnolds|nerdfilmes|megatorrents|utorrentfilmes|thepiratefilmes)(\.com\.br)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(adrenalinagames|mastercuriosidadesbr|boutv|filmesdetv|dubladotorrent|baixarbluray|comandofilmes3|insanostorrent)(\.com)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(boardiweb|theexconsofymm|filmedaki|arquivosparadown)(\.blogspot\.com)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(lapumia|comandos-torrent|filmeviatorrents|downfilmes|comandotorrent|flixtorrents)(\.org)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(megatorrents|filmesmega)(\.co)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(bludvfilmes|filmestorrent|filmes4ktorrent)(\.tv)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(rlsfilmes|filmesgratis|thepiratefilmeshd)(\.info)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(bluf|filmestorrentbr)(\.online)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(torrentdosfilmes|filmesviatorrents)(\.site)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(comandofilmes|comandotorrent)(\.xyz)(\/.*)?/
// @include      /^(https?:\/\/)(www\.)?(lapumia|novobrasil|wolverdonfilme|piratefilmeshd|thepiratetorrent|meufilmestorrenthd|torrentdosfilmeshd1|baixarfilmetorrenthd)(\.net)(\/.*)?/
// @icon         https://i.imgur.com/zXz7pGG.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/407734/Remova%20Propagandas%20E%20Temporizadores%20Ao%20Baixar%20Filmes.user.js
// @updateURL https://update.greasyfork.org/scripts/407734/Remova%20Propagandas%20E%20Temporizadores%20Ao%20Baixar%20Filmes.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const BlockedWebsites = new RegExp(/^(https?:\/\/)?(www\.)?(filmestvdublado.home.blog|filmesdetv.com|theexconsofymm.blogspot.com|dubladotorrent.com|boutv.com|boardiweb.blogspot.com|thepiratetorrent.net|utorrentfilmes.com.br|thepiratefilmes.com.br|arquivosparadown.blogspot.com)/);
  const interval = setInterval(() => { unsafeWindow.console.clear = () => {}; }, 0); //Stops the console logs from being cleared

  if (GM_getValue("ActivateOnGoogle") === undefined) //If the value doesn't exist define it as true
  { //Starts the if condition
    GM_setValue("ActivateOnGoogle", true); //Defines the variable as true
  } //Finishes the if condition

  function ActivateOnGoogle() //Function to activate/deactivate the highlight on google
  { //Starts the function
    if (GM_getValue("ActivateOnGoogle") === true) //If the last config was true, define as false
    { //Starts the if condition
      GM_setValue("ActivateOnGoogle", false); //Defines the variable as false
    } //Finishes the if condition
    else { //If the last config was false, define it as true
      GM_setValue("ActivateOnGoogle", true); //Defines the variable as true
      location.reload(); //Reloads the page
    } //Finishes the else condition
  } //Finishes the function

  if (top.location.host.match(/www.google/) && GM_getValue("ActivateOnGoogle") === true) { //Starts the if condition
    GM_registerMenuCommand("Desativar/Ativar Marcação", ActivateOnGoogle); //Adds an option to the menu
    function HighLight() //Creates a function to highlight the websites
    { //Starts the function HighLight
      const PageLinks = document.querySelectorAll("cite"); //Add all page links total number to a variable
      for (var i = PageLinks.length; i--;) { //Starts the for condition
        if (PageLinks[i].innerHTML.match(/^(https?:\/\/)?(www\.)?(megatorrents.co|bludvfilmes.tv|torrentdosfilmes.site|comandos-torrent.org|comando.la|lapumia.net|lapumia.org|bluf.online|filmeviatorrents.org|baixarfilmes.me|filmedaki.blogspot.com|filmesmega.co|downfilmes.org|rlsfilmes.info|novobrasil.net|baixarbluray.com|filmestorrent.tv|filmesgratis.info|comandofilmes.xyz|nerdfilmes.com.br|filmes4ktorrent.tv|comandofilmes3.com|insanostorrent.com|comandotorrent.org|wolverdonfilme.net|comandotorrents.to|piratefilmeshd|megatorrents.com.br|flixtorrents.org|comandotorrent.xyz|filmestorrentbr.online|thepiratefilmeshd.info|meufilmestorrenthd.net|filmesviatorrents.site|thepiratemovies.tech|torrentdosfilmeshd1.net|baixarfilmetorrenthd.net)/)) { //Starts the if condition
          PageLinks[i].style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; //Change the element background to Yellow
        } //Finishes the if condition
        if (PageLinks[i].innerHTML.match(BlockedWebsites)) //If the Result contains any of the Blocked Websites
        { //Starts the else condition
          PageLinks[i].style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; //Change the element background to Red
        } //Finishes the else condition
      } //Finishes the for condition
    } //Finishes the function
    HighLight(); //Calls the Function

    new MutationObserver(async function() { //If the results page changes anything (If the user uses anything like the endless Google scripts)
      HighLight(); //Calls the Function
    }).observe(document.querySelector("#rcnt"), { //Defines the element and characteristics to be observed
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    }); //Finishes the definitions that will be observed
  } //Finishes the if condition

  if (!top.location.host.match(/www.google/)) { //Starts the if condition
    document.querySelectorAll('a[target="_blank"]').forEach(link => link.removeAttribute('target')); //Disable target = "_blank" on all websites

    if (top.location.host.match(BlockedWebsites)) { //Starts the if condition
      close(); //Close the website
    } //Finishes the if condition

    if (top.location.host.match(/(^(www\.)?(comando.la|lapumia.org|lapumia.net|filmedaki|bluf.online|filmeviatorrents.org|baixarfilmes.me|filmedaki.blogspot.com|bludvfilmes.tv|filmesmega|downfilmes.org|rlsfilmes.info|novobrasil.net|baixarbluray.com|filmestorrent.tv|filmesgratis.info|comandofilmes.xyz|nerdfilmes.com.br|filmes4ktorrent.tv|comandofilmes3.com|insanostorrent|comandotorrent.org|wolverdonfilme.net|comandotorrents.to|piratefilmeshd|megatorrents.com.br|flixtorrents.org|comandotorrent.xyz|filmestorrentbr.online|thepiratefilmeshd.info|meufilmestorrenthd.net|filmesviatorrents.site|thepiratemovies.tech|torrentdosfilmeshd1.net|baixarfilmetorrenthd.net))(.*)?/) === null) { //Starts the if condition if the user isn't on any website that should only be highlighted on Google (also the code below doesn't work/(is needed) on these websites)
      Function.prototype.apply = () => {}; //Disable JS on the website so that the download buttons will load without ads
    } //Finishes the if condition

    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? document.title = '🏳️☠️ ' + document.title : document.title = '🏴‍☠️ ' + document.title; //Add the pirate flag emoji to the tab title according to the user theme mode
  } //Finishes the if condition

  window.onload = () => { clearInterval(interval); }; //Breaks the timer that stops the console log from being cleared every 0 secs

  if (top.location.host.match(/filmesmega.co|novobrasil.net|filmestorrent.tv|flixtorrents.org|comandotorrent.xyz|filmestorrentbr.online|filmesviatorrents.site|thepiratemovies.tech/))
  { //Starts the if condition CommomAtob
    new MutationObserver(function(mutations) { if(Array.from(document.images).every(img => img.complete)) { //Wait lazy loaded imgs load
      setTimeout(function() { //Starts the settimeout function
        document.querySelectorAll("a[href*='?token='],a[href*='?id='],a[href*='?url='],a[href*='?v='],a[href*='&url=']").forEach(function(el) { //To all "fake" link elements
          el.href = atob(el.href.split(/\?token=|\?id=|\?url=|\?v=|&url=/)[1].replace('&type=2','')); //Decode and reveal the real unprotected download link
        }); //Finishes the forEach condition
      }, 1000); //Wait for the website to load
    }}).observe(document.documentElement, { childList: true, subtree: true }); //Finishes the MutationObserver
  } //Finishes the if condition

  if (top.location.host.match(/comandos-torrent.org|downfilmes.org|rlsfilmes.info|filmesgratis.info|filmes4ktorrent.tv|comandotorrent.org|thepiratefilmeshd.info/)) { //Starts the if condition
    new MutationObserver(function(mutations) { if(Array.from(document.images).every(img => img.complete)) { //Wait lazy loaded imgs load
      document.querySelectorAll("a[href*='?token=']").forEach(function(el) { //To all encoded links
        el.href = CryptoJS.AES.decrypt(atob(el.href.split('?token=')[1]), '391si8WU89ghkDB5').toString(CryptoJS.enc.Utf8); //Decode, doing the reverse cryptographic AES process and finally reveal the real unprotected download link
      }); //Finishes the forEach condition
    }}).observe(document.documentElement, { childList: true, subtree: true }); //Finishes the MutationObserver
  } //Finishes the if condition

  if (top.location.host.match(/www.mastercuriosidadesbr.com|www.arnolds.com.br|futebolistasonline.club/)) { //Starts the if condition
    document.querySelector("#aviso").style.display = "none"; //Disable Counter Text
    document.querySelector("#loko").style.display = "none"; //Disable Fake Download Button
    document.querySelector("#baixar").style.display = ""; //Enable the Real Download Button
    document.oncontextmenu = function() {}; //Enables the Right Click
    document.querySelector("#saudacao").remove(); //Remove the text "CLIQUE NO ANÚNCIO ABAIXO PARA LIBERAR O TORRENT"
    document.querySelector("#topo").remove(); //Remove the disable adblock text
    document.querySelector("#colunas").remove(); //Remove the page ads
    document.querySelector("#colunas").remove(); //Remove the page ads

    if (document.querySelector("#baixar > p > a") !== null && document.querySelector('a[href*="magnet"]') === null) //If there's a redirector link and 0 torrent links
    { //Starts the if condition
      open(document.querySelector("#baixar > p > a").href, "_self"); //Open the redirector link link, if existent
    } //Finishes the if condition
    else //Open the magnet link
    { //Starts the else condition
      open(document.querySelector('a[href*="magnet"]').href, "_self"); //Open the unprotected link, if existent
    } //Finishes the else condition
  } //Finishes the if condition

  if (top.location.host.match(/www.adrenalinagames.com/)) { //Starts the if condition
    document.getelById('link0').style.display = "none"; //Hides the fake download button
    document.getelById('link').style.display = "block"; //Shows the real download button
    document.getelById('msg').style.display = "none"; //Disable the message "Clique uma vez em um dos anuncios,aguarde 20 segundos na pagina que ira abrir, apos isso o seu download sera liberado"
  } //Finishes the if condition

  if (top.location.host.match(/bludvfilmes.tv|torrentdosfilmes.site|comandofilmes3.com|wolverdonfilme.net|meufilmestorrenthd.net/)) { //Starts the if condition https://developmentgoat.com/code.php?partner=71
    setTimeout(function() { //Starts the settimeout function
      document.querySelectorAll("a[href*='javascript']").forEach(function(el, i) { //To all "fake" links
        el.onclick = ''; //Prevent the default encoded link from being opened
        el.href = unsafeWindow.arrDBLinks[i]; //Open the unprotected link
      }); //Finishes the forEach condition
    }, 1000); //Wait for the bludv website to load
  } //Finishes the if condition

  if (top.location.host.match(/piratefilmeshd.net|megatorrents.com.br|filmeviatorrents.org/)) { //Starts the if condition
    setTimeout(async function() { //Starts the settimeout function
      const response = await (await fetch(location.href)).text(); //Get current unprotected page
      document.querySelectorAll("a[href*='games-tech'],a[href*='flashcode'],a[href*='dicasdefinancas']").forEach(function(el, i) { //To all "fake" links
        el.onclick = ''; //Prevent the default encoded link from being opened
        el.href = response.match(/magnet:.*?(?=")/gm)[i]; //Replace the protected link with the unprotected link
      }); //Finishes the forEach condition
    }, 1000); //Wait for the website to load
  } //Finishes the if condition
})();
// ==UserScript==
// @name        Wykop.pl: wygodniejsze myszkowanie
// @namespace   Violentmonkey Scripts
// @match       https://www.wykop.pl/*
// @match       https://wykop.pl/*
// @grant       none
// @version     1.2.4
// @author      Orlin
// @license     MIT
// @description 1. Główne obrazki znalezisk także linkują do celu, 2. Linki domyślnie otwierają się w tej samej karcie/oknie, 3. Wystarczy najechać by rozwijać spoilery, "Pokaż komentarze" itp.
// @downloadURL https://update.greasyfork.org/scripts/459807/Wykoppl%3A%20wygodniejsze%20myszkowanie.user.js
// @updateURL https://update.greasyfork.org/scripts/459807/Wykoppl%3A%20wygodniejsze%20myszkowanie.meta.js
// ==/UserScript==

const WAITFORALL = 3000;

function linkifyImages() // zarówno w znalezisku jak i w spisie znalezisk - dzięki temu np. łatwiej otwierać sobie środkowym przyciskiem myszy w osobnej karcie, w tle
{
  let sekcje = document.querySelectorAll('section.link-block article');
  for(let i=0; i<sekcje.length; ++i)
  {
    let linczek = sekcje[i].querySelector('header h1 a');
    let obrazek = sekcje[i].querySelector('figure');
    if(obrazek!=null && linczek!=null)
    {
      if(obrazek.getAttribute('alreadyLinkified')==null)  // czy już olinkowany po mojemu?
      {
        if(obrazek.classList.contains('embed')) // odtwarzacze video niech nadal się embedują przy normalnym kliknięciu
        {
          obrazek.innerHTML = '<a onclick="return(false);" href="' + linczek.href + '">' + obrazek.innerHTML + '</a>';
        }
        else
        {
          obrazek.innerHTML = '<a href="' + linczek.href + '">' + obrazek.innerHTML + '</a>';
        }
        obrazek.setAttribute('alreadyLinkified', '1');
      }
    }
  } // for()
}

function blank2self() // domyślnie otwieraj wszystkie linki w tej samej karcie/oknie po ich kliknięciu (jak chcę w innej, to klikam ŚPM albo LPM z wciśnietę klawiszem CTRL)
{
  var linkz = document.querySelectorAll('a[target=_blank]');
  for(let i=0; i<linkz.length; ++i)
  {
    linkz[i].setAttribute('target', '_self');
  }
}

function addListeners() // wystarczy najechać kursorem myszy na przyciski "Pokaż spoiler", Pokaż więcej", "Pokaż komentarze", "Pokaż wszystkie treści powiązane", by je rozwinąć
{
  // (document.querySelectorAll('footer button[class="target"]')).forEach(function(item){if(item.innerHTML.indexOf('Pokaż komentarze')>=0) item.click();});
  let pokaKoment = document.querySelectorAll('footer button[class="target"]');
  let pokaWiecej = document.querySelectorAll('.entry-content button[class="more"]');
  let pokaSpoiler= document.querySelectorAll('section.content-spoiler button');
  let pokaTresc  = document.querySelectorAll('section.junk-content button');
  let pokaNoweTresci  = document.querySelectorAll('.new-entry button');

  for(let i=0; i<pokaKoment.length; ++i)
  {
    if((pokaKoment[i].innerHTML.indexOf('Pokaż')>=0 || pokaKoment[i].innerHTML.indexOf('Zobacz')>=0)&& pokaKoment[i].getAttribute('al')==null)
    {
      pokaKoment[i].addEventListener("mouseover", function(){this.click();}, false);
      pokaKoment[i].setAttribute('al', '1');
//      window.scroll(0, scrollPos);
    }
  }
  for(let i=0; i<pokaWiecej.length; ++i)
  {
    if(pokaWiecej[i].innerHTML.indexOf('Pokaż')>=0 && pokaWiecej[i].getAttribute('al')==null)
    {
      pokaWiecej[i].addEventListener("mouseover", function(){this.click();}, false);
      pokaWiecej[i].setAttribute('al', '1');
    }
  }
  for(let i=0; i<pokaSpoiler.length; ++i)
  {
    if(pokaSpoiler[i].innerHTML.indexOf('Pokaż')>=0 && pokaSpoiler[i].getAttribute('al')==null)
    {
      if(pokaSpoiler[i].parentNode.parentNode.tagName == 'A')
      {
        pokaSpoiler[i].innerHTML += ' - link: ' + pokaSpoiler[i].parentNode.parentNode.href;
      }
      else
      {
         pokaSpoiler[i].addEventListener("mouseover", function(){this.click();}, false);
      }

      pokaSpoiler[i].setAttribute('al', '1');
    }
  }
  for(let i=0; i<pokaTresc.length; ++i)
  {
    if(pokaTresc[i].innerHTML.indexOf('nowe')>=0 && pokaTresc[i].getAttribute('al')==null)
    {
      pokaTresc[i].addEventListener("mouseover", function(){this.click();}, false);
      pokaTresc[i].setAttribute('al', '1');
    }
  }
  for(let i=0; i<pokaNoweTresci.length; ++i)
  {
    if(pokaNoweTresci[i].innerHTML.indexOf('nowe')>=0 && pokaNoweTresci[i].getAttribute('al')==null)
    {
      pokaNoweTresci[i].addEventListener("mouseover", function(){this.click();}, false);
      pokaNoweTresci[i].setAttribute('al', '1');
    }
  }
  // setTimeout(function(){window.scroll(0, scrollPos);}, 4000);
}


var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return;

    if( MutationObserver ){

      var mutationObserver = new MutationObserver(callback)

      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }

    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();
/*
window.addEventListener('load', function() {
    blank2self();
    linkifyImages();
    observeDOM(document.body, function(m){
      addListeners();
    });
}, false);

window.addEventListener('DOMContentLoaded',  function() {
    blank2self();
    linkifyImages();
    addListeners();

}, false);
*/
function addAllMyFuncs(wait)
{
  setTimeout(function() {
      blank2self();
      linkifyImages();
      addListeners();
    /*
      let next = document.querySelector('nav.new-pagination.hash li.next a');
      let prev = document.querySelector('nav.new-pagination.hash li.prev a');
      if(next)
      {
        next.addEventListener('click', function(){addAllMyFuncs(wait);}, false);
      }
      if(prev)
      {
        prev.addEventListener('click', function(){addAllMyFuncs(wait);}, false);
      }
    */
      observeDOM(document.body, function(m){
        addListeners();
        blank2self();
        linkifyImages();
      });


  }, wait);
}

addAllMyFuncs(WAITFORALL);

document.querySelector('header').addEventListener("mouseover", function(e){
          addAllMyFuncs(100);
}, false); // gdyby z jakichś powodów nie zadziałało  odpalenie funkcji, to najedź na górną belkę by wymusić wprowadzenie zmian

/* // skrót klawiszowy CTRL + \  // odkomentować by aktywować
document.addEventListener("keydown", function(e){
    if (e.keyCode == '220') // backslash
    {
       if(e.ctrlKey)
       {
          addAllMyFuncs(100);
       }
    }
});
*/
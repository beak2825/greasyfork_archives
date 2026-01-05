// ==UserScript==
// @name           YouTube Player for Forocoches
// @name:es        Reproductor de YouTube para Forocoches
// @description    Never thought I would made something so unsettling, enjoy it!
// @description:es Nunca pensé que terminaría haciendo algo tan demigrante, ¡de nada!
// @namespace      swyter
// @match          *://www.forocoches.com/*
// @match          *://m.forocoches.com/*
// @match          *://forocoches.com/*
// @version        1.1.1.7
// @grant          none
// @run-at    document-start
// @downloadURL https://update.greasyfork.org/scripts/12577/YouTube%20Player%20for%20Forocoches.user.js
// @updateURL https://update.greasyfork.org/scripts/12577/YouTube%20Player%20for%20Forocoches.meta.js
// ==/UserScript==

/* switch the iframe source to a less scummy one */

/* wait until the page is ready for the code snippet to run */
document.addEventListener('DOMContentLoaded', function()
{
  console.log("[removing the sponsored youtube player crap]]");

  for (var cur in (vids=document.querySelectorAll("iframe[src*=smartycenter]")))
  {
    if(typeof vids[cur] !== 'object')
      continue;

    vids[cur].src = 'https://www.youtube.com/embed/' + vids[cur].src.split("/")[6];
  }

  for (var link of document.querySelectorAll(`a[href^='https://forocoches.com/link.php']`))
  {
    const originalURL = new URLSearchParams(link.search).get('url'); console.log(`Rewriting referral URL ${link} into ${originalURL}`);

    if(originalURL)
      link.href = decodeURIComponent(originalURL);
  }

  console.log("[getting rid of random crap]]");

  /* remove random crap */

  filters =
  [
    "#infocookie",
    "div[id^='div-']",
    "ul[style*='#ca3415'] + ul",
    "a + ul + br",
    ".cajasprin"
  ];

  for (var cur in (junk=document.querySelectorAll(filters.join(', '))))
  {
    if(typeof junk[cur] !== 'object')
      continue;

    console.log("Removed junk element: " + junk[cur]);
    junk[cur].parentElement.removeChild(junk[cur]);
  }


  console.log("[getting rid of useless posts]]");

  for(var a of (document.querySelectorAll("div[id^=post_message]")))
  {
    if (!(a.childNodes[0].nodeValue.trim().match("Este mensaje está oculto porque .+ está en tu lista de ignorados(.)?$") != null))
     continue;

    console.log(a, a.childNodes[0].nodeValue);

    a = a.parentElement.parentElement.parentElement.parentElement;
    a.parentElement.removeChild(a);

  }


  console.log("[deemphasizing fachas and maleantes]]");

  blocked_users =
  [
    'Pedrote', 'RAMON38', 'Orof', 'matalpinensis', 'Kurtcob', 'DalePapi', 'pinilleitor', 'Zenobio73',
    'kevinxuan', 'Euritos', '-Averia-', 'Mcbubles', 'Medlinor', 'Amon Amarth','ShurKhalifa', 'Satou',
    'sirp', 'spilock', 'amstel', 'josalb', 'pablitochu89', 'sagi1978', 'Mr. Deadpool', 'DeBoer',
    'Jabyesp', 'mcarlosd', 'eosal', 'Mugremita', 'chafer', 'KRASNY BOR', 'Recaredo','sandrocor',
    'chemabocasucia', 'Adolf Satan', 'Cruzaito', 'AngryLovebird', 'Holm', 'Lombra', 'Folluto', 'Ming',
    'Reiv', 'RobynSark', 'vicviper', 'Minimal', 'carpe109', 'Demiurgo', 'Enrike80', 'katastrof',
    'OIF', 'ToyBall', 'Rulkes', 'monete', 'Guniko', 'Duro', 'Ah Jong', 'Andrahouse', 'IlCastigatore',
    'PickMan', 'Jacky Boy', 'Jolmerbi', 'EvilCartman', 'spiralmazes', 'apaloseko', 'ramaco', 'juaquix',
    'Barreiros R545', 'Hidratado', 'Thymaul', 'Mainteacher', 'Slevin23', 'Naviledoir-2', 'Botonequis',
    '¿He sido yo?', 'Eric Prydz', 'davidio5', 'saturno 5', 'Alais', 'Dedalopa01', 'DarthJuan',
    'alfa33man', 'clapclapxxl', 'ShurBlitz', 'mandrilillo', 'HOMBRE ÑUSCO', 'Pachy', 'realcnk',
    'Monku', 'ƒ£1‡×', 'Duxers'
  ]

  for (var e of document.querySelectorAll(".bigusername, .smallfont > span[onclick]"))
  {
    if (!(blocked_users.indexOf(e.textContent) != -1))
     continue;

    console.log('Obscured posts by blocked user: ', e.textContent);

    (e.nodeName != 'SPAN' ?
     e.parentNode.parentNode.parentNode.parentNode.parentElement :
     e.parentNode.parentNode.parentNode
    ).style.opacity = 0.3;
  }

 console.log("[all done]]");
});
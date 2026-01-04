// ==UserScript==
// @name         Brian Weiss Watch Master
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  watch2gether ads remove
// @author       Flejta
// @match      https://brianweiss.it/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460480/Brian%20Weiss%20Watch%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/460480/Brian%20Weiss%20Watch%20Master.meta.js
// ==/UserScript==

//per aggiungere nuove stringhe: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
var testo="<body>";
testo += "<DIV><b>Giorno 1<\/b><\/Div>";
testo += "";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698103476?h=f5b2d3effb&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Benvenuti al corso";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\/embed\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Molte vite molti maestri";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698103539?h=3034caf9be&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Gli inizi e l'ipnosi";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698103856?h=a4685307e9&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "I benefici delle regressioni alle vite passate";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698104104?h=b8f0d0d869&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Regressione nei luoghi e nelle vite passate";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698130430?h=3401b022de&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/703301410?h=ee0d14739a&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "";




testo += "<DIV><b>Giorno 1 Sera<\/b><\/Div><br>";
testo += "Tenere la Mente Aperta";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698104548?h=1fb845df8e&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Meditazione Elimina lo Stress e Ritrova la Pace Interiore";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698131900?h=cf485e72d5&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Guarda l’entusiasmo di chi ha partecipato a un corso con il dr. Weiss";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\/embed\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Guarda l’entusiasmo di chi ha partecipato a un corso con il dr. Weiss";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/703301410?h=ee0d14739a&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "";
testo += "";
testo += "<DIV><b>Giorno 2<\/b><\/Div>";
testo += "Le anime gemelle";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698104800?h=b7a594db96&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Esercizio di regressione all'infanzia";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698105267?h=1c6b179471&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Lasciare andare la rabbia";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698106871?h=575447f624&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Condivisioni";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698107757?h=3583763a7f&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "I Miracoli Accadono";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698114698?h=4be51bf55c&badge=0&autopause=0&player_id=0&app_id=58479\/embed\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Regressione alle vite passate per il tuo benessere";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698130267?h=9a42e0a349&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "";
testo += "";
testo += "<DIV><b>Giorno 3<\/b><\/Div>";
testo += "L'anima è pura energia di Amore";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698108244?h=8e7fa6ac85&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Meditazione déjà vu geografico";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698109073?h=8494aca143&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Meditazione di Evoluzione interiore con la regressione";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698130563?h=f9725d0b0f&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "";
testo += "";
testo += "<DIV><b>Giorno 4<\/b><\/Div>";
testo += "Esercizio di regressionone a un rilassamento profondo";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698114949?h=230d26968e&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Un'espolosione di amore";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698115207?h=cd1cdeae7b&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "Regressione alle vite precedenti";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698131987?h=6d2edbc1a1&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "<br><iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/701157763?h=047a246ab9&badge=0&autopause=0&player_id=0&app_id=58479\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
testo += "";

testo += "<DIV><b>Giorno 5<\/b><\/Div>";
testo += "Molte Vite, Molti Maestri corso online";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698118511?h=c05f86f962&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Il Dr. Weiss risponde alle domande";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698118746?h=aec5e33f26&badge=0&autopause=0&player_id=0&app_id=58479\/embed\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "La visualizzazione dello Scrigno";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698119799?h=882c0f5213&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Saluti Finali";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698120096?h=3825d0668e&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Illuminazione spirituale con la regressione";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698131680?h=d55ecf5b83&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Meditazione Elimina lo Stress e Ritrova la Pace Interiore";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/698131900?h=cf485e72d5&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Pubblicità: Chi Eri nelle vite passate";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/701157615?h=0099ba508c&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "Pubblicità: Nuove meditazioni esclusive";
testo += "<iframe width=\"560\" height=\"315\" src=\"https:\/\/player.vimeo.com\/video\/701157763?h=047a246ab9&badge=0&autopause=0&player_id=0&app_id=58479\" ";
testo += "";
testo += "title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" ";
testo += "";
testo += "allowfullscreen><\/iframe>";
testo += "<br>";
testo += "</body>";





 function guardaVideo(){
    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = testo; // sostituiamo il contenuto del body con il codice della pagina
 }

guardaVideo();
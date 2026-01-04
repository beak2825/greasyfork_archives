// ==UserScript==
// @name         Hattrick skim series feed
// @version      2025-09-20
// @description  Filter some sentences from the series feed
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/World/Series/*
// @match        https://*.hattrick.org/*/World/Series/*
// @grant        none
// @namespace https://greasyfork.org/users/1381786
// @downloadURL https://update.greasyfork.org/scripts/512848/Hattrick%20skim%20series%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/512848/Hattrick%20skim%20series%20feed.meta.js
// ==/UserScript==

function skimSeriesFeed() {
    let filter = new RegExp([
        // italiano

        ' ha scritto un messaggio sui social dove rende noto ai suoi fan di essere stato',
        ' Pochi minuti dopo, l\'ufficio stampa della squadra ha confermato la notizia pubblicando un comunicato ufficiale[.]',
        'La notizia era nell\'aria già da diversi giorni, tuttavia ora è stata battuta in via ufficiale da diverse agenzie stampa: ',
        ' considerato',
        ' da diversi addetti ai lavori',
        ' indetto una conferenza stampa per presentare ai propri tifosi',
        'Brutte notizie dall\'infermeria di ',
        'Brutta tegola per l\'allenatore di ',
        '[.] Questo giocatore è',
        'pubblicato un comunicato stampa dove rende noto il nome del ',
        'ha rilasciato un comunicato ufficiale che ',
        ' dalla squadra',
        'ha messo sotto contratto una ',
        'È stata una giornata nera per ',
        'con il loro prezioso ',
        ', che porterà il suo talento di',
        'una partenza importante, ',
        'della loro stella ',

        ' altrimenti le loro possibilità di promozione svaniranno[.] Riusciranno a rimanere lucidi[?]',
        'Non c\'è più speranza per ',
        '[!.] La squadra',
        ' indipendentemente da quello che accadrà',
        ' nel turno [0-9]+[.]',
        ' negli ultimi  [0-9]+ turni',
        ' nell\'ultimo turno[.]',
        'è arrivato il momento della verità: ',
        'è il momento della verità: ',
        ' se vogliono evitare la retrocessione diretta',
        ' per mantenere viva la possibilità di evitare la retrocessione diretta',
        'Nessuna ulteriore chiamata a disposizione per ',
        ' se vogliono evitare lo spareggio per non retrocedere[.]',
        ' se vuole mantenere viva la speranza di promozione[.] Riusciranno a rimanere lucidi[?]',
        'Se vuole avere ancora opportunità di finire al primo posto, ',
        ' Ce la faranno[?]',
        ' se vogliono evitare lo spareggio per non retrocedere [(]o anche peggio[)]',
        'può ancora ambire alla promozione diretta, tuttavia giocatori e allenatore ',
        'ha raggiunto la fine del suo percorso ',

        'I tifosi di ',
        'stanno vivendo un vero e proprio psicodramma da quando ',
        ' continuerà a partecipare a tutte le competizioni, ma l\'incertezza che circonda il club si ripercuoterà inevitabilmente su giocatori e staff',
        'Nonostante rimanga(no)? (una|[0-9]+) giornat(a|e) ancora da giocare, ',
        ' Congratulazioni, campioni[!]',
        'Congratulazioni a ',
        ' e la prossima stagione giocherà nella serie superiore',
        'subisce le conseguenze di una stagione a dir poco complicata: ',
        ' è purtroppo diventata realtà',
        'deve voltare pagina dopo il triste epilogo dello scorso campionato[.] A seguito della retrocessione, la squadra ',
        'Fresca di promozione, ',

        // english

        ' has announced to social media networks that he',
        'announced on social media that he ',
        ' M(oments|inutes) later, the move was confirmed by the club[.]',
        ', a big name on the squad[.] It will be interesting to see what other changes this may lead to',
        'often described as ',
        ' the team hopes will become a key player for the team',
        ' an essential player',
        '[.] The player is',
        'has released a statement confirming the ',
        'a new star [a-z ]+ by the name of ',
        'It was an ominous day for ',
        'as their important ',
        'a major squad departure with ',
        'star player ',

        ', otherwise their promotion chances will evaporate into thin air[.] Can they deliver[?]',
        'There is no hope left for ',
        '[!.] The team',
        ' no matter what they do in the (last|final [0-9]+) round(s)?[.]',
        'to get real[.] They ',
        'It\'s time for ',
        ' to avoid direct demotion',
        'There are no margins left for ',
        ' to avoid the horror of a demotion qualifier match[.]',
        'If they want to keep their chances for finishing first, ',
        ' Can they deliver[?]',
        ' to avoid the horror of a demotion qualifier match, or - perhaps worse - direct demotion',
        'still has a chance for direct promotion, but ',
        ' to stay on track',
        '[.] They were defeated',

        'Following weeks of rumors, it has been confirmed that ',
        ' The team will continue to participate in all competitions, but the uncertainty surrounding the club will likely affect players and staff.',
        'Despite there being [0-9]+ round(s)? left to play, ',
        ' Congratulations, champions[!]',
        'Having just been promoted, ',
        ' for the upcoming season',
        'is coming off a bad season, which ended in demotion[.] They ',
        'Congratulations to ',
        ' and will play in a higher division next season',
        'is seeing the consequences of their weak season and ',
    ].join('|'), 'g');

    let feed = document.getElementById('ctl00_ctl00_CPContent_CPMain_repLLUEvents');
    feed.innerHTML = feed.innerHTML.replaceAll(filter, '');
}

(function() {
    'use strict';

    skimSeriesFeed();

    let observerTarget = document.getElementById('ctl00_ctl00_CPContent_CPMain_updLLUEvents');
    let observerOptions = {subtree: true, childList: true};
    const observer = new MutationObserver(() => {
        observer.disconnect();
        skimSeriesFeed();
        observer.observe(observerTarget, observerOptions);
    });
    observer.observe(observerTarget, observerOptions);
})();
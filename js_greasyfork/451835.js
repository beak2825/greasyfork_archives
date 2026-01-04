// ==UserScript==
// @name         Forum HTML.it Toolset
// @description  Funzionalità aggiuntive e ottimizzazione layout per le pagine del Forum HTML.it
// @version      1.3.1
// @author       OpenDec
// @match        https://forum.html.it/forum/*
// @exclude      https://forum.html.it/forum/modcp/*
// @exclude      https://forum.html.it/forum/admincp/*
// @icon         https://forum.html.it/forum/favicon.ico
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @run-at       document-start
// @noframes
// @namespace    forum_html_it_toolset
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451835/Forum%20HTMLit%20Toolset.user.js
// @updateURL https://update.greasyfork.org/scripts/451835/Forum%20HTMLit%20Toolset.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

// --------------------------------------------------
// ---                    NOTE                    ---
// --------------------------------------------------
/*
  - Memorizzazione dei dati

  Questo sistema utilizza le GM API e le Web Storage API per mantenere salvati diversi dati.
  Qui i nomi usati per la memorizzazione dei dati e relative descrizioni.

    - In GM:
      - FHT_impostazioni    : oggetto principale in cui sono memorizzate tutte le impostazioni definite dall'utente. La lettura avviene in modo asincrono.

    - In localStorage:
      - FHT_impostazioni    : stesso che in GM ma usato come appoggio per recuperare i dati istantaneamente all'apertura della pagina ed evitare ritardi nel rendering CSS, essendo localStorage un sistema sincrono diversamente da GM.
      - FHT_schedaAttiva    : nome della scheda aperta nel pannello impostazioni ("form", "prompt").
      - FHT_contenutoPrompt : contenuto dell'editor nel prompt, inserito dall'utente. Ad ogni riapertura del prompt, l'editor sarà ripopolato col contenuto precedentemente inserito.
      - FHT_staff           : rappresentazione JSON di un oggetto contenente le proprietà "admins" e "mods", ognuna delle quali contiene la lista dei relativi id utente. Tali valori sono usati nel CSS per identificare sul forum i nomi di amministratori e moderatori

    - In sessionStorage:
      - FHT_history         : rappresentazione JSON della cronologia delle modifiche apportate dall'utente nel pannello impostazioni. Usato per le funzioni annulla/ripristina.
      - FHT_nomeTema        : mantiene memorizzato, e quindi ripristina, l'ultimo valore inserito nel campo #FHT-inp-tema-utente con cui si può definire il nome per un nuovo tema o selezionare il corrispettivo già esistente per poterlo modificare
      - FHT_posizioniScroll : mantiene memorizzate, e quindi ripristina, le posizioni attuali dello scrorrimento di ciascuna scheda, e relativi contenuti, nel pannello impostazioni
*/

(() => {
'use strict';

// --------------------------------------------------
// ---                    INIT                    ---
// --------------------------------------------------

const _versione = GM.info.script.version;
const _paginaCorrente = {};
[, _paginaCorrente.nome = 'home', _paginaCorrente.queryString = null] = window.location.href.match(/^(?:https:\/\/forum.html.it\/forum\/(.+)?.php\??(.+)?)?/);
_paginaCorrente.contieneEditor = _contieneEditor(_paginaCorrente);
var SECURITYTOKEN = SECURITYTOKEN || unsafeWindow.SECURITYTOKEN;
const _keys = {SECURITYTOKEN: SECURITYTOKEN};

const
_css = {},
_fix = {},
_stage = {},
_azioni = {},
_colore = {},
_history = {},
_overlay = {},
_utility = {},
_datagrid = {},
_strumenti = {},
_pannelloToolset = {};


// --------------------------------------------------
// ---             FUNZIONI GENERICHE             ---
// --------------------------------------------------

// Restituisce una Promise che attende la verifica di un valore dato dalla funzione specificata
function _attendi(fn, tentativi = 30, intervallo = 200){
  return new Promise((ok, ko) => {
    (function ripeti(){
      var risposta = fn();
      if(risposta) ok(risposta);
      else if(tentativi === 0) ko();
      else setTimeout(ripeti, intervallo);
      tentativi--;
    })();
  });
}
// Restituisce un oggetto contenente delle proprietà di valore true corrispondenti ai nomi specificati come stringa di valori separati da spazio
function _valori2obj(strNomi){
 return strNomi ? strNomi.split(' ').reduce((obj, v) => {
    obj[v] = true;
    return obj;
  }, {}) : {};
}
// Imposta una classe per <html> o ne restituisce la sua esistenza
function _classeHtml(classe, b){
  return b == null ? document.documentElement.classList.contains(classe) : document.documentElement.classList.toggle(classe, +b);
}
// Sostituisce i segnaposto (nella forma [KEY]) rilevati nella stringa specificata, quindi restituisce la stringa modificata
function _replaceKeys(str){
  if(!str) return '';
  // Nell'oggetto _keys sono definite le proprietà che possono essere utilizzate come segnaposto. Per proprietà non definite sarà assegnato undefined
  return str.replace(/\[(.+)\]/g, (a,b) => _keys[b]);
}
// Restituisce l'indice dell'elemento specificato dentro l'array specificato o dentro l'elemento padre
function _indiceElemento(el, arr){
  return el ? (arr || Array.from( el.parentElement.children)).indexOf(el) : null;
}
// Restituisce true se la pagina specificata è identificata come pagina con editor
function _contieneEditor(o){
// o.pagina: [var] una stringa che rappresenta il nome della pagina, oppure un oggetto con proprietà "nome" e "queryString"
  const p = _valori2obj(_is(o, String) ? o : o.nome);
  const q = o.queryString || '';
  return p.showthread || p.newthread || p.newreply || p.editpost || (p.private && /do=(newpm|showpm|insertpm)/.test(q)) || (p.profile && /do=editsignature/.test(q)) || false;
}
// Restituisce true se a è di tipo b
function _is(a, b){
  return a == null ? false : a.constructor === b;
}
// Gestisce l'evento di creazione delle istanze editor, quindi esegue i callback precedentemente definiti
function _editorReady(){
  var _CKEDITOR;
  // NOTA: per restrizioni di sicurezza alcuni gestori userscript (vedi Greasemonkey su FF) bloccano l'uso di alcuni metodi degli oggetti definiti nello scope principale (accessibili tramite unsafeWindow).
  // In tal caso non posso usare CKEDITOR.on('instanceReady', ...) per osservare la creazione delle nuove istanze dell'editor, create in seguito a qualche evento.
  // Quindi uso MutationObserver per determinare quando nuovi elementi sono appesi alla pagina e verifico se nella proprietà CKEDITOR.instances sono state aggiunte nuove istanze.

  async function osserva(mutationList){
    let nuovoEditor = mutationList.find(o => o.target.classList.contains('editor_textbox') || o.target.classList.contains('cke_contents'));
    if(!nuovoEditor) return;

    const idEditor = nuovoEditor.target.closest('.editor_textbox').querySelector(':scope > textarea[name="message"]').id;
    let istanzaPrincipale;

    if(!_CKEDITOR){
      // Riferimento a CKEDITOR (v3.6.2) presente nella piattaforma
      var CKEDITOR = CKEDITOR || unsafeWindow.CKEDITOR;
      _CKEDITOR = CKEDITOR;
      istanzaPrincipale = true;
    }
    // Appena istanza corrente è pronta ed è accessibile nel DOM
    try { await _attendi(()=>_CKEDITOR.instances[idEditor], 20, 500); } catch (err) { return; }
    const editor = _CKEDITOR.instances[idEditor];
    try { await _attendi(()=>editor.document, 20, 500); } catch (err) { return; }

    setTimeout(() => {
      // Quando è pronto editor principale eseguo inizializzazione strumento "Riporta quotato"
      if(istanzaPrincipale) setTimeout(() => { if(_editorReady.callbacks.initRiportaQuotato) _editorReady.callbacks.initRiportaQuotato(editor); }, 1);

      // Per ciascun editor creato sulla pagina eseguo callback precedentemente definiti
      _editorReady.callbacks.forEach((fn, i) => { fn(editor); });
    }, 1);
  }
  // Verifico se è già presente un editor ad apertura pagina
  const editor = [...document.querySelectorAll('.body_wrapper .editor_textbox')].map(a=>({target: a}));
  if(editor.length) osserva(editor);
  // Osservo creazione di qualsiasi editor sulla pagina
  new MutationObserver((mutationList, observer) => {
    osserva(mutationList);
  }).observe(document.querySelector('.body_wrapper'), {childList: true, subtree:true});
}
_editorReady.callbacks = [];

// Restituisce stringa JSON in base all'oggetto e ai parametri specificati
function _stringify(data, par = {}) {
  // data       : [var] dato da convertire in stringa
  // [par]      : [obj] parametri opzionali
  // - [indent] : [int] quantità spazi per indentazione
  // - [each]   : [fun] callback eseguito per ogni ricorsione, con cui è possibile alterare risultato valore elaborato
  //
  //   Riceve un oggetto con i seguenti parametri:
  //   - initialData   : [var] lo stesso che "data"
  //   - currentData   : [var] dato esaminato relativamente a ricorsione corrente
  //   - initialIndent : [int] lo stesso che "par.indent"
  //   - currentDepth  : [int] valore che indica livello profondità relativo al dato esaminato
  //   - path          : [str] percorso testuale (con sintassi a punti) della chiave relativa al dato esaminato. Ogni chiave rappresenta nome di proprietà (per gli oggetti) o valore indice (per gli array)
  //
  //   Deve poter restituire uno dei seguenti valori:
  //   - stringa che sarà usata in sostituzione di quella altrimenti restituita da funzione principale per dato corrente
  //   - oggetto contenente almeno una delle seguenti proprietà:
  //     - data          : [var] dato che sarà considerato nella funzione principale al posto di quello esaminato per relativa ricorsione
  //     - currentIndent : [int] valore indentazione totale, per ricorsione corrente, che sarà considerato al posto di quello altrimenti determinato dalla funzione principale
  //     - noIndent      : [bol] se true, specifica di non applicare indentazione per dato corrente. Sovrascrive "currentIndent"
  //   Qualsiasi altro tipo di valore restituito dalla funzione di callback sarà scartato proseguendo normalmente il ciclo di ricorsione

  let strData = data === undefined ? '' :
  data === null ? 'null' :
  data.toString() === "NaN" ? 'null' :
  data === Infinity ? 'null' :
  _is(data, String) ? `"${data.replace(/"/g, '\\"')}"` :
  _is(data, Number) ? String(data) :
  _is(data, Boolean) ? (data ? 'true' : 'false') :
  null;

  const {
    indent: initialIndent = 0,
    each = () => {},
    initialData = data,
    currentDepth = 0,
    appendSeparator = false,
    appendBracket = '',
    isPropertyVal = false,
    path = ''
  } = par;

  const eachVal = each({initialData, currentData: data, initialIndent, currentDepth, path});
  let currentIndent, noIndent;
  if(eachVal != null){
    if(_is(eachVal, String)) data = eachVal;
    else if(_is(eachVal, Object)) ({data = data, currentIndent, noIndent} = eachVal);
  }
  if(currentDepth === 0 || noIndent) currentIndent = 0;
  else if(currentIndent == null) currentIndent = initialIndent * currentDepth;
  const strIndent = noIndent ? '' : '\n' + (' '.repeat(currentIndent));

  const prepend = currentDepth === 0 || noIndent || isPropertyVal ? '' : strIndent;
  const append = appendSeparator ? (currentIndent === 0 ? ', ' : ',') : (appendBracket ? (noIndent ? appendBracket.slice(-1) : appendBracket) : '');

  if(strData !== null) return prepend + strData + append;

  par = {initialData, indent: initialIndent, currentDepth: currentDepth + 1, each};

  if(_is(data, Array)){
    strData = (data.length === 0) ? '[]' :
    '[' + data.reduce((acc, val, index, arr) => {
      const oPath = (path ? path + '.' : '') + index;
      const appendSeparator = index < arr.length - 1;
      const appendBracket = index == arr.length - 1 ? strIndent + ']' : '';
      return acc + _stringify(val, {...par, key: index, appendSeparator, appendBracket, path: oPath});
    }, '');
  }
  if(_is(data, Object)){
    strData = (Object.keys(data).length === 0) ? '{}' :
    '{' + Object.keys(data).reduce((acc, key, index, arr) => {
      if(data[key] === undefined) return acc;
      const oPath = (path ? path + '.' : '') + key;
      const appendSeparator = index < arr.length - 1;
      const appendBracket = index == arr.length - 1 ? strIndent + '}' : '';
      return acc + _stringify(key, {...par, path: oPath}) + ': ' + _stringify(data[key], {...par, key, appendSeparator, appendBracket, path: oPath, isPropertyVal: true });
    }, '');
  }
  return prepend + (strData || '') + append;
}

// Applica o rimuove blocco elementi specificati
function _disabilita(sel, bol){
  // sel : [var] può essere singolo elemento DOM, nodeList o stringa da usare come selettore
  if(_is(sel, String)) sel = document.querySelectorAll(sel);
  if(_is(sel, NodeList)){
    sel.forEach(e => {
      const b = e.classList.toggle('FHT-disabilitato', bol);
      if(_is(e, HTMLButtonElement)) e.disabled = b;
    });
    return;
  }
  const b = sel.classList.toggle('FHT-disabilitato', bol);
  if(_is(sel, HTMLButtonElement)) sel.disabled = b;
}
// Apre finestra modale e visualizza messaggio specificato
function _modal(msg, delay){
  if(delay === undefined) delay = 10;
  if(_is(msg, Number)){
    msg = _modal.msgList[msg];
  }
  setTimeout(() => {
    alert(msg);
  }, delay);
}
// Messaggi predefiniti
_modal.msgList = {
  20: '⚠️ Non riesco ad aprire il lettore file.\n\n💡 Puoi provare a trascinare il file sul pannello impostazioni.',
  21: '⚠️ Non riesco a leggere questo file.\n\n💡 Prova a selezionarlo nuovamente e quindi aprirlo.',
  22: '⚠️ Scusa! Non riconosco il formato di questi dati.\n\n Nessuna impostazione sarà modificata.',
  50: '⚠️ Qualcosa è andato storto!\nNon riesco a copiare negli appunti.\n\n💡 Puoi provare col sistema tradizionale.',
  100: '⚠️ Raggiunto il limite di righe per questo datagrid. Non è possibile inserirne delle altre.'
};


// --------------------------------------------------
// ---            ELABORAZIONE COLORI             ---
// --------------------------------------------------

_colore.formatHex = (hex, valSeVuoto, cancelletto = true) => {
  let r = hex.match(/^#?([a-f0-9]{3,6})$/i);
  r = r ? r[1].toLowerCase() : '';
  return (valSeVuoto && hex === '') ? valSeVuoto : (cancelletto ? '#' : '') + (r.length === 3 ? r.replace(/(.)(.)(.)/, '$1$1$2$2$3$3') : '000000'.slice(r.length) + r);
};
_colore.hex2HSV = hex => {
  if(hex[0] === '#') hex = hex.slice(1);
  const [r, g, b] = hex.match(/../g).map(c=>parseInt(c, 16) / 255);
  const v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return {h: (h < 0 ? h + 6 : h) / 6, s: v && c / v, v: v};
};
_colore.HSV2Hex = hsv => {
  let f = (n, k = (n + hsv.h * 6) % 6)=>('0' + Math.round((hsv.v - hsv.v * hsv.s * Math.max(Math.min(k, 4 - k, 1), 0)) * 255).toString(16)).slice(-2);
  return f(5) + f(3) + f(1);
};
_colore.regola = (hex, o = {}) => {
  const hsv = _colore.hex2HSV(hex);
  const out = '#' + _colore.HSV2Hex({
    h: (hsv.h + (o.h_offset || 0)) % 1,
    s: Math.max(0, Math.min(1, hsv.s * ((o.s_max || 1) - (o.s_min || 0)) + (o.s_min || 0))),
    v: Math.max(0, Math.min(1, hsv.v * ((o.v_max || 1) - (o.v_min || 0)) + (o.v_min || 0)))
  });
  return out;
};


// --------------------------------------------------
// ---           GESTIONE IMPOSTAZIONI            ---
// --------------------------------------------------

// Funzione principale, imposta/restituisce parametro definito nelle impostazioni o oggetto che rappresenta impostazioni salvate
function _impostazioni(key, val){
  // Se "key" non è specificato, restituisco oggetto che contiene tutte le impostazioni (utente e di sistema)
  if(key == null) return {..._impostazioni.utente, ..._impostazioni.sistema};
  // Convalido dato
  const {val: valore, gruppoImpostazioni, campo, isDefault, nonDefinito} = _impostazioni.convalidaDato(key, val);
  // Campo non definito o senza valori
  if(nonDefinito) return undefined;
  // Memorizzo dato
  if(val !== null){
    if(isDefault) delete gruppoImpostazioni[key];
    else gruppoImpostazioni[key] = valore;
  }
  // Restituisco oggetto che rappresenta il dato: {val: [var], defaultVal: [var], isDefault: [bol]}
  return {val: valore, defaultVal: campo.valori[0], isDefault};
}
// Proprietà campi custom
_impostazioni.campiCustom = {
  temiUtente: {
    convalidaValore: (temi, prop = {}) => {
      // Restituisce un array di elementi così strutturati:
      // [nome, schemaColore, coloreBase, coloreEvidenziato]
      //
      // - "nome" è una stringa con valore univoco che rappresenta il nome del tema. Se risulta già presente, il relativo tema sarà sovrascritto a quello esistente
      // - "schemaColore" deve avere uno dei seguenti valori
      //   A: auto (impostazione sistema operativo)
      //   C: chiaro
      //   S: scuro
      //
      // - "coloreBase" e "coloreEvidenziato" devono essere codici colore esadecimali del tipo RRGGBB
      //
      const {mantieniPosizioneOriginaleDuplicati = false} = prop;
      return temi.reduce((a, b) => {
        if(_is(b, Array) && b.length === 4){
          let [nome, schemaColore, coloreBase, coloreEvidenziato] = b;
          nome = nome.toString().trim().slice(0, _impostazioni.campi.temaUtente.lunghezzaMaxNome);
          schemaColore = _impostazioni.convalidaDato('schemaColore', schemaColore).val;
          coloreBase = _impostazioni.convalidaDato('coloreBase', coloreBase).val;
          coloreEvidenziato = _impostazioni.convalidaDato('coloreBase', coloreEvidenziato).val;
          const tema = [nome, schemaColore, coloreBase, coloreEvidenziato];
          // Sovrascrivo duplicati
          const i = a.findIndex(e => e[0] === nome || (e[1] === schemaColore && e[2] === coloreBase && e[3] === coloreEvidenziato));
          if(i !== -1){
            if(mantieniPosizioneOriginaleDuplicati) a[i] = tema;
            else a.splice(i, 1);
          }
          if(i === -1 || !mantieniPosizioneOriginaleDuplicati) a.push(tema);
        }
        return a;
      }, []);
    },
    unisci: temi => {
      _impostazioni('temiUtente', _impostazioni.campi.temiUtente.convalidaValore([..._impostazioni('temiUtente').val, ...temi], {mantieniPosizioneOriginaleDuplicati: true}));
    }
  },
  barreUtilityUtente: {
    convalidaValore: (barre, prop = {}) => {
      // Restituisce un array di oggetti così strutturati:
      // {nome: [str], elementi: [array], [aperto]: [bol]}
      //
      // - "nome": stringa con valore univoco che rappresenta il nome della barra utility.
      //   Se risulta già presente tra i nomi delle barre predefinite, questa barra sarà scartata.
      //   Tuttavia se risulta già presente tra i nomi delle barre utility utente, la barra esistente sarà sovrascritta a questa o, nel caso di unione delle impostazioni, i relativi elementi verranno possibilmente uniti.
      //
      // - "elementi": array di elementi link così strutturati:
      //   [Testo, Href, Title, _blank, Nascosto]
      //
      //   - Testo e Href sono obbligatori, gli altri valori sono facoltativi, Se Href non è presente, sarà applicata una stringa vuota.
      //   - Title: valore testuale che viene applicato come attributo "title" per il quale viene normalmente mostrato il tooltip quando il puntatore stà sopra l'elemento. Valore default: ""
      //   - _blank: 0 o 1. Se 1, il link sarà aperto in nuova scheda. Valore default: 0
      //   - Nascosto: 0 o 1. Se 1, il link viene tenuto memorizzato ma non sarà visibile nella barra utility sul forum. Valore default: 0
      //
      // - "aperto": 0 o 1, indicano rispettivamente lo stato, chiuso o aperto, in cui era stato lasciato il dataGrid relativo a questa barra. All'apertura del pannello impostazioni, sarà quindi ripristinato il precedente stato.
      //   Questa proprietà è facoltativa; se omessa, sarà considerato lo stato chiuso.
      //
      if(_is(barre, Object)){
        if(!('nome' in barre)) return [];
        else barre = [barre];
      } else if(!_is(barre, Array)) return [];

      const {mantieniPosizioneOriginaleDuplicati = false} = prop;
      const campo = _impostazioni.campi.barraUtility;
      return barre.reduce((a, b) => {
        let {nome, elementi, aperto = false} = b;
        nome = nome.toString().trim().slice(0, campo.lunghezzaMaxNome);
        // Unisco barre con stesso nome
        const i = a.findIndex(e => e.nome === nome);
        if(i !== -1){
          elementi = [...a[i].elementi, ...elementi];
          if(mantieniPosizioneOriginaleDuplicati) aperto = a[i].aperto;
        }
        // Valido elementi
        if(_is(elementi, Array)){
          const def = campo.definizioneCampi;
          elementi = elementi.reduce((c, d) => {
            if(_is(d, Array)){
              let [testo = '', href = '', title = '', blank = '', nascosto = ''] = d;
              testo = testo.toString().trim().slice(0, def[0].lunghezzaMax);
              href = href.toString().trim().slice(0, def[1].lunghezzaMax);
              title = title.toString().trim().slice(0, def[2].lunghezzaMax);
              blank = +blank ? 1 : '';
              nascosto = +nascosto ? 1 : '';
              let skipTrim;
              const elemento = [testo, href, title, blank, nascosto].reduceRight((e, f) => {
                if(skipTrim || f !== ''){
                  skipTrim = true;
                  e.unshift(f);
                }
                return e;
              },[]);
              if(elemento.length > 0){
                // Sovrascrivo elementi con stesso "href"
                const g = c.findIndex(e => e[1] === href);
                if(g !== -1){
                  if(mantieniPosizioneOriginaleDuplicati) c[g] = elemento;
                  else c.splice(g, 1);
                }
                if(g === -1 || !mantieniPosizioneOriginaleDuplicati) c.push(elemento);
              }
            }
            return c;
          }, []);
          elementi.splice(campo.limiteElementi);
        } else elementi = [];
        const o = {nome, elementi, ...(aperto && {aperto: 1})};
        if(i !== -1){
          if(mantieniPosizioneOriginaleDuplicati) a[i] = o;
          else a.splice(i, 1);
        }
        if(i === -1 || !mantieniPosizioneOriginaleDuplicati) a.push(o);

        return a;
      }, []);
    },
    unisci: barre => {
      _impostazioni('barreUtilityUtente', _impostazioni.campi.barreUtilityUtente.convalidaValore([..._impostazioni('barreUtilityUtente').val, ...barre], {mantieniPosizioneOriginaleDuplicati: true}));
    }
  }
};
// Definizione campi pannello Impostazioni Toolset
_impostazioni.campi = {

  // Layout
  rimuoviTopBar: {tipo: 'checkbox', valori: [0], azioni: {change: ['aggiornaStyleLayout']}},
  visualizzazioneCompatta: {tipo: 'checkbox', valori: [1], azioni: {change: ['aggiornaStyleLayout']}},
  stickyBarraUtility: {tipo: 'checkbox', valori: [1], azioni: {change: [['classeHtml', 'FHT-sticky-barra-utility']]}},
  larghezzaMassima: {tipo: 'range', valori: [996, 768, 1800], azioni: {change: ['fineAnteprimaLarghezzaEstesa', 'aggiornaStyleLayout'], input: ['anteprimaLarghezzaEstesa'], default: ['anteprimaLarghezzaEstesa']}},
  fontSizeCodice: {tipo: 'range', valori: [10, 7, 16], azioni: {change: ['aggiornaStyleLayout'], input: [['setFontSizeEl', 'codice']], default: [['setFontSizeEl', 'codice']]}},
  fontSizeUtility: {tipo: 'range', valori: [6, 6, 16], azioni: {change: ['aggiornaStyleLayout'], input: [['setFontSizeEl', 'utility']], default: [['setFontSizeEl', 'utility']]}}, // Il valore 6 corrisponde ad "auto"

  // Colori
  schemaColore: {tipo: 'select', valori: ['A', 'C', 'S'], azioni: {change: ['aggiornaStyleColore', 'selezionaTemaCorrispondente']}},
  coloreBase: {tipo: 'color', valori: [''], azioni: {change: ['aggiornaStyleColore', 'aggiornaHex', 'selezionaTemaCorrispondente'], focus: ['overlayTrasparente'], blur: ['fineOverlayTrasparente'], input: ['aggiornaStyleColore', 'aggiornaHex'], default: ['aggiornaStyleColore']}},
  coloreEvidenziato: {tipo: 'color', valori: [''], azioni: {change: ['aggiornaStyleColore', 'aggiornaHex', 'selezionaTemaCorrispondente'], focus: ['overlayTrasparente'], blur: ['fineOverlayTrasparente'], input: ['aggiornaStyleColore', 'aggiornaHex'], default: ['aggiornaStyleColore']}},
  coloreBaseHex: {tipo: 'hex', ausiliario: true, azioni: {init: ['initInputHex'], change: ['setColoreCampo', 'selezionaTemaCorrispondente'], focus: ['overlayTrasparente'], blur: ['fineOverlayTrasparente']}},
  coloreEvidenziatoHex: {tipo: 'hex', ausiliario: true, azioni: {init: ['initInputHex'], change: ['setColoreCampo', 'selezionaTemaCorrispondente'], focus: ['overlayTrasparente'], blur: ['fineOverlayTrasparente']}},
  temiUtente: {tipo: 'custom', valori: [[]], ..._impostazioni.campiCustom.temiUtente},
  temaUtente: {valori: [-1], diSistema: true, azioni: {init: ['initTemaUtente', 'initTemi'], change: ['applicaTema', 'aggiornaStyleColore', 'overlayTrasparente', ['fineOverlayTrasparente', 4000]]}, lunghezzaMaxNome: 32, temi:[]},
  temaPredefinito: {valori: [0], diSistema: true, azioni: {init: ['initTemi'], change: ['applicaTema', 'aggiornaStyleColore', 'overlayTrasparente', ['fineOverlayTrasparente', 4000]]},
    temi: [
      // I valori del primo tema (tema di default) sono applicati in automatico come valori default dei relativi campi colore
      ['Default HTML.it', 'A', '212954', '29a4e5'],
      ['Sapphire Velvet', 'S', '8a96d0', '62da2f'],
      ['Oriental Nights', 'S', '2b297f', 'eeba2b'],
      ['Galaxy Blue', 'S', '214a87', '00aaff'],
      ['Teal Dust', 'A', '257c8e', 'e5c366'],
      ['Mint Fragrance', 'A', '22bf90', '16d4c8'],
      ['Intense Musk', 'S', '869e42', '0fa35e'],
      ['Deep Forest', 'S', '155128', '2a1604'],
      ['Pure Licorice', 'S', '241a05', '43371e'],
      ['Coco Sweet', 'S', '6a4029', 'dfdac8'],
      ['Fashion Tomato', 'S', 'e9272f', '39db44'],
      ['Fresh Kiwi', 'S', 'b48646', 'bce62f'],
      ['Ananas Cocktail', 'A', 'f2c10d', '0ec41a'],
      ['Autumn Maple', 'A', 'd2691e', 'dbac00'],
      ['Summer Lime', 'A', '92dd69', 'b9ff14'],
      ['Aquarium', 'A', '33b1ff', 'f0e6ad'],
      ['Sand Castles', 'A', 'd6ceb6', 'a79b8e'],
      ['PANTONE® 2024 - Cyber Lime', 'A', 'c9cc22', '65dde6'],
      ['PANTONE® 2024 - Radiant Red', 'A', 'ed5f51', 'e93830'],
      ['PANTONE® 2024 - Elemental Blue', 'A', '5f6c96', '284585'],
      ['PANTONE® 2024 - Fondant Pink', 'A', 'd8a2c2', 'fadeef'],
      ['PANTONE® 2023 - Viva Magenta', 'A', 'bc2649', 'f872ba'],
      ['PANTONE® 2022 - Very Peri', 'A', '6868ac', 'dfc881'],
      ['PANTONE® 2021 - Ultimate Gray', 'A', '949597', 'f5df4d']
    ]
  },

  // Strumenti
  copiaCodice: {tipo: 'checkbox', valori: [1], azioni: {change: [['classeHtml', 'FHT-copia-codice']]}},
  riportaQuotato: {tipo: 'checkbox', valori: [1], azioni: {change: [['classeHtml', 'FHT-riporta-quotato']]}},
  mantieniSessione: {tipo: 'checkbox', valori: [1], azioni: {change: ['mantieniSessione']}},
  identificaStaff: {tipo: 'checkbox', valori: [1], azioni: {change: [['classeHtml', 'FHT-identifica-staff']]}},
  togglePassword: {tipo: 'checkbox', valori: [1], azioni: {change: [['classeHtml', 'FHT-toggle-password']]}},

  // Utility
  barraUtility: {valori: ['Emoji (predefinita)'], lunghezzaMaxNome: 32, limiteElementi: 100, azioni: {init: ['initBarraUtility'], change: ['selezionaBarraUtility']},
    definizioneCampi: [
      {nome: 'Testo', tipo: 'text', descrizione: 'Testo del link', lunghezzaMax: 32, classCol: 'FHT-datagrid-col-testo'},
      {nome: 'Href', tipo: 'url', descrizione: 'Attributo Href', lunghezzaMax: 2048, classCol: 'FHT-datagrid-col-href'},
      {nome: 'Title', tipo: 'text', descrizione: 'Attributo Title', lunghezzaMax: 32, classCol: 'FHT-datagrid-col-title'},
      {nome: '_blank', tipo: 'checkbox', descrizione: 'Apri in nuova scheda', classCol: 'FHT-datagrid-col-blank'},
      {nome: 'Nascosto', tipo: 'checkbox', descrizione: 'Non mostrare nella barra', classCol: 'FHT-datagrid-col-nascosto'}
    ],
    barrePredefinite: [
      { nome: 'Emoji (predefinita)',
        elementi: [
          ['🏠', 'https://forum.html.it/', 'Home'],
          ['✨', 'https://forum.html.it/forum/search.php?do=getnew&contenttype=vBForum_Post', 'Nuovi messaggi'],
          ['☑️', 'https://forum.html.it/forum/forumdisplay.php?do=markread&markreadhash=[SECURITYTOKEN]', 'Segna i forum come letti'],
          ['📜', 'https://forum.html.it/forum/misc.php?do=showrules', 'Regolamento'],
          ['👷', 'https://forum.html.it/forum/showgroups.php', 'Lo staff del forum'],
          ['👨‍👩‍👧‍👦', 'https://forum.html.it/forum/memberlist.php', 'Utenti'],
          ['🔍', 'https://forum.html.it/forum/search.php', 'Ricerca avanzata'],
          ['❓', 'https://forum.html.it/forum/faq.php', 'FAQ'],
          ['🗃️', 'https://forum.html.it/forum/archive/', 'Archivio'],
          ['🟢', 'https://forum.html.it/forum/online.php?perpage=200', 'Utenti online'],
          ['🅱️', 'https://forum.html.it/forum/misc.php?do=bbcode', 'Lista dei codici BB']
        ]
      },
      { nome: 'Default HTML.it',
        elementi: [
          ['Home', 'https://forum.html.it/', 'Home'],
          ['Nuovi messaggi', 'https://forum.html.it/forum/search.php?do=getnew&contenttype=vBForum_Post', 'Nuovi messaggi'],
          ['FAQ', 'https://forum.html.it/forum/faq.php', 'FAQ'],
          ['Ricerca avanzata', 'https://forum.html.it/forum/search.php', 'Ricerca avanzata'],
          ['Segna i forum come letti', 'https://forum.html.it/forum/forumdisplay.php?do=markread&markreadhash=[SECURITYTOKEN]', 'Segna i forum come letti'],
          ['Lo staff del forum', 'https://forum.html.it/forum/showgroups.php', 'Lo staff del forum'],
          ['Regolamento', 'https://forum.html.it/forum/misc.php?do=showrules', 'Regolamento'],
          ['Utenti', 'https://forum.html.it/forum/memberlist.php', 'Utenti'],
          ['Archivio', 'https://forum.html.it/forum/archive/', 'Archivio'],
        ]
      }
    ]
  },
  statoBarrePredefinite: {valori: ['']},
  barreUtilityUtente: {tipo: 'custom', valori: [[]], ..._impostazioni.campiCustom.barreUtilityUtente}
};

// Inizializzo valori default per campi colore in base a tema default
(() => {
  const campo = _impostazioni.campi.temaPredefinito;
  const tema = campo.temi[campo.valori[0]];
  _impostazioni.campi.schemaColore.valori.sort((a,b) => a == tema[1] ? -1 : b == tema[1] ? 1 : 0);
  _impostazioni.campi.coloreBase.valori = [tema[2]];
  _impostazioni.campi.coloreEvidenziato.valori = [tema[3]];
})();

// Oggetto che rappresenta impostazioni utente (escludendo quelle con valore default)
_impostazioni.utente = {};
// Stringa JSON che rappresenta impostazioni utente
_impostazioni.JSON = null;
// Oggetto che rappresenta impostazioni di sistema (relative ai campi definiti come "diSistema")
_impostazioni.sistema = {};
// Restituisce valore convertito, se possibile, secondo il tipo specificato
_impostazioni.getValoreTipizzato = (val, tipo) => tipo === Number ? +val : (tipo === Object || tipo === Array ) && _is(val, String) ? JSON.parse(val) : val;
// Esegue validazione dato specificato e restituisce oggetto che ne rappresenta il risultato
_impostazioni.convalidaDato = (key, val) => {
  if(!(key in _impostazioni.campi) || !('valori' in _impostazioni.campi[key])) return {nonDefinito: true};
  const campo = _impostazioni.campi[key];
  const tipoCampo = campo.tipo;
  const gruppoImpostazioni = campo.diSistema ? _impostazioni.sistema : _impostazioni.utente;
  const valoreDefault = campo.valori[0];
  let valore;
  if(val == null) valore = key in gruppoImpostazioni ? gruppoImpostazioni[key] : valoreDefault;
  else {
    // Correggo valore se non conforme ai parametri definiti per il campo
    valore = _impostazioni.getValoreTipizzato(val, valoreDefault.constructor);
    if(tipoCampo === 'checkbox') valore = +!!valore;
    else if(tipoCampo === 'range') valore = Math.min(campo.valori[2], Math.max(campo.valori[1], valore));
    else if(tipoCampo === 'select'){
      valore = campo.valori.find(a => a.toLowerCase() === valore.toLowerCase());
      if(valore == null) valore = valoreDefault;
    }
    else if(tipoCampo === 'color') valore = _colore.formatHex(valore, false, false);
    else if(tipoCampo === 'custom' && campo.convalidaValore) valore = campo.convalidaValore(valore);
  }
  const isDefault = (_is(valore, Array) || _is(valore, Object)) ? JSON.stringify(valore) === JSON.stringify(valoreDefault) : valore === valoreDefault;
  return {val: valore, gruppoImpostazioni, campo, isDefault};
};
// Unisce due oggetti impostazioni
_impostazioni.unisci = (obj, src) => {
  for (let key in obj){
    const campo = _impostazioni.campi[key];
    if(campo.tipo === 'custom' && !!campo.unisci) campo.unisci(obj[key]);
    else src[key] = obj[key];
  }
};
// Gestione dati
_impostazioni.encode = (obj = _impostazioni.utente) => JSON.stringify(obj);
_impostazioni.decode = str => {
  let r = {};
  if(str){
    try {
      r = JSON.parse(str);
      // Mantengo retrocompatibilità per impostazioni rimosse o modificate in v1.3.0+
      if(r.temiUtente !== undefined && !_is(r.temiUtente, Array)) delete r.temiUtente;
      if(r.temiUtenteLista) delete Object.assign(r, {temiUtente: r.temiUtente || r.temiUtenteLista }).temiUtenteLista;
      if(r.coloreBase) r.coloreBase = _colore.formatHex(r.coloreBase, false, false);
      if(r.coloreEvidenziato) r.coloreEvidenziato = _colore.formatHex(r.coloreEvidenziato, false, false);
      Object.keys(r).forEach(key => {
        // Rimuovo dati non validi
        if(!_impostazioni.campi.hasOwnProperty(key) || !_impostazioni.campi[key].hasOwnProperty('valori') || _impostazioni.campi[key].diSistema) delete r[key];
        // Convalido valore
        else r[key] = _impostazioni.convalidaDato(key, r[key]).val;
      });
    } catch (e){
      r = null;
    }
  }
  return r;
};
_impostazioni.carica = async callback => {
  // NOTA: uso localStorage come cuscinetto in appoggio alle GM API. In questo modo, quando possibile, limito caricamento asincrono impostazioni,
  // perché il CSS viene inserito e applicato dopo questo caricamento e creerebbe disturbo iniziale se eseguito in modo asincrono
  let str = localStorage.getItem('FHT_impostazioni');
   if(str == null && !!GM){
    str = await GM.getValue('FHT_impostazioni', '');
    localStorage.setItem('FHT_impostazioni', str);
  }
  if(str) _impostazioni.utente = _impostazioni.decode(str) || {};
  str = _impostazioni.encode();

  _impostazioni.JSON = str || '';
  callback(str);
};
_impostazioni.salva = str => {
  if(str || Object.keys(_impostazioni.utente).length){
    if(!str) str = _impostazioni.JSON = _impostazioni.encode();
    _history.add(str);
    localStorage.setItem('FHT_impostazioni', str);
    if(!!GM) GM.setValue('FHT_impostazioni', str);
  } else {
    _history.add('{}');
    _impostazioni.JSON = '';
    localStorage.removeItem('FHT_impostazioni');
    if(!!GM) GM.deleteValue('FHT_impostazioni');
  }

  // Aggiorno valore prompt configurazione corrente
  const promptCurrent = document.getElementById('FHT-prompt-current');
  if(promptCurrent) promptCurrent.value = _pannelloToolset.prompt.stringify(_impostazioni.utente, true);
};
_impostazioni.importa = e => {
  if(!window.FileReader){
    _modal(20);
    return;
  }
  let input = document.getElementById('FHT_inputFile');
  if(input){
    input.value = null;
    input.click();
    return;
  }
  input = document.createElement('input');
  input.id = 'FHT_inputFile';
  input.type = 'file';
  input.style.cssText = 'display:none';
  input.accept = '.json';
  input.value = null;
  document.body.appendChild(input);
  input.click();
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const str = reader.result;
      if(!_history.restore(str)){
        _modal(22);
        return;
      }
      _history.add(str);
    });
    reader.addEventListener('error', er => {
      if(er.target.error.name == 'NotReadableError') _modal(21);
    });
    reader.readAsText(file, 'utf-8');
    document.body.removeChild(input);
  });
};
_impostazioni.esporta = e => {
  const str = _impostazioni.JSON;
  const name = 'fht_usersettings.json';
  const blob = new Blob(['\ufeff' + str], {type: "application/json"});
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(objUrl);
    document.body.removeChild(a);
  }, 100);
};


// --------------------------------------------------
// ---       PANNELLO IMPOSTAZIONI TOOLSET        ---
// --------------------------------------------------

_pannelloToolset.initPulsante = contenitore => {
  // Creo e inizializzo pulsante
  const btnToolset = document.createElement('button');
  btnToolset.id = 'FHT-btn-impostazioni';
  btnToolset.title = 'Impostazioni Toolset';
  _disabilita(btnToolset, true);
  contenitore.appendChild(btnToolset);
  btnToolset.addEventListener('click', _pannelloToolset.apri);
};
_pannelloToolset.apri = () => {
  _overlay.apri(
    '<h2>Impostazioni – <i>Toolset v' + _versione + '</i></h2> <a target="_blank" href="https://greasyfork.org/it/scripts/451835-forum-html-it-toolset" title="Consulta documentazione (greasyfork.org)" class="FHT-distanza-auto">❔</a>',
    _pannelloToolset.corpo(),
`<div class="FHT-btnbar">
  <button class="FHT-btn" id="FHT-btn-undo" title="Annulla [Ctrl + Z]"><i class="FHT-ico-undo"></i></button>
  <button class="FHT-btn" id="FHT-btn-redo" title="Ripristina [Ctrl + Y]"><i class="FHT-ico-redo"></i></button>
  <span class="FHT-distanza-auto"></span>
  <input type="button" class="FHT-btn" id="FHT-btn-importa" value="📂" title="Importa Configurazione">
  <input type="button" class="FHT-btn" id="FHT-btn-esporta" value="💾" title="Esporta Configurazione">
</div>`
  );

  // Impostazioni cronologia
  window.addEventListener('keydown', _history.keyboardShortcuts);
  document.getElementById('FHT-btn-undo').addEventListener('click', _history.undo);
  document.getElementById('FHT-btn-redo').addEventListener('click', _history.redo);

  // Gestione impostazioni
  document.getElementById('FHT-btn-importa').addEventListener('click', _impostazioni.importa);
  document.getElementById('FHT-btn-esporta').addEventListener('click', _impostazioni.esporta);

  // Gestione scorrimento contenuti. Al variare dello scroll, per il corpo delle schede e vari elementi, ne memorizzo la posizione così da poterla ripristinare alla prossima apertura
  document.getElementById('FHT-pannello-impostazioni').addEventListener('scrollend', e => { _pannelloToolset.posizioneScroll({['scheda_' + _pannelloToolset.schedaAttiva]: e.currentTarget.scrollTop}); });
  document.getElementById('FHT-prompt-editor').addEventListener('scrollend', e => { _pannelloToolset.posizioneScroll({'campo_prompt_editor': e.currentTarget.scrollTop}); });
  document.getElementById('FHT-prompt-current').addEventListener('scrollend', e => { _pannelloToolset.posizioneScroll({'campo_prompt_current': e.currentTarget.scrollTop}); });

  // Imposto stato pulsanti cronologia
  _history.setButtons();

  // Imposto contenuti
  _pannelloToolset.impostaContenuti();
};
_pannelloToolset.aggiorna = () => {
  _overlay.aggiorna(null, _pannelloToolset.corpo(), null);
  _pannelloToolset.impostaContenuti();
  _history.setButtons();
};
_pannelloToolset.impostaContenuti = () => {
  // --- FORM ---

  const formImpostazioni = document.getElementById('FHT-form-impostazioni');
  const gruppiRadio = {nomi: [], gruppo: {}};
  const onDefault = new Event('default');
  const onChange = new Event('change');
  const onInit = new Event('init');
  // Ciclo campi definiti nelle impostazioni
  Object.keys(_impostazioni.campi).forEach(key => {
    const campo = _impostazioni.campi[key];
    const controllo = formImpostazioni.querySelector(`[name="${ key }"]`);
    if(!controllo) return;
    const label = controllo.closest('label');
    const par = _impostazioni(key);
    const azioni = campo.azioni;
    const isRadio = campo.tipo === 'radio';
    const isAusiliario = !!campo.ausiliario;
    // Definisco listener per azioni specificate
    Object.keys(azioni).forEach(evt => {
      controllo.addEventListener(evt, e => {
        const me = e.target;
        const val = campo.tipo === 'checkbox' ? +me.checked : me.value;
        // Eseguo azioni definite per questo evento
        azioni[evt].forEach(fn => {
          // NOTA: le modifiche effettuate non sono ancora salvate in questo punto.
          //       Nelle funzioni richiamate è quindi necessario basarsi sul valore passato come argomento (val) anziché su quello restituito dalle impostazioni
          if(Array.isArray(fn)) _azioni[fn[0]](me, val, [... fn.slice(1)]);
          else _azioni[fn](me, val);
        });
        // Se evento change
        if(evt === 'change'){
          // Salvo valore modificato (solo campi non ausiliari)
          if(!isAusiliario){
            _pannelloToolset.impostaInput(me, val, gruppiRadio.gruppo[key]);
            _impostazioni.salva();
          }
        }
      });
    });
    // Imposto valori iniziali e classi
    if(!isRadio || !gruppiRadio.nomi.includes(key)){
      if(isRadio){
        gruppiRadio.nomi.push(key);
        gruppiRadio.gruppo[key] = _pannelloToolset.getGruppoRadio(key);
      }
      if(par){
        _pannelloToolset.impostaInput(controllo, par.val, gruppiRadio.gruppo[key]);
        _pannelloToolset.impostaOutput(controllo, par.val);
      }
      controllo.dispatchEvent(onInit);
    }
    // Segno il controllo come ausiliario se specificato
    if(isAusiliario) controllo.classList.add('FHT-controllo-ausiliario');
    // Esco se è un campo ausiliario o il controllo non ha label
    if(isAusiliario || !label) return;
    // Aggiungo pulsante "Ripristina default"
    const btnDefault = document.createElement('div');
    btnDefault.appendChild(document.createElement('div'));
    btnDefault.classList.add('FHT-btn-default');
    btnDefault.title = 'Ripristina default';
    label.appendChild(btnDefault);
    btnDefault.addEventListener('click', e => {
      const me = e.currentTarget;
      const label = me.closest('label');
      const controllo = label.querySelector(':scope > input, :scope > select');
      const key = controllo.name;
      const val = _impostazioni(key).defaultVal;
      _impostazioni.salva();
      // In un gruppo radio, controlloAttivo è l'input che risulta selezionato
      const controlloAttivo = _pannelloToolset.impostaInput(controllo, val, gruppiRadio.gruppo[key]);
      controllo.dispatchEvent(onDefault);
      controlloAttivo.dispatchEvent(onChange);
    });
    // Prevengo click su label se ho cliccato "Ripristina default" o un controllo ausiliario
    label.addEventListener('mousedown', e => {
      if(e.target.matches('.FHT-btn-default, .FHT-controllo-ausiliario')){
        label.classList.add('FHT-noclick');
      } else label.classList.remove('FHT-noclick');
    });
    label.addEventListener('click', e => {
      if(e.target.matches('.FHT-btn-default, .FHT-controllo-ausiliario') || label.classList.contains('FHT-noclick')){
        label.classList.remove('FHT-noclick');
        e.preventDefault();
      }
    });
  });
  // Tooltip campi
  formImpostazioni.querySelectorAll('.FHT-tooltip-descrizione-campo').forEach(t => {t.addEventListener('mousedown', e => false);});
  // Imposto controlli tema
  _azioni.selezionaTemaCorrispondente();

  // --- PROMPT ---

  const promptEditor = _pannelloToolset.prompt.editor = document.getElementById('FHT-prompt-editor');
  promptEditor.value = _pannelloToolset.prompt.convalida(_pannelloToolset.prompt.valore());
  promptEditor.addEventListener('focus', e => {
    _pannelloToolset.prompt.errore(false);
  });
  promptEditor.addEventListener('blur', e => {
    const str = promptEditor.value = _pannelloToolset.prompt.convalida(e);
    _pannelloToolset.prompt.valore(str);
  });
  const promptCurrent = document.getElementById('FHT-prompt-current');
  promptCurrent.value = _pannelloToolset.prompt.stringify(_impostazioni.utente, true);

  document.getElementById('FHT-btn-prompt-reset').addEventListener('click', _pannelloToolset.prompt.reset);
  document.getElementById('FHT-btn-prompt-riporta').addEventListener('click', _pannelloToolset.prompt.riportaImpostazioni);
  document.getElementById('FHT-btn-prompt-applica').addEventListener('click', _pannelloToolset.prompt.applicaImpostazioni);
  document.getElementById('FHT-btn-prompt-unisci').addEventListener('click', _pannelloToolset.prompt.unisciImpostazioni);
  document.getElementById('FHT-btn-prompt-formatta').addEventListener('click', _pannelloToolset.prompt.formatta);
  document.getElementById('FHT-btn-prompt-minimizza').addEventListener('click', _pannelloToolset.prompt.minimizza);
  document.getElementById('FHT-btn-prompt-copia-json-corrente').addEventListener('click', _pannelloToolset.prompt.copia);
  document.getElementById('FHT-btn-prompt-copia-json-editor').addEventListener('click', _pannelloToolset.prompt.copia);

  // --- TABS ---
  const tabs = document.querySelectorAll('#FHT-pannello-impostazioni-tabs > .FHT-pannello-impostazioni-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      _pannelloToolset.apriScheda(e.target.dataset.scheda);
    });
  });
  _pannelloToolset.apriScheda(_pannelloToolset.schedaAttiva);
};
_pannelloToolset.getGruppoRadio = nome => {
  return document.querySelectorAll('#FHT-overlay > .FHT-overlay-content > .FHT-overlay-body input[name="' + nome + '"]');
};
_pannelloToolset.impostaInput = (el, val, gruppoRadio) => {
  if(_is(el, String)) el = document.getElementById(el);
  const key = el.getAttribute('name');
  const campo = _impostazioni.campi[key];
  const isColor = campo.tipo === 'color';
  const par = _impostazioni(key, isColor ? _colore.formatHex(val, false, false) : val);
  let inputAttivo;
  if(gruppoRadio){
    gruppoRadio.forEach(inp => {
      if(inp.value === val){
        inp.checked = true;
        inputAttivo = inp;
      }
      _pannelloToolset.impostaLabelValoreUtente(inp.closest('label'), inp.checked && !par.isDefault);
    });
  } else {
    inputAttivo = el;
    if(campo.tipo === 'checkbox') el.checked = +val;
    else el.value = isColor ? _colore.formatHex(par.val) : par.val;
    _pannelloToolset.impostaLabelValoreUtente(el.closest('label'), !par.isDefault);
  }
  return inputAttivo;
};
_pannelloToolset.impostaLabelValoreUtente = (label, b) => {
  if(label) label.classList.toggle('FHT-valore-utente', b);
};
_pannelloToolset.impostaOutput = (input, val) => {
  const output = input.parentElement.querySelector(':scope output');
  if(!output) return;
  let suffisso = output.dataset.suffisso || '';
  const sostituzioni = output.dataset.sostituzioni;
  if(sostituzioni){
    const o = JSON.parse(sostituzioni);
    if(o[val]){
      val = o[val];
      suffisso = '';
    }
  }
  output.value = val + suffisso;
};
_pannelloToolset.apriScheda = scheda => {
  // scheda : [str] nome della scheda da aprire

  if(!['form', 'prompt'].includes(scheda)) return;
  _pannelloToolset.schedaAttiva = scheda;
  localStorage.setItem('FHT_schedaAttiva', scheda);

  // Se presente, chiudo la precedente scheda attiva
  const schede = document.querySelectorAll('#FHT-pannello-impostazioni > .FHT-scheda-attiva, #FHT-pannello-impostazioni-tabs > .FHT-scheda-attiva');
  if(schede) schede.forEach(s => {s.classList.remove('FHT-scheda-attiva');});

  // Attivo e apro la scheda specificata
  document.querySelector(`#FHT-pannello-impostazioni-tabs > [data-scheda='${scheda}']`).classList.add('FHT-scheda-attiva');
  document.querySelector(`#FHT-${scheda}-impostazioni`).classList.add('FHT-scheda-attiva');

  // Ripristino la posizione scroll per la scheda attiva ed eventuali elementi
  document.getElementById('FHT-pannello-impostazioni').scrollTop = _pannelloToolset.posizioneScroll('scheda_' + scheda);
  if(scheda == 'prompt'){
    document.getElementById('FHT-prompt-editor').scrollTop = _pannelloToolset.posizioneScroll('campo_prompt_editor');
    document.getElementById('FHT-prompt-current').scrollTop = _pannelloToolset.posizioneScroll('campo_prompt_current');
  }
};
_pannelloToolset.schedaAttiva = localStorage.getItem('FHT_schedaAttiva') || 'form';
_pannelloToolset.posizioneScroll = o => {
  // Se "o" è nullo, restituisco l'insieme degli elementi
  if(o == null) return _pannelloToolset.posizioneScroll.elementi;
  // Se "o" è una stringa, restituisco il valore scroll riferito al relativo elemento identificato per tale stringa, oppure undefined se l'elemento non esiste
  if(_is(o, String)) return _pannelloToolset.posizioneScroll.elementi[o];
  // Se "o" è un oggetto di coppie "nome":"valore", memorizzo i relativi valori per ciascun elemento identificato da "nome"
  if(_is(o, Object)){
    const obj = {};
    _pannelloToolset.posizioneScroll.nomi.forEach(e => {
      if(e in o) _pannelloToolset.posizioneScroll.elementi[e] = o[e];
      if(_pannelloToolset.posizioneScroll.elementi[e] !== 0) obj[e] = _pannelloToolset.posizioneScroll.elementi[e];
    });
    if(Object.keys(obj).length === 0) sessionStorage.removeItem('FHT_posizioniScroll');
    else sessionStorage.setItem('FHT_posizioniScroll', JSON.stringify(obj));
  }
};
_pannelloToolset.posizioneScroll.nomi = ['scheda_form', 'scheda_prompt', 'campo_prompt_editor', 'campo_prompt_current'];
_pannelloToolset.posizioneScroll.init = () => {
  _pannelloToolset.posizioneScroll.elementi = {};
  const json = sessionStorage.getItem('FHT_posizioniScroll');
  const obj = json ? JSON.parse(json) : {};
  _pannelloToolset.posizioneScroll.nomi.forEach(e => {
    _pannelloToolset.posizioneScroll.elementi[e] = obj[e] || 0;
  });
};

_pannelloToolset.prompt = {};
_pannelloToolset.prompt.editor = null;
_pannelloToolset.prompt.valore = str => {
  if(str === '') localStorage.removeItem('FHT_contenutoPrompt');
  else if(str != null) localStorage.setItem('FHT_contenutoPrompt', str);
  else str = localStorage.getItem('FHT_contenutoPrompt') || '';
  return str;
};
_pannelloToolset.prompt.convalida = e => {
  let strIn = (_is(e, String) ? e : e.currentTarget.value).trim();
  let strOut = strIn;

  // Aggiungo l'oggetto root se manca
  if(strOut[0] !== '{') strOut = '{\n  ' + strOut;
  if(strOut.slice(-1) !== '}' || _impostazioni.decode(strOut + '}') !== null) strOut += '\n}';

  // Verifico validità JSON
  const obj = _impostazioni.decode(strOut);
  const jsonErr = obj == null;

  // Segnalo l'errore e restituisco la stringa iniziale oppure il JSON corretto
  if(jsonErr) strOut = strIn;
  _pannelloToolset.prompt.errore(jsonErr);
  return strOut;
};
_pannelloToolset.prompt.errore = b => {
  // Imposto classe errore JSON per il prompt e disabilito pulsanti
  document.getElementById('FHT-prompt-impostazioni').classList.toggle('FHT-prompt-editor-error', b);
  _disabilita('#FHT-btn-prompt-applica,#FHT-btn-prompt-unisci,#FHT-btn-prompt-formatta,#FHT-btn-prompt-minimizza', b);
};
_pannelloToolset.prompt.stringify = (obj, pretty) => {
  return pretty ?
  _stringify(obj, {indent: 2, each: o => {
      const noIndent = /^(temiUtente\.\d+|barreUtilityUtente\.\d+\.elementi.\d+)\./.test(o.path);
      if(noIndent) return {noIndent: true};
    }
  }) : JSON.stringify(obj);
};
_pannelloToolset.prompt.riportaImpostazioni = e => {
  _pannelloToolset.prompt.errore(false);
  _pannelloToolset.prompt.editor.value = _pannelloToolset.prompt.valore(_pannelloToolset.prompt.stringify(_impostazioni.utente, true));
};
_pannelloToolset.prompt.applicaImpostazioni = e => {
  _impostazioni.utente = _impostazioni.decode(_pannelloToolset.prompt.editor.value);
  _impostazioni.salva();
  _stage.aggiorna();
};
_pannelloToolset.prompt.unisciImpostazioni = e => {
  const nuoveImpostazioni = _impostazioni.decode(_pannelloToolset.prompt.editor.value);
  _impostazioni.unisci(nuoveImpostazioni, _impostazioni.utente);
  _impostazioni.salva();
  _stage.aggiorna();
};
_pannelloToolset.prompt.formatta = e => {
  const obj = _impostazioni.decode(_pannelloToolset.prompt.editor.value);
  if(obj == null) return;
  _pannelloToolset.prompt.editor.value = _pannelloToolset.prompt.valore(_pannelloToolset.prompt.stringify(obj, true));
};
_pannelloToolset.prompt.minimizza = e => {
  const obj = _impostazioni.decode(_pannelloToolset.prompt.editor.value);
  if(obj == null) return;
  _pannelloToolset.prompt.editor.value = _pannelloToolset.prompt.valore(_pannelloToolset.prompt.stringify(obj));
};
_pannelloToolset.prompt.copia = e => {
  const w = e.currentTarget.parentElement.parentElement.querySelector('.FHT-textarea-container');
  const t = w.firstElementChild;
  const str = t.value;
  navigator.clipboard.writeText(str).then(() => {
    w.classList.add('FHT-copiato');
    setTimeout(() => {w.classList.remove('FHT-copiato');}, 1000);
  }).catch(err => {
    _modal(50);
  });
};
_pannelloToolset.prompt.reset = e => {
  _pannelloToolset.prompt.errore(false);
  _pannelloToolset.prompt.editor.value = _pannelloToolset.prompt.valore('{\n  \n}');
  _pannelloToolset.prompt.editor.focus();
  _pannelloToolset.prompt.editor.setSelectionRange(4, 4);
};
_pannelloToolset.corpo = () => {
  return `
<div id="FHT-pannello-impostazioni-wrapper">
  <div id="FHT-pannello-impostazioni-tabs">
    <button class="FHT-pannello-impostazioni-tab" data-scheda="form">Form</button>
    <button class="FHT-pannello-impostazioni-tab" data-scheda="prompt">Prompt</button>
  </div>
  <div id="FHT-pannello-impostazioni" class="FHT-scrollbar-thin">
    ${_pannelloToolset.corpoForm}
    ${_pannelloToolset.corpoPrompt}
  </div>
</div>
`;
};
/* Note riguardo la configurazione HTML del form e l'interfacciamento con le impostazioni:

  Attraverso l'attributo "name" ogni controllo del form (pannello impostazioni) è associato al relativo campo definito nell'oggetto _impostazioni.campi.
  Racchiudendo il controllo dentro un <label>, sarà mostrato il pulsante "Ripristina default". Questa funzione non è disponibile se il campo è definito come "ausiliario".
  Il valore di default deve essere definito come primo valore dell'erray "valori" per ogni specifico campo nelle impostazioni.
  Il valore impostato dall'utente, per ogni specifico controllo del form, viene memorizzato/salvato se risulta diverso da quello di default, se il relativo campo possiede la proprietà "valori" e se la proprietà "diSistema" è assente o è false.
*/
_pannelloToolset.corpoForm =`
<div id="FHT-form-impostazioni">
<div class="FHT-riga">
  <div class="FHT-colonna">
    <fieldset id="FHT-layout"><legend>Layout</legend>
      <label><input type="checkbox" name="rimuoviTopBar">Rimuovi Top-Bar</label>
      <label><input type="checkbox" name="stickyBarraUtility">Barra Utility sempre visibile</label>
      <label><input type="checkbox" name="visualizzazioneCompatta">Visualizzazione compatta</label>
      <label><input type="range" name="larghezzaMassima" id="FHT-range-max-width" min="${_impostazioni.campi.larghezzaMassima.valori[1]}" max="${_impostazioni.campi.larghezzaMassima.valori[2]}">Max-width body: <output for="FHT-range-max-width" data-suffisso="px"></output></label>
      <label><input type="range" name="fontSizeCodice" id="FHT-range-font-size-codice" min="${_impostazioni.campi.fontSizeCodice.valori[1]}" max="${_impostazioni.campi.fontSizeCodice.valori[2]}">Font-size codice: <output for="FHT-range-font-size-codice" data-suffisso="pt"></output></label>
      <label><input type="range" name="fontSizeUtility" id="FHT-range-font-size-utility" min="${_impostazioni.campi.fontSizeUtility.valori[1]}" max="${_impostazioni.campi.fontSizeUtility.valori[2]}">Font-size Utility: <output for="FHT-range-font-size-utility" data-suffisso="pt" data-sostituzioni='{"6":"auto"}'></output></label>
    </fieldset>
    <fieldset id="FHT-strumenti"><legend>Strumenti</legend>
      <label><input type="checkbox" name="riportaQuotato">Tooltip "Riporta quotato"</label>
      <label><input type="checkbox" name="copiaCodice">Pulsante "Copia codice"</label>
      <label><input type="checkbox" name="togglePassword">Icona mostra/nascondi password</label>
      <label><input type="checkbox" name="identificaStaff">Mostrine staff: <i class='FHT_ico_admins'></i>Admin, <i class='FHT_ico_mods'></i>Mod</label>
      <label><input type="checkbox" name="mantieniSessione"><div>Mantieni attiva la sessione <br><small>(finché la pagina resta aperta)</small></div></label>
    </fieldset>
  </div>

  <fieldset id="FHT-colori"><legend>Colori</legend>
    <label><input type="color" id="FHT-colore-base" name="coloreBase"><input for="FHT-colore-base" type="text" name="coloreBaseHex" class="FHT-input-hex" maxlength="7" spellcheck="false">Tinta base</label>
    <label><input type="color" id="FHT-colore-evidenziato" name="coloreEvidenziato"><input for="FHT-colore-evidenziato" type="text" name="coloreEvidenziatoHex" class="FHT-input-hex" maxlength="7" spellcheck="false">Evidenziato</label>
    <label>
      <span>Modalità: </span>
      <select id="FHT-schema-colore" name="schemaColore">
        <option value="A">Come da sistema operativo
        <option value="C">Chiaro
        <option value="S">Scuro
      </select>
    </label>
    <legend>Temi predefiniti</legend>
    <label>
      <select id="FHT-temi-predefiniti" name="temaPredefinito"></select>
    </label>
    <div id="FHT-temi-predefiniti-tavolozze" class="FHT-tavolozze"></div>
    <legend>Temi utente</legend>
    <div id="FHT-form-temi-utente">
      <input id="FHT-inp-tema-utente" type="text" placeHolder="‒ nome tema ‒" maxlength="${_impostazioni.campi.temaUtente.lunghezzaMaxNome}" spellcheck="false">
      <span class="FHT-tooltip-descrizione-campo" title="- Per creare un nuovo tema utente: digita un nuovo nome e clic 📌\n- Per rinominare un tema utente esistente: selezionalo, digita un nuovo nome e clic 📌\n- Per modificare i colori di un tema utente esistente: selezionalo, scegli la nuova combinazione di colori e clic 📌\n- Per rimuovere un tema esistente: selezionalo e clic 🗑️"></span>
      <span class="FHT-btn" id="FHT-btn-tema-utente-salva" title="Salva/modifica">📌</span>
      <span class="FHT-btn" id="FHT-btn-tema-utente-rimuovi" title="Rimuovi tema utente">🗑️</span>
    </div>
    <select id="FHT-temi-utente" name="temaUtente"></select>
    <div id="FHT-temi-utente-tavolozze" class="FHT-tavolozze"></div>
  </fieldset>
</div>
<div class="FHT-riga">
  <fieldset id="FHT-utility"><legend>Utility</legend>
    <div id="FHT-form-barre-utility">
      <label style="margin-right: auto;">
        <span>Usa barra: </span>
        <select id="FHT-select-barra-utility" name="barraUtility"></select>
      </label>
      <button class="FHT-btn" id="FHT-btn-add-barra-utility" title="Aggiungi nuova barra utility">Nuova barra</button>
    </div>
    <div id="FHT-utility-datagrid-container" class="FHT-datagrid-container"></div>
  </fieldset>
</div>
</div>
`;
_pannelloToolset.corpoPrompt = `
<div id="FHT-prompt-impostazioni">
<div class="FHT-riga">
  <fieldset><legend>Editor impostazioni (JSON)</legend>
    <div class="FHT-prompt-controlli FHT-btnbar">
      <button class="FHT-btn" id="FHT-btn-prompt-reset" title="Nuovo JSON"><i class="FHT-ico-file"></i></button>
      <button class="FHT-btn FHT-distanza-30" id="FHT-btn-prompt-applica" title="Applica questa configurazione (sovrascrivi tutto)"><i class="FHT-ico-applica-impostazioni"></i></button>
      <button class="FHT-btn" id="FHT-btn-prompt-unisci" title="Unisci queste impostazioni alla configurazione corrente"><i class="FHT-ico-unisci-impostazioni"></i></button>
      <button class="FHT-btn FHT-distanza-30" id="FHT-btn-prompt-formatta" title="Formatta e convalida JSON"><i class="FHT-ico-formatta-json"></i></button>
      <button class="FHT-btn" id="FHT-btn-prompt-minimizza" title="Minimizza e convalida JSON"><i class="FHT-ico-minimizza-json"></i></button>
      <button class="FHT-btn FHT-distanza-auto" id="FHT-btn-prompt-copia-json-editor" title="Copia JSON negli appunti"><i class="FHT-ico-copy"></i></button>
    </div>
    <div id="FHT-prompt-editor-container" class="FHT-textarea-container">
      <textarea id="FHT-prompt-editor" class="FHT-scrollbar-thin" spellcheck="false"></textarea>
    </div>
  </fieldset>
</div>
<div class="FHT-riga">
  <fieldset><legend>Configurazione corrente</legend>
    <div class="FHT-prompt-controlli FHT-btnbar">
      <button class="FHT-btn" id="FHT-btn-prompt-riporta" title="Riporta nell'Editor la configurazione corrente"><i class="FHT-ico-riporta-impostazioni"></i></button>
      <button class="FHT-btn FHT-distanza-auto" id="FHT-btn-prompt-copia-json-corrente" title="Copia JSON negli appunti"><i class="FHT-ico-copy"></i></button>
    </div>
    <div id="FHT-prompt-current-container" class="FHT-textarea-container">
      <textarea id="FHT-prompt-current" class="FHT-scrollbar-thin" readonly></textarea>
    </div>
  </fieldset>
</div>
</div>
`;

// --------------------------------------------------
// ---                   AZIONI                   ---
// --------------------------------------------------

_azioni.aggiornaStyleLayout = (controllo, val) => {
  _impostazioni(controllo.name, val);
  _css.aggiornaStyle('layout', _css.fn.layout({pagina: _paginaCorrente}));
};
_azioni.aggiornaStyleColore = (controllo, val) => {
  if(!_azioni.aggiornaStyleColore.saltaRefresh){
    _impostazioni(controllo.name, val);
    _css.aggiornaStyle('colore', _css.fn.colore({pagina: _paginaCorrente}));
    _azioni.aggiornaStyleColore.saltaRefresh = true;
  }
  clearTimeout(_azioni.aggiornaStyleColore.timer);
  _azioni.aggiornaStyleColore.timer = setTimeout(() => {
    delete _azioni.aggiornaStyleColore.saltaRefresh;
    if(val === _impostazioni(controllo.name)) return;
    _impostazioni(controllo.name, val);
    _css.aggiornaStyle('colore', _css.fn.colore({pagina: _paginaCorrente}));
  }, 100);
};
_azioni.aggiornaHex = (controllo, val) => {
  const inputHex = document.querySelector('#FHT-colori [for="' + controllo.id + '"]');
  if(inputHex) inputHex.value = val || controllo.value;
};
_azioni.initInputHex = (controllo, val) => {
  const per = controllo.getAttribute('for');
  if(!val) val = controllo.value = document.getElementById(per).value;
  let _valoreCorrente;
  controllo.addEventListener('input', e => {
    const me = e.target;
    let val = controllo.value.toLowerCase();
    const s = val.charAt() === '#' ? '#' : '';
    val = s + val.replace(/[^0-9a-f]/g, '');
    if(val !== controllo.value) controllo.value = val;
  });
  controllo.addEventListener('keydown', e => {
    if(e.keyCode === 13) controllo.blur();
    else if(e.keyCode === 27){
      controllo.value = _valoreCorrente;
      controllo.blur();
    }
  });
  controllo.addEventListener('focus', e => {
    _valoreCorrente = controllo.value;
  });
  controllo.addEventListener('change', e => {
    controllo.value = _colore.formatHex(controllo.value, _valoreCorrente);
  }, true);
};
_azioni.setColoreCampo = (controllo, val) => {
  const per = _is(controllo, String) ? controllo : controllo.getAttribute('for');
  const inputColor = document.getElementById(per);
  const inputHex = inputColor.parentElement.querySelector(':scope .FHT-input-hex');
  inputColor.value = inputHex.value = val;
  inputColor.dispatchEvent(new Event('change'));
};
_azioni.setFontSizeEl = (controllo, val, nome) => {
  _pannelloToolset.impostaOutput(document.getElementById('FHT-range-font-size-' + nome), val);
};
_azioni.anteprimaLarghezzaEstesa = (controllo, val) => {
  document.querySelector('body > .body-wrapper > .wrapper.container').style.maxWidth = val+'px';
  document.querySelector('body > .front-page__trends > .trends--section').style.maxWidth = val+'px';
  _pannelloToolset.impostaOutput(document.getElementById('FHT-range-max-width'), val);
};
_azioni.fineAnteprimaLarghezzaEstesa = (controllo, val) => {
  document.querySelector('body > .body-wrapper > .wrapper.container').style.removeProperty('max-width');
  document.querySelector('body > .front-page__trends > .trends--section').style.removeProperty('max-width');
};
_azioni.overlayTrasparente = (controllo, val) => {
  clearTimeout(_azioni.fineOverlayTrasparente.timeout);
  document.getElementById('FHT-overlay').classList.add('FHT-overlay-trasparente');
};
_azioni.fineOverlayTrasparente = (controllo, val, ritardo = 0) => {
  clearTimeout(_azioni.fineOverlayTrasparente.timeout);
  _azioni.fineOverlayTrasparente.timeout = setTimeout(() => {
    document.getElementById('FHT-overlay').classList.remove('FHT-overlay-trasparente');
  }, ritardo);
};
_azioni.initTemi = (controllo, val) => {
  const key = controllo.name;
  const id = controllo.id;
  const campoTemi = _impostazioni.campi[key];
  const contenitoreTavolozze = document.getElementById(id + '-tavolozze');
  // Creo controlli tema nel pannello impostazioni
  let options = '<option value="-1" disabled>‒ tema non definito ‒</option>';
  let palettes = `<input type="radio" name="${ key }Tavolozze" style="display:none" value="-1">`;
  campoTemi.temi.forEach((e, i) => {
    options += `<option value="${ i }">${ e[0] }</option>`;
    palettes += `<label title="${ e[0] }"><input type="radio" name="${ key }Tavolozze" value="${ i }"><div class="FHT-ico-tavolozza FHT-schema-colore-${ e[1] }" style="background-image: radial-gradient(295% 295% at -50% -50%, ${ _colore.formatHex(e[2]) } 48%, ${ _colore.formatHex(e[3]) } 52%)"></div></label>`;
  }, '');

  controllo.innerHTML = options;
  contenitoreTavolozze.innerHTML = palettes;
  contenitoreTavolozze.querySelectorAll(':scope label > input').forEach(inp => {
    inp.addEventListener('change', e => {
      const me = e.currentTarget;
      controllo.value = me.value;
      controllo.dispatchEvent(new Event('change'));
    });
  });
};
_azioni.initTemaUtente = (controllo, val) => {
  const nomeTema = sessionStorage.getItem('FHT_nomeTema') || '';
  const inpTemaUtente = document.getElementById('FHT-inp-tema-utente');
  const tavolozze = document.getElementById('FHT-temi-utente-tavolozze');
  const btnSalva = document.getElementById('FHT-btn-tema-utente-salva');
  const btnRimuovi = document.getElementById('FHT-btn-tema-utente-rimuovi');
  const inpColoreBase = document.getElementById('FHT-colore-base');
  const inpColoreEvidenziato = document.getElementById('FHT-colore-evidenziato');
  const inpSchemaColore = document.getElementById('FHT-schema-colore');
  const par = _impostazioni('temiUtente');
  // NOTA: la proprietà temi è un clone dell'array salvato nelle impostazioni, così da proteggere il dato originale da eventuali modifiche
  _impostazioni.campi.temaUtente.temi = par && JSON.parse(JSON.stringify(par.val)) || [];
  inpTemaUtente.value = nomeTema;
  inpTemaUtente.addEventListener('input', e => {
    const nomeTema = e.target.value = e.target.value.replace(/\s\s+/, ' ');
    _azioni.initTemaUtente.aggiornaStatoPulsanti(nomeTema.trim());
  });
  inpTemaUtente.addEventListener('change', e => {
    const nomeTema = e.target.value = e.target.value.trim();
    sessionStorage.setItem('FHT_nomeTema', nomeTema);
  });
  tavolozze.addEventListener('click', e => {
    e.preventDefault();
    const el = e.target;
    if(el === e.currentTarget) return;
    const lbl = el.closest('label');
    const inp = lbl.querySelector('input');
    if(inp.checked){
      const nomeTema = document.getElementById('FHT-inp-tema-utente').value = lbl.title;
      _azioni.initTemaUtente.aggiornaStatoPulsanti(nomeTema);
      sessionStorage.setItem('FHT_nomeTema', nomeTema);
    } else {
      inp.checked = true;
      inp.dispatchEvent(new Event('change'));
    }
  });
  btnSalva.addEventListener('click', e => {
    const nomeTema = inpTemaUtente.value;
    const schemaColore = inpSchemaColore.value;
    const coloreBase = _colore.formatHex(inpColoreBase.value, false, false);
    const coloreEvidenziato = _colore.formatHex(inpColoreEvidenziato.value, false, false);
    const temi = _impostazioni.campi.temaUtente.temi;
    let tema = temi.find(el => el[0].toLowerCase() === nomeTema.toLowerCase() || (el[1] === schemaColore && el[2] === coloreBase && el[3] === coloreEvidenziato));
    if(!tema) temi.push(tema = []);
    tema[0] = nomeTema;
    tema[1] = schemaColore;
    tema[2] = coloreBase;
    tema[3] = coloreEvidenziato;
    _azioni.initTemaUtente.aggiornaTemi();
    _azioni.selezionaTemaCorrispondente();
    _impostazioni.salva();
  });
  btnRimuovi.addEventListener('click', e => {
    const nomeTema = inpTemaUtente.value;
    const temi = _impostazioni.campi.temaUtente.temi;
    const index = temi.findIndex(el => el[0].toLowerCase() === nomeTema.toLowerCase());
    if(index !== -1){
      temi.splice(index, 1);
      _azioni.initTemaUtente.aggiornaTemi();
      _azioni.selezionaTemaCorrispondente();
      _impostazioni.salva();
    }
  });
  controllo.addEventListener('change', e => {
    const nomeTema = _impostazioni.campi.temaUtente.temi[+e.target.value][0];
    inpTemaUtente.value = nomeTema;
    sessionStorage.setItem('FHT_nomeTema', nomeTema);
  });
};
_azioni.initTemaUtente.aggiornaStatoPulsanti = (val = document.getElementById('FHT-inp-tema-utente').value) => {
  const temaUtenteSelezionato = !_impostazioni('temaUtente').isDefault;
  const btnSalva = document.getElementById('FHT-btn-tema-utente-salva');
  const btnRimuovi = document.getElementById('FHT-btn-tema-utente-rimuovi');
  const onoff_btnRimuovi = _impostazioni.campi.temaUtente.temi.some(e => e[0] === val);
  const onoff_btnSalva = val && !(temaUtenteSelezionato && onoff_btnRimuovi);
  _disabilita(btnSalva, !onoff_btnSalva);
  _disabilita(btnRimuovi, !onoff_btnRimuovi);
  _azioni.initTemaUtente.classeInput('FHT-tema-esistente', onoff_btnRimuovi);
  return {salva: onoff_btnSalva, rimuovi: onoff_btnRimuovi};
};
_azioni.initTemaUtente.classeInput = (classe, b) => {
  document.getElementById('FHT-inp-tema-utente').classList.toggle(classe, b);
};
_azioni.initTemaUtente.aggiornaTemi = () => {
  _impostazioni('temiUtente', _impostazioni.campi.temaUtente.temi);
  _azioni.initTemi(document.getElementById('FHT-temi-utente'));
};
_azioni.applicaTema = (controllo, val) => {
  const key = controllo.name;
  const id = controllo.id;
  const campoTemi = _impostazioni.campi[key];
  const tema = campoTemi.temi[val];
  const schemaColore = tema[1];
  const coloreBase = _colore.formatHex(tema[2]);
  const coloreEvidenziato = _colore.formatHex(tema[3]);
  const contenitoreTavolozze = document.getElementById(id + '-tavolozze');
  _pannelloToolset.impostaInput('FHT-schema-colore', schemaColore);
  _azioni.aggiornaHex(_pannelloToolset.impostaInput('FHT-colore-base', coloreBase));
  _azioni.aggiornaHex(_pannelloToolset.impostaInput('FHT-colore-evidenziato', coloreEvidenziato));
  _azioni.selezionaTemaCorrispondente();
};
_azioni.selezionaTemaCorrispondente = () => {
  const schemaColore = _impostazioni('schemaColore').val;
  const coloreBase = _colore.formatHex(_impostazioni('coloreBase').val, false, false);
  const coloreEvidenziato = _colore.formatHex(_impostazioni('coloreEvidenziato').val, false, false);
  ['FHT-temi-predefiniti', 'FHT-temi-utente'].forEach(id => {
    const select = document.getElementById(id);
    const nome = select.name;
    const temi = _impostazioni.campi[nome].temi;
    let value = temi.findIndex(e => e[1] === schemaColore && e[2] === coloreBase && e[3] === coloreEvidenziato);
    // Aggiorno relativo <select> in base alle modifiche effettuate
    _pannelloToolset.impostaInput(id, '' + value);
    document.querySelector(`#${ id }-tavolozze input[value="${ value }"]`).checked = true;
  });
  setTimeout(_azioni.initTemaUtente.aggiornaStatoPulsanti, 0);
};
_azioni.classeHtml = (controllo, val, classe) => {
  _classeHtml(classe, val);
};
_azioni.mantieniSessione = (controllo, val) => {
  setTimeout(_strumenti.mantieniSessione, 0);
};
_azioni.initBarraUtility = (controllo, val) => {
// controllo: [dom] elemento <select> per selezione barra utility da usare

  const btnNuovaBarra = document.getElementById('FHT-btn-add-barra-utility');
  const contenitoreDatagrid = _utility.edit.contenitoreDatagrid = document.getElementById('FHT-utility-datagrid-container');

  _datagrid.init({contenitore: contenitoreDatagrid, dragZone: contenitoreDatagrid});

  btnNuovaBarra.addEventListener('click', e => {
    _utility.edit.aggiungiNuovoDatagrid(contenitoreDatagrid);
  });

  controllo.innerHTML = _utility.getContenutoSelectBarre();

  // Creo e appendo datagrid per relative barre
  _utility.vars.barre.forEach((e, i) => {
    const isPredefinita = i < _utility.vars.barrePredefinite.length;
    const datagrid = _utility.edit.creaDatagrid({
      nome: e.nome,
      dati: e.elementi,
      predefinita: isPredefinita,
      aperto: (isPredefinita ? Boolean(+(_impostazioni('statoBarrePredefinite').val || '')[i]) : e.aperto) || false
    });
    if(isPredefinita) datagrid.dataset.indicePredefinita = i;
    contenitoreDatagrid.appendChild(datagrid);
  });
};
_azioni.selezionaBarraUtility = (controllo, val) => {
  _utility.selezionaBarra(val);
};


// --------------------------------------------------
// ---                  OVERLAY                   ---
// --------------------------------------------------

_overlay.apri = (header, body, footer) => {
  _classeHtml('FHT-overlay', true);
  var container = document.querySelector('#FHT-overlay');
  if(!container){
    container = document.createElement('div');
    container.id = 'FHT-overlay';
    document.body.appendChild(container);
    container.addEventListener('mousedown', e => {if(e.currentTarget === e.target) _overlay.chiudi();});
  }
  _overlay.aggiorna(header, body, footer);
  setTimeout(() => {
    container.classList.add('aperto');
  },10);
};
_overlay.aggiorna = (header, body, footer) => {
  var container = document.querySelector('#FHT-overlay');
  var content, elHeader, elBody, elFooter;
  if(!container) return false;
  if(container.childElementCount === 0){
    container.innerHTML = `
<div class="FHT-overlay-content">
  <div class="FHT-overlay-header-container">
    <div class="FHT-overlay-header"></div>
    <span class="FHT-overlay-close">&times;</span>
  </div>
  <div class="FHT-overlay-body">
  </div>
  <div class="FHT-overlay-footer"></div>
</div>`;
    content = container.querySelector('#FHT-overlay > .FHT-overlay-content');
    content.addEventListener('click', e => {e.stopPropagation();});
    content.querySelector('.FHT-overlay-header-container > .FHT-overlay-close').addEventListener('click', e => {e.stopPropagation(); _overlay.chiudi();});
  }
  content = container.querySelector('#FHT-overlay > .FHT-overlay-content');
  elHeader = content.querySelector('.FHT-overlay-header');
  elBody = content.querySelector('.FHT-overlay-body');
  elFooter = content.querySelector('.FHT-overlay-footer');
  if(header != null) elHeader.innerHTML = header;
  if(body != null) elBody.innerHTML = body;
  if(footer != null) elFooter.innerHTML = footer;
};
_overlay.chiudi = () => {
  _classeHtml('FHT-overlay', false);
  window.removeEventListener('keydown', _history.keyboardShortcuts);

  var contenitore = document.querySelector('#FHT-overlay.aperto');
  if(contenitore){
    contenitore.classList.remove('aperto');
    setTimeout(() => {
      document.body.removeChild(contenitore);
    },400);
  }
};


// --------------------------------------------------
// ---             ANNULLA/RIPRISTINA             ---
// --------------------------------------------------

_history.done = [];
_history.reverted = [];
_history.limit = 30;

// Restituisce, come stringa JSON, la cronologia memorizzata
_history.get = () => {
  return JSON.stringify([_history.done, _history.reverted]);
};
// Imposta l'intera cronologia secondo la stringa JSON specificata
_history.set = json => {
  const dati = JSON.parse(json);
  _history.done = dati[0];
  _history.reverted = dati[1];
};
// Aggiunge, come ultimo stato di modifica eseguita, la stringa JSON specificata
_history.add = (json = _impostazioni.JSON) => {
  if(_history.skipAdd){
    delete _history.skipAdd;
    return;
  }
  if(json === '{}') json = '';
  const len = _history.done.length;
  // Prevengo memorizzazione sequenze ripetute
  if(len > 0 && json === _history.done.slice(-1)) return;
  if(len > 2 && json === _history.done[len - 2] && _history.done[len - 1] === _history.done[len - 3]){
    _history.done.pop();
    _history.setButtons();
    return;
  }
  // Se raggiunto limite, rimuovo stato più vecchio
  if(len >= _history.limit) _history.done.shift();
  // Aggiorno elementi
  _history.done.push(json);
  _history.reverted.length = 0;
  _history.setButtons();
};
// Sostituisce l'attuale stato di modifica eseguita, con la stringa JSON specificata
_history.update = (json = _impostazioni.JSON) => {
  _history.done.pop();
  _history.done.push(json);
  _history.reverted.length = 0;
  _history.setButtons();
};
// Annulla la modifica eseguita
_history.undo = () => {
  if(_history.done.length === 0) return;
  const item = _history.done.pop();
  if(item == null) return;
  _history.reverted.push(item);
  _history.restore(_history.done.slice(-1)[0]);
};
// Ripristina la modifica eseguita
_history.redo = () => {
  const item = _history.reverted.pop();
  if(item == null) return;
  _history.done.push(item);
  _history.restore(item);
};
// Ridisegna la pagina secondo lo stato specificato
_history.restore = item => {
  if(item == null) return false;
  const o = _impostazioni.decode(item);
  const el = document.querySelector('#FHT-overlay > .FHT-overlay-content');

  if(el){
    el.classList.add(o ? 'FHT-restored' : 'FHT-restored-error');
    setTimeout(() => {el.classList.remove('FHT-restored', 'FHT-restored-error');}, 100);
  }
  // Esco se formato non riconosciuto
  if(o == null) return false;

  _history.skipAdd = true;
  _impostazioni.utente = o;
  _impostazioni.salva(item);

  _stage.aggiorna();

  return true;
};
// Gestione dei tasti rapidi
_history.keyboardShortcuts = e => {
  const actEl = document.activeElement;
  if(!e.ctrlKey || !_classeHtml('FHT-overlay') || e.repeat || (actEl && ( actEl.tagName.toLowerCase() === 'input' && actEl.type == 'text' || actEl.tagName.toLowerCase() === 'textarea'))) return;

  if(e.keyCode === 89 && _history.reverted.length > 0){
    e.preventDefault();
    _history.redo();
  } else if(e.keyCode === 90 && _history.done.length > 1){
    e.preventDefault();
    _history.undo();
  }
};
// Imposta lo stato dei pulsanti Annulla e Rripristina
_history.setButtons = () => {
  if(!_classeHtml('FHT-overlay')) return;
  _disabilita('#FHT-btn-undo', _history.done.length <= 1);
  _disabilita('#FHT-btn-redo', _history.reverted.length === 0);
};

window.addEventListener('beforeunload', e => {
  sessionStorage.setItem('FHT_history', _history.get());
});


// --------------------------------------------------
// ---                  BUGS FIX                  ---
// --------------------------------------------------

// Lettere accentate e carattei speciali risultano corrotti dopo la pubblicazione di un post
_fix.caratteriCorrotti = () => {
//
// DESCRIZIONE:
// Il problema si presenta quando si tenta di pubblicare o eseguire l'anteprima del post appena scritto nell'editor ma la sessione risulta scaduta.
// In genere questo accade quando l'utente ha effettuato l'accesso senza spuntare l'opzione "Ricordami". La sessione scade dopo un tempo massimo di 20 minuti in cui l'utente non esegue attività sulla pagina.
// Se l'utente aveva scritto del testo nell'editor e, dopo che la sessione è scaduta, tenta di effettuare la pubblicazione/anteprima del messaggio, si viene reindirizzati ad un form di login da cui, dopo aver
// inserito i dati di accesso, è possibile proseguire con l'azione. A quel punto, ogni carattere speciale (tra cui le lettere accentate) presente nel post appena pubblicato, risulterà rimpiazzato dalla sequenza ï¿½.
//
// SOLUZIONE:
// Attivando l'opzione "Mantieni attiva la sessione" dalle impostazioni Toolset, ogni tot minuti viene eseguita una chiamata AJAX alla pagina corrente così da prevenire la scadenza della sessione finché l'utente tiene aperta la pagina.

  _strumenti.mantieniSessione();
};

// Click su lente nella top-bar non avvia alcuna ricerca
_fix.pulsanteRicercaTopBar = () => {
//
// DESCRIZIONE:
// Alla destra della top-bar è presente un'icona a forma di lente che, al click, dovrebbe mostrare un form da cui è possibile effettuare le ricerche ma, allo stato attuale, il form non viene mostrato e non accade nulla.
//
// SOLUZIONE:
// Al click sull'icona, Forzo l'apertura della pagina di ricerca avanzata.

  const btnCerca = document.querySelector('.header-menu__search > .slide-search');
  if(btnCerca) btnCerca.addEventListener('click', e => {location.href = 'https://forum.html.it/forum/search.php';});
};

// Scorrimento barra Utility non funzionante
_fix.scorrimentoBarraUtility = () => {
//
// DESCRIZIONE:
// Nella barra "UTILITY" dovrebbe essere possibile scorrere i contenuti che eccedono dal contenitore; tuttavia i pulsanti di scorrimento non sono funzionanti da diverso tempo.
//
// SOLUZIONE:
// Rielaboro il funzionamento dell'intera barra per ripristinare la funzione di scorrimento.

  _utility.aggiornaBarra();
  _utility.initScorrimentoBarra();
};

// Digitazione bloccata nell'editor dopo un doppio click
_fix.editorDigitazioneBloccata = async () => {
//
// DESCRIZIONE:
// Nell'editor, dopo aver evidenziato una parola eseguendo un doppio click, non è possibile digitare finché non si esegue un singolo click.
// Il problema si presenta su browser Chromium-based. Dovuto alla libreria yuiloader-dom-event.js con cui è applicato, sull'editor, un listener per l'evento dblclick che impedisce la digitazione.
//
// SOLUZIONE:
// Non è chiaro il fine di questo listener ma applicando un ulteriore listener, in cui interrompo la propagazione, il problema si risolve.

  if(!_paginaCorrente.contieneEditor) return;

  try { await _attendi(() => _editorReady.callbacks, 3, 200); }
  catch (err) { return; }

  _editorReady.callbacks.push(async editor => {
    // Esco se editor è di tipo textarea (non è affetto dal bug)
    if(editor.mode === 'source') return;

    // Verifico che il fix non sia già stato applicato per questo editor
    try { await _attendi(() => !editor.document.getDocumentElement().$.classList.contains('FHT-dblclick-fixed'), 3, 200); }
    catch (err) { return; }

    const el = editor.document.getDocumentElement().$;
    el.classList.add('FHT-dblclick-fixed');

    // Applico listener
    el.addEventListener('dblclick', e => {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }, true);
  });
};

// Faccine non funzionanti (bug minore)
_fix.brokenSmilies = () => {
//
// DESCRIZIONE:
// Nello "smiliebox" mostrato di fianco all'editor, al click sulle faccine viene riportato automaticamente, nell'editor, il relativo shortcode.
// Questo non avviene per le faccine il cui shortcode presenta dei caratteri accentati (vedi :dottò:, :dhò:).
// In sostanza per tali elementi non viene valorizzato l'attributo "alt" che serve per questa funzionalità.
//
// SOLUZIONE:
// Risolvo valorizzando questi attributi.

  if(!_paginaCorrente.contieneEditor) return;

  (async () => {
    var box = document.querySelector('.smiliebox');
    // Attendo il tram
    try { box = await _attendi(()=>document.querySelector('.smiliebox'), 10, 500);}
    catch (err) { return; }

    // Ripristino faccine non funzionanti
    [
      {img: 'dotto.gif', alt: ':dottò:', title: 'Dottò!'},
      {img: 'dho.gif', alt: ':dhò:'},
      {img: 'senzasperanza.gif', alt: ':bhò:'},
    ].forEach(o => {
      let el = box.querySelector('[src$="/' + o.img +'"]');
      if(el){
        if(o.alt) el.alt = o.alt;
        if(o.title) el.title = o.title;
      }
    });
  })();
};

// Link corrotto in mail aggiornamento sottoscrizione forum (bug minore)
_fix.brokenLinkMail = () => {
//
// DESCRIZIONE:
// Quando si ricevono aggiornamenti via mail a motivo di una particolare iscrizione ad uno o più forum, il link principale che compare nel contenuto della mail risulta corrotto.
// L'URL del link presenta una ripetizione della root del forum "https://forum.html.it/forum" per cui, cliccandoci, si apre una pagina con errore "404 Not Found".
//
// SOLUZIONE:
// Verifico se l'indirizzo della pagina corrente ha una ripetizione della root, quindi lo rielaboro ed eseguo il redirect sulla pagina corretta.
  const url = location.href;
  if(url.startsWith('https://forum.html.it/forum/https:/')){
    window.location.replace('https://' + url.substring(35));
    return true;
  }
};


// --------------------------------------------------
// ---                 STRUMENTI                  ---
// --------------------------------------------------

// Riporta testo selezionato come "QUOTE"
_strumenti.riportaQuotato = () => {
  // Quando viene selezionato un contenuto dentro un qualsiasi post, visualizzo un tooltip cliccabile che permette di riportare nell'editor il testo selezionato, inserendolo dentro un tag [QUOTE]

  if(!(['showthread', 'newreply'].includes(_paginaCorrente.nome)) && !(_paginaCorrente.nome === 'private' && /do=showpm/.test(_paginaCorrente.queryString))) return;

  let tooltip;
  let timeoutTooltip;
  let saltaSelectionchange;
  let editor;

  // Callback eseguito solo per editor principale
  _editorReady.callbacks.initRiportaQuotato = ed => {
    editor = ed;
    initTooltip();
  };

  function initTooltip(){
    tooltip = document.createElement('div');
    tooltip.id = 'FHT-tooltip-reply';
    tooltip.innerHTML = 'Riporta quotato';
    document.body.appendChild(tooltip);

    fixInterrompiSelezione();
    // Applico questo fix anche al caricamento della "cronologia messaggi", dopo il click sul link "Visualizza cronologia" presente in private.php
    const linkCronologia = document.getElementById('pm_historylink');
    const contenitoreCronologia = document.getElementById('threadpms');
    if(linkCronologia){
      linkCronologia.addEventListener('click', async e => {
        try { await _attendi(()=>contenitoreCronologia.children.length, 5, 200); }
        catch (err) { return; }
        fixInterrompiSelezione();
      });
    }

    // Al click sul tooltip
    tooltip.addEventListener('click', e => {
      chiudiTooltip();
      const quoted = getQuotato();

      // Deseleziono
      if(window.getSelection().empty) window.getSelection().empty(); // Chrome
      else if(window.getSelection().removeAllRanges) window.getSelection().removeAllRanges(); // Firefox

      riportaQuotato(quoted);
    });

    // Posiziono tooltip quando selezione è cambiata
    document.addEventListener('selectionchange', e => {
      chiudiTooltip();
      if(saltaSelectionchange) return;
      clearTimeout(timeoutTooltip);
      timeoutTooltip = setTimeout(() => {
        esaminaSelezione();
      }, 10);
    });
    window.addEventListener('resize', e => {if(tooltip.classList.contains('FHT-tooltip-aperto')) posizionaTooltip();});

    // Mentre si seleziona col mouse, disattivo tooltip per evitare interferenze durante la selezione
    const nod = document.querySelector('#postlist, .postdetails');
    nod.addEventListener('mousedown', e => {saltaSelectionchange = true;});
    nod.addEventListener('mouseup', e => {
      setTimeout(() => {
        saltaSelectionchange = false;
        esaminaSelezione();
      }, 1);
    });
    document.addEventListener('dragend', e => {esaminaSelezione();});
  }

  function fixInterrompiSelezione(){
   // FIX: quando si seleziona con triplo-click l'ultima riga di un post, il tooltip non compare perché la fine della selezione cade su un target non valido.
   //      Viceversa accade per il titolo di un post, (su CH) il tooltip non dovrebbe comparire ma compare perché la fine della selezione cade sull'elemento contenitore che risulta target valido.
   //      Risolvo inserendo da script degli elementi fittizi per separare strutturalmente il contenuto impedendo che la selezione si estenda su elementi non pertinenti.
    document.querySelectorAll('.postbitlegacy .postrow, .postbitlegacy .postrow > h2.title').forEach(nod => {
      let el = nod.querySelector(':scope > .FHT-interrompi-selezione');
      if(el) return;
      el = document.createElement('span');
      el.classList.add('FHT-interrompi-selezione');
      el.innerHTML = '&nbsp;';
      nod.appendChild(el);
    });
  }

  function esaminaSelezione(){

    const sel = window.getSelection();
    const rangeCount = sel.rangeCount;

    if(sel.isCollapsed || sel.toString().trim() == ''){
      chiudiTooltip();
      return;
    }
    for (var i = 0; i < rangeCount; i++){
      const range = sel.getRangeAt(i);
      if(range.collapsed) continue;

      let targetValido = false;
      // Partendo dal contenitore comune, relativo alla selezione effettuata, verifico la discendenza per stabilire se la selezione appartiene al contenuto di un post (target valido)
      let el = range.commonAncestorContainer;
      while (el) {
        if(el.classList){
          if(escluso(el) || el.tagName === 'HTML'){
            targetValido = false;
            break;
          }else if(incluso(el)){
            targetValido = true;
            break;
          }
        }
        el = el.parentElement;
      }
      if(!targetValido){
        return;
      }
    }

    posizionaTooltip();
  }
  function incluso(el){
    return incluso.selettori
      .some(selettore => {
        return el.matches(selettore);
      });
  }
  incluso.selettori = ['.postrow > .content > blockquote', '.postrow > .content', '.postrow', '#nrreview .postbit > .content'];

  function escluso(el){
    return escluso.selettori
      .some(selettore => {
        return el.matches(selettore);
      });
  }
  escluso.selettori = ['.postbody', '.postrow .title', '.after_content', '.after_content .postcontent', '.quote_container', '.bbcode_quote', '.postdetails', '.bbcode_description',
                       '.postcontainer', '.posts', '.postlist', '.body_wrapper', '.wrapper', '.container', '.body-wrapper', '.desktop', '.attachments', '.attachments .postcontent', '.quickedit'];

  function apriTooltip(){
    tooltip.classList.add('FHT-tooltip-aperto');
  }
  function chiudiTooltip(){
    tooltip.classList.remove('FHT-tooltip-aperto');
  }
  function posizionaTooltip(){
    saltaSelectionchange = true;
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var rangeClone;
    var testo = sel.toString();
    var segnaposto;

    // Se selezione termina con caratteri newline, posiziono tooltip prima di tali caratteri
    if(/\r?\n/.test(testo.slice(-1))){
      let newline = false;
      const selezioneContraria = sel.anchorNode !== range.startContainer || sel.anchorOffset !== range.startOffset;

      // Inverto i componenti della selezione se l'utente ha effettuato la selezione in direzione contraria
      if(selezioneContraria) sel.setBaseAndExtent(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset);

      // Sposto indietro posizione finale finché non siano esclusi i caratteri di ritorno a capo
      let conta = 0;
      while (!newline && testo.length > conta++){
        sel.modify('extend', 'left', 'character');
        newline = !/\r?\n/.test(sel.toString().slice(-1));
      }

      // Rilevo range di riferimento
      rangeClone = sel.getRangeAt(0).cloneRange();

      // Reimposto selezione
      while (conta--){
        sel.modify('extend', 'right', 'character');
      }

      if(selezioneContraria) sel.setBaseAndExtent(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset);

    } else {
      rangeClone = range.cloneRange();
    }

    rangeClone.collapse(false);

    var rangeBounds = rangeClone.getBoundingClientRect();
    var bodyBounds = document.body.parentNode.getBoundingClientRect();

    // FIX: alcune volte, quando la selezione termina con elementi che creano una interruzione di riga, la posizione del range risulta inconsistente.
    //      Risolvo inserendo un elemento segnaposto momentaneo da cui rilevo la posizione valida
    if(rangeBounds.x === 0 || rangeBounds.y === 0){
      segnaposto = document.createElement('span');
      rangeClone.insertNode(segnaposto);
      rangeBounds = segnaposto.getBoundingClientRect();
      segnaposto.remove();
    }

    tooltip.style.top = Math.round(rangeBounds.bottom - bodyBounds.top + 3) + 'px';
    tooltip.style.right = -Math.round(rangeBounds.right - bodyBounds.right - 5) + 'px';

    range.endContainer.normalize();
    range.detach();
    rangeClone.detach();

    setTimeout(() => {
      saltaSelectionchange = false;
      apriTooltip();
    }, 1);
  }

  function toBbcode(el){
    var cod;
    el.querySelectorAll(':scope > .FHT-code-container, :scope > b, :scope > i, :scope > u, :scope > font, :scope > span, :scope > a, :scope > img, :scope > h2, :scope > .attachments, :scope > .bbcode_container').forEach(x => {
      var cont = null, tag, atr;
      if(['B','I','U'].includes(x.tagName)){
        cont = toBbcode(x);
        tag = x.tagName;
      } else if(x.tagName === 'FONT'){
        cont = toBbcode(x);
        if(x.hasAttribute('size')){
          tag = 'SIZE';
          atr = x.size;
        } else if(x.hasAttribute('color')){
          tag = 'COLOR';
          atr = x.color;
        }
      } else if(x.tagName === 'SPAN'){
        cont = toBbcode(x);
        if(x.style.fontFamily){
          tag = 'FONT';
          atr = x.style.fontFamily;
        }
      } else if(x.tagName === 'A'){
        cont = toBbcode(x);
        const href = x.href;
        if(href){
          if(href.indexOf('mailto:') === 0){
            tag = 'MAIL';
            atr = '"' + href.slice(7) + '"';
         } else {
            tag = 'URL';
            if(href !== cont) atr = '"' + href + '"';
          }
        }
      } else if(x.tagName === 'IMG'){
        const src = x.getAttribute("src");
        if(src.indexOf('images/smilies/') === 0){
          const nome = src.slice(15);
          cont = faccine[nome];
        }
      } else if(x.classList.contains('FHT-code-container')){
        x.innerHTML = x.innerHTML.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
        const block = x.querySelector('.bbcode_code');
        if(!block){
          cont = '';
        } else {
          cont = escapeHtml(block.innerText);
          tag = {'html': 'HTML', 'php': 'PHP'}[x.dataset.codeType] || 'CODE';
          cod = true;
        }
      } else if(x.classList.contains('bbcode_container')){
        if(x.querySelector(':scope > .bbcode_quote')) cont = '';
      } else if(x.classList.contains('attachments')){
        cont = '';
      } else if(x.tagName === 'H2'){
        cont = '';
      }
      if(cont === null) return;
      x.outerHTML = wrapBbcode(cont, tag, atr);
    });
    // Rimuovo ritorno-a-capo aggiuntivo prima del blocco di codice
    if(cod) return el.innerText.replace(/\n(\[(?:CODE|HTML|PHP)\])/g, '$1');
    else return el.innerText;
  }
  var faccine = {
    'tongue.png': ':p', 'blink.gif': ';)', 'biggrin.gif': ':D', 'redface.png': ':o', 'smile.gif': ':)', 'frown.gif': ':(', 'what.gif': ':confused:', 'mad.png': ':mad:', 'rolleyes.png': ':rolleyes:', 'cool.png': ':cool:', 'eek.gif': ':eek:', '030.gif': ':smack:',
    'jam.gif': ':jam:', 'dotto.gif': ':dottò:', 'stordita.gif': ':stordita:', 'fagiano.gif': ':fagiano:', 'nondirlo.gif': ':nonlodire', 'noncisiamo.gif': ':nonono:', 'metallica.gif': ':unz:', 'sgrat.gif': ':argo:', 'senzasperanza.gif': ':bhò:',
    'sbonk.gif': ':biifu:', 'dho.gif': ':dhò:', 'cool.gif': ':fighet:', 'sbav.gif': ':sbav:', 'certocerto.gif': ':madai!?:', 'tupitupi.gif': ':yuppi:', 'zizi.gif': ':zizi:', 'cry.gif': ':cry:', 'nillio.gif': ':nillio:', 'mame.gif': ':mame:',
    'electric_g.gif': ':prrr:', 'rotf.gif': ':malol:', 'incupito.gif': ':incupito:', 'ciapet.gif': ':ciapet:', 'ciao.gif': ':ciauz:', 'fiore.gif': ':fiore:', 'saggio.gif': ':98:', 'timida.gif': ':shy:', 'sonno.gif': ':sonno:', 'ecco.gif': ':ecco:',
    'sadico.gif': ':sadico:', 'popcorn.gif': ':popcorn:', 'd56.gif': ':d56:', 'old.gif': ':old:', 'scalata.gif': ':messner:', 'look.gif': ':spy:', 'confermo.gif': ':mem:', 'facepalm.gif': ':facepalm:', 'afraid.gif': ':afraid:', 'ammore.gif': ':love:'
  };

  function wrapBbcode(cont, tag, atr){
      return tag ? '[' + tag + (atr ? '=' + atr : '') + ']' + cont + '[/' + tag + ']' : cont;
  }

  function escapeHtml(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getQuotato(){
    var testo = '';
    var autore;

    var selection = window.getSelection();
    var rangeCount = selection.rangeCount;
    var range;
    var frammento;
    var div;

    for (var i = 0; i < rangeCount; i++){
      range = window.getSelection().getRangeAt(i);
      if(range.collapsed) continue;

      frammento = range.cloneContents();
      div = document.createElement('div');
      div.appendChild(frammento.cloneNode(true));

      // Verifico se range è un frammento incluso per intero in un blocco di codice, quindi lo includo direttamente come bbcode
      let el = range.commonAncestorContainer;
      let isBloccoCodice;
      while (el) {
        if(el.classList){
          if(el.matches('.FHT-code-container, .bbcode_code')){
            div.innerHTML = (div.querySelector(':scope > .bbcode_code') || div).innerHTML.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
            let tag = {'html': 'HTML', 'php': 'PHP'}[el.dataset.codeType] || 'CODE';
            let cont = div.innerText;
            testo += '[' + tag + ']' + cont + '[/' + tag + ']';
            isBloccoCodice = true;
            break;
          } else if(el.classList.contains('postrow') || el.tagName === 'HTML'){
            break;
          }
        }
        el = el.parentElement;
      }
      // Eseguo parsing
      if(!isBloccoCodice){
        testo += toBbcode(div);
      }

      div.remove();

      if(!autore){
        // Recupero nome autore post
        let el = range.commonAncestorContainer;
        el = el.parentElement.closest('.postdetails, .postbit.blockrow');
        autore = el.querySelector('.userinfo .username, .headera .username').innerText;
      }
    }
    testo = testo.trim();
    return {testo: testo, autore: autore};
  }

  function riportaQuotato(o){
    var testo = o.testo;
    var autore = o.autore;
    if(!testo) return;
    // FIX: se editor è vuoto, il contenuto inserito viene ripulito dalla newline finale che gli aggiungo, e il cursore viene portato all'inizio.
    //      In questo caso inserisco preventivamente una nuova riga. Sembra risolvere!
    if(editor.getData() === '') {
        editor.insertHtml('\n');
    }
    var str = '[QUOTE' + (autore ? '=' + autore : '') + ']'+ testo +'[/QUOTE]\n\n';
    editor.insertHtml(str);
    editor.container.$.scrollIntoView(false);
  }
};

// Copia codice dai blocchi di codice nei post
_strumenti.copiaCodice = () => {
  // Aggiungo pulsante "copia codice" per ogni blocco di codice presente nelle discussioni
  const codeBoxes = document.querySelectorAll('div.bbcode_container > .bbcode_code');
  function btnCopy_OnClick(me){
    const codeBox = me.parentElement.nextElementSibling;
    const text = codeBox.innerText
    // FIX: in alcuni casi i caratteri di tabulazione sono pubblicati sul forum con dei caratteri "no-break-space"
    // per cui è necessario uniformarli come semplici spazi in modo che siano copia-incollati correttamente
    .replace(/\u00A0/g,' ');

    navigator.clipboard.writeText(text).then(() => {
      const w = me.parentElement.parentElement;
      w.classList.add('FHT-codecopied');
      setTimeout(() => {w.classList.remove('FHT-codecopied');}, 1000);
    }).catch(err => {
      _modal(50);
    });
  }
  function applica_btnCopy(codeBoxes){
    for (let i = 0; i < codeBoxes.length; i++) {
      const btnCopy = document.createElement('span');
      const codeBox = codeBoxes[i];
      const container = codeBox.parentElement;
      const description = codeBox.previousElementSibling;
      btnCopy.innerText = 'Copia codice';
      btnCopy.className = 'FHT-btn-copycode';
      btnCopy.title = 'Copia codice negli appunti';
      description.appendChild(btnCopy);
    }
  }
  function applica_classiCode(codeBoxes){
    for (let i = 0; i < codeBoxes.length; i++) {
      const codeBox = codeBoxes[i];
      const container = codeBox.parentElement;
      const description = codeBox.previousElementSibling;
      const strDescription = description.innerText.toLowerCase();
      const tipoCodice = strDescription.includes('html') ? 'html' : strDescription.includes('php') ? 'php' : 'generic';

      container.classList.add('FHT-code-container');
      container.classList.add('FHT-code-type-' + tipoCodice);
      container.dataset.codeType = tipoCodice;
    }
  }
  function riapplicaCopiaCodice(){
    const codeBoxes = document.querySelectorAll('div.bbcode_container:not(.FHT-code-container) > .bbcode_code');
    if(codeBoxes.length){
      applica_btnCopy(codeBoxes);
      setTimeout(applica_classiCode, 1, codeBoxes);
    }
  }
  applica_btnCopy(codeBoxes);
  // Applico le classi in modo differito per creare un effetto fade all'apertura
  setTimeout(applica_classiCode, 1, codeBoxes);
  // Delego il click del pulsante "Copia codice" perché, quando viene modificato un post, il suo contenuto viene rigenerato al volo, compresi gli elementi qui creati che perderebbero i relativi listener
  const postContainer = document.querySelector('#posts, #showpm, #post_preview');
  if(postContainer){
    postContainer.addEventListener('click', e => {
      const el = e.target;
      if(el.classList.contains('FHT-btn-copycode')) btnCopy_OnClick(e.target);
    });
  }
  // Elemento da osservare
  const obs = document.querySelector('#postlist, .postdetails');
  if(obs){
    // Riapplico "Copia codice" quando un post viene appeso al volo nella discussione per qualche motivo
    new MutationObserver((mutationList, observer) => {
      const contenitorePost = mutationList.find(o => o.target.id === 'posts');
      if(!contenitorePost) return;
      riapplicaCopiaCodice();
    }).observe(document.querySelector('#postlist, .postdetails'), {childList: true, subtree:true});
  }
};

// Toggle password per qualsiasi campo password
_strumenti.togglePassword = () => {
  // Aggiungo, per i campi password, icona cliccabile che rende possibile mostrare password in chiaro
  document.querySelectorAll('input[type="password"]').forEach(e => {
    e.classList.add('FHT-toggle-password');
    const i = document.createElement('i');
    const rect = e.getBoundingClientRect();
    i.classList.add('FHT-ico-toggle-password');
    i.style.height = rect.height + 'px';
    e.parentNode.style.position = 'relative';
    e.parentNode.insertBefore(i, e.nextSibling);
    i.addEventListener('click', () => {
      e.type = e.type === 'password' ? 'text' : 'password';
      i.classList.toggle('FHT-ico-toggle-password-nascondi');
    });
  });
};

// Evidenzia nomi membri staff
_strumenti.identificaStaff = () => {
  // Eseguo parsing pagina showgroups.php per prelevare riferimenti membri staff.
  // Applico quindi CSS per evidenziare nella pagina i nomi di amministratori e moderatori.

  // Il CSS è già stato applicato inizialmente in base a quanto salvato nel localStorage con l'ultima visita
  // Qui recupero i dati (in modo asincrono) dalla pagina dello staff; se risultano differenti, aggiorno il CSS e li risalvo in localStorage
  fetch('https://forum.html.it/forum/showgroups.php')
  .then(r => r.text())
  .then(html => {
    const reg = /userid=(\d+)" class="username/g;
    let parti = html.split('<h2 class="blockhead">Moderatori</h2>')[1].split('<h2 class="blockhead">Mezzo Moderatore</h2>')[0].split('<h2 class="blockhead">Administrators</h2>');
    const o = {};
    o.admins = [...parti[1].matchAll(reg)].map(e => e[1]);
    o.mods = [...parti[0].matchAll(reg)].map(e => e[1]).filter(e => !o.admins.includes(e)); // filtro i mods per escludere eventuali admins

    const json = JSON.stringify(o);
    if(json === localStorage.getItem('FHT_staff')) return;

    localStorage.setItem('FHT_staff', json);
    _css.aggiornaStyle('staff', _css.fn.staff({nomiStaff: o}));
  })
  .catch(err => console.log(err));
};

// Mantiene attiva la sessione finché la pagina resta aperta
_strumenti.mantieniSessione = () => {
  clearTimeout(_strumenti.mantieniSessione.timeout);
  if(_impostazioni('mantieniSessione').val){
    _strumenti.mantieniSessione.timeout = setTimeout(() => {
      // Richiamo in background stessa pagina ogni 5 minuti
      fetch(window.location.href);
      _strumenti.mantieniSessione();
    }, 300000);
  }
};
_strumenti.mantieniSessione.timeout = 0;


// --------------------------------------------------
// ---               BARRA UTILITY                ---
// --------------------------------------------------

// Imposta la barra specificata come barra da visualizzare
_utility.selezionaBarra = nome => {
  _impostazioni('barraUtility', nome);
  _utility.vars.aggiorna({soloSelezionata: true});
  _utility.aggiornaBarra();
};
// Aggiorna gli elementi della barra correntemente selezionata
_utility.aggiornaBarra = () => {
  const section = document.querySelector('.front-page__trends > section.trends--section');
  const head = section.querySelector('.trending-now');
  const container = section.querySelector('.trends-section__container');
  const barra = container.querySelector('.swiper-wrapper');

  // Renderizzo barra
  barra.innerHTML = _utility.vars.barraSelezionata.elementi.reduce((a, b) => a + (b.length === 0 || b[4] || !b[0] ? '' : `<a class="btn btn--light swiper-slide" href="${_replaceKeys(b[1])}"${b[2] ? ` title="${b[2]}"` : ''}${b[3] ? ' target="_blank"' : ''}>${b[0]}</a>`), '');

  // Se non esiste, creo <select> a fianco alla barra
  const id = 'FHT-select-barra-utility-container';
  if(!document.getElementById(id)){
    /*const el = head.firstElementChild;
    const lbl = document.createElement('label');
    head.insertBefore(lbl, el);
    lbl.appendChild(head);*/
    const selectContainer = document.createElement('div');
    selectContainer.id = id;
    const select = document.createElement('select');
    select.classList.add('FHT-select-barra-utility');
    selectContainer.appendChild(select);
    head.appendChild(selectContainer);
    select.addEventListener('change', e => {
      _utility.selezionaBarra(e.target.value);
      _impostazioni.salva();
    });
  }
  // Aggiorno elementi select
  _utility.aggiornaElementiSelect();
  // Aggiorno riferimento elementi barra per funzioni scorrimento
  _utility.elementiBarra = Array.from(barra.querySelectorAll('a'));
};
// Aggiorna select presenti nella pagina per selezione barra
_utility.aggiornaElementiSelect = () => {
  const contenutoSelect = _utility.getContenutoSelectBarre();
  const nomeBarraSelezionata = _utility.vars.nomeBarraSelezionata;
  document.querySelectorAll('#FHT-select-barra-utility-container > select, #FHT-select-barra-utility').forEach(e => {
    e.innerHTML = contenutoSelect;
    e.value = nomeBarraSelezionata;
  });
};
// Inizializza le funzioni di scorrimento
_utility.initScorrimentoBarra = () => {
  const section = document.querySelector('.front-page__trends > section.trends--section');
  const container = section.querySelector('.trends-section__container');
  const btnPrev = section.querySelector('.trendsSlider__prev');
  const btnNext = section.querySelector('.trendsSlider__next');

  section.classList.add('FHT-contenitore-utility');

  // Scorrimento
  btnPrev.dataset.delta = '-1';
  btnNext.dataset.delta = '1';
  btnPrev.addEventListener('mousedown', scorriBarra, true);
  btnNext.addEventListener('mousedown', scorriBarra, true);

  function scorriBarra(e){
    if(e.buttons != 1) return;
    e.stopImmediatePropagation();
    const me = e.target;
    const delta = +me.dataset.delta; // valore -1 o 1
    const bin = (delta + 1) / 2; // valore 0 o 1
    const items = _utility.elementiBarra;
    let target;
    // Limiti contenitore
    const {left: cL, right: cR} = container.getBoundingClientRect();

    // Ciclo tutti gli elementi esaminandoli nell'ordine relativo al verso di scorrimento
    for (let i = bin * (items.length - 1); items[i]; i -= delta ){
      const item = items[i];
      // Limiti elemento
      const {left: iL, right: iR, width: iW} = item.getBoundingClientRect();
      // Differenze limiti opposti tra elemento e contenitore
      const xL = Math.round(iR - cL);
      const xR = Math.round(cR - iL);
      const xW = Math.min(iW / 2, 40);

      // Se esiste, considero l'elemento nascosto (completamente o parzialmente) precedente al primo che risulta completamente visibile
      if(xL < xW || xR < xW){
        target = item;
        continue;
      }
      // Se non è stato rilevato alcun elemento nascosto
      if(!target){
        // Considero ultimo elemento esaminato
        target = item;
        // Applico animazione finecorsa
        scorriFinecorsa(container, delta);
      }
      // Applico scorrimento elemento rilevato
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: bin ? 'end' : 'start' });
      break;
    }
  }
  function scorriFinecorsa(el, delta){
    el.removeEventListener('transitionend', scorriFinecorsaZero);
    el.style.cssText = 'transform: translateX(0)';
    setTimeout(() => {
      el.style.cssText = `transform: translateX(${-10 * delta}px); transition: transform .1s ease-in-out`;
      el.addEventListener('transitionend', scorriFinecorsaZero, {once: true});
    }, 0);
  }
  function scorriFinecorsaZero(e){
    const el = e.target;
    el.style.cssText = 'transform: translateX(0); transition: transform .1s ease-out;';
    el.addEventListener('transitionend', () => {el.removeAttribute('style');}, {once: true});
  }
};
// Costruisce e restituisce il contenuto html per i <select> barre utility
_utility.getContenutoSelectBarre = () => {
  return _utility.vars.barre.reduce((a, b) => {
    return a + `<option${b.nome === _utility.vars.nomeBarraSelezionata ? ' selected="selected"' : ''}>${b.nome}</option>`;
  }, '');
};


// --------------------------------------------------
// ---    VARIABILI DI APPOGGIO BARRE UTILITY     ---
// --------------------------------------------------

_utility.vars = {
  barrePredefinite: [],
  barreUtente: [],
  barre: [],
  barraSelezionata: {},
  nomiBarrePredefinite: [],
  nomiBarreUtente: [],
  nomiBarre: [],
  nomeBarraSelezionata: ''
};
// Aggiorna variabili di appoggio
_utility.vars.aggiorna = (o = {soloSelezionata: false}) => {
// soloSelezionata: [bol] se true, aggiorna solo dati relativi a barra selezionata
  const v = _utility.vars;
  if(!o.soloSelezionata){
    const impUtente = _impostazioni('barreUtilityUtente');
    v.barrePredefinite = _impostazioni.campi.barraUtility.barrePredefinite;
    v.barreUtente = impUtente && impUtente.val || '[]';
    v.barre = [...v.barrePredefinite, ...v.barreUtente];
    v.nomiBarrePredefinite = v.barrePredefinite.map(e => e.nome);
    v.nomiBarreUtente = v.barreUtente.map(e => e.nome);
    v.nomiBarre = [...v.nomiBarrePredefinite, ...v.nomiBarreUtente];
  }
  const imp = _impostazioni('barraUtility');
  v.nomeBarraSelezionata = imp.val || imp.defaultVal;
  v.barraSelezionata = v.barre.find(e => e.nome === v.nomeBarraSelezionata);
  if(v.barraSelezionata) return;
  // Ripiego su barra di default nel caso non sia trovata quella selezionata
  v.nomeBarraSelezionata = imp.defaultVal;
  v.barraSelezionata = v.barre.find(e => e.nome === v.nomeBarraSelezionata);
};


// --------------------------------------------------
// ---           GESTIONE BARRE UTILITY           ---
// --------------------------------------------------

_utility.edit = {};
// Crea elemento datagrid-utility
_utility.edit.creaDatagrid = (props = {}) => {
  return _datagrid.crea({
    ...{
      nome: props.nome || _utility.edit.nuovoNomeBarra(),
      lunghezzaMaxNome: _impostazioni.campi.barraUtility.lunghezzaMaxNome,
      limiteRighe: _impostazioni.campi.barraUtility.limiteElementi,
      definizioneCampi: _impostazioni.campi.barraUtility.definizioneCampi.slice(0, props.predefinita ? 3 : 5),
      dati: [[]],
      classiContenitore: props.predefinita ? ['FHT-barra-predefinita'] : undefined,
      modificabile: !props.predefinita,
      aperto: false,
      titleBtnAggiungiRiga: _utility.edit.titleBtnAggiungiRiga,
      titleBtnRimuoviDatagrid: _utility.edit.titleBtnRimuoviDatagrid,
      onDatagridRinomina: _utility.edit.datagridRinomina,
      onDatagridToggle: _utility.edit.datagridSalvaStato,
      onDatagridRimuovi: _utility.edit.datagridRimuovi,
      onDatagridDragstart: _utility.edit.dragstart,
      onDatagridDragend: _utility.edit.dragend,
      onRigaAggiungi: _utility.edit.salvaDatiRiga,
      onRigaModifica: _utility.edit.modificaRiga,
      onRigaRimuovi: _utility.edit.rimuoviRiga,
      onRigaDragstart: _utility.edit.dragstart,
      onRigaDragend: _utility.edit.dragend,
      onCampoKeydown: _utility.edit.campoKeydown
    },
    ...props
  });
};
// Appende nuovo datagrid-utility nel contenitore specificato e salva i dati
_utility.edit.aggiungiNuovoDatagrid = contenitore => {
  const datagrid = _utility.edit.creaDatagrid({aperto: true});
  contenitore.appendChild(datagrid);
  datagrid.scrollIntoView({behavior: "smooth", block: "end"});
  datagrid.querySelector('.FHT-datagrid-tbody > div > div > input[type="text"]').focus();
  _utility.edit.salvaDatiNuovaBarra(datagrid);
  _utility.aggiornaElementiSelect();
};
// Rinomina datagrid
_utility.edit.datagridRinomina = (datagrid, nuovoNome) => {
  const inpNome = datagrid.querySelector('.FHT-datagrid-nome');
  const vecchioNome = datagrid.dataset.nome;
  // Rimuovo vecchio nome dai dati
  _utility.vars.nomiBarre.splice(_utility.vars.nomiBarre.indexOf(vecchioNome), 1);
  // Nuovo nome deve essere univoco
  nuovoNome = inpNome.value = _utility.edit.nuovoNomeBarra(nuovoNome);
  // Aggiorno e salvo dati
  const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === vecchioNome);
  if(!dg) return;
  dg.nome = datagrid.dataset.nome = nuovoNome;
  _utility.vars.aggiorna();
  _impostazioni.salva();
  _utility.aggiornaElementiSelect();
};
// Salva, nei dati, lo stato aperto/chiuso del datagrid specificato
_utility.edit.datagridSalvaStato = datagrid => {
  const isAperto = datagrid.classList.contains('FHT-datagrid-aperto');
  const isPredefinita = datagrid.classList.contains('FHT-barra-predefinita');
  if(isPredefinita){
    // Se è barra predefinita, aggiorno stringa in statoBarrePredefinite (le proprietà delle barre predefinite non vengono salvate come impostazioni utente)
    const i = +datagrid.dataset.indicePredefinita;
    let val = (_impostazioni('statoBarrePredefinite').val || '').padEnd(i, ' ');
    val = (val.substring(0, i) + (isAperto ? '1' : ' ') + val.substring(i + 1)).trimRight();
    _impostazioni('statoBarrePredefinite', val);
  } else {
    // Se barra definita da utente, aggiorno proprietà "aperto" del relativo oggetto in barreUtilityUtente
    const nome = datagrid.dataset.nome;
    const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === nome);
    if(!dg) return;
    if(isAperto) dg.aperto = 1;
    else delete dg.aperto;
  }
  _impostazioni.salva();
};
// Rimuove il datagrid specificato
_utility.edit.datagridRimuovi = datagrid => {
   let barraDefault;
   // Se questa era barra selezionata, seleziono quella di default
   if(datagrid.dataset.nome === _utility.vars.nomeBarraSelezionata){
     barraDefault = true;
     _impostazioni('barraUtility', _impostazioni('barraUtility').defaultVal);
     _pannelloToolset.impostaLabelValoreUtente(document.getElementById('FHT-select-barra-utility').parentElement, false);
   }
   // Aggiorno e salvo dati
   _impostazioni('barreUtilityUtente', _utility.edit.getDatiBarre());
   _impostazioni.salva();
   _utility.vars.aggiorna();
   if(barraDefault) _utility.aggiornaBarra();
   else _utility.aggiornaElementiSelect();
};
// Aggiunge, alle impostazioni salvate, dati barra relativa a datagrid specificato
_utility.edit.salvaDatiNuovaBarra = datagrid => {
  _impostazioni('barreUtilityUtente', _impostazioni('barreUtilityUtente').val.concat(_utility.edit.getDatiBarre(datagrid)));
  _impostazioni.salva();
  _utility.vars.aggiorna();
};
// Alla modifica di una riga
_utility.edit.modificaRiga = (datagrid, riga) => {
  const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === datagrid.dataset.nome);
  const indiceRiga = _indiceElemento(riga);
  const datiRiga = dg.elementi[indiceRiga] || [];

  // Salvo dati
  _utility.edit.salvaDatiRiga(datagrid, riga);
};
// Salva nelle impostazioni i dati della riga specificata
_utility.edit.salvaDatiRiga = (datagrid, riga) => {
  const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === datagrid.dataset.nome);
  const indiceRiga = _indiceElemento(riga);
  dg.elementi[indiceRiga] = _utility.edit.getDatiRiga(riga);
  _impostazioni.salva();
  // Aggiorno barra se è quella selezionata
  if(dg.nome === _utility.vars.nomeBarraSelezionata){
    _utility.aggiornaBarra();
  }
};
// Appende una nuova riga vuota al datagrid specificato e la restituisce
_utility.edit.aggiungiNuovaRiga = datagrid => {
  return _datagrid.aggiungiRiga(datagrid, {
    dati: [[]],
    definizioneCampi: _impostazioni.campi.barraUtility.definizioneCampi,
    limiteRighe: _impostazioni.campi.barraUtility.limiteElementi,
    modificabile: true,
    titleSpostaRiga: _datagrid.vars.titleSpostaRiga,
    titleRimuoviRiga: _datagrid.vars.titleRimuoviRiga,
    onRigaModifica: _utility.edit.modificaRiga,
    onRigaRimuovi: _utility.edit.rimuoviRiga,
    onRigaDragstart: _utility.edit.dragstart,
    onRigaDragend: _utility.edit.dragend,
    onCampoKeydown: _utility.edit.campoKeydown
  });
};
// Gestisce keydown campi
_utility.edit.campoKeydown = (ev, datagrid, riga) => {
  // Se freccia giù
  if(ev.code === 'ArrowDown'){
    const campo = ev.target;
    const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === datagrid.dataset.nome);
    const indiceRiga = _indiceElemento(riga);
    const datiRiga = dg.elementi[indiceRiga] || [];
    // Se è ultima riga e cursore nel campo risulta a fine testo
    if(indiceRiga > datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody').children.length - 2 && campo.selectionStart === campo.value.length){
      // Se dati riga risultano salvati, appendo riga vuota
      if(datiRiga.length > 0 ) _utility.edit.aggiungiNuovaRiga(datagrid);
      // Altrimenti se campo è appena stato popolato, salvo dati e appendo riga vuota
      else if(campo.value.length){
        _utility.edit.salvaDatiRiga(datagrid, riga);
        _utility.edit.aggiungiNuovaRiga(datagrid);
      }
    }
  }
};
// Rimuove la riga specificata
_utility.edit.rimuoviRiga = (datagrid, riga) => {
  const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === datagrid.dataset.nome);
  const indiceRiga = _indiceElemento(riga);
  dg.elementi.splice(indiceRiga, 1);
  _impostazioni.salva();
  // Aggiorno barra se è quella selezionata
  if(dg.nome === _utility.vars.nomeBarraSelezionata){
    _utility.aggiornaBarra();
  }
};
// Restituisce un oggetto che rappresenta il datagrid specificato o l'insieme dei datagrid definiti da utente
_utility.edit.getDatiBarre = datagrid => !datagrid ? [...document.querySelectorAll('#FHT-utility-datagrid-container > .FHT-datagrid-modificabile')].map(e => _utility.edit.getDatiBarra(e)) : _utility.edit.getDatiBarra(datagrid);
// Restituisce un oggetto che rappresenta il datagrid specificato
_utility.edit.getDatiBarra = datagrid => ({
  nome: datagrid.dataset.nome,
  elementi: Array.from(datagrid.querySelectorAll('.FHT-datagrid-tbody > div'), _utility.edit.getDatiRiga),
  aperto: datagrid.classList.contains('FHT-datagrid-aperto')
});
// Restituisce un array che rappresenta la riga-datagrid specificata
_utility.edit.getDatiRiga = riga => {
  let skipTrim;
  return Array.from(riga.querySelectorAll(':scope input')).reduceRight((a, b) => {
    const v = b.type === 'checkbox' ? (b.checked ? 1 : '') : b.value;
    if(skipTrim || v !== ''){
      skipTrim = true;
      a.unshift(v);
    }
    return a;
  },[]);
};
// Restituisce un nuovo nome aggiungendo un indice univoco nel caso di duplicati
_utility.edit.nuovoNomeBarra = nome => {
  const nomi = _utility.vars.nomiBarre;
  const nomePredefinito = 'Utility';
  // Il nome specificato sarà ripulito e troncato alla lunghezza massima
  nome = !nome ? nomePredefinito : nome.trim().substring(0, _impostazioni.campi.barraUtility.lunghezzaMaxNome);
  // Se nome esiste già, aggiungo o incremento indice
  if(nomi.includes(nome)){
    const m = nome.match(/^(.+?)(?: ?\((\d+)\))?$/);
    const radice = m[1];
    // Rilevo e applico prossimo indice disponibile tra quelli dei nomi esistenti
    let indice = +(m[2] || 1);
    do {
      nome = radice + ' (' + (++indice) + ')';
    } while (nomi.includes(nome));
  }
  return nome;
};
// Termina il trascinamento di un datagrid o una riga e salva i dati
_utility.edit.dragend = e => {
  if(e.dataTransfer.dropEffect === 'none') return;
  // Verifico che elemento risulti spostato, quindi aggiorno e salvo dati
  const datagrid = e.currentTarget.closest('.FHT-datagrid');
  const riga = _datagrid.dragged !== datagrid ? _datagrid.dragged : null;
  if(_indiceElemento(datagrid) === _datagrid.indiciDragged.datagrid && _indiceElemento(riga) === _datagrid.indiciDragged.riga) return;
  const aggiornaBarra = (riga && _utility.vars.nomeBarraSelezionata === datagrid.dataset.nome || _utility.vars.nomeBarraSelezionata === _datagrid.datagridOrigine.dataset.nome);
  const aggiornaSelect = !riga;
  _impostazioni('barreUtilityUtente', _utility.edit.getDatiBarre());
  _impostazioni.salva();
  _utility.vars.aggiorna();
  // Aggiorno barra utility e select se coinvolti
  if(aggiornaBarra) _utility.aggiornaBarra();
  else if(aggiornaSelect) _utility.aggiornaElementiSelect();
};
// Riferimento contenitore principale (definito in _azioni.initBarraUtility)
_utility.edit.contenitoreDatagrid = null;
// Tooltip pulsanti datagrid-utility
_utility.edit.titleBtnAggiungiRiga = 'Aggiungi nuovo elemento Link';
_utility.edit.titleBtnRimuoviDatagrid = 'Rimuovi questa Barra Utility';


// --------------------------------------------------
// ---                 DATA GRID                  ---
// --------------------------------------------------

// Variabili predefinite
_datagrid.vars = {
  titleBtnRimuoviDatagrid: 'Rimuovi questa tabella',
  titleBtnAggiungiRiga: 'Aggiungi nuova riga',
  titleSpostaRiga: 'Sposta riga',
  titleRimuoviRiga: 'Rimuovi riga'
};
// Riferimento all'elemento trascinato per lo spostamento
_datagrid.dragged = null;
// Indici relativi alla posizione iniziale dell'elemento trascinato
_datagrid.indiciDragged = {datagrid: null, riga: null};
// Riferimento al datagrid da cui avviene l'inizio dello spostamento
_datagrid.datagridOrigine = null;
// Inizializzazione generale datagrid
_datagrid.init = o => {
  o.dragZone.addEventListener('dragenter', _datagrid.dragging);
  o.dragZone.addEventListener('dragover', _datagrid.dragging);
  o.contenitore.addEventListener('keydown', _datagrid.keyboardShortcuts);
};
// Crea e restituisce un elemmento datagrid secondo quanto specificato
_datagrid.crea = o => {
  const {
    nome,
    lunghezzaMaxNome = 25,
    limiteRighe = null,
    definizioneCampi,
    dati,
    classiContenitore = [],
    modificabile = true,
    aperto = false,
    titleBtnRimuoviDatagrid = _datagrid.vars.titleBtnRimuoviDatagrid,
    titleBtnAggiungiRiga = _datagrid.vars.titleBtnAggiungiRiga,
    titleSpostaRiga = _datagrid.vars.titleSpostaRiga,
    titleRimuoviRiga = _datagrid.vars.titleRimuoviRiga,
    onDatagridRinomina = ()=>{},
    onDatagridToggle = () => {},
    onDatagridRimuovi = () => {},
    onDatagridDragstart = () => {},
    onDatagridDragend = () => {},
    onRigaAggiungi = ()=>{},
    onRigaModifica = ()=>{},
    onRigaRimuovi = ()=>{},
    onRigaDragstart = () => {},
    onRigaDragend = () => {},
    onCampoKeydown = () => {}
  } = o;
  const datagrid = document.createElement('div');
  datagrid.classList.add('FHT-datagrid', 'FHT-datagrid-' + (aperto ? 'aperto' : 'chiuso'), modificabile ? 'FHT-datagrid-modificabile' : 'FHT-datagrid-non-modificabile', ...classiContenitore);
  datagrid.dataset.nome = nome;
  datagrid.innerHTML = `
<div class="FHT-datagrid-header">
  <div class="FHT-datagrid-nome-wrapper" data-nome="${nome}">
    <input class="FHT-datagrid-nome" maxlength="${lunghezzaMaxNome}" value="${nome}"${modificabile ? '' : ' readonly="readonly"'}>
  </div>
${modificabile ? '<div class="FHT-datagrid-btn-sposta FHT-datagrid-sposta-prima"></div>' : ''}
  <div class="FHT-datagrid-header-controlli">
${modificabile ? `
    <div class="FHT-datagrid-header-controlli-modificabile">
      <button class="FHT-datagrid-header-btn FHT-datagrid-add-riga" title="${titleBtnAggiungiRiga}">➕</button>
      <button class="FHT-datagrid-header-btn FHT-datagrid-rimuovi" title="${titleBtnRimuoviDatagrid}">🗑️</button>
    </div>
` : ''}
    <button class="FHT-datagrid-header-btn FHT-datagrid-toggle" title="Eltendi/riduci"></button>
  </div>
</div>
<div class="FHT-datagrid-table">
  <div class="FHT-datagrid-thead">
    <div>
      ${modificabile ? '<div class="FHT-datagrid-col-sposta-riga FHT-datagrid-ctrl"></div>' : ''}
      ${definizioneCampi.reduce((a, b) => a + `<div${b.classCol ? ` class="${b.classCol}"` : '' }${b.descrizione ? ` title="${b.descrizione}"` : ''}>${b.nome}</div>`, '')}
      ${modificabile ? '<div class="FHT-datagrid-col-rimuovi-riga FHT-datagrid-ctrl"></div>' : ''}
    </div>
  </div>
  <div class="FHT-datagrid-tbody"></div>
</div>
`;
  // Controlli intestazione
  const header = datagrid.querySelector('.FHT-datagrid-header');
  header.addEventListener('dblclick', e => {
    if(e.target === e.currentTarget || e.target.classList.contains('FHT-datagrid-btn-sposta')){
      _datagrid.toggle(datagrid);
      onDatagridToggle(datagrid);
    }
  });
  header.querySelector('.FHT-datagrid-toggle').addEventListener('click', e => {
    _datagrid.toggle(datagrid, undefined, () => {
      datagrid.scrollIntoView({behavior: "smooth", block: "nearest"});
    });
    onDatagridToggle(datagrid);
  });
  // Inserisco righe
  const propsRiga = {definizioneCampi, modificabile, titleSpostaRiga, titleRimuoviRiga, onRigaModifica, onRigaRimuovi, onRigaDragstart, onRigaDragend, onCampoKeydown};
  dati.forEach(e => _datagrid.aggiungiRiga(datagrid, {...propsRiga, dati: e}));

  if(modificabile){
    // Rinomina datagrid
    const inpNome = datagrid.querySelector('.FHT-datagrid-nome');
    inpNome.addEventListener('input', e => {_datagrid.aggiornaLarghezzaInputNome(e.target);});
    inpNome.addEventListener('change', e => {onDatagridRinomina(datagrid, e.target.value); _datagrid.aggiornaLarghezzaInputNome(e.target);});
    // Pulsante rimuovi datagrid
    datagrid.querySelector('.FHT-datagrid-rimuovi').addEventListener('click', e => {_datagrid.rimuovi(datagrid); onDatagridRimuovi(datagrid);});
    // Pulsante nuova riga
    datagrid.querySelector('.FHT-datagrid-add-riga').addEventListener('click', e => {
      const riga = _datagrid.aggiungiRiga(datagrid, {...propsRiga, dati: [], limiteRighe});
      // Segnalo se ho raggiunto il limiteRighe ed esco
      if(riga === null){
        _modal(100);
        return;
      }
      // Apro tabella se necessario
      if(_datagrid.toggle(datagrid, true, () => {riga.scrollIntoView({behavior: "smooth", block: "nearest"});})){
        _history.skipAdd = true;
        onDatagridToggle(datagrid);
      }
      onRigaAggiungi(datagrid, riga);
      riga.querySelector('div > input[type="text"]').focus();
    });
    // Spostamento elementi
    datagrid.addEventListener('mousedown', e => {
      if(e.button !== 0) return;
      _datagrid.draginit(e);
    });
    datagrid.addEventListener('mouseup', e => {
      if(e.button !== 0) return;
      _datagrid.dragreset(e);
    });
    datagrid.addEventListener('dragstart', e => {
      onDatagridDragstart(e);
      _datagrid.dragstart(e);
    });
    datagrid.addEventListener('dragend', e => {
      onDatagridDragend(e);
      _datagrid.dragend(e);
    });
    datagrid.addEventListener('dragenter', _datagrid.dragenter);
    // Controlli righe
    const tbody = datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody');
    tbody.addEventListener('mouseover', e => {
      // Quando passo sulle celle di controllo, applico relativa classe alla riga
      _datagrid.toggleClasseControlloRiga(e.target, true);
    });
    tbody.addEventListener('mouseout', e => {
      // Quando esco dalle celle di controllo, rimuovo relativa classe dalla riga
      _datagrid.toggleClasseControlloRiga(e.target, false);
    });
  }
  return datagrid;
};
// Cerca la corrispondenza con la cella di controllo specificata e applica alla riga una rispettiva classe
_datagrid.toggleClasseControlloRiga = (ctrlEl, b) => {
  if(!ctrlEl || !ctrlEl.classList.contains('FHT-datagrid-ctrl')) return;
  [
    ['.FHT-datagrid-container:not(.FHT-dragging) > .FHT-datagrid:not(.FHT-grabbing) .FHT-datagrid-col-sposta-riga', 'FHT-datagrid-riga-evidenzia-sposta'],
    ['.FHT-datagrid-container:not(.FHT-dragging) > .FHT-datagrid:not(.FHT-grabbing) .FHT-datagrid-col-rimuovi-riga', 'FHT-datagrid-riga-evidenzia-rimuovi']
  ].some(c => {
    if(!ctrlEl.matches(c[0])) return false;
    ctrlEl.parentElement.classList.toggle(c[1], b);
    return true;
  });
};
// Aggiorna l'attributo data-nome per ottenere una larghezza automatica dell'elemento input attraverso lo pseudo-elemento fratello
_datagrid.aggiornaLarghezzaInputNome = e => {e.parentElement.dataset.nome = e.value;};
// Apre/chiude datagrid specificato
_datagrid.toggle = (datagrid, b, onFineTransizione = () => {}) => {
  if(datagrid.classList.contains('FHT-datagrid-aperto') && b) return false;
  const t = datagrid.querySelector(':scope > .FHT-datagrid-table');
  t.removeEventListener('transitionend',_datagrid.toggle.transitionend);
  t.onFineTransizione = onFineTransizione; // NOTA: sto inquinando il DOM per poter passare questa funzione al listener
  t.addEventListener('transitionend', _datagrid.toggle.transitionend);
  // Ottengo "height" aperto
  t.style.height = 'auto';
  const h = t.offsetHeight;
  t.removeAttribute('style');
  // Fisso "height" corrente
  t.style.height = t.offsetHeight + 'px';
  // Aggiorno classi e imposto transizione
  if(datagrid.classList.toggle('FHT-datagrid-chiuso', !datagrid.classList.toggle('FHT-datagrid-aperto', b))){
    // Chiudo
    setTimeout(() => {t.removeAttribute('style');}, 0);
  } else {
    // Apro
    setTimeout(() => {t.style.height = h + 'px';}, 0);
  }
  return true;
};
_datagrid.toggle.transitionend = e => {
  const t = e.target;
  t.removeEventListener('transitionend',_datagrid.toggle.transitionend);
  t.onFineTransizione();
  delete t.onFineTransizione;
  t.removeAttribute('style');
};
// Rimuove datagrid specificato
_datagrid.rimuovi = e => {e.remove();};
// Appende una nuova riga al datagrid specificato e la restituisce
_datagrid.aggiungiRiga = (datagrid, props) => {
  const {
    limiteRighe = null,
    definizioneCampi,
    dati,
    modificabile = true,
    titleSpostaRiga = _datagrid.vars.titleSpostaRiga,
    titleRimuoviRiga = _datagrid.vars.titleRimuoviRiga,
    onRigaModifica = ()=>{},
    onRigaRimuovi = ()=>{},
    onRigaDragstart = () => {},
    onRigaDragend = () => {},
    onCampoKeydown = () => {}
  } = props;
  if(_is(limiteRighe, Number) && datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody').childElementCount >= limiteRighe) return null;
  const riga = document.createElement('div');
  // Cella sposta riga
  if(modificabile){
    const cel = document.createElement('div');
    // Questa cella ha 2 funzioni: maniglia per il trascinamento di questa riga e area sensibile (che copre la metà superiore dell'intera riga) per determinare la posizione di spostamento delle altre righe quando sono trascinate su questa
    cel.classList.add('FHT-datagrid-col-sposta-riga', 'FHT-datagrid-sposta-prima', 'FHT-datagrid-ctrl');
    cel.title = titleSpostaRiga;
    riga.addEventListener('dragstart', e => {
      e.stopPropagation();
      onRigaDragstart(e);
      _datagrid.dragstart(e);
    });
    riga.addEventListener('dragend', e => {
      e.stopPropagation();
      onRigaDragend(e);
      _datagrid.dragend(e);
    });
    riga.appendChild(cel);
  }
  // Celle dati
  definizioneCampi.forEach((def, col) => {
    const cel = document.createElement('div');
    const inp = document.createElement('input');
    if(def.classCol) cel.classList.add(def.classCol);
    inp.type = def.tipo;
    if(def.lunghezzaMax) inp.maxLength = def.lunghezzaMax;
    if(def.tipo === 'checkbox'){
      if(dati[col]) inp.checked = true;
    } else inp.value = dati[col] || '';
    if(!modificabile) inp.readOnly = true;
    inp.addEventListener('change', () => {onRigaModifica(datagrid, riga);});
    inp.addEventListener('keydown', ev => {onCampoKeydown(ev, datagrid, riga);});
    cel.appendChild(inp);
    riga.appendChild(cel);
  });
  // Cella rimuovi riga
  if(modificabile){
    const cel = document.createElement('div');
    cel.classList.add('FHT-datagrid-col-rimuovi-riga', 'FHT-datagrid-ctrl');
    cel.title = titleRimuoviRiga;
    cel.addEventListener('click', () => {_datagrid.rimuoviRiga(datagrid, riga, onRigaRimuovi);});
    riga.appendChild(cel);
  }
  datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody').appendChild(riga);
  return riga;
};
// Rimuovi riga
_datagrid.rimuoviRiga = (datagrid, riga, callback) => {
  callback(datagrid, riga);
  riga.remove();
};
// Gestione tasti rapidi per i campi dei datagrid
_datagrid.keyboardShortcuts = e => {
  const me = e.currentTarget;
  const focused = me.querySelector(':scope > .FHT-datagrid-modificabile > .FHT-datagrid-header .FHT-datagrid-nome:focus, :scope > .FHT-datagrid-modificabile > .FHT-datagrid-table > .FHT-datagrid-tbody > div > div > :focus');
  if(focused){
    const datagrid = focused.closest('.FHT-datagrid');
    const primaCella = datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody > div > div > input');
    // [INVIO]: focus prossima cella datagrid attivo
    if(e.keyCode === 13 && primaCella){
      const target = focused.classList.contains('FHT-datagrid-nome') ? primaCella : datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody > div:focus-within > div:focus-within + div > input, :scope > .FHT-datagrid-table > .FHT-datagrid-tbody > div:focus-within + div > div > input') || primaCella;
      target.focus();
      target.select();
    }
    // Tasti freccia: quando possibile, si sposta tra celle datagrid attivo
    else if([37, 38, 39, 40].includes(e.keyCode)){
      if(focused.type !== 'checkbox' && focused.selectionStart === focused.selectionEnd && ((e.keyCode <= 38 && focused.selectionEnd !== 0) || (e.keyCode >= 39 && focused.selectionEnd !== focused.value.length))) return;
      let target;
      if(focused.classList.contains('FHT-datagrid-nome') && [39, 40].includes(e.keyCode)) target = primaCella;
      else {
        const coord = {37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1]}[e.keyCode];
        const table = focused.closest('.FHT-datagrid-table');
        const celle = [...table.querySelectorAll(':scope > .FHT-datagrid-tbody > div > div:not(.FHT-datagrid-ctrl) > input')];
        const lunghezzaRiga = table.querySelectorAll(':scope > .FHT-datagrid-thead > div > div:not(.FHT-datagrid-ctrl)').length;
        const indiceCella = _indiceElemento(focused.closest('.FHT-datagrid-tbody > div > div > input'), celle);
        target = celle[indiceCella + coord[0] + coord[1] * lunghezzaRiga];
      }
      if(!target) return;
      target.focus();
      target.select();
    }
    // [ESC]: ripristino valore ed esco dal campo
    else if(e.keyCode === 27 && focused.type !== 'checkbox'){
      let valoreCorrente;
      if(focused.classList.contains('FHT-datagrid-nome')) valoreCorrente = datagrid.dataset.nome;
      else {
        const dg = _impostazioni('barreUtilityUtente').val.find(e => e.nome === datagrid.dataset.nome);
        const riga = focused.closest('.FHT-datagrid-tbody > div');
        const indiceRiga = _indiceElemento(riga);
        const indiceColonna = _indiceElemento(focused.closest('.FHT-datagrid-tbody > div > div'), [...riga.querySelectorAll(':scope > div:not(.FHT-datagrid-ctrl)')]);
        valoreCorrente = dg.elementi[indiceRiga][indiceColonna] || '';
      }
      focused.value = valoreCorrente;
      focused.blur();
    }
  }
};

// Funzioni di trascinamento per riordinare gli elementi
_datagrid.draginit = e => {
  const datagrid = e.currentTarget;
  const grabbedDatagrid = e.target.classList.contains('FHT-datagrid-btn-sposta') && datagrid;
  const grabbedRiga = e.target.classList.contains('FHT-datagrid-col-sposta-riga') && e.target.parentElement;
  if(!(grabbedDatagrid || grabbedRiga)) return;
  datagrid.classList.add('FHT-grabbing');
  _datagrid.datagridOrigine = datagrid;
  // Se datagrid
  if(grabbedDatagrid){
    datagrid.draggable = true;
    datagrid.classList.add('FHT-grabbed-datagrid');
  }
  // Se riga
  if(grabbedRiga){
    datagrid.classList.add('FHT-grabbed-riga');
    grabbedRiga.draggable = true;
    grabbedRiga.classList.add('FHT-grabbed');
    grabbedRiga.classList.remove('FHT-datagrid-riga-evidenzia-sposta');

  }
};
_datagrid.dragstart = e => {
  const me = e.currentTarget;
  const datagrid = e.currentTarget.closest('.FHT-datagrid');
  if(datagrid.classList.contains('FHT-grabbing')){
    const contenitore = datagrid.closest('.FHT-datagrid-container');
    const tipoElemento = datagrid.classList.contains('FHT-grabbed-riga') ? 'riga' : 'datagrid';
    if(contenitore) contenitore.classList.add('FHT-dragging', 'FHT-dragging-' + tipoElemento);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/node type', me);
    _datagrid.dragged = me;
    _datagrid.indiciDragged = {datagrid: _indiceElemento(datagrid), riga: tipoElemento === 'riga' ? _indiceElemento(me) : null};
    setTimeout(() => {
      me.classList.add('FHT-drag-hint');
    }, 0);
  } else {
    e.preventDefault();
  }
};
_datagrid.dragging = e => {
  // Se avviene un trascinamento all'interno del contenitore principale datagrid
  if(e.currentTarget.classList.contains('FHT-dragging')){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
};
_datagrid.dragend = e => {
  const datagrid = _datagrid.datagridOrigine;
  const riga = _datagrid.dragged !== datagrid ? _datagrid.dragged : null;
  // Ripristino posizione elemento se operazione annullata (ESC) o spostamento non consentito
  if(e.dataTransfer.dropEffect === 'none'){
    let el, indice, contenitore;
    if(riga) {
      el = riga;
      indice = _datagrid.indiciDragged.riga;
      contenitore = datagrid.querySelector(':scope > .FHT-datagrid-table > .FHT-datagrid-tbody');
    } else {
      el = datagrid;
      indice = _datagrid.indiciDragged.datagrid;
      contenitore = datagrid.parentElement;
    }
    if(indice === 0) contenitore.prepend(el);
    else contenitore.children[indice - 1].after(el);
  }
  _datagrid.dragreset(e);
};
_datagrid.dragreset = e => {
  // Azzero classi e variabili trascinamento
  const datagrid = _datagrid.datagridOrigine;
  if(!datagrid) return;
  const riga = e.target.closest('.FHT-datagrid-table > div > div');
  const contenitore = datagrid.closest('.FHT-datagrid-container');
  if(contenitore) contenitore.classList.remove('FHT-dragging', 'FHT-dragging-datagrid', 'FHT-dragging-riga');
  datagrid.classList.remove('FHT-grabbing', 'FHT-grabbed-datagrid', 'FHT-grabbed-riga', 'FHT-drag-hint');
  if(riga){
    riga.classList.remove('FHT-grabbed', 'FHT-drag-hint');
    setTimeout(() => {_datagrid.toggleClasseControlloRiga(contenitore.querySelector(':scope > .FHT-datagrid > .FHT-datagrid-table > .FHT-datagrid-tbody > div > .FHT-datagrid-ctrl:hover'), true);}, 0);
  }
  _datagrid.dragged.draggable = false;
  _datagrid.dragged = _datagrid.datagridOrigine = _datagrid.indiciDragged.riga = _datagrid.indiciDragged.datagrid = null;
};
_datagrid.dragenter = e => {
  const dragged = _datagrid.dragged;
  const me = e.target;
  // Elemento target è relativo a tipo elemento trascinato (datagrid o riga)
  const target = dragged.classList.contains('FHT-datagrid') ? e.currentTarget : me.closest('.FHT-datagrid-table > div > div');
  if(!target) return;
  // Se sono su intestazione tabella, inserisco elemento trascinato ad inizio tabella
  if(target.parentElement.classList.contains('FHT-datagrid-thead')){
    const tbody = target.closest('.FHT-datagrid-table').querySelector(':scope > .FHT-datagrid-tbody');
    tbody.prepend(dragged);
    return;
  }
  // Inserisco elemento trascinato prima o dopo target in base a posizione mouse
  target[me.classList.contains('FHT-datagrid-sposta-prima') ? 'before' : 'after'](dragged);
};


// --------------------------------------------------
// ---             COSTRUZIONE PAGINA             ---
// --------------------------------------------------

// Crea e inizializza tutti gli elementi del layout e di interfaccia del Toolset
_stage.init = () => {
  // Attivo pulsante impostazioni Toolset
  _disabilita('#FHT-btn-impostazioni', false);

  // Bugs Fix
  _fix.pulsanteRicercaTopBar();
  _fix.editorDigitazioneBloccata();
  _fix.brokenSmilies();
  //_fix.caratteriCorrotti(); // Questa funzione è un alias di _strumenti.mantieniSessione(), richiamata di seguito in _stage.applicaStrumenti()

  // Se presente editor messaggi
  if(_paginaCorrente.contieneEditor){(() => {

    // I callback precedentemente definiti saranno eseguiti quando una istanza Editor viene creata
    _editorReady();

  })();}

  _stage.applicaStrumenti();

};
// Aggiorna tutti gli elementi del layout e di interfaccia del Toolset
_stage.aggiorna = () => {
  _stage.applicaStrumenti();
  _stage.applicaCSS();
  _utility.vars.aggiorna();
  _utility.aggiornaBarra();
  _pannelloToolset.aggiorna();
};
// Applico gli strumenti che risultano attivati
_stage.applicaStrumenti = () => {
  _strumenti.riportaQuotato();
  _strumenti.copiaCodice();
  _strumenti.togglePassword();
  _strumenti.identificaStaff();
  _strumenti.mantieniSessione();
};
// Imposto classi ed elementi <style>
_stage.applicaCSS = () => {
  // Imposto su <html> classi relative a opzioni definite
  [
    ['stickyBarraUtility', 'FHT-sticky-barra-utility'],
    ['copiaCodice', 'FHT-copia-codice'],
    ['riportaQuotato', 'FHT-riporta-quotato'],
    ['identificaStaff','FHT-identifica-staff'],
    ['togglePassword', 'FHT-toggle-password']
  ].forEach(e => {
    _classeHtml(e[1], _impostazioni(e[0]).val);
  });

  // Inizializzo o aggiorno tutti gli stili
  _css.initStyle();
};


// --------------------------------------------------
// ---                   STYLE                    ---
// --------------------------------------------------

// Appende o aggiorna in <head> gli elementi <style> includendo il relativo CSS
_css.initStyle = async () => {
  // Attendo il tram
  try { await _attendi(()=>document.head, 10, 200); }
  catch (err) { return; }

  // Definisco differenti elementi <style> così da poterli aggiornare in modo distinto per snellire l'esecuzione
  ['layout', 'colore', 'staff'].forEach(nome => {
    let el = document.getElementById('FHT-style-' + nome);
    if(!el){
      // Se non esiste, creo relativo elemento <style>
      el = document.createElement('style');
      el.type = 'text/css';
      el.id = 'FHT-style-' + nome;
      document.head.appendChild(el);
    }
    // Inserisco CSS
    if(_css.fn[nome]) _css.aggiornaStyle(el, _css.fn[nome]({pagina: _paginaCorrente}));
  });
};

_css.aggiornaStyle = (el, strCSS) => {
  if(_is(el, String)) el = document.getElementById('FHT-style-' + el);
  if(el) el.innerHTML = strCSS;
};

_css.fn = {};


// --------------------------------------------------
// ---          COSTRUZIONE STRINGHE CSS          ---
// --------------------------------------------------

// Restituisce il CSS relativo alla definizione del layout e alle regole generali, secondo la pagina specificata
_css.fn.layout = o => {
// o.pagina: [obj] {nome, [queryString], [contieneEditor]}

  const sez = _valori2obj(o.pagina.nome);
  const editorPresente = o.pagina.contieneEditor == null ? _contieneEditor(o.pagina) : o.pagina.contieneEditor;
  const rimuoviTopBar = !!_impostazioni('rimuoviTopBar').val;
  const visualizzazioneCompatta = !!_impostazioni('visualizzazioneCompatta').val;
  const stickyBarraUtility = !!_impostazioni('stickyBarraUtility').val;
  const larghezzaMassima = _impostazioni('larghezzaMassima').val;
  const fontSizeCodice = _impostazioni('fontSizeCodice').val;
  const fontSizeUtility = _impostazioni('fontSizeUtility').val;
  return (
// RESET BOX-MODEL
`
html.FHT-toolset *,
html.FHT-toolset *::before,
html.FHT-toolset *::after                               {box-sizing: border-box !important}
.forumbit_post .foruminfo .forumdata .datacontainer     {width: 100% !important}
`+


// ------------------------------------

// PULSANTE IMPOSTAZIONI
`
#FHT-btn-impostazioni {
  position: absolute;
  bottom: calc(50% - 16px);
  right: 10px;
  width: 32px;
  height: 32px;
  padding: 4px;
  border: 0;
  background: none;
  cursor: pointer;
}
#FHT-btn-impostazioni::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  outline: 5px solid hsla(0, 0%, 100%, 0);
  background: #ffde03 center/90% no-repeat
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjwhLS1HZW5lcmF0b3I6IFhhcmEgRGVzaWduZXIgKHd3dy54YXJhLmNvbSksIFNWRyBmaWx0ZXIgdmVyc2lvbjogNi4wLjAuNC0tPg0KPHN2ZyBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSIyNHB0IiBoZWlnaHQ9IjI0cHQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+DQogPGRlZnM+DQoJPC9kZWZzPg0KIDxnIGlkPSJEb2N1bWVudCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgZm9udC1mYW1pbHk9IlRpbWVzIE5ldyBSb21hbiIgZm9udC1zaXplPSIxNiIgdHJhbnNmb3JtPSJzY2FsZSgxIC0xKSI+DQogIDxnIGlkPSJTcHJlYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTI0KSI+DQogICA8ZyBpZD0iTGF5ZXIgMSI+DQogICAgPHBhdGggZD0iTSAwLDEyIEMgMCwxOC42MjQgNS4zNzYsMjQgMTIsMjQgQyAxOC42MjQsMjQgMjQsMTguNjI0IDI0LDEyIEMgMjQsNS4zNzYgMTguNjI0LDAgMTIsMCBDIDUuMzc2LDAgMCw1LjM3NiAwLDEyIFoiIGZpbGw9IiNmZmRlMDMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjAuMTA3IiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSI3OS44NDAzMTkzNjEyNzc1Ii8+DQogICAgPHBhdGggZD0iTSAxMS40NzYsMS41MzcgTCA3LjI2NCwyLjY1MSBDIDcuMDc0LDIuNzAxIDYuOTU1LDIuODkxIDYuOTkyLDMuMDg1IEwgNy41MjEsNS44MjQgTCA3LjE0NSw2LjEwNSBDIDYuOTU3LDYuMjYgNi43NzYsNi40MjYgNi42LDYuNjAyIEMgNi40MzcsNi43NjUgNi4yODIsNi45MzQgNi4xMzYsNy4xMDcgTCA1Ljg3NCw3LjQ0OSBMIDMuMTAxLDYuOTUxIEMgMi45MSw2LjkxNiAyLjcyMyw3LjAzNCAyLjY3Miw3LjIyMiBMIDEuNTM5LDExLjQyNyBDIDEuNDg5LDExLjYxNyAxLjU5MywxMS44MTQgMS43NzgsMTEuODc5IEwgNC40MTIsMTIuNzg5IEwgNC40NjQsMTMuMjM1IEMgNC41NCwxMy42OTcgNC42NTksMTQuMTU0IDQuODE5LDE0LjU5OCBMIDQuOTk4LDE1LjAyOCBMIDMuMTc5LDE3LjE4MSBDIDMuMDUzLDE3LjMyOSAzLjA2MiwxNy41NDkgMy4yLDE3LjY4NyBMIDYuMjczLDIwLjc3NCBDIDYuNDExLDIwLjkxNCA2LjYzNSwyMC45MjMgNi43ODQsMjAuNzkzIEwgOC44OTEsMTguOTY2IEwgOS4zMTMsMTkuMTQ3IEMgOS43NTUsMTkuMzEzIDEwLjIxLDE5LjQzNiAxMC42NzEsMTkuNTE3IEwgMTEuMTIyLDE5LjU3NSBMIDEyLjA3NSwyMi4yMjYgQyAxMi4xNCwyMi40MDkgMTIuMzM2LDIyLjUxMSAxMi41MjQsMjIuNDYxIEwgMTYuNzM1LDIxLjM0NyBDIDE2LjkyNSwyMS4yOTcgMTcuMDQ1LDIxLjEwNyAxNy4wMDcsMjAuOTEzIEwgMTYuNDc5LDE4LjE3MyBMIDE2Ljg1NCwxNy44OTIgQyAxNy4wNDIsMTcuNzM4IDE3LjIyMywxNy41NzQgMTcuMzk4LDE3LjM5OSBDIDE3LjU2MywxNy4yMzQgMTcuNzE3LDE3LjA2NSAxNy44NjIsMTYuODg5IEwgMTguMTI1LDE2LjU0NiBMIDIwLjg5NywxNy4wNDYgQyAyMS4wODksMTcuMDgxIDIxLjI3NiwxNi45NjQgMjEuMzI2LDE2Ljc3NiBMIDIyLjQ1OSwxMi41NyBDIDIyLjUwOSwxMi4zNzkgMjIuNDA1LDEyLjE4MiAyMi4yMiwxMi4xMTggTCAxOS41ODUsMTEuMjA2IEwgMTkuNTMzLDEwLjc2MSBDIDE5LjQ1OCwxMC4yOTkgMTkuMzM5LDkuODQzIDE5LjE3OSw5LjM5OCBMIDE5LjAwMSw4Ljk2OCBMIDIwLjgyLDYuODE4IEMgMjAuOTQ2LDYuNjcgMjAuOTM3LDYuNDUgMjAuNzk5LDYuMzEyIEwgMTcuNzI2LDMuMjI1IEMgMTcuNTg3LDMuMDg1IDE3LjM2NCwzLjA3NiAxNy4yMTUsMy4yMDUgTCAxNS4xMDcsNS4wMzEgTCAxNC42ODYsNC44NSBDIDE0LjI0Myw0LjY4NSAxMy43ODksNC41NjEgMTMuMzI4LDQuNDggTCAxMi44NzgsNC40MjIgTCAxMS45MjUsMS43NzIgQyAxMS44NTksMS41ODkgMTEuNjY0LDEuNDg3IDExLjQ3NiwxLjUzNyBaIE0gMTQuNTg1LDkuNDE0IEMgMTYuMDEzLDEwLjg0MSAxNi4wMTMsMTMuMTU5IDE0LjU4NSwxNC41ODYgQyAxMy4xNTgsMTYuMDE0IDEwLjg0LDE2LjAxNCA5LjQxMywxNC41ODYgQyA3Ljk4NSwxMy4xNTkgNy45ODUsMTAuODQxIDkuNDEzLDkuNDE0IEMgMTAuODQsNy45ODYgMTMuMTU4LDcuOTg2IDE0LjU4NSw5LjQxNCBaIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwMDAwMDAiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K);
  transform: rotate(1deg);
  transition: transform .5s ease-in-out;
}
#FHT-btn-impostazioni:hover::before {
  outline-color: hsla(0, 0%, 100%, .2);
  transform: rotate(180deg);
}
.FHT-disabilitato {
  filter: saturate(0);
  opacity: .45;
  pointer-events: none;
  transition: .3s !important;
}
`+

// PANNELLO IMPOSTAZIONI - Contenitore overlay e layout
`
html.FHT-overlay > body > :not(#FHT-overlay) {
  user-select: none;
  pointer-events: none;
}
#FHT-overlay {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  font: 400 14px/1.1 Calibri, Arial, Tahoma, Verdana, Geneva, sans-serif;
  background-color: #000000b3;
  opacity: 0;
}
#FHT-overlay a {
  text-decoration: none;
}
#FHT-overlay.aperto {
  opacity: 1;
}
#FHT-overlay.FHT-overlay-trasparente {
  background-color: #0000;
}
#FHT-overlay > .FHT-overlay-content {
  display: flex;
  flex-direction: column;
  width: 768px;
  height: 800px;
  min-width: 588px;
  min-height: 150px;
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #7d7d7d66;
  border-radius: 5px;
  color: #000;
  background-color: #f9f9f9;
  box-shadow: 0 0 40px #000000e6;
  outline: 8px solid transparent;
  overflow: hidden;
}
#FHT-overlay > .FHT-overlay-content.FHT-restored {
  outline-color: #38f;
}
#FHT-overlay > .FHT-overlay-content.FHT-restored-error {
  outline-color: #f00;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-header-container {
  position: relative;
  min-height: 30px;
  padding: 6px 30px 6px 8px;
  border-bottom: 1px solid #7d7d7d66;
  background-color: #e6e6e6;
}
#FHT-overlay > .FHT-overlay-content .FHT-overlay-header {
  display: flex;
  font: inherit !important;
  font-size: 1.1em !important;
  color: inherit !important;
}
#FHT-overlay > .FHT-overlay-content h2 {
  margin: 0;
  font: inherit !important;
  color: inherit !important;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-header-container > .FHT-overlay-close {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 2px;
  right: 2px;
  width: 25px;
  height: 25px;
  font-size: 25px;
  font-weight: normal;
  line-height: 0;
  color: #aaa;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-header-container > .FHT-overlay-close:hover {
  color: #fff;
  background-color: #ff0000b3;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-body {
  flex-grow: 1;
  overflow: hidden;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-footer {
  display: flex;
  padding: 8px 12px;
  font-size: 1.5em;
  border-top: 1px solid #7d7d7d66;
  background-color: #eee;
}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-footer:empty {
  display: none;
}
#FHT-overlay > .FHT-overlay-content .FHT-btn {
  padding: 5px .6em;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
}
#FHT-overlay > .FHT-overlay-content .FHT-btnbar {
  display: flex;
  width: 100%;
}
#FHT-overlay > .FHT-overlay-content .FHT-btnbar .FHT-btn:not(:first-child) {
  margin-left: 5px;
}
.FHT-distanza-auto {margin-left: auto !important}
.FHT-distanza-10   {margin-left: 10px !important}
.FHT-distanza-20   {margin-left: 20px !important}
.FHT-distanza-30   {margin-left: 30px !important}
.FHT-distanza-40   {margin-left: 40px !important}

/* Undo / Redo */

.FHT-ico-undo,.FHT-ico-redo{
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
}
.FHT-ico-redo {
  transform: scaleX(-1);
}
.FHT-ico-undo::before,
.FHT-ico-undo::after,
.FHT-ico-redo::before,
.FHT-ico-redo::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  border: solid currentcolor;
  border-width: .1em .1em 0 0  ;
}
.FHT-ico-undo::before,
.FHT-ico-redo::before {
  width: .7em;
  height: .6em;
  border-radius: 0 .8em 1em;
  transform: translate(-.3em, -.15em);
}
.FHT-ico-undo::after,
.FHT-ico-redo::after {
  width: .4em;
  height: .4em;
  transform: translate(-.3em, -.29em) rotate(-135deg);
}
`+
// PANNELLO IMPOSTAZIONI
`
#FHT-pannello-impostazioni-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
`+
// PANNELLO IMPOSTAZIONI - Schede
`
#FHT-pannello-impostazioni > div:not(.FHT-scheda-attiva) {
  display: none;
}
#FHT-pannello-impostazioni-tabs {
  width: 100%;
  padding: 2px 0 0 15px;
  background: #0003;
  border-bottom: 1px solid #7d7d7d80;
}
#FHT-pannello-impostazioni-tabs > .FHT-pannello-impostazioni-tab {
  position: relative;
  top: 1px;
  display: inline-block;
  float: left;
  min-width: 50px;
  height: 100%;
  margin: 0 0 0 2px;
  padding: .2em 1em .3em;
  color: inherit;
  background: #ddd padding-box;
  border: 1px solid #7d7d7d80;
  border-radius: 6px 6px 0 0;
  transition: .3s;
}
#FHT-pannello-impostazioni-tabs > .FHT-scheda-attiva {
  background: #f9f9f9;
  border-bottom-color: transparent;
}
#FHT-pannello-impostazioni-tabs > :not(.FHT-scheda-attiva):hover {
  background-color: #fff;
  transition: 0s;
}
`+
// PANNELLO IMPOSTAZIONI - Contenuti
`
#FHT-pannello-impostazioni {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px 0 22px 12px;
  overflow: auto;
  mask: linear-gradient(#000, #000) no-repeat right / 11px auto, linear-gradient(transparent, #000 18px, #000 calc(100% - 18px), transparent) no-repeat left;
}
@-moz-document url-prefix() {#FHT-pannello-impostazioni {padding-right: 4px}}

#FHT-pannello-impostazioni > div {
  display: flex;
  flex-direction: column;
  flex: 1;
}
#FHT-pannello-impostazioni .FHT-riga {
  display: flex;
  flex: 1;
}
#FHT-pannello-impostazioni .FHT-colonna {
  display: flex;
  flex-direction: column;
}
#FHT-pannello-impostazioni .FHT-riga > :not(:first-child) {
  margin-left: 10px;
}
#FHT-pannello-impostazioni .FHT-riga > * {
  flex: 1;
}
#FHT-pannello-impostazioni fieldset {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #7d7d7db3;
  border-radius: 4px;
}
#FHT-pannello-impostazioni fieldset > legend {
  margin-left: 10px;
  padding: 0 6px;
  color: #f37000
}
#FHT-pannello-impostazioni fieldset > legend:not(:first-child) {
  margin: 12px 0;
  padding-left: 16px;
  border-bottom: 1px solid #7d7d7d80;
}
#FHT-pannello-impostazioni hr {
  width: 100%;
  border: none;
  border-bottom: 1px solid #7d7d7d80;
}
#FHT-pannello-impostazioni label {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 0 0 8px;
  min-height: 30px;
  white-space: break-spaces;
}
#FHT-pannello-impostazioni label small {
  font-size: .85em;
  opacity: .7;
}
#FHT-pannello-impostazioni input[type="text"] {
  text-indent: 0.5em;
}
#FHT-pannello-impostazioni label > input,
#FHT-pannello-impostazioni label > select {
  margin: 0 8px 0 0;
}
#FHT-pannello-impostazioni label:hover {
  background-color: #7d7d7d33;
}
#FHT-pannello-impostazioni label::before {
  content: '';
  display: block;
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  right: 0;
  z-index: -1;
  border-right: 1px solid #62b1e765;
  background-color: #62b1e71f;
  opacity: 0;
  transition: .5s;
}
#FHT-pannello-impostazioni label.FHT-valore-utente {
  color: #007ad8;
}
#FHT-pannello-impostazioni label.FHT-valore-utente::before {
  opacity: 1;
}
#FHT-pannello-impostazioni label * {
  transition: 0s;
}
#FHT-pannello-impostazioni input[type="range"] {
  width: 80px;
  height: 6px;
}
#FHT-pannello-impostazioni label > input.FHT-input-hex {
  width: 5em;
  margin-left: 0;
}
#FHT-pannello-impostazioni option {
  padding-block: 5px;
}
#FHT-pannello-impostazioni option:disabled {
  color: #bc9857;
}
#FHT-pannello-impostazioni textarea {
 resize: none;
 padding: 6px 10px;
}
.FHT-tooltip-descrizione-campo {
  margin-left: 0 !important;
  padding: 3px 3px 3px 6px;
  font-size: 1.3em;
  font-weight: bold;
  cursor: help;
}
.FHT-tooltip-descrizione-campo::before {content: '?'}
`+
// PANNELLO IMPOSTAZIONI - Prompt
`
#FHT-prompt-impostazioni .FHT-textarea-container {
  display: flex;
  flex: 1;
  position: relative;
  margin-top: 8px;
}
#FHT-prompt-impostazioni .FHT-textarea-container::before {
  content: "JSON copiato";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  text-align: center;
  font: bolder 2em sans-serif;
  color: #fff;
  background-color: #a3e2fc90;
  text-shadow: 0 0 3px #025;
  box-shadow: 0 0 2px #a3e2fc;
  opacity: 0;
}
#FHT-prompt-impostazioni .FHT-textarea-container.FHT-copiato::before {
  opacity: 1;
}
#FHT-prompt-impostazioni textarea {
  flex: 1;
  min-height: 100px;
  font: 200 1em/1.2 Courier New, monospace;
  white-space: pre;
}
#FHT-prompt-impostazioni #FHT-prompt-current {
  background: transparent !important;
}
.FHT-prompt-controlli {
  font-size: 1.2em;
}

/* Errore JSON */

#FHT-prompt-editor {outline: 4px solid transparent}
#FHT-prompt-editor:focus {outline: 4px solid transparent !important}
#FHT-prompt-impostazioni.FHT-prompt-editor-error #FHT-prompt-editor {
  outline-color: #f00;
}

/* Icone Impostazioni */

.FHT-ico-riporta-impostazioni,
.FHT-ico-applica-impostazioni,
.FHT-ico-unisci-impostazioni {
  position: relative;
  display: block;
  width: 16px;
  height: 10px;
  margin: 0 4px 12px;
  background:
    linear-gradient(currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px, transparent 8px, currentColor 8px) no-repeat 0 0/3px 100%,
    linear-gradient(currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px, transparent 8px, currentColor 8px) no-repeat 5px;
}
.FHT-ico-riporta-impostazioni::before,
.FHT-ico-applica-impostazioni::before,
.FHT-ico-unisci-impostazioni::before,
.FHT-ico-riporta-impostazioni::after,
.FHT-ico-applica-impostazioni::after,
.FHT-ico-unisci-impostazioni::after {
  content: '';
  position: absolute;
}
.FHT-ico-riporta-impostazioni::before,
.FHT-ico-applica-impostazioni::before {
  left: 5px;
  width: 6px;
  height: 6px;
  border-top: 2px solid;
  border-left: 2px solid;
}
.FHT-ico-riporta-impostazioni::after,
.FHT-ico-applica-impostazioni::after {
  width: 2px;
  height: 9px;
  background: currentColor;
  border-radius: 1px;
}
.FHT-ico-riporta-impostazioni {
  top: 10px;
}
.FHT-ico-riporta-impostazioni::before {
  top: -9px;
  transform: rotate(45deg);
}
.FHT-ico-riporta-impostazioni::after {
  top: -10px;
  left: 7px;
}
.FHT-ico-applica-impostazioni::before {
  top: 14px;
  transform: rotate(45deg);
}
.FHT-ico-applica-impostazioni::after {
  top: 13px;
  left: 7px;
}

.FHT-ico-unisci-impostazioni::before {
  top: 12px;
  left: 0;
  width: 10px;
  height: 6px;
  background:
    linear-gradient(currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px) no-repeat 0 0/3px 100%,
    linear-gradient(currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px) no-repeat 5px;
}
.FHT-ico-unisci-impostazioni::after {
  top: 12px;
  left: 12px;
  width: 9px;
  height: 9px;
  background:
    linear-gradient(currentColor, currentColor) no-repeat center center/100% 2px,
    linear-gradient(currentColor, currentColor) no-repeat center center/2px 100%;
}

/* Icone JSON */

.FHT-ico-formatta-json {
  background:
    linear-gradient(currentColor 2px, transparent 2px, transparent 12px, currentColor 12px) no-repeat 50%/8px 14px,
    linear-gradient(currentColor 2px, transparent 2px, transparent 4px, currentColor 4px) no-repeat 5px 50%/6px 6px;
}
.FHT-ico-minimizza-json {
  background: radial-gradient(currentcolor 1px, transparent 1px) 50%/4px 4px repeat-x;
}
.FHT-ico-formatta-json,
.FHT-ico-minimizza-json {
  position: relative;
  display: block;
  width: 18px;
  height: 20px;
  border-width: 1px 2px;
  border-color: transparent currentcolor;
  border-style: solid;
  border-radius: 8px / 4px;
}
.FHT-ico-formatta-json::before,
.FHT-ico-minimizza-json::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 2px;
  border-width: 0 2px;
  border-color: transparent currentcolor;
  border-style: solid;
  border-radius: 6px;
}

/* Icona "Nuovo documento" */

.FHT-ico-file {
  position: relative;
  display: block;
  width: 12px;
  height: 16px;
  border: 2px solid transparent;
  border-right: 0;
  border-top: 0;
  box-shadow: 0 0 0 2px;
  border-radius: 1px;
  border-top-right-radius: 6px;
  overflow: hidden
  transform: scale(.8);
}
.FHT-ico-file::after {
  position: absolute;
  content: '';
  width: 6px;
  height: 6px;
  border-left: 2px solid;
  border-bottom: 2px solid;
  right: -1px;
  top: -1px
}

/* Icona "Copy" */

.FHT-ico-copy {
  position: relative;
  display: block;
  width: 14px;
  height: 18px;
  margin-top: -2px;
  border: 2px solid;
  transform: scale(.8);
}
.FHT-ico-copy::after,
.FHT-ico-copy::before {
  content: '';
  position: absolute;
}
.FHT-ico-copy::before {
  background:
    linear-gradient( to left, currentColor 5px, transparent 0) no-repeat right top/5px 2px,
    linear-gradient( to left, currentColor 5px, transparent 0) no-repeat left bottom/2px 5px;
  box-shadow: inset -4px -4px 0 -2px;
  bottom: -6px;
  right: -6px;
  width: 14px;
  height: 18px;
}
.FHT-ico-copy::after {
  width: 6px;
  height: 2px;
  background: currentColor;
  left: 2px;
  top: 2px;
  box-shadow: 0 4px 0, 0 8px 0;
}
 `+

// Controlli colore
`
#FHT-pannello-impostazioni input[type="color"] {
  width: 50px;
  height: 16px;
  border-radius: 3px;
  padding: 2px;
  border: 1px solid #9a9a9a;
}
#FHT-pannello-impostazioni input[type="color"]::-moz-color-swatch {
  border: none;
}
#FHT-pannello-impostazioni input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  border-radius: 0;
}
#FHT-pannello-impostazioni input[type="color"]::-webkit-color-swatch {
  border: none;
}
#FHT-temi-predefiniti {
  max-width: 220px;
}
#FHT-pannello-impostazioni .FHT-tavolozze {
  padding: 4px;
  min-height: 38px;
}
#FHT-pannello-impostazioni .FHT-tavolozze > label {
  display: inline-block;
  margin: 0;
  padding: 2px;
  min-height: auto;
  background: none;
  cursor: pointer;
}
#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza {
  position: relative;
  width: 25px;
  height: 25px;
  padding: 2px;
  border: 2px solid;
  border-radius: 7px;
  background-clip: content-box;
  transition: inherit;
}
#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza::before {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  border: .5px solid #888;
  border-radius: 5px;
  background-color: currentcolor;
  opacity: .45;
}
#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza.FHT-schema-colore-A::before { display: none }
#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza.FHT-schema-colore-C { color: #fff }
#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza.FHT-schema-colore-S { color: #000 }

.FHT-tavolozze > label > input {
  visibility: hidden;
  position: absolute;
  border: none;
  margin: 0;
  width: 0;
  height: 0;
}
#FHT-form-temi-utente {
  display: flex;
  padding: 0 8px 8px;
}
#FHT-form-temi-utente > *:not(:first-child) {
  margin: 0 0 0 5px;
}
#FHT-inp-tema-utente {
  flex: 1;
  outline: 1px solid transparent !important;
}
#FHT-pannello-impostazioni #FHT-inp-tema-utente.FHT-tema-esistente {
  color: #0b0 !important;
  outline-color: currentColor !important;;
}
#FHT-temi-utente {
  margin: 0 8px;
}
#FHT-temi-utente:empty {
  opacity: .6;
  pointer-events: none;
}
`+

// Impostazioni - Utility
`
#FHT-select-barra-utility {
  width: 200px;
}
#FHT-form-barre-utility {
  display: flex;
}
#FHT-btn-add-barra-utility {
  padding-inline: 20px !important;
}
`+

// Datagrid - regole generali
`
.FHT-datagrid-container > .FHT-datagrid {
  position: relative;
  outline: 1px solid #888d;
  margin: 8px 1px 1px;
}
.FHT-datagrid-container > .FHT-datagrid::before { /* Estendo l'area sensibile per coprire il margine alto */
  content: '';
  position: absolute;
  top: -7px;
  z-index: -1;
  width: 100%;
  height: 10px;
}
.FHT-datagrid-header {
  display: flex;
  min-height: 24px;
  text-align: center;
  color: #fff;
  background: #0477ffc5;
}
.FHT-datagrid-nome-wrapper {
  position: relative;
  min-width: 150px;
  max-width: calc(50% - 10px);
  text-align: left;
}
.FHT-datagrid-nome-wrapper::before {
  content: attr(data-nome);
  padding-right: 20px;
  visibility: hidden;
}
.FHT-datagrid-nome {
  position: absolute;
  left: 1px;
  top: 1px;
  width: 100%;
  height: calc(100% - 2px);
  padding-inline: 2px;
  color: inherit;
  background: transparent;
}
.FHT-datagrid-modificabile .FHT-datagrid-nome {
  border: 1px solid #fff3;
  transition: .25s;
}
.FHT-datagrid-modificabile .FHT-datagrid-nome:is(:hover,:focus) {
  background-color: #fff4;
  border-color: #fff8;
  transition: 0s;
}
.FHT-datagrid-header-controlli {
  display: flex;
  margin-left: auto;
}
.FHT-datagrid-header-controlli-modificabile {
  display: flex;
  margin-right: 15px;
}
.FHT-datagrid-header-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 100%;
  padding: 0 6px;
  border: 0;
  color: #fff;
  background-color: #ffffff28;
  transition: .25s;
}
.FHT-datagrid-header-btn:hover,
.FHT-datagrid-header-btn:active {
  background-color: #fff5;
  transition: 0s;
}
.FHT-datagrid-aperto .FHT-datagrid-toggle::before {
  content: '—';
}
.FHT-datagrid-chiuso .FHT-datagrid-toggle::before {
  content: '▢';
}
.FHT-datagrid.FHT-datagrid-non-modificabile > .FHT-datagrid-header {
  background: #777d;
}
.FHT-datagrid-table {
  border-top: 0;
  overflow: hidden;
  transition: .5s ease-in-out;
  color: #fff;
}
.FHT-datagrid-chiuso > .FHT-datagrid-table {
  height: 0;
}
.FHT-datagrid-table > div {
  border: 0 solid #999a;
}
/* THEAD */
.FHT-datagrid-table > .FHT-datagrid-thead {
  background: #1e5f94bb;
}
/* TR */
.FHT-datagrid-table > div > div {
  position: relative;
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  border: inherit;
}
.FHT-datagrid-tbody > div {
  cursor: not-allowed; /* Visibile sui controlli riga disattivati */
}
/* TH */
.FHT-datagrid-thead > div > div {
  justify-content: center;
  text-align: center;
  padding: 3px;
  color: #fff;
}
/* TD */
.FHT-datagrid-table > div > div > div {
  display: flex;
  align-items: center;
  flex: 1;
  width: 1px;
  min-width: 50px;
  white-space: nowrap;
  overflow: hidden;
  cursor: default;
}
.FHT-datagrid-tbody > div > div {
  color: #555;
}
.FHT-datagrid-table > div > div > div {
  border: inherit;
  border-width: 1px 0 0 1px;
}
.FHT-datagrid-table > div > div > div:first-child {
  border-left: 0;
}
/* Input */
#FHT-pannello-impostazioni .FHT-datagrid-table > .FHT-datagrid-tbody input {
  width: 100%;
  padding: 3px;
  border: 0 !important;
  color: inherit;
  background: transparent !important;
  transition: all 0s, color .3s;
}
#FHT-pannello-impostazioni .FHT-datagrid-table > .FHT-datagrid-tbody input:not([type="checkbox"]):focus {color: #000}
.FHT-datagrid-modificabile .FHT-datagrid-tbody > div > div:not(.FHT-datagrid-ctrl):hover                {background: #8882 !important}
.FHT-datagrid-modificabile .FHT-datagrid-tbody > div > div:not(.FHT-datagrid-ctrl):focus-within         {background: #fb4a !important}

/* Controlli righe */
.FHT-datagrid-table .FHT-datagrid-ctrl                      {min-width: 25px; max-width: 25px}
.FHT-datagrid-thead .FHT-datagrid-col-sposta-riga::before   {content: 'ᛨ'}
.FHT-datagrid-thead .FHT-datagrid-col-rimuovi-riga::before  {content: '🞫'}
.FHT-datagrid-tbody .FHT-datagrid-col-sposta-riga::before   {content: '⋮ ⋮ ⋮'; pointer-events: none;}
.FHT-datagrid-tbody .FHT-datagrid-col-rimuovi-riga::before  {content: '✖'; color: #f00; text-shadow: 0 0 1px #000, 0 0 1px #000, 0 0 1px #000}
.FHT-datagrid-tbody .FHT-datagrid-col-sposta-riga           {justify-content: center; cursor: grab}
.FHT-datagrid-tbody .FHT-datagrid-col-rimuovi-riga          {justify-content: center; cursor: pointer}
.FHT-datagrid-tbody .FHT-datagrid-ctrl::before              {opacity: 0}
.FHT-datagrid-container:not(.FHT-dragging)                  /* Fix CH la regola seguente è applicata erroneamente all'elemento rimpiazzato durante uno spostamento come se il puntatore fosse ancora in quel punto */
.FHT-datagrid-tbody > div:hover .FHT-datagrid-ctrl::before  {opacity: 1}
.FHT-datagrid-tbody > .FHT-datagrid-riga-evidenzia-sposta   {background-color: #fc18}
.FHT-datagrid-tbody > .FHT-datagrid-riga-evidenzia-rimuovi  {background-color: #f005}
`+

// Datagrid - drag & drop
`
.FHT-datagrid-container > .FHT-grabbed-datagrid::before {
  display: none;
}
.FHT-datagrid-modificabile .FHT-datagrid-btn-sposta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 32px;
  color: #fff;
  cursor: grab;
  transition: .3s;
  opacity: .4;
}
.FHT-datagrid-modificabile .FHT-datagrid-btn-sposta::before {
  content: '⋮ ⋮ ⋮';
  pointer-events: none;                                     /* Fix FF per evento dragstart impedito su pseudo-elementi */
}
.FHT-datagrid-container:not(.FHT-dragging)                  /* Fix CH la regola seguente è applicata erroneamente all'elemento rimpiazzato durante uno spostamento come se il puntatore fosse ancora in quel punto */
.FHT-datagrid-modificabile .FHT-datagrid-btn-sposta:hover {
  opacity: .8;
}
.FHT-datagrid-container > .FHT-grabbed-datagrid .FHT-datagrid-btn-sposta,
.FHT-datagrid-tbody .FHT-grabbed .FHT-datagrid-col-sposta-riga {
  cursor: grabbing;
}
/* Maniglie disattivate in elementi solitari */
.FHT-datagrid-modificabile:only-child .FHT-datagrid-btn-sposta,
.FHT-datagrid-non-modificabile + .FHT-datagrid-modificabile:last-child .FHT-datagrid-btn-sposta {
  display: none;
}
.FHT-datagrid-modificabile:only-child .FHT-datagrid-tbody > div:only-child .FHT-datagrid-col-sposta-riga,
.FHT-datagrid-non-modificabile + .FHT-datagrid-modificabile:last-child .FHT-datagrid-tbody > div:only-child .FHT-datagrid-col-sposta-riga {
  pointer-events: none;
}
.FHT-datagrid-modificabile:only-child .FHT-datagrid-tbody > div:only-child:hover .FHT-datagrid-col-sposta-riga::before,
.FHT-datagrid-non-modificabile + .FHT-datagrid-modificabile:last-child .FHT-datagrid-tbody > div:only-child:hover .FHT-datagrid-col-sposta-riga::before {
  color: inherit;
  opacity: .3;
}
/* Datagrid hint */
.FHT-datagrid-container > .FHT-drag-hint {
  pointer-events: none;
  background: #6af5;
  border-style: dashed;
  border-color: #36f;
}
.FHT-datagrid-container > .FHT-datagrid > :not(.FHT-datagrid-header),
.FHT-datagrid-container > .FHT-datagrid > .FHT-datagrid-header > :not(.FHT-datagrid-nome-wrapper),
.FHT-datagrid-container > .FHT-datagrid > .FHT-datagrid-header > .FHT-datagrid-nome-wrapper > .FHT-datagrid-nome {
  transition: .3s;
}
.FHT-datagrid-container > .FHT-drag-hint > :not(.FHT-datagrid-header),
.FHT-datagrid-container > .FHT-drag-hint > .FHT-datagrid-header > :not(.FHT-datagrid-nome-wrapper) {
  transition: .1s;
  opacity: 0;
}
.FHT-datagrid-container > .FHT-drag-hint > .FHT-datagrid-header,
.FHT-datagrid-container > .FHT-drag-hint > .FHT-datagrid-header > .FHT-datagrid-nome-wrapper > .FHT-datagrid-nome {
  transition: .1s;
  color: #777;
  border-color: transparent;
  background: transparent;
}
/* Riga hint */
.FHT-datagrid-tbody > .FHT-drag-hint {
  pointer-events: none;
  background: #8885;
  border-color: transparent;
}
.FHT-datagrid-tbody > .FHT-drag-hint:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px dashed #36f;
}
.FHT-datagrid-tbody > .FHT-drag-hint > div {
  opacity: 0;
}

/* Imposto un'area sensibile che copre metà altezza dei vari elementi per determinare la posizione in cui spostare l'elemento trascinato */
.FHT-datagrid-container > .FHT-datagrid-modificabile,
.FHT-datagrid-container > .FHT-datagrid-modificabile > .FHT-datagrid-table > .FHT-datagrid-tbody > div {
  position: relative;
}
.FHT-datagrid-container > .FHT-datagrid-modificabile:not(.FHT-drag-hint) > .FHT-datagrid-header > .FHT-datagrid-sposta-prima::after,
.FHT-datagrid-container > .FHT-datagrid-modificabile:not(.FHT-drag-hint) > .FHT-datagrid-table > .FHT-datagrid-tbody > div:not(.FHT-drag-hint) > .FHT-datagrid-sposta-prima::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 50%;
  left: 0;
  right: 0;
  pointer-events: all;
  display: none;
}
.FHT-datagrid-container.FHT-dragging-datagrid > .FHT-datagrid-modificabile:not(.FHT-drag-hint) > .FHT-datagrid-header > .FHT-datagrid-sposta-prima::after,
.FHT-datagrid-container.FHT-dragging-riga > .FHT-datagrid-modificabile:not(.FHT-drag-hint) > .FHT-datagrid-table > .FHT-datagrid-tbody > div:not(.FHT-drag-hint) > .FHT-datagrid-sposta-prima::after {
  display: block;
}
.FHT-datagrid-container.FHT-dragging-datagrid .FHT-datagrid > *,
.FHT-datagrid-container.FHT-dragging-riga .FHT-datagrid-table > div > div > * {
  pointer-events: none;
}
`+

// Datagrid - utility
`
#FHT-utility-datagrid-container {
  margin-top: 5px;
  padding-bottom: 20px;
}
#FHT-utility-datagrid-container .FHT-datagrid-thead .FHT-datagrid-col-blank,
#FHT-utility-datagrid-container .FHT-datagrid-thead .FHT-datagrid-col-nascosto {
  font-family: Arial, Tahoma, Calibri, Verdana, Geneva, sans-serif;
  font-stretch: condensed;

}
#FHT-utility-datagrid-container .FHT-datagrid-col-blank,
#FHT-utility-datagrid-container .FHT-datagrid-col-nascosto {
  max-width: 50px;
}
`+

// Pulsante Default
`
#FHT-pannello-impostazioni label > .FHT-btn-default {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 20px;
  min-width: 20px;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}
#FHT-pannello-impostazioni label > .FHT-btn-default > div::before {
  content: '↺';
  padding-left: 2px;
  color: #fff;
  rotate: -120deg;
}
#FHT-pannello-impostazioni label:not(.FHT-valore-utente) > .FHT-btn-default {
  pointer-events: none;
}
#FHT-pannello-impostazioni label > .FHT-btn-default > div {
  position: relative;
  right: -22px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding-left: 2px;
  border-radius: 10px 0 0 10px;
  background: #858b87;
  opacity: .4;
  transition: .3s;
}
#FHT-pannello-impostazioni label > .FHT-btn-default:hover > div {
  background: #009d2d;
  transition: 0s, right .3s;
}
#FHT-pannello-impostazioni label.FHT-valore-utente:hover > .FHT-btn-default > div {
  right: 0;
  opacity: 1;
}
`+
_css.scrollbarSottile('.FHT-scrollbar-thin')+


// ------------------------------------

// REGOLE COMUNI (per la maggior parte delle pagine)
`
html.FHT-toolset > body                                 {margin-top: 0 !important; padding-top: 90px}
html.FHT-toolset > body                                 {display: flex; flex-direction: column; min-height: 100vh}
html.FHT-toolset > body > .body-wrapper,
body > .front-page__trends                              {margin-bottom: auto;; width: 100%}
body > .body-wrapper > .wrapper.container               {border-radius: 8px; box-shadow: 0 4px 15px 0 #586a9933}
body > .body-wrapper > .wrapper.container,
body > .front-page__trends > .trends--section           {max-width: ${ larghezzaMassima }px}
@media (min-width: 992px) {
  body > .body-wrapper > .wrapper.container,
  body > .front-page__trends > .trends--section         {width: calc(100% - 20px);}
}
html.FHT-toolset .header                                {overflow: hidden; z-index: 91}
html.FHT-toolset .header::after                         {content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-color:inherit; opacity: 0; pointer-events: none; transition: inherit}
html.FHT-toolset .header__menu nav .nav__item           {margin: 0; padding: 0}
html.FHT-toolset .header__menu nav .opener              {height: auto}
html.FHT-toolset .header__menu nav .opener a            {margin: 0; padding: 3px 8px 5px}
#footer                                                 {border-width: 1px 0 0}
#footer .wrapper, #footer .footer__bottom               {background: none}
.notices li                                             {box-shadow: none !important}
#pagetitle                                              {background-color: #fff !important}
.dropdown                                               {background-image: none !important}
#announcements                                          {display: flex}
.announcements .announcerow,
.newcontent_textcontrol                                 {-moz-box-shadow: none !important; -webkit-box-shadow: none !important; box-shadow: none !important}
.breadcrumb .floatcontainer                             {margin: 0 !important}
.body_wrapper > .toolsmenu                              {display: flex; float: none !important;}
.body_wrapper > .toolsmenu,
#above_searchresults,
.body_wrapper > .navlinks                               {background: #eff1fb !important; border: 1px solid #cecece !important}
html.FHT-toolset a.username > :hover,
html.FHT-toolset a.username.active,
html.FHT-toolset a.username:hover                       {color: #1ea6d8 !important}
.postrow,.postrow blockquote                            {overflow: visible !important}
.rules_link                                             {width: auto !important}
#navbar_username, #navbar_password {
  font-size: 16px !important;
  border-radius: 6px !important;
  color: #000 !important;
  caret-color: #000 !important;
  -webkit-text-fill-color: #000 !important;
  background-color: #fff !important;
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
}
.forum_info .options_block .options_correct,
.thread_info .options_block .options_correct,
.forum_info .options_block2 .options_correct,
.thread_info .options_block2 .options_correct           {margin-right: 0 !important}
.postbit, .postbitlegacy, .eventbit, .formcontrols      {border: 0 !important}
.memberaction_body.popupbody                            {box-shadow: 0px 4px 12px #00000059 !important}
#navpopup                                               {padding: 5px !important}
html.FHT-toolset .login--section .btn                   {border-radius: 20px; line-height: normal;}

`+

// Pulsante "Le tue notifiche"
`
html.FHT-toolset .login--section-logged__list a.notifche span {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  min-width: 20px;
  height: 20px;
  font-size: .8em;
  pointer-events: none;
}
html.FHT-toolset .login--section-logged__list a.notifche:hover span      {top: 0}
html.FHT-toolset .login--section-logged__list a.notifche:has(span)       {margin-right: 10px !important}
html.FHT-toolset .login--section-logged__list a.notifche:has(span)::after {
  content: '';
  position: absolute;
  width:28px;
  height: 25px;
}
`+
(visualizzazioneCompatta ? `
html.FHT-toolset .login--section-logged__list a.notifche span {
  right: -18px;
  min-width: 20px;
  height: 20px;
}
`:`
html.FHT-toolset .login--section-logged__list a.notifche span {
  right: -21px;
  min-width: 25px;
  height: 25px;
}

`)+

// Barra Utility
`
section.trends--section {
  padding: 10px 0;
}
html.FHT-toolset .trends--section > div span {
  color: #fffa;
  opacity: .8;
  font-size: 13px;
}
section.trends--section .trending-now {
  position: relative;
  min-width: 95px;
  padding: 0 0 0 8px;
  text-align: left;
}
#FHT-select-barra-utility-container {
  user-select: none;
  display: inline-block;
  position: absolute;
  left: 0;
}
#FHT-select-barra-utility-container::before {
  content: '˅';
  position: absolute;
  top: 4px;
  right: 16px;
  width: fit-content;
  margin-inline: auto;
  font-size: 9px;
  text-align: right;
  color: #fff;
  opacity: .8;
  transform: scaleX(2);
}
html.FHT-toolset .trends--section > .trending-now:hover > span,
#FHT-select-barra-utility-container:hover::before {
  opacity: 1;
}
#FHT-select-barra-utility-container > select  {
  width: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
section.trends--section .trends-section__container {
  width: calc(100% - 178px);
  min-height: 24px;
  overflow: hidden;
  margin: 0 24px;
}
section.trends--section:not(.FHT-contenitore-utility) .trends-section__container {
  visibility: hidden;
  opacity: 0;
}
.trends-section__container > .swiper-wrapper:empty::before {
  content: '― vuoto ―';
  display: block;
  width: 100%;
  color: #fff8;
  font-style: italic;
  font-size: inherit;
  line-height: 24px;
}
${ fontSizeUtility == '6' ? '' :
  `.front-page__trends > .trends--section > .trends-section__container > .swiper-wrapper { font-size: ${ fontSizeUtility }pt; }`
}
.front-page__trends > .trends--section > .trends-section__container > .swiper-wrapper > a {
  font-size: inherit;
}
.front-page__trends section.trends--section .trendsSlider-nav {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 3px;
  font-size: 28px;
  color: #fff;
  background: none;
  cursor: pointer;
  opacity: .8;
}
.front-page__trends section.trends--section .trendsSlider-nav:hover {
  opacity: 1;
}
section.trends--section .trendsSlider-nav.trendsSlider__next {right: 40px}
section.trends--section .trendsSlider-nav.trendsSlider__prev {left: 90px}
section.trends--section .trendsSlider-nav.trendsSlider__next::before {content: '›'}
section.trends--section .trendsSlider-nav.trendsSlider__prev::before {content: '‹'}
@media (max-width: 736px){
  section.trends--section .trends-section__container {
    width: calc(100% - 88px);
    align-self: start;
  }
  section.trends--section .trendsSlider-nav.trendsSlider__next {right: 40px}
  section.trends--section .trendsSlider-nav.trendsSlider__prev {left: 0px}
}
`+

// Barra Utility - position sticky
`
html.FHT-sticky-barra-utility .front-page__trends {
  position: sticky;
  top: ${ rimuoviTopBar ? 0 : visualizzazioneCompatta ? 30 : 90 }px;
  z-index: 92;
}
`+

// Barra login
`
.login--section                                         {background-color: #34384a}
.login--section .container                              {display: flex; justify-content: start; padding: 0 10px !important}
.login--section .container > div                        {width: auto !important}
.login--section .container > :last-child                {margin: 0 0 0 auto !important}
.login--section-logged__list .chosen-select             {cursor: pointer}
`+

// Icona toggle password
`
html.FHT-toggle-password .body-wrapper input.FHT-toggle-password {
  padding-right: 28px !important;
}
html:not(.FHT-toggle-password) .body-wrapper input.FHT-toggle-password + i.FHT-ico-toggle-password {
  opacity: 0;
  pointer-events: none;
}
.body-wrapper input.FHT-toggle-password + i.FHT-ico-toggle-password {
  display: inline-block;
  position: absolute;
  width: 28px;
  margin-left: -28px;
  padding: 0 5px 0 3px;
  background: left center/40px no-repeat content-box;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjwhLS1HZW5lcmF0b3I6IFhhcmEgRGVzaWduZXIgKHd3dy54YXJhLmNvbSksIFNWRyBmaWx0ZXIgdmVyc2lvbjogNi4wLjAuNC0tPg0KPHN2ZyBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSIxNDkuOTk5cHQiIGhlaWdodD0iNjAuMDAxcHQiIHZpZXdCb3g9IjAgMCAxNDkuOTk5IDYwLjAwMSI+DQogPGRlZnM+DQoJPC9kZWZzPg0KIDxnIGlkPSJEb2N1bWVudCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgZm9udC1mYW1pbHk9IlRpbWVzIE5ldyBSb21hbiIgZm9udC1zaXplPSIxNiIgdHJhbnNmb3JtPSJzY2FsZSgxIC0xKSI+DQogIDxnIGlkPSJTcHJlYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTYwLjAwMSkiPg0KICAgPGcgaWQ9IkxheWVyIDEiPg0KICAgIDxwYXRoIGQ9Ik0gMTQ1LjE0MSwwLjk2NyBMIDc2LjQxLDU0LjcxNSBDIDc1LjY1Nyw1NS4zMDQgNzUuNTMsNTYuMzg5IDc2LjEyNiw1Ny4xMzYgTCA3Ny40MTMsNTguNzQ0IEMgNzguMDEsNTkuNDkxIDc5LjEwOCw1OS42MTkgNzkuODYsNTkuMDMgTCAxNDguNTkxLDUuMjgyIEMgMTQ5LjM0NCw0LjY5MyAxNDkuNDcxLDMuNjA4IDE0OC44NzUsMi44NjEgTCAxNDcuNTg4LDEuMjUzIEMgMTQ2Ljk5MSwwLjUwNiAxNDUuODkzLDAuMzc4IDE0NS4xNDEsMC45NjcgWiBNIDc5LjM0MywyOC41MTYgTCA3OC40OCwyOS45OTkgTCA3OS4zNDMsMzEuNDgxIEMgODEuMzQ5LDM0LjkzNSA4My41MTksMzcuODg2IDg1LjgxOSw0MC4zODMgTCA5MC40NzQsMzYuNzQyIEMgODguODksMzUuMDY4IDg3LjM2NCwzMy4xMzcgODUuOTA5LDMwLjkxOCBMIDg1LjM0MSwyOS45OTggTCA4NS45MDksMjkuMDc4IEMgOTMuNDQ2LDE3LjU5IDEwMi44NjEsMTMuNzg4IDExMi41LDEzLjc4OCBDIDExNC42ODksMTMuNzg4IDExNi44NjgsMTMuOTg0IDExOS4wMTYsMTQuNDIyIEwgMTI0Ljc3OCw5LjkxNCBDIDEyMC44MDQsOC41MTIgMTE2LjY3Nyw3Ljg5MiAxMTIuNSw3Ljg5MiBDIDEwMC4xMDksNy44OTIgODguMTU2LDEzLjM0NCA3OS4zNDMsMjguNTE2IFogTSAxMDMuMSwyMC41ODEgQyAxMDAuNTI1LDIzLjE1OCA5OS4yMjksMjYuNTMyIDk5LjIwNywyOS45MTMgTCAxMTUuNjQ2LDE3LjA1NyBDIDExMS4yODgsMTYgMTA2LjQ5OSwxNy4xNzQgMTAzLjEsMjAuNTgxIFogTSAxMzkuMTgyLDE5LjYxNiBMIDEzNC41MjYsMjMuMjU3IEMgMTM2LjExLDI0LjkyOSAxMzcuNjM0LDI2Ljg2IDEzOS4wODksMjkuMDc4IEwgMTM5LjY1NywyOS45OTggTCAxMzkuMDg5LDMwLjkxOCBDIDEzMS41NTIsNDIuNDA2IDEyMi4xMzcsNDYuMjEgMTEyLjUsNDYuMjEgQyAxMTAuMzExLDQ2LjIxIDEwOC4xMzMsNDYuMDEzIDEwNS45ODcsNDUuNTc2IEwgMTAwLjIyMyw1MC4wODQgQyAxMDQuMTk3LDUxLjQ4NiAxMDguMzIzLDUyLjEwNiAxMTIuNSw1Mi4xMDYgQyAxMjQuODksNTIuMTA2IDEzNi44NDMsNDYuNjUzIDE0NS42NTYsMzEuNDgxIEwgMTQ2LjUxOSwyOS45OTkgTCAxNDUuNjU2LDI4LjUxNiBDIDE0My42NSwyNS4wNjMgMTQxLjQ4MSwyMi4xMTMgMTM5LjE4MiwxOS42MTYgWiBNIDEyNS43OSwzMC4wODggTCAxMDkuMzU2LDQyLjk0MSBDIDExMy43MTMsNDMuOTk1IDExOC41MDEsNDIuODIyIDEyMS45LDM5LjQxNyBDIDEyNC40NzIsMzYuODQgMTI1Ljc2OCwzMy40NjggMTI1Ljc5LDMwLjA4OCBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2U9Im5vbmUiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgICA8cGF0aCBkPSJNIDAsNjAuMDAxIEwgMCwwIEwgMTQ5Ljk5OSwwIEwgMTQ5Ljk5OSw2MC4wMDEgTCAwLDYwLjAwMSBaIiBzdHJva2U9Im5vbmUiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgICA8cGF0aCBkPSJNIDQuMzQyLDI4LjUxOCBMIDMuNDc5LDMwLjAwMSBMIDQuMzQyLDMxLjQ4MyBDIDEzLjE1Niw0Ni42NTggMjUuMTEsNTIuMTA4IDM3LjQ5OSw1Mi4xMDggQyA0OS44ODksNTIuMTA4IDYxLjg0Miw0Ni42NTUgNzAuNjU1LDMxLjQ4MyBMIDcxLjUxOCwzMC4wMDEgTCA3MC42NTUsMjguNTE4IEMgNjEuODQxLDEzLjM0MyA0OS44ODcsNy44OTQgMzcuNDk5LDcuODk0IEMgMjUuMTA4LDcuODk0IDEzLjE1NSwxMy4zNDYgNC4zNDIsMjguNTE4IFogTSA2NC4wODgsMjkuMDggTCA2NC42NTYsMzAgTCA2NC4wODgsMzAuOTIgQyA1Ni41NTEsNDIuNDA4IDQ3LjEzNiw0Ni4yMTIgMzcuNDk5LDQ2LjIxMiBDIDI3Ljg2Myw0Ni4yMTIgMTguNDQ2LDQyLjQxMSAxMC45MDgsMzAuOTIgTCAxMC4zNCwzMCBMIDEwLjkwOCwyOS4wOCBDIDE4LjQ0NSwxNy41OTIgMjcuODYsMTMuNzkgMzcuNDk5LDEzLjc5IEMgNDcuMTMzLDEzLjc5IDU2LjU1LDE3LjU5IDY0LjA4OCwyOS4wOCBaIE0gMjguMDk5LDIwLjU4MyBDIDI0LjU0LDI0LjE0NyAyMy40MjMsMjkuMjMzIDI0Ljc0MSwzMy43NTQgQyAyNy4yNjYsMzIuMTE0IDMwLjY3NywzMi40MDQgMzIuODg5LDM0LjYyIEMgMzUuMSwzNi44MzUgMzUuMzg5LDQwLjI1MyAzMy43NTEsNDIuNzgyIEMgMzguMjY1LDQ0LjEwMiA0My4zNDIsNDIuOTgzIDQ2Ljg5OSwzOS40MTkgQyA1Mi4wODgsMzQuMjIxIDUyLjA4OCwyNS43ODEgNDYuODk5LDIwLjU4MyBDIDQxLjcxMSwxNS4zODQgMzMuMjg3LDE1LjM4NCAyOC4wOTksMjAuNTgzIFoiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjYiIG1hcmtlci1zdGFydD0ibm9uZSIgbWFya2VyLWVuZD0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9Ijc5Ljg0MDMxOTM2MTI3NzUiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
  cursor: pointer;
  opacity: .65;
}
.body-wrapper input.FHT-toggle-password + i.FHT-ico-toggle-password-nascondi {
  background-position-x: 100%;
}
.body-wrapper input.FHT-toggle-password + i.FHT-ico-toggle-password:hover {
  opacity: 1;
}
`+

// Lista discussioni

// Righe
`
.threadbit > *                                          {background-image: none !important; display: flex !important}
`+
// Righe in evidenza
`
html.FHT-toolset .threadbit .sticky                     {background: #e6f0f9 !important}
`+
// Righe selezionate per moderazione
`
.threadbit.imod_highlight .deleted,
html.FHT-toolset .threadbit.imod_highlight .sticky,
.threadbit.imod_highlight .nonsticky,
.threadbit.imod_highlight .discussionrow,
.threadbit.imod_highlight .alt,
.threadbit.imod_highlight .ignored                      {background-color: #FFEB90 !important;}
`+
// Colonne
`
.threadbit > * > *                                      {display: flex; align-items: center}
`+
// Alternanza colonne
`
.threadbit .alt                                         {background: #0055770c !important}
`+
// Colonna posted in
`
.threadbit .threadpostedin                              {margin-left: auto; overflow: hidden}
`+
// Colonna stats
`
.threadbit .threadstats                                 {word-wrap: normal !important}
`+
// Colonna mod (checkbox)
`
.threadbit .threadimod                                  {display: flex; align-items: center; justify-content: center; min-width: 24px; margin-left: auto;}
.threadbit .threadimod > input                          {position: static !important; margin: 0 !important}
`+
// Navigazione veloce
`
.navpopupmenu                                           {width: 100%; background: #f6f6f6; padding: 10px 5px !important}
`+
// Paginazione
`
.pagination span                                        {margin: 0 !important}
.pagination span a                                      {outline: 1px solid #c5c5e8 !important; margin: 0 !important}
.pagination span a:hover                                {color: #1ea6de !important; border-bottom: 1px solid #1ea6de !important; background-color: #ffffff !important}
.pagination_bottom .pagination                          {margin: 8px 0 !important}
`+
// Barra intestazione blocchi
`
#forums .forumhead, div.collapse,
#forumbits > .forumhead,
#forum_icon_legend > h5,
#threaded_view > h4,
html.FHT-toolset .blockhead,
html.FHT-toolset .posthead,
html.FHT-toolset .eventhead,
html.FHT-toolset .searchlisthead,
html.FHT-toolset .threadlisthead                        {background: #707277 none !important; border-color: transparent !important; margin: 1px 0 0 !important}
html.FHT-toolset .blockhead > a,
html.FHT-toolset .blockhead > a:hover,
html.FHT-toolset .blockhead > a > span:hover,
html.FHT-toolset .blockhead > h2                        {color: #fff}
#pollinfo .blockhead                                    {background-color: #d4d4d4 !important}
.blockhead a.collapse, .forum_info a.collapse           {top: 6px !important; z-index: 1}
`+
_css.transitionPreset(`html.FHT-toolset > body, .header, .header__menu, .header__menu nav .opener, .header__logo img, #main_search, .trends--section, .body_wrapper, html.FHT-toolset .login--section,
.forumbit_post .forumrow, .forumbit_nopost .forumbit_nopost .forumrow, .body_wrapper > .toolsmenu, #above_searchresults, #forums .forumhead, .forumhead, #navbar, #welcomemessage, #announcements,
#pagetitle > p.description, #pagetitle, #pagetitle > h1, .wgo_block, .body_wrapper > .navlinks, .login--section .chosen-container-single .chosen-single, .front-page__trends, .trends--section,
html.FHT-toolset .header__menu nav > div .opener--selected a, #footer, html.FHT-toolset .login--section .dropdown, .FHT-contenitore-utility`)+
_css.transitionPreset('body > .body-wrapper > .wrapper.container', 'width 0s')+
_css.transitionPreset('.trends--section .trends-section__container a, .login--section, .login--section .btn, .login--section-logged__title label a', 'color 0s, background 0s')+

(visualizzazioneCompatta ? `
html.FHT-toolset > body                                 {padding-top: 30px}
.header,
.header__menu,
.header__menu nav .opener                               {max-height: 30px}
.header__logo img                                       {margin-top: 0 !important; height: 40px !important}
#main_search                                            {padding: 0 12px !important}
.trends--section                                        {padding: 0 16px !important}
body > .body-wrapper > .wrapper.container               {padding: 4px 8px 10px !important}
.body_wrapper,
.forumbit_post .forumrow,
.forumbit_nopost .forumbit_nopost .forumrow             {min-height: auto}
.body_wrapper > .toolsmenu,
#above_searchresults,
#forums .forumhead, .forumhead, #navbar,
#welcomemessage, #announcements,
#pagetitle > p.description                              {margin: 0 !important}
#pagetitle > h1                                         {padding: 0 !important; font-size: 19px !important}
#pagetitle                                              {margin: 0 !important; padding: 0 0 2px 5px !important}
.wgo_block,
.body_wrapper > .navlinks                               {margin: 2px 0 !important}
.login--section-logged__title label a                   {font-size: 14px !important;}
.login--section                                         {padding: 2px 0 !important}
html.FHT-toolset .login--section .btn                   {padding: 4px 6px !important; font-size: 14px !important; font-weight: normal !important}
.login--section .chosen-container-single .chosen-single {padding: 2px 28px 2px 7px !important}
.trends--section                                        {padding: 4px 0 !important;}
.trends--section .trends-section__container .swiper-wrapper a
                                                        {padding: 0 6px !important; font-size: 9pt;}
`:`
.header,
.header__menu,
.header__menu nav .opener                               {max-height: 90px}
body > .body-wrapper > .wrapper.container               {padding: 5px 8px 10px !important}
.forumbit_post .forumrow,
.forumbit_nopost .forumbit_nopost .forumrow             {min-height: 59px !important}
.body_wrapper > .toolsmenu, #above_searchresults        {margin: 5px 0 0 !important}
#welcomemessage                                         {margin-bottom: 22px}
#pagetitle                                              {margin: 0 !important; padding: 5px !important}
.body_wrapper > .navlinks                               {margin: 15px 0 !important}
html.FHT-toolset .login--section .btn                   {padding: 6px !important}
`)+

(rimuoviTopBar ? `
html.FHT-toolset > body                                 {padding-top: 0}
html.FHT-toolset .header                                {max-height: 0}
html.FHT-toolset .header::after                         {opacity: 1}
`:'')+


// ------------------------------------


//  REGOLE PER SPECIFICI TIPI DI PAGINE


// ------------------------------------
// PAGINE DOVE POSSONO ESSERCI BLOCCHI DI CODICE

(editorPresente || sez.misc ?

// BLOCCO CODICE E STRUMENTO "COPIA CODICE"
`
.bbcode_container {                                     /* <- NOTA: questa classe è usata anche per altri contenitori non "code", ad es. "quote" */
  position: relative;
  margin: 12px 0 !important;
  padding-top: 12px !important;
}
.bbcode_container::before {
  content: "";
  pointer-events: none;
  border: 1px solid #c4c8e7;
  border-radius: 8px;
  display: block;
  position: absolute;
  top: 29px;
  right: 0;
  bottom: -4px;
  left: 0;
  background: #faf7f2;
  visibility: hidden;                                   /* <- Tengo nascosto sui contenitori non "code" */
  opacity: 0;
}
.bbcode_container.FHT-code-container::before {
  visibility: visible;                                  /* <- Visualizzo solo per ".FHT-code-container" (classe aggiunta via script) */
  opacity: 1;
}
.bbcode_container > .bbcode_code {
  position: relative;
  z-index: 1;
  height: auto !important;
  max-height: 850px !important;
  margin: 4px !important;
  padding: 4px !important;
  line-height: 1.3 !important;
  font-size: ${ fontSizeCodice }pt !important;
  border: 0 !important;
  background: none !important;
}
`+

_css.scrollbarSottile('.bbcode_container > .bbcode_code')+`

.bbcode_container .prettyprint {
  width: auto;
}
.bbcode_container > .bbcode_description {
  position: relative;
  z-index: 2;
  overflow: visible;
}
.bbcode_container > .bbcode_description::after {
  content: "Codice copiato";
  display: block;
  position: absolute;
  bottom: -1.2em;
  width: 100%;
  pointer-events: none;
  text-align: center;
  font: bolder 2em sans-serif;
  color: #fff;
  text-shadow: 0 0 3px #025;
  opacity: 0;
}
.bbcode_container.FHT-codecopied > .bbcode_description::after {
  opacity: 1;
}
.bbcode_container.FHT-codecopied > .bbcode_code {
  opacity: .6;
}
.bbcode_container.FHT-codecopied > .bbcode_code,
.bbcode_container.FHT-codecopied::before {
  background-color: #a3e2fc;
}
html:not(.FHT-copia-codice) .FHT-btn-copycode {
  display: none;
}
.FHT-btn-copycode {
  position: absolute;
  top: -3px;
  right: 4px;
  padding: 0 .5em 0 1.9em;
  font: 200 13px/1.2 Calibri, Arial, sans-serif;
  color: #0074e8;
  border: 1px solid #aaa;
  border-radius: 1em;
  background: #f5f5ff .5em center/1em no-repeat
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgZmlsbD0ibm9uZSIgaGVpZ2h0PSIxMyIgcng9IjIiIHJ5PSIyIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB3aWR0aD0iMTMiIHg9IjkiIHk9IjkiLz48cGF0aCBkPSJNNSAxNUg0YTIgMiAwIDAgMS0yLTJWNGEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+);
  cursor: pointer;
}
.bbcode_container:not(.FHT-code-container) > .bbcode_description > .FHT-btn-copycode {
  opacity: 0;                                           /* <- Questo è lo stato iniziale per poter creare un effetto fade. La classe ".FHT-code-container" viene infatti applicata da script in modo differito */
}
.FHT-btn-copycode:hover {
  color: #2497f3;
  background-color: #fff;
}
`:'')+ // <- pagine con blocchi di codice


// ------------------------------------
// PAGINE CON EDITOR

(editorPresente ?

// TOOLTIP RIPORTA TESTO SELEZIONATO COME QUOTE
`
html:not(.FHT-riporta-quotato) #FHT-tooltip-reply {
  display: none;
}
#FHT-tooltip-reply {
  display: flex;
  will-change: top, right;
  user-select: none;
  align-items: center;
  position: absolute;
  z-index: 90;
  padding: 3px 8px;
  font: 200 13px/1.1 Calibri, Arial, sans-serif;
  white-space: nowrap;
  border: 1px solid;
  border-radius: 7px 0 7px 7px;
  cursor: pointer;
}
#FHT-tooltip-reply::before {
  content: "“";
  margin: -5px 6px 0 -6px;
  height: .35em;
  overflow: hidden;
  font: bold 40px/.8 Georgia, serif;
  opacity: .4;
}
#FHT-tooltip-reply:not(.FHT-tooltip-aperto) {
  opacity: 0;
  pointer-events: none;
}
span.FHT-interrompi-selezione {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  font-size: 0;
  line-height: 0;
}
`:'')+ // <- pagine con editor


// ------------------------------------
// - HOME

(sez.home ? `
.forumbit_post .forumrow                                {background: #fbfbfb !important}
`:'')+ // <- home


// ------------------------------------
// - LOGIN

(sez.login ? `
.actionbuttons .group                                   {padding: 0 !important}
`:'')+ // <- login


// ------------------------------------
// - FORUMDISPLAY

(sez.forumdisplay ? `
.forumbit_nopost .forumbit_nopost .forumrow,
.threadbit .nonthread,
.forumbit_post .forumrow                                {background: #fbfbfb !important}
#above_threadlist, #below_threadlist                    {background: #f6f6f6}
#above_threadlist, #below_threadlist                    {display: flex; justify-content: space-between; align-items: start; float: none !important; height: auto !important}
.newcontent_textcontrol                                 {position: static !important; float: left !important; margin: 0 !important; white-space: nowrap}
#above_threadlist > .threadpagenav,
#below_threadlist > .threadpagenav                      {position: static !important; float: right !important; width: auto !important; clear: none !important; margin: 5px 0 0 auto !important}
.forumfoot                                              {position: static !important; height: auto !important; padding: 0 !important; display: flex !important; justify-content: end;}
#inlinemod_formctrls .popupctrl                         {position: static !important}
#thread_inlinemod_form                                  {display: flex; flex-direction: column}
.pagination, .pagination span                           {margin: 0 !important}
.threadbit .pagination                                  {position: absolute !important; margin-left: 0.5em !important;}
.forum_info .options_block,
.thread_info .options_block,
.forum_info .options_block2,
.thread_info .options_block2                            {width: calc(50% - 2.5px) !important; padding-right: 0 !important; margin-right: 0 !important}
.forum_info .options_block2,
.thread_info .options_block2                            {margin-left: 5px !important}
#forumbits > .forumhead > h2                            {color: #fff !important}
#forum_info_options                                     {top: 0 !important}
.prefix.understate                                      {color: #7e3bff; font-variant: small-caps}
.moved .prefix.understate                               {color: transparent; font-size: 0}
.moved .prefix.understate::before                       {content: 'Spostata: '; color: #058a00; font-size: 13px}
 `+
// Colonna stats
`
.threadbit .threadstats                                 {width: 12% !important; min-width: 12%; word-wrap: normal !important}
`+
_css.transitionPreset(`#pagetitle .description, #above_threadlist, #below_threadlist, #below_threadlist > .threadpagenav,
#forumdisplay_navpopup, .forumbits, #above_threadlist_controls, #threadlist, .forumfoot`)+

(visualizzazioneCompatta ? `
#above_threadlist, #below_threadlist                    {margin: 0 !important; padding: 2px 5px !important}
#below_threadlist > .threadpagenav                      {padding: 0 !important}
#forumdisplay_navpopup                                  {margin: 0 !important}
#pagetitle .description,
.forumbits, #above_threadlist_controls,
#threadlist                                             {margin: 0 !important}
.forumfoot                                              {margin: 2px 0 !important;}
`:`
#above_threadlist, #below_threadlist                    {margin: 5px 0 0 !important; padding: 5px !important}
#pagetitle .description                                 {margin: 0 0 22px !important}
#threadlist                                             {margin: 5px 0 0 !important}
.forumfoot                                              {margin: 10px 0 !important}
`)+

'' : '')+ // <- forumdisplay


// ------------------------------------
// - SHOWTHREAD

(sez.showthread ? `
#above_postlist, #below_postlist                        {background: #f6f6f6}
#above_postlist, #below_postlist                        {display: flex; justify-content: space-between; align-items: start; float: none !important; height: auto !important}
.newcontent_textcontrol                                 {position: static !important; float: left !important; margin: 0 !important; white-space: nowrap}
#pagination_top, #pagination_bottom                     {position: static !important; float: right !important; width: auto !important; clear: none !important}
#pagination_top                                         {margin-top: 10px !important; margin-left: auto}
#pagination_bottom                                      {width: auto !important; margin-top: 0 !important; margin-left: auto}
.postbit, .postbitlegacy, .eventbit, .formcontrols,
.postbitdeleted, .postbitignored                        {border: 0 !important}
#posts                                                  {margin: 0 !important}
.eventbit .eventhead                                    {margin: 0 !important}
.postlistfoot                                           {position: static !important; height: auto !important; padding: 0 !important; display: flex !important; justify-content: end}
#thread_info, #inlinemod_formctrls .popupctrl           {position: static !important}
#newreplylink_bottom                                    {position: static !important; float: left; margin-top: 2px !important}
.separator                                              {clear: both}
.cke_button a.restoretext,
.cke_button a.restoretext:hover                         {color: #0057c3 !important; text-decoration: none !important}
.postbitdeleted .nodecontrols,
.postbitignored .nodecontrols                           {height: auto !important}
#newreplylink_top:not(:has(span)),
#newreplylink_bottom:not(:has(span))                    {color: transparent; font-size: 0}
#newreplylink_top:not(:has(span))::before,
#newreplylink_bottom:not(:has(span))::before            {content: 'Discussione chiusa'; color: #f00; font-size: 14px }
`+
 // Quando è attiva la modalità elencata/ibrida delle discussioni
`
#posttree                                               {border: 0 !important}
#threaded_view                                          {background: #f4f4f4}
#posttree .poston                                       {box-shadow: 0 0 0 1px #d0daed}
#posttree > div                                         {display: flex; height: 23px; align-items: center}
#posttree > div > :not(img)                             {margin-left: .5em}
`+
_css.transitionPreset(`#above_postlist, #below_postlist, .newcontent_textcontrol, .navpopupmenu, .postbit,
.postbitlegacy, .eventbit, #postlist, .vbform, .wysiwyg_block, .thread_info h4, .postlistfoot`)+

(visualizzazioneCompatta ? `
#above_postlist, #below_postlist                        {margin: 0 !important; padding: 2px 5px !important}
.newcontent_textcontrol                                 {margin: 0 5px !important}
:not(#pagination_bottom) > .navpopupmenu,
.postbit, .postbitlegacy, .eventbit,
#postlist,
.vbform, .wysiwyg_block, .thread_info h4                {margin: 0 !important}
.postlistfoot                                           {margin: 2px 0 !important}
#pollinfo                                               {margin: 3px 50px !important}
`:`
#above_postlist, #below_postlist                        {margin: 5px 0 0 !important; padding: 5px !important}
#postlist,                                              {margin: 5px 0 0 !important}
.postlistfoot                                           {margin: 10px 0 !important}
:not(#pagination_bottom) > .navpopupmenu                {margin: 5px 0 0 !important}
#pollinfo                                               {margin: 8px 50px !important}
`)+

'':'')+ // <- showthread


// ------------------------------------
// - NEWREPLY

(sez.newreply ? `
#nrreview                                               {border: 1px solid #c4c4c4}
#nrreview .postbit                                      {padding: 0}
#nrreview .headera,
#nrreview .blockfoot                                    {background: #f2f2f2; border-top: 3px solid #bbb; padding: 5px !important}
#nrreview .content                                      {padding: 5px 10px 30px}

`:'')+ // <- newreply


// ------------------------------------
// - ANNOUNCEMENT

(sez.announcement ? `
#announcementlist                                       {margin: 0 !important}
#navpopup                                               {margin: 10px 0 !important}
`+
_css.transitionPreset('#annoucements_navpopup')+

(visualizzazioneCompatta ?
`
#annoucements_navpopup                                  {margin: 0 !important}
`:`
#annoucements_navpopup                                  {margin: 5px 0 !important}
`)+

'':'')+ // <- announcement


// ------------------------------------
// - STAFF

(sez.staff ? `
html.FHT-toolset .groupbit .blockfoot                   {margin: 2px 0 !important; padding: 0 !important}
#groups_1, #groups_2 li.block.usergroup                 {margin-bottom: 3em}
html.FHT-toolset .groupbit                              {min-height: 68px !important}

`:'')+ // <- staff


// ------------------------------------
// - ONLINE

(sez.online ? `
.blockfootpad                                           {background: #f6f6f6;}
#above_who_online                                       {margin: -26px 5px 5px 0 !important}
#pagination_bottom                                      {margin: 5px !important}
`:'')+ // <- online


// ------------------------------------
// - SEARCH, TAGS

(sez.search || sez.tags ? `
#tag_search > .blockfoot, #tag_search > .blocksubfoot   {padding: 5px !important}
html.FHT-toolset .searchlisthead                        {box-shadow: none !important}
#above_searchresults                                    {margin: 0 !important; border: 0 !important}
#above_searchresults .popupgroup                        {padding: 5px 0; float: right; margin-right: 10px}
.searchtitle, .threadbit .threadpostedin                {height: auto !important}
`+
// Intestazione blocco risultati
`
.searchlisthead                                         {margin: 5px 0 !important}
`+
// Colonna stats
`
.threadbit .threadstats                                 {width: 15% !important; min-width: 15%; word-wrap: normal !important}
`+
// Colonna ultimo post
`
.threadbit .threadlastpost dd                           {margin: 0 8px !important;}
`+
// Barra bassa con paginazione
`
#below_searchresults                                    {float: none !important; display: flex !important; width: 100% !important; background: #f6f6f6}
#below_searchresults > .pagination                      {margin: 0 0 0 auto}
`+
// Navigazione veloce
`
#navpopup                                               {margin: 10px 0 !important}
`+
// Paginazione
`
#pagination_top                                         {margin-right: 6px !important}
`+
_css.transitionPreset('#thread, #above_searchresults')+

(visualizzazioneCompatta ? `
#below_searchresults                                    {margin: 2px 0 !important; padding: 5px !important}
#thread                                                 {margin: 0 !important}
`:`
#below_searchresults                                    {margin: 10px 0 !important; padding: 10px 5px !important}
#thread                                                 {margin: 5px 0 0 !important}
`)+

'':'')+ // <- search, tags


// ------------------------------------
// - MEMBERLIST

(sez.memberlist ? `
#charnav                                                {border: 0 !important; border-radius: 0 !important; margin: 0 !important; padding: 10px 5px !important}
#above_memberlist, #pagination_bottom                   {margin: 0 !important; padding: 10px 5px !important; display: flex}
#memberlist_menus                                       {margin: 0 0 0 auto !important}
#searchstats                                            {padding: 5px !important}
#memberlist .blockhead                                  {clear: both}
`:'')+ // <- memberlist


// ------------------------------------
// - MEMBER

(sez.member ? `
#sidebar_container.member_summary                       {-moz-box-shadow: none !important; -webkit-box-shadow: none !important; box-shadow: none !important; background: #f2f2f2 none !important}
.member_content #sidebar_container div.block            {background: transparent none !important}
#activity_tab_container, #activitylist                  {margin: 0 !important}
#activitylist li.activitybit,
li.userprof_content_border                              {border: 1px solid #dadada !important}
.member_summary dl.stats dd                             {width: 50% !important}
.member_summary .friends_mini .friends_list li img      {height: auto !important}
#friends                                                {clear: none !important}
`+
// Primo <a> per ogni scheda
`
.profile_content > div > a.floatright:first-child       {margin: 5px 0; padding: 3px 6px; background: #f8f8f8; border: 1px solid #dadada; border-radius: 6px;}
.profile_content > div > a.floatright:first-child:hover {color: #1ea6d8 !important;}
`+
_css.transitionPreset('#activitylist li.activitybit, .profile_content .friends_list li, .newactivity, .moreactivity')+

(visualizzazioneCompatta ? `
#activitylist li.activitybit,
.profile_content .friends_list li                       {margin: 2px 0 0 !important}
.newactivity, .moreactivity                             {margin: 5px 0 0 !important}
`:`
#activitylist li.activitybit,
.profile_content .friends_list li,
.newactivity, .moreactivity                             {margin: 10px 0 0 !important}
`)+

'':'')+ // <- member


// ------------------------------------
// - USERCP

(sez.usercp ?

'':'')+ // <- usercp


// ------------------------------------
// - PRIVATE (ucp)

(sez.private ? `
#pmlist_info > div                                      {background: #f6f6f6 !important}
#above_postlist, #below_postlist                        {background: #f6f6f6; padding: 10px 5px !important}
#pagination_top, #pagination_bottom                     {margin: 0 !important; padding: 0 !important}
#pmfolderlist                                           {margin: 0 !important}
html.FHT-toolset .blockfoot,
html.FHT-toolset .blocksubfoot                          {padding: 0 5px !important}
.actionbuttons .group                                   {padding: 10px !important}
`+
_css.transitionPreset('#pmlist_info > div, .navpopupmenu, #yui-gen3')+

(visualizzazioneCompatta ? `
#pmlist_info > div:last-child                           {margin: 5px 0 0 !important; padding: 2px 5px !important}
.navpopupmenu                                           {margin: 5px 0 0 !important;}
#yui-gen3                                               {padding: 5px !important}
`:`
#pmlist_info > div:last-child                           {margin: 8px 0 0 !important; padding: 5px !important}
.navpopupmenu                                           {margin: 8px 0 0 !important;}
#yui-gen3                                               {padding: 10px 5px !important}
`)+

'':'')+ // <- private


// ------------------------------------
// - SUBSCRIPTION (ucp)

(sez.subscription ? `
#jump-to-folder                                         {margin-top: 0 !important}
#above_threadlist, .groupcontrols                       {background: #f6f6f6; padding: 8px !important}
#above_threadlist .pagination                           {float: right !important}
#subscription_info                                      {background: #fff}
#threads .threadbit .threadlastpost                     {height: unset}
#threads .threadbit .threadnotification                 {width: 12%}
#threads .threadbit .threadnotification + .threadimod   {position: unset}

`:'')+ // <- subscription


// ------------------------------------
// - PROFILE (ucp)

(sez.profile ? `
#below_postlist                                         {background: #f6f6f6; padding: 8px !important}
.permissions.formcontrols                               {background: #fff}
.cp_content .blockfoot                                  {padding: 5px !important}
.blockfoot.actionbuttons.redirect_button                {padding: 0 !important; text-align: center !important}
#redirect_button                                        {width: 100% !important; padding: 0 !important; text-align: center !important}
#redirect_button > a.textcontrol                        {padding: 5px !important; display: block}
`:'')+ // <- profile


// ------------------------------------
// - CALENDAR (ucp)

(sez.calendar ? `
#above_reminders                                        {background: #f6f6f6; padding: 8px !important; overflow: auto}
#calendarpicker                                         {background: #f6f6f6; padding: 5px !important}
`:'')+ // <- calendar


// ------------------------------------
// - MISC

(sez.misc ? `
.blockrow.bbcodeblock                                   {margin: 0 !important}
`+
_css.transitionPreset('.block')+

(visualizzazioneCompatta ? `
.block                                                  {margin: 0 !important}
`:`
.block                                                  {margin: 10px 0 0 !important}
`)+

'':'')+ // <- misc


// ------------------------------------
// - USERNOTE

(sez.usernote ?

'':'')+ // <- usernote


// ------------------------------------
// - POLL

(sez.poll ?

'':'')+ // <- poll


// ------------------------------------
// - SHOEGROUPS

(sez.showgroups ? `
.navpopupmenu                                           {margin: 0 !important}
#groups_1, .blockfoot                                   {margin: 0 !important}
`+
_css.transitionPreset('.block')+

(visualizzazioneCompatta ? `
.block, #showgroups_navpopup                            {margin: 0 !important}
#showgroups_navpopup                                    {margin: 5px 0 0 !important}
`:`
.block                                                  {margin: 10px 0 0 !important}
#showgroups_navpopup                                    {margin: 10px 0 0 !important}
`)+

'':'')+ // <- showgroups


// ------------------------------------


// INDICATORE UTENTE ONLINE
`
.groupbit a.username.online,
.groupbit a.username.offline,
.groupbit a.username.invisible {
  background: initial;
  padding-right: 13px;
}
img.onlinestatus {
  display: none;
}
a.username.online::after,
a.username.offline::after,
a.username.invisible::after {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-left: 5px;
  border: 1px solid #888;
  border-radius: 50%;
}
a.username.online::after {
  border-color: #4b4;
  background: #7e8;
  box-shadow: 0 0 2px #2b2, inset 1px 1px 3px #fff;
}
a.username.invisible::after {
  border-color: #a84;
  background: #fe4;
}
`+

// TRANSITION
`
#FHT-overlay                                            {transition: .4s ease-out, background-color 1s .1s ease-in-out}
#FHT-overlay > .FHT-overlay-content                     {transition: .4s ease-out, opacity .7s ease-out, outline-color .4s ease-out}
#FHT-overlay > .FHT-overlay-content.FHT-restored,
#FHT-overlay > .FHT-overlay-content.FHT-restored-error  {transition-duration: .4s, .7s, 0s}
#FHT-btn-impostazioni                                   {transition: opacity .4s ease-out !important;}
#FHT-tooltip-reply                                      {transition: opacity .3s ease-out}
.bbcode_container::before                               {transition: background-color 3s ease-out, opacity .7s ease-out}
.bbcode_description::after,
.bbcode_code,
 .FHT-textarea-container::before                        {transition: opacity 3s ease-out}
.bbcode_container.FHT-codecopied::before,
.bbcode_container.FHT-codecopied > .bbcode_description::after,
.bbcode_container.FHT-codecopied > .bbcode_code,
.FHT-textarea-container.FHT-copiato::before             {transition-duration: .2s}
.FHT-btn-copycode                                       {transition: .3s ease-out, opacity .7s ease-out}
.body-wrapper input + i.FHT-ico-toggle-password,
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-header-container,
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-footer,
#FHT-pannello-impostazioni label,
#FHT-pannello-impostazioni input,
#FHT-pannello-impostazioni select,
#FHT-overlay > .FHT-overlay-content .FHT-btn            {transition: .3s ease-out}
.body-wrapper input + i.FHT-ico-toggle-password:hover,
#FHT-pannello-impostazioni label:hover,
#FHT-overlay > .FHT-overlay-content .FHT-btn:hover,
.FHT-btn-copycode:hover                                 {transition: 0s}
`);
};

// Restituisce il CSS relativo alla definizione dei colori, secondo la pagina specificata
_css.fn.colore = o => {
// o.pagina: [obj] oggetto {nome, [queryString], [contieneEditor]}

  const sez = _valori2obj(o.pagina.nome);
  const editorPresente = o.pagina.contieneEditor == null ? _contieneEditor(o.pagina) : o.pagina.contieneEditor;

  const schemaColore = _impostazioni('schemaColore').val;
  const color_base = _impostazioni('coloreBase').val;

  const color_fondo = _colore.regola(color_base, {s_min: -0.6, s_max: 0.38, v_min: 0.56, v_max: 3.7});
  const color_fondo_scuro = _colore.regola(color_base, {s_min: -0.1, s_max: 0.8, v_min: -0.09, v_max: 0.87});

  const color_topbar = _colore.regola(color_base, {s_min: 0, s_max: 0.84, v_min: -0.26, v_max: 0.75});
  const color_topbar_scuro = _colore.regola(color_base, {s_min: 0, s_max: 1.15, v_min: -0.2, v_max: 0.68});

  const color_barraUtility = _colore.regola(color_base, {s_min: 0, s_max: 0.72, v_min: -0.15, v_max: 0.84});
  const color_barraUtility_scuro = _colore.regola(color_base, {s_min: 0, s_max: 1, v_min: 0, v_max: 0.82});

  const color_barraLogin = color_topbar;
  const color_barraLogin_scuro = color_topbar_scuro;

  const color_testoEvidenziato = _impostazioni('coloreEvidenziato').val;
  const color_testoEvidenziato_scuro = _colore.regola(color_testoEvidenziato, {s_max: 0.7, v_min: 0, v_max: 0.7});
  const color_testoEvidenziato_medioScuro = _colore.regola(color_testoEvidenziato, {s_max: 0.85, v_min: 0.3, v_max: 0.85});
  const color_testoEvidenziato_medio = _colore.regola(color_testoEvidenziato, {v_min: 0.6, v_max: 1});
  const color_testoEvidenziato_chiaro = _colore.regola(color_testoEvidenziato, {s_max: 0.7, v_min: 0.9, v_max: 1});
  const color_testoEvidenziato_chiarissimo = _colore.regola(color_testoEvidenziato, {s_max: 0.4, v_min: 0.94, v_max: 1});

  return (
`
html.FHT-toolset, html.FHT-toolset > body               {background-color: ${color_fondo}}
html.FHT-toolset .header, #footer                       {background-color: ${color_topbar}}
html.FHT-toolset .front-page__trends                    {background-color: ${color_barraUtility}}
html.FHT-toolset .login--section                        {background-color: ${color_barraLogin}}

html.FHT-toolset .header__menu nav > div .opener--selected a,
html.FHT-toolset .header__menu nav > div:hover .opener a {color: ${color_testoEvidenziato_medio}}

html.FHT-toolset .login--section .textual-link,
html.FHT-toolset .trends--section .textual-link,
html.FHT-toolset footer .textual-link,
html.FHT-toolset header .textual-link                   {color: ${color_testoEvidenziato_medio}}

html.FHT-toolset .login--section .dropdown,
html.FHT-toolset .trends--section .dropdown,
html.FHT-toolset footer .dropdown,
html.FHT-toolset header .dropdown                       {background-color: ${color_testoEvidenziato_scuro}}

html.FHT-toolset .login--section .newsletter-box__field__submit,
html.FHT-toolset .trends--section .newsletter-box__field__submit,
html.FHT-toolset footer .newsletter-box__field__submit,
html.FHT-toolset header .newsletter-box__field__submit  {background-color: ${color_testoEvidenziato_medioScuro} !important}

html.FHT-toolset .login--section .newsletter-box__field__submit:hover,
html.FHT-toolset .trends--section .newsletter-box__field__submit:hover,
html.FHT-toolset footer .newsletter-box__field__submit:hover,
html.FHT-toolset header .newsletter-box__field__submit:hover {background-color: ${color_testoEvidenziato_scuro} !important}

html.FHT-toolset .login--section a:hover,
html.FHT-toolset .trends--section a:hover,
html.FHT-toolset footer a:hover,
html.FHT-toolset header a:hover                         {color: ${color_testoEvidenziato_medio}}

html.FHT-toolset .login--section .btn,
html.FHT-toolset footer .btn,
html.FHT-toolset header .btn                            {color: ${color_testoEvidenziato_chiaro}}

html.FHT-toolset .login--section .btn:hover,
html.FHT-toolset footer .btn:hover,
html.FHT-toolset header .btn:hover                      {color: ${color_testoEvidenziato_chiarissimo} !important; background-color: #fff3}

html.FHT-toolset .trends--section .btn:hover            {color: #fff}

#FHT-pannello-impostazioni input[type="text"],
#FHT-pannello-impostazioni textarea,
#FHT-pannello-impostazioni select                       {background: #eee !important; border: 1px solid #bbb !important}

#FHT-pannello-impostazioni input[type="text"]::placeholder {color: #999; opacity: 1}
#FHT-pannello-impostazioni input[type="text"]::-ms-input-placeholder {color: #999}

#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza {border-color: #999}
#FHT-pannello-impostazioni .FHT-tavolozze > label:hover > .FHT-ico-tavolozza,
#FHT-pannello-impostazioni .FHT-tavolozze > label > input:checked + .FHT-ico-tavolozza {border-color: #08f; box-shadow: 0 0 3px 2px #7de2ff}

#FHT-overlay > .FHT-overlay-content .FHT-btn            {color: #456; border-color: #7d7d7d80; background-color: #7d7d7d33}
#FHT-overlay > .FHT-overlay-content .FHT-btn:hover      {color: #45a; border-color: #049; background-color: #7eddff80}

`+

(editorPresente ? `
#FHT-tooltip-reply                                      {color: #333; border-color: #555; background: #f8f8ff}
#FHT-tooltip-reply:hover                                {color: #223; border-color: ${color_testoEvidenziato_medioScuro}; background: #fff}
#FHT-tooltip-reply::before                              {color: ${color_testoEvidenziato_scuro}}
`:'')+

(sez.member ? `
#profile_tabs dd.userprof_module,
#profile_tabs div.memberprofiletabunder,
.activitystream_block dd.selected,
dd.userprof_module                                      {background: ${color_testoEvidenziato_medioScuro} none !important}
`:'')+

(sez.search || sez.tags ? `
#searchtypeswitcher li:not(.selected) a                 {background: #707277 none !important}
ul#searchtypeswitcher > li.selected a                   {background: ${color_testoEvidenziato_medioScuro} none !important}
ul#searchtypeswitcher                                   {border-bottom-color: ${color_testoEvidenziato_medioScuro} !important}
#above_searchresults .popupctrl                         {color: #4e4e4e}
`:'')+

(sez.memberlist ? `
#charnav                                                {background: #f6f6f6 none !important}
#charnav > dd > a                                       {background: #fff}
#charnav > dd > a:hover                                 {background: #97a6b3 !important}
#above_memberlist, #pagination_bottom                   {background: #f6f6f6 !important}
`:'')+

// SCHEMA COLORE

// "Modalità scura" automatica, applicata in base alle impostazioni di sistema
(schemaColore === 'A' ? '@media (prefers-color-scheme: dark) {' : '')+

// "Modalità scura" automatica o impostazioni da utente
(schemaColore !== 'C' ?

// REGOLE COMUNI
`
html.FHT-toolset, html.FHT-toolset > body               {background-color: ${color_fondo_scuro}}
html.FHT-toolset .header, #footer                       {background-color: ${color_topbar_scuro}}
html.FHT-toolset .front-page__trends                    {background-color: ${color_barraUtility_scuro}}
html.FHT-toolset .login--section                        {background-color: ${color_barraLogin_scuro}}

#FHT-pannello-impostazioni input:is([type="text"],[type="url"]),
#FHT-pannello-impostazioni textarea,
#FHT-pannello-impostazioni select                       {color: #fff !important; background: #444 !important; border: 1px solid #777 !important}

#FHT-pannello-impostazioni-tabs > :not(.FHT-scheda-attiva)       {background-color: transparent; color: #aaa; border-color: transparent}
#FHT-pannello-impostazioni-tabs > .FHT-scheda-attiva             {background-color: #1f1f1f}
#FHT-pannello-impostazioni-tabs > :not(.FHT-scheda-attiva):hover {background-color: #303030}

#FHT-pannello-impostazioni .FHT-tavolozze > label > .FHT-ico-tavolozza {border-color: #aaa}
#FHT-pannello-impostazioni .FHT-tavolozze > label:hover > .FHT-ico-tavolozza,
#FHT-pannello-impostazioni .FHT-tavolozze > label > input:checked + .FHT-ico-tavolozza {border-color: #fff;box-shadow: 0 0 3px 2px #02c6ff}

.FHT-datagrid-table > div > div > div                   {color: #fff}
#FHT-pannello-impostazioni .FHT-drag-hint               {border-color: #6af}

#FHT-overlay > .FHT-overlay-content .FHT-btn            {color: #ddd}
#FHT-overlay > .FHT-overlay-content .FHT-btn:hover      {color: #fff; border-color: #fff}

.wrapper.container > .body_wrapper,
#forums                                                 {background-color: transparent !important; background-image: none !important; border-color: transparent !important}
#FHT-overlay > .FHT-overlay-content                     {color: #fff; background-color: #1f1f1f}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-header-container  {background-color: #353535}
#FHT-overlay > .FHT-overlay-content > .FHT-overlay-footer            {background-color: #262626}
#FHT-overlay > .FHT-overlay-content label.FHT-valore-utente          {color: #81bff7}
#navbar_username, #navbar_password {
  color: #fff !important;
  caret-color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  background-color: #202438 !important;
  -webkit-box-shadow: 0 0 0 30px #202438 inset !important;
}
#navbar_password + i.FHT-ico-toggle-password {
  filter: invert(1.5); /* Icona chiara su fondo scuro */
}
`+

// REGOLE PER SPECIFICI TIPI DI PAGINE

(editorPresente ? `
#FHT-tooltip-reply                                      {color: #fff; background: #505156; border-color: #999}
#FHT-tooltip-reply:hover                                {color: #fff; background: ${color_testoEvidenziato_scuro}; border-color: ${color_testoEvidenziato_chiaro}}
#FHT-tooltip-reply::before                              {color: ${color_testoEvidenziato_chiarissimo}}
#FHT-tooltip-reply:hover::before                        {color: #fff}
`:'')+

(sez.tags || sez.search ? `
#postpagestats                                          {color: #fff !important}
`:'')+

(sez.memberlist ? `
#searchstats                                            {color: #fff !important}
`:'')+

(sez.member ? `
.userprof_title                                         {color: #fff !important}
`:'')+

(sez.subscription ? `
.forumfoot                                              {color: #fff !important}
`:'')+

'':'')+

(schemaColore === 'A' ? '}' : '')

  );
};

// Restituisce il CSS che applica una formattazione per evidenziare i nomi dello staff (admins e mods)
_css.fn.staff = o => {
// [o.nomiStaff]: [obj] oggetto con proprietà "admins" e "mods" che contengono un array dei relativi ID utente

  // Se non è stato passato l'oggetto specifico
  if(!o || !o.nomiStaff){
    // Recupero i dati da localStorage e, se esistono, li adopero per costruire il CSS
    const staff = localStorage.getItem('FHT_staff');
    if(staff) o = {nomiStaff: JSON.parse(staff)};
    else return '';
  }

  const selector = 'html.FHT-identifica-staff .body-wrapper > div > :not(.login--section) a:is(.username,:not([class])):is(';
  const href = {
    mods: o.nomiStaff.mods.map(e => `[href$="userid=${ e }"]`).join(','),
    admins: o.nomiStaff.admins.map(e => `[href$="userid=${ e }"]`).join(',')
  };
  const ico = {
    mods: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjwhLS1HZW5lcmF0b3I6IFhhcmEgRGVzaWduZXIgKHd3dy54YXJhLmNvbSksIFNWRyBmaWx0ZXIgdmVyc2lvbjogNi4wLjAuNC0tPg0KPHN2ZyBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSIxMDVwdCIgaGVpZ2h0PSIxMzUuMDAxcHQiIHZpZXdCb3g9IjAgMCAxMDUgMTM1LjAwMSI+DQogPGRlZnM+DQoJPC9kZWZzPg0KIDxnIGlkPSJEb2N1bWVudCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgZm9udC1mYW1pbHk9IlRpbWVzIE5ldyBSb21hbiIgZm9udC1zaXplPSIxNiIgdHJhbnNmb3JtPSJzY2FsZSgxIC0xKSI+DQogIDxnIGlkPSJTcHJlYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEzNS4wMDEpIj4NCiAgIDxnIGlkPSJMYXllciAxIj4NCiAgICA8cGF0aCBkPSJNIDUyLjUsMCBMIDAsMjguNTg5IEwgMCwxMzUuMDAxIEwgMTA1LDEzNS4wMDEgTCAxMDUsMjguNTg5IEwgNTIuNSwwIFogTSAyNS42NTIsMzAuOTIxIEwgMzIuOTQ3LDczLjQ4MiBMIDQ2Ljk0OCwzMC45MjEgTCA1OC4xNCwzMC45MjEgTCA3Mi4zMjIsNzMuNDgyIEwgNzkuNDgyLDMwLjkyMSBMIDkxLjcxNiwzMC45MjEgTCA4MC40NzksOTguMzEzIEwgNjguMjQzLDk4LjMxMyBMIDUyLjYxMiw1MS4zMDggTCAzNy4yMDcsOTguMzEzIEwgMjQuNzksOTguMzEzIEwgMTMuMjgzLDMwLjkyMSBMIDI1LjY1MiwzMC45MjEgWiIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzM5OWZmIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K',
    admins: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjwhLS1HZW5lcmF0b3I6IFhhcmEgRGVzaWduZXIgKHd3dy54YXJhLmNvbSksIFNWRyBmaWx0ZXIgdmVyc2lvbjogNi4wLjAuNC0tPg0KPHN2ZyBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHdpZHRoPSIxMDVwdCIgaGVpZ2h0PSIxMzUuMDAxcHQiIHZpZXdCb3g9IjAgMCAxMDUgMTM1LjAwMSI+DQogPGRlZnM+DQoJPC9kZWZzPg0KIDxnIGlkPSJEb2N1bWVudCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgZm9udC1mYW1pbHk9IlRpbWVzIE5ldyBSb21hbiIgZm9udC1zaXplPSIxNiIgdHJhbnNmb3JtPSJzY2FsZSgxIC0xKSI+DQogIDxnIGlkPSJTcHJlYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEzNS4wMDEpIj4NCiAgIDxnIGlkPSJMYXllciAxIj4NCiAgICA8cGF0aCBkPSJNIDUyLjUsMCBMIDAsMjguNTg5IEwgMCwxMDkuODQ1IEwgMTA1LDEwOS44NDUgTCAxMDUsMjguNTg5IEwgNTIuNSwwIFogTSAzMy41ODIsMzAuOTIxIEwgMzkuMDE4LDQ0LjgwMyBMIDY2LjIwNiw0NC44MDMgTCA3MS40MTcsMzAuOTIxIEwgODQuNjAyLDMwLjkyMSBMIDU4Ljk1Niw5OC4zMTMgTCA0Ni4wODgsOTguMzEzIEwgMjAuMzk4LDMwLjkyMSBMIDMzLjU4MiwzMC45MjEgWiBNIDQzLjczMiw1Ny4zMTEgTCA1Mi42MTMsODAuNDQ2IEwgNjEuNDQ4LDU3LjMxMSBMIDQzLjczMiw1Ny4zMTEgWiBNIDAsMTI0LjY4IEwgMCwxMzUuMDAxIEwgMTA1LDEzNS4wMDEgTCAxMDUsMTI0LjY4IEwgMCwxMjQuNjggWiIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlPSJub25lIiBmaWxsPSIjZmY2NjAwIiBtYXJrZXItc3RhcnQ9Im5vbmUiIG1hcmtlci1lbmQ9Im5vbmUiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K'
  };
  return ['mods', 'admins'].reduce((r, k) => r + `
.FHT_ico_${ k },
${ selector + href[k] })::before {
  content: '';
  display: inline-block;
  vertical-align: text-top;
  margin-right: .2em;
  width: 1.55ex;
  height: 2ex;
  background: center/100% no-repeat
    url('${ ico[k]}');
}
i.FHT_ico_${ k } {
  font-style: normal;
  transform: none;
}

`, '');
};


// --------------------------------------------------
// ---                FUNZIONI CSS                ---
// --------------------------------------------------

// Restituisce il CSS, applicato al selettore specificato, per una transizione preimpostata
//   [prop]: [str] proprietà aggiuntive. Se specificato, sarà aggiunto come definizione per le specifiche proprietà oltre al preset generale.
_css.transitionPreset = (selettore, prop) => selettore ? selettore + `{transition: .4s ease-out${prop ? ', ' + prop : ''} !important}` : '';

// Dato un selettore di uno o più elementi separati da virgola, appende la parte specificata ad ognuno degli elementi e restituisce il CSS elaborato
_css.aggiungiPerOgniSelettore = (selettore, part) => selettore ? selettore.replace(/(?: *(,) *)|$/g, part+'$1') : '';

// Restituisce il CSS, applicato al selettore specificato, per ottenere la scrollbar sottile
_css.scrollbarSottile = selettore => {
  return !selettore ? '' : ''+
  // Per versioni -webkit- precedenti a 121
  _css.aggiungiPerOgniSelettore(selettore,'::-webkit-scrollbar') + '{height: 8px; width: 8px; background: #0202080c}'+
  _css.aggiungiPerOgniSelettore(selettore,'::-webkit-scrollbar-thumb') + '{background: #a8a8a8a6}'+
  _css.aggiungiPerOgniSelettore(selettore,'::-webkit-scrollbar-thumb:hover') + '{background: #a8a8a8ff}'+
  _css.aggiungiPerOgniSelettore(selettore,'::-webkit-scrollbar-thumb:active') + '{background: #fa7d00b3}'+

  // Standard attuale
  selettore + ' {scrollbar-width: thin; scrollbar-color: #a8a8a8a6 #0202080c; scrollbar-gutter: stable;}';

};


// --------------------------------------------------
// ---                 INIZIAMO!                  ---
// --------------------------------------------------

_impostazioni.carica(async str => {
  // str: [str] stringa che rappresenta le impostazioni salvate

  // Se l'URL proviene da link mail corrotto, eseguo il redirect
  if(_fix.brokenLinkMail()) return;

  // Applico classi e stili
  _classeHtml('FHT-toolset', true);
  _stage.applicaCSS();

  // Attendo disponibilità elemento contenitore
  var sel = '.trends--section';
  var el = document.querySelector(sel);
  try { el = await _attendi(()=>document.querySelector(sel), 40, 200);}
  catch (err) { return; }

  // Inizializzo pulsante impostazioni
  _pannelloToolset.initPulsante(el);

  // Attendo disponibilità elemento barra utility
  sel = '.swiper-wrapper';
  el = document.querySelector(sel);
  try { el = await _attendi(()=>document.querySelector(sel), 40, 200);}
  catch (err) { return; }

  // Inizializzo sistema barre utility e applico fix scorrimento
  _utility.vars.aggiorna();
  _fix.scorrimentoBarraUtility();

  // Inizializzo posizioni scroll per elementi pannello impostazioni
  _pannelloToolset.posizioneScroll.init();

  // Se esistono, ripristino dati cronologia memorizzati in sessionStorage
  const cronologia = sessionStorage.getItem('FHT_history');
  if(cronologia) _history.set(cronologia);
  // Altrimenti aggiungo stato iniziale a cronologia
  else _history.add(str);

  if(['complete', 'interactive', 'loaded'].includes(document.readyState)){
    // Inizio subito se il DOM è già pronto (ad es. se risulta in cache)
    _stage.init();
  } else {
    // Inizio quando il DOM è pronto
    window.addEventListener('DOMContentLoaded', _stage.init, {once: true});
  }
  console.log('%c ⛭ Forum HTML.it Toolset ' + _versione + ' ', 'background: #f8e71c; color: #10121d; font-weight: bold;');
});

})();
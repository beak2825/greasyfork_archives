// ==UserScript==
// @name         Soundcloud Downloader Clean
// @namespace    https://openuserjs.org/users/webketje
// @version      1.0.0
// @description  An ad-less, multilingual, clean Soundcloud downloader with robust code. Adds a 'Download' button in the toolbar of all single track views.
// @author       webketje
// @license      MIT
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @homepageURL  https://gist.github.com/webketje/8cd2e6ae8a86dbe0533c5d2c612c42c6
// @supportURL   https://gist.github.com/webketje/8cd2e6ae8a86dbe0533c5d2c612c42c6#comments
// @noframes
// @match        https://soundcloud.com/*
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/392260/Soundcloud%20Downloader%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/392260/Soundcloud%20Downloader%20Clean.meta.js
// ==/UserScript==

/* globals saveAs */

(function() {
    'use strict';

    var win = unsafeWindow || window;
    var containerSelector = '.soundActions.sc-button-toolbar .sc-button-group';

    var scdl = {
      debug: false,
      client_id: '',
      dlButtonId: 'scdlc-btn',
      modalId: 'scdl-third-party-modal'
    };

    var labels = ({
      en: {
        download: 'Download',
        downloading: 'Downloading',
        copy: 'Copy',
        copy_success: 'Copied to clipboard',
        copy_failure: 'Failed to copy to clipboard!',
        close: 'Close',
        modal_title: 'could not download this track. Use one of these third-party services instead?'
      },
      es: {
        download: 'Descargar',
        downloading: 'Descargando..',
        copy: 'Copiar',
        copy_success: 'Copiada al portapapeles',
        copy_failure: '¡No se pudo copiar al portapapeles!',
        close: '',
        modal_title: 'no se pudo descargar esta banda sonora. ¿Utilizar uno de estos servicios de terceros en su lugar?'
      },
      fr: {
        download: 'Télécharger',
        downloading: 'Téléchargement..',
        copy: 'Copier',
        copy_success: 'Copié dans le presse-papiers!',
        copy_failure: 'Échec de la copie dans le presse-papiers !',
        close: 'Fermer',
        modal_title: 'ne peut pas télécharger ce fichier. Utiliser l’un de ces services tiers ?'
      },
      nl: {
        download: 'Downloaden',
        downloading: 'Downloaden..',
        copy: 'Kopiëren',
        copy_success: 'Naar klembord gekopieerd!',
        copy_failure: 'Kopiëren naar klembord mislukt!',
        close: 'Sluiten',
        modal_title: 'kon dit bestand niet downloaden. Een van deze externe diensten gebruiken?'
      },
      de: {
        download: 'Herunterladen',
        downloading: 'Herunterladen..',
        copy: 'Kopieren',
        copy_success: 'In die Zwischenablage kopiert',
        copy_failure: 'Kopieren in die Zwischenablage fehlgeschlagen!',
        close: 'Schließen',
        modal_title: 'konnte diesen Sound nicht herunterladen. Nutzen Sie stattdessen einen dieser Drittanbieterdienste?'
      },
      pl: {
        download: 'Ściągnij',
        downloading: 'Ściąganie..',
        copy: 'Kopiuj',
        copy_success: 'Skopiowano do schowka',
        copy_failure: 'Nie udało się skopiować do schowka!!',
        close: 'Zamknij',
        modal_title: 'nie udało się pobrać tego utworu. Zamiast tego skorzystać z jednej z usług stron trzecich?'
      },
      it: {
        download: 'Scaricare',
        downloading: 'Scaricando..',
        copy: 'Copia',
        copy_success: 'Copiato negli appunti',
        copy_failure: 'Impossibile copiare negli appunti!',
        close: 'Chiudi',
        modal_title: 'non è stato possibile scaricare questo suono. Utilizzi invece uno di questi servizi di terze parti?'
      },
      pt_BR: {
        download: 'Baixar',
        downloading: 'Baixando..',
        copy: 'Copiar',
        copy_success: 'Copiado para a área de transferência',
        copy_failure: 'Falha ao copiar para a área de transferência!!',
        close: 'Fechar',
        modal_title: 'não foi possível baixar este som. Usar um desses serviços de terceiros?'
      },
      sv: {
        download: 'Ladda ner',
        downloading: 'Laddar ner..',
        copy: 'Kopiera',
        copy_success: 'Kopierat till urklipp',
        copy_failure: 'Det gick inte att kopiera till urklipp!',
        close: 'Stäng',
        modal_title: 'han kunde inte ladda ner det här ljudet. Använd någon av dessa tredjepartstjänster istället?'
      }
    })[document.documentElement.lang || 'en']

    /**
    *   @desc Log to console only if debug is true
    */
    function log() {
      var stamp  = new Date().toLocaleString(),
          args   = [].slice.call(arguments),
          prefix = ['SCDLC', stamp, '-'].join(' ');
      if (scdl.debug) console.log.apply(console, [prefix + args[0]].concat(args.slice(1)));
    };

    /**
    *   @desc There is no other way to retrieve a Soundcloud client_id than by spying on existing requests.
    *         We temporarily patch the XHR.send method to retrieve the url passed to it.
    *   @param restoreIfTrue - restores the original prototype method when true is returned
    *   @param onRestore - a function to exec when the restoreIfTrue condition is met
    */
    function patchXHR(restoreIfTrue, onRestore) {
      var originalXHR = win.XMLHttpRequest.prototype.open;

      win.XMLHttpRequest.prototype.open = function() {
        originalXHR.apply(this, arguments);
        var restore = restoreIfTrue.apply(this, arguments);
        if (restore) {
          win.XMLHttpRequest.prototype.open = originalXHR;
          onRestore(restore);
        }
      };
    };

    scdl.getTrackName = function(trackJSON) {
      return [
        trackJSON.user.username,
        trackJSON.title
      ].join(' - ');
    };

    scdl.getMediaURL = function(json, onresolve, onerror) {
      if (json.media && json.media.transcodings) {
        var found = json.media.transcodings.filter(function(tc) {
          return tc.format && tc.format.protocol === 'progressive';
        })[0];
        if (found) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            var result;
            try {
              result = JSON.parse(xhr.responseText);
            } catch (err) {}
            if (result && result.url)
              onresolve(result.url);
            else
              onerror(false);
          };
          xhr.onerror = onerror;
          xhr.open('GET', found.url + '?client_id=' + scdl.client_id);
          xhr.send();
        } else {
          onerror(false);
        }
      } else {
        onerror(false);
      }
    };

    scdl.getStreamURL = function(url, onresolve, onerror) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var trackJSON = JSON.parse(xhr.responseText);
        scdl.getMediaURL(trackJSON, function resolve(url) {
          onresolve({
            stream_url: url,
            track_name: scdl.getTrackName(trackJSON)
          });
        }, function reject() {
          onerror(false);
        })
      }.bind(this);
      xhr.onerror = function() {
        onerror(false);
      };
      xhr.open('GET', 'https://api-v2.soundcloud.com/resolve?url=' + encodeURIComponent(url) + '&client_id=' + this.client_id);
      xhr.send();
    };

    scdl.button = {
      download: function(e) {
        e.preventDefault();
        var dlButton = document.getElementById(scdl.dlButtonId)
        if (dlButton) {
          dlButton.textContent = labels.downloading;
        }
        setTimeout(function() {
          saveAs(e.target.href, e.target.dataset.title);
          if (dlButton) {
            dlButton.textContent = labels.download;
          }
        }, 100)
      },
      render: function(href, title, onClick) {
        var label = labels.download;
        var a = document.createElement('a');
        a.className = "sc-button sc-button-medium sc-button-responsive sc-button-download";
        a.href = href;
        a.id = scdl.dlButtonId;
        a.textContent = label;
        a.title = label;
        a.dataset.title = title + '.mp3';
        a.setAttribute('download', title + '.mp3');
        a.target = '_blank';
        a.onclick = onClick;
        a.style.marginLeft = '5px';
        a.style.cssFloat = 'left';
        a.style.border = '1px solid orangered';
        return a;
      },
      attach:function() {
        var args = arguments, self = this, iterations = 0

        // account for rendering delays
        var intv = setInterval(function() {
          var f = document.querySelector(containerSelector)
          iterations++
          if (f && !document.getElementById(scdl.dlButtonId)) {
            f.insertAdjacentElement('beforeend', self.render.apply(self, args));
            log('Attaching download button to element:', f)
            clearInterval(intv)
          // stop after trying to find the element for 5s
          } else if (iterations === 50) {
            log('%c Couldn\'t find element "' + containerSelector + '" after 2 seconds', 'color: #FF0000;')
            clearInterval(intv)
          }
        }, 100)
      },
      remove: function() {
        var btn = document.getElementById(scdl.dlButtonId);
        if (btn)
          btn.parentNode.removeChild(btn);
      }
    };

    scdl.modal = {
      providers: [
        'aHR0cHM6Ly9zY2xvdWRkb3dubG9hZGVyLm5ldA==',
        'aHR0cHM6Ly93d3cuc291bmRjbG91ZG1wMy5vcmc=',
        'aHR0cHM6Ly9zb3VuZGNsb3VkbWUuY29t'
      ],
      render: function(title) {
        var temp = document.createElement('div'), self = this
        const html = [
          '<div class="modal g-z-index-modal-background g-opacity-transition g-z-index-overlay modalWhiteout showBackground g-backdrop-filter-grayscale" style="outline: none; padding-right: 0px; display: flex; justify-content: center;" tabindex="-1" id="scdl-third-party-modal">',
          '<div class="modal__modal sc-border-box g-z-index-modal-content transparentBackground" style="height: auto;">',
          '<button type="button" title="' + labels.close + '" class="modal__closeButton">' + labels.close + '</button>',
          '<div class="modal__content"><div class="tabs"><div class="tabs__content"><div class="tabs__contentSlot" style="display: block;"><article class="shareContent">',
          '<div class="publicShare"><section class="g-modal-section sc-clearfix sc-pt-2x">',
          '<h2 class="sc-orange">Soundcloud Downloader Clean ' + labels.modal_title + '</h2>',
          '</section><section class="g-modal-section sc-clearfix sc-pt-2x">',
          '<h3 style="margin-bottom: 0.5rem;">' + labels.download + ' <em>' + title + '</em> via: </h3>',
          this.providers.map(p => ['<div><a href="', win.atob(p), '" target="_blank" style="display: inline-block; font-size: 14px; padding: 0.25rem 0;">', win.atob(p), '</a></div>'].join('')).join(''),
          '<div class="shareLink sc-clearfix publicShare__link sc-pt-2x m-showPositionOption" style="margin-top: 1rem;">',
            '<label for="shareLink__field" style="margin-right:0.5rem;">Link</label>',
            '<input type="text" value="' + win.location.href + '" class="shareLink__field sc-input" id="shareLink__field" readonly="readonly">',
            '<button class="sc-button sc-button-copy">' + labels.copy + '</button>',
            '<span class="sc-copy-feedback" style="margin-left: 1rem;"></span>',
          '</div>',
          '</section></div></article></div></div></div></div></div></div>'
        ].join('')
        temp.innerHTML = html
        var cnt = temp.firstElementChild
        cnt.addEventListener('click', function(e) {
          if (this === e.target || e.target.classList.contains('modal__closeButton')) {
            self.remove()
          } else if (e.target.classList.contains('sc-button-copy')) {
            navigator.clipboard.writeText(win.location.href)
              .then(function() {
                var f = cnt.querySelector('.sc-copy-feedback')
                f.innerHTML = '<span style="color: green;">Copied to clipboard!</span>'
              }, function(err) {
                log('Failed to write URL to the clipboard.', err)
                var f = cnt.querySelector('.sc-copy-feedback')
                f.innerHTML = '<span style="color: red;">Failed to copy to clipboard!</span>'
              })
          }
        })
        return cnt
      },
      attach: function() {
        this.remove()
        document.body.appendChild(this.render.apply(this, arguments))
      },
      remove: function() {
        var modal = document.getElementById(scdl.modalId);
        if (modal)
          modal.parentNode.removeChild(modal);
      }
    }

    scdl.parseClientIdFromURL = function(url) {
      var search = /client_id=([\w\d]+)&*/;
      return url && url.match(search) && url.match(search)[1];
    };

    scdl.getClientID = function(onClientIDFound) {
      patchXHR(function(method, url) {
        return scdl.parseClientIdFromURL(url);
      }, onClientIDFound);
    };

    scdl.load = function(url) {
      // for now only make available for single track pages
      if (/^(\/(you|stations|discover|stream|upload|search|settings|.+?\/sets))/.test(win.location.pathname)) {
        scdl.button.remove();
        return;
      }

      scdl.getStreamURL(url,
        function onSuccess(result) {
          if (!result) {
            scdl.button.remove();
          } else {
            log('Detected valid Soundcloud artist track URL. Requesting info...');
            scdl.button.attach(
              result.stream_url,
              result.track_name,
              scdl.button.download
            );
          }
        },
        function onError() {
          log('%c No compatible media transcoding found.', 'color: #FF0000;');
          scdl.button.attach('javascript:void(0);', 'None', function() {
            var title = document.querySelector('.soundTitle__title')
            var artist = document.querySelector('.soundTitle__username')
            scdl.modal.attach([artist.textContent.trim(), '-', title.textContent.trim()].join(' '))
          })
        }
      );
    };

    // patch front-end navigation
    ['pushState','replaceState','forward','back','go'].forEach(function(event) {
      var tmp = win.history.pushState;
      win.history[event] = function() {
        tmp.apply(win.history, arguments);
        scdl.load(win.location.href);
      }
    });
    if (scdl.debug) win.scdl = scdl;
    scdl.getClientID(function(id) {
      log('Found Soundcloud client id:', id, '. Initializing...');
      scdl.client_id = id;
      scdl.load(win.location.href);
    });
})();
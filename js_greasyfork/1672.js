// ==UserScript==
// @name TW-Collections-DE Translation
// @namespace https://greasyfork.org/users/2196
// @author Hanya (updated by Tom Robert)
// @description German (Deutsch) Translation - TW-Collections (Hanya & Tom Robert)
// @include http*://*.the-west.*/game.php*
// @version 1.2.0
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/1672/TW-Collections-DE%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/1672/TW-Collections-DE%20Translation.meta.js
// ==/UserScript==
(function (e) {
  var t = document.createElement('script');
  t.type = 'application/javascript';
  t.textContent = '(' + e + ')();';
  document.body.appendChild(t);
  t.parentNode.removeChild(t);
}) 
(function () {
  if (window.location.href.indexOf('.the-west.') > 0) {
    TWT_ADDLANG = {
      translator: 'Hanya & Tom Robert',
      idscript: '1672',
      version: '1.2.0',
      short_name: 'de',
      name: 'Deutsch',
      translation: {
        description: '<center><BR /><b>TW-Collections</b><br>Zeigt fehlende Items für die Sammlererfolge<br>Liste der fehlenden Sammleritems und Set-Items<br>Bankgebühren bei Mouseover<br>Verschiedene Shortcuts<br>Löschung von allen markierten Berichten<br>Gebühren bei Bank-Überweisungen<br>Zusätzliche Button im Inventar (Dublikate, Verbrauchbare, Rezepte, Sets) <br>etc ...',
        Options: {
          tab: {
            setting: 'Einstellungen'
          },
          checkbox_text: {
            box: {
              title: 'Funktionen / Menüs',
              options: {
                goHome: 'Zur eigenen Stadt gehen',
                goToDaily1: 'Geisterstadt',
                goToDaily2: 'Waupees Indianerdorf ',
                ownSaloon: 'Saloon öffnen',
                openMarket: 'Markt öffnen',
                mobileTrader: 'Fahrender Händler öffnen',
                forum: 'Forum öffnen',
                listNeeded: 'Fehlende Sammelitems'
              }
            },
            collection: {
              title: 'Sammlungen',
              options: {
                gereNewItems: 'Fehlende, neue Items trotz abgeschlossenem Erfolg markieren',
                patchsell: 'Hinweis für fehlende Items im Inventar',
                patchtrader: 'Hinweis für fehlende Items beim fahrenden Händler',
                patchmarket: 'Hinweis für fehlende Items auf dem Markt',
                showmiss: 'Liste der fehlenden Items bei Mouseover anzeigen',
                filterMarket: 'Marktfilter: Zeige nur fehlende Items (Sammlungen)'
              }
            },
            inventory: {
              title: 'Buttons im Inventar',
              options: {
                doublons: 'Button für Duplikat-Suche hinzufügen',
                useables: 'Button für verbrauchbare Items-Suche hinzufügen',
                recipe: 'Button für Rezept-Suche hinzufügen',
                sets: 'Button für Anzeigen von Sets hinzufügen',
                sum: 'Zeige Verkaufssumme (nach VK)'
              }
            },
            miscellaneous: {
              title: 'Sonstiges',
              options: {
                lang: 'Übersetzungen',
                logout: 'Logout-Button hinzufügen',
                deleteAllReports: 'Alle Berichte löschen hinzufügen',
                showFees: 'Bankgebühren bei Mouseover anzeigen',
                popupTWT: 'Menü von TW Collections bei Mouseover anzeigen'
              }
            },
            craft: {
                title: 'Crafting',
                options: {
                  filterMarket: 'Symbol, um Craftingprodukt auf dem Markt zu suchen',
                  filterMiniMap: 'Symbol, um Arbeit des Craftingprodukts auf der Minimap zu zeigen'
                }
              },
            twdbadds: {
              title: 'Clothcalc Add-on',
              options: {
                filterBuyMarket: 'Marktfilter: Zeige nur fehlende Items <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>'
              }
            }
          },
          message: {
            title: 'Information',
            message: 'Einstellungen wurden übernommen.',
            reloadButton: 'Seite neu laden',
            gameButton: 'Zurück zum Spiel',
            indispo: 'Einstellung nicht möglich (Sammlungen abgeschlossen oder Skript nicht verfügbar)',
            more: 'Mehr?',
            moreTip: 'Übersetzungs-Tab öffnen'
          },
          update: {
            title: 'TW-Collections Update',
            upddaily: 'Jeden Tag',
            updweek: 'Jede Woche',
            updnever: 'Niemals',
            checknow: 'Jetzt nach Updates suchen?',
            updok: 'TW-Collections ist auf dem neuesten Stand',
            updlangmaj: 'Ein Update ist für eine oder mehrere Sprachen für TW-Collections verfügbar.<br>Klick auf die Links um zu aktualisieren.',
            updscript: 'Es ist ein Update von TW-Collections verfügbar.<br/>Aktualisieren?',
            upderror: 'Kann nicht aktualisiert werden. Installiere das Script oder die Sprache bitte manuell.'
          },
          saveButton: 'Speichern'
        },
        Craft: {
            titleMarket: 'Dieses Item auf dem Markt suchen',
            titleMinimap: 'Zugehörige Arbeit auf der Minimap finden'
          },
        ToolBox: {
          title: 'TW-Collections',
          list: {
            openOptions: 'Einstellungen'
          }
        },
        Doublons: {
          tip: 'Nur Duplikate anzeigen',
          current: 'Laufende Suche',
          noset: 'Keine Set-Items',
          sellable: 'Verkaufbare',
          auctionable: 'Auktionierbare',
          tipuse: 'Nur Verbrauchbare anzeigen',
          tiprecipe: 'Nur Rezepte anzeigen',
          tipsets: 'Sets anzeigen',
          sellGain: '$ Verkaufswert'
        },
        Logout: {
          title: 'Logout'
        },
        AllReportsDelete: {
          button: 'Alle löschen',
          title: 'Alle Berichte löschen',
          work: 'Arbeit',
          progress: 'Fortschritt',
          userConfirm: 'Benutzer bestätigen',
          loadPage: 'Seite laden',
          deleteReports: 'Berichte löschen',
          confirmText: 'Alle Berichte löschen - Bist du sicher?',
          deleteYes: 'Ja, löschen',
          deleteNo: 'Nein, nicht löschen',
          status: {
            title: 'Status',
            wait: 'Warten',
            successful: 'Erfolgreich',
            fail: 'Fehlgeschlagen',
            error: 'Fehler'
          }
        },
        fees: {
          tipText: '%1% Gebühren: $%2'
        },
        twdbadds: {
          buyFilterTip: 'Nur fehlende Items anzeigen',
          buyFilterLabel: 'Fehlende Items'
        },
        collection: {
          miss: 'Fehlt: ',
          colTabTitle: 'Sammlungen',
          setTabTitle: 'Sets',
          thText: '%1 Item%2 fehlen',
          thEncours: 'Du hast ein Gebot für dieses Item abgegeben',
          thFetch: 'Du kannst dieses Item auf dem Markt von %1 abholen',
          allOpt: 'Alles',
          collectionFilterTip: 'Nur Sammler-Items anzeigen',
          collectionFilterLabel: 'Nur Sammlungen',
          select: 'Wähle >>',
          listText: 'Items, die noch für eine Sammlung benötigt werden',
          listSetText: 'Items, die bei einem Set noch fehlen',
          filters: 'Filter',
          atTrader: 'Momentan verfügbare Items beim fahrenden Händler',
          atBid: 'Laufende Gebote',
          atCurBid: 'Beendete Gebote',
          atTraderTitle: 'Verkäufliche Items beim fahrenden Händler anzeigen',
          atBidTitle: 'Laufende Gebote anzeigen',
          atCurBidTitle: 'Abholbare Items auf dem Markt anzeigen',
          searchMarket: 'Auf dem Markt suchen',
          patchsell: {
            title: 'Fehlende Items für diese Sammlung'
          }
        }
      },
      // DO NOT CHANGE BELOW THIS LIGNE
      init: function () {
        var that = this;
        if (typeof window.TWT == 'undefined'
        || window.TWT == null) {
          EventHandler.listen('twt.init', function () {
            TWT.addPatchLang(that);
            return EventHandler.ONE_TIME_EVENT; // Unique
          });
        } else {
          EventHandler.signal('twt_lang_started_'
          + that.short_name);
          TWT.addPatchLang(that);
        }
      }
    }.init();
  }
});
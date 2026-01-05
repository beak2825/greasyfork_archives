// ==UserScript==
// @name        Animeforce premium
// @description Permette di godere in maniera ottimale della piattaforma Animeforce, skippando alcune pagine intermedie e avendo il download diretto delle puntate
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     http://*.animeforce.org/*
// @include     https://*.animeforce.org/*
// @homepageURL    https://greasyfork.org/it/scripts/25912-animeforce-premium
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/372499-bootstrap-tooltip-js-v2-3-2/code/bootstrap-tooltipjs%20v232.js?version=631225
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.user.js
// @version     2.4.6
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @icon           https://www.maxeo.net/imgs/icon/greasyfork/animeforcePremium.png
// @downloadURL https://update.greasyfork.org/scripts/25912/Animeforce%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/25912/Animeforce%20premium.meta.js
// ==/UserScript==

function AFP_index() {
  var $ = jQuery;
  var AFPremium = {
    menu: {
      functions: {
        addPremiumMenu: {
          enable: true,
          title: "Aggiungi menu premium",
          description: "Aggiunge il menu premium nelle pagine non di streaming",
          warning: "Disabilitando questa voce sarà necessario andare su https://ww1.animeforce.org/premium per per modificare le impostazioni"
        },
        animeDownloadIstant: {
          enable: true,
          title: "Download istantaneo",
          description: "Aggiunge il download istantaneo nella lista degli episodi dell'anime",
          dependances: ['removeAdflyInPageAnime'],
        },
        decreaseAD: {
          enable: true,
          title: "DecreaseAD",
          description: "Riduce la pubblicità nel sito. Senza che sia necessario l'utilizzo di AdBlock o simili.",
        },
        dontBlocADblock: {
          enable: true,
          title: "Non bloccare AdBlock",
          description: "Su alcune pagine AdBlock non verrà 'bloccato'",
        },
        linkDirettoHomePage: {
          enable: true,
          title: "Link diretto in HomePage",
          description: "Nella homepage i link agli episodi saranno diretti <br> PS. Pagine secondarie non ancora supportate",
          dependances: ['loadAnimeList'],
        },
        miglioraUtilizzoMenu: {
          enable: true,
          title: "Menu percettivo",
          description: 'Il menu principale apparirà ogni volta che si passa il mouse sulla barra dei menu',
        },
        premiumSearchHomePage: {
          enable: true,
          title: "Ricerca Anime in homepage",
          description: 'Nella homepage sarà possibile utilizzare il form di ricerca per cercare direttamente dalla lista degli episodi',
          dependances: ['loadAnimeList'],
        },
        searchInList: {
          enable: true,
          title: "Ricerca aggiuntiva nelle liste",
          description: "In 'lista episodi' e 'Anime in corso' aggiunge una ricerca testuale",
        },
      },

    },
    cvar: {},
    customElements: {
      afphechbox: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;width: 30px;height: 30px;border: 2px solid #000;" xml:space="preserve"><path style="fill:none;stroke:#000000;stroke-dashoffset: 73px;stroke-width: 6px;transition: 1s cubic-bezier(.63,.41,.04,.61);" d="M14.8,58.5c0,0,13.9,23.7,21.8,28.9c7.9,5.2,48.6-75.1,48.6-75.1"></path></svg>'
    },
    pagetype: undefined,
    logs: 1,
    loadPageType: function () {
      if ($('body').hasClass('home')) {
        this.setPageType('home')
      } else
      if ($('body').hasClass('error404')) {
        if (location.pathname == '/premium') {
          this.setPageType('premium-menu')
        } else {
          this.setPageType('error404')
        }
      } else if (($('body').attr('class') == undefined || $('body').attr('class') == '') && $('#menu-menu-2').length == 0) {
        this.setPageType('streaming-page')
      } else if ($('body').hasClass('single-post')) {
        if ($('table img[src="/DDL/download.png"], table img[src="/DDL/streaming.png').length) {
          this.setPageType('episode-list')
        } else {
          this.setPageType('episode-preview')
        }
      } else if (location.pathname == '/lista-anime/' || location.pathname == '/lista-anime-in-corso/') {
        this.setPageType('lista-anime');
      } else if ($('body').hasClass('archive')) {
        this.setPageType('archive');
      } else if (location.pathname == '/lista-anime-hentai/') {
        this.setPageType('hentai');
      }

      return this.pagetype;
    },
    setPageType: function (pagename) {
      this.pagetype = pagename;
    },
    getPageType: function () {
      return this.pagetype;
    },
    executeFunctionality: function (funct_name) {
      var dependenceLoaded = [];
      for (var index in arguments) {
        this.fComponents.loadAnimeList();
        if (this.menu.functions[arguments[index]].dependances != undefined) {
          var requiredF = this.menu.functions[arguments[index]].dependances;
          for (var subindex in requiredF) {
            if (!(dependenceLoaded.indexOf(requiredF[subindex]) + 1)) {
              dependenceLoaded.push(requiredF[subindex])
              this.fComponents[requiredF[subindex]]();

            }
          }
        }

        if (this.menu.functions[arguments[index]].enable) {
          this.functionalities[arguments[index]]();
        }

      }
    },
    loadFunctionalities: function () {
      //Eseguo dipendenze
      for (var index in this.requiredFuntions) {
        this.requiredFuntions[index]();
      }

      //funzionalità globali
      this.executeFunctionality('decreaseAD', 'miglioraUtilizzoMenu');


      //funzionalità specifiche
      switch (this.getPageType()) {
        case 'home':
          this.executeFunctionality('addPremiumMenu', 'premiumSearchHomePage', 'linkDirettoHomePage');
          break;
        case 'premium-menu':
          this.functionalities.premiumMenu();
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'episode-list':
          this.executeFunctionality('addPremiumMenu', 'animeDownloadIstant');
          break;
        case 'episode-preview':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'lista-anime':
          this.executeFunctionality('addPremiumMenu', 'searchInList');
          break;
        case 'archive':
          this.executeFunctionality('addPremiumMenu', 'searchInList');
          break;
        case 'hentai':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'error404':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'streaming-page':
          this.executeFunctionality('dontBlocADblock');
          break;
        default:

      }
    },
    functionalities: {
      /*
       * Aggiunge il menu premium alle pagine
       */
      addPremiumMenu: function () {
        $('#menu-menu-2').append('<li class="menu-item"><a href="/premium">Menu Premium</a></li>')
      },
      decreaseAD: function () {
        /***  PAGINA DI STREAMING   ***/
        if (AFPremium.getPageType() == 'streaming-page') {
          var disableFunction = setInterval(function () {
            if ($("body > center + *").length) {
              $('footer').remove();
              while ($("body > center + *").length) {
                $("body > center + *").remove();
              }
            }
          }, 300)

        } else {
          /***  PAGINE NON DI STREAMING   ***/
          $('[style^="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 2147483647;"]')
                  .attr('style', "position:fixed;right:200vw")
                  .css('display', 'none')
          $('.tp-loader').remove()
          $('#menu-menu-2 a').each(function () {
            $(this).attr('href', $(this).attr('href').replace('//adf.ly/16031519', ''))
          })
          $('.widget-unwrapped iframe').parent().addClass('fb-container').removeClass('widget-unwrapped')
          $('.widget-unwrapped').remove()
          if (AFPremium.getPageType() == 'episode-list') {
            $('.code-block.code-block-3').remove();
          }

        }
      },
      dontBlocADblock: function () {
        var disableFunction = setInterval(function () {
          if ($('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').length) {
            $('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').remove();
            clearInterval(disableFunction);
          }
        }, 300);

      },
      searchInList: function () {
        var src_input = '<input id="filtro" type="text" placeholder="Scrivi qui per cercare tra gli anime" style="width: 100%">'
        $('.the-content p').eq(0).append(src_input);
        $('#filtro').on('keyup', function () {
          if ($('#filtro').val().length >= 1) {
            $('.the-content h2').css('display', 'none');
            $('.the-content').find('li').each(function () {
              if ($(this).is(':icontains(\'' + $('#filtro').val() + '\')'))
                $(this).css('display', '');
              else
                $(this).css('display', 'none');
            });
          } else {
            $('.the-content li,.the-content h2').css('display', '');
          }
        });
      },
      miglioraUtilizzoMenu: function () {
        if (AFPremium.getPageType() != 'streaming-page') {
          $('#menu-menu-2 .sub-menu').css('display', 'none')
          $('#menu-menu-2').on('mouseover', function () {
            $('#menu-menu-2 #menu-item-21035 .sub-menu').css('display', 'block').css('visibility', 'visible')
          })
          $('#menu-menu-2').on('mouseout', function () {
            $('#menu-menu-2 .sub-menu').css('display', 'none')
          })
        }
      },
      animeDownloadIstant: function () {
        $('body').append('<div class="w8-afp-download" style="position: fixed;right: 0;top: 0;background: rgba(0, 120, 255, 0.63);padding: 18px;z-index: 3000;color: #FFF;font-size: 20px;text-align: right;font-family: Verdana;">Analizzo la pagina per il download diretto.<br>Attendere...</div>')
        if ($('img[src="/DDL/download.png"]').length) {
          var animeDownloadIstantInt = setInterval(function () {
            if (AFPremium.cvar.adflyRemoveUpdated != undefined && AFPremium.cvar.adflyRemoveUpdated == true) {
              var url = 'https:' + $('img[src="/DDL/download.png"]').eq(0).parent().attr('href');
              $.get('//url-redirect.maxeo.net/?url=' + encodeURI(url), function (data) {
                if (data.length > 12) {
                  var filecode = url.match(/\?file=(.*)/)[1];
                  var longData = data.match(/file=(.*)/)[1].substr();
                  var basedata = longData.substr(0, longData.indexOf(filecode))
                  $('img[src="/DDL/download.png"]').each(function () {
                    url = $(this).parent().attr('href');
                    var filecode = url.match(/\?file=(.*)/);
                    if (filecode != null && filecode.length >= 2) {
                      filecode = filecode[1];
                      var downloadLink = 'http://' + basedata + filecode;
                      $(this).parent().attr('href', downloadLink)
                    } else {
                      var piano_b = $(this).parents('tr').eq(0).find('td strong').eq(0).html().replace(/ <span.*$/, '').match(/[0-9]*$/);
                      if (piano_b.length && piano_b[0].length) {
                        //console.log('PIANO B');
                        piano_b = piano_b[0] + '';
                        if (piano_b.length == 1) {
                          piano_b = '0' + piano_b;
                        }
                        var newLong = longData.match(/(.*\_)([0-9]{1,})\_(.*)$/);
                        if (newLong != null) {
                          var downloadLink = 'http://' + newLong[1] + piano_b + '_' + newLong[3];
                          $(this).parent().attr('href', downloadLink)
                        }

                      }

                    }
                  })
                  $('.w8-afp-download').remove();

                }
              });
              clearInterval(animeDownloadIstantInt);
            }
          }
          , 100)
        } else {
          $('.w8-afp-download').remove();
        }

      },
      premiumSearchHomePage: function () {
        var animeList = AFPremium.cvar.animeList;

        $('#searchform input[type="text"]').on('keyup', function () {
          var animeList = AFPremium.cvar.animeList;
          if ($(this).val().length > 2) {
            var positionBox = $('#searchform input').offset()
            var input_ricerca = $('#searchform input')
            var listaRisultati = [];
            if (!$('#box_di_ricerca').length) {
              $('body').append('<div class="box-di-ricerca" id="box_di_ricerca"></div>')
              $('#box_di_ricerca')
                      .css('width', input_ricerca.width())
                      .css('top', (positionBox.top + 10 + input_ricerca.height()) + 'px')
                      .css('left', (positionBox.left + 10) + 'px')
                      .css('position', 'absolute')
                      .css('background', '#FFF')
                      .css('z-index', 10000);
            }
            $('#box_di_ricerca').html('<ul style="list-style: none;margin: 0;"></ul>');
            for (var index in animeList) {
              if (animeList[index].name.toUpperCase().indexOf($(this).val().toUpperCase()) + 1 > 0) {
                listaRisultati.push(animeList[index]);
              }
            }
            for (var index in listaRisultati) {
              $('#box_di_ricerca ul').append('<li style="padding: 4px;background: #009cff;margin: 2px 0;font-family: Verdana;"><a href="' + listaRisultati[index].link + '">' + listaRisultati[index].name + '</a></li>');
            }

          }
        })

        $('body').on('click', 'div', function () {
          if (!$(this).hasClass('box_di_ricerca')) {
            $('#box_di_ricerca').remove();
          }
        })


      },
      linkDirettoHomePage: function () {
        var linkDirettoInt = setInterval(function () {
          if (AFPremium.cvar.animeList != undefined) {
            $('.main-loop-inner .panel-wrapper a').each(function () {
              var search = $(this).attr('href').match(/(.*)(episodio(-[0-9]{1,}){1,}-)/)
              if (search != null && search.length >= 2) {
                search = search[1];
                var res = AFPremium.functionalities.searchInAnimelist(search, 'link');
                if (res != false) {
                  $(this).attr('href', res).addClass('fixed-link-afp');
                }
              }
            })
            clearInterval(linkDirettoInt);
          }
        }, 100)
      },

      searchInAnimelist: function (what, type_search) {
        type_search = type_search = undefined ? 'link' : type_search;
        var animeList = AFPremium.cvar.animeList;
        for (var index in animeList) {
          if (animeList[index][type_search].indexOf(what) + 1) {
            return (animeList[index])[type_search]
          }
        }
        return false

      },
      premiumMenu: function () {
        var slug = $('.sortbar-title')
        var h1 = $('.main-content h1')
        var mainContent = $('.main-content')
        var searchBox = $('.form-search');

        $('body').append('<style>input:checked + svg > path {stroke-dasharray: 200,200;}input + svg > path {stroke-dasharray: 70,200;}</style>')

        if (!$('.content-premium').length) {
          mainContent.append('<div class="content-premium"></div>')
        }
        var contentPremium = $('.content-premium');
        slug.html('Menu Premium')
        h1.html('Impostazioni Premium')
        searchBox.find('input[type="text"]').attr('placeholder', 'Cerca tra le impostazioni')
        searchBox.on('submit keyup', function (e) {
          e.preventDefault()
          $('.content-premium > label').each(function () {
            if ($(this).is(':icontains(\'' + searchBox.find('input[type="text"]').val() + '\')'))
              $(this).css('display', 'flex');
            else
              $(this).css('display', 'none');
          });
        })
        var docFunction = AFPremium.menu.functions;
        var formAFP = "";


        /**   Funzionalità da abilitare/disabilitare   **/
        formAFP += "<h2>Funzionalità</h2>"
        formAFP += '<div class="afp-funct">'
        for (var funxtion_name in docFunction) {
          var labW = docFunction[funxtion_name].warning == undefined ? '' : 'ATTENZIONE: ' + docFunction[funxtion_name].warning;
          formAFP += '<label style="display: flex"><input name="' + funxtion_name + '" style="display:none" type="checkbox"' + (docFunction[funxtion_name].enable ? ' checked=""' : '') +
                  ' name="' + funxtion_name + '">' + AFPremium.customElements.afphechbox +
                  ' <p data-html="true" data-toggle="tooltip" ' +
                  ' data-title="' + docFunction[funxtion_name].description + '" ' +
                  ' data-warning="' + labW + '" ' +
                  ' style="font-size: 18px;margin: 7px;padding: 0;">' +
                  docFunction[funxtion_name].title +
                  '</p></label>';
        }
        formAFP += '</div>'

        contentPremium.html(formAFP);


        $('[data-toggle="tooltip"]').each(function () {
          var dataTooltip = $(this).data('title');
          if ($(this).data('warning').length) {
            dataTooltip += '<br><br><span style="background:red">' + $(this).data('warning') + '</span>';
          }
          $(this).tooltip({'title': dataTooltip, 'placement': 'top'});

        })

        $('.afp-funct input').on('change', function () {
          AFPremium.updateSettings($(this).attr('name'), $(this).is(':checked'))
        })



      },

    },
    fComponents: {
      loadAnimeList: function () {
        var animeList = AFPremium.cvar.animeList;
        $.get('https://ww1.animeforce.org/lista-anime/').done(function (data) {
          var bxcontainer = data.match(/(\<div\ class\=\"the\-content\"\>.*(.*\n)*\<script\ type=\"text\/javascript\"\>)+/g) [0]
          bxcontainer = bxcontainer.match(/\<li\>\<strong\>\<a\ href=.*\<\/a\>/g)
          animeList = [
          ];
          for (var index in bxcontainer) {
            var link = bxcontainer[index].match(/.*">/)[0].match(/\".*\//)[0].replace(/\"/g, '')
            var nameAnime = bxcontainer[index].match(/\"\>.*Sub Ita/i)[0].replace(/\"|\/|\>|\</g, '').replace(/\ Sub\ Ita/i)

            animeList.push({'name': nameAnime, 'link': link})
          }
          AFPremium.cvar.animeList = animeList;
        })
      },
      removeAdflyInPageAnime: function () {
        $.get('#').done(function (data) {
          $('table[style="width: 100%;"]').html(data.match(/\<table\ style\=\"width\:\ 100\%\;\"\>\n(.*\n)*\<\/tbody\>\n<\/table>/)[0])
          AFPremium.cvar.adflyRemoveUpdated = true
        })
      },
    },
    requiredFuntions: {
      /*
       * Funzione necessaria per ricercare in modo incase sensitive
       * 
       */
      icontainsJQuery: function () {
        jQuery.expr[':'].icontains = function (a, i, m) {
          return jQuery(a).text().toUpperCase()
                  .indexOf(m[3].toUpperCase()) >= 0;
        };
      },
      /*
       * Risolve errori interni al sito 
       * 
       */
      jQueryAFfix: function () {
        jQuery.easing[0] = function () {}
        jQuery.easing.def = 0;
        jQuery.timer = 0;
        (function ($) {
          $.fn.jflickrfeed = function () {};
          $.fn.tabs = function () {};
        })(jQuery);
      },
      loadSettings: function () {
        var settings = {};
        if ($.cookie('AFP') != undefined) {
          settings = JSON.parse($.cookie('AFP'))
        }
        for (var index in AFPremium.menu.functions) {
          if (settings[index] == undefined) {
            settings[index] = AFPremium.menu.functions[index].enable;
          }
        }
        $.cookie('AFP', JSON.stringify(settings), {expires: 3650, path: '/'});
        AFPremium.cvar.settings = settings;
        for (var index in settings) {
          if (AFPremium.menu.functions[index] != undefined) {
            AFPremium.menu.functions[index].enable = settings[index];
          }

        }
      },

    },
    updateSettings: function (functionality, is_active) {
      AFPremium.cvar.settings[functionality] = is_active;
      $.cookie('AFP', JSON.stringify(AFPremium.cvar.settings), {expires: 3650, path: '/'});
    }

  };
  AFPremium.loadPageType();
  AFPremium.loadFunctionalities();
  jQuery.test = AFPremium;

}

AFP_index(); //$('#featured-wrapper #featured img.wp-post-image')

// https://url-redirect.maxeo.net/youtube-get-download/?id=xfynvZ8sZRY
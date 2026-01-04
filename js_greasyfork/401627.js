// ==UserScript==
// @name         AnimeWorld Scrobbling
// @namespace    https://www.pizidavi.altervista.org/
// @description  Segna automaticamente gli episodi visualizzati su Trakt.TV
// @author       pizidavi
// @version      1.6.4
// @copyright    2023, PIZIDAVI
// @license      MIT
// @homepageURL  https://www.pizidavi.altervista.org/AnimeWorldScrobbling/
// @icon         https://www.pizidavi.altervista.org/AnimeWorldScrobbling/favicon.png
//
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.min.js
// @require      https://greasyfork.org/scripts/401626-notify-library/code/Notify%20Library.js
// @match        https://www.animeworld.ac/play/*
//
// @connect      animeworld.ac
// @connect      api.trakt.tv
// @connect      api.themoviedb.org
//
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401627/AnimeWorld%20Scrobbling.user.js
// @updateURL https://update.greasyfork.org/scripts/401627/AnimeWorld%20Scrobbling.meta.js
// ==/UserScript==

/* global GM_config */

(function($) {
  'use strict';

  const AnimeID = getAnimeID();
  const Trakt = GM_getValue(AnimeID, {});

  GM_config.init({
    id: 'config',
    title: GM.info.script.name+' - Impostazioni',
    fields: {
      client_id: {
        label: 'Client ID',
        section: ['<a href="https://www.pizidavi.altervista.org/AnimeWorldScrobbling/#login" target="_blank">https://www.pizidavi.altervista.org/AnimeWorldScrobbling/#login</a>'],
        type: 'text',
        size: 70,
        default: ''
      },
      access_token: {
        label: 'Access Token',
        type: 'text',
        size: 70,
        default: ''
      },
      expires: {
        label: 'Expires Date',
        type: 'text',
        size: 70,
        default: ''
      },
      helper: {
        label: 'Mostra Helper',
        type: 'checkbox',
        default: true
      },
      auto_next_episode: {
        label: 'Auto Next-Episode',
        type: 'checkbox',
        default: false
      },
      save_episode_on_aw: {
        label: 'Save episode on Animeworld',
        section: ['Login obbligatorio!'],
        type: 'checkbox',
        default: false
      },
      delete: {
        label: 'Cancella',
        type: 'button',
        click: () => {
          deleteOne(AnimeID);
          GM_config.close();
        }
      }
    },
    css: '#config{background-color:#343434;color:#fff} #config_header{margin-bottom:0.5em!important;margin-top:0.5em!important;} #config_delete_var{margin-top:2em !important;text-align:center;} #config .section_header{background-color:#282828;border:1px solid #282828;border-bottom:none;color:#fff;font-size:10pt}#config .section_desc{background-color:#282828;border:1px solid #282828;border-top:none;color:#fff;font-size:10pt}#config .reset{color:#fff}#config a{color:#fff}#config .section_header{margin-bottom: 1em;}',
    events: {
      init: () => {
        if (!GM_config.isOpen && (!GM_config.get('client_id') || !GM_config.get('access_token') || !GM_config.get('expires') || new Date() >= new Date(GM_config.get('expires')) ))
          window.addEventListener('load', () => GM_config.open())
      },
      open: () => {
        if (new Date() >= new Date(GM_config.get('expires'))) {
          GM_config.set('access_token', '');
          GM_config.set('expires', '');
        }

        if (!Trakt.slug)
          GM_config.fields['delete'].remove();
      },
      save: () => {
        if (!GM_config.get('client_id') || !GM_config.get('access_token') || !GM_config.get('expires')) {
          window.alert(GM.info.script.name + ': completa i campi mancanti');
        } else {
          window.alert(GM.info.script.name + ': salvato');
          GM_config.close();
          window.location.reload(false);
        }
      }
    }
  });
  GM_registerMenuCommand('Configure', () => GM_config.open());

  /* --------------------- */
  const CLIENT_ID = GM_config.get('client_id');
  const ACCESS_TOKEN = GM_config.get('access_token');
  const EXPIRES = GM_config.get('expires');

  const SHOW_HELPER = GM_config.get('helper');
  const AUTO_NEXT_EPISODE = GM_config.get('auto_next_episode');
  const SAVE_EPISODE_ON_AW = GM_config.get('save_episode_on_aw');

  const CSS = '#body .sidebar { float: right; width: 300px; position: relative; z-index: 1; } #trakt-results .item .info a.name::after { font-family: "Font Awesome 5 Free"; font-size: 9px; font-weight: 900; content: "\\f35d"; margin-left: 5px; vertical-align: super; }';
  const TEMPLATE = '<div id="trakt" class="sidebar"><div class="widget simple-film-list"><div class="widget-title"><div class="title">Trakt.TV</div></div><div class="widget-body"><div class="row mb-3"><div class="col-sm-10" style="padding-right: 0;"><button class="btn btn-primary btn-block" id="watched">Guardato<span class="spinner-border spinner-border-sm ml-2" role="status" style="display:none;"></span></button></div><div class="col-sm-2"><input type="checkbox" id="autoNext" style="margin-top: 8px;" title="Prossimo episodio automatico"></div></div><div class="row"><div class="col-sm-6" style=" padding-right: 0;"><input type="text" class="form-control" placeholder="Trakt Slug"><small id="helper" style="display:none;margin:0.3em 0px -5px 0.5em;"><a href="https://www.pizidavi.altervista.org/AnimeWorldScrobbling/#trakt" target="_blank" style="color:grey;">Dove lo trovo?</a></small></div><div class="col-sm-2" style=" padding-right: 0;"><input type="number" class="form-control" value="1" min="0" placeholder="Season"></div><div class="col-sm-4"><button id="save-trakt" class="btn btn-success btn-block">Salva</button></div></div><div id="trakt-results" class="mt-3" style="display:none;"><hr class="my-3"/><h5 class="mb-1">Risultati di ricerca su Trakt</h5></div></div></div></div>';
  const TEMPLATE_ITEM = '<div class="item" role="button" title="Click per selezionare questo risultato"><img src="#" class="thumb" style="opacity:0;"><div class="info"><a class="name" href="#" target="_blank"></a><p class="year mb-0"></p></div></div>';

  const section = $(TEMPLATE);
  $('#body #body-container').append(section);

  const style = document.createElement('style');
  style.innerText = CSS;
  document.head.appendChild(style);

  if(!CLIENT_ID || !ACCESS_TOKEN || !EXPIRES) {
    section.find('div.widget-body').html('Dati Trakt mancanti. Segui la <a href="https://www.pizidavi.altervista.org/AnimeWorldScrobbling/" target="_blank">guida</a>');
    return; }
  if(new Date() >= new Date(EXPIRES)) {
    section.find('div.widget-body').html('Access-Token Trakt Scaduto. <a href="https://www.pizidavi.altervista.org/AnimeWorldScrobbling/#login" target="_blank">Aggiorna</a>');
    return; }
  if(!AnimeID) {
    section.find('div.widget-body').html('Errore. AnimeID non trovato');
    return; }

  section.find('input[type="text"]').val(Trakt.slug);
  section.find('input[type="number"]').val((Trakt.season || '1'));
  if(AUTO_NEXT_EPISODE)
    section.find('input[type="checkbox"]').attr('checked', '');
  if(SHOW_HELPER)
    section.find('#helper').css('display', 'block');

  section.find('#watched').on('click', function() {
    const _this = $(this);
    const episodes_element = $('div.server ul a.active');
    const episodes = episodes_element.attr('data-base').split('-');
    var type = $('#main div.widget.info div.info > div.row > .meta:nth-child(1) dd:nth-child(2)').text().trim();
    type = (type == 'Movie' ? 'movies' : 'shows');

    if(!Trakt.slug || !Trakt.season || !episodes.length) {
      new Notify({
        text: 'Errore',
        type: 'error'
      }).show();
      return;
    }
    _this.attr('disabled', '');
    _this.find('span.spinner-border').show();

    if (SAVE_EPISODE_ON_AW)
      save_on_aw();

    var joData = {};
    joData[type] = [
      {
        'ids': {
          'slug': Trakt.slug,
        },
        'seasons': [
          {
            'number': parseInt(Trakt.season),
            'episodes': episodes.map(function(value, index) { // More episodes supported
              const date = new Date();
              date.setMinutes(date.getMinutes() - 21*(episodes.length-1 - index));
              return {
                'watched_at': date.toJSON(),
                'number': parseFloat(value)
              };
            })
          }
        ]
      }
    ];

    request({
      method: 'POST',
      url: '/sync/history',
      data: joData,
      done: function(data, status) {
        _this.removeAttr('disabled');
        _this.find('span.spinner-border').hide();
      },
      success: function(data) {
        if(data.added[(type == 'movies' ? 'movies' : 'episodes')] > 0) {
          episodes_element.css('background-color', 'lightseagreen').css('color', '#fff');
          new Notify({
            text: (type == 'movies' ? 'Film' : 'Episodio')+' '+episodes.join('-')+' salvat'+(episodes.length > 1 ? 'i' : 'o'),
            type: 'success'
          }).show();

          if(AUTO_NEXT_EPISODE || section.find('#autoNext').prop('checked')) {
            $('#controls > div.prevnext[data-value="next"]').click(); }
          if(section.find('#autoNext').prop('indeterminate')) {
            section.find('#autoNext').click().click();
            $('#controls > div.prevnext[data-value="next"]').click(); }
        }
        else {
          new Notify({
            text: 'Errore. '+(type == 'movies' ? 'Film' : 'Episodio')+' non trovato',
            type: 'error'
          }).show();
        }
      }
    });

  });

  section.find('#save-trakt').on('click', function() {
    const title = $('#main div.widget.info div.info > div.head h2').text();
    const slug = $(this).parent().parent().find('input[type="text"]').val();
    const season = $(this).parent().parent().find('input[type="number"]').val();

    if(slug != '' && season != '') {
      Trakt.title = title.trim();
      Trakt.slug = slug.trim();
      Trakt.season = season;
      GM_setValue(AnimeID, Trakt);

      section.find('button#watched').removeAttr('disabled');

      new Notify({
        text: 'Dati salvati',
        type: 'success',
        timeout: 3000
      }).show();
    } else {
      new Notify({
        text: 'Completa tutti i campi',
        type: 'warn'
      }).show();
    }
  });

  section.find('#autoNext').on('click', function(e) {
    const state = $(this).attr('data-state') || 'unchecked';
    if (state === 'unchecked') {
      $(this).prop('checked', false);
      $(this).prop('indeterminate', true);

      $(this).attr('data-state', 'indeterminate');
    }
    else if (state === 'indeterminate') {
      $(this).prop('checked', true);
      $(this).prop('indeterminate', false);

      $(this).attr('data-state', 'checked');
    }
    else if (state === 'checked') {
      $(this).prop('checked', false);
      $(this).prop('indeterminate', false);

      $(this).attr('data-state', 'unchecked');
    }
  });

  $(document).on('click', 'div.userbookmark li:not([data-value="watching"]):not([data-value="advanced"]):not(.divider)', function() {
    deleteOne(AnimeID);
  });


  if(Trakt.slug == undefined || Trakt.season == undefined) {
    section.find('#watched').attr('disabled', '');

    var type = $('#main div.widget.info div.info > div.row > .meta:nth-child(1) dd:nth-child(2)').text().trim();
    if(type == 'Special' || type == 'OVA') {
      return; }
    type = (type == 'Movie' ? 'movie' : 'show');

    var title = $('#main div.widget.info div.info > div.head h2').text().replace('(ITA)', '').replace('(TV)', '').trim();
    const season = parseInt(title.split(' ').at(-1)) || 1;

    title = title.replace(season || '', '').trim();

    request({
      method: 'GET',
      url: '/search/'+type+'?query='+encodeURI(title),
      success: function(data) {
        if(!data.length) { return; }

        section.find('#trakt-results').show();
        $.each(data, function(index) {
          if(index >= 3) { return; }

          const item = $(TEMPLATE_ITEM);
          item.attr('data-slug', this[this.type].ids.slug);

          item.find('.info .name').text( (this[this.type].title.length > 45 ? this[this.type].title.substring(0, 45)+'...' : this[this.type].title));
          item.find('.info .name').attr('href', 'https://trakt.tv/'+this.type+'s/'+this[this.type].ids.slug);
          item.find('.info .name').attr('title', this[this.type].title);
          item.find('.info .year').text(this[this.type].year);

          item.on('click', function(e) {
            if(e.target.tagName == 'A') { return; }
            const slug = $(this).attr('data-slug');
            section.find('input[type="text"]').val(slug);
            section.find('input[type="number"]').val(season);
            section.find('#save-trakt').click();
          });
          section.find('#trakt-results').append(item);

          if(this[this.type].ids.tmdb != null) {
            item.attr('data-tmdb-id', this[this.type].ids.tmdb);

            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://api.themoviedb.org/3/'+ (this.type == 'show' ? 'tv' : 'movie') +'/'+ this[this.type].ids.tmdb +'/images?api_key=52a23d06812ad987218e2e41ec6eb79c',
              onload: function() {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201)) {
                  const data = JSON.parse(this.responseText);
                  if(data.posters.length > 0)
                    section.find('#trakt-results').find('[data-tmdb-id="'+data.id+'"] > img').attr('src', 'https://image.tmdb.org/t/p/w92'+data.posters[0].file_path).css('opacity', '1');
                }
              }
            });
          }
        });
      }
    });
  }

  function save_on_aw() {
    const CSRF_Token = document.querySelector('#csrf-token').content
    const id = document.querySelector('.watchlist-edit-modal[data-id]').getAttribute('data-id');
    const episodes = $('div.server ul a.active').attr('data-base').split('-');
    const episode = episodes[episodes.length-1];

    const viewed = document.querySelector('#watchlist-edit-episodes').value;
    if (parseInt(viewed) >= parseInt(episode)) return;

    const max = document.querySelector('#watchlist-edit-episodes').getAttribute('max');
    if (viewed == max) return;

    const folder = document.querySelector('#watchlist-edit-folder').options[document.querySelector('#watchlist-edit-folder').options.selectedIndex].value;
    const rewatches = document.querySelector('#watchlist-edit-rewatches').value;
    const note = document.querySelector('#watchlist-edit-notes').value;
    const score = document.querySelector('#watchlist-edit-score').value;

    var options = {};
    options.method = 'POST';
    options.url = '/api/watchlist/edit/'+id;
    options.data = 'folder='+folder+'&episodes='+episode+'&rewatches='+rewatches+'&notes='+note+'&vote='+score;
    options.headers = {
      'Accept': 'application/json, text/javascript; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'referer': location.href,
      'CSRF-Token': CSRF_Token
    };
    options.onload = function() {
      if (this.readyState === 4 && (this.status === 200 || this.status === 201)) {
        const response = JSON.parse(this.responseText);
        if (response.error === false) {
          document.querySelector('#watchlist-edit-episodes').value = episode;
        } else {
          console.error(GM.info.script.name, response);
          new Notify({
            text: 'Errore con AW',
            type: 'error'
          }).show();
        }
      } else if (this.readyState === 4) {
        console.error(GM.info.script.name, this.responseText);
        new Notify({
          text: 'Errore nella richiesta su AW',
          type: 'error'
        }).show();
      }
    }
    GM_xmlhttpRequest(options);
  }


  // Functions
  function request(options) {
    options.url = 'https://api.trakt.tv'+options.url;
    options.headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ACCESS_TOKEN,
      'trakt-api-version': '2',
      'trakt-api-key': CLIENT_ID
    };
    options.data = JSON.stringify(options.data);
    options.onload = function() {
      if (this.readyState === 4) {
        if (typeof options.done == 'function') {
          options.done(this.responseText, this.status);
        }

        if (this.status === 200 || this.status === 201) {
          options.success(JSON.parse(this.responseText));
        }
        else if (this.status === 403) {
          new Notify({
            text: 'Errore. API Key invalida',
            type: 'error',
            timeout: false
          }).show();
        }
        else if (this.status === 404) {
          new Notify({
            text: 'Errore. Elemento non trovato',
            type: 'error',
            timeout: false
          }).show();
        }
        else if (this.status >= 500 && this.status <= 522) {
          new Notify({
            text: 'Errore. Service Unavailable',
            type: 'error',
            timeout: false
          }).show();
        }
        else {
          new Notify({
            text: 'Errore nella richiesta. Ricarica la pagina',
            type: 'error',
            timeout: false
          }).show();
          console.error(GM.info.script.name, this.responseText);
        }
      }
    }
    GM_xmlhttpRequest(options);
  }

  function getAnimeID() {
    const url = location.pathname;
    const start = url.indexOf('.')+1;
    const end = start + (url.substring(start).indexOf('/') >= 0 ? url.substring(start).indexOf('/') : url.substring(start).length);
    return url.substring(start, end) || undefined;
  }

  function deleteOne(key) {
    if(GM_listValues().includes(key)) {
      GM_deleteValue(key);

      section.find('input[type="text"]').val('');
      section.find('input[type="number"]').val('1');
      section.find('button#watched').attr('disabled', '');

      Trakt.title = null;
      Trakt.slug = null;
      Trakt.season = null;

      new Notify({
        text: 'Dati Trakt rimossi',
        type: 'success',
        timeout: 3000
      }).show();

      return true;
    } else {
      return false;
    }
  }
  function deleteAll() {
    GM_listValues().forEach(function(key) {
      GM_deleteValue(key);
    });
    return true;
  }

})(jQuery);
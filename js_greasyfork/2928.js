(function () {
// ==UserScript==
// @name           Traditional Twitter RT + Instagram Card
// @namespace      http://blog.thrsh.net
// @author         cecekpawon (THRSH)
// @description    Old School RT Functionality for New Twitter, Allows retweeting with Comments
// @version        5.4.8
// @require        http://code.jquery.com/jquery-latest.js
// @grant          GM_xmlhttpRequest
// @match          https://twitter.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/2928/Traditional%20Twitter%20RT%20%2B%20Instagram%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/2928/Traditional%20Twitter%20RT%20%2B%20Instagram%20Card.meta.js
// ==/UserScript==

var TWRT = {};
TWRT.$ = null;
TWRT.debug = 0;

// GLOBAL Variable
TWRT.setting_def = { yodOption: 0, yodRT: 'RT', yodAdvTop: 1, yodGeo: 1, yodAuto140: 0, yodExpand: 0, yodMute: 1, yodMuteLists: '', yodMuteListsString: '', yodScreenName: '', yodGIFAva: 1, yodGeo: 1, yodRTReply: 1, yodActRT: 1, yodActFB: 1, yodActStalking: 1, yodPromoted: 1, yodKeepBR: 1, yodBodyBG: 1, yodPhotoHeight: 0, yodInstagram: 0, yodInstagramThumb: '' };
TWRT.setting = {};

TWRT.css = '\
#global-actions {float:left!important;}\
.yodLegend legend{margin:auto!important;line-height:inherit!important;font-size:12px!important;font-weight:bold!important;text-align: center!important; padding: 0 5px!important; width: auto!important;border:none !important;}\
.yodLegend fieldset{border:none;}\
.yodLegend ul:not(:last-child) {margin-bottom:10px!important;}\
.yodLegend .tablex{font-size:11px!important;margin: 5px auto; width: 98%;}\
.yodLegend .tablex ul {text-align: center;}\
.yodLegend .tablex li {display: inline-block;cursor:pointer!important;min-width:15%;padding: 2px 0;}\
.yodLegend .tablex li:hover {font-size: 20px;font-weight: bold;}\
.yodLegend .tablex > div {display: inline-table; margin-right:5px}\
.yodShow {display: block !important;}\
.yodHide {display: none !important;position:absolute !important; left:-1000px !important; top:-1000px; !important}\
.fShow {border-top:solid 1px #CCC !important;}\
.fHide {}\
#yodSpace{padding: 10px 20px 20px;text-align: center}\
#yodSpace > div:not(:first-child) {margin-top:10px}\
#yodSpace .btn, #yodSpace checkbox, #yodSpace legend, #yodSpace label, #yodSpace li {cursor:pointer}\
#yodSpace .checkbox {padding: 5px;}\
#yodSpace .radio input[type=radio], #yodSpace .checkbox input[type=checkbox] {margin-left: 0;}\
#yodSpace .btn {padding:2px 5px!important}\
#yodRTCopyLeft{font-size:11px; text-align: center;border-top: 1px solid #CCC;}\
#yodRTOption > div {display: inline-table; margin-right:5px}\
.yodInputOpt {margin-left: 5px;width:50px!important;padding:0 3px!important}\
#yodRTCopyReply a:not(:first-child) {margin-left:5px;}\
span.geo-text{width:auto!important;}\
.yodSpace_ireply{padding: 5px 0 10px;}\
.yodSpace_ireply_wrapper{text-align: center;}\
.yodSpace_ireply_wrapper > a {display:inline-table;margin: 0 2px;}\
.forme {background-color: rgba(255,255,0,.3);}\
.debug {border:10px solid red!important;}\
div[id^=yod_tw_id] {color:red!important;font-size:11px!important;background-color:black!important;display:inline!important;padding:1px 3px!important;}\
#yodAdvTopEl {color:#66757F;width:10px;margin:10px;cursor:pointer;float:left!important;}\
#yodAdvTopEl > div {height: 13px; line-height: 0.8em;}\
.btn.yod-rt {margin-left:5px;}\
.tx_muted {margin-top: 10px;width: 100%;}\
.tx_muted textarea {width: 100%;resize:vertical;}\
.yodActions {}\
.yodActions_grid {float: left; margin-right:31px;width:100%!important;}\
.tweet-inverted .yodActions .sm-more {background-position: -280px -250px!important;}\
.yodmute_w {padding-left: 20px!important;}\
.more-tweet-actions .yodInlineButton a {text-align: left!important;margin-left:0!important;}\
.tweet-actions .yodInlineButton:first-child a {margin-left:0!important}\
.tweet-actions .yodInlineButton.yodInlineButton_last a {margin-right:10px!important}\
.yodInsta {text-align: center}\
.yodInsta img {margin: 10px 0 0!important; border-radius:5px!important;width:100%!important;height:auto!important;}\
.yod_loading {font-size: x-small; color: white; padding: 3px 10px; background-color: #55ACEE; border-radius: 10px;}\
';

function getValue(key, TW) {
  var val = localStorage.getItem(key);
  if (TW) val = JSON.parse(val);

  return val;
}

function setValue(key, val, TW) {
  if (TW) val = JSON.stringify(val);
  localStorage.setItem(key, val);

  return false;
}

function readSetting(s) {
  var str = getValue('yod_' + TWRT.setting['yodScreenName'] + '_twitsett');
  if (str = IsJsonString(str)) {
    TWRT.setting = str;
    if (!s) {
      for (var a in TWRT.setting_def) {
        if (!TWRT.setting.hasOwnProperty(a)) TWRT.setting[a] = TWRT.setting_def[a];
      }
    }
  } else {
    TWRT.setting_def['yodScreenName'] = TWRT.setting['yodScreenName'];
    TWRT.setting = TWRT.setting_def;
  }
  if (!s) saveSetting();
  else if (TWRT.setting.hasOwnProperty(s)) return TWRT.setting[s];
}

function saveSetting(k, v) {
  if (k) TWRT.setting[k] = v;
  setValue('yod_' + TWRT.setting['yodScreenName'] + '_twitsett', JSON.stringify(TWRT.setting));
}

function doyodGetBoolOpt(key, def) {
  readSetting();
  var val = parseInt(yodfixInt(TWRT.setting[key]));
  if (def) {
    val = parseInt(yodfixInt(TWRT.setting_def[key]));
    saveSetting(key, val);
  }

  return val;
}

function doyodGetNumOpt(key, def) {
  readSetting();
  var val = yodfixInt(TWRT.setting[key]);
  if (def) {
    val = yodfixInt(TWRT.setting_def[key]);
    saveSetting(key, val);
  }

  return val;
}

function o_debug(str) {
  if (TWRT.debug) console.log(str || '');
}

function yodfixInt(str) {
  if (!str) return 0;
  if (typeof str !== 'string') str = str.toString();
  str = str.replace(/[^0-9]/gmi, '');

  return str ? str : 0;
}

function IsJsonString(str) {
  try {
    str = JSON.parse(str);
    if (typeof str === 'object') return str;
  } catch (e) {}

  return false;
}

function yodUnique(Array) {
  return (typeof Array !== 'object') ? [] : TWRT.$.unique(removeEmptyArrayElements(Array));
}

function removeEmptyArrayElements(arr) {
  return arr.filter(function(elem){return elem !== null && elem !== ''});
}

function yodInArray(id, strArray) {
  if (!id) return false;
  if (typeof strArray !== 'string') strArray = yodUnique(strArray).join(',');
  var pattcontent = new RegExp(',?\s?(.*' + id + '+)\s?,?');
  return strArray.match(pattcontent);
}

function elExists(s, el) {
  var e = el ? el.find(s) : TWRT.$(s);
  return e.length ? e : 0;
}

function goParent(s, el) {
  var e = el.parents(s); if (e.length) return e;
}

function toClick(el) {
  var clickEvent  = document.createEvent('MouseEvents');
  clickEvent.initEvent('click', true, true);
  el = el.length ? el.get(0) : el;
  el.dispatchEvent(clickEvent);
  return false;
}

function doKeyTouch(key) {
  var k, keys = key.toString().split(' ');
  for (var a in keys) {
    if (k = keys[a]) {
      var e = TWRT.$.Event('keydown', { keyCode: k });
      TWRT.$('body').trigger(e);
    }
  }
}

function deEntity(str, raw) {
  var el;
  if (el = elExists('#yodEVALdump')) {
    el.html(str);
    str = raw ? el.html() : el.val();
    el.empty();
  }

  return str;
}

function br2nl(s) {
  return s.replace(/<br\s?\/?>/gi, '\r\n');
}

function re_BR(s) {
  s = deEntity(ytrim(s, TWRT.setting['yodKeepBR']), true);

  if (TWRT.setting['yodKeepBR']) {
    s = s.replace(/(\r\n|\r|\n)/gmi, '<br>');
  }

  return s;
}

function ytrim(s, keepBR) {
  var str = '';
  if (!(str = deEntity(s.toString(), true))) return str;

  str = str.replace(/(&nbsp;+)/gm, ' ');
  if (!keepBR) {
    str = str.replace(/[\r\n]/gm, ' ').trim()
    .split(/\s*\n\s*/)
    .join(' ');
  }

  return str.replace(/[ ]{2,}/gm, ' ').trim();
}

function compareDate(e) {
  var data_item_id = 0, key = 'yodLastData';
  try {data_item_id = yodfixInt(e.attr('data-item-id')) || 0;} catch (e) { return data_item_id; }

  var val = doyodGetNumOpt(key);
  if (data_item_id > val) {
    saveSetting(key, data_item_id);
  }

  return data_item_id;
}

function yodGetTweetBox() {
  return elExists('#tweet-box-global');
}

function yod_isHome() {
  return elExists('div[class*=mini-profile]');
}

function yod_isProfile(elx) {
  return elExists('div[class*=user-actions]', elx);
}

function yod_gallery() {
  TWRT.$(this).find('[class*=media-thumbnail]').not('.yodDone').each(function() {
    var el = TWRT.$(this);
    //el.show();
    el.addClass('yodDone');
    if (src = el.attr('data-url')) {
      if (yodInArray(encodeURIComponent(src), TWRT.yodImg_arr)) {
        el.hide();
        //el.addClass('debug');
      } else {
        TWRT.yodImg_arr.push(encodeURIComponent(src));
      }
    }
  });
}

function delContent(el, par) {
  if (par) {
    el.addClass('yodLinkParsed');
    el = el.parent();
  }
  el.slideUp('slow', function() {
    //TWRT.$(this).remove();
    //TWRT.$(this).addclass('yodHide');
  });
}

function fixGeo() {
  if (doyodGetBoolOpt('yodGeo')) {
    TWRT.$('.yodGeo.parsed').removeClass('yodHide');
    TWRT.$('.yodnoGeo').addClass('yodHide');
  } else {
    TWRT.$('.yodnoGeo').removeClass('yodHide');
    TWRT.$('.yodGeo.parsed').addClass('yodHide');
  }
}

function getFB(el) {
  var str = 'javascript:void(0);';
  if (str = el.find('a.js-permalink').attr('href')) {
    var fb_url = ytrim('http://twitter.com' + str || ''),
      fb_desc = ytrim(el.find('.js-tweet-text').eq(0).text() || ''),
      fb_ava = ytrim(el.find('.js-action-profile-avatar').eq(0).attr('src') || '').replace(/_normal/gmi, '');

    str = 'http://m.facebook.com/dialog/feed?app_id=2231777543&redirect_uri=https%3A%2F%2Fwww.facebook.com&to&display=touch'
      + '&caption=' + encodeURIComponent(fb_url)
      + '&description=' + encodeURIComponent(fb_desc)
      + '&link=' + encodeURIComponent(fb_url)
      + '&picture=' + encodeURIComponent(fb_ava);
  }
  return str;
}

function getRTby(entry) {
  var a = {};
  if (
      entry.attr('data-retweet-id')
      && (el = elExists('.js-retweet-text > a', entry))
      && (str = el.attr('href'))
    ) {
    a.uname = str.replace(/\//g, '');
    return a;
  }
}

function yod_render(newtweet) {
  var is_Home, is_Profile, mutesx;

  if (newtweet) {
    is_Home = yod_isHome();
    is_Profile = yod_isProfile();
    mutesx = doyodGetBoolOpt('yodMute') ? readMuteLists('yodMuteLists') : '';
  }

  TWRT.$('.js-stream-tweet, .permalink-tweet').not('.yodDone').each(function() {
    var data_item_id, parEntry, entry = TWRT.$(this);
    if (
      goParent('[class*=proxy]', entry)
      || (!(parEntry = entry.parent()))
      ) return true;

    // add parsed class
    entry.addClass('yodDone');

    var el, el2, str, str2,
      owntweet = entry.hasClass('my-tweet'),
      data_type = parEntry.attr('data-item-type') || '';

    mutesy = doyodGetBoolOpt('yodMute2') ? TWRT.mutesString : '';
    if (!owntweet && newtweet && mutesy/* && is_Home*/ && data_type.match(/tweet/i)) {
      txt = entry.find('.js-tweet-text').eq(0).text();
      if (txt) {
        pattmutesy = new RegExp('\s?' + mutesy + '\s?', 'gmi');
        if (txt.match(pattmutesy)) {
          delContent(entry, 1);
        }
      }
    }

    translate_link(entry);

    if (!entry.hasClass('yodLinkParsed')) {
      entry.addClass('yodLinkParsed');

      if (data_item_id = yodfixInt(entry.attr('data-item-id'))) {

        el = entry.find('.js-actions .dropdown li').first();

        var yodActions_class = 'yodActions';

        TWRT.$('<li/>', {class: 'yodInlineButton yodActFB' + yodActions_class})
          .append(
            TWRT.$('<a/>', {id: 'FB_' + data_item_id, title: 'Share to facebook', role: 'button', html: 'FB Share', href: getFB(entry), target: '_blank'})
          ).insertBefore(el);

        TWRT.$('<li/>', {class: 'yodInlineButton yodActRT' + yodActions_class})
          .append(
            TWRT.$('<a/>', {id: 'RT_' + data_item_id, title: 'Trad RT', role: 'button', html: 'Trad RT', href: '#'})
          ).insertBefore(el);

        TWRT.$('<li/>', {class: 'yodInlineButton yodActRT' + yodActions_class})
          .append(
            TWRT.$('<a/>', {id: 'RT_URL_' + data_item_id, title: 'RT with URL', role: 'button', html: 'RT URL', href: '#'})
          ).insertBefore(el);

        TWRT.$('<li/>', {class: 'yodInlineButton yodInlineButton_last yodActStalking' + yodActions_class})
          .append(
            TWRT.$('<a/>', {id: 'STALKING_' + data_item_id, title: 'Stalking', role: 'button', html: 'Stalking', href: '#'})
          ).insertBefore(el);

        TWRT.$(document).on('click', 'a#FB_' + data_item_id, function() {
          window.open(this.href);
          return false;
        });

        TWRT.$(document).on('click', 'a#RT_' + data_item_id, function() {
          yod_toRT(TWRT.$(this));
          return false;
        });

        TWRT.$(document).on('click', 'a#RT_URL_' + data_item_id, function() {
          yod_toRT(TWRT.$(this), true);
          return false;
        });

        TWRT.$(document).on('click', 'a#STALKING_' + data_item_id, function() {
          yod_toStalk(TWRT.$(this));
          return false;
        });
      }

      if (el = entry.find('i.sm-geo').not('.parsed')) {
        if (el = goParent('.stream-item-footer', el)) {
          if (el = el.find('b > .expand-stream-item')) {
            el.addClass('yodGeo parsed');
            TWRT.$('<span/>', {class: 'expand-action-wrapper yodnoGeo yodHide', html: 'Expand'}).insertAfter(el);
          }
        }
      }

      if (newtweet) {
        // todo
      }
    }
  });

  fixGeo();
}

function translate_emoji(e) {
  e.find('img.twitter-emoji').each(function(){
    TWRT.$(this).replaceWith(' ' + TWRT.$(this).attr('alt') + ' ');
  });
}

function translate_link(e) {
  if (!(e = TWRT.$(e.currentTarget || e))) return;
  if (!(e = elExists('[class*=js-tweet-text]', e))) return;
  e = e.eq(0);

  var el, e2;
  if (el = elExists('#yodRTdump')) {
    el.html(e.html());

    var mod = 0;

    el.contents().filter(function() {
        return this.nodeType === 3;
    }).each(function() {
      var de =  deEntity(this.textContent);
      if (de !== this.textContent) {
        this.textContent = deEntity(this.textContent);
        mod++;
      }
    });

    var decoded = deEntity(unescape(e.text().trim()));

    // collect links
    el.find('a[data-expanded-url]').each(function() {
      var link = TWRT.$(this),
        a1 = link.attr('data-ultimate-url') || '',
        a2 = link.attr('data-expanded-url') || '';

      if (longURL = a1 || a2) {
        link.html(longURL).attr({href: longURL});
        mod++;
      }

      if (!doyodGetBoolOpt('yodGeo')) {
        if (link.attr('href').match(/myloc/i)) {
          link.remove();
          mod++;
        }
      }
    });

    //var decoded2 = deEntity(unescape(el.text().trim()));
    var decoded2 = unescape(el.text().trim());

    // ISTANA-GERAAMMM
    if (doyodGetBoolOpt('yodInstagram')) {
      parse_instagram(e);
    }

    // is_entity / expanded links
    if (mod || (decoded !== decoded2)) {
      //e.html(deEntity(el.html()));
      e.html(el.html());
    }
  }

  el.empty();
}

function parse_instagram(e) {
  var
    insta_size = TWRT.setting['yodInstagramThumb'] ? '/s' + TWRT.setting['yodInstagramThumb'] + 'x' + TWRT.setting['yodInstagramThumb'] : '',
    insta_a = e.text().trim().match(/https?:\/\/(instagr\.am|instagram\.com)\/p\/([^\/\s]+)/ig),
    insta_error = function() {
      o_debug('Eekk.. Error retrieving instagram url :(((');
    };


  for (var insta_i in insta_a) {
    insta_t = insta_a[insta_i] + '/media/?size=t';

    GM_xmlhttpRequest({
      method: 'GET',
      url: insta_t,
      /* duplicate image!!!
      onprogress: function() {
        e.append(TWRT.$('<div/>', {'class': 'yodInsta parsed'})
          .append(TWRT.$('<span/>', {'class': 'yod_loading', text: '...'}))
        );
      },
      */
      onload: function(response) {
        if ((insta_t = response.finalUrl) && (insta_t = insta_t.match(/\/([0-9]{5,}.*)$/ig))) {
          insta_t = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1' + insta_size + insta_t[0];
          e.append(TWRT.$('<div/>', {'class': 'yodInsta parsed'})
            .append(TWRT.$('<img/>', {src: insta_t}))
          );
        } else {
          insta_error();
        }
      },
      onerror: function () {
        insta_error();
      }
    });
  }
}

function yodShowTweetBox(s, c, RT) {
  //doKeyTouch('27');
  TWRT.$('.js-close').click();

  var nt, txa, content = TWRT.setting['yodRT'] + ' @' + s + ': ' + c;
  if (RT) content = TWRT.setting['yodRT'] + ' @' + RT + ': ' + content;

  if (nt = elExists('#global-new-tweet-button')) {
    if (doyodGetBoolOpt('yodAuto140')) content = toyodRTFit140(content);

    toClick(nt);

    if (txa = elExists('#global-tweet-dialog .tweet-box:visible, #tweet_dialog .twitter-anywhere-tweet-box-editor:visible')) {
      txa.html(content).focus().change();
    }
  }
}

function yod_toRT(e, cpURL) {
  var entry, screen_name, RT, parent;

  entry = TWRT.$(e).find('.yodDone');

  if (!entry.length) {
    entry = TWRT.$(e).parents('.yodDone');
  }

  if (!entry.length) return;

  if (!(screen_name = entry.attr('data-screen-name'))) return;
  if (RT = getRTby(entry)) RT = RT.uname;

  var mentions = entry.attr('data-mentions'),
    permalink = 'https://twitter.com' + entry.attr('data-permalink-path');

  if (!(entry = elExists('[class*=js-tweet-text]', entry))) return;

  if (cpURL) {
    entry = '';
    if (mentions) {
      mentions = mentions.split(/\s/);
      for (var i in mentions) {
        entry += ' @' + mentions[i];
      }
    }

    entry = permalink + entry;
  } else {
    entry2 = entry.clone();
    translate_emoji(entry2);

    entry = entry2.eq(0).text();
  }

  entry = stripUser(entry, false, TWRT.setting['yodKeepBR']);

  yodShowTweetBox(screen_name, re_BR(entry), RT);
}

function yod_toStalk(e) {
  var entry, screen_name, RT;

  entry = TWRT.$(e).parents('.yodDone');

  if (!(screen_name = entry.attr('data-screen-name'))) return;

  document.location.href = 'https://twitter.com/search?q="' + screen_name + '"%20%40' + screen_name + '&vertical=default&f=tweets';
}

function yod_rtDiag(e) {
  var target, elx = TWRT.$(e.currentTarget);

  if (elExists('.yod-rt', elx)) return false;

  if (target = elExists('.retweet-action', elx)) {
    target.clone()
      .html('RT')
      .attr('class', 'btn yod-rt')
      .click(function(){
        if (elx.length) {
          yod_toRT(elx.addClass('yodDone').parent());
        }
      })
      .appendTo(target.parent());

    return target.clone()
      .html('RT URL')
      .attr('class', 'btn yod-rt')
      .click(function(){
        if (elx.length) {
          yod_toRT(elx.addClass('yodDone').parent(), true);
        }
      })
      .appendTo(target.parent());
  } else {
    yod_goDiag(e);
  }
}

function cleanMuteLists(str) {
  return ytrim(ytrim(str).replace(/(\s,|,\s)/gm, ',').replace(/[,]{2,}/gm, ',')).replace(/^,/gm, '').replace(/,$/gm, '').trim();
}

function readMuteLists(target_str, a, save) {
  var str = cleanMuteLists(readSetting(target_str).toString()) || '',
    arr = yodUnique(str.split(','));

  if (save) saveSetting(target_str, arr.join(','));
  return a ? arr : str;
}

function prettyMuteLists(target_str, str, el) {
  if (!(str = cleanMuteLists(str))) str = '';
  str = str.replace(/,/gm, ', ');
  if (!el)
    if (el = elExists('#' + target_str)) el.val(str);
  return str;
}

function checkMute(id, u, e, check) {
  var target_str = 'yodMuteLists',
    mutesx = readMuteLists(target_str, 1), el, x, b = mutesx;

  for (var i in mutesx) {
    var s = mutesx[i];
    if (!s.match(/[0-9]{8,}/)) b.splice(mutesx.indexOf(s.trim()), 1);
  }

  var s1 = 'M'; var s2 = 'Mute this user';

  if (x = yodInArray(id, b.join(','))) {
    if (check) {
      s1 = 'U' + s1; s2 = 'UN-' + s2;
    } else {
      b.splice(b.indexOf(x[0]), 1);
    }
  } else {
    if (!check) {
      s1 = 'U' + s1; s2 = 'UN-' + s2;
      b.push(u);
    }
  }

  var str = doyodGetBoolOpt('yodMute') ? '' : '(disabled)';

  if (table = elExists(TWRT.$(e).parents('table'))) {
    e = table;
    s1 = '<strong>' + s1 + '</strong>';
  }

  TWRT.$(e).find('.yodmutelabel').html(str);
  TWRT.$(e).find('.yodmutevalue').html(s1);
  TWRT.$(e).attr('title', s2 + str);

  if (!check) {
    b = yodUnique(b);
    mutesx = b.join(',');
    saveSetting(target_str, mutesx);
    prettyMuteLists(target_str, mutesx);
    doCSS_dyn();
  }
}

function yod_BodyBG() {
  TWRT.$('body[class*=user-style-]').addClass('yodBodyBG');
}

function embedMute(elx) {
  var el, s, tw_id, u, popup = elx, id = 'yodMuteButtPop';

  if (!elx) {
    elx = TWRT.$('body');
    id = 'yodMuteButt';
  }

  if (s = yod_isProfile(elx)) {

    var profile_grid_el = elExists('[class*=ProfileNav]', el), profile_grid = !popup && profile_grid_el;

    if (el = elExists('[class*=js-mini-profile-stats]', elx) || profile_grid_el) {

      if (elExists('[class*=yodmute]', el)) return;
      if (tw_id = s.attr('data-user-id')) {
        u = tw_id + ' (' + s.attr('data-screen-name') + ')';

        var e_mute_w, e_mute;

        if (profile_grid) {
          e_mute_w = TWRT.$('<li/>', {'class': 'ProfileNav-item', id: id});
          e_mute = TWRT.$('<a/>', {
              'class': 'yodmute ProfileNav-stat u-textCenter js-tooltip',
              href: 'javascript:void(0);',
              html: '<span class="ProfileNav-label yodmutelabel"></span><span class="ProfileNav-value yodmutevalue"></span>'
            }).appendTo(e_mute_w);
          e_mute_w.insertAfter(el.find('.ProfileNav-item--favorites'));
        } else {
          e_mute = TWRT.$('<a/>', {
              'class': 'yodmute js-nav yodmutevalue',
              id: id,
              href: 'javascript:void(0);'
            });
          el.find('th').parent().append(TWRT.$('<th/>', {'class': 'yodmutelabel yodmute_w'}));
          e_mute_w = TWRT.$('<td/>', {'class': 'yodmute_w'});
          e_mute_w.append(e_mute);
          el.find('td').parent().append(e_mute_w);
        }

        checkMute(tw_id, u, e_mute, 1);

        e_mute.click(function(){
          checkMute(tw_id, u, this);
          return false;
        });

        if (TWRT.debug && (!elExists('#yod_tw_id' + tw_id))) {
          TWRT.$('<div/>', {id: 'yod_tw_id' + tw_id,html: tw_id}).insertBefore(s.find('.fullname'));
        }
      }
    }
  }
}

function yod_profile_popupDiag(e) {
  if (e = e.currentTarget) {
    embedMute(TWRT.$(e));
  }
}

function yod_reload() {
  window.location.reload(true);
}

function toCB(id, t, l) {
  var cb = TWRT.$('<input/>', {id: id, name: id, type: 'checkbox'})
    .click(function() {
      saveSetting(TWRT.$(this).attr('id'), this.checked ? 1 : 0);
      switch(id) {
        case 'yodMute':
          var el;
          if (el = elExists('#yodMuteLists')) {
            if (TWRT.$(this).is(':checked')) el.removeAttr('disabled');
            else el.attr('disabled', 'disabled');
          }
        case 'yodMute2':
          var el;
          if (el = elExists('#yodMuteListsString')) {
            if (TWRT.$(this).is(':checked')) el.removeAttr('disabled');
            else el.attr('disabled', 'disabled');
          }
        case 'yodGeo':
          fixGeo();
        case 'yodGIFAva':
        case 'yodActRT':
        case 'yodActFB':
        case 'yodActStalking':
        case 'yodPromoted':
        case 'yodBodyBG':
        case 'yodPhotoHeight':
          doCSS_dyn();
          break;
      }
    });

  if (doyodGetBoolOpt(id)) cb.attr('checked', 'checked');

  return TWRT.$('<div/>')
    .append(
      TWRT.$('<label/>', {title: t, for: id, html: l, class: 'checkbox'})
      .append(cb)
    );
}

function yod_goDiag(e, re) {
  var el, e2, elx, target, txa, rep, placed;

  elx = TWRT.$(re || e.currentTarget);

  if (elx[0].tagName) {
    if (!(txa = elExists('textarea[class*=tweet-box-shadow]', elx))) return false;
    if (!(target = elExists('div[class*=tweet-content]', elx))) return false;

    if (placed = elExists('#yodRTOption')) {
      rep = elExists('div[class*=simple-tweet]', elx);

      if (el = elExists('#yodRTCopyReply')) el.addClass('yodHide');
      if (TWRT.$(rep).html()) {
        if (!el) {
          // Inject Copy Reply button
          var div2 = TWRT.$('<div/>', {id: 'yodRTCopyReply'});

          // Copy reply
          var a = TWRT.$('<a/>', {class: 'btn', html: '[c] Reply', href: 'javascript:void(0);', title: 'Copy current text reply'})
          .click(function() {
            if (!(source = elExists('[data-tweet-id]', elx))) return;
            toReply('global', source);
            return false;
          }).appendTo(div2);

          // Copy reply URL
          a = TWRT.$('<a/>', {class: 'btn', html: '[c] URL', href: 'javascript:void(0);', title: 'Copy current URL'})
          .click(function() {
            if (!(source = elExists('[data-tweet-id]', elx))) return;
            toReply('global', source, true);
            return false;
          }).appendTo(div2);

          placed.append(div2);
        } else
          el.removeClass('yodHide');
      }

      return false;
    }

    // Inject Our Space to Target
    var div = TWRT.$('<div/>', {id: 'yodSpace'}),
      div2 = TWRT.$('<div/>', {id: 'yodRTOption'});

    // Fit 140 - Cut Text to 140 char length
    var div3 = TWRT.$('<div/>'),
    a = TWRT.$('<a/>', {id: 'yodRTFit140', class: 'btn', html: '140', href: 'javascript:void(0);', title: 'Fit 140 chars'})
    .click(function() {
      doyodRTFit140('global');
      return false;
    }).appendTo(div3);
    div2.append(div3);

    // Clean - Freeup space
    div3 = TWRT.$('<div/>');
    a = TWRT.$('<a/>', {id: 'yodRTClean', class: 'btn', html: '[x]', href: 'javascript:void(0);', title: 'Free Up Space'})
    .click(function() {
      doyodRTClean('global');
      return false;
    }).appendTo(div3);
    div2.append(div3);

    // Clean - Our username
    div3 = TWRT.$('<div/>');
    a = TWRT.$('<a/>', {id: 'yodCleanMine', class: 'btn', html: '[x] @', href: 'javascript:void(0);', title: 'Clean my username'})
    .click(function() {
      doyodMineClean('global');
      return false;
    }).appendTo(div3);
    div2.append(div3);

    // Clean - Hashtags
    div3 = TWRT.$('<div/>');
    a = TWRT.$('<a/>', {id: 'yodHashtagsClean', class: 'btn', html: '[x] #', href: 'javascript:void(0);', title: 'Clean Hashtags'})
    .click(function() {
      doyodHashtagsClean('global');
      return false;
    }).appendTo(div3);
    div2.append(div3);

    div.append(div2);

    initSettings();

    // OPTION Table
    var state = doyodGetBoolOpt('yodOption'),
      v_valOption = state ? 'Show' : 'Hide',
      v_valRT = readSetting('yodRT'),
      mute_target = 'yodMuteLists',
      v_valMuted = prettyMuteLists(mute_target, readMuteLists(mute_target)),
      mute_target2 = 'yodMuteListsString',
      v_valMuted2 = prettyMuteLists(mute_target2, readMuteLists(mute_target2)),
      v_valInstagramThumb = TWRT.setting['yodInstagramThumb'];

    div.append(
      TWRT.$('<div/>', {id: 'yodOption', class: 'yodLegend'})
      .append(
        TWRT.$('<fieldset/>', {class: 'f' + v_valOption})
        .append(TWRT.$('<legend/>', {class: 'f' + v_valOption, align: 'center', title: 'Toggle Show-Hide', html: '[ OPTIONS ]'}))
        .append(
          TWRT.$('<div/>', {class: 'tablex yod' + v_valOption})
          .append(
            TWRT.$('<div/>', {id: 'yodRTTxt', title: 'Opt RT Text'})
            .append(
              TWRT.$('<label/>', {html: 'RT', for: 'yodRT'})
              .append(TWRT.$('<input/>', {id: 'yodRT', 'class': 'yodInputOpt', name: 'yodRT', type: 'text'}).val(v_valRT))
            )
          )
          .append(toCB('yodAuto140', 'Auto cut 140 char', '140'))
          .append(toCB('yodAdvTop', 'Top Nav Scroller', 'TopNav'))
          .append(toCB('yodMute', 'Mute user noise', 'Mute User'))
          .append(toCB('yodMute2', 'Mute String noise', 'Mute String'))
          .append(toCB('yodExpand', 'Auto expand new tweets', 'Expand'))
          .append(toCB('yodGIFAva', 'GIF Anim Ava', 'GIF-A'))
          .append(toCB('yodGeo', 'Geo loc', 'Geo'))
          .append(toCB('yodRTReply', 'Copy Reply with RT prefix', 'Copy RT'))
          .append(toCB('yodActRT', 'RT Button', 'Action RT'))
          .append(toCB('yodActFB', 'FB Button', 'Action FB'))
          .append(toCB('yodActStalking', 'Stalking Button', 'Action Stalking'))
          .append(toCB('yodPromoted', 'Twitter Promoted', 'Promoted'))
          .append(toCB('yodKeepBR', 'Keep extra linebreak (new empty line space)', 'Keep Linebreak'))
          .append(toCB('yodBodyBG', 'Keep User custom Background Profile', 'BG Profile'))
          .append(toCB('yodPhotoHeight', 'Show Photos in full height', 'Photo Height'))
          .append(toCB('yodInstagram', 'Show Instagram Card', 'Instagram'))
          .append(
            TWRT.$('<div/>', {'id': 'yodInstagramThumbWrap', title: 'empty(actual size) / square: 150/320/480/640'})
            .append(
              TWRT.$('<label/>', {html: 'Instagram Thumb', for: 'yodInstagramThumb'})
              .append(TWRT.$('<input/>', {id: 'yodInstagramThumb', 'class': 'yodInputOpt', name: 'yodInstagramThumb', type: 'text'}).val(v_valInstagramThumb))
            )
          )
          .append(
            TWRT.$('<div/>', {class: 'tx_muted'})
            .append(TWRT.$('<textarea/>', {id: 'yodMuteLists', rows: 4, title: 'Muted lists (ID comma-separated, goto target [popup] profile)'}).val(v_valMuted))
          )
          .append(
            TWRT.$('<div/>', {class: 'tx_muted'})
            .append(TWRT.$('<textarea/>', {id: 'yodMuteListsString', rows: 4, title: 'Muted String lists (comma-separated)'}).val(v_valMuted2))
          )
        )
      )
    );

    // Copyleft
    var str = '\
      Done by <a href="http://blog.thrsh.net" target="_blank" title="Dev Blog">Cecek Pawon 2010</a> \
      (<a href="http://twitter.com/cecekpawon" title="Dev Twitter">@cecekpawon</a>) \
      w/ <a href="https://github.com/cecekpawon/Traditional-Twitter-RT" target="_blank" title="Script Page">\
      Traditional ReTweet (v5.4.8)</a>';

    div.append(
      TWRT.$('<div/>', {id: 'yodRTCopyLeft'})
      .append(TWRT.$('<span/>', {class: 'copyleft', html: str}))
    );

    div.insertAfter(target);

    var tx, Opts = ['MuteLists','MuteListsString','RT','InstagramThumb'];
    for (var a in Opts) {
      if (tx = elExists('#yod' +  Opts[a])) {
        var evts = ['change','paste'];
        tx.on(evts.join (' '), function(e) {
          saveSetting(TWRT.$(this).attr('id'), TWRT.$(this).val());
          if (Opts[a].match(/MuteListsString/i))
            TWRT.mutesString = readMuteLists('yodMuteListsString', 1, 1).join('|');
          doCSS_dyn();
        });
      }
    }

    // yodAdvTop Events
    if (yodAdvTop = elExists('#yodAdvTop')) {
      yodAdvTop.click(function() {
        if (elyodAdvTop = elExists('#yodAdvTopEl')) {
          saveSetting('yodAdvTop', this.checked ? 1 : 0);
          updateScroll();
        }
      });
    }

    if (el = elExists('#yodMuteLists')) {
      if (doyodGetBoolOpt('yodMute')) el.removeAttr('disabled');
      else el.attr('disabled', 'disabled');
    }

    if (el = elExists('#yodMuteListsString')) {
      if (doyodGetBoolOpt('yodMute2')) el.removeAttr('disabled');
      else el.attr('disabled', 'disabled');
    }

    var Opts = [/*'Emote',*/'Option'];
    for (var a in Opts) {
      if (lgnd = elExists('#yod' +  Opts[a])) {
        var elgnd = elExists('legend', lgnd);
        elgnd.click(function() {
          var lgnd = TWRT.$(this),
            el = lgnd.next(),
            state = el.is(':visible') ? 0 : 1,
            sClass = state ? 'Show' : 'Hide';

          el.removeClass('yodShow yodHide').addClass('yod' + sClass);
          el.parent().removeClass().addClass('f' + sClass);
          saveSetting(lgnd.parents('.yodLegend').attr('id'), state);
        });
      }
    }
  }
}

function toyodRTFit140(txt) {
  txt = ytrim(txt, TWRT.setting['yodKeepBR']);
  if (txt.length > 140) {
    txt = txt.substr(0, 138) + '..';
  }
  return txt;
}

function fixDiv(el) {
  s = '';
  el.find('div').each(function(){
    s += '<br>' + TWRT.$(this).text();
  });

  return br2nl(s || el.text());
}

function doyodRTFit140(target, txt) {
  if (!(target = findReply(target))) return;
  txt = toyodRTFit140(txt || fixDiv(target));
  if (txt) {
    target.focus().html(re_BR(txt)).change();
  }
}

function doyodRTClean(target, wipe) {
  if (!(target = findReply(target))) return;
  var txt = wipe ? '' : ytrim(fixDiv(target), TWRT.setting['yodKeepBR']);
  target.focus().html(re_BR(txt)).change();
}

function doyodMineClean(target) {
  if (!(target = findReply(target))) return;
  var txt = ytrim(fixDiv(target), TWRT.setting['yodKeepBR']);
  target.focus().html(re_BR(stripUser(txt, true, TWRT.setting['yodKeepBR']))).change();
}

function doyodHashtagsClean(target) {
  if (!(target = findReply(target))) return;
  var txt = ytrim(fixDiv(target), TWRT.setting['yodKeepBR']);
  txt = txt.replace(/(#[a-z]{1,}[a-z0-9_]+)/ig, '');
  target.html(re_BR(txt));
  target.focus().html(re_BR(txt)).change();
}

function stripUser(str, wipe, keepBR) {
  var pattcontent = new RegExp('@?' + TWRT.setting['yodScreenName'], 'gmi'),
    s = wipe ? '' : TWRT.setting['yodScreenName'];

  return ytrim(str.replace(pattcontent, s), keepBR);
}

function expMentions(str) {
  var x, y = '', a = stripUser(str, true).split(' ');

  for (var i in a) { if (x = a[i]) y += ' @' + x.trim(); }
  return y.trim();
}

function findReply(target) {
  if ((TWRT.$.type(target) === 'string') && target.match(/global/i)) return yodGetTweetBox();
  if (target = goParent('.yodSpace_ireply', TWRT.$(target))) {
    return elExists('[data-target]', target.parent());
  }
}

function toReply(el, permaSource, cpURL) {
  var actor, source, dumsource, target, RT, txt = '', newtxt = '';

  if (!(target = findReply(el))) return;

  if (permaSource) {
    source = permaSource;
  } else {
    var id = target.attr('data-target') || '';
    if (!(id = id.replace(/[^0-9]/g, ''))) return;
    if (!(source = elExists('[data-tweet-id=' + id + '][data-permalink-path]'))) return;
  }

  if (RT = getRTby(source) || '') {
    RT = (doyodGetBoolOpt('yodRTReply') ? ' ' + TWRT.setting['yodRT'] : '') + ' @' + RT.uname + ': ';
  }

  if (!(actor = source.attr('data-screen-name'))) return;
  if (!(newsource = elExists('[class*=js-tweet-text]', source))) return;

  dumsource = newsource.clone();
  translate_emoji(dumsource);

  newsource = dumsource.eq(0);

  newtxt = cpURL ? 'https://twitter.com' + source.attr('data-permalink-path') : newsource.text();

  if (cpURL) {
    if (mentions = source.attr('data-mentions')) {
      mentions = mentions.split(/\s/);
      for (var i in mentions) {
        newtxt += ' @' + mentions[i];
      }
    }
  }

  txt = RT + (doyodGetBoolOpt('yodRTReply') ? ' ' + TWRT.setting['yodRT'] : '') + ' @' + actor;
  txt += stripUser(': ' + newtxt, false, TWRT.setting['yodKeepBR']);
  txt = doyodGetBoolOpt('yodAuto140') ? toyodRTFit140(txt) : re_BR(txt);

  target.focus().html(txt).change();
}

function watchReply(e) {
  var el, txa, target, target_box;

  if (!(el = TWRT.$(e.currentTarget || e))) return;
  el = el.parent();

  if (elExists('div.yodSpace_ireply_wrapper', el)) return;
  if (!(txa = elExists('[id^=tweet-box-reply]', el))) return;
  if (!(target = goParent('[class^=inline-reply]', txa))) return;
  if (!(target_box = elExists('.tweet-box', target))) return;

  var y, permalink = false;
  if (y = goParent('[class^=permalink]', target)) permalink = true;
  else if (!(y = goParent('[class^=expan]', target))) return;

  var p = y.clone();
  if (!elExists('[class*=js-tweet-text]', p)) return;

  var d_id = txa.attr('id');
  target_box.attr('data-target', d_id);

  var div = TWRT.$('<div/>', {class: 'yodSpace_ireply'}),
    div2 = TWRT.$('<div/>', {class: 'yodSpace_ireply_wrapper'}),
    b_attr = {class: 'btn', href: 'javascript:void(0);'};

  // Fit 140 - Cut Text to 140 char length
  var a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Fit 140 chars')
  .html('140')
  .on('mousedown', function(e) {
    if (!e.button) doyodRTFit140(this);
    return false;
  }).appendTo(div2);

  // Clean - freeup space
  a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Free Up Space')
  .html('[x]')
  .on('mousedown', function(e) {
    if (!e.button) doyodRTClean(this);
    return false;
  }).appendTo(div2);

  // Clean my username
  a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Clean my username')
  .html('[x] @')
  .on('mousedown', function(e) {
    if (!e.button) doyodMineClean(this);
    return false;
  }).appendTo(div2);

  // Clean Hashtags
  a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Clean Hashtags')
  .html('[x] #')
  .on('mousedown', function(e) {
    if (!e.button) doyodHashtagsClean(this);
    return false;
  }).appendTo(div2);

  // Copy Reply
  a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Copy current text reply')
  .html('[c] Reply')
  .on('mousedown', function(e) {
    if (!e.button) toReply(this);
    return false;
  }).appendTo(div2);

  // Copy URL
  a = TWRT.$('<a/>', b_attr)
  .attr('title', 'Copy current URL')
  .html('[c] URL')
  .on('mousedown', function(e) {
    if (!e.button) toReply(this, false, true);
    return false;
  }).appendTo(div2);

  target.append(div.append(div2));
}

function yodInlineReply(e) {
  if (e.className.match(/permalink/i)) {
    if (e = goParent('.permalink-tweet-container', TWRT.$(e))) {
      watchReply(e);
    }
  }
  else e.addEventListener('DOMNodeInserted', function(e){watchReply(e);} , true);
}

function expandNewTweet() {
  if (!doyodGetBoolOpt('yodExpand')) return;
  var el;
  if (el = elExists('div.new-tweets-bar')) toClick(el);
}

function initDump() {
  TWRT.$('#yoddump').remove();
  TWRT.$('<div/>', {id: 'yoddump', class: 'yodHide'})
    .append(TWRT.$('<div/>', {id: 'yodRTdump'}))
    .append(TWRT.$('<textarea/>', {id: 'yodEVALdump'}))
  .appendTo('body');
}

function initSettings() {
  if (!yodInArray(TWRT.setting['yodInstagramThumb'], '150,320,480,640')) {
    TWRT.setting['yodInstagramThumb'] = '';
  }
}

function updateScroll() {
  TWRT.$('#yodAdvTopEl > div').removeClass().addClass(doyodGetBoolOpt('yodAdvTop') ? 'yodShow' : 'yodHide');
}

function attachScroll(div, title, xchar, xtop) {
  TWRT.$('<div/>', {text: xchar, title: 'Scroll page to ' + title})
  .click(function(){
    TWRT.$('html, body').animate({scrollTop: xtop ? 0 : TWRT.$('body')[0].scrollHeight}); return false;
  }).appendTo(div);
}

function doAdvTop() {
  var logo;
  if (logo = elExists('#global-actions')) {
    var el = TWRT.$('<div/>', {id: 'yodAdvTopEl'});
    attachScroll(el, 'Top', '\u25B2', true);
    attachScroll(el, 'Bottom', '\u25BC');
    el.insertAfter(logo);
    updateScroll();
    return el;
  }
}

function doCSS() {
  if (elExists('#yod_RT_CSS')) return;
  TWRT.$('<style/>', {id: 'yod_RT_CSS', text: TWRT.css}).appendTo('head');
  TWRT.$('<style/>', {id: 'yod_RT_CSS_dyn'}).appendTo('head');
}

function doCSS_dyn() {
  TWRT.$('#yod_RT_CSS_dyn').empty();

  var str = '', s_css = [];
  var mutesx = readMuteLists('yodMuteLists', 1, 1);
  TWRT.mutesString = readMuteLists('yodMuteListsString', 1, 1).join('|');
  if (doyodGetBoolOpt('yodMute')) {
    for (var i in mutesx) {
      if (!(s = mutesx[i])) continue;
      if (s = s.toString().match(/[0-9]{8,}/))
        var streamblocks = ['home'/*, 'connect'*/, 'discover', 'search'];
        for (var i in streamblocks)
          s_css.push ('.' + streamblocks[i] + '-stream li div.tweet[data-user-id="' + s[0] + '"]');
    }
    if (s_css.length) str += '\r\n' + s_css.join(',') + '{display:none!important;}\r\n'
  }

  if (!doyodGetBoolOpt('yodGIFAva')) {
    str += '.avatar[src*=".gif"]{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodGeo')) {
    str += '.tweet-geo-text,i.sm-geo{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodActRT')) {
    str += '.yodActRT{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodActFB')) {
    str += '.yodActFB{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodActStalking')) {
    str += '.yodActStalking{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodPromoted')) {
    str += '.promoted-tweet, .promoted-trend, .promoted-account{display:none!important}';
  }

  if (!doyodGetBoolOpt('yodBodyBG')) {
    str += '.yodBodyBG{background-image:none!important}';
  }

  if (doyodGetBoolOpt('yodPhotoHeight')) {
    str += '.js-media-container .FlexEmbed:before{padding:0!important;}';
    str += '.js-media-container [data-card-type="photo"] a,.js-media-container [data-card-type="photo"] div{position:inherit;max-height:inherit!important;height:auto!important;width:100%!important;}';
    str += '.js-media-container [data-card-type="photo"] img,.multi-photos img,.FlexEmbed img{margin-top:0!important;width:100%!important;height:auto!important;max-height:inherit!important;position:inherit!important;left:0!important;border-radius:5px!important;}';
    str += '.multi-photos{height:auto!important;}.multi-photos .multi-photo{height:auto!important;width:100%!important;margin:3px 0!important;}';
  }

  TWRT.$('#yod_RT_CSS_dyn').html(str);

  yod_BodyBG();
}

function restart() {
  TWRT.yodImg_arr = [];
  doCSS_dyn();
  readSetting();
  initSettings();
  initDump();
  embedMute();
  yod_render(1);
}

function starter() {
  doCSS();
  doAdvTop();
  restart();
}

function doStuff() {
  var el;
  // Go if User Logged
  if (elExists('[class*=global-new-tweet]')) {
    if (!(el = elExists('div > div.js-mini-current-user'))) return;
    if (!(TWRT.setting['yodScreenName'] = el.attr('data-screen-name'))) return;

    starter();

    TWRT.$('div[id*=tweet-dialog]').bind('DOMNodeInserted', yod_rtDiag);
    TWRT.$('div[id*=profile_popup]').bind('DOMNodeInserted', yod_profile_popupDiag);
    TWRT.$('div[class*=media-grid]').bind('DOMNodeInserted', yod_gallery);

    document.addEventListener('DOMNodeInserted', function (event) {
      try {
        var cname, elmt = event.target;
        if (!(/(DIV|LI)/.test(elmt.tagName))) return;
        if (cname = elmt.className) {
          if (
            (/dashboard|AppContainer/.test(cname))
          ) {
            restart();
          }
          else if (
            (/(stream-item|content|Grid|new-tweets-bar)/.test(cname))
          ) {
            expandNewTweet();
            yod_render(1);
          } else if (
            (/(original|permalink|stream-container)/.test(cname))
          ) {
            doCSS_dyn();
            yodInlineReply(elmt);
            yod_render();
          } else if (
            (/go-to-profile/.test(cname))
          ) {
            yod_render();
          } else {
          }
        } else {
          if (/LI/.test(elmt.tagName) && elExists('.simple-tweet', TWRT.$(elmt))) {
            yod_render();
          }
        }
      } catch (e) {}
    }, false);
  }
}

function doExec() {
  try {
    if (jQuery) {
      TWRT.$ = jQuery;
      doStuff();
    } else {
      //
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', doExec, true);
})();

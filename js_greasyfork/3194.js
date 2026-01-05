// ==UserScript==
// @name        ignore-pro-chude
// @author      SLAMPISKO http://www.hofyland.cz/?infos&user=79560
// @description HLENhance pro hofyland.cz (dříve Ignore pro chudé)
// @namespace   http://www.hofyland.cz/
// @include     *hofyland.cz*
// @version     1.6
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/3194/ignore-pro-chude.user.js
// @updateURL https://update.greasyfork.org/scripts/3194/ignore-pro-chude.meta.js
// ==/UserScript==

/*jslint browser: true*/
/*global
  $, jQuery, window, GM_getValue, GM_setValue, GM_deleteValue
*/
// if the host site isn't hofyland, exit the script
if (window.location.hostname.indexOf("hofyland.cz") < 0) {
  throw new Error("Site is not hofyland.");
}

this.$ = this.jQuery = jQuery.noConflict(true);
var settJson = GM_getValue("settings"),
  settings = {},
  currentVersion = "1.6",
  winmain = $('#winmain'),
  elem = null,
  oknotip = $('#okno-tip'),
  postIds = [],
  posts = parsePage();

// Post prototype
function Post(id, authorId, replyIds) {
  this.id = id;
  this.authorId = authorId;
  this.replyIds = replyIds;
  this.select = function() {
    return $('div.okno').has('a[name="post' + id + '"]');
  };
  this.hide = function(unhide) {
    var okno = this.select();
    if (unhide) {
      okno.css("display", "");
      okno.css("opacity", "0.6");
    } else {
      okno.css("display", "none");
    }
  };
}

// filter by James Padolsey: https://j11y.io/javascript/regex-selector-for-jquery/
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

// Get the Posts from the page
function parsePage() {
  var result = {};

  winmain.find('div.okno').has('a[name^="post"]').each(function() {

    $this = $(this);
    var id, authorIdLink, authorId, replyIds;
    id = $this.find('a[name^="post"]').attr('name').replace('post', '');
    authorIdLink = $this.find('a[href^="?infos&user="]:first');
    if (authorIdLink.length > 0) {
      authorId = authorIdLink.attr('href').replace('?infos&user=', '');
      replyIds = [];
      replies = winmain.find('div.okno').has('a[href="?club&post=' + id + '"]');

      if (replies.length > 0) {
        replies.find('a[name^="post"]').each(function() {
          replyIds.push($(this).attr('name').replace('post', ''));
        });
      }

      postIds.push(id);
      result[id] = new Post(id, authorId, replyIds);
    }
  });

  return result;
}

function strStartsWith(fullstr, substr) {
  return fullstr.substring(0, substr.length) === substr;
}

function background_color(element) {
  if (element.css('background-color') === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }
  return element.css('background-color');
}

function isIgnored(id) {
  for (var i = settings.ignored.length - 1; i >= 0; i--) {
    if (settings.ignored[i].id === id) {
      return true;
    }
  }

  return false;
}

function processPosts(show) {
  var count = 0, i, j, post;

  for (i = postIds.length - 1; i >= 0; i--) {
    post = posts[postIds[i]];
    if (isIgnored(post.authorId)) {
      post.hide(show);
      ++count;

      if (settings.hideRepliesToIgnored) {
        for (j = post.replyIds.length - 1; j >= 0; j--) {
          posts[post.replyIds[j]].hide(show);
          ++count;
        }
      }
    }
  }

  return count;
}

function getBoolSettingsRow(id, title, value, help) {
  return $('<div class="row"><ul><li>' + title + '</li></ul>' +
    '<input type="checkbox" class="check" ' + (value ? 'checked="checked" ' : '') +
    'name="' + id + '">&nbsp;<label class="helpc">' + help + '</label></div>');
}

function getSettingsRow(title, elem) {
  return $('<div class="row"><ul><li>' + title + '</li></ul>').append(elem);
}

function getButton(name, value) {
  return $('<input type="submit" name="' + name + '" size="0" value="' + value + '" class="button">');
}

function getNickFromImgSrc(s) {
  return s.substring(s.lastIndexOf("/") + 1, s.lastIndexOf(".")).toUpperCase();
}

function getIgnoredIcons(ignored) {
  var result = $('<span/>'), i, a, img;
  for (i = 0; i < ignored.length; ++i) {
    a = $('<a href="?infos&user=' + ignored[i].id + '" title="' + getNickFromImgSrc(ignored[i].img) + '"/>');
    img = $('<div class="icospravce" style="background:white center no-repeat url(' + ignored[i].img +
                ');display:inline-block;margin-right:2px;cursor:pointer"/>');
    a.append(img);
    result.append(a);
  }
  return result;
}

function getIgnoredIds(ignoredUsers) {
  var ids = [ignoredUsers.length], i;
  for (i = 0; i < ignoredUsers.length; ++i) {
    ids[i] = ignoredUsers[i].id;
  }
  return ids;
}

function saveSettings(settings) {
  GM_setValue("settings", JSON.stringify(settings));
}

function updateIgnoredNicksFormat(settings) {
  var i;

  function processNick(jsonData) {
    var imag, src, val;

    imag = $(jsonData).find('.icoinfo');
    src = imag.attr('src');

    val = {
      id: settings.ignored[i],
      img: src
    };

    settings.ignored[i] = val;
  }

  for (i = 0; i < settings.ignored.length; ++i) {
    $.ajax({
      dataType : 'html',
      url      : '?infos&user=' + settings.ignored[i],
      context  : this,
      async    : false,
      success  : processNick
    });
  }
  saveSettings(settings);
}

function getPostOffset(post_element) {
  var elOffset = $(post_element).offset().top - 60,
    elHeight = $(post_element).height(),
    windowHeight = $(window).height(),
    offset;

  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  } else {
    offset = elOffset;
  }

  return offset;
}

function getVideoTag(sources) {
  return $('<video autoplay="" loop="" muted="" preload="">' + sources + '</video>');
}

if (!!settJson) {
  settings = JSON.parse(settJson);
  if (settings.hlenhVer !== currentVersion) {
    settings.firstRun = true;
    settings.hlenhVer = currentVersion;
    switch (settings.hlenhVer) {
      case "1.3.1":
        updateIgnoredNicksFormat(settings);
        /* falls through */
      case "1.3.2":
      case "1.3.3":
        settings.inlineHtml5Video = true;
        settings.allGifsToGfycat = true;
        /* falls through */
      case "1.4":
        settings.hideRepliesToIgnored = true;
        /* falls through */
      case "1.5":
        settings.fixEmbeddedVideoLinks = true;
        settings.appendExpando = true;
        break;
    }
  }

  saveSettings(settings);
} else {
  var ids = [
    {id: "57779", img: "images/ikons/d/dwaltr.gif"},
    {id: "98541", img: "images/ikons/p/piszta.gif"},
    {id: "98294", img: "images/ikons/s/schweinar.gif"}];

  settings = {
    hlenhVer: currentVersion,
    firstRun: true,
    ignore: true,
    ignored: ids,
    showStatus: true,
    autoScrollToNew: true,
    cleanLook: true,
    replyPreview: true,
    inlineHtml5Video: true,
    allGifsToGfycat: true,
    hideRepliesToIgnored: true,
    fixEmbeddedVideoLinks: true,
    appendExpando: true
  };

  saveSettings(settings);
}

if (settings.firstRun) {
  var welcome = $('<div class="row-tip">Gratuluji k instalaci HLENhance v' + settings.hlenhVer +
                  '! Chcete-li zobrazovat vložená videa v HTML5 přehrávači místo zastaralého Flashe, můžete nyní zapnout možnost "Nepoužívat video" v "Nastavení &gt; WWW rozhraní" a skript se o to postará. Mrkněte do Nastavení pro více detailů.</div>');
  var rozumim = $('<a href="javascript:void(0)">Rozumím, nezobrazovat</a>');
  if (oknotip.length === 0) {
    oknotip = $('<div class="okno" id="okno-tip"/>');
    winmain.prepend(oknotip);
  }
  welcome.append(rozumim);
  oknotip.append(welcome);
  rozumim.click(function () {
    settings.firstRun = false;
    saveSettings(settings);
    welcome.fadeOut();
  });
}

if (window.location.search === "?nastaveni&sub=5") {
  var okno, form, ignoreChkbox, cleanChkbox, statusChkbox, autoScrollChkbox,
    replyPreviewChkbox, inlineHtml5VideoChkbox, allGifsToGfycatChkbox,
    fixEmbeddedVideoLinksChkbox, appendExpandoChkbox,
    submitBtn, resetBtn, bottomRow, newSett, div;
  okno = $('<div class="okno"/>');
  okno.append('<div class="nadpis">Nastavení HLENhance ' + settings.hlenhVer + '</div>');
  form = okno.append('<form/>');
  form.append(getBoolSettingsRow('hlenh-ignore', 'Ignore list:', settings.ignore,
                                 'skrývat příspěvky uživatelů v HLENhance ignore listu'));
  ignoreChkbox = form.find('input[name="hlenh-ignore"]');
  form.append(getBoolSettingsRow('hlenh-hiderepl', 'Nekrmte trolla:', settings.hideRepliesToIgnored,
                                 'schovávat i reakce na tyto uživatele'));
  hideRepliesToIgnoredChkbox = form.find('input[name="hlenh-hiderepl"]');
  form.append(getSettingsRow('Seznam uživatelů v Ignore listu:', getIgnoredIcons(settings.ignored)));
  form.append(getBoolSettingsRow('hlenh-clean', 'Čistý vzhled příspěvků:', settings.cleanLook,
                                 'skrývat tlačítka (MAIL, REPLY atd.) u postů (zobrazí se po přejetí myší nad levou horní částí příspěvku)'));
  cleanChkbox = form.find('input[name="hlenh-clean"]');
  form.append(getBoolSettingsRow('hlenh-status', 'Stavový řádek na konci stránky:', settings.showStatus,
                                 'zobrazit stavový řádek userscriptu na konci stránky s různými informacemi a akcemi,' +
                                 'např. dočasné obnovení ignorovaných příspěvků'));
  statusChkbox = form.find('input[name="hlenh-status"]');
  form.append(getBoolSettingsRow('hlenh-autoscroll', 'Tlačítko "Nové" Automaticky:', settings.autoScrollToNew,
                                 'automaticky se posunout na nejstarší nový příspěvek po otevření klubu s nepřečtenými'));
  autoScrollChkbox = form.find('input[name="hlenh-autoscroll"]');
  form.append(getBoolSettingsRow('hlenh-rplprev', 'Náhledy reakcí:', settings.replyPreview,
                                 'je-li to možné, zobrazovat po přejetí myši náhledy na příspěvky, na které je reagováno'));
  replyPreviewChkbox = form.find('input[name="hlenh-rplprev"]');
  form.append(getBoolSettingsRow('hlenh-inlinehtml5v', 'Inline WebM:', settings.inlineHtml5Video,
                                 'pokud odkaz v postu odkazuje na WebM, zobrazit jej inline (funguje pro odkazy na Gfycat nebo Imgur GifV)'));
  inlineHtml5VideoChkbox = form.find('input[name="hlenh-inlinehtml5v"]');
  form.append(getBoolSettingsRow('hlenh-giftogfycat', 'Gif to Gfycat:', settings.allGifsToGfycat,
                                 'převádět GIFy na WebM (pokud ještě nejsou) nebo zobrazovat jejich WebM verzi (pokud již jsou - Gfycat, Imgur)'));
  allGifsToGfycatChkbox = form.find('input[name="hlenh-giftogfycat"]');
  form.append(getBoolSettingsRow('hlenh-fixvidlinks', 'Oprava YouTube Video odkazů:', settings.fixEmbeddedVideoLinks,
                                 'opravit nefunkční odkazy, je-li vypnuto zobrazování vložených videí (vypněte v Nastavení &gt; WWW rozhraní)'));
  fixEmbeddedVideoLinksChkbox = form.find('input[name="hlenh-fixvidlinks"]');
  form.append(getBoolSettingsRow('hlenh-addexpando', 'Zobrazovat Expando:', settings.appendExpando,
                                 'je-li zapnuta předchozí možnost, přidat k odkazu také tlačítko na zobrazení videa přímo ve stránce (HTML5 přehrávač)'));
  appendExpandoChkbox = form.find('input[name="hlenh-addexpando"]');
  form.append($('<div class="row"><ul/>Pro aktuální info o HLENhance sleduj klub <a href="?club&klub=36921"' +
                'title="Vylepšování Hofylandu pomocí JavaScriptu">Vylepšování Hofylandu pomocí JavaScriptu</a>.</div>'));
  submitBtn = $('<input type="submit" name="hlenh-submit" size="0" value="Změnit" class="button">');
  resetBtn = $('<input type="submit" name="hlenh-reset" size="0" value="Obnovit default" class="button">');
  bottomRow = $('<div class="row"><ul><li>&nbsp;</li></ul></div>').append(submitBtn).append('&nbsp;').append(resetBtn);

  form.append(bottomRow);
  winmain.append(form);
  submitBtn.click(function () {
    newSett = {
      hlenhVer: settings.hlenhVer,
      firstRun: settings.firstRun,
      ignore: ignoreChkbox.is(':checked'),
      ignored: settings.ignored,
      showStatus: statusChkbox.is(':checked'),
      autoScrollToNew: autoScrollChkbox.is(':checked'),
      cleanLook: cleanChkbox.is(':checked'),
      replyPreview: replyPreviewChkbox.is(':checked'),
      inlineHtml5Video: inlineHtml5VideoChkbox.is(':checked'),
      allGifsToGfycat: allGifsToGfycatChkbox.is(':checked'),
      hideRepliesToIgnored: hideRepliesToIgnoredChkbox.is(':checked'),
      fixEmbeddedVideoLinks: fixEmbeddedVideoLinksChkbox.is(':checked'),
      appendExpando: appendExpandoChkbox.is(':checked'),
    };
    saveSettings(newSett);
    location.reload();
  });
  resetBtn.click(function () {
    GM_deleteValue("settings");
    location.reload();
  });

  if (settings.showStatus) {
    div = $('<div class="okno"/>');
    elem = $('<div class="row-tip">HLENhance ' + settings.hlenhVer + '</div>');
    div.append(elem);
    winmain.append(div);
  }
} else {
  if (settings.showStatus) {
    div = $('<div class="okno"/>');
    elem = $('<div class="row-tip">HLENhance ' + settings.hlenhVer + ' | <a href="?nastaveni&sub=5">Nastavení</a></div>');
    div.append(elem);
    winmain.append(div);
  }
}

if (strStartsWith(window.location.search, "?club")) {
  if (settings.fixEmbeddedVideoLinks) {
    var wrongLinks = $('a:regex(href,https?://(?:www\\.)?youtube\\.com/v/([-_a-zA-Z\\d]+).*)');
    wrongLinks.each(function () {
      var youtubeLink = $(this);
      var oldHref = youtubeLink.attr('href');
      var videoId = oldHref.replace(/https?:\/\/(?:www\.)?youtube\.com\/v\/([-_a-zA-Z\d]+).*/, "$1");
      youtubeLink.attr('href', 'https://youtu.be/' + videoId);
      youtubeLink.attr('title', 'VIDEO:https://www.youtube.com/watch?v=' + videoId);

      if (settings.appendExpando) {
        $('<style>' +
          '.hlenh-expand { display:inline-block;vertical-align:middle;width:1.5em;height:1.5em;background-size:cover;' +
          'background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9InBsdXNfeDVGX2FsdCI+PHBhdGggZD0iTTE2LDBDNy4xNjQsMCwwLDcuMTY0LDAsMTZzNy4xNjQsMTYsMTYsMTZzMTYtNy4xNjQsMTYtMTZTMjQuODM2LDAsMTYsMHogTTI0LDE4aC02djZoLTR2LTZIOHYtNGg2ICAgVjhoNHY2aDZWMTh6IiBzdHlsZT0iZmlsbDojNEU0RTUwOyIvPjwvZz48L3N2Zz4=") }' +
          '.hlenh-contract { display:inline-block;vertical-align:middle;width:1.5em;height:1.5em;background-size:cover;' +
          'background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9InhfeDVGX2FsdCI+PHBhdGggZD0iTTE2LDBDNy4xNjQsMCwwLDcuMTY0LDAsMTZzNy4xNjQsMTYsMTYsMTZzMTYtNy4xNjQsMTYtMTZTMjQuODM2LDAsMTYsMHogTTIzLjkxNCwyMS4wODYgICBsLTIuODI4LDIuODI4TDE2LDE4LjgyOGwtNS4wODYsNS4wODZsLTIuODI4LTIuODI4TDEzLjE3MiwxNmwtNS4wODYtNS4wODZsMi44MjgtMi44MjhMMTYsMTMuMTcybDUuMDg2LTUuMDg2bDIuODI4LDIuODI4ICAgTDE4LjgyOCwxNkwyMy45MTQsMjEuMDg2eiIgc3R5bGU9ImZpbGw6IzRFNEU1MDsiLz48L2c+PC9zdmc+") }' +
          '</style>').appendTo('head');
        youtubeLink.append('&nbsp;');
        var expandLink = $('<a class="hlenh-expand" href="javascript:void(0)" title="Rozbalit"></a>');
        var contractLink = $('<a class="hlenh-contract" href="javascript:void(0)" title="Sbalit"></a>');
        var tubePlayer = $('<br/><iframe id="ytplayer" type="text/html" width="640" height="360"' +
              'src="https://www.youtube.com/embed/' + videoId + '?origin=http://www.hofyland.cz"' +
              'frameborder="0"></iframe>');
        var loaded = false;

        contractLink.click(function() {
          tubePlayer.hide();
          expandLink.show();
          $(this).hide();
        }).insertAfter(youtubeLink).hide();

        expandLink.click(function () {
          contractLink.show();
          if (loaded) {
            tubePlayer.show();
          } else {
            loaded = true;
            tubePlayer.insertAfter(contractLink);
          }

          $(this).hide();
        }).insertAfter(contractLink);
      }
    });
  }

  if (settings.autoScrollToNew) {
    var nbutton = ($('.nbutton')[0]);
    if (!!nbutton) {
      $(window).scrollTop($(document).height() - $(window).height());
      var pid = $('.nbutton').attr('href');
      if (!pid) {
        pid = "#" + $("a[name]").last().attr("name");
      }

      var el = $(".okno").has("a[name='" + pid.substring(1) + "']");
      if (!el[0]) {
        pid = "#" + $("a[name]").last().attr("name");
        el = $(".okno").has("a[name='" + pid.substring(1) + "']");
      }

      var originalOffset = getPostOffset(el);

      $(window).scrollTop(originalOffset);

      var previousOffset = originalOffset;

      var scrollerInterval = setInterval(function () {
        var currentOffset = getPostOffset(el);
        if (currentOffset > previousOffset) {
          $(window).scrollTop($(window).scrollTop() + currentOffset - previousOffset);
          previousOffset = currentOffset;
        }
      }, 50);

      $(window).load(function () {
        clearInterval(scrollerInterval);
      });

    }
  }

  if (settings.ignore && settings.ignored.length > 0) {
    var count = processPosts(false);

    if (count > 0 && settings.showStatus) {
      elem.append(' | Skryto ' + count + ' příspěvků dle pravidel HLENhance ignore listu. ');
      var link = $("<a href='javascript:void(0)'>Zobrazit</a>");
      link.click(function () {
        processPosts(true);
      });
      elem.append(link);
    }
  }

  if (settings.cleanLook) {
    $('<style id="hlenhanceStyles">' +
      'span.linx span.hlenh-slide-hidden{display:none;}' +
      'span.linx span.hlenh-slide{display:inline-block;}' +
      '</style>').appendTo('head');
    $('div.rowp,div.rowp_nove').each(function () {
      var linx = $(this).find('.linx');
      var cont = linx.contents(),
        firstIndex,
        lastIndex;
      for (var i = cont.length - 1; i >= 0; i--) {
        if (!!$(cont[i]).hasClass('filtr')) lastIndex = i + 2;
        else if (!!$(cont[i]).hasClass('reply')) {
          firstIndex = i;
          break;
        }
      }
      if (!!firstIndex && !!lastIndex) {
        var trigger = cont.slice(0, firstIndex).wrapAll('<span"/>').parent();
        var slideSpan = cont.slice(firstIndex, lastIndex).wrapAll('<span class="hlenh-slide-hidden"/>').parent();
        var hovered = false;
        trigger.mouseover(function() {
          hovered = true;
          setTimeout(function() {
            if (hovered) {
              slideSpan.removeClass('hlenh-slide-hidden');
              slideSpan.addClass('hlenh-slide');
            }
          }, 200);
        });
        linx.mouseleave(function() {
          hovered = false;
          setTimeout(function() {
            if (!hovered) {
              slideSpan.removeClass('hlenh-slide');
              slideSpan.addClass('hlenh-slide-hidden');
            }
          }, 750);
        });
      }
    });
  }

  if (settings.replyPreview) {
    var backcol = background_color($('#mainw')) === 'transparent' ?
        background_color($('body')) : background_color($('#mainw'));
    $('<style>.oknohovr{position:absolute;z-index:10000;background:' + backcol +
      ';width:80% !important;box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);}</style>').appendTo('head');
    var reactions = $(".txtpost a[title='Reakce na příspěvek']");
    reactions.each(function () {
      var $this = $(this);
      var href = $this.attr('href');
      var postId = "post" + href.substring(href.indexOf('&post=') + 6);
      if ($("a[name='" + postId + "']").length > 0) {
        $this.removeAttr('title');
        var linkedPost = $(".rowp,.rowp_nove").has("a[name='" + postId + "']");
        var lpClone = linkedPost.clone();
        lpClone.addClass("okno oknohovr");
        lpClone.find(".hlenh-slide").remove();
        lpClone.find("a[name='" + postId + "']").remove();
        $this.attr('href', '#' + postId);
        $this.hover(function () {
          lpClone.insertAfter($this);
        }, function () {
          lpClone.remove();
        });
      }
    });
  }

  if (settings.inlineHtml5Video) {
    var count = 0;

    var imgurLinks = $('a.linkpost[href*="imgur.com"],a.a-tlink[href*="imgur.com"]');
    imgurLinks.each(function () {
      var link = $(this).attr('href'),
        ext = link.match(/(imgur\.com\/[\w]+\.)([a-zA-Z0-9]+)/);
      //alert(JSON.stringify(ext));
      if (ext[2] && (ext[2] === "gif" || ext[2] === "gifv")) {
        link = link.match(/imgur\.com\/[a-zA-Z0-9]+/);
        $(this).after(getVideoTag('<source src="http://i.' + link + '.webm" type="video/webm">' +
                                  '<source src="http://i.' + link + '.mp4" type="video/mp4">' +
                                  '<img src="http://i.' + link + '.gif"/>'));
        $(this).after('<br>');
        ++count;
      }
    });

    var gfycatLinks = $('a.linkpost[href*="gfycat.com"],a.a-tlink[href*="gfycat.com"]');
    gfycatLinks.each(function () {
      var $this = $(this);
      var link = $this.attr('href');
      var name = link.match(/(gfycat\.com\/)([a-zA-Z]+)/);
      if (name[2]) {
        $.ajax({
          url: "http://upload.gfycat.com/transcode?fetchUrl=" + link
        })
          .done(function (data) {
            if (data.error) {
              window.console.log(JSON.stringify(data));
            } else {
              $this.after(getVideoTag('<source src="' + data.webmUrl + '" type="video/webm">' +
                                      '<source src="' + data.mp4Url + '" type="video/mp4">'));
              $this.after('<br>');
              ++count;
            }
          });
      }
    });

    if (count > 0 && settings.showStatus) {
      elem.append(' | GIFů zobrazeno inline: ' + count);
    }
  }

  if (settings.allGifsToGfycat) {
    var count = 0;

    var convertibleImages = $('img.imgpost[src*="imgur.com"]');
    convertibleImages.each(function () {
      var link = $(this).attr('src');
      var ext = link.match(/(imgur\.com\/[a-zA-Z0-9]+\.)([a-zA-Z0-9]+)/);
      //alert(JSON.stringify(ext));
      if (ext[2] && ext[2] === "gif") {
        link = link.match(/imgur\.com\/[a-zA-Z0-9]+/);
        $(this).after(getVideoTag('<source src="http://i.' + link + '.webm" type="video/webm">' +
                                  '<source src="http://i.' + link + '.mp4" type="video/mp4">'));
        $(this).removeAttr('src');
        ++count;
        $(this).remove();
      }
    });

    var unconvertedImages = $('img.imgpost[src*=".gif"]');
    unconvertedImages.each(function () {
      var $this = $(this);
      var link = $this.attr('src');
      var ext = link.match(/(http|https):\/\/[%\w\.\/]+\.([\w]+)/);
      if (ext[ext.length - 1] === "gif") {
        $.ajax({
          url: "http://upload.gfycat.com/transcode?fetchUrl=" + link
        })
          .done(function (data) {
            if (data.error) {
              window.console.log(JSON.stringify(data));
            } else {
              $this.after(getVideoTag('<source src="' + data.webmUrl + '" type="video/webm">' +
                                      '<source src="' + data.mp4Url + '" type="video/mp4">'));
              $this.removeAttr('src');
              ++count;
              $this.remove();
            }
          });
      }
    });

    if (count > 0 && settings.showStatus) {
      elem.append(' | GIFů převedeno na WebM: ' + count);
    }
  }
}

if (strStartsWith(window.location.search, "?infos")) {
  var form = $('form.nform');
  if (form.length > 0) {
    var uid = window.location.search.match(/user=[0-9]+/g)[0].replace('user=', ''),
      ignoredIds = getIgnoredIds(settings.ignored),
      userIgnored = $.inArray(uid, ignoredIds) > -1,
      ignoreRow = '<div class="row"><ul><li>Ignorovat:</li></ul>';
    if (settings.ignore) {
      if (userIgnored) {
        ignoreRow += 'Ano&nbsp;[&nbsp;<a class="hlenh-toggleign" href="javascript:void(0)" ' +
          'title="Odebrat tohoto uživatele z HLENhance Ignore listu">' +
          'Odebrat z HLENhance Ignore listu</a>&nbsp;]</div>';
        var r = $(ignoreRow);
        r.find('a.hlenh-toggleign').click(function () {
          var index = ignoredIds.indexOf(uid);
          settings.ignored.splice(index, 1);
          saveSettings(settings);
          location.reload();
        });
      } else {
        ignoreRow += 'Ne&nbsp;[&nbsp;<a class="hlenh-toggleign" href="javascript:void(0)" ' +
          'title="Přidat tohoto uživatele do HLENhance Ignore listu">' +
          'Přidat do HLENhance Ignore listu</a>&nbsp;]</div>';
        var r = $(ignoreRow);
        r.find('a.hlenh-toggleign').click(function () {
          settings.ignored.push({id: uid, img: $('.icoinfo').attr('src')});
          saveSettings(settings);
          location.reload();
        });
      }
      form.append(r);
    } else {
      ignoreRow += 'Ne&nbsp;[&nbsp;Ignorace je vypnuta. <a href="?nastaveni&sub=5" ' +
        'title="Nastavení HLENhance">Změnit nastavení</a>';
      ignoreRow += '&nbsp;]</div>';

      form.append($(ignoreRow));
    }
  }
}

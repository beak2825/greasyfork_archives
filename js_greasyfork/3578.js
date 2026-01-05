// ==UserScript==
// @name        ao3 saved filters
// @description Adds fields for persistent global & fandom filters to works index pages on AO3
// @namespace   ao3
// @include     http*://www.archiveofourown.org/*works*
// @include     http*://archiveofourown.org/*works*
// @grant       none
// @version     1.5
// @downloadURL https://update.greasyfork.org/scripts/3578/ao3%20saved%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/3578/ao3%20saved%20filters.meta.js
// ==/UserScript==

(function ($) {
  // config
  var TAG_OWNERSHIP_PERCENT = 70; // the top fandom which owns works in the current tag must own at least this percent in order to be considered the search's active fandom

  var works = $('#main.works-index'), form = $('form#work-filters');
  if (!works[0] || !form[0]) return;

  var fandomName = (function () {
    var fandom = $('#include_fandom_tags label').first().text(),
      fandomCount = parseInt(
        fandom.substring(fandom.lastIndexOf('(') + 1, fandom.lastIndexOf(')'))
      ),
      tagCount = works.find('.heading').first().text();

    tagCount = tagCount.substring(0, tagCount.indexOf(' Works'));
    tagCount = parseInt(tagCount.substring(tagCount.lastIndexOf(' ') + 1));

    fandom = fandom.substring(0, fandom.lastIndexOf('(')).trim();

    if (!fandom || !fandomCount || !tagCount) { return; }

    return (fandomCount / tagCount * 100 > TAG_OWNERSHIP_PERCENT) ? fandom : null;
  })(),
    tempKey = 'temp-filter', tempFilter = localStorage[tempKey],
    tempGlobalKey = 'temp-global-filter',
    tempGlobalFilter = localStorage[tempGlobalKey],
    tempFandomKey = 'temp-fandom-filter',
    tempFandomFilter = localStorage[tempFandomKey],
    globalKey = 'global-filter', fandomKey = fandomName ? 'filter-' + fandomName : '',
    globalBox = $('<textarea>').val(localStorage[globalKey] ?
      localStorage[globalKey] : ''),
    fandomBox = fandomKey ?
      globalBox.clone().val(localStorage[fandomKey] ? localStorage[fandomKey] : '') : $(),
    search = $('#work_search_query'),
    dt = search.parents('dd').first().prev(dt),
    realSearch = $('<textarea>')
      .attr('name', search.attr('name'))
      .css('display', 'none')
      .insertAfter(search.removeAttr('name')),
    collapser = $('<dt>').addClass('saved-filters-collapser'),
    rightArrow = $('<img>').attr('src', '/images/arrow-right.gif?1352358192'),
    downArrow = $('<img>').attr('src', '/images/arrow-down.gif?1352358192'),
    container = $('<div>').addClass('saved-filters'),
    prevSearch = (function () {
      var ps, key = realSearch.attr('name') + '=';
      if (decodeURIComponent(window.location).indexOf(key) > 0) {
        ps = decodeURIComponent(window.location);
        ps = ps.substring(ps.indexOf(key) + key.length);
        ps = ps.indexOf('&') != -1 ? ps.substring(0, ps.indexOf('&')) : ps;
      }
      return ps;
    })();

  $('<style>').text(
    '.saved-filters-collapser { cursor: pointer; } .saved-filters, saved-filters > div { margin-bottom: 0.6em; } .saved-filters { border-style: solid; border-width: 1px; padding: 0.6em; } .saved-filters textarea { min-height: 8em; } .saved-filters div label { padding-left: 3px; } .prev-search span { color: #000; } .prev-search .temp { background: #ACEA72; } .prev-search .global { background: #93D2ED; } .prev-search .fandom { background: #B9AAED; }'
  ).appendTo($('head'));

  globalBox.addClass('global-filter')
    .add(fandomBox.addClass('fandom-filter'))
    .each(function () {
      var ta = $(this),
        cls = ta.attr('class'),
        title = cls.charAt(0).toUpperCase() + cls.substring(1, cls.indexOf('-')) + ':';

      $('<div>').addClass(`${cls} ao3-saved-filters-section`)
        .prepend(title)
        .append(ta.removeClass(),
          $('<label>').text('Enabled')
            .prepend(
              $('<input>').attr({ 'type': 'checkbox' })
                .addClass('js-enabled-checkbox')
                .css({
                  clip: 'auto',
                  'margin-right': '0.3em',
                  position: 'relative',
                  width: 'auto',
                })
            ),
          $('<button>')
            .attr('type', 'button')
            .addClass('action js-save-filter')
            .text('Save')
        ).appendTo(container);
    });

  container.find('.ao3-saved-filters-section').each(function () {
    var $section = $(this),
      $checkbox = $section.find('.js-enabled-checkbox'),
      $saveButton = $section.find('.js-save-filter'),
      key = $saveButton.parents('.global-filter')[0] ? globalKey : fandomKey,
      checked = localStorage[key + '-on'] !== 'false';

    $checkbox.attr('checked', checked);
    $saveButton.click(function () {
      localStorage[key] = $saveButton.siblings('textarea').val();
      localStorage[key + '-on'] = $checkbox.is(':checked') + '';
    });
  });

  if (tempFilter && search.val().indexOf(tempFilter) != -1) {
    search.val(tempFilter);
  } else {
    localStorage[tempFilter] = '';
    search.val('');
  }

  container = $('<dd>').append(container);

  collapser.prepend(rightArrow,
    ' Saved filters'
  ).click(function () {
    container.toggle();
    collapser.children('img').replaceWith(
      container.is(':visible') ? downArrow : rightArrow);
  }).add(container.hide()).insertBefore(dt);

  form.submit(function () {
    var val = search.val() || '';

    container.find('.ao3-saved-filters-section').each(function () {
      var $section = $(this);
      var $textarea = $section.find('textarea');
      var enabled = $section.find('.js-enabled-checkbox').is(':checked');
      var key = $textarea.parents('.global-filter')[0] ? tempGlobalKey : tempFandomKey;

      if ($textarea.val() && enabled) {
        localStorage[key] = $textarea.val();

        if ((' ' + val + ' ').indexOf(' ' + $textarea.val() + ' ') < 0) {
          val += ' ' + $textarea.val();
        }
      } else if (localStorage[key]) { 
        localStorage[key] = '';
      }
    });

    localStorage[tempKey] = search.val();
    realSearch.val(val);
  });

  if (prevSearch) {
    prevSearch = 'Your filter was: ' + decodeURIComponent(prevSearch).split('+').join(' ') + '.';
    if (tempFilter) {
      prevSearch = prevSearch.replace(tempFilter, '<span class="temp">' + tempFilter + '</span>');
    }
    if (tempGlobalFilter) {
      prevSearch = prevSearch.replace(tempGlobalFilter, '<span class="global">' + tempGlobalFilter + '</span>');
    }
    if (tempFandomFilter) {
      prevSearch = prevSearch.replace(tempFandomFilter, '<span class="fandom">' + tempFandomFilter + '</span>');
    }

    works.find('.heading').first().after(
      $('<div>').addClass('prev-search').append(prevSearch));
  } else if ((localStorage[globalKey] && localStorage[globalKey + '-on'] !== 'false') ||
    (localStorage[fandomKey] && localStorage[fandomKey + '-on'] !== 'false')) {
    form.submit();
  }

})(window.jQuery);

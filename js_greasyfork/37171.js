// ==UserScript==
// @name         Trello coloured Scrum Kanban
// @namespace    https://trello.com/
// @version      3.2
// @description  Colour lists & cards, show WIP and story-point insights
// @match        https://trello.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @author       Michael Wan
// @downloadURL https://update.greasyfork.org/scripts/37171/Trello%20coloured%20Scrum%20Kanban.user.js
// @updateURL https://update.greasyfork.org/scripts/37171/Trello%20coloured%20Scrum%20Kanban.meta.js
// ==/UserScript==
(function($) {
  'use strict';

  //── configs ────────────────────────────────────────────────────────────
  const COLORS = {
    list: {
      Development: '#9ec4ff',
      Testing:     '#dbffd1',
      'Ready to Deploy': '#c4c4c4',
      Deployed:    '#898989'
    },
    cardBorder: {
      '!!': '#ff8300',
       '!': '#ffd800',
      '`': '#dbf3ff'
    },
    cardBg: {
      '[P]': '#fdffbf',
      '[Parent]': '#fdffbf',
      Blocked: '#fabaff',
      '[VIP]': '#ff6363',
      '[R]': '#eeffbf',
      '[INFO]': '#e0f8ff'
    },
    idColor:       '#ffd396',
    noEstimate:    '#c1150f',
    whiteText:     '#fff',
    wipHighlight:  'yellow'
  };
  const WIP_LIMIT  = 2;
  const REFRESH_MS = 2000;

  //── list colouring ────────────────────────────────────────────────────
  function colorLists() {
    $('.list-wrapper').each(function() {
      const title = $(this)
        .find('.list-header-name-assist')
        .text()
        .trim();
      const bg = COLORS.list[title];
      if (bg) {
        $(this)
          .css('background', bg)
          .find('h2')
          .css('color', COLORS.whiteText);
      }
    });
  }

  //── card borders & backgrounds ────────────────────────────────────────
  function styleCards() {
    $("[data-testid='trello-card']").each(function() {
      const $card = $(this);
      const text  = $card.text();

      // reset
      $card.css({ border: '', background: '' });

      // borders
      for (const [marker, color] of Object.entries(COLORS.cardBorder)) {
        if (text.includes(marker)) {
          $card.css('border', `5px solid ${color}`);
          break; // only one border
        }
      }

      // backgrounds
      for (const [marker, color] of Object.entries(COLORS.cardBg)) {
        if (text.includes(marker)) {
          $card.css('background', color);
          break;
        }
      }
    });
  }

  //── show card IDs & highlight missing estimates ───────────────────────
  function annotateCardIds() {
    $('.card-short-id')
      .append(' ')
      .removeClass('hide')
      .css('color', COLORS.idColor);

    $('.js-card-name').filter(function() {
      return !/\(\d+\)/.test($(this).text());
    })
    .find('.card-short-id')
    .css('color', COLORS.noEstimate);
  }

  //── compute & display WIP per member ──────────────────────────────────
  function updateWIP() {
    $('#actualWIP').remove();
    const $header = $('.board-header');
    if (!$header.length) return;

    $header.after(
      `<div id="actualWIP" style="color:${COLORS.whiteText}">
         ActualWIP (excl. Blocked):
       </div>`
    );

    // initialize members
    const counts = new Map();
    $('img.member-avatar').each(function() {
      const name = this.alt.replace(/\(.+\)/, '');
      counts.set(name, 0);
    });

    // find "In Progress" list
    const $inProg = $('textarea:contains("In Progress")')
      .closest('.list-wrapper');

    // tally assignments
    const tally = (selector, map) =>
      $inProg.find(selector).each(function() {
        const name = this.alt.replace(/\(.+\)/, '');
        map.set(name, (map.get(name)||0) + 1);
      });

    const normal = new Map(), blocked = new Map();
    tally('img.member-avatar', normal);
    tally(
      "span[title='Blocked'], span[title='Keep Monitoring'], \
       span[title='Pending for Desk Check'], span[title='[Parent]'], span[title='[P]']"
      + ' .closest("a.list-card") img.member-avatar',
      blocked
    );

    // compute actual WIP = normal − blocked
    for (const name of counts.keys()) {
      const n = normal.get(name) || 0;
      const b = blocked.get(name) || 0;
      counts.set(name, n - b);
    }

    // render
    counts.forEach((v, name) => {
      const text = `${name}: ${v}`;
      const html = (v === 0 || v > WIP_LIMIT)
        ? `<b style="color:${COLORS.wipHighlight}">${text}</b>`
        : text;
      $('#actualWIP').append(html + ' , ');
    });
  }

  //── story-point & card-count insights ─────────────────────────────────
  function updateListInsights() {
    $('.StoryPtInsight').remove();

    $('.list-wrapper').each(function() {
      const $list = $(this);
      const count = $list.find('.list-card').length;

      let pts = 0, miss = 0;
      $list.find('.badge-text').each(function() {
        const t = $(this).text();
        const n = parseFloat(t);
        if (t === 'Unestimated') miss++;
        else if (!isNaN(n))        pts += n;
      });

      const insight = `
        <p class="StoryPtInsight">
          <b style="color:green">#Cards:${count}</b>
          <b style="color:blue">#StoryPt:${pts}</b>
          ${miss ? `<b style="color:red">#Miss:${miss}</b>` : ''}
        </p>`;
      $list.find('textarea.list-header-name').after(insight);
    });
  }

  //── orchestrator ──────────────────────────────────────────────────────
  function refreshAll() {
    colorLists();
    styleCards();
    annotateCardIds();
    updateWIP();
    updateListInsights();
  }

  //── kick off on load + every REFRESH_MS ────────────────────────────────
  $(document).ready(() => {
    refreshAll();
    setInterval(refreshAll, REFRESH_MS);
  });

})(jQuery);
// ==UserScript==
// @name         Global rename queue
// @license MIT; https://opensource.org/licenses/MIT
// @version      v1.3
// @description  글로벌리네임큐
// @author       기나ㅏㄴ
// @match        https://*.wikipedia.org/*
// @match        https://*.wiktionary.org/*
// @match        https://*.wikibooks.org/*
// @match        https://*.wikinews.org/*
// @match        https://*.wikiquote.org/*
// @match        https://*.wikisource.org/*
// @match        https://*.wikiversity.org/*
// @match        https://*.wikivoyage.org/*
// @match        https://*.wikimedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @connect      meta.wikimedia.org
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1375672
// @downloadURL https://update.greasyfork.org/scripts/532865/Global%20rename%20queue.user.js
// @updateURL https://update.greasyfork.org/scripts/532865/Global%20rename%20queue.meta.js
// ==/UserScript==

(function ($) {
  $(function () {
    const $html = $(`
      <div class='portlet mw-portlet mw-portlet-global_rename_queue' id='p-global_rename_queue' role='navigation'>
        <h3>Global Rename Queue</h3>
        <div class='pBody'>
          <label style="display:block; margin-bottom: 0.5em;">
            <input type="checkbox" id="show-all-wikis" />
            See all wikis
          </label>
          <ul></ul>
        </div>
      </div>
    `);

    $('#p-search').after($html);
    const $list = $html.find('ul');
    const $checkbox = $html.find('#show-all-wikis');

    const queueUrl =
      'https://meta.wikimedia.org/wiki/Special:GlobalRenameQueue/open?username=&newname=&limit=100&type=0';

    const userItems = [];

    function fetchAndRenderList() {
      $list.empty();
      userItems.length = 0;

      GM_xmlhttpRequest({
        method: 'GET',
        url: queueUrl,
        onload: function (response) {
          const data = response.responseText;
          const $doc = $(data);
          $doc.find('table.mw-datatable tbody tr').each(function () {
            const $tr = $(this);
            const curUserLink = $tr.find('td.TablePager_col_rq_name a');
            const newUserLink = $tr.find('td.TablePager_col_rq_newname a');
            const actionLink = $tr.find('td.TablePager_col_row_actions a');

            const curUserHtml = curUserLink.length ? curUserLink.prop('outerHTML') : '';
            const newUserHtml = newUserLink.length ? newUserLink.prop('outerHTML') : '';
            const actionLinkHtml = actionLink.length ? actionLink.prop('outerHTML') : '';
            const liItem = $('<li style="display:none;"></li>'); // 기본은 숨김 상태

            liItem.html(
              curUserHtml +
                '<br>→ ' +
                newUserHtml +
                '<br>' +
                actionLinkHtml +
                ' <span class="homewiki">(Loading...)</span>'
            );

            $list.append(liItem);
            userItems.push({ liItem, curUserLink });

            if (curUserLink.length) {
              const username = curUserLink.text();
              const apiUrl =
                'https://meta.wikimedia.org/w/api.php?action=query&format=json&meta=globaluserinfo&guiuser=' +
                encodeURIComponent(username);

              GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function (resp) {
                  try {
                    const json = JSON.parse(resp.responseText);
                    const homewiki = json?.query?.globaluserinfo?.home || '';
                    liItem.find('.homewiki').text('(' + homewiki + ')');
                    liItem.attr('data-homewiki', homewiki);

                    // 필터링
                    if ($checkbox.prop('checked') || homewiki === 'kowiki') {
                      liItem.show();
                    }
                  } catch (e) {
                    console.error('Failed to parse homewiki response:', e);
                    liItem.find('.homewiki').text('(error)');
                    liItem.attr('data-homewiki', 'unknown');
                    // 기본적으로 숨김
                  }
                },
                onerror: function (err) {
                  console.error('Homewiki API error:', err);
                  liItem.find('.homewiki').text('(error)');
                  liItem.attr('data-homewiki', 'unknown');
                }
              });
            }
          });
        },
        onerror: function (err) {
          console.error('Error in GM_xmlhttpRequest:', err);
        }
      });
    }

    // 변경사항
    $checkbox.on('change', function () {
      const showAll = $(this).prop('checked');
      userItems.forEach(({ liItem }) => {
        const homewiki = liItem.attr('data-homewiki');
        if (!homewiki) return; // 로딩 x

        if (showAll || homewiki === 'kowiki') {
          liItem.show();
        } else {
          liItem.hide();
        }
      });
    });

    fetchAndRenderList();
  });
})(window.jQuery);

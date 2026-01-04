// ==UserScript==
// @name         massRollmove
// @version      2024-10-04
// @description  문서 훼손 방지 스크립트입니다. 위험한 스크립트입니다. 절대 공개적으로 게시하지 마십시오. 사용 순서는 massRollback을 사용한 후 massRollmove를 활용하는 것이 맞습니다. 특수:기록 문서에서 사용하세요.
// @author       기나ㅏㄴ
// @license      CC BY-SA 4.0; https://creativecommons.org/licenses/by-sa/4.0/
// @include      https://*.wikipedia.org/*
// @include      http://*.wikipedia.org/*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1375672
// @downloadURL https://update.greasyfork.org/scripts/511141/massRollmove.user.js
// @updateURL https://update.greasyfork.org/scripts/511141/massRollmove.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // 대기
  function waitForMwLoader() {
    return new Promise((resolve) => {
      const checkMwLoader = setInterval(() => {
        if (mw.loader) {
          clearInterval(checkMwLoader);
          resolve();
        }
      }, 100);
    });
  }

  // waitForMwLoader 후 실행
  function onPageLoad(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  }

  // 메인
  function initializeScript() {
    mw.loader
      .using([
        'mediawiki.util',
        'mediawiki.api',
        'jquery',
        'mediawiki.notification',
      ])
      .then(function () {
        var currentSpecialPage = mw.config.get('wgCanonicalSpecialPageName');
        var userGroups = mw.config.get('wgUserGroups');
        var isAdmin = userGroups && userGroups.includes('sysop');
        if (currentSpecialPage !== 'Log' || !isAdmin) {
          return;
        }

        mw.util.addPortletLink(
          'p-cactions',
          '#',
          'massRollmove',
          'massRollmove-script',
          '문서를 선택하고 클릭하면 이동됩니다.'
        );

        var moveTargets = [];
        var selectedCheckboxes = [];

        $('.mw-logline-move').each(function () {
          var $logEntry = $(this);
          var $checkbox = $logEntry.find('input[type="checkbox"]:first');

          $checkbox.on('change', function () {
            if ($checkbox.prop('checked')) {
              selectedCheckboxes.push($checkbox);
            } else {
              selectedCheckboxes = selectedCheckboxes.filter(function (item) {
                return item !== $checkbox;
              });
            }
          });
        });

        $('#massRollmove-script').on('click', function (e) {
          e.preventDefault();

          if (!confirm('선택한 문서들을 이동하시겠습니까?')) {
            mw.notify('작업이 취소되었습니다.', {
              type: 'info',
              autoHide: true,
            });
            return;
          }

          var api = new mw.Api();
          moveTargets = [];

          selectedCheckboxes.forEach(function ($checkbox) {
            var $logEntry = $checkbox.closest('.mw-logline-move');
            var $userLink = $logEntry.find('a.mw-userlink').last();
            var $toTitle = $userLink.nextAll('a').first();
            var $fromTitle = $toTitle.nextAll('a').first();

            var fromTitle = $fromTitle.text().trim();
            var toTitle = $toTitle.text().trim();

            if (fromTitle && toTitle) {
              moveTargets.push({ from: fromTitle, to: toTitle });
            }
          });

          if (moveTargets.length > 0) {
            processMovesSequentially(0);
          } else {
            mw.notify('선택된 항목이 없거나, 유효한 이동 대상이 없습니다.', {
              type: 'warn',
            });
          }

          function processMovesSequentially(index) {
            if (index >= moveTargets.length) {
              mw.notify('모든 이동 작업이 완료되었습니다.', {
                type: 'success',
                autoHide: false,
              });
              location.reload();
              return;
            }

            var target = moveTargets[index];
            mw.notify('이동 중: ' + target.from + ' → ' + target.to, {
              autoHide: true,
            });

            api
              .get({
                action: 'query',
                titles: target.to,
              })
              .done(function (data) {
                var pages = data.query.pages;
                var pageExists = Object.keys(pages)[0] !== '-1';

                if (pageExists) {
                  mw.notify(
                    '대상 문서 ' +
                      target.to +
                      '이(가) 이미 존재합니다. 이동 작업 전에 삭제합니다.',
                    { type: 'warn' }
                  );

                  setTimeout(function () {
                    api
                      .postWithToken('csrf', {
                        action: 'delete',
                        title: target.to,
                        reason: `${target.from}에서 문서를 이동하기 위해 삭제함 - [[user:기나ㅏㄴ/massRollmove|massRollmove]]`,
                      })
                      .done(function () {
                        mw.notify('기존 문서 삭제 성공: ' + target.to, {
                          type: 'info',
                          autoHide: true,
                        });
                        setTimeout(() => movePage(target, index), 100);
                      })
                      .fail(function (deleteError) {
                        console.error(
                          '기존 문서 삭제 실패: ' + target.to,
                          deleteError
                        );
                        mw.notify(
                          '기존 문서 삭제 실패: ' +
                            target.to +
                            ' - 오류: ' +
                            (deleteError.info || '추가 정보 없음'),
                          { type: 'error' }
                        );
                        setTimeout(
                          () => processMovesSequentially(index + 1),
                          100
                        );
                      });
                  }, 100);
                } else {
                  setTimeout(() => movePage(target, index), 100);
                }
              })
              .fail(function (queryError) {
                console.error(
                  '대상 문서 존재 여부 확인 실패: ' + target.to,
                  queryError
                );
                mw.notify(
                  '대상 문서 존재 여부 확인 실패: ' +
                    target.to +
                    ' - 오류: ' +
                    (queryError.info || '추가 정보 없음'),
                  { type: 'error' }
                );
                setTimeout(() => processMovesSequentially(index + 1), 100);
              });
          }

          function movePage(target, index) {
            api
              .postWithToken('csrf', {
                action: 'move',
                from: target.from,
                to: target.to,
                reason:
                  '문서 이동 훼손을 되돌림 - [[user:기나ㅏㄴ/massRollmove|massRollmove]]',
                movetalk: false,
                noredirect: true,
              })
              .done(function () {
                mw.notify(
                  '성공적으로 이동 완료: ' + target.from + ' → ' + target.to,
                  { type: 'success' }
                );
                setTimeout(() => processMovesSequentially(index + 1), 1000);
              })
              .fail(function (moveError) {
                console.error(
                  '이동 실패: ' + target.from + ' → ' + target.to,
                  moveError
                );
                mw.notify(
                  '이동 실패: ' +
                    target.from +
                    ' → ' +
                    target.to +
                    ' - 오류: ' +
                    (moveError.info || '추가 정보 없음'),
                  { type: 'error' }
                );
                setTimeout(() => processMovesSequentially(index + 1), 1000);
              });
          }
        });
      });
  }

  // 초기화 파트
  onPageLoad(() => {
    waitForMwLoader().then(initializeScript);
  });
})();
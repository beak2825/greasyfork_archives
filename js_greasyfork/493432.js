// ==UserScript==
// @name         DuplicateCheckerOnFinebook
// @version      2025-09-30.0
// @description  Script to check for duplicate rental on finebook
// @author       hackurity01
// @match        https://finebook.co.kr/book/brw_book.do?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @namespace https://greasyfork.org/users/1131208
// @downloadURL https://update.greasyfork.org/scripts/493432/DuplicateCheckerOnFinebook.user.js
// @updateURL https://update.greasyfork.org/scripts/493432/DuplicateCheckerOnFinebook.meta.js
// ==/UserScript==

(function () {
  console.log('DuplicateCheckerOnFinebook init');

  const $rentButton = $(
    '#memberId ~ .form-group > .input-group > .input-group-append > button'
  );
  const $barcodeBook = $('#barcodeBook');
  const onclick = $rentButton.attr('onclick');

  window.__checkDuplication__ = unsafeWindow.__checkDuplication__ =
    function () {
      const bookId = $barcodeBook.val();
      const memberId = $('#memberId').val();

      console.group('중복 대여 체크');
      console.log('Member ID:', memberId);
      console.log('Book ID:', bookId);

      fetch(`https://finebook.co.kr/member/member_view.do?memberId=${memberId}`)
        .then((res) => res.text())
        .then((text) => {
          const parser = new DOMParser();
          const $trList = $(parser.parseFromString(text, 'text/html')).find(
            '.brw__log__member tbody tr'
          );

          const isFirstRental =
            ($trList.toArray()[0] || {}).children.length === 1;

          if (!isFirstRental) {
            const rentedAllBookList = $trList.toArray().map((item) => ({
              id: item.children[0].innerText.trim(),
              title: item.children[1].innerText.trim(),
              author: item.children[2].innerText.trim(),
              bookId: parseInt(item.children[3].innerText.trim(), 10).toString(),
              duration: `${item.children[4].innerText.trim()} ~ ${item.children[5].innerText.trim()}`,
            }));

            const rentedBooks = rentedAllBookList.filter(
              (b) => b.bookId.trim() === bookId.trim()
            );
            const rentedBook = rentedBooks[0];
            console.log('대여 기록:', rentedBooks);

            if (rentedBook) {
              const keepRent = confirm(
                `이미 대출한 적 있는 책입니다. (대출 횟수: ${rentedBooks.length})\n---------------------------\n${rentedBook.title}\n(${rentedBook.author})\n[${rentedBook.duration}]\n\n그래도 대출하시겠습니까?`
              );

              if (!keepRent) {
                return;
              }
            }
          }

          eval(onclick);
        })
        .catch((e) => {
          console.error('중복 대여 체크 과정 중에 문제가 발생하였습니다.', e);
          eval(onclick);
        })
        .finally(() => {
          console.groupEnd();
        });
    };

  window.__brwBookEnterKeyDown__ = unsafeWindow.__brwBookEnterKeyDown__ =
    function () {
      if (event.keyCode == 13) {
        if (__checkDuplication__) __checkDuplication__();
        else if (__checkDuplication__) __checkDuplication__();
        else eval(onclick);
      }
    };

  $rentButton.attr('onclick', `__checkDuplication__()`);
  $barcodeBook.attr('onkeydown', `__brwBookEnterKeyDown__()`);
})();

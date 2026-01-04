// ==UserScript==
// @name         Everytime 여러줄 입력하기
// @namespace    http://everytime.kr/
// @version      1.0
// @description  input[type="text"][maxlength]를 textarea로 변환
// @author       You
// @match        https://everytime.kr/*/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=everytime.kr
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538923/Everytime%20%EC%97%AC%EB%9F%AC%EC%A4%84%20%EC%9E%85%EB%A0%A5%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/538923/Everytime%20%EC%97%AC%EB%9F%AC%EC%A4%84%20%EC%9E%85%EB%A0%A5%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const functions = {
        writeComment: function ($form) {
			var $article = $form.parents('article');
			var $text = $form.find('[name="text"]');
			var $option = $form.find('ul.option');
			var isAnonym = ($option.is(':has(li.anonym)') && $option.find('li.anonym').hasClass('active')) ? 1 : 0;
			if ($text.val().replace(/ /gi, '') === '') {
				alert('내용을 입력해 주세요.');
				$text.focus();
				return false;
			}
			var params = {
				text: $text.val(),
				is_anonym: isAnonym
			};
			if ($form.data('parentId')) {
				params.comment_id = $form.data('parentId');
			} else {
				params.id = $article.data('id');
			}
			$.ajax({
				url: _apiServerUrl + '/save/board/comment',
				xhrFields: {withCredentials: true},
				type: 'POST',
				data: params,
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0' || responseCode === '-3') {
						alert('댓글을 작성할 수 없습니다.');
					} else if (responseCode == '-1') {
						alert('너무 자주 댓글을 작성할 수 없습니다.');
					} else if (responseCode === '-2') {
						alert('내용을 입력해 주세요.');
					} else {
						location.reload();
					}
				}
			});
		},
		createChildCommentForm: function ($comment) {
			var $commentForm = $articles.find('> article > div.comments > form.writecomment').filter(function () {
				return $(this).data('parentId') === $comment.data('id');
			});
			if ($commentForm.length === 0) {
				$commentForm = $articles.find('> article > div.comments > form.writecomment:not(.child)').clone().addClass('child').data('parentId', $comment.data('id'));
				$commentForm.find('[name="text"]').attr('placeholder', '대댓글을 입력하세요.');
				var $beforeComment = $articles.find('> article > div.comments > article.child').filter(function () {
					return $(this).data('parentId') === $comment.data('id');
				}).last();
				if ($beforeComment.length === 0) {
					$beforeComment = $articles.find('> article > div.comments > article.parent').filter(function () {
						return $(this).data('id') === $comment.data('id');
					});
				}
				$commentForm.insertAfter($beforeComment);
			}
			$commentForm.find('[name="text"]').focus();
		},
    }

    
    setInterval(() => {
        document.querySelectorAll('input[type="text"][maxlength], textarea[name="text"]').forEach(input => {
            // 이미 변환된 경우 무시
            if (input.tagName.toLowerCase() === 'textarea' && input.dataset.convertedToTextarea) return;
            if (input.tagName.toLowerCase() === 'input') {
                const textarea = document.createElement('textarea');
                for (const attr of input.attributes) {
                    textarea.setAttribute(attr.name, attr.value);
                }
                textarea.value = input.value;
                textarea.className = input.className;
                textarea.name = input.name;
                Object.assign(textarea.style, {
                    padding: "10px 85px 10px 10px",
                    border: 0,
                    width: `100%`,
                    height: `40px`,
                    lineHeight: `20px`,
                    boxSizing: `border-box`,
                    color: `#262626`,
                    fontSize: `13px`,
                    overflow: `hidden`,
                    resize: `none`,
                    backgroundColor: `transparent`,
                });
                // height autoresize
                const autoResize = (el) => {
                    el.style.height = 'auto';
                    el.style.height = (el.scrollHeight < 40 ? 40: el.scrollHeight) + 'px';
                };
                textarea.addEventListener('input', () => autoResize(textarea));
                autoResize(textarea);
                textarea.dataset.convertedToTextarea = '1';
                input.parentNode.replaceChild(textarea, input);
                input = textarea;
            }
            // textarea에 ctrl+Enter 이벤트 연결
            if (!input.dataset.eventBound) {
                input.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === 'Enter') {
                        const $form = $(this).closest('form.writecomment');
                        if ($form.hasClass('child')) {
                            // 대댓글: createChildCommentForm
                            functions.createChildCommentForm($form);
                        } else {
                            // 일반 댓글: writeComment
                            functions.writeComment($form);
                        }
                        e.preventDefault();
                    }
                });
                input.dataset.eventBound = '1';
            }
        });
        // li.submit 클릭 이벤트 위임
        document.querySelectorAll('form.writecomment').forEach(form => {
            const $form = $(form);
            const $option = $form.find('ul.option');
            if ($option.length) {
                let $anonym = $option.find('li.anonym');
                const submitLi = $option.find('li.submit');
                // form 고유 id (parentId 우선, 없으면 id)
                const formId = $form.data('parentId') || $form.closest('article').data('id') || '';
                const storageKey = 'anonym-active-' + formId;
                // li.anonym 없으면 생성해서 submit 앞에 삽입
                if ($anonym.length === 0 && submitLi.length) {
                    $anonym = $('<li class="anonym"></li>');
                    submitLi.before($anonym);
                }
                // localStorage에서 상태 불러와서 .active 반영
                if ($anonym.length) {
                    const isActive = localStorage.getItem(storageKey) === '1';
                    $anonym.toggleClass('active', isActive);
                    // 클릭 이벤트 바인딩
                    if (!$anonym.data('eventBound')) {
                        $anonym.on('click', function() {
                            const nowActive = !$(this).hasClass('active');
                            $(this).toggleClass('active', nowActive);
                            localStorage.setItem(storageKey, nowActive ? '1' : '0');
                        });
                        $anonym.data('eventBound', 1);
                    }
                }
            }
        });
    }, 10);
})();

// ==UserScript==
// @name         코네 게시글 URL 추출
// @version      2025-06-20
// @description  get urls
// @author       kts
// @match        https://kone.gg/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        none
// @require      https://code.jquery.com/jquery-4.0.0-beta.slim.min.js
// @namespace https://greasyfork.org/users/1257400
// @downloadURL https://update.greasyfork.org/scripts/538888/%EC%BD%94%EB%84%A4%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20URL%20%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/538888/%EC%BD%94%EB%84%A4%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20URL%20%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */
    // Your code here...

    $(document).on("click", "a[data-slot='pagination-link']", function(){
        $(".custom_contents").empty();
    });

    $(document).on("click", ".button-extract", function(){
        $(".custom_contents").empty();
        let urls = [];

        $("div.contents a").each(function(){
            let href = 'https://kone.gg' + $(this).attr('href');
            urls.push(href);
            console.log(href);
            let subj = $(this).find("span[class=' overflow-hidden text-nowrap text-ellipsis']").text();
            $(".custom_contents").append('<div class="flex items-center gap-1 url_items" title="'+subj+'">' + href + '</div>');
        });
    });

    $(document).on("click", ".button-copy", function(){
        const divs = document.querySelectorAll('div.url_items');
        const allDivText = Array.from(divs).map(div => div.innerText);
        const textToCopy = allDivText.join('\n');

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
            console.log("클립보드 복사 성공:\n", textToCopy);
        })
            .catch(err => {
            console.error('클립보드 복사 실패:', err);
        });

        const tooltip = document.getElementById('myTooltip');
        tooltip.classList.add('show');
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
    });

    let div_html = `
    <div class="overflow-hidden bg-zinc-100 md:rounded-lg dark:bg-zinc-800">
    <div class="p-4 pt-0">
    <div class="py-3 flex gap-1.5 items-center ">
    <h1 class="text-lg font-semibold"><small>게시글 URL</small></h1>
    <span class="text-sm">•</span>
    <button data-slot="button" class="custom-button button-extract">추출</button>
    <button data-slot="button" class="custom-button button-copy tooltip-container ">복사 <span class="tooltip-text" id="myTooltip">복사됨</span></button>
    <button data-slot="button" class="custom-button bg-red-500" onClick=" $('.custom_contents').empty();">지우기</button>
     </div>
    <ul class="space-y-2  ">
    <span class="flex flex-col items-start justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-400 custom_contents scroll-box">
    <div class="flex items-center gap-1 url_items"></div></span></ul>
    </div>
    </div>
    `;
    let css = `
    <style>
        .custom-button {
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      font-size: 14px; /* text-sm */
      font-weight: 500; /* font-medium */
      height: 32px; /* h-8 */
      gap: 6px; /* gap-1.5 */
      padding: 0 12px; /* px-3 and !px-3 */
      border: 0; /* border-0 */
      border-radius: 9999px; /* rounded-full */
      border-color: rgb(212, 212, 216); /* approximate border-zinc-300 */
      background-color: oklch(0.623 0.214 259.815); /* bg-blue-500 */
      color: rgb(255, 255, 255); /* text-white */
      cursor: pointer;
      transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1); /* transition-all */
      outline: none; /* outline-none */
      /* disabled styles */
      /* opacity: 0.5; */ /* disabled:opacity-50 */
      /* pointer-events: none; */ /* disabled:pointer-events-none */
    }

    .custom-button:hover {
      background-color: oklch(0.583 0.223 260.35); /* approximate hover:bg-blue-600 */
    }

    @media (prefers-color-scheme: dark) {
      .custom-button {
        border-color: rgb(82, 82, 91); /* dark:border-zinc-700 */
      }
    }

    .scroll-box {
  padding: 5px;
  max-height: 340px;
  overflow-y: auto;
}

        .tooltip-container {
            position: relative;
            display: inline-block;
        }

        .tooltip-text {
            visibility: hidden;
            opacity: 0;
            width: 120px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px 0;
            position: absolute;
            z-index: 1;
            bottom: -40px;
            left: 50%;
            margin-left: -60px;
            transition: opacity 0.3s;
        }

        .tooltip-text.show {
            visibility: visible;
            opacity: 1;
        }

    /* Additional styles for SVG children might be needed */
    </style>
`

    let createdDiv = document.createElement('div');
    createdDiv.innerHTML = div_html+css;
    $('div[class="hidden lg:block"]').parent().append(div_html+css);

})();
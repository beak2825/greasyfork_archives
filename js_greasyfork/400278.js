// ==UserScript==
// @name         Jira Cloud issue templates buttons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Set Bug and Story description templates for new issue on Jira
// @author       Pavel Belousov
// @match        *://*.atlassian.net/*
// @exclude      *://*.atlassian.net/wiki/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/400278/Jira%20Cloud%20issue%20templates%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/400278/Jira%20Cloud%20issue%20templates%20buttons.meta.js
// ==/UserScript==
(() => {
  function rafAsync() {
    return new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  }

  function checkElement(selector) {
    if (document.querySelector(selector) === null) {
      return rafAsync().then(() => checkElement(selector));
    } else {
      return Promise.resolve(true);
    }
  }

  const buttons = `<a class="aui-button aui-button-subtle wiki-edit-operation"
   data-insert-template="story"
   href="#"
   tabindex="-1"
   title="Insert Task template"
>
  <span class="aui-icon aui-icon-small aui-iconfont-like"
        style="color: #63ba3c">
    Insert meaningful text here for accessibility
  </span>
</a>
<a class="aui-button aui-button-subtle wiki-edit-operation"
   data-insert-template="bug"
   href="#"
   tabindex="-1"
   title="Insert Bug template"
>
  <span class="aui-icon aui-icon-small aui-iconfont-warning"
        style="color: #e5493a"
  >
    Insert bug template
  </span>
</a>`;

  const templates = {
    story: `h2.История
\\\\
*Я как* Клиент \n*Хочу* \n*Чтобы* \n
\\\\
h2. Ограничения
\\\\\n
\\\\
h2. Технические рекомендации
\\\\\n
\\\\
h2. Критерии приемки
\\\\
# \n# \n
\\\\
h2. Макеты
\\\\
`,
    bug: `h2.{color:#59afe1}Шаги воспроизведения{color}
\\\\
# \n# \n# \n
\\\\
h2.{color:#8eb021}Ожидаемый результат{color}
\\\\
- \n
\\\\
h2.{color:#d04437}Фактический результат{color}
\\\\
- \n
`
  };

  $(document).on('click', '#createGlobalItem', () => {
    checkElement('#description').then(() => {
      const $title = $('#summary');

      $title.val('[WebUI] ').trigger('change');

      const $buttonsWrapper = $('.aui-toolbar2-primary > .aui-buttons.wiki-edit-toolbar-section:first');

      $buttonsWrapper.find('a:first').before(buttons);
      $buttonsWrapper.on('click', '[data-insert-template]', (event) => {
        const tpl = $(event.currentTarget).data('insertTemplate');
        $('#description').html(templates[tpl]);
      });
    });
  });
})();

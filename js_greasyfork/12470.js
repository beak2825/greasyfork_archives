// ==UserScript==
// @name         Redmine concise journal for issues
// @version      0.3.3
// @description  More concise journal for Redmine issues
// @author       Ronan LE BRIS <ronan.le-bris@smile.fr>
// @match        https://redmine-projets.smile.fr/issues/*
// @match        https://hosting.smile.fr/issues/*
// @namespace    https://greasyfork.org/users/15646
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12470/Redmine%20concise%20journal%20for%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/12470/Redmine%20concise%20journal%20for%20issues.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(' \
.__with_details--only h4 { \
    font-size: 0.90em; \
    font-weight: normal !important; \
} \
 \
.__with_details--only { \
    margin-top: 0.8em; \
} \
 \
.__with_details--only + .__with_details--only { \
    margin-top: 0; \
} \
 \
.__with_details h4 .__details { \
    font-weight: normal; \
    font-size: 0.90em; \
} \
 \
.__with_details--only h4 .__details { \
    font-size: 1em; \
} \
 \
.__with_details h4 .__details strong { \
    font-weight: normal; \
} \
 \
.__with_details h4 .__details i { \
    font-style: normal; \
} \
 \
.__with_details h4 .__details i:nth-of-type(2) { \
    color: #4A833C; \
} \
 \
.__with_details h4 .__details i:nth-of-type(1) { \
    text-decoration: line-through; \
    color: rgb(190, 190, 190); \
} \
 \
.__with_details h4 .__details i:nth-of-type(1):last-child { \
    color: #4A833C; \
    text-decoration: none; \
} \
 \
.__with_details h4 .__details del i { \
	color: inherit !important; \
} \
 \
.__with_details h4 .__details:before { \
    content: "\\02022"; \
    padding: 0 0.4em 0 0.2em; \
    font-weight: bold; \
    display: inline; \
    vertical-align: top; \
} \
 \
.__with_details h4 .__details_item + .__details_item:before { \
    content: "\\02022"; \
    padding: 0 0.4em; \
    font-weight: bold; \
    display: inline; \
    vertical-align: top; \
} \
 \
.journal p { \
    margin-left: 2.4em; \
} \
 \
.journal blockquote { \
    margin-left: 4.8em; \
} \
 \
.journal blockquote p { \
    margin-left: 0; \
} \
');

(function ($) {
  var preservedLabels = [
      'Parent task', 'Tâche parente',
      '% Done', '% réalisé',
      'Priority', 'Priorité',
      'Target version', 'Version'
    ],

    i18n = {
      changedFrom: ['changed from', 'changé de'],
      changedTo: ['to', 'à']
    };

  $(function () {
    $('.controller-issues.action-show #history .journal').each(function () {
      var $this = $(this),
        $details = $this.find('.details'),
        $detailsContent = $details.find('li');

      if ($detailsContent.length && $detailsContent.length <= 5) {
        var $content = $('<span class="__details">');

        $detailsContent.each(function () {
          $content.html(
            $content.html() +
            '<span class="__details_item">' +
            $(this).html()
              .replace(new RegExp('^(?!.*(' + preservedLabels.join('|') + ')).* (' + i18n.changedFrom.join('|') + ') '), '')
              .replace(new RegExp(' (' + i18n.changedFrom.join('|') + ') '), ' ')
              .replace(new RegExp('> *(' + i18n.changedTo.join('|') + ') *<'), '> &#8594; <') +
            '</span>'
          );
        });

        $details
          .closest('.journal').addClass('__with_details' + ($details.next().length ? '' : ' __with_details--only'))
          .find('h4').append($content)
          .next('.details').remove();
      }
    });
  });
}(jQuery));

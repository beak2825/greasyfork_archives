// ==UserScript==
// @name         Temp Drafts Pagination Fix
// @version      0.1
// @description  Temporary fix for missing drafted posts when not using endless scrolling.
// @namespace    https://greasyfork.org/users/65414
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        *.tumblr.com/blog/*/drafts*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/410053/Temp%20Drafts%20Pagination%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/410053/Temp%20Drafts%20Pagination%20Fix.meta.js
// ==/UserScript==

(function($) {

  const b = {
    'context': '._3r0gp ~ * main._2ClZE',
    'name': 'Next',
    'pattern': '{c} div > button[aria-label="{n}"]',
    'url': `${location.origin}/blog/{u}/drafts?before_id={id}`
  };

  const s = (id,s,u) => s.replace('{c}', b.context)
                         .replace('{id}', id)
                         .replace('{n}', b.name)
                         .replace('{u}', u);

  const wrap = (e) => {
    let id = $('._1DxdS._2jOH-[data-id]:last-of-type').attr('data-id'),
        t = e ? e.target.querySelectorAll(s(null,b.pattern,null))
              : s(null,b.pattern,null),
        u = $('._1xyZl a[title]').attr('title');
    $(t).each(function() {
      GM_addStyle (`a[href="${s(id,b.url,u)}"] {text-decoration: none;}`, 0);
      let a = document.createElement('a');
      $(a).attr('href', s(id,b.url,u))
      a.innerHTML = this.outerHTML;
      $(a).insertBefore(this);
      $(this).remove();
    })
  };

  $(document).bind('DOMNodeInserted', (e) => wrap(e))
             .ready(() => wrap());

})(jQuery);
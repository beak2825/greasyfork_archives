// ==UserScript==
// @name Additional Google Options
// @description:en Additional Google Options
// @version 1.2
// @grant none
// @include /^http(s)?:\/\/(www)?\.google\.\w*\/search.*$/
// @namespace
// @description Additional Google Options (languages, discussion)
// @namespace https://greasyfork.org/users/1291433
// @downloadURL https://update.greasyfork.org/scripts/493111/Additional%20Google%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/493111/Additional%20Google%20Options.meta.js
// ==/UserScript==
(function () {
  const langList = ['ru', 'de', 'en', 'ja', 'fr']
  const discussion = ['discussions']
  const wiki = ['wiki']
  const url = new URL(location.href)

  const menu = document.createElement('div')
  menu.style.position = 'absolute'
  menu.style.top = '0'
  menu.style.left = '0'
  menu.style.right = '0'
  menu.style.zIndex = '9999999999'
  menu.style.display = 'flex'
  menu.style.flexDirection = 'row'
  menu.style.gap = '1rem'
  menu.style.justifyContent = 'center'
  menu.style.fontSize = '18px'

  langList.forEach(l => {
    const item = document.createElement('div')
    url.searchParams.set('lr', `lang_${l}`)
    item.innerHTML = `<a href="${url}">${l}</a>`
    menu.appendChild(item)
  })

  discussion.forEach(d => {
    const item = document.createElement('div');
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('q');
    const modifiedQuery = `inurl:forum|viewthread|showthread|viewtopic|showtopic|comments|comment|questions|"index.php?topic"|intext:"reading this topic"|"next thread"|"next topic"|"send private message"`;
    const url = new URL(window.location.href);
    const searchParamStr = url.searchParams.toString();
    const updatedSearchParamStr = searchParamStr ? `${searchParamStr}&q=${encodeURIComponent(modifiedQuery)}` : `q=${encodeURIComponent(modifiedQuery)}`;
    url.search = updatedSearchParamStr;
    item.innerHTML = `<a href="${url}">${d}</a>`;
    menu.appendChild(item);

    // Find the text area by searching for nearby elements
    const form = document.querySelector('form[name="f"]');
    if (form) {
      const textArea = form.querySelector('textarea[name="q"]');
      if (textArea) {
        textArea.value = query; // Set only the original query
      }
    }
  })

  wiki.forEach(d => {
    const item = document.createElement('div');
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('q');
    const modifiedQuery = `inurl:wiki`;
    const url = new URL(window.location.href);
    const searchParamStr = url.searchParams.toString();
    const updatedSearchParamStr = searchParamStr ? `${searchParamStr}&q=${encodeURIComponent(modifiedQuery)}` : `q=${encodeURIComponent(modifiedQuery)}`;
    url.search = updatedSearchParamStr;
    item.innerHTML = `<a href="${url}">${d}</a>`;
    menu.appendChild(item);

    // Find the text area by searching for nearby elements
    const form = document.querySelector('form[name="f"]');
    if (form) {
      const textArea = form.querySelector('textarea[name="q"]');
      if (textArea) {
        textArea.value = query; // Set only the original query
      }
    }
  });




  document.querySelector('body').appendChild(menu)
})()

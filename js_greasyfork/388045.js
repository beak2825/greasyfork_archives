// ==UserScript==
// @name Link to Ruby Toolbox
// @namespace https://franklinyu.github.io
// @description Add a link to Ruby Toolbox
// @version 0.1
// @grant none
// @include https://rubygems.org/gems/*
// @downloadURL https://update.greasyfork.org/scripts/388045/Link%20to%20Ruby%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/388045/Link%20to%20Ruby%20Toolbox.meta.js
// ==/UserScript==

const name = location.pathname.split('/')[2]
if (name) {
  const anchor = document.createElement('a')
  anchor.href = 'https://www.ruby-toolbox.com/projects/' + name
  anchor.innerText = 'Ruby Toolbox'
  anchor.id = 'ruby-toolbox'
  anchor.classList.add('gem__link', 't-list__item')
  document.querySelector('.gem__aside .t-list__items').append(anchor)
}

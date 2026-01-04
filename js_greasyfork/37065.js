// ==UserScript==
// @name     VK.com Force Retina
// @description Скрипт заставляет vk.com считать что у вас Retina дисплей. Увеличивает разрешение стикеров и предпросмотров фотографий, лечит мыло если у вас HiDPI дисплей.
// @version  1
// @grant    none
// @include https://vk.com/*
// @run-at      document-start
// @namespace https://greasyfork.org/users/165678
// @downloadURL https://update.greasyfork.org/scripts/37065/VKcom%20Force%20Retina.user.js
// @updateURL https://update.greasyfork.org/scripts/37065/VKcom%20Force%20Retina.meta.js
// ==/UserScript==
unsafeWindow.devicePixelRatio=2;
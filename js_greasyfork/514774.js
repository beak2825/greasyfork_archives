// ==UserScript==
// @name              Disable Umami
// @license           MPL-2.0
// @namespace         https://github.com/uiolee/disable-umami
// @homepage          https://github.com/uiolee/disable-umami
// @version           1.0.2
// @description       Disable Umami Analytics to prevent being tracked.
// @description.zh    关闭 Umami 统计以避免被追踪。
// @author            Uiolee
// @match             http://*/*
// @match             https://*/*
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAApVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbGxsAAAAAAAAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAVFRUAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///94eHj9/f34+PhcXFx7e3vn5+elpaU0NDTGxsbExMSzs7Orq6uAgIDN8jZ/AAAAKHRSTlMA/vtZQfSZh/y5dPzh2o+AfWVUJNK0jW9KFw/88NPQzclwPjo1MSYGsK63cgAAAOJJREFUOMutz1Vyw0AAA1DtmhnCKbNaQ5LS/Y/WegI1rDc/fb/SjEb4X5Pcdxw/n0DpeR7yIJwPOytHskXaK3QYFnssAy2J4FCME5tK9jG/44jFPjclR8iHJn+JOOq2KWTUaK5E1LgCHqn1hJRaKTxqzRBSK4JFLQuCepDnCpfnJkwnlrs3pZ2IHRO/Zm7xqlAEHvZyblWFLxo4uHHLYV66Uxzdi2o4UgkTJz7rfv5NHy02q85KWdFGx0JcbP9mPl2RoMe8ZlB/bIpi814HnJoYMjxJCkFKz4DaepmlSbZco+UH0FBoNslGTk8AAAAASUVORK5CYII=
// @grant             none
// @run-at            document-idle
// @sandbox           DOM
// @noframes

// @source            https://gist.github.com/uiolee/8683b0c8de01e922771ad7f68e911874
// @downloadURL https://update.greasyfork.org/scripts/514774/Disable%20Umami.user.js
// @updateURL https://update.greasyfork.org/scripts/514774/Disable%20Umami.meta.js
// ==/UserScript==

"use strict";
(async () => {
  "use strict";
  const NAME = "DU.js";
  const VERSION = "10";
  const log = (...args) => {
    return console.log(`[${NAME}]:`, ...args);
  };
  log(VERSION);

  const db = {};
  db["umami.disabled"] = 1;

  for (const [key, value] of Object.entries(db)) {
    const currentValue = localStorage.getItem(key);
    if (currentValue === String(value)) {
      const msg = `"${key}" have been set to "${currentValue}"`;
      log(msg);
      return;
    } else {
      const msg = `setting "${key}" to "${value}"`;
      log(msg);
      localStorage.setItem(key, value);
      return;
    }
  }
})().catch((err) => {
  console.error(`[DU.js]: ${err}`);
});

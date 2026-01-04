// ==UserScript==
// @name         DeepSeeker
// @namespace    https://github.com/qt-kaneko/DeepSeeker
// @version      1.0.4
// @description  Prevents deletion of filtered/censored responses on DeepSeek. This is purely visual change. FILTERED RESPONSES WILL PERSIST ONLY UNTIL THE PAGE IS RELOADED.
// @author       Kaneko Qt
// @license      GPL-3.0-or-later
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @run-at       document-start
// @unwrap
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/525608/DeepSeeker.user.js
// @updateURL https://update.greasyfork.org/scripts/525608/DeepSeeker.meta.js
// ==/UserScript==

// @ts-check

(function() { "use strict";

/** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format */
class SSE
{
  /** @param {string} text */
  static parse(text)
  {
    let events = text
      .trimEnd()
      .split(`\n\n`)
      .map(event => event.split(`\n`))
      .map(fields => fields.map(field => [...split(field, `: `, 2)]))
      .map(fields => Object.fromEntries(fields));
    return events;
  }

  /** @param {object[]} events */
  static stringify(events)
  {
    let text = events
      .map(event => Object.entries(event))
      .map(fields => fields.map(field => field.join(`: `)))
      .map(fields => fields.join(`\n`))
      .join(`\n\n`)
      + `\n\n`;
    return text;
  }
}

/**
 * @param {string} text
 * @param {string} separator
 * @param {number} limit
 */
function* split(text, separator, limit)
{
  let lastI = 0;
  for (let separatorI = text.indexOf(separator), n = 1;
           separatorI !== -1 && n < limit;
           separatorI = text.indexOf(separator, separatorI + separator.length), n++)
  {
    yield text.slice(lastI, separatorI);
    lastI = separatorI + separator.length;
  }
  yield text.slice(lastI);
}

const _endpoints = [
  `https://chat.deepseek.com/api/v0/chat/edit_message`,
  `https://chat.deepseek.com/api/v0/chat/completion`,
  `https://chat.deepseek.com/api/v0/chat/regenerate`,
  `https://chat.deepseek.com/api/v0/chat/resume_stream`,
  `https://chat.deepseek.com/api/v0/chat/continue`,
];

XMLHttpRequest = class extends XMLHttpRequest {
  response;
  responseText;

  constructor()
  { super();
    this.addEventListener(`progress`, this.#progress.bind(this), true);
  }

  #progress()
  {
    this.response = super.response;
    this.responseText = super.responseText;

    this.#patch();
  }

  #patch()
  {
    if (this.readyState < 3) return;
    if (!_endpoints.includes(this.responseURL)) return;
    if (!this.getResponseHeader(`Content-Type`)?.includes(`text/event-stream`)) return;

    let response = this.responseText;

    let events = SSE.parse(response);
    for (let event of events)
    {
      if (event.data === undefined) continue;

      let data = JSON.parse(event.data);
      if (data.p !== `response`) continue;

      let contentFilter = data.v.some(v1 => v1.o === `BATCH` && v1.v.some(v2 => v2.p === `status` && v2.v === `CONTENT_FILTER`));
      if (contentFilter)
      {
        data.v = [{p: `ban_regenerate`, v: true}, {p: `status`, v: `FINISHED`}];
        event.data = JSON.stringify(data);

        console.log(`[DeepSeeker] Get patched, idiot :P`);
      }
    }

    response = SSE.stringify(events);

    this.response = response;
    this.responseText = response;
  }
};

})();
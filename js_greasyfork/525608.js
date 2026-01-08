// ==UserScript==
// @name         DeepSeeker
// @namespace    https://github.com/qt-kaneko/DeepSeeker
// @version      1.5.0
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
      .map(fields => fields.map(field => field.split(/: (.*)/s, 2)))
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

const _endpoints = [
  `https://chat.deepseek.com/api/v0/chat/edit_message`,
  `https://chat.deepseek.com/api/v0/chat/completion`,
  `https://chat.deepseek.com/api/v0/chat/regenerate`,
  `https://chat.deepseek.com/api/v0/chat/resume_stream`,
  `https://chat.deepseek.com/api/v0/chat/continue`,
];

/** @param {any} value */
function isContentFilter(value)
{
  if (value.o === `BATCH`)
  {
    return value.v.some(isContentFilter);
  }

  return value.p === `status` && value.v === `CONTENT_FILTER`;
}

XMLHttpRequest = class extends XMLHttpRequest {
  /** @type {any} */
  response = null;
  responseText = ``;

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
    let changed = false;

    let events = SSE.parse(response);
    for (let event of events)
    {
      if (event.data === undefined) continue;

      let data = JSON.parse(event.data);
      if (data.p !== `response`) continue;

      if (isContentFilter(data))
      {
        data.v = [{p: `ban_regenerate`, v: true}, {p: `status`, v: `FINISHED`}];
        changed = true;

        console.info(`[DeepSeeker] Get patched, idiot :P`);
      }

      if (changed)
      {
        event.data = JSON.stringify(data);
      }
    }

    if (changed)
    {
      response = SSE.stringify(events);
    }

    this.response = response;
    this.responseText = response;
  }
};

})();
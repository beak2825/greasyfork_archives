// ==UserScript==
// @name         chatgpt-monkey
// @namespace    nsyouran
// @version      0.0.1
// @author       nsyouran
// @description  chatgpt-monkey baidu
// @icon         https://chat.openai.com/favicon-32x32.png
// @match        https://www.baidu.com/s*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.global.prod.js
// @resource     bpe      https://greasyfork.org/scripts/460175-gpt-3-encoder-bpe/code/gpt-3-encoder-bpe.js
// @resource     encoder  https://greasyfork.org/scripts/460173-gpt-3-encoder/code/gpt-3-encoder.js
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/460176/chatgpt-monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/460176/chatgpt-monkey.meta.js
// ==/UserScript==

(o=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=o,document.head.appendChild(e)})(".chat-btn{border:none;background-color:#4e6ef2;color:#fff;font-size:16px}.chat-btn:hover{background-color:#4662d9}.chat-btn:focus{border:none;outline:none}.chat-btn.disabled{opacity:.5}#chat-panel{border:2px solid #4e6ef2;border-radius:15px;font-size:16px;padding:10px;margin-bottom:20px}#chat-panel .kw{border-bottom:1px solid #c8c8c8;padding:5px 0}#chat-panel .choices{padding:10px 0 5px}");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(vue) {
  "use strict";
  const style = "";
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeoutError";
    }
  }
  class AbortError extends Error {
    constructor(message) {
      super();
      this.name = "AbortError";
      this.message = message;
    }
  }
  const getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
  const getAbortedReason = (signal) => {
    const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
    return reason instanceof Error ? reason : getDOMException(reason);
  };
  function pTimeout(promise, options) {
    const {
      milliseconds,
      fallback,
      message,
      customTimers = { setTimeout, clearTimeout }
    } = options;
    let timer;
    const cancelablePromise = new Promise((resolve, reject) => {
      if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
        throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
      }
      if (milliseconds === Number.POSITIVE_INFINITY) {
        resolve(promise);
        return;
      }
      if (options.signal) {
        const { signal } = options;
        if (signal.aborted) {
          reject(getAbortedReason(signal));
        }
        signal.addEventListener("abort", () => {
          reject(getAbortedReason(signal));
        });
      }
      const timeoutError = new TimeoutError();
      timer = customTimers.setTimeout.call(void 0, () => {
        if (fallback) {
          try {
            resolve(fallback());
          } catch (error) {
            reject(error);
          }
          return;
        }
        if (typeof promise.cancel === "function") {
          promise.cancel();
        }
        if (message === false) {
          resolve();
        } else if (message instanceof Error) {
          reject(message);
        } else {
          timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
          reject(timeoutError);
        }
      }, milliseconds);
      (async () => {
        try {
          resolve(await promise);
        } catch (error) {
          reject(error);
        } finally {
          customTimers.clearTimeout.call(void 0, timer);
        }
      })();
    });
    cancelablePromise.clear = () => {
      customTimers.clearTimeout.call(void 0, timer);
      timer = void 0;
    };
    return cancelablePromise;
  }
  let getRandomValues;
  const rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }
  const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  const native = {
    randomUUID
  };
  function v4(options, buf, offset) {
    if (native.randomUUID && !buf && !options) {
      return native.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var monkeyWindow = window;
  var GM_getResourceText = /* @__PURE__ */ (() => monkeyWindow.GM_getResourceText)();
  const encoder = JSON.parse(GM_getResourceText("encoder"));
  let bpe_file = GM_getResourceText("bpe");
  bpe_file = bpe_file.substring(8, bpe_file.length - 3);
  const range = (x, y) => {
    const res = Array.from(Array(y).keys()).slice(x);
    return res;
  };
  const ord = (x) => {
    return x.charCodeAt(0);
  };
  const chr = (x) => {
    return String.fromCharCode(x);
  };
  const textEncoder = new TextEncoder();
  const encodeStr = (str) => {
    return Array.from(textEncoder.encode(str)).map((x) => x.toString());
  };
  new TextDecoder("utf-8");
  const dictZip = (x, y) => {
    const result = {};
    x.map((_, i) => {
      result[x[i]] = y[i];
    });
    return result;
  };
  function bytes_to_unicode() {
    const bs = range(ord("!"), ord("~") + 1).concat(range(ord("¡"), ord("¬") + 1), range(ord("®"), ord("ÿ") + 1));
    let cs = bs.slice();
    let n = 0;
    for (let b = 0; b < 2 ** 8; b++) {
      if (!bs.includes(b)) {
        bs.push(b);
        cs.push(2 ** 8 + n);
        n = n + 1;
      }
    }
    const _cs = cs.map((x) => chr(x));
    const result = {};
    bs.map((_, i) => {
      result[bs[i]] = _cs[i];
    });
    return result;
  }
  function get_pairs(word) {
    const pairs = /* @__PURE__ */ new Set();
    let prev_char = word[0];
    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      pairs.add([prev_char, char]);
      prev_char = char;
    }
    return pairs;
  }
  const pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  const decoder = {};
  Object.keys(encoder).map((x) => {
    decoder[encoder[x]] = x;
  });
  const lines = bpe_file.split("\n");
  const bpe_merges = lines.slice(1, lines.length - 1).map((x) => {
    return x.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
  });
  const byte_encoder = bytes_to_unicode();
  const byte_decoder = {};
  Object.keys(byte_encoder).map((x) => {
    byte_decoder[byte_encoder[x]] = x;
  });
  const bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length));
  const cache = /* @__PURE__ */ new Map();
  function bpe(token) {
    if (cache.has(token)) {
      return cache.get(token);
    }
    let word = token.split("");
    let pairs = get_pairs(word);
    if (!pairs) {
      return token;
    }
    while (true) {
      const minPairs = {};
      Array.from(pairs).map((pair) => {
        const rank = bpe_ranks[pair];
        minPairs[isNaN(rank) ? 1e11 : rank] = pair;
      });
      const bigram = minPairs[Math.min(...Object.keys(minPairs).map(
        (x) => {
          return parseInt(x);
        }
      ))];
      if (!(bigram in bpe_ranks)) {
        break;
      }
      const first = bigram[0];
      const second = bigram[1];
      let new_word = [];
      let i = 0;
      while (i < word.length) {
        const j = word.indexOf(first, i);
        if (j === -1) {
          new_word = new_word.concat(word.slice(i));
          break;
        }
        new_word = new_word.concat(word.slice(i, j));
        i = j;
        if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
          new_word.push(first + second);
          i = i + 2;
        } else {
          new_word.push(word[i]);
          i = i + 1;
        }
      }
      word = new_word;
      if (word.length === 1) {
        break;
      } else {
        pairs = get_pairs(word);
      }
    }
    const wordStr = word.join(" ");
    cache.set(token, wordStr);
    return wordStr;
  }
  function encode(text) {
    let bpe_tokens = [];
    const matches = Array.from(text.matchAll(pat)).map((x) => x[0]);
    for (let token of matches) {
      token = encodeStr(token).map((x) => {
        return byte_encoder[x];
      }).join("");
      const new_tokens = bpe(token).split(" ").map(
        (x) => encoder[x]
      );
      bpe_tokens = bpe_tokens.concat(new_tokens);
    }
    return bpe_tokens;
  }
  function createParser(onParse) {
    let isFirstChunk;
    let buffer;
    let startingPosition;
    let startingFieldLength;
    let eventId;
    let eventName;
    let data;
    reset();
    return {
      feed,
      reset
    };
    function reset() {
      isFirstChunk = true;
      buffer = "";
      startingPosition = 0;
      startingFieldLength = -1;
      eventId = void 0;
      eventName = void 0;
      data = "";
    }
    function feed(chunk) {
      buffer = buffer ? buffer + chunk : chunk;
      if (isFirstChunk && hasBom(buffer)) {
        buffer = buffer.slice(BOM.length);
      }
      isFirstChunk = false;
      const length = buffer.length;
      let position = 0;
      let discardTrailingNewline = false;
      while (position < length) {
        if (discardTrailingNewline) {
          if (buffer[position] === "\n") {
            ++position;
          }
          discardTrailingNewline = false;
        }
        let lineLength = -1;
        let fieldLength = startingFieldLength;
        let character;
        for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
          character = buffer[index];
          if (character === ":" && fieldLength < 0) {
            fieldLength = index - position;
          } else if (character === "\r") {
            discardTrailingNewline = true;
            lineLength = index - position;
          } else if (character === "\n") {
            lineLength = index - position;
          }
        }
        if (lineLength < 0) {
          startingPosition = length - position;
          startingFieldLength = fieldLength;
          break;
        } else {
          startingPosition = 0;
          startingFieldLength = -1;
        }
        parseEventStreamLine(buffer, position, fieldLength, lineLength);
        position += lineLength + 1;
      }
      if (position === length) {
        buffer = "";
      } else if (position > 0) {
        buffer = buffer.slice(position);
      }
    }
    function parseEventStreamLine(lineBuffer, index, fieldLength, lineLength) {
      if (lineLength === 0) {
        if (data.length > 0) {
          onParse({
            type: "event",
            id: eventId,
            event: eventName || void 0,
            data: data.slice(0, -1)
          });
          data = "";
          eventId = void 0;
        }
        eventName = void 0;
        return;
      }
      const noValue = fieldLength < 0;
      const field = lineBuffer.slice(index, index + (noValue ? lineLength : fieldLength));
      let step = 0;
      if (noValue) {
        step = lineLength;
      } else if (lineBuffer[index + fieldLength + 1] === " ") {
        step = fieldLength + 2;
      } else {
        step = fieldLength + 1;
      }
      const position = index + step;
      const valueLength = lineLength - step;
      const value = lineBuffer.slice(position, position + valueLength).toString();
      if (field === "data") {
        data += value ? "".concat(value, "\n") : "\n";
      } else if (field === "event") {
        eventName = value;
      } else if (field === "id" && !value.includes("\0")) {
        eventId = value;
      } else if (field === "retry") {
        const retry = parseInt(value, 10);
        if (!Number.isNaN(retry)) {
          onParse({
            type: "reconnect-interval",
            value: retry
          });
        }
      }
    }
  }
  const BOM = [239, 187, 191];
  function hasBom(buffer) {
    return BOM.every((charCode, index) => buffer.charCodeAt(index) === charCode);
  }
  class ChatGPTError extends Error {
    constructor() {
      super(...arguments);
      __publicField(this, "statusCode", 200);
      __publicField(this, "statusText", "");
    }
  }
  var fetch = window.fetch.bind(window);
  async function* streamAsyncIterable(stream) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
  async function fetchSSE(url, options, fetch2 = fetch) {
    const { onMessage, ...fetchOptions } = options;
    const res = await fetch2(url, fetchOptions);
    if (!res.ok) {
      const msg = `ChatGPT error ${res.status || res.statusText}`;
      const error = new ChatGPTError(msg);
      error.statusCode = res.status;
      error.statusText = res.statusText;
      throw error;
    }
    const parser = createParser((event) => {
      if (event.type === "event") {
        onMessage(event.data);
      }
    });
    if (res.body && !res.body.getReader) {
      const body = res.body;
      if (!body.on || !body.read) {
        throw new ChatGPTError('unsupported "fetch" implementation');
      }
      body.on("readable", () => {
        let chunk;
        while (null !== (chunk = body.read())) {
          parser.feed(chunk.toString());
        }
      });
    } else {
      for await (const chunk of streamAsyncIterable(res.body)) {
        const str = new TextDecoder().decode(chunk);
        parser.feed(str);
      }
    }
  }
  var CHATGPT_MODEL = "text-davinci-003";
  var USER_LABEL_DEFAULT = "User";
  var ASSISTANT_LABEL_DEFAULT = "ChatGPT";
  var ChatGPTAPI = class {
    constructor(opts) {
      __publicField(this, "_apiKey");
      __publicField(this, "_apiBaseUrl");
      __publicField(this, "_apiReverseProxyUrl");
      __publicField(this, "_debug");
      __publicField(this, "_fetch");
      __publicField(this, "_completionParams");
      __publicField(this, "_endToken");
      __publicField(this, "_sepToken");
      __publicField(this, "_maxModelTokens");
      __publicField(this, "_maxResponseTokens");
      __publicField(this, "_userLabel");
      __publicField(this, "_assistantLabel");
      __publicField(this, "_getMessageById");
      __publicField(this, "_upsertMessage");
      __publicField(this, "_messageStore");
      const {
        apiKey,
        apiBaseUrl = "https://api.openai.com",
        apiReverseProxyUrl,
        debug = false,
        messageStore,
        completionParams,
        maxModelTokens = 4096,
        maxResponseTokens = 1e3,
        userLabel = USER_LABEL_DEFAULT,
        assistantLabel = ASSISTANT_LABEL_DEFAULT,
        getMessageById = this._defaultGetMessageById,
        upsertMessage = this._defaultUpsertMessage,
        fetch: fetch2 = fetch
      } = opts;
      this._apiKey = apiKey;
      this._apiBaseUrl = apiBaseUrl;
      this._apiReverseProxyUrl = apiReverseProxyUrl;
      this._debug = !!debug;
      this._fetch = fetch2;
      this._completionParams = {
        model: CHATGPT_MODEL,
        temperature: 0.8,
        top_p: 1,
        presence_penalty: 1,
        ...completionParams
      };
      if (this._isChatGPTModel) {
        this._endToken = "<|im_end|>";
        this._sepToken = "<|im_sep|>";
        if (!this._completionParams.stop) {
          this._completionParams.stop = [this._endToken, this._sepToken];
        }
      } else {
        this._endToken = "<|endoftext|>";
        this._sepToken = this._endToken;
        if (!this._completionParams.stop) {
          this._completionParams.stop = [this._endToken];
        }
      }
      this._maxModelTokens = maxModelTokens;
      this._maxResponseTokens = maxResponseTokens;
      this._userLabel = userLabel;
      this._assistantLabel = assistantLabel;
      this._getMessageById = getMessageById;
      this._upsertMessage = upsertMessage;
      if (messageStore) {
        this._messageStore = messageStore;
      } else {
        this._messageStore = {
          set(key, value) {
            const storeStr = localStorage.getItem("chatGPTStore");
            const stroe = JSON.parse(storeStr ? storeStr : "{}");
            stroe[key] = value;
            localStorage.setItem("chatGPTStore", JSON.stringify(stroe));
          },
          get(key) {
            const storeStr = localStorage.getItem("chatGPTStore");
            const stroe = JSON.parse(storeStr ? storeStr : "{}");
            return stroe[key];
          }
        };
      }
      if (!this._apiKey) {
        throw new Error("ChatGPT invalid apiKey");
      }
      if (!this._fetch) {
        throw new Error("Invalid environment; fetch is not defined");
      }
      if (typeof this._fetch !== "function") {
        throw new Error('Invalid "fetch" is not a function');
      }
    }
    //   async sendMessage(text:string, opts = {}) {
    async sendMessage(text, opts = {}) {
      const {
        conversationId = v4(),
        parentMessageId,
        messageId = v4(),
        timeoutMs,
        onProgress,
        stream = onProgress ? true : false
      } = opts;
      let { abortSignal } = opts;
      let abortController = null;
      if (timeoutMs && !abortSignal) {
        abortController = new AbortController();
        abortSignal = abortController.signal;
      }
      const message = {
        role: "user",
        id: messageId,
        parentMessageId,
        conversationId,
        text
      };
      await this._upsertMessage(message);
      const { prompt: prompt2, maxTokens } = await this._buildPrompt(text, opts);
      const result = {
        role: "assistant",
        id: v4(),
        parentMessageId: messageId,
        conversationId,
        text: "",
        detail: null
      };
      const responseP = new Promise(
        async (resolve, reject) => {
          var _a, _b;
          const url = this._apiReverseProxyUrl || `${this._apiBaseUrl}/v1/completions`;
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._apiKey}`
          };
          const body = {
            max_tokens: maxTokens,
            ...this._completionParams,
            prompt: prompt2,
            stream
          };
          if (this._debug) {
            const numTokens = await this._getTokenCount(body.prompt);
            console.log(`sendMessage (${numTokens} tokens)`, body);
          }
          if (stream) {
            fetchSSE(
              url,
              {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                signal: abortSignal,
                onMessage: (data) => {
                  var _a2;
                  if (data === "[DONE]") {
                    result.text = result.text.trim();
                    return resolve(result);
                  }
                  try {
                    const response = JSON.parse(data);
                    if (response.id) {
                      result.id = response.id;
                    }
                    if ((_a2 = response == null ? void 0 : response.choices) == null ? void 0 : _a2.length) {
                      result.text += response.choices[0].text;
                      result.detail = response;
                      onProgress == null ? void 0 : onProgress(result);
                    }
                  } catch (err) {
                    console.warn("ChatGPT stream SEE event unexpected error", err);
                    return reject(err);
                  }
                }
              },
              this._fetch
            ).catch(reject);
          } else {
            try {
              const res = await this._fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                signal: abortSignal
              });
              if (!res.ok) {
                const reason = await res.text();
                const msg = `ChatGPT error ${res.status || res.statusText}: ${reason}`;
                const error = new ChatGPTError(msg, { cause: res });
                error.statusCode = res.status;
                error.statusText = res.statusText;
                return reject(error);
              }
              const response = await res.json();
              if (this._debug) {
                console.log(response);
              }
              if (response == null ? void 0 : response.id) {
                result.id = response.id;
              }
              if ((_a = response == null ? void 0 : response.choices) == null ? void 0 : _a.length) {
                result.text = response.choices[0].text.trim();
              } else {
                const res2 = response;
                return reject(
                  new Error(
                    `ChatGPT error: ${((_b = res2 == null ? void 0 : res2.detail) == null ? void 0 : _b.message) || (res2 == null ? void 0 : res2.detail) || "unknown"}`
                  )
                );
              }
              result.detail = response;
              return resolve(result);
            } catch (err) {
              return reject(err);
            }
          }
        }
      ).then((message2) => {
        return this._upsertMessage(message2).then(() => message2);
      });
      if (timeoutMs) {
        if (abortController) {
          responseP.cancel = () => {
            abortController.abort();
          };
        }
        return pTimeout(responseP, {
          milliseconds: timeoutMs,
          message: "ChatGPT timed out waiting for response"
        });
      } else {
        return responseP;
      }
    }
    get apiKey() {
      return this._apiKey;
    }
    set apiKey(apiKey) {
      this._apiKey = apiKey;
    }
    async _buildPrompt(message, opts) {
      const currentDate = new Date().toISOString().split("T")[0];
      const promptPrefix = opts.promptPrefix || `Instructions:
You are ${this._assistantLabel}, a large language model trained by OpenAI.
Current date: ${currentDate}${this._sepToken}

`;
      const promptSuffix = opts.promptSuffix || `

${this._assistantLabel}:
`;
      const maxNumTokens = this._maxModelTokens - this._maxResponseTokens;
      let { parentMessageId } = opts;
      let nextPromptBody = `${this._userLabel}:

${message}${this._endToken}`;
      let promptBody = "";
      let prompt2;
      let numTokens;
      do {
        const nextPrompt = `${promptPrefix}${nextPromptBody}${promptSuffix}`;
        const nextNumTokens = await this._getTokenCount(nextPrompt);
        const isValidPrompt = nextNumTokens <= maxNumTokens;
        if (prompt2 && !isValidPrompt) {
          break;
        }
        promptBody = nextPromptBody;
        prompt2 = nextPrompt;
        numTokens = nextNumTokens;
        if (!isValidPrompt) {
          break;
        }
        if (!parentMessageId) {
          break;
        }
        const parentMessage = await this._getMessageById(parentMessageId);
        if (!parentMessage) {
          break;
        }
        const parentMessageRole = parentMessage.role || "user";
        const parentMessageRoleDesc = parentMessageRole === "user" ? this._userLabel : this._assistantLabel;
        const parentMessageString = `${parentMessageRoleDesc}:

${parentMessage.text}${this._endToken}

`;
        nextPromptBody = `${parentMessageString}${promptBody}`;
        parentMessageId = parentMessage.parentMessageId;
      } while (true);
      const maxTokens = Math.max(
        1,
        Math.min(this._maxModelTokens - (numTokens ? numTokens : 0), this._maxResponseTokens)
      );
      return { prompt: prompt2, maxTokens };
    }
    async _getTokenCount(text) {
      if (this._isChatGPTModel) {
        text = text.replace(/<\|im_end\|>/g, "<|endoftext|>");
        text = text.replace(/<\|im_sep\|>/g, "<|endoftext|>");
      }
      return encode(text).length;
    }
    get _isChatGPTModel() {
      return this._completionParams.model.startsWith("text-chat") || this._completionParams.model.startsWith("text-davinci-002-render");
    }
    async _defaultGetMessageById(id) {
      const res = await this._messageStore.get(id);
      if (this._debug) {
        console.log("getMessageById", id, res);
      }
      return res;
    }
    async _defaultUpsertMessage(message) {
      if (this._debug) {
        console.log("upsertMessage", message.id, message);
      }
      await this._messageStore.set(message.id, message);
    }
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      let chat;
      let apiKey = localStorage.getItem("gpt-apiKey");
      if (apiKey) {
        chat = new ChatGPTAPI({ apiKey });
      }
      async function init() {
        console.log("init");
        let chatBtn = document.getElementById("su-chat");
        if (!chatBtn) {
          const spanBaiduInput = document.getElementsByClassName("bg s_ipt_wr")[0];
          spanBaiduInput.setAttribute("style", `width: ${spanBaiduInput.clientWidth - 80}px`);
        } else {
          chatBtn.remove();
        }
        chatBtn = document.createElement("button");
        const formOuter = document.getElementsByClassName("s_form_wrapper");
        formOuter[0].append(chatBtn);
        chatBtn.id = "su-chat";
        chatBtn.innerHTML = "Chat";
        chatBtn.setAttribute("class", "chat-btn");
        chatBtn.setAttribute("style", "width: 76px; height: 40px; border-radius: 10px;margin: 15px 0 0 4px");
        chatBtn.addEventListener("click", async () => {
          console.log("click");
          if (!apiKey) {
            apiKey = prompt("请输入apiKey");
            chat = new ChatGPTAPI({ apiKey });
            localStorage.setItem("gpt-apiKey", apiKey);
          }
          chatBtn.setAttribute("class", "chat-btn disabled");
          chatBtn.setAttribute("disabled", "disabled");
          let repeat = 2;
          chatBtn.innerHTML = "·";
          let interval = setInterval(() => {
            chatBtn.innerHTML = "·".repeat(repeat++);
            if (repeat == 6)
              repeat = 1;
          }, 1e3);
          const _input = document.getElementById("kw");
          const kw = _input.getAttribute("value");
          let res;
          try {
            res = await chat.sendMessage(kw);
          } catch (error) {
            console.log(error);
            apiKey = "";
            localStorage.setItem("gpt-apiKey", apiKey);
            alert("密钥错误，请重置");
          }
          let chatPanel = document.getElementById("chat-panel");
          if (!chatPanel) {
            chatPanel = document.createElement("div");
            chatPanel.id = "chat-panel";
            const rightBaidu = document.getElementById("content_right");
            rightBaidu.prepend(chatPanel);
          }
          clearInterval(interval);
          chatBtn.innerHTML = "Chat";
          chatBtn.removeAttribute("disabled");
          chatBtn.setAttribute("class", "chat-btn");
          chatPanel.innerHTML = `
    <div class="kw">${kw}</div>
    <div class="choices">${res.detail.choices[0].text}</div>
    `;
        });
      }
      init();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div");
      };
    }
  });
  const App_vue_vue_type_style_index_0_lang = "";
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
})(Vue);

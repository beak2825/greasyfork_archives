// ==UserScript==
// @name         SmolLLM
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  LLM utility library
// @author       RoCry
// @require https://update.greasyfork.org/scripts/528703/1732956/SimpleBalancer.js
// @license MIT
// ==/UserScript==

class SmolLLM {
  constructor() {
    if (typeof SimpleBalancer === "undefined") {
      throw new Error("SimpleBalancer is required for SmolLLM to work");
    }

    this.balancer = new SimpleBalancer();
    this.logger = console;
    this.buffer = "";
  }

  prepareRequestData(prompt, systemPrompt, modelName, providerName, baseUrl) {
    const provider = providerName.toLowerCase();
    let url;
    let data;

    if (provider === "anthropic") {
      url = `${baseUrl}/v1/messages`;
      data = {
        model: modelName,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      };
      if (systemPrompt) {
        data.system = systemPrompt;
      }
      return { url, data };
    }

    if (provider === "gemini") {
      url = `${baseUrl}/v1beta/models/${modelName}:streamGenerateContent?alt=sse`;
      data = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      if (systemPrompt) {
        data.system_instruction = { parts: [{ text: systemPrompt }] };
      }
      return { url, data };
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    data = {
      messages,
      model: modelName,
      stream: true,
    };

    if (baseUrl.endsWith("#")) {
      url = baseUrl.slice(0, -1);
    } else if (baseUrl.endsWith("/")) {
      url = `${baseUrl}chat/completions`;
    } else {
      url = `${baseUrl}/v1/chat/completions`;
    }

    return { url, data };
  }

  prepareHeaders(providerName, apiKey) {
    const provider = providerName.toLowerCase();
    const headers = {
      "Content-Type": "application/json",
    };

    if (provider === "anthropic") {
      headers["X-API-Key"] = apiKey;
      headers["Anthropic-Version"] = "2023-06-01";
      return headers;
    }

    if (provider === "gemini") {
      headers["X-Goog-Api-Key"] = apiKey;
      return headers;
    }

    headers["Authorization"] = `Bearer ${apiKey}`;
    return headers;
  }

  extractTextFromChunk(data, providerName) {
    try {
      const provider = providerName.toLowerCase();

      if (provider === "gemini") {
        const candidates = data.candidates || [];
        if (candidates.length > 0 && candidates[0].content) {
          const parts = candidates[0].content.parts;
          if (parts && parts.length > 0) {
            return parts[0].text || "";
          }
        }
        return null;
      }

      if (provider === "anthropic") {
        if (data.type === "content_block_delta") {
          const delta = data.delta || {};
          if (delta.type === "text_delta" || delta.text) {
            return delta.text || "";
          }
        }
        return null;
      }

      const choices = data.choices || [];
      if (choices.length === 0) return null;

      const choice = choices[0];
      if (choice.finish_reason) return null;

      if (choice.delta && choice.delta.content) {
        return choice.delta.content;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error extracting text from chunk: ${error.message}`);
      return null;
    }
  }

  async askLLM({
    prompt,
    providerName,
    systemPrompt = "",
    model,
    apiKey,
    baseUrl,
    handler = null,
    timeout = 60000,
  }) {
    if (!prompt || !providerName || !model || !apiKey || !baseUrl) {
      throw new Error("Required parameters missing");
    }

    const normalizedProvider = providerName.toLowerCase();
    const trimmedKey = String(apiKey).trim();
    const trimmedBaseUrl = String(baseUrl).trim();

    let selectedKey;
    let selectedUrl;

    [selectedKey, selectedUrl] = this.balancer.choosePair(
      trimmedKey,
      trimmedBaseUrl,
    );

    const { url, data } = this.prepareRequestData(
      prompt,
      systemPrompt,
      model,
      normalizedProvider,
      selectedUrl,
    );

    const headers = this.prepareHeaders(normalizedProvider, selectedKey);
    const apiKeyPreview = `${selectedKey.slice(0, 5)}...${selectedKey.slice(-4)}`;

    this.logger.info(
      `[SmolLLM] Request: ${url} | model=${model} | provider=${normalizedProvider} | api_key=${apiKeyPreview} | prompt=${prompt.length}`,
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(
          `HTTP error ${response.status}: ${bodyText || "Unknown error"}`,
        );
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      this.buffer = "";

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const deltas = this.processStreamChunks(chunk, normalizedProvider);

        for (const delta of deltas) {
          if (!delta) continue;
          fullText += delta;
          if (handler) handler(delta, fullText);
        }
      }

      if (this.buffer) {
        const deltas = this.processStreamChunks("\n", normalizedProvider);
        for (const delta of deltas) {
          if (!delta) continue;
          fullText += delta;
          if (handler) handler(delta, fullText);
        }
      }

      return fullText;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  processStreamChunks(chunk, providerName) {
    const deltas = [];
    const normalized = chunk.replace(/\r/g, "");

    this.buffer += normalized;

    const lines = this.buffer.split("\n");
    this.buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (!trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6).trim();
      if (data === "[DONE]") continue;

      try {
        const jsonData = JSON.parse(data);
        const delta = this.extractTextFromChunk(jsonData, providerName);
        if (delta) deltas.push(delta);
      } catch (error) {
        if (error instanceof SyntaxError) {
          this.logger.log(`Incomplete or invalid JSON: ${data}`);
        } else {
          this.logger.error(
            `Error processing chunk: ${error.message}, chunk: ${data}`,
          );
        }
      }
    }

    return deltas;
  }
}

window.SmolLLM = SmolLLM;

if (typeof module !== "undefined") {
  module.exports = SmolLLM;
}

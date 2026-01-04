// ==UserScript==
// @name         SmolLLM
// @namespace    http://tampermonkey.net/
// @version      0.1.15
// @description  LLM utility library
// @author       RoCry
// @require https://update.greasyfork.org/scripts/528703/1546610/SimpleBalancer.js
// @license MIT
// ==/UserScript==

class SmolLLM {
  constructor() {
    if (typeof SimpleBalancer === 'undefined') {
      throw new Error('SimpleBalancer is required for SmolLLM to work');
    }

    this.balancer = new SimpleBalancer();
    this.logger = console;
    this.buffer = ''; // Buffer for incomplete SSE messages
  }

  /**
   * Prepares request data based on the provider
   * 
   * @param {string} prompt - User prompt
   * @param {string} systemPrompt - System prompt 
   * @param {string} modelName - Model name
   * @param {string} providerName - Provider name (anthropic, openai, gemini)
   * @param {string} baseUrl - API base URL
   * @returns {Object} - {url, data} for the request
   */
  prepareRequestData(prompt, systemPrompt, modelName, providerName, baseUrl) {
    let url, data;

    if (providerName === 'anthropic') {
      url = `${baseUrl}/v1/messages`;
      data = {
        model: modelName,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
        stream: true
      };
      if (systemPrompt) {
        data.system = systemPrompt;
      }
    } else if (providerName === 'gemini') {
      url = `${baseUrl}/v1beta/models/${modelName}:streamGenerateContent?alt=sse`;
      data = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (systemPrompt) {
        data.system_instruction = { parts: [{ text: systemPrompt }] };
      }
    } else {
      // OpenAI compatible APIs
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      data = {
        messages: messages,
        model: modelName,
        stream: true
      };

      // Handle URL based on suffix
      if (baseUrl.endsWith('#')) {
        url = baseUrl.slice(0, -1); // Remove the # and use exact URL
      } else if (baseUrl.endsWith('/')) {
        url = `${baseUrl}chat/completions`; // Skip v1 prefix
      } else {
        url = `${baseUrl}/v1/chat/completions`; // Default pattern
      }
    }

    return { url, data };
  }

  prepareHeaders(providerName, apiKey) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (providerName === 'anthropic') {
      headers['X-API-Key'] = apiKey;
      headers['Anthropic-Version'] = '2023-06-01';
    } else if (providerName === 'gemini') {
      headers['X-Goog-Api-Key'] = apiKey;
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return headers;
  }

  /**
   * Extract text content from a parsed JSON chunk
   * 
   * @param {Object} data - Parsed JSON data
   * @param {string} providerName - Provider name
   * @returns {string|null} - Extracted text content or null
   */
  extractTextFromChunk(data, providerName) {
    try {
      if (providerName === 'gemini') {
        const candidates = data.candidates || [];
        if (candidates.length > 0 && candidates[0].content) {
          const parts = candidates[0].content.parts;
          if (parts && parts.length > 0) {
            return parts[0].text || '';
          }
        }
        return null;
      } 
      
      if (providerName === 'anthropic') {
        // Handle content_block_delta which contains the actual text
        if (data.type === 'content_block_delta') {
          const delta = data.delta || {};
          if (delta.type === 'text_delta' || delta.text) {
            return delta.text || '';
          }
        }
        return null;
      } 
      
      // OpenAI compatible format
      const choices = data.choices || [];
      
      // Skip if no choices or has filter results only
      if (choices.length === 0) {
        return null;
      }
      
      const choice = choices[0];
      
      // Check if this indicates end of stream
      if (choice.finish_reason) {
        return null;
      }
      
      // Extract content from delta
      if (choice.delta && choice.delta.content) {
        return choice.delta.content;
      }
      
      return null;
    } catch (e) {
      this.logger.error(`Error extracting text from chunk: ${e.message}`);
      return null;
    }
  }

  /**
   * @returns {Promise<string>} - Full final response text
   */
  async askLLM({
    prompt,
    providerName,
    systemPrompt = '',
    model,
    apiKey,
    baseUrl,
    handler = null,  // handler(delta, fullText)
    timeout = 60000
  }) {
    if (!prompt || !providerName || !model || !apiKey || !baseUrl) {
      throw new Error('Required parameters missing');
    }

    // Use balancer to choose API key and base URL pair
    [apiKey, baseUrl] = this.balancer.choosePair(apiKey, baseUrl);

    const { url, data } = this.prepareRequestData(
      prompt, systemPrompt, model, providerName, baseUrl
    );

    const headers = this.prepareHeaders(providerName, apiKey);

    // Log request info (with masked API key)
    const apiKeyPreview = `${apiKey.slice(0, 5)}...${apiKey.slice(-4)}`;
    this.logger.info(
      `[SmolLLM] Request: ${url} | model=${model} | provider=${providerName} | api_key=${apiKeyPreview} | prompt=${prompt.length}`
    );

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text() || 'Unknown error'}`);
      }

      // Reset buffer before starting new stream processing
      this.buffer = '';
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const deltas = this.processStreamChunks(chunk, providerName);
        
        for (const delta of deltas) {
          if (delta) {
            fullText += delta;
            if (handler) handler(delta, fullText);
          }
        }
      }

      // Process any remaining buffer content
      if (this.buffer) {
        this.logger.log(`Processing remaining buffer: ${this.buffer}`);
        const deltas = this.processStreamChunks('\n', providerName); // Force processing any remaining buffer
        
        for (const delta of deltas) {
          if (delta) {
            fullText += delta;
            if (handler) handler(delta, fullText);
          }
        }
      }

      clearTimeout(timeoutId);
      return fullText;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Process stream chunks and extract text content
   * 
   * @param {string} chunk - Raw stream chunk
   * @param {string} providerName - Provider name
   * @returns {Array<string>} - Array of extracted text deltas
   */
  processStreamChunks(chunk, providerName) {
    const deltas = [];
    
    // Add chunk to buffer
    this.buffer += chunk;
    
    // Split buffer by newlines
    const lines = this.buffer.split('\n');
    
    // Keep the last line in the buffer (might be incomplete)
    this.buffer = lines.pop() || '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Check for SSE data prefix
      if (trimmed.startsWith('data: ')) {
        const data = trimmed.slice(6).trim();
        
        // Skip [DONE] marker
        if (data === '[DONE]') continue;
        
        try {
          // Parse JSON data
          const jsonData = JSON.parse(data);
          
          // Extract text content
          const delta = this.extractTextFromChunk(jsonData, providerName);
          if (delta) {
            deltas.push(delta);
          }
        } catch (e) {
          // Log JSON parse errors but continue processing
          if (e instanceof SyntaxError) {
            this.logger.log(`Incomplete or invalid JSON: ${data}`);
          } else {
            this.logger.error(`Error processing chunk: ${e.message}, chunk: ${data}`);
          }
        }
      }
    }
    
    return deltas;
  }
}

// Make it available globally
window.SmolLLM = SmolLLM;

// Export for module systems if needed
if (typeof module !== 'undefined') {
  module.exports = SmolLLM;
}

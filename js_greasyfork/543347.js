

    // ==UserScript==
    // @name         Perplexity MAX
    // @description  Free Max & Pro features for Perplexity.ai with enhanced capabilities
    // @version      2.1.0
    // @author       AntiKeks & d4nc3r
    // @license      MIT
    // @match        https://*.perplexity.ai/*
    // @run-at       document-start
    // @grant        none
    // @namespace    https://greasyfork.org/users/1497368
    // @supportURL   https://github.com/AntiKeks/PerplexityMAX/issues
    // @homepageURL  https://github.com/AntiKeks/PerplexityMAX
// @downloadURL https://update.greasyfork.org/scripts/543347/Perplexity%20MAX.user.js
// @updateURL https://update.greasyfork.org/scripts/543347/Perplexity%20MAX.meta.js
    // ==/UserScript==

    (function () {
      'use strict';

      /* ─────────────────────────── LOGGING ─────────────────────────── */
      const DEBUG = true;  // Enable debug logging for troubleshooting
      const VERBOSE = false; // Disable verbose logging to improve performance
      const log = (...args) => DEBUG && console.log('[PERPLEXITY-MAX]', ...args);
      const verbose = (...args) => VERBOSE && console.log('[PERPLEXITY-MAX-VERBOSE]', ...args);

      /* ─────────────────────────── CACHING ─────────────────────────── */
      // Cache for API responses to improve performance
      const CACHE_TTL = 60 * 1000; // 1 minute cache lifetime
      const responseCache = new Map();

      // Cache helper functions
      const getCachedResponse = (url) => {
        const cachedItem = responseCache.get(url);
        if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
          verbose(`Using cached response for ${url}`);
          return cachedItem.data;
        }
        return null;
      };

      const setCachedResponse = (url, data) => {
        responseCache.set(url, {
          data: data,
          timestamp: Date.now()
        });
        verbose(`Cached response for ${url}`);
      };

      // Cache cleanup interval
      setInterval(() => {
        const now = Date.now();
        let expiredCount = 0;
        responseCache.forEach((value, key) => {
          if (now - value.timestamp > CACHE_TTL) {
            responseCache.delete(key);
            expiredCount++;
          }
        });
        if (expiredCount > 0) {
          verbose(`Cleaned up ${expiredCount} expired cache items`);
        }
      }, CACHE_TTL);

      log('Initialization complete - MAX features activated');

      /* ───────────────────────── THROTTLING UI ────────────────────── */
      const COOLDOWN = 1000;              // Minimum interval between React "pings" (ms)
      let lastUpdate = 0;

      function forceReactUpdate() {
        const now = Date.now();
        if (now - lastUpdate < COOLDOWN) return;   // call no more than once per COOLDOWN
        lastUpdate = now;

        requestAnimationFrame(() => {
          document.dispatchEvent(new Event('visibilitychange'));
          window.dispatchEvent(new Event('resize'));
          log('Dispatched events to update UI');
        });
      }

      /* ─────────────────────── PATCH USER DATA ───────────────── */
      function patchDataRecursively(obj, path = '', depth = 0) {
        // Limit recursion depth to avoid performance issues
        if (depth > 5) return false;

        // Skip null, non-objects, and React elements
        if (!obj || typeof obj !== 'object' || obj.$$typeof) return false;

        let changed = false;

        // Check for subscription-related fields directly
        if (obj.hasOwnProperty('subscription_tier') && obj.subscription_tier !== 'max') {
          obj.subscription_tier = 'max';
          changed = true;
          log(`${path}.subscription_tier → max (was: ${obj.subscription_tier})`);
        }

        if (obj.hasOwnProperty('subscription_source') && obj.subscription_source !== 'stripe') {
          const oldValue = obj.subscription_source;
          obj.subscription_source = 'stripe';
          changed = true;
          log(`${path}.subscription_source → stripe (was: ${oldValue})`);
        }

        if (obj.hasOwnProperty('subscription_status') && obj.subscription_status !== 'active') {
          const oldValue = obj.subscription_status;
          obj.subscription_status = 'active';
          changed = true;
          log(`${path}.subscription_status → active (was: ${oldValue})`);
        }

        // Handle pro/max flags - IMPORTANT: For MAX to show, we need both is_pro=true AND is_max=true
        if (obj.hasOwnProperty('is_pro')) {
          const oldValue = obj.is_pro;
          obj.is_pro = true;  // Set to true for MAX to work properly
          if (oldValue !== true) {
            changed = true;
            log(`${path}.is_pro → true (was: ${oldValue})`);
          }
        }

        if (obj.hasOwnProperty('is_max')) {
          if (obj.is_max !== true) {
            obj.is_max = true;
            changed = true;
            log(`${path}.is_max → true`);
          }
        }

        if (obj.hasOwnProperty('has_max')) {
          if (obj.has_max !== true) {
            obj.has_max = true;
            changed = true;
            log(`${path}.has_max → true`);
          }
        }

        // Also handle has_pro flag
        if (obj.hasOwnProperty('has_pro')) {
          if (obj.has_pro !== true) {
            obj.has_pro = true;
            changed = true;
            log(`${path}.has_pro → true`);
          }
        }

        // Handle rate limits directly - very important!
        if (obj.hasOwnProperty('remaining_pro') && obj.remaining_pro !== 999999) {
          obj.remaining_pro = 999999;
          changed = true;
          log(`${path}.remaining_pro → 999999 (unlimited)`);
        }

        if (obj.hasOwnProperty('remaining_research') && obj.remaining_research !== 999999) {
          obj.remaining_research = 999999;
          changed = true;
          log(`${path}.remaining_research → 999999 (unlimited)`);
        }

        if (obj.hasOwnProperty('remaining_labs') && obj.remaining_labs !== 999999) {
          obj.remaining_labs = 999999;
          changed = true;
          log(`${path}.remaining_labs → 999999 (unlimited)`);
        }

        // Handle upload-related fields
        if (obj.hasOwnProperty('rate_limited') && obj.rate_limited !== false) {
          obj.rate_limited = false;
          changed = true;
          log(`${path}.rate_limited → false (enabling uploads)`);
        }

        if (obj.hasOwnProperty('remaining_uploads') && obj.remaining_uploads !== 999999) {
          obj.remaining_uploads = 999999;
          changed = true;
          log(`${path}.remaining_uploads → 999999 (unlimited)`);
        }

        if (obj.hasOwnProperty('max_uploads') && obj.max_uploads < 100) {
          obj.max_uploads = 100;
          changed = true;
          log(`${path}.max_uploads → 100`);
        }

        if (obj.hasOwnProperty('upload_limit') && obj.upload_limit < 100) {
          obj.upload_limit = 100;
          changed = true;
          log(`${path}.upload_limit → 100`);
        }

        if (obj.hasOwnProperty('can_upload') && obj.can_upload !== true) {
          obj.can_upload = true;
          changed = true;
          log(`${path}.can_upload → true`);
        }

        // Only process important objects further
        if (obj.hasOwnProperty('subscription') && typeof obj.subscription === 'object' && obj.subscription !== null) {
          if (!obj.subscription) {
            obj.subscription = {
              tier: 'max',
              status: 'active',
              source: 'stripe',
              price: 200,
              billing_period: 'monthly'
            };
            changed = true;
            log(`${path}.subscription created with MAX tier`);
          } else {
            if (obj.subscription.tier !== 'max') {
              obj.subscription.tier = 'max';
              changed = true;
            }
            if (obj.subscription.status !== 'active') {
              obj.subscription.status = 'active';
              changed = true;
            }
            if (obj.subscription.source !== 'stripe') {
              obj.subscription.source = 'stripe';
              changed = true;
            }
          }
        }

        // Handle features object
        if (obj.hasOwnProperty('features') && typeof obj.features === 'object' && obj.features !== null) {
          const featuresToEnable = {
            max_models: true,
            claude_opus_access: true,
            claude_sonnet_access: true,
            claude_haiku_access: true,
            gpt_4o_access: true,
            gpt_4_turbo_access: true,
            mistral_large_access: true,
            unlimited_searches: true,
            unlimited_uploads: true,
            unlimited_files: true,
            unlimited_images: true,
            all_models: true,
            image_upload: true,
            file_upload: true,
            pdf_upload: true,
            advanced_tools: true,
            collections_access: true,
            copilot_access: true
          };

          for (const f in featuresToEnable) {
            if (obj.features[f] !== true) {
              obj.features[f] = true;
              changed = true;
            }
          }
        }

        // Recursively process child objects - but only important ones to avoid performance issues
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'object' && obj[key] !== null) {
            // Only process important keys to improve performance
            const importantKeys = [
              'user', 'account', 'subscription', 'features', 'settings', 'config',
              'data', 'profile', 'preferences', 'options', 'state', 'models',
              'uploads', 'files', 'images', 'usage'
            ];

            if (importantKeys.includes(key) || key.includes('user') || key.includes('subscription') ||
                key.includes('model') || key.includes('upload') || key.includes('file')) {
              if (patchDataRecursively(obj[key], path ? `${path}.${key}` : key, depth + 1)) {
                changed = true;
              }
            }
          }
        }

        return changed;
      }

      /* ──────────────────── PATCH GLOBAL JSON.parse ───────────────── */
      const originalParse = JSON.parse;
      JSON.parse = function (text, reviver) {
        const data = originalParse.call(this, text, reviver);

        if (patchDataRecursively(data)) {
          log('JSON-object converted to Max');
          forceReactUpdate();
        }
        return data;
      };

      /* ──────────────────────────── PATCH fetch ─────────────────────── */
      const originalFetch = window.fetch;
      window.fetch = async function (input, init) {
        try {
          // Extract URL and method
          const url = typeof input === 'string' ? input : input.url;
          const method = init?.method || 'GET';

          // Log all requests in debug mode
          if (DEBUG) {
            verbose(`Fetch request: ${method} ${url}`);
          }

          // Check if we have a cached response for GET requests
          if (method === 'GET' && !url.includes('/rest/sse/')) {
            const cachedResponse = getCachedResponse(url);
            if (cachedResponse) {
              verbose(`Using cached response for ${url}`);
              return new Response(JSON.stringify(cachedResponse), {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Perplexity-Max-Cache': 'HIT'
                }
              });
            }
          }

          // Force logging for important endpoints
          if (url && (
            url.includes('/rest/rate-limit/all') ||
            url.includes('/rest/user/save-settings') ||
            url.includes('/rest/uploads/create_upload_url') ||
            url.includes('/rest/sse/perplexity_ask')
          )) {
            log(`Intercepting important request: ${method} ${url}`);
          }

          // Block Datadog analytics
          if (url && url.includes('datadoghq.com')) {
            log('Blocked Datadog analytics request');
            // Return empty success response
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

          // Block other analytics services
          if (url && (
            url.includes('analytics') ||
            url.includes('telemetry') ||
            url.includes('metrics') ||
            url.includes('singular.net') ||
            url.includes('segment.io') ||
            url.includes('mixpanel') ||
            url.includes('facebook.com') ||
            url.includes('fbevents')
          )) {
            log(`Blocked analytics request: ${url}`);
            // Return empty success response
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

          // CRITICAL: Handle rate-limit requests - MUST intercept these
          if (url && url.includes('/rest/rate-limit/all')) {
            log(`Intercepted rate-limit request (${method}) - FORCING UNLIMITED LIMITS`);

            // ALWAYS return our custom response with unlimited limits
            const unlimitedResponse = {
              remaining_pro: 999999,
              remaining_research: 999999,
              remaining_labs: 999999,
              remaining_uploads: 999999,
              remaining_copilot: 999999,
              remaining_search: 999999,
              remaining_create: 999999,
              rate_limited: false
            };

            log('Returning unlimited rate limits');

            // Cache this response for future requests
            setCachedResponse(url, unlimitedResponse);

            // Return our custom response directly, bypassing the server
            return new Response(JSON.stringify(unlimitedResponse), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

          // Handle SSE requests for perplexity_ask
          if (url && url.includes('/rest/sse/perplexity_ask')) {
            log(`Intercepted SSE perplexity_ask request (${method})`);

            try {
              // Get the original request body
              let requestBody = {};
              if (init && init.body) {
                if (typeof init.body === 'string') {
                  try {
                    requestBody = JSON.parse(init.body);
                  } catch (parseError) {
                    log(`Error parsing SSE request body: ${parseError.message}`);
                    // Continue with empty request body rather than failing
                    requestBody = {};
                  }
                }
              }

              // Save original request for retry purposes
              const originalRequest = {
                url,
                method,
                headers: init?.headers ? new Headers(init.headers) : new Headers(),
                body: init?.body
              };

              // Modify params to ensure MAX features
              if (requestBody.params) {
                // Enable MAX model options with support for latest models
                const latestModels = {
                  'claude': 'claude-3-opus-20240229',
                  'gpt': 'gpt-4o',
                  'mistral': 'mistral-large-2'
                };
                requestBody.params.model_preference = requestBody.params.model_preference || latestModels.claude;

                // Add MAX subscription flags
                requestBody.params.is_max = true;
                requestBody.params.has_max = true;
                requestBody.params.is_pro = true;
                requestBody.params.subscription_tier = 'max';

                // Set to use the best model available based on type
                if (!requestBody.params.model_preference || requestBody.params.model_preference === 'turbo') {
                  const preferredModel = latestModels.claude;
                  requestBody.params.model_preference = preferredModel;
                  log(`Enhanced model to ${preferredModel}`);
                }

                // Update the request with modified body
                init.body = JSON.stringify(requestBody);
                log('Modified SSE request with MAX subscription data');
              }

              // Make the modified request
              const response = await originalFetch(input, init);

              // For SSE responses, we need to create a custom response that modifies the stream
              if (response.headers.get('content-type')?.includes('text/event-stream')) {
                log('Intercepting SSE response stream');

                const reader = response.body.getReader();
                const stream = new ReadableStream({
                  async start(controller) {
                    try {
                      while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                          controller.close();
                          break;
                        }

                        // Convert the chunk to text
                        let text = new TextDecoder().decode(value);

                        // Process each event in the chunk
                        const events = text.split('\n\n');
                        let modifiedEvents = [];

                        for (const event of events) {
                          if (!event.trim()) continue;

                          // Check if this is a data event
                          if (event.includes('event: message') && event.includes('data: {')) {
                            try {
                              // Extract the data part
                              const dataMatch = event.match(/data: ({.*})/);
                              if (dataMatch && dataMatch[1]) {
                                const data = JSON.parse(dataMatch[1]);

                                // Modify the data to ensure MAX features
                                data.gpt4 = true; // Enable GPT-4 flag
                                data.display_model = data.display_model || 'claude-3-opus-20240229'; // Set display model to MAX

                                // If there's a classifier_results object, modify it
                                if (data.classifier_results) {
                                  data.classifier_results.personal_search = true;
                                  data.classifier_results.skip_search = false;
                                }

                                // If there's a telemetry_data object, modify it
                                if (data.telemetry_data) {
                                  data.telemetry_data.is_pro = true;
                                  data.telemetry_data.is_max = true;
                                  data.telemetry_data.has_max = true;
                                }

                                // Replace the data in the event
                                const modifiedEvent = event.replace(dataMatch[1], JSON.stringify(data));
                                modifiedEvents.push(modifiedEvent);
                                continue;
                              }
                            } catch (e) {
                              verbose('Error modifying SSE event:', e);
                            }
                          }

                          // If we couldn't modify the event, keep it as is
                          modifiedEvents.push(event);
                        }

                        // Join the events back together
                        const modifiedText = modifiedEvents.join('\n\n') + '\n\n';
                        controller.enqueue(new TextEncoder().encode(modifiedText));
                      }
                    } catch (e) {
                      log('Error in SSE stream processing:', e);
                      controller.error(e);
                    }
                  }
                });

                // Return a new response with the modified stream
                return new Response(stream, {
                  headers: response.headers,
                  status: response.status,
                  statusText: response.statusText
                });
              }

              return response;
            } catch (e) {
              log('Error processing SSE request:', e);

              // Implement retry mechanism for SSE requests
              const MAX_RETRIES = 3;
              const RETRY_DELAY = 1000; // 1 second

              // Function to retry the request with exponential backoff
              const retryRequest = async (retryCount = 0) => {
                if (retryCount >= MAX_RETRIES) {
                  log(`Maximum retries (${MAX_RETRIES}) reached for SSE request, giving up`);
                  // If we've reached max retries, proceed with the original request as fallback
                  return originalFetch(input, init);
                }

                log(`Retrying SSE request (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${RETRY_DELAY * Math.pow(2, retryCount)}ms`);

                // Wait with exponential backoff
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));

                try {
                  // Clone the original request but create a new AbortController
                  const newInit = { ...init };
                  if (init?.signal) {
                    const controller = new AbortController();
                    newInit.signal = controller.signal;
                  }

                  return await originalFetch(input, newInit);
                } catch (retryError) {
                  log(`Retry attempt ${retryCount + 1} failed:`, retryError);
                  // Try again with increased retry count
                  return retryRequest(retryCount + 1);
                }
              };

              // Start the retry process
              return retryRequest();
            }
          }

          // Handle upload URL creation requests
          if (url && url.includes('/rest/uploads/create_upload_url')) {
            log('Intercepted upload URL creation request');

            // Make the original request
            const response = await originalFetch(input, init);

            try {
              // Clone the response so we can read and modify it
              const cloned = response.clone();
              const json = await cloned.json();

              // Remove rate limiting for uploads
              if (json.hasOwnProperty('rate_limited')) {
                json.rate_limited = false;
                log('.rate_limited → false (enabling uploads)');

                // Return the modified response
                return new Response(JSON.stringify(json), {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers
                });
              }

              // If we didn't modify anything, return the original response
              return response;
            } catch (e) {
              log('Error processing upload URL response:', e);
              // Not JSON or other error - return original response
              return response;
            }
          }

          // Handle feedback visibility requests
          if (url && url.includes('/rest/entry/should-show-feedback')) {
            log('Intercepted feedback visibility request');

            // Create a modified response that always sets should_show_feedback to true
            return new Response(JSON.stringify({
              should_show_feedback: true
            }), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

          // Handle save-settings requests
          if (url && url.includes('/rest/user/save-settings')) {
            log(`Intercepted save-settings request (${method})`);

            // For GET requests, we'll handle the response below
            if (method === 'GET') {
              const response = await originalFetch(input, init);
              try {
                const cloned = response.clone();
                const json = await cloned.json();

                // Modify the settings to ensure MAX subscription
                json.subscription_tier = 'max';
                json.subscription_status = 'active';
                json.subscription_source = 'stripe';
                json.stripe_status = 'active';
                json.gpt4_limit = 999999;
                json.pplx_alpha_limit = 999999;
                json.pplx_beta_limit = 999999;
                json.pages_limit = 999999;
                json.upload_limit = 999999;
                json.create_limit = 999999;
                json.article_image_upload_limit = 999999;
                json.max_files_per_user = 999999;
                json.max_files_per_repository = 999999;

                log('Modified GET save-settings response with MAX subscription data');

                // Return the modified response
                return new Response(JSON.stringify(json), {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers
                });
              } catch (e) {
                log('Error processing GET save-settings response:', e);
                return response;
              }
            }

            // For PUT/POST requests, modify both the request and response
            if (method === 'PUT' || method === 'POST') {
              try {
                // Get the original request body
                let requestBody = {};
                if (init && init.body) {
                  if (typeof init.body === 'string') {
                    requestBody = JSON.parse(init.body);
                  } else if (init.body instanceof FormData) {
                    // Handle FormData if needed
                  }
                }

                // Check if this is a partial update with updated_settings
                if (requestBody.updated_settings) {
                  log('Detected partial settings update');

                  // Ensure MAX subscription settings in the updated_settings
                  requestBody.updated_settings.subscription_tier = 'max';
                  requestBody.updated_settings.subscription_status = 'active';
                  requestBody.updated_settings.subscription_source = 'stripe';
                  requestBody.updated_settings.stripe_status = 'active';
                  requestBody.updated_settings.gpt4_limit = 999999;
                  requestBody.updated_settings.pplx_alpha_limit = 999999;
                  requestBody.updated_settings.pplx_beta_limit = 999999;
                  requestBody.updated_settings.pages_limit = 999999;
                  requestBody.updated_settings.upload_limit = 999999;
                  requestBody.updated_settings.create_limit = 999999;
                  requestBody.updated_settings.article_image_upload_limit = 999999;
                  requestBody.updated_settings.max_files_per_user = 999999;
                  requestBody.updated_settings.max_files_per_repository = 999999;
                } else {
                  // Ensure MAX subscription settings in the full settings
                  requestBody.subscription_tier = 'max';
                  requestBody.subscription_status = 'active';
                  requestBody.subscription_source = 'stripe';
                  requestBody.stripe_status = 'active';
                  requestBody.gpt4_limit = 999999;
                  requestBody.pplx_alpha_limit = 999999;
                  requestBody.pplx_beta_limit = 999999;
                  requestBody.pages_limit = 999999;
                  requestBody.upload_limit = 999999;
                  requestBody.create_limit = 999999;
                  requestBody.article_image_upload_limit = 999999;
                  requestBody.max_files_per_user = 999999;
                  requestBody.max_files_per_repository = 999999;
                }

                // Update the request with modified body
                const modifiedInit = {
                  ...init,
                  body: JSON.stringify(requestBody)
                };

                log('Modified save-settings request with MAX subscription data');

                // Make the modified request
                const response = await originalFetch(input, modifiedInit);

                // Also modify the response to ensure MAX settings are returned
                try {
                  const cloned = response.clone();
                  const json = await cloned.json();

                  // Always ensure the response has MAX settings
                  json.subscription_tier = 'max';
                  json.subscription_status = 'active';
                  json.subscription_source = 'stripe';
                  json.stripe_status = 'active';
                  json.gpt4_limit = 999999;
                  json.pplx_alpha_limit = 999999;
                  json.pplx_beta_limit = 999999;
                  json.pages_limit = 999999;
                  json.upload_limit = 999999;
                  json.create_limit = 999999;
                  json.article_image_upload_limit = 999999;
                  json.max_files_per_user = 999999;
                  json.max_files_per_repository = 999999;

                  // Log the modified response for debugging
                  log('Modified PUT/POST save-settings response with MAX subscription data');

                  return new Response(JSON.stringify(json), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                  });
                } catch (e) {
                  // If there's an error processing the response, return the original
                  log('Error modifying save-settings response: ' + e.message);
                  return response;
                }
              } catch (e) {
                log('Error processing save-settings request: ' + e.message);
                // If there's an error, proceed with the original request
                return originalFetch(input, init);
              }
            }
          }

          // For all other requests, proceed normally
          const response = await originalFetch(input, init);

          // Check if the response is JSON and modify it if needed
          try {
            // Check if the response is actually JSON
            const ct = response.headers.get('content-type') || '';
            if (!ct.startsWith('application/json')) return response;

            const cloned = response.clone();
            const json = await cloned.json();

            // Cache successful GET responses that aren't SSE
            if (method === 'GET' && response.ok && !url.includes('/rest/sse/')) {
              setCachedResponse(url, json);
            }

            if (patchDataRecursively(json)) {
              log(`Response modified ← ${url}`);
              forceReactUpdate();

              // Cache the modified response
              if (method === 'GET' && !url.includes('/rest/sse/')) {
                setCachedResponse(url, json);
              }

              return new Response(JSON.stringify(json), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            }
          } catch (e) {
            /* not JSON — ignore */
          }

          return response;
        } catch (e) {
          log('Error in fetch interceptor:', e);
          // If there's a critical error, fall back to original fetch
          return originalFetch(input, init);
        }
      };

      // Also inject the fetch interceptor into the page context
      const injectFetchInterceptor = () => {
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Setting up fetch interceptor');

            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
              try {
                // Extract URL and method
                const url = typeof input === 'string' ? input : input.url;
                const method = init?.method || 'GET';

                // CRITICAL: Handle rate-limit requests - MUST intercept these
                if (url && url.includes('/rest/rate-limit/all')) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Intercepted rate-limit request - FORCING UNLIMITED LIMITS');

                  // ALWAYS return our custom response with unlimited limits
                  const unlimitedResponse = {
                    remaining_pro: 999999,
                    remaining_research: 999999,
                    remaining_labs: 999999,
                    remaining_uploads: 999999,
                    remaining_copilot: 999999,
                    remaining_search: 999999,
                    remaining_create: 999999,
                    rate_limited: false
                  };

                  // Return our custom response directly, bypassing the server
                  return new Response(JSON.stringify(unlimitedResponse), {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                }

                // Handle save-settings requests
                if (url && url.includes('/rest/user/save-settings')) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Intercepted save-settings request');

                  // For GET requests, we'll handle the response
                  if (method === 'GET') {
                    const response = await originalFetch(input, init);
                    try {
                      const cloned = response.clone();
                      const json = await cloned.json();

                      // Modify the settings to ensure MAX subscription
                      json.subscription_tier = 'max';
                      json.subscription_status = 'active';
                      json.subscription_source = 'stripe';
                      json.stripe_status = 'active';
                      json.gpt4_limit = 999999;
                      json.pplx_alpha_limit = 999999;
                      json.pplx_beta_limit = 999999;
                      json.pages_limit = 999999;
                      json.upload_limit = 999999;
                      json.create_limit = 999999;
                      json.article_image_upload_limit = 999999;
                      json.max_files_per_user = 999999;
                      json.max_files_per_repository = 999999;

                      console.log('[PERPLEXITY-MAX-INJECTED] Modified GET save-settings response');

                      // Return the modified response
                      return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                      });
                    } catch (e) {
                      console.error('[PERPLEXITY-MAX-INJECTED] Error processing GET save-settings response:', e);
                      return response;
                    }
                  }
                }

                // For all other requests, proceed normally
                return originalFetch.apply(this, arguments);
              } catch (e) {
                console.error('[PERPLEXITY-MAX-INJECTED] Error in fetch interceptor:', e);
                // If there's a critical error, fall back to original fetch
                return originalFetch.apply(this, arguments);
              }
            };

            console.log('[PERPLEXITY-MAX-INJECTED] Fetch interceptor setup complete');
          })();
        `;

        document.head.appendChild(script);
        document.head.removeChild(script);
      };

      /* ───────────────────── SIMPLIFIED WebSocket HANDLING ──────────────── */
      // This is a simplified version that just logs connections but doesn't modify data
      // This avoids breaking the WebSocket connections
      const originalWebSocket = window.WebSocket;
      window.WebSocket = function(url, protocols) {
        log(`WebSocket connection to ${url}`);
        return new originalWebSocket(url, protocols);
      };

      /* ─────────────── BLOCK ANALYTICS AND TRACKING SCRIPTS ─────────────── */
      function blockAnalyticsScripts() {
        log('Setting up analytics and tracking script blocker');

        // Override XMLHttpRequest to block analytics
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;
        const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // Fix for XMLHttpRequest state issues
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
          // Store the state and URL for later use
          this._pplxState = 'OPENED';
          this._pplxUrl = url;

          if (typeof url === 'string' && (
            url.includes('datadoghq.com') ||
            url.includes('analytics') ||
            url.includes('telemetry') ||
            url.includes('metrics') ||
            url.includes('singular.net') ||
            url.includes('segment.io') ||
            url.includes('mixpanel') ||
            url.includes('facebook') ||
            url.includes('fbevents')
          )) {
            log(`Blocked XHR analytics request to: ${url}`);
            // Make this XHR do nothing but maintain proper state
            this._pplxBlocked = true;

            // Create a safe version that maintains proper state
            this.setRequestHeader = function(header, value) {
              // Allow setRequestHeader to be called without errors
              if (this._pplxState === 'OPENED') {
                // Just log but don't actually set headers
                verbose(`Blocked setRequestHeader for ${url}: ${header}=${value}`);
                return;
              } else {
                throw new DOMException('XMLHttpRequest.setRequestHeader: XMLHttpRequest state must be OPENED.');
              }
            };

            this.send = function(body) {
              // Change state to prevent further calls
              this._pplxState = 'DONE';

              // Simulate a successful response
              setTimeout(() => {
                if (typeof this.onreadystatechange === 'function') {
                  this.readyState = 4;
                  this.status = 200;
                  this.response = '{"success":true}';
                  this.responseText = '{"success":true}';
                  this.onreadystatechange();
                }

                if (typeof this.onload === 'function') {
                  this.onload();
                }
              }, 10);
            };

            // Still call original open to maintain proper state
            return originalXhrOpen.call(this, method, url, ...rest);
          }

          // For non-blocked requests, proceed normally
          return originalXhrOpen.call(this, method, url, ...rest);
        };

        // Safer setRequestHeader override
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
          try {
            // Only proceed if not blocked
            if (!this._pplxBlocked) {
              return originalXhrSetRequestHeader.call(this, header, value);
            } else {
              // For blocked requests, just pretend it worked
              verbose(`Blocked setRequestHeader: ${header}=${value}`);
              return;
            }
          } catch (e) {
            log(`Error in setRequestHeader: ${e.message}`);
            // If there's an error, don't break the page
            return;
          }
        };

        // Safer send override
        XMLHttpRequest.prototype.send = function(body) {
          try {
            // Only proceed if not blocked
            if (!this._pplxBlocked) {
              return originalXhrSend.call(this, body);
            } else {
              // For blocked requests, simulate success
              this._pplxState = 'DONE';
              setTimeout(() => {
                if (typeof this.onreadystatechange === 'function') {
                  this.readyState = 4;
                  this.status = 200;
                  this.response = '{"success":true}';
                  this.responseText = '{"success":true}';
                  this.onreadystatechange();
                }

                if (typeof this.onload === 'function') {
                  this.onload();
                }
              }, 10);
              return;
            }
          } catch (e) {
            log(`Error in send: ${e.message}`);
            // If there's an error, don't break the page
            return;
          }
        };

        // Inject script to block analytics in page context
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Setting up analytics blocker');

            // Block Datadog
            window.DD_RUM = {
              init: function() { console.log('[PERPLEXITY-MAX-INJECTED] Blocked Datadog init'); },
              addTiming: function() {},
              addAction: function() {},
              addError: function() {},
              startSessionReplayRecording: function() {},
              setGlobalContextProperty: function() {}
            };

            // Block other analytics services
            window.ga = function() { console.log('[PERPLEXITY-MAX-INJECTED] Blocked GA call'); };
            window.gtag = function() { console.log('[PERPLEXITY-MAX-INJECTED] Blocked GTM call'); };
            window._paq = { push: function() { console.log('[PERPLEXITY-MAX-INJECTED] Blocked Matomo call'); } };
            window.mixpanel = { track: function() {}, identify: function() {} };
            window.segment = { track: function() {}, identify: function() {} };
            window.amplitude = { track: function() {}, identify: function() {} };

            // Block Facebook Pixel
            window.fbq = function() {
              console.log('[PERPLEXITY-MAX-INJECTED] Blocked Facebook Pixel call');
            };

            // Block Facebook events
            window.FB = window.FB || {};
            window.FB.Event = window.FB.Event || { subscribe: function() {} };
            window.FB.CustomerChat = window.FB.CustomerChat || { hide: function() {}, show: function() {} };

            // Fix XMLHttpRequest issues
            try {
              const originalXhrOpen = XMLHttpRequest.prototype.open;
              const originalXhrSend = XMLHttpRequest.prototype.send;
              const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

              XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                // Store state for later use
                this._pplxState = 'OPENED';
                this._pplxUrl = url;

                if (typeof url === 'string' && (
                  url.includes('datadoghq.com') ||
                  url.includes('analytics') ||
                  url.includes('telemetry') ||
                  url.includes('metrics') ||
                  url.includes('singular.net') ||
                  url.includes('segment.io') ||
                  url.includes('mixpanel') ||
                  url.includes('facebook') ||
                  url.includes('fbevents')
                )) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Blocked XHR request:', url);
                  this._pplxBlocked = true;
                  return originalXhrOpen.call(this, method, 'data:text/plain,{}', ...rest);
                }

                return originalXhrOpen.call(this, method, url, ...rest);
              };

              XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
                if (this._pplxBlocked) {
                  // Do nothing for blocked requests
                  return;
                }
                return originalXhrSetRequestHeader.call(this, header, value);
              };

              XMLHttpRequest.prototype.send = function(body) {
                if (this._pplxBlocked) {
                  // Simulate success for blocked requests
                  this._pplxState = 'DONE';
                  setTimeout(() => {
                    if (typeof this.onreadystatechange === 'function') {
                      this.readyState = 4;
                      this.status = 200;
                      this.response = '{"success":true}';
                      this.responseText = '{"success":true}';
                      this.onreadystatechange();
                    }

                    if (typeof this.onload === 'function') {
                      this.onload();
                    }
                  }, 10);
                  return;
                }
                return originalXhrSend.call(this, body);
              };

              console.log('[PERPLEXITY-MAX-INJECTED] XMLHttpRequest patched successfully');
            } catch (e) {
              console.error('[PERPLEXITY-MAX-INJECTED] Failed to patch XMLHttpRequest:', e);
            }

            // Override fetch for analytics
            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
              const url = typeof input === 'string' ? input : input.url;
              if (url && (
                url.includes('datadoghq.com') ||
                url.includes('analytics') ||
                url.includes('telemetry') ||
                url.includes('metrics') ||
                url.includes('singular.net') ||
                url.includes('segment.io') ||
                url.includes('mixpanel') ||
                url.includes('facebook') ||
                url.includes('fbevents')
              )) {
                console.log('[PERPLEXITY-MAX-INJECTED] Blocked analytics fetch:', url);
                return new Response(JSON.stringify({ success: true }), {
                  status: 200,
                  statusText: 'OK',
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              return originalFetch.apply(this, arguments);
            };

            // Override any analytics-related properties
            Object.defineProperties(window, {
              analytics: {
                get: function() {
                  return {
                    track: function() {},
                    identify: function() {},
                    page: function() {}
                  };
                },
                configurable: true
              },
              dataLayer: {
                get: function() { return []; },
                set: function() {},
                configurable: true
              }
            });

            console.log('[PERPLEXITY-MAX-INJECTED] Analytics blocker setup complete');
          })();
        `;

        document.head.appendChild(script);
        document.head.removeChild(script);
      }

      /* ─────────────────── FORCE MAX SUBSCRIPTION ─────────────────── */
    function forceMaxSubscription() {
      // This function directly modifies subscription data in the DOM
      log('Forcing MAX subscription data');

      // 1. Force window.__NEXT_DATA__ if it exists (this contains initial state)
      try {
        if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props && window.__NEXT_DATA__.props.pageProps) {
          // Force user data
          if (window.__NEXT_DATA__.props.pageProps.user) {
            window.__NEXT_DATA__.props.pageProps.user.subscription_tier = 'max';
            window.__NEXT_DATA__.props.pageProps.user.subscription_status = 'active';
            window.__NEXT_DATA__.props.pageProps.user.subscription_source = 'stripe';
            window.__NEXT_DATA__.props.pageProps.user.is_max = true;
            window.__NEXT_DATA__.props.pageProps.user.has_max = true;
            window.__NEXT_DATA__.props.pageProps.user.is_pro = true;
            log('Forced MAX subscription in __NEXT_DATA__.props.pageProps.user');
          }

          // Force subscription data
          if (window.__NEXT_DATA__.props.pageProps.subscription) {
            window.__NEXT_DATA__.props.pageProps.subscription.tier = 'max';
            window.__NEXT_DATA__.props.pageProps.subscription.status = 'active';
            window.__NEXT_DATA__.props.pageProps.subscription.source = 'stripe';
            log('Forced MAX subscription in __NEXT_DATA__.props.pageProps.subscription');
          }

          // Force rate limits
          if (window.__NEXT_DATA__.props.pageProps.usage) {
            if (window.__NEXT_DATA__.props.pageProps.usage.remaining_pro !== undefined) {
              window.__NEXT_DATA__.props.pageProps.usage.remaining_pro = 999999;
            }
            if (window.__NEXT_DATA__.props.pageProps.usage.remaining_research !== undefined) {
              window.__NEXT_DATA__.props.pageProps.usage.remaining_research = 999999;
            }
            if (window.__NEXT_DATA__.props.pageProps.usage.remaining_labs !== undefined) {
              window.__NEXT_DATA__.props.pageProps.usage.remaining_labs = 999999;
            }
            log('Forced unlimited usage in __NEXT_DATA__');
          }
        }
      } catch (e) {
        log('Error modifying __NEXT_DATA__: ' + e.message);
      }

      // 2. Inject a script to modify React state directly
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          console.log('[PERPLEXITY-MAX-INJECTED] Direct subscription override');

          // Override subscription data in localStorage
          try {
            const storageKeys = ['perplexity-user', 'perplexity-subscription', 'perplexity-usage'];

            storageKeys.forEach(key => {
              const data = localStorage.getItem(key);
              if (data) {
                try {
                  const parsed = JSON.parse(data);

                  if (key === 'perplexity-user') {
                    parsed.subscription_tier = 'max';
                    parsed.subscription_status = 'active';
                    parsed.subscription_source = 'stripe';
                    parsed.is_max = true;
                    parsed.has_max = true;
                    parsed.is_pro = true;
                  }

                  if (key === 'perplexity-subscription') {
                    parsed.tier = 'max';
                    parsed.status = 'active';
                    parsed.source = 'stripe';
                  }

                  if (key === 'perplexity-usage') {
                    if (parsed.remaining_pro !== undefined) parsed.remaining_pro = 999999;
                    if (parsed.remaining_research !== undefined) parsed.remaining_research = 999999;
                    if (parsed.remaining_labs !== undefined) parsed.remaining_labs = 999999;
                  }

                  localStorage.setItem(key, JSON.stringify(parsed));
                  console.log('[PERPLEXITY-MAX-INJECTED] Modified localStorage:', key);
                } catch (e) {
                  console.error('[PERPLEXITY-MAX-INJECTED] Error parsing localStorage:', e);
                }
              }
            });
          } catch (e) {
            console.error('[PERPLEXITY-MAX-INJECTED] Error accessing localStorage:', e);
          }

          // Try to find and modify React state directly
          function modifyReactState() {
            // Look for React fiber nodes
            let rootNode = document.querySelector('#__next');
            if (!rootNode) rootNode = document.querySelector('body > div');

            if (!rootNode) return;

            // Get React internal instance
            let internalInstance = null;

            // React 16+
            if (rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot) {
              internalInstance = rootNode._reactRootContainer._internalRoot.current;
            }

            // React 17+
            const reactKey = Object.keys(rootNode).find(key =>
              key.startsWith('__reactContainer$') ||
              key.startsWith('__reactFiber$')
            );

            if (reactKey) {
              internalInstance = rootNode[reactKey];
            }

            if (!internalInstance) return;

            // Walk the fiber tree to find subscription data
            function walkFiber(fiber) {
              if (!fiber) return;

              // Check for subscription state
              if (fiber.memoizedState && fiber.memoizedState.memoizedState) {
                const state = fiber.memoizedState.memoizedState;

                // Look for subscription data in state
                if (state.subscription || state.user || state.usage) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Found React state with subscription data');

                  if (state.subscription) {
                    state.subscription.tier = 'max';
                    state.subscription.status = 'active';
                    state.subscription.source = 'stripe';
                  }

                  if (state.user) {
                    state.user.subscription_tier = 'max';
                    state.user.subscription_status = 'active';
                    state.user.subscription_source = 'stripe';
                    state.user.is_max = true;
                    state.user.has_max = true;
                    state.user.is_pro = true;
                  }

                  if (state.usage) {
                    if (state.usage.remaining_pro !== undefined) state.usage.remaining_pro = 999999;
                    if (state.usage.remaining_research !== undefined) state.usage.remaining_research = 999999;
                    if (state.usage.remaining_labs !== undefined) state.usage.remaining_labs = 999999;
                  }

                  // Force update
                  if (fiber.stateNode && typeof fiber.stateNode.forceUpdate === 'function') {
                    fiber.stateNode.forceUpdate();
                  }
                }
              }

              // Walk child fibers
              if (fiber.child) walkFiber(fiber.child);
              if (fiber.sibling) walkFiber(fiber.sibling);
            }

            walkFiber(internalInstance);
          }

          // Run immediately and periodically
          modifyReactState();
          setInterval(modifyReactState, 5000);

          // Also override fetch responses for subscription endpoints
          const originalFetch = window.fetch;
          window.fetch = async function(input, init) {
            const url = typeof input === 'string' ? input : input.url;

            // Check if this is a subscription-related request
            const isSubscriptionRequest = url && (
              url.includes('/api/user') ||
              url.includes('/api/subscription') ||
              url.includes('/api/auth/session')
            );

            if (isSubscriptionRequest) {
              console.log('[PERPLEXITY-MAX-INJECTED] Intercepted subscription request:', url);

              // For session requests, return a modified response
              if (url.includes('/api/auth/session')) {
                return new Response(JSON.stringify({
                  user: {
                    subscription_tier: 'max',
                    subscription_status: 'active',
                    subscription_source: 'stripe',
                    is_max: true,
                    has_max: true,
                    is_pro: true
                  }
                }), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                });
              }
            }

            // For other requests, proceed normally
            return originalFetch.apply(this, arguments);
          };
        })();
      `;

      document.head.appendChild(script);
      document.head.removeChild(script);

      // 3. Also directly modify any visible plan elements
      const planElements = document.querySelectorAll('[data-plan], [data-tier], [data-subscription]');
      planElements.forEach(element => {
        if (element.getAttribute('data-plan') === 'pro') {
          element.setAttribute('data-plan', 'max');
          log('Changed data-plan from pro to max');
        }

        if (element.getAttribute('data-tier') === 'pro') {
          element.setAttribute('data-tier', 'max');
          log('Changed data-tier from pro to max');
        }

        if (element.getAttribute('data-subscription') === 'pro') {
          element.setAttribute('data-subscription', 'max');
          log('Changed data-subscription from pro to max');
        }
      });

      // 4. Force model selection buttons to be clickable
      const modelButtons = document.querySelectorAll('button[aria-label="Choose a model"], [data-model-selector="true"]');
      modelButtons.forEach(button => {
        // Clone the button to remove all event listeners
        const newButton = button.cloneNode(true);

        // Make sure it's visible and clickable
        newButton.style.display = '';
        newButton.style.visibility = 'visible';
        newButton.style.pointerEvents = 'auto';
        newButton.style.cursor = 'pointer';

        // Remove any disabled attributes
        newButton.removeAttribute('disabled');
        newButton.setAttribute('aria-disabled', 'false');

        // Add a click event listener that will force the dropdown to appear
        newButton.addEventListener('click', () => {
          log('Model button clicked');
        });

        // Replace the original button
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          log('Replaced model button with enhanced version');
        }
      });
    }

      /* ─────────────────── ADD STATUS INDICATOR ─────────────────── */
      function addStatusIndicator() {
        // Create a simple status indicator
        const statusDiv = document.createElement('div');
        statusDiv.style.position = 'fixed';
        statusDiv.style.bottom = '20px';
        statusDiv.style.right = '20px';
        statusDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusDiv.style.color = '#00ff9d';
        statusDiv.style.padding = '8px 15px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.zIndex = '9999';
        statusDiv.style.opacity = '0.9';
        statusDiv.style.transition = 'opacity 0.3s, transform 0.3s';
        statusDiv.style.fontFamily = 'Arial, sans-serif';
        statusDiv.style.userSelect = 'none';
        statusDiv.style.boxShadow = '0 2px 10px rgba(0, 255, 157, 0.3)';
        statusDiv.style.cursor = 'pointer';
        statusDiv.style.display = 'flex';
        statusDiv.style.flexDirection = 'column';
        statusDiv.style.gap = '5px';

        // Main title
        const titleDiv = document.createElement('div');
        titleDiv.textContent = 'PERPLEXITY MAX v2.1';
        titleDiv.style.display = 'flex';
        titleDiv.style.alignItems = 'center';
        titleDiv.style.justifyContent = 'space-between';
        titleDiv.style.width = '100%';

        // Status indicator dot
        const statusDot = document.createElement('span');
        statusDot.style.width = '8px';
        statusDot.style.height = '8px';
        statusDot.style.borderRadius = '50%';
        statusDot.style.backgroundColor = '#00ff9d';
        statusDot.style.display = 'inline-block';
        statusDot.style.marginLeft = '8px';
        statusDot.style.boxShadow = '0 0 5px #00ff9d';

        titleDiv.appendChild(statusDot);
        statusDiv.appendChild(titleDiv);

        // Status text
        const statusText = document.createElement('div');
        statusText.textContent = 'All features active';
        statusText.style.fontSize = '10px';
        statusText.style.opacity = '0.8';
        statusDiv.appendChild(statusText);

        // Add to DOM
        document.body.appendChild(statusDiv);

        // Stats container (initially hidden)
        const statsDiv = document.createElement('div');
        statsDiv.style.overflow = 'hidden';
        statsDiv.style.maxHeight = '0';
        statsDiv.style.transition = 'max-height 0.3s ease-out';
        statsDiv.style.fontSize = '10px';
        statsDiv.style.opacity = '0.8';
        statsDiv.style.marginTop = '5px';

        // Add stats content
        statsDiv.innerHTML = `
          <div>Cache size: <span id="pplx-max-cache-size">0</span> items</div>
          <div>Requests intercepted: <span id="pplx-max-requests">0</span></div>
        `;
        statusDiv.appendChild(statsDiv);

        // Counter for intercepted requests
        let interceptedRequests = 0;

        // Update stats periodically
        const updateStats = () => {
          const cacheSize = document.getElementById('pplx-max-cache-size');
          if (cacheSize) cacheSize.textContent = responseCache.size;

          const requestsCount = document.getElementById('pplx-max-requests');
          if (requestsCount) requestsCount.textContent = interceptedRequests;
        };

        // Intercept fetch to count requests
        const originalFetchProxy = window.fetch;
        window.fetch = function(...args) {
          interceptedRequests++;
          updateStats();
          return originalFetchProxy.apply(this, args);
        };

        // Toggle stats visibility on click
        let statsVisible = false;
        statusDiv.addEventListener('click', () => {
          statsVisible = !statsVisible;
          if (statsVisible) {
            statsDiv.style.maxHeight = '100px';
            updateStats();
          } else {
            statsDiv.style.maxHeight = '0';
          }
        });

        // Fade out after 5 seconds, but stay visible on hover
        let fadeTimeout;
        const startFadeOut = () => {
          fadeTimeout = setTimeout(() => {
            statusDiv.style.opacity = '0.3';
          }, 5000);
        };

        statusDiv.addEventListener('mouseenter', () => {
          clearTimeout(fadeTimeout);
          statusDiv.style.opacity = '0.9';
        });

        statusDiv.addEventListener('mouseleave', () => {
          startFadeOut();
        });

        startFadeOut();

        // Add neon author credit
        addNeonAuthorCredit();

        // Return the intercepted requests counter for other functions to use
        return { incrementRequestCount: () => {
          interceptedRequests++;
          updateStats();
        }};
      }

      /* ─────────────────── ADD NEON AUTHOR CREDIT ─────────────────── */
      function addNeonAuthorCredit() {
        // Create wrapper for the neon text
        const neonWrapper = document.createElement('div');
        neonWrapper.style.position = 'fixed';
        neonWrapper.style.bottom = '60px';
        neonWrapper.style.right = '20px';
        neonWrapper.style.zIndex = '9999';
        neonWrapper.style.userSelect = 'none';
        neonWrapper.style.opacity = '0';
        neonWrapper.style.transition = 'opacity 1s ease-in-out';

        // Create the neon text element
        const neonText = document.createElement('div');
        neonText.textContent = 'by AntiKeks & d4nc3r';
        neonText.style.fontFamily = '"Courier New", monospace';
        neonText.style.fontSize = '14px';
        neonText.style.fontWeight = 'bold';
        neonText.style.color = '#fff';
        neonText.style.textShadow = `
          0 0 5px #ff6600,
          0 0 10px #ff6600,
          0 0 15px #ff6600,
          0 0 20px #ff6600,
          0 0 25px #ff6600,
          0 0 30px #ff6600
        `;
        neonText.style.animation = 'neonPulse 1.5s ease-in-out infinite alternate';

        // Create and add the style for the neon pulse animation
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          @keyframes neonPulse {
            from {
              text-shadow:
                0 0 5px #ff6600,
                0 0 10px #ff6600,
                0 0 15px #ff6600,
                0 0 20px #ff6600;
            }
            to {
              text-shadow:
                0 0 5px #ff6600,
                0 0 10px #ff8800,
                0 0 15px #ff8800,
                0 0 20px #ff8800,
                0 0 25px #ff8800,
                0 0 30px #ff8800,
                0 0 35px #ffaa00;
            }
          }

          @keyframes neonFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow:
                0 0 5px #ff6600,
                0 0 10px #ff6600,
                0 0 15px #ff8800,
                0 0 20px #ff8800,
                0 0 25px #ffaa00;
            }
            20%, 24%, 55% {
              text-shadow: none;
            }
          }
        `;
        document.head.appendChild(styleElement);

        // Add the neon text to the wrapper
        neonWrapper.appendChild(neonText);

        // Add the wrapper to the document
        document.body.appendChild(neonWrapper);

        // Fade in after a short delay
        setTimeout(() => {
          neonWrapper.style.opacity = '1';

          // Add flickering effect after it's visible
          setTimeout(() => {
            neonText.style.animation = 'neonFlicker 2s linear 1, neonPulse 1.5s ease-in-out infinite alternate';
          }, 2000);

          // Fade out after 6 seconds
          setTimeout(() => {
            neonWrapper.style.opacity = '0';

            // Remove from DOM after fade out
            setTimeout(() => {
              if (neonWrapper.parentNode) {
                neonWrapper.parentNode.removeChild(neonWrapper);
              }
              if (styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
              }
            }, 1000);
          }, 6000);
        }, 1000);
      }

      /* ─────────────────── ENABLE UNLIMITED UPLOADS ─────────────────── */
      function enableUnlimitedUploads() {
        log('Enabling unlimited file uploads');

        // Inject a script to modify any upload limits in the page context
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Enabling unlimited uploads');

            // Override any upload limit checks in the page context
            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
              const url = typeof input === 'string' ? input : input.url;

              // If this is an upload-related request, modify it
              if (url && url.includes('/uploads')) {
                // If there's a body, check for any limit-related fields
                if (init && init.body && typeof init.body === 'string') {
                  try {
                    const body = JSON.parse(init.body);

                    // Remove any limit-related fields
                    if (body.hasOwnProperty('limit')) {
                      body.limit = 999999;
                    }

                    if (body.hasOwnProperty('max_size')) {
                      body.max_size = 1000000000; // 1GB
                    }

                    if (body.hasOwnProperty('max_count')) {
                      body.max_count = 100;
                    }

                    // Update the request body
                    init.body = JSON.stringify(body);
                  } catch (e) {
                    // Not JSON - ignore
                  }
                }
              }

              return originalFetch.apply(this, arguments);
            };

            // Advanced fix for FormData.append issues
            try {
              // Store the original method
              const originalFormDataAppend = FormData.prototype.append;

              // Create a safer version that handles all edge cases
              FormData.prototype.append = function(name, value, filename) {
                // Handle the case when name is not a string
                if (typeof name !== 'string') {
                  try {
                    name = String(name);
                  } catch (e) {
                    name = 'unnamed';
                    console.warn('[PERPLEXITY-MAX-INJECTED] FormData.append: Invalid name parameter');
                  }
                }

                // Handle null or undefined values
                if (value === null || value === undefined) {
                  console.log('[PERPLEXITY-MAX-INJECTED] FormData.append: Converting null/undefined to empty string');
                  try {
                    return originalFormDataAppend.call(this, name, '', filename);
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] FormData.append failed with empty string:', e);
                    return; // Silently fail rather than breaking the page
                  }
                }

                // Handle File and Blob objects properly
                if (value instanceof File || value instanceof Blob) {
                  try {
                    return originalFormDataAppend.call(this, name, value, filename);
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] FormData.append failed with File/Blob:', e);
                    return; // Silently fail rather than breaking the page
                  }
                }

                // Handle string values
                if (typeof value === 'string') {
                  try {
                    return originalFormDataAppend.call(this, name, value, filename);
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] FormData.append failed with string:', e);
                    return; // Silently fail rather than breaking the page
                  }
                }

                // For objects, try to stringify them
                if (typeof value === 'object') {
                  try {
                    // Try to convert to a Blob first if it has certain properties
                    if (value.type && (value.size !== undefined || value.length !== undefined)) {
                      try {
                        const blob = new Blob([value], { type: value.type || 'application/octet-stream' });
                        return originalFormDataAppend.call(this, name, blob, filename || value.name);
                      } catch (blobError) {
                        console.warn('[PERPLEXITY-MAX-INJECTED] Failed to convert to Blob:', blobError);
                        // Fall through to JSON stringify
                      }
                    }

                    // Try JSON stringify
                    const jsonString = JSON.stringify(value);
                    return originalFormDataAppend.call(this, name, jsonString, filename);
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] FormData.append failed with object:', e);
                    try {
                      return originalFormDataAppend.call(this, name, '[object Object]', filename);
                    } catch (e2) {
                      console.error('[PERPLEXITY-MAX-INJECTED] FormData.append fallback failed:', e2);
                      return; // Silently fail rather than breaking the page
                    }
                  }
                }

                // For everything else, convert to string
                try {
                  const stringValue = String(value);
                  return originalFormDataAppend.call(this, name, stringValue, filename);
                } catch (e) {
                  console.error('[PERPLEXITY-MAX-INJECTED] FormData.append string conversion failed:', e);
                  return; // Silently fail rather than breaking the page
                }
              };

              console.log('[PERPLEXITY-MAX-INJECTED] FormData.append successfully patched');
            } catch (e) {
              console.error('[PERPLEXITY-MAX-INJECTED] Failed to patch FormData.append:', e);
            }

            // Block Facebook Pixel and other tracking scripts
            try {
              // Create dummy Facebook Pixel functions
              window.fbq = function() {
                console.log('[PERPLEXITY-MAX-INJECTED] Blocked Facebook Pixel call');
              };

              // Block Facebook events
              window.FB = window.FB || {};
              window.FB.Event = window.FB.Event || { subscribe: function() {} };
              window.FB.CustomerChat = window.FB.CustomerChat || { hide: function() {}, show: function() {} };

              console.log('[PERPLEXITY-MAX-INJECTED] Facebook tracking scripts blocked');
            } catch (e) {
              console.error('[PERPLEXITY-MAX-INJECTED] Failed to block Facebook tracking:', e);
            }

            // Also try to find and modify any upload limit variables in the page
            function overrideUploadLimits() {
              // Look for common variable names related to upload limits
              const globalVars = [
                'MAX_UPLOADS', 'MAX_UPLOAD_COUNT', 'UPLOAD_LIMIT',
                'MAX_UPLOAD_SIZE', 'FILE_UPLOAD_LIMIT', 'UPLOAD_MAX_FILES'
              ];

              globalVars.forEach(varName => {
                if (window[varName] !== undefined) {
                  if (typeof window[varName] === 'number') {
                    window[varName] = 999999;
                    console.log('[PERPLEXITY-MAX-INJECTED] Overrode global upload limit:', varName);
                  }
                }
              });

              // Also look for common object properties related to upload limits
              const objects = ['config', 'settings', 'options', 'limits', 'uploadConfig'];
              const properties = ['maxUploads', 'maxUploadSize', 'uploadLimit', 'fileLimit', 'maxFiles'];

              objects.forEach(objName => {
                if (window[objName]) {
                  properties.forEach(prop => {
                    if (window[objName][prop] !== undefined && typeof window[objName][prop] === 'number') {
                      window[objName][prop] = 999999;
                      console.log('[PERPLEXITY-MAX-INJECTED] Overrode upload limit:', objName + '.' + prop);
                    }
                  });
                }
              });
            }

            // Run immediately and periodically
            overrideUploadLimits();
            setInterval(overrideUploadLimits, 5000);
          })();
        `;

        document.head.appendChild(script);
        document.head.removeChild(script);

        // Set up tracking system for upload requests
        setupUploadTracking();
      }

      /* ─────────────────── AUTO-SAVE SESSIONS ─────────────────── */
      function setupAutoSave() {
        log('Setting up auto-save functionality');

        // Create a script to handle auto-saving
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Setting up auto-save functionality');

            // Storage key for saved sessions
            const STORAGE_KEY = 'pplx-max-saved-sessions';

            // Maximum number of saved sessions
            const MAX_SAVED_SESSIONS = 50;

            // Get saved sessions from localStorage
            const getSavedSessions = () => {
              try {
                const sessions = localStorage.getItem(STORAGE_KEY);
                return sessions ? JSON.parse(sessions) : [];
              } catch (e) {
                console.error('[PERPLEXITY-MAX-INJECTED] Error loading saved sessions:', e);
                return [];
              }
            };

            // Save sessions to localStorage
            const saveSessions = (sessions) => {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
              } catch (e) {
                console.error('[PERPLEXITY-MAX-INJECTED] Error saving sessions:', e);
              }
            };

            // Function to extract conversation data
            const extractConversationData = () => {
              // Look for conversation container
              const conversationContainer = document.querySelector('[data-conversation-container="true"]');
              if (!conversationContainer) return null;

              // Get all message elements
              const messageElements = conversationContainer.querySelectorAll('[data-message]');
              if (!messageElements.length) return null;

              const messages = [];
              messageElements.forEach(el => {
                const role = el.getAttribute('data-message-role') || 'unknown';
                const content = el.innerText || '';
                if (content.trim()) {
                  messages.push({ role, content });
                }
              });

              // Get title from URL or page title
              let title = '';
              try {
                const urlParams = new URLSearchParams(window.location.search);
                title = urlParams.get('q') || document.title || 'Untitled Conversation';
              } catch (e) {
                title = document.title || 'Untitled Conversation';
              }

              // Only save if we have messages
              if (messages.length === 0) return null;

              return {
                id: window.location.pathname,
                title: title.substring(0, 100), // Limit title length
                timestamp: Date.now(),
                messages,
                url: window.location.href
              };
            };

            // Auto-save current conversation
            const autoSaveConversation = () => {
              const conversationData = extractConversationData();
              if (!conversationData) return;

              const savedSessions = getSavedSessions();

              // Check if this conversation is already saved (by ID)
              const existingIndex = savedSessions.findIndex(s => s.id === conversationData.id);

              if (existingIndex !== -1) {
                // Update existing session
                savedSessions[existingIndex] = conversationData;
              } else {
                // Add new session
                savedSessions.unshift(conversationData);

                // Limit the number of saved sessions
                if (savedSessions.length > MAX_SAVED_SESSIONS) {
                  savedSessions.length = MAX_SAVED_SESSIONS;
                }
              }

              saveSessions(savedSessions);
              console.log('[PERPLEXITY-MAX-INJECTED] Auto-saved conversation:', conversationData.title);
            };

            // Set up auto-save interval
            setInterval(autoSaveConversation, 10000); // Save every 10 seconds

            // Also save on page unload
            window.addEventListener('beforeunload', autoSaveConversation);

            // Add global function to access saved sessions
            window.pplxMaxGetSavedSessions = () => {
              return getSavedSessions();
            };

            console.log('[PERPLEXITY-MAX-INJECTED] Auto-save functionality setup complete');
          })();
        `;

        document.head.appendChild(script);
        document.head.removeChild(script);
      }

      /* ─────────────────── TRACK UPLOAD REQUESTS ─────────────────── */
      function setupUploadTracking() {
        log('Setting up upload tracking system');

        // Inject a script to track upload requests and responses
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Setting up upload tracking system');

            // Track file upload events
            document.addEventListener('drop', function(e) {
              if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                console.log('[PERPLEXITY-MAX-INJECTED] File drop detected:', e.dataTransfer.files.length, 'files');
              }
            }, true);

            // Track file input changes
            document.addEventListener('change', function(e) {
              if (e.target && e.target.type === 'file' && e.target.files && e.target.files.length > 0) {
                console.log('[PERPLEXITY-MAX-INJECTED] File input change detected:', e.target.files.length, 'files');
              }
            }, true);

            // Override the FormData.append method to track file uploads
            const originalAppend = FormData.prototype.append;
            FormData.prototype.append = function(name, value, filename) {
              // Check if this is a file upload
              if (value instanceof Blob || value instanceof File) {
                console.log('[PERPLEXITY-MAX-INJECTED] File added to FormData:', name, filename || (value.name || 'blob'));
              }

              return originalAppend.call(this, name, value, filename);
            };
          })();
        `;

        document.head.appendChild(script);
        document.head.removeChild(script);
      }

      /* ─────────────────── FORCE UNLIMITED ACCESS ─────────────────── */
      function injectUnlimitedAccess() {
        log('Injecting unlimited access script into page context');

        // Create a script that will run in the page context
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[PERPLEXITY-MAX-INJECTED] Setting up unlimited access');

            // Create a debug logger
            const DEBUG = true;
            const debug = (...args) => DEBUG && console.log('[PERPLEXITY-MAX-DEBUG]', ...args);

            // Store original methods
            const originalFetch = window.fetch;
            const OriginalXMLHttpRequest = window.XMLHttpRequest;

            // Create a response modifier function
            function createMaxResponse(originalResponse) {
              // Define max settings
              const maxSettings = {
                subscription_tier: 'max',
                subscription_status: 'active',
                subscription_source: 'stripe',
                stripe_status: 'active',
                gpt4_limit: 999999,
                pplx_alpha_limit: 999999,
                pplx_beta_limit: 999999,
                pages_limit: 999999,
                upload_limit: 999999,
                create_limit: 999999,
                article_image_upload_limit: 999999,
                max_files_per_user: 999999,
                max_files_per_repository: 999999,
                rate_limited: false,
                remaining_pro: 999999,
                remaining_research: 999999,
                remaining_labs: 999999,
                remaining_uploads: 999999,
                remaining_copilot: 999999,
                remaining_search: 999999,
                remaining_create: 999999
              };

              // Apply max settings to response
              return Object.assign({}, originalResponse, maxSettings);
            }

            // Create a completely new XMLHttpRequest class
            window.XMLHttpRequest = function() {
              const xhr = new OriginalXMLHttpRequest();

              // Track request details
              let requestUrl = '';
              let requestMethod = '';
              let isImportant = false;
              let isModified = false;

              // Override open
              const originalOpen = xhr.open;
              xhr.open = function(method, url, ...args) {
                requestMethod = method;
                requestUrl = url;

                debug('XHR Open:', method, url);

                // Check if this is an important request
                if (typeof url === 'string') {
                  if (url.includes('/rest/rate-limit/all')) {
                    isImportant = true;
                    console.log('[PERPLEXITY-MAX-INJECTED] Important XHR detected: rate-limit');

                    // For rate-limit requests, we'll handle them specially
                    const fakeResponse = {
                      remaining_pro: 999999,
                      remaining_research: 999999,
                      remaining_labs: 999999,
                      remaining_uploads: 999999,
                      remaining_copilot: 999999,
                      remaining_search: 999999,
                      remaining_create: 999999,
                      rate_limited: false
                    };

                    // Create a fake URL that will be intercepted later
                    url = 'data:application/json,' + encodeURIComponent(JSON.stringify(fakeResponse));
                  }
                  else if (url.includes('/rest/user/save-settings')) {
                    isImportant = true;
                    console.log('[PERPLEXITY-MAX-INJECTED] Important XHR detected: save-settings');
                  }
                  else if (url.includes('/rest/uploads/create_upload_url')) {
                    isImportant = true;
                    console.log('[PERPLEXITY-MAX-INJECTED] Important XHR detected: upload-url');
                  }
                }

                return originalOpen.call(xhr, method, url, ...args);
              };

              // Override send
              const originalSend = xhr.send;
              xhr.send = function(body) {
                debug('XHR Send:', requestMethod, requestUrl, body);

                // Modify request body for important requests
                if (isImportant && body && typeof body === 'string') {
                  try {
                    const data = JSON.parse(body);

                    // For save-settings requests
                    if (requestUrl.includes('/rest/user/save-settings')) {
                      console.log('[PERPLEXITY-MAX-INJECTED] Modifying save-settings request body');

                      // If this is a partial update
                      if (data.updated_settings) {
                        console.log('[PERPLEXITY-MAX-INJECTED] Original updated_settings:', JSON.stringify(data.updated_settings));

                        data.updated_settings = Object.assign({}, data.updated_settings, {
                          subscription_tier: 'max',
                          subscription_status: 'active',
                          subscription_source: 'stripe',
                          stripe_status: 'active',
                          gpt4_limit: 999999,
                          pplx_alpha_limit: 999999,
                          pplx_beta_limit: 999999,
                          pages_limit: 999999,
                          upload_limit: 999999,
                          create_limit: 999999,
                          article_image_upload_limit: 999999,
                          max_files_per_user: 999999,
                          max_files_per_repository: 999999
                        });

                        console.log('[PERPLEXITY-MAX-INJECTED] Modified updated_settings:', JSON.stringify(data.updated_settings));
                      } else {
                        // Full update
                        Object.assign(data, {
                          subscription_tier: 'max',
                          subscription_status: 'active',
                          subscription_source: 'stripe',
                          stripe_status: 'active',
                          gpt4_limit: 999999,
                          pplx_alpha_limit: 999999,
                          pplx_beta_limit: 999999,
                          pages_limit: 999999,
                          upload_limit: 999999,
                          create_limit: 999999,
                          article_image_upload_limit: 999999,
                          max_files_per_user: 999999,
                          max_files_per_repository: 999999
                        });
                      }

                      // Update the body
                      body = JSON.stringify(data);
                      console.log('[PERPLEXITY-MAX-INJECTED] Modified request body:', body);
                    }
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] Error modifying request body:', e);
                  }
                }

                // For important requests, intercept the response
                if (isImportant) {
                  // Override responseText getter
                  let originalResponseText = '';
                  Object.defineProperty(xhr, 'responseText', {
                    get: function() {
                      if (isModified) {
                        return originalResponseText;
                      }

                      const response = xhr._responseText || '';

                      // Only modify JSON responses
                      if (response && response.startsWith('{')) {
                        try {
                          const data = JSON.parse(response);

                          // For rate-limit requests
                          if (requestUrl.includes('/rest/rate-limit/all')) {
                            console.log('[PERPLEXITY-MAX-INJECTED] Modifying rate-limit response');
                            const modifiedData = {
                              remaining_pro: 999999,
                              remaining_research: 999999,
                              remaining_labs: 999999,
                              remaining_uploads: 999999,
                              remaining_copilot: 999999,
                              remaining_search: 999999,
                              remaining_create: 999999,
                              rate_limited: false
                            };
                            originalResponseText = JSON.stringify(modifiedData);
                            isModified = true;
                            return originalResponseText;
                          }

                          // For save-settings requests
                          if (requestUrl.includes('/rest/user/save-settings')) {
                            console.log('[PERPLEXITY-MAX-INJECTED] Modifying save-settings response');
                            const modifiedData = createMaxResponse(data);
                            originalResponseText = JSON.stringify(modifiedData);
                            isModified = true;
                            return originalResponseText;
                          }

                          // For upload URL creation
                          if (requestUrl.includes('/rest/uploads/create_upload_url')) {
                            console.log('[PERPLEXITY-MAX-INJECTED] Modifying upload URL response');
                            data.rate_limited = false;

                            // If fields are null, create fake ones to allow uploads
                            if (!data.fields || !data.s3_bucket_url) {
                              data.s3_bucket_url = "https://api.cloudinary.com/v1_1/pplx/image/upload";
                              data.s3_object_url = "https://api.cloudinary.com/v1_1/pplx/image/upload/";
                              data.fields = {
                                timestamp: Date.now(),
                                unique_filename: "true",
                                folder: "user_uploads/unlimited/max",
                                use_filename: "true",
                                public_id: "unlimited_" + Date.now(),
                                transformation: "t_fit2",
                                type: "private",
                                resource_type: "image",
                                api_key: "168798331147639",
                                cloud_name: "pplx",
                                signature: "unlimited_max_signature"
                              };
                              data.file_uuid = "unlimited_" + Date.now();
                            }

                            originalResponseText = JSON.stringify(data);
                            isModified = true;
                            return originalResponseText;
                          }
                        } catch (e) {
                          console.error('[PERPLEXITY-MAX-INJECTED] Error modifying response:', e);
                        }
                      }

                      return response;
                    },
                    set: function(value) {
                      xhr._responseText = value;
                    }
                  });

                  // Override response getter
                  Object.defineProperty(xhr, 'response', {
                    get: function() {
                      // If we've modified the responseText, return that for JSON responses
                      if (isModified && xhr.responseType === '' || xhr.responseType === 'text') {
                        return xhr.responseText;
                      }

                      return xhr._response;
                    },
                    set: function(value) {
                      xhr._response = value;
                    }
                  });
                }

                // Monitor readyState changes
                const originalStateChange = xhr.onreadystatechange;
                xhr.onreadystatechange = function(e) {
                  if (xhr.readyState === 4) {
                    debug('XHR Complete:', requestMethod, requestUrl, xhr.status);

                    if (isImportant) {
                      debug('Response for important request:', xhr.responseText);
                    }
                  }

                  if (originalStateChange) {
                    return originalStateChange.call(xhr, e);
                  }
                };

                return originalSend.call(xhr, body);
              };

              return xhr;
            };

            // Override fetch with a proxy
            window.fetch = new Proxy(originalFetch, {
              apply: async function(target, thisArg, args) {
                // Extract URL and init
                let [input, init] = args;
                const url = typeof input === 'string' ? input : input.url;
                const method = init?.method || 'GET';

                debug('Fetch:', method, url);

                // Handle rate limit requests directly
                if (url && url.includes('/rest/rate-limit/all')) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Intercepting rate-limit fetch request');

                  return new Response(JSON.stringify({
                    remaining_pro: 999999,
                    remaining_research: 999999,
                    remaining_labs: 999999,
                    remaining_uploads: 999999,
                    remaining_copilot: 999999,
                    remaining_search: 999999,
                    remaining_create: 999999,
                    rate_limited: false
                  }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                  });
                }

                // Handle save-settings requests
                if (url && url.includes('/rest/user/save-settings')) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Intercepting save-settings fetch request');

                  // Modify request body for PUT/POST
                  if ((method === 'PUT' || method === 'POST') && init && init.body) {
                    try {
                      let body = {};

                      if (typeof init.body === 'string') {
                        body = JSON.parse(init.body);
                      }

                      // If this is a partial update
                      if (body.updated_settings) {
                        console.log('[PERPLEXITY-MAX-INJECTED] Original updated_settings:', JSON.stringify(body.updated_settings));

                        body.updated_settings = Object.assign({}, body.updated_settings, {
                          subscription_tier: 'max',
                          subscription_status: 'active',
                          subscription_source: 'stripe',
                          stripe_status: 'active',
                          gpt4_limit: 999999,
                          pplx_alpha_limit: 999999,
                          pplx_beta_limit: 999999,
                          pages_limit: 999999,
                          upload_limit: 999999,
                          create_limit: 999999,
                          article_image_upload_limit: 999999,
                          max_files_per_user: 999999,
                          max_files_per_repository: 999999
                        });

                        console.log('[PERPLEXITY-MAX-INJECTED] Modified updated_settings:', JSON.stringify(body.updated_settings));
                      } else {
                        // Full update
                        Object.assign(body, {
                          subscription_tier: 'max',
                          subscription_status: 'active',
                          subscription_source: 'stripe',
                          stripe_status: 'active',
                          gpt4_limit: 999999,
                          pplx_alpha_limit: 999999,
                          pplx_beta_limit: 999999,
                          pages_limit: 999999,
                          upload_limit: 999999,
                          create_limit: 999999,
                          article_image_upload_limit: 999999,
                          max_files_per_user: 999999,
                          max_files_per_repository: 999999
                        });
                      }

                      // Update the request
                      init.body = JSON.stringify(body);
                      console.log('[PERPLEXITY-MAX-INJECTED] Modified save-settings request body:', init.body);
                    } catch (e) {
                      console.error('[PERPLEXITY-MAX-INJECTED] Error modifying save-settings request:', e);
                    }
                  }

                  // Make the modified request
                  const response = await target.apply(thisArg, [input, init]);

                  // Clone and modify the response
                  try {
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    console.log('[PERPLEXITY-MAX-INJECTED] Original save-settings response:', JSON.stringify(data));

                    // Apply max settings
                    const maxData = createMaxResponse(data);

                    console.log('[PERPLEXITY-MAX-INJECTED] Modified save-settings response:', JSON.stringify(maxData));

                    return new Response(JSON.stringify(maxData), {
                      status: response.status,
                      statusText: response.statusText,
                      headers: response.headers
                    });
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] Error modifying save-settings response:', e);
                    return response;
                  }
                }

                // Handle upload URL creation
                if (url && url.includes('/rest/uploads/create_upload_url')) {
                  console.log('[PERPLEXITY-MAX-INJECTED] Intercepting upload URL creation fetch request');

                  // Make the original request
                  const response = await target.apply(thisArg, args);

                  try {
                    // Clone and get the data
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    console.log('[PERPLEXITY-MAX-INJECTED] Original upload URL response:', JSON.stringify(data));

                    // Always set rate_limited to false
                    data.rate_limited = false;

                    // If fields are null, create fake ones to allow uploads
                    if (!data.fields || !data.s3_bucket_url) {
                      data.s3_bucket_url = "https://api.cloudinary.com/v1_1/pplx/image/upload";
                      data.s3_object_url = "https://api.cloudinary.com/v1_1/pplx/image/upload/";
                      data.fields = {
                        timestamp: Date.now(),
                        unique_filename: "true",
                        folder: "user_uploads/unlimited/max",
                        use_filename: "true",
                        public_id: "unlimited_" + Date.now(),
                        transformation: "t_fit2",
                        type: "private",
                        resource_type: "image",
                        api_key: "168798331147639",
                        cloud_name: "pplx",
                        signature: "unlimited_max_signature"
                      };
                      data.file_uuid = "unlimited_" + Date.now();
                    }

                    console.log('[PERPLEXITY-MAX-INJECTED] Modified upload URL response:', JSON.stringify(data));

                    return new Response(JSON.stringify(data), {
                      status: response.status,
                      statusText: response.statusText,
                      headers: response.headers
                    });
                  } catch (e) {
                    console.error('[PERPLEXITY-MAX-INJECTED] Error modifying upload URL response:', e);
                    return response;
                  }
                }

                // For all other requests, proceed normally
                const response = await target.apply(thisArg, args);

                // For JSON responses, check if we need to modify them
                if (url && (
                  url.includes('/api/user') ||
                  url.includes('/api/subscription') ||
                  url.includes('/api/auth/session') ||
                  url.includes('/rest/user/')
                )) {
                  try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                      const clonedResponse = response.clone();
                      const data = await clonedResponse.json();

                      // Check if this response has any fields we want to modify
                      const keysToCheck = [
                        'subscription_tier', 'subscription_status', 'subscription_source',
                        'remaining_pro', 'remaining_research', 'remaining_labs',
                        'upload_limit', 'rate_limited', 'gpt4_limit'
                      ];

                      let shouldModify = false;
                      for (const key of keysToCheck) {
                        if (key in data) {
                          shouldModify = true;
                          break;
                        }
                      }

                      if (shouldModify) {
                        console.log('[PERPLEXITY-MAX-INJECTED] Modifying JSON response for:', url);
                        const maxData = createMaxResponse(data);

                        return new Response(JSON.stringify(maxData), {
                          status: response.status,
                          statusText: response.statusText,
                          headers: response.headers
                        });
                      }
                    }
                  } catch (e) {
                    // Not JSON or other error
                  }
                }

                return response;
              }
            });

            // Override Object.defineProperty to catch React state updates
            const originalDefineProperty = Object.defineProperty;
            Object.defineProperty = function(obj, prop, descriptor) {
              // Check if this is a subscription-related property
              if (prop === 'subscription_tier' || prop === 'subscription_status' ||
                  prop === 'is_pro' || prop === 'is_max' || prop === 'has_max') {

                // Force MAX values
                if (descriptor && descriptor.value !== undefined) {
                  if (prop === 'subscription_tier') descriptor.value = 'max';
                  if (prop === 'subscription_status') descriptor.value = 'active';
                  if (prop === 'is_pro' || prop === 'is_max' || prop === 'has_max') descriptor.value = true;
                }

                // For getters/setters
                if (descriptor && descriptor.get) {
                  const originalGetter = descriptor.get;
                  descriptor.get = function() {
                    let value = originalGetter.call(this);
                    if (prop === 'subscription_tier') value = 'max';
                    if (prop === 'subscription_status') value = 'active';
                    if (prop === 'is_pro' || prop === 'is_max' || prop === 'has_max') value = true;
                    return value;
                  };
                }
              }

              // Apply the original defineProperty
              return originalDefineProperty.call(this, obj, prop, descriptor);
            };

            // Create a global helper function to force MAX subscription
            window.forcePplxMax = function() {
              console.log('[PERPLEXITY-MAX-INJECTED] Manually forcing MAX subscription');

              // Try to find React state in the DOM
              const reactRoots = document.querySelectorAll('[data-reactroot]');
              reactRoots.forEach(root => {
                console.log('[PERPLEXITY-MAX-INJECTED] Found React root:', root);
              });

              // Force update by triggering resize and visibility events
              window.dispatchEvent(new Event('resize'));
              document.dispatchEvent(new Event('visibilitychange'));

              // Try to modify localStorage
              try {
                const storageKeys = ['perplexity-user', 'perplexity-subscription', 'perplexity-usage'];

                storageKeys.forEach(key => {
                  const data = localStorage.getItem(key);
                  if (data) {
                    try {
                      const parsed = JSON.parse(data);

                      if (key === 'perplexity-user') {
                        parsed.subscription_tier = 'max';
                        parsed.subscription_status = 'active';
                        parsed.subscription_source = 'stripe';
                        parsed.is_max = true;
                        parsed.has_max = true;
                        parsed.is_pro = true;
                      }

                      if (key === 'perplexity-subscription') {
                        parsed.tier = 'max';
                        parsed.status = 'active';
                        parsed.source = 'stripe';
                      }

                      if (key === 'perplexity-usage') {
                        if (parsed.remaining_pro !== undefined) parsed.remaining_pro = 999999;
                        if (parsed.remaining_research !== undefined) parsed.remaining_research = 999999;
                        if (parsed.remaining_labs !== undefined) parsed.remaining_labs = 999999;
                      }

                      localStorage.setItem(key, JSON.stringify(parsed));
                      console.log('[PERPLEXITY-MAX-INJECTED] Modified localStorage:', key);
                    } catch (e) {
                      console.error('[PERPLEXITY-MAX-INJECTED] Error parsing localStorage:', e);
                    }
                  }
                });
              } catch (e) {
                console.error('[PERPLEXITY-MAX-INJECTED] Error accessing localStorage:', e);
              }

              return "MAX subscription forced!";
            };

            // Run forcePplxMax periodically
            setInterval(window.forcePplxMax, 5000);

            console.log('[PERPLEXITY-MAX-INJECTED] Unlimited access setup complete. Use window.forcePplxMax() to force MAX subscription manually.');
          })();
        `;

        // Add the script to the page
        document.head.appendChild(script);
        document.head.removeChild(script);
        log('Unlimited access script injected with advanced monitoring');
      }

      /* ─────────────────── INITIALIZATION ─────────────────── */
      function initializeScript() {
        log('Initializing Perplexity MAX script v2.1');

        // Version information
        const VERSION = {
          major: 2,
          minor: 1,
          patch: 0,
          date: '2025-10-18',
          features: [
            'Improved caching system',
            'Auto-save conversations',
            'Enhanced error handling',
            'Latest model support',
            'Expanded feature set',
            'Improved UI indicators'
          ]
        };

        // Log version info
        log(`Version ${VERSION.major}.${VERSION.minor}.${VERSION.patch} (${VERSION.date})`);
        log(`New features: ${VERSION.features.join(', ')}`);

        // Add a mutation observer to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
          // Check if body exists
          if (document.body) {
            // Run our main functions
            forceMaxSubscription(); // Force MAX subscription when DOM changes
            enableUnlimitedUploads(); // Enable unlimited uploads
            blockAnalyticsScripts(); // Block analytics and tracking
            injectUnlimitedAccess(); // Inject unlimited access script
            setupAutoSave(); // Set up auto-save functionality

            // Disconnect after initial setup to avoid performance issues
            observer.disconnect();

            // Add status indicator
            const statusIndicator = setTimeout(addStatusIndicator, 2000);

            // Set up periodic checks with improved error handling
            const subscriptionInterval = setInterval(() => {
              try {
                forceMaxSubscription();
              } catch (e) {
                log('Error in periodic subscription check:', e);
              }
            }, 10000);

            // Add global access to version info
            window.PERPLEXITY_MAX_VERSION = VERSION;

            // Expose a global API for debugging and extensions
            window.PERPLEXITY_MAX_API = {
              forceUpdate: forceReactUpdate,
              forceSubscription: forceMaxSubscription,
              version: VERSION,
              getCacheSize: () => responseCache.size,
              clearCache: () => {
                responseCache.clear();
                log('Cache cleared');
              }
            };
          }
        });

        // Start observing with error handling
        try {
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true
          });
        } catch (e) {
          log('Error setting up mutation observer:', e);
          // Fallback to direct initialization
          if (document.body) {
            initializeDirect();
          } else {
            window.addEventListener('DOMContentLoaded', initializeDirect);
          }
        }

        // Direct initialization function for fallback
        function initializeDirect() {
          forceMaxSubscription(); // Force MAX subscription immediately
          enableUnlimitedUploads(); // Enable unlimited uploads
          blockAnalyticsScripts(); // Block analytics and tracking
          injectUnlimitedAccess(); // Inject unlimited access script
          setupAutoSave(); // Set up auto-save functionality
          setTimeout(addStatusIndicator, 2000);
          setInterval(forceMaxSubscription, 10000); // Periodically force MAX subscription
        }

        // If body already exists, run immediately
        if (document.body) {
          observer.disconnect();
          initializeDirect();
        }
      }

      // Start the script
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
      } else {
        initializeScript();
      }
    })();


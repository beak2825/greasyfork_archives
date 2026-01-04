// ==UserScript==
// @name         Comprehensive Request and Response Logger
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Capture and log all requests and responses including headers and body
// @author       You
// @match        *://*/*
// @license MIT License with Custom Restrictions
/* Personal Use Only, No Commercial Use, No Modification License
 *
 * This software/script ("the Script") is provided for personal use only and not for commercial purposes.
 * Commercial use, redistribution, modification, or any other use not expressly permitted under this license is prohibited.
 *
 * You may not:
 * - Use the Script for any commercial purposes.
 * - Redistribute or sublicense the Script.
 * - Modify or create derivative works based on the Script.
 *
 * The Script is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Script or the use or other dealings in the Script.
 *
 * By using the Script, you agree to abide by the terms of this license.
 */
 
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/481052/Comprehensive%20Request%20and%20Response%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/481052/Comprehensive%20Request%20and%20Response%20Logger.meta.js
// ==/UserScript==


// Reference:
// https://www.xbext.com/docs/user-script-api-reference.html
// https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
// https://zh.javascript.info/fetch
// https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch

/*脚本能够拦截并记录所有发出的 `fetch` 请求和接收到的响应。这包括：
1. **记录请求和响应的详细信息**：包括 URL、方法、headers 和 body。
2. **特别处理不同的响应类型**：
    - `text/event-stream`：记录事件流的开始和结束，不直接处理流内容。
    - 媒体类型（如 `image/`，`video/`，`audio/`）：记录媒体文件的基本信息并提供 Blob URL 以供下载或查看。
3. **异常处理**：捕获并记录可能出现的异常，如请求中断。
4. **保持性能**：在记录信息时考虑到性能影响，避免过度消耗资源。
5. 要等到所有 window.fetch 请求完成后再执行某些操作

这个脚本的目的是为了调试和分析网络活动，同时确保处理过程不会对页面的正常功能产生负面影响。
*/

(function() {
    'use strict';

    let recordNetworkActivity = true;
    let enableDownload = true;


    async function handleEventStream(response, url) {
        let eventData = '';
        // let eventData = 'Event Stream started. Listening for events...';

        try {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 这里可以添加代码来处理实际的数据
                eventData += decoder.decode(value, { stream: true });
            }

            // eventData += 'Event Stream completed.';
        } catch (error) {
            console.error('Event Stream error for:', url, error);
            eventData += 'Error encountered in Event Stream.';
        }

        return eventData;
    }

    const extractHeaders = (headers) => {
        if (headers instanceof Headers) {
            let headerObj = {};
            headers.forEach((value, key) => {
                headerObj[key] = value;
            });
            return headerObj;
        } else {
            return headers || {};
        }
    };

    window.networkActivityLog = {};
    const originalFetch = window.fetch;
    const requestCounter = {};
    let activeFetchCount = 0;

    window.fetch = async (...args) => {
        activeFetchCount++; // 新的请求开始，增加计数器
        const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
        const requestMethod = args[0] instanceof Request ? args[0].method : (args[1] && args[1].method) || 'GET';
        const requestHeaders = extractHeaders(args[0] instanceof Request ? args[0].headers : args[1] && args[1].headers);
         const requestContentType = requestHeaders['content-type'] || requestHeaders['Content-Type'] || 'unknown';
        const requestBody = args[0] instanceof Request ? args[0].body : (args[1] && args[1].body) || null;

        const uniqueId = requestCounter[requestUrl] = (requestCounter[requestUrl] || 0) + 1;
        const uniqueUrl = `${requestUrl}?requestId=${uniqueId}`;

        // Styled title with summary for the request
        console.log('%cRequest%c to ' + requestUrl + ` ${requestMethod} ` + ` (Content-Type: ${requestContentType})`,
            'color: orange; font-weight: bold;', 'color: white;');
        // Detailed request information
        console.log(args);

        try {
            const response = await originalFetch(...args);
            const clonedResponse = response.clone();

            const responseHeaders = {};
            clonedResponse.headers.forEach((value, key) => { responseHeaders[key] = value; });
            const responseContentType = clonedResponse.headers.get('content-type') || 'unknown';
            // Log request and response details
            let responseBody;

              if (responseContentType.includes('application/json')) {
                  responseBody = await clonedResponse.json();
              } else if (responseContentType.includes('multipart/form-data')) {
                  responseBody = await clonedResponse.formData();
              } else if (responseContentType.includes('application/octet-stream')) {
                  responseBody = await clonedResponse.blob();
              } else if (responseContentType.includes('text/event-stream')) {
                  responseBody = await handleEventStream(clonedResponse, requestUrl);
              } else if (responseContentType.includes('image/') || responseContentType.includes('video/') || responseContentType.includes('audio/')) {
                  const contentLength = clonedResponse.headers.get('content-length') || 'unknown size';
                  const blob = await clonedResponse.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  console.log(`Media File detected: Type - ${responseContentType}, Size - ${contentLength}, URL - ${blobUrl}`);
                  responseBody = `Media File detected: Type - ${responseContentType}, Size - ${contentLength}. Download or view at: ${blobUrl}`;
              } else if (responseContentType.includes('application/xml') || responseContentType.includes('text/xml')) {
                  responseBody = await clonedResponse.text();  // XML 可以作为文本处理，或者进一步解析
              } else if (responseContentType.match(/text\/.*/)) {
                  responseBody = await clonedResponse.text();
              } else {
                  // responseBody = 'Unknown Content-Type (not logged)';
                  responseBody = await clonedResponse.text();
              }

            // Styled title with summary for the response
            console.log('%cResponse%c from ' + requestUrl + ' (Status: ' + clonedResponse.status + ' ' + clonedResponse.statusText + ')' + ` (Content-Type: ${responseContentType})`,
                'color: yellow; font-weight: bold;', 'color: white;');
            // Detailed response information
            console.log(responseHeaders, responseBody);

//           if (recordNetworkActivity && enableDownload){
//               // 下载每一个请求和响应到对应的文件
//               const dataStr = JSON.stringify({ request: [...args], response: { headers: [...clonedResponse.headers.entries()], body: responseBody }}, null, 2);
//               const blob = new Blob([dataStr], {type: "application/json"});
//               const objectURL = URL.createObjectURL(blob);
//               const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//                // 文件名中不能包含冒号和点
//               const filename = 'NetworkActivity-' + `${requestUrl}-${requestMethod}-${requestContentType}-${responseContentType}-${timestamp}` + '.json';
//             };
			  // 使用浏览器的下载功能
/* 			  const downloadAnchorNode = document.createElement('a');
			  downloadAnchorNode.setAttribute('href', objectURL);
			  downloadAnchorNode.setAttribute('download', filename);
			  document.body.appendChild(downloadAnchorNode); // 需要添加到文档中才能在某些浏览器中正常工作
			  downloadAnchorNode.click();
			  downloadAnchorNode.remove();  // 下载后从文档中移除元素 */

            // 将请求和响应数据存储到全局对象
            window.networkActivityLog[uniqueUrl] = {
                request: [...args],
                response: { headers: responseHeaders, body: responseBody, contentType: responseContentType }
            };

//             console.log(`window.networkActivityLog(${Object.keys(window.networkActivityLog).length}):\n`,  window.networkActivityLog)


            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        } finally {
          activeFetchCount--; // 请求完成，无论成功或失败，减少计数器
          if (activeFetchCount === 0) {
              // 所有请求都完成了
              console.log('All fetch requests completed');
              // 这里可以执行所有请求完成后的操作
              if (recordNetworkActivity && enableDownload){
                  // 下载每一个请求和响应到对应的文件
                  const dataStr = JSON.stringify( window.networkActivityLog, null, 2);
                  const blob = new Blob([dataStr], {type: "application/json"});
                  const objectURL = URL.createObjectURL(blob);
                  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                   // 文件名中不能包含冒号和点
                  const filename = 'NetworkActivity-' + `${location.hostname}${location.pathname.replace(/\//g, '_')}-${timestamp}` + '.json';
                  console.log(`download networkActivityLog(${Object.keys(window.networkActivityLog).length}): ${filename}`)

                  // 使用浏览器的下载功能
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute('href', objectURL);
                  downloadAnchorNode.setAttribute('download', filename);
                  document.body.appendChild(downloadAnchorNode); // 需要添加到文档中才能在某些浏览器中正常工作
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();  // 下载后从文档中移除元素

                }

                console.log(`window.networkActivityLog(${Object.keys(window.networkActivityLog).length}):\n`,  window.networkActivityLog);
          }
        }
    };




})();

// ==UserScript==
// @name         Save Fewer Files
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save pages with fewer files by embedding resources directly into the page.
// @author       GravyGrass
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/406554/Save%20Fewer%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/406554/Save%20Fewer%20Files.meta.js
// ==/UserScript==

// Thrown when a fetch request returns 404
class UrlNotFoundError extends Error {
  constructor(url) {
    super(`URL not found: ${url}`);
  }
};

const FRAME_INLINE_SIZE_LIMIT = 1024 * 1024;

function GM_fetch(url, win) {
  if (typeof url != 'string') {
    throw new Error(`URL is not a string: ${url}`);
  }
  if (!win.location) {
    throw new Error('Window object has no location');
  }
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      headers: {
        'Referer': win.location,
      },
      responseType: 'blob',
      onabort: () => reject('Fetch was aborted.'),
      onerror: () => reject('Fetch had an error.'),
      ontimeout: () => reject('Fetch timed out.'),
      onload: loadResult => {
        if (loadResult.readyState != XMLHttpRequest.DONE) {
          reject(`readyState is not DONE: ${loadResult.readyState}`);
        } else if (loadResult.status == 404) {
          reject(new UrlNotFoundError(url));
        } else if (loadResult.status != 200) {
          reject(`status is not 200: ${loadResult.status}\nURL: ${url}`);
        } else {
          resolve({
            blob: loadResult.response,
            text: loadResult.responseText,
          });
        }
      },
    });
  });
}

function replaceBaseUrl(htmlText, baseUrl) {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  const head = doc.head;
  const existingBases = head.getElementsByTagName('base');
  if (existingBases.length == 0) {
    const newBase = doc.createElement('base');
    newBase.href = baseUrl;
    head.appendChild(newBase);
  } else {
    const base = existingBases[0];
    if (!base.href) {
      base.href = baseUrl;
    }
  }
  return `<!DOCTYPE ${doc.doctype.name}>` + doc.documentElement.outerHTML;
}

function fetchResource(resourceUrl, triggerFunction, win) {
  //console.log(`Fetching ${resourceUrl}`);
  //return win.fetch(resourceUrl)
  return GM_fetch(resourceUrl, win)
  .then(response => response.blob)
  //.then(response => response.blob())
  .then(blob => {
    //console.log(`Response ready for ${resourceUrl}`);
    const reader = new FileReader();
    const resultPromise = new Promise((resolve, reject) => {
      reader.addEventListener('loadend', () => {
        if (reader.error) {
          reject(reader.error);
        } else {
          resolve(reader.result);
        }
      });
    });
    triggerFunction(reader, blob);
    return resultPromise;
  });
}

function fetchAsDataUrl(resourceUrl, win) {
  return fetchResource(resourceUrl, (reader, blob) => reader.readAsDataURL(blob), win)
  .then(dataUrl => {
    if (!dataUrl.startsWith('data:')) {
      throw new Error('Data URL does not start with "data:"');
    }
    return dataUrl;
  });
}

function peek(promise) {
  return promise.then(r => {
    console.log(r);
    return r;
  });
}

function replaceHref(doc, tagName, win) {
  const elements = doc.getElementsByTagName(tagName);
  const fetchTasks = [];
  for (let element of elements) {
    if (element.href && !element.href.startsWith('data:')) {
      fetchTasks.push(
        fetchAsDataUrl(element.href, win).then(dataUrl => {
          element.href = dataUrl;
        })
      );
    }
  }
  console.log(`${fetchTasks.length} ${tagName} tasks in process`);
  return peek(Promise.all(fetchTasks));
}

function replaceSrc(doc, tagName, win) {
  const elements = doc.getElementsByTagName(tagName);
  const fetchTasks = [];
  for (let element of elements) {
    if (element.src && !element.src.startsWith('data:')) {
      fetchTasks.push(
        fetchAsDataUrl(element.src, win)
        .then(dataUrl => {
          element.src = dataUrl;
        })
        .catch(e => {
          if (e instanceof UrlNotFoundError) {
            element.removeAttribute('src');
            console.error(e);
          } else {
            throw e;
          }
        })
      );
    }
  }
  console.log(`${fetchTasks.length} ${tagName} tasks in process`);
  return peek(Promise.all(fetchTasks));
}

function replaceDocument(doc, win) {
  console.log('Replacing document', doc, win);
  return peek(Promise.all([
    replaceHref(doc, 'link', win),
    replaceSrc(doc, 'img', win),
    replaceSrc(doc, 'script', win),
    replaceSrc(doc, 'video', win),
  ]));
}

function processDocument(doc, win) {
  const tasks = [];
  tasks.push(replaceDocument(doc, win));
  const frames = doc.getElementsByTagName('iframe');
  for (let frame of frames) {
    console.log('Go into frame', frame);
    if (frame.contentDocument) {
	    tasks.push(processDocument(frame.contentDocument, frame.contentWindow));
    }
  }
  return Promise.all(tasks);
}

function combineFrames(doc) {
  const frames = doc.getElementsByTagName('iframe');
  for (let frame of frames) {
    console.log('Combining frame ', frame);
    const frameDoc = frame.contentDocument;
    if (frameDoc && frame.src) {
      console.log('Digging into frame');
      combineFrames(frameDoc);
      const frameHtml = frameDoc.documentElement.outerHTML;
      if (frameHtml.length > FRAME_INLINE_SIZE_LIMIT) {
        console.warn(`Skip inlining big frame with HTML size ${frameHtml.length}`, frame);
      } else {
        console.log(`Inline frame with HTML size ${frameHtml.length}`);
        frame.removeAttribute('src');
        frame.srcdoc = frameHtml;
      }
    } else {
      console.log('Frame empty');
    }
  }
}

function inlineFrames(doc, win) {
  if (!doc) {
    console.error('Document object is missing');
    throw new Error('Document object is missing');
  }
  if (!win) {
    console.error('Window object is missing');
    throw new Error('Window object is missing');
  }
  const frames = doc.getElementsByTagName('iframe');
  const tasks = [];
  for (let frame of frames) {
    //console.log('Trying to inline frame', frame);
    const frameDoc = frame.contentDocument;
    if (!frameDoc && frame.src) {
      console.log('Inlining frame', frame, 'src = ', frame.src);
      const originalFrameSrc = frame.src;
      tasks.push(
        GM_fetch(frame.src, win)
        .then(response => response.text)
        .then(frameText => {
          frame.removeAttribute('src');
          console.log(frameText);
          frame.srcdoc = replaceBaseUrl(frameText, originalFrameSrc);
          return new Promise((resolve, reject) => {
            frame.addEventListener('load', () => {
              if (frame.contentDocument) {
                resolve(frame);
              } else {
                console.error('Failed to load frame', frame);
                reject(new Error('Failed to load frame'));
              }
            });
          });
	      })
        .then(() => {
          inlineFrames(frame.contentDocument, frame.contentWindow);
        })
      );
    } else {
      tasks.push(inlineFrames(frame.contentDocument, frame.contentWindow));
    }
  }
  return Promise.all(tasks);
}

function embedResources() {
  try {
    inlineFrames(document, window)
    .then(() => {
      console.log('Frames: Initial inline completed.');
    })
    .then(() => {
    	return processDocument(document, window);
    })
    .then(result => {
      console.log('Process complete', result);
      combineFrames(document);
      console.log('Frame inline complete');
    })
    .catch(error => {
      console.error(error);
    });
  } catch (e) {
    console.error(e);
  }
}

GM_registerMenuCommand('Inline Everything', embedResources);
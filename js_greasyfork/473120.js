// ==UserScript==
// @name         MiddleMan Sandbox
// @namespace    Itsnotlupus Industries
// @description  A test script for the middleman library. See https://greasyfork.org/en/scripts/472943-itsnotlupus-middleman for details.
// @author       Itsnotlupus
// @version      1.4.1
// @license      MIT
// @run-at       document-start
// @match        *://*/*
// @require      https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @require      https://greasyfork.org/scripts/472943-itsnotlupus-middleman/code/middleman.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/473120/MiddleMan%20Sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/473120/MiddleMan%20Sandbox.meta.js
// ==/UserScript==

// standard Web APIs eshint doesn't know about
/* global DecompressionStream */
// things defined from @require scripts
/* global crel, logGroup, middleMan */

// If you see some sites complaining loudly about TrustedHTML issues caused by the hook below,
// you may choose to uncomment the next line to make them go away. Be wary, this has.. implications.
// unsafeWindow.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string})

// adapted from https://www.bram.us/2022/02/13/log-images-to-the-devtools-console-with-console-image/
// tweaked because Chrome now only accepts data: URIs as background urls in console.
async function blobToImageLog(blob, scale = 1) {
  const src = URL.createObjectURL(blob);
  try {
    let {target: img, target: { width, height } } = await new Promise((onload, onerror) =>crel('img', { src, onload, onerror }));
    const canvas = crel("canvas", { width, height });
    canvas.getContext('2d').drawImage(img, 0, 0);
    width *= scale; height *= scale;
    return ["%c .", `font-size:1px;padding:${~~(height/2)}px ${~~(width/2)}px;background:url("${canvas.toDataURL()}");background-size:${width}px ${height}px;color: transparent;`];
  } catch {
    return ["Invalid image", blob];
  } finally {
    URL.revokeObjectURL(src);
  }
}

function hexdump(buffer, blockSize = 16) {
  const lines = [];
  const array = new Uint8Array(buffer);
  for (let i = 0; i < array.length; i += blockSize) {
    const addr = i.toString(16).padStart(4, '0');
    let hex = '';
    let chars = '';
    for (let j = 0; j < blockSize ; j++) {
      const v = array[i+j];
      if (j%16==0) { hex += ' '; chars += ' '; }
      hex += ' ' + (v!=null ? v.toString(16).padStart(2, '0') : '  ');
      chars += v!=null ? v<32?'.':String.fromCharCode(v) : ' ';
    }
    lines.push(addr + ' ' + hex + '  ' + chars);
  }
  return lines.join('\n');
}

const urlParamsToObject = params => [...new URLSearchParams(params).entries()].reduce((obj, [key, val])=>((obj[key] ? !Array.isArray(obj[key])?obj[key] = [obj[key],val]:obj[key].push(val):obj[key]=val),obj),{});

const domainFromHostname = str => str.split('.').reduceRight((domain, chunk)=> domain.length<7&&chunk!='www' ? domain=chunk+'.'+domain : domain, '').slice(0,-1);

/**
 * Inspect the object passed and try to derive the most
 * immediately usable data representation from its body.
 *
 * @param {Request|Resource} r
 * @returns {{type: 'text'|'json'|'doc'|'image'|'binary', operations: string[], payload: any}}
 */
async function autoParseBody(r) {
  const unzip = (r,encoding="gzip") => new Response(r.body.pipeThrough(new DecompressionStream(encoding)));
  const toJSON = str => { try { return JSON.parse(str); } catch {} };
  const toText = buffer => new TextDecoder(charset).decode(buffer);
  const toArray = obj => Array.isArray(obj) ? obj : Object.keys(obj).reduce((a,k)=>((a[k]=obj[k]),a),[]);

  const isBinary = async blob => { try {new TextDecoder(charset, {fatal:true}).decode(await blob.arrayBuffer());return false} catch (e) { return true}};
  const isArrayShaped = obj => Array.isArray(obj) || Object.keys(obj).every(key => key==parseInt(key));
  const isArrayOfBytes = arr => arr.every(value => (value & 255) == value);
  const isURLEncoded = str => /^([a-z0-9_.~-]|%[0-9a-f]{2})+=([a-z0-9_.~-]|%[0-9a-f]{2})*(&([a-z0-9_.~-]|%[0-9a-f]{2})+=([a-z0-9_.~-]|%[0-9a-f]{2})*)*$/i.test(str);
  const isPerhapsURLEncoded = str => /[&%]/.test(str) || /^[a-z0-9_-]+=[a-z0-9_-]+$/g.test(str);
  const mayBeHTML = str => /<\/\s*html\s*>/i.test(str);
  const mayBeXML = str => /<[a-z]+.*?(>.*?<\/[a-z]+>|\/>)/i.test(str);

  const contentType = r.headers.get('content-type')?.split(';')[0] ?? '';
  const charset = r.headers.get('content-type')?.match(/charset=(?<charset>[^()<>@,;:\"/[\]?.=\s]*)/i)?.groups?.charset ?? "utf-8";
  const encoding = r.headers.get('content-encoding');
  let ops = [];
  // 1. unzip any compressed content.
  if (r instanceof Request && ['gzip', 'deflate'].includes(encoding)) {
    // A web app went out of its way to compress a Request payload. cool.
    r = unzip(r, encoding);
    ops.push(encoding);
  }
  let body, type;

  // devour the body, leaving only a blob behind. j/k. we cloned it so you can still grab a working response in the console.
  const blob = await r.clone().blob();

  // 2. get rid of binary formats: images.
  if (contentType.startsWith("image/")) {
    return {
      type: 'image',
      operations: ops.concat('raw'),
      payload: blob
    };
  }
  // 3. get rid of other binary formats.
  if (await isBinary(blob)) {
    return {
      type: 'binary',
      operations: ops.concat('raw'),
      payload: blob
    };
  }
  // 4. from here on, everything is text-based. more or less.
  async function decodeText(text, operations, hint = '') {
    // explicit url-encoded content, with a guardrail for mis-typed payloads
    if (hint == "application/x-www-form-urlencoded" && isPerhapsURLEncoded(text)) {
      const obj = urlParamsToObject(text);
      operations.push('urlparams');
      return await decodeJSON(obj, operations);
    }
    // explicit json content
    if (hint.includes('json')) {
      // dumb loop to skip over security-minded folks that add junk characters at the beginning of their json payloads.
      for (let i=0;i<10;i++) {
        const obj = toJSON(text.slice(i));
        if (obj !== undefined) {
          operations.push('json');
          return await decodeJSON(obj, operations);
        }
      }
    }
    // explicit html or xml content
    if (hint.includes('html') || hint.includes('xml')) {
      try {
        const doc = new DOMParser().parseFromString(text, hint);
        operations.push(hint.includes('html')?'html':'xml');
        return {
          type: 'doc',
          operations,
          payload: doc
        }
      } catch {}
    }
    // implicit json content
    if (text[0]=='[' || text[0]=='{') { // "1" is not an interesting JSON content.
      // dumb loop to skip over security-minded folks that add junk characters at the beginning of their json payloads.
      for (let i=0;i<10;i++) {
        const obj = toJSON(text.slice(i));
        if (obj !== undefined) {
          operations.push('json');
          return await decodeJSON(obj, operations);
        }
      }
    }
    // implicit HTML content
    if (mayBeHTML(text)) {
      try {
        let node = new DOMParser().parseFromString(text, 'text/html');
        if (node.childElementCount ==1) node = node.firstChild;
        operations.push('html');
        return {
          type: 'doc',
          operations,
          payload: node
        }
      } catch {}
    }
    if (mayBeXML(text)) {
      try {
        let node = new DOMParser().parseFromString(text, 'text/xml');
        if (node.childElementCount ==1) node = node.firstChild;
        operations.push('xml');
        return {
          type: 'doc',
          operations,
          payload: node
        }
      } catch {}
    }

    // implicit url-encoded content
    if (isURLEncoded(text) && isPerhapsURLEncoded(text)) {
      const obj = urlParamsToObject(text);
      operations.push('urlparams');
      return await decodeJSON(obj, operations);
    }

    // implicit base64 of non-empty US ASCII strings
    if (text.length) {
      try {
        const decoded = atob(unescape(text.replace(/_/g,'/').replace(/-/g,'+'))); // handles URI-escaped strings, as well as "web-safe" base64.
        if (/^[0x0d0x0a0x20-0x7f]*$/.test(decoded)) { // but only keep ascii results.
          operations.push('base64');
          return {
            type: 'base64',
            operations,
            payload: decoded
          }
        }
      } catch {}
    }

    // sometimes a chunk of text is just a chunk of text.
    return {
      type: 'text',
      operations,
      payload: text
    };
  }

  async function decodeJSON(obj, operations) {
    if (obj) {
      // 1. is our object an array?
      if (isArrayShaped(obj)) {
        const array = toArray(obj);
        // 1.1 is our array an array of bytes
        if (array.length> 10 && isArrayOfBytes(array)) {
          let buffer = Uint8Array.from(array).buffer;
          //operations.push('binary');
          // how high are the odds of ever seeing this in the wild? The answer may surprise you (youtube/log_event)
          if (buffer.byteLength > 10 && new DataView(buffer).getInt16() == 0x1f8b) { // gzip magic number
            buffer = await unzip(new Response(buffer)).arrayBuffer();
            operations.push('gzip');
            const text = toText(buffer);
            operations.push('text');
            return await decodeText(text, operations);
          }
        }
      }
      // 2. dig into the object fields. XXX this might be a terrible idea.
      if (typeof obj == 'object') {
        const sub_ops = Object.assign([], { toString() { return `[ ${this.join()} ]`; }});
        // XXX this messes with `operations` a lot. tweak how operations track things.
        await Promise.all(Object.keys(obj).map(async key => obj[key] = typeof obj[key] == 'string' ? (await decodeText(obj[key], sub_ops)).payload : obj[key] )); //(await decodeJSON(obj[key], sub_ops)).payload));
        if (sub_ops.length) operations.push(sub_ops);
      }
    }
    return {
      type: 'json',
      operations,
      payload: obj
    };
  }

  if (blob.size == 0) {
    return { type: 'empty', operations: ['empty'], payload: '' }
  }
  const text = toText(await blob.arrayBuffer()); // this is charset aware, unlike r.text().
  return await decodeText(text, ['text'], contentType);
}

// logging hook. tries to show what's going on, decoding bodies in potentially convoluted ways.
const logHook = async (req, res, err) => {

  // used to prefix an object in the console.
  function QueryString(obj) { Object.assign(this, obj); }
  function Body(obj) { return typeof obj == 'string' || obj instanceof Blob ? obj : Object.assign(this, obj); }

  async function logHalf(r) {
    const t = Date.now();
    const headers = [...r.headers.entries()].map(a=>a.join(": ")).join('\n');
    const { type, operations, payload } = await autoParseBody(r);
    let body, size;
    switch (type) {
      case 'image':
        size = payload.size;
        body = await blobToImageLog(payload);
        break;
      case 'empty':
      case 'text':
        size = payload.length;
        body = payload;
        break;
      case 'json':
        size = JSON.stringify(payload).length;
        body = payload;
        break;
      case 'doc':
        size = new XMLSerializer().serializeToString(payload).length;
        body = payload;
        break;
      case 'binary':
        // body = hexdump(await payload.arrayBuffer(), 32); // expensive, and not really useful
        size = payload.size;
        body = payload;
        break;
    }
    const method = r.method ?? 'GET';
    return { size, type, method, ops: operations.join(' => '), headers, body, cost: Date.now()-t };
  };
  const url = new URL(req.url);
  const short = domainFromHostname(url.hostname) + url.pathname;
  const reqObj = await logHalf(req);
  const query = await logHalf(new Response(url.searchParams, { headers: { 'content-type': 'application/x-www-form-urlencoded' }}));
  const type = reqObj.type == 'empty' ? query.type : reqObj.type;
  const size = reqObj.type == 'empty' ? query.size : reqObj.size;
  const ops = reqObj.type == 'empty' ? query.ops : reqObj.ops;
  const opsCount = ops.split(' => ').length;
  logGroup("Request " + reqObj.method + ' ' + short + ' '+size+'B ['+type+'] ('+opsCount+')', (reqObj.cost+query.cost)+"ms - "+ops, reqObj.headers, req, new QueryString(query.body), typeof reqObj.body !== "json" ? reqObj.body : new Body(reqObj.body));
  if (res) {
    const resObj = await logHalf(res);
    const resOpsCount = resObj.ops.split(' => ').length;
    logGroup("Response " + resObj.method + ' ' + short + ' '+resObj.size+'B ['+resObj.type+'] ('+resOpsCount+')', resObj.cost+"ms - "+resObj.ops, resObj.headers, res, typeof resObj.body !== "json" ? resObj.body : new Body(resObj.body));
  } else {
    logGroup("Response " + reqObj.method + ' ' + short + " error: "+err.message, err);
  }
};

// The actual middleman call: Snoop into everything, log all requests and responses.
middleMan.addHook("*", {
  responseHandler: logHook
});

// ==UserScript==
    // @name         8chan to 4chan Post Injector
    // @version      2.4
    // @description  Injects 8chan.moe posts into 4chan threads by matching subject or text
    // @match        https://boards.4chan.org/*/thread/*
    // @grant        GM_xmlhttpRequest
    // @connect      8chan.moe
    // @connect      a.4cdn.org
    // @run-at       document-idle
    // @license      CC0
    // @namespace https://greasyfork.org/users/1463728
// @downloadURL https://update.greasyfork.org/scripts/534425/8chan%20to%204chan%20Post%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/534425/8chan%20to%204chan%20Post%20Injector.meta.js
// ==/UserScript==

    // !! REQUIRES 4CHANX TO WORK !!

    (function() {
      'use strict';

      //console.log('[Injector] Script loaded at', window.location.href);

      const boardMapping = {};

      // highlight style
        const style = document.createElement('style');
        style.textContent = `
      .nativeCell .post {
        background-color: rgba(144, 238, 255, 0.15);
        border: 1px solid rgba(144, 238, 255, 0.3);
      }
      .nativeCell .backlink { margin-right: 4px; }
      .nativeCell .fileThumb {
        float: left;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 3px;
        margin-bottom: 5px;
      }
      .nativeCell .fileThumb img {
        display: block;
        max-width: 250px; /* Optional: limit image width */
        height: auto;
      }
    .fileContainer {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      width: 100%;
      clear: both;
      margin-top: 8px;
    }

    `;
      document.head.appendChild(style);


        let lazyLoadObserver;

        function initLazyLoadObserver() {
            lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (!img.dataset.src) return;

                        const thumbUrl = img.dataset.src;
                        img.classList.remove('lazy-load');

                        // Remove src placeholder if exists
                        img.removeAttribute('src');

                        gmFetchDataUrl(thumbUrl)
                            .then(dataUrl => {
                            img.src = dataUrl;
                            return md5FromDataUrl(dataUrl)
                                .then(md5 => ({ md5 })) // wrap successful md5
                                .catch(() => ({ md5: btoa(thumbUrl) })); // fallback fake md5
                        })
                            .then(({ md5 }) => {
                            img.dataset.md5 = md5;
                            const thumbLink = img.closest('a.fileThumb');
                            if (thumbLink) thumbLink.dataset.md5 = md5;
                        })
                            .catch(console.error)
                            .finally(() => lazyLoadObserver.unobserve(img));

                    }
                });
            }, {
                root: null,
                rootMargin: '500px',
                threshold: 0.01
            });
        }

      function gmFetchJson(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({ method: 'GET', url, responseType: 'json',
            onload: res => res.status >= 200 && res.status < 300 ? resolve(res.response) : reject(res),
            onerror: reject
          });
        });
      }

      function gmFetchDataUrl(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({ method: 'GET', url, responseType: 'arraybuffer',
            onload: res => {
              if (res.status >= 200 && res.status < 300) {
                const blob = new Blob([res.response]);
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              } else reject(res);
            },
            onerror: reject
          });
        });
      }

      function getBoardThread() {
        const parts = window.location.pathname.split('/');
        let board = parts[1];
        if (boardMapping[board]) board = boardMapping[board];
        const threadId = parts[3];
        return { board, threadId };
      }

        // Don't search for references to boards
        const BannedKeywords = ['a', 'b', 'c',  'd',  'e',  'f',  'g',  'gif',  'h',  'hr',  'k',  'm',  'o',  'p',  'r',  's',  't',  'u',  'v',  'vg',  'vm', 'vmg', 'vr', 'vrpg', 'vst', 'w', 'wg', 'i', 'ic',
                                'r9k',  's4s',  'vip',  'cm',  'hm',  'lgbt',  'y',  '3',  'aco', 'adv',  'an',  'bant',  'biz',  'cgl',  'ck',  'co',  'diy',  'fa',  'fit',  'gd',  'hc',  'his',  'int',  'jp',  'lit',  'mlp',  'mu',  'n',
                                'news',  'out',  'po',  'pol',  'pw',  'sci',  'soc', 'sp', 'tg',  'toy',  'trv',  'tv',  'vp',  'vt',  'wsg',  'wsr',  'x',  'xs', ''];

        function extractSlashTag(str) {
            // Avoid matching filepaths by checking surrounding characters
            const m = str.match(/(?<![:/])\/([A-Za-z0-9]+)\/(?![\/.])/);
            if (!m) return null;
            const tag = m[1].toLowerCase();

            // Banning board names so we don't get a random thread if for example it talks about /v/ meta
            return BannedKeywords.includes(tag) || !tag ? null : tag;
        }

        function cleanFallback(str) {
            const title = str.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
            const m = title.match(/^(.*?\b(?:thread|general)\b)/);
            return m ? m[1].trim() : title;
        }

        async function fetch4chanSearchKey(board, threadId) {
            try {
                const json = await gmFetchJson(`https://a.4cdn.org/${board}/thread/${threadId}.json`);
                const op   = json.posts?.[0];
                if (!op) {
                    //console.error('[Injector] No OP post found in thread');
                    return null;
                }

                // raw subject & first line of message
                const subjectRaw  = op.sub?.trim()      || '';
                const msgHtml     = op.com              || '';
                const msgText     = msgHtml
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>|>>\d+/g, '')        // strip tags & >>replies
                .trim();
                const firstLine   = (msgText.split('\n')[0] || '').trim();

                // 1) If either raw string has a /tag/, return it *with* slashes
                const slashInSub  = extractSlashTag(subjectRaw);
                const slashInMsg  = extractSlashTag(firstLine);
                if (slashInSub || slashInMsg) {
                    const tag = slashInSub || slashInMsg;
                    return `/${tag}/`;
                }

                // 2) Otherwise your original fallback: subject or first line
                let searchKey = subjectRaw;
                if (!searchKey && firstLine) {
                    searchKey = firstLine.substring(0, 50).trim();
                }
                if (!searchKey) {
                    console.error('[Injector] No subject or valid message for thread', threadId);
                    return null;
                }
                const cleaned = cleanTitle(searchKey);
                return cleaned || null;

            } catch (error) {
                console.error('[Injector] Error fetching 4chan OP:', error);

                // === DOM fallback ===
                const opDom = document.querySelector('.post.op');
                if (!opDom) {
                    console.error('[Injector] No OP element found in DOM fallback');
                    return null;
                }
                const subjectEl  = opDom.querySelector('.subject');
                const fallbackRaw = (subjectEl?.textContent.trim())
                || opDom.textContent.split('\n')[0].trim();

                // Try slash-tag here too
                const slash = extractSlashTag(fallbackRaw);
                if (slash) {
                    return `/${slash}/`;
                }
                const cleaned = cleanTitle(fallbackRaw);
                return cleaned || null;
            }
        }

        function findNativeThread(catalog, searchKeyRaw) {
            if (!searchKeyRaw) {
                //console.error('[Injector] Empty search key');
                return null;
            }
            // first see if our 4chan OP had a /tag/
            const slash = extractSlashTag(searchKeyRaw);
            if (slash) {
                for (const t of catalog) {
                    if (
                        extractSlashTag(t.subject  || '') === slash ||
                        extractSlashTag(t.message  || '') === slash
                    ) return t.threadId;
                }
            }

            // otherwise fall back to full-string matching
            const key = cleanFallback(searchKeyRaw);
            if (!key) {
                //console.error('[Injector] Empty cleaned search key');
                return null;
            }
            for (const t of catalog) {
                if (
                    cleanFallback(t.subject || '') === key ||
                    cleanFallback(t.message || '') === key
                ) return t.threadId;
            }

            console.error('[Injector] No matching thread for', searchKeyRaw);
            return null;
        }


        function cleanTitle(title) {
            title = title.toLowerCase().replace(/[^\w\s]/g, ''); // Lowercase and remove special characters

            const match = title.match(/^(.*?\b(?:thread|general)\b)/i);
            if (match) {
                return match[1].trim();
            }

            return title.trim();
        }


        async function md5(arrayBuffer) {
            const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }



      function formatDateUTC(ts) {
        const d = new Date(ts);
        const pad = n => String(n).padStart(2, '0');
        const mm = pad(d.getUTCMonth()+1), dd = pad(d.getUTCDate()), yy = String(d.getUTCFullYear()).slice(2);
        const wk = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()];
        const hh = pad(d.getUTCHours()), mi = pad(d.getUTCMinutes()), ss = pad(d.getUTCSeconds());
        return `${mm}/${dd}/${yy}(${wk})${hh}:${mi}:${ss}`;
      }

        async function buildNativechanPost(post, board) {
            const pid = post.postId;
            const utc = Math.floor(new Date(post.creation).getTime()/1000);
            const ts = formatDateUTC(post.creation);

            const cont = document.createElement('div');
            cont.className = 'postContainer replyContainer nativeCell';
            cont.id = `pc${pid}`;
            cont.setAttribute('data-native-inject','true');
            cont.setAttribute('data-full-i-d',`${board}.${pid}`);

            const side = document.createElement('div');
            side.className='sideArrows'; side.id=`sa${pid}`;
            side.innerHTML='<a class="hide-reply-button" href="javascript:;"><span class="fa fa-minus-square-o"></span></a>';
            cont.appendChild(side);

            const p = document.createElement('div');
            p.className='post reply'; p.id=`p${pid}`;

            // mobile header
            const m = document.createElement('div');
            m.className='postInfoM mobile'; m.id=`pim${pid}`;
            m.innerHTML=`<span class="nameBlock"><span class="name">${post.name||'Anonymous'}</span><br></span><span class="dateTime postNum" data-utc="${utc}">${ts} <a href="#p${pid}" title="Link to this post">No.</a><a href="javascript:quote('${pid}');" title="Reply to this post">${pid}</a></span>`;
            p.appendChild(m);

            // desktop header
            const dDiv = document.createElement('div');
            dDiv.className='postInfo desktop'; dDiv.id=`pi${pid}`;
            dDiv.innerHTML=`<input type="checkbox" name="${pid}" value="delete"> <span class="nameBlock"><span class="name">${post.name||'Anonymous'}</span> </span> <span class="dateTime" data-utc="${utc}">${ts}</span> <span class="postNum desktop"><a href="#p${pid}" title="Link to this post">No.</a><a href="javascript:quote('${pid}');" title="Reply to this post">${pid}</a></span><span class="container"></span>`;
            p.appendChild(dDiv);

            // file
            // ─── replace your file-rendering block with this ───
            if (post.files?.length) {
                const fileContainer = document.createElement('div');
                fileContainer.className = 'fileContainer';
                fileContainer.id = `f${pid}`;
                fileContainer.style.display = 'flex';
                fileContainer.style.flexWrap = 'wrap';
                fileContainer.style.width = '100%';
                fileContainer.style.clear = 'both';
                fileContainer.style.marginTop = '8px';
                fileContainer.style.paddingLeft = '20px';
                p.appendChild(fileContainer);

                for (let i = 0; i < post.files.length; i++) {
                    const f = post.files[i];

                    // Outer .file div
                    const fileCol = document.createElement('div');
                    fileCol.className = 'file';
                    fileCol.id = `f${pid}-${i}`;
                    fileCol.style.margin = '3px 5px 5px 5px';
                    fileCol.style.float = 'left';

                    // ——— FileText
                    const fileText = document.createElement('div');
                    fileText.className = 'fileText';
                    fileText.id = `fT${pid}-${i}`;

                    const fileInfo = document.createElement('span');
                    fileInfo.className = 'file-info';

                    const nameLinkWrapper = document.createElement('a');
                    nameLinkWrapper.href = `https://8chan.moe${f.path}`;
                    nameLinkWrapper.target = '_blank';

                    // ——— Full + truncated filename handling
                    const fileNameSwitch = document.createElement('span');
                    fileNameSwitch.className = 'fnswitch';

                    const fileNameTrunc = document.createElement('span');
                    fileNameTrunc.className = 'fntrunc';
                    fileNameTrunc.textContent = truncateName(f.originalName, 30);

                    const fileNameFull = document.createElement('span');
                    fileNameFull.className = 'fnfull';
                    fileNameFull.textContent = f.originalName;
                    fileNameFull.style.display = 'none'; // Hide full name by default

                    fileNameSwitch.appendChild(fileNameTrunc);
                    fileNameSwitch.appendChild(fileNameFull);

                    nameLinkWrapper.appendChild(fileNameSwitch);

                    // ——— Download link
                    const dlLink = document.createElement('a');
                    dlLink.href = `https://8chan.moe${f.path}`;
                    dlLink.download = f.originalName;
                    dlLink.className = 'fa fa-download download-button';
                    dlLink.style.marginLeft = '4px';

                    // ——— Size + dimensions info
                    const infoText = document.createTextNode(
                        ` (${Math.round(f.size / 1024)} KB${f.width ? `, ${f.width}×${f.height}` : ''})`
                    );

                    // Assemble fileInfo
                    fileInfo.appendChild(nameLinkWrapper);
                    fileInfo.appendChild(dlLink);
                    fileInfo.appendChild(infoText);

                    fileText.appendChild(fileInfo);


                    // ——— Thumbnail
                    const thumbLink = document.createElement('a');
                    thumbLink.className = 'fileThumb';
                    thumbLink.href = `https://8chan.moe${f.path}`;
                    thumbLink.target = '_blank';
                    thumbLink.style.display = 'block';
                    thumbLink.style.margin = '3px 0px 5px 0px';  // (instead of any default 20px left/right)
                    thumbLink.style.padding = '0';

                    const img = document.createElement('img');
                    img.className = 'thumb lazy-load';
                    img.loading = 'lazy';
                    img.dataset.src = `https://8chan.moe${f.thumb}`;
                    img.alt = f.originalName;
                    img.style.maxHeight = '125px';
                    img.style.maxWidth = '125px';
                    img.style.height = 'auto';
                    img.style.width = 'auto';
                    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                    img.dataset.width = f.width;
                    img.dataset.height = f.height;
                    img.dataset.size = f.size;

                    // ——— Mobile File Info (shows size+type on hover for mobile)
                    const mFileInfo = document.createElement('div');
                    mFileInfo.className = 'mFileInfo mobile';
                    mFileInfo.textContent = `${Math.round(f.size / 1024)} KB ${f.originalName.split('.').pop().toUpperCase()}`; // "11 KB PNG"

                    thumbLink.appendChild(img);
                    thumbLink.appendChild(mFileInfo);

                    // ——— Final Assembly
                    fileCol.appendChild(fileText);  // text on top
                    fileCol.appendChild(thumbLink); // thumbnail below
                    fileContainer.appendChild(fileCol);

                    lazyLoadObserver.observe(img);
                }
            }

            const msg = document.createElement('blockquote');
            msg.className = 'postMessage';
            msg.id = `m${pid}`;
            // First process the content to convert greenText to quotes
            const processedContent = processNativePost(post.markdown || post.message || '');
            msg.innerHTML = processedContent;
            p.appendChild(msg);


            Array.from(msg.querySelectorAll('a.quotelink, a.quoteLink')).forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.includes('#')) {
                    const quotedPid = href.split('#').pop();

                    // Set 4chanX attributes
                    a.className = 'quotelink';
                    a.setAttribute('href', `#p${quotedPid}`);
                    a.setAttribute('data-post', quotedPid);
                    a.setAttribute('data-board', board);
                    a.setAttribute('title', 'Reply to this post');

                    if (a.textContent.startsWith('>>')) {
                        a.textContent = `>>${quotedPid}`;
                    }

                    // Only add breaks if needed
                    const parent = a.parentNode;
                    const prev = a.previousSibling;
                    const next = a.nextSibling;

                    // Add break before if:
                    // - Not first child AND
                    // - Previous node isn't a break AND
                    // - Previous node isn't empty text
                    if (a !== parent.firstChild &&
                        !(prev?.nodeName === 'BR') &&
                        !(prev?.nodeType === 3 && /^\s*$/.test(prev.textContent))) {
                        parent.insertBefore(document.createElement('br'), a);
                    }

                    // Add break after if:
                    // - Not last child AND
                    // - Next node isn't a break AND
                    // - Next node isn't empty text
                    if (a !== parent.lastChild &&
                        !(next?.nodeName === 'BR') &&
                        !(next?.nodeType === 3 && /^\s*$/.test(next.textContent))) {
                        parent.insertBefore(document.createElement('br'), a.nextSibling);
                    }
                }
            });

            // Clean up any double line breaks
            msg.innerHTML = msg.innerHTML
                .replace(/(<br>\s*){2,}/g, '<br>')  // Multiple <br>s
                .replace(/^(<br>)|(<br>)$/g, '');   // Leading/trailing <br>



            // Don't add backlinks to this post's header - they belong to the quoted posts
            dDiv.querySelector('.container').innerHTML = '';

            cont.appendChild(p);
            cont.sideArrows = side;

            return cont;
        }

        function processNativePost(content) {
            if (!content) return '';

            // Handle all possible greenText variants
            return content
            // Normal case
                .replace(/<span class="greenText">/g, '<span class="quote">')
            // Escaped quotes case
                .replace(/<span class=\\"greenText\\">/g, '<span class=\\"quote\\">')
            // Newline variant
                .replace(/\n<span class="greenText">&gt;/g, '\n<span class="quote">&gt;')
            // Newline + escaped variant
                .replace(/\n<span class=\\"greenText\\">&gt;/g, '\n<span class=\\"quote\\">&gt;')
            // Handle greentext at start of line
                .replace(/^<span class="greenText">&gt;/gm, '<span class="quote">&gt;');
        }

        async function md5FromDataUrl(dataUrl) {
            const base64 = dataUrl.split(',')[1];
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const hashBuffer = await crypto.subtle.digest('MD5', bytes);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }


        // helper for filename truncation
        function truncateName(name, maxChars = 25) {
            if (name.length <= maxChars) return name;
            const dot = name.lastIndexOf('.');
            const ext = dot >= 0 ? name.slice(dot) : '';
            // reserve 5 chars for "(...)" plus extension length
            const keep = maxChars - ext.length - 5;
            return name.slice(0, keep) + '(...)' + ext;
        }

        async function bootstrap() {
        //console.log('[Injector] bootstrap start');

        const { board, threadId } = getBoardThread();
            const searchKey = await fetch4chanSearchKey(board, threadId);
            if (!searchKey) {
                //console.error('[Injector] No search key generated');
                return;
            }


        const catalog = await gmFetchJson(`https://8chan.moe/${board}/catalog.json`);
        const nativeTid = findNativeThread(catalog, searchKey);
        if (!nativeTid) return;

        const data = await gmFetchJson(`https://8chan.moe/${board}/res/${nativeTid}.json`);
        const threadEl = document.querySelector(`#t${threadId}`);
        if (!threadEl) {
            //console.error('[Injector] No threadEl');
            return;
        }

        for (const post of data.posts) {
            const node = await buildNativechanPost(post, board);
            node.dataset.board = board;
            node.dataset.threadId = threadId;
            node.dataset.postId = post.postId;

            // === Insert into the DOM ===
            if (window.Posts?.insertPost) {
                window.Posts.insertPost(node, threadEl);
            } else {
                const posts = Array.from(threadEl.querySelectorAll('.postContainer'));
                const utc = Number(node.querySelector('.dateTime')?.dataset.utc || 0);

                let inserted = false;
                for (const postEl of posts) {
                    const postUtc = Number(postEl.querySelector('.dateTime')?.dataset.utc || 0);
                    if (utc < postUtc) {
                        threadEl.insertBefore(node, postEl);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    threadEl.appendChild(node);
                }
            }

            // === Now notify 4chanX ===
            if (window.dispatchEvent) {
                const event = new CustomEvent('PostsInserted', { detail: node });
                window.dispatchEvent(event);
            }

            // === Setup 4chanX Post objects ===
            if (window.Posts?.posts && window.Post) {
                const postObj = new window.Post(node);
                postObj.isClone = true;
                postObj.nodes = { root: node };
                postObj.boardID = board;
                postObj.threadID = threadId;
                postObj.postID = post.postId.toString();
                postObj.info = {
                    boardID: board,
                    threadID: threadId,
                    postID: post.postId.toString()
                };

                window.Posts.posts.set(`${board}.${post.postId}`, postObj);

                if (window.Posts.add) {
                    window.Posts.add(node);
                }
            }

            if (window.QuotePreview?.node) {
                window.QuotePreview.node(node);
            }
        }
    }


        function waitFor4chanXReady() {
            return new Promise(resolve => {
                const checkReady = () => window.Main && typeof window.Main.ready === 'function' && window.Main.ready();
                if (checkReady()) {
                    resolve();
                } else {
                    const interval = setInterval(() => {
                        if (checkReady()) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 50);
                }
            });
        }



        function notify4chanXPostsInserted(posts, thread = null) {
            const event = new CustomEvent('PostsInserted', {
                detail: {
                    posts: Array.isArray(posts) ? posts : [posts],
                    thread: thread || (posts[0] && posts[0].closest('.thread'))
                }
            });
            document.dispatchEvent(event);
        }




        (async function() {
            'use strict';

            //console.log('[Injector] Script loaded at', window.location.href);

            initLazyLoadObserver();

            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            // Listen for the 4chanX event
            let bootstrapped = false;
            document.addEventListener('4chanXInitFinished', async () => {
                //console.log('[Injector] 4chanXInitFinished event detected');
                if (!bootstrapped) {
                    bootstrapped = true;
                    await bootstrap();
                    enableNativechanHoverZoom();
                }
            });

            // Also fallback: poll for window.Main.ready()
            const timeout = 10000; // 10 seconds max
            const start = Date.now();

            while (!bootstrapped && (Date.now() - start) < timeout) {
                if (window.Main && typeof window.Main.ready === 'function' && window.Main.ready()) {
                    //console.log('[Injector] window.Main.ready() true by polling');
                    bootstrapped = true;
                    bootstrap();
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (!bootstrapped) {
                //console.warn('[Injector] 4chanX not ready after timeout.');
            }

        })();



    // Move zoom and spinner with mouse
    function moveZoom(e) {
        const zoom = document.getElementById('nativechanHoverZoom');
        const spinner = document.getElementById('nativechanHoverSpinner');
        if (!zoom || !spinner) return;

        const padding = 20;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const zoomWidth = zoom.offsetWidth;
        const zoomHeight = zoom.offsetHeight;

        let left = e.clientX + padding;
        if (left + zoomWidth > screenWidth - padding) {
            left = Math.max(e.clientX - zoomWidth - padding, padding);
        }
        zoom.style.left = `${left}px`;

        let top = e.clientY - zoomHeight / 2;
        if (top < padding) top = padding;
        if (top + zoomHeight > screenHeight - padding) {
            top = screenHeight - zoomHeight - padding;
        }
        zoom.style.top = `${top}px`;

        spinner.style.left = `${e.clientX + 10}px`;
        spinner.style.top = `${e.clientY + 10}px`;
    }

    // Hover Zoom
    async function enableNativechanHoverZoom() {
        const posts = document.querySelectorAll('.postContainer[data-native-inject="true"]');
        const dataUrlCache = new Map();

        for (const post of posts) {
            const thumbLinks = post.querySelectorAll('a.fileThumb');
            if (!thumbLinks.length) continue;

            // Loop through each thumbnail
            for (const thumbLink of thumbLinks) {

                thumbLink.addEventListener('mouseover', function handleMouseOver(e) {
                    if (document.getElementById('nativechanHoverZoom')) return;

                    const fullImageUrl = thumbLink.href;
                    const thumbImg = thumbLink.querySelector('img');
                    if (!thumbImg) return;

                    // Skip if thumbnail is already large
                    if (thumbImg.naturalWidth > 300 || thumbImg.naturalHeight > 300) return;

                    let stillHovered = true;
                    let disableHoverZoom = false;
                    if (disableHoverZoom) return;

                    // Create zoomed image
                    const zoom = document.createElement('img');
                    zoom.id = 'nativechanHoverZoom';
                    Object.assign(zoom.style, {
                        position: 'fixed',
                        maxWidth: '98%',
                        maxHeight: '98%',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        opacity: '0.8',
                        transition: 'opacity 0.2s ease'
                    });
                    zoom.src = thumbImg.src;
                    document.body.appendChild(zoom);

                    // Create spinner
                    const spinner = document.createElement('div');
                    spinner.id = 'nativechanHoverSpinner';
                    Object.assign(spinner.style, {
                        position: 'fixed',
                        width: '24px',
                        height: '24px',
                        border: '3px solid #ccc',
                        borderTop: '3px solid #333',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        zIndex: 10000,
                        pointerEvents: 'none'
                    });
                    document.body.appendChild(spinner);

                    // Add spinner animation CSS once
                    if (!document.getElementById('hoverZoomSpinnerStyle')) {
                        const style = document.createElement('style');
                        style.id = 'hoverZoomSpinnerStyle';
                        style.textContent = `
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    // Move zoom & spinner with mouse
                    function moveZoom(e) {
                        const pad = 20;
                        const sw = window.innerWidth;
                        const sh = window.innerHeight;
                        const zw = zoom.offsetWidth;
                        const zh = zoom.offsetHeight;

                        let left = e.clientX + pad;
                        if (left + zw > sw - pad) {
                            left = Math.max(e.clientX - zw - pad, pad);
                        }
                        zoom.style.left = `${left}px`;

                        let top = e.clientY - zh / 2;
                        if (top < pad) top = pad;
                        if (top + zh > sh - pad) {
                            top = sh - zh - pad;
                        }
                        zoom.style.top = `${top}px`;

                        spinner.style.left = `${e.clientX + 10}px`;
                        spinner.style.top  = `${e.clientY + 10}px`;
                    }

                    document.addEventListener('mousemove', moveZoom);
                    moveZoom(e);

                    function cleanup() {
                        stillHovered = false;
                        disableHoverZoom = true;
                        zoom.remove();
                        spinner.remove();
                        document.removeEventListener('mousemove', moveZoom);
                        setTimeout(() => { disableHoverZoom = false; }, 300);
                    }

                    thumbLink.addEventListener('mousedown', cleanup, { once: true });
                    thumbLink.addEventListener('mouseout', cleanup, { once: true });

                    // Load full-size image
                    (async () => {
                        try {
                            let dataUrl = dataUrlCache.get(fullImageUrl);
                            if (!dataUrl) {
                                dataUrl = await gmFetchDataUrl(fullImageUrl);
                                dataUrlCache.set(fullImageUrl, dataUrl);
                            }
                            if (stillHovered) {
                                zoom.src = dataUrl;
                                zoom.style.opacity = '1';
                            }
                        } catch (err) {
                            console.error('[NativeHoverZoom] Failed to load full image', err);
                        } finally {
                            spinner.remove();
                        }
                    })();
                });

            } // end for thumbLinks
        }
    }










     // Click to Expand
    document.addEventListener('click', async function (e) {
      const link = e.target.closest('a.fileThumb');
      if (!link || !link.closest('.nativeCell')) return;

        // remove hover zoom if its there
        const zoom = document.getElementById('nativechanHoverZoom');
        const spinner = document.getElementById('nativechanHoverSpinner');
        if (zoom) zoom.remove();
        if (spinner) spinner.remove();
        document.removeEventListener('mousemove', moveZoom);

        e.preventDefault();

      const img = link.querySelector('img');
      if (!img) return;

      const postContainer = link.closest('.postContainer');
      const post = link.closest('.post');
      const fileDiv = link.closest('.file');

      const isExpanded = img.dataset.expanded === 'true';

      if (!isExpanded) {
        img.dataset.thumbSrc = img.src;

        // Add loading indicator
        const loading = document.createElement('div');
        loading.textContent = 'Loading...';
        Object.assign(loading.style, {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '6px 12px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: '10'
        });
        link.style.position = 'relative';
        link.appendChild(loading);

        try {
          const dataUrl = await gmFetchDataUrl(link.href);
          img.src = dataUrl;

          // Expand the image properly
          Object.assign(img.style, {
            maxWidth: '100%',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto',
            display: 'block',
            margin: '10px 0'
          });

          // Allow parent divs to expand naturally
          Object.assign(link.style, {
            display: 'block',
            width: 'auto',
            maxWidth: '100%',
            margin: '10px 0',
            float: 'none'
          });

          if (fileDiv) {
            Object.assign(fileDiv.style, {
              display: 'block',
              width: 'auto',
              maxWidth: '100%',
              height: 'auto',
              float: 'none'
            });
          }

          if (post) {
            Object.assign(post.style, {
              display: 'block',
              width: 'auto',
              maxWidth: '100%',
              height: 'auto'
            });
          }

          if (postContainer) {
            Object.assign(postContainer.style, {
              display: 'block',
              width: 'auto',
              maxWidth: '100%',
              height: 'auto'
            });
          }

          img.dataset.expanded = 'true';
        } catch (err) {
          console.error('Failed to load full image', err);
        } finally {
          loading.remove();
          link.style.position = ''; // Important! Clear relative positioning after loading
        }
      } else {
        // Collapse back to thumbnail
        img.src = img.dataset.thumbSrc;
        Object.assign(img.style, {
          maxHeight: '125px',
          height: 'auto',
          width: 'auto',
          display: 'block',
          margin: ''
        });

        link.style.display = '';
        link.style.width = '';
        link.style.maxWidth = '';
        link.style.float = '';
        link.style.margin = '';

        if (fileDiv) {
          fileDiv.style.display = '';
          fileDiv.style.width = '';
          fileDiv.style.maxWidth = '';
          fileDiv.style.height = '';
          fileDiv.style.float = '';
        }

        if (post) {
          post.style.display = '';
          post.style.width = '';
          post.style.maxWidth = '';
          post.style.height = '';
        }

        if (postContainer) {
          postContainer.style.display = '';
          postContainer.style.width = '';
          postContainer.style.maxWidth = '';
          postContainer.style.height = '';
        }

        delete img.dataset.expanded;
      }
    });
    })();
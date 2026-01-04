// ==UserScript==
// @name         ncikkis sketchfab downloader
// @namespace    http://tampermonkey.net/
// @version      2.1 // Implemented user-provided regex for Geometry Capture
// @description  Attempts model download via runtime code modification using user-provided geometry patch regex. Requires JSZip/FileSaver.
// @author       ncikkis
// @match        https://sketchfab.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/956968 // Original namespace kept for reference to technique origin
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534846/ncikkis%20sketchfab%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534846/ncikkis%20sketchfab%20downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const LOG_PREFIX = '[ncikkis_SFD_v2.1]:';

    // --- Global Storage & Capture Functions (Same as v1.9) ---
    let capturedGeometries = new Map();
    let capturedTextures = new Map();
    let capturedGeometryKeys = new Set();
    let geomCounter = 0;
    let textureCounter = 0;
    let downloadButtonAdded = false;

    console.log(`${LOG_PREFIX} Initializing. Waiting for Sketchfab JS...`);

    unsafeWindow.captureGeometry = function(geomObj) {
        // De-duplication and parsing logic remains the same as v1.9
         // Added check: if 'this' is passed, try accessing potential geometry properties from it
         if (geomObj === unsafeWindow || !geomObj) {
             console.warn(`${LOG_PREFIX} captureGeometry called with invalid object:`, geomObj);
             return; // Don't process window or null/undefined
         }

         // Attempt to access geometry data assuming geomObj might be 'this' from the hooked function
         const attributes = geomObj._attributes || geomObj.attributes; // Try common property names
         const primitives = geomObj._primitives || geomObj.primitives;

         if (!primitives || !attributes?.Vertex?._elements) {
             //console.warn(`${LOG_PREFIX} Skipping capture: Missing primitives or vertex data in object:`, geomObj);
             return;
         }
         // Check object reference duplication first
         if (geomObj.__captured__) return;

         // Content-based de-duplication check
         try {
             const vertexCount = attributes.Vertex._elements.length;
             let totalIndexCount = 0;
             primitives?.forEach(p => { totalIndexCount += p?.indices?._elements?.length || 0; });
             if (vertexCount === 0 || totalIndexCount === 0) return;
             const geometryKey = `${vertexCount}_${totalIndexCount}`;
             if (capturedGeometryKeys.has(geometryKey)) return;
             capturedGeometryKeys.add(geometryKey); geomObj.__captured__ = true;
         } catch (e) { console.error(`${LOG_PREFIX} De-dup check error:`, e); geomObj.__captured__ = true; return; }

         geomCounter++; const geomId = `geom_${geomCounter}`; const modelName = `model_${geomCounter}`;
         console.log(`${LOG_PREFIX} Capturing NEW Geometry: ${modelName} (Key: ${capturedGeometryKeys.size})`);

         try {
             // Pass the potentially correct object containing _attributes and _primitives to parsing
             const parsed = parseGeometry(geomObj); // Assume parseGeometry handles variations if needed
             if (!parsed) { throw new Error("Parsing failed"); }
             const objStr = generateOBJ(parsed, modelName); capturedGeometries.set(geomId, { name: modelName, objData: objStr });
         } catch(e) { console.error(`${LOG_PREFIX} Error processing geometry ${modelName}:`, e); }
    };

    unsafeWindow.captureTextureURL = function(imageInfo, imageModel) {
        // Same URL capture logic as v1.9/2.0
         if (!imageModel?.attributes?.images) { return imageInfo; }
         try {
            const originalUrl = imageInfo.url; const filename_image = imageModel.attributes.name || `texture_${textureCounter++}`;
            let bestUrl = originalUrl; let max_size = imageInfo.size || 0;
            imageModel.attributes.images.forEach(img => { if (img?.url && img.size > max_size) { max_size = img.size; bestUrl = img.url; } });
            if (!capturedTextures.has(bestUrl)) { console.log(`${LOG_PREFIX} Capturing Texture URL: ${filename_image} -> ${bestUrl}`); capturedTextures.set(bestUrl, { name: filename_image, url: bestUrl }); }
             const bestImageInfo = imageModel.attributes.images.find(img => img.url === bestUrl) || imageInfo; return bestImageInfo;
         } catch (e) { console.error(`${LOG_PREFIX} Error in captureTextureURL:`, e); return imageInfo; }
    };

     // --- Geometry Parsing and OBJ Generation (Same as v1.9/2.0) ---
     function parseGeometry(geomObj) {
         const primitives = []; const sourcePrimitives = geomObj._primitives || geomObj.primitives;
         if (sourcePrimitives && Array.isArray(sourcePrimitives)) { sourcePrimitives.forEach(p => { if (p?.indices?._elements) { primitives.push({ mode: p.mode, indices: p.indices._elements }); } }); }
         const attributes = geomObj._attributes || geomObj.attributes; if (!attributes?.Vertex?._elements) return null;
         let uvElements = []; for(let i=0; i<=8; i++) { if(attributes[`TexCoord${i}`]?._elements) { uvElements = attributes[`TexCoord${i}`]._elements; break; } }
         return { vertex: attributes.Vertex._elements, normal: attributes.Normal?._elements || [], uv: uvElements, primitives: primitives };
     }
     function generateOBJ(parsedData, modelName) { /* ... Same OBJ generation code ... */
        let objStr = `# Generated by ncikkis Sketchfab Downloader v2.1\n`; objStr += `o ${modelName}\n`;
         for (let i = 0; i < parsedData.vertex.length; i += 3) { objStr += `v ${parsedData.vertex[i]} ${parsedData.vertex[i+1]} ${parsedData.vertex[i+2]}\n`; }
         const hasNormals = parsedData.normal.length > 0; if (hasNormals) { for (let i = 0; i < parsedData.normal.length; i += 3) { objStr += `vn ${parsedData.normal[i]} ${parsedData.normal[i+1]} ${parsedData.normal[i+2]}\n`; } }
         const hasUVs = parsedData.uv.length > 0; if (hasUVs) { for (let i = 0; i < parsedData.uv.length; i += 2) { objStr += `vt ${parsedData.uv[i]} ${1.0 - parsedData.uv[i+1]}\n`; } }
         objStr += `s 1\n`;
         for (const primitive of parsedData.primitives) { const indices = primitive.indices; if (primitive.mode === 4) { for (let i = 0; i < indices.length; i += 3) { objStr += `f`; for (let j = 0; j < 3; j++) { const idx = indices[i + j] + 1; objStr += ` ${idx}`; if (hasUVs || hasNormals) { objStr += `/`; if (hasUVs) objStr += idx; if (hasNormals) objStr += `/${idx}`; } } objStr += `\n`; } } else if (primitive.mode === 5) { for (let i = 0; i + 2 < indices.length; i++) { objStr += `f`; const order = (i % 2 === 0) ? [0, 1, 2] : [0, 2, 1]; for (let j = 0; j < 3; j++) { const idx = indices[i + order[j]] + 1; objStr += ` ${idx}`; if (hasUVs || hasNormals) { objStr += `/`; if (hasUVs) objStr += idx; if (hasNormals) objStr += `/${idx}`; } } objStr += `\n`; } } else { /* console.warn(`${LOG_PREFIX} Unsupported primitive mode: ${primitive.mode}`); */ } } return objStr;
     }

    // --- Download Button and Packaging Logic (Same as v1.9/2.0) ---
    function addDownloadButton() { /* ... Same button add logic ... */
        if (downloadButtonAdded) return; const titleBar = document.querySelector('.titlebar') || document.querySelector('.viewer-header');
        if (titleBar) { console.log(`${LOG_PREFIX} Adding download button...`); const btn = document.createElement("a"); btn.innerHTML = "DOWNLOAD ZIP"; /* Styles... */ btn.style.backgroundColor = "#1caad9"; btn.style.color = "white"; btn.style.padding = "8px"; btn.style.borderRadius = "4px"; btn.style.cursor = "pointer"; btn.style.marginLeft = "10px"; btn.style.textDecoration = "none"; btn.style.fontSize = "12px"; btn.style.fontWeight = "bold"; btn.onmouseover = () => btn.style.backgroundColor = "#1c88bb"; btn.onmouseout = () => btn.style.backgroundColor = "#1caad9"; btn.addEventListener("click", initiateDownloadPackage, false); titleBar.appendChild(btn); downloadButtonAdded = true; console.log(`${LOG_PREFIX} Download button added.`);
        } else { console.log(`${LOG_PREFIX} Title bar not found, retrying button add later...`); setTimeout(addDownloadButton, 2000); }
    }
     async function initiateDownloadPackage() { /* ... Same zip and download logic ... */
         if (capturedGeometries.size === 0 && capturedTextures.size === 0) { alert("ncikkis Downloader: No geometry or textures captured."); return; }
         const zip = new JSZip(); const modelFolder = zip.folder('model'); console.log(`${LOG_PREFIX} Preparing download package...`);
         if (capturedGeometries.size > 0) { console.log(`${LOG_PREFIX} Adding ${capturedGeometries.size} geometry file(s)...`); capturedGeometries.forEach((geomInfo) => { modelFolder.file(`${geomInfo.name}.obj`, geomInfo.objData); }); } else { console.warn(`${LOG_PREFIX} No geometry captured.`); }
         if (capturedTextures.size > 0) {
             console.log(`${LOG_PREFIX} Fetching ${capturedTextures.size} texture file(s)...`); const texturePromises = [];
             capturedTextures.forEach((texInfo) => { const promise = new Promise((resolve, reject) => { GM_download({ url: texInfo.url, name: `temp_${texInfo.name}`, responseType: 'blob', onload: (r) => { if (r.response) { let safeName = texInfo.name.replace(/[^a-zA-Z0-9_.-]/g, '_'); if (!/\.(png|jpg|jpeg|webp)$/i.test(safeName)) safeName += '.png'; modelFolder.file(`textures/${safeName}`, r.response); resolve(); } else { reject(new Error(`No blob ${texInfo.name}`)); } }, onerror: reject, ontimeout: reject }); }); texturePromises.push(promise); });
             try { await Promise.all(texturePromises); console.log(`${LOG_PREFIX} Texture downloads complete.`); } catch (error) { console.error(`${LOG_PREFIX} Texture fetching error:`, error); alert(`ncikkis Downloader: Error downloading textures.`); }
         } else { console.warn(`${LOG_PREFIX} No textures captured.`); }
         try { console.log(`${LOG_PREFIX} Generating zip...`); const zipBlob = await zip.generateAsync({ type: "blob" }); let filename = "sketchfab_download.zip"; try { filename = document.querySelector('.model-name__label')?.textContent?.trim()?.replace(/[^a-zA-Z0-9_-]/g, '_') + ".zip" || filename; } catch (_) {} saveAs(zipBlob, filename); console.log(`${LOG_PREFIX} Zip saving initiated: ${filename}`);
         } catch (e) { console.error(`${LOG_PREFIX} Zip generation error:`, e); alert(`ncikkis Downloader: Error generating zip.`); }
     }

    // --- Script Interception and Patching ---
    const patchPoints = [
         { // Capture Geometry Object - USER PROVIDED REGEX
             regex: /(drawGeometry:\s*function\(\)\{.*?e\s*=\s*t.getLastProgramApplied\(\);)/g, // User pattern (non-greedy .*?)
             // Inject AFTER the matched block, assuming 'this' is the geometry object context
             injection: (match, p1) => `${p1} window.captureGeometry(this);`,
             name: "Geometry Capture"
         },
         { // Capture Texture URL/Info (Unchanged)
             regex: /getResourceImage:function\((\w+),(\w+)\)\{/g,
             injection: (match, p1, p2) => `${match} ${p1} = window.captureTextureURL(${p1}, this._imageModel);`,
             name: "Texture URL Capture"
         }
    ];

    function patchScript(scriptText, scriptUrl) {
        // Same patching logic as v2.0
         let modifiedText = scriptText; let patchesApplied = 0; console.log(`${LOG_PREFIX} Patching script: ${scriptUrl}`);
         patchPoints.forEach(patch => {
             let matchFound = false; let iteration = 0; const maxIterations = 1000;
             try { const regex = new RegExp(patch.regex.source, patch.regex.flags.includes('g') ? patch.regex.flags : patch.regex.flags + 'g');
                  modifiedText = modifiedText.replace(regex, (...args) => {
                     matchFound = true; patchesApplied++; iteration++; if(iteration > maxIterations) {console.error("Max iterations for patch:", patch.name); return args[0];}
                     const originalMatch = args[0]; if (typeof patch.injection === 'function') { return patch.injection(...args); } else { return originalMatch + patch.injection; } });
             } catch (e) { console.error(`${LOG_PREFIX} Regex error patch '${patch.name}':`, e); }
             if (matchFound) { console.log(`${LOG_PREFIX} Patch '${patch.name}' applied.`); } else { console.warn(`${LOG_PREFIX} Patch '${patch.name}' FAILED - pattern not found.`); } });
         if (patchesApplied > 0) { console.log(`${LOG_PREFIX} Total patches applied: ${patchesApplied}.`); return modifiedText; }
         else { console.warn(`${LOG_PREFIX} No patches applied to script: ${scriptUrl}.`); return scriptText; }
    }

    // --- Script Interception Loader (Same as v1.9/2.0) ---
    (() => { /* ... Same MutationObserver/interception logic ... */
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => { mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && (node.src.includes('web/dist/') || node.src.includes('standaloneViewer') || node.src.includes('/viewer/'))) {
                    node.async = false; node.defer = false; node.removeAttribute('integrity'); node.type = 'text/plain'; console.log(`${LOG_PREFIX} Intercepted Sketchfab script: ${node.src}`);
                    GM_xmlhttpRequest({ method: "GET", url: node.src,
                        onload: function(response) {
                            if (response.status === 200) { console.log(`${LOG_PREFIX} Fetched script for patching.`); const patchedText = patchScript(response.responseText, node.src); const newScript = document.createElement('script'); newScript.type = "text/javascript"; newScript.textContent = patchedText; (document.head || document.documentElement).appendChild(newScript); console.log(`${LOG_PREFIX} Injected patched script.`); setTimeout(addDownloadButton, 1500); }
                            else { console.error(`${LOG_PREFIX} Failed fetch script ${node.src}. Status: ${response.status}`); } },
                        onerror: function(error) { console.error(`${LOG_PREFIX} Error fetching script ${node.src}:`, error); }
                    }); node.remove(); } }); }); });
        observer.observe(document, { childList: true, subtree: true }); console.log(`${LOG_PREFIX} MutationObserver active.`);
        setTimeout(addDownloadButton, 7000); // Fallback button add
    })();

})(); // End of IIFE
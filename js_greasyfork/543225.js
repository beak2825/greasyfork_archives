// ==UserScript==
// @name         Claude Credentials Extractor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Estrae le credenziali di Claude per la Knowledge API con upload universale e interfaccia per VB.NET
// @author       Flejta
// @license      MIT
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543225/Claude%20Credentials%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/543225/Claude%20Credentials%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🔍 Claude Credentials Extractor avviato');

    // Oggetto per salvare le credenziali trovate
    let credentials = {
        organizationId: null,
        projectId: null,
        anonymousId: null,
        deviceId: null,
        foundAt: {},
        isComplete: false
    };

    // UI semplice per mostrare le credenziali
    function createSimpleUI() {
        // Rimuovi UI esistente
        const existing = document.getElementById('cred-display');
        if (existing) {
            existing.remove();
        }

        // Crea container
        const container = document.createElement('div');
        container.id = 'cred-display';
        container.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #2a2a2a; color: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 10000; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);';

        // Contenuto iniziale con pulsante chiudi
        container.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: center;"><h3 style="margin: 0; color: #60a5fa;">🔑 Claude Credentials</h3><button id="close-main-ui" style="background: none; border: none; color: #888; cursor: pointer; font-size: 16px; padding: 0;">✖</button></div><div id="cred-content" style="margin-top: 10px;">Ricerca in corso...</div>';

        document.body.appendChild(container);

        // Event listener per chiudere
        document.getElementById('close-main-ui').onclick = function() {
            container.style.display = 'none';
        };

        updateDisplay();
    }

    // Aggiorna display
    function updateDisplay() {
        const content = document.getElementById('cred-content');
        if (!content) return;

        let html = '';

        // Organization ID
        html += '<div style="margin: 5px 0;">';
        html += '<strong>Org ID:</strong> ';
        if (credentials.organizationId) {
            html += '<span style="color: #4ade80;">✓ ' + credentials.organizationId.substring(0, 8) + '...</span>';
        } else {
            html += '<span style="color: #ef4444;">✗ Non trovato</span>';
        }
        html += '</div>';

        // Project ID
        html += '<div style="margin: 5px 0;">';
        html += '<strong>Project ID:</strong> ';
        if (credentials.projectId) {
            html += '<span style="color: #4ade80;">✓ ' + credentials.projectId.substring(0, 8) + '...</span>';
        } else {
            html += '<span style="color: #ef4444;">✗ Non trovato</span>';
        }
        html += '</div>';

        // Anonymous ID
        html += '<div style="margin: 5px 0;">';
        html += '<strong>Anonymous ID:</strong> ';
        if (credentials.anonymousId) {
            html += '<span style="color: #4ade80;">✓ ' + credentials.anonymousId.substring(0, 8) + '...</span>';
        } else {
            html += '<span style="color: #ef4444;">✗ Non trovato</span>';
        }
        html += '</div>';

        // Device ID
        html += '<div style="margin: 5px 0;">';
        html += '<strong>Device ID:</strong> ';
        if (credentials.deviceId) {
            html += '<span style="color: #4ade80;">✓ ' + credentials.deviceId.substring(0, 8) + '...</span>';
        } else {
            html += '<span style="color: #ef4444;">✗ Non trovato</span>';
        }
        html += '</div>';

        // Status
        const complete = credentials.organizationId && credentials.projectId && credentials.anonymousId && credentials.deviceId;
        html += '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">';
        if (complete) {
            html += '<span style="color: #4ade80; font-weight: bold;">✅ Tutte le credenziali trovate!</span>';
        } else {
            html += '<span style="color: #fbbf24;">⏳ Ricerca in corso...</span>';
        }
        html += '</div>';

        // Pulsanti
        if (complete) {
            html += '<div style="margin-top: 10px;">';
            html += '<button id="copy-creds" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">📋 Copia JSON</button>';
            html += '<button id="upload-btn" style="background: #059669; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">📤 Upload</button>';
            html += '<button id="list-docs-btn" style="background: #8b5cf6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">📚 Lista Docs</button>';
            html += '<button id="space-info-btn" style="background: #f59e0b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">📊 Spazio</button>';
            html += '</div>';

            // Form upload universale
            html += '<div id="upload-form" style="display: none; margin-top: 10px; padding: 10px; background: #1a1a1a; border-radius: 4px;">';
            html += '<div style="margin-bottom: 10px;">';
            html += '<label style="color: #60a5fa; font-size: 12px;">Tipo di upload:</label>';
            html += '<div style="margin-top: 5px;">';
            html += '<label style="margin-right: 15px;"><input type="radio" name="upload-type" value="text" checked> 📝 Testo</label>';
            html += '<label><input type="radio" name="upload-type" value="file"> 📎 File</label>';
            html += '</div>';
            html += '</div>';

            // Sezione per upload testo
            html += '<div id="text-upload-section">';
            html += '<input type="text" id="doc-title" placeholder="Titolo documento" style="width: 100%; padding: 5px; margin-bottom: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">';
            html += '<textarea id="doc-content" placeholder="Contenuto documento" style="width: 100%; padding: 5px; height: 100px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; resize: vertical;"></textarea>';
            html += '</div>';

            // Sezione per upload file
            html += '<div id="file-upload-section" style="display: none;">';
            html += '<input type="file" id="file-input" style="width: 100%; padding: 5px; margin-bottom: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">';
            html += '<div id="file-info" style="color: #888; font-size: 12px; margin-top: 5px;"></div>';
            html += '</div>';

            html += '<div style="margin-top: 10px;">';
            html += '<button id="do-upload" style="background: #059669; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Carica</button>';
            html += '<button id="cancel-upload" style="background: #dc2626; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Annulla</button>';
            html += '</div>';
            html += '</div>';

            // Risultato operazioni
            html += '<div id="operation-result" style="display: none; margin-top: 10px; padding: 10px; border-radius: 4px;"></div>';

            // Lista documenti (nascosta inizialmente)
            html += '<div id="docs-list" style="display: none; margin-top: 10px; padding: 10px; background: #1a1a1a; border-radius: 4px; max-height: 300px; overflow-y: auto;"></div>';
        }

        content.innerHTML = html;

        // Event listeners
        if (complete) {
            // Copia JSON
            const copyBtn = document.getElementById('copy-creds');
            if (copyBtn) {
                copyBtn.onclick = function() {
                    const data = {
                        organizationId: credentials.organizationId,
                        projectId: credentials.projectId,
                        anonymousId: credentials.anonymousId,
                        deviceId: credentials.deviceId,
                        extractedAt: new Date().toISOString()
                    };
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    this.textContent = '✅ Copiato!';
                    setTimeout(() => {
                        this.textContent = '📋 Copia JSON';
                    }, 2000);
                };
            }

            // Mostra form upload
            const uploadBtn = document.getElementById('upload-btn');
            if (uploadBtn) {
                uploadBtn.onclick = function() {
                    showUploadForm();
                };
            }

            // Annulla upload
            const cancelBtn = document.getElementById('cancel-upload');
            if (cancelBtn) {
                cancelBtn.onclick = function() {
                    document.getElementById('upload-form').style.display = 'none';
                    document.getElementById('doc-title').value = '';
                    document.getElementById('doc-content').value = '';
                    document.getElementById('file-input').value = '';
                    document.getElementById('file-info').innerHTML = '';
                    document.getElementById('operation-result').style.display = 'none';
                    // Reset radio button
                    document.querySelector('input[name="upload-type"][value="text"]').checked = true;
                    document.getElementById('text-upload-section').style.display = 'block';
                    document.getElementById('file-upload-section').style.display = 'none';
                };
            }

            // Esegui upload
            const doUploadBtn = document.getElementById('do-upload');
            if (doUploadBtn) {
                doUploadBtn.onclick = uploadDocument;
            }

            // Lista documenti
            const listDocsBtn = document.getElementById('list-docs-btn');
            if (listDocsBtn) {
                listDocsBtn.onclick = listDocuments;
            }

            // Info spazio
            const spaceInfoBtn = document.getElementById('space-info-btn');
            if (spaceInfoBtn) {
                spaceInfoBtn.onclick = showSpaceInfo;
            }
        }
    }

    // Mostra form upload con gestione tipo
    function showUploadForm() {
        document.getElementById('upload-form').style.display = 'block';
        document.getElementById('docs-list').style.display = 'none';

        // Event listeners per radio buttons
        const radioButtons = document.querySelectorAll('input[name="upload-type"]');
        radioButtons.forEach(radio => {
            radio.onchange = function() {
                if (this.value === 'text') {
                    document.getElementById('text-upload-section').style.display = 'block';
                    document.getElementById('file-upload-section').style.display = 'none';
                } else {
                    document.getElementById('text-upload-section').style.display = 'none';
                    document.getElementById('file-upload-section').style.display = 'block';
                }
            };
        });

        // Event listener per file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.onchange = function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    document.getElementById('file-info').innerHTML = `
                        <strong>File:</strong> ${file.name}<br>
                        <strong>Tipo:</strong> ${file.type || 'Sconosciuto'}<br>
                        <strong>Dimensione:</strong> ${sizeMB} MB
                    `;
                }
            };
        }

        // Focus sul primo campo
        document.getElementById('doc-title').focus();
    }

    // Funzione per validare gli ID
    function isValidUUID(id) {
        // Gli UUID di Claude sono nel formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        // dove x è un carattere esadecimale (0-9, a-f)
        const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        return id && uuidRegex.test(id);
    }

    // Cerca credenziali nei tag script
    function searchScriptTags() {
        const scripts = document.getElementsByTagName('script');

        for (let i = 0; i < scripts.length; i++) {
            const content = scripts[i].textContent || scripts[i].innerHTML || '';

            // Organization ID
            if (!credentials.organizationId) {
                const orgMatch = content.match(/"organizationID":"([a-f0-9-]+)"/);
                if (orgMatch && isValidUUID(orgMatch[1])) {
                    credentials.organizationId = orgMatch[1];
                    console.log('✅ Org ID trovato in script tag:', orgMatch[1]);
                    updateDisplay();
                }
            }

            // Anonymous ID
            if (!credentials.anonymousId) {
                const anonMatch = content.match(/"anonymousID":"([a-f0-9-]+)"/);
                if (anonMatch && isValidUUID(anonMatch[1])) {
                    credentials.anonymousId = anonMatch[1];
                    console.log('✅ Anonymous ID trovato in script tag:', anonMatch[1]);
                    updateDisplay();
                }
            }

            // Device ID (potrebbe essere chiamato stableID)
            if (!credentials.deviceId) {
                let devMatch = content.match(/"deviceID":"([a-f0-9-]+)"/);
                if (!devMatch) {
                    devMatch = content.match(/"stableID":"([a-f0-9-]+)"/);
                }
                if (devMatch && isValidUUID(devMatch[1])) {
                    credentials.deviceId = devMatch[1];
                    console.log('✅ Device ID trovato in script tag:', devMatch[1]);
                    updateDisplay();
                }
            }
        }
    }

    // Cerca Project ID nell'URL
    function searchURL() {
        const url = window.location.href;
        const match = url.match(/\/project\/([a-f0-9-]+)/);
        if (match && isValidUUID(match[1]) && !credentials.projectId) {
            credentials.projectId = match[1];
            console.log('✅ Project ID trovato nell\'URL:', match[1]);
            updateDisplay();
        }
    }

    // Intercetta fetch per catturare headers
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options] = args;

            if (typeof url === 'string') {
                // Controlla URL per IDs
                const orgMatch = url.match(/\/organizations\/([a-f0-9-]+)/);
                if (orgMatch && isValidUUID(orgMatch[1]) && !credentials.organizationId) {
                    credentials.organizationId = orgMatch[1];
                    console.log('✅ Org ID da fetch URL:', orgMatch[1]);
                    updateDisplay();
                }

                const projMatch = url.match(/\/projects\/([a-f0-9-]+)/);
                if (projMatch && isValidUUID(projMatch[1]) && !credentials.projectId) {
                    credentials.projectId = projMatch[1];
                    console.log('✅ Project ID da fetch URL:', projMatch[1]);
                    updateDisplay();
                }
            }

            // Controlla headers
            if (options && options.headers) {
                if (options.headers['anthropic-anonymous-id'] && isValidUUID(options.headers['anthropic-anonymous-id']) && !credentials.anonymousId) {
                    credentials.anonymousId = options.headers['anthropic-anonymous-id'];
                    console.log('✅ Anonymous ID da headers:', credentials.anonymousId);
                    updateDisplay();
                }

                if (options.headers['anthropic-device-id'] && isValidUUID(options.headers['anthropic-device-id']) && !credentials.deviceId) {
                    credentials.deviceId = options.headers['anthropic-device-id'];
                    console.log('✅ Device ID da headers:', credentials.deviceId);
                    updateDisplay();
                }
            }

            return originalFetch.apply(this, args);
        };
    }

    // Funzione per listare i documenti
    async function listDocuments() {
        const resultDiv = document.getElementById('operation-result');
        const listDiv = document.getElementById('docs-list');

        // Reset visualizzazioni
        document.getElementById('upload-form').style.display = 'none';
        listDiv.style.display = 'none';

        // Mostra loading
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#3b82f6';
        resultDiv.style.color = 'white';
        resultDiv.innerHTML = '⏳ Caricamento documenti...';

        try {
            const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
            const listUrl = `${baseUrl}/docs`;

            console.log('📚 Richiesta lista documenti:', listUrl);

            const response = await fetch(listUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            console.log('📥 Documenti ricevuti:', data);

            if (response.ok) {
                // Proviamo diverse strutture possibili
                const documents = data.results || data.documents || data.items || data;
                const docCount = Array.isArray(documents) ? documents.length : 0;

                resultDiv.style.background = '#059669';
                resultDiv.innerHTML = `✅ Trovati ${docCount} documenti`;

                // Mostra lista
                listDiv.style.display = 'block';
                let docsHtml = '<h4 style="margin: 0 0 10px 0; color: #60a5fa;">📚 Documenti nella Knowledge</h4>';

                if (!Array.isArray(documents) || documents.length === 0) {
                    docsHtml += '<p style="color: #888;">Nessun documento presente</p>';
                    console.log('ℹ️ Struttura risposta:', JSON.stringify(data, null, 2));
                } else {
                    docsHtml += '<div style="max-height: 250px; overflow-y: auto;">';
                    documents.forEach((doc, index) => {
                        docsHtml += `
                            <div style="margin-bottom: 10px; padding: 10px; background: #333; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div style="flex: 1; margin-right: 10px;">
                                        <strong style="color: #60a5fa;">${index + 1}. ${doc.file_name || 'Senza titolo'}</strong>
                                        <div style="color: #888; font-size: 10px; margin-top: 2px;">
                                            UUID: ${doc.uuid}<br>
                                            Creato: ${new Date(doc.created_at).toLocaleString('it-IT')}
                                        </div>
                                    </div>
                                    <button class="delete-doc-btn" data-uuid="${doc.uuid}" data-name="${doc.file_name}" style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">🗑️ Elimina</button>
                                </div>
                            </div>
                        `;
                    });
                    docsHtml += '</div>';
                }

                docsHtml += '<button id="close-list" style="margin-top: 10px; background: #6b7280; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Chiudi</button>';

                listDiv.innerHTML = docsHtml;

                // Event listeners per i pulsanti delete
                document.querySelectorAll('.delete-doc-btn').forEach(btn => {
                    btn.onclick = function() {
                        const uuid = this.getAttribute('data-uuid');
                        const name = this.getAttribute('data-name');
                        if (confirm(`Sei sicuro di voler eliminare "${name}"?`)) {
                            deleteDocument(uuid, name);
                        }
                    };
                });

                // Chiudi lista
                document.getElementById('close-list').onclick = function() {
                    listDiv.style.display = 'none';
                    resultDiv.style.display = 'none';
                };

            } else {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Errore lista documenti:', error);
            resultDiv.style.background = '#ef4444';
            resultDiv.innerHTML = `❌ Errore: ${error.message}`;
        }
    }

    // Funzione per eliminare un documento
    async function deleteDocument(uuid, name) {
        const resultDiv = document.getElementById('operation-result');

        // Mostra loading
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#3b82f6';
        resultDiv.style.color = 'white';
        resultDiv.innerHTML = `⏳ Eliminazione "${name}"...`;

        try {
            const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
            const deleteUrl = `${baseUrl}/docs/${uuid}`;

            console.log('🗑️ Eliminazione documento:', deleteUrl);

            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    docUuid: uuid
                })
            });

            if (response.ok) {
                resultDiv.style.background = '#059669';
                resultDiv.innerHTML = `✅ "${name}" eliminato con successo!`;

                // Ricarica la lista dopo 1 secondo
                setTimeout(() => {
                    listDocuments();
                }, 1000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Errore eliminazione:', error);
            resultDiv.style.background = '#ef4444';
            resultDiv.innerHTML = `❌ Errore: ${error.message}`;
        }
    }

    // Funzione per upload documento (testo o file)
    async function uploadDocument() {
        const uploadType = document.querySelector('input[name="upload-type"]:checked').value;
        const resultDiv = document.getElementById('operation-result');

        if (uploadType === 'text') {
            // Upload testo tradizionale
            await uploadTextDocument();
        } else {
            // Upload file binario
            await uploadBinaryFile();
        }
    }

    // Upload documento di testo
    async function uploadTextDocument() {
        const title = document.getElementById('doc-title').value.trim();
        const content = document.getElementById('doc-content').value.trim();
        const resultDiv = document.getElementById('operation-result');

        if (!title || !content) {
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#ef4444';
            resultDiv.style.color = 'white';
            resultDiv.innerHTML = '❌ Inserisci titolo e contenuto!';
            return;
        }

        // Mostra loading
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#3b82f6';
        resultDiv.style.color = 'white';
        resultDiv.innerHTML = '⏳ Upload testo in corso...';

        try {
            const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
            const uploadUrl = `${baseUrl}/docs`;

            console.log('📤 Upload documento testo:', { title, url: uploadUrl });

            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    file_name: title,
                    content: content
                })
            });

            const responseData = await response.json();
            console.log('📥 Risposta upload testo:', responseData);

            if (response.ok) {
                resultDiv.style.background = '#059669';
                resultDiv.innerHTML = `✅ Documento caricato con successo!<br>UUID: ${responseData.uuid || 'N/A'}`;

                // Pulisci form
                document.getElementById('doc-title').value = '';
                document.getElementById('doc-content').value = '';

                // Nascondi form dopo 2 secondi
                setTimeout(() => {
                    document.getElementById('upload-form').style.display = 'none';
                    resultDiv.style.display = 'none';
                }, 3000);
            } else {
                throw new Error(responseData.error || `HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Errore upload testo:', error);
            resultDiv.style.background = '#ef4444';
            resultDiv.innerHTML = `❌ Errore: ${error.message}`;
        }
    }

    // Upload file binario
    async function uploadBinaryFile() {
        const fileInput = document.getElementById('file-input');
        const resultDiv = document.getElementById('operation-result');

        if (!fileInput.files || !fileInput.files[0]) {
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#ef4444';
            resultDiv.style.color = 'white';
            resultDiv.innerHTML = '❌ Seleziona un file!';
            return;
        }

        const file = fileInput.files[0];

        // Mostra loading
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#3b82f6';
        resultDiv.style.color = 'white';
        resultDiv.innerHTML = '⏳ Upload file in corso...';

        try {
            const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
            const uploadUrl = `${baseUrl}/upload`;

            console.log('📤 Upload file binario:', { fileName: file.name, size: file.size, type: file.type });

            // Crea FormData
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const responseData = await response.json();
            console.log('📥 Risposta upload file:', responseData);

            if (response.ok) {
                resultDiv.style.background = '#059669';
                let successHtml = `✅ File caricato con successo!<br>`;
                successHtml += `Nome: ${responseData.file_name || file.name}<br>`;
                successHtml += `UUID: ${responseData.file_uuid || 'N/A'}`;

                // Se è un'immagine e c'è un'anteprima
                if (responseData.preview_url || responseData.thumbnail_url) {
                    successHtml += '<br><br>Anteprima:<br>';
                    const previewUrl = responseData.preview_url || responseData.thumbnail_url;
                    successHtml += `<img src="${previewUrl}" style="max-width: 200px; max-height: 200px; border: 1px solid #555; border-radius: 4px; margin-top: 5px;">`;
                }

                resultDiv.innerHTML = successHtml;

                // Pulisci form
                fileInput.value = '';
                document.getElementById('file-info').innerHTML = '';

                // Nascondi form dopo 4 secondi (più tempo per vedere l'anteprima)
                setTimeout(() => {
                    document.getElementById('upload-form').style.display = 'none';
                    resultDiv.style.display = 'none';
                }, 4000);
            } else {
                throw new Error(responseData.error || `HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Errore upload file:', error);
            resultDiv.style.background = '#ef4444';
            resultDiv.innerHTML = `❌ Errore: ${error.message}`;
        }
    }

    // Funzione per mostrare info spazio Knowledge
    async function showSpaceInfo() {
        const resultDiv = document.getElementById('operation-result');

        // Reset altre visualizzazioni
        document.getElementById('upload-form').style.display = 'none';
        document.getElementById('docs-list').style.display = 'none';

        // Mostra loading
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#3b82f6';
        resultDiv.style.color = 'white';
        resultDiv.innerHTML = '⏳ Caricamento info spazio...';

        try {
            const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
            const statsUrl = `${baseUrl}/kb/stats`;

            console.log('📊 Richiesta info spazio:', statsUrl);

            const response = await fetch(statsUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            console.log('📥 Info spazio ricevute:', data);

            if (response.ok) {
                // Calcola percentuale
                const percentage = ((data.knowledge_size / data.max_knowledge_size) * 100).toFixed(2);

                // Formatta dimensioni in MB
                const usedMB = (data.knowledge_size / (1024 * 1024)).toFixed(2);
                const maxMB = (data.max_knowledge_size / (1024 * 1024)).toFixed(2);

                // Determina colore barra in base alla percentuale
                let barColor = '#059669'; // Verde
                if (percentage > 50) barColor = '#f59e0b'; // Arancione
                if (percentage > 80) barColor = '#dc2626'; // Rosso

                // Mostra risultato con barra di progresso
                resultDiv.style.background = '#1a1a1a';
                resultDiv.innerHTML = `
                    <h4 style="margin: 0 0 10px 0; color: #60a5fa;">📊 Spazio Knowledge Utilizzato</h4>

                    <div style="margin-bottom: 15px;">
                        <div style="background: #333; border-radius: 10px; height: 30px; overflow: hidden; position: relative;">
                            <div style="background: ${barColor}; height: 100%; width: ${percentage}%; transition: width 0.5s ease;">
                                <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                                    ${percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style="color: #ddd; font-size: 14px;">
                        <div style="margin-bottom: 5px;">
                            <strong>Spazio usato:</strong> ${usedMB} MB / ${maxMB} MB
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>Spazio libero:</strong> ${(maxMB - usedMB).toFixed(2)} MB
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>Dimensione in bytes:</strong> ${data.knowledge_size.toLocaleString('it-IT')} bytes
                        </div>
                    </div>

                    <div style="margin-top: 10px; padding: 10px; background: #222; border-radius: 5px; font-size: 12px; color: #888;">
                        <div><strong>Soglia ricerca:</strong> ${(data.project_knowledge_search_threshold / 1024).toFixed(0)} KB</div>
                        <div><strong>Ricerca attiva:</strong> ${data.use_project_knowledge_search ? 'Sì' : 'No'}</div>
                    </div>

                    <button id="close-space-info" style="margin-top: 10px; background: #6b7280; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Chiudi</button>
                `;

                // Event listener per chiudere
                document.getElementById('close-space-info').onclick = function() {
                    resultDiv.style.display = 'none';
                };

            } else {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Errore info spazio:', error);
            resultDiv.style.background = '#ef4444';
            resultDiv.innerHTML = `❌ Errore: ${error.message}`;
        }
    }

    // Osserva nuovi script aggiunti
    function observeNewScripts() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT') {
                        setTimeout(searchScriptTags, 100);
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Funzione principale di ricerca
    function searchCredentials() {
        console.log('🔍 Inizio ricerca credenziali...');
        searchURL();
        searchScriptTags();
    }

    // Inizializzazione
    function init() {
        console.log('🚀 Inizializzazione...');

        // Crea UI
        createSimpleUI();

        // Installa intercettori
        interceptFetch();

        // Avvia ricerca
        searchCredentials();

        // Osserva cambiamenti
        observeNewScripts();

        // Riprova periodicamente per 30 secondi
        let attempts = 0;
        const interval = setInterval(function() {
            attempts++;
            if (attempts > 15) {
                clearInterval(interval);
                console.log('⏱️ Timeout ricerca credenziali');
                return;
            }

            const complete = credentials.organizationId && credentials.projectId && credentials.anonymousId && credentials.deviceId;
            if (!complete) {
                searchCredentials();
            } else {
                clearInterval(interval);
                console.log('🎉 Ricerca completata!');
            }
        }, 2000);
    }

    // Avvia quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    // ========================================
    // INTERFACCIA GLOBALE PER VB.NET
    // ========================================

    window.ClaudeKnowledgeAPI = {
        // Ottieni credenziali correnti
        getCredentials: function() {
            return {
                organizationId: credentials.organizationId,
                projectId: credentials.projectId,
                anonymousId: credentials.anonymousId,
                deviceId: credentials.deviceId,
                isComplete: credentials.organizationId && credentials.projectId && credentials.anonymousId && credentials.deviceId
            };
        },

        // Upload testo diretto (per VB.NET)
        uploadText: async function(fileName, content) {
            if (!credentials.organizationId || !credentials.projectId) {
                return { success: false, error: 'Credenziali non complete' };
            }

            try {
                const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
                const uploadUrl = `${baseUrl}/docs`;

                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        file_name: fileName,
                        content: content
                    })
                });

                const responseData = await response.json();

                if (response.ok) {
                    return {
                        success: true,
                        data: responseData,
                        uuid: responseData.uuid
                    };
                } else {
                    return {
                        success: false,
                        error: responseData.error || `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // Upload file da base64 (per VB.NET)
        uploadFileBase64: async function(fileName, base64Data, mimeType) {
            if (!credentials.organizationId || !credentials.projectId) {
                return { success: false, error: 'Credenziali non complete' };
            }

            try {
                // Converti base64 in blob
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType || 'application/octet-stream' });
                const file = new File([blob], fileName, { type: mimeType || 'application/octet-stream' });

                const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
                const uploadUrl = `${baseUrl}/upload`;

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                const responseData = await response.json();

                if (response.ok) {
                    return {
                        success: true,
                        data: responseData,
                        uuid: responseData.file_uuid
                    };
                } else {
                    return {
                        success: false,
                        error: responseData.error || `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // Elimina documento (per VB.NET)
        deleteDocument: async function(docUuid) {
            if (!credentials.organizationId || !credentials.projectId) {
                return { success: false, error: 'Credenziali non complete' };
            }

            try {
                const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
                const deleteUrl = `${baseUrl}/docs/${docUuid}`;

                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        docUuid: docUuid
                    })
                });

                if (response.ok) {
                    return { success: true };
                } else {
                    const errorData = await response.json();
                    return {
                        success: false,
                        error: errorData.error || `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // Lista documenti (per VB.NET)
        listDocuments: async function() {
            if (!credentials.organizationId || !credentials.projectId) {
                return { success: false, error: 'Credenziali non complete' };
            }

            try {
                const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
                const listUrl = `${baseUrl}/docs`;

                const response = await fetch(listUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    const documents = data.results || data.documents || data.items || data;
                    return {
                        success: true,
                        documents: Array.isArray(documents) ? documents : []
                    };
                } else {
                    return {
                        success: false,
                        error: data.error || `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // Info spazio (per VB.NET)
        getSpaceInfo: async function() {
            if (!credentials.organizationId || !credentials.projectId) {
                return { success: false, error: 'Credenziali non complete' };
            }

            try {
                const baseUrl = `https://claude.ai/api/organizations/${credentials.organizationId}/projects/${credentials.projectId}`;
                const statsUrl = `${baseUrl}/kb/stats`;

                const response = await fetch(statsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    const percentage = ((data.knowledge_size / data.max_knowledge_size) * 100).toFixed(2);
                    return {
                        success: true,
                        data: {
                            ...data,
                            percentage: parseFloat(percentage),
                            usedMB: data.knowledge_size / (1024 * 1024),
                            maxMB: data.max_knowledge_size / (1024 * 1024),
                            freeMB: (data.max_knowledge_size - data.knowledge_size) / (1024 * 1024)
                        }
                    };
                } else {
                    return {
                        success: false,
                        error: data.error || `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    };

    // Log per conferma
    console.log('🔌 ClaudeKnowledgeAPI globale disponibile per VB.NET');

})();
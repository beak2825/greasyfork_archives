// ==UserScript==
// @name         MusicBrainz: Artwork Uploader Turbo
// @namespace    https://musicbrainz.org/user/chaban
// @version      3.1.1
// @tag          ai-created
// @description  Allows for multiple artwork images to be uploaded simultaneously and recursively upload directories.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/*/add-cover-art*
// @match        *://*.musicbrainz.org/event/*/add-event-art*
// @grant        none
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544140/MusicBrainz%3A%20Artwork%20Uploader%20Turbo.user.js
// @updateURL https://update.greasyfork.org/scripts/544140/MusicBrainz%3A%20Artwork%20Uploader%20Turbo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- MAIN APPLICATION ---
    const ArtworkUploaderTurbo = {
        // --- CONFIGURATION ---
        UPLOAD_WORKER_LIMIT: 4,
        INITIAL_RETRY_DELAY_MS: 2000,
        MAX_RETRY_DELAY_MS: 60000,
        SCRIPT_NAME: '[MusicBrainz: Artwork Uploader Turbo]',

        // --- STATE ---
        state: {
            files: [],
            ui: {},
            upvm: null, // To hold the captured ViewModel instance
        },

        // --- LOGGER UTILITY ---
        logger: {
            log: (...args) => console.log(ArtworkUploaderTurbo.SCRIPT_NAME, ...args),
            warn: (...args) => console.warn(ArtworkUploaderTurbo.SCRIPT_NAME, ...args),
            error: (...args) => console.error(ArtworkUploaderTurbo.SCRIPT_NAME, ...args),
        },

        // --- PROMISE HELPERS ---
        toNativePromise(deferred) {
            return new Promise((resolve, reject) => {
                deferred.done(resolve).fail((...args) => reject(args));
            });
        },

        // --- UI RENDERING ---
        UI: {
            init() {
                this.injectStyles();
                this.createMainContainer();
                this.createDebugUI(ArtworkUploaderTurbo.state.ui.mainContainer);
            },

            injectStyles() {
                const styleSheet = document.createElement('style');
                styleSheet.type = 'text/css';
                styleSheet.innerText = `
                    #mb-artwork-uploader-turbo-container {
                        background-color: var(--background-accent, #f9f9f9); border: 1px solid #ccc;
                        color: var(--text, black); position: fixed; right: 10px; bottom: 10px;
                        padding: 10px; max-width: 450px; box-shadow: 1pt 1pt 2pt gray;
                        z-index: 1000; font-size: small;
                    }
                    #mb-artwork-uploader-turbo-container summary { font-weight: bold; cursor: pointer; }
                    #mb-artwork-uploader-turbo-container .status-list-item.done { color: var(--positive-emphasis, lightgreen); }
                    #mb-artwork-uploader-turbo-container .status-list-item.error { color: var(--negative-emphasis, red); }
                `;
                document.head.appendChild(styleSheet);
            },

            createMainContainer() {
                if (ArtworkUploaderTurbo.state.ui.mainContainer) return;
                const container = document.createElement('div');
                container.id = 'mb-artwork-uploader-turbo-container';
                document.body.append(container);
                ArtworkUploaderTurbo.state.ui.mainContainer = container;
            },

            createCollapsibleSection(container, title, isOpen = false) {
                const details = document.createElement('details');
                details.open = isOpen;
                const summary = document.createElement('summary');
                summary.textContent = title;
                details.append(summary);
                container.append(details);
                return details;
            },

            createDebugUI(container) {
                const section = this.createCollapsibleSection(container, 'Upload Status', true);
                const list = document.createElement('ul');
                list.style.cssText = 'list-style: none; padding: 0 0 0 10px; margin-top: 10px; max-height: 150px; overflow-y: auto;';
                section.append(list);
                ArtworkUploaderTurbo.state.ui.fileList = list;
            },

            updateDebugUI() {
                const { fileList } = ArtworkUploaderTurbo.state.ui;
                if (!fileList) return;

                requestAnimationFrame(() => {
                    fileList.innerHTML = '';
                    for (const file of ArtworkUploaderTurbo.state.files) {
                        const item = document.createElement('li');
                        item.className = 'status-list-item';
                        const status = file.status();
                        const stage = file._script?.stage ?? 'Pending';
                        let statusText = '';

                        if (stage === 'Failed' && file._script?.httpStatus !== undefined) {
                            statusText = `(${status}, HTTP ${file._script.httpStatus ?? 'N/A'})`;
                        } else if (status.includes('error') || stage.toLowerCase() !== status.toLowerCase()) {
                            statusText = `(${status})`;
                        }

                        item.textContent = `${file.name}: ${stage}${statusText ? ' ' + statusText : ''}`;
                        if (status === 'done') item.classList.add('done');
                        else if (status?.includes('error')) item.classList.add('error');
                        fileList.append(item);
                    }
                });
            },
        },

        // --- DIRECTORY UPLOADER FEATURE ---
        DirectoryUploader: {
            _addFilesButton: null,
            _dirInput: null,
            _originalButtonText: '',

            init() {
                const observer = new MutationObserver((mutations, obs) => {
                    const button = document.querySelector('span.fileinput-button.buttons button.add-files');
                    if (button) {
                        this._enhanceButton(button);
                        obs.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            },

            _enhanceButton(button) {
                this._addFilesButton = button;
                this._originalButtonText = button.textContent;

                this._dirInput = document.createElement('input');
                this._dirInput.type = 'file';
                this._dirInput.webkitdirectory = true;
                this._dirInput.multiple = true;
                this._dirInput.style.display = 'none';
                document.body.append(this._dirInput);

                this._addFilesButton.addEventListener('click', this._handleClick.bind(this), true);
                this._dirInput.addEventListener('change', this._handleDirectorySelection.bind(this));
                document.addEventListener('keydown', this._handleShiftState.bind(this));
                document.addEventListener('keyup', this._handleShiftState.bind(this));
                window.addEventListener('blur', () => {
                    this._addFilesButton.textContent = this._originalButtonText;
                });

                this._addFilesButton.setAttribute('title', 'Hold Shift to select a directory');
            },

            _handleClick(event) {
                if (event.shiftKey) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this._dirInput.click();
                }
            },

            _handleShiftState(event) {
                if (event.key === 'Shift') {
                    this._addFilesButton.textContent = event.type === 'keydown'
                        ? 'Select directory...'
                        : this._originalButtonText;
                }
            },

            async _handleDirectorySelection(event) {
                const files = Array.from(event.target.files);
                if (files.length === 0) {
                    ArtworkUploaderTurbo.logger.warn('No files found in selected directory.');
                    return;
                }

                if (ArtworkUploaderTurbo.state.upvm?.addFile) {
                    const validationPromises = files.map(file =>
                        ArtworkUploaderTurbo.toNativePromise(MB.Art.validate_file(file))
                            .then(() => ({ file, valid: true }))
                            .catch(() => ({ file, valid: false }))
                    );

                    const results = await Promise.all(validationPromises);
                    const validFiles = results.filter(r => r.valid).map(r => r.file);

                    if (validFiles.length > 0) {
                        ArtworkUploaderTurbo.logger.log(`Adding ${validFiles.length} valid files.`);
                    }
                    if (validFiles.length < files.length) {
                        ArtworkUploaderTurbo.logger.log(`Ignoring ${files.length - validFiles.length} invalid files.`);
                    }

                    validFiles.forEach(file => ArtworkUploaderTurbo.state.upvm.addFile(file));

                    const formName = window.__MB__.$c.action.name.replace(/_/g, '-');
                    document.querySelector(`#${formName}-submit`).disabled = false;
                } else {
                    ArtworkUploaderTurbo.logger.error("Could not access the captured UploadProcessViewModel.");
                }

                event.target.value = '';
            },
        },

        // --- MAIN UPLOADER LOGIC ---
        Uploader: {
            init() {
                const { name: actionName } = window.__MB__.$c.action;
                const pageInfo = this._getPageInfo(actionName);
                if (!pageInfo) return;

                MB.Art.add_art_submit = this.run.bind(this, pageInfo);
            },

            _getPageInfo(actionName) {
                let entityType, archiveName;
                switch (actionName) {
                    case 'add_cover_art': [entityType, archiveName] = ['release', 'cover']; break;
                    case 'add_event_art': [entityType, archiveName] = ['event', 'event']; break;
                    default: return null;
                }
                const formName = actionName.replace(/_/g, '-');
                return { entityType, archiveName, formName };
            },

            async run({ entityType, archiveName, formName }, gid, upvm) {
                ArtworkUploaderTurbo.state.files = upvm.files_to_upload().filter(f => f.status() !== 'done');
                if (ArtworkUploaderTurbo.state.files.length === 0) return;

                ArtworkUploaderTurbo.UI.updateDebugUI();
                this._prepareUI(formName);

                const pipeline = new this.Pipeline(gid, ArtworkUploaderTurbo.state.files, formName);
                await pipeline.start();
                this._finalize(pipeline.hasCriticalError, entityType, archiveName, gid, formName);
            },

            _prepareUI(formName) {
                $('.add-files.row, #cover-art-position-row, #event-art-position-row').hide();
                document.querySelector('#content').scrollIntoView({ behavior: 'smooth' });
                document.querySelector(`#${formName}-submit`).disabled = true;
            },

            _finalize(hasError, entityType, archiveName, gid, formName) {
                if (!hasError) {
                    const container = ArtworkUploaderTurbo.state.ui.mainContainer;
                    if (container) container.remove();
                    window.location.href = `/${entityType}/${gid}/${archiveName}-art`;
                } else {
                    ArtworkUploaderTurbo.logger.log('Process finished. Some files failed and could not be retried.');
                    document.querySelector(`#${formName}-submit`).disabled = false;
                }
            },

            Pipeline: class {
                constructor(gid, allFiles, formName) {
                    this.gid = gid;
                    this.allFiles = allFiles;
                    this.formName = formName;
                    this.filesToSign = [...allFiles];
                    this.filesToUpload = [];
                    this.filesToSubmit = [];
                    this.processedFileCount = 0;
                    this.hasCriticalError = false;
                }

                async start() {
                    const promises = [
                        this._signerThread(),
                        this._submitterThread(),
                        ...Array(ArtworkUploaderTurbo.UPLOAD_WORKER_LIMIT).fill(null).map(() => this._uploaderWorker())
                    ];
                    await Promise.all(promises);
                }

                async _handleRetry(file, error) {
                    const httpStatus = error[0]?.status ?? null;
                    const isRetriable = (httpStatus >= 500 || httpStatus === 429 || httpStatus === 408 || httpStatus === 0 || httpStatus === null);

                    if (isRetriable) {
                        file._script.retryDelay = file._script.retryDelay || ArtworkUploaderTurbo.INITIAL_RETRY_DELAY_MS;
                        file._script.stage = `Retrying (HTTP ${httpStatus ?? 'N/A'})...`;
                        ArtworkUploaderTurbo.UI.updateDebugUI();
                        await new Promise(resolve => setTimeout(resolve, file._script.retryDelay));
                        file._script.retryDelay = Math.min(file._script.retryDelay * 2, ArtworkUploaderTurbo.MAX_RETRY_DELAY_MS);
                        return true;
                    }

                    file._script.stage = `Failed`;
                    file._script.httpStatus = httpStatus;
                    this.hasCriticalError = true;
                    ArtworkUploaderTurbo.logger.error(`Unrecoverable error for file "${file.name}": ${file.status()} (HTTP Status: ${httpStatus ?? 'N/A'})`);
                    ArtworkUploaderTurbo.UI.updateDebugUI();
                    return false;
                }

                async _signerThread() {
                    while (this.processedFileCount + this.filesToSubmit.length + this.filesToUpload.length < this.allFiles.length) {
                        const file = this.filesToSign.shift();
                        if (!file) { await new Promise(r => setTimeout(r, 100)); continue; }
                        if (!file._script) file._script = {};

                        while (true) {
                            try {
                                file.status(MB.Art.upload_status_enum.signing);
                                file._script.stage = 'Signing';
                                ArtworkUploaderTurbo.UI.updateDebugUI();
                                file.postfields = await ArtworkUploaderTurbo.toNativePromise(MB.Art.sign_upload(file, this.gid, file.mimeType()));
                                this.filesToUpload.push(file);
                                break;
                            } catch (error) {
                                if (!(await this._handleRetry(file, error))) break;
                            }
                        }
                    }
                }

                async _uploaderWorker() {
                     while (this.processedFileCount < this.allFiles.length && !this.hasCriticalError) {
                        const file = this.filesToUpload.shift();
                        if (!file) { await new Promise(r => setTimeout(r, 100)); continue; }

                        while (true) {
                            try {
                                file.status(MB.Art.upload_status_enum.uploading);
                                file._script.stage = 'Uploading';
                                ArtworkUploaderTurbo.UI.updateDebugUI();
                                await ArtworkUploaderTurbo.toNativePromise(MB.Art.upload_image(file.postfields, file.data)
                                    .progress(value => { file.progress(10 + (value * 0.8)); }));
                                this.filesToSubmit.push(file);
                                break;
                            } catch (error) {
                                if (!(await this._handleRetry(file, error))) break;
                            }
                        }
                    }
                }

                async _submitterThread() {
                    const startingPosition = parseInt($(`#id-${this.formName}\\.position`).val(), 10);
                    while (this.processedFileCount < this.allFiles.length && !this.hasCriticalError) {
                        const file = this.filesToSubmit.shift();
                        if (!file) { await new Promise(r => setTimeout(r, 100)); continue; }

                        const position = startingPosition + this.allFiles.indexOf(file);

                        while (true) {
                            try {
                                file.status(MB.Art.upload_status_enum.submitting);
                                file._script.stage = 'Submitting';
                                ArtworkUploaderTurbo.UI.updateDebugUI();
                                await ArtworkUploaderTurbo.toNativePromise(MB.Art.submit_edit(file, file.postfields, file.mimeType(), position));
                                file.progress(100);
                                file.status(MB.Art.upload_status_enum.done);
                                file._script.stage = 'Done';
                                this.processedFileCount++;
                                ArtworkUploaderTurbo.UI.updateDebugUI();
                                break;
                            } catch (error) {
                                if (!(await this._handleRetry(file, error))) break;
                            }
                        }
                    }
                }
            }
        },

        // --- SCRIPT INITIALIZATION ---
        init() {
            const checkMB = setInterval(() => {
                if (window.MB?.Art?.add_art_submit && window.MB?.Art?.UploadProcessViewModel && window.__MB__?.$c && window.$) {
                    clearInterval(checkMB);

                    const originalVM = MB.Art.UploadProcessViewModel;
                    MB.Art.UploadProcessViewModel = function(...args) {
                        const instance = new originalVM(...args);
                        ArtworkUploaderTurbo.state.upvm = instance;
                        ArtworkUploaderTurbo.logger.log('Successfully captured UploadProcessViewModel instance.');
                        return instance;
                    };

                    this.UI.init();
                    this.Uploader.init();
                    this.DirectoryUploader.init();
                }
            }, 50);
        }
    };

    ArtworkUploaderTurbo.init();

})();

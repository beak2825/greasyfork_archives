// ==UserScript==
// @name         Nexus Download Collection
// @namespace    NDC
// @version      0.9.9
// @description  Download every mods of a collection in a single click
// @author       Drigtime
// @match        https://www.nexusmods.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   safari
// @compatible   brave
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @connect      nexusmods.com
// @downloadURL https://update.greasyfork.org/scripts/483337/Nexus%20Download%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/483337/Nexus%20Download%20Collection.meta.js
// ==/UserScript==

// MDI : https://pictogrammers.com/library/mdi/
// MDI : https://github.com/MathewSachin/Captura/blob/master/src/Captura.Core/MaterialDesignIcons.cs

GM_addStyle(`
    .bottom-auto {
        bottom: auto;
    }
    .left-auto {
        left: auto;
    }
    .right-0 {
        right: 0px;
    }
    .top-0 {
        top: 0px;
    }
    .translate-y-\\[2rem\\] {
        --tw-translate-y: 2rem;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    }
    .min-h-7 {
    min-height: 1.75rem;
    }
    .w-11 {
        width: 2.75rem;
    }
    .w-20{
        width:5rem;
    }
    .w-32 {
        width: 8rem;
    }
    .w-52 {
        width: 13rem;
    }
    .text-green-600 {
        --tw-text-opacity: 1;
        color: rgb(22 163 74 / var(--tw-text-opacity, 1));
    }
    .text-red-600 {
        --tw-text-opacity: 1;
        color: rgb(220 38 38 / var(--tw-text-opacity, 1))
    }
    .text-sky-500 {
        --tw-text-opacity: 1;
        color: rgb(14 165 233 / var(--tw-text-opacity, 1));
    }
    .backdrop-blur-sm {
        backdrop-filter: blur(3px);
    }
    .backdrop-brightness-50 {
        backdrop-filter: brightness(50%);
    }

    @media (min-width: 768px) {
        .sm\\:rounded-none {
            border-radius: 0;
        }
        .sm\\:gap-0 {
            gap: 0;
        }
        .sm\\:w-52 {
            width: 13rem;
        }
        .sm\\:justify-start {
            justify-content: flex-start;
        }
    }
`);

const convertSize = (sizeInKB) => {
    // if size is greater than 1GB convert to GB, else in MB
    const sizeInMB = sizeInKB / 1024;
    const sizeInGB = sizeInMB / 1024;
    return sizeInGB >= 1
        ? `${sizeInGB.toFixed(2)} GB`
        : `${sizeInMB.toFixed(2)} MB`;
};

class NDC {
    mods = {
        all: [],
        mandatory: [],
        optional: [],
    };

    constructor(gameId, collectionId, revision = null) {
        this.element = document.createElement("div");
        this.element.classList.add('bg-surface-low', 'w-full', 'space-y-3', 'rounded-lg', 'p-4', 'mt-4');

        this.gameId = gameId;
        this.collectionId = collectionId;
        this.revision = revision;

        this.pauseBetweenDownload = 5;
        this.downloadSpeed = 1.5;
        this.downloadMethod = NDCDownloadButton.DOWNLOAD_METHOD_VORTEX;

        this.downloadButton = new NDCDownloadButton(this);
        this.progressBar = new NDCProgressBar(this);
        this.console = new NDCLogConsole(this);
    }

    async init() {
        this.pauseBetweenDownload = await GM.getValue("pauseBetweenDownload", 5);
        this.downloadSpeed = await GM.getValue("downloadSpeed", 1.5);
        this.downloadMethod = await GM.getValue(
            "downloadMethod",
            NDCDownloadButton.DOWNLOAD_METHOD_VORTEX,
        );

        this.element.innerHTML = `
        <button class="w-full font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued rounded">
            Fetching mods list...
        </button>
        `;

        const response = await this.fetchMods();

        if (!response) {
            this.element.innerHTML =
                '<div class="w-full font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued rounded">Failed to fetch mods list</div>';
            return;
        }

        const mods = response.modFiles.sort((a, b) =>
            a.file.mod.name.localeCompare(b.file.mod.name),
        );
        const mandatoryMods = mods.filter((mod) => !mod.optional);
        const optionalMods = mods.filter((mod) => mod.optional);
        this.mods = {
            all: [...mandatoryMods, ...optionalMods],
            mandatory: mandatoryMods,
            optional: optionalMods,
        };

        this.downloadButton.render();
        this.element.innerHTML = "";
        this.element.appendChild(this.downloadButton.element);
        this.element.appendChild(this.progressBar.element);
        this.element.appendChild(this.console.element);
    }

    async fetchMods(collectionId = this.collectionId, revision = this.revision) {
        // https://graphql.nexusmods.com/#definition-CollectionRevisionMod
        const response = await fetch("https://api-router.nexusmods.com/graphql", {
            headers: {
                "content-type": "application/json",
            },
            referrer: document.location.href,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify({
                query:
                    "query CollectionRevisionMods ($revision: Int, $slug: String!, $viewAdultContent: Boolean) { collectionRevision (revision: $revision, slug: $slug, viewAdultContent: $viewAdultContent) { externalResources { id, name, resourceType, resourceUrl }, modFiles { fileId, optional, file { fileId, name, uri, size, version, date, mod { adult, modId, name, version, game { domainName, id } } } } } }",
                variables: { slug: collectionId, viewAdultContent: true, revision: revision },
                operationName: "CollectionRevisionMods",
            }),
            method: "POST",
            mode: "cors",
            credentials: "include",
        });

        if (!response.ok) {
            return;
        }

        const json = await response.json();

        if (!json.data.collectionRevision) {
            return;
        }

        json.data.collectionRevision.modFiles =
            json.data.collectionRevision.modFiles.map((modFile) => {
                modFile.file.url = `https://www.nexusmods.com/${modFile.file.mod.game.domainName}/mods/${modFile.file.mod.modId}?tab=files&file_id=${modFile.file.fileId}`;
                return modFile;
            });

        return json.data.collectionRevision;
    }

    async fetchDownloadLink(mod) {
        this.bypassNexusAdsCookie();

        let response;
        if (this.downloadMethod === NDCDownloadButton.DOWNLOAD_METHOD_VORTEX) {
            response = await fetch(`${mod.file.url}&nmm=1`);
        } else {
            response = await fetch(mod.file.url);
        }

        const text = await response.text();

        if (!response.ok) return { downloadUrl: "", text };

        // console.log(text.match(/<td>1\.5MB<\/td>/));
        // console.log(text.match(/<td>3MB<\/td>/));

        let downloadUrl = "";
        if (this.downloadMethod === NDCDownloadButton.DOWNLOAD_METHOD_VORTEX) {
            // Try the new website version regex first
            let downloadUrlMatch = text.match(/const downloadUrl = '([^']+)'/);
            if (!downloadUrlMatch) {
                // Fallback to the old website version regex
                downloadUrlMatch = text.match(/id="slowDownloadButton".*?data-download-url="([^"]+)"/);
            }
            downloadUrl = downloadUrlMatch ? downloadUrlMatch[1].replaceAll('&amp;', '&') : "";
        } else {
            const generateDownloadUrlResponse = await fetch(
                "https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl",
                {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    body: `fid=${mod.fileId}&game_id=${mod.file.mod.game.id}`,
                    method: "POST",
                },
            );

            const fileLink = await generateDownloadUrlResponse.json();
            downloadUrl = fileLink?.url || "";
        }

        return { downloadUrl, text };
    }

    bypassNexusAdsCookie() {
        const now = Math.round(Date.now() / 1000);
        const expirySeconds = 5 * 60; // 5 minutes in seconds
        const expiryTimestamp = now + expirySeconds;

        // Set expiry date for the cookie
        const expiryDate = new Date(Date.now() + expirySeconds * 1000).toUTCString();

        // Create and set the cookie
        document.cookie = `ab=0|${expiryTimestamp};expires=${expiryDate};domain=nexusmods.com;path=/`;
    }

    async downloadMods(mods, type = null) {
        this.startDownload(mods.length);

        let history = null;
        if (type !== null) {
            history = await GM.getValue("history", {}); // {"gameId": {"collectionId": {"type": []}}}
            // get history for this collection (index is the collectionId)
            history[this.gameId] ??= {};
            history[this.gameId][this.collectionId] ??= {};
            history[this.gameId][this.collectionId][type] ??= [];

            if (history[this.gameId][this.collectionId][type].length) {
                const confirm = await Promise.resolve(
                    window.confirm(
                        `You already downloaded ${history[this.gameId][this.collectionId][type].length
                        } out of ${mods.length
                        } mods from this collection.\nDo you want to skip the already downloaded mods ?\nCancel will clear the history and download all mods again.`,
                    ),
                );

                if (!confirm) {
                    history[this.gameId][this.collectionId][type] = [];
                    await GM.setValue("history", history);
                }
            }
        }

        const lauchedDownload = await GM.getValue("lauchedDownload", {
            count: 0,
            date: new Date().getTime(),
        });
        const failedDownload = [];
        let forceStop = false;

        for (const [index, mod] of mods.entries()) {
            const modNumber = `${(index + 1)
                .toString()
                .padStart(mods.length.toString().length, "0")}/${mods.length}`;

            if (lauchedDownload.date < new Date().getTime() - 1000 * 60 * 5) {
                // 5 minutes
                lauchedDownload.count = 0;
                await GM.setValue("lauchedDownload", lauchedDownload);
            }

            if (
                history?.[this.gameId][this.collectionId][type].includes(mod.fileId)
            ) {
                this.console.log(
                    `[${modNumber}] Already downloaded <a href="${mod.file.url}" target="_blank" class="text-primary-moderate">${mod.file.name}</a>`,
                );
                this.progressBar.incrementProgress();
                continue;
            }

            if (this.progressBar.skipTo) {
                if (this.progressBar.skipToIndex - 1 > index) {
                    this.console.log(
                        `[${modNumber}] Skipping <a href="${mod.file.url}" target="_blank" class="text-primary-moderate">${mod.file.name}</a>`,
                    );
                    this.progressBar.incrementProgress();
                    if (this.progressBar.skipToIndex - 1 === index + 1) {
                        // if skip to index is the next index
                        this.progressBar.skipTo = false;
                    }
                    continue;
                }
                this.progressBar.skipTo = false;
            }

            if (this.progressBar.status === NDCProgressBar.STATUS_STOPPED) {
                this.console.log("Download stopped.", NDCLogConsole.TYPE_INFO);
                break;
            }

            const { downloadUrl, text } = await this.fetchDownloadLink(mod);

            if (downloadUrl === "") {
                const logRow = this.console.log(
                    `
                [${modNumber}] Failed to get download link for
                <a href="${mod.file.url}" target="_blank" class="text-primary-moderate">${mod.file.name}</a>
                <button class="text-primary-moderate" title="Copy response to clipboard">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1rem; height: 1rem;">
                        <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" style="fill: currentcolor;"></path>
                    </svg>
                </button>
                `,
                    NDCLogConsole.TYPE_ERROR,
                );
                logRow.querySelector("button").addEventListener("click", () => {
                    navigator.clipboard.writeText(text);
                    alert("Response copied to clipboard");
                });

                // check if find .replaced-login-link in the html it is because the user is not connect on nexusmods
                if (text.match(/class="replaced-login-link"/)) {
                    this.console.log(
                        'You are not connected on NexusMods. <a href="https://users.nexusmods.com/auth/continue?client_id=nexus&redirect_uri=https://www.nexusmods.com/oauth/callback&response_type=code&referrer=https%3A%2F%2Fwww.nexusmods.com%2F" target="_blank" class="text-primary-moderate">Login</a> and try again.',
                        NDCLogConsole.TYPE_ERROR,
                    );
                    forceStop = true;
                } else if (text.match(/Just a moment.../)) {
                    this.console.log(
                        `You are rate limited by Cloudflare. Click on the link to solve the captcha and try again. <a href="${mod.file.url}" target="_blank" class="text-primary-moderate">Solve captcha</a>`,
                        NDCLogConsole.TYPE_ERROR,
                    );
                    forceStop = true;
                } else if (
                    text.match(/Your access to Nexus Mods has been temporarily suspended/)
                ) {
                    this.console.log(
                        "Du to too many requests, Nexus mods temporarily suspended your account for 10 minutes, try again later.",
                        NDCLogConsole.TYPE_ERROR,
                    );
                    forceStop = true;
                } else {
                    failedDownload.push(mod);
                }
            } else {
                if (this.downloadMethod === NDCDownloadButton.DOWNLOAD_METHOD_VORTEX) {
                    this.console.log(
                        `[${modNumber}] Sending download link to Vortex <a href="${mod.file.url
                        }" target="_blank" class="text-primary-moderate" title="Nexus mod page">${mod.file.name
                        }</a><span class="text-xs text-neutral-subdued ml-1">(${convertSize(
                            mod.file.size,
                        )})</span>`,
                    );
                    document.location.href = downloadUrl;
                } else {
                    this.console.log(
                        `[${modNumber}] Downloading <a href="${mod.file.url
                        }" target="_blank" class="text-primary-moderate" title="Nexus mod page">${mod.file.name
                        }</a><a href="${downloadUrl}"><svg class="fill-current inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1.3rem; height: 1.3rem;"><title>Download link</title><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" style="fill: currentcolor;" /></svg></a><span class="text-xs text-neutral-subdued">(${convertSize(
                            mod.file.size,
                        )})</span>`,
                    );
                    const downloadLink = document.createElement("a");
                    downloadLink.href = downloadUrl;
                    downloadLink.download = mod.file.name;
                    downloadLink.click();
                }
                this.progressBar.incrementProgress();

                if (history) {
                    history[this.gameId][this.collectionId][type] = [
                        ...new Set([
                            ...history[this.gameId][this.collectionId][type],
                            mod.fileId,
                        ]),
                    ]; // remove duplicate and update history
                    await GM.setValue("history", history);
                }

                lauchedDownload.count++;
                lauchedDownload.date = new Date().getTime();
                await GM.setValue("lauchedDownload", lauchedDownload);
            }

            if (forceStop) {
                this.console.log(
                    "Download forced to stop due to an error.",
                    NDCLogConsole.TYPE_ERROR,
                );
                break;
            }

            if (index < mods.length - 1) {
                if (lauchedDownload.count >= 200) {
                    // 200 is a safe number of downloads to avoid Nexus bans
                    let remainingTime = 5 * 60; // 5 minutes

                    this.console.log(
                        "Started the download of 200 mods. Waiting 5 minutes before continuing to avoid the temporary 10 minutes ban from Nexus.",
                        NDCLogConsole.TYPE_INFO,
                    );
                    let logRow = null;
                    await new Promise((resolve) => {
                        const intervalId = setInterval(async () => {
                            remainingTime--;
                            const minutes = Math.floor(remainingTime / 60);
                            const seconds = remainingTime % 60;

                            const logMessage = `Waiting for ${minutes} minutes and ${seconds} seconds before continuing...`;
                            if (!logRow) {
                                logRow = this.console.log(logMessage, NDCLogConsole.TYPE_INFO);
                            } else {
                                logRow.innerHTML = logMessage;
                            }

                            if (remainingTime <= 0) {
                                logRow.remove();
                                clearInterval(intervalId);
                                lauchedDownload.count = 0;
                                await GM.setValue("lauchedDownload", lauchedDownload);
                                return resolve();
                            }
                        }, 1000);
                    });
                }

                const pause =
                    this.pauseBetweenDownload === 0
                        ? 0
                        : Math.round(mod.file.size / 1024 / this.downloadSpeed) + this.pauseBetweenDownload;
                let logRow = null;
                const startDateTime = new Date().getTime();
                await new Promise((resolve) => {
                    const intervalId = setInterval(async () => {
                        const remainingTime = Math.max(
                            0,
                            Math.round(
                                (startDateTime + pause * 1000 - new Date().getTime()) / 1000,
                            ),
                        );
                        const minutes = Math.max(0, Math.floor(remainingTime / 60));
                        const seconds = Math.max(0, remainingTime % 60);

                        const logMessage = `Waiting ${minutes} minutes and ${seconds} seconds before starting the next download...`;
                        if (!logRow) {
                            logRow = this.console.log(logMessage, NDCLogConsole.TYPE_INFO);
                        } else {
                            logRow.innerHTML = logMessage;
                        }

                        const shouldClearInterval = () => {
                            clearInterval(intervalId);
                            logRow.remove();
                            return resolve();
                        };

                        if (
                            this.progressBar.skipPause ||
                            this.progressBar.skipTo ||
                            this.progressBar.status === NDCProgressBar.STATUS_STOPPED
                        ) {
                            if (this.progressBar.skipPause) {
                                this.progressBar.skipPause = false;
                            }
                            return shouldClearInterval();
                        }

                        if (this.progressBar.status === NDCProgressBar.STATUS_PAUSED) {
                            return;
                        }

                        if (new Date().getTime() >= startDateTime + pause * 1000) {
                            return shouldClearInterval();
                        }
                    }, 100);
                });
            }

            if (history && this.progressBar.progress === this.progressBar.modsCount) {
                history[this.gameId][this.collectionId][type] = [];
                await GM.setValue("history", history);
            }
        }

        if (failedDownload.length) {
            this.console.log(
                `Failed to download ${failedDownload.length} mods:`,
                NDCLogConsole.TYPE_INFO,
            );
            for (const mod of failedDownload) {
                this.console.log(
                    `<a href="${mod.file.url}" target="_blank" class="text-primary-moderate">${mod.file.name}</a>`,
                    NDCLogConsole.TYPE_INFO,
                );
            }
        }

        this.endDownload();
    }

    startDownload(modsCount) {
        this.progressBar.setModsCount(modsCount);
        this.progressBar.setProgress(0);
        this.progressBar.setStatus(NDCProgressBar.STATUS_DOWNLOADING);
        this.downloadButton.element.style.display = "none";
        this.progressBar.element.style.display = "";
        this.console.log("Download started.", NDCLogConsole.TYPE_INFO);
    }

    endDownload() {
        this.progressBar.setStatus(NDCProgressBar.STATUS_FINISHED);
        this.progressBar.element.style.display = "none";
        this.downloadButton.element.style.display = "";
        this.console.log("Download finished.", NDCLogConsole.TYPE_INFO);
    }
}

class NDCDownloadButton {
    static DOWNLOAD_METHOD_VORTEX = 0;
    static DOWNLOAD_METHOD_BROWSER = 1;

    constructor(ndc) {
        this.element = document.createElement("div");
        this.element.classList.add("flex", "flex-col", "gap-3", "w-100");

        this.ndc = ndc;

        this.html = `
            <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="flex gap-3 items-center justify-center sm:justify-start min-h-9">
                    <label>
                        <input type="radio" name="downloadOption" value="${NDCDownloadButton.DOWNLOAD_METHOD_VORTEX}" style="accent-color: rgb(217 143 64 / var(--tw-bg-opacity));">
                        Send mods to Vortex <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1.5rem; height: 1.5rem; display: inline;"><path d="M6.82716996,18.9983338 C6.92271658,19.1323182 7.13124159,19.3870605 7.48682198,19.5652215 C7.80714577,19.7257911 8.09889731,19.7498634 8.25774852,19.7513183 L8.25774852,19.7513183 L6.32348571,19.9618841 Z M7.10728661,17.6493632 L7.12127704,17.6694963 C7.24327452,17.839272 8.17282479,19.0207325 10.2887245,18.8255975 C10.2887245,18.8255975 9.23458567,19.7058616 8.0099284,19.0357429 C6.93541906,18.4476258 7.10728661,17.6493632 7.10728661,17.6493632 Z M6.51691196,15.9149726 C6.51691196,15.9149726 8.0809107,17.2786428 10.7864389,17.2786428 C12.5723501,17.2786428 12.8771507,17.0036498 12.8986773,16.9816504 C12.8977244,16.9809251 12.5565655,18.1324747 10.1941859,18.1311384 C7.82729647,18.1297998 6.51691196,16.4689469 6.51691196,15.9149726 Z M16.0060914,13.7951618 C16.0060914,13.7951618 17.1543308,16.3003927 11.0311436,16.3003927 C6.22617683,16.3003927 5.16292799,13.9625877 5.16292799,13.9625877 L5.17928385,13.9751765 C5.35980954,14.110911 7.04480011,15.2985885 10.7334766,15.2985885 C14.6457093,15.2985885 16.0060914,13.7951618 16.0060914,13.7951618 Z M20.393915,9.55554019 C20.5500161,9.78343345 20.6387402,10.0320322 20.6370307,10.3057165 C20.6205951,12.124748 15.7545104,14.3252387 10.0141262,14.2761295 C4.27427563,14.2272857 3.22866514,12.1879263 3.22866514,12.1879263 C3.22866514,12.1879263 5.34710376,13.0940576 8.40841962,13.1203377 C11.6100931,13.1475468 17.7197832,12.0655515 18.5774052,10.3501802 C19.2683861,10.0895032 19.8709096,9.82351716 20.393915,9.55554019 Z M13.360546,7.62892265 C14.6921867,7.64024369 16.0636674,7.76091566 17.2520707,8.00290278 C16.8188944,8.16988805 16.3123007,8.33957494 15.7249611,8.51029099 C13.2445231,8.09193392 9.67022745,8.05285342 6.96092454,8.66417021 L6.95848503,8.75824697 L7.67746967,9.65189519 C7.05977332,9.39717416 6.1544367,9.25740183 5.4530674,9.22877646 C6.00401086,8.80923589 6.65276589,8.18395049 6.99835133,7.62843944 L6.99835133,7.62843944 L6.96256338,8.6254081 C8.26123861,8.25323215 10.878487,7.60829052 13.360546,7.62892265 Z M12.7006224,9.66144776 C4.21471194,11.3941736 2.67951807,9.65612203 2.56962321,9.1002491 C2.45932824,8.54410986 3.92410405,6.45775566 11.3594784,5.03791639 C18.7943192,3.61847655 20.9688771,4.89305657 21.0790387,5.44906264 C21.1892003,6.00466929 21.1866663,7.92898821 12.7006224,9.66144776 M22.9109754,5.25427412 C22.7215935,4.29990353 19.9767559,1.91837081 11.1782318,3.57320786 C2.37984118,5.2280449 0.83024361,8.6186701 1.01882533,9.57277437 C1.20794052,10.5268786 3.23019268,13.6297813 13.2610329,11.5504837 C23.2898726,9.52710626 23.0858203,6.54057074 22.9109754,5.25427412" style="fill: currentcolor;"></path></svg>
                    </label>
                    <label>
                        <input type="radio" name="downloadOption" value="${NDCDownloadButton.DOWNLOAD_METHOD_BROWSER}" style="accent-color: rgb(217 143 64 / var(--tw-bg-opacity));">
                        Download mods via browser <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1.5rem; height: 1.5rem; display: inline;"><title>download-circle-outline</title><path d="M8 17V15H16V17H8M16 10L12 14L8 10H10.5V6H13.5V10H16M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" style="fill: currentcolor;"/></svg>
                    </label>
                </div>
                <div class="flex">
                    <button id="importDownloadedModsBtn" class="grow font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded-l px-2 py-1 cursor-pointer bg-surface-mid border border-neutral-moderate fill-neutral-moderate text-neutral-moderate aria-expanded:bg-surface-high focus:border-neutral-moderate focus:bg-surface-high hover:border-neutral-moderate hover:bg-surface-high">
                        Import downloaded mods
                    </button>
                    <button id="importDownloadedModsBtnInfo" class="flex-none font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded-r px-2 py-1 cursor-pointer bg-surface-mid border-r border-y border-neutral-moderate fill-neutral-moderate text-neutral-moderate aria-expanded:bg-surface-high focus:border-neutral-moderate focus:bg-surface-high hover:border-neutral-moderate hover:bg-surface-high">
                        <svg id="extraPauseInfo" class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1.5rem; height: 1.5rem; cursor: pointer;"><title>information</title><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" style="fill: currentcolor;"/></svg>
                    </button>
                </div>
            </div>
            <div class="flex w-100">
                <button class="w-full font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between rounded-l" id="mainBtn">
                    download all mods
                    <span class="p-2 bg-surface-low rounded-full text-xs text-white whitespace-nowrap" id="mainModsCount"></span>
                </button>
                <div class="relative">
                    <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between rounded-r" id="menuBtn">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" style="fill: currentcolor;"></path></svg>
                    </button>
                    <div class="absolute top-0 right-0 bottom-auto left-auto z-10 min-w-48 py-1 px-0 m-0 text-base text-gray-600 border-stroke-subdued bg-surface-low border border-gray-200 rounded-md shadow-lg outline-none hidden" style="transform: translate3d(0px, 38px, 0px);" id="otherOptionMenu">
                        <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="menuBtnMandatory" style="height: 44px;">
                            download all mandatory mods
                            <span class="p-2 bg-primary-moderate rounded-full text-xs text-white whitespace-nowrap" id="menuBtnMandatoryModsCount"></span>
                        </button>
                        <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="menuBtnOptional" style="height: 44px;">
                            download all optional mods
                            <span class="p-2 bg-primary-moderate rounded-full text-xs text-white whitespace-nowrap" id="menuBtnOptionalModsCount"></span>
                        </button>
                        <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="menuBtnSelect" style="height: 44px;">
                            select mods to download
                        </button>
                        <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="menuBtnUpdate" style="height: 44px;">
                            update collection
                        </button>
                    </div>
                </div>

            </div>
        `;

        this.element.innerHTML = this.html;

        this.downloadMethods = this.element.querySelectorAll(
            'input[name="downloadOption"]',
        );
        this.importDownloadedModsBtn = this.element.querySelector(
            "#importDownloadedModsBtn",
        );
        this.importDownloadedModsBtnInfo = this.element.querySelector(
            "#importDownloadedModsBtnInfo",
        );

        this.allBtn = this.element.querySelector("#mainBtn");
        this.modsCount = this.element.querySelector("#mainModsCount");
        this.mandatoryBtn = this.element.querySelector("#menuBtnMandatory");
        this.mandatoryModsCount = this.element.querySelector(
            "#menuBtnMandatoryModsCount",
        );
        this.optionalBtn = this.element.querySelector("#menuBtnOptional");
        this.optionalModsCount = this.element.querySelector(
            "#menuBtnOptionalModsCount",
        );
        this.selectBtn = this.element.querySelector("#menuBtnSelect");
        this.updateBtn = this.element.querySelector("#menuBtnUpdate");

        const menuBtn = this.element.querySelector("#menuBtn");
        const otherOptionMenu = this.element.querySelector("#otherOptionMenu");

        for (const option of this.downloadMethods) {
            option.addEventListener("change", async () => {
                this.ndc.downloadMethod = Number.parseInt(option.value);
                await GM.setValue("downloadMethod", this.ndc.downloadMethod);
            });
        }

        this.importDownloadedModsBtn.addEventListener("click", () => {
            // create a temporary input element to select a folder
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;

            input.addEventListener("change", async () => {
                const files = input.files;
                // File name containe at the end information (ex: 10 Male Face Presets-54364-1-1631230510.zip, 54364 is mod.file.mod.modId, 1 is mod.file.version, 1631230510 is mod.file.date)
                const downloadedMods = this.ndc.mods.all.filter((mod) => {
                    for (const file of files) {
                        // if (file.name.includes(`${mod.file.name}-${mod.file.mod.modId}-${mod.file.version.replace(/\./g, '-')}-${mod.file.date}`)) {
                        if (file.name.includes(mod.file.uri)) {
                            return true;
                        }
                    }
                    return false;
                });
                const notMatchedFiles = [...files].filter(
                    (file) =>
                        !downloadedMods.some((mod) => file.name.includes(mod.file.uri)),
                );

                // get the file id of the downloaded mods
                const downloadedModsFileIds = downloadedMods.map((mod) => mod.fileId);
                // update the history with the downloaded mods
                console.log(downloadedModsFileIds);
                const history = await GM.getValue("history", {});

                if (history[this.ndc.gameId] == null) {
                    history[this.ndc.gameId] = {};
                }
                const gameHistory = history[this.ndc.gameId];

                if (gameHistory[this.ndc.collectionId] == null) {
                    gameHistory[this.ndc.collectionId] = {};
                }
                const collectionHistory = gameHistory[this.ndc.collectionId];

                collectionHistory.all = [...new Set(downloadedModsFileIds)];
                collectionHistory.mandatory = [
                    ...new Set(
                        downloadedMods
                            .filter((mod) => !mod.optional)
                            .map((mod) => mod.fileId),
                    ),
                ];
                collectionHistory.optional = [
                    ...new Set(
                        downloadedMods
                            .filter((mod) => mod.optional)
                            .map((mod) => mod.fileId),
                    ),
                ];

                await GM.setValue("history", history);

                alert(
                    `Imported ${downloadedMods.length
                    } mods to the history.\n\n${downloadedMods
                        .map((mod) => mod.file.name)
                        .join("\n")}`,
                );
                if (notMatchedFiles.length) {
                    alert(
                        `The following files are not matched with any mods:\n\n${notMatchedFiles
                            .map((file) => file.name)
                            .join("\n")}`,
                    );
                }
            });

            input.click();
        });

        this.importDownloadedModsBtnInfo.addEventListener("click", () => {
            alert(
                `Importing downloaded mods will allow you to skip the download of mods you already have. \nSelect all the files of the folder where your mods are located and the script will automatically add them to the history so when you start a new download you will be asked if you want to skip the already downloaded mods.\n\nDefault Vortex download path :\n C:\\Users\\YourName\\AppData\\Roaming\\Vortex\\downloads\\${this.ndc.gameId}`,
            );
        });

        menuBtn.addEventListener("click", () => {
            otherOptionMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", (event) => {
            const isClickInside =
                // otherOptionMenu.contains(event.target) ||
                menuBtn.contains(event.target);
            if (!isClickInside) {
                otherOptionMenu.classList.add("hidden");
            }
        });

        this.allBtn.addEventListener("click", () =>
            this.ndc.downloadMods(this.ndc.mods.all, "all"),
        );
        this.mandatoryBtn.addEventListener("click", () =>
            this.ndc.downloadMods(this.ndc.mods.mandatory, "mandatory"),
        );
        this.optionalBtn.addEventListener("click", () =>
            this.ndc.downloadMods(this.ndc.mods.optional, "optional"),
        );
        this.selectBtn.addEventListener("click", () => {
            const selectModsModal = new NDCSelectModsModal(this.ndc);
            document.body.appendChild(selectModsModal.element);
            selectModsModal.render();
        });
        this.updateBtn.addEventListener("click", () => {
            const updateModsModal = new NDCUpdateModsModal(this.ndc);
            document.body.appendChild(updateModsModal.element);
            updateModsModal.render();
        });
    }

    updateDownloadMethod() {
        for (const option of this.downloadMethods) {
            if (Number.parseInt(option.value) === this.ndc.downloadMethod) {
                option.checked = true;
            }
        }
    }

    updateModsCount() {
        this.modsCount.innerHTML = `${this.ndc.mods.mandatory.length + this.ndc.mods.optional.length
            } mods`;
    }

    updateMandatoryModsCount() {
        this.mandatoryModsCount.innerHTML = `${this.ndc.mods.mandatory.length} mods`;
    }

    updateOptionalModsCount() {
        this.optionalModsCount.innerHTML = `${this.ndc.mods.optional.length} mods`;
    }

    render() {
        this.updateDownloadMethod();
        this.updateModsCount();
        this.updateMandatoryModsCount();
        this.updateOptionalModsCount();
    }
}

class NDCSelectModsModal {
    constructor(ndc) {
        this.element = document.createElement("div");
        this.element.classList.add(
            "fixed",
            "top-0",
            "left-0",
            "w-full",
            "h-full",
            "z-50",
            "flex",
            "justify-center",
            "items-center",
            "bg-black/25",
            "backdrop-brightness-50",
        );

        this.ndc = ndc;

        this.html = `
            <div class="bg-surface-mid p-4 rounded-lg flex flex-col" style="max-width: 850px; width: 100%; height: calc(100vh - 3.5rem);">
                <div class="flex justify-between items-center gap-2 mb-2">
                    <h2 class="font-montserrat font-semibold text-lg leading-none tracking-wider uppercase">Select mods</h2>
                    <div class="flex gap-2">
                        <div class="flex items-center">
                            <span class="p-2 py-1 bg-primary-moderate rounded-full text-xs text-white whitespace-nowrap" id="selectedModsCount">0 mods selected</span>
                        </div>
                        <div class="relative">
                            <button type="button" class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded p-1 cursor-pointer bg-surface-mid border border-neutral-moderate fill-neutral-moderate text-neutral-moderate aria-expanded:bg-surface-high focus:border-neutral-moderate focus:bg-surface-high hover:border-neutral-moderate hover:bg-surface-high" id="openSelectModsOptionMenu">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem; fill: currentcolor;"><title>Options</title><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg>
                            </button>
                            <div class="absolute top-0 right-0 bottom-auto left-auto z-10 min-w-48 py-1 px-0 m-0 text-base text-gray-600 border-stroke-subdued bg-surface-low border border-gray-200 rounded-md shadow-lg outline-none hidden" style="transform: translate3d(0px, 38px, 0px);" id="selectModsOptionMenu">
                                <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" style="height: 44px;" id="selectModsSelectAll">
                                    Select all
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Check all mods</title><path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" style="fill: currentcolor;"/></svg>
                                </button>
                                <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" style="height: 44px;" id="selectModsDeselectAll">
								Deselect all
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Clear selection</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style="fill: currentcolor;"/></svg>
                                </button>
								<button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" style="height: 44px;" id="selectModsInvertSelection">
                                    Invert selection
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Invert selection</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M6.5 9L10 5.5L13.5 9H11V13H9V9H6.5M17.5 15L14 18.5L10.5 15H13V11H15V15H17.5Z" style="fill: currentcolor;"/></svg>
                                </button>
                                <div class="border-t border-stroke-subdued"></div>
                                <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="exportModsSelection" style="height: 44px;">
                                    Export mods selection
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Export</title><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" style="fill: currentcolor;"/></svg>
                                </button>
                                <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="importModsSelection" style="height: 44px;">
                                    Import mods selection
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Import</title><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" style="fill: currentcolor;"/></svg>
                                </button>
                                <div class="border-t border-stroke-subdued"></div>
                                <button class="whitespace-nowrap font-montserrat text-sm font-semibold uppercase leading-none tracking-wider first:rounded-t last:rounded-b relative flex w-full items-center gap-x-2 p-2 text-left font-normal hover:bg-surface-mid hover:text-primary-moderate focus:shadow-accent focus:z-10 focus:outline-none text-start justify-between" id="selectModsImportDownloadedMods" style="height: 44px;">
                                    Import downloaded mods
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;"><title>Import</title><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" style="fill: currentcolor;"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-center gap-2 mb-2">
                    <input type="search" id="searchMods" class="p-1 border border-stroke-subdued rounded flex-initial text-black w-full h-full sm:w-52" placeholder="Search mods...">
                    <select id="sortMods" class="p-1 border border-stroke-subdued rounded flex-initial text-black w-full h-full sm:w-52">
                        <option value="mod_name_asc">Order by mod name ASC</option>
                        <option value="mod_name_desc">Order by mod name DESC</option>
                        <option value="file_name_asc">Order by file name ASC</option>
                        <option value="file_name_desc">Order by file name DESC</option>
                        <option value="size_asc">Order by size ASC</option>
                        <option value="size_desc">Order by size DESC</option>
                    </select>
                </div>
                <div class="block mb-2 h-full overflow-auto">
                    <div class="hidden sm:flex gap-2 border border-stroke-subdued rounded-lg sm:rounded-none p-2 cursor-pointer select-none">
                        <span class="flex-none w-12 font-montserrat font-semibold text-sm uppercase text-neutral-subdued mod-list-index">Index</span>
                        <span class="flex-1 font-montserrat font-semibold text-sm uppercase text-neutral-subdued">Mod name</span>
                        <span class="flex-1 font-montserrat font-semibold text-sm uppercase text-neutral-subdued">File name</span>
                        <span class="flex-none w-20 font-montserrat font-semibold text-sm uppercase text-neutral-subdued">Size</span>
                        <div class="flex-none w-28 font-montserrat font-semibold text-sm uppercase text-neutral-subdued">Requirement</div>
                    </div>
                    <div id="modsListMobile" class="flex flex-col gap-2 sm:gap-0"></div>
                </div>
                <div class="flex justify-end gap-2">
                    <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded px-2 py-1 cursor-pointer bg-surface-mid border border-neutral-moderate fill-neutral-moderate text-neutral-moderate aria-expanded:bg-surface-high focus:border-neutral-moderate focus:bg-surface-high hover:border-neutral-moderate hover:bg-surface-high" id="cancelSelectModsBtn">Cancel</button>
                    <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued rounded" id="selectModsBtn">Download selected mods</button>
                </div>
            </div>
        `;
        this.element.innerHTML = this.html;

        this.searchMods = this.element.querySelector("#searchMods");
        this.sortMods = this.element.querySelector("#sortMods");

        this.selectModsSelectAll = this.element.querySelector(
            "#selectModsSelectAll",
        );
        this.selectModsInvertSelection = this.element.querySelector(
            "#selectModsInvertSelection",
        );
        this.selectModsDeselectAll = this.element.querySelector(
            "#selectModsDeselectAll",
        );

        this.modsListMobile = this.element.querySelector("#modsListMobile");
        this.selectedModsCount = this.element.querySelector("#selectedModsCount");

        this.openSelectModsOptionMenu = this.element.querySelector(
            "#openSelectModsOptionMenu",
        );
        this.selectModsOptionMenu = this.element.querySelector(
            "#selectModsOptionMenu",
        );
        this.exportModsSelection = this.element.querySelector(
            "#exportModsSelection",
        );
        this.importModsSelection = this.element.querySelector(
            "#importModsSelection",
        );
        this.selectModsImportDownloadedMods = this.element.querySelector(
            "#selectModsImportDownloadedMods",
        );

        this.selectModsBtn = this.element.querySelector("#selectModsBtn");
        this.cancelSelectModsBtn = this.element.querySelector(
            "#cancelSelectModsBtn",
        );

        this.openSelectModsOptionMenu.addEventListener("click", () => {
            this.selectModsOptionMenu.classList.toggle("hidden");
        });

        this.selectModsBtn.addEventListener("click", () => {
            const selectedMods = [];
            for (const mod of this.ndc.mods.all) {
                const checkbox = this.element.querySelector(`#mod_${mod.file.fileId}`);
                if (checkbox.checked) {
                    selectedMods.push(mod);
                }
            }
            this.element.remove();
            this.ndc.downloadMods(selectedMods);
        });

        this.cancelSelectModsBtn.addEventListener("click", () => {
            this.element.remove();
        });

        document.addEventListener("click", (event) => {
            const isClickInside = this.openSelectModsOptionMenu.contains(
                event.target,
            );
            // if the click on an option, close the menu
            if (!isClickInside) {
                this.selectModsOptionMenu.classList.add("hidden");
            }
        });
    }

    updateModList(mods) {
        this.modsListMobile.innerHTML = "";
        for (const [index, mod] of mods.entries()) {
            const modElementMobile = document.createElement("div");
            modElementMobile.classList.add(
                "border",
                "border-stroke-subdued",
                "rounded-lg",
                "sm:rounded-none",
                "p-2",
                "cursor-pointer",
                "select-none",
            );
            modElementMobile.innerHTML = `
                <input type="checkbox" id="mod_${mod.file.fileId}" class="hidden">
                <div class="hidden sm:flex gap-2">
                    <span class="flex-none w-12 text-primary-strong mod-list-index">#${index + 1
                }</span>
                    <span class="flex-1 text-white">${mod.file.mod.name}</span>
                    <span class="flex-1 text-white">${mod.file.name}</span>
                    <span class="flex-none w-20 text-white">${convertSize(
                    mod.file.size,
                )}</span>
                    <div class="flex-none w-28 text-center">
                        <span class="p-2 py-1 ${mod.optional
                    ? "bg-surface-mid border border-neutral-moderate"
                    : "bg-primary-moderate"
                } rounded-full text-xs text-white whitespace-nowrap">${mod.optional ? "Optional" : "Mandatory"
                }</span>
                    </div>
                </div>
                <div class="block sm:hidden">
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex gap-2 items-center">
                            <span class="text-primary-strong mod-list-index">#${index + 1
                }</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-white">
                            ${convertSize(mod.file.size)}</span>
                            <span class="p-2 py-1 ${mod.optional
                    ? "bg-surface-mid border border-neutral-moderate"
                    : "bg-primary-moderate"
                } rounded-full text-xs text-white whitespace-nowrap">${mod.optional ? "Optional" : "Mandatory"
                }</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="text-white">${mod.file.mod.name}</div>
                        <div class="text-white">${mod.file.name}</div>
                    </div>
                </div>
            `;
            modElementMobile.addEventListener("click", (event) => {
                // if check change color, if shiftkey is pressed, select all between the last checked and this one
                const checkbox = modElementMobile.querySelector(
                    'input[type="checkbox"]',
                );
                checkbox.checked = !checkbox.checked;
                const modElement = checkbox.parentNode;
                modElement.classList.toggle("bg-primary-subdued");
                modElement
                    .querySelector(".mod-list-index")
                    .classList.toggle("text-white");

                // if shift key is pressed and there is a last checked element
                if (event.shiftKey && modElement.parentNode.dataset.lastChecked) {
                    const start = Array.from(modElement.parentNode.children).indexOf(
                        modElement,
                    );
                    const end = modElement.parentNode.dataset.lastChecked;
                    const checkedState = modElement.parentNode.children[
                        end
                    ].querySelector('input[type="checkbox"]').checked;

                    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                        const modEl = modElement.parentNode.children[i];
                        const checkboxEl = modEl.querySelector('input[type="checkbox"]');
                        checkboxEl.checked = checkedState;
                        modEl.classList.toggle("bg-primary-subdued", checkedState);
                        modEl
                            .querySelector(".mod-list-index")
                            .classList.toggle("text-white", checkedState);
                    }
                }

                // get the index of the element, and store it to the parent
                const index = Array.from(modElement.parentNode.children).indexOf(
                    modElement,
                );
                modElement.parentNode.dataset.lastChecked = index;

                this.selectedModsCount.firstChild.textContent = `${this.element.querySelectorAll('input[type="checkbox"]:checked').length
                    } mods selected`;
            });
            this.modsListMobile.appendChild(modElementMobile);
        }
    }

    render() {
        this.updateModList(this.ndc.mods.all);

        // close the modal when clicking outside of it
        this.element.addEventListener("click", (event) => {
            if (event.target === this.element) {
                this.element.remove();
            }
        });

        // searchMods
        this.searchMods.addEventListener("input", () => {
            const search = this.searchMods.value.toLowerCase();
            for (const mod of this.ndc.mods.all) {
                const modElement = this.element.querySelector(
                    `#mod_${mod.file.fileId}`,
                ).parentNode;
                if (
                    mod.file.mod.name.toLowerCase().includes(search) ||
                    mod.file.name.toLowerCase().includes(search)
                ) {
                    modElement.style.display = "";
                } else {
                    modElement.style.display = "none";
                }
            }
        });

        // sortMods
        this.sortMods.addEventListener("change", () => {
            const sort = this.sortMods.value;
            const mods = [...this.ndc.mods.all];
            switch (sort) {
                case "mod_name_asc":
                    mods.sort((a, b) => a.file.mod.name.localeCompare(b.file.mod.name));
                    break;
                case "mod_name_desc":
                    mods.sort((a, b) => b.file.mod.name.localeCompare(a.file.mod.name));
                    break;
                case "file_name_asc":
                    mods.sort((a, b) => a.file.name.localeCompare(b.file.name));
                    break;
                case "file_name_desc":
                    mods.sort((a, b) => b.file.name.localeCompare(a.file.name));
                    break;
                case "size_asc":
                    mods.sort((a, b) => a.file.size - b.file.size);
                    break;
                case "size_desc":
                    mods.sort((a, b) => b.file.size - a.file.size);
                    break;
            }
            this.updateModList(mods);
        });

        this.selectModsSelectAll.addEventListener("click", () => {
            for (const mod of this.ndc.mods.all) {
                const checkbox = this.element.querySelector(`#mod_${mod.file.fileId}`);
                checkbox.checked = true;
                const modElement = checkbox.parentNode;
                modElement.classList.add("bg-primary-subdued");
                modElement.querySelector(".mod-list-index").classList.add("text-white");
            }
            this.selectedModsCount.firstChild.textContent = `${this.ndc.mods.all.length} mods selected`;
        });

        this.selectModsInvertSelection.addEventListener("click", () => {
            for (const mod of this.ndc.mods.all) {
                const checkbox = this.element.querySelector(`#mod_${mod.file.fileId}`);
                checkbox.checked = !checkbox.checked;
                const modElement = checkbox.parentNode;
                modElement.classList.toggle("bg-primary-subdued");
                modElement
                    .querySelector(".mod-list-index")
                    .classList.toggle("text-white");
            }
            this.selectedModsCount.firstChild.textContent =
                `${this.element.querySelectorAll('input[type="checkbox"]:checked').length} mods selected`;
        });

        this.selectModsDeselectAll.addEventListener("click", () => {
            for (const mod of this.ndc.mods.all) {
                const checkbox = this.element.querySelector(`#mod_${mod.file.fileId}`);
                checkbox.checked = false;
                const modElement = checkbox.parentNode;
                modElement.classList.remove("bg-primary-subdued");
                modElement
                    .querySelector(".mod-list-index")
                    .classList.remove("text-white");
            }
            this.selectedModsCount.firstChild.textContent = "0 mods selected";
        });

        this.exportModsSelection.addEventListener("click", () => {
            if (!this.element.querySelector('input[type="checkbox"]:checked')) {
                alert("You must select at least one mod to export.");
                return;
            }

            const selectedMods = [];
            for (const mod of this.ndc.mods.all) {
                const checkbox = this.element.querySelector(`#mod_${mod.file.fileId}`);
                if (checkbox.checked) {
                    selectedMods.push(mod);
                }
            }
            const selectedModsText = JSON.stringify(selectedMods, null, 2);
            const blob = new Blob([selectedModsText], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ndc_selected_mods_${this.ndc.gameId}_${this.ndc.collectionId
                }_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        this.importModsSelection.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.addEventListener("change", async () => {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = async () => {
                    const selectedMods = JSON.parse(reader.result);
                    for (const mod of selectedMods) {
                        const checkbox = this.element.querySelector(
                            `#mod_${mod.file.fileId}`,
                        );
                        if (checkbox == null) {
                            continue;
                        }
                        checkbox.checked = true;
                        const modElement = checkbox.parentNode;
                        modElement.classList.add("bg-primary-subdued");
                        modElement
                            .querySelector(".mod-list-index")
                            .classList.add("text-white");
                    }
                    this.selectedModsCount.firstChild.textContent = `${selectedMods.length} mods selected`;
                };
                reader.readAsText(file);
            });
            input.click();
        });

        this.selectModsImportDownloadedMods.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.addEventListener("change", async () => {
                const files = input.files;
                const downloadedMods = this.ndc.mods.all.filter((mod) => {
                    for (const file of files) {
                        if (file.name.includes(mod.file.uri)) {
                            return true;
                        }
                    }
                    return false;
                }).reduce((acc, mod) => {
                    acc[mod.file.fileId] = mod;
                    return acc;
                }, {});

                // for each checkbox, check if the mod is in the downloadedMods array, if not, check the checkbox
                const notDownloadedMods = [];
                for (const modElement of this.modsListMobile.childNodes) {
                    const checkbox = modElement.querySelector('input[type="checkbox"]');
                    const modId = Number.parseInt(checkbox.id.split("_")[1]);
                    if (downloadedMods[modId] == null) {
                        notDownloadedMods.push(downloadedMods[modId]);
                        checkbox.checked = true;
                        modElement.classList.add("bg-primary-subdued");
                        modElement.querySelector(".mod-list-index").classList.add("text-white");
                    }
                }
                this.selectedModsCount.firstChild.textContent = `${notDownloadedMods.length} mods selected`;

                if (notDownloadedMods.length === 0) {
                    alert("All mods are already downloaded.");
                } else {
                    alert(
                        `Selected ${notDownloadedMods.length
                        } mods that are not downloaded yet.`,
                    );
                }
            });
            input.click();
        });
    }
}

class NDCUpdateModsModal {
    constructor(ndc) {
        this.element = document.createElement("div");
        this.element.classList.add(
            "fixed",
            "top-0",
            "left-0",
            "w-full",
            "h-full",
            "z-50",
            "flex",
            "justify-center",
            "items-center",
            "bg-black/25",
            "backdrop-brightness-50"
        );

        this.ndc = ndc;

        this.html = `
            <div class="bg-surface-mid p-4 rounded-lg flex flex-col" style="max-width: 850px; width: 100%;">
                <div class="loadingSpinner flex justify-center items-center h-full">
                    <svg class="animate-spin" viewBox="0 0 24 24" style="height: 120px; width: 120px;"><path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"></path></svg>
                </div>
                <div class="elementBody hidden">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="font-montserrat font-semibold text-lg leading-none tracking-wider uppercase">Update collection</h2>
                    </div>
                    <div class="flex justify-center flex-col gap-4 mb-4 h-full">
                        <div>
                            <label for="currentCollectionRevision" class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase">Select your current Collection Revision</label>
                            <div>
                                <select id="currentCollectionRevision" class="p-1 border border-stroke-subdued rounded flex-initial text-black w-full h-full">
                                </select>
                            </div>
                        </div>
                        <div>
                            <label for="newCollectionRevision" class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase">Select the Collection Revision to update to</label>
                            <div>
                                <select id="newCollectionRevision" class="p-1 border border-stroke-subdued rounded flex-initial text-black w-full h-full">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="listOfUpdates" class="hidden mb-4 h-full" style="max-height: calc(100vh - 18rem);">
                    </div>
                    <div class="flex justify-end gap-2">
                        <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase text-center leading-none flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-focus-subdued focus:outline-offset-2 rounded px-2 py-1 cursor-pointer bg-surface-mid border border-neutral-moderate fill-neutral-moderate text-neutral-moderate aria-expanded:bg-surface-high focus:border-neutral-moderate focus:bg-surface-high hover:border-neutral-moderate hover:bg-surface-high" id="cancelUpdateModsBtn">Cancel</button>
                        <button class="hidden font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued rounded" id="updateModsBtn">Update</button>
                    </div>
                </div>
            </div>
        `;
        this.element.innerHTML = this.html;

        this.currentCollectionRevision = this.element.querySelector("#currentCollectionRevision");
        this.newCollectionRevision = this.element.querySelector("#newCollectionRevision");
        this.listOfUpdates = this.element.querySelector("#listOfUpdates");

        this.updateModsBtn = this.element.querySelector("#updateModsBtn");
        this.cancelUpdateModsBtn = this.element.querySelector(
            "#cancelUpdateModsBtn",
        );

        this.modsToDownload = [];

        this.updateModsBtn.addEventListener("click", () => {
            this.ndc.downloadMods(this.modsToDownload);

            this.element.remove();
        });

        this.cancelUpdateModsBtn.addEventListener("click", () => {
            this.element.remove();
        });
    }

    async renderListOfUpdates() {
        if (!this.currentCollectionRevision.value || !this.newCollectionRevision.value) {
            this.updateModsBtn.classList.add("hidden");
            return;
        }

        this.listOfUpdates.classList.remove("hidden");
        this.listOfUpdates.classList.remove("overflow-auto");
        this.listOfUpdates.innerHTML = `<div class="flex justify-center items-center h-full">
        <svg class="animate-spin" viewBox="0 0 24 24" style="height: 120px; width: 120px;"><path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"></path></svg>
        </div>`;
        this.updateModsBtn.classList.add("hidden");

        const [currentRevision, newRevision] = await Promise.all([
            this.ndc.fetchMods(this.ndc.collectionId, parseInt(this.currentCollectionRevision.value)),
            this.ndc.fetchMods(this.ndc.collectionId, parseInt(this.newCollectionRevision.value)),
        ]);

        // group all mods by modId
        const currentMods = currentRevision.modFiles.reduce((acc, mod) => {
            if (!acc[mod.file.mod.modId]) {
                acc[mod.file.mod.modId] = [];
            }
            acc[mod.file.mod.modId].push(mod);
            return acc;
        }, {});
        const newMods = newRevision.modFiles.reduce((acc, mod) => {
            if (!acc[mod.file.mod.modId]) {
                acc[mod.file.mod.modId] = [];
            }
            acc[mod.file.mod.modId].push(mod);
            return acc;
        }, {});

        const addedMods = [];
        const updatedMods = [];
        const removedMods = [];

        for (const [modId, newModFiles] of Object.entries(newMods)) {
            const currentModFiles = currentMods[modId] || [];
            newModFiles.forEach(newModFile => {
                const currentModFile = currentModFiles.find(
                    modFile => modFile.fileId === newModFile.fileId || modFile.file.name === newModFile.file.name
                );
                if (!currentModFile) {
                    addedMods.push(newModFile);
                } else if (currentModFile.file.version !== newModFile.file.version) {
                    updatedMods.push(newModFile);
                }
            });

            const remainingCurrentModFiles = currentModFiles.filter(
                currentModFile => !newModFiles.some(
                    modFile => modFile.fileId === currentModFile.fileId || modFile.file.name === currentModFile.file.name
                )
            );
            removedMods.push(...remainingCurrentModFiles);
        }

        this.modsToDownload = [...addedMods, ...updatedMods];

        this.listOfUpdates.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <h3 class="font-montserrat font-semibold text-lg leading-none tracking-wider uppercase text-green-600">
                        Updated Mods
                        <span class="text-sm text-neutral-moderate">(${updatedMods.length} mods)</span>
                    </h3>
                    <div class="flex flex-col gap-2">
                        ${updatedMods.map(mod => `<div class="flex gap-2"><span class="flex-1">${mod.file.mod.name}</span></div>`).join("")}
                    </div>
                </div>
                <div class="flex-1">
                    <h3 class="font-montserrat font-semibold text-lg leading-none tracking-wider uppercase text-sky-500">
                        Added Mods
                        <span class="text-sm text-neutral-moderate">(${addedMods.length} mods)</span>
                    </h3>
                    <div class="flex flex-col gap-2">
                        ${addedMods.map(mod => `<div class="flex gap-2"><span class="flex-1">${mod.file.mod.name}</span></div>`).join("")}
                    </div>
                </div>
                <div class="flex-1">
                    <h3 class="flex font-montserrat font-semibold text-lg leading-none tracking-wider uppercase text-red-600">
                        <svg id="deletedModsInfo" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1rem; height: 1rem; cursor: pointer"><title>information</title><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" style="fill: currentcolor"></path></svg>
                        Removed Mods
                        <span class="text-sm text-neutral-moderate">(${removedMods.length} mods)</span>
                    </h3>
                    <div class="flex flex-col gap-2">
                        ${removedMods.map(mod => `<div class="flex gap-2"><span class="flex-1">${mod.file.mod.name}</span></div>`).join("")}
                    </div>
                </div>
            </div>
        `;

        this.listOfUpdates.classList.add("overflow-auto");
        this.updateModsBtn.classList.remove("hidden");

        this.listOfUpdates.querySelector("#deletedModsInfo").addEventListener("click", () => {
            alert("The deleted mods is just for information, the script will not delete any mods from your collection.");
        });
    }

    async fetchRevisions() {
        // https://graphql.nexusmods.com/#definition-CollectionRevisionMod
        const response = await fetch("https://api-router.nexusmods.com/graphql", {
            headers: {
                "content-type": "application/json",
            },
            referrer: document.location.href,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify({
                query:
                    "query CollectionRevisions ($domainName: String, $slug: String!) { collection (domainName: $domainName, slug: $slug) { revisions {adultContent, createdAt, discardedAt, id, latest, revisionNumber, revisionStatus, totalSize, modCount, collectionChangelog { description, id}, gameVersions { reference } } } }",
                variables: { domainName: this.ndc.gameId, slug: this.ndc.collectionId },
                operationName: "CollectionRevisions",
            }),
            method: "POST",
            mode: "cors",
            credentials: "include",
        });

        if (!response.ok) {
            return;
        }

        const json = await response.json();

        if (!json.data.collection) {
            return;
        }

        return json.data.collection.revisions;
    }

    async render() {
        const revisions = await this.fetchRevisions();
        if (!revisions) {
            this.element.innerHTML = `
                <div class="bg-surface p-4 rounded-lg flex flex-col gap-4">
                    <h2 class="font-montserrat font-semibold text-lg leading-none tracking-wider uppercase">Update collection</h2>
                    <p class="text-neutral-moderate">An error occurred while fetching the collection revisions. Please try again later.</p>
                </div>
            `;
            return;
        }

        this.currentCollectionRevision.innerHTML = this.newCollectionRevision.innerHTML = `<option value="">Select a collection revision</option>`;
        revisions.forEach(revision => {
            const optionText = `Revision ${revision.revisionNumber} - ${(revision.totalSize / (1024 * 1024)).toFixed(2)} MB - ${(new Date(revision.createdAt)).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
            this.currentCollectionRevision.appendChild(new Option(optionText, revision.revisionNumber));
            this.newCollectionRevision.appendChild(new Option(optionText, revision.revisionNumber));
        });

        const updateList = async () => await this.renderListOfUpdates();
        this.newCollectionRevision.addEventListener("change", updateList);
        this.currentCollectionRevision.addEventListener("change", updateList);

        this.element.querySelector(".loadingSpinner").classList.add("hidden");
        this.element.querySelector(".elementBody").classList.remove("hidden");

        this.element.addEventListener("click", (event) => {
            if (event.target === this.element) this.element.remove();
        });
    }


}

class NDCProgressBar {
    static STATUS_DOWNLOADING = 0;
    static STATUS_PAUSED = 1;
    static STATUS_FINISHED = 2;
    static STATUS_STOPPED = 3;

    static STATUS_TEXT = {
        [NDCProgressBar.STATUS_DOWNLOADING]: "Downloading...",
        [NDCProgressBar.STATUS_PAUSED]: "Paused",
        [NDCProgressBar.STATUS_FINISHED]: "Finished",
        [NDCProgressBar.STATUS_STOPPED]: "Stopped",
    };

    constructor(ndc, options = {}) {
        this.element = document.createElement("div");
        this.element.classList.add("flex", "flex-wrap", "w-100");
        this.element.style.display = "none";

        this.ndc = ndc;

        this.modsCount = 0;
        this.progress = 0;

        this.skipPause = false;

        this.skipTo = false;
        this.skipToIndex = 0;

        this.status = NDCProgressBar.STATUS_DOWNLOADING;

        this.html = `
            <div class="flex-1 relative w-100 min-h-9 bg-surface-mid rounded-l overflow-hidden" id="progressBar">
                <div class="absolute top-0 left-0 w-0 h-full bg-primary-moderate" style="transition: width 0.3s ease 0s; width: 0%;" id="progressBarFill"></div>
                <div class="absolute top-0 left-0 w-full h-full cursor-pointer grid grid-cols-3 items-center text-white font-montserrat font-semibold text-sm leading-none tracking-wider uppercase" id="progressBarText">
                    <div class="ml-2" id="progressBarProgress">${this.progress}%</div>
                    <div class="text-center" id="progressBarTextCenter">Downloading...</div>
                    <div class="text-right mr-2" id="progressBarTextRight">${this.progress}/${this.modsCount}</div>
                </div>
            </div>
            <div class="flex" id="actionBtnGroup">
                <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between" id="playPauseBtn">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M14,19H18V5H14M6,19H10V5H6V19Z" style="fill: currentcolor;"></path></svg>
                </button>
                <button class="font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between rounded-r" id="stopBtn">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M18,18H6V6H18V18Z" style="fill: currentcolor;"></path></svg>
                </button>
            </div>
            <div class="flex my-2 justify-between" style="flex-basis: 100%;" id="toolbarContainer">
				<div class="flex gap-2">
					<div id="downloadSpeedInputContainer">
						<div class="flex items-center gap-2 mb-2">
							<label class="text-white font-montserrat font-semibold text-sm leading-none tracking-wider uppercase" for="downloadSpeedInput">DL Speed (mb/s)</label>
							<svg id="downloadSpeedInfo" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1rem; height: 1rem; cursor: pointer;"><title>information</title><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" style="fill: currentcolor;"/></svg>
						</div>
						<input class="text-md text-neutral-subdued border-neutral-subdued bg-surface-mid rounded border indent-2 outline-none hover:border-white focus:border-white focus:text-white p-1 w-20" type="number" min="0" step="any" placeholder="1.5" value="${this.ndc.downloadSpeed}" id="downloadSpeedInput">
					</div>
					<div id="pauseBetweenDownloadInputContainer">
						<div class="flex items-center gap-2 mb-2">
							<label class="text-white font-montserrat font-semibold text-sm leading-none tracking-wider uppercase" for="pauseBetweenDownloadInput">Extra pause</label>
							<svg id="extraPauseInfo" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation" style="width: 1rem; height: 1rem; cursor: pointer;"><title>information</title><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" style="fill: currentcolor;"/></svg>
						</div>
						<input class="text-md text-neutral-subdued border-neutral-subdued bg-surface-mid rounded border indent-2 outline-none hover:border-white focus:border-white focus:text-white p-1 w-20" type="number" min="0" placeholder="5" value="${this.ndc.pauseBetweenDownload}" id="pauseBetweenDownloadInput">
					</div>
				</div>
                <div class="flex gap-2 items-center" id="skipContainer">
                    <button class="rounded font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between" id="skipNextBtn">
                        Skip pause
                    </button>
                    <button class="rounded font-montserrat font-semibold text-sm leading-none tracking-wider uppercase flex gap-x-2 justify-center items-center transition-colors relative min-h-9 focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-2 px-2 py-1 cursor-pointer bg-primary-moderate fill-font-primary text-font-primary border-transparent focus:bg-primary-strong hover:bg-primary-subdued justify-between" id="skipToIndexBtn">
                        Skip to index
                    </button>
                    <input class="text-md text-neutral-subdued border-neutral-subdued bg-surface-mid rounded border indent-2 outline-none hover:border-white focus:border-white focus:text-white p-1 w-20" type="number" min="0" placeholder="Index" id="skipToIndexInput">
                </div>
            </div>
        `;

        this.element.innerHTML = this.html;

        const downloadSpeedInfo = this.element.querySelector("#downloadSpeedInfo");
        const extraPauseInfo = this.element.querySelector("#extraPauseInfo");

        this.progressBarFill = this.element.querySelector("#progressBarFill");
        this.progressBarProgress = this.element.querySelector("#progressBarProgress");
        this.progressBarTextCenter = this.element.querySelector("#progressBarTextCenter");
        this.progressBarTextRight = this.element.querySelector("#progressBarTextRight");
        this.playPauseBtn = this.element.querySelector("#playPauseBtn");
        this.stopBtn = this.element.querySelector("#stopBtn");
        this.downloadSpeedInput = this.element.querySelector("#downloadSpeedInput");
        this.pauseBetweenDownloadInput = this.element.querySelector("#pauseBetweenDownloadInput");
        this.skipNextBtn = this.element.querySelector("#skipNextBtn");
        this.skipToIndexBtn = this.element.querySelector("#skipToIndexBtn");
        this.skipToIndexInput = this.element.querySelector("#skipToIndexInput");

        downloadSpeedInfo.addEventListener("click", () => {
            alert(
                `"DL Speed" is the download speed in mb/s.\nIt is used to calculate the pause between downloads.\n\n/!\\/!\\/!\\/!\\/!\\/!\\\nIt doesnt affect the real download speed. It is only used has a reference to calculate the pause between downloads.\n/!\\/!\\/!\\/!\\/!\\/!\\`,
            );
        });

        extraPauseInfo.addEventListener("click", () => {
            alert(
                `"Extra pause" is the time in seconds the script waits before starting the next download. Without it, downloads begin immediately but Vortex may become unresponsive with large collections.\n\nA supplementary pause is calculated based on the mod file size and download speed (1.5mb/s), noticeable only with large mods.\n\nIf "extra pause" is set to 0, the calculated pause is ignored.`,
            );
        });

        this.playPauseBtn.addEventListener("click", () => {
            const status =
                this.status === NDCProgressBar.STATUS_DOWNLOADING
                    ? NDCProgressBar.STATUS_PAUSED
                    : NDCProgressBar.STATUS_DOWNLOADING;
            this.setStatus(status);
        });

        this.stopBtn.addEventListener("click", () => {
            this.setStatus(NDCProgressBar.STATUS_STOPPED);
        });

        this.downloadSpeedInput.addEventListener("change", async (event) => {
            this.ndc.downloadSpeed = Number.parseFloat(event.target.value);
            await GM.setValue("downloadSpeed", this.ndc.downloadSpeed);
        });

        this.pauseBetweenDownloadInput.addEventListener("change", async (event) => {
            this.ndc.pauseBetweenDownload = Number.parseInt(event.target.value);
            await GM.setValue("pauseBetweenDownload", this.ndc.pauseBetweenDownload);
        });

        this.skipNextBtn.addEventListener("click", () => {
            this.skipPause = true;
            this.setStatus(NDCProgressBar.STATUS_DOWNLOADING);
        });

        this.skipToIndexBtn.addEventListener("click", () => {
            const index = Number.parseInt(this.skipToIndexInput.value);
            if (index > this.progress && index <= this.modsCount) {
                this.skipTo = true;
                this.skipToIndex = index;
                this.setStatus(NDCProgressBar.STATUS_DOWNLOADING);
            }
        });
    }

    setState(newState) {
        Object.assign(this, newState);
        this.render();
    }

    setModsCount(modsCount) {
        this.setState({ modsCount });
    }

    setProgress(progress) {
        this.setState({ progress });
    }

    incrementProgress() {
        this.setState({ progress: this.progress + 1 });
    }

    setStatus(status) {
        this.setState({ status });
        this.progressBarTextCenter.innerHTML = NDCProgressBar.STATUS_TEXT[status];
    }

    getProgressPercent() {
        return ((this.progress / this.modsCount) * 100).toFixed(2);
    }

    updateProgressBarFillWidth() {
        this.progressBarFill.style.width = `${this.getProgressPercent()}%`;
    }

    updateProgressBarTextProgress() {
        this.progressBarProgress.innerHTML = `${this.getProgressPercent()}%`;
    }

    updateProgressBarTextRight() {
        this.progressBarTextRight.innerHTML = `${this.progress}/${this.modsCount}`;
    }

    updatePlayPauseBtn() {
        this.playPauseBtn.innerHTML =
            this.status === NDCProgressBar.STATUS_PAUSED
                ? '<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" style="fill: currentcolor;"></path></svg>'
                : '<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" style="width: 1.5rem; height: 1.5rem;"><path d="M14,19H18V5H14M6,19H10V5H6V19Z" style="fill: currentcolor;"></path></svg>';
    }

    updateDownloadSpeedInput() {
        this.downloadSpeedInput.value = this.ndc.downloadSpeed;
    }

    updatePauseBetweenDownloadInput() {
        this.pauseBetweenDownloadInput.value = this.ndc.pauseBetweenDownload;
    }

    render() {
        this.updateProgressBarFillWidth();
        this.updateProgressBarTextProgress();
        this.updateProgressBarTextRight();
        this.updatePlayPauseBtn();
        this.updateDownloadSpeedInput();
        this.updatePauseBetweenDownloadInput();
    }
}

class NDCLogConsole {
    static TYPE_NORMAL = "NORMAL";
    static TYPE_ERROR = "ERROR";
    static TYPE_INFO = "INFO";

    constructor(ndc, options = {}) {
        this.element = document.createElement("div");
        this.element.classList.add("flex", "flex-col", "w-100", "gap-3", "mt-3");

        this.ndc = ndc;
        this.hidden = false;

        this.html = `
            <div class="flex flex-col w-100 gap-3 mt-3">
                <button class="w-full font-montserrat font-semibold text-sm leading-none tracking-wider uppercase" id="toggleLogsButton">
                    Hide logs
                </button>
                <div class="w-full bg-surface-low rounded overflow-y-auto text-white font-semibold text-sm border border-primary" style="height: 10rem; resize: vertical;" style="font-family: sans-serif;" id="logContainer">
                </div>
            </div>
        `;

        this.element.innerHTML = this.html;

        this.toggle = this.element.querySelector("#toggleLogsButton");
        this.logContainer = this.element.querySelector("#logContainer");

        this.toggle.addEventListener("click", () => {
            this.hidden = !this.hidden;
            logContainer.style.display = this.hidden ? "none" : "";
            this.toggle.innerHTML = this.hidden ? "Show logs" : "Hide logs";
        });
    }

    log(message, type = NDCLogConsole.TYPE_NORMAL) {
        const rowElement = document.createElement("div");

        rowElement.classList.add("flex", "gap-x-1", "px-2", "py-1");
        if (type === NDCLogConsole.TYPE_ERROR) {
            rowElement.classList.add("text-danger-moderate");
        } else if (type === NDCLogConsole.TYPE_INFO) {
            rowElement.classList.add("text-info-moderate");
        }

        rowElement.innerHTML = `<span>[${new Date().toLocaleTimeString()}]</span><span class="ndc-log-message flex gap-1">${message}</span>`;
        rowElement.message = rowElement.querySelector(".ndc-log-message");

        this.logContainer.appendChild(rowElement);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;

        console.log(`${message}`);

        return rowElement;
    }

    clear() {
        this.logContainer.innerHTML = "";
    }
}

let previousRoute = null;
let ndc = null;

function extractRouteDetails(pathname) {
    // games/cyberpunk2077/collections/iszwwe/revisions/464
    const pathParts = pathname.split("/").filter(Boolean); // Split and remove empty parts
    if (pathParts.length >= 4 && pathParts[2] === "collections") {
        return {
            gameDomain: pathParts[1],
            collectionSlug: pathParts[3],
            revisionNumber: pathParts.length > 5 ? pathParts[5] : null,
        };
    }
    return null;
}

function handleRouteChange() {
    const pathname = window.location.pathname;

    const routeDetails = extractRouteDetails(pathname);

    if (routeDetails) {
        const { gameDomain, collectionSlug, revisionNumber } = routeDetails;
        const currentRoute = `${gameDomain}/${collectionSlug}/`;
        const currentRevision = revisionNumber ? parseInt(revisionNumber, 10) : null;

        if (previousRoute !== currentRoute || ndc?.revision !== currentRevision) {
            previousRoute = currentRoute;

            if (ndc) {
                ndc.element.remove();
            }

            ndc = new NDC(gameDomain, collectionSlug, currentRevision);
            ndc.init().then(() => {
                const container = document.querySelector("#mainContent > div > div.relative > div.next-container");
                if (container) {
                    container.append(ndc.element);
                }
            });
        }
    }
}

// Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver(() => {
    handleRouteChange();
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to handle the current route
handleRouteChange();

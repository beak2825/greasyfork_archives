// ==UserScript==
// @name         MoM Support
// @namespace    https://elimination.me
// @version      0.6
// @description  Request support in group attacks
// @author       Pyrit [2111649]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @grant        unsafeWindow
// @connect      elimination.me
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514839/MoM%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/514839/MoM%20Support.meta.js
// ==/UserScript==

(function () {
    GM.addStyle(`
.crypto-flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}

.crypto-justify-end {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
}

.crypto-mr-5 {
    margin-right: 5px;
}

.crypto-button {
    background-color: #278EF5;
    color: white;
    font-size: 13px;
    padding: 2px 5px;
    border-radius: 5px;
    border: 0;
}

.crypto-button:hover {
    background-color: #177ADD;
    cursor: pointer;
}

.crypto-input {
    border-radius: 5px;
    font-size: 13px;
    background-color: #D1D1D1;
    padding: 2px 5px;
}

.crypto-text {
    font-size: 14px;
}

.crypto-text a {
    color: #278EF5;
}

.crypto-close-icon {
    background-color: #F64B29;
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLjAwMDcgMTAuNTg2NUwxNi45NTA0IDUuNjM2NzJMMTguMzY0NiA3LjA1MDkzTDEzLjQxNDkgMTIuMDAwN0wxOC4zNjQ2IDE2Ljk1MDRMMTYuOTUwNCAxOC4zNjQ2TDEyLjAwMDcgMTMuNDE0OUw3LjA1MDkzIDE4LjM2NDZMNS42MzY3MiAxNi45NTA0TDEwLjU4NjUgMTIuMDAwN0w1LjYzNjcyIDcuMDUwOTNMNy4wNTA5MyA1LjYzNjcyTDEyLjAwMDcgMTAuNTg2NVoiPjwvcGF0aD48L3N2Zz4=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLjAwMDcgMTAuNTg2NUwxNi45NTA0IDUuNjM2NzJMMTguMzY0NiA3LjA1MDkzTDEzLjQxNDkgMTIuMDAwN0wxOC4zNjQ2IDE2Ljk1MDRMMTYuOTUwNCAxOC4zNjQ2TDEyLjAwMDcgMTMuNDE0OUw3LjA1MDkzIDE4LjM2NDZMNS42MzY3MiAxNi45NTA0TDEwLjU4NjUgMTIuMDAwN0w1LjYzNjcyIDcuMDUwOTNMNy4wNTA5MyA1LjYzNjcyTDEyLjAwMDcgMTAuNTg2NVoiPjwvcGF0aD48L3N2Zz4=);
    width: 18px;
    height: 18px;
    margin: -3px 0;
}

.crypto-close-icon:hover {
    background-color: #E6401E;
}

.crypto-group-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12'%3E%3Cpath d='M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z' fill='rgba(17,189,17,1)'%3E%3C/path%3E%3C/svg%3E");
    width: 12px;
    height: 12px;
    margin-right: 2px;
}

.crypto-crosshair-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12'%3E%3Cpath d='M11 5.07089C7.93431 5.5094 5.5094 7.93431 5.07089 11H7V13H5.07089C5.5094 16.0657 7.93431 18.4906 11 18.9291V17H13V18.9291C16.0657 18.4906 18.4906 16.0657 18.9291 13H17V11H18.9291C18.4906 7.93431 16.0657 5.5094 13 5.07089V7H11V5.07089ZM3.05493 11C3.51608 6.82838 6.82838 3.51608 11 3.05493V1H13V3.05493C17.1716 3.51608 20.4839 6.82838 20.9451 11H23V13H20.9451C20.4839 17.1716 17.1716 20.4839 13 20.9451V23H11V20.9451C6.82838 20.4839 3.51608 17.1716 3.05493 13H1V11H3.05493ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z' fill='rgba(235,43,43,1)'%3E%3C/path%3E%3C/svg%3E");
    width: 12px;
    height: 12px;
    margin-right: 2px;
}

.crypto-i-button {
    color: #F64B29;
    border-color: #F64B29;
    cursor: pointer;
    border: 1px solid;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    padding: 2px 5px;
}

.crypto-i-button:hover {
    color: #E6401E;
    border-color: #E6401E;
}

.crypto-flex-grow {
    flex-grow: 1;
}

.crypto-action-item {
    display: inline-flex;
    align-items: center;
    font-size: x-small;
    color: #278EF5;
}

button.crypto-action-item {
    cursor: pointer;
}
button.crypto-action-item:disabled {
    cursor: default;
    color: #B4ADAC;
}
`);

    class State extends EventTarget {
        value = {};

        update(update) {
            this.value = { ...this.value, ...update };
            this.dispatchEvent(new CustomEvent("update", { detail: update }));
        }
    }

    const state = new State();

    GM.getValue("state", { apiKey: null }).then(state.update.bind(state));

    state.addEventListener("update", (event) => {
        if (Object.keys(event.detail).some((key) => ["apiKey"].includes(key))) {
            GM.setValue("state", { apiKey: state.value.apiKey });
        }
    });

    const buildRequestUi = () => {
        const root = document.createElement("form");
        root.style.marginRight = "10px";

        const smokersLabel = document.createElement("label");
        smokersLabel.htmlFor = "smokers";
        smokersLabel.classList.add("crypto-text", "crypto-mr-5");
        smokersLabel.style.marginRight = "5px";
        smokersLabel.append("Smokers: ");

        const smokersInput = document.createElement("input");
        smokersInput.classList.add("crypto-input");
        smokersInput.id = "smokers";
        smokersInput.min = 0;
        smokersInput.max = 50;
        smokersInput.type = "number";
        smokersInput.value = localStorage["crypto-support-smokers"] ?? "0";
        smokersInput.addEventListener("change", (event) => {
            localStorage["crypto-support-smokers"] = event.target.value;
        });
        smokersLabel.append(smokersInput);

        root.append(smokersLabel);

        const tearersLabel = document.createElement("label");
        tearersLabel.htmlFor = "tearers";
        tearersLabel.classList.add("crypto-text", "crypto-mr-5");
        tearersLabel.style.marginRight = "10px";
        tearersLabel.append("Tear gas: ");

        const tearersInput = document.createElement("input");
        tearersInput.classList.add("crypto-input");
        tearersInput.id = "tearers";
        tearersInput.min = 0;
        tearersInput.max = 50;
        tearersInput.type = "number";
        tearersInput.value = localStorage["crypto-support-tearers"] ?? "0";
        tearersInput.addEventListener("change", (event) => {
            localStorage["crypto-support-tearers"] = event.target.value;
        });
        tearersLabel.append(tearersInput);

        root.append(tearersLabel);

        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.innerText = "Request support!";
        submitButton.classList.add("crypto-button", "crypto-mr-5");
        submitButton.style.marginRight = "10px";

        root.append(submitButton);

        root.addEventListener("submit", (event) => {
            event.preventDefault();

            submitButton.disabled = true;
            const smokers = parseInt(smokersInput.value);
            const tearers = parseInt(tearersInput.value);
            const targetId = parseInt(
                new URLSearchParams(location.search).get("user2ID")
            );

            GM.xmlHttpRequest({
                url: "https://elimination.me/api/crypto/support",
                method: "POST",
                data: JSON.stringify({ smokers, tearers, targetId }),
                headers: {
                    ["Content-Type"]: "application/json",
                    ["Authorization"]: `Bearer ${state.value.apiKey}`,
                },
                onload: (response) => {
                    if (response.status === 200) {
                        state.update({ message: "Success!", colour: "green" });
                        submitButton.disabled = false;
                    } else {
                        const body = JSON.parse(response.responseText);
                        state.update({
                            message: body.reason ?? "Something went wrong",
                            colour: "red",
                        });
                        submitButton.disabled = false;
                    }
                },
            });
        });

        return root;
    };

    const buildApiInputUi = () => {
        const root = document.createElement("form");
        root.style.marginRight = "10px";

        const customUrl =
            "https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=crypto&user=profile";

        const label = document.createElement("label");
        label.classList.add("crypto-text", "crypto-mr-5");
        label.innerHTML = `Please enter a public or <a href="${customUrl}" target="_blank">custom</a> API key: `;
        label.htmlFor = "api-key";
        root.append(label);

        const input = document.createElement("input");
        input.classList.add("crypto-input", "crypto-mr-5");
        input.id = "api-key";
        input.type = "text";
        input.maxLength = 16;
        input.minLength = 16;
        label.append(input);

        const button = document.createElement("button");
        button.innerText = "Confirm";
        button.type = "submit";
        button.classList.add("crypto-button");
        root.append(button);

        root.addEventListener("submit", async (event) => {
            event.preventDefault();

            const key = input.value;
            try {
                const response = await fetch(
                    `https://api.torn.com/key/?selections=info&key=${key}`
                );
                const body = await response.json();

                if (body.error) {
                    state.update({ message: body.error.error, colour: "red" });
                    return;
                }

                if (body.selections.user.includes("profile")) {
                    state.update({ apiKey: key, message: "" });
                } else {
                    state.update({
                        message: "API has insufficient access",
                        colour: "red",
                    });
                }
            } catch (e) {
                state.update({ message: e.message, colour: "red" });
            }
        });

        return root;
    };

    const buildMessageOutlet = () => {
        const root = document.createElement("span");
        root.classList.add("crypto-text");

        state.addEventListener("update", (event) => {
            if (event.detail.message) {
                root.innerText = event.detail.message;
            }
            if (event.detail.colour) {
                root.style.color = event.detail.colour;
            }
        });

        return root;
    };

    const buildSettingsUi = () => {
        const root = document.createElement("div");
        root.classList.add("crypto-flex-grow", "crypto-justify-end");

        const button = document.createElement("button");
        button.classList.add("crypto-i-button");
        button.innerText = "Reset Key";

        const icon = document.createElement("i");
        icon.classList.add("crypto-close-icon");
        button.append(icon);

        button.addEventListener("click", () => state.update({ apiKey: null }));

        state.addEventListener("update", (event) => {
            if (
                event.detail.apiKey !== undefined ||
                event.detail.mounted !== undefined
            ) {
                if (state.value.apiKey) {
                    root.append(button);
                } else {
                    root.replaceChildren();
                }
            }
        });

        return root;
    };

    const mountUi = (contentWrapper) => {
        const rootNode = document.createElement("div");
        rootNode.classList.add("crypto-flex-row");
        contentWrapper.prepend(rootNode);

        const requestUi = buildRequestUi();
        const apiInputUi = buildApiInputUi();
        const messageOutlet = buildMessageOutlet();
        const settings = buildSettingsUi();

        state.addEventListener("update", () => {
            if (state.value.apiKey !== null) {
                rootNode.replaceChildren(requestUi, messageOutlet, settings);
            } else {
                rootNode.replaceChildren(apiInputUi, messageOutlet, settings);
            }
        });
        state.update({ mounted: true });
    };

    const contentObserver = new MutationObserver((_, observer) => {
        const contentWrapper = document.querySelector(".content-wrapper");
        if (contentWrapper) {
            observer.disconnect();
            mountUi(contentWrapper);
        }
    });

    contentObserver.observe(document, { subtree: true, childList: true });

    const oldFetch = window.fetch;

    unsafeWindow.fetch = function (url) {
        if (!/sid=attackData&mode=json&step=poll/.test(url)) {
            return oldFetch.call(oldFetch, ...arguments);
        }

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const response = await oldFetch.call(oldFetch, ...arguments);
                resolve(response.clone());
                const body = await response.json();

                if (body.DB.currentFightStatistics) {
                    const attackers = Object.fromEntries(
                        Object.entries(body.DB.currentFightStatistics).map(
                            ([id, value]) => [value.playername, parseInt(id)]
                        )
                    );
                    state.update({ attackers });
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    const addButtons = (row) => {
        const descRow = row.querySelector(`[class^="desc"]`);
        const name = row.querySelector(`[class^="playername"]`)?.innerText;

        if (!descRow || !name || descRow.querySelector(".crypto-action-item"))
            return;

        descRow.children[0].remove();
        const attackLink = document.createElement("a");
        attackLink.classList.add("crypto-action-item");
        if (state.value.attackers?.[name]) {
            attackLink.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${state.value.attackers?.[name]}`;
        } else {
            attackLink.href = `https://www.torn.com/profiles.php?NID=${name}`;
        }
        attackLink.target = "_blank";
        const crosshair = document.createElement("i");
        crosshair.classList.add("crypto-crosshair-icon");
        attackLink.append(crosshair);
        const label = document.createElement("span");
        label.innerText = "attack";
        attackLink.append(label);
        descRow.prepend(attackLink);

        const requestButton = document.createElement("button");
        requestButton.classList.add("crypto-action-item");
        if (
            state.value.requested?.has(name) ||
            !state.value.attackers?.[name]
        ) {
            requestButton.disabled = true;
        }
        requestButton.dataset.userid = state.value.attackers?.[name];
        requestButton.addEventListener("click", () => {
            requestButton.disabled = true;
            const oldRequested = state.value.requested ?? new Set();
            oldRequested.add(name);
            state.update({ requested: oldRequested });

            const targetId = parseInt(requestButton.dataset.userid);
            const victimID = parseInt(
                new URLSearchParams(location.search).get("user2ID")
            );

            GM.xmlHttpRequest({
                url: "https://elimination.me/api/crypto/kill",
                method: "POST",
                data: JSON.stringify({ targetId, victimID }),
                headers: {
                    ["Content-Type"]: "application/json",
                    ["Authorization"]: `Bearer ${state.value.apiKey}`,
                },
                onload: (response) => {
                    if (response.status === 200) {
                        state.update({
                            message: "Request sent",
                            colour: "green",
                        });
                    } else {
                        const body = JSON.parse(response.responseText);
                        const oldRequested = state.value.requested;
                        oldRequested.remove(name);
                        requestButton.disabled = false;
                        state.update({
                            message: body.reason ?? "Something went wrong",
                            colour: "red",
                            requested: oldRequested,
                        });
                    }
                },
            });
        });
        const groupIcon = document.createElement("i");
        groupIcon.classList.add("crypto-group-icon");
        requestButton.append(groupIcon);
        const groupLabel = document.createElement("span");
        groupLabel.innerText = "request";
        requestButton.append(groupLabel);
        descRow.prepend(requestButton);

        if (!state.value.attackers?.[name]) {
            const listener = function (event) {
                if (event.detail.attackers?.[name]) {
                    attackLink.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${state.value.attackers[name]}`;
                    requestButton.dataset.userid = state.value.attackers[name];
                    requestButton.disabled = false;
                    state.removeEventListener("update", this);
                }
            };

            state.addEventListener("update", listener);
        }
    };

    const observer = new MutationObserver((records, observer) => {
        if (!state.value.foundParticipants) {
            const reactRoot = document.getElementById("react-root");
            if (reactRoot) {
                observer.disconnect();
                observer.observe(reactRoot, {
                    childList: true,
                    subtree: true,
                });
                state.update({ foundParticipants: true });

                const rows = reactRoot.querySelectorAll(
                    `[class^="participants"] > li`
                );
                for (const row of rows) {
                    addButtons(row);
                }
            }
            return;
        }

        records
            .flatMap((record) => [...record.addedNodes])
            .filter((node) => node instanceof Element)
            .filter((element) => /row/.test(element.classList.value))
            .forEach(addButtons);

        records
            .flatMap((record) => [...record.addedNodes])
            .filter((node) => node instanceof Element)
            .flatMap((element) => [
                ...element.querySelectorAll(`[class^="participants"] > li`),
            ])
            .forEach(addButtons);
    });

    observer.observe(document, { subtree: true, childList: true });
})();
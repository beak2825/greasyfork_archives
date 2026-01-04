const storeKey = (storageKey, scriptName) => {

    const display_status = (element) => {
        const key = localStorage.getItem(`${storageKey}-key`);
        let innerHTML = "";
        innerHTML += `<div>`;
        innerHTML += `<b>[${scriptName}]</b> API key used <span style="font-family: monospace; font-weight: bold;">${key}</span>`;
        if (key) {
            innerHTML += ` | Status <b id="${storageKey}-status" style="color: var(--default-green-color); font-weight: bold;">enabled</b>`;
            innerHTML += ` | Click <span id="${storageKey}-api-key-rm" class="t-blue" style="cursor: pointer;">here to disable</span> the script`;
        } else {
            innerHTML += ` | Status <b id="${storageKey}-status" style="color: var(--default-red-color); font-weight: bold;">disabled</b>`;
            innerHTML += ` | Click on a key to enable the script`;
        }
        innerHTML += `</div>`;
        innerHTML += `<div class="clear"></div>`;
        innerHTML += `<hr class="page-head-delimiter m-top10 m-bottom10">`;
        element.innerHTML = innerHTML;
    };

    waitFor(document, "div.preferences-container").then(div => {

        let injected = false;
        const display_element = document.createElement("div");
        div.insertAdjacentElement('beforebegin', display_element);

        // triggered by clicking on crimes tab
        const callback = (mutations, observer) => {
            [...mutations].forEach(mutation => {
                [...mutation.addedNodes].filter(n => n.className && n.className.includes("keyRow___")).forEach(node => {
                    const key_node = node.querySelector("input");
                    key_node.style.cursor = "pointer";
                });
            });
            if (!injected) {
                display_status(display_element);
                injected = true;
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(div, { childList: true, subtree: true });

        document.querySelector("div.content-wrapper").addEventListener('click', e => {
            const button = e.target;
            if (button.tagName == 'INPUT' && button.id.includes('key-row') && !localStorage.getItem(`${storageKey}-key`)) {
                localStorage.setItem(`${storageKey}-key`, button.value);
            }
            else if (button.tagName == 'SPAN' && button.id == `${storageKey}-api-key-rm`) {
                clearLocalStorage(`${storageKey}`)
            }
            display_status(display_element);
        });

    });
}
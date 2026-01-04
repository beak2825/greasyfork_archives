// ==UserScript==
// @name               gm-inject
// @description        Inject scripts into the web pages.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// ==/UserScript==

let GM_injectPageScript;
{
    let counter = 1;

    GM_injectPageScript = function GM_injectPageScript(source, args, options)
    {
        const {
            name = `injected-${counter++}`,
        } = options ?? {};

        const scriptWrapper = document.createElement("div");
        scriptWrapper.style.display = "none";

        const shadowRoot = scriptWrapper.attachShadow({ mode: "closed" });

        const script = document.createElement("script");
        script.textContent = `(${source})(${JSON.stringify(args ?? {})}); //# sourceURL=userscript://${encodeURIComponent(GM.info.script.name)}/${encodeURIComponent(name)}.js`;

        shadowRoot.append(script);
        (document.body ?? document.head ?? document.documentElement).append(scriptWrapper);
    };
}

GM.injectPageScript = GM_injectPageScript;

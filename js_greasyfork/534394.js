;const {createHtml, createScriptURL, createScript} = (() => {
    let createHtml = html => html;
    let createScriptURL = url => url;
    let createScript = script => script;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        if (window.trustedTypes.defaultPolicy) {
            createHtml = html => window.trustedTypes.defaultPolicy.createHTML(html);
            createScriptURL = s => window.trustedTypes.defaultPolicy.createScriptURL(s);
            createScript = s => window.trustedTypes.defaultPolicy.createScript(s);
        } else {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string,
                createScriptURL: s => s,
                createScript: s => s,
            });
            createHtml = html => window.trustedTypes.defaultPolicy.createHTML(html);
        }
    }
    return {
        createHtml, createScriptURL, createScript
    }
})();
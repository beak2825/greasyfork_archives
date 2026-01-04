// ==UserScript==
// @name            MathJax输出设置 + notrans
// @description     Enhanced MathJax/KaTeX/MediaWiki output with improved performance.
// @version         3.0.2
// @license         CC-BY-NC-ND-4.0
// @namespace       https://greasyfork.org/zh-CN/scripts/406366
// @icon            https://www.mathjax.org/badge/badge-square-3.png
// @match           *://*.acs.org/*
// @match           *://*.aip.org/*
// @match           *://*.aps.org/*
// @match           *://arxiv.org/*
// @match           *://*.asme.org/*
// @match           *://*.cell.com/*
// @match           *://*.degruyter.com/*
// @match           *://*.frontiersin.org/*
// @match           *://*.iop.org/*
// @match           *://*.mdpi.com/*
// @match           *://*.nature.com/*
// @match           *://*.ncbi.nlm.nih.gov/*
// @match           *://*.osapublishing.org/*
// @match           *://*.optica.org/*
// @match           *://*.pnas.org/*
// @match           *://*.rsc.org/*
// @match           *://*.sciencedirect.com/*
// @match           *://*.sciencemag.org/*
// @match           *://*.science.org/*
// @match           *://*.spiedigitallibrary.org/*
// @match           *://*.springer.com/*
// @match           *://*.springeropen.com/*
// @match           *://*.tandfonline.com/*
// @match           *://*.wiley.com/*
// @match           *://*.wikipedia.org/*
// @match           *://*.mathworks.cn/*
// @match           *://*.mathworks.com/*
// @match           *://github.com/*
// @match           *://pypi.org/*
// @match           *://*.stackexchange.com/*
// @run-at          document-start
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406366/MathJax%E8%BE%93%E5%87%BA%E8%AE%BE%E7%BD%AE%20%2B%20notrans.user.js
// @updateURL https://update.greasyfork.org/scripts/406366/MathJax%E8%BE%93%E5%87%BA%E8%AE%BE%E7%BD%AE%20%2B%20notrans.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const config = {
        defaultMathJaxMenu: "renderer:HTML-CSS&;zoom:DoubleClick&;zscale:200%&;locale:zh-hans", //
        specialConfigs: {
            '.science.org': "renderer:CommonHTML&;scale:95&;zoom:DoubleClick&;zscale:200%&;locale:zh-hans",
            '.aps.org': "scale:88&;zoom:DoubleClick&;zscale:200%&;locale:zh-hans" //renderer:HTML-CSS&;
        },
        noTranslateQueries: [
            "sup",
            "button",
            ".open-in-viewer",
            ".article-paragraphs",
            ".article.authors.open",
            ".bibliography",
            ".rqv-container-wrap",
            ".CodeBlock",
            ".code_responsive",
            ".cit-list",
            ".c-article-references",
            ".c-reading-companion__reference-item",
            ".rqv-reference-list",
            ".useLabel",
            ".inline-ref-target",
            ".accordion__content",
            ".ref",
            ".reference",
            ".references",
            ".reference-body",
            ".ref-cit",
            ".ref-lnk",
            ".ref-list",
            ".ref-target.inline-ref-target",
            "ref-content",
            ".MathJax nobr",
            "mjx-container",
            ".sectionInfo.abstractSectionHeading",
            "#html-references_list",
            ".f-open-dropdown",
            ".citation-content",
            ".xref-fig",
            "pre",
            ".Link--primary",
            ".rqv-container",
            ".tab-link",
            ".author",
            // ... [其他选择器]
        ],
    };

    function setMathJaxCookie() {
        const host = location.host;
        let menuConfig = config.defaultMathJaxMenu;

        for (const [domain, specialConfig] of Object.entries(config.specialConfigs)) {
            if (host.includes(domain)) {
                menuConfig = specialConfig;
                break;
            }
        }

        document.cookie = `mjx.menu=${escape(menuConfig)}; path=/`;
    }

    function removeMathJaxCookie() {
        document.cookie = "mjx.menu=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    function setupAPS() {
        if (typeof MathJax !== 'undefined') {
            MathJax.Hub.Config({
                'CommonHTML': {showMathMenu: true},
                'HTML-CSS': {showMathMenu: true, jax: ['output/CommonHTML']},
                MathMenu: {showFontMenu: true}
            });
        }
    }

    function setupWikipedia() {
        const replaceImagesWithMathJax = () => {
            const images = document.querySelectorAll('img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display, img.mwe-math-mathml-display');
            let count = 0;

            images.forEach(img => {
                const script = document.createElement("script");
                script.type = "math/tex";
                script.textContent = img.alt;
                img.parentNode.replaceChild(script, img);
                count++;
            });

            if (count > 0) {
                const head = document.head;
                const config = document.createElement("script");
                config.type = "text/x-mathjax-config";
                config.textContent = "MathJax.Hub.Config({ extensions: ['TeX/mediawiki-texvc.js'] });";
                head.appendChild(config);

                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-MML-AM_CHTML";
                head.appendChild(script);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const observer = new MutationObserver(replaceImagesWithMathJax);
                observer.observe(document.body, { childList: true, subtree: true });
            });
        } else {
            const observer = new MutationObserver(replaceImagesWithMathJax);
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function setupNoTranslate() {
        const addNoTranslateClass = () => {
            config.noTranslateQueries.forEach(query => {
                document.querySelectorAll(query).forEach(node => node.classList.add('notranslate'));
            });

            if (typeof MathJax !== 'undefined' && MathJax.Hub && MathJax.Hub.getAllJax) {
                MathJax.Hub.getAllJax().forEach(jax => {
                    const element = jax.SourceElement().previousSibling;
                    if (element) element.classList.add('notranslate');
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const observer = new MutationObserver(addNoTranslateClass);
                observer.observe(document.body, { childList: true, subtree: true });
                addNoTranslateClass(); // Initial run
            });
        } else {
            const observer = new MutationObserver(addNoTranslateClass);
            observer.observe(document.body, { childList: true, subtree: true });
            addNoTranslateClass(); // Initial run
        }
    }

    // Main execution
    setMathJaxCookie();

    if (!location.host.includes('.sciencedirect.com')) {
        window.addEventListener("load", removeMathJaxCookie, { once: true });
    }

    if (location.host.includes('.aps.org') || location.host.includes('.iphy.ac.cn')) {
        window.addEventListener("load", setupAPS, { once: true });
    }

    if (location.host.includes('.wikipedia.org')) {
        setupWikipedia();
    }

    setupNoTranslate();

})();
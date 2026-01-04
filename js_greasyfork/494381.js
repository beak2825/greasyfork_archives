// ==UserScript==
// @name            Fix Korii's redability
// @name:fr         Corriger la lisibilité de Korii
// @description     Change the colors of Korii's website for a better contrast
// @description:fr  Change les couleurs du site de Korii pour en améliorer les contrastes
// @author          Deuchnord
// @version         1.0.0
// @namespace       https://deuchnord.fr/userscripts#readable-korii
// @match           https://korii.slate.fr/*
// @icon            data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' xmlns:xhtml='http://www.w3.org/1999/xhtml'%3E%3Cg fill='%23fb7600'%3E%3Crect width='1024' height='1024' fill='%23fb7600'/%3E%3C/g%3E%3Cpolygon points='221.5 112 401.1 112 401.1 532.4 568.9 339.7 782.1 339.7 577.7 552.9 804 910.5 592.3 910.5 456.5 682.8 399.6 742.7 399.6 912 220 912 220 112' fill='%23fff'/%3E%3Cxhtml:style%3E.korii header %7Bbackground: transparent;%7D.korii header &amp;gt; .header-top, .korii header &amp;gt; .header-sub %7Bbackground: %23fb7600;%7D.korii .header-top %7Bborder-bottom: none;%7D.korii header .header-top .header-right-part .btns .burger &amp;gt; div,.korii header .header-top .header-right-part .btns .burger &amp;gt; div::before,.korii header .header-top .header-right-part .btns .burger &amp;gt; div::after%7Bbackground: %23777;%7Dheader .link-category %7Bfont-size: 1.6rem;%7D.korii .article-header-infos a, .korii .article-header-infos span %7Bcolor: %239b4a00;%7D.article-thumb .legend-container %7Bcolor: rgb(34, 23, 34);%7D.korii .article-content .content-left h3,.korii .article-content .content-left .h3,.korii .article-content .content-left h4,.korii .article-content .content-left .h4,.korii .article-content .content-left h5,.korii .article-content .content-left .h5%7Bcolor: %239b4a00;%7D.korii .article-content .content-left a %7Btext-decoration-color: %239b4a00;%7D.korii .article-content .content-left a:hover %7Bcolor: %239b4a00;%7D.korii .newsletter %7Bbackground: %239b4a00;%7D.korii .newsletter .newsletter__title span.newsletter__suptitle,.korii .newsletter .newsletter__title span.newsletter__subtitle %7Bcolor: white;%7D.newsletter .newsletter__inner form input %7Bcolor: %23221722;%7D.korii .sharing-btns .sharing-btn:not(.sharing-btn--link),.korii .sharing-btns .sharing-btn--link span,.korii .sharing-btns .sharing-btn:not(.sharing-btn--link):hover,.korii .sharing-btns .sharing-btn--link:hover span%7Bborder-color: %239b4a00;%7D.korii .sharing-tools .sharing-btn i %7Bbackground-position: center 0;%7D.korii footer .footer-links .social .social-btns button %7Bbackground: %23fb7600;border: %239b4a00;%7D%3C/xhtml:style%3E%3C/svg%3E
// @license         AGPL-3.0
// @grant           GM_addStyle
// @inject-into     content
// @downloadURL https://update.greasyfork.org/scripts/494381/Fix%20Korii%27s%20redability.user.js
// @updateURL https://update.greasyfork.org/scripts/494381/Fix%20Korii%27s%20redability.meta.js
// ==/UserScript==

(function () {

    const MAIN_COLOR = "#fb7600";
    const TEXT_SEC_COLOR = "#9b4a00";
    const LIGHT_GREY = "#777"
    const FORM_INPUT_TEXT_COLOR = "#221722";
    const SMALL_TEXT_COLOR = "rgb(34, 23, 34)";
  
    GM_addStyle(`
  
        .korii header {
            background: transparent;
        }
        
        .korii header > .header-top, .korii header > .header-sub {
            background: ${MAIN_COLOR};
        }
        
        .korii .header-top {
            border-bottom: none;
        }
        
        .korii header .header-top .header-right-part .btns .burger > div,
        .korii header .header-top .header-right-part .btns .burger > div::before,
        .korii header .header-top .header-right-part .btns .burger > div::after
        {
            background: ${LIGHT_GREY};
        }
        
        header .link-category {
            font-size: 1.6rem;
        }
        
        .korii .article-header-infos a, .korii .article-header-infos span {
            color: ${TEXT_SEC_COLOR};
        }
        
        .article-thumb .legend-container {
            color: ${SMALL_TEXT_COLOR};
        }
        
        .korii .article-content .content-left h3,
        .korii .article-content .content-left .h3,
        .korii .article-content .content-left h4,
        .korii .article-content .content-left .h4,
        .korii .article-content .content-left h5,
        .korii .article-content .content-left .h5
        {
            color: ${TEXT_SEC_COLOR};
        }
        
        .korii .article-content .content-left a {
            text-decoration-color: ${TEXT_SEC_COLOR};
        }
        
        .korii .article-content .content-left a:hover {
            color: ${TEXT_SEC_COLOR};
        }
        
        .korii .newsletter {
            background: ${TEXT_SEC_COLOR};
        }
        
        .korii .newsletter .newsletter__title span.newsletter__suptitle,
        .korii .newsletter .newsletter__title span.newsletter__subtitle {
            color: white;
        }
        
        .newsletter .newsletter__inner form input {
            color: ${FORM_INPUT_TEXT_COLOR};
        }
        
        .korii .sharing-btns .sharing-btn:not(.sharing-btn--link),
        .korii .sharing-btns .sharing-btn--link span,
        .korii .sharing-btns .sharing-btn:not(.sharing-btn--link):hover,
        .korii .sharing-btns .sharing-btn--link:hover span
        {
            border-color: ${TEXT_SEC_COLOR};
        }
        
        .korii .sharing-tools .sharing-btn i {
            background-position: center 0;
        }
        
        .korii footer .footer-links .social .social-btns button {
            background: ${MAIN_COLOR};
            border: ${TEXT_SEC_COLOR};
        }

    `);
  
})();

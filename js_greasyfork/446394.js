// ==UserScript==
// @name         Old Ecosia design
// @version      1.3
// @description  Restores the Ecosia design prior to 09-06-2022
// @author       Kaassoufflé
// @match        https://www.ecosia.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @namespace net.kaassouffle.OldEcosiaTheme
// @downloadURL https://update.greasyfork.org/scripts/446394/Old%20Ecosia%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/446394/Old%20Ecosia%20design.meta.js
// ==/UserScript==

function style() {
    try{
GM_addStyle ( `
    /* Change font of all elements */
    :not(.tree-counter__number) {
        font-family: Helvetica,Arial,sans-serif !important;
    }

    /* Change font of total tree counter on homepage, because of the spacing of Helvitica, commas are visible above the counter */
    .tree-counter__number {
        font-family: Arial,sans-serif;
    }

    /* Color scheme */

    :root {
        --color-brand-primary: #36acb8;
        --color-button-content-tertiary: #36acb8;
        --color-link-primary: #438de0;
        --color-button-background-primary: #438de0;
        --color-button-background-primary-hover: #438de0;
        --color-button-background-primary-active: #2d80dc;

        --color-brand-secondary: #353535;
        --color-error: #d63232;
        --color-success: #36acb8;
        --color-disabled: #bbb;
        --color-border: #e0e0e0;
        --color-form-border-primary-active: #36acb8;
        --color-highlight-primary: #e2f6f7;
        --color-highlighter: #c3eeef;

    }

    /* Search box */

    .search-form__search-field[data-v-f9b8ea00] {
        border-radius: 6px;
    }

    .search-form__input-wrapper[data-v-f9b8ea00] {
        border-radius: 6px 0 0 6px;
    }

    .search-form__submit[data-v-f9b8ea00] {
        border-radius: 0 6px 6px 0;
        color: #767676;
    }
    .search-form--variant-compact .search-form__search-field[data-v-f9b8ea00] {
        box-shadow: none;
    }
    .search-form__submit:hover svg path {
        fill: rgb(53, 53, 53);
    }

    .search-form__submit[data-v-f9b8ea00]:hover {
        color: unset;
        background-color: unset;
        border-color: var(--color-form-border-default);
    }

    .search-form:focus-within .search-form__submit[data-v-f9b8ea00] {
        color: unset;
        background-color: unset;
        border-color: var(--color-form-border-default);
    }

    /* Position logo correctly */

    .main-header__logo-link[data-v-b81e4334] {
        width: 70px;
        height: 50px;
    }

    /* Tree counter, news button and menu button */

    .main-header__navigation .base-button--variant-solid-white[data-v-48aa256c] {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 40px;
        min-width: 40px;
        font-size: 11px;
        padding: 0 10px;
        border: solid #e0e0e0 1px;
        border-radius: 20px;
    }

` );
    } catch(e) {
        setTimeout(function () {style()}, 10)
    }
}
style();

function changeFavicon() {
    try{
        var faviconLink = document.querySelector('link[rel="shortcut icon"]');
        faviconLink.href = 'https://raw.githubusercontent.com/Kaassouffleetje/OldEcosiaTheme/main/favicon.ico';
    } catch(e) {
        setTimeout(function () {changeFavicon()}, 10)
    }
}
changeFavicon();

// Change logo
    // Check if we're on the homepage
var home = false;
if(location.pathname == "/") home = true;

function changeLogo() {
    try{
        var logoDiv = document.querySelector(".logo");
        logoDiv.innerHTML = '<svg id="svgLogo" width="70" height="50" viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(.313)" fill="none" fill-rule="evenodd"><path fill="#36ACB8" d="M47.783 36.587c-1.677-1.12-2.515-.54-2.515-.54a3.542 3.542 0 001.292 2.38c.832.66 1.876.996 2.937.946a3.678 3.678 0 00-1.714-2.786zm-25.1 6.49a5.003 5.003 0 00-.666 3.743s1.363.384 3.078-1.855a5.16 5.16 0 001.011-4.44 5.911 5.911 0 00-3.418 2.569l-.005-.017zm-5.279-5.105a3.542 3.542 0 00-1.293 2.38s.839.54 2.515-.541a3.678 3.678 0 001.715-2.764 4.213 4.213 0 00-2.932.941l-.005-.016zm15.522 4.473a4.721 4.721 0 00-1.536 3.288 5.625 5.625 0 001.33 3.878 4.867 4.867 0 001.623-4.019c-.12-2.71-1.417-3.131-1.417-3.131v-.016zm9.124-.033a3.52 3.52 0 00.454 2.656 4.278 4.278 0 002.482 1.817 3.656 3.656 0 00-.735-3.148c-1.255-1.59-2.201-1.309-2.201-1.309v-.016zm5.733-30.936a3.678 3.678 0 001.736-2.774 4.213 4.213 0 00-2.937.946 3.542 3.542 0 00-1.293 2.38s.817.579 2.494-.535v-.017zM18.35 13.678a3.678 3.678 0 00-1.714-2.764c-1.677-1.12-2.515-.54-2.515-.54a3.542 3.542 0 001.293 2.379 4.175 4.175 0 002.936.94v-.015zm5.56-6.058a3.656 3.656 0 00-.735-3.147c-1.223-1.623-2.202-1.33-2.202-1.33a3.52 3.52 0 00.455 2.655A4.197 4.197 0 0023.91 7.62zm18.93-1.957a5.014 5.014 0 001.01-4.37 5.95 5.95 0 00-3.423 2.514 4.797 4.797 0 00-.627 3.705s1.341.379 3.056-1.86l-.017.01zM32.595 3.705A4.516 4.516 0 0031.092 0a5.257 5.257 0 00-1.222 3.564 4.327 4.327 0 001.433 3.007s1.206-.395 1.31-2.877l-.017.01z"></path><path fill="#4A4A4A" d="M3.845 36.971L0 20.925l6.885-1.623.595 2.445-4.473 1.082 1.05 4.37L7.3 26.43l.595 2.444-3.245.768 1.05 4.37 4.472-1.082.595 2.445zm11.882-2.341a3.786 3.786 0 01-2.936-.666 3.921 3.921 0 01-1.623-2.552l-1.503-8.88a3.786 3.786 0 01.665-2.938 3.872 3.872 0 012.553-1.622 3.878 3.878 0 014.51 3.218l.314 1.855-2.553.422-.314-1.92a1.39 1.39 0 00-.594-.947 1.309 1.309 0 00-1.082-.243c-.378.05-.712.269-.909.595a1.44 1.44 0 00-.243 1.082l1.574 8.95c.045.365.242.695.54.909.304.218.682.306 1.05.243.373-.053.711-.246.946-.54a1.26 1.26 0 00.244-1.05l-.379-2.244 2.553-.422.384 2.271a3.786 3.786 0 01-.665 2.937 4.002 4.002 0 01-2.532 1.542zm39.363-4.09a4.408 4.408 0 01-1.331 2.764 3.445 3.445 0 01-1.855.91c-.465.076-.94.065-1.401-.033a3.872 3.872 0 01-2.272-1.082 4.05 4.05 0 01-1.01-1.785 5.895 5.895 0 01-.174-2.38l2.38.174c-.09.751.07 1.511.454 2.163.205.34.553.57.946.627a1.53 1.53 0 001.401-.595c.248-.296.396-.663.422-1.049a3.04 3.04 0 00-.627-2.163c-.422-.541-1.05-1.33-1.855-2.412a9.389 9.389 0 01-1.401-2.38 5.408 5.408 0 01-.211-2.38 4.056 4.056 0 012.028-3.147 3.83 3.83 0 012.38-.352 4.25 4.25 0 012.163.947c.453.39.791.897.979 1.465.224.627.308 1.296.243 1.958l-2.412.07a2.704 2.704 0 00-.351-1.622 1.19 1.19 0 00-.909-.54 1.082 1.082 0 00-1.12.453c-.26.332-.418.732-.454 1.152a3.694 3.694 0 00.628 2.413c.291.425.607.833.946 1.222.354.372.682.77.979 1.19.463.608.84 1.278 1.12 1.99.108.27.19.551.243.838a6.49 6.49 0 01.07 1.585zm2.936 4.863l-2.445-.487 3.321-16.15 2.445.488zm5.208-2.693l-1.536 3.531-2.515-.627 6.815-15.24 3.32.837-1.411 16.636-2.515-.665.384-3.786-2.542-.686zm3.494-8.318l-2.515 6.046 1.785.454.73-6.5z"></path><path fill="#FF7950" d="M20.161 24.23c0 7.15 5.796 12.945 12.946 12.945 7.15 0 12.945-5.796 12.945-12.945 0-7.15-5.796-12.945-12.945-12.945-7.15 0-12.946 5.796-12.946 12.945zm2.358 4.388a11.436 11.436 0 0114.924-14.966 11.435 11.435 0 017.067 10.567 11.417 11.417 0 01-11.403 11.435h-.033a11.436 11.436 0 01-10.555-7.036z"></path><path fill="#36ACB8" d="M23.613 24.233c0 5.242 4.25 9.493 9.493 9.493a9.494 9.494 0 100-18.987 9.494 9.494 0 00-9.493 9.494z"></path><path fill="#D3DA31" d="M25.087 19.15c.127-.024.25-.03.343-.064.192-.107.372-.236.535-.384.138-.062.249-.021.35.02.13.05.245.101.383-.052.248-.276-.102-.839-.102-1.19a.637.637 0 01.057-.212 9.557 9.557 0 00-1.566 1.882zm-1.379 3.744a9.38 9.38 0 00-.06.558 9.625 9.625 0 00-.035.798 9.453 9.453 0 001.128 4.471c.1-.096.202-.166.301-.27.14-.244.313-.487.453-.736.292-.178.572-.376.837-.595.07-.21.172-.454.242-.665.07-.21.485-.486.42-.875-.156-.551-.857-.622-1.24-1.006-.173-.243-.35-.54-.539-.768-.399-.46-.918-.8-1.499-.978l-.008.066zm10.315-5.435c-.458.124-.87.38-1.187.735-.242.384.07.627-.382.838a3 3 0 01-.696-.454.64.64 0 00-.486.28c-.032.422.28.487.28.909-.172.244-.593.281-.695.541-.103.26 0 .665-.21.908a23.4 23.4 0 00-.906.876 1.971 1.971 0 00.14 2.38c.236.237.54.229.863.22.247-.006.506-.013.754.093.421.173.486.978.593 1.363.211.626-.172.908-.172 1.502 0 .595.21 2.309 1.047 2.271.944-.032 1.15-.978 1.672-1.622.232-.173.432-.386.594-.627 0-.313.032-.665.032-.978.21-.541.873-.736 1.219-1.152.345-.417.032-.698.21-1.012a.032.032 0 00.033-.032c.28-.173.539-.314.873-.486.132-.17.272-.332.421-.487l.313-.102c1.078.54.696 1.675 1.462 2.27.07-.032.102-.07.172-.102.058-.157.092-.321.103-.487.16-.488.64-.795 1.149-.736.335.333.586.74.733 1.19.07.422-.21.665-.21 1.01.032.3.144.583.317.827v-.001c.35-.99.543-2.054.543-3.164v-.003c0-.156-.004-.311-.012-.465l-.004-.073a9.461 9.461 0 00-2.635-6.037 4.037 4.037 0 00-.632.033c-.98.164-1.968.269-2.96.314-.822 0-1.296-.582-2.004-.582-.105 0-.215.012-.332.042zm.189 4.39c-.243-.033-.54-.033-.766-.07-.032 0-1.257-.979-1.29-1.05a.416.416 0 01.243-.243c.318.135.612.317.874.541l.486.103c.172.14.35.243.54.384.213.076.436.124.662.14 0 .032.033.07.033.103v.173a1.153 1.153 0 00-.243.092.961.961 0 01-.54-.173z"></path><path fill="#D3DA31" d="M35.868 28.018c-.346.194-.569.55-.593.947.052.105.137.19.242.243.384-.141.804-.768.54-1.152a.314.314 0 00-.153-.04.29.29 0 00-.036.002z"></path><path fill="#D3DA31" d="M28.112 16.156a.78.78 0 01.172.28 1.226 1.226 0 00-.21.768.505.505 0 00.242.352 2.463 2.463 0 001.046-.352c.35-.07.734-.102 1.08-.173.345-.07 1.137-.708.857-1.194-.172-.07-.488-.18-.54-.174a3.883 3.883 0 01-1.525-.101 9.39 9.39 0 00-1.122.594z"></path></g></svg>';

        // The Vue script sets the viewBox of the logo to the wrong size. This observer looks for that event and changes the viewbox to the correct size.

        VM.observe(document.body, () => {
            var svgLogo = document.querySelector("#svgLogo");
            if(svgLogo) {
                var wrongVB = svgLogo.getAttribute("viewBox") == "0 0 70 20";
                if(svgLogo && wrongVB) {
                    svgLogo.setAttribute("viewBox", "0 0 70 50");
                    return true;
                }
            }
        })
    } catch(e) {
        setTimeout(function() {changeLogo()}, 1)
    }
}
if(!home) changeLogo();


// Change tree-counter
function changeTree() {
    var treeSvg = document.querySelector(".icon--icon-tree-color");
    treeSvg.innerHTML = '<g fill="none" fill-rule="evenodd">        <path fill="#B7D66C" d="M11.225 19.173c-.006-.151-.009-.291-.01-.428a27.1 27.1 0 0 0-.417.014c-.321.015-.65.053-.999.115-.443.092-.918.092-1.362.154-.253.031-.887.062-.855.34.032.339.792.4 1.045.432.475.061.797.273 1.299.339.617.081 1.18.046 1.71.031.887-.026 2.597-.446 3.105-.494.254-.024.474-.129.412-.401-.035-.154-.112-.206-.26-.23-.507-.085-.817-.14-1.26-.202a11.057 11.057 0 0 0-1.72-.11c-.023.139-.045.281-.066.432l-.622.008z"></path>        <path fill="#805A3F" d="M16.374 10.675a.904.904 0 0 1-.194-.121 2.734 2.734 0 0 1-.533.227c-.647.205-1.386.389-2.195 1.284 0 0 .36-1.303 1.568-1.973a1.81 1.81 0 0 0 .382-.361c-.035-.026-.07-.052-.107-.072a1.064 1.064 0 0 0-.352-.108c-.254.145-.71.312-1.069.6-.327.296-.64.63-.886 1.125-.266.523-.45 1.026-.68 1.835.01-.404.095-1.03-.02-1.472-.113-.545-.324-.873-.654-1.303 0 0-.276-.389-.285-.93-.165-.009-.33-.015-.495-.016-.032.294-.015.914.518 1.558.634.764.136 1.693.153 1.717-.314-.336-1.072-.736-1.69-1.066 0 0-.723-.311-1.378-.71-.271-.182-.5-.401-.685-.638-.041.02-.083.038-.128.058a1.912 1.912 0 0 1-.48.132c.204.39.502.668.903.938.976.655 2.013.99 2.637 1.758 0 0 .623.692.575 2.365 0 1.104-.067 1.94-.063 3.035 0 .203.003.412.009.636l.622-.012c.022-.224.043-.435.066-.64.255-2.34.57-3.55 1.435-4.93.649-1.032 1.287-1.578 2.187-1.993a4.515 4.515 0 0 0 1.265-.821 1.17 1.17 0 0 1-.426-.102"></path>        <path fill="#368C0E" d="M20.175 8.885c-.47-.06-.97-.089-1.444 0-.546.102-.967.462-1.49.55-1.036.173-2.631.118-3.69-.062-.452-.077-.799-.357-1.236-.447-.627-.13-1.527-.03-2.185-.066-.944-.052-1.747-.041-2.637.247-1.31.425-1.683-.269-2.876-.313-.68-.025-1.81.209-2.344-.364a.997.997 0 0 1-.212-.35c.06.351.22.638.511.922.418.407 1.09.376 1.448.655.316.246.57.655 1.024.85.698.299 1.435.463 2.12.39.163-.017.324-.043.48-.089l.128-.039c.77-.241 1.04-.455 2.094-.545.33-.028.66-.037.988-.035.165.002.33.005.496.012.781.028 1.562.1 2.347.12.372.009.84-.061 1.246-.022.124.011.244.033.352.071.038.014.072.032.107.05.292.144.487.4.778.553.06.032.123.06.194.082.152.045.293.064.426.068.732.02 1.215-.497 1.932-.668.271-.064.613.024.871-.112.49-.257.338-.685.663-.985.305-.282.938-.416 1.235-.732-.322.228-.867.319-1.326.26"></path>        <path fill="#60B234" d="M21.535 7.596c-.257-.312-.988-.494-1.3-1.016-.503-.836-1.076-1.148-2.042-1.295-.882-.134-1.51-.01-2.393-.155-.903-.148-1.128-.703-1.9-.925-.986-.284-2.283-.206-3.295-.155-1.218.097-2.682-.02-3.87.287-.914.237-1.34 1.037-2.26 1.3-.971.28-1.624.442-2.168 1.194-.25.346-.397.829-.246 1.25a1 1 0 0 0 .212.348c.533.574 1.664.34 2.344.365 1.193.044 1.566.738 2.875.313.89-.288 1.694-.3 2.638-.247.658.037 1.558-.065 2.185.065.437.091.784.371 1.236.448 1.058.18 2.654.235 3.69.062.523-.088.944-.449 1.49-.55.473-.089.974-.06 1.444 0 .46.06 1.004-.031 1.326-.258.312-.22.416-.567.034-1.03"></path>    </g>';
};
// Tree-counter html element is not available right away
function tryCatchTree() {
    try{
        changeTree();
    } catch (e) {
        setTimeout(function() {tryCatchTree()}, 1);
    }
}
tryCatchTree();

// Footer. Only sometimes isn't available right away
function tryCatchFooter() {
    try{
        // For some reason, deleting the footer causes the tree counter to dissapear. So the script hides the footer instead
        var footerCont = document.querySelector(".main-footer__card-container");
        footerCont.style.visibility = "hidden";
        var footerImg = document.querySelector(".main-footer__background");
        footerImg.setAttribute("height", 0);
        var footerWave = document.querySelector(".main-footer__wave");
        footerWave.style.visibility = "hidden";
    } catch (e) {
        setTimeout(function() {tryCatchFooter()}, 1000);
    }
}
if(!home) tryCatchFooter();

// ==UserScript==
// @name        pixeldrain improved (sort by size, markers and modal)
// @namespace   Violentmonkey Scripts
// @icon        data:image/png;base64,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
// @match       https://pixeldrain.com/l/*
// @version     1.1.9
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @author      dummy_mole
// @license     GNU GPLv3
// @description Improves the user experience on pixeldrain by adding a sort by size button, markers on viewed files and file playback in a modal window.
// @downloadURL https://update.greasyfork.org/scripts/494604/pixeldrain%20improved%20%28sort%20by%20size%2C%20markers%20and%20modal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494604/pixeldrain%20improved%20%28sort%20by%20size%2C%20markers%20and%20modal%29.meta.js
// ==/UserScript==

(() => {

    'use strict';

    //===================================script config panel part====================================

    const defaultConfig = { "auto_sort_file": false, "show_file_size": true, "seen_file": false, "viewing_file_method": "2" };

    function createConfigPanel() {

        // DOM creation
        const configPanel = `
          <div class="config-panel-container slide-in-top">
            <h1 class="config-panel-title">Pixeldrain configuration</h1>
            <span class="separator"></span>
            <div class="panel">
                <div class="setting-elements">
                    <div class="auto-sort-container" title="automatically sorts files">
                        <input id="auto-sort" type="checkbox">
                        <label for="auto-sort">Auto sort files</label>
                    </div>
                    <div class="show-filesize-container" title="displays the file size below its title">
                        <input id="show-filesize" type="checkbox">
                        <label for="show-filesize">Display files size</label>
                    </div>
                    <div class="seen-file-container" title="add blue border to files seen">
                        <input id="seen-file" type="checkbox">
                        <label for="seen-file">Mark viewed files</label>
                    </div>
                    <span class="separator"></span>
                    <div class="watch-file-method" title="method used to watch files">
                        <label for="file-viewing-method">File viewing method</label>
                        <select name="file-viewing-method" id="file-viewing-method">
                            <option title="pixeldrain default behavior" value="1">default</option>
                            <option title="open file in a new tab" value="2">new tab</option>
                            <option title="view a file in a modal window from the current page and add a button to download it" value="3">modal</option>
                        </select>
                    </div>
                </div>
                <span class="separator"></span>
                <div class="validation-buton-container">
                    <button class="save-btn">save</button>
                    <button class="reset-btn">reset</button>
                    <button class="cancel-btn">cancel</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', configPanel);

        //---------------------------------------------------------------------------------------------

        function slideOutAndRemove(element, classOut, classIn) {
            element.classList.remove(classOut);
            element.classList.add(classIn);
            setTimeout(() => element.remove(), 1000);
        }

        const configPanelContainer = document.querySelector('.config-panel-container');
        const autoSortCheckbox = document.querySelector('#auto-sort');
        const showFileSizeCheckbox = document.querySelector('#show-filesize');
        const seenFileCheckbox = document.querySelector('#seen-file');
        const viewedFileMethodSelect = document.querySelector('#file-viewing-method');
        const saveBtn = document.querySelector('.save-btn');
        const resetBtn = document.querySelector('.reset-btn');
        const cancelBtn = document.querySelector('.cancel-btn');

        // Load configuration values from script's local storage or use default values
        let config = JSON.parse(GM_getValue("pixeldrain_cfg", defaultConfig));

        // Updates user interface elements with current configuration values
        autoSortCheckbox.checked = config.auto_sort_file;
        showFileSizeCheckbox.checked = config.show_file_size;
        seenFileCheckbox.checked = config.seen_file;
        viewedFileMethodSelect.value = config.viewing_file_method;

        // Updates configuration when user interface elements change
        autoSortCheckbox.onchange = function () { config.auto_sort_file = this.checked; };
        showFileSizeCheckbox.onchange = function () { config.show_file_size = this.checked; };
        seenFileCheckbox.onchange = function () { config.seen_file = this.checked; };
        viewedFileMethodSelect.onchange = function () { config.viewing_file_method = this.value; };

        // Saves configuration to script's local storage when user clicks "Save"
        saveBtn.onclick = function () {
            GM_setValue("pixeldrain_cfg", JSON.stringify(config));
            location.reload();
        };

        // Resets the configuration to default values when the user clicks on "Reset".
        resetBtn.onclick = function () {
            config = defaultConfig;
            autoSortCheckbox.checked = defaultConfig.auto_sort_file;
            showFileSizeCheckbox.checked = defaultConfig.show_file_size;
            seenFileCheckbox.checked = defaultConfig.seen_file;
            viewedFileMethodSelect.value = defaultConfig.viewing_file_method;
            GM_setValue("pixeldrain_cfg", JSON.stringify(defaultConfig));
            location.reload();
        };

        // Cancels changes made to the configuration when the user clicks on "Cancel".
        cancelBtn.onclick = function () {
            slideOutAndRemove(configPanelContainer, "slide-in-top", "slide-out-top");
        };

        //------------------------------------config panel css style-----------------------------------

        const configPanelStyle = `.config-panel-container{position:fixed!important;top:10px;right:10px;z-index:10001;display:flex;flex-direction:column;min-width:250px!important;max-width:320px!important;background:linear-gradient(0deg,#141617 0,rgba(27,27,28,.9) 50%,rgba(33,34,36,.9) 100%)!important;box-shadow:6px 6px 5px #00000069!important;padding:5px 15px!important;border:1px solid #282828!important;border-radius:5px!important;font-family:inherit;backdrop-filter:blur(15px);width:265px}.config-panel-title{margin:10px auto;padding-bottom:5px;color:#159cff!important;font-size:20px!important;font-weight:600}#file-viewing-method,.panel{color:#aaa!important}.auto-sort-container,.seen-file-container,.show-filesize-container,.watch-file-method{margin:10px auto}.separator{display:block;width:98%;height:1px;background:#fdfdfd0d}.validation-buton-container{display:flex;justify-content:space-evenly;margin:10px auto}.validation-buton-container>button{display:block;font-size:16px!important;color:#f5f5f5!important;background:#0087ff;border:transparent!important;border-radius:3px!important;height:30px!important;padding:0 10px!important;width:66px;box-shadow:unset!important}#file-viewing-method{background:#2d2d2d!important;border-radius:5px!important;border:1px solid #424242!important;width:70px!important;height:25px!important;text-align:center!important;padding:unset!important;box-shadow:unset!important}#file-viewing-method>option{background:#2d2d2d!important;color:#aaa!important}.cancel-btn{background:#4a4949!important}.slide-in-top{-webkit-animation:.9s cubic-bezier(.25,.46,.45,.94) both slide-in-top;animation:.9s cubic-bezier(.25,.46,.45,.94) both slide-in-top}.slide-out-top{-webkit-animation:.9s cubic-bezier(.55,.085,.68,.53) both slide-out-top;animation:.9s cubic-bezier(.55,.085,.68,.53) both slide-out-top}@-webkit-keyframes slide-in-top{0%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}75%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes slide-in-top{0%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}75%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes slide-out-top{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}25%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px);opacity:0}}@keyframes slide-out-top{0%{-webkit-transform:translateY(0);transform:translateY(0)}25%{-webkit-transform:translateY(20px);transform:translateY(20px)}100%{-webkit-transform:translateY(-1000px);transform:translateY(-1000px)}}`;
        GM_addStyle(configPanelStyle);
    }

    //======================================Pixeldrain Part==========================================

    const URL = location.href;
    const API = 'https://pixeldrain.com/api/list/';

    const descendingIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="20" height="20"><path d="M0 0 C1.0374939 0.00303635 1.0374939 0.00303635 2.09594727 0.00613403 C2.80243408 0.00517731 3.5089209 0.00422058 4.23681641 0.00323486 C5.7331552 0.00255321 7.22949694 0.00440649 8.72583008 0.00857544 C11.02374884 0.01392396 13.32147213 0.00863003 15.61938477 0.00222778 C17.06990603 0.00288857 18.52042718 0.00416974 19.97094727 0.00613403 C20.66260986 0.0041098 21.35427246 0.00208557 22.06689453 0 C26.91849503 0.0239943 26.91849503 0.0239943 28.03344727 1.13894653 C28.12966763 2.84720341 28.15532355 4.55946767 28.15370178 6.27043152 C28.15576378 7.93849602 28.15576378 7.93849602 28.15786743 9.64025879 C28.15247452 11.4863121 28.15247452 11.4863121 28.14697266 13.36965942 C28.14711868 14.65727676 28.14726471 15.9448941 28.14741516 17.27153015 C28.14770312 20.81269413 28.14180663 24.35382452 28.1348412 27.89498067 C28.12860743 31.59189641 28.12800385 35.28881285 28.1268158 38.98573303 C28.12370255 45.99098552 28.11548925 52.99622248 28.10546631 60.00146812 C28.09430496 67.97473529 28.08879467 75.94800318 28.08377087 83.92127621 C28.07330663 100.32717685 28.05496123 116.7330561 28.03344727 133.13894653 C38.92344727 133.13894653 49.81344727 133.13894653 61.03344727 133.13894653 C59.51038852 136.9465934 58.6739069 138.89751323 56.26782227 141.89675903 C55.71497559 142.59454468 55.16212891 143.29233032 54.5925293 144.01126099 C53.99553223 144.75464722 53.39853516 145.49803345 52.78344727 146.26394653 C47.79006635 152.57819467 42.9054331 158.94985785 38.15844727 165.45144653 C31.11124731 175.08856554 23.88251748 184.5826516 16.62060547 194.05862427 C15.08049519 196.07727981 13.55390092 198.10545812 12.03344727 200.13894653 C8.80927227 198.76698479 7.16612556 197.36974919 5.14282227 194.52566528 C4.33844727 193.41191528 4.33844727 193.41191528 3.51782227 192.27566528 C2.94547852 191.4674231 2.37313477 190.65918091 1.78344727 189.82644653 C0.52991398 188.08955932 -0.72535933 186.35392686 -1.98217773 184.61941528 C-2.63508789 183.71626587 -3.28799805 182.81311646 -3.96069336 181.88259888 C-7.22683005 177.41511542 -10.59720532 173.02879973 -13.96655273 168.63894653 C-20.95632688 159.50965378 -27.80835908 150.28520657 -34.59472656 141.00393677 C-35.5843573 139.65853915 -36.60377233 138.3348737 -37.64111328 137.02590942 C-38.96655273 135.13894653 -38.96655273 135.13894653 -38.96655273 133.13894653 C-28.07655273 133.13894653 -17.18655273 133.13894653 -5.96655273 133.13894653 C-5.97178955 129.14551147 -5.97702637 125.15207642 -5.98242188 121.03762817 C-5.99895408 107.87801131 -6.0100733 94.71839462 -6.01836491 81.55877018 C-6.02352796 73.57613154 -6.03057082 65.59350271 -6.04199219 57.61087036 C-6.05193876 50.65570855 -6.0584061 43.70055384 -6.06064123 36.74538511 C-6.06194838 33.06042726 -6.06503452 29.37548975 -6.07228279 25.69053841 C-6.08029613 21.58356945 -6.08054389 17.47663616 -6.08007812 13.36965942 C-6.0836734 12.13895721 -6.08726868 10.908255 -6.0909729 9.64025879 C-6.08959824 8.52821579 -6.08822357 7.41617279 -6.08680725 6.27043152 C-6.08772904 5.29793992 -6.08865084 4.32544832 -6.08960056 3.32348728 C-5.85575918 -0.82803679 -3.62042256 0.01790533 0 0 Z " fill="#000000" transform="translate(38.966552734375,-0.138946533203125)"/><path d="M0 0 C10.67419698 -0.02312328 21.34838806 -0.04091501 32.02260494 -0.05181217 C36.97853922 -0.05704103 41.93445642 -0.06413874 46.89038086 -0.07543945 C51.66898836 -0.08626822 56.44757938 -0.09227681 61.2261982 -0.09487724 C63.05353619 -0.09673151 64.88087324 -0.10035216 66.70820427 -0.10573006 C69.25853329 -0.11294036 71.80879337 -0.11399095 74.35913086 -0.11352539 C75.12229614 -0.11712067 75.88546143 -0.12071594 76.67175293 -0.12442017 C81.88594784 -0.11405216 81.88594784 -0.11405216 83 1 C83.0883967 3.3756852 83.11530305 5.72208674 83.09765625 8.09765625 C83.0962413 8.80651474 83.09482635 9.51537323 83.09336853 10.24571228 C83.08775443 12.51801712 83.07519963 14.79022475 83.0625 17.0625 C83.05748681 18.59960796 83.05292359 20.13671745 83.04882812 21.67382812 C83.03778042 25.44925642 83.02050641 29.22461171 83 33 C79.98670898 34.50664551 76.87425324 34.15604857 73.56860352 34.16113281 C72.41959564 34.16858017 72.41959564 34.16858017 71.24737549 34.17617798 C68.70787668 34.19080937 66.16844032 34.19760267 63.62890625 34.203125 C61.86775205 34.20887498 60.10659788 34.21463273 58.34544373 34.22039795 C54.65078438 34.23091026 50.95614681 34.23675164 47.26147461 34.24023438 C42.52210177 34.24572423 37.78301549 34.26976166 33.04373264 34.29820633 C29.40552421 34.31680762 25.7673852 34.32203693 22.12913322 34.32357025 C20.38158537 34.32660223 18.63403889 34.33464906 16.88653755 34.34775543 C14.44439848 34.36476631 12.00296491 34.36294829 9.56079102 34.35644531 C8.83601059 34.3656601 8.11123016 34.37487488 7.36448669 34.3843689 C4.46672967 34.36013584 2.47968958 34.3287491 0.04972839 32.66340637 C-1.63727304 29.99017304 -1.3527061 27.55433412 -1.328125 24.43359375 C-1.32296875 23.14388672 -1.3178125 21.85417969 -1.3125 20.52539062 C-1.3021875 19.85483643 -1.291875 19.18428223 -1.28125 18.4934082 C-1.25005904 16.44138415 -1.24027435 14.39012839 -1.234375 12.33789062 C-1.15409729 2.30819459 -1.15409729 2.30819459 0 0 Z " fill="#000000" transform="translate(117,150)"/><path d="M0 0 C21.78 0 43.56 0 66 0 C68.11096044 4.22192087 67.22688391 9.73192764 67.24023438 14.3762207 C67.2499472 16.42635563 67.28097445 18.47549074 67.3125 20.52539062 C67.32023437 22.45995117 67.32023437 22.45995117 67.328125 24.43359375 C67.3374707 25.62009521 67.34681641 26.80659668 67.35644531 28.02905273 C67 31 67 31 65.85174561 32.66142273 C63.20950933 34.57142452 61.25747377 34.38105687 58.015625 34.38818359 C56.78424805 34.39764008 55.55287109 34.40709656 54.28417969 34.4168396 C52.93944986 34.41146989 51.59472296 34.40531694 50.25 34.3984375 C48.8714177 34.40045847 47.49283645 34.4033701 46.11425781 34.40713501 C43.22580786 34.41155735 40.33763633 34.40513058 37.44921875 34.39111328 C33.74670246 34.37402099 30.04483854 34.38386272 26.34234619 34.40183067 C23.49588098 34.41267121 20.64957045 34.40922103 17.80310059 34.4014473 C16.43794681 34.39944601 15.07277898 34.40190208 13.7076416 34.40888596 C11.7998888 34.4165039 9.89208676 34.40283406 7.984375 34.38818359 C6.35580566 34.38460342 6.35580566 34.38460342 4.69433594 34.38095093 C2 34 2 34 0.14825439 32.66142273 C-1.68175608 30.01355914 -1.35310995 27.60560586 -1.328125 24.43359375 C-1.32296875 23.14388672 -1.3178125 21.85417969 -1.3125 20.52539062 C-1.3021875 19.85483643 -1.291875 19.18428223 -1.28125 18.4934082 C-1.25005904 16.44138415 -1.24027435 14.39012839 -1.234375 12.33789062 C-1.15409729 2.30819459 -1.15409729 2.30819459 0 0 Z " fill="#000000" transform="translate(117,100)"/><path d="M0 0 C6.96003447 -0.02526838 13.9200572 -0.04283222 20.88012695 -0.05493164 C23.24992312 -0.05997341 25.61971615 -0.06680665 27.98950195 -0.07543945 C31.38754039 -0.0875119 34.78553785 -0.09322971 38.18359375 -0.09765625 C39.25024765 -0.10281754 40.31690155 -0.10797882 41.4158783 -0.11329651 C42.88729027 -0.11340981 42.88729027 -0.11340981 44.38842773 -0.11352539 C45.25668686 -0.115746 46.12494598 -0.11796661 47.01951599 -0.12025452 C49 0 49 0 50 1 C50.21832989 5.39998945 50.18579146 9.80534812 50.18530273 14.21020508 C50.18748751 16.42483782 50.20563531 18.63897123 50.22460938 20.85351562 C50.22754356 22.25520662 50.22952819 23.6569 50.23046875 25.05859375 C50.23457764 26.34048584 50.23868652 27.62237793 50.24291992 28.94311523 C50 32 50 32 48 34 C46.03334045 34.26069641 46.03334045 34.26069641 43.59790039 34.2746582 C42.68677994 34.28419022 41.77565948 34.29372223 40.83692932 34.30354309 C39.85046921 34.30263168 38.86400909 34.30172028 37.84765625 34.30078125 C36.8365831 34.30506638 35.82550995 34.3093515 34.78379822 34.31376648 C32.64273834 34.31951661 30.50165892 34.32000504 28.3605957 34.31567383 C25.07925157 34.31251612 21.79881053 34.33595714 18.51757812 34.36132812 C16.44010531 34.36360121 14.36263006 34.36430457 12.28515625 34.36328125 C11.30072037 34.372491 10.31628448 34.38170074 9.30201721 34.39118958 C8.3877446 34.38496078 7.47347198 34.37873199 6.53149414 34.37231445 C5.32475792 34.37325859 5.32475792 34.37325859 4.09364319 34.3742218 C1.46568283 33.90449512 0.58152166 33.12188739 -1 31 C-1.35644531 28.02905273 -1.35644531 28.02905273 -1.328125 24.43359375 C-1.32296875 23.14388672 -1.3178125 21.85417969 -1.3125 20.52539062 C-1.3021875 19.85483643 -1.291875 19.18428223 -1.28125 18.4934082 C-1.25005904 16.44138415 -1.24027435 14.39012839 -1.234375 12.33789062 C-1.15409729 2.30819459 -1.15409729 2.30819459 0 0 Z " fill="#000000" transform="translate(117,50)"/><path d="M0 0 C4.53897705 -0.02465392 9.07791543 -0.04283789 13.61694336 -0.05493164 C15.16219766 -0.0599714 16.70744716 -0.0668032 18.25268555 -0.07543945 C20.46925029 -0.08752076 22.68575218 -0.09323173 24.90234375 -0.09765625 C25.5971434 -0.10281754 26.29194305 -0.10797882 27.00779724 -0.11329651 C28.6722933 -0.11349277 30.33665499 -0.06189129 32 0 C33 1 33 1 33.11352539 4.05102539 C33.11336634 5.39991271 33.10767612 6.74880614 33.09765625 8.09765625 C33.0962413 8.80651474 33.09482635 9.51537323 33.09336853 10.24571228 C33.08775443 12.51801712 33.07519963 14.79022475 33.0625 17.0625 C33.05748681 18.59960796 33.05292359 20.13671745 33.04882812 21.67382812 C33.03778042 25.44925642 33.02050641 29.22461171 33 33 C28.77807913 35.11096044 23.26807236 34.22688391 18.6237793 34.24023438 C16.57364437 34.2499472 14.52450926 34.28097445 12.47460938 34.3125 C11.18490234 34.31765625 9.89519531 34.3228125 8.56640625 34.328125 C6.78665405 34.34214355 6.78665405 34.34214355 4.97094727 34.35644531 C2 34 2 34 0.11010742 32.88989258 C-1.55450484 30.05598814 -1.35385139 27.69973641 -1.328125 24.43359375 C-1.32296875 23.14388672 -1.3178125 21.85417969 -1.3125 20.52539062 C-1.3021875 19.85483643 -1.291875 19.18428223 -1.28125 18.4934082 C-1.25005904 16.44138415 -1.24027435 14.39012839 -1.234375 12.33789062 C-1.15409729 2.30819459 -1.15409729 2.30819459 0 0 Z " fill="#000000" transform="translate(117,0)"/></svg>`;
    const ascendingIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="20" height="20"><path d="M0 0 C3.22417499 1.37196174 4.8673217 2.76919734 6.890625 5.61328125 C7.426875 6.35578125 7.963125 7.09828125 8.515625 7.86328125 C9.08796875 8.67152344 9.6603125 9.47976563 10.25 10.3125 C11.50353328 12.04938722 12.7588066 13.78501968 14.015625 15.51953125 C14.66853516 16.42268066 15.32144531 17.32583008 15.99414062 18.25634766 C19.26027731 22.72383111 22.63065259 27.11014681 26 31.5 C32.98977415 40.62929275 39.84180635 49.85373996 46.62817383 59.13500977 C47.61780456 60.48040738 48.63721959 61.80407283 49.67456055 63.11303711 C51 65 51 65 51 67 C40.11 67 29.22 67 18 67 C18.00523682 70.99343506 18.01047363 74.98687012 18.01586914 79.10131836 C18.03240134 92.26093522 18.04352056 105.42055192 18.05181217 118.58017635 C18.05697522 126.562815 18.06401809 134.54544383 18.07543945 142.52807617 C18.08538602 149.48323799 18.09185336 156.43839269 18.09408849 163.39356142 C18.09539565 167.07851927 18.09848179 170.76345678 18.10573006 174.44840813 C18.1137434 178.55537708 18.11399116 182.66231037 18.11352539 186.76928711 C18.11712067 187.99998932 18.12071594 189.23069153 18.12442017 190.49868774 C18.1230455 191.61073074 18.12167084 192.72277374 18.12025452 193.86851501 C18.12117631 194.84100661 18.1220981 195.81349821 18.12304783 196.81545925 C18 199 18 199 17 200 C14.63601532 200.1007812 12.30188689 200.13973215 9.9375 200.1328125 C9.23101318 200.13376923 8.52452637 200.13472595 7.79663086 200.13571167 C6.30029207 200.13639333 4.80395033 200.13454005 3.30761719 200.13037109 C1.00969843 200.12502257 -1.28802486 200.13031651 -3.5859375 200.13671875 C-5.03645877 200.13605797 -6.48697991 200.1347768 -7.9375 200.1328125 C-8.9749939 200.13584885 -8.9749939 200.13584885 -10.03344727 200.13894653 C-14.88504776 200.11495224 -14.88504776 200.11495224 -16 199 C-16.09622036 197.29174312 -16.12187628 195.57947886 -16.12025452 193.86851501 C-16.12162918 192.75647202 -16.12300385 191.64442902 -16.12442017 190.49868774 C-16.11902725 188.65263443 -16.11902725 188.65263443 -16.11352539 186.76928711 C-16.11367142 185.48166977 -16.11381744 184.19405243 -16.1139679 182.86741638 C-16.11425586 179.3262524 -16.10835936 175.78512201 -16.10139394 172.24396586 C-16.09516017 168.54705012 -16.09455658 164.85013369 -16.09336853 161.1532135 C-16.09025528 154.14796101 -16.08204199 147.14272405 -16.07201904 140.13747841 C-16.0608577 132.16421124 -16.0553474 124.19094335 -16.05032361 116.21767032 C-16.03985936 99.81176968 -16.02151397 83.40589044 -16 67 C-26.89 67 -37.78 67 -49 67 C-47.47694125 63.19235313 -46.64045963 61.2414333 -44.234375 58.2421875 C-43.68152832 57.54440186 -43.12868164 56.84661621 -42.55908203 56.12768555 C-41.96208496 55.38429932 -41.36508789 54.64091309 -40.75 53.875 C-35.75661909 47.56075187 -30.87198583 41.18908868 -26.125 34.6875 C-19.07780004 25.05038099 -11.84907022 15.55629493 -4.5871582 6.08032227 C-3.04704793 4.06166673 -1.52045366 2.03348841 0 0 Z " fill="#000000" transform="translate(49,0)"/><path d="M0 0 C1.15163635 -0.00306656 1.15163635 -0.00306656 2.32653809 -0.00619507 C4.86563899 -0.00920451 7.40409147 0.00927747 9.94311523 0.02832031 C11.70523416 0.03137758 13.4673555 0.03325395 15.22947693 0.03399658 C18.92244718 0.03860056 22.61519947 0.05303089 26.30810547 0.07519531 C31.04857532 0.10349845 35.78887358 0.11440879 40.5294199 0.11887741 C44.16759467 0.12302838 47.80573454 0.13284283 51.44389153 0.1447525 C53.19224708 0.1504607 54.94060601 0.15521758 56.68896675 0.15901947 C59.12864237 0.16587254 61.56818058 0.17949989 64.0078125 0.1953125 C65.09801949 0.19698929 65.09801949 0.19698929 66.21025085 0.19869995 C71.20981954 0.24175059 71.20981954 0.24175059 73.43920898 1.35644531 C73.46386291 5.89542236 73.48204687 10.43436074 73.49414062 14.97338867 C73.49918038 16.51864297 73.50601218 18.06389248 73.51464844 19.60913086 C73.52672975 21.8256956 73.53244071 24.0421975 73.53686523 26.25878906 C73.54202652 26.95358871 73.54718781 27.64838837 73.55250549 28.36424255 C73.55270175 30.02873861 73.50110027 31.6931003 73.43920898 33.35644531 C71.69628722 35.09936708 69.43297403 34.47624835 67.11096191 34.48086548 C66.34779663 34.4772702 65.58463135 34.47367493 64.79833984 34.4699707 C63.59843163 34.47018974 63.59843163 34.47018974 62.37428284 34.47041321 C59.71751234 34.46971387 57.06081106 34.4619205 54.40405273 34.45410156 C52.56702208 34.45223746 50.72999093 34.45081352 48.89295959 34.44981384 C44.04811236 34.44598806 39.20329491 34.43615727 34.35845947 34.42510986 C29.4185832 34.41489703 24.47870214 34.4103165 19.53881836 34.40527344 C9.83893545 34.39453505 0.13907469 34.37745792 -9.56079102 34.35644531 C-11.67175145 30.13452444 -10.78767493 24.62451768 -10.80102539 19.98022461 C-10.81073822 17.93008968 -10.84176546 15.88095457 -10.87329102 13.83105469 C-10.87844727 12.54134766 -10.88360352 11.25164063 -10.88891602 9.92285156 C-10.89826172 8.7363501 -10.90760742 7.54984863 -10.91723633 6.32739258 C-10.56079102 3.35644531 -10.56079102 3.35644531 -9.51106262 1.69303894 C-6.52936242 -0.35043104 -3.48778271 -0.04434331 0 0 Z " fill="#000000" transform="translate(126.560791015625,15.6435546875)"/><path d="M0 0 C1.23137695 -0.00945648 2.46275391 -0.01891296 3.73144531 -0.02865601 C5.07617514 -0.0232863 6.42090204 -0.01713334 7.765625 -0.01025391 C9.1442073 -0.01227487 10.52278855 -0.0151865 11.90136719 -0.01895142 C14.78981714 -0.02337375 17.67798867 -0.01694699 20.56640625 -0.00292969 C24.26892254 0.01416261 27.97078646 0.00432088 31.67327881 -0.01364708 C34.51974402 -0.02448762 37.36605455 -0.02103744 40.21252441 -0.0132637 C41.57767819 -0.01126242 42.94284602 -0.01371849 44.3079834 -0.02070236 C46.2157362 -0.02832031 48.12353824 -0.01465046 50.03125 0 C51.65981934 0.00358017 51.65981934 0.00358017 53.32128906 0.00723267 C56.015625 0.38818359 56.015625 0.38818359 57.86737061 1.72676086 C59.69738108 4.37462445 59.36873495 6.78257773 59.34375 9.95458984 C59.33859375 11.24429688 59.3334375 12.53400391 59.328125 13.86279297 C59.3178125 14.53334717 59.3075 15.20390137 59.296875 15.89477539 C59.26568404 17.94679945 59.25589935 19.9980552 59.25 22.05029297 C59.16972229 32.07998901 59.16972229 32.07998901 58.015625 34.38818359 C36.235625 34.38818359 14.455625 34.38818359 -7.984375 34.38818359 C-10.09533544 30.16626272 -9.21125891 24.65625596 -9.22460938 20.01196289 C-9.2343222 17.96182796 -9.26534945 15.91269285 -9.296875 13.86279297 C-9.30203125 12.57308594 -9.3071875 11.28337891 -9.3125 9.95458984 C-9.3218457 8.76808838 -9.33119141 7.58158691 -9.34082031 6.35913086 C-8.984375 3.38818359 -8.984375 3.38818359 -7.83612061 1.72676086 C-5.19388433 -0.18324093 -3.24184877 0.00712673 0 0 Z " fill="#000000" transform="translate(124.984375,65.61181640625)"/><path d="M0 0 C1.37140892 -0.00934319 1.37140892 -0.00934319 2.77052307 -0.01887512 C3.75495895 -0.00966537 4.73939484 -0.00045563 5.75366211 0.0090332 C6.76569199 0.0085347 7.77772186 0.00803619 8.82041931 0.00752258 C10.9597266 0.00986333 13.09903663 0.01959185 15.23828125 0.03613281 C18.52165201 0.05974718 21.80421228 0.05669097 25.08764648 0.05004883 C27.16382322 0.0556247 29.23999653 0.06273401 31.31616211 0.0715332 C32.79585228 0.07016609 32.79585228 0.07016609 34.30543518 0.06877136 C35.21655563 0.07830338 36.12767609 0.08783539 37.06640625 0.09765625 C37.87010147 0.10226364 38.67379669 0.10687103 39.50184631 0.11161804 C41.46850586 0.37231445 41.46850586 0.37231445 43.46850586 2.37231445 C43.71142578 5.42919922 43.71142578 5.42919922 43.69897461 9.3137207 C43.69851639 9.99659653 43.69805817 10.67947235 43.69758606 11.38304138 C43.69456477 12.82634214 43.68668208 14.26963967 43.67431641 15.71289062 C43.65604916 17.92955999 43.65380679 20.14581203 43.65405273 22.36254883 C43.61593054 33.22488977 43.61593054 33.22488977 42.46850586 34.37231445 C40.93367616 34.46550895 39.39458503 34.48977246 37.85693359 34.48583984 C36.87599228 34.48576431 35.89505096 34.48568878 34.88438416 34.48561096 C33.81773026 34.48044968 32.75107635 34.47528839 31.65209961 34.4699707 C30.02281273 34.46784828 30.02281273 34.46784828 28.36061096 34.46568298 C24.87571511 34.46006493 21.39088244 34.44750938 17.90600586 34.43481445 C15.54988699 34.42980178 13.19376712 34.42523847 10.83764648 34.42114258 C5.04791122 34.41008964 -0.74178695 34.39333396 -6.53149414 34.37231445 C-8.64245458 30.15039358 -7.75837805 24.64038682 -7.77172852 19.99609375 C-7.78144134 17.94595882 -7.81246859 15.89682371 -7.84399414 13.84692383 C-7.84915039 12.5572168 -7.85430664 11.26750977 -7.85961914 9.9387207 C-7.86896484 8.75221924 -7.87831055 7.56571777 -7.88793945 6.34326172 C-7.53149414 3.37231445 -7.53149414 3.37231445 -6.29243469 1.7098999 C-4.04770878 0.00483796 -2.80096182 -0.00219144 0 0 Z " fill="#000000" transform="translate(123.531494140625,115.627685546875)"/><path d="M0 0 C1.28970703 0.00515625 2.57941406 0.0103125 3.90820312 0.015625 C4.57875732 0.0259375 5.24931152 0.03625 5.94018555 0.046875 C7.9922096 0.07806596 10.04346536 0.08785065 12.09570312 0.09375 C22.12539916 0.17402771 22.12539916 0.17402771 24.43359375 1.328125 C24.45824767 5.86710205 24.47643164 10.40604043 24.48852539 14.94506836 C24.49356515 16.49032266 24.50039695 18.03557216 24.5090332 19.58081055 C24.52111451 21.79737529 24.52682548 24.01387718 24.53125 26.23046875 C24.53641129 26.9252684 24.54157257 27.62006805 24.54689026 28.33592224 C24.54708652 30.0004183 24.49548504 31.66477999 24.43359375 33.328125 C23.43359375 34.328125 23.43359375 34.328125 20.38256836 34.44165039 C19.03368104 34.44149134 17.68478761 34.43580112 16.3359375 34.42578125 C15.27264977 34.42365883 15.27264977 34.42365883 14.18788147 34.42149353 C11.91557663 34.41587943 9.643369 34.40332463 7.37109375 34.390625 C5.83398579 34.38561181 4.2968763 34.38104859 2.75976562 34.37695312 C-1.01566267 34.36590542 -4.79101796 34.34863141 -8.56640625 34.328125 C-10.67736669 30.10620413 -9.79329016 24.59619736 -9.80664062 19.9519043 C-9.81635345 17.90176937 -9.8473807 15.85263426 -9.87890625 13.80273438 C-9.8840625 12.51302734 -9.88921875 11.22332031 -9.89453125 9.89453125 C-9.90387695 8.70802979 -9.91322266 7.52152832 -9.92285156 6.29907227 C-9.56640625 3.328125 -9.56640625 3.328125 -8.45629883 1.43823242 C-5.62239439 -0.22637984 -3.26614266 -0.02572639 0 0 Z " fill="#000000" transform="translate(125.56640625,165.671875)"/></svg>`;
    const downloadIcon = `<svg id="my-dl-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"/></svg>`;

    //===================================Only active on album pages===================================

    if (/\/l\/(?![^\/]*item).*$/.test(URL)) {

        GM_registerMenuCommand("Pixeldrain configuration", createConfigPanel);
        if (!GM_getValue("pixeldrain_cfg")) GM_setValue("pixeldrain_cfg", JSON.stringify(defaultConfig));
        const { auto_sort_file, show_file_size, seen_file, viewing_file_method } = JSON.parse(GM_getValue("pixeldrain_cfg"));
        const markers = [];

        //------------------------------Check if element exists function--------------------------------

        const waitForElm = (selector, all = false) => {

            const elementDirect = all
                ? document.querySelectorAll(selector)
                : document.querySelector(selector);

            return new Promise(resolve => {

                if (elementDirect) {
                    return resolve(elementDirect);
                }

                const observer = new MutationObserver(mutations => {

                    const elementObserved = all
                        ? document.querySelectorAll(selector)
                        : document.querySelector(selector);

                    if (elementObserved) {
                        resolve(elementObserved);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            });
        };

        //----------------------------------Bytes formatting function-----------------------------------

        const formatFileSize = bytes => {
            const units = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
            const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
            const size = (bytes / Math.pow(1024, exponent)).toFixed(2);
            return `${size} ${units[exponent]}`;
        };

        //---------------------------------sorting function (by size)------------------------------------

        let ascending = true;
        let filesNodelist;

        const sortByFileSize = (nodeList) => {
            const arrayFromNodeList = [...nodeList];
            arrayFromNodeList.sort((a, b) => +a.dataset.size - +b.dataset.size);

            if (ascending) arrayFromNodeList.reverse();

            const parentNode = nodeList[0].parentNode;
            parentNode.innerHTML = '';
            arrayFromNodeList.forEach(element => parentNode.appendChild(element));

            ascending = !ascending;
        };

        //----------------------------------create sort button function---------------------------------

        const createSortButton = (targetContainer, eventHandler) => {

            const sortButton = document.createElement('button');
            sortButton.className = "toolbar_button sort-button";
            sortButton.innerText = "Sort files";

            const sortIconContainer = document.createElement('div');
            sortIconContainer.className = "sort-icon-container";
            sortIconContainer.insertAdjacentHTML("afterbegin", ascending ? ascendingIcon : descendingIcon);

            sortButton.prepend(sortIconContainer);

            sortButton.addEventListener('click', () => {
                eventHandler(filesNodelist);
                sortIconContainer.innerHTML = "";
                sortIconContainer.insertAdjacentHTML("afterbegin", ascending ? ascendingIcon : descendingIcon);
            });

            targetContainer.appendChild(sortButton);
        };

        //----------------------------------------modal function----------------------------------------

        const modal = (url, file) => {

            const fileLink = url + file.dataset.id;
            const fileType = file.dataset.type;
            const fileTypeShort = fileType.split("/")[0];

            if (!["video", "audio", "image"].includes(fileTypeShort)) {
                const directDL = document.createElement('a');
                directDL.href = fileLink;
                directDL.download = "";
                directDL.click();
                return;
            }

            const modalContainer = document.createElement('div');
            modalContainer.className = "modal-container";

            const modalFileContainer = document.createElement('div');
            modalFileContainer.className = "modal-file-container";

            let tag;

            if (fileTypeShort === "video") {
                const tagType = document.createElement('video');
                tagType.controls = true;
                tagType.autoplay = true;
                tagType.src = fileLink;
                tag = tagType;
            }

            if (fileTypeShort === "audio") {
                const tagType = document.createElement('audio');
                tagType.controls = true;
                tagType.autoplay = true;
                tagType.setAttribute('playsinline', "");
                const source = document.createElement('source');
                source.src = fileLink;
                source.type = fileType;
                tagType.appendChild(source);
                tag = tagType;
            }

            if (fileTypeShort === "image") {
                const tagType = document.createElement('img');
                tagType.src = fileLink;
                tag = tagType;
            }

            const dlContainer = document.createElement('div');
            dlContainer.className = "dl-container";

            const downloadBtn = document.createElement('a');
            downloadBtn.className = "download-file-btn";
            downloadBtn.download = "";
            downloadBtn.innerText = "Download";
            downloadBtn.href = fileLink;
            downloadBtn.onclick = () => {
                const dlIcon = document.querySelector('.dl-container > #my-dl-icon');
                dlIcon.classList.remove('backOutDown');
                setTimeout(() => { dlIcon.classList.add('backOutDown'); }, 50);
            };
            downloadBtn.insertAdjacentHTML('afterbegin', downloadIcon);

            modalContainer.addEventListener('click', e => {
                const clickedElement = e.target;
                if (clickedElement.matches('.modal-file-container')) modalContainer.remove();
                if (clickedElement.matches('.download-file-btn')) setTimeout(() => modalContainer.remove(), 500);
            });

            dlContainer.appendChild(downloadBtn);
            dlContainer.insertAdjacentHTML("beforeend", downloadIcon);
            modalFileContainer.appendChild(tag);
            modalContainer.appendChild(modalFileContainer);
            modalFileContainer.appendChild(dlContainer);
            body.appendChild(modalContainer);
        };

        //--------------------------------fetching file details function--------------------------------

        const fetchFileDetails = async () => {

            const albumID = URL.split('/').pop();

            // fectch the API to get the file size, type, detail and identifier, allowing us to sort files by size and view them directly in the modal window if the option is selected
            try {

                const res = await fetch(`${API}${albumID}`);
                const { files: filesInfosArrayFromAPI } = await res.json();
                const files = document.querySelectorAll('.gallery > .file');

                //console.log(filesInfosArrayFromAPI)
                files.forEach((file, i) => {
                    const { size: fileSize, id: fileID, mime_type: fileType, detail_href: fileDetail } = filesInfosArrayFromAPI[i];

                    file.setAttribute("data-size", fileSize);
                    file.setAttribute("data-id", fileID);
                    file.setAttribute("data-type", fileType);
                    file.setAttribute("data-detail", `https://pixeldrain.com/api${fileDetail}`);
                    if (viewing_file_method === "2") file.setAttribute("target", "_blank");

                    if (show_file_size) file.insertAdjacentHTML('beforeend', `<p class="filesize"><strong>${formatFileSize(fileSize)}</strong></p>`);
                });

                filesNodelist = files;
                return filesNodelist;

            } catch (error) {
                console.error(error.message);
                throw error;
            }
        };

        //==================================window load event listener===================================

        window.addEventListener("load", () => {

            const body = document.body;
            const fileAPIUrl = 'https://pixeldrain.com/api/file/';

            //----------------------------------------event handling----------------------------------------

            // event delegation to manage actions on clicked files
            const gallery = document.querySelector('.gallery');

            gallery.addEventListener('click', e => {

                const file = e.target.closest('a.file');

                if (!file) return;
                if (seen_file && viewing_file_method !== "1") file.classList.add('seen');
                if (viewing_file_method === "3") {
                    e.preventDefault();

                    const unsupportedMimeTypes = [
                        // Audio
                        "audio/3gpp",
                        "audio/ac3",
                        "audio/amr",
                        "audio/flac",
                        "audio/midi",
                        "audio/mp2",
                        "audio/mpegurl",
                        "audio/x-aiff",
                        "audio/x-ms-wax",
                        "audio/x-ms-wma",
                        "audio/x-pn-realaudio",
                        "audio/x-realaudio",
                        "audio/x-scpls",
                        "audio/x-wav",

                        // Video
                        "video/3gpp",
                        "video/3gpp2",
                        "video/dv",
                        "video/mpeg",
                        "video/msvideo",
                        "video/quicktime",
                        "video/vnd.dlna.mpeg-tts",
                        "video/vnd.rn-realvideo",
                        "video/vnd.vivo",
                        "video/x-f4v",
                        "video/x-matroska",
                        "video/x-mng",
                        "video/x-ms-asf",
                        "video/x-ms-wm",
                        "video/x-ms-wmv",
                        "video/x-ms-wvx",
                        "video/x-msvideo",
                        "video/x-sgi-movie",

                        // Image
                        "image/cgm",
                        "image/fits",
                        "image/g3fax",
                        "image/ief",
                        "image/jpm",
                        "image/pcx",
                        "image/pict",
                        "image/x-cmu-raster",
                        "image/x-cmx",
                        "image/x-freehand",
                        "image/x-icon",
                        "image/x-jg",
                        "image/x-portable-anymap",
                        "image/x-portable-bitmap",
                        "image/x-portable-graymap",
                        "image/x-portable-pixmap",
                        "image/x-rgb",
                        "image/x-tga",
                        "image/x-xbitmap",
                        "image/x-xpixmap",
                        "image/x-xwindowdump"
                    ];

                    // Determine if the current file is suitable for modal playback based on its fetched mime-type and a predefined array of allowed mime-types.
                    const detail = file.dataset.detail;
                    const type = file.dataset.type;

                    fetch(detail)
                        .then(res => res.json())
                        .then(data => {

                            const { allow_video_player, availability, availability_message } = data;
                            if (!unsupportedMimeTypes.includes(type) && (!availability.length || !availability_message.length)) {
                                modal(fileAPIUrl, file);

                            } else {
                                window.open(file.href, "_blank");
                            }
                        })
                        .catch(error => {
                            console.error(error.message);
                        });
                }
            });

            //---------------------------------------Details fetching---------------------------------------

            // Execute once DOM and its ressources are fully loaded
            fetchFileDetails()
                .then(() => {
                    if (auto_sort_file) sortByFileSize(filesNodelist);
                    createSortButton(document.querySelector('.toolbar'), sortByFileSize);
                });
        });

        //--------Monitoring Hash Changes to re-run some script's funtionnalities on Gallery Return---------

        window.addEventListener("hashchange", () => {

            if (window.location.href.split('#').at(-1) === "") {

                // wait for the files before executing function
                waitForElm(".gallery > a.file", true)
                    .then(() => {
                        return fetchFileDetails();
                    })
                    .then(files => {

                        if (auto_sort_file) {
                            ascending = true;
                            sortByFileSize(files);
                        }

                        if (markers.length === 0) return;

                        if (seen_file) {

                            for (const file of files) {
                                if (markers.includes(file.hash)) file.classList.add('seen');
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });

            } else {
              const newItem = `#${window.location.href.split('#').at(-1)}`;
              if (markers.indexOf(newItem) === -1 ) markers.push(newItem);
            }

        });

        //============================================CSS Style=============================================

        const pixeldrainStyle = `.sort-button{width:calc(100% - 4px);padding:6px 7px}.sort-icon-container{display:flex}.modal-container,a.file{display:flex!important;flex-direction:column}.sort-button svg{margin-right:2px;filter:invert(.18);pointer-events:none}a.file{position:relative;height:unset!important;justify-content:space-between;padding:0 10px}.seen{border:3px solid #1e90ff}.modal-container{justify-content:center!important;align-items:center!important;position:fixed!important;top:0!important;left:0!important;z-index:9999!important;width:100%!important;height:100%!important;background:rgb(0 0 0 / 90%)!important;animation:.3s ease-in fadeIn!important;backdrop-filter:blur(5px)!important;font-family:system-ui!important;overflow:hidden}.modal-file-container{position:absolute;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;-webkit-animation:1s both scale-up-center!important;animation:1s both scale-up-center!important}.modal-file-container audio,.modal-file-container img,.modal-file-container video{max-width:80%;max-height:80%;box-shadow:8px 8px 3px rgba(0 0 0 / .2);border-radius:5px}.modal-file-container audio{max-width:unset!important;max-height:unset!important;width:80%}.dl-container{position:relative;display:flex;flex-direction:column}.dl-container>#my-dl-icon{position:absolute;top:20px;left:50%;width:80px;height:80px;translate:-50% 0;z-index:0;filter:invert(42%) sepia(90%) saturate(1352%) hue-rotate(190deg) brightness(85%) contrast(110%);opacity:0;pointer-events:none}.download-file-btn{position:relative;z-index:10000;background:#0f0f0f;text-decoration:none;color:#595959;font-size:18px;font-weight:600;padding:2px 15px;box-shadow:0 3px 3px rgba(0,0,0,.6);border:1px solid #131313;border-radius:3px;transition:background .2s;margin-top:15px}.download-file-btn:hover{background:#151515;color:#8c8c8c}.backOutDown{animation-name:backOutDown;animation-duration:0.5s;animation-fill-mode:both}.download-file-btn:active{background:#0f0f0f}.download-file-btn svg{pointer-events:none;filter:invert(.35)}.download-file-btn:hover svg{filter:invert(42%) sepia(90%) saturate(1352%) hue-rotate(190deg) brightness(85%) contrast(110%)}.download-file-btn:after{content:"";display:block;position:absolute;border-radius:1px;left:0;top:0;width:100%;height:100%;opacity:0;transition:.5s;box-shadow:0 0 10px 20px #157ce2}.download-file-btn:active:after{box-shadow:0 0 0 0 #157ce2;position:absolute;border-radius:1px;left:0;top:0;opacity:1;transition:none}@keyframes scale-up-center{0%{-webkit-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes fadeIn{0%{-webkit-opacity:0;opacity:0}100%{-webkit-opacity:1;opacity:1}}@keyframes backOutDown{0%{transform:scale(1);opacity:1}100%{transform:translateY(700px) scale(0.7);opacity:0}}`;
        GM_addStyle(pixeldrainStyle);
    }

})();
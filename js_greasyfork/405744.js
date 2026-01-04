// ==UserScript==
// @name        Cloudbot Enhancer - Key status checker
// @namespace   cloudbot_enhancer.key_status_checker
// @description Cloudbot Enhancer
// @version     1.0.0
// @include     https://cloudbot.site/status*
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405744/Cloudbot%20Enhancer%20-%20Key%20status%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/405744/Cloudbot%20Enhancer%20-%20Key%20status%20checker.meta.js
// ==/UserScript==

const fetchStatus = async function (key) {
    const response = await $.ajax({
        type: "GET",
        url: `https://cloudbot.site/get_key/${key}`,
        crossDomain: true,
    });

    if (!response || response.error) {
        throw response;
    }

    return response;
};

$(document).ready(() => {
    // Prepare vars
    const $expireInCard = $(":contains('Expire in')").parent(".card");

    const $statusChecker = $("<div/>");
    $statusChecker.html(`
        <hr/>
        <div>
            <div style="display: inline-block; float: left;">
                <b>Check key status</b>
            </div>
            <div style="display: inline-block; float: right;">
                (<a href="#" class="toggle_visibility">Show / hide</a>)
            </div>
        </div>
        <div class="checker_content">
            <div class="input-group input-group-sm mb-1">
                <input
                    type="password"
                    class="form-control"
                    name="key_status_checker__key"
                    placeholder="Input key here..."
                />
            </div>
            <div class="mb-1">
                <button
                    class="btn btn-sm btn-primary btn-key-status-check"
                    style="width: 100%;"
                >
                    Check
                </button>
            </div>
            <div
                class="key_status_checker__hours_left__container mt-2"
                data-container-type="loading"
                style="display: none;"
            >
                Loading...
            </div>
            <div
                class="key_status_checker__hours_left__container mt-2"
                data-container-type="error"
                style="display: none;"
            >
                <b style="color: red">Error</b>
            </div>
            <div
                class="key_status_checker__hours_left__container mt-2"
                data-container-type="success"
                style="display: none;"
            >
                Hours left:
                <b class="key_status_checker__hours_left__value"></b> h
            </div>
        </div>
    `);

    // Helper functions
    const isCheckerContentVisible = () => {
        const $checkerContent = $statusChecker.find(".checker_content");

        return $checkerContent.is(":visible");
    };

    const getPersistedCheckerContentVisibilityState = () => {
        const value = window.localStorage.getItem("cloudbotEnhancer.features.keyStatusChecker.isVisible");

        return (value === "true");
    };
    const setPersistedCheckerContentVisibilityState = (newVisibilityState) => {
        window.localStorage.setItem("cloudbotEnhancer.features.keyStatusChecker.isVisible", String(newVisibilityState));
    };

    const setCheckerContentVisibility = (newVisibilityState) => {
        const $element = $statusChecker.find(".checker_content");

        $element.toggle(newVisibilityState);
    };

    // Handlers
    const onKeyStatusPanelVisibilityBtnClick = () => {
        const newVisibilityState = !isCheckerContentVisible();

        setCheckerContentVisibility(newVisibilityState);
        setPersistedCheckerContentVisibilityState(newVisibilityState);
    };

    const onKeyStatusCheckBtnClick = async () => {
        const $containers = $statusChecker.find(".key_status_checker__hours_left__container");

        $containers.hide();

        const $keyInput = $statusChecker.find("[name='key_status_checker__key']");
        const key = $keyInput.val() || '';

        if (!key.length) {
            return;
        }

        $containers.filter("[data-container-type='loading']").show();

        try {
            const keyStatus = await fetchStatus(key);

            $containers.hide();

            $containers
                .filter("[data-container-type='success']")
                .show();
            $containers
                .filter("[data-container-type='success']")
                .find(".key_status_checker__hours_left__value")
                .text(keyStatus.hours);
        } catch (error) {
            $containers.hide();

            $containers
                .filter("[data-container-type='error']")
                .show();
        }
    };

    // Initialize
    $expireInCard.append($statusChecker);

    setCheckerContentVisibility(getPersistedCheckerContentVisibilityState());

    $statusChecker.find(".toggle_visibility").on("click", () => {
        onKeyStatusPanelVisibilityBtnClick();

        return false;
    });

    $expireInCard.find(".btn-key-status-check").on("click", onKeyStatusCheckBtnClick);
});

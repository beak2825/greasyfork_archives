// ==UserScript==
// @name         BootCampSpot v2 Improvements
// @namespace    https://jonas.ninja
// @version      1.3.0
// @description  Streamlined login experience, autosaving of comments, and better attendance colors.
// @author       @iv_njonas
// @match        https://bootcampspot-v2.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39432/BootCampSpot%20v2%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/39432/BootCampSpot%20v2%20Improvements.meta.js
// ==/UserScript==
/* jshint multistr: true */

(function preserveCommentsInLocalStorage() {
    /// BCS has a nasty habit of kicking out users after a certain time, usually a few moments
    /// before they submit a long and thoughtful comment on a student's homework. This has been
    /// a great source of workplace stress and psychological harm. This code prevents such
    /// heartache by auto-saving your comments at every keystroke, and presents a button to
    /// easily load a saved comment after BCS kicks you out.

    var localStorageKey = 'bootcampspotv2-comment';
    var commentBoxSelector = 'textarea#commentEntry';
    var loadButton = createLoadButton();
    var infoAlert = createInfoAlert();
    var noSavedComment = createNoSavedCommentAlert();
    var oldText;

    $('body').on('keyup', commentBoxSelector, function(e) {
        // save the entered text if it has changed significantly. If the button happens to be visible, hide it.
        // give the user some feedback that their comments are saved.
        var text = e.target.value;
        if (text.length < 10) {
            return;
        } else {
            // read oldText from cache or from localStorage, and if it has not changed, don't do anything.
            oldText = oldText || window.localStorage.getItem(localStorageKey);
            if (oldText === text) {
                return;
            }
        }

        window.localStorage.setItem(localStorageKey, e.target.value);

        loadButton.remove();
        if (e.target.value === '') {
            infoAlert.remove();
            e.target.insertAdjacentElement('afterend', noSavedComment);
        } else {
            noSavedComment.remove();
            e.target.insertAdjacentElement('afterend', infoAlert);
        }
    });

    // inject a button that will load the comment
    window.setInterval(function() {
        var commentBox = document.querySelector(commentBoxSelector);
        if (!commentBox || commentBox.dataset.ijgDecorated) {
            return;
        } else {
            commentBox.dataset.ijgDecorated = true;
            // insert the load button if the comment box is empty
            if (commentBox.value === '' && window.localStorage.getItem(localStorageKey)) {
                commentBox.insertAdjacentElement('afterend', loadButton);
            }
        }
    }, 1000);

    function createLoadButton() {
        var loadButton = document.createElement('div');
        loadButton.classList = 'btn btn-lg bcs-button ijg-bcs-loadButton';
        loadButton.style.position = 'absolute';
        loadButton.style.top = '20px';
        loadButton.style.left = '50%';
        loadButton.style.transform = 'translateX(-50%)';
        loadButton.onclick = loadButtonClickHandler;
        loadButton.textContent = "Load comment from localStorage";
        return loadButton;
    }

    function createInfoAlert() {
        var alertDiv = document.createElement('div');
        alertDiv.classList = 'alert alert-info pull-left';
        alertDiv.style.marginTop = '10px';
        alertDiv.style.marginBottom = '-7px';
        alertDiv.textContent = 'Your comment is saved in localStorage!';
        return alertDiv;
    }

    function createNoSavedCommentAlert() {
        var infoDiv = createInfoAlert();
        infoDiv.classList = 'alert alert-warning pull-left';
        infoDiv.textContent = 'No comments in localStorage...';
        return infoDiv;
    }

    function loadButtonClickHandler() {
        // when the load button is clicked, the contents of the comment box are replaced
        // and the button disappears permanently
        document.querySelector(commentBoxSelector).value = window.localStorage.getItem(localStorageKey);
        loadButton.remove();
    }
})();

(function verticalResizeOnly() {
    GM_addStyle('#homework-panel #commentEntry{resize:vertical}');
})();

(function streamlineLogin() {
    /// There is a pointless mandatory "click to login" button. Click that right away.
    /// Then wait for the browser's autofill and make it easy to click the Login button.

    var loginWithUsernameIntervalId;
    var loginFormIntervalId;
    var autofillIntervalId;

    var autofillWaitingPeriodInMS = 1000;
    var autofillWaitingPeriodStartTime;

    var autofillHackCSS = '\
input:-webkit-autofill {\
    animation-name: autofillHack;\
}\
@keyframes autofillHack {\
    from {} to {}\
}';

    loginWithUsernameIntervalId = window.setInterval(attemptClickLoginWithUsername, 100);

    /// Phase 1: wait for the first form to appear, or confirm that it will never appear.
    function attemptClickLoginWithUsername() {
        var loginWithUsernameButton = document.querySelector('.landing .btn-login');

        if (loginWithUsernameButton === null) {
            // Either the page isn't loaded yet, or we're already logged in.
            // If already logged in, clear all intervals and exit.
            if ($('.header-menu .logout').length) {
                window.clearInterval(loginWithUsernameIntervalId);
            }
        } else {
            // The button is there. This function is done. Onward to the next phase.
            window.clearInterval(loginWithUsernameIntervalId);
            loginWithUsernameButton.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
            loginFormIntervalId = window.setInterval(waitForLoginForm, 100);
        }
    }

    /// Phase 2: wait for the second form to appear.
    function waitForLoginForm() {
        var loginButton = document.querySelector('.landing button[type="submit"]');
        var usernameField = document.getElementById('email');
        var passwordField = document.getElementById('password');

        if (loginButton !== null && usernameField !== null && passwordField !== null) {
            // Onward to next phase.
            window.clearInterval(loginFormIntervalId);
            autofillIntervalId = window.setInterval(waitForAutofill, 100);
        }

        if ($('.header-menu .logout').length) {
            window.clearInterval(loginFormIntervalId);
        }
        // if this function is fired once, it is guaranteed that it will hit its success
        // condition and clear its own interval.
    }

    /// Phase 3: wait for autofill to kick in, or timeout and exit.
    function waitForAutofill() {
        /// There are two strategies to detect autofill, targeted toward Firefox and Chrome.
        /// For Chrome: use a CSS animation hack to detect autofill.
        /// For Firefox: read the un/pw field and check for content.

        var usernameField = document.querySelector('#email');
        var passwordField = document.querySelector('#password');

        if (autofillWaitingPeriodStartTime === undefined) {
            // This function may run multiple times. Initialize the startTime and add our hack styles only once.
            autofillWaitingPeriodStartTime = new Date();

            // setup the Chrome autofill detection
            GM_addStyle(autofillHackCSS);
            $(passwordField).on('animationstart', handleAutofill); // assume that both pw and un fields are filled...
        }

        var now = new Date();

        if (now.getTime() > autofillWaitingPeriodStartTime.getTime() + autofillWaitingPeriodInMS) {
            // timeout triggered
            window.clearInterval(autofillIntervalId);
            // end of program.
        } else if (usernameField.value.length > 0 && passwordField.value.length > 0) {
            // detected Firefox autofill
            window.clearInterval(autofillIntervalId);
            makeLoginButtonEasyToClick();
        }
    }

    function handleAutofill(e) {
        if (e.originalEvent.animationName === 'autofillHack') {
            // autofill kicked in, as evidenced by the autofillHack animation.
            $('.landing input[type=password]').off('animationstart', handleAutofill);
            makeLoginButtonEasyToClick();
        }
    }

    function makeLoginButtonEasyToClick() {
        var loginButton = document.querySelector('.landing button[type="submit"]');

        var style = loginButton.style;
        style.position = 'fixed';
        style.width = style.height = '100%';
        style.top = style.left = 0;
        style.fontSize = '30vmin';

        // attempt a click right away. It may or may not work.
        loginButton.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));

        // if it does not work, try to do it as soon as possible. That probably means the cursor moving across the screen.
        loginButton.onmousemove = function() {
            // this only works on Firefox because of a Chrome security "feature"
            loginButton.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
        };
        // end of program.
    }
})();

(function colorizeAttendanceDropdowns() {
    /// The tiny color bullets are hard to see. Make them easier to see.

    var styles = '\
.dropdown-toggle.attendance-dropdown {\
    position: relative;\
    padding-left: 26px;\
    overflow: hidden;\
}\
\
.fa-circle {\
    width: 18px;\
    height: 35px;\
    top: -1px;\
    left: -2px;\
    position: absolute;\
    background-color: currentColor;\
}\
\
.fa-circle.Pending {\
    background-color: white;\
    color: white;\
}';
    GM_addStyle(styles);
})();
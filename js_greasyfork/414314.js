// ==/UserScript==

(() => {
    const J = jQuery.noConflict(true);
    const globalInterval = 2000;

    solveCaptcha = (imageEl, outputEl, captchaIdentifier, callback = () => {}) => {
        if (window[captchaIdentifier] == undefined) {
            window[captchaIdentifier] = true; //solving takes some time, so we'll lock a duplicate solver instance out
            let note = attachNotification(imageEl, "Please wait while your captcha is being solved. Don't worry if the code does not seem to match; that's because a new captcha image has been generated!");
            Tesseract.recognize(J(imageEl).attr("src")).then(equation => {
                var formula = equation.text;
                if (formula.length = 3) {//the exact length of the fomula
                    if (formula.substr(1, 1) == 7) { //2-1 gets recognized as 271
                        formula = formula.substr(0, 1) + "-" + formula.substr(2);
                    }
                    formula = formula.replace(/x/g, "*"); //x is just the human version of *
                    formula = formula.replace(/[} ]/g, ""); //a random char being the result of misinterpretation; occasionally happening on the login form
                    //console.log(formula); //re-enable this to debug how the captchasolving is doing so far
                    outputEl.val(eval(formula));
                    window[captchaIdentifier] = false; //not really necessary IF directly triggering a classic non-ajax post request
                    removeNotification(note);
                    callback()
                }
            });
        }
    }

    attachNotification = (identifier, notification) => {
        el = "<p style='color: red;'>" + notification + "</p>";
        prevEl = J(identifier).prev()[0];
        if (prevEl == undefined || prevEl.innerText != notification)
           return J(el).insertBefore(identifier);
    }

    removeNotification = (el) => {
        if (el != undefined)
            el.remove()
    }

    alertOnce = (message, identifier) => {
        localIdentifier = (identifier != undefined) ? identifier : message;
        if (shownWarnings.indexOf(localIdentifier) == -1) {
            shownWarnings.push(localIdentifier);
            alert(message)
        }
    }

    //runtime vars
    let previousVideo = "";
    /** indicates if a warning/message has already been shown. Happens once per window. Use alertOnce() */
    let shownWarnings = [];

    setInterval(() => {
        if (J("*:contains('503 Service Unavailable')").length) {
            console.log("Server Error! reloading...");
            location.reload();
        } else if (J("*:contains('not logged in!')").length) {
            window.location.href = "login.php"
        } else if (J("*:contains('Failed. You did not successfully solve the problem.')").length) {
            J("a:contains('Try Again')")[0].click()
        } else {
                switch (document.location.pathname) {
                    case "/login.php":
                        if (!J("#password").val().length) attachNotification("#username", "Consider storing your login data in your browser.")
                        captcha = J("img[alt='Enter The Numbers']");
                        if (captcha.length)
                            solveCaptcha(captcha[0], J("input[name='postcaptcha']"), "ylh_login_captchasolving");
                        break;
                    case "/bonuspoints.php":
                        if (J("body:contains('You have made ')").length && J("body:contains(' Hits out of ')").length) {
                            attachNotification(".maintable", "Not enough points. Reloading the website in 2 minutes to check again...");
                            setTimeout(() => location.reload(), 1000 * 120);
                        } else if (J(".buybutton").length) J(".buybutton")[0].click()
                        break;
                    case "/youtubenew2.php":
                        if (J('body:contains("failed")').length) location.reload(); //captcha failed?
                        if (J(".followbutton").length) { //if false, there is likely a captcha waiting to be solved
                            let vidID = () => { return J(".followbutton").first().parent().children("span[id*='count']").attr("id") };
                            let patienceKiller = (prev) => { setTimeout( () => { if (vidID() == prev) { J(".followbutton").parent().children("a:contains('Skip')").click(); newWin.close(); }}, 1000 * 135)}; //max time: 120s + 15s grace time (max length: http://prntscr.com/q4o75o)
                            //console.log(previousVideo + " " + vidID() + (previousVideo != vidID() ? " true": " false"));
                            if (vidID() != previousVideo) { //has a new video has been provided yet? This will overcome slow network connections causing the same video to be played over and over
                                previousVideo = vidID();
                                if (window.eval("typeof(window.newWin) !== 'undefined'")) {
                                    if (newWin.closed) {
                                        console.log("Watching one Video!");
                                        J(".followbutton")[0].click();
                                        patienceKiller(previousVideo)
                                    }
                                } else {
                                    console.log("Watching one Video!");
                                    J(".followbutton")[0].click();
                                    patienceKiller(previousVideo)
                                }
                            } //else do nothing and wait (until the video gets replaced or our patience thread tears)
                        } else {
                            captcha = J("img[src*='captchayt']");
                            if (captcha.length) //captcha? no problemo, amigo.
                                solveCaptcha(captcha[0], J("input[name='answer']"), "ylh_yt_traffic_captchasolving", () => J("input[value='Submit']").first().click());
                        }
                        break;
                }
            GM.getValue("ylh_traffic_tab_open", false).then(state => {
                switch (document.location.pathname) {
                    case "/websites.php":
                        if (J("*:contains('There are no Websites currently visitable for Points')").length) {
                            alertOnce("All websites were visited. Revisit/reload the page to start surfing again.")
                        } else {
                            if (!state && window.eval("typeof(window.childWindow) !== 'undefined'")) {
                                if (!childWindow.closed)
                                    childWindow.close();
                            } else if (state && window.eval("typeof(window.childWindow) == 'undefined'")) {
                                console.log("no child window is actually open. let's create a new tab as if we came here for the very first time!");
                                state = false;
                            }
                            var buttons = J(".followbutton:visible");
                            if (buttons.length) {
                                if (!state) {
                                    console.log("setting the tabstate to true...");
                                    GM.setValue('ylh_traffic_tab_open', true).then(() => {
                                        console.log("Visiting a new page...");
                                        buttons[0].onclick();
                                    });
                                } else {
                                }
                            } else {
                                console.log("We ran out of buttons! requesting more...");
                                //GM.getValue("ylh_traffic_reloadlimit", false).then(rlimit => {
                                if (window.eval("typeof(window.childWindow) !== 'undefined'") && childWindow.closed) //without this we would not wait for the last link of the page to be visited successfully
                                    location.reload();
                                //J("a[title='Refresh']")[0].click();
                            }
                        }
                        break;
                    case "/viewwebsite.php":
                        if (!J("*:contains('been logged out of YouLikeHits')").length) {
                            if (J(".alert:visible:contains('You got'):contains('Points')").length || J('body:contains("We couldn\'t locate the website you\'re attempting to visit.")').length) {
                                console.log("setting the tabstate to false...");
                                GM.setValue('ylh_traffic_tab_open', false).then(() => { //free the way for a new tab
                                    /*window.close(); //might not always work in FF
                                    setTimeout (window.close, 1000);*/
                                });
                            } else if (J("*:contains('viewing websites too quickly!  Please wait')").length) location.reload();
                        } else alert("Please reload the website list, and make sure you are still logged in.");
                        break;
                }
            });
        }
    }, globalInterval);
})();

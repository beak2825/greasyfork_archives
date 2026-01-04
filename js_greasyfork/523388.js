// ==UserScript==
// @name        esims beautify
// @namespace   Violentmonkey Scripts
// @match       *://simsweb.uaic.ro/*
// @grant       GM.xmlHttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      @driedpampas
// @license     GPL-3.0-or-later
// @description 9/26/2024, 5:00:24 PM
// @downloadURL https://update.greasyfork.org/scripts/523388/esims%20beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/523388/esims%20beautify.meta.js
// ==/UserScript==

(function () {
    "use strict";

    async function fetchSvgContent(id) {
        try {
            const url = "https://dry.nl.eu.org/esims-svg/" + id;
            const response = await fetch(url, {
                headers: {
                    "Sec-Fetch-Site": "cross-site",
                },
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const svgContent = await response.text();

            // Return the SVG content
            return svgContent;
        } catch (error) {
            // Handle any errors that occurred during the fetch
            console.error(error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }

    const loadingBox = document.createElement("div");
    loadingBox.style.position = "fixed";
    loadingBox.style.top = "0";
    loadingBox.style.left = "0";
    loadingBox.style.width = "100%";
    loadingBox.style.height = "100%";
    loadingBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    loadingBox.style.display = "flex";
    loadingBox.style.justifyContent = "center";
    loadingBox.style.alignItems = "center";
    loadingBox.style.zIndex = "1000";
    loadingBox.innerHTML = "<div style='color: white; font-size: 32px;'>Loading...</div>";

    document.body.appendChild(loadingBox);

    // Wait until the DOM is fully loaded
    window.addEventListener("load", function () {
        // Create a new doctype
        const newDoctype = document.implementation.createDocumentType(
            "html",
            "",
            ""
        );
        // Replace the current doctype
        if (document.doctype) {
            document.replaceChild(newDoctype, document.doctype);
        } else {
            document.insertBefore(newDoctype, document.childNodes[0]);
        }

        const aspNET = document.querySelector("#aspnetForm");

        if (aspNET && aspNET.tagName === "FORM") {
            // Create a new div
            const divWrapper = document.createElement("div");
            divWrapper.id = aspNET.id;

            // Move all children from form to div
            while (aspNET.firstChild) {
                divWrapper.appendChild(aspNET.firstChild);
            }

            // Replace form with div
            aspNET.parentNode.replaceChild(divWrapper, aspNET);
        }

        const mainNav = document.querySelector("#mainnav");

        // Replace table element inside #mainnav with a custom div
        const tableElement = mainNav.querySelector("table");

        if (tableElement) {
            // Create new div with buttons
            const newDiv = document.createElement("div");
            newDiv.setAttribute("id", "table-replacement");

            // Create the first button
            const button1 = document.createElement("button");
            button1.textContent = "Pagina principală";
            button1.setAttribute("id", "main-page-button");
            button1.setAttribute(
                "onclick",
                "window.location.href='/eSIMS/Default.aspx'"
            );
            button1.setAttribute("class", "home");

            fetchSvgContent(`home-icon`)
                .then((svgContent) => {
                    // Create the image element for the base64 icon
                    const icon = document.createElement("img");
                    icon.setAttribute("src", svgContent);
                    icon.setAttribute("alt", "Home Icon");

                    // Append the icon to the first button
                    button1.prepend(icon); // Add the icon before the text
                })
                .catch((error) => {
                    console.error("Error fetching SVG content:", error);
                });

            // Create the second button
            const button2 = document.createElement("button");
            button2.textContent = "Recuperare parolă";
            button2.setAttribute("id", "password-recovery-button");
            button2.setAttribute("class", "account");
            button2.addEventListener("click", function () {
                window.location.href =
                    "https://simsweb.uaic.ro/eSIMS/RecoverPassword.aspx";
            });

            // Append buttons to the div
            newDiv.appendChild(button1);
            newDiv.appendChild(button2);

            // Replace the table with the new div
            tableElement.replaceWith(newDiv);
        }

        const tableReplacement = document.querySelector("#table-replacement");
        const searchElement = document.querySelector("#search");

        if (searchElement) {
            // Remove any random text nodes in the #search element
            searchElement.childNodes.forEach((node) => {
                if (
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent.trim() !== ""
                ) {
                    node.remove(); // Remove the text node if it's not empty
                }
            });

            // Move #search element into #tableReplacement
            if (tableReplacement) {
                tableReplacement.appendChild(searchElement);
            }
        }

        // Transform Login link into a button if its content is "Login"
        const loginLink = searchElement.querySelector("a");

        if (loginLink && loginLink.textContent.trim() === "Login") {
            const loginButton = document.createElement("button");
            loginButton.textContent = "Login";
            loginButton.setAttribute("id", "login-page-button");
            loginButton.setAttribute("class", "account");
            loginButton.addEventListener("click", function () {
                window.location.href =
                    "https://simsweb.uaic.ro/eSIMS/MyLogin.aspx?ReturnUrl=%2feSIMS%2fdefault.aspx";
            });

            // Replace the link with the button
            loginLink.replaceWith(loginButton);
        }

        // Move around account related stuff
        if (tableReplacement) {
            const newDiv = document.createElement("div");
            newDiv.id = "user";

            // Append the new div to the target div
            tableReplacement.appendChild(newDiv);

            // Select the buttons you want to move
            const button1 = document.querySelector("#password-recovery-button");
            const button2 = document.querySelector("#search"); // cause what happens when I'm logged in?

            // Move the buttons to the new div
            newDiv.appendChild(button1);
            newDiv.appendChild(button2);
        }

        const centerColumn = document.querySelector("#centercolumn");
        if (centerColumn) {
            // Get the parent element
            const parentElement = centerColumn.parentElement;

            // Swap the positions of the columns
            parentElement.appendChild(centerColumn);
        }

        // Move the Main Page Button "above" the left column
        const mainPageButton = document.querySelector("#main-page-button");
        const leftColumn = document.querySelector("#leftcolumn");
        const leftColumnContainer = document.querySelector("#leftcolcontainer");
        if (mainPageButton && leftColumn && leftColumnContainer) {
            const icon = document.createElement("img");
            icon.setAttribute(
                "src",
                "https://eadmitere.uaic.ro/img/logo/ro/logo-no-auth.png"
            );
            icon.setAttribute("alt", "Emblem");
            icon.setAttribute("id", "emblem");
            leftColumn.appendChild(icon);
            leftColumn.appendChild(mainPageButton);
            leftColumn.appendChild(leftColumnContainer);
        }

        const wrapperEL = document.querySelector("#wrapper");
        const contentWrapper = document.querySelector("#contentwrapper");
        wrapperEL.insertBefore;
        if (wrapperEL) {
            wrapperEL.prepend(leftColumn);

            const newDivContainer = document.createElement("div");
            newDivContainer.setAttribute("id", "right-sidebar");

            newDivContainer.appendChild(mainNav);
            if (contentWrapper) {
                newDivContainer.appendChild(contentWrapper);
            } else {
                console.warn("contentWrapper element not found!");
            }

            wrapperEL.appendChild(newDivContainer);
        }

        // Edit the Footer
        const footerEl = document.querySelector("#footer");
        footerEl.textContent =
            "© 2005 «eSIMS» Developers | Beautified ✨ by @driedpampas, 2024";
        aspNET.appendChild(footerEl);

        // Remove "»" from <a> elements in the sidebar
        const sidebarContainer = document.querySelector(
            "#leftcolcontainer > div:nth-child(2).sidebarcontainer"
        );
        if (sidebarContainer) {
            const links = sidebarContainer.querySelectorAll("li a");
            links.forEach((link) => {
                link.textContent = link.textContent.replace(/»/g, "").trim(); // Remove "»" and trim whitespace
            });

            let svgOpenInNewTab = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m 320,0 c -17.7,0 -32,14.3 -32,32 0,17.7 14.3,32 32,32 h 82.7 L 201.4,265.4 c -12.5,12.5 -12.5,32.8 0,45.3 12.5,12.5 32.8,12.5 45.3,0 L 448,109.3 V 192 c 0,17.7 14.3,32 32,32 17.7,0 32,-14.3 32,-32 V 32 C 512,14.3 497.7,0 480,0 Z M 80,32 C 35.8,32 0,67.8 0,112 v 320 c 0,44.2 35.8,80 80,80 h 320 c 44.2,0 80,-35.8 80,-80 V 320 c 0,-17.7 -14.3,-32 -32,-32 -17.7,0 -32,14.3 -32,32 v 112 c 0,8.8 -7.2,16 -16,16 H 80 c -8.8,0 -16,-7.2 -16,-16 V 112 c 0,-8.8 7.2,-16 16,-16 h 112 c 17.7,0 32,-14.3 32,-32 0,-17.7 -14.3,-32 -32,-32 z" style="fill:#ffffff;fill-opacity:1" /></svg>`;
            sidebarContainer.innerHTML = `
                <section id="news-section">
                    <h4>Noutăţi</h4>
                    <ul>
                        <li><a href="http://360.uaic.ro" title="news">360uaic<span class="svg-container" /></a></li>
                    </ul>
                </section>

                <section id="quick-links">
                    <h4>Legături rapide</h4>
                    <ul>
                        <li>
                            <a href="http://www.accuweather.com" title="Weather">AccuWeather<span class="svg-container" /></a>
                        </li>
                        <li><a href="http://www.laiasi.ro" title="Iasi - portal">Sutff to do in Iași<span class="svg-container" /></a></li>
                        <li><a href="https://ro.wikipedia.org/wiki/Procesul_Bologna" title="Procesul Bologna">Șuncă Bologna<span class="svg-container" /></a></li>
                        <li><a href="https://www.dictionary.com/" title="Dictionary">Dictionary.com<span class="svg-container" /></a></li>
                        <li><a href="http://www.sfatulmedicului.ro/" title="Sfatul medicului">Sfatul medicului<span class="svg-container" /></a></li>
                    </ul>
                </section>
            `;
            // Insert the SVG after each <a> element
            document
                .querySelectorAll("li .svg-container")
                .forEach((container) => {
                    container.innerHTML = svgOpenInNewTab;
                });
        }

        // Delete the #header element
        const headerElement = document.querySelector("#header");
        if (headerElement) {
            headerElement.remove();
        }

        // Remove the #rightcolumn element
        const rightColumn = document.querySelector("#rightcolumn");
        if (rightColumn) {
            rightColumn.remove();
        }

        const bodyEL = document.querySelector("body");
        if (bodyEL) {
            // Create a new div with id new-banner
            const newBanner = document.createElement("div");
            newBanner.id = "new-banner";

            fetchSvgContent(`banner-light`)
                .then((svgContent) => {
                    // Create an image element
                    const imgElementLight = document.createElement("img");
                    imgElementLight.src = svgContent;
                    imgElementLight.id = "banner-light";

                    // Append the image to the new div
                    newBanner.appendChild(imgElementLight);
                })
                .catch((error) => {
                    console.error("Error fetching SVG content:", error);
                });

            fetchSvgContent(`banner-dark`)
                .then((svgContent) => {
                    // Create an image element
                    const imgElementDark = document.createElement("img");
                    imgElementDark.src = svgContent;
                    imgElementDark.id = "banner-dark";

                    // Append the image to the new div
                    newBanner.appendChild(imgElementDark);
                })
                .catch((error) => {
                    console.error("Error fetching SVG content:", error);
                });

            // Append the new div to the body
            document.body.appendChild(newBanner);
        }

        // Check if there's already a favicon link
        let favicon = document.querySelector('link[rel="icon"]');

        if (!favicon) {
            // If no favicon exists, create one
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }

        fetchSvgContent(`favicon`)
            .then((svgContent) => {
                favicon.href = svgContent;
            })
            .catch((error) => {
                console.error("Error fetching SVG content:", error);
            });

        const TextContainer = document.querySelector(
            "div.container:nth-child(1)"
        );
        if (TextContainer) {
            TextContainer.innerHTML = `
                <h5 align="center">eSIMS</h5>
                <ul id="ctl00_mainCopy_BulletedList1">
                  <li>Înregistrarea se face cu NUMARUL MATRICOL!</li>
                </ul><br>
                <h5 align="center">Pentru cei interesaţi!</h5>
                <h5 align="center">La fiecare 15 minute sunt şterse conturile blocate.</h5>
                  <ul id="ctl00_mainCopy_BulletedList2">
                    <li>NU rezolvăm prin telefon probleme de conectare la eSIMS!</li>
                    <li>Conectarea se face cu numărul matricol şi parola aleasă la crearea contului, se merge apoi la pagina Studenţi, apoi în stânga la meniul Note, taxe, click pe butonul Remove, apoi pe butonul Create and connect.</li>
                    <li>După 6 luni de inactivitate contul va fi șters.</li>
                    <li>După mai multe încercări de conectare eşuate, contul este blocat şi apoi şters.</li>
                    <li>Nu se pot crea mai multe conturi folosind aceeaşi adresă de email.</li>
                  </ul><br>
                <h5 align="center">După ştergerea contului acesta poate fi creat din nou.</h5><br>  `;
        }

        const currentURL = window.location.href;
        const loginRegister = document.querySelector("#loginregister");
        const passwordRecoveryPage =
            "https://simsweb.uaic.ro/eSIMS/RecoverPassword.aspx";
        const RegisterPage = "https://simsweb.uaic.ro/eSIMS/Register.aspx";
        if (loginRegister && currentURL === passwordRecoveryPage) {
            loginRegister.innerHTML = `
                <fieldset>
                  <legend>Regăseşte-ţi parola</legend>
                  <form name="aspnetForm" method="post" action="MyLogin.aspx?ReturnUrl=%2feSIMS%2fdefault.aspx" onsubmit="javascript:return WebForm_OnSubmit();" id="aspnetForm">
                    <div class="form-group">
                      <label for="username">Număr matricol:</label>
                      <input type="text" id="username" name="username" class="txtBox" required>
                      <span class="required" id="username-required" style="display:none;">*</span>
                    </div>

                    <div class="form-group">
                      <button type="submit" id="submit-button">Trimite-mi parola</button>
                    </div>

                    <div class="form-error" id="error-message" style="display:none; color: red;">
                      <!-- Error messages can be displayed here -->
                    </div>
                  </form>
                </fieldset>
              `;
            document
                .getElementById("password-recovery-form")
                .addEventListener("submit", function (event) {
                    const usernameInput = document.getElementById("username");

                    if (usernameInput.value.trim() === "") {
                        event.preventDefault();
                        document.getElementById(
                            "username-required"
                        ).style.display = "inline";
                        document.getElementById("error-message").style.display =
                            "block";
                        document.getElementById("error-message").textContent =
                            "Număr matricol obligatoriu.";
                    }
                });
        } else if (loginRegister && currentURL === RegisterPage) {
            loginRegister.innerHTML = `
                <a name="content_start" id="content_start"></a>
                <div id="form-container" style="width: 100%; max-width: 600px; margin: auto;">
                      <h5 id="register-notice">Atenţie! Dupa creare, aşteptaţi 10 minute apoi mergeţi la pagina de login.</h5>

                    <form name="aspnetForm" method="post" action="MyLogin.aspx?ReturnUrl=%2feSIMS%2fdefault.aspx" onsubmit="javascript:return WebForm_OnSubmit();" id="aspnetForm">

                      <div class="form-group">
                        <label for="UserName">Număr matricol:</label>
                        <input name="ctl00$mainCopy$CreateUserWizard1$CreateUserStepContainer$UserName" type="text" id="UserName" class="txtBox" required>
                        <span id="UserNameRequired" class="error-message" style="display: none;">*</span>
                        <span id="RegExpLN" class="error-message" style="display: none;">Număr matricol invalid!</span>
                      </div>

                      <div class="form-group">
                        <label for="Password">Parolă:</label>
                        <input name="ctl00$mainCopy$CreateUserWizard1$CreateUserStepContainer$Password" type="password" id="Password" class="txtBox" required>
                        <span id="PasswordRequired" class="error-message" style="display: none;">*</span>
                      </div>

                      <div class="form-group">
                        <label for="ConfirmPassword">Confirmă parola:</label>
                        <input name="ctl00$mainCopy$CreateUserWizard1$CreateUserStepContainer$ConfirmPassword" type="password" id="ConfirmPassword" class="txtBox" required>
                        <span id="ConfirmPasswordRequired" class="error-message" style="display: none;">*</span>
                      </div>

                      <div class="form-group">
                        <label for="Email">Adresa de mail: (va fi folosită pentru recuperarea parolei)</label>
                        <input name="ctl00$mainCopy$CreateUserWizard1$CreateUserStepContainer$Email" type="email" id="Email" class="txtBox" required>
                        <span id="EmailRequired" class="error-message" style="display: none;">*</span>
                        <span id="EmailValid1" class="error-message" style="display: none;">Adresa email invalidă</span>
                      </div>

                      <div class="form-group">
                        <label for="ConfirmEmail">Confirmă emailul:</label>
                        <input name="ctl00$mainCopy$CreateUserWizard1$CreateUserStepContainer$Email2" type="email" id="ConfirmEmail" class="txtBox" required>
                      </div>

                      <div class="form-group">
                        <button type="submit" id="register">Submit</button>
                      </div>
                    </form>
                </div>
            `;
        }

        let isUserLoggedIn = false;

        // Function to extract the values and send the POST request
        async function submitLogin() {
            // Select form fields by their IDs
            const viewState = document.getElementById("__VIEWSTATE").value;
            const viewStateGen = document.getElementById(
                "__VIEWSTATEGENERATOR"
            ).value;
            const eventValidation =
                document.getElementById("__EVENTVALIDATION").value;
            const userName = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const rememberMe = document.getElementById("remember-me").checked;

            // Prepare the data for the POST request
            const formData = new URLSearchParams();
            formData.append("__WPPS", "s");
            formData.append("__LASTFOCUS", "");
            formData.append("ctl00_mainCopy_ScriptManager1_HiddenField", "");
            formData.append("__EVENTTARGET", "");
            formData.append("__EVENTARGUMENT", "");
            formData.append("ctl00_subnavTreeview_ExpandState", "");
            formData.append("ctl00_subnavTreeview_SelectedNode", "");
            formData.append("ctl00_subnavTreeview_PopulateLog", "");
            formData.append("__VIEWSTATE", viewState);
            formData.append("__VIEWSTATEGENERATOR", viewStateGen);
            formData.append("__EVENTVALIDATION", eventValidation);
            formData.append("ctl00$mainCopy$Login1$UserName", userName);
            formData.append("ctl00$mainCopy$Login1$Password", password);
            if (rememberMe) {
                formData.append("ctl00$mainCopy$Login1$RememberMe", "on");
            }
            formData.append("ctl00$mainCopy$Login1$LoginButton", "Conectare");

            GM.xmlHttpRequest({
                method: "POST",
                url: "https://simsweb.uaic.ro/eSIMS/MyLogin.aspx?ReturnUrl=%2feSIMS%2fMembers%2fDefault.aspx",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Host: "simsweb.uaic.ro",
                    "User-Agent": navigator.userAgent, // Use the browser's User-Agent
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    Origin: "https://simsweb.uaic.ro",
                    DNT: "1",
                    "Sec-GPC": "1",
                    Connection: "keep-alive",
                    Referer:
                        "https://simsweb.uaic.ro/eSIMS/MyLogin.aspx?ReturnUrl=%2feSIMS%2fMembers%2fDefault.aspx",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    Priority: "u=0, i",
                },
                data: formData.toString(),
                onload: function (response) {
                    if (response.status === 200) {
                        console.log("Login successful");
                        isUserLoggedIn = true;
                        localStorage.setItem("isUserLoggedIn", "true");

                        // Get the Set-Cookie header and store the cookie
                        const setCookieHeader =
                            response.responseHeaders.match(
                                /Set-Cookie: (.*?);/i
                            );
                        if (setCookieHeader && setCookieHeader[1]) {
                            const cookieValue = setCookieHeader[1];
                            GM.setValue("loginCookie", cookieValue);
                            console.log("Cookie stored:", cookieValue);
                        }
                        window.location.href =
                            "https://simsweb.uaic.ro/eSIMS/Members/Default.aspx";
                    } else {
                        console.error("Login failed");
                    }
                },
                onerror: function (error) {
                    console.error("Network Error:", error);
                },
            });
        }

        async function submitLogout() {
            // Select form fields by their IDs
            const viewState = document.getElementById("__VIEWSTATE").value;
            const viewStateGen = document.getElementById(
                "__VIEWSTATEGENERATOR"
            ).value;
            const eventValidation =
                document.getElementById("__EVENTVALIDATION").value;

            // Prepare the data for the POST request
            const formData = new URLSearchParams();
            formData.append("__WPPS", "u");
            formData.append("__EVENTTARGET", "ctl00$LoginStatus1$ctl00");
            formData.append("__EVENTARGUMENT", "");
            formData.append("ctl00_subnavTreeview_ExpandState", "");
            formData.append("ctl00_subnavTreeview_SelectedNode", "");
            formData.append("ctl00_subnavTreeview_PopulateLog", "");
            formData.append("__VIEWSTATE", viewState);
            formData.append("__VIEWSTATEGENERATOR", viewStateGen);
            formData.append("__EVENTVALIDATION", eventValidation);

            GM.xmlHttpRequest({
                method: "POST",
                url: "https://simsweb.uaic.ro/eSIMS/Members/default.aspx",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Host: "simsweb.uaic.ro",
                    "User-Agent": navigator.userAgent,
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    Origin: "https://simsweb.uaic.ro",
                    DNT: "1",
                    "Sec-GPC": "1",
                    Connection: "keep-alive",
                    Referer:
                        "https://simsweb.uaic.ro/eSIMS/Members/default.aspx",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    Priority: "u=0, i",
                },
                data: formData.toString(),
                onload: function (response) {
                    if (response.status === 200) {
                        console.log("Logout successful");

                        const setCookieHeader =
                            response.responseHeaders.match(
                                /Set-Cookie: (.*?);/i
                            );
                        if (setCookieHeader && setCookieHeader[1]) {
                            const cookieValue = setCookieHeader[1];
                            GM.setValue("loginCookie", cookieValue);
                            console.log("Cookie deleted");
                        }
                        isUserLoggedIn = false;
                        localStorage.setItem("isUserLoggedIn", "false");
                        window.location.href =
                            "https://simsweb.uaic.ro/eSIMS/Default.aspx";
                    } else {
                        console.error("Logout failed");
                    }
                },
                onerror: function (error) {
                    console.error("Network Error:", error);
                },
            });
        }

        // logout button
        if (JSON.parse(localStorage.getItem("isUserLoggedIn")) === true) {
            if (loginLink && loginLink.textContent.trim() === "Logout") {
                const logoutButton = document.createElement("button");
                logoutButton.textContent = "Logout";
                logoutButton.setAttribute("id", "logout-page-button");
                logoutButton.setAttribute("class", "account");
                logoutButton.addEventListener("click", submitLogout);

                // Replace the link with the button
                loginLink.replaceWith(logoutButton);
            }
        }

        const LoginPage =
            "https://simsweb.uaic.ro/eSIMS/MyLogin.aspx";
        // Check if the current URL matches

        if (currentURL.startsWith(LoginPage)) {
            const loginPage = document.querySelector(
                "#copy > div:nth-child(2)"
            );

            if (loginPage) {
                loginPage.id = "login-div";
                loginPage.innerHTML = `
                        <fieldset>
                          <legend>Pagina de conectare</legend>

                          <div class="form-group">
                            <label for="username">Număr matricol:</label>
                            <input type="text" id="username" name="username" required>
                            <span class="required" id="username-required" style="display:none;">*</span>
                          </div>

                          <div class="form-group">
                            <label for="password">Parolă:</label>
                            <input type="password" id="password" name="password" required>
                            <span class="required" id="password-required" style="display:none;">*</span>
                          </div>

                          <div class="form-group">
                            <input type="checkbox" id="remember-me" name="remember-me">
                            <label for="remember-me">Ține-mă minte</label>
                          </div>

                          <div class="form-group">
                            <button type="submit" id="login-button" class="login-button"> Conectare</button>
                          </div>

                        </fieldset>
                    <button id="create-account" class="submit">Creare cont nou</button>
                `;
                const createAccountButton =
                    document.querySelector("#create-account");
                createAccountButton.addEventListener("click", function () {
                    window.location.href =
                        "https://simsweb.uaic.ro/eSIMS/Register.aspx";
                });
            }

            // Call the function when the button is clicked
            document
                .getElementById("login-button")
                .addEventListener("click", submitLogin);
        }

        //const MembersPage = 'https://simsweb.uaic.ro/eSIMS/Members/Default.aspx';
        // Check if the current URL matches
        //if (currentURL === LoginPage) {
        if (localStorage.getItem("isUserLoggedIn") === "true") {
            console.info("weeee user page");
            if (loginLink && loginLink.textContent.trim() === "Logout") {
                const logoutButton = document.createElement("button");
                logoutButton.textContent = "Logout";
                logoutButton.setAttribute("id", "logout-page-button");
                logoutButton.setAttribute("class", "account");
                logoutButton.addEventListener("click", function () {
                    document.cookie =
                        "security=; Max-Age=0; path=/; domain=simsweb.uaic.ro; Secure; HttpOnly";
                    localStorage.setItem("isUserLoggedIn", "false");
                    window.location.href = "https://simsweb.uaic.ro/eSIMS/";
                    __doPostBack("ctl00$LoginStatus1$ctl00", "");
                });

                // Replace the link with the button
                loginLink.replaceWith(logoutButton);
            }

            const passwordRecoveryButton = document.querySelector(
                "#password-recovery-button"
            );
            if (passwordRecoveryButton) {
                passwordRecoveryButton.style.display = "none";
            }

            // Replace #ctl00_LoginName1 with a span with a better ID
            const loginNameElement =
                document.querySelector("#ctl00_LoginName1");
            if (loginNameElement) {
                const newSpan = document.createElement("span");
                newSpan.id = "user-login-name";
                newSpan.textContent = "UserID: " + loginNameElement.textContent;

                loginNameElement.replaceWith(newSpan);
            }

            const MembersButtons = document.querySelector("#subnav");

            if (MembersButtons) {
                MembersButtons.innerHTML = `
                  <a href="#subnav_skip_link" aria-label="Skip Navigation Links">
                    <img alt="Skip Navigation Links" src="/eSIMS/WebResource.axd?d=1pSzIWVbNnXjyFOVbiGkcfko30xsHz-djLmbuGdWFuSAWooUvNVNtIc5EI9PW_1D3ve4iAPIsljWPk-FrS7qwZnd7Co1&amp;t=638250744092864286" width="0" height="0" style="border: none;">
                  </a>

                  <ul class="subnav-list">
                    <li>
                      <a href="/eSIMS/Members/ChangePassword.aspx" title="Change password" id="change-password-link">
                        <?xml version="1.0" encoding="UTF-8"?><svg width="24px" stroke-width="1.5" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" style="--darkreader-inline-color: #e8e6e3;" data-darkreader-inline-color=""><path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143" stroke="#000000" stroke-width="1.5" stroke-linecap="round" style="--darkreader-inline-stroke: #000000;" data-darkreader-inline-stroke=""></path><path d="M8 3V11L10.5 9.4L13 11V3" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: #000000;" data-darkreader-inline-stroke=""></path><path d="M6 17L20 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" style="--darkreader-inline-stroke: #000000;" data-darkreader-inline-stroke=""></path><path d="M6 21L20 21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" style="--darkreader-inline-stroke: #000000;" data-darkreader-inline-stroke=""></path><path d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: #000000;" data-darkreader-inline-stroke=""></path></svg>
                        Schimbare parolă
                      </a>
                    </li>
                    <li>
                      <a href="/eSIMS/Members/StudentPage.aspx" title="Student page with grades and fees" id="student-page-link">
                        <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M2.57331 8.46334L11.2317 4.13416C11.4006 4.04971 11.5994 4.04971 11.7683 4.13416L20.4267 8.46334C20.8689 8.68446 20.8689 9.31554 20.4267 9.53666L11.7683 13.8658C11.5994 13.9503 11.4006 13.9503 11.2317 13.8658L2.57331 9.53666C2.13108 9.31554 2.13108 8.68446 2.57331 8.46334Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22.5 13L22.5 9.5L20.5 8.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.5 10.5V15.9121C4.5 16.6843 4.94459 17.3876 5.6422 17.7188L10.6422 20.0928C11.185 20.3505 11.815 20.3505 12.3578 20.0928L17.3578 17.7188C18.0554 17.3876 18.5 16.6843 18.5 15.9121V10.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        Note, taxe
                      </a>
                    </li>
                  </ul>

                  <a id="subnav_skip_link"></a>

                `;
            }

            // Find the wrapper element
            const wrapper = document.getElementById("wrapper");

            // Iterate over child nodes and remove text nodes
            for (let node of wrapper.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    wrapper.removeChild(node);
                }
            }
            const StudentPage =
                "https://simsweb.uaic.ro/eSIMS/Members/StudentPage.aspx";

            if (currentURL === StudentPage) {
                function copyXreplace() {
                    const copyXDiv = document.getElementById("copyX");
                    const table = copyXDiv.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp1036597691_wp1789031903_gridStudenti"
                    );
                    const rows = table.querySelectorAll("tbody tr");

                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header row
                        const cells = row.querySelectorAll("td");
                        const rowData = {
                            anScolar: cells[0].innerText,
                            anStudiu: cells[1].innerText,
                            semestru: cells[2].innerText,
                            grupa: cells[3].innerText,
                            specializare: cells[4].innerText,
                            detalii: cells[5].querySelector("a").href,
                        };
                        data.push(rowData);
                    });

                    // Create new div elements to replace the table
                    const newDiv = document.createElement("div");
                    newDiv.id = "newCopyX";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "student-info";
                        itemDiv.innerHTML = `
                        <span><strong>An Scolar:</strong><p>${item.anScolar}</p></span>
                        <span><strong>An Studiu:</strong><p>${item.anStudiu}</p></span>
                        <span><strong>Semestru:</strong><p>${item.semestru}</p></span>
                        <span><strong>Grupa:</strong><p>${item.grupa}</p></span>
                        <span><strong>Specializare:</strong><p>${item.specializare}</p></span>
                    `; // <span><a href="${item.detalii}">Detalii</a></span>
                        newDiv.appendChild(itemDiv);
                    });

                    // Replace the old table with the new div
                    copyXDiv.innerHTML = "";
                    copyXDiv.replaceWith(newDiv);
                }

                copyXreplace();

                const contentWrapperWP =
                    document.getElementById("contentwrapperWP");

                function transformDetaliiStudent() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp698779781_wp1318475282_DetailsView1"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row) => {
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 2) {
                            data.push({
                                label: cells[0].innerText.trim(),
                                value: cells[1].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "newDetaliiStudent";
                    newDiv.innerHTML = "<h2>Detalii student</h2>";
                    const parentDiv = document.createElement("div");
                    parentDiv.className = "student-info";
                    data.forEach((item) => {
                        if (item.value) {
                            const span = document.createElement("span");
                            span.innerHTML = `<strong>${item.label}:</strong><p>${item.value}</p>`;
                            parentDiv.appendChild(span);
                        }
                    });

                    newDiv.appendChild(parentDiv);
                    contentWrapperWP.append(newDiv);
                }

                function transformNoteleStudentului() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp1631116538_wp758412774_GridViewNote"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 7) {
                            data.push({
                                detalii: cells[0].innerText.trim(),
                                anUniv: cells[1].innerText.trim(),
                                semestru: cells[2].innerText.trim(),
                                disciplina: cells[3].innerText.trim(),
                                notaFinala: cells[4].innerText.trim(),
                                credite: cells[5].innerText.trim(),
                                data: cells[6].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "newNoteleStudentului";
                    newDiv.innerHTML = "<h2>Notele studentului</h2>";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "nota-info";
                        itemDiv.innerHTML = `
                      <span><strong>Detalii:</strong><p>${item.detalii}</p></span>
                      <span><strong>AnUniv:</strong><p>${item.anUniv}</p></span>
                      <span><strong>Semestru:</strong><p>${item.semestru}</p></span>
                      <span><strong>Denumire disciplina:</strong><p>${item.disciplina}</p></span>
                      <span><strong>Nota finala:</strong><p>${item.notaFinala}</p></span>
                      <span><strong>Credite:</strong><p>${item.credite}</p></span>
                      <span><strong>Data:</strong><p>${item.data}</p></span>
                  `;
                        newDiv.appendChild(itemDiv);
                    });

                    contentWrapperWP.append(newDiv);
                }

                function transformDetaliiTraiectorie() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp922026677_wp938475116_GridView1"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 8) {
                            data.push({
                                anStudiu: cells[0].innerText.trim(),
                                anUniv: cells[1].innerText.trim(),
                                semestru: cells[2].innerText.trim(),
                                grupa: cells[3].innerText.trim(),
                                specializare: cells[4].innerText.trim(),
                                profil: cells[5].innerText.trim(),
                                facultate: cells[6].innerText.trim(),
                                universitate: cells[7].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "newDetaliiTraiectorie";
                    newDiv.innerHTML = "<h2>Detalii traiectorie</h2>";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "traiectorie-info";
                        itemDiv.innerHTML = `
                          <span><strong>An Studiu:</strong><p>${item.anStudiu}</p></span>
                          <span><strong>An Univ:</strong><p>${item.anUniv}</p></span>
                          <span><strong>Semestru:</strong><p>${item.semestru}</p></span>
                          <span><strong>Grupa:</strong><p>${item.grupa}</p></span>
                          <span><strong>Specializare:</strong><p>${item.specializare}</p></span>
                          <span><strong>Profil:</strong><p>${item.profil}</p></span>
                          <span><strong>Facultate:</strong><p>${item.facultate}</p></span>
                          <span><strong>Universitate:</strong><p>${item.universitate}</p></span>
                      `;

                        newDiv.appendChild(itemDiv);
                    });

                    contentWrapperWP.append(newDiv);
                }

                function transformTraiectorieMedii() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp1381958556_wp815042676_GridViewMedii"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 9) {
                            data.push({
                                semestru: cells[0].innerText.trim(),
                                medieAritm: cells[1].innerText.trim(),
                                medieECTS: cells[2].innerText.trim(),
                                puncte: cells[3].innerText.trim(),
                                credite: cells[4].innerText.trim(),
                                medieAritmAn: cells[5].innerText.trim(),
                                medieECTSAn: cells[6].innerText.trim(),
                                puncteAn: cells[7].innerText.trim(),
                                crediteAn: cells[8].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "updatedTraiectorieMedii";
                    newDiv.innerHTML = "<h2>Mediile traiectoriei</h2>";
                    const parentDiv = document.createElement("div");
                    parentDiv.className = "medii-container";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "medii-info";
                        itemDiv.innerHTML = `
                          <span><strong>Semestru:</strong> <p>${item.semestru}</p></span>
                          <span><strong>Medie Aritm:</strong> <p>${item.medieAritm}</p></span>
                          <span><strong>Medie ECTS:</strong> <p>${item.medieECTS}</p></span>
                          <span><strong>Puncte:</strong> <p>${item.puncte}</p></span>
                          <span><strong>Credite:</strong> <p>${item.credite}</p></span>
                          <span><strong>Medie Aritm An:</strong> <p>${item.medieAritmAn}</p></span>
                          <span><strong>Medie ECTS An:</strong> <p>${item.medieECTSAn}</p></span>
                          <span><strong>Puncte An:</strong> <p>${item.puncteAn}</p></span>
                          <span><strong>Credite An:</strong> <p>${item.crediteAn}</p></span>
                      `;

                        parentDiv.appendChild(itemDiv);
                    });

                    newDiv.appendChild(parentDiv);
                    contentWrapperWP.append(newDiv);
                }

                function transformObligatiilePlataStudent() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp585798598_wp880472105_GridViewTaxe"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header row
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 6) {
                            data.push({
                                den: cells[0].innerText.trim(),
                                suma: cells[1].innerText.trim(),
                                moneda: cells[2].innerText.trim(),
                                semestru: cells[3].innerText.trim(),
                                anUniv: cells[4].innerText.trim(),
                                platit: cells[5].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "obligatiilePlataTransformed";
                    newDiv.innerHTML =
                        "<h2>Obligațiile de plată ale studentului</h2>";
                    const parentDiv = document.createElement("div");
                    parentDiv.className = "taxe-container";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "taxe-info";
                        itemDiv.innerHTML = `
                          <p><strong>Den:</strong> ${item.den}</p>
                          <p><strong>Suma:</strong> ${item.suma}</p>
                          <p><strong>Moneda:</strong> ${item.moneda}</p>
                          <p><strong>Semestru:</strong> ${item.semestru}</p>
                          <p><strong>AnUniv:</strong> ${item.anUniv}</p>
                          <p><strong>Platit:</strong> ${item.platit}</p>
                      `;
                        parentDiv.appendChild(itemDiv);
                    });

                    newDiv.appendChild(parentDiv);
                    contentWrapperWP.append(newDiv);
                }

                function transformDocumentelePlata() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp363459202_wp512888434_GridViewDocPlata"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header row
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 4) {
                            data.push({
                                den: cells[0].innerText.trim(),
                                nrDocPlata: cells[1].innerText.trim(),
                                dataDoc: cells[2].innerText.trim(),
                                suma: cells[3].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "documentelePlataTransformed";
                    newDiv.innerHTML =
                        "<h2>Documentele de plată ale studentului</h2>";
                    const parentDiv = document.createElement("div");
                    parentDiv.className = "plata-container";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "plata-info";
                        itemDiv.innerHTML = `
                          <span><strong>Den:</strong> <p>${item.den}</p></span>
                          <span><strong>NrDocPlata:</strong> <p>${item.nrDocPlata}</p></span>
                          <span><strong>DataDoc:</strong> <p>${item.dataDoc}</p></span>
                          <span><strong>Suma:</strong> <p>${item.suma}</p></span>
                      `;
                        parentDiv.appendChild(itemDiv);
                    });

                    newDiv.appendChild(parentDiv);
                    contentWrapperWP.append(newDiv);
                }

                function transformIstoriculPlatilor() {
                    const table = document.querySelector(
                        "table#ctl00_WebPartManagerPanel1_WebPartManager1_wp975733793_wp2073478443_GridViewTaxe"
                    );
                    if (!table) return;

                    const rows = table.querySelectorAll("tbody tr");
                    const data = [];
                    rows.forEach((row, index) => {
                        if (index === 0) return; // Skip header row
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 5) {
                            data.push({
                                sursa: cells[0].innerText.trim(),
                                sursaVal: cells[1].innerText.trim(),
                                destinatie: cells[2].innerText.trim(),
                                destVal: cells[3].innerText.trim(),
                                dataM: cells[4].innerText.trim(),
                            });
                        }
                    });

                    const newDiv = document.createElement("div");
                    newDiv.id = "istoriculPlatilorTransformed";
                    newDiv.innerHTML =
                        "<h2>Istoricul plăților studentului</h2>";
                    const parentDiv = document.createElement("div");
                    parentDiv.className = "istoric-container";
                    data.forEach((item) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "istoric-info";
                        itemDiv.innerHTML = `
                        <span><strong>Sursa:</strong> <p>${item.sursa}</p></span>
                        <span><strong>SursaVal:</strong> <p>${item.sursaVal}</p></span>
                        <span><strong>Destinatie:</strong> <p>${item.destinatie}</p></span>
                        <span><strong>DestVal:</strong> <p>${item.destVal}</p></span>
                        <span><strong>DataM:</strong> <p>${item.dataM}</p></span>
                    `;
                        parentDiv.appendChild(itemDiv);
                    });

                    newDiv.appendChild(parentDiv);
                    contentWrapperWP.append(newDiv);
                }

                transformDetaliiStudent();
                transformNoteleStudentului();
                transformDetaliiTraiectorie();
                transformTraiectorieMedii();
                transformObligatiilePlataStudent();
                transformDocumentelePlata();
                transformIstoriculPlatilor();

                const floatWrapper = document.querySelector("#floatwrapperX");
                floatWrapper.remove();

            }
        }
        loadingBox.remove();
        console.info("UserScript executed succesfully!");
    });
})();

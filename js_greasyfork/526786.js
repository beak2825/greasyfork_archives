// ==UserScript==
// @name        UAIC Grades Facelift
// @namespace   Violentmonkey Scripts
// @match       https://grades.uaic.ro/*
// @match       https://idp.uaic.ro/idp/profile/SAML2/Redirect/*
// @match       https://idp3-stud.uaic.ro/idp/profile/SAML2/*
// @grant       GM_addStyle
// @version     1.6
// @author      syulze
// @license     GPL-3.0-or-later
// @icon        https://gitlab.com/syulze/uaic-grades-beautify/-/raw/main/src/icon.svg
// @description 1/27/2025, 8:05:03 PM
// @downloadURL https://update.greasyfork.org/scripts/526786/UAIC%20Grades%20Facelift.user.js
// @updateURL https://update.greasyfork.org/scripts/526786/UAIC%20Grades%20Facelift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stub = false;
    let loggedIn = false;

    function createStyle(css) {
        const style = document.createElement('style');
        style.textContent = `
            ${css}
        `;
        document.head.appendChild(style);
    }

    GM_addStyle(`
        /* Toggle Button Styling */
        .toggle-button {
            font-size: 16px;
            display: block;
            background-color: #054164;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .toggle-button:hover {
            background-color: #043450;
        }

        div.content {
            display: flex;
            justify-content: center;
            flex-direction: column;
            height: 100vh;
        }
    `);

    function isMobileDevice() {
        const highDensity = window.devicePixelRatio > 1.5;
        const narrowScreen = window.innerWidth <= 1024;
        const portraitMode = window.innerHeight > window.innerWidth;
        console.log("is device mobile: ", narrowScreen && (highDensity || portraitMode))
        return narrowScreen && (highDensity || portraitMode);
    }

    let mobile = isMobileDevice();

    window.addEventListener('resize', () => {
        const newMobile = isMobileDevice();
        if (newMobile !== mobile) {
            mobile = newMobile;
        }
    });

    function prepareTransform(classPrefix, buttonText, wrapperTitle) {
        const container = document.createElement("div");
        container.classList.add(`${classPrefix}-container`);

        const wrapper = document.createElement("div");
        wrapper.classList.add(`${classPrefix}-wrapper`);

        const title = document.createElement("strong");
        title.textContent = `${wrapperTitle}`;

        let header = document.createElement("div");
        header.classList.add(`${classPrefix}-header`);
        header.style.cssText = `
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        `;

        header.appendChild(title);

        wrapper.appendChild(header);
        wrapper.appendChild(container);

        return {
            wrapper: wrapper,
            container: container
        };
    }

    //
    //
    // Fixes
    //
    //

    let btnsContainer = document.querySelector('div.btns-container');
    setTimeout(() => {
        btnsContainer ? (btnsContainer.style.cssText = 'display: flex') : {};
    }, 500);

    let h3Elem = document.querySelector('h3.u-text');
    if (h3Elem) {
        h3Elem.style.cssText = `
            margin: 20px 0px 20px 0px
        `;
    }

    // Select the footer element
    const footer = document.querySelector('footer'); // Replace 'footer' with the appropriate selector for your footer

    if (footer) {
        // Add CSS to make the footer sticky
        footer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 10;

        `;

        // Function to update body padding
        const updateBodyPadding = () => {
            const body = document.body;
            const footerHeight = footer.offsetHeight;
            body.style.paddingBottom = `${footerHeight}px`;
        };

        // Initial padding update
        updateBodyPadding();

        // Observe footer height changes
        const resizeObserver = new ResizeObserver(updateBodyPadding);
        resizeObserver.observe(footer);
    }

    let section = document.getElementById('sec-b151');
    section ? section.classList.remove('u-grey-5') : {};

    //
    //
    // Header and Back buttons
    //
    //

    function createModernNavMenu() {
        // Create menu button with SVG icon
        const menuButton = document.createElement('button');
        menuButton.className = 'modern-nav__toggle';
        menuButton.innerHTML = `
            <svg class="modern-nav__icon" width="36px" height="36px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                <path d="M6 5H18C20.2091 5 22 6.79086 22 9V15C22 17.2091 20.2091 19 18 19H6C3.79086 19 2 17.2091 2 15V9C2 6.79086 3.79086 5 6 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M14.5 10.75L12 13.25L9.5 10.75" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        `;

        // Create the navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'modern-nav__menu';

        // Menu items data
        const menuItems = [
            { text: 'Catalog electronic', href: 'index.php', className: 'modern-nav__link' },
            { text: 'Decont CTP', href: 'https://grades.uaic.ro/decont/student/', className: 'modern-nav__link' },
            { text: 'UAIC', href: 'http://www.uaic.ro', target: '_blank', className: 'modern-nav__link' },
            { text: 'DCDSI', href: 'http://www.dcd.uaic.ro', target: '_blank', className: 'modern-nav__link' },
            { text: 'Email studenți', href: 'http://dcd.uaic.ro/?page_id=1602', target: '_blank', className: 'modern-nav__link' },
            {
                text: 'Conturi studenți',
                className: 'modern-nav__dropdown',
                subItems: [
                    { text: 'Creare cont', href: 'https://test-register.uaic.ro/', target: '_blank', className: 'modern-nav__sublink' },
                    { text: 'Verificare cont', href: 'https://test-register.uaic.ro/stare-cont/', target: '_blank', className: 'modern-nav__sublink' },
                    { text: 'Resetare parolă', href: 'https://test-register.uaic.ro/password/', target: '_blank', className: 'modern-nav__sublink' }
                ]
            },
            { text: 'Logout', href: 'logout.php', target: '_blank', className: 'modern-nav__link modern-nav__link--logout' }
        ];

        // Create menu items
        menuItems.forEach(item => {
            if (item.subItems) {
                // Create dropdown container
                const dropdownContainer = document.createElement('div');
                dropdownContainer.className = 'modern-nav__dropdown-container';

                // Create main dropdown link
                const mainLink = document.createElement('a');
                mainLink.href = '#';
                mainLink.textContent = item.text;
                mainLink.className = item.className;

                // Create dropdown content
                const dropdownContent = document.createElement('div');
                dropdownContent.className = 'modern-nav__dropdown-content';

                // Add sub-items
                item.subItems.forEach(subItem => {
                    const subLink = document.createElement('a');
                    subLink.href = subItem.href;
                    subLink.textContent = subItem.text;
                    subLink.target = subItem.target || '';
                    subLink.className = subItem.className;
                    dropdownContent.appendChild(subLink);
                });

                // Event listeners for dropdown
                mainLink.addEventListener('mouseenter', () => {
                    dropdownContent.classList.add('modern-nav__dropdown-content--visible');
                });

                dropdownContainer.addEventListener('mouseleave', () => {
                    dropdownContent.classList.remove('modern-nav__dropdown-content--visible');
                });

                dropdownContainer.appendChild(mainLink);
                dropdownContainer.appendChild(dropdownContent);
                navContainer.appendChild(dropdownContainer);
            } else {
                // Create regular link
                const link = document.createElement('a');
                link.href = item.href;
                link.textContent = item.text;
                link.target = item.target || '';
                link.className = item.className;

                navContainer.appendChild(link);
            }
        });

        // Toggle menu visibility
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navContainer.classList.toggle('modern-nav__menu--visible');
            menuButton.classList.toggle('modern-nav__toggle--active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            navContainer.classList.remove('modern-nav__menu--visible');
            menuButton.classList.remove('modern-nav__toggle--active');
        });

        // Prevent menu from closing when clicking inside it
        navContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Create a container for both button and menu
        const container = document.createElement('div');
        container.className = 'modern-nav';
        container.appendChild(menuButton);
        container.appendChild(navContainer);

        return container;
    }

    GM_addStyle(`
    .modern-nav {
        position: fixed;
        top: 20px;
        right: 10px;
        z-index: 1001;
    }

    .modern-nav__toggle {
        padding: 10px;
        padding-top: 0px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: transform 0.3s ease-in-out;
    }

    .modern-nav__toggle--active {
        transform: rotate(180deg);
    }

    .modern-nav__icon {
        display: block;
    }

    .modern-nav__menu {
        display: none;
        position: absolute;
        right: 0;
        top: 100%;
        background: white;
        min-width: 200px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        border-radius: 8px;
        z-index: 1000;
        padding: 10px 0;
    }

    .modern-nav__menu--visible {
        display: block;
    }

    .modern-nav__link,
    .modern-nav__dropdown {
        display: block;
        padding: 12px 20px;
        color: #333;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .modern-nav__link:hover,
    .modern-nav__dropdown:hover {
        background-color: #f5f5f5;
    }

    .modern-nav__link--logout {
        color: #e74c3c;
    }

    .modern-nav__dropdown-container {
        position: relative;
    }

    .modern-nav__dropdown-content {
        display: none;
        position: absolute;
        background: white;
        min-width: 200px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        border-radius: 0 8px 8px 8px;
        z-index: 1;
    }

    .modern-nav__dropdown-content--visible {
        display: block;
    }

    .modern-nav__sublink {
        display: block;
        padding: 12px 20px;
        color: #333;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .modern-nav__sublink:hover {
        background-color: #f5f5f5;
    }
    `);

    const header = document.querySelector('header.header');

    function redoHeader() {
        if (!header) return;

        // Hide the header initially
        header.style.cssText = `
            position: fixed;
            top: -100px; /* Hide the header off-screen */
            left: 0;
            width: 100%;
            transition: top 0.5s ease-in-out; /* Smooth slide animation */
            z-index: 1000; /* Ensure the header is above other content */
        `;

        if (mobile) {
            const modernNav = createModernNavMenu();
            document.body.prepend(modernNav);
        } else {
            // Create a button with the provided SVG
            let button = document.createElement('button');
            button.innerHTML = `
                <svg width="36px" height="36px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M6 5H18C20.2091 5 22 6.79086 22 9V15C22 17.2091 20.2091 19 18 19H6C3.79086 19 2 17.2091 2 15V9C2 6.79086 3.79086 5 6 5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M14.5 10.75L12 13.25L9.5 10.75" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            `;
            button.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1001; /* Ensure the button is above the header */
                padding: 10px;
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: transform 0.3s ease-in-out; /* Smooth rotation animation */
            `;

            // Add the button to the page
            document.body.appendChild(button);

            // Toggle header visibility and rotate the button on click
            button.addEventListener('click', () => {
                if (header.style.top === '-100px') {
                    header.style.top = '0'; // Slide the header into view
                    button.style.transform = 'rotate(180deg)'; // Rotate the button
                } else {
                    header.style.top = '-100px'; // Slide the header out of view
                    button.style.transform = 'rotate(0deg)'; // Reset the button rotation
                }
            });
        }
    }

    redoHeader();

    function freshBackButton() {
        if (mobile) return;

        let backButton = document.createElement('button');
        backButton.innerHTML = `
            <svg
               width=36px
               viewBox="0 0 512 512"
               xmlns="http://www.w3.org/2000/svg">

            <path
               fill="#FFFFFF"
               opacity="1.000000"
               stroke="none"
               d=" M151.000000,449.000000   C143.001923,449.000000 135.496857,448.788727 128.007019,449.037231   C98.580429,450.013641 71.947639,427.482788 66.037811,398.902618   C65.415451,395.892853 65.046104,392.771759 65.042671,389.701752   C64.983376,336.715454 64.873962,283.728546 65.082741,230.742966   C65.139664,216.296631 70.340439,203.051147 80.679459,193.232864   C92.210342,182.282761 105.170166,172.794800 117.818947,163.075058   C134.380310,150.348785 151.228699,137.995285 167.985931,125.524826   C186.038589,112.090324 204.002228,98.530533 222.261597,85.382156   C230.058182,79.767914 239.154221,77.250336 248.762207,75.880417   C269.352753,72.944580 286.296814,80.308800 302.169281,92.530190   C322.691528,108.331863 343.671417,123.538132 364.399567,139.073776   C382.299835,152.489929 400.055206,166.100143 418.009552,179.443008   C427.141968,186.229767 435.590027,193.598572 441.143646,203.698288   C445.601715,211.805695 448.944641,220.391220 448.959473,229.784622   C449.043365,282.937500 449.049164,336.090668 448.966125,389.243530   C448.944824,402.871490 443.590271,414.540924 435.368378,425.240265   C426.492737,436.790344 414.779694,443.681122 401.022919,447.426819   C397.450745,448.399445 393.641357,448.932343 389.940186,448.936249   C310.460205,449.020172 230.980087,449.000000 151.000000,449.000000  M340.362854,176.031403   C334.245544,171.524506 328.114899,167.035568 322.013428,162.507324   C303.809601,148.997223 285.662628,135.409897 267.394348,121.987579   C261.441132,117.613541 252.509018,117.675400 246.437439,122.138947   C225.696899,137.386444 205.042145,152.751007 184.395721,168.126022   C163.352478,183.796539 142.406754,199.598419 121.315384,215.203674   C113.832710,220.740021 108.003654,227.072891 108.002525,237.052734   C107.996956,286.043762 107.839676,335.035675 108.107254,384.025238   C108.178474,397.065704 116.911804,405.846741 129.770218,405.881500   C214.587387,406.110931 299.405792,406.110443 384.222992,405.882111   C397.086975,405.847504 405.821075,397.064697 405.892456,384.031952   C406.160767,335.042389 406.036682,286.050415 405.960358,237.059509   C405.948944,229.734375 403.174744,223.364182 397.267242,218.851547   C388.786987,212.373596 380.027924,206.261826 371.502197,199.841904   C361.260437,192.129807 351.138763,184.258255 340.362854,176.031403  z"
               id="path2"
               style="fill:#000000;fill-opacity:1" />

            <path
               fill="#FFFFFF"
               opacity="1.000000"
               stroke="none"
               d=" M353.317078,284.819519   C357.990662,292.583130 361.708099,300.280731 363.119659,309.074371   C365.238251,322.272156 364.375122,335.062164 358.917847,347.287842   C350.646179,365.818451 336.624146,378.268158 317.009827,383.230042   C308.091736,385.485992 298.534088,385.475311 289.239532,385.896576   C282.133575,386.218689 275.063354,386.493347 268.131561,383.150146   C254.159744,376.411438 252.744278,354.447937 265.849609,346.192169   C269.707977,343.761658 274.763336,342.611237 279.393402,342.171265   C286.327301,341.512360 293.370789,342.061981 300.366455,341.985443   C310.759521,341.871704 321.015503,331.633331 320.999695,321.487091   C320.986328,312.915222 313.377716,303.001587 305.026703,301.082672   C301.883606,300.360443 298.580231,300.057098 295.348175,300.045349   C272.077087,299.960693 248.805527,300.000000 226.025299,300.000000   C229.046524,304.810791 233.112427,309.278107 234.881195,314.520447   C238.531586,325.339722 234.694977,334.013214 227.375885,338.750824   C217.324020,345.257355 206.370621,344.132355 199.009125,336.609100   C184.796570,322.084198 170.466919,307.666595 155.895523,293.503174   C148.666718,286.476746 147.490906,272.583832 154.514267,265.125488   C168.514023,250.258774 182.644150,235.479645 197.385757,221.358932   C207.297516,211.864624 216.392349,211.520584 226.823059,218.031937   C236.862900,224.299332 239.140350,239.645767 231.695801,248.806290   C229.637115,251.339478 227.554123,253.852905 225.188995,256.732452   C226.650131,256.825897 228.010986,256.988007 229.371933,256.988861   C253.526474,257.004242 277.681824,256.876129 301.835297,257.037445   C322.845062,257.177734 339.167847,266.563751 351.652374,283.136383   C352.049957,283.664154 352.577545,284.093964 353.317078,284.819519  z"
               id="path4"
               style="fill:#000000;fill-opacity:1" />
            </svg>`;

        // Add a click event listener to the button
        backButton.addEventListener('click', () => {
            window.history.back();
        });

        if (mobile) {
            backButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1001; /* Ensure the button is above the header */
                padding: 10px;
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: transform 0.3s ease-in-out; /* Smooth rotation animation */
            `;
        } else {
            backButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 66px;
                z-index: 1001; /* Ensure the button is above the header */
                padding: 10px;
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: transform 0.3s ease-in-out; /* Smooth rotation animation */
            `;
        }
        // Add the button to the page
        if (window.history.length > 1 && !mobile) {
            document.body.appendChild(backButton);
        }
    }

    freshBackButton();

    if (window.location.hostname === "grades.uaic.ro") {
        let backLink = document.querySelector('a[href="javascript:window.history.back()"]');
        let child = backLink ?.parentElement;
        let parent = child ?.parentElement;
        parent ?.removeChild(child);
    }

    //
    //
    // General - grades.uaic.ro
    //
    //

    let elementsToHide = [
        '.u-table-alt-custom-color-1 > tr:nth-child(1) > td:nth-child(5)',
        'tbody.u-table-alt-custom-color-1:nth-child(4)',
        '.u-custom-color-2 > tr:nth-child(1) > th:nth-child(5)',
        '#sec-b151 > div:nth-child(1) > div:nth-child(3)',
        '#sec-1ab3',
        "#sec-b151 > div:nth-child(1) > div:nth-child(2)",
        ".tabele-traiectorie-plata > p:nth-child(1)"
    ];

    elementsToHide.forEach((selector) => {
        let element = selector ? document.querySelector(selector) : false;
        element ? (element.style.display = 'none') : {};
    });

    //
    //
    // Mobile fixes
    //
    //

    if (mobile) {
        if (header.parentNode) {
            header.parentNode.removeChild(header);
            console.log("removed header");
        }
        let footer = document.querySelector("footer");
        if (footer.parentNode) {
            footer.parentNode.removeChild(footer);
            console.log("removed footer");
        }
    }

    //
    //
    // After login
    //
    //

    // Check if the target element exists and is a "Log out" button
    const logoutButton = document.querySelector('.setWidth > div:nth-child(2) > a:nth-child(2)');
    if (logoutButton && logoutButton.textContent.trim() === 'Log out') {
        loggedIn = true;
        const section = document.querySelector('#sec-1ab3');
        if (section) {
            section.style.display = 'none'; // Make the section invisible
        }
    }

    const matricolForm = document.querySelector('form[name="matricol"]');
    if (matricolForm) {
        const infoWarning = document.querySelector('.setWidth > p:nth-child(4) > strong:nth-child(1)');
        infoWarning.textContent = 'Înainte de a trece la pagina următoare, vă rugăm să selectați un număr matricol apăsând pe acesta.';
        const tbody = matricolForm.querySelector('tbody.u-table-alt-custom-color-1.u-table-body');
        const radioInput = tbody.querySelector('input[type="radio"]');

        if (tbody && radioInput) {

            // Add a click event listener to tbody
            tbody.addEventListener('click', () => {
                // Check the radio input
                radioInput.checked = true;

                // Submit the matricolForm
                matricolForm.submit();
            });

            const SelectButton = document.querySelector('.customMatricolTableu-table-entity > tbody:nth-child(3)');
            if (SelectButton) SelectButton.style.display = 'none';

            tbody.style.cssText = 'cursor: pointer';
        }
    }

    //
    //
    //  Transform tables on main page
    //
    //

    const urlParams = new URLSearchParams(window.location.search);

    let indexPage = (
        window.location.pathname === '/login/index.php' &&
        urlParams.has('pag') &&
        urlParams.get('pag') === 'select-matricol'
    );

    let transformed = document.createElement('div');

    if (window.location.href === "https://grades.uaic.ro/login/index.php?pag=select-matricol") {
        transformed.className = "transformed";
        document.body.appendChild(transformed);
    }

    transformed = document.querySelector('div.transformed');

    let noteForm = document.querySelector('form[name="note"]');
    const customInfoStudentTable = ((noteForm ?.parentElement) ?.parentElement) ?.querySelector('table.customInfoStudentTable');

    if (!transformed) {
        noteForm = false;
        indexPage ? console.error("transformed div does not exist") : {};
    } else {
        document.body.removeChild(transformed);
        transformed = document.createElement('div');
        transformed.className = 'transformed';
        GM_addStyle(`
            .transformed {
                display: flex;
                gap: 10px;
                align-items: center;
                place-content: space-evenly;
            }

            /* Responsive Design */
            @media (max-width: 1000px) {
                .transformed {
                    flex-direction: column;
                }
            }
        `);
        customInfoStudentTable.insertAdjacentElement('beforebegin', transformed);
        transformed = document.querySelector('div.transformed');
    }

    function createModernStudentInfoDiv(data) {
        const div = document.createElement('div');
        div.classList.add('modern-student-info-container');

        div.setAttribute('style', `
            display: flex;
            flex-wrap: wrap;
            gap: 15px; /* Space between items */
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 100%;
            box-sizing: border-box;
        `);

        const title = document.createElement('h2');
        title.textContent = 'Informații student';
        title.setAttribute('style', `
            width: 100%;
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        `);
        div.appendChild(title);

        // Create individual info items
        for (const [label, value] of Object.entries(data)) {
            if (!value || value.trim() === '') {
                continue;
            }

            const item = document.createElement('div');
            item.classList.add('modern-student-info-item');
            item.setAttribute('style', `
                flex: 1 1 calc(50% - 15px); /* Two columns on larger screens, one on smaller */
                min-width: 280px; /* Minimum width before wrapping */
                padding: 12px 15px;
                background-color: #fff;
                border-radius: 5px;
                border: 1px solid #eee;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            `);

            const labelSpan = document.createElement('span');
            labelSpan.classList.add('info-label');
            labelSpan.textContent = label;
            labelSpan.setAttribute('style', `
                font-weight: bold;
                color: #555;
                margin-bottom: 5px;
                font-size: 0.9em;
            `);

            const valueSpan = document.createElement('span');
            valueSpan.classList.add('info-value');
            valueSpan.textContent = value || 'N/A'; // Handle empty values (though we now skip them)
            valueSpan.setAttribute('style', `
                color: #333;
                font-size: 1.1em;
                word-break: break-word; /* Prevents long words from overflowing */
            `);

            item.appendChild(labelSpan);
            item.appendChild(valueSpan);
            div.appendChild(item);
        }

        // Add a media query for even bigger vertical spacing on large screens if desired
        // This would typically go in a stylesheet, but we can append a <style> tag
        const style = document.createElement('style');
        style.textContent = `
            @media (min-width: 1200px) {
                .modern-student-info-item {
                    padding: 20px 25px; /* Bigger padding for more vertical space */
                }
                .modern-student-info-container {
                     gap: 25px; /* More space between items */
                }
            }
        `;
        div.appendChild(style);

        return div;
    }

    // Select the target table
    const targetTable = document.querySelector('table.customInfoStudentTable.u-table-entity.u-table-entity-1');

    if (targetTable) {
        // Extract data from the existing table
        const data = {};
        const rows = targetTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                const label = cells[0].textContent.trim();
                const value = cells[1].textContent.trim();
                data[label] = value;
            }
        });

        // Create the new modern div
        const newDiv = createModernStudentInfoDiv(data);

        // Replace the old table with the new div
        targetTable.parentNode.replaceChild(newDiv, targetTable);
    }

    function replaceRadioButtons() {
        const form = document.querySelector('form[name="note"]');
        if (!form) return;

        const table = form.querySelector('#student-traiectorie');
        if (!table) return;

        const titlep = document.createElement('p');
        const titlestrong = document.createElement('strong');
        titlestrong.textContent="Vezi note";
        titlep.appendChild(titlestrong);
        form.insertAdjacentElement("afterbegin", titlep);

        // Data structure to hold buttons grouped by study year
        const yearsData = {}; // e.g., { "1": [{buttonHTML, value, schoolYear, yearOfStudy, semester}, ...], "2": [...] }
        let selectedButtonData = null; // Store the data of the currently selected button

        // Iterate through existing table rows to collect data and remove radio inputs
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.children;
            if (cells.length >= 7) {
                const anScolar = cells[0].textContent.trim();
                const anStudiu = cells[1].textContent.trim();
                const semestru = cells[3].textContent.trim();
                const specializare = cells[5].textContent.trim();
                const radioInputCell = cells[6];
                const radioInput = radioInputCell.querySelector('input[type="radio"][name="radionote"]');

                if (radioInput) {
                    const buttonValue = radioInput.value; // e.g., "1,1,2024"
                    const buttonText = `An școlar: ${anScolar}, Semestru: ${semestru}, Specializare: ${specializare}`;

                    if (!yearsData[anStudiu]) {
                        yearsData[anStudiu] = [];
                    }
                    const currentButtonData = {
                        text: buttonText,
                        value: buttonValue,
                        originalRadio: radioInput,
                        isChecked: radioInput.checked,
                        schoolYear: anScolar,
                        yearOfStudy: anStudiu,
                        semester: semestru
                    };
                    yearsData[anStudiu].push(currentButtonData);

                    // If this radio was initially checked, mark its data as selected
                    if (radioInput.checked) {
                        selectedButtonData = currentButtonData;
                    }
                }
            }
        });

        // Create a new container for all the grouped buttons
        const mainButtonsContainer = document.createElement('div');
        mainButtonsContainer.id = 'all-grades-sections';
        mainButtonsContainer.style.maxWidth = '600px';
        mainButtonsContainer.style.margin = '20px auto';
        mainButtonsContainer.style.display = 'flex';
        mainButtonsContainer.style.flexDirection = 'column';
        mainButtonsContainer.style.gap = '25px';

        // Sort study years numerically
        const sortedYears = Object.keys(yearsData).sort((a, b) => parseInt(a) - parseInt(b));

        // Iterate through sorted years and create sections
        sortedYears.forEach(year => {
            const yearSection = document.createElement('div');
            yearSection.classList.add('grade-year-section');

            const yearHeading = document.createElement('h3');
            yearHeading.textContent = `Anul ${year} de studiu`;
            yearHeading.classList.add('grade-year-heading');
            yearSection.appendChild(yearHeading);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('year-buttons-container');
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.flexDirection = 'column';
            buttonsContainer.style.gap = '10px';
            buttonsContainer.style.padding = '15px';
            buttonsContainer.style.backgroundColor = '#f8f8f8';
            buttonsContainer.style.borderRadius = '8px';
            buttonsContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            yearSection.appendChild(buttonsContainer);

            yearsData[year].forEach(buttonData => {
                const button = document.createElement('button');
                button.type = 'button';
                button.classList.add('modern-grade-button');
                button.value = buttonData.value;
                button.textContent = buttonData.text;

                // Set data attributes for XHR request
                button.setAttribute('data-school-year', buttonData.schoolYear);
                button.setAttribute('data-year-of-study', buttonData.yearOfStudy);
                button.setAttribute('data-semester', buttonData.semester);

                if (buttonData.isChecked) {
                    button.classList.add('selected-grade-button');
                }

                button.addEventListener('click', () => {
                    // Remove 'selected' class from all buttons
                    document.querySelectorAll('.modern-grade-button').forEach(btn => {
                        btn.classList.remove('selected-grade-button');
                    });
                    // Add 'selected' class to the clicked button
                    button.classList.add('selected-grade-button');
                    selectedButtonData = buttonData; // Update the selected button data

                    // Ensure the original hidden radio input is checked for form validity if needed
                    document.querySelectorAll('input[name="radionote"]').forEach(radio => radio.checked = false);
                    if (buttonData.originalRadio) {
                        buttonData.originalRadio.checked = true;
                    }
                });
                button.addEventListener('click', () => {
                    const xhr = new XMLHttpRequest();
                    const url = 'https://grades.uaic.ro/login/note.php'; // Specific URL as requested

                    // Construct the request body using data from the selected button
                    const yearOfStudy = selectedButtonData.yearOfStudy;
                    const semester = selectedButtonData.semester;
                    const schoolYear = selectedButtonData.schoolYear;
                    const body = `radionote=${encodeURIComponent(yearOfStudy)}%2C${encodeURIComponent(semester)}%2C${encodeURIComponent(schoolYear)}&ViewNote=Vizualizeaz%C4%83+note`;

                    xhr.open('POST', url, true);

                    // Set the request headers as specified
                    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
                    xhr.setRequestHeader('Accept-Language', 'en-US,en;q=0.5');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.setRequestHeader('Upgrade-Insecure-Requests', '1');

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            loadingIndicator.style.display = 'none'; // Hide loading indicator
                            // Redirect as specified by the user
                            window.location.href = 'https://grades.uaic.ro/login/note.php?';
                        }
                    };

                    xhr.onerror = function() {
                        loadingIndicator.style.display = 'none'; // Hide loading indicator
                        console.error('XHR network error.');
                        // Optionally show a network error message to the user
                    };

                    xhr.send(body);
                });
                buttonsContainer.appendChild(button);
            });
            mainButtonsContainer.appendChild(yearSection);
        });

        // Replace the original table with the new main buttons container
        table.parentNode.replaceChild(mainButtonsContainer, table);

        // Ensure the original 'select-err-semestru' div is still present for error messages
        const selectErrSemestru = document.getElementById('select-err-semestru');
        if (!selectErrSemestru) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'select-err-semestru';
            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '<p style="color:#dc3545; margin-top: 10px; margin-bottom: 10px; text-align: center;">Vă rugăm să selectați o căsuță.</p>';
            form.insertBefore(errorDiv, form.querySelector('.buttonsPosition'));
        }

        // Add a loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.textContent = 'Loading grades...';
        loadingIndicator.style.display = 'none';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.marginTop = '20px';
        loadingIndicator.style.color = '#054164';
        loadingIndicator.style.fontWeight = 'bold';
        form.appendChild(loadingIndicator);

        GM_addStyle(`
            form[name="note"] p {
                color: rgb(168, 81, 138);
                text-align: center;
                margin-bottom: 3px;
            }
            .grade-year-section {
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 0;
                background-color: #ffffff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .grade-year-heading {

                padding: 15px 20px;
                margin: 0;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                font-size: 1.2em;
                text-align: center;
            }
            .year-buttons-container {
                padding: 15px;
            }
            .modern-grade-button {
                background-color: #054164;
                color: #ffffff;
                border: none;
                padding: 12px 18px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
                font-family: 'Inter', sans-serif;
            }
            .modern-grade-button:hover {
                background-color: #0a58ca;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .modern-grade-button.selected-grade-button {
                background-color: #28a745; /* Green for selected */
                box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.5), 0 0 10px rgba(40, 167, 69, 0.4); /* Highlight selected with glow */
                font-weight: bold;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                #all-grades-sections {
                    margin: 15px auto;
                    gap: 20px;
                }
                .grade-year-heading {
                    font-size: 1.1em;
                    padding: 12px 15px;
                }
                .year-buttons-container {
                    padding: 10px;
                }
                .modern-grade-button {
                    font-size: 14px;
                    padding: 10px 15px;
                }
            }

            @media (max-width: 480px) {
                #all-grades-sections {
                    margin: 10px auto;
                    gap: 15px;
                }
                .grade-year-heading {
                    font-size: 1em;
                    padding: 10px 12px;
                }
                .year-buttons-container {
                    padding: 8px;
                }
                .modern-grade-button {
                    font-size: 12px;
                    padding: 8px 10px;
                }
            }
        `);
    }

    function saveAndRemoveTraiectorieMedii() {
        const traiectorieTable = document.getElementById('traiectorie-medii');
        if (traiectorieTable) {
            const tableData = [];
            // Get table headers from the first tbody (u-palette-1-base u-table-header u-table-header-1)
            const headerRow = traiectorieTable.querySelector('tbody.u-palette-1-base.u-table-header.u-table-header-1 tr');
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                tableData.push(headers);
            }

            // Get data rows from the subsequent tbody
            const dataTbody = traiectorieTable.querySelector('tbody:not(.u-table-header)');
            if (dataTbody) {
                const dataRows = dataTbody.querySelectorAll('tr');
                dataRows.forEach(row => {
                    const rowData = [];
                    const cells = row.querySelectorAll('td');
                    cells.forEach(cell => {
                        rowData.push(cell.textContent.trim());
                    });
                    if (rowData.some(data => data !== '')) { // Only add if row has content
                        tableData.push(rowData);
                    }
                });
            }

            try {
                localStorage.setItem('traiectorieMediiData', JSON.stringify(tableData));
                console.log('Traiectorie medii data saved to local storage.');
            } catch (e) {
                console.error('Failed to save traiectorie medii data to local storage:', e);
            }

            // Remove the element from the DOM
            traiectorieTable.remove();
            console.log('Traiectorie medii table removed from DOM.');
        }
    }

        replaceRadioButtons();
        saveAndRemoveTraiectorieMedii();

    function sortTable(table, column) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Determine sort direction
        const ascending = !table.dataset.sortDirection || table.dataset.sortDirection === 'desc';
        table.dataset.sortDirection = ascending ? 'asc' : 'desc';

        // Sort rows
        rows.sort((a, b) => {
            const aVal = a.children[column].textContent.trim();
            const bVal = b.children[column].textContent.trim();

            // Handle numeric values
            if (!isNaN(aVal) && !isNaN(bVal)) {
                return ascending ? aVal - bVal : bVal - aVal;
            }

            // Handle date values
            if (aVal.includes('/') && bVal.includes('/')) {
                const dateA = new Date(aVal.split('/').reverse().join('-'));
                const dateB = new Date(bVal.split('/').reverse().join('-'));
                return ascending ? dateA - dateB : dateB - dateA;
            }

            // Default string comparison
                return ascending ?
                aVal.localeCompare(bVal) :
                bVal.localeCompare(aVal);
        });

        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
    }

    const PaymentsCards = () => {
        const table = document.getElementById("payment-documents");
        if (!table) return;

        const headers = table.querySelectorAll('th');

        headers.forEach((header, index) => {
            if (header.textContent) { // Skip empty headers
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    sortTable(table, index);
                });
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .payment-table-container {
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                margin: 1rem 0;
            }

            #payment-documents {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                font-family: "Segoe UI", system-ui, sans-serif;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                overflow: hidden;
                background-color: #ffffff;
            }

            /* Header Styles */
            #payment-documents thead {
                background: linear-gradient(135deg, #054164 0%, #065a8a 100%);
                color: white;
            }

            #payment-documents th {
                padding: 1rem;
                text-align: left;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Body Styles */
            #payment-documents td {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #eee;
                position: relative;
            }

            /* Add tooltips using data-doc attributes */
            #payment-documents td::after {
                content: attr(data-doc);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: #fff;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s;
                font-size: 0.75rem;
            }

            #payment-documents td:hover::after {
                opacity: 1;
            }

            /* Row Styling */
            #payment-documents tbody tr:nth-child(even) {
                background-color: #f9f9f9;
            }

            #payment-documents tbody tr:hover {
                background-color: #f0f8ff;
                transform: scale(1.005);
                transition: transform 0.2s ease;
            }

            /* Optional dark mode support */
            @media (prefers-color-scheme: dark) {
                #payment-documents {
                    background-color: #1a1a1a;
                    color: #e6e6e6;
                }

                #payment-documents tbody tr:nth-child(even) {
                    background-color: #2d2d2d;
                }
            }

        `;
        document.head.appendChild(style);
    };

    PaymentsCards();

    const obligatiiPlata = () => {
        const table = document.getElementById("obligatii-plata");
        if (!table) return;

        let elements = prepareTransform('obligatii', 'Obligatii', 'Obligatii Plata');

        // Hardcoded labels
        const labels = ["An universitar",
            "Semestru",
            "Denumire taxă",
            "Suma",
            "Plătit",
            "Scadență"
        ];

        // Create cards for each row
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const card = document.createElement("div");
            card.classList.add("obligatii-card");

            const cells = row.querySelectorAll("td");
            let isEmpty = true; // Assume the card is empty initially

            cells.forEach((cell, index) => {
                const label = labels[index]; // Use the hardcoded label
                const value = cell.textContent.trim();

                if (value) {
                    isEmpty = false; // If any field has a value, the card is not empty
                }

                const field = document.createElement("div");
                field.classList.add("obligatii-field");

                const labelDiv = document.createElement("div");
                labelDiv.classList.add("obligatii-label");
                labelDiv.textContent = label; // Set the label text

                const valueDiv = document.createElement("div");
                valueDiv.classList.add("obligatii-value");
                valueDiv.textContent = value || "N/A"; // Handle empty values

                field.appendChild(labelDiv);
                field.appendChild(valueDiv);
                card.appendChild(field);
            });

            // Only append the card if it's not empty
            if (!isEmpty) {
                elements.container.appendChild(card);
            }
        });


        const style = document.createElement('style');
        style.textContent = `
            .tabele-traiectorie-plata {
                flex-direction: row;
                gap: 20px;
                margin-top: 10px;
                flex-wrap: wrap;
            }

            @media (max-width: 1000px) {
                .tabele-traiectorie-plata {
                    flex-direction: column;
                }
            }

            .obligatii-wrapper {
                background-color: gainsboro;
                border-radius: 10px;
            }

            .obligatii-wrapper strong {
                padding: 10px;
            }

            .obligatii-container {
                padding: 10px;
                display: flex;
                flex-direction: auto;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
                transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
                overflow: hidden;
            }

            .obligatii-container.collapsed {
                max-height: 0;
                opacity: 0;
            }

            /* Card Styling */
              .obligatii-card {
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                min-width: 220px;
            }

            .obligatii-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            }

            /* Field Styling */
            .obligatii-field {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
            }

            .obligatii-label {
                font-weight: bold;
                color: #054164;
                margin-bottom: 5px;
            }

            .obligatii-value {
                color: #333;
            }

            /* Responsive Design */
            @media (max-width: 1000px) {
            }
        `;
        document.head.appendChild(style);

        // Replace the table with the card container
        table.replaceWith(elements.wrapper);
    };

    obligatiiPlata();

    //
    //
    // note.php
    //
    //

    const notePage = (window.location.pathname === '/login/note.php');

    const noteStudenti = () => {

        // slide the title higher
        const h1Elements = document.querySelectorAll('h1.u-text.u-text-custom-color-5.u-text-1');
        h1Elements.forEach(h1 => {
            if (h1.textContent.trim() === 'Catalog electronic studenți') {
                h1.style.marginTop = '10px';
            }
        });

        const table = document.querySelector(".gradesTable");
        const container = document.createElement("div");
        container.classList.add("grades-container");

        const labels = ["Disciplina", "Nota", "Credite"];

        // Function to determine the background color based on the grade
        const getGradeColor = (grade) => {
            if (grade >= 9) return "#d4edda";
            if (grade >= 7) return "#fff3cd";
            if (grade >= 5) return "#f8d7da";
            return "#f5f5f5";
        };

        let hasCards = false; // Flag to track if any cards are added

        // Create cards for each row
        const rows = table.querySelectorAll("tbody tr.parent");
        rows.forEach((row) => {
            const card = document.createElement("div");
            card.classList.add("grade-card");

            const cells = row.querySelectorAll("td");
            let isEmpty = true; // Assume the card is empty initially
            let isInfo = false;
            let gradeValue = null; // To store the grade value

            const info = document.createElement("div");
            info.className = 'grade-info';

            cells.forEach((cell, index) => {
                if (index >= labels.length) return; // Skip the button cell

                const label = labels[index];
                const value = cell.textContent.trim();

                if (value) {
                    isEmpty = false;
                }

                const field = document.createElement("div");
                field.classList.add("grade-field");

                const labelDiv = document.createElement("div");
                labelDiv.classList.add("grade-label");
                labelDiv.textContent = label;

                const valueDiv = document.createElement("div");
                valueDiv.classList.add("grade-value");
                valueDiv.textContent = value || "N/A";

                field.appendChild(labelDiv);
                field.appendChild(valueDiv);

                if (index > 0) {
                    isInfo = true;
                    info.append(field);
                } else {
                    isInfo = false;
                    card.appendChild(field)
                }

                // Store the grade value if the label is "Nota"
                if (label === "Nota" && value) {
                    gradeValue = parseFloat(value);
                }
            });

            isInfo ? (card.appendChild(info)) : {};

            // Set the background color based on the grade value
            if (gradeValue !== null && !isNaN(gradeValue)) {
                card.style.backgroundColor = getGradeColor(gradeValue);
            }

            // Only append the card if it's not empty
            if (!isEmpty) {
                container.appendChild(card);
                hasCards = true; // At least one card was added
            }
        });

        // If no cards were added, display a message
        if (!hasCards) {
            const noDataMessage = document.createElement("div");
            noDataMessage.classList.add("no-data-message");
            noDataMessage.textContent = "Nu există date disponibile."; // "No data available."
            container.appendChild(noDataMessage);
        }

        // Replace the table with the card container
        table.replaceWith(container);

        // Add toggle functionality
        const togglers = document.querySelectorAll(".grade-button-container .toggler");
        togglers.forEach((toggler) => {
            toggler.addEventListener("click", function() {
                const historicalGrades = this.closest(".grade-card").querySelector(".historical-grades");
                if (historicalGrades) {
                    historicalGrades.style.display = historicalGrades.style.display === "none" ? "block" : "none";
                }
            });
        });

        GM_addStyle(`
            .grades-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }

            /* Card Styling */
            .grade-card {
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
            }

            .grade-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            }

            /* Field Styling */

            .grade-info {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
            }

            .grade-field {
                margin-bottom: 15px;
            }

            .grade-label {
                font-weight: bold;
                color: #054164;
                margin-bottom: 5px;
            }

            .grade-value {
                color: #333;
            }

            /* Button Styling */
            .grade-button-container {
                text-align: center;
                margin-top: 15px;
            }

            .grade-button-container .toggler {
                background-color: #054164;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .grade-button-container .toggler:hover {
                background-color: #043450;
            }

            /* Historical Grades Styling */
            .historical-grades {
                margin-top: 15px;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 5px;
            }

            .historical-grades table {
                width: 100%;
                border-collapse: collapse;
            }

            .historical-grades th,
            .historical-grades td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }

            .historical-grades th {
                background-color: #88b4dd;
                color: #fff;
            }

            /* No Data Message Styling */
            .no-data-message {
                text-align: center;
                font-size: 1.2em;
                color: #888;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
                margin: 20px auto;
                max-width: 600px;
            }

            /* Responsive Design */
            @media (max-width: 600px) {
                .grades-container {
                    grid-template-columns: 1fr;
                }
            }
        `);
    }

    notePage ? noteStudenti() : {};

    //
    //
    // IndexedDB setup
    //
    //

    const dbName = 'CredentialsDB';
    const storeName = 'credentials';
    let db;

    // Open (or create) the database
    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = (event) => {
                db = event.target.result;
                const objectStore = db.createObjectStore(storeName, {
                    keyPath: 'id'
                });
                objectStore.createIndex('username', 'username', {
                    unique: true
                });
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject('Database error: ' + event.target.errorCode);
            };
        });
    };

    // Function to store credentials
    const storeCredentials = (username, password) => {
        const request = db.transaction([storeName], 'readwrite').objectStore(storeName).put({
            id: 'idp_uaic',
            username,
            password
        });

        request.onsuccess = () => {
            console.log('Credentials saved for autologin');
        };

        request.onerror = (event) => {
            console.error('Error storing credentials:', event.target.error);
        };
    };

    // Function to retrieve credentials
    const getCredentials = () => {
        return new Promise((resolve, reject) => {
            const request = db.transaction([storeName], 'readonly').objectStore(storeName).get('idp_uaic');

            request.onsuccess = (event) => {
                if (event.target.result) {
                    resolve(event.target.result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                reject('Error retrieving credentials:', event.target.error);
            };
        });
    };

    //
    //
    // While logging in
    //
    //

    // Main function to handle autologin
    const handleAutologin = async() => {
        const usernameField = document.querySelector('#username');
        const passwordField = document.querySelector('#password');
        const loginButton = document.querySelector('button.form-element');

        if (usernameField && passwordField) {
            console.log('Login form detected on idp.uaic.ro');

            // Open the database and get stored credentials
            await openDatabase();
            const credentials = await getCredentials();

            if (credentials) {
                // Autofill and submit the form
                usernameField.value = credentials.username;
                passwordField.value = credentials.password;

                setInterval(() => {
                    if (loginButton) {
                        loginButton.click();
                        console.log('Autologin attempted');
                    }
                }, 200);

                // Monitor URL changes to handle the "Accept" button
                monitorUrlChange();

            } else {
                console.log("Waiting for credentials");
                // Capture credentials when the form is submitted
                const form = usernameField.closest('form');
                if (form) {
                    form.addEventListener('submit', (event) => {
                        const username = usernameField.value;
                        const password = passwordField.value;

                        // Store credentials securely in IndexedDB
                        storeCredentials(username, password);

                        // Monitor URL changes to handle the "Accept" button
                        monitorUrlChange();
                    });
                }
            }
        } else {
            console.log('Login form not found on idp.uaic.ro');

            // If no login form is found, check for the "Accept" button directly
            const acceptButton = document.querySelector('input[type="submit"][value="Accept"]');
            if (acceptButton) {
                console.log('Accept button found');
                acceptButton.click(); // Click the "Accept" button
            } else {
                console.log('Accept button not found');
            }
        }
    };

    // Function to monitor URL changes and handle the "Accept" button
    const monitorUrlChange = () => {
        let previousUrl = window.location.href;

        // Observe URL changes
        const observer = new MutationObserver(() => {
            if (window.location.href !== previousUrl) {
                previousUrl = window.location.href;
                console.log('URL changed to:', previousUrl);

                // Check for the "Accept" button
                const acceptButton = document.querySelector('input[type="submit"][value="Accept"]');
                if (acceptButton) {
                    console.log('Accept button found');
                    acceptButton.click(); // Click the "Accept" button
                }
            }
        });

        // Start observing the document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Check if the current URL is idp.uaic.ro
    if (window.location.hostname === 'idp.uaic.ro' || window.location.hostname === 'idp3-stud.uaic.ro') {
        handleAutologin();
    }

})();
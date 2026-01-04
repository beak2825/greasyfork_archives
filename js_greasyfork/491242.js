document.addEventListener('DOMContentLoaded', function () {
    function createElementWithContent() {
        var homeElement = document.createElement('section');

        homeElement.classList.add('bodyHome');

        homeElement.setAttribute('id', 'bodyHome');

        homeElement.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" width="0" height="0">
    <defs>
        <filter id="header-image-border" x="0" y="0">
            <feImage xlink:href="https://i.ibb.co/860vTZn/360-F-309301133-Fe-VFk-Jxwrg-Zmj-SWQ0-HWEu1n-F3l6-ZMCq50.jpg" result="borderPattern" preserveAspectRatio="xMidYMid slice" />
            <feMorphology operator="dilate" radius="50%" % in="SourceAlpha" result="expandedOutline" />
            <feMorphology operator="dilate" radius="25px" in="expandedOutline" result="softenedOutline" />
            <feComposite operator="in" in="borderPattern" in2="softenedOutline" result="borderWithPattern" />
            <feGaussianBlur in="borderWithPattern" stdDeviation="0.25" result="softBorder" />
            <feComposite operator="over" in="softBorder" in2="SourceGraphic" />
        </filter>
        <filter id="text-image-border" x="0" y="0">
            <feImage xlink:href="https://i.ibb.co/dtgjpLb/360-F-309301133-Fe-VFk-Jxwrg-Zmj-SWQ0-HWEu1n-F3l6-ZMCq5999.jpg" result="borderPattern" preserveAspectRatio="xMidYMid slice" />
            <feMorphology operator="dilate" radius="50%" in="SourceAlpha" result="expandedOutline" />
            <feMorphology operator="dilate" radius="25px" in="expandedOutline" result="softenedOutline" />
            <feComposite operator="in" in="borderPattern" in2="softenedOutline" result="borderWithPattern" />
            <feGaussianBlur in="borderWithPattern" stdDeviation="0.25" result="softBorder" />
            <feComposite operator="over" in="softBorder" in2="SourceGraphic" />
        </filter>
    </defs>
</svg>
<nav class="navbar NAV" id="navbar">
    <div class="header NAV" id="header">
        <middle id="middle" class="middle NAV">
            <h1><a id="donationTransfer" class="donationTransfer"> Donation Transfer </a></h1>
        </middle>
        <left id="left" class="left NAV">
            <i><img class="logo" id="logo" alt="logo" src="https://i.ibb.co/sgq9xJd/Screenshot-114.png" style="width:50px;height:50px;position:relative;display:inline;top:0;left:0;" onclick="toggleMenu()" /></i>
            <content class="menu hidden" id="menu">
                <a id="FaHome" href="./home.html">
                    <i class="fas fa-home" data-type="menu" id="index">
                        <b>Home</b>
                    </i>
                </a>
                <a id="FaUser" onclick="toggleSubmenu()">
                    <i class="fas fa-user" data-type="menu" id="user">
                        <b>Account</b>
                    </i>
                </a>
                <content class="submenu hidden" id="submenu">
                    <a id="FaAccount" href="./hidden/account.html">
                        <i class="fas fa-user" data-type="submenu" id=account>
                            <b class="authenticated">My Account</b>
                        </i>
                    </a>
                    <a id="FaBank" href="./hidden/bank.html">
                        <i class="fas fa-circle-dollar-to-slot" data-type="submenu" id=bank>
                            <b class="authenticated">bank</b>
                        </i>
                    </a>
                    <a id="FaFoundations" href="./hidden/foundations.html">
                        <i class="fas fa-ribbon" data-type="submenu" id="foundations">
                            <b class="authenticated">Foundations</b>
                        </i>
                    </a>
                    <a id="FaDonate" href="./hidden/donate.html">
                        <i class="fas fa-heart" data-type="submenu" id="donate">
                            <b class="authenticated">Donate</b>
                        </i>
                    </a>
                    <a id="FaLogout" onclick="logout()">
                        <i class="fas fa-right-from-bracket" data-type="submenu" id="logout">
                            <b class="authenticated">Logout</b>
                        </i>
                    </a>
                </content>
                <a id="FaAbout" href="./about.html">
                    <i class="fas fa-phone" data-type="menu" id="about">
                        <b>About</b>
                    </i>
                </a>
            </content>
        </left>
        <right id="right" class="right NAV">
            <h1 class="login visible NAV" id="login" onclick="toggleLogin()">Login</h1>
            <form id="login-form" class="login-form hidden NAV" data-type="login">
                <h2 class="tooltip-header">LOGIN</h2>
                <a class="close-btn" onclick="closeForm()">X</a>
                <label for="email">Email:</label><br>
                <input type="email" id="email" name="loginEmail" required><br>
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="loginPassword" required><br>
                <a id="submitL" value="SUBMIT" class="submit-btn" onclick="signin()">submit</a>
            </form>
            <h1 class="register hidden NAV" id="register" data-type="register" onclick="switchForm()">Register</h1>
            <form id="register-form" class="register-form hidden NAV" data-type="register">
                <h2 class="tooltip-header">REGISTER</h2>
                <a class="close-btn" onclick="closeForm()">X</a>
                <label for="new email">Email:</label><br>
                <input type="email" id="new email" name="regEmail" required><br>
                <label for="new password">Password:</label><br>
                <input type="password" id="new password" name="regPassword" required><br>
                <label for="regConfirmPassword">Confirm Password:</label><br>
                <input type="password" id="regConfirmPassword" name="regConfirmPassword" required><br>
                <a id="submitR" value="SUBMIT" class="submit-btn" onclick="signup()">submit</a>
            </form>
        </right>
    </div>
</nav>
<section id="bodyHome" class="bodyHome">
    <div class="CT HTC" id="CT">
        <div style="position:relative; width:100%; height:0px; padding-bottom:84.375%">
            <video id="CTVideo" class="BackgroundVideo HTC" style="z-index: -1;" playsinline="" preload="auto" src="blob:https://www.flexclip.com/d5d99c9e-7140-4e4e-bf2f-6b54d5796a76"></video>
        </div>
        <table>
            <tr id="CTHeader" class="HeaderIndex HTC"><td class="HeaderIndex Content HTC"> THE TAX LABYRINTH </td></tr>
            <tr id="CTText" class="TextIndex HTC"><td class="TextIndex Content HTC">Are you ready to rewrite your financial history and unlock the potential for greater impact? Let's embark on a journey that transcends numbers and transforms lives like yours and others. Imagine this: you're navigating the labyrinth of tax brackets, inching closer to the edge of a higher tax rate. The looming specter of increased taxation threatens to erode your hard-earned income. But fear not, for there's a beacon of hope amidst the fiscal maze.</td></tr>
        </table>
    </div>
    <form class="Containers Home" id="Home">
        <table id="TC" class="FEDORA TC">
            <tbody>
                <tr id="TextTC" class="T TC">
                    <td class="Text TC">Maybe if you take 2024 tax rates and compare</td>
                </tr>
            </tbody>
        </table>
        <table id="LC" class="Containers Container LC" onclick="LC()">
            <tbody>
                <tr id="HeaderLC" class="H LC">
                    <td class="Header LC">Canada :</td>
                </tr>
                <tr id="TextLC" class="T LC">
                    <td class="Text LC 1">15% for incomes over $15,705,00</td>
                    <td class="Text LC 2">20.5% for incomes over $53,359.01</td>
                    <td class="Text LC 3">26% for incomes over $106,717.01</td>
                    <td class="Text LC 4">29% for incomes over $165,430.01</td>
                    <td class="Text LC 5">33% for incomes over $235,675.01</td>
                </tr>
            </tbody>
        </table>
        <table class="Containers Container C">
            <tbody>
                <tr id="TexTC" class="T C">
                    <td class="Text C">It's easy to find all these information through a simple Google research. Just type: inflation adjustments for tax with the year, the desired country and here you go!</td>
                </tr>
            </tbody>
        </table>
        <div id="L" class="Containers IMGContainer L">
            <img src="https://i.ibb.co/98GJyCc/1000-F-187611011-Uu1v782-KTeq-BX5-OJdp-Ckw-PK0-GPufh-Vo2.jpg" height="26" width="32vw" alt="IMGL" class="IMG L" id="IMGL"></img>
        </div>
        <table id="RC" class="Containers Container RC" onclick="RC()">
            <tbody>
                <tr id="HeaderRC" class="H RC">
                    <td class="Header RC">U.S.A. :</td>
                </tr>
                <tr class="Text RC">
                    <td class="Text RC 1">12% for incomes over $11,600.00</td>
                    <td class="Text RC 2">22% for incomes over $47,150.00</td>
                    <td class="Text RC 3">24% for incomes over $100,525.00</td>
                    <td class="Text RC 4">32% for incomes over $191,950.00</td>
                    <td class="Text RC 5">35% for incomes over $243,725.00</td>
                </tr>
            </tbody>
        </table>
        <div id="R" class="Containers IMGContainer R">
            <img src="https://i.ibb.co/NShP6zj/800x600-donation-i-Stock-1199796265.jpg" height="26" width="32vw" alt="IMGR" class="IMG R" id="IMGR"></img>
        </div>
        <table id="CB" class="Containers Container CB" onclick="CB()">
            <tbody>
                <tr id="HeaderCB" class="H CB" onclick="toggleLogin()" onabort="toggleRegister()">
                    <td class="Header CB">Donate with ease</td>
                </tr>
                <tr id="TextCB" class="T CB">
                    <td class="Text CB hover-effect">Now that we've got a little bit more into it, most of you already have their mindset and knows what they are gonna do out of that fructifiable knowledge. If you don't already have yourself to understand properly think about this : Let's say you made a little bit over $106,717.01, so you are gonna pay 26% tax in Canada but, if instead you find a way to save 5,5% in tax just by lowering your income to 106,717.00 with a simple donation. By giving a certain amount to any foundation, the given amount is reduced from your income. With plenty others benefits from giving, you might save money depending on your yearly incoming taxable amount. The website has just been launched, and we've uncovered an intriguing strategy that could potentially save you money. Did you know that you can make donations using undeclared income? By directing your gift through the bank, you could potentially reduce your taxable income without spending declared earnings. It's a clever way to maximize your impact while also benefiting from potential tax savings. Imagine the possibilities when your financial decisions align with your desire to make a difference.</td>
                </tr>
            </tbody>
        </table>
    </form>
</section>
<section class="sidebar">
    <div class="Foot">
        <div class="brand M1">
            <span>
                <text class="brand-text"><span>P</span><span>A</span><span>Y</span><span>P</span><span>A</span><span>L</span></text>
                <i class="fa-brands fa-paypal"></i>
            </span>
        </div>
        <div class="brand M2">
            <span>
                <text class="brand-text"><span>T</span><span>E</span><span>L</span><span>E</span><span>G</span><span>R</span><span>A</span><span>M</span></text>
                <i class="fa-brands fa-telegram"></i>
            </span>
        </div>
        <div class="brand M3">
            <span>
                <text class="brand-text"><span>G</span><span>O</span><span>O</span><span>G</span><span>L</span><span>E</span></text>
                <i class="fa-brands fa-google"></i>
            </span>
        </div>
        <div class="brand M4">
            <span>
                <text class="brand-text"><span>T</span><span>W</span><span>I</span><span>T</span><span>T</span><span>E</span><span>R</span></text>
                <i class="fa-brands fa-twitter"></i>
            </span>
        </div>
        <div class="brand M5">
            <span>
                <text class="brand-text"><span>F</span><span>A</span><span>C</span><span>E</span><span>B</span><span>O</span><span>O</span><span>K</span></text>
                <i class="fa-brands fa-facebook"></i>
            </span>
        </div>
        <div class="brand M6">
            <span>
                <text class="brand-text"><span>D</span><span>I</span><span>S</span><span>C</span><span>O</span><span>R</span><span>D</span></text>
                <i class="fa-brands fa-discord"></i>
            </span>
        </div>
        <div class="brand M7">
            <span>
                <text class="brand-text"><span>L</span><span>I</span><span>N</span><span>K</span><span>E</span><span>D</span><span>I</span><span>N</span></text>
                <i class="fa-brands fa-linkedin"></i>
            </span>
        </div>
        <div class="brand M8">
            <span>
                <text class="brand-text"><span>A</span><span>P</span><span>P</span><span>L</span><span>E</span></text>
                <i class="fa-brands fa-apple"></i>
            </span>
        </div>
        <div class="brand M9">
            <span>
                <text class="brand-text"><span>M</span><span>I</span><span>C</span><span>R</span><span>O</span><span>S</span><span>O</span><span>F</span><span>T</span></text>
                <i class="fa-brands fa-microsoft"></i>
            </span>
        </div>
    </div>
</section>
        `;

        document.body.appendChild(homeElement);
    }

    createElementWithContent();
});
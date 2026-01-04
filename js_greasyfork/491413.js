document.addEventListener('DOMContentLoaded', function () {
    function createElementNavbar() {
        var navbarElement = document.createElement('nav');

        navbarElement.classList.add('navbar', 'NAV');

        navbarElement.setAttribute('id', 'navbar');

        navbarElement.innerHTML = `
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
        `;

        document.body.appendChild(navbarElement);
    }

    createElementNavbar();
});
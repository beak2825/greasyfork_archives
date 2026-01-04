function toggleMenu() {
    var menu = document.getElementById("menu");
    var header = document.getElementById("navbar");
    var rHidden = document.getElementById("register-form").classList.contains('hidden');
    var lHidden = document.getElementById("login-form").classList.contains('hidden');
    var mHidden = menu.classList.contains('hidden');
    var mVisible = menu.classList.contains('visible');
    var hActive = header.classList.contains('active');

    if (mHidden && !hActive) {
        menu.classList.toggle('visible');
        menu.classList.toggle('hidden');
        header.classList.toggle('active');
    } else {
        menu.classList.toggle('visible');
        menu.classList.toggle('hidden');
    }
    if (mVisible && lHidden && rHidden) {
        header.classList.toggle('active');
    }
}

function toggleSubmenu() {
    var submenu = document.getElementById("submenu");
    var menu = document.getElementById("menu");
    submenu.classList.toggle('visible');
    submenu.classList.toggle('hidden');
    event.stopPropagation();
    menu.classList.remove('hidden');
    menu.classList.add('visible');
}

function toggleLogin() {
    var forml = document.getElementById("login-form");
    var formr = document.getElementById("register-form");
    var header = document.getElementById("navbar");
    var right = document.getElementById("right");
    var h1r = document.getElementById("register");
    var h1l = document.getElementById("login");


    if (forml.classList.contains('hidden') &&
        h1l.classList.contains('visible')) {
        forml.classList.remove('hidden');
        forml.classList.add('visible')
        formr.classList.remove('visible');
        formr.classList.add('hidden');
        h1l.classList.remove('visible');
        h1l.classList.add('hidden');
        h1r.classList.remove('hidden');
        h1r.classList.add('visible');
        header.classList.add('active');
        right.classList.add('active');
    } else {
        forml.classList.remove('visible');
        forml.classList.add('hidden');
        formr.classList.remove('hidden');
        formr.classList.add('visible');
        h1l.classList.remove('hidden');
        h1l.classList.add('visible');
        h1r.classList.remove('visible');
        h1r.classList.add('hidden');
        return;
    }
}

function switchForm() {
    var forml = document.getElementById("login-form");
    var formr = document.getElementById("register-form");
    var h1r = document.getElementById("register");
    var h1l = document.getElementById("login");
    if (forml.classList.contains('visible')) {
        formr.classList.remove('hidden');
        formr.classList.add('visible');
        forml.classList.remove('visible');
        forml.classList.add('hidden');
        h1l.classList.remove('hidden');
        h1l.classList.add('visible');
        h1r.classList.remove('visible');
        h1r.classList.add('hidden');
    } else {
        formr.classList.remove('visible');
        formr.classList.add('hidden');
        forml.classList.remove('hidden');
        forml.classList.add('visible');
        h1r.classList.remove('hidden');
        h1r.classList.add('visible');
        h1l.classList.remove('visible');
        h1l.classList.add('hidden');
    }
}

function closeForm() {
    document.getElementById("login-form").classList.remove('visible');
    document.getElementById("login-form").classList.add('hidden');
    document.getElementById("login").classList.remove('hidden');
    document.getElementById("login").classList.add('visible');
    document.getElementById("register-form").classList.remove('visible');
    document.getElementById("register-form").classList.add('hidden');
    document.getElementById("register").classList.remove('visible');
    document.getElementById("register").classList.add('hidden');
    if (document.getElementById("menu").classList.contains('hidden')) {
        document.getElementById("navbar").classList.remove('active');
        document.getElementById("right").classList.remove('active');
    }
}

function headerCloseForm() {
    var forml = document.getElementById("login-form");
    var h1l = document.getElementById("login");
    var formr = document.getElementById("register-form");
    var h1r = document.getElementById("register");
    var menu = document.getElementById("menu");
    var submenu = document.getElementById("submenu");
    var header = document.getElementById("navbar");
    if (forml.classList.contains('visible')) {
        forml.classList.remove('visible');
        forml.classList.add('hidden');
        h1l.classList.remove('hidden');
        h1l.classList.add('visible');
        h1r.classList.remove('visible');
        h1r.classList.add('hidden');
    }
    if (formr.classList.contains('visible')) {
        formr.classList.remove('visible');
        formr.classList.add('hidden');
        h1r.classList.remove('visible');
        h1r.classList.add('hidden');
    }
    if (menu.classList.contains('visible')) {
        menu.classList.remove('visible');
        menu.classList.add('hidden');
        header.classList.remove('active');
    }
    if (submenu.classList.contains('visible')) {
        submenu.classList.remove('visible');
        submenu.classList.add('hidden');
    }
    if (menu.classList.contains('hidden') && forml.classList.contains('hidden') && formr.classList.contains('hidden')) {
        header.classList.remove('active');
    }
}
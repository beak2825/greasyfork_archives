// ==UserScript==
// @name Qmágico simple dark theme
// @namespace https://github.com/sirmonteiro
// @version 0.1.0
// @description Simple dark theme for Qmágico
// @description:pt-BR Tema dark para o Qmágico
// @author SirMonteiro
// @icon https://i.imgur.com/nRlHbTx.png
// @match https://*.qmagico.com.br/*
// @grant GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/423436/Qm%C3%A1gico%20simple%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/423436/Qm%C3%A1gico%20simple%20dark%20theme.meta.js
// ==/UserScript==
GM.addStyle(`
body, .qm-content, .main-content-background, .landing-img-background, .exam-exhibition-content {
    background: #181818 !important;
}

a {
  text-shadow: none !important;
}

#taskbar, .panel-heading {
  background: #202020 !important;
}

#taskbar {
  box-shadow: none !important  
}

.panel-heading a:hover, .nav-item.selected, .panel-heading-title, .landing-content .content-block p {
  color: #fff !important;
}

.landing-box-content-avatar{
  margin-top: 16px;
}

.empty-case-text{
  margin-bottom: 32px;
}

.profile-box-empty-case{
  justify-content: center !important;
  padding-top: 32px !important;
}

.my-profile-footer, .sidebar-content-footer, .landing-footer-text, .landing-box-logo, .my-profile-header, .empty-case-illustration{
  display: none !important;
}
`)

window.addEventListener('load', function() {
    if (location.pathname == '/perfil') {
        document.getElementsByClassName('profile-box')[1].style.display = 'none'
        document.getElementsByClassName('profile-box')[4].style.display = 'none'
        document.getElementsByClassName('profile-box')[5].style.display = 'none'
    }

    document.getElementById('header-organization-name').innerHTML = document.getElementsByClassName('profile-role')[0].innerText
    document.getElementsByClassName('taskbar-brand-logo')[0].children[0].src = 'https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/3cfbcdaff9818c3e2c07d755d556fe1f34d7cf0d/white/svg/home.svg'
})
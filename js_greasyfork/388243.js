// ==UserScript==
// @name Új Világ felület optimalizáló
// @description Az ÜEF életének megkönnyítéséért
// @author Antók Benedek Solt
// @namespace antokben.hu
// @version 0.9
// @match https://central*.fair.gov.hu/*
// @match https://eupr*.fair.gov.hu/*
// @match https://sso*.fair.gov.hu/eif/*
// @match https://sso*.fair.gov.hu/index.xhtml?r=*
// @match https://nemzetihelpdesk.palyazat.gov.hu/*
// @match https://redmine.ujvilag.gov.hu/*
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/388243/%C3%9Aj%20Vil%C3%A1g%20fel%C3%BClet%20optimaliz%C3%A1l%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/388243/%C3%9Aj%20Vil%C3%A1g%20fel%C3%BClet%20optimaliz%C3%A1l%C3%B3.meta.js
// ==/UserScript==

const redmine = (szelesseg, betumeret, kozepre) => {
  GM_addStyle(`
    body {
      font-size: ${betumeret}px !important;
    }

    h4 {font-size: calc(${betumeret}px + 1px) !important;}
  `);
  
  if (kozepre) {
    GM_addStyle(`
      @media screen and (min-width: ${szelesseg}px) {
        #wrapper2 {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }dfg

        #wrapper3 {
          max-width: ${szelesseg} !important;
        }
      }
    `);
  }
};

const red_auto_belepteto = () => {
  const loginSubmit = document.getElementById('login-submit');
  const flashError = document.getElementById('flash_error');
  if (loginSubmit !== null && flashError === null) {
    setTimeout(() => {loginSubmit.click();}, 1000*0.5);
  }
};

const fair_betumeret = (betumeret) => {  
  GM_addStyle(`.content, .form-head, .breadcrumb {font-size: ${betumeret}px !important;}`);
};

const fair_auto_ujra_belep = () =>{
  const hibauzenet = document.getElementsByClassName('alert')[0];
  if (hibauzenet !== undefined && hibauzenet.textContent === '×Hiba!Unable to resolve the request "fair/index".') {
    const hrefSearch =  window.location.href.match(/^https:\/\/(?:central|eupr)-(\w*)\.fair\.gov\.hu\/(.*)$/);
    window.location.href = `https://sso-${hrefSearch[1]}.fair.gov.hu/index.xhtml?r=${encodeURIComponent(hrefSearch[0])}`;
  }
};

const fair_kereso_nyitva = () => {
  const elemGroups = [
    {className: 'container_bstrap', display: 'block'},
    {className: 'form-actions', display:'table'}
  ];

  for (i = 0; i < elemGroups.length; i++) {
    const elements = document.getElementsByClassName(elemGroups[i].className);
    for (j = 0; j < elements.length; j++) {
      elements[j].style.display = elemGroups[i].display;
    }
  }
};

const central_sablon_id_megjegyez = () => {  
  const mjMezoNevek = ['DOCUMENT_TEMPLATE_arguments_ID_VALUE', 'DOCUMENT_TEMPLATE_arguments_ID_SZERZODES'];
  let idInput = null;
  for (i = 0; i < mjMezoNevek.length; i++) {
    idInput = document.getElementById(mjMezoNevek[i]);
    if (idInput !== null) {
      idInput.value = sessionStorage.getItem('idValue');
      break;
    }
  }
  const sablonForm = document.getElementById('uj-sablon-form');
  const saveIdValue = () => {
    sessionStorage.setItem('idValue', idInput.value);
  };
  if (sablonForm !== null) {
    sablonForm.addEventListener("submit", saveIdValue, false);
  }
};

const fair_auto_belepteto = () => {
  if (
    window.location.href.match(/^https:\/\/sso.*\.fair\.gov\.hu\/(?:eif\/|index\.xhtml\?r=).*$/) &&
    document.getElementById('warning').childNodes.length === 0
  ) {
    setTimeout(() => {
      const loginGombok = ['LoginBox:Login', 'userLoginForm:j_idt81'];
      let i = 0;
      let e = null;
      while (e === null && i < loginGombok.length) {
        e = document.getElementById(loginGombok[i]);
        i++;
      }
      document.body.click();
      if (e !== null) {
        e.click();
        document.body.style.backgroundColor = '#DDFFCC';
      };
    }, 0.7*1000);
  }

  if (
    window.location.href.match(/^https:\/\/(?:nemzeti)?helpdesk\.palyazat\.gov\.hu\/.*$/) &&
    document.referrer
  ) {
    const elsoGomb = document.getElementsByClassName('mainmenuitem')[0];
    const ssoKellP = document.querySelector('div.well > p:nth-child(3)');
    if (elsoGomb !== undefined && elsoGomb.childNodes[0].textContent === 'Bejelentkezés') {
      sessionStorage.setItem('visszater', document.referrer);
      const nemz =  window.location.href.match(/^https:\/\/(nemzeti)?helpdesk\.palyazat\.gov\.hu\/.*$/)[1];
      window.location.href = `https://sso.fair.gov.hu/index.xhtml?r=https%3A//${nemz}helpdesk.palyazat.gov.hu/ssofair/`;
    }
    if (ssoKellP !== null) {
      document.getElementById('mm0').children[0].click();
    }
  }
  if ( 
    window.location.href.match(/^https:\/\/(?:nemzeti)?helpdesk\.palyazat\.gov\.hu\/$/) &&
    sessionStorage.getItem('visszater')
  ) {
    const ide = sessionStorage.getItem('visszater');
    sessionStorage.setItem('visszater', '');
    window.location.href = ide;
  }
};

const fair_auto_megujitas = (x) => {
  const megujitoGomb = document.getElementsByClassName('logoutcountdownrenew')[0];
  if (megujitoGomb !== undefined) {
    setInterval(() => {megujitoGomb.click();}, 1000*60*x);
  }
};

const fair_eles_piros = () => {
  if (window.location.href.match(/^https:\/\/central\.fair\.gov\.hu\/.*$/)) {
    const headerContainer = document.getElementsByClassName('header-container')[0];
    if (headerContainer !== undefined) {
      headerContainer.style.backgroundImage = 'linear-gradient(to right, #ed3833, #6da7d1, #6da7d1, #6da7d1)';
    }
    const breadcrumb = document.getElementsByClassName('breadcrumb');
    for (i = 0; i < breadcrumb.length; i++) {
      if (breadcrumb[i] !== undefined) {
        breadcrumb[i].style.backgroundColor = '#bd0803';
      }
    }
  }
};

const central_jobb_panel_zarva = () => {
  const toggler = document.getElementsByClassName('ui-layout-toggler-east-open')[0];
  if (toggler !== undefined) {
    toggler.click();
  }
};

const central_sql_kivalasztva = () => {
  const queryType = document.getElementById('DOCUMENT_TEMPLATE_QUERY_QUERY_TYPE');
  if (queryType !== null) {
    queryType.selectedIndex = 1;
  }
};

/* ---------------------
        Beállítások
   --------------------- */

GM_config.init({
  'id': 'beallitasok',
  'title': 'ÚV felület optimalizáló',
  'fields':
  {
    'red_auto_belepteto': {
      'section': ['Redmine'],
      'label': 'Léptessen be automatikusan Redmineba',
      'type': 'checkbox',
      'default': true
    },
    'red_betumeret': {
      'label': 'Betűméret (px)',
      'type': 'int',
      'default': 12
    },
    'red_kozep': {
      'label': 'Redmine középre igazítása',
      'type': 'checkbox',
      'default': true
    },
    'red_maxwidth': {
      'label': 'Maximum oldalszélesség (px)',
      'type': 'int',
      'default': 1300
    },
    'fair_betumeret': {
      'section': ['FAIR'],
      'label': 'Betűméret (px)',
      'type': 'int',
      'default': 12
    },
    'fair_auto_belepteto': {
      'label': '[kísérleti] Léptessen be automatikusan SSO-ba',
      'type': 'checkbox',
      'default': false
    },
    'fair_auto_ujra_belep': {
      'label': '[kísérleti] Ha kidob a rendszer, jelentkezzen be újra magától',
      'type': 'checkbox',
      'default': false
    },
    'fair_auto_megujitas': {
      'label': 'Újítsa meg a bejelentkezést...',
      'type': 'checkbox',
      'default': true
    },
    'fair_auto_megujitas_ido': {
      'label': '...ennyi percenként',
      'type': 'int',
      'default': 5
    },
    'fair_kereso_nyitva': {
      'label': 'Már betöltéskor legyenek nyitva a keresősávok',
      'type': 'checkbox',
      'default': true
    },
    'fair_eles_piros': {
      'label': 'Az éles környezet fejléce legyen piros',
      'type': 'checkbox',
      'default': true
    },
    'central_jobb_panel_zarva': {
      'section': ['Central'],
      'label': '[kísérleti] Záródjon be a jobb panel az oldal betöltésekor',
      'type': 'checkbox',
      'default': false
    },
    'central_sql_kivalasztva': {
      'label': 'Új paraméter felvételénél automatikusan válassza ki az SQL-t, mint típust',
      'type': 'checkbox',
      'default': true
    },
    'central_sablon_id_megjegyez': {
      'label': 'A sablon előnézet jegyezze meg az azonosító számot',
      'type': 'checkbox',
      'default': true
    },
  }
});

GM_registerMenuCommand('Beállítások', () => {
  GM_config.open()
})


if (document.location.href.match(/^https:\/\/redmine\.ujvilag\.gov\.hu\/.*$/)) {
  redmine(
    GM_config.get('red_maxwidth'),
    GM_config.get('red_betumeret'),
    GM_config.get('red_kozep')
  );
  GM_config.get('red_auto_belepteto') && red_auto_belepteto();
}

if (window.location.href.match(/^https:\/\/(?:central|eupr).*\.fair\.gov\.hu\/.*$/)) {
  fair_betumeret(GM_config.get('fair_betumeret'));
  GM_config.get('fair_auto_megujitas') && fair_auto_megujitas(GM_config.get('fair_auto_megujitas_ido'));
  GM_config.get('fair_eles_piros') && fair_eles_piros();
  GM_config.get('fair_kereso_nyitva') && fair_kereso_nyitva();
  GM_config.get('fair_auto_ujra_belep') && fair_auto_ujra_belep();
}

GM_config.get('fair_auto_belepteto') && fair_auto_belepteto();

if (window.location.href.match(/^https:\/\/central.*\.fair\.gov\.hu\/.*$/)) {
  GM_config.get('central_jobb_panel_zarva') && central_jobb_panel_zarva();
  GM_config.get('central_sql_kivalasztva') && central_sql_kivalasztva();
  GM_config.get('central_sablon_id_megjegyez') && fair_sablon_id_megjegyez();
}
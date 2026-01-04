// ==UserScript==
// @name         Просвіта 17
// @namespace    http://www.svk.pp.ua/
// @version      2.1
// @description  Покращення електронного журналу Просвіта для більш зручного користування вчителем.
// @author       serhiiku
// @match        https://dashboard.prosvita.net/company/1427/journal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457257/%D0%9F%D1%80%D0%BE%D1%81%D0%B2%D1%96%D1%82%D0%B0%2017.user.js
// @updateURL https://update.greasyfork.org/scripts/457257/%D0%9F%D1%80%D0%BE%D1%81%D0%B2%D1%96%D1%82%D0%B0%2017.meta.js
// ==/UserScript==

(function() {
    'use strict';

var checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'skorocheno';
checkbox.name = 'skorocheno';
checkbox.value = 'yes';


var label = document.createElement('label')
label.htmlFor = 'skorocheno';
label.appendChild(document.createTextNode('скорочено'));

//var br = document.createElement('br');

var container = document.querySelector('div.b-journal-students > header');
container.appendChild(checkbox);
container.appendChild(label);
//	container.appendChild(br);

var p17style0 = document.createElement('style');
  p17style0.innerHTML = `
.b-journal-students > header > h2 {
	width: 60% !important;
}

input#skorocheno {

  background-color: #fff;
  margin: 0;
  font: inherit;
  color: #445877;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
}

input#skorocheno + label {
	font-family: Open Sans;
	color: #445877;
	font-size: 16px;
    line-height: 28px;
    margin-left: 0.5em;
    vertical-align: 3px;

}

.journal-filters-table {
  padding: 0 18px;
  display: block;
  overflow: hidden;
}

div#content {
    padding-bottom: 0px !important;
}

.journal-table table tr:hover {
	background-color: lightyellow;

}

tr:hover input{
	background-color: lightyellow;
}

.b-journal-students {
     margin-bottom: 1px !important;
}

  `;
  document.head.appendChild(p17style0);


const chb = document.getElementById('skorocheno')

chb.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {


        var jdates = document.querySelectorAll('.text-journal-header-date span');
        //text-journal-header-date
//        alert(jdates);
//        const jdates2 = jdates
         for (var i=0; i<jdates.length; i++) {
            jdates[i].textContent = jdates[i].textContent.slice(0, 5);
         }

        var stnames = document.querySelectorAll('td.e-journal-student-active:not(.journal-student-index)');
        //text-journal-header-date
         for (var i=0; i<stnames.length; i++) {
            stnames[i].textContent = stnames[i].textContent.slice(53, 63);
         }

        var x = document.querySelectorAll("row-assignment-type-selector");
         for (var i=0; i<x.length; i++) {
        	x[i].removeAttribute('style');
//        	x[i].style.top = '30px !important';
         }
          var p17style = document.createElement('style');
  p17style.innerHTML = `
  .journal-filters-table {
	 display: none;
  }
  .journal-table > td {
	 height: 0px;
     border: 1px !important;
     border:solid !important;
     border: #445877 !important;
  }
  .journal-table > .table > th {
     border: 1px;
     border: solid;
     border: #445877;
  }
    .journal-action-buttons {
     display:none;
   }

    .row-assignment-buttons {
     display:none;
   }

   #journal_form .journal-table .row-assignment-type-selector > td {
	top:30px !important;
   }

   #journal_form .journal-table .row-assignment-type-selector > th {
    top: 30px !important;
   }

   .widget-body-toolbar.b-db-fast-form {
    display:none;
   }

    .widget-body-toolbar {
    padding:0px;
         }

    .widget-body-toolbar {
    min-height:0px;
   }

    .journal-table .table-condensed > thead > tr > th.journal-col {
    min-width:0px;
        }

   .journal-table .table-condensed > thead > tr > th {
    padding:0px;
        }

   .journal-table td {
    height:0px;
        }

   .text-journal-header-date {
    margin:6px;
   }



    .row-assignment-type-selector {
     top:30px !important;
    }

    .journal-table .table-condensed > thead > tr > th.journal-col {
    min-width:60px !important;
    }

   .journal-col-center {
    width: 120px;
         }

.journal-table table > tbody > tr > td:not(:nth-child(-n+2)), .journal-table table > thead > tr > th:not(:nth-child(-n+1)) {
    width: 70px !important;
}

.student-header-cell {
    min-width: 100px !important;
}

.journal-table table > tbody > tr > td:nth-child(2) {
    width: 50px !important;
}

    @media only screen and (min-width:200px) {
    .journal-table table > tbody > tr > td:nth-child(1) {
        position: sticky;
        background-color: #F9F9F9;
        left: 0;
        border-left: none !important;
        z-index: 99;
    }

    .journal-table table > thead > tr > td:first-child {
        position: sticky !important;
        left: 0;
        z-index: 101;
    }

    .journal-table table > thead > tr > td:nth-child(2) {
        position: sticky;
        left: 38px;
        z-index: 101;
    }

    .journal-table table > tbody > tr > td:nth-child(2) {
        position: sticky;
        background-color: #F9F9F9;
        left: 38px;
        border-left: none !important;
        z-index: 99;
    }

    .journal-table table > thead > tr > th,
    .journal-table table > thead > tr > td {
        position: sticky;
        top: 0;
        background-image: -webkit-linear-gradient(top, #F2F2F2 0, #FAFAFA 100%);
        z-index: 100;
    }
}

.b-journal-students {
     margin-bottom: 1px !important;
}

.jarviswidget {
    margin: 0 !important;
}

.journal-table .e-grade-cell > .e-grade-comment-btn {
	left: 0px;
	top: 0px;
	padding: 0px;
}

.e-grade-cell input {
	padding-left: 25px !important;
}
.btn btn-default e-grade-comment-btn {
	padding: 6px 4px;
}

  `;
  document.head.appendChild(p17style);


  } else {

  	document.location.reload()

  }
})



})();
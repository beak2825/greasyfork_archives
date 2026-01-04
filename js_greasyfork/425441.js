// ==UserScript==
// @name         TQC лицензия 
// @description   +СПБ
// @version      0.1
// @author       You
// @match        https://taxiqc.ru/inspections/*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/425441/TQC%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425441/TQC%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F.meta.js
// ==/UserScript==

setTimeout(()=> {
    //const parent = document.querySelector('.car-number.ng-scope')
    const parent = document.querySelector('input[ng-model="mainCtrl.inspection.car.number"]')
    //const carNumber = [...parent.children].map(el => el.textContent).join('')
    const btn = document.createElement('a')
    btn.classList.add('btn', 'btn-primary-t')
    btn.textContent = 'СПБ'
    /*btn.setAttribute('href',`http://data.gov.spb.ru/opendata/7830001067-licenses_taxi/?search_all=${carNumber}&filter_fields=&number=&name=&address=&number_of_the_authorization=&date=&period=&brand_vehicle=&model_of_vehicle=&state_license_plate_of_the_vehicle=&date_release=&permission_status=&date_of_permission_status_change=&suspension_information=&start_date_of_the_permit_validity_period=&the_end_date_of_the_permit_validity_period=&data_per_page=25&page=1`)*/
    btn.addEventListener('click', () => {
        console.log(document.querySelector('input[ng-model="mainCtrl.inspection.car.number"]').value)
        btn.setAttribute('href','')
        btn.setAttribute('href',`http://data.gov.spb.ru/opendata/7830001067-licenses_taxi/?search_all=${document.querySelector('input[ng-model="mainCtrl.inspection.car.number"]').value}&filter_fields=&number=&name=&address=&number_of_the_authorization=&date=&period=&brand_vehicle=&model_of_vehicle=&state_license_plate_of_the_vehicle=&date_release=&permission_status=&date_of_permission_status_change=&suspension_information=&start_date_of_the_permit_validity_period=&the_end_date_of_the_permit_validity_period=&data_per_page=25&page=1`)
    })
    btn.setAttribute('target', '_blank')
    parent.after(btn)
}, 5000)

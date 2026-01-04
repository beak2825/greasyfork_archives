// ==UserScript==
// @name         Auto fill forms
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.local/*
// @downloadURL https://update.greasyfork.org/scripts/375526/Auto%20fill%20forms.user.js
// @updateURL https://update.greasyfork.org/scripts/375526/Auto%20fill%20forms.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $(document).ready(function(){

        var getFormInputs = form => jQuery(form).find('input:visible, select:visible')
        var form = jQuery('form').filter((idx, form) => getFormInputs(form).length >= 3)[0]

        if(form){
            var button = document.createElement('button')
            button.style = 'position: fixed; top: 10px; left: 0; max-width: 100px; width: 100%; font-size: 12px; background-color: red; color: white; padding: 5px; border: 0 solid none;'
            button.innerText = 'Fill Form'
            button.addEventListener('click', fillForm)
            document.body.appendChild(button)
        }

        function fillForm(){
            var script = document.createElement('script');
            script.onload = function () {
                var formInputs = getFormInputs(form);

                var password = '123123'
                var firstname = faker.name.firstName()
                var lastname = faker.name.lastName()
                var customer = {
                    firstname: firstname,
                    lastname: lastname,
                    email: faker.internet.email(firstname, lastname),
                    password: password,
                    confirmation: password,
                    street: faker.address.streetAddress(),
                    city: faker.address.city(),
                    region: 54,
                    postcode: faker.address.zipCode(),
                    telephone: faker.phone.phoneNumber(),
                    cc_owner: firstname + ' ' + lastname,
                    cc_type: 'VI',
                    cc_number: '4111 1111 1111 1111',
                    cc_exp_year: '2028',
                    cc_cid: '123'
                }

                formInputs.each((idx, el) => {
                    var fieldName = el.name.toLowerCase()
                    for(var fieldKey in customer){
                        if(fieldName.includes(fieldKey)){
                            console.log(customer[fieldKey])
                            jQuery('[name="' + fieldName + '"]').val(customer[fieldKey])
                        }
                    }
                })

            };
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.js'
            document.head.appendChild(script);
        }
    });
})(jQuery);